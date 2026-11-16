package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractMcpIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.ItemDraft;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.request.CreateSeriesRequest;
import com.lcs.findraco.transaction.service.TransactionService;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import org.aopalliance.intercept.MethodInterceptor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** {@code update_transaction}, through {@code /mcp}, checked against what the API stores afterwards. */
@Import(McpUpdateToolIT.ConcurrentEditConfig.class)
class McpUpdateToolIT extends AbstractMcpIntegrationTest {

    /** The transaction another member edits right after the tool reads it, or 0 for none. */
    private static final AtomicLong EDITED_AFTER_READ = new AtomicLong();

    /**
     * Lets a test play the other editor: once the tool has read the transaction and before it writes, the row's
     * version moves on, as if someone saved in between.
     */
    @TestConfiguration
    static class ConcurrentEditConfig {

        @Bean
        static BeanPostProcessor otherEditorAfterRead(ObjectProvider<JdbcTemplate> jdbc) {
            return new BeanPostProcessor() {
                @Override
                public Object postProcessAfterInitialization(Object bean, String beanName) {
                    if (!(bean instanceof TransactionService)) {
                        return bean;
                    }
                    ProxyFactory proxy = new ProxyFactory(bean);
                    proxy.setProxyTargetClass(true);
                    proxy.addAdvice((MethodInterceptor) invocation -> {
                        Object result = invocation.proceed();
                        long id = EDITED_AFTER_READ.getAndSet(0);
                        if (id != 0 && invocation.getMethod().getName().equals("getById")) {
                            jdbc.getObject().update("UPDATE transactions SET version = version + 1 WHERE id = ?", id);
                        }
                        return result;
                    });
                    return proxy.getProxy();
                }
            };
        }
    }

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void noEditorLeftWaiting() {
        EDITED_AFTER_READ.set(0);
    }

