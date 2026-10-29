package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.model.PlanRole;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanService {

    private final PlanRepository planRepository;
    private final PlanMembershipRepository membershipRepository;
    private final PlanAuthorization planAuthorization;
    private final EntityManager entityManager;

    public PlanService(
            PlanRepository planRepository,
            PlanMembershipRepository membershipRepository,
            PlanAuthorization planAuthorization,
            EntityManager entityManager) {
        this.planRepository = planRepository;
        this.membershipRepository = membershipRepository;
        this.planAuthorization = planAuthorization;
        this.entityManager = entityManager;
    }

    @Transactional
    public PlanMembership createPlan(String name, long ownerId) {
        return createPlanInternal(name, entityManager.getReference(User.class, ownerId), false);
    }

    @Transactional
    public PlanMembership provisionDefaultPlan(User owner) {
        return createPlanInternal("My plan", owner, true);
    }

    private PlanMembership createPlanInternal(String name, User owner, boolean isDefault) {
        Plan plan = new Plan();
        plan.setName(name);
        plan.setCreatedBy(owner);
        plan.setDefault(isDefault);
        Plan savedPlan = planRepository.save(plan);

        PlanMembership membership = new PlanMembership();
        membership.setPlan(savedPlan);
        membership.setUser(owner);
        membership.setRole(PlanRole.OWNER);
        return membershipRepository.save(membership);
    }

    @Transactional(readOnly = true)
    public List<PlanMembership> findMembershipsForUser(long userId) {
        return membershipRepository.findAllByUserId(userId);
    }

    /** The plan context of a request: the caller must be a member of a live plan, otherwise not-found. */
    @Transactional(readOnly = true)
    public PlanContext resolveContext(long planId, long userId) {
        return new PlanContext(planId, userId, getMembership(planId, userId).getRole());
    }

    @Transactional(readOnly = true)
    public PlanMembership getMembership(long planId, long userId) {
        Plan plan = planRepository.findById(planId).orElseThrow(() -> new PlanExceptions.PlanNotFoundException(planId));

        if (plan.getDeletedAt() != null) {
            throw new PlanExceptions.PlanNotFoundException(planId);
        }

        return membershipRepository
                .findByPlanAndUser_Id(plan, userId)
                .orElseThrow(() -> new PlanExceptions.NotAMemberException(planId));
    }

    /** Every membership of the plan, for features that read the plan's members (no requester check). */
    @Transactional(readOnly = true)
    public List<PlanMembership> findMemberships(long planId) {
        return membershipRepository.findAllByPlan(planRepository.getReferenceById(planId));
    }

    @Transactional(readOnly = true)
    public boolean isMember(long planId, long userId) {
        return membershipRepository.existsByPlan_IdAndUser_Id(planId, userId);
    }

    @Transactional(readOnly = true)
    public List<PlanMembership> getMembers(long planId, long requesterId) {
        PlanMembership requesterMembership = getMembership(planId, requesterId);
        return membershipRepository.findAllByPlan(requesterMembership.getPlan());
    }

    @Transactional(readOnly = true)
    public void requireNotLastPlan(long userId) {
        if (membershipRepository.findAllByUserId(userId).size() <= 1) {
            throw new PlanExceptions.LastPlanException();
        }
    }

    @Transactional(readOnly = true)
    public void requireNotLastOwner(Plan plan) {
        if (membershipRepository.countByPlanAndRole(plan, PlanRole.OWNER) <= 1) {
            throw new PlanExceptions.LastOwnerException();
        }
    }

    @Transactional
    public PlanMembership changeMemberRole(long planId, long targetUserId, PlanRole newRole, long requesterId) {
        if (newRole == PlanRole.OWNER) {
            throw new PlanExceptions.OwnerRoleNeedsTransferException();
        }

        PlanMembership requesterMembership = getMembership(planId, requesterId);
        planAuthorization.requireOwner(requesterMembership.getRole());

        Plan plan = requesterMembership.getPlan();
        PlanMembership targetMembership = membershipRepository
                .findByPlanAndUser_Id(plan, targetUserId)
                .orElseThrow(() -> new PlanExceptions.MemberNotFoundException(planId, targetUserId));

        if (targetMembership.getRole() == PlanRole.OWNER) {
            requireNotLastOwner(plan);
        }

        targetMembership.setRole(newRole);
        return membershipRepository.save(targetMembership);
    }

    @Transactional
    public PlanMembership renamePlan(long planId, String newName, long requesterId) {
        PlanMembership requesterMembership = getMembership(planId, requesterId);
        planAuthorization.requireOwner(requesterMembership.getRole());

        Plan plan = requesterMembership.getPlan();
        plan.setName(newName);
        planRepository.save(plan);

        return requesterMembership;
    }

    @Transactional
    public void deletePlan(long planId, long requesterId) {
        PlanMembership requesterMembership = getMembership(planId, requesterId);
        planAuthorization.requireOwner(requesterMembership.getRole());
        requireNotLastPlan(requesterId);

        Plan plan = requesterMembership.getPlan();
        plan.setDeletedAt(LocalDateTime.now());
        planRepository.save(plan);
    }

    @Transactional
    public void removeMember(long planId, long targetUserId, long requesterId) {
        PlanMembership requesterMembership = getMembership(planId, requesterId);
        planAuthorization.requireOwner(requesterMembership.getRole());

        Plan plan = requesterMembership.getPlan();
        PlanMembership targetMembership = membershipRepository
                .findByPlanAndUser_Id(plan, targetUserId)
                .orElseThrow(() -> new PlanExceptions.MemberNotFoundException(planId, targetUserId));

        if (targetMembership.getRole() == PlanRole.OWNER) {
            requireNotLastOwner(plan);
        }

        membershipRepository.delete(targetMembership);
    }

    @Transactional
    public void leavePlan(long planId, long requesterId) {
        PlanMembership requesterMembership = getMembership(planId, requesterId);

        if (requesterMembership.getRole() == PlanRole.OWNER) {
            throw new PlanExceptions.LastOwnerException();
        }

        requireNotLastPlan(requesterId);
        membershipRepository.delete(requesterMembership);
    }

    @Transactional
    public void transferOwnership(long planId, long targetUserId, PlanRole previousOwnerRole, long requesterId) {
        if (targetUserId == requesterId) {
            throw new PlanExceptions.OwnershipTransferToSelfException();
        }

        PlanMembership requesterMembership = getMembership(planId, requesterId);
        planAuthorization.requireOwner(requesterMembership.getRole());

        Plan plan = requesterMembership.getPlan();
        PlanMembership newOwnerMembership = membershipRepository
                .findByPlanAndUser_Id(plan, targetUserId)
                .orElseThrow(() -> new PlanExceptions.MemberNotFoundException(planId, targetUserId));

        PlanRole demotedRole = previousOwnerRole != null ? previousOwnerRole : PlanRole.EDITOR;

        newOwnerMembership.setRole(PlanRole.OWNER);
        requesterMembership.setRole(demotedRole);

        membershipRepository.save(newOwnerMembership);
        membershipRepository.save(requesterMembership);
    }
}
