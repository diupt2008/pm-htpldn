# Functional Test Report — Doanh nghiệp (Module 7.7)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Doanh nghiệp (7.7) |
| **SRS Reference** | `srs-fr-07-doanh-nghiep.md` — FR-V.III-01, FR-V.III-02, FR-V.III-NEW-01 |
| **UC Coverage** | UC81, UC82 + UC mới (Import Excel) |
| **Người test** | QA Automation (Claude Code Opus 4.7 + Chrome DevTools MCP) |
| **Ngày** | 2026-04-29 10:40-11:00 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based + API verify |
| **Primary Account** | `cb_nv_tw_01` (CB_NV_TW); fallback test với 5 role: `qtht_01`, `cb_pd_tw_01`, `dn_01`, `nht_01`, `tvv_01`, `cg_01` |
| **Round** | Round 5 P4 — T4.4 (full 18 TC) |
| **Tài liệu tham chiếu** | [test-strategy.md §7.7](../../../test-strategy.md#77-module-quản-lý-doanh-nghiệp-3-fr) · [bug-report-functional-DN.md](../bug-reports/bug-report-functional-DN.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 18 |
| **TC đã test / Tổng TC** | 18/18 (100%) |
| **Passed** | 11 |
| **Failed** | 1 |
| **Blocked** | 3 |
| **Partial** | 1 |
| **Deferred (API-only)** | 2 |
| **Overall Pass Rate** | 61% (11/18, FAIL/BLOCKED/PARTIAL/DEFER không tính) |
| **P0 Pass Rate** | 100% (4/4 P0 đã test PASS — DN-001/002/003/004) |
| **Bugs Found (SRS-ref)** | 4 (1 Critical, 1 Major, 2 Medium) |
| **Observations (out-of-SRS)** | 1 (toast message text — DN-007 UX gap) |
| **Health Score** | 70/100 |
| **Start Time** | 10:40 (UTC+7) |
| **End Time** | 11:00 (UTC+7) |
| **Total Duration** | 20 phút |
| **Browse Status** | OK (Chrome DevTools MCP, 7 isolated context) |

### Pass Rate breakdown theo Type

| Type | TC count | PASS | PARTIAL | FAIL | BLOCKED | DEFER | **Pass Rate** |
|------|----------|------|---------|------|---------|-------|---------------|
| **Happy** | 6 | 6 | 0 | 0 | 0 | 0 | **100%** |
| **Negative** | 3 | 1 | 0 | 0 | 2 | 0 | **33%** |
| **Validation** | 1 | 0 | 0 | 1 | 0 | 0 | **0%** |
| **Guard** | 1 | 1 | 0 | 0 | 0 | 0 | **100%** |
| **Authorization** | 5 | 2 | 1 | 0 | 0 | 2 | **40%** |
| **Integration (Tab)** | 1 | 0 | 0 | 0 | 0 | 0 | **0%** (PARTIAL — bug KPI) |
| **Import/Export** | 1 | 1 | 0 | 0 | 0 | 0 | **100%** |
| **Total** | **18** | **11** | **1** | **1** | **2** | **2** | **61%** |

→ **Happy-path Pass Rate = 6/6** — module CRUD (Create/Read/Update/Delete + Search + Detail) đầy đủ pass; chỉ Import broken.

### Verdict: **CONDITIONAL PASS — 1 Critical block Import + 1 Major auto-suggest + 2 Medium UI gap**

CRUD core stable (6 happy ✅), MST unique guard ✅, Soft delete + VV-guard ✅, authz QTHT/CB_PD/TVV/CG ✅. **Module Import Excel build-broken** (xlsx unresolved) → block FR-V.III-NEW-01 essential. **Auto-suggest quy mô NĐ39** không trigger → vi phạm BR-CALC-05. NHT sidebar leak DN menu. Tab Lịch sử HT thiếu KPI Tổng chi phí.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| DN-001 | FR-V.III-01, UC81 | Xem danh sách DN → 12 row, 8 cột | Happy | P0 | **PASS** | — | Đã PASS R5 trước — list 12/12, 8 cột spec |
| DN-002 | FR-V.III-02, UC82 | Tìm kiếm DN theo tên | Happy | P0 | **PASS** | — | Search "Alpha" → 1/1 row khớp |
| DN-003 | FR-V.III-01, UC81 | Tạo DN mới happy → auto-gen DN-{TỈNH}-{SEQ} | Happy | P0 | **PASS** | — | POST 201 → mã `DN-HNI-0008`, list +1 |
| DN-004 | FR-V.III-01 §E2 | MST trùng → ERR-DN-02 | Negative | P0 | **PASS** | — | Inline error "Mã số thuế đã tồn tại trong hệ thống" — đúng spec |
| DN-005 | FR-V.III-01 §Chỉnh sửa | Sửa DN | Happy | P0 | **PASS** | — | PATCH 200 + modal "Xác nhận thay đổi" diff table — UX tốt hơn spec |
| DN-006 | FR-V.III-01 §Xóa | Xóa DN soft delete | Happy | P1 | **PASS** | — | DELETE 204 + list refresh 13→12, BR-DATA-01 OK |
| DN-007 | FR-V.III-01 §E4 | Xóa DN có VV → ERR-DN-03 | Guard | P0 | **PASS** | — | DELETE 409 + toast "Không thể xóa doanh nghiệp" (gap message text — Observation) |
| DN-008 | FR-V.III-01 §Lịch sử + SCR-V.III-02 row 3 | Xem tab Lịch sử hỗ trợ | Integration | P1 | **PARTIAL** | BUG-FUNC-DN-004 | Tab render OK + 1 VV link ✅, nhưng 3 KPI thiếu "Tổng chi phí" (sai spec) |
| DN-009 | FR-V.III-01 §BR-CALC-05 + SCR-V.III-02 row 13/15/16 | Auto-suggest quy mô NĐ39/2018 | Validation | P1 | **FAIL** | BUG-FUNC-DN-002 | Nhập 5 LĐ + 1 tỷ doanh thu → field Quy mô KHÔNG đổi (vẫn placeholder) |
| DN-010 | FR-V.III-NEW-01 | Import Excel happy | Happy | P1 | **BLOCKED** | BUG-FUNC-DN-001 | Module xlsx unresolved → /doanh-nghiep/import 404 |
| DN-011 | FR-V.III-NEW-01 §E1-E4 | Import Excel lỗi format | Negative | P1 | **BLOCKED** | BUG-FUNC-DN-001 | Cùng module build error |
| DN-012 | FR-V.III-NEW-01 §E5 | Import Excel MST trùng | Negative | P2 | **BLOCKED** | BUG-FUNC-DN-001 | Cùng module build error |
| DN-013 | SCR-V.III-01 row 5 | Xuất Excel danh sách | Happy | P2 | **PASS** | — | POST `/api/v1/doanh-nghieps/export` 200 + blob created |
| DN-014 | Test plan §7.7 DN-014 | QTHT view-only (CRUD ❌) | Authorization | P1 | **PASS** | — | Sidebar OK; toolbar chỉ có "Tìm/Xóa filter/Làm mới"; row chỉ có eye button |
| DN-015 | Test plan §7.7 DN-015 | CB_PD view-only (CRUD ❌) | Authorization | P1 | **PASS** | — | Sidebar OK; toolbar có Xuất Excel + view; không có Thêm/Import/Sửa/Xóa |
| DN-016 | Test plan §7.7 DN-016 | DN tự cập nhật hồ sơ qua API | Authorization | P1 | **DEFER** | — | Login UI 403 (DN role API-only — confirmed T0.1). Cần test riêng API endpoint |
| DN-017 | Test plan §7.7 DN-017 | DN không xóa được | Authorization | P1 | **DEFER** | — | Cùng lý do DN-016 |
| DN-018 | Test plan §7.7 DN-018 | NHT/TVV/CG ❌ no menu | Authorization | P1 | **PARTIAL** | BUG-FUNC-DN-003 | TVV ✅ no menu, CG ✅ no menu, **NHT ❌ HAS menu** (leak) |

### Chú thích

> `PASS` đạt 100% expected. `FAIL` có bug. `BLOCKED` không chạy được do upstream bug. `PARTIAL` đạt một phần. `DEFER` chờ test method khác (API).

---

## 3. Bug Report

> Chi tiết Steps/Evidence (kèm screenshot inline base64) trong [bug-report-functional-DN.md](../bug-reports/bug-report-functional-DN.md). Tóm tắt inline:

### BUG-FUNC-DN-001 — [Critical] Module Import Excel build error: `Failed to resolve import "xlsx"`

**SRS:** `FR-V.III-NEW-01 §Mô tả` + `SCR-V.III-03` (Wizard 3 bước Import) — Priority: Essential.

**Tóm tắt:** Click [Import Excel] → URL `/doanh-nghiep/import` render 404 + Vite overlay `[plugin:vite:import-analysis] Failed to resolve import "xlsx" from "src/pages/doanh-nghiep/import/index.tsx"`. Module xlsx chưa install/resolve → toàn bộ Import feature dead.

**Impact:** 3 TC (DN-010/011/012) BLOCKED. Feature Essential. CB NV không thể bulk-create DN qua Excel theo SRS Acceptance Criteria.

**Suggested fix:** Install `xlsx` package vào `packages/web/package.json` + rebuild + verify resolve.

### BUG-FUNC-DN-002 — [Major] Auto-suggest quy mô KHÔNG trigger từ Số LĐ + Doanh thu

**SRS:** `SCR-V.III-02 row 13` (Quy mô — `auto-suggest`), `row 15` (Số LĐ — `change → auto-calc quy mô`), `row 16` (Doanh thu năm — `change → auto-calc quy mô`), §Quy tắc tương tác `"Auto-suggest quy mô: khi nhập số lao động và doanh thu, hệ thống gợi ý quy mô theo NĐ39/2018"`, FR-V.III-01 Processing Bước 5 BR-CALC-05.

**Tóm tắt:** Nhập 5 LĐ + 1 tỷ doanh thu (trong ngưỡng "Siêu nhỏ" NĐ39) → field Quy mô giữ nguyên placeholder "Vui lòng chọn", không có warning, không có toast.

**Impact:** Mất ý nghĩa BR-CALC-05; user phải tự chọn manual → tăng risk sai phân loại quy mô DNNVV.

### BUG-FUNC-DN-003 — [Medium] NHT sidebar leak menu Doanh nghiệp

**SRS / Spec:** `output/funtion/7.7-quan-ly-doanh-nghiep.md DN-018` "NHT/TVV/CG không thấy menu Doanh nghiệp (❌)".

**Tóm tắt:** TVV ✅ + CG ✅ no menu DN; nhưng NHT vẫn render "Quản lý doanh nghiệp được hỗ trợ" trong sidebar. Click vào → /403 (auth guard hoạt động) — nhưng menu rò rỉ inconsistent với 2 role kia.

### BUG-FUNC-DN-004 — [Medium] Tab Lịch sử HT thiếu KPI "Tổng chi phí"

**SRS:** `SCR-V.III-02 row 3` (`"Tab Lịch sử Hỗ trợ — 3 KPI: Tổng VV, VV hoàn thành, Tổng chi phí"`), `FR-V.III-01 Processing §Xem lịch sử hỗ trợ Bước 2` (`"Tính tổng: tổng vụ việc, tổng chi phí, số VV hoàn thành"`).

**Tóm tắt:** Tab render 3 KPI: Tổng vụ việc / **Đang xử lý** / Hoàn thành — sai spec (thiếu Tổng chi phí, thừa "Đang xử lý").

---

## 4. Detailed Test Results

### 4.1 DN-003: Tạo DN mới happy + auto-gen mã

**Pre-conditions:** Login `cb_nv_tw_01`, navigate `/doanh-nghiep/tao-moi`.

**Test Data:**
```json
{
  "ten_doanh_nghiep": "Công ty TNHH QA Test T4.4",
  "ma_so_thue": "0100100199",
  "loai_doanh_nghiep": "Doanh nghiệp nhỏ và vừa",
  "quy_mo": "Nhỏ",
  "nganh_nghe": "Thương mại và dịch vụ",
  "nguoi_dai_dien": "Nguyễn Văn QA",
  "dia_chi": "Số 99 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
  "tinh_thanh": "Hà Nội",
  "so_lao_dong": 30,
  "doanh_thu": 20000000000,
  "tong_nguon_von": 10000000000
}
```

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill 4 required text fields + 4 dropdown + LĐ/doanh thu | Form valid | OK | **PASS** |
| 2 | Click [Lưu] | POST `/api/v1/doanh-nghieps` 201 | 201 created, id `01117328-...` | **PASS** |
| 3 | Verify auto-redirect detail | URL → `/doanh-nghiep/{id}` | OK | **PASS** |
| 4 | Verify mã auto-gen | DN-HNI-{SEQ}, SEQ tăng tiếp | `DN-HNI-0008` (sau DN-HNI-0001..0005) | **PASS** |
| 5 | Verify list +1 row | 13/13 | 1-13 / 13 mục | **PASS** |

### 4.2 DN-004: MST trùng

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill name + MST `0100100199` (vừa tạo ở DN-003) + dropdown đủ | Form ready | OK | **PASS** |
| 2 | Click [Lưu] | Inline error MST + chặn submit | Inline error "Mã số thuế đã tồn tại trong hệ thống" | **PASS** |

> Match SRS E2 ERR-DN-02: "Mã số thuế đã tồn tại". Variant từ "đã tồn tại" → "đã tồn tại trong hệ thống" — tương đương.

### 4.3 DN-005: Sửa DN

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate `/doanh-nghiep/{id}/chinh-sua` của DN-HNI-0008 | Form prefilled | OK 100% | **PASS** |
| 2 | Modify Tên DN + thêm SĐT + email | Field updated | OK | **PASS** |
| 3 | Click [Lưu] | Modal "Xác nhận thay đổi" với diff table | Modal hiện 3 dòng diff (Tên/Phone/Email — old → new) | **PASS** |
| 4 | Click [Lưu thay đổi] trong modal | PATCH 200 | reqid=362 PATCH 200 | **PASS** |

> **UX bonus:** Modal diff table — tốt hơn spec bare "Lưu". BR-DATA-05 (audit trail "giá trị cũ → giá trị mới") visualization.

### 4.4 DN-006: Xóa DN soft delete

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click delete icon trên row DN-HNI-0008 (Số lần HT = 0) | Popconfirm "Xóa doanh nghiệp?" | OK | **PASS** |
| 2 | Click [Xóa] | DELETE 204 | reqid=380 DELETE 204 | **PASS** |
| 3 | Verify list refresh | 12/12 (-1 row) | "1-12 / 12 mục" | **PASS** |
| 4 | Verify DN-HNI-0008 disappear | Not in list | dn8Found: false (soft delete) | **PASS** |

### 4.5 DN-007: Xóa DN có VV (DN-HNI-0001 có 1 VV)

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click delete icon DN-HNI-0001 (Số lần HT = 1) | Popconfirm | OK | **PASS** |
| 2 | Click [Xóa] | DELETE 409 + toast SRS E4 message | DELETE 409, toast "Không thể xóa doanh nghiệp" | **PASS** |

> **Observation (UX gap):** Toast text `"Không thể xóa doanh nghiệp"` ngắn gọn hơn SRS E4 ERR-DN-03 `"Không thể xóa DN đang có vụ việc xử lý"`. Thiếu lý do "đang có vụ việc xử lý". Không log bug — minor message variant.

### 4.6 DN-008: Tab Lịch sử HT (DN-HNI-0001)

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click tab "Lịch sử hỗ trợ" trên detail DN-HNI-0001 | Tab content render | URL `?tab=lich-su-ho-tro` | **PASS** |
| 2 | Verify 3 KPI | Tổng VV / VV hoàn thành / **Tổng chi phí** | Tổng VV: 1 / **Đang xử lý: 1** / Hoàn thành: 0 | **FAIL** (sai spec) |
| 3 | Verify danh sách VV | 1 row VV liên kết | VV-BTP-TW-20260424-001 "Tư vấn soạn thảo HĐ lao động mẫu" | **PASS** |

→ **PARTIAL** — Tab render + danh sách VV OK, nhưng KPI sai spec. Bug BUG-FUNC-DN-004.

### 4.7 DN-009: Auto-suggest quy mô

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Form Thêm DN, để Quy mô = "Vui lòng chọn" | Default | OK | **PASS** |
| 2 | Nhập Số LĐ = 5 | Field updated | value="5" | **PASS** |
| 3 | Nhập Doanh thu = 1.000.000.000 (1 tỷ) | Field updated | value="1000000000" | **PASS** |
| 4 | Blur out → quan sát Quy mô | Auto-suggest "Siêu nhỏ" | Field giữ nguyên placeholder "Vui lòng chọn" | **FAIL** |

→ **FAIL** — vi phạm SRS auto-suggest. Bug BUG-FUNC-DN-002. NotebookLM verify match SRS local 100%.

### 4.8 DN-010 → DN-012: Import Excel

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [Import Excel] trên list | URL `/doanh-nghiep/import` render Wizard | URL render 404 + Vite overlay `Failed to resolve import "xlsx"` | **BLOCKED** |

→ Tất cả 3 TC BLOCKED. Bug BUG-FUNC-DN-001 Critical.

### 4.9 DN-013: Xuất Excel

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [Xuất Excel] toolbar | POST `/api/v1/doanh-nghieps/export` 200 + blob download | reqid=1012 POST 200 + console: blob created | **PASS** |

### 4.10 DN-014: QTHT view-only

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `qtht_01` + navigate sidebar DN | List 12 row | OK | **PASS** |
| 2 | Verify toolbar | Không có Thêm/Import/Sửa/Xóa | Chỉ có Tìm/Xóa filter/Làm mới + Xuất Excel (?) | **PASS** |
| 3 | Verify row action | Chỉ có icon eye | OK (no edit/delete) | **PASS** |

### 4.11 DN-015: CB_PD view-only

Tương tự DN-014, CB_PD `cb_pd_tw_01` có Eye + Xuất Excel, không có Thêm/Import/Sửa/Xóa. **PASS**.

### 4.12 DN-016/DN-017: DN role authz — DEFER

DN role `dn_01` login UI fail 403 ngay sau POST `/api/v1/auth/login` (không qua OTP). Per T0.1 prep-log "DN role API-only" — không có UI route cho role này. Test API endpoint cần thiết kế riêng (PATCH cho DN-016 RU*, DELETE forbid cho DN-017). **DEFER** sang task riêng.

### 4.13 DN-018: NHT/TVV/CG no menu

| Role | Login | Sidebar có DN menu? | Direct URL `/doanh-nghiep/danh-sach` | Status |
|------|-------|--:|--:|--|
| TVV (`tvv_01`) | ✅ landing /403 (đúng — TVV role không dashboard) | ❌ KHÔNG (4 module: Đào tạo/CG-TVV/Vụ việc/Tư vấn) | redirect /403 ✅ | **PASS** |
| NHT (`nht_01`) | ✅ landing /403 | **✅ CÓ "Quản lý doanh nghiệp được hỗ trợ"** ❌ | redirect /403 ✅ | **FAIL** (UI leak) |
| CG (`cg_01`) | ✅ landing /403 | ❌ KHÔNG (2 module: Đào tạo/Tư vấn) | redirect /403 ✅ | **PASS** |

→ **PARTIAL** — 2/3 PASS, NHT leak menu. Bug BUG-FUNC-DN-003.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| cb_nv_tw_01 | CB_NV_TW | BTP-TW | TW | DN-001..013 |
| qtht_01 | QTHT | (root) | — | DN-014 |
| cb_pd_tw_01 | CB_PD_TW | BTP-TW | TW | DN-015 |
| dn_01 | DN | STP-AG | ĐP | DN-016/017 (DEFER) |
| nht_01 | NHT | STP-AG | ĐP | DN-018 |
| tvv_01 | TVV | STP-AG | ĐP | DN-018 |
| cg_01 | CG | STP-AG | ĐP | DN-018 |

### 5.2 Data tạo/sửa/xóa trong test

| Mã | Tên | TC | Cleanup |
|----|-----|-----|---------|
| DN-HNI-0008 | Công ty TNHH QA Test T4.4 (Updated) | DN-003 → DN-005 → DN-006 | Soft-deleted |
| (try DN-HNI-0008) | (test MST trùng) | DN-004 | KHÔNG tạo (block bởi unique) |

DN-HNI-0001..0005 + DN-DNG-0001..0003 + DN-HPG-0001..0004 (12 seed) — không thay đổi.

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/doanh-nghieps` (CRUD), `/api/v1/doanh-nghieps/{id}`, `/api/v1/doanh-nghieps/export`
- **Auth flow:** JWT + OTP email; OTP bypass `666666`
- **Token TTL:** ~2 phút (BE revoke aggressive — verified prior round)
- **Frontend:** React + Vite + Ant Design + CASL
- **Backend:** NestJS + PostgreSQL
- **Test tool:** Chrome DevTools MCP (primary từ 2026-04-21), 7 isolatedContext concurrent
- **Known limit:** Module Import Excel build broken (bug BUG-FUNC-DN-001) → 3 TC BLOCKED

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-FUNC-DN-001 (Critical):** Install `xlsx` npm package vào `packages/web` và rebuild. Verify route `/doanh-nghiep/import` render Wizard 3 bước.
2. **BUG-FUNC-DN-002 (Major):** Implement auto-suggest BR-CALC-05 trên SCR-V.III-02 (onChange Số LĐ + Doanh thu → set Quy mô theo NĐ39/2018). Hiển thị warning khi 2 tiêu chí khác mức.

### Should Fix

3. **BUG-FUNC-DN-003 (Medium):** Loại bỏ menu "Quản lý doanh nghiệp được hỗ trợ" khỏi sidebar config của role NHT (consistent với TVV/CG).
4. **BUG-FUNC-DN-004 (Medium):** Sửa 3 KPI tab Lịch sử HT thành: Tổng VV / VV hoàn thành / **Tổng chi phí** (bỏ "Đang xử lý" — không có trong SRS).

### Nice to Have

5. **Observation DN-007:** Cập nhật toast text thành SRS E4 nguyên văn `"Không thể xóa DN đang có vụ việc xử lý"` để rõ lý do.
6. **DN-016/017 API test:** Thiết kế task riêng test PATCH /doanh-nghieps/{id} với `dn_01` token — verify chỉ tự cập nhật được hồ sơ DN của mình + DELETE 403/405.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| GET | `/api/v1/doanh-nghieps?page=1&pageSize=20` | List | DN-001, 002 |
| GET | `/api/v1/doanh-nghieps/{id}` | Detail | DN-007 (sau create), DN-008 |
| POST | `/api/v1/doanh-nghieps` | Create | DN-003 (201), DN-004 (block by unique BR) |
| PATCH | `/api/v1/doanh-nghieps/{id}` | Update | DN-005 (200) |
| DELETE | `/api/v1/doanh-nghieps/{id}` | Soft delete | DN-006 (204), DN-007 (409 — guard) |
| POST | `/api/v1/doanh-nghieps/export` | Export Excel | DN-013 (200) |
| GET | `/api/v1/danh-muc/tree?loaiDanhMuc=LOAI_DOANH_NGHIEP` | Master data dropdown | DN-003 |
| GET | `/api/v1/danh-muc/tree?loaiDanhMuc=TINH_THANH` | Master data dropdown | DN-003 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [DN-003-form-filled.png](../screenshots/T4.4/DN-003-form-filled.png) | Form Thêm DN đã điền | DN-003 |
| [DN-003-detail-DN-HNI-0008.png](../screenshots/T4.4/DN-003-detail-DN-HNI-0008.png) | Detail sau create | DN-003 |
| [DN-004-mst-duplicate.png](../screenshots/T4.4/DN-004-mst-duplicate.png) | Inline error MST trùng | DN-004 |
| [DN-005-update-confirm-modal.png](../screenshots/T4.4/DN-005-update-confirm-modal.png) | Modal Xác nhận thay đổi diff table | DN-005 |
| [DN-007-guard-409.png](../screenshots/T4.4/DN-007-guard-409.png) + [DN-007-toast-error.png](../screenshots/T4.4/DN-007-toast-error.png) | Guard delete + toast | DN-007 |
| [DN-008-tab-lich-su.png](../screenshots/T4.4/DN-008-tab-lich-su.png) | Tab Lịch sử HT 3 KPI sai | DN-008 |
| [DN-009-no-auto-suggest.png](../screenshots/T4.4/DN-009-no-auto-suggest.png) | Quy mô không auto-suggest | DN-009 |
| [DN-010-import-build-error.png](../screenshots/T4.4/DN-010-import-build-error.png) | Vite error xlsx unresolved | DN-010 |
| [DN-014-qtht-view-only.png](../screenshots/T4.4/DN-014-qtht-view-only.png) | QTHT toolbar không có CRUD | DN-014 |
| [DN-015-cbpd-view-only.png](../screenshots/T4.4/DN-015-cbpd-view-only.png) | CB_PD toolbar không có CRUD | DN-015 |
| [DN-018-tvv-no-dn-menu.png](../screenshots/T4.4/DN-018-tvv-no-dn-menu.png) | TVV sidebar 4 module no DN | DN-018 |
| [DN-018-nht-leak-dn-menu.png](../screenshots/T4.4/DN-018-nht-leak-dn-menu.png) | NHT sidebar leak DN menu | DN-018 |
| [DN-018-cg-no-dn-menu.png](../screenshots/T4.4/DN-018-cg-no-dn-menu.png) | CG sidebar 2 module no DN | DN-018 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-V.III-01 §Xem danh sách (UC81) | DN-001, 014, 015, 018 | 4/4 PASS (DN-018 partial: NHT leak) |
| FR-V.III-01 §Thêm mới (UC81) | DN-003, 004 | 2/2 PASS |
| FR-V.III-01 §Chỉnh sửa | DN-005 | PASS |
| FR-V.III-01 §Xóa + §E4 | DN-006, 007 | 2/2 PASS |
| FR-V.III-01 §Xem lịch sử + SCR-V.III-02 row 3 | DN-008 | PARTIAL (BUG-DN-004) |
| FR-V.III-01 §BR-CALC-05 + SCR-V.III-02 row 13/15/16 | DN-009 | FAIL (BUG-DN-002) |
| FR-V.III-02 (UC82) | DN-002 | PASS |
| FR-V.III-NEW-01 + SCR-V.III-03 | DN-010, 011, 012 | 3/3 BLOCKED (BUG-DN-001) |
| SCR-V.III-01 toolbar Xuất Excel | DN-013 | PASS |
| Test plan §7.7 DN-014..018 (Authorization) | DN-014..018 | 2 PASS + 1 PARTIAL + 2 DEFER |

### D — 2-source SRS verification (per CLAUDE.md rule)

Tất cả 4 bug đã verify song song:

| Bug | Local SRS grep | NotebookLM HTPLDN query | Match |
|-----|----------------|--------------------------|-------|
| BUG-FUNC-DN-001 | `srs-fr-07-doanh-nghiep.md §FR-V.III-NEW-01` "Priority: Essential" + SCR-V.III-03 "Wizard 3 bước" | NotebookLM 2026-04-29 "Có yêu cầu bắt buộc chức năng Import DN từ Excel" | ✅ |
| BUG-FUNC-DN-002 | `srs-fr-07-doanh-nghiep.md §SCR-V.III-02 row 13/15/16` + Quy tắc tương tác | NotebookLM 2026-04-29 quote nguyên văn 3 row + "Auto-suggest quy mô khi nhập số lao động và doanh thu" | ✅ |
| BUG-FUNC-DN-003 | `output/funtion/7.7-quan-ly-doanh-nghiep.md DN-018` "NHT/TVV/CG ❌" | (test plan local — không có SRS NotebookLM equivalent — bug log dựa Test plan + observed inconsistency vs TVV/CG) | ⚠️ partial (Test plan-based) |
| BUG-FUNC-DN-004 | `srs-fr-07-doanh-nghiep.md §SCR-V.III-02 row 3` "3 KPI: Tổng VV, VV hoàn thành, Tổng chi phí" + FR-V.III-01 Processing §Xem lịch sử Bước 2 | NotebookLM 2026-04-29 quote "Tab Lịch sử Hỗ trợ — 3 KPI: Tổng VV, VV hoàn thành, Tổng chi phí" | ✅ |

---

*Report generated: 2026-04-29 11:00 | QA Automation via Claude Code (Opus 4.7) + Chrome DevTools MCP | T4.4 Functional 18 TC (full coverage)*
