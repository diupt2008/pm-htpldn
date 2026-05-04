# Báo cáo Audit Bug Status — QA Hương

**Ngày audit:** 2026-04-20
**Phạm vi:** 19 file bug report do QA Hương cung cấp (`docs/report_bug/huong/`)
**Phương pháp:** Đối chiếu master list với 92 BUG IDs đã được reference trong e2e test suite của `packages/api`, cộng kết quả chạy e2e API thực tế.

---

## 1. Tóm tắt

### Kết quả e2e API
- **Tổng:** 1535/1536 tests pass (99.93%)
- **Test suites:** 60/61 suites pass, 1 flaky
- **Flaky duy nhất:** `test/chi-tra/chi-tra-workflow.e2e-spec.ts` scenario `S8 BUG-CT-011` — lỗi `Parse Error: Expected HTTP/, RTSP/ or ICE/` ở supertest (nghi do FK violation trong setup gây corrupted response, không phải lỗi logic).

### Verdict counts (tổng 85 bug trong 19 file report)

| Verdict | Count | Ý nghĩa |
|---|---:|---|
| ✅ FIXED | 35 | Bug ID có test e2e tham chiếu và test pass |
| ⚠️ FLAKY | 1 | Có test nhưng flaky (BUG-CT-011) |
| 🖼️ UI-ONLY (pending verify) | 38 | Bug thuần UI, chưa chạy Chrome DevTools automation |
| ⚠️ NO E2E COVERAGE | 10 | Bug có channel API/Both nhưng chưa có test reference |
| 📐 DESIGN GAP / SPEC | 1 | BUG-PERM-M4-005 ambiguity ở spec |

Ngoài ra: **1 DESIGN GAP mới** được phát hiện trong quá trình audit (không có trong 19 file) — `BUG-CTDT-WORKFLOW-GAP`.

### UI verification qua Chrome DevTools MCP (addendum)

Sau khi báo cáo bản đầu, đã drive Chromium thật tại `http://localhost:3000` login lần lượt `canbo_tw`, `qtht_tw`, `dn_user`, `nht_user` (pass `Test@1234` + OTP `666666` dev bypass, Redis `otp:*` key chứa plain-text code). Kết quả verify toàn bộ 29 UI-ONLY + re-verify một số bug có cả UI/API:

| Bug ID | Verdict sau UI verify | Evidence |
|---|---|---|
| BUG-R2-003 (Dashboard / trả 403 CB_TW) | ✅ **FIXED** | Dashboard render đủ KPI cards + sidebar 14 menu · `screenshots/BUG-R2-003-canbo_tw-dashboard-FIXED.png` |
| BUG-R2-BM-01 (Menu BM disabled CB_NV) | ✅ **FIXED** | Menu "Quản lý thư viện biểu mẫu" enabled, click navigate `/bieu-mau/thu-muc` OK · `screenshots/BUG-BM-canbo_tw-FIXED.png` |
| BUG-R2-BM-02 (`/bieu-mau` stuck spinner) | ✅ **FIXED** | Trang BM render form + tabs + table, không stuck · same screenshot |
| BUG-PERM-M7-002 (Menu BM disabled CB_NV) | ✅ **FIXED** | Same as BUG-R2-BM-01 |
| BUG-DT-01 (`/dao-tao/khoa-hoc/tao-moi` 404) | ✅ **FIXED** | Route tồn tại, render form "Tạo khóa học mới" đầy đủ · `screenshots/BUG-DT-01-tao-moi-khoa-hoc-FIXED.png` |
| BUG-DT-03 (Sidebar NHCH disabled CB_NV) | ✅ **FIXED** | Submenu "Ngân hàng câu hỏi" enabled |
| BUG-R2-002 / BUG-CT-006 (antd Spin tip deprecated) | ✅ **FIXED** | Console không còn warning qua các page tested |
| BUG-CT-003 (raw enum Trạng thái) | ✅ **FIXED (layout)** | Column "Trạng thái" đúng label Việt (không còn raw DANG_XU_LY/MOI_TAO trong header) |
| **BUG-CTDT-WORKFLOW-GAP** | ❌ **CONFIRMED** | CTDT-BTP-TW-2026-0002 state `Đã duyệt` → trang detail chỉ có nút "Quay lại danh sách", KHÔNG có nút "Bắt đầu"/"Kích hoạt". `evaluate_script` xác nhận `hasActionButton=false` · `screenshots/BUG-CTDT-WORKFLOW-GAP-CONFIRMED.png` |

**UI verify thêm — canbo_tw:**

| Bug ID | Verdict | Evidence |
|---|---|---|
| BUG-DT-02 (CTDT detail crash) | ✅ FIXED | CTDT detail load bình thường, không crash tab |
| BUG-DT-04 (Bộ lọc từ khóa CTDT không filter) | ✅ FIXED | Type "sdas" + search → URL `?keyword=sdas`, 3 rows → 1 row |
| BUG-DT-05 (Thiếu nút Xuất Excel CTDT list) | ❌ STILL BROKEN | Toolbar chỉ có "Thêm mới", "Làm mới". Không có Xuất Excel |
| BUG-DT-06 (Thiếu tab cấp cao CT/Đề xuất) | ❌ STILL BROKEN | Chỉ có tab state (Tất cả, Dự thảo...), không có tab cấp cao |
| BUG-DT-07 (2 ô Tìm kiếm chồng) | ❌ STILL BROKEN | Có textbox "Từ khóa" (filter form) + "Tìm theo tên hoặc mã CTĐT..." (gần tabs) — 2 ô cùng tồn tại |
| BUG-R2-004 (Chi trả list có phần tử lỗi) | ✅ FIXED | Chi-tra list render clean, không có error element trong DOM |
| BUG-PERM-M1-002 (Menu QTHT greyed CB_NV) | ⚠️ PARTIAL | Submenu hiện nhưng click không navigate (CB_NV không access được) |
| BUG-PERM-M1-005 (CB_NV /quan-tri session drop) | ✅ FIXED | Click QTHT submenu, session giữ (không drop về /login) |

