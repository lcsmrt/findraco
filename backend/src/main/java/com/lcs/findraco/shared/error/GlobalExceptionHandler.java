package com.lcs.findraco.shared.error;

import java.util.List;
import java.util.stream.Stream;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Turns every exception a controller lets escape into a problem: a {@link DomainException} with its own
 * type and status, Spring's request errors typed by status (400 when the request cannot be read, 422 when
 * a constraint fails), a stale version as 409 and anything else as a 500 with a fixed detail.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ProblemDetail> handleDomain(DomainException exception) {
        return ResponseEntity.status(exception.status()).body(Problems.of(exception));
    }

    /** Login only: the answer never says whether the e-mail or the password was wrong. */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ProblemDetail> handleAuthentication(AuthenticationException exception) {
        return problem(HttpStatus.UNAUTHORIZED, ProblemType.INVALID_CREDENTIALS, "Invalid e-mail or password.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(AccessDeniedException exception) {
        return problem(HttpStatus.FORBIDDEN, ProblemType.FORBIDDEN, "Access denied.");
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ProblemDetail> handleStaleVersion(ObjectOptimisticLockingFailureException exception) {
        return problem(
                HttpStatus.CONFLICT,
                ProblemType.STALE_VERSION,
                "The resource was changed by another request. Reload it and try again.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleUnexpected(Exception exception) {
        log.error("Unexpected error", exception);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, ProblemType.INTERNAL, Problems.INTERNAL_DETAIL);
    }

    /** A value that could not be bound (a wrong type in a query parameter) is unreadable, not invalid. */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        if (exception.getBindingResult().getFieldErrors().stream().anyMatch(FieldError::isBindingFailure)) {
            return new ResponseEntity<>(
                    Problems.of(HttpStatus.BAD_REQUEST, ProblemType.MALFORMED_REQUEST, "A value has the wrong type."),
                    headers,
                    HttpStatus.BAD_REQUEST);
        }
        Stream<FieldProblem> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldProblem(error.getField(), code(error), message(error)));
        Stream<FieldProblem> objectErrors = exception.getBindingResult().getGlobalErrors().stream()
                .map(error -> new FieldProblem(null, code(error), message(error)));
        return validationFailed(Stream.concat(fieldErrors, objectErrors).toList(), headers);
    }

    @Override
    protected ResponseEntity<Object> handleHandlerMethodValidationException(
            HandlerMethodValidationException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        if (exception.isForReturnValue()) {
            return handleExceptionInternal(exception, null, headers, HttpStatus.INTERNAL_SERVER_ERROR, request);
        }
        List<FieldProblem> errors = exception.getParameterValidationResults().stream()
                .flatMap(result -> result.getResolvableErrors().stream()
                        .map(error -> new FieldProblem(
                                error instanceof FieldError fieldError
                                        ? fieldError.getField()
                                        : result.getMethodParameter().getParameterName(),
                                code(error),
                                message(error))))
                .toList();
        return validationFailed(errors, headers);
    }

    /** Every other Spring MVC error keeps its status and gets the problem type of that status. */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception exception,
            @Nullable Object body,
            HttpHeaders headers,
            HttpStatusCode statusCode,
            WebRequest request) {
        HttpStatus status = HttpStatus.valueOf(statusCode.value());
        if (status.is5xxServerError()) {
            log.error("Unexpected error", exception);
        }
        String detail = exception instanceof ErrorResponse errorResponse
                        && errorResponse.getBody().getDetail() != null
                ? errorResponse.getBody().getDetail()
                : status.getReasonPhrase() + ".";
        return new ResponseEntity<>(Problems.forStatus(status, detail), headers, status);
    }

    private static ResponseEntity<Object> validationFailed(List<FieldProblem> errors, HttpHeaders headers) {
        return new ResponseEntity<>(Problems.validationFailed(errors), headers, HttpStatus.UNPROCESSABLE_CONTENT);
    }

    private static ResponseEntity<ProblemDetail> problem(HttpStatus status, ProblemType type, String detail) {
        return ResponseEntity.status(status).body(Problems.of(status, type, detail));
    }

    /** The most general code Spring resolves for a constraint is its simple name ({@code NotBlank}). */
    private static String code(MessageSourceResolvable error) {
        String[] codes = error.getCodes();
        return codes == null || codes.length == 0 ? "Invalid" : codes[codes.length - 1];
    }

    private static String message(MessageSourceResolvable error) {
        String message = error.getDefaultMessage();
        return message != null ? message : "is invalid";
    }
}
