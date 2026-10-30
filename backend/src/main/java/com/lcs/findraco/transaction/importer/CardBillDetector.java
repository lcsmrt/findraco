package com.lcs.findraco.transaction.importer;

import java.util.List;
import org.springframework.stereotype.Component;

/** Recognises a credit-card bill, a format that is known and not imported yet. */
@Component
public class CardBillDetector {

    public boolean recognises(List<String> header) {
        List<String> columns = header.stream().map(HeaderNames::normalize).toList();
        return columns.contains("title") && columns.contains("amount") && !columns.contains("id");
    }
}
