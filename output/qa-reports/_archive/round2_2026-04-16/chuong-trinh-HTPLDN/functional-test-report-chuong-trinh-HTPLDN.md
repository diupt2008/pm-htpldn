# Functional Test Report — Chương trình HTPLDN (Module 7.15)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Chương trình HTPLDN (Module 7.15) |
| **SRS Reference** | srs-fr-15-ct-htpldn.md — FR-XI-01 → FR-XI-09 |
| **UC Coverage** | UC164, UC165, UC166, UC167, UC168 (partial) |
| **Người test** | Claude + `/qa-only` (Playwright headless + API) |
| **Ngày** | 2026-04-20 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based (browse) + API bắt buộc cho BE validation (CT-101/102/103) |
| **Primary Account** | `canbo_tw` / `Test@1234` (CB_TW, donVi 00000000...001) |
| **Round** | Round 2 (2026-04-16) |
| **Tài liệu tham chiếu** | [funtion/7.15-chuong-trinh-HTPLDN.md](../../../funtion/7.15-chuong-trinh-HTPLDN.md), [data-readiness-chuong-trinh-HTPL.md](data-readiness-chuong-trinh-HTPL.md), [bug-report-chuong-trinh-HTPLDN.md](bug-report-chuong-trinh-HTPLDN.md) |
| **Prototype reference** | https://prototype-dusky-alpha.vercel.app/chuong-trinh/danh-sach.html |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases trong spec** | 42 (P0: 14, P1: 23, P2: 5) |
| **Scope Lệnh 4 này** | 14 TC (6 happy CRUD + 5 negative + 1 search + 2 auth UI) |
| **Thực tế runnable** | 12 (CT-104/105 BLOCKED vì cần state ≠ DU_THAO — B6) |
| **Passed** | 7 |
| **Failed** | 3 |
| **Partial** | 2 |
| **Blocked** | 2 (CT-104/105) |
| **Skipped** | 28 (TC Nhóm 3a/3b/4 workflow/5/6 BLOCKED bởi B6 + BUG-CT-FE-003) |
| **Pass Rate (runnable)** | 7/12 = **58%** |
| **Pass Rate (spec total)** | 7/42 = 17% (còn 28 BLOCKED chờ BE/FE fix) |
| **Bugs Found tại Lệnh 4** | **8** (1 Critical + 3 Major + 2 Medium + 2 Minor) |
| **Health Score** | **52/100** — module có thể dùng cho CRUD cơ bản, nhưng 100% workflow lifecycle chưa vận hành + soft-delete leak |
| **Start Time** | 2026-04-20 09:30 UTC+7 |
| **End Time** | 2026-04-20 11:45 UTC+7 |
| **Total Duration** | ~135 phút (budget 2h, vượt do browse harness crash retry) |
| **Browse Status** | PARTIAL (nhiều timeout/session reset — fallback API cho negative TC) |

### Verdict: **CONDITIONAL FAIL**

