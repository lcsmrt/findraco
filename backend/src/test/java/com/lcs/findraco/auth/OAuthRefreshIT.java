package com.lcs.findraco.auth;

import static com.lcs.findraco.support.OAuthClientFlow.CLIENT_ID;
import static com.lcs.findraco.support.OAuthClientFlow.claims;
import static com.lcs.findraco.support.OAuthClientFlow.json;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.service.OpaqueTokens;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.OAuthClientFlow;
import com.lcs.findraco.user.model.User;
import java.sql.Timestamp;
import java.time.Duration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.JsonNode;

/** Claude renewing its tokens: rotation, idle expiry, replay, and revocation by a password reset. */
class OAuthRefreshIT extends AbstractIntegrationTest {

    @Autowired
    private JdbcTemplate jdbc;

    private OAuthClientFlow flow;

    @BeforeEach
    void flow() {
        flow = new OAuthClientFlow(mockMvc);
    }

    @Test
    void refreshRotates() throws Exception {
        User user = fixtures.aUser();
        String used = flow.connect(user).path("refresh_token").asString();

        JsonNode renewed = json(flow.refresh(used, CLIENT_ID).andExpect(status().isOk()));

        String next = renewed.path("refresh_token").asString();
        assertThat(next).isNotBlank().isNotEqualTo(used);
        JsonNode access = claims(renewed.path("access_token").asString());
        assertThat(access.path("sub").asString()).isEqualTo(String.valueOf(user.getId()));
        assertThat(access.path("aud").toString()).contains(OAuthClientFlow.RESOURCE);
        flow.refresh(used, CLIENT_ID)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    @Test
    void idleRefreshExpires() throws Exception {
        String refreshToken =
                flow.connect(fixtures.aUser()).path("refresh_token").asString();
        Timestamp issuedAt =
                jdbc.queryForObject("SELECT refresh_token_issued_at FROM oauth2_authorization", Timestamp.class);
        Timestamp expiresAt =
                jdbc.queryForObject("SELECT refresh_token_expires_at FROM oauth2_authorization", Timestamp.class);
        assertThat(Duration.between(issuedAt.toInstant(), expiresAt.toInstant()))
                .isEqualTo(Duration.ofDays(30));

        // Thirty days without a refresh: the token's own expiry has passed.
        jdbc.update("UPDATE oauth2_authorization SET refresh_token_issued_at = now() - interval '30 days 1 second', "
                + "refresh_token_expires_at = now() - interval '1 second'");

        flow.refresh(refreshToken, CLIENT_ID)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
    }

    @Test
    void replayRevokesGrant() throws Exception {
        User user = fixtures.aUser();
        String first = flow.connect(user).path("refresh_token").asString();
        String second = json(flow.refresh(first, CLIENT_ID).andExpect(status().isOk()))
                .path("refresh_token")
                .asString();

        flow.refresh(first, CLIENT_ID)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));

        flow.refresh(second, CLIENT_ID)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
        assertThat(grantsOf(user)).isZero();
    }

    @Test
    void passwordResetRevokesGrants() throws Exception {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        String refreshToken = flow.connect(user).path("refresh_token").asString();
        String otherRefreshToken = flow.connect(other).path("refresh_token").asString();
        String resetToken = OpaqueTokens.generate();
        jdbc.update(
                "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, now() + interval "
                        + "'1 hour')",
                user.getId(),
                OpaqueTokens.hash(resetToken));

        mockMvc.perform(post("/api/findraco/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\": \"%s\", \"password\": \"a new password\"}".formatted(resetToken)))
                .andExpect(status().isNoContent());

        assertThat(grantsOf(user)).isZero();
        flow.refresh(refreshToken, CLIENT_ID)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("invalid_grant"));
        flow.refresh(otherRefreshToken, CLIENT_ID).andExpect(status().isOk());
    }

    @Test
    void unlistedClientCannotRefresh() throws Exception {
        String refreshToken =
                flow.connect(fixtures.aUser()).path("refresh_token").asString();

        flow.refresh(refreshToken, "https://evil.example/oauth/client")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("invalid_client"));
    }

    private int grantsOf(User user) {
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM oauth2_authorization WHERE principal_name = ?",
                Integer.class,
                String.valueOf(user.getId()));
        return count == null ? 0 : count;
    }
}
