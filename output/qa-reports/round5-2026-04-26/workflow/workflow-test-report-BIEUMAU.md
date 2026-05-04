# Workflow Test Report — Biểu mẫu (SM-BIEUMAU) — Trụ C

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Phase:** P2 Workflow • **Plan ref:** [`tasks/todo.md` §P2 Trụ C C1](../../../tasks/todo.md) • **Date:** 2026-04-27
> **Tester:** QA Automation via Claude Code
> **Round:** Round 5
> **State Machine:** SM-BIEUMAU — 3 state (`NHAP → CONG_KHAI → AN`) ở level Thư mục biểu mẫu
> **Input flow:** [`input/flow-module.md §9 Biểu mẫu`](../../../input/flow-module.md)
> **Seed precondition:** [`seed-checklist-BIEUMAU.md`](../seed/seed-checklist-BIEUMAU.md) — 4 thư mục NHAP + 7 BM
> **Bug report:** [`bug-report-flow-BIEUMAU.md`](../bug-reports/bug-report-flow-BIEUMAU.md)

---

## Verdict

⚠️ **PASS-WITH-BUGS (R3 verify 2026-04-29 — LATEST)** — State machine 4/4 nhánh vẫn PASS • 3 bug **re-confirmed Open** (dev chưa fix).

| Metric | R1 (2026-04-27) | R2 (2026-04-28) | R3 (2026-04-29) |
|--------|----------------|-----------------|-----------------|
| Happy path NHAP → CONG_KHAI | 2/2 PASS | **4/4 PASS** | **1/1 PASS** (HĐ Lao động AN→CONG_KHAI) |
| CONG_KHAI → AN | 1/1 PASS | **2/2 PASS** | không re-test |
| AN → CONG_KHAI (re-publish) | UI verify (chưa exec) | **1/1 PASS** | **1/1 PASS** (HĐ Lao động) |
| Sync Cổng PLQG (`DA_DONG_BO`) | 0/2 (Lỗi đồng bộ) | **0/4 (Lỗi đồng bộ)** ❌ | **0/5 (Lỗi đồng bộ)** ❌ |
| BUG-001 sync "Invalid URL" | Open | **re-confirmed Open** | **re-confirmed Open** |
| BUG-002 no toast ERR-CK-02 | Open | Open | **re-confirmed Open** |
| BUG-003 FAILED vs PENDING+retry | Open | Open | **partially observed** (PENDING→FAILED ~20s) |
| **Gate cho P4 T4.10 Functional** | ☑ PASS | ☑ PASS | ☑ PASS (5 thư mục CONG_KHAI) |

---

## Accounts dùng

| Role | Username | Cấp | Ghi chú |
|------|----------|-----|---------|
| CB NV TW | `cb_nv_tw_01` | TW | Toàn bộ workflow Biểu mẫu |

---

## 1. Happy Path — NHAP → CONG_KHAI → AN

| Bước | State chuyển | Thao tác | Data test | API endpoint | Result |
|:----:|--------------|----------|-----------|--------------|:------:|
| **1** | (seed) → `NHAP` | T1.B4 đã seed 4 thư mục NHAP | "Biểu mẫu Thuế" id=`9225984e-...` | (seed POST đã có) | ☑ PASS |
| **2a** | `NHAP` → `CONG_KHAI` (Biểu mẫu Thuế) | Click [Công khai] → confirm | thuMucId=9225984e-... | POST `/api/v1/thu-muc-bieu-maus/{id}/cong-khai` [200] | ☑ PASS |
| **2b** | `NHAP` → `CONG_KHAI` (HĐ Dân sự-TM) | Click [Công khai] → confirm | thuMucId=3987eae5-... | POST `/api/v1/thu-muc-bieu-maus/{id}/cong-khai` [200] | ☑ PASS |
| **3** | `CONG_KHAI` → `AN` (HĐ Dân sự-TM) | Click [Ẩn] → confirm | thuMucId=3987eae5-... | POST `/api/v1/thu-muc-bieu-maus/{id}/an` [verified state change] | ☑ PASS |

