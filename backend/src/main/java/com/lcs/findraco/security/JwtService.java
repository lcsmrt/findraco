package com.lcs.findraco.security;

import com.lcs.findraco.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
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

    public JwtService(JwtProperties properties) {
        byte[] keyBytes = Base64.getEncoder().encode(properties.secretKey().getBytes(StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expiration = properties.expiration();
    }

    public String generateToken(String email) {
        Instant now = Instant.now();
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
            return expiration.isBefore(Instant.now());
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
