# Bug Report — Quản trị Hệ thống (QTHT) — Consolidated (API + UI)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (curl + Playwright/Chromium) |
| **Ngày** | 2026-04-17 |
| **Loại test** | Functional (API + UI consolidated) |
| **Round** | Round 2 — Final consolidated |
| **Tài liệu tham chiếu** | [test-strategy.md §7.10](../../../test-strategy.md), [functional-test-report-qtht.md](functional-test-report-qtht.md) (API), [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md) (UI), [api-vs-ui-comparison.md](api-vs-ui-comparison.md) |

---

## Tổng hợp

Phát hiện **15** lỗi trong quá trình test module Quản trị Hệ thống. Đây là báo cáo **hợp nhất** từ 2 lượt test:
- **Round API** (curl): 11 bug (BUG-QTHT-001 đến BUG-QTHT-012, trong đó BUG-012 được re-classify sau Round UI).
- **Round UI** (Playwright + Chromium): 3 bug mới (BUG-QTHT-UI-001, UI-002, UI-003) + 1 re-classification (BUG-012) + 1 reversal (QT-027 không còn là bug).

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 15   | 2        | 8     | 5      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Source | Status |
|--------|----------|----------|------|--------|--------|-------|--------|--------|
| BUG-QTHT-006 | Critical | P0 | Validation | Tài khoản / Backend | QT-028 | Hệ thống KHÔNG validate độ mạnh mật khẩu — chấp nhận `Ab1`, `12345678`, `password` | API | Open |
| BUG-QTHT-UI-001 | Critical | P0 | Validation | Tài khoản / Frontend | QT-028 | Form tạo tài khoản thiếu client-side password hint + validation | UI | Open |
| BUG-QTHT-005 | Major | P0 | Data | Tài khoản | QT-020, QT-023 | PUT /tai-khoan silent no-op cho `vaiTroIds` và `trangThai` | API | Open |
| BUG-QTHT-001 | Major | P1 | Workflow | Auth | QT-006 | Access token TTL = 900s (15 phút) thay vì 30 phút theo BR-AUTH-06 | API | Open |
| BUG-QTHT-002 | Major | P1 | Permission | Auth | QT-008 | QTHT cho phép nhiều phiên đồng thời (spec: chỉ 1) | API | Open |
| BUG-QTHT-003 | Major | P1 | Data | Danh mục | QT-013 | Xóa danh mục đang được state-machine sử dụng mà không bị chặn | API | Open |
| BUG-QTHT-007 | Major | P1 | Permission | Phân quyền | QT-031 | CB_PD (lanhdao_bn) liệt kê được danh sách TAI_KHOAN | API | Open |
| BUG-QTHT-008 | Major | P1 | Permission | Phân quyền | QT-032 | DN/NHT liệt kê được danh sách VAI_TRO | API | Open |
| BUG-QTHT-010 | Major | P1 | Data | Audit log | QT-025, QT-026 | Thiếu endpoint global audit log + `lichSu.chiTiet` rỗng | API + UI | Open |
| BUG-QTHT-UI-002 | Major | P1 | UI/UX | Auth / Frontend | QT-003-UI | Login sai mật khẩu → UI KHÔNG hiển thị thông báo lỗi | UI | Open |
| BUG-QTHT-004 | Medium | P2 | UI/UX | Danh mục / Backend | QT-016 | `sortOrder=DESC` bị bỏ qua (trả ASC); `sortOrder=desc` trả mảng rỗng | API | Open |
| BUG-QTHT-009 | Medium | P2 | Data | Auth / Seed | QT-001 | JWT claim `capDonVi=DP` của admin bất nhất với đơn vị (cap=TW) | API | Open |
| BUG-QTHT-011 | Medium | P2 | Data | Tài khoản | QT-024 | `/auth/forgot-password` không gửi email cho user CHO_KICH_HOAT nhưng vẫn trả success | API | Open |
| BUG-QTHT-UI-003 | Medium | P2 | UI/UX | Frontend | CONSOLE | 3 antd deprecation warnings trong console trên các page QTHT | UI | Open |
| BUG-QTHT-012 | Medium | P2 | Data | Danh mục / Backend | QT-017 | **[Re-classified]** API enum validator `LoaiDanhMuc` chỉ chấp nhận ~3 giá trị, trong khi data đã seed 15+ loại và UI hiển thị đủ | API + UI | Open |

> **Chú thích Type:**
> - `Validation` — validate input (pattern, length, enum)
> - `Permission` — phân quyền role × entity × action
> - `Data` — toàn vẹn dữ liệu, seed, schema, audit
> - `Workflow` — state/timing/session
> - `UI/UX` — giao diện, hiển thị, tương tác, console

> **Chú thích Severity:** `Critical` = lộ dữ liệu / block release / vi phạm compliance | `Major` = chức năng quan trọng lỗi, có workaround | `Medium` = chức năng phụ, UX kém | `Minor` = không ảnh hưởng nghiệp vụ.

> **Chú thích Priority:** `P0` = fix trước release | `P1` = fix trong sprint hiện tại | `P2` = fix 2-3 sprint tới.

