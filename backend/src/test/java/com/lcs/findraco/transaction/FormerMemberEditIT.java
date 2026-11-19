package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Someone who left the plan stays on the rows they were split on, and those rows stay editable: an edit keeps
 * them and recalculates their share, while no row takes a former member on again.
 */
class FormerMemberEditIT extends AbstractIntegrationTest {

    private static final String TX = TransactionRoutes.TRANSACTION;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void editKeepingAFormerMemberRecalculatesTheirShare() throws Exception {
        User owner = fixtures.aUser();
        User ana = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.addMember(plan, ana, PlanRole.EDITOR);
        JsonNode created =
                json(createRow(plan, owner, "100.00", List.of(owner, ana)).andExpect(status().isCreated()));
        long id = created.get("id").asLong();
        leave(plan, ana);

        JsonNode edited = json(updateRow(plan, owner, id, "120.00", List.of(owner, ana), created.get("version"))
                .andExpect(status().isOk()));

        assertThat(sharesByMember(edited)).containsOnlyKeys(owner.getId(), ana.getId());
        assertThat(sharesByMember(edited).get(ana.getId())).isEqualByComparingTo("60.00");
        assertThat(sharesByMember(edited).get(owner.getId())).isEqualByComparingTo("60.00");
        assertThat(sharesByMember(fetch(plan, owner, id)).get(ana.getId())).isEqualByComparingTo("60.00");
    }

    @Test
    void seriesEditKeepingAFormerMemberSucceeds() throws Exception {
        User owner = fixtures.aUser();
        User ana = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.addMember(plan, ana, PlanRole.EDITOR);
        LocalDate start = LocalDate.of(2026, 1, 15);
        Map<String, Object> body = series("Gym", "80.00", start, List.of(owner, ana));
        JsonNode created = json(mockMvc.perform(post(TX + "/series", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated()));
        String seriesId = created.get("seriesId").asString();
        leave(plan, ana);

        Map<String, Object> edit = series("Gym", "90.00", start, List.of(owner, ana));
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("scope", "ALL");
        request.put("version", fixtures.seriesVersion(seriesId));
        request.put("series", edit);
        JsonNode edited = json(mockMvc.perform(put(TX + "/series/{seriesId}", plan.getId(), seriesId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk()));

        assertThat(edited.get("occurrences")).hasSize(3);
        for (JsonNode occurrence : edited.get("occurrences")) {
            assertThat(sharesByMember(occurrence)).containsOnlyKeys(owner.getId(), ana.getId());
            assertThat(sharesByMember(occurrence).get(ana.getId())).isEqualByComparingTo("45.00");
            assertThat(sharesByMember(occurrence).get(owner.getId())).isEqualByComparingTo("45.00");
        }
    }

    @Test
    void formerMemberCannotJoinANewRow() throws Exception {
        User owner = fixtures.aUser();
        User ana = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        fixtures.addMember(plan, ana, PlanRole.EDITOR);
        leave(plan, ana);
        JsonNode created = json(createRow(plan, owner, "100.00", List.of(owner)).andExpect(status().isCreated()));
        long id = created.get("id").asLong();
        long version = created.get("version").asLong();

        updateRow(plan, owner, id, "120.00", List.of(owner, ana), created.get("version"))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "participant-not-member"));
        createRow(plan, owner, "50.00", List.of(owner, ana))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "participant-not-member"));

        JsonNode after = fetch(plan, owner, id);
        assertThat(after.get("amount").decimalValue()).isEqualByComparingTo("100.00");
        assertThat(sharesByMember(after)).containsOnlyKeys(owner.getId());
        assertThat(after.get("version").asLong()).isEqualTo(version);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM transactions WHERE plan_id = ?", Long.class, plan.getId()))
                .isEqualTo(1);
    }

    private void leave(Plan plan, User user) {
        jdbc.update("DELETE FROM plan_memberships WHERE plan_id = ? AND user_id = ?", plan.getId(), user.getId());
    }

    private static List<Map<String, Object>> participants(List<User> members) {
        List<Map<String, Object>> list = new ArrayList<>();
        members.forEach(member -> list.add(Map.of("memberId", member.getId())));
        return list;
    }

    private ResultActions createRow(Plan plan, User user, String amount, List<User> members) throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Dinner");
        body.put("startDate", "2026-11-10");
        body.put("splitMode", "EQUAL");
        body.put("participants", participants(members));
        return mockMvc.perform(post(TX, plan.getId())
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private ResultActions updateRow(Plan plan, User user, long id, String amount, List<User> members, JsonNode version)
            throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", "Dinner");
        body.put("startDate", "2026-11-10");
        body.put("splitMode", "EQUAL");
        body.put("participants", participants(members));
        body.put("items", List.of());
        body.put("version", version.asLong());
        return mockMvc.perform(put(TX + "/{id}", plan.getId(), id)
                .with(testAuthHelper.asUser(user))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private Map<String, Object> series(String description, String amount, LocalDate start, List<User> members) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal(amount));
        body.put("description", description);
        body.put("mode", "RECURRING");
        body.put("startDate", start.toString());
        body.put("endDate", start.plusMonths(2).toString());
        body.put("interval", "MONTHLY");
        body.put("splitMode", "EQUAL");
        body.put("participants", participants(members));
        return body;
    }

    private JsonNode fetch(Plan plan, User user, long id) throws Exception {
        return json(mockMvc.perform(get(TX + "/{id}", plan.getId(), id).with(testAuthHelper.asUser(user)))
                .andExpect(status().isOk()));
    }

    private static Map<Long, BigDecimal> sharesByMember(JsonNode transaction) {
        Map<Long, BigDecimal> shares = new LinkedHashMap<>();
        transaction
                .get("participants")
                .forEach(participant -> shares.put(
                        participant.get("id").asLong(),
                        participant.get("shareAmount").decimalValue()));
        return shares;
    }

    private JsonNode json(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }
}
