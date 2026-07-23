[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZsCPCIEV)
# PROGRESS TEST 1

| Mã SV   | Họ tên            | Email                         | Link Github |
|----------|------------------|-------------------------------|-------------|
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Psasvirgo139](https://github.com/Psasvirgo139) |

## Mục tiêu

- Áp dụng `useContext` + `useReducer` để quản lý authentication state toàn cục.
- Xây dựng UI với **React Bootstrap**.
- Đọc dữ liệu từ `db.json` (có trường `status`) — chỉ tài khoản `active` mới được login.
- Viết code pass toàn bộ automated test cases.

---

## Cài đặt & Chạy

```bash
npm install          # cài packages
npm run dev          # chạy app
npm test             # chạy tất cả tests (1 lần)
npm run test:watch   # chạy tests ở chế độ watch
```

---

## Cấu trúc thư mục

```
ProgressTest/
├── db.json                        ← [CÓ SẴN] nguồn dữ liệu users duy nhất
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── __tests__/                 ← [CÓ SẴN - KHÔNG CHỈNH SỬA]
    │   ├── utils/
    │   │   └── authHelpers.test.js       ← Bài 1
    │   ├── context/
    │   │   └── AuthContext.test.jsx      ← Bài 2
    │   ├── components/
    │   │   ├── LoginForm.test.jsx        ← Bài 3
    │   │   ├── Dashboard.test.jsx        ← Bài 4
    │   │   └── AppNavbar.test.jsx        ← Bài 4
    │   ├── pages/
    │   │   └── UserListPage.test.jsx     ← Bài 6
    │   ├── services/
    │   │   └── userService.test.js       ← Bài 6
    │   └── App.test.jsx                  ← Bài 5
    │
    ├── context/                   ← [Tạo] AuthContext.jsx          (Bài 2)
    ├── hooks/                     ← [Tạo] useAuth.js               (Bài 2)
    ├── utils/                     ← [Tạo] authHelpers.js           (Bài 1)
    ├── components/                ← [Tạo] LoginForm.jsx            (Bài 3)
    │                                       Dashboard.jsx            (Bài 4)
    │                                       AppNavbar.jsx            (Bài 4)
    ├── pages/                     ← [Tạo] LoginPage.jsx            (Bài 5)
    │                                       DashboardPage.jsx        (Bài 5)
    │                                       UserListPage.jsx         (Bài 6)
    ├── services/                  ← [Tạo] userService.js           (Bài 6)
    ├── App.jsx                    ← [Hoàn thiện TODOs]             (Bài 5)
    ├── main.jsx                   ← [Hoàn thiện TODOs]             (Bài 5)
    └── setupTests.js              ← [CÓ SẴN - KHÔNG CHỈNH SỬA]
```

> **Quy tắc:** Không chỉnh sửa `__tests__/`, `setupTests.js`, `package.json`, `vite.config.js`, `index.html`.  
> Dữ liệu chỉ đọc từ `db.json` — không tạo `src/data/`, không hardcode danh sách users trong JS.

---

## Dữ liệu `db.json`

```json
{
  "users": [
    { "id": 1, "username": "admin",  "password": "123", "name": "Admin User",  "role": "admin", "status": "active"   },
    { "id": 2, "username": "traltb", "password": "123", "name": "Admin User",  "role": "admin", "status": "active"   },
    { "id": 3, "username": "huy",    "password": "123", "name": "Huy Nguyen", "role": "user",  "status": "active"   },
    { "id": 4, "username": "khoi",   "password": "123", "name": "Khoi Tran",  "role": "user",  "status": "inactive" },
    { "id": 5, "username": "manh",   "password": "123", "name": "Manh Le",    "role": "user",  "status": "active"   }
  ]
}
```

> Tài khoản `khoi` có `status: "inactive"` — credentials đúng nhưng **không được login**.

Vite hỗ trợ import JSON trực tiếp: `import db from '../../db.json'`

---

## Tổng quan Test Cases

| File test | Bài | Số tests |
|---|---|---|
| `utils/authHelpers.test.js` | Bài 1 | 7 |
| `context/AuthContext.test.jsx` | Bài 2 | 9 |
| `components/LoginForm.test.jsx` | Bài 3 | 9 |
| `components/Dashboard.test.jsx` | Bài 4 | 8 |
| `components/AppNavbar.test.jsx` | Bài 4 | 6 |
| `App.test.jsx` | Bài 5 | 12 |
| `services/userService.test.js` | Bài 6 | 11 |
| `pages/UserListPage.test.jsx` | Bài 6 | 8 |

---

---

# Bài 1 — `src/utils/authHelpers.js`

**File test:** `src/__tests__/utils/authHelpers.test.js`

## Yêu cầu

Tạo file `src/utils/authHelpers.js` export hàm `findUser(username, password)`.

**Import dữ liệu:**
```js
import db from '../../db.json'   // đường dẫn từ src/utils/ lên 2 cấp → db.json ở root
const USERS = db.users
```

**Validation bắt buộc:**

| Điều kiện | Kết quả |
|---|---|
| `username` hoặc `password` rỗng | `return null` |
| Không tìm thấy username | `return null` |
| Password không khớp | `return null` |
| Tìm thấy nhưng `status !== 'active'` | `return null` |
| Tìm thấy, password đúng, `status === 'active'` | `return` object user |

**Scaffold:**
```js
import db from '../../db.json'

const USERS = db.users

/**
 * Tìm user hợp lệ theo username và password.
 * Chỉ trả về user nếu credentials đúng VÀ status === 'active'.
 * @param {string} username
 * @param {string} password
 * @returns {Object|null}
 */
export function findUser(username, password) {
  // TODO: kiểm tra rỗng → return null
  // TODO: tìm user khớp username, password VÀ status === 'active'
  // TODO: return user nếu tìm thấy, null nếu không
}
```

## Tests cần pass

```
TC-07a: trả về user khi username + password đúng (admin, active)
TC-07b: trả về user khi username + password đúng (user thường, active)
TC-07c: trả về null khi password sai
TC-07d: trả về null khi username không tồn tại
TC-07e: trả về null khi cả hai trường đều rỗng
TC-07f: trả về null khi tài khoản có status === "inactive"
TC-07g: user object có đủ các trường: id, username, name, role, status
```

---

---

# Bài 2 — `src/context/AuthContext.jsx` + `src/hooks/useAuth.js`

**File test:** `src/__tests__/context/AuthContext.test.jsx`

## Yêu cầu

### 2a. `src/context/AuthContext.jsx`

**Export bắt buộc:**
- `export const AuthContext` — context object (để test import trực tiếp)
- `export function AuthProvider({ children })` — Provider component

**initialState:**
```js
{ isAuthenticated: false, user: null, error: null }
```

**authReducer — 3 action types:**

| Action type | State mới |
|---|---|
| `LOGIN_SUCCESS` | `{ isAuthenticated: true, user: action.payload, error: null }` |
| `LOGIN_FAILURE` | `{ ...state, isAuthenticated: false, error: action.payload }` |
| `LOGOUT` | reset về `initialState` |

**Scaffold:**
```js
import { createContext, useReducer } from 'react'

const initialState = {
  // TODO: isAuthenticated, user, error
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // TODO
    case 'LOGIN_FAILURE':
      // TODO
    case 'LOGOUT':
      // TODO
    default:
      return state
  }
}

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 2b. `src/hooks/useAuth.js`

**Validation bắt buộc:** ném lỗi nếu dùng ngoài `AuthProvider`.

```js
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  // TODO: if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider')
  return context
}
```

> ⚠️ Chuỗi lỗi phải khớp chính xác: **`'useAuth phải được dùng bên trong AuthProvider'`**

## Tests cần pass

```
AuthContext — initial state (3 tests)
AuthContext — LOGIN_SUCCESS (3 tests)
AuthContext — LOGIN_FAILURE (2 tests)
AuthContext — LOGOUT (1 test)
TC-06 — useAuth() ngoài AuthProvider ném lỗi (1 test)
```

---

---

# Bài 3 — `src/components/LoginForm.jsx`

**File test:** `src/__tests__/components/LoginForm.test.jsx`

## Yêu cầu

Tạo `src/components/LoginForm.jsx` — form đăng nhập, dùng `findUser` để xác thực.

**Phụ thuộc:**
- `useAuth()` từ `../hooks/useAuth`
- `findUser()` từ `../utils/authHelpers`
- React Bootstrap components

**UI bắt buộc:**

| Element | Yêu cầu |
|---|---|
| Input username | `placeholder="Username"` (hoặc label "Username") |
| Input password | `type="password"`, `placeholder="Password"` |
| Nút submit | text chứa **"Đăng nhập"** |
| Alert lỗi | `variant="danger"`, chỉ hiện khi `state.error` có giá trị |

**Logic xử lý submit:**
```js
function handleSubmit(e) {
  e.preventDefault()
  const user = findUser(username, password)
  if (user) {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
  } else {
    dispatch({ type: 'LOGIN_FAILURE', payload: 'Sai username hoặc password!' })
  }
}
```

> **Lưu ý:** `findUser` đã kiểm tra `status === 'active'`, nên tài khoản `inactive` cũng sẽ bị từ chối (trả về `null`), và form sẽ hiện Alert lỗi.

**Scaffold:**
```jsx
import { useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { findUser } from '../utils/authHelpers'

export default function LoginForm() {
  const { state, dispatch } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: gọi findUser, dispatch LOGIN_SUCCESS hoặc LOGIN_FAILURE
  }

  return (
    // TODO: render Form với 2 input và nút "Đăng nhập"
    // TODO: hiển thị <Alert variant="danger"> khi state.error có giá trị
  )
}
```

## Tests cần pass

```
TC-01 — Hiển thị form login (5 tests):
  render input username
  render input password
  render nút Đăng nhập
  không hiển thị Alert khi mới mở
  input password có type="password"

