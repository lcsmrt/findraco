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

    // The same row lock as the top-up below, so a series edit or delete and a top-up of the same
    // definition run one after the other, and the later one sees what the earlier one committed.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rd FROM RecurrenceDefinition rd WHERE rd.plan = :plan AND rd.seriesId = :seriesId")
    Optional<RecurrenceDefinition> findByPlanAndSeriesIdForUpdate(
            @Param("plan") Plan plan, @Param("seriesId") String seriesId);

    long countByCategory(Category category);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE VERSIONED RecurrenceDefinition rd SET rd.category = :target WHERE rd.category = :source")
    int reassignCategory(@Param("source") Category source, @Param("target") Category target);

    // Top-up due-set: open-ended RECURRING definitions whose mark has not reached the requested date.
    // The mark moves to that date whether or not an occurrence fell in the window, so a definition is
    // not due again until the horizon moves. Bounded series never match. Locked PESSIMISTIC_WRITE so a
    // concurrent top-up serializes on each definition and finds the mark already advanced.
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rd FROM RecurrenceDefinition rd " + "WHERE rd.plan = :plan "
            + "AND rd.mode = com.lcs.findraco.transaction.model.RecurrenceMode.RECURRING "
            + "AND rd.endDate IS NULL "
            + "AND (rd.generatedThrough IS NULL OR rd.generatedThrough < :horizonCap)")
    List<RecurrenceDefinition> findOpenEndedDue(@Param("plan") Plan plan, @Param("horizonCap") LocalDate horizonCap);
}
