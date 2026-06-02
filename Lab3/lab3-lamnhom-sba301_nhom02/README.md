[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/CmNwCNIW)
# SBA301 — Bài Tập Thực Hành ReactJS
# SBA301_Nhom02_Lab3
 
| MSSV     | Họ tên           | GitHub           | Vai trò |
|----------|------------------|------------------|---------|
| DE190353 | Trần Quang Huy   | @tranquanghuyit101-a      | Leader  |
| DE190010 | Nguyễn Ngọc Khôi | @Psasvirgo139-b  | Dev     |
| DE191079 | Phan Thanh Hưng  | @hungkizsp-c     | Dev     |


**Chủ đề:** useState & React Router DOM | **Tổng điểm:** 100đ

---

## Cài Đặt & Chạy

```bash
npm install
npm run dev        # Chạy ứng dụng tại http://localhost:5173
npm test           # Chạy toàn bộ test
npm run test:watch # Chạy test ở chế độ watch
```

---

## Cấu Trúc Thư Mục

```
src/
├── data/                    # Dữ liệu mẫu (KHÔNG SỬA)
│   ├── products.js
│   ├── students.js
│   ├── books.js
│   └── blogPosts.js
├── exercises/
│   ├── Exercise01/Counter.jsx
│   ├── Exercise02/TodoList.jsx
│   ├── Exercise03/ProductFilter.jsx
│   ├── Exercise04/RegistrationForm.jsx
│   ├── Exercise05/ShoppingCart.jsx
│   ├── Exercise06/StudentManagement.jsx
│   ├── Exercise07/           (AppRouter + pages + components)
│   ├── Exercise08/           (AppRouter + pages)
│   ├── Exercise09/           (AppRouter + pages)
│   └── Exercise10/           (AppRouter + pages + components + utils)
public/
└── images/                  # Đặt ảnh vào đây
    ├── products/
    ├── books/
    └── blog/
tests/                       # Hidden tests — KHÔNG SỬA
```

---

## Danh Sách Bài Tập

### Bài 01 — Counter `(5đ)` ★☆☆☆☆

**File:** `src/exercises/Exercise01/Counter.jsx`

| # | TODO |
|---|------|
| 1 | Khai báo state `count` với giá trị khởi tạo là `0` |
| 2 | Khai báo hàm `increment` — tăng `count` lên 1 |
| 3 | Khai báo hàm `decrement` — giảm `count` xuống 1, **không cho phép** `count < 0` |
| 4 | Khai báo hàm `reset` — đặt `count` về `0` |
| 5 | Hiển thị giá trị `count` trong `<h1 data-testid="counter-value">` |
| 6 | Gắn sự kiện `onClick` cho 3 nút với `data-testid`: `decrement-btn`, `reset-btn`, `increment-btn` |
| 7 | Hiển thị `<Badge data-testid="counter-status">`: `"Bắt đầu"` khi `= 0`, `"Đang chạy"` khi `> 0`, `"Cao"` khi `>= 10` |

---

### Bài 02 — Todo List `(8đ)` ★★☆☆☆

**File:** `src/exercises/Exercise02/TodoList.jsx`

| # | TODO |
|---|------|
| 1 | Khai báo state `todos` (mảng rỗng). Cấu trúc mỗi todo: `{ id, text, completed }` |
| 2 | Khai báo state `inputValue` (chuỗi rỗng) |
| 3 | Hàm `addTodo`: kiểm tra không rỗng → thêm vào mảng → reset input |
| 4 | Hàm `toggleTodo(id)`: đảo ngược `completed` của todo tương ứng |
| 5 | Hàm `deleteTodo(id)`: lọc bỏ todo có id khỏi mảng |
| 6 | Tính `completedCount` và `pendingCount` |
| 7 | Bind `value` và `onChange` cho `<Form.Control data-testid="todo-input">` |
| 8 | Gọi `addTodo` khi nhấn `Enter` (sự kiện `onKeyDown`) |
| 9 | Gọi `addTodo` khi nhấn `<Button data-testid="add-btn">` |
| 10 | Hiển thị badges: `data-testid="total-count"`, `"completed-count"`, `"pending-count"` |
| 11 | Hiển thị `<Alert data-testid="empty-message">` khi `todos` rỗng |
| 12 | Render mỗi todo: `data-testid="todo-item-{id}"`, checkbox `data-testid="toggle-{id}"`, nút xóa `data-testid="delete-btn-{id}"`, gạch chân text khi completed |

