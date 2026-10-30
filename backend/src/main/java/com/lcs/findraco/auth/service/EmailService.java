package com.lcs.findraco.auth.service;

import com.lcs.findraco.auth.config.MailExecutorConfig;
import com.lcs.findraco.auth.config.MailProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;
    private final boolean local;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSender, MailProperties mailProperties, Environment environment) {
        this.mailSender = mailSender.getIfAvailable();
        this.from = mailProperties.from();
        this.local = environment.matchesProfiles("local");
    }

    /**
     * Sends the reset link, on the mail executor: the caller has already answered by the time it goes out.
     * Delivery failures are logged, never thrown: the caller's response
     * must not differ between known and unknown emails.
     */
    @Async(MailExecutorConfig.MAIL_EXECUTOR)
    public void sendPasswordResetEmail(String to, String resetUrl) {
        String text = """
                You asked to reset your findraco password.

                Open the link below to choose a new password (it expires in %d minutes):

                %s

                If this wasn't you, ignore this email.
                """.formatted(PasswordResetService.TOKEN_TTL.toMinutes(), resetUrl);

        if (mailSender == null) {
            // A live reset link in a shared log is an account takeover; only a developer's own run prints it.
            if (local) {
                logger.info("SMTP is not configured; password reset link: {}", resetUrl);
            } else {
                logger.warn("SMTP is not configured; a password reset e-mail was not sent.");
            }
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("Reset your password — findraco");
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            // The exception can name the recipient, so only its type is logged.
            logger.error(
                    "Failed to send a password reset e-mail: {}",
                    exception.getClass().getSimpleName());
        }
    }
}
