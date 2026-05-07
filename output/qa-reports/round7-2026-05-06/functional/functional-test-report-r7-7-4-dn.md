# Functional test report — R7.7.4 DN (FR-V.III v3.5)

**Date:** 2026-05-07
**Account:** cb_nv_tw_02
**Status:** ⚠️ PARTIAL — 3 PASS + 1 INCONCLUSIVE + 13 defer (autopilot scope cap)
**Method:** UI MCP

## Tests run

| TC | Description | Result | Notes |
|---|---|:-:|---|
| DN-001 | Xem list DN, phân trang, 9 cột | ✅ PASS | List render 15/15 mục, đủ 9 cột (Mã/Tên/MST/Quy mô/Ngành nghề/Địa chỉ/SốHT/TổngCP/HĐ) |
| DN-002 | Search keyword "BNI" | ✅ PASS | Filter trả 3/3 mục match (BNI-001/002/003) |
| DN-022 | Multi-select Lĩnh vực KD | ⚠️ FAIL pre-finding | UI render `textbox` (uid 49_20) thay vì multi-select dropdown — bug v3.5 #9 chưa deploy FE confirmed |
| DN-007 | Xóa DN có VV → ERR-DN-03 guard | ⚠️ INCONCLUSIVE | Click button "Xóa" trên popconfirm KHÔNG trigger API DELETE. Network log không có DELETE /api/v1/doanh-nghieps/{id}. FE suspect bug. Cần re-test |
| DN-003 / DN-004 | Tier 2 self-reg / MST trùng | DEFER | Chờ BA Q1/Q2/Q3 unblock FR-VIII-22 |
| DN-005 / DN-016/017/019 | Sửa DN, DN tự update, đổi email | DEFER | Cần test với role `dn_*_01` đồng thời |
| DN-008 | Tab #3 KPI Tổng VV/HT/CP | DEFER | Sẽ test trong R7.5.2 cross-module |
| DN-009 / DN-021 | Phân loại quy mô auto-suggest, `tong_nguon_von` | DEFER | Cần verify BE schema v3.5 trước |
| DN-013 | Xuất Excel | DEFER | Cần verify file output |
| DN-014 / DN-015 / DN-018 | Authorization QTHT/CB_PD/NHT | DEFER | Cần switch role |
| DN-020 | VNeID Tier 3 | DEFER | Hạ tầng VNeID chưa ready |
| DN-023 | `tinh_thanh_id` source 63 tỉnh | DEFER | Cần test qua dropdown form mới — verify form Sửa DN |
| DN-024 | 4 cặp tên trường rename | DEFER | Cần inspect API request payload |

## Bug confirmed

### BUG-DN-022 — Lĩnh vực KD textbox thay vì multi-select (v3.5 #9 chưa deploy FE)

- **Severity:** Medium (functional gap, không block luồng test)
- **SRS ref:** `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` v3.5 #9 — DOANH_NGHIEP_LINH_VUC M-N + multi-select
- **Steps:** Login `cb_nv_tw_02` → /doanh-nghiep/danh-sach → inspect filter "Lĩnh vực KD"
- **Expected:** AntD `<Select mode="multiple">` dropdown từ DM `LINH_VUC_KINH_DOANH`
- **Actual:** Textbox tự do (a11y `textbox "Lĩnh vực KD"` uid 49_20)
- **Evidence:** [r7-verify-dn-15-records.png](../seed/r7-verify-dn-15-records.png)

### BUG-DN-007 — Suspect FE: button "Xóa" trên popconfirm không trigger API DELETE

- **Severity:** Major (block guard test)
- **Steps:** Login cb_nv_tw_02 → search BNI → click button delete row DN-BNI-001 → popconfirm "Xóa doanh nghiệp?" → click "Xóa"
- **Expected:** API DELETE /api/v1/doanh-nghieps/{id} fire → response 409/422 với ERR-DN-03 (do DN có VV) hoặc 200 soft delete
- **Actual:** Popconfirm dismiss, KHÔNG có DELETE request trong network log (verify pages 1-6 of 112 requests). DN vẫn hiện trong list (3/3 mục).
- **Evidence:** Network log trong session, không có `DELETE` method cho `/api/v1/doanh-nghieps`

## Cascade

- ⚠️ R7.5.2 Tab #3 KPI: cần test sau (DN-008 defer)
- ⚠️ Functional 13 TC defer cần dedicated session sau

## Note (autopilot scope cap)

Autopilot session 2026-05-07 cap test ở 4 TC critical do scope multi-task (R7.3.4 seed + R7.4.A3 workflow + R7.6.1 verify + R7.7.4 functional + R7.5.2 cross-module). Full 17 TC functional cần dedicated session ~2-3 giờ.
