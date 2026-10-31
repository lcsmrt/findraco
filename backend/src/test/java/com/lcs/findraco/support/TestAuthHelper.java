package com.lcs.findraco.support;

import com.lcs.findraco.auth.service.JwtService;
import com.lcs.findraco.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@TestComponent
public class TestAuthHelper {

    @Autowired
    private JwtService jwtService;

    public String bearerFor(User user) {
        return "Bearer " + jwtService.generateToken(user.getId());
    }

    public RequestPostProcessor asUser(User user) {
        return request -> {
            request.addHeader(HttpHeaders.AUTHORIZATION, bearerFor(user));
            return request;
        };
    }
}
