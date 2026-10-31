package com.lcs.findraco.plan.model;

import com.lcs.findraco.user.model.User;
import jakarta.persistence.*;

@Entity
@Table(name = "plan_memberships")
public class PlanMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id")
    private Plan plan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private PlanRole role;

    public PlanMembership() {}

    public Long getId() {
        return id;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PlanRole getRole() {
        return role;
    }

    public void setRole(PlanRole role) {
        this.role = role;
    }
}
