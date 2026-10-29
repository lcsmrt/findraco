package com.lcs.findraco.shared.openapi;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import com.lcs.findraco.shared.error.ProblemType;
import com.lcs.findraco.support.AbstractIntegrationTest;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Each OpenAPI convention, checked on one sample operation and one sample schema of the generated docs. */
class OpenApiConventionsIT extends AbstractIntegrationTest {

    private static final String CATEGORIES = "/api/findraco/plan/{planId}/category";
    private static final String PROBLEM_REF = "#/components/schemas/ProblemDetail";

    @Autowired
    private ObjectMapper objectMapper;

    private JsonNode docs;

    @BeforeEach
    void readDocs() throws Exception {
        docs = objectMapper.readTree(mockMvc.perform(get("/v3/api-docs"))
                .andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8));
    }

    @Test
    void aResponseFieldIsRequiredUnlessNullable() {
        JsonNode category = schema("CategoryResponse");

        assertThat(texts(category.get("required")))
                .contains("id", "type", "description")
                .doesNotContain("parentId");
        assertThat(types(category.at("/properties/parentId/type"))).containsExactly("integer", "null");

        JsonNode transactionCategory = schema("TransactionResponse").at("/properties/category/oneOf");
        assertThat(transactionCategory.get(0).get("$ref").asString())
                .isEqualTo("#/components/schemas/CategoryResponse");
        assertThat(types(transactionCategory.get(1).get("type"))).containsExactly("null");
    }

    @Test
    void planContextIsHiddenAndPlanIdIsAPathParameter() {
        assertThat(docs.at("/components/schemas").has("PlanContext")).isFalse();

        List<String> parameters = new ArrayList<>();
        operation(CATEGORIES, "get")
                .get("parameters")
                .forEach(parameter -> parameters.add(parameter.get("name").asString() + ":"
                        + parameter.get("in").asString()));
        assertThat(parameters).contains("planId:path").doesNotContain("ctx:query");
    }

    @Test
    void enumsAreNamedSchemasIncludingSortBy() {
        assertThat(schema("CategoryResponse").at("/properties/type/$ref").asString())
                .isEqualTo("#/components/schemas/TransactionType");

        JsonNode sortBy = parameter(operation("/api/findraco/plan/{planId}/transaction", "get"), "sortBy");
        assertThat(sortBy.at("/schema/$ref").asString()).isEqualTo("#/components/schemas/TransactionSortField");
        assertThat(texts(schema("TransactionSortField").get("enum")))
                .containsExactlyInAnyOrder("startDate", "endDate", "amount", "description", "category", "attributedTo");
    }

    @Test
    void eachOperationDeclaresItsRealSuccessStatus() {
        assertThat(names(operation(CATEGORIES, "post").get("responses")))
                .contains("201")
                .doesNotContain("200");
        assertThat(names(operation(CATEGORIES + "/{id}", "delete").get("responses")))
                .contains("204")
                .doesNotContain("200");
        assertThat(names(operation(CATEGORIES + "/{id}", "get").get("responses")))
                .contains("200");
    }

    @Test
    void everyOperationDeclaresTheCommonProblemsAndPlanRoutesAlso403() {
        JsonNode planRoute = operation(CATEGORIES, "get").get("responses");
        for (String status : List.of("400", "401", "403", "404", "422", "500")) {
            assertThat(planRoute
                            .at("/" + status + "/content/application~1problem+json/schema/$ref")
                            .asString())
                    .as(status)
                    .isEqualTo(PROBLEM_REF);
        }

        JsonNode accountRoute = operation("/api/findraco/user/me", "get").get("responses");
        assertThat(names(accountRoute))
                .contains("400", "401", "404", "422", "500")
                .doesNotContain("403");
        assertThat(texts(schema("ProblemDetail").get("required"))).contains("type", "status");
    }

    @Test
    void theProblemTypeCatalogueIsAnEnum() {
        assertThat(texts(schema("ProblemType").get("enum")))
                .containsExactlyInAnyOrderElementsOf(Arrays.stream(ProblemType.values())
                        .map(ProblemType::slug)
                        .toList())
                .contains("category-has-subcategories");
    }

    private JsonNode schema(String name) {
        JsonNode schema = docs.at("/components/schemas/" + name);
        assertThat(schema.isMissingNode()).as(name).isFalse();
        return schema;
    }

    private JsonNode operation(String path, String method) {
        JsonNode operation = docs.get("paths").get(path).get(method);
        assertThat(operation).as(method + " " + path).isNotNull();
        return operation;
    }

    private static JsonNode parameter(JsonNode operation, String name) {
        for (JsonNode parameter : operation.get("parameters")) {
            if (name.equals(parameter.get("name").asString())) {
                return parameter;
            }
        }
        throw new AssertionError("No parameter " + name);
    }

    private static List<String> texts(JsonNode array) {
        List<String> values = new ArrayList<>();
        array.forEach(value -> values.add(value.asString()));
        return values;
    }

    /** OpenAPI 3.1 writes one type as a string and several as an array. */
    private static List<String> types(JsonNode type) {
        return type.isArray() ? texts(type) : List.of(type.asString());
    }

    private static List<String> names(JsonNode object) {
        return new ArrayList<>(object.propertyNames());
    }
}
