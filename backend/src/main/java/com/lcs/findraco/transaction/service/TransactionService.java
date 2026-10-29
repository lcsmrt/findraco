package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.web.PageRequests;
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
import org.springframework.web.multipart.MultipartFile;

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
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.recurringTransactionGenerator = recurringTransactionGenerator;
        this.planAuthorization = planAuthorization;
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

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest dto, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());

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

        return TransactionResponse.from(transactionRepository.save(transaction));
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
                .findByPlanAndSeriesId(plan(ctx), seriesId)
                .orElseThrow(() -> new TransactionExceptions.TransactionSeriesNotFoundException(seriesId));

        List<Transaction> occurrences = transactionRepository.findAllByPlanAndSeriesId(plan(ctx), seriesId);

        Category category = category(dto.categoryId(), ctx);

        if (dto.parcelsNumber() != null
                && !Objects.equals(dto.parcelsNumber(), definition.getParcelsNumber())
                && dto.scope() != SeriesEditScope.ALL) {
            throw new TransactionExceptions.SeriesParcelsChangeNeedsAllException();
        }

        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), ctx);

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
                            dto.amount(),
                            suffix != null ? dto.description() + " " + suffix : dto.description(),
                            pivot.getStartDate(),
                            pivot.getEndDate(),
                            pivot.getParcelsNumber()),
                    split.mode(),
                    split.shares());

            transactionRepository.save(pivot);
            return TransactionSeriesResponse.from(List.of(pivot));
        }

        definition.editPattern(new SeriesPattern(
                category,
                dto.amount(),
                dto.description(),
                dto.parcelsNumber(),
                dto.endDate(),
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

        recurrenceDefinitionRepository.save(definition);

        return TransactionSeriesResponse.from(combined);
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

            TransactionType type =
                    row.rawAmount().compareTo(BigDecimal.ZERO) >= 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
            TransactionDetails details = new TransactionDetails(
                    null, type, row.rawAmount().abs(), row.description(), row.date(), null, null);
            // The importer pays for every row, as a form without participants would.
            Transaction t = Transaction.create(new TransactionDraft(
                    plan(ctx),
                    user(ctx),
                    details,
                    SplitMode.EQUAL,
                    List.of(new Share(user(ctx), null)),
                    List.of(),
                    row.externalId(),
                    null));

            transactions.add(t);
        }

        transactionRepository.saveAll(transactions);
        return new TransactionImportResponse(transactions.size());
    }
}
