# Bug Report — Module: Quản lý Doanh nghiệp

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | Test — http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-04-17 |
| **Loại test** | Functional Test — Module Doanh nghiệp |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [functional-test-report.md](functional-test-report.md), [test-strategy.md](../../../test-strategy.md) |

---

## Tổng hợp

Phát hiện **7** lỗi trong quá trình functional test module Quản lý Doanh nghiệp.

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 7    | 2        | 3     | 1      | 1     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-DN-001 | **Critical** | P0 | Permission | Doanh nghiệp | DN-014 | QTHT có thể CUD trên Doanh nghiệp (thiếu phân quyền backend) | Open |
| BUG-DN-002 | **Major** | P1 | Data | Doanh nghiệp | DN-006 | DN đã xóa mềm vẫn hiển thị trong danh sách/tìm kiếm | Open |
| BUG-DN-003 | **Major** | P1 | Negative | Doanh nghiệp | DN-009 | Chấp nhận quy mô DN không khớp số liệu lao động/doanh thu (BR-CALC-05) | Open |
| BUG-DN-004 | **Medium** | P1 | Happy | Doanh nghiệp | DN-010 | Import DN: Validate OK nhưng Confirm lỗi (loai_dn_id null) | Open |
| BUG-DN-005 | **Minor** | P2 | Permission | Doanh nghiệp | DN-016 | DN không có endpoint tự cập nhật hồ sơ (self-service API) | Open |
| BUG-DN-006 | **Critical** | P0 | Data | Doanh nghiệp | DN-007 | Cho phép xóa DN có vụ việc đang xử lý (guard logic thiếu) | Open |
| BUG-DN-007 | **Major** | P1 | Data | Doanh nghiệp | DN-008 | Counter tongSoVuViec + danh sách VV không cập nhật khi tạo VV | Open |

> **Chú thích Type:** `Happy` = luồng chính thành công | `Negative` = input/thao tác sai | `Edge` = giá trị biên | `Workflow` = chuyển state | `Permission` = phân quyền | `Data` = toàn vẹn dữ liệu | `UI/UX` = giao diện | `Performance` = thời gian phản hồi

> **Chú thích Severity:** `Critical` = block release/lộ dữ liệu | `Major` = tính năng quan trọng lỗi | `Medium` = tính năng phụ lỗi | `Minor` = lỗi nhỏ | `Trivial` = typo/deprecated warning

> **Chú thích Priority:** `P0` = fix ngay (block release) | `P1` = fix sprint này | `P2` = fix 2-3 sprint tới | `P3` = fix khi có thời gian | `P4` = backlog

---

## BUG-DN-001 — QTHT có thể tạo/sửa/xóa Doanh nghiệp

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Controller `/api/v1/doanh-nghieps` |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps |
| **Trình duyệt** | N/A (test API qua curl/Postman) |
| **Tài khoản** | qtht_tw (QTHT, TW) |
| **TC Reference** | DN-014 |
| **SRS Reference** | Permission Matrix — QTHT: 👁️ R (Read only) trên DOANH_NGHIEP |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Role QTHT (Quản trị hệ thống) chỉ được phép **xem (Read)** entity DOANH_NGHIEP theo Permission Matrix. Tuy nhiên, QTHT có thể thực hiện **CREATE**, **UPDATE**, và **DELETE** qua API.

### Các bước tái hiện

```
1. Login: qtht_tw / Test@1234 → OTP via MailHog
2. POST /api/v1/doanh-nghieps
   Body: {"tenDoanhNghiep":"QTHT Test","maSoThue":"6666600001","diaChi":"Test",
          "tinhThanhId":"47a97973-...","loaiDnId":"747a842e-...","quyMo":"NHO",
          "nganhNghe":"THUONG_MAI","nguoiDaiDien":"Test"}
   → Result: HTTP 201, success: true, DN created (ID: c573a0e4-...)

3. PATCH /api/v1/doanh-nghieps/c573a0e4-...
   Body: {"tenDoanhNghiep":"QTHT Updated"}
   → Result: HTTP 200, success: true, DN updated

4. DELETE /api/v1/doanh-nghieps/c573a0e4-...
   → Result: HTTP 204, DN deleted
```

