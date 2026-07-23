# Lab 05 — Hướng dẫn hoàn chỉnh dành cho Sinh viên

> **Domain:** Orchid Management · **Stack:** Spring Boot 3 + JPA + MSSQL · React 18 + Vite + react-bootstrap  
> Đọc kỹ toàn bộ file này trước khi bắt đầu code.
# Thông tin sinh viên
Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |
---

## Mục lục

1. [Yêu cầu cấu trúc dự án](#1-yêu-cầu-cấu-trúc-dự-án)
2. [Quy tắc commit code](#2-quy-tắc-commit-code)
3. [BACK-END — Yêu cầu, Checklist & Commit](#3-back-end--yêu-cầu-checklist--commit)
4. [FRONT-END — Yêu cầu, Checklist & Commit](#4-front-end--yêu-cầu-checklist--commit)
5. [Checklist tổng thể trước khi nộp bài](#5-checklist-tổng-thể-trước-khi-nộp-bài)

---

## 1. Yêu cầu cấu trúc dự án

### 1.1 Cấu trúc thư mục bắt buộc

Toàn bộ source code nằm trong một repo duy nhất:

```
lab05-[MSSV]-[HoTen]/               ← tên repo GitHub Classroom
│
├── orchid-management/              ← Spring Boot back-end
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/lab05/orchidmanagement/
│       │   │   ├── OrchidManagementApplication.java
│       │   │   ├── pojos/
│       │   │   │   └── Orchid.java
│       │   │   ├── repositories/
│       │   │   │   └── IOrchidRepository.java
│       │   │   ├── services/
│       │   │   │   ├── IOrchidService.java
│       │   │   │   └── OrchidService.java
│       │   │   └── controllers/
│       │   │       └── OrchidController.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
│           └── java/com/lab05/orchidmanagement/
│               └── OrchidManagementApplicationTests.java
│
├── orchid-fe/                      ← React front-end
│   ├── .env.example                ← KHÔNG commit .env thật
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── utils/
│       │   └── orchidApi.js
│       ├── reducers/
│       │   └── orchidReducer.js
│       ├── context/
│       │   └── OrchidContext.jsx
│       ├── components/
│       │   ├── NavBar.jsx
│       │   ├── OrchidTable.jsx
│       │   ├── OrchidCard.jsx
│       │   ├── OrchidForm.jsx
│       │   └── ConfirmModal.jsx
│       └── pages/
│           ├── HomePage.jsx
│           ├── AddOrchidPage.jsx
│           └── EditOrchidPage.jsx
│
└── .gitignore
```

### 1.2 Quy tắc đặt tên

| Thành phần | Quy tắc | Ví dụ |
|---|---|---|
| Java class | PascalCase | `OrchidService`, `IOrchidRepository` |
| Java package | lowercase | `com.lab05.orchidmanagement.services` |
| Java interface | tiền tố `I` | `IOrchidService`, `IOrchidRepository` |
| React component file | PascalCase | `NavBar.jsx`, `OrchidTable.jsx` |
| React utility/reducer | camelCase | `orchidApi.js`, `orchidReducer.js` |
| CSS class (Bootstrap) | kebab-case | `d-flex`, `mt-4`, `table-dark` |

### 1.3 File `.gitignore` bắt buộc

```gitignore
# Java / Maven
target/
*.class
*.jar

# IDE
.idea/
*.iml
.vscode/

# Node / React
orchid-fe/node_modules/
orchid-fe/dist/

# Secrets — KHÔNG commit file này
orchid-management/src/main/resources/application.properties
orchid-fe/.env
```

> ⚠️ **Quan trọng:** Tạo `application.properties.example` và `.env.example` thay thế, chứa placeholder thay vì password thật.

---

## 2. Quy tắc commit code

### 2.1 Cấu trúc message commit

```
<type>(<scope>): <subject>

[body — tuỳ chọn, giải thích ngắn nếu cần]
```

**Type hợp lệ:**

| Type | Khi nào dùng |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa lỗi |
| `refactor` | Cải thiện code không thay đổi tính năng |
| `style` | Thay đổi style, format (không đổi logic) |
| `chore` | Cấu hình, dependencies, .gitignore |
| `docs` | Cập nhật tài liệu, README |
| `test` | Thêm/sửa test |

**Scope hợp lệ:**

| Scope | Phạm vi |
|---|---|
| `be` | Back-end chung |
| `entity` | Orchid entity |
| `repo` | Repository layer |
| `service` | Service layer |
| `controller` | Controller layer |
| `fe` | Front-end chung |
| `api` | orchidApi.js |
| `context` | OrchidContext + Reducer |
| `navbar` | NavBar component |
| `table` | OrchidTable component |
| `form` | OrchidForm component |
| `modal` | ConfirmModal component |
| `page` | Bất kỳ page nào |
| `config` | Cấu hình project |

### 2.2 Ví dụ message đúng / sai

```bash
# ✅ Đúng
feat(entity): add Orchid entity with JPA annotations
feat(repo): add IOrchidRepository extending JpaRepository
feat(service): implement OrchidService CRUD methods
feat(controller): add REST endpoints with CORS config
feat(api): create axios instance and orchidApi helpers
feat(context): add OrchidContext with useReducer
feat(table): implement OrchidTable with Badge and edit/delete buttons
feat(form): implement OrchidForm with react-bootstrap controls
feat(modal): add ConfirmModal for delete confirmation
feat(page): implement HomePage with table/card toggle view
feat(page): implement AddOrchidPage with form and redirect
feat(page): implement EditOrchidPage loading data by id
fix(controller): return 404 when orchid not found by id
fix(form): sync form state when initialData changes
chore(config): add application.properties and pom.xml dependencies
chore(fe): init Vite React project and install dependencies

# ❌ Sai — KHÔNG được commit theo kiểu này
git commit -m "fix bug"
git commit -m "update"
git commit -m "done"
git commit -m "lab05"
git commit -m "xong roi"
```

### 2.3 Quy tắc commit theo từng TODO

Mỗi TODO **phải là ít nhất 1 commit riêng biệt**. Không gộp nhiều TODO vào 1 commit.

```
TODO-BE-01 → commit: chore(config): init Spring Boot project structure
TODO-BE-02 → commit: chore(config): configure application.properties and pom.xml
TODO-BE-03 → commit: feat(entity): add Orchid entity class
TODO-BE-04 → commit: feat(repo): add IOrchidRepository
TODO-BE-05 → commit: feat(service): add IOrchidService interface and OrchidService impl
TODO-BE-06 → commit: feat(controller): add OrchidController with CORS and 5 endpoints
TODO-FE-01 → commit: chore(fe): init Vite project and install dependencies
TODO-FE-02 → commit: chore(config): add .env, main.jsx with bootstrap import
TODO-FE-03 → commit: feat(fe): configure App.jsx with BrowserRouter and Routes
TODO-FE-04 → commit: feat(api): create orchidApi axios instance
TODO-FE-05 → commit: feat(context): add orchidReducer with FETCH/ADD/UPDATE/DELETE
TODO-FE-06 → commit: feat(context): add OrchidContext and OrchidProvider
TODO-FE-07 → commit: feat(navbar): implement NavBar with react-bootstrap
TODO-FE-08 → commit: feat(table): implement OrchidTable with Badge and action buttons
TODO-FE-09 → commit: feat(form): implement OrchidForm with all react-bootstrap controls
TODO-FE-10 → commit: feat(modal): implement ConfirmModal for delete confirmation
TODO-FE-11 → commit: feat(page): implement HomePage with list, delete flow
TODO-FE-12 → commit: feat(page): implement AddOrchidPage with form submit
TODO-FE-13 → commit: feat(page): implement EditOrchidPage loading orchid by id
```

---

## 3. BACK-END — Yêu cầu, Checklist & Commit

---

### TODO-BE-01: Khởi tạo Spring Boot project

**Yêu cầu:**
- Tạo project qua IntelliJ Initializr hoặc https://start.spring.io
- Group: `com.lab05` | Artifact: `orchid-management` | Packaging: `Jar` | Java: `17`
- Thêm đủ 4 dependency: Spring Web, Spring Data JPA, MS SQL Server Driver, Spring Boot Test
- Tạo đúng cấu trúc package: `pojos`, `repositories`, `services`, `controllers`
- Tạo file `.gitignore` loại trừ `target/`, `.idea/`, `application.properties`

**Checklist TODO-BE-01:**
- [ ] Project tạo thành công, build không lỗi (`mvn compile`)
- [ ] Đủ 4 dependency trong `pom.xml`
- [ ] Java version = 17 trong `pom.xml`
- [ ] 4 package con tồn tại trong source tree
- [ ] `.gitignore` đã loại trừ `target/` và `application.properties`
- [ ] `OrchidManagementApplication.java` có annotation `@SpringBootApplication`

**Commit:**
```bash
git add .
git commit -m "chore(config): init Spring Boot project with required packages and gitignore"
```

---

### TODO-BE-02: Cấu hình `application.properties`

**Yêu cầu:**
- Cấu hình đúng JDBC URL cho MS SQL Server với `databaseName=OrchidDB`
- Bật `ddl-auto=update` để Hibernate tự tạo/cập nhật bảng
- Bật `show-sql=true` để debug câu truy vấn
- Tạo `application.properties.example` chứa placeholder (không có password thật) để commit lên Git

**Checklist TODO-BE-02:**
- [ ] File `application.properties` tồn tại tại đường dẫn `src/main/resources/`
- [ ] `spring.datasource.url` trỏ đúng `localhost:1433`, đúng `databaseName=OrchidDB`
- [ ] `spring.datasource.driver-class-name` = `com.microsoft.sqlserver.jdbc.SQLServerDriver`
- [ ] `spring.jpa.hibernate.ddl-auto=update`
- [ ] `spring.jpa.show-sql=true`
- [ ] File `application.properties.example` đã được tạo với placeholder password
- [ ] File `application.properties` **KHÔNG** xuất hiện trong `git status` (đã gitignore)

**Commit:**
```bash
git add orchid-management/src/main/resources/application.properties.example
git commit -m "chore(config): add application.properties.example with datasource config"
```

---

### TODO-BE-03: Tạo Orchid Entity (`pojos/Orchid.java`)

**Yêu cầu:**
- Class nằm trong package `com.lab05.orchidmanagement.pojos`
- Annotation bắt buộc: `@Entity`, `@Table(name="Orchid")`
- `orchidId`: `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`, `@Column(name="OrchidID")`
- 6 field còn lại ánh xạ đúng tên cột: `OrchidName`, `isNatural`, `orchidDescription`, `orchidCategory`, `isAttractive`, `orchidURL`
- Có constructor không tham số (bắt buộc cho JPA)
- Có đầy đủ Getter và Setter cho tất cả field

**Checklist TODO-BE-03:**
- [ ] Class có `@Entity` và `@Table(name="Orchid")`
- [ ] `orchidId` có `@Id` + `@GeneratedValue(strategy=IDENTITY)` + `@Column(name="OrchidID")`
- [ ] `orchidName`: `@Column(name="OrchidName", nullable=false)`
- [ ] `isNatural`: kiểu `Boolean`, `@Column(name="isNatural")`
- [ ] `orchidDescription`: `@Column(name="orchidDescription", length=500)`
- [ ] `orchidCategory`: `@Column(name="orchidCategory")`
- [ ] `isAttractive`: kiểu `Boolean`, `@Column(name="isAttractive")`
- [ ] `orchidURL`: `@Column(name="orchidURL")`
- [ ] Có no-arg constructor `public Orchid() {}`
- [ ] Có đủ getter/setter cho 7 field
- [ ] Sau khi run, Hibernate tạo bảng `Orchid` trong `OrchidDB` (kiểm tra SSMS)

**Commit:**
```bash
git add orchid-management/src/main/java/com/lab05/orchidmanagement/pojos/Orchid.java
git commit -m "feat(entity): add Orchid entity with JPA annotations and getters/setters"
```

---

### TODO-BE-04: Tạo `IOrchidRepository`

**Yêu cầu:**
- Interface nằm trong package `com.lab05.orchidmanagement.repositories`
- Đánh dấu `@Repository`
- Extends `JpaRepository<Orchid, Integer>`
- Không cần viết thêm method — Spring Data JPA tự tạo: `findAll()`, `findById()`, `save()`, `deleteById()`, `existsById()`

**Checklist TODO-BE-04:**
- [ ] Interface có annotation `@Repository`
- [ ] Extends đúng `JpaRepository<Orchid, Integer>`
- [ ] Generic type thứ nhất là `Orchid` (không phải class khác)
- [ ] Generic type thứ hai là `Integer` (khớp với kiểu của `orchidId`)
- [ ] Không có method thừa hoặc không liên quan

**Commit:**
```bash
git add orchid-management/src/main/java/com/lab05/orchidmanagement/repositories/IOrchidRepository.java
git commit -m "feat(repo): add IOrchidRepository extending JpaRepository"
```

---

### TODO-BE-05: Tạo Service Layer

**Yêu cầu — `IOrchidService.java`:**
- Interface trong package `services`, khai báo đúng 5 method chữ ký:
  - `List<Orchid> getAllOrchids()`
  - `Optional<Orchid> getOrchidById(Integer id)`
  - `Orchid createOrchid(Orchid orchid)`
  - `Orchid updateOrchid(Integer id, Orchid orchid)`
  - `void deleteOrchid(Integer id)`
  - `boolean existsById(Integer id)`

**Yêu cầu — `OrchidService.java`:**
- Annotation `@Service`
- Implements `IOrchidService`
- Inject `IOrchidRepository` bằng `@Autowired`
- `updateOrchid`: load entity cũ từ DB, cập nhật từng field, gọi `save()` — **không** overwrite toàn bộ object
- Xử lý trường hợp `findById` trả về `Optional.empty()` trong `updateOrchid`

**Checklist TODO-BE-05:**
- [ ] `IOrchidService.java` khai báo đủ 6 method signature
- [ ] `OrchidService` có `@Service`
- [ ] `OrchidService` có `implements IOrchidService`
- [ ] `IOrchidRepository` được inject bằng `@Autowired`
- [ ] `getAllOrchids()` trả về `repo.findAll()`
- [ ] `getOrchidById()` trả về `repo.findById(id)` (kiểu `Optional<Orchid>`)
- [ ] `createOrchid()` gọi `repo.save(orchid)` và trả về kết quả
- [ ] `updateOrchid()` load entity cũ, set từng field, rồi `repo.save(existing)`
- [ ] `deleteOrchid()` gọi `repo.deleteById(id)`
- [ ] `existsById()` gọi `repo.existsById(id)`

**Commit:**
```bash
git add orchid-management/src/main/java/com/lab05/orchidmanagement/services/
git commit -m "feat(service): add IOrchidService interface and OrchidService implementation"
```

---

### TODO-BE-06: Tạo REST Controller + CORS

**Yêu cầu:**
- Class trong package `controllers`, annotation `@RestController`
- `@RequestMapping("/orchids")` ở class level
- `@CrossOrigin(origins = "http://localhost:5173")` ở class level
- Inject `IOrchidService` bằng `@Autowired`
- Implement đúng 5 endpoint với HTTP method, URL và status code:

| Method | Annotation | URL | Status thành công |
|---|---|---|---|
| GET all | `@GetMapping("/")` | `/orchids/` | 200 OK |
| GET by id | `@GetMapping("/{id}")` | `/orchids/{id}` | 200 / 404 |
| POST | `@PostMapping("/")` | `/orchids/` | 201 Created |
| PUT | `@PutMapping("/{id}")` | `/orchids/{id}` | 200 / 404 |
| DELETE | `@DeleteMapping("/{id}")` | `/orchids/{id}` | 204 No Content |

- GET by id: trả 404 nếu không tìm thấy
- PUT và DELETE: kiểm tra `existsById` trước, trả 404 nếu không tồn tại
- POST: dùng `ResponseEntity.status(HttpStatus.CREATED).body(...)`
- DELETE: dùng `ResponseEntity.noContent().build()`

**Checklist TODO-BE-06:**
- [ ] `@RestController`, `@RequestMapping("/orchids")`, `@CrossOrigin(origins="http://localhost:5173")` đủ 3 annotation
- [ ] `GET /orchids/` → trả `200 OK` + JSON array (test Postman)
- [ ] `POST /orchids/` với body JSON → trả `201 Created` + object mới có `orchidId` (test Postman)
- [ ] `GET /orchids/{id}` với id hợp lệ → `200 OK`; id không tồn tại → `404 Not Found`
- [ ] `PUT /orchids/{id}` → `200 OK` + object đã cập nhật; id sai → `404`
- [ ] `DELETE /orchids/{id}` → `204 No Content`; id sai → `404`
- [ ] Log SQL hiển thị đúng câu lệnh (do `show-sql=true`)
- [ ] Không bị lỗi CORS khi gọi từ React trên `localhost:5173`

**Commit:**
```bash
git add orchid-management/src/main/java/com/lab05/orchidmanagement/controllers/OrchidController.java
git commit -m "feat(controller): add OrchidController with 5 REST endpoints and CORS config"
```

---

## 4. FRONT-END — Yêu cầu, Checklist & Commit

---

### TODO-FE-01: Khởi tạo React project

**Yêu cầu:**
- Dùng Vite template `react`: `npm create vite@latest orchid-fe -- --template react`
- Cài đủ 4 dependency: `axios`, `bootstrap`, `react-bootstrap`, `react-router-dom`
- Tạo `.env.example` chứa `VITE_API_BASE_URL=http://localhost:8080`
- Tạo `.gitignore` loại trừ `node_modules/`, `dist/`, `.env`

**Checklist TODO-FE-01:**
- [ ] Thư mục `orchid-fe/` tồn tại với đầy đủ file Vite
- [ ] `package.json` có 4 dependencies: `axios`, `bootstrap`, `react-bootstrap`, `react-router-dom`
- [ ] `npm install` chạy không lỗi
- [ ] `npm run dev` khởi động được ở `localhost:5173`
- [ ] `.env.example` tồn tại và có `VITE_API_BASE_URL`
- [ ] `node_modules/` và `.env` không xuất hiện trong `git status`

**Commit:**
```bash
git add orchid-fe/package.json orchid-fe/vite.config.js orchid-fe/index.html orchid-fe/.env.example
git commit -m "chore(fe): init Vite React project and install axios, bootstrap, react-bootstrap, react-router-dom"
```

---

### TODO-FE-02: Cấu hình `main.jsx` + `.env`

**Yêu cầu:**
- Import `'bootstrap/dist/css/bootstrap.min.css'` ở đầu `main.jsx` (trước mọi import khác)
- Dùng `ReactDOM.createRoot(document.getElementById('root')).render(...)`
- Bọc `<App />` trong `<React.StrictMode>`
- File `.env` (local, không commit) chứa `VITE_API_BASE_URL=http://localhost:8080`

**Checklist TODO-FE-02:**
- [ ] `main.jsx` import `'bootstrap/dist/css/bootstrap.min.css'` ở dòng đầu
- [ ] Dùng `createRoot` (React 18 API), không dùng `ReactDOM.render` cũ
- [ ] `<App />` được bọc trong `<React.StrictMode>`
- [ ] Mở `localhost:5173` thấy giao diện có Bootstrap style (font, button)
- [ ] `import.meta.env.VITE_API_BASE_URL` trả về đúng URL khi `console.log`

**Commit:**
```bash
git add orchid-fe/src/main.jsx
git commit -m "chore(config): configure main.jsx with bootstrap import and React 18 createRoot"
```

---

### TODO-FE-03: Cấu hình `App.jsx` + Routes

**Yêu cầu:**
- Bọc toàn bộ app trong `<OrchidProvider>` (context) và `<BrowserRouter>`
- Khai báo 3 route: `/` → `HomePage`, `/add` → `AddOrchidPage`, `/edit/:id` → `EditOrchidPage`
- Render `<AppNavBar />` nằm ngoài `<Routes>` để hiển thị ở mọi trang
- Import đúng tên component từ đúng đường dẫn

**Checklist TODO-FE-03:**
- [ ] `<OrchidProvider>` bao ngoài cùng
- [ ] `<BrowserRouter>` bao `<AppNavBar>` và `<Routes>`
- [ ] 3 `<Route>` khai báo đúng path: `/`, `/add`, `/edit/:id`
- [ ] `<AppNavBar />` render ở mọi trang (không nằm trong `<Routes>`)
- [ ] Điều hướng `/add` và `/edit/1` không bị lỗi trắng trang

**Commit:**
```bash
git add orchid-fe/src/App.jsx
git commit -m "feat(fe): configure App.jsx with BrowserRouter, OrchidProvider and 3 Routes"
```

---

### TODO-FE-04: `utils/orchidApi.js` — Axios instance

**Yêu cầu:**
- Tạo `axios.create` với `baseURL` đọc từ `import.meta.env.VITE_API_BASE_URL`
- Set `headers: { 'Content-Type': 'application/json' }`
- Export 5 hàm: `getAllOrchids`, `getOrchidById`, `createOrchid`, `updateOrchid`, `deleteOrchid`
- **Không** hardcode URL (`http://localhost:8080`) trong file này

**Checklist TODO-FE-04:**
- [ ] `axios.create` dùng `import.meta.env.VITE_API_BASE_URL`
- [ ] Header `Content-Type: application/json` được set
- [ ] Đủ 5 hàm export với đúng HTTP method và URL path
- [ ] `getAllOrchids` → `GET /orchids/`
- [ ] `getOrchidById(id)` → `GET /orchids/${id}`
- [ ] `createOrchid(data)` → `POST /orchids/`
- [ ] `updateOrchid(id, data)` → `PUT /orchids/${id}`
- [ ] `deleteOrchid(id)` → `DELETE /orchids/${id}`
- [ ] Không có URL hardcode trong file

**Commit:**
```bash
git add orchid-fe/src/utils/orchidApi.js
git commit -m "feat(api): create axios instance and export 5 orchidApi helper functions"
```

---

### TODO-FE-05: `reducers/orchidReducer.js`

**Yêu cầu:**
- Export `ACTIONS` object với 6 key: `FETCH_START`, `FETCH_SUCCESS`, `FETCH_ERROR`, `ADD`, `UPDATE`, `DELETE`
- Export `initialState` với 3 field: `orchids: []`, `loading: false`, `error: ''`
- Export `orchidReducer(state, action)` xử lý đúng 6 action type
- `UPDATE`: tìm và thay thế đúng object theo `orchidId`
- `DELETE`: lọc bỏ object có `orchidId` khớp với `action.payload`
- Không mutate `state` trực tiếp — luôn return object mới với spread operator

**Checklist TODO-FE-05:**
- [ ] Export `ACTIONS` với đủ 6 key
- [ ] Export `initialState` với `orchids`, `loading`, `error`
- [ ] `FETCH_START`: set `loading: true`, `error: ''`
- [ ] `FETCH_SUCCESS`: set `loading: false`, `orchids: action.payload`
- [ ] `FETCH_ERROR`: set `loading: false`, `error: action.payload`
- [ ] `ADD`: append `action.payload` vào `orchids` array
- [ ] `UPDATE`: map và thay thế đúng item theo `orchidId`
- [ ] `DELETE`: filter bỏ item theo `orchidId`
- [ ] Mọi case đều return object mới (không mutate)
- [ ] `default`: return `state` không thay đổi

**Commit:**
```bash
git add orchid-fe/src/reducers/orchidReducer.js
git commit -m "feat(context): add orchidReducer with 6 action types and immutable state updates"
```

---

### TODO-FE-06: `context/OrchidContext.jsx`

**Yêu cầu:**
- Tạo `OrchidContext` bằng `createContext(null)`
- `OrchidProvider` dùng `useReducer(orchidReducer, initialState)`
- Implement 4 async function dùng `useCallback`: `fetchOrchids`, `addOrchid`, `editOrchid`, `removeOrchid`
- Mỗi hàm dispatch đúng action sau khi gọi API thành công
- `fetchOrchids` dispatch `FETCH_START` → gọi API → `FETCH_SUCCESS` hoặc `FETCH_ERROR`
- Export custom hook `useOrchid()` — throw error nếu dùng ngoài Provider

**Checklist TODO-FE-06:**
- [ ] `OrchidContext` được tạo bằng `createContext(null)`
- [ ] `OrchidProvider` dùng `useReducer` (không dùng `useState` thuần)
- [ ] `fetchOrchids` dispatch `FETCH_START` trước khi gọi API
- [ ] `fetchOrchids` dispatch `FETCH_SUCCESS` khi thành công, `FETCH_ERROR` khi lỗi
- [ ] `addOrchid` dispatch `ACTIONS.ADD` sau khi `createOrchid` thành công
- [ ] `editOrchid` dispatch `ACTIONS.UPDATE` sau khi `updateOrchid` thành công
- [ ] `removeOrchid` dispatch `ACTIONS.DELETE` với `id` sau khi `deleteOrchid` thành công
- [ ] Cả 4 hàm bọc trong `useCallback`
- [ ] `useOrchid()` hook throw `Error` khi dùng ngoài Provider
- [ ] Provider truyền `{ ...state, fetchOrchids, addOrchid, editOrchid, removeOrchid }`

**Commit:**
```bash
git add orchid-fe/src/context/OrchidContext.jsx
git commit -m "feat(context): add OrchidContext, OrchidProvider and useOrchid custom hook"
```

---

### TODO-FE-07: `components/NavBar.jsx`

**Yêu cầu:**
- Dùng `Navbar`, `Nav`, `Container` từ `react-bootstrap`
- `Navbar` có `bg="dark"`, `variant="dark"`, `expand="lg"`, `sticky="top"`
- Brand text: `🌸 Orchid Management`, là `Link` đến `/`
- 2 Nav link: `Home` → `/`, `➕ Add Orchid` → `/add`
- Dùng `as={Link}` (từ `react-router-dom`) cho `Navbar.Brand` và `Nav.Link`
- Prop `active` tự động highlight link của trang hiện tại (dùng `useLocation`)

**Checklist TODO-FE-07:**
- [ ] Import `Navbar`, `Nav`, `Container` từ `react-bootstrap`
- [ ] Import `Link`, `useLocation` từ `react-router-dom`
- [ ] `Navbar` có `bg="dark"`, `variant="dark"`, `expand="lg"`, `sticky="top"`
- [ ] Brand là `Link` đến `/`, hiển thị `🌸 Orchid Management`
- [ ] `Navbar.Toggle` và `Navbar.Collapse` có `aria-controls` / `id` khớp nhau
- [ ] `Nav.Link` đến `/` và `/add` dùng `as={Link}`
- [ ] Prop `active` highlight đúng link theo `pathname`
- [ ] NavBar xuất hiện ở cả 3 trang (Home, Add, Edit)
- [ ] Collapse hoạt động đúng trên màn hình nhỏ

**Commit:**
```bash
git add orchid-fe/src/components/NavBar.jsx
git commit -m "feat(navbar): implement sticky NavBar with react-bootstrap and active link highlight"
```

---

### TODO-FE-08: `components/OrchidTable.jsx`

**Yêu cầu:**
- Dùng `Table`, `Button`, `Badge`, `Image` từ `react-bootstrap`
- `Table` có props: `striped`, `bordered`, `hover`, `responsive`
- `thead` dùng `className="table-dark"`
- Cột **Natural**: `Badge bg="success"` nếu `isNatural=true`, `bg="secondary"` nếu false
- Cột **Attractive**: `Badge bg="warning"` nếu `isAttractive=true`, `bg="light"` nếu false
- Nút Edit: `variant="outline-primary"`, `size="sm"` → gọi `onEdit(orchidId)`
- Nút Delete: `variant="outline-danger"`, `size="sm"` → gọi `onDelete(orchidId)`
- Hiển thị ảnh thumbnail nếu `orchidURL` có giá trị, `onError` ẩn ảnh lỗi
- Hiển thị message khi `orchids.length === 0`

**Checklist TODO-FE-08:**
- [ ] `Table` có `striped`, `bordered`, `hover`, `responsive`
- [ ] `thead` có `className="table-dark"`
- [ ] Đủ 8 cột: `#`, Image, Name, Category, Natural, Attractive, Description, Actions
- [ ] `key` prop dùng `o.orchidId` (không dùng index)
- [ ] Badge Natural: `success` / `secondary` đúng màu
- [ ] Badge Attractive: `warning` / `light` đúng màu
- [ ] Nút Edit gọi đúng `onEdit(o.orchidId)`
- [ ] Nút Delete gọi đúng `onDelete(o.orchidId)`
- [ ] Ảnh dùng `onError` để ẩn khi URL lỗi
- [ ] Hiển thị message khi list rỗng

**Commit:**
```bash
git add orchid-fe/src/components/OrchidTable.jsx
git commit -m "feat(table): implement OrchidTable with Badge, Image and edit/delete buttons"
```

---

### TODO-FE-09: `components/OrchidForm.jsx`

**Yêu cầu:**
- Props: `initialData`, `onSubmit`, `submitLabel`, `loading`
- `useState` lưu form state, `useEffect` sync khi `initialData` thay đổi
- Dùng `Form`, `Form.Group`, `Form.Label`, `Form.Control`, `Form.Check`, `Row`, `Col`, `Button` từ `react-bootstrap`
- `handleChange` xử lý đồng thời input text và checkbox
- Field `orchidName`: `required`, placeholder gợi ý
- Field `orchidDescription`: `as="textarea"`, `rows={3}`
- Field `orchidURL`: `type="url"`, preview ảnh ngay khi nhập URL hợp lệ
- Field `isNatural`, `isAttractive`: `Form.Check` kiểu `switch`
- Nút Submit: disabled khi `loading=true`, text đổi thành `"Đang lưu..."`

**Checklist TODO-FE-09:**
- [ ] `useState` khởi tạo từ `initialData ?? EMPTY_FORM`
- [ ] `useEffect` sync state khi `initialData` prop thay đổi
- [ ] `handleChange` xử lý `type === 'checkbox'` trả về `checked`, ngược lại trả về `value`
- [ ] `form.orchidName` dùng `Form.Control` với `required`
- [ ] `form.orchidCategory` dùng `Form.Control`
- [ ] `form.orchidDescription` dùng `Form.Control as="textarea"`
- [ ] `form.orchidURL` dùng `Form.Control type="url"`
- [ ] Preview ảnh hiển thị khi `form.orchidURL` có giá trị
- [ ] `isNatural` và `isAttractive` dùng `Form.Check type="switch"`
- [ ] Submit button disabled và đổi text khi `loading=true`
- [ ] `e.preventDefault()` trong `handleSubmit`

**Commit:**
```bash
git add orchid-fe/src/components/OrchidForm.jsx
git commit -m "feat(form): implement OrchidForm with react-bootstrap controls, image preview and loading state"
```

---

### TODO-FE-10: `components/ConfirmModal.jsx`

**Yêu cầu:**
- Dùng `Modal`, `Button` từ `react-bootstrap`
- Props: `show`, `onHide`, `onConfirm`, `orchidName`, `loading`
- `Modal` có `centered`
- Nội dung hiển thị tên orchid sắp xóa (`orchidName`) in đậm màu đỏ
- Nút "Hủy": `variant="secondary"`, gọi `onHide`
- Nút "Xóa": `variant="danger"`, gọi `onConfirm`
- Cả 2 nút disabled khi `loading=true`; nút Xóa đổi text khi `loading=true`

**Checklist TODO-FE-10:**
- [ ] Import `Modal`, `Button` từ `react-bootstrap`
- [ ] `Modal` có prop `show`, `onHide`, `centered`
- [ ] `Modal.Header` có `closeButton`
- [ ] `Modal.Body` hiển thị `orchidName` in đậm, màu đỏ (`className="text-danger"`)
- [ ] Nút Hủy: `variant="secondary"`, gọi `onHide`
- [ ] Nút Xóa: `variant="danger"`, gọi `onConfirm`
- [ ] Cả 2 nút có `disabled={loading}`
- [ ] Nút Xóa đổi text `"Đang xóa..."` khi `loading=true`
- [ ] Modal đóng được khi click nút Hủy hoặc nút X

**Commit:**
```bash
git add orchid-fe/src/components/ConfirmModal.jsx
git commit -m "feat(modal): implement ConfirmModal with loading state and danger confirm button"
```

---

### TODO-FE-11: `pages/HomePage.jsx`

**Yêu cầu:**
- Gọi `fetchOrchids()` trong `useEffect` khi component mount
- Hiển thị `Spinner` khi `loading=true`
- Hiển thị `Alert variant="danger"` khi `error` có giá trị
- Nút **"+ Add Orchid"** → navigate đến `/add`
- Nút **"Edit"** trong bảng → navigate đến `/edit/:id`
- Nút **"Delete"** trong bảng → mở `ConfirmModal`, lưu target vào state
- Sau khi xóa thành công: đóng modal, danh sách tự cập nhật (không cần fetch lại)
- Hỗ trợ 2 chế độ xem: Table view và Card view (toggle bằng `ButtonGroup`)

**Checklist TODO-FE-11:**
- [ ] `useEffect` gọi `fetchOrchids()` với dependency array `[fetchOrchids]`
- [ ] Lấy `orchids`, `loading`, `error`, `fetchOrchids`, `removeOrchid` từ `useOrchid()`
- [ ] `Spinner` hiển thị khi `loading=true`
- [ ] `Alert variant="danger"` hiển thị khi `error` có giá trị
- [ ] Nút "Add Orchid" navigate đến `/add`
- [ ] Nút "Edit" navigate đến `/edit/${id}`
- [ ] Nút "Delete" set `deleteTarget` → ConfirmModal mở
- [ ] `ConfirmModal` nhận đúng `show`, `onHide`, `onConfirm`, `orchidName`, `loading`
- [ ] `handleDelete` gọi `removeOrchid(id)`, đóng modal sau khi xong
- [ ] Toggle Table/Card view bằng `ButtonGroup` hoạt động đúng

**Commit:**
```bash
git add orchid-fe/src/pages/HomePage.jsx
git commit -m "feat(page): implement HomePage with list, spinner, error alert, delete modal and view toggle"
```

---

### TODO-FE-12: `pages/AddOrchidPage.jsx`

**Yêu cầu:**
- Render `<OrchidForm>` không có `initialData` (form rỗng)
- Khi submit: gọi `addOrchid(data)` từ context, **không** gọi trực tiếp axios
- Sau khi thành công: hiển thị `Alert variant="success"` + tự `navigate('/')` sau 1.5 giây
- Khi lỗi: hiển thị `Alert variant="danger"` với message
- Dùng `Breadcrumb` để điều hướng ngược lại Home
- Truyền `loading={saving}` vào `OrchidForm` để disable nút trong lúc submit

**Checklist TODO-FE-12:**
- [ ] `useOrchid()` cung cấp `addOrchid`
- [ ] `OrchidForm` render với `submitLabel="Add Orchid"`, không có `initialData`
- [ ] `handleSubmit` gọi `addOrchid(data)`, không gọi `createOrchid` axios trực tiếp
- [ ] State `saving` truyền vào `<OrchidForm loading={saving} />`
- [ ] Alert success hiển thị sau khi thêm thành công
- [ ] `navigate('/')` chạy sau 1.5 giây khi thành công
- [ ] Alert danger hiển thị khi API lỗi
- [ ] `Breadcrumb` có link quay về Home
- [ ] Trang có `maxWidth` giới hạn (khoảng 720px)

**Commit:**
```bash
git add orchid-fe/src/pages/AddOrchidPage.jsx
git commit -m "feat(page): implement AddOrchidPage with form submit, success alert and auto redirect"
```

---

### TODO-FE-13: `pages/EditOrchidPage.jsx`

**Yêu cầu:**
- Lấy `id` từ URL params bằng `useParams()`
- Gọi `getOrchidById(id)` khi mount để load dữ liệu hiện tại
- Khi chờ load: hiển thị `Spinner`
- Khi không tìm thấy orchid: hiển thị `Alert variant="danger"`
- Khi submit: gọi `editOrchid(id, data)` từ context
- Sau khi cập nhật thành công: Alert success + redirect về `/` sau 1.5 giây
- Truyền `initialData={orchid}` vào `OrchidForm` để form load đúng dữ liệu cũ

**Checklist TODO-FE-13:**
- [ ] `useParams()` lấy đúng `id`
- [ ] `useEffect` gọi `getOrchidById(id)` khi `id` thay đổi
- [ ] State `fetching` điều khiển Spinner
- [ ] Spinner hiển thị trong lúc load dữ liệu
- [ ] Alert danger khi API trả lỗi hoặc không tìm thấy orchid
- [ ] `OrchidForm` chỉ render sau khi `orchid !== null` (không render form rỗng)
- [ ] `OrchidForm` nhận `initialData={orchid}` — form hiển thị đúng dữ liệu cũ
- [ ] `handleSubmit` gọi `editOrchid(id, data)` từ context
- [ ] Alert success + `navigate('/')` sau 1.5 giây khi thành công
- [ ] `Breadcrumb` hiển thị đúng "Edit Orchid #[id]"

**Commit:**
```bash
git add orchid-fe/src/pages/EditOrchidPage.jsx
git commit -m "feat(page): implement EditOrchidPage loading orchid by id and update via context"
```

---

## 5. Checklist tổng thể trước khi nộp bài

### Kiến trúc

- [ ] BE: đủ 4 tầng phân tách rõ ràng — Entity → Repository → Service → Controller
- [ ] FE: tách biệt `components/`, `pages/`, `context/`, `reducers/`, `utils/`
- [ ] Không có logic business ở Controller (chỉ gọi Service)
- [ ] Không có SQL/JPA call trực tiếp ở Controller hoặc Service (qua Repository)
- [ ] FE không gọi axios trực tiếp ở component (qua `OrchidContext`)

### Bảo mật & cấu hình

- [ ] `application.properties` (có password) **không** có trong git history
- [ ] `.env` (có URL thật) **không** có trong git history
- [ ] `application.properties.example` và `.env.example` (có placeholder) đã commit
- [ ] CORS chỉ cho phép `http://localhost:5173`, không dùng wildcard `*`
- [ ] Không hardcode URL backend trong FE code

### Chất lượng code

- [ ] Không có `console.log` debug thừa trong code nộp
- [ ] Xử lý lỗi `try/catch` ở tất cả async function trong pages
- [ ] Không dùng `var`, ưu tiên `const` / `let`
- [ ] Không có warning ESLint quan trọng (`key` prop, unused variable)

### Git history

- [ ] Có ít nhất **13 commit** riêng biệt (6 BE + 7 FE core)
- [ ] Mỗi commit message đúng format `type(scope): subject`
- [ ] Không có commit kiểu "fix", "update", "done"
- [ ] Commit đầu tiên là `chore(config): init project` hoặc tương tự

### Chức năng

- [ ] BE: cả 5 endpoint hoạt động đúng — kiểm tra bằng Postman
- [ ] FE: danh sách load đúng từ API
- [ ] FE: thêm mới orchid → hiển thị trong danh sách
- [ ] FE: chỉnh sửa orchid → form load đúng dữ liệu cũ, cập nhật thành công
- [ ] FE: xóa orchid → modal xác nhận, danh sách cập nhật sau khi xóa
- [ ] FE: điều hướng giữa 3 trang hoạt động đúng (NavBar, Breadcrumb, redirect)
- [ ] FE: Bootstrap style áp dụng đúng — NavBar dark, Table striped, Badge màu đúng
- [ ] FE: Spinner hiển thị khi đang load, Alert khi lỗi

### Nộp bài

- [ ] Push code lên GitHub Classroom đúng repo
- [ ] Đính kèm **screenshot Postman** test đủ 5 endpoint (với request body và response)
- [ ] Đính kèm **screenshot giao diện React**: trang Home (Table view), Add, Edit, Modal xóa

---

> ⏰ **Deadline:** theo thông báo của giảng viên trên hệ thống.  
> ❓ **Hỏi đáp:** đặt câu hỏi trên GitHub Issues của repo assignment.
