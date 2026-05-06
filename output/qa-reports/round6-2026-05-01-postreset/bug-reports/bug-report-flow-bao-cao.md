# Bug Report — Báo cáo Thống kê (Export Excel/Word)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code via MCP Chrome DevTools) |
| **Ngày** | 2026-05-05 |
| **Loại test** | Verification (R6.5.4 BC04 export Excel HD/VV) |
| **Round** | R20 |
| **Tài liệu tham chiếu** | [verification-test-report-BaoCao-Export.md](../workflow/verification-test-report-BaoCao-Export.md) · `tasks/todo.md` R6.5.4 |

---

## Tổng hợp

Phát hiện **2** lỗi có SRS reference cụ thể trong quá trình test R6.5.4 (Verification Phase 5).

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 1        | 0     | 0      | 1     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-BC-EXPORT-001 | Critical | P0 | Data | R6.5.4 | `FR-12 Báo cáo §Xuất file` (export Excel/Word toàn module) | API `/bao-cao/export` trả JSON wrap NestJS StreamableFile thay vì binary xlsx — file tải về không mở được | Open |
| BUG-BC-LEGEND-001 | Minor | P3 | UI/UX | R6.5.4 | `FR-12 Báo cáo §Trình bày kết quả — Biểu đồ` | Pie chart legend hiển thị raw UUID `bbbbbbbb-...` thay vì label LV (Kinh doanh TM, Hợp đồng, ...) | Open |

---

## BUG-BC-EXPORT-001 — API `/bao-cao/export` trả JSON wrap NestJS StreamableFile, file tải về không phải xlsx hợp lệ

### Mô tả

Click button [Xuất Excel] tại trang Báo cáo Thống kê (mọi loại BC: Hỏi đáp, Vụ việc đã hoàn thành đã thử) — file tải về có đuôi `.xlsx` nhưng nội dung là **JSON** chứ không phải binary Excel. Mở bằng Excel báo "file corrupt". Bytes Excel hợp lệ (`PK\x03\x04` ZIP magic) nằm trong `data.stream._readableState.buffer[].data` của JSON nhưng đã bị `JSON.stringify`. Toàn bộ tính năng Xuất Excel/Word của module Báo cáo không dùng được.

### Các bước tái hiện

1. Login `qtht_01` / `Secret@123` / OTP `666666`.
2. Sidebar → "Báo cáo thống kê".
3. Chọn "Loại báo cáo" = `BC Số lượng hỏi đáp/vướng mắc` (hoặc `BC Vụ việc đã hoàn thành`).
4. Chọn "Kỳ báo cáo" = `Năm` → app auto-fill `Từ 01/01/2026 — Đến 31/12/2026`.
5. Click [Xem báo cáo] → bảng + biểu đồ render OK với data thật.
6. Click [Xuất Excel] → Chrome bắt đầu download file 9.4 KB (BC HD) hoặc 7.9 KB (BC04 VV).
7. Mở file bằng Excel/LibreOffice → báo lỗi corrupt.
8. Quan sát: Inspect file → `file <path>` trả về `JSON text data` (không phải Microsoft Excel format).

### Kết quả mong đợi

- Theo `FR-12 Báo cáo §Xuất file`: hệ thống tải về file `.xlsx` mở được trong Excel, sheet ≥1 hàng data thống kê tương ứng filter.
- Header HTTP response phải có:
  - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `Content-Disposition: attachment; filename="..."`
- Body response phải là **binary stream xlsx** (4 byte đầu = `0x50 0x4B 0x03 0x04` ZIP magic).

### Kết quả thực tế

- File tải về có header sai (`application/json; charset=utf-8`).
- Body là JSON envelope chuẩn của project: `{ success: true, data: { options:{}, logger:{ context:"StreamableFile" }, stream:{...} }, meta: {...} }`.
- Bytes xlsx thật nằm trong `data.stream._readableState.buffer[i].data` (mảng integer `[80, 75, 3, 4, ...]`) — đúng là Excel binary nhưng đã bị JSON.stringify (bị wrap qua response interceptor toàn cục).
- Excel/LibreOffice mở báo "Excel cannot open the file because the file format or file extension is not valid".

### Bằng chứng

**1. Ảnh chụp (BC HD load + button Xuất Excel)**:

