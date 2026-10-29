package com.lcs.findraco.utils;

import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class DateUtils {
    public void checkIfStartDateIsBeforeEndDate(LocalDate startDate, LocalDate endDate) {
        if (endDate == null) return;

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }
    }
}
