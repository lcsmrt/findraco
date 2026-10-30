package com.lcs.findraco;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.methods;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noMethods;
import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.category.model.Category;
import com.lcs.findraco.category.model.CategoryMemberLimit;
import com.lcs.findraco.transaction.model.RecurrenceDefinition;
import com.lcs.findraco.transaction.model.RecurrenceDefinitionParticipant;
import com.lcs.findraco.transaction.model.Transaction;
import com.lcs.findraco.transaction.model.TransactionItem;
import com.lcs.findraco.transaction.model.TransactionParticipant;
import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.Dependency;
import com.tngtech.archunit.core.domain.JavaCall;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.core.domain.JavaModifier;
import com.tngtech.archunit.core.domain.JavaParameterizedType;
import com.tngtech.archunit.core.domain.properties.HasOwner;
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
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
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
    static final ArchRule controllersNeverMapEntities = noClasses()
            .that()
            .areAnnotatedWith(RestController.class)
            .should()
            .dependOnClassesThat()
            .areAnnotatedWith(Entity.class)
            .because("the service builds the response inside its transaction; with open-in-view off an entity "
                    + "reaching the controller fails on its first lazy association");

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
     * The layers a feature may reach in another feature. A feature reads another's entities through a
     * read-only repository of its own (see below). Another feature's response is reachable only from a
     * response, which embeds it; a service asks the owner's service instead.
     */
    private static final Set<String> CROSS_FEATURE_LAYERS = Set.of("service", "model");

    private static final String RESPONSE_LAYER = "response";

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
            .because("a feature's controllers, requests, exceptions and configuration are its own, and its "
                    + "responses are embedded only by other responses");

    @ArchTest
    static final ArchRule sharedDependsOnNoFeature = noClasses()
            .that()
            .resideInAPackage(ROOT + ".shared..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(ROOT + ".[auth|user|plan|category|transaction|dashboard]..")
            .because("every feature builds on shared, so shared cannot know any of them");

    @ArchTest
    static final ArchRule noIllegalArgumentAsUserError = noClasses()
            .should()
            .callConstructorWhere(JavaCall.Predicates.target(HasOwner.Predicates.With.owner(
                            JavaClass.Predicates.assignableTo(IllegalArgumentException.class)))
                    .and(inSourceCode()))
            .because("a user error is a named DomainException with its own problem type; an escaped "
                    + "IllegalArgumentException answers 500");

    @ArchTest
    static final ArchRule repositoriesOverAnotherFeaturesEntityAreReadOnly = classes()
            .that()
            .areInterfaces()
            .and()
            .areAssignableTo(Repository.class)
            .should(beReadOnlyWhenOverAnotherFeaturesEntity())
            .because("another feature's entities are written only through their owner's service");

    /** Entities with rules of their own: created valid and changed only through intention-revealing methods. */
    private static final Class<?>[] GUARDED_ENTITIES = {
        Transaction.class,
        TransactionParticipant.class,
        TransactionItem.class,
        RecurrenceDefinition.class,
        RecurrenceDefinitionParticipant.class,
        Category.class,
        CategoryMemberLimit.class
    };

    /** The parts of an aggregate, written only through their root. */
    private static final Set<String> AGGREGATE_CHILDREN = Set.of(
            TransactionParticipant.class.getName(),
            TransactionItem.class.getName(),
            RecurrenceDefinitionParticipant.class.getName(),
            CategoryMemberLimit.class.getName());

    @ArchTest
    static final ArchRule modelsTakeDomainValuesOnly = noClasses()
            .that()
            .resideInAPackage(ROOT + ".*.model")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(
                    ROOT + ".*.service",
                    ROOT + ".*.repository",
                    ROOT + ".*.request",
                    ROOT + ".*.response",
                    ROOT + ".shared.security",
                    "org.springframework.security..")
            .because("an aggregate's rules hold on every entry path (HTTP, CSV, a future connector) only if it "
                    + "takes domain values and reaches no use case");

    @ArchTest
    static final ArchRule guardedEntitiesHaveNoPublicSetters = noMethods()
            .that()
            .areDeclaredInClassesThat()
            .belongToAnyOf(GUARDED_ENTITIES)
            .and()
            .arePublic()
            .should()
            .haveNameMatching("set[A-Z].*")
            .because("a guarded entity changes through methods that keep its rules, never field by field");

    @ArchTest
    static final ArchRule aggregateChildrenHaveNoWriteRepository = classes()
            .that()
            .areInterfaces()
            .and()
            .areAssignableTo(Repository.class)
            .should(beReadOnlyWhenOverAnAggregateChild())
            .because("participants, items and member limits change only through their root");

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
    static final ArchRule dtosKeepTheirComponentNames = noClasses()
            .that()
            .resideInAnyPackage(ROOT + ".*.request", ROOT + ".*.response")
            .should()
            .dependOnClassesThat()
            .haveFullyQualifiedName("com.fasterxml.jackson.annotation.JsonProperty")
            .because("a JSON property is named after its record component, so the contract reads like the code");

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
        return new ArchCondition<>(
                "only reach other features through " + layers + ", or their responses from a " + "response") {
            @Override
            public void check(JavaClass origin, ConditionEvents events) {
                Matcher originMatcher = FEATURE_LAYER.matcher(origin.getPackageName());
                if (!originMatcher.matches()) {
                    return;
                }
                String originFeature = originMatcher.group(1);
                boolean fromResponse = RESPONSE_LAYER.equals(originMatcher.group(2));
                for (Dependency dependency : origin.getDirectDependenciesFromSelf()) {
                    Matcher target =
                            FEATURE_LAYER.matcher(dependency.getTargetClass().getPackageName());
                    if (target.matches()
                            && !target.group(1).equals(originFeature)
                            && !layers.contains(target.group(2))
                            && !(fromResponse && RESPONSE_LAYER.equals(target.group(2)))) {
                        events.add(SimpleConditionEvent.violated(dependency, dependency.getDescription()));
                    }
                }
            }
        };
    }

    private static ArchCondition<JavaClass> beReadOnlyWhenOverAnotherFeaturesEntity() {
        return new ArchCondition<>(
                "extend Repository only and declare no write method when over another " + "feature's entity") {
            @Override
            public void check(JavaClass repository, ConditionEvents events) {
                Optional<String> feature = featureOf(repository.getPackageName());
                Optional<String> entityFeature =
                        entityOf(repository).flatMap(entity -> featureOf(entity.getPackageName()));
                if (feature.isEmpty() || entityFeature.isEmpty() || feature.equals(entityFeature)) {
                    return;
                }
                reportWrites(repository, "another feature's entity", events);
            }
        };
    }

    private static ArchCondition<JavaClass> beReadOnlyWhenOverAnAggregateChild() {
        return new ArchCondition<>("extend Repository only and declare no write method when over an aggregate child") {
            @Override
            public void check(JavaClass repository, ConditionEvents events) {
                if (entityOf(repository)
                        .filter(entity -> AGGREGATE_CHILDREN.contains(entity.getName()))
                        .isPresent()) {
                    reportWrites(repository, "an aggregate child", events);
                }
            }
        };
    }

    private static void reportWrites(JavaClass repository, String what, ConditionEvents events) {
        if (WRITE_CAPABLE.stream().anyMatch(repository::isAssignableTo)) {
            events.add(SimpleConditionEvent.violated(
                    repository, repository.getName() + " inherits write methods; extend Repository"));
        }
        repository.getMethods().stream()
                .filter(method -> method.isAnnotatedWith(Modifying.class)
                        || WRITE_METHOD.matcher(method.getName()).matches())
                .forEach(method ->
                        events.add(SimpleConditionEvent.violated(method, method.getFullName() + " writes " + what)));
    }

    private static final List<Class<?>> WRITE_CAPABLE =
            List.of(CrudRepository.class, ListCrudRepository.class, PagingAndSortingRepository.class);

    private static final Pattern WRITE_METHOD = Pattern.compile("(save|delete|remove|insert|update).*");

    /** The entity a repository is declared over: the first type argument of its Spring Data interface. */
    private static Optional<JavaClass> entityOf(JavaClass repository) {
        return repository.getInterfaces().stream()
                .filter(type -> type instanceof JavaParameterizedType)
                .map(JavaParameterizedType.class::cast)
                .filter(type -> type.toErasure().isAssignableTo(Repository.class))
                .map(type -> type.getActualTypeArguments().getFirst().toErasure())
                .findFirst();
    }

    /** Leaves out what the compiler generates, such as {@code $deserializeLambda$} of a serializable lambda. */
    private static DescribedPredicate<JavaCall<?>> inSourceCode() {
        return DescribedPredicate.describe(
                "in source code", call -> !call.getOrigin().getModifiers().contains(JavaModifier.SYNTHETIC));
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
