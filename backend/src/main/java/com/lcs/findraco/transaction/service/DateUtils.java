package com.lcs.findraco.transaction.service;

import com.lcs.findraco.transaction.exception.TransactionExceptions;
import java.time.LocalDate;
import org.springframework.stereotype.Component;

@Component
public class DateUtils {
    public void checkIfStartDateIsBeforeEndDate(LocalDate startDate, LocalDate endDate) {
        if (endDate == null) return;

        if (startDate.isAfter(endDate)) {
            throw new TransactionExceptions.PeriodStartAfterEndException();
        }
    }
}
