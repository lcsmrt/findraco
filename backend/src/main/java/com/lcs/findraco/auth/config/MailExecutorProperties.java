package com.lcs.findraco.auth.config;

import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** The bounded pool that sends e-mail off the request thread: at most {@code maxSize} sends at once, {@code queueCapacity} waiting. */
@Validated
@ConfigurationProperties("app.mail.executor")
public record MailExecutorProperties(
        @Min(1) int coreSize, @Min(1) int maxSize, @Min(0) int queueCapacity) {}
