package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
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
     * The rows are [contactId, sum]: what each contact has paid back, the amounts of the live repayments that came
     * from it. A repayment counts whatever its date and however it is allocated; a trashed one counts no more.
     */
    @Query("SELECT t.repaymentContact.id, COALESCE(SUM(t.amount), 0) FROM Transaction t "
            + "WHERE t.plan = :plan AND t.repaymentContact IS NOT NULL AND t.deletion IS NULL "
            + "GROUP BY t.repaymentContact.id")
    List<Object[]> sumLiveRepaymentsByContact(@Param("plan") Plan plan);

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