**Final state cuối session:**
- Biểu mẫu Thuế: `Đã công khai` (sync ⚠️ Lỗi)
- HĐ Dân sự - Thương mại: `Đã ẩn`
- Biểu mẫu Doanh nghiệp: `Nháp` (chưa test)
- HĐ Lao động: `Nháp` (chưa test)

---

## 2. Auto-transition / Side-effect

| # | Trigger | Field bị set | Cơ chế | Result |
|:-:|---------|--------------|--------|:------:|
| 1 | Publish (CONG_KHAI) | `dong_bo_status` = `Đang đồng bộ` | FE auto theo BE event | ☑ PASS |
| 2 | LGSP sync xong | `dong_bo_status` = `Đã đồng bộ` | Cron / webhook Cổng PLQG | ❌ FAIL — Biểu mẫu Thuế bị `Lỗi đồng bộ` (BUG-001) |
| 3 | Hide (AN) | `dong_bo_status` giữ "Đang đồng bộ" hoặc "Đã ẩn" | BE event | Observation: HĐ Dân sự sau Ẩn vẫn show "Đang đồng bộ" |
| 4 | UI tab counter | Tab "Đã công khai" + "Đã ẩn" tăng count | FE filter | ☑ PASS (tab "Tất cả (4)" giữ 4) |

---

## 3. Tab counts cuối session

| Tab | Count đếm tay |
|-----|:-------------:|
| Tất cả | 4 |
| Đã công khai | 1 (Biểu mẫu Thuế) |
| Nháp | 2 (Doanh nghiệp + Lao động) |
| Đã ẩn | 1 (HĐ Dân sự-TM) |

---

## 4. Bugs & Findings

Xem [`bug-report-flow-BIEUMAU.md`](../bug-reports/bug-report-flow-BIEUMAU.md):
- **BUG-FLOW-BIEUMAU-001** Major — Cổng PLQG sync FAIL với "Lỗi đồng bộ" sau ~10s từ POST publish, không retry tự động.

---

## 5. Cascade impact

| Downstream task | Trước | Sau |
|-----------------|-------|-----|
| P4 T4.10 Biểu mẫu functional (38 TC) | ⏳ chờ ≥1 BM/thư mục CONG_KHAI | ✅ UNBLOCKED — 1 thư mục CONG_KHAI sẵn (Biểu mẫu Thuế) |
| API outbound (FR-XII) DM Biểu mẫu công khai | ⏳ | ☑ Test path mở (1 thư mục public, 1 ẩn) |

---

## Tham chiếu

- [`flow-module.md §9 Biểu mẫu`](../../../input/flow-module.md)
- [`seed-checklist-BIEUMAU.md`](../seed/seed-checklist-BIEUMAU.md)
- [`bug-report-template.md`](../../template/bug-report-template.md)
- Screenshot final state: `screenshots/trụ-C-bieu-mau-final-state.png`
- Screenshots R2 re-test: `screenshots/bieumau-r2/01-initial-state-4-thumuc.png`, `02-after-publish-2-thumuc-loi-dong-bo.png`, `03-final-after-cycle.png`, `05-table-crop.jpg`

---

*Workflow test complete: 2026-04-27 01:18 | QA via Chrome DevTools MCP*

---

## R2 Re-test (2026-04-28 23:25 — sau dev claim fix BUG-FLOW-BIEUMAU-001)

### Lý do re-test

User báo "Dev đã fix bug LGSP sync rồi" → re-test lại workflow Biểu mẫu (đặc biệt cột "Đồng bộ" sau publish).

### Tài khoản dùng

`cb_nv_tw_01` / `Secret@123` / OTP `666666` (bypass).

### Bước test thực hiện

