package com.lcs.findraco.shared.security;

import java.util.List;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpMethod;

/**
 * Paths a feature serves without authentication. Each feature declares its own as a bean, next to its
 * routes, and the security chain permits every one, so security never reaches into another feature.
 *
 * @param method the only method allowed without authentication, or null for every method
 */
public record PublicEndpoints(@Nullable HttpMethod method, List<String> patterns) {}
