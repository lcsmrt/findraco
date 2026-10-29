package com.lcs.findraco.config;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategySnakeCaseImpl;

/**
 * Snake-cases quoted identifiers too. Hibernate 7 quotes every identifier before physical naming
 * when {@code globally_quoted_identifiers} is on, and its snake-case strategy leaves quoted names
 * as written, so {@code spendingLimit} would no longer map to {@code spending_limit}.
 */
public class QuotedSnakeCaseNamingStrategy extends PhysicalNamingStrategySnakeCaseImpl {

    @Override
    protected Identifier quotedIdentifier(Identifier quotedName) {
        return Identifier.toIdentifier(unquotedIdentifier(quotedName).getText(), true);
    }
}
