# Hướng Dẫn Assignment 02 — CRUD Application với RESTful Web Service và ReactJS

**Đề bài:** Xây dựng FUNewsManagementSystem gồm RESTful API (Spring Boot 3 + MS SQL Server + Spring Data JPA, kiến trúc 3-layer) và React Client (axios) hỗ trợ CRUD + Search.

**Quy ước tên (thay bằng tên bạn):**

| Thành phần | Tên |
|---|---|
| Database | `A2StudentName_ClassCode` |
| Spring Boot project | `A2StudentName_ClassCode` |
| ReactJS project | `A2StudentName_ClassCode` |

**Phân quyền:** `AccountRole = 1` → Admin (quản lý Account); `AccountRole = 2` → Staff (quản lý Category, News Article + tags, Profile, News History). Xem tin active **không cần đăng nhập**.

**Ràng buộc nghiệp vụ quan trọng (điểm hay mất):**

1. Xóa Account: chỉ xóa được nếu account **chưa tạo** news article nào → nếu đã tạo, trả `409 Conflict`.
2. Xóa Category: chỉ xóa được nếu category **chưa được dùng** trong news article nào → nếu đã dùng, trả `409 Conflict`.
3. Create/Update trên FE **bắt buộc dùng popup dialog** (Modal); Delete **luôn kèm confirmation**.
4. Validate kiểu dữ liệu cho **tất cả field** (Bean Validation ở BE + form validation ở FE).

---

## 0. Chuẩn bị môi trường

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| JDK | 17+ | Spring Boot 3 yêu cầu tối thiểu 17 |
| IntelliJ IDEA | bản mới | hoặc tạo project tại https://start.spring.io |
| SQL Server | 2019+ | bật TCP/IP port 1433, SQL Authentication |
| Node.js | 18+ | cho Vite + React 18 |
| Postman | bản mới | kiểm thử API |
| Git | bản mới | commit theo từng TODO |

**Tạo database:** chạy script `Assignment 02_FUNewsManagementSBA301.sql` trong SSMS, **đổi tên database** thành `A2StudentName_ClassCode` (sửa dòng `CREATE DATABASE` và `USE`). Script tạo 5 bảng: `SystemAccount`, `Category`, `NewsArticle`, `NewsTag`, `Tag` kèm dữ liệu mẫu.

**Tài khoản mẫu để test:**

| Email | Password | Role |
|---|---|---|
| SteveParis@FUNewsManagement.org | @1 | Admin (1) |
| EmmaWilliam@FUNewsManagement.org | @1 | Staff (2) |
| OliviaJames@FUNewsManagement.org | @1 | Staff (2) |

---

## 1. Cấu trúc project

### 1.1. Backend — Spring Boot 3 (3-Layer + Repository)

```
A2StudentName_ClassCode/            (backend)
├── pom.xml                         # Spring Web, Data JPA, Validation, MSSQL Driver, Lombok
└── src/main/
    ├── resources/
    │   └── application.properties  # cấu hình datasource SQL Server
    └── java/com/fu/a2/
        ├── A2Application.java
        ├── config/
        │   └── CorsConfig.java             # cho phép React (5173) gọi API
        ├── entity/                         # === Data Layer ===
        │   ├── SystemAccount.java
        │   ├── Category.java
        │   ├── NewsArticle.java            # @ManyToMany với Tag qua bảng NewsTag
        │   └── Tag.java
        ├── repository/                     # === Data Layer ===
        │   ├── SystemAccountRepository.java
        │   ├── CategoryRepository.java
        │   ├── NewsArticleRepository.java
        │   └── TagRepository.java
        ├── dto/                            # request/response + validation
        │   ├── LoginRequest.java
        │   ├── AccountRequest.java  / AccountResponse.java
        │   ├── CategoryRequest.java / CategoryResponse.java
        │   └── NewsArticleRequest.java / NewsArticleResponse.java
        ├── service/                        # === Business Layer ===
        │   ├── AuthService.java
        │   ├── AccountService.java         # ràng buộc xóa account
        │   ├── CategoryService.java        # ràng buộc xóa category
        │   ├── NewsArticleService.java     # CRUD + tags + history
        │   └── TagService.java
        ├── controller/                     # === Presentation Layer ===
        │   ├── AuthController.java         # POST /api/auth/login
        │   ├── AccountController.java      # /api/accounts
        │   ├── CategoryController.java     # /api/categories
        │   ├── NewsArticleController.java  # /api/news
        │   └── TagController.java          # /api/tags
        └── exception/
            ├── ResourceNotFoundException.java   # 404
            ├── ConflictException.java           # 409
            ├── UnauthorizedException.java       # 401
            └── GlobalExceptionHandler.java      # @RestControllerAdvice
```

