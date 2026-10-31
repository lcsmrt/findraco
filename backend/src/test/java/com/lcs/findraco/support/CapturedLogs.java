package com.lcs.findraco.support;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxyUtil;
import ch.qos.logback.core.read.ListAppender;
import java.util.List;
import org.slf4j.LoggerFactory;

/** Collects what a logger (or every logger) writes while it is open, in memory, for assertions. */
public final class CapturedLogs implements AutoCloseable {

    private final Logger logger;
    private final ListAppender<ILoggingEvent> appender = new ListAppender<>();

    private CapturedLogs(Logger logger) {
        this.logger = logger;
        appender.start();
        logger.addAppender(appender);
    }

    public static CapturedLogs of(Class<?> type) {
        return new CapturedLogs((Logger) LoggerFactory.getLogger(type));
    }

    public static CapturedLogs all() {
        return new CapturedLogs((Logger) LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME));
    }

    public List<ILoggingEvent> events() {
        return List.copyOf(appender.list);
    }

    /** Each event as it would be read in the log: the message, then the stack trace when there is one. */
    public List<String> lines() {
        return events().stream()
                .map(event -> event.getThrowableProxy() == null
                        ? event.getFormattedMessage()
                        : event.getFormattedMessage() + "\n" + ThrowableProxyUtil.asString(event.getThrowableProxy()))
                .toList();
    }

    @Override
    public void close() {
        logger.detachAppender(appender);
        appender.stop();
    }
}
