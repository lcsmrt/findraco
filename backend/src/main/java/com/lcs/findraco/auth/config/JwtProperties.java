package com.lcs.findraco.auth.config;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import org.hibernate.validator.constraints.time.DurationMin;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.convert.DurationUnit;
import org.springframework.validation.annotation.Validated;

/**
 * Signing key and lifetime of the access token; a bare number for the lifetime is milliseconds. The key is
 * the Base64 text of at least {@value #MIN_KEY_BYTES} random bytes ({@code openssl rand -base64 48}); the
 * application refuses to start with anything weaker.
 */
@Validated
@ConfigurationProperties("app.jwt")
public record JwtProperties(
        @NotBlank String secretKey,

        @NotNull @DurationMin(seconds = 1) @DurationUnit(ChronoUnit.MILLIS)
        Duration expiration) {

    static final int MIN_KEY_BYTES = 32;

    /** The key as the bytes that sign tokens: the Base64 text decoded, never the text itself. */
    public byte[] secretKeyBytes() {
        return Base64.getDecoder().decode(secretKey);
    }

    @AssertTrue(message = "must be Base64 text that decodes to at least 32 bytes")
    boolean isSecretKeyStrongEnough() {
        if (secretKey == null) {
            return true;
        }
        try {
            return secretKeyBytes().length >= MIN_KEY_BYTES;
        } catch (IllegalArgumentException notBase64) {
            return false;
        }
    }
}
