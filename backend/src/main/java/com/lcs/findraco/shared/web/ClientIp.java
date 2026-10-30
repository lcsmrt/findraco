package com.lcs.findraco.shared.web;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Injects the caller's IP address into a controller handler: the connection's remote address, which the
 * container has already replaced with the {@code X-Forwarded-For} client when the request comes through
 * the trusted proxy. Never read the header by hand: anyone can send it.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ClientIp {}
