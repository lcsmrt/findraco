package com.lcs.findraco.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/** SESS-07: session and reset tokens are random Base64url values stored only as SHA-256 hex. */
class OpaqueTokensTest {

    @Test
    void generateYieldsFortyThreeCharBase64UrlWithoutPadding() {
        String token = OpaqueTokens.generate();

        assertThat(token).hasSize(43).matches("[A-Za-z0-9_-]{43}");
    }

    @Test
    void generateDiffersAcrossCalls() {
        assertThat(OpaqueTokens.generate()).isNotEqualTo(OpaqueTokens.generate());
    }

    @Test
    void hashReturnsTheKnownSha256HexOfAFixedInput() {
        // FIPS 180-2 test vector: SHA-256("abc").
        String hash = OpaqueTokens.hash("abc");

        assertThat(hash)
                .isEqualTo("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
                .hasSize(64);
    }
}
