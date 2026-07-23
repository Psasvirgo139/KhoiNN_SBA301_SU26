# Hướng dẫn Step-by-Step – Lab 5+6 (Có Code Chi Tiết)

> Đọc kỹ từng bước. Làm đến đâu test đến đó — đừng viết hết rồi mới chạy. 
> Nhớ commit message đúng quy tắc - nếu không bị trừ điểm

---

## Chuẩn bị

- JDK 17+, IntelliJ IDEA, SQL Server đang chạy, Postman, Node.js 18+
- Tạo database:
  ```sql
  CREATE DATABASE OrchidDB;
  ```
- Sinh secret key:
  
  # Terminal/ Git Bash / macOS / Linux
  openssl rand -hex 32
  ```

---

## PHẦN 1 – BACK-END

---

### Bước 1 – `pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
  <groupId>com.lab56</groupId>
  <artifactId>orchid-management</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
  </parent>
  <properties><java.version>17</java.version></properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>com.microsoft.sqlserver</groupId><artifactId>mssql-jdbc</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>0.11.5</version></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>0.11.5</version><scope>runtime</scope></dependency>
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>0.11.5</version><scope>runtime</scope></dependency>
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
  </dependencies>
</project>
```

---

### Bước 2 – `application.properties`

```properties
server.port=8005
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
application.security.jwt.secret-key=Your token key
application.security.jwt.expiration=86400000
```

---

### Bước 3 – Entities

#### `entities/Role.java`
```java
package com.lab56.entities;
public enum Role { USER, ADMIN }
```

#### `entities/User.java`
```java
package com.lab56.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.*;

@Entity @Table(name = "users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User implements UserDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}
```

#### `entities/Orchid.java`
```java
package com.lab56.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "Orchid")
@Data @NoArgsConstructor @AllArgsConstructor
public class Orchid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Integer orchidId;

    @Column(name = "OrchidName", nullable = false)
    private String orchidName;

    @Column(name = "isNatural")   private Boolean isNatural;
    @Column(name = "orchidDescription", length = 500) private String orchidDescription;
    @Column(name = "orchidCategory")  private String orchidCategory;
    @Column(name = "isAttractive") private Boolean isAttractive;
    @Column(name = "orchidURL")    private String orchidURL;
}
```

✅ Chạy app → SQL Server tạo bảng `users` và `Orchid` tự động.

---

### Bước 4 – Repositories + DTOs + ApiResponse

#### `repositories/UserRepository.java`
```java
package com.lab56.repositories;
import com.lab56.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

#### `repositories/IOrchidRepository.java`
```java
package com.lab56.repositories;
import com.lab56.entities.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Integer> {}
```

#### `dtos/RegisterRequest.java`
```java
package com.lab56.dtos;
import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank String fullName,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password
) {}
```

#### `dtos/LoginRequest.java`
```java
package com.lab56.dtos;
import jakarta.validation.constraints.*;

public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String password
) {}
```

#### `dtos/AuthResponse.java`
```java
package com.lab56.dtos;
public record AuthResponse(String accessToken) {}
```

#### `response/ApiResponse.java`
```java
package com.lab56.response;
public record ApiResponse(boolean success, String message) {}
```

---

### Bước 5 – `JwtService`

```java
package com.lab56.services;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(Jwts.parserBuilder()
                .setSigningKey(getSignInKey()).build()
                .parseClaimsJws(token).getBody());
    }

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
```

---

### Bước 6 – `ApplicationConfig`

```java
package com.lab56.configurations;

import com.lab56.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    // PHẢI đặt bean này ở đây để tránh circular dependency
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy: " + username));
    }

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider(userDetailsService());
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

### Bước 7 – `JwtAuthenticationFilter`

```java
package com.lab56.filters;

import com.lab56.services.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
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
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

### Bước 8 – `SecurityConfig`

```java
package com.lab56.configurations;

import com.lab56.filters.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration @EnableWebSecurity @EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/orchids/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/orchids/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/orchids/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/orchids/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

---

### Bước 9 – Services + Controllers

#### `services/IOrchidService.java`
```java
package com.lab56.services;
import com.lab56.entities.Orchid;
import java.util.*;

public interface IOrchidService {
    List<Orchid> getAllOrchids();
    Optional<Orchid> getOrchidById(Integer id);
    Orchid createOrchid(Orchid orchid);
    Orchid updateOrchid(Integer id, Orchid orchid);
    void deleteOrchid(Integer id);
    boolean existsById(Integer id);
}
```

#### `services/OrchidService.java`
```java
package com.lab56.services;

