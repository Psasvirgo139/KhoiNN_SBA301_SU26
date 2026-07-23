package com.fu.A2Khoi_sba301.controller;

import com.fu.A2Khoi_sba301.dto.AccountResponse;
import com.fu.A2Khoi_sba301.dto.LoginRequest;
import com.fu.A2Khoi_sba301.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * TODO-06: REST Controller - Auth
 * POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AccountResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
