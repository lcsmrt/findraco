package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.TransactionDeletion;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionDeletionRepository extends JpaRepository<TransactionDeletion, Long> {

    /**
     * The plan's deletions, newest first; only the ones {@code deletedById} made when it is given. The page is
     * cut by the database; the rows' totals come by a second query.
     */
    @EntityGraph(attributePaths = {"deletedBy"})
    @Query("SELECT d FROM TransactionDeletion d WHERE d.plan = :plan "
            + "AND (:deletedById IS NULL OR d.deletedBy.id = :deletedById) "
            + "ORDER BY d.deletedAt DESC, d.id DESC")
    Page<TransactionDeletion> findNewestFirst(
            @Param("plan") Plan plan, @Param("deletedById") Long deletedById, Pageable pageable);

    /** The deletion locked until the transaction ends, so two restores of it run one after the other. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM TransactionDeletion d WHERE d.id = :id AND d.plan = :plan")
    Optional<TransactionDeletion> findByIdAndPlanForUpdate(@Param("id") Long id, @Param("plan") Plan plan);

    /**
     * Moving a series to another category bumps its version but is not a change to the series: the deletions that
     * recorded its version move with it, so their restore still passes and a stale one stays stale. Runs before the
     * move, while the series still points at {@code category}.
     */
    @Modifying(flushAutomatically = true)
    @Query("UPDATE TransactionDeletion d SET d.definitionVersion = d.definitionVersion + 1 "
            + "WHERE d.definitionTrashed = false AND d.recurrenceDefinitionId IN "
            + "(SELECT rd.id FROM RecurrenceDefinition rd WHERE rd.category = :category)")
    int followSeriesCategoryMove(@Param("category") Category category);

    /** Ids of the deletions made at or before {@code cutoff}, oldest first so a series' older tail goes first. */
    @Query("SELECT d.id FROM TransactionDeletion d WHERE d.deletedAt <= :cutoff ORDER BY d.deletedAt, d.id")
    List<Long> findIdsDeletedBefore(@Param("cutoff") Instant cutoff);

    /** Deletes a deletion and, through the foreign keys, its rows and its trashed series; 0 when it is gone. */
    @Modifying
    @Query("DELETE FROM TransactionDeletion d WHERE d.id = :id AND d.deletedAt <= :cutoff")
    int deleteDeletedBefore(@Param("id") Long id, @Param("cutoff") Instant cutoff);
}
