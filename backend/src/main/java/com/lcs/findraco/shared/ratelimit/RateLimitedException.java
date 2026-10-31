package com.lcs.findraco.shared.ratelimit;

import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.error.ProblemType;
import java.time.Duration;
import org.springframework.http.HttpStatus;

/** A caller used up a {@link RateLimit}; {@code retryAfter} is when the next call can succeed. */
public class RateLimitedException extends DomainException {

    private final Duration retryAfter;

    public RateLimitedException(Duration retryAfter) {
        super(ProblemType.RATE_LIMITED, HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Try again later.");
        this.retryAfter = retryAfter;
    }

    public Duration retryAfter() {
        return retryAfter;
    }

    /** The {@code Retry-After} header value: whole seconds, rounded up, never zero. */
    public long retryAfterSeconds() {
        return Math.max(1, (retryAfter.toMillis() + 999) / 1000);
    }
}
