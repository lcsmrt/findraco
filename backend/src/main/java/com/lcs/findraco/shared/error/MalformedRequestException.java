package com.lcs.findraco.shared.error;

import org.springframework.http.HttpStatus;

/**
 * A request value our code reads itself (a path variable, a sort parameter) that cannot be read: the same
 * 400 {@code malformed-request} Spring answers for a value it fails to bind.
 */
public class MalformedRequestException extends DomainException {

    public MalformedRequestException(String field, String detail) {
        super(ProblemType.MALFORMED_REQUEST, HttpStatus.BAD_REQUEST, field, detail);
    }
}
