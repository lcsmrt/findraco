package com.lcs.findraco.auth.config;

import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import org.jspecify.annotations.Nullable;
import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;

/**
 * Opaque refresh tokens for the public clients of the CIMD allowlist. Spring's {@code OAuth2RefreshTokenGenerator}
 * issues none to a public client on the code grant, which would make Claude sign in again every 15 minutes. Same
 * key size as Spring's, and the lifetime of the client's token settings, renewed at each rotation.
 */
final class PublicClientRefreshTokenGenerator implements OAuth2TokenGenerator<OAuth2RefreshToken> {

    private final StringKeyGenerator keyGenerator =
            new Base64StringKeyGenerator(Base64.getUrlEncoder().withoutPadding(), 96);
    private final Clock clock;

    PublicClientRefreshTokenGenerator(Clock clock) {
        this.clock = clock;
    }

    @Override
    public @Nullable OAuth2RefreshToken generate(OAuth2TokenContext context) {
        if (!OAuth2TokenType.REFRESH_TOKEN.equals(context.getTokenType())
                || !context.getRegisteredClient()
                        .getAuthorizationGrantTypes()
                        .contains(AuthorizationGrantType.REFRESH_TOKEN)) {
            return null;
        }
        Instant issuedAt = clock.instant();
        Instant expiresAt =
                issuedAt.plus(context.getRegisteredClient().getTokenSettings().getRefreshTokenTimeToLive());
        return new OAuth2RefreshToken(keyGenerator.generateKey(), issuedAt, expiresAt);
    }
}
