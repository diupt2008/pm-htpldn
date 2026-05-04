# Kế Hoạch Kiểm Thử — {{MODULE_NAME}} ({{FR_RANGE}}, {{SCR_RANGE}})

> **Phiên bản**: 1.0
> **Ngày tạo**: YYYY-MM-DD
> **Nguồn dữ liệu**: {{SOURCE — xem SOURCE MODE bên dưới}}
> **SRS Reference**: {{FR_GROUP}}, {{TPL_IF_ANY}}, {{SCR_IDS}}

> **Quy trình:** Theo [scaling-test-strategy.md §4.1 Bước 3](../../scaling-test-strategy.md) — trích BR từ nguồn dữ liệu (xem SOURCE MODE) + sibling-check ≥2 module cùng nhóm + BA sign-off trước khi viết TC detail.
>
> **v3.0 (2026-04-23):** Test plan này dùng cho **GĐ 3 Functional + Auth + Edge**. GĐ 1 Seed + GĐ 2 Workflow là 2 phase riêng, output `seed-checklist-{module}.md` + `workflow-test-report-{module}.md`. Happy path đã cover ở GĐ 2 — TC ở đây chỉ còn **negative + edge + auth + cross-module**.

---

## HƯỚNG DẪN SỬ DỤNG TEMPLATE (xóa section này sau khi copy)

### SOURCE MODE (chọn 1)

| Mode | Nguồn dữ liệu | Cột "Nguồn" trong BR table | Quy tắc |
|------|---------------|---------------------------|--------|
| **LOCAL** | `srs-v3.md`, `srs-fr-XX.md` (file local) | `srs-fr-XX:line_number` | Đọc file local, cite line number |
| **NOTEBOOKLM** | NotebookLM notebook ID/URL | `NLM cite [N]` hoặc `NLM session:cite` | **KHÔNG đọc file local `input/srs-v3/`**. Mọi SRS content lấy 100% từ NotebookLM. Chỉ đọc local cho: template, users.csv, reference test cases |

> ⚠️ **IRON RULE**: Khi user chỉ định "KO dùng local" → bắt buộc dùng mode **NOTEBOOKLM**. KHÔNG `view_file` bất kỳ file nào trong `input/srs-v3/`. Vi phạm = context phình → vượt token limit.

### Các bước

1. **Chọn SOURCE MODE** theo yêu cầu user.
2. **Thay placeholder:** `{{MODULE_NAME}}`, `{{FR_RANGE}}`, `{{SCR_RANGE}}`, `{{entity_chinh}}` ...
3. **Fill §2.1 BR table:** Trích BR từ nguồn (LOCAL: grep srs-v3.md Phụ lục B / NOTEBOOKLM: query BR). Ngoại lệ phải QUOTE nguyên văn, không tự suy luận.
4. **Fill §2.4 UI Layout:** liệt kê components từ SCR-XXX. Không viết "KHÔNG có Feature X" nếu không có SRS quote.
5. **Sibling-check:** so §2.1 với ≥2 test plan cùng nhóm (vd QTHT nội bộ → Nhat-ky + Tai-khoan).
6. **BA/PO sign-off** trước khi viết TC.
7. **Xóa hướng dẫn này khỏi file sau khi copy.**

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- {{Tóm tắt module — UC range, FR count}}
- Bảng dữ liệu chính: {{entity_chinh}}
- Màn hình: {{SCR_IDS}}

### 1.2 Danh sách FR / UC

| # | Mã FR | Use Case | Tên chức năng | Entity | File Test Case |
|---|--------|----------|--------------|--------|----------------|
| 1 | FR-X-01 | UCxx | {{tên}} | {{ENTITY}} | `01-TC-xxx.md` |
| ... | | | | | |

### 1.3 Tài khoản & role liên quan

| Role | Cấp | Username (users.csv) | Dùng cho TC loại |
|------|-----|-----------------------|-------------------|
| QTHT | — | qtht_01 | CRUD admin (primary). `_02` fallback, `_03` permission test |
| CB_NV_TW | TW | cb_nv_tw_01 | Functional CRUD scope TW |
| CB_PD_TW | TW | cb_pd_tw_01 | Phê duyệt TW |
| ... | ... | ... | ... |

