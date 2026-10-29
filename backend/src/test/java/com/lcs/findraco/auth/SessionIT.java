package com.lcs.findraco.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.auth.service.OpaqueTokens;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockCookie;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.databind.ObjectMapper;

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

    @Value("${app.jwt.secret-key}")
    private String jwtSecretKey;

    private JdbcTemplate jdbc;

    @BeforeEach
    void setUp() {
        jdbc = new JdbcTemplate(dataSource);
    }

    // --- login (T5) ---------------------------------------------------------------------------

    @Test
    void loginReturnsTheAccessTokenAndSetsTheSessionCookie() throws Exception {
        User user = fixtures.aUser();

        MvcResult result =
                login(user.getEmail(), "password").andExpect(status().isOk()).andReturn();

        String body = result.getResponse().getContentAsString();
        assertThat(objectMapper.readTree(body).get("token").asString()).isNotBlank();

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

        String cookieValue =
                sessionCookie(login(user.getEmail(), "password").andReturn()).getValue();

        assertThat(tokenHashesOf(user))
                .containsExactly(OpaqueTokens.hash(cookieValue))
                .doesNotContain(cookieValue);
    }

    @Test
    void loginDeletesTheUsersExpiredSessionsAndKeepsOtherUsers() throws Exception {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        String expiredOwn = OpaqueTokens.hash(
                sessionCookie(login(user.getEmail(), "password").andReturn()).getValue());
        String expiredOther = OpaqueTokens.hash(
                sessionCookie(login(other.getEmail(), "password").andReturn()).getValue());
        backdateExpiry(expiredOwn);
        backdateExpiry(expiredOther);

        String fresh = OpaqueTokens.hash(
                sessionCookie(login(user.getEmail(), "password").andReturn()).getValue());

        assertThat(tokenHashesOf(user)).containsExactly(fresh);
        assertThat(tokenHashesOf(other)).containsExactly(expiredOther);
    }

    @Test
    void wrongPasswordIsRejectedWithoutACookie() throws Exception {
        User user = fixtures.aUser();

        login(user.getEmail(), "not-the-password")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username or password."))
                .andExpect(result -> assertThat(result.getResponse().getHeaders(HttpHeaders.SET_COOKIE))
                        .isEmpty());
        assertThat(tokenHashesOf(user)).isEmpty();
    }

    // --- refresh (T6) -------------------------------------------------------------------------

    @Test
    void refreshWithAValidCookieReturnsAWorkingTokenAndRotatesTheCookie() throws Exception {
        User user = fixtures.aUser();
        String oldCookie = loginCookie(user);

        MvcResult result = refresh(oldCookie).andExpect(status().isOk()).andReturn();

        String token = objectMapper
                .readTree(result.getResponse().getContentAsString())
                .get("token")
                .asString();
        mockMvc.perform(get(UserRoutes.USER + "/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(user.getEmail()));

        MockCookie newCookie = sessionCookie(result);
        assertThat(newCookie.getValue()).isNotBlank().isNotEqualTo(oldCookie);
        assertThat(newCookie.isHttpOnly()).isTrue();
        assertThat(newCookie.getSecure()).isTrue();
        assertThat(newCookie.getSameSite()).isEqualTo("Strict");
        assertThat(newCookie.getPath()).isEqualTo(COOKIE_PATH);
        assertThat(newCookie.getMaxAge()).isEqualTo(THIRTY_DAYS_IN_SECONDS);

        LocalDateTime expiresAt = jdbc.queryForObject(
                "SELECT expires_at FROM user_sessions WHERE token_hash = ?",
                LocalDateTime.class,
                OpaqueTokens.hash(newCookie.getValue()));
        assertThat(expiresAt).isCloseTo(LocalDateTime.now().plusDays(30), within(1, ChronoUnit.MINUTES));
    }

    @Test
    void refreshWithoutACookieIsRejectedAndClearsTheCookie() throws Exception {
        assertRejectedAndCleared(refresh(null));
    }

    @Test
    void refreshWithAnUnknownCookieIsRejectedAndClearsTheCookie() throws Exception {
        assertRejectedAndCleared(refresh(OpaqueTokens.generate()));
    }

    @Test
    void refreshWithAnExpiredSessionIsRejectedAndClearsTheCookie() throws Exception {
        String cookie = loginCookie(fixtures.aUser());
        backdateExpiry(OpaqueTokens.hash(cookie));

        assertRejectedAndCleared(refresh(cookie));
    }

    @Test
    void replacedCookieReusedWithinThirtySecondsStillRenews() throws Exception {
        String original = loginCookie(fixtures.aUser());
        refresh(original).andExpect(status().isOk());

        refresh(original).andExpect(status().isOk());
    }

    @Test
    void replacedCookieReusedAfterThirtyOneSecondsRevokesItsDeviceChainOnly() throws Exception {
        User user = fixtures.aUser();
        String original = loginCookie(user);
        String successor = sessionCookie(
                        refresh(original).andExpect(status().isOk()).andReturn())
                .getValue();
        String otherDevice = loginCookie(user);
        jdbc.update(
                "UPDATE user_sessions SET replaced_at = ? WHERE token_hash = ?",
                LocalDateTime.now().minusSeconds(31),
                OpaqueTokens.hash(original));

        assertRejectedAndCleared(refresh(original));
        assertRejectedAndCleared(refresh(successor));
        refresh(otherDevice).andExpect(status().isOk());
    }

    @Test
    void refreshForADeletedUserIsRejected() throws Exception {
        User user = fixtures.aUser();
        String cookie = loginCookie(user);
        jdbc.update("DELETE FROM users WHERE id = ?", user.getId());

        assertRejectedAndCleared(refresh(cookie));
    }

    // --- logout (T7) --------------------------------------------------------------------------

    @Test
    void logoutRevokesTheSessionAndClearsTheCookie() throws Exception {
        String cookie = loginCookie(fixtures.aUser());

        MvcResult result =
                logout(cookie, null).andExpect(status().isNoContent()).andReturn();

        assertCleared(result);
        assertRejectedAndCleared(refresh(cookie));
    }

    @Test
    void logoutKeepsTheUsersOtherDevicesSignedIn() throws Exception {
        User user = fixtures.aUser();
        String thisDevice = loginCookie(user);
        String otherDevice = loginCookie(user);

        logout(thisDevice, null).andExpect(status().isNoContent());

        refresh(otherDevice).andExpect(status().isOk());
    }

    @Test
    void logoutWithoutACookieAndWithAnExpiredAccessTokenStillSucceeds() throws Exception {
        User user = fixtures.aUser();
        Instant issuedAt = Instant.now().minusSeconds(3_600);
        String expiredAccessToken = Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusSeconds(900)))
                .signWith(Keys.hmacShaKeyFor(Base64.getEncoder().encode(jwtSecretKey.getBytes(StandardCharsets.UTF_8))))
                .compact();

        MvcResult result = logout(null, expiredAccessToken)
                .andExpect(status().isNoContent())
                .andReturn();

        assertCleared(result);
    }

    // --- helpers ------------------------------------------------------------------------------

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    private ResultActions refresh(String cookieValue) throws Exception {
        MockHttpServletRequestBuilder request = post(AuthRoutes.AUTH + "/refresh");
        if (cookieValue != null) {
            request.cookie(new Cookie(COOKIE, cookieValue));
        }
        return mockMvc.perform(request);
    }

    private ResultActions logout(String cookieValue, String accessToken) throws Exception {
        MockHttpServletRequestBuilder request = post(AuthRoutes.AUTH + "/logout");
        if (cookieValue != null) {
            request.cookie(new Cookie(COOKIE, cookieValue));
        }
        if (accessToken != null) {
            request.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
        }
        return mockMvc.perform(request);
    }

    private String loginCookie(User user) throws Exception {
        return sessionCookie(login(user.getEmail(), "password")
                        .andExpect(status().isOk())
                        .andReturn())
                .getValue();
    }

    /** 401 "Authentication required." and a Set-Cookie that deletes the session cookie. */
    private static void assertRejectedAndCleared(ResultActions response) throws Exception {
        MvcResult result = response.andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Authentication required."))
                .andReturn();
        assertCleared(result);
    }

    /** The response carries a Set-Cookie that deletes the session cookie. */
    private static void assertCleared(MvcResult result) {
        MockCookie cleared = sessionCookie(result);
        assertThat(cleared.getValue()).isEmpty();
        assertThat(cleared.getMaxAge()).isZero();
        assertThat(cleared.getPath()).isEqualTo(COOKIE_PATH);
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
        jdbc.update(
                "UPDATE user_sessions SET expires_at = ? WHERE token_hash = ?",
                LocalDateTime.now().minusMinutes(1),
                tokenHash);
    }
}
