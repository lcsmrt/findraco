package com.lcs.findraco.dashboard.service;

import com.lcs.findraco.category.service.CategorySpendingService;
import com.lcs.findraco.dashboard.request.DashboardFilter;
import com.lcs.findraco.dashboard.response.CategoryBreakdownResponse;
import com.lcs.findraco.dashboard.response.DashboardSummaryResponse;
import com.lcs.findraco.dashboard.response.MonthlyTrendResponse;
import com.lcs.findraco.dashboard.response.PersonBreakdownResponse;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final CategorySpendingService categorySpendingService;
    private final OpenEndedSeriesTopUpService openEndedSeriesTopUpService;
    private final Clock clock;
    private final EntityManager entityManager;

    public DashboardService(
            TransactionRepository transactionRepository,
            CategorySpendingService categorySpendingService,
            OpenEndedSeriesTopUpService openEndedSeriesTopUpService,
            Clock clock,
            EntityManager entityManager) {
        this.transactionRepository = transactionRepository;
        this.categorySpendingService = categorySpendingService;
        this.openEndedSeriesTopUpService = openEndedSeriesTopUpService;
        this.clock = clock;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(DashboardFilter filter, PlanContext ctx) {
        Plan plan = entityManager.getReference(Plan.class, ctx.planId());
        openEndedSeriesTopUpService.topUp(ctx.planId(), LocalDate.now(clock));

        LocalDate startDate = filter.startDate();
        LocalDate endDate = filter.endDate();
        Long memberId = filter.memberId();

        BigDecimal totalIncome = transactionRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.CREDIT, startDate, endDate, memberId);

        BigDecimal totalExpenses = transactionRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.DEBIT, startDate, endDate, memberId);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<CategoryBreakdownResponse> categoryBreakdown = buildCategoryBreakdown(plan, startDate, endDate, memberId);
        List<MonthlyTrendResponse> monthlyTrend = buildMonthlyTrend(plan, startDate, endDate, memberId);
        List<PersonBreakdownResponse> personBreakdown = buildPersonBreakdown(plan, startDate, endDate, memberId);

        return new DashboardSummaryResponse(
                totalIncome, totalExpenses, netBalance, categoryBreakdown, monthlyTrend, personBreakdown);
    }

    /** Income and expenses per calendar month of the range, optionally for one member's shares (UX-05 AC 7). */
    @Transactional(readOnly = true)
    public List<MonthlyTrendResponse> getTrend(DashboardFilter filter, PlanContext ctx) {
        Plan plan = entityManager.getReference(Plan.class, ctx.planId());
        openEndedSeriesTopUpService.topUp(ctx.planId(), LocalDate.now(clock));
        return buildMonthlyTrend(plan, filter.startDate(), filter.endDate(), filter.memberId());
    }

    private List<CategoryBreakdownResponse> buildCategoryBreakdown(
            Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        return categorySpendingService.computeOverview(plan.getId(), startDate, endDate, memberId).stream()
                .map(CategoryBreakdownResponse::from)
                .toList();
    }

    private record MonthKey(int year, int month) {}

    private List<MonthlyTrendResponse> buildMonthlyTrend(
            Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rows = transactionRepository.findMonthlyTrend(plan, startDate, endDate, memberId);

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
        List<Object[]> rows = transactionRepository.findPersonBreakdown(plan, startDate, endDate, memberId);

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
