package com.lcs.findraco.dashboard;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Through-the-API proof of {@code GET .../dashboard/trend} (UX-05 AC 7): income and expenses per
 * calendar month of the requested range, optionally restricted to one member's shares, plan-scoped
 * like the dashboard summary and readable by any member.
 */
class DashboardTrendIT extends AbstractIntegrationTest {

    private static final LocalDate START = LocalDate.of(2026, 7, 1);
    private static final LocalDate END = LocalDate.of(2026, 9, 30);

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void returnsIncomeAndExpensesPerMonthOfTheRange() throws Exception {
        Seed seed = seed();

        JsonNode trend = read(fetch(trend(seed.plan(), seed.owner(), null)).andExpect(status().isOk()));

        assertThat(trend).hasSize(3);
        assertMonth(trend.get(0), 2026, 7, "1000.00", "200.00");
        assertMonth(trend.get(1), 2026, 8, "0", "100.00");
        assertMonth(trend.get(2), 2026, 9, "500.00", "0");
    }

    @Test
    void memberIdRestrictsTheTrendToThatMembersShares() throws Exception {
        Seed seed = seed();

        JsonNode trend = read(
                fetch(trend(seed.plan(), seed.owner(), seed.partner().getId())).andExpect(status().isOk()));

        assertThat(trend).hasSize(2);
        assertMonth(trend.get(0), 2026, 7, "0", "50.00");
        assertMonth(trend.get(1), 2026, 8, "0", "40.00");
    }

    @Test
    void viewerCanReadTheTrend() throws Exception {
        Seed seed = seed();
        User viewer = fixtures.aUser();
        fixtures.addMember(seed.plan(), viewer, PlanRole.VIEWER);

        JsonNode trend = read(fetch(trend(seed.plan(), viewer, null)).andExpect(status().isOk()));

        assertThat(trend).hasSize(3);
    }

    @Test
    void anotherPlansTrendIsHiddenLikeTheSummary() throws Exception {
        Seed seed = seed();
        User outsider = fixtures.aUser();
        fixtures.aPlan(outsider);

        int summaryStatus = fetch(
                        withRange(get(DashboardRoutes.DASHBOARD, seed.plan().getId()), outsider))
                .andReturn()
                .getResponse()
                .getStatus();
        int trendStatus = fetch(trend(seed.plan(), outsider, null))
                .andReturn()
                .getResponse()
                .getStatus();

        assertThat(summaryStatus).isEqualTo(404);
        assertThat(trendStatus).isEqualTo(summaryStatus);
    }

    @Test
    void missingRangeIsRejectedWith400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        fetch(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId()).with(testAuthHelper.asUser(owner)))
                .andExpect(status().isBadRequest());
    }

    private record Seed(Plan plan, User owner, User partner) {}

    /**
     * July: income 1000 (owner), expense 200 (150 owner / 50 partner). August: expense 100 (60 / 40).
     * September: income 500 (owner). June and October fall outside the range.
     */
    private Seed seed() {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        User partner = fixtures.aUser();
        fixtures.addMember(plan, partner, PlanRole.EDITOR);

        aTransaction(
                plan, owner, TransactionType.CREDIT, "1000.00", LocalDate.of(2026, 7, 5), Map.of(owner, "1000.00"));
        aTransaction(
                plan,
                owner,
                TransactionType.DEBIT,
                "200.00",
                LocalDate.of(2026, 7, 31),
                Map.of(owner, "150.00", partner, "50.00"));
        aTransaction(
                plan,
                owner,
                TransactionType.DEBIT,
                "100.00",
                LocalDate.of(2026, 8, 15),
                Map.of(owner, "60.00", partner, "40.00"));
        aTransaction(plan, owner, TransactionType.CREDIT, "500.00", LocalDate.of(2026, 9, 1), Map.of(owner, "500.00"));
        aTransaction(
                plan,
                owner,
                TransactionType.DEBIT,
                "999.00",
                LocalDate.of(2026, 6, 30),
                Map.of(owner, "500.00", partner, "499.00"));
        aTransaction(plan, owner, TransactionType.DEBIT, "777.00", LocalDate.of(2026, 10, 1), Map.of(owner, "777.00"));
        return new Seed(plan, owner, partner);
    }

    private void aTransaction(
            Plan plan, User createdBy, TransactionType type, String amount, LocalDate date, Map<User, String> shares) {
        Transaction transaction = new Transaction();
        transaction.setPlan(plan);
        transaction.setCreatedBy(createdBy);
        transaction.setType(type);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setDescription("Trend transaction");
        transaction.setStartDate(date);
        shares.forEach((member, share) -> {
            TransactionParticipant participant = new TransactionParticipant();
            participant.setTransaction(transaction);
            participant.setMember(member);
            participant.setShareAmount(new BigDecimal(share));
            transaction.getParticipants().add(participant);
        });
        transactionRepository.save(transaction);
    }

    private static void assertMonth(JsonNode entry, int year, int month, String income, String expenses) {
        assertThat(entry.get("year").asInt()).isEqualTo(year);
        assertThat(entry.get("month").asInt()).isEqualTo(month);
        assertThat(entry.get("income").decimalValue()).isEqualByComparingTo(income);
        assertThat(entry.get("expenses").decimalValue()).isEqualByComparingTo(expenses);
    }

    private MockHttpServletRequestBuilder trend(Plan plan, User asUser, Long memberId) {
        MockHttpServletRequestBuilder request =
                withRange(get(DashboardRoutes.DASHBOARD + "/trend", plan.getId()), asUser);
        return memberId == null ? request : request.param("memberId", memberId.toString());
    }

    private MockHttpServletRequestBuilder withRange(MockHttpServletRequestBuilder request, User asUser) {
        return request.with(testAuthHelper.asUser(asUser))
                .param("startDate", START.toString())
                .param("endDate", END.toString());
    }

    private ResultActions fetch(MockHttpServletRequestBuilder request) throws Exception {
        return mockMvc.perform(request);
    }

    private JsonNode read(ResultActions actions) throws Exception {
        return objectMapper.readTree(actions.andReturn().getResponse().getContentAsString());
    }
}
