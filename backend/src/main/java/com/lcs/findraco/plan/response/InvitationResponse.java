package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.InvitationStatus;
import com.lcs.findraco.plan.model.InvitationType;
import com.lcs.findraco.plan.model.PlanInvitation;
import com.lcs.findraco.plan.model.PlanRole;
import java.time.LocalDateTime;

public record InvitationResponse(
        Long id,
        String token,
        PlanRole role,
        InvitationType type,
        String email,
        InvitationStatus status,
        String link,
        LocalDateTime expiresAt) {

    public static InvitationResponse from(PlanInvitation invitation) {
        LocalDateTime expiresAt = invitation.getExpiresAt();
        // Expiry is never persisted as a status (the DB check constraint only allows
        // PENDING/ACCEPTED/REVOKED); it is computed here so listings reflect reality
        // even for an expired invitation that was never previewed/accepted.
        InvitationStatus status = invitation.getStatus() == InvitationStatus.PENDING
                        && expiresAt != null
                        && expiresAt.isBefore(LocalDateTime.now())
                ? InvitationStatus.EXPIRED
                : invitation.getStatus();
        String link = invitation.getType() == InvitationType.LINK ? "/invitation/" + invitation.getToken() : null;
        return new InvitationResponse(
                invitation.getId(),
                invitation.getToken(),
                invitation.getRole(),
                invitation.getType(),
                invitation.getEmail(),
                status,
                link,
                expiresAt);
    }
}