> **Chú thích Source:** `API` = phát hiện bằng test curl/API | `UI` = phát hiện bằng Playwright/browser | `API + UI` = cả hai confirm.

### Reversal (không còn là bug)

| Cũ | Trạng thái mới | Lý do |
|----|----------------|-------|
| QT-027 BLOCKED (API report) — "Không tìm thấy endpoint cấu hình SLA" | **PASS** | UI test chứng minh trang `/quan-tri/cau-hinh-sla` hoạt động với 4 loại SLA (HOI_DAP/HO_SO_HT/HO_SO_TT/VU_VIEC). API đã đoán sai tên endpoint. |

---

## BUG-QTHT-006 — Hệ thống không validate độ mạnh mật khẩu (Backend)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-006 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Validation |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Quản lý tài khoản (Backend) |
| **Thành phần** | `CreateTaiKhoanDto.matKhau` + ValidationPipe |
| **URL** | `POST /api/v1/tai-khoan` |
| **Tài khoản** | admin (QTHT_TW) |
| **TC Reference** | QT-028 |
| **SRS Reference** | BR-SEC-06 |
| **Source** | API test (curl) |
| **Assignee** | Backend Team |

### Mô tả

Khi tạo tài khoản mới qua API, server chấp nhận mật khẩu yếu như `Ab1` (3 ký tự), `abcdefgh` (không hoa/số), `12345678` (chỉ số), `password`. Không có bất kỳ validation nào trên field `matKhau`.

### Các bước tái hiện

1. Login admin → lấy accessToken.
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
3. Lặp lại với 7 biến thể: `abcdefgh`, `ABCDEFGH`, `12345678`, `abcdefg1`, `Password`, `Password1`, `password1`.

### Kết quả mong đợi

HTTP 400 với `"Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"` (BR-SEC-06).

### Kết quả thực tế

**7/8 biến thể password yếu đều trả HTTP 201 success.**

| Password | Độ dài | Hoa | Thường | Số | Response |
|----------|--------|-----|--------|----|----------|
| `Ab1` | 3 | ✓ | ✓ | ✓ | **201** (fail độ dài < 8) |
| `abcdefgh` | 8 | ✗ | ✓ | ✗ | **201** (thiếu hoa + số) |
| `ABCDEFGH` | 8 | ✓ | ✗ | ✗ | **201** (thiếu thường + số) |
| `12345678` | 8 | ✗ | ✗ | ✓ | **201** (chỉ số) |
| `abcdefg1` | 8 | ✗ | ✓ | ✓ | **201** (thiếu hoa) |
| `Password` | 8 | ✓ | ✓ | ✗ | **201** (thiếu số) |
| `Password1` | 9 | ✓ | ✓ | ✓ | 201 (hợp lệ) |
| `password1` | 9 | ✗ | ✓ | ✓ | **201** (thiếu hoa) |

### Tác động (Impact)

**100% tài khoản mới** có thể đặt mật khẩu yếu. Bao gồm cả QTHT, CB_PD, CB_NV → brute-force < 1 giây với top-1000 password list. Vi phạm compliance release-gate (BR-SEC-06).

### Nguyên nhân nghi ngờ (Root Cause)

`CreateTaiKhoanDto.matKhau` (NestJS, class-validator) chỉ có `@IsString()` mà thiếu `@MinLength(8)` + `@Matches(regex)`.

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
- `ResetPasswordDto.matKhauMoi` (QT-024)
- `ChangePasswordDto.matKhauMoi` (nếu có)
- `UpdateTaiKhoanDto.matKhau` (nếu cho phép đổi)

---

## BUG-QTHT-UI-001 — Form tạo tài khoản thiếu client-side password validation (Frontend)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-UI-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Validation |
| **Status** | Open |
| **Module** | Quản trị Hệ thống / Quản lý tài khoản (Frontend) |
| **Thành phần** | Component tạo mới tài khoản (có thể `CreateUserForm.tsx` / `UserFormDrawer.tsx`) |
| **URL** | UI: QTHT → Tài khoản & phân quyền → click "Thêm mới" |
| **Tài khoản** | admin (QTHT_TW) |
| **TC Reference** | QT-028 (UI check) |
| **SRS Reference** | BR-SEC-06 |
| **Source** | UI test (Playwright) |
| **Assignee** | Frontend Team |

### Mô tả

Form tạo tài khoản mới (Drawer/Modal) **không có**:
- Hint text về password rule (không có `extra` hoặc inline helper describe ≥8 ký tự + hoa + thường + số)
- Client-side validation — nhập `Ab1` và blur khỏi field → không có error message nào xuất hiện

Kết hợp với BUG-QTHT-006 (backend không validate) → user không có bất kỳ feedback nào về policy → đặt mật khẩu yếu dễ dàng.

### Các bước tái hiện

1. Login admin → click sidebar QTHT → Tài khoản & phân quyền.
2. Click button "Thêm mới".
3. Form xuất hiện. Quan sát field "Mật khẩu":
   - Không có text bên dưới field mô tả rule
   - Không có `Form.Item.extra` nào liên quan
