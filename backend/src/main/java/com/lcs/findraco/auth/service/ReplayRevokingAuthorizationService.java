package com.lcs.findraco.auth.service;

import java.util.List;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;

/**
 * Spring's grant store, plus refresh-token replay detection: a refresh token a rotation replaced is remembered by its
 * hash, and presenting it again revokes the whole grant, since either the client or a thief holds a token that should
 * no longer exist. Spring alone answers such a token with {@code invalid_grant} and leaves the grant alive.
 */
public class ReplayRevokingAuthorizationService implements OAuth2AuthorizationService {

    private static final Logger log = LoggerFactory.getLogger(ReplayRevokingAuthorizationService.class);

    private final OAuth2AuthorizationService delegate;
    private final JdbcOperations jdbc;

    public ReplayRevokingAuthorizationService(OAuth2AuthorizationService delegate, JdbcOperations jdbc) {
        this.delegate = delegate;
        this.jdbc = jdbc;
    }

    @Override
    public void save(OAuth2Authorization authorization) {
        OAuth2Authorization stored = delegate.findById(authorization.getId());
        String replaced = refreshTokenValue(stored);
        if (replaced != null && !replaced.equals(refreshTokenValue(authorization))) {
            jdbc.update(
                    "INSERT INTO oauth2_rotated_refresh_tokens (token_hash, authorization_id) VALUES (?, ?) "
                            + "ON CONFLICT (token_hash) DO NOTHING",
                    OpaqueTokens.hash(replaced),
                    authorization.getId());
        }
        delegate.save(authorization);
    }

    @Override
    public void remove(OAuth2Authorization authorization) {
        delegate.remove(authorization);
    }

    @Override
    public @Nullable OAuth2Authorization findById(String id) {
        return delegate.findById(id);
    }

    @Override
    public @Nullable OAuth2Authorization findByToken(String token, @Nullable OAuth2TokenType tokenType) {
        OAuth2Authorization authorization = delegate.findByToken(token, tokenType);
        if (authorization != null || (tokenType != null && !OAuth2TokenType.REFRESH_TOKEN.equals(tokenType))) {
            return authorization;
        }
        List<String> replayed = jdbc.queryForList(
                "SELECT authorization_id FROM oauth2_rotated_refresh_tokens WHERE token_hash = ?",
                String.class,
                OpaqueTokens.hash(token));
        for (String authorizationId : replayed) {
            OAuth2Authorization grant = delegate.findById(authorizationId);
            if (grant != null) {
                delegate.remove(grant);
                log.warn(
                        "Refresh token replay detected; revoked grant {} of user {}",
                        authorizationId,
                        grant.getPrincipalName());
            }
        }
        return null;
    }

    private static @Nullable String refreshTokenValue(@Nullable OAuth2Authorization authorization) {
        if (authorization == null) {
            return null;
        }
        OAuth2Authorization.Token<OAuth2RefreshToken> refreshToken = authorization.getRefreshToken();
        return refreshToken == null ? null : refreshToken.getToken().getTokenValue();
    }
}
