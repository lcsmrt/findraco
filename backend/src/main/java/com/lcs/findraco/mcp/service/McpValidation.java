package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.util.Comparator;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Checks a request record against the same constraints the API enforces on its body, so a tool refuses what the app
 * would refuse and names the field to fix.
 */
@Component
public class McpValidation {

    private final Validator validator;

    public McpValidation(Validator validator) {
        this.validator = validator;
    }

    public <T> T valid(T request) {
        String problems = validator.validate(request).stream()
                .sorted(Comparator.comparing(
                        violation -> violation.getPropertyPath().toString()))
                .map(McpValidation::describe)
                .collect(Collectors.joining(" "));
        if (!problems.isEmpty()) {
            throw new McpToolException(problems);
        }
        return request;
    }

    private static String describe(ConstraintViolation<?> violation) {
        return violation.getPropertyPath() + ": " + violation.getMessage();
    }
}
