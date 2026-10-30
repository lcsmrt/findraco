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
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

/**
 * Forgot-password answers at once and identically for known and unknown e-mails; the message is delivered
 * afterwards, on the mail executor. The fake sender holds every send until the test lets it go, which a
 * synchronous send would turn into a hang.
 */
@Import(InMemoryMailConfig.class)
class ForgotPasswordAsyncIT extends AbstractIntegrationTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RecordingMailSender sender;

    @BeforeEach
    void resetSender() {
        sender.reset();
    }

    private MvcResult forgotPassword(String email) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("email", email))))
                .andExpect(status().isNoContent())
                .andReturn();
    }

    @Test
    void theResponseDoesNotWaitForTheMailServer() throws Exception {
        User user = fixtures.aUser();
        sender.release = new CountDownLatch(1);

        forgotPassword(user.getEmail());

        assertThat(sender.sent).isEmpty();
        sender.release.countDown();
        await().atMost(Duration.ofSeconds(10))
                .untilAsserted(() -> assertThat(sender.sent)
                        .singleElement()
                        .satisfies(message -> assertThat(message.getTo()).containsExactly(user.getEmail())));
        assertThat(sender.threads).singleElement().asString().startsWith("mail-");
    }

    @Test
    void knownAndUnknownEmailsGetTheSameAnswerAndOnlyTheKnownOneGetsMail() throws Exception {
        User user = fixtures.aUser();

        MvcResult unknown = forgotPassword("nobody-" + System.nanoTime() + "@test.com");
        MvcResult known = forgotPassword(user.getEmail());

        assertThat(known.getResponse().getStatus())
                .isEqualTo(unknown.getResponse().getStatus());
        assertThat(known.getResponse().getContentAsString())
                .isEqualTo(unknown.getResponse().getContentAsString());
        assertThat(known.getResponse().getHeaderNames())
                .containsAll(unknown.getResponse().getHeaderNames());
        await().atMost(Duration.ofSeconds(10)).until(() -> !sender.sent.isEmpty());
        assertThat(sender.sent)
                .singleElement()
                .satisfies(message -> assertThat(message.getTo()).containsExactly(user.getEmail()));
    }
}
