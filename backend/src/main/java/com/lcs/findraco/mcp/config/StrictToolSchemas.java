package com.lcs.findraco.mcp.config;

import io.modelcontextprotocol.server.McpServerFeatures.SyncToolSpecification;
import io.modelcontextprotocol.spec.McpSchema.Tool;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

/**
 * Closes every tool's input schema ({@code additionalProperties: false}). The generated schemas leave it open, so a
 * misspelled optional argument (say {@code plano} for {@code plan}) was ignored and the call ran against the default
 * plan; with it closed, the SDK refuses the call with an error that names the unknown parameter.
 */
@Component
public class StrictToolSchemas implements BeanPostProcessor {

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        if (bean instanceof List<?> beans
                && !beans.isEmpty()
                && beans.stream().allMatch(SyncToolSpecification.class::isInstance)) {
            return beans.stream()
                    .map(SyncToolSpecification.class::cast)
                    .map(StrictToolSchemas::closed)
                    .toList();
        }
        return bean;
    }

    private static SyncToolSpecification closed(SyncToolSpecification specification) {
        Tool tool = specification.tool();
        Map<String, Object> schema = new LinkedHashMap<>(tool.inputSchema());
        schema.put("additionalProperties", false);
        return new SyncToolSpecification(
                new Tool(
                        tool.name(),
                        tool.title(),
                        tool.description(),
                        schema,
                        tool.outputSchema(),
                        tool.annotations(),
                        tool.meta(),
                        tool.icons()),
                specification.callHandler());
    }
}