### Kết quả mong đợi

Steps 2, 3, 4 phải trả về **HTTP 403 (Forbidden)** cho role QTHT.

### Kết quả thực tế

Tất cả thao tác CUD đều **thành công**.

### Bằng chứng

### So sánh (Comparison) — phân quyền theo role

| Role | GET (List) | POST (Create) | PATCH (Update) | DELETE |
|------|-----------|---------------|----------------|--------|
| CB_NV (canbo_tw) | ✅ | ✅ | ✅ | ✅ |
| **QTHT (qtht_tw)** | ✅ | ✅ **(BUG!)** | ✅ **(BUG!)** | ✅ **(BUG!)** |
| CB_PD (lanhdao_tw) | ✅ | ❌ 403 | — | — |
| DN (dn_user) | ❌ 403 | — | — | ❌ 403 |
| NHT | ❌ 403 | — | — | — |
| TVV | ❌ 403 | — | — | — |
| CG | ❌ 403 | — | — | — |

### Tác động (Impact)

- **Lỗ hổng phân quyền nghiêm trọng.** Tài khoản QTHT (vốn chỉ quản trị hệ thống) có thể thay đổi toàn bộ dữ liệu Doanh nghiệp
- Vi phạm nguyên tắc **least privilege** (đặc quyền tối thiểu)
- Ảnh hưởng tới tính toàn vẹn dữ liệu: QTHT vô tình hoặc cố ý sửa/xóa DN → mất dữ liệu nghiệp vụ
- Risk ISO 27001: không có audit trail rõ ràng cho hành động CUD của QTHT

### Nguyên nhân nghi ngờ (Root Cause)

Controller `/doanh-nghieps` thiếu role guard cho QTHT trên endpoint POST/PATCH/DELETE. Có thể backend đã cấu hình CASL ability nhưng chưa apply đúng cho role QTHT, hoặc guard chỉ check `isAuthenticated` mà không check ability.

### Gợi ý sửa (Suggested Fix)

Thêm role-based guard cho QTHT trên controller `/doanh-nghieps`:

```typescript
// Backend: Doanh nghiep controller
@Post()
@UseGuards(AbilityGuard)
@CheckAbility({ action: 'create', subject: 'DoanhNghiep' })
async create(@Body() dto: CreateDnDto) { ... }
```

Kiểm tra CASL ability backend:
- `ability.can('create', 'DoanhNghiep')` → phải trả `false` cho QTHT
- `ability.can('update', 'DoanhNghiep')` → phải trả `false` cho QTHT
- `ability.can('delete', 'DoanhNghiep')` → phải trả `false` cho QTHT

---

## BUG-DN-002 — DN đã xóa mềm vẫn hiển thị trong danh sách

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Repository/Service `DoanhNghiep` — query `findAll/search` |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps |
| **Trình duyệt** | N/A (test API qua curl/Postman) |
| **Tài khoản** | canbo_tw (CB_NV, TW) |
| **TC Reference** | DN-006 |
| **SRS Reference** | BR-DATA-01 (Soft delete) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Sau khi xóa mềm DN (HTTP 204), bản ghi có `isDeleted: true, deletedAt: "2026-04-16T18:23:57"`. Tuy nhiên, **DN vẫn xuất hiện trong kết quả list/search**.

### Các bước tái hiện

```
1. Login: canbo_tw / Test@1234
2. POST /api/v1/doanh-nghieps → Tạo DN mới (MST: 8888800001)
3. DELETE /api/v1/doanh-nghieps/{id} → HTTP 204
4. GET /api/v1/doanh-nghieps?search=8888800001
   → Result: 1 item found (isDeleted: true, deletedAt: "2026-04-16T18:23:57.239Z")
```

