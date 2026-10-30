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
import java.util.UUID;

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

    @Column(name = "generated_through")
    private LocalDate generatedThrough;

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
        definition.firstParcel = draft.mode() == RecurrenceMode.INSTALLMENT
                ? (draft.currentParcel() != null ? draft.currentParcel() : 1)
                : null;
        definition.editPattern(new SeriesPattern(
                draft.category(),
                draft.amount(),
                draft.description(),
                draft.parcelsNumber(),
                draft.endDate(),
                draft.splitMode(),
                draft.participants()));
        return definition;
    }

    /**
     * Changes what the occurrences are generated from. The same rules as creation hold: a recurring
     * series never ends before it starts, and its category has the series' type.
     */
    public void editPattern(SeriesPattern pattern) {
        if (mode == RecurrenceMode.INSTALLMENT) {
            requireParcels(pattern.parcelsNumber());
        } else if (pattern.endDate() != null && startDate.isAfter(pattern.endDate())) {
            throw new TransactionExceptions.PeriodStartAfterEndException();
        }
        if (pattern.category() != null && pattern.category().getType() != type) {
            throw new TransactionExceptions.CategoryTypeMismatchException();
        }
        List<Share> split = SPLIT_RESOLVER.split(pattern.amount(), pattern.splitMode(), pattern.participants());

        category = pattern.category();
        amount = pattern.amount();
        description = pattern.description();
        parcelsNumber = pattern.parcelsNumber();
        endDate = pattern.endDate();
        splitMode = pattern.splitMode();
        applySplit(split);
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
    }

    /** Skips one date for good: neither generation nor a later edit produces an occurrence on it. */
    public void except(LocalDate date) {
        exceptions.add(date);
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
