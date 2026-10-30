package com.lcs.findraco.plan.service;

import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.plan.model.PlanRole;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

/**
 * Layer 2 authorization: role x row-ownership rules. Pure logic, no dependencies. Each rule is a query
 * {@code canX} and each guard {@code requireX} throws a {@link PlanExceptions} (403-mapped) exactly when
 * its query is false, so the permission flags in responses and the guards cannot disagree.
 */
@Component
public class PlanAuthorization {

    /** Any member except VIEWER may create transactions. */
    public boolean canCreateTransactions(PlanRole role) {
        return role != PlanRole.VIEWER;
    }

    /** OWNER/EDITOR may modify (edit or delete) any transaction; CONTRIBUTOR only their own; VIEWER none. */
    public boolean canModifyTransaction(PlanRole role, @Nullable Long rowOwnerId, long actorId) {
        return switch (role) {
            case OWNER, EDITOR -> true;
            case CONTRIBUTOR -> rowOwnerId != null && rowOwnerId == actorId;
            case VIEWER -> false;
        };
    }

    /** Only OWNER may manage categories. */
    public boolean canManageCategories(PlanRole role) {
        return role == PlanRole.OWNER;
    }

    /** Only OWNER may manage the plan: rename, delete, members, invitations, ownership. */
    public boolean canManagePlan(PlanRole role) {
        return role == PlanRole.OWNER;
    }

    /** OWNER/EDITOR may attribute a transaction to other members; CONTRIBUTOR/VIEWER may not. */
    public boolean canAttributeToOthers(PlanRole role) {
        return role == PlanRole.OWNER || role == PlanRole.EDITOR;
    }

    public void requireCanCreateTransaction(PlanRole role) {
        if (!canCreateTransactions(role)) {
            throw new PlanExceptions.InsufficientPlanRoleException("Viewers cannot create transactions.");
        }
    }

    public void requireCanModifyTransaction(PlanRole role, @Nullable Long rowOwnerId, long actorId) {
        if (!canModifyTransaction(role, rowOwnerId, actorId)) {
            throw role == PlanRole.CONTRIBUTOR
                    ? new PlanExceptions.CannotModifyOthersTransactionException()
                    : new PlanExceptions.InsufficientPlanRoleException("Viewers cannot modify transactions.");
        }
    }

    public void requireCanManageCategories(PlanRole role) {
        if (!canManageCategories(role)) {
            throw new PlanExceptions.InsufficientPlanRoleException("Only the plan owner can manage categories.");
        }
    }

    public void requireCanManagePlan(PlanRole role) {
        if (!canManagePlan(role)) {
            throw new PlanExceptions.InsufficientPlanRoleException("Only the plan owner can perform this action.");
        }
    }

    public void requireCanAttributeToOthers(PlanRole role) {
        if (!canAttributeToOthers(role)) {
            throw new PlanExceptions.InsufficientPlanRoleException(
                    "Only owners and editors can attribute a transaction to other members.");
        }
    }
}
