package com.lcs.findraco.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
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
    public JavaMailSender javaMailSender(
            @Value("${app.mail.smtp-host}") String host,
            @Value("${app.mail.smtp-port}") int port,
            @Value("${app.mail.smtp-username}") String username,
            @Value("${app.mail.smtp-password}") String password) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(host);
        sender.setPort(port);

        Properties properties = sender.getJavaMailProperties();
        if (!username.isBlank()) {
            sender.setUsername(username);
            sender.setPassword(password);
            properties.put("mail.smtp.auth", "true");
        }
        if (port == SMTPS_PORT) {
            properties.put("mail.smtp.ssl.enable", "true");
        } else {
            properties.put("mail.smtp.starttls.enable", "true");
        }

        return sender;
    }
}