TC-02 — Đăng nhập không hợp lệ (4 tests):
  hiển thị Alert lỗi khi credentials sai
  Alert lỗi chứa thông báo phù hợp
  form vẫn hiển thị sau khi đăng nhập sai
  hiển thị Alert lỗi khi tài khoản inactive (credentials đúng, status="inactive")
```

---

---

# Bài 4 — `src/components/Dashboard.jsx` + `src/components/AppNavbar.jsx`

**File test:** `src/__tests__/components/Dashboard.test.jsx`, `AppNavbar.test.jsx`

## Yêu cầu

### 4a. `src/components/Dashboard.jsx`

**UI bắt buộc:**

| Element | Yêu cầu |
|---|---|
| Tên user | hiển thị `user.name` |
| Badge role | `bg="danger"` nếu `role==='admin'`, `bg="success"` nếu `role==='user'` |
| Text Badge | đúng chuỗi `"admin"` hoặc `"user"` (chữ thường) |
| Nút Đăng xuất | text chứa **"Đăng xuất"** hoặc **"Logout"** |
| Link Users | Chỉ admin thấy `<Link to="/users">Xem danh sách Users</Link>` |

**Scaffold:**
```jsx
import { Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { state, dispatch } = useAuth()
  const { user } = state

  return (
    <div>
      {/* TODO: hiển thị user.name */}
      {/* TODO: <Badge bg={role==='admin' ? 'danger' : 'success'}>{user.role}</Badge> */}
      {/* TODO: nút Đăng xuất → dispatch({ type: 'LOGOUT' }) */}
      {/* TODO: nếu user.role === 'admin' → <Link to="/users">Xem danh sách Users</Link> */}
    </div>
  )
}
```

### 4b. `src/components/AppNavbar.jsx`

**UI bắt buộc:**

| Element | Yêu cầu |
|---|---|
| Navbar | React Bootstrap `<Navbar>` — tự render `role="navigation"` |
| Tên user | hiển thị `user.name` |
| NavLink Dashboard | text chứa **"Dashboard"**, href `"/"` |
| NavLink Quản lý Users | Chỉ admin thấy, text **"Quản lý Users"**, href `"/users"` |
| Nút Đăng xuất | text **"Đăng xuất"** hoặc **"Logout"** → dispatch `LOGOUT` |

**Scaffold:**
```jsx
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AppNavbar() {
  const { state, dispatch } = useAuth()
  const { user } = state

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        {/* TODO: NavLink "Dashboard" → "/" */}
        {/* TODO: nếu user.role === 'admin' → NavLink "Quản lý Users" → "/users" */}
        {/* TODO: hiển thị user.name */}
        {/* TODO: nút Đăng xuất → dispatch({ type: 'LOGOUT' }) */}
      </Container>
    </Navbar>
  )
}
```

## Tests cần pass

```
Dashboard — TC-03 (user thường, 6 tests):
  hiển thị tên user (Huy Nguyen)
  Badge role hiển thị "user"
  Badge có class success (màu xanh)
  Badge KHÔNG có class danger
  hiển thị nút Đăng xuất
  user thường KHÔNG thấy link "Xem danh sách Users"

