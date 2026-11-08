package com.lcs.findraco.auth.config;

import com.lcs.findraco.auth.controller.OAuthRoutes;
import com.lcs.findraco.auth.service.CimdRegisteredClientRepository;
import com.lcs.findraco.auth.service.ReplayRevokingAuthorizationService;
import com.lcs.findraco.shared.config.OAuthProperties;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.authorization.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.JdbcOAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationServerMetadataClaimNames;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationContext;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationException;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationProvider;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationValidator;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationConsentAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationGrantAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.DelegatingOAuth2TokenGenerator;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.security.oauth2.server.authorization.web.authentication.OAuth2AuthorizationConsentAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.ExceptionMappingAuthenticationFailureHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

/**
 * The OAuth 2.1 authorization server Claude connects through: authorization code with PKCE {@code S256} only, public
 * clients only (the CIMD allowlist), no dynamic registration, and tokens whose audience is the MCP endpoint. It has its
 * own filter chain and its own form-login session; the app's {@code /api} chain is untouched. The sign-in and consent
 * pages are SPA routes that post real forms here, since every answer is a redirect a {@code fetch} could not follow.
 */
@Configuration
public class AuthorizationServerConfig {

    public static final String LOGIN_PAGE = "/oauth/login";
    public static final String CONSENT_PAGE = "/oauth/consent";
    static final String METADATA = "/.well-known/oauth-authorization-server";

    static final Duration ACCESS_TOKEN_TTL = Duration.ofMinutes(15);
    static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(30);
    static final Duration AUTHORIZATION_CODE_TTL = Duration.ofSeconds(60);

    /** RFC 8707: the resource an authorization or token request asks a token for. */
    private static final String RESOURCE = "resource";

