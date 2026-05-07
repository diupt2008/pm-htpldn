# Seed checklist — R7.3.4 HSPL DN

**Task:** Seed 10 HSPL DN cover 5 loại × 3 state × 5 DN
**Account:** cb_nv_tw_02 / Secret@123
**Date:** 2026-05-07
**Method:** UI MCP click chain (per CLAUDE.md feedback_test_method_ui_only)
**Endpoint discovered:** `POST /api/v1/ho-so-phap-ly-dns` (sub-resource Tab #2 trong DN detail)
**Status:** ✅ PASS 10/10

## Pre-condition discovery (overrides todo.md state)

R7.3.4 trong todo.md đánh 🚫 BLOCK do "DN list rỗng". Verify thực tế env 2026-05-07 cho thấy **15 DN tồn tại** trong list (1-15 / 15 mục), KHÔNG rỗng. Cover 3 quy mô × 3 ngành đầy đủ.

→ R7.2.4 ✅ valid, R7.3.4 unblock được, KHÔNG cần re-self-reg DN.

## 5 loại HSPL (verified UI dropdown)

`Giấy phép` · `Hợp đồng` · `Giấy chứng nhận` · `Quyết định` · `Khác`

## 3 state (verified UI dropdown)

`Hiệu lực` · `Hết hạn` · `Thu hồi`

## 10 records seeded

| # | Mã hồ sơ | DN | Loại | State | Số/Ký hiệu |
|---|---|---|---|---|---|
| 1 | HSPL-20260507-0001 | DN-AG-001 (Siêu nhỏ / NLN) | Giấy phép | Hiệu lực | GP-AG-2024-001 |
| 2 | HSPL-20260507-0002 | DN-AG-001 | Hợp đồng | Hết hạn | HD-AG-2023-002 |
| 3 | HSPL-20260507-0003 | DN-BKH-001 (Nhỏ / CN-XD) | Giấy chứng nhận | Hiệu lực | GCN-BKH-2024-001 |
| 4 | HSPL-20260507-0004 | DN-BKH-001 | Quyết định | Thu hồi | QD-BKH-2023-002 |
| 5 | HSPL-20260507-0005 | DN-BTC-001 (Vừa / TM-DV) | Khác | Hiệu lực | VB-BTC-2024-001 |
| 6 | HSPL-20260507-0006 | DN-BTC-001 | Giấy phép | Hết hạn | GP-BTC-2023-001 |
| 7 | HSPL-20260507-0007 | DN-BG-002 (Vừa / NLN) | Hợp đồng | Hiệu lực | HD-BG-2024-001 |
| 8 | HSPL-20260507-0008 | DN-BG-002 | Giấy chứng nhận | Thu hồi | GCN-BG-2022-002 |
| 9 | HSPL-20260507-0009 | DN-BNI-002 (Vừa / TM-DV) | Quyết định | Hiệu lực | QD-BNI-2024-001 |
| 10 | HSPL-20260507-0010 | DN-BNI-002 | Khác | Hết hạn | VB-BNI-2022-002 |

## Acceptance verify per-filter

| Filter | Cần | Có | Status |
|---|---|---|---|
| `loaiHoSo=GIAY_PHEP` | ≥1 | 2 (R1+R6) | ✅ |
| `loaiHoSo=HOP_DONG` | ≥1 | 2 (R2+R7) | ✅ |
| `loaiHoSo=GIAY_CHUNG_NHAN` | ≥1 | 2 (R3+R8) | ✅ |
| `loaiHoSo=QUYET_DINH` | ≥1 | 2 (R4+R9) | ✅ |
| `loaiHoSo=KHAC` | ≥1 | 2 (R5+R10) | ✅ |
| `trangThai=HIEU_LUC` | ≥1 | 5 | ✅ |
| `trangThai=HET_HAN` | ≥1 | 3 | ✅ |
| `trangThai=THU_HOI` | ≥1 | 2 | ✅ |
| Distinct DN | ≥5 | 5 | ✅ |

## Note

- Form Drawer có 2 field optional `Ngày cấp` + `Ngày hết hạn` skip → cột list hiển thị "-". Không phải bug, R7.3.4 acceptance không yêu cầu ngày.
- Toast "Thêm hồ sơ thành công" hiển thị mỗi record → BE confirm 200.
- Mã hồ sơ auto-generate `HSPL-YYYYMMDD-NNNN` global counter (qua 5 DN distinct, counter 0001..0010 không reset per-DN).

## Evidence

[r7-3-4-hspl-bni-002-final.png](r7-3-4-hspl-bni-002-final.png) — record 10 saved, list DN-BNI-002 có 2 record.

## Cascade impact

- ✅ R7.5.2 Tab #2 HSPL trong DN detail → ready (5 DN có HSPL).
- ⚠️ R7.5.2 Tab #3 KPI vẫn cần R7.4.A3 (VV) + R7.6.1 (Chi trả).
