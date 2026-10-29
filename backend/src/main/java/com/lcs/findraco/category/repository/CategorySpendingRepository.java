package com.lcs.findraco.category.repository;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionType;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

/**
 * The spend per category, read from transactions for the usage screens. Read-only: transactions are
 * written only through their owner, {@code TransactionService}.
 */
public interface CategorySpendingRepository extends Repository<Transaction, Long> {

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
}
