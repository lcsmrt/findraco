package com.lcs.findraco.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String from;

    public EmailService(
            ObjectProvider<JavaMailSender> mailSender,
            @Value("${app.mail.from}") String from
    ) {
        this.mailSender = mailSender.getIfAvailable();
        this.from = from;
    }

    /**
     * Sends the reset link. Delivery failures are logged, never thrown: the caller's response
     * must not differ between known and unknown emails.
     */
    public void sendPasswordResetEmail(String to, String resetUrl) {
        String text = """
                You asked to reset your findraco password.

                Open the link below to choose a new password (it expires in %d minutes):

                %s

                If this wasn't you, ignore this email.
                """.formatted(PasswordResetService.TOKEN_TTL.toMinutes(), resetUrl);

        if (mailSender == null) {
            logger.info("SMTP is not configured; password reset email for {}:\n{}", to, text);
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
            logger.error("Failed to send password reset email to {}", to, exception);
        }
    }
}
