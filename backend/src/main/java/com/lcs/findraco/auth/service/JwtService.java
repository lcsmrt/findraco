package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private final SecretKey secretKey;
    private final Duration expiration;
    private final Clock clock;

    public JwtService(JwtProperties properties, Clock clock) {
        this.clock = clock;
        this.secretKey = Keys.hmacShaKeyFor(properties.secretKeyBytes());
        this.expiration = properties.expiration();
    }

    /** An access token for the user; the subject is the id, which never changes (the e-mail can). */
    public String generateToken(long userId) {
        Instant now = clock.instant();
        Instant expiresAt = now.plus(expiration);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(secretKey)
                .compact();
    }

    /** The user id in a valid, unexpired token, or null for anything else (bad signature, expired, not an id). */
    public @Nullable Long getUserIdFromToken(String token) {
        try {
            Claims claims = extractClaims(token);
            if (claims.getExpiration().toInstant().isBefore(clock.instant())) {
                return null;
            }
            return Long.valueOf(claims.getSubject());
        } catch (RuntimeException exception) {
            return null;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
