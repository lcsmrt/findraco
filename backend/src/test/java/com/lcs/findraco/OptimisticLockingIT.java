package com.lcs.findraco;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Two members editing the same item: the second edit, based on what it read before the first, is refused. */
class OptimisticLockingIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void theSecondOfTwoTransactionEditsWithTheSameVersionIsRefusedAndTheFirstSplitSurvives() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);
        Map<String, Object> split =
                transaction("EQUAL", List.of(Map.of("memberId", owner.getId()), Map.of("memberId", partner.getId())));
        JsonNode created = read(perform(post(TransactionRoutes.TRANSACTION, plan.getId()), owner, split)
                .andExpect(status().isCreated()));
        long id = created.get("id").asLong();
        long readVersion = created.get("version").asLong();

        Map<String, Object> first = transaction(
                "EXACT",
                List.of(
                        Map.of("memberId", owner.getId(), "shareAmount", "70.00"),
                        Map.of("memberId", partner.getId(), "shareAmount", "30.00")));
        first.put("version", readVersion);
        JsonNode edited = read(perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id), owner, first)
                .andExpect(status().isOk()));
        assertThat(edited.get("version").asLong()).isGreaterThan(readVersion);

        Map<String, Object> second = transaction("EQUAL", List.of(Map.of("memberId", partner.getId())));
        second.put("version", readVersion);
        perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id), partner, second)
                .andExpect(problem(HttpStatus.CONFLICT, "stale-version"));

        JsonNode stored = read(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id)
                        .with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(stored.get("splitMode").asString()).isEqualTo("EXACT");
        assertThat(stored.get("participants")).hasSize(2);
        assertThat(shareOf(stored, owner)).isEqualTo("70.00");
        assertThat(shareOf(stored, partner)).isEqualTo("30.00");
        assertThat(stored.get("version").asLong())
                .isEqualTo(edited.get("version").asLong());
    }

    @Test
    void aTransactionEditWithoutAVersionIsInvalid() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long id = fixtures.aTransaction(plan, owner, new BigDecimal("100.00"), TransactionType.DEBIT)
                .getId();

        perform(put(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), id), owner, transaction("EQUAL", null))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
    }

    @Test
    void aSeriesEditBasedOnAnOldVersionIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = read(perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId()), owner, series())
                .andExpect(status().isCreated()));
        String seriesId = created.get("seriesId").asString();
        long pivotId = created.get("occurrences").get(0).get("id").asLong();
        long readVersion = definition(plan, owner, seriesId).get("version").asLong();

        Map<String, Object> thisOne = seriesEdit("60.00", "THIS_ONE", readVersion);
        thisOne.put("pivotOccurrenceId", pivotId);
        perform(put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId), owner, thisOne)
                .andExpect(status().isOk());

        perform(
                        put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId),
                        owner,
                        seriesEdit("80.00", "ALL", readVersion))
                .andExpect(problem(HttpStatus.CONFLICT, "stale-version"));

        JsonNode stored = definition(plan, owner, seriesId);
        assertThat(stored.get("amount").decimalValue()).isEqualByComparingTo("50.00");
        assertThat(stored.get("version").asLong()).isGreaterThan(readVersion);
    }

    @Test
    void aCategoryEditBasedOnAnOldVersionIsRefused() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = read(perform(post(CategoryRoutes.CATEGORY, plan.getId()), owner, category("Food", null))
                .andExpect(status().isCreated()));
        long id = created.get("id").asLong();
        long readVersion = created.get("version").asLong();

        perform(put(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id), owner, category("Groceries", readVersion))
                .andExpect(status().isOk());
        perform(put(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id), owner, category("Meals", readVersion))
                .andExpect(problem(HttpStatus.CONFLICT, "stale-version"));

        JsonNode stored = read(mockMvc.perform(
                        get(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isOk()));
        assertThat(stored.get("description").asString()).isEqualTo("Groceries");
    }

    private ResultActions perform(MockHttpServletRequestBuilder request, User asUser, Map<String, Object> body)
            throws Exception {
        return mockMvc.perform(request.with(testAuthHelper.asUser(asUser))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private JsonNode read(ResultActions actions) throws Exception {
        MvcResult result = actions.andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode definition(Plan plan, User asUser, String seriesId) throws Exception {
        return read(mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                        .with(testAuthHelper.asUser(asUser)))
                .andExpect(status().isOk()));
    }

    private static String shareOf(JsonNode transaction, User member) {
        for (JsonNode participant : transaction.get("participants")) {
            if (participant.get("id").asLong() == member.getId()) {
                return participant.get("shareAmount").decimalValue().setScale(2).toPlainString();
            }
        }
        throw new AssertionError("No participant " + member.getId());
    }

    private static Map<String, Object> transaction(String splitMode, List<Map<String, Object>> participants) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", "100.00");
        body.put("description", "Groceries");
        body.put("startDate", "2026-07-15");
        body.put("splitMode", splitMode);
        body.put("participants", participants);
        return body;
    }

    private static Map<String, Object> series() {
        Map<String, Object> body = new HashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", "50.00");
        body.put("description", "Gym");
        body.put("mode", "RECURRING");
        body.put("interval", "MONTHLY");
        body.put("startDate", "2026-01-01");
        body.put("endDate", "2026-06-01");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private static Map<String, Object> seriesEdit(String amount, String scope, long version) {
        Map<String, Object> body = series();
        body.put("amount", amount);
        body.put("scope", scope);
        body.put("version", version);
        return body;
    }

    private static Map<String, Object> category(String description, Long version) {
        Map<String, Object> body = new HashMap<>();
        body.put("type", "DEBIT");
        body.put("description", description);
        if (version != null) {
            body.put("version", version);
        }
        return body;
    }
}
