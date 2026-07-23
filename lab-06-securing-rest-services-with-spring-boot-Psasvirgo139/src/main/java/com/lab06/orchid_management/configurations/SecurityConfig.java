package com.lab06.orchid_management.configurations;

import com.lab06.orchid_management.filters.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // Cho phép dùng @PreAuthorize trên method
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Tắt CSRF – REST API không dùng session/cookie nên không cần CSRF protection
            .csrf(AbstractHttpConfigurer::disable)

            // Cấu hình quyền truy cập từng endpoint
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()    // /auth/signup, /auth/login: public
                .anyRequest().authenticated()               // Còn lại: phải đăng nhập
            )

            // Stateless: không lưu session, mỗi request tự xác thực bằng JWT
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Đăng ký authentication provider
            .authenticationProvider(authenticationProvider)

            // Thêm JWT filter TRƯỚC filter mặc định của Spring Security
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
