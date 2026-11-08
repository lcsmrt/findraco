package com.lcs.findraco.mcp.response;

/** What a write tool returns: the transaction as stored and the name of the plan it is in. */
public record McpSavedTransactionResponse(String plan, McpTransactionResponse transaction) {}
