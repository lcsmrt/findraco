package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.user.model.User;

public record PlanMemberResponse(Long userId, String name, String email, PlanRole role) {

    public static PlanMemberResponse from(PlanMembership membership) {
        User user = membership.getUser();
        return new PlanMemberResponse(user.getId(), user.getName(), user.getEmail(), membership.getRole());
    }
}
