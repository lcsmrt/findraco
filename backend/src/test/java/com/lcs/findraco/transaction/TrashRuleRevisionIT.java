package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * A deletion is restored unless the series it belonged to was rewritten: another occurrence deleted or edited
 * "only this", or a flag flipped, leaves it restorable; a change to what the occurrences are generated from
 * does not.
 */
class TrashRuleRevisionIT extends AbstractIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;
    private static final LocalDate START = LocalDate.of(2026, 1, 15);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void restoreAfterAnotherOnlyThisDeleteSucceeds() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long april = occurrenceId(series, 3);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);
        deleteSeries(plan, owner, seriesId, "THIS_ONE", april);

        restore(plan, owner, marchDeletion)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.restored").value(1));

        assertThat(listedIds(plan, owner)).contains(march).doesNotContain(april);
    }

    @Test
    void restoreAfterAnOnlyThisEditSucceeds() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long may = occurrenceId(series, 4);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);

        Map<String, Object> edit = gym(START.plusMonths(4));
        edit.put("amount", new BigDecimal("95.00"));
        editSeries(plan, owner, seriesId, "THIS_ONE", may, edit).andExpect(status().isOk());

        restore(plan, owner, marchDeletion).andExpect(status().isOk());
        assertThat(fetch(plan, owner, march).get("amount").decimalValue()).isEqualByComparingTo("80.00");
        assertThat(fetch(plan, owner, may).get("amount").decimalValue()).isEqualByComparingTo("95.00");
    }

    @Test
    void restoreAfterAnAmountEditConflicts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);

        Map<String, Object> edit = gym(START.plusMonths(4));
        edit.put("amount", new BigDecimal("90.00"));
        editSeries(plan, owner, seriesId, "ALL", null, edit).andExpect(status().isOk());

        restore(plan, owner, marchDeletion).andExpect(problem(HttpStatus.CONFLICT, "trash-series-changed"));
        assertThat(jdbc.queryForObject(
                        "SELECT COUNT(*) FROM transaction_deletions WHERE id = ?", Long.class, marchDeletion))
                .isEqualTo(1);
        assertThat(listedIds(plan, owner)).doesNotContain(march);
        assertThat(jdbc.queryForList("SELECT exception_date::text FROM recurrence_exceptions", String.class))
                .containsExactly("2026-03-15");
    }

    @Test
    void restoreAfterTheEndChangedConflicts() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(7)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long june = occurrenceId(series, 5);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);
        long juneDeletion = deleteSeries(plan, owner, seriesId, "THIS_AND_FOLLOWING", june);

        restore(plan, owner, marchDeletion).andExpect(problem(HttpStatus.CONFLICT, "trash-series-changed"));

        restore(plan, owner, juneDeletion).andExpect(status().isOk());
        assertThat(listedIds(plan, owner)).contains(june).doesNotContain(march);
    }

    @Test
    void restoringOneDeletionKeepsAnotherRestorable() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(7)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long june = occurrenceId(series, 5);
        long juneDeletion = deleteSeries(plan, owner, seriesId, "THIS_AND_FOLLOWING", june);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);

        restore(plan, owner, juneDeletion).andExpect(status().isOk());
        restore(plan, owner, marchDeletion).andExpect(status().isOk());

        assertThat(listedIds(plan, owner)).contains(march, june);
    }

    @Test
    void restoreAfterAnyPatternChangeConflicts() throws Exception {
        Map<String, Consumer<PatternChange>> changes = new LinkedHashMap<>();
        changes.put("description", change -> change.edit().put("description", "Gym renamed"));
        changes.put(
                "category",
                change -> change.edit().put("categoryId", change.category().getId()));
        changes.put(
                "split",
                change -> change.edit()
                        .put(
                                "participants",
                                List.of(
                                        Map.of("memberId", change.owner().getId()),
                                        Map.of("memberId", change.other().getId()))));
        changes.put(
                "end date",
                change -> change.edit().put("endDate", START.plusMonths(3).toString()));

        for (Map.Entry<String, Consumer<PatternChange>> change : changes.entrySet()) {
            User owner = fixtures.aUser();
            User other = fixtures.aUser();
            Plan plan = fixtures.aPlan(owner);
            fixtures.addMember(plan, other, PlanRole.EDITOR);
            Category category = fixtures.aCategory(plan, TransactionType.DEBIT, "Health");
            JsonNode series = createSeries(plan, owner, gym(START.plusMonths(4)));
            String seriesId = series.get("seriesId").asString();
            long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", occurrenceId(series, 2));

            Map<String, Object> edit = gym(START.plusMonths(4));
            change.getValue().accept(new PatternChange(edit, owner, other, category));
            editSeries(plan, owner, seriesId, "ALL", null, edit).andExpect(status().isOk());

            restore(plan, owner, marchDeletion).andExpect(problem(HttpStatus.CONFLICT, "trash-series-changed"));
        }
    }

    @Test
    void flagOnlyEditKeepsTheDeletionRestorable() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode series = createSeries(plan, owner, gym(START.plusMonths(4)));
        String seriesId = series.get("seriesId").asString();
        long march = occurrenceId(series, 2);
        long marchDeletion = deleteSeries(plan, owner, seriesId, "THIS_ONE", march);

        Map<String, Object> edit = gym(START.plusMonths(4));
        edit.put("requiresConfirmation", true);
        editSeries(plan, owner, seriesId, "ALL", null, edit).andExpect(status().isOk());

        restore(plan, owner, marchDeletion).andExpect(status().isOk());
        assertThat(listedIds(plan, owner)).contains(march);
    }

    private record PatternChange(Map<String, Object> edit, User owner, User other, Category category) {}

    // --- helpers -----------------------------------------------------------------------------------------

    private Map<String, Object> gym(LocalDate end) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("80.00"));
        body.put("description", "Gym");
        body.put("mode", "RECURRING");
        body.put("startDate", START.toString());
        body.put("endDate", end.toString());
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        return body;
    }

    private JsonNode json(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }

    private static long occurrenceId(JsonNode series, int index) {
        return series.get("occurrences").get(index).get("id").asLong();
    }

    private JsonNode createSeries(Plan plan, User user, Map<String, Object> body) throws Exception {
        return json(mockMvc.perform(post(TX + "/series", plan.getId())
                        .with(testAuthHelper.asUser(user))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated()));
    }

    private ResultActions editSeries(
            Plan plan, User user, String seriesId, String scope, Long pivot, Map<String, Object> series)
            throws Exception {
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("scope", scope);
        if (pivot != null) {
            request.put("pivotOccurrenceId", pivot);
        }
        request.put("version", fixtures.seriesVersion(seriesId));
        request.put("series", series);
        return mockMvc.perform(put(TX + "/series/{seriesId}", plan.getId(), seriesId)
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
    }

    private long deleteSeries(Plan plan, User user, String seriesId, String scope, long pivot) throws Exception {
        return json(mockMvc.perform(delete(TX + "/series/{seriesId}", plan.getId(), seriesId)
                                .param("scope", scope)
                                .param("pivotOccurrenceId", Long.toString(pivot))
                                .with(testAuthHelper.asUser(user)))
                        .andExpect(status().isOk()))
                .get("deletionId")
                .asLong();
    }

    private ResultActions restore(Plan plan, User user, long deletionId) throws Exception {
        return mockMvc.perform(
                post(TX + "/trash/{id}/restore", plan.getId(), deletionId).with(testAuthHelper.asUser(user)));
    }

    private List<Long> listedIds(Plan plan, User user) throws Exception {
        JsonNode page =
                json(mockMvc.perform(get(TX, plan.getId()).param("size", "100").with(testAuthHelper.asUser(user)))
                        .andExpect(status().isOk()));
        List<Long> ids = new ArrayList<>();
        page.get("content").forEach(row -> ids.add(row.get("id").asLong()));
        return ids;
    }

    private JsonNode fetch(Plan plan, User user, long id) throws Exception {
        return json(mockMvc.perform(get(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk()));
    }
}
