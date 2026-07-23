# Hướng Dẫn Kiểm Thử API Với Postman — Assignment 03 (TODO-08)

Tài liệu này hướng dẫn từng bước kiểm thử toàn bộ RESTful API **có bảo mật JWT** của FUMiniHotelSystem bằng Postman. Điểm khác biệt lớn nhất so với Assignment 02: **hầu hết endpoint yêu cầu header `Authorization: Bearer <token>`**, và phải test cả trường hợp **sai/thiếu token (401)** và **sai role (403)**.

---

## Bước 1 — Chuẩn bị

1. Cài Postman (bản desktop): https://www.postman.com/downloads/.
2. **Chạy Backend trước:** mở IntelliJ → Run `A3Application` → chờ log `Tomcat started on port 8080`.
3. **Kiểm tra tài khoản Staff** trong `application.properties` (ví dụ `admin@fumini.com` / `@1`).
4. **Kiểm tra database sạch:** nếu đã test trước đó, chạy lại script SQL để dữ liệu mẫu về trạng thái ban đầu.
5. Kiểm tra nhanh bằng trình duyệt: mở http://localhost:8080/api/rooms → thấy JSON danh sách phòng **mà không cần đăng nhập** là BE + rule public đã đúng.

---

## Bước 2 — Tạo collection & biến môi trường

Tạo collection **A3 FUMiniHotel - SBA301**. Vào tab **Variables** của collection, khai báo:

| Variable | Initial value |
|---|---|
| `baseUrl` | `http://localhost:8080/api` |
| `customerToken` | *(để trống — sẽ tự lưu sau khi login customer)* |
| `staffToken` | *(để trống — sẽ tự lưu sau khi login staff)* |
| `bookingId` | *(để trống — lưu sau khi tạo booking)* |
| `roomIdUnused` | *(id một phòng chưa có booking — để test xóa cứng)* |
| `roomIdUsed` | *(id một phòng đã có booking — để test đổi status)* |

> Mọi request dùng dạng `{{baseUrl}}/rooms`; endpoint bảo mật thêm header `Authorization: Bearer {{customerToken}}` hoặc `{{staffToken}}`.

---

## Bước 3 — Lấy token (cách gắn JWT vào request)

### 3.1. Login Customer để lấy token

Trước tiên **đăng ký** một customer (request `POST {{baseUrl}}/auth/register`, body ví dụ bên dưới), sau đó **login**:

`POST {{baseUrl}}/auth/login` — Body raw JSON:

```json
{ "email": "khach1@gmail.com", "password": "123456" }
```

Ở tab **Scripts → Post-response**, thêm để tự lưu token:

```javascript
pm.test('Login 200', () => pm.response.to.have.status(200));
const body = pm.response.json();
pm.expect(body).to.have.property('token');
pm.collectionVariables.set('customerToken', body.token);
pm.expect(body.role).to.eql('CUSTOMER');
```

### 3.2. Login Staff để lấy token

`POST {{baseUrl}}/auth/login` với tài khoản staff trong properties:

```json
{ "email": "admin@fumini.com", "password": "@1" }
```

Script:

```javascript
const body = pm.response.json();
pm.collectionVariables.set('staffToken', body.token);
pm.expect(body.role).to.eql('STAFF');
```

### 3.3. Gắn token vào request bảo mật

Mỗi request cần quyền: tab **Authorization** → Type **Bearer Token** → Token = `{{staffToken}}` hoặc `{{customerToken}}`. (Hoặc thêm header thủ công `Authorization: Bearer {{staffToken}}`.)

---

## Bước 4 — Kịch bản kiểm thử bắt buộc (chạy đúng thứ tự)

Chia làm 5 nhóm. **Nhóm sau phụ thuộc dữ liệu nhóm trước** (ví dụ phải register + login mới có token, phải tạo booking mới có `bookingId`).

### Nhóm 1 — Auth & phân quyền cơ bản

