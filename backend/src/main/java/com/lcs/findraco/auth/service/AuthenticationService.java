package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.request.LoginRequest;
import com.lcs.findraco.auth.service.SessionService.IssuedSession;
import com.lcs.findraco.shared.ratelimit.RateLimit;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.lcs.findraco.shared.security.PasswordNormalizer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final SessionService sessionService;
    private final RateLimiter rateLimiter;

    public AuthenticationService(
            AuthenticationManager authenticationManager, SessionService sessionService, RateLimiter rateLimiter) {
        this.authenticationManager = authenticationManager;
        this.sessionService = sessionService;
        this.rateLimiter = rateLimiter;
    }

    /**
     * Checks the credentials and opens a new persistent session for the user. Attempts are limited per
     * client address and per e-mail, so a password cannot be guessed from many addresses either.
     */
    @Transactional
    public IssuedSession authenticate(LoginRequest dto, String ip) {
        rateLimiter.consume(RateLimit.LOGIN_IP, ip);
        rateLimiter.consume(RateLimit.LOGIN_EMAIL, dto.email());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), PasswordNormalizer.normalize(dto.password())));

        return sessionService.open(((CustomUserDetails) authentication.getPrincipal()).getUser());
    }
}