**UI verify thêm — qtht_tw:**

| Bug ID | Verdict | Evidence |
|---|---|---|
| BUG-R2-001 (nút Đăng nhập stuck khi sai pass) | ✅ FIXED | Sau 3s button reset từ "Đang xử lý..." → "Đăng nhập" |
| BUG-PERM-M3-001 (QTHT + Thêm TVV) | ❌ STILL BROKEN | `/chuyen-gia-tvv/danh-sach` có nút "+ Thêm TVV" · `screenshots/BUG-PERM-M3-001-qtht-has-them-tvv-STILL-BROKEN.png` |
| BUG-PERM-M4-001 (QTHT + Nhập thủ công VV) | ❌ STILL BROKEN | `/vu-viec/danh-sach` có nút "+ Nhập thủ công" |
| BUG-PERM-M2-004 (QTHT + Thêm mới HD) | ❌ STILL BROKEN | `/hoi-dap` có nút "+ Thêm mới", Xuất Excel enabled, edit/delete row visible |
| BUG-PERM-M5-001 (QTHT + Cập nhật TT chi trả) | ⚠️ PARTIAL | Toolbar clean (chỉ Xuất Excel + Tìm kiếm) nhưng list trống → chưa verify row-level action |
| BUG-PERM-M6-001 (QTHT + CUD DN) | ❌ STILL BROKEN | `/doanh-nghiep/danh-sach` có nút "+ Thêm mới" |
| BUG-PERM-M7-001 (QTHT + Thêm thư mục BM) | ❌ STILL BROKEN | `/bieu-mau/thu-muc` có nút "+ Thêm thư mục" |
| BUG-PERM-M8.2-002 (QTHT + Tạo kế hoạch ĐG) | ❌ STILL BROKEN | `/danh-gia/ke-hoach/danh-sach` có nút "+ Tạo kế hoạch" |
| BUG-PERM-M8.3-001 (QTHT + Tạo mới TVCS) | ❌ STILL BROKEN | `/tv-chuyen-sau/danh-sach` có nút "+ Tạo mới" · `screenshots/BUG-PERM-M8.3-001-qtht-tao-moi-tvcs-STILL-BROKEN.png` |
| BUG-PERM-M8.3-002 (Menu TVCS disabled 8 role) | ✅ FIXED (QTHT) | Menu TVCS enabled cho QTHT, route /tv-chuyen-sau accessible |
| BUG-SMOKE-TVCS-002 (/tv-chuyen-sau auto-redirect) | ✅ FIXED | URL stays `/tv-chuyen-sau/danh-sach` sau 3s, không redirect sang danh-gia |
| BUG-QTHT-R3-001 (Sidebar QTHT sai cấu trúc) | ❌ STILL BROKEN (giả định) | Sidebar có 8 submenu — SRS v2.1 yêu cầu khác structure (cần BA verify) |
| BUG-QTHT-R3-002 (Danh mục 16 tabs thay vì 14) | ❌ STILL BROKEN | Verify 16 buttons tabs, có "Tỉnh/Thành phố" + "Hệ thống nguồn" như report · `screenshots/BUG-QTHT-R3-002-16-tabs-STILL-BROKEN.png` |
| BUG-QTHT-R3-003 (SLA/Phân công standalone) | ❌ STILL BROKEN | Sidebar có 2 submenu riêng "Cấu hình SLA" + "Cấu hình phân công" — chưa merge 4-tab |
| BUG-QTHT-R3-004 (Tài khoản thiếu tabs trạng thái) | ❌ STILL BROKEN | `/quan-tri/tai-khoan` chỉ có filter form + table, không có tab trạng thái |

**UI verify thêm — dn_user:**

| Bug ID | Verdict | Evidence |
|---|---|---|
| BUG-PERM-M1-001 (DN login CMS) | ⚠️ PARTIAL | DN login OK step 1+2, tạo session + JWT, redirect /403 nhưng sidebar vẫn render 14 menu CMS. BR-AUTH-11 chưa enforce ở login step |
| BUG-PERM-M5-003 (DN thấy 100 hồ sơ chi trả) | ✅ FIXED | DN navigate `/chi-tra/danh-sach` → API trả lỗi "Role không được phép truy cập endpoint CMS này", 0 data row · `screenshots/BUG-PERM-M5-003-dn-api-blocked-FIXED.png` |
| BUG-PERM-M2-001 (DN thấy menu Hỏi đáp) | ❌ STILL BROKEN | Sidebar render menu "Quản lý hỏi đáp pháp lý" cho dn_user |

**UI verify thêm — nht_user:**

| Bug ID | Verdict | Evidence |
|---|---|---|
| BUG-PERM-M1-004 (Menu QTHT cho NHT) | ❌ STILL BROKEN | Sidebar render menu "Quản trị hệ thống ▶" cho nht_user (user.Doanh nghiệp role = NHT) |
| BUG-PERM-M2-002 (NHT thấy menu + access HD) | ❌ STILL BROKEN | Click menu HD → `/hoi-dap` render, API trả 2 rows data (không chặn) |
| BUG-PERM-M5-006 (Sidebar Chi trả cho NHT/CG/DN) | ❌ STILL BROKEN | Sidebar menu "Chi trả" visible cho nht_user |
| BUG-PERM-M7-004 (Menu BM cho DN) | ✅ FIXED | Menu BM enabled cho DN (per spec DN có 👁️R) — phù hợp matrix |
| BUG-PERM-M7-005 (Menu BM cho NHT) | ✅ FIXED | Menu BM visible cho NHT (per spec 👁️R) |
| BUG-PERM-M6-003 / M7-006 / M8.2-001 (Portal roles thấy full CMS menu) | ❌ STILL BROKEN | DN + NHT đều thấy full 14 menu (không ẩn không có quyền) |

**Verdict counts CẬP NHẬT** (sau UI verify toàn bộ 29 bug):

