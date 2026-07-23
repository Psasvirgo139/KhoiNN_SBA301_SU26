[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Hnn5h9oD)
# Restaurant Management — Progress Test 2 - created by traltb@fe.edu.vn

## Mục tiêu

Xây dựng ứng dụng **Restaurant Management** với React JS + React Bootstrap + Axios kết nối REST API (port 8080). Sinh viên cần hoàn tất toàn bộ TODOs để **pass tất cả automated test cases**.

## Thông tin sinh viên
Mã SV | Họ tên | Email | Link Github
|----------|------------------|-------------------------------|-------------|
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Psasvirgo139](https://github.com/Psasvirgo139) | 


## Cài đặt & Chạy

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # chạy tất cả tests
npm run test:watch # chạy tests ở chế độ watch
```

> **Yêu cầu:** API server phải chạy tại `http://localhost:8080` trước khi dùng app.

---

## Cấu trúc thư mục

```
useContext-json-progressTest/
├── db.json                        ← dữ liệu mẫu (tham khảo, dùng với json-server)
├── jsconfig.json                  ← [CÓ SẴN] path alias config
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                    ← [CÓ SẴN] routing BrowserRouter
    ├── main.jsx                   ← [CÓ SẴN] entry point + AuthProvider
    ├── constants/
    │   └── messages.js            ← [CÓ SẴN] MS01–MS08
    ├── context/                   ← [CÓ SẴN] AuthContext + AuthProvider
    ├── hooks/                     ← [CÓ SẴN] useAuth
    ├── services/
    │   ├── restaurantService.js   ← [TODO] getRestaurants, getRestaurantById, addRestaurant, deleteRestaurant
    │   └── categoryService.js     ← [TODO] getCategories
    ├── utils/
    │   └── validators.js          ← [TODO] toàn bộ validation logic
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx         ← [TODO] logo + title + ngày
    │   │   └── Footer.jsx         ← [CÓ SẴN]
    │   └── restaurant/
    │       ├── RestaurantFilter.jsx ← [TODO] handleSubmit → gọi onFilter
    │       ├── RestaurantTable.jsx  ← [TODO] map rows, No records
    │       ├── DeleteModal.jsx      ← [TODO] confirm message + handlers
    │       └── Pagination.jsx       ← [TODO] hide khi 1 trang, handlers
    ├── pages/
    │   ├── LoginPage.jsx           ← [CÓ SẴN]
    │   ├── RestaurantListPage.jsx  ← [TODO] loadData, handleFilter, handleDeleteConfirm
    │   ├── RestaurantDetailPage.jsx← [TODO] loadRestaurant
    │   └── AddNewRestaurantPage.jsx← [TODO] loadCategories, handleSubmit + validate
    └── __tests__/                  ← [CÓ SẴN - KHÔNG CHỈNH SỬA]
        ├── utils/
        │   └── validators.test.js
        ├── services/
        │   ├── restaurantService.test.js
        │   └── categoryService.test.js
        ├── components/restaurant/
        │   ├── RestaurantFilter.test.jsx
        │   ├── RestaurantTable.test.jsx
        │   ├── DeleteModal.test.jsx
        │   └── Pagination.test.jsx
        └── pages/
            ├── RestaurantListPage.test.jsx
            ├── AddNewRestaurantPage.test.jsx
            └── RestaurantDetailPage.test.jsx
```

> **Quy tắc:** Không chỉnh sửa các file trong `__tests__/`, `constants/messages.js`, `context/`, `hooks/`, `App.jsx`, `main.jsx`.

---

## API Endpoints (port 8080)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/restaurants` | Lấy tất cả restaurants |
| `GET` | `/restaurants/:id` | Lấy chi tiết 1 restaurant |
| `POST` | `/restaurants` | Tạo mới restaurant |
| `DELETE` | `/restaurants/:id` | Xóa restaurant |
| `GET` | `/categories` | Lấy danh sách categories |

---

## Message List

| ID | Nội dung | Ghi chú |
|---|---|---|
| MS01 | `<X> is required.` | X = tên field |
| MS02 | `<X> must be greater than or equal <Y> and less than or equal <Z>` | |
| MS03 | `The input value is invalid format date.` | |
| MS04 | `Created new restaurant successfully` | Màu xanh |
| MS05 | `Internal system error, please contact with administrator` | Màu đỏ |
| MS06 | `The input date must not be in future` | |
| MS07 | `The input date must be before <Y>` | |
| MS08 | `Deleted successfully` | Màu xanh |

---

## Hướng dẫn từng bước — TODOs

### Bước 1 — `src/services/restaurantService.js`

Implement 4 hàm gọi axios:

```js
// TODO-1a: getRestaurants()
const response = await axios.get(`${BASE_URL}/restaurants`)
return response.data

// TODO-1b: getRestaurantById(id)
const response = await axios.get(`${BASE_URL}/restaurants/${id}`)
return response.data

// TODO-1c: addRestaurant(data)
const response = await axios.post(`${BASE_URL}/restaurants`, data)
return response.data

// TODO-1d: deleteRestaurant(id)
await axios.delete(`${BASE_URL}/restaurants/${id}`)
```

✅ **Test:** `restaurantService.test.js` (4 tests)

---

### Bước 2 — `src/services/categoryService.js`

```js
// TODO-2: getCategories()
const response = await axios.get(`${BASE_URL}/categories`)
return response.data
```

✅ **Test:** `categoryService.test.js` (2 tests)

---

### Bước 3 — `src/utils/validators.js`

Implement 7 hàm validate + 1 hàm tổng hợp. Mỗi hàm trả về `null` (hợp lệ) hoặc `string` (message lỗi).

| Hàm | Rule |
|---|---|
| `validateName(value)` | Bắt buộc (MS01), max 100 ký tự |
| `validatePrice(value, fieldName)` | Bắt buộc (MS01), số nguyên, 1000–999999 (MS02) |
| `validatePriceRange(from, to)` | to > from |
| `validateOpenDate(value)` | Bắt buộc (MS01), format yyyy-MM-dd (MS03), không tương lai (MS06) |
| `validateOwner(value)` | Bắt buộc (MS01), max 100 ký tự |
| `validateAddress(value)` | Bắt buộc (MS01), max 100 ký tự |
| `validateCategory(value)` | Bắt buộc (MS01) |
| `validateRestaurantForm(formData)` | Gọi tất cả hàm trên, trả về `errors` object |

✅ **Test:** `validators.test.js` (30 tests)

---

### Bước 4 — `src/components/layout/Header.jsx`

```jsx
// TODO-4: Lấy ngày hiện tại, hiển thị "Date: yyyy-MM-dd"
const today = new Date().toISOString().split('T')[0]
```

---

### Bước 5 — `src/components/restaurant/RestaurantFilter.jsx`

```jsx
// TODO-5: Gọi onFilter khi submit
const handleSubmit = (e) => {
  e.preventDefault()
  onFilter({ name, category })
}
```

✅ **Test:** `RestaurantFilter.test.jsx` (8 tests)

---

### Bước 6 — `src/components/restaurant/RestaurantTable.jsx`

```jsx
// TODO-6a: Hiển thị "No records found" khi mảng rỗng
{restaurants.length === 0 ? <p>No records found</p> : <Table>...</Table>}

// TODO-6b: Map restaurants → rows
// TODO-6c: Delete button gọi onDelete(restaurant)
// TODO-6d: View button navigate(`/restaurants/${r.id}`)
```

✅ **Test:** `RestaurantTable.test.jsx` (9 tests)

---

### Bước 7 — `src/components/restaurant/DeleteModal.jsx`

```jsx
// TODO-7: Hiển thị tên restaurant trong confirmation message
// Modal chứa: tên restaurant, nút Yes (gọi onConfirm), nút Close (gọi onClose)
```

✅ **Test:** `DeleteModal.test.jsx` (8 tests)

---

### Bước 8 — `src/components/restaurant/Pagination.jsx`

```jsx
// TODO-8a: Return null khi totalPages <= 1
if (totalPages <= 1) return null

// TODO-8b: Tính recordFrom, recordTo
// TODO-8c: Render Previous (disabled ở trang 1) + số trang + Next (disabled ở trang cuối)
// TODO-8d: onClick mỗi trang gọi onPageChange(page)
```

✅ **Test:** `Pagination.test.jsx` (7 tests)

---

### Bước 9 — `src/pages/RestaurantListPage.jsx`

```jsx
// TODO-9a: loadData() — Promise.all([getRestaurants(), getCategories()])
//          Sort restaurants theo name ascending
//          setRestaurants, setFiltered, setCategories
//          Catch → setErrorMsg(MESSAGES.MS05)

// TODO-9b: handleFilter({ name, category })
//          Filter restaurants: name contains (case-insensitive), category exact match
//          Sort kết quả theo name ascending
//          setFiltered(result), setCurrentPage(1)

// TODO-9c: handleDeleteClick(restaurant)
//          setSelectedRestaurant(restaurant), setShowModal(true)

// TODO-9d: handleDeleteConfirm()
//          setShowModal(false)
//          await deleteRestaurant(selectedRestaurant.id)
//          setSuccessMsg(MESSAGES.MS08)
//          loadData() — refresh
//          Catch → setErrorMsg(MESSAGES.MS05)
```

✅ **Test:** `RestaurantListPage.test.jsx` (8 tests)

---

### Bước 10 — `src/pages/RestaurantDetailPage.jsx`

```jsx
// TODO-10: loadRestaurant()
//          const data = await getRestaurantById(id)
//          setRestaurant(data)
//          Catch → setErrorMsg(MESSAGES.MS05)
```

✅ **Test:** `RestaurantDetailPage.test.jsx` (9 tests)

---

### Bước 11 — `src/pages/AddNewRestaurantPage.jsx`

```jsx
// TODO-11a: loadCategories()
//           const data = await getCategories()
//           setCategories(data)
//           Catch → setErrorMsg(MESSAGES.MS05)

// TODO-11b: handleSubmit()
//           const validationErrors = validateRestaurantForm(formData)
//           const hasErrors = Object.values(validationErrors).some(v => v !== null)
//           if (hasErrors) { setErrors(validationErrors); return }
//           await addRestaurant(formData)
//           setSuccessMsg(MESSAGES.MS04)
//           Reset form
//           Catch → setErrorMsg(MESSAGES.MS05)
```

✅ **Test:** `AddNewRestaurantPage.test.jsx` (11 tests)

---

## Screen Definitions

### Screen 1 — Restaurant List

| # | Field | Type | Mô tả |
|---|---|---|---|
| 1 | Restaurant Name | Text filter | Lọc theo tên (chứa, không phân biệt hoa thường) |
| 2 | Category | Dropdown | Lọc chính xác theo category |
| 3 | Restaurant List | Table | Hiển thị kết quả, sắp xếp theo name ASC |
| 4 | Add New | Button | Chuyển đến Screen 4 |
| 5 | Filter | Button | Thực hiện lọc |
| 6 | View | Link | Chuyển đến Screen 3 |
| 7 | Delete | Link | Mở confirmation dialog (Screen 2) |

**Yêu cầu:**
- Hiển thị tất cả restaurants khi mới vào trang
- Phân trang khi > PAGE_SIZE (5) bản ghi — ẩn pagination khi chỉ 1 trang
- Hiển thị `"No records found"` khi không có kết quả
- "Show x–y of z records" khi có phân trang

### Screen 2 — Confirmation Dialog

- Tiêu đề: "Confirmation"
- Nội dung: `Are you sure you want to delete the restaurant "<tên>"?`
- Nút **Yes** → gọi DELETE API → hiện MS08 → refresh list
- Nút **Close** → đóng modal

### Screen 3 — View Details

Hiển thị: Restaurant Name, Owner name, Category, Price range (đ), Address, Open Date.

### Screen 4 — Add New Restaurant

| # | Field | Validation |
|---|---|---|
| 1 | Restaurant Name | Bắt buộc, max 100, không trùng |
| 2 | Price from | Bắt buộc, số nguyên, 1000–999999 |
| 3 | Price to | Bắt buộc, số nguyên, 1000–999999, > Price from |
| 4 | Owner name | Bắt buộc, max 100 |
| 5 | Open Date | Bắt buộc, yyyy-MM-dd, không tương lai |
| 6 | Address | Bắt buộc, max 100 |
| 7 | Category | Bắt buộc, chọn từ dropdown API |

**Sau khi Save thành công:** hiện MS04 (xanh)  
**Lỗi API:** hiện MS05 (đỏ)  
**Validation lỗi:** hiện inline bên dưới từng field (đỏ)

---

## UI/UX Requirements

1. Layout theo đề thi: Header (Logo + "Restaurant Management" + Date) — Content — Footer ("@2026 FPT University")
2. Validation error: bên dưới field, màu đỏ
3. System error / success: bên dưới tiêu đề trang
4. Không dùng `alert()` — dùng Alert component của React Bootstrap
5. Tên component, function, variable phải rõ nghĩa
6. Dùng React bootstrap components

---

## Tài khoản đăng nhập (local test)

| Username | Password | Role |
|---|---|---|
| admin | 123 | admin |
| user | 123 | user |

---

## Chạy API local với json-server

```bash
npx json-server --watch db.json --port 8080
```

---

## Kiểm tra kết quả

```bash
npm test
```

Output mong đợi:

```
✓ src/__tests__/utils/validators.test.js                        (30 tests)
✓ src/__tests__/services/restaurantService.test.js              (6 tests)
✓ src/__tests__/services/categoryService.test.js                (2 tests)
✓ src/__tests__/components/restaurant/RestaurantFilter.test.jsx (8 tests)
✓ src/__tests__/components/restaurant/RestaurantTable.test.jsx  (9 tests)
✓ src/__tests__/components/restaurant/DeleteModal.test.jsx      (8 tests)
✓ src/__tests__/components/restaurant/Pagination.test.jsx       (7 tests)
✓ src/__tests__/pages/RestaurantListPage.test.jsx               (8 tests)
✓ src/__tests__/pages/AddNewRestaurantPage.test.jsx             (11 tests)
✓ src/__tests__/pages/RestaurantDetailPage.test.jsx             (9 tests)

Test Files  10 passed (10)
Tests      98 passed (98)
```

---

## Tham khảo

- [React Router v6](https://reactrouter.com/en/main)
- [Axios](https://axios-http.com/docs/intro)
- [React Bootstrap](https://react-bootstrap.netlify.app/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
