package com.lcs.findraco.config;

import java.util.Properties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * SMTP sender built from the {@code SMTP_*} env vars, so switching providers (Gmail app
 * password, Mailpit in dev, ...) is configuration only. Without {@code SMTP_HOST} no sender
 * exists and {@link com.lcs.findraco.services.EmailService} logs the message instead — the API
 * still boots.
 */
@Configuration
public class MailConfig {

    private static final int SMTPS_PORT = 465;

    @Bean
    @ConditionalOnExpression("!'${app.mail.smtp-host:}'.isBlank()")
    public JavaMailSender javaMailSender(MailProperties mail) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(mail.smtpHost());
        sender.setPort(mail.smtpPort());

        Properties properties = sender.getJavaMailProperties();
        if (!mail.smtpUsername().isBlank()) {
            sender.setUsername(mail.smtpUsername());
            sender.setPassword(mail.smtpPassword());
            properties.put("mail.smtp.auth", "true");
        }
        if (mail.smtpPort() == SMTPS_PORT) {
            properties.put("mail.smtp.ssl.enable", "true");
        } else {
            properties.put("mail.smtp.starttls.enable", "true");
        }

        return sender;
    }
}