> Reference: [input/users.csv](../../../input/users.csv), [input/test-accounts-isolation.csv](../../../input/test-accounts-isolation.csv) (usage guide permission test), [output/permission-matrix.md](../../permission-matrix.md)

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Business Rules (BR)

> ⚠️ **Quy định điền bảng:**
> - Cột "**Ngoại lệ SRS-quoted**": chỉ điền khi SRS có dòng ngoại lệ cụ thể (quote nguyên văn + link line).
> - Để trống nếu không có ngoại lệ SRS — nghĩa là **BR áp dụng 100%** cho module này.
> - **KHÔNG** viết "KHÔNG áp dụng cho module X" nếu không có SRS quote → thay bằng SPEC-CLARIFY ticket.

| Mã | Quy tắc | Nguồn (SRS line / NLM cite) | Áp dụng module này? | Ngoại lệ SRS-quoted | TC áp dụng |
|----|---------|------------------|---------------------|---------------------|-----------|
| BR-AUTH-02 | Phân cấp 3 tầng TW/BN/ĐP | srs-v3.md:3950 | ✅ Yes | — | Precondition login |
| BR-AUTH-03 | Ngang cấp KHÔNG thấy nhau | srs-v3.md:3951 | ✅ Yes | "QTHT thấy tất cả" | TC permission cross-unit |
| BR-AUTH-08 | Phân quyền dữ liệu theo `don_vi_id` | srs-v3.md:3958 | ✅ Yes | — | TC data isolation |
| BR-DATA-01 | Soft delete | srs-v3.md:3972 | ✅ Yes | — | TC DELETE = UPDATE is_deleted |
| BR-DATA-05 | Audit trail CUD | srs-v3.md:3976 | ✅ Yes | — | TC verify AUDIT_LOG INSERT |
| BR-DATA-06 | Export Excel max 10k rows | srs-v3.md:3977 | ✅ Yes (default) | (điền nếu SRS có ngoại lệ cho module này) | TC Export happy + 10k boundary + filter-aware |
| BR-DATA-07 | Pagination default 20, max 100 | srs-v3.md:3978 | ✅ Yes | — | TC pagination boundary |
| BR-EC-01 | Optimistic Locking | srs-v3.md:4066 | ✅ Yes | — | TC conflict UPDATE → ERR-SYS-02 |
| BR-EC-13 | Search sanitize max 200 ký tự | srs-v3.md:4078 | ✅ Yes | — | TC search SQL/XSS/long query |
| ... | (module-specific BR) | | | | |

> **Bổ sung BR specific module:** sau khi fill xong BR cross-cutting từ SRS Phụ lục B, thêm BR riêng của module (VD: BR-CALC-XX cho Chi trả, BR-FLOW-XX cho Hỏi đáp).

### 2.2 Error Codes

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity |
|--------|-------------------|----------------------|----------|
| ERR-XXX-01 | ... | "..." | ERROR |

> ⚠️ Message phải quote **nguyên văn** từ SRS. Khi test negative, expected message match exact → không được "close enough" accept.

### 2.3 Permission Matrix (module-specific)

> Reference đầy đủ: [output/permission-matrix.md](../../permission-matrix.md)

| Entity / Action | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|-----------------|------|-------|-------|----|----|-----|----|
| {{entity}} | CRUD | R | R | ... | ... | ... | ... |

### 2.4 UI Layout ({{SCR_ID}})

> ⚠️ **CẢNH BÁO:** Đây là visual spec components từ SRS SCR-XXX (thường là UX-Spec MH-XX.Y).
> **KHÔNG dùng absence (UI spec không list X) để khẳng định "module KHÔNG có X".**
> Mọi feature không có trên UI phải đối chiếu §2.1 BR table + [SRS Phụ lục B](../../../input/srs-v3/srs-v3.md) trước.

**Components (trích từ SRS SCR-XXX):**
- **Toolbar**: Breadcrumb + {{buttons từ SRS}}
- **Sidebar (nếu có)**: {{tabs}}
- **Filter-bar**: {{filter components}}
- **Content/Table**: {{columns}}
- **Modal/Drawer**: {{form fields + buttons}}

