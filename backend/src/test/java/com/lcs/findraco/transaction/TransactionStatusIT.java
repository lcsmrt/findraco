package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** What a transaction reports as its status: derived from its confirmation, its date and the reader's today. */
class TransactionStatusIT extends AbstractIntegrationTest {

    private static final String EAST = "Pacific/Kiritimati";
    private static final String WEST = "Pacific/Pago_Pago";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private Clock clock;

    @Test
    void listReportsForecastAndActual() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        aTransaction(plan, owner, "Past", today().minusDays(10));
        aTransaction(plan, owner, "Future", today().plusDays(10));

        JsonNode list = list(plan, owner);

        assertThat(statusOf(list, "Past")).isEqualTo("ACTUAL");
        assertThat(statusOf(list, "Future")).isEqualTo("FORECAST");
    }

    @Test
    void oneOffIsByDate() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        MvcResult created = mockMvc.perform(post(TransactionRoutes.TRANSACTION, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "type",
                                "DEBIT",
                                "amount",
                                new BigDecimal("300.00"),
                                "description",
                                "Dentist",
                                "startDate",
                                today().plusDays(20).toString(),
                                "items",
                                List.of()))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode body = objectMapper.readTree(created.getResponse().getContentAsString());

        assertThat(body.get("requiresConfirmation").asBoolean()).isFalse();
        assertThat(body.get("status").asString()).isEqualTo("FORECAST");
        assertThat(jdbc.queryForObject("SELECT confirmation FROM transactions", String.class))
                .isEqualTo("BY_DATE");
    }

    @Test
    void statusUsesTheReadersToday() throws Exception {
        User east = fixtures.aUser();
        User west = fixtures.aUser();
        jdbc.update("UPDATE users SET time_zone = ? WHERE id = ?", EAST, east.getId());
        jdbc.update("UPDATE users SET time_zone = ? WHERE id = ?", WEST, west.getId());
        Plan plan = fixtures.aPlan(east);
        fixtures.addMember(plan, west, PlanRole.EDITOR);
        // The two zones are 25 hours apart, so the eastern reader's today is always after the western one.
        LocalDate eastToday = LocalDate.now(clock.withZone(ZoneId.of(EAST)));
        aTransaction(plan, east, "On the eastern today", eastToday);

        assertThat(statusOf(list(plan, east), "On the eastern today")).isEqualTo("ACTUAL");
        assertThat(statusOf(list(plan, west), "On the eastern today")).isEqualTo("FORECAST");
    }

    private void aTransaction(Plan plan, User creator, String description, LocalDate date) {
        TransactionDetails details = new TransactionDetails(
                null, TransactionType.DEBIT, new BigDecimal("50.00"), description, date, null, null);
        fixtures.aTransaction(new TransactionDraft(
                plan, creator, details, SplitMode.EQUAL, List.of(new Share(creator, null)), List.of(), null, null));
    }

    private JsonNode list(Plan plan, User reader) throws Exception {
        MvcResult result = mockMvc.perform(
                        get(TransactionRoutes.TRANSACTION, plan.getId()).with(testAuthHelper.asUser(reader)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("content");
    }

    private static String statusOf(JsonNode list, String description) {
        for (JsonNode row : list) {
            if (description.equals(row.get("description").asString())) {
                return row.get("status").asString();
            }
        }
        throw new AssertionError("No row described " + description);
    }
}
