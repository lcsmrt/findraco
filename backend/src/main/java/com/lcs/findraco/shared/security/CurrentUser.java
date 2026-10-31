package com.lcs.findraco.shared.security;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

/**
 * Injects the {@link AuthenticatedUser} into a controller handler, read from the principal the JWT
 * filter already placed in the security context. This is the account-level counterpart to the plan
 * context for endpoints that are not plan-scoped.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal(expression = "authenticatedUser()")
public @interface CurrentUser {}
