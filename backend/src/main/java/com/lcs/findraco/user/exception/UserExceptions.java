package com.lcs.findraco.user.exception;

public class UserExceptions {

    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String email) {
            super("Email " + email + " is already in use.");
        }
    }

    public static class InvalidPasswordResetTokenException extends RuntimeException {
        public InvalidPasswordResetTokenException() {
            super("This password reset link is invalid or has expired.");
        }
    }
}
