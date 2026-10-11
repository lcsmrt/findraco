package com.lcs.findraco.utils;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DateUtils {
    public void checkIfStartDateIsBeforeEndDate(LocalDate startDate, LocalDate endDate) {
        if (endDate == null) return;

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }
    }
}
