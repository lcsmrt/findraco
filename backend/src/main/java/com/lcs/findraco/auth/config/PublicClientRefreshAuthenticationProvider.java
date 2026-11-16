package com.lcs.findraco.auth.config;

import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;

/**
 * Authenticates a public client on a refresh: the client id must resolve to an allowlisted client that uses
 * {@code none}. The refresh token itself is the proof, checked by Spring's refresh provider against the client's
 * grant. Any other client authentication passes on to Spring's providers.
 */
final class PublicClientRefreshAuthenticationProvider implements AuthenticationProvider {

    private final RegisteredClientRepository clients;

    PublicClientRefreshAuthenticationProvider(RegisteredClientRepository clients) {
        this.clients = clients;
    }

    @Override
    public @Nullable Authentication authenticate(Authentication authentication) {
        OAuth2ClientAuthenticationToken client = (OAuth2ClientAuthenticationToken) authentication;
        if (!ClientAuthenticationMethod.NONE.equals(client.getClientAuthenticationMethod())
                || !AuthorizationGrantType.REFRESH_TOKEN
                        .getValue()
                        .equals(client.getAdditionalParameters().get(OAuth2ParameterNames.GRANT_TYPE))) {
            return null;
        }
        RegisteredClient registeredClient = clients.findByClientId(String.valueOf(client.getPrincipal()));
        if (registeredClient == null
                || !registeredClient.getClientAuthenticationMethods().contains(ClientAuthenticationMethod.NONE)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error(OAuth2ErrorCodes.INVALID_CLIENT, "Unknown client.", null));
        }
        return new OAuth2ClientAuthenticationToken(registeredClient, ClientAuthenticationMethod.NONE, null);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OAuth2ClientAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
