package com.lcs.findraco.shared.web;

import java.util.List;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Registers the resolvers every feature may use. */
@Configuration
public class SharedWebConfig implements WebMvcConfigurer {

    static {
        // The address comes from the connection; it is no request parameter.
        SpringDocUtils.getConfig().addAnnotationsToIgnore(ClientIp.class);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new ClientIpArgumentResolver());
    }
}
