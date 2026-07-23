package com.example.A3NguyenNgocKhoi_SBA301.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "Customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerid")
    private Long customerID;

    @NotBlank(message = "Customer full name is required")
    @Size(max = 100)
    @Column(name = "customer_full_name", nullable = false)
    private String customerFullName;

    @NotBlank(message = "Telephone is required")
    @Size(max = 20)
    @Column(name = "telephone", nullable = false)
    private String telephone;

    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    @Column(name = "email_address", nullable = false, unique = true)
    private String emailAddress;

    @NotNull(message = "Birthday is required")
    @Column(name = "customer_birthday", nullable = false)
    private LocalDate customerBirthday;

    @NotNull(message = "Customer status is required")
    @Column(name = "customer_status", nullable = false)
    private Integer customerStatus;

    @NotBlank(message = "Password is required")
    @Size(max = 100)
    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public Customer() {}

    public Long getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Long customerID) {
        this.customerID = customerID;
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Integer getCustomerStatus() {
        return customerStatus;
    }

    public void setCustomerStatus(Integer customerStatus) {
        this.customerStatus = customerStatus;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
