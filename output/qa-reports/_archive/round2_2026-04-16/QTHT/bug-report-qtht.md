# Bug Report — Quản trị Hệ thống (QTHT)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 2026-04-17 |
| **Loại test** | Functional — Module Quản trị Hệ thống |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy.md](../../../test-strategy.md) §7.10, [functional-test-report-qtht.md](functional-test-report-qtht.md) |

---

## Tổng hợp

Phát hiện **11** lỗi trong quá trình test module Quản trị Hệ thống (32 test case, 29 thực thi được, 9 FAIL, 3 BLOCKED).

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 11   | 1        | 6     | 3      | 1     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-QTHT-006 | Critical | P0 | Validation | QTHT / Tài khoản | QT-028 | Hệ thống không validate độ mạnh mật khẩu — chấp nhận `Ab1`, `12345678`, `password` | Open |
| BUG-QTHT-005 | Major | P0 | Data | QTHT / Tài khoản | QT-020, QT-023 | PUT /tai-khoan silent no-op cho `vaiTroIds` và `trangThai` | Open |
| BUG-QTHT-001 | Major | P1 | Workflow | QTHT / Auth | QT-006 | Access token TTL = 900s (15 phút) thay vì 30 phút theo BR-AUTH-06 | Open |
| BUG-QTHT-002 | Major | P1 | Permission | QTHT / Auth | QT-008 | QTHT cho phép nhiều phiên đồng thời (phải chỉ 1) | Open |
| BUG-QTHT-003 | Major | P1 | Data | QTHT / Danh mục | QT-013 | Xóa danh mục đang được state-machine sử dụng mà không bị chặn | Open |
| BUG-QTHT-007 | Major | P1 | Permission | QTHT / Phân quyền | QT-031 | CB_PD (lanhdao_bn) liệt kê được danh sách TAI_KHOAN | Open |
| BUG-QTHT-008 | Major | P1 | Permission | QTHT / Phân quyền | QT-032 | DN/NHT liệt kê được danh sách VAI_TRO | Open |
| BUG-QTHT-010 | Major | P1 | Data | QTHT / Audit log | QT-025, QT-026 | Audit log không đầy đủ (lichSu.chiTiet rỗng) và thiếu endpoint global | Open |
| BUG-QTHT-004 | Medium | P2 | UI/UX | QTHT / Danh mục | QT-016 | sortOrder=DESC bị bỏ qua (trả ASC); lowercase trả mảng rỗng | Open |
| BUG-QTHT-009 | Medium | P2 | Data | QTHT / Auth | QT-001 | JWT claim `capDonVi=DP` của admin bất nhất với đơn vị (cap=TW) | Open |
| BUG-QTHT-011 | Medium | P2 | Permission | QTHT / Tài khoản | QT-024 | `/auth/forgot-password` không gửi email cho user CHO_KICH_HOAT, trả success (mislead) | Open |
| BUG-QTHT-012 | Minor | P3 | Data | QTHT / Danh mục | QT-017 | Chỉ 3/15 loại danh mục được seed data (thiếu LINH_VUC_PHAP_LUAT, QUY_MO_DN...) | Open |

> **Chú thích Type:** Permission = phân quyền role × entity × action | Data = toàn vẹn dữ liệu | Validation = validate input | Workflow = state/timing | UI/UX = hiển thị/tương tác.
>
> **Chú thích Severity:** Critical = vi phạm nghiệp vụ nghiêm trọng / lộ dữ liệu / block release | Major = chức năng quan trọng lỗi, có workaround | Medium = chức năng phụ | Minor = không ảnh hưởng nghiệp vụ.

---

## BUG-QTHT-006 — Hệ thống không validate độ mạnh mật khẩu

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-006 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Validation |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Quản lý tài khoản |
| **Thành phần** | `CreateTaiKhoanDto.matKhau` (backend) — validator class |
| **URL** | `POST /api/v1/tai-khoan` |
| **Trình duyệt** | n/a (API test) |
| **Tài khoản** | admin (QTHT_TW) |
| **TC Reference** | QT-028 |
| **SRS Reference** | BR-SEC-06 |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Khi tạo tài khoản mới, API chấp nhận mật khẩu yếu như `Ab1` (3 ký tự), `abcdefgh` (không chữ hoa, không số), `12345678` (chỉ số), `password`. Không có bất kỳ validation nào trên field `matKhau`.

### Các bước tái hiện

1. Login admin → lấy accessToken (xem Phụ lục A).
2. Gửi POST `/api/v1/tai-khoan` với body chứa `matKhau: "Ab1"`:
   ```bash
   curl -X POST http://103.172.236.130:3000/api/v1/tai-khoan \
     -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
     -d '{"username":"qa_pwd_001","email":"pwd001@test.vn","hoTen":"X",
          "loaiTaiKhoanId":"58f3aa92-721e-4890-a00c-5bf9e5a515fd",
          "donViId":"00000000-0000-4000-8000-000000000001",
          "matKhau":"Ab1",
          "vaiTroIds":["aaaaaaaa-0000-4000-8000-000000000008"]}'
   ```
