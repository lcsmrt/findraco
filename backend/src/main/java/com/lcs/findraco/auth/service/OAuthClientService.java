package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.auth.response.OAuthClientInfoResponse;
import java.net.URI;
import org.jspecify.annotations.Nullable;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.stereotype.Service;

@Service
public class OAuthClientService {

    private static final OAuth2TokenType STATE = new OAuth2TokenType(OAuth2ParameterNames.STATE);

    private final RegisteredClientRepository clients;
    private final OAuth2AuthorizationService authorizations;

    public OAuthClientService(RegisteredClientRepository clients, OAuth2AuthorizationService authorizations) {
        this.clients = clients;
        this.authorizations = authorizations;
    }

    /**
     * The consent page's view of an allowlisted client; any other id is not found. The host shown is the one of the
     * redirect URI the pending authorization asked for (found by the consent {@code state}); without a pending
     * authorization of this client it is the first of the client's registered hosts.
     */
    public OAuthClientInfoResponse clientInfo(String clientId, @Nullable String state) {
        RegisteredClient client = clients.findByClientId(clientId);
        if (client == null) {
            throw new AuthenticationExceptions.OAuthClientNotFoundException();
        }
        String redirectHost = requestedHost(client, state);
        if (redirectHost == null) {
            redirectHost = firstHost(client);
        }
        return new OAuthClientInfoResponse(client.getClientName(), redirectHost);
    }

    private @Nullable String requestedHost(RegisteredClient client, @Nullable String state) {
        OAuth2Authorization pending = state == null ? null : authorizations.findByToken(state, STATE);
        if (pending == null || !pending.getRegisteredClientId().equals(client.getId())) {
            return null;
        }
        OAuth2AuthorizationRequest request = pending.getAttribute(OAuth2AuthorizationRequest.class.getName());
        return request == null || request.getRedirectUri() == null
                ? null
                : URI.create(request.getRedirectUri()).getHost();
    }

    private static String firstHost(RegisteredClient client) {
        return client.getRedirectUris().stream()
                .map(uri -> URI.create(uri).getHost())
                .sorted()
                .findFirst()
                .orElseThrow();
    }
}