Dashboard — TC-04 (admin, 4 tests):
  hiển thị tên admin (Admin User)
  Badge role hiển thị "admin"
  Badge có class danger (màu đỏ)
  admin thấy link "Xem danh sách Users"

AppNavbar — cơ bản (5 tests):
  hiển thị navigation element
  hiển thị tên user
  có nút Đăng xuất
  click Đăng xuất → isAuthenticated = false
  có NavLink Dashboard

AppNavbar — phân quyền (2 tests):
  admin → có link "Quản lý Users"
  user thường → KHÔNG có link "Quản lý Users"
```

---

---

# Bài 5 — `src/pages/` + `src/App.jsx` + `src/main.jsx`

**File test:** `src/__tests__/App.test.jsx`

## Yêu cầu

### 5a. `src/pages/LoginPage.jsx`

```jsx
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  // TODO: render <LoginForm /> (có thể bọc container Bootstrap)
}
```

### 5b. `src/pages/DashboardPage.jsx`

```jsx
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  // TODO: render <Dashboard />
}
```

### 5c. Hoàn thiện `src/App.jsx`

Điền vào các `TODO` trong file `App.jsx` đã có sẵn:

**Cần thực hiện:**
1. Import `useAuth`, `LoginPage`, `DashboardPage`, `AppNavbar`
2. Viết `PrivateRoute`: nếu `!state.isAuthenticated` → `<Navigate to="/login" replace />`
3. Render `<AppNavbar />` chỉ khi `state.isAuthenticated === true`
4. Khai báo đủ 3 routes: `/login`, `/`, `/users` (EXT-03)

```jsx
// TODO: import useAuth từ './hooks/useAuth'
// TODO: import LoginPage, DashboardPage, AppNavbar

