package com.lcs.findraco.user.request;

import com.lcs.findraco.user.model.TimeZoneMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** {@code zone} is the IANA id to pin; it is required for {@code PINNED} and ignored for {@code AUTOMATIC}. */
public record UpdateTimeZoneRequest(
        @NotNull(message = "Mode cannot be null.") TimeZoneMode mode,

        @Size(max = 64, message = "Zone cannot exceed 64 characters.")
        String zone) {}
