package com.lcs.findraco.plan.controller;

import com.lcs.findraco.auth.service.CustomUserDetails;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import java.util.Map;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.HandlerMapping;

/**
 * Resolves a {@link PlanContext} controller parameter from the {@code {planId}} path variable. Reads
 * the acting user from the security context and checks plan membership through
 * {@link PlanService#resolveContext(long, long)}, so a non-member is refused before the controller runs.
 * Membership failures (NotAMember / PlanNotFound) propagate to the {@code GlobalExceptionHandler}.
 */
public class PlanContextArgumentResolver implements HandlerMethodArgumentResolver {

    private final PlanService planService;

    public PlanContextArgumentResolver(PlanService planService) {
        this.planService = planService;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return PlanContext.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory) {

        Object uriVariables = webRequest.getAttribute(
                HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST);

        if (!(uriVariables instanceof Map<?, ?> variables)
                || !(variables.get("planId") instanceof String planIdValue)) {
            throw new IllegalArgumentException("Missing required path variable {planId}.");
        }

        return planService.resolveContext(Long.parseLong(planIdValue), resolveUserId());
    }

    private long resolveUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication != null ? authentication.getPrincipal() : null;
        if (principal instanceof CustomUserDetails customUserDetails) {
            return customUserDetails.authenticatedUser().id();
        }
        throw new IllegalStateException("No authenticated user in the security context.");
    }
}
