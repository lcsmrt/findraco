package com.lcs.findraco.shared.ratelimit;

import static com.lcs.findraco.support.ProblemMatchers.problem;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.controller.UserRoutes;
import com.lcs.findraco.user.model.User;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

/**
 * Each limited route answers 429 with {@code Retry-After} once its limit is used up. The limits here are
 * tight; every test uses addresses and e-mails of its own because the buckets live as long as the context.
 */
@TestPropertySource(
        properties = {
            "app.rate-limit.login-ip.capacity=2",
            "app.rate-limit.login-email.capacity=3",
            "app.rate-limit.forgot-email.capacity=2",
            "app.rate-limit.forgot-ip.capacity=3",
            "app.rate-limit.register-ip.capacity=2",
            "app.rate-limit.import-user.capacity=2"
        })
class RateLimitIT extends AbstractIntegrationTest {

    private static final AtomicInteger SEQUENCE = new AtomicInteger();

    @Autowired
    private ObjectMapper objectMapper;

    private String uniqueEmail() {
        return "user-" + UUID.randomUUID() + "@test.com";
    }

    private String uniqueIp() {
        int n = SEQUENCE.incrementAndGet();
        return "10.9." + (n / 250) + "." + (n % 250 + 1);
    }

    private ResultActions login(String email, String ip) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/login")
                .with(from(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email, "password", "password"))));
    }

    private ResultActions forgotPassword(String email, String ip) throws Exception {
        return mockMvc.perform(post(AuthRoutes.AUTH + "/forgot-password")
                .with(from(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email))));
    }

    private ResultActions register(String email, String ip) throws Exception {
        return mockMvc.perform(post(UserRoutes.USER)
                .with(from(ip))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(
                        Map.of("name", "Test User", "email", email, "password", "password123"))));
    }

    private ResultActions importCsv(Plan plan, User user) throws Exception {
        MockMultipartFile file =
                new MockMultipartFile("file", "nubank.csv", "text/csv", "header\n".getBytes(StandardCharsets.UTF_8));
        return mockMvc.perform(multipart(TransactionRoutes.TRANSACTION + "/import", plan.getId())
                .file(file)
                .with(testAuthHelper.asUser(user)));
    }

    private static org.springframework.test.web.servlet.request.RequestPostProcessor from(String ip) {
        return request -> {
            request.setRemoteAddr(ip);
            return request;
        };
    }

    private static void assertRefused(ResultActions result) throws Exception {
        result.andExpect(problem(HttpStatus.TOO_MANY_REQUESTS, "rate-limited"));
        String retryAfter = result.andReturn().getResponse().getHeader("Retry-After");
        assertThat(retryAfter).isNotNull();
        assertThat(Long.parseLong(retryAfter)).isPositive();
    }

    @Test
    void loginIsLimitedPerAddress() throws Exception {
        String ip = uniqueIp();

        login(uniqueEmail(), ip);
        login(uniqueEmail(), ip);

        assertRefused(login(uniqueEmail(), ip));
        login(uniqueEmail(), uniqueIp()).andExpect(problem(HttpStatus.UNAUTHORIZED, "invalid-credentials"));
    }

    @Test
    void loginIsLimitedPerEmailAcrossAddresses() throws Exception {
        String email = uniqueEmail();

        for (int attempt = 0; attempt < 3; attempt++) {
            login(email, uniqueIp()).andExpect(problem(HttpStatus.UNAUTHORIZED, "invalid-credentials"));
        }

        assertRefused(login(email, uniqueIp()));
        assertRefused(login(email.toUpperCase(java.util.Locale.ROOT), uniqueIp()));
    }

    @Test
    void forgotPasswordIsLimitedPerEmail() throws Exception {
        String email = uniqueEmail();

        forgotPassword(email, uniqueIp());
        forgotPassword(email, uniqueIp());

        assertRefused(forgotPassword(email, uniqueIp()));
    }

    @Test
    void forgotPasswordIsLimitedPerAddress() throws Exception {
        String ip = uniqueIp();

        for (int attempt = 0; attempt < 3; attempt++) {
            forgotPassword(uniqueEmail(), ip);
        }

        assertRefused(forgotPassword(uniqueEmail(), ip));
    }

    @Test
    void registrationIsLimitedPerAddress() throws Exception {
        String ip = uniqueIp();

        register(uniqueEmail(), ip)
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status()
                        .isCreated());
        register(uniqueEmail(), ip)
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status()
                        .isCreated());

        assertRefused(register(uniqueEmail(), ip));
    }

    @Test
    void csvImportIsLimitedPerUser() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);
        User other = fixtures.aUser();
        Plan otherPlan = fixtures.aPlan(other);

        importCsv(plan, user);
        importCsv(plan, user);

        assertRefused(importCsv(plan, user));
        importCsv(otherPlan, other).andExpect(header().doesNotExist("Retry-After"));
    }

    @Test
    void refusalIsLoggedWithoutTheEmail() throws Exception {
        String email = uniqueEmail();
        for (int attempt = 0; attempt < 3; attempt++) {
            login(email, uniqueIp());
        }

        try (CapturedLogs logs = CapturedLogs.all()) {
            assertRefused(login(email, uniqueIp()));

            assertThat(logs.lines())
                    .anySatisfy(line -> assertThat(line).contains("Rate limit LOGIN_EMAIL exceeded"))
                    .noneSatisfy(line -> assertThat(line).containsIgnoringCase(email));
        }
    }
}
