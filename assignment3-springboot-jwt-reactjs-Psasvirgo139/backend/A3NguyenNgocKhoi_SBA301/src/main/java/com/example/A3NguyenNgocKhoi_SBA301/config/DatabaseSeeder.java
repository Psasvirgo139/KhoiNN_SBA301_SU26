package com.example.A3NguyenNgocKhoi_SBA301.config;

import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomInformation;
import com.example.A3NguyenNgocKhoi_SBA301.entity.RoomType;
import com.example.A3NguyenNgocKhoi_SBA301.repository.CustomerRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.RoomInformationRepository;
import com.example.A3NguyenNgocKhoi_SBA301.repository.RoomTypeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomInformationRepository roomInformationRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(RoomTypeRepository roomTypeRepository,
                          RoomInformationRepository roomInformationRepository,
                          CustomerRepository customerRepository,
                          PasswordEncoder passwordEncoder) {
        this.roomTypeRepository = roomTypeRepository;
        this.roomInformationRepository = roomInformationRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roomTypeRepository.count() == 0) {
            // Seed Room Types
            RoomType single = roomTypeRepository.save(new RoomType("Standard Single", "One single bed, perfect for solo travelers.", "No smoking"));
            RoomType doubleRoom = roomTypeRepository.save(new RoomType("Standard Double", "One double bed, perfect for couples.", "Minibar included"));
            RoomType suite = roomTypeRepository.save(new RoomType("Deluxe Suite", "Spacious suite with king bed and city view.", "VIP welcome drink"));

            // Seed Rooms
            roomInformationRepository.save(createRoom("101", "Cozy single room on the 1st floor", 1, single, 1, new BigDecimal("50.00")));
            roomInformationRepository.save(createRoom("102", "Cozy single room with balcony", 1, single, 1, new BigDecimal("55.00")));
            roomInformationRepository.save(createRoom("201", "Spacious double room on the 2nd floor", 2, doubleRoom, 1, new BigDecimal("80.00")));
            roomInformationRepository.save(createRoom("202", "Double room with garden view", 2, doubleRoom, 1, new BigDecimal("85.00")));
            roomInformationRepository.save(createRoom("301", "Luxury Suite with panorama view", 4, suite, 1, new BigDecimal("150.00")));
            
            System.out.println(">>> Database Seeded Room Types and Room Information successfully.");
        }

        if (customerRepository.count() == 0) {
            // Seed Test Customer
            Customer customer = new Customer();
            customer.setCustomerFullName("Nguyen Ngoc Khoi");
            customer.setTelephone("0901234567");
            customer.setEmailAddress("khoi@gmail.com");
            customer.setCustomerBirthday(LocalDate.of(1999, 1, 1));
            customer.setCustomerStatus(1); // 1 = Active
            customer.setPassword(passwordEncoder.encode("123456"));
            customerRepository.save(customer);

            System.out.println(">>> Database Seeded Test Customer (khoi@gmail.com) successfully.");
        }
    }

    private RoomInformation createRoom(String roomNumber, String description, int capacity, RoomType type, int status, BigDecimal price) {
        RoomInformation room = new RoomInformation();
        room.setRoomNumber(roomNumber);
        room.setRoomDetailDescription(description);
        room.setRoomMaxCapacity(capacity);
        room.setRoomType(type);
        room.setRoomStatus(status);
        room.setRoomPricePerDay(price);
        return room;
    }
}