![BUG-BC-EXPORT-001 — BC HD load thành công, click Xuất Excel](../screenshots/r6-5-4-bc-hd-data-loaded.png)

![BUG-BC-EXPORT-001 — BC04 VV load 1 record Lao động, click Xuất Excel](../screenshots/r6-5-4-bc04-vv-data-loaded.png)

**2. API response (corrupt body — JSON thay vì xlsx binary)**:

File tải về (rename `.json` cho dễ inspect):
- [r6-5-4-bc-hd-export-corrupt.json](../evidence/r6-5-4-bc-hd-export-corrupt.json) — 9408 bytes
- [r6-5-4-bc04-vv-export-corrupt.json](../evidence/r6-5-4-bc04-vv-export-corrupt.json) — 7932 bytes

Trích đầu file:

```json
{
  "success": true,
  "data": {
    "options": {},
    "logger": { "context": "StreamableFile", "options": {} },
    "stream": {
      "_events": { "error": [null, null], "finish": [null, null] },
      "_readableState": {
        "highWaterMark": 16384,
        "buffer": [
          { "type": "Buffer", "data": [80, 75, 3, 4] },
          { "type": "Buffer", "data": [20, 0] },
          ...
```

Bytes `[80, 75, 3, 4]` (`0x504B0304`) = ZIP magic = đúng signature đầu file `.xlsx`. → BE đã trả `StreamableFile` đúng, nhưng response interceptor `{success, data, meta}` của project đã `JSON.stringify` object `StreamableFile` thay vì pipe stream xuống response body.

**3. Network**:

```
POST /api/v1/bao-cao/export → 200
Content-Type: application/json; charset=utf-8        ← SAI, phải là xlsx mime
Content-Length: 9408 (BC HD) / 7932 (BC04 VV)
Body: {"success":true,"data":{"options":{},"logger":{...},"stream":{...}},"meta":{...}}
```

---

## BUG-BC-LEGEND-001 — Pie chart legend hiển thị raw UUID `bbbbbbbb-...` thay vì label LV

### Mô tả

Tại trang Báo cáo Thống kê → BC "Số lượng hỏi đáp/vướng mắc": pie chart legend (cột mã + tỷ lệ %) hiển thị toàn bộ key dưới dạng UUID v4 (`bbbbbbbb-0000-4000-8000-00000000001x`) thay vì tên Lĩnh vực PL. Bảng dữ liệu bên dưới biểu đồ thì hiển thị đúng tên (Kinh doanh thương mại, Hợp đồng, ...). FE thiếu mapping `linhVucPlId → linhVucPlTen` cho component biểu đồ. Cùng pattern lặp lại trên BC04 (legend `bbbbbbbb-...000013` thay vì "Lao động").

### Các bước tái hiện

1. Login `qtht_01`.
2. Sidebar → "Báo cáo thống kê".
3. Loại báo cáo = `BC Số lượng hỏi đáp/vướng mắc` → Kỳ = `Năm` → [Xem báo cáo].
4. Quan sát pie chart phía trên bảng dữ liệu.

### Kết quả mong đợi

- Theo `FR-12 §Trình bày kết quả — Biểu đồ`: legend hiển thị **tên** danh mục đúng như cột "Lĩnh vực PL" trong bảng (Kinh doanh thương mại 12, Hợp đồng 7, ...).

### Kết quả thực tế

- Legend hiển thị 13 entries dưới dạng UUID raw:
  - `bbbbbbbb-0000-4000-8000-000000000010: 7.1%`
  - `bbbbbbbb-0000-4000-8000-000000000011: 7.1%`
  - ...
  - `bbbbbbbb-0000-4000-8000-000000000016: 17.1%` (đáng ra là "Kinh doanh thương mại 12")
  - `efd984f2-88b3-40bc-aadd-9715c14d3652: 10.0%` (entry không khớp prefix `bbbbbbbb-` chung — có thể là LV legacy/external)
- Bảng phía dưới hiển thị đúng tên LV → confirm BE trả đủ tên, FE không pass tên xuống chart component.

### Bằng chứng

![BUG-BC-LEGEND-001 — Pie chart legend raw UUID, bảng dưới có tên đúng](../screenshots/r6-5-4-bc-hd-data-loaded.png)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (dev bypass) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP (cookie session) |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-05 | QA Automation via Claude Code*
