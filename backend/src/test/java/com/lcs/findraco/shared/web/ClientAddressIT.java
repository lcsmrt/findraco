package com.lcs.findraco.shared.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.shared.security.PublicEndpoints;
import com.lcs.findraco.support.TestcontainersConfig;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.context.TestComponent;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Over a real connection: {@code X-Forwarded-For} replaces the caller's address only when the connection
 * comes from a trusted proxy, and the API listens on the configured address only.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import({TestcontainersConfig.class, ClientAddressIT.EchoConfig.class})
class ClientAddressIT {

    private static final String FORWARDED = "203.0.113.9";

    @TestConfiguration(proxyBeanMethods = false)
    static class EchoConfig {

        @Bean
        EchoController echoController() {
            return new EchoController();
        }

        @Bean
        PublicEndpoints echoEndpoint() {
            return new PublicEndpoints(HttpMethod.GET, List.of("/test/client-ip"));
        }
    }

    // A test component: scanning skips it, only EchoConfig registers it.
    @RestController
    @TestComponent
    static class EchoController {

        @GetMapping("/test/client-ip")
        String clientIp(@ClientIp String ip) {
            return ip;
        }
    }

    @LocalServerPort
    private int port;

    private String clientIpSeenBy(String forwardedFor) throws IOException, InterruptedException {
        HttpRequest.Builder request =
                HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + port + "/test/client-ip"));
        if (forwardedFor != null) {
            request.header("X-Forwarded-For", forwardedFor);
        }
        return HttpClient.newHttpClient()
                .send(request.build(), HttpResponse.BodyHandlers.ofString())
                .body();
    }

    @Nested
    @TestPropertySource(
            properties =
                    "server.tomcat.remoteip.internal-proxies=172\\\\.(1[6-9]|2\\\\d|3[01])\\\\.\\\\d{1,3}\\\\.\\\\d{1,3}")
    class FromAnAddressThatIsNotTheProxy {

        @Test
        void forwardedForIsIgnored() throws Exception {
            assertThat(clientIpSeenBy(FORWARDED)).isEqualTo("127.0.0.1");
        }
    }

    @Nested
    class FromTheProxy {

        @Test
        void forwardedForNamesTheClient() throws Exception {
            assertThat(clientIpSeenBy(FORWARDED)).isEqualTo(FORWARDED);
        }

        @Test
        void aForgedLeadingEntryDoesNotHideTheAddressTheProxyAppended() throws Exception {
            assertThat(clientIpSeenBy("198.51.100.1, " + FORWARDED)).isEqualTo(FORWARDED);
        }

        @Test
        void withoutTheHeaderTheConnectionAddressIsUsed() throws Exception {
            assertThat(clientIpSeenBy(null)).isEqualTo("127.0.0.1");
        }
    }
}
