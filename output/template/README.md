# Template QA Report — Hướng dẫn sử dụng

> **Update 2026-04-23 (v3.0):** Thêm 2 template cho quy trình **Seed → Workflow → Functional** mới.

## Files trong folder

| File | Mục đích | Phase v3.0 |
|------|---------|:----------:|
| [smoke-test-report-template.md](smoke-test-report-template.md) | Báo cáo smoke test 4 bước | **GĐ 0** |
| [seed-checklist-template.md](seed-checklist-template.md) | Checklist seed 6 variant/entity (pure — entry state only) | **GĐ 1** |
| [workflow-test-report-template.md](workflow-test-report-template.md) | Báo cáo walk workflow bảng flow-module.md Bước 1→N + reject branches + preset E2E | **GĐ 2** |
| [functional-test-report-template.md](functional-test-report-template.md) | Báo cáo functional (negative + edge, happy đã cover GĐ 2) — 2 tầng Summary + Detailed | **GĐ 3** |
| [test-case-execution-report-template.md](test-case-execution-report-template.md) | Báo cáo chạy folder TC chi tiết (nhiều file TC) — dashboard tổng + breakdown | GĐ 3 |
| [permission-matrix-test-report-template.md](permission-matrix-test-report-template.md) | Báo cáo test ma trận phân quyền (N role × entity) | GĐ 3 Auth |
| [test-plan-overview-template.md](test-plan-overview-template.md) | Kế hoạch test module (BR + permission + UI layout) | Pre-GĐ 3 |
| [bug-report-template.md](bug-report-template.md) | Báo cáo bug chi tiết (repro, evidence, fix) | Mọi GĐ |
| [test-case-template.md](test-case-template.md) | Template test case field-level (BVA/EP/XSS) | GĐ 3 |
| [smoke-procedure.md](smoke-procedure.md) | Procedure smoke test chuẩn | GĐ 0 |
| [README.md](README.md) | Tài liệu này | — |

### Khi nào dùng template nào?

| Tình huống | Dùng template |
|-----------|---------------|
| Smoke test 4 bước | `smoke-test-report-template.md` |
| **GĐ 1 — Seed data entry state theo seed-fixture.yaml** | **`seed-checklist-template.md`** |
| **GĐ 2 — Walk workflow bảng flow-module.md + reject branches** | **`workflow-test-report-template.md`** |
| GĐ 3 — Functional 1 module, TC không chia file | `functional-test-report-template.md` |
| GĐ 3 — Chạy folder nhiều TC file | `test-case-execution-report-template.md` |
| GĐ 3 — Ma trận N role × M entity | `permission-matrix-test-report-template.md` |
| Viết kế hoạch test module mới | `test-plan-overview-template.md` |
| Phát hiện bug → viết bug riêng | `bug-report-template.md` |

---

## Cấu trúc Functional Test Report — 2 tầng (IEEE 829)

**Tầng 1 — Test Results Summary** (Section 2): 1 dòng / TC, 8 cột, scan nhanh
```
| ID | TraceID | Tên TC | Type | Priority | Result | Bug ID | Nguyên nhân |
```

**Tầng 2 — Detailed Test Results** (Section 4): chi tiết từng TC
```
- Pre-conditions
- Test Data (JSON)
- Test Steps (bảng Step/Action/Expected/Actual/Status)
- Notes
```

**Nguyên tắc:** không nhồi 13 cột vào summary. Summary để scan, detail để reproduce.

---

## Cách dùng

### Bước 1: Copy template

**Functional Test Report:**
```bash
cp output/template/functional-test-report-template.md \
   output/qa-reports/round{N}_YYYY-MM-DD/{module}/functional-test-report.md
```

**Bug Report:**
```bash
cp output/template/bug-report-template.md \
   output/qa-reports/round{N}_YYYY-MM-DD/{module}/bug-report-{module}.md
```

### Bước 2: Điền thông tin

Thay thế tất cả placeholder trong ngoặc vuông `[...]`:
- Metadata phần đầu (dự án, phiên bản, ngày...)
- Từng bug: Bug ID, Severity, Priority, Type...
- Phụ lục: môi trường, tài khoản, ảnh chụp

