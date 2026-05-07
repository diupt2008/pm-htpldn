# Seed checklist — R7.2.6 Seed 6 CG TW (loai_tvv=CG, MOI_DANG_KY)

**Ngày chạy:** 2026-05-06 (R7)
**Account:** `cb_nv_tw_02` (CB_NV_TW)
**Endpoint:** `POST /api/v1/tu-van-viens`
**Fixture:** [seed-fixture.yaml v2.7.3 §tvv_variants[13-18]](../../../../input/data/seed-fixture.yaml) line 880-940
**SRS ref:** FR-IV-07 (TVV/CG profile, enum loaiTvv ∈ {TVV, CG} sau v2.6.0 R5 split)

## Kết quả

✅ **6/6 PASS** — pool `loaiTvv=CG`: `total=6`, `byState={MOI_DANG_KY:6}`.

## Pool sau seed

| Mã | Họ tên | LV | Trình độ | toChucChinhId (FK) |
|---|---|---|---|---|
| TVV-BTP-TW-0001 | Lý Thị Mười Ba | DOANH_NGHIEP | Tiến sĩ | TC-BTP-TW-0001 (Alpha) |
| TVV-BTP-TW-0002 | Đinh Văn Mười Bốn | THUONG_MAI→KINH_DOANH_TM | Tiến sĩ | TC-BTP-TW-0002 (Beta) |
| TVV-BTP-TW-0003 | Ngô Thị Mười Lăm | LAO_DONG | Tiến sĩ | TC-BTP-TW-0003 (Gamma) |
| TVV-BTP-TW-0004 | Trương Văn Mười Sáu | THUE | Phó Giáo sư | TC-BTP-TW-0004 (Đoàn LS HN) |
| TVV-BTP-TW-0005 | Mai Thị Mười Bảy | SHTT→SO_HUU_TRI_TUE | Tiến sĩ | TC-BTP-TW-0005 (Epsilon) |
| TVV-BTP-TW-0006 | Hồ Văn Mười Tám | DAT_DAI | Tiến sĩ | TC-BTP-TW-0001 (Alpha, round 2) |

## Per-filter verify

- `?loaiTvv=CG` → 6 records ✅
- `?loaiTvv=TVV` → 0 records (đúng, chưa seed TVV)
- 6 lĩnh vực distinct cover (DOANH_NGHIEP / THUONG_MAI / LAO_DONG / THUE / SHTT / DAT_DAI) ✅
- 5 TC TV pool đều có ≥1 CG link (TC-0001 có 2) ✅

## BE schema notes (probe finding)

BE TVV CREATE field names khác fixture YAML — đã map:
- `cccd` (≠ fixture `cmnd_cccd`)
- `dienThoai` (≠ fixture `so_dien_thoai`)
- `toChucChinhId` UUID **required, không nullable** (không như fixture string name)
- `linhVucIds` UUID array (không enum string)
- `donViQuanLyId` UUID required

`dia_ban_ids` đã strip per fixture v2.7.1 instruction (NĐ 77/2008 Đ.19 — TVV scope toàn quốc).

## Downstream

- ⏳ T5 (R7.4.A1-CG): Walk workflow 6 CG → DANG_HOAT_DONG (auto-tạo TK CHO_KICH_HOAT qua FR-VIII-15).
