package com.lcs.findraco.dtos.response;

public class PasswordResetTokenValidationResponseDto {

    private final boolean valid;

    public PasswordResetTokenValidationResponseDto(boolean valid) {
        this.valid = valid;
    }

    public boolean isValid() {
        return valid;
    }
}
