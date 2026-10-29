package com.lcs.findraco.transaction.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

public class TransactionExceptions {
    public static class TransactionNotFoundException extends DomainException {
        public TransactionNotFoundException(Long id) {
            super(ProblemType.TRANSACTION_NOT_FOUND, HttpStatus.NOT_FOUND, "Transaction " + id + " not found.");
        }
    }

    public static class TransactionSeriesNotFoundException extends DomainException {
        public TransactionSeriesNotFoundException(String seriesId) {
            super(ProblemType.SERIES_NOT_FOUND, HttpStatus.NOT_FOUND, "Series " + seriesId + " not found.");
        }
    }

    public static class CategoryTypeMismatchException extends DomainException {
        public CategoryTypeMismatchException() {
            super(
                    ProblemType.TRANSACTION_CATEGORY_TYPE_MISMATCH,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "categoryId",
                    "Category does not match the transaction type.");
        }
    }

    public static class ItemCategoryTypeMismatchException extends DomainException {
        public ItemCategoryTypeMismatchException() {
            super(
                    ProblemType.ITEM_CATEGORY_TYPE_MISMATCH,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "items",
                    "Item category does not match the transaction type.");
        }
    }

    public static class ItemsTotalExceedsAmountException extends DomainException {
        public ItemsTotalExceedsAmountException() {
            super(
                    ProblemType.ITEMS_EXCEED_AMOUNT,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "items",
                    "Items total cannot exceed the transaction amount.");
        }
    }

    public static class ParticipantSharesMismatchException extends DomainException {
        public ParticipantSharesMismatchException() {
            super(
                    ProblemType.PARTICIPANT_SHARES_MISMATCH,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "Participant shares must sum to the transaction amount.");
        }
    }
}