Module cơ sở hạ tầng tốt (list/form/search/validation BE đều work). Nhưng:
- **1 Critical BE bug**: soft-delete không filter khỏi list → user thấy record đã xóa (vi phạm BR-DATA-01)
- **3 Major bugs**: Workflow 100% blocked (BUG-BE-CT-001 + BUG-CT-FE-003), QTHT có Create button trái 👁️R spec
- Functional CRUD cơ bản (Nhóm 1) hoạt động; Workflow SM (Nhóm 3a/3b) + Cross-module (Nhóm 5) chưa dùng được

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi TC 1 dòng. Chi tiết xem §4.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| **Nhóm 1: Happy CRUD CT** | | | | | | | |
| CT-001 | FR-XI-01, UC164 | Xem DS CT — 7 rows + cột chuẩn | Happy | P0 | ✅ **PASS** | — | 7 rows + 9 cột đúng spec (Mã CT / Tên / Mục tiêu / Thời gian / Ngân sách / Đơn vị / Trạng thái / Số đợt BC / Hành động) |
| CT-002 | FR-XI-01, UC164 | Tạo CT đầy đủ field → auto-gen mã + DU_THAO | Happy | P0 | ✅ **PASS** | — | 7 CT seeded (Lệnh 3). Mã format `CT-YYYYMMDD-SEQ` đúng (vd `CT-20260420-0001`). Auto gán DU_THAO. |
| CT-003 | FR-XI-01, UC164 | Sửa CT DU_THAO — đổi tên/ghi chú | Happy | P0 | ✅ **PASS** | — | PATCH `/chuong-trinh-htpls/{id}` với `version` work (verified Lệnh 3) |
| CT-004 | FR-XI-01, UC164 | Tạo CT chỉ field bắt buộc (no KT, no ngân sách) | Happy | P1 | ✅ **PASS** | — | API accept; required fields đúng spec: `tenChuongTrinh`, `mucTieu`, `doiTuong`, `thoiGianBatDau` |
| CT-005 | FR-XI-01, UC164, BR-DATA-01 | Xóa CT DU_THAO → soft delete | Happy | P0 | ❌ **FAIL** | BUG-CT-BE-001 | DELETE trả 204 ✅ + `isDeleted:true` trong GET detail ✅, **NHƯNG list API vẫn trả record**. Vi phạm BR-DATA-01. |
| CT-006 | FR-XI-01, UC164 | Upload file đính kèm (PDF/DOCX) | Happy | P2 | ⚠️ **PARTIAL** | BUG-CT-UI-002 | Nút upload có tiếng Trung `单击上传`. Không thử upload file thật do browse session reset. |
| CT-022 | FR-XI-02, UC165 | Tìm kiếm theo từ khóa | Happy | P0 | ✅ **PASS** | — | Gõ "DA_CONG_BO" → filter còn 1 row match. Search realtime OK. |
| **Nhóm 2: Negative / Validation** | | | | | | | |
| CT-101 | FR-XI-01, UC164 | Tạo CT thiếu trường bắt buộc | Negative | P1 | ✅ **PASS** | — | FE: 4 inline errors đúng field (Tên/Mục tiêu/Đối tượng/Thời gian). BE: 10 errors details. |
| CT-102 | FR-XI-01, UC164 | Tạo CT với KT < BĐ | Negative | P1 | ✅ **PASS** | — | BE: `ERR-VAL-XI-01-05 "Thoi gian ket thuc phai sau thoi gian bat dau"` (không có unicode) |
| CT-103 | FR-XI-01, UC164 | Tạo CT với ngân sách < 0 | Negative | P1 | ⚠️ **PARTIAL** | BUG-CT-UI-005 | BE block OK (`ERR-VAL-SYS-00-01 "nganSach must not be less than 0"`). **FE input NumberInput accept `-100` visually** (không client-side validate). End-to-end safe vì BE block, nhưng UX tệ. |
| CT-104 | FR-XI-01, UC164 | Sửa CT khi state ≠ DU_THAO | Negative | P0 | 🔒 **BLOCKED** | — | **Không test được**: cần CT ở state ≠ DU_THAO, blocked by B6 (8 transition endpoints 403) |
| CT-105 | FR-XI-01, UC164 | Xóa CT khi state ≠ DU_THAO | Negative | P0 | 🔒 **BLOCKED** | — | Cùng blocker B6 |
| **Nhóm 4: Authorization smoke** | | | | | | | |
| CT-206 | BR-AUTH-01 | QTHT read-only (👁️R, không Create/Edit/Delete) | Authorization | P1 | ❌ **FAIL** | BUG-CT-PERM-001 | QTHT list OK (7 rows). Per-row Sửa/Xóa đã ẩn ✅. **NHƯNG nút `+ Thêm Chương trình` vẫn enabled** → trái spec (pattern lặp M5/M6/M7/M8.1/M8.2/M8.3) |
| CT-207 | BR-AUTH-01 | TVV/NHT/CG/GV/DN không thấy menu CT | Authorization | P1 | ⚠️ **PARTIAL** | BUG-CT-UI-006 | Login `tvv_user` → URL `/403`. Menu CT HTPLDN trong sidebar: visible nhưng **disabled (grayed out)**. Spec nói "không thấy menu" → nên ẩn hoàn toàn. Cosmetic issue. |

