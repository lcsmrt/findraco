package com.lcs.findraco.shared.error;

import org.jspecify.annotations.Nullable;

/**
 * One failed constraint of a 422 {@code validation-failed} problem. {@code code} is the constraint's
 * simple name ({@code NotBlank}, {@code Size}), which clients translate; {@code message} is a fallback.
 * {@code field} is null for a constraint on the whole object.
 */
public record FieldProblem(@Nullable String field, String code, String message) {}
