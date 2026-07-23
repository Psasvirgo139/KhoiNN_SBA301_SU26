package com.fu.A2Khoi_sba301.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * TODO-02: Entity NewsArticle (NewsStatus: 1 = active, 0 = inactive)
 * Quan he N-N voi Tag qua bang trung gian NewsTag.
 */
@Entity
@Table(name = "NewsArticle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 20)
    private String newsArticleId;

    @Column(name = "NewsTitle", length = 400)
    private String newsTitle;

    @Column(name = "Headline", nullable = false, length = 150)
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", length = 4000)
    private String newsContent;

    @Column(name = "NewsSource", length = 400)
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @Column(name = "UpdatedByID")
    private Short updatedById;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID"))
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
