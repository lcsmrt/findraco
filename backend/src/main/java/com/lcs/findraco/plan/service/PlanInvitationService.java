package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.plan.model.InvitationStatus;
import com.lcs.findraco.plan.model.InvitationType;
import com.lcs.findraco.plan.model.PlanInvitation;
import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.repository.PlanInvitationRepository;
import com.lcs.findraco.plan.repository.PlanMembershipRepository;
import com.lcs.findraco.plan.repository.PlanRepository;
import com.lcs.findraco.plan.request.CreateInvitationRequest;
import com.lcs.findraco.user.model.User;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlanInvitationService {

    private final PlanInvitationRepository invitationRepository;
    private final PlanMembershipRepository membershipRepository;
    private final PlanRepository planRepository;
    private final PlanAuthorization planAuthorization;
    private final EntityManager entityManager;

    public PlanInvitationService(
            PlanInvitationRepository invitationRepository,
            PlanMembershipRepository membershipRepository,
            PlanRepository planRepository,
            PlanAuthorization planAuthorization,
            EntityManager entityManager) {
        this.invitationRepository = invitationRepository;
        this.membershipRepository = membershipRepository;
        this.planRepository = planRepository;
        this.planAuthorization = planAuthorization;
        this.entityManager = entityManager;
    }

    /** Only the plan owner may invite. Builds and persists a PENDING invitation. */
    @Transactional
    public PlanInvitation createInvite(CreateInvitationRequest request, PlanContext ctx) {
        planAuthorization.requireOwner(ctx.role());

        InvitationType type = request.type();
        PlanInvitation invitation = new PlanInvitation();
        invitation.setPlan(planRepository.getReferenceById(ctx.planId()));
        invitation.setRole(request.role());
        invitation.setType(type);
        invitation.setEmail(type == InvitationType.EMAIL ? request.email() : null);
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setStatus(InvitationStatus.PENDING);
        invitation.setInvitedBy(entityManager.getReference(User.class, ctx.userId()));
        invitation.setExpiresAt(type == InvitationType.LINK ? request.expiresAt() : null);

        return invitationRepository.save(invitation);
    }

    /** Reads an invitation by token for display before accepting. */
    @Transactional(readOnly = true)
    public PlanInvitation preview(String token) {
        return loadValidInvitation(token);
    }

    /** Outcome of accepting an invitation: the membership, and whether it was newly created. */
    public record AcceptResult(PlanMembership membership, boolean created) {}

    /**
     * Accepts an invitation for the acting user. Idempotent: if the user is already a
     * member the existing membership is returned without duplicating it ({@code created = false}).
     * EMAIL invites are single-use (marked ACCEPTED); LINK invites stay PENDING (reusable).
     */
    @Transactional
    public AcceptResult accept(String token, long userId) {
        PlanInvitation invitation = loadValidInvitation(token);
        User actor = entityManager.getReference(User.class, userId);

        if (invitation.getType() == InvitationType.EMAIL
                && !invitation.getEmail().equalsIgnoreCase(actor.getEmail())) {
            throw new PlanExceptions.InvitationEmailMismatchException();
        }

        if (membershipRepository.existsByPlanAndUser(invitation.getPlan(), actor)) {
            if (invitation.getType() == InvitationType.EMAIL) {
                invitation.setStatus(InvitationStatus.ACCEPTED);
            }
            PlanMembership existing = membershipRepository
                    .findByPlanAndUser(invitation.getPlan(), actor)
                    .orElseThrow(() -> new PlanExceptions.NotAMemberException(
                            invitation.getPlan().getId()));
            return new AcceptResult(existing, false);
        }

        PlanMembership membership = new PlanMembership();
        membership.setPlan(invitation.getPlan());
        membership.setUser(actor);
        membership.setRole(invitation.getRole());
        PlanMembership savedMembership = membershipRepository.save(membership);

        if (invitation.getType() == InvitationType.EMAIL) {
            invitation.setStatus(InvitationStatus.ACCEPTED);
        }

        return new AcceptResult(savedMembership, true);
    }

    /** Only the plan owner may list the active plan's invitations. */
    @Transactional(readOnly = true)
    public List<PlanInvitation> listInvitations(PlanContext ctx) {
        planAuthorization.requireOwner(ctx.role());
        return invitationRepository.findAllByPlan(planRepository.getReferenceById(ctx.planId()));
    }

    /** Only the plan owner may revoke an invitation belonging to the active plan. */
    @Transactional
    public void revoke(long invitationId, PlanContext ctx) {
        planAuthorization.requireOwner(ctx.role());

        PlanInvitation invitation = invitationRepository
                .findByIdAndPlan(invitationId, planRepository.getReferenceById(ctx.planId()))
                .orElseThrow(PlanExceptions.InvitationNotFoundException::new);

        invitation.setStatus(InvitationStatus.REVOKED);
    }

    /**
     * Loads by token, rejecting missing / revoked / already-consumed EMAIL / expired
     * invitations. Expiry is checked lazily against {@code expiresAt} rather than
     * persisted as a status flip: the {@code plan_invitations_status_check} DB
     * constraint only allows PENDING/ACCEPTED/REVOKED, so writing EXPIRED would require
     * a schema migration out of scope here.
     */
    private PlanInvitation loadValidInvitation(String token) {
        PlanInvitation invitation =
                invitationRepository.findByToken(token).orElseThrow(PlanExceptions.InvitationNotFoundException::new);

        if (invitation.getStatus() == InvitationStatus.REVOKED) {
            throw new PlanExceptions.InvitationRevokedException();
        }
        if (invitation.getType() == InvitationType.EMAIL && invitation.getStatus() == InvitationStatus.ACCEPTED) {
            throw new PlanExceptions.InvitationAlreadyUsedException();
        }
        if (invitation.getExpiresAt() != null && invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new PlanExceptions.InvitationExpiredException();
        }

        return invitation;
    }
}