3. Lặp lại step 2 với 7 biến thể: `abcdefgh`, `ABCDEFGH`, `12345678`, `abcdefg1`, `Password`, `Password1`, `password1`.
4. Quan sát: **tất cả** biến thể đều trả HTTP 201 (success).

### Kết quả mong đợi

- HTTP 400 với message `"Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"` (BR-SEC-06).
- Các mẫu `Ab1`, `abcdefgh`, `ABCDEFGH`, `12345678`, `abcdefg1`, `Password`, `password1` đều phải bị reject.
- Chỉ `Password1` (8 ký tự + hoa + thường + số) được chấp nhận.

### Kết quả thực tế

Tất cả 8/8 biến thể password đều tạo user thành công, trả HTTP 201. Ví dụ response với `matKhau:"Ab1"`:

```json
{
  "success": true,
  "data": {
    "id": "…",
    "username": "qa_pwd_001",
    "trangThai": "CHO_KICH_HOAT",
    "version": 1
  }
}
```

### Bằng chứng

| Password | Bytes | Độ dài | Có hoa? | Có thường? | Có số? | Response |
|----------|-------|--------|---------|------------|--------|----------|
| `Ab1` | 3 | 3 | ✓ | ✓ | ✓ | **201** — fail BR-SEC-06 (độ dài < 8) |
| `abcdefgh` | 8 | 8 | ✗ | ✓ | ✗ | **201** — fail (thiếu hoa + số) |
| `ABCDEFGH` | 8 | 8 | ✓ | ✗ | ✗ | **201** — fail (thiếu thường + số) |
| `12345678` | 8 | 8 | ✗ | ✗ | ✓ | **201** — fail (chỉ số) |
| `abcdefg1` | 8 | 8 | ✗ | ✓ | ✓ | **201** — fail (thiếu hoa) |
| `Password` | 8 | 8 | ✓ | ✓ | ✗ | **201** — fail (thiếu số) |
| `Password1` | 9 | 9 | ✓ | ✓ | ✓ | 201 (hợp lệ) |
| `password1` | 9 | 9 | ✗ | ✓ | ✓ | **201** — fail (thiếu hoa) |

### Tác động (Impact)

- **100% tài khoản mới tạo** có thể đặt mật khẩu yếu. Bao gồm cả tài khoản QTHT, CB_PD, CB_NV — tức toàn bộ hệ thống nội bộ có thể bị brute-force trong <1s với top-1000 password list.
- Vi phạm yêu cầu compliance release-gate (BR-SEC-06).
- Luồng đặt lại mật khẩu (UC116) và đổi mật khẩu (nếu có) có thể cùng thiếu validator — cần audit chung.

### Nguyên nhân nghi ngờ (Root Cause)

`CreateTaiKhoanDto.matKhau` trong backend (NestJS, class-validator) chỉ có `@IsString()` mà thiếu:

```ts
@MinLength(8)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
  message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
})
```

Hoặc có decorator nhưng ValidationPipe global không áp do thiếu `whitelist: true` / `forbidNonWhitelisted: true`.

### Gợi ý sửa (Suggested Fix)

```diff
 export class CreateTaiKhoanDto {
   @IsString()
+  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
+  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
+    message: 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
+  })
   matKhau: string;
 }
```

Đồng thời áp cùng validator cho:
- `ResetPasswordDto.matKhauMoi`
- `ChangePasswordDto.matKhauMoi` (nếu có)
- `UpdateTaiKhoanDto.matKhau` (nếu cho phép đổi)

---

## BUG-QTHT-005 — PUT /tai-khoan silent no-op cho vaiTroIds và trangThai

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-005 |
| **Severity** | Major |
| **Priority** | P0 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Quản lý tài khoản |
| **Thành phần** | `TaiKhoanController.update` + `UpdateTaiKhoanDto` (backend) |
| **URL** | `PUT /api/v1/tai-khoan/{id}` |
| **Tài khoản** | admin (QTHT_TW) |
| **TC Reference** | QT-020, QT-023 |
| **SRS Reference** | UC 111-115 |
| **Assignee** | Backend Team |

### Mô tả

Gọi PUT `/api/v1/tai-khoan/{id}` với body `{"vaiTroIds": [...], "version": N}` hoặc `{"trangThai": "BI_KHOA", "version": N}` trả `success: true` với `data.version` không đổi. Field `vaiTros[]` và `trangThai` trong DB không thay đổi. Audit log (`lichSu[]`) ghi event UPDATE với `chiTiet: {}` (rỗng) — tức là endpoint nhận yêu cầu nhưng âm thầm bỏ qua hai field này.

### Các bước tái hiện

1. Tạo user qa_test_user với role `CB_TW` (vaiTroId `aaaaaaaa-0000-4000-8000-000000000008`), trạng thái `CHO_KICH_HOAT`, version=1.
2. PUT `/api/v1/tai-khoan/{id}` với body:
   ```json
   {"hoTen":"QA v3","version":1}
   ```
   → thành công, version = 2, hoTen đổi. (Baseline OK.)
