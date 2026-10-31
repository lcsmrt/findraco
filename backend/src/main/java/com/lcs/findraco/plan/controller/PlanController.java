package com.lcs.findraco.plan.controller;

import com.lcs.findraco.plan.request.CreatePlanRequest;
import com.lcs.findraco.plan.request.TransferOwnershipRequest;
import com.lcs.findraco.plan.request.UpdateMemberRoleRequest;
import com.lcs.findraco.plan.request.UpdatePlanRequest;
import com.lcs.findraco.plan.response.PlanMemberResponse;
import com.lcs.findraco.plan.response.PlanResponse;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.shared.security.AuthenticatedUser;
import com.lcs.findraco.shared.security.CurrentUser;
import com.lcs.findraco.shared.web.ApiRoutes;
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
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseEntity<PlanResponse> createPlan(
            @RequestBody @Valid CreatePlanRequest dto, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(dto.name(), user.id()));
    }

    @Operation(summary = "Fetches all plans the authenticated user belongs to")
    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlans(@CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(planService.listPlans(user.id()));
    }

    @Operation(summary = "Fetches a plan the authenticated user belongs to")
    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> getPlan(@PathVariable Long id, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(planService.getPlan(id, user.id()));
    }

    @Operation(summary = "Fetches the members of a plan the authenticated user belongs to")
    @GetMapping("/{id}/members")
    public ResponseEntity<List<PlanMemberResponse>> getMembers(
            @PathVariable Long id, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(planService.getMembers(id, user.id()));
    }

    @Operation(summary = "Renames a plan (owner only)")
    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> renamePlan(
            @PathVariable Long id, @RequestBody @Valid UpdatePlanRequest dto, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(planService.renamePlan(id, dto.name(), user.id()));
    }

    @Operation(summary = "Deletes (soft-delete) a plan (owner only)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id, @CurrentUser AuthenticatedUser user) {
        planService.deletePlan(id, user.id());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Leaves a plan (non-owner only)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leavePlan(@PathVariable Long id, @CurrentUser AuthenticatedUser user) {
        planService.leavePlan(id, user.id());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Transfers plan ownership to another member (owner only)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/{id}/transfer")
    public ResponseEntity<Void> transferOwnership(
            @PathVariable Long id,
            @RequestBody @Valid TransferOwnershipRequest dto,
            @CurrentUser AuthenticatedUser user) {
        planService.transferOwnership(id, dto.newOwnerUserId(), dto.previousOwnerRole(), user.id());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Changes the role of a plan member (owner only)")
    @PutMapping("/{id}/members/{userId}")
    public ResponseEntity<PlanMemberResponse> updateMemberRole(
            @PathVariable Long id,
            @PathVariable Long userId,
            @RequestBody @Valid UpdateMemberRoleRequest dto,
            @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(planService.changeMemberRole(id, userId, dto.role(), user.id()));
    }

    @Operation(summary = "Removes a member from a plan (owner only)")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long id, @PathVariable Long userId, @CurrentUser AuthenticatedUser user) {
        planService.removeMember(id, userId, user.id());
        return ResponseEntity.noContent().build();
    }
}
