package com.lcs.findraco.transaction.controller;

import com.lcs.findraco.shared.web.ApiRoutes;

public final class TransactionRoutes {
    public static final String TRANSACTION = ApiRoutes.PLAN + "/{planId}/transaction";

    public static final String TRASH = TRANSACTION + "/trash";

    private TransactionRoutes() {}
}
