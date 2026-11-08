package com.lcs.findraco.mcp.response;

import com.lcs.findraco.plan.model.PlanRole;

/** A plan of the caller as {@code list_plans} shows it. */
public record McpPlanResponse(long id, String name, PlanRole role, boolean isDefault) {}
