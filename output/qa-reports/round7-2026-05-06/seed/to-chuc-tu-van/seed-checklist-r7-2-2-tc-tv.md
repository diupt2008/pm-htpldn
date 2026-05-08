# Seed checklist — R7.2.2 Seed 6 Tổ chức tư vấn (MOI_DANG_KY)

> ⚠️ **Method gap (note 2026-05-08):** Task chạy qua API thuần `POST /api/v1/to-chuc-tu-vans` — vi phạm rule UI-only ban hành 2026-05-07.
>
> 🚫 **UI re-test 2026-05-08 — BLOCKED bởi 2 bug FE.** Đã thực hiện đầy đủ flow UI MCP (login `cb_nv_tw_02` → nav `/chuyen-gia-tvv/to-chuc/tao-moi` → mở form Thêm mới). Phát hiện form thiếu field bắt buộc `Đơn vị quản lý` (`donViQuanLyId` UUID) → submit BE 500 `ERR-SYS-00-00-01` → FE auto-logout về `/login`. Không thể seed thêm record qua UI cho đến khi FE bổ sung field + sửa error handler. Pool 5 HOAT_DONG (TC-BTP-TW-0001..0005) từ API path R7.2.2/R7.2.3 vẫn ổn định — đủ cho R7.4.A6 + R7.7.4.6 downstream. Bug log: [bug-report-r7-2-2-tctv-ui-seed.md](../../bug-reports/to-chuc-tu-van/bug-report-r7-2-2-tctv-ui-seed.md).

**Ngày chạy:** 2026-05-06 (R7)
**Account:** `cb_nv_tw_02` (CB_NV_TW)
**Endpoint:** `POST /api/v1/to-chuc-tu-vans`
**Fixture:** [seed-fixture.yaml v2.7.3 §to_chuc_tu_van_variants](../../../../input/data/seed-fixture.yaml) line 596-602
**SRS ref:** FR-IV-NEW-01 / CR-02 (`srs-update-2026-5-5/srs-fr-04-...`); NĐ 77/2008 Đ.13 (Giấy ĐKHĐ bắt buộc)

## Kết quả

✅ **5/5 PASS valid + 1/1 BVA negative đúng kỳ vọng** (Σ=6/6 fixture variants).

## Pool sau seed

| Mã | Tên | Loại hình | LV count | State |
|---|---|---|:-:|:-:|
| TC-BTP-TW-0001 | Công ty Luật TNHH Alpha Hà Nội | CONG_TY_LUAT | 3 | MOI_DANG_KY |
| TC-BTP-TW-0002 | Văn phòng Luật sư Beta Hải Phòng | VP_LUAT_SU | 2 | MOI_DANG_KY |
| TC-BTP-TW-0003 | Trung tâm TVPL Gamma Đà Nẵng | TT_TVPL | 3 | MOI_DANG_KY |
| TC-BTP-TW-0004 | Đoàn Luật sư Hà Nội | VP_LUAT_SU | 4 | MOI_DANG_KY |
| TC-BTP-TW-0005 | Công ty Luật TW Epsilon | CONG_TY_LUAT | 3 | MOI_DANG_KY |

**Verify:** `GET /api/v1/to-chuc-tu-vans?size=100` → `total: 5`, `byState: {MOI_DANG_KY: 5}`. Detail TC-0001 có `linhVucs[]` 3 record FK đúng.

## BVA negative (variant 5)

- **Idx 5 — Tổ chức TVPL Khác Delta** (KHAC, thiếu Giấy ĐKHĐ)
- **Status:** 422 `ERR-VAL-SYS-00-01` — `soGiayDkhd must be longer than or equal to 1 characters`
- **Kỳ vọng (fixture):** ERR-TCTV-* per NĐ 77/2008 Đ.13 → ✅ BE block save đúng spec.

## DM LV mapping

Fixture code → DB code (qua `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL`):
- `THUONG_MAI` → `KINH_DOANH_TM` (DB chưa có THUONG_MAI thuần)
- `SHTT` → `SO_HUU_TRI_TUE`
- `LAO_DONG/THUE/DAT_DAI/DOANH_NGHIEP/DAN_SU/HINH_SU/HANH_CHINH/DAU_TU` — match trực tiếp.

## Đơn vị quản lý

| Variant | Fixture don_vi_quan_ly | Payload donViQuanLyId UUID |
|---|---|---|
| 1, 4 | DP-HN | `00000000-0000-4000-8002-000000000001` |
| 2 | DP-HP | `00000000-0000-4000-8002-000000000004` |
| 3 | DP-DN | `00000000-0000-4000-8002-000000000003` |
| 5, 6 | TW-CUC | `00000000-0000-4000-8000-000000000001` |

**Note:** Mã sequence BE auto-prefix `TC-BTP-TW-XXXX` theo cấp đơn vị tạo (account `cb_nv_tw_02` capDonVi=TW), kể cả TC TV cấp DP. Đây là behavior BE, không phải bug seed.

## Downstream

- ⏳ T2 (R7.2.3): Phê duyệt 5 TC TV → `HOAT_DONG` (account `cb_pd_tw_02`).
- ⏳ T3 (R7.2.6): Seed 6 CG TW dùng `toChucChinhId` từ pool 5 TC TV này.
