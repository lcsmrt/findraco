package com.lcs.findraco.auth.config;

import java.util.concurrent.RejectedExecutionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Sends e-mail on a small bounded pool, so a request never waits for the SMTP server and a slow server
 * cannot pile up threads. When the pool and its queue are full the message is dropped and logged, never
 * thrown: the caller's answer must not depend on the mail system.
 */
@Configuration
@EnableAsync
public class MailExecutorConfig {

    public static final String MAIL_EXECUTOR = "mailExecutor";

    private static final Logger log = LoggerFactory.getLogger(MailExecutorConfig.class);
    private static final int SHUTDOWN_WAIT_SECONDS = 10;

    @Bean(MAIL_EXECUTOR)
    public ThreadPoolTaskExecutor mailExecutor(MailExecutorProperties properties) {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(properties.coreSize());
        executor.setMaxPoolSize(properties.maxSize());
        executor.setQueueCapacity(properties.queueCapacity());
        executor.setThreadNamePrefix("mail-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(SHUTDOWN_WAIT_SECONDS);
        RejectedExecutionHandler dropAndLog =
                (task, pool) -> log.warn("The mail queue is full; an e-mail was dropped.");
        executor.setRejectedExecutionHandler(dropAndLog);
        return executor;
    }
}
