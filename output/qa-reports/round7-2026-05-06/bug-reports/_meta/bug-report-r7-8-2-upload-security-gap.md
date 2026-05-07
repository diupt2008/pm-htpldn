# Bug Report — R7.8.2 Upload security gap (sau bỏ ClamAV)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA huongttt via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Cross-cutting / Security regression |
| **Round** | Round 7 — R7.8.2 |
| **Tài liệu tham chiếu** | [_DELTA-MAP-CROSS-CUTTING.md C2 line 50-86](../../../../input/srs-update-2026-5-5/_DELTA-MAP-CROSS-CUTTING.md) |

---

## Tổng hợp

Phát hiện **1 bug Major (security)** sau khi BE bỏ ClamAV theo SRS update item 10. Endpoint upload `/api/v1/files/upload` chỉ check extension whitelist + Content-Type header (untrusted), KHÔNG check magic bytes file → mime spoofing trivial.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 0        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|---|---|---|---|---|---|---|---|
| BUG-SEC-FILE-01 | **Major** | P1 | Negative | R7.8.2-TC05 | `_DELTA-MAP-CROSS-CUTTING.md C2 line 69-78` (QA flag risk Critical, escalate BA security review) | BE upload chỉ check extension + MIME (client-trusted) → mime spoof `.exe` → `.pdf` lọt qua content validation | Open |

---

## BUG-SEC-FILE-01 — Upload bypass: rename `.exe` → `.pdf` lọt qua content validation

### Mô tả

Sau khi bỏ ClamAV (SRS update item 10), endpoint `POST /api/v1/files/upload` mất layer scan content. BE chỉ validate theo **đuôi file (extension whitelist)** và **MIME-type header (do client gửi, untrusted)**. KHÔNG đọc magic bytes thật của file để verify content match extension. Attacker rename `malware.exe` → `malware.pdf` + set Content-Type `application/pdf` ở header → BE accept past content validation, chỉ fail tại tầng permission khi chưa có entityId valid.

### Các bước tái hiện

1. Login `qtht_02` (account QTHT, role thường).
2. Mở DevTools console, chạy script tạo file giả PDF chứa PE header bytes (signature `.exe`):
   ```js
   const peHeader = new Uint8Array([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00]);
   const fd = new FormData();
   fd.append('file', new Blob([peHeader], {type: 'application/pdf'}), 'fake-malware.pdf');
   fd.append('entityType', 'VuViec');
   fd.append('entityId', '00000000-0000-4000-8000-000000000001');
   const r = await fetch('/api/v1/files/upload', {method:'POST', body: fd, credentials:'include'});
   console.log(r.status, await r.text());
   ```
3. Quan sát: response **KHÔNG** trả `ERR-VAL-FILE-03 "Loại file không được hỗ trợ"`. Thay vào đó trả `403 ERR-PERM-FILE-02 "Forbidden"` — fail ở tầng permission, **đã pass content validation**.
4. So sánh control: rename `.exe` không đổi → nhận `400 ERR-VAL-FILE-03` ngay (extension reject).

### Kết quả mong đợi

BE phải đọc magic bytes (signature 8-16 byte đầu file) và verify match với extension claim. Cụ thể:
- `.pdf` → magic `25 50 44 46` (`%PDF`)
- `.jpg` → `FF D8 FF`
- `.png` → `89 50 4E 47 0D 0A 1A 0A`
- `.doc/.xls` (CFB) → `D0 CF 11 E0 A1 B1 1A E1`
- `.docx/.xlsx` (ZIP-based) → `50 4B 03 04` + verify inner `[Content_Types].xml`

Nếu magic không match extension → reject với `ERR-VAL-FILE-XX "Nội dung file không khớp định dạng"`.

### Kết quả thực tế

BE nhận file PE bytes claim là `.pdf`, pass content layer, chỉ fail ở permission. Nếu user có quyền upload (CB NV trong scope, DN tự upload HSCT của mình) → file độc bytes PE được lưu lên server với tên `.pdf`. Khác user download file đó, rename `.exe` lại → có thể trigger malware nếu thiếu sandbox.

**API response (test mime spoof):**
```json
HTTP 403
{
  "success": false,
  "error": {
    "code": "ERR-PERM-FILE-02",
    "message": "Forbidden",
    "timestamp": "2026-05-07T10:50:38.200Z",
    "requestId": "f4ff3c02-291d-4c09-96b6-1db77562792d"
  }
}
```

**API response (control — `.exe` không đổi):**
```json
HTTP 400
{
  "success": false,
  "error": {
    "code": "ERR-VAL-FILE-03",
    "message": "Loại file không được hỗ trợ. Chỉ chấp nhận: .doc, .docx, .xls, .xlsx, .pdf, .jpg, .png"
  }
}
```

→ 2 case khác nhau ở 1 byte (đuôi file). Content giống hệt (PE header). Chứng minh BE chỉ check extension, không sniff content.

### Bằng chứng

- Full report: [functional-test-report-r7-8-2-clamav-removal.md](../../functional/functional-test-report-r7-8-2-clamav-removal.md) §B Magic-byte sniffing.
- Test pattern: 6 case (`.exe/.bat/.docm/.zip` reject + `.pdf` mime-spoof pass + real `.pdf` control).
- Layer defense lost so với v3 (có ClamAV):
  - ❌ Virus scan content (lost)
  - ❌ Macro detection Office docs (lost)
  - ❌ Magic-byte signature check (chưa bao giờ có)
  - ✅ Extension whitelist (còn)
  - ⚠️ MIME-type header (còn nhưng client-trusted)

---

*2026-05-07 — QA huongttt via Chrome DevTools MCP. Reference: SRS update 2026-05-05 _DELTA-MAP-CROSS-CUTTING.md C2.*
