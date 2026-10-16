package com.lcs.findraco.controllers;

import com.lcs.findraco.dtos.request.ForgotPasswordRequestDto;
import com.lcs.findraco.dtos.request.LoginRequestDto;
import com.lcs.findraco.dtos.request.ResetPasswordRequestDto;
import com.lcs.findraco.dtos.response.AuthenticationResponseDto;
import com.lcs.findraco.dtos.response.PasswordResetTokenValidationResponseDto;
import com.lcs.findraco.security.SessionCookies;
import com.lcs.findraco.services.AuthenticationService;
import com.lcs.findraco.services.PasswordResetService;
import com.lcs.findraco.services.SessionService.IssuedSession;
import com.lcs.findraco.utils.ApiRoutes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication")
@RestController
@RequestMapping(ApiRoutes.AUTH)
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final PasswordResetService passwordResetService;
    private final SessionCookies sessionCookies;

    public AuthenticationController(
            AuthenticationService authenticationService,
            PasswordResetService passwordResetService,
            SessionCookies sessionCookies
    ) {
        this.authenticationService = authenticationService;
        this.passwordResetService = passwordResetService;
        this.sessionCookies = sessionCookies;
    }

    @Operation(summary = "Authenticates a user; returns an access token and sets the session cookie")
    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> login(@RequestBody @Valid LoginRequestDto dto) {
        IssuedSession session = authenticationService.authenticate(dto);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookies.issue(session.sessionToken()).toString())
                .body(new AuthenticationResponseDto(session.accessToken()));
    }

    @Operation(summary = "Emails a password reset link; responds the same whether or not the account exists")
    @SecurityRequirements
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDto dto) {
        passwordResetService.requestReset(dto.getEmail());

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Checks whether a password reset link is still valid, without consuming it")
    @SecurityRequirements
    @GetMapping("/reset-password/validate")
    public ResponseEntity<PasswordResetTokenValidationResponseDto> validateResetToken(@RequestParam String token) {
        boolean valid = passwordResetService.isTokenValid(token);

        return ResponseEntity.ok(new PasswordResetTokenValidationResponseDto(valid));
    }

    @Operation(summary = "Sets a new password using a password reset link")
    @SecurityRequirements
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequestDto dto) {
        passwordResetService.resetPassword(dto);

        return ResponseEntity.noContent().build();
    }
}
