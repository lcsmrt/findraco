package com.lcs.findraco.transaction.model;

import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;
import org.jspecify.annotations.Nullable;

/** A member's part in a split. An EXACT split reads the amount; an EQUAL split computes it and ignores it. */
public record Share(User member, @Nullable BigDecimal amount) {}
