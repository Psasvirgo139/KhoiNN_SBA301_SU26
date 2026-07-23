package com.fu.A2Khoi_sba301.dto;

import jakarta.validation.constraints.*;

/**
 * TODO-04: DTO + Validation cho SystemAccount
 */
public record AccountRequest(
        @NotNull(message = "AccountId is required")
        Short accountId,

        @NotBlank(message = "AccountName is required")
        @Size(max = 100, message = "AccountName must be at most 100 characters")
        String accountName,

        @NotBlank(message = "AccountEmail is required")
        @Email(message = "AccountEmail is invalid")
        @Size(max = 70, message = "AccountEmail must be at most 70 characters")
        String accountEmail,

        @NotNull(message = "AccountRole is required")
        @Min(value = 1, message = "AccountRole must be 1 (Admin) or 2 (Staff)")
        @Max(value = 2, message = "AccountRole must be 1 (Admin) or 2 (Staff)")
        Integer accountRole,

        @NotBlank(message = "AccountPassword is required")
        @Size(max = 70, message = "AccountPassword must be at most 70 characters")
        String accountPassword
) {
}
