package com.fu.A2Khoi_sba301.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * TODO-02: Entity Category (IsActive: 1 = active, 0 = inactive)
 */
@Entity
@Table(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryId;

    @Column(name = "CategoryName", nullable = false, length = 100)
    private String categoryName;

    // Ten cot trong DB goc bi typo "CategoryDesciption" - giu nguyen de khop DB
    @Column(name = "CategoryDesciption", nullable = false, length = 250)
    private String categoryDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategory;

    @Column(name = "IsActive")
    private Boolean isActive;
}
