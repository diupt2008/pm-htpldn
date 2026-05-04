# Plan Test Chi Tiết — 16 Module PM HTPLDN

> **Mục đích:** Viết + chạy TC chi tiết field-level (BVA/EP/XSS/permission) cho **toàn bộ 16 module FR-01 → FR-16**. Khác với [`plan.md`](plan.md) (workflow + functional smoke). Bổ sung cho §G9 plan cũ.
>
> **Ngày tạo:** 2026-04-30 · **Owner:** 1 tester FT · **Estimate:** 19-22 ngày (Phase A 7-9 ngày + Phase B 12-15 ngày, có overlap song song)
>
> **Nguồn thứ tự:** [`02-thu-tu-module.md`](../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) — 5 lớp dependency Lớp 1 → 5

---

## 1. Hai Phase

| Phase | Mục đích | Tool chính | Áp dụng cho |
|---|---|---|---|
| **A — Viết TC** | Sinh TC từ SRS | Skill BMAD (test-design + generate-e2e + edge-case-hunter) | 14 module 📝 (chưa có TC) |
| **B — Chạy TC** | Execute TC, log bug | MCP chrome-devtools + `/qa-only` | 16 module (4 ✅ + 14 sau khi A xong) |

**Quy ước trạng thái mỗi module:**
- Phase A: 📝 chưa viết · 🔵 đang viết · ✅ có TC · ⚠️ partial (SRS gap)
- Phase B: 🚫 chờ TC/bug · 🟢 sẵn sàng · 🔵 đang chạy · ✅ PASS · ⚠️ partial · 🚫 FAIL

---

## 2. Scope — 20 testable unit theo thứ tự ràng buộc nhân quả

> **Iron rule:** module Lớp N+1 chỉ test khi data Lớp N đủ. Vi phạm = TC fail dù code đúng.

| # | Lớp | Module | FR | TC | Phase A | Phase B | Bug chặn |
|---|---|---|---|---:|---|---|---|
| 1 | 1 | QTHT — Cấu hình HT | FR-10 (VIII-06) | 79 | ✅ Có TC | ⚠️ 32/79 (T4.8) | — |
| 2 | 1 | QTHT — DM dùng chung | FR-10 (VIII-01) | 187* | ✅ Có TC | 🟢 ready | — |
| 3 | 1 | QTHT — TKPQ | FR-10 (VIII-02..05) | 128 | ✅ Có TC | 🟢 ready | — |
| 4 | 1 | QTHT — Nhật ký HT | FR-10 (VIII-10) | 46 | ✅ Có TC | 🟢 ready | — |
| 5 | 2 | Doanh nghiệp | FR-07 | 224 | ✅ Có TC | ⚠️ 18/224 (T4.4) | 4 bug functional-DN |
| 6 | 2 | CG/TVV | FR-04 | ~80 | 📝 chưa viết | 🚫 chờ A + BUG | BUG-TVCS-003/004 |
| 7 | 2 | Biểu mẫu | FR-09 | ~60 | 📝 chưa viết | 🚫 chờ A | 3 bug-flow-BIEUMAU |
| 8 | 2 | CT HTPLDN GĐ1 | FR-15 | ~70 | 📝 chưa viết | 🚫 chờ A | 3 bug-flow-CTHTPLDN |
| 9 | 3 | Vụ việc TGPL ⭐ | FR-05 | ~120 | 📝 chưa viết | 🚫 chờ A + BUG | BUG-FLOW-VUVIEC-001 |
| 10 | 3 | Hỏi đáp | FR-02 | 118 | ✅ Có TC | ⚠️ 35/118 (T4.1) | BUG-HOIDAP-001 + 004 |
| 11 | 3 | TV Chuyên sâu | FR-12 | ~80 | 📝 chưa viết | 🚫 chờ A + #6 | BUG-TVCS-004 |
| 12 | 3 | Đào tạo Khóa học | FR-03 | ~100 | 📝 chưa viết | 🚫 chờ A + B7 | bug-flow-KHOAHOC |
| 13 | 4 | Hợp đồng TV | FR-14 | ~50 | 📝 chưa viết | 🚫 chờ A + E1 | E1 unblock pending |
| 14 | 4 | Chi trả | FR-06 | ~70 | 📝 chưa viết | 🚫 chờ A + E3 + #9 | E3 + Vụ việc HT |
| 15 | 4 | TV Nhanh | FR-13 | ~60 | 📝 chưa viết | 🚫 chờ A + E4 | E4 + Kho QA |
| 16 | 4 | Đánh giá HQ | FR-08 | ~80 | 📝 chưa viết | 🚫 chờ A + #9 | Vụ việc HT + D2 |
| 17 | 5 | CT HTPLDN GĐ2 | FR-15 | ~50 | 📝 chưa viết | 🚫 cascade | #8 + #9 + #14 |
| 18 | 5 | Báo cáo TK | FR-11 | ~80 | 📝 chưa viết | 🚫 cascade | 9 module DA_DUYET |
| 19 | 5 | Dashboard | FR-01 | ~40 | 📝 chưa viết | 🚫 cascade | ≥3 record/module |
| 20 | 5 | API Kết nối | FR-16 | ~50 | 📝 chưa viết | 🚫 cascade | data CONG_KHAI |

