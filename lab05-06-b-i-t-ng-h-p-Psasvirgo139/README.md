[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/L0Y_Xhtv)

# Lab 5+6 – Orchid Management với JWT Security

> **Stack:** Spring Boot 3.2 · Spring Security · JJWT 0.11.5 · SQL Server · React 18 · Vite · React-Bootstrap 2.x · axios

---
# Thông tin sinh viên
Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |
---

## Cấu trúc project

```
Lab56/
├── orchid-management/          ← Spring Boot Back-end
│   └── src/main/java/com/lab56/
│       ├── entities/           Role.java · User.java · Orchid.java
│       ├── repositories/       UserRepository · IOrchidRepository
│       ├── dtos/               RegisterRequest · LoginRequest · AuthResponse
│       ├── response/           ApiResponse
│       ├── services/           JwtService · OrchidService · AuthenticationService
│       ├── configurations/     ApplicationConfig · SecurityConfig
│       ├── filters/            JwtAuthenticationFilter
│       ├── controllers/        AuthController · OrchidController · UserController
│       └── exceptions/         GlobalExceptionHandler
└── orchid-fe/                  ← React Front-end
    └── src/
        ├── utils/              orchidApi.js
        ├── reducers/           orchidReducer.js
        ├── context/            AuthContext.jsx · OrchidContext.jsx
        ├── components/         NavBar · OrchidTable · OrchidForm · ConfirmModal · ProtectedRoute
        └── pages/              LoginPage · SignupPage · HomePage · AddOrchidPage · EditOrchidPage
```

---

## TODOs – Back-end

### TODO-BE-01 · `pom.xml` – Thêm dependencies JWT + Lombok + Validation

- [ ] Thêm `jjwt-api`, `jjwt-impl`, `jjwt-jackson` version `0.11.5`
- [ ] Thêm `spring-boot-starter-validation`
- [ ] Thêm `lombok`
- [ ] Click "Load Maven Changes" → compile thành công

### TODO-BE-02 · `application.properties` – Cấu hình DB + JWT

- [ ] `spring.datasource.url` trỏ đúng tên database (`OrchidDB`)
- [ ] `spring.datasource.username` / `password` đúng credentials SQL Server
- [ ] `application.security.jwt.secret-key` = chuỗi hex 64 ký tự
- [ ] `application.security.jwt.expiration` = `86400000` (24h tính bằng ms)
- [ ] Tạo `application.properties.example` thay password = `YOUR_PASSWORD` để commit Git

### TODO-BE-03 · `entities/Role.java` – Enum role

- [ ] Khai báo enum với 2 giá trị: `USER`, `ADMIN`

### TODO-BE-04 · `entities/User.java` – Entity + UserDetails

- [ ] `@Entity`, `@Table(name = "users")`
- [ ] `@Column(unique = true, nullable = false)` trên `email`
- [ ] `implements UserDetails`
- [ ] `getAuthorities()` trả `ROLE_USER` hoặc `ROLE_ADMIN` (prefix `ROLE_` bắt buộc)
- [ ] `getUsername()` trả `email` (không phải tên người dùng)
- [ ] 4 boolean method trả `true`

### TODO-BE-05 · `entities/Orchid.java` – Entity bảng Orchid

- [ ] `@Entity`, `@Table(name = "Orchid")`
- [ ] 7 field: `orchidId`, `orchidName`, `isNatural`, `orchidDescription`, `orchidCategory`, `isAttractive`, `orchidURL`
- [ ] Column name mapping đúng với DB

### TODO-BE-06 · `repositories/` – JPA Repositories

- [ ] `UserRepository` có method `findByEmail(String email)` trả `Optional<User>`
- [ ] `IOrchidRepository` extends `JpaRepository<Orchid, Integer>`

### TODO-BE-07 · `dtos/` + `response/` – Request/Response records

- [ ] `RegisterRequest`: `fullName`, `email` (`@Email`), `password` (`@Size(min=8)`)
- [ ] `LoginRequest`: `email`, `password` (đều `@NotBlank`)
- [ ] `AuthResponse`: chỉ chứa `accessToken`
- [ ] `ApiResponse`: `success` (boolean) + `message`

### TODO-BE-08 · `services/JwtService.java` – JWT core

- [ ] `generateToken(UserDetails)` → ký HMAC-SHA256, subject = email
- [ ] `generateToken(Map, UserDetails)` → hỗ trợ extra claims
- [ ] `extractUsername(String token)` → lấy subject (email)
- [ ] `isTokenValid(String, UserDetails)` → kiểm tra email khớp + chưa hết hạn
- [ ] `getSignInKey()` → decode BASE64 → `Keys.hmacShaKeyFor(...)`
- [ ] Dùng `@Value` đọc secret/expiration từ properties, không hardcode