3. PUT tiếp với body:
   ```json
   {"vaiTroIds":["aaaaaaaa-0000-4000-8000-000000000002",
                 "aaaaaaaa-0000-4000-8000-000000000008"],
    "version":2}
   ```
   → API trả `success: true`, nhưng response `data.version` vẫn là 2 (không tăng), `vaiTros[]` vẫn chỉ chứa CB_TW.
4. GET lại → roles vẫn `["CB_TW"]`, không có QTHT_TW.
5. PUT với `{"trangThai":"BI_KHOA","version":3}` → `success: true`, `data.trangThai: "CHO_KICH_HOAT"` (không đổi).

### Kết quả mong đợi

- Step 3: roles sau update = `[QTHT_TW, CB_TW]`; version tăng lên 3; lichSu ghi UPDATE với chiTiet chứa old/new vaiTroIds.
- Step 5: trangThai = `BI_KHOA`; version tăng; user không login được.

### Kết quả thực tế

- Step 3 API response: `{"success":true,"data":{"version":2,"vaiTros":[{"maVaiTro":"CB_TW"}]}}`.
- Step 5 API response: `{"success":true,"data":{"trangThai":"CHO_KICH_HOAT"}}`.
- Không có exception, không có warning — silent ignore.

### Bằng chứng

```bash
# Step 3 — Request
curl -X PUT "$URL/api/v1/tai-khoan/7c8f13a4-…" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"vaiTroIds":["aaaaaaaa-0000-4000-8000-000000000002"], "version":2}'

# Step 3 — Response
{"success":true,"data":{"id":"7c8f13a4-…","version":2, ... }}
#                                              ^^^ không tăng

# GET sau update
curl "$URL/api/v1/tai-khoan/7c8f13a4-…" -H "Authorization: Bearer $TOKEN"
# {"data":{"version":2,"vaiTros":[{"maVaiTro":"CB_TW"}]}, ...}
# roles KHÔNG đổi

# lichSu entries
"lichSu": [
  {"hanhDong":"UPDATE","chiTiet":{},"thoiGian":"2026-04-17T04:54:08.662Z"},
  {"hanhDong":"UPDATE","chiTiet":{"hoTen":"QA v3"},"thoiGian":"2026-04-17T04:53:35.626Z"}
]
# chiTiet:{} cho các call vaiTroIds / trangThai
```

### Tác động (Impact)

- **Flow gán vai-trò** (QT-020) không hoạt động → admin không thể promote/demote user sau khi tạo.
- **Flow khoá tài khoản** (QT-023) không hoạt động → không có cách khoá user bị compromise ngoài chờ 5 lần sai mật khẩu. Nghiêm trọng về mặt security incident response.
- API response `success: true` gây hiểu lầm → admin tưởng đã làm xong việc, thực tế không.
- Audit log bị sai (ghi UPDATE rỗng) → không thể forensic ai đã làm gì.

### Nguyên nhân nghi ngờ (Root Cause)

`UpdateTaiKhoanDto` trong NestJS dùng `whitelist: true` trong ValidationPipe — các field không khai báo trong DTO bị strip. Nếu `vaiTroIds` và `trangThai` không nằm trong DTO, chúng bị loại bỏ âm thầm trước khi vào service. Service sau đó gọi `repository.save(dto)` chỉ với các field còn lại (ví dụ hoTen chưa đổi) → row không modify, version không tăng, nhưng `@AfterUpdate` hook vẫn log UPDATE.

Ngoài ra, việc update vaiTroIds là quan hệ M-N (bảng `tai_khoan_vai_tro`), không thể làm trong một `save()` đơn giản — cần service riêng.

### Gợi ý sửa (Suggested Fix)

**Option 1 (nhanh — chấp nhận trong PUT chính):**

```diff
 export class UpdateTaiKhoanDto {
   @IsOptional() @IsString() hoTen?: string;
   @IsOptional() @IsEmail() email?: string;
+  @IsOptional() @IsArray() @ArrayMinSize(1)
+  @IsUUID(4, { each: true })
+  vaiTroIds?: string[];
+  @IsOptional() @IsEnum(['HOAT_DONG','BI_KHOA','CHO_KICH_HOAT','DA_XOA'])
+  trangThai?: string;
   @IsInt() version: number;
 }
```

Service:
```ts
async update(id, dto) {
  return this.dataSource.transaction(async (mgr) => {
    const user = await mgr.findOne(TaiKhoan, { where: { id, version: dto.version }});
    if (!user) throw new ConflictException('Optimistic lock...');
    Object.assign(user, _.omit(dto, ['vaiTroIds','version']));
    user.version += 1;
    await mgr.save(user);
    if (dto.vaiTroIds) {
      await mgr.delete(TaiKhoanVaiTro, { taiKhoanId: id });
      await mgr.insert(TaiKhoanVaiTro, dto.vaiTroIds.map(vaiTroId => ({ taiKhoanId: id, vaiTroId })));
    }
    await this.auditService.log({ action:'UPDATE', entityId:id, old, new: dto });
    return this.findOne(id);
  });
}
```

**Option 2 (theo REST best practice — endpoint riêng):**

