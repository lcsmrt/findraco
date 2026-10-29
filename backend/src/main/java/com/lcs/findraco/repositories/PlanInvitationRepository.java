package com.lcs.findraco.repositories;

import com.lcs.findraco.models.Plan;
import com.lcs.findraco.models.PlanInvitation;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanInvitationRepository extends JpaRepository<PlanInvitation, Long> {

    Optional<PlanInvitation> findByToken(String token);

    Optional<PlanInvitation> findByIdAndPlan(Long id, Plan plan);

    List<PlanInvitation> findAllByPlan(Plan plan);
}
