package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.FinancialTransactionCategory;
import com.lcs.findraco.transaction.model.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionItemRepository extends JpaRepository<TransactionItem, Long> {

    long countByCategory(FinancialTransactionCategory category);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE TransactionItem it SET it.category = :target WHERE it.category = :source")
    int reassignCategory(
            @Param("source") FinancialTransactionCategory source, @Param("target") FinancialTransactionCategory target);
}