\* 187 = TPL strategy (47 đại diện + 5×13 smoke + 75 đặc thù)

**Tổng:** 4 module ✅ Có TC + 14 📝 chưa viết · ~990 TC dự kiến viết thêm + 717 đã có

> **Quy tắc sync:** Update [`todo.md`](todo.md) cột Phase A xong → cell Phase B tự ready. Không cần file index trung gian.

---

## 3. Tools & Skills

### 3.1 Phase A — Skill BMAD

| Bước | Skill | Output |
|---|---|---|
| A1 | `bmad-domain-research` (nếu module phức tạp) | Hiểu nghiệp vụ trước khi viết |
| A2 | `bmad-testarch-test-design` | `00-test-plan-overview.md` |
| A3 | `bmad-qa-generate-e2e-tests` | `01..NN-TC-*.md` |
| A4 | `bmad-review-edge-case-hunter` | Bổ sung edge case |
| A5 | `bmad-testarch-trace` | Traceability BR/AC ↔ TC |
| A6 | `bmad-testarch-test-review` | Review chất lượng TC |

**Skill hỗ trợ:** `bmad-advanced-elicitation` (SRS mơ hồ), NotebookLM (verify SRS), `/browse` (explore UI thực).

### 3.2 Phase B — MCP + skill QA

| Tool | Dùng cho |
|---|---|
| MCP `new_page` + `navigate_page` | Login, isolated context multi-role |
| MCP `take_snapshot` + `wait_for` | Lấy uid + chờ render (≥10s) |
| MCP `fill_form` + `click` + `type_text` | Field input + OTP `666666` |
| MCP `list_network_requests` | Verify API URL/payload/status |
| MCP `list_console_messages` | Bắt FE error |
| MCP `evaluate_script` | Đếm rows, dropdown virtual scroll |
| MCP `take_screenshot` | Bằng chứng + bug embed |
| `/qa-only` | Chạy batch TC — không tự fix |
| `/investigate` | Bug → root cause |
| `/qa` | **TRÁNH** — auto-fix code không phù hợp |

---

## 4. Workflow chuẩn

### Phase A — 6 bước/module

```
A1. Đọc SRS srs-fr-XX.md + 02-thu-tu-module §module + sibling-check ≥2 module
A2. bmad-testarch-test-design → 00-test-plan-overview.md (template + BR + permission)
A3. bmad-qa-generate-e2e-tests → 01-TC-*.md (mỗi UC = 1 file)
A4. bmad-review-edge-case-hunter → bổ sung edge case
A5. bmad-testarch-trace → traceability matrix
A6. bmad-testarch-test-review → review chất lượng
```

**Rule cứng:** mọi BR phải QUOTE SRS line; permission TC tách file riêng theo pattern DN; nếu SRS gap → log SPEC-CLARIFY, không bịa.

### Phase B — 5 bước/TC

```
B1. Login đúng role — MCP template (từ CLAUDE.md)
B2. Navigate đến SCR — click sidebar (KHÔNG navigate_page sau login)
B3. Thực thi steps + capture: screenshot + network + console
B4. So expected vs actual:
    - PASS → log 1 dòng vào functional-detailed-{module}.md
    - FAIL → /investigate → 2-source SRS verify → log bug
B5. Update todo.md → flip ✅/⚠️/🚫
```

**Rule cứng:** bug có SRS ref + verify NotebookLM + grep local; bug Open embed screenshot inline; dropdown AntD scroll virtual list; permission TC dùng `_03`.

---

## 5. Thứ tự thực thi (5 wave Lớp 1→5)

> Phase A và Phase B chạy **song song**: WB1 (4 module ✅) chạy ngay khi user duyệt; WA2 viết TC song song để khi WB1 xong, WB2 sẵn sàng.

| Wave | Lớp | Modules | Phase A | Phase B | Estimate |
|---|---|---|---|---|---|
| W1 | 1 | 4 QTHT | (đã có) | 🟢 ready ngay | 3 ngày |
| W2 | 2 | DN + CG-TVV + BM + CT GĐ1 | WA2.1-2.3 (1.5 ngày) | WB2.1 ngay; WB2.2-4 sau A | 4 ngày (gồm A) |
| W3 | 3 | HD + VV + TVCS + KH | WA3.1-3.3 (2.5 ngày) | WB3.1 ngay; WB3.2-4 sau A | 3 ngày (gồm A) |
| W4 | 4 | HĐTV + CT + TVN + ĐG | WA4.1-4.4 (2 ngày) | sau A + Trụ E unblock | 2 ngày |
| W5 | 5 | CT GĐ2 + BC + DB + API | WA5.1-5.4 (2 ngày) | sau A + cascade | 2 ngày |

