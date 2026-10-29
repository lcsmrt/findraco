package com.lcs.findraco.shared.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Gives every request an id: the caller's {@code X-Request-Id} when it is a plain token, otherwise a new
 * UUID. The id goes into the MDC, so every log line of the request carries it, and back in the response
 * header, so a user's report can be matched to the log. Runs before every other filter.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {

    public static final String HEADER = "X-Request-Id";
    public static final String MDC_KEY = "requestId";

    /** Keeps the id for the error dispatch, which runs after the first pass cleared the MDC. */
    private static final String ATTRIBUTE = RequestIdFilter.class.getName() + ".requestId";

    /** Anything else (spaces, line breaks, markup) could forge or break a log line. */
    private static final Pattern ACCEPTED = Pattern.compile("[A-Za-z0-9-]{1,64}");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestId = request.getAttribute(ATTRIBUTE) instanceof String known ? known : newRequestId(request);

        MDC.put(MDC_KEY, requestId);
        request.setAttribute(ATTRIBUTE, requestId);
        response.setHeader(HEADER, requestId);
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove(MDC_KEY);
        }
    }

    /** The error page answers a problem carrying the same id as the request that failed. */
    @Override
    protected boolean shouldNotFilterErrorDispatch() {
        return false;
    }

    @Override
    protected void doFilterNestedErrorDispatch(
            HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        doFilterInternal(request, response, chain);
    }

    private static String newRequestId(HttpServletRequest request) {
        String incoming = request.getHeader(HEADER);
        return incoming != null && ACCEPTED.matcher(incoming).matches()
                ? incoming
                : UUID.randomUUID().toString();
    }
}