---

### Bài 03 — Product Filter `(8đ)` ★★☆☆☆

**File:** `src/exercises/Exercise03/ProductFilter.jsx`

| # | TODO |
|---|------|
| 1 | Khai báo state `selectedCategory` khởi tạo `'Tất cả'` |
| 2 | Khai báo state `searchQuery` khởi tạo `''` |
| 3 | Tính `filteredProducts`: lọc theo `selectedCategory` rồi lọc tiếp theo `searchQuery` (không phân biệt hoa thường) |
| 4 | Bind `value` và `onChange` cho `<Form.Control data-testid="search-input">` |
| 5 | Render nút lọc từ `categories`: `data-testid="filter-{category}"`, active khi là category đang chọn |
| 6 | Hiển thị `<Badge data-testid="product-count">Tìm thấy X sản phẩm</Badge>` |
| 7 | Hiển thị thông báo khi `filteredProducts` rỗng |
| 8 | Render mỗi sản phẩm: `<Card data-testid="product-card-{id}">` với ảnh, tên, giá, danh mục |

---

### Bài 04 — Registration Form `(10đ)` ★★★☆☆

**File:** `src/exercises/Exercise04/RegistrationForm.jsx`

| # | TODO |
|---|------|
| 1 | Khai báo state `formData` khởi tạo `EMPTY_FORM` |
| 2 | Khai báo state `errors` khởi tạo `EMPTY_ERRORS` |
| 3 | Khai báo state `submitted` khởi tạo `false` |
| 4 | Hàm `handleChange(e)`: cập nhật `formData` và xóa lỗi field tương ứng |
| 5 | Hàm `validate()`: trả về object lỗi (name ≥ 2 ký tự; email chứa `@` và `.`; phone đúng 10 chữ số; age từ 16–60) |
| 6 | Hàm `handleSubmit(e)`: gọi `validate()` → cập nhật `errors` → nếu không lỗi thì `submitted = true` |
| 7 | Hàm `handleReset()`: reset về trạng thái ban đầu |
| 8 | Gắn `isInvalid`, `value`, `onChange` cho 4 `<Form.Control>`: `data-testid` là `name-input`, `email-input`, `phone-input`, `age-input` |
| 9 | Thêm `<Form.Control.Feedback type="invalid">` với `data-testid`: `name-error`, `email-error`, `phone-error`, `age-error` |
| 10 | Hiển thị `<Alert data-testid="success-message">` khi `submitted === true`, ẩn form |

---

### Bài 05 — Shopping Cart `(12đ)` ★★★☆☆

**File:** `src/exercises/Exercise05/ShoppingCart.jsx`

| # | TODO |
|---|------|
| 1 | Hàm `addToCart(product)`: nếu đã có trong cart → tăng qty; chưa có → thêm mới `{ ...product, quantity: 1 }` |
| 2 | Hàm `removeFromCart(id)`: xóa item có id khỏi cart |
| 3 | Hàm `increaseQty(id)`: tăng qty của item lên 1 |
| 4 | Hàm `decreaseQty(id)`: qty = 1 → xóa; qty > 1 → giảm 1 |
| 5 | Hiển thị `cartItemCount` trong `<Badge data-testid="cart-count">` (thay số `0` cứng) |
| 6 | Gắn `onClick={() => addToCart(product)}` cho `<Button data-testid="add-to-cart-{id}">` |
| 7 | Hiển thị `<Alert>` khi `cart` rỗng |
| 8 | Render mỗi cart item: `data-testid="cart-item-{id}"`, nút tăng/giảm `data-testid="increase-qty-{id}"` / `"decrease-qty-{id}"`, số qty `data-testid="quantity-{id}"`, xóa `data-testid="remove-from-cart-{id}"` |
| 9 | Hiển thị `cartTotal.toLocaleString('vi-VN') + 'đ'` trong `<span data-testid="cart-total">` |
| — | `cart` state, `cartTotal`, `cartItemCount` đã được cung cấp sẵn |

---

### Bài 06 — Student Management `(15đ)` ★★★★☆

**File:** `src/exercises/Exercise06/StudentManagement.jsx`

