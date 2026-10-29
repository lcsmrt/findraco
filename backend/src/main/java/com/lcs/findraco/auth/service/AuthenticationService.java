package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.request.LoginRequest;
import com.lcs.findraco.auth.service.SessionService.IssuedSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final SessionService sessionService;

    public AuthenticationService(AuthenticationManager authenticationManager, SessionService sessionService) {
        this.authenticationManager = authenticationManager;
        this.sessionService = sessionService;
    }

    /** Checks the credentials and opens a new persistent session for the user. */
    @Transactional
    public IssuedSession authenticate(LoginRequest dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password()));

        return sessionService.open(((CustomUserDetails) authentication.getPrincipal()).getUser());
    }
}
