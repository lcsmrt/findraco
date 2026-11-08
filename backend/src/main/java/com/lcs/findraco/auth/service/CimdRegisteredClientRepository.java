package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.config.CimdProperties;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.web.client.RestClient;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * The OAuth clients, read from their Client ID Metadata Documents: a {@code client_id} is the URL of its document.
 * Only the exact allowlisted URLs are ever fetched (no redirects, a size and a time cap), so the server cannot be
 * pointed at an address of a caller's choosing. A fetched document is kept for the cache TTL; when a fetch fails the
 * last good copy is kept, and with none the copy pinned in {@code resources/oauth/cimd/} serves, since claude.ai's edge
 * has refused server-side fetches from cloud addresses. A document that is fetched but invalid is refused.
 *
 * <p>Every client is public ({@code none}), may use the authorization code with PKCE and refresh tokens only, and is
 * asked for consent; extra grant types a document lists are ignored. The registered id is the client id, so a stored
 * grant still resolves its client on refresh.
 */
public class CimdRegisteredClientRepository implements RegisteredClientRepository {

    /** The one scope a client gets: every MCP tool. */
    public static final String MCP_SCOPE = "findraco.mcp";

    static final Duration FETCH_TIMEOUT = Duration.ofSeconds(5);
    static final int MAX_DOCUMENT_BYTES = 64 * 1024;

    private static final Logger log = LoggerFactory.getLogger(CimdRegisteredClientRepository.class);
    private static final String PINNED_LOCATION = "classpath*:oauth/cimd/*.json";
    private static final Set<String> LOOPBACK_HOSTS = Set.of("localhost", "127.0.0.1", "[::1]");

    private final Set<String> allowedClients;
    private final Duration cacheTtl;
    private final TokenSettings tokenSettings;
    private final Clock clock;
    private final Map<String, String> pinnedDocuments;
    private final RestClient restClient;
    private final JsonMapper jsonMapper = JsonMapper.builder().build();
    private final Map<String, Cached> cache = new ConcurrentHashMap<>();

    private record Cached(RegisteredClient client, Instant fetchedAt) {}

    /**
     * @param pinnedDocuments the shipped copies, by client id ({@link #pinnedDocuments()} in production)
     */
    public CimdRegisteredClientRepository(
            CimdProperties properties, TokenSettings tokenSettings, Clock clock, Map<String, String> pinnedDocuments) {
        this.allowedClients = Set.copyOf(
                properties.allowedClients().stream().map(URI::toString).toList());
        this.cacheTtl = properties.cacheTtl();
        this.tokenSettings = tokenSettings;
        this.clock = clock;
        this.pinnedDocuments = Map.copyOf(pinnedDocuments);
        HttpClient httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NEVER)
                .connectTimeout(FETCH_TIMEOUT)
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(FETCH_TIMEOUT);
        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    /** The documents shipped in {@code resources/oauth/cimd/}, by the client id each one names. */
    public static Map<String, String> pinnedDocuments() {
        JsonMapper mapper = JsonMapper.builder().build();
        Map<String, String> documents = new HashMap<>();
        try {
            for (Resource resource : new PathMatchingResourcePatternResolver().getResources(PINNED_LOCATION)) {
                String document = resource.getContentAsString(StandardCharsets.UTF_8);
                documents.put(mapper.readTree(document).path("client_id").asString(), document);
            }
        } catch (IOException exception) {
            throw new UncheckedIOException("The pinned client metadata documents could not be read.", exception);
        }
        return documents;
    }

    @Override
    public @Nullable RegisteredClient findByClientId(String clientId) {
        if (!allowedClients.contains(clientId)) {
            return null;
        }
        Instant now = clock.instant();
        Cached cached = cache.get(clientId);
        if (cached != null && now.isBefore(cached.fetchedAt().plus(cacheTtl))) {
            return cached.client();
        }

        Optional<String> fetched = fetch(clientId);
        Optional<String> document =
                fetched.isPresent() || cached != null ? fetched : Optional.ofNullable(pinnedDocuments.get(clientId));
        if (document.isEmpty()) {
            if (cached == null) {
                return null;
            }
            // The last good copy serves until the next TTL, so a source that is down is not asked on every call.
            cache.put(clientId, new Cached(cached.client(), now));
            return cached.client();
        }

        Optional<RegisteredClient> client = toRegisteredClient(clientId, document.get());
        if (client.isEmpty()) {
            cache.remove(clientId);
            return null;
        }
        cache.put(clientId, new Cached(client.get(), now));
        return client.get();
    }

