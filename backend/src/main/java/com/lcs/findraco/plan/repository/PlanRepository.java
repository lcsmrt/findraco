package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.user.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    @Query("select m.plan from PlanMembership m where m.user = :user and m.plan.deletedAt is null")
    List<Plan> findAllByUser(@Param("user") User user);

    @Query("select p from Plan p where p.createdBy = :user and p.isDefault = true and p.deletedAt is null")
    Optional<Plan> findByCreatedByAndIsDefaultTrue(@Param("user") User user);
}
