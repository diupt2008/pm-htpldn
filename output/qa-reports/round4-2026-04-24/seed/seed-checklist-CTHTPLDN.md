# Seed Checklist — Chương trình HTPLDN (T2.C1)

**Ngày:** 2026-04-25 18:11–18:23 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Dự thảo`
**Màn:** SCR-XI-01 — Quản lý Chương trình HTPL • **Đường dẫn:** `/ct-htpldn/tao-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > ct_htpldn_variants.ke_hoach_variants[1]](../../../../input/data/seed-fixture.yaml#L1446)
**SRS:** [FR-XI-01 UC164 — Quản lý chương trình HTPL](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md#fr-xi-01-quản-lý-chương-trình-htpl-uc164) — mục **Inputs (9 trường)** và **Acceptance Criteria #2** ("CB NV thêm mới → nhập đủ trường → lưu thành công")

---

## Kết quả: 🚫 **KHÔNG LÀM ĐƯỢC 0/1**

Form điền đủ 7 trường, bấm nút **Tạo chương trình** 4 lần đều không tạo được bản ghi nào. Hệ thống không gọi API lưu, danh sách vẫn trống.

**Bug:** [`BUG-CTHTPLDN-001-R4`](../bug-reports/bug-report-seed-cthtpldn-t2c1.md) — Nút Tạo chương trình bị lỗi, không lưu được dữ liệu.

---

## Bảng dữ liệu seed

| # | Tên chương trình | Thời gian | Ngân sách | Mã CT | Có vào kho? |
|---|------------------|-----------|-----------|-------|:-----------:|
| 1 | CT HTPLDN năm 2026 | 01/01/2026 → 31/12/2026 | 5.000.000.000 | — | 🚫 |

**Tổng:** 0 vào kho / 1 bị chặn

---

## Ảnh chụp

- [Danh sách rỗng đầu phiên](../screenshots/cthtpldn-t2c1-empty-init.png)
- [Form đã điền đủ 7 trường trước khi bấm Tạo](../screenshots/cthtpldn-t2c1-form-filled.png)
- [Form sau khi bấm Tạo — không nhảy trang](../screenshots/cthtpldn-t2c1-blocked-post-submit.png)
- [Danh sách vẫn rỗng sau khi bấm Tạo](../screenshots/cthtpldn-t2c1-list-empty-after-save.png)

---

*2026-04-25 18:23 — QA chạy bằng Chrome DevTools MCP*
