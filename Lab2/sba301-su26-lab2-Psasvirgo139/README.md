[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/1D4Cx3EH)
# Lab 02 - Single Page Application with ReactJS (Orchids SPA)

Mã môn: **SBA301**
Template dành cho sinh viên thực hành Lab 02. Sinh viên clone project về, viết code vào các vị trí `TODO` trong từng component, sau đó chạy test để kiểm tra kết quả.

---

## 1. Mục tiêu của Lab

Sau khi hoàn thành sinh viên có khả năng:

1. Tạo và tổ chức một SPA với ReactJS.
2. Xây dựng các functional component, truyền dữ liệu qua **props**, quản lý state bằng **`useState`**.
3. Xử lý sự kiện (click button, đóng / mở Modal).
4. Sử dụng các thành phần của **react-bootstrap**: `Navbar`, `Container`, `Row`, `Col`, `Card`, `Button`, `Modal`, `Carousel`.
5. Hiển thị danh sách dữ liệu bằng `Array.map`.
6. Viết thêm component `BannerCarousel` để hiển thị banner ảnh từ một list.

---

## 2. Yêu cầu môi trường

| Công cụ | Phiên bản tối thiểu |
| -------- | -------------------- |
| Node.js  | 18.x                 |
| npm      | 9.x                  |

---

## 3. Cài đặt & chạy project

```bash
# 1. Clone project về máy
git clone <repo-url> orchids-react-template
cd orchids-react-template

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev

# 4. Mở trình duyệt
# http://localhost:5173
```

Lệnh khác:

```bash
npm run build       # build production
npm run test        # chạy test một lần
npm run test:watch  # chạy test ở chế độ watch
```

---

## 4. Cấu trúc thư mục

```
orchids-react-template/
├── .github/
│   ├── workflows/
│   │   └── classroom.yml           (Autograding workflow)
│   └── classroom/
│       └── autograding.json        (Classroom config)
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx                     <- TODO
    ├── index.css
    ├── components/
    │   ├── NavBar.jsx              <- TODO
    │   ├── BannerCarousel.jsx      <- TODO
    │   ├── OrchidCard.jsx          <- TODO
    │   ├── OrchidDetailModal.jsx   <- TODO
    │   └── Orchids.jsx             <- TODO
    ├── shared/
    │   ├── ListOfOrchids.js        (data, KHÔNG sửa)
    │   └── ListOfBanners.js        (data, KHÔNG sửa)
    └── tests/
        ├── setup.js
        ├── NavBar.test.jsx
        ├── BannerCarousel.test.jsx
        ├── OrchidCard.test.jsx
        ├── OrchidDetailModal.test.jsx
        ├── Orchids.test.jsx
        └── App.test.jsx
```

> Sinh viên **CHỈ** chỉnh sửa các file trong thư mục `src/components/` và `src/App.jsx`. Không sửa file trong `src/shared/` và `src/tests/`.

---

## 5. Cấu trúc dữ liệu

### 5.1. `ListOfOrchids.js`

Mỗi phần tử `orchid` có dạng:

```js
{
  id: '1',
  orchidName: 'Ceasar 4N',
  description: '...',
  category: 'Dendrobium',
  isSpecial: true,
  image: './images/1.jpg',
  origin: 'Vietnam',
  color: 'White',
  rating: 5
}
```

### 5.2. `ListOfBanners.js`

Mỗi phần tử `banner` có dạng:

```js
{
  id: 'b1',
  title: 'Welcome to Orchid World',
  caption: '...',
  image: './images/banners/banner1.jpg'
}
```

---

## 6. Nhiệm vụ chi tiết cho từng component

### 6.1. `src/components/NavBar.jsx`

Sử dụng `Navbar`, `Container`, `Nav` của **react-bootstrap**.

Yêu cầu:

1. Render một thẻ `<nav>` (do react-bootstrap `Navbar` tự sinh).
2. Hiển thị brand text là `Orchids`.
3. Có ít nhất một `Nav.Link` (ví dụ: Home, About, Contact).

Test kiểm tra: `src/tests/NavBar.test.jsx`.

### 6.2. `src/components/BannerCarousel.jsx`

Sử dụng `Carousel`, `Carousel.Item` của **react-bootstrap**.

Yêu cầu:

1. Import `BannersData` từ `../shared/ListOfBanners`.
2. Dùng `BannersData.map(...)` để render `Carousel.Item` cho từng banner.
3. Mỗi item bao gồm:
   - `<img>` với `src = banner.image`.
   - `Carousel.Caption` chứa `banner.title` và `banner.caption`.
4. Số lượng `.carousel-item` được render phải bằng `BannersData.length`.

Test kiểm tra: `src/tests/BannerCarousel.test.jsx`.

### 6.3. `src/components/OrchidCard.jsx`

Component nhận **props**:

| Prop          | Kiểu     | Ý nghĩa                                                    |
| ------------- | -------- | ---------------------------------------------------------- |
| `orchid`      | object   | Object orchid hiện tại                                     |
| `onShowDetail`| function | Callback được gọi khi nhấn nút Detail, nhận tham số orchid |

Yêu cầu:

1. Render `Card` của react-bootstrap.
2. `Card.Img` với `src = orchid.image`.
3. `Card.Title` hiển thị `orchid.orchidName`.
4. `Card.Text` hiển thị `orchid.category`.
5. Có `Button` với label `Detail`, khi click sẽ gọi `onShowDetail(orchid)`.

Test kiểm tra: `src/tests/OrchidCard.test.jsx`.

### 6.4. `src/components/OrchidDetailModal.jsx`

Component nhận **props**:

