package com.lcs.findraco.shared.security;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.jspecify.annotations.Nullable;

public class PasswordCharactersValidator implements ConstraintValidator<PasswordCharacters, String> {

    @Override
    public boolean isValid(@Nullable String password, ConstraintValidatorContext context) {
        if (password == null) {
            return true;
        }
        return PasswordNormalizer.normalize(password).codePoints().noneMatch(PasswordCharactersValidator::isForbidden);
    }

    private static boolean isForbidden(int codePoint) {
        return switch (Character.getType(codePoint)) {
            case Character.CONTROL, Character.FORMAT, Character.LINE_SEPARATOR, Character.PARAGRAPH_SEPARATOR -> true;
            default -> false;
        };
    }
}
