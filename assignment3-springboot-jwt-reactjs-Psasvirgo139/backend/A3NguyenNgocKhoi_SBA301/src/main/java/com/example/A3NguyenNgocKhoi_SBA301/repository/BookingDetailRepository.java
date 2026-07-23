package com.example.A3NguyenNgocKhoi_SBA301.repository;

import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingDetail;
import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {
    
    // Check if room belongs to any booking detail (to fulfill room soft-delete logic)
    boolean existsByRoomInformationRoomID(Long roomID);

    // Find conflicting booking details for a room during a specified date range
    // Overlap condition: (StartA <= EndB) AND (EndA >= StartB)
    @Query("SELECT bd FROM BookingDetail bd " +
           "WHERE bd.roomInformation.roomID = :roomID " +
           "AND bd.bookingReservation.bookingStatus = 1 " + // Only count active bookings
           "AND bd.startDate <= :endDate " +
           "AND bd.endDate >= :startDate")
    List<BookingDetail> findOverlappingBookings(
            @Param("roomID") Long roomID,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
