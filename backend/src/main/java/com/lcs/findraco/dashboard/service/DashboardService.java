package com.lcs.findraco.dashboard.service;

import com.lcs.findraco.dashboard.repository.DashboardReportRepository;
import com.lcs.findraco.dashboard.request.DashboardFilter;
import com.lcs.findraco.dashboard.response.DashboardSummaryResponse;
import com.lcs.findraco.dashboard.response.MonthlyTrendResponse;
import com.lcs.findraco.dashboard.response.PersonBreakdownResponse;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.service.SeriesHorizon;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class DashboardService {

    private final DashboardReportRepository reportRepository;
    private final SeriesHorizon seriesHorizon;
    private final TransactionTemplate readTransaction;
    private final EntityManager entityManager;

    public DashboardService(
            DashboardReportRepository reportRepository,
            SeriesHorizon seriesHorizon,
            PlatformTransactionManager transactionManager,
            EntityManager entityManager) {
        this.reportRepository = reportRepository;
        this.seriesHorizon = seriesHorizon;
        this.readTransaction = new TransactionTemplate(transactionManager);
        this.readTransaction.setReadOnly(true);
        this.entityManager = entityManager;
    }

    /** The series are extended first, in their own transaction, so the read itself never writes. */
    public DashboardSummaryResponse getSummary(DashboardFilter filter, PlanContext ctx) {
        seriesHorizon.ensureCovered(ctx.planId(), filter.endDate());
        return readTransaction.execute(status -> summary(filter, ctx));
    }

    private DashboardSummaryResponse summary(DashboardFilter filter, PlanContext ctx) {
        Plan plan = entityManager.getReference(Plan.class, ctx.planId());

        LocalDate startDate = filter.startDate();
        LocalDate endDate = filter.endDate();
        Long memberId = filter.memberId();

        BigDecimal totalIncome = reportRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.CREDIT, startDate, endDate, memberId);

        BigDecimal totalExpenses = reportRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.DEBIT, startDate, endDate, memberId);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<PersonBreakdownResponse> personBreakdown = buildPersonBreakdown(plan, startDate, endDate, memberId);

        return new DashboardSummaryResponse(totalIncome, totalExpenses, netBalance, personBreakdown);
    }

    /** Income and expenses per calendar month of the range, optionally for one member's shares (UX-05 AC 7). */
    public List<MonthlyTrendResponse> getTrend(DashboardFilter filter, PlanContext ctx) {
        seriesHorizon.ensureCovered(ctx.planId(), filter.endDate());
        return readTransaction.execute(status -> {
            Plan plan = entityManager.getReference(Plan.class, ctx.planId());
            return buildMonthlyTrend(plan, filter.startDate(), filter.endDate(), filter.memberId());
        });
    }

    private record MonthKey(int year, int month) {}

    private List<MonthlyTrendResponse> buildMonthlyTrend(
            Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rows = reportRepository.findMonthlyTrend(plan, startDate, endDate, memberId);

        Map<MonthKey, BigDecimal[]> amountsByMonth = new LinkedHashMap<>();
        for (Object[] row : rows) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            BigDecimal[] incomeAndExpenses = amountsByMonth.computeIfAbsent(
                    new MonthKey(year, month), k -> new BigDecimal[] {BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == TransactionType.CREDIT) {
                incomeAndExpenses[0] = amount;
            } else {
                incomeAndExpenses[1] = amount;
            }
        }

        List<MonthlyTrendResponse> trend = new ArrayList<>();
        for (Map.Entry<MonthKey, BigDecimal[]> entry : amountsByMonth.entrySet()) {
            trend.add(new MonthlyTrendResponse(
                    entry.getKey().year(), entry.getKey().month(), entry.getValue()[0], entry.getValue()[1]));
        }
        return trend;
    }

    private List<PersonBreakdownResponse> buildPersonBreakdown(
            Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rows = reportRepository.findPersonBreakdown(plan, startDate, endDate, memberId);

        Map<Long, String> namesByUserId = new LinkedHashMap<>();
        Map<Long, BigDecimal[]> amountsByUserId = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long userId = ((Number) row[0]).longValue();
            String name = (String) row[1];
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            namesByUserId.putIfAbsent(userId, name);
            BigDecimal[] incomeAndExpense =
                    amountsByUserId.computeIfAbsent(userId, k -> new BigDecimal[] {BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == TransactionType.CREDIT) {
                incomeAndExpense[0] = amount;
            } else {
                incomeAndExpense[1] = amount;
            }
        }

        List<PersonBreakdownResponse> breakdown = new ArrayList<>();
        for (Map.Entry<Long, BigDecimal[]> entry : amountsByUserId.entrySet()) {
            Long userId = entry.getKey();
            breakdown.add(PersonBreakdownResponse.of(
                    userId, namesByUserId.get(userId), entry.getValue()[0], entry.getValue()[1]));
        }
        return breakdown;
    }
}
