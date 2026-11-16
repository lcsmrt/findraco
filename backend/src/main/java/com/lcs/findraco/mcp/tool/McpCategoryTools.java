package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.category.request.CategorySpendingFilter;
import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.category.service.CategorySpendingService;
import com.lcs.findraco.mcp.response.McpCategoryResponse;
import com.lcs.findraco.mcp.response.McpCategorySpendingResponse;
import com.lcs.findraco.mcp.service.McpCategoryResolver;
import com.lcs.findraco.mcp.service.McpMonth;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.user.service.UserService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class McpCategoryTools {

    private final McpToolRunner runner;
    private final McpCategoryResolver categories;
    private final CategorySpendingService spendingService;
    private final UserService userService;

    public McpCategoryTools(
            McpToolRunner runner,
            McpCategoryResolver categories,
            CategorySpendingService spendingService,
            UserService userService) {
        this.runner = runner;
        this.categories = categories;
        this.spendingService = spendingService;
        this.userService = userService;
    }

    @McpTool(
            name = "list_categories",
            title = "List categories",
            description = "Lists the categories of a plan with id, name, type (DEBIT for expenses, CREDIT for income), "
                    + "parent category name and monthly spending limit. Use the names when creating transactions.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult listCategories(
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("list_categories", plan, resolved -> {
            List<CategoryResponse> all = categories.all(resolved.ctx());
            Map<Long, String> names =
                    all.stream().collect(Collectors.toMap(CategoryResponse::id, CategoryResponse::description));
            return all.stream()
                    .map(category -> new McpCategoryResponse(
                            category.id(),
                            category.description(),
                            category.type(),
                            category.parentId() == null ? null : names.get(category.parentId()),
                            category.effectiveLimit()))
                    .toList();
        });
    }

    @McpTool(
            name = "get_category_spending",
            title = "Get category spending",
            description = "Shows each category's spending against its limit for a month: spent, limit, remaining, "
                    + "percent used and status, with the per-member split. Defaults to the current month.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult getCategorySpending(
            @McpToolParam(required = false, description = "Month as YYYY-MM; the current month when omitted")
                    String month,
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan("get_category_spending", plan, resolved -> {
            YearMonth period =
                    McpMonth.of(month, userService.today(resolved.ctx().userId()));
            return new McpCategorySpendingResponse(
                    resolved.name(),
                    period.toString(),
                    spendingService.getSpending(
                            new CategorySpendingFilter(period.atDay(1), period.atEndOfMonth()), resolved.ctx()));
        });
    }
}
