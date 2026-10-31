package com.lcs.findraco.shared.error;

import java.util.List;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;

/**
 * A broken rule, answered as a problem with its own type and status. Each feature nests its subclasses
 * in {@code XxxExceptions}, so the status is declared next to the rule. The message is the problem's
 * {@code detail}: English, for developers, and never personal data or a secret.
 */
public abstract class DomainException extends RuntimeException {

    private final ProblemType type;
    private final HttpStatus status;
    private final @Nullable String field;
    private final List<?> errors;

    protected DomainException(
            ProblemType type, HttpStatus status, @Nullable String field, String detail, List<?> errors) {
        super(detail);
        this.type = type;
        this.status = status;
        this.field = field;
        this.errors = errors;
    }

    protected DomainException(ProblemType type, HttpStatus status, @Nullable String field, String detail) {
        this(type, status, field, detail, List.of());
    }

    protected DomainException(ProblemType type, HttpStatus status, String detail) {
        this(type, status, null, detail);
    }

    public ProblemType type() {
        return type;
    }

    public HttpStatus status() {
        return status;
    }

    public @Nullable String field() {
        return field;
    }

    /** The items of the problem's {@code errors} extension, empty when the problem has none. */
    public List<?> errors() {
        return errors;
    }
}