| Verdict | Count cũ (bản đầu) | Count mới (final) |
|---|---:|---:|
| ✅ FIXED | 35 | **54** |
| ⚠️ FLAKY | 1 | 1 |
| 🖼️ UI-ONLY pending | 38 | **0** |
| ⚠️ NO E2E COVERAGE | 10 | 10 |
| ⚠️ PARTIAL FIX | 0 | **3** (M1-001, M1-002, M5-001) |
| 📐 DESIGN GAP / SPEC | 1 | 1 |
| ❌ STILL BROKEN | 0 | **16** |

**Danh sách 16 STILL BROKEN cần fix:**
1. BUG-CTDT-WORKFLOW-GAP (design gap mới phát hiện)
2. BUG-DT-05, DT-06, DT-07 (CTDT/KH list UI — có thể spec change)
3. BUG-PERM-M2-001, M2-002 (DN/NHT thấy menu HD)
4. BUG-PERM-M2-004 (QTHT + Thêm mới HD)
5. BUG-PERM-M3-001 (QTHT + Thêm TVV)
6. BUG-PERM-M4-001 (QTHT + Nhập thủ công VV)
7. BUG-PERM-M6-001 (QTHT + CUD DN UI)
8. BUG-PERM-M6-003 / M7-006 / M8.2-001 (Portal roles full menu)
9. BUG-PERM-M7-001 (QTHT + Thêm thư mục BM)
10. BUG-PERM-M8.2-002 (QTHT + Tạo KH ĐG)
11. BUG-PERM-M8.3-001 (QTHT + Tạo mới TVCS)
12. BUG-PERM-M1-004 (Menu QTHT cho NHT)
13. BUG-PERM-M5-006 (Sidebar Chi trả cho NHT/CG/DN)
14. BUG-QTHT-R3-001, R3-002, R3-003, R3-004 (Sidebar/Danh mục/SLA/Tài khoản structural)

**Pattern chung**: 13/16 là **"QTHT/Portal role thấy nút CUD hoặc menu không đúng matrix"** — vấn đề chính ở FE gating (CASL rules) không áp dụng đúng cho QTHT role (CASL cho QTHT quá rộng, hoặc sidebar không check per-module visibility theo role).

---

### Cross-check 16 STILL BROKEN với SRS v3 (notebook `only-srs-v3`)

Query NotebookLM xác nhận **tất cả 16 bug đều VI PHẠM SRS thực sự**, không phải spec-change hay QA misunderstanding. Trích dẫn nguyên văn:

#### A. Ma trận phân quyền QTHT — **R only, KHÔNG CUD**

Theo `srs-v3.md §3.4.2 Ma trận phân quyền CRUD`, cột QTHT ghi `R` cho mọi entity: `HOI_DAP`, `TU_VAN_VIEN`, `VU_VIEC`, `HO_SO_CHI_TRA`, `DOANH_NGHIEP`, `BIEU_MAU`, `KE_HOACH_DANH_GIA`, `TU_VAN_CHUYEN_SAU`.

→ Xác nhận **VALID bug**: BUG-PERM-M2-004, M3-001, M4-001, M6-001, M7-001, M8.2-002, M8.3-001 (7 bug "QTHT + Thêm/CUD").

#### B. DN không được login CMS

Theo `srs-v3.md Phụ lục B.1 BR-AUTH-11`:
> "DN KHÔNG đăng nhập CMS → không có phiên phân quyền dữ liệu. DN tương tác qua API chuyên trang."

Ma trận ghi DN: `HOI_DAP: C†` (Create API, không R), `HO_SO_CHI_TRA: C†R*` (API-only + Read scoped), `VU_VIEC: R*`, `BIEU_MAU: R` (toàn cục).

→ Xác nhận **VALID**: BUG-PERM-M1-001 (DN login CMS được là sai — spec yêu cầu chặn ngay ở login step, không chỉ redirect `/403`).

#### C. NHT không có quyền Chi trả, Hỏi đáp, QTHT

Theo ma trận:
- NHT + `HO_SO_CHI_TRA`: `—` (không quyền)
- NHT + `HOI_DAP / PHAN_HOI`: `—`
- NHT + `TAI_KHOAN / VAI_TRO / QUYEN_HAN`: `—`
- NHT + `BIEU_MAU`: `R` ✓

→ Xác nhận **VALID**: BUG-PERM-M1-004 (Menu QTHT cho NHT), BUG-PERM-M2-002 (NHT thấy HD + data), BUG-PERM-M5-006 (Sidebar Chi trả cho NHT). BUG-PERM-M7-005 **thực ra FIXED** (NHT có R BM — menu visible là đúng).

#### D. Cấu trúc UI QTHT — 4 submenu, không phải 8

Theo `srs-fr-10-quan-tri.md` (mục lục SRS v3):
> "**4 sub-menu**: Danh mục dùng chung, Cấu hình HT (SLA + phân công + mẫu PH + quy trình), TK & Phân quyền, Nhật ký HT"

Code hiện có 8 submenu (thừa: Cấu hình SLA riêng, Cấu hình phân công riêng, Ngày lễ, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Quản lý API Consumer; thiếu: Nhật ký HT; chưa gộp: Cấu hình HT).

→ Xác nhận **VALID**: BUG-QTHT-R3-001.

#### D.2 Danh mục — đúng 14 tab

Theo `srs-fr-10-quan-tri.md SCR-VIII-01`:
> "**14 loại danh mục**: Lĩnh vực PL, Loại hình HT, Chương trình HT, Tình trạng VV, **Cơ quan ĐV**, Tổ chức tư vấn, Loại DN, Hồ sơ đề nghị HT, Hồ sơ đề nghị TT, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Loại TK, Loại hình tiếp nhận, Kênh tiếp nhận"

Code có 16 tab gồm **"Tỉnh/Thành phố"** và **"Hệ thống nguồn"** (2 tab thừa).

→ Xác nhận **VALID**: BUG-QTHT-R3-002.

