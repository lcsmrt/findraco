package com.lcs.findraco.plan.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "plan_invitations")
public class PlanInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false, foreignKey = @ForeignKey(name = "fk_plan_invitations_plan"))
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationType type;

    private String email;

    @Column(nullable = false, unique = true)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "invited_by",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_plan_invitations_invited_by"))
    private User invitedBy;

    @Column(name = "expires_at")
    private Instant expiresAt;

    public PlanInvitation() {}

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public PlanRole getRole() {
        return role;
    }

    public void setRole(PlanRole role) {
        this.role = role;
    }

    public InvitationType getType() {
        return type;
    }

    public void setType(InvitationType type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public User getInvitedBy() {
        return invitedBy;
    }

    public void setInvitedBy(User invitedBy) {
        this.invitedBy = invitedBy;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
