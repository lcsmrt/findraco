package com.lcs.findraco.mcp.service;

import com.lcs.findraco.category.request.CategoryFilter;
import com.lcs.findraco.category.response.CategoryResponse;
import com.lcs.findraco.category.service.CategoryService;
import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.plan.service.PlanContext;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/** Finds a plan's categories and turns a spoken category name into one of them, by the same rule as plan names. */
@Service
public class McpCategoryResolver {

    private static final int PAGE_SIZE = 100;

    private final CategoryService categoryService;

    public McpCategoryResolver(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /** Every category of the plan, by name. */
    public List<CategoryResponse> all(PlanContext ctx) {
        List<CategoryResponse> categories = new ArrayList<>();
        Page<CategoryResponse> page;
        int number = 0;
        do {
            page = categoryService.findAllByPlanPaged(
                    new CategoryFilter(null, null, number++, PAGE_SIZE, null, null), ctx);
            categories.addAll(page.getContent());
        } while (page.hasNext());
        return categories;
    }

    public long resolve(String name, String planName, PlanContext ctx) {
        List<CategoryResponse> categories = all(ctx);
        List<CategoryResponse> matches = categories.stream()
                .filter(category -> McpNames.matches(name, category.description()))
                .toList();
        if (matches.isEmpty()) {
            throw new McpToolException("No category is named \"" + name.strip() + "\" in plan \"" + planName
                    + "\". Categories: "
                    + categories.stream().map(CategoryResponse::description).collect(Collectors.joining(", "))
                    + ".");
        }
        if (matches.size() > 1) {
            throw new McpToolException("Several categories of plan \"" + planName + "\" are named \"" + name.strip()
                    + "\" (ids "
                    + matches.stream().map(match -> String.valueOf(match.id())).collect(Collectors.joining(", "))
                    + "). Rename one of them in the app.");
        }
        return matches.get(0).id();
    }
}
