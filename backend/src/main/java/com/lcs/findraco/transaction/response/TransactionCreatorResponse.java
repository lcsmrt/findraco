package com.lcs.findraco.transaction.response;

import com.lcs.findraco.user.model.User;

public record TransactionCreatorResponse(Long id, String name) {

    public static TransactionCreatorResponse from(User user) {
        return new TransactionCreatorResponse(user.getId(), user.getName());
    }
}
