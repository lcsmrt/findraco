package com.lcs.findraco.shared.openapi;

import com.lcs.findraco.shared.error.Problems;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.media.ArraySchema;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import java.util.LinkedHashSet;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Gives every operation the errors any endpoint can answer (400, 401, 404, 422, 500), plus 403 on plan
 * routes, all pointing at one {@code ProblemDetail} schema. No operation lists the problem types it may
 * answer: the {@code ProblemType} schema is the catalogue.
 */
@Component
public class CommonProblemResponsesCustomizer implements OpenApiCustomizer {

    static final String PROBLEM_DETAIL = "ProblemDetail";
    static final String FIELD_PROBLEM = "FieldProblem";

    private static final List<HttpStatus> COMMON = List.of(
            HttpStatus.BAD_REQUEST,
            HttpStatus.UNAUTHORIZED,
            HttpStatus.NOT_FOUND,
            HttpStatus.UNPROCESSABLE_CONTENT,
            HttpStatus.INTERNAL_SERVER_ERROR);

    @Override
    public void customise(OpenAPI openApi) {
        openApi.getComponents()
                .addSchemas(FIELD_PROBLEM, fieldProblemSchema())
                .addSchemas(PROBLEM_DETAIL, problemDetailSchema());
        openApi.getPaths().forEach((path, item) -> {
            boolean planRoute = path.contains("{" + PlanPathParameterCustomizer.PLAN_ID + "}");
            item.readOperations().forEach(operation -> addProblems(operation, planRoute));
        });
    }

    private static void addProblems(Operation operation, boolean planRoute) {
        if (operation.getResponses() == null) {
            operation.setResponses(new ApiResponses());
        }
        COMMON.forEach(status -> addProblem(operation, status));
        if (planRoute) {
            addProblem(operation, HttpStatus.FORBIDDEN);
        }
    }

    private static void addProblem(Operation operation, HttpStatus status) {
        Schema<Object> reference = new Schema<>();
        reference.set$ref("#/components/schemas/" + PROBLEM_DETAIL);
        operation
                .getResponses()
                .putIfAbsent(
                        String.valueOf(status.value()),
                        new ApiResponse()
                                .description(status.getReasonPhrase())
                                .content(new Content()
                                        .addMediaType(
                                                org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON_VALUE,
                                                new MediaType().schema(reference))));
    }

    private static Schema<?> problemDetailSchema() {
        Schema<Object> fieldProblem = new Schema<>();
        fieldProblem.set$ref("#/components/schemas/" + FIELD_PROBLEM);
        ArraySchema errors = new ArraySchema();
        errors.setItems(fieldProblem);
        errors.setDescription("422 validation-failed only");

        ObjectSchema schema = new ObjectSchema();
        schema.setDescription("RFC 9457 problem. Branch on type; detail is for developers and never shown.");
        schema.addProperty("type", described(uri(), "urn:findraco:problem: followed by a ProblemType slug"));
        schema.addProperty("title", new StringSchema());
        schema.addProperty("status", new IntegerSchema());
        schema.addProperty("detail", new StringSchema());
        schema.addProperty("instance", uri());
        schema.addProperty(Problems.REQUEST_ID, new StringSchema());
        schema.addProperty(Problems.FIELD, described(new StringSchema(), "The request field involved, if any"));
        schema.addProperty(Problems.ERRORS, errors);
        List.of("type", "title", "status").forEach(schema::addRequiredItem);
        return schema;
    }

    private static Schema<?> fieldProblemSchema() {
        Schema<Object> field = new Schema<>();
        field.setTypes(new LinkedHashSet<>(List.of("string", "null")));

        ObjectSchema schema = new ObjectSchema();
        schema.addProperty("field", field);
        schema.addProperty("code", described(new StringSchema(), "The constraint's simple name, such as NotBlank"));
        schema.addProperty("message", new StringSchema());
        List.of("field", "code", "message").forEach(schema::addRequiredItem);
        return schema;
    }

    private static StringSchema uri() {
        StringSchema schema = new StringSchema();
        schema.setFormat("uri");
        return schema;
    }

    private static StringSchema described(StringSchema schema, String description) {
        schema.setDescription(description);
        return schema;
    }
}
