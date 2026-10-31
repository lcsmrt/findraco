package com.lcs.findraco.shared.web;

/** The API prefix and the plan root every plan-scoped route hangs from; each feature owns its routes. */
public final class ApiRoutes {
    public static final String BASE = "/api/findraco";
    public static final String PLAN = BASE + "/plan";

    private ApiRoutes() {}
}
