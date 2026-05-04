# Functional Test Report — M6.1 Khóa học (Round 2)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | M6.1 Khóa học (Phân hệ Quản lý Đào tạo) |
| **SRS Reference** | `srs-fr-03-dao-tao.md` — FR-III-01 (entity con KHOA_HOC) |
| **UC Coverage** | UC-KH-01 Tạo mới khóa học (DU_THAO) |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based (MCP snapshot + form interaction), kèm network inspection qua `list_network_requests` |
| **Primary Account** | canbo_tw_5 / Test@1234 (CB_NV_TW) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [seed-fixture.yaml §khoa_hoc_variants](../../../input/data/seed-fixture.yaml), [bug-report-khoa-hoc-r2.md](bug-report-khoa-hoc-r2.md), Round 1 [functional-test-report-khoa-hoc.md](functional-test-report-khoa-hoc.md), memory `qa_htpldn_khoahoc_cr_round1` |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 6 (1 TC / variant) |
| **TC đã test / Tổng TC** | 0/6 (0%) — toàn bộ BLOCKED tại Step 2 (Chọn CTDT) |
| **Passed** | 0 |
| **Failed** | 0 |
| **Blocked** | 6 |
| **Partial** | 0 |
| **Overall Pass Rate** | 0% (0/6) |
| **P0 Pass Rate** | 0% (0/6 P0 tested) |
| **Bugs Found (SRS-ref)** | 0 |
| **Observations (out-of-SRS)** | 1 regression (OBS-KH-001-R2) + 3 carry-over R1 (OBS-KH-002..004) |
| **Health Score** | 0/100 (không seed được data nào) |
| **Start Time** | 17:38 (UTC+7) |
| **End Time** | 17:43 (UTC+7) |
| **Total Duration** | ~5 phút (STOP early theo user instruction sau khi reproduce blocker) |
| **Browse Status** | OK — Chrome DevTools MCP 0 crash, 0 session reset |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Tạo khóa học theo fixture (6 variant) | 6 | 0 | 0 | 0 | 6 | **0%** |
| **Total** | | **6** | **0** | **0** | **0** | **6** | **0%** |

→ **Happy-path Pass Rate = 0/6** — 100% BLOCKED.

### Verdict: **BLOCKED (STOP — dependency chưa resolved từ Round 1)**