    private JsonNode stored(Plan plan, User reader, long id) throws Exception {
        return objectMapper.readTree(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(reader)))
                .andReturn()
                .getResponse()
                .getContentAsString());
    }

    private Transaction split(
            Plan plan, User creator, String amount, SplitMode mode, List<Share> shares, List<ItemDraft> items) {
        return fixtures.aTransaction(new TransactionDraft(
                plan,
                creator,
                new TransactionDetails(
                        null, TransactionType.DEBIT, new BigDecimal(amount), "Luz", today().minusDays(3), null, null),
                mode,
                shares,
                items,
                null,
                null));
    }

    @Test
    void updateKeepsItemsAndParticipants() throws Exception {
        User user = userIn("UTC");
        User teammate = fixtures.aUser();
        Plan plan = plan(user, "Home", true);
        fixtures.addMember(plan, teammate, PlanRole.EDITOR);
        Category food = fixtures.aCategory(plan, TransactionType.DEBIT, "Food");
        Transaction original = split(
                plan,
                user,
                "100.00",
                SplitMode.EQUAL,
                List.of(new Share(user, null), new Share(teammate, null)),
                List.of(
                        new ItemDraft("Bread", new BigDecimal("30.00"), 2, food),
                        new ItemDraft("Milk", new BigDecimal("20.00"), null, null)));

        JsonNode result = clientOf(user)
                .callJson(
                        "update_transaction",
                        Map.of("id", original.getId(), "amount", 200, "description", "Light bill"));

        assertThat(result.path("transaction").path("amount").decimalValue()).isEqualByComparingTo("200.00");
        JsonNode after = stored(plan, user, original.getId());
        assertThat(after.path("description").asString()).isEqualTo("Light bill");
        assertThat(after.path("startDate").asString())
                .isEqualTo(today().minusDays(3).toString());
        assertThat(after.path("createdBy").path("id").asLong()).isEqualTo(user.getId());
        assertThat(after.path("participants")).hasSize(2);
        assertThat(after.path("participants").get(0).path("shareAmount").decimalValue())
                .isEqualByComparingTo("100.00");
        assertThat(after.path("participants").get(1).path("shareAmount").decimalValue())
                .isEqualByComparingTo("100.00");
        assertThat(after.path("items")).hasSize(2);
        JsonNode bread = after.path("items").get(0);
        assertThat(bread.path("description").asString()).isEqualTo("Bread");
        assertThat(bread.path("amount").decimalValue()).isEqualByComparingTo("30.00");
        assertThat(bread.path("quantity").asInt()).isEqualTo(2);
        assertThat(bread.path("category").path("id").asLong()).isEqualTo(food.getId());
        assertThat(after.path("items").get(1).path("description").asString()).isEqualTo("Milk");
    }

    @Test
    void occurrenceEditIsThisOne() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        LocalDate start = today().plusMonths(1).withDayOfMonth(5);
        JsonNode series =
                objectMapper.readTree(mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId())
                                .with(testAuthHelper.asUser(user))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new CreateSeriesRequest(
                                        TransactionType.DEBIT,
                                        new BigDecimal("300.00"),
                                        "Rent",
                                        null,
                                        RecurrenceMode.RECURRING,
                                        start,
                                        null,
                                        null,
                                        RecurrenceInterval.MONTHLY,
                                        start.plusMonths(2),
                                        SplitMode.EQUAL,
                                        null))))
                        .andReturn()
                        .getResponse()
                        .getContentAsString());
        JsonNode occurrences = series.path("occurrences");
        assertThat(occurrences).hasSize(3);
        long second = occurrences.get(1).path("id").asLong();
        LocalDate movedTo = start.plusMonths(1).plusDays(3);

        JsonNode result = clientOf(user)
                .callJson(
                        "update_transaction",
                        Map.of("id", second, "amount", 350, "date", movedTo.toString(), "description", "Rent (late)"));

        assertThat(result.path("transaction").path("date").asString()).isEqualTo(movedTo.toString());
        JsonNode edited = stored(plan, user, second);
        assertThat(edited.path("amount").decimalValue()).isEqualByComparingTo("350.00");
        assertThat(edited.path("description").asString()).isEqualTo("Rent (late)");
        assertThat(edited.path("seriesId").asString())
                .isEqualTo(series.path("seriesId").asString());
        for (int index : List.of(0, 2)) {
            JsonNode untouched =
                    stored(plan, user, occurrences.get(index).path("id").asLong());
            assertThat(untouched.path("amount").decimalValue()).isEqualByComparingTo("300.00");
            assertThat(untouched.path("description").asString()).isEqualTo("Rent");
            assertThat(untouched.path("startDate").asString())
                    .isEqualTo(occurrences.get(index).path("startDate").asString());
        }
        assertThat(jdbc.queryForObject(
                        "SELECT amount FROM recurrence_definitions WHERE series_id = ?",
                        BigDecimal.class,
                        series.path("seriesId").asString()))
                .isEqualByComparingTo("300.00");
    }

    @Test
    void emptyUpdateIsToolError() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction original = transaction(plan, user, "Posto", "50.00", TransactionType.DEBIT, today(), null);
        long version = fixtures.transactionVersion(original.getId());

        String error = errorText(clientOf(user).callTool("update_transaction", Map.of("id", original.getId())));

        assertThat(error).contains("at least one of amount, date and description");
        assertThat(fixtures.transactionVersion(original.getId())).isEqualTo(version);
    }

    @Test
    void splitRulesOnAmountChange() throws Exception {
        User user = userIn("UTC");
        User teammate = fixtures.aUser();
        Plan plan = plan(user, "Home", true);
        fixtures.addMember(plan, teammate, PlanRole.EDITOR);
        Transaction equal = split(
                plan,
                user,
                "100.00",
                SplitMode.EQUAL,
                List.of(new Share(user, null), new Share(teammate, null)),
                List.of());
        Transaction exact = split(
                plan,
                user,
                "100.00",
                SplitMode.EXACT,
                List.of(new Share(user, new BigDecimal("60.00")), new Share(teammate, new BigDecimal("40.00"))),
                List.of());
        McpClient client = clientOf(user);

        client.callJson("update_transaction", Map.of("id", equal.getId(), "amount", 90));
        JsonNode recomputed = stored(plan, user, equal.getId()).path("participants");
        assertThat(recomputed.get(0).path("shareAmount").decimalValue()).isEqualByComparingTo("45.00");
        assertThat(recomputed.get(1).path("shareAmount").decimalValue()).isEqualByComparingTo("45.00");

        String refused = errorText(client.callTool("update_transaction", Map.of("id", exact.getId(), "amount", 90)));
        assertThat(refused).contains("fixed amounts", "Edit it in the app");
        JsonNode unchanged = stored(plan, user, exact.getId());
        assertThat(unchanged.path("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(unchanged.path("participants").get(0).path("shareAmount").decimalValue())
                .isEqualByComparingTo("60.00");

        client.callJson("update_transaction", Map.of("id", exact.getId(), "description", "Light"));
        assertThat(stored(plan, user, exact.getId())
                        .path("participants")
                        .get(1)
                        .path("shareAmount")
                        .decimalValue())
                .isEqualByComparingTo("40.00");
    }

    @Test
    void amountBelowItemsIsToolError() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction original = split(
                plan,
                user,
                "100.00",
                SplitMode.EQUAL,
                List.of(new Share(user, null)),
                List.of(new ItemDraft("Bread", new BigDecimal("50.00"), null, null)));
        long version = fixtures.transactionVersion(original.getId());

        String error =
                errorText(clientOf(user).callTool("update_transaction", Map.of("id", original.getId(), "amount", 40)));

        assertThat(error).containsIgnoringCase("items");
        assertThat(stored(plan, user, original.getId()).path("amount").decimalValue())
                .isEqualByComparingTo("100.00");
        assertThat(fixtures.transactionVersion(original.getId())).isEqualTo(version);
    }

    @Test
    void staleVersionIsToolError() throws Exception {
        User user = userIn("UTC");
        Plan plan = plan(user, "Home", true);
        Transaction original = transaction(plan, user, "Posto", "50.00", TransactionType.DEBIT, today(), null);
        EDITED_AFTER_READ.set(original.getId());

        String error =
                errorText(clientOf(user).callTool("update_transaction", Map.of("id", original.getId(), "amount", 60)));

        assertThat(error).contains("changed meanwhile", "nothing was saved");
        assertThat(stored(plan, user, original.getId()).path("amount").decimalValue())
                .isEqualByComparingTo("50.00");
    }

    @Test
    void viewerCannotEditAndHints() throws Exception {
        User owner = userIn("UTC");
        User viewer = fixtures.aUser();
        Plan plan = plan(owner, "Home", true);
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        plan(viewer, "Mine", true);
        Transaction original = transaction(plan, owner, "Posto", "50.00", TransactionType.DEBIT, today(), null);

        String error = errorText(clientOf(viewer)
                .callTool(
                        "update_transaction",
                        Map.of(
                                "id",
                                original.getId(),
                                "amount",
                                60,
                                "plan",
                                plan.getId().toString())));

        assertThat(error).contains("Viewers cannot modify");
        assertThat(stored(plan, owner, original.getId()).path("amount").decimalValue())
                .isEqualByComparingTo("50.00");
        JsonNode update = null;
        for (JsonNode tool : clientOf(viewer).listTools()) {
            if (tool.path("name").asString().equals("update_transaction")) {
                update = tool;
            }
        }
        assertThat(update).isNotNull();
        assertThat(update.path("annotations").path("destructiveHint").asBoolean())
                .isFalse();
        assertThat(update.path("annotations").path("idempotentHint").asBoolean())
                .isTrue();
    }
}
