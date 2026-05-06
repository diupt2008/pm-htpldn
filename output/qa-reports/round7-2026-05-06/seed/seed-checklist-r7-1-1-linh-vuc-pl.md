# Seed Checklist — Lĩnh vực Pháp lý (R7.1.1)

**Ngày:** 2026-05-06 14:08 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-01 — Quản lý Danh mục (tab "Lĩnh vực pháp lý") • **Đường dẫn:** `/quan-tri/danh-muc/LINH_VUC_PL`
**Dữ liệu mẫu:** [seed-fixture.yaml > linh_vuc_pl_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-VIII-01..13 §3.4.10 Quản lý Danh mục](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.2.1 MPH 12 mẫu (6 LV × 2) | `mau_phan_hoi.linh_vuc_id ∈ DM LINH_VUC_PL` (FR-II-NEW-02) | ≥6 LV | `KICH_HOAT` | `GET /api/v1/danh-muc?loaiDanhMuc=LINH_VUC_PL` → ≥6 record | ✅ |
| R7.2.5/6 TVV/CG seed | `tu_van_vien.linh_vuc_ids[] ⊆ DM LINH_VUC_PL` | ≥6 LV | `KICH_HOAT` | same | ✅ |
| R7.3.1/2/3 HD/VV/TVCS entry | `linh_vuc_id ∈ DM LINH_VUC_PL` (FR-I/II/V) | ≥6 LV | `KICH_HOAT` | same | ✅ |
| R7.4.A3/A4/A5 Workflow phân công | dropdown filter `linh_vuc_id` matching | ≥6 LV | `KICH_HOAT` | same | ✅ |

**Acceptance pass:** ≥6 LV với `trangThai=KICH_HOAT` cover 6 LV fixture (LAO_DONG/THUE/DOANH_NGHIEP/SO_HUU_TRI_TUE/DAT_DAI/HOP_DONG nhóm).

---

## Kết quả: ✅ XONG 12/6+

12 LV pre-existing post-reset 2026-05-05 — vượt ngưỡng 6 LV fixture. Cover đầy đủ 6 LV core + 6 LV mở rộng (Hôn nhân/Hành chính/Hình sự/Dân sự/Khiếu nại/Đầu tư).

**Bug:** Không có.

---

## Bảng dữ liệu seed

| # | Mã | Tên | Thứ tự | Trạng thái | Trùng fixture? |
|---|----|-----|:-:|:-:|:-:|
| 1 | DAN_SU | Dân sự | 1 | KICH_HOAT | (mở rộng) |
| 2 | HINH_SU | Hình sự | 2 | KICH_HOAT | (mở rộng) |
| 3 | HANH_CHINH | Hành chính | 3 | KICH_HOAT | (mở rộng) |
| 4 | LAO_DONG | Lao động | 4 | KICH_HOAT | ✅ fixture |
| 5 | DAT_DAI | Đất đai | 5 | KICH_HOAT | ✅ fixture |
| 6 | HON_NHAN_GIA_DINH | Hôn nhân gia đình | 6 | KICH_HOAT | (mở rộng) |
| 7 | KINH_DOANH_TM | Kinh doanh thương mại | 7 | KICH_HOAT | (≈ HOP_DONG nhóm) |
| 8 | KHIEU_NAI_TO_CAO | Khiếu nại tố cáo | 8 | KICH_HOAT | (mở rộng) |
| 9 | THUE | Thuế | 9 | KICH_HOAT | ✅ fixture |
| 10 | SO_HUU_TRI_TUE | Sở hữu trí tuệ | 10 | KICH_HOAT | ✅ fixture |
| 11 | DOANH_NGHIEP | Doanh nghiệp | 11 | KICH_HOAT | ✅ fixture |
| 12 | DAU_TU | Đầu tư | 12 | KICH_HOAT | (mở rộng) |

**Tổng:** 12 vào kho / 0 bị chặn (5/6 fixture LV match trực tiếp, 1/6 HOP_DONG ≈ KINH_DOANH_TM).

---

## Ảnh chụp

- [LV table 12 records](screenshots/r7-1-1-linh-vuc-pl-12records.png)

---

*2026-05-06 14:08 — QA chạy bằng Chrome DevTools MCP*
