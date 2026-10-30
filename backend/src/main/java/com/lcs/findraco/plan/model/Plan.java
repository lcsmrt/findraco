package com.lcs.findraco.plan.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "plans")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "is_default")
    private boolean isDefault;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "series_generated_until")
    private LocalDate seriesGeneratedUntil;

    public Plan() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Instant getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Instant deletedAt) {
        this.deletedAt = deletedAt;
    }

    /** Up to which date every open-ended series of the plan is generated; null until the first top-up. */
    public LocalDate getSeriesGeneratedUntil() {
        return seriesGeneratedUntil;
    }

    /** The open-ended series are now generated through {@code date}; a date before the current mark keeps it. */
    public void advanceSeriesGeneratedUntil(LocalDate date) {
        if (seriesGeneratedUntil == null || date.isAfter(seriesGeneratedUntil)) {
            seriesGeneratedUntil = date;
        }
    }

    /** A series generated only through {@code date} joined the plan, so the plan is covered no further. */
    public void lowerSeriesGeneratedUntil(LocalDate date) {
        if (seriesGeneratedUntil != null && seriesGeneratedUntil.isAfter(date)) {
            seriesGeneratedUntil = date;
        }
    }
}