- `PUT /api/v1/tai-khoan/{id}/vai-tro` body `{vaiTroIds:[...]}`
- `POST /api/v1/tai-khoan/{id}/khoa` body `{lyDo: "..."}`
- `POST /api/v1/tai-khoan/{id}/kich-hoat`

---

## BUG-QTHT-001 — Access token TTL 15 phút thay vì 30 phút

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Auth |
| **Thành phần** | `AuthModule.JwtModule.register({ signOptions: { expiresIn } })` |
| **URL** | `POST /api/v1/auth/verify-otp` |
| **TC Reference** | QT-006 |
| **SRS Reference** | BR-AUTH-06 |
| **Assignee** | Backend Team |

### Mô tả

accessToken JWT trả về từ `/auth/verify-otp` có `exp - iat = 900` giây (15 phút). BR-AUTH-06 yêu cầu session timeout 30 phút idle.

### Các bước tái hiện

1. Login admin → verify-otp → lấy accessToken.
2. Decode payload (base64 phần thứ 2 của JWT):
   ```json
   {"iat": 1776401240, "exp": 1776402140, "sub": "...", "vaiTro": ["QTHT_TW"]}
   ```
3. `exp - iat = 900` giây = **15 phút**.

### Kết quả mong đợi

`exp - iat = 1800` (30 phút), HOẶC có refresh-token để reissue access-token khi idle < 30 phút.

### Kết quả thực tế

Token hết hạn sau 15 phút và không có refresh-token trong response. User phải login (kèm OTP) lại sau 15 phút — gấp đôi tần suất spec.

### Bằng chứng

Response verify-otp:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ…",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

### Tác động (Impact)

- UX tệ: user phải đăng nhập 2-factor mỗi 15 phút, làm gián đoạn công việc của cán bộ xử lý hồ sơ.
- Không khớp spec → regression test tự động có thể pass/fail không ổn định.

### Gợi ý sửa (Suggested Fix)

```diff
 // auth.module.ts
 JwtModule.register({
   secret: ...,
-  signOptions: { expiresIn: '15m' },
+  signOptions: { expiresIn: '30m' },
 })
```

Hoặc triển khai refresh-token flow: issue refresh-token 7 ngày, access-token vẫn 15 phút nhưng auto-renew nếu refresh-token còn hạn.

---

## BUG-QTHT-002 — QTHT cho phép nhiều phiên đồng thời

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Auth |
| **Thành phần** | `AuthService.createSession()` hoặc `SessionGuard` |
| **URL** | `POST /api/v1/auth/verify-otp` |
| **TC Reference** | QT-008 |
| **Assignee** | Backend Team |

### Mô tả

Login admin 2 lần liên tiếp → cả 2 token đều valid, `GET /auth/sessions` trả về 2 session active. Policy spec: QTHT chỉ được 1 session đồng thời (để giảm risk nếu token bị lộ).

### Các bước tái hiện

1. Login admin lần 1 → T1.
2. Login admin lần 2 → T2.
3. GET `/api/v1/auth/me` với T1 → kỳ vọng 401, thực tế 200 success.
4. GET `/api/v1/auth/sessions` với T2 → kỳ vọng 1 session, thực tế 2 session.

### Kết quả mong đợi

- Step 3: T1 đã bị revoke (session cũ bị kill khi login mới) → 401 "Token has been revoked".
- Step 4: chỉ 1 session active (session mới, is_current=true).

### Kết quả thực tế

```json
// Step 3: GET /auth/me with T1
{"success":true,"data":{"userId":"…000099","vaiTro":["QTHT_TW"]}}

// Step 4: GET /auth/sessions with T2
{"success":true,"data":[
  {"session_id":"f89f4ccc-…","is_current":true,"created_at":"2026-04-17T04:48:16.433Z"},
  {"session_id":"5d2fcfd6-…","is_current":false,"created_at":"2026-04-17T04:47:20.371Z"}
]}
```

### So sánh (Comparison)

| Role | Login lần 2 → session cũ | Login lần 4 → hủy cũ nhất |
|------|---------------------------|---------------------------|
| CB_NV (canbo_bn) | Giữ (limit=3) | Hủy session 1 ✅ |
| QTHT_TW (admin) | **Giữ (BUG — phải kill)** | Chưa test nhưng presumably giữ tới limit=3 |

### Tác động (Impact)

Chính sách "QTHT chỉ 1 session" được thiết kế để: nếu token QTHT bị lộ, admin login lại → token cũ bị kill. Hiện tại cả 2 token đều valid → attacker có thể tiếp tục dùng token cũ song song.

### Gợi ý sửa (Suggested Fix)

```diff
 // auth.service.ts
 async createSession(user: TaiKhoan, ...) {
-  const maxSessions = 3;
+  const isQtht = user.vaiTros.some(v => v.maVaiTro.startsWith('QTHT_'));
+  const maxSessions = isQtht ? 1 : 3;
   const activeSessions = await this.sessionRepo.find({ where: { userId: user.id, revokedAt: IsNull() }, order: { createdAt: 'ASC' } });
   while (activeSessions.length >= maxSessions) {
     const oldest = activeSessions.shift();
     await this.revokeSession(oldest.id);
   }
   return this.sessionRepo.save({ userId: user.id, ... });
 }
```

