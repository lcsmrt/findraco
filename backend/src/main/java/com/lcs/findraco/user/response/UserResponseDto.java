package com.lcs.findraco.user.response;

import com.lcs.findraco.user.model.User;

public class UserResponseDto {
    private final Long id;
    private final String name;
    private final String email;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
