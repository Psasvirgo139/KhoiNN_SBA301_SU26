# Lab 06 – Hướng dẫn cấu hình Port 8005 & Test Postman


---

## Phần 1 – Cấu hình chạy ở cổng 8005

### Bước 1: Mở file `application.properties`

Đường dẫn trong project:
```
src/main/resources/application.properties
```

### Bước 2: Điền nội dung sau

```properties
# ===== Server =====
server.port=8005

# ===== SQL Server =====
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDBJWT;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YOUR_PASSWORD_HERE
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# ===== JPA =====
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# ===== JWT =====
application.security.jwt.secret-key=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
application.security.jwt.expiration=86400000
```

> **Lưu ý:**
> - Thay `YOUR_PASSWORD_HERE` bằng mật khẩu SQL Server của bạn (thường là `123456` hoặc `sa`)
> - `databaseName=OrchidDBJWT` — tạo database này trong SQL Server trước khi chạy:
>   ```sql
>   CREATE DATABASE OrchidDBJWT;
>   ```
> - Secret key là chuỗi hex 64 ký tự (256-bit) — **không được đặt chuỗi ngắn**, sẽ bị lỗi `WeakKeyException`

### Bước 3: Chạy project

Trong IntelliJ IDEA: nhấn **Run** (▶) hoặc `Shift + F10`

Kiểm tra console xuất hiện dòng:
```
Tomcat started on port 8005
Started OrchidManagementApplication in X.XXX seconds
```

---

## Phần 2 – Test bằng Postman (từng bước chi tiết)

### Tổng quan các endpoint

| Method | URL | Quyền | Mô tả |
|--------|-----|-------|-------|
| POST | `/auth/signup` | Public | Đăng ký tài khoản mới |
| POST | `/auth/login` | Public | Đăng nhập, nhận JWT |
| GET | `/users/me` | Cần JWT | Xem thông tin bản thân |
| GET | `/users` | Cần JWT + ADMIN | Xem tất cả users |

---

### Test 1 – Đăng ký tài khoản (Signup)

**Mục đích:** Tạo tài khoản USER mới, nhận JWT token.

**Cấu hình Postman:**

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `http://localhost:8005/auth/signup` |
| Body → raw → JSON | (xem bên dưới) |

**Body:**
```json
{
    "fullName": "Nguyen Van A",
    "email": "vana@orchid.com",
    "password": "Password123!"
}
```

**Kết quả mong đợi – Status `200 OK`:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2YW5hQG9yY2hpZC5jb20i..."
}
```

> **Copy toàn bộ chuỗi `accessToken`** — dùng cho các test tiếp theo.

---

### Test 2 – Đăng nhập (Login)

**Mục đích:** Lấy JWT token bằng email/password đã đăng ký.

**Cấu hình Postman:**

| Trường | Giá trị |
|--------|---------|
| Method | `POST` |
| URL | `http://localhost:8005/auth/login` |
| Body → raw → JSON | (xem bên dưới) |

**Body:**
```json
{
    "email": "vana@orchid.com",
    "password": "Password123!"
}
```

**Kết quả mong đợi – Status `200 OK`:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Test lỗi – Sai password:**

Body:
```json
{
    "email": "vana@orchid.com",
    "password": "SaiPassword"
}
```

Kết quả mong đợi – Status `401 Unauthorized`:
```json
{
    "success": false,
    "message": "Email hoặc mật khẩu không đúng"
}
```

---

### Test 3 – Xem thông tin bản thân (GET /users/me)

**Mục đích:** Kiểm tra JWT filter hoạt động đúng — chỉ user đã đăng nhập mới xem được.

**Cấu hình Postman:**

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `http://localhost:8005/users/me` |
| Headers | `Authorization: Bearer <token>` |

