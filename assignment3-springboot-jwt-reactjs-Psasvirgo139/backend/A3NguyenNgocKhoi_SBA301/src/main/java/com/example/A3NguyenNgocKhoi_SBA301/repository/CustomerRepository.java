package com.example.A3NguyenNgocKhoi_SBA301.repository;

import com.example.A3NguyenNgocKhoi_SBA301.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmailAddress(String emailAddress);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.customerFullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(@Param("query") String query);
}
