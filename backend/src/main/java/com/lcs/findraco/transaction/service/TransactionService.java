package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.error.StaleVersionException;
import com.lcs.findraco.shared.web.PageRequests;
import com.lcs.findraco.transaction.config.SeriesProperties;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.ItemDraft;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.SeriesPattern;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionSortField;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.repository.TransactionSpecification;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.request.TransactionItemRequest;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import com.lcs.findraco.transaction.request.UpdateSeriesRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.RecurrenceDefinitionResponse;
import com.lcs.findraco.transaction.response.TransactionPermissionsResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.response.TransactionSeriesResponse;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final RecurringTransactionGenerator recurringTransactionGenerator;
    private final PlanAuthorization planAuthorization;
    private final PlanService planService;
    private final UserService userService;

    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final SeriesRegenerator seriesRegenerator;
    private final SeriesProperties seriesProperties;
    private final Clock clock;
    private final EntityManager entityManager;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryService categoryService,
            RecurringTransactionGenerator recurringTransactionGenerator,
            PlanAuthorization planAuthorization,
            PlanService planService,
            UserService userService,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            SeriesRegenerator seriesRegenerator,
            SeriesProperties seriesProperties,
            Clock clock,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.recurringTransactionGenerator = recurringTransactionGenerator;
        this.planAuthorization = planAuthorization;
        this.planService = planService;
        this.userService = userService;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.seriesRegenerator = seriesRegenerator;
        this.seriesProperties = seriesProperties;
        this.clock = clock;
        this.entityManager = entityManager;
    }

    private Plan plan(PlanContext ctx) {
        return entityManager.getReference(Plan.class, ctx.planId());
    }

    private User user(PlanContext ctx) {
        return entityManager.getReference(User.class, ctx.userId());
    }

    private static Long createdById(Transaction transaction) {
        return transaction.getCreatedBy() == null
                ? null
                : transaction.getCreatedBy().getId();
    }

    private TransactionResponse response(Transaction transaction, PlanContext ctx) {
        return TransactionResponse.from(transaction, permissions(transaction, ctx));
    }

    /** Edit and delete follow the same rule: the caller's role and, for a contributor, who created the row. */
    private TransactionPermissionsResponse permissions(Transaction transaction, PlanContext ctx) {
        boolean modify = planAuthorization.canModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        return new TransactionPermissionsResponse(modify, modify);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id, PlanContext ctx) {
        return response(load(id, ctx), ctx);
    }

    private Transaction load(Long id, PlanContext ctx) {
        return transactionRepository
                .findByIdAndPlan(id, plan(ctx))
                .orElseThrow(() -> new TransactionExceptions.TransactionNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<Transaction> findAllByPlan(PlanContext ctx) {
        return transactionRepository.findAllByPlan(plan(ctx));
    }

    @Transactional(readOnly = true)
    public Page<TransactionResponse> findAllByPlanPaged(TransactionFilter filter, PlanContext ctx) {
        TransactionSortField sortBy = filter.sortBy();
        Sort.Direction direction = PageRequests.direction(filter.sortDirection());

        List<Specification<Transaction>> specs = new ArrayList<>(List.of(
                TransactionSpecification.belongsToPlan(plan(ctx)),
                TransactionSpecification.typeEquals(filter.type()),
                TransactionSpecification.categoryInTree(filter.categoryId()),
                TransactionSpecification.hasParticipant(filter.memberId()),
                TransactionSpecification.matchesSearchTerm(filter.description()),
                TransactionSpecification.startDateFrom(filter.startDateFrom()),
                TransactionSpecification.startDateTo(filter.startDateTo()),
                TransactionSpecification.amountMin(filter.amountMin()),
                TransactionSpecification.amountMax(filter.amountMax())));

        // category / attributed-to are aggregate/association orderings the Specification owns; for those
        // the Pageable is left unsorted so the spec's ORDER BY is the only one applied. Simple property
        // sorts (startDate/endDate/amount/description) stay on the Pageable as before.
        PageRequest pageable =
                switch (sortBy) {
                    case category -> {
                        specs.add(TransactionSpecification.orderByCategoryName(direction));
                        yield PageRequest.of(filter.page(), filter.size());
                    }
                    case attributedTo -> {
                        specs.add(TransactionSpecification.orderByLargestShareParticipant(direction));
                        yield PageRequest.of(filter.page(), filter.size());
                    }
                    case startDate, endDate, amount, description ->
                        PageRequests.of(filter.page(), filter.size(), sortBy.name(), filter.sortDirection());
                };

        Page<Transaction> page = transactionRepository.findAll(Specification.allOf(specs), pageable);
        if (page.hasContent()) {
            transactionRepository.fetchParticipants(page.getContent());
            transactionRepository.fetchItems(page.getContent());
        }
        return page.map(transaction -> response(transaction, ctx));
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), ctx);
        TransactionDetails details = new TransactionDetails(
                category(dto.categoryId(), ctx),
                dto.type(),
                dto.amount(),
                dto.description(),
                dto.startDate(),
                dto.endDate(),
                dto.parcelsNumber());
        Transaction transaction = Transaction.create(new TransactionDraft(
                plan(ctx), user(ctx), details, split.mode(), split.shares(), items(dto.items(), ctx), null, null));

        return response(transactionRepository.save(transaction), ctx);
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest dto, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        claimVersion(transaction, transaction.getVersion(), dto.version());

        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), ctx);
        TransactionDetails details = new TransactionDetails(
                category(dto.categoryId(), ctx),
                dto.type(),
                dto.amount(),
                dto.description(),
                dto.startDate(),
                dto.endDate(),
                dto.parcelsNumber());
        transaction.edit(details, split.mode(), split.shares(), items(dto.items(), ctx));

        return response(transactionRepository.saveAndFlush(transaction), ctx);
    }

    /**
     * Refuses an edit of a version other than the stored one, then bumps the version at once: a change
     * to the children alone (a split, the items) must count as a change too, and a concurrent editor who
     * read the same version then fails instead of overwriting this edit.
     */
    private void claimVersion(Object root, long stored, long sent) {
        StaleVersionException.requireCurrent(stored, sent);
        entityManager.lock(root, LockModeType.PESSIMISTIC_FORCE_INCREMENT);
    }

    private Category category(Long categoryId, PlanContext ctx) {
        return categoryId != null ? categoryService.findById(categoryId, ctx) : null;
    }

    /** The split a request asks for, with its members loaded; the aggregate computes and checks the shares. */
    private record RequestedSplit(SplitMode mode, List<Share> shares) {}

    /**
     * Without participants the creator takes the whole amount. An empty list is kept as sent, so the
     * aggregate refuses it like any other split without a participant.
     */
    private RequestedSplit requestedSplit(
            List<TransactionParticipantRequest> participantInputs, SplitMode requestedSplitMode, PlanContext ctx) {
        if (participantInputs == null) {
            return new RequestedSplit(SplitMode.EQUAL, List.of(new Share(user(ctx), null)));
        }

        List<Share> shares = new ArrayList<>();
        for (TransactionParticipantRequest input : participantInputs) {
            User member = userService
                    .findById(input.memberId())
                    .filter(u -> planService.isMember(ctx.planId(), u.getId()))
                    .orElseThrow(TransactionExceptions.ParticipantNotMemberException::new);
            shares.add(new Share(member, input.shareAmount()));
        }

        boolean selfOnly = shares.size() == 1 && shares.get(0).member().getId().equals(ctx.userId());
        if (!shares.isEmpty() && !selfOnly) {
            planAuthorization.requireCanAttributeToOthers(ctx.role());
        }

        return new RequestedSplit(requestedSplitMode != null ? requestedSplitMode : SplitMode.EQUAL, shares);
    }

    private List<ItemDraft> items(List<TransactionItemRequest> itemInputs, PlanContext ctx) {
        if (itemInputs == null) {
            return List.of();
        }
        return itemInputs.stream()
                .map(input -> new ItemDraft(
                        input.description(), input.amount(), input.quantity(), category(input.categoryId(), ctx)))
                .toList();
    }

    @Transactional
    public void delete(Long id, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        transactionRepository.delete(transaction);
    }

    @Transactional
    public TransactionSeriesResponse createSeries(CreateSeriesRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), ctx);
        RecurrenceDefinition definition =
                recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                        plan(ctx),
                        user(ctx),
                        category(dto.categoryId(), ctx),
                        dto.type(),
                        dto.amount(),
                        dto.description(),
                        dto.mode(),
                        dto.interval(),
                        dto.parcelsNumber(),
                        dto.currentParcel(),
                        dto.startDate(),
                        dto.endDate(),
                        split.mode(),
                        split.shares())));

        List<Transaction> occurrences = recurringTransactionGenerator.generate(dto, definition, split.shares());
        if (dto.mode() == RecurrenceMode.RECURRING && !occurrences.isEmpty()) {
            definition.markGeneratedThrough(occurrences.getLast().getStartDate());
        }
        if (definition.getMode() == RecurrenceMode.RECURRING && definition.getEndDate() == null) {
            coverOpenEndedSeries(definition);
        }

        return TransactionSeriesResponse.from(
                transactionRepository.saveAll(occurrences), transaction -> permissions(transaction, ctx));
    }

    /**
     * A series just generated to the horizon joins the plan, so the plan's mark cannot claim more than
     * the horizon: a read past it extends the new series too.
     */
    private void coverOpenEndedSeries(RecurrenceDefinition definition) {
        definition.getPlan().lowerSeriesGeneratedUntil(seriesProperties.horizonFrom(LocalDate.now(clock)));
    }

    @Transactional
    public void deleteSeries(String seriesId, SeriesEditScope scope, Long pivotOccurrenceId, PlanContext ctx) {
        // Lock the definition before reading the occurrences, as the top-up does, so a concurrent top-up
        // cannot add occurrences to a series that is being deleted. A series with no definition has no lock.
        RecurrenceDefinition definition = recurrenceDefinitionRepository
                .findByPlanAndSeriesIdForUpdate(plan(ctx), seriesId)
                .orElse(null);
        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan(ctx), seriesId);

        if (occurrences.isEmpty()) {
            throw new TransactionExceptions.TransactionSeriesNotFoundException(seriesId);
        }

        Transaction pivot = null;
        if (scope != SeriesEditScope.ALL) {
            pivot = occurrences.stream()
                    .filter(occurrence -> occurrence.getId().equals(pivotOccurrenceId))
                    .findFirst()
                    .orElseThrow(TransactionExceptions.SeriesPivotNotFoundException::new);
        }

        List<Transaction> inScope;
        switch (scope) {
            case THIS_ONE -> inScope = List.of(pivot);
            case THIS_AND_FOLLOWING -> {
                LocalDate pivotStartDate = pivot.getStartDate();
                inScope = occurrences.stream()
                        .filter(occurrence -> !occurrence.getStartDate().isBefore(pivotStartDate))
                        .toList();
            }
            case ALL -> inScope = occurrences;
            default -> throw new IllegalStateException("Unexpected series edit scope: " + scope);
        }

        for (Transaction occurrence : inScope) {
            planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(occurrence), ctx.userId());
        }

        if (scope == SeriesEditScope.THIS_ONE && definition != null) {
            definition.except(pivot.getStartDate());
        }
        transactionRepository.deleteAll(inScope);

        Set<Long> deletedIds = new HashSet<>();
        for (Transaction occurrence : inScope) {
            deletedIds.add(occurrence.getId());
        }
        List<Transaction> remaining = occurrences.stream()
                .filter(occurrence -> !deletedIds.contains(occurrence.getId()))
                .toList();

        if (remaining.isEmpty()) {
            if (definition != null) {
                recurrenceDefinitionRepository.delete(definition);
            }
            return;
        }

        // THIS_AND_FOLLOWING left earlier occurrences behind: shrink the definition's range so a
        // later regeneration won't recreate the deleted tail. THIS_ONE recorded its date as an exception
        // above, so the gap stays.
        if (scope == SeriesEditScope.THIS_AND_FOLLOWING && definition != null) {
            LocalDate lastDate = remaining.stream()
                    .map(Transaction::getStartDate)
                    .max(LocalDate::compareTo)
                    .orElseThrow();
            definition.shortenTo(remaining.size(), lastDate);
            recurrenceDefinitionRepository.save(definition);
        }
    }

    @Transactional(readOnly = true)
    public RecurrenceDefinitionResponse getSeriesDefinition(String seriesId, PlanContext ctx) {
        RecurrenceDefinition definition = recurrenceDefinitionRepository
                .findByPlanAndSeriesId(plan(ctx), seriesId)
                .orElseThrow(() -> new TransactionExceptions.TransactionSeriesNotFoundException(seriesId));
        return RecurrenceDefinitionResponse.from(definition);
    }

    private static final Pattern INSTALLMENT_SUFFIX_PATTERN = Pattern.compile("\\(\\d+/\\d+\\)$");

    private String extractInstallmentSuffix(String description) {
        if (description == null) {
            return null;
        }
        Matcher matcher = INSTALLMENT_SUFFIX_PATTERN.matcher(description);
        return matcher.find() ? matcher.group() : null;
    }

    @Transactional
    public TransactionSeriesResponse editSeries(String seriesId, UpdateSeriesRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        RecurrenceDefinition definition = recurrenceDefinitionRepository
                .findByPlanAndSeriesIdForUpdate(plan(ctx), seriesId)
                .orElseThrow(() -> new TransactionExceptions.TransactionSeriesNotFoundException(seriesId));
        claimVersion(definition, definition.getVersion(), dto.version());
        CreateSeriesRequest series = dto.series();

        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan(ctx), seriesId);

        Category category = category(series.categoryId(), ctx);

        if (series.parcelsNumber() != null
                && !Objects.equals(series.parcelsNumber(), definition.getParcelsNumber())
                && dto.scope() != SeriesEditScope.ALL) {
            throw new TransactionExceptions.SeriesParcelsChangeNeedsAllException();
        }

        RequestedSplit split = requestedSplit(series.participants(), series.splitMode(), ctx);

        Transaction pivot = null;
        if (dto.scope() != SeriesEditScope.ALL) {
            Long pivotOccurrenceId = dto.pivotOccurrenceId();
            pivot = occurrences.stream()
                    .filter(occurrence -> occurrence.getId().equals(pivotOccurrenceId))
                    .findFirst()
                    .orElseThrow(TransactionExceptions.SeriesPivotNotFoundException::new);
        }

        List<Transaction> inScope;
        switch (dto.scope()) {
            case THIS_ONE -> inScope = List.of(pivot);
            case THIS_AND_FOLLOWING -> {
                LocalDate pivotStartDate = pivot.getStartDate();
                inScope = occurrences.stream()
                        .filter(occurrence -> !occurrence.getStartDate().isBefore(pivotStartDate))
                        .toList();
            }
            case ALL -> inScope = occurrences;
            default -> throw new IllegalStateException("Unexpected series edit scope: " + dto.scope());
        }

        for (Transaction occurrence : inScope) {
            planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(occurrence), ctx.userId());
        }

        if (dto.scope() == SeriesEditScope.THIS_ONE) {
            String suffix = extractInstallmentSuffix(pivot.getDescription());
            pivot.edit(
                    new TransactionDetails(
                            category,
                            pivot.getType(),
                            series.amount(),
                            suffix != null ? series.description() + " " + suffix : series.description(),
                            pivot.getStartDate(),
                            pivot.getEndDate(),
                            pivot.getParcelsNumber()),
                    split.mode(),
                    split.shares());

            transactionRepository.saveAndFlush(pivot);
            return TransactionSeriesResponse.from(List.of(pivot), transaction -> permissions(transaction, ctx));
        }

        definition.editPattern(new SeriesPattern(
                category,
                series.amount(),
                series.description(),
                series.parcelsNumber(),
                series.endDate(),
                split.mode(),
                split.shares()));

        LocalDate pivotDate = dto.scope() == SeriesEditScope.ALL ? null : pivot.getStartDate();

        SeriesRegenerator.SeriesEditResult result =
                seriesRegenerator.reconcile(definition, occurrences, split.shares(), dto.scope(), pivotDate);

        transactionRepository.saveAll(result.toUpdate());
        transactionRepository.saveAll(result.toCreate());
        transactionRepository.deleteAll(result.toDelete());

        List<Transaction> combined = new ArrayList<>(result.toUpdate());
        combined.addAll(result.toCreate());

        // P3: keep generatedThrough in lockstep with the (possibly just toggled) endDate. Bounding
        // (endDate now set) caps the watermark at the new endDate, which also stops the rolling
        // top-up (its due-query only selects endDate IS NULL). Re-opening (endDate now null) just
        // regenerated the series out to the rolling horizon via SeriesRegenerator's own open-ended
        // fallback, so the watermark advances to the last occurrence that reconcile actually produced.
        if (definition.getMode() == RecurrenceMode.RECURRING) {
            LocalDate generatedThrough = definition.getEndDate() != null
                    ? definition.getEndDate()
                    : combined.stream()
                            .map(Transaction::getStartDate)
                            .max(LocalDate::compareTo)
                            .orElse(definition.getGeneratedThrough());
            definition.markGeneratedThrough(generatedThrough);
        }

        if (definition.getMode() == RecurrenceMode.RECURRING && definition.getEndDate() == null) {
            coverOpenEndedSeries(definition);
        }
        recurrenceDefinitionRepository.saveAndFlush(definition);

        return TransactionSeriesResponse.from(combined, transaction -> permissions(transaction, ctx));
    }
}
