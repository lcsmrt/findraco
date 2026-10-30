package com.lcs.findraco;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.auth.config.CorsProperties;
import com.lcs.findraco.auth.config.JwtProperties;
import com.lcs.findraco.auth.config.MailExecutorProperties;
import com.lcs.findraco.auth.config.MailProperties;
import com.lcs.findraco.auth.config.SessionProperties;
import com.lcs.findraco.shared.config.AppProperties;
import com.lcs.findraco.shared.ratelimit.RateLimitProperties;
import com.lcs.findraco.transaction.config.ImportProperties;
import com.lcs.findraco.transaction.config.SeriesProperties;
import java.time.Duration;
import java.util.Base64;
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

    /** 48 random bytes, Base64-encoded: what {@code openssl rand -base64 48} prints. */
    private static final String STRONG_KEY = Base64.getEncoder().encodeToString(new byte[48]);

    private static final Map<String, String> VALID = Map.of(
            "app.url", "http://localhost:5173",
            "app.version", "1.0.0",
            "app.jwt.secret-key", STRONG_KEY,
            "app.jwt.expiration", "900000",
            "app.session.ttl", "P30D",
            "app.session.reuse-grace", "PT30S",
            "app.session.cookie-secure", "true",
            "app.cors.allowed-origins", "http://localhost:5173,https://findraco.app",
            "app.mail.smtp-port", "587",
            "app.mail.from", "no-reply@findraco.local");

    private static final Map<String, String> VALID_RATE_LIMITS = Map.ofEntries(
            Map.entry("app.series.horizon-months", "12"),
            Map.entry("app.series.top-up-cron", "0 30 3 * * *"),
            Map.entry("app.import.max-bytes", "1048576"),
            Map.entry("app.import.max-rows", "5000"),
            Map.entry("app.import.max-errors", "50"),
            Map.entry("app.mail.executor.core-size", "2"),
            Map.entry("app.mail.executor.max-size", "4"),
            Map.entry("app.mail.executor.queue-capacity", "100"),
            Map.entry("app.rate-limit.login-ip.capacity", "20"),
            Map.entry("app.rate-limit.login-ip.period", "PT1M"),
            Map.entry("app.rate-limit.login-email.capacity", "5"),
            Map.entry("app.rate-limit.login-email.period", "PT1M"),
            Map.entry("app.rate-limit.forgot-email.capacity", "3"),
            Map.entry("app.rate-limit.forgot-email.period", "PT1H"),
            Map.entry("app.rate-limit.forgot-ip.capacity", "10"),
            Map.entry("app.rate-limit.forgot-ip.period", "PT1H"),
            Map.entry("app.rate-limit.register-ip.capacity", "5"),
            Map.entry("app.rate-limit.register-ip.period", "PT1H"),
            Map.entry("app.rate-limit.import-user.capacity", "10"),
            Map.entry("app.rate-limit.import-user.period", "PT1H"));

    private static final Map<String, String> VALID_MAIL_STRINGS =
            Map.of("app.mail.smtp-host", "", "app.mail.smtp-username", "", "app.mail.smtp-password", "");

    @Configuration(proxyBeanMethods = false)
    @EnableConfigurationProperties({
        AppProperties.class,
        JwtProperties.class,
        SessionProperties.class,
        MailProperties.class,
        CorsProperties.class,
        MailExecutorProperties.class,
        RateLimitProperties.class,
        ImportProperties.class,
        SeriesProperties.class
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
    void sixteenByteJwtSecretFailsStartup() {
        String sixteenBytes = Base64.getEncoder().encodeToString(new byte[16]);

        assertStartupFailsOn(Map.of("app.jwt.secret-key", sixteenBytes), "app.jwt", "secretKeyStrongEnough");
    }

    @Test
    void jwtSecretThatIsNotBase64FailsStartup() {
        assertStartupFailsOn(Map.of("app.jwt.secret-key", "not base64 at all !!!"), "app.jwt", "secretKeyStrongEnough");
    }

    @Test
    void thirtyTwoByteJwtSecretStarts() {
        runWith(Map.of("app.jwt.secret-key", Base64.getEncoder().encodeToString(new byte[32])))
                .run(context -> assertThat(context).hasNotFailed());
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
    void mailExecutorWithoutThreadsFailsStartup() {
        assertStartupFailsOn(Map.of("app.mail.executor.core-size", "0"), "app.mail.executor", "coreSize");
    }

    @Test
    void emptyAllowedOriginsFailStartup() {
        assertStartupFailsOn(Map.of("app.cors.allowed-origins", ""), "app.cors", "allowedOrigins");
    }

    @Test
    void missingAppUrlFailsStartup() {
        assertStartupFailsOn(Map.of("app.url", ""), "app", "url");
    }

    @Test
    void zeroSeriesHorizonFailsStartup() {
        assertStartupFailsOn(Map.of("app.series.horizon-months", "0"), "app.series", "horizonMonths");
    }

    @Test
    void blankSeriesCronFailsStartup() {
        assertStartupFailsOn(Map.of("app.series.top-up-cron", ""), "app.series", "topUpCron");
    }

    @Test
    void zeroImportRowBoundFailsStartup() {
        assertStartupFailsOn(Map.of("app.import.max-rows", "0"), "app.import", "maxRows");
    }

    @Test
    void zeroRateLimitCapacityFailsStartup() {
        assertStartupFailsOn(Map.of("app.rate-limit.login-ip.capacity", "0"), "app.rate-limit", "loginIp.capacity");
    }

    @Test
    void missingRateLimitRuleFailsStartup() {
        runWithout("app.rate-limit.import-user.capacity", "app.rate-limit.import-user.period")
                .run(context -> assertThat(context).hasFailed());
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

    private static ApplicationContextRunner runWithout(String... keys) {
        Map<String, String> properties = new TreeMap<>(VALID);
        properties.putAll(VALID_MAIL_STRINGS);
        properties.putAll(VALID_RATE_LIMITS);
        for (String key : keys) {
            properties.remove(key);
        }
        return new ApplicationContextRunner()
                .withUserConfiguration(AllProperties.class)
                .withPropertyValues(properties.entrySet().stream()
                        .map(entry -> entry.getKey() + "=" + entry.getValue())
                        .toArray(String[]::new));
    }

    private static ApplicationContextRunner runWith(Map<String, String> overrides) {
        Map<String, String> properties = new TreeMap<>(VALID);
        properties.putAll(VALID_MAIL_STRINGS);
        properties.putAll(VALID_RATE_LIMITS);
        properties.putAll(overrides);
        String[] pairs = properties.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .toArray(String[]::new);

        return new ApplicationContextRunner()
                .withUserConfiguration(AllProperties.class)
                .withPropertyValues(pairs);
    }
}