### 1.2. Frontend — React 18 + Vite + React-Bootstrap

```
A2StudentName_ClassCode/            (frontend)
├── package.json                    # react, react-router-dom, axios, react-bootstrap
├── vite.config.js                  # port 5173
├── index.html
└── src/
    ├── main.jsx                    # import bootstrap css
    ├── App.jsx                     # Router + role-based routes
    ├── context/
    │   └── AuthContext.jsx         # user, login(), logout(), isAdmin, isStaff
    ├── services/                   # axios — mỗi resource 1 file
    │   ├── api.js                  # axios instance baseURL http://localhost:8080/api
    │   ├── authService.js
    │   ├── accountService.js
    │   ├── categoryService.js
    │   ├── newsService.js
    │   └── tagService.js
    ├── components/
    │   ├── Header.jsx              # navbar theo role
    │   ├── ProtectedRoute.jsx      # chặn route theo role
    │   ├── ConfirmModal.jsx        # xác nhận xóa (dùng chung)
    │   ├── AccountModal.jsx        # popup Create/Update account
    │   ├── CategoryModal.jsx       # popup Create/Update category
    │   └── NewsModal.jsx           # popup Create/Update news + tags
    └── pages/
        ├── HomePage.jsx            # public — tin active, không cần login
        ├── LoginPage.jsx
        ├── AccountManagementPage.jsx   # Admin
        ├── CategoryManagementPage.jsx  # Staff
        ├── NewsManagementPage.jsx      # Staff
        ├── NewsHistoryPage.jsx         # Staff
        └── ProfilePage.jsx             # Staff
```

> Code đầy đủ nằm trong thư mục `solution/backend` và `solution/frontend` cạnh file này.

### 1.3. Bảng API chuẩn

| Method | Endpoint | Chức năng | Status |
|---|---|---|---|
| POST | `/api/auth/login` | Đăng nhập email + password | 200 / 401 / 400 |
| GET | `/api/accounts` | Danh sách account | 200 |
| GET | `/api/accounts/{id}` | Chi tiết account | 200 / 404 |
| GET | `/api/accounts/search?q=` | Tìm theo tên/email | 200 |
| POST | `/api/accounts` | Tạo account | 201 / 400 / 409 |
| PUT | `/api/accounts/{id}` | Cập nhật account | 200 / 400 / 404 / 409 |
| DELETE | `/api/accounts/{id}` | Xóa account | 204 / 404 / **409 nếu đã tạo bài** |
| GET | `/api/categories` | Danh sách category | 200 |
| GET | `/api/categories/search?q=` | Tìm theo tên | 200 |
| POST | `/api/categories` | Tạo category | 201 / 400 |
| PUT | `/api/categories/{id}` | Cập nhật category | 200 / 400 / 404 |
| DELETE | `/api/categories/{id}` | Xóa category | 204 / 404 / **409 nếu đang được dùng** |
| GET | `/api/news/public` | **Public** — tin active | 200 |
| GET | `/api/news` | Danh sách tin (staff) | 200 |
| GET | `/api/news/{id}` | Chi tiết tin | 200 / 404 |
| GET | `/api/news/search?q=` | Tìm theo title/headline | 200 |
| GET | `/api/news/history/{accountId}` | Lịch sử tin của 1 staff | 200 |
| POST | `/api/news` | Tạo tin (kèm tagIds) | 201 / 400 / 409 |
| PUT | `/api/news/{id}` | Cập nhật tin (kèm tagIds) | 200 / 400 / 404 |
| DELETE | `/api/news/{id}` | Xóa tin (xóa NewsTag trước) | 204 / 404 |
| GET | `/api/tags` | Danh sách tag | 200 |

