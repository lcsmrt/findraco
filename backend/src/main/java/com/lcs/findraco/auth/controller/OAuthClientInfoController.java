package com.lcs.findraco.auth.controller;

import com.lcs.findraco.auth.response.OAuthClientInfoResponse;
import com.lcs.findraco.auth.service.OAuthClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "OAuth")
@RestController
public class OAuthClientInfoController {

    private final OAuthClientService clientService;

    public OAuthClientInfoController(OAuthClientService clientService) {
        this.clientService = clientService;
    }

    @Operation(summary = "Names an OAuth client for the consent page; 404 for a client outside the allowlist")
    @SecurityRequirements
    @GetMapping(OAuthRoutes.CLIENT_INFO)
    public ResponseEntity<OAuthClientInfoResponse> clientInfo(@RequestParam("client_id") String clientId) {
        return ResponseEntity.ok(clientService.clientInfo(clientId));
    }
}
