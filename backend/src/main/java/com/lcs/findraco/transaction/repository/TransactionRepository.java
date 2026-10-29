package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    List<Transaction> findAllByPlan(Plan plan);

    /** A page of the list, with what each row's response reads besides its collections. */
    @Override
    @EntityGraph(attributePaths = {"createdBy", "category.owner", "category.parent.owner"})
    Page<Transaction> findAll(Specification<Transaction> spec, Pageable pageable);

    /**
     * Loads the participants of transactions already read, in one query. Collections come by a second
     * query instead of the page query, so the page is cut by the database, not in memory.
     */
    @Query("SELECT DISTINCT t FROM Transaction t LEFT JOIN FETCH t.participants p LEFT JOIN FETCH p.member "
            + "WHERE t IN :transactions")
    List<Transaction> fetchParticipants(@Param("transactions") Collection<Transaction> transactions);

    /** Loads the items of transactions already read, with their categories, in one query. */
    @Query("SELECT DISTINCT t FROM Transaction t LEFT JOIN FETCH t.items i "
            + "LEFT JOIN FETCH i.category c LEFT JOIN FETCH c.owner LEFT JOIN FETCH c.parent cp LEFT JOIN FETCH cp.owner "
            + "WHERE t IN :transactions")
    List<Transaction> fetchItems(@Param("transactions") Collection<Transaction> transactions);

    Optional<Transaction> findByIdAndPlan(Long id, Plan plan);

    @EntityGraph(attributePaths = {"createdBy", "category.owner", "category.parent.owner"})
    List<Transaction> findAllByPlanAndSeriesId(Plan plan, String seriesId);

    long countByCategory(Category category);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction ft SET ft.category = :target WHERE ft.category = :source")
    int reassignCategory(@Param("source") Category source, @Param("target") Category target);

    @Query("SELECT ft.externalId FROM Transaction ft WHERE ft.plan = :plan AND ft.externalId IN :externalIds")
    Set<String> findExistingExternalIds(@Param("plan") Plan plan, @Param("externalIds") Collection<String> externalIds);
}
