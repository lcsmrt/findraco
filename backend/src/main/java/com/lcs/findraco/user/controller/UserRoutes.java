package com.lcs.findraco.user.controller;

import com.lcs.findraco.shared.web.ApiRoutes;

public final class UserRoutes {
    public static final String USER = ApiRoutes.BASE + "/user";

    public static final String TIME_ZONE = USER + "/me/time-zone";

    public static final String LANGUAGE = USER + "/me/language";

    private UserRoutes() {}
}