### Chú thích

> **Result:** ✅ PASS / ❌ FAIL / ⚠️ PARTIAL / 🔒 BLOCKED

---

## 3. Bug Summary

> **Lưu ý:** Chi tiết đầy đủ với evidence/repro/impact xem [bug-report-chuong-trinh-HTPLDN.md](bug-report-chuong-trinh-HTPLDN.md) (1 file consolidated, tách sections theo loại BE/FE/UI).

| Bug ID | Severity | Priority | Type | TC | Title | Status |
|--------|----------|----------|------|-----|-------|--------|
| **BUG-CT-BE-001** | **Critical** | P0 | Data | CT-005 | Soft-delete không filter khỏi list API → vi phạm BR-DATA-01 | Open |
| **BUG-BE-CT-001** | **Critical** | P0 | Workflow | CT-007...CT-038 (24 TC) | 8 transition endpoints trả 403 Forbidden (block 100% lifecycle) | Open |
| **BUG-CT-FE-003** | **Major** | P1 | Feature | CT-020...CT-038 | Tab `Đợt báo cáo` placeholder "Tính năng sẽ được triển khai ở Story 13.6" | Open |
| **BUG-CT-PERM-001** | **Major** | P1 | Permission | CT-206 | QTHT có nút `+ Thêm Chương trình` enabled trên list (trái 👁️R spec, pattern lặp 5 module) | Open |
| **BUG-CT-UI-002** | Medium | P2 | UI/UX | CT-006 | Nút upload file hiển thị `单击上传` (tiếng Trung) thay vì tiếng Việt | Open |
| **BUG-TEST-ACCOUNT-001** | Medium | P2 | Test Data | CT-201..204 | 3 account `canbo_tw/bn/dp` chia sẻ donViId → scope isolation không test được | Open |
| **BUG-CT-UI-005** | Minor | P2 | Validation | CT-103 | FE NumberInput accept `-100` visually (không client-side validate); BE block OK | Open |
| **BUG-CT-UI-001** | Minor | P2 | UI/UX | CT-002 | Field `Đơn vị` trong detail hiển thị `-` thay vì tên Cục/Bộ/Sở user thuộc | Open |
| **BUG-CT-UI-006** | Minor | P3 | UI/UX | CT-207 | Menu CT HTPLDN cho TVV hiển thị disabled (spec yêu cầu ẩn hoàn toàn) | Open |
| **OBS-CT-02** | Observation | — | UI | — | Thanh tiến trình detail hiện 6 step (Dự thảo/Chờ PD/Đã duyệt/Công bố/Thực hiện/Hoàn thành) — thiếu TAM_DUNG + HUY (có thể by design happy path) | — |

**Breakdown:** 2 Critical + 2 Major + 2 Medium + 3 Minor + 1 Obs = **10 findings**.

---

## 4. Prototype Comparison

