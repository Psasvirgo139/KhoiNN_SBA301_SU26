package com.example.A3NguyenNgocKhoi_SBA301.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "RoomType")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Long roomTypeID;

    @NotBlank(message = "Room type name is required")
    @Size(max = 100)
    @Column(name = "RoomTypeName", nullable = false)
    private String roomTypeName;

    @Size(max = 250)
    @Column(name = "TypeDescription")
    private String typeDescription;

    @Size(max = 250)
    @Column(name = "TypeNote")
    private String typeNote;

    public RoomType() {}

    public RoomType(String roomTypeName, String typeDescription, String typeNote) {
        this.roomTypeName = roomTypeName;
        this.typeDescription = typeDescription;
        this.typeNote = typeNote;
    }

    public Long getRoomTypeID() {
        return roomTypeID;
    }

    public void setRoomTypeID(Long roomTypeID) {
        this.roomTypeID = roomTypeID;
    }

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public String getTypeDescription() {
        return typeDescription;
    }

    public void setTypeDescription(String typeDescription) {
        this.typeDescription = typeDescription;
    }

    public String getTypeNote() {
        return typeNote;
    }

    public void setTypeNote(String typeNote) {
        this.typeNote = typeNote;
    }
}