### Bước 3: Thêm ảnh

1. Tạo folder `image/` hoặc `screenshots/` cùng cấp với file bug report
2. Lưu ảnh vào đó
3. Dùng cú pháp **embed** thay vì link:
   - ✅ `![Mô tả](image/screenshot.png)` — hiển thị ảnh
   - ❌ `[Ảnh chụp](image/screenshot.png)` — chỉ là link

---

## Quy tắc viết bug report

### 1. Severity vs Priority

| | Severity | Priority |
|--|---------|----------|
| **Ai quyết** | QA/Dev | PM/PO |
| **Nghĩa** | Mức độ hư hỏng kỹ thuật | Mức độ cần fix sớm |
| **Ví dụ** | Typo ở trang chủ → **Minor severity** + **High priority** (brand) | Crash admin menu (1 user dùng) → **Critical severity** + **Low priority** |

### 2. Type — phân loại theo test path

| Type | Khi nào dùng |
|------|-------------|
| `Happy` | Bug phát hiện khi chạy luồng chính thành công |
| `Negative` | Bug khi thử input/thao tác sai (validation fail) |
| `Edge` | Bug ở giá trị biên (boundary value) |
| `Workflow` | Bug khi chuyển trạng thái (state transition) |
| `Permission` | Bug phân quyền (role × action × data) |
| `Data` | Bug toàn vẹn dữ liệu (soft delete, sync, duplicate) |
| `UI/UX` | Bug hiển thị, giao diện, tương tác |
| `Performance` | Bug chậm, timeout |

### 3. Các trường BẮT BUỘC

Không được bỏ trống:
- [x] Bug ID (format: `BUG-{MODULE}-{NNN}`)
- [x] Severity + Priority + Type
- [x] Module + URL
- [x] Các bước tái hiện (cụ thể, lặp lại được)
- [x] Kết quả mong đợi vs Kết quả thực tế
- [x] Bằng chứng (ảnh/log/API response)

### 4. Các trường NÊN CÓ (giúp dev fix nhanh)

- [x] TC Reference — link đến test case gốc
- [x] SRS Reference — requirement nào bị vi phạm
- [x] Assignee — team nào chịu trách nhiệm
- [x] Root Cause — phân tích kỹ thuật sơ bộ
- [x] Suggested Fix — code diff hoặc hướng dẫn sửa
- [x] Impact — ai bị ảnh hưởng, nghiêm trọng mức nào

---

## Template 1 dòng cho Bug Summary Table

Copy dòng này vào bảng tổng hợp:

```
| BUG-XXX-NNN | Severity | P0/P1/P2 | Type | Module | TC-XX | Title | Open |
```

---

## Naming convention

### Bug ID
```
BUG-{SHORT_MODULE}-{NNN}

Ví dụ:
- BUG-DN-001   → Doanh nghiệp
- BUG-HD-015   → Hỏi đáp
- BUG-VV-003   → Vụ việc
- BUG-R2-001   → Round 2 (cho smoke test tổng)
```

### Tên file bug report
```
bug-report-{module-lowercase}.md

Ví dụ:
- bug-report-doanh-nghiep.md
- bug-report-hoi-dap.md
- bug-report-smoke-test.md
```

### Tên ảnh
```
{NN}-{mô-tả-ngắn}.png

Ví dụ:
- 00-login-page.png
- 01-after-login-error.png
- 02-dashboard-403.png
```

---

## Checklist trước khi submit bug report

- [ ] Đã điền hết metadata phần đầu file
- [ ] Mỗi bug có đủ: Severity + Priority + Type + TC Ref + SRS Ref
- [ ] Các bước tái hiện **viết cụ thể**, dev làm theo được
- [ ] Có ảnh/log/API response làm bằng chứng
- [ ] Ảnh được **embed** (không chỉ link)
- [ ] Có Root Cause + Suggested Fix cho bug Critical/Major
- [ ] Phụ lục đủ: môi trường + tài khoản + danh mục ảnh
- [ ] Bảng tổng hợp **khớp số lượng** với chi tiết bug
