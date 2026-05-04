# Functional Test Report — Chương trình Đào tạo (M6.1-parent)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Chương trình Đào tạo (M6.1-parent, entity CHUONG_TRINH_DAO_TAO) |
| **SRS Reference** | srs-fr-03-dao-tao.md — FR-III-01 (UC20), SCR-III-01 |
| **UC Coverage** | UC20 (CRUD CTDT cha) |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (dev enable) |
| **Test Method** | UI-based (Chrome DevTools MCP) |
| **Primary Account** | canbo_tw_5 / Test@1234 — CB_NV, TW |
| **Round** | Round 1 (data seeding) |
| **Tài liệu tham chiếu** | [seed-fixture.yaml M6.1-parent L551-609](../../../input/data/seed-fixture.yaml), [bug-report-ctdt.md](bug-report-ctdt.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 4 CREATE (M6.1-parent fixture 4 variants) |
| **TC đã test / Tổng TC** | 4/4 (100%) |
| **Passed** | 4 |
| **Failed** | 0 |
| **Blocked** | 0 |
| **Partial** | 0 |
| **Overall Pass Rate** | **100% (4/4)** |
| **P0 Pass Rate** | 100% (4/4 P0) |
| **Bugs Found (SRS-ref)** | 3 (0 Critical, 1 Major, 1 Medium, 1 Minor) |
| **Observations (out-of-SRS)** | 6 (xem [bug-report-ctdt.md §Observations](bug-report-ctdt.md#observations--ngoài-srs-không-log-bug)) |
| **Health Score** | 75/100 (CREATE happy path 100%, list display bug -15, spec conflict -10) |
| **Start Time** | 17:09 (UTC+7) |
| **End Time** | 17:22 (UTC+7) |
| **Total Duration** | ~13 phút (budget 30 phút) |
| **Browse Status** | OK (0 crash, 0 console error) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | CREATE 4 CTDT từ fixture | 4 | 4 | 0 | 0 | 0 | **100%** |
| **Total** | | **4** | **4** | **0** | **0** | **0** | **100%** |

→ **Happy-path Pass Rate = 4/4 (100%)** — seed data đủ cho downstream module M6.1 (Khóa học) test tiếp.

### Verdict: **CONDITIONAL PASS**

CREATE 4/4 record thành công với 6 field UI support. Nhưng phát hiện 1 Major bug (list thiếu 3 cột theo SRS §Outputs) + mâu thuẫn giữa SRS §Inputs và §Outputs cần BA clarify. Seed data usable cho dependent module M6.1 Khóa học, nhưng UI list view cần fix trước release.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| CTDT-001 | FR-III-01 §Processing Thêm mới | CREATE CTDT-BTP-TW-2026-0001 (Pháp luật cho DN nhỏ, KDTM, 800M, 6 khóa) | Happy | P0 | **PASS** | — | Mã auto-gen đúng pattern `CTDT-{DON_VI}-{YYYY}-{SEQ}`; tất cả 6 field verified post-create |
| CTDT-002 | FR-III-01 §Processing Thêm mới | CREATE CTDT-BTP-TW-2026-0002 (ATLĐ xây dựng, Lao động, 500M, 3 khóa) | Happy | P0 | **PASS** | — | Same — verified OK |
| CTDT-003 | FR-III-01 §Processing Thêm mới | CREATE CTDT-BTP-TW-2026-0003 (SHTT startup, SHTT, 300M, 2 khóa) | Happy | P0 | **PASS** | — | Same — verified OK |
| CTDT-004 | FR-III-01 §Processing Thêm mới | CREATE CTDT-BTP-TW-2026-0004 (Luật đất đai, Đất đai, 400M, 2 khóa) | Happy | P0 | **PASS** | — | Same — verified OK |

---

## 3. Bug Report

> Chi tiết đầy đủ: [bug-report-ctdt.md](bug-report-ctdt.md)

### BUG-CTDT-001 — Major — Danh sách CTDT thiếu 3 cột `hinh_thuc`, `ngay_bat_dau`, `ngay_ket_thuc`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | CTDT-001..004 |
| **Status** | Open |
| **Assignee** | FE Team (pending BA clarify SRS conflict) |

**Mô tả:** Table list CTDT chỉ 7 cột — thiếu `hinh_thuc`, `ngay_bat_dau`, `ngay_ket_thuc` theo SRS §Outputs row 4, 6, 7.

**Impact:** User không filter/sort theo hình thức hoặc thời gian từ list view. Nghi vấn mâu thuẫn SRS §Inputs (8 rows không có 3 field này) vs §Outputs (10 rows có).

---

### BUG-CTDT-002 — Medium — Cột "Lĩnh vực" hiển thị "-" cho 9/9 record

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P2 |
| **TC Reference** | CTDT-001..004 + 5 pre-existing |
| **Status** | Open |
| **Assignee** | Backend Team (hoặc FE mapping) |

**Mô tả:** 100% record hiển thị cột Lĩnh vực = "-" thay vì tên lĩnh vực đã gán (Kinh doanh thương mại, Lao động, SHTT, Đất đai). Detail page render đúng → bug chỉ ở list response.

**Root Cause (Suggested):** BE response list missing `linh_vuc_ten` (chỉ trả `linh_vuc_id` UUID).

---

### BUG-CTDT-003 — Minor — Progress stepper detail page thiếu state `HUY`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P3 |
| **TC Reference** | CTDT-001..004 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Detail stepper chỉ render 5 state (thiếu HUY) dù SRS §3.4.3.19 define 6-enum và list filter tab có tab "Hủy".

---

## 4. Detailed Test Results

### 4.1 CTDT-001: CREATE "CTĐT 2026 - Pháp luật cho DN nhỏ"

**Pre-conditions:**
- User canbo_tw_5 đã login (role CB_NV, cấp TW)
- User có quyền "Quản lý đào tạo" (UC115) — verified via landing dashboard + sidebar "Quản lý đào tạo, tập huấn" accessible
- DANH_MUC lĩnh vực pháp luật đã seed (10 options dropdown)

**Test Data (from fixture `chuong_trinh_dao_tao_variants[1]`):**
```yaml
ten_chuong_trinh: "CTĐT 2026 - Pháp luật cho DN nhỏ"
linh_vuc_id: "DOANH_NGHIEP"    # → mapped to "Kinh doanh thương mại" (closest match)
ngan_sach_du_kien: 800000000
so_luong_khoa: 6
muc_tieu: "Phổ biến kiến thức pháp luật kinh doanh, thuế, HĐ cho DN SME"
mo_ta: "Chương trình đào tạo tổng hợp về pháp luật DN, thuế, hợp đồng, lao động cho DN SME"
# Fixture thừa (UI không support): hinh_thuc, thoi_gian_bat_dau, thoi_gian_ket_thuc, doi_tuong, file_dinh_kem
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Sidebar → Quản lý đào tạo, tập huấn → Chương trình đào tạo | URL `/dao-tao/chuong-trinh/danh-sach`, table 5 record pre-existing | URL match, table 5 row | **PASS** |
| 2 | Click "Thêm mới" | Navigate `/dao-tao/chuong-trinh/tao-moi`, form 6 editable fields + 1 disabled (Mã CTĐT) | Match | **PASS** |
| 3 | Select Lĩnh vực "Kinh doanh thương mại" | Combobox close, label "Kinh doanh thương mại" | Match | **PASS** |
| 4 | Fill Tên, Ngân sách 800M, Số khóa 6, Mục tiêu, Mô tả | Form render values đúng | Match (via snapshot verify) | **PASS** |
| 5 | Click "Tạo chương trình" | Redirect `/dao-tao/chuong-trinh/{uuid}`, stepper render state 1 (Dự thảo), Mã CTĐT auto-gen | URL = `/dao-tao/chuong-trinh/e52de325-9814-4d20-8583-312da20141be`, Mã = **CTDT-BTP-TW-2026-0001** | **PASS** |
| 6 | Quay lại list | Record mới ở đầu list, state "Dự thảo", "1-6 / 6 mục" | Match; cột Lĩnh vực "-" (→ BUG-CTDT-002) | **PASS** (với bug secondary) |

**Notes:**
- Mã pattern `CTDT-BTP-TW-2026-0001` đúng SRS §Inputs row 1 `CTDT-{DON_VI}-{YYYY}-{SEQ}` (BTP-TW = Bộ Tư pháp TW — đơn vị user canbo_tw_5).
- State default DU_THAO đúng SRS §3.4.3.19 và §Processing Thêm mới Bước 4 "Đặt trạng thái = NHAP" (SRS dùng NHAP nhưng code code label "Dự thảo" = DU_THAO — SRS §3.4.3.19 enum chuẩn).
- Fixture field `hinh_thuc`, `thoi_gian_bat_dau/ket_thuc`, `doi_tuong`, `file_dinh_kem` không applied — form UI không có input control tương ứng (xem Observation trong bug-report).

### 4.2 CTDT-002: CREATE "CTĐT 2026 - ATLĐ ngành xây dựng"

**Test Data:** `chuong_trinh_dao_tao_variants[2]`, Lĩnh vực "Lao động", 500M, 3 khóa.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1-5 | Giống CTDT-001, Lĩnh vực = "Lao động" | Mã auto CTDT-BTP-TW-2026-0002, state Dự thảo | **CTDT-BTP-TW-2026-0002**, `/dao-tao/chuong-trinh/cb46e9c2-d7e0-4c5d-ba1c-6b58d5cc2026` | **PASS** |
| 6 | Verify list | 7 items, record mới top | Match | **PASS** |

### 4.3 CTDT-003: CREATE "CTĐT 2026 - SHTT cho startup"

**Test Data:** `chuong_trinh_dao_tao_variants[3]`, Lĩnh vực "Sở hữu trí tuệ", 300M, 2 khóa.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1-5 | Same pattern, Lĩnh vực = "Sở hữu trí tuệ" | Mã CTDT-BTP-TW-2026-0003 | **CTDT-BTP-TW-2026-0003**, `/dao-tao/chuong-trinh/93da956c-79dd-4f79-8ae6-3377b0bf4890` | **PASS** |
| 6 | Verify list | 8 items | Match | **PASS** |

### 4.4 CTDT-004: CREATE "CTĐT 2025 - Luật đất đai"

**Test Data:** `chuong_trinh_dao_tao_variants[4]`, Lĩnh vực "Đất đai", 400M, 2 khóa.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1-5 | Same pattern, Lĩnh vực = "Đất đai" | Mã CTDT-BTP-TW-2026-0004 | **CTDT-BTP-TW-2026-0004**, `/dao-tao/chuong-trinh/9b3cb5b6-b9a6-420e-8e95-12b715c649c2` | **PASS** |
| 6 | Verify list | 9 items | Match | **PASS** |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Bộ Tư pháp (BTP-TW) | TW | CTDT-001..004 (tất cả) |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Lĩnh vực | Ngân sách | Số khóa | State | Purpose | Cleanup? |
|---------|-------------|----------|-----------|---------|-------|---------|----------|
| CTDT-BTP-TW-2026-0001 | CTĐT 2026 - Pháp luật cho DN nhỏ | Kinh doanh thương mại | 800.000.000 | 6 | Dự thảo | Seed M6.1 Khóa học downstream | **Keep for M6.1** |
| CTDT-BTP-TW-2026-0002 | CTĐT 2026 - ATLĐ ngành xây dựng | Lao động | 500.000.000 | 3 | Dự thảo | Seed M6.1 downstream | **Keep** |
| CTDT-BTP-TW-2026-0003 | CTĐT 2026 - SHTT cho startup | Sở hữu trí tuệ | 300.000.000 | 2 | Dự thảo | Seed M6.1 downstream | **Keep** |
| CTDT-BTP-TW-2026-0004 | CTĐT 2025 - Luật đất đai | Đất đai | 400.000.000 | 2 | Dự thảo | Seed M6.1 downstream | **Keep** |

UUID detail (to reference for downstream FK):

| Mã CTĐT | UUID |
|---------|------|
| CTDT-BTP-TW-2026-0001 | e52de325-9814-4d20-8583-312da20141be |
| CTDT-BTP-TW-2026-0002 | cb46e9c2-d7e0-4c5d-ba1c-6b58d5cc2026 |
| CTDT-BTP-TW-2026-0003 | 93da956c-79dd-4f79-8ae6-3377b0bf4890 |
| CTDT-BTP-TW-2026-0004 | 9b3cb5b6-b9a6-420e-8e95-12b715c649c2 |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/chuong-trinh-dao-tao` (inferred, not directly inspected)
- **Auth flow:** JWT + OTP email (bypass `666666`)
- **Frontend framework:** React + Vite + Ant Design
- **Test tool:** Chrome DevTools MCP (primary, per CLAUDE.md 2026-04-21 decision)
- **Browser:** Chromium 146 (headless=false, visible for manual inspection if needed)
- **Known limitations:**
  - Fixture enum `DOANH_NGHIEP` không match DANH_MUC dropdown options → manual map "Kinh doanh thương mại"
  - Form UI không expose `hinh_thuc`/dates/doi_tuong (5 fixture fields thừa)

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-CTDT-001 (Major):** BA clarify SRS §Inputs vs §Outputs mâu thuẫn; nếu chọn keep §Outputs → FE thêm 3 cột `hinh_thuc`, `ngay_bat_dau`, `ngay_ket_thuc` trong list + form Inputs bổ sung 3 field tương ứng.

### Should Fix

2. **BUG-CTDT-002 (Medium):** BE bổ sung `linh_vuc_ten` trong response list CTDT. Verify bằng `list_network_requests` response shape trong round tiếp theo.

### Nice to Have

3. **BUG-CTDT-003 (Minor):** FE stepper render 6 state bao gồm HUY (branch hoặc badge override).

### Additional Recommendations

4. **Test data:** 4 CTDT seed ở state DU_THAO đủ để unblock test M6.1 Khóa học (cần FK ctdt_id). Đề xuất round tiếp theo test workflow transition CHO_DUYET → DA_DUYET → ... trên CTDT-0001 để có test data full state cho downstream.
5. **BA sync:** Fixture seed-fixture.yaml M6.1-parent chứa 5 field không có trong SRS §Inputs CTDT (hinh_thuc, thoi_gian_bat_dau, thoi_gian_ket_thuc, doi_tuong, file_dinh_kem). BA rà soát: fixture sai hay SRS thiếu?
6. **DANH_MUC cleanup:** Admin xóa option "Thuế (updated)" test leak (déjà vu từ module khác).
7. **Round tiếp theo:** Test Negative (required validate), Edit, Delete (có khóa học thì từ chối per §Processing Xóa Bước 1-2), Xuất Excel, Search filter.

---

## 8. Appendix

### A — API Endpoints (inferred, not directly inspected)

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/chuong-trinh-dao-tao` | Create CTDT | CTDT-001..004 (via UI form submit) |
| GET | `/api/v1/chuong-trinh-dao-tao` | List CTDT | CTDT-001..004 (post-create verify) |
| GET | `/api/v1/chuong-trinh-dao-tao/{uuid}` | Detail CTDT | CTDT-001..004 (redirect after create) |
| GET | `/api/v1/danh-muc?loai=LINH_VUC_PL` | List lĩnh vực dropdown | All (combobox load) |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [01-ctdt-01-form-filled.png](image/01-ctdt-01-form-filled.png) | Form record #1 đã fill trước submit | CTDT-001 |
| [02-ctdt-01-detail.png](image/02-ctdt-01-detail.png) | Detail CTDT-BTP-TW-2026-0001 post-create | CTDT-001 |
| [03-ctdt-02-detail.png](image/03-ctdt-02-detail.png) | Detail CTDT-BTP-TW-2026-0002 | CTDT-002 |
| [04-ctdt-03-detail.png](image/04-ctdt-03-detail.png) | Detail CTDT-BTP-TW-2026-0003 | CTDT-003 |
| [05-ctdt-04-detail.png](image/05-ctdt-04-detail.png) | Detail CTDT-BTP-TW-2026-0004 | CTDT-004 |
| [06-ctdt-final-list.png](image/06-ctdt-final-list.png) | Full list 9 records (4 mới + 5 cũ) | CTDT-001..004 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-III-01 §Processing Thêm mới (UC20) | CTDT-001..004 | 4/4 PASS |
| §Inputs CTDT row 1 `ma_ctdt` auto-gen `CTDT-{DON_VI}-{YYYY}-{SEQ}` | CTDT-001..004 | PASS (pattern `CTDT-BTP-TW-2026-0001..0004` match) |
| §Inputs row 2-7 (6 field form UI) | CTDT-001..004 | PASS |
| §Inputs row 8 `file_dinh_kem` | — | NOT IMPLEMENTED UI — skip, không log bug (SRS row 8 yêu cầu N optional) |
| §Processing Bước 4 "Đặt trạng thái = NHAP" | CTDT-001..004 | PASS (default state DU_THAO / "Dự thảo" match) |
| §3.4.3.19 trang_thai enum 6 values | CTDT-003 (stepper UI) | PARTIAL — stepper 5/6 (BUG-CTDT-003) |
| §Outputs — Danh sách row 5 linh_vuc | CTDT-001..004 | FAIL (BUG-CTDT-002 — dash) |
| §Outputs — Danh sách row 4, 6, 7 (hinh_thuc, ngay_bat_dau, ngay_ket_thuc) | CTDT-001..004 | FAIL (BUG-CTDT-001 — 3 cols missing) |

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP)*
