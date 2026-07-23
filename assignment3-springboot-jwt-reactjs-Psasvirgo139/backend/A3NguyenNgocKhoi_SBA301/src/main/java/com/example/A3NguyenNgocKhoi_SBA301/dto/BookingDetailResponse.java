package com.example.A3NguyenNgocKhoi_SBA301.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingDetailResponse {

    private Long roomID;
    private String roomNumber;
    private String roomTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal actualPrice;

    public BookingDetailResponse() {}

    public BookingDetailResponse(Long roomID, String roomNumber, String roomTypeName, LocalDate startDate, LocalDate endDate, BigDecimal actualPrice) {
        this.roomID = roomID;
        this.roomNumber = roomNumber;
        this.roomTypeName = roomTypeName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.actualPrice = actualPrice;
    }

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

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getActualPrice() {
        return actualPrice;
    }

    public void setActualPrice(BigDecimal actualPrice) {
        this.actualPrice = actualPrice;
    }
}
