package com.lcs.findraco.transaction.response;

import java.util.List;

/** What a repayment adds to its transaction: the contact it came from and the shares it settles. */
public record RepaymentResponse(Long contactId, String contactName, List<RepaymentAllocationResponse> allocations) {}
