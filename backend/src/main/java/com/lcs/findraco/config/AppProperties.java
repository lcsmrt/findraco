package com.lcs.findraco.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** Base URL of the SPA (used in links sent by email) and the build version. */
@Validated
@ConfigurationProperties("app")
public record AppProperties(@NotBlank String url, @NotBlank String version) {}
