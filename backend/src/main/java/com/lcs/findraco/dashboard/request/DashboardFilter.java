package com.lcs.findraco.dashboard.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DashboardFilter(
        @NotNull LocalDate startDate, @NotNull LocalDate endDate, Long memberId) {}
