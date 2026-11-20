package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** {@code create_transaction} and {@code confirm_transaction}, through {@code /mcp}, checked against what the API stores. */
class McpCaptureToolsIT extends AbstractMcpIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    private long count() {
        return jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class);
    }

    /** The transaction as the API of the app returns it, to see what really got stored. */
    private JsonNode stored(Plan plan, User reader, long id) throws Exception {
        return objectMapper.readTree(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(reader)))
                .andReturn()
                .getResponse()
                .getContentAsString());
    }

    private Transaction awaitingConfirmation(Plan plan, User creator, String amount, List<User> members) {
        Transaction forecast = fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(
                        null, TransactionType.DEBIT, new BigDecimal(amount), "Luz", today().plusDays(5), null, null),
                SplitMode.EQUAL,
                members.stream().map(member -> new Share(member, null)).toList(),
                List.of(),
                null,
                null));
        jdbc.update("UPDATE transactions SET confirmation = 'REQUIRED' WHERE id = ?", forecast.getId());
        return forecast;
    }

    @Test
    void createPaidByCaller() throws Exception {
        User user = userIn("UTC");
        User teammate = fixtures.aUser();
        Plan plan = plan(user, "Home", true);
        fixtures.addMember(plan, teammate, PlanRole.EDITOR);

        JsonNode created = clientOf(user)
                .callJson("create_transaction", Map.of("type", "DEBIT", "amount", 42, "description", "Posto"));

        assertThat(count()).isEqualTo(1);
        JsonNode stored =
                stored(plan, user, created.path("transaction").path("id").asLong());
        assertThat(stored.path("createdBy").path("id").asLong()).isEqualTo(user.getId());
        assertThat(stored.path("participants")).hasSize(1);
        assertThat(stored.path("participants").get(0).path("id").asLong()).isEqualTo(user.getId());
        assertThat(stored.path("participants").get(0).path("shareAmount").decimalValue())
                .isEqualByComparingTo("42.00");
        assertThat(stored.path("splitMode").asString()).isEqualTo("EQUAL");
        assertThat(stored.path("parcelsNumber").isNull()).isTrue();
        assertThat(stored.path("seriesId").isNull()).isTrue();
        assertThat(stored.path("items")).isEmpty();
    }

    @Test
    void createDefaults() throws Exception {
        ZoneId zone = zoneOnAnotherDay();
        User user = userIn(zone.getId());
        Plan plan = plan(user, "Home", true);

        JsonNode created = clientOf(user)
                .callJson("create_transaction", Map.of("type", "DEBIT", "amount", 42, "description", "Posto"));

        JsonNode stored =
                stored(plan, user, created.path("transaction").path("id").asLong());
        assertThat(stored.path("startDate").asString())
                .isEqualTo(LocalDate.now(zone).toString());
        assertThat(stored.path("category").isNull()).isTrue();
    }

    @Test
    void createResolvesCategoryByName() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado Básico");
        fixtures.aCategory(plan, TransactionType.DEBIT, "Transporte");
        McpClient client = clientOf(user);

        JsonNode created = client.callJson(
                "create_transaction",
                Map.of("type", "DEBIT", "amount", 10, "description", "Pão", "category", "mercado basico"));
        assertThat(stored(plan, user, created.path("transaction").path("id").asLong())
                        .path("category")
                        .path("id")
                        .asLong())
                .isEqualTo(market.getId());

        String unknown = errorText(client.callTool(
                "create_transaction",
                Map.of("type", "DEBIT", "amount", 10, "description", "Pão", "category", "Lazer")));
        assertThat(unknown).contains("Mercado Básico", "Transporte");
        assertThat(count()).isEqualTo(1);
    }

    @Test
    void createRejectsInvalidInput() throws Exception {
        User user = userIn("UTC");
        plan(user, "Home", true);
        McpClient client = clientOf(user);
        Map<String, Object> valid = Map.of("type", "DEBIT", "amount", 42, "description", "Posto");

        record Case(String field, Object value) {}
        List<Case> cases = List.of(
                new Case("amount", 0),
                new Case("amount", -5),
                new Case("amount", 42.123),
                new Case("description", "   "),
                new Case("description", "x".repeat(256)));
        for (Case invalid : cases) {
            Map<String, Object> arguments = new HashMap<>(valid);
            arguments.put(invalid.field(), invalid.value());

            assertThat(errorText(client.callTool("create_transaction", arguments)))
                    .as("error for %s", invalid)
                    .startsWith(invalid.field() + ":");
        }
        assertThat(count()).isZero();
    }

    @Test
    void writeResultNamesPlan() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");

        JsonNode created = clientOf(user)
                .callJson(
                        "create_transaction",
                        Map.of(
                                "type",
                                "DEBIT",
                                "amount",
                                42.5,
                                "description",
                                "Lunch",
                                "category",
                                "Food",
                                "date",
                                "2026-03-04"));

        assertThat(created.path("plan").asString()).isEqualTo("Home");
        JsonNode transaction = created.path("transaction");
        assertThat(transaction.path("id").asLong()).isPositive();
        assertThat(transaction.path("description").asString()).isEqualTo("Lunch");
        assertThat(transaction.path("amount").decimalValue()).isEqualByComparingTo("42.50");
        assertThat(transaction.path("date").asString()).isEqualTo("2026-03-04");
        assertThat(transaction.path("type").asString()).isEqualTo("DEBIT");
        assertThat(transaction.path("category").asString()).isEqualTo(food.getDescription());
        assertThat(transaction.path("status").asString()).isEqualTo("ACTUAL");
    }

    @Test
    void createSchemaHasNoSeriesOrSplit() throws Exception {
        JsonNode tools = clientOf(fixtures.aUser()).listTools();

        JsonNode create = null;
        for (JsonNode tool : tools) {
            if (tool.path("name").asString().equals("create_transaction")) {
                create = tool;
            }
        }
        assertThat(create).isNotNull();
        JsonNode schema = create.path("inputSchema");
        assertThat(schema.path("properties").propertyNames())
                .containsExactlyInAnyOrder(
                        "type", "amount", "description", "date", "category", "plan", "attributedTo", "kind");
        assertThat(schema.path("required").valueStream().map(JsonNode::asString))
                .containsExactlyInAnyOrder("type", "amount", "description");
    }

    @Test
    void confirmRecordsRealAmountAndDate() throws Exception {
        ZoneId zone = zoneOnAnotherDay();
        User user = userIn(zone.getId());
        Plan plan = plan(user, "Home", true);
        Transaction forecast = awaitingConfirmation(plan, user, "150.00", List.of(user));
        McpClient client = clientOf(user);

        JsonNode withDate = client.callJson(
                "confirm_transaction", Map.of("id", forecast.getId(), "amount", 187, "date", "2026-03-04"));
        assertThat(withDate.path("transaction").path("id").asLong()).isEqualTo(forecast.getId());
        assertThat(withDate.path("transaction").path("amount").decimalValue()).isEqualByComparingTo("187.00");
        assertThat(withDate.path("transaction").path("date").asString()).isEqualTo("2026-03-04");
        assertThat(withDate.path("transaction").path("status").asString()).isEqualTo("ACTUAL");

        Transaction another = awaitingConfirmation(plan, user, "90.00", List.of(user));
        JsonNode today = client.callJson("confirm_transaction", Map.of("id", another.getId(), "amount", 95));
        assertThat(today.path("transaction").path("date").asString())
                .isEqualTo(LocalDate.now(zone).toString());
        assertThat(count()).isEqualTo(2);
    }

    @Test
    void confirmRecomputesEqualSplit() throws Exception {
        User user = userIn("UTC");
        User teammate = fixtures.aUser();
        Plan plan = plan(user, "Home", true);
        fixtures.addMember(plan, teammate, PlanRole.EDITOR);
        Transaction forecast = awaitingConfirmation(plan, user, "100.00", List.of(user, teammate));

        clientOf(user).callJson("confirm_transaction", Map.of("id", forecast.getId(), "amount", 187));

        JsonNode shares = stored(plan, user, forecast.getId()).path("participants");
        assertThat(shares).hasSize(2);
        assertThat(shares.get(0).path("shareAmount").decimalValue()).isEqualByComparingTo("93.50");
        assertThat(shares.get(1).path("shareAmount").decimalValue()).isEqualByComparingTo("93.50");
    }

    @Test
    void confirmNotAwaitingIsToolError() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction ordinary = transaction(plan, user, "Posto", "50.00", TransactionType.DEBIT, today(), null);

        String error =
                errorText(clientOf(user).callTool("confirm_transaction", Map.of("id", ordinary.getId(), "amount", 60)));

        assertThat(error).contains("not awaiting confirmation", "date or amount can be edited");
        assertThat(stored(plan, user, ordinary.getId()).path("amount").decimalValue())
                .isEqualByComparingTo("50.00");
    }

    @Test
    void roleMatrixForWrites() throws Exception {
        User owner = userIn("UTC");
        User editor = fixtures.aUser();
        User contributor = fixtures.aUser();
        User viewer = fixtures.aUser();
        User stranger = fixtures.aUser();
        Plan plan = plan(owner, "Home", true);
        fixtures.addMember(plan, editor, PlanRole.EDITOR);
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        for (User member : List.of(editor, contributor, viewer)) {
            plan(member, "Mine " + member.getId(), true);
        }
        plan(stranger, "Elsewhere", true);
        Map<String, Object> create = Map.of(
                "type",
                "DEBIT",
                "amount",
                42,
                "description",
                "Posto",
                "plan",
                plan.getId().toString());
        Transaction ownersForecast = awaitingConfirmation(plan, owner, "150.00", List.of(owner));
        Map<String, Object> confirm = Map.of(
                "id",
                ownersForecast.getId(),
                "amount",
                187,
                "plan",
                plan.getId().toString());

        // Refused, and nothing changes.
        assertThat(errorText(clientOf(viewer).callTool("create_transaction", create)))
                .contains("Viewers cannot create");
        assertThat(errorText(clientOf(viewer).callTool("confirm_transaction", confirm)))
                .contains("Viewers cannot modify");
        assertThat(errorText(clientOf(contributor).callTool("confirm_transaction", confirm)))
                .isEqualTo("You cannot modify a transaction created by another member.");
        assertThat(errorText(clientOf(stranger).callTool("create_transaction", create)))
                .contains("Elsewhere")
                .doesNotContain("Home");
        assertThat(count()).isEqualTo(1);
        assertThat(stored(plan, owner, ownersForecast.getId()).path("amount").decimalValue())
                .isEqualByComparingTo("150.00");

        // Allowed.
        assertThat(clientOf(contributor)
                        .callTool("create_transaction", create)
                        .path("isError")
                        .asBoolean())
                .isFalse();
        assertThat(clientOf(editor)
                        .callTool("confirm_transaction", confirm)
                        .path("isError")
                        .asBoolean())
                .isFalse();
        assertThat(count()).isEqualTo(2);
    }

    @Test
    void otherPlanIdNotFound() throws Exception {
        User user = userIn("UTC");
        plan(user, "Home", true);
        Plan other = plan(user, "Other", false);
        Transaction inOther = transaction(other, user, "Posto", "50.00", TransactionType.DEBIT, today(), null);

        String error =
                errorText(clientOf(user).callTool("confirm_transaction", Map.of("id", inOther.getId(), "amount", 60)));

        assertThat(error).contains("Transaction " + inOther.getId() + " not found");
    }

    @Test
    void writeHints() throws Exception {
        JsonNode tools = clientOf(fixtures.aUser()).listTools();

        JsonNode create = null;
        JsonNode confirm = null;
        for (JsonNode tool : tools) {
            switch (tool.path("name").asString()) {
                case "create_transaction" -> create = tool;
                case "confirm_transaction" -> confirm = tool;
                default -> {}
            }
        }
        assertThat(create.path("annotations").path("destructiveHint").asBoolean())
                .isFalse();
        assertThat(create.path("annotations").path("readOnlyHint").asBoolean()).isFalse();
        assertThat(confirm.path("annotations").path("destructiveHint").asBoolean())
                .isFalse();
        assertThat(confirm.path("annotations").path("idempotentHint").asBoolean())
                .isTrue();
    }
}
