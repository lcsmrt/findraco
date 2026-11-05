package com.lcs.findraco.dashboard;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceInterval;
import com.lcs.findraco.transaction.model.RecurrenceMode;
import com.lcs.findraco.transaction.model.SeriesDraft;
import com.lcs.findraco.transaction.model.Share;
import com.lcs.findraco.transaction.model.SplitMode;
import com.lcs.findraco.transaction.model.TransactionDetails;
import com.lcs.findraco.transaction.model.TransactionDraft;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.RecurrenceDefinitionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** The month summary reads actual figures beside the totals, which count the forecast too (AVF-01). */
class DashboardActualIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RecurrenceDefinitionRepository recurrenceDefinitionRepository;

    @Test
    void summarySplitsActualFromForecast() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        aTransaction(plan, owner, TransactionType.CREDIT, "5000.00", today().minusDays(4));
        aTransaction(plan, owner, TransactionType.DEBIT, "2000.00", today().plusDays(15));

        JsonNode summary = summary(plan, owner);

        assertFigures(summary, "5000.00", "2000.00", "3000.00", "5000.00", "0", "5000.00");
    }

    @Test
    void pendingCountsOnlyInForecast() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        aPendingOccurrence(plan, owner, "200.00", today().minusDays(10));

        JsonNode summary = summary(plan, owner);

        assertFigures(summary, "0", "200.00", "-200.00", "0", "0", "0");
    }

    @Test
    void noForecastMeansEqualFigures() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        aTransaction(plan, owner, TransactionType.CREDIT, "1000.00", today().minusDays(20));
        aTransaction(plan, owner, TransactionType.DEBIT, "300.00", today().minusDays(10));
        aTransaction(plan, owner, TransactionType.DEBIT, "50.00", today());

        JsonNode summary = summary(plan, owner);

        assertFigures(summary, "1000.00", "350.00", "650.00", "1000.00", "350.00", "650.00");
    }

    @Test
    void trendAndPeopleCountEverything() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate day = today().withDayOfMonth(1).plusMonths(1);
        aTransaction(plan, owner, TransactionType.DEBIT, "100.00", day);
        aPendingOccurrence(plan, owner, "40.00", day.plusDays(1));

        JsonNode summary = summary(plan, owner);
        JsonNode trend = read(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId())
                .with(testAuthHelper.asUser(owner))
                .param("startDate", day.toString())
                .param("endDate", day.plusDays(5).toString()));

        assertThat(trend).hasSize(1);
        assertThat(trend.get(0).get("expenses").decimalValue()).isEqualByComparingTo("140.00");
        assertThat(summary.get("personBreakdown").get(0).get("expense").decimalValue())
                .isEqualByComparingTo("140.00");
        assertThat(summary.get("actualExpenses").decimalValue()).isEqualByComparingTo("0");
    }

    private void aTransaction(Plan plan, User owner, TransactionType type, String amount, LocalDate date) {
        fixtures.aTransaction(new TransactionDraft(
                plan,
                owner,
                new TransactionDetails(null, type, new BigDecimal(amount), "Row", date, null, null),
                SplitMode.EQUAL,
                List.of(new Share(owner, null)),
                List.of(),
                null,
                null));
    }

    /** The only occurrence of a bounded series that requires confirmation: forecast whatever its date. */
    private void aPendingOccurrence(Plan plan, User owner, String amount, LocalDate date) {
        RecurrenceDefinition definition =
                recurrenceDefinitionRepository.save(RecurrenceDefinition.create(new SeriesDraft(
                        plan,
                        owner,
                        null,
                        TransactionType.DEBIT,
                        new BigDecimal(amount),
                        "Electricity",
                        RecurrenceMode.RECURRING,
                        RecurrenceInterval.MONTHLY,
                        null,
                        null,
                        date,
                        date,
                        SplitMode.EQUAL,
                        List.of(new Share(owner, null)),
                        true)));
        fixtures.aTransaction(new TransactionDraft(
                plan,
                owner,
                new TransactionDetails(
                        null, TransactionType.DEBIT, new BigDecimal(amount), "Electricity", date, null, null),
                SplitMode.EQUAL,
                List.of(new Share(owner, null)),
                List.of(),
                null,
                definition));
    }

    private JsonNode summary(Plan plan, User reader) throws Exception {
        return read(get(DashboardRoutes.DASHBOARD, plan.getId())
                .with(testAuthHelper.asUser(reader))
                .param("startDate", today().minusDays(30).toString())
                .param("endDate", today().plusDays(30).toString()));
    }

    private JsonNode read(MockHttpServletRequestBuilder request) throws Exception {
        MvcResult result = mockMvc.perform(request).andExpect(status().isOk()).andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private static void assertFigures(
            JsonNode summary,
            String income,
            String expenses,
            String balance,
            String actualIncome,
            String actualExpenses,
            String actualBalance) {
        assertThat(summary.get("totalIncome").decimalValue()).isEqualByComparingTo(income);
        assertThat(summary.get("totalExpenses").decimalValue()).isEqualByComparingTo(expenses);
        assertThat(summary.get("netBalance").decimalValue()).isEqualByComparingTo(balance);
        assertThat(summary.get("actualIncome").decimalValue()).isEqualByComparingTo(actualIncome);
        assertThat(summary.get("actualExpenses").decimalValue()).isEqualByComparingTo(actualExpenses);
        assertThat(summary.get("actualBalance").decimalValue()).isEqualByComparingTo(actualBalance);
    }
}
