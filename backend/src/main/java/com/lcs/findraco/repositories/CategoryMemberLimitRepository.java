package com.lcs.findraco.repositories;

import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryMemberLimitRepository extends JpaRepository<CategoryMemberLimit, Long> {
    List<CategoryMemberLimit> findAllByCategory(FinancialTransactionCategory category);

    /** Whether any child of {@code parent} has per-member limits. */
    boolean existsByCategory_Parent(FinancialTransactionCategory parent);
}
