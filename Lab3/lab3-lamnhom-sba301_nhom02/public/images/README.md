# Thư Mục Ảnh

Đặt ảnh vào đúng thư mục con tương ứng với từng bài tập.

## Cấu Trúc

```
public/images/
├── products/          ← Bài 03, 05, 08 (10 sản phẩm)
│   ├── ao-thun.jpg
│   ├── quan-jeans.jpg
│   ├── giay-sneaker.jpg
│   ├── ao-khoac.jpg
│   ├── tui-xach.jpg
│   ├── quan-short.jpg
│   ├── mu-luoi-trai.jpg
│   ├── dep-sandal.jpg
│   ├── ao-polo.jpg
│   └── balo.jpg
├── books/             ← Bài 10 (6 sách)
│   ├── js-book.jpg
│   ├── react-book.jpg
│   ├── ux-book.jpg
│   ├── pm-book.jpg
│   ├── db-book.jpg
│   └── testing-book.jpg
└── blog/              ← Bài 09 (8 bài blog)
    ├── react-hooks.jpg
    ├── usestate.jpg
    ├── router.jpg
    ├── css.jpg
    ├── api.jpg
    ├── useeffect.jpg
    ├── grid.jpg
    └── performance.jpg
```

## Lưu Ý

- Nếu không có ảnh, component vẫn hoạt động bình thường (ảnh bị lỗi load).
- Kích thước khuyến nghị: **400×300px** (tỉ lệ 4:3)
- Định dạng: `.jpg` hoặc `.png`
- Không có ảnh thì để thư mục trống — tests vẫn chạy bình thường.
