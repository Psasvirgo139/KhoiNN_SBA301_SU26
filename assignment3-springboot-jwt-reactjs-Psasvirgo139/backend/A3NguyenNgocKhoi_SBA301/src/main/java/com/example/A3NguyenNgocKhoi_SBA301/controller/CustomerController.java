package com.example.A3NguyenNgocKhoi_SBA301.controller;

import com.example.A3NguyenNgocKhoi_SBA301.dto.CustomerRequest;
import com.example.A3NguyenNgocKhoi_SBA301.dto.ProfileUpdateRequest;
import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import com.example.A3NguyenNgocKhoi_SBA301.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerController(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // Customer Self-Profile Endpoints
    // ==========================================

    @GetMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(email).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer profile not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(email).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer profile not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        customer.setCustomerFullName(request.getCustomerFullName());
        customer.setTelephone(request.getTelephone());
        customer.setCustomerBirthday(request.getCustomerBirthday());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getPassword().length() < 6) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Password must be at least 6 characters long");
                return ResponseEntity.badRequest().body(response);
            }
            customer.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        customerRepository.save(customer);
        return ResponseEntity.ok(customer);
    }

    // ==========================================
    // Staff-Only Administration Endpoints
    // ==========================================

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<List<Customer>> searchCustomers(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(customerRepository.findAll());
        }
        return ResponseEntity.ok(customerRepository.searchCustomers(query.trim()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> getCustomerById(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerRequest customerRequest) {
        if (customerRepository.findByEmailAddress(customerRequest.getEmailAddress()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email Address already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        if (customerRequest.getPassword() == null || customerRequest.getPassword().trim().isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Password is required for new customer");
            return ResponseEntity.badRequest().body(response);
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(customerRequest.getCustomerFullName());
        customer.setTelephone(customerRequest.getTelephone());
        customer.setEmailAddress(customerRequest.getEmailAddress());
        customer.setCustomerBirthday(customerRequest.getCustomerBirthday());
        customer.setCustomerStatus(customerRequest.getCustomerStatus() != null ? customerRequest.getCustomerStatus() : 1);
        customer.setPassword(passwordEncoder.encode(customerRequest.getPassword()));

        customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(customer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequest customerRequest) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Email changes check
        if (!customer.getEmailAddress().equalsIgnoreCase(customerRequest.getEmailAddress()) &&
                customerRepository.findByEmailAddress(customerRequest.getEmailAddress()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email Address already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        customer.setCustomerFullName(customerRequest.getCustomerFullName());
        customer.setTelephone(customerRequest.getTelephone());
        customer.setEmailAddress(customerRequest.getEmailAddress());
        customer.setCustomerBirthday(customerRequest.getCustomerBirthday());
        customer.setCustomerStatus(customerRequest.getCustomerStatus());

        if (customerRequest.getPassword() != null && !customerRequest.getPassword().trim().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(customerRequest.getPassword()));
        }

        customerRepository.save(customer);
        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Customer not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Soft delete: toggle status to 0 (Inactive)
        customer.setCustomerStatus(0);
        customerRepository.save(customer);

        return ResponseEntity.noContent().build();
    }
}