| # | State chuyển | Thư mục | API | Result trạng thái | Result sync |
|:-:|--------------|---------|-----|:-----------------:|:-----------:|
| **R2-1** | (initial check) | 4 thư mục đầu round | `GET /thu-muc-bieu-maus` 200 | Thuế=`CONG_KHAI`, DN=`NHAP`, HĐ DS=`AN`, Lao động=`NHAP` (carry từ R1) | Thuế+HĐ DS đã `Lỗi đồng bộ` từ R1, DN+LĐ = `—` |
| **R2-2** | `NHAP → CONG_KHAI` (Biểu mẫu Doanh nghiệp) | DN id=`33e791ee-...` | POST `/thu-muc-bieu-maus/{id}/cong-khai` 200 | ✅ PASS — state đổi `Đã công khai` | Initial `Đang đồng bộ` → sau ~8s `Lỗi đồng bộ` ❌ |
| **R2-3** | `NHAP → CONG_KHAI` (HĐ Lao động) | LĐ id=`551c792a-...` | POST `/cong-khai` 200 | ✅ PASS — state đổi `Đã công khai` | Initial `Đang đồng bộ` → sau ~12s `Lỗi đồng bộ` ❌ |
| **R2-4** | `AN → CONG_KHAI` (HĐ Dân sự re-publish) | HĐ DS id=`3987eae5-...` | POST `/cong-khai` 200 | ✅ PASS — state đổi `Đã công khai` | Initial `Đang đồng bộ` → sau ~3s `Lỗi đồng bộ` ❌ |
| **R2-5** | `CONG_KHAI → AN` (HĐ Lao động) | LĐ id=`551c792a-...` | POST `/an` 200 | ✅ PASS — state đổi `Đã ẩn` | `Đang đồng bộ` (chưa kịp fail trước khi snapshot) |

### Final state cuối session R2

| Thư mục | trangThai | syncStatus (BE response) | syncLoi (BE response) | UI cột Đồng bộ |
|---------|-----------|:------------------------:|----------------------|----------------|
| Biểu mẫu Thuế | `CONG_KHAI` | `FAILED` | **"Invalid URL"** | Lỗi đồng bộ |
| Biểu mẫu Doanh nghiệp | `CONG_KHAI` | `FAILED` | **"Invalid URL"** | Lỗi đồng bộ |
| HĐ Dân sự - Thương mại | `CONG_KHAI` (re-publish R2) | `FAILED` | **"Invalid URL"** | Lỗi đồng bộ |
| HĐ Lao động | `AN` (sau R2-5) | `FAILED` (trước Ẩn) → `PENDING` | "Invalid URL" / null | Đang đồng bộ |

**Sync verdict:** **0/4 thư mục đạt `DA_DONG_BO`** sau publish. Tất cả end ở `FAILED` với `syncLoi="Invalid URL"`.

### Phát hiện R2 — bug NOT fixed + thêm 2 gap UX

| # | Phát hiện | SRS reference | Severity |
|:-:|-----------|---------------|:--------:|
| 1 | Sync Cổng PLQG vẫn fail "Invalid URL" sau publish (4/4 fail) | `FR-VII-03 Processing bước 4` + `Error Handling E2 ERR-CK-02` | Major (re-confirmed) |
| 2 | UI **không có nút "Đồng bộ lại"** trên row `Lỗi đồng bộ` | Suy luận từ `FR-VII-03 §Postconditions` (cần recovery path) | Medium (new) |
| 3 | UI **không hiện toast `ERR-CK-02 "Lỗi kết nối Cổng PLQG. Vui lòng thử lại sau"`** dù SRS yêu cầu | `FR-VII-03 §Error Handling E2` | Medium (new) |

### State machine — vẫn PASS

3 transitions verified R2:
- `NHAP → CONG_KHAI`: 2 lần (DN + Lao động) — POST `/cong-khai` 200, state đổi đúng
- `CONG_KHAI → AN`: 1 lần (Lao động) — POST `/an` 200, state đổi đúng
- `AN → CONG_KHAI`: 1 lần (HĐ Dân sự re-publish) — POST `/cong-khai` 200, state đổi đúng

→ State machine **không lệch SRS**. Chỉ side-effect đồng bộ Cổng PLQG thì fail.

### Cascade impact R2

| Downstream task | R1 verdict | R2 verdict |
|-----------------|-----------|-----------|
| P4 T4.10 Biểu mẫu functional (38 TC) | ✅ UNBLOCKED | ✅ UNBLOCKED — 3 thư mục `CONG_KHAI` sẵn (Thuế + DN + HĐ DS), gấp 3 lần R1 |
| API outbound FR-XII DM Biểu mẫu công khai | ☑ Test path mở | ☑ Test path mở |
| Bug fix verify | — | ❌ Dev claim fix NOT verified — escalate dev re-investigate |

### Verdict R2

