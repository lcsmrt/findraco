package com.lcs.findraco.mcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.McpClient;
import com.lcs.findraco.support.OAuthClientFlow;
import com.lcs.findraco.user.model.User;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import tools.jackson.databind.JsonNode;

/** The MCP chain: who may reach {@code /mcp}, what it tells the rest, and how many calls it takes. */
@TestPropertySource(properties = {"app.rate-limit.mcp-user.capacity=2", "app.rate-limit.mcp-user.period=PT1H"})
class McpSecurityIT extends AbstractIntegrationTest {

    private static final String CHALLENGE =
            "Bearer resource_metadata=\"http://localhost/.well-known/oauth-protected-resource\"";

    @Autowired
    private JWKSource<SecurityContext> jwkSource;

    @Test
    void anonymousGetsResourceMetadataChallenge() throws Exception {
        String initialize = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}";

        mockMvc.perform(post("/mcp").contentType("application/json").content(initialize))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, CHALLENGE));
        mockMvc.perform(post("/mcp")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer not-a-token")
                        .contentType("application/json")
                        .content(initialize))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string(HttpHeaders.WWW_AUTHENTICATE, CHALLENGE));
    }

    @Test
    void protectedResourceMetadata() throws Exception {
        for (String path :
                List.of("/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/mcp")) {
            mockMvc.perform(get(path))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.resource").value("http://localhost/mcp"))
                    .andExpect(jsonPath("$.authorization_servers", contains("http://localhost")))
                    .andExpect(jsonPath("$.scopes_supported", contains("findraco.mcp")));
        }
    }

    @Test
    void tokensDoNotCrossChains() throws Exception {
        User user = fixtures.aUser();
        String mcpToken =
                new OAuthClientFlow(mockMvc).connect(user).path("access_token").asString();

        mockMvc.perform(get(ApiRoutes.PLAN).header(HttpHeaders.AUTHORIZATION, "Bearer " + mcpToken))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/mcp")
                        .header(HttpHeaders.AUTHORIZATION, testAuthHelper.bearerFor(user))
                        .contentType("application/json")
                        .content("{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}"))
                .andExpect(status().isUnauthorized());
        assertThat(new McpClient(mockMvc, mcpToken)
                        .initialize()
                        .path("result")
                        .path("serverInfo")
                        .path("name")
                        .asString())
                .isEqualTo("findraco");
    }

    @Test
    void wrongAudienceOrScopeRefused() throws Exception {
        User user = fixtures.aUser();
        String initialize = "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{}}";

        for (String token : List.of(
                McpClient.token(jwkSource, user, List.of("http://localhost/other"), List.of(McpClient.SCOPE)),
                McpClient.token(jwkSource, user, List.of(McpClient.RESOURCE), List.of("other.scope")))) {
            mockMvc.perform(post("/mcp")
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                            .contentType("application/json")
                            .content(initialize))
                    .andExpect(status().isUnauthorized());
        }
    }

    @Test
    void rateLimitIsToolError() throws Exception {
        User user = fixtures.aUser();
        fixtures.aPlan(user);
        McpClient client = new McpClient(mockMvc, McpClient.token(jwkSource, user));

        assertThat(client.callTool("list_plans", Map.of()).path("isError").asBoolean())
                .isFalse();
        assertThat(client.callTool("list_plans", Map.of()).path("isError").asBoolean())
                .isFalse();
        JsonNode refused = client.callTool("list_plans", Map.of());

        assertThat(refused.path("isError").asBoolean()).isTrue();
        assertThat(refused.path("content").path(0).path("text").asString()).contains("Retry in a moment");
    }
}
