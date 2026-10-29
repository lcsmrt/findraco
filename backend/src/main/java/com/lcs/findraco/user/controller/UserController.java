package com.lcs.findraco.user.controller;

import com.lcs.findraco.shared.security.AuthenticatedUser;
import com.lcs.findraco.shared.security.CurrentUser;
import com.lcs.findraco.user.model.User;
import com.lcs.findraco.user.request.CreateUserRequest;
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
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid CreateUserRequest dto) {
        User createdUser = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(createdUser));
    }

    @Operation(summary = "Returns the authenticated user's data")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@CurrentUser AuthenticatedUser user) {
        return ResponseEntity.ok(UserResponse.from(userService.getById(user.id())));
    }

    @Operation(summary = "Updates the authenticated user")
    @PutMapping
    public ResponseEntity<UserResponse> updateUser(
            @RequestBody @Valid UpdateUserRequest dto, @CurrentUser AuthenticatedUser user) {
        User updatedUser = userService.update(dto, user.id());
        return ResponseEntity.ok(UserResponse.from(updatedUser));
    }
}
