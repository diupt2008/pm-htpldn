# Kế Hoạch Kiểm Thử - SRS-FR-10: Quản Trị Hệ Thống — Submenu Cấu Hình Hệ Thống

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-04-17  
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), Session ID `3b7c3e6a`  
> **SRS Reference**: Nhóm FR-VIII (Quản trị hệ thống), SCR-VIII-06 (MH-10.7)

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- **Màn hình Cấu hình hệ thống** (SCR-VIII-06 / MH-10.7), dạng Tab Page gồm 4 tab
- URL: `/quan-tri/cau-hinh`
- Quyền truy cập: **Chỉ QTHT** (Quản trị hệ thống)
- Không phân quyền chi tiết theo từng tab (page-level permission)

### 1.2 Danh sách 4 Tab chức năng

| # | Tab | Mã FR | Use Case | Tên chức năng | File Test Case |
|---|-----|--------|----------|---------------|----------------|
| 1 | Tab 1 | FR-VIII-10 | UC108 | Thời hạn xử lý / SLA | `01-TC-SLA.md` |
| 2 | Tab 2 | FR-II-NEW-01 | — | Phân công mặc định | `02-TC-phan-cong.md` |
| 3 | Tab 3 | FR-II-NEW-02 | — | Mẫu phản hồi | `03-TC-mau-phan-hoi.md` |
| 4 | Tab 4 | FR-V.I-NEW-01 | — | Quy trình hỗ trợ | `04-TC-quy-trinh.md` |

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Business Rules (BR) áp dụng chung cho Cấu hình hệ thống

| Mã | Quy tắc | Trích dẫn SRS |
|----|---------|---------------|
| BR-AUTH-01 | Bắt buộc xác thực đăng nhập + chỉ vai trò QTHT mới truy cập được | Preconditions SCR-VIII-06 |
| BR-AUTH-06 | Session CMS: 30p idle timeout. Modal cảnh báo tại 25p: "Phiên sắp hết hạn trong 5 phút. [Gia hạn] [Đăng xuất]" | BR-AUTH-06 |
| BR-DATA-03 | Mọi cấu hình tự động gắn 7 trường hệ thống: id, created_at, updated_at, created_by, updated_by, is_deleted, don_vi_id | BR-DATA-03 |
| BR-DATA-05 | Mọi thay đổi ghi AUDIT_LOG (immutable). Format JSON: hanh_dong, du_lieu_cu, du_lieu_moi, nguoi_thuc_hien_id, thoi_gian, entity_type, entity_id, ip_address, user_agent | BR-DATA-05 / AUDIT_LOG entity |
| BR-DATA-07 | Phân trang API: Default 20 rows/page, max 100 rows/page (áp dụng backend, UI cấu hình có thể không render pagination) | BR-DATA-07 |
| BR-EC-01 | Optimistic Locking: UPDATE/DELETE kiểm tra updated_at. Nếu xung đột → ERR-SYS-02 | EC-DATA-LOCK |
| BR-SLA-01 | Deadline = Ngày tiếp nhận + N ngày làm việc (T2-T6, loại bỏ NGAY_LE) | BR-SLA-01 / BR-CALC-03 |
| BR-SLA-02 | 4 mức SLA: Bình thường (>50%), Sắp hết hạn (<50%, vàng), Quá hạn (>100%, đỏ), QH nghiêm trọng (>200%, đen) | BR-SLA-02 |
| BR-FLOW-06 | Snapshot Rule: Hồ sơ đang xử lý giữ nguyên quy trình cũ khi cấu hình thay đổi | BR-FLOW-06 |

### 2.2 Snapshot Rule (Đặc biệt quan trọng)
- **Tab 1 (SLA)**: Khi thay đổi SLA → hồ sơ MỚI áp dụng cấu hình mới, hồ sơ đang xử lý giữ deadline cũ (snapshot tại thời điểm tiếp nhận). Alert banner hiển thị cố định trên UI.
- **Tab 4 (Quy trình)**: Khi thay đổi quy trình → hồ sơ mới áp dụng quy trình mới, hồ sơ đang xử lý giữ nguyên quy trình cũ. Alert cảnh báo hiển thị.
- **KHÔNG có modal confirm** khi lưu thay đổi SLA/Quy trình — chỉ là alert banner thông tin.

### 2.3 Error Codes tổng hợp

