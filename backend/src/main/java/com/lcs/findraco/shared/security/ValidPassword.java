package com.lcs.findraco.shared.security;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * The password policy of a new password: {@link PasswordLength} and {@link PasswordCharacters}, no
 * composition rules (NIST advises against them). It is not {@code @ReportAsSingleViolation}, so a 422
 * carries the code of the rule that failed ({@code PasswordLength} or {@code PasswordCharacters}), which
 * the client translates. Not used on login: existing accounts keep signing in with the password they have.
 */
@Documented
@PasswordLength
@PasswordCharacters
@Constraint(validatedBy = {})
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {

    String message() default "Password is not valid.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
