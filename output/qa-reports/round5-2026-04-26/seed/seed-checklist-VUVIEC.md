# Seed Checklist — Vụ việc HTPL (T1.C2)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 01:00 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `ĐÃ TIẾP NHẬN`
**Màn:** SCR-V.I-02 — Quản lý Vụ việc HTPL • **Đường dẫn:** `/vu-viec/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > vu_viec_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-V.I-04 SM-VUVIEC

---

## Kết quả: ✅ XONG 8/8 entry DA_TIEP_NHAN (vượt acceptance ≥6 — full reuse cross-round)

Module có sẵn 8 VV `Đã tiếp nhận` từ R4 — đạt ≥6 acceptance, không cần seed thêm. Reserve variant cho test workflow A3 (Admin reopen, YEU_CAU_BS, immutability).

**Bug:** 0 bug mới (module Vụ việc đã được test sâu R2-R4, log riêng).

---

## Bảng dữ liệu seed (tất cả reuse R4)

| # | Mã VV | Tên DN | Lĩnh vực | Kênh | Trạng thái |
|---|-------|--------|----------|------|------------|
| 1 | VV-BTP-TW-20260424-001 | Công ty TNHH Kiểm thử Alpha | Lao động | Trực tiếp | Đã tiếp nhận |
| 2 | VV-BTP-TW-20260424-002 | Công ty Cổ phần Beta | Thuế | Điện thoại | Đã tiếp nhận |
| 3 | VV-BTP-TW-20260424-003 | Công ty TNHH Gamma Sản xuất | KDTM | Trực tiếp | Đã tiếp nhận |
| 4 | VV-BTP-TW-20260424-004 | Doanh nghiệp Tư nhân Delta | SHTT | Điện thoại | Đã tiếp nhận |
| 5 | VV-BTP-TW-20260424-005 | Công ty Cổ phần Epsilon IT | Đất đai | Trực tiếp | Đã tiếp nhận |
| 6 | VV-BTP-TW-20260424-006 | Công ty TNHH Zeta Giáo dục | KDTM | Trực tiếp | Đã tiếp nhận |
| 7 | VV-BTC-20260425-001 | — | Hình sự | Trực tiếp | Đã tiếp nhận |
| 8 | VV-BTP-TW-20260426-001 | — | Thuế | Trực tiếp | Đã tiếp nhận |

**Tổng:** 8/8 entry state đầu — đủ pool 6 happy + 2 reserve cho A3 edge case.

---

## Quan sát

- **Obs 1 — VV cấp BTC:** VV-BTC-20260425-001 thiếu Tên DN (cột "—") — cần verify có FK đến DN không. Có thể là VV nhập thủ công không gán DN.
- **Obs 2 — variant edge fixture v2.5:** chỉ có 8 record vs fixture đề nghị 15 — pagination test (variant 14) chưa đạt vì <21 record. Will defer to retest sau khi P2 advance state các VV cũ.

---

*2026-04-27 01:00 — QA chạy bằng Chrome DevTools MCP*