**Cách thêm Authorization trong Postman:**
1. Tab **Headers** → thêm:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJIUzI1NiJ9...` (paste token vào sau chữ "Bearer ")

   **Hoặc** dùng tab **Auth**:
   - Type: `Bearer Token`
   - Token: paste chuỗi token (không cần gõ "Bearer")

**Kết quả mong đợi – Status `200 OK`:**
```json
{
    "id": 1,
    "fullName": "Nguyen Van A",
    "email": "vana@orchid.com",
    "password": "$2a$10$...",
    "role": "USER",
    "authorities": [{"authority": "ROLE_USER"}],
    "username": "vana@orchid.com",
    "accountNonExpired": true,
    "accountNonLocked": true,
    "credentialsNonExpired": true,
    "enabled": true
}
```

**Test lỗi – Không gửi token:**

Xóa header Authorization, gọi lại.

Kết quả mong đợi – Status `401 Unauthorized` (Spring Security tự trả về, không có body).

---

### Test 4 – Xem tất cả users (GET /users) – Cần ADMIN

**Mục đích:** Kiểm tra phân quyền `@PreAuthorize("hasRole('ADMIN')")`.

#### Test 4a – Dùng token của USER thường

**Cấu hình Postman:**

| Trường | Giá trị |
|--------|---------|
| Method | `GET` |
| URL | `http://localhost:8005/users` |
| Auth → Bearer Token | token của `vana@orchid.com` (role USER) |

**Kết quả mong đợi – Status `403 Forbidden`:**
```json
{
    "success": false,
    "message": "Bạn không có quyền thực hiện thao tác này"
}
```

#### Test 4b – Nâng cấp user thành ADMIN rồi thử lại

**Bước 1:** Mở SQL Server Management Studio, chạy:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'vana@orchid.com';
```

**Bước 2:** Login lại để lấy token mới (token cũ chứa quyền USER, phải lấy token mới):
```
POST http://localhost:8005/auth/login
{
    "email": "vana@orchid.com",
    "password": "Password123!"
}
```

**Bước 3:** Gọi `GET /users` với token mới.

**Kết quả mong đợi – Status `200 OK`:**
```json
[
    {
        "id": 1,
        "fullName": "Nguyen Van A",
        "email": "vana@orchid.com",
        "role": "ADMIN",
        ...
    }
]
```

---

## Phần 3 – Decode JWT để kiểm tra nội dung token

1. Truy cập [https://jwt.io](https://jwt.io)
2. Paste token vào ô **Encoded** (bên trái)
3. Phần **Payload** bên phải sẽ hiển thị:

```json
{
  "sub": "vana@orchid.com",
  "iat": 1718000000,
  "exp": 1718086400
}
```

- `sub`: email (định danh user)
- `iat`: thời điểm tạo token (Unix timestamp)
- `exp`: thời điểm hết hạn (iat + 86400000ms = iat + 24h)

---

## Phần 4 – Lỗi thường gặp khi test

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| `Connection refused` port 8005 | Project chưa chạy hoặc chạy sai port | Kiểm tra IntelliJ console; kiểm tra `server.port=8005` trong properties |
| `401` khi gọi `/auth/signup` | SecurityConfig chặn nhầm | Kiểm tra `.requestMatchers("/auth/**").permitAll()` trong `SecurityConfig` |
| `401` khi gọi `/users/me` với token | Thiếu dấu cách sau "Bearer" | Value phải là `Bearer <space><token>`, ví dụ: `Bearer eyJ...` |
| `403` khi gọi `/users` | User không có role ADMIN | Cập nhật role trong DB, login lấy token mới |
| `WeakKeyException` khi start app | Secret key quá ngắn | Dùng chuỗi hex 64 ký tự như trong properties mẫu trên |
| `Cannot connect to SQL Server` | Sai URL, password, hoặc DB chưa tạo | Kiểm tra SQL Server đang chạy; chạy `CREATE DATABASE OrchidDBJWT` |
| `500` khi signup email đã tồn tại | Email trùng | Dùng email khác hoặc xóa record trong bảng `users` |

---

## Tóm tắt thứ tự test

```
1. POST /auth/signup     → 200 + token
2. POST /auth/login      → 200 + token  (copy token này)
3. GET  /users/me        → 200 + info   (cần token)
4. GET  /users           → 403          (token USER không đủ quyền)
5. [UPDATE role=ADMIN trong DB]
6. POST /auth/login      → lấy token mới
7. GET  /users           → 200 + danh sách users
```
