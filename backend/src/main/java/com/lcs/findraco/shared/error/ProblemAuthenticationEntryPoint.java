package com.lcs.findraco.shared.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Answers a protected request without a usable access token (missing, malformed, badly signed or
 * expired) with a 401 {@code unauthenticated} problem, so clients can tell "not signed in" from
 * "forbidden" and renew the session.
 */
@Component
public class ProblemAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ProblemResponseWriter writer;

    public ProblemAuthenticationEntryPoint(ProblemResponseWriter writer) {
        this.writer = writer;
    }

    @Override
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        writer.write(
                response,
                Problems.of(HttpStatus.UNAUTHORIZED, ProblemType.UNAUTHENTICATED, "Authentication required."));
    }
}
