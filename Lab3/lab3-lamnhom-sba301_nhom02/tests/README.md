# Tests — Hướng Dẫn Cho Giảng Viên

Thư mục này chứa **hidden tests** dùng để chấm điểm tự động.

## Lưu ý quan trọng

- Trong môi trường **GitHub Classroom thực tế**, các file test này **KHÔNG** được đẩy vào
  repository template mà sinh viên nhìn thấy.
- Thay vào đó, chúng được lưu trong **private repository riêng** và tải xuống trong
  bước CI/CD thông qua GitHub Actions.
- Xem `GUIDE.md` để biết cách thiết lập đúng cho lớp học.

## Chấm điểm tổng

| Bài | Chủ đề | Điểm |
|-----|--------|------|
| 01 | Counter (useState) | 5 |
| 02 | Todo List (useState + CRUD) | 8 |
| 03 | Product Filter (useState + Filter) | 8 |
| 04 | Registration Form (useState + Validation) | 10 |
| 05 | Shopping Cart (useState + CRUD) | 12 |
| 06 | Student Management (useState + Modal + Filter) | 15 |
| 07 | Basic Routing (React Router) | 12 |
| 08 | Dynamic Routes (useParams + 404) | 10 |
| 09 | Blog & Search Params (useSearchParams) | 10 |
| 10 | Book Management (Full App) | 10 |
| **Tổng** | | **100** |

## Chạy tests cục bộ (giảng viên)

```bash
npm install
npm test
```
