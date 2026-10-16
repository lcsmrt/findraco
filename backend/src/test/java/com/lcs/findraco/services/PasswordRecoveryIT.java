package com.lcs.findraco.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lcs.findraco.models.PasswordResetToken;
import com.lcs.findraco.models.User;
import com.lcs.findraco.repositories.PasswordResetTokenRepository;
import com.lcs.findraco.security.OpaqueTokens;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.utils.ApiRoutes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Drives the password recovery flow through the real endpoints. {@link EmailService} is mocked
 * only to capture the emailed link — the raw token never touches the database, so the link is
 * the one place a test can read it from.
 */
class PasswordRecoveryIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @MockitoBean
    private EmailService emailService;

    private ResultActions forgotPassword(String email) throws Exception {
        return mockMvc.perform(post(ApiRoutes.AUTH + "/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email))));
    }

    private ResultActions resetPassword(String token, String password) throws Exception {
        return mockMvc.perform(post(ApiRoutes.AUTH + "/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("token", token, "password", password))));
    }

    private ResultActions validate(String token) throws Exception {
        return mockMvc.perform(get(ApiRoutes.AUTH + "/reset-password/validate").param("token", token));
    }

    private ResultActions login(String email, String password) throws Exception {
        return mockMvc.perform(post(ApiRoutes.AUTH + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", password))));
    }

    /** Returns the tokens of every link emailed to {@code email}, oldest first. */
    private List<String> emailedTokens(String email) {
        ArgumentCaptor<String> url = ArgumentCaptor.forClass(String.class);
        verify(emailService, Mockito.atLeastOnce()).sendPasswordResetEmail(eq(email), url.capture());
        return url.getAllValues().stream()
                .map(link -> link.substring(link.indexOf("token=") + "token=".length()))
                .toList();
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
                .andReturn().getResponse().getContentAsString();
        forgotPassword("nobody-" + System.nanoTime() + "@test.com")
                .andExpect(status().isNoContent())
                .andExpect(content().string(known));

        verify(emailService, never()).sendPasswordResetEmail(Mockito.argThat(to -> !to.equals(user.getEmail())), anyString());
        assertThat(tokenRepository.count()).isEqualTo(1);
    }

    @Test
    void tokenIsSingleUse() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        resetPassword(token, "new-password").andExpect(status().isNoContent());

        validate(token).andExpect(status().isOk()).andExpect(jsonPath("$.valid").value(false));
        resetPassword(token, "another-password").andExpect(status().isBadRequest());
    }

    @Test
    void newRequestInvalidatesPreviousLinks() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        forgotPassword(user.getEmail());
        List<String> tokens = emailedTokens(user.getEmail());

        validate(tokens.get(0)).andExpect(jsonPath("$.valid").value(false));
        validate(tokens.get(1)).andExpect(jsonPath("$.valid").value(true));
        resetPassword(tokens.get(0), "new-password").andExpect(status().isBadRequest());
    }

    @Test
    void expiredTokenIsRejected() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        PasswordResetToken stored = tokenRepository.findByTokenHash(OpaqueTokens.hash(token)).orElseThrow();
        stored.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        tokenRepository.save(stored);

        validate(token).andExpect(jsonPath("$.valid").value(false));
        resetPassword(token, "new-password").andExpect(status().isBadRequest());
    }

    @Test
    void storesOnlyTheTokenHash() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        assertThat(tokenRepository.findAll())
                .singleElement()
                .satisfies(stored -> assertThat(stored.getTokenHash()).isNotEqualTo(token).hasSize(64));
    }

    @Test
    void blankPasswordIsRejected() throws Exception {
        User user = fixtures.aUser();
        forgotPassword(user.getEmail());
        String token = emailedTokens(user.getEmail()).get(0);

        resetPassword(token, "").andExpect(status().isBadRequest());
        validate(token).andExpect(jsonPath("$.valid").value(true));
    }
}
