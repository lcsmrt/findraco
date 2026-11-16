package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.dashboard.request.DashboardFilter;
import com.lcs.findraco.dashboard.response.DashboardSummaryResponse;
import com.lcs.findraco.dashboard.service.DashboardService;
import com.lcs.findraco.mcp.response.McpSummaryResponse;
import com.lcs.findraco.mcp.service.McpMonth;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.user.service.UserService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.time.YearMonth;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class McpSummaryTools {

    private final McpToolRunner runner;
    private final DashboardService dashboardService;
    private final UserService userService;

    public McpSummaryTools(McpToolRunner runner, DashboardService dashboardService, UserService userService) {
        this.runner = runner;
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @McpTool(
            name = "get_month_summary",
            title = "Get month summary",
            description = "Summarises a month of a plan: income and expenses (all of them, and the actual part that "
                    + "already happened), the forecast still expected, and the breakdown per member. Defaults to "
                    + "the current month.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult getMonthSummary(
            @McpToolParam(required = false, description = "Month as YYYY-MM; the current month when omitted")
                    String month,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("get_month_summary", plan, resolved -> {
            YearMonth period =
                    McpMonth.of(month, userService.today(resolved.ctx().userId()));
            DashboardSummaryResponse summary = dashboardService.getSummary(
                    new DashboardFilter(period.atDay(1), period.atEndOfMonth(), null), resolved.ctx());
            return new McpSummaryResponse(
                    resolved.name(),
                    period.toString(),
                    summary,
                    summary.totalIncome().subtract(summary.actualIncome()),
                    summary.totalExpenses().subtract(summary.actualExpenses()));
        });
    }
}
