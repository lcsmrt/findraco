package com.lcs.findraco.category.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CategorySpendingFilter(
        @NotNull LocalDate startDate, @NotNull LocalDate endDate) {}
