# Seed Checklist — Hồ sơ pháp lý DN (T1.C4)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 01:05 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `HIỆU LỰC`
**Màn:** Tab Hồ sơ pháp lý trong SCR-V.III-02 (DN detail) • **Đường dẫn:** `/doanh-nghiep/{id}?tab=ho-so-pl`
**Dữ liệu mẫu:** [seed-fixture.yaml > ho_so_phap_ly_dn_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-X.1-04 (Hồ sơ pháp lý DN)

---

## Kết quả: ✅ XONG 6/6 entry HIỆU LỰC (1 reuse R4 + 5 NEW R5) trong DN-HNI-0001 + cover đầy đủ 5 enum loại

Acceptance: ≥6 record HSPL state HIEU_LUC + 5 enum loại đầy đủ — đạt 6 record + 5/5 enum (`GIAY_CN` / `QUYET_DINH` / `GIAY_PHEP` / `HOP_DONG` / `KHAC`).

**Bug:** 0 SRS-ref bug.

---

## Bảng dữ liệu seed

| # | Mã HSPL | Tên hồ sơ | Loại | Số/Ký hiệu | Trạng thái | Nguồn |
|---|---------|-----------|------|------------|------------|-------|
| 1 | HSPL-20260425-0001 | GCN ĐKKD Alpha | Giấy chứng nhận | 0100100101-HN-01 | Hiệu lực | reuse R4 |
| 2 | HSPL-20260427-0001 | Điều lệ công ty Alpha (sửa đổi 2025) | Quyết định | ĐL-2025-001 | Hiệu lực | NEW |
| 3 | HSPL-20260427-0002 | Giấy phép kinh doanh ngành đặc biệt | Giấy phép | GP-HN-2024-001 | Hiệu lực | NEW |
| 4 | HSPL-20260427-0003 | Hợp đồng thuê văn phòng Alpha | Hợp đồng | HD-VP-2024-001 | Hiệu lực | NEW |
| 5 | HSPL-20260427-0004 | Chứng nhận ISO 9001 Alpha | Khác | ISO-2025-001 | Hiệu lực | NEW |
| 6 | HSPL-20260427-0005 | Giấy phép ATTP Alpha | Giấy phép | ATTP-2024-001 | Hiệu lực | NEW |

**Tổng:** 6/6 vào kho • Cover 5/5 enum loại.

---

## Quan sát

- **Obs 1 — scope per-DN:** Acceptance không nói rõ per-DN hay system-wide → seed tất cả 6 trong DN-HNI-0001 (Alpha) cho đơn giản. Workflow downstream (P2 trụ A3 / Vụ việc) chỉ cần ≥1 HSPL trên 1 DN để verify FK linkage.
- **Obs 2 — Mã HSPL convention:** Format `HSPL-{YYYYMMDD}-{SEQ-4digit}` — verify khớp SRS naming convention.
- **Obs 3 — state HET_HAN/THU_HOI chưa cover:** Fixture v2.5 đề nghị seed thêm 2 state edge này (variant 7-8) — defer for P4 functional.

---

*2026-04-27 01:05 — QA chạy bằng Chrome DevTools MCP*
