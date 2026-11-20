package com.lcs.findraco.mcp.response;

/** What {@code restore_deletion} answers: how many transactions came back. */
public record McpRestoredResponse(long restored) {}
