# Bug Report — R7.7.8b FR-VIII-22 Self-reg Doanh nghiệp

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/register/doanh-nghiep |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 2026-05-07 |
| **Round** | Round 7 — R7.7.8b |
| **2-source verify** | ✅ NotebookLM Haizz-HTPLDN + grep SRS local |

---

## Tổng hợp

Phát hiện **5** bug khi test FR-VIII-22 Self-reg DN.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 5    | 0        | 1     | 1      | 3     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|---|---|---|---|---|---|---|---|
| BUG-FR22-002 | Major | P1 | Workflow | TC02 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1032 + 1074 | FE+BE cho phép MST 13 chữ số (chi nhánh) — SRS chỉ định regex `^\d{10}$`, chi nhánh không tự đăng ký riêng | Open |
| BUG-FR22-004 | Medium | P2 | Workflow | TC08 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1032 | BE thêm validation MST checksum theo TT 105/2020 — KHÔNG có trong SRS spec; cần BA confirm bổ sung hay drop | Open |
| BUG-FR22-001 | Minor | P3 | UI/UX | TC01 + TC08 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1089-1090 + 1280 | UI thiếu ô "Tên đăng nhập" readonly hiển thị MST + UI message "hiệu lực 24 giờ" ≠ SRS line 1280 "vĩnh viễn" | Open |
| BUG-FR22-003 | Minor | P3 | Code | TC03 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1074-1079 | errCode mismatch — BE `ERR-VAL-VIII-22-XX` thay SRS `ERR-REG-XX` | Open |
| BUG-FR22-005 | Minor | P3 | Workflow | TC08 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md` line 1070-1079 | BE warning WRN-DN-01 quy mô-lao động (NĐ 39/2018) — không có trong FR-VIII-22 §Error Handling | Open |

---

## BUG-FR22-002 — FE+BE cho phép MST 13 chữ số (chi nhánh) vi phạm SRS

### Mô tả

SRS line 1032 quy định `regex ^\d{10}$` (10 chữ số, theo TT 105/2020/TT-BTC Điều 5 — đơn vị độc lập). Chi nhánh / VPĐD / địa điểm KD (MST 13 chữ số) KHÔNG tự đăng ký riêng — phải qua DN mẹ. SRS line 1074 ERR-REG-01a message: "Mã số thuế phải đúng 10 chữ số (theo TT 105/2020/TT-BTC). Chi nhánh không tự đăng ký riêng." UI thực tế hiển thị error "MST phải là 10 hoặc 13 chữ số" — chấp nhận 13 chữ số (chi nhánh).

### Các bước tái hiện

1. Navigate `/register/doanh-nghiep`.
2. Fill MST = `ABC123` (sai format).
3. Submit → quan sát error.

### Kết quả mong đợi

- Inline error: "Mã số thuế phải đúng 10 chữ số (theo TT 105/2020/TT-BTC). Chi nhánh không tự đăng ký riêng."
- MST 13 chữ số bị reject với cùng error code ERR-REG-01a.

### Kết quả thực tế

- Inline error: "MST phải là 10 hoặc 13 chữ số" → cho phép 13 chữ số.
- MST 13 chữ số (vd `1234567890123`) sẽ pass FE validation.

### Bằng chứng

**SRS local quote** (`srs-fr-10-quan-tri.md` line 1032):
```
| 2 | ma_so_thue | text | Y | Unique toàn hệ thống — khóa định danh DN xuyên suốt; regex `^\d{10}$` (10 chữ số, theo TT 105/2020/TT-BTC Điều 5 — đơn vị độc lập). Chi nhánh / VPĐD / địa điểm KD (MST 13 chữ số) không tự đăng ký riêng — đăng ký qua DN mẹ. |
```

**SRS line 1074 ERR-REG-01a:**
```
| E1 | Mã số thuế sai định dạng (không phải 10 chữ số) | ERR-REG-01a | "Mã số thuế phải đúng 10 chữ số (theo TT 105/2020/TT-BTC). Chi nhánh không tự đăng ký riêng." | ERROR |
```

**Severity:** Major — vi phạm rule pháp lý. Chi nhánh đăng ký TK riêng tách khỏi DN mẹ → mất kiểm soát multi-tenant + cycle data integrity.

---

## BUG-FR22-004 — BE thêm validation MST checksum không có trong SRS

### Mô tả

BE áp dụng thuật toán checksum MST theo TT 105/2020 (weighted sum + mod 11). SRS line 1032 chỉ quy định `regex ^\d{10}$` — KHÔNG yêu cầu checksum. MST `1234567890` (10 chữ số valid format) bị BE reject với errCode `ERR-VAL-SYS-00-01` "Mã số thuế không hợp lệ (sai checksum 10 ký tự)".

### Các bước tái hiện

1. Fill form với MST `1234567890` (10 chữ số nhưng sai checksum) + đầy đủ các field khác.
2. Submit.

### Kết quả mong đợi (theo SRS)

- BE 201 Created (chỉ check regex `^\d{10}$` per SRS line 1032).
- Hoặc nếu BA chốt thêm checksum rule → bổ sung SRS spec.

### Kết quả thực tế

```
POST /api/v1/auth/register-doanh-nghiep
Status: 422
Response: {"code":"ERR-VAL-SYS-00-01","field":"maSoThue","message":"Mã số thuế không hợp lệ (sai checksum 10 ký tự)"}
```

### Bằng chứng

**SRS quote** không có rule checksum:
```
| 2 | ma_so_thue | text | Y | regex `^\d{10}$` |
```

**Severity:** Medium — defensive design hợp lý (TT 105/2020 quy định format MST có checksum), nhưng KHÔNG có spec authorization. Cần BA confirm bổ sung SRS hay drop rule.

---

## BUG-FR22-001 — UI thiếu ô Tên đăng nhập readonly + message token expire mismatch

### Mô tả

Hai issue UI nhỏ:

**(a)** SRS AC line 1090: "DN nhập MST đúng 10 chữ số → ô 'Tên đăng nhập' auto cập nhật hiển thị giá trị MST (readonly)". Form hiện tại CHỈ có tooltip text "Tên đăng nhập của bạn sẽ là Mã số thuế của doanh nghiệp" — KHÔNG có ô input readonly hiển thị value.

**(b)** Sau register success, message: "Đăng ký doanh nghiệp thành công. Vui lòng kiểm tra email để kích hoạt tài khoản (hiệu lực 24 giờ)". SRS line 1280 quote: token activation = "vĩnh viễn nếu là kích hoạt lần đầu (TK ở CHO_KICH_HOAT)" — không phải 24 giờ.

### Các bước tái hiện

1. Navigate `/register/doanh-nghiep`.
2. Quan sát form — không có ô "Tên đăng nhập".
3. Submit happy path → quan sát message confirmation "hiệu lực 24 giờ".

### Kết quả mong đợi

- (a) Form có ô "Tên đăng nhập" readonly auto fill = MST khi user nhập.
- (b) Message: "hiệu lực vĩnh viễn cho kích hoạt lần đầu" hoặc bỏ time hint.

### Bằng chứng

**SRS line 1090:**
```
**Given** DN nhập MST đúng 10 chữ số **When** đang nhập **Then** ô "Tên đăng nhập" auto cập nhật hiển thị giá trị MST (readonly)
```

**SRS line 1280:**
```
| 3 | Sinh token reset (chuỗi ngẫu nhiên), lưu vào `token_reset_mk` + `token_het_han` của TAI_KHOAN. Hạn token: **vĩnh viễn nếu là kích hoạt lần đầu** (TK ở CHO_KICH_HOAT) — phù hợp với TVV/NHT có thể chậm kích hoạt; **30 phút nếu là reset** (TK đang HOAT_DONG) |
```

**Severity:** Minor — UI usability. (a) Tooltip cũng đủ thông tin; (b) message expire timing có thể là UX choice (BE thực tế giới hạn 24h hay không cần verify).

---

## BUG-FR22-003 — errCode mismatch SRS

### Mô tả

SRS định nghĩa 6 errCode `ERR-REG-01..06` cho FR-VIII-22. BE thực tế dùng convention khác `ERR-VAL-VIII-22-XX` / `ERR-VAL-SYS-00-XX`. Pattern giống BUG-VT-008 (R7.7.8e Vai trò).

### Các bước tái hiện

| TC | Trigger | SRS errCode | BE actual |
|---|---|---|---|
| TC03 | MST trùng | ERR-REG-01 | ERR-VAL-VIII-22-08 |
| TC02 | MST sai format | ERR-REG-01a | ERR-VAL-SYS-00-01 (trên field) |
| TC04 | Email trùng | ERR-REG-02 | (chưa verify do rate-limit) |
| TC05 | MK yếu | ERR-REG-04 | (FE block — không tới BE) |
| TC06 | MK confirm khác | ERR-REG-05 | (FE block) |
| TC07 | Chưa cam kết | ERR-REG-06 | (FE block) |
| TC08 | Quy mô-lao động | (n/a SRS) | WRN-DN-01 |

### Bằng chứng

**TC03 actual response:**
```json
{"code":"ERR-VAL-VIII-22-08","message":"Mã số thuế này đã đăng ký trong hệ thống"}
```

**Severity:** Minor — message Tiếng Việt đúng, chỉ code mismatch. FE parse message OK nhưng nếu FE muốn map errCode → field highlight thì sai.

---

## BUG-FR22-005 — BE warning WRN-DN-01 quy mô-lao động không có trong SRS

### Mô tả

BE áp rule kiểm tra quy mô khớp lao động/doanh thu/nguồn vốn theo NĐ 39/2018. Nếu user chọn "Nhỏ" nhưng lao động = 0 → BE 400 với code `WRN-DN-01` "Quy mô 'Nhỏ' không khớp với số liệu lao động/doanh thu/nguồn vốn (gợi ý: 'Siêu nhỏ'). Bạn có muốn vẫn lưu không?". SRS FR-VIII-22 §Error Handling chỉ có 6 errors ERR-REG-01..06 — KHÔNG có WRN-DN-01.

### Các bước tái hiện

1. Submit form happy path nhưng:
   - Số lao động = 0
   - Doanh thu = 0
   - Tổng nguồn vốn = 0
   - Quy mô = "Nhỏ"

### Kết quả thực tế

```
POST /api/v1/auth/register-doanh-nghiep
Status: 400
Response: {"code":"WRN-DN-01","field":"quyMo","message":"Quy mô 'Nhỏ' không khớp với số liệu lao động/doanh thu/nguồn vốn (gợi ý: 'Siêu nhỏ'). Bạn có muốn vẫn lưu không?","suggested":"SIEU_NHO"}
```

### Severity

Minor — defensive design quality validation, nhưng KHÔNG có spec authorization trong FR-VIII-22. Có thể được spec ở FR-V.III-01 (DN entity) — cần BA cross-reference. Workaround: chọn quy mô đúng → submit pass.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/register/doanh-nghiep |
| API | `/api/v1/auth/register-doanh-nghiep` (POST) |
| Rate limit | 3 requests / 60 seconds per IP |
| TK created | `fd10f07c-fe9c-4883-83bc-ed245f38939b` (MST 1234567893) |

---

*Bug report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