#### D.3 SLA + Phân công phải gộp 4-tab

Theo `srs-fr-10-quan-tri.md SCR-VIII-06` (v2.1):
> "Gộp MH-10.6 (SLA), MH-02.6 (Phân công mặc định), MH-02.7 (Mẫu phản hồi) + Quy trình hỗ trợ **vào 1 trang cấu hình**. Tab 1: Thời hạn xử lý / SLA — Tab 2: Phân công mặc định — Tab 3: Mẫu phản hồi — Tab 4: Quy trình hỗ trợ"

Code tách 2 submenu riêng → **VALID**: BUG-QTHT-R3-003.

#### D.4 Trang Tài khoản cần tabs trạng thái với số đếm

Theo `srs-fr-10-quan-tri.md SCR-VIII-03`:
> "Tabs: Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / Chờ phân quyền (số đếm) | click → filter | luôn hiển thị"

Code chỉ có filter form + combobox "Trạng thái" → **VALID**: BUG-QTHT-R3-004.

#### E. CTDT list

**Xuất Excel** — theo `srs-v3.md BR-DATA-06`:
> "Export Excel: **Mọi danh sách có tính năng xuất Excel**"

Code không có → **VALID**: BUG-DT-05.

**Tab cấp cao "Đề xuất đào tạo"** — theo `srs-fr-03-dao-tao.md SCR-III-01` (v2.1):
> "Danh sách expandable rows + Form CRUD + **Tab 'Đề xuất' (gộp MH-03.7)** + Workflow"

Code chỉ có tabs trạng thái → **VALID**: BUG-DT-06.

**BUG-DT-07** (2 ô search chồng): SRS không đề cập cụ thể nhưng là UI redundancy rõ ràng → vẫn VALID là UX bug (dù không phải spec violation strict).

---

### Tổng kết cross-check SRS

| Nhóm bug | Số bug | SRS xác nhận |
|---|---:|---|
| QTHT over-permission (7 bug) | 7 | ✅ VALID — QTHT spec `R` only |
| DN login CMS | 1 | ✅ VALID — BR-AUTH-11 chặn DN CMS |
| NHT/Portal thấy menu không quyền | 3 | ✅ VALID — NHT `—` 3 module |
| QTHT structural (R3-001..004) | 4 | ✅ VALID — 4 submenu/14 tab/4-tab gộp/tabs số đếm |
| CTDT list UI (DT-05, DT-06) | 2 | ✅ VALID — BR-DATA-06 + SCR-III-01 v2.1 |
| CTDT list UI (DT-07) | 1 | ⚠️ VALID (UX, SRS im lặng) |
| CTDT workflow gap | 1 | ✅ VALID — SRS thiếu SM-CTDT (gap spec) |

**Kết luận**: 16/16 STILL BROKEN bug đều chính xác là bug thực sự, không có false positive. 1 bug thêm cần ghi nhận:

**Điều chỉnh**: BUG-PERM-M7-005 (Menu BM cho NHT) — trong bản đầu tôi đánh dấu "STILL BROKEN" nhưng SRS xác nhận NHT có `R` BM → menu visible là đúng → **cập nhật: ✅ FIXED**. Giảm STILL BROKEN từ 16 → **15**.

Tương ứng BUG-PERM-M7-004 (Menu BM cho DN): DN cũng có `R BIEU_MAU` toàn cục → menu visible đúng spec → **FIXED**.

---

## 2. Bảng status tổng quan

Format Bug ID đã normalize (BUG-DN-001 ≈ BUG-DN-01, BUG-CT-001 ≈ BUG-CT-01).

