package com.fu.A2Khoi_sba301.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * TODO-04: DTO + Validation cho Category
 */
public record CategoryRequest(
        @NotBlank(message = "CategoryName is required")
        @Size(max = 100, message = "CategoryName must be at most 100 characters")
        String categoryName,

        @NotBlank(message = "CategoryDescription is required")
        @Size(max = 250, message = "CategoryDescription must be at most 250 characters")
        String categoryDescription,

        Short parentCategoryId,

        @NotNull(message = "IsActive is required")
        Boolean isActive
) {
}
