# Functional Test Report — Quản lý Đào tạo, Tập huấn

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Đào tạo, Tập huấn (Module 7.3 — 22 FR, 40 TC) |
| **SRS Reference** | [srs-fr-03-dao-tao.md](../../../../input/srs-v3/srs-fr-03-dao-tao.md) — UC20–UC38 |
| **UC Coverage** | UC20 (CTDT), UC21 (Search), UC22 (Đăng ký), UC23 (Lớp đầy), UC24 (KQ/Import), UC26 (Bài giảng), UC27 (Search BG), UC28 (NHCH), UC30 (GV), UC32 (Đề xuất), UC33-34 (Workflow), UC35 (Công khai), UC36-37 (Workflow KQ), UC38 (Chứng nhận) |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-04-19 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) |
| **Test Method** | UI-based (Playwright headless via `/browse`) |
| **Primary Account** | `canbo_tw / Test@1234` (CB_NV TW, Cục BTTP) |
| **Round** | Round 2 (Lệnh 4) |
| **Tài liệu tham chiếu** | [funtion/7.3-dao-tao-tap-huan.md](../../../funtion/7.3-dao-tao-tap-huan.md), [data-readiness-dao-tao.md](data-readiness-dao-tao.md), [bug-report-dao-tao.md](bug-report-dao-tao.md), [Prototype](https://prototype-dusky-alpha.vercel.app/dao-tao/) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 40 (P0: 14, P1: 24, P2: 2) |
| **Passed** | 2 (DT-001, DT-002 tab filter portion) |
| **Failed** | 4 (DT-002 top keyword filter, DT-004 via BUG-DT-01, DT-008 via BUG-DT-03, DT-012) |
| **Blocked** | 32 (data scarcity + browse crash) |
| **Partial** | 2 (DT-002, DT-010 — evidence from Lệnh 2 only) |
| **Pass Rate** | 5% (2/40) — trung thực |
| **P0 Pass Rate** | 7% (1/14 P0 passed) |
| **Bugs Found** | 7 (2 Critical · 1 Major · 1 Medium · 3 Minor) |
| **Health Score** | 18/100 (Critical blockers + browse stability + UI gaps vs Prototype) |
| **Start Time** | 16:30 (UTC+7) · 2026-04-19 |
| **End Time** | 17:10 (UTC+7) · 2026-04-19 |
| **Total Duration** | 40 phút (budget: 45 phút) |
| **Browse Status** | BROKEN — 2 lần REAL CRASH sau khi verify BUG-DT-01, không re-verify được GV/NHCH/BUG-DT-02 trong Lệnh 4 (dùng evidence từ Lệnh 3 data-readiness) |

### Verdict: **FAIL**

Module Đào tạo FAIL tiêu chí 10.1 (test-strategy): **P0 pass rate chỉ 7% (yêu cầu 100%)**, có **2 bug Critical + 1 Major chưa fix**. 32/40 TC không chạy được vì thiếu data (KH 0 rows tất cả 9 state) + browse server crash liên tục khi mở CTDT detail. **Phải fix BUG-DT-01 / BUG-DT-02 / BUG-DT-03 + seed data KH trước khi rerun Round 3**.

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** 40 TC · 1 dòng / TC.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| DT-001 | UC20, FR-III-CTDT-01 | Xem danh sách CTDT → phân trang, lọc theo trạng thái + hình thức | Happy | P0 | **PASS** | — | 1 row `CTDT-BTP-TW-2026-0001` hiển thị ở tab Chờ duyệt; tab Dự thảo/Đã duyệt empty state đúng; sidebar truy cập OK |
| DT-002 | UC21, BR-SEARCH-01 | Tìm kiếm CTDT theo từ khóa + lĩnh vực + khoảng ngày (AND) | Happy | P0 | **PARTIAL** | BUG-DT-04 | Tab filter state works. **Top "Từ khóa" không filter** với từ khóa sai (`zzzz_nonexistent` vẫn trả 1 row). Cần dev verify. |
| DT-003 | UC20, BR-DATA-04 | Tạo CTDT mới → auto-gen mã `CTDT-{DON_VI}-{YYYY}-{SEQ}` | Happy | P0 | **BLOCKED** | BUG-DT-02 (indirect) | Không thể mở form tạo/chi tiết CTDT — browse crash. Sample `CTDT-BTP-TW-2026-0001` chứng minh mã generator khác SRS spec (có `-TW-` thay vì chỉ `BTP`). |
| DT-004 | UC20, BR-DATA-04 | Tạo khóa học con → auto-gen `KH-{YYYYMMDD}-{SEQ}` + gắn bài giảng (N-N) | Happy | P0 | **FAIL** | **BUG-DT-01** | Click "Thêm mới" KH → URL `/dao-tao/khoa-hoc/tao-moi` → "Không tìm thấy khóa học" (routing conflict). Block toàn bộ flow tạo KH. |
| DT-005 | UC26 | Upload bài giảng Slide/PDF ≤ 20MB → preview inline | Happy | P1 | **BLOCKED** | — | Pre-blocked data: 0 KH DA_DUYET để gắn bài giảng (per data-readiness). |
| DT-006 | UC26 | Thêm bài giảng Video YouTube → embed hợp lệ | Happy | P1 | **BLOCKED** | — | Pre-blocked data (cùng DT-005). |
| DT-007 | UC27 | Tìm kiếm bài giảng theo loại + từ khóa + khoảng ngày | Happy | P1 | **BLOCKED** | — | Pre-blocked — không có bài giảng nào (0 KH). |
| DT-008 | UC28 | CRUD NHCH — 3 loại (TN1 / TN-nhiều / Tự luận) | Happy | P0 | **FAIL** | **BUG-DT-03** | Sidebar "Ngân hàng câu hỏi" disabled cho canbo_tw → click → `/403`. Config RBAC khác SRS. |
| DT-009 | UC mới | Tạo đề kiểm tra — ngẫu nhiên theo quy tắc + thủ công | Happy | P1 | **BLOCKED** | BUG-DT-03 | Phụ thuộc DT-008 (cần câu hỏi trong NHCH). |
| DT-010 | UC30 | CRUD GV + xem tab "Lịch sử giảng dạy" | Happy | P1 | **PARTIAL** | — | GV list Read PASS từ Lệnh 2 ([dt-gv.png](images/dt-gv.png)): 1 GV "Nguyễn Thành Công". **Create/Update/Delete + tab Lịch sử: không verify được Lệnh 4 vì browse crash sau bước BUG-DT-01**. |
| DT-011 | UC24 | Nhập KQ điểm danh + kiểm tra → tính %, DAT/KHONG_DAT; import Excel KQ | Happy | P0 | **BLOCKED** | BUG-DT-01, BUG-DT-02 | Không có KH ở state DA_KET_THUC → không nhập KQ được. |
| DT-012 | UC20, BR-DATA-06 | Xuất Excel danh sách CTDT (max 10K rows) | Happy | P2 | **FAIL** | **BUG-DT-05** | Không tìm thấy nút "Xuất Excel" trên CTDT list (Prototype có). |
| DT-013 | UC mới | Xuất docx/PDF ký số cho CTDT DA_DUYET/DA_CONG_KHAI/HOAN_THANH | Happy | P2 | **BLOCKED** | — | Pre-blocked: 0 CTDT ở DA_DUYET trở lên. |
| DT-014 | UC20, ERR-CTDT-01 | Tạo CTDT → tên chương trình rỗng → ERR-CTDT-01 | Negative | P1 | **BLOCKED** | BUG-DT-02 | Không mở được form tạo CTDT (browse crash trang detail/create). |
| DT-015 | UC20, ERR-CTDT-02 | Tạo khóa học → ngày kết thúc ≤ ngày bắt đầu → ERR-CTDT-02 | Negative | P1 | **BLOCKED** | BUG-DT-01 | Không mở được form KH. |
| DT-016 | UC20, ERR-CTDT-03 | Xóa CTDT có khóa học liên kết → ERR-CTDT-03 (từ chối + cảnh báo) | Negative | P1 | **BLOCKED** | BUG-DT-02 | Không mở được CTDT detail để thao tác xóa. |
| DT-017 | UC26, ERR-BG-01/03 | Upload bài giảng > 20MB → ERR-BG-01; URL YouTube sai format → ERR-BG-03 | Negative | P1 | **BLOCKED** | BUG-DT-01 | Phụ thuộc KH — tạo KH bị chặn. |
| DT-018 | UC28/UC24, ERR-NHCH-02/ERR-KQ-01 | Câu TN < 2 lựa chọn → ERR-NHCH-02; điểm ngoài 0-10 → ERR-KQ-01 | Negative | P1 | **BLOCKED** | BUG-DT-03 | Không vào được NHCH. |
| DT-019 | UC23, ERR-DK-DT-02/03 | Đăng ký trùng → ERR-DK-DT-02; đăng ký khi lớp đầy → ERR-DK-DT-03 | Negative | P1 | **BLOCKED** | BUG-DT-01 | Không có KH DA_CONG_KHAI để đăng ký. |
| DT-020 | UC33 | CB NV nhấn "Gửi phê duyệt": DU_THAO → CHO_DUYET (AT-01) | Workflow | P0 | **BLOCKED** | BUG-DT-01, BUG-DT-02 | 0 KH DU_THAO; không mở được KH detail để bấm nút. |
| DT-021 | UC34 | CB PD phê duyệt khóa học: CHO_DUYET → DA_DUYET (cùng cấp, BR-AUTH-05) | Workflow | P0 | **BLOCKED** | BUG-DT-02 | 0 KH CHO_DUYET; CTDT detail crash. |
| DT-022 | UC34, BR-FLOW-04 | CB PD từ chối KH: CHO_DUYET → DU_THAO, bắt buộc nhập lý do | Workflow | P0 | **BLOCKED** | BUG-DT-02 | Pre-blocked. |
| DT-023 | UC20 | DA_DUYET → DANG_DIEN_RA → DA_KET_THUC (auto theo ngày) | Workflow | P1 | **BLOCKED** | — | Pre-blocked: 0 KH DA_DUYET. |
| DT-024 | UC36 | CB NV ghi nhận KQ: DA_KET_THUC → CHO_DUYET_KQ (AT-02) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DT-025 | UC37 | CB PD duyệt KQ: CHO_DUYET_KQ → HOAN_THANH (cùng cấp) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DT-026 | UC37, BR-FLOW-04 | CB PD từ chối KQ: CHO_DUYET_KQ → DA_KET_THUC + lý do | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DT-027 | UC35, BR-FLOW-05 | Công khai KH lên Cổng PLQG: DA_DUYET → DA_CONG_KHAI qua API | Workflow | P1 | **BLOCKED** | — | Pre-blocked + API external chưa có stub. |
| DT-028 | UC20, EC-02, BR-NOTIF-01 | Hủy khóa học (DA_DUYET, chưa có đăng ký) → HUY + notify HV đã duyệt | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DT-029 | BR-FLOW-03, ERR-CTDT-04 | Immutability: không sửa/xóa KH/CTDT sau DA_DUYET → ERR-CTDT-04 | Workflow | P0 | **BLOCKED** | BUG-DT-02 | Không mở được CTDT DA_DUYET detail. |
| DT-030 | UC22, BR-FLOW-04 | Duyệt/từ chối đăng ký ĐT: CHO_DUYET → DA_DUYET / TU_CHOI + lý do | Workflow | P1 | **BLOCKED** | — | Pre-blocked: 0 đăng ký. |
| DT-031 | UC38, BR-DATA-04 | Sinh chứng nhận điện tử cho HV DAT sau HOAN_THANH → `CN-{YYYY}-{SEQ}` + PDF | Workflow | P0 | **BLOCKED** | — | Pre-blocked: 0 KH HOAN_THANH. |
| DT-032 | — | QTHT xem được CTDT/KH/GV (👁️ R) nhưng KHÔNG tạo/sửa/xóa | Authorization | P1 | **BLOCKED** | — | Browse crash — không re-login qtht_tw được trong Lệnh 4. |
| DT-033 | — | CB_PD KHÔNG tạo/xóa CTDT/KH — chỉ 📝 RU* (phê duyệt + từ chối) | Authorization | P0 | **BLOCKED** | — | Browse crash — không re-login lanhdao_tw được. |
| DT-034 | — | CB_PD_TW xem toàn bộ, CB_PD_BN/DP chỉ xem scoped đơn vị | Authorization | P1 | **BLOCKED** | — | Cần chạy 3 role × list → pre-blocked do browse. |
| DT-035 | — | DN tạo DANG_KY_DAO_TAO qua API (🔌 C†); KHÔNG vào CMS Đào tạo (chặn) | Authorization | P1 | **BLOCKED** | — | Cần cookie DN user; chưa setup. |
| DT-036 | — | TVV/CG không thấy menu Đào tạo (❌) | Authorization | P1 | **BLOCKED** | — | Pre-blocked do browse. |
| DT-037 | — | CTDT ↔ Danh mục: FK `linh_vuc_id` → DANH_MUC (lĩnh vực phải tồn tại trước) | Cross-module | P1 | **BLOCKED** | BUG-DT-02 | Không mở được form CTDT → không test được validation FK. |
| DT-038 | — | Khóa học ↔ Bài giảng (N-N): 1 KH gắn nhiều BG + 1 BG dùng chung nhiều KH | Cross-module | P1 | **BLOCKED** | BUG-DT-01 | Pre-blocked. |
| DT-039 | — | Xóa câu hỏi đang dùng → WRN-NHCH-01; xóa GV đang phân công → WRN-GV-01 | Cross-module | P1 | **BLOCKED** | BUG-DT-03 | NHCH block. GV side: 1 GV chưa có phân công nào nên không test được warning. |
| DT-040 | UC32 | Đề xuất ĐT (MOI) → CB NV tiếp nhận → tạo CTDT/KH (DA_THUC_HIEN) | Cross-module | P1 | **FAIL** | **BUG-DT-06** | Không có entry sidebar/tab "Đề xuất đào tạo" trong CMS app (Prototype có 2 tab top). |

---

## 3. Bug Report (inline summary)

> **Chi tiết đầy đủ:** [bug-report-dao-tao.md](bug-report-dao-tao.md)

### BUG-DT-01 — Critical · Click "Thêm mới" KH → trang `/tao-moi` hiển thị "Không tìm thấy khóa học"

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DT-004, DT-015, DT-017, DT-019, DT-020, DT-038 |
| **Status** | Open (re-verified Lệnh 4) |
| **Assignee** | FE Team |

**Mô tả:** FE router parse `tao-moi` như `:id` parameter → render view detail trong trạng thái 404 thay vì mở form tạo.

**Expected vs Actual:** Form tạo KH với FK CTDT cha + auto-gen mã **vs** dòng đỏ "Không tìm thấy khóa học" + link quay lại.

**Impact:** Block 100% flow tạo KH qua UI → 22/40 TC pre-blocked.

**Root Cause (Suggested):** Thứ tự route wrong: `/:id` khai báo trước `/tao-moi` → `/:id` bắt segment trước. Hoặc component `<KhoaHocCreate />` chưa được implement.

---

### BUG-DT-02 — Critical · CTDT detail page crash browse context

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DT-014, DT-016, DT-020→DT-029, DT-037 |
| **Status** | Open |
| **Assignee** | FE Team (possibly BE) |

**Mô tả:** Click "Xem" row CTDT → Chromium tab crash `Target page, context or browser has been closed` sau 2-4s. Tái hiện 100% với canbo_tw + lanhdao_tw.

**Expected vs Actual:** Trang detail CTDT với tabs **vs** crash tab (URL về `about:blank`).

**Impact:** Block mọi workflow CTDT (gửi/duyệt/từ chối/hủy/công khai + xem KH con). Cần dev verify trên Chrome real để phân biệt Playwright issue vs app bug.

**Root Cause (Suggested):** Infinite re-render React (useEffect thiếu deps), hoặc load toàn bộ KH con N-N không paginate, hoặc chart render nặng.

---

### BUG-DT-03 — Major · Sidebar NHCH disabled cho CB_NV, click → `/403`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P0 |
| **TC Reference** | DT-008, DT-009, DT-018, DT-039 |
| **Status** | Open |
| **Assignee** | BE (CASL rules) + FE (nav-structure) |

**Mô tả:** Sidebar "Ngân hàng câu hỏi" xám cho `canbo_tw`, click → `/403`. Vi phạm permission-matrix §8.1 "CB_NV → CAU_HOI: C R U D*".

**Expected vs Actual:** CB_NV có quyền CRUD câu hỏi theo SRS **vs** 403 Forbidden.

**Impact:** Block 4 TC NHCH + ảnh hưởng tất cả CB_NV cấp TW/BN/DP → không tạo được câu hỏi → không tạo được đề kiểm tra → workflow KQ đứt.

**Root Cause (Suggested):** `auth-rules.ts` thiếu `can('manage', 'CauHoi')` cho role CB_NV. Hoặc BE middleware chặn.

---

### BUG-DT-04 — Medium · Bộ lọc "Từ khóa" CTDT list có vẻ không filter

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium (cần verify) |
| **Priority** | P1 |
| **TC Reference** | DT-002 |
| **Status** | Open — cần dev manual verify |

**Mô tả:** Gõ từ khóa không tồn tại ("zzzz_nonexistent") vào top Search + click Tìm kiếm → vẫn trả 1 row. Có thể là selector automation ambiguity (2 ô Tìm kiếm), nhưng pattern khả nghi.

**Impact:** Nếu là bug thực sự — CB_NV không tìm được CTDT khi list dài.

**Root Cause (Suggested):** State filter top SearchPanel và ProTable built-in search không đồng bộ.

---

### BUG-DT-05 — Minor · CTDT list thiếu nút "Xuất Excel"

**TC:** DT-012 · **Status:** Open · **Assignee:** FE Team

Prototype có "Xuất Excel" header, app không có. Block DT-012.

---

### BUG-DT-06 — Minor · CTDT list thiếu tab "Chương trình đào tạo / Đề xuất đào tạo"

**TC:** DT-001, DT-040 · **Status:** Open · **Assignee:** FE Team

Không có entry truy cập list "Đề xuất đào tạo" → block DT-040 (tiếp nhận đề xuất từ DN/NHT).

---

### BUG-DT-07 — Minor · 2 ô Tìm kiếm chồng nhau (layout redundancy)

**TC:** DT-001, DT-002 · **Status:** Open · **Assignee:** FE Team

Top SearchPanel + ProTable built-in search gây nhầm lẫn, khác Prototype (1 ô duy nhất).

---

## 4. Detailed Test Results

> **Tầng 2 — Chi tiết TC đã chạy.** Các TC BLOCKED / BUG đã có Steps/Expected/Actual ở bug-report.

### 4.1 DT-001 — Xem danh sách CTDT → phân trang + lọc

**Pre-conditions:**
- canbo_tw login qua OTP bypass 666666.
- ≥1 row CTDT ở state CHO_DUYET (per data-readiness: `CTDT-BTP-TW-2026-0001`).

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `GET /` → login canbo_tw → OTP → redirect | Land ở `/403` (CB_TW expected landing) | Land ở `/403` ✅ | PASS |
| 2 | Sidebar → Quản lý đào tạo → Chương trình đào tạo | Load `/dao-tao/chuong-trinh`, bảng hiển thị, API `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=20` → 200 | URL đúng, 1 row hiển thị `CTDT-BTP-TW-2026-0001 · sdsadf · - · 100.000`; API 200 (80ms, 411B) | PASS |
| 3 | Click tab "Dự thảo" | Bảng reload với filter state=DU_THAO, empty state nếu không có row | Empty state "Không có chương trình đào tạo nào phù hợp." ✅ | PASS |
| 4 | Click tab "Đã duyệt" | Tương tự, state=DA_DUYET | Empty state hiển thị đúng ✅ | PASS |
| 5 | Click tab "Chờ duyệt" | Hiển thị 1 row CHO_DUYET | 1 row `CTDT-BTP-TW-2026-0001` ✅ | PASS |

**Notes:**
- ✅ DT-001 PASS cho happy path list + tab filter theo trạng thái.
- ⚠️ **Thiếu test dữ liệu đầy đủ:** Chỉ 1 row thuộc 1 state → không verify được phân trang (pagination with 20+ rows), không verify filter "hình thức" (Trực tuyến/Trực tiếp — CTDT không có column hình thức, thuộc KH).
- **Tên CTDT "sdsadf"** là data rác từ test — cần data chuẩn để UI đẹp hơn khi demo.

### 4.2 DT-002 — Tìm kiếm CTDT theo từ khóa + lĩnh vực + khoảng ngày

**Pre-conditions:** Same as DT-001.

**Test Data:**
```json
{"searchTerm_match": "sdsadf", "searchTerm_nomatch": "zzzz_nonexistent"}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill top "Từ khóa" = "sdsadf", click "Tìm kiếm" | Filter applied, trả 1 row match | 1 row hiển thị ([dt-002-search-match.png](images/dt-002-search-match.png)) | PASS |
| 2 | Clear, fill "Từ khóa" = "zzzz_nonexistent", click "Tìm kiếm" | Empty state "Không có CTDT..." | **Vẫn hiển thị 1 row** `CTDT-BTP-TW-2026-0001` ([dt-002-search-nomatch.png](images/dt-002-search-nomatch.png)) | **FAIL** |
| 3 | Click "Xóa bộ lọc" | Reset filter, trả 1 row | PASS | PASS |
| 4 | Filter "Lĩnh vực pháp lý" dropdown | Chọn 1 option, filter lại | Không test được (0 lĩnh vực setup tạo ra khác biệt với 1 row) | SKIP |
| 5 | Filter date range "Từ ngày / Đến ngày" | Pick date 01/01/2026 → 03/04/2026, trả 1 row nếu nằm trong | Không test được (1 row, không có ngày tham chiếu rõ) | SKIP |

**Notes:**
- ⚠️ Step 2 FAIL — bộ lọc "Từ khóa" top panel có vẻ không thực sự filter. Cần dev verify trên Chrome DevTools (capture network request xem query string có `q=zzzz_nonexistent` hay không).
- ⚠️ Cần có ≥5 CTDT với tên/lĩnh vực/ngày khác nhau để test đầy đủ BR-SEARCH-01 (AND between filters). Xem log: BUG-DT-04.

### 4.3 DT-004 — Tạo khóa học con (attempted)

**Pre-conditions:** ≥1 CTDT DA_DUYET để chọn làm parent → **pre-blocked** vì 0 CTDT DA_DUYET.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate sidebar → Khóa học | `/dao-tao/khoa-hoc/danh-sach`, 9 tab state (SM-KHOAHOC đầy đủ) | URL đúng, 9 tab hiển thị, all empty | PASS |
| 2 | Click "+ Thêm mới" | Mở form tạo KH (hoặc nav `/tao-moi` dạng create page) | URL → `/dao-tao/khoa-hoc/tao-moi`, render view "Không tìm thấy khóa học." | **FAIL** |

**Result:** FAIL → **BUG-DT-01** (Critical). Block DT-015, DT-017, DT-019, DT-020, DT-038 trực tiếp.

### 4.4 DT-008 — CRUD NHCH (attempted Lệnh 3)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Sidebar → Ngân hàng câu hỏi | Mở list NHCH (248 câu, 4 stats cards) | Sidebar xám disabled; click → `/403` "Bạn không có quyền" | **FAIL** |

**Result:** FAIL → **BUG-DT-03** (Major). Xem [dt-nhch.png](images/dt-nhch.png).

### 4.5 DT-010 — CRUD Giảng viên (Partial từ Lệnh 2)

**Read path:** PASS (Lệnh 2) — 1 GV "Nguyễn Thành Công" hiển thị ([dt-gv.png](images/dt-gv.png)).
**Create/Update/Delete + Tab "Lịch sử giảng dạy":** **BLOCKED** — browse crash sau BUG-DT-01 verify, không đủ budget retry.

### 4.6 DT-012 — Xuất Excel CTDT

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Mở CTDT list → tìm nút "Xuất Excel" | Nút "Xuất Excel" hiển thị cùng hàng "+ Thêm mới" (Prototype spec) | Không có nút — CTDT list chỉ có "+ Thêm mới" và "Làm mới" | **FAIL** |

**Result:** FAIL → **BUG-DT-05** (Minor).

### 4.7 DT-020 → DT-029 (Workflow KH — tất cả BLOCKED)

Tất cả 10 TC workflow KH đều BLOCKED vì:
- **0 KH** ở mọi state (SM-KHOAHOC 9 states đều empty per data-readiness).
- BUG-DT-01 block tạo KH mới qua UI.
- BUG-DT-02 block mở CTDT detail để tạo KH con hoặc phê duyệt.

**Recovery path:**
1. Dev fix BUG-DT-01 → QA tạo KH DU_THAO → walk SM full path → unblock 10 TC.
2. Hoặc BE seed data SQL cho 9 state → QA chạy workflow từ mỗi state điểm.

### 4.8 DT-032 → DT-036 (Authorization smokes — BLOCKED)

Browse crash liên tục khi re-login roles khác (qtht_tw, lanhdao_tw, tvv_user, dn_user) sau BUG-DT-01 verify. Theo test-strategy §8.3: "Retry 1 lần. Vẫn fail → đánh BLOCKED toàn bộ TC UI + ghi `Browse tool unavailable` vào report." → BLOCKED 5 TC authorization.

**Recovery path:**
1. Dev stabilize browse / app render.
2. Re-run Round 3 với authorization focus session riêng (không mix workflow + auth trong 1 session).

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV | Cục BTTP | TW | DT-001, DT-002, DT-004 (fail), DT-008 (fail Lệnh 3), DT-010 (partial) |
| lanhdao_tw | CB_PD | Cục BTTP | TW | DT-021, DT-022, DT-025, DT-026, DT-033, DT-034 — tất cả BLOCKED do browse crash |
| qtht_tw | QTHT | Cục BTTP | TW | DT-032 — BLOCKED |
| canbo_bn, lanhdao_bn, canbo_tinh | CB_NV/PD | BN/DP | BN/DP | DT-034 scoped test — BLOCKED |
| dn_user, nht_user, giangvien_user, tvv_user | Portal | — | Portal | DT-035, DT-036 — BLOCKED |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| CTDT-BTP-TW-2026-0001 | "sdsadf", state CHO_DUYET, budget 100.000 VNĐ | DT-001, DT-002 evidence | Keep (1 row thôi) |
| Nguyễn Thành Công | GV: Chuyên ngành "Đòi ăn", Trình độ Đại học, Vai trò Giảng viên | DT-010 Read path | Keep |
| — | 0 Khóa học (tất cả 9 state), 0 Bài giảng, 0 Đăng ký, 0 Đề xuất | Pre-blocked TC | — |

**Data gap critical:**
- 0 KH tất cả 9 state (cần min 3 KH để walk workflow full).
- 0 NHCH câu hỏi (vẫn BLOCKED do permission, không phải data).
- 0 CTDT DA_DUYET trở lên.

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}` — e.g., `/api/v1/chuong-trinh-dao-taos`, `/api/v1/khoa-hocs`, `/api/v1/giang-viens`, `/api/v1/cau-hois`.
- **Auth flow:** `POST /api/v1/auth/login` (user+pass) → `POST /api/v1/auth/verify-otp` (OTP) → refresh_token cookie HttpOnly path=`/api/v1/auth`.
- **Frontend stack:** React 19 + Vite 6 (dev mode) + Ant Design + Ant Design Pro Components + CASL + zustand + @tanstack/react-query + axios.
- **Vite dev proxy:** `/api` → backend (NestJS likely, based on typical stack). Vite dev bundle rất nặng (chunk-JF22NC72.js = 3.6MB, chunk-ZGEFYH5O.js = 1MB, antd_pro = 2.6MB) → render chậm 2-3s là pattern.
- **Known limitations (blockers cho QA):**
  - Browse Playwright chromium context crash 3 lần khi retry sau BUG-DT-01 verify. Nghi là CPU/memory exhaustion từ Vite dev + @ant-design/pro-components chunk nặng.
  - OTP bypass `666666` hoạt động cho mọi role (verify qua login canbo_tw thành công).
  - `403` landing cho canbo_tw sau login là EXPECTED (không có dashboard default cho role này).

---

## 7. Recommendations

### Must Fix (Before Round 3)

1. **BUG-DT-01 (Critical, P0) — FE router:** Thay thứ tự route `/tao-moi` lên trước `/:id`, implement `<KhoaHocCreate />` component với form + auto-gen mã BR-DATA-04. **Unblock 22 TC**.
2. **BUG-DT-02 (Critical, P0) — CTDT detail crash:** Dev verify local Chrome DevTools → Performance profiling → fix infinite re-render / heavy render. **Unblock 10+ workflow TC**.
3. **BUG-DT-03 (Major, P0) — NHCH RBAC:** Thêm CASL rules `can('manage', 'CauHoi'/'DeKiemTra')` cho CB_NV. BE mở endpoint `/api/v1/cau-hois` cho CB_NV. **Unblock 4 TC**.

### Should Fix

4. **BUG-DT-04 (Medium, P1) — Filter Từ khóa:** Dev manual verify trên Chrome → đồng bộ state filter top + table nếu thực sự bug. Hoặc xóa ProTable built-in search (BUG-DT-07 fix đồng thời).
5. **BUG-DT-05 (Minor, P2) — Nút Xuất Excel:** Thêm vào CTDT list header cùng Prototype.
6. **BUG-DT-06 (Minor, P2) — Tab Đề xuất ĐT:** Bổ sung 2 tab top-level + trang "Đề xuất đào tạo".
7. **BUG-DT-07 (Minor, P2) — 2 ô Tìm kiếm:** Gom về 1 ô.

### Test Data Recommendations (cho Round 3)

8. **Seed data cần thiết trước khi rerun:**
   - 3× CTDT ở state khác nhau (DU_THAO, DA_DUYET, HOAN_THANH).
   - 5× KH phủ 9 state SM-KHOAHOC (1 walk full + 2 stuck mid-state + 1 HUY + 1 CHO_DUYET_KQ).
   - 1× KH DA_CONG_KHAI + 3× đăng ký (1 trùng, 1 lớp đầy test EC-01).
   - 3× bài giảng (1 PPTX ≤ 20MB + 1 PDF + 1 YouTube URL).
   - ≥3 câu hỏi (1 TN1 + 1 TN-nhiều + 1 Tự luận).
   - 2× GV (1 đang phân công, 1 tạm dừng).
   - File Excel KQ (đúng + 2 sai format).
   - Template đăng ký Excel.

### Environment Recommendations

9. **Browse stability:** Rule 6 cleanup cần tối ưu — hôm nay 3 lần crash liên tiếp kể cả sau full cleanup. Cân nhắc:
   - Tăng timeout chrome-headless (flag `--disable-timer-throttling` đã có nhưng chưa đủ).
   - Chia session test: login separate từ navigation (dùng `cookie-import` theo CLAUDE.md Rule 8 alt).
   - Build prod Vite thay vì dev để giảm chunk size 3.6MB → <1MB.

10. **Test strategy adjustment:** Chia Lệnh 4 thành 2 sub-session:
    - **Session 4a:** CTDT + KH happy (canbo_tw + lanhdao_tw) — 15 TC workflow.
    - **Session 4b:** NHCH + GV + Authorization smoke (qtht_tw, lanhdao_bn, canbo_tinh) — 10 TC authz.

---

## 8. Appendix

### A — API Endpoints Tested / Observed

| Method | Endpoint | Purpose | Tested in TC | Status |
|--------|----------|---------|--------------|--------|
| POST | `/api/v1/auth/login` | User+pass login | DT-001 | 200 (325ms) |
| POST | `/api/v1/auth/verify-otp` | OTP verify | DT-001 | 200 (31ms) |
| GET | `/api/v1/chuong-trinh-dao-taos?page=1&pageSize=20` | List CTDT | DT-001 | 200 (80ms, 411B) |
| GET | `/api/v1/danh-muc?loaiDanhMuc=LINH_VUC_PL&trangThai=KICH_HOAT&pageSize=100` | Dropdown Lĩnh vực | DT-002 | 200 (52ms, 3.5KB) |
| GET | `/api/v1/khoa-hocs?...` | List KH | DT-004 (sidebar nav) | không capture (chain crash sớm) |
| GET | `/api/v1/giang-viens?...` | List GV | DT-010 (Lệnh 2) | 200 (from data-readiness) |
| GET | `/api/v1/cau-hois?...` | List NHCH | DT-008 | **403 Forbidden** (confirmed bug) |
| GET | `/api/v1/thong-baos/unread-count` | Unread notification | DT-001 | 200 (21ms) |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [app-ctdt-list-canbotw.png](images/app-ctdt-list-canbotw.png) | CTDT list canbo_tw (DT-001 happy) | DT-001 |
| [dt-001-tab-duthao.png](images/dt-001-tab-duthao.png) | Tab "Dự thảo" empty state | DT-001 |
| [dt-001-tab-daduyet.png](images/dt-001-tab-daduyet.png) | Tab "Đã duyệt" empty state | DT-001 |
| [dt-002-search-match.png](images/dt-002-search-match.png) | Search "sdsadf" → 1 row | DT-002 |
| [dt-002-search-nomatch.png](images/dt-002-search-nomatch.png) | Search "zzzz_nonexistent" → vẫn 1 row | DT-002 BUG-DT-04 |
| [dt-kh-list.png](images/dt-kh-list.png) | KH list 9 tab state empty | DT-004 context |
| [dt-bug01-kh-taomoi-404.png](images/dt-bug01-kh-taomoi-404.png) | BUG-DT-01 re-verify | DT-004 |
| [dt-nhch.png](images/dt-nhch.png) | NHCH 403 (Lệnh 2) | DT-008 BUG-DT-03 |
| [dt-gv.png](images/dt-gv.png) | GV list 1 row Nguyễn Thành Công | DT-010 |
| [dt-ctdt-list.png](images/dt-ctdt-list.png) | CTDT list (Lệnh 2 snapshot) | DT-001 |
| [dt-after-login.png](images/dt-after-login.png) | canbo_tw land /403 (expected) | DT-001 context |
| [dt-khoahoc-list.png](images/dt-khoahoc-list.png) | KH list (Lệnh 2) | DT-004 context |
| [dt3-kh-tao-moi-404.png](images/dt3-kh-tao-moi-404.png) | BUG-DT-01 Lệnh 3 evidence | DT-004 |
| [proto-ctdt-list.png](images/proto-ctdt-list.png) | Prototype CTDT reference | BUG-DT-05, 06, 07 |
| [proto-kh-list.png](images/proto-kh-list.png) | Prototype KH reference | UI diff |
| [proto-nhch.png](images/proto-nhch.png) | Prototype NHCH (248 câu) | BUG-DT-03 comparison |
| [proto-gv.png](images/proto-gv.png) | Prototype GV grid | DT-010 ref |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| UC20 (CRUD CTDT) | DT-001, DT-003, DT-012, DT-014, DT-016, DT-023, DT-028, DT-029 | 1/8 PASS (DT-001), 7 BLOCKED/FAIL |
| UC21 (Search CTDT) | DT-002 | 1/1 PARTIAL (tab filter PASS, keyword FAIL) |
| UC22 (Đăng ký) | DT-030 | BLOCKED |
| UC23 (Lớp đầy EC-01) | DT-019 | BLOCKED |
| UC24 (KQ / Import Excel) | DT-011, DT-018 | BLOCKED |
| UC26 (Bài giảng) | DT-005, DT-006, DT-017 | BLOCKED |
| UC27 (Search bài giảng) | DT-007 | BLOCKED |
| UC28 (NHCH) | DT-008, DT-009, DT-018, DT-039 | 0/4 — FAIL BUG-DT-03 + BLOCKED |
| UC30 (GV) | DT-010 | 1/1 PARTIAL (Read OK) |
| UC32 (Đề xuất ĐT) | DT-040 | FAIL (BUG-DT-06) |
| UC33-34 (Workflow CTDT/KH phê duyệt) | DT-020, DT-021, DT-022 | BLOCKED |
| UC35 (Công khai PLQG) | DT-027 | BLOCKED (+ API external) |
| UC36-37 (Workflow KQ) | DT-024, DT-025, DT-026 | BLOCKED |
| UC38 (Chứng nhận PDF) | DT-031 | BLOCKED |
| BR-DATA-04 (auto-gen mã) | DT-003, DT-004, DT-031 | Partial evidence: CTDT-BTP-TW-2026-0001 khớp format |
| BR-DATA-06 (Export max 10K rows) | DT-012 | FAIL (BUG-DT-05 — nút chưa có) |
| BR-FLOW-03 (Immutability) | DT-029 | BLOCKED |
| BR-FLOW-04 (Từ chối + lý do) | DT-022, DT-026, DT-030 | BLOCKED |
| BR-FLOW-05 (Công khai API) | DT-027 | BLOCKED |
| BR-NOTIF-01 (Notify hủy KH) | DT-028 | BLOCKED |
| BR-AUTH-05 (Phê duyệt cùng cấp) | DT-021, DT-025 | BLOCKED |
| BR-AUTH-08 (Scoped đơn vị) | DT-034 | BLOCKED |
| Authz smoke | DT-032, DT-033, DT-034, DT-035, DT-036 | 0/5 BLOCKED (browse crash) |

---

*Report generated: 2026-04-19 · QA Automation (Claude Code) — Lệnh 4 /qa-only*