---

## BUG-QTHT-003 — Xóa danh mục state-machine không bị chặn

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Danh mục |
| **Thành phần** | `DanhMucService.softDelete()` |
| **URL** | `DELETE /api/v1/danh-muc/{id}` |
| **TC Reference** | QT-013 |
| **Assignee** | Backend Team |

### Mô tả

DELETE danh mục `TINH_TRANG_VU_VIEC/MOI_TAO` (state quan trọng của SM-VUVIEC) trả 204 No Content thành công, không có cảnh báo hay kiểm tra reference.

### Các bước tái hiện

1. GET `/api/v1/danh-muc?loaiDanhMuc=TINH_TRANG_VU_VIEC&ma=MOI_TAO` → lấy id.
2. DELETE `/api/v1/danh-muc/{id}` → 204.
3. GET lại → "Không tìm thấy danh mục" 404 (đã soft-delete).
4. Danh sách TINH_TRANG_VU_VIEC còn 11 (trước đó 12).

### Kết quả mong đợi

- HTTP 409 Conflict: `"Danh mục đang được sử dụng ở N bản ghi (vu_viec, hoi_dap, ...). Không thể xóa."`.
- Hoặc HTTP 403 với message "Không thể xóa danh mục hệ thống (isSystem=true)".

### Kết quả thực tế

`HTTP 204 No Content` — không body. Danh mục biến mất khỏi list.

### Tác động (Impact)

- Nếu đã có VU_VIEC ở state `MOI_TAO` → những bản ghi đó mất tham chiếu, UI có thể crash khi render.
- QTHT chỉ 1 click nhầm → phá vỡ state machine. Recovery khó (phải POST lại, nhưng id đã đổi → FK cũ vẫn broken).

### Gợi ý sửa (Suggested Fix)

Thêm precondition check trong `DanhMucService.softDelete`:

```ts
async softDelete(id: string) {
  const dm = await this.repo.findOne({ where: { id } });
  const refCount = await this.dataSource.query(`
    SELECT
      (SELECT COUNT(*) FROM vu_viec WHERE trang_thai = $1) +
      (SELECT COUNT(*) FROM hoi_dap WHERE trang_thai = $1) AS total
  `, [dm.ma]);
  if (refCount[0].total > 0) {
    throw new ConflictException(`Danh mục đang được sử dụng ở ${refCount[0].total} bản ghi.`);
  }
  // … proceed with soft-delete
}
```

Hoặc bật flag `isSystem` cho các danh mục core và block delete tuyệt đối.

---

## BUG-QTHT-007 — CB_PD thấy được danh sách TAI_KHOAN

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Phân quyền |
| **Thành phần** | `TaiKhoanController.findAll()` + CASL ability |
| **URL** | `GET /api/v1/tai-khoan` |
| **Tài khoản** | lanhdao_bn (role LANH_DAO_BN ≡ CB_PD) |
| **TC Reference** | QT-031 |
| **Assignee** | Backend Team |

### Mô tả

Role CB_PD (lanhdao_bn) gọi GET /tai-khoan → HTTP 200, trả 25 records chi tiết (username, email, hoTen, donVi). Theo SRS §7.10 QT-031, CB_PD chỉ được xem DANH_MUC, VAI_TRO, DON_VI — không có TAI_KHOAN.

### Các bước tái hiện

1. Login lanhdao_bn (`Test@1234`).
2. GET `/api/v1/tai-khoan?limit=50` với token → 200.
3. Response chứa 25 users, đầy đủ username/email/đơn vị.

### Kết quả mong đợi

HTTP 403 Forbidden với `{error.code: "ERR-PERM-SYS-00-01"}`.

### Kết quả thực tế

```json
{"success":true,"meta":{"total":25,"page":1,"pageSize":20},"data":[
  {"username":"qa_pwd_72982","email":"pwd_…@test.vn","donViTen":"Cục BTTP","loaiTaiKhoanTen":"Cán bộ"}, ...
]}
```

### So sánh (Comparison) — test ma trận phân quyền

| Role | GET /danh-muc | GET /vai-tro | GET /don-vi | GET /tai-khoan | POST /tai-khoan |
|------|---------------|--------------|-------------|----------------|-----------------|
| QTHT_TW (admin) | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 201 |
| CB_NV (canbo_bn) | ✅ 200 | ✅ 200 | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |
| CB_PD (lanhdao_bn) | ✅ 200 | ✅ 200 | ✅ 200 | **✅ 200 (BUG!)** | ❌ 403 (đúng) |
| DN (dn_user) | ✅ 200 | **✅ 200 (BUG — xem BUG-QTHT-008)** | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |
| NHT (nht_user) | ✅ 200 | **✅ 200 (BUG)** | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |

### Tác động (Impact)

Rò rỉ thông tin tài khoản nội bộ (username, email, đơn vị) cho CB_PD. Có 3 CB_PD trong hệ thống (TW/BN/DP). Nếu 1 CB_PD bị compromise, attacker enumerate toàn bộ user của hệ thống để chain-attack.

### Gợi ý sửa (Suggested Fix)

