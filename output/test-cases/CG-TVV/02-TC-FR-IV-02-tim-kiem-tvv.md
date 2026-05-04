# Test Cases — UC40: Tìm kiếm TVV (FR-IV-02)

> **SRS Ref**: FR-IV-02, SCR-IV-01 (filter-bar), Entity TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-03 | FR-IV-02 / SCR-IV-01 / UI | Verify filter-bar SCR-IV-01: 7 ô filter + 2 button | CB_NV_TW đăng nhập. | — | 1. Vào SCR-IV-01. 2. Kiểm tra filter-bar. | **LAYOUT**: 7 ô + 2 button. **FIELDS**: (1) "Từ khóa" search-box placeholder "Tìm theo tên, mã TVV hoặc CMND/CCCD" (NLM cite [1] row 8); (2) "Lĩnh vực" multi-select Danh mục Lĩnh vực phap luat; (3) "Địa bàn" select searchable cấp Tỉnh/TP; (4) "Tổ chức" select searchable; (5) "Trạng thái" select 9 giá trị SM-TVV (ẩn nếu đang ở tab cụ thể trừ "Mới đăng ký"); (6) "Ngày công nhận từ" date-picker; (7) "Ngày công nhận đến" date-picker. **BUTTONS**: [Tìm kiếm] (AND logic), [Xóa bộ lọc] (reset). **NEGATIVE — KHÔNG có**: Filter "Loại TVV" (TVV/CG/NHT) — SRS Gap (mark **SPEC-CLARIFY-CG-13**: cách filter loại nếu không có ô filter trên UI). | Happy 🔴 |

---

## B. SEARCH BY KEYWORD (Từ khóa LIKE)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-101 | FR-IV-02 | Tìm theo tên TVV thành công | CB_NV_TW đăng nhập. TVV "Nguyễn Văn A" tồn tại. | từ_khóa = "Nguyễn" | 1. Vào SCR-IV-01. 2. Nhập "Nguyễn" vào ô từ khóa. 3. Click [Tìm kiếm]. | **STATE**: Backend `WHERE ho_ten LIKE '%Nguyễn%' OR ma_tvv LIKE '%Nguyễn%' OR cmnd_cccd LIKE '%Nguyễn%'` (NLM cite [1] row 8). **UI**: Bảng filter chỉ TVV match keyword. URL/query param có `q=Nguyễn` (nếu có URL sync — SPEC-CLARIFY-CG-06). **PERSIST**: Reload giữ filter. Acceptance ≤ 2s response (NLM cite [19] AC FR-IV-02). | Happy 🔴 |
| TC-CG-102 | FR-IV-02 | Tìm theo mã TVV (chính xác) | CB_NV_TW đăng nhập. TVV mã "TVV-TW-001" tồn tại. | từ_khóa = "TVV-TW-001" | 1-3 như TC-101 với keyword "TVV-TW-001". | **STATE**: Backend LIKE match ma_tvv. **UI**: Bảng hiển thị 1 record duy nhất. **PERSIST**: Reload giữ. | Happy |
| TC-CG-103 | FR-IV-02 | Tìm theo CMND/CCCD | CB_NV_TW đăng nhập. TVV cccd="012345678901" tồn tại. | từ_khóa = "012345678" | 1-3 với keyword là một phần của cccd. | **STATE**: Backend LIKE cmnd_cccd. **UI**: Hiển thị TVV match. **PERSIST**: — | Happy |
| TC-CG-104 | INF-TVV-01 | Tìm không có kết quả | CB_NV_TW đăng nhập. | từ_khóa = "ZZZ-NOT-EXIST-999" | 1-3. | **STATE**: Query trả 0 row. **UI**: Empty state "**Không tìm thấy TVV phù hợp**" (NLM cite [13] INF-TVV-01). **PERSIST**: — | Negative |

---

## C. FILTER COMBINATIONS

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-105 | FR-IV-02 | Filter theo Lĩnh vực (multi-select) | CB_NV_TW đăng nhập. Seed 3 TVV — 2 lĩnh vực DAN_SU + 1 lĩnh vực HINH_SU. | linh_vuc = [DAN_SU, HINH_SU] | 1. Filter lĩnh vực = chọn cả DAN_SU và HINH_SU. 2. [Tìm kiếm]. | **STATE**: Backend WHERE EXISTS (TVV_LINH_VUC linh_vuc_id IN (DAN_SU, HINH_SU)). **UI**: Hiển thị cả 3 record. **PERSIST**: — | Happy |
| TC-CG-106 | FR-IV-02 | Filter theo Trạng thái (chỉ tab "Mới đăng ký") | CB_NV_TW đăng nhập. | trang_thai filter = MOI_DANG_KY | 1. Tab "Mới đăng ký". 2. Filter trạng thái = MOI_DANG_KY. 3. [Tìm kiếm]. | **STATE**: WHERE trang_thai='MOI_DANG_KY' (overrides tab default IN clause). **UI**: Hiển thị chỉ MOI_DANG_KY (loại YEU_CAU_BO_SUNG khỏi tab). **PERSIST**: — | Happy |
| TC-CG-107 | FR-IV-02 | Filter date range — Ngày công nhận từ/đến | CB_NV_TW đăng nhập. Seed 3 TVV ngày công nhận: 2026-01-15, 2026-03-20, 2026-04-25. | từ=2026-02-01, đến=2026-04-30 | 1. Filter Ngày công nhận từ=2026-02-01, đến=2026-04-30. 2. [Tìm kiếm]. | **STATE**: WHERE ngay_cong_nhan BETWEEN '2026-02-01' AND '2026-04-30'. **UI**: Hiển thị 2 record (2026-03-20, 2026-04-25). **PERSIST**: — | Happy |
| TC-CG-108 | FR-IV-02 | [Xóa bộ lọc] — reset toàn bộ filter | CB_NV_TW đăng nhập. Đã filter trước đó. | — | 1. Setup: filter từ khóa + lĩnh vực + ngày. 2. Click [Xóa bộ lọc]. | **STATE**: Backend query không có WHERE filter (trừ tab default). **UI**: Tất cả filter input về rỗng. Bảng load lại full dataset của tab. **PERSIST**: Reload sau reset → filter vẫn rỗng. | Happy |