### TODO-BE-09 · `configurations/ApplicationConfig.java` – Security beans

- [ ] Bean `UserDetailsService` → `findByEmail` (đặt ở đây để tránh circular dependency)
- [ ] Bean `PasswordEncoder` → `BCryptPasswordEncoder`
- [ ] Bean `AuthenticationProvider` → `DaoAuthenticationProvider`
- [ ] Bean `AuthenticationManager`

### TODO-BE-10 · `filters/JwtAuthenticationFilter.java` – Filter JWT

- [ ] Extends `OncePerRequestFilter`
- [ ] Đọc header `Authorization`, bỏ qua nếu không có hoặc không bắt đầu bằng `Bearer `
- [ ] Extract email → load UserDetails → validate token
- [ ] Set `SecurityContextHolder` nếu token hợp lệ
- [ ] Luôn gọi `filterChain.doFilter()` ở cuối

### TODO-BE-11 · `configurations/SecurityConfig.java` – Security rules

- [ ] Disable CSRF
- [ ] CORS bean cho phép origin `http://localhost:5173`
- [ ] `GET /orchids/**` → `permitAll()`
- [ ] `POST /orchids/**` → `hasAnyRole("USER", "ADMIN")`
- [ ] `PUT /orchids/**` → `hasAnyRole("USER", "ADMIN")`
- [ ] `DELETE /orchids/**` → `hasRole("ADMIN")`
- [ ] `/auth/**` → `permitAll()`
- [ ] Session policy = `STATELESS`
- [ ] Add `JwtAuthenticationFilter` trước `UsernamePasswordAuthenticationFilter`

### TODO-BE-12 · `services/AuthenticationService.java` – Auth logic

- [ ] `signup()`: kiểm tra email chưa tồn tại → BCrypt password → save → generate token
- [ ] `authenticate()`: `authManager.authenticate()` → load user → generate token

### TODO-BE-13 · `controllers/` – REST endpoints

- [ ] `AuthController`: `POST /auth/signup`, `POST /auth/login`
- [ ] `OrchidController`: 5 endpoint CRUD (`GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`)
- [ ] `UserController`: `GET /users/me` (bất kỳ user đã đăng nhập), `GET /users` (chỉ ADMIN với `@PreAuthorize`)

### TODO-BE-14 · `exceptions/GlobalExceptionHandler.java` – Xử lý lỗi toàn cục

- [ ] `BadCredentialsException` → 401 + message tiếng Việt
- [ ] `AccessDeniedException` → 403 + message tiếng Việt
- [ ] `MethodArgumentNotValidException` → 400 + danh sách field lỗi
- [ ] `RuntimeException` → 400 + message từ exception

---

## TODOs – Front-end

### TODO-FE-01 · Khởi tạo project

- [ ] `npm create vite@latest orchid-fe -- --template react`
- [ ] `npm install axios bootstrap react-bootstrap react-router-dom`
- [ ] Tạo `.env` với `VITE_API_BASE_URL=http://localhost:8005`
- [ ] `npm run dev` → không lỗi

### TODO-FE-02 · `main.jsx` – Bootstrap import

- [ ] `import 'bootstrap/dist/css/bootstrap.min.css'` ở dòng đầu

### TODO-FE-03 · `utils/orchidApi.js` – Axios instance + interceptors

- [ ] Tạo axios instance với `baseURL` từ env
- [ ] **Request interceptor**: đọc token từ `localStorage` → gắn `Authorization: Bearer <token>`
- [ ] **Response interceptor**: status 401 → xóa token khỏi localStorage → `window.location.href = '/login'`
- [ ] Export 7 hàm: `getAllOrchids`, `getOrchidById`, `createOrchid`, `updateOrchid`, `deleteOrchid`, `loginApi`, `signupApi`

### TODO-FE-04 · `reducers/orchidReducer.js` – State management

- [ ] Export `ACTIONS` với 6 type: `FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`, `ADD`, `UPDATE`, `DELETE`
- [ ] Export `initialState = { orchids: [], loading: false, error: '' }`
- [ ] `orchidReducer` xử lý đúng 6 action type, không mutate state

### TODO-FE-05 · `context/AuthContext.jsx` – JWT context

- [ ] `useState(() => localStorage.getItem('token'))` – lazy initializer
- [ ] `decodeToken()` → `JSON.parse(atob(token.split('.')[1]))` để lấy email, role
- [ ] `login()`: gọi API → lưu token localStorage → `setToken` → `navigate('/')`
- [ ] `signup()`: tương tự `login()`
- [ ] `logout()`: xóa localStorage → `setToken(null)` → `navigate('/login')`
- [ ] Export `useAuth()` hook với error guard

### TODO-FE-06 · `context/OrchidContext.jsx` – Orchid context

