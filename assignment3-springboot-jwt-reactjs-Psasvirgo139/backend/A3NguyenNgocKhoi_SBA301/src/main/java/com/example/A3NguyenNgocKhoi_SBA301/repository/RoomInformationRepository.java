package com.example.A3NguyenNgocKhoi_SBA301.repository;

import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Long> {
    Optional<RoomInformation> findByRoomNumber(String roomNumber);
    List<RoomInformation> findByRoomStatus(Integer roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.roomType.roomTypeName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<RoomInformation> searchRooms(@Param("query") String query);
}
