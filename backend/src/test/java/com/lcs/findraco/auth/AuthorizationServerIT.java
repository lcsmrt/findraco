package com.lcs.findraco.auth;

import static com.lcs.findraco.support.OAuthClientFlow.CLIENT_ID;
import static com.lcs.findraco.support.OAuthClientFlow.REDIRECT_URI;
import static com.lcs.findraco.support.OAuthClientFlow.SCOPE;
import static com.lcs.findraco.support.OAuthClientFlow.STATE;
import static com.lcs.findraco.support.OAuthClientFlow.authorizeParams;
import static com.lcs.findraco.support.OAuthClientFlow.authorizeRequest;
import static com.lcs.findraco.support.OAuthClientFlow.claims;
import static com.lcs.findraco.support.OAuthClientFlow.json;
import static com.lcs.findraco.support.OAuthClientFlow.queryParam;
import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.OAuthClientFlow;
import com.lcs.findraco.user.model.User;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.JsonNode;

/** The authorization server Claude connects through, driven as Claude and the user's browser drive it. */
class AuthorizationServerIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbc;

    private OAuthClientFlow flow;

    @BeforeEach
    void flow() {
        flow = new OAuthClientFlow(mockMvc);
    }

    @Test
    void metadataAdvertisesCimdOnly() throws Exception {
        mockMvc.perform(get("/.well-known/oauth-authorization-server"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.issuer").value("http://localhost"))
                .andExpect(jsonPath("$.authorization_endpoint").value("http://localhost/oauth2/authorize"))
                .andExpect(jsonPath("$.token_endpoint").value("http://localhost/oauth2/token"))
                .andExpect(jsonPath("$.client_id_metadata_document_supported").value(true))
                .andExpect(jsonPath("$.code_challenge_methods_supported", contains("S256")))
                .andExpect(jsonPath("$.token_endpoint_auth_methods_supported", contains("none")))
                .andExpect(jsonPath("$.grant_types_supported", contains("authorization_code", "refresh_token")))
                .andExpect(jsonPath("$.scopes_supported", contains(SCOPE)))
                .andExpect(jsonPath("$.registration_endpoint").doesNotExist());
    }

    @Test
    void noRegistrationEndpoint() throws Exception {
        mockMvc.perform(post("/oauth2/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"redirect_uris\": [\"https://attacker.example/callback\"]}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void anonymousAuthorizeRedirectsToLogin() throws Exception {
        mockMvc.perform(authorizeRequest()).andExpect(status().isFound()).andExpect(redirectedUrl("/oauth/login"));
    }

    @Test
    void signedInAuthorizeRedirectsToConsent() throws Exception {
        MockHttpSession session = flow.signIn(fixtures.aUser());

        String consent = mockMvc.perform(authorizeRequest().session(session))
                .andExpect(status().isFound())
                .andReturn()
                .getResponse()
                .getRedirectedUrl();

        assertThat(consent).startsWith("http://localhost/oauth/consent?");
        assertThat(queryParam(consent, "client_id")).isEqualTo(CLIENT_ID);
        assertThat(queryParam(consent, "scope")).isEqualTo(SCOPE);
        assertThat(queryParam(consent, "state")).isNotBlank().isNotEqualTo(STATE);
    }

    @Test
    void clientInfoNamesClient() throws Exception {
        mockMvc.perform(get("/oauth2/client-info").param("client_id", CLIENT_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Client"))
                .andExpect(jsonPath("$.redirectHost").value("client.example"));

        mockMvc.perform(get("/oauth2/client-info").param("client_id", "https://evil.example/oauth/client"))
                .andExpect(problem(HttpStatus.NOT_FOUND, "not-found"));
    }

    @Test
    void allowIssuesSingleUseCode() throws Exception {
        MockHttpSession session = flow.signIn(fixtures.aUser());

        String callback = flow.decide(session, flow.consentState(session), "allow")
                .andExpect(status().isFound())
                .andReturn()
                .getResponse()
                .getRedirectedUrl();

        assertThat(callback).startsWith(REDIRECT_URI + "?");
        assertThat(queryParam(callback, "state")).isEqualTo(STATE);
        String code = queryParam(callback, "code");
        flow.exchange(code).andExpect(status().isOk());
        flow.exchange(code)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));

        // A code is good for 60 seconds: one issued 61 seconds ago is refused.
        String late = flow.code(fixtures.aUser());
        jdbc.update(
                "UPDATE oauth2_authorization SET authorization_code_issued_at = now() - interval '61 seconds', "
                        + "authorization_code_expires_at = now() - interval '1 second' "
                        + "WHERE authorization_code_value = ?",
                late);
        flow.exchange(late)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    @Test
    void denyReturnsAccessDenied() throws Exception {
        MockHttpSession session = flow.signIn(fixtures.aUser());

        String callback = flow.decide(session, flow.consentState(session), "deny")
                .andExpect(status().isFound())
                .andReturn()
                .getResponse()
                .getRedirectedUrl();

        assertThat(callback).startsWith(REDIRECT_URI + "?");
        var params = UriComponentsBuilder.fromUriString(callback).build().getQueryParams();
        assertThat(params.getFirst("error")).isEqualTo("access_denied");
        assertThat(params.getFirst("state")).isEqualTo(STATE);
        assertThat(params).doesNotContainKey("code");
    }

    @Test
    void missingPkceRefused() throws Exception {
        MultiValueMap<String, String> withoutChallenge = authorizeParams();
        withoutChallenge.remove("code_challenge");
        withoutChallenge.remove("code_challenge_method");
        MultiValueMap<String, String> plainChallenge = authorizeParams();
        plainChallenge.set("code_challenge_method", "plain");

        for (MultiValueMap<String, String> params : List.of(withoutChallenge, plainChallenge)) {
            String callback = mockMvc.perform(authorizeRequest(params))
                    .andExpect(status().isFound())
                    .andReturn()
                    .getResponse()
                    .getRedirectedUrl();

            assertThat(callback).startsWith(REDIRECT_URI + "?");
            assertThat(queryParam(callback, "error")).isEqualTo("invalid_request");
        }
    }

    @Test
    void codeExchangeIssuesAudienceBoundTokens() throws Exception {
        User user = fixtures.aUser();

        JsonNode tokens = json(flow.exchange(flow.code(user)).andExpect(status().isOk()));

        assertThat(tokens.path("token_type").asString()).isEqualTo("Bearer");
        assertThat(tokens.path("refresh_token").asString()).isNotBlank();
        JsonNode access = claims(tokens.path("access_token").asString());
        assertThat(
                        access.path("aud").isArray()
                                ? access.path("aud").get(0).asString()
                                : access.path("aud").asString())
                .isEqualTo(OAuthClientFlow.RESOURCE);
        assertThat(access.path("iss").asString()).isEqualTo("http://localhost");
        assertThat(access.path("sub").asString()).isEqualTo(String.valueOf(user.getId()));
        assertThat(access.path("scope").toString()).contains(SCOPE);
        assertThat(access.path("exp").asLong() - access.path("iat").asLong()).isEqualTo(15 * 60);
    }

    @Test
    void unlistedClientRefused() throws Exception {
        MultiValueMap<String, String> unlisted = authorizeParams();
        unlisted.set("client_id", "https://evil.example/oauth/client");

        mockMvc.perform(authorizeRequest(unlisted))
                .andExpect(status().isBadRequest())
                .andExpect(status().reason(containsString("invalid_client")));
    }
}