**Checkpoint sau mỗi wave:** user duyệt qua wave kế (xem `todo.md`).

---

## 6. Strategy đặc thù

### 6.1 TPL-DM-CRUD-chung (W1.3)
47 TC × 14 DM = 658 → **187 TC** (47 đại diện DM Lĩnh vực + 5×13 smoke + 75 đặc thù 9 DM riêng)

### 6.2 Module bị block bug Open (Phase B)
- **CG-TVV (#6):** Phase A vẫn viết TC, Phase B defer chờ BUG-TVCS-003/004 close
- **Vụ việc (#9):** Phase A viết TC, Phase B defer chờ BUG-VUVIEC-001 close
- **Hỏi đáp 4 TC (#10):** skip do BUG-HOIDAP-001+004, đánh dấu defer

### 6.3 Module phụ thuộc Trụ E
HĐTV (E1), CT HTPLDN (E2), Chi trả (E3), TV nhanh (E4) — daily monitor [`plan.md` §3.3 Trụ E](plan.md). Cuối T2 chưa unblock → defer Wave 4-5.

---

## 7. Acceptance criteria

| Mức | Ngưỡng |
|---|---|
| Module Phase A DONE | 6 bước A1-A6 + traceability ≥95% BR + 0 SPEC-CLARIFY pending |
| Module Phase B PASS | P0 100% + P1 ≥90% + 0 Critical Open |
| Wave PASS | Mọi module trong wave PASS hoặc DEFER có lý do |
| Plan PASS | 5/5 wave + Aggregate report duyệt |

---

## 8. Risk

| Risk | Impact | Mitigation |
|---|---|---|
| Skill BMAD generate TC chất lượng thấp | High | A4 edge-case-hunter + A6 test-review bắt buộc |
| 5 bug Critical Open chặn ≥4 module Phase B | High | Defer module bị block, chạy module 🟢 trước |
| Trụ E không unblock | High | DEFER Wave 4-5 nếu cuối T2 chưa ready |
| Phase A blow up >2 ngày/module | Medium | Cap cứng, P0 trước, P1/P2 defer |
| 5 mâu thuẫn SRS pending BA | Medium | Quote BA email, không log bug mới |

---

## 9. Output kỳ vọng

```
output/test-cases/{module}/                       ← Phase A output
├── 00-test-plan-overview.md
└── 01-TC-*.md ... NN-TC-*.md

output/execution-test/{module}/                   ← Phase B output (1 folder/module)
├── functional-detailed-{module}.md
├── bug-detailed-tc-{module}.md
├── screenshots/                                  ← evidence
└── network-logs/                                 ← API response capture

output/execution-test/_aggregate-detailed-tc.md   ← cuối plan
```

**Folder đã có sẵn (giữ nguyên tên):**
- `execution-test/QTHT/{Cau-hinh-he-thong, DM-dung-chung, Nhat-ky-he-thong, tai-khoan-phan-quyen}` → cho W1.1-W1.4
- `execution-test/quan-ly-doanh-nghiep/` → cho W2.1
- `execution-test/chuyen-gia-tu-van-vien/` → cho W2.2
- `execution-test/hoi-dap/` → cho W3.1

**Folder cần tạo mới (12 module 📝):**
- `execution-test/bieu-mau/` (W2.3)
- `execution-test/ct-htpldn-gd1/` (W2.4)
- `execution-test/vu-viec/` (W3.2)
- `execution-test/tv-chuyen-sau/` (W3.3)
- `execution-test/dao-tao/` (W3.4)
- `execution-test/hop-dong-tv/` (W4.1)
- `execution-test/chi-tra/` (W4.2)
- `execution-test/tv-nhanh/` (W4.3)
- `execution-test/danh-gia/` (W4.4)
- `execution-test/ct-htpldn-gd2/` (W5.1)
- `execution-test/bao-cao/` (W5.2)
- `execution-test/dashboard/` (W5.3)
- `execution-test/api-ket-noi/` (W5.4)

---

## 10. Liên kết

- Todo (Phase A + B sync 1 file): [`todo.md`](todo.md)
- Plan tổng workflow: [`tasks/plan.md`](../plan.md)
- Source thứ tự module: [`02-thu-tu-module.md`](../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md)
- Test strategy: [`test-strategy.md`](../../output/test-strategy.md)
- BR Phụ lục B: [`srs-v3.md` line 3939-4088](../../input/srs-v3/srs-v3.md)
- Permission matrix: [`permission-matrix.md`](../../output/permission-matrix.md)
- Template TC: [`output/template/`](../../output/template/)
