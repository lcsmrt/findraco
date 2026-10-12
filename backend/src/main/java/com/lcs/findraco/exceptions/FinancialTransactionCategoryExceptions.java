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
}
