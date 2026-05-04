# Smoke Test Report — [Round N]

> **Mục đích:** Gate check trước functional. PASS = module đủ khỏe để chạy Lệnh 2 (data readiness). FAIL/BLOCKED = dừng module đó, báo dev.
>
> **Phương pháp:** 4 check BAGM (Basic Accessibility + Generic Module) bằng `/browse`.
> **Không test:** workflow, BR, phân quyền, edge case — để Lệnh 4 lo.

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | [Round N] |
| **Ngày test** | [YYYY-MM-DD] |
| **Tester** | [QA name / Claude + /browse] |
| **Environment** | http://103.172.236.130:3000/ |
| **Primary Account** | canbo_tw (CB NV TW, OTP bypass 666666) |
| **Test Method** | `/browse` (Playwright headless) |
| **Browse Status** | OK / BROKEN (ghi rõ nếu crash) |
| **Time Budget** | 5-7 phút/module |
| **Tài liệu tham chiếu** | [test-strategy.md §8.3 Lệnh 1](../../test-strategy.md), [smoke/](../../smoke/) |

---

## 1. Executive Summary

| # | Module | C1 Access | C2 List | C3 Detail | C4 Create | Verdict | Unlock Lệnh 2? |
|---|--------|-----------|---------|-----------|-----------|---------|---------------|
| 1 | Quản trị HT | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 2 | Hỏi đáp PL | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 3 | CG/TVV | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 4 | Vụ việc HTPL | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 5 | Chi trả Chi phí | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 6 | Doanh nghiệp | ⬜ | ⬜ | ⬜ | ⬜ | — | — |
| 7 | Đào tạo, Tập huấn | ⬜ | ⬜ | ⬜ | ⬜ | — | — |

> **Ký hiệu:** ✅ PASS | ❌ FAIL | ⚠️ WARN | ⏭️ SKIP | 🔒 BLOCKED | ⬜ chưa test

### Verdict tổng: **PASS / FAIL / CONDITIONAL PASS**

[1-2 câu kết luận. Ví dụ: "5/7 module PASS, unlock Lệnh 2 cho HD/CG-TVV/VV/DN/QTHT. Chi trả BLOCKED do API 500, Đào tạo FAIL C4 (form tạo crash) — báo dev trước khi chạy functional."]

---

## 2. BAGM Checks — Định nghĩa

| Check | Mục đích | Pass criteria | Blocker? |
|-------|---------|--------------|----------|
| **C1. Access** | Login + menu module hiện ở sidebar | Click menu → URL đổi, page render | ✅ Yes |
| **C2. List load** | List module load, tabs/filter hiển thị | 0 console error, render < 5s | ✅ Yes |
| **C3. Read detail** | Click 1 row → detail/modal mở OK | Field load đúng, không trắng | ✅ Yes |
| **C4. Create stub** | Form "Thêm mới" mở → submit field tối thiểu → record xuất hiện | Bản ghi mới visible trong list | ✅ Yes |

> **4 pass = module infrastructure healthy (~95%)** → đáng đầu tư Lệnh 2/3/4.
> **Không test:** transition, workflow, BR, phân quyền — đó là việc của Lệnh 4.

---

## 3. Per-Module Details

### 3.1 [Tên module] — PASS / FAIL / BLOCKED

**Duration:** X phút | **Sample record ID:** [id-tạo-ở-C4-để-Lệnh-2-tái-sử-dụng]

| Check | Status | Observation | Evidence |
|-------|--------|-------------|----------|
| **C1. Access** | ✅/❌ | [vd: Menu "Hỏi đáp PL" xuất hiện ở sidebar, click → URL /hoi-dap] | ![C1](screenshots/smoke-{module}-C1-menu.png) |
| **C2. List load** | ✅/❌ | [vd: 25 rows load trong 2.3s, 9 tab state đủ, 0 console error] | ![C2](screenshots/smoke-{module}-C2-list.png) |
| **C3. Read detail** | ✅/❌ | [vd: Click row đầu → modal mở, 12 field load đúng] | ![C3](screenshots/smoke-{module}-C3-detail.png) |
| **C4. Create stub** | ✅/❌ | [vd: Form tạo mở, submit field bắt buộc → record HD-20260418-smoke xuất hiện ở đầu list] | ![C4](screenshots/smoke-{module}-C4-created.png) |

**Kết luận:** [Module healthy, unlock Lệnh 2 / Module FAIL ở C3 → báo dev / Module BLOCKED do ...]

**Blocker/Issue phát hiện (nếu có):**
- [vd: Console error `Cannot read property 'hoSoDinhKem' of undefined` ở C3 — request assignee: BE team]
- [vd: Form tạo thiếu field X dù SRS yêu cầu bắt buộc]

---

### 3.2 [Module tiếp theo] — ...

[Copy structure 3.1]

---

## 4. Failed / Blocked Modules — Chi tiết

> Ghi chi tiết khi module FAIL/BLOCKED để dev có đủ info fix.

### 4.1 [Module name] — [FAIL/BLOCKED at CN]

**Triệu chứng:**
- [vd: Click menu Chi trả → page trắng, console 500 Internal Server Error]

**Reproduction:**
```
1. Login canbo_tw / OTP 666666
2. Click menu "Chi trả chi phí"
3. Quan sát: page không render, console log attached
```

