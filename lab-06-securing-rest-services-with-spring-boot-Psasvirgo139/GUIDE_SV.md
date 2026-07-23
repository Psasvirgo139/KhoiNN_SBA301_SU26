# GUIDE_SV – Hướng dẫn Step-by-Step cho Lab 06

> **Dành cho sinh viên:** Đọc kỹ từng bước trước khi code. Mỗi bước có giải thích lý do để bạn hiểu chứ không chỉ copy-paste.

---
# Thông tin sinh viên
Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |
---

## Bước 0 – Chuẩn bị môi trường

Trước khi bắt đầu, đảm bảo đã cài:
- **JDK 17+** (`java -version` để kiểm tra)
- **IntelliJ IDEA** (Community hoặc Ultimate)
- **SQL Server** đang chạy, có database `OrchidDB`
- **Postman** để test API

Tạo database trong SQL Server Management Studio:
```sql
CREATE DATABASE OrchidDBJWT;
```

---

## Bước 1 – Tạo Spring Boot Project

### 1.1 Dùng Spring Initializr

Truy cập [https://start.spring.io](https://start.spring.io) với cấu hình:

| Trường | Giá trị |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | 4.x.x (mới nhất) |
| Group | `com.lab06` |
| Artifact | `orchid-management` |
| Packaging | Jar |
| Java | 21 |

**Dependencies cần chọn:**
- Spring Web
- Spring Security
- Spring Data JPA
- MS SQL Server Driver

Click **Generate** → Giải nén → Mở bằng IntelliJ IDEA.

### 1.2 Thêm JWT dependencies vào `pom.xml`

Mở `pom.xml`, thêm vào trong thẻ `<dependencies>`:

```xml
<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Lombok (giảm boilerplate code) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

Nhấn biểu tượng **Load Maven Changes** (hoặc Ctrl+Shift+O) để IntelliJ tải dependencies.

---

## Bước 2 – Cấu hình `application.properties`

Mở `src/main/resources/application.properties`:

```properties
# ===== Server =====
server.port=8005

# ===== SQL Server =====
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDBJWT;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourSQLServerPassword
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# ===== JPA =====
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# ===== JWT =====
# Secret key phải đủ dài (≥ 256-bit).
# Tạo scret key bằng terminal: openssl rand -hex 32
# copy mã tạo ra vào key
application.security.jwt.secret-key= key tạo ra
application.security.jwt.expiration=86400000
```

> **Lưu ý:** Thay `YourSQLServerPassword` bằng mật khẩu SQL Server của bạn.  
> **Secret key** phải là chuỗi Hex/Base64 đủ dài, KHÔNG đặt là chuỗi ngắn như "secret".

---

## Bước 3 – Tạo Entity và Enum

### 3.1 Tạo `Role.java`

Tạo file `src/main/java/com/lab06/entities/Role.java`:

```java
package com.lab06.entities;

public enum Role {
    USER,
    ADMIN
}
```

**Giải thích:** Enum Role định nghĩa 2 loại người dùng. Spring Security sẽ dùng giá trị này để kiểm tra quyền.

### 3.2 Tạo `User.java`

Tạo file `src/main/java/com/lab06/entities/User.java`:

```java
package com.lab06.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // ===== UserDetails methods =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Trả về role dưới dạng GrantedAuthority
        // Spring Security dùng danh sách này để kiểm tra hasRole()
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        // Dùng email làm "username" vì email là unique
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
```

**Giải thích:**
- `@Entity` + `@Table(name="users")` → JPA sẽ tạo bảng `users` trong DB.
- `implements UserDetails` → Spring Security yêu cầu entity User phải có các thông tin này để quản lý xác thực.
- `getAuthorities()` → Quan trọng nhất: trả về quyền của user. Prefix `ROLE_` là convention của Spring Security.
- `getUsername()` → Spring Security gọi method này để lấy "định danh". Ta dùng email vì là unique.

---

## Bước 4 – Tạo DTOs

Tạo thư mục `dtos`, lần lượt tạo 3 file:

### `RegisterRequest.java`
```java
package com.lab06.dtos;

public record RegisterRequest(
    String fullName,
    String email,
    String password
) {}
```

### `LoginRequest.java`
```java
package com.lab06.dtos;

public record LoginRequest(
    String email,
    String password
) {}
```

### `AuthResponse.java`
```java
package com.lab06.dtos;

public record AuthResponse(
    String accessToken
) {}
```

**Giải thích:** `record` là cú pháp Java 16+ tạo class bất biến (immutable) với constructor, getters, equals, hashCode tự động. Phù hợp cho DTO.

---

## Bước 5 – Tạo Repository

Tạo file `src/main/java/com/lab06/repositories/UserRepository.java`:

```java
package com.lab06.repositories;

import com.lab06.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Spring Data JPA tự động tạo câu query: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
```

---

## Bước 6 – Tạo `JwtService`

Đây là class **trung tâm** của bảo mật JWT. Tạo `src/main/java/com/lab06/services/JwtService.java`:

```java
package com.lab06.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    // ===== PUBLIC METHODS =====

    /** Tạo token từ UserDetails (không có extra claims) */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /** Tạo token với extra claims tùy chỉnh */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())           // email làm subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Lấy username (email) từ token */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /** Kiểm tra token có hợp lệ không */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        // Token hợp lệ khi: username khớp VÀ chưa hết hạn
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // ===== PRIVATE HELPERS =====

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Chuyển secret key string → Key object để ký/xác thực */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

