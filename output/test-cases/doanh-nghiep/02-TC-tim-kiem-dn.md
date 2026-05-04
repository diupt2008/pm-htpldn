# Test Cases — FR-V.III-02 (UC82): Tìm kiếm Doanh nghiệp

> **SRS Ref**: FR-V.III-02, SCR-V.III-01 (Filter-bar trên Danh sách), Entity DOANH_NGHIEP
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`)
> **Ngày tạo**: 2026-04-30
> **Đặc thù**: Tìm kiếm multi-criteria AND-combine. Sanitize keyword max 200 ký tự (BR-EC-13). Thời gian hỗ trợ tính theo VU_VIEC (SRS Gap G5 — trường nào không quote).

---

## Quy ước

(Cùng quy ước file 01)

---

## Trường input FR-V.III-02

| # | Field | Bắt buộc | Kiểu | Ràng buộc |
|---|-------|----------|------|-----------|
| 1 | tu_khoa | N | text | Tìm tên DN / MST. Sanitize max 200 ký tự (BR-EC-13) |
| 2 | quy_mo | N | enum | SIEU_NHO / NHO / VUA |
| 3 | tinh_thanh_id | N | FK | → DON_VI |
| 4 | linh_vuc_kd | N | text | Lĩnh vực kinh doanh |
| 5 | tu_ngay | N | date | Thời gian hỗ trợ từ |
| 6 | den_ngay | N | date | Thời gian hỗ trợ đến |

---

## A. TÌM KIẾM ĐƠN TIÊU CHÍ — HAPPY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-TKDN-001 | FR-V.III-02 / Inputs#1 | Tìm theo tên DN — match exact | 1. cb_nv_tw_01 login. 2. Seed DN-A ten="Công ty ABC", DN-B ten="Công ty XYZ". | tu_khoa="ABC" | 1. Nhập từ khóa "ABC". 2. Click [Tìm kiếm]. | (1) Backend GET `/doanh-nghiep?tu_khoa=ABC`. (2) — (read). (3) Table chỉ hiển thị DN-A. URL sync `?tu_khoa=ABC`. | Happy 🔴 |
| TC-TKDN-002 | FR-V.III-02 / Inputs#1 | Tìm theo MST — partial match | Login. DN-A MST="0123456789", DN-B MST="0987654321". | tu_khoa="0123" | 1. Nhập "0123". 2. Tìm kiếm. | (3) Hiển thị DN-A (LIKE %0123%). DN-B không hiện. | Happy 🟡 |
| TC-TKDN-003 | FR-V.III-02 / Inputs#2 | Lọc theo Quy mô | Login. Seed DN: 3 SIEU_NHO + 2 NHO + 1 VUA. | quy_mo=NHO | 1. Chọn dropdown Quy mô = "NHO". 2. Tìm. | (3) Table 2 DN quy_mo=NHO. Filter chip hiển thị "Quy mô: NHO". | Happy 🟡 |
| TC-TKDN-004 | FR-V.III-02 / Inputs#3 | Lọc theo Tỉnh thành | Login (cb_nv_tw_01). DN ở HN, HCM, ĐN. | tinh_thanh_id=HCM | 1. Chọn Tỉnh = HCM. 2. Tìm. | (3) Chỉ DN HCM. Cb_nv_tw thấy toàn quốc nên filter HCM trả đúng kết quả HCM. | Happy 🟡 |
| TC-TKDN-005 | FR-V.III-02 / Inputs#4 | Lọc theo lĩnh vực KD | Login. DN-A linh_vuc_kd="Bán lẻ", DN-B="Sản xuất". | linh_vuc_kd="Bán lẻ" | 1. Chọn lĩnh vực = "Bán lẻ". 2. Tìm. | (3) Chỉ DN-A. ⚠️ **SRS không quote rõ exact match hay LIKE — verify thực tế behavior**. | Happy 🟢 |
| TC-TKDN-006 | FR-V.III-02 / Inputs#5,6 / G5 | Lọc theo khoảng thời gian hỗ trợ | Login. Seed DN-A có VV ngày 2026-01-15, DN-B có VV ngày 2026-03-20. | tu_ngay=2026-01-01, den_ngay=2026-02-01 | 1. Chọn từ ngày 2026-01-01. 2. Đến ngày 2026-02-01. 3. Tìm. | (3) Hiển thị DN-A (có VV trong khoảng). ⚠️ **SRS Gap G5:** SRS không quote `vu_viec.ngay_tiep_nhan` hay `ngay_ket_thuc` — TC default assume `ngay_tiep_nhan` + inclusive 2 đầu. Flag BA. | Happy 🔴 |

---

## B. TÌM KIẾM KẾT HỢP & EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-TKDN-010 | FR-V.III-02 / Processing step 2 (AND) | Kết hợp 3 điều kiện AND | Login. Seed: DN-X (ABC, NHO, HCM), DN-Y (ABC, NHO, HN), DN-Z (XYZ, NHO, HCM). | tu_khoa=ABC, quy_mo=NHO, tinh_thanh=HCM | 1. Nhập đủ 3 filter. 2. Tìm. | (3) Chỉ DN-X (match cả 3). DN-Y match 2/3 (khác tỉnh) → loại. DN-Z khác tên → loại. AND-combine xác minh đúng (srs-fr-07:236). | Happy 🔴 |
| TC-TKDN-011 | FR-V.III-02 / E1 INF-DN-TK-01 | Không có kết quả | Login. | tu_khoa="DN_KHONG_TON_TAI_XYZ_999" | 1. Nhập keyword không match. 2. Tìm. | (3) Table empty state với text NGUYÊN VĂN: **"Không tìm thấy doanh nghiệp phù hợp"** (INF-DN-TK-01, srs-fr-07:262). Severity INFO (không phải error). | Negative 🟡 |
| TC-TKDN-012 | FR-V.III-02 / SCR-V.III-01 row#14 | Click "Xóa bộ lọc" reset toàn bộ filter | Login. Đang có filter quy_mo=NHO, tinh_thanh=HCM. | — | 1. Click [Xóa bộ lọc]. | (3) Tất cả filter input clear; table reload với scope role mặc định; URL sync clear filter params. | Happy 🟡 |
| TC-TKDN-013 | FR-V.III-02 / BR-AUTH-08 | CB_NV_BN search vẫn scoped đơn vị mình | cb_nv_bn_01 (Bộ KH&ĐT). DN ABC ở Bộ KH&ĐT, DN ABC ở Bộ Tài chính. | tu_khoa="ABC" | 1. Tìm "ABC". | (3) Chỉ DN ABC của Bộ KH&ĐT. DN ABC Bộ Tài chính KHÔNG hiện (BR-AUTH-08). | Happy 🔴 |
| TC-TKDN-014 | FR-V.III-02 / BR-EC-13 | SQL injection qua tu_khoa | Login. | tu_khoa="' OR 1=1; --" | 1. Nhập keyword độc. 2. Tìm. | (1) DB không drop, không leak. (3) Backend sanitize → query LIKE literal "' OR 1=1; --" → INF-DN-TK-01 không kết quả. | Edge 🔴 |
| TC-TKDN-015 | FR-V.III-02 / BR-EC-13 | tu_khoa > 200 ký tự (boundary) | Login. | tu_khoa = string 201 chars | 1. Nhập 201 ký tự. 2. Tìm. | (1) Backend trim/reject. (2) Validation error hoặc auto-truncate (BR-EC-13: max 200). ⚠️ Verify behavior: hard reject với message hay soft truncate? **SRS không quote message rõ — flag**. | Edge 🟡 |
| TC-TKDN-016 | FR-V.III-02 / G5 | tu_ngay > den_ngay (lỗi range) | Login. | tu_ngay=2026-04-01, den_ngay=2026-01-01 | 1. Chọn từ ngày sau đến ngày. 2. Tìm. | (1) Backend reject hoặc client-side date-picker chặn. (2) Error message **"SRS Gap: chưa quote nguyên văn cho range invalid"** — verify thực tế. (3) Form giữ. | Negative 🟢 |
| TC-TKDN-017 | FR-V.III-02 / G5 | Chỉ tu_ngay (open-ended từ) | Login. Seed VV ngày 2026-03-15. | tu_ngay=2026-01-01, den_ngay=null | 1. Nhập từ ngày, để trống đến ngày. 2. Tìm. | (3) Hiển thị DN có VV ≥ 2026-01-01 (open-ended). ⚠️ Verify: backend cho phép one-side range không. Flag G5. | Edge 🟢 |
| TC-TKDN-018 | FR-V.III-02 / Inputs#1 | tu_khoa Unicode + diacritic | Login. DN-A ten="Công ty Á Đông". | tu_khoa="Á Đông" | 1. Nhập keyword Unicode. 2. Tìm. | (3) DN-A match. Backend collation Unicode hoạt động đúng. | Edge 🟢 |
| TC-TKDN-019 | FR-V.III-02 / SCR-V.III-01 row#7 | Search-box change → auto-filter (debounce) | Login. | tu_khoa typing "AB" → "ABC" | 1. Gõ "AB". 2. Đợi. 3. Gõ thêm "C". | (3) SRS row#7 ghi "change → filter" — auto-trigger query không cần click [Tìm kiếm]. Verify debounce ~300-500ms. ⚠️ **SRS không quote debounce delay — verify thực tế**. | Edge 🟢 |
| TC-TKDN-020 | FR-V.III-02 / Inputs#1 + BR-EC-13 | tu_khoa với LIKE wildcard `%`, `_` | Login. | tu_khoa="%" hoặc "_" | 1. Nhập wildcard. 2. Tìm. | (1) ⚠️ **BR-EC-13 quote "escape ký tự đặc biệt truy vấn" (srs-v3.md:4078) — verify backend escape `%` `_` thành literal**. Expected: hiển thị DN có chứa literal `%` hoặc `_` trong tên (ít có), KHÔNG match all. | Edge 🔴 |
| TC-TKDN-021 | FR-V.III-02 / Inputs#1 | tu_khoa whitespace leading/trailing | Login. DN tên="Công ty ABC". | tu_khoa=" ABC " (có space đầu cuối) | 1. Nhập. 2. Tìm. | (3) Backend trim trước query (BR-EC-13 quote "trim, max 200 ký tự"). DN ABC match. | Edge 🟢 |
| TC-TKDN-022 | FR-V.III-02 / Inputs#1 | tu_khoa multi-keyword (space giữa) | Login. DN-A="Công ty TNHH ABC", DN-B="Công ty ABC TNHH". | tu_khoa="Công ty ABC" (3 từ) | 1. Tìm. | (3) ⚠️ **SRS Gap G13**: SRS không quote search engine — full-text vs LIKE %term1%term2%term3% vs OR logic? Default LIKE → expected match cả DN-A và DN-B. Flag BA. | Edge 🟡 |
| TC-TKDN-023 | FR-V.III-02 / Processing step 2 | Tất cả filter empty → load default scope | Login (cb_nv_tw_01). | Tất cả filter trống | 1. Click [Tìm kiếm] không nhập gì. | (3) Backend trả về scope mặc định của role (BR-AUTH-08), tương đương load page lần đầu. Pagination 20/page. | Happy 🟡 |
| TC-TKDN-024 | FR-V.III-02 / SCR-V.III-01 row#13 | Filter persist khi pagination next page | Login. Filter quy_mo=NHO active. >40 DN match. | — | 1. Apply filter quy_mo=NHO. 2. Click trang 2. | (1) Backend GET `/doanh-nghiep?quy_mo=NHO&page=2`. (3) Filter chip vẫn hiển thị "Quy mô: NHO". Trang 2 chỉ DN NHO. | Happy 🔴 |
| TC-TKDN-025 | FR-V.III-02 / SCR-V.III-01 row#13 | URL deep-link với filter param | Login. | URL: `/doanh-nghiep?quy_mo=NHO&tinh_thanh=HCM` | 1. Paste URL. 2. Page load. | (3) Filter pre-filled từ URL. Table hiển thị kết quả filter. ⚠️ **SRS Gap G14: SRS không quote URL sync — verify thực tế** (note CLAUDE.md cite "BR-UX-01 nếu module có filter"). Flag BA. | Edge 🟡 |
| TC-TKDN-026 | FR-V.III-02 / Inputs#4 | Filter "Lĩnh vực KD" — source dropdown | Login. | linh_vuc_kd values | 1. Mở dropdown lĩnh vực. 2. Quan sát options. | (3) ⚠️ **SRS Conflict + Gap G15**: SCR row#10 quote "select" (srs-fr-07:381) nhưng Entity row 26 là `linh_vuc_kinh_doanh` text + Inputs row#17 cũng text. Source dropdown từ DANH_MUC nào? Flag BA. | Edge 🟡 |
| TC-TKDN-027 | FR-V.III-02 / Inputs#5,6 / G5 | Filter date — tu_ngay = today, den_ngay = today (cùng ngày) | Login. Seed VV ngày today. | tu_ngay=today, den_ngay=today | 1. Tìm. | (3) ⚠️ **SRS Gap G5**: inclusive 2 đầu hay exclusive? Default assume inclusive (BETWEEN) → DN có VV today match. Flag BA. | Edge 🟡 |
| TC-TKDN-028 | FR-V.III-02 / Processing default sort | Search keep default sort hay relevance | Login. tu_khoa="ABC". | — | 1. Tìm. 2. Quan sát thứ tự. | (3) ⚠️ **SRS Gap G13**: SRS không quote sort khi search. Default sort theo SCR row 399 "ngày cập nhật mới nhất trước". Verify khi có search keyword có đổi sort không. Flag BA. | Edge 🟢 |
| TC-TKDN-029 | FR-V.III-02 / BR-EC-13 performance | Search trên 10k+ records — timeout boundary | Login. 12,000 DN seed. | tu_khoa="A" (match đa phần) | 1. Tìm. | (3) ⚠️ **BR-EC-13 quote "Bảng > 10K → tìm kiếm toàn văn" (srs-v3.md:4078)**. Verify backend dùng full-text index, response time <3s. Flag performance test. | Edge 🟡 |
| TC-TKDN-030 | FR-V.III-02 / Inputs#1 | tu_khoa = chuỗi rỗng "" sau click search | Login. | tu_khoa="" | 1. Click search-box. 2. KHÔNG gõ gì. 3. Click [Tìm kiếm]. | (3) Behave như TC-TKDN-023 (load default scope, không filter). | Edge 🟢 |
| TC-TKDN-031 | FR-V.III-02 / Inputs#5,6 / G5 | Filter date tu_ngay = den_ngay nhưng không có VV ngày đó | Login. DN-X không có VV ngày 2026-04-30. | tu_ngay=den_ngay=2026-04-30 | 1. Tìm. | (3) Empty state INF-DN-TK-01: **"Không tìm thấy doanh nghiệp phù hợp"** (srs-fr-07:262). | Edge 🟢 |
| TC-TKDN-032 | FR-V.III-02 / Inputs#1 | Tìm kiếm case-insensitive: tu_khoa chữ thường match Tên DN chữ hoa | 1. cb_nv_tw_01 login. 2. Seed DN-A ten="Công ty TNHH ABC CAPITAL". | tu_khoa="abc capital" (chữ thường) | 1. Nhập "abc capital". 2. Click [Tìm kiếm]. | (3) DN-A hiển thị (case-insensitive match). ⚠️ **SRS không quote case-sensitivity cho search** — default expected insensitive (ILIKE hoặc LOWER() collation). Verify backend behavior. | Edge 🟢 |

---

## Tổng kết file 02-TC

- **29 TC** (verified bằng grep): 11 Happy + 2 Negative + 16 Edge (gồm 12 TC từ Edge Case Hunter + 1 TC từ Deep Review)
- **TC bổ sung từ Deep Review**: TC-TKDN-032 (case-insensitive search)
- **SRS Gap flag**: G5, G13, G14, G15
- **Critical TC** (🔴): 001, 006, 010, 013, 014, 020, 024 — phải pass 100%
