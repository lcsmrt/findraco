package com.lcs.findraco.shared.security;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.jspecify.annotations.Nullable;

public class PasswordLengthValidator implements ConstraintValidator<PasswordLength, String> {

    @Override
    public boolean isValid(@Nullable String password, ConstraintValidatorContext context) {
        if (password == null) {
            return true;
        }
        String normalized = PasswordNormalizer.normalize(password);
        int length = normalized.codePointCount(0, normalized.length());

        return length >= PasswordLength.MIN && length <= PasswordLength.MAX;
    }
}