**Giải thích luồng:**
1. `generateToken()` → dùng JJWT builder để tạo JWT có 3 phần (header.payload.signature)
2. `isTokenValid()` → kiểm tra 2 điều: email trong token == email user đang request, và token chưa hết hạn
3. `getSignInKey()` → decode chuỗi hex secret key thành Key object, dùng thuật toán HMAC-SHA256

---

## Bước 7 – Tạo `ApplicationConfig`

Tạo `src/main/java/com/lab06/configurations/ApplicationConfig.java`:

```java
package com.lab06.configurations;

import com.lab06.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    /**
     * Cách Spring Security load user từ database.
     * Khi ai đó login, Spring gọi method này với email họ nhập vào.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));
    }

    /**
     * BCrypt là thuật toán hash password an toàn.
     * Mỗi lần hash cho kết quả khác nhau (nhờ salt ngẫu nhiên),
     * nhưng vẫn verify được password gốc.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationProvider kết hợp UserDetailsService + PasswordEncoder.
     * Khi login: load user từ DB, so sánh password với BCrypt.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * AuthenticationManager là entry-point để xác thực.
     * AuthenticationService gọi manager này khi user login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

## Bước 8 – Tạo `JwtAuthenticationFilter`

Tạo `src/main/java/com/lab06/filters/JwtAuthenticationFilter.java`:

```java
package com.lab06.filters;

import com.lab06.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Lấy Authorization header
        final String authHeader = request.getHeader("Authorization");

        // 2. Nếu không có header hoặc không bắt đầu bằng "Bearer " → bỏ qua
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Tách JWT ra khỏi "Bearer "
        final String jwt = authHeader.substring(7);

        // 4. Lấy email từ JWT
        final String userEmail = jwtService.extractUsername(jwt);

        // 5. Nếu có email VÀ SecurityContext chưa được set (chưa authenticate request này)
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 6. Load UserDetails từ database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 7. Validate token
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 8. Tạo Authentication object và set vào SecurityContext
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 9. Tiếp tục chuỗi filter
        filterChain.doFilter(request, response);
    }
}
```

**Giải thích:** Filter này chạy **trước mỗi request**. Nó đọc JWT, xác thực, rồi "thông báo" cho Spring Security biết user này đã được xác thực (set vào SecurityContext). Sau đó Spring Security mới kiểm tra authorization.

---

## Bước 9 – Cấu hình `SecurityConfig`

Tạo `src/main/java/com/lab06/configurations/SecurityConfig.java`:

```java
package com.lab06.configurations;

import com.lab06.filters.JwtAuthenticationFilter;
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
```

---

## Bước 10 – Tạo `AuthenticationService`

Tạo `src/main/java/com/lab06/services/AuthenticationService.java`:

```java
package com.lab06.services;

import com.lab06.dtos.AuthResponse;
import com.lab06.dtos.LoginRequest;
import com.lab06.dtos.RegisterRequest;
import com.lab06.entities.Role;
import com.lab06.entities.User;
import com.lab06.repositories.UserRepository;
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
```

---

## Bước 11 – Tạo Controllers

### `AuthController.java`

Tạo `src/main/java/com/lab06/controllers/AuthController.java`:

```java
package com.lab06.controllers;

import com.lab06.dtos.AuthResponse;
import com.lab06.dtos.LoginRequest;
import com.lab06.dtos.RegisterRequest;
import com.lab06.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
```

### `UserController.java`

Tạo `src/main/java/com/lab06/controllers/UserController.java`:

```java
package com.lab06.controllers;

