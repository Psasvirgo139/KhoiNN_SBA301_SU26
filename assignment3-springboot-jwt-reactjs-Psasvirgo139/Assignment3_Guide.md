# Hướng Dẫn Assignment 03 — Securing REST Services with Spring Boot (JWT) + ReactJS

**Đề bài:** Xây dựng **FUMiniHotelSystem** gồm RESTful API (Spring Boot 3 + MS SQL Server + Spring Data JPA, kiến trúc 3-layer) **được bảo mật bằng JSON Web Token (JWT)**, và React Client (axios) thực hiện CRUD + Search cho Customer, Room và Booking.

**Điểm mới so với Assignment 02:** thêm **Spring Security + JWT**. Khách (Customer) đăng nhập bằng **Email + Password** để nhận token; **Staff** đăng nhập bằng tài khoản lấy từ `application.properties`. Mỗi request tới API bảo mật phải kèm header `Authorization: Bearer <token>`.

**Quy ước tên (thay bằng tên bạn):**

| Thành phần | Tên |
|---|---|
| Database | `A3StudentName_ClassCode` |
| Spring Boot project | `A3StudentName_ClassCode` |
| ReactJS project | `A3StudentName_ClassCode` |

**Phân quyền (2 role):**

| Role | Nguồn tài khoản | Được làm gì |
|---|---|---|
| **STAFF** | Lấy từ `application.properties` | Quản lý Customer, quản lý Room, quản lý Booking (kèm booking detail) |
| **CUSTOMER** | Tự đăng ký (lưu DB, bảng `Customer`) | Đăng ký tài khoản, tạo booking online (1 hoặc nhiều phòng), sửa profile của chính mình, xem lịch sử booking |
| *(không đăng nhập)* | — | **Chỉ xem thông tin phòng** (`GET /api/rooms`) |

**Ràng buộc nghiệp vụ quan trọng (điểm hay mất):**

1. **Xem phòng không cần đăng nhập** — `GET /api/rooms` và `GET /api/rooms/{id}` là public.
2. **Xóa Room:** chỉ **xóa cứng** khi phòng **chưa nằm trong booking detail** nào. Nếu đã được dùng trong booking → **không xóa**, chỉ **đổi `RoomStatus` = 2 (Deleted/Inactive)**.
3. **Đăng ký & đăng nhập Customer bằng JWT** — mọi endpoint bảo mật phải kiểm tra token + đúng role.
4. **Booking gồm 1 hoặc nhiều phòng** (BookingReservation ↔ BookingDetail 1-N); tổng tiền `TotalPrice` = tổng `ActualPrice` các phòng theo số ngày.
5. **Validate kiểu dữ liệu cho tất cả field** (Bean Validation ở BE + form validation ở FE).
6. Create/Update trên FE **bắt buộc dùng popup dialog** (Modal); Delete **luôn kèm confirmation**.
7. **Không bao giờ trả `Password` ra response** (dùng DTO + `@JsonIgnore`).

---

## 0. Chuẩn bị môi trường

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| JDK | 17+ | Spring Boot 3 yêu cầu tối thiểu 17 |
| IntelliJ IDEA | bản mới | hoặc tạo project tại https://start.spring.io |
| SQL Server | 2019+ | bật TCP/IP port 1433, SQL Authentication |
| Node.js | 18+ | cho Vite + React 18 |
| Postman | bản mới | kiểm thử API (kèm JWT) |
| Git | bản mới | commit theo từng TODO |

**Tạo database:** chạy script `Assignment 02_FUMiniHotelManagement.sql` trong SSMS, **đổi tên database** thành `A3StudentName_ClassCode` (sửa dòng `CREATE DATABASE`, `USE` và `ALTER DATABASE`). Script tạo 5 bảng: `RoomType`, `RoomInformation`, `Customer`, `BookingReservation`, `BookingDetail` cùng các khóa ngoại.

**Cấu trúc bảng (dùng để map Entity đúng tên cột):**

| Bảng | Khóa chính | Cột chính |
|---|---|---|
| `RoomType` | `RoomTypeID` (int, IDENTITY) | `RoomTypeName`, `TypeDescription`, `TypeNote` |
| `RoomInformation` | `RoomID` (int, IDENTITY) | `RoomNumber`, `RoomDetailDescription`, `RoomMaxCapacity`, `RoomTypeID` (FK), `RoomStatus` (tinyint), `RoomPricePerDay` (money) |
| `Customer` | `CustomerID` (int, IDENTITY(3,1)) | `CustomerFullName`, `Telephone`, `EmailAddress` (**Unique, NOT NULL**), `CustomerBirthday`, `CustomerStatus` (tinyint), `Password` |
| `BookingReservation` | `BookingReservationID` (int, **nhập tay**) | `BookingDate`, `TotalPrice` (money), `CustomerID` (FK), `BookingStatus` (tinyint) |
| `BookingDetail` | **PK kép** `(BookingReservationID, RoomID)` | `StartDate`, `EndDate`, `ActualPrice` (money) |

> Quy ước status dùng chung: `1` = Active, `2` = Inactive/Deleted. `RoomStatus`: 1 = Available, 2 = Deleted (đã dùng trong booking nên không xóa cứng được).

**Tài khoản để test:**

| Loại | Cách có tài khoản |
|---|---|
| **Staff** | Đặt trong `application.properties` (ví dụ bên dưới) — không lưu DB |
| **Customer** | Gọi `POST /api/auth/register` để tạo, rồi `POST /api/auth/login` để lấy JWT |

