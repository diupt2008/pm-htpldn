# Seed Checklist — Bài giảng (R6.3.9)

**Ngày:** 2026-05-02 14:08 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Kích hoạt` (default sau create)
**Màn:** SCR-III-03 — Kho tài liệu, Bài giảng • **Đường dẫn:** `/dao-tao/bai-giang/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > bai_giang_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-07 UC26 — Quản lý kho tài liệu, bài giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | Status |
|-----------------|------------------------|---------------|:---:|
| R6.4.B2.5 Khóa học seed | `bai_giang_ids[]` ref tồn tại (FR-III-02 §Inputs row 10) | ≥1 BG / khóa học, 8 khóa học → ≥8 BG khả dụng | ✅ |
| API outbound `/api/v1/dao-tao` (Cổng PLQG) | `cong_khai=true` (FR-III-07 §Inputs row 8) | ≥1 BG cong_khai=true | ✅ |
| Search filter Loại tài liệu | enum `SLIDE/PDF/VIDEO` (FR-III-07 §Inputs row 3) | ≥1 / 3 enum | ✅ |

**Acceptance pass khi:** mọi row `Status` = ✅ qua verify query thực tế (không chỉ đếm tổng).

---

## Kết quả: ✅ XONG 8/8

R6 round 1 trước seed 3/8 (3 Video PASS, 5 SLIDE/PDF FAIL BE 422). R6 round 2 hôm nay re-test sau dev fix BE: 5 SLIDE/PDF PASS toàn bộ → tổng 8/8.

**Bug (đã đóng):** [`BUG-FUNC-BAIGIANG-001 [CLOSED]`](../bug-reports/bug-report-seed-baigiang.md) — BE POST `/api/v1/bai-giangs` 422 với SLIDE/PDF upload — verify CLOSED 2026-05-02 R6.

---

## Bảng dữ liệu seed

| # | Tên bản ghi | Loại | Lĩnh vực FE chọn | Có vào kho? |
|---|-------------|------|------------------|:-----------:|
| 1 | Bài giảng 01 - Tổng quan Luật Doanh nghiệp | Slide | (bỏ trống — N) | ✅ |
| 2 | Bài giảng 02 - Luật Lao động cơ bản | Slide | Lao động | ✅ |
| 3 | Bài giảng 03 - Thuế GTGT thực hành | Video | Thuế (pre-existing R6 round 1) | ✅ |
| 4 | Bài giảng 04 - Hợp đồng thương mại | Slide | Hợp đồng | ✅ |
| 5 | Bài giảng 05 - Sở hữu trí tuệ | Video | (pre-existing R6 round 1) | ✅ |
| 6 | Bài giảng 06 - Đất đai cơ bản | Slide | Đất đai | ✅ |
| 7 | Bài giảng 07 - Pháp luật DN cũ | PDF | (bỏ trống — N) | ✅ |
| 8 | Bài giảng 08 - Tổng quan thuế quốc tế | Video | (pre-existing, cong_khai=true) | ✅ |

**Tổng:** 8/8 vào kho

### Per-filter verify

| Filter | Yêu cầu | Thực tế | Status |
|--------|---------|---------|:---:|
| Loại tài liệu = SLIDE | ≥1 | 4 (BG 01/02/04/06) | ✅ |
| Loại tài liệu = PDF | ≥1 | 1 (BG 07) | ✅ |
| Loại tài liệu = VIDEO | ≥1 | 3 (BG 03/05/08) | ✅ |
| cong_khai=true | ≥1 | 1 (BG 08) | ✅ |
| Lĩnh vực = Lao động | ≥1 | 1 (BG 02) | ✅ |
| Lĩnh vực = Thuế | ≥1 | 1 (BG 03) | ✅ |
| Lĩnh vực = Hợp đồng | ≥1 | 1 (BG 04) | ✅ |
| Lĩnh vực = Đất đai | ≥1 | 1 (BG 06) | ✅ |
| Lĩnh vực = Doanh nghiệp / SHTT | optional (FE dropdown thiếu) | BG 01/07 (DN) + BG 05 (SHTT) bỏ trống LV | ⚠️ note |

> **Quan sát (không log bug):** Dropdown "Lĩnh vực" trong form Thêm bài giảng chỉ liệt kê 10 lĩnh vực (Hợp đồng / Dân sự / Hình sự / Hành chính / Lao động / Đất đai / Hôn nhân gia đình / Kinh doanh thương mại / Khiếu nại tố cáo / Thuế) — KHÔNG có `Doanh nghiệp` và `Sở hữu trí tuệ` mặc dù DM `LINH_VUC_PHAP_LY` master có 13 records (R6.1.1 ✅). SRS FR-III-07 §Inputs row 6 chỉ ghi `linh_vuc_ids: identifier[] N — Chọn nhiều lĩnh vực`, không spec dropdown phải đầy đủ master DM → chưa map được SRS clause cụ thể nên KHÔNG log bug (memory rule `feedback_bug_must_have_srs_ref`). Có thể module Bài giảng dùng DM khác (vd `LINH_VUC_PHAP_LUAT_CHUNG` của Hỏi đáp), cần BA confirm.

---

## Ảnh chụp

- [Baseline R6 round 1: 3 Video pre-existing](../screenshots/r6-3-9-baseline-3video.png)
- [Sau seed: 8/8 Bài giảng](../screenshots/r6-3-9-baigiang-8of8-final.png)

---

*2026-05-02 14:08 — QA chạy bằng Chrome DevTools MCP*
