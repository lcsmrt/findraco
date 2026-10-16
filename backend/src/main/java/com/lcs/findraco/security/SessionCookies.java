package com.lcs.findraco.security;

import com.lcs.findraco.utils.ApiRoutes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Builds the session cookie. It is {@code HttpOnly} (no page script can read it), {@code SameSite=Strict}
 * and scoped to the auth endpoints, so it never rides along with a data request.
 */
@Component
public class SessionCookies {

    public static final String NAME = "findraco_session";

    private final Duration ttl;
    private final boolean secure;

    public SessionCookies(
            @Value("${app.session.ttl}") Duration ttl,
            @Value("${app.session.cookie-secure}") boolean secure
    ) {
        this.ttl = ttl;
        this.secure = secure;
    }

    public ResponseCookie issue(String sessionToken) {
        return build(sessionToken, ttl);
    }

    public ResponseCookie clear() {
        return build("", Duration.ZERO);
    }

    private ResponseCookie build(String value, Duration maxAge) {
        return ResponseCookie.from(NAME, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path(ApiRoutes.AUTH)
                .maxAge(maxAge)
                .build();
    }
}