```properties
# Tài khoản Staff cố định (không lưu DB)
app.staff.email=admin@fumini.com
app.staff.password=@1
```

> **Lưu ý về mật khẩu:** dữ liệu mẫu trong DB lưu password **dạng plaintext**. Để bảo mật đúng chuẩn, hướng dẫn này dùng **BCryptPasswordEncoder** cho Customer đăng ký mới qua API (mật khẩu được hash trước khi lưu). Vì vậy hãy **đăng ký customer mới bằng API** để test, đừng dùng lại password plaintext có sẵn (chúng sẽ không khớp sau khi bật BCrypt). Nếu muốn giữ tương thích với dữ liệu mẫu plaintext, có thể tạm dùng `NoOpPasswordEncoder` (chỉ để học, không dùng thật).

---

## 1. Cấu trúc project

### 1.1. Backend — Spring Boot 3 (3-Layer + Security + JWT)

```
A3StudentName_ClassCode/                 (backend)
├── pom.xml                              # Web, Data JPA, Validation, MSSQL, Security, Lombok, jjwt
└── src/main/
    ├── resources/
    │   └── application.properties       # datasource + JWT secret + tài khoản staff
    └── java/com/fu/a3/
        ├── A3Application.java
        ├── config/
        │   ├── SecurityConfig.java              # SecurityFilterChain, phân quyền URL, PasswordEncoder
        │   ├── CorsConfig.java                  # cho phép React (5173) gọi API
        │   └── ApplicationConfig.java           # UserDetailsService (staff từ properties + customer từ DB)
        ├── security/                            # === JWT ===
        │   ├── JwtService.java                  # tạo / đọc / kiểm tra token
        │   ├── JwtAuthenticationFilter.java     # đọc Bearer token mỗi request
        │   └── StaffProperties.java             # bind app.staff.* từ properties
        ├── entity/                              # === Data Layer ===
        │   ├── Customer.java
        │   ├── RoomType.java
        │   ├── RoomInformation.java             # @ManyToOne RoomType
        │   ├── BookingReservation.java          # @ManyToOne Customer, @OneToMany BookingDetail
        │   ├── BookingDetail.java               # @EmbeddedId (BookingReservationID, RoomID)
        │   └── BookingDetailId.java             # khóa kép @Embeddable
        ├── repository/                          # === Data Layer ===
        │   ├── CustomerRepository.java
        │   ├── RoomTypeRepository.java
        │   ├── RoomInformationRepository.java
        │   ├── BookingReservationRepository.java
        │   └── BookingDetailRepository.java     # existsByRoom... (chặn xóa cứng room)
        ├── dto/                                 # request/response + validation
        │   ├── auth/
        │   │   ├── RegisterRequest.java
        │   │   ├── LoginRequest.java
        │   │   └── AuthResponse.java            # { token, role, email, fullName }
        │   ├── CustomerRequest.java / CustomerResponse.java
        │   ├── RoomRequest.java   / RoomResponse.java
        │   ├── RoomTypeResponse.java
        │   ├── BookingRequest.java / BookingResponse.java
        │   └── BookingDetailRequest.java / BookingDetailResponse.java
        ├── service/                             # === Business Layer ===
        │   ├── AuthService.java                 # register + login + phát JWT
        │   ├── CustomerService.java
        │   ├── RoomService.java                 # xóa cứng HOẶC đổi status
        │   └── BookingService.java              # tạo booking + details + tính TotalPrice
        ├── controller/                          # === Presentation Layer ===
        │   ├── AuthController.java              # /api/auth/register, /login
        │   ├── CustomerController.java          # /api/customers  (+ /profile)
        │   ├── RoomController.java              # /api/rooms  (GET public)
        │   ├── RoomTypeController.java          # /api/room-types
        │   └── BookingController.java           # /api/bookings (+ /my)
        └── exception/
            ├── ResourceNotFoundException.java   # 404
            ├── ConflictException.java           # 409
            ├── BadRequestException.java         # 400
            └── GlobalExceptionHandler.java      # @RestControllerAdvice
```

### 1.2. Frontend — React 18 + Vite + React-Bootstrap

```
A3StudentName_ClassCode/                 (frontend)
├── package.json                         # react, react-router-dom, axios, react-bootstrap
├── vite.config.js                       # port 5173
├── index.html
└── src/
    ├── main.jsx                         # import bootstrap css
    ├── App.jsx                          # Router + role-based routes
    ├── context/
    │   └── AuthContext.jsx              # token, user, role, login/logout
    ├── services/                        # axios — mỗi resource 1 file
    │   ├── api.js                       # axios instance + interceptor gắn Bearer token
    │   ├── authService.js               # register, login
    │   ├── customerService.js
    │   ├── roomService.js
    │   ├── roomTypeService.js
    │   └── bookingService.js
    ├── components/
    │   ├── Header.jsx                   # navbar theo role (guest / customer / staff)
    │   ├── ProtectedRoute.jsx           # chặn route theo role
    │   ├── ConfirmModal.jsx             # xác nhận xóa (dùng chung)
    │   ├── CustomerModal.jsx            # popup Create/Update customer (staff)
    │   ├── RoomModal.jsx                # popup Create/Update room (staff)
    │   └── BookingModal.jsx             # popup tạo booking nhiều phòng (customer)
    └── pages/
        ├── HomePage.jsx                 # public — danh sách phòng, không cần login
        ├── LoginPage.jsx
        ├── RegisterPage.jsx             # customer đăng ký
        ├── customer/
        │   ├── BookingCreatePage.jsx    # tạo booking nhiều phòng
        │   ├── BookingHistoryPage.jsx   # lịch sử booking của mình
        │   └── ProfilePage.jsx          # sửa profile của mình
        └── staff/
            ├── CustomerManagementPage.jsx
            ├── RoomManagementPage.jsx
            └── BookingManagementPage.jsx
```

