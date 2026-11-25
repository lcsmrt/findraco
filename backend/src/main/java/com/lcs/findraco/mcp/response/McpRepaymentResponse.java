package com.lcs.findraco.mcp.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * What a payment from a contact did: the purchases it settled, the part that settled none, and where the contact
 * stands after it.
 *
 * @param unallocated the part of the payment that settled no purchase.
 * @param owed what the contact still owes.
 * @param credit what the contact holds in credit; one of {@code owed} and {@code credit} is zero.
 */
public record McpRepaymentResponse(
        String contact, List<McpSettledResponse> settled, BigDecimal unallocated, BigDecimal owed, BigDecimal credit) {}
