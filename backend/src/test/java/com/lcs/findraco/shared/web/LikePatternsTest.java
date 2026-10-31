package com.lcs.findraco.shared.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LikePatternsTest {

    @Test
    void wildcardsAndTheEscapeCharacterAreEscaped() {
        assertThat(LikePatterns.escape("100%_off\\now")).isEqualTo("100\\%\\_off\\\\now");
    }

    @Test
    void aPlainTermIsLeftAlone() {
        assertThat(LikePatterns.escape("groceries")).isEqualTo("groceries");
    }

    @Test
    void containsLowerCasesAndWrapsTheEscapedTerm() {
        assertThat(LikePatterns.contains("50%_Off")).isEqualTo("%50\\%\\_off%");
    }
}
