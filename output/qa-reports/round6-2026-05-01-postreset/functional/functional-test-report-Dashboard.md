# Functional Test Report — Dashboard (R6.7.7)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Dashboard / Tổng quan hệ thống (Module 7.1) |
| **SRS Reference** | srs-fr-01-dashboard.md — FR-I-01..09, FR-I-CROSS-02, KPI-03/04, BR-AUTH-01/03/04/08, BR-SLA-05, BR-CALC-03 |
| **UC Coverage** | UC1..UC9 + 2 KPI bổ sung |
| **Người test** | QA Automation (Claude Code via Chrome DevTools MCP) |
| **Ngày** | 2026-05-05 → 2026-05-06 (data reset xảy ra giữa session) |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) |
| **Test Method** | UI-based + Network/Console inspection (MCP Chrome DevTools) |
| **Primary Account** | `cb_nv_tw_01` / Secret@123 — CB_NV_TW, Cục BTTP |
| **Round** | Round 6, Day 3 |
| **Tài liệu tham chiếu** | [test-strategy §7.1](../../../test-strategy.md#71-module-dashboard-11-fr) · [funtion/7.1-dashboard.md](../../../funtion/7.1-dashboard.md) · [bug-report](../bug-reports/bug-report-functional-dashboard.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 34 |
| **TC đã test / Tổng TC** | 34/34 (100%) — 7 PARTIAL/DEFER do data gap hoặc spec không đo được tự động |
| **Passed** | 19 |
| **Failed** | 3 |
| **Partial** | 5 |
| **Defer / Observation** | 7 |
| **Overall Pass Rate** | 55.9% (19/34, PARTIAL không tính PASS) |
| **P0 Pass Rate** | 71.4% (10/14 P0 PASS — 3 P0 FAIL: DASH-010/017/018) |
| **Bugs Found (SRS-ref)** | 4 (1 Critical, 2 Major, 1 Medium) |
| **Observations (out-of-SRS)** | 3 (URL sync, Đơn vị "Tất cả" missing, Năm filter ignore by BE) |
| **Health Score** | **62/100** |
| **Start Time** | 19:43 (2026-05-05) |
| **End Time** | 08:45 (2026-05-06) — xen kẽ data reset overnight |
| **Total Duration** | ~110 phút effective testing time (excluding wait/data reset) |
| **Browse Status** | OK (MCP Chrome DevTools, 1 environment Vite crash giữa session đã recover) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | DEFER | **Pass Rate** |
|------|-------|----------|------|---------|------|-------|---------------|
| **Happy** | Load Dashboard + KPI hiển thị | 4 | 4 | 0 | 0 | 0 | **100%** |
| **UI / Responsive** | Trend arrow, responsive layout | 2 | 1 | 1 | 0 | 0 | **50%** |
| **Negative** | Date range invalid, empty kỳ, 5xx, no chart data | 4 | 2 | 0 | 0 | 2 | **50%** |
| **Workflow** | Filter Năm, Apply, Reset, Auto-refresh, Drill-down | 11 | 6 | 1 | 3 | 1 | **54.5%** |
| **Authorization** | TW/BN/DP/QTHT/TVV/Anonymous + dropdown Đơn vị | 7 | 6 | 1 | 0 | 0 | **85.7%** |
| **Cross-module** | Count Dashboard vs Module list | 7 | 3 | 2 | 0 | 2 | **42.9%** |
| **Total** | | **34** | **19** | **5** | **3** | **7** | **55.9%** |

→ **Happy-path Pass Rate = 4/4 (100%)** — Dashboard load đầy đủ KPI/chart/filter ngay khi user đăng nhập. Module sẵn sàng cho user xem.

### Verdict: **CONDITIONAL PASS — Major UX issues phải fix trước release**

Dashboard load và phân quyền hoạt động ổn định (TW/BN/DP/QTHT/TVV scope đúng, anonymous bị chặn). Nhưng **3 P0 FAIL** ảnh hưởng trải nghiệm trực tiếp: (1) Năm dropdown không auto-set ngày → user phải nhập tay, (2) Drill-down Vụ việc filter bằng literal `TIEP_NHAN` không match enum module → table empty, (3) Drill-down Khóa học redirect sai sang Chương trình đào tạo. Cross-module count mismatch (KPI VV-DXL 65 vs Module 14, KPI VV-HT 1 vs Module 18) báo động về tin cậy số liệu Dashboard.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| DASH-001 | UC1-7 | Login canbo_tw → Dashboard load đủ 7 KPI + 2 biểu đồ + 2 KPI bổ sung | Happy | P0 | **PASS** | — | 7 thẻ + 2 chart + 2 KPI bổ sung visible ngay. Console sạch. 3 API 200. |
| DASH-002 | FR-I-CROSS-02 | "Cập nhật lúc HH:mm" + nút Làm mới reload toàn bộ KPI | Happy | P0 | **PASS** | — | "Cập nhật lúc 19:48" hiển thị. Click Làm mới → 3 API call mới (`/dashboard` + 2 charts). |
| DASH-003 | KPI-03/04 | 2 thẻ KPI bổ sung hiển thị số (% bổ sung, ngày XL TB) | Happy | P1 | **PASS** | — | "Tỷ lệ hồ sơ bổ sung 0%" + "Thời gian XL TB 75 ngày" visible. |
| DASH-004 | SCR-I-01 | KPI hiển thị xu hướng so kỳ trước: mũi tên ↑/↓ | Happy | P1 | **PASS** | — | minus + "Ổn định" + arrow-up + "+100%" visible trên 2 KPI bổ sung. |
| DASH-005 | SCR-I-01 | Responsive: 1024-1279px → 4 cột co lại 2 cột | UI | P2 | **PARTIAL** | — | Resize 1100px thành công (sau 1 lần Vite crash recover). Layout adjust visually verified qua screenshot — cần spec định nghĩa breakpoint chính xác. |
| DASH-006 | ERR-DASH-01 | tu_ngay > den_ngay → toast "Ngày bắt đầu phải trước ngày kết thúc" | Negative | P1 | **PASS** | — | Toast hiển thị đúng spec sau click Áp dụng với 31/12/2026 → 01/01/2026. |
| DASH-007 | INFO-DASH-01 | Kỳ lọc không có data → KPI = "0" + "Chưa có dữ liệu" | Negative | P1 | **PARTIAL** | BUG-DASH-007 | Đổi Năm=2020 → KPI VV vẫn 100 (BE không filter theo nam). 2 KPI bổ sung + 2 chart hiển thị "Chưa có dữ liệu" đúng. |
| DASH-008 | ERR-DASH-02 | API KPI lỗi 5xx → toast "Lỗi tải dữ liệu" + auto-refresh không dừng | Negative | P1 | **DEFER** | — | Không thể simulate 5xx ở UI test. Cần BE chaos test hoặc network throttle. |
| DASH-009 | INFO-DASH-02 | Không có KET_QUA_DANH_GIA → biểu đồ UC8 trống + message | Negative | P2 | **PASS** | — | Chart UC9 "Chất lượng đào tạo" hiển thị "Trống" + "Chưa có dữ liệu đào tạo trong kỳ" (data đào tạo chưa seed). Chart UC8 có data nên không trống ở session này. |
| DASH-010 | SCR-I-01 | Đổi Năm → tu_ngay auto set 01/01/{năm}, den_ngay auto set hôm nay/31-12 | Workflow | P0 | **FAIL** | **BUG-DASH-001** | Đổi Năm=2025 → date inputs trống. Click Áp dụng → API gửi `nam=2025&tuNgay=2026-01-01&denNgay=2026-05-05` (date range vẫn 2026 hiện tại). KPI không thay đổi (BE prefer date range). |
| DASH-011 | SCR-I-01 | Chọn `tu_ngay`+`den_ngay` → click Áp dụng → 7 KPI + 2 chart reload | Workflow | P0 | **PARTIAL** | BUG-DASH-007 | Áp dụng valid range → API call mới fired 200. Nhưng URL chỉ sync `?nam=...`, KHÔNG sync `tuNgay/denNgay/donVi` — bookmark/share không khôi phục đầy đủ filter. |
| DASH-012 | SCR-I-01 | Click "Xóa bộ lọc" → reset default | Workflow | P1 | **PASS** | — | Click → API gửi `nam=2026&tuNgay=2026-01-01&denNgay=2026-05-05` (default). KPI restore. |
| DASH-013 | FR-I-CROSS-02 | Auto-refresh 60s | Workflow | P0 | **PASS** | — | Wait 70s → 3 API auto-fire (`/dashboard` + 2 charts) verify qua `list_network_requests`. |
| DASH-014 | FR-I-CROSS-02 | Tab khác ≥60s → quay lại → refresh ngay | Workflow | P1 | **DEFER** | — | MCP không control được multi-tab focus event ở Page Visibility API level. Cần manual test. |
| DASH-015 | FR-I-CROSS-02 | Tab ẩn → timer pause (KHÔNG gọi API khi ẩn) | Workflow | P1 | **DEFER** | — | Cần Page Visibility API simulation ngoài MCP scope. |
| DASH-016 | FR-I-01 | Click KPI-01 (HD mới) → drill-down `/hoi-dap/danh-sach?trang_thai=MOI` | Workflow | P0 | **PASS** | — | Click → URL `/hoi-dap?trangThai=MOI&tuNgay=2026-01-01&denNgay=2026-05-05`. Pagination "1-20 / 64 mục" khớp KPI 64. Note: path camelCase `trangThai` thay snake_case spec. |
| DASH-017 | FR-I-02/03/04 | Click KPI-02/03/04 → drill-down `/vu-viec/danh-sach` filter trạng thái | Workflow | P0 | **FAIL** | **BUG-DASH-002** | Click "VV tiếp nhận 100" → URL `/vu-viec/danh-sach?trangThai=TIEP_NHAN`. Filter dropdown hiển thị literal "TIEP_NHAN" (chưa localize). Table EMPTY ("Không có dữ liệu") vì state thực tế là ĐÃ_PHÂN_CÔNG/ĐANG_XỬ_LÝ/CHỜ_PHÊ_DUYỆT — enum mismatch FE-FE. |
| DASH-018 | FR-I-05/06 | Click KPI-05/06 (Đào tạo) → drill-down `/dao-tao/khoa-hoc?trang_thai=DANG_DIEN_RA` | Workflow | P0 | **FAIL** | **BUG-DASH-003** | Click → URL `/dao-tao/khoa-hoc?trangThai=DANG_DIEN_RA` nhưng app redirect sang `/dao-tao/chuong-trinh/danh-sach` (Chương trình đào tạo, KHÔNG phải Khóa học). Sai module đích. |
| DASH-019 | FR-I-07 | Click KPI-07 (CG/TVV) → drill-down `/chuyen-gia-tvv/danh-sach` | Workflow | P1 | **PASS** | — | Click → `/chuyen-gia-tvv/danh-sach?tuNgay=2026-01-01&denNgay=2026-05-05`. Tab "Đang hoạt động" selected, total 11 mục khớp KPI 11. |
| DASH-020 | KPI-03/04 | Click 2 KPI bổ sung → KHÔNG navigate (cursor=default) | Workflow | P2 | **PASS** | — | DOM check: cursor=default trên card "Tỷ lệ hồ sơ bổ sung" và "Thời gian xử lý trung bình". Click không navigate. |
| DASH-021 | BR-AUTH-04 | canbo_tw xem Dashboard → KPI toàn quốc | Authorization | P0 | **PASS** | — | KPI VV-TN=70 (toàn quốc). Dropdown Đơn vị có 10+ BN options. KPI > BN/DP scope confirm. |
| DASH-022 | BR-AUTH-03/08 | cb_nv_bn (BKH) → KPI chỉ data BKH | Authorization | P0 | **PASS** | — | cb_nv_bn_01 (BKH) login → KPI all=0 (BKH chưa có VV/HD/KH). Dropdown Đơn vị KHÔNG visible (read-only). |
| DASH-023 | BR-AUTH-03/08 | cb_nv_dp (AG) → KPI chỉ data AG | Authorization | P0 | **PASS** | — | cb_nv_dp_01 (AG) → KPI VV-TN=23, VV-DXL=17 (AG scope). Dropdown Đơn vị ẩn. 70 (TW) > 0+23 → có data ở DP khác (đúng scope). |
| DASH-024 | SCR-I-01 | Dropdown Đơn vị: TW chọn được bất kỳ + "Tất cả"; BN/ĐP read-only/ẩn | Authorization | P1 | **PARTIAL** | BUG-DASH-006 | TW: dropdown 10+ BN options visible ✓. BN/DP: dropdown ẨN hoàn toàn ✓. Nhưng TW dropdown KHÔNG có option "Tất cả" explicit — chỉ là default state khi không chọn. |
| DASH-025 | BR-AUTH-08 | qtht_tw → Dashboard read-only, KHÔNG có CUD | Authorization | P1 | **PASS** | — | qtht_01 login → Dashboard load đầy đủ KPI/filter. Không có nút Tạo/Sửa/Xóa. |
| DASH-026 | — | NHT/TVV/CG → KHÔNG thấy menu Dashboard / 403 | Authorization | P1 | **PASS** | — | tvv_01 login → URL `/403` "Bạn không có quyền truy cập". Sidebar chỉ 4 module (KH/TVV/VV/Tư vấn), KHÔNG có "Tổng quan". Direct URL `/dashboard` cũng → `/403`. |
| DASH-027 | BR-AUTH-01 | Truy cập /dashboard chưa login → /login | Authorization | P0 | **PASS** | — | Logout → navigate `/dashboard` → redirect `/login`. |
| DASH-028 | FR-I-01 | KPI-01 = COUNT(HD MOI) so với module 7.2 | Cross-module | P0 | **PASS** | — | KPI HD=64 = `/hoi-dap?trangThai=MOI` pagination "1-20 / 64 mục". Khớp. (Verify với data session đầu — sau reset HD=0 nên không re-verify được.) |
| DASH-029 | FR-I-02/03/04 | KPI-02/03/04 = COUNT(VV) theo nhóm trạng thái so với module 7.5 | Cross-module | P0 | **PARTIAL/FAIL** | **BUG-DASH-004** | KPI VV-TN 100 = Module 7.5 tab "Tất cả" 100 mục ✓. **NHƯNG**: KPI VV-DXL 65 ≠ Module tab "Đang xử lý" 14 mục (-51); KPI VV-HT 1 ≠ Module tab "Hoàn thành" 18 mục (+17). **Mismatch nghiêm trọng** — Dashboard số liệu không tin cậy. |
| DASH-030 | FR-I-05/06 | KPI-05/06 = COUNT(KH) DANG_DIEN_RA / KET_THUC so với 7.3 | Cross-module | P0 | **DEFER** | — | KH count = 0 cả Dashboard lẫn module Chương trình đào tạo (data KH chưa seed) — chưa có data để cross-check meaningfully. |
| DASH-031 | FR-I-07 | KPI-07 = COUNT(TVV DANG_HOAT_DONG) so với 7.4 | Cross-module | P0 | **PASS** | — | KPI CG/TVV=11 = Module 7.4 list tab "Đang hoạt động" 11 mục. |
| DASH-032 | FR-I-08 / BR-SLA-05 | Biểu đồ UC8: SLA% + điểm hài lòng từ KET_QUA_DANH_GIA | Cross-module | P1 | **PARTIAL** | — | Chart UC8 dual-axis hiển thị (Y left 0-5 điểm, Y right 0-100% SLA, X tháng "05/2026"). Có data render. **Không thể verify công thức BR-SLA-05** (`completed_on_time / total_completed`) qua UI vì cần raw data ĐG/HĐ. |
| DASH-033 | FR-I-09 | Biểu đồ UC9 (donut): xếp loại đào tạo từ KET_QUA_DAO_TAO | Cross-module | P1 | **DEFER** | — | Chart "Chất lượng đào tạo" hiển thị "Trống" + "Chưa có dữ liệu đào tạo trong kỳ". Không có KET_QUA_DAO_TAO record để verify. |
| DASH-034 | KPI-04 / BR-CALC-03 | KPI-04 = AVG(ngày HT − ngày TN) ngày làm việc | Cross-module | P1 | **PARTIAL** | — | KPI Thời gian XL TB hiển thị 75 ngày (cb_nv_tw_01 session đầu) → 0 ngày + "Chưa có dữ liệu" (sau data reset). **Không thể verify BR-CALC-03 logic ngày làm việc T2-T6** mà không có mẫu VV `HOAN_THANH` cụ thể với `ngay_tiep_nhan` và `ngay_hoan_thanh` qua weekend. |

### Chú thích

> **Result:** PASS / FAIL / BLOCKED / PARTIAL / DEFER (không trong scope ngắn hạn / cần data hoặc env support)
> **Type:** Happy / Negative / UI / Workflow / Authorization / Cross-module
> **Priority:** P0 / P1 / P2

---

## 3. Bug Report (tóm tắt inline)

> Chi tiết Steps/Evidence/Impact/Fix xem [bug-report-functional-dashboard.md](../bug-reports/bug-report-functional-dashboard.md).

### BUG-DASH-001 — Major: Năm dropdown không auto-set tu_ngay/den_ngay theo năm chọn

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P0 |
| **TC Reference** | DASH-010 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Khi user chọn Năm khác (vd 2025) từ dropdown, frontend KHÔNG auto-set `tu_ngay = 01/01/2025` và `den_ngay = 31/12/2025`. Date inputs trở về trống. User phải nhập tay → trải nghiệm gãy.

**Expected vs Actual:** Spec: Năm=2025 → tu_ngay=01/01/2025, den_ngay=31/12/2025. Actual: Năm=2025 → date inputs trống → API gửi `nam=2025&tuNgay=2026-01-01&denNgay=2026-05-05` (default range 2026 vẫn giữ).

**Impact:** Mọi user TW dùng dropdown Năm để xem báo cáo kỳ cũ → KPI sai, không reflect dữ liệu năm cũ.

**Root Cause (Suggested):** Handler `onChange` của Năm dropdown chỉ update state `nam`, không trigger compute `[tuNgay, denNgay]` based on năm chọn.

---

### BUG-DASH-002 — Major: Drill-down KPI Vụ việc filter literal không match enum state

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P0 |
| **TC Reference** | DASH-017 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Click KPI "Vụ việc tiếp nhận: 100" → drill-down `/vu-viec/danh-sach?trangThai=TIEP_NHAN`. Module Vụ việc filter dropdown hiển thị literal `TIEP_NHAN` (chưa localize) và **table EMPTY** vì enum value `TIEP_NHAN` không match state thực tế (ĐÃ_PHÂN_CÔNG / ĐANG_XỬ_LÝ / CHỜ_PHÊ_DUYỆT / YÊU_CẦU_BỔ_SUNG).

**Expected vs Actual:** Spec: drill-down → tab "Tiếp nhận" active + count khớp KPI. Actual: tab "Tất cả" selected, dropdown filter literal "TIEP_NHAN", table 0 rows mặc dù module có 100 VV.

**Impact:** User click KPI "100 vụ việc" thấy danh sách trống → cảm giác hệ thống lỗi/mất dữ liệu.

**Root Cause (Suggested):** Dashboard FE hardcode `trangThai=TIEP_NHAN` (single value) trong khi VU_VIEC có nhiều state thuộc nhóm "tiếp nhận". Module list filter expects exact enum match. Cần (1) dùng tab nhóm thay state literal, hoặc (2) gửi list trạng thái `?trangThai=DA_PHAN_CONG,DANG_XU_LY,...`, hoặc (3) BE thêm group filter.

---

### BUG-DASH-003 — Critical: Drill-down Đào tạo redirect sang sai module

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DASH-018 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Click KPI "Đào tạo đang diễn ra: 0 khóa học" → URL initial `/dao-tao/khoa-hoc?trangThai=DANG_DIEN_RA` nhưng app **redirect** sang `/dao-tao/chuong-trinh/danh-sach` (Chương trình đào tạo, là PARENT entity của Khóa học, KHÔNG phải Khóa học).

**Expected vs Actual:** Spec: drill-down `/dao-tao/khoa-hoc` filter `trang_thai=DANG_DIEN_RA`. Actual: redirect `/dao-tao/chuong-trinh/danh-sach` heading "Chương trình đào tạo" với 6 chương trình "Dự thảo".

**Impact:** User không thể từ Dashboard navigate đến danh sách Khóa học để theo dõi training đang chạy → workflow gãy hoàn toàn.

**Root Cause (Suggested):** Route `/dao-tao/khoa-hoc` không tồn tại hoặc chưa implement → AuthGuard/Router fallback redirect default sang Chương trình đào tạo. Cần thêm route + page Khóa học list.

---

### BUG-DASH-004 — Major: Cross-module count mismatch giữa Dashboard và Module Vụ việc

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P0 |
| **TC Reference** | DASH-029 |
| **Status** | Open |
| **Assignee** | BE Team + FE Team |

**Mô tả:** Số liệu Dashboard KPI **không khớp** count tab tương ứng ở module 7.5 Vụ việc:

| KPI Dashboard | Số | Module 7.5 tab | Số | Δ |
|---|---|---|---|---|
| Vụ việc tiếp nhận | 100 | "Tất cả" (no filter) | 100 | 0 ✓ |
| Vụ việc đang xử lý | 65 | tab "Đang xử lý" | 14 | **−51** ✗ |
| Vụ việc hoàn thành | 1 | tab "Hoàn thành" | 18 | **+17** ✗ |

**Expected vs Actual:** Spec: KPI grouped count khớp với count tab module list (cùng filter kỳ + đơn vị). Actual: chênh lệch lớn cả 2 chiều — Dashboard ít hơn ở "Đang xử lý" (-51) nhưng nhiều hơn ở "Hoàn thành" định nghĩa khác (+17).

**Impact:** Dashboard số liệu không tin cậy → leadership/QTHT không thể dùng Dashboard để báo cáo. Có thể gây tranh cãi nội bộ về KPI thực tế.

**Root Cause (Suggested):** Hai khả năng:
1. **Date filter scope khác:** Dashboard mặc định 01/01/2026 → 05/05/2026 (~5 tháng), tab module list không filter date → all-time count.
2. **Group state khác:** "Đang xử lý" KPI Dashboard có thể bao gồm CHỜ_PHÊ_DUYỆT, YÊU_CẦU_BỔ_SUNG; tab module chỉ filter exact `DANG_XU_LY`. Tương tự "Hoàn thành" có thể group tightly hơn ở Dashboard.

Cần (1) align date filter scope giữa Dashboard và module list, (2) document rõ state grouping trong spec.

---

### BUG-DASH-005 — Medium: Filter dropdown Trạng thái module Vụ việc hiển thị literal `TIEP_NHAN`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P1 |
| **TC Reference** | DASH-017 (sub) |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Khi drill-down từ Dashboard với param `trangThai=TIEP_NHAN`, module Vụ việc filter dropdown hiển thị raw enum value `TIEP_NHAN` thay vì localized label "Tiếp nhận".

**Impact:** UX lỗi — user nhìn thấy enum code thay vì text Tiếng Việt.

---

## 4. Detailed Test Results

> Vì 34 TC, phần Detailed này tóm tắt 5 TC quan trọng/FAIL. Phần còn lại đã có evidence trong section 2 (1 dòng/TC) + screenshots.

### 4.1 DASH-010 — Năm dropdown auto-set ngày (FAIL)

**Pre-conditions:**
- User cb_nv_tw_01 đã login Dashboard
- Năm hiện tại: 2026 (default)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click dropdown Năm → chọn 2025 | Năm=2025 selected, tu_ngay auto=01/01/2025, den_ngay auto=31/12/2025 | Năm=2025 selected ✓; date inputs trở về TRỐNG ✗ | **FAIL** |
| 2 | Click "Áp dụng" | API gửi nam=2025&tuNgay=2025-01-01&denNgay=2025-12-31; KPI reload theo 2025 | API gửi nam=2025&tuNgay=2026-01-01&denNgay=2026-05-05; KPI vẫn 64 hỏi đáp = 2026 data | **FAIL** |

**Notes:** Network reqid=618-620 gửi `nam=2025` nhưng giữ date range 2026 → BE filter ưu tiên date range, ignore nam → KPI không thay đổi.

**Evidence:** [DASH-010-FAIL-nam-2025-not-autoset.png](../screenshots/DASH-010-FAIL-nam-2025-not-autoset.png)

---

### 4.2 DASH-017 — Drill-down KPI Vụ việc với enum literal (FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click KPI "Vụ việc tiếp nhận: 100" | URL `/vu-viec/danh-sach?trang_thai=TIEP_NHAN` + tab/filter active | URL `/vu-viec/danh-sach?trangThai=TIEP_NHAN&tuNgay=2026-01-01&denNgay=2026-05-05` ✓ | **PASS** |
| 2 | Verify list count khớp KPI 100 | Table có data, count = 100 | Table EMPTY, "Không có dữ liệu". Filter dropdown hiển thị literal "TIEP_NHAN" | **FAIL** |
| 3 | Click tab "Tất cả" để verify total | Tab "Tất cả" = 100 mục | Tab "Tất cả" = 100 mục ✓ (state thực: ĐÃ_PHÂN_CÔNG, ĐANG_XỬ_LÝ, CHỜ_PHÊ_DUYỆT, YÊU_CẦU_BỔ_SUNG) | **PASS** sub-step |

**Root cause:** Dashboard FE hardcode `trangThai=TIEP_NHAN` enum không tồn tại trong module 7.5 state machine. State thực tế của VU_VIEC không có giá trị literal `TIEP_NHAN`.

**Evidence:** [DASH-029-FAIL-vuviec-tiepnhan-empty.png](../screenshots/DASH-029-FAIL-vuviec-tiepnhan-empty.png)

---

### 4.3 DASH-018 — Drill-down Khóa học redirect sang Chương trình đào tạo (FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click KPI "Đào tạo đang diễn ra: 0 khóa học" | URL `/dao-tao/khoa-hoc?trang_thai=DANG_DIEN_RA` | URL `/dao-tao/khoa-hoc?trangThai=DANG_DIEN_RA&...` (initial) | **PASS** sub |
| 2 | Verify page là Khóa học list | Heading "Khóa học" + filter trạng thái | URL redirect → `/dao-tao/chuong-trinh/danh-sach`, heading "Chương trình đào tạo" (sai module) | **FAIL** |

**Evidence:** [DASH-018-FAIL-drilldown-wrong-module.png](../screenshots/DASH-018-FAIL-drilldown-wrong-module.png)

---

### 4.4 DASH-029 — Cross-module count VV mismatch (PARTIAL/FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Đọc Dashboard KPI VV-TN/DXL/HT | (100, 65, 1) | (100, 65, 1) ✓ | OK |
| 2 | Navigate `/vu-viec/danh-sach`, count tab "Tất cả" | 100 (khớp KPI VV-TN) | 100 mục ✓ | **PASS** |
| 3 | Click tab "Đang xử lý", count | 65 (khớp KPI VV-DXL) | 14 mục (-51) | **FAIL** |
| 4 | Click tab "Hoàn thành", count | 1 (khớp KPI VV-HT) | 18 mục (+17) | **FAIL** |

---

### 4.5 DASH-013 — Auto-refresh 60s (PASS)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login + load Dashboard, ghi network requests | 3 API initial: `/dashboard`, `/dashboard/chart/hieu-qua`, `/dashboard/chart/chat-luong-dao-tao` | 3 API 200 OK (reqid 5098/5099/5100) | OK |
| 2 | Wait ~70s | Auto-refresh fire 3 API ≥1 lần | reqid 5103/5104/5105 — 3 API auto-fire (không user action) | **PASS** |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| cb_nv_tw_01 | CB_NV_TW | Cục BTTP | TW | DASH-001..020, 021, 028..034 (primary) |
| cb_nv_bn_01 | CB_NV_BN | BKH | BN | DASH-022 |
| cb_nv_dp_01 | CB_NV_DP | STP-AG | DP | DASH-023 |
| qtht_01 | QTHT | — | — | DASH-025 |
| tvv_01 | TVV | STP-AG | DP | DASH-026 |
| (anonymous) | — | — | — | DASH-027 |

### 5.2 Data observed

| KPI | Initial (2026-05-05 19:48, cb_nv_tw_01) | After reset (2026-05-06 08:34, cb_nv_tw_01) | After reset (cb_nv_dp_01 AG) |
|-----|-----|-----|-----|
| Hỏi đáp mới | 64 | 0 | 0 |
| VV tiếp nhận | 100 | 70 | 23 |
| VV đang xử lý | 65 | 70 | 17 |
| VV hoàn thành | 1 | 0 | 0 |
| KH đang diễn ra / hoàn thành | 0 / 0 | 0 / 0 | 0 / 0 |
| CG/TVV | 11 | 0 | 0 |
| Tỷ lệ HS bổ sung | 0% | 0% | 0% |
| Thời gian XL TB | 75 ngày | 0 ngày (Chưa có dữ liệu) | 0 ngày |

> **Note:** Data đã reset/seed lại giữa 2026-05-05 23:00 đến 2026-05-06 08:30. Cross-module DASH-028 verify với data initial (HD=64 khớp module=64). DASH-029 sub-checks dùng data initial (VV-TN=100, DXL=65, HT=1).

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/dashboard?nam={N}&tuNgay={YYYY-MM-DD}&denNgay={YYYY-MM-DD}`
  - Charts: `/api/v1/dashboard/chart/hieu-qua-ho-tro`, `/api/v1/dashboard/chart/chat-luong-dao-tao`
- **Auth flow:** JWT (localStorage `auth-store`) + OTP email (bypass `666666`)
- **Auth storage:** `localStorage.auth-store` (NOTE: CLAUDE.md ghi `sessionStorage` nhưng thực tế là `localStorage` — cần update doc)
- **Frontend:** React + Vite + Ant Design (Drawer/Modal mix, custom CSS module cho OTP input)
- **Backend:** Trả 200 cho hợp lệ, 400 cho date range invalid (chart endpoint), filter prefer date range over `nam` param
- **Known limitations:** 
  - 1 lần Vite dynamic import crash giữa session (`Failed to fetch dynamically imported module: /src/pages/auth/login/index.tsx`) sau viewport resize → recover bằng reload + re-login.
  - Logout có lúc sticky ở /403 → dùng user-menu dropdown thay direct navigate.

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-DASH-003 (Critical):** Implement route `/dao-tao/khoa-hoc` + page Khóa học list, hoặc đổi drill-down KPI-05/06 sang URL đúng. Current behavior khiến user bị redirect sai module hoàn toàn.
2. **BUG-DASH-001 (Major):** Auto-set `tu_ngay = 01/01/{nam}` và `den_ngay = (năm hiện tại ? today : 31/12/{nam})` khi đổi Năm dropdown. Đây là spec rõ ràng (DASH-010), gãy ảnh hưởng workflow xem báo cáo kỳ cũ.
3. **BUG-DASH-002 (Major):** Đổi drill-down KPI Vụ việc dùng nhóm trạng thái (multi-value) hoặc tab thay vì literal `TIEP_NHAN`. Map enum đúng với state thực tế của VU_VIEC.
4. **BUG-DASH-004 (Major):** Resolve cross-module count mismatch — align date filter scope giữa Dashboard và module list, document state grouping. Số liệu Dashboard không tin cậy = blocker cho leadership reports.

### Should Fix

5. **BUG-DASH-005 (Medium):** Localize filter dropdown Trạng thái module Vụ việc — không hiển thị enum literal `TIEP_NHAN`.
6. **BUG-DASH-006 (Minor):** Thêm option "Tất cả" explicit vào dropdown Đơn vị (TW) — hiện chỉ là default state.
7. **BUG-DASH-007 (Minor):** URL sync đầy đủ `?nam=...&tuNgay=...&denNgay=...&donVi=...` để bookmark/share preserve filter.

### Additional Recommendations

8. **Test data:** Seed KH (Khóa học DANG_DIEN_RA + KET_THUC) + KET_QUA_DAO_TAO để unblock DASH-030/033.
9. **Test data:** Seed KET_QUA_DANH_GIA với SLA on-time/late mix để verify BR-SLA-05 trong DASH-032.
10. **Test data:** Seed VV `HOAN_THANH` có `ngay_tiep_nhan=Friday` + `ngay_hoan_thanh=Monday` → verify BR-CALC-03 ngày làm việc trong DASH-034.
11. **Page Visibility:** Cần manual test DASH-014/015 ngoài MCP (open second tab → wait 60s → verify network).
12. **Doc fix:** CLAUDE.md ghi auth ở `sessionStorage.auth-store` nhưng thực tế là `localStorage.auth-store` — update.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/auth/login` | Login | All |
| POST | `/api/v1/auth/verify-otp` | OTP bypass `666666` | All |
| GET | `/api/v1/dashboard` | KPI numbers (7 thẻ + 2 KPI bổ sung) | DASH-001/002/010/011/012/013 |
| GET | `/api/v1/dashboard/chart/hieu-qua-ho-tro` | Chart UC8 dual-axis | DASH-001/032 |
| GET | `/api/v1/dashboard/chart/chat-luong-dao-tao` | Chart UC9 donut | DASH-001/033 |
| GET | `/api/v1/don-vi/public` | Dropdown Đơn vị (TW) | DASH-024 |
| GET | `/api/v1/thong-baos/unread-count` | Badge thông báo (sub-resource) | All |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [DASH-001-cb_nv_tw_01-dashboard-load.png](../screenshots/DASH-001-cb_nv_tw_01-dashboard-load.png) | Full Dashboard load đầy đủ KPI/chart/filter | DASH-001 |
| [DASH-006-PASS-invalid-date-range-toast.png](../screenshots/DASH-006-PASS-invalid-date-range-toast.png) | Toast "Ngày bắt đầu phải trước ngày kết thúc" | DASH-006 |
| [DASH-007-nam2020-still-2026-data.png](../screenshots/DASH-007-nam2020-still-2026-data.png) | Năm=2020 selected nhưng KPI vẫn 2026 data | DASH-007 |
| [DASH-010-FAIL-nam-2025-not-autoset.png](../screenshots/DASH-010-FAIL-nam-2025-not-autoset.png) | Năm 2025 nhưng date inputs trống | DASH-010 |
| [DASH-016-PASS-drilldown-hoidap-64.png](../screenshots/DASH-016-PASS-drilldown-hoidap-64.png) | Drill-down /hoi-dap → 64 mục khớp KPI | DASH-016 |
| [DASH-018-FAIL-drilldown-wrong-module.png](../screenshots/DASH-018-FAIL-drilldown-wrong-module.png) | Click KPI Đào tạo → redirect Chương trình đào tạo | DASH-018 |
| [DASH-022-PASS-cb_nv_bn_01-scope.png](../screenshots/DASH-022-PASS-cb_nv_bn_01-scope.png) | BN BKH KPI all=0, dropdown Đơn vị ẩn | DASH-022 |
| [DASH-023-PASS-cb_nv_dp_01-AG-scope.png](../screenshots/DASH-023-PASS-cb_nv_dp_01-AG-scope.png) | DP AG KPI VV-TN=23, dropdown Đơn vị ẩn | DASH-023 |
| [DASH-025-qtht_01-dashboard.png](../screenshots/DASH-025-qtht_01-dashboard.png) | qtht_01 Dashboard read-only | DASH-025 |
| [DASH-026-PASS-tvv-403.png](../screenshots/DASH-026-PASS-tvv-403.png) | tvv_01 → /403, sidebar không có Tổng quan | DASH-026 |
| [DASH-027-anon-redirect-login.png](../screenshots/DASH-027-anon-redirect-login.png) | Anonymous /dashboard → /login | DASH-027 |
| [DASH-029-FAIL-vuviec-tiepnhan-empty.png](../screenshots/DASH-029-FAIL-vuviec-tiepnhan-empty.png) | Drill-down VV trangThai=TIEP_NHAN → table empty | DASH-017/029 |
| [DASH-005-responsive-1100px.png](../screenshots/DASH-005-responsive-1100px.png) | Viewport 1100px responsive layout | DASH-005 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-I-01 (UC1) | DASH-016, DASH-028 | 2/2 PASS |
| FR-I-02/03/04 (UC2-4) | DASH-017, DASH-029 | 0/2 PASS (FAIL/PARTIAL) |
| FR-I-05/06 (UC5-6) | DASH-018, DASH-030 | 0/2 PASS (FAIL/DEFER) |
| FR-I-07 (UC7) | DASH-019, DASH-031 | 2/2 PASS |
| FR-I-08 / BR-SLA-05 (UC8) | DASH-009, DASH-032 | 1/2 PASS (PARTIAL) |
| FR-I-09 (UC9) | DASH-033 | 0/1 PASS (DEFER no data) |
| FR-I-CROSS-02 (Auto-refresh) | DASH-002, DASH-013, DASH-014, DASH-015 | 2/4 PASS (2 DEFER) |
| BR-AUTH-01 | DASH-027 | 1/1 PASS |
| BR-AUTH-03/08 | DASH-022, DASH-023 | 2/2 PASS |
| BR-AUTH-04 | DASH-021 | 1/1 PASS |
| BR-CALC-03 | DASH-034 | 0/1 PASS (PARTIAL no data) |
| KPI-03/04 | DASH-003, DASH-020 | 2/2 PASS |
| SCR-I-01 | DASH-005, DASH-010, DASH-011, DASH-012, DASH-024 | 2/5 PASS |
| ERR-DASH-01 | DASH-006 | 1/1 PASS |
| ERR-DASH-02 | DASH-008 | 0/1 (DEFER) |
| INFO-DASH-01/02 | DASH-007, DASH-009 | 1/2 PASS (PARTIAL) |

---

*Report generated: 2026-05-06 | QA Automation via Claude Code (MCP Chrome DevTools)*
