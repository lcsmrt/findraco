package com.lcs.findraco.dashboard.repository;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

/**
 * The dashboard's report queries over transactions. Read-only: transactions are written only through
 * their owner, {@code TransactionService}.
 */
public interface DashboardReportRepository extends Repository<Transaction, Long> {

    // Participant-based aggregation: sums share_amount via the participants join, with an optional
    // memberId (null → whole plan). Under the SPLIT-01 invariant (every tx has >=1 participation whose
    // shares sum to amount) the unfiltered totals are identical to summing ft.amount (AGG-02).
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.type = :type "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumByPlanAndTypeAndDateRange(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    @Query("SELECT year(ft.startDate), month(ft.startDate), ft.type, COALESCE(SUM(tp.shareAmount), 0) "
            + "FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (:memberId IS NULL OR tp.member.id = :memberId) "
            + "GROUP BY year(ft.startDate), month(ft.startDate), ft.type "
            + "ORDER BY year(ft.startDate), month(ft.startDate)")
    List<Object[]> findMonthlyTrend(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    @Query("SELECT tp.member.id, tp.member.name, ft.type, COALESCE(SUM(tp.shareAmount), 0) "
            + "FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (:memberId IS NULL OR tp.member.id = :memberId) "
            + "GROUP BY tp.member.id, tp.member.name, ft.type")
    List<Object[]> findPersonBreakdown(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);
}
