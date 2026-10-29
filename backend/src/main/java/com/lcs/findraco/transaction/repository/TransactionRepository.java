package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
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
}
