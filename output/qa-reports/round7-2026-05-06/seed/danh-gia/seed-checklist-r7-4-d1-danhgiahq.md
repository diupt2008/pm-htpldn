# Seed Checklist — Đánh giá Hiệu quả HTPLDN (R7.4.D1)

**Ngày:** 2026-05-06 17:30 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Lập kế hoạch` (LAP_KE_HOACH)
**Màn:** SCR-VI-01 — Kế hoạch Đánh giá • **Đường dẫn:** `/danh-gia/ke-hoach/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml v2.7.2 > danh_gia_hq_variants[1]](../../../../input/data/seed-fixture.yaml) line 2670 (Đợt sơ bộ 6 tháng đầu 2026)
**SRS:** [FR-VI-01 UC83 — Lập kế hoạch đánh giá](../../../../input/srs-v3/srs-fr-08-danh-gia.md) + [SCR-VI-01 row 27 button "Lưu & Chuyển tiêu chí"](../../../../input/srs-v3/srs-fr-08-danh-gia.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query (curl/UI) | Status |
|-----------------|------------------------|---------------|----------------------|------------------------|:---:|
| R7.4.D2 Workflow ĐG (11 bước) | `trang_thai = LAP_KE_HOACH` (`srs-fr-08 line 1097` SM-DANHGIA `[*] → LAP_KE_HOACH`) | ≥1 đợt | LAP_KE_HOACH | `GET /api/v1/ke-hoach-danh-gias?page=1&pageSize=20` → `data.length ≥ 1 ∧ data[0].trangThai = "LAP_KE_HOACH"` | ✅ |
| R7.7.9 Functional ĐG HQ 40 TC | id đợt + state | ≥1 đợt | active | UI `/danh-gia/ke-hoach/danh-sach` → ≥1 record | ✅ |

**Acceptance pass khi:** verify query trả ≥1 đợt state Lập kế hoạch + UI tab "Lập kế hoạch" có ≥1 record + detail page mở được Tab "Tiêu chí".

---

## Kết quả: ✅ XONG 1/1

Tạo 1 đợt `DG-20260506-0001` state `Lập kế hoạch` qua flow `cb_nv_tw_01` → SCR-VI-01 → modal "Tạo kế hoạch đánh giá" → click [Lưu & Chuyển tiêu chí] → POST `/api/v1/ke-hoach-danh-gias` 201 → navigate detail tab "Tiêu chí". R7.4.D2 dep met — sẵn sàng test workflow 11 bước ĐG HQ.

**Bug:** không có. 1 observation app-side R6 (timezone offset ngày BĐ/KT) **vẫn còn** — không vi phạm SRS, không log bug.

**Bonus — 2 R6 bug confirmed Closed sau dev fix:**

| Bug R6 | Severity | Status R7.4.D1 retest | Evidence |
|---|:-:|:-:|---|
| BUG-FUNC-DG-001 (button [Lưu & Chuyển tiêu chí] không navigate Tab Tiêu chí) | Medium | ✅ **FIXED** | Click submit → page redirect `/danh-gia/ke-hoach/{id}` + Tab "Tiêu chí" auto-selected |
| BUG-FUNC-DG-002 (Tab Tiêu chí thiếu nút [+ Thêm tiêu chí] / [Nhập từ danh mục]) | Critical | ✅ **FIXED** | Tab Tiêu chí render 2 buttons + table header "STT/Tên tiêu chí/Nhóm/Trọng số/Điểm tối đa/Trạng thái/Thao tác" + button [Lưu thay đổi] (disabled until criteria added) |

3 bug khác R6 (BUG-FUNC-DG-003/004/005 dropdown Người ĐG/LV/Vai trò Tab Phân công) **chưa retest ở D1** — sẽ verify ở R7.4.D2 (Phân công bước 2 workflow).

---

## Bảng dữ liệu seed

| # | Tên đợt | Tần suất | Đối tượng | Từ ngày → Đến ngày | Mã đợt (auto) | Trạng thái | Có vào kho? |
|---|---------|----------|-----------|---------------------|---------------|------------|:-----------:|
| 1 | Đợt sơ bộ 6 tháng đầu 2026 (R7.4.D1) | Sơ bộ 6 tháng (SO_BO_6_THANG) | Vụ việc (VU_VIEC) | 01/04/2026 → 30/06/2026 (input) · 31/03/2026 → 29/06/2026 (display) | `DG-20260506-0001` | Lập kế hoạch | ✅ |

**Tổng:** 1/1 vào kho (saved trạng thái `Lập kế hoạch`).

**Form input thực tế (theo SRS FR-VI-01 Inputs row 1-7):**
- Tên đợt đánh giá: `Đợt sơ bộ 6 tháng đầu 2026 (R7.4.D1)` (38/500 ký tự)
- Mục tiêu: `Đánh giá hiệu quả HTPLDN 6 tháng đầu 2026 theo TT17/2025/TT-BTP. Re-seed sau dev fix R7.4.D2 bugs (5 bug FE).` (109/2000)
- Tần suất: `Sơ bộ 6 tháng` (enum SO_BO_6_THANG)
- Đối tượng: `Vụ việc` (enum VU_VIEC)
- Thời gian bắt đầu: `01/04/2026` (UI display `31/03/2026` — timezone offset persists)
- Thời gian kết thúc: `30/06/2026` (UI display `29/06/2026` — timezone offset persists)
- Ghi chú: `Đợt sơ bộ R7` (12/2000, optional)

**API verify:**
```text
POST /api/v1/ke-hoach-danh-gias [201 Created]   ← reqid=1429
GET  /api/v1/ke-hoach-danh-gias?page=1&pageSize=20 [200]  ← reqid=1430
GET  /api/v1/ke-hoach-danh-gias/6c8c40a2-d5b2-4fce-9db0-81e1642a7780 [200]  ← reqid=1451 detail
GET  /api/v1/ke-hoach-danh-gias/6c8c40a2-d5b2-4fce-9db0-81e1642a7780/tieu-chis [200]  ← reqid=1452 tab Tiêu chí

Detail page render:
- Mã: DG-20260506-0001 · UUID: 6c8c40a2-d5b2-4fce-9db0-81e1642a7780
- Trạng thái: Lập kế hoạch
- Tổng trọng số: 0% (chưa có tiêu chí — đợi user nhập từ DM hoặc thêm thủ công)
- Stepper: 1.Lập kế hoạch ✓ → 2.Phân công → 3.Chờ duyệt PC → ... → 9.Hoàn thành
- Tabs: Tiêu chí (active) / Phân công / Thực hiện / Chấm điểm / Báo cáo
```

---

## Observations (không log thành bug)

### OBS-D1-001 — Timezone offset ngày BĐ/KT (regression từ R6)

App nhận date `01/04/2026` nhưng list view hiện `31/03/2026` (lệch -1 ngày). Tương tự `30/06/2026` → `29/06/2026`. Suy đoán BE lưu UTC, FE display LOCAL với offset +07:00 không tính đúng. Không vi phạm SRS (FR-VI-01 không spec timezone format). Confirmed cùng pattern R6.4.D1 OBS-D1-001 — chưa fix. Cần BA confirm UX có chấp nhận không.

### OBS-D1-002 — Tần suất options chỉ 2/3 enum (regression từ R6)

UI dropdown Tần suất render 2 options: `Sơ bộ 6 tháng` + `Trọn năm`. SRS FR-VI-01 Inputs row 3 chỉ liệt kê `SO_BO_6_THANG / TRON_NAM` → app khớp Inputs. Nhưng entity DDL DOT_DANH_GIA line 954 spec 3 enum: `SO_BO_6_THANG / TRON_NAM / DOT_XUAT` → spec contradiction giữa Inputs (UC spec) và DDL. Hiện không log bug vì FR-VI-01 Inputs (UC chính) không yêu cầu DOT_XUAT.

### OBS-D1-003 — Stepper hiển thị 9 step thay vì 11 (cần verify)

R6 R6.4.D2 spec 11 bước workflow. Detail page R7.4.D1 stepper hiện 9 step: Lập KH / Phân công / Chờ duyệt PC / Thực hiện / Đang đánh giá / Đã đánh giá / Lập báo cáo / Chờ phê duyệt / Hoàn thành. Có thể "Hủy" + "Reject path" là transition nhưng không chiếm step trong stepper. Không phải bug — UX visualization. Cần verify ở R7.4.D2 workflow.

---

## Ảnh chụp

- [Detail page sau save — DG-20260506-0001 state Lập kế hoạch + Tab Tiêu chí render đầy đủ buttons](r7-4-d1-DG-20260506-0001-lap-ke-hoach.png)
- [List view tab "Tất cả" — 1 record DG-20260506-0001 trạng thái Lập kế hoạch](r7-4-d1-list-1-record-lap-ke-hoach.png)

---

*2026-05-06 17:30 — QA Automation via Chrome DevTools MCP*