4. Fill `Ab1` vào field password → click ra ngoài (blur).
5. Quan sát: không có `.ant-form-item-explain-error` nào xuất hiện bên dưới field.
6. Screenshot bằng chứng: [screenshots-ui/32-weak-pwd.png](screenshots-ui/32-weak-pwd.png)

### Kết quả mong đợi

- Field có `<Form.Item.extra>Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa + thường + số</Form.Item.extra>`.
- Khi blur với value không hợp lệ → hiện error đỏ bên dưới field: `"Mật khẩu phải ≥8 ký tự, có chữ hoa, chữ thường, số"`.
- Button "Lưu" disabled cho đến khi mọi field pass validation.

### Kết quả thực tế

- Không có hint.
- Không có client-side validation error.
- Submit được với `Ab1` → backend nhận và tạo user thành công (BUG-QTHT-006).

### Tác động (Impact)

- UX kém: user không biết rule trước khi submit → trial & error.
- Defense-in-depth fail: cần cả client + server validation. Hiện tại cả 2 đều thiếu.

### Nguyên nhân nghi ngờ (Root Cause)

`Form.Item` cho password field không có `rules={[...]}` regex pattern, cũng không có `extra` hint text.

### Gợi ý sửa (Suggested Fix)

```tsx
<Form.Item
  name="matKhau"
  label="Mật khẩu"
  extra="Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số"
  rules={[
    { required: true, message: 'Vui lòng nhập mật khẩu' },
    { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Phải có chữ hoa, chữ thường và số',
    },
  ]}
>
  <Input.Password autoComplete="new-password" />
</Form.Item>
```

Tạo constant `PASSWORD_POLICY_REGEX` + hint chung trong file shared để dùng ở mọi nơi (create user, reset password, change password).

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
| **Thành phần** | `TaiKhoanController.update` + `UpdateTaiKhoanDto` |
| **URL** | `PUT /api/v1/tai-khoan/{id}` |
| **TC Reference** | QT-020, QT-023 |
| **SRS Reference** | UC 111-115 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Gọi PUT `/api/v1/tai-khoan/{id}` với body `{"vaiTroIds": [...], "version": N}` hoặc `{"trangThai": "BI_KHOA", "version": N}` trả `success: true` với `data.version` **không đổi**. Field `vaiTros[]` và `trangThai` trong DB không thay đổi. Audit log (`lichSu[]`) ghi event UPDATE với `chiTiet: {}` (rỗng).

### Các bước tái hiện

1. Tạo user `qa_test_user` với role `CB_TW`, trạng thái `CHO_KICH_HOAT`, version=1.
2. PUT `/api/v1/tai-khoan/{id}` với body `{"hoTen":"QA v3","version":1}` → thành công, version=2.
3. PUT `{"vaiTroIds":["<QTHT_TW_ID>","<CB_TW_ID>"],"version":2}` → API trả `success: true`, **nhưng version vẫn 2**, `vaiTros[]` vẫn chỉ chứa CB_TW.
4. GET lại → roles vẫn `["CB_TW"]`, không có QTHT_TW.
5. PUT với `{"trangThai":"BI_KHOA","version":3}` → `success: true`, `trangThai` vẫn `CHO_KICH_HOAT`.

### Kết quả mong đợi

- Step 3: roles sau update = `[QTHT_TW, CB_TW]`; version tăng lên 3; lichSu ghi UPDATE với `chiTiet: { old, new, changedFields }`.
- Step 5: trangThai = `BI_KHOA`; version tăng; user không login được.

### Kết quả thực tế

```json
// Step 3 request body: {"vaiTroIds":["aaaaaaaa-0000-4000-8000-000000000002"], "version":2}
// Response:
{"success":true,"data":{"id":"7c8f13a4-…","version":2,"vaiTros":[{"maVaiTro":"CB_TW"}]}}
// version KHÔNG tăng, roles KHÔNG đổi.

// lichSu sau đó:
[
  {"hanhDong":"UPDATE","chiTiet":{},"thoiGian":"..."},  // ← rỗng
  {"hanhDong":"UPDATE","chiTiet":{"hoTen":"QA v3"},"thoiGian":"..."}
]
```

### Tác động (Impact)

- **Flow gán vai-trò** (QT-020) không hoạt động → admin không thể promote/demote user sau khi tạo.
- **Flow khoá tài khoản** (QT-023) không hoạt động → không có cách khoá user bị compromise (ngoài chờ 5 lần sai mật khẩu).
- API response `success: true` gây hiểu lầm → admin tưởng đã làm xong. Audit log sai (ghi UPDATE rỗng).

### Nguyên nhân nghi ngờ (Root Cause)

`UpdateTaiKhoanDto` có `whitelist: true` trong ValidationPipe — field không khai báo trong DTO bị strip trước khi vào service. `vaiTroIds` và `trangThai` không nằm trong whitelist → silent remove.

Thêm: `vaiTroIds` là quan hệ M-N (bảng `tai_khoan_vai_tro`), không thể làm trong `save()` đơn giản — cần service riêng với transaction.

