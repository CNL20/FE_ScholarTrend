# Hướng Dẫn Test & Đánh Giá Mapping API (ScholarTrend)

Dựa trên việc kiểm tra mã nguồn thực tế ở cả hai phía Backend (`ScholarTrend.API`) và Frontend (`FE_ScholarTrend`), dưới đây là báo cáo về tình trạng khớp nối (mapping) giữa các API và hướng dẫn chi tiết cách test toàn bộ hệ thống.

---

## Phần 1: Tình trạng Mapping API (FE vs BE)

Nhìn chung, đa số các service của FE đã gọi đúng các endpoint bên BE. Tuy nhiên, vẫn còn một số điểm chưa đồng bộ cần lưu ý:

### ⚠️ Các API có ở Frontend nhưng KHÔNG có ở Backend (Cần BE bổ sung):
1. **AdminService:**
   - `GET /api/admin/stats` (Frontend gọi nhưng BE không có route này, BE chỉ có `/api/admin/dashboard`).
   - `DELETE /api/admin/users/{id}` (Frontend có hàm xoá user nhưng BE không hỗ trợ, BE chỉ hỗ trợ PATCH đổi status/role).
2. **PaperService:**
   - `GET /api/papers/recent` (Frontend gọi báo cáo bài báo gần đây nhưng BE không có route này).
   - `POST /api/papers/{id}/view` (Frontend có hàm tính lượt view nhưng BE chưa triển khai endpoint).
3. **TrendService:**
   - `GET /api/trends/overview`
   - `GET /api/trends/by-year`

### ⚠️ Các API có ở Backend nhưng CHƯA ĐƯỢC GỌI ở Frontend (Cần FE bổ sung):
1. **Dashboard:**
   - `GET /api/dashboard/overview` (Frontend chỉ mới gọi `personal`).
2. **Papers:**
   - `GET /api/papers/aggregate` (Thống kê tổng).
   - `GET /api/papers/by-topic/{topicId}`
   - `GET /api/papers/by-journal/{journalId}`
3. **Reports:**
   - `GET /api/reports/export/json` (Xuất báo cáo dạng JSON).
   - `GET /api/reports/export/csv` (Xuất báo cáo dạng CSV).

> **Lời khuyên:** Các bạn dev FE & BE cần họp lại để thống nhất thêm/bỏ các API bị lệch này để tránh lỗi 404 Not Found khi chạy thực tế.

---

## Phần 2: Hướng Dẫn Test Toàn Diện (Test Cases)

Để test hệ thống chuẩn nhất, hãy sử dụng **Postman** hoặc thao tác trực tiếp trên giao diện Frontend (kèm bật F12 - tab Network).

### 1. Module Xác Thực (Auth)
**Mục đích:** Đảm bảo luồng đăng nhập, đăng ký và lấy token hoạt động tốt.
- **[ ] Đăng ký:** Test form đăng ký (`POST /api/auth/register`). Kiểm tra xem mật khẩu có bị mã hoá trong DB không, có gửi email xác thực không.
- **[ ] Xác thực Email:** Test click link/nhập code xác thực (`POST /api/auth/verify-email`). Thử yêu cầu gửi lại email (`POST /api/auth/resend-verification`).
- **[ ] Đăng nhập:** Test login với tài khoản đúng/sai (`POST /api/auth/login`). Phải nhận được `accessToken` và `refreshToken`.
- **[ ] Quên mật khẩu:** Test luồng quên mật khẩu (`POST /api/auth/forgot-password`) và đặt lại mật khẩu (`POST /api/auth/reset-password`).
- **[ ] Cập nhật Profile:** Test cập nhật thông tin cá nhân (`PUT /api/auth/profile`) và xem lại (`GET /api/auth/profile`).

### 2. Module Dành Cho Quản Trị Viên (Admin)
**Mục đích:** Kiểm tra quyền admin, quản lý user và tính năng đồng bộ (Sync). *Lưu ý: Phải có Token của Role Admin.*
- **[ ] Dashboard/Stats:** Gọi thử API `GET /api/admin/dashboard` để xem số liệu có trả về đầy đủ hay không.
- **[ ] Quản lý Users:** 
  - Lấy danh sách users: `GET /api/admin/users`.
  - Khoá/Mở khoá tài khoản: `PATCH /api/admin/users/{id}/status`.
  - Đổi quyền user (User <-> Admin): `PATCH /api/admin/users/{id}/role`.
