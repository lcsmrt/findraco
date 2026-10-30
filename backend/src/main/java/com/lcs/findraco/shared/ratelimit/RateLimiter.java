package com.lcs.findraco.shared.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.TimeMeter;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.EnumMap;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * In-memory token buckets, one per limit and key (one application instance). Keys are normalised and
 * hashed, so no e-mail address sits in memory as text, and each limit's buckets live in a size-bounded
 * cache that forgets a key once its period has passed untouched, so memory stays bounded under any
 * number of distinct callers.
 */
@Component
public class RateLimiter {

    private static final Logger log = LoggerFactory.getLogger(RateLimiter.class);

    /** Per limit, keys beyond this are evicted (least recently used first). */
    private static final long MAX_KEYS_PER_LIMIT = 100_000;

    private final RateLimitProperties properties;
    private final TimeMeter timeMeter;
    private final Map<RateLimit, Cache<String, Bucket>> buckets = new EnumMap<>(RateLimit.class);

    public RateLimiter(RateLimitProperties properties, Clock clock) {
        this.properties = properties;
        this.timeMeter = new ClockTimeMeter(clock);
        for (RateLimit limit : RateLimit.values()) {
            buckets.put(
                    limit,
                    Caffeine.newBuilder()
                            .maximumSize(MAX_KEYS_PER_LIMIT)
                            .expireAfterAccess(properties.rule(limit).period())
                            .build());
        }
    }

    /** Takes one call from the key's bucket, or throws when the bucket is empty. */
    public void consume(RateLimit limit, String key) {
        RateLimitRule rule = properties.rule(limit);
        Bucket bucket = buckets.get(limit).get(digest(key), ignored -> newBucket(rule));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            RateLimitedException refused = new RateLimitedException(Duration.ofNanos(probe.getNanosToWaitForRefill()));
            log.warn("Rate limit {} exceeded; retry in {}s", limit, refused.retryAfterSeconds());
            throw refused;
        }
    }

    private Bucket newBucket(RateLimitRule rule) {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(rule.capacity())
                        .refillIntervally(rule.capacity(), rule.period())
                        .build())
                .withCustomTimePrecision(timeMeter)
                .build();
    }

    private static String digest(String key) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(key.strip().toLowerCase(Locale.ROOT).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is part of every Java runtime.", exception);
        }
    }

    /** Bucket4j's time source over the injected clock, so tests move time by moving the clock. */
    private record ClockTimeMeter(Clock clock) implements TimeMeter {

        @Override
        public long currentTimeNanos() {
            return ChronoUnit.NANOS.between(Instant.EPOCH, clock.instant());
        }

        @Override
        public boolean isWallClockBased() {
            return true;
        }
    }
}
