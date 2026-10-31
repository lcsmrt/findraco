package com.lcs.findraco.transaction.config;

import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Bounds of a bank file import. {@code maxBytes} is the file size, {@code maxRows} the data rows and
 * {@code maxErrors} the invalid lines listed in the answer.
 */
@Validated
@ConfigurationProperties("app.import")
public record ImportProperties(
        @Positive long maxBytes,
        @Positive int maxRows,
        @Positive int maxErrors) {}
