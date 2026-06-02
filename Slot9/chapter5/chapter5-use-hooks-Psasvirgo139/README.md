[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DAWCOmMW)
# useReducer – Template Repository

> **GitHub Classroom template** – Sinh viên fork repo này, điền code vào các file skeleton, chạy test để kiểm tra.

## Yêu cầu

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | 18+ |
| npm     | 9+  |

## Cài đặt & chạy

```bash
npm install
npm run dev       # chạy ứng dụng (http://localhost:5173)
npm test          # chạy toàn bộ test
npm test -- Ex01  # chỉ chạy test bài 1
```

---

## Cấu trúc dự án

```
src/
  pages/
    Ex01_BasicCounter.jsx       ← Bài 1: Basic Counter
    Ex02_CounterWithStep.jsx    ← Bài 2: Counter với Step & History
    Ex03_TodoList.jsx           ← Bài 3: Todo List
    Ex04_ShoppingCart.jsx       ← Bài 4: Shopping Cart
    Ex05_FormValidation.jsx     ← Bài 5: Form Validation
  tests/
    Ex01.test.jsx               ← Test bài 1 (không sửa)
    Ex02.test.jsx               ← Test bài 2 (không sửa)
    Ex03.test.jsx               ← Test bài 3 (không sửa)
    Ex04.test.jsx               ← Test bài 4 (không sửa)
    Ex05.test.jsx               ← Test bài 5 (không sửa)
    setup.js                    ← Cấu hình test (không sửa)
  App.jsx
  main.jsx
```

> ⚠️ **Chỉ chỉnh sửa các file trong `src/pages/`.**  
> Không được xóa hoặc đổi tên các `data-testid` đã có sẵn.

---

## Bài 1 – Basic Counter

**File:** `src/pages/Ex01_BasicCounter.jsx`  
**Chạy test:** `npm test -- Ex01`

### Lý thuyết cần nắm
`useReducer(reducer, initialState)` trả về `[state, dispatch]`. Để cập nhật state, gọi `dispatch({ type: 'ACTION_TYPE' })`. Reducer là hàm thuần túy: `(state, action) => newState`.

### TODO checklist

- [ ] **TODO 1** – Định nghĩa `initialState = { count: 0 }`
- [ ] **TODO 2** – Viết `reducer(state, action)` với 3 case:
  - `INCREMENT`: trả `{ ...state, count: state.count + 1 }`
  - `DECREMENT`: trả `{ ...state, count: state.count - 1 }`
  - `RESET`: trả `initialState`
- [ ] **TODO 3** – Gọi `const [state, dispatch] = useReducer(reducer, initialState)`
- [ ] **TODO 4** – Hiển thị `state.count` trong `data-testid="count-display"`
- [ ] **TODO 5** – Nút Decrement gọi `dispatch({ type: 'DECREMENT' })`
- [ ] **TODO 6** – Nút Reset gọi `dispatch({ type: 'RESET' })`
- [ ] **TODO 7** – Nút Increment gọi `dispatch({ type: 'INCREMENT' })`

### Test cases (10 tests)
| # | Mô tả | Điểm |
|---|-------|------|
| 1 | Hiển thị count = 0 ban đầu | 1 |
| 2 | Có đủ 3 nút | 1 |
| 3 | Tăng lên 1 khi nhấn + | 1 |
| 4 | Tăng nhiều lần | 1 |
| 5 | Giảm xuống -1 | 1 |
| 6 | Count có thể âm | 1 |
| 7 | Reset về 0 sau tăng | 1 |
| 8 | Reset về 0 sau giảm | 1 |
| 9 | Tăng 5 giảm 2 → 3 | 1 |

---

## Bài 2 – Counter với Step & History

**File:** `src/pages/Ex02_CounterWithStep.jsx`  
**Chạy test:** `npm test -- Ex02`

### Lý thuyết cần nắm
State có thể là object phức tạp với nhiều trường. Action có thể mang dữ liệu qua `action.payload`. Dùng `.slice(-9)` để giới hạn mảng.

### TODO checklist

- [ ] **TODO 1** – `initialState = { count: 0, step: 1, history: [] }`
- [ ] **TODO 2** – Viết `reducer` với 4 case:
  - `INCREMENT`: count + step, lưu count cũ vào history (`.slice(-9)`)
  - `DECREMENT`: count - step, lưu count cũ vào history
  - `RESET`: trả về `initialState`
  - `SET_STEP`: cập nhật `step = action.payload`
