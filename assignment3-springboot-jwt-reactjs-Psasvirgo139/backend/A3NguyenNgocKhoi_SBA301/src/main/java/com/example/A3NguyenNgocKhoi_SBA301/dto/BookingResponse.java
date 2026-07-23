package com.example.A3NguyenNgocKhoi_SBA301.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BookingResponse {

    private Long bookingReservationID;
    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private Long customerID;
    private String customerFullName;
    private String customerEmail;
    private Integer bookingStatus;
    private List<BookingDetailResponse> bookingDetails;

    public BookingResponse() {}

    public BookingResponse(Long bookingReservationID, LocalDate bookingDate, BigDecimal totalPrice,
                           Long customerID, String customerFullName, String customerEmail,
                           Integer bookingStatus, List<BookingDetailResponse> bookingDetails) {
        this.bookingReservationID = bookingReservationID;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.customerID = customerID;
        this.customerFullName = customerFullName;
        this.customerEmail = customerEmail;
        this.bookingStatus = bookingStatus;
        this.bookingDetails = bookingDetails;
    }

    public Long getBookingReservationID() {
        return bookingReservationID;
    }

    public void setBookingReservationID(Long bookingReservationID) {
        this.bookingReservationID = bookingReservationID;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Long customerID) {
        this.customerID = customerID;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Integer getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public List<BookingDetailResponse> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetailResponse> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}
