package com.lcs.findraco.auth.service;

import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService, UserDetailsPasswordService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Throw Spring Security's own UsernameNotFoundException (not a custom one) so that
        // DaoAuthenticationProvider's hideUserNotFoundExceptions (on by default) converts it to a
        // BadCredentialsException — identical 401 to a wrong password. A custom exception would
        // instead be wrapped in InternalAuthenticationServiceException (HTTP 500) and, by responding
        // differently, would let a caller enumerate which emails are registered.
        User user = userService.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found."));

        return new CustomUserDetails(user);
    }

    /** Called by the authentication provider after a login whose stored hash is older than the current encoder. */
    @Override
    public UserDetails updatePassword(UserDetails user, String newPassword) {
        long userId = ((CustomUserDetails) user).authenticatedUser().id();

        return new CustomUserDetails(userService.replacePasswordHash(userId, newPassword));
    }
}
