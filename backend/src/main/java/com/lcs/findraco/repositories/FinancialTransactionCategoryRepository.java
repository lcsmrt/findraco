package com.lcs.findraco.repositories;

import com.lcs.findraco.models.FinancialTransactionCategory;
import com.lcs.findraco.models.Plan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialTransactionCategoryRepository
        extends JpaRepository<FinancialTransactionCategory, Long>,
                JpaSpecificationExecutor<FinancialTransactionCategory> {
    List<FinancialTransactionCategory> findAllByPlan(Plan plan);

    Optional<FinancialTransactionCategory> findByIdAndPlan(Long id, Plan plan);

    boolean existsByParent(FinancialTransactionCategory parent);

    /** Every category of the plan with its parent, owner and member limits loaded in one query. */
    @Query("SELECT DISTINCT c FROM FinancialTransactionCategory c "
            + "LEFT JOIN FETCH c.parent LEFT JOIN FETCH c.owner "
            + "LEFT JOIN FETCH c.memberLimits ml LEFT JOIN FETCH ml.member "
            + "WHERE c.plan = :plan")
    List<FinancialTransactionCategory> findAllByPlanWithDetails(@Param("plan") Plan plan);
}
