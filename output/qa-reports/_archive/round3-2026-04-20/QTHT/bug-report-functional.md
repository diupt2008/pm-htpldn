# Bug Report — Functional Test QTHT (FR-10)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN (Hỗ trợ Pháp lý Doanh nghiệp) |
| **Phiên bản** | Deploy 2026-04-20 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | Claude + curl API |
| **Ngày** | 2026-04-20 17:16-17:55 ICT |
| **Loại test** | Functional (Lệnh 4) |
| **Round** | Round 3 |
| **Tài liệu tham chiếu** | [functional-test-report.md](functional-test-report.md), [7.10-quan-tri-he-thong.md](../../../funtion/7.10-quan-tri-he-thong.md) |

---

## Tổng hợp

Phát hiện **6 bug + 3 observation** trong functional test module QTHT (32 TC, 22 PASS, 1 FAIL, 4 PARTIAL, 5 BLOCKED).

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 6    | 0        | 2     | 0      | 4     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-QT-001 | Major | P1 | UI/UX | QTHT/Login | QT-004 | Lock message hiển thị "Vui lòng thử lại sau **0 phút**" | Open |
| BUG-QT-002 | Major | P1 | Data/BR | QTHT/Audit | QT-026 | Audit log thiếu `oldValue`/`newValue` — vi phạm BR-DATA-05 | Open |
| BUG-QT-003 | Minor | P2 | API contract | QTHT/TK | QT-023 | PATCH /tai-khoan/{id}/trang-thai response `data: null` | Open |
| BUG-QT-004 | Minor | P3 | API contract | QTHT/Danh mục | QT-015/016/020 | API param naming inconsistent (search/sortOrder/update endpoint) | Open |
| BUG-QT-005 | Minor | P2 | Data/Spec | QTHT/SLA | QT-027 | canhBao2PhanTram=90% (spec yêu cầu 80%) | Open |
| BUG-QT-006 | Minor | P2 | Data/Audit | QTHT/Audit | QT-025/026 | Audit log `entityType=UNKNOWN` cho sub-resource PATCH | Open |

---

## BUG-QT-001 — Lock message "Vui lòng thử lại sau 0 phút"

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX (error message) |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Login |
| **Thành phần** | API `/api/v1/auth/login` (BE) — message formatter cho `ERR-AUTH-LOCKED-01` |
| **URL** | POST /api/v1/auth/login |
| **Tài khoản** | qa_tamkhoa_01 (đã TAM_KHOA) |
| **TC Reference** | QT-004 |
| **SRS Reference** | FR-VIII-20 / BR-AUTH-07 (khóa 30 phút) |
| **Assignee** | BE Team |

### Mô tả

Khi login vào tài khoản đã bị khóa (trạng thái `TAM_KHOA`), BE trả thông báo `"Tài khoản tạm khóa. Vui lòng thử lại sau 0 phút."`. Giá trị **0 phút** không có nghĩa với user — nên hiển thị số phút thực còn lại hoặc bỏ luôn phần thời gian nếu không tính được.

### Các bước tái hiện

1. POST `/api/v1/auth/login` với body `{"username":"qa_tamkhoa_01","password":"Test@1234"}`
2. Quan sát response

### Kết quả mong đợi

```json
{
  "success": false,
  "error": {
    "code": "ERR-AUTH-LOCKED-01",
    "message": "Tài khoản tạm khóa. Vui lòng thử lại sau 30 phút.",
    "details": {...}
  }
}
```

Hoặc nếu lock đã gần hết: `"Vui lòng thử lại sau 2 phút"` hoặc `"sau X giây"` nếu <1 phút.

### Kết quả thực tế

```json
{
  "success": false,
  "error": {
    "code": "ERR-AUTH-LOCKED-01",
    "message": "Tài khoản tạm khóa. Vui lòng thử lại sau 0 phút.",
    "timestamp": "2026-04-20T09:20:...",
    "requestId": "..."
  }
}
```

### Tác động

- **User confusion:** "0 phút" khiến user nghĩ có thể login ngay, retry → vẫn bị chặn → confuse
- **Support overhead:** help desk sẽ nhận câu hỏi "tại sao báo 0 phút nhưng vẫn không login được"
- **Spec mismatch:** BR-AUTH-07 yêu cầu khóa 30 phút. User không biết còn bao lâu

### Nguyên nhân nghi ngờ (Root Cause)

2 giả thuyết:
- **H1:** Integer division `remaining_seconds / 60` → khi còn <60s hiển thị 0. Fix: hiển thị giây hoặc `Math.ceil`.
- **H2:** Lock đã expire (>30 phút) nhưng BE vẫn chặn login + trả 0 → logic mở khóa sau 30 phút chưa chạy.

