package com.lcs.findraco.plan.response;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.plan.model.ContactBalance;
import java.math.BigDecimal;

/**
 * A contact with what it owes or, when its payments exceed that, its credit. One of {@code owed} and {@code credit}
 * is zero.
 */
public record ContactResponse(
        Long id, String name, boolean archived, BigDecimal owed, BigDecimal credit, long version) {

    public static ContactResponse from(Contact contact, ContactBalance balance) {
        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.isArchived(),
                balance.owed(),
                balance.credit(),
                contact.getVersion());
    }
}
