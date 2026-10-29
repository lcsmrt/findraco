package com.lcs.findraco.user.controller;

import com.lcs.findraco.shared.security.PublicEndpoints;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class UserWebConfig {

    /** Registration is the one user endpoint reached before signing in. */
    @Bean
    public PublicEndpoints userPublicEndpoints() {
        return new PublicEndpoints(HttpMethod.POST, List.of(UserRoutes.USER));
    }
}
