package com.lcs.findraco.dtos.request;

import com.lcs.findraco.models.FinancialTransactionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class FinancialTransactionCategoryRequestDto {

    @NotNull(message = "Type cannot be null.")
    private FinancialTransactionType type;

    @NotBlank(message = "Description cannot be blank.")
    private String description;

    private BigDecimal spendingLimit;

    private Long parentId;

    /**
     * Per-member limits, replaced as a set. Null keeps the stored entries unchanged; an empty list
     * removes them all.
     */
    @Valid
    private List<MemberLimitDto> memberLimits;

    public FinancialTransactionType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getSpendingLimit() {
        return spendingLimit;
    }

    public Long getParentId() {
        return parentId;
    }

    public List<MemberLimitDto> getMemberLimits() {
        return memberLimits;
    }
}
