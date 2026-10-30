package com.lcs.findraco.shared.ratelimit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class RateLimiterTest {

    private static final RateLimitRule THREE_PER_MINUTE = new RateLimitRule(3, Duration.ofMinutes(1));

    private final MutableClock clock = new MutableClock(Instant.parse("2026-01-01T00:00:00Z"));
    private final RateLimiter limiter = new RateLimiter(
            new RateLimitProperties(
                    THREE_PER_MINUTE,
                    THREE_PER_MINUTE,
                    THREE_PER_MINUTE,
                    THREE_PER_MINUTE,
                    THREE_PER_MINUTE,
                    new RateLimitRule(1, Duration.ofHours(1))),
            clock);

    @Test
    void allowsTheCapacityAndRefusesTheNextCallWithTheWait() {
        consume(3, "1.2.3.4");

        assertThatThrownBy(() -> limiter.consume(RateLimit.LOGIN_IP, "1.2.3.4"))
                .isInstanceOfSatisfying(RateLimitedException.class, exception -> {
                    assertThat(exception.retryAfter()).isEqualTo(Duration.ofMinutes(1));
                    assertThat(exception.retryAfterSeconds()).isEqualTo(60);
                });
    }

    @Test
    void reportsTheRemainingWaitAsTimePasses() {
        consume(3, "1.2.3.4");
        clock.advance(Duration.ofSeconds(20));

        assertThatThrownBy(() -> limiter.consume(RateLimit.LOGIN_IP, "1.2.3.4"))
                .isInstanceOfSatisfying(
                        RateLimitedException.class,
                        exception -> assertThat(exception.retryAfterSeconds()).isEqualTo(40));
    }

    @Test
    void refillsOncePeriodHasPassed() {
        consume(3, "1.2.3.4");
        clock.advance(Duration.ofMinutes(1));

        assertThatCode(() -> consume(3, "1.2.3.4")).doesNotThrowAnyException();
        assertThatThrownBy(() -> limiter.consume(RateLimit.LOGIN_IP, "1.2.3.4"))
                .isInstanceOf(RateLimitedException.class);
    }

    @Test
    void keysAndLimitsAreIndependent() {
        consume(3, "1.2.3.4");

        assertThatCode(() -> limiter.consume(RateLimit.LOGIN_IP, "5.6.7.8")).doesNotThrowAnyException();
        assertThatCode(() -> limiter.consume(RateLimit.REGISTER_IP, "1.2.3.4")).doesNotThrowAnyException();
    }

    @Test
    void emailKeysIgnoreCaseAndSurroundingSpaces() {
        limiter.consume(RateLimit.LOGIN_EMAIL, "Ana@Example.com");
        limiter.consume(RateLimit.LOGIN_EMAIL, " ana@example.com ");
        limiter.consume(RateLimit.LOGIN_EMAIL, "ANA@example.com");

        assertThatThrownBy(() -> limiter.consume(RateLimit.LOGIN_EMAIL, "ana@example.com"))
                .isInstanceOf(RateLimitedException.class);
    }

    @Test
    void retryAfterRoundsUpToWholeSeconds() {
        assertThat(new RateLimitedException(Duration.ofMillis(1)).retryAfterSeconds())
                .isEqualTo(1);
        assertThat(new RateLimitedException(Duration.ofMillis(1500)).retryAfterSeconds())
                .isEqualTo(2);
        assertThat(new RateLimitedException(Duration.ZERO).retryAfterSeconds()).isEqualTo(1);
    }

    private void consume(int times, String key) {
        for (int call = 0; call < times; call++) {
            limiter.consume(RateLimit.LOGIN_IP, key);
        }
    }

    /** A clock the test moves by hand. */
    private static final class MutableClock extends Clock {

        private Instant now;

        MutableClock(Instant now) {
            this.now = now;
        }

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return now;
        }
    }
}
