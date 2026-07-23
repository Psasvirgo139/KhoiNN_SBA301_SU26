# Lab 03 – Building RESTful Web Services with Spring Boot

> **Môn:** SBA301 – Spring Boot Application Development  
> **Chủ đề:** RESTful Web Services + In-Memory Repository + Paging/Sorting + Swagger  
> **Tổng điểm: 100 điểm**

# Thông tin sinh viên
Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |

## 📋 Mục lục

1. [Giới thiệu & Yêu cầu bài lab](#1-giới-thiệu--yêu-cầu-bài-lab)
2. [Cấu trúc Project](#2-cấu-trúc-project)
3. [TODOs – Yêu cầu bắt buộc](#3-todos--yêu-cầu-bắt-buộc)
4. [ADVANCED – Yêu cầu nâng cao](#4-advanced--yêu-cầu-nâng-cao)
5. [Bảng tổng hợp điểm](#5-bảng-tổng-hợp-điểm)
6. [Checklist tự kiểm tra](#6-checklist-tự-kiểm-tra)

---

## 1. Giới thiệu & Yêu cầu bài lab

Xây dựng RESTful API quản lý nhân viên (**Employee Management**) sử dụng Spring Boot 3, lưu trữ dữ liệu bằng **in-memory Collection** (không dùng database), hỗ trợ đầy đủ CRUD, phân trang, sắp xếp và tài liệu API qua Swagger.

**Entity:**
```
Employee (empId: String, name: String, designation: String, salary: double)
```

**API Endpoints yêu cầu:**

| Method | URL | Mô tả |
|--------|-----|--------|
| GET | `/api/employees` | Lấy danh sách nhân viên (có paging & sorting) |
| GET | `/api/employees/{empId}` | Lấy nhân viên theo ID |
| POST | `/api/employees` | Tạo mới nhân viên |
| DELETE | `/api/employees/{id}` | Xóa nhân viên theo index |

---

## 2. Cấu trúc Project

Project phải tuân thủ kiến trúc **3 Layer (Repository → Service → Controller)**:

```
src/
└── main/
    └── java/
        └── com/example/employeemanagement/
            ├── pojos/
            │   └── Employee.java                  ← Entity
            ├── repositories/
            │   ├── IEmployeeRepository.java        ← Interface Repository
            │   └── EmployeeRepository.java         ← Implement (in-memory)
            ├── services/
            │   ├── IEmployeeService.java           ← Interface Service
            │   └── EmployeeService.java            ← Business Logic
            ├── controllers/
            │   └── EmployeeController.java         ← REST API
            └── EmployeeManagementApplication.java  ← Main entry point
```

> ⚠️ **Lưu ý:** Không được bỏ qua bất kỳ layer nào. Controller chỉ được gọi Service, Service chỉ được gọi Repository.

---

## 3. TODOs – Yêu cầu bắt buộc

---

### TODO 01 – Khởi tạo Spring Boot Project *(10 điểm)*

**Mục đích:** Tạo project đúng cấu hình và thêm đủ các dependency cần thiết.

**Yêu cầu:**
- Tạo project Spring Boot 3 bằng Spring Initializr (IntelliJ IDEA hoặc https://start.spring.io)
- Thêm dependency: `spring-boot-starter-web`
- Thêm dependency: `springdoc-openapi-starter-webmvc-ui` (version 2.6.0)
- Thêm dependency: `spring-data-jpa` (version 3.4.0)
- Thêm dependency: `spring-boot-starter-test` (scope test)
- Project build thành công, không có lỗi compile

---

### TODO 02 – Tạo Employee Entity *(10 điểm)*

**Mục đích:** Định nghĩa model dữ liệu Employee dùng xuyên suốt ứng dụng.

**Yêu cầu:**
- Tạo class `Employee` trong package `pojos`
- Có đủ 4 field: `empId` (String), `name` (String), `designation` (String), `salary` (double)
- Có đầy đủ: constructor không tham số, constructor đủ tham số, getter/setter cho tất cả field, method `toString()`

---

### TODO 03 – Implement Repository Layer *(20 điểm)*

**Mục đích:** Tạo tầng truy cập dữ liệu, lưu trữ nhân viên trong bộ nhớ (in-memory List), hỗ trợ phân trang và sắp xếp.

**Yêu cầu:**
- Tạo interface `IEmployeeRepository` trong package `repositories`, extend `PagingAndSortingRepository<Employee, String>`
- Interface khai báo các method: `getAllEmployees()`, `getEmployeeById(String empId)`, `create(Employee employee)`, `delete(int id)`
- Tạo class `EmployeeRepository` implement `IEmployeeRepository`, đánh dấu `@Repository`
- Dùng `ArrayList<Employee>` làm bộ nhớ lưu trữ
- Khởi tạo sẵn **ít nhất 5 nhân viên mẫu**
- Implement đầy đủ tất cả method của interface
- Override `findAll(Sort sort)` – sắp xếp danh sách theo field được chỉ định
- Override `findAll(Pageable pageable)` – cắt danh sách theo page/size, trả về `PageImpl<Employee>`

---

### TODO 04 – Implement Service Layer *(15 điểm)*

**Mục đích:** Tạo tầng nghiệp vụ, làm cầu nối giữa Controller và Repository.

**Yêu cầu:**
- Tạo interface `IEmployeeService` trong package `services`, khai báo đủ các method nghiệp vụ
- Tạo class `EmployeeService` implement `IEmployeeService`, đánh dấu `@Service`
- Inject `IEmployeeRepository` vào Service (dùng `@Autowired` hoặc constructor injection)
- Implement `getAllEmployees()`, `getEmployeeById()`, `createEmployee()`, `deleteEmployee()`
- Implement `getEmployeesWithPaging(int page, int size, String sortBy)` – tạo `Pageable` và gọi repository

---

### TODO 05 – Implement REST Controller *(20 điểm)*

**Mục đích:** Tạo tầng xử lý HTTP request, expose các API endpoint cho client.

**Yêu cầu:**
- Tạo class `EmployeeController` trong package `controllers`
- Đánh dấu `@RestController` và `@RequestMapping("/api/employees")`
- Inject `IEmployeeService` vào Controller
- Implement đủ 4 endpoint theo bảng ở mục 1:
  - `GET /api/employees` nhận query params: `page` (default 0), `size` (default 5), `sortBy` (default "empId")
  - `GET /api/employees/{empId}` trả về `ResponseEntity<Employee>`
  - `POST /api/employees` nhận `@RequestBody Employee`, trả về `ResponseEntity` với status `201 Created`
  - `DELETE /api/employees/{id}` trả về `ResponseEntity<Employee>` với status `200 OK`

---

### TODO 06 – Cấu hình Main Application *(5 điểm)*

**Mục đích:** Đảm bảo Spring Boot khởi động và scan đúng toàn bộ các component.

**Yêu cầu:**
- Class main có annotation `@SpringBootApplication`
- Class main đặt đúng ở package gốc (bao trùm các package `pojos`, `repositories`, `services`, `controllers`)
- Ứng dụng khởi động thành công trên port 8080

---

### TODO 07 – Test API qua Swagger UI *(10 điểm)*

**Mục đích:** Kiểm tra toàn bộ API hoạt động đúng thông qua giao diện Swagger.

**Yêu cầu:**
- Swagger UI hiển thị tại `http://localhost:8080/swagger-ui/index.html`
- Test GET paging: gọi với `page=0`, `size=3`, `sortBy=name` → trả về đúng số phần tử
- Test POST: tạo mới nhân viên với JSON body hợp lệ → nhân viên xuất hiện trong danh sách
- Test GET by ID: lấy đúng nhân viên vừa tạo
- Test DELETE: xóa nhân viên và xác nhận không còn trong danh sách
- Swagger Schema hiển thị đúng cấu trúc `Employee`

---

## 4. ADVANCED – Yêu cầu nâng cao

> Làm thêm để nhận điểm thưởng. Tổng điểm không vượt quá 100.

---

### ADVANCED 01 – PUT Endpoint – Cập nhật nhân viên *(+5 điểm)*

**Mục đích:** Hoàn thiện CRUD bằng cách bổ sung chức năng cập nhật thông tin nhân viên.

**Yêu cầu:**
- Thêm endpoint `PUT /api/employees/{empId}`
- Nhận `empId` từ path và thông tin cập nhật từ request body
- Trả về `200 OK` với employee đã cập nhật, hoặc `404 Not Found` nếu không tìm thấy

---

### ADVANCED 02 – Global Exception Handling *(+5 điểm)*

**Mục đích:** Xử lý lỗi tập trung, trả về response lỗi thống nhất thay vì lỗi mặc định của Spring.

**Yêu cầu:**
- Tạo class `GlobalExceptionHandler` với annotation `@RestControllerAdvice`
- Tạo custom exception `EmployeeNotFoundException`
- Xử lý `EmployeeNotFoundException` → trả về `404 Not Found` với message rõ ràng
- Xử lý `IllegalArgumentException` → trả về `400 Bad Request`
- Response lỗi bao gồm: status code, message, timestamp

---

### ADVANCED 03 – Input Validation *(+5 điểm)*

**Mục đích:** Ngăn chặn dữ liệu không hợp lệ được lưu vào hệ thống.

**Yêu cầu:**
- Thêm dependency `spring-boot-starter-validation`
- Thêm annotation validation trên các field của `Employee`: `empId` và `name` không được để trống, `salary` không được âm
- Controller POST và PUT sử dụng `@Valid` để kích hoạt validation
- Vi phạm validation trả về `400 Bad Request` với thông báo lỗi cụ thể

---

### ADVANCED 04 – OpenAPI Documentation nâng cao *(+3 điểm)*

**Mục đích:** Tạo tài liệu API chuyên nghiệp, mô tả rõ từng endpoint cho client sử dụng.

**Yêu cầu:**
- Thêm `@Tag` trên Controller để đặt tên nhóm API
- Thêm `@Operation` trên mỗi method với `summary` và `description`
- Thêm `@ApiResponse` mô tả các HTTP status code có thể trả về

---

### ADVANCED 05 – Endpoint tìm kiếm *(+5 điểm)*

**Mục đích:** Bổ sung chức năng tìm kiếm nhân viên theo từ khóa.

**Yêu cầu:**
- Thêm endpoint `GET /api/employees/search?keyword={keyword}`
- Tìm kiếm không phân biệt hoa thường theo `name` hoặc `designation`
- Trả về danh sách nhân viên phù hợp, danh sách rỗng nếu không có kết quả

---

### ADVANCED 06 – API Response Wrapper *(+2 điểm)*

**Mục đích:** Chuẩn hóa format response của toàn bộ API, dễ xử lý phía client.

**Yêu cầu:**
- Tạo class generic `ApiResponse<T>` bao gồm: `success` (boolean), `message` (String), `data` (T), `timestamp`
- Tất cả endpoint trả về `ApiResponse<T>` thay vì trả trực tiếp object

---

## 5. Bảng tổng hợp điểm

| Hạng mục | Nội dung | Điểm |
|----------|----------|------|
| TODO 01 | Khởi tạo Project & cấu hình pom.xml | 10 |
| TODO 02 | Employee Entity (POJO) | 10 |
| TODO 03 | Repository Layer (in-memory + paging/sorting) | 20 |
| TODO 04 | Service Layer | 15 |
| TODO 05 | REST Controller (4 endpoints) | 20 |
| TODO 06 | Main Application | 5 |
| TODO 07 | Test qua Swagger UI | 10 |
| **Tổng bắt buộc** | | **90** |
| ADVANCED 01 | PUT endpoint – Cập nhật nhân viên | +5 |
| ADVANCED 02 | Global Exception Handling | +5 |
| ADVANCED 03 | Input Validation | +5 |
| ADVANCED 04 | OpenAPI Documentation nâng cao | +3 |
| ADVANCED 05 | Search endpoint | +5 |
| ADVANCED 06 | Response Wrapper | +2 |
| **Tổng nâng cao** | | **+25** |
| **Tổng tối đa** | | **100** |

> ⚠️ Tổng điểm cuối cùng **không vượt quá 100 điểm**.

---

## 6. Checklist tự kiểm tra

Tự đánh dấu trước khi nộp bài.

---

### ✅ TODO 01 – Khởi tạo Project (10đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 1.1 | Project tạo thành công, không lỗi compile | ☐ | ☐ |
| 1.2 | `spring-boot-starter-web` có trong `pom.xml` | ☐ | ☐ |
| 1.3 | `springdoc-openapi-starter-webmvc-ui` version 2.6.0 | ☐ | ☐ |
| 1.4 | `spring-data-jpa` version 3.4.0 | ☐ | ☐ |
| 1.5 | `spring-boot-starter-test` scope test | ☐ | ☐ |
| 1.6 | Cấu trúc package đúng (pojos, repositories, services, controllers) | ☐ | ☐ |

---

### ✅ TODO 02 – Employee Entity (10đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 2.1 | Class `Employee` trong package `pojos` | ☐ | ☐ |
| 2.2 | Đủ 4 field: `empId`, `name`, `designation`, `salary` | ☐ | ☐ |
| 2.3 | Constructor không tham số và constructor đủ tham số | ☐ | ☐ |
| 2.4 | Getter/setter cho tất cả field | ☐ | ☐ |
| 2.5 | Method `toString()` | ☐ | ☐ |

---

### ✅ TODO 03 – Repository Layer (20đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 3.1 | `IEmployeeRepository` extend `PagingAndSortingRepository<Employee, String>` | ☐ | ☐ |
| 3.2 | Interface khai báo đủ 4 method: `getAllEmployees`, `getEmployeeById`, `create`, `delete` | ☐ | ☐ |
| 3.3 | `EmployeeRepository` có annotation `@Repository` | ☐ | ☐ |
| 3.4 | Dùng `ArrayList<Employee>` làm in-memory storage | ☐ | ☐ |
| 3.5 | Khởi tạo sẵn ít nhất 5 nhân viên mẫu | ☐ | ☐ |
| 3.6 | `getAllEmployees()` trả về toàn bộ danh sách | ☐ | ☐ |
| 3.7 | `getEmployeeById()` tìm đúng theo `empId`, trả null nếu không có | ☐ | ☐ |
| 3.8 | `create()` thêm vào list và trả về employee vừa tạo | ☐ | ☐ |
| 3.9 | `delete()` xóa đúng theo index và trả về employee đã xóa | ☐ | ☐ |
| 3.10 | `findAll(Sort sort)` sắp xếp đúng theo field | ☐ | ☐ |
| 3.11 | `findAll(Pageable pageable)` trả về `PageImpl` đúng dữ liệu | ☐ | ☐ |

---

### ✅ TODO 04 – Service Layer (15đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 4.1 | `IEmployeeService` khai báo đủ các method | ☐ | ☐ |
| 4.2 | `EmployeeService` có annotation `@Service` | ☐ | ☐ |
| 4.3 | `IEmployeeRepository` được inject vào Service | ☐ | ☐ |
| 4.4 | `getAllEmployees()`, `getEmployeeById()`, `createEmployee()`, `deleteEmployee()` được implement | ☐ | ☐ |
| 4.5 | `getEmployeesWithPaging()` tạo đúng `Pageable` và gọi repository | ☐ | ☐ |

---

### ✅ TODO 05 – REST Controller (20đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 5.1 | `EmployeeController` có `@RestController` và `@RequestMapping("/api/employees")` | ☐ | ☐ |
| 5.2 | `IEmployeeService` được inject vào Controller | ☐ | ☐ |
| 5.3 | `GET /api/employees` nhận đủ 3 params: `page`, `size`, `sortBy` | ☐ | ☐ |
| 5.4 | `GET /api/employees/{empId}` trả về đúng employee | ☐ | ☐ |
| 5.5 | `POST /api/employees` trả về `201 Created` | ☐ | ☐ |
| 5.6 | `DELETE /api/employees/{id}` trả về `200 OK` kèm employee đã xóa | ☐ | ☐ |

---

### ✅ TODO 06 – Main Application (5đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 6.1 | Class main có `@SpringBootApplication` | ☐ | ☐ |
| 6.2 | Class main đặt đúng package gốc | ☐ | ☐ |
| 6.3 | Ứng dụng khởi động thành công, port 8080 sẵn sàng | ☐ | ☐ |

---

### ✅ TODO 07 – Test qua Swagger UI (10đ)

| # | Tiêu chí | Đạt | Chưa đạt |
|---|----------|-----|----------|
| 7.1 | Swagger UI hiển thị tại `http://localhost:8080/swagger-ui/index.html` | ☐ | ☐ |
| 7.2 | GET paging trả về đúng số phần tử theo `size` | ☐ | ☐ |
| 7.3 | POST tạo nhân viên mới thành công | ☐ | ☐ |
| 7.4 | GET by ID trả về đúng nhân viên vừa tạo | ☐ | ☐ |
| 7.5 | DELETE xóa thành công, nhân viên không còn trong danh sách | ☐ | ☐ |
| 7.6 | Swagger Schema hiển thị đúng cấu trúc `Employee` | ☐ | ☐ |

---

### ✅ ADVANCED – Nâng cao (điểm thưởng)

| # | Tiêu chí | Điểm | Đạt | Chưa đạt |
|---|----------|------|-----|----------|
| A1.1 | `PUT /api/employees/{empId}` cập nhật thành công, trả `200 OK` | +5 | ☐ | ☐ |
| A1.2 | Trả `404 Not Found` khi empId không tồn tại | | ☐ | ☐ |
| A2.1 | `GlobalExceptionHandler` với `@RestControllerAdvice` | +5 | ☐ | ☐ |
| A2.2 | `EmployeeNotFoundException` trả về `404` với message rõ ràng | | ☐ | ☐ |
| A2.3 | Response lỗi có: status, message, timestamp | | ☐ | ☐ |
| A3.1 | `empId` và `name` không được để trống (validation) | +5 | ☐ | ☐ |
| A3.2 | `salary` không được âm | | ☐ | ☐ |
| A3.3 | Vi phạm validation trả về `400 Bad Request` | | ☐ | ☐ |
| A4.1 | `@Tag` trên Controller | +3 | ☐ | ☐ |
| A4.2 | `@Operation` + `@ApiResponse` trên từng endpoint | | ☐ | ☐ |
| A5.1 | `GET /api/employees/search?keyword=...` hoạt động đúng | +5 | ☐ | ☐ |
| A5.2 | Tìm kiếm không phân biệt hoa thường theo name và designation | | ☐ | ☐ |
| A6.1 | `ApiResponse<T>` có đủ field: success, message, data, timestamp | +2 | ☐ | ☐ |
| A6.2 | Tất cả endpoint trả về `ApiResponse<T>` | | ☐ | ☐ |

---

## 📌 Lưu ý khi nộp bài

- Push code lên github classroom. (không bao gồm thư mục `target/`)
- Commit đúng quy tắc - không commit 1 lần
- Đảm bảo project **build thành công** trước khi nộp (`mvn clean install`)

---

*Lab 03 – SBA301 | Spring Boot RESTful Web Services - created by traltb@fe.edu.vn*