Kiểm tra bảng `tai_khoan_login_attempts` hoặc tương đương: `locked_until` timestamp.

### Gợi ý sửa (Suggested Fix)

```ts
const remainingMs = lockedUntil.getTime() - Date.now();
if (remainingMs <= 0) {
  // unlock + allow login
  await unlockAccount(userId);
  return proceedWithLogin();
}
const remainingMin = Math.ceil(remainingMs / 60000);
const text = remainingMin > 0
  ? `Vui lòng thử lại sau ${remainingMin} phút.`
  : `Vui lòng thử lại sau ${Math.ceil(remainingMs / 1000)} giây.`;
```

---

## BUG-QT-002 — Audit log thiếu oldValue/newValue (vi phạm BR-DATA-05)

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data integrity / Compliance |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Nhật ký hệ thống |
| **Thành phần** | `src/modules/audit-log/*` hoặc tương đương; schema bảng `audit_logs` |
| **URL** | GET /api/v1/audit-logs |
| **Tài khoản** | qtht_tw (QTHT_TW) |
| **TC Reference** | QT-026 |
| **SRS Reference** | FR-VIII-28, BR-DATA-05 (audit log phải có old/new value) |
| **Assignee** | BE Team |

### Mô tả

GET `/api/v1/audit-logs` trả về 15 fields metadata (user, timestamp, entity, action, endpoint, ipAddress, sessionId...) **nhưng không có field `oldValue`/`newValue`/`diff`/`giaTriCu`/`giaTriMoi`**. BR-DATA-05 yêu cầu audit log phải capture snapshot trước/sau của entity khi UPDATE để trace được "ai đã đổi gì thành gì".

### Các bước tái hiện

1. Login qtht_tw → thực hiện 1 UPDATE entity (vd: PATCH danh-muc hoặc PUT tai-khoan/vai-tro)
2. GET `/api/v1/audit-logs?pageSize=5`
3. Kiểm tra fields có trong response

### Kết quả mong đợi

Mỗi audit entry với `hanhDong=UPDATE` có **đủ 7 fields theo BR-DATA-05**:
```json
{
  "id": "...",
  "nguoiThucHienId": "...",
  "thoiGian": "...",
  "hanhDong": "UPDATE",
  "entityType": "DANH_MUC",
  "entityId": "...",
  "oldValue": { "ten": "Tên cũ", "trangThai": "KICH_HOAT", ... },
  "newValue": { "ten": "Tên mới", "trangThai": "KICH_HOAT", ... },
  "diff": ["ten"]
}
```

### Kết quả thực tế

```json
{
  "id": "fc6d09c5-...",
  "entityType": "TAI_KHOAN",
  "entityId": "d6f6f113-...",
  "hanhDong": "LOGIN",
  "nguoiThucHienId": "d6f6f113-...",
  "thoiGian": "2026-04-20T09:28:15.147Z",
  "ipAddress": "127.0.0.1",
  "endpoint": null,
  "responseCode": null,
  "sessionId": "...",
  "module": "...",
  "nguoiThucHienUsername": "qtht_tw",
  "nguoiThucHienHoTen": "...",
  "nguoiThucHienVaiTro": "QTHT_TW"
}
```

**Missing:** `oldValue`, `newValue`, `diff` — không có cách query giá trị cũ/mới qua API.

### Tác động

- **Compliance risk:** BR-DATA-05 là yêu cầu bắt buộc theo SRS. Audit không đủ thông tin = fail audit trail cho security/legal
- **Debugging impossible:** khi xảy ra sự cố "ai đổi giá trị X thành Y", QTHT/DevOps không trace được
- **Accountability gap:** chỉ biết "ai làm gì" nhưng không biết "đổi gì thành gì" → không đủ để forensics

### Nguyên nhân nghi ngờ

- `audit_logs` table schema chưa có columns `old_value` / `new_value` / `diff` (JSONB/TEXT)
- Audit interceptor/middleware chỉ capture request metadata, không capture entity snapshot trước/sau

### Gợi ý sửa

1. Schema migration thêm 3 cột:
```sql
ALTER TABLE audit_logs
  ADD COLUMN gia_tri_cu JSONB,
  ADD COLUMN gia_tri_moi JSONB,
  ADD COLUMN truong_thay_doi TEXT[];
```
2. Audit middleware (NestJS interceptor) wrap UPDATE actions:
   - Before UPDATE: load entity bằng id → serialize → `old_value`
   - After UPDATE: return entity → serialize → `new_value`
   - Diff 2 object → `truong_thay_doi` array
3. Expose trong GET /audit-logs response

---

