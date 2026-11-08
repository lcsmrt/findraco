package com.lcs.findraco.support;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.lcs.findraco.user.model.User;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Speaks MCP's Streamable HTTP to {@code /mcp} as Claude does: {@code initialize}, then {@code tools/call} with a bearer
 * token, so the security chain is part of every call.
 */
public final class McpClient {

    public static final String RESOURCE = "http://localhost/mcp";
    public static final String ISSUER = "http://localhost";
    public static final String SCOPE = "findraco.mcp";

    private static final JsonMapper JSON = JsonMapper.builder().build();
    private static final String SESSION_HEADER = "Mcp-Session-Id";

    private final MockMvc mockMvc;
    private final String token;
    private String sessionId;
    private int nextId = 1;

    public McpClient(MockMvc mockMvc, String token) {
        this.mockMvc = mockMvc;
        this.token = token;
    }

    /** An access token as the authorization server signs it, with the given audience and scope. */
    public static String token(
            JWKSource<SecurityContext> jwkSource, User user, List<String> audience, List<String> scope) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(ISSUER)
                .subject(String.valueOf(user.getId()))
                .audience(audience)
                .claim("scope", scope)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(900))
                .build();
        return new NimbusJwtEncoder(jwkSource)
                .encode(JwtEncoderParameters.from(
                        JwsHeader.with(SignatureAlgorithm.RS256).build(), claims))
                .getTokenValue();
    }

    public static String token(JWKSource<SecurityContext> jwkSource, User user) {
        return token(jwkSource, user, List.of(RESOURCE), List.of(SCOPE));
    }

    /** The raw request, for the cases where the chain answers before MCP does. */
    public MockHttpServletRequestBuilder request(String body) {
        MockHttpServletRequestBuilder request = post("/mcp")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON, MediaType.TEXT_EVENT_STREAM)
                .content(body);
        if (sessionId != null) {
            request.header(SESSION_HEADER, sessionId);
        }
        return request;
    }

    public JsonNode initialize() throws Exception {
        MvcResult result = mockMvc.perform(request(rpc(
                        "initialize",
                        Map.of(
                                "protocolVersion", "2025-06-18",
                                "capabilities", Map.of(),
                                "clientInfo", Map.of("name", "test", "version", "1")))))
                .andReturn();
        sessionId = result.getResponse().getHeader(SESSION_HEADER);
        JsonNode response = body(result);
        mockMvc.perform(request("{\"jsonrpc\":\"2.0\",\"method\":\"notifications/initialized\"}"));
        return response;
    }

    public JsonNode listTools() throws Exception {
        return call("tools/list", Map.of()).path("result").path("tools");
    }

    /** A tool call's result: {@code isError} and the text Claude reads, parsed when it is JSON. */
    public JsonNode callTool(String name, Map<String, Object> arguments) throws Exception {
        return call("tools/call", Map.of("name", name, "arguments", arguments)).path("result");
    }

    /** The JSON a successful tool call returned. */
    public JsonNode callJson(String name, Map<String, Object> arguments) throws Exception {
        JsonNode result = callTool(name, arguments);
        return JSON.readTree(result.path("content").path(0).path("text").asString());
    }

    private JsonNode call(String method, Map<String, Object> params) throws Exception {
        if (sessionId == null) {
            initialize();
        }
        return body(mockMvc.perform(request(rpc(method, params))).andReturn());
    }

    private String rpc(String method, Map<String, Object> params) {
        return JSON.writeValueAsString(Map.of("jsonrpc", "2.0", "id", nextId++, "method", method, "params", params));
    }

    /** The JSON-RPC message of an answer, whether it came as plain JSON or as one server-sent event. */
    private static JsonNode body(MvcResult result) throws Exception {
        String text = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        for (String line : text.lines().toList()) {
            if (line.startsWith("data:")) {
                return JSON.readTree(line.substring(5).strip());
            }
        }
        return JSON.readTree(text);
    }
}
