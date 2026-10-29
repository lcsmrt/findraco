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

    public static class DuplicateParticipantException extends DomainException {
        public DuplicateParticipantException() {
            super(
                    ProblemType.PARTICIPANT_DUPLICATE,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "Duplicate participant in transaction.");
        }
    }

    public static class ParticipantNotMemberException extends DomainException {
        public ParticipantNotMemberException() {
            super(
                    ProblemType.PARTICIPANT_NOT_MEMBER,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "Participant is not a member of the plan.");
        }
    }

    public static class ParticipantsRequiredException extends DomainException {
        public ParticipantsRequiredException() {
            super(
                    ProblemType.PARTICIPANTS_REQUIRED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "A transaction needs at least one participant.");
        }
    }

    public static class ExactShareInvalidException extends DomainException {
        public ExactShareInvalidException() {
            super(
                    ProblemType.EXACT_SHARE_INVALID,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "Every participant of an EXACT split needs a share of zero or more.");
        }
    }

    public static class SplitModeNotSupportedException extends DomainException {
        public SplitModeNotSupportedException(String mode) {
            super(
                    ProblemType.SPLIT_MODE_NOT_SUPPORTED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "splitMode",
                    "Split mode " + mode + " is not supported.");
        }
    }

    public static class InvalidItemException extends DomainException {
        public InvalidItemException(String detail) {
            super(ProblemType.ITEM_INVALID, HttpStatus.UNPROCESSABLE_CONTENT, "items", detail);
        }
    }

    public static class PeriodStartAfterEndException extends DomainException {
        public PeriodStartAfterEndException() {
            super(
                    ProblemType.PERIOD_START_AFTER_END,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "endDate",
                    "Start date cannot be after end date.");
        }
    }

    public static class SeriesParcelsRequiredException extends DomainException {
        public SeriesParcelsRequiredException() {
            super(
                    ProblemType.SERIES_PARCELS_REQUIRED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "parcelsNumber",
                    "Parcels number is required for installment series.");
        }
    }

    public static class SeriesCurrentParcelOutOfRangeException extends DomainException {
        public SeriesCurrentParcelOutOfRangeException() {
            super(
                    ProblemType.SERIES_CURRENT_PARCEL_OUT_OF_RANGE,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "currentParcel",
                    "Current parcel must be between 1 and the total number of parcels.");
        }
    }

    public static class SeriesIntervalRequiredException extends DomainException {
        public SeriesIntervalRequiredException() {
            super(
                    ProblemType.SERIES_INTERVAL_REQUIRED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "interval",
                    "Interval is required for recurring series.");
        }
    }

    public static class SeriesPivotNotFoundException extends DomainException {
        public SeriesPivotNotFoundException() {
            super(
                    ProblemType.SERIES_PIVOT_NOT_FOUND,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "pivotOccurrenceId",
                    "Pivot occurrence not found in this series.");
        }
    }

    public static class SeriesParcelsChangeNeedsAllException extends DomainException {
        public SeriesParcelsChangeNeedsAllException() {
            super(
                    ProblemType.SERIES_PARCELS_CHANGE_NEEDS_ALL,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "parcelsNumber",
                    "Changing the number of parcels is only allowed when editing the whole series.");
        }
    }

    public static class SeriesTooManyOccurrencesException extends DomainException {
        public SeriesTooManyOccurrencesException(int max) {
            super(
                    ProblemType.SERIES_TOO_MANY_OCCURRENCES,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "Series would generate too many occurrences (max " + max + ").");
        }
    }

    public static class ImportLineInvalidException extends DomainException {
        public ImportLineInvalidException(int line) {
            super(
                    ProblemType.IMPORT_LINE_INVALID,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "Line " + line + " of the CSV is invalid.");
        }
    }
}
