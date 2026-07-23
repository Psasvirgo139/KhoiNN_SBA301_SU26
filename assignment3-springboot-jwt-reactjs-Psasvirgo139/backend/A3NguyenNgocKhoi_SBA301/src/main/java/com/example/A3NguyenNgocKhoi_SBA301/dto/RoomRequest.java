package com.example.A3NguyenNgocKhoi_SBA301.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class RoomRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 50)
    private String roomNumber;

    @Size(max = 250)
    private String roomDetailDescription;

    @Min(value = 1, message = "Room capacity must be at least 1")
    private Integer roomMaxCapacity;

    @NotNull(message = "Room Type ID is required")
    private Long roomTypeID;

    @NotNull(message = "Room status is required")
    private Integer roomStatus;

    @NotNull(message = "Room price per day is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Room price must be greater than 0")
    private BigDecimal roomPricePerDay;

    public RoomRequest() {}

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

    public Long getRoomTypeID() {
        return roomTypeID;
    }

    public void setRoomTypeID(Long roomTypeID) {
        this.roomTypeID = roomTypeID;
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
