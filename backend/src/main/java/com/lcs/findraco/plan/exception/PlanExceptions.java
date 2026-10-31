package com.lcs.findraco.plan.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

public class PlanExceptions {

    public static class PlanNotFoundException extends DomainException {
        public PlanNotFoundException(Long id) {
            super(ProblemType.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND, "Plan " + id + " not found.");
        }
    }

    /** Answers exactly like a missing plan, so a non-member learns nothing about it. */
    public static class NotAMemberException extends DomainException {
        public NotAMemberException(Long planId) {
            super(ProblemType.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND, "Plan " + planId + " not found.");
        }
    }

    public static class MemberNotFoundException extends DomainException {
        public MemberNotFoundException(Long planId, Long userId) {
            super(
                    ProblemType.MEMBER_NOT_FOUND,
                    HttpStatus.NOT_FOUND,
                    "User " + userId + " is not a member of plan " + planId + ".");
        }
    }

    public static class InsufficientPlanRoleException extends DomainException {
        public InsufficientPlanRoleException(String detail) {
            super(ProblemType.INSUFFICIENT_ROLE, HttpStatus.FORBIDDEN, detail);
        }
    }

    public static class CannotModifyOthersTransactionException extends DomainException {
        public CannotModifyOthersTransactionException() {
            super(
                    ProblemType.NOT_TRANSACTION_CREATOR,
                    HttpStatus.FORBIDDEN,
                    "You cannot modify a transaction created by another member.");
        }
    }

    public static class LastPlanException extends DomainException {
        public LastPlanException() {
            super(ProblemType.LAST_PLAN, HttpStatus.CONFLICT, "You cannot leave or delete your last remaining plan.");
        }
    }

    public static class LastOwnerException extends DomainException {
        public LastOwnerException() {
            super(
                    ProblemType.LAST_OWNER,
                    HttpStatus.CONFLICT,
                    "You cannot remove or demote the last owner of the plan. Transfer ownership first.");
        }
    }

    public static class OwnerRoleNeedsTransferException extends DomainException {
        public OwnerRoleNeedsTransferException() {
            super(
                    ProblemType.OWNER_ROLE_NEEDS_TRANSFER,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "role",
                    "Use transferOwnership to make another member the owner.");
        }
    }

    public static class OwnershipTransferToSelfException extends DomainException {
        public OwnershipTransferToSelfException() {
            super(
                    ProblemType.OWNERSHIP_TRANSFER_TO_SELF,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "newOwnerUserId",
                    "You cannot transfer ownership to yourself.");
        }
    }

    /** The detail never echoes the token: it is a secret. */
    public static class InvitationNotFoundException extends DomainException {
        public InvitationNotFoundException() {
            super(ProblemType.INVITATION_NOT_FOUND, HttpStatus.NOT_FOUND, "Invitation not found.");
        }
    }

    public static class InvitationEmailRequiredException extends DomainException {
        public InvitationEmailRequiredException() {
            super(
                    ProblemType.INVITATION_EMAIL_REQUIRED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "An invitation by email needs the email address of the person invited.");
        }
    }

    public static class InvitationEmailMismatchException extends DomainException {
        public InvitationEmailMismatchException() {
            super(
                    ProblemType.INVITATION_EMAIL_MISMATCH,
                    HttpStatus.CONFLICT,
                    "This invitation is bound to a different email address.");
        }
    }

    public static class InvitationRevokedException extends DomainException {
        public InvitationRevokedException() {
            super(ProblemType.INVITATION_REVOKED, HttpStatus.CONFLICT, "This invitation has been revoked.");
        }
    }

    public static class InvitationAlreadyUsedException extends DomainException {
        public InvitationAlreadyUsedException() {
            super(ProblemType.INVITATION_USED, HttpStatus.CONFLICT, "This invitation has already been used.");
        }
    }

    public static class InvitationExpiredException extends DomainException {
        public InvitationExpiredException() {
            super(ProblemType.INVITATION_EXPIRED, HttpStatus.CONFLICT, "This invitation has expired.");
        }
    }
}
