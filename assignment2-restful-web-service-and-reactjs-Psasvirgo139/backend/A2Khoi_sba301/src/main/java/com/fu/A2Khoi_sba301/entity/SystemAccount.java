package com.fu.A2Khoi_sba301.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * TODO-02: Entity SystemAccount (AccountRole: 1 = Admin, 2 = Staff)
 */
@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @Column(name = "AccountID")
    private Short accountId;

    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Column(name = "AccountEmail", length = 70, unique = true)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @Column(name = "AccountPassword", length = 70)
    @JsonIgnore
    private String accountPassword;

    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    @Builder.Default
    private List<NewsArticle> newsArticles = new ArrayList<>();
}
