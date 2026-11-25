package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.Plan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    Optional<Contact> findByIdAndPlan(Long id, Plan plan);

    /** The plan's active contacts, or all of them, by name ignoring case. */
    @Query("SELECT c FROM Contact c WHERE c.plan = :plan AND (:includeArchived = true OR c.archivedAt IS NULL) "
            + "ORDER BY lower(c.name), c.id")
    List<Contact> findAllByPlan(@Param("plan") Plan plan, @Param("includeArchived") boolean includeArchived);

    /** Whether an active contact of the plan other than {@code exceptId} has this name, ignoring case. */
    @Query("SELECT COUNT(c) > 0 FROM Contact c WHERE c.plan = :plan AND c.archivedAt IS NULL "
            + "AND lower(c.name) = lower(:name) AND c.id <> :exceptId")
    boolean existsActiveNamed(@Param("plan") Plan plan, @Param("name") String name, @Param("exceptId") long exceptId);
}
