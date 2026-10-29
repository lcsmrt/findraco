package com.lcs.findraco.plan.controller;

import com.lcs.findraco.plan.service.PlanService;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Registers the plan context resolver from the plan feature itself, so {@code shared} knows no feature. */
@Configuration
public class PlanWebConfig implements WebMvcConfigurer {

    private final PlanService planService;

    public PlanWebConfig(PlanService planService) {
        this.planService = planService;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new PlanContextArgumentResolver(planService));
    }
}
