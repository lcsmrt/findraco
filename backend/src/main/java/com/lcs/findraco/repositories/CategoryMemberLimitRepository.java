package com.lcs.findraco.repositories;

import com.lcs.findraco.models.CategoryMemberLimit;
import com.lcs.findraco.models.FinancialTransactionCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryMemberLimitRepository extends JpaRepository<CategoryMemberLimit, Long> {
    List<CategoryMemberLimit> findAllByCategory(FinancialTransactionCategory category);

    /** Whether any child of {@code parent} has per-member limits. */
    boolean existsByCategory_Parent(FinancialTransactionCategory parent);
}
