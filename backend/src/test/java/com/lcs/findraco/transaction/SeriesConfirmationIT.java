package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** How a series' "requires confirmation" flag stamps, toggles and spares its occurrences (AVF-02). */
class SeriesConfirmationIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Autowired
    private OpenEndedSeriesTopUpService topUpService;

    /** Five monthly occurrences: two long past, one soon past, two ahead; none falls near today. */
    private LocalDate start() {
        return today().minusDays(70);
    }

    @Test
    void newSeriesRequiresConfirmationByDefault() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        JsonNode created = createSeries(plan, owner, recurringBody());

        assertThat(created.get("count").asInt()).isEqualTo(5);
        assertThat(fetchDefinition(plan, owner, created.get("seriesId").asString())
                        .get("requiresConfirmation")
                        .asBoolean())
                .isTrue();
        assertThat(confirmations()).containsExactly("REQUIRED", "REQUIRED", "REQUIRED", "REQUIRED", "REQUIRED");
    }

    @Test
    void flagChangeTouchesOnlyForecastOccurrences() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = createSeries(plan, owner, recurringBody());
        String seriesId = created.get("seriesId").asString();
        long second = created.get("occurrences").get(1).get("id").asLong();
        editOne(plan, owner, seriesId, second, "187.40", true);

        editSeries(plan, owner, seriesId, "ALL", null, "200.00", false);

        assertThat(confirmations()).containsExactly("BY_DATE", "CONFIRMED", "BY_DATE", "BY_DATE", "BY_DATE");

        editSeries(plan, owner, seriesId, "ALL", null, "200.00", true);

        assertThat(confirmations()).containsExactly("BY_DATE", "CONFIRMED", "BY_DATE", "REQUIRED", "REQUIRED");
    }

    @Test
    void pivotStatusIsOnlyWhatTheRequestSays() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = createSeries(plan, owner, recurringBody());
        String seriesId = created.get("seriesId").asString();
        long first = created.get("occurrences").get(0).get("id").asLong();
        long third = created.get("occurrences").get(2).get("id").asLong();

        editOne(plan, owner, seriesId, first, "200.00", true);
        editOne(plan, owner, seriesId, third, "123.00", null);

        assertThat(confirmations()).containsExactly("CONFIRMED", "REQUIRED", "REQUIRED", "REQUIRED", "REQUIRED");
        assertThat(amounts()).containsExactly("200.00", "200.00", "123.00", "200.00", "200.00");
    }

    @Test
    void allEditKeepsConfirmedOccurrences() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = createSeries(plan, owner, recurringBody());
        String seriesId = created.get("seriesId").asString();
        long second = created.get("occurrences").get(1).get("id").asLong();
        editOne(plan, owner, seriesId, second, "187.40", true);
        List<LocalDate> datesBefore = dates();

        editSeries(plan, owner, seriesId, "ALL", null, "250.00", true);

        assertThat(dates()).isEqualTo(datesBefore);
        assertThat(amounts()).containsExactly("250.00", "187.40", "250.00", "250.00", "250.00");
        assertThat(confirmations()).containsExactly("REQUIRED", "CONFIRMED", "REQUIRED", "REQUIRED", "REQUIRED");
    }

    @Test
    void followingEditKeepsConfirmedOccurrences() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        JsonNode created = createSeries(plan, owner, recurringBody());
        String seriesId = created.get("seriesId").asString();
        long first = created.get("occurrences").get(0).get("id").asLong();
        long fourth = created.get("occurrences").get(3).get("id").asLong();
        editOne(plan, owner, seriesId, fourth, "187.40", true);
        List<LocalDate> datesBefore = dates();

        editSeries(plan, owner, seriesId, "THIS_AND_FOLLOWING", first, "250.00", true);

        assertThat(dates()).isEqualTo(datesBefore);
        assertThat(amounts()).containsExactly("250.00", "250.00", "250.00", "187.40", "250.00");
    }

    @Test
    void topUpStampsTheFlag() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate topUpDay = LocalDate.of(2026, 7, 1);
        recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                plan,
                owner,
                null,
                TransactionType.DEBIT,
                new BigDecimal("200.00"),
                "Electricity",
                RecurrenceMode.RECURRING,
                RecurrenceInterval.MONTHLY,
                null,
                null,
                topUpDay.minusMonths(1),
                null,
                SplitMode.EQUAL,
                List.of(new Share(owner, null)),
                true)));

        topUpService.topUp(plan.getId(), topUpDay);

        assertThat(confirmations()).isNotEmpty().containsOnly("REQUIRED");
    }

    private List<String> confirmations() {
        return jdbc.queryForList("SELECT confirmation FROM transactions ORDER BY start_date", String.class);
    }

    private List<String> amounts() {
        return jdbc.queryForList("SELECT amount::text FROM transactions ORDER BY start_date", String.class);
    }

    private List<LocalDate> dates() {
        return jdbc.queryForList("SELECT start_date FROM transactions ORDER BY start_date", LocalDate.class);
    }

    private Map<String, Object> recurringBody() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "DEBIT");
        body.put("amount", new BigDecimal("200.00"));
        body.put("description", "Electricity");
        body.put("mode", "RECURRING");
        body.put("startDate", start().toString());
        body.put("interval", "MONTHLY");
        body.put("endDate", start().plusMonths(4).toString());
        body.put("splitMode", "EQUAL");
        return body;
    }

    private void editOne(Plan plan, User asUser, String seriesId, long pivotId, String amount, Boolean confirmed)
            throws Exception {
        Map<String, Object> request = editRequest(seriesId, "THIS_ONE", pivotId, amount, null);
        if (confirmed != null) {
            request.put("pivotConfirmed", confirmed);
        }
        sendEdit(plan, asUser, seriesId, request);
    }

    private void editSeries(
            Plan plan,
            User asUser,
            String seriesId,
            String scope,
            Long pivotId,
            String amount,
            boolean requiresConfirmation)
            throws Exception {
        sendEdit(plan, asUser, seriesId, editRequest(seriesId, scope, pivotId, amount, requiresConfirmation));
    }

    private Map<String, Object> editRequest(
            String seriesId, String scope, Long pivotId, String amount, Boolean requiresConfirmation) {
        Map<String, Object> series = recurringBody();
        series.put("amount", new BigDecimal(amount));
        if (requiresConfirmation != null) {
            series.put("requiresConfirmation", requiresConfirmation);
        }
        Map<String, Object> request = new LinkedHashMap<>();
        request.put("scope", scope);
        if (pivotId != null) {
            request.put("pivotOccurrenceId", pivotId);
        }
        request.put("version", fixtures.seriesVersion(seriesId));
        request.put("series", series);
        return request;
    }

    private void sendEdit(Plan plan, User asUser, String seriesId, Map<String, Object> request) throws Exception {
        mockMvc.perform(put(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    private JsonNode createSeries(Plan plan, User asUser, Map<String, Object> body) throws Exception {
        MvcResult result = mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId())
                        .with(testAuthHelper.asUser(asUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private JsonNode fetchDefinition(Plan plan, User asUser, String seriesId) throws Exception {
        MvcResult result = mockMvc.perform(
                        get(TransactionRoutes.TRANSACTION + "/series/{seriesId}", plan.getId(), seriesId)
                                .with(testAuthHelper.asUser(asUser)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }
}
