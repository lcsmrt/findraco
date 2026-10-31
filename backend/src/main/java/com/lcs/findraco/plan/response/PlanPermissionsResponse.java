package com.lcs.findraco.plan.response;

/** What the caller may do in the plan, from its role; the server still checks every call. */
public record PlanPermissionsResponse(
        boolean createTransactions, boolean attributeToOthers, boolean manageCategories, boolean managePlan) {}
