package com.lcs.findraco.user.controller;

import com.lcs.findraco.auth.service.CustomUserDetails;
import com.lcs.findraco.shared.web.RequestHeaders;
import com.lcs.findraco.user.model.TimeZoneMode;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Keeps {@code users.time_zone} in step with the device: an authenticated request carrying a different,
 * valid {@code Time-Zone} header stores it while the user's mode is automatic. The signed-in user is
 * already loaded for the request, so a request whose header matches costs no query and no write.
 */
public class TimeZoneInterceptor implements HandlerInterceptor {

    private final UserService userService;

    public TimeZoneInterceptor(UserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String zone = request.getHeader(RequestHeaders.TIME_ZONE);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (zone == null
                || authentication == null
                || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            return true;
        }
        User user = details.getUser();
        if (user.getTimeZoneMode() == TimeZoneMode.AUTOMATIC && !zone.equals(user.getTimeZone())) {
            userService.adoptDeviceTimeZone(user.getId(), zone);
        }
        return true;
    }
}
