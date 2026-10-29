package com.lcs.findraco.auth.exception;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import org.springframework.http.HttpStatus;

public class AuthenticationExceptions {

    /** The session token is missing, unknown, expired, revoked or was replayed after its grace window. */
    public static class InvalidSessionException extends DomainException {
        public InvalidSessionException() {
            super(ProblemType.SESSION_INVALID, HttpStatus.UNAUTHORIZED, "Authentication required.");
        }
    }

    public static class InvalidPasswordResetTokenException extends DomainException {
        public InvalidPasswordResetTokenException() {
            super(
                    ProblemType.RESET_TOKEN_INVALID,
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "token",
                    "This password reset link is invalid or has expired.");
        }
    }
}