```diff
 @Controller('tai-khoan')
-@UseGuards(AuthGuard)
+@UseGuards(AuthGuard, RolesGuard)
 export class TaiKhoanController {
   @Get()
+  @Roles('QTHT_TW', 'QTHT_BN', 'QTHT_DP')
   findAll(@Query() query) { … }
 }
```

Hoặc nếu dùng CASL, audit `defineAbility()`:
```ts
if (user.vaiTros.some(r => r.startsWith('QTHT_'))) {
  can('read', 'TAI_KHOAN');
}
// KHÔNG cấp read cho LANH_DAO_* / CB_* / NHT / DN / TVV / CG
```

---

## BUG-QTHT-008 — DN/NHT thấy được danh sách VAI_TRO

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-008 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Phân quyền |
| **Thành phần** | `VaiTroController.findAll()` |
| **URL** | `GET /api/v1/vai-tro` |
| **Tài khoản** | dn_user (DOANH_NGHIEP), nht_user (NHT) |
| **TC Reference** | QT-032 |
| **Assignee** | Backend Team |

### Mô tả

Portal user DN và NHT đều gọi được GET /vai-tro → 200, trả 14 roles nội bộ (bao gồm cả QTHT_TW, LANH_DAO_TW, CB_BN...). SRS nói DN/NHT/TVV/CG chỉ thấy DANH_MUC + DON_VI.

### Các bước tái hiện

1. Login dn_user → lấy token.
2. GET `/api/v1/vai-tro?limit=20` → 200.
3. Repeat với nht_user → 200.

### Kết quả thực tế

```json
{"success":true,"meta":{"total":14},"data":[
  {"maVaiTro":"CB_BN","tenVaiTro":"Cán bộ BN"},
  {"maVaiTro":"CB_TW","tenVaiTro":"Cán bộ TW"},
  {"maVaiTro":"QTHT_TW","tenVaiTro":"Quản trị hệ thống TW"},
  {"maVaiTro":"LANH_DAO_TW","tenVaiTro":"Lãnh đạo TW"},
  ...
]}
```

### Tác động

Người dùng portal (DN, NHT, TVV, CG, GV) có thể enumerate internal role structure. Kết hợp với BUG-QTHT-007 (CB_PD thấy tai-khoan) → attacker chain:
1. Compromise DN account → biết danh sách role.
2. Social engineer / phishing nhắm vào tài khoản role QTHT.
3. Không có rate limit rõ ràng cho endpoint này.

### Gợi ý sửa

Giống BUG-QTHT-007:
```ts
@Get() @Roles('QTHT_*', 'CB_NV_*', 'CB_PD_*') findAll() { ... }
```

Hoặc nếu DN/NHT cần biết role name (để hiển thị "Cán bộ hỗ trợ bạn là ..."), cung cấp endpoint nội bộ `/api/v1/vai-tro/public` trả tập con sanitized (chỉ ma + ten, loại bỏ QTHT_*).

---

## BUG-QTHT-010 — Audit log không đầy đủ

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-010 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Audit |
| **Thành phần** | `AuditInterceptor` / `LichSuService` |
| **URL** | Nhiều — audit log ghi sai + thiếu endpoint global |
| **TC Reference** | QT-025, QT-026 |
| **SRS Reference** | UC 120-123 |
| **Assignee** | Backend Team |

### Mô tả

1. **Thiếu endpoint global audit log**: Đã thử 14 biến thể (`/nhat-ky`, `/audit-log`, `/audit`, `/nhat-ky-he-thong`, `/activity-log`, `/history`, `/logs`, ...) — tất cả trả 404.

2. **Per-entity lichSu không đầy đủ**: `tai-khoan/{id}.lichSu[]` tồn tại nhưng phần lớn entry có `chiTiet: {}` (rỗng), không có old/new value. Chỉ khi update thành công thì mới log `chiTiet: {"hoTen": "new value"}` — còn các call vaiTroIds/trangThai (silent no-op, xem BUG-QTHT-005) vẫn tạo event UPDATE nhưng chiTiet rỗng.

### Các bước tái hiện

1. Thử list endpoint audit:
   ```bash
   for ep in nhat-ky audit-log audit nhat-ky-he-thong …; do
     curl -H "Authorization: Bearer $ADMIN_TOKEN" "$URL/api/v1/$ep?limit=1"
   done
   # Tất cả: 404 Cannot GET
   ```
2. Update user 3 lần (2 lần no-op, 1 lần thực sự đổi hoTen).
3. GET `/api/v1/tai-khoan/{id}` → xem `lichSu[]`:
   ```json
   "lichSu": [
     {"hanhDong":"UPDATE","chiTiet":{},"thoiGian":"…"},
     {"hanhDong":"UPDATE","chiTiet":{"hoTen":"QA v3"},"thoiGian":"…"},
     {"hanhDong":"UPDATE","chiTiet":{},"thoiGian":"…"}
   ]
   ```

### Kết quả mong đợi

- QT-025: `GET /api/v1/nhat-ky-he-thong?entity=TAI_KHOAN&userId=...&from=...&to=...` trả danh sách tất cả action của user/entity.
- QT-026: `lichSu.chiTiet` chứa `{old: {...}, new: {...}, changedFields: [...]}`, timestamp, actor (userId).

