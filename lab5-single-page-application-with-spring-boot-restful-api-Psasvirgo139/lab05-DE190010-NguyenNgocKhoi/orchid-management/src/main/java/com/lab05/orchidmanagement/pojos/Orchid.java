package com.lab05.orchidmanagement.pojos;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Orchid")
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

    // No-arg constructor
    public Orchid() {
    }

    // Getters and Setters
    public Integer getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(Integer orchidId) {
        this.orchidId = orchidId;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public Boolean getIsNatural() {
        return isNatural;
    }

    public void setIsNatural(Boolean isNatural) {
        this.isNatural = isNatural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(String orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public Boolean getIsAttractive() {
        return isAttractive;
    }

    public void setIsAttractive(Boolean isAttractive) {
        this.isAttractive = isAttractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }
}
