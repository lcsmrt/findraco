package com.lcs.findraco.shared.security;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** 8 to 128 characters, counted as Unicode code points after NFKC; a null password is left to {@code @NotNull}. */
@Documented
@Constraint(validatedBy = PasswordLengthValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordLength {

    int MIN = 8;
    int MAX = 128;

    String message() default "Password must be 8 to 128 characters.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
