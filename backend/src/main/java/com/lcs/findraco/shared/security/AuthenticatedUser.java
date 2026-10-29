package com.lcs.findraco.shared.security;

/** The caller of a request: only the id, so a service reloads what it needs inside its own transaction. */
public record AuthenticatedUser(long id) {}
