package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.plan.response.PlanResponse;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

/**
 * Turns the {@code plan} argument of a tool (omitted, an id or a name) into one of the caller's active plans. Only the
 * caller's own plans are candidates, so another user's plan is as unknown as one that does not exist; the match is
 * then handed to the plan service, which checks membership and role like the API does.
 */
@Service
public class McpPlanResolver {

    private static final String NO_ACTIVE_PLAN = "You have no active plan.";

    private final PlanService planService;

    public McpPlanResolver(PlanService planService) {
        this.planService = planService;
    }

    /** A resolved plan: the context the services take, and the name Claude shows the user. */
    public record ResolvedPlan(PlanContext ctx, String name) {}

    public ResolvedPlan resolve(@Nullable String plan, long userId) {
        List<PlanResponse> plans = planService.listPlans(userId);
        PlanResponse resolved = plan == null || plan.isBlank() ? defaultPlan(plans) : named(plan, plans);
        return new ResolvedPlan(planService.resolveContext(resolved.id(), userId), resolved.name());
    }

    /** The plan the app opens: the one flagged default. */
    public static Optional<PlanResponse> defaultPlanOf(List<PlanResponse> plans) {
        return plans.stream().filter(PlanResponse::isDefault).findFirst();
    }

    private static PlanResponse defaultPlan(List<PlanResponse> plans) {
        return defaultPlanOf(plans)
                .orElseThrow(() -> new McpToolException(
                        plans.isEmpty()
                                ? NO_ACTIVE_PLAN
                                : "You have no default plan. Pass the plan argument. " + yourPlans(plans)));
    }

    private static PlanResponse named(String plan, List<PlanResponse> plans) {
        String spoken = plan.strip();
        Optional<PlanResponse> byId = plans.stream()
                .filter(candidate -> String.valueOf(candidate.id()).equals(spoken))
                .findFirst();
        if (byId.isPresent()) {
            return byId.get();
        }
        List<PlanResponse> matches = plans.stream()
                .filter(candidate -> McpNames.matches(spoken, candidate.name()))
                .toList();
        if (matches.isEmpty()) {
            throw new McpToolException("No plan is named \"" + spoken + "\". " + yourPlans(plans));
        }
        if (matches.size() > 1) {
            throw new McpToolException("Several plans are named \"" + spoken + "\": "
                    + matches.stream()
                            .map(match -> match.name() + " (id " + match.id() + ")")
                            .collect(Collectors.joining(", "))
                    + ". Pass the id of the one you mean.");
        }
        return matches.get(0);
    }

    /** What Claude is told to choose from; with nothing to choose from, that there is nothing. */
    private static String yourPlans(List<PlanResponse> plans) {
        return plans.isEmpty()
                ? NO_ACTIVE_PLAN
                : "Your plans: " + plans.stream().map(PlanResponse::name).collect(Collectors.joining(", ")) + ".";
    }
}
