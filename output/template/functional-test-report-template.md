# Functional Test Report — [TÊN MODULE]

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | [Tên module + số thứ tự, vd: Quản lý Doanh nghiệp (Module 7.6)] |
| **SRS Reference** | [File SRS + mã FR, vd: srs-fr-07-doanh-nghiep.md — FR-V.III-01, 02, NEW-01] |
| **UC Coverage** | [Danh sách UC, vd: UC 81, UC 82] |
| **Người test** | [QA name / QA Automation] |
| **Ngày** | [YYYY-MM-DD] |
| **Môi trường** | [URL test] |
| **OTP Bypass** | [vd: `666666` (bypass tạm) — hoặc URL MailHog nếu bypass tắt] |
| **Test Method** | [API-based / UI-based / Hybrid] |
| **Primary Account** | [username / password — role, cấp] |
| **Round** | [Round N] |
| **Tài liệu tham chiếu** | [link test-strategy, bug-report] |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | N |
| **TC đã test / Tổng TC** | 0/N (0%) — các TC còn lại: SKIP / pre-blocked §7.0c / không thuộc scope |
| **Passed** | 0 |
| **Failed** | 0 |
| **Blocked** | 0 |
| **Partial** | 0 |
| **Overall Pass Rate** | 0% (0/N, PARTIAL không tính PASS) |
| **P0 Pass Rate** | 0% (0/0 P0 tested) |
| **Bugs Found (SRS-ref)** | 0 (0 Critical, 0 Major, 0 Medium, 0 Minor) |
| **Observations (out-of-SRS)** | 0 (xem `bug-report-{module}.md` §Observations) |
| **Health Score** | 0/100 |
| **Start Time** | HH:MM (UTC+7) |
| **End Time** | HH:MM (UTC+7) |
| **Total Duration** | XX phút (budget: 45 phút) |
| **Browse Status** | OK / BROKEN (nếu fail → ghi lý do, TC bị block) |

### Pass Rate breakdown theo Type (để tổng hợp multi-module)

> **Lưu ý:** Bảng này dùng cho report tổng multi-module. Chỉ fill các Type có trong scope round test. Module CRUD thuần → đủ 4 row chính. Module có SM/Workflow → thêm row `Workflow` cho mỗi state transition. Module phân quyền → thêm row `Authorization`.
>
> **Thêm cột `BLOCKED`** khi round có TC bị chặn do bug upstream / dependency / thiếu test data (vd round TVV-CR: 5/6 TC BLOCKED do BUG-TVV-001). Pass Rate = PASS / TC count (PARTIAL/FAIL/BLOCKED đều không tính PASS).

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Luồng chính — seed fixture + CRUD thành công | N | 0 | 0 | 0 | 0 | **0%** |
| **Negative** | Validate input sai (required, duplicate, format) | N | 0 | 0 | 0 | 0 | **0%** |
| **Validation** | Business rule runtime (auto-suggest, auto-calc) | N | 0 | 0 | 0 | 0 | **0%** |
| **Workflow** | State transition (nếu module có SM) | N | 0 | 0 | 0 | 0 | **0%** |
| **Authorization** | Permission matrix (role × action × scope) | N | 0 | 0 | 0 | 0 | **0%** |
| **Edge / Guard** | Boundary value / business rule block | N | 0 | 0 | 0 | 0 | **0%** |
| **Integration** | Cross-module data link | N | 0 | 0 | 0 | 0 | **0%** |
| **Total** | | **N** | **0** | **0** | **0** | **0** | **0%** |

→ **Happy-path Pass Rate = X/N** — chỉ số chính cho rollup report. Đánh giá khả năng seed data cho module downstream.

### Verdict: **PASS / FAIL / CONDITIONAL PASS**

[1-2 câu kết luận. Ví dụ: "FAIL — Critical authorization bug + major data filtering bug phải fix trước release."]

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi TC 1 dòng, 8 cột. Chi tiết Steps/Expected/Actual xem ở Section 4.

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| XX-001 | FR-X-01, UC-NN | [Mô tả ngắn gọn TC] | Happy | P0 | **PASS** | — | [1 câu lý do đạt/không đạt] |
| XX-002 | FR-X-01 | [Mô tả] | Negative | P0 | **PASS** | — | [Ghi chú] |
| XX-003 | FR-X-02, BR-YY-01 | [Mô tả] | Happy | P1 | **FAIL** | BUG-XX-001 | **Lý do FAIL:** [Root cause ngắn gọn] |
| XX-004 | FR-X-03 | [Mô tả] | Guard | P0 | **BLOCKED** | — | **Lý do BLOCKED:** [Thiếu test data / dependency / ...] |
| XX-005 | FR-X-NEW | [Mô tả] | Validation | P1 | **PARTIAL** | BUG-XX-002 | **Lý do PARTIAL:** [Phần nào PASS, phần nào chưa verify được] |

### Chú thích

> **Result:**
> - `PASS` — đạt 100% expected behavior
> - `FAIL` — có bug, link tới Bug ID
> - `BLOCKED` — không chạy được do thiếu data/dependency/môi trường
> - `PARTIAL` — đạt một phần, phần còn lại chưa verify được
> - `SKIP` — chủ động bỏ qua (ngoài scope / duplicate)

