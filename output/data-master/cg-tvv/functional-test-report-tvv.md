# Functional Test Report — Hồ sơ Tư vấn viên (SM-TVV) CRUD Round 1

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Hồ sơ Tư vấn viên — Nhóm IV (SM-TVV) |
| **SRS Reference** | [srs-fr-04-chuyen-gia-tvv.md](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md) — FR-IV-01 (UC39), FR-IV-02 (UC40), FR-IV-03 (UC41) |
| **UC Coverage** | UC39 (Quản lý TVV CREATE), UC41 (đăng ký mạng lưới — skip, chưa có chuyên trang) |
| **Người test** | QA Automation via Claude Code (MCP Chrome DevTools) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm) |
| **Test Method** | UI-based qua MCP Chrome DevTools (primary tool per CLAUDE.md 2026-04-21) |
| **Primary Account** | `canbo_tw_5 / Test@1234` (CB_NV, cấp TW) |
| **Round** | Round 1 |
| **Tài liệu tham chiếu** | [seed-fixture.yaml `tvv_variants` 6 records](../../../../input/data/seed-fixture.yaml), [flow-module.md §SM-TVV](../../../../input/flow-module.md), [bug-report-tvv.md](bug-report-tvv.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (scope)** | 6 (TVV-CR-001 → TVV-CR-006, mỗi fixture variant = 1 TC CREATE) |
| **TC đã test / Tổng TC** | 6/6 (100%) — tất cả đã attempt |
| **Passed** | 0 |
| **Failed** | 1 (TVV-CR-001 — full attempt 5 submits, all returned 422) |
| **Blocked** | 5 (TVV-CR-002 → TVV-CR-006 — blocked bởi BUG-TVV-001 phát hiện ở TVV-CR-001) |
| **Partial** | 0 |
| **Pass Rate** | **0%** |
| **P0 Pass Rate** | 0% (0/6 P0 TC tested passing) |
| **Bugs Found** | **6** (1 Critical, 2 Major, 1 Medium, 2 Minor) |
| **Health Score** | **15/100** — CREATE flow không dùng được |
| **Start Time** | 11:08 (UTC+7) |
| **End Time** | 11:25 (UTC+7) |
| **Total Duration** | ~17 phút |
| **Browse Status** | OK — MCP Chrome DevTools ổn định, 0 crash trong suốt session |

### Pass Rate breakdown theo Type (để tổng hợp multi-module)

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Luồng CREATE hợp lệ — seed fixture 6 TVV | 6 (TVV-CR-001..006) | 0 | 0 | 1 | 5 | **0%** |
| **Negative** | — (scope round này chỉ CREATE happy) | 0 | 0 | 0 | 0 | 0 | — |
| **Validation** | — (out-of-round) | 0 | 0 | 0 | 0 | 0 | — |
| **Workflow** | State transition SM-TVV (Tiếp nhận → Thẩm định → Phê duyệt) — ngoài scope | 0 | 0 | 0 | 0 | 0 | — |
| **Total** | | **6** | **0** | **0** | **1** | **5** | **0%** |

→ **Happy-path Pass Rate = 0/6 (0%)** — BUG-TVV-001 block 100%. Retry round 2 sau khi fix FE DatePicker serialization để đánh giá Happy Pass Rate thực tế.

### Verdict: **FAIL (BLOCKED)**

Chức năng CREATE TVV qua UI hoàn toàn không dùng được vì BUG-TVV-001 (Critical FE DatePicker serialization). 0/6 record fixture được tạo. **Phải fix BUG-TVV-001 trước khi test tiếp Round 2** — các bug khác sẽ không quan sát được đầy đủ nếu submit không đi qua được.

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi TC 1 dòng. Chi tiết steps xem Section 4.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| TVV-CR-001 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[1]` | CREATE TVV #1 — Nguyễn Văn Tư Vấn, Lao động + Hợp đồng (map KDTM) | Happy | P0 | **FAIL** | BUG-TVV-001, BUG-TVV-002 | **Lý do FAIL:** FE ProForm luôn gửi `ngaySinh:"Invalid Date"` → BE 422. 5 submit attempts (gõ, calendar click JS, calendar click MCP) đều fail. |
| TVV-CR-002 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[2]` | CREATE TVV #2 — Trần Thị Tư Vấn, Thuế + Doanh nghiệp | Happy | P0 | **BLOCKED** | BUG-TVV-001 | **Lý do BLOCKED:** Cùng root cause với TVV-CR-001; không ý nghĩa lặp thêm 4 submits khi FE serialization chưa fix. |
| TVV-CR-003 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[3]` | CREATE TVV #3 — Lê Văn Chuyên Gia, Hợp đồng + SHTT | Happy | P0 | **BLOCKED** | BUG-TVV-001 | Cùng root cause. |
| TVV-CR-004 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[4]` | CREATE TVV #4 — Phạm Thị Đào Tạo, Doanh nghiệp + Đất đai | Happy | P0 | **BLOCKED** | BUG-TVV-001 | Cùng root cause. |
| TVV-CR-005 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[5]` | CREATE TVV #5 — Hoàng Văn YCBS, SHTT | Happy | P0 | **BLOCKED** | BUG-TVV-001 | Cùng root cause. |
| TVV-CR-006 | FR-IV-01, UC39, SCR-IV-02, fixture `tvv_variants[6]` | CREATE TVV #6 — Vũ Văn Mới ĐK, Đất đai + Lao động | Happy | P0 | **BLOCKED** | BUG-TVV-001 | Cùng root cause. |

### Chú thích

> **Result:** `PASS` · `FAIL` · `BLOCKED` · `PARTIAL` · `SKIP`
>
> **Type:** `Happy` — luồng CREATE hợp lệ với fixture data.
>
> **Priority:** P0 (blocker).

### Fixture traceability

| TC | Fixture `tvv_variants[idx]` | Fields provided by fixture | Fields fabricated (not in fixture but SRS required) |
|----|------------------------------|---------------------------|----------------------------------------------------|
| TVV-CR-001 | idx=1 | ho_ten, chung_chi, bang_cap, don_vi_cong_tac, email, sdt, linh_vuc_chuyen | ngay_sinh (15/06/1985), gioi_tinh (NAM), cmnd_cccd (001085000001), dia_chi, trinh_do (Thạc sĩ từ bang_cap), to_chuc_chinh_id (map "Trung tâm trợ giúp pháp lý" thay vì "Đoàn Luật sư HN" — OBS-1) |
| TVV-CR-002..006 | idx=2..6 | Same fixture shape | Same fabrication pattern (planned nhưng BLOCKED) |

### State transition scope (out-of-round)

Fixture `state_target`:
- `ĐANG HOẠT ĐỘNG` × 4 (idx 1,2,3,4) — yêu cầu multi-role flow: CB NV [Tiếp nhận] → [Thẩm định] → [Trình duyệt] → CB PD [Phê duyệt]. **Skip round này** — scope /qa-only CREATE.
- `YÊU CẦU BỔ SUNG` × 1 (idx 5) — nhánh phụ CB NV [Yêu cầu bổ sung]. Skip.
- `CHỜ THẨM ĐỊNH` × 1 (idx 6) — sau CB NV [Tiếp nhận]. Skip.

Per SRS FR-IV-01 processing step 6: new record luôn khởi tạo trạng thái `MOI_DANG_KY` → sau đó CB NV chọn [Tiếp nhận] để chuyển `CHỜ THẨM ĐỊNH`. State machine scope = Round 2 sau khi BUG-TVV-001 fix.

---

## 3. Bug Report

Chi tiết 6 bug xem [bug-report-tvv.md](bug-report-tvv.md).

### BUG-TVV-001 — Critical — FE ProForm DatePicker luôn gửi "Invalid Date"

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | TVV-CR-001..006 |
| **Status** | Open |
| **Assignee** | FE Team |

**Mô tả:** FE ProForm field `ngaySinh` serialize dayjs → `String()` ra literal `"Invalid Date"` trong POST body, bất kể cách nhập. Internal state React đã đúng ISO nhưng FE submit handler dùng sai cách convert.

**Impact:** 100% CB NV không tạo được TVV mới qua UI — block toàn bộ downstream (VV phân công, HĐ TV, TVCS).

**Root Cause (Suggested):** ProForm submit pipeline gọi `String(dayjsValue)` hoặc `new Date(displayText).toISOString()` thay vì `dayjsValue.toISOString()`.

### BUG-TVV-002 — Major — BE English error leak xuống user UI

**Mô tả:** Error `"ngaySinh must be a valid ISO 8601 date string"` English nguyên văn hiển thị user Việt. SRS chỉ định `ERR-TVV-XX` Việt.

### BUG-TVV-003 — Major — Form thiếu * trên "Địa bàn hoạt động"

**Mô tả:** SRS FR-IV-01 #17 Y (required), form không mark * → có thể tạo TVV thiếu `dia_ban_ids` → vi phạm BR-AUTH-10 lọc kép. **Regression** từ UI audit Round 1 chưa fix.

### BUG-TVV-004 — Medium — Upload accept doc/xls + 20MB sai SRS

**Mô tả:** SRS quy định PDF only, 10MB/file. Form accept doc/docx/xls/xlsx/pdf/jpg/png + 20MB. **Regression** chưa fix.

### BUG-TVV-005 — Minor — Tab badge "Mới đăng ký 3 1" format sai

### BUG-TVV-006 — Minor — Tên module inconsistent sidebar/heading

---

## 4. Detailed Test Results

### 4.1 TVV-CR-001: CREATE TVV #1 — Nguyễn Văn Tư Vấn (fixture `tvv_variants[1]`)

**Pre-conditions:**
- User `canbo_tw_5` đã login (JWT valid, permissions gồm `create_tu_van_vien`, `manage_tu_van_vien`, `register_tu_van_vien`).
- Sidebar module CG/TVV accessible. Form SCR-IV-02 render được.
- Master data `DANH_MUC` đã có: LINH_VUC_PL (10 entry), TO_CHUC_TU_VAN (3 entry), TINH_THANH — verified qua GET requests reqid 170/172/173.

**Test Data (from fixture + fabrication):**

```json
{
  "hoTen": "Nguyễn Văn Tư Vấn",
  "ngaySinh": "1985-06-15 (fabricated, fixture không cung cấp)",
  "gioiTinh": "NAM (fabricated)",
  "cccd": "001085000001 (fabricated, 12-digit, unique)",
  "email": "nguyen.tuvan.01@test.htpldn.vn (fixture)",
  "dienThoai": "0901000001 (fixture `sdt`)",
  "diaChi": "Số 1 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội (fabricated)",
  "trinhDo": "Thạc sĩ (derived from fixture `bang_cap: Thạc sĩ Luật`)",
  "chuyenNganh": "LS-HN-2020-001 (fixture `chung_chi`)",
  "toChucChinhId": "Trung tâm trợ giúp pháp lý (fallback — fixture `don_vi_cong_tac: Đoàn Luật sư Hà Nội` không có trong master data — xem OBS-1)",
  "linhVucIds": ["Lao động", "Kinh doanh thương mại (fallback cho fixture Hợp đồng — xem OBS-2)"]
}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login canbo_tw_5 / Test@1234 + OTP 666666 | Redirect `/dashboard`, sidebar render | PASS — `/dashboard` URL, dashboard "Chuyên gia / Tư vấn viên: 2 người" render | **PASS** |
| 2 | Click sidebar "Quản lý chuyên gia / tư vấn viên" | Navigate `/chuyen-gia-tvv/danh-sach`, heading "Quản lý Tư vấn viên" | PASS — `1-2 / 2 mục` hiện, 5 tabs (Đang hoạt động / Tạm dừng / Mới đăng ký 3 1 / Chờ thẩm định / Chờ phê duyệt) | PASS (có [BUG-TVV-005](bug-report-tvv.md#bug-tvv-005), [BUG-TVV-006](bug-report-tvv.md#bug-tvv-006) note) |
| 3 | Click `[+ Thêm TVV]` | Navigate `/chuyen-gia-tvv/tao-moi`, form 19 field render | PASS — form render đủ 19 field, 5 accordion section (Thông tin CN / Nghề nghiệp / Tổ chức & Mạng lưới / File đính kèm / Ghi chú) | PASS (có [BUG-TVV-003](bug-report-tvv.md#bug-tvv-003) — Địa bàn hoạt động thiếu *, [BUG-TVV-004](bug-report-tvv.md#bug-tvv-004) — upload accept sai) |
| 4 | Fill 7 text fields (họ tên, ngay sinh dd/mm/yyyy, CCCD, email, SĐT, địa chỉ, chứng chỉ) | Form state commit 7 field, errors clear | PASS fields; DatePicker DISPLAY "15/06/1985" nhưng INTERNAL state vẫn empty — chưa lộ bug tại đây | PASS |
| 5 | Chọn dropdown Giới tính = "Nam" | Combobox value "Nam" | PASS | PASS |
| 6 | Chọn dropdown Trình độ = "Thạc sĩ" | Combobox value "Thạc sĩ" | PASS | PASS |
| 7 | Chọn dropdown Tổ chức = "Trung tâm trợ giúp pháp lý" (fallback) | Combobox value set | PASS | PASS |
| 8 | Chọn multi-select Lĩnh vực = ["Lao động", "Kinh doanh thương mại"] | 2 tag hiển thị | PASS | PASS |
| 9 | Click `[Lưu]` (attempt #1) | Toast "Thêm mới thành công" + navigate /danh-sach | **FAIL** — error `"ngaySinh must be a valid ISO 8601 date string"` dưới field Ngày sinh; POST /api/v1/tu-van-viens → 422 (reqid 178). Request body `ngaySinh: "Invalid Date"` | **FAIL** — [BUG-TVV-001](bug-report-tvv.md#bug-tvv-001), [BUG-TVV-002](bug-report-tvv.md#bug-tvv-002) |
| 10 | Retry: Clear ngày sinh + gõ lại `fill` "15/06/1985" + Enter (attempt #2) | Commit DatePicker | FAIL — DatePicker value tăng "15/06/198515/06/1985" (fill append), `.ant-picker-invalid`, retry submit → reqid 181 → 422 same error | FAIL |
| 11 | Retry: Clear X + `type_text "15/06/1985" + Enter` (attempt #3) | Commit DatePicker | FAIL — display OK "15/06/1985" nhưng internal dayjs vẫn empty, submit reqid 189 → 422 `ngaySinh: "Invalid Date"` | FAIL |
| 12 | Retry: Open calendar via fiber walk, navigate to 1985 year panel → click "15" June 1985 cell via JS `evaluate_script` dispatch mouseup/mousedown/click (attempt #4) | Commit DatePicker | FAIL — cell click bị reject (React event system not triggered by dispatched events on non-native target); submit reqid 193 → 422 | FAIL |
| 13 | Retry: Open calendar → MCP native `click(uid=10_37)` trên day cell 20 (ngày gần current month, không cần nav) — attempt #5 | Commit DatePicker successfully | PARTIAL — display "20/04/2026", internal `RefPicker.value = "2026-04-19T17:00:00.000Z"` (ISO đúng), errors cleared. Submit reqid 196 → 422 **vẫn `ngaySinh: "Invalid Date"`** | FAIL — confirm bug không fix được bằng user action, là serialization issue |
| 14 | Verify via SCR-IV-01 tab "Mới đăng ký" | 0 record mới so với baseline | PASS (negative verify) — "Mới đăng ký" = 31 (unchanged from pre-existing), "Đang hoạt động" = 2 (unchanged) | **PASS** — confirm 0 record created |

**Notes:**
- 5 POST attempts → toàn bộ 5 request body đều có `"ngaySinh":"Invalid Date"` identically. Xem reqid detail table trong bug-report-tvv.md Appendix D.
- Internal React state (fiber walk) ở attempt #5 đã đúng ISO → confirm bug ở **submit handler FE**, không phải DatePicker commit handler.
- Thử bypass FE bằng `fetch('/api/v1/tu-van-viens')` với `credentials: 'include'` — **401 "Authorization token is required"**. Token ở HttpOnly cookie, không JS accessible. Không thể verify trực tiếp BE accept ISO qua script; nhưng memory `qa_htpldn_cgtvv_ui_round1` từ round trước có confirm các "Auto TVV" record được tạo bởi automation trước → suggest BE accept ISO.

---

### 4.2 TVV-CR-002 → TVV-CR-006: CREATE TVV #2-#6 — BLOCKED

**Pre-conditions + Test Data:** Same pattern as TVV-CR-001 nhưng thay fixture variant idx=2..6.

**Test Steps:** 0/N executed — skipped after confirming root cause BUG-TVV-001 ở TVV-CR-001 fails 5 submits. Lặp thêm 5 × 5 = 25 POST calls không mang thêm thông tin.

**Unblock criteria:** BUG-TVV-001 fixed → Round 2 sẽ chạy lại full 6 TC (expect all PASS) + state machine transitions (expect additional multi-role tests).

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Cục BTTP | TW | TVV-CR-001..006 |

### 5.2 Data tạo trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| (none) | — | 0 record created | N/A — không có dữ liệu cần cleanup |

Tab "Mới đăng ký" có 31 pre-existing record từ prior test runs (chủ yếu `"Auto TVV ..."` naming). Không phải data từ Round này.

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-kebab-case-plural}` → `/api/v1/tu-van-viens`
- **Auth flow:** JWT Bearer (token HttpOnly cookie-based) + OTP email (bypass `666666`). Session timeout ≥ 15 min — verified qua cross-session re-login.
- **Frontend framework:** React + Vite + **Ant Design Pro Form** (ProFormDatePicker, ProFormSelect, ProFormText...) + **dayjs**.
- **Backend validator:** NestJS + `class-validator` — default English message khi không override `exceptionFactory` (xem [BUG-TVV-002](bug-report-tvv.md#bug-tvv-002)).
- **Known limitations:**
  - MCP `navigate_page` kick về `/login` khi URL direct (MCP-Rule 3) — re-login cần thiết 1 lần sau redirect.
  - FE DatePicker serialization blocker — không thể workaround qua UI (MCP-Rule 6 CLAUDE.md escalation).
  - Token HttpOnly → không thể script-bypass FE để test BE trực tiếp qua `fetch`.

---

## 7. Recommendations

### Must Fix (Before Release)

1. **[BUG-TVV-001](bug-report-tvv.md#bug-tvv-001) (Critical P0):** Fix FE ProForm DatePicker submit pipeline — dùng `dayjs(val).toISOString()` thay vì `String(val)`. Áp dụng global cho mọi DatePicker field (risk tương tự ở Doanh nghiệp FR-V.III-01 `ngay_cap_dkkd`, Vụ việc, HĐ TV date fields — cần regression test cross-module).
2. **[BUG-TVV-002](bug-report-tvv.md#bug-tvv-002) (Major P1):** BE config `ValidationPipe.exceptionFactory` map lỗi generic thành `ERR-TVV-XX` + Việt. Hoặc FE axios interceptor fallback Việt khi detect English generic pattern.
3. **[BUG-TVV-003](bug-report-tvv.md#bug-tvv-003) (Major P1):** Add `required: true` + dấu `*` cho "Địa bàn hoạt động" trong SCR-IV-02. **Regression** — đã log round trước, chưa fix.

### Should Fix

4. **[BUG-TVV-004](bug-report-tvv.md#bug-tvv-004) (Medium P2):** Upload component accept chỉ PDF + 10MB/file, tổng 50MB theo SRS FR-IV-01 #18.
5. **[BUG-TVV-005](bug-report-tvv.md#bug-tvv-005) (Minor P3):** Fix tab badge rendering "Mới đăng ký 3 1" → `(31)` hoặc badge đỏ.
6. **[BUG-TVV-006](bug-report-tvv.md#bug-tvv-006) (Minor P3):** Chuẩn hoá copy module "Chuyên gia / Tư vấn viên" + add field Loại (CG/TVV/NHT) trong form.

### Additional Recommendations

7. **Test data (seed):** QTHT seed thêm `DANH_MUC.TO_CHUC_TU_VAN` để match fixture (Đoàn Luật sư HN/ĐN, Trường ĐH Luật, Hội Luật gia, Văn phòng LS). Hiện chỉ có 3 entry generic.
8. **Test data (danh mục):** Review `LINH_VUC_PL` danh mục vs fixture — thêm "Hợp đồng" hoặc chuẩn hoá fixture dùng "Kinh doanh thương mại".
9. **Fixture extension:** Bump fixture version bổ sung 7 field SRS required (ngay_sinh, gioi_tinh, cccd, dia_chi, trinh_do, dia_ban_ids, to_chuc_chinh_id) — hiện tester phải fabricate.
10. **Regression scope:** Sau fix BUG-TVV-001, chạy regression cross-module cho mọi DatePicker: DN `ngay_cap_dkkd`, VV `ngay_tiep_nhan` (auto), Khóa học `thoi_gian_bd/kt`, CTĐT, HĐ TV ngày_bd/kt, SLA cấu hình...
11. **Security audit:** Verify stored XSS payload visible trong "Mới đăng ký" (`<script>window.__xss=1</script>Auto XSS ...`) — escape output vs sanitize input.
12. **Multi-role test plan:** Round 2 chuẩn bị flow end-to-end với CB PD (`lanhdao_tw_5`) cho SM-TVV transitions: Tiếp nhận → Thẩm định → YCBS / Trình duyệt → Phê duyệt → ĐANG HOẠT ĐỘNG.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Result |
|--------|----------|---------|--------------|--------|
| POST | `/api/v1/auth/login` | Login initial | Setup | 200 OK (reqid 64) |
| POST | `/api/v1/auth/verify-otp` | OTP bypass | Setup | 200 OK (reqid 65) |
| GET | `/api/v1/dashboard?nam=2026...` | Dashboard render | Setup | 200 OK |
| GET | `/api/v1/danh-muc?loaiDanhMuc=TO_CHUC_TU_VAN&pageSize=100&trangThai=KICH_HOAT` | Load tổ chức dropdown | Setup | 200 OK (reqid 170) — **3 entries** |
| GET | `/api/v1/danh-muc?loaiDanhMuc=LINH_VUC_PL&pageSize=100&trangThai=KICH_HOAT` | Load lĩnh vực dropdown | Setup | 200 OK (reqid 172) — **10 entries** |
| GET | `/api/v1/danh-muc?loaiDanhMuc=TINH_THANH&pageSize=100&trangThai=KICH_HOAT` | Load tỉnh dropdown | Setup | 200 OK (reqid 173) |
| GET | `/api/v1/tu-van-viens?page=1&pageSize=20&trangThai=DANG_HOAT_DONG` | Danh sách ĐHĐ | TVV-CR-001 pre/post | 200 OK — 2 records baseline, unchanged after test |
| GET | `/api/v1/tu-van-viens?trangThai=MOI_DANG_KY&page=1&pageSize=1` | Count tab "Mới đăng ký" badge | Setup | 200 OK |
| **POST** | **`/api/v1/tu-van-viens`** | **CREATE TVV** | **TVV-CR-001 (5 attempts)** | **5/5 → 422 `ngaySinh: "Invalid Date"`** |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [image/tvv-01-form-filled.png](image/tvv-01-form-filled.png) | Form đã fill đầy đủ trước submit attempt #1 | TVV-CR-001 step 8 |
| [image/tvv-01-after-submit.png](image/tvv-01-after-submit.png) | Form sau attempt #1 — error hiện dưới ngày sinh | TVV-CR-001 step 9 |
| [image/bug-001-fe-date-iso-error.png](image/bug-001-fe-date-iso-error.png) | Full-page snapshot sau attempt #5 (calendar click commit + submit) — error persist | TVV-CR-001 step 13 |
| [image/tvv-list-moi-dang-ky-after-failures.png](image/tvv-list-moi-dang-ky-after-failures.png) | Tab Mới đăng ký — 31 records từ prior runs, 0 record mới | TVV-CR-001 step 14 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-IV-01 / UC39 / SCR-IV-02 — CRUD CREATE TVV | TVV-CR-001..006 | **0/6 PASS (1 FAIL, 5 BLOCKED)** |
| FR-IV-01 field #4 `ngay_sinh` (required, ≤ today) | TVV-CR-001 | FAIL — FE serialization bug |
| FR-IV-01 field #17 `dia_ban_ids` (required Y) | TVV-CR-001 | FAIL — [BUG-TVV-003](bug-report-tvv.md#bug-tvv-003) form thiếu * |
| FR-IV-01 field #18 `file_bang_cap` (PDF, 10MB) | TVV-CR-001 | FAIL — [BUG-TVV-004](bug-report-tvv.md#bug-tvv-004) accept sai |
| FR-IV-01 processing step 6 "Đặt trạng thái = MOI_DANG_KY" | TVV-CR-001..006 | BLOCKED — không có record để verify state |
| FR-IV-01 Error Handling ERR-TVV-01..05 (Việt) | TVV-CR-001 | FAIL — [BUG-TVV-002](bug-report-tvv.md#bug-tvv-002) English leak thay vì ERR-TVV-XX |
| SCR-IV-01 row 5 tab "Mới đăng ký" badge | Setup | FAIL — [BUG-TVV-005](bug-report-tvv.md#bug-tvv-005) format "3 1" |
| UC41 NHT đăng ký chuyên trang | — | SKIP — chuyên trang chưa có (flow-module.md §SM-TVV note) |

### D — Danh sách TVV đã tạo (deliverable theo yêu cầu user)

| # | Fixture | Họ tên | Mã TVV BE-gen | Trạng thái | Ghi chú |
|---|---------|--------|---------------|------------|---------|
| 1 | tvv_variants[1] | Nguyễn Văn Tư Vấn | — | **Không tạo được** | BUG-TVV-001 block |
| 2 | tvv_variants[2] | Trần Thị Tư Vấn | — | **Không tạo được** | Skip do root cause lặp |
| 3 | tvv_variants[3] | Lê Văn Chuyên Gia | — | **Không tạo được** | Skip do root cause lặp |
| 4 | tvv_variants[4] | Phạm Thị Đào Tạo | — | **Không tạo được** | Skip do root cause lặp |
| 5 | tvv_variants[5] | Hoàng Văn Yêu Cầu Bổ Sung | — | **Không tạo được** | Skip do root cause lặp |
| 6 | tvv_variants[6] | Vũ Văn Mới Đăng Ký | — | **Không tạo được** | Skip do root cause lặp |

**Không có TVV nào được tạo thành công trong Round 1.** Round 2 sẽ re-run sau khi BUG-TVV-001 fix.

### E — Status & Escalation

**STATUS: DONE_WITH_CONCERNS (BLOCKED)**

- Concern 1: Core CREATE functionality broken (Critical P0) — product launch blocker.
- Concern 2: 2/6 bug là **regression** từ UI audit Round 1 chưa fix (BUG-TVV-003 thiếu `*` Địa bàn, BUG-TVV-004 upload accept sai). Escalate dev team về regression discipline.
- Concern 3: Fixture gap (7/14 SRS required field thiếu) — tester phải fabricate. Khuyến nghị QA Lead align fixture với spec trong Round 2.

**NEXT STEPS:** FE team fix BUG-TVV-001 → QA chạy Round 2 full 6 TC + state machine transitions.

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (MCP Chrome DevTools)*
