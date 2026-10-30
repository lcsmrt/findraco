package com.lcs.findraco.user.response;

import com.lcs.findraco.user.model.TimeZoneMode;
import com.lcs.findraco.user.model.User;

public record UserResponse(Long id, String name, String email, String timeZone, TimeZoneMode timeZoneMode) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(), user.getName(), user.getEmail(), user.getTimeZone(), user.getTimeZoneMode());
    }
}