### 1.3. Bảng API chuẩn (kèm quyền truy cập)

| Method | Endpoint | Chức năng | Quyền | Status |
|---|---|---|---|---|
| POST | `/api/auth/register` | Customer đăng ký | **Public** | 201 / 400 / 409 |
| POST | `/api/auth/login` | Đăng nhập → trả JWT + role | **Public** | 200 / 401 / 400 |
| GET | `/api/rooms` | Danh sách phòng | **Public** | 200 |
| GET | `/api/rooms/{id}` | Chi tiết phòng | **Public** | 200 / 404 |
| GET | `/api/rooms/search?q=` | Tìm phòng theo số/loại | **Public** | 200 |
| POST | `/api/rooms` | Tạo phòng | STAFF | 201 / 400 |
| PUT | `/api/rooms/{id}` | Cập nhật phòng | STAFF | 200 / 400 / 404 |
| DELETE | `/api/rooms/{id}` | Xóa phòng (**xóa cứng nếu chưa dùng, ngược lại đổi status**) | STAFF | 204 / 404 |
| GET | `/api/room-types` | Danh sách loại phòng | **Public** | 200 |
| GET | `/api/customers` | Danh sách customer | STAFF | 200 |
| GET | `/api/customers/{id}` | Chi tiết customer | STAFF | 200 / 404 |
| GET | `/api/customers/search?q=` | Tìm theo tên/email | STAFF | 200 |
| POST | `/api/customers` | Tạo customer | STAFF | 201 / 400 / 409 |
| PUT | `/api/customers/{id}` | Cập nhật customer | STAFF | 200 / 400 / 404 |
| DELETE | `/api/customers/{id}` | Xóa customer | STAFF | 204 / 404 / 409 |
| GET | `/api/customers/profile` | Xem profile của chính mình | CUSTOMER | 200 |
| PUT | `/api/customers/profile` | Sửa profile của chính mình | CUSTOMER | 200 / 400 |
| GET | `/api/bookings` | Danh sách tất cả booking | STAFF | 200 |
| GET | `/api/bookings/{id}` | Chi tiết booking + details | STAFF/CUSTOMER (chủ sở hữu) | 200 / 404 |
| POST | `/api/bookings` | Tạo booking online (nhiều phòng) | CUSTOMER | 201 / 400 |
| PUT | `/api/bookings/{id}` | Cập nhật booking | STAFF | 200 / 400 / 404 |
| DELETE | `/api/bookings/{id}` | Hủy/xóa booking | STAFF | 204 / 404 |
| GET | `/api/bookings/my` | Lịch sử booking của chính mình | CUSTOMER | 200 |

---

## 2. Quy ước commit (bắt buộc ở mỗi TODO)

Theo Conventional Commits. **Mỗi TODO hoàn thành = ít nhất 1 commit**, message dạng:

```
feat(TODO-NN): <mô tả ngắn bằng tiếng Anh>
```

Các type dùng: `feat` (tính năng), `fix` (sửa lỗi), `test` (kiểm thử), `docs` (tài liệu), `chore` (cấu hình).

Chuỗi commit chuẩn của toàn bài:

```
chore(TODO-01): init spring boot project with security and jwt dependencies
feat(TODO-02): add JPA entities with relationships and composite key for booking detail
feat(TODO-03): add spring data repositories with search and constraint queries
feat(TODO-04): add request/response DTOs with bean validation
feat(TODO-05): implement jwt security with staff from properties and customer from db
feat(TODO-06): implement service layer with business rules and booking total price
feat(TODO-07): add REST controllers, method security, global exception handler and CORS
test(TODO-08): verify all secured endpoints with postman collection
chore(TODO-09): init react vite project and axios services with jwt interceptor
feat(TODO-10): add auth context, login, register and role-based routing
feat(TODO-11): add public room listing page without authentication
feat(TODO-12): add customer booking creation, history and profile
feat(TODO-13): add staff customer management with modal and confirm delete
feat(TODO-14): add staff room management with delete-or-deactivate rule
feat(TODO-15): add staff booking management
test(TODO-16): end-to-end testing FE-BE integration
```

Quy tắc: message viết thường, thì hiện tại, không dấu chấm cuối; 1 commit chỉ chứa thay đổi của đúng TODO đó; push sau mỗi TODO (`git push origin main`). Có `.gitignore` loại `target/`, `node_modules/`, `*.env`.

---

## 3. Hướng dẫn step-by-step theo TODO

### PHẦN A — BACKEND (TODO-01 → TODO-08)

---

### TODO-01 — Tạo Spring Boot project + dependency Security/JWT + Data Source

**Bước 1.** Vào https://start.spring.io (hoặc IntelliJ → New Project → Spring Initializr):
- Project: **Maven**, Language: **Java**, Spring Boot: **3.2.x**
- Group: `com.fu` — Artifact: `A3StudentName_ClassCode` — Java: **17**
- Dependencies: **Spring Web**, **Spring Data JPA**, **MS SQL Server Driver**, **Validation**, **Spring Security**, **Lombok**

