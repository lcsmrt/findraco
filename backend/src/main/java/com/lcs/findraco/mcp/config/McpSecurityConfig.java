package com.lcs.findraco.mcp.config;

import com.lcs.findraco.auth.service.CimdRegisteredClientRepository;
import com.lcs.findraco.mcp.controller.McpRoutes;
import com.lcs.findraco.shared.config.OAuthProperties;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

/**
 * The MCP endpoint's own filter chain: a resource server that accepts only the access tokens the authorization server
 * issued for it (signature, issuer, audience = the {@code /mcp} URL, scope {@code findraco.mcp}), stateless. Without a
 * valid token it answers {@code 401} and points to the protected-resource metadata, which Claude follows to the
 * authorization server. The app's own tokens fail the signature, and these tokens fail the app's chain, so neither
 * opens the other's routes.
 */
@Configuration
public class McpSecurityConfig {

    @Bean
    @Order(2)
    public SecurityFilterChain mcpChain(
            HttpSecurity http, JWKSource<SecurityContext> jwkSource, OAuthProperties properties) throws Exception {
        String issuer = properties.issuer().toString();
        String resource = properties.mcpResource().toString();
        String metadataUrl = issuer + McpRoutes.PROTECTED_RESOURCE_METADATA;

        return http.securityMatcher(new OrRequestMatcher(
                        PathPatternRequestMatcher.withDefaults().matcher(McpRoutes.MCP),
                        PathPatternRequestMatcher.withDefaults().matcher(McpRoutes.MCP + "/**"),
                        PathPatternRequestMatcher.withDefaults().matcher(McpRoutes.PROTECTED_RESOURCE_METADATA),
                        PathPatternRequestMatcher.withDefaults()
                                .matcher(McpRoutes.PROTECTED_RESOURCE_METADATA + McpRoutes.MCP)))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                HttpMethod.GET,
                                McpRoutes.PROTECTED_RESOURCE_METADATA,
                                McpRoutes.PROTECTED_RESOURCE_METADATA + McpRoutes.MCP)
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .oauth2ResourceServer(server -> server.jwt(jwt -> jwt.decoder(decoder(jwkSource, issuer, resource)))
                        .authenticationEntryPoint(challenge(metadataUrl))
                        .protectedResourceMetadata(metadata -> metadata.protectedResourceMetadataCustomizer(builder -> {
                            builder.resource(resource);
                            builder.authorizationServers(servers -> {
                                servers.clear();
                                servers.add(issuer);
                            });
                            builder.scopes(scopes -> {
                                scopes.clear();
                                scopes.add(CimdRegisteredClientRepository.MCP_SCOPE);
                            });
                        })))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }

    private static NimbusJwtDecoder decoder(JWKSource<SecurityContext> jwkSource, String issuer, String resource) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSource(jwkSource).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefaultWithIssuer(issuer), audience(resource), scope()));
        return decoder;
    }

    private static OAuth2TokenValidator<Jwt> audience(String resource) {
        return jwt -> jwt.getAudience() != null && jwt.getAudience().contains(resource)
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(
                        new OAuth2Error("invalid_token", "The token is not for the MCP endpoint.", null));
    }

    private static OAuth2TokenValidator<Jwt> scope() {
        return jwt -> {
            List<String> scopes = jwt.getClaimAsStringList("scope");
            return scopes != null && scopes.contains(CimdRegisteredClientRepository.MCP_SCOPE)
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(
                            new OAuth2Error("invalid_token", "The token lacks the findraco.mcp scope.", null));
        };
    }

    /** The {@code 401} that tells an MCP client where to learn how to sign in (RFC 9728). */
    private static AuthenticationEntryPoint challenge(String metadataUrl) {
        return (request, response, exception) -> {
            response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer resource_metadata=\"" + metadataUrl + "\"");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        };
    }
}
