package com.lcs.findraco.transaction.model;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.OptimisticLock;

@Entity
@Table(name = "recurrence_definitions")
public class RecurrenceDefinition {
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
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "series_id")
    private String seriesId;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode")
    private RecurrenceMode mode;

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_interval")
    private RecurrenceInterval recurrenceInterval;

    private Integer parcelsNumber;

    @Column(name = "first_parcel")
    private Integer firstParcel;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "split_mode")
    private SplitMode splitMode = SplitMode.EQUAL;

    @Column(name = "requires_confirmation")
    private boolean requiresConfirmation;

    /**
     * Counts the changes to what the occurrences are generated from (amount, description, category, parcels,
     * end, split). A trashed row is restored against it, so an edit of something else leaves it alone.
     */
    @Column(name = "rule_revision")
    private long ruleRevision;

    // The mark moves with the calendar, not with a person's edit: it must not bump the version a trashed
    // series is restored against.
    @OptimisticLock(excluded = true)
    @Column(name = "generated_through")
    private LocalDate generatedThrough;

    /** The deletion that moved the whole series to the trash; null while it is active. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deletion_id")
    private TransactionDeletion deletion;

    @ElementCollection
    @CollectionTable(name = "recurrence_exceptions", joinColumns = @JoinColumn(name = "definition_id"))
    @Column(name = "exception_date")
    private Set<LocalDate> exceptions = new HashSet<>();

    @OneToMany(mappedBy = "definition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecurrenceDefinitionParticipant> participants = new ArrayList<>();

    protected RecurrenceDefinition() {}

    private static final SplitResolver SPLIT_RESOLVER = new SplitResolver();

    /** A new series under a fresh series id; it is valid from the start. */
    public static RecurrenceDefinition create(SeriesDraft draft) {
        if (draft.mode() == RecurrenceMode.INSTALLMENT) {
            requireParcels(draft.parcelsNumber());
            if (draft.currentParcel() != null
                    && (draft.currentParcel() < 1 || draft.currentParcel() > draft.parcelsNumber())) {
                throw new TransactionExceptions.SeriesCurrentParcelOutOfRangeException();
            }
        } else if (draft.interval() == null) {
            throw new TransactionExceptions.SeriesIntervalRequiredException();
        }

        RecurrenceDefinition definition = new RecurrenceDefinition();
        definition.plan = draft.plan();
        definition.createdBy = draft.createdBy();
        definition.seriesId = UUID.randomUUID().toString();
        definition.type = draft.type();
        definition.mode = draft.mode();
        definition.recurrenceInterval = draft.interval();
        definition.startDate = draft.startDate();
        definition.requiresConfirmation = draft.requiresConfirmation();
        definition.firstParcel = draft.mode() == RecurrenceMode.INSTALLMENT
                ? (draft.currentParcel() != null ? draft.currentParcel() : 1)
                : null;
        SeriesPattern pattern = new SeriesPattern(
                draft.category(),
                draft.amount(),
                draft.description(),
                draft.parcelsNumber(),
                draft.endDate(),
                draft.splitMode(),
                draft.participants());
        definition.applyPattern(pattern, definition.checkedSplit(pattern));
        return definition;
    }

    /**
     * Changes what the occurrences are generated from. The same rules as creation hold: a recurring
     * series never ends before it starts, and its category has the series' type.
     */
    public void editPattern(SeriesPattern pattern) {
        List<Share> split = checkedSplit(pattern);
        boolean changesRule = changesRule(pattern, split);
        applyPattern(pattern, split);
        if (changesRule) {
            ruleRevision++;
        }
    }

    private List<Share> checkedSplit(SeriesPattern pattern) {
        if (mode == RecurrenceMode.INSTALLMENT) {
            requireParcels(pattern.parcelsNumber());
        } else if (pattern.endDate() != null && startDate.isAfter(pattern.endDate())) {
            throw new TransactionExceptions.PeriodStartAfterEndException();
        }
        if (pattern.category() != null && pattern.category().getType() != type) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }
        return SPLIT_RESOLVER.split(pattern.amount(), pattern.splitMode(), pattern.participants());
    }

    private void applyPattern(SeriesPattern pattern, List<Share> split) {
        category = pattern.category();
        amount = pattern.amount();
        description = pattern.description();
        parcelsNumber = pattern.parcelsNumber();
        endDate = pattern.endDate();
        splitMode = pattern.splitMode();
        applySplit(split);
    }

    private boolean changesRule(SeriesPattern pattern, List<Share> split) {
        return !Objects.equals(categoryId(category), categoryId(pattern.category()))
                || amount.compareTo(pattern.amount()) != 0
                || !Objects.equals(description, pattern.description())
                || !Objects.equals(parcelsNumber, pattern.parcelsNumber())
                || !Objects.equals(endDate, pattern.endDate())
                || splitMode != pattern.splitMode()
                || !sharesByMember(participants.stream()
                                .map(participant -> new Share(participant.getMember(), participant.getShareAmount()))
                                .toList())
                        .equals(sharesByMember(split));
    }

    private static Long categoryId(Category category) {
        return category != null ? category.getId() : null;
    }

    /** Each member's share, scaled to cents so 60 and 60.00 are the same share. */
    private static Map<Long, BigDecimal> sharesByMember(List<Share> shares) {
        Map<Long, BigDecimal> byMember = new HashMap<>();
        shares.forEach(
                share -> byMember.put(share.member().getId(), share.amount().setScale(2, RoundingMode.HALF_UP)));
        return byMember;
    }

    /** Records the last occurrence generated so far, so a top-up continues after it. */
    public void markGeneratedThrough(LocalDate lastGenerated) {
        generatedThrough = lastGenerated;
    }

    /**
     * Ends the series at its {@code remaining} first occurrences, the last on {@code lastDate}, so a
     * later regeneration does not bring the removed tail back.
     */
    public void shortenTo(int remaining, LocalDate lastDate) {
        if (mode == RecurrenceMode.INSTALLMENT) {
            parcelsNumber = (firstParcel != null ? firstParcel : 1) + remaining - 1;
        } else {
            endDate = lastDate;
        }
        ruleRevision++;
    }

    /**
     * Skips one date for good: neither generation nor a later edit produces an occurrence on it. False when
     * the date was already skipped.
     */
    public boolean except(LocalDate date) {
        return exceptions.add(date);
    }

    /** Lets {@code date} produce an occurrence again; undoes {@link #except}. */
    public void unexcept(LocalDate date) {
        exceptions.remove(date);
    }

    /** Puts back how the series ended before {@link #shortenTo} cut it. */
    public void restoreEnd(Integer previousParcelsNumber, LocalDate previousEndDate) {
        parcelsNumber = previousParcelsNumber;
        endDate = previousEndDate;
    }

    /** Moves the series to the trash under {@code trashedBy}: top-up, the read horizon and every lookup skip it. */
    public void trash(TransactionDeletion trashedBy) {
        deletion = trashedBy;
    }

    public boolean isTrashed() {
        return deletion != null;
    }

    /** Takes the series out of the trash. */
    public void restore() {
        deletion = null;
    }

    /**
     * Sets whether occurrences wait for a confirmation and applies it to the {@code occurrences} still
     * forecast: turned off, an unconfirmed one becomes due on its date; turned on, one dated after
     * {@code today} waits for a confirmation. Past and confirmed occurrences keep what they are.
     */
    public void changeRequiresConfirmation(boolean required, List<Transaction> occurrences, LocalDate today) {
        requiresConfirmation = required;
        occurrences.forEach(occurrence -> occurrence.followSeriesFlag(required, today));
    }

    private static void requireParcels(Integer parcelsNumber) {
        if (parcelsNumber == null) {
            throw new TransactionExceptions.SeriesParcelsRequiredException();
        }
    }

    /** Updates kept members in place, so the (definition, member) unique key holds within one flush. */
    private void applySplit(List<Share> split) {
        Map<Long, RecurrenceDefinitionParticipant> existingByMemberId = new HashMap<>();
        participants.forEach(
                participant -> existingByMemberId.put(participant.getMember().getId(), participant));

        Set<Long> keptMemberIds = new HashSet<>();
        for (Share share : split) {
            keptMemberIds.add(share.member().getId());
            RecurrenceDefinitionParticipant existing =
                    existingByMemberId.get(share.member().getId());
            if (existing != null) {
                existing.changeShare(share.amount());
            } else {
                participants.add(new RecurrenceDefinitionParticipant(this, share.member(), share.amount()));
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

    public long getRuleRevision() {
        return ruleRevision;
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

    public String getSeriesId() {
        return seriesId;
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

    public RecurrenceMode getMode() {
        return mode;
    }

    public RecurrenceInterval getRecurrenceInterval() {
        return recurrenceInterval;
    }

    public Integer getParcelsNumber() {
        return parcelsNumber;
    }

    public Integer getFirstParcel() {
        return firstParcel;
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

    public boolean isRequiresConfirmation() {
        return requiresConfirmation;
    }

    public LocalDate getGeneratedThrough() {
        return generatedThrough;
    }

    public Set<LocalDate> getExceptions() {
        return Collections.unmodifiableSet(exceptions);
    }

    public List<RecurrenceDefinitionParticipant> getParticipants() {
        return Collections.unmodifiableList(participants);
    }
}
