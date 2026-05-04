# Regression Bug Status Report — Round 5 (T5.3)

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 5 P5 — T5.3 Regression |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-04-29 |
| **Mục tiêu** | ≥80% closed (theo plan-round5) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total bug logged** | 18 (across R1-R6 sessions) |
| **Closed-verified** | 6 |
| **Open** | 12 (4 từ Trụ A re-test 29/4 + 4 BIEUMAU/CTHTPLDN R1-R5 + 1 KHOAHOC R3 + 1 SEED-KH timezone R2 + 2 HOIDAP cũ) |
| **Closed Rate** | 33% (6/18) — **THẤP HƠN MỤC TIÊU 80%** |
| **Severity Open** | 4 Critical + 6 Major + 2 Medium |

### Verdict: **FAIL** — Closed rate 33% << 80% target. Cần đợt fix lớn từ dev trước khi C5 gate PASS.

---

## 2. Bug Status — closed-verified

| Bug ID | Severity | Module | Round | Closed-verified | Note |
|--------|----------|--------|-------|:---------------:|------|
| BUG-FLOW-TVV-001 | Critical | TVV (A1) | R2 | 2026-04-27 | CB_PD nút Phê duyệt/Từ chối hiện đầy đủ |
| BUG-FLOW-TVV-003 | Major | TVV (A1) | R2 | 2026-04-27 | Modal Cập nhật trạng thái dropdown đúng |
| BUG-FLOW-TVV-004 | Medium | TVV (A1) | R2 | 2026-04-27 | List có 2 tab "Yêu cầu bổ sung" + "Đang thẩm định" |
| BUG-FLOW-HOIDAP-001 | Critical | HOIDAP (A4) | R3 | 2026-04-28 | Modal Phân công alert + button disabled khi pool rỗng |
| BUG-FLOW-TVCS-001 | Critical | TVCS (A5) | R3 | 2026-04-28 | UI Detail có [Phân công] + [Hủy], modal render đúng |
| BUG-FLOW-TVCS-002 | Minor | TVCS (A5) | R3 | 2026-04-28 | Cột "Ngày bắt đầu" hiển thị `—` đúng FR-X.1-01 |

---

## 3. Bug Status — Open (12 bug)

### 3.1 Trụ A — 4 bug Critical/Major Open re-confirmed R6 29/4

| Bug ID | Severity | Module | First Logged | Last Verified | Status R6 29/4 |
|--------|----------|--------|:------------:|:-------------:|:--------------:|
| BUG-FLOW-VUVIEC-001 | **Critical** | A3 VV | R2 27/4 | R6 29/4 | **STILL OPEN** — UI 0 nút workflow + 7/9 BE 404. Identical R3 28/4. |
| BUG-FLOW-HOIDAP-002 | **Major** | A4 HOIDAP | R4 28/4 | R6 29/4 | **STILL OPEN** — dev fix sai SRS, FE BLOCK strict thay vì WARNING WRN-PH-01. Vi phạm SRS FR-II-07 Preconditions + E3. |
| BUG-FLOW-HOIDAP-003 | Medium | A4 HOIDAP | R4 28/4 | R6 29/4 | **STILL OPEN** — modal Phân công HD-001 Hình sự empty pool dù QTHT có config. |
| BUG-FLOW-TVCS-003 | **Critical** | A5 TVCS | R5 28/4 | R6 29/4 | **STILL OPEN** — FE truyền enum `HOAT_DONG` thay `DANG_HOAT_DONG`. Identical R5 28/4. |

### 3.2 BIEUMAU — 3 bug Open từ R2 28/4

| Bug ID | Severity | Module | First Logged | Status |
|--------|----------|--------|:------------:|:------:|
| BUG-FLOW-BIEUMAU-001 | **Major** | C1 BM | R1 27/4 | Open — LGSP sync "Invalid URL" 4/4 thư mục |
| BUG-FLOW-BIEUMAU-002 | Medium | C1 BM | R2 28/4 | Open — UI nhỏ |
| BUG-FLOW-BIEUMAU-003 | Medium | C1 BM | R2 28/4 | Open — BE nhỏ |

### 3.3 CTHTPLDN — 4 bug Open từ R1-R2 28/4

| Bug ID | Severity | Module | Status |
|--------|----------|--------|:------:|
| BUG-FLOW-CTHTPLDN-001 | **Critical** | P3.3 | Open — Cổng PLQG 502 (defer external dependency) |
| FIND-002 | Minor | P3.3 | Open |
| FIND-003 | Minor | P3.3 | Open |
| FIND-004 | Minor | P3.3 | Open |

### 3.4 KHOAHOC — 1 bug Major Open từ R2-R3