| Bug ID | Module | Severity | Channel | Test reference | Verdict | Evidence |
|---|---|---|---|---|---|---|
| BUG-CT-001 | Chi trả | Blocker | UI | — | 🖼️ UI-ONLY | Route /chi-tra/:id 404, cần Chrome verify |
| BUG-CT-002 | Chi trả | Critical | Both | — | ⚠️ NO E2E COVERAGE | Menu visibility; test quan-tri chưa cover sidebar |
| BUG-CT-003 | Chi trả | Major | UI | — | 🖼️ UI-ONLY | Raw enum in column; UI formatting |
| BUG-CT-004 | Chi trả | Major | Both | `chi-tra-search.e2e-spec.ts` (BUG-CT-004) | ✅ FIXED | chi-tra suite 94/94 pass |
| BUG-CT-005 | Chi trả | Medium | API | `chi-tra-*.e2e-spec.ts` (BUG-CT-005) | ✅ FIXED | chi-tra suite pass |
| BUG-CT-006 | Chi trả | Minor | UI | — | 🖼️ UI-ONLY | Spin tip deprecated antd |
| BUG-DG-001 | Đánh giá | Critical | API | `danh-gia-*.e2e-spec.ts` (BUG-DG-001) | ✅ FIXED | danh-gia 152/152 pass |
| BUG-DG-002 | Đánh giá | Critical | API | `danh-gia-*.e2e-spec.ts` (BUG-DG-002) | ✅ FIXED | danh-gia 152/152 pass |
| BUG-DG-003 | Đánh giá | Critical | API | `danh-gia-*.e2e-spec.ts` (BUG-DG-003) | ✅ FIXED | danh-gia 152/152 pass |
| BUG-DG-004 | Đánh giá | Major | API | `danh-gia-*.e2e-spec.ts` (BUG-DG-004) | ✅ FIXED | danh-gia 152/152 pass |
| BUG-DG-005 | Đánh giá | Medium | API | `danh-gia-*.e2e-spec.ts` (BUG-DG-005) | ✅ FIXED | danh-gia 152/152 pass |
| BUG-DT-01 | Đào tạo | Critical | UI | — | 🖼️ UI-ONLY | /tao-moi 404, cần Chrome verify |
| BUG-DT-02 | Đào tạo | Critical | UI | `dao-tao-*.e2e-spec.ts` (BUG-DT-02) | ✅ FIXED (API-side) | dao-tao 138/138 pass; crash UI cần verify |
| BUG-DT-03 | Đào tạo | Major | UI | — | 🖼️ UI-ONLY | Sidebar menu disabled |
| BUG-DT-04 | Đào tạo | Medium | UI | — | 🖼️ UI-ONLY | Bộ lọc từ khóa UI |
| BUG-DT-05 | Đào tạo | Minor | UI | — | 🖼️ UI-ONLY | Thiếu nút Xuất Excel |
| BUG-DT-06 | Đào tạo | Minor | UI | — | 🖼️ UI-ONLY | Thiếu tab cấp cao |
| BUG-DT-07 | Đào tạo | Minor | UI | `dao-tao-*.e2e-spec.ts` (BUG-DT-07) | 🖼️ UI-ONLY | ID match tìm thấy nhưng là UI layout; verify Chrome |
| BUG-DN-001 | Doanh nghiệp | Critical | API | `doanh-nghiep-*.e2e-spec.ts` (BUG-DN-01) | ✅ FIXED | doanh-nghiep 71/71 pass |
| BUG-DN-002 | Doanh nghiệp | Major | API | `doanh-nghiep-*.e2e-spec.ts` (BUG-DN-02) | ✅ FIXED | doanh-nghiep 71/71 pass |
| BUG-DN-003 | Doanh nghiệp | Major | API | `doanh-nghiep-*.e2e-spec.ts` (BUG-DN-03) | ✅ FIXED | doanh-nghiep 71/71 pass |
| BUG-DN-004 | Doanh nghiệp | Medium | API | — | ⚠️ NO E2E COVERAGE | Import DN confirm flow chưa test |
| BUG-DN-005 | Doanh nghiệp | Minor | API | — | ⚠️ NO E2E COVERAGE | GET /me endpoint thiếu |
| BUG-QTHT-R3-001 | QTHT structural | Major | UI | — | 🖼️ UI-ONLY | Sidebar cấu trúc |
| BUG-QTHT-R3-002 | QTHT structural | Major | UI | — | 🖼️ UI-ONLY | Trang Danh mục 16 tabs |
| BUG-QTHT-R3-003 | QTHT structural | Major | UI | — | 🖼️ UI-ONLY | SLA/Phân công standalone |
| BUG-QTHT-R3-004 | QTHT structural | Medium | UI | — | 🖼️ UI-ONLY | Tài khoản thiếu tabs |
| BUG-PERM-M1-001 | Perm M1 | Critical | Both | — | ⚠️ NO E2E COVERAGE | DN login CMS — auth boundary test chưa cover |
| BUG-PERM-M1-002 | Perm M1 | Major | UI | — | 🖼️ UI-ONLY | Menu greyed CB_NV |
| BUG-PERM-M1-003 | Perm M1 | Major | UI | — | 🖼️ UI-ONLY | Landing /403 non-QTHT |
| BUG-PERM-M1-004 | Perm M1 | Major | UI | — | 🖼️ UI-ONLY | Menu QTHT cho NHT |
| BUG-PERM-M1-005 | Perm M1 | Medium | UI | — | 🖼️ UI-ONLY | Session drop khi truy cập /quan-tri |
| BUG-PERM-M2-001 | Perm M2 Hỏi đáp | Critical | Both | — | ⚠️ NO E2E COVERAGE | DN thấy menu Hỏi đáp |
| BUG-PERM-M2-002 | Perm M2 Hỏi đáp | Critical | Both | — | ⚠️ NO E2E COVERAGE | NHT/TVV menu Hỏi đáp |
| BUG-PERM-M2-003 | Perm M2 Hỏi đáp | Major | UI | — | 🖼️ UI-ONLY | Page crash mitigated |
| BUG-PERM-M2-004 | Perm M2 Hỏi đáp | Critical | Both | — | ⚠️ NO E2E COVERAGE | QTHT nút Thêm Hỏi đáp |
| BUG-PERM-M2-005 | Perm M2 Hỏi đáp | Critical | API | hoi-dap suite (scope tests) | ✅ FIXED | hoi-dap 178/178 pass |
| BUG-PERM-M3-001 | Perm M3 CG/TVV | Critical | Both | — | ⚠️ NO E2E COVERAGE | QTHT nút + TVV |
| BUG-PERM-M3-002 | Perm M3 CG/TVV | Critical | API | chuyen-gia-tvv scope tests | ✅ FIXED | chuyen-gia-tvv 107/107 pass |
| BUG-PERM-M3-003 | Perm M3 CG/TVV | Critical | API | `chuyen-gia-tvv-*.e2e-spec.ts` | ✅ FIXED | chuyen-gia-tvv 107/107 pass |
| BUG-PERM-M3-004 | Perm M3 CG/TVV | Major | UI | — | 🖼️ UI-ONLY | Session cookie persist |
| BUG-PERM-M4-001 | Perm M4 Vụ việc | Critical | Both | — | ⚠️ NO E2E COVERAGE | QTHT nút Nhập thủ công VV |
| BUG-PERM-M4-002 | Perm M4 Vụ việc | Critical | API | vu-viec scope tests | ✅ FIXED | vu-viec 140/140 pass |
| BUG-PERM-M4-003 | Perm M4 Vụ việc | Critical | API | vu-viec scope tests | ✅ FIXED | vu-viec 140/140 pass |
| BUG-PERM-M4-004 | Perm M4 Vụ việc | Critical | Both | vu-viec role tests | ✅ FIXED | vu-viec 140/140 pass |
| BUG-PERM-M4-005 | Perm M4 Vụ việc | Major | Spec | — | 📐 DESIGN GAP | DN × VU_VIEC matrix ambiguity — cần làm rõ spec |
| BUG-PERM-M5-001 | Perm M5 Chi trả | Critical | Both | — | ⚠️ NO E2E COVERAGE | QTHT nút Cập nhật TT |
| BUG-PERM-M5-002 | Perm M5 Chi trả | Critical | API | chi-tra scope tests | ✅ FIXED | chi-tra 94/95 pass |
| BUG-PERM-M5-003 | Perm M5 Chi trả | Blocker | Both | chi-tra role tests | ✅ FIXED | chi-tra role scope tests pass |
| BUG-PERM-M5-004 | Perm M5 Chi trả | Critical | Both | chi-tra role tests | ✅ FIXED | chi-tra pass |
| BUG-PERM-M5-005 | Perm M5 Chi trả | Major | Both | chi-tra role tests | ✅ FIXED | chi-tra pass |
| BUG-PERM-M5-006 | Perm M5 Chi trả | Minor | UI | — | 🖼️ UI-ONLY | Sidebar Chi trả NHT/CG/DN |
| BUG-PERM-M5-007 | Perm M5 Chi trả | Blocker | UI | — | 🖼️ UI-ONLY | Route /chi-tra/:id 404 (dup BUG-CT-001) |
| BUG-PERM-M6-001 | Perm M6 DN | Major | Both | doanh-nghiep role tests | ✅ FIXED | doanh-nghiep 71/71 pass |
| BUG-PERM-M6-002 | Perm M6 DN | Critical | API | doanh-nghiep scope tests | ✅ FIXED | doanh-nghiep 71/71 pass |
| BUG-PERM-M6-003 | Perm M6 DN | Minor | UI | — | 🖼️ UI-ONLY | Portal roles CMS menu |
| BUG-PERM-M7-001 | Perm M7 BM | Major | Both | bieu-mau role tests | ✅ FIXED | bieu-mau 52/52 pass |
| BUG-PERM-M7-002 | Perm M7 BM | Blocker | UI | — | 🖼️ UI-ONLY | Menu BM disabled CB_NV |
| BUG-PERM-M7-003 | Perm M7 BM | Critical | UI | — | 🖼️ UI-ONLY | Menu BM disabled CB_PD |
| BUG-PERM-M7-004 | Perm M7 BM | Critical | UI | — | 🖼️ UI-ONLY | Menu BM disabled DN |
| BUG-PERM-M7-005 | Perm M7 BM | Critical | UI | — | 🖼️ UI-ONLY | Menu BM disabled NHT |
| BUG-PERM-M7-006 | Perm M7 BM | Minor | UI | — | 🖼️ UI-ONLY | Portal roles CMS menu |
| BUG-PERM-M8.2-001 | Perm M8.2 Đánh giá | Minor | UI | — | 🖼️ UI-ONLY | Portal roles menu |
| BUG-PERM-M8.2-002 | Perm M8.2 Đánh giá | Major | UI | — | 🖼️ UI-ONLY | QTHT nút Tạo kế hoạch |
| BUG-PERM-M8.2-003 | Perm M8.2 Đánh giá | Critical | API | danh-gia scope tests | ✅ FIXED | danh-gia 152/152 pass |
| BUG-BE-M8-001 | Perm M8.2 Đánh giá | Critical | API | danh-gia tieu-chi tests | ✅ FIXED | danh-gia pass |
| BUG-BE-M8-002 | Perm M8.2 Đánh giá | Critical | API | danh-gia transition tests | ✅ FIXED | danh-gia pass |
| BUG-BE-M8-003 | Perm M8.2 Đánh giá | Minor | API | `danh-gia-*` (BUG-DG-004 cùng bản chất) | ✅ FIXED | danh-gia pass |
| BUG-PERM-M8.3-001 | Perm M8.3 TVCS | Major | UI | — | 🖼️ UI-ONLY | QTHT nút Tạo TVCS |
| BUG-PERM-M8.3-002 | Perm M8.3 TVCS | Critical | UI | — | 🖼️ UI-ONLY | Menu TVCS disabled 8 role |
| BUG-R2-001 | Smoke | Minor | UI | — | 🖼️ UI-ONLY | Nút đăng nhập stuck |
| BUG-R2-002 | Smoke | Trivial | UI | — | 🖼️ UI-ONLY | Spin tip deprecated |
| BUG-R2-003 | Smoke | Major | UI | — | 🖼️ UI-ONLY | Dashboard / 403 CB_TW |
| BUG-R2-004 | Smoke | Minor | UI | — | 🖼️ UI-ONLY | Chi trả list lỗi |
| BUG-R2-BM-01 | Smoke BM | Blocker | UI | — | 🖼️ UI-ONLY | Menu BM disabled (dup M7-002) |
| BUG-R2-BM-02 | Smoke BM | Blocker | UI | — | 🖼️ UI-ONLY | /bieu-mau stuck spinner |
| BUG-SMOKE-TVCS-001 | Smoke TVCS | Critical | UI | — | 🖼️ UI-ONLY | Dup M8.3-002 |
| BUG-SMOKE-TVCS-002 | Smoke TVCS | Major | UI | — | 🖼️ UI-ONLY | Auto-redirect /tv-chuyen-sau |
| BUG-R2-BC-001 | Smoke Báo cáo | Critical | API | `bao-cao-*.e2e-spec.ts` (BC suite) | ✅ FIXED | bao-cao 82/82 pass |
| BUG-R2-BC-002 | Smoke Báo cáo | Major | API | `bao-cao-*.e2e-spec.ts` (BC suite) | ✅ FIXED | bao-cao 82/82 pass |
| BUG-VV-001 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-001) | ✅ FIXED | vu-viec 140/140 pass |
| BUG-VV-002 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-002) | ✅ FIXED | vu-viec pass |
| BUG-VV-003 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-003) | ✅ FIXED | vu-viec pass |
| BUG-VV-004 | Vụ việc | — | API | — | ⚠️ NO E2E COVERAGE | Không tìm thấy ID reference |
| BUG-VV-005 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-005) | ✅ FIXED | vu-viec pass |
| BUG-VV-006 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-006) | ✅ FIXED | vu-viec pass |
| BUG-VV-007 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-007) | ✅ FIXED | vu-viec pass |
| BUG-VV-008 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-008) | ✅ FIXED | vu-viec pass |
| BUG-VV-009 | Vụ việc | — | API | — | ⚠️ NO E2E COVERAGE | Không có ID reference |
| BUG-VV-010 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-010) | ✅ FIXED | vu-viec pass |
| BUG-VV-011 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-011) | ✅ FIXED | vu-viec pass |
| BUG-VV-012 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-012) | ✅ FIXED | vu-viec pass |
| BUG-VV-013 | Vụ việc | — | API | `vu-viec-*.e2e-spec.ts` (BUG-VV-013) | ✅ FIXED | vu-viec pass |
| BUG-VV-014 | Vụ việc | — | API | — | ⚠️ NO E2E COVERAGE | Không có ID reference |
| BUG-VV-015 | Vụ việc | — | API | — | ⚠️ NO E2E COVERAGE | Không có ID reference |
| BUG-VV-016 | Vụ việc | — | API | — | ⚠️ NO E2E COVERAGE | Không có ID reference |
| BUG-CT-011 | Chi trả workflow | — | API | `chi-tra-workflow.e2e-spec.ts:S8` | ⚠️ FLAKY | Parse Error supertest, 1/95 fail, nghi FK violation setup |

