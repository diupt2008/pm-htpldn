# Test Case Execution Report — [TÊN MODULE / FOLDER]

> **Loại report:** Báo cáo kết quả **chạy Test Case chi tiết** (từ folder TC có nhiều file).
> Khác với `functional-test-report-template.md` (báo cáo theo scope functional của 1 module).
> Khi nào dùng template này: bạn đã có folder TC chi tiết (vd `test-cases/QTHT/DM_dung-chung/`) và muốn báo cáo tiến độ + kết quả chạy từng file TC.

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | [vd: QTHT — Danh mục dùng chung] |
| **TC Folder** | [vd: output/test-cases/QTHT/DM_dung-chung/] |
| **Người test** | [QA name / QA Automation via Claude Code] |
| **Ngày chạy** | [YYYY-MM-DD] |
| **Môi trường** | [URL — vd http://103.172.236.130:3000/] |
| **Test Method** | UI (Playwright `$B chain`) / API (curl) / Manual / Hybrid |
| **Primary Account(s)** | [vd: qtht_tw, canbo_tw — role, cấp] |
| **Round** | [Round N] |
| **Tài liệu tham chiếu** | [00-test-plan-overview.md](../...) + test-strategy §3 §5 §9 §10 |

---

## 1. Tổng quan — Dashboard (đọc 10 giây biết ngay)

### Test Case Status

| Trạng thái | Số lượng | % |
|-----------|---------:|---:|
| **Tổng TC (spec)** | **N** | 100% |
| 🏃 **TC đã chạy** (Pass + Fail) | 0 | 0% |
| ✅ **Passed** | 0 | 0% |
| ❌ **Failed** | 0 | 0% |
| 🚫 **Blocked** | 0 | 0% |
| ⚠️ **Partial** | 0 | 0% |
| ⏭️ **Skipped** | 0 | 0% |
| ⏳ **Not Run** | N | 100% |

**Tiến độ:** `TC đã chạy / Tổng TC` = **0 / N (0%)**
**Pass Rate** (tính trên TC đã chạy, không tính Not Run / Skipped) = **0%**
**P0 Pass Rate** = **0% (0/0 P0 đã chạy)**

### Bugs Found

| Severity | Count |
|----------|------:|
| 🔴 Critical | 0 |
| 🟠 Major | 0 |
| 🟡 Medium | 0 |
| 🔵 Minor | 0 |
| **Tổng bug** | **0** |

### Timing

| Trường | Giá trị |
|--------|---------|
| Start | HH:MM (UTC+7) |
| End | HH:MM (UTC+7) |
| Duration | XX phút |
| Browse Status | OK / BROKEN ([lý do nếu BROKEN]) |

### Verdict: **PASS / FAIL / CONDITIONAL PASS / IN PROGRESS**

> [1–2 câu kết luận. Ví dụ: "CONDITIONAL PASS — 85% Pass Rate, còn 2 Major bug ở module cơ quan đơn vị cần fix trước release."]

---

## 2. Breakdown theo TC File

> Mỗi file TC trong folder → 1 dòng. Đọc bảng này biết ngay **file nào đỏ**.

| # | TC File | Tổng TC | ✅ Pass | ❌ Fail | 🚫 Block | ⚠️ Partial | ⏳ Not Run | Pass Rate | Verdict |
|---|---------|--------:|--------:|--------:|---------:|------------:|------------:|----------:|---------|
| 1 | [01-TC-TPL-CRUD-chung.md](../../test-cases/.../01-TC-TPL-CRUD-chung.md) | 0 | 0 | 0 | 0 | 0 | 0 | 0% | — |
| 2 | [02-TC-chuong-trinh-ho-tro.md](...) | 0 | 0 | 0 | 0 | 0 | 0 | 0% | — |
| 3 | [03-TC-tinh-trang-vu-viec.md](...) | 0 | 0 | 0 | 0 | 0 | 0 | 0% | — |
| ... | ... | | | | | | | | |
| | **TỔNG** | **N** | **0** | **0** | **0** | **0** | **N** | **0%** | — |

---

## 3. Test Results — Chi tiết từng TC (full step + expected + actual)

> Format: **1 bảng lớn/mỗi file TC** — mỗi TC một dòng, mọi thông tin trọng yếu (Tên testcase / Step / Expected / Actual / Result / Bug) đều inline trong bảng để reader scan dọc không cần click / mở file TC gốc. TC phức tạp nhiều step: viết Step+Expected numbered `1) ... 2) ... 3) ...` trong cùng 1 cell. Reproduction + root cause của bug → xem `bug-report-[module].md`.

**Legend Actual:** ✅ match expected · ❌ deviate (có bug) · ⚠️ không verify được · ⏭️ skipped vì blocked.

> **Quy tắc map Result ↔ Bug (BẮT BUỘC, dùng đúng semantics):**
> - ✅ **PASS** / ⏭️ **SKIPPED** / ⏳ **NOT RUN** → cột Bug = `—`.
> - ❌ **FAIL** → cột Bug = **bắt buộc** Bug ID trực tiếp expose bởi TC này (actual đã verify được và lệch expected).
> - ⚠️ **PARTIAL** → cột Bug = Bug ID cho phần lệch expected (phần PASS không tính bug).
> - 🚫 **BLOCKED** → cột Bug = `—`. TC **chưa chạy được** nên chưa có bug riêng để gán. Root cause cascade (bug của TC khác / thiếu data / crash env) ghi ở **§5 Blocked / Not Run**.
> - Nguyên tắc: 1 bug gốc block nhiều TC → chỉ TC đầu tiên trực tiếp expose bug ghi **FAIL + Bug ID**; các TC cascade ghi **BLOCKED + `—`** + §5 ghi "cascade do BUG-XXX".
> - Anti-pattern (KHÔNG làm): `Result=BLOCKED, Bug=BUG-XYZ` — sai semantics, khiến bug tracking đếm trùng và che mờ scope kiểm thử thực tế.

### 3.1 File `01-TC-TPL-CRUD-chung.md`

**Precondition chung:** User QTHT đã đăng nhập, ở danh mục LINH_VUC_PL (nêu precondition riêng trong cell nếu TC khác biệt).

| TC ID | Tên testcase | Type | Priority | Step | Expected | Actual | Result | Bug | Evidence |
|-------|-------------|------|----------|------|----------|--------|--------|-----|----------|
| TC-01-001 | Thêm danh mục hợp lệ | Happy | P0 | Click [+ Thêm mới] → điền ma="DM-TEST-01", ten="DM test", mo_ta="Test case", thu_tu=10, trang_thai=KICH_HOAT → click [Lưu]/[Đồng ý] | 1) Modal/Drawer mở với field trống · 2) Drawer đóng sau submit · 3) Row mới hiển thị · 4) Toast success · 5) AUDIT_LOG ghi CREATE | ✅ Tất cả 5 behavior đúng | ✅ **PASS** | — | [screenshots/01-list.png](screenshots/01-list.png) |
| TC-01-002 | Thêm DM trùng mã | Negative | P0 | Precondition: đã có DM ma="DM-TEST-01". Nhập ma="DM-TEST-01" (trùng) + ten="DM khác" → click [Lưu] | ERR-DM-01 "Mã '{X}' đã tồn tại trong danh mục {Y}" · KHÔNG tạo duplicate | ❌ KHÔNG trigger validation · tạo duplicate record trong DB | ❌ **FAIL** | BUG-DM-001 | [screenshots/02-err.png](screenshots/02-err.png) |
| TC-01-003 | Xóa DM đang tham chiếu | Negative | P0 | Precondition: DM tham chiếu bởi record khác. Click [Xóa] → confirm | Lỗi ERR-DM-02 "Đang có N bản ghi tham chiếu" · row vẫn còn | ⏭️ Không có seed data record đang tham chiếu | 🚫 **BLOCKED** | — | — |

