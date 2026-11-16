package com.lcs.findraco.shared.config;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import org.hibernate.validator.constraints.time.DurationMin;

/**
 * The OAuth clients that may connect: each is the exact URL of its Client ID Metadata Document, the only URLs the
 * server ever fetches. A fetched document is kept for {@code cacheTtl}.
 */
public record CimdProperties(
        @NotEmpty List<@NotNull URI> allowedClients,
        @NotNull @DurationMin(seconds = 1) Duration cacheTtl) {}
