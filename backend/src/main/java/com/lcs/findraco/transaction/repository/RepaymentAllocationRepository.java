package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.transaction.model.RepaymentAllocation;
import com.lcs.findraco.transaction.model.Transaction;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * The allocations of repayments. Every sum and every list counts the live ones only: those of a repayment or of a
 * purchase in the trash are kept but count for nothing until it is restored (AD-028).
 */
public interface RepaymentAllocationRepository extends JpaRepository<RepaymentAllocation, Long> {

    /**
     * Frees what an edit of the repayment replaces: its allocations on live purchases, and any on a share of another
     * contact. Those on a purchase in the trash stay, as the edit's form cannot show them to send back.
     */
    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM RepaymentAllocation a WHERE a.repayment = :repayment AND a.participant IN "
            + "(SELECT p FROM TransactionParticipant p WHERE p.transaction.deletion IS NULL "
            + "OR p.contact.id <> :contactId)")
    int deleteReplaceableByRepayment(@Param("repayment") Transaction repayment, @Param("contactId") Long contactId);

    /** What the repayment settles on purchases in the trash: kept until they come back. */
    @Query("SELECT COALESCE(SUM(a.amount), 0) FROM RepaymentAllocation a WHERE a.repayment = :repayment "
            + "AND a.participant.transaction.deletion IS NOT NULL")
    BigDecimal sumOnTrashedPurchases(@Param("repayment") Transaction repayment);

    /** Frees everything a repayment settled, before it settles again or is edited into something else. */
    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM RepaymentAllocation a WHERE a.repayment = :repayment")
    int deleteByRepayment(@Param("repayment") Transaction repayment);

    /** The rows are [participantId, sum]: what live repayments have settled of each share, a repayment's own included. */
    @Query("SELECT a.participant.id, SUM(a.amount) FROM RepaymentAllocation a "
            + "WHERE a.participant.id IN :participantIds AND a.repayment.deletion IS NULL "
            + "AND a.participant.transaction.deletion IS NULL GROUP BY a.participant.id")
    List<Object[]> sumLiveByParticipant(@Param("participantIds") Collection<Long> participantIds);

    /** The live allocations of the shares, newest repayment first, with what a cut back reads. */
    @Query("SELECT a FROM RepaymentAllocation a JOIN FETCH a.repayment r JOIN FETCH a.participant p "
            + "WHERE p.id IN :participantIds AND r.deletion IS NULL AND p.transaction.deletion IS NULL "
            + "ORDER BY r.startDate DESC, r.id DESC")
    List<RepaymentAllocation> findLiveByParticipantNewestFirst(
            @Param("participantIds") Collection<Long> participantIds);

    /** The allocations of repayments to restore or to show, with the ids a response reads. */
    @Query("SELECT a FROM RepaymentAllocation a JOIN FETCH a.participant p JOIN FETCH p.transaction "
            + "WHERE a.repayment.id IN :repaymentIds AND p.transaction.deletion IS NULL ORDER BY a.id")
    List<RepaymentAllocation> findLiveByRepaymentIn(@Param("repaymentIds") Collection<Long> repaymentIds);

    /** The share ids a set of repayments settle, trashed purchases included: a restore re-checks them all. */
    @Query("SELECT DISTINCT a.participant.id FROM RepaymentAllocation a WHERE a.repayment.id IN :repaymentIds")
    List<Long> findParticipantIdsOf(@Param("repaymentIds") Collection<Long> repaymentIds);
}
