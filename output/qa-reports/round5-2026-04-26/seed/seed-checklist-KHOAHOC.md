# Seed Checklist — Khóa học (B3)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 12:35-12:55 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Dự thảo`
**Màn:** SCR-III-01/02 — Khóa học • **Đường dẫn:** `/dao-tao/khoa-hoc/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > khoa_hoc_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-01 UC20 — Quản lý Khóa học (entity con CTĐT)](../../../../input/srs-v3/srs-fr-03-dao-tao.md)
**Precondition:** [seed-checklist-CTDT.md](seed-checklist-CTDT.md) ✅ + [workflow-test-report-CTDT.md](../workflow/workflow-test-report-CTDT.md) ✅ → 6/6 CTĐT `Đã duyệt` (CTDT-BTP-TW-2026-0001..0006).

---

## Kết quả: ✅ XONG 8/8

**Tóm tắt 1 dòng:** 8/8 KH `Dự thảo` (KH-20260427-001..008) gắn đủ 6 CTĐT khác nhau, cover 2 hình thức + 3 region + 2 edge scenario.

**Cách chạy nhanh hơn fixture cũ:** combobox CTĐT click trực tiếp item theo title text + datepicker dùng format `DD/MM/YYYY` + Tab/Enter (Enter sau end date auto-submit form, không cần click `[Tạo khóa học]`).

---

## Bảng dữ liệu seed

| # | Mã khóa học | Tên | CTĐT | Hình thức | Ngày BĐ-KT (BE lưu) | Trạng thái |
|---|------------|------|------|-----------|----------------------|:----------:|
| 1 | `KH-20260427-001` | Pháp luật doanh nghiệp căn bản | CTDT-0001 | Trực tuyến | 14/05/2026 - 20/05/2026 | Dự thảo |
| 2 | `KH-20260427-002` | Luật thuế GTGT thực hành | CTDT-0001 | Trực tiếp | 31/05/2026 - 03/06/2026 | Dự thảo |
| 3 | `KH-20260427-003` | Hợp đồng thương mại quốc tế | CTDT-0001 | Trực tuyến | 09/07/2026 - 12/07/2026 | Dự thảo |
| 4 | `KH-20260427-004` | An toàn lao động ngành xây dựng | CTDT-0002 | Trực tiếp | 24/05/2026 - 27/05/2026 *(shift forward)* | Dự thảo |
| 5 | `KH-20260427-005` | Sở hữu trí tuệ cho startup | CTDT-0003 | Trực tuyến | 31/05/2026 - 05/06/2026 *(shift forward)* | Dự thảo |
| 6 | `KH-20260427-006` | Luật đất đai cập nhật 2024 | CTDT-0004 | Trực tiếp | 14/06/2026 - 17/06/2026 *(shift forward)* | Dự thảo |
| 7 | `KH-20260427-007` | Thuế DN xuất khẩu thực hành | CTDT-0005 | Trực tuyến *(KET_HOP fallback)* | 31/08/2026 - 05/09/2026 | Dự thảo |
| 8 | `KH-20260427-008` | HĐ thương mại nội địa cho DN Đà Nẵng | CTDT-0006 | Trực tiếp | 31/05/2026 - 03/06/2026 | Dự thảo |

**Tổng:** 8 vào kho / 0 bị chặn. Tab "Dự thảo" hiển thị 8/8.

**Ảnh chụp:** [khoahoc-b3-list-8of8.png](../screenshots/khoahoc-b3-list-8of8.png)

---

## Bug SRS-ref

### `BUG-KH-001-R5` — Major (regression UNFIXED từ R2 memory `qa_htpldn_khoahoc_flow_round2`)

**Tóm tắt:** Mọi khóa học có ngày bắt đầu BE lưu = input − 1 ngày. Ngày kết thúc đúng.

**Repro 8/8:**
| Input ngày BĐ | BE lưu ngày BĐ | Lệch |
|---------------|----------------|:----:|
| 15/05/2026 (V1) | 14/05/2026 | -1 |
| 01/06/2026 (V2) | 31/05/2026 | -1 |
| 10/07/2026 (V3) | 09/07/2026 | -1 |
| 25/05/2026 (V4) | 24/05/2026 | -1 |
| 01/06/2026 (V5) | 31/05/2026 | -1 |
| 15/06/2026 (V6) | 14/06/2026 | -1 |
| 01/09/2026 (V7) | 31/08/2026 | -1 |
| 01/06/2026 (V8) | 31/05/2026 | -1 |

**SRS ref:** FR-III-01 §Inputs `ngay_bat_dau` (Y, định dạng date). SRS không spec timezone offset → user nhập 15/05 phải lưu 15/05.

**Root cause nghi:** FE convert `Date` thành ISO string với TZ UTC, nhưng `00:00:00 GMT+7` = `17:00:00 UTC ngày trước` → BE parse → `.toDateString()` ra ngày trước.

**Severity:** Major — ảnh hưởng filter ngày, báo cáo TT17, lịch học hiển thị sai 1 ngày. Đã regression cross-round (R2 → R5 chưa fix).

---

## Quan sát ngoài SRS (không log bug)

- **O1 — Form Hình thức chỉ 2 enum** (Trực tuyến / Trực tiếp), không có `KET_HOP`. Variant [7] fixture `KET_HOP` → fallback Trực tuyến. SRS FR-III-01 §Inputs + ERD KHOA_HOC chỉ liệt kê 2 enum → form đúng SRS, fixture vượt scope. Đề nghị BA cập nhật fixture nếu enum SRS chính thức là 2 hoặc thêm KET_HOP nếu spec mở rộng.
- **O2 — App reject ngày bắt đầu < hôm nay (DatePicker disable past).** Variant [4] fixture `2026-04-20` (past, hôm nay 27/04) → form báo "Vui lòng chọn khoảng thời gian", value xám không submit. Đã shift forward `25/05/2026 → 27/05/2026` (giữ độ dài 2 ngày). SRS không spec rule này, app FE đang hardcode min-date = today.
- **O3 — Form thiếu binding cho fixture field `link_zoom / ngan_sach / mo_ta / bai_giang_ids / giang_vien_link`.** SRS FR-III-01 §Inputs cho KHOA_HOC liệt kê 7 field cốt lõi (ten_khoa_hoc, ctdt_id, hinh_thuc, ngay_bat_dau, ngay_ket_thuc, dia_diem, doi_tuong, so_luong_toi_da). Fixture vượt scope → form đúng SRS, fixture redundant. Có thêm `Số buổi học` ngoài SRS — đề nghị BA bổ sung vào SRS hoặc bỏ field.
- **O4 — Spinbutton "Sĩ số tối đa" + "Số buổi học" `valuemax="0"` quirk:** valuemin=1 nhưng valuemax=0 → MCP `fill` không type được. Bỏ trống vẫn submit OK (8/8). Field optional theo SRS — không bug, chỉ FE attribute sai cosmetic.
- **O5 — Form không có button `[Tạo khóa học]` click visible interactive sau khi datepicker đóng**, nhưng Enter trên end date → auto-submit form. Tốt cho automation, không bug.

---

## Cascade impact

- **B7** (Workflow Khóa học đầy đủ 10 bước) UNBLOCK — đã có 8 KH `Dự thảo` cover 2 hình thức + 6 CTĐT. Edge variant [7] HUY cascade từ CTĐT[5] cần workflow huỷ CTĐT trước, [8] ĐP scope test với cb_nv_dp_*.
- **T4.6** (Functional Khóa học 40 TC) UNBLOCK — sample đa dạng đủ.
- **B5** (NHCH+ĐKT) — phần Đề kiểm tra hiện tại form không có field `khoa_hoc_id` mandatory (R4 obs đã ghi). Nếu BA confirm cần khoa_hoc_id → 8 KH này dùng làm FK.
- **BUG-KH-001-R5 timezone -1**: cần dev FE fix trước khi B7 chạy duyệt + đẩy sang `Đã duyệt` (cột ngày khoá học sẽ lệch 1 ngày trên list).

---

*2026-04-27 12:55 — QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01` (single session, không cần re-login).*
