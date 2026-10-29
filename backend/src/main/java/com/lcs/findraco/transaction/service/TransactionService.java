package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.web.PageRequests;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceDefinitionParticipant;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionItem;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionSortField;
import com.lcs.findraco.transaction.model.TransactionType;
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
import com.lcs.findraco.transaction.response.TransactionImportResponse;
import com.lcs.findraco.transaction.response.TransactionResponse;
import com.lcs.findraco.transaction.response.TransactionSeriesResponse;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.service.UserService;
import jakarta.persistence.EntityManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;
    private final DateUtils dateUtils;
    private final RecurringTransactionGenerator recurringTransactionGenerator;
    private final PlanAuthorization planAuthorization;
    private final SplitResolver splitResolver;
    private final PlanService planService;
    private final UserService userService;
    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final SeriesRegenerator seriesRegenerator;
    private final EntityManager entityManager;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryService categoryService,
            DateUtils dateUtils,
            RecurringTransactionGenerator recurringTransactionGenerator,
            PlanAuthorization planAuthorization,
            SplitResolver splitResolver,
            PlanService planService,
            UserService userService,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            SeriesRegenerator seriesRegenerator,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.dateUtils = dateUtils;
        this.recurringTransactionGenerator = recurringTransactionGenerator;
        this.planAuthorization = planAuthorization;
        this.splitResolver = splitResolver;
        this.planService = planService;
        this.userService = userService;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.seriesRegenerator = seriesRegenerator;
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

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id, PlanContext ctx) {
        return TransactionResponse.from(load(id, ctx));
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
                        PageRequest.of(filter.page(), filter.size(), Sort.by(direction, sortBy.name()));
                };

        Page<Transaction> page = transactionRepository.findAll(Specification.allOf(specs), pageable);
        if (page.hasContent()) {
            transactionRepository.fetchParticipants(page.getContent());
            transactionRepository.fetchItems(page.getContent());
        }
        return page.map(TransactionResponse::from);
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());
        dateUtils.checkIfStartDateIsBeforeEndDate(dto.startDate(), dto.endDate());

        Transaction transaction = new Transaction();
        Category category = dto.categoryId() != null ? categoryService.findById(dto.categoryId(), ctx) : null;

        if (category != null && category.getType() != dto.type()) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }

        transaction.setPlan(plan(ctx));
        transaction.setCreatedBy(user(ctx));
        transaction.setCategory(category);
        transaction.setType(dto.type());
        transaction.setAmount(dto.amount());
        transaction.setDescription(dto.description());
        transaction.setParcelsNumber(dto.parcelsNumber());
        transaction.setStartDate(dto.startDate());
        transaction.setEndDate(dto.endDate());

        applyParticipants(transaction, dto.participants(), dto.splitMode(), dto.amount(), ctx);
        applyItems(transaction, dto.items(), ctx);

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest dto, PlanContext ctx) {
        dateUtils.checkIfStartDateIsBeforeEndDate(dto.startDate(), dto.endDate());

        Transaction existingTransaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(existingTransaction), ctx.userId());

        Category category = dto.categoryId() != null ? categoryService.findById(dto.categoryId(), ctx) : null;

        if (category != null && category.getType() != dto.type()) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }

        existingTransaction.setCategory(category);
        existingTransaction.setType(dto.type());
        existingTransaction.setAmount(dto.amount());
        existingTransaction.setDescription(dto.description());
        existingTransaction.setParcelsNumber(dto.parcelsNumber());
        existingTransaction.setStartDate(dto.startDate());
        existingTransaction.setEndDate(dto.endDate());

        applyParticipants(existingTransaction, dto.participants(), dto.splitMode(), dto.amount(), ctx);
        applyItems(existingTransaction, dto.items(), ctx);

        return TransactionResponse.from(transactionRepository.save(existingTransaction));
    }

    private record ResolvedParticipants(SplitMode splitMode, List<ResolvedParticipant> shares) {}

    private ResolvedParticipants resolveParticipants(
            List<TransactionParticipantRequest> participantInputs,
            SplitMode requestedSplitMode,
            BigDecimal amount,
            PlanContext ctx) {
        if (participantInputs == null || participantInputs.isEmpty()) {
            return new ResolvedParticipants(SplitMode.EQUAL, List.of(new ResolvedParticipant(user(ctx), amount)));
        }

        Set<Long> seenMemberIds = new HashSet<>();
        Map<Long, User> membersById = new LinkedHashMap<>();
        List<SplitResolver.ParticipantInput> resolverInputs = new ArrayList<>();
        for (TransactionParticipantRequest input : participantInputs) {
            if (!seenMemberIds.add(input.memberId())) {
                throw new TransactionExceptions.DuplicateParticipantException();
            }
            User member = userService
                    .findById(input.memberId())
                    .filter(u -> planService.isMember(ctx.planId(), u.getId()))
                    .orElseThrow(TransactionExceptions.ParticipantNotMemberException::new);
            membersById.put(member.getId(), member);
            resolverInputs.add(new SplitResolver.ParticipantInput(member.getId(), input.shareAmount()));
        }

        SplitMode splitMode = requestedSplitMode != null ? requestedSplitMode : SplitMode.EQUAL;
        List<SplitResolver.ResolvedShare> resolvedShares = splitResolver.resolve(amount, splitMode, resolverInputs);

        List<ResolvedParticipant> shares = resolvedShares.stream()
                .map(share -> new ResolvedParticipant(membersById.get(share.memberId()), share.shareAmount()))
                .toList();

        return new ResolvedParticipants(splitMode, shares);
    }

    private void requireAttributionAuthorizedIfNeeded(ResolvedParticipants resolved, PlanContext ctx) {
        boolean isSelfOnly = resolved.shares().size() == 1
                && resolved.shares().get(0).member().getId().equals(ctx.userId());
        if (!isSelfOnly) {
            planAuthorization.requireCanAttributeToOthers(ctx.role());
        }
    }

    private void applyParticipants(
            Transaction transaction,
            List<TransactionParticipantRequest> participantInputs,
            SplitMode requestedSplitMode,
            BigDecimal amount,
            PlanContext ctx) {
        ResolvedParticipants resolved = resolveParticipants(participantInputs, requestedSplitMode, amount, ctx);
        requireAttributionAuthorizedIfNeeded(resolved, ctx);

        transaction.setSplitMode(resolved.splitMode());

        Map<Long, TransactionParticipant> existingByMemberId = new LinkedHashMap<>();
        for (TransactionParticipant participant : transaction.getParticipants()) {
            existingByMemberId.put(participant.getMember().getId(), participant);
        }

        Set<Long> keptMemberIds = new HashSet<>();
        for (ResolvedParticipant share : resolved.shares()) {
            keptMemberIds.add(share.member().getId());
            TransactionParticipant existing =
                    existingByMemberId.get(share.member().getId());
            if (existing != null) {
                existing.setShareAmount(share.shareAmount());
            } else {
                TransactionParticipant participant = new TransactionParticipant();
                participant.setTransaction(transaction);
                participant.setMember(share.member());
                participant.setShareAmount(share.shareAmount());
                transaction.getParticipants().add(participant);
            }
        }

        transaction
                .getParticipants()
                .removeIf(participant ->
                        !keptMemberIds.contains(participant.getMember().getId()));
    }

    private void applyItems(Transaction transaction, List<TransactionItemRequest> itemInputs, PlanContext ctx) {
        if (itemInputs == null || itemInputs.isEmpty()) {
            transaction.getItems().clear();
            return;
        }

        List<TransactionItem> resolvedItems = new ArrayList<>();
        BigDecimal itemsTotal = BigDecimal.ZERO;
        for (TransactionItemRequest input : itemInputs) {
            if (input.description() == null || input.description().isBlank()) {
                throw new TransactionExceptions.InvalidItemException("Item description cannot be blank.");
            }
            if (input.amount() == null || input.amount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new TransactionExceptions.InvalidItemException("Item amount must be positive.");
            }

            Category itemCategory =
                    input.categoryId() != null ? categoryService.findById(input.categoryId(), ctx) : null;

            if (itemCategory != null && itemCategory.getType() != transaction.getType()) {
                throw new TransactionExceptions.ItemCategoryTypeMismatchException();
            }

            TransactionItem item = new TransactionItem();
            item.setTransaction(transaction);
            item.setDescription(input.description());
            item.setAmount(input.amount());
            item.setCategory(itemCategory);
            item.setQuantity(input.quantity() != null ? input.quantity() : 1);

            resolvedItems.add(item);
            itemsTotal = itemsTotal.add(input.amount());
        }

        if (itemsTotal.compareTo(transaction.getAmount()) > 0) {
            throw new TransactionExceptions.ItemsTotalExceedsAmountException();
        }

        transaction.getItems().clear();
        transaction.getItems().addAll(resolvedItems);
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

        if (dto.mode() == RecurrenceMode.INSTALLMENT) {
            if (dto.parcelsNumber() == null) {
                throw new TransactionExceptions.SeriesParcelsRequiredException();
            }
            if (dto.currentParcel() != null && (dto.currentParcel() < 1 || dto.currentParcel() > dto.parcelsNumber())) {
                throw new TransactionExceptions.SeriesCurrentParcelOutOfRangeException();
            }
        } else if (dto.mode() == RecurrenceMode.RECURRING) {
            if (dto.interval() == null) {
                throw new TransactionExceptions.SeriesIntervalRequiredException();
            }
            // endDate is optional: null means open-ended (materialized on a rolling horizon, see
            // RecurringTransactionGenerator.OPEN_ENDED_HORIZON_MONTHS / generatedThrough below).
            dateUtils.checkIfStartDateIsBeforeEndDate(dto.startDate(), dto.endDate());
        }

        Category category = dto.categoryId() != null ? categoryService.findById(dto.categoryId(), ctx) : null;

        if (category != null && category.getType() != dto.type()) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }

        ResolvedParticipants resolvedParticipants =
                resolveParticipants(dto.participants(), dto.splitMode(), dto.amount(), ctx);
        requireAttributionAuthorizedIfNeeded(resolvedParticipants, ctx);

        String seriesId = UUID.randomUUID().toString();
        List<Transaction> occurrences = recurringTransactionGenerator.generate(
                dto,
                plan(ctx),
                user(ctx),
                category,
                seriesId,
                resolvedParticipants.splitMode(),
                resolvedParticipants.shares());

        RecurrenceDefinition definition = new RecurrenceDefinition();
        definition.setPlan(plan(ctx));
        definition.setCreatedBy(user(ctx));
        definition.setCategory(category);
        definition.setSeriesId(seriesId);
        definition.setType(dto.type());
        definition.setAmount(dto.amount());
        definition.setDescription(dto.description());
        definition.setMode(dto.mode());
        definition.setRecurrenceInterval(dto.interval());
        definition.setParcelsNumber(dto.parcelsNumber());
        definition.setFirstParcel(
                dto.mode() == RecurrenceMode.INSTALLMENT
                        ? (dto.currentParcel() != null ? dto.currentParcel() : 1)
                        : null);
        definition.setStartDate(dto.startDate());
        definition.setEndDate(dto.endDate());
        definition.setSplitMode(resolvedParticipants.splitMode());
        if (dto.mode() == RecurrenceMode.RECURRING && !occurrences.isEmpty()) {
            definition.setGeneratedThrough(
                    occurrences.get(occurrences.size() - 1).getStartDate());
        }

        for (ResolvedParticipant share : resolvedParticipants.shares()) {
            RecurrenceDefinitionParticipant participant = new RecurrenceDefinitionParticipant();
            participant.setDefinition(definition);
            participant.setMember(share.member());
            participant.setShareAmount(share.shareAmount());
            definition.getParticipants().add(participant);
        }

        recurrenceDefinitionRepository.save(definition);

        for (Transaction occurrence : occurrences) {
            occurrence.setRecurrenceDefinition(definition);
        }

        return TransactionSeriesResponse.from(transactionRepository.saveAll(occurrences));
    }

    @Transactional
    public void deleteSeries(String seriesId, SeriesEditScope scope, Long pivotOccurrenceId, PlanContext ctx) {
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

        transactionRepository.deleteAll(inScope);

        Set<Long> deletedIds = new HashSet<>();
        for (Transaction occurrence : inScope) {
            deletedIds.add(occurrence.getId());
        }
        List<Transaction> remaining = occurrences.stream()
                .filter(occurrence -> !deletedIds.contains(occurrence.getId()))
                .toList();

        RecurrenceDefinition definition = recurrenceDefinitionRepository
                .findByPlanAndSeriesId(plan(ctx), seriesId)
                .orElse(null);

        if (remaining.isEmpty()) {
            if (definition != null) {
                recurrenceDefinitionRepository.delete(definition);
            }
            return;
        }

        // THIS_AND_FOLLOWING left earlier occurrences behind: shrink the definition's range so a
        // later regeneration won't recreate the deleted tail. THIS_ONE leaves a gap the exception-less
        // model can't represent, so the definition is untouched (matching edit THIS_ONE).
        if (scope == SeriesEditScope.THIS_AND_FOLLOWING && definition != null) {
            if (definition.getMode() == RecurrenceMode.INSTALLMENT) {
                int firstParcel = definition.getFirstParcel() != null ? definition.getFirstParcel() : 1;
                definition.setParcelsNumber(firstParcel + remaining.size() - 1);
            } else {
                LocalDate newEndDate = remaining.stream()
                        .map(Transaction::getStartDate)
                        .max(LocalDate::compareTo)
                        .orElse(definition.getEndDate());
                definition.setEndDate(newEndDate);
            }
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
                .findByPlanAndSeriesId(plan(ctx), seriesId)
                .orElseThrow(() -> new TransactionExceptions.TransactionSeriesNotFoundException(seriesId));

        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan(ctx), seriesId);

        Category category = dto.categoryId() != null ? categoryService.findById(dto.categoryId(), ctx) : null;

        if (category != null && category.getType() != dto.type()) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }

        if (dto.parcelsNumber() != null
                && !Objects.equals(dto.parcelsNumber(), definition.getParcelsNumber())
                && dto.scope() != SeriesEditScope.ALL) {
            throw new TransactionExceptions.SeriesParcelsChangeNeedsAllException();
        }

        ResolvedParticipants resolved = resolveParticipants(dto.participants(), dto.splitMode(), dto.amount(), ctx);
        requireAttributionAuthorizedIfNeeded(resolved, ctx);

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
            pivot.setDescription(suffix != null ? dto.description() + " " + suffix : dto.description());
            pivot.setAmount(dto.amount());
            pivot.setCategory(category);
            pivot.setSplitMode(resolved.splitMode());

            reconcileParticipants(pivot, resolved.shares());

            transactionRepository.save(pivot);
            return TransactionSeriesResponse.from(List.of(pivot));
        }

        definition.setAmount(dto.amount());
        definition.setDescription(dto.description());
        definition.setCategory(category);
        definition.setSplitMode(resolved.splitMode());
        definition.setParcelsNumber(dto.parcelsNumber());
        // Full-replace (matches the transaction PUT contract): a null endDate here means "make this
        // RECURRING series open-ended," not "leave the bound unchanged" (P3, RMV2-09).
        definition.setEndDate(dto.endDate());

        reconcileDefinitionParticipants(definition, resolved.shares());

        LocalDate pivotDate = dto.scope() == SeriesEditScope.ALL ? null : pivot.getStartDate();

        SeriesRegenerator.SeriesEditResult result =
                seriesRegenerator.reconcile(definition, occurrences, resolved.shares(), dto.scope(), pivotDate);

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
            definition.setGeneratedThrough(generatedThrough);
        }

        recurrenceDefinitionRepository.save(definition);

        return TransactionSeriesResponse.from(combined);
    }

    private void reconcileParticipants(Transaction transaction, List<ResolvedParticipant> shares) {
        Map<Long, TransactionParticipant> existingByMemberId = new LinkedHashMap<>();
        for (TransactionParticipant participant : transaction.getParticipants()) {
            existingByMemberId.put(participant.getMember().getId(), participant);
        }

        Set<Long> keptMemberIds = new HashSet<>();
        for (ResolvedParticipant share : shares) {
            keptMemberIds.add(share.member().getId());
            TransactionParticipant existing =
                    existingByMemberId.get(share.member().getId());
            if (existing != null) {
                existing.setShareAmount(share.shareAmount());
            } else {
                TransactionParticipant participant = new TransactionParticipant();
                participant.setTransaction(transaction);
                participant.setMember(share.member());
                participant.setShareAmount(share.shareAmount());
                transaction.getParticipants().add(participant);
            }
        }

        transaction
                .getParticipants()
                .removeIf(participant ->
                        !keptMemberIds.contains(participant.getMember().getId()));
    }

    private void reconcileDefinitionParticipants(RecurrenceDefinition definition, List<ResolvedParticipant> shares) {
        Map<Long, RecurrenceDefinitionParticipant> existingByMemberId = new LinkedHashMap<>();
        for (RecurrenceDefinitionParticipant participant : definition.getParticipants()) {
            existingByMemberId.put(participant.getMember().getId(), participant);
        }

        Set<Long> keptMemberIds = new HashSet<>();
        for (ResolvedParticipant share : shares) {
            keptMemberIds.add(share.member().getId());
            RecurrenceDefinitionParticipant existing =
                    existingByMemberId.get(share.member().getId());
            if (existing != null) {
                existing.setShareAmount(share.shareAmount());
            } else {
                RecurrenceDefinitionParticipant participant = new RecurrenceDefinitionParticipant();
                participant.setDefinition(definition);
                participant.setMember(share.member());
                participant.setShareAmount(share.shareAmount());
                definition.getParticipants().add(participant);
            }
        }

        definition
                .getParticipants()
                .removeIf(participant ->
                        !keptMemberIds.contains(participant.getMember().getId()));
    }

    @Transactional
    public TransactionImportResponse importFromNubankCsv(MultipartFile file, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        List<String> lines;
        try {
            lines = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                    .lines()
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("Failed to read the CSV file.", e);
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<Transaction> transactions = new ArrayList<>();

        record ParsedRow(String externalId, LocalDate date, BigDecimal rawAmount, String description) {}
        List<ParsedRow> parsed = new ArrayList<>();

        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i).trim();
            if (line.isBlank()) continue;

            String[] parts = line.split(",", 4);
            if (parts.length < 4) continue;

            try {
                parsed.add(new ParsedRow(
                        parts[2].trim(),
                        LocalDate.parse(parts[0].trim(), formatter),
                        new BigDecimal(parts[1].trim()),
                        parts[3].trim()));
            } catch (DateTimeParseException | NumberFormatException e) {
                throw new TransactionExceptions.ImportLineInvalidException(i + 1);
            }
        }

        Set<String> existingIds = transactionRepository.findExistingExternalIds(
                plan(ctx), parsed.stream().map(ParsedRow::externalId).toList());

        for (ParsedRow row : parsed) {
            if (existingIds.contains(row.externalId())) continue;

            Transaction t = new Transaction();
            t.setPlan(plan(ctx));
            t.setCreatedBy(user(ctx));
            t.setExternalId(row.externalId());
            t.setStartDate(row.date());
            t.setAmount(row.rawAmount().abs());
            t.setType(row.rawAmount().compareTo(BigDecimal.ZERO) >= 0 ? TransactionType.CREDIT : TransactionType.DEBIT);
            t.setDescription(row.description());

            transactions.add(t);
        }

        transactionRepository.saveAll(transactions);
        return new TransactionImportResponse(transactions.size());
    }
}
