package com.lcs.findraco.auth.controller;

import com.lcs.findraco.auth.request.ForgotPasswordRequest;
import com.lcs.findraco.auth.request.LoginRequest;
import com.lcs.findraco.auth.request.ResetPasswordRequest;
import com.lcs.findraco.auth.response.AuthenticationResponse;
import com.lcs.findraco.auth.response.PasswordResetTokenValidationResponse;
import com.lcs.findraco.auth.service.AuthenticationService;
import com.lcs.findraco.auth.service.PasswordResetService;
import com.lcs.findraco.auth.service.SessionService;
import com.lcs.findraco.auth.service.SessionService.IssuedSession;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication")
@RestController
@RequestMapping(AuthRoutes.AUTH)
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final PasswordResetService passwordResetService;
    private final SessionService sessionService;
    private final SessionCookies sessionCookies;

    public AuthenticationController(
            AuthenticationService authenticationService,
            PasswordResetService passwordResetService,
            SessionService sessionService,
            SessionCookies sessionCookies) {
        this.authenticationService = authenticationService;
        this.passwordResetService = passwordResetService;
        this.sessionService = sessionService;
        this.sessionCookies = sessionCookies;
    }

    @Operation(summary = "Authenticates a user; returns an access token and sets the session cookie")
    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody @Valid LoginRequest dto) {
        IssuedSession session = authenticationService.authenticate(dto);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        sessionCookies.issue(session.sessionToken()).toString())
                .body(new AuthenticationResponse(session.accessToken()));
    }

    @Operation(summary = "Renews the session from its cookie; returns a new access token and rotates the cookie")
    @SecurityRequirements
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refresh(
            @CookieValue(name = SessionCookies.NAME, required = false) String sessionToken) {
        IssuedSession session = sessionService.rotate(sessionToken);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        sessionCookies.issue(session.sessionToken()).toString())
                .body(new AuthenticationResponse(session.accessToken()));
    }

    @Operation(summary = "Signs out this device: revokes the cookie's session, if any, and clears the cookie")
    @SecurityRequirements
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = SessionCookies.NAME, required = false) String sessionToken) {
        sessionService.revoke(sessionToken);

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, sessionCookies.clear().toString())
                .build();
    }

    @Operation(summary = "Emails a password reset link; responds the same whether or not the account exists")
    @SecurityRequirements
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordRequest dto) {
        passwordResetService.requestReset(dto.email());

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Checks whether a password reset link is still valid, without consuming it")
    @SecurityRequirements
    @GetMapping("/reset-password/validate")
    public ResponseEntity<PasswordResetTokenValidationResponse> validateResetToken(@RequestParam String token) {
        boolean valid = passwordResetService.isTokenValid(token);

        return ResponseEntity.ok(new PasswordResetTokenValidationResponse(valid));
    }

    @Operation(summary = "Sets a new password using a password reset link")
    @SecurityRequirements
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest dto) {
        passwordResetService.resetPassword(dto);

        return ResponseEntity.noContent().build();
    }
}
