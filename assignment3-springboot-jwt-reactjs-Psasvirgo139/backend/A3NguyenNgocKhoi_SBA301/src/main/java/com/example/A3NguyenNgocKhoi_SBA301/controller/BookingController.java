package com.example.A3NguyenNgocKhoi_SBA301.controller;

import com.example.A3NguyenNgocKhoi_SBA301.dto.BookingDetailRequest;
import com.example.A3NguyenNgocKhoi_SBA301.dto.BookingDetailResponse;
import com.example.A3NguyenNgocKhoi_SBA301.dto.BookingRequest;
import com.example.A3NguyenNgocKhoi_SBA301.dto.BookingResponse;
import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingDetail;
import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingDetailId;
import com.example.A3NguyenNgocKhoi_SBA301.entity.BookingReservation;
import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomInformation;
import com.example.A3NguyenNgocKhoi_SBA301.repository.BookingDetailRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.BookingReservationRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.CustomerRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.RoomInformationRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingReservationRepository bookingReservationRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final CustomerRepository customerRepository;
    private final RoomInformationRepository roomInformationRepository;

    public BookingController(BookingReservationRepository bookingReservationRepository,
                              BookingDetailRepository bookingDetailRepository,
                              CustomerRepository customerRepository,
                              RoomInformationRepository roomInformationRepository) {
        this.bookingReservationRepository = bookingReservationRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.customerRepository = customerRepository;
        this.roomInformationRepository = roomInformationRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Transactional
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        List<BookingDetailRequest> detailsList = request.getNormalizedDetails();
        if (detailsList == null || detailsList.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Details list cannot be empty");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate date logic for each detail item
        for (BookingDetailRequest item : detailsList) {
            if (item.getStartDate() == null || item.getEndDate() == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Start date and end date are required");
                return ResponseEntity.badRequest().body(response);
            }
            if (item.getStartDate().isBefore(LocalDate.now())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Start date cannot be in the past");
                return ResponseEntity.badRequest().body(response);
            }
            if (!item.getEndDate().isAfter(item.getStartDate())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "End date must be after start date");
                return ResponseEntity.badRequest().body(response);
            }
        }

        String authName = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(authName).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer profile not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (customer.getCustomerStatus() != 1) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer account is inactive");
            return ResponseEntity.badRequest().body(response);
        }

        List<BookingDetail> details = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (BookingDetailRequest item : detailsList) {
            RoomInformation room = roomInformationRepository.findById(item.getRoomId()).orElse(null);
            if (room == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Room ID " + item.getRoomId() + " not found");
                return ResponseEntity.badRequest().body(response);
            }

            if (room.getRoomStatus() != 1) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Room " + room.getRoomNumber() + " is currently inactive or unavailable");
                return ResponseEntity.badRequest().body(response);
            }

            List<BookingDetail> conflicts = bookingDetailRepository.findOverlappingBookings(item.getRoomId(), item.getStartDate(), item.getEndDate());
            if (!conflicts.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Room " + room.getRoomNumber() + " is already booked during this period");
                return ResponseEntity.badRequest().body(response);
            }

            BookingDetail detail = new BookingDetail();
            detail.setRoomInformation(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            BigDecimal actualPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            detail.setActualPrice(actualPrice);

            totalPrice = totalPrice.add(actualPrice);
            details.add(detail);
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setCustomer(customer);
        reservation.setBookingDate(LocalDate.now());
        reservation.setBookingStatus(1);
        reservation.setTotalPrice(totalPrice);

        BookingReservation savedReservation = bookingReservationRepository.save(reservation);

        for (BookingDetail detail : details) {
            detail.setId(new BookingDetailId(savedReservation.getBookingReservationID(), detail.getRoomInformation().getRoomID()));
            detail.setBookingReservation(savedReservation);
            bookingDetailRepository.save(detail);
        }

        savedReservation = bookingReservationRepository.findById(savedReservation.getBookingReservationID()).orElse(savedReservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedReservation));
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingReservation> reservations = bookingReservationRepository.findAllByOrderByBookingDateDesc();
        List<BookingResponse> responses = reservations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        String authName = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(authName).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<BookingReservation> reservations = bookingReservationRepository.findByCustomerCustomerIDOrderByBookingDateDesc(customer.getCustomerID());
        List<BookingResponse> responses = reservations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'CUSTOMER')")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        BookingReservation reservation = bookingReservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Booking reservation not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        boolean isStaff = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STAFF"));
        if (!isStaff) {
            String authName = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!reservation.getCustomer().getEmailAddress().equalsIgnoreCase(authName)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(mapToResponse(reservation));
    }

    @PutMapping({"/{id}", "/{id}/status"})
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id,
                                                 @RequestParam(value = "status", required = false) Integer statusParam,
                                                 @RequestBody(required = false) Map<String, Object> body) {
        BookingReservation reservation = bookingReservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Booking reservation not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Integer status = statusParam;
        if (status == null && body != null && body.containsKey("status")) {
            Object s = body.get("status");
            if (s instanceof Number) {
                status = ((Number) s).intValue();
            }
        }
        if (status == null) {
            status = 1;
        }

        reservation.setBookingStatus(status);
        bookingReservationRepository.save(reservation);

        return ResponseEntity.ok(mapToResponse(reservation));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        BookingReservation reservation = bookingReservationRepository.findById(id).orElse(null);
        if (reservation == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Booking reservation not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        bookingReservationRepository.delete(reservation);
        return ResponseEntity.noContent().build();
    }

    private BookingResponse mapToResponse(BookingReservation res) {
        List<BookingDetailResponse> detailResponses = res.getBookingDetails().stream()
                .map(d -> new BookingDetailResponse(
                        d.getRoomInformation().getRoomID(),
                        d.getRoomInformation().getRoomNumber(),
                        d.getRoomInformation().getRoomType().getRoomTypeName(),
                        d.getStartDate(),
                        d.getEndDate(),
                        d.getActualPrice()
                ))
                .collect(Collectors.toList());

        return new BookingResponse(
                res.getBookingReservationID(),
                res.getBookingDate(),
                res.getTotalPrice(),
                res.getCustomer().getCustomerID(),
                res.getCustomer().getCustomerFullName(),
                res.getCustomer().getEmailAddress(),
                res.getBookingStatus(),
                detailResponses
        );
    }
}
