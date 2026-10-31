package com.lcs.findraco.category.model;

import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;

/** One member's monthly limit inside a category. */
public record MemberLimit(User member, BigDecimal amount) {}
