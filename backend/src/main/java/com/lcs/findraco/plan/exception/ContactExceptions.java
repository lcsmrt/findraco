package com.lcs.findraco.plan.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

/**
 * A rule the request breaks on its own (a taken name, an archived contact in a split) answers 422; one that holds
 * only because of what is stored (a balance, a share that refers to the contact) answers 409.
 */
public class ContactExceptions {

    public static class ContactNotFoundException extends DomainException {
        public ContactNotFoundException(Long id) {
            super(ProblemType.CONTACT_NOT_FOUND, HttpStatus.NOT_FOUND, "Contact " + id + " not found.");
        }
    }

    public static class ContactNameTakenException extends DomainException {
        public ContactNameTakenException() {
            super(
                    ProblemType.CONTACT_NAME_TAKEN,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "name",
                    "Another active contact of the plan has this name.");
        }
    }

    public static class ContactBalanceNotZeroException extends DomainException {
        public ContactBalanceNotZeroException() {
            super(
                    ProblemType.CONTACT_BALANCE_NOT_ZERO,
                    HttpStatus.CONFLICT,
                    "A contact that owes money or holds credit cannot be archived. Settle the balance first.");
        }
    }

    public static class ContactInUseException extends DomainException {
        public ContactInUseException() {
            super(
                    ProblemType.CONTACT_IN_USE,
                    HttpStatus.CONFLICT,
                    "A contact with a share or a payment cannot be deleted. Archive it instead.");
        }
    }

    public static class ContactArchivedException extends DomainException {
        public ContactArchivedException() {
            super(
                    ProblemType.CONTACT_ARCHIVED,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "participants",
                    "An archived contact cannot take a new share.");
        }
    }
}