### Kết quả mong đợi

DN đã xóa mềm **KHÔNG** xuất hiện trong danh sách/tìm kiếm.

### Kết quả thực tế

DN vẫn hiển thị cùng các DN chưa xóa.

### Bằng chứng

API response (step 4):
```json
{
  "tenDoanhNghiep": "QA DN Xóa Test",
  "maSoThue": "8888800001",
  "isDeleted": true,
  "deletedAt": "2026-04-16T18:23:57.239Z",
  "deletedBy": "11111111-0001-4000-8000-000000000003"
}
```

### Tác động (Impact)

- User xóa DN nhưng vẫn thấy nó trong danh sách → tưởng xóa không thành công
- Có thể thao tác tiếp trên DN đã xóa → gây lỗi dữ liệu
- **Risk nhân rộng:** cần kiểm tra bug tương tự ở **tất cả module** dùng soft delete (Hỏi đáp, Vụ việc, Chi trả, TVV...)

### Nguyên nhân nghi ngờ (Root Cause)

Query `findAll/search` của `DoanhNghiepRepository` không filter `isDeleted = false`. Có thể thiếu middleware/hook global để auto-filter soft-deleted records.

### Gợi ý sửa (Suggested Fix)

**Giải pháp ngắn hạn:** Thêm filter vào query `findAll/search`:
```typescript
// DoanhNghiepService.findAll
return this.repo.find({
  where: { isDeleted: false, ...filters },
});
```

**Giải pháp dài hạn:** Dùng soft-delete plugin của ORM (ví dụ TypeORM `@DeleteDateColumn`) để tự động filter ở global level:
```typescript
@Entity()
export class DoanhNghiep {
  @DeleteDateColumn()
  deletedAt?: Date;  // ORM tự filter khi find()
}
```

**Note:** Audit toàn bộ codebase để tìm các entity khác có soft delete nhưng query không filter.

---

## BUG-DN-003 — Quy mô DN không được validate theo NĐ39/2018

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Negative |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Service `DoanhNghiep.create/update` — validation logic |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps |
| **Trình duyệt** | N/A (test API qua curl/Postman) |
| **Tài khoản** | canbo_tw (CB_NV, TW) |
| **TC Reference** | DN-009 |
| **SRS Reference** | BR-CALC-05 (Kiểm tra quy mô DNNVV), Error E3 (WRN-DN-01) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Hệ thống cho phép lưu quy mô `VUA` (Vừa: ≤ 200 LĐ, ≤ 200 tỷ DT) cho DN chỉ có **5 lao động** và **1 tỷ doanh thu** (thuộc cỡ Siêu nhỏ theo NĐ39/2018). Không có cảnh báo nào.

### Các bước tái hiện

```
1. POST /api/v1/doanh-nghieps
   Body: {"quyMo":"VUA", "soLaoDong":5, "doanhThu":1000000000, ...}
   → Result: success: true, quyMo = "VUA" (saved without warning)
```

### Kết quả mong đợi

Cảnh báo WRN-DN-01: "Quy mô VUA không khớp với số liệu lao động/doanh thu. Vẫn lưu?"

### Kết quả thực tế

DN lưu thành công với quy mô "VUA" không khớp, không có cảnh báo.

### Bằng chứng

**Tiêu chí NĐ39/2018 (Thương mại/Dịch vụ):**

| Quy mô | Lao động | Doanh thu/năm |
|--------|---------|---------------|
| Siêu nhỏ | ≤ 10 | ≤ 3 tỷ VND |
| Nhỏ | ≤ 50 | ≤ 50 tỷ VND |
| Vừa | ≤ 200 | ≤ 200 tỷ VND |

DN test: 5 LĐ + 1 tỷ DT → thuộc **Siêu nhỏ**, nhưng hệ thống chấp nhận **Vừa**.

