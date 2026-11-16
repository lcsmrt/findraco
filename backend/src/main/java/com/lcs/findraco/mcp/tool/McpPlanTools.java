package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.response.McpPlanResponse;
import com.lcs.findraco.mcp.service.McpPlanResolver;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.plan.response.PlanResponse;
import com.lcs.findraco.plan.service.PlanService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.util.List;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.stereotype.Component;

@Component
public class McpPlanTools {

    private final McpToolRunner runner;
    private final PlanService planService;

    public McpPlanTools(McpToolRunner runner, PlanService planService) {
        this.runner = runner;
        this.planService = planService;
    }

    @McpTool(
            name = "list_plans",
            title = "List plans",
            description = "Lists the user's active plans with id, name, the user's role in each and which one is the "
                    + "default. Other tools act on the default plan unless given a plan.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult listPlans() {
        return runner.onUser("list_plans", userId -> {
            List<PlanResponse> plans = planService.listPlans(userId);
            Long defaultId =
                    McpPlanResolver.defaultPlanOf(plans).map(PlanResponse::id).orElse(null);
            return plans.stream()
                    .map(plan -> new McpPlanResponse(
                            plan.id(), plan.name(), plan.myRole(), plan.id().equals(defaultId)))
                    .toList();
        });
    }
}
