# TODOs — Hướng dẫn làm bài SBA301 PE Trial (SMS — Shoes Management)

> Đề: Xây dựng frontend ReactJS + React-Bootstrap + axios kết nối RESTful API Spring Boot (port 8080).
> Thời gian: 90 phút. Làm theo đúng thứ tự dưới đây.

---

## TODO-00 — Chạy backend trước (5 phút)

1. Mở SQL Server, tạo database `SBA301_2026_PE` (nếu chưa có):
   ```sql
   CREATE DATABASE SBA301_2026_PE;
   ```
2. Mở project `SBA301_2026_PETrial` bằng IntelliJ/VS Code.
3. Sửa `src/main/resources/application.properties` — **đề bắt buộc DB name = SBA301_2026_PE, user/pass = sa/sa**:
   ```properties
   spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SBA301_2026_PE;encrypt=false;trustServerCertificate=false
   spring.datasource.username=sa
   spring.datasource.password=sa
   ```
4. **Thêm CORS cho backend** (yêu cầu bắt buộc "Add codes for backend to allow connection from Frontend"). Tạo file `src/main/java/fu/sba301/pe2026/config/CorsConfig.java`:
   ```java
   package fu.sba301.pe2026.config;

   import org.springframework.context.annotation.Configuration;
   import org.springframework.web.servlet.config.annotation.CorsRegistry;
   import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

   @Configuration
   public class CorsConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
                   .allowedOrigins("http://localhost:5173")
                   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
       }
   }
   ```
5. Chạy backend, kiểm tra: mở `http://localhost:8080/swagger-ui.html` hoặc gọi thử `http://localhost:8080/api/categories` — phải trả về 5 category (Sport, Casual, Formal, Running, Basketball). Data mẫu 10 đôi giày tự sinh khi chạy lần 2 (chạy lại app nếu bảng shoes rỗng).

**API contract (đã đọc từ code backend):**

| Method | URL                                                 | Ghi chú                                                                                           |
| ------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/api/shoes/search?name=&category=&page=0&size=5` | Trả`PageResponse`: `{content, currentPage, pageSize, totalElements, totalPages, first, last}` |
| GET    | `/api/shoes/{id}`                                 | Chi tiết 1 shoes                                                                                  |
| POST   | `/api/shoes`                                      | Body:`{shoesName, price, quantity, manufacturer, productionDate, importDate, categoryId}`        |
| DELETE | `/api/shoes/{id}`                                 | Xóa                                                                                               |
| GET    | `/api/categories`                                 | `[{id, categoryName, description}]`                                                              |

Lưu ý: tham số `category` của search là **tên category** (không phải id). Mỗi phần tử `content`: `{shoesId, shoesName, price, quantity, manufacturer, productionDate, importDate, categoryName}`.

---

## TODO-01 — Tạo project Vite (10 phút, cần Internet trong 10 phút đầu)

```bash
npm create vite@latest <ClassName>_<StudentID>_SMS_PE -- --template react
cd <ClassName>_<StudentID>_SMS_PE
npm install
npm install react-router-dom react-bootstrap bootstrap axios
```

Ví dụ: `SE1701_SE180001_SMS_PE`. **Tên sai convention = 0 điểm.**

Không cài thêm bất kỳ thư viện nào khác (yêu cầu 3.3).

---

## TODO-02 — Cấu hình bắt buộc (5 phút) ⚠️ Sai = 0 điểm

1. **`vite.config.js`** — cố định port 5173:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: { port: 5173 },
   })
   ```
2. **Tạo `jsconfig.json`** ở gốc project — copy nguyên văn từ đề (yêu cầu 3.8):
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "*": ["../../node_modules/*"]
       }
     }
   }
   ```
3. **`src/main.jsx`** — import Bootstrap CSS + BrowserRouter:
   ```jsx
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import { BrowserRouter } from 'react-router-dom'
   import 'bootstrap/dist/css/bootstrap.min.css'
   import App from './App'

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <BrowserRouter>
         <App />
       </BrowserRouter>
     </React.StrictMode>,
   )
   ```
4. Xóa `src/App.css`, `src/index.css` và các import của chúng (tránh CSS mặc định phá layout). Chạy `npm run dev` — phải mở được `http://localhost:5173/`.