- [ ] `useReducer(orchidReducer, initialState)`
- [ ] 4 async function với `useCallback`: `fetchOrchids`, `addOrchid`, `editOrchid`, `removeOrchid`
- [ ] `fetchOrchids` dispatch `FETCH_START` → gọi API → `FETCH_SUCCESS` hoặc `FETCH_ERROR`
- [ ] Export `useOrchid()` hook

### TODO-FE-07 · `components/ProtectedRoute.jsx` – Route guard

- [ ] Không có token → `<Navigate to="/login" replace />`
- [ ] Có `requiredRole` nhưng role không khớp → hiện Alert 403
- [ ] Đúng điều kiện → render `children`

### TODO-FE-08 · `components/NavBar.jsx` – Navbar động

- [ ] Chưa đăng nhập: hiện link "Đăng nhập", "Đăng ký"
- [ ] Đã đăng nhập: hiện email + role của user, nút "Đăng xuất"
- [ ] Link "Add Orchid" chỉ hiện khi đã đăng nhập

### TODO-FE-09 · `components/OrchidTable.jsx` – Bảng có phân quyền

- [ ] Cột "Hành động" chỉ hiện khi `isLoggedIn`
- [ ] Nút "Sửa" hiện với mọi user đã đăng nhập
- [ ] Nút "Xóa" chỉ hiện khi `isAdmin`

### TODO-FE-10 · `components/OrchidForm.jsx` – Form dùng chung

- [ ] `useEffect` sync form state khi `initialData` thay đổi (dùng cho EditPage)
- [ ] Checkbox dạng switch cho `isNatural`, `isAttractive`
- [ ] Preview ảnh từ URL

### TODO-FE-11 · `components/ConfirmModal.jsx` – Modal xác nhận xóa

- [ ] 2 nút "Hủy" và "Xóa" đều `disabled` khi `loading`

### TODO-FE-12 · `pages/LoginPage.jsx` + `SignupPage.jsx`

- [ ] Redirect về `/` nếu đã có token
- [ ] Bắt lỗi API → hiện Alert danger với message từ server
- [ ] `SignupPage`: validate `password.length >= 8` trước khi gọi API

### TODO-FE-13 · `pages/HomePage.jsx`

- [ ] `useEffect(() => { fetchOrchids() }, [fetchOrchids])`
- [ ] Hiện Spinner khi `loading`, Alert khi `error`
- [ ] Toggle Table/Card view
- [ ] Nút "+ Thêm mới" chỉ hiện khi `token` tồn tại
- [ ] Tích hợp `ConfirmModal` để xóa

### TODO-FE-14 · `pages/AddOrchidPage.jsx` + `EditOrchidPage.jsx`

- [ ] `AddOrchidPage`: gọi `addOrchid()` → Alert success → `setTimeout(() => navigate('/'), 1500)`
- [ ] `EditOrchidPage`: `useEffect` fetch orchid theo `id` từ params → truyền vào `OrchidForm` làm `initialData`
- [ ] Bắt lỗi API → hiện Alert danger

### TODO-FE-15 · `App.jsx` – Router + Providers

- [ ] `<AuthProvider>` nằm **bên trong** `<BrowserRouter>` (vì dùng `useNavigate()`)
- [ ] Route `/add` và `/edit/:id` bọc trong `<ProtectedRoute>`
- [ ] `<AppNavBar />` nằm ngoài `<Routes>` để luôn hiển thị

---

## Postman Test Checklist

> Base URL: `http://localhost:8005` | Content-Type: `application/json`

### Auth

| # | Request                                | Body                                                                      | Expected                                                                                      |
| - | -------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1 | `POST /auth/signup`                  | `{"fullName":"Test","email":"user@test.com","password":"Password123!"}` | `200 OK` + `{"accessToken":"eyJ..."}`                                                     |
| 2 | `POST /auth/signup` (email trùng)   | cùng body                                                                | `400 Bad Request` + `{"success":false,"message":"Email đã được sử dụng..."}`       |
| 3 | `POST /auth/signup` (password ngắn) | `"password":"abc"`                                                      | `400 Bad Request` + validation message                                                      |
| 4 | `POST /auth/login`                   | `{"email":"user@test.com","password":"Password123!"}`                   | `200 OK` + `accessToken`                                                                  |
| 5 | `POST /auth/login` (sai pass)        | `"password":"wrong"`                                                    | `401 Unauthorized` + `{"success":false,"message":"Email hoặc mật khẩu không đúng"}` |

### Orchid – Public (không cần token)

| # | Request                                  | Expected                                 |
| - | ---------------------------------------- | ---------------------------------------- |
| 6 | `GET /orchids/`                        | `200 OK` + mảng JSON (có thể rỗng) |
| 7 | `GET /orchids/1` (tồn tại)           | `200 OK` + object orchid               |
| 8 | `GET /orchids/9999` (không tồn tại) | `404 Not Found`                        |

