package com.lcs.findraco.shared.error;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The servlet error page, reached by an exception escaping a filter or a container error: it answers a
 * problem like every other producer, instead of Spring Boot's default error body.
 */
@Hidden
@RestController
public class ProblemErrorController implements ErrorController {

    public static final String PATH = "/error";

    private static final Logger log = LoggerFactory.getLogger(ProblemErrorController.class);

    @RequestMapping(PATH)
    public ResponseEntity<ProblemDetail> error(HttpServletRequest request) {
        HttpStatus status = status(request);
        if (status.is5xxServerError()
                && request.getAttribute(RequestDispatcher.ERROR_EXCEPTION) instanceof Throwable cause) {
            log.error("Unexpected error outside a controller", cause);
        }
        ProblemDetail problem = Problems.forStatus(status, status.getReasonPhrase() + ".");
        return ResponseEntity.status(status).body(problem);
    }

    private static HttpStatus status(HttpServletRequest request) {
        if (request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE) instanceof Integer code) {
            HttpStatus status = HttpStatus.resolve(code);
            if (status != null && status.isError()) {
                return status;
            }
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}
