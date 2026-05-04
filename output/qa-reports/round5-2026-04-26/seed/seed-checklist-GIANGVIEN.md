## Seed Checklist — Giảng viên (B6)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 17:00-17:10 • **Tài khoản:** `cb_nv_tw_01` • **Tool:** Chrome DevTools MCP
**Màn:** SCR-III-05 — Giảng viên / Trợ giảng • **Đường dẫn:** `/dao-tao/giang-vien/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > giang_vien_variants[1..8]](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-11 UC30 — Quản lý giảng viên, trợ giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md)
**R4 reference:** [round4 seed-checklist-GIANGVIEN.md](../../round4-2026-04-24/seed/seed-checklist-GIANGVIEN.md)

---

## Kết quả: ✅ PASS 8/8

6 reuse R4 (`GV-BTP-TW-0001..0006`, `Đang hoạt động`) còn nguyên + tạo NEW 2 variant: [7] `Tạm dừng` (create `Đang hoạt động` → toggle), [8] multi-LV (3 LV — fallback từ 4 LV fixture do dropdown thiếu HOP_DONG/DOANH_NGHIEP). 0 bug mới SRS-ref. 3 obs (regression R4 chưa fix + DM gap regression cross-round 7th).

---

## Bảng dữ liệu seed

| # | Họ tên | Chuyên ngành | Trình độ | Lĩnh vực | Trạng thái | Nguồn | Có vào kho? |
|---|--------|--------------|----------|----------|------------|-------|:-----------:|
| 1 | GS.TS Trần Giảng Viên | Luật dân sự | Tiến sĩ | Kinh doanh thương mại ¹ | Đang hoạt động | reuse R4 | ✅ |
| 2 | PGS.TS Lê Sư Phạm | Luật kinh tế | Tiến sĩ | Thuế ¹ | Đang hoạt động | reuse R4 | ✅ |
| 3 | ThS. Phạm Trẻ Trung | Luật lao động | Thạc sĩ | Lao động | Đang hoạt động | reuse R4 | ✅ |
| 4 | TS. Hoàng SHTT | Sở hữu trí tuệ | Tiến sĩ | Sở hữu trí tuệ | Đang hoạt động | reuse R4 | ✅ |
| 5 | ThS. Vũ Thuế | Luật thuế | Thạc sĩ | Thuế | Đang hoạt động | reuse R4 | ✅ |
| 6 | GS. Đỗ Hoàng | Luật hành chính | Tiến sĩ | Đất đai ¹ | Đang hoạt động | reuse R4 | ✅ |
| 7 | ThS. Bùi Tạm Dừng | Luật hợp đồng | Thạc sĩ | Kinh doanh thương mại ¹ | **Tạm dừng** ² | NEW R5 | ✅ |
| 8 | GS.TS Phan Đa Lĩnh Vực | Luật kinh doanh quốc tế | Tiến sĩ | Kinh doanh thương mại + Thuế + Sở hữu trí tuệ ¹ | Đang hoạt động | NEW R5 | ✅ |

¹ Fallback: fixture yêu cầu `DOANH_NGHIEP`/`HOP_DONG` nhưng dropdown lĩnh vực chỉ render 10 option DM TT17 chuẩn, thiếu 2 enum mở rộng (regression cross-round 7th time — pattern lặp R4 CTĐT/Bài giảng/NHCH/Giảng viên + R5 CTĐT/Khóa học).
² Variant [7] thực hiện 2 step: create với trạng thái default `Đang hoạt động` → mở edit → đổi combobox `Trạng thái` = `Tạm dừng` → Lưu (PATCH 200).

**Tổng:** 8 vào kho / 0 bị chặn.

---

## Verify state qua network

| reqid | Method | URL | Status | Note |
|-------|--------|-----|--------|------|
| 178 | POST | `/api/v1/giang-viens` | 201 | Tạo GV-7 Bùi Tạm Dừng (`DANG_HOAT_DONG` ban đầu) |
| 184 | PATCH | `/api/v1/giang-viens/d97ad6c5-...` | 200 | Toggle GV-7 → `TAM_DUNG` |
| 185 | GET | `/api/v1/giang-viens/d97ad6c5-...` | 200 | Reload sau update — UI render "Tạm dừng" |
| 192 | POST | `/api/v1/giang-viens` | 201 | Tạo GV-8 Phan Đa Lĩnh Vực (3 LV) |
| 187 | GET | `/api/v1/giang-viens?page=1&pageSize=20` | 200 | Sau toggle GV-7: list render đúng "Tạm dừng" |

**Variant [7] TAM_DUNG verify:** UI list cột Trạng thái render "Tạm dừng" cho ThS. Bùi Tạm Dừng (chụp [seed-gv-list-8-8-r5.png](../screenshots/seed-gv-list-8-8-r5.png)).
**Variant [8] multi-LV verify:** Form submit OK với 3 LV chọn (Kinh doanh thương mại + Thuế + Sở hữu trí tuệ), POST 201, list 1-8/8 mục.

---

## Observations (không SRS-ref, không log bug)

- **OBS-1 — Dropdown lĩnh vực thiếu DOANH_NGHIEP + HOP_DONG (regression cross-round 7th time).** 10 option DM TT17 chuẩn, thiếu 2 enum fixture yêu cầu. Cùng pattern R4 (CTĐT/Bài giảng/NHCH/Giảng viên) + R5 (CTĐT/Khóa học). Đây là gap DM Tier 0 — đã có obs trên các module trước, chưa fix. Variant [7] fallback "Kinh doanh thương mại" cho HOP_DONG; variant [8] giảm 4 LV → 3 LV (bỏ DOANH_NGHIEP + HOP_DONG, gộp 1 lần "Kinh doanh thương mại" + Thuế + SHTT).
- **OBS-2 — List cột Lĩnh vực vẫn thiếu (regression `BUG-GV-003-R4` Medium chưa fix).** Cột visible: Họ tên / Chuyên ngành / Trình độ / Vai trò / Số khóa đã dạy / Trạng thái / Thao tác. SRS FR-III-11 §Outputs row 6 ghi `linh_vuc`. Bug R4 vẫn open.
- **OBS-3 — Form thiếu `file_dinh_kem` (regression `BUG-GV-001-R4` Major chưa fix).** SRS FR-III-11 §Inputs row 10 ghi `file_dinh_kem N file ≤20MB`. Form vẫn không có upload field. Bug R4 vẫn open.
- **OBS-4 — Enum trang_thai 3 giá trị (Đang hoạt động/Tạm dừng/Vô hiệu hóa) khớp SRS §3.4.3.x.** R4 log `BUG-GV-002-R4` Medium do đối chiếu §Inputs (2 enum DANG_GIANG_DAY/TAM_DUNG). Per memory `qa_htpldn_giangvien_srs_contradiction`, §3.4.3.x là source of truth → bug R4 re-classify thành SRS internal contradiction (đã ghi nhận, không log lại).
- **OBS-5 — Combobox `Trạng thái` không filter theo type-text "Tạm dừng" + Enter.** Phải click expand + ArrowDown/Up + Enter để select. Friction nhỏ, không log bug (không có SRS clause yêu cầu type-search trên combobox này).

---

## Ảnh chụp

- [seed-gv-list-8-8-r5.png](../screenshots/seed-gv-list-8-8-r5.png) — list 8/8 record sau khi seed (6 reuse R4 + 2 NEW), GV-7 hiển thị "Tạm dừng".

---

## Cascade

- **B7 Workflow Khóa học (10 bước)** unblock được phần GV: 6 GV `DANG_HOAT_DONG` 6 lĩnh vực cover happy path map giảng viên KH; 1 GV `TAM_DUNG` test edge "không assign được KH mới"; 1 GV multi-LV test dropdown filter lĩnh vực show GV nhiều lần.
- **T4.6 Functional Khóa học (40 TC)** đủ data GV theo "Cần có sẵn" (8 GV: 6 DANG_HOAT_DONG + 1 TAM_DUNG + 1 multi-LV).

---

*2026-04-27 17:10 — QA chạy bằng Chrome DevTools MCP*
