# HuongDanPE — Hướng dẫn chi tiết từng bước SBA301 PE (SMS — Shoes Management)

> **Đề:** Xây frontend ReactJS (Vite, JavaScript) + React-Bootstrap + axios, kết nối RESTful API Spring Boot chạy ở port 8080.
> **Thời gian:** 90 phút. Làm tuần tự TODO-00 → TODO-10. Mỗi TODO có code đầy đủ, chỉ cần gõ/chép theo.

---

## API contract (đọc từ code backend — dùng xuyên suốt bài)

| Method | URL | Mô tả |
|---|---|---|
| GET | `/api/shoes/search?name=&category=&page=0&size=5` | Tìm shoes theo điều kiện, có phân trang |
| GET | `/api/shoes/{id}` | Chi tiết 1 shoes |
| POST | `/api/shoes` | Tạo shoes |
| DELETE | `/api/shoes/{id}` | Xóa shoes |
| GET | `/api/categories` | Danh sách category |

- Search trả về `PageResponse`: `{content, currentPage, pageSize, totalElements, totalPages, first, last}`
- Mỗi phần tử `content`: `{shoesId, shoesName, price, quantity, manufacturer, productionDate, importDate, categoryName}`
- POST body: `{shoesName, price, quantity, manufacturer, productionDate, importDate, categoryId}` — `categoryId` là **số**
- Tham số `category` của search là **tên** category (không phải id)

---

## TODO-00 — Chuẩn bị backend (5 phút)

**Bước 1.** Tạo database trong SQL Server:

```sql
CREATE DATABASE SBA301_2026_PE;
```

**Bước 2.** Mở project backend `SBA301_2026_PETrial`, sửa `src/main/resources/application.properties` (đề bắt buộc DB = `SBA301_2026_PE`, user/pass = `sa`/`sa` — code gốc đang trỏ `TestDB`):

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=SBA301_2026_PE;encrypt=false;trustServerCertificate=false
spring.datasource.username=sa
spring.datasource.password=sa
```

**Bước 3.** Thêm CORS — backend gốc **chưa có**, không thêm thì React gọi API sẽ bị chặn (đây là yêu cầu chấm điểm: *"Add codes for backend to allow connection from Frontend"*). Tạo file mới `src/main/java/fu/sba301/pe2026/config/CorsConfig.java`:

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

**Bước 4.** Chạy backend. Lưu ý: `DataInitialization` lần chạy **đầu** chỉ tạo 5 category, lần chạy **thứ hai** mới tạo 10 shoes mẫu → **chạy 2 lần** để có đủ data test.

**Bước 5.** Kiểm tra: mở `http://localhost:8080/api/categories` — phải thấy 5 category (Sport, Casual, Formal, Running, Basketball).

---

## TODO-01 — Tạo project Vite (10 phút — cần Internet trong 10 phút đầu giờ)

```bash
npm create vite@latest <ClassName>_<StudentID>_SMS_PE -- --template react
cd <ClassName>_<StudentID>_SMS_PE
npm install
npm install react-router-dom react-bootstrap bootstrap axios
```

Ví dụ tên: `SE1701_SE180001_SMS_PE`. ⚠️ **Tên thư mục sai convention = 0 điểm.** Không cài thêm bất kỳ thư viện nào khác (yêu cầu 3.3).

Xóa file thừa: `src/App.css`, `src/index.css`, thư mục `src/assets` (và mọi import tới chúng).

---

## TODO-02 — Cấu hình bắt buộc (5 phút) ⚠️ Sai = 0 điểm

**File `vite.config.js`** (gốc project) — cố định port 5173:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// B.4: Server port 5173, host localhost, path /
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
```

**Tạo file `jsconfig.json`** (gốc project) — copy nguyên văn từ đề (yêu cầu 3.8):

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

**File `index.html`** (gốc project):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shoes Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**File `src/main.jsx`** — import Bootstrap CSS + bọc BrowserRouter:

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

Chạy `npm run dev` → phải mở được `http://localhost:5173/`.

---

## TODO-03 — Service layer (5 phút)

**Tạo file `src/services/shoesService.js`** — gom toàn bộ lời gọi axios:

