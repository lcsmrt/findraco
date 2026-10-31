package com.lcs.findraco.transaction.response;

/** What the caller may do with this transaction, from its role and who created the row. */
public record TransactionPermissionsResponse(boolean edit, boolean delete) {}