### Kết quả thực tế

- QT-025: Không có endpoint → QTHT không thể xem audit log toàn hệ thống.
- QT-026: Event được ghi nhưng `chiTiet: {}` → không thể trả lời câu hỏi "ai đã đổi gì khi nào".

### Tác động

- Không đáp ứng yêu cầu UC 120-123 của QTHT.
- Không thể forensic khi có sự cố.
- Ghép với BUG-QTHT-005 càng nghiêm trọng: admin update vai-trò fail, nhưng log vẫn ghi UPDATE thành công (rỗng) → log misleading.

### Gợi ý sửa

1. Thêm endpoint `/api/v1/nhat-ky-he-thong` với query `entity, entityId, actorId, action, from, to, pagination` — chỉ QTHT được gọi.
2. Chuẩn hóa audit payload:
   ```ts
   {
     actor: { id, username, vaiTro },
     action: 'UPDATE' | 'CREATE' | 'DELETE' | 'LOGIN' | ...,
     entity: 'TAI_KHOAN',
     entityId: '...',
     old: { ... snapshot ... },
     new: { ... snapshot ... },
     changedFields: ['hoTen', 'trangThai'],
     timestamp, ip, userAgent
   }
   ```
3. Chỉ ghi event khi thực sự có thay đổi (skip nếu `changedFields.length === 0`).

---

## BUG-QTHT-004 — sortOrder=DESC bị bỏ qua

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-004 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **URL** | `GET /api/v1/danh-muc?sortBy=thuTu&sortOrder=DESC` |
| **TC Reference** | QT-016 |
| **Assignee** | Backend Team |

### Mô tả

Param `sortOrder=DESC` bị bỏ qua (vẫn trả ASC); `sortOrder=desc` (lowercase) trả mảng rỗng không lỗi; `sortOrder=-thuTu` (prefix style) cũng rỗng.

### Các bước tái hiện

```bash
GET /api/v1/danh-muc?loaiDanhMuc=LOAI_HINH_HO_TRO&sortBy=thuTu&sortOrder=DESC
# → [1,2,3,4,5,6] (ASC)

GET /api/v1/danh-muc?loaiDanhMuc=LOAI_HINH_HO_TRO&sortBy=thuTu&sortOrder=desc
# → []

GET /api/v1/danh-muc?loaiDanhMuc=LOAI_HINH_HO_TRO&sortBy=thuTu&sortOrder=-thuTu
# → []
```

### Gợi ý sửa

```ts
@IsOptional() @IsIn(['ASC','DESC','asc','desc'])
@Transform(({value}) => value?.toUpperCase())
sortOrder?: 'ASC' | 'DESC';
```

Đảm bảo query builder áp dụng `sortOrder` thực sự (hiện tại query có vẻ hardcode ASC).

---

## BUG-QTHT-009 — Admin JWT capDonVi=DP bất nhất với đơn vị

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-009 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Data |
| **Status** | Open |
| **Thành phần** | Seed data `tai-khoan#admin` hoặc token service |
| **URL** | `POST /api/v1/auth/verify-otp` (JWT claim issuance) |
| **TC Reference** | QT-001 (phát hiện tình cờ) |
| **Assignee** | DB Team / Backend Team |

### Mô tả

Decode JWT của admin:
```json
{"vaiTro":["QTHT_TW"],"donViId":"00000000-0000-4000-8000-000000000001","capDonVi":"DP",...}
```

Nhưng `/api/v1/don-vi/00000000-0000-4000-8000-000000000001` trả:
```json
{"tenDonVi":"Cục Bổ trợ tư pháp - Bộ Tư pháp","cap":"TW"}
```

Vai trò là QTHT_TW, đơn vị là Cục BTTP (cap=TW), nhưng `capDonVi` trong token lại là "DP".

### Tác động

