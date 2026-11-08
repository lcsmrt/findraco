package com.lcs.findraco.auth.config;

import com.lcs.findraco.auth.service.CustomUserDetails;
import com.lcs.findraco.shared.ratelimit.RateLimit;
import com.lcs.findraco.shared.ratelimit.RateLimitedException;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.lcs.findraco.shared.security.EmailNormalizer;
import com.lcs.findraco.shared.security.PasswordNormalizer;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

/**
 * The authorization server's sign-in: the app's credentials, normalised as the app's login does, under the same
 * login limits. The signed-in principal is the user id as text: it is stored with every grant, so it carries no
 * entity, and the grant's principal name is the user id a password reset revokes by.
 */
final class OAuthLoginAuthenticationProvider implements AuthenticationProvider {

    private final AuthenticationProvider credentials;
    private final RateLimiter rateLimiter;

    OAuthLoginAuthenticationProvider(AuthenticationProvider credentials, RateLimiter rateLimiter) {
        this.credentials = credentials;
        this.rateLimiter = rateLimiter;
    }

    /** A sign-in over the login limits; the failure handler sends the user back to the form saying so. */
    static final class LoginRateLimitedException extends AuthenticationException {
        LoginRateLimitedException() {
            super("Too many sign-in attempts.");
        }
    }

    @Override
    public Authentication authenticate(Authentication authentication) {
        String email = EmailNormalizer.normalize(authentication.getName());
        String ip = authentication.getDetails() instanceof WebAuthenticationDetails details
                ? details.getRemoteAddress()
                : "";
        try {
            rateLimiter.consume(RateLimit.LOGIN_IP, ip);
            rateLimiter.consume(RateLimit.LOGIN_EMAIL, email);
        } catch (RateLimitedException limited) {
            throw new LoginRateLimitedException();
        }

        Authentication result = credentials.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(
                email, PasswordNormalizer.normalize(String.valueOf(authentication.getCredentials()))));
        if (result == null || !(result.getPrincipal() instanceof CustomUserDetails user)) {
            throw new BadCredentialsException("Bad credentials");
        }
        UsernamePasswordAuthenticationToken signedIn = UsernamePasswordAuthenticationToken.authenticated(
                String.valueOf(user.authenticatedUser().id()), null, result.getAuthorities());
        signedIn.setDetails(authentication.getDetails());
        return signedIn;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