| Prop      | Kiểu     | Ý nghĩa                            |
| --------- | -------- | ---------------------------------- |
| `show`    | boolean  | Trạng thái hiển thị modal          |
| `orchid`  | object   | Orchid đang được chọn (có thể null)|
| `onClose` | function | Callback gọi khi đóng modal        |

Yêu cầu:

1. Sử dụng `Modal` của react-bootstrap với prop `show` và `onHide={onClose}`.
2. `Modal.Title` hiển thị `orchid.orchidName` (khi `orchid` khác null).
3. `Modal.Body` chứa `<img src={orchid.image} />` và `<p>{orchid.description}</p>`.
4. `Modal.Footer` có `Button` `Close`, khi click gọi `onClose`.

Test kiểm tra: `src/tests/OrchidDetailModal.test.jsx`.

### 6.5. `src/components/Orchids.jsx`

Đây là component cha quản lý state và phối hợp các component con.

Yêu cầu:

1. Khai báo 2 state bằng `useState`:
   - `show` (boolean, mặc định `false`).
   - `selectedOrchid` (object | null, mặc định `null`).
2. Viết 2 hàm xử lý sự kiện:
   - `handleShow(orchid)` → set `selectedOrchid = orchid`, `show = true`.
   - `handleClose()` → set `show = false`.
3. Render `Container` chứa `Row`, trong đó duyệt `OrchidsData.map(...)`:
   - Mỗi `Col md={3}` chứa một `<OrchidCard orchid={...} onShowDetail={handleShow} />`.
4. Cuối cùng render `<OrchidDetailModal show={show} orchid={selectedOrchid} onClose={handleClose} />`.

Test kiểm tra: `src/tests/Orchids.test.jsx`.

### 6.6. `src/App.jsx`

Kết hợp tất cả lại:

1. Render `<NavBar />`.
2. Render `<BannerCarousel />`.
3. Render `<Orchids />`.

---

## 7. Chạy & đọc kết quả test

### Chạy toàn bộ test

```bash
npm run test
```

Ví dụ output mong đợi khi hoàn thành đầy đủ:

```
 Test Files  5 passed (5)
      Tests  20 passed (20)
```

### Chạy test cho một file cụ thể

```bash
npx vitest run src/tests/OrchidCard.test.jsx
```

### Chế độ watch (tự động chạy lại khi save file)

```bash
npm run test:watch
```

---

## 8. Bảng điểm gợi ý (tổng 10 điểm)

| Tiêu chí                               | Điểm |
| -------------------------------------- | ---- |
| `NavBar` render đúng                   | 1.0  |
| `BannerCarousel` render đúng số banner | 2.0  |
| `OrchidCard` render & sự kiện đúng     | 2.0  |
| `OrchidDetailModal` render & đóng/mở  | 2.0  |
| `Orchids` quản lý state, mở Modal     | 2.0  |
| `App.jsx` lắp ráp đầy đủ              | 1.0  |

---

## 9. Autograding (GitHub Classroom)

Project đã tích hợp sẵn **GitHub Classroom Autograding**. Mỗi lần sinh viên `git push` lên repository assignment của mình:

1. GitHub Actions tự động chạy workflow trong `.github/workflows/classroom.yml`.
2. Mỗi component được chấm độc lập bằng `vitest`.
3. Điểm được map theo cấu hình `.github/classroom/autograding.json`:

| Test file                            | Điểm tối đa |
| ------------------------------------ | ----------- |
| `tests/NavBar.test.jsx`              | 1.0         |
| `tests/BannerCarousel.test.jsx`      | 2.0         |
| `tests/OrchidCard.test.jsx`          | 2.0         |
| `tests/OrchidDetailModal.test.jsx`   | 2.0         |
| `tests/Orchids.test.jsx`             | 2.0         |
| `tests/App.test.jsx` (integration)   | 1.0         |
| **Tổng**                             | **10.0**    |

> Quy tắc tính điểm của command-grader: nếu tất cả test trong 1 file pass thì sinh viên được trọn số điểm của file đó. Nếu có bất kỳ test nào fail trong file → 0 điểm cho file đó.

### Cách xem điểm

- Vào tab **Actions** trên GitHub repository → chọn lần chạy mới nhất → mở job `run-autograding-tests` → xem cột "Autograding Reporter".
- Giảng viên xem tổng điểm tập trung tại dashboard **GitHub Classroom**.

### Hướng dẫn dành cho giảng viên tạo assignment

1. Tạo template repository từ project này trên GitHub (Settings → Template repository → ON).
2. Tại GitHub Classroom, tạo Assignment mới chọn template repository ở trên.
3. Khi cấu hình autograding, Classroom sẽ tự đọc file `.github/classroom/autograding.json`.
4. Gửi invitation link cho sinh viên — mỗi sinh viên có 1 repository riêng.

### Chạy lại autograding tại chỗ (local) trước khi push

```bash
npm run test
```

Nếu local pass hết 23 test → push lên repo điểm sẽ là 10.0.

---

## 10. Lưu ý khi làm bài

- Không xóa hoặc đổi tên các file test, các file trong `.github/`.
- Không sửa file trong `src/shared/`.
- Tên export, tên props phải đúng như mô tả (case-sensitive).
- Khi click nút **Detail**, **bắt buộc** truyền `orchid` vào callback `onShowDetail`.
- Nút đóng Modal **bắt buộc** có chữ `Close`.
- Đảm bảo đã `import 'bootstrap/dist/css/bootstrap.min.css'` (đã có sẵn trong `main.jsx`).
- Nếu workflow Actions không chạy: kiểm tra Settings → Actions → "Allow all actions" đã bật.

Chúc các em hoàn thành bài thực hành tốt!
