package com.lcs.findraco.user.controller;

import com.lcs.findraco.shared.security.PublicEndpoints;
import com.lcs.findraco.user.service.UserService;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UserWebConfig implements WebMvcConfigurer {

    private final UserService userService;

    public UserWebConfig(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new TimeZoneInterceptor(userService));
    }

    /** Registration is the one user endpoint reached before signing in. */
    @Bean
    public PublicEndpoints userPublicEndpoints() {
        return new PublicEndpoints(HttpMethod.POST, List.of(UserRoutes.USER));
    }
}
