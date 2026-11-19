package com.lcs.findraco.mcp.response;

/** What {@code delete_transaction} answers: the id to restore it by, what it removed and how many rows. */
public record McpDeletionResponse(long deletionId, String description, long count) {}
