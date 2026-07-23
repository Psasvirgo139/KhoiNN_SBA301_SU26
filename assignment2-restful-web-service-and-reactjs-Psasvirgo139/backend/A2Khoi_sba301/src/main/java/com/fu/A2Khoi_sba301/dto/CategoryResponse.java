package com.fu.A2Khoi_sba301.dto;

import com.fu.A2Khoi_sba301.entity.Category;

/**
 * TODO-04: Response DTO cho Category
 */
public record CategoryResponse(
        Short categoryId,
        String categoryName,
        String categoryDescription,
        Short parentCategoryId,
        String parentCategoryName,
        Boolean isActive
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategory() != null ? c.getParentCategory().getCategoryId() : null,
                c.getParentCategory() != null ? c.getParentCategory().getCategoryName() : null,
                c.getIsActive());
    }
}
