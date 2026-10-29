package com.lcs.findraco.transaction.exception;

public class TransactionExceptions {
    public static class TransactionNotFoundException extends RuntimeException {
        public TransactionNotFoundException(Long id) {
            super("Financial transaction not found for id " + id + ".");
        }
    }

    public static class TransactionSeriesNotFoundException extends RuntimeException {
        public TransactionSeriesNotFoundException(String seriesId) {
            super("Financial transaction series not found for id " + seriesId + ".");
        }
    }

    public static class CategoryTypeMismatchException extends RuntimeException {
        public CategoryTypeMismatchException() {
            super("Category does not match the transaction type.");
        }
    }

    public static class ItemCategoryTypeMismatchException extends RuntimeException {
        public ItemCategoryTypeMismatchException() {
            super("Item category does not match the transaction type.");
        }
    }

    public static class ItemsTotalExceedsAmountException extends RuntimeException {
        public ItemsTotalExceedsAmountException() {
            super("Items total cannot exceed the transaction amount.");
        }
    }

    public static class ParticipantSharesMismatchException extends RuntimeException {
        public ParticipantSharesMismatchException() {
            super("Participant shares must sum to the transaction amount.");
        }
    }
}
