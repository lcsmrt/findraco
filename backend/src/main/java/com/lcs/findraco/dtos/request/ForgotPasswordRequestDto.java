package com.lcs.findraco.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ForgotPasswordRequestDto {

    @NotBlank(message = "User email cannot be blank.")
    @Email(message = "Invalid email format.")
    private String email;

    public String getEmail() {
        return email;
    }
}
