package com.lcs.findraco.shared.ratelimit;

/** Every limit the API enforces; each has its rule under {@code app.rate-limit.<name>}. */
public enum RateLimit {
    LOGIN_IP,
    LOGIN_EMAIL,
    FORGOT_EMAIL,
    FORGOT_IP,
    REGISTER_IP,
    IMPORT_USER
}
