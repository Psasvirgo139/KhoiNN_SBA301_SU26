package com.fu.A2Khoi_sba301.dto;

import com.fu.A2Khoi_sba301.entity.NewsArticle;
import com.fu.A2Khoi_sba301.entity.Tag;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

/**
 * TODO-04: Response DTO cho NewsArticle (kem category, nguoi tao, tags)
 */
public record NewsArticleResponse(
        String newsArticleId,
        String newsTitle,
        String headline,
        LocalDateTime createdDate,
        String newsContent,
        String newsSource,
        Short categoryId,
        String categoryName,
        Boolean newsStatus,
        Short createdById,
        String createdByName,
        Short updatedById,
        LocalDateTime modifiedDate,
        List<TagResponse> tags
) {
    public record TagResponse(Integer tagId, String tagName, String note) {
        public static TagResponse from(Tag t) {
            return new TagResponse(t.getTagId(), t.getTagName(), t.getNote());
        }
    }

    public static NewsArticleResponse from(NewsArticle n) {
        return new NewsArticleResponse(
                n.getNewsArticleId(),
                n.getNewsTitle(),
                n.getHeadline(),
                n.getCreatedDate(),
                n.getNewsContent(),
                n.getNewsSource(),
                n.getCategory() != null ? n.getCategory().getCategoryId() : null,
                n.getCategory() != null ? n.getCategory().getCategoryName() : null,
                n.getNewsStatus(),
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountId() : null,
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountName() : null,
                n.getUpdatedById(),
                n.getModifiedDate(),
                n.getTags().stream()
                        .sorted(Comparator.comparing(Tag::getTagId))
                        .map(TagResponse::from)
                        .toList());
    }
}