    /** The registered id is the client id. */
    @Override
    public @Nullable RegisteredClient findById(String id) {
        return findByClientId(id);
    }

    /** Clients come only from their metadata documents; nothing registers one. */
    @Override
    public void save(RegisteredClient registeredClient) {
        throw new UnsupportedOperationException("Clients are read from their metadata documents.");
    }

    /** The document's text, or empty when it could not be fetched; a document over the size cap reads as empty text. */
    private Optional<String> fetch(String clientId) {
        try {
            return Optional.of(restClient
                    .get()
                    .uri(URI.create(clientId))
                    .accept(MediaType.APPLICATION_JSON)
                    .exchange((request, response) -> {
                        if (!response.getStatusCode().is2xxSuccessful()) {
                            throw new UncheckedIOException(new IOException(
                                    "Answered " + response.getStatusCode().value()));
                        }
                        try (InputStream body = response.getBody()) {
                            byte[] bytes = body.readNBytes(MAX_DOCUMENT_BYTES + 1);
                            return bytes.length > MAX_DOCUMENT_BYTES ? "" : new String(bytes, StandardCharsets.UTF_8);
                        }
                    }));
        } catch (RuntimeException unreachable) {
            log.warn(
                    "Client metadata document {} could not be fetched: {}",
                    clientId,
                    unreachable.getClass().getSimpleName());
            return Optional.empty();
        }
    }

    private Optional<RegisteredClient> toRegisteredClient(String clientId, String document) {
        JsonNode metadata;
        try {
            metadata = jsonMapper.readTree(document);
        } catch (JacksonException notJson) {
            return refuse(clientId, "not JSON");
        }
        if (!metadata.isObject()) {
            return refuse(clientId, "not a JSON object");
        }
        if (!clientId.equals(metadata.path("client_id").asString(""))) {
            return refuse(clientId, "client_id names another client");
        }
        if (!ClientAuthenticationMethod.NONE
                .getValue()
                .equals(metadata.path("token_endpoint_auth_method").asString(""))) {
            return refuse(clientId, "token_endpoint_auth_method is not none");
        }
        // RFC 7591: grant_types defaults to authorization_code.
        JsonNode grantTypes = metadata.path("grant_types");
        if (!grantTypes.isMissingNode()
                && !containsText(grantTypes, AuthorizationGrantType.AUTHORIZATION_CODE.getValue())) {
            return refuse(clientId, "grant_types lacks authorization_code");
        }
        List<String> redirectUris = new ArrayList<>();
        for (JsonNode redirectUri : metadata.path("redirect_uris")) {
            if (!redirectUri.isString() || !isAllowedRedirect(redirectUri.asString())) {
                return refuse(clientId, "a redirect URI is neither https nor loopback");
            }
            redirectUris.add(redirectUri.asString());
        }
        if (redirectUris.isEmpty()) {
            return refuse(clientId, "redirect_uris is empty");
        }

        JsonNode clientName = metadata.path("client_name");
        return Optional.of(RegisteredClient.withId(clientId)
                .clientId(clientId)
                .clientName(
                        clientName.isString()
                                ? clientName.asString()
                                : URI.create(clientId).getHost())
                .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUris(uris -> uris.addAll(redirectUris))
                .scope(MCP_SCOPE)
                .clientSettings(ClientSettings.builder()
                        .requireProofKey(true)
                        .requireAuthorizationConsent(true)
                        .build())
                .tokenSettings(tokenSettings)
                .build());
    }

    private static boolean containsText(JsonNode array, String value) {
        for (JsonNode element : array) {
            if (element.isString() && value.equals(element.asString())) {
                return true;
            }
        }
        return false;
    }

    private static boolean isAllowedRedirect(String redirectUri) {
        URI uri;
        try {
            uri = new URI(redirectUri);
        } catch (URISyntaxException malformed) {
            return false;
        }
        if (uri.getFragment() != null || uri.getHost() == null) {
            return false;
        }
        return "https".equals(uri.getScheme())
                || ("http".equals(uri.getScheme()) && LOOPBACK_HOSTS.contains(uri.getHost()));
    }

    private static Optional<RegisteredClient> refuse(String clientId, String reason) {
        log.warn("Client metadata document {} refused: {}", clientId, reason);
        return Optional.empty();
    }
}
