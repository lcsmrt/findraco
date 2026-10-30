package com.lcs.findraco.auth;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.auth.controller.SessionCookies;
import com.lcs.findraco.auth.model.PasswordResetToken;
import com.lcs.findraco.auth.repository.PasswordResetTokenRepository;
import com.lcs.findraco.auth.service.OpaqueTokens;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.InMemoryMailConfig;
import com.lcs.findraco.support.RecordingMailSender;
import com.lcs.findraco.user.model.User;
import jakarta.servlet.http.Cookie;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

/**
 * Drives the password recovery flow through the real endpoints. The in-memory mail sender captures the emailed
 * link: the raw token never touches the database, so the link is the one place a test can read it from.
 */
@Import(InMemoryMailConfig.class)
class PasswordRecoveryIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private RecordingMailSender mailSender;

    @BeforeEach
    void emptyMailbox() {
        mailSender.reset();
    }

    private ResultActions forgotPassword(String email) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email))));
    }

    private ResultActions resetPassword(String token, String password) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("token", token, "password", password))));
    }

    private ResultActions validate(String token) throws Exception {
        return mockMvc.perform(get(AuthRoutes.AUTH + "/reset-password/validate").param("token", token));
    }

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    private ResultActions refresh(String sessionCookie) throws Exception {
        return mockMvc.perform(
                post(AuthRoutes.AUTH + "/refresh").cookie(new Cookie(SessionCookies.NAME, sessionCookie)));
    }

    /** Signs in with the fixture password and returns the session cookie value. */
    private String sessionCookie(User user) throws Exception {
        return login(user.getEmail(), "password")
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getCookie(SessionCookies.NAME)
                .getValue();
    }

    /** Returns the tokens of every link emailed to {@code email}, waiting for the first one. */
    private List<String> emailedTokens(String email) {
        return mailSender.resetTokensSentTo(email, 1);
    }

    @Test
    void resetLinkSetsNewPasswordAndLoginUsesIt() throws Exception {
        User user = fixtures.aUser();

        forgotPassword(user.getEmail()).andExpect(status().isNoContent());
        String token = emailedTokens(user.getEmail()).get(0);

        validate(token).andExpect(status().isOk()).andExpect(jsonPath("$.valid").value(true));
        resetPassword(token, "new-password").andExpect(status().isNoContent());

        login(user.getEmail(), "new-password").andExpect(status().isOk());
        login(user.getEmail(), "password").andExpect(status().isUnauthorized());
    }

    @Test
    void unknownEmailGetsTheSameResponseAndNoEmail() throws Exception {
        User user = fixtures.aUser();

        String known = forgotPassword(user.getEmail())
                .andExpect(status().isNoContent())
                .andReturn()
                .getResponse()
                .getContentAsString();
        forgotPassword("nobody-" + System.nanoTime() + "@test.com")
                .andExpect(status().isNoContent())
                .andExpect(content().string(known));

        emailedTokens(user.getEmail());
        await().during(Duration.ofMillis(300))
                .atMost(Duration.ofSeconds(5))
                .untilAsserted(() -> assertThat(mailSender.sent)
                        .singleElement()
                        .satisfies(message -> assertThat(message.getTo()).containsExactly(user.getEmail())));
        assertThat(tokenRepository.count()).isEqualTo(1);
    }

    @Test
    void tokenIsSingleUse() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        resetPassword(token, "new-password").andExpect(status().isNoContent());

        validate(token).andExpect(status().isOk()).andExpect(jsonPath("$.valid").value(false));
        resetPassword(token, "another-password")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "reset-token-invalid"));
    }

    @Test
    void newRequestInvalidatesPreviousLinks() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String first = emailedTokens(user.getEmail()).get(0);
        forgotPassword(user.getEmail());
        List<String> tokens = mailSender.resetTokensSentTo(user.getEmail(), 2);
        String second = tokens.stream()
                .filter(token -> !token.equals(first))
                .findFirst()
                .orElseThrow();

        validate(first).andExpect(jsonPath("$.valid").value(false));
        validate(second).andExpect(jsonPath("$.valid").value(true));
        resetPassword(first, "new-password")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "reset-token-invalid"));
    }

    @Test
    void expiredTokenIsRejected() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        PasswordResetToken stored =
                tokenRepository.findByTokenHash(OpaqueTokens.hash(token)).orElseThrow();
        stored.setExpiresAt(fixtures.now().minusSeconds(60));
        tokenRepository.save(stored);

        validate(token).andExpect(jsonPath("$.valid").value(false));
        resetPassword(token, "new-password")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "reset-token-invalid"));
    }

    @Test
    void storesOnlyTheTokenHash() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        assertThat(tokenRepository.findAll())
                .singleElement()
                .satisfies(stored ->
                        assertThat(stored.getTokenHash()).isNotEqualTo(token).hasSize(64));
    }

    // SESS-11: a completed reset ends every session of that user, and only that user.

    @Test
    void resetRevokesEverySessionOfTheUserAndNoOtherUsers() throws Exception {
        User user = fixtures.aUser();
        User other = fixtures.aUser();
        String laptop = sessionCookie(user);
        String phone = sessionCookie(user);
        String otherUsersDevice = sessionCookie(other);
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        resetPassword(token, "new-password").andExpect(status().isNoContent());

        refresh(laptop).andExpect(status().isUnauthorized());
        refresh(phone).andExpect(status().isUnauthorized());
        refresh(otherUsersDevice).andExpect(status().isOk());
    }

    @Test
    void failedResetRevokesNoSession() throws Exception {
        User user = fixtures.aUser();
        String device = sessionCookie(user);

        resetPassword(OpaqueTokens.generate(), "new-password")
                .andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "reset-token-invalid"));

        refresh(device).andExpect(status().isOk());
    }

    @Test
    void blankPasswordIsRejected() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        resetPassword(token, "").andExpect(problem(HttpStatus.UNPROCESSABLE_CONTENT, "validation-failed"));
        validate(token).andExpect(jsonPath("$.valid").value(true));
    }
}