```js
import axios from 'axios'

// B.3.6: connect to REST API run at port 8080
const API_BASE = 'http://localhost:8080/api'

// GET /api/shoes/search — Get all shoes objects by condition (paginated)
export const searchShoes = async (name, category, page = 0, size = 5) => {
  const params = { page, size }
  if (name) params.name = name
  if (category) params.category = category
  const res = await axios.get(`${API_BASE}/shoes/search`, { params })
  return res.data // PageResponse: {content, currentPage, pageSize, totalElements, totalPages, first, last}
}

// GET /api/shoes/{id} — Get shoes detail
export const getShoesById = async (id) => {
  const res = await axios.get(`${API_BASE}/shoes/${id}`)
  return res.data
}

// POST /api/shoes — Create shoes
export const createShoes = async (shoes) => {
  const res = await axios.post(`${API_BASE}/shoes`, shoes)
  return res.data
}

// DELETE /api/shoes/{id} — Delete shoes
export const deleteShoes = async (id) => {
  await axios.delete(`${API_BASE}/shoes/${id}`)
}

// GET /api/categories — Get all shoes category
export const getCategories = async () => {
  const res = await axios.get(`${API_BASE}/categories`)
  return res.data // [{id, categoryName, description}]
}
```

**Tạo file `src/utils/dateUtils.js`** — xử lý ngày `dd/MM/yyyy` (không được dùng thư viện ngoài):

```js
// Format a Date/ISO string to dd/MM/yyyy for display
export const formatDate = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

// Validate a string is a real date in dd/MM/yyyy format
export const isValidDate = (s) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false
  const [d, m, y] = s.split('/').map(Number)
  const date = new Date(y, m - 1, d)
  return (
    date.getDate() === d && date.getMonth() === m - 1 && date.getFullYear() === y
  )
}

// Convert dd/MM/yyyy -> yyyy-MM-dd (format the backend Date field accepts)
export const toIsoDate = (s) => {
  const [d, m, y] = s.split('/')
  return `${y}-${m}-${d}`
}
```

---

## TODO-04 — Layout chung: Header + Footer (5 phút)

Mọi màn hình có `Logo ..... Date: dd/MM/yyyy` trên đầu, `@Copyright 2026` dưới cùng.

**Tạo file `src/components/Header.jsx`:**

```jsx
import { Navbar, Container } from 'react-bootstrap'
import { formatDate } from '../utils/dateUtils'

function Header() {
  return (
    <Navbar bg="dark" variant="dark" className="mb-3">
      <Container>
        <Navbar.Brand>Logo</Navbar.Brand>
        <Navbar.Text>Date: {formatDate(new Date())}</Navbar.Text>
      </Container>
    </Navbar>
  )
}

export default Header
```

**Tạo file `src/components/Footer.jsx`:**

```jsx
import { Container } from 'react-bootstrap'

function Footer() {
  return (
    <Container className="text-center text-muted py-3 mt-4 border-top">
      @Copyright 2026
    </Container>
  )
}

export default Footer
```

---

## TODO-05 — Routing (5 phút)

**File `src/App.jsx`** — 3 route theo đề (path `/` bắt buộc cho trang chính — yêu cầu B.4):

```jsx
import { Routes, Route } from 'react-router-dom'
import ShoesList from './pages/ShoesList'
import ShoesDetail from './pages/ShoesDetail'
import AddShoes from './pages/AddShoes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ShoesList />} />
      <Route path="/shoes/add" element={<AddShoes />} />
      <Route path="/shoes/:id" element={<ShoesDetail />} />
    </Routes>
  )
}

export default App
```

| Path | Component | Màn hình trong đề |
|---|---|---|
| `/` | `ShoesList` | Screen 1 — Shoes List |
| `/shoes/add` | `AddShoes` | Add New Shoes |
| `/shoes/:id` | `ShoesDetail` | Screen 3 — View Details |

---

## TODO-06 — Màn hình Shoes List (25 phút)

Yêu cầu chức năng cần đạt:

1. Vào trang → hiển thị **tất cả** shoes (useEffect gọi API lần đầu).
2. Filter theo `name` (textbox) + `Category` (dropdown load từ API) khi bấm nút **Filter**, reset về trang 0.
3. Bảng cột `# | Shoes Name | Category | Manufacturer | Price(đ) | Action`; `#` là số thứ tự liên tục qua trang; Action là 2 hyperlink `Delete | View`.
4. Không có kết quả → hiện **"No records found"** trong bảng.
5. Dòng `Show x of y records` + pagination `Previous 1 2 3 … Next`.
6. Delete → modal **Confirmation** → Yes: gọi API xóa, hiện **"Deleted successfully"**, gọi lại API load list; Close: chỉ đóng modal.
7. Nhận message `"Created new shoes successfully"` từ trang Add qua `location.state`.