| Mã lỗi | Áp dụng Tab | Điều kiện | Message | Severity |
|---------|-------------|-----------|---------|----------|
| ERR-AUTH-01 | Chung | User không phải QTHT | "Bạn không có quyền thực hiện chức năng này" | ERROR |
| ERR-AUTH-02 | Chung | Session hết hạn | Redirect về trang đăng nhập | ERROR |
| ERR-SYS-02 | Chung | Optimistic locking conflict | "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" | ERROR |
| ERR-SLA-01 | Tab 1 | thoi_han_ngay ≤ 0 | "Thời hạn xử lý phải là số nguyên dương" | ERROR |
| ERR-SLA-02 | Tab 1 | canh_bao_1 ≥ canh_bao_2 | "Mức cảnh báo 1 phải nhỏ hơn mức cảnh báo 2" | ERROR |
| ERR-SLA-03 | Tab 1 | loai_yeu_cau trùng | "Loại yêu cầu đã có cấu hình SLA" | ERROR |
| ERR-CH-01 | Tab 2 | Bộ 3 linh_vuc_id + nguoi_xu_ly_id + don_vi_id trùng | "Cấu hình lĩnh vực '{lv}' ↔ CB '{cb}' đã tồn tại" | ERROR |
| ERR-MPH-01 | Tab 3 | Tên mẫu trống | "Tên mẫu là bắt buộc" | ERROR |
| ERR-MPH-02 | Tab 3 | Nội dung mẫu trống | "Nội dung mẫu là bắt buộc" | ERROR |
| ERR-QT-01 | Tab 4 | Thứ tự bước trùng | "Thứ tự bước đã tồn tại" | ERROR |
| ERR-QT-02 | Tab 4 | Tên bước trống | "Tên bước quy trình là bắt buộc" | ERROR |

### 2.4 Permission Matrix

| Entity | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|--------|------|-------|-------|----|-----|-----|-----|
| CAU_HINH_SLA | **CRUD** | — | — | — | — | — | — |
| CAU_HINH_PHAN_CONG | **CRUD** | — | — | — | — | — | — |
| MAU_PHAN_HOI | **CRUD** | — | — | — | — | — | — |
| QUY_TRINH_HO_TRO | **CRUD** | — | — | — | — | — | — |

> **Ghi chú**: Các vai trò khác chỉ tiêu thụ gián tiếp dữ liệu cấu hình (hệ thống tính SLA, gợi ý phân công) nhưng KHÔNG truy cập UI.

### 2.5 UI Layout (SCR-VIII-06 / MH-10.7)
- **Breadcrumb**: "Trang chủ > Quản trị > Cấu hình"
- **Tab Navigation**: 4 tab ngang (SLA | Phân công | Mẫu phản hồi | Quy trình)
- **Không có cảnh báo unsaved changes** khi chuyển tab → Dữ liệu chưa lưu sẽ mất
- **Không có auto-save** (khác với luồng Tư vấn chuyên sâu)
- **Không có nút Hủy/Reset** trên Tab 1, 2 (nút Hủy chỉ có trong Modal của Tab 2, 3, 4)

---

## 3. Cấu Trúc File Test Case

```
Cau-hinh-he-thong/
├── 00-test-plan-overview.md              ← File này
├── 01-TC-SLA.md                          ← Tab 1: Thời hạn xử lý / SLA (FR-VIII-10)
├── 02-TC-phan-cong.md                    ← Tab 2: Phân công mặc định (FR-II-NEW-01)
├── 03-TC-mau-phan-hoi.md                ← Tab 3: Mẫu phản hồi (FR-II-NEW-02)
└── 04-TC-quy-trinh.md                   ← Tab 4: Quy trình hỗ trợ (FR-V.I-NEW-01)
```

---

## 4. Tổng Quan Số Lượng Test Cases

| File | Happy | Negative | Edge | Tổng | Ghi chú |
|------|-------|----------|------|------|--------|
| 01 - SLA (Tab 1) | 6 | 6 | 11 | **23** | +6 edge từ Edge Case Hunter, +1 UI Verify |
| 02 - Phân công (Tab 2) | 5 | 4 | 9 | **18** | +5 edge từ Edge Case Hunter, +1 UI Verify |
| 03 - Mẫu phản hồi (Tab 3) | 6 | 4 | 9 | **19** | +5 edge từ Edge Case Hunter, +3 Quality Review, +1 UI Verify |
| 04 - Quy trình (Tab 4) | 5 | 4 | 10 | **19** | +5 edge từ Edge Case Hunter, +2 Quality Review, +1 UI Verify |
| Cross-cutting (Chung) | 1 | 0 | 2 | **3** | Pagination + Browser nav + UI Layout |
| **TỔNG** | **23** | **18** | **41** | **82** | +23 edge, +5 Quality Review, +5 UI Verify |

---