- [ ] **TODO 3** – Gọi `useReducer`
- [ ] **TODO 4** – Hiển thị `state.count`
- [ ] **TODO 5** – Input step: `value={state.step}`, `onChange` dispatch `SET_STEP` với `Number(e.target.value)`
- [ ] **TODO 6** – Nút Decrement dispatch `DECREMENT`
- [ ] **TODO 7** – Nút Reset dispatch `RESET`
- [ ] **TODO 8** – Nút Increment dispatch `INCREMENT`
- [ ] **TODO 9** – Render `state.history.map(...)`, mỗi phần tử có `data-testid="history-item"`

### Test cases (9 tests)
| # | Mô tả | Điểm |
|---|-------|------|
| 1 | count = 0 ban đầu | 1 |
| 2 | history rỗng ban đầu | 1 |
| 3 | INCREMENT với step mặc định | 1 |
| 4 | SET_STEP rồi increment | 1 |
| 5 | Step 3 tăng 2 lần → 6 | 1 |
| 6 | Decrement với step | 1 |
| 7 | Reset về 0 | 1 |
| 8 | History lưu giá trị trước khi tăng | 1 |
| 9 | History không vượt 10 phần tử | 1 |

---

## Bài 3 – Todo List

**File:** `src/pages/Ex03_TodoList.jsx`  
**Chạy test:** `npm test -- Ex03`

### Lý thuyết cần nắm
State là mảng. Thêm phần tử: `[...state, newItem]`. Toggle: dùng `.map()`. Xóa: dùng `.filter()`. Derived state: tính toán từ state (không lưu vào reducer).

### TODO checklist

- [ ] **TODO 1** – `initialState = []`
- [ ] **TODO 2** – Viết `reducer` với 4 case:
  - `ADD_TODO`: `[...state, action.payload]`
  - `TOGGLE_TODO`: `.map()` đảo `done` của item khớp id
  - `DELETE_TODO`: `.filter()` loại bỏ item khớp id
  - `CLEAR_DONE`: `.filter(t => !t.done)`
- [ ] **TODO 3** – Gọi `useReducer`
- [ ] **TODO 4** – `handleAdd()`: kiểm tra rỗng, dispatch `ADD_TODO`, xóa input
- [ ] **TODO 5** – `pendingCount = state.filter(t => !t.done).length`
- [ ] **TODO 6** – Hiển thị `pendingCount` trong `data-testid="pending-count"`
- [ ] **TODO 7** – Nút Thêm gọi `handleAdd`
- [ ] **TODO 8** – Render `state.map(todo => ...)` với:
  - `data-testid={`todo-item-${todo.id}`}`
  - Nút toggle: `data-testid={`btn-toggle-${todo.id}`}`
  - Nút delete: `data-testid={`btn-delete-${todo.id}`}`
- [ ] **TODO 9** – Nút Clear Done dispatch `CLEAR_DONE`

### Test cases (11 tests)
| # | Mô tả | Điểm |
|---|-------|------|
| 1 | Danh sách rỗng ban đầu | 1 |
| 2 | pending-count = 0 ban đầu | 1 |
| 3 | Thêm một todo | 1 |
| 4 | pending-count tăng sau thêm | 1 |
| 5 | Không thêm khi input rỗng | 1 |
| 6 | Input xóa sau khi thêm | 1 |
| 7 | Toggle giảm pending-count | 1 |
| 8 | Toggle lại khôi phục pending-count | 1 |
| 9 | Xóa todo | 1 |
| 10 | Clear Done giữ lại todo chưa xong | 1 |
| 11 | Clear Done xóa todo đã xong | 1 |

---

## Bài 4 – Shopping Cart

**File:** `src/pages/Ex04_ShoppingCart.jsx`  
**Chạy test:** `npm test -- Ex04`

### Lý thuyết cần nắm
State lồng nhau: `{ items: [...] }`. `ADD_ITEM` cần kiểm tra item đã có chưa (dùng `.find()` rồi `.map()`). Derived state: tính `total` và `itemCount` từ `state.items`.

### TODO checklist

- [ ] **TODO 1** – `initialState = { items: [] }`
- [ ] **TODO 2** – Viết `reducer` với 4 case:
  - `ADD_ITEM`: nếu đã có → tăng qty; nếu chưa → thêm `{ ...product, qty: 1 }`
  - `REMOVE_ITEM`: lọc bỏ item theo id
  - `UPDATE_QTY`: nếu qty ≤ 0 thì xóa; nếu > 0 thì cập nhật
  - `CLEAR_CART`: trả về `initialState`
- [ ] **TODO 3** – Gọi `useReducer`
- [ ] **TODO 4** – Tính `total` và `itemCount` (derived state)
- [ ] **TODO 5** – Hiển thị `itemCount` trong `data-testid="item-count"`
- [ ] **TODO 6** – Nút Thêm dispatch `ADD_ITEM` với `payload = product`
- [ ] **TODO 7** – Render `state.items.map(...)` với:
  - `data-testid={`cart-row-${item.id}`}`
  - Input qty: `data-testid={`qty-input-${item.id}`}`, onChange dispatch `UPDATE_QTY`
  - Nút xóa: `data-testid={`btn-remove-${item.id}`}`, dispatch `REMOVE_ITEM`
