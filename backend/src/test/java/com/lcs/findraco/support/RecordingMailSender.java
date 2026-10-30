package com.lcs.findraco.support;

import java.time.Duration;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.CountDownLatch;
import org.awaitility.Awaitility;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * The in-memory mail fake: records what would have been sent, from which thread, and holds each send until
 * {@link #release} is counted down. Tests that need mail import {@link InMemoryMailConfig}; the others run
 * with no sender at all.
 */
public final class RecordingMailSender extends JavaMailSenderImpl {

    private static final String TOKEN_MARKER = "token=";

    public final List<SimpleMailMessage> sent = new CopyOnWriteArrayList<>();
    public final List<String> threads = new CopyOnWriteArrayList<>();
    public volatile CountDownLatch release = new CountDownLatch(0);

    @Override
    public void send(SimpleMailMessage message) {
        try {
            release.await();
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }
        threads.add(Thread.currentThread().getName());
        sent.add(message);
    }

    /** Forgets what was sent and lets sends through again. */
    public void reset() {
        sent.clear();
        threads.clear();
        release = new CountDownLatch(0);
    }

    /**
     * The reset tokens mailed to {@code email}, once {@code expected} have arrived (mail goes out asynchronously,
     * so two messages sent back to back may land in either order).
     */
    public List<String> resetTokensSentTo(String email, int expected) {
        Awaitility.await()
                .atMost(Duration.ofSeconds(10))
                .until(() -> sent.stream()
                                .filter(message -> addressedTo(message, email))
                                .count()
                        >= expected);
        return sent.stream()
                .filter(message -> addressedTo(message, email))
                .map(RecordingMailSender::tokenOf)
                .toList();
    }

    /** The link of a mailed message, from its text. */
    public static String linkOf(SimpleMailMessage message) {
        String text = message.getText();
        int start = text.indexOf("http");
        int end = text.indexOf('\n', start);
        return text.substring(start, end < 0 ? text.length() : end).strip();
    }

    private static String tokenOf(SimpleMailMessage message) {
        String link = linkOf(message);
        return link.substring(link.indexOf(TOKEN_MARKER) + TOKEN_MARKER.length());
    }

    private static boolean addressedTo(SimpleMailMessage message, String email) {
        String[] to = message.getTo();
        return to != null && List.of(to).contains(email);
    }
}
