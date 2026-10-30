package com.lcs.findraco.shared.ratelimit;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** One rule per {@link RateLimit}; a missing rule fails startup instead of leaving a route unlimited. */
@Validated
@ConfigurationProperties("app.rate-limit")
public record RateLimitProperties(
        @NotNull @Valid RateLimitRule loginIp,
        @NotNull @Valid RateLimitRule loginEmail,
        @NotNull @Valid RateLimitRule forgotEmail,
        @NotNull @Valid RateLimitRule forgotIp,
        @NotNull @Valid RateLimitRule registerIp,
        @NotNull @Valid RateLimitRule importUser) {

    public RateLimitRule rule(RateLimit limit) {
        return switch (limit) {
            case LOGIN_IP -> loginIp;
            case LOGIN_EMAIL -> loginEmail;
            case FORGOT_EMAIL -> forgotEmail;
            case FORGOT_IP -> forgotIp;
            case REGISTER_IP -> registerIp;
            case IMPORT_USER -> importUser;
        };
    }
}
