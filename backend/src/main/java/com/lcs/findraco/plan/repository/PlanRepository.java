package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Plan;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    @Query("select p.id from Plan p where p.deletedAt is null "
            + "and (p.seriesGeneratedUntil is null or p.seriesGeneratedUntil < :through)")
    List<Long> findIdsGeneratedBefore(@Param("through") LocalDate through);

    /** Deletes an archived plan, and through the foreign keys everything scoped to it; 0 when it is active or gone. */
    @Modifying
    @Query("delete from Plan p where p.id = :id and p.deletedAt is not null and p.deletedAt <= :cutoff")
    int deleteArchivedBefore(@Param("id") long id, @Param("cutoff") Instant cutoff);

    @Query("select p.id from Plan p where p.deletedAt is not null and p.deletedAt <= :cutoff")
    List<Long> findIdsArchivedBefore(@Param("cutoff") Instant cutoff);

    @Query("select p.seriesGeneratedUntil from Plan p where p.id = :id")
    Optional<LocalDate> findSeriesGeneratedUntil(@Param("id") long id);
}