### Orchid – Cần đăng nhập (USER token)

> Trước mỗi test: đăng nhập → copy `accessToken` → thêm vào header `Authorization: Bearer <token>`

| #  | Request                            | Body                                                                                           | Expected                                                                        |
| -- | ---------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 9  | `POST /orchids/` (có token)     | `{"orchidName":"Phalaenopsis","orchidCategory":"Cat1","isNatural":true,"isAttractive":true}` | `201 Created` + orchid với `orchidId`                                      |
| 10 | `POST /orchids/` (không token)  | cùng body                                                                                     | `401 Unauthorized`                                                            |
| 11 | `PUT /orchids/1` (có token)     | `{"orchidName":"Updated","orchidCategory":"Cat2","isNatural":false,"isAttractive":false}`    | `200 OK` + orchid đã sửa                                                   |
| 12 | `DELETE /orchids/1` (USER token) | –                                                                                             | `403 Forbidden` + `{"success":false,"message":"Bạn không có quyền..."}` |

### Orchid – Cần ADMIN token

> Trước test: chạy SQL `UPDATE users SET role='ADMIN' WHERE email='user@test.com'` → login lại → lấy token mới

| #  | Request                                | Expected           |
| -- | -------------------------------------- | ------------------ |
| 13 | `DELETE /orchids/1` (ADMIN token)    | `204 No Content` |
| 14 | `DELETE /orchids/9999` (ADMIN token) | `404 Not Found`  |

### User

| #  | Request                          | Header                      | Expected                                |
| -- | -------------------------------- | --------------------------- | --------------------------------------- |
| 15 | `GET /users/me`                | Bearer`<any valid token>` | `200 OK` + user object (có `role`) |
| 16 | `GET /users/me` (không token) | –                          | `401 Unauthorized`                    |
| 17 | `GET /users`                   | Bearer`<USER token>`      | `403 Forbidden`                       |
| 18 | `GET /users`                   | Bearer`<ADMIN token>`     | `200 OK` + mảng tất cả users       |

### JWT Decode (không cần Postman)

Paste token vào https://jwt.io và kiểm tra payload:

- [ ] `sub` = email của user
- [ ] `iat` = thời điểm tạo (Unix timestamp)
- [ ] `exp` = `iat + 86400` (24 giờ sau)
- [ ] Signature hợp lệ khi nhập đúng secret key

---

## Lỗi thường gặp và cách fix

| Lỗi                               | Nguyên nhân                                  | Fix                                                                                                   |
| ---------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `WeakKeyException` khi start     | Secret key quá ngắn (< 256 bit)              | Dùng hex 64 ký tự                                                                                  |
| `StackOverflowError` khi start   | Circular dependency giữa Security beans       | `UserDetailsService` bean phải trong `ApplicationConfig`, không trong `AuthenticationService` |
| `401` tại `POST /auth/signup` | SecurityConfig chưa permit`/auth/**`        | Thêm`.requestMatchers("/auth/**").permitAll()`                                                     |
| `403` tại `GET /orchids/`     | Chưa permit GET public                        | Thêm`.requestMatchers(GET, "/orchids/**").permitAll()`                                             |
| CORS error từ React               | Origin không được phép                    | CORS bean set`allowedOrigins("http://localhost:5173")`                                              |
| Token mất sau F5                  | Không đọc localStorage khi init             | Dùng`useState(() => localStorage.getItem('token'))`                                                |
| `useNavigate()` crash            | `AuthProvider` nằm ngoài `BrowserRouter` | Đặt`AuthProvider` bên trong `<BrowserRouter>`                                                  |
| Axios không gửi token            | Interceptor chưa được đăng ký           | Đảm bảo interceptor add vào axios instance (không phải trong component)                         |
| Form reset khi edit                | Thiếu`useEffect` sync `initialData`       | `useEffect(() => { if (initialData) setForm(initialData) }, [initialData])`                         |

---

## Phân quyền tóm tắt

| Endpoint                 | Khách | USER   | ADMIN |
| ------------------------ | ------ | ------ | ----- |
| `GET /orchids/`        | ✅     | ✅     | ✅    |
| `GET /orchids/{id}`    | ✅     | ✅     | ✅    |
| `POST /orchids/`       | ❌ 401 | ✅     | ✅    |
| `PUT /orchids/{id}`    | ❌ 401 | ✅     | ✅    |
| `DELETE /orchids/{id}` | ❌ 401 | ❌ 403 | ✅    |
| `GET /users/me`        | ❌ 401 | ✅     | ✅    |
| `GET /users`           | ❌ 401 | ❌ 403 | ✅    |
