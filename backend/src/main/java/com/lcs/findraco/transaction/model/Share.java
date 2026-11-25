package com.lcs.findraco.transaction.model;

import com.lcs.findraco.plan.model.Contact;
import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/**
 * A part in a split, going to a plan member or to a contact, never both. An EXACT split reads the amount; an EQUAL
 * split computes it and ignores it.
 */
public record Share(
        @Nullable User member,
        @Nullable Contact contact,
        @Nullable BigDecimal amount) {

    public Share {
        if ((member == null) == (contact == null)) {
            throw new IllegalStateException("A share goes to a member or to a contact, not both and not neither.");
        }
    }

    /** A member's share. */
    public Share(User member, @Nullable BigDecimal amount) {
        this(member, null, amount);
    }

    /** A contact's share. */
    public static Share ofContact(Contact contact, @Nullable BigDecimal amount) {
        return new Share(null, contact, amount);
    }

    public boolean isContact() {
        return contact != null;
    }

    /** Who the share goes to, as one key: a member and a contact of the same number are not the same party. */
    public String key() {
        return member != null ? "member:" + member.getId() : "contact:" + contact.getId();
    }

    public Share withAmount(@Nullable BigDecimal newAmount) {
        return new Share(member, contact, newAmount);
    }
}
