package com.lab56.orchid_management.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Orchid")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orchid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Integer orchidId;

    @Column(name = "OrchidName", nullable = false)
    private String orchidName;

    @Column(name = "isNatural")
    private Boolean isNatural;

    @Column(name = "orchidDescription", length = 500)
    private String orchidDescription;

    @Column(name = "orchidCategory")
    private String orchidCategory;

    @Column(name = "isAttractive")
    private Boolean isAttractive;

    @Column(name = "orchidURL")
    private String orchidURL;
}
