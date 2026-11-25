package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

/**
 * What the plan's contacts owe, read from the shares of transactions. Read-only: participants are written only
 * through their owner, the transaction feature.
 */
public interface ContactLedgerRepository extends Repository<Contact, Long> {

    /**
     * The rows are [contactId, sum]: what each contact's shares add up to on the live transactions that are actual on
     * {@code today}, confirmed or due by date and dated on or before it (AD-025). A planned share is no debt yet.
     */
    @Query("SELECT tp.contact.id, COALESCE(SUM(tp.shareAmount), 0) FROM TransactionParticipant tp "
            + "WHERE tp.contact.plan = :plan AND tp.transaction.deletion IS NULL "
            + "AND (tp.transaction.confirmation = com.lcs.findraco.transaction.model.Confirmation.CONFIRMED "
            + "OR (tp.transaction.confirmation = com.lcs.findraco.transaction.model.Confirmation.BY_DATE "
            + "AND tp.transaction.startDate <= :today)) "
            + "GROUP BY tp.contact.id")
    List<Object[]> sumActualSharesByContact(@Param("plan") Plan plan, @Param("today") LocalDate today);

    /**
     * How many live shares of the contact are not actual on {@code today}: planned, or waiting for a confirmation.
     * The complement of {@link #sumActualSharesByContact}, so each share is counted by exactly one of the two.
     */
    @Query("SELECT COUNT(tp) FROM TransactionParticipant tp WHERE tp.contact.id = :contactId "
            + "AND tp.transaction.deletion IS NULL "
            + "AND NOT (tp.transaction.confirmation = com.lcs.findraco.transaction.model.Confirmation.CONFIRMED "
            + "OR (tp.transaction.confirmation = com.lcs.findraco.transaction.model.Confirmation.BY_DATE "
            + "AND tp.transaction.startDate <= :today))")
    long countPlannedShares(@Param("contactId") long contactId, @Param("today") LocalDate today);

    /** How many series that name the contact are still running: not in the trash and not ended before {@code today}. */
    @Query(
            "SELECT COUNT(rp) FROM RecurrenceDefinitionParticipant rp WHERE rp.contact.id = :contactId "
                    + "AND rp.definition.deletion IS NULL AND (rp.definition.endDate IS NULL OR rp.definition.endDate > :today)")
    long countRunningSeries(@Param("contactId") long contactId, @Param("today") LocalDate today);

    /**
     * The rows are [contactId, sum]: what each contact has paid back, the amounts of the live repayments that came
     * from it. A repayment counts whatever its date and however it is allocated; a trashed one counts no more.
     */
    @Query("SELECT t.repaymentContact.id, COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.plan = :plan AND t.repaymentContact IS NOT NULL AND t.deletion IS NULL "
            + "GROUP BY t.repaymentContact.id")
    List<Object[]> sumLiveRepaymentsByContact(@Param("plan") Plan plan);

    /** The contact's shares on live transactions, with each transaction, for a statement. */
    @Query("SELECT tp FROM TransactionParticipant tp JOIN FETCH tp.transaction t "
            + "WHERE tp.contact.id = :contactId AND t.deletion IS NULL ORDER BY t.startDate, t.id")
    List<TransactionParticipant> findLiveShares(@Param("contactId") long contactId);

    /** The contact's live repayments, oldest first. */
    @Query("SELECT t FROM Transaction t WHERE t.repaymentContact.id = :contactId AND t.deletion IS NULL "
            + "ORDER BY t.startDate, t.id")
    List<Transaction> findLiveRepayments(@Param("contactId") long contactId);

    /**
     * The rows are [shareId, sum]: what live repayments settled of each of the contact's shares on live purchases.
     */
    @Query("SELECT a.participant.id, SUM(a.amount) FROM RepaymentAllocation a "
            + "WHERE a.participant.contact.id = :contactId AND a.repayment.deletion IS NULL "
            + "AND a.participant.transaction.deletion IS NULL GROUP BY a.participant.id")
    List<Object[]> sumLiveAllocationsByShare(@Param("contactId") long contactId);

    /** The rows are [repaymentId, sum]: what each live repayment of the contact settled on live purchases. */
    @Query("SELECT a.repayment.id, SUM(a.amount) FROM RepaymentAllocation a "
            + "WHERE a.repayment.repaymentContact.id = :contactId AND a.repayment.deletion IS NULL "
            + "AND a.participant.transaction.deletion IS NULL GROUP BY a.repayment.id")
    List<Object[]> sumLiveAllocationsByRepayment(@Param("contactId") long contactId);

    /** How many shares of transactions, trashed or not, refer to the contact. */
    @Query("SELECT COUNT(tp) FROM TransactionParticipant tp WHERE tp.contact.id = :contactId")
    long countTransactionShares(@Param("contactId") long contactId);

    /** How many shares of series refer to the contact. */
    @Query("SELECT COUNT(rp) FROM RecurrenceDefinitionParticipant rp WHERE rp.contact.id = :contactId")
    long countSeriesShares(@Param("contactId") long contactId);

    /** How many repayments, trashed or not, came from the contact. */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.repaymentContact.id = :contactId")
    long countRepayments(@Param("contactId") long contactId);
}