function PrivateRoute({ children }) {
  // TODO: const { state } = useAuth()
  // TODO: return state.isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  // TODO: const { state } = useAuth()
  return (
    <BrowserRouter>
      {/* TODO: render <AppNavbar /> khi isAuthenticated */}
      <Routes>
        {/* TODO: Route /login */}
        {/* TODO: Route / → PrivateRoute > DashboardPage */}
        {/* TODO: Route /users → PrivateRoute > UserListPage (Bài 6) */}
        {/* TODO: Route * → redirect / */}
      </Routes>
    </BrowserRouter>
  )
}
```

### 5d. Hoàn thiện `src/main.jsx`

```jsx
// TODO: import AuthProvider từ './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* TODO: bọc <App /> trong <AuthProvider> */}
  </React.StrictMode>
)
```

## Tests cần pass

```
TC-01 — App trạng thái ban đầu (3 tests):
  hiển thị LoginPage khi chưa đăng nhập
  không hiển thị Navbar khi chưa đăng nhập
  không hiển thị nút Đăng xuất khi chưa đăng nhập

TC-03 — Login thành công (4 tests):
  sau khi login đúng → không còn nút Đăng nhập
  sau khi login → Navbar xuất hiện
  sau khi login → hiển thị tên user
  tài khoản inactive → không login được, vẫn thấy form

TC-05 — Đăng xuất (3 tests):
  sau khi logout → hiển thị lại LoginPage
  sau khi logout → Navbar biến mất
  sau khi logout → Dashboard biến mất

TC-08 — Navbar link phân quyền (2 tests):
  admin → Navbar có link "Quản lý Users"
  user thường → Navbar KHÔNG có link "Quản lý Users"
```

---

---

# Bài 6 — `src/services/userService.js` + `src/pages/UserListPage.jsx`

**File test:** `src/__tests__/services/userService.test.js`, `src/__tests__/pages/UserListPage.test.jsx`

## Yêu cầu

### 6a. `src/services/userService.js`

Tạo service layer đọc dữ liệu từ `db.json`, trả về **Promise** (để sau này thay thế bằng `fetch` dễ dàng).

**Export bắt buộc:**

| Hàm | Mô tả |
|---|---|
| `getUsers()` | Trả về `Promise<Array>` toàn bộ users |
| `getUserById(id)` | Trả về `Promise<Object\|null>` — null nếu không tìm thấy |
| `findUserByCredentials(username, password)` | Trả về `Promise<Object\|null>` — null nếu sai hoặc inactive |

**Validation cho `findUserByCredentials`:**
- `username` hoặc `password` rỗng → `return Promise.resolve(null)`
- Không tìm thấy hoặc password sai → `return Promise.resolve(null)`
- Tìm thấy nhưng `status !== 'active'` → `return Promise.resolve(null)`

**Scaffold:**
```js
import db from '../../db.json'

