package com.lcs.findraco.transaction.service;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.ContactService;
import com.lcs.findraco.plan.service.PlanAuthorization;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.error.MalformedRequestException;
import com.lcs.findraco.shared.error.StaleVersionException;
import com.lcs.findraco.shared.web.PageRequests;
import com.lcs.findraco.transaction.config.SeriesProperties;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.transaction.model.ItemDraft;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceDefinitionParticipant;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.SeriesEditScope;
import com.lcs.findraco.transaction.model.SeriesPattern;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDeletion;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionSortField;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.repository.TransactionDeletionRepository;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.repository.TransactionSpecification;
import com.lcs.findraco.transaction.request.ConfirmTransactionRequest;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.transaction.request.CreateTransactionRequest;
import com.lcs.findraco.transaction.request.NeutralCandidateFilter;
import com.lcs.findraco.transaction.request.RepaymentAllocationRequest;
import com.lcs.findraco.transaction.request.SetTransactionKindRequest;
import com.lcs.findraco.transaction.request.TransactionFilter;
import com.lcs.findraco.transaction.request.TransactionItemRequest;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import com.lcs.findraco.transaction.request.UpdateSeriesRequest;
import com.lcs.findraco.transaction.request.UpdateTransactionRequest;
import com.lcs.findraco.transaction.response.NeutralCandidateResponse;
import com.lcs.findraco.transaction.response.RecurrenceDefinitionResponse;
import com.lcs.findraco.transaction.response.RepaymentResponse;
import com.lcs.findraco.transaction.response.TransactionDeletedResponse;
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
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
    private final ContactService contactService;
    private final RepaymentAllocationService allocationService;

    private final RecurrenceDefinitionRepository recurrenceDefinitionRepository;
    private final TransactionDeletionRepository transactionDeletionRepository;
    private final SeriesRegenerator seriesRegenerator;
    private final SeriesProperties seriesProperties;
    private final NeutralCandidateFinder neutralCandidateFinder;
    private final Clock clock;
    private final EntityManager entityManager;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryService categoryService,
            RecurringTransactionGenerator recurringTransactionGenerator,
            PlanAuthorization planAuthorization,
            PlanService planService,
            UserService userService,
            ContactService contactService,
            RepaymentAllocationService allocationService,
            RecurrenceDefinitionRepository recurrenceDefinitionRepository,
            TransactionDeletionRepository transactionDeletionRepository,
            SeriesRegenerator seriesRegenerator,
            SeriesProperties seriesProperties,
            NeutralCandidateFinder neutralCandidateFinder,
            Clock clock,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.categoryService = categoryService;
        this.recurringTransactionGenerator = recurringTransactionGenerator;
        this.planAuthorization = planAuthorization;
        this.planService = planService;
        this.userService = userService;
        this.contactService = contactService;
        this.allocationService = allocationService;
        this.recurrenceDefinitionRepository = recurrenceDefinitionRepository;
        this.transactionDeletionRepository = transactionDeletionRepository;
        this.seriesRegenerator = seriesRegenerator;
        this.seriesProperties = seriesProperties;
        this.neutralCandidateFinder = neutralCandidateFinder;
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
        return response(transaction, ctx, userService.today(ctx.userId()));
    }

    private TransactionResponse response(Transaction transaction, PlanContext ctx, LocalDate today) {
        return response(transaction, ctx, today, allocationService.responsesOf(List.of(transaction)));
    }

    private TransactionResponse response(
            Transaction transaction, PlanContext ctx, LocalDate today, Map<Long, RepaymentResponse> repayments) {
        return TransactionResponse.from(
                transaction, permissions(transaction, ctx), today, repayments.get(transaction.getId()));
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
    public Page<TransactionResponse> findAllByPlanPaged(TransactionFilter filter, PlanContext ctx) {
        TransactionSortField sortBy = filter.sortBy();
        Sort.Direction direction = PageRequests.direction(filter.sortDirection());
        if (Boolean.TRUE.equals(filter.uncategorized()) && filter.categoryId() != null) {
            throw new MalformedRequestException("uncategorized", "A list cannot be uncategorized and in a category.");
        }
        LocalDate today = userService.today(ctx.userId());

        List<Specification<Transaction>> specs = new ArrayList<>(List.of(
                TransactionSpecification.belongsToPlan(plan(ctx)),
                TransactionSpecification.isActive(),
                TransactionSpecification.typeEquals(filter.type()),
                TransactionSpecification.categoryInTree(filter.categoryId()),
                TransactionSpecification.hasParticipant(filter.memberId()),
                TransactionSpecification.matchesSearchTerm(filter.description()),
                TransactionSpecification.startDateFrom(filter.startDateFrom()),
                TransactionSpecification.startDateTo(filter.startDateTo()),
                TransactionSpecification.amountMin(filter.amountMin()),
                TransactionSpecification.amountMax(filter.amountMax()),
                TransactionSpecification.uncategorized(filter.uncategorized()),
                TransactionSpecification.hasKind(filter.kind()),
                TransactionSpecification.hasStatus(filter.status(), today)));

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
        Map<Long, RepaymentResponse> repayments = allocationService.responsesOf(page.getContent());
        return page.map(transaction -> response(transaction, ctx, today, repayments));
    }

    /** The review of movements: rows with no kind whose bank text looks neutral, with the kind proposed for each. */
    @Transactional(readOnly = true)
    public Page<NeutralCandidateResponse> findNeutralCandidates(NeutralCandidateFilter filter, PlanContext ctx) {
        LocalDate today = userService.today(ctx.userId());
        return neutralCandidateFinder
                .find(filter, ctx)
                .map(candidate -> new NeutralCandidateResponse(
                        response(candidate.transaction(), ctx, today), candidate.proposedKind()));
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        Contact repaymentContact = repaymentContact(dto.kind(), dto.contactId(), dto.allocations(), null, ctx);
        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), KeptParties.NONE, ctx);
        TransactionDetails details = new TransactionDetails(
                category(dto.categoryId(), ctx),
                dto.type(),
                dto.amount(),
                dto.description(),
                dto.startDate(),
                dto.endDate(),
                dto.parcelsNumber(),
                dto.kind(),
                repaymentContact);
        Transaction transaction = Transaction.create(new TransactionDraft(
                plan(ctx), user(ctx), details, split.mode(), split.shares(), items(dto.items(), ctx), null, null));

        Transaction saved = transactionRepository.save(transaction);
        if (repaymentContact != null) {
            allocationService.allocate(saved, dto.allocations(), ctx);
        }
        return response(saved, ctx);
    }

    /**
     * The contact a repayment comes from, locked until the save ends, or null for a row that is no repayment. Only a
     * repayment takes {@code contactId} and allocations, and only an owner or editor records one, as they alone
     * attribute money to others. A repayment that already comes from {@code currentContactId} keeps it even when it
     * was archived since.
     */
    private Contact repaymentContact(
            TransactionKind kind,
            Long contactId,
            List<RepaymentAllocationRequest> allocations,
            Long currentContactId,
            PlanContext ctx) {
        if (kind != TransactionKind.REPAYMENT) {
            if (contactId != null || allocations != null) {
                throw new TransactionExceptions.NeutralKindInvalidException(
                        "contactId and allocations belong to a REPAYMENT only.");
            }
            return null;
        }
        planAuthorization.requireCanAttributeToOthers(ctx.role());
        if (contactId == null) {
            throw new TransactionExceptions.NeutralKindInvalidException("A REPAYMENT needs the contact it came from.");
        }
        return contactService.lockForUpdate(contactId, contactId.equals(currentContactId), ctx);
    }

    /**
     * Locks the contacts whose shares a save may change, in id order so two saves never wait on each other: what
     * a contact owes and what repayments settled of it are then read after any other save of it has committed.
     */
    private void lockContacts(Collection<Long> contactIds, PlanContext ctx) {
        contactIds.stream().sorted().forEach(id -> contactService.lockForUpdate(id, true, ctx));
    }

    private static Set<Long> contactIds(RequestedSplit split) {
        Set<Long> ids = new HashSet<>();
        for (Share share : split.shares()) {
            if (share.contact() != null) {
                ids.add(share.contact().getId());
            }
        }
        return ids;
    }

    private static Set<Long> contactIds(Transaction transaction) {
        Set<Long> ids = new HashSet<>();
        for (TransactionParticipant participant : transaction.getParticipants()) {
            if (participant.getContact() != null) {
                ids.add(participant.getContact().getId());
            }
        }
        return ids;
    }

    /** What an edit leaves of a purchase's allocations: a share cut below what repayments settled gives it back. */
    private void fitAllocations(Transaction transaction) {
        allocationService.fitToShares(RepaymentAllocationService.contactShareIds(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest dto, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        claimVersion(transaction, transaction.getVersion(), dto.version());

        boolean wasRepayment = transaction.getKind() == TransactionKind.REPAYMENT;
        Long currentContactId = wasRepayment ? transaction.getRepaymentContact().getId() : null;
        Contact repaymentContact =
                repaymentContact(dto.kind(), dto.contactId(), dto.allocations(), currentContactId, ctx);
        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), KeptParties.of(transaction), ctx);
        Set<Long> contactIds = contactIds(split);
        contactIds.addAll(contactIds(transaction));
        lockContacts(contactIds, ctx);
        TransactionDetails details = new TransactionDetails(
                category(dto.categoryId(), ctx),
                dto.type(),
                dto.amount(),
                dto.description(),
                dto.startDate(),
                dto.endDate(),
                dto.parcelsNumber(),
                dto.kind(),
                repaymentContact);
        transaction.edit(details, split.mode(), split.shares(), items(dto.items(), ctx));

        Transaction saved = transactionRepository.saveAndFlush(transaction);
        if (repaymentContact != null) {
            allocationService.allocate(saved, dto.allocations(), ctx);
        } else {
            if (wasRepayment) {
                allocationService.release(saved);
            }
            fitAllocations(saved);
        }
        return response(saved, ctx);
    }

    /** Marks a row with a kind, as the review of movements does; the row's other values stay as they are. */
    @Transactional
    public TransactionResponse setKind(Long id, SetTransactionKindRequest dto, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        claimVersion(transaction, transaction.getVersion(), dto.version());

        transaction.assignKind(dto.kind());

        return response(transactionRepository.saveAndFlush(transaction), ctx);
    }

    /**
     * Records what an occurrence really cost and when. A moved date keeps the occurrence's series slot, so a
     * later series edit neither refills the old date nor loses the occurrence.
     */
    @Transactional
    public TransactionResponse confirm(Long id, ConfirmTransactionRequest dto, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());
        claimVersion(transaction, transaction.getVersion(), dto.version());

        lockContacts(contactIds(transaction), ctx);
        transaction.confirm(dto.amount(), dto.startDate());

        Transaction saved = transactionRepository.saveAndFlush(transaction);
        fitAllocations(saved);
        return response(saved, ctx);
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

    /** The members and contacts a row or series already carries; an edit may keep them though they could not join now. */
    private record KeptParties(Set<Long> memberIds, Set<Long> contactIds) {

        static final KeptParties NONE = new KeptParties(Set.of(), Set.of());

        static KeptParties of(Transaction transaction) {
            return of(transaction.getParticipants().stream()
                    .map(TransactionParticipant::toShare)
                    .toList());
        }

        static KeptParties of(RecurrenceDefinition definition) {
            return of(definition.getParticipants().stream()
                    .map(RecurrenceDefinitionParticipant::toShare)
                    .toList());
        }

        private static KeptParties of(List<Share> shares) {
            Set<Long> memberIds = new HashSet<>();
            Set<Long> contactIds = new HashSet<>();
            for (Share share : shares) {
                if (share.member() != null) {
                    memberIds.add(share.member().getId());
                } else {
                    contactIds.add(share.contact().getId());
                }
            }
            return new KeptParties(memberIds, contactIds);
        }
    }

    /**
     * Without participants the creator takes the whole amount. An empty list is kept as sent, so the
     * aggregate refuses it like any other split without a participant. A participant is a member of the plan or a
     * contact of it, and is already on the row or series being edited ({@code kept}) or joins it now: someone who
     * left the plan, or a contact archived since, keeps their share until an edit removes it, but no row takes them
     * on again.
     */
    private RequestedSplit requestedSplit(
            List<TransactionParticipantRequest> participantInputs,
            SplitMode requestedSplitMode,
            KeptParties kept,
            PlanContext ctx) {
        if (participantInputs == null) {
            return new RequestedSplit(SplitMode.EQUAL, List.of(new Share(user(ctx), null)));
        }

        List<Share> shares = new ArrayList<>();
        for (TransactionParticipantRequest input : participantInputs) {
            if ((input.memberId() == null) == (input.contactId() == null)) {
                throw new TransactionExceptions.ParticipantMemberOrContactException();
            }
            if (input.contactId() != null) {
                // A contact share takes money out of the plan's spending, so it needs the same role as
                // attributing to another member; the role is judged before the contact is looked up.
                planAuthorization.requireCanAttributeToOthers(ctx.role());
                Contact contact = contactService.findForSplit(
                        input.contactId(), kept.contactIds().contains(input.contactId()), ctx);
                shares.add(Share.ofContact(contact, input.shareAmount()));
                continue;
            }
            User member = userService
                    .findById(input.memberId())
                    .filter(u -> kept.memberIds().contains(u.getId()) || planService.isMember(ctx.planId(), u.getId()))
                    .orElseThrow(TransactionExceptions.ParticipantNotMemberException::new);
            shares.add(new Share(member, input.shareAmount()));
        }

        boolean selfOnly = shares.size() == 1
                && shares.get(0).member() != null
                && shares.get(0).member().getId().equals(ctx.userId());
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

    /**
     * Moves a transaction to the trash. An occurrence of a series also records its date as an exception of the
     * series, so a later edit of the series does not bring it back; a restore removes the exception again.
     */
    @Transactional
    public TransactionDeletedResponse delete(Long id, PlanContext ctx) {
        Transaction transaction = load(id, ctx);
        planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(transaction), ctx.userId());

        TransactionDeletion deletion = transactionDeletionRepository.save(
                TransactionDeletion.ofTransaction(plan(ctx), user(ctx), clock.instant()));
        transaction.trash(deletion);

        if (transaction.getRecurrenceDefinition() != null) {
            RecurrenceDefinition definition = recurrenceDefinitionRepository
                    .findByIdAndPlanForUpdate(
                            transaction.getRecurrenceDefinition().getId(), plan(ctx))
                    .orElseThrow();
            if (definition.except(transaction.getScheduledDate())) {
                deletion.recordException(definition, transaction.getScheduledDate());
            }
            recurrenceDefinitionRepository.saveAndFlush(definition);
            deletion.recordDefinitionVersion(definition.getRuleRevision());
        }
        return new TransactionDeletedResponse(deletion.getId());
    }

    @Transactional
    public TransactionSeriesResponse createSeries(CreateSeriesRequest dto, PlanContext ctx) {
        planAuthorization.requireCanCreateTransaction(ctx.role());

        RequestedSplit split = requestedSplit(dto.participants(), dto.splitMode(), KeptParties.NONE, ctx);
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
                        split.shares(),
                        dto.requiresConfirmation() == null || dto.requiresConfirmation())));

        List<Transaction> occurrences = recurringTransactionGenerator.generate(dto, definition, split.shares());
        if (dto.mode() == RecurrenceMode.RECURRING && !occurrences.isEmpty()) {
            definition.markGeneratedThrough(occurrences.getLast().getStartDate());
        }
        if (definition.getMode() == RecurrenceMode.RECURRING && definition.getEndDate() == null) {
            coverOpenEndedSeries(definition);
        }

        return TransactionSeriesResponse.from(
                transactionRepository.saveAll(occurrences),
                transaction -> permissions(transaction, ctx),
                userService.today(ctx.userId()));
    }

    /**
     * A series just generated to the horizon joins the plan, so the plan's mark cannot claim more than
     * the horizon: a read past it extends the new series too.
     */
    private void coverOpenEndedSeries(RecurrenceDefinition definition) {
        definition.getPlan().lowerSeriesGeneratedUntil(seriesProperties.horizonFrom(LocalDate.now(clock)));
    }

    @Transactional
    public TransactionDeletedResponse deleteSeries(
            String seriesId, SeriesEditScope scope, Long pivotOccurrenceId, PlanContext ctx) {
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

        TransactionDeletion deletion = transactionDeletionRepository.save(
                TransactionDeletion.ofSeries(plan(ctx), user(ctx), clock.instant(), scope));
        inScope.forEach(occurrence -> occurrence.trash(deletion));

        if (definition != null) {
            changeSeriesFor(definition, deletion, scope, pivot, occurrences, inScope);
            recurrenceDefinitionRepository.saveAndFlush(definition);
            deletion.recordDefinitionVersion(definition.getRuleRevision());
        }
        return new TransactionDeletedResponse(deletion.getId());
    }

    /**
     * What the deletion does to the series, recorded on the deletion so a restore undoes it. A series left with
     * no occurrence goes to the trash whole; "only this" skips the date for good, and "this and following"
     * shrinks the range so a later regeneration does not recreate the removed tail.
     */
    private void changeSeriesFor(
            RecurrenceDefinition definition,
            TransactionDeletion deletion,
            SeriesEditScope scope,
            Transaction pivot,
            List<Transaction> occurrences,
            List<Transaction> inScope) {
        Set<Long> deletedIds = new HashSet<>();
        for (Transaction occurrence : inScope) {
            deletedIds.add(occurrence.getId());
        }
        List<Transaction> remaining = occurrences.stream()
                .filter(occurrence -> !deletedIds.contains(occurrence.getId()))
                .toList();

        if (remaining.isEmpty()) {
            deletion.recordTrashedDefinition(definition);
            definition.trash(deletion);
        } else if (scope == SeriesEditScope.THIS_ONE) {
            if (definition.except(pivot.getScheduledDate())) {
                deletion.recordException(definition, pivot.getScheduledDate());
            }
        } else if (scope == SeriesEditScope.THIS_AND_FOLLOWING) {
            LocalDate lastDate = remaining.stream()
                    .map(Transaction::getStartDate)
                    .max(LocalDate::compareTo)
                    .orElseThrow();
            deletion.recordPreviousEnd(definition);
            definition.shortenTo(remaining.size(), lastDate);
            deletion.recordCutEnd(definition);
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

    /**
     * The date the pivot moves to, or null when the edit leaves it where it is. "All" never moves a date, so the
     * past stays where it happened: it refuses another one.
     */
    private LocalDate requestedPivotDate(UpdateSeriesRequest dto, Transaction pivot, List<Transaction> occurrences) {
        if (dto.pivotDate() == null) {
            return null;
        }
        Transaction datePivot = pivot != null
                ? pivot
                : occurrences.stream()
                        .filter(occurrence -> occurrence.getId().equals(dto.pivotOccurrenceId()))
                        .findFirst()
                        .orElseThrow(TransactionExceptions.SeriesPivotNotFoundException::new);
        if (dto.pivotDate().equals(datePivot.getStartDate())) {
            return null;
        }
        if (dto.scope() == SeriesEditScope.ALL) {
            throw new TransactionExceptions.SeriesDateChangeInvalidException();
        }
        return dto.pivotDate();
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

        Transaction pivot = null;
        if (dto.scope() != SeriesEditScope.ALL) {
            Long pivotOccurrenceId = dto.pivotOccurrenceId();
            pivot = occurrences.stream()
                    .filter(occurrence -> occurrence.getId().equals(pivotOccurrenceId))
                    .findFirst()
                    .orElseThrow(TransactionExceptions.SeriesPivotNotFoundException::new);
        }

        // An occurrence edited alone keeps who it carries; an edit of the series keeps who the series carries.
        KeptParties kept = dto.scope() == SeriesEditScope.THIS_ONE ? KeptParties.of(pivot) : KeptParties.of(definition);
        RequestedSplit split = requestedSplit(series.participants(), series.splitMode(), kept, ctx);

        List<Transaction> inScope;
        switch (dto.scope()) {
            case THIS_ONE -> inScope = List.of(pivot);
            case THIS_AND_FOLLOWING -> {
                LocalDate pivotSlot = pivot.getScheduledDate();
                inScope = occurrences.stream()
                        .filter(occurrence -> !occurrence.getScheduledDate().isBefore(pivotSlot))
                        .toList();
            }
            case ALL -> inScope = occurrences;
            default -> throw new IllegalStateException("Unexpected series edit scope: " + dto.scope());
        }

        for (Transaction occurrence : inScope) {
            planAuthorization.requireCanModifyTransaction(ctx.role(), createdById(occurrence), ctx.userId());
        }

        // A share that shrinks gives back what repayments settled of it, so every contact the edit may touch is
        // locked before the split changes.
        Set<Long> contactIds = contactIds(split);
        inScope.forEach(occurrence -> contactIds.addAll(contactIds(occurrence)));
        lockContacts(contactIds, ctx);

        // Refused before anything changes, so a refused date change stores nothing.
        LocalDate pivotDate = requestedPivotDate(dto, pivot, occurrences);
        SeriesDateChange dateChange = dto.scope() == SeriesEditScope.THIS_AND_FOLLOWING && pivotDate != null
                ? SeriesDateChange.of(pivot, pivotDate, occurrences)
                : null;

        if (dto.scope() == SeriesEditScope.THIS_ONE) {
            String suffix = extractInstallmentSuffix(pivot.getDescription());
            pivot.edit(
                    new TransactionDetails(
                            category,
                            pivot.getType(),
                            series.amount(),
                            suffix != null ? series.description() + " " + suffix : series.description(),
                            pivotDate != null ? pivotDate : pivot.getStartDate(),
                            pivot.getEndDate(),
                            pivot.getParcelsNumber(),
                            pivot.getKind()),
                    split.mode(),
                    split.shares());
            if (dto.pivotConfirmed() != null) {
                pivot.markConfirmed(dto.pivotConfirmed());
            }

            transactionRepository.saveAndFlush(pivot);
            fitAllocations(pivot);
            return TransactionSeriesResponse.from(
                    List.of(pivot), transaction -> permissions(transaction, ctx), userService.today(ctx.userId()));
        }

        // The flag goes first: occurrences created by the regeneration below take it from the definition.
        if (series.requiresConfirmation() != null
                && series.requiresConfirmation() != definition.isRequiresConfirmation()) {
            definition.changeRequiresConfirmation(
                    series.requiresConfirmation(), inScope, userService.today(ctx.userId()));
        }
        boolean endTyped = !Objects.equals(series.endDate(), definition.getEndDate());
        definition.editPattern(new SeriesPattern(
                category,
                series.amount(),
                series.description(),
                series.parcelsNumber(),
                series.endDate(),
                split.mode(),
                split.shares()));

        if (dateChange != null) {
            dateChange.apply(definition, occurrences, endTyped);
        }
        LocalDate pivotSlot = dto.scope() == SeriesEditScope.ALL ? null : pivot.getScheduledDate();

        SeriesRegenerator.SeriesEditResult result =
                seriesRegenerator.reconcile(definition, occurrences, split.shares(), dto.scope(), pivotSlot);

        // The Status control shows the pivot's status in every scope, so it is applied after the regeneration,
        // which may otherwise have left the pivot frozen as confirmed.
        Long pivotOccurrenceId = dto.pivotOccurrenceId();
        if (dto.pivotConfirmed() != null && pivotOccurrenceId != null) {
            occurrences.stream()
                    .filter(occurrence -> occurrence.getId().equals(pivotOccurrenceId))
                    .filter(occurrence -> !result.toDelete().contains(occurrence))
                    .findFirst()
                    .ifPresent(occurrence -> occurrence.markConfirmed(dto.pivotConfirmed()));
        }

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
                            .map(Transaction::getScheduledDate)
                            .max(LocalDate::compareTo)
                            .orElse(definition.getGeneratedThrough());
            definition.markGeneratedThrough(generatedThrough);
        }

        if (definition.getMode() == RecurrenceMode.RECURRING && definition.getEndDate() == null) {
            coverOpenEndedSeries(definition);
        }
        recurrenceDefinitionRepository.saveAndFlush(definition);
        combined.forEach(this::fitAllocations);

        return TransactionSeriesResponse.from(
                combined, transaction -> permissions(transaction, ctx), userService.today(ctx.userId()));
    }
}
