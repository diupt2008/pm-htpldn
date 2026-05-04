# Kế Hoạch Kiểm Thử - SRS-FR-10: Quản Trị Hệ Thống — Submenu Nhật Ký Hệ Thống

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-04-18  
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), Session ID `71e9ecd6`  
> **SRS Reference**: FR-VIII-28, SCR-VIII-10 (MH-10.10)  
> **Prototype**: https://prototype-dusky-alpha.vercel.app/

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- **Màn hình Nhật ký hệ thống** (SCR-VIII-10 / MH-10.10)
- Chức năng: Hiển thị toàn bộ **audit log** của toàn hệ thống
- Ghi nhận mọi thao tác: **CUD** (Tạo/Sửa/Xóa), **Phê duyệt/Từ chối**, **Đăng nhập/Đăng xuất**
- Dữ liệu nhật ký: **Bất biến (immutable)**, lưu trữ 5 năm, **tuyệt đối không cho phép sửa hay xóa**
- Quyền truy cập: **Chỉ QTHT** (Quản trị hệ thống), **chế độ chỉ đọc (read-only)**
- **Breadcrumb**: "Trang chủ > Quản trị hệ thống > Nhật ký hệ thống"

### 1.2 Các thành phần UI chính

| # | Thành phần | Mô tả |
|---|------------|--------|
| 1 | Toolbar | Tiêu đề "Nhật ký Hệ thống" + Nút [Xuất Excel] |
| 2 | Thanh bộ lọc | 5 tiêu chí lọc + Nút [Tìm kiếm] + Nút [Xóa bộ lọc] |
| 3 | Bảng dữ liệu | 8 cột, read-only, sticky header, expandable row |
| 4 | Footer phân trang | 50 mục/trang (mặc định), page size: 10/20/50/100, total count |
| 5 | Empty state | "Không tìm thấy nhật ký phù hợp." |

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Các cột hiển thị trên bảng dữ liệu

| # | Cột | Kiểu | Hành vi |
|---|-----|------|---------|
| 1 | Thời gian | datetime | dd/mm/yyyy HH:mm:ss. Mặc định sort DESC. Cột duy nhất sortable. |
| 2 | Người dùng | text | Hiển thị ho_ten |
| 3 | Đơn vị | text | Hiển thị ten_don_vi (không phải mã) |
| 4 | Module | text | Module nghiệp vụ |
| 5 | Entity | text | Tên bảng dữ liệu bị tác động |
| 6 | Mã bản ghi | identifier | ID số (khóa chính hệ thống, entity_id) |
| 7 | Loại thao tác | badge | Tạo=xanh, Sửa=vàng, Xóa=đỏ, Duyệt=xanh lá, Từ chối=cam, Đăng nhập=xám, Đăng xuất=xám |
| 8 | Chi tiết thay đổi | JSON diff | Expandable row. Format: old_value → new_value |

### 2.2 Bộ lọc (Filter Bar)

| # | Tiêu chí | Loại component | Chi tiết |
|---|----------|----------------|----------|
| 1 | Từ ngày – Đến ngày | DatePicker Range | Validation: tu_ngay <= den_ngay. Format: dd/mm/yyyy. Cho phép chọn ngày tương lai. ⚠️ SRS Gap: Không có giá trị mặc định, không giới hạn khoảng thời gian tối đa. |
| 2 | Người dùng | Dropdown searchable | Trỏ đến TAI_KHOAN. Hiển thị TẤT CẢ tài khoản (kể cả đã khóa/vô hiệu). |
| 3 | Module | Dropdown | 12 giá trị cố định: Hỏi đáp, Đào tạo, CG-TVV, Vụ việc, Chi trả, DN, Đánh giá, Biểu mẫu, Quản trị, Báo cáo, Tư vấn, CT HTPLDN |
| 4 | Loại thao tác | Dropdown | 7 giá trị UI: Tạo, Sửa, Xóa, Phê duyệt, Từ chối, Đăng nhập, Đăng xuất. ⚠️ SRS Gap: DB có 9 loại (thêm PUBLISH, UNPUBLISH) nhưng UI chỉ hiển thị 7. |
| 5 | Entity | Text input | Tìm theo tên bảng hoặc mã bản ghi. ⚠️ Dùng Full-text search (EC-DATA-SEARCH) do bảng > 10.000 records. |