export async function getUsers() {
  // TODO: return Promise.resolve(db.users)
}

export async function getUserById(id) {
  // TODO: tìm user theo id
  // TODO: return Promise.resolve(user ?? null)
}

export async function findUserByCredentials(username, password) {
  // TODO: kiểm tra rỗng → return Promise.resolve(null)
  // TODO: tìm user khớp username, password VÀ status === 'active'
  // TODO: return Promise.resolve(user ?? null)
}
```

### 6b. `src/pages/UserListPage.jsx`

**Logic phân quyền:**
- Nếu `user.role !== 'admin'` → render `<Alert data-testid="access-denied">Bạn không có quyền truy cập</Alert>`
- Nếu là admin → gọi `getUsers()`, render `<Table>`

**Bảng phải có cột:** `#`, `Username`, `Name`, `Role`, `Status`

**Scaffold:**
```jsx
import { useEffect, useState } from 'react'
import { Alert, Table } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'
import { getUsers } from '../services/userService'

export default function UserListPage() {
  const { state } = useAuth()
  const { user } = state
  const [users, setUsers] = useState([])

  useEffect(() => {
    // TODO: chỉ gọi getUsers() nếu user.role === 'admin'
    // TODO: setUsers(data)
  }, [user])

  if (user?.role !== 'admin') {
    return (
      // TODO: <Alert data-testid="access-denied">Bạn không có quyền truy cập</Alert>
    )
  }

  return (
    // TODO: <Table> với thead (cột: #, Username, Name, Role, Status)
    //        và tbody (map qua users)
  )
}
```

**Cập nhật `src/App.jsx`:** bỏ comment TODO EXT-03 để bật route `/users`:
```jsx
// Bỏ comment dòng này:
import UserListPage from './pages/UserListPage'
// Và route:
<Route path="/users" element={<PrivateRoute><UserListPage /></PrivateRoute>} />
```

## Tests cần pass

```
userService — getUsers() (4 tests):
  trả về Promise resolves mảng users
  có ít nhất 2 users
  mỗi user có đủ trường id, username, name, role, status
  có ít nhất 1 user với role admin

userService — getUserById() (2 tests):
  trả về đúng user theo id
  trả về null khi id không tồn tại

userService — findUserByCredentials() (6 tests):
  trả về user khi username + password đúng (admin, active)
  trả về user khi username + password đúng (user thường, active)
  trả về null khi password sai
  trả về null khi username không tồn tại
  trả về null khi cả hai trường rỗng
  trả về null khi tài khoản có status === "inactive"

UserListPage — user thường (3 tests):
  hiển thị Alert access-denied
  nội dung Alert đề cập quyền truy cập
  KHÔNG hiển thị bảng users

UserListPage — admin (5 tests):
  KHÔNG hiển thị Alert access-denied
  hiển thị bảng (table) danh sách users
  bảng có cột Username, Role, Status
  hiển thị username "admin" trong bảng
  hiển thị đủ 5 hàng dữ liệu (1 header + 5 data rows)
  hiển thị status "active" và "inactive" trong bảng
```

---

## Tài khoản test

| Username | Password | Role  | Status   |
|----------|----------|-------|----------|
| admin    | 123      | admin | active   |
| traltb   | 123      | admin | active   |
| huy      | 123      | user  | active   |
| khoi     | 123      | user  | **inactive** |
| manh     | 123      | user  | active   |

---

## Nộp bài

1. Commit toàn bộ code lên repository GitHub Classroom.
2. **Không commit `node_modules`**.
3. Đảm bảo `npm install && npm test` chạy thành công trên máy khác.
4. Commit message ghi rõ các bài đã hoàn thành, ví dụ:
   ```
   feat: complete Bài 1-5
   feat: complete Bài 1-6 (all tests pass)
   ```

---

## Tham khảo

- [React – useContext](https://react.dev/reference/react/useContext)
- [React – useReducer](https://react.dev/reference/react/useReducer)
- [React Bootstrap](https://react-bootstrap.netlify.app/)
- [Vitest](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
