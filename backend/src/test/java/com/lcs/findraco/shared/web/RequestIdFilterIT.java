package com.lcs.findraco.shared.web;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.auth.controller.AuthRoutes;
import com.lcs.findraco.support.AbstractIntegrationTest;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.slf4j.MDC;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

class RequestIdFilterIT extends AbstractIntegrationTest {

    private static final String UUID_PATTERN = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

    private String requestIdOf(MockHttpServletRequestBuilder request) throws Exception {
        return mockMvc.perform(request).andReturn().getResponse().getHeader(RequestIdFilter.HEADER);
    }

    private static MockHttpServletRequestBuilder anyRequest() {
        return get(AuthRoutes.AUTH + "/reset-password/validate").param("token", "unknown");
    }

    @Test
    void echoesAValidIncomingId() throws Exception {
        String incoming = "client-Abc-123";

        assertThat(requestIdOf(anyRequest().header(RequestIdFilter.HEADER, incoming)))
                .isEqualTo(incoming);
    }

    @Test
    void replacesAnInvalidIncomingIdWithANewOne() throws Exception {
        String withSpaces = "forged id\nINFO fake line";
        String tooLong = "a".repeat(65);

        assertThat(requestIdOf(anyRequest().header(RequestIdFilter.HEADER, withSpaces)))
                .matches(UUID_PATTERN);
        assertThat(requestIdOf(anyRequest().header(RequestIdFilter.HEADER, tooLong)))
                .matches(UUID_PATTERN);
    }

    @Test
    void generatesAnIdWhenNoneIsSent() throws Exception {
        String first = requestIdOf(anyRequest());
        String second = requestIdOf(anyRequest());

        assertThat(first).matches(UUID_PATTERN);
        assertThat(UUID.fromString(second)).isNotEqualTo(UUID.fromString(first));
    }

    @Test
    void answersWithAnIdEvenWhenAuthenticationFails() throws Exception {
        assertThat(requestIdOf(get("/api/findraco/user/me"))).matches(UUID_PATTERN);
    }

    @Test
    void clearsTheIdFromTheLoggingContextAfterTheRequest() throws Exception {
        requestIdOf(anyRequest().header(RequestIdFilter.HEADER, "leaks-if-kept"));

        assertThat(MDC.get(RequestIdFilter.MDC_KEY)).isNull();
    }
}
