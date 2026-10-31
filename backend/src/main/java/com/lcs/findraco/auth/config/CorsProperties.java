package com.lcs.findraco.auth.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** Origins allowed to call the API from a browser, with credentials. */
@Validated
@ConfigurationProperties("app.cors")
public record CorsProperties(@NotEmpty List<@NotBlank String> allowedOrigins) {}
