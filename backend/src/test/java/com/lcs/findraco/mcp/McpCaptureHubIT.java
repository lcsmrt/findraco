package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.ItemDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * The tools of the capture hub - attribution on create, category on update, the status and uncategorized filters,
 * series and attribution on listed rows, delete and restore - through {@code /mcp}, checked against what the API
 * stores and lists.
 */
class McpCaptureHubIT extends AbstractMcpIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;

    @Autowired
    private ObjectMapper objectMapper;

    private User named(String name) {
        User user = userIn("UTC");
        jdbc.update("UPDATE users SET name = ? WHERE id = ?", name, user.getId());
        return user;
    }

    private User memberNamed(Plan plan, String name, PlanRole role) {
        User user = fixtures.aUser();
        jdbc.update("UPDATE users SET name = ? WHERE id = ?", name, user.getId());
        fixtures.addMember(plan, user, role);
        return user;
    }

    private long count() {
        return jdbc.queryForObject("SELECT count(*) FROM transactions", Long.class);
    }

    private JsonNode json(String body) throws Exception {
        return objectMapper.readTree(body);
    }

    private JsonNode stored(Plan plan, User reader, long id) throws Exception {
        return json(mockMvc.perform(get(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(reader)))
                .andReturn()
                .getResponse()
                .getContentAsString());
    }

    private List<Long> shareOwners(JsonNode transaction) {
        List<Long> owners = new ArrayList<>();
        transaction
                .path("participants")
                .forEach(share -> owners.add(share.path("id").asLong()));
        return owners;
    }

    private List<BigDecimal> shares(JsonNode transaction) {
        List<BigDecimal> shares = new ArrayList<>();
        transaction
                .path("participants")
                .forEach(share -> shares.add(share.path("shareAmount").decimalValue()));
        return shares;
    }

    private static List<String> texts(JsonNode array) {
        List<String> texts = new ArrayList<>();
        array.forEach(item -> texts.add(item.asString()));
        return texts;
    }

    private Map<String, Object> debit(String description, Object... extra) {
        Map<String, Object> arguments = new LinkedHashMap<>();
        arguments.put("type", "DEBIT");
        arguments.put("amount", 100);
        arguments.put("description", description);
        for (int i = 0; i < extra.length; i += 2) {
            arguments.put((String) extra[i], extra[i + 1]);
        }
        return arguments;
    }

    private Transaction row(
            Plan plan, User creator, String description, Category category, List<User> members, LocalDate date) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(
                        category, TransactionType.DEBIT, new BigDecimal("100.00"), description, date, null, null),
                SplitMode.EQUAL,
                members.stream().map(member -> new Share(member, null)).toList(),
                List.of(),
                null,
                null));
    }

    private JsonNode listed(McpClient client, Object... arguments) throws Exception {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < arguments.length; i += 2) {
            map.put((String) arguments[i], arguments[i + 1]);
        }
        return client.callJson("list_transactions", map);
    }

    private static List<Long> ids(JsonNode page) {
        List<Long> ids = new ArrayList<>();
        page.path("transactions").forEach(row -> ids.add(row.path("id").asLong()));
        return ids;
    }

    // --- S1: create for the right people ---

    @Test
    void createWithoutNamesAttributesTheCaller() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        memberNamed(plan, "Marina Souza", PlanRole.EDITOR);

        JsonNode created = clientOf(ana).callJson("create_transaction", debit("Posto", "amount", 42));

        assertThat(texts(created.path("transaction").path("attributedTo"))).containsExactly("Ana");
        JsonNode stored =
                stored(plan, ana, created.path("transaction").path("id").asLong());
        assertThat(shareOwners(stored)).containsExactly(ana.getId());
        assertThat(shares(stored).get(0)).isEqualByComparingTo("42.00");
    }

    @Test
    void createForOneNamedMemberAttributesTheWholeAmount() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        User marina = memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        McpClient client = clientOf(ana);

        for (String spoken : List.of("marina", "Marína Souza")) {
            JsonNode created =
                    client.callJson("create_transaction", debit("Farmácia", "attributedTo", List.of(spoken)));

            JsonNode stored =
                    stored(plan, ana, created.path("transaction").path("id").asLong());
            assertThat(shareOwners(stored)).as(spoken).containsExactly(marina.getId());
            assertThat(shares(stored).get(0)).isEqualByComparingTo("100.00");
            assertThat(texts(created.path("transaction").path("attributedTo"))).containsExactly("Marina");
        }
        assertThat(count()).isEqualTo(2);
    }

    @Test
    void createForSeveralNamesSplitsEqually() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        User marina = memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        User bia = memberNamed(plan, "Bia Costa", PlanRole.EDITOR);

        JsonNode created = clientOf(ana)
                .callJson("create_transaction", debit("Mercado", "attributedTo", List.of("Ana", "Marina", "Bia")));

        JsonNode viaTool =
                stored(plan, ana, created.path("transaction").path("id").asLong());
        assertThat(shares(viaTool))
                .usingComparatorForType(BigDecimal::compareTo, BigDecimal.class)
                .containsExactly(new BigDecimal("33.34"), new BigDecimal("33.33"), new BigDecimal("33.33"));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("100.00"));
        body.put("description", "Mercado by the app");
        body.put("startDate", today().toString());
        body.put("splitMode", "EQUAL");
        body.put(
                "participants",
                List.of(
                        Map.of("memberId", ana.getId()),
                        Map.of("memberId", marina.getId()),
                        Map.of("memberId", bia.getId())));
        JsonNode viaApp = json(mockMvc.perform(post(TX, plan.getId())
                        .with(testAuthHelper.asUser(ana))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
        assertThat(shares(viaTool))
                .usingComparatorForType(BigDecimal::compareTo, BigDecimal.class)
                .containsExactlyElementsOf(shares(viaApp));
        assertThat(shareOwners(viaTool)).containsExactly(ana.getId(), marina.getId(), bia.getId());
    }

    @Test
    void createWithAnUnknownOrAmbiguousNameIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        memberNamed(plan, "Marina Costa", PlanRole.EDITOR);
        memberNamed(plan, "Ana", PlanRole.EDITOR);
        McpClient client = clientOf(ana);

        String unknown =
                errorText(client.callTool("create_transaction", debit("Farmácia", "attributedTo", List.of("Zélia"))));
        String ambiguous =
                errorText(client.callTool("create_transaction", debit("Farmácia", "attributedTo", List.of("marina"))));
        String firstNameOfOneAndWholeNameOfAnother =
                errorText(client.callTool("create_transaction", debit("Farmácia", "attributedTo", List.of("ana"))));

        assertThat(unknown).contains("Zélia", "Ana Lima", "Marina Souza", "Marina Costa");
        assertThat(ambiguous).contains("Several", "Ana Lima", "Marina Souza", "Marina Costa");
        assertThat(firstNameOfOneAndWholeNameOfAnother).contains("Several", "Ana Lima", "Marina Souza");
        assertThat(count()).isZero();
    }

    @Test
    void createForSomeoneElseInASingleMemberPlanIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        McpClient client = clientOf(ana);

        String error =
                errorText(client.callTool("create_transaction", debit("Farmácia", "attributedTo", List.of("Marina"))));

        assertThat(error).contains("Marina", "Ana Lima");
        assertThat(count()).isZero();
        JsonNode own = client.callJson("create_transaction", debit("Posto", "attributedTo", List.of("ana")));
        assertThat(shareOwners(
                        stored(plan, ana, own.path("transaction").path("id").asLong())))
                .containsExactly(ana.getId());
    }

    // --- S2: fix and find ---

    @Test
    void updateWithCategorySetsItAndKeepsTheRest() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        User marina = memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");
        Transaction original = fixtures.aTransaction(new TransactionDraft(
                plan,
                ana,
                new TransactionDetails(
                        null,
                        TransactionType.DEBIT,
                        new BigDecimal("100.00"),
                        "Compras",
                        today().minusDays(2),
                        null,
                        null),
                SplitMode.EQUAL,
                List.of(new Share(ana, null), new Share(marina, null)),
                List.of(new ItemDraft("Pão", new BigDecimal("30.00"), 2, null)),
                null,
                null));
        JsonNode before = stored(plan, ana, original.getId());

        JsonNode result =
                clientOf(ana).callJson("update_transaction", Map.of("id", original.getId(), "category", "mercado"));

        assertThat(result.path("transaction").path("category").asString()).isEqualTo("Mercado");
        JsonNode after = stored(plan, ana, original.getId());
        assertThat(after.path("category").path("id").asLong()).isEqualTo(market.getId());
        assertThat(after.path("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(after.path("startDate")).isEqualTo(before.path("startDate"));
        assertThat(after.path("description").asString()).isEqualTo("Compras");
        assertThat(after.path("splitMode")).isEqualTo(before.path("splitMode"));
        assertThat(after.path("participants")).isEqualTo(before.path("participants"));
        assertThat(after.path("items")).hasSize(1);
        assertThat(after.path("items").get(0).path("description").asString()).isEqualTo("Pão");
        assertThat(after.path("items").get(0).path("amount").decimalValue()).isEqualByComparingTo("30.00");
        assertThat(after.path("items").get(0).path("quantity").asInt()).isEqualTo(2);
    }

    @Test
    void updateWithRemoveCategoryLeavesItUncategorized() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");
        Transaction original = row(plan, ana, "Compras", market, List.of(ana), today());

        clientOf(ana).callJson("update_transaction", Map.of("id", original.getId(), "removeCategory", true));

        assertThat(stored(plan, ana, original.getId()).path("category").isNull())
                .isTrue();
    }

    @Test
    void updateWithCategoryAndRemoveCategoryIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");
        fixtures.aCategory(plan, TransactionType.DEBIT, "Lazer");
        Transaction original = row(plan, ana, "Compras", market, List.of(ana), today());
        long version = fixtures.transactionVersion(original.getId());

        String error = errorText(clientOf(ana)
                .callTool(
                        "update_transaction",
                        Map.of("id", original.getId(), "category", "Lazer", "removeCategory", true)));

        assertThat(error).contains("category", "removeCategory");
        JsonNode after = stored(plan, ana, original.getId());
        assertThat(after.path("category").path("id").asLong()).isEqualTo(market.getId());
        assertThat(fixtures.transactionVersion(original.getId())).isEqualTo(version);
    }

    @Test
    void updateWithACategoryOfTheOtherTypeIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        fixtures.aCategory(plan, TransactionType.CREDIT, "Salário");
        Transaction original = row(plan, ana, "Compras", null, List.of(ana), today());
        long version = fixtures.transactionVersion(original.getId());

        String error = errorText(
                clientOf(ana).callTool("update_transaction", Map.of("id", original.getId(), "category", "Salário")));

        assertThat(error).isEqualTo("Category does not match the transaction type.");
        assertThat(stored(plan, ana, original.getId()).path("category").isNull())
                .isTrue();
        assertThat(fixtures.transactionVersion(original.getId())).isEqualTo(version);
    }

    @Test
    void updateOfARowSharedWithAFormerMemberIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        User marina = memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");
        Transaction shared = row(plan, ana, "Compras", null, List.of(ana, marina), today());
        jdbc.update("DELETE FROM plan_memberships WHERE plan_id = ? AND user_id = ?", plan.getId(), marina.getId());
        long version = fixtures.transactionVersion(shared.getId());

        String error = errorText(
                clientOf(ana).callTool("update_transaction", Map.of("id", shared.getId(), "category", "Mercado")));

        assertThat(error)
                .isEqualTo("This transaction is shared with someone who is no longer in the plan, "
                        + "so it cannot be changed through Claude.");
        JsonNode after = stored(plan, ana, shared.getId());
        assertThat(after.path("category").isNull()).isTrue();
        assertThat(shareOwners(after)).containsExactly(ana.getId(), marina.getId());
        assertThat(fixtures.transactionVersion(shared.getId())).isEqualTo(version);
    }

    @Test
    void listUncategorizedReturnsOnlyRowsWithoutCategory() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        Category market = fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");
        Transaction bare = row(plan, ana, "Sem categoria", null, List.of(ana), today());
        Transaction alsoBare = row(plan, ana, "Também sem", null, List.of(ana), today());
        row(plan, ana, "Com categoria", market, List.of(ana), today());
        row(plan, ana, "Outra com categoria", market, List.of(ana), today());

        JsonNode page = listed(clientOf(ana), "uncategorized", true);

        assertThat(ids(page)).containsExactlyInAnyOrder(bare.getId(), alsoBare.getId());
        assertThat(page.path("matched").asLong()).isEqualTo(2);
    }

    @Test
    void listPendingReturnsWhatAwaitsConfirmation() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        Transaction overdue = row(plan, ana, "Luz", null, List.of(ana), today().minusDays(3));
        Transaction ahead = row(plan, ana, "Água", null, List.of(ana), today().plusDays(3));
        Transaction ordinary = row(plan, ana, "Posto", null, List.of(ana), today().minusDays(3));
        jdbc.update(
                "UPDATE transactions SET confirmation = 'REQUIRED' WHERE id IN (?, ?)", overdue.getId(), ahead.getId());
        McpClient client = clientOf(ana);

        JsonNode pending = listed(client, "status", "PENDING");

        assertThat(ids(pending)).containsExactly(overdue.getId());
        JsonNode viaApp = json(mockMvc.perform(
                        get(TX, plan.getId()).with(testAuthHelper.asUser(ana)).param("status", "PENDING"))
                .andReturn()
                .getResponse()
                .getContentAsString());
        List<Long> appIds = new ArrayList<>();
        viaApp.path("content").forEach(item -> appIds.add(item.path("id").asLong()));
        assertThat(ids(pending)).isEqualTo(appIds);
        assertThat(ids(listed(client, "status", "FORECAST"))).containsExactly(ahead.getId());
        assertThat(ids(listed(client, "status", "ACTUAL"))).containsExactly(ordinary.getId());
    }

    @Test
    void listUncategorizedWithACategoryIsAToolError() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        fixtures.aCategory(plan, TransactionType.DEBIT, "Mercado");

        String error = errorText(
                clientOf(ana).callTool("list_transactions", Map.of("uncategorized", true, "category", "Mercado")));

        assertThat(error).contains("uncategorized");
    }

    @Test
    void listedRowsCarryAttributionAndSeries() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        User marina = memberNamed(plan, "Marina Souza", PlanRole.EDITOR);
        row(plan, ana, "Sozinha", null, List.of(ana), today());
        row(plan, ana, "Dividida", null, List.of(ana, marina), today());
        createSeries(plan, ana, installments("Notebook", LocalDate.of(2026, 1, 15), 6));
        createSeries(plan, ana, monthly("Streaming", today()));

        JsonNode rows = listed(clientOf(ana)).path("transactions");

        Map<String, JsonNode> byDescription = new LinkedHashMap<>();
        rows.forEach(item -> byDescription.put(item.path("description").asString(), item));
        assertThat(texts(byDescription.get("Sozinha").path("attributedTo"))).containsExactly("Ana");
        assertThat(texts(byDescription.get("Dividida").path("attributedTo"))).containsExactly("Ana", "Marina");
        assertThat(byDescription.get("Sozinha").path("series").isNull()).isTrue();
        assertThat(byDescription.get("Notebook (3/6)").path("series").asString())
                .isEqualTo("3/6");
        assertThat(byDescription.get("Streaming").path("series").asString()).isEqualTo("monthly");
    }

    // --- S3: delete a mistake, safely ---

    @Test
    void deleteASingleRowTrashesIt() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        Transaction keep = row(plan, ana, "Fica", null, List.of(ana), today());
        Transaction mistake = row(plan, ana, "Duplicada", null, List.of(ana), today());
        McpClient client = clientOf(ana);

        JsonNode deleted = client.callJson("delete_transaction", Map.of("id", mistake.getId()));

        assertThat(deleted.path("description").asString()).isEqualTo("Duplicada");
        assertThat(deleted.path("count").asLong()).isEqualTo(1);
        assertThat(ids(listed(client))).containsExactly(keep.getId());
        JsonNode trash = json(mockMvc.perform(get(TX + "/trash", plan.getId()).with(testAuthHelper.asUser(ana)))
                .andReturn()
                .getResponse()
                .getContentAsString());
        assertThat(trash.path("content")).hasSize(1);
        assertThat(trash.path("content").get(0).path("id").asLong())
                .isEqualTo(deleted.path("deletionId").asLong());
    }

    @Test
    void deleteAnOccurrenceDefaultsToThisOneAndHonoursScope() throws Exception {
        User ana = named("Ana Lima");
        Plan plan = plan(ana, "Home", true);
        McpClient client = clientOf(ana);
        JsonNode series = createSeries(plan, ana, installments("Notebook", LocalDate.of(2026, 1, 15), 6));
        long third = series.path("occurrences").get(2).path("id").asLong();
        long fourth = series.path("occurrences").get(3).path("id").asLong();

        JsonNode one = client.callJson("delete_transaction", Map.of("id", third));
        assertThat(one.path("count").asLong()).isEqualTo(1);
        assertThat(listed(client).path("transactions")).hasSize(5);

        JsonNode following = client.callJson("delete_transaction", Map.of("id", fourth, "scope", "THIS_AND_FOLLOWING"));
        assertThat(following.path("count").asLong()).isEqualTo(3);
        assertThat(listed(client).path("transactions")).hasSize(2);

        JsonNode rest = client.callJson(
                "delete_transaction",
                Map.of("id", series.path("occurrences").get(0).path("id").asLong(), "scope", "ALL"));
        assertThat(rest.path("count").asLong()).isEqualTo(2);
        assertThat(listed(client).path("transactions")).isEmpty();
    }

    @Test
    void restoreDeletionRestoresAndMapsServiceErrors() throws Exception {
        User ana = named("Ana Lima");
        User stranger = named("Estranho");
        Plan plan = plan(ana, "Home", true);
        plan(stranger, "Elsewhere", true);
        McpClient client = clientOf(ana);
        Transaction mistake = row(plan, ana, "Duplicada", null, List.of(ana), today());
        long deletionId = client.callJson("delete_transaction", Map.of("id", mistake.getId()))
                .path("deletionId")
                .asLong();

        JsonNode restored = client.callJson("restore_deletion", Map.of("deletionId", deletionId));

        assertThat(restored.path("restored").asLong()).isEqualTo(1);
        assertThat(ids(listed(client))).containsExactly(mistake.getId());
        assertThat(errorText(client.callTool("restore_deletion", Map.of("deletionId", deletionId))))
                .contains("Trash entry " + deletionId + " not found");
        long anotherDeletion = client.callJson("delete_transaction", Map.of("id", mistake.getId()))
                .path("deletionId")
                .asLong();
        assertThat(errorText(clientOf(stranger).callTool("restore_deletion", Map.of("deletionId", anotherDeletion))))
                .contains("not found");

        JsonNode series = createSeries(plan, ana, installments("Notebook", LocalDate.of(2026, 1, 15), 6));
        long third = series.path("occurrences").get(2).path("id").asLong();
        long seriesDeletion = client.callJson("delete_transaction", Map.of("id", third))
                .path("deletionId")
                .asLong();
        long other = series.path("occurrences").get(4).path("id").asLong();
        client.callJson("delete_transaction", Map.of("id", other));
        assertThat(errorText(client.callTool("restore_deletion", Map.of("deletionId", seriesDeletion))))
                .isEqualTo("The series was changed after this deletion, so it cannot be restored.");
    }

    @Test
    void deleteToolIsDestructiveAndNamesRestore() throws Exception {
        JsonNode tools = clientOf(fixtures.aUser()).listTools();

        JsonNode delete = null;
        for (JsonNode tool : tools) {
            if (tool.path("name").asString().equals("delete_transaction")) {
                delete = tool;
            }
        }
        assertThat(delete).isNotNull();
        assertThat(delete.path("annotations").path("destructiveHint").asBoolean())
                .isTrue();
        assertThat(delete.path("description").asString()).contains("30 days", "restore_deletion");
    }

    @Test
    void deleteFollowsTheAppsRoleMatrix() throws Exception {
        User owner = named("Ana Lima");
        Plan plan = plan(owner, "Home", true);
        User contributor = memberNamed(plan, "Caio Dias", PlanRole.CONTRIBUTOR);
        User viewer = memberNamed(plan, "Vera Reis", PlanRole.VIEWER);
        plan(contributor, "Mine", true);
        plan(viewer, "Mine too", true);
        Map<String, Object> inHome = Map.of("plan", plan.getId().toString());
        Transaction owners = row(plan, owner, "Da Ana", null, List.of(owner), today());
        Transaction contributors = row(plan, contributor, "Do Caio", null, List.of(contributor), today());

        assertThat(errorText(clientOf(contributor).callTool("delete_transaction", with(inHome, "id", owners.getId()))))
                .isEqualTo("You cannot modify a transaction created by another member.");
        assertThat(errorText(clientOf(viewer).callTool("delete_transaction", with(inHome, "id", owners.getId()))))
                .contains("Viewers cannot modify");
        assertThat(errorText(clientOf(viewer).callTool("delete_transaction", with(inHome, "id", contributors.getId()))))
                .contains("Viewers cannot modify");
        assertThat(ids(listed(clientOf(owner)))).containsExactlyInAnyOrder(owners.getId(), contributors.getId());

        JsonNode own = clientOf(contributor).callJson("delete_transaction", with(inHome, "id", contributors.getId()));
        assertThat(own.path("count").asLong()).isEqualTo(1);
        assertThat(ids(listed(clientOf(owner)))).containsExactly(owners.getId());
    }

    private static Map<String, Object> with(Map<String, Object> base, String key, Object value) {
        Map<String, Object> map = new LinkedHashMap<>(base);
        map.put(key, value);
        return map;
    }

    private Map<String, Object> installments(String description, LocalDate start, int parcels) {
        Map<String, Object> body = monthly(description, start);
        body.put("mode", "INSTALLMENT");
        body.remove("interval");
        body.put("parcelsNumber", parcels);
        return body;
    }

    private Map<String, Object> monthly(String description, LocalDate start) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("300.00"));
        body.put("description", description);
        body.put("mode", "RECURRING");
        body.put("startDate", start.toString());
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private JsonNode createSeries(Plan plan, User user, Map<String, Object> body) throws Exception {
        return json(mockMvc.perform(post(TX + "/series", plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString());
    }
}
