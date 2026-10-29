package com.lcs.findraco;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noFields;
import static org.assertj.core.api.Assertions.assertThat;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
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