import com.lab56.entities.Orchid;
import com.lab56.repositories.IOrchidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor
public class OrchidService implements IOrchidService {

    private final IOrchidRepository orchidRepository;

    @Override public List<Orchid> getAllOrchids()          { return orchidRepository.findAll(); }
    @Override public Optional<Orchid> getOrchidById(Integer id) { return orchidRepository.findById(id); }
    @Override public Orchid createOrchid(Orchid orchid)    { return orchidRepository.save(orchid); }
    @Override public boolean existsById(Integer id)        { return orchidRepository.existsById(id); }
    @Override public void deleteOrchid(Integer id)         { orchidRepository.deleteById(id); }

    @Override
    public Orchid updateOrchid(Integer id, Orchid orchid) {
        Orchid existing = orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy orchid: " + id));
        existing.setOrchidName(orchid.getOrchidName());
        existing.setIsNatural(orchid.getIsNatural());
        existing.setOrchidDescription(orchid.getOrchidDescription());
        existing.setOrchidCategory(orchid.getOrchidCategory());
        existing.setIsAttractive(orchid.getIsAttractive());
        existing.setOrchidURL(orchid.getOrchidURL());
        return orchidRepository.save(existing);
    }
}
```

#### `services/AuthenticationService.java`
```java
package com.lab56.services;

import com.lab56.dtos.*;
import com.lab56.entities.*;
import com.lab56.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse signup(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent())
            throw new RuntimeException("Email đã được sử dụng: " + request.email());

        var user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(user));
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        var user = userRepository.findByEmail(request.email()).orElseThrow();
        return new AuthResponse(jwtService.generateToken(user));
    }
}
```

#### `controllers/AuthController.java`
```java
package com.lab56.controllers;

import com.lab56.dtos.*;
import com.lab56.services.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}
```

#### `controllers/OrchidController.java`
```java
package com.lab56.controllers;

import com.lab56.entities.Orchid;
import com.lab56.services.IOrchidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/orchids")
@RequiredArgsConstructor
public class OrchidController {

    private final IOrchidService orchidService;

