package com.lcs.findraco.plan.model;

import jakarta.persistence.*;
import java.time.Instant;
import org.jspecify.annotations.Nullable;

/**
 * A person of a plan with no login: a share of a transaction can go to them, and what they owe is tracked apart from
 * the plan's own spending. A contact is archived, never deleted, once anything refers to it.
 */
@Entity
@Table(name = "contacts")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private long version;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    private String name;

    @Column(name = "archived_at")
    private Instant archivedAt;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    protected Contact() {}

    /** A new, active contact of {@code plan}; the name is stored without the spaces around it. */
    public static Contact create(Plan plan, String name, Instant now) {
        Contact contact = new Contact();
        contact.plan = plan;
        contact.name = name.strip();
        contact.createdAt = now;
        return contact;
    }

    public void rename(String newName) {
        name = newName.strip();
    }

    public void archive(Instant now) {
        if (archivedAt == null) {
            archivedAt = now;
        }
    }

    public void unarchive() {
        archivedAt = null;
    }

    public boolean isArchived() {
        return archivedAt != null;
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

    public String getName() {
        return name;
    }

    public @Nullable Instant getArchivedAt() {
        return archivedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