---

## 2. Quy ước commit (bắt buộc ở mỗi TODO)

Theo Conventional Commits. **Mỗi TODO hoàn thành = ít nhất 1 commit**, message dạng:

```
feat(TODO-NN): <mô tả ngắn bằng tiếng Anh>
```

Các type được dùng: `feat` (tính năng), `fix` (sửa lỗi), `test` (kiểm thử), `docs` (tài liệu), `chore` (cấu hình).

Ví dụ chuỗi commit chuẩn của toàn bài:

```
chore(TODO-01): init spring boot project and configure sql server datasource
feat(TODO-02): add JPA entities with relationships
feat(TODO-03): add spring data repositories with search and constraint queries
feat(TODO-04): add request/response DTOs with bean validation
feat(TODO-05): implement service layer with business rules
feat(TODO-06): add REST controllers, global exception handler and CORS config
test(TODO-07): verify all endpoints with postman collection
chore(TODO-08): init react vite project and axios services
feat(TODO-09): add auth context, login page and role-based routing
feat(TODO-10): add public news page without authentication
feat(TODO-11): add account management for admin with modal and confirm delete
feat(TODO-12): add category management for staff
feat(TODO-13): add news article management with tags
feat(TODO-14): add profile page and news history page
test(TODO-15): end-to-end testing FE-BE integration
```

Quy tắc: message viết thường, thì hiện tại, không dấu chấm cuối; 1 commit chỉ chứa thay đổi của đúng TODO đó; push lên remote sau mỗi TODO (`git push origin main`).

---

## 3. Hướng dẫn step-by-step theo TODO

### PHẦN A — BACKEND (TODO-01 → TODO-07)

---

### TODO-01 — Tạo Spring Boot project + cấu hình Data Source

**Bước 1.** Vào https://start.spring.io (hoặc IntelliJ → New Project → Spring Initializr):
- Project: **Maven**, Language: **Java**, Spring Boot: **3.2.x**
- Group: `com.fu` — Artifact: `A2StudentName_ClassCode` — Java: **17**
- Dependencies: **Spring Web**, **Spring Data JPA**, **MS SQL Server Driver**, **Validation**, **Lombok**

**Bước 2.** Generate → giải nén → mở bằng IntelliJ IDEA → chờ Maven tải dependency.

**Bước 3.** Tạo database trong SSMS: chạy script SQL đề cho, đổi tên DB thành `A2StudentName_ClassCode`.

**Bước 4.** Cấu hình `src/main/resources/application.properties` (xem `solution/backend/src/main/resources/application.properties`):

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A2StudentName_ClassCode;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword@123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Bước 5.** Chạy `A2Application` → console không lỗi kết nối, Tomcat chạy ở port 8080.

**Lỗi thường gặp:** `The TCP/IP connection to the host has failed` → mở SQL Server Configuration Manager, bật TCP/IP, restart service. `Login failed for user 'sa'` → bật SQL Authentication mode và enable user sa.

✅ **Checklist TODO-01**
- [ ] Project chạy được, không exception
- [ ] Log hiện `HikariPool-1 - Start completed`
- [ ] Database đúng tên `A2StudentName_ClassCode`, đủ 5 bảng + dữ liệu mẫu

📌 **Commit:** `chore(TODO-01): init spring boot project and configure sql server datasource`

---

### TODO-02 — Tạo 4 Entity + quan hệ

Tạo package `entity` với 4 class (code đầy đủ: `solution/backend/.../entity/`):

