package com.lcs.findraco.plan.controller;

import com.lcs.findraco.plan.model.PlanMembership;
import com.lcs.findraco.plan.request.CreatePlanRequest;
import com.lcs.findraco.plan.request.TransferOwnershipRequest;
import com.lcs.findraco.plan.request.UpdateMemberRoleRequest;
import com.lcs.findraco.plan.request.UpdatePlanRequest;
import com.lcs.findraco.plan.response.PlanMemberResponse;
import com.lcs.findraco.plan.response.PlanResponse;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.security.CurrentUser;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.user.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Plans")
@RestController
@RequestMapping(ApiRoutes.PLAN)
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @Operation(summary = "Creates a new plan owned by the authenticated user")
    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
            @RequestBody @Valid CreatePlanRequest dto, @CurrentUser User loggedUser) {
        PlanMembership membership = planService.createPlan(dto.name(), loggedUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(PlanResponse.from(membership));
    }

    @Operation(summary = "Fetches all plans the authenticated user belongs to")
    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlans(@CurrentUser User loggedUser) {
        List<PlanResponse> plans = planService.findMembershipsForUser(loggedUser).stream()
                .map(PlanResponse::from)
                .toList();
        return ResponseEntity.ok(plans);
    }

    @Operation(summary = "Fetches a plan the authenticated user belongs to")
    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getPlan(@PathVariable Long id, @CurrentUser User loggedUser) {
        return ResponseEntity.ok(PlanResponse.from(planService.getMembership(id, loggedUser)));
    }

    @Operation(summary = "Fetches the members of a plan the authenticated user belongs to")
    @GetMapping("/{id}/members")
    public ResponseEntity<List<PlanMemberResponse>> getMembers(@PathVariable Long id, @CurrentUser User loggedUser) {
        List<PlanMemberResponse> members = planService.getMembers(id, loggedUser).stream()
                .map(PlanMemberResponse::from)
                .toList();
        return ResponseEntity.ok(members);
    }

    @Operation(summary = "Renames a plan (owner only)")
    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> renamePlan(
            @PathVariable Long id, @RequestBody @Valid UpdatePlanRequest dto, @CurrentUser User loggedUser) {
        return ResponseEntity.ok(PlanResponse.from(planService.renamePlan(id, dto.name(), loggedUser)));
    }

    @Operation(summary = "Deletes (soft-delete) a plan (owner only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id, @CurrentUser User loggedUser) {
        planService.deletePlan(id, loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Leaves a plan (non-owner only)")
    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leavePlan(@PathVariable Long id, @CurrentUser User loggedUser) {
        planService.leavePlan(id, loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Transfers plan ownership to another member (owner only)")
    @PostMapping("/{id}/transfer")
    public ResponseEntity<Void> transferOwnership(
            @PathVariable Long id, @RequestBody @Valid TransferOwnershipRequest dto, @CurrentUser User loggedUser) {
        planService.transferOwnership(id, dto.newOwnerUserId(), dto.previousOwnerRole(), loggedUser);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Changes the role of a plan member (owner only)")
    @PutMapping("/{id}/members/{userId}")
    public ResponseEntity<PlanMemberResponse> updateMemberRole(
            @PathVariable Long id,
            @PathVariable Long userId,
            @RequestBody @Valid UpdateMemberRoleRequest dto,
            @CurrentUser User loggedUser) {
        return ResponseEntity.ok(
                PlanMemberResponse.from(planService.changeMemberRole(id, userId, dto.role(), loggedUser)));
    }

    @Operation(summary = "Removes a member from a plan (owner only)")
    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long id, @PathVariable Long userId, @CurrentUser User loggedUser) {
        planService.removeMember(id, userId, loggedUser);
        return ResponseEntity.noContent().build();
    }
}
