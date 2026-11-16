package com.lcs.findraco.auth.controller;

/** The authorization server's own routes, outside {@code /api}: Spring serves its OAuth endpoints under the same prefix. */
public final class OAuthRoutes {
    public static final String OAUTH = "/oauth2";
    public static final String CLIENT_INFO = OAUTH + "/client-info";
    public static final String LOGIN = OAUTH + "/login";
    public static final String AUTHORIZE = OAUTH + "/authorize";

    private OAuthRoutes() {}
}