| Entity | Khóa chính | Quan hệ |
|---|---|---|
| `SystemAccount` | `accountId` (Short, nhập tay) | `@OneToMany` → NewsArticle |
| `Category` | `categoryId` (Short, `IDENTITY`) | `@ManyToOne` → chính nó (parent) |
| `NewsArticle` | `newsArticleId` (String 20, nhập tay) | `@ManyToOne` Category, `@ManyToOne` SystemAccount, `@ManyToMany` Tag |
| `Tag` | `tagId` (Integer, nhập tay) | — |

Điểm cần chú ý:

1. Map đúng tên cột trong DB — cột mô tả category trong DB gốc bị typo là **`CategoryDesciption`**, phải giữ nguyên trong `@Column(name = ...)`.
2. Quan hệ N-N khai báo ở `NewsArticle`:

```java
@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(name = "NewsTag",
        joinColumns = @JoinColumn(name = "NewsArticleID"),
        inverseJoinColumns = @JoinColumn(name = "TagID"))
private Set<Tag> tags = new HashSet<>();
```

3. `accountPassword` đánh dấu `@JsonIgnore` để không bao giờ trả password ra ngoài.
4. Dùng Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder` cho gọn.

✅ **Checklist TODO-02**
- [ ] Chạy lại app, Hibernate không báo lỗi mapping
- [ ] Không sinh bảng thừa (tên bảng/cột khớp DB có sẵn)
- [ ] Password có `@JsonIgnore`

📌 **Commit:** `feat(TODO-02): add JPA entities with relationships`

---

### TODO-03 — Tạo Repository

Tạo package `repository` với 4 interface extends `JpaRepository`. Các derived query bắt buộc:

```java
// SystemAccountRepository — login + search
Optional<SystemAccount> findByAccountEmailAndAccountPassword(String email, String password);
List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);

// CategoryRepository — search
List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);

// NewsArticleRepository — public, history, search + 2 query ràng buộc delete
List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();
List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);
boolean existsByCreatedBy_AccountId(Short accountId);      // chặn xóa account
boolean existsByCategory_CategoryId(Short categoryId);      // chặn xóa category
List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(String t, String h);
```

✅ **Checklist TODO-03**
- [ ] App chạy được — tên method sai quy tắc Spring Data sẽ fail ngay lúc khởi động
- [ ] Đủ 2 method `exists...` phục vụ ràng buộc xóa

📌 **Commit:** `feat(TODO-03): add spring data repositories with search and constraint queries`

---

### TODO-04 — DTO + Validation (validate tất cả field)

Tạo package `dto`, dùng Java record + Bean Validation (code: `solution/backend/.../dto/`):

| DTO | Validation chính |
|---|---|
| `LoginRequest` | `@NotBlank`, `@Email` |
| `AccountRequest` | `@NotNull` id; `@NotBlank @Size(max=100)` name; `@Email @Size(max=70)`; role `@Min(1) @Max(2)`; password `@NotBlank` |
| `CategoryRequest` | name `@NotBlank @Size(max=100)`; description `@NotBlank @Size(max=250)`; `@NotNull` isActive |
| `NewsArticleRequest` | id `@NotBlank @Size(max=20)`; headline `@NotBlank @Size(max=150)`; `@NotNull` categoryId, newsStatus, createdById; content `@Size(max=4000)` |

Response DTO (`AccountResponse`, `CategoryResponse`, `NewsArticleResponse`) có static factory `from(entity)` — tách entity khỏi JSON trả về, không lộ password, kèm tên category/người tạo/tags cho FE hiển thị.

✅ **Checklist TODO-04**
- [ ] Mọi field có annotation validation đúng độ dài cột DB
- [ ] Response không chứa password

📌 **Commit:** `feat(TODO-04): add request/response DTOs with bean validation`

---

### TODO-05 — Service layer (business rules)

Tạo package `service` + `exception` (code: `solution/backend/.../service/`). Business rules phải nằm ở **Service, không nằm ở Controller**:

1. **AuthService.login:** tìm theo email + password, sai → `UnauthorizedException` (401).
2. **AccountService.create:** kiểm tra trùng `accountId` và trùng email → `ConflictException` (409).
3. **AccountService.delete:**

```java
if (newsArticleRepository.existsByCreatedBy_AccountId(id)) {
    throw new ConflictException("Cannot delete: this account has created news articles");
}
```

4. **CategoryService.delete:**

```java
if (newsArticleRepository.existsByCategory_CategoryId(id)) {
    throw new ConflictException("Cannot delete: this category is used by news articles");
}
```

5. **NewsArticleService.create:** set `createdDate = LocalDateTime.now()`, resolve `tagIds` → `Set<Tag>`.
6. **NewsArticleService.update:** set `modifiedDate`, `updatedById`, thay tags mới.
7. **NewsArticleService.delete:** `news.getTags().clear()` trước khi delete để xóa dòng `NewsTag`.
8. Không tìm thấy id → `ResourceNotFoundException` (404).

✅ **Checklist TODO-05**
- [ ] 2 ràng buộc xóa ném `ConflictException`
- [ ] Create news tự set `createdDate`; update tự set `modifiedDate` + `updatedById`
- [ ] Delete news không lỗi FK (đã clear tags)

📌 **Commit:** `feat(TODO-05): implement service layer with business rules`

---

### TODO-06 — REST Controller + GlobalExceptionHandler + CORS

Tạo package `controller` theo đúng bảng API mục 1.3 (code: `solution/backend/.../controller/`). Chú ý:

- `@Valid @RequestBody` trên mọi POST/PUT để kích hoạt validation.
- POST trả `201` (`@ResponseStatus(HttpStatus.CREATED)`), DELETE trả `204`.
- `GlobalExceptionHandler` (`@RestControllerAdvice`) map: `MethodArgumentNotValidException` → 400 kèm map lỗi từng field; `ResourceNotFoundException` → 404; `ConflictException` → 409; `UnauthorizedException` → 401.
- `CorsConfig` cho phép origin `http://localhost:5173` với GET/POST/PUT/DELETE.

