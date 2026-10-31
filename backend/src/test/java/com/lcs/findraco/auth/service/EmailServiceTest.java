package com.lcs.findraco.auth.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.lcs.findraco.auth.config.MailProperties;
import com.lcs.findraco.support.CapturedLogs;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.StaticListableBeanFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mock.env.MockEnvironment;

class EmailServiceTest {

    private static final String LINK = "http://localhost:5173/reset-password?token=live-token";

    private static EmailService withoutSmtp(String... profiles) {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles(profiles);
        return new EmailService(
                new StaticListableBeanFactory().getBeanProvider(JavaMailSender.class),
                new MailProperties("", 587, "", "", "no-reply@findraco.local"),
                environment);
    }

    @Test
    void withoutSmtpTheLinkIsLoggedOnlyUnderTheLocalProfile() {
        try (CapturedLogs logs = CapturedLogs.of(EmailService.class)) {
            withoutSmtp("local").sendPasswordResetEmail("person@example.test", LINK);

            assertThat(logs.lines()).anyMatch(line -> line.contains(LINK));
            assertThat(logs.lines()).noneMatch(line -> line.contains("person@example.test"));
        }
    }

    @Test
    void withoutSmtpOutsideLocalNeitherTheLinkNorTheAddressIsLogged() {
        try (CapturedLogs logs = CapturedLogs.of(EmailService.class)) {
            withoutSmtp("prod").sendPasswordResetEmail("person@example.test", LINK);

            assertThat(logs.lines()).isNotEmpty();
            assertThat(logs.lines()).noneMatch(line -> line.contains("live-token") || line.contains("person@"));
        }
    }
}