⚠️ **PASS-WITH-BUGS** — workflow state machine vẫn PASS. **BUG-FLOW-BIEUMAU-001 re-confirmed Open** sau dev claim fix. Đề xuất escalate dev: kiểm tra DM_CONFIG / env Cổng PLQG endpoint URL trên môi trường test.

*R2 re-test complete: 2026-04-28 23:35 | QA via Chrome DevTools MCP*

---

## R3 Verify (2026-04-29 16:13 — LATEST)

### Lý do verify

User yêu cầu "verify xem bug thuộc C1 đã fix thành công chưa" → kiểm tra 3 bug Open của BIEUMAU trước khi quyết định chạy lại full workflow.

### Tài khoản dùng

`cb_nv_tw_01` / `Secret@123` / OTP `666666` (bypass).

### Bước verify

| # | Thao tác | Thư mục | API | State result | Sync result |
|:-:|----------|---------|-----|:------------:|:-----------:|
| **R3-1** | Initial load `/bieu-mau/thu-muc` | 5 thư mục (thêm SMOKE-TM-FR09-20260429 so với R2) | `GET /thu-muc-bieu-maus` 200 | 4×`CONG_KHAI` + 1×`AN` (HĐ Lao động) | 4/4 `Lỗi đồng bộ` từ R2, HĐ LĐ=`Lỗi đồng bộ` |
| **R3-2** | Click [Công khai] → confirm | HĐ Lao động id=`551c792a-...` | POST `/thu-muc-bieu-maus/{id}/cong-khai` 200 | ✅ PASS — state đổi `Đã công khai` | `Đang đồng bộ` → sau ~20s+ server ERR_TIMED_OUT → fresh load = `Lỗi đồng bộ` ❌ |

### Final state cuối R3

| Thư mục | trangThai | syncStatus UI |
|---------|-----------|:-------------:|
| SMOKE-TM-FR09-20260429 | `CONG_KHAI` | Lỗi đồng bộ |
| Biểu mẫu Thuế | `CONG_KHAI` | Lỗi đồng bộ |
| Biểu mẫu Doanh nghiệp | `CONG_KHAI` | Lỗi đồng bộ |
| HĐ Dân sự - Thương mại | `CONG_KHAI` | Lỗi đồng bộ |
| HĐ Lao động | `CONG_KHAI` | Lỗi đồng bộ |

**5/5 thư mục `Lỗi đồng bộ` — BUG-001 chưa fix.**

### Bug status sau R3

| Bug ID | R2 status | R3 status | Ghi chú |
|--------|-----------|-----------|---------|
| BUG-FLOW-BIEUMAU-001 | Open | **Open (re-confirmed)** | 5/5 thư mục vẫn `Lỗi đồng bộ` sau publish |
| BUG-FLOW-BIEUMAU-002 | Open | **Open (re-confirmed)** | 0 toast "Lỗi kết nối Cổng PLQG" xuất hiện trong ~20s sau publish HĐ Lao động |
| BUG-FLOW-BIEUMAU-003 | Open | **Partially observed** | HĐ Lao động đi qua "Đang đồng bộ" ~20s trước khi về "Lỗi đồng bộ". R2 từng ~3-12s. Khả năng BE đã set PENDING trước khi fail — nhưng retry cũng fail (BUG-001 root cause). Server ERR_TIMED_OUT trong lúc đang đồng bộ. Cần dev confirm. |

### Observation mới R3

- Server ERR_TIMED_OUT xảy ra sau ~20s sync "Đang đồng bộ". Có thể sync attempt gây network timeout phía BE → ảnh hưởng availability.
- Cổng PLQG Invalid URL vẫn là root cause của cả 3 bug. Không thể test BUG-002 toast / BUG-003 retry nếu BUG-001 chưa fix.

### Verdict R3

⚠️ **PASS-WITH-BUGS (LATEST)** — State machine PASS. **3 bug Open**, dev chưa fix. Không đủ điều kiện chạy lại full workflow C1 (bug 3/3 Open). Workflow C1 sẽ re-run sau khi dev fix BUG-001 (Invalid URL Cổng PLQG).

*R3 verify complete: 2026-04-29 16:27 | QA via Chrome DevTools MCP*
