package com.lcs.findraco.auth.response;

/** What the consent page shows about a client: its name and the host it sends the user back to. */
public record OAuthClientInfoResponse(String name, String redirectHost) {}