### 2.3 Quy tắc chung (DG / BR / EC) áp dụng

| Mã | Quy tắc | Trích dẫn SRS |
|----|---------|---------------|
| DG-01 | Định dạng ngày: dd/mm/yyyy hoặc dd/mm/yyyy HH:mm | I18N-03 |
| DG-05 | Sticky header khi scroll | Tiêu đề cột ghim cố định khi cuộn |
| DG-06 | Sắp xếp mặc định: Theo thời gian cập nhật mới nhất (DESC) | DG-06 |
| BR-AUTH-01 | Yêu cầu đăng nhập + vai trò QTHT | Preconditions SCR-VIII-10 |
| BR-AUTH-06 | Session CMS: 30p idle timeout. Modal cảnh báo tại 25p | BR-AUTH-06 |
| BR-DATA-05 | Audit log immutable, lưu trữ 5 năm | BR-DATA-05 |
| BR-DATA-06 | Xuất Excel: File xuất theo bộ lọc hiện tại. Format .xlsx. Max 50.000 dòng. | BR-DATA-06 |
| EC-DATA-PAGE | Phân trang: page >= 1. Page vượt max → danh sách rỗng + total_count. Page <= 0 → ERR-PARAM-01 | EC-DATA-PAGE |
| EC-DATA-SEARCH | Bảng > 10.000 records: dùng full-text search thay vì LIKE | EC-DATA-SEARCH |
| PERF-04 | Bảng > 100.000 records: Response time target < 3 giây tại client | PERF-04 |
| UI-04 | Thông báo lỗi/thành công dạng Toast notification | UI-04 |
| UI-07 | Desktop-only. Min-width 1024px. Tối ưu ≥ 1280px | UI-07 |

### 2.4 Xử lý JSON Diff theo loại thao tác

| Loại thao tác | du_lieu_cu | du_lieu_moi | Hiển thị UI |
|---------------|-----------|-------------|-------------|
| Tạo (CREATE) | NULL/rỗng | Snapshot JSON đầy đủ | Trống → {JSON mới} |
| Sửa (UPDATE) | Snapshot trước khi sửa | Snapshot sau khi sửa | {JSON cũ} → {JSON mới} |
| Xóa (DELETE) | Snapshot trước khi xóa | NULL/rỗng | {JSON cũ} → Trống |
| Đăng nhập/Đăng xuất | — | — | ⚠️ SRS Gap: Không rõ entity_type và entity_id |

### 2.5 Xuất Excel

| Thuộc tính | Quy định |
|------------|----------|
| Phạm vi | Theo bộ lọc hiện tại (BR-DATA-06) |
| Định dạng | .xlsx |
| Giới hạn | Tối đa 50.000 dòng |
| Khi vượt 50.000 | Truncate 50.000 dòng đầu, hiển thị Warning (WRN-RPT-01) |
| UX Flow | Toast: "Đang tạo file..." → "Xuất thành công" + auto-download |
| ⚠️ SRS Gap | Không có quy ước đặt tên file, không liệt kê cột trong file xuất |

### 2.6 Error Codes

| Mã lỗi | Điều kiện | Message | Severity |
|---------|-----------|---------|----------|
| ERR-AUTH-01 | User không phải QTHT truy cập | "Bạn không có quyền thực hiện chức năng này" (Toast) | ERROR |
| ERR-AUTH-02 | Session hết hạn (30p idle) | Redirect về trang đăng nhập | ERROR |
| ERR-PARAM-01 | Số trang ≤ 0 hoặc page_size ngoài phạm vi | "Tham số phân trang không hợp lệ" | ERROR |
| WRN-RPT-01 | Xuất Excel > 50.000 dòng | Cảnh báo truncate, xuất 50.000 dòng đầu | WARNING |

### 2.7 Permission Matrix

| Entity | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG | LĐ |
|--------|------|-------|-------|----|-----|-----|-----|-----|
| AUDIT_LOG (Nhật ký) | **Read-only** | — | — | — | — | — | — | — |

### 2.8 NFR đặc thù

