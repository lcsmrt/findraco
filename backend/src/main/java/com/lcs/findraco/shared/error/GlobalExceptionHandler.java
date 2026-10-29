package com.lcs.findraco.shared.error;

import com.lcs.findraco.auth.controller.SessionCookies;
import com.lcs.findraco.auth.exception.AuthenticationExceptions;
import com.lcs.findraco.category.exception.CategoryExceptions;
import com.lcs.findraco.plan.exception.PlanExceptions;
import com.lcs.findraco.transaction.exception.TransactionExceptions;
import com.lcs.findraco.user.exception.UserExceptions;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private final SessionCookies sessionCookies;

    public GlobalExceptionHandler(SessionCookies sessionCookies) {
        this.sessionCookies = sessionCookies;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            @NonNull MethodArgumentNotValidException exception,
            @NonNull HttpHeaders headers,
            @NonNull HttpStatusCode status,
            @NonNull WebRequest request) {
        List<FieldErrorDto> errors = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldErrorDto(error.getField(), error.getDefaultMessage()))
                .toList();
        ErrorResponseDto errorResponse = new ErrorResponseDto(
                "Validation error.", ((ServletWebRequest) request).getRequest().getRequestURI(), errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDto> handleBadCredentials(
            BadCredentialsException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto("Invalid username or password.", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /** The session can't be renewed: answer like any unauthenticated request and drop the dead cookie. */
    @ExceptionHandler(AuthenticationExceptions.InvalidSessionException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidSession(
            AuthenticationExceptions.InvalidSessionException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .header(HttpHeaders.SET_COOKIE, sessionCookies.clear().toString())
                .body(errorResponse);
    }

    @ExceptionHandler(TransactionExceptions.TransactionNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleTransactionNotFound(
            TransactionExceptions.TransactionNotFoundException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(TransactionExceptions.TransactionSeriesNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleTransactionSeriesNotFound(
            TransactionExceptions.TransactionSeriesNotFoundException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(CategoryExceptions.CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleCategoryNotFound(
            CategoryExceptions.CategoryNotFoundException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler({
        CategoryExceptions.CategoryParentIsChildException.class,
        CategoryExceptions.CategoryParentIsItselfException.class,
        CategoryExceptions.CategoryWithChildrenCannotHaveParentException.class,
        CategoryExceptions.CategoryParentTypeMismatchException.class,
        CategoryExceptions.CategoryWithChildrenTypeChangeException.class,
        CategoryExceptions.CategoryInvalidReassignTargetException.class
    })
    public ResponseEntity<ErrorResponseDto> handleCategoryHierarchyInvariant(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler({
        CategoryExceptions.CategoryMemberLimitsOnCreditException.class,
        CategoryExceptions.CategoryMemberLimitsOnOwnedException.class,
        CategoryExceptions.CategoryMemberLimitDuplicateMemberException.class,
        CategoryExceptions.CategoryMemberLimitInactiveMemberException.class,
        CategoryExceptions.CategoryOwnerOnChildException.class,
        CategoryExceptions.CategoryOwnerInactiveMemberException.class
    })
    public ResponseEntity<ErrorResponseDto> handleCategoryMemberInvariant(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler({
        CategoryExceptions.CategoryHasChildrenException.class,
        CategoryExceptions.CategoryInUseException.class
    })
    public ResponseEntity<ErrorResponseDto> handleCategoryConflict(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(UserExceptions.EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponseDto> handleEmailAlreadyUsed(
            UserExceptions.EmailAlreadyExistsException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler({
        PlanExceptions.PlanNotFoundException.class,
        PlanExceptions.NotAMemberException.class,
        PlanExceptions.MemberNotFoundException.class,
        PlanExceptions.InvitationNotFoundException.class
    })
    public ResponseEntity<ErrorResponseDto> handlePlanNotFound(RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler({
        PlanExceptions.InsufficientPlanRoleException.class,
        PlanExceptions.CannotModifyOthersTransactionException.class
    })
    public ResponseEntity<ErrorResponseDto> handlePlanForbidden(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler({PlanExceptions.LastPlanException.class, PlanExceptions.LastOwnerException.class})
    public ResponseEntity<ErrorResponseDto> handlePlanConflict(RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(PlanExceptions.InvitationEmailMismatchException.class)
    public ResponseEntity<ErrorResponseDto> handleInvitationEmailMismatch(
            PlanExceptions.InvitationEmailMismatchException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler({
        PlanExceptions.InvitationExpiredException.class,
        PlanExceptions.InvitationRevokedException.class,
        PlanExceptions.InvitationAlreadyUsedException.class
    })
    public ResponseEntity<ErrorResponseDto> handleInvitationGone(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.GONE).body(errorResponse);
    }

    @ExceptionHandler({
        TransactionExceptions.CategoryTypeMismatchException.class,
        TransactionExceptions.ItemCategoryTypeMismatchException.class,
        TransactionExceptions.ItemsTotalExceedsAmountException.class,
        TransactionExceptions.ParticipantSharesMismatchException.class
    })
    public ResponseEntity<ErrorResponseDto> handleTransactionInvariant(
            RuntimeException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(UserExceptions.InvalidPasswordResetTokenException.class)
    public ResponseEntity<ErrorResponseDto> handleInvalidPasswordResetToken(
            UserExceptions.InvalidPasswordResetTokenException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponseDto> handleIllegalArgument(
            IllegalArgumentException exception, HttpServletRequest request) {
        ErrorResponseDto errorResponse = new ErrorResponseDto(exception.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleUnexpected(Exception exception, HttpServletRequest request) {
        logger.error("Unexpected error: ", exception);
        ErrorResponseDto errorResponse =
                new ErrorResponseDto("An internal error occurred. Please try again later.", request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