import com.lab06.entities.User;
import com.lab06.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Lấy thông tin user hiện tại.
     * Authentication object được Spring Security inject tự động từ SecurityContext.
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(currentUser);
    }

    /**
     * Lấy tất cả users – chỉ ADMIN.
     * @PreAuthorize kiểm tra quyền TRƯỚC khi vào method.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
```

---

## Bước 12 – Xử lý lỗi toàn cục (Optional nhưng nên có)

Tạo `src/main/java/com/lab06/response/ApiResponse.java`:

```java
package com.lab06.response;

public record ApiResponse(boolean success, String message) {}
```

Tạo `src/main/java/com/lab06/exceptions/GlobalExceptionHandler.java`:

```java
package com.lab06.exceptions;

import com.lab06.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Sai username/password khi login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Email hoặc mật khẩu không đúng"));
    }

    // Không đủ quyền (ví dụ: USER gọi /users)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Bạn không có quyền thực hiện thao tác này"));
    }

    // Lỗi runtime chung (ví dụ: email đã tồn tại)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> handleRuntime(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, e.getMessage()));
    }
}
```

---

## Bước 13 – Chạy và Test

### 13.1 Chạy project

Trong IntelliJ: Click **Run** (▶) hoặc nhấn `Shift+F10`.

Kiểm tra console có dòng:
```
Started OrchidManagementApplication in X.XXX seconds
```

Kiểm tra SQL Server → bảng `users` được tạo tự động.

### 13.2 Test bằng Postman

**Test 1: Signup**
```
POST http://localhost:8005/auth/signup
Content-Type: application/json

{
    "fullName": "Nguyen Van A",
    "email": "vana@orchid.com",
    "password": "Password123!"
}
```
Kết quả mong đợi: `200 OK` + `{ "accessToken": "eyJ..." }`

**Test 2: Login**
```
POST http://localhost:8005/auth/login
Content-Type: application/json

{
    "email": "vana@orchid.com",
    "password": "Password123!"
}
```
→ Copy `accessToken`

**Test 3: Get /users/me**
```
GET http://localhost:8005/users/me
Authorization: Bearer <accessToken>
```
→ Trả về thông tin user

**Test 4: Get /users (cần ADMIN)**
```
GET http://localhost:8005/users
Authorization: Bearer <token của USER thường>
```
→ `403 Forbidden`

Để test với ADMIN: Vào DB, update `role = 'ADMIN'` cho một user, login lại lấy token mới → gọi lại `/users` → `200 OK`.

### 13.3 Decode JWT để kiểm tra

Truy cập [https://jwt.io](https://jwt.io), paste token vào ô Encoded. Phần Payload sẽ hiển thị:
```json
{
  "sub": "vana@orchid.com",
  "iat": 1718000000,
  "exp": 1718086400
}
```

---

## Lỗi thường gặp và cách sửa

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `Cannot connect to SQL Server` | Sai URL/password hoặc SQL Server chưa chạy | Kiểm tra SQL Server Management Studio; kiểm tra `application.properties` |
| `WeakKeyException` khi start | Secret key quá ngắn | Thay secret key bằng chuỗi hex đủ 64 ký tự |
| `401` khi gọi `/auth/signup` | Filter chặn nhầm | Kiểm tra `requestMatchers("/auth/**").permitAll()` trong SecurityConfig |
| `403` khi gọi `/users/me` | Token không hợp lệ hoặc filter lỗi | Kiểm tra header `Authorization: Bearer <token>` (có space sau "Bearer") |
| `NullPointerException` trong filter | `userDetailsService` chưa được inject | Đảm bảo `JwtAuthenticationFilter` có `@Component` và inject `UserDetailsService` (không phải `AuthenticationService`) |
| `StackOverflowError` khi start | Bean circular dependency | Đảm bảo `UserDetailsService` bean được định nghĩa trong `ApplicationConfig`, không tự inject vào chính nó |

---

## Tóm tắt luồng hoạt động

```
[Signup/Login Request]
        │
        ▼
AuthController → AuthenticationService
        │
        ├─ signup: encode password → save user → generateToken → trả token
        └─ login: authManager.authenticate() → load user → generateToken → trả token

[Authenticated Request với JWT]
        │
        ▼
JwtAuthenticationFilter
        │
        ├─ Đọc header "Authorization: Bearer <token>"
        ├─ extractUsername(token) → email
        ├─ loadUserByUsername(email) → UserDetails từ DB
        ├─ isTokenValid() → true/false
        └─ Set SecurityContextHolder.getContext().setAuthentication(...)
                │
                ▼
        SecurityConfig kiểm tra Authorization
                │
                ├─ /auth/** → permitAll → qua
                ├─ /users/me → authenticated → qua
                └─ /users → hasRole('ADMIN') → kiểm tra role
```
