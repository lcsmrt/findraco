package com.lcs.findraco.transaction.repository;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecurrenceDefinitionRepository extends JpaRepository<RecurrenceDefinition, Long> {

    Optional<RecurrenceDefinition> findByPlanAndSeriesId(Plan plan, String seriesId);

    long countByCategory(Category category);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE RecurrenceDefinition rd SET rd.category = :target WHERE rd.category = :source")
    int reassignCategory(@Param("source") Category source, @Param("target") Category target);

    // Rolling top-up due-set: open-ended (endDate IS NULL) RECURRING definitions whose materialized
    // watermark hasn't reached the rolling horizon yet. Bounded series (endDate NOT NULL) never
    // match, so they are never touched. Locked PESSIMISTIC_WRITE so a concurrent top-up serializes
    // on each definition row and observes the already-advanced watermark (idempotency, see
    // OpenEndedSeriesTopUpService).
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rd FROM RecurrenceDefinition rd " + "WHERE rd.plan = :plan "
            + "AND rd.mode = com.lcs.findraco.transaction.model.RecurrenceMode.RECURRING "
            + "AND rd.endDate IS NULL "
            + "AND (rd.generatedThrough IS NULL OR rd.generatedThrough < :horizonCap)")
    List<RecurrenceDefinition> findOpenEndedDue(@Param("plan") Plan plan, @Param("horizonCap") LocalDate horizonCap);
}
