package com.lcs.findraco.shared;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.auth.controller.SessionCookies;
import com.lcs.findraco.auth.model.PasswordResetToken;
import com.lcs.findraco.auth.repository.PasswordResetTokenRepository;
import com.lcs.findraco.auth.service.JwtService;
import com.lcs.findraco.auth.service.OpaqueTokens;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.user.controller.UserRoutes;
import jakarta.servlet.http.Cookie;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.TestPropertySource;
import tools.jackson.databind.ObjectMapper;

/**
 * Runs registration, sign-in and password recovery through the real endpoints, with the real e-mail
 * service, and checks nothing secret or personal reached
 * any logger. SMTP is off, as on a server without mail, and the test profile is not {@code local}, so
 * the reset link must not be logged either.
 */
@TestPropertySource(properties = "app.mail.smtp-host=")
class LogHygieneIT extends AbstractIntegrationTest {

    private static final String EMAIL = "hygiene.person@example.test";
    private static final String PASSWORD = "Hunter2-Secret-Pa55";
    private static final String NEW_PASSWORD = "N3w-Secret-Pa55word";
    private static final String UNKNOWN_EMAIL = "ghost.person@example.test";
    private static final long UNKNOWN_USER_ID = 987_654_321L;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    private MockHttpServletResponse postJson(String path, Map<String, String> body) throws Exception {
        return mockMvc.perform(post(path)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn()
                .getResponse();
    }

    private String accessToken(MockHttpServletResponse login) throws Exception {
        return objectMapper.readTree(login.getContentAsString()).get("token").asString();
    }

    @Test
    void loginAndPasswordRecoveryLogNoSecretOrPersonalData() throws Exception {
        List<String> secrets = new ArrayList<>(List.of(EMAIL, PASSWORD, NEW_PASSWORD, UNKNOWN_EMAIL));
        List<String> lines;

        try (CapturedLogs logs = CapturedLogs.all()) {
            assertThat(postJson(UserRoutes.USER, Map.of("name", "Hygiene", "email", EMAIL, "password", PASSWORD))
                            .getStatus())
                    .isEqualTo(201);

            MockHttpServletResponse login =
                    postJson(AuthRoutes.AUTH + "/login", Map.of("email", EMAIL, "password", PASSWORD));
            String sessionToken = login.getCookie(SessionCookies.NAME).getValue();
            secrets.add(accessToken(login));
            secrets.add(sessionToken);

            postJson(AuthRoutes.AUTH + "/login", Map.of("email", EMAIL, "password", "Wrong-" + PASSWORD));
            postJson(AuthRoutes.AUTH + "/login", Map.of("email", UNKNOWN_EMAIL, "password", PASSWORD));

            MockHttpServletResponse refreshed = mockMvc.perform(
                            post(AuthRoutes.AUTH + "/refresh").cookie(new Cookie(SessionCookies.NAME, sessionToken)))
                    .andExpect(status().isOk())
                    .andReturn()
                    .getResponse();
            secrets.add(accessToken(refreshed));
            secrets.add(refreshed.getCookie(SessionCookies.NAME).getValue());

            String orphanToken = jwtService.generateToken(UNKNOWN_USER_ID);
            secrets.add(orphanToken);
            mockMvc.perform(get("/api/findraco/user/me").header(HttpHeaders.AUTHORIZATION, "Bearer " + orphanToken))
                    .andExpect(status().isUnauthorized());

            postJson(AuthRoutes.AUTH + "/forgot-password", Map.of("email", EMAIL));
            postJson(AuthRoutes.AUTH + "/forgot-password", Map.of("email", UNKNOWN_EMAIL));
            // The raw reset token only ever travels by e-mail, and SMTP is off here; the stored row is re-keyed to a
            // token this test knows, so the rest of the flow runs with a secret it can look for in the logs.
            String resetToken = OpaqueTokens.generate();
            PasswordResetToken stored = tokenRepository.findAll().getFirst();
            stored.setTokenHash(OpaqueTokens.hash(resetToken));
            tokenRepository.save(stored);
            secrets.add(resetToken);

            mockMvc.perform(get(AuthRoutes.AUTH + "/reset-password/validate").param("token", resetToken))
                    .andExpect(status().isOk());
            assertThat(postJson(
                                    AuthRoutes.AUTH + "/reset-password",
                                    Map.of("token", resetToken, "password", NEW_PASSWORD))
                            .getStatus())
                    .isEqualTo(204);
            assertThat(postJson(AuthRoutes.AUTH + "/login", Map.of("email", EMAIL, "password", NEW_PASSWORD))
                            .getStatus())
                    .isEqualTo(200);

            lines = logs.lines();
        }

        assertThat(lines)
                .as("the flows were logged at all")
                .anyMatch(line -> line.startsWith("POST /api/findraco/auth/login 200 "))
                .anyMatch(line -> line.startsWith("POST /api/findraco/auth/reset-password 204 "));
        for (String secret : secrets) {
            assertThat(lines).noneMatch(line -> line.contains(secret));
        }
        assertThat(lines).noneMatch(line -> line.contains("reset-password?token="));
    }
}
