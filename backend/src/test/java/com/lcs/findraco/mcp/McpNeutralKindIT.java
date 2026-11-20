package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** The movement kind through {@code /mcp}: what the tools accept, store and return. */
class McpNeutralKindIT extends AbstractMcpIntegrationTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTakesTheKind() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        McpClient client = clientOf(user);

        JsonNode bill = client.callJson(
                "create_transaction",
                Map.of("type", "DEBIT", "amount", 1500, "description", "Nubank bill", "kind", "CARD_BILL_PAYMENT"));
        JsonNode refund = client.callJson(
                "create_transaction",
                Map.of(
                        "type",
                        "CREDIT",
                        "amount",
                        50,
                        "description",
                        "Pizza back",
                        "category",
                        "Food",
                        "kind",
                        "REFUND"));
        String refused = errorText(client.callTool(
                "create_transaction",
                Map.of(
                        "type",
                        "DEBIT",
                        "amount",
                        500,
                        "description",
                        "To savings",
                        "category",
                        "Food",
                        "kind",
                        "SAVINGS")));

        assertThat(bill.path("transaction").path("kind").asString()).isEqualTo("CARD_BILL_PAYMENT");
        assertThat(stored(bill).getKind()).isEqualTo(TransactionKind.CARD_BILL_PAYMENT);
        assertThat(refund.path("transaction").path("kind").asString()).isEqualTo("REFUND");
        assertThat(stored(refund).getKind()).isEqualTo(TransactionKind.REFUND);
        assertThat(stored(refund).getType()).isEqualTo(TransactionType.CREDIT);
        assertThat(stored(refund).getCategory().getId()).isEqualTo(food.getId());
        assertThat(refused).contains("SAVINGS").contains("neutral kind").contains("no category");
        assertThat(transactionRepository.findAllByPlan(plan)).hasSize(2);
    }

    @Test
    void updateAndListCarryTheKind() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction row = transaction(plan, user, "Pix", "500.00", TransactionType.DEBIT, today(), null);
        McpClient client = clientOf(user);

        JsonNode marked = client.callJson("update_transaction", Map.of("id", row.getId(), "kind", "TRANSFER"));
        JsonNode listed = client.callJson("list_transactions", Map.of());
        String both = errorText(client.callTool(
                "update_transaction", Map.of("id", row.getId(), "kind", "SAVINGS", "removeKind", true)));
        JsonNode cleared = client.callJson("update_transaction", Map.of("id", row.getId(), "removeKind", true));
        JsonNode listedAfter = client.callJson("list_transactions", Map.of());

        assertThat(marked.path("transaction").path("kind").asString()).isEqualTo("TRANSFER");
        assertThat(stored(row.getId()).getKind()).isNull();
        assertThat(listed.path("transactions").get(0).path("kind").asString()).isEqualTo("TRANSFER");
        assertThat(both).contains("kind").contains("removeKind");
        assertThat(cleared.path("transaction").path("kind").isNull()).isTrue();
        assertThat(listedAfter.path("transactions").get(0).path("kind").isNull())
                .isTrue();
    }

    @Test
    void anEditThatSetsNoKindKeepsTheOneStored() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction row = transaction(plan, user, "Pix", "500.00", TransactionType.DEBIT, today(), null);
        McpClient client = clientOf(user);
        client.callJson("update_transaction", Map.of("id", row.getId(), "kind", "SAVINGS"));

        Map<String, Object> retitle = new HashMap<>();
        retitle.put("id", row.getId());
        retitle.put("description", "Cofrinho");
        JsonNode renamed = client.callJson("update_transaction", retitle);

        assertThat(renamed.path("transaction").path("kind").asString()).isEqualTo("SAVINGS");
        assertThat(stored(row.getId()).getKind()).isEqualTo(TransactionKind.SAVINGS);
    }

    @Test
    void summaryToolsUseTheNeutralRules() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category salary = fixtures.aCategory(plan, TransactionType.CREDIT, "Salary");
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Market");
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        LocalDate day = LocalDate.of(2026, 11, 10);
        transaction(plan, user, "Salary", "3000.00", TransactionType.CREDIT, day, salary);
        transaction(plan, user, "Market", "200.00", TransactionType.DEBIT, day, market);
        kinded(plan, user, "Bill", "1500.00", TransactionType.DEBIT, TransactionKind.CARD_BILL_PAYMENT);
        kinded(plan, user, "Pix", "500.00", TransactionType.DEBIT, TransactionKind.TRANSFER);
        transaction(plan, user, "Pizza", "100.00", TransactionType.DEBIT, day, food);
        McpClient client = clientOf(user);
        client.callJson(
                "create_transaction",
                Map.of(
                        "type",
                        "CREDIT",
                        "amount",
                        50,
                        "description",
                        "Pizza back",
                        "date",
                        "2026-11-10",
                        "category",
                        "Food",
                        "kind",
                        "REFUND"));
        JsonNode dashboard = objectMapper.readTree(mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .param("startDate", "2026-11-01")
                        .param("endDate", "2026-11-30"))
                .andReturn()
                .getResponse()
                .getContentAsString());

        JsonNode month = client.callJson("get_month_summary", Map.of("month", "2026-11"));
        JsonNode categories = client.callJson("get_category_spending", Map.of("month", "2026-11"));

        JsonNode summary = month.path("summary");
        assertThat(summary.path("totalIncome").decimalValue()).isEqualByComparingTo("3000.00");
        assertThat(summary.path("totalExpenses").decimalValue()).isEqualByComparingTo("250.00");
        assertThat(summary.path("neutralOut").decimalValue()).isEqualByComparingTo("2000.00");
        assertThat(summary).isEqualTo(dashboard);
        JsonNode foodRow = null;
        for (JsonNode category : categories.path("categories")) {
            if ("Food".equals(category.path("name").asString())) {
                foodRow = category;
            }
        }
        assertThat(foodRow).isNotNull();
        assertThat(foodRow.path("spent").decimalValue()).isEqualByComparingTo("50.00");
    }

    private void kinded(
            Plan plan, User user, String description, String amount, TransactionType type, TransactionKind kind) {
        Transaction row = transaction(plan, user, description, amount, type, LocalDate.of(2026, 11, 10), null);
        jdbc.update("UPDATE transactions SET kind = ? WHERE id = ?", kind.name(), row.getId());
    }

    private Transaction stored(JsonNode saved) {
        return stored(saved.path("transaction").path("id").asLong());
    }

    private Transaction stored(long id) {
        return transactionRepository.findById(id).orElseThrow();
    }
}
