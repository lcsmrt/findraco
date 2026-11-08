package com.lcs.findraco.auth.config;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.io.IOException;
import java.nio.file.Files;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * The RSA key that signs the authorization server's access tokens, read from the PEM at
 * {@code app.oauth.signing-key}. The key id is the key's thumbprint, so it stays the same across restarts.
 */
@Configuration
public class OAuthSigningKeyConfig {

    @Bean
    public JWKSource<SecurityContext> jwkSource(OAuthProperties properties) throws IOException {
        return new ImmutableJWKSet<>(new JWKSet(readRsaKey(Files.readString(properties.signingKey()))));
    }

    private static RSAKey readRsaKey(String pem) {
        String base64 = pem.replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        try {
            KeyFactory factory = KeyFactory.getInstance("RSA");
            if (!(factory.generatePrivate(
                            new PKCS8EncodedKeySpec(Base64.getDecoder().decode(base64)))
                    instanceof RSAPrivateCrtKey privateKey)) {
                throw new IllegalStateException("app.oauth.signing-key must hold an RSA private key in PKCS#8.");
            }
            RSAPublicKey publicKey = (RSAPublicKey) factory.generatePublic(
                    new RSAPublicKeySpec(privateKey.getModulus(), privateKey.getPublicExponent()));
            return new RSAKey.Builder(publicKey)
                    .privateKey(privateKey)
                    .keyIDFromThumbprint()
                    .build();
        } catch (GeneralSecurityException | JOSEException | IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "app.oauth.signing-key must be a PKCS#8 PEM (openssl genpkey -algorithm RSA).", exception);
        }
    }
}
