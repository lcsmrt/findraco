package com.lcs.findraco.controllers;

import com.lcs.findraco.dtos.request.LoginRequestDto;
import com.lcs.findraco.dtos.response.AuthenticationResponseDto;
import com.lcs.findraco.services.AuthenticationService;
import com.lcs.findraco.utils.ApiRoutes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication")
@RestController
@RequestMapping(ApiRoutes.AUTH)
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Operation(summary = "Authenticates a user")
    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDto> login(@RequestBody @Valid LoginRequestDto dto) {
        String token = authenticationService.authenticate(dto);

        return ResponseEntity.ok(new AuthenticationResponseDto(token));
    }
}
