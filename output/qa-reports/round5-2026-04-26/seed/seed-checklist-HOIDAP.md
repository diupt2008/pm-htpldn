# Seed Checklist — Hỏi đáp pháp lý (T1.C1)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 00:48 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `MỚI`
**Màn:** SCR-II-01 — Quản lý hỏi đáp • **Đường dẫn:** `/hoi-dap`
**Dữ liệu mẫu:** [seed-fixture.yaml > hoi_dap_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-II-01 SM-HOIDAP

---

## Kết quả: ✅ XONG 6/6 MOI tại thời điểm seed (4 reuse R4 + 2 NEW R5)

Tổng có 9 record HD trong list — 6 state Mới (đạt acceptance ≥6) + 3 state Tiếp nhận (2 từ R4 + 1 advance trong P2 Trụ A4).

> **Note post-seed:** HD-20260426-001 đã được advance Mới → Tiếp nhận trong P2 Trụ A4 workflow test (cùng ngày 2026-04-27 01:01) → snapshot pool MOI hiện còn 5. Acceptance vẫn đạt vì tại thời điểm seed gate xong là 6/6 MOI.

**Bug:** không có SRS-ref bug mới • Obs duy nhất: dropdown Lĩnh vực thiếu `DOANH_NGHIEP` + `HOP_DONG` (regression cross-round 6th — fallback `Kinh doanh thương mại`).

---

## Bảng dữ liệu seed

| # | Mã HD | Tiêu đề | Lĩnh vực | Kênh | Trạng thái | Nguồn |
|---|-------|---------|----------|------|------------|-------|
| 1 | HD-20260424-003 | Hoàn thuế GTGT đầu vào hàng nhập khẩu | Thuế | Dịch vụ công | Mới | reuse R4 |
| 2 | HD-20260424-004 | Thời hạn HĐ lao động xác định thời hạn | KDTM | Cổng PLQG | Mới | reuse R4 |
| 3 | HD-20260424-005 | Thủ tục tăng vốn điều lệ TNHH 2 TV | KDTM | Dịch vụ công | Mới | reuse R4 |
| 4 | HD-20260424-006 | Thủ tục đăng ký bảo hộ nhãn hiệu | SHTT | Cổng PLQG | Mới | reuse R4 |
| 5 | HD-20260426-001 | HKD chuyển đổi thành Công ty TNHH | KDTM | Trực tiếp | Mới | NEW (variant 7 bounce-back) |
| 6 | HD-20260426-002 | Quy chế làm thêm giờ DN logistics | Lao động | Dịch vụ công | Mới | NEW (variant 8 CONG_KHAI) |

**Tổng:** 6 vào kho / 0 bị chặn

---

## Quan sát

- **Obs 1 — regression dropdown Lĩnh vực:** Form Tạo HD chỉ có 10 lĩnh vực (Dân sự / Hình sự / Hành chính / Lao động / Đất đai / HNGD / KDTM / KNTC / Thuế / SHTT). Thiếu `DOANH_NGHIEP` + `HOP_DONG` — cross-round 6th lần ghi nhận (memory `qa_htpldn_baigiang_seed_round4`). Test phải fallback "Kinh doanh thương mại" cho variant 7.
- **Obs 2 — MCP fill_form không persist multiline:** Textarea "Nội dung câu hỏi" cần dùng `type_text` sau focus thay `fill_form` (đã verify R4).

---

*2026-04-27 00:48 — QA chạy bằng Chrome DevTools MCP*
