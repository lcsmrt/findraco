package com.lcs.findraco.shared.web;

/** Custom request headers the API reads, named once for the code that reads them and for CORS. */
public final class RequestHeaders {

    /** The device's IANA time zone, sent by the web client on every request. */
    public static final String TIME_ZONE = "Time-Zone";

    /** The device's preferred languages, which a browser sends on every request. */
    public static final String ACCEPT_LANGUAGE = "Accept-Language";

    private RequestHeaders() {}
}
