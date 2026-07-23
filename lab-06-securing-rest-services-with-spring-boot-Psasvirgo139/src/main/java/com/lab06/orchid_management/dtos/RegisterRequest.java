package com.lab06.orchid_management.dtos;

public record RegisterRequest(
        String fullName,
        String email,
        String password) {
}
