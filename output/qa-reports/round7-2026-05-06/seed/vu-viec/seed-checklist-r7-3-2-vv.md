# Seed Checklist — Vụ việc HTPL (R7.3.2)

**Ngày:** 2026-05-06 14:50 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `DA_TIEP_NHAN` (entry)
**Màn:** SCR-IV-01 — Quản lý vụ việc HTPL • **Đường dẫn:** `/vu-viec/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml v2.7.1 > vu_viec_variants[1..6]](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-IV — Vụ việc HTPL](../../../../input/srs-update-2026-5-5/srs-fr-iv-vu-viec.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.A3 Workflow VV 12 transition | `trang_thai=DA_TIEP_NHAN` | ≥8 | `DA_TIEP_NHAN` | total ≥ 8 | ✅ |
| R7.7.3 Functional 12 TC | `trang_thai=DA_TIEP_NHAN ∧ 6 LV cover` | ≥1/LV | `DA_TIEP_NHAN` | per-LV ≥1 | ✅ |
| R7.5.2 Cross-module DN tab #2 KPI | DN có VV gắn | ≥1 VV/DN cover 6 DN | `DA_TIEP_NHAN` | per-DN ≥1 | ✅ |

**Acceptance pass:** mọi row Status ✅ qua API verify.

---

## Kết quả: ✅ XONG 16/16 DA_TIEP_NHAN (10 pre-existing + 6 seed mới)

Pre-existing 10 VV (VV000005..050) chỉ cover 2 LV (Dân sự + KDTM) + 1 kênh (DVC). Seed thêm 6 VV (VV-BTP-TW-20260506-001..006) cover thêm 4 LV còn thiếu (LAO_DONG/THUE/SHTT/DAT_DAI/DOANH_NGHIEP) qua `POST /api/v1/vu-viecs/manual` với `loaiHinhHtId=TU_VAN`. Tổng 16 ≥ 8.

**Bug:** Không.

> **Note dashboard mismatch (không log bug):** Dashboard widget "Vụ việc tiếp nhận" hiển thị **70** trong khi API `/api/v1/vu-viecs?size=1` báo `meta.total=110`. Mismatch counter widget vs total — chuyển obs sang R7.5.1 verify dashboard KPI.

---

## Bảng dữ liệu seed

### Pre-existing 10 (sample)

| # | Mã VV | LV | Kênh | DN | State | Có vào kho? |
|---|-------|----|------|-----|-------|:----:|
| 1 | VV000005 | KDTM | DVC | HTX Thành Đạt #5 | DA_TIEP_NHAN | ✅ |
| 2 | VV000010 | Dân sự | DVC | TNHH MTV Sông Hồng #10 | DA_TIEP_NHAN | ✅ |
| 3 | VV000015 | KDTM | DVC | HKD Bình Minh #15 | DA_TIEP_NHAN | ✅ |
| 4 | VV000020 | Dân sự | DVC | DNTN Thành Đạt #20 | DA_TIEP_NHAN | ✅ |
| 5 | VV000025..050 | (5 record còn lại) | DVC | (mix) | DA_TIEP_NHAN | ✅ |

### Seed mới R7.3.2 — 6 VV cover 6 LV fixture

| # | Mã VV | LV | Kênh | DN | State | Có vào kho? |
|---|-------|----|------|-----|-------|:----:|
| 1 | VV-BTP-TW-20260506-001 | Lao động | Trực tiếp | DN000001 (Phúc An #1) | DA_TIEP_NHAN | ✅ |
| 2 | VV-BTP-TW-20260506-002 | Thuế | Điện thoại | DN000002 (Hoàng Gia #2) | DA_TIEP_NHAN | ✅ |
| 3 | VV-BTP-TW-20260506-003 | KDTM | Trực tiếp | DN000003 (Đại Việt #3) | DA_TIEP_NHAN | ✅ |
| 4 | VV-BTP-TW-20260506-004 | SHTT | Điện thoại | DN000004 (Phương Đông #4) | DA_TIEP_NHAN | ✅ |
| 5 | VV-BTP-TW-20260506-005 | Đất đai | Trực tiếp | DN000005 (HTX Thành Đạt #5) | DA_TIEP_NHAN | ✅ |
| 6 | VV-BTP-TW-20260506-006 | DN | Trực tiếp | DN000006 (Tân Phú #6) | DA_TIEP_NHAN | ✅ |

**Tổng:** 16 vào kho / 0 chặn (10 pre-existing + 6 seed mới)

### Per-filter verify (state DA_TIEP_NHAN)

| Filter | Total | OK |
|--------|------:|:--:|
| Total | 16 | ✅ |
| LV LAO_DONG | 1 | ✅ |
| LV THUE | 1 | ✅ |
| LV KINH_DOANH_TM | 6 | ✅ |
| LV DOANH_NGHIEP | 1 | ✅ |
| LV SO_HUU_TRI_TUE | 1 | ✅ |
| LV DAT_DAI | 1 | ✅ |

---

## Ảnh chụp

- [Danh sách 16 VV DA_TIEP_NHAN (6 mới + 10 cũ)](../screenshots/r7-3-2-vv-16of16-da-tiep-nhan.png)

---

*2026-05-06 14:50 — QA chạy bằng Chrome DevTools MCP via API POST /api/v1/vu-viecs/manual*
