package com.lab56.orchid_management.dtos;

import jakarta.validation.constraints.*;

public record LoginRequest(
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    String email,

    @NotBlank(message = "Mật khẩu không được để trống")
    String password
) {}
