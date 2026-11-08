package com.lcs.findraco.auth.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.auth.config.CimdProperties;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

/** Client ID Metadata Documents served by a local HTTP server standing in for the clients' hosts. */
class CimdRegisteredClientRepositoryTest {

    private static final Duration TTL = Duration.ofHours(24);

    private final MutableClock clock = new MutableClock(Instant.parse("2026-11-08T12:00:00Z"));
    private final Map<String, Response> responses = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> hits = new ConcurrentHashMap<>();
    private HttpServer server;

    private record Response(int status, String body) {}

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress(InetAddress.getLoopbackAddress(), 0), 0);
        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            hits.computeIfAbsent(path, ignored -> new AtomicInteger()).incrementAndGet();
            Response response = responses.getOrDefault(path, new Response(404, ""));
            byte[] body = response.body().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(response.status(), body.length == 0 ? -1 : body.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(body);
            }
        });
        server.start();
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    @Test
    void allowlistedClientGetsDocumentRedirects() {
        String clientId = url("/oauth/client");
        serve("/oauth/client", document(clientId, "\"https://app.example/callback\", \"http://127.0.0.1/callback\""));

        RegisteredClient client = repository(List.of(clientId), Map.of()).findByClientId(clientId);

        assertThat(client).isNotNull();
        assertThat(client.getId()).isEqualTo(clientId);
        assertThat(client.getClientName()).isEqualTo("Test client");
        assertThat(client.getRedirectUris())
                .containsExactlyInAnyOrder("https://app.example/callback", "http://127.0.0.1/callback");
        assertThat(client.getClientAuthenticationMethods()).containsExactly(ClientAuthenticationMethod.NONE);
        assertThat(client.getScopes()).containsExactly(CimdRegisteredClientRepository.MCP_SCOPE);
        assertThat(client.getClientSettings().isRequireProofKey()).isTrue();
        assertThat(client.getClientSettings().isRequireAuthorizationConsent()).isTrue();
    }

    @Test
    void unlistedClientIsNotFetched() {
        String listed = url("/oauth/client");
        serve("/oauth/client", document(listed, "\"https://app.example/callback\""));
        serve("/oauth/other", document(url("/oauth/other"), "\"https://app.example/callback\""));
        CimdRegisteredClientRepository repository = repository(List.of(listed), Map.of());

        assertThat(repository.findByClientId(url("/oauth/other"))).isNull();
        assertThat(repository.findByClientId(listed + "/extra")).isNull();
        assertThat(repository.findByClientId("https://evil.example/oauth/client"))
                .isNull();
        assertThat(hits).isEmpty();
    }

    @Test
    void invalidDocumentsAreRefused() {
        String otherId = url("/other-id");
        String secretClient = url("/secret");
        String noCodeGrant = url("/no-code");
        String plainHttp = url("/plain-http");
        serve("/other-id", document(url("/someone-else"), "\"https://app.example/callback\""));
        serve(
                "/secret",
                document(secretClient, "\"https://app.example/callback\"")
                        .replace("\"none\"", "\"client_secret_basic\""));
        serve(
                "/no-code",
                document(noCodeGrant, "\"https://app.example/callback\"").replace("\"authorization_code\", ", ""));
        serve("/plain-http", document(plainHttp, "\"http://app.example/callback\""));
        CimdRegisteredClientRepository repository =
                repository(List.of(otherId, secretClient, noCodeGrant, plainHttp), Map.of());

        assertThat(repository.findByClientId(otherId)).isNull();
        assertThat(repository.findByClientId(secretClient)).isNull();
        assertThat(repository.findByClientId(noCodeGrant)).isNull();
        assertThat(repository.findByClientId(plainHttp)).isNull();
    }

    @Test
    void claudeDocumentExtraGrantIgnored() {
        String claudeId = "https://claude.ai/oauth/mcp-oauth-client-metadata";
        String pinned = CimdRegisteredClientRepository.pinnedDocuments().get(claudeId);
        assertThat(pinned).contains("urn:ietf:params:oauth:grant-type:jwt-bearer");
        // claude.ai's document as published, served from here: only the client id names this server.
        String clientId = url("/oauth/mcp-oauth-client-metadata");
        serve("/oauth/mcp-oauth-client-metadata", pinned.replace(claudeId, clientId));

        RegisteredClient client = repository(List.of(clientId), Map.of()).findByClientId(clientId);

        assertThat(client).isNotNull();
        assertThat(client.getClientName()).isEqualTo("Claude");
        assertThat(client.getAuthorizationGrantTypes())
                .containsExactlyInAnyOrder(
                        AuthorizationGrantType.AUTHORIZATION_CODE, AuthorizationGrantType.REFRESH_TOKEN);
        assertThat(client.getRedirectUris()).containsExactly("https://claude.ai/api/mcp/auth_callback");
    }

    @Test
    void fetchFailureFallsBack() {
        String clientId = url("/oauth/client");
        serve("/oauth/client", document(clientId, "\"https://app.example/fetched\""));
        CimdRegisteredClientRepository repository =
                repository(List.of(clientId), Map.of(clientId, document(clientId, "\"https://app.example/pinned\"")));
        assertThat(repository.findByClientId(clientId).getRedirectUris())
                .containsExactly("https://app.example/fetched");

        // Past the cache TTL the host refuses (claude.ai's edge answers 403): the last good copy still serves.
        clock.advance(TTL.plusSeconds(1));
        responses.put("/oauth/client", new Response(403, ""));
        assertThat(repository.findByClientId(clientId).getRedirectUris())
                .containsExactly("https://app.example/fetched");
        assertThat(hits.get("/oauth/client")).hasValue(2);

        // With no copy fetched yet, the pinned one serves.
        CimdRegisteredClientRepository fresh =
                repository(List.of(clientId), Map.of(clientId, document(clientId, "\"https://app.example/pinned\"")));
        assertThat(fresh.findByClientId(clientId).getRedirectUris()).containsExactly("https://app.example/pinned");

        // Without either, the client is unknown.
        assertThat(repository(List.of(clientId), Map.of()).findByClientId(clientId))
                .isNull();
    }

    private CimdRegisteredClientRepository repository(List<String> allowed, Map<String, String> pinned) {
        CimdProperties properties =
                new CimdProperties(allowed.stream().map(URI::create).toList(), TTL);
        return new CimdRegisteredClientRepository(
                properties, TokenSettings.builder().build(), clock, pinned);
    }

    private void serve(String path, String body) {
        responses.put(path, new Response(200, body));
    }

    private String url(String path) {
        return "http://127.0.0.1:" + server.getAddress().getPort() + path;
    }

    private static String document(String clientId, String redirectUris) {
        return """
                {"client_id": "%s", "client_name": "Test client", "redirect_uris": [%s],
                 "grant_types": ["authorization_code", "refresh_token"], "response_types": ["code"],
                 "token_endpoint_auth_method": "none"}
                """.formatted(clientId, redirectUris);
    }

    private static final class MutableClock extends Clock {

        private Instant now;

        MutableClock(Instant now) {
            this.now = now;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
