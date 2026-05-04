# Functional Test Report — SM-HOIDAP Flow (Hỏi đáp pháp lý, M4)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Hỏi đáp pháp lý — Workflow SM-HOIDAP 6 bước (M4 / Nhóm II) |
| **SRS Reference** | srs-fr-02-hoi-dap.md — FR-II-01 → FR-II-08 + SM-HOIDAP (Bước 2-6 + reject) |
| **UC Coverage** | UC 10, UC 12, UC 13, UC 15, UC 16, UC 17 |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000 |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based qua MCP Chrome DevTools |
| **Primary Account** | `canbo_tw_5` / `Test@1234` — CB_NV cấp TW, Cục Bổ trợ tư pháp |
| **Round** | Round 1 — Flow test SM-HOIDAP |
| **Tài liệu tham chiếu** | [bug-report.md](bug-report.md), [flow-module.md §4 SM-HOIDAP](../../../input/flow-module.md), [functional-test-report.md §CREATE](../../data-master/hoi-dap/functional-test-report.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 8 (Bước 2-6 × 1 happy + Bước 2-5 × 1 happy close + reject branch) |
| **TC đã test / Tổng TC** | 2/8 (25%) — 6 TC còn lại BLOCKED cascade |
| **Passed** | 2 (Bước 2 Tiếp nhận — HD-001, HD-002) |
| **Failed** | 0 |
| **Blocked** | 6 |
| **Partial** | 0 |
| **Overall Pass Rate** | **25% (2/8)** |
| **P0 Pass Rate** | 25% (2/8 P0 tested) |
| **Bugs Found (SRS-ref)** | **1 Critical** (BUG-HDFLOW-001) |
| **Observations (out-of-SRS)** | 3 (xem [bug-report.md §Observations](bug-report.md#observations)) |
| **Health Score** | 30/100 (Critical blocker cascade) |
| **Start Time** | 16:22 (UTC+7) |
| **End Time** | 16:30 (UTC+7) |
| **Total Duration** | ~8 phút (budget: 45 phút — stopped early do blocker) |
| **Browse Status** | OK (MCP — 0 crash; 1 kick-back `/login` khi `navigate_page` detail URL, workaround: login + click sidebar) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Workflow** | State transition SM-HOIDAP 6 bước + nhánh Từ chối | 8 | 2 | 0 | 0 | 6 | **25%** |
| **Total** | | **8** | **2** | **0** | **0** | **6** | **25%** |

→ **Happy-path Pass Rate = 2/8 (25%)** — workflow downstream (Kho Q&A auto-ingest, BC Hỏi đáp, Dashboard count) đều không test được vì flow dừng ở `TIẾP NHẬN`.

### Verdict: **FAIL**

SM-HOIDAP **không thể vận hành end-to-end** ở Round 1. Bước 2 (Tiếp nhận) hoạt động đúng, nhưng Bước 3 (Phân công) BLOCKED 100% do modal "Phân công xử lý" không có cách nào chọn người xử lý (gợi ý API trả rỗng + không có manual picker). Toàn bộ Bước 4, 5, 6 và nhánh Từ chối bị cascade BLOCKED. 1 Critical bug `BUG-HDFLOW-001` — lặp lại từ round UI Round 1 (memory `qa_htpldn_hoidap_ui_round1`), **dev CHƯA fix**.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| WF-HD-001 | FR-II-03 §Processing Bước 3-5 UC12 + BR-CALC-03 + BR-SLA-01 | HD-001 Bước 2: Tiếp nhận `MỚI → TIẾP NHẬN` | Workflow | P0 | **PASS** | — | State transition thành công, `nguoi_tiep_nhan` = Cán bộ TW 5, `ngay_tiep_nhan` = 23/04/2026 16:24, SLA re-calc 24/04/2026 16:24 |
| WF-HD-002 | FR-II-03 §Processing UC12 | HD-001 Bước 2: Popup "Xác nhận tiếp nhận" hiển thị trước khi advance | Workflow | P1 | **PASS** | — | Modal xác nhận hiển thị đúng, Hủy/Tiếp nhận button present |
| WF-HD-003 | **FR-II-06 §Inputs row 1, §Outputs row 4 + UC15 + flow-module §SM-HOIDAP Bước 3** | HD-001 Bước 3: Phân công `TIẾP NHẬN → ĐANG XỬ LÝ` | Workflow | P0 | **BLOCKED** | **BUG-HDFLOW-001** | **Lý do BLOCKED:** Modal Gợi ý phân công rỗng + không có picker manual → nút [Phân công] disabled |
| WF-HD-004 | FR-II-07 UC16 BR-FLOW-01 | HD-001 Bước 4: Soạn trả lời + tích "Đã trả lời" → auto `ĐANG XỬ LÝ → CHỜ PHÊ DUYỆT` | Workflow | P0 | **BLOCKED** | BUG-HDFLOW-001 | **Cascade:** Không thể reach state ĐANG XỬ LÝ do WF-HD-003 BLOCKED |
| WF-HD-005 | FR-II-08 UC17 BR-AUTH-05 | HD-001 Bước 5: CB PD `lanhdao_tw_5` Phê duyệt `CHỜ PHÊ DUYỆT → ĐÃ DUYỆT` | Workflow | P0 | **BLOCKED** | BUG-HDFLOW-001 | **Cascade:** Không thể reach state CHỜ PHÊ DUYỆT |
| WF-HD-006 | FR-II-08 §Công khai UC17 BR-FLOW-05 | HD-001 Bước 6: Công khai `ĐÃ DUYỆT → CÔNG KHAI` + push sang Cổng PLQG | Workflow | P0 | **BLOCKED** | BUG-HDFLOW-001 | **Cascade** |
| WF-HD-007 | FR-II-06 cross-record reproduce | HD-002 Bước 3 Phân công (reproduce blocker) | Workflow | P0 | **BLOCKED** | BUG-HDFLOW-001 | Reproduce xác nhận cross-lĩnh vực (Thuế) — cùng behavior |
| WF-HD-008 | FR-II-08 §Từ chối UC17 BR-FLOW-04 | HD-003 Reject branch: CB PD [Từ chối] → lý do ≥10 ký tự → `CHỜ PHÊ DUYỆT → ĐANG XỬ LÝ` | Workflow | P0 | **BLOCKED** | BUG-HDFLOW-001 | **Cascade:** Không thể reach CHỜ PHÊ DUYỆT để test reject |

---

## 3. Bug Report

> **Lưu ý:** Chi tiết Steps/Evidence/Impact/Fix đầy đủ xem [bug-report.md](bug-report.md).

### BUG-HDFLOW-001 — [Critical] Modal Phân công không có cách chọn người xử lý

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | WF-HD-003, WF-HD-007 |
| **Status** | Open (regression từ round UI `qa_htpldn_hoidap_ui_round1` 2026-04-22 — dev CHƯA fix) |
| **Assignee** | Backend Team (seed TVV ACTIVE) + FE Team (manual picker fallback) |

**Mô tả:** Sau Bước 2 Tiếp nhận, click nút [Phân công] mở modal "Phân công xử lý". Bảng "Gợi ý phân công" hiển thị 4 cột header (Họ tên / Email / Workload / Ưu tiên) nhưng **không có row** (empty state "Trống"). Modal **không có** combobox/search field để chọn người xử lý manual. Nút [Phân công] ở footer disabled vĩnh viễn. Verify cross 2 records (HD-001 Lao động, HD-002 Thuế) → cùng behavior.

**Expected vs Actual:**
- Expected: Gợi ý danh sách TVV active cùng lĩnh vực, hoặc fallback search CB_NV khác cùng đơn vị (per flow-module §SM-HOIDAP Bước 3 "TVV/NHT hoặc CB NV khác"). Chọn 1 → submit → state `ĐANG XỬ LÝ`.
- Actual: List rỗng, không có input, nút disabled. `TIEP_NHAN` state permanent.

**Impact:** 100% module Hỏi đáp không chạy được workflow. Dashboard KPI (FR-I-01 Hỏi đáp mới), BC Hỏi đáp (FR-IX-01), Kho Q&A auto-ingest (SM §10B) đều fail hoặc stuck.

**Root Cause (nghi ngờ):**
1. Data gap: `TU_VAN_VIEN` table rỗng/không ACTIVE (TVV CREATE round fail 0/6 — memory `qa_htpldn_tvv_cr_round1`)
2. BE filter sai: endpoint `/goi-y-phan-cong` không fallback sang CB_NV cùng đơn vị
3. FE thiếu manual picker khi gợi ý empty

---

## 4. Detailed Test Results

### 4.1 WF-HD-001: HD-001 Bước 2 Tiếp nhận

**Pre-conditions:**
- `canbo_tw_5` đã đăng nhập (OTP `666666`)
- HD-20260423-001 tồn tại state MỚI (seed Round 0)
- Role CB_TW có quyền UC12 "Tiếp nhận xử lý hỏi đáp"

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login canbo_tw_5, click sidebar "Quản lý hỏi đáp" | Render list 29 mục, HD-001 state "Mới" | OK | **PASS** |
| 2 | Click row HD-20260423-001 → detail page | Render SM-HOIDAP step `1. Mới` highlight, field đầy đủ, nút [Tiếp nhận] + [Sửa] | OK, URL `/hoi-dap/a7aa...` | **PASS** |
| 3 | Click [Tiếp nhận] | Popup "Xác nhận tiếp nhận" | OK | **PASS** |
| 4 | Click "Tiếp nhận" trong popup | POST `/hoi-daps/{id}/tiep-nhan` 201, state `MỚI→TIẾP NHẬN`, SLA update, nút chính đổi thành [Phân công] | `POST ... tiep-nhan [201]`, state pill "Tiếp nhận", `nguoi_tiep_nhan="Cán bộ TW 5"`, `ngay_tiep_nhan=23/04/2026 16:24`, SLA `24/04/2026 16:24`, button [Phân công] hiện | **PASS** |

**Notes:**
- SLA re-calc khi Tiếp nhận: `24/04/2026 15:48 → 24/04/2026 16:24` (+36 phút). Đúng per FR-II-03 §Processing Bước 4 "Tính deadline SLA (nếu chưa tính): ngày tiếp nhận + N ngày LV".
- Step indicator SM cập nhật: 1.Mới → (check) → 2.Tiếp nhận (active). OK.

### 4.2 WF-HD-002: HD-001 Popup xác nhận Tiếp nhận

Đã gộp vào 4.1 step 3.

### 4.3 WF-HD-003: HD-001 Bước 3 Phân công — BLOCKED

**Pre-conditions:**
- HD-001 state `TIẾP NHẬN` (sau WF-HD-001)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [Phân công] trên detail HD-001 | Modal "Phân công xử lý" mở với gợi ý TVV cùng lĩnh vực "Lao động" | Modal mở nhưng bảng "Gợi ý phân công" empty ("Trống") | **BLOCKED** |
| 2 | Chọn 1 TVV từ gợi ý → nút [Phân công] enable | — | Không có row để chọn | **BLOCKED** |
| 3 | Fallback: tìm input search manual người xử lý | Ít nhất combobox search | Modal chỉ có "Ghi chú phân công" (textarea) + "Thời hạn xử lý" (date) + bảng gợi ý empty | **BLOCKED** |
| 4 | Click [Phân công] | — | Nút disabled | **BLOCKED** |

**Network:**
- `GET /api/v1/hoi-daps/a7aa1b1e.../goi-y-phan-cong → 200` — trả empty list

**Notes:** BUG-HDFLOW-001 logged.

### 4.4 WF-HD-007: HD-002 Bước 3 reproduce

Steps tương tự 4.3 với HD-002 (lĩnh vực Thuế). Result: **BLOCKED cùng behavior**. Xác nhận blocker không bị lệ thuộc lĩnh vực.

### 4.5 WF-HD-004, 005, 006, 008 — Cascade BLOCKED

Không thể reach state tiền điều kiện (`ĐANG XỬ LÝ` cho Bước 4, `CHỜ PHÊ DUYỆT` cho Bước 5/Reject, `ĐÃ DUYỆT` cho Bước 6) vì WF-HD-003 blocker không cho phép advance.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| `canbo_tw_5` | CB_NV (Cán bộ TW) | Cục Bổ trợ tư pháp | TW | WF-HD-001, 002, 003, 007 |
| `tvv_user_5` (planned) | TVV | — | Portal | **Không dùng được** — bound NGUOI_DUNG nhưng TU_VAN_VIEN record ACTIVE thiếu (root cause BUG-HDFLOW-001) |
| `lanhdao_tw_5` (planned) | CB_PD (Lãnh đạo TW) | Cục Bổ trợ tư pháp | TW | WF-HD-005, 008 — **không reach được** |

### 5.2 Data dùng trong test

| Mã HD | Tiêu đề | Lĩnh vực | Trạng thái cuối | Dùng cho |
|-------|---------|----------|----------------|----------|
| HD-20260423-001 | Hỏi về thời gian nghỉ phép năm | Lao động | **Tiếp nhận** (từ Mới) | WF-HD-001 PASS + WF-HD-003 BLOCKED |
| HD-20260423-002 | Hoàn thuế GTGT đầu vào hàng nhập khẩu | Thuế (updated) | **Tiếp nhận** (từ Mới) | WF-HD-007 reproduce BLOCKED |
| HD-20260423-003, 004, 005, 006 | (Round 0 seed) | Lao động, KDTM, SHTT, Đất đai | Mới | Planned nhưng không dùng do blocker |

---

## 6. Environment Notes

- **API endpoints:** POST `/api/v1/hoi-daps/{id}/tiep-nhan` (201 OK), GET `/api/v1/hoi-daps/{id}/goi-y-phan-cong` (200 empty), POST `/api/v1/hoi-daps/{id}/phan-cong` (chưa test được)
- **Known limitations:**
  - `navigate_page` URL detail sau login lần đầu redirect `/login` → workaround: login + click sidebar (MCP-Rule 3 CLAUDE.md)
  - TVV ACTIVE = 0 record trong DB → gợi ý phân công rỗng 100% — cần seed hoặc BE fallback
  - Console deprecation warnings (AntD Descriptions + rc-collapse) xuất hiện ở detail page — library-level, không phải bug module

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-HDFLOW-001 (Critical):** Fix modal Phân công theo 1 trong 3 option (A seed TVV, B BE fallback CB_NV, C FE manual picker — xem bug-report §Suggested Fix). **Đồng thời** fix BUG-TVV-CR-001 (ProForm DatePicker) để cho phép tạo TVV hợp lệ — 2 bug depend lẫn nhau.

### Should Fix

2. **Obs §1 Enum `TIEP_NHAN` leak:** FE i18n helper để hiển thị label tiếng Việt thay raw enum code ở modal Phân công + mọi nơi show `trang_thai`.
3. **Obs §3 `Thuế (updated)` data leak:** Đã log ở round DMDC, không re-log.

### Additional Recommendations

4. **Cấu hình phân công mặc định (FR-II-NEW-01):** Nếu BA thấy pattern "CB NV tiếp nhận → luôn phân công cho chính mình hoặc 1 TVV cùng lĩnh vực" → setup mapping `LINH_VUC_PL × role × don_vi` để skip modal thủ công.
5. **Round tiếp theo sau fix:** Re-test 8 TC này. Dự kiến nếu BUG-HDFLOW-001 fix → khả năng cao phát hiện thêm bug FR-II-07 (auto-transition BR-FLOW-01 khi tích "Đã trả lời") + FR-II-08 (gửi API Cổng PLQG khi Công khai).

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Status |
|--------|----------|---------|--------------|-----------------|
| POST | `/api/v1/hoi-daps/{id}/tiep-nhan` | Bước 2 Tiếp nhận | WF-HD-001, WF-HD-007 | 201 (2/2) |
| GET | `/api/v1/hoi-daps/{id}/goi-y-phan-cong` | Bước 3 list gợi ý người xử lý | WF-HD-003, WF-HD-007 | 200 nhưng empty payload (BE/data issue) |
| POST | `/api/v1/hoi-daps/{id}/phan-cong` | Bước 3 submit phân công | Planned — BLOCKED | Chưa test |
| POST | `/api/v1/hoi-daps/{id}/phan-hois` | Bước 4 soạn phản hồi + auto advance | Planned — BLOCKED | Chưa test |
| POST | `/api/v1/hoi-daps/{id}/phe-duyet` | Bước 5 CB PD phê duyệt | Planned — BLOCKED | Chưa test |
| POST | `/api/v1/hoi-daps/{id}/tu-choi` | Reject branch | Planned — BLOCKED | Chưa test |
| POST | `/api/v1/hoi-daps/{id}/cong-khai` | Bước 6 Công khai | Planned — BLOCKED | Chưa test |
| POST | `/api/v1/hoi-daps/{id}/dong-ho-so` | Bước 6 Hoàn thành | Planned — BLOCKED | Chưa test |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [step2-hd001-tiepnhan.png](image/step2-hd001-tiepnhan.png) | HD-001 sau Bước 2 Tiếp nhận — state, SLA, nguoi_tiep_nhan | WF-HD-001 PASS |
| [BUG-step3-phancong-empty-suggestions.png](image/BUG-step3-phancong-empty-suggestions.png) | HD-001 Modal Phân công — gợi ý empty, nút disabled | BUG-HDFLOW-001 |
| [BUG-hd002-phancong-empty-reproduce.png](image/BUG-hd002-phancong-empty-reproduce.png) | HD-002 Modal Phân công — reproduce blocker với lĩnh vực khác | BUG-HDFLOW-001 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-II-03 §Processing Bước 3-5 UC12 (Tiếp nhận) | WF-HD-001, WF-HD-002 | **2/2 PASS** |
| BR-CALC-03 + BR-SLA-01 (SLA re-calc khi Tiếp nhận) | WF-HD-001 (implicit) | **PASS** |
| FR-II-06 UC15 §Inputs row 1 `nguoi_xu_ly_id` Y | WF-HD-003, WF-HD-007 | **0/2 BLOCKED** — không có UI để cung cấp giá trị |
| FR-II-06 §Outputs row 4 `goi_y_list` | WF-HD-003, WF-HD-007 | **FAIL** — BE trả empty |
| FR-II-06 §Acceptance Criteria 2 "CB NV chọn TVV → phân công OK" | WF-HD-003 | **FAIL** — không thể chọn |
| FR-II-07 UC16 BR-FLOW-01 (auto `ĐANG XỬ LÝ→CHỜ PHÊ DUYỆT`) | WF-HD-004 | **BLOCKED** |
| FR-II-08 UC17 BR-AUTH-05 (CB PD duyệt) | WF-HD-005 | **BLOCKED** |
| FR-II-08 BR-FLOW-05 (push Cổng PLQG khi Công khai) | WF-HD-006 | **BLOCKED** |
| FR-II-08 BR-FLOW-04 (Từ chối lý do ≥10 chars) | WF-HD-008 | **BLOCKED** |
| flow-module §SM-HOIDAP Bước 3 "TVV/NHT hoặc CB NV khác" | WF-HD-003 | **FAIL** — UI không support fallback CB NV |

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP, Opus 4.7 1M)*
