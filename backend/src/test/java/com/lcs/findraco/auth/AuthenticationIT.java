package com.lcs.findraco.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Drives the real registration ({@code POST /user}) and login ({@code POST /auth/login})
 * endpoints end-to-end through the actual security filter chain — no {@code Fixtures.aUser()}
 * shortcuts and no {@code @WithMockUser} — to prove the auth slice actually issues and honors
 * JWTs, and that the two-layer plan authorization model (see {@link PlanAuthorizationMatrixIT})
 * holds when the caller mints their token through the real endpoints instead of
 * {@code testAuthHelper}.
 */
class AuthenticationIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${app.jwt.secret-key}")
    private String jwtSecretKey;

    private String registerAndLogin(String email) throws Exception {
        register(email);
        return login(email, "password123");
    }

    private void register(String email) throws Exception {
        mockMvc.perform(post(UserRoutes.USER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Test User",
                                "email", email,
                                "password", "password123"))))
                .andExpect(status().isCreated());
    }

    private String login(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", email,
                                "password", password))))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("token").asString();
    }

    @Test
    void registerThenLoginIssuesTokenThatGrantsAuthenticatedAccess() throws Exception {
        String email = "alice-" + System.nanoTime() + "@test.com";
        register(email);

        String token = login(email, "password123");
        assertThat(token).isNotBlank();

        mockMvc.perform(get(UserRoutes.USER + "/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    JsonNode profile =
                            objectMapper.readTree(result.getResponse().getContentAsString());
                    assertThat(profile.get("email").asString()).isEqualTo(email);
                });
    }

    @Test
    void registerWithoutTokenRequiresNoAuthentication() throws Exception {
        // POST /users is permitAll in SecurityConfig: registration itself must not require a
        // bearer token, and the response carries the new user, not a token (login mints that).
        String email = "bob-" + System.nanoTime() + "@test.com";
        MvcResult result = mockMvc.perform(post(UserRoutes.USER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "name", "Bob",
                                "email", email,
                                "password", "password123"))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode created = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(created.get("email").asString()).isEqualTo(email);
        assertThat(created.has("token")).isFalse();
    }

    @Test
    void loginWithCorrectCredentialsReturnsValidJwt() throws Exception {
        String email = "carol-" + System.nanoTime() + "@test.com";
        register(email);

        String token = login(email, "password123");
        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
    }

    private MvcResult attemptLogin(String email, String password) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", email,
                                "password", password))))
                .andReturn();
    }

    @Test
    void loginWithWrongPasswordIsRejected() throws Exception {
        String email = "dave-" + System.nanoTime() + "@test.com";
        register(email);

        mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("email", email, "password", "not-the-right-password"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginForUnknownEmailIsRejected() throws Exception {
        // A login for an email with no matching user must be rejected with 401 (not 500):
        // CustomUserDetailsService throws Spring Security's own UsernameNotFoundException, which
        // DaoAuthenticationProvider's hideUserNotFoundExceptions converts to a BadCredentialsException,
        // mapped to 401 by GlobalExceptionHandler.
        mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "nobody-" + System.nanoTime() + "@test.com", "password", "password123"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void unknownEmailAndWrongPasswordAreIndistinguishable() throws Exception {
        // Anti-enumeration: an unknown email and a wrong password for a known email must return the
        // exact same status and body, so a caller can't tell whether an email is registered.
        String knownEmail = "heidi-" + System.nanoTime() + "@test.com";
        register(knownEmail);

        MvcResult wrongPassword = attemptLogin(knownEmail, "not-the-right-password");
        MvcResult unknownEmail = attemptLogin("nobody-" + System.nanoTime() + "@test.com", "password123");

        assertThat(unknownEmail.getResponse().getStatus())
                .isEqualTo(wrongPassword.getResponse().getStatus());

        JsonNode wrongPasswordBody =
                objectMapper.readTree(wrongPassword.getResponse().getContentAsString());
        JsonNode unknownEmailBody =
                objectMapper.readTree(unknownEmail.getResponse().getContentAsString());
        assertThat(unknownEmailBody.get("type").asString())
                .isEqualTo(wrongPasswordBody.get("type").asString());
        assertThat(unknownEmailBody.get("detail").asString())
                .isEqualTo(wrongPasswordBody.get("detail").asString());
    }

    @Test
    void registeredUserCanAccessTheirOwnAutoProvisionedPlan() throws Exception {
        String email = "erin-" + System.nanoTime() + "@test.com";
        String token = registerAndLogin(email);

        // UserService.create() auto-provisions a default plan for every new user; the freshly
        // minted token must be able to see it via the real plans endpoint.
        mockMvc.perform(get(ApiRoutes.PLAN).header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    JsonNode plans = objectMapper.readTree(result.getResponse().getContentAsString());
                    assertThat(plans.isArray()).isTrue();
                    assertThat(plans).hasSize(1);
                });
    }

    @Test
    void tokenForUserACannotAccessUserBsNonSharedPlan() throws Exception {
        String emailA = "frank-" + System.nanoTime() + "@test.com";
        String emailB = "grace-" + System.nanoTime() + "@test.com";
        String tokenA = registerAndLogin(emailA);
        String tokenB = registerAndLogin(emailB);

        Long planIdA = fetchOwnPlanId(tokenA);

        // Non-member access must 404, never 403 — consistent with the two-layer plan
        // authorization model verified against real tokens in PlanAuthorizationMatrixIT.
        mockMvc.perform(get(ApiRoutes.PLAN + "/{id}", planIdA).header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenB))
                .andExpect(status().isNotFound());

        mockMvc.perform(get(ApiRoutes.PLAN + "/{id}", planIdA).header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenA))
                .andExpect(status().isOk());
    }

    // SESS-01: every way of lacking a usable access token answers 401 "Authentication required."
    // (JsonAuthenticationEntryPoint), never Spring's default empty 403.

    @Test
    void requestWithoutTokenIsRejectedForProtectedEndpoint() throws Exception {
        mockMvc.perform(get(ApiRoutes.PLAN))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.type").value("urn:findraco:problem:unauthenticated"));
    }

    @Test
    void malformedTokenIsRejectedWith401() throws Exception {
        mockMvc.perform(get(UserRoutes.USER + "/me").header(HttpHeaders.AUTHORIZATION, "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.type").value("urn:findraco:problem:unauthenticated"));
    }

    @Test
    void tokenSignedWithAnotherKeyIsRejectedWith401() throws Exception {
        User user = fixtures.aUser();
        Instant now = fixtures.now();
        String forged = Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(900)))
                .signWith(signingKey("a-different-secret-key-that-is-long-enough-for-hmac-sha-512-signatures"))
                .compact();

        mockMvc.perform(get(UserRoutes.USER + "/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + forged))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.type").value("urn:findraco:problem:unauthenticated"));
    }

    @Test
    void expiredTokenIsRejectedWith401() throws Exception {
        User user = fixtures.aUser();
        Instant issuedAt = fixtures.now().minusSeconds(3_600);
        String expired = Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusSeconds(900)))
                .signWith(signingKey(jwtSecretKey))
                .compact();

        mockMvc.perform(get(UserRoutes.USER + "/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + expired))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.type").value("urn:findraco:problem:unauthenticated"));
    }

    @Test
    void accessTokenFromLoginLivesFifteenMinutes() throws Exception {
        String token = registerAndLogin("ivan-" + System.nanoTime() + "@test.com");

        JsonNode claims = objectMapper.readTree(Base64.getUrlDecoder().decode(token.split("\\.", -1)[1]));
        assertThat(claims.get("exp").asLong() - claims.get("iat").asLong()).isEqualTo(900);
    }

    /** Same key derivation as JwtService, so only the secret (or the expiry) differs from a real token. */
    private static SecretKey signingKey(String secret) {
        return Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes(StandardCharsets.UTF_8)));
    }

    private Long fetchOwnPlanId(String token) throws Exception {
        MvcResult result = mockMvc.perform(get(ApiRoutes.PLAN).header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode plans = objectMapper.readTree(result.getResponse().getContentAsString());
        return plans.get(0).get("id").asLong();
    }
}
