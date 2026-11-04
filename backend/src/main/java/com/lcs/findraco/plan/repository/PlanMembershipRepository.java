package com.lcs.findraco.plan.repository;

import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.user.model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanMembershipRepository extends JpaRepository<PlanMembership, Long> {

    @Query("select m from PlanMembership m join fetch m.plan where m.user.id = :userId and m.plan.deletedAt is null")
    List<PlanMembership> findAllByUserId(@Param("userId") long userId);

    @Query("select m from PlanMembership m join fetch m.plan p where m.user.id = :userId and m.role = :role "
            + "and p.deletedAt is not null order by p.deletedAt desc, p.id desc")
    List<PlanMembership> findArchivedByUserIdAndRole(@Param("userId") long userId, @Param("role") PlanRole role);

    @Query("select m from PlanMembership m join fetch m.plan where m.plan.id = :planId and m.user.id = :userId")
    Optional<PlanMembership> findByPlanIdAndUserId(@Param("planId") long planId, @Param("userId") long userId);

    Optional<PlanMembership> findByPlanAndUser(Plan plan, User user);

    Optional<PlanMembership> findByPlanAndUser_Id(Plan plan, Long userId);

    boolean existsByPlanAndUser(Plan plan, User user);

    boolean existsByPlan_IdAndUser_Id(long planId, long userId);

    @EntityGraph(attributePaths = "user")
    List<PlanMembership> findAllByPlan(Plan plan);

    long countByPlanAndRole(Plan plan, PlanRole role);
}