### Gợi ý sửa (Suggested Fix)

**Option 1 — Nhanh (mở rộng DTO):**

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

Service phải dùng transaction để update M-N:
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

**Option 2 — REST best practice (endpoint riêng):**

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
| **Module** | Auth |
| **Thành phần** | `AuthModule.JwtModule.register({ signOptions: { expiresIn } })` |
| **URL** | `POST /api/v1/auth/verify-otp` |
| **TC Reference** | QT-006 |
| **SRS Reference** | BR-AUTH-06 |
| **Source** | API test (decode JWT) |
| **Assignee** | Backend Team |

### Mô tả

accessToken JWT có `exp - iat = 900` giây (15 phút). BR-AUTH-06 yêu cầu session timeout 30 phút idle.

### Các bước tái hiện

1. Login admin → verify-otp → lấy accessToken.
2. Decode payload (base64 phần thứ 2):
   ```json
   {"iat": 1776401240, "exp": 1776402140, "sub": "...", "vaiTro": ["QTHT_TW"]}
   ```
3. `exp - iat = 900` giây = **15 phút**.

### Kết quả mong đợi

`exp - iat = 1800` (30 phút), **HOẶC** có refresh-token để reissue access-token khi idle < 30 phút.

### Kết quả thực tế

Response verify-otp chỉ có `accessToken + expiresIn: 900 + tokenType: Bearer`. Không có refresh-token. Sau 15 phút user phải re-login với OTP.

### Tác động

- UX tệ: user phải đăng nhập 2-factor mỗi 15 phút.
- Không khớp spec → regression test có thể flaky.

### Gợi ý sửa

```diff
 // auth.module.ts
 JwtModule.register({
   secret: ...,
-  signOptions: { expiresIn: '15m' },
+  signOptions: { expiresIn: '30m' },
 })
```

Hoặc triển khai refresh-token flow (refresh 7 ngày, access 15 phút auto-renew).

---

## BUG-QTHT-002 — QTHT cho phép nhiều phiên đồng thời

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Auth |
| **Thành phần** | `AuthService.createSession()` / `SessionGuard` |
| **URL** | `POST /api/v1/auth/verify-otp` |
| **TC Reference** | QT-008 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Login admin 2 lần liên tiếp → cả 2 token đều valid, `GET /auth/sessions` trả về 2 session active. Policy: QTHT chỉ được 1 session đồng thời (giảm risk nếu token bị lộ).

### Các bước tái hiện

1. Login admin lần 1 → T1.
2. Login admin lần 2 → T2.
3. GET `/api/v1/auth/me` với T1 → kỳ vọng 401, thực tế 200.
4. GET `/api/v1/auth/sessions` với T2 → kỳ vọng 1 session, thực tế 2.

### So sánh (Comparison)

| Role | Login lần 2 kill cũ? | Login lần 4 kill oldest? |
|------|----------------------|--------------------------|
| CB_NV (canbo_bn) | Giữ (limit=3) | ✅ Kill session 1 |
| QTHT_TW (admin) | **Giữ (BUG — phải kill)** | Chưa test |

### Tác động

Vi phạm chính sách "QTHT chỉ 1 session". Nếu token QTHT bị lộ, attacker tiếp tục dùng token cũ song song với admin.

### Gợi ý sửa

```diff
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
| **Module** | Danh mục |
| **Thành phần** | `DanhMucService.softDelete()` |
| **URL** | `DELETE /api/v1/danh-muc/{id}` |
| **TC Reference** | QT-013 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

DELETE danh mục `TINH_TRANG_VU_VIEC/MOI_TAO` (state quan trọng SM-VUVIEC) trả 204 No Content thành công, không kiểm tra reference.

### Các bước tái hiện

1. GET `/api/v1/danh-muc?loaiDanhMuc=TINH_TRANG_VU_VIEC&ma=MOI_TAO` → lấy id.
2. DELETE `/api/v1/danh-muc/{id}` → 204.
3. GET lại → 404 (đã soft-delete).
4. List TINH_TRANG_VU_VIEC: 11 mục (trước 12).

### Kết quả mong đợi

HTTP 409 Conflict: `"Danh mục đang được sử dụng ở N bản ghi. Không thể xóa."`.

### Tác động

Nếu có VU_VIEC ở state `MOI_TAO` → mất tham chiếu, UI có thể crash khi render. QTHT 1 click nhầm → phá SM. Recovery khó.

### Gợi ý sửa

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
  // proceed with soft-delete
}
```

Hoặc bật flag `isSystem=true` cho các danh mục core và block delete tuyệt đối.

---

## BUG-QTHT-007 — CB_PD thấy được danh sách TAI_KHOAN

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Phân quyền |
| **Thành phần** | `TaiKhoanController.findAll()` + CASL ability |
| **URL** | `GET /api/v1/tai-khoan` |
| **Tài khoản** | lanhdao_bn (LANH_DAO_BN ≡ CB_PD) |
| **TC Reference** | QT-031 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Role CB_PD (lanhdao_bn) gọi GET /tai-khoan → HTTP 200, trả 25 records chi tiết (username, email, đơn vị). SRS §7.10 QT-031 nói CB_PD chỉ được xem DANH_MUC, VAI_TRO, DON_VI — không có TAI_KHOAN.

