package com.lcs.findraco.exceptions;

public class FinancialTransactionCategoryExceptions {
    public static class FinancialTransactionCategoryNotFoundException extends RuntimeException {
        public FinancialTransactionCategoryNotFoundException(Long id) {
            super("Financial transaction category not found for id " + id + ".");
        }
    }

    public static class CategoryParentIsChildException extends RuntimeException {
        public CategoryParentIsChildException(Long parentId) {
            super("Category " + parentId + " is a subcategory and cannot be a parent.");
        }
    }

    public static class CategoryParentIsItselfException extends RuntimeException {
        public CategoryParentIsItselfException() {
            super("A category cannot be its own parent.");
        }
    }

    public static class CategoryWithChildrenCannotHaveParentException extends RuntimeException {
        public CategoryWithChildrenCannotHaveParentException() {
            super("A category that has subcategories cannot be given a parent.");
        }
    }

    public static class CategoryParentTypeMismatchException extends RuntimeException {
        public CategoryParentTypeMismatchException() {
            super("A subcategory must have the same type as its parent.");
        }
    }

    public static class CategoryWithChildrenTypeChangeException extends RuntimeException {
        public CategoryWithChildrenTypeChangeException() {
            super("The type of a category that has subcategories cannot be changed.");
        }
    }

    public static class CategoryHasChildrenException extends RuntimeException {
        public CategoryHasChildrenException(Long id) {
            super("Category " + id + " has subcategories. Move or delete them before deleting it.");
        }
    }

    public static class CategoryInUseException extends RuntimeException {
        public CategoryInUseException(Long id, long transactions, long items, long recurrenceDefinitions) {
            super("Category " + id + " is in use by " + transactions + " transaction(s), " + items + " item(s) and "
                    + recurrenceDefinitions + " recurrence definition(s). Choose a category to move them to.");
        }
    }

    public static class CategoryInvalidReassignTargetException extends RuntimeException {
        public CategoryInvalidReassignTargetException(String reason) {
            super("Invalid target category: " + reason);
        }
    }

    public static class CategoryMemberLimitsOnCreditException extends RuntimeException {
        public CategoryMemberLimitsOnCreditException() {
            super("Income categories cannot have per-member limits.");
        }
    }

    public static class CategoryMemberLimitsOnOwnedException extends RuntimeException {
        public CategoryMemberLimitsOnOwnedException() {
            super("A category that belongs to one member cannot have per-member limits.");
        }
    }

    public static class CategoryMemberLimitDuplicateMemberException extends RuntimeException {
        public CategoryMemberLimitDuplicateMemberException(Long memberId) {
            super("Member " + memberId + " is listed more than once in the per-member limits.");
        }
    }

    public static class CategoryMemberLimitInactiveMemberException extends RuntimeException {
        public CategoryMemberLimitInactiveMemberException(Long memberId) {
            super("User " + memberId + " is not an active member of the plan.");
        }
    }

    public static class CategoryOwnerOnChildException extends RuntimeException {
        public CategoryOwnerOnChildException() {
            super("A subcategory has its parent's owner and cannot set its own.");
        }
    }

    public static class CategoryOwnerInactiveMemberException extends RuntimeException {
        public CategoryOwnerInactiveMemberException(Long ownerId) {
            super("User " + ownerId + " is not an active member of the plan.");
        }
    }
}