## 5. Cross-cutting Test Cases (Áp dụng chung cho tất cả Tab)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------:|
| TC-CHUNG-001 | BR-DATA-07 | Pagination: dữ liệu < 20 bản ghi → kiểm tra hiển thị component phân trang | 1. User QTHT đã đăng nhập. 2. Tab 2/3/4 có ít hơn 20 bản ghi. | Tab 2: 3 mapping, Tab 3: 5 mẫu, Tab 4: 4 bước | 1. Mở Tab 2. 2. Kiểm tra footer bảng (pagination). 3. Lặp lại cho Tab 3, Tab 4. | 1. Kiểm tra: Component phân trang bị ẩn (hidden) hay hiển thị dạng "1/1 trang" (disabled)? 2. SRS BR-DATA-07: "Mọi danh sách sử dụng phân trang. Default: 20 rows/page". UI format: "Hiển thị 1-20 / {total_count} kết quả". 3. ⚠️ SRS Gap: KHÔNG chỉ định UX behavior khi total < page_size. | Edge |
| TC-CHUNG-002 | SCR-VIII-06 / UI | QTHT nhấn browser Back button khi đang chỉnh sửa → mất dữ liệu không cảnh báo | 1. User QTHT đã đăng nhập. 2. Đang sửa dữ liệu trên bất kỳ tab nào (chưa nhấn Lưu). | Sửa inline hoặc đang trên Modal | 1. Sửa dữ liệu (inline hoặc Modal). 2. KHÔNG nhấn [Lưu]. 3. Nhấn browser Back button. | 1. Trang điều hướng (navigate away). 2. Dữ liệu chưa lưu bị MẤT. 3. KHÔNG có cảnh báo beforeunload. 4. SRS: Toàn bộ MCH Cấu hình hệ thống KHÔNG áp dụng cơ chế cảnh báo unsaved changes (khác màn hình Thêm TVV có "confirm neu unsaved"). | Edge |
| TC-CHUNG-003 | SCR-VIII-06 / MH-10.7 | Verify UI Layout tổng thể màn hình Cấu hình hệ thống: breadcrumb, tab navigation, URL | 1. User QTHT đã đăng nhập. | — | 1. Truy cập `/quan-tri/cau-hinh`. 2. Kiểm tra breadcrumb. 3. Kiểm tra thanh tab navigation. 4. Click lần lượt từng tab, kiểm tra URL và nội dung hiển thị. | 1. URL hiển thị `/quan-tri/cau-hinh`. 2. Breadcrumb: "Trang chủ > Quản trị > Cấu hình" (SCR-VIII-06). 3. Tab navigation hiển thị 4 tab ngang đúng thứ tự: "Thời hạn xử lý (SLA)" \| "Phân công mặc định" \| "Mẫu phản hồi" \| "Quy trình hỗ trợ". 4. Tab mặc định khi mở trang: Tab 1 (SLA) active. 5. Click mỗi tab → nội dung tương ứng hiển thị, tab active highlight. 6. KHÔNG có cảnh báo unsaved khi chuyển tab (SRS §2.5). 7. KHÔNG có auto-save. | Happy |

---

## 6. Đặc Điểm Cần Lưu Ý Khi Kiểm Thử

1. **Session Timeout**: Kiểm thử trường hợp đang edit cấu hình khi session hết hạn (30p idle) — dữ liệu chưa lưu sẽ MẤT vì không có auto-save.
2. **Concurrent Edit**: Kiểm thử 2 QTHT cùng sửa 1 bản ghi → ERR-SYS-02 (optimistic locking via updated_at).
3. **Snapshot Rule**: Cần test end-to-end: thay đổi SLA/Quy trình → kiểm tra hồ sơ cũ giữ config cũ, hồ sơ mới lấy config mới.
4. **Unsaved Changes Lost**: Chuyển tab khi chưa lưu → dữ liệu mất mà không có cảnh báo.
5. **DB Constraints**: canh_bao_1, canh_bao_2 CHECK BETWEEN 0 AND 100. qua_han_he_so CHECK > 1.

---

## 7. Edge Case Hunter Review Summary (2026-04-17)

> **Review file**: `05-REVIEW-edge-case-hunter.md`

| Metric | Số lượng |
|--------|----------|
| Edge cases bổ sung | **23** |
| 🔴 CRITICAL | 5 |
| 🟡 HIGH | 9 |
| 🟢 MEDIUM | 9 |
| SRS Gaps phát hiện | **15** (G1 → G15) |

### Top 5 SRS Gaps nghiêm trọng (🔴 CRITICAL)

| # | Gap | File TC | Rủi ro |
|---|-----|---------|--------|
| 1 | Thiếu ERR code cho qua_han_he_so vi phạm CHECK > 1 | 01-TC-SLA | DB Exception 500 |
| 2 | Chưa định nghĩa Transaction cho batch inline-edit | 01-TC-SLA | Partial save gây inconsistency |
| 3 | ERR-CH-02 (CB vô hiệu) có trong SRS nhưng CHƯA test | 02-TC-phan-cong | Mapping CB đã khóa vào hệ thống |
| 4 | Rich Text không sanitize → Stored XSS | 03-TC-mau-phan-hoi | Security vulnerability |
| 5 | MAU_PHAN_HOI bị bỏ sót khỏi FK reference check FR-VIII-01 | 03-TC-mau-phan-hoi | Orphan data khi xóa Lĩnh vực |
