package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionDeletion;
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
     * The id and bank text of the active rows with no kind whose text may be a neutral movement, newest first; the
     * match itself is made by {@code NeutralMovementRules}. A creator restricts it to the rows they made.
     */
    @Query("SELECT t.id, t.sourceText FROM Transaction t WHERE t.plan = :plan AND t.deletion IS NULL "
            + "AND t.kind IS NULL AND t.sourceText IS NOT NULL "
            + "AND (:creatorId IS NULL OR t.createdBy.id = :creatorId) "
            + "AND (LOWER(t.sourceText) LIKE '%pagamento de fatura%' OR LOWER(t.sourceText) LIKE '%pelo pix%') "
            + "ORDER BY t.startDate DESC, t.id DESC")
    List<Object[]> findNeutralCandidateTexts(@Param("plan") Plan plan, @Param("creatorId") Long creatorId);

    /** The rows of a page of the review, with what each row's response reads besides its collections. */
    @EntityGraph(attributePaths = {"createdBy", "category.owner", "category.parent.owner"})
    @Query("SELECT t FROM Transaction t WHERE t.id IN :ids")
    List<Transaction> findAllWithDetailsByIdIn(@Param("ids") Collection<Long> ids);

    /**
     * Loads the participants of transactions already read, in one query. Collections come by a second
     * query instead of the page query, so the page is cut by the database, not in memory.
     */
    @Query(
            "SELECT DISTINCT t FROM Transaction t LEFT JOIN FETCH t.participants p LEFT JOIN FETCH p.member LEFT JOIN FETCH p.contact "
                    + "WHERE t IN :transactions")
    List<Transaction> fetchParticipants(@Param("transactions") Collection<Transaction> transactions);

    /** Loads the items of transactions already read, with their categories, in one query. */
    @Query("SELECT DISTINCT t FROM Transaction t LEFT JOIN FETCH t.items i "
            + "LEFT JOIN FETCH i.category c LEFT JOIN FETCH c.owner LEFT JOIN FETCH c.parent cp LEFT JOIN FETCH cp.owner "
            + "WHERE t IN :transactions")
    List<Transaction> fetchItems(@Param("transactions") Collection<Transaction> transactions);

    // The finders below see active transactions only: a trashed one is gone to every screen, total and
    // regeneration (AD-028). findAllByPlan and findExistingSourceRefs see them all, on purpose.
    @Query("SELECT t FROM Transaction t WHERE t.id = :id AND t.plan = :plan AND t.deletion IS NULL")
    Optional<Transaction> findByIdAndPlan(@Param("id") Long id, @Param("plan") Plan plan);

    @EntityGraph(attributePaths = {"createdBy", "category.owner", "category.parent.owner"})
    @Query("SELECT t FROM Transaction t WHERE t.plan = :plan AND t.seriesId = :seriesId AND t.deletion IS NULL")
    List<Transaction> findAllByPlanAndSeriesId(@Param("plan") Plan plan, @Param("seriesId") String seriesId);

    /** The rows of one deletion, with what the role check reads. */
    @EntityGraph(attributePaths = {"createdBy"})
    List<Transaction> findAllByDeletion(TransactionDeletion deletion);

    /** Per deletion of the page: [deletionId, rows, total amount, a description, a type]. */
    @Query("SELECT t.deletion.id, COUNT(t), COALESCE(SUM(t.amount), 0), MIN(t.description), MIN(t.type) "
            + "FROM Transaction t WHERE t.deletion IN :deletions GROUP BY t.deletion.id")
    List<Object[]> summarizeDeletions(@Param("deletions") Collection<TransactionDeletion> deletions);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.category = :category AND t.deletion IS NULL")
    long countByCategory(@Param("category") Category category);

    // VERSIONED bumps each moved row's version, so an edit based on a read from before the move is stale.
    @Modifying(flushAutomatically = true)
    @Query("UPDATE VERSIONED Transaction ft SET ft.category = :target WHERE ft.category = :source")
    int reassignCategory(@Param("source") Category source, @Param("target") Category target);

    // Items are part of their transaction, so the transaction's repository reads and moves them;
    // they have no repository of their own.
    @Query("SELECT COUNT(it) FROM TransactionItem it WHERE it.category = :category AND it.transaction.deletion IS NULL")
    long countItemsByCategory(@Param("category") Category category);

    // An item is part of its transaction, so moving the item changes the transaction: its version goes up
    // first, while the items still point at the source category.
    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction ft SET ft.version = ft.version + 1 "
            + "WHERE ft IN (SELECT it.transaction FROM TransactionItem it WHERE it.category = :source)")
    int bumpVersionsOfItemsIn(@Param("source") Category source);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE TransactionItem it SET it.category = :target WHERE it.category = :source")
    int reassignItemCategory(@Param("source") Category source, @Param("target") Category target);

    // Only the deletion of a category leaves trashed rows with no category: nothing active uses it then, and
    // the foreign keys would otherwise block the delete and, later, the purge.
    @Modifying(flushAutomatically = true)
    @Query("UPDATE VERSIONED Transaction ft SET ft.category = NULL WHERE ft.category = :source")
    int clearCategory(@Param("source") Category source);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE TransactionItem it SET it.category = NULL WHERE it.category = :source")
    int clearItemCategory(@Param("source") Category source);

    @Query("SELECT ft.sourceRef FROM Transaction ft WHERE ft.plan = :plan AND ft.sourceRef IN :sourceRefs")
    Set<String> findExistingSourceRefs(@Param("plan") Plan plan, @Param("sourceRefs") Collection<String> sourceRefs);
}
