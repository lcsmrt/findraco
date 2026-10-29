package com.lcs.findraco.shared.error;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.shared.web.ApiRoutes;
import com.lcs.findraco.shared.web.RequestIdFilter;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.user.model.User;
import jakarta.servlet.RequestDispatcher;
import java.lang.reflect.Method;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.method.annotation.ExceptionHandlerMethodResolver;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * Every producer of an error answers the same problem shape: {@code application/problem+json}, a
 * {@code urn:findraco:problem:} type and the request id.
 */
class ProblemProducersIT extends AbstractIntegrationTest {

    private static final String REQUEST_ID = "problem-producers-it";
    private static final String PROBLEM = "urn:findraco:problem:";

    @Autowired
    private ProblemAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private GlobalExceptionHandler globalExceptionHandler;

    @Autowired
    private ObjectMapper objectMapper;

    @AfterEach
    void clearMdc() {
        MDC.clear();
    }

    @Test
    void theAdviceAnswersADomainExceptionWithItsTypeAndStatus() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        assertProblem(
                mockMvc.perform(get(CategoryRoutes.CATEGORY + "/{id}", plan.getId(), 999_999)
                        .header(RequestIdFilter.HEADER, REQUEST_ID)
                        .with(testAuthHelper.asUser(owner))),
                404,
                "category-not-found");
    }

    @Test
    void theEntryPointAnswersAMissingTokenWith401() throws Exception {
        assertProblem(
                mockMvc.perform(get(ApiRoutes.PLAN).header(RequestIdFilter.HEADER, REQUEST_ID)),
                401,
                "unauthenticated");
    }

    @Test
    void theAccessDeniedHandlerAnswers403() throws Exception {
        MDC.put(RequestIdFilter.MDC_KEY, REQUEST_ID);
        MockHttpServletResponse response = new MockHttpServletResponse();

        accessDeniedHandler.handle(new MockHttpServletRequest(), response, new AccessDeniedException("denied"));

        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(MediaType.parseMediaType(response.getContentType())
                        .isCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .isTrue();
        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertThat(body.get("type").asString()).isEqualTo(PROBLEM + "forbidden");
        assertThat(body.get("status").asInt()).isEqualTo(403);
        assertThat(body.get("requestId").asString()).isEqualTo(REQUEST_ID);
    }

    /** An exception escaping a filter reaches the servlet error page, which answers a problem too. */
    @Test
    void anExceptionEscapingAFilterAnswersAProblemWithAFixedDetail() throws Exception {
        try (CapturedLogs logs = CapturedLogs.of(ProblemErrorController.class)) {
            assertProblem(
                            mockMvc.perform(get(ProblemErrorController.PATH)
                                    .header(RequestIdFilter.HEADER, REQUEST_ID)
                                    .requestAttr(RequestDispatcher.ERROR_STATUS_CODE, 500)
                                    .requestAttr(
                                            RequestDispatcher.ERROR_EXCEPTION,
                                            new IllegalStateException("filter broke on user 42"))),
                            500,
                            "internal")
                    .andExpect(jsonPath("$.detail").value(Problems.INTERNAL_DETAIL));

            assertThat(logs.events())
                    .anySatisfy(event ->
                            assertThat(event.getThrowableProxy().getMessage()).isEqualTo("filter broke on user 42"));
        }
    }

    @Test
    void anUnexpectedExceptionAnswers500WithAFixedDetailAndLogsTheCause() {
        MDC.put(RequestIdFilter.MDC_KEY, REQUEST_ID);
        try (CapturedLogs logs = CapturedLogs.of(GlobalExceptionHandler.class)) {
            ResponseEntity<ProblemDetail> response =
                    globalExceptionHandler.handleUnexpected(new IllegalArgumentException("bad input from user 42"));

            assertThat(response.getStatusCode().value()).isEqualTo(500);
            ProblemDetail problem = response.getBody();
            assertThat(problem).isNotNull();
            assertThat(problem.getType()).hasToString(PROBLEM + "internal");
            assertThat(problem.getDetail()).isEqualTo(Problems.INTERNAL_DETAIL);
            assertThat(problem.getProperties()).containsEntry("requestId", REQUEST_ID);
            assertThat(logs.events())
                    .anySatisfy(event ->
                            assertThat(event.getThrowableProxy().getMessage()).isEqualTo("bad input from user 42"));
        }
    }

    @Test
    void anEscapedIllegalArgumentExceptionIsHandledAsUnexpected() {
        Method handler = new ExceptionHandlerMethodResolver(GlobalExceptionHandler.class)
                .resolveMethodByThrowable(new IllegalArgumentException("bad input"));

        assertThat(handler).isNotNull();
        assertThat(handler.getName()).isEqualTo("handleUnexpected");
    }

    @Test
    void aFieldErrorAnswers422WithTheConstraintNameAsCode() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        assertProblem(
                        mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                                .header(RequestIdFilter.HEADER, REQUEST_ID)
                                .with(testAuthHelper.asUser(owner))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{\"type\":\"DEBIT\",\"description\":\" \"}")),
                        422,
                        "validation-failed")
                .andExpect(jsonPath("$.errors[0].field").value("description"))
                .andExpect(jsonPath("$.errors[0].code").value("NotBlank"))
                .andExpect(jsonPath("$.errors[0].message").value("Description cannot be blank."));
    }

    @Test
    void malformedJsonAnswers400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        assertProblem(
                mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                        .header(RequestIdFilter.HEADER, REQUEST_ID)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":")),
                400,
                "malformed-request");
    }

    @Test
    void anUnknownEnumValueAnswers400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        assertProblem(
                mockMvc.perform(post(CategoryRoutes.CATEGORY, plan.getId())
                        .header(RequestIdFilter.HEADER, REQUEST_ID)
                        .with(testAuthHelper.asUser(owner))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"SIDEWAYS\",\"description\":\"Food\"}")),
                400,
                "malformed-request");
    }

    @Test
    void aWrongTypedPathVariableAnswers400() throws Exception {
        User owner = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        assertProblem(
                mockMvc.perform(get(CategoryRoutes.CATEGORY + "/not-a-number", plan.getId())
                        .header(RequestIdFilter.HEADER, REQUEST_ID)
                        .with(testAuthHelper.asUser(owner))),
                400,
                "malformed-request");
    }

    private static ResultActions assertProblem(ResultActions response, int status, String slug) throws Exception {
        return response.andExpect(status().is(status))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.type").value(PROBLEM + slug))
                .andExpect(jsonPath("$.status").value(status))
                .andExpect(jsonPath("$.requestId").value(REQUEST_ID))
                .andExpect(header().string(RequestIdFilter.HEADER, REQUEST_ID));
    }
}