### So sánh (Comparison) — ma trận phân quyền đầy đủ

| Role | GET /danh-muc | GET /vai-tro | GET /don-vi | GET /tai-khoan | POST /tai-khoan |
|------|---------------|--------------|-------------|----------------|-----------------|
| QTHT_TW (admin) | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 200 | ✅ 201 |
| CB_NV (canbo_bn) | ✅ 200 | ✅ 200 | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |
| CB_PD (lanhdao_bn) | ✅ 200 | ✅ 200 | ✅ 200 | **✅ 200 (BUG!)** | ❌ 403 (đúng) |
| DN (dn_user) | ✅ 200 | **✅ 200 (BUG — BUG-008)** | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |
| NHT (nht_user) | ✅ 200 | **✅ 200 (BUG)** | ✅ 200 | ❌ 403 (đúng) | ❌ 403 (đúng) |

### Tác động

Rò rỉ thông tin tài khoản nội bộ (username, email, đơn vị) cho 3 role CB_PD (TW/BN/DP). Nếu 1 CB_PD bị compromise → attacker enumerate toàn bộ user.

### Gợi ý sửa

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

Hoặc CASL `defineAbility()`:
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
| **Module** | Phân quyền |
| **Thành phần** | `VaiTroController.findAll()` |
| **URL** | `GET /api/v1/vai-tro` |
| **Tài khoản** | dn_user, nht_user |
| **TC Reference** | QT-032 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Portal user DN và NHT đều gọi được GET /vai-tro → 200, trả 14 roles nội bộ (bao gồm QTHT_TW, LANH_DAO_TW, CB_BN...). SRS nói DN/NHT/TVV/CG chỉ thấy DANH_MUC + DON_VI.

### Các bước tái hiện

1. Login dn_user → lấy token.
2. GET `/api/v1/vai-tro?limit=20` → 200.
3. Response chứa 14 roles nội bộ.
4. Repeat với nht_user → 200.

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

Portal user enumerate internal role structure. Kết hợp với BUG-QTHT-007 → attacker chain: compromise DN → biết role → phishing nhắm vào QTHT.

### Gợi ý sửa

```ts
@Get() @Roles('QTHT_TW', 'QTHT_BN', 'QTHT_DP') findAll() { ... }
```

Hoặc cung cấp endpoint nội bộ `/api/v1/vai-tro/public` trả tập con sanitized (loại bỏ QTHT_*).

---

## BUG-QTHT-010 — Audit log không đầy đủ

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-010 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Audit |
| **Thành phần** | `AuditInterceptor` / `LichSuService` + sidebar menu |
| **URL** | Nhiều |
| **TC Reference** | QT-025, QT-026 |
| **SRS Reference** | UC 120-123 |
| **Source** | API + UI (cả hai confirm) |
| **Assignee** | Backend Team + Frontend Team |

### Mô tả

1. **API:** Thiếu endpoint global audit log. Đã thử 14 biến thể (`/nhat-ky`, `/audit-log`, `/audit`, `/nhat-ky-he-thong`, `/activity-log`, `/history`, `/logs`, ...) — tất cả trả 404.
2. **UI:** Sidebar QTHT có 8 sub-menu (Danh mục, SLA, Phân công, Ngày lễ, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Tài khoản & phân quyền, API Consumer) — **KHÔNG có menu Nhật ký hệ thống / Audit log**.
3. **Per-entity lichSu** trong `tai-khoan/{id}` tồn tại nhưng `chiTiet` của phần lớn UPDATE entry = `{}` (rỗng).

### Các bước tái hiện

```bash
# Thử các biến thể endpoint
for ep in nhat-ky audit-log audit nhat-ky-he-thong lich-su activity-log history logs; do
  curl -H "Authorization: Bearer $ADMIN_TOKEN" "$URL/api/v1/$ep?limit=1"
done
# → Tất cả trả 404 ERR-SYS-00-04-01
```

UI: click QTHT trên sidebar → 8 sub-item, scroll qua không thấy "Nhật ký".

lichSu payload mẫu:
```json
"lichSu": [
  {"hanhDong":"UPDATE","chiTiet":{},"thoiGian":"..."},
  {"hanhDong":"UPDATE","chiTiet":{"hoTen":"QA v3"},"thoiGian":"..."}
]
```

### Tác động

- Không đáp ứng UC 120-123 của QTHT.
- Không forensic được khi có sự cố security.
- Cộng với BUG-QTHT-005 → log ghi UPDATE thành công (rỗng) khi thực tế không đổi → log misleading.

### Gợi ý sửa

1. **Thêm endpoint** `/api/v1/nhat-ky-he-thong` với query `entity, entityId, actorId, action, from, to, pagination` — chỉ QTHT được gọi.
2. **Thêm menu UI** vào sidebar QTHT: "Nhật ký hệ thống" → link tới endpoint trên.
3. **Chuẩn hóa audit payload**:
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
4. Chỉ ghi event khi thực sự có thay đổi (`changedFields.length > 0`).

