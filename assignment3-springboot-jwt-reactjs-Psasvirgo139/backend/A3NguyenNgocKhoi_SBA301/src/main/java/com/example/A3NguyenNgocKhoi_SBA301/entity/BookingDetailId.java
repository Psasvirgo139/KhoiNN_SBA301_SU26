package com.example.A3NguyenNgocKhoi_SBA301.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class BookingDetailId implements Serializable {

    @Column(name = "BookingReservationID")
    private Long bookingReservationID;

    @Column(name = "RoomID")
    private Long roomID;

    public BookingDetailId() {}

    public BookingDetailId(Long bookingReservationID, Long roomID) {
        this.bookingReservationID = bookingReservationID;
        this.roomID = roomID;
    }

    public Long getBookingReservationID() {
        return bookingReservationID;
    }

    public void setBookingReservationID(Long bookingReservationID) {
        this.bookingReservationID = bookingReservationID;
    }

    public Long getRoomID() {
        return roomID;
    }

    public void setRoomID(Long roomID) {
        this.roomID = roomID;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BookingDetailId that = (BookingDetailId) o;
        return Objects.equals(bookingReservationID, that.bookingReservationID) &&
               Objects.equals(roomID, that.roomID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(bookingReservationID, roomID);
    }
}