## BUG-QT-003 — PATCH /tai-khoan/{id}/trang-thai response `data: null`

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | API contract inconsistency |
| **Status** | Open |
| **Module** | QTHT / Tài khoản state transition |
| **Thành phần** | API handler `PATCH /tai-khoan/{id}/trang-thai` |
| **TC Reference** | QT-023 |
| **SRS Reference** | FR-VIII-15 |
| **Assignee** | BE Team |

### Mô tả

Khi gọi `PATCH /api/v1/tai-khoan/{id}/trang-thai` với `{hanhDong, lyDo}`, response trả `{"success":true, "data":null, "meta":null}` dù transition thành công. Các endpoint CRUD khác (POST /tai-khoan, PATCH /danh-muc/{id}) đều echo entity updated trong response.

### Bằng chứng

```bash
curl -X PATCH -H "Authorization: Bearer <JWT>" \
  -d '{"hanhDong":"KHOA","lyDo":"..."}' \
  /api/v1/tai-khoan/<id>/trang-thai
```

Response:
```json
{
  "success": true,
  "data": null,
  "meta": null
}
```

Verify state bằng GET sau đó → `trangThai=TAM_KHOA` (transition thật đã xảy ra).

### Tác động

- **FE phải gọi thêm 1 GET** sau mỗi transition để có state mới → extra latency
- **Inconsistent contract** — client code phải handle đặc biệt cho endpoint này

### Gợi ý sửa

Return updated entity trong response body:
```ts
async changeState(id: string, dto: ChangeStateDto) {
  const updated = await this.service.changeState(id, dto);
  return { success: true, data: updated };  // echo entity
}
```

---

## BUG-QT-004 — API contract inconsistencies (param naming + HTTP method)

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | API contract / Developer experience |
| **Status** | Open |
| **Module** | QTHT / Danh mục + Tài khoản |
| **TC Reference** | QT-015, QT-016, QT-020 |
| **Assignee** | BE Team + API docs |

### Mô tả

3 inconsistencies phát hiện:

1. **Search param naming không chuẩn:**
   - `search=...` → works (1 result for "thue")
   - `name=...` → works (12 results — filter loose khác)
   - `keyword`, `tuKhoa`, `q` → HTTP 400 Bad Request
2. **sortOrder case-sensitive:**
   - `sortOrder=asc` (lowercase) → HTTP 400 với msg "sortOrder must be one of ASC, DESC"
   - `sortOrder=ASC` (UPPERCASE) → PASS
3. **Update entity endpoint không chuẩn REST:**
   - PATCH `/tai-khoan/{id}` → HTTP 404 "Cannot PATCH"
   - PUT `/tai-khoan/{id}` → HTTP 422 require `version` param
   - PUT `/tai-khoan/{id}/vai-tro` → 200 (dedicated sub-resource endpoint)

### Tác động

- FE developers phải trial-and-error khi integrate → slow down delivery
- Không có OpenAPI/Swagger rõ ràng → onboard dev mới tốn thời gian
- Inconsistent giữa `search` vs `name` → khó document semantics

### Gợi ý sửa

1. **Standardize search param** → thống nhất 1 tên (đề xuất `search` với full-text match trên ten+moTa+ma, remove `name`)
2. **Accept cả lowercase lẫn uppercase** cho sortOrder, hoặc validate thân thiện hơn
3. **Restore PATCH /tai-khoan/{id}** cho generic update, giữ PUT /tai-khoan/{id}/vai-tro làm optimization cho assign roles
4. **Publish OpenAPI spec** → tự động generate docs + client SDK

---

## BUG-QT-005 — SLA canhBao2PhanTram = 90% (spec yêu cầu 80%)

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Data / Spec mismatch |
| **Status** | Open |
| **Module** | QTHT / Cấu hình SLA |
| **Thành phần** | Seed data cau_hinh_sla table hoặc migration |
| **TC Reference** | QT-027 |
| **SRS Reference** | SM-QT-31 smoke spec + BR-SLA (cảnh báo 50% / **80%** / 100%) |
| **Assignee** | BE Team + PM |

### Mô tả

Smoke spec `SM-QT-31` ghi rõ 4 seed entries với **canhBao1=50%** + **canhBao2=80%**. Thực tế GET `/api/v1/cau-hinh/sla` trả `canhBao2PhanTram=90` cho cả 3 loại YC.

### Bằng chứng

```json
{
  "loaiYeuCau": "HOI_DAP",
  "thoiHanNgay": 10,              // spec: 5 ngày
  "canhBao1PhanTram": 50,          // ✅ khớp
  "canhBao2PhanTram": 90,          // ❌ spec yêu cầu 80
  "quaHanHeSo": 2,
  ...
}
```

**Cũng note:** `thoiHanNgay` cho HOI_DAP = 10 ngày, spec yêu cầu 5 ngày — cần double-check.

### Tác động