---

## BUG-QTHT-UI-002 — Login sai mật khẩu không hiển thị thông báo lỗi

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-UI-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Auth / Frontend |
| **Thành phần** | Login page (`LoginPage.tsx` / `useLoginMutation`) |
| **URL** | UI: `/login` |
| **TC Reference** | QT-003-UI |
| **Source** | UI test (Playwright) |
| **Assignee** | Frontend Team |

### Mô tả

Điền username `admin` + password sai (`WrongPwd123`) → click "Đăng nhập" → API trả 401 → UI **KHÔNG hiển thị thông báo error nào**. Không có `.ant-message-error`, không có `.ant-notification`, không có `.ant-form-item-explain`. Button reset về "Đăng nhập" bình thường nhưng user không biết tại sao không vào được.

### Các bước tái hiện

1. goto `/login`.
2. Fill `admin` + `WrongPwd123`.
3. Click "Đăng nhập".
4. Đợi 5 giây.
5. Screenshot: [screenshots-ui/70-wrong-pwd.png](screenshots-ui/70-wrong-pwd.png).
6. Playwright assertion:
   ```js
   const errVis = await page.locator('.ant-message-error, .ant-notification').count();
   const ant = await page.locator('.ant-message, .ant-notification-notice, .ant-form-item-explain').allTextContents();
   // errVis = 0, visible alerts = 0
   ```

### Kết quả mong đợi

- `message.error("Tên đăng nhập hoặc mật khẩu không đúng")` hiển thị toast.
- Hoặc inline error bên dưới field password: `"Đăng nhập thất bại"`.
- Button reset về "Đăng nhập".

### Kết quả thực tế

- Network: `POST /api/v1/auth/login` → 401 (OK, backend trả đúng).
- UI: Form giữ nguyên state, button "Đăng nhập", không có feedback nào.

### Tác động

- User sai password → không biết mình sai → retry nhiều lần → lockout sau 5 lần (BR-AUTH-06) mà không hiểu lý do.
- Triggers support ticket không cần thiết.

### Nguyên nhân nghi ngờ

`useLoginMutation` hoặc login handler không handle nhánh `onError` để show error. Có thể có `try/catch` nuốt lỗi, hoặc `.then()` mà không `.catch()`.

### Gợi ý sửa

```tsx
const loginMutation = useMutation({
  mutationFn: api.login,
  onSuccess: (data) => { /* navigate to OTP */ },
  onError: (err: AxiosError) => {
    const msg = err.response?.data?.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
    message.error(msg);  // ← missing
  }
});
```

Đồng thời ensure submit button reset state trong `onError` (không stuck ở "Đang xử lý..." — liên quan BUG-R2-001 smoke test round 1).

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
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Param `sortOrder=DESC` bị bỏ qua (vẫn trả ASC); `sortOrder=desc` (lowercase) trả mảng rỗng; `sortOrder=-thuTu` cũng rỗng.

### Các bước tái hiện

```bash
GET /api/v1/danh-muc?loaiDanhMuc=LOAI_HINH_HO_TRO&sortBy=thuTu&sortOrder=DESC
# → [1,2,3,4,5,6] (ASC — sai!)

GET ?sortOrder=desc  → []  (empty — không throw error)
GET ?sortOrder=-thuTu → []
```

### Gợi ý sửa

```ts
@IsOptional() @IsIn(['ASC','DESC','asc','desc'])
@Transform(({value}) => value?.toUpperCase())
sortOrder?: 'ASC' | 'DESC';
```

Đảm bảo query builder áp dụng `sortOrder` thực sự (hiện tại có vẻ hardcode ASC).

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
| **URL** | `POST /api/v1/auth/verify-otp` |
| **TC Reference** | QT-001 (discovered) |
| **Source** | API test (decode JWT) |
| **Assignee** | DB Team / Backend Team |

### Mô tả

Decode JWT admin:
```json
{"vaiTro":["QTHT_TW"],"donViId":"00000000-0000-4000-8000-000000000001","capDonVi":"DP",...}
```

Nhưng `/api/v1/don-vi/00000000-0000-4000-8000-000000000001` trả:
```json
{"tenDonVi":"Cục Bổ trợ tư pháp - Bộ Tư pháp","cap":"TW"}
```

Role QTHT_TW, đơn vị Cục BTTP (cap=TW), nhưng `capDonVi` token = "DP".

### Tác động

Nếu code phân quyền dựa trên `capDonVi` → admin bị filter sai (chỉ thấy data DP, hoặc leak TW data ra DP).

### Gợi ý sửa

**Option 1:** Fix seed `tai-khoan#admin.capDonVi = "TW"`.

