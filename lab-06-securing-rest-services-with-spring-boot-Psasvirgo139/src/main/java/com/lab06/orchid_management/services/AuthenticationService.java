package com.lab06.orchid_management.services;

import com.lab06.orchid_management.dtos.AuthResponse;
import com.lab06.orchid_management.dtos.LoginRequest;
import com.lab06.orchid_management.dtos.RegisterRequest;
import com.lab06.orchid_management.entities.Role;
import com.lab06.orchid_management.entities.User;
import com.lab06.orchid_management.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Đăng ký tài khoản mới.
     * - Mã hoá password trước khi lưu vào DB
     * - Gán role USER mặc định
     * - Tạo JWT và trả về
     */
    public AuthResponse signup(RegisterRequest request) {
        // Kiểm tra email đã tồn tại chưa
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng: " + request.email());
        }

        var user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))  // BCrypt hash
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    /**
     * Đăng nhập.
     * - AuthenticationManager kiểm tra email/password
     * - Nếu sai → ném BadCredentialsException → Spring trả 401 tự động
     * - Nếu đúng → tạo JWT và trả về
     */
    public AuthResponse authenticate(LoginRequest request) {
        // Spring Security xác thực: load user, so sánh password BCrypt
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        var user = userRepository.findByEmail(request.email()).orElseThrow();
        var token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }
}
