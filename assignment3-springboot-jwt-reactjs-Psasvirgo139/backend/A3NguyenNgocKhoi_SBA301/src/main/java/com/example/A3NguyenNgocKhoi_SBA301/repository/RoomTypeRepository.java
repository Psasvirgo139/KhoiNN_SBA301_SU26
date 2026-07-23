package com.example.A3NguyenNgocKhoi_SBA301.repository;

import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
}
