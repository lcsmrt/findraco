package com.lcs.findraco.user.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

public class UserExceptions {

    /** Reveals that the address is registered: accepted until sign-up confirms the e-mail first. */
    public static class EmailAlreadyExistsException extends DomainException {
        public EmailAlreadyExistsException() {
            super(ProblemType.EMAIL_TAKEN, HttpStatus.CONFLICT, "email", "The e-mail is already in use.");
        }
    }
}
