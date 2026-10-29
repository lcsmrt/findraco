package com.lcs.findraco;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.auth.config.CorsProperties;
import com.lcs.findraco.auth.config.JwtProperties;
import com.lcs.findraco.auth.config.MailProperties;
import com.lcs.findraco.auth.config.SessionProperties;
import com.lcs.findraco.shared.config.AppProperties;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.context.properties.bind.validation.BindValidationException;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

/** Every {@code app.*} record refuses to start the application on a missing or out-of-range value. */
class ConfigurationPropertiesTest {

    private static final Map<String, String> VALID = Map.of(
            "app.url", "http://localhost:5173",
            "app.version", "1.0.0",
            "app.jwt.secret-key", "secret",
            "app.jwt.expiration", "900000",
            "app.session.ttl", "P30D",
            "app.session.reuse-grace", "PT30S",
            "app.session.cookie-secure", "true",
            "app.cors.allowed-origins", "http://localhost:5173,https://findraco.app",
            "app.mail.smtp-port", "587",
            "app.mail.from", "no-reply@findraco.local");

    private static final Map<String, String> VALID_MAIL_STRINGS =
            Map.of("app.mail.smtp-host", "", "app.mail.smtp-username", "", "app.mail.smtp-password", "");

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties({
        AppProperties.class,
        JwtProperties.class,
        SessionProperties.class,
        MailProperties.class,
        CorsProperties.class
    })
    static class AllProperties {}

    @Test
    void validValuesBindIntoEveryRecord() {
        runWith(Map.of()).run(context -> {
            assertThat(context).hasNotFailed();
            assertThat(context.getBean(JwtProperties.class).expiration()).isEqualTo(Duration.ofMinutes(15));
            assertThat(context.getBean(SessionProperties.class).ttl()).isEqualTo(Duration.ofDays(30));
            assertThat(context.getBean(CorsProperties.class).allowedOrigins())
                    .isEqualTo(List.of("http://localhost:5173", "https://findraco.app"));
            assertThat(context.getBean(MailProperties.class).smtpPort()).isEqualTo(587);
            assertThat(context.getBean(AppProperties.class).url()).isEqualTo("http://localhost:5173");
        });
    }

    @Test
    void missingJwtSecretFailsStartup() {
        assertStartupFailsOn(Map.of("app.jwt.secret-key", ""), "app.jwt", "secretKey");
    }

    @Test
    void zeroJwtExpirationFailsStartup() {
        assertStartupFailsOn(Map.of("app.jwt.expiration", "0"), "app.jwt", "expiration");
    }

    @Test
    void negativeSessionReuseGraceFailsStartup() {
        assertStartupFailsOn(Map.of("app.session.reuse-grace", "-PT1S"), "app.session", "reuseGrace");
    }

    @Test
    void outOfRangeSmtpPortFailsStartup() {
        assertStartupFailsOn(Map.of("app.mail.smtp-port", "0"), "app.mail", "smtpPort");
    }

    @Test
    void emptyAllowedOriginsFailStartup() {
        assertStartupFailsOn(Map.of("app.cors.allowed-origins", ""), "app.cors", "allowedOrigins");
    }

    @Test
    void missingAppUrlFailsStartup() {
        assertStartupFailsOn(Map.of("app.url", ""), "app", "url");
    }

    private static void assertStartupFailsOn(Map<String, String> overrides, String prefix, String field) {
        runWith(overrides).run(context -> {
            assertThat(context).hasFailed();
            assertThat(context.getStartupFailure())
                    .rootCause()
                    .isInstanceOfSatisfying(
                            BindValidationException.class,
                            failure -> assertThat(failure.getValidationErrors()
                                            .getName()
                                            .toString())
                                    .isEqualTo(prefix))
                    .hasMessageContaining("on field '" + field + "'");
        });
    }

    private static ApplicationContextRunner runWith(Map<String, String> overrides) {
        Map<String, String> properties = new TreeMap<>(VALID);
        properties.putAll(VALID_MAIL_STRINGS);
        properties.putAll(overrides);
        String[] pairs = properties.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .toArray(String[]::new);

        return new ApplicationContextRunner()
                .withUserConfiguration(AllProperties.class)
                .withPropertyValues(pairs);
    }
}