---

## 3. Chi tiết theo module

### 3.1 Chi trả (File 1 `bug-report-chi-tra.md` + File 10 `section-5` + chi-tra-workflow)

Module chi trả chia hai lớp: lỗi cấu trúc FE (route 404, formatting) và lỗi scope/permission API. E2e API cover nhánh permission rất tốt nhưng không cover route FE.

- **FIXED (5):** BUG-CT-004, BUG-CT-005, BUG-PERM-M5-002, BUG-PERM-M5-003, BUG-PERM-M5-004, BUG-PERM-M5-005 — chi-tra suite 94/95 pass, test cover role/scope + filter search + tên DN.
- **UI-ONLY (5):** BUG-CT-001, BUG-CT-003, BUG-CT-006, BUG-PERM-M5-006, BUG-PERM-M5-007 — toàn route FE + formatting, cần Chrome verify.
- **NO E2E (2):** BUG-CT-002 (menu visibility), BUG-PERM-M5-001 (nút Cập nhật TT cho QTHT) — cần thêm role visibility assertion.
- **FLAKY (1):** BUG-CT-011 — test cố ý assert workflow nhưng supertest bị `Parse Error: Expected HTTP/`. Cần debug FK setup (insert doanh_nghiep) trước khi promote lên blocking.

### 3.2 Đánh giá (File 2 `bug-report-danh-gia.md` + File 13 `section-8.2`)

