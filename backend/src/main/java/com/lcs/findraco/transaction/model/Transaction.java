package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private long version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;
    private String description;
    private String sourceRef;

    @Column(updatable = false)
    private String sourceText;

    @Column(name = "series_id")
    private String seriesId;

    private Integer parcelsNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recurrence_definition_id")
    private RecurrenceDefinition recurrenceDefinition;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "split_mode")
    private SplitMode splitMode = SplitMode.EQUAL;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TransactionItem> items = new ArrayList<>();

    protected Transaction() {}

    private static final SplitResolver SPLIT_RESOLVER = new SplitResolver();

    /** A new transaction; it is valid from the start, whichever path creates it. */
    public static Transaction create(TransactionDraft draft) {
        Transaction transaction = new Transaction();
        transaction.plan = draft.plan();
        transaction.createdBy = draft.createdBy();
        transaction.sourceRef = draft.sourceRef();
        transaction.sourceText = draft.sourceText();
        if (draft.series() != null) {
            transaction.recurrenceDefinition = draft.series();
            transaction.seriesId = draft.series().getSeriesId();
        }
        transaction.edit(draft.details(), draft.splitMode(), draft.participants(), draft.items());
        return transaction;
    }

    /** Replaces everything a member edits: the details, the split and the items. */
    public void edit(TransactionDetails details, SplitMode mode, List<Share> shares, List<ItemDraft> newItems) {
        requireValid(details);
        List<Share> split = SPLIT_RESOLVER.split(details.amount(), mode, shares);
        requireItemsFit(newItems, details.type(), details.amount());

        apply(details);
        applySplit(mode, split);
        items.clear();
        newItems.forEach(item -> items.add(new TransactionItem(this, item)));
    }

    /** Changes the details and the split, keeping the items, which must still fit. */
    public void edit(TransactionDetails details, SplitMode mode, List<Share> shares) {
        requireValid(details);
        List<Share> split = SPLIT_RESOLVER.split(details.amount(), mode, shares);
        requireItemsFit(currentItems(), details.type(), details.amount());

        apply(details);
        applySplit(mode, split);
    }

    /** Splits the amount anew among {@code shares}. */
    public void replaceSplit(SplitMode mode, List<Share> shares) {
        applySplit(mode, SPLIT_RESOLVER.split(amount, mode, shares));
    }

    /** Replaces the breakdown; the items together never exceed the amount. */
    public void replaceItems(List<ItemDraft> newItems) {
        requireItemsFit(newItems, type, amount);
        items.clear();
        newItems.forEach(item -> items.add(new TransactionItem(this, item)));
    }

    private static void requireValid(TransactionDetails details) {
        if (details.endDate() != null && details.startDate().isAfter(details.endDate())) {
            throw new TransactionExceptions.PeriodStartAfterEndException();
        }
        if (details.category() != null && details.category().getType() != details.type()) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }
    }

    private static void requireItemsFit(List<ItemDraft> candidates, TransactionType type, BigDecimal amount) {
        BigDecimal total = BigDecimal.ZERO;
        for (ItemDraft item : candidates) {
            if (item.description() == null || item.description().isBlank()) {
                throw new TransactionExceptions.InvalidItemException("Item description cannot be blank.");
            }
            if (item.amount() == null || item.amount().signum() <= 0) {
                throw new TransactionExceptions.InvalidItemException("Item amount must be positive.");
            }
            if (item.category() != null && item.category().getType() != type) {
                throw new TransactionExceptions.ItemCategoryTypeMismatchException();
            }
            total = total.add(item.amount());
        }
        if (total.compareTo(amount) > 0) {
            throw new TransactionExceptions.ItemsTotalExceedsAmountException();
        }
    }

    private List<ItemDraft> currentItems() {
        return items.stream()
                .map(item ->
                        new ItemDraft(item.getDescription(), item.getAmount(), item.getQuantity(), item.getCategory()))
                .toList();
    }

    private void apply(TransactionDetails details) {
        category = details.category();
        type = details.type();
        amount = details.amount();
        description = details.description();
        startDate = details.startDate();
        endDate = details.endDate();
        parcelsNumber = details.parcelsNumber();
    }

    /** Updates kept members in place, so the (transaction, member) unique key holds within one flush. */
    private void applySplit(SplitMode mode, List<Share> split) {
        splitMode = mode;
        Map<Long, TransactionParticipant> existingByMemberId = new HashMap<>();
        participants.forEach(
                participant -> existingByMemberId.put(participant.getMember().getId(), participant));

        Set<Long> keptMemberIds = new HashSet<>();
        for (Share share : split) {
            keptMemberIds.add(share.member().getId());
            TransactionParticipant existing =
                    existingByMemberId.get(share.member().getId());
            if (existing != null) {
                existing.changeShare(share.amount());
            } else {
                participants.add(new TransactionParticipant(this, share.member(), share.amount()));
            }
        }
        participants.removeIf(
                participant -> !keptMemberIds.contains(participant.getMember().getId()));
    }

    public Long getId() {
        return id;
    }

    public long getVersion() {
        return version;
    }

    public Plan getPlan() {
        return plan;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public Category getCategory() {
        return category;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public String getSourceRef() {
        return sourceRef;
    }

    /** The bank's text of an imported row; null for a row that did not come from a bank file. */
    public String getSourceText() {
        return sourceText;
    }

    public String getSeriesId() {
        return seriesId;
    }

    public Integer getParcelsNumber() {
        return parcelsNumber;
    }

    public RecurrenceDefinition getRecurrenceDefinition() {
        return recurrenceDefinition;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public SplitMode getSplitMode() {
        return splitMode;
    }

    public List<TransactionParticipant> getParticipants() {
        return Collections.unmodifiableList(participants);
    }

    public List<TransactionItem> getItems() {
        return Collections.unmodifiableList(items);
    }
}