---

> **Template guidance:**
> - **1 TC = 1 dòng** trong bảng này. Giữ Step + Expected đủ chi tiết để người đọc không cần mở file TC gốc.
> - Step phức tạp nhiều bước: gộp bằng `→` (tuần tự) hoặc numbered `1) ... 2) ...` trong cùng cell.
> - Expected nhiều behavior: dùng `·` để ngăn cách, hoặc numbered `1) ... 2) ...`.
> - Actual ngắn gọn: ✅ OK / ❌ <hiện tượng thực tế> / ⚠️ <lý do không verify> / ⏭️ <lý do blocked>.
> - Nếu TC có **Precondition khác default chung**, nêu ngay đầu cell Step (prefix "Precondition: ...").
> - Nếu data test adapted vs spec (vd spec nói "Luật Doanh nghiệp" nhưng seed là "Kinh doanh thương mại") → nêu rõ trong cell Step.
> - BLOCKED TC vẫn giữ 1 dòng với Step/Expected đầy đủ để rõ sẽ test cái gì khi unblock.

### 3.2 File `02-TC-chuong-trinh-ho-tro.md`

[Repeat cùng pattern bảng trên cho mỗi file TC — 1 file TC = 1 bảng]

---

## 4. Bug Summary (inline)

> Tóm tắt 1 dòng/bug. Reproduction + evidence đầy đủ → [bug-report-[module].md](bug-report-[module].md).

