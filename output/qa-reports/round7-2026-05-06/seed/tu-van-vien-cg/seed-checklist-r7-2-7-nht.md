# Seed checklist — R7.2.7 Seed 3 NHT (FR-IV-NHT-01)

**Ngày chạy:** 2026-05-06 (R7)
**Account:** `qtht_02` (CB NV TW không có quyền tạo NHT cho ĐP — fixture instruction line 1150)
**Endpoint:** `POST /api/v1/nguoi-ho-tro` (singular, đã verify deploy R7.0.6)
**Fixture:** [seed-fixture.yaml v2.7.3 §nht_variants](../../../../input/data/seed-fixture.yaml) line 1143-1146
**SRS ref:** FR-IV-NHT-01 (entity NGUOI_HO_TRO mới R7) + FR-VIII-15 (auto-tạo TK)

## Kết quả

✅ **3/3 PASS** — pool NHT: `total=3`, `byState={CHO_KICH_HOAT:3}`, mỗi record có `taiKhoanId` ≠ null.

## Pool sau seed

| Mã NHT | Họ tên | Username | Đơn vị | Lĩnh vực | TK auto-tạo (state) |
|---|---|---|---|---|---|
| NHT-STP-AG-0001 | Phùng Thị NHT An Giang | nht_01 | STP-AG | DOANH_NGHIEP, LAO_DONG | a7641452... (CHO_KICH_HOAT) |
| NHT-STP-DN-0001 | Lương Văn NHT Đà Nẵng | nht_02 | STP-DN | THUONG_MAI→KINH_DOANH_TM, THUE | 0e4c38fd... (CHO_KICH_HOAT) |
| NHT-STP-HP-0001 | Đào Thị NHT Hải Phòng | nht_03 | STP-HP | SHTT→SO_HUU_TRI_TUE, DAT_DAI | 28bba7ce... (CHO_KICH_HOAT) |

## Permission finding

- `cb_nv_tw_02` (CB_NV_TW) → **403 ERR-NHT-02** "Bạn không có quyền tạo NHT cho đơn vị này" khi POST cho STP-AG/DN/HP.
- `qtht_02` (QTHT) → 201 cả 3 → tạo OK cross-cấp DP. Khớp fixture line 1150 ("QTHT hoặc CB NV cùng cấp").

## State machine note

NHT entity **không có workflow advance riêng** như TVV/CG. Seed → state target `CHO_KICH_HOAT` ngay + auto-tạo TAI_KHOAN role NHT cùng state `CHO_KICH_HOAT` qua FR-VIII-15. Đợi NHT click link mail kích hoạt → `HOAT_DONG` (FR-VIII-26).

## Per-filter verify

- `?size=100` → 3 records ✅
- `?trangThai=CHO_KICH_HOAT` → 3 records ✅
- 3 đơn vị distinct (STP-AG / STP-DN / STP-HP) ✅
- 6 lĩnh vực coverage (DN/LĐ/TM/Thuế/SHTT/Đất đai) ✅

## Downstream

- ⏳ T6 (R7.2.9): Click 3 link mail kích hoạt MailHog (cộng 6 từ CG sau T5) → đặt MK lần đầu → TK `HOAT_DONG`.
