package com.example.A3NguyenNgocKhoi_SBA301.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "BookingDetail")
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id = new BookingDetailId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("bookingReservationID")
    @JoinColumn(name = "BookingReservationID")
    @JsonIgnore
    private BookingReservation bookingReservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("roomID")
    @JoinColumn(name = "RoomID")
    private RoomInformation roomInformation;

    @NotNull(message = "Start date is required")
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "Actual price is required")
    @DecimalMin(value = "0.0", message = "Actual price must be at least 0")
    @Column(name = "ActualPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal actualPrice;

    public BookingDetail() {}

    public BookingDetailId getId() {
        return id;
    }

    public void setId(BookingDetailId id) {
        this.id = id;
    }

    public BookingReservation getBookingReservation() {
        return bookingReservation;
    }

    public void setBookingReservation(BookingReservation bookingReservation) {
        this.bookingReservation = bookingReservation;
        if (bookingReservation != null && bookingReservation.getBookingReservationID() != null) {
            this.id.setBookingReservationID(bookingReservation.getBookingReservationID());
        }
    }

    public RoomInformation getRoomInformation() {
        return roomInformation;
    }

    public void setRoomInformation(RoomInformation roomInformation) {
        this.roomInformation = roomInformation;
        if (roomInformation != null) {
            this.id.setRoomID(roomInformation.getRoomID());
        }
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
