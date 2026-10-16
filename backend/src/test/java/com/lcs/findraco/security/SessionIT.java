package com.lcs.findraco.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.User;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockCookie;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Persistent sessions through the real auth endpoints (SESS-04, SESS-06 to SESS-10, SESS-12): the
 * session cookie issued at login, its renewal and rotation, and sign-out. Time-based rules are
 * exercised by backdating rows with SQL instead of mocking the clock.
 */
class SessionIT extends AbstractIntegrationTest {

    private static final String COOKIE = "findraco_session";
    private static final String COOKIE_PATH = "/api/findraco/auth";
    private static final int THIRTY_DAYS_IN_SECONDS = 2_592_000;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DataSource dataSource;

    private JdbcTemplate jdbc;

    @BeforeEach
    void setUp() {
        jdbc = new JdbcTemplate(dataSource);
    }

    // --- login (T5) ---------------------------------------------------------------------------

    @Test
    void loginReturnsTheAccessTokenAndSetsTheSessionCookie() throws Exception {
        User user = fixtures.aUser();

        MvcResult result = login(user.getEmail(), "password")
                .andExpect(status().isOk())
                .andReturn();

        String body = result.getResponse().getContentAsString();
        assertThat(objectMapper.readTree(body).get("token").asText()).isNotBlank();

        MockCookie cookie = sessionCookie(result);
        assertThat(cookie.getValue()).isNotBlank();
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getSecure()).isTrue();
        assertThat(cookie.getSameSite()).isEqualTo("Strict");
        assertThat(cookie.getPath()).isEqualTo(COOKIE_PATH);
        assertThat(cookie.getMaxAge()).isEqualTo(THIRTY_DAYS_IN_SECONDS);
        assertThat(body).doesNotContain(cookie.getValue());
    }

    @Test
    void loginStoresOnlyTheSha256OfTheCookieValue() throws Exception {
        User user = fixtures.aUser();

        String cookieValue = sessionCookie(login(user.getEmail(), "password").andReturn()).getValue();

        assertThat(tokenHashesOf(user))
                .containsExactly(OpaqueTokens.hash(cookieValue))
                .doesNotContain(cookieValue);
    }

    @Test
    void loginDeletesTheUsersExpiredSessionsAndKeepsOtherUsers() throws Exception {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        String expiredOwn = OpaqueTokens.hash(sessionCookie(login(user.getEmail(), "password").andReturn()).getValue());
        String expiredOther = OpaqueTokens.hash(sessionCookie(login(other.getEmail(), "password").andReturn()).getValue());
        backdateExpiry(expiredOwn);
        backdateExpiry(expiredOther);

        String fresh = OpaqueTokens.hash(sessionCookie(login(user.getEmail(), "password").andReturn()).getValue());

        assertThat(tokenHashesOf(user)).containsExactly(fresh);
        assertThat(tokenHashesOf(other)).containsExactly(expiredOther);
    }

    @Test
    void wrongPasswordIsRejectedWithoutACookie() throws Exception {
        User user = fixtures.aUser();

        login(user.getEmail(), "not-the-password")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username or password."))
                .andExpect(result -> assertThat(result.getResponse().getHeaders(HttpHeaders.SET_COOKIE)).isEmpty());
        assertThat(tokenHashesOf(user)).isEmpty();
    }

    // --- helpers ------------------------------------------------------------------------------

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post(ApiRoutes.AUTH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    /** The session cookie set by the response; fails when the response set none. */
    private static MockCookie sessionCookie(MvcResult result) {
        assertThat(result.getResponse().getHeaders(HttpHeaders.SET_COOKIE))
                .as("Set-Cookie headers")
                .anySatisfy(header -> assertThat(header).startsWith(COOKIE + "="));
        return (MockCookie) result.getResponse().getCookie(COOKIE);
    }

    private List<String> tokenHashesOf(User user) {
        return jdbc.queryForList("SELECT token_hash FROM user_sessions WHERE user_id = ?", String.class, user.getId());
    }

    // Timestamps come from the JVM clock, like the app's: the columns have no time zone, so the
    // database's now() could be in another zone than the one SessionService compares against.
    private void backdateExpiry(String tokenHash) {
        jdbc.update("UPDATE user_sessions SET expires_at = ? WHERE token_hash = ?",
                LocalDateTime.now().minusMinutes(1), tokenHash);
    }
}
