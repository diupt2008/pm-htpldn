# Seed checklist — R7.2.3 Phê duyệt TC TV → HOAT_DONG

> ⚠️ **Method gap (note 2026-05-08):** 1/5 record qua UI, 4/5 qua API thuần (`POST /trinh-phe-duyet` + `POST /phe-duyet`) — vi phạm rule UI-only ban hành 2026-05-07. Cần re-test 4 record còn lại bằng UI MCP R8. Xem [`tasks/lessons-learned.md` 2026-05-08](../../../../../tasks/lessons-learned.md).

**Ngày chạy:** 2026-05-06 (R7)
**Account workflow:** `cb_nv_tw_02` (trình duyệt) + `cb_pd_tw_02` (phê duyệt + công bố)
**SRS ref:** FR-IV-NEW-04 (CB PD cùng cấp công bố)
**Endpoints:**
- `POST /api/v1/to-chuc-tu-vans/{id}/trinh-phe-duyet` body `{"version":1}` (CB NV)
- `POST /api/v1/to-chuc-tu-vans/{id}/phe-duyet` body `{"quyetDinh":"PHE_DUYET","soQuyetDinh":"...","yKienPheDuyet":"...","version":2}` (CB PD)

## Kết quả

✅ **5/5 TC TV → HOAT_DONG** (`pool: { HOAT_DONG: 5 }` verified GET).

| Mã | Tên | Số QĐ công bố | State |
|---|---|---|:-:|
| TC-BTP-TW-0001 | Công ty Luật TNHH Alpha Hà Nội | QD-TW-0001/2026 | HOAT_DONG |
| TC-BTP-TW-0002 | Văn phòng Luật sư Beta Hải Phòng | QD-TW-0002/2026 | HOAT_DONG |
| TC-BTP-TW-0003 | Trung tâm TVPL Gamma Đà Nẵng | QD-TW-0003/2026 | HOAT_DONG |
| TC-BTP-TW-0004 | Đoàn Luật sư Hà Nội | QD-TW-0004/2026 | HOAT_DONG |
| TC-BTP-TW-0005 | Công ty Luật TW Epsilon | QD-TW-0005/2026 | HOAT_DONG |

## Workflow

1. CB NV (`cb_nv_tw_02`): TC-0005 trình duyệt qua UI (modal "Xác nhận trình phê duyệt") → 4 còn lại bulk API.
2. CB PD (`cb_pd_tw_02`, isolated context): TC-0005 phê duyệt qua UI (modal nhập "Số quyết định" + ý kiến) → 4 còn lại bulk API.

State: `MOI_DANG_KY` (v=1) → `CHO_PHE_DUYET` (v=2) → `HOAT_DONG` (v=3) + `ngayCongNhan` + `soQdCongBo` + `ngayQdCongBo`.

## Downstream

- ✅ Pool TC TV `HOAT_DONG` ≥ 1 → unblock T3 R7.2.6 (CG seed cần `toChucChinhId` UUID FK).
