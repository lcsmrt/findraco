package com.lcs.findraco.shared.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import java.util.ArrayList;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.stereotype.Component;

/**
 * Declares {@code planId} as a path parameter on every plan route. The controllers never bind it
 * themselves (the plan context resolver reads it), so springdoc would leave it out.
 */
@Component
public class PlanPathParameterCustomizer implements OpenApiCustomizer {

    static final String PLAN_ID = "planId";

    @Override
    public void customise(OpenAPI openApi) {
        openApi.getPaths().forEach((path, item) -> {
            if (path.contains("{" + PLAN_ID + "}")) {
                item.readOperations().forEach(PlanPathParameterCustomizer::declarePlanId);
            }
        });
    }

    private static void declarePlanId(Operation operation) {
        List<Parameter> parameters =
                operation.getParameters() == null ? new ArrayList<>() : new ArrayList<>(operation.getParameters());
        boolean declared = parameters.stream()
                .anyMatch(parameter -> PLAN_ID.equals(parameter.getName()) && "path".equals(parameter.getIn()));
        if (!declared) {
            parameters.addFirst(new Parameter()
                    .name(PLAN_ID)
                    .in("path")
                    .required(true)
                    .schema(new IntegerSchema().format("int64")));
        }
        operation.setParameters(parameters);
    }
}
