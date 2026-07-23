package com.example.A3NguyenNgocKhoi_SBA301.controller;

import com.example.A3NguyenNgocKhoi_SBA301.dto.RoomRequest;
import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomInformation;
import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomType;
import com.example.A3NguyenNgocKhoi_SBA301.repository.BookingDetailRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.RoomInformationRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.RoomTypeRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomInformationRepository roomInformationRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public RoomController(RoomInformationRepository roomInformationRepository,
                          RoomTypeRepository roomTypeRepository,
                          BookingDetailRepository bookingDetailRepository) {
        this.roomInformationRepository = roomInformationRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingDetailRepository = bookingDetailRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoomInformation>> getAllRooms(
            @RequestParam(value = "all", required = false, defaultValue = "false") boolean all) {
        
        boolean isStaff = SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));

        if (isStaff || all) {
            return ResponseEntity.ok(roomInformationRepository.findAll());
        } else {
            return ResponseEntity.ok(roomInformationRepository.findByRoomStatus(1)); // 1 = Active/Available
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomInformation>> searchRooms(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(roomInformationRepository.findAll());
        }
        return ResponseEntity.ok(roomInformationRepository.searchRooms(query.trim()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        RoomInformation room = roomInformationRepository.findById(id).orElse(null);
        if (room == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(room);
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomRequest roomRequest) {
        if (roomInformationRepository.findByRoomNumber(roomRequest.getRoomNumber()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room number already exists");
            return ResponseEntity.badRequest().body(response);
        }

        RoomType roomType = roomTypeRepository.findById(roomRequest.getRoomTypeID()).orElse(null);
        if (roomType == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room Type not found");
            return ResponseEntity.badRequest().body(response);
        }

        RoomInformation room = new RoomInformation();
        updateRoomFields(room, roomRequest, roomType);
        roomInformationRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomRequest roomRequest) {
        RoomInformation room = roomInformationRepository.findById(id).orElse(null);
        if (room == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // If room number changes, verify it doesn't collide
        if (!room.getRoomNumber().equalsIgnoreCase(roomRequest.getRoomNumber()) &&
                roomInformationRepository.findByRoomNumber(roomRequest.getRoomNumber()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room number already exists");
            return ResponseEntity.badRequest().body(response);
        }

        RoomType roomType = roomTypeRepository.findById(roomRequest.getRoomTypeID()).orElse(null);
        if (roomType == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room Type not found");
            return ResponseEntity.badRequest().body(response);
        }

        updateRoomFields(room, roomRequest, roomType);
        roomInformationRepository.save(room);

        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        RoomInformation room = roomInformationRepository.findById(id).orElse(null);
        if (room == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Room not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        boolean hasBookings = bookingDetailRepository.existsByRoomInformationRoomID(id);

        if (hasBookings) {
            // Soft delete: change status to 2 (Inactive/Deleted per Postman spec)
            room.setRoomStatus(2);
            roomInformationRepository.save(room);
            return ResponseEntity.noContent().build();
        } else {
            // Hard delete
            roomInformationRepository.delete(room);
            return ResponseEntity.noContent().build();
        }
    }

    private void updateRoomFields(RoomInformation room, RoomRequest request, RoomType type) {
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomDetailDescription(request.getRoomDetailDescription());
        room.setRoomMaxCapacity(request.getRoomMaxCapacity());
        room.setRoomType(type);
        room.setRoomStatus(request.getRoomStatus());
        room.setRoomPricePerDay(request.getRoomPricePerDay());
    }
}