---

## TODO-03 — Service layer: `src/services/shoesService.js` (5 phút)

Tất cả lời gọi axios gom vào 1 file:

```js
import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const searchShoes = async (name, category, page = 0, size = 5) => {
  const params = { page, size }
  if (name) params.name = name
  if (category) params.category = category
  const res = await axios.get(`${API_BASE}/shoes/search`, { params })
  return res.data
}

export const getShoesById = async (id) => {
  const res = await axios.get(`${API_BASE}/shoes/${id}`)
  return res.data
}

export const createShoes = async (shoes) => {
  const res = await axios.post(`${API_BASE}/shoes`, shoes)
  return res.data
}

export const deleteShoes = async (id) => {
  await axios.delete(`${API_BASE}/shoes/${id}`)
}

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`)
  return res.data
}
```

---

## TODO-04 — Layout chung: Header + Footer (5 phút)

Mọi màn hình đều có `Logo ..... Date: dd/MM/yyyy` trên đầu và `@Copyright 2026` dưới cùng (màn Add New).

- `src/components/Header.jsx`: Navbar React-Bootstrap, trái là "Logo", phải là ngày hiện tại format `dd/MM/yyyy` (tự format bằng `String.padStart`, không dùng thư viện ngoài).
- `src/components/Footer.jsx`: `@Copyright 2026`.

---

## TODO-05 — Routing: `src/App.jsx` (5 phút)

3 route theo đề:

| Path           | Component       | Màn hình                                                   |
| -------------- | --------------- | ------------------------------------------------------------ |
| `/`          | `ShoesList`   | Screen 1 — Shoes List (bắt buộc path`/`, yêu cầu B.4) |
| `/shoes/add` | `AddShoes`    | Screen Add New Shoes                                         |
| `/shoes/:id` | `ShoesDetail` | Screen 3 — View Details                                     |

```jsx
import { Routes, Route } from 'react-router-dom'
// ...
<Routes>
  <Route path="/" element={<ShoesList />} />
  <Route path="/shoes/add" element={<AddShoes />} />
  <Route path="/shoes/:id" element={<ShoesDetail />} />
</Routes>
```

---

## TODO-06 — Màn hình Shoes List: `src/pages/ShoesList.jsx` (25 phút — phần nặng nhất)

Yêu cầu chức năng (FR B.1.1):

1. **Load lần đầu**: `useEffect` gọi `searchShoes('', '', 0, PAGE_SIZE)` → hiển thị tất cả shoes.
2. **Filter**: ô text `name` + dropdown `Category` (load từ `/api/categories`) + nút **Filter**. Bấm Filter → gọi API với điều kiện, reset về page 0.
3. **Bảng kết quả**: cột `# | Shoes Name | Category | Manufacturer | Price(đ) | Action`. Cột `#` là số thứ tự (`currentPage * pageSize + index + 1`). Action gồm 2 hyperlink `Delete | View`.
4. **No records found**: nếu `content.length === 0` → hiện dòng "No records found" trong bảng.
5. **Pagination**: dòng `Show x of y records` (x = số record trang hiện tại, y = `totalElements`) + nút `Previous 1 2 3 … Next` (dùng `Pagination` của React-Bootstrap, disable Previous ở trang đầu / Next ở trang cuối).
6. **Delete + Modal xác nhận** (FR 3):
   - Bấm `Delete` → mở `Modal` "Confirmation" với nội dung: `Are you sure you want to delete shoes "<tên>"?` và 2 nút **Yes** / **Close**.
   - Yes → gọi `deleteShoes(id)` → hiện message **"Deleted successfully"** (Alert) → **gọi lại API** load danh sách.
   - Close → chỉ đóng modal.
7. **View** → `navigate('/shoes/' + id)`. **Add New** → `navigate('/shoes/add')`.
8. Nhận message từ trang Add qua `location.state` để hiện "Created new shoes successfully" (FR Add 1b).

