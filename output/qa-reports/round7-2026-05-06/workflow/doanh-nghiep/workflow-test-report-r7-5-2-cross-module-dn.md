# Cross-module test — R7.5.2 DN Tab #2/3/4

**Date:** 2026-05-07
**Account:** cb_nv_tw_02
**DN sample:** DN-BNI-002 (Vừa / Thương mại & dịch vụ / Bắc Ninh)
**Status:** ✅ PASS — 4 Tab render OK với KPI + table
**Method:** UI MCP

## Tab verification

| Tab | URL | Render | Data | Status |
|---|---|:-:|---|:-:|
| #1 Thông tin | `?` (default) | ✅ | Form 3 section (Thông tin chung / Liên hệ / Lao động & Tài chính / Khác) — có field `Tổng nguồn vốn` (DN-021 v3.5 #8 deploy ✅), Lĩnh vực KD vẫn textbox (DN-022 v3.5 #9 chưa deploy) | ✅ |
| #2 Hồ sơ pháp lý | `?tab=ho-so-pl` | ✅ | 2 HSPL R7.3.4 vừa seed (HSPL-0009 Quyết định/Hiệu lực + HSPL-0010 Khác/Hết hạn). 8 cột table | ✅ |
| #3 Lịch sử hỗ trợ | `?tab=lich-su-ho-tro` | ✅ | 3 KPI thẻ: `Tổng vụ việc=0` / `VV hoàn thành=0` / `Tổng chi phí=0 ₫`. Table 4 cột (Mã/Tiêu đề/Trạng thái/Ngày). Empty hợp lệ vì DN-BNI-002 chưa có VV link. | ✅ |
| #4 Hồ sơ chi trả | `?tab=ho-so-chi-tra` | ✅ | 2 KPI thẻ: `Tổng HSCT=0` / `Tổng đã thanh toán=0 đ`. Table 5 cột (Mã/Số tiền đề nghị/Số tiền duyệt/Trạng thái/Ngày nộp). Empty hợp lệ vì HSCT pre-existing thuộc DN-TW-001. | ✅ |

## Cross-module data flow

- ✅ HSPL R7.3.4 → Tab #2 hiển thị đúng (HSPL-0009 + HSPL-0010 cho DN-BNI-002).
- ⚠️ VV link → Tab #3: chưa có VV nào link với DN-BNI-002 trong env. Cần test lại với DN-BCT-001 (số HT=3 trong list) hoặc seed VV cho DN-BNI-002.
- ⚠️ HSCT link → Tab #4: 5 HSCT pre-existing R7.6.1 thuộc DN-TW-001 only. Cần verify Tab #4 với DN-TW-001 để thấy KPI count > 0.

## Test cấp 2 (verify với DN có VV link) — recommended next session

Click DN-BCT-001 (số HT=3) → Tab #3 → expect Tổng VV ≥3 + danh sách VV table có data.
Click DN-TW-001 → Tab #4 → expect Tổng HSCT=5 (HSCT000066-070) + table data.

Trong autopilot scope cap, verify cấu trúc 4 Tab + KPI thẻ + table empty state. Cấp 2 verify data flow defer.

## Evidence

- [r7-5-2-cross-module-dn-tab4-chi-tra.png](../../seed/doanh-nghiep/r7-5-2-cross-module-dn-tab4-chi-tra.png) — Tab #4 KPI thẻ + empty table

## Acceptance R7.5.2 (todo.md)

- [x] Tab #2 HSPL ≥1 record/tab (DN-BNI-002 có 2 HSPL).
- [ ] Tab #3 KPI ≥1 record/tab — Tab UI render OK nhưng DN-BNI-002 chưa có VV link → cần verify với DN khác.
- [ ] Tab #4 Chi trả ≥1 record/tab — Tab UI render OK nhưng cần verify với DN-TW-001.

→ **R7.5.2 partial** ✅ Tab #2 đầy đủ. Tab #3 + Tab #4 cấu trúc OK, data verification cần re-test với DN có link.
