package com.lcs.findraco.transaction.model;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

/**
 * One delete action: the rows it moved to the trash point at it, and it records what the action changed on
 * the series they belong to, so a restore undoes the whole action. It is deleted when restored or purged.
 */
@Entity
@Table(name = "transaction_deletions")
public class TransactionDeletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deleted_by_user_id")
    private User deletedBy;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Enumerated(EnumType.STRING)
    private TransactionDeletionKind kind;

    @Enumerated(EnumType.STRING)
    private SeriesEditScope scope;

    @Column(name = "recurrence_definition_id")
    private Long recurrenceDefinitionId;

    @Column(name = "definition_version")
    private Long definitionVersion;

    @Column(name = "exception_date")
    private LocalDate exceptionDate;

    @Column(name = "previous_end_date")
    private LocalDate previousEndDate;

    @Column(name = "previous_parcels_number")
    private Integer previousParcelsNumber;

    @Column(name = "definition_trashed")
    private boolean definitionTrashed;

    protected TransactionDeletion() {}

    /** The deletion of one transaction. */
    public static TransactionDeletion ofTransaction(Plan plan, User deletedBy, Instant deletedAt) {
        return new TransactionDeletion(plan, deletedBy, deletedAt, TransactionDeletionKind.TRANSACTION, null);
    }

    /** The deletion of a scope of a series. */
    public static TransactionDeletion ofSeries(Plan plan, User deletedBy, Instant deletedAt, SeriesEditScope scope) {
        return new TransactionDeletion(plan, deletedBy, deletedAt, TransactionDeletionKind.SERIES, scope);
    }

    private TransactionDeletion(
            Plan plan, User deletedBy, Instant deletedAt, TransactionDeletionKind kind, SeriesEditScope scope) {
        this.plan = plan;
        this.deletedBy = deletedBy;
        this.deletedAt = deletedAt;
        this.kind = kind;
        this.scope = scope;
    }

    /** The deletion added {@code date} to the series' exceptions. */
    public void recordException(RecurrenceDefinition definition, LocalDate date) {
        recurrenceDefinitionId = definition.getId();
        exceptionDate = date;
    }

    /** The deletion is about to end the series earlier; this is how it ended before. */
    public void recordPreviousEnd(RecurrenceDefinition definition) {
        recurrenceDefinitionId = definition.getId();
        previousEndDate = definition.getEndDate();
        previousParcelsNumber = definition.getParcelsNumber();
    }

    /** The deletion moved the whole series to the trash. */
    public void recordTrashedDefinition(RecurrenceDefinition definition) {
        recurrenceDefinitionId = definition.getId();
        definitionTrashed = true;
    }

    /**
     * The rule revision the series had right after the deletion (stored in {@code definition_version}); a different
     * one at restore means the series' rule changed since.
     */
    public void recordDefinitionVersion(long version) {
        definitionVersion = version;
    }

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public User getDeletedBy() {
        return deletedBy;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public TransactionDeletionKind getKind() {
        return kind;
    }

    public SeriesEditScope getScope() {
        return scope;
    }

    public Long getRecurrenceDefinitionId() {
        return recurrenceDefinitionId;
    }

    public Long getDefinitionVersion() {
        return definitionVersion;
    }

    public LocalDate getExceptionDate() {
        return exceptionDate;
    }

    public LocalDate getPreviousEndDate() {
        return previousEndDate;
    }

    public Integer getPreviousParcelsNumber() {
        return previousParcelsNumber;
    }

    public boolean isDefinitionTrashed() {
        return definitionTrashed;
    }
}
