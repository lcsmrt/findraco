package com.lcs.findraco.transaction.service;

import com.lcs.findraco.user.model.User;
import java.math.BigDecimal;

/** A resolved (member, share) pair, produced by {@link SplitResolver} and stamped onto transactions. */
record ResolvedParticipant(User member, BigDecimal shareAmount) {}
