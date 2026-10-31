package com.lcs.findraco.shared.openapi;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.Schema;
import java.lang.reflect.RecordComponent;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.jspecify.annotations.Nullable;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.RegexPatternTypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

/**
 * Every field of a response is required, except one annotated {@code @Nullable}: that one is optional and
 * typed to allow {@code null}, since the API writes it as {@code null}. Response records are found by name
 * (response names are unique), a generic one by the prefix springdoc gives it ({@code PageResponseXxx}).
 */
@Component
public class RequiredUnlessNullableCustomizer implements OpenApiCustomizer {

    private static final String ROOT = "com.lcs.findraco";

    private final Map<String, Class<?>> responses = findResponseRecords();

    @Override
    public void customise(OpenAPI openApi) {
        var schemas = openApi.getComponents().getSchemas();
        if (schemas == null) {
            return;
        }
        schemas.forEach((name, schema) -> {
            Class<?> record = recordFor(name);
            if (record != null && schema.getProperties() != null) {
                apply(record, schema);
            }
        });
    }

    private @Nullable Class<?> recordFor(String schemaName) {
        Class<?> exact = responses.get(schemaName);
        if (exact != null) {
            return exact;
        }
        return responses.values().stream()
                .filter(type -> type.getTypeParameters().length > 0 && schemaName.startsWith(type.getSimpleName()))
                .findFirst()
                .orElse(null);
    }

    private static void apply(Class<?> record, Schema<?> schema) {
        List<String> required = new ArrayList<>();
        for (RecordComponent component : record.getRecordComponents()) {
            String name = component.getName();
            Schema<?> property = schema.getProperties().get(name);
            if (property == null) {
                continue;
            }
            if (component.getAnnotatedType().isAnnotationPresent(Nullable.class)) {
                schema.getProperties().put(name, nullable(property));
            } else {
                required.add(name);
            }
        }
        schema.setRequired(required.isEmpty() ? null : required);
    }

    private static Schema<?> nullable(Schema<?> property) {
        if (property.get$ref() != null) {
            Schema<Object> reference = new Schema<>();
            reference.set$ref(property.get$ref());
            Schema<Object> isNull = new Schema<>();
            isNull.addType("null");
            Schema<Object> either = new Schema<>();
            either.setOneOf(List.of(reference, isNull));
            return either;
        }
        Set<String> types = new LinkedHashSet<>();
        if (property.getTypes() != null) {
            types.addAll(property.getTypes());
        } else if (property.getType() != null) {
            types.add(property.getType());
        }
        types.add("null");
        property.setTypes(types);
        return property;
    }

    private static Map<String, Class<?>> findResponseRecords() {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new RegexPatternTypeFilter(
                java.util.regex.Pattern.compile(".*\\.response\\.[A-Za-z]+Response|.*\\.shared\\.web\\.PageResponse")));
        return scanner.findCandidateComponents(ROOT).stream()
                .map(definition -> ClassUtils.resolveClassName(
                        definition.getBeanClassName(), RequiredUnlessNullableCustomizer.class.getClassLoader()))
                .filter(Class::isRecord)
                .collect(Collectors.toMap(Class::getSimpleName, Function.identity()));
    }
}
