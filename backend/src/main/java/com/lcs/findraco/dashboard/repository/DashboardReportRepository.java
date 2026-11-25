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
    // memberId (null → whole plan). Every query counts member shares only: a contact's share is money to receive,
    // not the plan's spending, so the totals are the amount less the contacts' shares.
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL AND ft.kind IS NULL AND ft.type = :type "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumByPlanAndTypeAndDateRange(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    /** What refunds gave back in the range: they lower the expenses and are no income. */
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL "
            + "AND ft.kind = com.lcs.findraco.transaction.model.TransactionKind.REFUND "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumRefundsByPlanAndDateRange(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    /**
     * What moved without earning or spending, of one type: a transfer, a card bill payment or a move to savings.
     * Outside every total, shown apart.
     */
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL AND ft.type = :type "
            + "AND ft.kind IN (com.lcs.findraco.transaction.model.TransactionKind.TRANSFER, "
            + "com.lcs.findraco.transaction.model.TransactionKind.CARD_BILL_PAYMENT, "
            + "com.lcs.findraco.transaction.model.TransactionKind.SAVINGS) "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumNeutralByPlanAndTypeAndDateRange(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    /**
     * The same sum over the transactions that are actual on {@code today}: confirmed, or due by date and dated
     * on or before it. A transaction that waits for its confirmation counts only in the plain sum above.
     */
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL AND ft.kind IS NULL AND ft.type = :type "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.CONFIRMED "
            + "OR (ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.BY_DATE "
            + "AND ft.startDate <= :today)) "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumActualByPlanAndTypeAndDateRange(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId,
            @Param("today") LocalDate today);

    /** The refunds actual on {@code today}, by the same rule as {@link #sumActualByPlanAndTypeAndDateRange}. */
    @Query("SELECT COALESCE(SUM(tp.shareAmount), 0) FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL "
            + "AND ft.kind = com.lcs.findraco.transaction.model.TransactionKind.REFUND "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.CONFIRMED "
            + "OR (ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.BY_DATE "
            + "AND ft.startDate <= :today)) "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId)")
    BigDecimal sumActualRefundsByPlanAndDateRange(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId,
            @Param("today") LocalDate today);

    /** The rows are [year, month, type, kind, sum] over the rows that count: no kind, or a refund. */
    @Query("SELECT year(ft.startDate), month(ft.startDate), ft.type, ft.kind, COALESCE(SUM(tp.shareAmount), 0) "
            + "FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL "
            + "AND (ft.kind IS NULL OR ft.kind = com.lcs.findraco.transaction.model.TransactionKind.REFUND) "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId) "
            + "GROUP BY year(ft.startDate), month(ft.startDate), ft.type, ft.kind "
            + "ORDER BY year(ft.startDate), month(ft.startDate)")
    List<Object[]> findMonthlyTrend(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    /**
     * Per member, type and kind (none, or a refund): the sum of every share, then the sum of the shares actual on
     * {@code today}, by the same rule as {@link #sumActualByPlanAndTypeAndDateRange}.
     */
    @Query("SELECT tp.member.id, tp.member.name, ft.type, ft.kind, COALESCE(SUM(tp.shareAmount), 0), "
            + "COALESCE(SUM(CASE WHEN ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.CONFIRMED "
            + "OR (ft.confirmation = com.lcs.findraco.transaction.model.Confirmation.BY_DATE "
            + "AND ft.startDate <= :today) THEN tp.shareAmount ELSE 0 END), 0) "
            + "FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.deletion IS NULL "
            + "AND (ft.kind IS NULL OR ft.kind = com.lcs.findraco.transaction.model.TransactionKind.REFUND) "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND tp.member IS NOT NULL AND (:memberId IS NULL OR tp.member.id = :memberId) "
            + "GROUP BY tp.member.id, tp.member.name, ft.type, ft.kind")
    List<Object[]> findPersonBreakdown(
            @Param("plan") Plan plan,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId,
            @Param("today") LocalDate today);
}
