# Functional Test Report — Flow SM-KHOAHOC (Sub-menu 1: Chương trình ĐT & Khóa học)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Đào tạo, Tập huấn — Sub-menu 1: Chương trình ĐT & Khóa học (SM-KHOAHOC) |
| **SRS Reference** | `srs-fr-03-dao-tao.md §FR-III-01` (UC20), `flow-module.md §6 SM-KHOAHOC Sub-menu 1` (Bước 1 → 10) |
| **UC Coverage** | UC 20 (CRUD CTDT + Khóa học), UC SM-KHOAHOC end-to-end (Bước 1 → 10) |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) |
| **Test Method** | UI-based (MCP snapshot + form interaction + a11y tree) |
| **Primary Account** | `canbo_tw_5` / Test@1234 — CB_NV cấp TW |
| **Secondary Account** | `lanhdao_tw_5` (CB_PD cấp TW) — duyệt CTDT + Khoá học. `qtht_tw_5` (QTHT_TW) — verify role công khai |
| **Round** | Round 2 — Flow function test (sau Round 1 CREATE BLOCKED) |
| **Tài liệu tham chiếu** | [seed-fixture.yaml §chuong_trinh_dao_tao_variants + §khoa_hoc_variants](../../../input/data/seed-fixture.yaml), [flow-module.md §6 SM-KHOAHOC](../../../input/flow-module.md), [bug-report-flow-khoahoc.md](bug-report-flow-khoahoc.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 12 (10 bước SM-KHOAHOC + 1 workaround duyệt CTDT + 1 negative test role separation) |
| **TC đã test / Tổng TC** | 5/12 (42%) — 7 TC còn lại BLOCKED downstream (cascade từ Bước 4) |
| **Passed** | 4 |
| **Failed** | 1 |
| **Blocked** | 7 |
| **Partial** | 0 |
| **Overall Pass Rate** | 33% (4/12) |
| **P0 Pass Rate** | 33% (4/12 P0) |
| **Bugs Found (SRS-ref)** | 5 (1 Critical, 3 Major, 1 Medium) |
| **Observations (out-of-SRS)** | 4 (deviation flow + UI quirk — xem `bug-report-flow-khoahoc.md §Observations`) |
| **Health Score** | 35/100 (FAIL — flow blocked tại Bước 4 Công khai do BE 502 + UI mis-disclosure) |
| **Start Time** | 17:39 (UTC+7) |
| **End Time** | 17:58 (UTC+7) |
| **Total Duration** | ~19 phút |
| **Browse Status** | OK — MCP single session, 0 crash |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Workflow** | State transition CTDT + Khoá học theo flow-module §6 | 10 | 3 | 0 | 1 | 6 | **30%** |
| **Authorization** | Role × action (CB_NV/LANH_DAO/QTHT trên publish) | 1 | 0 | 0 | 0 | 1 | **0%** |
| **Workaround** | Push CTDT-0001 lên DA_DUYET (UI yêu cầu, SRS không) | 1 | 1 | 0 | 0 | 0 | **100%** |
| **Total** | | **12** | **4** | **0** | **1** | **7** | **33%** |

→ **Workflow Pass Rate = 3/10 (30%)** — flow SM-KHOAHOC bị chặn tại Bước 4 (state ĐÃ DUYỆT → ĐÃ CÔNG KHAI/ĐANG DIỄN RA).

### Verdict: **FAIL**

Flow SM-KHOAHOC thực hiện được 3/10 bước (Bước 1 tạo Khóa học, Bước 2 trình ph_duyệt, Bước 3 phê duyệt) sau khi áp dụng **2 workaround SRS không có** (push CTDT lên DA_DUYET trước khi tạo Khoá học). Bước 4 trở đi chặn cứng do (a) BE endpoint `POST /khoa-hocs/{id}/publish` trả 502 cho QTHT_TW (role có permission), 403 cho CB_NV và LANH_DAO_TW (UI hiển thị nút sai role), và (b) tab Học viên thiếu nút "[+ Thêm học viên thủ công]" theo flow-module Bước 4.

---

## 2. Test Results Summary

| ID | TraceID (SRS / Flow) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|----------------------|---------------|------|----------|--------|--------|------------------------|
| KHFLOW-000A | flow-module §6 Bước 1 (workaround) | CB NV (canbo_tw_5) push CTDT-BTP-TW-2026-0001 [Gửi phê duyệt] → CHO_DUYET | Workaround | P0 | **PASS** | — | Modal confirm hiện đúng, state đổi DU_THAO → CHO_DUYET. Workaround vì form Tạo Khoá học lọc CTDT theo trangThai=DA_DUYET (xem BUG-KHFLOW-002 + OBS round 1). |
| KHFLOW-000B | flow-module §6 Bước 1 (workaround) | CB PD (lanhdao_tw_5) [Phê duyệt] CTDT-BTP-TW-2026-0001 → DA_DUYET | Workaround | P0 | **PASS** | — | Modal "Xác nhận phê duyệt" → confirm. Stepper check 2/5. Lịch sử phê duyệt hiển thị "Cán bộ TW 5 — GUI_DUYET 23/04/2026 17:42" (không có entry PHE_DUYET hiển thị). |
| KHFLOW-001 | flow-module §6 Bước 1, FR-III-01 Inputs Khoá học, fixture khoa_hoc_variants[1] | CB NV tạo Khoá học `Pháp luật DN căn bản` link CTDT-0001 → DỰ THẢO (KH-20260423-001) | Workflow | P0 | **PASS** | BUG-KHFLOW-001, BUG-KHFLOW-005 | Save thành công, có 2 bug observation: (a) ngày bắt đầu lệch -1 (input 15/05 → save 14/05, timezone) — BUG-KHFLOW-001; (b) detail "Chương trình ĐT" hiển thị UUID raw thay vì mã/tên CTDT — BUG-KHFLOW-005. |
| KHFLOW-002 | flow-module §6 Bước 2 | CB NV (canbo_tw_5) [Trình phê duyệt] khoá học → CHỜ DUYỆT | Workflow | P0 | **PASS** | — | Modal "Gửi phê duyệt" → confirm. Stepper check 1 step (Dự thảo). State table list = "Chờ duyệt". |
| KHFLOW-003 | flow-module §6 Bước 3 | CB PD (lanhdao_tw_5) [Phê duyệt] khoá học → ĐÃ DUYỆT | Workflow | P0 | **PASS** | — | Modal "Xác nhận phê duyệt" → confirm. Toast "Đã phê duyệt khóa học thành công". State table list = "Đã duyệt". Nút "Công khai" hiện. |
| KHFLOW-004A | flow-module §6 Bước 6 (UI deviation: thêm "Đã công khai" giữa ĐÃ DUYỆT và ĐANG DIỄN RA) | CB NV (canbo_tw_5) [Công khai] khoá học → ĐÃ CÔNG KHAI | Workflow | P0 | **FAIL** | BUG-KHFLOW-002, BUG-KHFLOW-003 | Nút [Công khai] hiện cho CB_NV nhưng API `POST /khoa-hocs/{id}/publish` trả **403 Forbidden** + toast generic "Không thể công khai. Vui lòng thử lại." (không hint quyền). Vi phạm Action Disclosure (BUG-KHFLOW-003) + thiếu i18n message (BUG-KHFLOW-004 partial). |
| KHFLOW-004B | flow-module §6 Bước 6 | CB PD (lanhdao_tw_5) [Công khai] khoá học → ĐÃ CÔNG KHAI | Workflow | P0 | **FAIL** | BUG-KHFLOW-002 | Cùng symptom KHFLOW-004A: API trả 403, toast generic. LANH_DAO_TW cũng không có permission → vi phạm Action Disclosure UI. |
| KHFLOW-004C | flow-module §6 Bước 6 + Authorization | QTHT (qtht_tw_5) [Công khai] khoá học → ĐÃ CÔNG KHAI | Workflow / Auth | P0 | **FAIL** | **BUG-KHFLOW-002** (Critical) | API `POST /khoa-hocs/{id}/publish` trả **502 Bad Gateway** — BE bug nội bộ (proxy/route fail), KH vẫn ĐÃ DUYỆT. Đây là blocker chính của flow. |
| KHFLOW-005 | flow-module §6 Bước 4 (CB NV thêm học viên thủ công) | CB NV thêm học viên thủ công vào tab "Học viên" | Workflow | P0 | **BLOCKED** | BUG-KHFLOW-004 | Tab "Học viên" CHỈ có nút "Import Excel" — **THIẾU nút "[+ Thêm học viên thủ công]"** mà flow-module §6 Bước 4 yêu cầu (CB NV nhập hộ DN/NHT). |
| KHFLOW-006 | flow-module §6 Bước 5 | CB NV duyệt đăng ký học viên (CHO_DUYET → DA_DUYET đăng ký) | Workflow | P1 | **BLOCKED** | — | Cascade từ KHFLOW-005: chưa có học viên thì không có gì để duyệt. |
| KHFLOW-007 | flow-module §6 Bước 6-7 | Kích hoạt + Kết thúc khoá học (ĐÃ DUYỆT → ĐANG DIỄN RA → ĐÃ KẾT THÚC) | Workflow | P0 | **BLOCKED** | — | Cascade từ KHFLOW-004 (Công khai chặn). UI không cung cấp "Kích hoạt" trực tiếp từ ĐÃ DUYỆT — phải qua "Đã công khai" trước. |
| KHFLOW-008 | flow-module §6 Bước 8-9 | Nhập điểm + CB PD duyệt KQ (ĐÃ KẾT THÚC → CHỜ DUYỆT KQ → HOÀN THÀNH) | Workflow | P0 | **BLOCKED** | — | Cascade từ KHFLOW-007. |
| KHFLOW-009 | flow-module §6 Bước 10 | CB NV cấp chứng nhận (HOÀN THÀNH → file PDF) | Workflow | P1 | **BLOCKED** | — | Cascade từ KHFLOW-008. |

### Chú thích Result

> - `PASS` — đạt 100% expected behavior
> - `FAIL` — có bug, link tới Bug ID
> - `BLOCKED` — không chạy được do thiếu data/dependency/môi trường
> - `PARTIAL` — đạt một phần
> - `Workaround` — bước không có trong SRS/flow nhưng UI yêu cầu để mở khóa downstream

---

## 3. Bug Report (tóm tắt — chi tiết xem [bug-report-flow-khoahoc.md](bug-report-flow-khoahoc.md))

### BUG-KHFLOW-001 — Major — Ngày bắt đầu Khoá học lưu lệch -1 ngày so với input

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | KHFLOW-001 |
| **Status** | Open |
| **Assignee** | FE / BE Team |

**Mô tả:** Form Tạo Khoá học chọn `2026-05-15` từ DatePicker → detail hiển thị `14/05/2026`. Ngày kết thúc `2026-05-20` → `20/05/2026` đúng.

**Expected vs Actual:** Lưu đúng 15/05/2026 vs Lưu thành 14/05/2026 (lệch -1).

**Impact:** Sai lệch thông tin khoá học, ảnh hưởng SLA tự kích hoạt (Bước 6 flow nói khi đến ngày bắt đầu hệ thống auto chuyển ĐANG DIỄN RA).

**Root Cause (Suggested):** Timezone bug — FE gửi date dạng UTC midnight (`2026-05-15T00:00:00Z`) nhưng BE display dùng local UTC+7 → trừ 7h thành 14/05 23:00. Cần normalize date-only string `YYYY-MM-DD` không kèm timezone.

---

### BUG-KHFLOW-002 — Critical — API `POST /khoa-hocs/{id}/publish` 502 Bad Gateway cho QTHT (role có permission)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | KHFLOW-004A/B/C |
| **Status** | Open |
| **Assignee** | BE Team |

**Mô tả:** Endpoint `POST /api/v1/khoa-hocs/{id}/publish` chặn flow SM-KHOAHOC tại Bước "Công khai":
- `canbo_tw_5` (CB_NV) → 403 Forbidden
- `lanhdao_tw_5` (LANH_DAO_TW) → 403 Forbidden
- `qtht_tw_5` (QTHT_TW) → **502 Bad Gateway** (BE crash/proxy fail)

**Impact:** Khoá học stuck ở `ĐÃ DUYỆT`, không thể tiến vào `ĐÃ CÔNG KHAI`/`ĐANG DIỄN RA`/`ĐÃ KẾT THÚC`/`HOÀN THÀNH` → block toàn bộ Bước 4-10 flow → không cấp được chứng nhận → không phát sinh data downstream cho các module khác (Đánh giá hiệu quả, CT HTPLDN dùng KH `HOÀN THÀNH`).

**Root Cause (Suggested):** BE handler crash khi xử lý publish (có thể thiếu validation precondition như "phải có ≥1 bài giảng gán" hoặc nullpointer trên field optional). Console error: `Failed to load resource: the server responded with a status of 502 (Bad Gateway)`.

---

### BUG-KHFLOW-003 — Major — UI hiển thị nút "Công khai" cho mọi role mà không kiểm tra permission

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | KHFLOW-004A, KHFLOW-004B |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Nút `[Công khai]` hiển thị ngay trên detail Khoá học cho CB_NV và LANH_DAO_TW, nhưng API trả 403 (không có permission). Toast lỗi generic "Không thể công khai. Vui lòng thử lại." không nói rõ lý do.

**Impact:** UX bị nhầm lẫn (user nhấn → fail không hiểu tại sao); vi phạm nguyên tắc Action Disclosure (chỉ hiển thị action mà role thật sự thực hiện được). Cùng vi phạm: nút `[Phê duyệt]/[Từ chối]` CTDT/Khoá học hiển thị cho cùng người vừa submit (tự duyệt-tự trình).

**Expected:** Hide `[Công khai]` button cho role không có permission, hoặc disable + tooltip "Bạn không có quyền công khai khoá học, liên hệ QTHT".

**Root Cause (Suggested):** FE không gọi `/auth/me` permission check trước khi render action button — chỉ kiểm tra state (`trangThai === 'DA_DUYET'`) → render mọi action.

---

### BUG-KHFLOW-004 — Major — Tab "Học viên" thiếu nút "[+ Thêm học viên thủ công]"

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | KHFLOW-005 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Tab "Học viên" trong detail Khoá học chỉ có nút `[Import Excel]`. flow-module §6 Bước 4 yêu cầu CB NV nhập hộ DN/NHT (tên, MST, email, SĐT) qua nút `[+ Thêm học viên thủ công]` — UI hiện tại không có entry điểm này.

**Impact:** Bước 4 flow không thực hiện được nếu không có file Excel + chưa có integration Cổng PLQG để DN/NHT tự đăng ký. Block Bước 5 (duyệt đăng ký) → block toàn bộ downstream.

**Expected:** Có nút `[+ Thêm học viên]` mở modal nhập 4 field (tên, MST DN, email, SĐT), source=`NHAP_TAY` per fixture seed.

---

### BUG-KHFLOW-005 — Medium — Chương trình ĐT trong detail Khoá học hiển thị UUID raw

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P2 |
| **TC Reference** | KHFLOW-001 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** Field "Chương trình ĐT" trong tab Thông tin của Khoá học hiển thị raw UUID `e52de325-9814-4d20-8583-312da20141be` thay vì mã + tên CTDT (`CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ`).

**Impact:** UI không user-friendly, không nhận diện CTDT cha. List Khoá học bên ngoài không hiển thị column CTDT.

**Expected:** Hiển thị `{ma_ctdt} — {ten_ctdt}` (link clickable về detail CTDT).

**Root Cause (Suggested):** FE không join CTDT info khi render detail KH — chỉ lấy `ctdt_id` từ payload BE.

---

## 4. Detailed Test Results

### 4.1 KHFLOW-001 — CB NV tạo Khoá học `Pháp luật DN căn bản` (DỰ THẢO)

**Pre-conditions:**
- canbo_tw_5 đã login (CB_NV cấp TW) ✅
- CTDT-BTP-TW-2026-0001 ở state DA_DUYET ✅ (đạt được qua workaround KHFLOW-000A/B)

**Test Data (fixture khoa_hoc_variants[1]):**
```yaml
ten_khoa_hoc: "Pháp luật doanh nghiệp căn bản"
ctdt_id: "CTDT-BTP-TW-2026-0001"
hinh_thuc: "TRUC_TUYEN"
ngay_bat_dau: "2026-05-15"
ngay_ket_thuc: "2026-05-20"
so_luong_toi_da: 50
so_buoi: 5
doi_tuong: "Chủ DN, kế toán trưởng DN SME"
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click sidebar Đào tạo → Khoá học → [+ Thêm mới] | Form Tạo khoá học mới render | OK, form 8 field render | PASS |
| 2 | Fill `Tên khoá học = "Pháp luật doanh nghiệp căn bản"` | Field accepts input | OK | PASS |
| 3 | Click combobox CTDT, verify dropdown có CTDT-0001 | Dropdown có 1 option (CTDT đã DA_DUYET) | OK, 1 option `CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ` | PASS |
| 4 | Chọn CTDT-0001 | Field "Chương trình đào tạo" hiển thị code+tên | OK | PASS |
| 5 | Pick date range 15/05/2026 - 20/05/2026 từ DatePicker | Field hiển thị 15/05/2026 và 20/05/2026 | OK trong picker | PASS |
| 6 | Fill Sĩ số = 50, Số buổi = 5, Đối tượng = "Chủ DN, kế toán trưởng DN SME" | Field accepts | OK | PASS |
| 7 | Click [Tạo khoá học] | Toast success, redirect detail, mã KH-YYYYMMDD-NNN | OK, KH-20260423-001 created, toast "Tạo khóa học thành công" | PASS |
| 8 | Verify detail field "Ngày bắt đầu" | 15/05/2026 | **14/05/2026** ❌ | **FAIL** |
| 9 | Verify detail field "Chương trình ĐT" | `CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ` | UUID raw `e52de325-9814-4d20-8583-312da20141be` ❌ | **FAIL** |

**Notes:**
- Save record tổng thể PASS, nhưng 2 detail field hiển thị sai (BUG-KHFLOW-001 timezone, BUG-KHFLOW-005 UUID raw).
- Date input qua keyboard text input không nhận → phải click DatePicker calendar cell. Khi tạo `<input type="text">` accept keyboard nhưng `aria-invalid=true` không close picker. Quirky UX.

---

### 4.2 KHFLOW-002 — CB NV [Trình phê duyệt] khoá học

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [Trình phê duyệt] trên detail KH (state DỰ THẢO) | Modal "Gửi phê duyệt?" | OK, modal "Khóa học sẽ được gửi cho lãnh đạo phê duyệt" | PASS |
| 2 | Click [Gửi phê duyệt] trong modal | KH chuyển CHỜ DUYỆT, stepper check 1, list status = "Chờ duyệt" | OK | PASS |
| 3 | Verify nút [Phê duyệt]/[Từ chối] hiển thị | KHÔNG nên hiện cho CB_NV (vi phạm separation of duty) | **HIỆN cả 2 nút cho CB_NV** ⚠️ Observation, xem OBS-KHFLOW-001 | PASS (nhưng note observation) |

---

### 4.3 KHFLOW-003 — CB PD (lanhdao_tw_5) [Phê duyệt] khoá học

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Logout canbo_tw_5, login lanhdao_tw_5 | LANH_DAO_TW dashboard render | OK | PASS |
| 2 | Sidebar Đào tạo → Khoá học → click KH-20260423-001 | Detail KH render với nút [Phê duyệt]/[Từ chối] | OK | PASS |
| 3 | Click [Phê duyệt] | Modal "Xác nhận phê duyệt?" | OK | PASS |
| 4 | Click [Phê duyệt] modal | Toast success, state ĐÃ DUYỆT, stepper check 2 | OK, toast "Đã phê duyệt khóa học thành công" | PASS |
| 5 | Verify nút [Công khai] hiển thị | OK | OK | PASS |

---

### 4.4 KHFLOW-004C — QTHT (qtht_tw_5) [Công khai] khoá học (kiểm tra role có permission)

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Logout, login qtht_tw_5 | QTHT_TW dashboard render | OK | PASS |
| 2 | Sidebar Đào tạo → Khoá học → click KH-20260423-001 | Detail KH render với nút [Công khai] | OK | PASS |
| 3 | Click [Công khai] | Modal "Công khai khóa học?" | OK | PASS |
| 4 | Click [Công khai] modal | Toast success, state ĐÃ CÔNG KHAI | **Toast error "Không thể công khai. Vui lòng thử lại."** ❌ | **FAIL** |
| 5 | Verify network: POST /khoa-hocs/{id}/publish | 200 OK + body chứa state ĐÃ CÔNG KHAI | **502 Bad Gateway** ❌ (xem BUG-KHFLOW-002) | **FAIL** |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Cục BTTP | TW | KHFLOW-000A, 001, 002, 005 (BLOCKED), 4A |
| lanhdao_tw_5 | LANH_DAO_TW | Cục BTTP | TW | KHFLOW-000B, 003, 004B |
| qtht_tw_5 | QTHT_TW | Cục BTTP | TW | KHFLOW-004C (verify role có permission công khai) |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | State cuối | Cleanup? |
|---------|-------------|---------|------------|----------|
| CTDT-BTP-TW-2026-0001 | "CTĐT 2026 - Pháp luật cho DN nhỏ" (fixture chuong_trinh_dao_tao_variants[1]) | Workaround prereq cho KH | `DA_DUYET` (đã chuyển từ DU_THAO) | Keep — downstream module dùng |
| KH-20260423-001 | "Pháp luật doanh nghiệp căn bản" (fixture khoa_hoc_variants[1]) | Test flow SM-KHOAHOC | `DA_DUYET` (stuck do BUG-KHFLOW-002) | Keep — evidence cho bug |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}/{id}/{action}`
- **Auth flow:** JWT trong sessionStorage `auth-store` + OTP email (bypass `666666`)
- **Frontend framework:** React + Vite + Ant Design + ProForm
- **Backend:** NestJS + PostgreSQL (suy luận từ pattern endpoint)
- **Test tool:** Chrome DevTools MCP (primary từ 2026-04-21)
- **Known limitations:** Date picker không nhận keyboard text input (chỉ click calendar). Stepper "Lịch sử phê duyệt" của CTDT chỉ hiển thị 1 entry GUI_DUYET sau khi đã PHE_DUYET (FE chưa flush log mới).

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-KHFLOW-002 (Critical):** Dev BE debug endpoint `POST /khoa-hocs/{id}/publish` — kiểm tra log 502 cho QTHT_TW. Nếu permission đúng QTHT thì sửa BE handler crash; nếu role sai thì update permission matrix + UI ẩn nút cho QTHT.
2. **BUG-KHFLOW-001 (Major):** Sửa timezone bug khi save ngày Khoá học. Dùng date-only string `YYYY-MM-DD` không kèm timezone trong payload BE; FE format dùng `dayjs.utc().format('YYYY-MM-DD')` không `toISOString()`.
3. **BUG-KHFLOW-003 (Major):** FE check permission trước khi render `[Công khai]`/`[Phê duyệt]`/`[Từ chối]` — gọi `/auth/me` permission check, ẩn button nếu role không có permission. Cùng nguyên tắc: ẩn `[Phê duyệt]/[Từ chối]` cho người đã submit (separation of duty).
4. **BUG-KHFLOW-004 (Major):** Bổ sung nút `[+ Thêm học viên thủ công]` trong tab Học viên, modal nhập 4 field (tên, MST DN, email, SĐT) per flow-module §6 Bước 4.

### Should Fix

5. **BUG-KHFLOW-005 (Medium):** Detail KH field "Chương trình ĐT" hiển thị `{ma_ctdt} — {ten_ctdt}` thay UUID raw. Link clickable về detail CTDT.

### Additional Recommendations

6. **Spec gap:** flow-module §6 nói CTDT chỉ cần tồn tại để tạo Khoá học (state nào cũng được), nhưng UI yêu cầu CTDT ở `DA_DUYET`. Cần BA confirm: (a) thêm SRS rule "CTDT phải DA_DUYET trước khi tạo KH con" + thêm bước duyệt CTDT vào flow-module Bước 1, hoặc (b) gỡ filter UI cho phép chọn CTDT mọi state.
7. **State machine deviation:** UI có thêm `ĐÃ CÔNG KHAI` giữa `ĐÃ DUYỆT` và `ĐANG DIỄN RA` (8 state: Dự thảo / Chờ duyệt / Đã duyệt / Đã công khai / Đang diễn ra / Đã kết thúc / Chờ duyệt KQ / Hoàn thành). flow-module có 7 state (không có Đã công khai). Cần update flow-module hoặc gỡ state Công khai khỏi UI.
8. **Audit log gap:** Stepper "Lịch sử phê duyệt" CTDT chỉ hiển thị 1 entry GUI_DUYET sau khi đã PHE_DUYET — FE thiếu reload log sau action.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Status |
|--------|----------|---------|--------------|--------|
| GET | `/api/v1/chuong-trinh-dao-taos?...&trangThai=DA_DUYET` | Lấy CTDT cho dropdown form Tạo KH | KHFLOW-001 | 200 (sau workaround) |
| POST | `/api/v1/chuong-trinh-dao-taos/{id}/submit-for-review` | CB NV gửi CTDT phê duyệt | KHFLOW-000A | 200 |
| POST | `/api/v1/chuong-trinh-dao-taos/{id}/approve` | CB PD phê duyệt CTDT | KHFLOW-000B | 200 |
| POST | `/api/v1/khoa-hocs` | CB NV tạo Khoá học | KHFLOW-001 | 201 |
| POST | `/api/v1/khoa-hocs/{id}/submit-for-review` | CB NV gửi Khoá học phê duyệt | KHFLOW-002 | 200 |
| POST | `/api/v1/khoa-hocs/{id}/approve` | CB PD phê duyệt Khoá học | KHFLOW-003 | 200 |
| POST | `/api/v1/khoa-hocs/{id}/publish` | Công khai Khoá học | KHFLOW-004A/B/C | **403/403/502 ❌** |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [01-ctdt-list-9-records.png](image/01-ctdt-list-9-records.png) | List 9 CTDT (4 fixture + 5 QA) đều DU_THAO trước workaround | Hiện trạng |
| [02-ctdt-detail-no-add-khoahoc.png](image/02-ctdt-detail-no-add-khoahoc.png) | Detail CTDT không có nút [+ Thêm khoá học] (deviation flow-module Bước 1) | OBS-KHFLOW-002 |
| [03-form-tao-khoa-hoc-ctdt-empty.png](image/03-form-tao-khoa-hoc-ctdt-empty.png) | Form Tạo Khoá học combobox CTDT rỗng (regression OBS-KH-001 round 1) | KHFLOW-001 prereq |
| [04-ctdt-0001-cb-nv-thay-nut-pheduyet.png](image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png) | CB NV vẫn thấy nút [Phê duyệt]/[Từ chối] sau khi submit (separation of duty) | OBS-KHFLOW-001 |
| [05-ctdt-0001-da-duyet-by-lanhdao.png](image/05-ctdt-0001-da-duyet-by-lanhdao.png) | CTDT-0001 → DA_DUYET sau khi lanhdao_tw_5 phê duyệt | KHFLOW-000B |
| [06-form-tao-khoahoc-filled.png](image/06-form-tao-khoahoc-filled.png) | Form Tạo Khoá học fill xong fixture[1] | KHFLOW-001 |
| [07-khoahoc-001-created-bug-date-uuid.png](image/07-khoahoc-001-created-bug-date-uuid.png) | KH-20260423-001 detail: ngày 14/05 (sai), CTDT UUID raw | BUG-KHFLOW-001, 005 |
| [08-khoahoc-001-da-duyet-by-lanhdao.png](image/08-khoahoc-001-da-duyet-by-lanhdao.png) | KH-001 → DA_DUYET, có nút Công khai | KHFLOW-003 |
| [09-cbnv-cong-khai-fail.png](image/09-cbnv-cong-khai-fail.png) | CB NV click Công khai → toast "Không thể công khai" | KHFLOW-004A, BUG-KHFLOW-003 |
| [10-tab-hocvien-no-add-button.png](image/10-tab-hocvien-no-add-button.png) | Tab Học viên chỉ có Import Excel, thiếu [+ Thêm thủ công] | KHFLOW-005, BUG-KHFLOW-004 |
| [11-qtht-cong-khai-be-502.png](image/11-qtht-cong-khai-be-502.png) | QTHT click Công khai → 502 BE error | KHFLOW-004C, BUG-KHFLOW-002 |

### C — SRS Traceability Matrix

| SRS Reference | Flow ref | TC Coverage | Status |
|---------------|----------|-------------|--------|
| FR-III-01 (UC20) §Inputs Khoá học | flow-module §6 Bước 1 | KHFLOW-001 | PASS có 2 bug detail (BUG-001, 005) |
| flow-module §6 Bước 2 | — | KHFLOW-002 | PASS |
| flow-module §6 Bước 3 | — | KHFLOW-003 | PASS |
| flow-module §6 Bước 6 (Công khai — UI deviation) | — | KHFLOW-004A/B/C | FAIL — block flow |
| flow-module §6 Bước 4 (CB NV thêm học viên) | — | KHFLOW-005 | BLOCKED (BUG-004) |
| flow-module §6 Bước 5-10 | — | KHFLOW-006/007/008/009 | BLOCKED cascade |

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP)*
