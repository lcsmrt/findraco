package com.lcs.findraco.shared.web;

/** Custom request headers the API reads, named once for the code that reads them and for CORS. */
public final class RequestHeaders {

    /** The device's IANA time zone, sent by the web client on every request. */
    public static final String TIME_ZONE = "Time-Zone";

    private RequestHeaders() {}
}
