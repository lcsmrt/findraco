package com.lcs.findraco.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.InMemoryMailConfig;
import com.lcs.findraco.support.RecordingMailSender;
import com.lcs.findraco.user.model.User;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import tools.jackson.databind.ObjectMapper;

/** The reset e-mail is in the account's saved language, else the asking page's, else English. */
@Import(InMemoryMailConfig.class)
class PasswordResetLanguageIT extends AbstractIntegrationTest {

    private static final String ENGLISH_SUBJECT = "Reset your password — findraco";
    private static final String PORTUGUESE_SUBJECT = "Redefina a sua senha — findraco";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RecordingMailSender mailSender;

    @Autowired
    private JdbcTemplate jdbc;

    @BeforeEach
    void emptyMailbox() {
        mailSender.reset();
    }

    @Test
    void usesTheSavedLanguage() throws Exception {
        User user = fixtures.aUser();
        jdbc.update("UPDATE users SET language = 'pt-BR' WHERE id = ?", user.getId());

        forgotPassword(user.getEmail(), "en");

        SimpleMailMessage message = theOnlyMessageTo(user);
        assertThat(message.getSubject()).isEqualTo(PORTUGUESE_SUBJECT);
        assertThat(message.getText()).contains("Você pediu para redefinir a sua senha");
    }

    @Test
    void usesTheRequestLanguageWhenNoneIsSaved() throws Exception {
        User user = fixtures.aUser();

        forgotPassword(user.getEmail(), "pt-BR");

        SimpleMailMessage message = theOnlyMessageTo(user);
        assertThat(message.getSubject()).isEqualTo(PORTUGUESE_SUBJECT);
        assertThat(message.getText()).contains("Você pediu para redefinir a sua senha");
    }

    @Test
    void fallsBackToEnglish() throws Exception {
        User withoutLanguage = fixtures.aUser();
        User withUnknownLanguage = fixtures.aUser();
        User withLongLanguage = fixtures.aUser();

        forgotPassword(withoutLanguage.getEmail(), null);
        forgotPassword(withUnknownLanguage.getEmail(), "fr");
        forgotPassword(withLongLanguage.getEmail(), "x-" + "a".repeat(33));

        for (User user : new User[] {withoutLanguage, withUnknownLanguage, withLongLanguage}) {
            SimpleMailMessage message = theOnlyMessageTo(user);
            assertThat(message.getSubject()).isEqualTo(ENGLISH_SUBJECT);
            assertThat(message.getText()).contains("You asked to reset your findraco password.");
        }
    }

    private void forgotPassword(String email, String language) throws Exception {
        Map<String, String> body = new HashMap<>();
        body.put("email", email);
        if (language != null) {
            body.put("language", language);
        }
        mockMvc.perform(post(AuthRoutes.AUTH + "/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNoContent());
    }

    private SimpleMailMessage theOnlyMessageTo(User user) {
        await().until(() -> mailTo(user).length == 1);
        return mailTo(user)[0];
    }

    private SimpleMailMessage[] mailTo(User user) {
        return mailSender.sent.stream()
                .filter(message -> message.getTo() != null && message.getTo()[0].equals(user.getEmail()))
                .toArray(SimpleMailMessage[]::new);
    }
}
