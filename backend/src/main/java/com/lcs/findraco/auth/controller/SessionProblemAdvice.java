package com.lcs.findraco.auth.controller;

import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.shared.error.Problems;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * A session that can't be renewed answers like any unauthenticated request and also drops the dead
 * cookie, so the browser stops sending it.
 */
@RestControllerAdvice(assignableTypes = AuthenticationController.class)
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SessionProblemAdvice {

    private final SessionCookies sessionCookies;

    public SessionProblemAdvice(SessionCookies sessionCookies) {
        this.sessionCookies = sessionCookies;
    }

    @ExceptionHandler(AuthenticationExceptions.InvalidSessionException.class)
    public ResponseEntity<ProblemDetail> handleInvalidSession(
            AuthenticationExceptions.InvalidSessionException exception) {
        return ResponseEntity.status(exception.status())
                .header(HttpHeaders.SET_COOKIE, sessionCookies.clear().toString())
                .body(Problems.of(exception));
    }
}
