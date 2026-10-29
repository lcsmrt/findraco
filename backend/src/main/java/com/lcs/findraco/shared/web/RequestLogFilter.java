package com.lcs.findraco.shared.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerMapping;

/**
 * Writes one line per request: method, route template, status, duration, user id and plan id. The route
 * is the matched pattern, never the raw path, which can carry tokens; a request no handler matched logs
 * {@code -}. Bodies, headers and query strings are never logged. A 5xx line is an ERROR, anything else
 * INFO, and neither carries a stack trace.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RequestLogFilter extends OncePerRequestFilter {

    /** Set by the authentication filter once it knows the caller; the security context is gone by the end. */
    public static final String USER_ID_ATTRIBUTE = RequestLogFilter.class.getName() + ".userId";

    private static final Logger log = LoggerFactory.getLogger(RequestLogFilter.class);
    private static final String NONE = "-";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        long start = System.nanoTime();
        boolean failed = true;
        try {
            chain.doFilter(request, response);
            failed = false;
        } finally {
            int status = failed ? HttpStatus.INTERNAL_SERVER_ERROR.value() : response.getStatus();
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
            Object[] line = {request.getMethod(), route(request), status, durationMs, userId(request), planId(request)};
            if (status >= HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                log.error("{} {} {} {}ms userId={} planId={}", line);
            } else {
                log.info("{} {} {} {}ms userId={} planId={}", line);
            }
        }
    }

    private static Object route(HttpServletRequest request) {
        Object pattern = request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        return pattern != null ? pattern : NONE;
    }

    private static Object userId(HttpServletRequest request) {
        Object userId = request.getAttribute(USER_ID_ATTRIBUTE);
        return userId != null ? userId : NONE;
    }

    private static Object planId(HttpServletRequest request) {
        if (request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE) instanceof Map<?, ?> variables
                && variables.get("planId") instanceof String planId) {
            return planId;
        }
        return NONE;
    }
}
