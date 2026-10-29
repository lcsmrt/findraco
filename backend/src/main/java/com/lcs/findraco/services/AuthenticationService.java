package com.lcs.findraco.services;

import com.lcs.findraco.dtos.request.LoginRequestDto;
import com.lcs.findraco.security.CustomUserDetails;
import com.lcs.findraco.services.SessionService.IssuedSession;
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
    public IssuedSession authenticate(LoginRequestDto dto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

        return sessionService.open(((CustomUserDetails) authentication.getPrincipal()).getUser());
    }
}