### Tác động (Impact)

- Dữ liệu quy mô DN không chính xác → ảnh hưởng báo cáo, thống kê
- Ảnh hưởng trực tiếp module **Chi trả** (BR-CALC-01/02): mức hỗ trợ tính theo quy mô — Siêu nhỏ 100%, Nhỏ 30%, Vừa 10%
- Nếu DN khai sai quy mô (vô tình hoặc cố ý) → số tiền hỗ trợ sai → thất thoát ngân sách

### Nguyên nhân nghi ngờ (Root Cause)

Service `DoanhNghiep.create/update` không implement business rule BR-CALC-05: không tính quy mô từ `soLaoDong + doanhThu + nganhNghe` để đối chiếu với `quyMo` người dùng chọn.

### Gợi ý sửa (Suggested Fix)

Implement validation logic trong `DoanhNghiepService.create/update`:

```typescript
function calculateQuyMo(soLaoDong: number, doanhThu: number, nganhNghe: string): QuyMo {
  const isThuongMaiDichVu = ['THUONG_MAI', 'DICH_VU'].includes(nganhNghe);
  const thresholds = isThuongMaiDichVu
    ? { sieuNho: { ld: 10, dt: 3e9 }, nho: { ld: 50, dt: 50e9 }, vua: { ld: 200, dt: 200e9 } }
    : { /* thresholds cho ngành Nông/Công nghiệp */ };

  if (soLaoDong <= thresholds.sieuNho.ld && doanhThu <= thresholds.sieuNho.dt) return 'SIEU_NHO';
  if (soLaoDong <= thresholds.nho.ld && doanhThu <= thresholds.nho.dt) return 'NHO';
  return 'VUA';
}

async create(dto: CreateDnDto) {
  const calculated = calculateQuyMo(dto.soLaoDong, dto.doanhThu, dto.nganhNghe);
  if (calculated !== dto.quyMo && !dto.confirmQuyMoMismatch) {
    throw new WarningException('WRN-DN-01', `Quy mô ${dto.quyMo} không khớp với số liệu. Vẫn lưu?`);
  }
  return this.repo.save(dto);
}
```

---

