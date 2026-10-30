package com.lcs.findraco.transaction.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import com.lcs.findraco.transaction.importer.ImportError;
import java.util.List;
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

    /** The file has invalid lines; {@code errors} lists them, capped, and nothing was imported. */
    public static class ImportRowsInvalidException extends DomainException {
        public ImportRowsInvalidException(List<ImportError> errors, boolean capped) {
            super(
                    ProblemType.IMPORT_LINE_INVALID,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    capped
                            ? "The file has invalid lines; the first " + errors.size() + " are listed."
                            : "The file has invalid lines.",
                    errors);
        }
    }

    public static class CsvUnknownFormatException extends DomainException {
        public CsvUnknownFormatException() {
            super(
                    ProblemType.CSV_UNKNOWN_FORMAT,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "The file's header matches no supported bank format.");
        }
    }

    public static class CsvFormatNotSupportedException extends DomainException {
        public CsvFormatNotSupportedException() {
            super(
                    ProblemType.CSV_FORMAT_NOT_SUPPORTED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "This bank format is recognised but cannot be imported yet.");
        }
    }

    public static class ImportEncodingInvalidException extends DomainException {
        public ImportEncodingInvalidException(int line) {
            super(
                    ProblemType.CSV_ENCODING_INVALID,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "The file is not valid UTF-8; the first bad byte is on line " + line + ".");
        }
    }

    public static class ImportTooManyRowsException extends DomainException {
        public ImportTooManyRowsException(int max) {
            super(
                    ProblemType.CSV_TOO_MANY_ROWS,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "The file has more than " + max + " rows.");
        }
    }

    public static class ImportFileTooLargeException extends DomainException {
        public ImportFileTooLargeException(long maxBytes) {
            super(
                    ProblemType.CSV_TOO_LARGE,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "file",
                    "The file is larger than " + maxBytes + " bytes.");
        }
    }
}
