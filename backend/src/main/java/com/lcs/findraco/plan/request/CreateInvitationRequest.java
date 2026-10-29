package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.InvitationType;
import com.lcs.findraco.plan.model.PlanRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CreateInvitationRequest(
        @NotNull(message = "Role cannot be null.") PlanRole role,
        @NotNull(message = "Type cannot be null.") InvitationType type,
        @Email(message = "Email must be valid.") String email,
        LocalDateTime expiresAt) {}
