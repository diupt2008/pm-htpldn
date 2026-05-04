# Bug Report — Khóa học (B3 Seed)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation via Chrome DevTools MCP |
| **Ngày** | 2026-04-27 |
| **Loại test** | Seed (Workflow data preparation) |
| **Round** | Round 5 |
| **Tài liệu tham chiếu** | [seed-checklist-KHOAHOC.md](../seed/seed-checklist-KHOAHOC.md) · [seed-fixture.yaml > khoa_hoc_variants](../../../../input/data/seed-fixture.yaml) · [SRS FR-III-01](../../../../input/srs-v3/srs-fr-03-dao-tao.md) |

---

## Tổng hợp

Phát hiện **1** lỗi có SRS reference cụ thể trong quá trình seed B3 (8 KH `Dự thảo`).

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể (`FR-X`, `BR-X`, `SCR-X row Y`, `§Error Handling EN`, `Inputs row N`). Quan sát không map được clause SRS → KHÔNG log vào file bug. Xem memory `feedback_bug_must_have_srs_ref`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 0        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-KH-001-R5 | Major | P1 | Data | B3 V1..V8 | `FR-III-01 §Inputs row "Ngày bắt đầu"` + `ERD KHOA_HOC.ngay_bat_dau DATE` | Ngày bắt đầu khóa học BE lưu = input − 1 ngày (timezone GMT+7 → UTC convert sai) | Open (regression UNFIXED từ R2) |

---

## BUG-KH-001-R5 — Ngày bắt đầu khóa học BE lưu = input − 1 ngày (timezone GMT+7 → UTC convert sai)

> **Meta:** Severity, Priority, Type, Status, TC Ref, SRS Reference đã có ở **Bug Summary Table** trên. Không lặp lại trong từng bug detail.

### Mô tả

`cb_nv_tw_01` tạo Khóa học tại `/dao-tao/khoa-hoc/tao-moi`. Mọi giá trị "Ngày bắt đầu" sau khi submit đều bị lệch −1 ngày so với input UI; "Ngày kết thúc" giữ nguyên đúng. Lặp lại 8/8 record (`KH-20260427-001..008`). Đã ghi nhận lần đầu R2 (memory `qa_htpldn_khoahoc_flow_round2`) và chưa được fix qua các round trung gian.

### Các bước tái hiện

1. Login `cb_nv_tw_01` → `/dao-tao/khoa-hoc/tao-moi`.
2. Fill form: Tên khóa học, Chương trình đào tạo (chọn 1 CTĐT `Đã duyệt`), Hình thức, Địa điểm, Đối tượng tham gia.
3. Click ô "Ngày bắt đầu" → type `15/05/2026` + Tab → ô "Ngày kết thúc" type `20/05/2026` + Enter.
4. Form submit OK → redirect detail page `/dao-tao/khoa-hoc/{id}`.
5. Quan sát: detail hiển thị "Ngày bắt đầu: **14/05/2026**" và "Ngày kết thúc: 20/05/2026" — start lệch −1, end đúng.
6. Lặp lại với 7 variant khác (input start ngày bất kỳ) → kết quả đều lệch −1 ngày start, end đúng.

### Kết quả mong đợi

- Theo `FR-III-01 §Inputs row "Ngày bắt đầu" (Y, định dạng date)` + `ERD KHOA_HOC.ngay_bat_dau` type `DATE`: input UI 15/05/2026 → BE lưu 15/05/2026.
- SRS không spec timezone offset, không có rule cộng/trừ ngày — input phải = stored.

### Kết quả thực tế

- Input UI 15/05/2026 → BE lưu 14/05/2026 (lệch −1).
- 8/8 (100%) variant reproduce cùng pattern:

| Input ngày BĐ | BE lưu ngày BĐ | Lệch |
|:---:|:---:|:---:|
| 15/05/2026 (V1) | 14/05/2026 | −1 |
| 01/06/2026 (V2) | 31/05/2026 | −1 |
| 10/07/2026 (V3) | 09/07/2026 | −1 |
| 25/05/2026 (V4) | 24/05/2026 | −1 |
| 01/06/2026 (V5) | 31/05/2026 | −1 |
| 15/06/2026 (V6) | 14/06/2026 | −1 |
| 01/09/2026 (V7) | 31/08/2026 | −1 |
| 01/06/2026 (V8) | 31/05/2026 | −1 |

- Root cause nghi: FE convert `Date` thành ISO string `YYYY-MM-DDTHH:mm:ss.sssZ` với TZ local GMT+7. `00:00:00 GMT+7` ↔ `17:00:00 UTC` ngày trước → BE parse `.toDateString()` ra ngày trước.
- Fix đề nghị: FE convert sang format `YYYY-MM-DD` (date-only string, không TZ) trước khi POST. Hoặc BE parse với explicit TZ `Asia/Ho_Chi_Minh`.

### Bằng chứng

> **BẮT BUỘC:** Mỗi bug phải có **≥1 screenshot inline** chứng minh hiện tượng. Không có ảnh = không log bug. API response / log chỉ là phụ trợ.

**1. Ảnh chụp** *(bắt buộc, embed inline)*:

![BUG-KH-001-R5 — List 8/8 KH `Dự thảo` cột "Ngày bắt đầu" lệch −1 ngày so với input fixture](image/bug-kh-001-timezone-list-8of8.png)

**2. Lịch sử regression**:

| Round | Ngày | Status |
|-------|------|:------:|
| R2 | 2026-04-23 | Phát hiện ban đầu (memory `qa_htpldn_khoahoc_flow_round2`) |
| R5 | 2026-04-27 | Regression UNFIXED — log lại với 8/8 evidence trên seed B3 |

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` (bypass tạm) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT (httpOnly cookie) + OTP 6 số |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-04-27 | QA Automation via Claude Code*