| # | Request | Token | Expected | Kiểm tra gì |
|---|---|---|---|---|
| 1 | POST `/auth/register` (khách mới) | — | 201 | tạo customer, **không trả password** |
| 2 | POST `/auth/register` (trùng email #1) | — | 409 | chặn email trùng |
| 3 | POST `/auth/register` (email sai định dạng) | — | 400 | Bean Validation |
| 4 | POST `/auth/login` (customer đúng) | — | 200 | trả `token` + `role = CUSTOMER`, lưu `customerToken` |
| 5 | POST `/auth/login` (sai password) | — | 401 | message lỗi |
| 6 | POST `/auth/login` (staff đúng) | — | 200 | trả `token` + `role = STAFF`, lưu `staffToken` |

### Nhóm 2 — Room (public GET + staff CRUD + quy tắc xóa)

| # | Request | Token | Expected | Kiểm tra gì |
|---|---|---|---|---|
| 7 | GET `/rooms` | **không** | 200 | **xem phòng không cần đăng nhập** |
| 8 | GET `/rooms/{id}` | không | 200 | chi tiết phòng |
| 9 | GET `/rooms/search?q=101` | không | 200 | tìm theo số/loại phòng |
| 10 | GET `/room-types` | không | 200 | danh sách loại phòng (public) |
| 11 | POST `/rooms` | **customer** | **403** | customer không được tạo phòng |
| 12 | POST `/rooms` | **không** | **401** | thiếu token |
| 13 | POST `/rooms` | **staff** | 201 | tạo phòng mới → lưu id vào `roomIdUnused` |
| 14 | POST `/rooms` (thiếu field) | staff | 400 | validation từng field |
| 15 | PUT `/rooms/{{roomIdUnused}}` | staff | 200 | cập nhật phòng |
| 16 | DELETE `/rooms/{{roomIdUnused}}` | staff | 204 | phòng **chưa dùng** → xóa cứng |
| 17 | DELETE `/rooms/{{roomIdUsed}}` | staff | 204 | phòng **đã có booking** → không xóa, đổi `roomStatus = 2` |
| 18 | GET `/rooms/{{roomIdUsed}}` | không | 200 | xác nhận phòng vẫn tồn tại, `roomStatus = 2` |
| 19 | GET `/rooms/99999` | không | 404 | not found |

> Request 16 và 17 là **cặp quan trọng nhất** của Assignment 3: cùng gọi DELETE nhưng kết quả khác nhau tùy phòng đã dùng trong booking hay chưa. Sau request 17, kiểm tra bằng request 18 rằng phòng **vẫn còn** và status = 2.

### Nhóm 3 — Customer management (chỉ Staff)

| # | Request | Token | Expected | Kiểm tra gì |
|---|---|---|---|---|
| 20 | GET `/customers` | **customer** | **403** | customer không được xem danh sách khách |
| 21 | GET `/customers` | staff | 200 | mảng customer |
| 22 | GET `/customers/search?q=khach` | staff | 200 | tìm theo tên/email |
| 23 | POST `/customers` | staff | 201 | tạo customer |
| 24 | POST `/customers` (email trùng) | staff | 409 | chặn trùng email |
| 25 | PUT `/customers/{id}` | staff | 200 | cập nhật |
| 26 | DELETE `/customers/{id}` (chưa booking) | staff | 204 | xóa được |
| 27 | GET `/customers/9999` | staff | 404 | not found |

### Nhóm 4 — Profile (chỉ Customer, của chính mình)

| # | Request | Token | Expected | Kiểm tra gì |
|---|---|---|---|---|
| 28 | GET `/customers/profile` | **customer** | 200 | trả đúng profile của người đang đăng nhập, **không có password** |
| 29 | GET `/customers/profile` | **staff** | **403** | staff không dùng endpoint customer |
| 30 | PUT `/customers/profile` | customer | 200 | sửa được tên/telephone của chính mình |
| 31 | PUT `/customers/profile` (email sai định dạng) | customer | 400 | validation |

### Nhóm 5 — Booking (Customer tạo, Staff quản lý)

| # | Request | Token | Expected | Kiểm tra gì |
|---|---|---|---|---|
| 32 | POST `/bookings` (2 phòng) | **customer** | 201 | tạo booking nhiều phòng; `totalPrice` = tổng đúng; lưu `bookingId` |
| 33 | POST `/bookings` (details rỗng) | customer | 400 | `@NotEmpty` details |
| 34 | POST `/bookings` (endDate < startDate) | customer | 400 | validate ngày |
| 35 | POST `/bookings` | **staff** | **403** | staff không tạo booking online |
| 36 | GET `/bookings/my` | customer | 200 | chỉ booking của chính customer |
| 37 | GET `/bookings` | **customer** | **403** | customer không xem toàn bộ |
| 38 | GET `/bookings` | staff | 200 | tất cả booking |
| 39 | GET `/bookings/{{bookingId}}` | staff | 200 | chi tiết + details (phòng, ngày, giá) |
| 40 | PUT `/bookings/{{bookingId}}` | staff | 200 | cập nhật trạng thái booking |
| 41 | DELETE `/bookings/{{bookingId}}` | staff | 204 | hủy/xóa booking |

**Body mẫu request 32** (`POST /bookings`):

```json
{
  "details": [
    { "roomId": 1, "startDate": "2026-08-01", "endDate": "2026-08-03" },
    { "roomId": 2, "startDate": "2026-08-01", "endDate": "2026-08-02" }
  ]
}
```

---

## Bước 5 — Test script mẫu (dán vào tab Scripts → Post-response)

```javascript
// Status code
pm.test('Status 201', () => pm.response.to.have.status(201));

// Không lộ password ở bất kỳ response nào
pm.test('Khong lo password', () => {
    const b = pm.response.json();
    pm.expect(JSON.stringify(b)).to.not.include('password');
});

// Public rooms: gọi không token vẫn 200
pm.test('Xem phong khong can token', () => pm.response.to.have.status(200));

// Sai role → 403
pm.test('Sai role bi tu choi', () => pm.response.to.have.status(403));

// Thiếu token → 401
pm.test('Thieu token bi chan', () => pm.response.to.have.status(401));

// Booking: tong tien = tong cac dong detail
pm.test('TotalPrice = tong ActualPrice', () => {
    const b = pm.response.json();
    const sum = b.details.reduce((s, d) => s + Number(d.actualPrice), 0);
    pm.expect(Number(b.totalPrice)).to.eql(sum);
});

// Room da dung: xoa mem -> status = 2
pm.test('Room da dung chuyen status 2', () => {
    pm.expect(pm.response.json().roomStatus).to.eql(2);
});
```

---

## Bước 6 — Chạy cả collection bằng Collection Runner

1. Chuột phải collection → **Run collection**.
2. Giữ nguyên thứ tự request, **Iterations = 1**, Delay = 0.
3. Vì các request sau phụ thuộc token/id lưu ở request trước, **phải chạy tuần tự** (không đảo thứ tự).

**Đạt chuẩn khi:** Run collection → **0 failed**.

---

## Bước 7 — Checklist Postman trước khi qua Frontend

- [ ] Register + login customer lấy được token; login staff lấy được token
- [ ] `GET /rooms`, `/rooms/{id}`, `/rooms/search`, `/room-types` chạy **không cần token**
- [ ] Endpoint bảo mật: **thiếu token → 401**, **sai role → 403**
- [ ] Staff CRUD Room; **xóa phòng chưa dùng = 204 (mất)**, **xóa phòng đã dùng = 204 nhưng status → 2 (còn)**
- [ ] Staff quản lý Customer; trùng email → 409
- [ ] Customer chỉ xem/sửa profile của chính mình; staff bị 403 ở endpoint customer
- [ ] Customer tạo booking **nhiều phòng**, `totalPrice` đúng; details rỗng/ngày sai → 400
- [ ] `GET /bookings/my` chỉ trả booking của chính customer; `GET /bookings` chỉ staff
- [ ] Không response nào chứa password
- [ ] Run collection: 0 failed

---

## Phụ lục — Bảng mã lỗi hay gặp

| Mã | Ý nghĩa trong bài này | Nguyên nhân thường gặp |
|---|---|---|
| 200 | OK | GET/PUT thành công |
| 201 | Created | POST tạo mới thành công |
| 204 | No Content | DELETE thành công (kể cả trường hợp room đổi status) |
| 400 | Bad Request | Validation fail, ngày sai, details rỗng |
| 401 | Unauthorized | Thiếu/token hết hạn/sai; login sai mật khẩu |
| 403 | Forbidden | Có token nhưng **sai role** (customer gọi API staff và ngược lại) |
| 404 | Not Found | Id không tồn tại |
| 409 | Conflict | Trùng email khi register/tạo customer |