**Bước 2.** Thêm thư viện JWT (jjwt) vào `pom.xml`:

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

**Bước 3.** Tạo database trong SSMS: chạy script `Assignment 02_FUMiniHotelManagement.sql`, đổi tên DB thành `A3StudentName_ClassCode`.

**Bước 4.** Cấu hình `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A3StudentName_ClassCode;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword@123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=Zm9vYmFyLXN1cGVyLXNlY3JldC1rZXktZm9yLWp3dC1obWFjLXNoYTI1Ni0xMjM0
app.jwt.expiration=86400000

# Tài khoản Staff cố định
app.staff.email=admin@fumini.com
app.staff.password=@1
```

> `app.jwt.secret` phải là chuỗi Base64 đủ dài (≥ 32 byte) cho HMAC-SHA256. `app.jwt.expiration` tính bằng ms (86400000 = 1 ngày).

**Bước 5.** Chạy `A3Application` → console không lỗi kết nối, Tomcat chạy ở port 8080. Vì mới thêm Spring Security nên **mặc định mọi endpoint bị chặn 401** — điều này sẽ được cấu hình lại ở TODO-05.

**Lỗi thường gặp:** `The TCP/IP connection to the host has failed` → mở SQL Server Configuration Manager, bật TCP/IP, restart service. `Login failed for user 'sa'` → bật SQL Authentication mode và enable user sa.

✅ **Checklist TODO-01**
- [ ] Project chạy được, không exception; log hiện `HikariPool-1 - Start completed`
- [ ] Database đúng tên `A3StudentName_ClassCode`, đủ 5 bảng + FK
- [ ] `pom.xml` có đủ Security + 3 artifact jjwt

📌 **Commit:** `chore(TODO-01): init spring boot project with security and jwt dependencies`

---

### TODO-02 — Tạo Entity + quan hệ (kèm khóa kép BookingDetail)

Tạo package `entity` với 5 class + 1 class khóa kép. Map **đúng tên cột** trong DB (bảng ở mục 0).

| Entity | Khóa chính | Quan hệ |
|---|---|---|
| `RoomType` | `roomTypeId` (Integer, IDENTITY) | `@OneToMany` → RoomInformation |
| `RoomInformation` | `roomId` (Integer, IDENTITY) | `@ManyToOne` → RoomType |
| `Customer` | `customerId` (Integer, IDENTITY) | `@OneToMany` → BookingReservation |
| `BookingReservation` | `bookingReservationId` (Integer, **nhập tay**) | `@ManyToOne` Customer, `@OneToMany` BookingDetail |
| `BookingDetail` | `@EmbeddedId BookingDetailId` | `@ManyToOne` BookingReservation, `@ManyToOne` RoomInformation |

Điểm cần chú ý:

1. **Khóa kép** của `BookingDetail` khai bằng `@Embeddable` + `@EmbeddedId`:

```java
@Embeddable
public class BookingDetailId implements Serializable {
    @Column(name = "BookingReservationID") private Integer bookingReservationId;
    @Column(name = "RoomID") private Integer roomId;
    // equals() + hashCode() bắt buộc
}
```

```java
@Entity @Table(name = "BookingDetail")
public class BookingDetail {
    @EmbeddedId private BookingDetailId id;

    @ManyToOne @MapsId("bookingReservationId")
    @JoinColumn(name = "BookingReservationID")
    private BookingReservation bookingReservation;

    @ManyToOne @MapsId("roomId")
    @JoinColumn(name = "RoomID")
    private RoomInformation room;

    @Column(name = "StartDate") private LocalDate startDate;
    @Column(name = "EndDate")   private LocalDate endDate;
    @Column(name = "ActualPrice") private BigDecimal actualPrice;
}
```

2. `BookingReservation.bookingReservationId` **không** `@GeneratedValue` (DB không IDENTITY) → sinh ID thủ công ở Service.
3. `Customer.password` đánh dấu `@JsonIgnore`; `Customer.emailAddress` là unique.
4. `@OneToMany` từ `BookingReservation` → `List<BookingDetail>` dùng `cascade = ALL, orphanRemoval = true` để lưu/xóa details theo booking.
5. Kiểu `money` (SQL) map sang `BigDecimal`; `date` → `LocalDate`; `tinyint` status → `Integer`/`Short`.
6. Dùng Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor` cho gọn (tránh `@Data` trên entity có quan hệ để không lỗi vòng lặp `toString`).

✅ **Checklist TODO-02**
- [ ] Chạy lại app, Hibernate không báo lỗi mapping, không sinh bảng thừa
- [ ] `BookingDetail` map đúng khóa kép; `@MapsId` không lỗi
- [ ] `password` có `@JsonIgnore`

📌 **Commit:** `feat(TODO-02): add JPA entities with relationships and composite key for booking detail`

---

### TODO-03 — Tạo Repository

Tạo package `repository` với 5 interface extends `JpaRepository`. Các derived query bắt buộc:

```java
// CustomerRepository — login + register + search
Optional<Customer> findByEmailAddress(String email);
boolean existsByEmailAddress(String email);
List<Customer> findByCustomerFullNameContainingIgnoreCaseOrEmailAddressContainingIgnoreCase(String name, String email);

// RoomInformationRepository — search
List<RoomInformation> findByRoomNumberContainingIgnoreCaseOrRoomType_RoomTypeNameContainingIgnoreCase(String no, String type);

