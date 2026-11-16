package com.lcs.findraco.mcp.response;

import com.lcs.findraco.category.response.CategorySpendingResponse;
import java.util.List;

/** Each category's spending against its limit for one month, as the Categories tab shows it. */
public record McpCategorySpendingResponse(String plan, String month, List<CategorySpendingResponse> categories) {}
