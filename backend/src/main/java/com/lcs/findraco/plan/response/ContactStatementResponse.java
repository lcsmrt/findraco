package com.lcs.findraco.plan.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * A contact's statement: the balance first, then the months, newest first. Planned shares show but are outside the
 * balance. {@code owed} and {@code credit} repeat the contact's own so the page reads one object; one is zero.
 */
public record ContactStatementResponse(
        ContactResponse contact, BigDecimal owed, BigDecimal credit, List<ContactStatementMonthResponse> months) {}