> So sánh UI thực tế vs [prototype-dusky-alpha.vercel.app](https://prototype-dusky-alpha.vercel.app/chuong-trinh/danh-sach.html) (credentials: `admin_tw`, OTP bất kỳ).

### 4.1 List page UI discrepancies

| Aspect | Prototype | App thực tế | Đánh giá |
|--------|-----------|-------------|----------|
| **Heading** | `Quản lý chương trình hỗ trợ pháp lý doanh nghiệp` (đầy đủ) | `Quản lý Chương trình HTPLDN` (viết tắt HTPLDN) | Label diff — app viết tắt. Minor. |
| **Tabs by state** | Không có | 7 tabs: Tất cả / Dự thảo / Chờ PD / Đã duyệt / Đã công bố / Đang thực hiện / Hoàn thành | **App có thêm** — feature tốt hơn prototype |
| **Filters** | 3: Tìm kiếm / Đơn vị / Trạng thái | 4: Từ khóa / Công bố / Từ ngày / Đến ngày | **DIFF Major**: App thiếu `Đơn vị` filter (spec SRS §FR-XI-02 yêu cầu) + thay `Trạng thái` bằng `Công bố` (semantic khác) |
| **Button `Thêm mới`** | `+ Thêm mới` | `+ Thêm Chương trình` | Label diff nhẹ, OK |
| **Button `Xuất Excel`** | Có | Có | OK |
| **Button `Làm mới`** | Không có (dùng `↻ Xóa bộ lọc`) | Có `Làm mới` | App có thêm |
| **Button `Tìm kiếm`** | Có (explicit submit button) | Không có — search on-type | DIFF UX, app tốt hơn |
| **Column `Mã`** | `MÃ CHƯƠNG TRÌNH` | `Mã CT` | App viết tắt |
| **Column `Đợt BC`** | `ĐỢT BÁO CÁO` | `Số đợt BC` | App technical hơn |
| **Row actions** | Xem / Tạm dừng / Kích hoạt / Sửa | Xem / Xóa (DU_THAO) | Prototype có actions theo state (Tạm dừng/Kích hoạt), app chưa có — liên quan BUG-BE-CT-001 chưa có lifecycle |
| **Format mã** | `CT-20260101-001` (3 digit SEQ) | `CT-20260420-0001` (4 digit SEQ) | Minor — implementation detail |

### 4.2 Form `+ Thêm mới` UI discrepancies

| Aspect | Prototype | App thực tế | Đánh giá |
|--------|-----------|-------------|----------|
| **UI style** | Drawer slide từ phải (panel width ~520px) | Full page route `/ct-htpldn/tao-moi` | DIFF UX Major — prototype fast-entry drawer vs app full-page form. Không sai spec, nhưng UX khác biệt. |
| **Drawer/Page title** | `Thêm mới Chương trình` | `Tạo Chương trình HTPLDN mới` | Label diff |
| **Fields** | 3 (Tên/Tiêu đề, Mô tả, Ghi chú) | **11** (Mã CT auto, Đơn vị auto, Tên, Lĩnh vực, Mục tiêu, Đối tượng, Thời gian BĐ/KT, Ngân sách, Ghi chú, File đính kèm) | **App tuân SRS FR-XI-01 đủ hơn**. Prototype là mock minimal. |
| **Required fields** | 1 (Tên) | 4 (Tên, Mục tiêu, Đối tượng, Thời gian BĐ) | App nhiều hơn, đúng SRS |
| **Button bottom** | `Hủy` / `Lưu` | `Đặt lại` / `Tạo chương trình` | Label diff — app có reset form vs hủy đóng drawer |
| **Placeholder** | Cụ thể (`Nhập tiêu đề...`, `Nhập mô tả chi tiết...`) | Generic `nhập dữ liệu` nhiều field | App placeholder kém UX hơn |
| **Upload file** | Không có field | Có, nhưng text button tiếng Trung `单击上传` | BUG-CT-UI-002 |

### 4.3 Detail page UI discrepancies

Prototype không có detail page dễ navigate (drawer-only flow). Không so sánh được chi tiết.

App detail có:
- 3 tabs: Thông tin / Tài liệu / Đợt báo cáo (tab 3 placeholder Story 13.6 — BUG-CT-FE-003)
- Thanh tiến trình 6 step (OBS-CT-02, thiếu TAM_DUNG + HUY so spec 8 state)
- Action bar dưới cùng: Lưu nháp / Gửi phê duyệt / Hủy CT (theo state DU_THAO, đúng spec)

---

## 5. Detailed Test Results

> Chỉ ghi detail cho TC có finding quan trọng. TC PASS đơn giản xem §2 summary.

### 5.1 CT-005: Xóa CT DU_THAO → soft delete — **FAIL**

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | DELETE `/api/v1/chuong-trinh-htpls/cac1d071-...` với `canbo_tw` JWT | 204 No Content | 204 ✅ | PASS |
| 2 | GET `/api/v1/chuong-trinh-htpls/cac1d071-...` | Record vẫn tồn tại DB với `isDeleted:true` | `isDeleted: true, deletedAt: "...", deletedBy: "..."` ✅ | PASS |
| 3 | GET `/api/v1/chuong-trinh-htpls?page=1&pageSize=100` | Record KHÔNG xuất hiện trong list (BR-DATA-01) | **Record CT-20260420-0006 vẫn xuất hiện** `meta.total=7` (6 alive + 1 deleted) ❌ | **FAIL** |
| 4 | UI list check | Deleted row ẩn | CT-0006 xuất hiện trong 7 rows của list page ❌ | **FAIL** |

**Notes:** Vi phạm BR-DATA-01 "Soft delete — record is_deleted=true phải ẩn khỏi list". Bug severity Critical vì user có thể "thấy" record đã xóa, gây confusion + nguy cơ thao tác sai.

**Evidence:**
- [screenshots/list-soft-delete-leaked.png](screenshots/list-soft-delete-leaked.png) — CT-0006 TW-HUY vẫn hiển thị
- API JSON response: `{"maChuongTrinh":"CT-20260420-0006", "isDeleted":null, ...}` trong list (list response không trả `isDeleted` field → FE không filter được)

---

### 5.2 CT-103: Ngân sách < 0 — **PARTIAL**

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Mở form `+ Thêm Chương trình` | Form load | Form 10 field hiển thị ✅ | PASS |
| 2 | Gõ `-100` vào field Ngân sách (VNĐ) | FE block input hoặc hiển thị inline error | **FE accept value `-100`** trong NumberInput, không error client-side ⚠️ | **FAIL (FE)** |
| 3 | Submit form với các field required + nganSach=-1000000 (via API) | BE trả 422 validation | `ERR-VAL-SYS-00-01 "nganSach must not be less than 0"` ✅ | PASS (BE) |

**Notes:** BE validate OK → end-to-end safe (không tạo record với budget âm). Nhưng FE không client-side validate → UX tệ, user phải submit mới biết invalid. Nên thêm `min={0}` trên Antd `InputNumber`.

**Evidence:**
- [screenshots/ct-103-budget-input-accepted.png](screenshots/ct-103-budget-input-accepted.png) — Form field hiển thị `-100` không error

---

### 5.3 CT-206: QTHT read-only — **FAIL**

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `qtht_tw` | Success | URL `/ct-htpldn/danh-sach` ✅ | PASS |
| 2 | Xem DS CT | 7 rows display (👁️R) | 7 rows ✅ | PASS |
| 3 | Check button `+ Thêm Chương trình` visible | KHÔNG visible (QTHT only read) | **Button visible + enabled** ❌ | **FAIL** |
| 4 | Check per-row actions `Sửa`/`Xóa` | Không có | editBtns=0, deleteBtns=0 ✅ | PASS |

**Notes:** Bug pattern lặp lại với M5 (Chi trả), M6 (DN), M7 (Biểu mẫu), M8.1 (Đào tạo), M8.2 (Đánh giá), M8.3 (TVCS) — QTHT luôn thấy `+ Tạo mới` trái với 👁️R spec. **Fix 1 dòng FE `ability-rule` có thể unblock cả 6+ module** (suggestion từ Section 8.1 permission report).

**Evidence:**
- [screenshots/ct-206-qtht-list.png](screenshots/ct-206-qtht-list.png) — QTHT list với `+ Thêm Chương trình` button hiển thị

---

### 5.4 CT-207: TVV không thấy menu — **PARTIAL**

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `tvv_user` | Success | URL `/403` (TVV no dashboard) ✅ | PASS |
| 2 | Check sidebar menu CT HTPLDN | Menu KHÔNG visible (ẩn hoàn toàn) | Menu visible nhưng `disabled:true` (grayed out) ⚠️ | PARTIAL |

**Notes:** Cosmetic issue. Pattern lặp M8.3 (TVCS) — menu hiển thị disabled thay vì ẩn. Severity Minor.

**Evidence:**
- [screenshots/ct-207-tvv-menu.png](screenshots/ct-207-tvv-menu.png) — Sidebar với menu CT HTPLDN xám

---

## 6. Test Data Used

### 6.1 Tài khoản test

| Username | Role | donViId | capDonVi | Dùng cho TC |
|----------|------|---------|----------|-------------|
| canbo_tw | CB_TW | 00000000-0000-4000-8000-000000000001 | DP (sic) | CT-001, CT-002, CT-022, CT-101-103 |
| canbo_bn | CB_BN | 00000000...0001 (same!) | DP | CT-002 (BN scope) |
| canbo_tinh | CB_DP | 00000000...0001 (same!) | DP | CT-002 (DP scope) |
| qtht_tw | QTHT | — | TW | CT-206 |
| tvv_user | TVV | — | Portal | CT-207 |

**⚠️ BUG-TEST-ACCOUNT-001:** 3 account CB cùng donVi. Scope isolation (CT-201) không verify được — cần seed account CB_NV ở donVi BN + DP khác biệt.

### 6.2 Data tạo trong test

| ID / Mã | Tên | Status | Purpose |
|---------|-----|--------|---------|
| CT-20260420-0001 | CT HTPLDN TW 2026 - Hỗ trợ pháp lý DN xuất khẩu | DU_THAO | CT-001, CT-022 (search "DA_CONG_BO" không match this) |
| CT-20260420-0002 | CT HTPLDN BN 2026 - Đầu tư nước ngoài | DU_THAO (nguoiTaoId canbo_bn) | scope test (không discriminate được do BUG-TEST-ACCOUNT) |
| CT-20260420-0003 | CT HTPLDN DP 2026 - DN địa phương Hà Nội | DU_THAO (nguoiTaoId canbo_tinh) | scope test |
| CT-20260420-0004 | CT HTPLDN TW - Path TAM_DUNG | DU_THAO | baseline |
| CT-20260420-0005 | CT HTPLDN TW - Path HOAN_THANH | DU_THAO | baseline |
| **CT-20260420-0006** | CT HTPLDN TW - Path HUY | **DU_THAO + is_deleted=true** | CT-005 BUG evidence (soft-delete leak) |
| CT-20260420-0007 | CT HTPLDN TW - Path DA_CONG_BO | DU_THAO | CT-022 search match |

---

## 7. Environment Notes

- **API endpoint pattern:** `/api/v1/chuong-trinh-htpls` + `/api/v1/chuong-trinh-htpls/{id}/{action}`
- **Auth flow:** JWT Bearer + OTP email (bypass `666666`)
- **Token TTL:** 15 phút (JWT expires)
- **Frontend:** React + Vite (dev mode — bundle 3.6MB+2.6MB+1.7MB → chậm) + Ant Design + CASL + Zustand
- **Backend:** NestJS + PostgreSQL
- **Optimistic locking:** PATCH/DELETE cần `version` field
- **HATEOAS:** GET response trả `_links` với endpoints (submit/cancel/update/delete)
- **Known limitations:**
  - Browse harness session reset giữa bash invocations → dùng atomic chain
  - Chain >60s timeout → phải split với cookie bridging (nhưng auth ở sessionStorage không bridge được)
  - Vite dev mode chậm → nhiều timeout trong functional test

---

## 8. Recommendations

### 8.1 Must Fix Before Release

1. **BUG-CT-BE-001 Critical P0** (Section A BE): Soft-delete filter trong list query. Sửa BE service `ChuongTrinhHtplService.findAll()` thêm `WHERE is_deleted = false`. ETA: 30 phút.
2. **BUG-BE-CT-001 Critical P0** (Section A BE): Thêm permissions `submit/cancel/activate/complete/pause/resume/publish/unpublish_chuong_trinh_htpl` vào seed + CASL ability mapping. ETA: 1-2h.
3. **BUG-CT-FE-003 Major P1** (Section B FE): Build Story 13.6 — Tab Đợt báo cáo với table + info-box deadline TT17/2025 + nút Tạo đợt mới. ETA: 2-3 ngày.
4. **BUG-CT-PERM-001 Major P1** (Section B FE): Ability rule cho QTHT — ẩn `+ Thêm Chương trình` button với role QTHT. 1 line fix. ETA: 30 phút.

### 8.2 Should Fix Before Round 3

5. **BUG-CT-UI-002 Medium** (Section C UI): Fix Antd locale config — tiếng Trung upload button
6. **BUG-CT-UI-005 Minor** (Section C UI): `InputNumber min={0}` cho field Ngân sách
7. **BUG-TEST-ACCOUNT-001 Medium** (Section D Test Data): Seed account CB_NV_BN + CB_NV_DP ở donVi thực sự khác TW

### 8.3 Nice to have

8. **BUG-CT-UI-001 Minor**: Fill field `Đơn vị` từ user session
9. **BUG-CT-UI-006 Minor**: Ẩn hoàn toàn menu cho role không có quyền
10. **OBS-CT-02**: Add 2 state TAM_DUNG + HUY vào thanh tiến trình (hoặc document rõ why happy-path only)

### 8.4 Re-test plan cho Round 3

Sau khi BE fix BUG-BE-CT-001 + BUG-CT-BE-001 + BUG-CT-FE-003:
- Chạy full 42 TC (không còn BLOCKED)
- Đặc biệt focus Nhóm 3a + 3b (24 TC workflow)
- Test lifecycle SM-KH-CTHTPL 8 state + SM-DOT-BC 6 state + auto-transition kép (CT-031/032)
- Test TW tổng hợp BC (CT-038) với BC từ BN + DP

---

## 9. Appendix — Pass/Fail heatmap

| Group | Total | PASS | FAIL | PARTIAL | BLOCKED | Pass rate |
|-------|-------|------|------|---------|---------|-----------|
| Nhóm 1 Happy CRUD | 7 | 5 | 1 | 1 | 0 | 71% |
| Nhóm 2 Negative | 5 | 2 | 0 | 1 | 2 | 40% |
| Nhóm 4 Auth UI | 2 | 0 | 1 | 1 | 0 | 0% |
| **Scope Lệnh 4** | **14** | **7** | **2** | **3** | **2** | **50%** |

Scope còn lại (ngoài Lệnh 4 này):
- Nhóm 3a Workflow CT (13 TC) — 100% BLOCKED bởi BUG-BE-CT-001
- Nhóm 3b Workflow BC (11 TC) — 100% BLOCKED bởi BUG-BE-CT-001 + BUG-CT-FE-003
- Nhóm 4 còn lại (6 TC workflow-dep) — BLOCKED
- Nhóm 5 Cross-module (6 TC) — BLOCKED chained
- Nhóm 6 Tiện ích (2 TC) — BLOCKED chained

**Grand total spec:** 42 TC. Tested: 12. Runnable sau khi fix 4 critical bugs: ~42. ETA Round 3: ~4-5h (full retest).

---

*Report v1.0 | 2026-04-20 | Functional Test CT HTPLDN — Lệnh 4, 14 TC scope, 7 PASS + 2 FAIL + 3 PARTIAL + 2 BLOCKED. 10 findings total (2 Critical + 2 Major + 2 Medium + 3 Minor + 1 Obs). Module dùng được cho CRUD cơ bản, lifecycle 100% BLOCKED, chờ BE/FE fix trước retest.*