Round 2 regression của Round 1: combobox CTDT trên form "Tạo khóa học mới" chỉ load CTDT `DA_DUYET`, trong khi toàn bộ 9 CTDT hiện có đều `DU_THAO`. Account test hiện tại (CB_NV_TW) chỉ submit sang `CHO_DUYET`, không approve được sang `DA_DUYET` — **cần BA/PM provision CB_PD account hoặc seed DB trực tiếp** trước khi chạy Round 3.

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** 6/6 TC BLOCKED tại cùng 1 step (chọn CTDT). Không có TC nào chạy đủ đến step validate/submit.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| KH-001 | FR-III-01 Inputs KH | Tạo khóa học variant[1] "Pháp luật doanh nghiệp căn bản" (TRUC_TUYEN, ctdt=chuong_trinh_dao_tao_variants[1]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |
| KH-002 | FR-III-01 Inputs KH | Tạo khóa học variant[2] "Luật thuế GTGT thực hành" (TRUC_TIEP, ctdt=[1]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |
| KH-003 | FR-III-01 Inputs KH | Tạo khóa học variant[3] "Hợp đồng thương mại quốc tế" (TRUC_TUYEN, ctdt=[1]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |
| KH-004 | FR-III-01 Inputs KH | Tạo khóa học variant[4] "An toàn lao động ngành xây dựng" (TRUC_TIEP, ctdt=[2]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |
| KH-005 | FR-III-01 Inputs KH | Tạo khóa học variant[5] "Sở hữu trí tuệ cho startup" (TRUC_TUYEN, ctdt=[3]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |
| KH-006 | FR-III-01 Inputs KH | Tạo khóa học variant[6] "Luật đất đai cập nhật 2024" (TRUC_TIEP, ctdt=[4]) | Happy | P0 | **BLOCKED** | — | Dropdown CTDT rỗng — OBS-KH-001-R2 |

---

## 3. Bug Report

> Không có bug SRS-ref (xem bug-report-khoa-hoc-r2.md §Bug Summary Table). Toàn bộ được phân loại Observation — chi tiết: [bug-report-khoa-hoc-r2.md §Observations](bug-report-khoa-hoc-r2.md).

---

## 4. Detailed Test Results

### 4.1 KH-001..006: BLOCKED pattern chung (tất cả 6 TC có cùng step failure)

**Pre-conditions chung:**
- canbo_tw_5 login OTP 666666 OK → dashboard render
- Navigate sidebar Quản lý đào tạo ▶ Khóa học → list hiện tại rỗng (0 record, tab "Tất cả")
- Click **+ Thêm mới** → URL `/dao-tao/khoa-hoc/tao-moi`, form "Tạo khóa học mới" render đủ 7 field + 2 radio + 2 textbox + 2 spinbutton

**Test Data:** mỗi TC dùng 1 variant trong `seed-fixture.yaml §khoa_hoc_variants` (6 object index 1..6). Xem fixture `ten_khoa_hoc / hinh_thuc / ngay_bat_dau / ngay_ket_thuc / so_luong_toi_da / dia_diem / doi_tuong / ctdt_id`.

**Test Steps (chung):**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Nhập `Tên khóa học` = fixture.ten_khoa_hoc | Field accept, typing render text | *(không chạy — stop ở step 2)* | — |
| 2 | Click combobox `* Chương trình đào tạo` → chọn option ứng với fixture.ctdt_id | Dropdown hiện ≥1 option CTDT (ít nhất 4 fixture CTDT ở state DA_DUYET) | Dropdown expanded, HTML `<div role="listbox" class="ant-select-item-empty">Không có chương trình phù hợp</div>` — 0 option | **BLOCKED** |
| 3 | Chọn radio `Hình thức` | — | Không chạy | — |
| 4 | RangePicker `Thời gian diễn ra` = fixture.ngay_bat_dau → fixture.ngay_ket_thuc | — | Không chạy | — |
| 5 | Spinbutton `Sĩ số tối đa` = fixture.so_luong_toi_da | — | Không chạy | — |
| 6 | Textbox `Địa điểm` = fixture.dia_diem (nếu có) | — | Không chạy | — |
| 7 | Textbox `Đối tượng tham gia` = fixture.doi_tuong | — | Không chạy | — |
| 8 | Click `Tạo khóa học` | POST /api/v1/khoa-hocs với payload full fixture → 201 `{trangThai: DU_THAO}` | Không chạy | — |
| 9 | Verify list shows record với trangThai = DỰ THẢO | — | Không chạy | — |

**Diagnostic (Rule 9 Step 1 capture):**
- **URL:** `/dao-tao/khoa-hoc/tao-moi` (form vẫn render, không có crash)
- **Console:** sạch (không error)
- **Network (reqid=208):** `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=100&trangThai=DA_DUYET` → 200 OK, response `{success:true, data:[], meta:{total:0}}`
- **DOM dropdown:** listbox rỗng, empty-text "Không có chương trình phù hợp"
- **List CTDT:** 9 record, column `Trạng thái` đều "Dự thảo" (screenshot `r2-ctdt-list-all-draft.png`)
- **CTDT detail (CTDT-BTP-TW-2026-0001):** stepper node (1) Dự thảo active, buttons `Lưu nháp / Gửi phê duyệt / Hủy chương trình` — không có `Phê duyệt` cho role CB_NV

**Phân loại (Rule 9 Step 2):** **ACCOUNT/WORKFLOW DEPENDENCY** (không phải REAL CRASH, không phải SELECTOR OUTDATED, không phải APP BUG SRS-ref — là gap test data do workflow yêu cầu role CB_PD approve). Mapping với Round 1 = regression cùng root cause.

**Action (Rule 9 Step 3 + user instruction "Nếu lỗi crash STOP"):** Dù không crash, 100% TC block tại Step 2 → tiếp tục chạy 6 TC cũng chỉ thu thập cùng 1 evidence → **STOP early sau TC đầu tiên để xác nhận, capture evidence, ghi report**. Không retry, không fallback account vì không có CB_PD trong CSV.

**Notes:**
- Confirm bằng list network: chỉ duy nhất 1 API call load CTDT, filter `trangThai=DA_DUYET` hard-code từ FE (xem memory `qa_htpldn_khoahoc_cr_round1` + OBS-KH-001).
- Fetch thử `/api/v1/chuong-trinh-dao-taos?trangThai=DU_THAO` qua `evaluate_script` → 401 `ERR-AUTH-SYS-00-01 Authorization token is required` — xác nhận token HttpOnly không đọc/attach được từ JS (MCP không thể bypass bằng cách gọi thẳng API như session cũ).

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Cục BTTP | TW | KH-001 → KH-006 (toàn bộ BLOCKED) |

> **Account gap:** Không có account `canbo_pd_tw_*` (CB_PD) trong [test-accounts.csv](../../../input/test-accounts.csv) để approve CTDT → blocker không tự resolve được bằng fallback-same-role (Rule 7).

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| — | **0 record được tạo** | Seed phase blocked at step 2 | N/A |

### 5.3 Data pre-existing quan sát trong hệ thống (Round 2)

| ID | Tên | Trạng thái | Nguồn |
|----|-----|------------|-------|
| CTDT-BTP-TW-2026-0001 | CTĐT 2026 - Pháp luật cho DN nhỏ | **Dự thảo** | Fixture M6.1-parent variant[1] |
| CTDT-BTP-TW-2026-0002 | CTĐT 2026 - ATLĐ ngành xây dựng | **Dự thảo** | Fixture M6.1-parent variant[2] |
| CTDT-BTP-TW-2026-0003 | CTĐT 2026 - SHTT cho startup | **Dự thảo** | Fixture M6.1-parent variant[3] |
| CTDT-BTP-TW-2026-0004 | CTĐT 2025 - Luật đất đai | **Dự thảo** | Fixture M6.1-parent variant[4] |
| CTDT-STP-HN-2026-0001 | CTĐT QA 001 - Pháp luật Doanh nghiệp cấp cơ bản | **Dự thảo** | QA data khác |
| CTDT-STP-HN-2026-0002 | CTĐT QA 002 - Lao động và An toàn lao động | **Dự thảo** | QA data khác |
| CTDT-STP-HN-2026-0003 | CTĐT QA 003 - Pháp luật Đất đai cho Doanh nghiệp | **Dự thảo** | QA data khác |
| CTDT-STP-HN-2026-0004 | CTĐT QA 004 - Thuế và Kế toán Doanh nghiệp | **Dự thảo** | QA data khác |
| CTDT-STP-HN-2026-0005 | CTĐT QA 005 - Pháp luật Hôn nhân và Gia đình | **Dự thảo** | QA data khác |

→ **9/9 CTDT ở state `DU_THAO`**, 0 CTDT ở `DA_DUYET` → dropdown CTDT trong form Khóa học rỗng → không CREATE được variant nào.

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}`
- **Auth flow:** JWT qua cookie HttpOnly (không đọc/inject được từ browser JS) + OTP email bypass `666666`
- **FE filter:** Combobox CTDT hard-code query `trangThai=DA_DUYET` — không có toggle cho phép chọn state khác
- **Workflow CTDT:** DU_THAO (CB_NV create) → CHO_DUYET (CB_NV submit "Gửi phê duyệt") → DA_DUYET (**CB_PD approve** — cần role này)
- **Test tool:** Chrome DevTools MCP primary (stable, 0 crash Round 2)
- **Known limitations:** Token HttpOnly → không thể gọi API manual để inject CTDT ở state khác

---

## 7. Recommendations

### Must Fix (Before next round M6.1)

1. **Unblock seed data M6.1 — BA/PM + Dev Ops** (ưu tiên P0): chọn 1 trong 3 option ở OBS-KH-001-R2:
   - (a) Provision **CB_PD account** trong `input/test-accounts.csv` → QA login CB_PD approve 4 CTDT fixture → DA_DUYET
   - (b) **Seed DB trực tiếp** 4 CTDT fixture ở `trangThai=DA_DUYET` (đơn giản hơn nếu không có CB_PD role trong test env)
   - (c) **SRS clarify + FE relax**: cho phép CB_NV chọn CTDT mọi state (nếu KH workflow không phụ thuộc CTDT state)

2. **Flow-module.md §Phụ lục 2 (seed-preset)**: bổ sung bước approve CTDT trước khi seed khoa_hoc_variants. Hiện tại preset thiếu step này nên fixture tác động block downstream.

### Should Fix

3. **OBS-KH-002 (carry-over R1)** — "Số buổi học" không có trong SRS: BA confirm bổ sung SRS hoặc FE remove.
4. **OBS-KH-003 (carry-over R1)** — Form thiếu `bai_giang_ids`: FE xác định entry-point gán bài giảng cho khóa học.
5. **OBS-KH-004 (carry-over R1)** — Spinbutton "Sĩ số tối đa" valuemax=0 < valuemin=1: FE fix.

### Additional Recommendations

6. **Test data design:** Khi một entity (KH) phụ thuộc state của entity khác (CTDT), bổ sung cột **"Pre-state dependency"** trong `entity-map.md` để QA biết cần seed workflow trước. Hiện tại entity-map chưa capture constraint này.
7. **Account matrix:** Audit `input/test-accounts.csv` vs workflow SRS — mỗi transition cần 1 role; thiếu CB_PD là rủi ro cho mọi module có approve step (CTDT, TVN, Khóa học workflow sau này, v.v.).

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/auth/login` | Login username+password | Setup |
| POST | `/api/v1/auth/verify-otp` | Xác thực OTP 666666 | Setup |
| GET | `/api/v1/dashboard?...` | Load dashboard | Setup |
| GET | `/api/v1/khoa-hocs?page=1&pageSize=20` | List Khóa học (pre-check) | All (return empty) |
| GET | `/api/v1/chuong-trinh-dao-taos?page=1&pageSize=100&trangThai=DA_DUYET` | Load CTDT options cho combobox | All (reqid=208, 200, `meta.total=0` → dropdown rỗng) |
| POST | `/api/v1/khoa-hocs` | **Không chạy** — blocked at combobox selection | — |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [r2-blocker-ctdt-dropdown-empty.png](image/r2-blocker-ctdt-dropdown-empty.png) | Form "Tạo khóa học mới" + dropdown CTDT expanded rỗng | KH-001..006 |
| [r2-ctdt-list-all-draft.png](image/r2-ctdt-list-all-draft.png) | List `/dao-tao/chuong-trinh/danh-sach` — 9 CTDT, toàn bộ "Dự thảo" | KH-001..006 |
| [r2-ctdt-detail-stepper-gui-phe-duyet.png](image/r2-ctdt-detail-stepper-gui-phe-duyet.png) | CTDT detail — CB_NV chỉ có button `Gửi phê duyệt`, không có `Phê duyệt` | KH-001..006 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-III-01 Inputs Khóa học row 1..10 | KH-001..006 | BLOCKED — không chạm tới được |
| FR-III-01 Processing Thêm mới Khóa học | KH-001..006 | BLOCKED — không chạy được tới Step submit |
| FR-III-01 Error Handling E1..E4 | — | Không test được |

### D — So sánh Round 1 vs Round 2

| Dimension | Round 1 (sáng 2026-04-23) | Round 2 (chiều 2026-04-23) | Δ |
|-----------|-----------------------------|------------------------------|---|
| TC chạy | 0/6 (BLOCKED ngay step 2) | 0/6 (BLOCKED ngay step 2) | Không đổi |
| Bug SRS-ref | 0 | 0 | Không đổi |
| Observations | 4 (OBS-KH-001..004) | 1 regression + 3 carry-over | +1 regression |
| CTDT state hệ thống | 4/4 DU_THAO | 9/9 DU_THAO | +5 CTDT (QA khác) vẫn `DU_THAO` |
| Root cause | FE filter `trangThai=DA_DUYET` + fixture DU_THAO | Giống | Dev chưa fix + BA chưa clarify |
| Time spent | ~10 phút | ~5 phút (STOP early hơn) | -50% overhead |

---

*Report generated: 2026-04-23 17:43 | QA Automation via Claude Code (Chrome DevTools MCP)*