| Yêu cầu | Chi tiết |
|----------|----------|
| Volume dữ liệu | ~500.000 records/năm |
| Performance Index | Bắt buộc index trên (thoi_gian, module, entity_type) |
| Data Partitioning | Partition by RANGE (thoi_gian) theo tháng. Auto-create 3 tháng trước, auto-drop > 5 năm |
| Response Time | Target < 3 giây tại client (PERF-04) |
| Loading UI | Skeleton loading khi query. Degradation: > 4.5s hiển thị loading indicator |
| Responsive | Desktop-only, min-width 1024px, < 1024px: "Vui lòng sử dụng màn hình ≥ 1024px" |

### 2.9 SRS Gaps phát hiện

| # | Gap | Rủi ro |
|---|-----|--------|
| G1 | Bộ lọc ngày không có giá trị mặc định, không giới hạn khoảng max | Query 5 năm → performance sụp |
| G2 | Lần đầu truy cập không rõ load tất cả hay mặc định khoảng thời gian | Có thể load toàn bộ ~2.5M records |
| G3 | UI dropdown chỉ 7 loại thao tác, DB có 9 (thiếu PUBLISH, UNPUBLISH) | Log PUBLISH/UNPUBLISH không thể lọc |
| G4 | Entity search: không rõ case-sensitive hay case-insensitive | Hành vi tìm kiếm không nhất quán |
| G5 | Không có quy ước đặt tên file xuất Excel | Tên file không chuẩn hóa |
| G6 | Login/Logout: entity_type và entity_id không được định nghĩa | Cột Entity và Mã bản ghi hiển thị không rõ ràng |
| G7 | session_id lưu DB nhưng không hiển thị UI | Không ảnh hưởng UX (chấp nhận được) |

---

## 3. Cấu Trúc File Test Case

```
Nhat-ky-he-thong/
├── 00-test-plan-overview.md              ← File này
└── 01-TC-nhat-ky-he-thong.md             ← Tất cả test cases (Happy/Negative/Edge)
```

---

## 4. Tổng Quan Số Lượng Test Cases

| Nhóm | Happy | Negative | Edge | Tổng | Ghi chú |
|------|-------|----------|------|------|---------|
| Hiển thị & Layout | 4 | 0 | 2 | **6** | Breadcrumb, sticky header, empty state, badge |
| Bộ lọc & Tìm kiếm | 4 | 3 | 5 | **12** | 5 tiêu chí lọc, reset, search rỗng |
| Phân trang | 2 | 2 | 3 | **7** | Page size, navigation, boundary |
| Xuất Excel | 2 | 0 | 3 | **5** | BR-DATA-06, WRN-RPT-01, auto-download |
| JSON Diff & Expand | 3 | 0 | 2 | **5** | CREATE/UPDATE/DELETE diff, expand/collapse |
| Phân quyền & Bảo mật | 1 | 3 | 2 | **6** | ERR-AUTH-01, session timeout, URL trực tiếp |
| Sorting | 1 | 0 | 1 | **2** | Thời gian DESC, non-sortable columns |
| NFR & Responsive | 0 | 0 | 3 | **3** | PERF-04, loading skeleton, min-width |
| **TỔNG** | **17** | **8** | **21** | **46** | |

---

## 5. Đặc Điểm Cần Lưu Ý Khi Kiểm Thử

1. **Read-only**: Màn hình này KHÔNG có CRUD operations, chỉ xem/lọc/xuất. Mọi nút tạo/sửa/xóa đều KHÔNG tồn tại.
2. **Immutable Data**: Dữ liệu audit log không thể sửa/xóa từ UI, cần kiểm tra backend cũng enforce.
3. **Performance**: Bảng ~500K records/năm, cần kiểm tra response time < 3s (PERF-04).
4. **Default Filter Gap**: SRS không quy định giá trị mặc định cho bộ lọc ngày → cần xác nhận implementation.
5. **PUBLISH/UNPUBLISH Gap**: DB có nhưng UI dropdown thiếu → log PUBLISH không thể lọc.
6. **50.000 dòng limit**: Kiểm tra hành vi khi xuất vượt limit (truncate + warning).
7. **Desktop-only**: Kiểm tra chặn giao diện < 1024px.
