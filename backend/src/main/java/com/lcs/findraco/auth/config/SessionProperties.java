package com.lcs.findraco.auth.config;

import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import org.hibernate.validator.constraints.time.DurationMin;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Session lifetime without a renewal, the window in which a replaced session token still renews, and
 * whether the session cookie is sent over HTTPS only.
 */
@Validated
@ConfigurationProperties("app.session")
public record SessionProperties(
        @NotNull @DurationMin(seconds = 1) Duration ttl,
        @NotNull @DurationMin(seconds = 0) Duration reuseGrace,
        boolean cookieSecure) {}
