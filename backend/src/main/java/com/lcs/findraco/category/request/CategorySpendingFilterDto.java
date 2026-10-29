package com.lcs.findraco.category.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CategorySpendingFilterDto {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
