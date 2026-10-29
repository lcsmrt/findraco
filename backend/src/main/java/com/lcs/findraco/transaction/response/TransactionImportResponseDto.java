package com.lcs.findraco.transaction.response;

public class TransactionImportResponseDto {
    private final int imported;

    public TransactionImportResponseDto(int imported) {
        this.imported = imported;
    }

    public int getImported() {
        return imported;
    }
}