| # | TODO |
|---|------|
| 1 | Khai báo state `students` khởi tạo `initialStudents` |
| 2 | Khai báo state `showModal` khởi tạo `false` |
| 3 | Khai báo state `editingId` khởi tạo `null` |
| 4 | Khai báo state `formData` khởi tạo `EMPTY_FORM` |
| 5 | Khai báo state `filterClass` khởi tạo `'Tất cả'` |
| 6 | Khai báo state `formError` khởi tạo `''` |
| 7 | Hàm `openAddModal()`: reset form, đặt `editingId = null`, mở modal |
| 8 | Hàm `openEditModal(student)`: điền form từ student, đặt `editingId = student.id`, mở modal |
| 9 | Hàm `handleSave()`: validate GPA (0.0–4.0) → thêm mới hoặc cập nhật → đóng modal |
| 10 | Hàm `deleteStudent(id)`: `window.confirm` → lọc bỏ student |
| 11 | Tính `filteredStudents` theo `filterClass` |
| 12 | Render bảng sinh viên: mỗi hàng `data-testid="student-row-{id}"`, nút sửa `"edit-btn-{id}"`, xóa `"delete-btn-{id}"` |
| 13 | Modal title: `"Thêm Sinh Viên"` hoặc `"Sửa Sinh Viên"` tùy `editingId` |
| 14 | Hiển thị `formError` trong `<Alert>` khi lỗi |
| 15 | Bind đầy đủ các `Form.Control` trong modal với `formData` và `onChange` |

---

### Bài 07 — Basic Routing `(12đ)` ★★★☆☆

**Files:**
- `src/exercises/Exercise07/AppRouter.jsx`
- `src/exercises/Exercise07/components/NavBar.jsx`
- `src/exercises/Exercise07/pages/Home.jsx`

| # | TODO |
|---|------|
| 1 | `AppRouter.jsx`: Bọc trong `<MemoryRouter>`, render `<NavBar>` và `<Routes>` |
| 2 | `AppRouter.jsx`: Định nghĩa 3 Route: `"/"` → Home, `"/about"` → About, `"/contact"` → Contact |
| 3 | `NavBar.jsx`: Thêm 3 `<NavLink>` với `data-testid`: `"nav-home"`, `"nav-about"`, `"nav-contact"` |
| 4 | `NavBar.jsx`: className active khi NavLink tương ứng đang active |
| 5 | `Home.jsx`: Khai báo `navigate` bằng `useNavigate()` |
| 6 | `Home.jsx`: Nút `data-testid="go-to-about-btn"` → `navigate('/about')` |
| 7 | `Home.jsx`: Nút `data-testid="go-to-contact-btn"` → `navigate('/contact')` |

**data-testid cần có:**
`home-page`, `about-page`, `contact-page`, `nav-home`, `nav-about`, `nav-contact`, `go-to-about-btn`, `go-to-contact-btn`

---

### Bài 08 — Dynamic Routes `(10đ)` ★★★★☆

**Files:**
- `src/exercises/Exercise08/AppRouter.jsx`
- `src/exercises/Exercise08/pages/ProductList.jsx`
- `src/exercises/Exercise08/pages/ProductDetail.jsx`
- `src/exercises/Exercise08/pages/NotFound.jsx`

| # | TODO |
|---|------|
| 1 | `AppRouter.jsx`: Bọc trong `<MemoryRouter>`, định nghĩa 4 Route bao gồm `"/products/:id"` và `"*"` |
| 2 | `ProductList.jsx`: Thêm liên kết đến `/products/{id}` với `data-testid="product-link-{id}"` cho mỗi sản phẩm |
| 3 | `ProductDetail.jsx`: Dùng `useParams()` lấy `id` từ URL |
| 4 | `ProductDetail.jsx`: Dùng `useNavigate()` và điều hướng đến `'/404'` nếu không tìm thấy sản phẩm |
| 5 | `ProductDetail.jsx`: Render thông tin sản phẩm trong `<Container data-testid="product-detail">` |
| 6 | `ProductDetail.jsx`: Nút `data-testid="back-btn"` → `navigate(-1)` |
| 7 | `NotFound.jsx`: Render trang 404 trong `<Container data-testid="not-found-page">` |
| 8 | `NotFound.jsx`: Nút `data-testid="go-home-btn"` → `navigate('/')` |

---

### Bài 09 — Blog & Search Params `(10đ)` ★★★★☆

**Files:**
- `src/exercises/Exercise09/AppRouter.jsx`
- `src/exercises/Exercise09/pages/BlogList.jsx`
- `src/exercises/Exercise09/pages/BlogDetail.jsx`

