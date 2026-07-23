package com.example.A3NguyenNgocKhoi_SBA301.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "BookingReservation")
public class BookingReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingReservationID")
    private Long bookingReservationID;

    @NotNull(message = "Booking date is required")
    @Column(name = "BookingDate", nullable = false)
    private LocalDate bookingDate;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", message = "Total price must be at least 0")
    @Column(name = "TotalPrice", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalPrice;

    @NotNull(message = "Customer is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CustomerID", nullable = false)
    private Customer customer;

    // BookingStatus: 1 for active/confirmed, 0 for cancelled/inactive
    @NotNull(message = "Booking status is required")
    @Column(name = "BookingStatus", nullable = false)
    private Integer bookingStatus;

    @OneToMany(mappedBy = "bookingReservation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<BookingDetail> bookingDetails = new ArrayList<>();

    public BookingReservation() {}

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

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Integer getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(Integer bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public List<BookingDetail> getBookingDetails() {
        return bookingDetails;
    }

    public void setBookingDetails(List<BookingDetail> bookingDetails) {
        this.bookingDetails = bookingDetails;
    }
}
