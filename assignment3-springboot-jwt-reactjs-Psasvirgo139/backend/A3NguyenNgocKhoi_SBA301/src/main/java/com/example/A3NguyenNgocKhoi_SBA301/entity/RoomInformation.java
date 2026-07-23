package com.example.A3NguyenNgocKhoi_SBA301.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Entity
@Table(name = "RoomInformation")
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Long roomID;

    @NotBlank(message = "Room number is required")
    @Size(max = 50)
    @Column(name = "RoomNumber", nullable = false, unique = true)
    private String roomNumber;

    @Size(max = 250)
    @Column(name = "RoomDetailDescription")
    private String roomDetailDescription;

    @Min(value = 1, message = "Room capacity must be at least 1")
    @Column(name = "RoomMaxCapacity", nullable = false)
    private Integer roomMaxCapacity;

    @NotNull(message = "Room Type is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomTypeID", nullable = false)
    private RoomType roomType;

    // RoomStatus can be 1 for Active (available), 0 for Inactive (disabled/occupied/soft-deleted)
    @NotNull(message = "Room status is required")
    @Column(name = "RoomStatus", nullable = false)
    private Integer roomStatus;

    @NotNull(message = "Room price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Room price must be greater than 0")
    @Column(name = "RoomPricePerDay", nullable = false, precision = 18, scale = 2)
    private BigDecimal roomPricePerDay;

    public RoomInformation() {}

    public Long getRoomID() {
        return roomID;
    }

    public void setRoomID(Long roomID) {
        this.roomID = roomID;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public Integer getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Integer roomStatus) {
        this.roomStatus = roomStatus;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }
}