Nếu code phân quyền dựa trên `capDonVi` (ví dụ `if (user.capDonVi === 'DP') filterScope = 'tinh/thanh')`, admin sẽ bị filter sai (chỉ thấy data DP, hoặc ngược lại leak TW data).

### Gợi ý sửa

**Option 1:** Fix seed data `tai-khoan#admin.capDonVi = "TW"`.

**Option 2 (tốt hơn):** Drop field `capDonVi` khỏi `tai-khoan`; token service luôn derive từ `donVi.cap`:
```diff
 const payload = {
   sub: user.id,
   vaiTro: user.vaiTros.map(v => v.maVaiTro),
   donViId: user.donViId,
-  capDonVi: user.capDonVi,
+  capDonVi: donVi.cap,  // single source of truth
   ...
 };
```

---

## BUG-QTHT-011 — forgot-password trả success dù không gửi email

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-011 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Data |
| **Status** | Open |
| **URL** | `POST /api/v1/auth/forgot-password` |
| **TC Reference** | QT-024 (phát hiện bên lề) |
| **Assignee** | Backend Team |

### Mô tả

Gọi `/auth/forgot-password` với email của user trạng thái CHO_KICH_HOAT → trả `success: true` với `"Nếu email tồn tại, link đặt lại mật khẩu đã được gửi."`, nhưng thực tế không có email nào được gửi qua MailHog.

Gọi cùng endpoint với email user HOAT_DONG (admin) → trả cùng message và có email thực sự gửi với TTL 30 phút (QT-024 PASS).

### Các bước tái hiện

1. Tạo user qa_test_user (trạng thái CHO_KICH_HOAT, chưa activate).
2. POST /auth/forgot-password `{email: "qa_test_user@htpldn.gov.vn"}` → 200 success.
3. Poll MailHog → không có email reset-password cho qa_test_user@.

### Tác động

- UX mislead: Admin gọi reset cho user CHO_KICH_HOAT → thấy success → tưởng đã gửi, user vẫn không nhận được → hỗ trợ support nhiều vòng.
- Inconsistent với behavior cho user HOAT_DONG.

### Ghi chú

Đây có thể là "security by design" (ẩn việc email có tồn tại hay không, kể cả đối với CHO_KICH_HOAT). Nếu vậy cần document rõ, và có thể chỉ cho phép reset khi user HOAT_DONG.

### Gợi ý sửa

Hoặc:
- Send email cho mọi user tồn tại bất kể trạng thái (sẽ xử lý reset logic ở step verify-link).
- Hoặc trả error code ngầm (`MAYBE_INACTIVE`) để frontend hiển thị khác.

---

## BUG-QTHT-012 — Thiếu seed data cho 12/15 loại danh mục

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-012 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | Data |
| **Status** | Open |
| **TC Reference** | QT-017 |
| **Assignee** | DB Team |

### Mô tả

Đã probe 30+ tên loaiDanhMuc. Chỉ 3 loại có data:
- `LINH_VUC_PL`: 13 items
- `LOAI_HINH_HO_TRO`: 6 items
- `TINH_TRANG_VU_VIEC`: 11 items

12 loại còn lại (theo spec 15 loại) chưa có seed data hoặc tên khác spec:
- QUY_MO_DN, LOAI_HO_SO, NGUON_KINH_PHI, VAN_BAN_PL, DON_VI_HANH_CHINH, MUC_DO_DANH_GIA, KET_QUA_DANH_GIA, LOAI_HOI_DAP, LOAI_VU_VIEC, HINH_THUC_CHI_TRA, MUC_DO_UU_TIEN, CAP_DON_VI...

### Tác động

Test các module phụ thuộc (Chi trả: QUY_MO_DN, TVV: LINH_VUC_PL chi tiết, Hỏi đáp: LOAI_HOI_DAP) có thể thiếu dropdown → BLOCKED nhiều TC.

### Gợi ý sửa

DB team bổ sung seed data đủ 15 loại theo spec §7.10 dòng comment "15 loại danh mục: lĩnh vực PL, loại hình HT, tình trạng VV...". Confirm tên enum chính xác (spec viết không đầy đủ).

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| API base | http://103.172.236.130:3000/api/v1 |
| MailHog (OTP) | http://103.172.236.130:8025 |
| Frontend | React + Vite + Ant Design + CASL (từ smoke test round 1) |
| Backend | NestJS + TypeORM + PostgreSQL (suy luận từ error codes ERR-SYS/ERR-VAL/ERR-PERM) |
| Xác thực | JWT RS256 + OTP email 2FA |
| Test method | curl + bash + python3 JSON parsing (browse tool không phản hồi) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| admin | QTHT_TW | TW (JWT DP — BUG-009) | BUG-001, 002, 003, 004, 005, 006, 010, 011, 012 |
| canbo_tw | CB_NV | TW | QT-003 (bị khoá trong quá trình test) |
| canbo_bn | CB_NV | BN | QT-007 (session limit) |
| lanhdao_bn | CB_PD (LANH_DAO_BN) | BN | BUG-QTHT-007 |
| dn_user | DN (DOANH_NGHIEP) | Portal | BUG-QTHT-008 |
| nht_user | NHT | Portal | BUG-QTHT-008 |

### C — Response Error Codes quan sát được

| Code | HTTP | Meaning | Xuất hiện ở |
|------|------|---------|-------------|
| ERR-AUTH-SYS-00-01 | 401 | Invalid credentials / Account locked | QT-003, QT-004 |
| ERR-AUTH-SYS-00-03 | 401 | Token has been revoked | QT-005 |
| ERR-PERM-SYS-00-01 | 403 | Forbidden (thiếu quyền) | QT-029-032 |
| ERR-VAL-SYS-00-01 | 400 | Validation error (field-level) | Probing endpoint |
| ERR-STATE-SYS-00-01 | 409 | State conflict (duplicate, optimistic lock) | QT-010, QT-019, QT-020 |
| ERR-SYS-00-04-01 | 404 | Cannot GET/POST (endpoint không tồn tại) | QT-025, QT-027 |

### D — Danh mục ảnh chụp

**Round 2 không có screenshots** do browse tool (gstack browse binary) không phản hồi trên máy test. Bằng chứng lưu dưới dạng JSON response inline trong mỗi bug ở trên.

---

*Bug report generated: 2026-04-17 | QA Automation via Claude Code*