✅ **Checklist TODO-06**
- [ ] Đủ 20 endpoint theo bảng mục 1.3
- [ ] Gửi body thiếu field → 400 kèm danh sách lỗi từng field
- [ ] Không còn try-catch lặp trong controller (đã có handler tập trung)

📌 **Commit:** `feat(TODO-06): add REST controllers, global exception handler and CORS config`

---

### TODO-07 — Kiểm thử Postman toàn bộ API

Làm theo **mục 4 (Kiểm thử Postman chuẩn)** bên dưới. Chỉ chuyển sang FE khi **tất cả request pass**.

📌 **Commit:** `test(TODO-07): verify all endpoints with postman collection`

---

### PHẦN B — FRONTEND (TODO-08 → TODO-15)

---

### TODO-08 — Tạo React project + axios services

**Bước 1.** Tạo project:

```bash
npm create vite@latest A2StudentName_ClassCode -- --template react
cd A2StudentName_ClassCode
npm install
npm install axios react-router-dom bootstrap react-bootstrap
```

**Bước 2.** Import bootstrap trong `src/main.jsx`: `import 'bootstrap/dist/css/bootstrap.min.css'`.

**Bước 3.** Tạo `src/services/api.js` — axios instance `baseURL: 'http://localhost:8080/api'`.

**Bước 4.** Tạo 5 service files (`authService`, `accountService`, `categoryService`, `newsService`, `tagService`) — mỗi hàm là named export, `async/await`, return `response.data` (code: `solution/frontend/src/services/`).

✅ **Checklist TODO-08**
- [ ] `npm run dev` chạy tại http://localhost:5173
- [ ] Mỗi resource có đủ hàm get/search/create/update/delete
- [ ] Không hardcode URL trong component — mọi request qua services

📌 **Commit:** `chore(TODO-08): init react vite project and axios services`

---

### TODO-09 — AuthContext + Login + Router phân quyền

**Bước 1.** `src/context/AuthContext.jsx`: state `user` (khởi tạo từ `localStorage`), hàm `login/logout`, cờ `isAdmin` (role 1), `isStaff` (role 2).

