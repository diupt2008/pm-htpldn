# Bug Report — [TÊN MODULE]

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | [TÊN DỰ ÁN] |
| **Môi trường** | [URL test] |
| **Người test** | [QA name / QA Automation] |
| **Ngày** | [YYYY-MM-DD] |
| **Loại test** | [Smoke / Functional / Regression / Permission / Workflow / ...] |
| **Round** | [Round N] |
| **Tài liệu tham chiếu** | [link test-strategy / test cases / flow-module] |

---

## Tổng hợp

Phát hiện **[N]** lỗi có SRS reference cụ thể trong quá trình test [module/phase].

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể (`FR-X`, `BR-X`, `SCR-X row Y`, `§Error Handling EN`, `Inputs row N`). Quan sát không map được clause SRS → KHÔNG log vào file bug. Xem memory `feedback_bug_must_have_srs_ref`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| N    | 0        | 0     | 0      | 0     | 0       |

> **Lưu ý:** Bảng `Test result breakdown theo Type` (rollup multi-module) đặt trong `functional-test-report` / `workflow-test-report`, KHÔNG trong file bug. File bug chỉ tập trung Severity + Bug Summary Table + Thứ tự fix đề xuất.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-XXX-001 | Critical | P0 | Permission | TC-XX | `FR-X.Y-NN §Processing Bước N` / `BR-XYZ-NN` | [Tóm tắt 1 dòng] | Open |
| BUG-XXX-002 | Major | P1 | Negative | TC-XX | `SCR-X.Y-NN Thành phần row N` | [Tóm tắt 1 dòng] | Open |

> **Chú thích Type:**
> - `Happy` — luồng chính thành công (input hợp lệ, thao tác đúng)
> - `Negative` — input/thao tác sai (sai format, thiếu field, vượt giới hạn)
> - `Edge` — giá trị biên (min/max, boundary, giá trị đặc biệt)
> - `Workflow` — chuyển trạng thái (state machine transition)
> - `Permission` — phân quyền (role × action × data scope)
> - `Data` — toàn vẹn dữ liệu (soft delete, sync, duplicate)
> - `UI/UX` — giao diện, hiển thị, tương tác
> - `Performance` — thời gian phản hồi, tải trang

> **Chú thích Severity:**
> - `Critical` — hệ thống/tính năng chính không dùng được, lộ dữ liệu, sai nghiệp vụ nghiêm trọng
> - `Major` — tính năng quan trọng lỗi nhưng có workaround
> - `Medium` — tính năng phụ lỗi, không block nghiệp vụ chính
> - `Minor` — lỗi nhỏ, không ảnh hưởng nghiệp vụ
> - `Trivial` — lỗi hiển thị, typo, cảnh báo deprecated

> **Chú thích Priority:**
> - `P0` — phải fix ngay (block release)
> - `P1` — fix trong sprint hiện tại
> - `P2` — fix trong 2-3 sprint tới
> - `P3` — fix khi có thời gian
> - `P4` — backlog

---

## BUG-XXX-001 — [Tiêu đề ngắn gọn, mô tả rõ hiện tượng]

> **Meta:** Severity, Priority, Type, Status, TC Ref, SRS Reference đã có ở **Bug Summary Table** trên. Không lặp lại trong từng bug detail.
>
> **🚫 STRICT 6 SECTIONS ONLY (2026-05-02 R11 — user nhắc lần 2):** Mỗi bug entry chỉ có 6 sections theo thứ tự dưới đây. **CẤM** thêm các section: `Tác động`, `Đề xuất fix`, `Đề xuất dev fix`, `SRS verification`, `Phân biệt module`. Mọi info thuộc các section bị cấm: gộp vào Mô tả nếu cần thiết, hoặc đẩy sang `workflow-test-report.md`. Hook `check-bug-template-sections.py` enforce. Memory ref: [`feedback_bug_report_template_strict.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_bug_report_template_strict.md).

### Mô tả

[Mô tả ngắn gọn hiện tượng lỗi — 1-3 câu. Tránh diễn giải dài dòng. Nêu rõ **ai làm gì, ở đâu, ra sao**.]

### Các bước tái hiện

1. [Bước 1 — cụ thể, có thể làm theo ngay]
2. [Bước 2]
3. [Bước 3]
4. [Quan sát: ...]

### Kết quả mong đợi

- [Hệ thống phải làm gì — theo SRS/Spec/BR nào]
- [Có thể list nhiều expected behavior]

### Kết quả thực tế

- [Hệ thống thực sự làm gì — mô tả chính xác]
- [Trích lỗi console / API response nếu có]

### Bằng chứng

> **BẮT BUỘC:** Mỗi bug phải có **≥1 screenshot inline** chứng minh hiện tượng. Không có ảnh = không log bug. API response / log chỉ là phụ trợ.

**1. Ảnh chụp** *(bắt buộc, embed inline — không chỉ link relative)*:

![BUG-XXX-001 — Mô tả ngắn ảnh chụp gì, ở đâu](image/bug-xxx-001-screenshot.png)

*(Nếu bug có nhiều bước repro hoặc nhiều state cần chứng minh, embed nhiều ảnh — mỗi ảnh có caption mô tả rõ Bước nào / State nào / Trang nào):*

![BUG-XXX-001 — Bước 1: trước action](image/bug-xxx-001-step-1-before.png)
![BUG-XXX-001 — Bước 2: sau action, lỗi xuất hiện](image/bug-xxx-001-step-2-after.png)

**2. API response / log** *(phụ trợ, optional khi bug liên quan API hoặc DB):*

```json
{
  "success": false,
  "error": {...}
}
```

**Lưu ý format ảnh:**
- Đặt ảnh trong thư mục `image/` cùng cấp với file `bug-report.md`.
- Tên file: `bug-{xxx}-{nnn}-{mo-ta-ngan-tieng-viet-khong-dau}.png`.
- Trong markdown dùng cú pháp `![alt](image/filename.png)` — KHÔNG dùng HTML `<img>` tag.
- Khi gửi cho dev qua chat / email chỉ 1 file `.md`, nhớ đính kèm cả folder `image/` hoặc convert ảnh sang base64 inline (`![](data:image/png;base64,...)`) cho bug Critical/Major Active.

### So sánh (Comparison) — *optional, dùng cho bug phân quyền*

| Role | Action A | Action B | Action C |
|------|----------|----------|----------|
| Role 1 | ✅ | ✅ | ✅ |
| Role 2 | ✅ | ❌ 403 | ❌ 403 |
| Role 3 | ❌ (BUG!) | — | — |

---

## BUG-XXX-002 — [Tiêu đề bug 2]

[Copy structure từ bug 1]

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | [URL] |
| OTP login | [vd: `666666` bypass tạm — hoặc OTP từ MailHog] |
| MailHog (OTP inbox) | [URL — giữ để fallback khi bypass tắt] |
| API base | [URL] |
| Frontend | [Stack: React + Vite + Ant Design + ...] |
| Xác thực | [JWT + OTP / OAuth / ...] |
| Tool test | [Chrome DevTools MCP / Playwright / manual] |

---

*Bug report generated: [YYYY-MM-DD] | [QA name / QA Automation via Claude Code]*
