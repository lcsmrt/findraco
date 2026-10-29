package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    List<Transaction> findAllByPlan(Plan plan);

    Optional<Transaction> findByIdAndPlan(Long id, Plan plan);

    List<Transaction> findAllByPlanAndSeriesId(Plan plan, String seriesId);

    long countByCategory(Category category);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction ft SET ft.category = :target WHERE ft.category = :source")
    int reassignCategory(@Param("source") Category source, @Param("target") Category target);

    @Query("SELECT ft.externalId FROM Transaction ft WHERE ft.plan = :plan AND ft.externalId IN :externalIds")
    Set<String> findExistingExternalIds(@Param("plan") Plan plan, @Param("externalIds") Collection<String> externalIds);

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

    // Query A of the category partition, per category x member: each member's participation share of
    // the categorized transactions in the period (optional memberId; null → every member).
    @Query("SELECT ft.category.id, tp.member.id, COALESCE(SUM(tp.shareAmount), 0) "
            + "FROM Transaction ft JOIN ft.participants tp "
            + "WHERE ft.plan = :plan AND ft.type = :type AND ft.category IS NOT NULL "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "AND (:memberId IS NULL OR tp.member.id = :memberId) "
            + "GROUP BY ft.category.id, tp.member.id")
    List<Object[]> findCategoryMemberFacts(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId);

    // One row per categorized item x participant of its transaction, unaggregated, for
    // ItemShareAllocator: [itemId, itemCategoryId, transactionCategoryId (nullable), itemAmount,
    // memberId, shareAmount]. The transaction's category is LEFT-joined so uncategorized
    // transactions still attribute their items.
    @Query("SELECT it.id, it.category.id, c.id, it.amount, tp.member.id, tp.shareAmount "
            + "FROM Transaction ft JOIN ft.items it JOIN ft.participants tp LEFT JOIN ft.category c "
            + "WHERE ft.plan = :plan AND ft.type = :type AND it.category IS NOT NULL "
            + "AND ft.startDate >= :startDate AND ft.startDate <= :endDate "
            + "ORDER BY it.id, tp.member.id")
    List<Object[]> findCategorizedItemParticipantRows(
            @Param("plan") Plan plan,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

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
