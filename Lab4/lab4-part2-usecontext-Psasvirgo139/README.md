[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/L67xl82w)
# useContext – Bài tập thực hành

Vận dụng **useContext**, **useState**, **useReducer** và **React Router** trong một React application chuẩn.

---

| Mã sinh viên | Họ tên | Email | Link Github |
| :--- | :--- | :--- | :--- |
| DE190010 | Nguyễn Ngọc Khôi | nguyenngockhoi273@gmail.com | [Github](https://github.com/Psasvirgo139) |

---

## Cài đặt và chạy

```bash
npm install       # cài dependencies
npm run dev       # chạy app tại http://localhost:5173
npm test          # chạy toàn bộ test
npm test Ex01     # chỉ test bài 1
```

---

## Cấu trúc project

```
src/
├── main.jsx                          ← entry point (ĐÃ CÓ SẴN)
├── App.jsx                           ← root component (ĐÃ CÓ SẴN)
│
├── routes/
│   └── AppRoutes.jsx                 ← cấu hình routes (ĐÃ CÓ SẴN)
│
├── pages/
│   ├── HomePage.jsx                  ← trang chủ (ĐÃ CÓ SẴN)
│   ├── Ex01CounterPage.jsx           ← [BÀI 1] cần hoàn thiện
│   ├── Ex02LoginPage.jsx             ← [BÀI 2] cần hoàn thiện
│   ├── Ex03ValidationPage.jsx        ← [BÀI 3] cần hoàn thiện
│   └── Ex04ThemePage.jsx             ← [BÀI 4] cần hoàn thiện
│
├── context/
│   ├── CounterContext.jsx            ← [BÀI 1] cần hoàn thiện
│   ├── AuthContext.jsx               ← [BÀI 2] cần hoàn thiện
│   ├── FormContext.jsx               ← [BÀI 3] cần hoàn thiện
│   └── ThemeContext.jsx              ← [BÀI 4] cần hoàn thiện
│
├── reducers/
│   └── formReducer.js                ← [BÀI 3] cần hoàn thiện
│
├── components/
│   ├── shared/
│   │   └── AppNavbar.jsx             ← navbar dùng chung (ĐÃ CÓ SẴN)
│   ├── counter/
│   │   ├── CounterDisplay.jsx        ← [BÀI 1] cần hoàn thiện
│   │   ├── CounterControls.jsx       ← [BÀI 1] cần hoàn thiện
│   │   └── StatusMessage.jsx         ← [BÀI 1] cần hoàn thiện
│   ├── auth/
│   │   ├── AuthNavbar.jsx            ← [BÀI 2] cần hoàn thiện
│   │   ├── LoginForm.jsx             ← [BÀI 2] cần hoàn thiện
│   │   └── Dashboard.jsx             ← [BÀI 2] cần hoàn thiện
│   ├── form/
│   │   ├── FormField.jsx             ← [BÀI 3] cần hoàn thiện
│   │   └── RegistrationForm.jsx      ← [BÀI 3] cần hoàn thiện
│   └── theme/
│       ├── ThemeNavbar.jsx           ← [BÀI 4] cần hoàn thiện
│       ├── ThemedCard.jsx            ← [BÀI 4] cần hoàn thiện
│       ├── ThemedButton.jsx          ← [BÀI 4] cần hoàn thiện
│       └── ThemedInput.jsx           ← [BÀI 4] cần hoàn thiện
│
├── data/
│   ├── users.js                      ← dữ liệu tài khoản (ĐÃ CÓ SẴN)
│   └── themeConfig.js                ← cấu hình màu theme (ĐÃ CÓ SẴN)
│
├── utils/
│   └── validators.js                 ← [BÀI 3] cần hoàn thiện
│
└── tests/
    ├── setup.js                      ← cấu hình test (ĐÃ CÓ SẴN)
    ├── Ex01.test.jsx                 ← test bài 1 (ĐÃ CÓ SẴN – không sửa)
    ├── Ex02.test.jsx                 ← test bài 2 (ĐÃ CÓ SẴN – không sửa)
    ├── Ex03.test.jsx                 ← test bài 3 (ĐÃ CÓ SẴN – không sửa)
    └── Ex04.test.jsx                 ← test bài 4 (ĐÃ CÓ SẴN – không sửa)
```

> **Quy tắc:** Chỉ chỉnh sửa các file được đánh dấu **"cần hoàn thiện"**.  
> Không sửa file test, `App.jsx`, `AppRoutes.jsx`, `AppNavbar.jsx`, và các file trong `data/`.

---

## Quy tắc đặt tên file

| Loại | Convention | Ví dụ |
|---|---|---|
| Component | PascalCase | `LoginForm.jsx`, `ThemedCard.jsx` |
| Page | PascalCase + `Page` suffix | `Ex02LoginPage.jsx` |
| Context | PascalCase + `Context` suffix | `AuthContext.jsx` |
| Reducer | camelCase + `Reducer` suffix | `formReducer.js` |
| Data / Config | camelCase | `users.js`, `themeConfig.js` |
| Utility | camelCase | `validators.js` |

---

## Bài 1 – Counter `(useContext + useState)`

**Route:** `/ex01`  
**Mục tiêu:** Chia sẻ state đếm qua Context cho nhiều component độc lập.

### TODO

#### `src/context/CounterContext.jsx`
- [ ] Tạo `CounterContext` bằng `createContext()`
- [ ] Tạo `CounterProvider`: dùng `useState(0)`, khai báo `increment`, `decrement`, `reset`
- [ ] Export custom hook `useCounter()` (kiểm tra null, ném lỗi nếu dùng ngoài Provider)

#### `src/components/counter/CounterDisplay.jsx`
- [ ] Dùng `useCounter()` để lấy `count`, hiển thị ra màn hình
- [ ] Không nhận props

#### `src/components/counter/CounterControls.jsx`
- [ ] Dùng `useCounter()` để lấy `increment`, `decrement`, `reset`
- [ ] Render 3 nút: **+**, **−**, **Reset**
- [ ] Không nhận props

#### `src/components/counter/StatusMessage.jsx`
- [ ] Dùng `useCounter()` để lấy `count`
- [ ] Hiển thị: *"Dương"* / *"Âm"* / *"Bằng 0"* theo giá trị
- [ ] Không nhận props

#### `src/pages/Ex01CounterPage.jsx`
- [ ] Bọc nội dung trong `<CounterProvider>`
- [ ] Render `<CounterDisplay />`, `<CounterControls />`, `<StatusMessage />`

### Kiểm tra
```bash
npm test Ex01   # kỳ vọng: 7/7 pass
```

---

## Bài 2 – Login Form `(useContext + useState)`

**Route:** `/ex02`  
**Mục tiêu:** Quản lý trạng thái đăng nhập toàn trang qua AuthContext.  
**Dữ liệu tài khoản:** xem `src/data/users.js` (tài khoản mặc định: `admin@example.com` / `123456`)

### TODO

#### `src/context/AuthContext.jsx`
- [ ] Tạo `AuthContext` bằng `createContext()`
- [ ] Tạo `AuthProvider` với state: `user`, `loading`, `error`
- [ ] Hàm `login(email, password)`: giả lập API 800ms, tìm trong `USERS`, set user hoặc error
- [ ] Hàm `logout()`: reset user và error về null/''
- [ ] Export custom hook `useAuth()`

#### `src/components/auth/AuthNavbar.jsx`
- [ ] Dùng `useAuth()` lấy `user`, `logout`
- [ ] Hiển thị tên user + nút **Đăng xuất** khi đã đăng nhập
- [ ] Hiển thị "Chưa đăng nhập" khi chưa login
- [ ] Không nhận props

#### `src/components/auth/LoginForm.jsx`
- [ ] Dùng `useAuth()` lấy `login`, `loading`, `error`
- [ ] Local state riêng cho `email` và `password`
- [ ] Input email (`id="email"`) và password (`id="password"`) có label
- [ ] Hiển thị error, disable nút khi loading
- [ ] Không nhận props

#### `src/components/auth/Dashboard.jsx`
- [ ] Dùng `useAuth()` lấy `user`
- [ ] Hiển thị: tên, email, vai trò
- [ ] Không nhận props

#### `src/pages/Ex02LoginPage.jsx`
- [ ] Bọc nội dung trong `<AuthProvider>`
- [ ] Tạo component nội bộ `PageContent` dùng `useAuth()` để chọn render `<LoginForm />` hay `<Dashboard />`
- [ ] `<AuthNavbar />` hiển thị luôn luôn

### Kiểm tra
```bash
npm test Ex02   # kỳ vọng: 5/5 pass
```

---

## Bài 3 – Registration Form `(useContext + useReducer)`

**Route:** `/ex03`  
**Mục tiêu:** Form đăng ký nhiều fields với validation theo thời gian thực, sử dụng useReducer.

### TODO

#### `src/utils/validators.js`
- [ ] Hoàn thiện hàm `validateField(name, value, allValues)`:
  - `fullName`: không trống, ≥ 3 ký tự
  - `email`: không trống, đúng định dạng email
  - `password`: không trống, ≥ 6 ký tự, có chữ hoa, có chữ số
  - `confirmPassword`: không trống, khớp với `allValues.password`

#### `src/reducers/formReducer.js`
- [ ] Khai báo `initialState` (values, errors, touched, status)
- [ ] Viết `formReducer` xử lý 5 action: `CHANGE`, `BLUR`, `VALIDATE_ALL`, `SET_STATUS`, `RESET`
  - `CHANGE`: cập nhật values, re-validate nếu đã touched
  - `BLUR`: đánh dấu touched, validate field
  - `VALIDATE_ALL`: validate tất cả fields + set touched tất cả
  - `SET_STATUS`: cập nhật status
  - `RESET`: trả về initialState

#### `src/context/FormContext.jsx`
- [ ] Tạo `FormContext`, `FormProvider` dùng `useReducer(formReducer, initialState)`
- [ ] Truyền `{ state, dispatch }` vào value
- [ ] Export custom hook `useFormContext()`

#### `src/components/form/FormField.jsx`
- [ ] Props: `name`, `label`, `type`, `placeholder`
- [ ] Dùng `useFormContext()` để đọc state và gọi dispatch
- [ ] Dispatch `CHANGE` khi onChange, `BLUR` khi onBlur
- [ ] Chỉ hiển thị lỗi khi field đã touched

#### `src/components/form/RegistrationForm.jsx`
- [ ] Render 4 `<FormField>`: fullName, email, password, confirmPassword
- [ ] Submit: dispatch `VALIDATE_ALL` → kiểm tra lỗi → dispatch `SET_STATUS 'submitting'` → chờ 1s → dispatch `SET_STATUS 'success'`
- [ ] Hiển thị thông báo thành công và nút "Đăng ký lại" (dispatch `RESET`) khi success
- [ ] Hiển thị banner lỗi khi status === 'error'

#### `src/pages/Ex03ValidationPage.jsx`
- [ ] Bọc trong `<FormProvider>`, render `<RegistrationForm />`

### Kiểm tra
```bash
npm test Ex03   # kỳ vọng: 7/7 pass
```

---

## Bài 4 – Theme Switcher `(useContext + useState)`

**Route:** `/ex04`  
**Mục tiêu:** Đổi giao diện Light / Dark / System, lưu lựa chọn vào localStorage.  
**Dữ liệu màu:** xem `src/data/themeConfig.js`

### TODO

#### `src/context/ThemeContext.jsx`
- [ ] Tạo `ThemeContext`, `ThemeProvider`
- [ ] State `mode`: đọc từ `localStorage` khi khởi tạo, mặc định `'system'`
- [ ] State `systemPrefersDark`: đọc từ `window.matchMedia`
- [ ] `useEffect`: lắng nghe thay đổi OS theme, cleanup khi unmount
- [ ] `resolvedTheme`: tính từ mode + systemPrefersDark
- [ ] `changeMode(newMode)`: set mode, lưu vào localStorage
- [ ] Dùng `useMemo` cho value để tránh re-render thừa
- [ ] Export custom hook `useTheme()`

#### `src/components/theme/ThemeNavbar.jsx`
- [ ] Dùng `useTheme()` lấy `mode`, `resolvedTheme`, `colors`, `changeMode`
- [ ] Render 3 nút từ `THEME_MODES` (import từ `themeConfig`)
- [ ] Highlight nút đang active, hiển thị `resolvedTheme`
- [ ] Áp dụng màu từ `colors`, không nhận màu qua props

#### `src/components/theme/ThemedCard.jsx`
- [ ] Dùng `useTheme()` lấy `colors`
- [ ] Props: `title`, `children`
- [ ] Áp dụng `colors.surface`, `colors.border`

#### `src/components/theme/ThemedButton.jsx`
- [ ] Dùng `useTheme()` lấy `colors`
- [ ] Props: `children`, `onClick`, `variant` ('primary' | 'outline')
- [ ] Áp dụng màu theo variant từ colors

#### `src/components/theme/ThemedInput.jsx`
- [ ] Dùng `useTheme()` lấy `colors`
- [ ] Props: `placeholder`
- [ ] Áp dụng `colors.background`, `colors.border`, `colors.text`

#### `src/pages/Ex04ThemePage.jsx`
- [ ] Bọc trong `<ThemeProvider>`
- [ ] Tạo component nội bộ `ThemePageContent` dùng `useTheme()` để set background/color wrapper
- [ ] Render `<ThemeNavbar />` và ít nhất 3 `<ThemedCard>` chứa các component khác

### Kiểm tra
```bash
npm test Ex04   # kỳ vọng: 7/7 pass
```

---

## Tiêu chí đánh giá

| Tiêu chí | Mô tả |
|---|---|
| **Đúng cấu trúc** | File đặt đúng thư mục, đặt tên theo convention |
| **Tách biệt** | Context / Reducer / Component / Page riêng biệt, không gộp logic |
| **useContext** | Dùng custom hook, kiểm tra null, không truyền state qua props |
| **useReducer** | Reducer pure function, action rõ ràng, không mutate state |
| **Test pass** | Tất cả test trong `src/tests/` pass |
