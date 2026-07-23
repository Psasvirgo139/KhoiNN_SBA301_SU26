package com.fu.A2Khoi_sba301.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * TODO-02: Entity Tag
 */
@Entity
@Table(name = "Tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @Column(name = "TagID")
    private Integer tagId;

    @Column(name = "TagName", length = 50)
    private String tagName;

    @Column(name = "Note", length = 400)
    private String note;
}
