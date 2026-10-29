package com.lcs.findraco.plan.controller;

import com.lcs.findraco.shared.web.ApiRoutes;

public final class PlanRoutes {
    public static final String INVITATION = ApiRoutes.BASE + "/invitation";
    public static final String PLAN_INVITATION = ApiRoutes.PLAN + "/{planId}/invitation";

    private PlanRoutes() {}
}
