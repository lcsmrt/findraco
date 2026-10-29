package com.lcs.findraco.shared.error;

import com.lcs.findraco.shared.web.RequestIdFilter;
import java.util.List;
import org.jspecify.annotations.Nullable;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

/** The one builder of every problem body: the advice, the security handlers and the error page use it. */
public final class Problems {

    public static final String REQUEST_ID = "requestId";
    public static final String FIELD = "field";
    public static final String ERRORS = "errors";
    public static final String INTERNAL_DETAIL = "An internal error occurred. Please try again later.";

    private Problems() {}

    public static ProblemDetail of(HttpStatus status, ProblemType type, String detail, @Nullable String field) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(type.uri());
        problem.setTitle(status.getReasonPhrase());
        String requestId = MDC.get(RequestIdFilter.MDC_KEY);
        if (requestId != null) {
            problem.setProperty(REQUEST_ID, requestId);
        }
        if (field != null) {
            problem.setProperty(FIELD, field);
        }
        return problem;
    }

    public static ProblemDetail of(HttpStatus status, ProblemType type, String detail) {
        return of(status, type, detail, null);
    }

    public static ProblemDetail of(DomainException exception) {
        return of(exception.status(), exception.type(), exception.getMessage(), exception.field());
    }

    /**
     * A problem the framework raised, typed by its status alone. A 5xx always carries the fixed
     * {@link #INTERNAL_DETAIL}, whatever went wrong.
     */
    public static ProblemDetail forStatus(HttpStatus status, String detail) {
        return switch (status) {
            case BAD_REQUEST -> of(status, ProblemType.MALFORMED_REQUEST, detail);
            case UNAUTHORIZED -> of(status, ProblemType.UNAUTHENTICATED, detail);
            case FORBIDDEN -> of(status, ProblemType.FORBIDDEN, detail);
            case NOT_FOUND -> of(status, ProblemType.NOT_FOUND, detail);
            default ->
                status.is5xxServerError()
                        ? of(status, ProblemType.INTERNAL, INTERNAL_DETAIL)
                        : of(status, ProblemType.UNSUPPORTED_REQUEST, detail);
        };
    }

    public static ProblemDetail validationFailed(List<FieldProblem> errors) {
        ProblemDetail problem =
                of(HttpStatus.UNPROCESSABLE_CONTENT, ProblemType.VALIDATION_FAILED, "The request has invalid fields.");
        problem.setProperty(ERRORS, errors);
        return problem;
    }
}
