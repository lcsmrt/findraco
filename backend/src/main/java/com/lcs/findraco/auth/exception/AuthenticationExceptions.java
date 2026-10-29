package com.lcs.findraco.auth.exception;

public class AuthenticationExceptions {

    /** The session token is missing, unknown, expired, revoked or was replayed after its grace window. */
    public static class InvalidSessionException extends RuntimeException {
        public InvalidSessionException() {
            super("Authentication required.");
        }
    }

    public static class InvalidPasswordResetTokenException extends RuntimeException {
        public InvalidPasswordResetTokenException() {
            super("This password reset link is invalid or has expired.");
        }
    }
}