**Bước 2.** `src/components/ProtectedRoute.jsx`: chưa login → `<Navigate to="/login" />`; sai role → về `/`.

**Bước 3.** `src/pages/LoginPage.jsx`: form controlled input email + password, submit gọi `authService.login`, thành công lưu vào context rồi điều hướng theo role (Admin → `/accounts`, Staff → `/news`), thất bại hiện `Alert` đỏ.

**Bước 4.** `src/App.jsx`: khai báo routes như bảng dưới; `src/components/Header.jsx`: navbar chỉ hiện menu đúng role.

| Route | Component | Quyền |
|---|---|---|
| `/` | HomePage | Public |
| `/login` | LoginPage | Public |
| `/accounts` | AccountManagementPage | Admin |
| `/categories`, `/news`, `/history`, `/profile` | 4 trang Staff | Staff |

✅ **Checklist TODO-09**
- [ ] Login đúng → điều hướng đúng theo role; sai → báo lỗi từ API
- [ ] F5 trang không mất đăng nhập (localStorage)
- [ ] Staff gõ tay `/accounts` bị đẩy về `/`; chưa login vào `/news` bị đẩy về `/login`

📌 **Commit:** `feat(TODO-09): add auth context, login page and role-based routing`

---

### TODO-10 — Trang tin công khai (không cần đăng nhập)

`src/pages/HomePage.jsx`: `useEffect` gọi `getPublicNews()` (endpoint `/news/public` — chỉ trả tin active), hiển thị Card grid gồm title, category, ngày tạo, người tạo, đoạn đầu content, badges tags. Có trạng thái `loading` (Spinner) và `error` (Alert).

✅ **Checklist TODO-10**
- [ ] Mở `/` khi **chưa login** vẫn xem được tin
- [ ] Chỉ hiện tin `newsStatus = true`
- [ ] Tắt BE → hiện thông báo lỗi, không trắng trang

📌 **Commit:** `feat(TODO-10): add public news page without authentication`

---

### TODO-11 — Account Management (Admin): CRUD + Search + Modal + Confirm

**Bước 1.** `AccountManagementPage.jsx`: state `accounts`, `keyword`, `editingAccount`, `deletingAccount`; load bằng `getAccounts()`, search bằng `searchAccounts(keyword)`.

**Bước 2.** Bảng React-Bootstrap `Table` gồm ID, Name, Email, Role + nút Edit/Delete; nút "+ Add Account".

**Bước 3.** `AccountModal.jsx` — **popup dialog** dùng chung cho Create/Update: controlled inputs; ID disable khi update; role là select Admin/Staff; validate `required`, `maxLength`, `type="email"`; lỗi 400/409 từ API hiện trong modal.

**Bước 4.** `ConfirmModal.jsx` — xóa **luôn qua xác nhận**. Xóa account đã tạo bài → API trả 409 → hiện message trên Alert.

✅ **Checklist TODO-11**
- [ ] Create/Update mở popup, thành công thì đóng modal + reload bảng
- [ ] Delete luôn hỏi xác nhận; account có bài viết báo lỗi 409 rõ ràng
- [ ] Search theo tên/email hoạt động; validate chặn email sai định dạng

📌 **Commit:** `feat(TODO-11): add account management for admin with modal and confirm delete`

---

### TODO-12 — Category Management (Staff)

Tương tự TODO-11 với `CategoryManagementPage.jsx` + `CategoryModal.jsx`. Khác biệt:

- Modal có dropdown **Parent Category** (loại chính nó ra khỏi danh sách khi update), switch **Active**.
- Xóa category đang được dùng bởi bài viết → 409, hiện thông báo.

✅ **Checklist TODO-12**
- [ ] CRUD + Search hoạt động, popup + confirm đầy đủ
- [ ] Không chọn được chính nó làm parent
- [ ] Xóa category đang dùng bị chặn kèm thông báo

📌 **Commit:** `feat(TODO-12): add category management for staff`

---

### TODO-13 — News Article Management (Staff, kèm tags)

