# Functional Test Report — Hồ sơ Doanh nghiệp (FR-V.III-01)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Hồ sơ Doanh nghiệp (Module M1, FR-V.III-01) |
| **SRS Reference** | [`srs-fr-07-doanh-nghiep.md`](../../../input/srs-v3/srs-fr-07-doanh-nghiep.md) — FR-V.III-01 (UC81) |
| **UC Coverage** | UC 81 (Quản lý DN), UC 82 (Tìm kiếm) partial |
| **Người test** | QA Automation (Claude Code Opus 4.7 + Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) |
| **Test Method** | UI-based via MCP + Network inspection |
| **Primary Account** | `canbo_tw_5` / `Test@1234` — CB_NV, cấp TW |
| **Round** | Round 1 |
| **Rule log bug** | **Chỉ log bug khi có SRS reference cụ thể.** Quan sát không map được clause SRS → ghi ở section "Observations" của bug-report, không log thành bug formal. |
| **Tài liệu tham chiếu** | [flow-module.md §1 M1 DN](../../../input/flow-module.md#L29-L37), [seed-fixture.yaml dn_variants](../../../input/data/seed-fixture.yaml#L63-L138), [bug-report-data-doanh-nghiep.md](bug-report-data-doanh-nghiep.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 11 (6 fixture-driven + 5 exploratory based on SRS spec) |
| **TC đã test / Tổng TC** | 11/11 (100%) |
| **Passed** | 8 |
| **Failed** | 2 |
| **Blocked** | 0 |
| **Partial** | 1 |
| **Overall Pass Rate** | **72.7%** (8/11, PARTIAL không tính PASS) |
| **P0 Pass Rate** | 75% (6/8 P0 tested) |
| **Bugs Found (SRS-ref)** | 7 (1 Critical, 3 Major, 1 Medium, 2 Minor) |
| **Observations (out-of-SRS)** | 3 (xem `bug-report-data-doanh-nghiep.md` §Observations) |
| **Health Score** | 58/100 |
| **Start Time** | 09:26 (UTC+7) |
| **End Time** | 10:05 (UTC+7) |
| **Total Duration** | ~39 phút |
| **Browse Status** | OK (MCP — 0 crash qua 11 TC) |

### Pass Rate breakdown theo Type (để tổng hợp multi-module)

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | **Pass Rate** |
|------|-------|----------|------|---------|------|---------------|
| **Happy** | Luồng chính — seed fixture + Edit thành công | 7 (TC-001..006, 011) | 6 | 1 | 0 | **85.7%** |
| **Negative** | Validate input sai (MST dup, MST rỗng) | 2 (TC-007, 008) | 2 | 0 | 0 | **100%** |
| **Validation** | Business rule runtime (auto-suggest quy mô) | 1 (TC-009) | 0 | 0 | 1 | **0%** |
| **Workflow** | State transition (soft delete) | 1 (TC-010) | 0 | 0 | 1 | **0%** |
| **Total** | | **11** | **8** | **1** | **2** | **72.7%** |

→ Khi tổng hợp báo cáo multi-module, dùng dòng "Happy" làm **Happy-path Pass Rate = 85.7%** (6/7). Đây là chỉ số quan trọng cho khả năng seed data cho các module downstream (M3 Vụ việc, M10 TV CS, etc. đọc DN từ module này).

### Verdict: **FAIL**

1 Critical bug BE (quy mô NĐ39 sai — BR-CALC-05) + 3 Major bug data integrity/spec-compliance (soft delete no-op, auto-suggest thiếu, leak param API). Module không sẵn sàng release; cần ít nhất 4 P0 fix trước khi retest.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| TC-001 | FR-V.III-01, UC-81, BR-DATA-04 | Tạo DN Alpha (Hà Nội, Nhỏ, 50 LĐ / 3 tỷ) | Happy | P0 | **PASS** | — | DN-HNI-0010 OK, auto-gen mã `DN-{TINH}-{SEQ}` đúng |
| TC-002 | FR-V.III-01 | Tạo DN Beta (Hà Nội, Siêu nhỏ, 8 LĐ / 2 tỷ) | Happy | P0 | **PASS** | — | DN-HNI-0011 OK |
| TC-003 | FR-V.III-01, BR-CALC-05 | Tạo DN Gamma (Hải Phòng, Vừa, 200 LĐ / 80 tỷ) | Happy | P0 | **PASS** | — | DN-HPG-0002 OK, quy mô Vừa accepted |
| TC-004 | FR-V.III-01 | Tạo DN Delta (Hải Phòng, Nhỏ, 15 LĐ / 5 tỷ) | Happy | P0 | **PASS** | — | DN-HPG-0003 OK |
| TC-005 | FR-V.III-01, BR-CALC-05, E3 WRN-DN-01 | Tạo DN Epsilon (Đà Nẵng, Vừa, 100 LĐ / 50 tỷ) | Happy + Validation | P0 | **PARTIAL** | BUG-DN-001, 002 | BE tính quy mô 100 LĐ thành `NHO` → reject `VUA`. Workaround lưu với Quy mô SAI so fixture |
| TC-006 | FR-V.III-01 | Tạo DN Zeta (Đà Nẵng, Siêu nhỏ, 3 LĐ / 1 tỷ) | Happy | P1 | **PASS** | — | DN-DNG-0003 OK |
| TC-007 | FR-V.III-01 §Error E2 ERR-DN-02 | MST duplicate | Negative | P0 | **PASS** | — | Inline error `"Mã số thuế đã tồn tại trong hệ thống"` + response 409 đúng spec |
| TC-008 | FR-V.III-01 §Error E1 ERR-DN-01 | Submit với MST rỗng | Negative | P0 | **PASS** | — | Inline error `"Mã số thuế là bắt buộc"` |
| TC-009 | SCR-V.III-02 §Quy tắc tương tác | Auto-suggest quy mô khi thay đổi LĐ + DT | Validation | P1 | **FAIL** | BUG-DN-004, 006 | FE không thay đổi Quy mô khi LĐ = 500 (×50 Siêu nhỏ). Chỉ BE validate on submit |
| TC-010 | FR-V.III-01 §Xóa, BR-DATA-01 | Soft delete DN không có VV (Zeta) | Workflow | P0 | **FAIL** | BUG-DN-003 | Click `[Xóa]` trong Popconfirm KHÔNG gửi DELETE request |
| TC-011 | FR-V.III-01 §Chỉnh sửa, BR-DATA-05 | Edit DN Alpha (cập nhật chức vụ người đại diện) | Happy | P1 | **PASS** | — | PATCH `/doanh-nghieps/{id}` → 200. Modal "Xác nhận thay đổi" diff view đáp ứng BR-DATA-05 tốt |

---

## 3. Bug Report (tóm tắt inline)

Chi tiết đầy đủ: [bug-report-data-doanh-nghiep.md](bug-report-data-doanh-nghiep.md).

| Bug ID | Severity | Priority | SRS Reference | Title |
|--------|----------|----------|---------------|-------|
| BUG-DN-001 | Critical | P0 | `BR-CALC-05` + FR-V.III-01 §Processing Thêm mới Bước 5 | BE tính quy mô DNNVV NĐ39/2018 SAI |
| BUG-DN-002 | Major | P0 | FR-V.III-01 §Error Handling E3 WRN-DN-01 | Error leak param API `confirmQuyMoMismatch=true` + severity sai |
| BUG-DN-003 | Major | P0 | FR-V.III-01 §Processing Xóa + BR-DATA-01 + SCR-V.III-01 row 23 | Soft delete KHÔNG gửi DELETE request |
| BUG-DN-004 | Major | P1 | SCR-V.III-02 §Quy tắc tương tác | Auto-suggest quy mô không implement FE |
| BUG-DN-005 | Medium | P1 | SCR-V.III-02 Thành phần row 9, 22, 28 | Form thiếu 3 field: Ngày cấp ĐKKD, Fax, File đính kèm (**regression**) |
| BUG-DN-006 | Minor | P2 | FR-V.III-01 §Error E3 WRN-DN-01 (WARNING) | Không có WRN-DN-01 soft warning khi quy mô lệch |
| BUG-DN-007 | Minor | P3 | SCR-V.III-02 Thành phần row 23 (`checkbox`) | `Nữ làm chủ` render là switch thay vì checkbox |

---

## 4. Detailed Test Results

### 4.1 TC-001: Tạo DN Alpha (Happy path — Hà Nội, TNHH, Nhỏ)

**Pre-conditions:**
- `canbo_tw_5` login thành công, landing dashboard.
- Danh mục master (`LOAI_DOANH_NGHIEP`, `TINH_THANH`) đã seed.
- Danh sách DN ban đầu có 10 mục.

**Test Data (`seed-fixture.yaml#dn_variants[1]`):**
```yaml
mst: "0100100101"
ten: "Công ty TNHH Kiểm thử Alpha"
dia_chi: "Số 1 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội"
tinh: "Hà Nội"
nguoi_dai_dien: "Nguyễn Văn Alpha"
so_lao_dong: 50
doanh_thu_ty: 3  # = 3_000_000_000
quy_mo_expected: "Nhỏ"
```

**Test Steps:**

| Step | Action | Expected (SRS) | Actual | Status |
|------|--------|----------------|--------|--------|
| 1 | Click `[+ Thêm mới]` trên SCR-V.III-01 | URL `/doanh-nghiep/tao-moi`, form SCR-V.III-02 render | OK | PASS |
| 2 | Fill 4 text field (Tên, MST, Địa chỉ, Người ĐD) | Giá trị persist | OK | PASS |
| 3 | Chọn Loại DN, Quy mô = "Nhỏ", Ngành, Tỉnh = "Hà Nội" | OK | OK | PASS |
| 4 | Nhập LĐ = 50, Doanh thu = 3,000,000,000 | Spinbutton accept | OK | PASS |
| 5 | Click `[Lưu]` | `POST /api/v1/doanh-nghieps [201]`, redirect detail | 201 Created | PASS |
| 6 | Verify detail page | Mã DN = `DN-{TINH}-{SEQ}` theo BR-DATA-04 | `DN-HNI-0010` (HNI=Hà Nội, SEQ=10) | PASS |
| 7 | Back to list, verify Alpha ở đầu table | Counter 11/11, Alpha top | OK | PASS |

**Notes:** Evidence: [tc-001-alpha-created.png](image/tc-001-alpha-created.png).

---

### 4.2 TC-005: Tạo DN Epsilon — PARTIAL (BE bug quy mô)

**Test Data (`dn_variants[5]`):**
```yaml
mst: "0300300305"
ten: "Công ty Cổ phần Epsilon IT"
tinh: "Đà Nẵng"
so_lao_dong: 100
doanh_thu_ty: 50  # = 50_000_000_000
quy_mo_expected: "Vừa"
```

**Test Steps:**

| Step | Action | Expected (SRS BR-CALC-05 + NĐ39 §1) | Actual | Status |
|------|--------|-------------------------------------|--------|--------|
| 1..4 | Fill form với Quy mô = **Vừa**, LĐ = 100, DT = 50 tỷ | Form accept | OK | PASS |
| 5 | Click `[Lưu]` | POST 201 (100 LĐ vượt ngưỡng Nhỏ=50 → Vừa đúng NĐ39) | **POST 400** — `"Quy mô VUA không khớp... (tính được: NHO). Gửi lại với confirmQuyMoMismatch=true"` | **FAIL** (BUG-DN-001, 002) |
| 6 | Workaround: đổi Quy mô = **Nhỏ**, click Lưu | POST 201 | OK — DN-DNG-0002 tạo với Quy mô SAI | PARTIAL |

---

### 4.3 TC-007: MST duplicate — PASS

**Test Steps:**

| Step | Action | Expected (SRS E2 ERR-DN-02) | Actual | Status |
|------|--------|------------------------------|--------|--------|
| 1 | Fill MST = `"0100100101"` (của Alpha) | — | OK | PASS |
| 2 | Click `[Lưu]` | POST 409 + message `"Mã số thuế đã tồn tại"` | POST 409, inline error `"Mã số thuế đã tồn tại trong hệ thống"` | PASS |

---

### 4.4 TC-008: Required MST empty — PASS

| Step | Action | Expected (SRS Inputs row 3 `Y Bắt buộc` + E1 ERR-DN-01) | Actual | Status |
|------|--------|---------------------------------------------------------|--------|--------|
| 1 | Clear MST, click `[Lưu]` | Inline error "là bắt buộc" | `"Mã số thuế là bắt buộc"` | PASS |

---

### 4.5 TC-009: Auto-suggest quy mô — FAIL

| Step | Action | Expected (SRS SCR-V.III-02 §Quy tắc tương tác) | Actual | Status |
|------|--------|------------------------------------------------|--------|--------|
| 1 | Chọn Quy mô = Siêu nhỏ ban đầu | OK | OK | PASS |
| 2 | Thay đổi LĐ = 500, DT = 100 tỷ | FE auto-update Quy mô hoặc hiển thị warning inline | Quy mô vẫn "Siêu nhỏ", không warning | **FAIL** (BUG-DN-004) |

---

### 4.6 TC-010: Soft delete — FAIL

| Step | Action | Expected (SRS §Processing Xóa + BR-DATA-01) | Actual | Status |
|------|--------|----------------------------------------------|--------|--------|
| 1 | Click icon delete của DN-DNG-0003 Zeta | Popconfirm hiện | OK | PASS |
| 2 | Click `[Xóa]` confirm | `DELETE /api/v1/doanh-nghieps/{id} → 200`, list refresh | **KHÔNG có DELETE request**, counter vẫn 16 | **FAIL** (BUG-DN-003) |

---

### 4.7 TC-011: Edit DN — PASS

| Step | Action | Expected (SRS §Chỉnh sửa + BR-DATA-05) | Actual | Status |
|------|--------|----------------------------------------|--------|--------|
| 1 | Click icon edit của DN-HNI-0010 Alpha | URL `/chinh-sua`, form pre-fill, Lưu disabled | OK | PASS |
| 2 | Đổi Chức vụ = "Giám đốc điều hành" | Lưu enabled | OK | PASS |
| 3 | Click `[Lưu]` | Modal diff cũ→mới (BR-DATA-05 audit) | Modal `"Xác nhận thay đổi"` với bảng Trường/Giá trị cũ/mới | PASS |
| 4 | Click `[Lưu thay đổi]` | `PATCH /doanh-nghieps/{id} → 200` | PATCH 200 (reqid=171) | PASS |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Cục BTTP | TW | TC-001 → TC-011 |

### 5.2 Data tạo trong test

| Mã DN | Tên | MST | Purpose | Cleanup? |
|-------|-----|-----|---------|----------|
| DN-HNI-0010 | Công ty TNHH Kiểm thử Alpha | 0100100101 | TC-001 fixture + TC-011 edit target | Keep |
| DN-HNI-0011 | Công ty Cổ phần Beta | 0100100102 | TC-002 fixture | Keep |
| DN-HPG-0002 | Công ty TNHH Gamma Sản xuất | 0200200203 | TC-003 fixture (quy mô Vừa OK) | Keep |
| DN-HPG-0003 | Doanh nghiệp Tư nhân Delta | 0200200204 | TC-004 fixture | Keep |
| DN-DNG-0002 | Công ty Cổ phần Epsilon IT | 0300300305 | TC-005 — **quy mô lưu SAI** (Nhỏ vs fixture Vừa) | **Keep as evidence BUG-DN-001** |
| DN-DNG-0003 | Công ty TNHH Zeta Giáo dục | 0300300306 | TC-006 + TC-010 delete target | **Keep as evidence BUG-DN-003** |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/doanh-nghieps{,/:id}` (GET list + POST create + GET detail + PATCH edit).
- **DELETE endpoint:** Chưa verify có hay không — FE không call → không có bằng chứng BE đã implement.
- **Auth flow:** JWT + OTP email (bypass 666666). `sessionStorage.auth-store` persist.
- **Frontend stack:** React + Vite + Ant Design (Form validation, Select, InputNumber, Popconfirm).
- **Backend:** NestJS (observed response codes 201, 400, 409).

---

## 7. Recommendations

### Must Fix (Before Release) — P0

1. **BUG-DN-001 (Critical):** Sửa `calculateQuyMo()` BE dùng AND-logic đúng NĐ39/2018 (BR-CALC-05). Unit test ma trận `{LĐ, DT}` × 3 tier.
2. **BUG-DN-002 (Major):** BE tuân thủ SRS E3 WRN-DN-01 format (message chuẩn, severity=WARNING, confirmation flow). Không leak tên param API ra UI.
3. **BUG-DN-003 (Major):** Wire `onConfirm` handler của Popconfirm để call `DELETE /doanh-nghieps/{id}` theo §Processing Xóa. E2E test: tạo → delete → assert list count -1.

### Should Fix — P1

4. **BUG-DN-004 (Major):** Implement auto-suggest quy mô FE theo SCR-V.III-02 §Quy tắc tương tác.
5. **BUG-DN-005 (Medium):** Bổ sung 3 field theo SCR-V.III-02: `ngay_cap_dkkd` (row 9), `fax` (row 22), `file_dinh_kem` (row 28). **Regression** — memory `qa_htpldn_qldn_ui_round1` (2026-04-22) đã log, dev chưa fix.

### Nice to Have — P2/P3

6. **BUG-DN-006 (Minor):** WRN-DN-01 soft warning inline khi quy mô lệch (merge fix với BUG-DN-002, 004).
7. **BUG-DN-007 (Minor):** Đổi `Nữ làm chủ` từ switch sang checkbox theo SCR-V.III-02 row 23.

### Observations ngoài SRS (xem bug-report §Observations)

3 quan sát không có SRS reference trực tiếp — cần BA confirm + bổ sung SRS clause nếu muốn log thành bug: (1) dropdown Loại DN enum thiếu TNHH/CP/DNTN (tier_0 fixture); (2) doanh thu precision loss ≥ 50 tỷ; (3) tab detail thiếu "Hồ sơ Chi trả" (đã log round UI 2026-04-22).

### Process recommendation

- **Round 2:** Retest sau dev fix P0 + P1 (BUG-DN-001..005). Giữ 6 DN fixture hiện tại làm regression baseline. DN-DNG-0002 quy mô sai và DN-DNG-0003 không xóa được là evidence quan trọng.
- **Test ERR-DN-03** (xóa DN có VV đang xử lý): cần seed 1 VV prerequisite. Hiện BLOCKED vì module VV chưa test.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Result |
|--------|----------|---------|--------------|--------|
| GET | `/api/v1/doanh-nghieps?page=1&pageSize=20` | List | TC-001..010 | 200 OK |
| POST | `/api/v1/doanh-nghieps` | Create | TC-001..007 | 201 (6 lần), 400 (TC-005 initial), 409 (TC-007) |
| GET | `/api/v1/doanh-nghieps/{id}` | Detail | TC-001..006, TC-011 | 200 OK |
| PATCH | `/api/v1/doanh-nghieps/{id}` | Update | TC-011 | 200 OK |
| DELETE | `/api/v1/doanh-nghieps/{id}` | Soft delete | TC-010 | **Không được gọi** — BUG-DN-003 |
| GET | `/api/v1/danh-muc/tree?loaiDanhMuc=LOAI_DOANH_NGHIEP` | Dropdown loại DN | — | 200/304 |
| GET | `/api/v1/danh-muc/tree?loaiDanhMuc=TINH_THANH` | Dropdown tỉnh thành | — | 200/304 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [00-list-page.png](image/00-list-page.png) | Danh sách DN ban đầu (10 items) | Pre-test |
| [tc-001-alpha-created.png](image/tc-001-alpha-created.png) | Chi tiết DN-HNI-0010 Alpha | TC-001 PASS |
| [bug-quy-mo-validation-error.png](image/bug-quy-mo-validation-error.png) | Error `confirmQuyMoMismatch=true` | TC-005 (BUG-001, 002) |
| [tc-007-mst-duplicate-error.png](image/tc-007-mst-duplicate-error.png) | `"Mã số thuế đã tồn tại trong hệ thống"` | TC-007 PASS |
| [tc-009-no-auto-suggest.png](image/tc-009-no-auto-suggest.png) | Quy mô Siêu nhỏ dù LĐ=500, DT=100 tỷ | TC-009 FAIL |
| [tc-010-delete-no-api-call.png](image/tc-010-delete-no-api-call.png) | Zeta vẫn còn sau click Xóa | TC-010 FAIL |
| [tc-final-list-16-items.png](image/tc-final-list-16-items.png) | 16 DN cuối session | Final state |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-V.III-01 §Processing Thêm mới Bước 1-4 | TC-001..006 | PASS (5/6) |
| FR-V.III-01 §Processing Thêm mới Bước 5 (BR-CALC-05) | TC-005 | **FAIL** — BUG-DN-001 |
| FR-V.III-01 §Processing Thêm mới Bước 6-7 (BR-DATA-03, BR-DATA-04, BR-DATA-05) | TC-001..006 | PASS |
| FR-V.III-01 §Processing Chỉnh sửa (BR-DATA-05 audit) | TC-011 | PASS — modal diff view đáp ứng audit |
| FR-V.III-01 §Processing Xóa (BR-DATA-01) | TC-010 | **FAIL** — BUG-DN-003 |
| FR-V.III-01 §Error E1 ERR-DN-01 | TC-008 | PASS |
| FR-V.III-01 §Error E2 ERR-DN-02 | TC-007 | PASS |
| FR-V.III-01 §Error E3 WRN-DN-01 | TC-005, TC-009 | **FAIL** — BUG-DN-002, 006 |
| FR-V.III-01 §Error E4 ERR-DN-03 | — | **NOT TESTED** — cần VV prerequisite |
| BR-DATA-04 Auto-gen mã | TC-001..006 | PASS — prefix HNI/HPG/DNG đúng |
| SCR-V.III-02 Thành phần row 9 (ngay_cap_dkkd) | TC-001..006 | **FAIL** — BUG-DN-005 (thiếu field) |
| SCR-V.III-02 Thành phần row 22 (fax) | TC-001..006 | **FAIL** — BUG-DN-005 (thiếu field) |
| SCR-V.III-02 Thành phần row 23 (checkbox) | TC-001..006 | **FAIL** — BUG-DN-007 (switch thay vì checkbox) |
| SCR-V.III-02 Thành phần row 28 (file_dinh_kem) | TC-001..006 | **FAIL** — BUG-DN-005 (thiếu field) |
| SCR-V.III-02 §Quy tắc tương tác (auto-suggest) | TC-009 | **FAIL** — BUG-DN-004 |

### D — Coverage Gap (test tiếp round 2)

- **TC ERR-DN-03** (xóa DN có VV đang xử lý): cần seed 1 VV trước, gán vào DN test, rồi click Xóa → expect `"Không thể xóa DN đang có vụ việc xử lý"`. BLOCKED.
- **UC82 Tìm kiếm đầy đủ**: Filter theo quy mô, tỉnh, ngành, tu_ngay/den_ngay — chưa test combination.
- **FR-V.III-NEW-01 Import Excel (SCR-V.III-03)**: Nút Import không có trong toolbar list page (đã log ở round UI trước).
- **Permission matrix**: Chỉ test với CB_NV cấp TW. Chưa test QTHT, CB_PD, cấp BN/ĐP (scope filter `don_vi_id` — BR-AUTH-08).

---

*Report generated: 2026-04-23 10:05 (UTC+7) | QA Automation via Claude Code Opus 4.7 + Chrome DevTools MCP*