State cần có: `shoes (PageResponse)`, `categories`, `name`, `category`, `page`, `showModal`, `selected`, `message`.

---

## TODO-07 — Màn hình View Details: `src/pages/ShoesDetail.jsx` (10 phút)

1. Lấy `id` bằng `useParams()`.
2. `useEffect` gọi `getShoesById(id)`.
3. Hiển thị đủ: Shoes Name, Category, Manufacturer, Price, Quantity, Production Date, Import Date (format `dd/MM/yyyy`).
4. Nút **Back** → về `/`.

---

## TODO-08 — Màn hình Add New Shoes: `src/pages/AddShoes.jsx` (20 phút)

Form controlled inputs: Shoes name, Price, Manufacture, Production Date, Import Date (textbox, format dd/MM/yyyy), Category (dropdown từ API), nút **Save**, nút **Back**.

**Validation khi bấm Save** (Screen Definition B.1.3) — sai thì hiện thông báo lỗi chi tiết từng field:

| Field           | Rule                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Shoes Name      | Bắt buộc, ≤ 100 ký tự,**không trùng tên** shoes đã có (gọi search API kiểm tra) |
| Price           | Bắt buộc, số > 0 và < 10000                                                                    |
| Manufacturer    | Bắt buộc, ≤ 100 ký tự                                                                         |
| Production Date | Bắt buộc, đúng format`dd/MM/yyyy`                                                            |
| Import Date     | Đúng format`dd/MM/yyyy` (nếu nhập)                                                           |
| Category        | Bắt buộc, chọn 1 giá trị từ dropdown                                                         |

Kiểm tra format ngày bằng regex + kiểm tra ngày hợp lệ:

```js
const isValidDate = (s) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false
  const [d, m, y] = s.split('/').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y
}
```

Khi hợp lệ:

1. Đổi ngày `dd/MM/yyyy` → `yyyy-MM-dd` trước khi gửi (backend nhận `Date`).
2. Gọi `createShoes({shoesName, price, quantity: 0, manufacturer, productionDate, importDate, categoryId})` — **categoryId là số** (id của category).
3. Thành công → `navigate('/', { state: { message: 'Created new shoes successfully' } })` → list hiện record mới + message.

Nút **Back** → `navigate('/')` (không lưu).

---

## TODO-09 — Chạy thử toàn bộ (5 phút)

Test theo `CHECKLIST.md` (cùng thư mục). Tối thiểu:

1. Vào `http://localhost:5173/` → thấy 10 shoes, có phân trang.
2. Filter theo name "Nike" → còn 2 record. Filter category "Casual" → 4 record. Xóa điều kiện, Filter → đủ lại.
3. Filter name "zzz" → "No records found".
4. Delete 1 record → modal → Yes → "Deleted successfully" + list cập nhật. Close → không xóa.
5. View → trang chi tiết đúng dữ liệu → Back về list.
6. Add New: bỏ trống hết → Save → thấy đủ lỗi. Nhập price = 0, = 10000 → lỗi. Ngày `31/02/2026` → lỗi. Tên trùng "Vans Old Skool" → lỗi. Nhập hợp lệ → về list, thấy message + record mới.

---

## TODO-10 — Nộp bài (5 phút) ⚠️

1. Dừng dev server. **Copy project ra chỗ khác để backup.**
2. **Xóa thư mục `node_modules`** trong project.
3. Kiểm tra lần cuối: tên thư mục đúng `<ClassName>_<StudentID>_SMS_PE`, có `jsconfig.json`.
4. Chuột phải thư mục project → Send to → Compressed (zipped) folder → nộp file zip lên EOS.
5. Nếu backend có lỗi phải sửa → ghi chú lại các lỗi đã tìm thấy, đính kèm khi nộp.

---

## Phân bổ thời gian gợi ý (90 phút)

| Phần                                         | Phút |
| --------------------------------------------- | ----- |
| Backend + CORS + tạo project + config        | 20    |
| Service + Layout + Routing                    | 10    |
| Shoes List (filter, pagination, delete modal) | 25    |
| Add New + validation                          | 20    |
| View Details                                  | 5     |
| Test + zip + nộp                             | 10    |
