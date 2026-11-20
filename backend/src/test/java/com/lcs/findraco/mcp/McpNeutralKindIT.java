package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionKind;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;

/** The movement kind through {@code /mcp}: what the tools accept, store and return. */
class McpNeutralKindIT extends AbstractMcpIntegrationTest {

    @Autowired
    private TransactionRepository transactionRepository;

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

    private Transaction stored(JsonNode saved) {
        return stored(saved.path("transaction").path("id").asLong());
    }

    private Transaction stored(long id) {
        return transactionRepository.findById(id).orElseThrow();
    }
}
