# Seed Checklist — Đánh giá Hiệu quả HTPLDN (R6.4.D1)

**Ngày:** 2026-05-02 20:25 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Lập kế hoạch` (LAP_KE_HOACH)
**Màn:** SCR-VI-01 — Kế hoạch Đánh giá • **Đường dẫn:** `/danh-gia/ke-hoach/danh-sach`
**Dữ liệu mẫu:** ad-hoc 1 đợt (acceptance: ≥1 kỳ ĐG state `LAP_KE_HOACH` để unblock D2)
**SRS:** [FR-VI-01 UC83 — Lập kế hoạch đánh giá](../../../../input/srs-v3/srs-fr-08-danh-gia.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|---|---|---|---|---|:---:|
| R6.4.D2 Workflow ĐG (11 bước) | `trang_thai = LAP_KE_HOACH` (`srs-fr-08 line 1097` SM-DANHGIA `[*] → LAP_KE_HOACH`) | ≥1 đợt | LAP_KE_HOACH | `GET /api/v1/ke-hoach-danh-gias?page=1&pageSize=20` → `data.length ≥ 1 ∧ data[0].trangThai = "LAP_KE_HOACH"` | ✅ |

**Acceptance pass khi:** verify query trả ≥1 đợt state Lập kế hoạch + UI tab "Lập kế hoạch" có ≥1 record.

---

## Kết quả: ✅ XONG 1/1

Tạo 1 đợt `DG-20260502-0001` state `Lập kế hoạch`. R6.4.D2 dep met — sẵn sàng test workflow 11 bước ĐG HQ.

**Bug:** không có. 1 observation app-side (timezone offset ngày BĐ/KT), không vi phạm SRS.

---

## Bảng dữ liệu seed

| # | Tên đợt | Tần suất | Đối tượng | Từ ngày → Đến ngày | Mã đợt | Có vào kho? |
|---|---------|----------|-----------|---------------------|--------|:-----------:|
| 1 | Đợt ĐG HQ Q2/2026 | Sơ bộ 6 tháng (SO_BO_6_THANG) | Tổng hợp (TONG_HOP) | 31/03/2026 → 29/06/2026 | DG-20260502-0001 | ✅ |

**Tổng:** 1/1 vào kho (saved trạng thái `Lập kế hoạch`).

**Form input thực tế (theo SRS FR-VI-01 Inputs row 1-6):**
- Tên đợt đánh giá: `Đợt ĐG HQ Q2/2026` (12/500 ký tự)
- Mục tiêu: `Đánh giá hiệu quả HTPLDN Q2/2026 — đo SLA + chất lượng tư vấn 6 lĩnh vực.` (73/2000)
- Tần suất: `Sơ bộ 6 tháng`
- Đối tượng: `Tổng hợp`
- Thời gian bắt đầu: `01/04/2026` (UI display `31/03/2026` — timezone offset)
- Thời gian kết thúc: `30/06/2026` (UI display `29/06/2026` — timezone offset)
- Ghi chú: bỏ trống (optional, hợp lệ theo SRS row 7)

**API verify:**
```text
POST /api/v1/ke-hoach-danh-gias [201 Created]
GET  /api/v1/ke-hoach-danh-gias?page=1&pageSize=20 [200]
→ data: [{ maKeHoach: "DG-20260502-0001", tenDot: "Đợt ĐG HQ Q2/2026", tanSuat: "SO_BO_6_THANG", doiTuong: "TONG_HOP", trangThai: "LAP_KE_HOACH" }]
Toast: "Tạo kế hoạch đánh giá thành công"
```

---

## Observations (không log thành bug)

### OBS-D1-001 — Timezone offset ngày BĐ/KT

App nhận date `01/04/2026` nhưng list view hiện `31/03/2026` (lệch 1 ngày). Tương tự `30/06/2026` → `29/06/2026`. Suy đoán BE lưu UTC, FE display LOCAL. Không vi phạm SRS (FR-VI-01 không spec timezone format). Cần BA confirm UX có chấp nhận không — nếu user nhập 01/04 mà save thành 31/03 sẽ confuse.

### OBS-D1-002 — Tần suất options chỉ 2/3 enum SRS

UI dropdown Tần suất render 2 options: `Sơ bộ 6 tháng` + `Trọn năm`. SRS line 96 (Inputs FR-VI-01) chỉ liệt kê `SO_BO_6_THANG / TRON_NAM` → app khớp. SRS line 954 (entity DOT_DANH_GIA schema) liệt kê 3 enum: `SO_BO_6_THANG / TRON_NAM / DOT_XUAT` → app thiếu `DOT_XUAT`. Spec contradiction — cần BA confirm `DOT_XUAT` có phải enum hợp lệ không. Hiện tại không log bug vì FR-VI-01 Inputs (UC spec) không yêu cầu DOT_XUAT.

---

## Ảnh chụp

- [Modal Tạo kế hoạch đánh giá — form đã fill đầy đủ](../screenshots/r14-d1-modal-form-filled.png)
- [List view sau save — DG-20260502-0001 state Lập kế hoạch](../screenshots/r14-d1-list-DG-20260502-0001-lap-ke-hoach.png)

---

*2026-05-02 20:25 — QA Automation via Chrome DevTools MCP*
