package com.lcs.findraco.auth.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import org.hibernate.validator.constraints.time.DurationMin;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

/** Signing key and lifetime of the access token; a bare number for the lifetime is milliseconds. */
@Validated
@ConfigurationProperties("app.jwt")
public record JwtProperties(
        @NotBlank String secretKey,

        @NotNull @DurationMin(seconds = 1) @DurationUnit(ChronoUnit.MILLIS)
        Duration expiration) {}
