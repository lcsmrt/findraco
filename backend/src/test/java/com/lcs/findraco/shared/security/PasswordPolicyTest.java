package com.lcs.findraco.shared.security;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

class PasswordPolicyTest {

    private record Candidate(@ValidPassword String password) {}

    private static final ValidatorFactory FACTORY = Validation.buildDefaultValidatorFactory();
    private static final Validator VALIDATOR = FACTORY.getValidator();

    @AfterAll
    static void closeFactory() {
        FACTORY.close();
    }

    /** The simple names of the constraints that failed, which are the {@code errors[].code} clients see. */
    private static Set<String> failures(String password) {
        return VALIDATOR.validate(new Candidate(password)).stream()
                .map(PasswordPolicyTest::code)
                .collect(Collectors.toSet());
    }

    private static String code(ConstraintViolation<Candidate> violation) {
        return violation
                .getConstraintDescriptor()
                .getAnnotation()
                .annotationType()
                .getSimpleName();
    }

    @Test
    void sevenCodePointsAreTooShort() {
        assertThat(failures("a".repeat(7))).containsExactly("PasswordLength");
    }

    @Test
    void eightAndOneHundredTwentyEightCodePointsPass() {
        assertThat(failures("a".repeat(8))).isEmpty();
        assertThat(failures("a".repeat(128))).isEmpty();
    }

    @Test
    void oneHundredTwentyNineCodePointsAreTooLong() {
        assertThat(failures("a".repeat(129))).containsExactly("PasswordLength");
    }

    @Test
    void anEmojiCountsAsOneCharacterNotTwo() {
        String grin = text(0x1F600);

        assertThat(failures(grin.repeat(8))).isEmpty();
        assertThat(failures(grin.repeat(7))).containsExactly("PasswordLength");
        assertThat(failures(grin.repeat(128))).isEmpty();
        assertThat(failures(grin.repeat(129))).containsExactly("PasswordLength");
    }

    /** Spells a string from code points, so invisible characters stay readable in the source. */
    private static String text(int... codePoints) {
        return new String(codePoints, 0, codePoints.length);
    }

    static Stream<Arguments> forbiddenCharacters() {
        return Stream.of(
                Arguments.of("zero-width space", 0x200B),
                Arguments.of("tab", 0x09),
                Arguments.of("line feed", 0x0A),
                Arguments.of("carriage return", 0x0D),
                Arguments.of("line separator", 0x2028),
                Arguments.of("paragraph separator", 0x2029),
                Arguments.of("null", 0x00),
                Arguments.of("byte order mark", 0xFEFF));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("forbiddenCharacters")
    void controlAndInvisibleCharactersAreRefused(String name, int codePoint) {
        assertThat(failures("abc" + text(codePoint) + "defgh")).containsExactly("PasswordCharacters");
    }

    @Test
    void lettersOfAnyLanguageDigitsPunctuationAndSpacesAreAccepted() {
        assertThat(failures("correct horse battery staple")).isEmpty();
        assertThat(failures("  espa" + text(0xE7) + "os e acentua" + text(0xE7, 0xE3) + "o: "))
                .isEmpty();
        assertThat(failures(text(0x43F, 0x430, 0x440, 0x43E, 0x43B, 0x44C) + "-" + text(0x5BC6, 0x7801) + "-1234"))
                .isEmpty();
        assertThat(failures("p@ss.w0rd!")).isEmpty();
    }

    @Test
    void bothRulesReportWhenBothFail() {
        assertThat(failures("a\tb")).containsExactlyInAnyOrder("PasswordLength", "PasswordCharacters");
    }

    @Test
    void lengthIsCountedAfterNfkc() {
        // Six letters and an "e" followed by a combining acute accent: eight code points before NFKC, seven after.
        assertThat(failures("abcdef" + text('e', 0x301))).containsExactly("PasswordLength");
        // Four "fi" ligatures expand to eight letters.
        assertThat(failures(text(0xFB01).repeat(4))).isEmpty();
    }

    @Test
    void normalizerMakesEquivalentSpellingsEqual() {
        assertThat(PasswordNormalizer.normalize("ç")).isEqualTo(PasswordNormalizer.normalize("ç"));
        assertThat(PasswordNormalizer.normalize(text(0xFF21, 0xFF22, 0xFF23))).isEqualTo("ABC");
        assertThat(PasswordNormalizer.normalize("plain")).isEqualTo("plain");
    }

    @Test
    void aNullPasswordIsLeftToNotNull() {
        assertThat(VALIDATOR.validate(new Candidate(null))).isEmpty();
        assertThat(List.of(failures(""))).isNotEmpty();
    }
}