**Option 2 (tốt hơn):** Drop field `capDonVi` khỏi bảng tai-khoan; token service derive từ `donVi.cap`:
```diff
 const payload = {
-  capDonVi: user.capDonVi,
+  capDonVi: donVi.cap,  // single source of truth
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
| **TC Reference** | QT-024 |
| **Source** | API test |
| **Assignee** | Backend Team |

### Mô tả

Gọi `/auth/forgot-password` với email user trạng thái CHO_KICH_HOAT → trả `success: true` với `"Nếu email tồn tại, link đặt lại mật khẩu đã được gửi."`, nhưng thực tế **không có email nào gửi** qua MailHog.

Gọi cùng endpoint với email user HOAT_DONG (admin) → trả cùng message và **có email thực** gửi với TTL 30 phút (QT-024 PASS cho trường hợp này).

### Các bước tái hiện

1. Tạo user qa_test_user (trạng thái CHO_KICH_HOAT).
2. POST /auth/forgot-password `{email: "qa_test_user@htpldn.gov.vn"}` → 200 success.
3. Poll MailHog → không có email reset-password cho địa chỉ này.

### Tác động

- UX mislead: Admin gọi reset cho user CHO_KICH_HOAT → thấy success → tưởng đã gửi, user vẫn không nhận được → support ticket.
- Inconsistent với behavior cho user HOAT_DONG.

### Ghi chú

Đây có thể là "security by design" (ẩn việc email có tồn tại hay không). Nếu vậy cần document rõ và chỉ cho phép reset khi user HOAT_DONG. Hoặc send email cho mọi user tồn tại, xử lý reset ở step verify-link.

---

## BUG-QTHT-UI-003 — antd deprecation warnings trong console

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-UI-003 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **URL** | Nhiều page QTHT |
| **TC Reference** | CONSOLE (background check) |
| **Source** | UI test (Playwright `page.on('console')`) |
| **Assignee** | Frontend Team |

### Mô tả

3 deprecation warnings từ antd library phát hiện khi browse qua các page QTHT:

1. `Warning: [antd: Drawer] 'width' is deprecated. Please use 'size' instead.`
2. `Warning: [antd: TreeSelect] 'onDropdownVisibleChange' is deprecated. Please use 'onOpenChange' instead.`
3. `Warning: [antd: TreeSelect] 'bordered' is deprecated. Please use 'variant' instead.`

### Tác động

Code sẽ break khi upgrade antd lên major version tiếp theo. Hiện chỉ là warnings, không crash.

### Gợi ý sửa

Tìm và refactor 3 usage site:

```diff
- <Drawer width={600} />
+ <Drawer size="large" />

