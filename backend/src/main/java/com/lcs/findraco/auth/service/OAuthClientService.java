package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.auth.response.OAuthClientInfoResponse;
import java.net.URI;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.stereotype.Service;

@Service
public class OAuthClientService {

    private final RegisteredClientRepository clients;

    public OAuthClientService(RegisteredClientRepository clients) {
        this.clients = clients;
    }

    /** The consent page's view of an allowlisted client; any other id is not found. */
    public OAuthClientInfoResponse clientInfo(String clientId) {
        RegisteredClient client = clients.findByClientId(clientId);
        if (client == null) {
            throw new AuthenticationExceptions.OAuthClientNotFoundException();
        }
        String redirectHost = client.getRedirectUris().stream()
                .map(uri -> URI.create(uri).getHost())
                .sorted()
                .findFirst()
                .orElseThrow();
        return new OAuthClientInfoResponse(client.getClientName(), redirectHost);
    }
}
