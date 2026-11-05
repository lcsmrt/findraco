package com.lcs.findraco.transaction;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Confirming an occurrence with what was really charged (AVF-02). */
class TransactionConfirmIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Test
    void confirmStoresAmountAndMovedDate() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode occurrence = createSeries(plan, owner).get("occurrences").get(2);
        long id = occurrence.get("id").asLong();
        LocalDate oldDate = LocalDate.parse(occurrence.get("startDate").asString());
        LocalDate newDate = oldDate.plusDays(2);

        confirm(plan, owner, id, "187.40", newDate, fixtures.transactionVersion(id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTUAL"))
                .andExpect(jsonPath("$.amount").value(187.40))
                .andExpect(jsonPath("$.startDate").value(newDate.toString()));

        assertThat(jdbc.queryForObject(
                        "SELECT amount::text || ' ' || start_date || ' ' || confirmation FROM transactions WHERE id = ?",
                        String.class,
                        id))
                .isEqualTo("187.40 " + newDate + " CONFIRMED");

        editAllTo(plan, owner, occurrence.get("seriesId").asString(), "250.00");

        assertThat(jdbc.queryForObject(
                        "SELECT count(*) FROM transactions WHERE start_date = ?", Integer.class, oldDate))
                .isZero();
        assertThat(jdbc.queryForObject("SELECT count(*) FROM transactions", Integer.class))
                .isEqualTo(5);
        assertThat(jdbc.queryForObject("SELECT amount::text FROM transactions WHERE id = ?", String.class, id))
                .isEqualTo("187.40");
    }

    @Test
    void confirmIsGuardedLikeEdit() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User contributor = fixtures.aUser();
        fixtures.addMember(plan, contributor, PlanRole.CONTRIBUTOR);
        User viewer = fixtures.aUser();
        fixtures.addMember(plan, viewer, PlanRole.VIEWER);
        User outsider = fixtures.aUser();
        fixtures.aPlan(outsider);
        long id = createSeries(plan, owner).get("occurrences").get(0).get("id").asLong();
        long version = fixtures.transactionVersion(id);
        LocalDate date = today();

        confirm(plan, viewer, id, "10.00", date, version).andExpect(problem(HttpStatus.FORBIDDEN, "insufficient-role"));
        confirm(plan, contributor, id, "10.00", date, version)
                .andExpect(problem(HttpStatus.FORBIDDEN, "not-transaction-creator"));
        confirm(plan, outsider, id, "10.00", date, version).andExpect(problem(HttpStatus.NOT_FOUND, "plan-not-found"));
        assertThat(jdbc.queryForObject("SELECT confirmation FROM transactions WHERE id = ?", String.class, id))
                .isEqualTo("REQUIRED");

        Plan otherPlan = fixtures.aPlan(outsider);
        confirm(otherPlan, outsider, id, "10.00", date, version)
                .andExpect(problem(HttpStatus.NOT_FOUND, "transaction-not-found"));
    }

    @Test
    void staleConfirmChangesNothing() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long id = createSeries(plan, owner).get("occurrences").get(0).get("id").asLong();

        confirm(plan, owner, id, "10.00", today(), fixtures.transactionVersion(id) + 1)
                .andExpect(problem(HttpStatus.CONFLICT, "stale-version"));

        assertThat(jdbc.queryForObject(
                        "SELECT amount::text || ' ' || confirmation FROM transactions WHERE id = ?", String.class, id))
                .isEqualTo("200.00 REQUIRED");
    }

    @Test
    void rejectsAZeroAmount() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long id = createSeries(plan, owner).get("occurrences").get(0).get("id").asLong();

        confirm(plan, owner, id, "0", today(), fixtures.transactionVersion(id))
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));

        assertThat(jdbc.queryForObject("SELECT confirmation FROM transactions WHERE id = ?", String.class, id))
                .isEqualTo("REQUIRED");
    }

    @Test
    void confirmingTwiceIsAConflict() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        long id = createSeries(plan, owner).get("occurrences").get(0).get("id").asLong();
        LocalDate date = LocalDate.parse(
                jdbc.queryForObject("SELECT start_date::text FROM transactions WHERE id = ?", String.class, id));
        confirm(plan, owner, id, "187.40", date, fixtures.transactionVersion(id))
                .andExpect(status().isOk());

        confirm(plan, owner, id, "150.00", date, fixtures.transactionVersion(id))
                .andExpect(problem(HttpStatus.CONFLICT, "transaction-not-awaiting-confirmation"));

        assertThat(jdbc.queryForObject("SELECT amount::text FROM transactions WHERE id = ?", String.class, id))
                .isEqualTo("187.40");
    }

    private ResultActions confirm(Plan plan, User caller, long id, String amount, LocalDate date, long version)
            throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("amount", new BigDecimal(amount));
        body.put("startDate", date.toString());
        body.put("version", version);
        return mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/{id}/confirm", plan.getId(), id)
                .with(testAuthHelper.asUser(caller))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    private Map<String, Object> seriesBody() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("200.00"));
        body.put("description", "Electricity");
        body.put("mode", "RECURRING");
        body.put("startDate", today().minusDays(70).toString());
        body.put("interval", "MONTHLY");
        body.put("endDate", today().minusDays(70).plusMonths(4).toString());
        body.put("splitMode", "EQUAL");
        return body;
    }

    private JsonNode createSeries(Plan plan, User owner) throws Exception {
        MvcResult result = mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(seriesBody())))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private void editAllTo(Plan plan, User owner, String seriesId, String amount) throws Exception {
        Map<String, Object> series = seriesBody();
        series.put("amount", new BigDecimal(amount));
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("scope", "ALL");
        request.put("version", fixtures.seriesVersion(seriesId));
        request.put("series", series);
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
