package com.lcs.findraco.user.controller;

import com.lcs.findraco.shared.security.AuthenticatedUser;
import com.lcs.findraco.shared.security.CurrentUser;
import com.lcs.findraco.shared.web.ClientIp;
import com.lcs.findraco.user.request.CreateUserRequest;
import com.lcs.findraco.user.request.UpdateTimeZoneRequest;
import com.lcs.findraco.user.request.UpdateUserRequest;
import com.lcs.findraco.user.response.UserResponse;
import com.lcs.findraco.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Users")
@RestController
@RequestMapping(UserRoutes.USER)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Creates a new user")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest dto, @ClientIp String ip) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(dto, ip));
    }

    @Operation(summary = "Returns the authenticated user's data")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(userService.getById(user.id()));
    }

    @Operation(summary = "Updates the authenticated user")
    @PutMapping
    public ResponseEntity<UserResponse> updateUser(
            @RequestBody @Valid UpdateUserRequest dto, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(userService.update(dto, user.id()));
    }

    @Operation(summary = "Pins a time zone, or hands the zone back to the device's Time-Zone header")
    @PatchMapping("/me/time-zone")
    public ResponseEntity<UserResponse> updateTimeZone(
            @RequestBody @Valid UpdateTimeZoneRequest dto, @CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(userService.updateTimeZone(dto, user.id()));
    }
}
