package com.fu.A2Khoi_sba301.dto;

import com.fu.A2Khoi_sba301.entity.SystemAccount;

/**
 * TODO-04: Response DTO cho SystemAccount (khong tra ve password)
 */
public record AccountResponse(
        Short accountId,
        String accountName,
        String accountEmail,
        Integer accountRole
) {
    public static AccountResponse from(SystemAccount a) {
        return new AccountResponse(a.getAccountId(), a.getAccountName(), a.getAccountEmail(), a.getAccountRole());
    }
}