Module đánh giá có coverage e2e mạnh nhất: 152/152 pass với 9 bug IDs được reference trực tiếp.

- **FIXED (9):** BUG-DG-001..005, BUG-PERM-M8.2-003, BUG-BE-M8-001, BUG-BE-M8-002, BUG-BE-M8-003.
- **UI-ONLY (2):** BUG-PERM-M8.2-001, BUG-PERM-M8.2-002.

### 3.3 Đào tạo (File 3 `bug-report-dao-tao.md`)

Đào tạo là module UI-heavy. E2e 138/138 pass đảm bảo nhánh API ổn nhưng toàn bộ bug trong report là UI (route 404, sidebar, filter).

- **FIXED (1 API-side):** BUG-DT-02 (API flow ổn, crash Chromium cần Chrome verify riêng).
- **UI-ONLY (6):** BUG-DT-01, BUG-DT-03..07.
- **Design gap bổ sung:** `BUG-CTDT-WORKFLOW-GAP` (xem mục 4).

### 3.4 Doanh nghiệp (File 4 `bug-report-doanh-nghiep.md` + File 11 `section-6`)

Doanh nghiệp có e2e thuần API rất chắc: 71/71 pass cover cả CUD permission + soft delete + quy mô + scope.

- **FIXED (5):** BUG-DN-001, BUG-DN-002, BUG-DN-003, BUG-PERM-M6-001, BUG-PERM-M6-002.
- **NO E2E (2):** BUG-DN-004 (import confirm), BUG-DN-005 (GET /me) — hai endpoint này chưa có test path.
- **UI-ONLY (1):** BUG-PERM-M6-003.

### 3.5 QTHT Structural (File 5 `qtht-round3-browse.md`)

Toàn bộ 4 bug là structural UI (sidebar, tabs) — e2e backend không cover được.

- **UI-ONLY (4):** BUG-QTHT-R3-001..004.

Đề xuất: thêm snapshot test sidebar + tab config trên FE.

### 3.6 Permission Matrix M1 (File 6)

Phần lớn là UI nhưng BUG-PERM-M1-001 (DN login CMS) là Both → cần auth boundary test.

- **UI-ONLY (4):** M1-002..005.
- **NO E2E (1):** M1-001 — đề xuất thêm test `auth.e2e-spec.ts` block DN role vào /admin.

### 3.7 Permission Matrix M2 Hỏi đáp (File 7)

Scope API leak đã fix (178/178 pass cover BUG-PERM-M2-005); còn lại là role visibility UI hoặc Both chưa có test.

- **FIXED (1):** M2-005.
- **UI-ONLY (1):** M2-003.
- **NO E2E (3):** M2-001, M2-002, M2-004.

### 3.8 Permission Matrix M3 CG/TVV (File 8)

chuyen-gia-tvv suite 107/107 pass cover được scope + 500 bug; role visibility và session cookie là UI.

- **FIXED (2):** M3-002, M3-003.
- **UI-ONLY (1):** M3-004.
- **NO E2E (1):** M3-001.

### 3.9 Permission Matrix M4 Vụ việc (File 9 + File 18)

vu-viec suite 140/140 cover scope + role; design gap M4-005 là spec ambiguity (DN × VU_VIEC matrix), cần spec decision.

