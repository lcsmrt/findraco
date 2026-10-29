package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;

public class PlanResponseDto {
    private final Long id;
    private final String name;
    private final boolean isDefault;
    private final PlanRole myRole;

    public PlanResponseDto(PlanMembership membership) {
        Plan plan = membership.getPlan();
        this.id = plan.getId();
        this.name = plan.getName();
        this.isDefault = plan.isDefault();
        this.myRole = membership.getRole();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public PlanRole getMyRole() {
        return myRole;
    }
}