    /** The consent form's decision; {@code deny} grants nothing whatever scopes the form carries. */
    static final String CONSENT_ACTION = "consent_action";

    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerChain(
            HttpSecurity http,
            RegisteredClientRepository clients,
            OAuth2AuthorizationService authorizationService,
            OAuth2AuthorizationConsentService consentService,
            OAuth2TokenGenerator<OAuth2Token> tokenGenerator,
            AuthenticationProvider authenticationProvider,
            RateLimiter rateLimiter,
            OAuthProperties properties)
            throws Exception {
        String mcpResource = properties.mcpResource().toString();

        // Only this chain's own providers sign in here; the app's global manager stays out of the chain.
        http.getSharedObject(AuthenticationManagerBuilder.class).parentAuthenticationManager(null);

        ExceptionMappingAuthenticationFailureHandler loginFailure = new ExceptionMappingAuthenticationFailureHandler();
        loginFailure.setDefaultFailureUrl(LOGIN_PAGE + "?error");
        loginFailure.setExceptionMappings(Map.of(
                OAuthLoginAuthenticationProvider.LoginRateLimitedException.class.getName(),
                LOGIN_PAGE + "?error=rate-limited"));

        // The SPA posts the cookie's value as a plain form field, so the token is not masked per request; and it is
        // loaded on every request, so its cookie is set by the redirect that leads to the sign-in page.
        CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();
        csrfRequestHandler.setCsrfRequestAttributeName(null);

        return http.securityMatcher(new OrRequestMatcher(
                        PathPatternRequestMatcher.withDefaults().matcher(OAuthRoutes.OAUTH + "/**"),
                        PathPatternRequestMatcher.withDefaults().matcher(METADATA)))
                .oauth2AuthorizationServer(server -> server.registeredClientRepository(clients)
                        .authorizationService(authorizationService)
                        .authorizationConsentService(consentService)
                        .tokenGenerator(tokenGenerator)
                        .clientAuthentication(clientAuthentication -> clientAuthentication
                                .authenticationConverters(converters ->
                                        converters.addFirst(new PublicClientRefreshAuthenticationConverter()))
                                .authenticationProviders(providers ->
                                        providers.addFirst(new PublicClientRefreshAuthenticationProvider(clients))))
                        .authorizationServerMetadataEndpoint(metadata ->
                                metadata.authorizationServerMetadataCustomizer(builder -> builder.claims(claims -> {
                                    claims.put(
                                            OAuth2AuthorizationServerMetadataClaimNames
                                                    .TOKEN_ENDPOINT_AUTH_METHODS_SUPPORTED,
                                            List.of(ClientAuthenticationMethod.NONE.getValue()));
                                    claims.put(
                                            OAuth2AuthorizationServerMetadataClaimNames.GRANT_TYPES_SUPPORTED,
                                            List.of(
                                                    AuthorizationGrantType.AUTHORIZATION_CODE.getValue(),
                                                    AuthorizationGrantType.REFRESH_TOKEN.getValue()));
                                    claims.put(
                                            OAuth2AuthorizationServerMetadataClaimNames.SCOPES_SUPPORTED,
                                            List.of(CimdRegisteredClientRepository.MCP_SCOPE));
                                    claims.put("client_id_metadata_document_supported", true);
                                    // A public client cannot authenticate to these, so they are not
                                    // advertised.
                                    claims.remove(OAuth2AuthorizationServerMetadataClaimNames.REVOCATION_ENDPOINT);
                                    claims.remove(
                                            OAuth2AuthorizationServerMetadataClaimNames
                                                    .REVOCATION_ENDPOINT_AUTH_METHODS_SUPPORTED);
                                    claims.remove(OAuth2AuthorizationServerMetadataClaimNames.INTROSPECTION_ENDPOINT);
                                    claims.remove(
                                            OAuth2AuthorizationServerMetadataClaimNames
                                                    .INTROSPECTION_ENDPOINT_AUTH_METHODS_SUPPORTED);
                                })))
                        .authorizationEndpoint(authorization -> authorization
                                .consentPage(CONSENT_PAGE)
                                .errorResponseHandler(authorizationErrors(clients))
                                .authorizationRequestConverters(converters -> converters.replaceAll(converter ->
                                        converter instanceof OAuth2AuthorizationConsentAuthenticationConverter
                                                ? denyAware(converter)
                                                : converter))
                                .authenticationProviders(providers -> providers.forEach(provider -> {
                                    if (provider instanceof OAuth2AuthorizationCodeRequestAuthenticationProvider code) {
                                        code.setAuthenticationValidator(authorizationRequestValidator(mcpResource));
                                    }
                                }))))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, OAuthRoutes.CLIENT_INFO)
                        .permitAll()
                        .requestMatchers(http.getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                                .getEndpointsMatcher())
                        .authenticated()
                        // Nothing else lives under /oauth2: an unknown path answers 404, not a sign-in redirect.
                        .anyRequest()
                        .permitAll())
                // A browser opening the authorization endpoint unsigned goes to the sign-in page, whatever it accepts.
                .exceptionHandling(exceptions -> exceptions.defaultAuthenticationEntryPointFor(
                        new LoginUrlAuthenticationEntryPoint(LOGIN_PAGE),
                        PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.GET, OAuthRoutes.AUTHORIZE)))
                .authenticationProvider(new OAuthLoginAuthenticationProvider(authenticationProvider, rateLimiter))
                .formLogin(form -> form.loginPage(LOGIN_PAGE)
                        .loginProcessingUrl(OAuthRoutes.LOGIN)
                        .usernameParameter("email")
                        .passwordParameter("password")
                        .failureHandler(loginFailure))
                // SPEC_DEVIATION: design.md scopes the CSRF cookie to /oauth2; it is on the root path.
                // Reason: the sign-in page at /oauth/login must read it, and a cookie scoped to /oauth2 is
                // invisible there.
                .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(csrfRequestHandler)
                        .requireCsrfProtectionMatcher(
                                PathPatternRequestMatcher.withDefaults().matcher(HttpMethod.POST, OAuthRoutes.LOGIN)))
                .build();
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings(OAuthProperties properties) {
        return AuthorizationServerSettings.builder()
                .issuer(properties.issuer().toString())
                .build();
    }

    @Bean
    public TokenSettings tokenSettings() {
        return TokenSettings.builder()
                .accessTokenTimeToLive(ACCESS_TOKEN_TTL)
                .refreshTokenTimeToLive(REFRESH_TOKEN_TTL)
                .reuseRefreshTokens(false)
                .authorizationCodeTimeToLive(AUTHORIZATION_CODE_TTL)
                .build();
    }

    @Bean
    public CimdRegisteredClientRepository registeredClientRepository(
            OAuthProperties properties, TokenSettings tokenSettings, Clock clock) {
        return new CimdRegisteredClientRepository(
                properties.cimd(), tokenSettings, clock, CimdRegisteredClientRepository.pinnedDocuments());
    }

    @Bean
    public OAuth2AuthorizationService authorizationService(JdbcOperations jdbc, RegisteredClientRepository clients) {
        return new ReplayRevokingAuthorizationService(new JdbcOAuth2AuthorizationService(jdbc, clients), jdbc);
    }

    @Bean
    public OAuth2AuthorizationConsentService authorizationConsentService(
            JdbcOperations jdbc, RegisteredClientRepository clients) {
        return new JdbcOAuth2AuthorizationConsentService(jdbc, clients);
    }

    @Bean
    public OAuth2TokenGenerator<OAuth2Token> tokenGenerator(
            JWKSource<SecurityContext> jwkSource, OAuthProperties properties, Clock clock) {
        JwtGenerator accessTokens = new JwtGenerator(new NimbusJwtEncoder(jwkSource));
        accessTokens.setJwtCustomizer(audience(properties.mcpResource().toString()));
        return new DelegatingOAuth2TokenGenerator(accessTokens, new PublicClientRefreshTokenGenerator(clock));
    }

    /** Every access token is for the MCP endpoint; a request naming another resource gets none (RFC 8707). */
    private static OAuth2TokenCustomizer<JwtEncodingContext> audience(String mcpResource) {
        return context -> {
            if (!OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                return;
            }
            Authentication grant = context.getAuthorizationGrant();
            Object resource = grant instanceof OAuth2AuthorizationGrantAuthenticationToken request
                    ? request.getAdditionalParameters().get(RESOURCE)
                    : null;
            if (resource != null && !mcpResource.equals(resource)) {
                throw new OAuth2AuthenticationException(new OAuth2Error("invalid_target"));
            }
            // A singleton list, as Spring's own audience: the claims are stored with the grant, and Spring's JSON
            // allowlist reads back that list type but not List.of's.
            context.getClaims().audience(Collections.singletonList(mcpResource));
        };
    }

    /**
     * Spring's redirect and scope checks, a loopback redirect on {@code localhost} matched on any port as on
     * 127.0.0.1 (RFC 8252; Claude Code registers both), and the RFC 8707 resource, which must be the MCP endpoint.
     */
    private static Consumer<OAuth2AuthorizationCodeRequestAuthenticationContext> authorizationRequestValidator(
            String mcpResource) {
        Consumer<OAuth2AuthorizationCodeRequestAuthenticationContext> redirectUri = context -> {
            OAuth2AuthorizationCodeRequestAuthenticationToken request = context.getAuthentication();
            UriComponents requested = request.getRedirectUri() == null
                    ? null
                    : UriComponentsBuilder.fromUriString(request.getRedirectUri())
                            .build();
            if (requested == null || !"localhost".equals(requested.getHost())) {
                OAuth2AuthorizationCodeRequestAuthenticationValidator.DEFAULT_REDIRECT_URI_VALIDATOR.accept(context);
                return;
            }
            boolean registered = context.getRegisteredClient().getRedirectUris().stream()
                    .map(uri -> UriComponentsBuilder.fromUriString(uri)
                            .port(requested.getPort())
                            .build()
                            .toUriString())
                    .anyMatch(requested.toUriString()::equals);
            if (!registered) {
                throw withoutRedirect(OAuth2ErrorCodes.INVALID_REQUEST, request);
            }
        };
        Consumer<OAuth2AuthorizationCodeRequestAuthenticationContext> resource = context -> {
            OAuth2AuthorizationCodeRequestAuthenticationToken request = context.getAuthentication();
            Object requested = request.getAdditionalParameters().get(RESOURCE);
            if (requested != null && !mcpResource.equals(requested)) {
                throw new OAuth2AuthorizationCodeRequestAuthenticationException(
                        new OAuth2Error("invalid_target", "The resource must be " + mcpResource, null), request);
            }
        };
        return redirectUri
                .andThen(OAuth2AuthorizationCodeRequestAuthenticationValidator.DEFAULT_SCOPE_VALIDATOR)
                .andThen(resource);
    }

    /** An error answered with a 400 page, never a redirect: the redirect URI itself was not accepted. */
    private static OAuth2AuthorizationCodeRequestAuthenticationException withoutRedirect(
            String errorCode, OAuth2AuthorizationCodeRequestAuthenticationToken request) {
        OAuth2AuthorizationCodeRequestAuthenticationToken withoutRedirectUri =
                new OAuth2AuthorizationCodeRequestAuthenticationToken(
                        request.getAuthorizationUri(),
                        request.getClientId(),
                        (Authentication) request.getPrincipal(),
                        null,
                        request.getState(),
                        request.getScopes(),
                        request.getAdditionalParameters());
        return new OAuth2AuthorizationCodeRequestAuthenticationException(
                new OAuth2Error(errorCode, "The redirect URI is not registered for this client.", null),
                withoutRedirectUri);
    }

    /** The consent form posts its scope with either button; "deny" turns it into a consent to nothing. */
    private static AuthenticationConverter denyAware(AuthenticationConverter consent) {
        return request -> {
            Authentication converted = consent.convert(request);
            if (!"deny".equals(request.getParameter(CONSENT_ACTION))
                    || !(converted instanceof OAuth2AuthorizationConsentAuthenticationToken decision)) {
                return converted;
            }
            return new OAuth2AuthorizationConsentAuthenticationToken(
                    decision.getAuthorizationUri(),
                    decision.getClientId(),
                    (Authentication) decision.getPrincipal(),
                    decision.getState(),
                    Set.of(),
                    decision.getAdditionalParameters());
        };
    }

    /**
     * Spring's answers to a bad authorization request, except that a client outside the allowlist is {@code
     * invalid_client} (Spring says {@code invalid_request}): a 400 page when no redirect URI was accepted, otherwise a
     * redirect to the client carrying the error and its state.
     */
    private static AuthenticationFailureHandler authorizationErrors(RegisteredClientRepository clients) {
        return (request, response, exception) -> {
            OAuth2AuthorizationCodeRequestAuthenticationException failure =
                    (OAuth2AuthorizationCodeRequestAuthenticationException) exception;
            OAuth2AuthorizationCodeRequestAuthenticationToken authorization =
                    failure.getAuthorizationCodeRequestAuthentication();
            if (authorization == null || clients.findByClientId(authorization.getClientId()) == null) {
                response.sendError(
                        HttpStatus.BAD_REQUEST.value(),
                        new OAuth2Error(OAuth2ErrorCodes.INVALID_CLIENT, "Unknown client.", null).toString());
                return;
            }
            OAuth2Error error = failure.getError();
            if (!StringUtils.hasText(authorization.getRedirectUri())) {
                response.sendError(HttpStatus.BAD_REQUEST.value(), error.toString());
                return;
            }
            UriComponentsBuilder redirect = UriComponentsBuilder.fromUriString(authorization.getRedirectUri())
                    .queryParam(OAuth2ParameterNames.ERROR, error.getErrorCode());
            if (StringUtils.hasText(error.getDescription())) {
                redirect.queryParam(
                        OAuth2ParameterNames.ERROR_DESCRIPTION,
                        UriUtils.encode(error.getDescription(), StandardCharsets.UTF_8));
            }
            if (StringUtils.hasText(authorization.getState())) {
                redirect.queryParam(
                        OAuth2ParameterNames.STATE, UriUtils.encode(authorization.getState(), StandardCharsets.UTF_8));
            }
            response.sendRedirect(redirect.build(true).toUriString());
        };
    }
}
