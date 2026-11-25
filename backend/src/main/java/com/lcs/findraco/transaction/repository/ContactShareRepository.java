package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.transaction.model.TransactionParticipant;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

/** Reads the shares that go to contacts. Read-only: a share changes only through its transaction. */
public interface ContactShareRepository extends Repository<TransactionParticipant, Long> {

    /** The live shares of a contact, oldest purchase first: the order a repayment settles them in. */
    @Query("SELECT tp FROM TransactionParticipant tp JOIN FETCH tp.transaction t "
            + "WHERE tp.contact.id = :contactId AND t.deletion IS NULL ORDER BY t.startDate, t.id")
    List<TransactionParticipant> findLiveOfContactOldestFirst(@Param("contactId") Long contactId);
}