- **[ ] Cấu hình Đồng bộ (Sync):**
  - Xem danh sách Data Sources: `GET /api/admin/sync/data-sources`.
  - Xem lịch sử đồng bộ: `GET /api/admin/sync/schedule/history`.
  - Duyệt/Từ chối dữ liệu chờ: `POST /api/admin/sync/pending/{id}/approve` và `/reject`.
  - Chạy đồng bộ thủ công: `POST /api/admin/sync/trigger`.

### 3. Module Bài Báo Khoa Học (Papers)
**Mục đích:** Test tính năng cốt lõi - tìm kiếm và hiển thị bài báo.
- **[ ] Tìm kiếm bài báo:** Test API `GET /api/papers/search` với các tham số: `query`, `year`, `authorId`. Kiểm tra xem phân trang (Pagination) có hoạt động không.
- **[ ] Chi tiết bài báo:** Xem thông tin một bài (`GET /api/papers/{id}`).
- **[ ] Lịch sử tìm kiếm:** Đăng nhập và tìm kiếm, sau đó gọi `GET /api/papers/search-history` xem có lưu lại keyword không.

### 4. Module Bookmark & Follow
**Mục đích:** Test tính năng theo dõi chuyên mục và lưu bài viết cá nhân.
- **[ ] Bookmark:** 
  - Thêm bài báo vào danh sách lưu: `POST /api/bookmarks/{paperId}`.
  - Lấy danh sách đã lưu: `GET /api/bookmarks`.
  - Huỷ lưu bài: `DELETE /api/bookmarks/{paperId}`.
- **[ ] Follows:**
  - Follow Tác giả/Topic/Journal: `POST /api/follows/authors/{id}`, `topics/{id}`, `journals/{id}`.
  - Xem danh sách đang follow: `GET /api/follows/authors`, `topics`, `journals`.

### 5. Module Xu Hướng & Thống Kê (Trends)
**Mục đích:** Kiểm tra biểu đồ và phân tích từ khoá.
- **[ ] Keywords/Topics top đầu:** Gọi `GET /api/trends/keywords/top` và `GET /api/trends/topics/top` xem có trả về dữ liệu đúng số lượng giới hạn không.
- **[ ] Dashboard Xu hướng:** Gọi `GET /api/trends/dashboard` kiểm tra dữ liệu dạng mảng (để Frontend vẽ biểu đồ Line/Bar chart).
- **[ ] So sánh Xu hướng:** Test API `POST /api/trends/compare` (thường gửi mảng các từ khoá cần so sánh).

### 6. Module Thông báo (Notifications)
**Mục đích:** Test cơ chế cảnh báo, thông báo khi có thay đổi.
- **[ ] Lấy thông báo:** `GET /api/notifications` kiểm tra danh sách.
- **[ ] Đếm chưa đọc:** `GET /api/notifications/unread-count`.
- **[ ] Đánh dấu đã đọc:** Thử click một thông báo gọi `PATCH /api/notifications/{id}/read` và `PATCH /api/notifications/read-all`.
- **[ ] Settings:** Test bật/tắt nhận email hoặc nhận thông báo đẩy (`PUT /api/notifications/settings`).

---

### Hướng Dẫn Kịch Bản Test (End-to-End)
1. Tạo một tài khoản mới -> Check Mail xác nhận.
2. Đăng nhập bằng tài khoản vừa tạo.
3. Vào trang Home -> Tìm kiếm 1 bài báo bất kỳ (ví dụ: "AI trong Y tế").
4. Bấm vào chi tiết bài báo -> Bấm nút **Bookmark**.
5. Bấm vào tên Tác giả -> Bấm **Follow** Tác giả.
6. Chuyển sang trang Cá nhân (Dashboard personal) -> Xem Bài báo đã Bookmark & Tác giả đang Follow.
7. Đăng xuất.
8. Đăng nhập lại bằng tài khoản **Admin**.
9. Vào trang Quản lý User -> Tìm tài khoản vừa tạo -> Bấm **Khoá** (Inactive).
10. Dùng tài khoản bị khoá đăng nhập thử -> Phải nhận được thông báo lỗi *Account is locked*.