// BookingDetailRepository — chặn xóa cứng room
boolean existsById_RoomId(Integer roomId);          // room có nằm trong booking detail không

// BookingReservationRepository — lịch sử theo customer + chặn xóa customer
List<BookingReservation> findByCustomer_CustomerIdOrderByBookingDateDesc(Integer customerId);
boolean existsByCustomer_CustomerId(Integer customerId);
```

✅ **Checklist TODO-03**
- [ ] App chạy được — tên method sai quy tắc Spring Data sẽ fail ngay lúc khởi động
- [ ] Có `existsById_RoomId` phục vụ quy tắc xóa room
- [ ] Có `findByEmailAddress` phục vụ login/register

📌 **Commit:** `feat(TODO-03): add spring data repositories with search and constraint queries`

---

### TODO-04 — DTO + Validation (validate tất cả field)

Tạo package `dto`, dùng Java record + Bean Validation:

| DTO | Validation chính |
|---|---|
| `RegisterRequest` | `@NotBlank @Size(max=50)` fullName; `@Email @NotBlank @Size(max=50)` email; `@NotBlank @Size(min=1,max=50)` password; `@Size(max=12)` telephone; `@Past` birthday |
| `LoginRequest` | `@NotBlank @Email` email; `@NotBlank` password |
| `AuthResponse` | `token`, `role`, `email`, `fullName` (không validation — chỉ response) |
| `CustomerRequest` | như Register nhưng có `@NotNull` status (1/2) |
| `RoomRequest` | `@NotBlank @Size(max=50)` roomNumber; `@Size(max=220)` description; `@NotNull @Min(1)` maxCapacity; `@NotNull` roomTypeId; `@NotNull` status; `@NotNull @DecimalMin("0.0")` pricePerDay |
| `BookingRequest` | `@NotEmpty @Valid List<BookingDetailRequest>` details |
| `BookingDetailRequest` | `@NotNull` roomId; `@NotNull @FutureOrPresent` startDate; `@NotNull @Future` endDate |

Response DTO (`CustomerResponse`, `RoomResponse`, `RoomTypeResponse`, `BookingResponse`, `BookingDetailResponse`) có static factory `from(entity)` — tách entity khỏi JSON trả về, **không lộ password**, kèm tên loại phòng/tên khách cho FE hiển thị.

> Validate chéo: `endDate > startDate`. Đơn giản nhất kiểm ở Service và ném `BadRequestException`; hoặc viết custom annotation `@ValidDateRange`.

✅ **Checklist TODO-04**
- [ ] Mọi field có annotation validation đúng độ dài cột DB
- [ ] `BookingRequest.details` dùng `@NotEmpty` + `@Valid` (validate lồng danh sách)
- [ ] Response không chứa password

📌 **Commit:** `feat(TODO-04): add request/response DTOs with bean validation`

---

### TODO-05 — Spring Security + JWT (trọng tâm của Assignment 3)

Tạo package `security` + `config`. Đây là phần khác biệt lớn nhất so với Assignment 02.

**Bước 1 — `StaffProperties`:** bind `app.staff.email` / `app.staff.password` từ properties.

**Bước 2 — `JwtService`:** dùng `app.jwt.secret` + `app.jwt.expiration`.

```java
public String generateToken(String email, String role) {
    return Jwts.builder()
        .subject(email)
        .claim("role", role)                       // "STAFF" hoặc "CUSTOMER"
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignKey())
        .compact();
}
public String extractEmail(String token) { ... }   // đọc subject
public String extractRole(String token)  { ... }   // đọc claim role
public boolean isValid(String token)     { ... }   // chữ ký hợp lệ + chưa hết hạn
```

**Bước 3 — `ApplicationConfig` (UserDetailsService):** nếu email trùng staff trong properties → trả `User` với `ROLE_STAFF`; ngược lại tìm trong `CustomerRepository` → `ROLE_CUSTOMER`; không có → `UsernameNotFoundException`. Khai bean `PasswordEncoder` = `BCryptPasswordEncoder` và `AuthenticationManager`.

**Bước 4 — `JwtAuthenticationFilter` (extends `OncePerRequestFilter`):** đọc header `Authorization: Bearer <token>`; nếu hợp lệ → tạo `UsernamePasswordAuthenticationToken` với authority `ROLE_<role>` và set vào `SecurityContextHolder`.

**Bước 5 — `SecurityConfig` (`SecurityFilterChain`):**

```java
http.csrf(csrf -> csrf.disable())
    .cors(Customizer.withDefaults())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/rooms/**", "/api/room-types/**").permitAll()
        .requestMatchers("/api/customers/profile").hasRole("CUSTOMER")
        .requestMatchers(HttpMethod.POST, "/api/bookings").hasRole("CUSTOMER")
        .requestMatchers("/api/bookings/my").hasRole("CUSTOMER")
        .requestMatchers("/api/customers/**", "/api/rooms/**", "/api/bookings/**").hasRole("STAFF")
        .anyRequest().authenticated())
    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

> Thứ tự rule quan trọng: khai báo rule cụ thể (profile, POST bookings, /my) **trước** rule `hasRole("STAFF")` tổng quát, nếu không customer sẽ bị chặn nhầm.

**Bước 6 — bật method security** (tùy chọn, để dùng `@PreAuthorize`): thêm `@EnableMethodSecurity` lên `SecurityConfig`.

✅ **Checklist TODO-05**
- [ ] `GET /api/rooms` gọi **không cần token** vẫn trả 200
- [ ] Gọi endpoint bảo mật **không có token** → 401; sai role → 403
- [ ] Token do login phát ra có claim `role` đúng; hết hạn → bị từ chối
- [ ] Password lưu DB là chuỗi BCrypt (bắt đầu bằng `$2a$`)

📌 **Commit:** `feat(TODO-05): implement jwt security with staff from properties and customer from db`

---

### TODO-06 — Service layer (business rules + tính TotalPrice)

Tạo package `service` + `exception`. Business rules phải nằm ở **Service, không nằm ở Controller**:

1. **AuthService.register:** kiểm tra trùng email (`existsByEmailAddress`) → `ConflictException` (409); hash password bằng `PasswordEncoder`; set `customerStatus = 1`; lưu Customer.
2. **AuthService.login:** xác thực qua `AuthenticationManager`; nếu là staff (email == properties) phát token `role=STAFF`, ngược lại `role=CUSTOMER`; sai thông tin → 401.
3. **RoomService.delete (quy tắc quan trọng):**

```java
if (bookingDetailRepository.existsById_RoomId(id)) {
    room.setRoomStatus(2);              // đã dùng trong booking → chỉ đổi status
    roomInformationRepository.save(room);
} else {
    roomInformationRepository.delete(room);   // chưa dùng → xóa cứng
}
```

4. **CustomerService.delete:** nếu customer đã có booking (`existsByCustomer_CustomerId`) → `ConflictException` (409) hoặc đổi `customerStatus = 2` (chọn 1 hướng và ghi rõ trong report).
5. **CustomerService.updateProfile:** lấy email từ token (`SecurityContextHolder`), chỉ cho sửa chính mình; nếu đổi password thì hash lại.
6. **BookingService.create:**
   - Sinh `bookingReservationId` mới (max id + 1).
   - Lấy customer hiện tại từ token.
   - Với mỗi `BookingDetailRequest`: load Room, kiểm tra `endDate > startDate`, tính `ActualPrice = pricePerDay * số ngày`.
   - `TotalPrice = Σ ActualPrice`; set `bookingDate = today`, `bookingStatus = 1`.
   - Lưu cascade booking + details.
7. Không tìm thấy id → `ResourceNotFoundException` (404); dữ liệu sai → `BadRequestException` (400).

✅ **Checklist TODO-06**
- [ ] Xóa room đang dùng → đổi status 2 (không xóa); room chưa dùng → xóa cứng
- [ ] Tạo booking nhiều phòng → `TotalPrice` = tổng đúng theo số ngày
- [ ] Register hash password; login sai → 401
- [ ] Customer chỉ sửa được profile của chính mình

📌 **Commit:** `feat(TODO-06): implement service layer with business rules and booking total price`

---

### TODO-07 — REST Controller + Method Security + GlobalExceptionHandler + CORS

Tạo package `controller` theo đúng bảng API mục 1.3. Chú ý:

- `@Valid @RequestBody` trên mọi POST/PUT để kích hoạt validation.
- POST trả `201` (`@ResponseStatus(HttpStatus.CREATED)`), DELETE trả `204`.
- Với endpoint theo role có thể thêm `@PreAuthorize("hasRole('STAFF')")` / `hasRole('CUSTOMER')` (song song với rule ở SecurityConfig — chọn 1 cách nhất quán).
- Lấy user hiện tại: tham số `Authentication authentication` hoặc `@AuthenticationPrincipal`.
- `GlobalExceptionHandler` (`@RestControllerAdvice`) map: `MethodArgumentNotValidException` → 400 kèm map lỗi từng field; `ResourceNotFoundException` → 404; `ConflictException` → 409; `BadRequestException` → 400; `BadCredentialsException`/`AuthenticationException` → 401; `AccessDeniedException` → 403.
- `CorsConfig` cho phép origin `http://localhost:5173` với GET/POST/PUT/DELETE + header `Authorization`.

✅ **Checklist TODO-07**
- [ ] Đủ endpoint theo bảng mục 1.3
- [ ] Gửi body thiếu field → 400 kèm danh sách lỗi từng field
- [ ] 401 khi thiếu token, 403 khi sai role, được trả JSON gọn (không phải trang HTML lỗi)
- [ ] Không còn try-catch lặp trong controller (đã có handler tập trung)

📌 **Commit:** `feat(TODO-07): add REST controllers, method security, global exception handler and CORS`

---

### TODO-08 — Kiểm thử Postman toàn bộ API (kèm JWT)

Làm theo file **`Testing_Postman.md`** (cạnh file này). Chỉ chuyển sang FE khi **tất cả request pass**, đặc biệt các case: xem phòng không cần token, gọi endpoint staff bằng token customer bị 403, xóa room đang dùng chỉ đổi status.

📌 **Commit:** `test(TODO-08): verify all secured endpoints with postman collection`

---

### PHẦN B — FRONTEND (TODO-09 → TODO-16)

---

### TODO-09 — Tạo React project + axios services + JWT interceptor

**Bước 1.** Tạo project:

```bash
npm create vite@latest A3StudentName_ClassCode -- --template react
cd A3StudentName_ClassCode
npm install
npm install axios react-router-dom bootstrap react-bootstrap
```

**Bước 2.** Import bootstrap trong `src/main.jsx`: `import 'bootstrap/dist/css/bootstrap.min.css'`.

**Bước 3.** Tạo `src/services/api.js` — axios instance + **interceptor gắn token**:

```js
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:8080/api' });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) { localStorage.clear(); location.href = '/login'; }
  return Promise.reject(err);
});
export default api;
```

**Bước 4.** Tạo 5 service files (`authService`, `customerService`, `roomService`, `roomTypeService`, `bookingService`) — mỗi hàm named export, `async/await`, return `response.data`.

✅ **Checklist TODO-09**
- [ ] `npm run dev` chạy tại http://localhost:5173
- [ ] Interceptor tự gắn `Authorization: Bearer` khi có token
- [ ] Không hardcode URL trong component — mọi request qua services

📌 **Commit:** `chore(TODO-09): init react vite project and axios services with jwt interceptor`

---

### TODO-10 — AuthContext + Login + Register + Router phân quyền

**Bước 1.** `src/context/AuthContext.jsx`: state `token` + `user` (`{ email, role, fullName }`) khởi tạo từ `localStorage`; hàm `login(data)` lưu token + user; `logout()` xóa; cờ `isStaff` (role STAFF), `isCustomer` (role CUSTOMER).

**Bước 2.** `RegisterPage.jsx`: form đăng ký customer (fullName, email, password, telephone, birthday) → gọi `authService.register`, thành công điều hướng `/login`.

**Bước 3.** `LoginPage.jsx`: form email + password → `authService.login` trả `{ token, role, ... }`, lưu vào context, điều hướng theo role (STAFF → `/staff/rooms`, CUSTOMER → `/`).

**Bước 4.** `ProtectedRoute.jsx`: chưa login → `/login`; sai role → `/`.

**Bước 5.** `App.jsx` khai báo routes; `Header.jsx` hiện menu theo role (guest thấy Login/Register; customer thấy Booking/History/Profile; staff thấy Customers/Rooms/Bookings).

| Route | Component | Quyền |
|---|---|---|
| `/` | HomePage (danh sách phòng) | Public |
| `/login`, `/register` | Login/Register | Public |
| `/booking`, `/history`, `/profile` | trang Customer | CUSTOMER |
| `/staff/customers`, `/staff/rooms`, `/staff/bookings` | trang Staff | STAFF |

✅ **Checklist TODO-10**
- [ ] Register tạo được customer; login đúng → điều hướng đúng role; sai → báo lỗi từ API
- [ ] F5 không mất đăng nhập (localStorage); logout xóa token
- [ ] Customer gõ tay `/staff/rooms` bị đẩy về `/`; chưa login vào `/profile` bị đẩy về `/login`

📌 **Commit:** `feat(TODO-10): add auth context, login, register and role-based routing`

---

### TODO-11 — Trang danh sách phòng công khai (không cần đăng nhập)

`HomePage.jsx`: `useEffect` gọi `getRooms()` (`/api/rooms` — public), hiển thị Card/Table grid gồm số phòng, loại phòng, sức chứa, giá/ngày, trạng thái. Có ô search (`/rooms/search?q=`), trạng thái `loading` (Spinner) và `error` (Alert). Nếu là customer đăng nhập, mỗi phòng có nút "Book".

✅ **Checklist TODO-11**
- [ ] Mở `/` khi **chưa login** vẫn xem được danh sách phòng
- [ ] Search phòng theo số/loại hoạt động
- [ ] Tắt BE → hiện thông báo lỗi, không trắng trang

📌 **Commit:** `feat(TODO-11): add public room listing page without authentication`

---

### TODO-12 — Customer: Tạo booking (nhiều phòng) + Lịch sử + Profile

**Bước 1.** `BookingCreatePage.jsx` / `BookingModal.jsx`: chọn **nhiều phòng** (thêm dòng phòng), mỗi dòng có Room (select từ `/rooms`), StartDate, EndDate; hiển thị tạm tính; submit gọi `createBooking({ details: [...] })`.

**Bước 2.** `BookingHistoryPage.jsx`: gọi `getMyBookings()` (`/bookings/my`) → bảng booking của chính mình (mã, ngày, tổng tiền, trạng thái, số phòng), bấm xem chi tiết details.

**Bước 3.** `ProfilePage.jsx`: gọi `getProfile()` (`/customers/profile`), form sửa fullName/telephone/birthday/password → `updateProfile(...)`, thành công cập nhật lại AuthContext.

✅ **Checklist TODO-12**
- [ ] Tạo booking chọn được **≥ 2 phòng**; `TotalPrice` khớp tổng theo số ngày
- [ ] History chỉ hiện booking của đúng user đang đăng nhập
- [ ] Sửa profile thành công; đổi tên → tên trên Header đổi theo

📌 **Commit:** `feat(TODO-12): add customer booking creation, history and profile`

---

### TODO-13 — Staff: Customer Management (CRUD + Search + Modal + Confirm)

`CustomerManagementPage.jsx` + `CustomerModal.jsx` + `ConfirmModal.jsx`:
- Bảng ID, FullName, Email, Telephone, Status + nút Edit/Delete; nút "+ Add Customer".
- Modal **popup** dùng chung Create/Update; validate `required`, `type="email"`, `maxLength`; lỗi 400/409 hiện trong modal.
- Delete **luôn qua xác nhận**; nếu customer đã có booking → xử lý theo quy tắc BE (409 hoặc đổi status), hiện thông báo rõ.
- Search theo tên/email (`/customers/search?q=`).

✅ **Checklist TODO-13**
- [ ] Create/Update mở popup, thành công đóng modal + reload bảng
- [ ] Delete luôn hỏi xác nhận; ràng buộc customer có booking báo rõ
- [ ] Search hoạt động; validate chặn email sai định dạng

📌 **Commit:** `feat(TODO-13): add staff customer management with modal and confirm delete`

---

### TODO-14 — Staff: Room Management (quy tắc xóa cứng / đổi status)

`RoomManagementPage.jsx` + `RoomModal.jsx`:
- Bảng số phòng, loại (từ `/room-types`), sức chứa, giá/ngày, trạng thái + Edit/Delete; nút "+ Add Room".
- Modal có select **Room Type**, input số/sức chứa/giá, switch/select **Status**; validate mọi field.
- Delete qua confirm: gọi `DELETE /rooms/{id}`. **Giải thích trên UI**: phòng đã dùng trong booking sẽ chuyển sang trạng thái Inactive thay vì bị xóa (BE tự xử lý) → sau khi xóa, reload bảng để thấy hoặc phòng biến mất (chưa dùng) hoặc chuyển Inactive (đã dùng).

✅ **Checklist TODO-14**
- [ ] CRUD + Search phòng hoạt động, popup + confirm đầy đủ
- [ ] Xóa phòng chưa dùng → biến mất khỏi bảng; xóa phòng đã dùng → chuyển Inactive
- [ ] Validate giá ≥ 0, sức chứa ≥ 1

📌 **Commit:** `feat(TODO-14): add staff room management with delete-or-deactivate rule`

---

### TODO-15 — Staff: Booking Management

`BookingManagementPage.jsx`: gọi `getBookings()` (`/bookings`) → bảng tất cả booking (mã, khách, ngày, tổng tiền, trạng thái); xem chi tiết details (phòng, ngày, giá); cho phép cập nhật trạng thái (`PUT /bookings/{id}`) và xóa/hủy (`DELETE`, qua confirm).

✅ **Checklist TODO-15**
- [ ] Staff xem được toàn bộ booking kèm details
- [ ] Cập nhật trạng thái / xóa booking hoạt động (có confirm khi xóa)

📌 **Commit:** `feat(TODO-15): add staff booking management`

---

### TODO-16 — Kiểm thử tích hợp FE ↔ BE

Chạy đồng thời BE (8080) + FE (5173) và đi hết kịch bản ở **mục 5 (Checklist tổng)**.

📌 **Commit:** `test(TODO-16): end-to-end testing FE-BE integration`

---

## 4. Kiểm thử Postman

Xem chi tiết trong file **`Testing_Postman.md`** cạnh file này (kịch bản đầy đủ có JWT Bearer token, thứ tự chạy, script kiểm tra).

---

## 5. Checklist tổng trước khi nộp

### 5.1. Backend & Security
- [ ] Đúng 3-Layer: Controller không chứa business logic, Service không trả Entity thô (dùng DTO)
- [ ] Tên project + database = `A3StudentName_ClassCode`
- [ ] **JWT hoạt động**: login trả token, request bảo mật cần `Bearer` token
- [ ] **Staff lấy từ `application.properties`**, không lưu DB
- [ ] `GET /api/rooms` **không cần đăng nhập**
- [ ] Sai/thiếu token → 401; đúng token nhưng sai role → 403
- [ ] Xóa room đang dùng → đổi status; chưa dùng → xóa cứng
- [ ] Booking nhiều phòng, `TotalPrice` tính đúng
- [ ] Validation tất cả field (`@Valid`), lỗi 400 kèm chi tiết
- [ ] Password được hash (BCrypt), không trả password ở bất kỳ response nào
- [ ] Toàn bộ Postman collection pass

### 5.2. Frontend
- [ ] Đăng ký + đăng nhập; token lưu localStorage, interceptor gắn `Bearer`
- [ ] Điều hướng & menu theo role (guest / customer / staff)
- [ ] Guest xem phòng không cần login
- [ ] Customer: tạo booking nhiều phòng, xem history, sửa profile
- [ ] Staff: quản lý Customer / Room / Booking đủ Read, Create, Update, Delete, Search
- [ ] Create/Update **luôn bằng popup dialog**; Delete **luôn có confirmation**
- [ ] Form validate kiểu dữ liệu mọi field; lỗi API hiển thị cho người dùng
- [ ] Không hardcode URL trong component (mọi request qua `services/`)

### 5.3. Git
- [ ] Mỗi TODO ≥ 1 commit đúng format `type(TODO-NN): message`
- [ ] Lịch sử commit theo đúng thứ tự TODO-01 → TODO-16
- [ ] Không commit `node_modules/`, `target/`, file chứa secret

### 5.4. Kịch bản demo nhanh (5 phút)
1. Mở `/` chưa login → xem được danh sách phòng.
2. Register một customer mới → Login → nhận token, vào trang customer.
3. Tạo booking gồm **2 phòng**, 2 ngày khác nhau → tổng tiền đúng; xem trong History.
4. Sửa Profile → tên trên navbar đổi. Thử gõ `/staff/rooms` → bị đẩy về `/`.
5. Logout → Login Staff (admin@fumini.com) → quản lý Room: tạo phòng, sửa, xóa phòng **chưa dùng** (biến mất) và phòng **đã có booking** (chuyển Inactive).
6. Vào Booking Management (staff) → thấy booking khách vừa tạo kèm details.
