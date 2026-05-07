# Workflow test report — R7.4.A3 Vụ việc HTPL (FR-05 v3.5)

**Date:** 2026-05-07
**Account:** cb_nv_tw_02 (CB NV TW)
**VV:** VV-BTP-TW-20260507-002 — Công ty TNHH Bình Minh AG (Thuế)
**Status:** ⚠️ PARTIAL — 2 transition PASS + 2 gap UI vs spec FR-05 v3.5
**Method:** UI MCP click chain

## State machine 10-state pipeline (verified UI)

```
Mới tạo → Chờ tiếp nhận → Đã tiếp nhận → Đang kiểm tra → Đã phân công
       → Đang xử lý → Chờ phê duyệt → Đã duyệt → Hoàn thành → Đã đánh giá
```

10 state hiển thị trên pipeline header — match spec FR-05 v3.5.

## Transitions tested

| # | From | To | Action button | Form/Modal | Result |
|---|---|---|---|---|---|
| 1 | Đã tiếp nhận | Đang kiểm tra | "Kiểm tra hồ sơ" | Modal checklist 6 điều kiện hồ sơ NĐ55 | ✅ PASS |
| 2 | Đang kiểm tra | Đã phân công | "Phân công" | Modal: 1 dropdown TVV + Ghi chú | ✅ PASS |

**Bonus actions ở Đang kiểm tra:** "Yêu cầu bổ sung" + "Không đạt" (chưa test trong autopilot).

## Gap UI vs spec FR-05 v3.5

### Gap 1: Modal phân công thiếu "2 thẻ Cá nhân / Tổ chức" — Severity: Medium → cần verify SRS

Spec todo R7.4.A3 ghi: *"thay 3 cột phân công + 2 thẻ Cá nhân/Tổ chức"*

UI thực tế chỉ có 1 dropdown "Chọn tư vấn viên" + 1 textarea "Ghi chú". KHÔNG có toggle/tab/radio để chọn loại đối tượng phân công (Cá nhân TVV/CG vs Tổ chức TC TV).

**Cần verify SRS:** grep `srs-update-2026-5-5/` cho FR-05 v3.5 — có thể "2 thẻ" là Tab UI hoặc filter dropdown chứ không phải toggle modal.

### Gap 2: Section "Phân công" có 4 cột thay vì 3 — Severity: Minor

UI table: `Tư vấn viên / Trạng thái / Ngày phân công / Lý do từ chối`. Cột "Lý do từ chối" chỉ relevant khi TVV từ chối — có thể spec là 3 cột "core" + 1 cột conditional. Không phải gap nghiêm trọng.

## Tab list VV (verified)

6 Tab state: Tất cả · Chờ tiếp nhận · Đang xử lý · Chờ phê duyệt · Hoàn thành · Từ chối → match spec.

## Pre-existing data (env state)

| State | Count | Note |
|---|---|---|
| Đã tiếp nhận | 5 | VV-001..006, lĩnh vực Lao động/Thuế/KDTM/SHTT/ĐĐ/HC |
| Đã phân công | 1 → 2 | VV-001 + VV-002 (sau test này) |
| Chờ phê duyệt | 0 | — |
| Hoàn thành | 0 | — |
| Từ chối | 0 | — |

## Defer (cần multi-role + sandbox)

- **R7.4.A3 full E2E** (Đã phân công → Đang xử lý → Chờ phê duyệt → Đã duyệt → Hoàn thành) cần switch:
  - TVV-BTP-TW-0004 accept VV → Đang xử lý
  - TVV submit kết quả → Chờ phê duyệt
  - cb_pd_tw_02 duyệt → Đã duyệt
  - cb_nv_tw_02 hoàn thành → Hoàn thành
- **R7.4.A3-PUBLIC** (FR-V.I-NEW-05): cần state DA_DUYET hoặc HOAN_THANH + role cb_pd_tw_02
- **R7.4.A3-DN-BS** (FR-V.I-NEW-02): cần DN VNeID Tier 2 sandbox + DN tài khoản

## Evidence

- [r7-4-a3-vv-002-da-phan-cong.png](r7-4-a3-vv-002-da-phan-cong.png) — VV-002 state Đã phân công + section Phân công expanded với TVV-0004

## Cascade impact

- ✅ R7.7.3 functional 72 TC: ≥1 VV ở DA_PHAN_CONG ready để test "Phân công TVV" cluster.
- ⚠️ R7.7.3-PRIVACY 2 TC P0: KHÔNG ready (cần VV `cong_khai=1`, đến từ R7.4.A3-PUBLIC defer).
- ⚠️ R7.5.2 Tab #3 KPI cross-module: 1 VV "Đã phân công" có thể tăng counter nhưng vẫn cần ≥1 VV HOAN_THANH.