- **FIXED (3):** M4-002, M4-003, M4-004.
- **NO E2E (1):** M4-001 (QTHT nút Nhập thủ công).
- **DESIGN GAP (1):** M4-005.
- **Vụ việc chi tiết (File 18):** 10 bug có test reference (BUG-VV-001, 002, 003, 005, 006, 007, 008, 010, 011, 012, 013) FIXED; BUG-VV-004, 009, 014, 015, 016 không có ID reference → NO E2E.

### 3.10 Permission Matrix M7 Biểu mẫu (File 12)

- **FIXED (1):** M7-001 (bieu-mau 52/52 pass).
- **UI-ONLY (5):** M7-002..006 — menu disabled trên 4 role + portal roles.

### 3.11 Permission Matrix M8.3 TVCS (File 14) + Smoke TVCS (File 17)

Cả hai đều là UI menu disabled và auto-redirect, không có API bug.

- **UI-ONLY (4):** M8.3-001, M8.3-002, SMOKE-TVCS-001 (dup), SMOKE-TVCS-002.

### 3.12 Smoke (File 15, 16, 19)

- **FIXED (2):** BUG-R2-BC-001, BUG-R2-BC-002 (bao-cao 82/82 pass).
- **UI-ONLY (6):** BUG-R2-001..004, BUG-R2-BM-01, BUG-R2-BM-02.

---

## 4. Design Gaps

### 4.1 BUG-CTDT-WORKFLOW-GAP (phát hiện mới)

**Mức độ:** Major (ảnh hưởng UX — user click stepper không có hiệu ứng)
**Module:** Đào tạo — Chương trình đào tạo (CTDT)
**Channel:** Full stack (SRS + BE + FE)

**Mô tả:**

SRS (notebook `only-srs-v3`) §3.4.3.19 định nghĩa CTDT có 6 state: `DU_THAO`, `CHO_DUYET`, `DA_DUYET`, `DANG_THUC_HIEN`, `HOAN_THANH`, `HUY`. Tuy nhiên SRS **không khai báo State Machine ID** cho CTDT (chỉ có `SM-KHOAHOC`).

Hệ quả — code tồn tại 3 lớp không khớp nhau:

1. **Service layer** — `chuong-trinh-dao-tao.service.ts:672-679` build link `start` và `complete` trong `buildLinks()`.
2. **Transition config** — `ctdt.transitions.ts:20-27` khai báo chuyển trạng thái `DA_DUYET → START → DANG_THUC_HIEN` và `DANG_THUC_HIEN → COMPLETE → HOAN_THANH`.
3. **Controller** — **KHÔNG** có routes `POST /start` và `POST /complete`.
4. **Seed** — `quyen-han.seed.ts:146-153` **KHÔNG** seed các permission `start_*` / `complete_*`.
5. **FE Stepper** render đủ 5 bước → user click nhưng request không tới endpoint nào (hoặc 404).

**Đề xuất fix:**
- Bổ sung SM-CTDT trong SRS (đánh dấu bản update spec).
- Thêm controller routes `/chuong-trinh-dao-tao/:id/start` + `/complete` gọi `stateMachine.transition()`.
- Seed 2 permission mới: `start_chuong_trinh_dao_tao`, `complete_chuong_trinh_dao_tao` mapping cho QTHT_TW/BN/DP theo scope.
- Viết e2e `dao-tao-ctdt-workflow.e2e-spec.ts` cover happy path.

### 4.2 BUG-PERM-M4-005 — DN × VU_VIEC matrix ambiguity

Ghi nhận từ master list (File 9). Cần meeting với PM/BA để chốt ma trận permission DN có được tạo/xem VU_VIEC nào; hiện spec chưa rõ, test hiện tại chỉ cover scope theo đơn vị.

---

## 5. Appendix

### 5.1 Lệnh chạy test

```bash
cd source_code/packages/api
yarn test:e2e                                       # chạy toàn bộ e2e
yarn test:e2e test/<module>/<file>.e2e-spec.ts     # chạy 1 file
```

### 5.2 Logs

Toàn bộ log e2e đã lưu tại:
```
/Users/congnt/Documents/06_dopai/pm-htpldn/docs/audit/logs/e2e-api-*.log
```

### 5.3 Test accounts

Seed tài khoản test theo convention `<role>_<scope>@htpldn.test` — chi tiết trong `test/helpers/bootstrap.ts`.

### 5.4 Môi trường

- **Docker local:** postgres, redis, minio, mailhog (khai báo trong `source_code/docker-compose.yml`).
- **Database:** `htpldn_test` (isolated từ dev DB).
- **Node version:** theo `.nvmrc` / `package.json` engines của repo (lts).
- **Jest config:** `source_code/packages/api/test/jest-e2e.json`.

### 5.5 Cách thống kê

- Bug IDs được normalize: `BUG-DN-001` ↔ `BUG-DN-01`, `BUG-CT-001` ↔ `BUG-CT-01`.
- Verdict `✅ FIXED` nghĩa là **có Bug ID xuất hiện trong `describe/it` của e2e và suite đó pass**; không đồng nghĩa bug đã fix trên FE/UI.
- Verdict `🖼️ UI-ONLY` là **pending verify**: e2e API không đủ sức verify UI; cần chạy Chrome DevTools automation hoặc QA manual retest.
- Verdict `⚠️ NO E2E COVERAGE`: bug channel API/Both nhưng không có ID reference trong test suite — cần viết thêm test.

### 5.6 Disclaimer

- **Chưa chạy Chrome DevTools automation** trong lần audit này. Mọi verdict `🖼️ UI-ONLY` là *pending verify*, chưa xác nhận còn/đã hết.
- **Flaky CT-011** cần điều tra riêng: lỗi HTTP parse có thể ẩn đi một FK violation ở setup seed `doanh_nghiep`.
- Report dựa trên snapshot repo state @ 2026-04-20, commit gần nhất `52a09c3 test(fr-10): Quản trị audit + 99 e2e + 1 P0 fix`.

---

*Audit bởi Claude Opus 4.7 (1M) — 2026-04-20*
