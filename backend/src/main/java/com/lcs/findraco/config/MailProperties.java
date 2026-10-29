package com.lcs.findraco.config;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** SMTP settings of the password reset email. A blank host means no sender: the link is logged instead. */
@Validated
@ConfigurationProperties("app.mail")
public record MailProperties(
        @NotNull String smtpHost,
        @Min(1) @Max(65535) int smtpPort,
        @NotNull String smtpUsername,
        @NotNull String smtpPassword,
        @NotBlank String from) {}
