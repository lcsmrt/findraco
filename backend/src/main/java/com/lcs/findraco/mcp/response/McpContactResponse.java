package com.lcs.findraco.mcp.response;

import java.math.BigDecimal;

/** A contact as Claude reads it: who, what they owe and what credit they hold; one of the two is zero. */
public record McpContactResponse(String name, BigDecimal owed, BigDecimal credit) {}
