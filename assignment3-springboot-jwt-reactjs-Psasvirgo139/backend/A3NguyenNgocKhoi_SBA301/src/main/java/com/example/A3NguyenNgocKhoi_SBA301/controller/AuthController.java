package com.example.A3NguyenNgocKhoi_SBA301.controller;

import com.example.A3NguyenNgocKhoi_SBA301.dto.AuthResponse;
import com.example.A3NguyenNgocKhoi_SBA301.dto.LoginRequest;
import com.example.A3NguyenNgocKhoi_SBA301.dto.RegisterRequest;
import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import com.example.A3NguyenNgocKhoi_SBA301.repository.CustomerRepository;
import com.example.A3NguyenNgocKhoi_SBA301.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.staff.email}")
    private String staffEmail;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          CustomerRepository customerRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String rawRole = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("ROLE_CUSTOMER");

            String role = rawRole.replace("ROLE_", "");

            String fullName = "Hotel Staff";
            if (role.equals("CUSTOMER") || rawRole.equals("ROLE_CUSTOMER")) {
                Customer customer = customerRepository.findByEmailAddress(userDetails.getUsername()).orElse(null);
                if (customer != null) {
                    fullName = customer.getCustomerFullName();
                }
            }

            return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), role, fullName));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        if (staffEmail.equalsIgnoreCase(registerRequest.getEmailAddress())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email is reserved for staff usage");
            return ResponseEntity.badRequest().body(response);
        }

        if (customerRepository.findByEmailAddress(registerRequest.getEmailAddress()).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Email address already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(registerRequest.getCustomerFullName());
        customer.setTelephone(registerRequest.getTelephone());
        customer.setEmailAddress(registerRequest.getEmailAddress());
        customer.setCustomerBirthday(registerRequest.getCustomerBirthday());
        customer.setCustomerStatus(1); // 1 = Active/Enabled
        customer.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        customerRepository.save(customer);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Customer registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
