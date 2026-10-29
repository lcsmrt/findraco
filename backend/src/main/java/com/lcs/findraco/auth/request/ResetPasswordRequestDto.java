package com.lcs.findraco.auth.request;

import jakarta.validation.constraints.NotBlank;

public class ResetPasswordRequestDto {

    @NotBlank(message = "Reset token cannot be blank.")
    private String token;

    @NotBlank(message = "User password cannot be blank.")
    private String password;

    public String getToken() {
        return token;
    }

    public String getPassword() {
        return password;
    }
}