**Tạo file `src/pages/ShoesList.jsx`** (code đầy đủ):

```jsx
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
} from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { deleteShoes, getCategories, searchShoes } from '../services/shoesService'

const PAGE_SIZE = 5

function ShoesList() {
  const navigate = useNavigate()
  const location = useLocation()

  // filter inputs
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  // applied filter (only changes when user clicks Filter)
  const [filter, setFilter] = useState({ name: '', category: '' })
  const [page, setPage] = useState(0)

  const [data, setData] = useState(null) // PageResponse
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState(location.state?.message || '')
  const [error, setError] = useState('')

  // delete confirmation modal
  const [showModal, setShowModal] = useState(false)
  const [selectedShoes, setSelectedShoes] = useState(null)

  const loadShoes = useCallback(async () => {
    try {
      const result = await searchShoes(filter.name, filter.category, page, PAGE_SIZE)
      setData(result)
      setError('')
    } catch (e) {
      setError('Cannot load shoes list. Please check the API server.')
    }
  }, [filter, page])

  useEffect(() => {
    loadShoes()
  }, [loadShoes])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories())
      } catch (e) {
        setError('Cannot load categories. Please check the API server.')
      }
    }
    loadCategories()
    // clear navigation state so the message does not re-appear on refresh
    window.history.replaceState({}, '')
  }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    setMessage('')
    setPage(0)
    setFilter({ name: name.trim(), category })
  }

  const handleDeleteClick = (shoes) => {
    setSelectedShoes(shoes)
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteShoes(selectedShoes.shoesId)
      setShowModal(false)
      setSelectedShoes(null)
      setMessage('Deleted successfully')
      await loadShoes()
    } catch (e) {
      setShowModal(false)
      setError('Delete failed. Please try again.')
    }
  }

  const shoes = data?.content || []
  const totalPages = data?.totalPages || 0

  return (
    <>
      <Header />
      <Container>
        <h2 className="text-center mb-4">Shoes List</h2>

        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage('')}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleFilter} className="mb-3">
          <Row className="align-items-end g-2">
            <Col md={4}>
              <Form.Group controlId="filterName">
                <Form.Label>name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter shoes name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="filterCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">-- All categories --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.categoryName}>
                      {c.categoryName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md="auto">
              <Button type="submit" variant="primary">
                Filter
              </Button>
            </Col>
            <Col md="auto" className="ms-auto">
              <Button variant="success" onClick={() => navigate('/shoes/add')}>
                Add New
              </Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Shoes Name</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Price(đ)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shoes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No records found
                </td>
              </tr>
            ) : (
              shoes.map((s, index) => (
                <tr key={s.shoesId}>
                  <td>{page * PAGE_SIZE + index + 1}</td>
                  <td>{s.shoesName}</td>
                  <td>{s.categoryName}</td>
                  <td>{s.manufacturer}</td>
                  <td>{s.price}</td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDeleteClick(s)}
                    >
                      Delete
                    </Button>
                    {' | '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => navigate(`/shoes/${s.shoesId}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Row className="align-items-center">
          <Col>
            Show {shoes.length} of {data?.totalElements ?? 0} records
          </Col>
          <Col md="auto">
            {totalPages > 1 && (
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={data?.first}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Pagination.Prev>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={data?.last}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete shoes "{selectedShoes?.shoesName}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ShoesList
```

**Giải thích các điểm dễ sai:**

- `filter` tách khỏi `name`/`category`: chỉ khi bấm **Filter** mới áp điều kiện — đúng yêu cầu FR 1b.
- `#` tính bằng `page * PAGE_SIZE + index + 1` để số thứ tự liên tục qua trang.
- `window.history.replaceState({}, '')` xóa `location.state` để message không hiện lại khi refresh.
- Xóa xong phải `await loadShoes()` — đề yêu cầu "call API to update the shoes list".

---

## TODO-07 — Màn hình View Details (10 phút)

**Tạo file `src/pages/ShoesDetail.jsx`:**

```jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Button, Card, Container, Table } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getShoesById } from '../services/shoesService'
import { formatDate } from '../utils/dateUtils'

function ShoesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shoes, setShoes] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadShoes = async () => {
      try {
        setShoes(await getShoesById(id))
      } catch (e) {
        setError('Shoes not found.')
      }
    }
    loadShoes()
  }, [id])

  return (
    <>
      <Header />
      <Container>
        <h2 className="text-center mb-4">View Details</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {shoes && (
          <Card className="mx-auto" style={{ maxWidth: '600px' }}>
            <Card.Body>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>Shoes Name</th>
                    <td>{shoes.shoesName}</td>
                  </tr>
                  <tr>
                    <th>Category</th>
                    <td>{shoes.categoryName}</td>
                  </tr>
                  <tr>
                    <th>Manufacturer</th>
                    <td>{shoes.manufacturer}</td>
                  </tr>
                  <tr>
                    <th>Price(đ)</th>
                    <td>{shoes.price}</td>
                  </tr>
                  <tr>
                    <th>Quantity</th>
                    <td>{shoes.quantity}</td>
                  </tr>
                  <tr>
                    <th>Production Date</th>
                    <td>{formatDate(shoes.productionDate)}</td>
                  </tr>
                  <tr>
                    <th>Import Date</th>
                    <td>{formatDate(shoes.importDate)}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  )
}

export default ShoesDetail
```

---

## TODO-08 — Màn hình Add New Shoes + validation (20 phút)

Rule validation (Screen Definition B.1.3):

| Field | Rule |
|---|---|
| Shoes Name | Bắt buộc, ≤ 100 ký tự, **không trùng tên** đã có (check qua search API) |
| Price | Bắt buộc, số, > 0 và < 10000 |
| Manufacturer | Bắt buộc, ≤ 100 ký tự |
| Production Date | Bắt buộc, đúng format `dd/MM/yyyy`, ngày phải tồn tại |
| Import Date | Nếu nhập thì đúng format `dd/MM/yyyy` |
| Category | Bắt buộc, chọn từ dropdown (load từ API) |

**Tạo file `src/pages/AddShoes.jsx`** (code đầy đủ):

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createShoes, getCategories, searchShoes } from '../services/shoesService'
import { isValidDate, toIsoDate } from '../utils/dateUtils'

function AddShoes() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    shoesName: '',
    price: '',
    manufacturer: '',
    productionDate: '',
    importDate: '',
    categoryId: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await getCategories())
      } catch (e) {
        setApiError('Cannot load categories. Please check the API server.')
      }
    }
    loadCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Screen Definition B.1.3 validation rules
  const validate = async () => {
    const newErrors = {}
    const name = form.shoesName.trim()

    // Shoes Name: mandatory, max 100, no duplicate
    if (!name) {
      newErrors.shoesName = 'Shoes Name is required'
    } else if (name.length > 100) {
      newErrors.shoesName = 'Shoes Name must not exceed 100 characters'
    } else {
      const result = await searchShoes(name, '', 0, 1000)
      const duplicated = result.content.some(
        (s) => s.shoesName.trim().toLowerCase() === name.toLowerCase(),
      )
      if (duplicated) newErrors.shoesName = `Shoes Name "${name}" already exists`
    }

    // Price: mandatory, number, > 0 and < 10000
    if (form.price === '') {
      newErrors.price = 'Price is required'
    } else {
      const price = Number(form.price)
      if (isNaN(price)) {
        newErrors.price = 'Price must be a number'
      } else if (price <= 0 || price >= 10000) {
        newErrors.price = 'Price must be greater than 0 and less than 10000'
      }
    }

    // Manufacturer: mandatory, max 100
    if (!form.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required'
    } else if (form.manufacturer.trim().length > 100) {
      newErrors.manufacturer = 'Manufacturer must not exceed 100 characters'
    }

    // Production Date: mandatory, dd/MM/yyyy
    if (!form.productionDate.trim()) {
      newErrors.productionDate = 'Production Date is required'
    } else if (!isValidDate(form.productionDate.trim())) {
      newErrors.productionDate = 'Production Date must be a valid date in format dd/MM/yyyy'
    }

    // Import Date: dd/MM/yyyy (when entered)
    if (form.importDate.trim() && !isValidDate(form.importDate.trim())) {
      newErrors.importDate = 'Import Date must be a valid date in format dd/MM/yyyy'
    }

    // Category: mandatory, one in the list from API
    if (!form.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    return newErrors
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setApiError('')
    try {
      const newErrors = await validate()
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return

      await createShoes({
        shoesName: form.shoesName.trim(),
        price: Number(form.price),
        quantity: 0,
        manufacturer: form.manufacturer.trim(),
        productionDate: toIsoDate(form.productionDate.trim()),
        importDate: form.importDate.trim() ? toIsoDate(form.importDate.trim()) : null,
        categoryId: Number(form.categoryId),
      })
      navigate('/', { state: { message: 'Created new shoes successfully' } })
    } catch (err) {
      setApiError('Cannot save shoes. Please check the API server.')
    }
  }

  return (
    <>
      <Header />
      <Container>
        <h2 className="text-center mb-4">Add New Shoes</h2>

        {apiError && <Alert variant="danger">{apiError}</Alert>}

        <Card className="mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Body>
            <Form noValidate onSubmit={handleSave}>
              <Form.Group className="mb-3" controlId="shoesName">
                <Form.Label>Shoes name:</Form.Label>
                <Form.Control
                  type="text"
                  name="shoesName"
                  value={form.shoesName}
                  onChange={handleChange}
                  isInvalid={!!errors.shoesName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.shoesName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price:</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="manufacturer">
                <Form.Label>Manufacture:</Form.Label>
                <Form.Control
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  isInvalid={!!errors.manufacturer}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.manufacturer}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="productionDate">
                <Form.Label>Production Date</Form.Label>
                <Form.Control
                  type="text"
                  name="productionDate"
                  placeholder="dd/MM/yyyy"
                  value={form.productionDate}
                  onChange={handleChange}
                  isInvalid={!!errors.productionDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productionDate}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="importDate">
                <Form.Label>Import Date</Form.Label>
                <Form.Control
                  type="text"
                  name="importDate"
                  placeholder="dd/MM/yyyy"
                  value={form.importDate}
                  onChange={handleChange}
                  isInvalid={!!errors.importDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.importDate}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="categoryId">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  isInvalid={!!errors.categoryId}
                >
                  <option value="">-- Select category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.categoryId}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="text-center">
                <Button type="submit" variant="primary" className="me-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Back
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  )
}

