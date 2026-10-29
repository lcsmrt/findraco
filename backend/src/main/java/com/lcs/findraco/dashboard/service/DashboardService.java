package com.lcs.findraco.dashboard.service;

import com.lcs.findraco.category.service.CategorySpendingService;
import com.lcs.findraco.dashboard.request.DashboardFilterDto;
import com.lcs.findraco.dashboard.response.CategoryBreakdownDto;
import com.lcs.findraco.dashboard.response.DashboardSummaryResponseDto;
import com.lcs.findraco.dashboard.response.MonthlyTrendDto;
import com.lcs.findraco.dashboard.response.PersonBreakdownDto;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.transaction.model.TransactionType;
import com.lcs.findraco.transaction.repository.TransactionRepository;
import com.lcs.findraco.transaction.service.OpenEndedSeriesTopUpService;
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

    public DashboardService(
            TransactionRepository transactionRepository,
            CategorySpendingService categorySpendingService,
            OpenEndedSeriesTopUpService openEndedSeriesTopUpService,
            Clock clock) {
        this.transactionRepository = transactionRepository;
        this.categorySpendingService = categorySpendingService;
        this.openEndedSeriesTopUpService = openEndedSeriesTopUpService;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponseDto getSummary(DashboardFilterDto filter, PlanContext ctx) {
        Plan plan = ctx.getPlan();
        openEndedSeriesTopUpService.topUp(plan, LocalDate.now(clock));

        LocalDate startDate = filter.getStartDate();
        LocalDate endDate = filter.getEndDate();
        Long memberId = filter.getMemberId();

        BigDecimal totalIncome = transactionRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.CREDIT, startDate, endDate, memberId);

        BigDecimal totalExpenses = transactionRepository.sumByPlanAndTypeAndDateRange(
                plan, TransactionType.DEBIT, startDate, endDate, memberId);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<CategoryBreakdownDto> categoryBreakdown = buildCategoryBreakdown(plan, startDate, endDate, memberId);
        List<MonthlyTrendDto> monthlyTrend = buildMonthlyTrend(plan, startDate, endDate, memberId);
        List<PersonBreakdownDto> personBreakdown = buildPersonBreakdown(plan, startDate, endDate, memberId);

        return new DashboardSummaryResponseDto(
                totalIncome, totalExpenses, netBalance, categoryBreakdown, monthlyTrend, personBreakdown);
    }

    /** Income and expenses per calendar month of the range, optionally for one member's shares (UX-05 AC 7). */
    @Transactional(readOnly = true)
    public List<MonthlyTrendDto> getTrend(DashboardFilterDto filter, PlanContext ctx) {
        Plan plan = ctx.getPlan();
        openEndedSeriesTopUpService.topUp(plan, LocalDate.now(clock));
        return buildMonthlyTrend(plan, filter.getStartDate(), filter.getEndDate(), filter.getMemberId());
    }

    private List<CategoryBreakdownDto> buildCategoryBreakdown(
            Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        return categorySpendingService.computeOverview(plan, startDate, endDate, memberId).stream()
                .map(CategoryBreakdownDto::new)
                .toList();
    }

    private record MonthKey(int year, int month) {}

    private List<MonthlyTrendDto> buildMonthlyTrend(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
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

        List<MonthlyTrendDto> trend = new ArrayList<>();
        for (Map.Entry<MonthKey, BigDecimal[]> entry : amountsByMonth.entrySet()) {
            trend.add(new MonthlyTrendDto(
                    entry.getKey().year(), entry.getKey().month(), entry.getValue()[0], entry.getValue()[1]));
        }
        return trend;
    }

    private List<PersonBreakdownDto> buildPersonBreakdown(
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

        List<PersonBreakdownDto> breakdown = new ArrayList<>();
        for (Map.Entry<Long, BigDecimal[]> entry : amountsByUserId.entrySet()) {
            Long userId = entry.getKey();
            breakdown.add(new PersonBreakdownDto(
                    userId, namesByUserId.get(userId), entry.getValue()[0], entry.getValue()[1]));
        }
        return breakdown;
    }
}
