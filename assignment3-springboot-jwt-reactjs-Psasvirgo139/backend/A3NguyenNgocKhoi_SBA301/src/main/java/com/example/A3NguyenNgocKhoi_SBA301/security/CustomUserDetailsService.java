package com.example.A3NguyenNgocKhoi_SBA301.security;

import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import com.example.A3NguyenNgocKhoi_SBA301.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final String staffEmail;
    private final String staffPassword;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(
            CustomerRepository customerRepository,
            @Value("${app.staff.email}") String staffEmail,
            @Value("${app.staff.password}") String staffPassword,
            PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.staffEmail = staffEmail;
        this.staffPassword = staffPassword;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Check if it's the Staff account
        if (staffEmail.equalsIgnoreCase(email)) {
            // Encode the staff password dynamically so Security matches it correctly
            return new User(
                    staffEmail,
                    passwordEncoder.encode(staffPassword),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_STAFF"))
            );
        }

        // 2. Otherwise check the Customer database
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (customer.getCustomerStatus() != 1) {
            throw new UsernameNotFoundException("Account is inactive");
        }

        return new User(
                customer.getEmailAddress(),
                customer.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
        );
    }
}