export default AddShoes
```

**Giải thích các điểm dễ sai:**

- Check trùng tên: gọi `searchShoes(name, '', 0, 1000)` rồi so sánh **chính xác** (trim + lowercase) — search API chỉ so "contains" nên phải lọc lại.
- Ngày gửi backend phải đổi `dd/MM/yyyy` → `yyyy-MM-dd` (`toIsoDate`), vì backend nhận kiểu `Date`.
- `categoryId` phải ép `Number()` — dropdown trả về string.
- `quantity: 0` — màn hình Add không có field Quantity nhưng DTO backend yêu cầu.
- Thành công → `navigate('/', { state: {...} })` để list hiện message + record mới (FR 1b, 1c).

---

## TODO-09 — Test toàn bộ (5 phút)

1. `http://localhost:5173/` → thấy 10 shoes, pagination hoạt động, `#` liên tục qua trang.
2. Filter name "Nike" → 2 record; category "Casual" → 4 record; xóa điều kiện + Filter → đủ lại.
3. Filter name "zzz" → "No records found".
4. Delete → modal Confirmation → Yes → "Deleted successfully" + list cập nhật; Close → không xóa.
5. View → chi tiết đúng, ngày dạng dd/MM/yyyy → Back về list.
6. Add New: Save trống → đủ lỗi từng field; price `0`/`10000`/`abc` → lỗi; ngày `31/02/2026` → lỗi; tên trùng "Vans Old Skool" → lỗi; nhập hợp lệ → về list + "Created new shoes successfully" + thấy record mới.

Chi tiết đầy đủ: xem `CHECKLIST.md` cùng thư mục.

---

## TODO-10 — Nộp bài (5 phút) ⚠️

1. Dừng dev server. **Copy project ra chỗ khác để backup.**
2. **Xóa thư mục `node_modules`** trong project.
3. Kiểm tra lần cuối: tên thư mục `<ClassName>_<StudentID>_SMS_PE`, có `jsconfig.json`, `package.json` không có thư viện lạ.
4. Chuột phải thư mục project → Send to → Compressed (zipped) folder → nộp zip lên EOS.
5. Nếu đã sửa lỗi backend → ghi chú các lỗi tìm thấy, đính kèm khi nộp.

---

## Phân bổ thời gian (90 phút)

| Phần | Phút |
|---|---|
| TODO-00 → 02: Backend + CORS + tạo project + config | 20 |
| TODO-03 → 05: Service + Layout + Routing | 10 |
| TODO-06: Shoes List (filter, pagination, delete modal) | 25 |
| TODO-08: Add New + validation | 20 |
| TODO-07: View Details | 5 |
| TODO-09 → 10: Test + zip + nộp | 10 |
