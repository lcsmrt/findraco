package com.lcs.findraco.support;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

/** Gives an integration test the in-memory mail fake as the application's sender: {@code @Import} it. */
@TestConfiguration(proxyBeanMethods = false)
public class InMemoryMailConfig {

    @Bean
    RecordingMailSender mailSender() {
        return new RecordingMailSender();
    }
}
