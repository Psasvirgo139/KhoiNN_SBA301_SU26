package com.fu.A2Khoi_sba301.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * TODO-04: DTO + Validation cho NewsArticle
 */
public record NewsArticleRequest(
        @NotBlank(message = "NewsArticleId is required")
        @Size(max = 20, message = "NewsArticleId must be at most 20 characters")
        String newsArticleId,

        @Size(max = 400, message = "NewsTitle must be at most 400 characters")
        String newsTitle,

        @NotBlank(message = "Headline is required")
        @Size(max = 150, message = "Headline must be at most 150 characters")
        String headline,

        @Size(max = 4000, message = "NewsContent must be at most 4000 characters")
        String newsContent,

        @Size(max = 400, message = "NewsSource must be at most 400 characters")
        String newsSource,

        @NotNull(message = "CategoryId is required")
        Short categoryId,

        @NotNull(message = "NewsStatus is required")
        Boolean newsStatus,

        @NotNull(message = "CreatedById is required")
        Short createdById,

        List<Integer> tagIds
) {
}
