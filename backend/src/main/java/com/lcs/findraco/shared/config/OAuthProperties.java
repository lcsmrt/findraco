package com.lcs.findraco.shared.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.nio.file.Path;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * The authorization server that issues Claude's tokens. {@code issuer} is the origin the server's metadata names,
 * {@code mcpResource} the canonical URL of the MCP endpoint (the {@code aud} of every access token), and
 * {@code signingKey} the path of the PKCS#8 PEM holding the RSA key that signs them: a key generated at startup
 * would invalidate every live token on each deploy, so the application refuses to start without one. {@code
 * grantPurgeCron} is when the daily job deletes expired grants (a Spring cron expression, or {@code -} for never).
 */
// SPEC_DEVIATION: design.md sets app.oauth.issuer to https://<domain>/oauth2; the issuer is the bare origin.
// Reason: Spring's authorization server builds every endpoint URL as issuer + path (/oauth2/authorize), and with a
// single issuer serves its metadata only at /.well-known/oauth-authorization-server, which RFC 8414 pairs with an
// issuer without a path.
@Validated
@ConfigurationProperties("app.oauth")
public record OAuthProperties(
        @NotNull URI issuer,
        @NotNull URI mcpResource,
        @NotNull Path signingKey,
        @NotNull @Valid CimdProperties cimd,
        @NotBlank String grantPurgeCron) {}
