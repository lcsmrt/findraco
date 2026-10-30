package com.lcs.findraco.transaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.dashboard.controller.DashboardRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManagerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import tools.jackson.databind.ObjectMapper;

/** A read past a plan's generated mark extends its open-ended series first; a covered read writes nothing. */
class SeriesHorizonIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PlanRepository planRepository;

    @Test
    void aPeriodBeyondTheMarkExtendsTheSeriesAndAnAlreadyCoveredPeriodWritesNothing() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate start = today().withDayOfMonth(1);
        LocalDate farEnd = start.plusYears(3);
        String seriesId = createOpenEndedSeries(plan, owner, start);
        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, seriesId))
                .extracting(Transaction::getStartDate)
                .doesNotContain(farEnd);

        readDashboard(plan, owner, start, farEnd);

        List<Transaction> extended = transactionRepository.findAllByPlanAndSeriesId(plan, seriesId);
        assertThat(extended).extracting(Transaction::getStartDate).contains(farEnd);
        assertThat(planRepository.findById(plan.getId()).orElseThrow().getSeriesGeneratedUntil())
                .isEqualTo(farEnd);

        Statistics statistics =
                entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        statistics.clear();
        readDashboard(plan, owner, start, farEnd);
        readSpending(plan, owner, start, farEnd);

        assertThat(statistics.getEntityInsertCount()).isZero();
        assertThat(statistics.getEntityUpdateCount()).isZero();
        assertThat(statistics.getEntityDeleteCount()).isZero();
        assertThat(transactionRepository.findAllByPlanAndSeriesId(plan, seriesId))
                .hasSameSizeAs(extended);
    }

    @Test
    void aPeriodInsideTheHorizonNeverExtendsAfterTheFirstRead() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);
        LocalDate start = today().withDayOfMonth(1);
        createOpenEndedSeries(plan, owner, start);
        readSpending(plan, owner, start, start.plusMonths(1));

        Statistics statistics =
                entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        statistics.clear();
        readSpending(plan, owner, start, start.plusMonths(1));

        assertThat(statistics.getEntityInsertCount()).isZero();
        assertThat(statistics.getEntityUpdateCount()).isZero();
    }

    private String createOpenEndedSeries(Plan plan, User owner, LocalDate start) throws Exception {
        Map<String, Object> body = Map.of(
                "type", "DEBIT",
                "amount", "20.00",
                "description", "Streaming",
                "mode", "RECURRING",
                "startDate", start.toString(),
                "interval", "MONTHLY",
                "splitMode", "EQUAL");
        String json = mockMvc.perform(post(TransactionRoutes.TRANSACTION + "/series", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readTree(json).get("seriesId").asString();
    }

    private void readDashboard(Plan plan, User owner, LocalDate start, LocalDate end) throws Exception {
        mockMvc.perform(get(DashboardRoutes.DASHBOARD, plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("startDate", start.toString())
                        .param("endDate", end.toString()))
                .andExpect(status().isOk());
    }

    private void readSpending(Plan plan, User owner, LocalDate start, LocalDate end) throws Exception {
        mockMvc.perform(get(CategoryRoutes.CATEGORY + "/spending", plan.getId())
                        .with(testAuthHelper.asUser(owner))
                        .param("startDate", start.toString())
                        .param("endDate", end.toString()))
                .andExpect(status().isOk());
    }
}
