package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** The read tools, called through {@code /mcp}, against what the app's own endpoints answer for the same plan. */
class McpReadToolsIT extends AbstractMcpIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    private void transaction(
            Plan plan,
            User user,
            String description,
            String amount,
            TransactionType type,
            LocalDate date,
            Category category) {
        fixtures.aTransaction(new TransactionDraft(
                plan,
                user,
                new TransactionDetails(category, type, new BigDecimal(amount), description, date, null, null),
                SplitMode.EQUAL,
                List.of(new Share(user, null)),
                List.of(),
                null,
                null));
    }

    private static List<String> descriptions(JsonNode page) {
        List<String> descriptions = new ArrayList<>();
        page.path("transactions")
                .forEach(row -> descriptions.add(row.path("description").asString()));
        return descriptions;
    }

    @Test
    void listCategories() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        fixtures.aCategory(plan, TransactionType.DEBIT, "Market", food);
        fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        jdbc.update("UPDATE categories SET spending_limit = 500 WHERE id = ?", food.getId());

        JsonNode categories = clientOf(user).callJson("list_categories", Map.of());

        assertThat(categories).hasSize(3);
        JsonNode foodRow = categories.get(0);
        assertThat(foodRow.path("name").asString()).isEqualTo("Food");
        assertThat(foodRow.path("id").asLong()).isEqualTo(food.getId());
        assertThat(foodRow.path("monthlyLimit").decimalValue()).isEqualByComparingTo("500");
        assertThat(foodRow.path("parent").isNull()).isTrue();
        JsonNode marketRow = categories.get(1);
        assertThat(marketRow.path("name").asString()).isEqualTo("Market");
        assertThat(marketRow.path("parent").asString()).isEqualTo("Food");
        assertThat(marketRow.path("monthlyLimit").isNull()).isTrue();
        assertThat(categories.get(2).path("type").asString()).isEqualTo("CREDIT");
    }

    @Test
    void listTransactionsFilters() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado Básico");
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salário");
        LocalDate today = today();
        transaction(plan, user, "Mercado semanal", "100.00", TransactionType.DEBIT, today.minusDays(1), market);
        transaction(plan, user, "Salario", "3000.00", TransactionType.CREDIT, today.minusDays(2), salary);
        transaction(plan, user, "Posto", "50.00", TransactionType.DEBIT, today.minusDays(10), null);
        transaction(plan, user, "Mercado feira", "20.00", TransactionType.DEBIT, today.minusDays(40), market);
        transaction(plan, user, "Aluguel", "900.00", TransactionType.DEBIT, today.plusDays(30), null);
        McpClient client = clientOf(user);

        JsonNode everything = client.callJson("list_transactions", Map.of());
        assertThat(descriptions(everything))
                .containsExactly("Aluguel", "Mercado semanal", "Salario", "Posto", "Mercado feira");
        JsonNode first = everything.path("transactions").get(1);
        assertThat(first.path("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(first.path("date").asString()).isEqualTo(today.minusDays(1).toString());
        assertThat(first.path("type").asString()).isEqualTo("DEBIT");
        assertThat(first.path("category").asString()).isEqualTo("Mercado Básico");
        assertThat(first.path("status").asString()).isEqualTo("ACTUAL");
        assertThat(everything.path("transactions").get(0).path("status").asString())
                .isEqualTo("FORECAST");

        assertThat(descriptions(client.callJson("list_transactions", Map.of("text", "mercado"))))
                .containsExactly("Mercado semanal", "Mercado feira");
        assertThat(descriptions(client.callJson("list_transactions", Map.of("category", "MERCADO basico"))))
                .containsExactly("Mercado semanal", "Mercado feira");
        assertThat(descriptions(client.callJson("list_transactions", Map.of("type", "CREDIT"))))
                .containsExactly("Salario");
        assertThat(descriptions(client.callJson(
                        "list_transactions",
                        Map.of(
                                "from",
                                today.minusDays(12).toString(),
                                "to",
                                today.minusDays(1).toString()))))
                .containsExactly("Mercado semanal", "Salario", "Posto");
    }

    @Test
    void listTransactionsPages() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        for (int day = 0; day < 51; day++) {
            transaction(plan, user, "Row " + day, "1.00", TransactionType.DEBIT, today().minusDays(day), null);
        }
        McpClient client = clientOf(user);

        JsonNode firstPage = client.callJson("list_transactions", Map.of());
        assertThat(firstPage.path("transactions")).hasSize(50);
        assertThat(firstPage.path("matched").asLong()).isEqualTo(51);
        assertThat(firstPage.path("nextPage").asInt()).isEqualTo(1);
        assertThat(firstPage.path("note").asString()).contains("51", "page=1");

        JsonNode secondPage = client.callJson("list_transactions", Map.of("page", 1));
        assertThat(descriptions(secondPage)).containsExactly("Row 50");
        assertThat(secondPage.path("nextPage").isNull()).isTrue();
    }

    @Test
    void monthSummaryMatchesDashboard() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        YearMonth month = YearMonth.from(today());
        transaction(plan, user, "Salary", "5000.00", TransactionType.CREDIT, month.atDay(1), null);
        transaction(plan, user, "Rent", "1200.00", TransactionType.DEBIT, month.atDay(1), null);
        transaction(
                plan,
                user,
                "Trip",
                "800.00",
                TransactionType.DEBIT,
                month.atEndOfMonth().plusDays(0),
                null);
        McpClient client = clientOf(user);

        JsonNode dashboard = objectMapper.readTree(mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .param("startDate", month.atDay(1).toString())
                        .param("endDate", month.atEndOfMonth().toString()))
                .andReturn()
                .getResponse()
                .getContentAsString());

        JsonNode explicit = client.callJson("get_month_summary", Map.of("month", month.toString()));
        JsonNode omitted = client.callJson("get_month_summary", Map.of());

        assertThat(explicit.path("summary")).isEqualTo(dashboard);
        assertThat(omitted.path("summary")).isEqualTo(dashboard);
        assertThat(omitted.path("month").asString()).isEqualTo(month.toString());
        assertThat(omitted.path("plan").asString()).isEqualTo("Home");
        BigDecimal forecastExpenses = dashboard
                .path("totalExpenses")
                .decimalValue()
                .subtract(dashboard.path("actualExpenses").decimalValue());
        assertThat(omitted.path("forecastExpenses").decimalValue()).isEqualByComparingTo(forecastExpenses);
        assertThat(omitted.path("forecastIncome").decimalValue())
                .isEqualByComparingTo(dashboard
                        .path("totalIncome")
                        .decimalValue()
                        .subtract(dashboard.path("actualIncome").decimalValue()));
    }

    @Test
    void categorySpendingMatchesEndpoint() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        YearMonth month = YearMonth.from(today());
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        jdbc.update("UPDATE categories SET spending_limit = 400 WHERE id = ?", food.getId());
        transaction(plan, user, "Dinner", "150.00", TransactionType.DEBIT, month.atDay(1), food);

        JsonNode endpoint =
                objectMapper.readTree(mockMvc.perform(get(CategoryRoutes.CATEGORY + "/spending", plan.getId())
                                .with(testAuthHelper.asUser(user))
                                .param("startDate", month.atDay(1).toString())
                                .param("endDate", month.atEndOfMonth().toString()))
                        .andReturn()
                        .getResponse()
                        .getContentAsString());

        JsonNode tool = clientOf(user).callJson("get_category_spending", Map.of("month", month.toString()));

        assertThat(tool.path("categories")).isEqualTo(endpoint);
        assertThat(tool.path("categories").get(0).path("spent").decimalValue()).isEqualByComparingTo("150.00");
    }

    @Test
    void todayFollowsSavedTimeZone() throws Exception {
        // Of two zones a day apart, at least one is on another calendar day than UTC right now.
        ZoneId zone = List.of(ZoneId.of("Pacific/Kiritimati"), ZoneId.of("Etc/GMT+12")).stream()
                .filter(candidate -> !LocalDate.now(candidate).equals(LocalDate.now(ZoneOffset.UTC)))
                .findFirst()
                .orElseThrow();
        LocalDate userToday = LocalDate.now(zone);
        User user = userIn(zone.getId());
        Plan plan = plan(user, "Home", true);
        transaction(plan, user, "Due today", "10.00", TransactionType.DEBIT, userToday, null);
        transaction(plan, user, "Due tomorrow", "10.00", TransactionType.DEBIT, userToday.plusDays(1), null);

        JsonNode page = clientOf(user).callJson("list_transactions", Map.of());
        JsonNode summary = clientOf(user).callJson("get_month_summary", Map.of());

        assertThat(page.path("transactions").get(0).path("description").asString())
                .isEqualTo("Due tomorrow");
        assertThat(page.path("transactions").get(0).path("status").asString()).isEqualTo("FORECAST");
        assertThat(page.path("transactions").get(1).path("status").asString()).isEqualTo("ACTUAL");
        assertThat(summary.path("month").asString())
                .isEqualTo(YearMonth.from(userToday).toString());
    }

    @Test
    void readToolsAreReadOnly() throws Exception {
        User user = fixtures.aUser();

        JsonNode tools = clientOf(user).listTools();

        List<String> readTools = List.of(
                "list_plans", "list_categories", "list_transactions", "get_month_summary", "get_category_spending");
        for (String name : readTools) {
            JsonNode tool = null;
            for (JsonNode candidate : tools) {
                if (candidate.path("name").asString().equals(name)) {
                    tool = candidate;
                }
            }
            assertThat(tool).as("tool %s is listed", name).isNotNull();
            assertThat(tool.path("annotations").path("readOnlyHint").asBoolean())
                    .as("%s is read-only", name)
                    .isTrue();
        }
    }
}
