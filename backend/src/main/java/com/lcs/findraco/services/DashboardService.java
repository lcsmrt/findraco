package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.DashboardFilterDto;
import com.lcs.findraco.dtos.response.CategoryBreakdownDto;
import com.lcs.findraco.dtos.response.DashboardSummaryResponseDto;
import com.lcs.findraco.dtos.response.MonthlyTrendDto;
import com.lcs.findraco.dtos.response.PersonBreakdownDto;
import com.lcs.findraco.models.FinancialTransactionType;
import com.lcs.findraco.models.Plan;
import com.lcs.findraco.repositories.FinancialTransactionRepository;
import com.lcs.findraco.security.PlanContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final CategorySpendingService categorySpendingService;
    private final OpenEndedSeriesTopUpService openEndedSeriesTopUpService;
    private final Clock clock;

    public DashboardService(FinancialTransactionRepository financialTransactionRepository,
                             CategorySpendingService categorySpendingService,
                             OpenEndedSeriesTopUpService openEndedSeriesTopUpService,
                             Clock clock) {
        this.financialTransactionRepository = financialTransactionRepository;
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

        BigDecimal totalIncome = financialTransactionRepository.sumByPlanAndTypeAndDateRange(
                plan, FinancialTransactionType.CREDIT, startDate, endDate, memberId);

        BigDecimal totalExpenses = financialTransactionRepository.sumByPlanAndTypeAndDateRange(
                plan, FinancialTransactionType.DEBIT, startDate, endDate, memberId);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<CategoryBreakdownDto> categoryBreakdown = buildCategoryBreakdown(plan, startDate, endDate, memberId);
        List<MonthlyTrendDto> monthlyTrend = buildMonthlyTrend(plan, startDate, endDate, memberId);
        List<PersonBreakdownDto> personBreakdown = buildPersonBreakdown(plan, startDate, endDate, memberId);

        return new DashboardSummaryResponseDto(totalIncome, totalExpenses, netBalance, categoryBreakdown, monthlyTrend, personBreakdown);
    }

    private List<CategoryBreakdownDto> buildCategoryBreakdown(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        return categorySpendingService.computeOverview(plan, startDate, endDate, memberId).stream()
                .map(CategoryBreakdownDto::new)
                .toList();
    }

    private record MonthKey(int year, int month) {}

    private List<MonthlyTrendDto> buildMonthlyTrend(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rows = financialTransactionRepository.findMonthlyTrend(plan, startDate, endDate, memberId);

        Map<MonthKey, BigDecimal[]> amountsByMonth = new LinkedHashMap<>();
        for (Object[] row : rows) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            FinancialTransactionType type = (FinancialTransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            BigDecimal[] incomeAndExpenses = amountsByMonth.computeIfAbsent(
                    new MonthKey(year, month), k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == FinancialTransactionType.CREDIT) {
                incomeAndExpenses[0] = amount;
            } else {
                incomeAndExpenses[1] = amount;
            }
        }

        List<MonthlyTrendDto> trend = new ArrayList<>();
        for (Map.Entry<MonthKey, BigDecimal[]> entry : amountsByMonth.entrySet()) {
            trend.add(new MonthlyTrendDto(entry.getKey().year(), entry.getKey().month(),
                    entry.getValue()[0], entry.getValue()[1]));
        }
        return trend;
    }

    private List<PersonBreakdownDto> buildPersonBreakdown(Plan plan, LocalDate startDate, LocalDate endDate, Long memberId) {
        List<Object[]> rows = financialTransactionRepository.findPersonBreakdown(plan, startDate, endDate, memberId);

        Map<Long, String> namesByUserId = new LinkedHashMap<>();
        Map<Long, BigDecimal[]> amountsByUserId = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long userId = ((Number) row[0]).longValue();
            String name = (String) row[1];
            FinancialTransactionType type = (FinancialTransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            namesByUserId.putIfAbsent(userId, name);
            BigDecimal[] incomeAndExpense = amountsByUserId.computeIfAbsent(
                    userId, k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == FinancialTransactionType.CREDIT) {
                incomeAndExpense[0] = amount;
            } else {
                incomeAndExpense[1] = amount;
            }
        }

        List<PersonBreakdownDto> breakdown = new ArrayList<>();
        for (Map.Entry<Long, BigDecimal[]> entry : amountsByUserId.entrySet()) {
            Long userId = entry.getKey();
            breakdown.add(new PersonBreakdownDto(userId, namesByUserId.get(userId),
                    entry.getValue()[0], entry.getValue()[1]));
        }
        return breakdown;
    }
}
