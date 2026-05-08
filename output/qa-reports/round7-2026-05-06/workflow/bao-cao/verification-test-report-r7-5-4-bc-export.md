# Workflow Test Report — Báo cáo Thống kê Export Excel HD/VV (R7.5.4)

> **Module:** Báo cáo Thống kê (M11) · FR-12 · **SRS:** [`02-thu-tu-module.md §⑫`](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · **Round:** R7 · **Date:** 2026-05-08 · **Tester:** QA Automation (Claude Code via MCP Chrome DevTools)
> **Bug:** [`bug-report-r7-5-4-bc-export.md`](../../bug-reports/bao-cao/bug-report-r7-5-4-bc-export.md) — 1 Critical + 1 Minor (re-confirm Open từ R6)
> **Re-test:** [R6.5.4 verification-test-report-BaoCao-Export.md](../../../round6-2026-05-01-postreset/workflow/verification-test-report-BaoCao-Export.md)

---

## Kết luận

❌ **FAIL — 4/7 bước PASS, 2/7 FAIL, 1/7 BLOCKED**. Cả 2 bug từ R6 vẫn Open:

- **BUG-BC-EXPORT-001** Critical — body export vẫn JSON wrap StreamableFile (4 byte đầu = `{"su` thay vì `PK\x03\x04` ZIP magic). Header `Content-Type` đã sửa thành `application/vnd.openxmlformats-...spreadsheetml.sheet` nhưng body chưa pipe stream → tình trạng tệ hơn R6: Chrome lưu file `.xlsx` nhưng nội dung là JSON, user mở Excel báo corrupt mà không có dấu hiệu nào trên header để debug.
- **BUG-BC-LEGEND-001** Minor — pie chart legend vẫn raw enum (`bbbbbbbb-...000013`, `TRUC_TIEP`) thay vì tên hiển thị.

BC04 (VV đã hoàn thành) BLOCKED do R7.4.A3 ⏳ chưa seed VV HOAN_THANH cho round 7 (`tongVuViec=0`); pattern bug đã verify qua BC HD + BC VV tiếp nhận (cùng endpoint `POST /api/v1/bao-cao/export`, cùng wrap pattern, total xlsx bytes inside JSON = 1910 cả hai).

---

## Bảng kiểm tra workflow

| # | Bước (verify) | Actor | Sample test | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 1 | Navigate Báo cáo Thống kê | qtht_01 | URL `/bao-cao` | ✅ | Form 2 dropdown required + 2 filter optional render OK |
| 2 | Chọn BC HD + Kỳ Năm + [Xem báo cáo] | qtht_01 | `GET /bao-cao/hoi-dap?kyBaoCao=NAM` 200 | ✅ | 6 records (Lao động 3, Đất đai 1, SHTT 1, DN 1) — round 7 seed |
| 3 | Click [Xuất Excel] BC HD | qtht_01 | `POST /bao-cao/export` 200 → 7934 B | ❌ | **BUG-BC-EXPORT-001 still Open** — header Content-Type đã đổi sang xlsx mime nhưng body vẫn JSON wrap, 4 byte đầu `7b 22 73 75` (`{"su`) |
| 4 | Chọn BC04 "VV đã hoàn thành" + [Xem báo cáo] | qtht_01 | `GET /bao-cao/vu-viec-hoan-thanh?kyBaoCao=NAM` 200 | 🚫 | **BLOCKED** — `tongVuViec=0, theoLinhVuc=[]` do R7.4.A3 ⏳ chưa seed VV HOAN_THANH; nút [Xuất Excel] disabled vì empty data |
| 5 | Click [Xuất Excel] BC04 | qtht_01 | — | 🚫 | BLOCKED do bước 4 — không bypass được vì button disabled khi `tongVuViec=0` |
| 6 | Cross-verify pattern qua BC khác có data | qtht_01 | BC VV tiếp nhận (5 record TRUC_TIEP) → `POST /bao-cao/export` 200 → 7934 B | ❌ | **BUG-BC-EXPORT-001** confirm structural — total xlsx bytes inside JSON = 1910, body wrap identical pattern |
| 7 | Verify pie chart legend label | qtht_01 | DOM legend text | ❌ | **BUG-BC-LEGEND-001 still Open** — BC HD legend `bbbbbbbb-0000-4000-8000-000000000013` (LV `linh_vuc_pl_id`); BC VV tiếp nhận legend `TRUC_TIEP` (raw enum kênh tiếp nhận) |

> Icon: ✅ pass · ❌ fail · 🚫 blocked (cascade upstream) · — chưa test

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R20 (R6) | 05/05 | FAIL — BC load + UI OK; export Excel cả HD lẫn BC04 VV trả JSON wrap StreamableFile thay vì xlsx binary. 1 Critical + 1 Minor Open. |
| R7 | 08/05 | FAIL — Header Content-Type đã fix sang xlsx mime nhưng body vẫn JSON wrap (regression risk: user nay không có cảnh báo header để biết file hỏng). BC04 BLOCKED chờ R7.4.A3 seed VV HOAN_THANH. Legend bug chưa fix. |

---

## Bằng chứng

![BC HD load 6 records — pie chart legend raw UUID `bbbbbbbb-...000013`](../../bug-reports/bao-cao/image/r7-5-4-bc-hd-data-loaded.png)

![BC VV tiếp nhận load 5 records — pie chart legend raw enum `TRUC_TIEP` thay vì "Trực tiếp"](../../bug-reports/bao-cao/image/r7-5-4-bc-vv-tiepnhan-data.png)

![BC04 VV hoàn thành empty state — `tongVuViec=0`, button Xuất Excel disabled](../../bug-reports/bao-cao/image/r7-5-4-bc04-vv-empty.png)

```text
POST /api/v1/bao-cao/export → 200
Request:  {"loaiBaoCao":"BC_HOI_DAP","kyBaoCao":"NAM","tuNgay":"2026-01-01","denNgay":"2026-12-31","filterDacThu":{},"formatXuat":"XLSX"}
Response Headers:
  content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8   ← R7 đã sửa (R6 sai: application/json)
  content-disposition: attachment; filename="bao-cao-hoi-dap-2026-05-08.xlsx"
  content-length: 7934
Response Body (4 byte đầu, hex):
  7b 22 73 75 = `{"su`  ← R7 vẫn JSON wrap (kỳ vọng `50 4B 03 04` = ZIP magic)
  Top-level keys: success,data,meta
  data.stream._readableState.buffer = 27 chunks
  buffer[0].data[0..3] = [80, 75, 3, 4] → đúng PK ZIP magic NHƯNG bị JSON.stringify
  Total xlsx bytes inside JSON: 1910

POST /api/v1/bao-cao/export (BC_VU_VIEC_TIEP_NHAN, format XLSX) → 200
Same wrap pattern: 27 buffer chunks, 1910 xlsx bytes, body JSON envelope.

GET /api/v1/bao-cao/vu-viec-hoan-thanh?kyBaoCao=NAM&tuNgay=2026-01-01&denNgay=2026-12-31 → 200
Body: {"success":true,"data":{"tongVuViec":0,"theoLinhVuc":[],"theoKetQua":[],"theoDonVi":[],"theoKy":[]},"meta":null}
→ R7 chưa có VV HOAN_THANH (R7.4.A3 ⏳).

Console: 1 error blob HTTPS (download blob URL — không liên quan bug)
```

### Root cause analysis

R6 → R7 dev đã fix một nửa: response interceptor giờ set đúng header `Content-Type` + `Content-Disposition` cho route `/bao-cao/export`, nhưng vẫn `JSON.stringify` instance `StreamableFile` thay vì pipe `_readableState.buffer` xuống response body. Hệ quả:

1. **Tệ hơn R6:** User ở R6 còn có header `application/json` để nhận biết file lỗi format. Ở R7 header xlsx mime + extension `.xlsx` lừa OS handler → click open Excel → corrupt error mơ hồ.
2. **Bytes xlsx vẫn intact** trong `data.stream._readableState.buffer[].data` (chunk[0] bắt đầu `[80, 75, 3, 4]` = PK ZIP magic, total 1910 bytes / 27 chunks) — confirm BE engine sinh xlsx chuẩn, lỗi nằm ở interceptor `JSON.stringify` thay vì `pipe()`.
3. **Pattern chung toàn module Báo cáo:** verify qua 2 endpoint BC HD + BC VV tiếp nhận → cùng wrap pattern, cùng 1910 bytes payload.

### Fix recommendation (cho dev — không thuộc scope file bug, ghi tại verification report theo template hiện hành)

1. **BE — exclude `StreamableFile` khỏi response interceptor:** kiểm tra `instanceof StreamableFile` đầu interceptor → trả về `response.send(file.getStream())` hoặc dùng `@nestjs/common`'s built-in handling, bỏ qua envelope `{success,data,meta}`.
2. **Test sau fix:** Re-run R7.5.4 verify file mở được trong Excel + sheet ≥1 hàng data + cell value khớp UI bảng. Cần đợi R7.4.A3 ✅ để cover BC04 case.
3. **Legend bug fix:** FE component pie chart pass `name` (linhVucPlTen / kenhTiepNhanLabel) thay vì `id/code` xuống Recharts/AntV `<Pie nameKey>`.

---

*R7 | QA Automation (Claude Code via MCP Chrome DevTools)*