**Console log:**
```
[error] GET /api/chi-tra 500 (Internal Server Error)
[error] Uncaught TypeError: ...
```

**Screenshots:**
- ![Error state](screenshots/smoke-chitra-C2-error.png)

**Assignee:** [Backend / Frontend / DevOps]
**Priority:** Blocker (chặn toàn bộ Lệnh 2-4 module này)
**Next action:** [Ping dev, retry sau fix, hoặc skip module trong round này]

---

## 5. Retry Log (nếu có)

| Module | Check | Attempt | Kết quả | Ghi chú |
|--------|-------|---------|---------|---------|
| HD | C4 | 1 | FAIL | Browse timeout khi click "Thêm mới" |
| HD | C4 | 2 | PASS | Retry sau 30s, form mở OK — nghi render chậm |
| CT | C2 | 1 | FAIL | API 500 |
| CT | C2 | 2 | FAIL | Cùng lỗi → mark BLOCKED |

**Rule:** Retry tối đa 1 lần. Fail 2 lần → BLOCKED, KHÔNG bypass sang API hay skip.

---

## 6. Blocker Escalation

> Gom các blocker cần dev xử lý trước khi round này có thể hoàn thành.

| # | Module | Issue | Severity | Assignee | Status |
|---|--------|-------|----------|----------|--------|
| 1 | Chi trả | GET /api/chi-tra 500 | Blocker | BE team | Reported |
| 2 | CG/TVV | Detail modal crash — `hoSoDinhKem undefined` | Critical | BE team | Reported |

**Báo cáo đã gửi:** [Slack/Email/ticket link] — [timestamp]

---

## 7. Recommendations

### Unlock cho Lệnh 2 (Data Readiness)
- [x] Module HD — chạy `/browse` Lệnh 2 với sample ID [HD-20260418-smoke]
- [x] Module DN — chạy `/browse` Lệnh 2 với sample ID [DN-20260418-smoke]
- [ ] Module CT — chờ BE fix API trước

### Cần verify lại lần sau
- [ ] Module X: render chậm > 5s (C2 pass WARN) — theo dõi nếu tái diễn

### Cải thiện smoke process
- [vd: Thêm pre-check DB connectivity trước khi chạy C1]
- [vd: Auto-screenshot console log khi FAIL thay vì manual]

---

## 8. Appendix

### A. Tài khoản dùng

| Username | Role | Đơn vị | Cấp | Dùng cho |
|----------|------|--------|-----|---------|
| canbo_tw | CB_NV | Cục BTTP | TW | Smoke C1-C4 mọi module (scope rộng) |

> **Lý do chỉ dùng 1 account:** smoke không test phân quyền. Account CB_NV TW có Create + scope rộng nhất → đủ cho 4 check BAGM.

### B. Browse patterns áp dụng

Tham chiếu [CLAUDE.md §Browse tool](../../../CLAUDE.md):
- Rule 1: `$B wait` trước mọi `fill`/`click`
- Rule 3: OTP Antd dùng `$B type "666666"` (bypass)
- Rule 4: Selector đặc hiệu, tránh `button.ant-btn-primary` multi-match
- Rule 6: Recovery FULL cleanup khi crash (bao gồm pkill playwright-go driver)

### C. Screenshots

| File | Module | Check |
|------|--------|-------|
| smoke-qtht-C1-menu.png | Quản trị HT | C1 |
| smoke-qtht-C2-list.png | Quản trị HT | C2 |
| ... | ... | ... |

### D. Console log files (nếu có FAIL)

| File | Module | Mô tả |
|------|--------|-------|
| console-chitra-C2.log | Chi trả | API 500 errors |

---

## 9. Hướng dẫn sử dụng template này

### Bước 1: Copy template
```bash
cp output/template/smoke-test-report-template.md \
   output/qa-reports/round{N}/smoke-test/smoke-test-report.md
mkdir -p output/qa-reports/round{N}/smoke-test/screenshots
```

### Bước 2: Chạy 7 module tuần tự qua `/browse`

Prompt gợi ý cho AI:
```
Dùng /browse chạy smoke test 7 module theo thứ tự: QTHT, HD, CG/TVV, VV, CT, DN, Đào tạo.
Input: @output/smoke/6.X-sm-{module}.md (đọc section "Smoke Procedure")
Output: điền kết quả vào @output/qa-reports/round{N}/smoke-test/smoke-test-report.md
Rule:
  - Mỗi module chạy 4 check BAGM (C1-C4)
  - Capture 4 screenshot/module vào screenshots/
  - Time budget 5-7 phút/module, vượt = BLOCKED
  - Fail 2 lần = BLOCKED, không bypass
  - Account: canbo_tw (OTP 666666)
```

### Bước 3: Verdict + unlock Lệnh 2

- PASS toàn bộ → unlock Lệnh 2 cho 7 module
- FAIL/BLOCKED 1 module → unlock các module còn lại, module lỗi chờ fix
- FAIL toàn bộ → dừng, báo dev

### Bước 4: Lưu sample ID

Tất cả record tạo ở C4 → ghi Sample ID vào report. Lệnh 2-3 tái sử dụng, KHÔNG tạo trùng.

---

*Report template v1.0 | 2026-04-18 | PM HTPLDN QA*
