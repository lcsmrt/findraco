package com.lcs.findraco.shared.openapi;

import com.lcs.findraco.shared.error.ProblemType;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.StringSchema;
import java.util.Arrays;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.stereotype.Component;

/** Publishes every problem slug as the {@code ProblemType} enum, so clients can map each one to copy. */
@Component
public class ProblemTypeSchemaCustomizer implements OpenApiCustomizer {

    @Override
    public void customise(OpenAPI openApi) {
        StringSchema schema = new StringSchema();
        schema.setEnum(
                Arrays.stream(ProblemType.values()).map(ProblemType::slug).toList());
        schema.description("The slug of a problem's type, after urn:findraco:problem:");
        openApi.getComponents().addSchemas("ProblemType", schema);
    }
}
