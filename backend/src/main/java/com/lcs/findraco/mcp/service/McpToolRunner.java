package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.shared.error.DomainException;
import com.lcs.findraco.shared.ratelimit.RateLimit;
import com.lcs.findraco.shared.ratelimit.RateLimitedException;
import com.lcs.findraco.shared.ratelimit.RateLimiter;
import com.lcs.findraco.shared.web.RequestIdFilter;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import org.jspecify.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

/**
 * Runs one tool call for every tool: reads the caller from the access token, takes a call from the caller's rate
 * limit, resolves the plan, turns the body's result into the JSON Claude reads and every failure into an error result,
 * and writes the one log line of the call (user, plan, tool, outcome and duration; never the arguments).
 */
@Component
public class McpToolRunner {

    private static final Logger log = LoggerFactory.getLogger(McpToolRunner.class);

    private final McpPlanResolver planResolver;
    private final RateLimiter rateLimiter;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    public McpToolRunner(
            McpPlanResolver planResolver, RateLimiter rateLimiter, ObjectMapper objectMapper, Clock clock) {
        this.planResolver = planResolver;
        this.rateLimiter = rateLimiter;
        this.objectMapper = objectMapper;
        this.clock = clock;
    }

    /** A tool that works on the caller alone. */
    @FunctionalInterface
    public interface UserCall {
        Object run(long userId);
    }

    /** A tool that works in one plan of the caller. */
    @FunctionalInterface
    public interface PlanCall {
        Object run(McpPlanResolver.ResolvedPlan plan);
    }

    public CallToolResult onUser(String tool, UserCall call) {
        return execute(tool, (userId, attempt) -> call.run(userId));
    }

    public CallToolResult inPlan(String tool, @Nullable String plan, PlanCall call) {
        return execute(tool, (userId, attempt) -> {
            McpPlanResolver.ResolvedPlan resolved = planResolver.resolve(plan, userId);
            attempt.planId = resolved.ctx().planId();
            return call.run(resolved);
        });
    }

    /** What the log line needs from inside the call. */
    private static final class Attempt {
        @Nullable
        Long planId;
    }

    @FunctionalInterface
    private interface Body {
        Object run(long userId, Attempt attempt);
    }

    private CallToolResult execute(String tool, Body body) {
        Instant start = clock.instant();
        Attempt attempt = new Attempt();
        Long userId = null;
        String outcome = "ok";
        try {
            userId = callerId();
            rateLimiter.consume(RateLimit.MCP_USER, userId.toString());
            return success(body.run(userId, attempt));
        } catch (RateLimitedException exception) {
            outcome = "rate-limited";
            return failure("Too many tool calls in a short time. Retry in a moment.");
        } catch (OptimisticLockingFailureException exception) {
            outcome = "error";
            return failure("The transaction changed meanwhile. Read it again and retry.");
        } catch (DomainException | McpToolException exception) {
            outcome = "error";
            return failure(exception.getMessage());
        } catch (RuntimeException exception) {
            outcome = "failed";
            String requestId = String.valueOf(MDC.get(RequestIdFilter.MDC_KEY));
            log.error("MCP tool {} failed (ref {}, user {})", tool, requestId, userId, exception);
            return failure("Something went wrong (ref " + requestId + ").");
        } finally {
            log.info(
                    "MCP tool={} user={} plan={} outcome={} durationMs={}",
                    tool,
                    userId,
                    attempt.planId,
                    outcome,
                    Duration.between(start, clock.instant()).toMillis());
        }
    }

    private static long callerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken token)
                || token.getToken().getSubject() == null) {
            throw new McpToolException("Authentication required.");
        }
        return Long.parseLong(token.getToken().getSubject());
    }

    private CallToolResult success(Object result) {
        return CallToolResult.builder()
                .addTextContent(objectMapper.writeValueAsString(result))
                .build();
    }

    private static CallToolResult failure(String message) {
        return CallToolResult.builder().isError(true).addTextContent(message).build();
    }
}
