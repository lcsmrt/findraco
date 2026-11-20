package com.lcs.findraco.transaction.response;

import com.lcs.findraco.transaction.model.TransactionKind;

/** A row with no kind whose bank text looks like a neutral movement, and the kind the review proposes for it. */
public record NeutralCandidateResponse(TransactionResponse transaction, TransactionKind proposedKind) {}