| # | TODO |
|---|------|
| 1 | `AppRouter.jsx`: Bọc trong `<MemoryRouter>`, định nghĩa 2 Route: `"/"` và `"/blog/:id"` |
| 2 | `BlogList.jsx`: Khai báo `searchParams, setSearchParams` bằng `useSearchParams()` |
| 3 | `BlogList.jsx`: Đọc `activeCategory = searchParams.get('category') \|\| 'Tất cả'` |
| 4 | `BlogList.jsx`: Tính `filteredPosts` dựa trên `activeCategory` |
| 5 | `BlogList.jsx`: Hàm `handleCategoryChange(cat)`: cập nhật search params |
| 6 | `BlogList.jsx`: Nút lọc `data-testid="blog-category-{cat}"` với variant active/inactive |
| 7 | `BlogList.jsx`: `<div data-testid="active-category">` hiển thị danh mục và số bài viết |
| 8 | `BlogList.jsx`: Render bài viết `data-testid="blog-post-{id}"`, link `data-testid="blog-link-{id}"` |
| 9 | `BlogDetail.jsx`: `useParams()` → tìm bài viết → render `data-testid="blog-detail"`, `"post-title"`, `"post-content"` |
| 10 | `BlogDetail.jsx`: Nút `data-testid="back-to-blog-btn"` → `navigate(-1)` |

---

### Bài 10 — Book Management Full App `(10đ)` ★★★★★

**Files:**
- `src/exercises/Exercise10/AppRouter.jsx`
- `src/exercises/Exercise10/components/NavBar.jsx`
- `src/exercises/Exercise10/pages/Dashboard.jsx`
- `src/exercises/Exercise10/pages/BookList.jsx`
- `src/exercises/Exercise10/pages/BookForm.jsx`
- `src/exercises/Exercise10/pages/BookDetail.jsx`

> **Gợi ý:** Dùng `getBooksFromStorage()` và `saveBooksToStorage()` từ `utils/storage.js` để lưu trữ state.

| # | TODO |
|---|------|
| 1 | `AppRouter.jsx`: Bọc trong `<MemoryRouter>`, render NavBar, định nghĩa 5 Route: `"/"`, `"/books"`, `"/books/new"`, `"/books/edit/:id"`, `"/books/:id"` |
| 2 | `NavBar.jsx`: 3 NavLink với `data-testid`: `"nav-dashboard"`, `"nav-books"`, `"nav-add-book"` |
| 3 | `Dashboard.jsx`: Đọc books từ storage, tính và hiển thị 4 thống kê: `data-testid` là `"stat-total"`, `"stat-available"`, `"stat-unavailable"`, `"stat-genres"` |
| 4 | `BookList.jsx`: State `books`, `searchQuery`, `selectedGenre`; tính `filteredBooks` |
| 5 | `BookList.jsx`: Hàm `deleteBook(id)`: xác nhận → xóa → lưu storage |
| 6 | `BookList.jsx`: Render bảng: `data-testid="book-row-{id}"`, `"view-book-{id}"`, `"edit-book-{id}"`, `"delete-book-{id}"` |
| 7 | `BookList.jsx`: Search `data-testid="search-books"`, genre filter `data-testid="genre-filter"` |
| 8 | `BookForm.jsx`: `useParams()` → nếu có `id` thì Edit, không có thì Add |
| 9 | `BookForm.jsx`: `useEffect` khi Edit: đọc storage, tìm book theo id, điền form |
| 10 | `BookForm.jsx`: Hàm `handleSubmit`: validate → lưu storage → `navigate('/books')` |
| 11 | `BookForm.jsx`: Render form trong `<Card data-testid="book-form">`, nút `data-testid="save-book-btn"` |
| 12 | `BookDetail.jsx`: `useParams()` → đọc storage → render chi tiết trong `data-testid="book-detail-page"`, `"book-detail-title"` |

---

## Quy Tắc Quan Trọng

1. **Không được xóa `data-testid` attributes** đã có trong template — tests cần chúng để chấm điểm.
2. **Không được sửa** file trong thư mục `src/data/` và `tests/`.
3. **Không được sửa** `vite.config.js`, `package.json`, `.github/`.
4. **Được phép** thêm CSS, thêm component, thêm file mới khi cần.
5. **Commit và push** sau khi hoàn thành để trigger CI/CD chấm điểm.