| Bug ID | Severity | Module | Status |
|--------|----------|--------|:------:|
| BUG-FLOW-KHOAHOC-001 | **Major** | B7 KH | Open — CB PD Hủy KH 403 `ERR-PERM-SYS-00-01` JWT thiếu `cancel_khoa_hoc` (R3 28/4 dev claim fix → NOT verified) |
| BUG-KH-001-R5 | **Major** | B3 seed KH | Open R2 → vẫn chưa fix → R5 — timezone -1 ngày khi save form |

### 3.5 TVV pending BA — 1 bug Major chờ BA decide

| Bug ID | Severity | Module | Status |
|--------|----------|--------|:------:|
| BUG-FLOW-TVV-002 | Major | A1 | Pending BA — workflow R2 dùng 4-state (skip CHO_THAM_DINH) thay 5-state SRS |

---

## 4. Severity Breakdown — Open

| Severity | Count | Bug IDs |
|----------|:-----:|---------|
| **Critical** | 4 | VUVIEC-001, TVCS-003, BIEUMAU-LGSP, CTHTPLDN-001 (defer external) |
| **Major** | 6 | HOIDAP-002, KHOAHOC-001, KH-001-R5 timezone, BIEUMAU-001 LGSP, TVV-002 (BA pending), CTHTPLDN-defer |
| **Medium** | 2 | HOIDAP-003, BIEUMAU-002 |
| **Minor** | 5 | BIEUMAU-003, FIND-002, FIND-003, FIND-004, BUG-FLOW-TVCS-002-Minor (closed) |

---

## 5. Trends + Recommendations

### Trend cross-round

| Bug ID | R1 | R2 | R3 | R4 | R5 | R6 |
|--------|:--:|:--:|:--:|:--:|:--:|:--:|
| VUVIEC-001 | — | logged | confirmed | — | — | **3rd time confirmed** |
| HOIDAP-002 | — | — | — | logged | — | **dev fix sai SRS** |
| HOIDAP-003 | — | — | — | logged | — | **2nd confirmed** |
| TVCS-003 | — | — | — | — | logged | **2nd confirmed** |

→ **Pattern lo ngại:** 4 bug Critical/Major Trụ A đều tái khẳng định qua nhiều round. Dev claim "fix" không match QA verify → cần escalate quản lý dev + verify SRS chung trước khi claim fix lần kế tiếp.

### Critical Recommendations

1. **STOP claim "fix all Trụ A" dev:** dev cần verify 4 bug Trụ A R6 evidence (screenshots + API trace + SRS quote) + commit thật + báo QA test lại từng bug riêng biệt.

2. **Fix priority order (cascade impact ranking):**
   - **#1 BUG-FLOW-VUVIEC-001 Critical** — block A3 + D1/D2/P3.1/P3.4 + T4.3 (cascade 5 task)
   - **#2 BUG-FLOW-TVCS-003 Critical** — block A5 + D2 + T4.5 (cascade 3 task)
   - **#3 BUG-FLOW-HOIDAP-002 Major** — block A4 advance + violate SRS Preconditions
   - **#4 BUG-FLOW-HOIDAP-003 Medium** — block bước Phân công cross-user
   - **#5 BUG-FLOW-KHOAHOC-001 Major** — block B7 + T4.6 workflow advance

3. **Closed rate target 80%** — hiện 33% (6/18). Cần đóng thêm ≥9 bug nữa để đạt 80%. Realistic next round target: đóng 4 bug Trụ A + 1 KH + 2 BIEUMAU = 7 bug, đạt 13/18 = 72%. Vẫn dưới target → cân nhắc revise mục tiêu xuống 70% hoặc dev focused fix sprint.

4. **C5 gate FAIL** — không đủ điều kiện close R5 + kick off Round 5 Permission. Đề xuất:
   - Phương án A: Defer C5, dev fix sprint 2-3 ngày, re-test, mới close R5.
   - Phương án B: Close R5 với note FAIL closed rate, ship Round 5 Permission song song với dev fix backlog.

---

## 6. Tham chiếu

- [`tasks/todo.md`](../../../tasks/todo.md) §Bug đã đóng + §Module bị block
- [`bug-report-flow-VUVIEC.md`](bug-reports/bug-report-flow-VUVIEC.md) — BUG-001 R6 evidence
- [`bug-report-flow-HOIDAP.md`](bug-reports/bug-report-flow-HOIDAP.md) — BUG-002 + BUG-003 R6 evidence
- [`bug-report-flow-TVCS.md`](bug-reports/bug-report-flow-TVCS.md) — BUG-003 R6 evidence
- [`bug-report-flow-CTHTPLDN.md`](bug-reports/bug-report-flow-CTHTPLDN.md)
- [`bug-report-flow-KHOAHOC.md`](bug-reports/bug-report-flow-KHOAHOC.md)
- [`bug-report-flow-BIEUMAU.md`](bug-reports/bug-report-flow-BIEUMAU.md)

---

*Report generated: 2026-04-29 08:40 | QA Automation via Claude Code | Cumulative R1-R6*
