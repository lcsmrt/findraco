package com.lcs.findraco.shared.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.lcs.findraco.category.controller.CategoryRoutes;
import com.lcs.findraco.plan.model.Plan;
import com.lcs.findraco.support.AbstractIntegrationTest;
import com.lcs.findraco.support.CapturedLogs;
import com.lcs.findraco.transaction.controller.TransactionRoutes;
import com.lcs.findraco.user.model.User;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class RequestLogFilterIT extends AbstractIntegrationTest {

    private CapturedLogs logs;

    @BeforeEach
    void captureRequestLines() {
        logs = CapturedLogs.of(RequestLogFilter.class);
    }

    @AfterEach
    void stopCapturing() {
        logs.close();
    }

    private ILoggingEvent onlyLine() {
        assertThat(logs.events()).hasSize(1);
        return logs.events().get(0);
    }

    @Test
    void logsOneInfoLineWithTheRouteTemplateUserAndPlan() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);

        mockMvc.perform(get(CategoryRoutes.CATEGORY, plan.getId()).with(testAuthHelper.asUser(user)));

        ILoggingEvent line = onlyLine();
        assertThat(line.getLevel()).isEqualTo(Level.INFO);
        assertThat(line.getFormattedMessage())
                .matches("GET /api/findraco/plan/\\{planId}/category 200 \\d+ms userId=" + user.getId() + " planId="
                        + plan.getId());
    }

    @Test
    void logsTheTemplateNotTheRawPath() throws Exception {
        User user = fixtures.aUser();
        Plan plan = fixtures.aPlan(user);

        mockMvc.perform(get(TransactionRoutes.TRANSACTION + "/{id}", plan.getId(), 987654)
                .with(testAuthHelper.asUser(user)));

        ILoggingEvent line = onlyLine();
        assertThat(line.getFormattedMessage())
                .startsWith("GET /api/findraco/plan/{planId}/transaction/{id} 404 ")
                .doesNotContain("987654");
        assertThat(line.getLevel()).isEqualTo(Level.INFO);
        assertThat(line.getThrowableProxy()).isNull();
    }

    @Test
    void logsARefusedNonMemberWithoutAStackTrace() throws Exception {
        User owner = fixtures.aUser();
        User stranger = fixtures.aUser();
        Plan plan = fixtures.aPlan(owner);

        mockMvc.perform(get(CategoryRoutes.CATEGORY, plan.getId()).with(testAuthHelper.asUser(stranger)));

        ILoggingEvent line = onlyLine();
        assertThat(line.getFormattedMessage())
                .matches("GET /api/findraco/plan/\\{planId}/category 404 \\d+ms userId=" + stranger.getId() + " planId="
                        + plan.getId());
        assertThat(line.getThrowableProxy()).isNull();
    }

    @Test
    void logsAnUnauthenticatedRequestWithNoRouteOrUser() throws Exception {
        mockMvc.perform(get("/api/findraco/invitation/{token}/accept", "secret-invitation-token"));

        ILoggingEvent line = onlyLine();
        assertThat(line.getFormattedMessage())
                .matches("GET - 401 \\d+ms userId=- planId=-")
                .doesNotContain("secret-invitation-token");
    }

    @Test
    void logsAFailureThatEscapesAsAnErrorWithoutAStackTrace() {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/findraco/anything");

        assertThatThrownBy(() -> new RequestLogFilter().doFilter(request, new MockHttpServletResponse(), (req, res) -> {
                    throw new ServletException("boom");
                }))
                .isInstanceOf(ServletException.class);

        ILoggingEvent line = onlyLine();
        assertThat(line.getLevel()).isEqualTo(Level.ERROR);
        assertThat(line.getFormattedMessage()).matches("POST - 500 \\d+ms userId=- planId=-");
        assertThat(line.getThrowableProxy()).isNull();
    }
}
