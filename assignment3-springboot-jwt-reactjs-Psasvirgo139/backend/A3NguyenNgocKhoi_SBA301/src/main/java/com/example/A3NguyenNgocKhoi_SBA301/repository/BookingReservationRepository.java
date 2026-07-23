package com.example.A3NguyenNgocKhoi_SBA301.repository;

import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Long> {
    List<BookingReservation> findByCustomerCustomerIDOrderByBookingDateDesc(Long customerID);
    List<BookingReservation> findAllByOrderByBookingDateDesc();
}