## BUG-DN-004 — Import DN: loaiDoanhNghiep không resolve thành loaiDnId

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-004 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Happy |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Service `DoanhNghiepImport.validate` |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps/import/* |
| **Trình duyệt** | N/A (test API qua curl/Postman) |
| **Tài khoản** | canbo_tw (CB_NV, TW) |
| **TC Reference** | DN-010 |
| **SRS Reference** | FR-V.III-NEW-01 (Import DN từ Excel) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Import validate trả về rows là valid, nhưng import confirm lỗi 100% vì `loai_dn_id` là NULL.

### Các bước tái hiện

```
1. POST /api/v1/doanh-nghieps/import/validate
   Body: {"rows":[{"tenDoanhNghiep":"Test","maSoThue":"7777700003",
          "diaChi":"Addr","loaiDoanhNghiep":"Doanh nghiệp tư nhân",
          "quyMo":"NHO","nguoiDaiDien":"Person"}]}
   → Result: totalRows=1, validRows=1, errorRows=0 ✅

2. POST /api/v1/doanh-nghieps/import/confirm
   Body: {"validRows": [validRow from step 1]}
   → Result: totalInserted=0, totalErrors=1
   → Error: "null value in column loai_dn_id violates not-null constraint"
```

### Kết quả mong đợi

- Validate: nhận text `loaiDoanhNghiep`, lookup DANH_MUC, thêm `loaiDnId` UUID vào validRow
- Confirm: insert thành công với `loai_dn_id` có giá trị hợp lệ

### Kết quả thực tế

- Validate: mark row hợp lệ ✅ nhưng **không resolve** `loaiDoanhNghiep` thành `loaiDnId`
- Confirm: insert fail 100% vì `loai_dn_id = NULL`

### Bằng chứng

Database error log:
```
ERROR: null value in column "loai_dn_id" of relation "doanh_nghiep"
       violates not-null constraint
DETAIL: Failing row contains (..., null, ...).
```

### Tác động (Impact)

- **Chức năng Import DN hoàn toàn không hoạt động** (0% success rate)
- Block workflow nhập liệu hàng loạt → user phải nhập tay từng DN
- Trải nghiệm tệ: validate báo OK nhưng confirm lại fail → gây nhầm lẫn

### Nguyên nhân nghi ngờ (Root Cause)

Validate endpoint nhận `loaiDoanhNghiep` (text, ví dụ "Doanh nghiệp tư nhân") nhưng **không resolve** thành `loaiDnId` (UUID FK → DANH_MUC). Logic thiếu bước lookup DANH_MUC để map text → UUID. Confirm cố insert với `loai_dn_id = NULL` → violate constraint.

### Gợi ý sửa (Suggested Fix)

Trong `DoanhNghiepImport.validate`:

```typescript
async validate(rows: ImportRow[]) {
  const loaiDnList = await this.danhMucRepo.find({ where: { loai: 'LOAI_DN' } });
  const loaiDnMap = new Map(loaiDnList.map(dm => [dm.ten.toLowerCase(), dm.id]));

  return rows.map(row => {
    const loaiDnId = loaiDnMap.get(row.loaiDoanhNghiep?.toLowerCase());
    if (!loaiDnId) {
      return { ...row, valid: false, error: `Loại DN "${row.loaiDoanhNghiep}" không tồn tại trong danh mục` };
    }
    return { ...row, loaiDnId, valid: true };
  });
}
```

Validate sẽ:
1. Lookup `loaiDoanhNghiep` text → match DANH_MUC record → get UUID
2. Nếu không match → mark row as error với message rõ ràng
3. Nếu match → add `loaiDnId` UUID vào validRow

---

## BUG-DN-005 — DN role không có self-service endpoint

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-005 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Controller `/api/v1/doanh-nghieps` — self-service endpoints |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps/* |
| **Trình duyệt** | N/A (test API qua curl/Postman) |
| **Tài khoản** | dn_user (DN, không cấp) |
| **TC Reference** | DN-016 |
| **SRS Reference** | Permission Matrix — DN: 📝 RU* trên DOANH_NGHIEP |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

SRS quy định role DN có quyền RU* (Read/Update bản ghi của chính mình). Tuy nhiên, không tìm thấy endpoint self-service để DN xem/cập nhật hồ sơ của mình.

### Các bước tái hiện

```
1. Login: dn_user / Test@1234
2. Thử các endpoint self-service phổ biến:
   - GET /api/v1/doanh-nghieps/me      → 403 Forbidden
   - GET /api/v1/doanh-nghieps/profile → 403 Forbidden
   - GET /api/v1/doanh-nghieps/ho-so   → 403 Forbidden
3. Thử truy cập list:
   - GET /api/v1/doanh-nghieps → 403 (đúng, DN không được xem toàn bộ)
```

### Kết quả mong đợi

Có endpoint self-service cho phép DN:
- `GET /api/v1/doanh-nghieps/me` — xem hồ sơ của chính mình
- `PATCH /api/v1/doanh-nghieps/me` — cập nhật hồ sơ của chính mình

### Kết quả thực tế

Tất cả endpoint self-service đều trả về 403. DN không có cách nào xem/cập nhật hồ sơ của mình.

### Bằng chứng

API response cho mọi endpoint thử:
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### Tác động (Impact)

- DN không thể tự cập nhật thông tin (địa chỉ, số LĐ, doanh thu...) khi có thay đổi
- Phải nhờ CB_NV cập nhật → tăng workload cho cán bộ
- Vi phạm SRS Permission Matrix (DN có quyền RU* nhưng không có endpoint)
- **Note:** SRS có ghi chú DN là "API only" → có thể endpoint self-service nằm trong phạm vi phát triển sau, giữ Severity = Minor

### Nguyên nhân nghi ngờ (Root Cause)

Endpoint self-service chưa được implement. Permission Matrix chỉ quy định quyền trên entity, nhưng code routing chưa có route cho self-service action.

### Gợi ý sửa (Suggested Fix)

Tạo endpoint self-service cho role DN:

```typescript
@Controller('doanh-nghieps')
export class DoanhNghiepController {
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DN')
  async getMe(@Req() req) {
    return this.service.findByUserId(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DN')
  async updateMe(@Req() req, @Body() dto: UpdateDnSelfDto) {
    return this.service.updateByUserId(req.user.id, dto);
  }
}
```

Nếu scope sau: tạo ticket riêng để theo dõi trong backlog, không block release.

---

## BUG-DN-006 — Cho phép xóa DN có vụ việc đang xử lý

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-006 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Service `DoanhNghiep.delete()` — thiếu pre-check VU_VIEC |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps/{id} |
| **Trình duyệt** | N/A (test API qua curl) |
| **Tài khoản** | canbo_tw (CB_NV, TW) |
| **TC Reference** | DN-007 |
| **SRS Reference** | srs-fr-07-doanh-nghiep.md §2 Processing > Xóa mềm — bước 1 "Kiểm tra DN không có vụ việc đang xử lý"; Error E4 (ERR-DN-03) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Theo SRS, khi xóa DN hệ thống **phải kiểm tra** DN có đang liên kết với VV đang xử lý không. Nếu có → reject delete + trả error `ERR-DN-03`: "Không thể xóa DN đang có vụ việc xử lý". Hiện tại guard logic này **chưa implement** — DN bị xóa bình thường bất kể có VV active hay không.

### Các bước tái hiện

```
1. Login: canbo_tw / Test@1234
2. Tạo VV liên kết DN (DN-HGI-0006):
   POST /api/v1/vu-viecs/manual
   Body: {
     "doanhNghiepId": "6efe3b32-556a-40de-a58a-568fbb094e2a",
     "tieuDe": "QA Test VV",
     "moTa": "Test",
     "linhVucId": "3b3e0735-a79b-4914-b05e-c94cd4fb484e",
     "loaiHinhHtId": "6331c54d-b4f2-4aca-9294-bee0c789810e",
     "kenhTiepNhan": "TRUC_TIEP"
   }
   → Result: VV ID=b48b4f22-baea-4ed8-8ff8-43f3b780a261, 
             maVV=VV-BTP-TW-20260417-001, 
             trangThai=DA_TIEP_NHAN (đang xử lý)

3. DELETE /api/v1/doanh-nghieps/6efe3b32-556a-40de-a58a-568fbb094e2a
   → Result: HTTP 204 — DN bị xóa thành công (sai!)

4. Query lại DN:
   → isDeleted=true, deletedAt có giá trị
5. Query VV:
   → VV vẫn tồn tại nhưng DN cha đã bị xóa → orphan record
```

### Kết quả mong đợi

HTTP 4xx (409 Conflict hoặc 422 Unprocessable Entity) kèm body:
```json
{
  "success": false,
  "error": {
    "code": "ERR-DN-03",
    "message": "Không thể xóa DN đang có vụ việc xử lý"
  }
}
```

### Kết quả thực tế

HTTP 204 — DN bị soft-deleted mà không có cảnh báo. VV liên kết trở thành orphan.

### Bằng chứng

```
Before DELETE:
- DN: DN-HGI-0006 "QA Test DN Mới 001 - Updated" (isDeleted: false)
- VV: VV-BTP-TW-20260417-001 (trangThai: DA_TIEP_NHAN, doanhNghiepId: 6efe3b32-...)

DELETE /api/v1/doanh-nghieps/6efe3b32-...
→ HTTP 204 (no body)

After DELETE:
- DN: isDeleted: true, deletedAt: 2026-04-17T..., deletedBy: canbo_tw
- VV: vẫn tồn tại, doanhNghiepId reference đến DN đã xóa (orphan)
```

### Tác động (Impact)

- **Vi phạm referential integrity:** VV "orphan" sau khi DN bị xóa → mất context nghiệp vụ
- **Vi phạm SRS nghiêm trọng:** requirement chính của nghiệp vụ (Xóa mềm §2 bước 1) không được thực thi
- **Data loss:** mất lịch sử hỗ trợ pháp lý của DN — ảnh hưởng thống kê, báo cáo
- **Audit risk:** không thể truy vết VV về DN cha, ảnh hưởng tuân thủ quy định

### Nguyên nhân nghi ngờ (Root Cause)

Service `deleteDoanhNghiep(id)` chỉ thực hiện soft delete trực tiếp mà không pre-check bảng `VU_VIEC`. Tương tự có thể áp dụng cho `HO_SO_CHI_TRA` — cần verify.

### Gợi ý sửa (Suggested Fix)

Thêm pre-check trong service:

```typescript
async delete(id: string) {
  const activeVuViecCount = await this.vuViecRepository.count({
    where: {
      doanhNghiepId: id,
      isDeleted: false,
      trangThai: Not(In(['HOAN_THANH', 'HUY', 'DONG'])),
    },
  });

  if (activeVuViecCount > 0) {
    throw new ConflictException({
      code: 'ERR-DN-03',
      message: 'Không thể xóa DN đang có vụ việc xử lý',
    });
  }

  // Proceed with soft delete
  return this.repository.softDelete(id);
}
```

**Lưu ý:** cần định nghĩa chính xác các trạng thái VV được coi là "đang xử lý" (liệt kê ở `SM-VUVIEC`).

---

## BUG-DN-007 — Counter tongSoVuViec + danh sách VV không cập nhật khi tạo VV mới

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-DN-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản lý Doanh nghiệp |
| **Thành phần** | Service `DoanhNghiep.findOne()` + event handler khi tạo VV |
| **URL** | http://103.172.236.130:3000/api/v1/doanh-nghieps/{id} |
| **Trình duyệt** | N/A (test API qua curl) |
| **Tài khoản** | canbo_tw (CB_NV, TW) |
| **TC Reference** | DN-008 |
| **SRS Reference** | srs-fr-07-doanh-nghiep.md §2 Processing > Xem lịch sử hỗ trợ (bước 1-3) + SCR-V.III-02 Tab "Lịch sử Hỗ trợ" (3 KPI) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation (Claude Code) |

### Mô tả

Khi tạo VV liên kết DN qua `POST /vu-viecs/manual`:
1. Counter `tongSoVuViec` trên entity DOANH_NGHIEP **không tự tăng** (vẫn = 0)
2. API `GET /doanh-nghieps/{id}` **không trả về** danh sách VV liên kết

### Các bước tái hiện

```
1. Login: canbo_tw / Test@1234
2. GET /api/v1/doanh-nghieps/6efe3b32-... (DN-HGI-0006)
   → Response: tongSoVuViec: 0

3. POST /api/v1/vu-viecs/manual (payload hợp lệ, link DN ở trên)
   → Result: VV tạo thành công, ID=b48b4f22-..., trangThai=DA_TIEP_NHAN

4. GET /api/v1/doanh-nghieps/6efe3b32-... (lại lần 2)
   → Response: 
       - tongSoVuViec: 0     ← SAI, phải = 1
       - tongChiPhiHoTro: 0.00
       - Không có property `vuViecs`/`danhSachVuViec`/`lichSuHoTro`
```

### Kết quả mong đợi

- `tongSoVuViec` = số VV liên kết (chưa xóa) = 1
- Response kèm list VV (hoặc có endpoint con `GET /doanh-nghieps/{id}/vu-viecs`)
- Các KPI trên tab Lịch sử Hỗ trợ hiển thị chính xác: Tổng VV / VV hoàn thành / Tổng chi phí

### Kết quả thực tế

- `tongSoVuViec` = 0 bất kể đã tạo VV
- Không có list VV trong response detail
- Không tìm thấy endpoint con trả về list VV của DN

### Bằng chứng

```json
// GET /api/v1/doanh-nghieps/6efe3b32-...
{
  "success": true,
  "data": {
    "id": "6efe3b32-556a-40de-a58a-568fbb094e2a",
    "maDoanhNghiep": "DN-HGI-0006",
    "tenDoanhNghiep": "QA Test DN Mới 001 - Updated",
    "tongSoVuViec": 0,         // ← SAI
    "tongChiPhiHoTro": "0.00",
    // ... không có property vuViecs
  }
}
```

### Tác động (Impact)

- **Tab Lịch sử Hỗ trợ trên UI sẽ trống** dù DN đã có VV — user hiểu nhầm là chưa có hỗ trợ nào
- **3 KPI trên SCR-V.III-02 sai:** Tổng VV / VV hoàn thành / Tổng chi phí đều không chính xác
- **Báo cáo thống kê HTPL sai số** — nếu báo cáo lấy từ counter này
- **Vi phạm SRS §2 "Xem lịch sử hỗ trợ"** — yêu cầu chính không hoạt động

### Nguyên nhân nghi ngờ (Root Cause)

1. Service `createVuViecManual()` không trigger update counter trên bảng `DOANH_NGHIEP`
2. Không có DB trigger hoặc event listener để sync counter
3. API `findOne()` của DoanhNghiep không JOIN/populate VU_VIEC list

### Gợi ý sửa (Suggested Fix)

**Option 1: Event-driven update (recommended)**

```typescript
@OnEvent('vu-viec.created')
async handleVuViecCreated(event: VuViecCreatedEvent) {
  await this.doanhNghiepRepository.increment(
    { id: event.doanhNghiepId },
    'tongSoVuViec',
    1,
  );
}

@OnEvent('vu-viec.deleted')
async handleVuViecDeleted(event: VuViecDeletedEvent) {
  await this.doanhNghiepRepository.decrement(
    { id: event.doanhNghiepId },
    'tongSoVuViec',
    1,
  );
}
```

**Option 2: Computed on read**

Bỏ counter lưu trữ, luôn COUNT(*) realtime khi GET detail. Đơn giản nhưng chậm nếu dữ liệu lớn.

**Option 3: Thêm endpoint con**

```typescript
@Get(':id/vu-viecs')
async getVuViecsByDn(@Param('id') id: string, @Query() params) {
  return this.vuViecService.findByDoanhNghiepId(id, params);
}
```

Đề xuất: **Option 1 + Option 3** — counter để hiển thị KPI nhanh, endpoint con để lấy list chi tiết.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| MailHog (OTP) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1/ |
| Backend | NestJS + TypeORM + PostgreSQL + CASL |
| Xác thực | JWT + OTP qua email |
| Đường dẫn source | /home/ubuntu/dopai/pm-htpldn/source_code/ |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| qtht_tw | QTHT | TW | BUG-DN-001 |
| canbo_tw | CB_NV | TW | BUG-DN-002, BUG-DN-003, BUG-DN-004, BUG-DN-006, BUG-DN-007 |
| lanhdao_tw | CB_PD | TW | BUG-DN-001 (comparison) |
| dn_user | DN | — | BUG-DN-001 (comparison), BUG-DN-005 |

### C — Danh mục ảnh chụp

Folder `screenshots/` hiện **trống** — các bug ở module này được test chủ yếu qua API (curl/Postman), không có screenshot UI.

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| (chưa có) | — | — |

---

*Bug report generated: 2026-04-17 | QA Automation via Claude Code*