**Bước 1.** `NewsManagementPage.jsx`: ngoài news còn load `getCategories()` và `getTags()` cho modal.

**Bước 2.** `NewsModal.jsx` (size `lg`): các field ID (disable khi update), Title, Headline, Content (textarea), Source, Category (select), **Tags (checkbox nhiều lựa chọn)**, switch Active.

**Bước 3.** Khi save, gắn `createdById: user.accountId` từ AuthContext rồi gọi `createNews`/`updateNews`.

**Bước 4.** Bảng hiển thị tags dạng Badge, status Active/Inactive, delete qua confirm.

✅ **Checklist TODO-13**
- [ ] Tạo tin có tags → tin hiện đúng tags trong bảng
- [ ] Update đổi tags/category/status thành công; DB bảng `NewsTag` cập nhật đúng
- [ ] Tin active mới xuất hiện ở HomePage

📌 **Commit:** `feat(TODO-13): add news article management with tags`

---

### TODO-14 — Profile + News History (Staff)

**ProfilePage.jsx:** form Name/Email/Password của chính user (`updateAccount(user.accountId, ...)` giữ nguyên role); thành công thì cập nhật lại AuthContext.

**NewsHistoryPage.jsx:** gọi `getNewsHistory(user.accountId)` → bảng tin do chính staff tạo (ID, title, category, ngày tạo/sửa, status).

✅ **Checklist TODO-14**
- [ ] Đổi tên trong Profile → tên trên Header đổi theo
- [ ] History chỉ hiện tin của đúng user đang đăng nhập

📌 **Commit:** `feat(TODO-14): add profile page and news history page`

---

### TODO-15 — Kiểm thử tích hợp FE ↔ BE

Chạy đồng thời BE (8080) + FE (5173) và đi hết kịch bản ở **mục 5 (Checklist tổng)**.

📌 **Commit:** `test(TODO-15): end-to-end testing FE-BE integration`

---

## 4. Kiểm thử Postman chuẩn (TODO-07)

### 4.1. Thiết lập

1. Import file `postman/A2_FUNewsManagement.postman_collection.json` (cạnh file hướng dẫn này) vào Postman.
2. Collection đã có sẵn biến `baseUrl = http://localhost:8080/api` (đổi nếu khác port).
3. Chạy BE trước khi test. Chạy cả collection: **Run collection** → xem báo cáo pass/fail.

### 4.2. Kịch bản kiểm thử bắt buộc

Chạy **theo đúng thứ tự** (các request sau phụ thuộc dữ liệu request trước):

| # | Request | Expected | Kiểm tra gì |
|---|---|---|---|
| 1 | POST `/auth/login` (đúng) | 200 | trả accountId, accountRole, **không có password** |
| 2 | POST `/auth/login` (sai pass) | 401 | message lỗi |
| 3 | POST `/auth/login` (email sai định dạng) | 400 | validation |
| 4 | GET `/accounts` | 200 | trả mảng |
| 5 | POST `/accounts` (id 99) | 201 | echo đúng dữ liệu |
| 6 | POST `/accounts` (id 99 lần 2) | 409 | chặn trùng ID |
| 7 | POST `/accounts` (thiếu field) | 400 | message là object lỗi từng field |
| 8 | GET `/accounts/search?q=emma` | 200 | tìm ra Emma William |
| 9 | PUT `/accounts/99` | 200 | tên đã đổi |
| 10 | DELETE `/accounts/1` | **409** | account 1 đã tạo bài → không xóa được |
| 11 | DELETE `/accounts/99` | 204 | account chưa tạo bài → xóa được |
| 12 | GET `/accounts/9999` | 404 | not found |
| 13 | GET `/categories` | 200 | 5 category mẫu |
| 14 | POST `/categories` | 201 | lưu `newCategoryId` vào biến collection |
| 15 | POST `/categories` (name rỗng) | 400 | validation |
| 16 | GET `/categories/search?q=news` | 200 | |
| 17 | PUT `/categories/{{newCategoryId}}` | 200 | |
| 18 | DELETE `/categories/1` | **409** | category 1 đang được dùng |
| 19 | DELETE `/categories/{{newCategoryId}}` | 204 | category chưa dùng |
| 20 | GET `/news/public` | 200 | **mọi phần tử có `newsStatus = true`** |
| 21 | GET `/news` | 200 | |
| 22 | POST `/news` (PM-01, tagIds [1,2]) | 201 | có 2 tags, `createdDate` không null |
| 23 | POST `/news` (thiếu headline) | 400 | validation |
| 24 | GET `/news/search?q=alumni` | 200 | |
| 25 | GET `/news/history/1` | 200 | mọi tin có `createdById = 1` |
| 26 | PUT `/news/PM-01` (tagIds [3]) | 200 | còn 1 tag, `modifiedDate` không null |
| 27 | DELETE `/news/PM-01` | 204 | không lỗi FK NewsTag |
| 28 | GET `/news/NOT-EXIST` | 404 | |
| 29 | GET `/tags` | 200 | 9 tags mẫu |