- <TreeSelect onDropdownVisibleChange={fn} bordered={false} />
+ <TreeSelect onOpenChange={fn} variant="borderless" />
```

Sau khi fix: chạy `grep -rn "onDropdownVisibleChange\|bordered={\|Drawer.*width" src/` để confirm đã hết.

---

## BUG-QTHT-012 — API enum validator LoaiDanhMuc không đủ (Re-classified)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-QTHT-012 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Data |
| **Status** | Open |
| **TC Reference** | QT-017 |
| **Source** | API test + UI test (UI re-classify) |
| **Assignee** | Backend Team |

### Mô tả

**Ban đầu (API test):** Kết luận "chỉ 3/15 loại danh mục có data" vì probe 30+ tên loaiDanhMuc và chỉ match được 3 (LINH_VUC_PL, LOAI_HINH_HO_TRO, TINH_TRANG_VU_VIEC).

**Sau UI test:** UI hiển thị đầy đủ **15+ loại danh mục** ở panel trái của trang Quản lý danh mục (screenshot [21-danh-muc-landing.png](screenshots-ui/21-danh-muc-landing.png)):

1. Lĩnh vực pháp lý
2. Loại hình hỗ trợ
3. Chương trình hỗ trợ
4. Tình trạng vụ việc
5. Tỉnh/Thành phố
6. Tổ chức tư vấn
7. Loại doanh nghiệp
8. Hồ sơ đề nghị hỗ trợ
9. Hồ sơ đề nghị thanh toán
10. Tiêu chí đánh giá hiệu quả
11. Tiêu chí đánh giá chi phí
12. Loại tài khoản
13. Loại hình tiếp nhận
14. Kênh tiếp nhận
15. Hệ thống nguồn
... (scroll)

Data đã được seed đầy đủ → BUG không phải "thiếu seed data".

**Root cause thực:** API validator ở endpoint `GET /api/v1/danh-muc?loaiDanhMuc=X` có danh sách enum không đồng bộ với giá trị UI gọi (hoặc tên enum khác với cái tôi đoán trong probe), hoặc `@IsEnum(LoaiDanhMuc)` bị giới hạn.

### Các bước tái hiện

1. API: `curl "$URL/api/v1/danh-muc?loaiDanhMuc=LOAI_DOANH_NGHIEP"` → 400 `"loaiDanhMuc không hợp lệ"` (hoặc tên thật khác).
2. UI: click panel "Loại doanh nghiệp" → URL thành `/quan-tri/danh-muc/<enum_code>` → hiển thị data.

### Tác động

- Developer khác không thể dùng API để query các loại danh mục mà UI hỗ trợ → inconsistency.
- Tests bằng API có thể miss data → false negative.

### Gợi ý sửa

1. **Export enum** `LoaiDanhMuc` thành file chia sẻ giữa FE và BE (hoặc generate từ schema).
2. **Review** `enum LoaiDanhMuc` trong backend NestJS — đảm bảo khớp với 15+ giá trị UI sử dụng.
3. **Expose** endpoint `/api/v1/danh-muc/loai` trả danh sách enum hợp lệ (giúp dev khác discover).
4. Ghi docs cho QA: tên chính xác của mỗi loại.

### Cross-reference

- QT-017 status update: API = FAIL, UI = PASS. Thực tế tính năng **có hoạt động**, chỉ API endpoint validator thiếu.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| API base | http://103.172.236.130:3000/api/v1 |
| MailHog (OTP) | http://103.172.236.130:8025 |
| Frontend | React + Vite + Ant Design + Zustand + CASL |
| Backend | NestJS + TypeORM + PostgreSQL |
| Xác thực | JWT RS256 + OTP email 2FA |
| API test tool | curl + bash + python3 JSON parsing |
| UI test tool | Playwright v1.57 + Chromium 1217 (headless) |
| OS | macOS 15.5 ARM64 |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| admin | QTHT_TW | TW (JWT DP — BUG-009) | QTHT-001, 002, 003, 004, 005, 006, 009, 010, 011, 012, UI-001, UI-002, UI-003 |
| canbo_tw | CB_NV | TW | QT-003 (bị khoá trong quá trình test round 1) |
| canbo_bn | CB_NV | BN | QT-007 (session limit), QT-030 |
| lanhdao_bn | CB_PD (LANH_DAO_BN) | BN | BUG-QTHT-007 |
| dn_user | DN (DOANH_NGHIEP) | Portal | BUG-QTHT-008 |
| nht_user | NHT | Portal | BUG-QTHT-008 |

### C — Phân bổ bug theo team

| Team | Bugs |
|------|------|
| **Backend Team** | BUG-QTHT-001, 002, 003, 004, 005, 006, 007, 008, 009, 010 (cả BE), 011, 012 |
| **Frontend Team** | BUG-QTHT-UI-001, UI-002, UI-003, BUG-QTHT-010 (thêm menu) |
| **DB/DevOps Team** | BUG-QTHT-009 (seed data fix) |

### D — Matrix Source × Severity

| | Critical | Major | Medium | Total |
|---|----------|-------|--------|-------|
| API only | 1 (006) | 6 (001/002/003/005/007/008) | 3 (004/009/011) | 10 |
| UI only | 1 (UI-001) | 1 (UI-002) | 1 (UI-003) | 3 |
| API + UI both | 0 | 1 (010) | 1 (012 reclassified) | 2 |
| **Total** | **2** | **8** | **5** | **15** |

### E — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [screenshots-ui/01-login-page.png](screenshots-ui/01-login-page.png) | Trang login initial | QT-001 |
| [screenshots-ui/04-otp-filled.png](screenshots-ui/04-otp-filled.png) | OTP form 6 digits filled | QT-002 |
| [screenshots-ui/10-dashboard.png](screenshots-ui/10-dashboard.png) | Dashboard post-login với role QTHT_TW | QT-001b |
| [screenshots-ui/20-qtht-expanded.png](screenshots-ui/20-qtht-expanded.png) | Sidebar QTHT 8 sub-menus | QT-029 |
| [screenshots-ui/21-danh-muc-landing.png](screenshots-ui/21-danh-muc-landing.png) | 15+ loại danh mục panel | BUG-012 (disprove seed data) |
| [screenshots-ui/40-sla.png](screenshots-ui/40-sla.png) | Cấu hình SLA 4 loại + progress bars | QT-027 reversal |
| [screenshots-ui/60-user-menu.png](screenshots-ui/60-user-menu.png) | User menu dropdown | QT-005 |
| [screenshots-ui/70-wrong-pwd.png](screenshots-ui/70-wrong-pwd.png) | Sai pwd không có error UI | BUG-QTHT-UI-002 |
| [screenshots-ui/80-forgot-pwd.png](screenshots-ui/80-forgot-pwd.png) | Trang Quên mật khẩu | QT-024 |

### F — Reproducibility

Để re-run test:

**API only (~15 phút):**
```bash
# Helper function: login via 2FA (API + MailHog)
source ./scripts/qtht-api-helpers.sh
TOKEN=$(qtht_login admin "Secret@123")
# Run test suite: xem chi tiết trong functional-test-report-qtht.md
```

**UI only (~8 phút):**
```bash
cd /tmp/qa-playwright
NODE_PATH=/opt/homebrew/lib/node_modules node qtht-final.js
```

**Cả hai — recommended workflow:**
```bash
# Round 1: API-first sweep (fast)
bash qtht-api-suite.sh

# Round 2: UI verification + UX bugs (slower)
node qtht-ui-suite.js

# Cross-verify conflicts
diff api-results.json ui-results.json
```

---

*Consolidated bug report generated: 2026-04-17 | QA Automation via Claude Code (curl + Playwright)*
