# Hướng Dẫn Kiểm Thử API Với Postman — Assignment 02 (TODO-07)

Tài liệu này hướng dẫn từng bước kiểm thử toàn bộ RESTful API của FUNewsManagementSystem bằng Postman, dùng collection có sẵn tại `postman/A2_FUNewsManagement.postman_collection.json`.

---

## Bước 1 — Chuẩn bị

1. Cài Postman: tải tại https://www.postman.com/downloads/ (bản desktop, không cần đăng nhập vẫn dùng được).
2. **Chạy Backend trước:** mở IntelliJ → Run `A2Application` → chờ log `Tomcat started on port 8080`.
3. **Kiểm tra database sạch:** nếu đã test trước đó, chạy lại script SQL để dữ liệu mẫu đúng trạng thái ban đầu (một số request tạo/xóa dữ liệu).
4. Kiểm tra nhanh bằng trình duyệt: mở http://localhost:8080/api/tags → thấy JSON 9 tags là BE đã sẵn sàng.

## Bước 2 — Import collection

1. Mở Postman → nút **Import** (góc trên trái).
2. Kéo thả file `postman/A2_FUNewsManagement.postman_collection.json` vào (hoặc chọn **files** → duyệt tới file).
3. Sidebar trái xuất hiện collection **A2 FUNewsManagement - SBA301** gồm 5 folder:

| Folder | Số request | Kiểm thử gì |
|---|---|---|
| 1. Auth | 3 | Login đúng/sai/validate email |
| 2. Accounts (Admin) | 9 | CRUD + Search + ràng buộc xóa + trùng ID |
| 3. Categories (Staff) | 7 | CRUD + Search + ràng buộc xóa |
| 4. News Articles (Staff) | 9 | CRUD + Search + tags + public + history |
| 5. Tags | 1 | Danh sách tag |

## Bước 3 — Kiểm tra biến baseUrl

1. Click vào tên collection → tab **Variables**.
2. Biến `baseUrl` phải là `http://localhost:8080/api`. Nếu BE chạy port khác, sửa cột **Current value** → **Save** (Ctrl+S).
3. Mọi request trong collection dùng dạng `{{baseUrl}}/accounts` nên chỉ cần sửa 1 chỗ.

## Bước 4 — Chạy thử request đầu tiên (hiểu cách đọc kết quả)

Lấy ví dụ **1. Auth → Login - success (200)**:

1. Click request → xem tab **Body** (raw JSON):

```json
{
  "email": "EmmaWilliam@FUNewsManagement.org",
  "password": "@1"
}
```

2. Bấm **Send**.
3. Đọc kết quả ở khung dưới:
   - **Status:** phải là `200 OK` (hiện cạnh thời gian phản hồi).
   - **Body:** JSON account — có `accountId`, `accountName`, `accountRole`, và **không có** `accountPassword`.
   - Tab **Test Results:** phải hiện `PASS` cho cả 2 test:
     - `Status 200`
     - `Tra ve account info, khong lo password`

> Mỗi request trong collection đều có sẵn test script ở tab **Scripts → Post-response**. Request được coi là ĐẠT khi mọi dòng trong Test Results đều PASS (màu xanh).

## Bước 5 — Chạy lần lượt 29 request theo thứ tự

⚠️ **Phải chạy đúng thứ tự trong từng folder, folder 2 → 3 → 4 tuần tự**, vì các request sau dùng dữ liệu của request trước (VD: tạo account 99 rồi mới update/delete 99; tạo category rồi lưu id vào biến `newCategoryId`).

### Folder 1 — Auth

| # | Request | Send xong phải thấy |
|---|---|---|
| 1 | Login - success | 200, có account info, không có password |
| 2 | Login - wrong password | 401, message `Invalid email or password` |
| 3 | Login - invalid email format | 400 (Bean Validation chặn trước khi vào service) |

### Folder 2 — Accounts (Admin)

| # | Request | Send xong phải thấy |
|---|---|---|
| 1 | Get all accounts | 200, mảng 5 account mẫu |
| 2 | Create account | 201, echo account id 99 |
| 3 | Create account - duplicate id | 409, message trùng AccountId |
| 4 | Create account - missing fields | 400, `message` là object liệt kê lỗi từng field |
| 5 | Search accounts (q=emma) | 200, tìm ra Emma William |
| 6 | Update account | 200, `accountName` = "Test User Updated" |
| 7 | Delete account - has articles (id 1) | **409** — account 1 đã tạo bài viết, KHÔNG xóa được |
| 8 | Delete account - no articles (id 99) | 204 No Content |
| 9 | Get account - not found (9999) | 404 |

> Request 7 chính là ràng buộc nghiệp vụ quan trọng nhất của phần Account — nếu nhận 204 ở đây nghĩa là bạn CHƯA cài ràng buộc, sẽ mất điểm.

### Folder 3 — Categories (Staff)

| # | Request | Send xong phải thấy |
|---|---|---|
| 1 | Get all categories | 200, 5 category mẫu |
| 2 | Create category | 201, có `categoryId` tự sinh (IDENTITY). Test script tự lưu id vào biến `newCategoryId` |
| 3 | Create category - blank name | 400 |
| 4 | Search categories (q=news) | 200 |
| 5 | Update category | 200 (URL dùng `{{newCategoryId}}` — tự lấy từ bước 2) |
| 6 | Delete category - in use (id 1) | **409** — category 1 đang được bài viết dùng |
| 7 | Delete category - unused | 204 (xóa category test vừa tạo) |