| Bug ID | Severity | Priority | TC Ref | Tóm tắt | Status |
|--------|----------|----------|--------|---------|--------|
| BUG-DM-001 | Major | P0 | TC-01-002 | ERR-DM-01 không trigger khi thêm DM trùng mã | Open |
| BUG-DM-002 | Minor | P2 | TC-04-007 | Toast message lỗi spelling "xoá" vs "xóa" | Open |
| ... | | | | | |

---

## 5. Blocked / Not Run — lý do (nếu có)

| TC ID | Trạng thái | Lý do | Cần làm gì để unblock |
|-------|-----------|-------|------------------------|
| TC-01-003 | BLOCKED | Thiếu seed data record đang tham chiếu | Dev seed 1 record dùng DM-LINH-VUC-PL-01 |
| TC-07-015 | NOT RUN | Module chưa deploy Round 3 | Chờ deploy FE build #128 |
| ... | | | |

---

## 6. Chú thích & Quy ước

**Result:**
- ✅ **PASS** — đạt 100% expected behavior
- ❌ **FAIL** — có bug, link Bug ID
- 🚫 **BLOCKED** — không chạy được (thiếu data/dependency/env/crash)
- ⚠️ **PARTIAL** — một phần PASS, phần còn lại chưa verify được
- ⏭️ **SKIPPED** — chủ động bỏ (ngoài scope round này / duplicate)
- ⏳ **NOT RUN** — chưa chạy (ghi lý do ở §5 nếu blocker)

**Priority:** `P0` (bắt buộc) / `P1` (quan trọng) / `P2` (nên có) / `P3` (tùy thời gian)

**Type:** `Happy` / `Negative` / `Edge` / `Guard` / `Validation` / `Workflow` / `Authorization` / `Integration`

**Severity bug:** theo test-strategy §10 — Critical / Major / Medium / Minor

---

## 7. Recommendations (optional — điền nếu có)

### Must fix trước release
1. **BUG-DM-001 (Major):** [gợi ý fix]

### Should fix
2. **BUG-DM-002 (Minor):** [gợi ý]

### Cải thiện TC / process
- [vd: Cần seed data DM đang tham chiếu để unblock TC-01-003]
- [vd: TC-04 cần bổ sung case validation max length]

---

## 8. Appendix

### A — Evidence

| File | Mô tả | TC Ref |
|------|-------|--------|
| [screenshots/01-dm-list.png](screenshots/01-dm-list.png) | Danh sách DM sau CRUD | TC-01-001 |
| [screenshots/02-err-trung-ma.png](screenshots/02-err-trung-ma.png) | Cho phép tạo trùng mã (bug) | TC-01-002 |
| [logs/api-calls.har](logs/api-calls.har) | HAR network toàn session | all |

### B — Tài khoản dùng

| Username | Role | Cấp | Dùng cho TC |
|----------|------|-----|-------------|
| qtht_tw | QTHT | TW | TC-01..TC-10 (CRUD) |
| canbo_tw | CB_NV | TW | TC-XX (R-only authz) |

### C — SRS Traceability (nếu cần)

| SRS Ref | TC Coverage | Status |
|---------|-------------|--------|
| FR-VIII-01 (UC99) | TC-01-001..005 | 4/5 PASS (1 FAIL) |
| BR-DATA-01 (soft delete) | TC-01-006, TC-04-012 | 2/2 PASS |

---

*Report generated: [YYYY-MM-DD] | [QA name / QA Automation via Claude Code]*
