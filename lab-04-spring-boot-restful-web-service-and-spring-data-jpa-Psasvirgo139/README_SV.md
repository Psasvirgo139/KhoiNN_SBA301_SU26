# Lab 04 — Spring Boot RESTful Web Service and Spring Data JPA

**Môn:** SBA301  
**Tên bài:** Orchid Management RESTful API
# Thông tin sinh viên
Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |
---

## Cấu trúc thư mục project

```
orchid-management/
├── pom.xml
└── src/
    └── main/
        ├── java/com/lab04/orchidmanagement/
        │   ├── Lab04Application.java
        │   ├── pojos/
        │   │   └── Orchid.java
        │   ├── repositories/
        │   │   └── IOrchidRepository.java
        │   ├── services/
        │   │   ├── IOrchidService.java
        │   │   └── OrchidService.java
        │   ├── controllers/
        │   │   └── OrchidController.java
        │   ├── dto/
        │   │   └── ApiResponse.java
        │   └── exception/
        │       ├── OrchidNotFoundException.java
        │       └── GlobalExceptionHandler.java
        └── resources/
            └── application.properties
```

---

## Yêu cầu bắt buộc (TODOs)

**TODO 2 — Orchid Entity** (`pojos/Orchid.java`)
- Tạo class `Orchid` ánh xạ tới bảng `Orchid` trong SQL Server
- Khai báo đầy đủ 7 field: `orchidId`, `orchidName`, `isNatural`, `orchidDescription`, `orchidCategory`, `isAttractive`, `orchidURL`
- Sử dụng `@Entity`, `@Table`, `@Id`, `@GeneratedValue(strategy=IDENTITY)`, `@Column`
- Thêm `@NotBlank` cho `orchidName`, `@NotNull` cho `isNatural`
- Có constructor mặc định, constructor đầy đủ tham số, getters và setters

**TODO 3 — IOrchidRepository** (`repositories/IOrchidRepository.java`)
- Tạo interface `IOrchidRepository` extends `JpaRepository<Orchid, Integer>`
- Thêm các derived query method: `findByOrchidCategory`, `findByOrchidNameContainingIgnoreCase`, `findByIsNatural`, `findByIsAttractive`

**TODO 4 — IOrchidService** (`services/IOrchidService.java`)
- Định nghĩa interface với 5 method: `getAllOrchids()`, `getOrchidById(Integer id)`, `createOrchid(Orchid)`, `updateOrchid(Integer id, Orchid)`, `deleteOrchid(Integer id)`

**TODO 5 — OrchidService** (`services/OrchidService.java`)
- Implement `IOrchidService`, đánh dấu `@Service`
- Inject `IOrchidRepository` qua constructor
- `getAllOrchids`: gọi `repository.findAll()`
- `getOrchidById`: gọi `repository.findById(id)`, trả về `Optional<Orchid>`
- `createOrchid`: gọi `repository.save(orchid)`
- `updateOrchid`: tìm entity hiện có bằng `findById`, cập nhật từng field, gọi `save`
- `deleteOrchid`: kiểm tra tồn tại bằng `existsById`, gọi `deleteById`

**TODO 6 — OrchidController** (`controllers/OrchidController.java`)
- Đánh dấu `@RestController`, `@RequestMapping("/orchids")`
- Implement 5 endpoint với đúng HTTP method và status code:
  - `GET /orchids/` → 200 OK, trả về `List<Orchid>`
  - `POST /orchids/` → 201 Created, nhận `@RequestBody`, trả về orchid vừa tạo
  - `GET /orchids/{id}` → 200 OK hoặc 404 Not Found
  - `PUT /orchids/{id}` → 200 OK hoặc 404 Not Found
  - `DELETE /orchids/{id}` → 204 No Content
- Dùng `@PathVariable` cho `{id}`, `@RequestBody` cho POST/PUT

---

## Yêu cầu nâng cao (Advanced)

**ADVANCED 1 — Tìm kiếm đa tiêu chí**
- Thêm endpoint `GET /orchids/search`
- Nhận các `@RequestParam` tùy chọn: `name`, `category`, `isNatural`
- Dùng custom `@Query` trong repository để lọc kết hợp nhiều điều kiện

**ADVANCED 2 — Phân trang và sắp xếp**
- Thêm endpoint `GET /orchids/paged`
- Nhận `@RequestParam`: `page` (default 0), `size` (default 5), `sortBy` (default `orchidId`), `direction` (asc/desc)
- Dùng `PageRequest.of(page, size, Sort)` và `JpaRepository.findAll(Pageable)`

**ADVANCED 3 — Custom Exception Handling**
- Tạo class `OrchidNotFoundException extends RuntimeException`
- Tạo `GlobalExceptionHandler` với `@RestControllerAdvice`
- Xử lý `OrchidNotFoundException` → trả về 404 với message
- Xử lý `MethodArgumentNotValidException` → trả về 400 với danh sách lỗi field

**ADVANCED 4 — Bean Validation**
- Thêm `spring-boot-starter-validation` vào `pom.xml`
- Dùng `@Valid` trước `@RequestBody` trong POST và PUT
- Các vi phạm validation tự động kích hoạt `GlobalExceptionHandler`

**ADVANCED 5 — Response Wrapper**
- Tạo generic class `ApiResponse<T>` với 3 field: `success` (boolean), `message` (String), `data` (T)
- Tất cả endpoint trả về `ResponseEntity<ApiResponse<...>>` thay vì trả thẳng entity

---

## API Endpoint Table

| # | Tên | Method | URL | Body | Status thành công |
|---|-----|--------|-----|------|-------------------|
| 1 | Get All Orchids | GET | `/orchids/` | — | 200 OK |
| 2 | Create Orchid | POST | `/orchids/` | JSON Orchid | 201 Created |
| 3 | Get Orchid by ID | GET | `/orchids/{id}` | — | 200 OK |
| 4 | Update Orchid | PUT | `/orchids/{id}` | JSON Orchid | 200 OK |
| 5 | Delete Orchid | DELETE | `/orchids/{id}` | — | 204 No Content |
| 6 | Search Orchids | GET | `/orchids/search?name=&category=&isNatural=` | — | 200 OK |
| 7 | Paged Orchids | GET | `/orchids/paged?page=0&size=5&sortBy=orchidName` | — | 200 OK |
| 8 | Get Categories | GET | `/orchids/categories` | — | 200 OK |

---

## Checklist kiểm tra

**Cơ bản**
- [ ] Project khởi động không có lỗi
- [ ] Bảng `Orchid` được tạo tự động trong SQL Server (ddl-auto=update)
- [ ] `POST /orchids/` tạo mới → 201 Created
- [ ] `GET /orchids/` trả về list → 200 OK
- [ ] `GET /orchids/{id}` với ID hợp lệ → 200 OK
- [ ] `GET /orchids/{id}` với ID không tồn tại → 404 Not Found
- [ ] `PUT /orchids/{id}` cập nhật đúng dữ liệu → 200 OK
- [ ] `DELETE /orchids/{id}` xóa thành công → 204 No Content
- [ ] `DELETE /orchids/{id}` với ID không tồn tại → 404 Not Found

**Advanced**
- [ ] `POST /orchids/` với `orchidName` rỗng → 400 Bad Request
- [ ] `POST /orchids/` với `isNatural` null → 400 Bad Request
- [ ] `GET /orchids/search?name=dendro` trả về đúng kết quả
- [ ] `GET /orchids/paged?page=0&size=2` trả về đúng số lượng
- [ ] Response body có dạng `{ "success": true, "message": "...", "data": {...} }`