### Folder 4 — News Articles (Staff)

| # | Request | Send xong phải thấy |
|---|---|---|
| 1 | Get public news - no auth | 200, test script kiểm tra **mọi phần tử có `newsStatus = true`** |
| 2 | Get all news | 200 (bao gồm cả tin inactive nếu có) |
| 3 | Create news with tags | 201, `tags` có đúng 2 phần tử, `createdDate` không null |
| 4 | Create news - missing headline | 400 |
| 5 | Search news (q=alumni) | 200 |
| 6 | Get news history of staff (id 1) | 200, mọi tin có `createdById = 1` |
| 7 | Update news - change tags | 200, `tags` còn 1 phần tử, `modifiedDate` không null |
| 8 | Delete news (PM-01) | 204 — không lỗi FK (đã clear NewsTag trước khi xóa) |
| 9 | Get news - not found | 404 |

### Folder 5 — Tags

| # | Request | Send xong phải thấy |
|---|---|---|
| 1 | Get all tags | 200, 9 tags mẫu |

## Bước 6 — Chạy cả collection bằng Collection Runner (báo cáo tổng)

1. Click chuột phải vào collection → **Run collection** (hoặc nút **Run** khi mở collection).
2. Giữ nguyên thứ tự request, **Iterations = 1**, Delay = 0.
3. ⚠️ Trước khi Run: **chạy lại script SQL** để reset dữ liệu (vì lần chạy tay ở Bước 5 đã tạo/xóa dữ liệu — ví dụ account 99 đã bị xóa, chạy lại create sẽ vẫn đúng, nhưng nếu DB đang lệch trạng thái thì vài test phụ thuộc thứ tự có thể fail).
4. Bấm **Run A2 FUNewsManagement - SBA301**.
5. Kết quả đạt chuẩn: **All tests passed** — 0 failed trên tổng số test.
6. **Chụp màn hình kết quả runner** (hiện số Passed/Failed) để nộp làm minh chứng TODO-07.
7. Có thể **Export Results** (nút góc phải) ra file JSON đính kèm bài nộp.

Sau khi chạy xong, commit: `test(TODO-07): verify all endpoints with postman collection`

## Bước 7 — Xử lý lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| `Error: connect ECONNREFUSED 127.0.0.1:8080` | BE chưa chạy hoặc sai port | Run `A2Application`, kiểm tra `server.port` |
| Mọi request trả 404 | Sai `baseUrl` (thiếu `/api`) hoặc sai `@RequestMapping` | Kiểm tra biến collection + prefix `/api` trong controller |
| 500 khi login | Chưa có dữ liệu SystemAccount | Chạy lại script SQL insert dữ liệu mẫu |
| Delete account 1 trả 204 thay vì 409 | Thiếu check `existsByCreatedBy_AccountId` trong `AccountService.delete` | Bổ sung ràng buộc (TODO-05) |
| Delete news lỗi 500 (FK constraint) | Chưa `tags.clear()` trước khi delete | Sửa `NewsArticleService.delete` |
| 400 nhưng message không có lỗi từng field | Thiếu `@Valid` trên `@RequestBody` hoặc thiếu `GlobalExceptionHandler` | Kiểm tra TODO-06 |
| Response login có `accountPassword` | Thiếu `@JsonIgnore` / dùng entity thay vì DTO | Sửa TODO-02/TODO-04 |
| Update category trả 200 nhưng test fail vì URL có chữ `{{newCategoryId}}` | Chưa chạy request Create category trước đó | Chạy đúng thứ tự trong folder |
| Tiếng Việt trong response bị lỗi font | Console Postman hiển thị ổn, do DB collation | Không ảnh hưởng chấm điểm; đảm bảo cột dùng `nvarchar` |

## Bước 8 — (Tùy chọn) Tự viết thêm test script

Mở tab **Scripts → Post-response** của request bất kỳ, cú pháp chuẩn:

```javascript
// Kiểm tra status code
pm.test('Status 200', () => pm.response.to.have.status(200));

// Kiểm tra field trong body
pm.test('Co accountId', () => {
    const body = pm.response.json();
    pm.expect(body).to.have.property('accountId');
    pm.expect(body.accountRole).to.be.oneOf([1, 2]);
});

// Kiểm tra mảng
pm.test('Tra ve mang khong rong', () => {
    pm.expect(pm.response.json()).to.be.an('array').that.is.not.empty;
});

// Luu bien dung cho request sau
pm.collectionVariables.set('myId', pm.response.json().categoryId);

// Kiem tra thoi gian phan hoi
pm.test('Phan hoi < 1s', () => pm.expect(pm.response.responseTime).to.be.below(1000));
```

---

## Tóm tắt tiêu chí ĐẠT của TODO-07

- [ ] Import collection thành công, `baseUrl` đúng
- [ ] Chạy tay đủ 29 request theo thứ tự, hiểu ý nghĩa từng expected status
- [ ] 2 request ràng buộc xóa (Delete account 1, Delete category 1) trả đúng **409**
- [ ] `/news/public` chỉ trả tin active
- [ ] Không response nào chứa password
- [ ] Collection Runner: **0 failed** + chụp màn hình minh chứng
- [ ] Commit `test(TODO-07): verify all endpoints with postman collection`
