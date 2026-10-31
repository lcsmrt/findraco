package com.lcs.findraco.category.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

/**
 * A rule the request breaks on its own answers 422; one that holds only because of what is stored (the
 * category's subcategories, its use) answers 409, since the request would succeed once that changes.
 */
public class CategoryExceptions {
    public static class CategoryNotFoundException extends DomainException {
        public CategoryNotFoundException(Long id) {
            super(ProblemType.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND, "Category " + id + " not found.");
        }
    }

    public static class CategoryParentIsChildException extends DomainException {
        public CategoryParentIsChildException(Long parentId) {
            super(
                    ProblemType.CATEGORY_PARENT_IS_SUBCATEGORY,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "parentId",
                    "Category " + parentId + " is a subcategory and cannot be a parent.");
        }
    }

    public static class CategoryParentIsItselfException extends DomainException {
        public CategoryParentIsItselfException() {
            super(
                    ProblemType.CATEGORY_PARENT_IS_ITSELF,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "parentId",
                    "A category cannot be its own parent.");
        }
    }

    public static class CategoryWithChildrenCannotHaveParentException extends DomainException {
        public CategoryWithChildrenCannotHaveParentException() {
            super(
                    ProblemType.CATEGORY_SUBCATEGORIES_BLOCK_PARENT,
                    HttpStatus.CONFLICT,
                    "parentId",
                    "A category that has subcategories cannot be given a parent.");
        }
    }

    public static class CategoryParentTypeMismatchException extends DomainException {
        public CategoryParentTypeMismatchException() {
            super(
                    ProblemType.CATEGORY_PARENT_TYPE_MISMATCH,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "parentId",
                    "A subcategory must have the same type as its parent.");
        }
    }

    public static class CategoryWithChildrenTypeChangeException extends DomainException {
        public CategoryWithChildrenTypeChangeException() {
            super(
                    ProblemType.CATEGORY_SUBCATEGORIES_BLOCK_TYPE_CHANGE,
                    HttpStatus.CONFLICT,
                    "type",
                    "The type of a category that has subcategories cannot be changed.");
        }
    }

    public static class CategoryTypeChangeInUseException extends DomainException {
        public CategoryTypeChangeInUseException(Long id) {
            super(
                    ProblemType.CATEGORY_TYPE_CHANGE_IN_USE,
                    HttpStatus.CONFLICT,
                    "type",
                    "Category " + id + " is used by transactions, items or series, so its type cannot change.");
        }
    }

    public static class CategoryHasChildrenException extends DomainException {
        public CategoryHasChildrenException(Long id) {
            super(
                    ProblemType.CATEGORY_HAS_SUBCATEGORIES,
                    HttpStatus.CONFLICT,
                    "Category " + id + " has subcategories. Move or delete them before deleting it.");
        }
    }

    public static class CategoryInUseException extends DomainException {
        public CategoryInUseException(Long id, long transactions, long items, long recurrenceDefinitions) {
            super(
                    ProblemType.CATEGORY_IN_USE,
                    HttpStatus.CONFLICT,
                    "reassignTo",
                    "Category " + id + " is in use by " + transactions + " transaction(s), " + items + " item(s) and "
                            + recurrenceDefinitions + " recurrence definition(s). Choose a category to move them to.");
        }
    }

    public static class CategoryInvalidReassignTargetException extends DomainException {
        public CategoryInvalidReassignTargetException(String reason) {
            super(
                    ProblemType.CATEGORY_INVALID_REASSIGN_TARGET,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "reassignTo",
                    "Invalid target category: " + reason);
        }
    }

    public static class CategoryMemberLimitsOnCreditException extends DomainException {
        public CategoryMemberLimitsOnCreditException() {
            super(
                    ProblemType.CATEGORY_MEMBER_LIMITS_ON_INCOME,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "memberLimits",
                    "Income categories cannot have per-member limits.");
        }
    }

    public static class CategoryMemberLimitsOnOwnedException extends DomainException {
        public CategoryMemberLimitsOnOwnedException() {
            super(
                    ProblemType.CATEGORY_MEMBER_LIMITS_ON_OWNED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "memberLimits",
                    "A category that belongs to one member cannot have per-member limits.");
        }
    }

    public static class CategoryMemberLimitDuplicateMemberException extends DomainException {
        public CategoryMemberLimitDuplicateMemberException(Long memberId) {
            super(
                    ProblemType.CATEGORY_MEMBER_LIMIT_DUPLICATE,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "memberLimits",
                    "Member " + memberId + " is listed more than once in the per-member limits.");
        }
    }

    public static class CategoryMemberLimitInactiveMemberException extends DomainException {
        public CategoryMemberLimitInactiveMemberException(Long memberId) {
            super(
                    ProblemType.CATEGORY_MEMBER_LIMIT_NOT_MEMBER,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "memberLimits",
                    "User " + memberId + " is not an active member of the plan.");
        }
    }

    public static class CategoryOwnerOnChildException extends DomainException {
        public CategoryOwnerOnChildException() {
            super(
                    ProblemType.CATEGORY_OWNER_ON_SUBCATEGORY,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "ownerId",
                    "A subcategory has its parent's owner and cannot set its own.");
        }
    }

    public static class CategoryOwnerInactiveMemberException extends DomainException {
        public CategoryOwnerInactiveMemberException(Long ownerId) {
            super(
                    ProblemType.CATEGORY_OWNER_NOT_MEMBER,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "ownerId",
                    "User " + ownerId + " is not an active member of the plan.");
        }
    }
}
