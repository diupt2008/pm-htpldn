# Seed Checklist — Loại Doanh nghiệp (R7.1.2)

**Ngày:** 2026-05-06 14:09 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-01 — Quản lý Danh mục (tab "Loại doanh nghiệp") • **Đường dẫn:** `/quan-tri/danh-muc/LOAI_DOANH_NGHIEP`
**Dữ liệu mẫu:** [seed-fixture.yaml > dn_variants[].loai_doanh_nghiep_id (TNHH/CP/DNTN/HKD)](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-VII-01 §Inputs row 7 `loai_doanh_nghiep_id` FK → DANH_MUC](../../../../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.2.4 Seed 15 DN | `dn_variants[].loai_doanh_nghiep_id ∈ {TNHH,CP,DNTN,HKD}` (fixture v2.7.1 line 258/278/318) | 4 loại hình DN | `KICH_HOAT` | `GET /api/v1/danh-muc?loaiDanhMuc=LOAI_DOANH_NGHIEP&ma=TNHH` → ≥1 | 🚫 BE block |
| R7.7.4 DN functional 8 TC | `dn.loaiDoanhNghiepId` valid FK | 4 loại hình DN | `KICH_HOAT` | same | 🚫 BE block |

**Acceptance pass:** 4 record `TNHH/CP/DNTN/HKD` tồn tại với `trangThai=KICH_HOAT`.

---

## Kết quả: ⚠️ MỘT PHẦN 3/7

Pre-existing 3 record `DN_SIEU_NHO/DN_NHO/DN_VUA` (đây là **quy mô doanh nghiệp**, không phải **loại hình**). 4 record fixture cần seed (`TNHH/CP/DNTN/HKD`) bị BE chặn — cả `POST /api/v1/danh-muc` lẫn UI modal "Thêm mới".

> **Re-test 2026-05-06 16:14 (sau dev claim "đã fix với separation quy_mo / loại doanh nghiệp"):** ❌ FAIL — fix nửa chừng. Dev đã bỏ enum guard 422 nhưng BE giờ trả **500 Internal server error** cho mọi POST mới vào DM `LOAI_DOANH_NGHIEP` (kể cả pattern cũ `DN_LON`). Sanity `LINH_VUC_PL` POST `TEST_LV` → 201 OK ⇒ chỉ DM `LOAI_DOANH_NGHIEP` 500. Vẫn 3/3 record. Hiểu nghiệp vụ của dev (TNHH/CP/DNTN/HKD ≠ DN_SIEU_NHO/NHO/VUA) ĐÚNG, nhưng triển khai mâu thuẫn SRS FR-VIII-07 line 393, 397, 399 (DM `LOAI_DOANH_NGHIEP` SRS chỉ định = quy_mo). Cần BA xử lý spec contradiction trước khi đóng bug.

**Bug:** [`BUG-LOAI-DN-002`](../../bug-reports/qtht-danh-muc/bug-report-seed-r7-1-2-loai-dn.md) — 0/1 đóng (Open re-test FAIL — chuyển từ 422 sang 500 + spec contradiction; Major).

---

## Bảng dữ liệu seed

| # | Mã | Tên | Thuộc nhóm | Status |
|---|----|-----|------------|:-:|
| 1 | DN_SIEU_NHO | Doanh nghiệp siêu nhỏ | quy_mo (FR-VII-01 row 8) | ✅ pre-existing |
| 2 | DN_NHO | Doanh nghiệp nhỏ | quy_mo | ✅ pre-existing |
| 3 | DN_VUA | Doanh nghiệp vừa | quy_mo | ✅ pre-existing |
| 4 | TNHH | Công ty TNHH | loai_hinh (FR-VII-01 row 6) | 🚫 BE 422 (sáng) → 500 (chiều) |
| 5 | CP | Công ty Cổ phần | loai_hinh | 🚫 BE 422 → 500 |
| 6 | DNTN | Doanh nghiệp tư nhân | loai_hinh | 🚫 BE 422 → 500 |
| 7 | HKD | Hộ kinh doanh | loai_hinh | 🚫 BE 422 → 500 |

**Tổng:** 3 vào kho / 4 bị BE chặn (re-test sau dev fix lần 1: vẫn 4 chặn, BE crash 500 thay vì 422).

---

## Ảnh chụp

- [LOAI_DN table chỉ 3 records](r7-1-2-loai-dn-3-of-7-only.png)
- [Modal Thêm TNHH bị toast "Dữ liệu không hợp lệ"](../../bug-reports/image/bug-loai-dn-002-tnhh-rejected-toast.png)

---

*2026-05-06 14:09 — QA chạy bằng Chrome DevTools MCP*
