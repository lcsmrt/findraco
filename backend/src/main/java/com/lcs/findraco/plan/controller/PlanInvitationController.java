package com.lcs.findraco.plan.controller;

import com.lcs.findraco.plan.request.CreateInvitationRequest;
import com.lcs.findraco.plan.response.AcceptInvitationResponse;
import com.lcs.findraco.plan.response.InvitationPreviewResponse;
import com.lcs.findraco.plan.response.InvitationResponse;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanInvitationService;
import com.lcs.findraco.shared.security.AuthenticatedUser;
import com.lcs.findraco.shared.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Invitations")
@RestController
public class PlanInvitationController {

    private final PlanInvitationService invitationService;

    public PlanInvitationController(PlanInvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @Operation(summary = "Creates an invitation (email or link) for the plan; owner only")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(PlanRoutes.PLAN_INVITATION)
    public ResponseEntity<InvitationResponse> createInvitation(
            @RequestBody @Valid CreateInvitationRequest dto, PlanContext ctx) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invitationService.createInvite(dto, ctx));
    }

    @Operation(summary = "Lists a plan's invitations (owner only)")
    @GetMapping(PlanRoutes.PLAN_INVITATION)
    public ResponseEntity<List<InvitationResponse>> listInvitations(PlanContext ctx) {
        return ResponseEntity.ok(invitationService.listInvitations(ctx));
    }

    @Operation(summary = "Revokes an invitation (owner only)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(PlanRoutes.PLAN_INVITATION + "/{invitationId}")
    public ResponseEntity<Void> revokeInvitation(@PathVariable Long invitationId, PlanContext ctx) {
        invitationService.revoke(invitationId, ctx);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Previews an invitation by token before accepting")
    @SecurityRequirements
    @GetMapping(PlanRoutes.INVITATION + "/{token}")
    public ResponseEntity<InvitationPreviewResponse> previewInvitation(@PathVariable String token) {
        return ResponseEntity.ok(invitationService.preview(token));
    }

    @Operation(summary = "Accepts an invitation by token for the authenticated user")
    @ApiResponse(responseCode = "201", description = "Created")
    @ApiResponse(responseCode = "200", description = "OK")
    @PostMapping(PlanRoutes.INVITATION + "/{token}/accept")
    public ResponseEntity<AcceptInvitationResponse> acceptInvitation(
            @PathVariable String token, @CurrentUser AuthenticatedUser user) {
        PlanInvitationService.AcceptResult result = invitationService.accept(token, user.id());
        HttpStatus status = result.created() ? HttpStatus.CREATED : HttpStatus.OK;
        return ResponseEntity.status(status).body(result.membership());
    }
}
