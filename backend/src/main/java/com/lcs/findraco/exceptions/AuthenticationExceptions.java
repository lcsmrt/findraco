package com.lcs.findraco.exceptions;

public class AuthenticationExceptions {

    /** The session token is missing, unknown, expired, revoked or was replayed after its grace window. */
    public static class InvalidSessionException extends RuntimeException {
        public InvalidSessionException() {
            super("Authentication required.");
        }
    }
}
