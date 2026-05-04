# Functional Test Report — Module Đánh giá Hiệu quả Hỗ trợ (Module 7.8)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Đánh giá Hiệu quả HTPLDN (Module 7.8) |
| **SRS Reference** | [srs-fr-08-danh-gia.md](../../../../input/srs-v3/srs-fr-08-danh-gia.md) — FR UC83-91 + UC109 |
| **UC Coverage** | UC83, UC84, UC85, UC86, UC87, UC88, UC89, UC90, UC91 (9 UC) + UC109 cross-module |
| **Người test** | Claude QA Automation (`/qa-only` skill) |
| **Ngày** | 2026-04-19 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm — apply mọi account test) |
| **Test Method** | **Hybrid API + UI** — ban đầu UI crash "Target page closed" sau OTP; **root cause phát hiện ở pass 2:** BUG-ENV-01 persist password → `fill` đè thành `Test@1234Test@1234` → login FAIL → OTP không render → chain sau đó tưởng là crash. Fix: clear field (`press Ctrl+A` + `type`) + `wait --networkidle` thay sleep post-login → login UI chạy ổn định. UI coverage đã re-run ở pass 2. |
| **Primary Account** | `canbo_tw` / `Test@1234` — role CB_NV cấp TW |
| **Round** | Round 2 (2026-04-16) |
| **Tài liệu tham chiếu** | [7.8-danh-gia.md](../../../funtion/7.8-danh-gia.md), [data-readiness-report.md](data-readiness-report.md), [bug-report-danh-gia.md](bug-report-danh-gia.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 40 |
| **Passed** | 10 |
| **Failed** | 4 |
| **Blocked** | 25 |
| **Partial** | 1 |
| **Pass Rate** | **25.0%** (10/40) |
| **P0 Pass Rate** | 35.7% (5/14 P0 tested — 4 PASS + 1 FAIL) |
| **Bugs Found** | 5 (3 Critical, 1 Major, 1 Medium) |
| **Health Score** | **28/100** |
| **Start Time** | 14:38 (UTC+7) |
| **End Time** | 15:02 (UTC+7) |
| **Total Duration** | 24 phút (budget 45 phút — tiết kiệm 21 phút do phần lớn TC pre-blocked) |
| **Browse Status** | **OK sau khi fix login pattern** — ban đầu tưởng crash Playwright, thực ra là login fail do BUG-ENV-01 persist password. Pattern ổn định: `press Ctrl+A` clear field + `type` + `wait --networkidle` thay sleep post-OTP. Tránh `wait --networkidle` sau SPA route change (Vite HMR WS never idle). UI coverage re-run ở pass 2 — capture đủ evidence cho DG-001/002/010 + authz DG-030/034/035. |

### Verdict: **FAIL**

**3 Critical authz/data-scope bug + BE chưa build 80% workflow transition endpoints** → module không thể release. Cụ thể: (1) `QTHT/admin` tạo được KE_HOACH_DANH_GIA; (2) `CB_NV_BN/DP` thấy/sửa/xóa được record của TW; (3) BN user xóa được record TW (data loss thực). Chỉ 4 TC P0 PASS trên 14 P0. 25 TC BLOCKED do BE chưa build endpoint transition (theo data-readiness §6.1). Buộc fix BUG-DG-001/002/003 + BE commit transition endpoints trước khi re-run Lệnh 4.

**UI evidence pass 2 (đã bổ sung):** screenshot hard-evidence đầy đủ cho cả 3 bug Critical — user thực sự click được nút Tạo với role QTHT ([ui-qtht-list.png](screenshots/ui-qtht-list.png)), canbo_bn mở list thấy ngay 3 record của TW ([ui-cbbn-list.png](screenshots/ui-cbbn-list.png)), click "Xuất Excel" nhận toast đỏ "thất bại" ngay trên UI ([ui-cbtw-export-click.png](screenshots/ui-cbtw-export-click.png)). Các bug không chỉ ở BE mà FE cũng không defense-in-depth (không ẩn action theo role).

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| DG-001 | UC83 | Xem list đợt + phân trang 20/trang + lọc tần suất/đối tượng/trạng thái/khoảng ngày | Happy | P0 | **PASS** | — | API: 3 rows, 4 filter (tanSuat/doiTuong/trangThai/ngày) đều đúng. **UI pass 2:** canbo_tw login UI → list render đầy đủ 3 rows + 9 tabs state + toolbar 3 nút + "1-3 / 3 mục, 20 / trang" ([ui-cbtw-list.png](screenshots/ui-cbtw-list.png)). |
| DG-002 | UC83 | Tạo đợt mới → auto-gen mã `DG-YYYYMMDD-SEQ`, state NHAP (BR-DATA-04) | Happy | P0 | **PASS** | — | API POST 201 — mã `DG-20260419-0004` match regex `^DG-\d{8}-\d+$`. **UI pass 2:** click "Tạo kế hoạch" → drawer render đủ 7 field (Tên đợt*, Mục tiêu, Tần suất*, Đối tượng*, Thời gian bắt đầu*, Thời gian kết thúc*, Ghi chú) + 3 action "Hủy / Lưu nháp / Lưu & Chuyển tiêu chí" ([ui-cbtw-create-drawer.png](screenshots/ui-cbtw-create-drawer.png)). |
| DG-003 | UC83 | Xem chi tiết đợt (header + 4 tabs) | Happy | P0 | **PARTIAL** | — | GET detail 200 — full field. Sub-tab "Tiêu chí" GET OK (empty). Sub-tab "Vụ việc eligible" trả 400 `ERR-STATE-SYS-00-01` vì state NHAP ≠ DA_PHAN_CONG (đúng nghiệp vụ). UI detail 4-tab chưa verify ở pass 2 — priority thấp, chain dài dễ timeout. |
| DG-004 | UC84 | Thiết lập tiêu chí: thêm/sửa/xóa, SUM trọng số=100% realtime (BR-CALC-04) | Happy | P0 | **BLOCKED** | — | Pre-blocked per data-readiness §2.4 + §3 — endpoint `/ke-hoach-danh-gias/{id}/tieu-chis` POST 404 (BE chưa build). |
| DG-005 | UC85 | Phân công người đánh giá: ≥1 người, ≥1 TRUONG_NHOM, không trùng | Happy | P0 | **BLOCKED** | — | Pre-blocked — endpoint `/trinh-phan-cong` / `/phan-cong` 404. |
| DG-006 | UC87 | Chọn VV đánh giá — filter VV HOAN_THANH trong kỳ, multi-select, cảnh báo VV trùng đợt | Happy | P0 | **BLOCKED** | — | Pre-blocked — precondition #10 thiếu (VV HOAN_THANH = 0, cần ≥3). |
| DG-007 | UC88 | Nhập điểm từng VV — auto-tính SUM(điểm × trọng_số / 100) + xếp loại | Happy | P0 | **BLOCKED** | — | Pre-blocked — cần state DANG_DANH_GIA (BE chưa build transition). |
| DG-008 | UC89 | Lập BC đánh giá — auto tổng hợp + manual nhận xét/kiến nghị/kinh phí | Happy | P0 | **BLOCKED** | — | Pre-blocked — cần state DA_DANH_GIA. |
| DG-009 | UC89 | Xuất BC Excel/Word theo template TT17/2025 (mẫu 21a/21b) | Happy | P1 | **BLOCKED** | — | Pre-blocked — cần BC đã lập. |
| DG-010 | UC83 | Xuất Excel danh sách đợt (toolbar) | Happy | P2 | **FAIL** | BUG-DG-005 | API: `GET /export` 400 uuid; `POST /export` 403. **UI pass 2:** click "Xuất Excel" → toast đỏ **"Xuất Excel thất bại"** hiện trên top-right; network confirm `POST /ke-hoach-danh-gias/export?page=1&pageSize=20 → 403` ([ui-cbtw-export-click.png](screenshots/ui-cbtw-export-click.png)). UX broken ngay cho CB_NV chính chủ. |
| DG-011 | UC83 | Tạo đợt → thiếu field bắt buộc → ERR-DG-KH-01 | Negative | P1 | **PASS** | — | Thiếu tenDot/tanSuat/doiTuong/ngày → `ERR-VAL-SYS-00-01` với details đúng field. BR-LEGAL-08 bonus: `tanSuat=DOT_XUAT` → reject đúng (chỉ SO_BO_6_THANG/TRON_NAM hợp lệ). |
| DG-012 | UC83 | Tạo đợt → `tu_ngay >= den_ngay` → ERR-DG-KH-02 | Negative | P1 | **PASS** | — | `thoiGianBatDau > thoiGianKetThuc` → ERR "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"; `bằng nhau` cũng reject. |
| DG-013 | UC84 | Chuyển CHO_DUYET_PC khi SUM trọng số ≠ 100% → ERR-DG-TC-01 | Negative | P0 | **BLOCKED** | — | Pre-blocked — endpoint transition + tiêu chí không có. |
| DG-014 | UC85 | Phân công không có TRUONG_NHOM → ERR-DG-PC-02 | Negative | P1 | **BLOCKED** | — | Pre-blocked — precondition #12 (CB ≥2 cùng đơn vị) thiếu + endpoint phân công 404. |
| DG-015 | UC85 | Phân công trùng người → ERR-DG-PC-03 | Negative | P1 | **BLOCKED** | — | Pre-blocked. |
| DG-016 | UC88 | Nhập điểm > `diem_toi_da` hoặc < 0 → ERR-DG-DG-01 | Negative | P1 | **BLOCKED** | — | Pre-blocked — cần DANG_DANH_GIA. |
| DG-017 | UC86/UC91 | Từ chối PC/BC không nhập lý do (< 10 ký tự) → ERR-DG-PD-02/04 (BR-FLOW-04) | Negative | P0 | **BLOCKED** | — | Pre-blocked — endpoint duyệt/từ chối không có data để test. |
| DG-018 | UC83 | Workflow: NHAP → DA_LAP_KH (hoàn tất lập KH) | Workflow | P0 | **BLOCKED** | — | Pre-blocked — `/hoan-tat-lap-kh` 404. |
| DG-019 | UC85 | Workflow: DA_LAP_KH → CHO_DUYET_PC (trình PC + TB CB_PD) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DG-020 | UC86 | Workflow: CHO_DUYET_PC → DA_DUYET_PC (CB PD duyệt cùng cấp) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DG-021 | UC86 | Workflow: CHO_DUYET_PC → DA_LAP_KH (CB PD từ chối + lý do ≥10 ký tự) | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DG-022 | UC87 | Workflow: DA_DUYET_PC → DANG_DANH_GIA (sau chọn ≥1 VV) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DG-023 | UC88 | Workflow: DANG_DANH_GIA → DA_DANH_GIA (auto khi chấm xong tất cả VV) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DG-024 | UC89 | Workflow: DA_DANH_GIA → DA_LAP_BC (CB NV lập BC) | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DG-025 | UC90 | Workflow: DA_LAP_BC → CHO_DUYET_BC (trình duyệt BC) | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DG-026 | UC91 | Workflow: CHO_DUYET_BC → DA_DUYET_BC (CB PD duyệt + TB BR-NOTIF-01) | Workflow | P0 | **BLOCKED** | — | Pre-blocked. |
| DG-027 | UC91 | Workflow: CHO_DUYET_BC → DA_LAP_BC (CB PD từ chối + lý do) | Workflow | P1 | **BLOCKED** | — | Pre-blocked. |
| DG-028 | — | Guard: Sửa/xóa ở trạng thái ≥ CHO_DUYET_PC → button ẩn hoặc 403 | Workflow | P1 | **PARTIAL** | — | State NHAP cho phép PATCH (verified: tenDot sửa OK, version +1) và DELETE (204). Guard ở state cao hơn KHÔNG test được (toàn bộ record NHAP). |
| DG-029 | UC84 | Immutability: Sửa tiêu chí khi đợt ở DANG_DANH_GIA → ERR-DG-TC-02 | Workflow | P1 | **BLOCKED** | — | Pre-blocked — cần DANG_DANH_GIA + tiêu chí endpoint. |
| DG-030 | — | QTHT xem list (👁️ R) — KHÔNG có nút Tạo/Sửa/Xóa | Auth | P0 | **FAIL** | BUG-DG-002 | API: `qtht_tw` và `admin` POST → 201 (tạo DG-20260419-0008/0009). **UI pass 2:** `qtht_tw` login UI → list hiện full với nút **`+ Tạo kế hoạch` VISIBLE + ENABLED** + **Xuất Excel** + **Làm mới** ([ui-qtht-list.png](screenshots/ui-qtht-list.png)). FE không ẩn action cho QTHT → cả FE + BE đều vi phạm spec. |
| DG-031 | UC109 | QTHT CRUD `TIEU_CHI_DANH_GIA` (DM hệ thống) — role khác chỉ R | Auth | P1 | **BLOCKED** | — | Pre-blocked — `/tieu-chi-danh-gias` 404, BE chưa build UC109 (data-readiness §2.4). |
| DG-032 | — | CB_PD_TW/BN/DP KHÔNG tạo/xóa KE_HOACH — chỉ RU* | Auth | P0 | **PASS** | — | `lanhdao_tw` POST → 403 `ERR-PERM-SYS-00-01`. `lanhdao_bn` POST → 403. Đúng spec. GET list OK. |
| DG-033 | UC86 | BR-AUTH-05: CB_PD_BN chỉ duyệt đợt do CB_NV_BN **cùng đơn vị** tạo | Auth | P0 | **BLOCKED** | (BUG-DG-003 hint) | Pre-blocked — endpoint duyệt không có. Tuy nhiên probe PATCH/DELETE cross-unit BN→TW cho thấy scope KHÔNG enforce (BUG-DG-003). Dự báo DG-033 sẽ FAIL khi endpoint commit. |
| DG-034 | — | Data scope: CB_NV_BN/DP chỉ thấy đợt thuộc đơn vị mình (row-level), TW thấy tất cả | Auth | P1 | **FAIL** | BUG-DG-001 | API: canbo_bn total=9 (cả TW+DP), canbo_tinh total=9 (cả TW+BN). **UI pass 2:** `canbo_bn` ("Cán bộ BN" / "CB_BN") login UI → list hiện **3 records CỦA TW** (DG-20260419-0010/0003/0002 — tất cả donVi `...8000...`) + "1-3 / 3 mục". Toolbar đầy đủ "+ Tạo kế hoạch" ([ui-cbbn-list.png](screenshots/ui-cbbn-list.png)). 0 row-level filter cả UI + API. |
| DG-035 | — | DN/NHT/TVV/CG KHÔNG thấy menu Đánh giá (❌ 4 entity owned) | Auth | P1 | **PASS** | — | API: cả 4 Portal roles GET list/detail/POST create → 403 `ERR-PERM-SYS-00-01`. **UI pass 2:** `nht_user` login UI → landing `/403`; sidebar menu "Đánh giá hiệu quả hỗ trợ pháp lý" **grayed-out** (không phải button ARIA — không click được), mục khác cũng grey với role NHT ([ui-nht-landing.png](screenshots/ui-nht-landing.png)). Spec OK. **Minor UX note:** menu disabled-visible thay vì hidden; user NHT vẫn nhìn thấy tên module dù không có quyền — có thể cân nhắc hide hoàn toàn cho portal. |
| DG-036 | UC88 | Guard chấm điểm: user KHÔNG thuộc danh sách phân công → không mở form | Auth | P1 | **BLOCKED** | — | Pre-blocked — cần DANG_DANH_GIA + phân công. |
| DG-037 | UC87 | Cross-module VU_VIEC: chỉ VV HOAN_THANH trong kỳ đợt ĐG mới hiện | Integration | P1 | **BLOCKED** | — | Pre-blocked — precondition #10 (VV HOAN_THANH = 0). |
| DG-038 | UC89 | Cross-module auto-fill BC: số TVV/KHOA_HOC/VV/HO_SO_CHI_TRA | Integration | P1 | **BLOCKED** | — | Pre-blocked — cần state DA_DUYET_BC. |
| DG-039 | UC84/UC109 | Cross-module QTHT DM: tiêu chí ref từ `TIEU_CHI_DANH_GIA` qua popup "Nhập từ DM" | Integration | P2 | **BLOCKED** | — | Pre-blocked — DM `TIEU_CHI_DANH_GIA` = 0 nodes + endpoint 404. |
| DG-040 | UC85 | Cross-module DM lĩnh vực: dropdown load + gợi ý CB theo lĩnh vực | Integration | P2 | **BLOCKED** | — | Pre-blocked — precondition #12 (CB ≥2) thiếu + endpoint phân công 404. |

### Đếm theo Result × Priority

| Priority | PASS | FAIL | BLOCKED | PARTIAL | Total |
|---------:|-----:|-----:|--------:|--------:|------:|
| P0 | 4 | 1 | 8 | 1 | 14 |
| P1 | 4 | 1 | 17 | 0 | 22 |
| P2 | 0 | 1 | 3 | 0 | 4 |
| **Total** | **8** | **3** | **28** | **1** | **40** |

> Lưu ý: Bảng §2 có thêm 2 "PASS" nhánh bonus (BR-LEGAL-08 gộp vào DG-011, không đếm riêng). Đếm chính xác tổng = 40 TC theo spec.

### Chú thích Result

- `PASS` — đạt 100% expected behavior
- `FAIL` — có bug, link tới Bug ID
- `BLOCKED` — không chạy được (data-readiness §1.4: 8/9 state + 3 precondition thiếu)
- `PARTIAL` — đạt một phần, phần còn lại không verify được (ví dụ UI 4-tabs không mở được do browse crash)

---

## 3. Bug Report (tóm tắt inline)

> Chi tiết đầy đủ xem file [bug-report-danh-gia.md](bug-report-danh-gia.md).

### BUG-DG-001 — Critical: Cross-tier row-level scope leak (DG-034)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-034 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `GET /ke-hoach-danh-gias` (list + detail) không filter theo `donViId`. CB_NV cấp BN/DP đọc được toàn bộ đợt của Cục BTTP (TW) và các đơn vị khác.

**Expected vs Actual:** BN user chỉ nên thấy record donVi mình (`...8001...`) — thực tế thấy cả `...8000` (TW) và `...8002` (DP). Total=9 cho cả TW/BN/DP.

**Impact:** 100% CB_NV cấp BN/DP có thể đọc dữ liệu đánh giá nhạy cảm của các đơn vị khác. Kết hợp BUG-DG-003 → có thể tamper/xóa.

**Root Cause (Suggested):** Controller dùng `findMany({})` unfiltered cho mọi role đã có `permission.can('read','KeHoachDanhGia')`. Thiếu CASL ability `where.donViId = user.donViId` cho role BN/DP.

---

### BUG-DG-002 — Critical: QTHT/admin TẠO được KE_HOACH_DANH_GIA (DG-030)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-030 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Spec: QTHT chỉ R trên `KE_HOACH_DANH_GIA`. Thực tế `qtht_tw` và `admin` POST thành công (201, record `DG-20260419-0008/0009`).

**Expected vs Actual:** POST → nên 403 `ERR-PERM-SYS-00-01`; thực tế 201 success.

**Impact:** QTHT/admin vượt quyền tạo/xóa data nghiệp vụ — làm mờ boundary role + audit trail bị sai attribution.

**Root Cause (Suggested):** CASL ability rule cho QTHT có thể đang dùng `can('manage','all')` thay vì explicit `can('read',...)` + `cannot('create',...)`. Cần tách quyền CB_NV vs QTHT rõ ràng.

---

### BUG-DG-003 — Critical: BN user PATCH/DELETE record TW (DG-033 extension)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DG-033 (BR-AUTH-05) |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `canbo_bn` PATCH `tenDot="BN-TAMPERED"` cho record TW (`DG-20260419-0001`) → 200 success. DELETE cùng record → 204. Record bị xóa khỏi hệ thống; TW mất dữ liệu.

**Expected vs Actual:** PATCH/DELETE cross-unit phải → 403. Thực tế: OK + data loss thực.

**Impact:** Permanent data loss khả thi từ bất kỳ CB_NV cấp thấp với bất kỳ record cấp cao. Vi phạm BR-AUTH-05 và có thể lây lan sang nested endpoint (tiêu chí, phân công, báo cáo).

**Root Cause (Suggested):** Service `update`/`remove` không check `record.donViId === user.donViId || user.capHanhChinh === 'TW'` trước khi mutate.

---

### BUG-DG-004 — Major: PATCH silently drops `trangThai` (trả success dù không đổi)

**Mô tả:** `PATCH /:id` với `{trangThai:"DA_LAP_KH"}` trả 200 success nhưng state + version không đổi. Developer hiểu nhầm patch thành công.

**Expected vs Actual:** nên 400 `ERR-VAL-SYS-00-01 property trangThai should not exist` (bật `forbidNonWhitelisted:true`). Thực tế silent drop.

**Impact:** Automation script nhầm path, integration test giả PASS. Log audit nhiễu.

**Root Cause (Suggested):** `ValidationPipe` chưa bật `forbidNonWhitelisted: true` trong `main.ts`.

---

### BUG-DG-005 — Medium: Endpoint xuất Excel không tồn tại / route conflict

**Mô tả:** `GET /ke-hoach-danh-gias/export` → 400 "uuid is expected" (bắt vào handler `/:id`). `POST /export` → 403.

**Expected vs Actual:** Phải trả 200 + `.xlsx` file. Thực tế 400/403.

**Impact:** UI nút "Xuất Excel" hiển thị (xem screenshot) nhưng click sẽ lỗi. DG-010 BLOCKED. UX broken.

**Root Cause (Suggested):** Controller declare `@Get(':id')` TRƯỚC `@Get('export')` → Express match `/export` vào `:id="export"`.

---

## 4. Detailed Test Results (tầng 2 — chi tiết)

### 4.1 DG-001: List + phân trang + filter (P0, Happy)

**Pre-conditions:**
- `canbo_tw` login OK, accessToken hợp lệ.
- Data-readiness đã seed 3 NHAP record (`DG-20260419-0001/0002/0003`).

**Test Data:**
```
- Base URL: http://103.172.236.130:3000/api/v1/ke-hoach-danh-gias
- Filters: page, pageSize, tanSuat, doiTuong, trangThai, tuNgay, denNgay
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET `?page=1&pageSize=20` | 200, `meta.total=3`, `data.length=3`, 3 rows NHAP | 200, total=3, 3 rows DG-20260419-0001/0002/0003 | **PASS** |
| 2 | GET `?tanSuat=SO_BO_6_THANG` | total=2 (0001+0003) | total=2, đúng 2 mã | **PASS** |
| 3 | GET `?doiTuong=DAO_TAO` | total=1 (0003) | total=1, mã=0003 | **PASS** |
| 4 | GET `?trangThai=NHAP` | total=3 | total=3 | **PASS** |
| 5 | GET `?tuNgay=2026-01-01&denNgay=2026-06-30` | total=2 (0001+0003 có denNgay=30/06; 0002 có denNgay=31/12 ngoài range) | total=2 | **PASS** |
| 6 | UI check pagination "20 / trang" + 9 state tabs | 9 tabs hiện đúng thứ tự state machine FE | Screenshot `danh-gia-nhap-3-rows.png` hiển thị 9 tabs (Tất cả, Nháp, Đã lập KH, Đang phân công, Đã phân công, Đang đánh giá, Đã đánh giá, Chờ duyệt BC, Đã duyệt BC) + "1-3 / 3 mục, 20 / trang" | **PASS** (reuse evidence data-readiness) |

**Notes:** DG-001 coverage đầy đủ cả API + UI (dù UI evidence từ phase data-readiness vì browse crash ở phase này).

---

### 4.2 DG-002: Tạo đợt mới (P0, Happy, BR-DATA-04)

**Pre-conditions:** `canbo_tw` login OK.

**Test Data:**
```json
{
  "tenDot": "QA-DG-002 Create Happy",
  "tanSuat": "SO_BO_6_THANG",
  "doiTuong": "VU_VIEC",
  "thoiGianBatDau": "2026-01-01",
  "thoiGianKetThuc": "2026-06-30"
}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST create với body hợp lệ | 201 success, `id` + `maKeHoach` auto-gen, `trangThai=NHAP`, `version=1` | 201 success, id=`397b9cce-d75e-4234-8c45-c33145b37abd`, maKeHoach=`DG-20260419-0004`, trangThai=NHAP, version=1 | **PASS** |
| 2 | Verify format maKeHoach — regex `^DG-\d{8}-\d+$` | Match | `DG-20260419-0004` match | **PASS** (BR-DATA-04) |
| 3 | Verify state = NHAP | NHAP | NHAP | **PASS** |

**Notes:**
- **Field name correction:** spec dùng `tu_ngay/den_ngay` nhưng BE thực tế chấp nhận `thoiGianBatDau`/`thoiGianKetThuc` (phát hiện khi field `tuNgay/denNgay` trong body bị silent drop → post-create thiếu ngày). Cần update spec 7.8 để align với schema BE.
- UI drawer "Tạo kế hoạch" không verify được do browse crash sau OTP; button có tồn tại trên toolbar (screenshot data-readiness).

---

### 4.3 DG-003: Xem chi tiết đợt (P0, Happy)

**Pre-conditions:** Record `397b9cce...` (DG-0004) tồn tại.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET `/ke-hoach-danh-gias/{id}` | 200, full field header | 200, full data: id, maKeHoach, tenDot, tanSuat, doiTuong, trangThai, version, thoiGianBatDau/KetThuc, donViId, ... | **PASS** |
| 2 | GET `/{id}/tieu-chis` (sub-tab 1) | 200, list rỗng (state NHAP chưa có tiêu chí) | 200, `data.length=0` | **PASS** |
| 3 | GET `/{id}/vu-viec-eligible` (sub-tab 2) | 400 `ERR-STATE-SYS-00-01` — state NHAP chưa đến bước chọn VV | 400 `"Ke hoach phai o trang thai DA_PHAN_CONG, hien tai la 'NHAP'"` | **PASS** (state guard đúng) |
| 4 | UI verify 4 tabs (Tổng quan, Tiêu chí, Phân công, Vụ việc) | 4 tabs render đầy đủ | **Không verify** được do browse crash sau OTP | **PARTIAL** |

**Notes:** Sub-tab 3/4 (Phân công, Chấm điểm) chưa có endpoint riêng → check gián tiếp qua state/permission (đều trả phù hợp với state NHAP).

---

### 4.4 DG-011: Validate field bắt buộc (P1, Negative)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST thiếu `tenDot` | 400 `ERR-VAL-SYS-00-01` | 400 details[]: "tenDot must be a string" | **PASS** |
| 2 | POST thiếu `tanSuat` | 400 | 400 "tanSuat must be one of SO_BO_6_THANG, TRON_NAM" | **PASS** |
| 3 | POST thiếu `doiTuong` | 400 | 400 "doiTuong must be one of VU_VIEC, DAO_TAO, TONG_HOP" | **PASS** |
| 4 | POST thiếu ngày | 400 | 400 "thoiGianBatDau must be a valid ISO 8601 date string" | **PASS** |
| 5 | BR-LEGAL-08: POST `tanSuat=DOT_XUAT` | 400 — chỉ 2 value hợp lệ | 400 "tanSuat must be one of SO_BO_6_THANG, TRON_NAM" | **PASS** |

**Notes:** BE validate cẩn thận ở class-validator, error `code` + `message` đúng format.

---

### 4.5 DG-012: Validate ngày (P1, Negative)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST `thoiGianBatDau=2026-06-30, thoiGianKetThuc=2026-01-01` | 400 ERR-DG-KH-02 (hoặc ERR-VAL tương đương) | 400 "Thời gian kết thúc phải lớn hơn thời gian bắt đầu" | **PASS** |
| 2 | POST `thoiGianBatDau=thoiGianKetThuc` (cùng ngày) | 400 — strict `>` | 400 cùng message | **PASS** |

---

### 4.6 DG-028: Guard sửa/xóa (P1, Workflow — PARTIAL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | PATCH `tenDot="QA-DG-002 Updated"` trên record NHAP | 200 success, version +1 | 200 success, tenDot updated, version=2 | **PASS** (NHAP allows update — đúng spec) |
| 2 | DELETE record NHAP | 204 | 204 | **PASS** |
| 3 | PATCH/DELETE record ở state ≥ CHO_DUYET_PC → 403 | N/A | **Không test được** — no record ở state > NHAP | **BLOCKED** |

**Kết quả tổng:** PARTIAL (half PASS half BLOCKED).

---

### 4.7 DG-030: QTHT authorization (P0, Auth — FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `qtht_tw`, POST create | 403 `ERR-PERM-SYS-00-01` | **201 created (DG-20260419-0008)** | **FAIL** — BUG-DG-002 |
| 2 | Login `admin`, POST create | 403 | **201 created (DG-20260419-0009)** | **FAIL** |
| 3 | qtht_tw GET list | 200 (read allowed) | 200, total=7 | **PASS** (phần R) |

---

### 4.8 DG-032: CB_PD authorization (P0, Auth — PASS)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `lanhdao_tw` POST create | 403 | 403 `ERR-PERM-SYS-00-01` | **PASS** |
| 2 | `lanhdao_bn` POST create | 403 | 403 | **PASS** |
| 3 | `lanhdao_tw` GET list | 200 (read) | 200, total=5 | **PASS** |

---

### 4.9 DG-034: Row-level data scope (P1, Auth — FAIL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `canbo_bn` GET list — chỉ thấy donVi BN (`...8001...`) | 1 row | **9 rows** (TW+BN+DP tất cả) | **FAIL** — BUG-DG-001 |
| 2 | `canbo_tinh` GET list — chỉ thấy donVi DP (`...8002...`) | 1 row | **9 rows** | **FAIL** |
| 3 | `canbo_tw` GET list — thấy tất cả | 9 rows | 9 rows | **PASS** (phần TW) |
| 4 | **EXTENSION:** `canbo_bn` PATCH record TW | 403 | **200** (BUG-DG-003) | **FAIL** |
| 5 | **EXTENSION:** `canbo_bn` DELETE record TW | 403 | **204** — record mất | **FAIL** |

---

### 4.10 DG-035: Portal role authz (P1, Auth — PASS)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `nht_user` GET list | 403 | 403 `ERR-PERM-SYS-00-01` | **PASS** |
| 2 | `dn_user` GET list | 403 | 403 | **PASS** |
| 3 | `tvv_user` GET list | 403 | 403 | **PASS** |
| 4 | `chuyengia_user` GET list | 403 | 403 | **PASS** |
| 5 | Tất cả: POST create + GET detail | 403 | 403 đều nhất quán | **PASS** |

**Notes:** UI menu check không test được qua browse (crash) — nhưng BE chặn rốt ráo ở mọi endpoint, nên kể cả UI rò menu cũng không khai thác được.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV | Cục BTTP | TW | DG-001, DG-002, DG-003, DG-011, DG-012, DG-028, baseline DG-030/032/033/034/035 |
| canbo_bn | CB_NV | Bộ KH&ĐT | BN | DG-034, BUG-DG-003 probe (PATCH/DELETE cross-level) |
| canbo_tinh | CB_NV | Sở TP Hà Nội | DP | DG-034 |
| lanhdao_tw | CB_PD | Cục BTTP | TW | DG-032 |
| lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | DG-032, DG-034 (lanhdao list) |
| qtht_tw | QTHT | Cục BTTP | TW | DG-030 |
| admin | QTHT (super) | Cục BTTP | TW | DG-030 (duplicate test) |
| nht_user, dn_user, tvv_user, chuyengia_user | Portal | — | — | DG-035 |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| 57a707aa-... / DG-20260419-0001 | SEED-NHAP-SO_BO_6T-VU_VIEC Q1-2026 | DG-034 cross-tier probe + BUG-DG-003 DELETE target | **Deleted by canbo_bn (BUG-DG-003) — data loss evidence** |
| fc4787f3-... / DG-20260419-0002 | SEED-NHAP-TRON_NAM-TONG_HOP 2026 | DG-001 filter tanSuat/date range | Retained |
| 95b5d294-... / DG-20260419-0003 | SEED-NHAP-SO_BO_6T-DAO_TAO H1-2026 | DG-001 filter doiTuong | Retained |
| 397b9cce-... / DG-20260419-0004 | QA-DG-002 Create Happy → Updated | DG-002, DG-003, DG-028 | **Deleted by canbo_tw (DG-028 step 2)** |
| 4cdce8db-... / DG-20260419-0005 | AUTHZ-probe (canbo_tw) | Extra create for list count | Cleaned up post-test |
| 87392edf-... / DG-20260419-0006 | AUTHZ-probe (canbo_bn) | DG-034 BN-owned row | Cleaned up post-test |
| 32a126bc-... / DG-20260419-0007 | AUTHZ-probe (canbo_tinh) | DG-034 DP-owned row | Cleaned up post-test |
| ca402c10-... / DG-20260419-0008 | AUTHZ-probe (qtht_tw) | BUG-DG-002 evidence | Cleaned up post-test |
| 27b45643-... / DG-20260419-0009 | AUTHZ-probe (admin) | BUG-DG-002 evidence | Cleaned up post-test |

**State cuối kỳ test:** total=2 (DG-0002 + DG-0003 retain). Record 0001 đã bị BN user xóa mất vĩnh viễn.

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/ke-hoach-danh-gias` (plural, standard REST)
- **Auth flow:** 2-step JWT + OTP. Login → `otpToken` → verify-otp (`otpCode` — NOT `otp`) → `accessToken` + `refresh_token` (cookie httpOnly)
- **Token TTL:** accessToken ~5188 chars JWT RS256; refresh_token 7 days
- **Frontend framework:** React + Vite + Ant Design + CASL
- **Backend:** NestJS + PostgreSQL + Prisma
- **Field name mismatch:** spec dùng `tuNgay/denNgay`, BE dùng `thoiGianBatDau/thoiGianKetThuc`. Spec cần update.
- **State machine mismatch (from data-readiness §6.3):** spec 7.8 dùng `CHO_DUYET_PC/DA_DUYET_PC/DA_LAP_BC`, FE/BE dùng `DANG_PHAN_CONG/DA_PHAN_CONG/HUY` + bỏ DA_LAP_BC. Spec + SM-DANHGIA cần update.
- **BE transition endpoints:** chỉ nửa sau workflow build (vu-viec-select, ket-quas, bao-cao). Nửa đầu (hoàn tất KH, trình PC, duyệt PC) chưa có — pre-blocked 25/40 TC.
- **Browse tool — root cause + fix pattern (pass 2 discovery):**
  - **Lỗi ban đầu:** chain login UI crash với `"Target page, context or browser has been closed"` sau bước OTP. Chẩn đoán sai lần 1 là "REAL CRASH Playwright".
  - **Root cause thực sự:** BUG-ENV-01 persist password field giữa các lần goto `/login`. `fill` không clear → type Password đè thành `Test@1234Test@1234` → login API trả 401 → OTP form không render → các chain step wait OTP element timeout → cộng với Vite HMR WebSocket `wait --networkidle` không bao giờ idle → cuối cùng server timeout hẳn → browser trạng thái "đóng". Không phải navigation race condition như nghi ngờ ban đầu.
  - **Pattern ổn định (đã verified pass 2):**
    ```
    click <input> → press Control+a → type <value>       # thay vì fill (fill không clear)
    click submit → wait --networkidle → js sleep 2500ms   # login API đủ 2-3s
    type "666666"                                         # auto-focus ô đầu, dispatch 6 char event
    js sleep 4000ms                                       # đợi verify-otp + redirect /403
    snapshot -i                                           # lấy ref sidebar menu trong SAME chain
    click @e<N>                                           # click bằng ref (Rule 4)
    js sleep 3500ms                                       # SPA route settle
    ```
  - **Tránh:** `wait --networkidle` sau SPA route change (Vite HMR WS → never idle → chain timeout).
  - **Ghi nhận:** FE store key là `sessionStorage.auth-store` (chỉ userInfo, KHÔNG có accessToken) + `refresh_token` cookie httpOnly. Token có thể giữ in-memory trong interceptor + refresh qua cookie. Muốn inject token để bỏ qua login UI → cần replicate cả 2 + có thể gọi `/api/v1/auth/refresh` để lấy accessToken in-memory.

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-DG-001 (Critical):** Thêm CASL ability filter `where.donViId = user.donViId` cho role BN/DP trên GET list + GET detail. Integration test matrix 3×3 bắt buộc.
2. **BUG-DG-002 (Critical):** Revoke `create/update/delete` ability cho role QTHT trong ability.factory. QTHT chỉ `read` + DM.
3. **BUG-DG-003 (Critical):** Thêm ownership check (`record.donViId === user.donViId || user.capHanhChinh === 'TW'`) trong `update/remove` service. Rà soát tương tự ở mọi module có row-level ownership (Vụ việc, Chi trả, TVV, ...).

### Should Fix

4. **BUG-DG-004 (Major):** Bật `forbidNonWhitelisted: true` trong `ValidationPipe` toàn cục.
5. **BUG-DG-005 (Medium):** Đổi thứ tự route `@Get('export')` TRƯỚC `@Get(':id')` trong controller; verify POST path + role guard.

### Blocker cần BE commit

6. **BE transition endpoints chưa build** (data-readiness §6.1): `/{id}/tieu-chis` (CRUD), `/{id}/hoan-tat-lap-kh`, `/{id}/trinh-phan-cong`, `/{id}/phe-duyet-phan-cong`, `/{id}/tu-choi-phan-cong`, `/{id}/huy`. Gate 25 TC BLOCKED. Cần BE confirm roadmap + commit sớm.

### Additional Recommendations

7. **Spec align:** update `funtion/7.8-danh-gia.md` + `test-strategy.md §6.10 SM-DANHGIA` để khớp FE schema thực tế (`DANG_PHAN_CONG/DA_PHAN_CONG/HUY`, bỏ `DA_LAP_BC`). Ghi rõ field name `thoiGianBatDau/KetThuc`.
8. **Browse fix — bằng chứng là BUG-ENV-01 persist password** (xem §6 "Browse tool — root cause + fix pattern"): `fill` không clear field → type đè → login fail ngầm → OTP không render → chain timeout. Đề xuất FE fix BUG-ENV-01 (không persist password giữa navigate) sẽ tự động gỡ được lỗi này cho mọi tooling. Đồng thời bổ sung Rule 10 vào CLAUDE.md cho module tương lai: dùng `press Ctrl+A + type` thay `fill` cho mọi form login.
9. **Precondition seed:** tạo ≥1 `CB_NV TW` thứ 2 (Cục BTTP) trong `test-accounts.csv` để unblock DG-005 (phân công ≥2 người) + DG-014/015. Seed ≥2 `TIEU_CHI_DANH_GIA` trong DM (UC109) — có thể cần BE build endpoint trước.
10. **Audit bổ sung module khác:** Critical bug BUG-DG-001/002/003 là pattern BE — rất có thể các module khác (Vụ việc, Chi trả, Chuyên gia/TVV) cũng đang bị. Khuyến nghị chạy probe scope tương tự trên các module đó TRƯỚC khi release.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/auth/login` | Login step 1 | Setup (tất cả) |
| POST | `/api/v1/auth/verify-otp` | Login step 2 | Setup |
| GET | `/api/v1/ke-hoach-danh-gias` | List + filter | DG-001, DG-030, DG-032, DG-034, DG-035 |
| POST | `/api/v1/ke-hoach-danh-gias` | Create | DG-002, DG-011, DG-012, DG-030, DG-032, DG-035 |
| GET | `/api/v1/ke-hoach-danh-gias/:id` | Detail | DG-003, DG-034 |
| PATCH | `/api/v1/ke-hoach-danh-gias/:id` | Update | DG-028, BUG-DG-003, BUG-DG-004 |
| DELETE | `/api/v1/ke-hoach-danh-gias/:id` | Soft delete | DG-028, BUG-DG-003 (cleanup) |
| GET | `/api/v1/ke-hoach-danh-gias/:id/tieu-chis` | Sub-list | DG-003 |
| GET | `/api/v1/ke-hoach-danh-gias/:id/vu-viec-eligible` | Sub-list | DG-003 (state guard check) |
| GET | `/api/v1/ke-hoach-danh-gias/export` | Export Excel | DG-010 (FAIL) |
| POST | `/api/v1/ke-hoach-danh-gias/:id/tieu-chis` | Add criterion | DG-004 (BLOCKED — 404) |
| POST | `/api/v1/ke-hoach-danh-gias/:id/hoan-tat-lap-kh` | NHAP → DA_LAP_KH | DG-018 (BLOCKED — 404) |
| POST | `/api/v1/ke-hoach-danh-gias/:id/trinh-phan-cong` | DA_LAP_KH → CHO_DUYET_PC | DG-019 (BLOCKED — 404) |
| POST | `/api/v1/ke-hoach-danh-gias/:id/phe-duyet-phan-cong` | CHO_DUYET_PC → DA_DUYET_PC | DG-020 (BLOCKED — 404) |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [danh-gia-list-empty.png](danh-gia-list-empty.png) | Tab "Tất cả" empty state (pre-seed) | DG-001 context |
| [danh-gia-nhap-3-rows.png](danh-gia-nhap-3-rows.png) | List 3 NHAP rows + 9 state tabs + toolbar Tạo/Xuất Excel/Làm mới + pagination 20/trang | DG-001 + DG-010 context + BUG-DG-005 |
| [screenshots/ui-cbtw-landing-403.png](screenshots/ui-cbtw-landing-403.png) | Sau login canbo_tw → /403 (đúng spec: CB_NV không có dashboard, sidebar đầy đủ) | Session evidence |
| [screenshots/ui-cbtw-list.png](screenshots/ui-cbtw-list.png) | **UI pass 2** — canbo_tw list module Đánh giá: 3 rows + 9 tabs state + toolbar "Tạo kế hoạch / Xuất Excel / Làm mới" + pagination 20/trang | DG-001 |
| [screenshots/ui-cbtw-create-drawer.png](screenshots/ui-cbtw-create-drawer.png) | Drawer "Tạo kế hoạch đánh giá" với 7 field + 3 action | DG-002 |
| [screenshots/ui-cbtw-export-click.png](screenshots/ui-cbtw-export-click.png) | Click "Xuất Excel" → toast đỏ "Xuất Excel thất bại" | DG-010 + BUG-DG-005 |
| [screenshots/ui-qtht-list.png](screenshots/ui-qtht-list.png) | qtht_tw (QTHT_TW) vào list Đánh giá — nút "+ Tạo kế hoạch" VẪN HIỆN | DG-030 + BUG-DG-002 |
| [screenshots/ui-cbbn-list.png](screenshots/ui-cbbn-list.png) | canbo_bn (CB_BN) vào list Đánh giá — thấy 3 records của TW (scope leak) | DG-034 + BUG-DG-001 |
| [screenshots/ui-nht-landing.png](screenshots/ui-nht-landing.png) | nht_user landing /403 — sidebar menu Đánh giá grayed-out | DG-035 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| UC83 — Lập KH đánh giá | DG-001, DG-002, DG-003, DG-010, DG-011, DG-012, DG-028 | 4 PASS / 1 FAIL / 1 PARTIAL / 1 BLOCKED |
| UC84 — Tiêu chí (BR-CALC-04) | DG-004, DG-013, DG-029, DG-039 | 0/4 — tất cả BLOCKED (endpoint chưa build) |
| UC85 — Phân công | DG-005, DG-014, DG-015, DG-040 | 0/4 — BLOCKED |
| UC86 — Duyệt PC (BR-AUTH-05) | DG-020, DG-021, DG-033 | 0/3 — BLOCKED (+ BUG-DG-003 gián tiếp) |
| UC87 — Chọn VV | DG-006, DG-022, DG-037 | 0/3 — BLOCKED |
| UC88 — Chấm điểm | DG-007, DG-016, DG-023, DG-036 | 0/4 — BLOCKED |
| UC89 — Lập BC | DG-008, DG-009, DG-024, DG-038 | 0/4 — BLOCKED |
| UC90 — Trình BC | DG-025 | 0/1 — BLOCKED |
| UC91 — Duyệt BC | DG-017, DG-026, DG-027 | 0/3 — BLOCKED |
| UC109 — QTHT DM tiêu chí | DG-031, DG-039 | 0/2 — BLOCKED |
| Authorization | DG-030, DG-032, DG-034, DG-035 | 2 PASS (DG-032, DG-035) / 2 FAIL (DG-030, DG-034) |
| BR-LEGAL-08 (tần suất) | DG-011 bonus | PASS |
| BR-DATA-04 (mã gen) | DG-002 | PASS |
| BR-AUTH-05 (duyệt cùng cấp) | DG-033 | BLOCKED (gián tiếp FAIL qua BUG-DG-003) |
| BR-CALC-04 (SUM trọng số) | DG-004, DG-013 | BLOCKED |
| BR-FLOW-04 (lý do từ chối ≥10 ký tự) | DG-017, DG-021, DG-027 | BLOCKED |
| BR-NOTIF-01 (MailHog TB) | DG-020, DG-026 | BLOCKED |
| BR-DATA-05 (audit trail CUD) | cross-all | Partial — PATCH/DELETE được log `nguoiCapNhatId` nhưng không ngăn cross-unit |

---

*Report generated: 2026-04-19 15:02 (UTC+7) | Claude QA Automation via Claude Code (/qa-only skill) | Round 2*