### 4.3. Test script mẫu (đã nhúng sẵn trong collection)

```javascript
pm.test('Status 201', () => pm.response.to.have.status(201));

pm.test('Tra ve account info, khong lo password', () => {
    const body = pm.response.json();
    pm.expect(body).to.have.property('accountId');
    pm.expect(body).to.not.have.property('accountPassword');
});

// Public news: tat ca deu active
pm.test('Tat ca tin deu active', () => {
    pm.response.json().forEach(n => pm.expect(n.newsStatus).to.be.true);
});
```

**Đạt chuẩn khi:** Run collection → **0 failed**. 

---

## 5. Checklist tổng trước khi nộp

### 5.1. Backend
- [ ] Đúng 3-Layer: Controller không chứa business logic, Service không trả Entity thô ra ngoài (dùng DTO)
- [ ] Tên project + database = `A2StudentName_ClassCode` (đã thay tên thật)
- [ ] Validation trên tất cả field (`@Valid` + annotation), lỗi trả 400 kèm chi tiết
- [ ] Xóa account đã tạo bài → 409; xóa category đang dùng → 409
- [ ] `/api/news/public` không cần đăng nhập, chỉ trả tin active
- [ ] Không trả password trong bất kỳ response nào
- [ ] Toàn bộ Postman collection pass (mục 4)

### 5.2. Frontend
- [ ] Đăng nhập bằng email + password; điều hướng theo role
- [ ] Admin chỉ thấy Account Management; Staff thấy Category/News/History/Profile
- [ ] Cả 3 màn quản lý có đủ **Read, Create, Update, Delete, Search**
- [ ] Create/Update **luôn bằng popup dialog**; Delete **luôn có confirmation**
- [ ] Form validate kiểu dữ liệu mọi field; lỗi API hiển thị cho người dùng
- [ ] News có gán/bỏ tags; HomePage xem tin không cần login
- [ ] Staff sửa được profile và xem được lịch sử tin của mình
- [ ] Không hardcode URL trong component (mọi request qua `services/`)

### 5.3. Git
- [ ] Mỗi TODO ≥ 1 commit đúng format `type(TODO-NN): message`
- [ ] Lịch sử commit theo đúng thứ tự TODO-01 → TODO-15
- [ ] Không commit `node_modules/`, `target/` (có `.gitignore`)

### 5.4. Kịch bản demo nhanh (5 phút)
1. Mở `/` chưa login → thấy tin active.
2. Login Admin (SteveParis) → CRUD + Search account; thử xóa account 1 → bị chặn 409.
3. Logout → Login Staff (EmmaWilliam) → tạo category, tạo tin kèm 2 tags.
4. Về `/` → tin mới xuất hiện. Sửa tin đổi status inactive → tin biến mất khỏi `/`.
5. Xem History → có tin vừa tạo. Sửa Profile → tên trên navbar đổi.
6. Thử xóa category vừa dùng → bị chặn 409. Xóa tin → thành công (có confirm).
