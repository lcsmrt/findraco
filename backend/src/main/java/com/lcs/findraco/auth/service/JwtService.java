package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtService {

    private final SecretKey secretKey;
    private final Duration expiration;
    private final Clock clock;

    public JwtService(JwtProperties properties, Clock clock) {
        this.clock = clock;
        byte[] keyBytes = Base64.getEncoder().encode(properties.secretKey().getBytes(StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = properties.expiration();
    }

    public String generateToken(String email) {
        Instant now = clock.instant();
        Instant expiresAt = now.plus(expiration);

        return Jwts.builder()
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(secretKey)
                .compact();
    }

    public String getEmailFromToken(String token) {
        try {
            return extractClaims(token).getSubject();
        } catch (Exception exception) {
            return null;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getEmailFromToken(token);
        return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        try {
            Instant expiration = extractClaims(token).getExpiration().toInstant();
            return expiration.isBefore(clock.instant());
        } catch (Exception exception) {
            return true;
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
