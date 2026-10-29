package com.lcs.findraco.config;

import com.lcs.findraco.security.PlanContextArgumentResolver;
import com.lcs.findraco.services.PlanService;
import java.util.List;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final PlanService planService;

    public WebConfig(PlanService planService) {
        this.planService = planService;
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new PlanContextArgumentResolver(planService));
    }
}