- Nếu BR-SLA dùng 80% làm mốc cảnh báo tự động → email cảnh báo sẽ gửi muộn hơn 10% so với SRS
- Compliance: người dùng sẽ nhận cảnh báo tại 90% → gần quá hạn mới biết

### Gợi ý sửa

Quyết định:
- **Option A:** Update seed data cập nhật `canhBao2PhanTram=80` + `thoiHanNgay=5` cho HOI_DAP theo spec SM-QT-31
- **Option B:** Nếu sản phẩm đã quyết 90% — update SRS + smoke spec

PM + BE align, chọn 1 option.

---

## BUG-QT-006 — Audit log entityType=UNKNOWN cho sub-resource PATCH

| Trường | Chi tiết |
|--------|----------|
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Data / Audit |
| **Status** | Open |
| **Module** | QTHT / Nhật ký hệ thống |
| **Thành phần** | Audit middleware entity resolver |
| **TC Reference** | QT-025, QT-026 |
| **Assignee** | BE Team |

### Mô tả

Sau khi gọi `PATCH /api/v1/tai-khoan/{id}/trang-thai`, audit log record có:
- `hanhDong = UPDATE` ✅
- `entityType = UNKNOWN` ❌ (expected `TAI_KHOAN`)
- `endpoint = "PATCH /api/v1/tai-khoan/{id}/trang-thai"` ✅

Entity type resolver không parse được sub-resource URL (có segment sau `{id}`).

### Tác động

- Filter audit log theo `entityType=TAI_KHOAN` sẽ **miss các action** state transition
- Dashboard/report thống kê UPDATE per entity → số liệu sai

### Gợi ý sửa

Cải thiện entity resolver — parse URL pattern:
```ts
// /api/v1/{resource-plural}/{id}[/{action}]
const resourceMatch = req.url.match(/\/api\/v1\/([a-z-]+)\/[^/]+/);
if (resourceMatch) {
  const resourceMap = {
    'tai-khoan': 'TAI_KHOAN',
    'danh-muc': 'DANH_MUC',
    'vai-tro': 'VAI_TRO',
    // ...
  };
  entityType = resourceMap[resourceMatch[1]] || 'UNKNOWN';
}
```

---

## Observations (không block, cần verify)

### OBS-QT-001 — Auto-lock counter trigger sớm

Đã ghi nhận ở [data-readiness-report.md Checkpoint log](data-readiness-report.md). TK mới tạo `qa_autolock_01` trả "tạm khóa do sai quá nhiều lần" ngay lần login đầu. Có thể counter share cross-creation theo IP. Xem [dev-seed-request.md OBS-QT-001](dev-seed-request.md).

### OBS-QT-002 — Enum CHO_PHAN_QUYEN vs VO_HIEU_HOA

Smoke đã ghi nhận: FE render tab `CHO_PHAN_QUYEN` nhưng BE validation reject (422). BE accept `VO_HIEU_HOA`. Xem [bug-report-smoke-test.md BUG-SMOKE-TK-001](bug-report-smoke-test.md).

### OBS-QT-003 — Đơn vị flat list (không tree 3 cấp)

Đã ghi nhận ở [data-readiness-report.md §3.2 note đơn vị](data-readiness-report.md). 84 đơn vị có `capDonVi=null`, `donViId=null`. Spec SM-QT-12 yêu cầu tree TW→BN→DP.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL | http://103.172.236.130:3000/ |
| OTP | `666666` bypass |
| API base | http://103.172.236.130:3000/api/v1 |
| Auth | JWT Bearer (15 phút TTL) + OTP email |
| Backend | NestJS + PostgreSQL (suy luận từ error pattern + entity shape) |
| Frontend | React + Vite + Ant Design + Zustand + CASL |

### B — Tài khoản sử dụng

| Username | Role | Cấp | Dùng cho bug nào |
|----------|------|-----|------------------|
| qtht_tw | QTHT_TW | TW | BUG-QT-002/003/004/005/006 (primary) |
| qa_tamkhoa_01 | CB_TW | TW | BUG-QT-001 (locked login) |
| qa_autolock_01 | CB_TW | TW | OBS-QT-001 |

### C — Danh mục ảnh chụp

| File | Mô tả | Bug Ref |
|------|-------|---------|
| [screenshots/qt009-danh-muc.png](screenshots/qt009-danh-muc.png) | Danh mục LINH_VUC_PL list | Context for QT-009..017 |
| [screenshots/taikhoan-03-page.png](screenshots/taikhoan-03-page.png) | Page Tài khoản (smoke context) | BUG-SMOKE-TK-001 related (OBS-QT-002) |

---

*Bug report generated: 2026-04-20 17:55 | QA Automation via Claude Code + curl API*