---

## D. SECURITY & EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-109 | BR-EC-13 | Search SQL injection — sanitize | CB_NV_TW đăng nhập. | từ_khóa = "'; DROP TABLE TU_VAN_VIEN; --" | 1. Nhập SQL injection payload vào ô từ khóa. 2. [Tìm kiếm]. | **STATE**: KHÔNG drop table. Backend escape/parameterize query. Audit log ghi nhận query nếu có IDS. **UI**: Empty state hoặc error chuẩn (không expose stack trace). **PERSIST**: TU_VAN_VIEN table vẫn tồn tại sau request. | Negative 🔴 |
| TC-CG-110 | BR-EC-13 | Search XSS — sanitize | CB_NV_TW đăng nhập. | từ_khóa = `<script>alert('XSS')</script>` | 1. Nhập XSS payload. 2. [Tìm kiếm]. | **STATE**: Backend lưu plain string nếu match. **UI**: Trình duyệt KHÔNG execute script. Hiển thị payload escaped trong placeholder/breadcrumb nếu có echo. **PERSIST**: — | Negative 🔴 |
| TC-CG-111 | BR-EC-13 | Search keyword > 200 ký tự | CB_NV_TW đăng nhập. | từ_khóa = "A" × 250 | 1. Paste 250 ký vào ô từ khóa. 2. [Tìm kiếm]. | **STATE**: Backend truncate/reject ở 200 ký. **UI**: Hoặc input bị truncate, hoặc error "Từ khóa tìm kiếm tối đa 200 ký tự" (SRS Gap message). **PERSIST**: — | Edge |
| TC-CG-112 | FR-IV-02 / WRN-TVV-01 | Export Excel — boundary 10.000 dòng | CB_NV_TW đăng nhập. Seed > 10.000 TVV "Đang hoạt động". | — | 1. Tab "Đang hoạt động". 2. Click [Xuất Excel] (NLM cite [11]). | **STATE**: Backend generate file Excel với 10.000 dòng max. **UI**: Toast warning "**Cập nhật Cổng thất bại**"... (no — SRS Gap nguyên văn cho WRN-TVV-01 — SPEC-CLARIFY-CG-05). File `.xlsx` download. **PERSIST**: Mở file → 10.000 row + header chứa các cột match SCR-IV-01. | Edge 🟡 |
| TC-CG-113 | FR-IV-02 | Export Excel — header và cột phù hợp SRS | CB_NV_TW đăng nhập. Seed 50 TVV. | — | 1. Tab "Đang hoạt động". 2. Click [Xuất Excel]. 3. Mở file. | **STATE**: File `.xlsx` generated. **UI**: Toast "Đang xuất file...". **PERSIST**: File mở được. Header đúng các cột SCR-IV-01: Mã TVV, Họ tên, Loại, Lĩnh vực, Tổ chức, Điểm DG, Trạng thái, Ngày công nhận. 50 row data match filter hiện tại. | Happy |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-114 | FR-IV-02 / NLM cite [8] row 12 | Filter dropdown "Trạng thái" — ẩn khi đang ở tab cụ thể (1 trạng thái) | CB_NV_TW. | — | 1. Tab "Đang hoạt động" (1 trạng thái). 2. Quan sát filter Trạng thái. 3. Đổi sang tab "Mới đăng ký" (2 trạng thái MOI_DANG_KY+YEU_CAU_BO_SUNG). | **UI**: Cite [8] row 12 nguyên văn: "Tat ca gia tri SM-TVV. **An neu dang o tab cu the**". Tab "Đang hoạt động"/"Tạm dừng"/"Chờ thẩm định"/"Chờ phê duyệt" (1 trạng thái mỗi tab) → filter Trạng thái **ẨN**. Tab "Mới đăng ký" (2 trạng thái) → filter Trạng thái **HIỂN THỊ** (chỉ giá trị MOI_DANG_KY và YEU_CAU_BO_SUNG để chọn, KHÔNG ẩn vì tab có >1 state). **PERSIST**: — | Edge 🟡 |
| TC-CG-115 | FR-IV-02 / NLM cite [8] row 8 | Search keyword với ký tự `%` `_` (SQL LIKE wildcard escape) | CB_NV_TW. | từ_khóa = "100%" và "user_name" | 1. Search 2 keyword. | **STATE**: Backend escape `%` và `_` trước khi build LIKE (cite [8] "LIKE tren ho_ten, ma_tvv, cmnd_cccd"). **UI**: Bảng hiển thị chỉ TVV match literal "100%" (không match toàn bộ records). **PERSIST**: — | Edge 🟡 |
| TC-CG-116 | FR-IV-02 / BR-EC-13 / NLM cite [5] | Keyword exactly 200 ký (boundary) | CB_NV_TW. | từ_khóa = "A"×200 | 1. Search. | **STATE**: BE accept (cite [5] BR-EC-13 nguyên văn "max 200 ky tu"). **UI**: Hiển thị empty/match results. **PERSIST**: — | Edge 🟢 |
| TC-CG-117 | FR-IV-02 / NLM cite [8] row 13 | Date range invalid: "Ngày từ" > "Ngày đến" | CB_NV_TW. | từ=2026-05-01, đến=2026-04-01 | 1. Filter date range. 2. [Tìm kiếm]. | **STATE**: BE behavior **SRS Gap** (cite [8] không quote validation cho range invalid). Có 2 khả năng: (a) Trả 0 row; (b) Reject với error. **UI**: Tùy app. **PERSIST**: Mark SPEC-CLARIFY-CG-38 cho rule này. | Edge 🟡 |
| TC-CG-118 | FR-IV-02 / BR-DATA-06 / NLM cite [2] | Export Excel với filter hiện tại — verify chỉ export rows match filter | CB_NV_TW. Seed 100 TVV: 50 DANG_HOAT_DONG + 50 TAM_DUNG. | Tab "Tạm dừng" + filter Lĩnh vực=DAN_SU (matches 20 record) | 1. Setup filter. 2. [Xuất Excel]. 3. Mở file. | **STATE**: BE generate file with 20 row (cite [2] BR-DATA-06 nguyên văn: "**File xuất theo bộ lọc hiện tại, không vượt quá 10,000 rows/file**"). **UI**: Toast download. **PERSIST**: File mở → 20 row + header đúng cột; KHÔNG chứa 80 record không match filter. | Edge 🔴 |
| TC-CG-119 | FR-IV-02 / BR-EC-12 / NLM cite [5] | Pagination — page=0, page=-1, page_size=200 (>max 100) | CB_NV_TW. | URL `?page=0`, `?page=-1`, `?page_size=200` | 1. 3 lần API call hoặc URL direct. | **STATE**: BE reject (cite [5] BR-EC-12 nguyên văn: "page_size ∈ [1,100] default 20. page >= 1 default 1. **Ngoài phạm vi → ERR-PARAM-01**"). **UI**: HTTP 400 error code "**ERR-PARAM-01**" (message chính xác **SRS Gap**). **PERSIST**: Default fallback hoặc reject. | Edge 🟡 |
| TC-CG-120 | FR-IV-02 / NLM cite [2] AC | Multi-filter AND logic — Lĩnh vực + Địa bàn + Tổ chức intersect | CB_NV_TW. Seed 30 TVV: 10 trùng cả 3 filter, 20 partial match. | linh_vuc=[DAN_SU], dia_ban=[HANOI], to_chuc=TC-001 | 1. Filter 3 ô đồng thời. 2. [Tìm kiếm]. | **STATE**: Backend WHERE combine `linh_vuc IN (DAN_SU) AND dia_ban IN (HANOI) AND to_chuc_chinh_id=TC-001` (cite [2] AC nguyên văn: "lọc theo nhiều điều kiện When tìm kiếm Then áp dụng **AND tất cả**"). **UI**: Bảng hiển thị 10 record intersect. **PERSIST**: — | Edge 🔴 |
| TC-CG-121 | FR-IV-02 / INF-TVV-01 / NLM cite [2] AC | Multi-filter AND không có kết quả intersect | CB_NV_TW. | linh_vuc=[DAN_SU], dia_ban=[HCMC], to_chuc=TC-999 (combo không match) | 1. Filter 3 ô. 2. [Tìm kiếm]. | **STATE**: Backend trả 0 row (AND logic strict). **UI**: Empty state "**Không tìm thấy TVV phù hợp**" (NLM cite [13] INF-TVV-01). **PERSIST**: — | Edge 🟡 |
| TC-CG-122 | FR-IV-02 / NLM cite [2] AC | Search keyword tiếng Việt có dấu — Unicode collation | CB_NV_TW. TVV "Lê Văn Cường" tồn tại. | từ_khóa = "Lê Văn" | 1. Search. | **STATE**: Backend handle Vietnamese Unicode (LIKE `%Lê Văn%`). **UI**: Bảng match "Lê Văn Cường". **PERSIST**: — | Edge 🟢 |