> **Type:**
> - `Happy` — luồng chính hợp lệ
> - `Negative` — input/thao tác sai
> - `Edge` — giá trị biên
> - `Guard` — kiểm tra điều kiện chặn (precondition, business rule)
> - `Validation` — validate dữ liệu
> - `Workflow` — chuyển state
> - `Authorization` — phân quyền
> - `Integration` — tích hợp liên module

> **Priority:** `P0` (bắt buộc) / `P1` (quan trọng) / `P2` (nên có) / `P3` (có thời gian)

---

## 3. Bug Report

> **Lưu ý:** Phần này là **tóm tắt inline**. Chi tiết Steps/Evidence/Impact/Fix đầy đủ xem file [bug-report-{module}.md](bug-report-{module}.md).

### BUG-XX-001 — [Severity] [Tiêu đề ngắn gọn]

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical / Major / Medium / Minor |
| **Priority** | P0 / P1 / P2 |
| **TC Reference** | XX-NNN |
| **Status** | Open / In Progress / Fixed / Verified |
| **Assignee** | Backend Team / FE Team |

**Mô tả:** [1-2 câu]

**Các bước tái hiện:** [Ngắn gọn, chi tiết xem file bug-report]

**Expected vs Actual:** [So sánh ngắn]

**Impact:** [Ai bị ảnh hưởng, mức độ]

**Root Cause (Suggested):** [Phân tích kỹ thuật ngắn]

---

## 4. Detailed Test Results

> **Tầng 2 — Chi tiết từng TC.** Steps / Expected / Actual. Dùng khi dev cần reproduce hoặc QA cần audit.

### 4.1 XX-001: [Tên Test Case đầy đủ]

**Pre-conditions:**
- [Điều kiện 1: user đã login với role X]
- [Điều kiện 2: có sẵn data Y trong DB]
- [Điều kiện 3: ...]

**Test Data:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | [Hành động 1: POST /api/...] | [Kết quả mong đợi 1] | [Kết quả thực tế 1] | **PASS** |
| 2 | [Hành động 2] | [Expected 2] | [Actual 2] | **PASS** |
| 3 | [Hành động 3] | [Expected 3] | [Actual 3] | **FAIL** |

**Notes:**
- [Ghi chú kỹ thuật: edge case phát hiện, behavior lạ, ...]
- [Liên quan bug nào: see BUG-XX-NNN]

---

### 4.2 XX-002: [Tên Test Case]

[Copy structure từ 4.1]

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV | Cục BTTP | TW | XX-001 → XX-010 |
| qtht_tw | QTHT | Cục BTTP | TW | XX-014 (authz) |
| lanhdao_tw | CB_PD | Cục BTTP | TW | XX-015 (authz) |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| DN-HGI-0006 | QA Test DN Mới | TC XX-003, XX-005 | Keep for regression |
| DN-HGI-0008 | QA DN Xóa Test | TC XX-006 bug evidence | Soft-deleted (visible bug!) |

---

## 6. Environment Notes

- **API endpoint pattern:** [vd: /api/v1/{resource-plural}]
- **Auth flow:** [vd: JWT + OTP email]
- **Token TTL:** [vd: 60s — ngắn, cần re-auth liên tục]
- **Frontend framework:** [vd: React + Vite + Ant Design + CASL]
- **Backend:** [vd: NestJS + PostgreSQL]
- **Proxy:** [vd: Vite dev proxy /api → localhost:3001]
- **Known limitations:** [vd: browse tool crash, cần test UI thủ công]

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-XX-001 (Critical):** [Gợi ý fix cụ thể]
2. **BUG-XX-002 (Major):** [Gợi ý fix]

### Should Fix

3. **BUG-XX-003 (Medium):** [Gợi ý]

### Additional Recommendations

4. **Test data:** [Vd: tạo seed data cho TC XX-007 (Guard) để unblock]
5. **UI testing:** [Vd: cần verify tabs/responsive qua browser khi browse tool hoạt động]
6. **Environment:** [Vd: tăng token TTL cho môi trường test]

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| GET | `/api/v1/xxx` | List/Search | XX-001, XX-002 |
| POST | `/api/v1/xxx` | Create | XX-003, XX-004 |
| PATCH | `/api/v1/xxx/{id}` | Update | XX-005 |
| DELETE | `/api/v1/xxx/{id}` | Soft delete | XX-006 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [00-list.png](screenshots/00-list.png) | Danh sách DN | XX-001 |
| [01-create-form.png](screenshots/01-create-form.png) | Form tạo DN | XX-003 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-X-01 (UC-NN) | XX-001, XX-003, XX-005, XX-006 | 3/4 PASS (1 FAIL) |
| FR-X-02 (UC-MM) | XX-002 | 1/1 PASS |
| BR-XX-01 | XX-009 | FAIL — not implemented |

---

*Report generated: [YYYY-MM-DD] | [QA name / QA Automation via Claude Code]*
