package com.lcs.findraco.shared.security;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * No control or invisible characters (Unicode categories {@code Cc}, {@code Cf}, {@code Zl}, {@code Zp}:
 * tab, line break, zero-width space...): they arrive by paste and make a password that looks right and never
 * matches. Letters of any language, digits, punctuation, spaces and emoji are all accepted.
 */
@Documented
@Constraint(validatedBy = PasswordCharactersValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordCharacters {

    String message() default "Password cannot contain control or invisible characters.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
