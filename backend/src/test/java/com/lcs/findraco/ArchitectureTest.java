package com.lcs.findraco;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;
import static org.assertj.core.api.Assertions.assertThat;

import com.tngtech.archunit.core.domain.Dependency;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import jakarta.persistence.Entity;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

/**
 * Every structural rule of the backend, checked on the production classes. A new rule lands in the
 * commit that makes the code comply, so this class is never red on {@code main}.
 */
@AnalyzeClasses(packages = "com.lcs.findraco", importOptions = ImportOption.DoNotIncludeTests.class)
class ArchitectureTest {

    @ArchTest
    static final ArchRule controllersNeverAccessRepositories = noClasses()
            .that()
            .areAnnotatedWith(RestController.class)
            .or()
            .areAnnotatedWith(Controller.class)
            .should()
            .dependOnClassesThat()
            .areAssignableTo(Repository.class)
            .because("a controller delegates to a service, which owns the repositories");

    @ArchTest
    static final ArchRule constructorInjectionOnly = noFields()
            .should()
            .beAnnotatedWith(Autowired.class)
            .orShould()
            .beAnnotatedWith("jakarta.inject.Inject")
            .orShould()
            .beAnnotatedWith("jakarta.annotation.Resource")
            .orShould()
            .beAnnotatedWith(Value.class)
            .because("dependencies and configuration arrive through the constructor");

    private static final String ROOT = "com.lcs.findraco";

    /**
     * The layers a feature may reach in another feature. The repository layer leaves the list when the
     * report queries and the category delete stop using the transaction repository; the response layer
     * then narrows to responses embedding another feature's response.
     */
    private static final Set<String> CROSS_FEATURE_LAYERS = Set.of("service", "model", "response", "repository");

    private static final Pattern FEATURE_LAYER = Pattern.compile(
            Pattern.quote(ROOT) + "\\.(auth|user|plan|category|transaction|dashboard)\\.([a-z]+)(\\..*)?");

    @ArchTest
    static final ArchRule packagesFollowTheFeatureLayout = classes()
            .should()
            .resideInAnyPackage(
                    ROOT,
                    ROOT + ".shared.[config|error|openapi|security|web|ratelimit]",
                    ROOT + ".[auth|user|plan|category|transaction|dashboard]"
                            + ".[controller|service|repository|model|request|response|exception|config]",
                    ROOT + ".transaction.importer")
            .because("every feature uses the same layer sub-packages, and only the ones it needs");

    @ArchTest
    static final ArchRule featuresMeetThroughTheirServicesAndModels = classes()
            .that()
            .resideInAnyPackage(ROOT + ".[auth|user|plan|category|transaction|dashboard]..")
            .should(onlyReachOtherFeaturesThrough(CROSS_FEATURE_LAYERS))
            .because("a feature's controllers, requests, exceptions and configuration are its own");

    @ArchTest
    static final ArchRule dtosAreRecords = classes()
            .that()
            .resideInAnyPackage(ROOT + ".*.request", ROOT + ".*.response")
            .and()
            .arePublic()
            .should()
            .beRecords()
            .because("requests and responses are immutable");

    @ArchTest
    static final ArchRule requestNamesMatchTheirPackage = classes()
            .that()
            .resideInAPackage(ROOT + ".*.request")
            .and()
            .arePublic()
            .should()
            .haveSimpleNameEndingWith("Request")
            .orShould()
            .haveSimpleNameEndingWith("Filter")
            .because("input is named CreateXxxRequest, UpdateXxxRequest or, for query parameters, XxxFilter");

    @ArchTest
    static final ArchRule responseNamesMatchTheirPackage = classes()
            .that()
            .resideInAPackage(ROOT + ".*.response")
            .and()
            .arePublic()
            .should()
            .haveSimpleNameEndingWith("Response")
            .because("output is named XxxResponse or, embedded in another response, XxxSummaryResponse");

    @ArchTest
    static final ArchRule dtosDeclareNoNestedTypes = noClasses()
            .that()
            .resideInAnyPackage(ROOT + ".*.request", ROOT + ".*.response")
            .should()
            .beNestedClasses()
            .because("every DTO has its own file, so names never collide");

    @ArchTest
    static void dtoNamesAreUnique(JavaClasses classes) {
        Map<String, List<String>> byName = classes.stream()
                .filter(javaClass ->
                        javaClass.getPackageName().matches(Pattern.quote(ROOT) + "\\.\\w+\\.(request|response)"))
                .collect(Collectors.groupingBy(
                        JavaClass::getSimpleName, Collectors.mapping(JavaClass::getName, Collectors.toList())));

        assertThat(byName.values().stream().filter(names -> names.size() > 1).toList())
                .as("DTO simple names are unique across features")
                .isEmpty();
    }

    @ArchTest
    static final ArchRule controllersReceiveNoEntities = methods()
            .that()
            .areDeclaredInClassesThat()
            .areAnnotatedWith(RestController.class)
            .should(takeNoEntityParameter())
            .because("a resolver supplies values (PlanContext, AuthenticatedUser); services load entities in their "
                    + "own transaction");

    private static ArchCondition<JavaClass> onlyReachOtherFeaturesThrough(Set<String> layers) {
        return new ArchCondition<>("only reach other features through " + layers) {
            @Override
            public void check(JavaClass origin, ConditionEvents events) {
                Optional<String> originFeature = featureOf(origin.getPackageName());
                for (Dependency dependency : origin.getDirectDependenciesFromSelf()) {
                    Matcher target =
                            FEATURE_LAYER.matcher(dependency.getTargetClass().getPackageName());
                    if (originFeature.isPresent()
                            && target.matches()
                            && !target.group(1).equals(originFeature.get())
                            && !layers.contains(target.group(2))) {
                        events.add(SimpleConditionEvent.violated(dependency, dependency.getDescription()));
                    }
                }
            }
        };
    }

    private static Optional<String> featureOf(String packageName) {
        Matcher matcher = FEATURE_LAYER.matcher(packageName);
        return matcher.matches() ? Optional.of(matcher.group(1)) : Optional.empty();
    }

    private static ArchCondition<JavaMethod> takeNoEntityParameter() {
        return new ArchCondition<>("take no JPA entity parameter") {
            @Override
            public void check(JavaMethod method, ConditionEvents events) {
                method.getRawParameterTypes().stream()
                        .filter(type -> type.isAnnotatedWith(Entity.class))
                        .forEach(type -> events.add(SimpleConditionEvent.violated(
                                method, method.getFullName() + " takes the entity " + type.getSimpleName())));
            }
        };
    }

    /**
     * The warning-suppression annotation has source retention, so the bytecode ArchUnit reads never
     * shows it; the sources are scanned instead, tests included. Its name is split below so this
     * file does not match itself.
     */
    @Test
    void noSourceSuppressesWarnings() throws IOException {
        List<Path> offenders;
        try (Stream<Path> files = Files.walk(Path.of("src"))) {
            offenders = files.filter(path -> path.toString().endsWith(".java"))
                    .filter(ArchitectureTest::suppressesWarnings)
                    .toList();
        }

        assertThat(offenders)
                .as("a check that is wrong for the project is turned off once in pom.xml")
                .isEmpty();
    }

    private static boolean suppressesWarnings(Path source) {
        try {
            return Files.readString(source, StandardCharsets.UTF_8).contains("@" + "SuppressWarnings");
        } catch (IOException exception) {
            throw new IllegalStateException("Cannot read " + source, exception);
        }
    }
}
