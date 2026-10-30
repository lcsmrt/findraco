package com.lcs.findraco.plan.request;

import com.lcs.findraco.plan.model.InvitationRole;
import com.lcs.findraco.plan.model.InvitationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreateInvitationRequest(
        @NotNull(message = "Role cannot be null.") InvitationRole role,
        @NotNull(message = "Type cannot be null.") InvitationType type,

        @Email(message = "Email must be valid.") @Size(max = 255, message = "Email cannot exceed 255 characters.")
        String email,

        LocalDateTime expiresAt) {}