    @GetMapping("/")   public ResponseEntity<List<Orchid>> getAll() { return ResponseEntity.ok(orchidService.getAllOrchids()); }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getById(@PathVariable Integer id) {
        return orchidService.getOrchidById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/")
    public ResponseEntity<Orchid> create(@RequestBody Orchid orchid) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orchidService.createOrchid(orchid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> update(@PathVariable Integer id, @RequestBody Orchid orchid) {
        if (!orchidService.existsById(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(orchidService.updateOrchid(id, orchid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!orchidService.existsById(id)) return ResponseEntity.notFound().build();
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}
```

#### `controllers/UserController.java`
```java
package com.lab56.controllers;

import com.lab56.entities.User;
import com.lab56.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> me(Authentication auth) {
        return ResponseEntity.ok((User) auth.getPrincipal());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> all() { return ResponseEntity.ok(userRepository.findAll()); }
}
```

#### `exceptions/GlobalExceptionHandler.java`
```java
package com.lab56.exceptions;

import com.lab56.response.ApiResponse;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> badCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Email hoặc mật khẩu không đúng"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> accessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(false, "Bạn không có quyền thực hiện thao tác này"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> validation(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ApiResponse(false, msg));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse> runtime(RuntimeException e) {
        return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
    }
}
```

---

### Bước 10 – Test Postman

```
POST /auth/signup  → body: {fullName, email, password} → nhận accessToken
POST /auth/login   → body: {email, password}           → nhận accessToken
GET  /orchids/     → không cần token → 200 OK
POST /orchids/     → Bearer <token>  → 201 Created
DELETE /orchids/1  → Bearer <USER token> → 403 Forbidden
UPDATE users SET role='ADMIN' WHERE email='...'  → login lại
DELETE /orchids/1  → Bearer <ADMIN token> → 204 No Content
```

---

## PHẦN 2 – FRONT-END

---

### Bước 11 – Khởi tạo React project

```bash
npm create vite@latest orchid-fe -- --template react
cd orchid-fe
npm install axios bootstrap react-bootstrap react-router-dom
```

`.env`:
```
VITE_API_BASE_URL=http://localhost:8005
```

---

### Bước 12 – `src/main.jsx`

```jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
```

---

### Bước 13 – `src/utils/orchidApi.js`

```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST: tự động gắn JWT vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// RESPONSE: token hết hạn → xóa → redirect login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getAllOrchids  = ()         => api.get('/orchids/')
export const getOrchidById = (id)       => api.get(`/orchids/${id}`)
export const createOrchid  = (data)     => api.post('/orchids/', data)
export const updateOrchid  = (id, data) => api.put(`/orchids/${id}`, data)
export const deleteOrchid  = (id)       => api.delete(`/orchids/${id}`)
export const loginApi      = (data)     => api.post('/auth/login', data)
export const signupApi     = (data)     => api.post('/auth/signup', data)

export default api
```

---

### Bước 14 – `src/reducers/orchidReducer.js`

```js
export const ACTIONS = {
  FETCH_START: 'FETCH_START', FETCH_SUCCESS: 'FETCH_SUCCESS', FETCH_ERROR: 'FETCH_ERROR',
  ADD: 'ADD', UPDATE: 'UPDATE', DELETE: 'DELETE',
}

export const initialState = { orchids: [], loading: false, error: '' }

export function orchidReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:   return { ...state, loading: true, error: '' }
    case ACTIONS.FETCH_SUCCESS: return { ...state, loading: false, orchids: action.payload }
    case ACTIONS.FETCH_ERROR:   return { ...state, loading: false, error: action.payload }
    case ACTIONS.ADD:    return { ...state, orchids: [...state.orchids, action.payload] }
    case ACTIONS.UPDATE: return { ...state, orchids: state.orchids.map(o =>
        o.orchidId === action.payload.orchidId ? action.payload : o) }
    case ACTIONS.DELETE: return { ...state, orchids: state.orchids.filter(o =>
        o.orchidId !== action.payload) }
    default: return state
  }
}
```

---

### Bước 15 – `src/context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi, signupApi } from '../utils/orchidApi'

const AuthContext = createContext(null)

function decodeToken(token) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

export function AuthProvider({ children }) {
  // lazy initializer: đọc localStorage một lần khi mount
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const navigate = useNavigate()
  const currentUser = token ? decodeToken(token) : null

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password })
    const { accessToken } = res.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    navigate('/')
  }, [navigate])

  const signup = useCallback(async (fullName, email, password) => {
    const res = await signupApi({ fullName, email, password })
    const { accessToken } = res.data
    localStorage.setItem('token', accessToken)
    setToken(accessToken)
    navigate('/')
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ token, currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider')
  return ctx
}
```

✅ Kiểm tra: đăng nhập → reload → vẫn còn đăng nhập.

---

### Bước 16 – `src/context/OrchidContext.jsx`

```jsx
import { createContext, useContext, useReducer, useCallback } from 'react'
import { orchidReducer, initialState, ACTIONS } from '../reducers/orchidReducer'
import { getAllOrchids, createOrchid, updateOrchid, deleteOrchid } from '../utils/orchidApi'

const OrchidContext = createContext(null)

export function OrchidProvider({ children }) {
  const [state, dispatch] = useReducer(orchidReducer, initialState)

  const fetchOrchids = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START })
    try {
      const res = await getAllOrchids()
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: res.data })
    } catch (err) {
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message })
    }
  }, [])

  const addOrchid    = useCallback(async (data) => {
    const res = await createOrchid(data)
    dispatch({ type: ACTIONS.ADD, payload: res.data })
  }, [])

  const editOrchid   = useCallback(async (id, data) => {
    const res = await updateOrchid(id, data)
    dispatch({ type: ACTIONS.UPDATE, payload: res.data })
  }, [])

  const removeOrchid = useCallback(async (id) => {
    await deleteOrchid(id)
    dispatch({ type: ACTIONS.DELETE, payload: id })
  }, [])

  return (
    <OrchidContext.Provider value={{ ...state, fetchOrchids, addOrchid, editOrchid, removeOrchid }}>
      {children}
    </OrchidContext.Provider>
  )
}

export function useOrchid() {
  const ctx = useContext(OrchidContext)
  if (!ctx) throw new Error('useOrchid phải dùng trong OrchidProvider')
  return ctx
}
```

---

### Bước 17 – `src/components/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Container } from 'react-bootstrap'