- [ ] **TODO 8** – Hiển thị `total` trong `data-testid="cart-total"`
- [ ] **TODO 9** – Nút Clear Cart dispatch `CLEAR_CART`

### Test cases (11 tests)
| # | Mô tả | Điểm |
|---|-------|------|
| 1 | item-count = 0 ban đầu | 1 |
| 2 | cart-total = 0 ban đầu | 1 |
| 3 | Thêm sản phẩm 1 vào giỏ | 1 |
| 4 | item-count tăng sau thêm | 1 |
| 5 | Thêm 2 lần → qty = 2 | 1 |
| 6 | Total đúng sau khi thêm | 1 |
| 7 | Xóa sản phẩm | 1 |
| 8 | item-count về 0 sau xóa | 1 |
| 9 | UPDATE_QTY cập nhật item-count | 1 |
| 10 | qty = 0 → xóa item | 1 |
| 11 | CLEAR_CART xóa toàn bộ | 1 |

---

## Bài 5 – Form Validation

**File:** `src/pages/Ex05_FormValidation.jsx`  
**Chạy test:** `npm test -- Ex05`

### Lý thuyết cần nắm
State form gồm `values`, `errors`, `touched`, `submitted`. Dùng computed property name `[action.payload.field]` để cập nhật đúng trường. Validation tách biệt thành hàm `validate()`.

### TODO checklist

- [ ] **TODO 1** – Định nghĩa `initialState` với 4 trường
- [ ] **TODO 2** – Viết hàm `validate(values)` kiểm tra:
  - name: không rỗng
  - email: chứa `@`
  - password: ≥ 6 ký tự
  - confirm: bằng `values.password`
- [ ] **TODO 3** – Viết `reducer` với 3 case:
  - `SET_FIELD`: cập nhật `values`, `touched`, tính lại `errors`
  - `SUBMIT`: tính lại `errors`, mark tất cả `touched`, set `submitted` nếu không có lỗi
  - `RESET`: trả về `initialState`
- [ ] **TODO 4** – Gọi `useReducer`
- [ ] **TODO 5** – `getError(field)`: trả về lỗi nếu field đã touched
- [ ] **TODO 6** – `handleChange(e)`: dispatch `SET_FIELD`
- [ ] **TODO 7** – `handleSubmit(e)`: `e.preventDefault()` + dispatch `SUBMIT`
- [ ] **TODO 8** – Gắn `handleSubmit` vào `onSubmit` của form
- [ ] **TODO 9–12** – Gắn `value`, `name`, `onChange` cho các input
- [ ] **TODO 13** – Nút submit (type="submit")
- [ ] **TODO 14** – Nút Reset dispatch `RESET`

### Test cases (14 tests)
| # | Mô tả | Điểm |
|---|-------|------|
| 1 | Có đủ 4 input | 1 |
| 2 | Không hiện success ban đầu | 1 |
| 3 | Input cập nhật khi gõ | 1 |
| 4 | Lỗi name khi để trống | 1 |
| 5 | Lỗi email thiếu @ | 1 |
| 6 | Lỗi password < 6 ký tự | 1 |
| 7 | Lỗi confirm không khớp | 1 |
| 8 | Submit form rỗng → không thành công | 1 |
| 9 | Submit form rỗng → hiện lỗi | 1 |
| 10 | Submit hợp lệ → hiện form-success | 1 |
| 11 | Submit hợp lệ → không có lỗi | 1 |
| 12 | Reset xóa trắng input | 1 |
| 13 | Reset ẩn form-success | 1 |

---

## Bảng điểm tổng hợp

| Bài | Tên | Tests | Điểm |
|-----|-----|-------|------|
| 1 | Basic Counter | 9 | 9 |
| 2 | Counter với Step & History | 9 | 9 |
| 3 | Todo List | 11 | 11 |
| 4 | Shopping Cart | 11 | 11 |
| 5 | Form Validation | 13 | 13 |
| **Tổng** | | **53** | **53** |

> Điểm thực tế = (số test passed / 53) × 10

---

## Lưu ý quan trọng

1. **Không xóa** hoặc **đổi tên** `data-testid` đã có sẵn trong skeleton.
2. **Không sửa** file trong `src/tests/`.
3. Nếu component bị crash (lỗi JS), toàn bộ test của bài đó sẽ fail.
4. Đọc kỹ comment `// TODO N:` – mỗi TODO tương ứng với một bước nhỏ.
5. Tham khảo `GUIDE.md` để xem code mẫu hoàn chỉnh.