**Cross-cutting features MẶC ĐỊNH có (theo BR global):**
- ☐ Nút [Xuất Excel] trên toolbar (BR-DATA-06) — **có nếu module là CRUD list, trừ SRS có ngoại lệ quote**
- ☐ Pagination 20/page default (BR-DATA-07)
- ☐ Search với sanitize max 200 chars (BR-EC-13)
- ☐ URL sync filter (BR-UX-01 nếu module có filter)
- ☐ Audit log mọi CUD (BR-DATA-05)
- ☐ Optimistic lock mọi UPDATE/DELETE (BR-EC-01)

**Feature module KHÔNG có (cần QUOTE SRS line hoặc SPEC-CLARIFY):**
- {{Feature X — lý do: SRS quote}} / {{Feature Y — SPEC-CLARIFY-XXX}}

### 2.5 State Machine (nếu có)

{{Nếu module có workflow — vẽ diagram hoặc reference srs-fr-XX.md Section 5}}

### 2.6 Data dependencies & Seed / Workflow input (v3.0)

| Phase | Input file | Section dùng |
|-------|-----------|--------------|
| **GĐ 1 Seed (pure entry state)** | [`input/data/seed-fixture.yaml`](../../../input/data/seed-fixture.yaml) | `{{entity_key}}_variants[1..6]` |
| **GĐ 1 click flow** | [`input/flow-module.md`](../../../input/flow-module.md) | §{{module_section}} Bước 1 (thủ công) |
| **GĐ 2 Workflow** | [`input/flow-module.md`](../../../input/flow-module.md) | §{{module_section}} bảng flow Bước 1 → N + Phụ lục 2 preset (nếu cần) + Phụ lục 3 troubleshooting |
| **Cross-module map** | [`input/data/entity-map.md`](../../../input/data/entity-map.md) | Verify entity tạo tại SCR nào, đọc tại SCR nào |

**Upstream dependencies (Tier check):**

| Entity của module | Tier | Phụ thuộc entity nào (upstream) | Seed trước tại module |
|-------------------|:----:|----------------------------------|-----------------------|
| {{ENTITY}} | {{1/2/3/4}} | {{parent entity}} | {{module upstream}} |

> **Lưu ý:** KHÔNG hardcode `N records, states X/Y` ở đây — fixture đã chốt 6 variants/entity. Workflow advance state là việc của **GĐ 2 Workflow** (workflow-test-report-{{module}}.md), không phải precondition của test plan.

---

## 3. Cấu Trúc File Test Case

```
{{module_folder}}/
├── 00-test-plan-overview.md          ← File này
├── 01-TC-XXX.md                      ← Nhóm TC 1
├── 02-TC-YYY.md                      ← Nhóm TC 2
├── ...
└── (11-REVIEW-edge-case-hunter.md)   ← Optional: review từ bmad-review-edge-case-hunter
```

---

## 4. Tổng Quan Số Lượng Test Cases

| File | Happy | Negative | Edge | Tổng |
|------|-------|----------|------|------|
| 01 - ... | | | | |
| **TỔNG** | | | | |

**Phân bổ priority:**

| Priority | Số TC | % |
|----------|------:|--:|
| P0 (bắt buộc) | | |
| P1 (quan trọng) | | |
| P2 (nên có) | | |

---

## 5. Tiêu chí đạt/không đạt

> Reference: [output/test-strategy.md §10](../../test-strategy.md)

- ✅ **PASS:** 100% P0 + 90% P1 pass
- ❌ **FAIL:** bất kỳ P0 nào FAIL, hoặc P1 pass rate < 90%

---

## 6. Tham chiếu

- [output/test-strategy.md](../../test-strategy.md) — chiến lược tổng thể
- [output/scaling-test-strategy.md](../../scaling-test-strategy.md) — quy trình 7 bước onboard
- [input/srs-v3/srs-v3.md Phụ lục B](../../../input/srs-v3/srs-v3.md) — BR cross-cutting (line 3939-4088)
- [output/permission-matrix.md](../../permission-matrix.md) — ma trận phân quyền
- [output/template/test-case-template.md](test-case-template.md) — template TC field-level
- [output/template/test-case-execution-report-template.md](test-case-execution-report-template.md) — template execution report
- [output/template/bug-report-template.md](bug-report-template.md) — template bug report

---

*Template generated from lessons learned 2026-04-21 (BUG-DM-001 case study — QA inference sai BR-DATA-06)*