export default function ProtectedRoute({ children, requiredRole }) {
  const { token, currentUser } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && currentUser?.role !== requiredRole)
    return (
      <Container className="mt-4">
        <Alert variant="danger">Bạn không có quyền. Yêu cầu: <strong>{requiredRole}</strong></Alert>
      </Container>
    )
  return children
}
```

---

### Bước 18 – Components

#### `src/components/NavBar.jsx`
```jsx
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppNavBar() {
  const { pathname } = useLocation()
  const { token, currentUser, logout } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🌸 Orchid Management</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={pathname === '/'}>Home</Nav.Link>
            {token && <Nav.Link as={Link} to="/add">➕ Add Orchid</Nav.Link>}
          </Nav>
          <Nav>
            {token ? (
              <>
                <Navbar.Text className="me-3 text-light">
                  👤 {currentUser?.sub} ({currentUser?.role ?? 'USER'})
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={logout}>Đăng xuất</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/signup">Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
```

#### `src/components/OrchidTable.jsx`
```jsx
import { Table, Button, Badge, Image } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function OrchidTable({ orchids, onEdit, onDelete }) {
  const { token, currentUser } = useAuth()
  const isAdmin    = currentUser?.role === 'ADMIN'
  const isLoggedIn = !!token

  if (!orchids?.length) return <p className="text-muted text-center mt-3">Chưa có dữ liệu.</p>

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>#</th><th>Ảnh</th><th>Tên</th><th>Danh mục</th>
          <th>Tự nhiên</th><th>Hấp dẫn</th><th>Mô tả</th>
          {isLoggedIn && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {orchids.map((o, i) => (
          <tr key={o.orchidId}>
            <td>{i + 1}</td>
            <td>{o.orchidURL && <Image src={o.orchidURL} width={60} height={60} style={{ objectFit:'cover' }} rounded />}</td>
            <td>{o.orchidName}</td>
            <td>{o.orchidCategory}</td>
            <td><Badge bg={o.isNatural ? 'success' : 'secondary'}>{o.isNatural ? 'Có' : 'Không'}</Badge></td>
            <td><Badge bg={o.isAttractive ? 'warning' : 'light'} text="dark">{o.isAttractive ? 'Có' : 'Không'}</Badge></td>
            <td style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {o.orchidDescription}
            </td>
            {isLoggedIn && (
              <td>
                <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onEdit(o.orchidId)}>Sửa</Button>
                {isAdmin && <Button variant="outline-danger" size="sm" onClick={() => onDelete(o)}>Xóa</Button>}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
```

#### `src/components/OrchidForm.jsx`
```jsx
import { useState, useEffect } from 'react'
import { Form, Row, Col, Button, Image } from 'react-bootstrap'

const EMPTY = { orchidName:'', orchidCategory:'', orchidDescription:'', orchidURL:'', isNatural:false, isAttractive:false }

export default function OrchidForm({ initialData, onSubmit, submitLabel = 'Lưu', loading }) {
  const [form, setForm] = useState(initialData ?? EMPTY)
  useEffect(() => { if (initialData) setForm(initialData) }, [initialData])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
      <Row className="mb-3">
        <Form.Group as={Col} md={6}>
          <Form.Label>Tên hoa lan *</Form.Label>
          <Form.Control name="orchidName" value={form.orchidName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Label>Danh mục</Form.Label>
          <Form.Control name="orchidCategory" value={form.orchidCategory} onChange={handleChange} />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <Form.Control as="textarea" rows={3} name="orchidDescription"
          value={form.orchidDescription} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL hình ảnh</Form.Label>
        <Form.Control type="url" name="orchidURL" value={form.orchidURL} onChange={handleChange} />
        {form.orchidURL && <Image src={form.orchidURL} className="mt-2" style={{ maxHeight:120 }} rounded />}
      </Form.Group>
      <Row className="mb-3">
        <Col><Form.Check type="switch" id="isNatural" name="isNatural" label="Hoa tự nhiên" checked={form.isNatural} onChange={handleChange} /></Col>
        <Col><Form.Check type="switch" id="isAttractive" name="isAttractive" label="Hoa hấp dẫn" checked={form.isAttractive} onChange={handleChange} /></Col>
      </Row>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Đang lưu...' : submitLabel}
      </Button>
    </Form>
  )
}
```

#### `src/components/ConfirmModal.jsx`
```jsx
import { Modal, Button } from 'react-bootstrap'

export default function ConfirmModal({ show, onHide, onConfirm, orchidName, loading }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
      <Modal.Body>Bạn có chắc muốn xóa <strong className="text-danger">{orchidName}</strong>?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>Hủy</Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
```

---

### Bước 19 – Pages

#### `src/pages/LoginPage.jsx`
```jsx
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { token, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try { await login(email, password) }
    catch (err) { setError(err.response?.data?.message ?? 'Đăng nhập thất bại.') }
    finally { setLoading(false) }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight:'80vh' }}>
      <Card style={{ width:420 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">🌸 Đăng nhập</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0">Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link></p>
        </Card.Body>
      </Card>
    </Container>
  )
}
```

#### `src/pages/SignupPage.jsx`
```jsx
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { token, signup } = useAuth()
  const [form, setForm] = useState({ fullName:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (token) return <Navigate to="/" replace />

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('Mật khẩu ít nhất 8 ký tự.'); return }
    setLoading(true); setError('')
    try { await signup(form.fullName, form.email, form.password) }
    catch (err) { setError(err.response?.data?.message ?? 'Đăng ký thất bại.') }
    finally { setLoading(false) }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight:'80vh' }}>
      <Card style={{ width:420 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="text-center mb-4">🌸 Đăng ký</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" name="password" placeholder="Tối thiểu 8 ký tự"
                value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </Card.Body>
      </Card>
    </Container>
  )
}
```

#### `src/pages/HomePage.jsx`
```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap'
import { useOrchid } from '../context/OrchidContext'
import { useAuth } from '../context/AuthContext'
import OrchidTable from '../components/OrchidTable'
import ConfirmModal from '../components/ConfirmModal'

export default function HomePage() {
  const navigate = useNavigate()
  const { orchids, loading, error, fetchOrchids, removeOrchid } = useOrchid()
  const { token } = useAuth()
  const [viewMode, setViewMode] = useState('table')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { fetchOrchids() }, [fetchOrchids])

  const handleDelete = async () => {
    setDeleting(true)
    try { await removeOrchid(deleteTarget.orchidId); setDeleteTarget(null) }
    catch (err) { alert('Xóa thất bại: ' + (err.response?.data?.message ?? err.message)) }
    finally { setDeleting(false) }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>🌸 Danh sách Hoa Lan</h2>
        <div className="d-flex gap-2">
          <ButtonGroup>
            <Button variant={viewMode==='table'?'dark':'outline-dark'} onClick={() => setViewMode('table')}>Bảng</Button>
            <Button variant={viewMode==='card'?'dark':'outline-dark'} onClick={() => setViewMode('card')}>Thẻ</Button>
          </ButtonGroup>
          {token && <Button variant="success" onClick={() => navigate('/add')}>+ Thêm mới</Button>}
        </div>
      </div>
      {loading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <OrchidTable orchids={orchids} onEdit={id => navigate(`/edit/${id}`)} onDelete={setDeleteTarget} />
      )}
      <ConfirmModal show={!!deleteTarget} onHide={() => setDeleteTarget(null)}
        onConfirm={handleDelete} orchidName={deleteTarget?.orchidName} loading={deleting} />
    </Container>
  )
}
```

#### `src/pages/AddOrchidPage.jsx`
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Alert, Breadcrumb } from 'react-bootstrap'
import { useOrchid } from '../context/OrchidContext'
import OrchidForm from '../components/OrchidForm'

export default function AddOrchidPage() {
  const navigate = useNavigate()
  const { addOrchid } = useOrchid()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data) => {
    setSaving(true); setError('')
    try { await addOrchid(data); setSuccess(true); setTimeout(() => navigate('/'), 1500) }
    catch (err) { setError(err.response?.data?.message ?? 'Thêm thất bại.') }
    finally { setSaving(false) }
  }

  return (
    <Container className="py-4" style={{ maxWidth:720 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Thêm hoa lan</Breadcrumb.Item>
      </Breadcrumb>
      <h3 className="mb-4">➕ Thêm hoa lan mới</h3>
      {success && <Alert variant="success">Thêm thành công! Đang chuyển về...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <OrchidForm onSubmit={handleSubmit} submitLabel="Thêm hoa lan" loading={saving} />
    </Container>
  )
}
```

#### `src/pages/EditOrchidPage.jsx`
```jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Alert, Breadcrumb, Spinner } from 'react-bootstrap'
import { getOrchidById } from '../utils/orchidApi'
import { useOrchid } from '../context/OrchidContext'
import OrchidForm from '../components/OrchidForm'

export default function EditOrchidPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editOrchid } = useOrchid()
  const [orchid, setOrchid] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getOrchidById(id).then(res => setOrchid(res.data))
      .catch(() => setError('Không tìm thấy orchid: ' + id))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true); setError('')
    try { await editOrchid(Number(id), data); setSuccess(true); setTimeout(() => navigate('/'), 1500) }
    catch (err) { setError(err.response?.data?.message ?? 'Cập nhật thất bại.') }
    finally { setSaving(false) }
  }

  return (
    <Container className="py-4" style={{ maxWidth:720 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Sửa #{id}</Breadcrumb.Item>
      </Breadcrumb>
      <h3 className="mb-4">✏️ Sửa hoa lan #{id}</h3>
      {fetching && <div className="text-center"><Spinner animation="border" /></div>}
      {!fetching && error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Cập nhật thành công! Đang chuyển về...</Alert>}
      {!fetching && orchid && (
        <OrchidForm initialData={orchid} onSubmit={handleSubmit} submitLabel="Cập nhật" loading={saving} />
      )}
    </Container>
  )
}
```

---

### Bước 20 – `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }   from './context/AuthContext'
import { OrchidProvider } from './context/OrchidContext'
import AppNavBar      from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage       from './pages/HomePage'
import AddOrchidPage  from './pages/AddOrchidPage'
import EditOrchidPage from './pages/EditOrchidPage'
import LoginPage      from './pages/LoginPage'
import SignupPage     from './pages/SignupPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider PHẢI nằm bên trong BrowserRouter — dùng useNavigate() */}
      <AuthProvider>
        <OrchidProvider>
          <AppNavBar />
          <Routes>
            <Route path="/"         element={<HomePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/signup"   element={<SignupPage />} />
            <Route path="/add"      element={<ProtectedRoute><AddOrchidPage /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditOrchidPage /></ProtectedRoute>} />
          </Routes>
        </OrchidProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

---

### Bước 21 – Test Front-end

```
1. npm run dev → http://localhost:5173
   ✅ Danh sách load không cần đăng nhập

2. Đăng ký → tự đăng nhập → NavBar hiện email + role USER

3. Thêm orchid → Alert success → redirect về Home

4. Reload trang → vẫn còn đăng nhập (token trong localStorage)

5. DevTools → Network: header Authorization: Bearer eyJ... có trong mọi request

6. Đăng xuất → NavBar về trạng thái chưa đăng nhập

7. Truy cập /add khi chưa đăng nhập → redirect /login ✅

8. UPDATE role='ADMIN' trong DB → login lại → nút Xóa xuất hiện → xóa được
```

---

## Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `WeakKeyException` | Secret key quá ngắn | Dùng hex 64 ký tự |
| `StackOverflowError` khi start | Circular dependency | `UserDetailsService` bean trong `ApplicationConfig` |
| `401` ở `/auth/signup` | SecurityConfig thiếu permitAll | `.requestMatchers("/auth/**").permitAll()` |
| `403` ở `GET /orchids/` | Thiếu permit GET | `.requestMatchers(GET, "/orchids/**").permitAll()` |
| CORS error | Origin sai | CORS bean cho phép `http://localhost:5173` |
| Token mất sau reload | Chưa đọc localStorage | `useState(() => localStorage.getItem('token'))` |
| `useNavigate` crash | `AuthProvider` ngoài `BrowserRouter` | Đặt `AuthProvider` bên trong `<BrowserRouter>` |
| Axios không gửi token | Interceptor sai vị trí | Add interceptor vào axios instance |

---

## Luồng hoạt động

```
[FE Signup/Login]
      │  POST /auth/login
      ▼
BE: verify → generateToken → trả accessToken
      │
      ▼ FE: localStorage.setItem('token') → navigate('/')

[FE gọi API có bảo vệ]
      │  axios interceptor: Authorization = "Bearer <token>"
      ▼
BE: JwtAuthenticationFilter → validate → SecurityContextHolder
      │
      ▼ SecurityConfig kiểm tra role:
          GET /orchids/    → public
          POST /orchids/   → USER hoặc ADMIN
          DELETE /orchids/ → chỉ ADMIN
      │
      ▼ Controller → response

[Token hết hạn → BE trả 401]
      │ axios response interceptor
      ▼
localStorage.removeItem → window.location.href = '/login'
```
