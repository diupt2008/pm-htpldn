# Bug Report — Chương trình HTPLDN (Module 7.15)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 (deploy 2026-04-16) |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | Claude + `/qa-only` (Playwright headless + API direct) |
| **Ngày** | 2026-04-20 |
| **Loại test** | Smoke + Data Readiness + Functional (Round 2 / Lệnh 1+2+3+4) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [functional-test-report-chuong-trinh-HTPLDN.md](functional-test-report-chuong-trinh-HTPLDN.md), [data-readiness-chuong-trinh-HTPL.md](data-readiness-chuong-trinh-HTPL.md), [SRS FR-XI](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) |

---

## Tổng hợp

Phát hiện **10** findings qua 4 lệnh test (smoke + data readiness + functional) cho module Chương trình HTPLDN.

| Tổng | Critical | Major | Medium | Minor | Observation |
|------|----------|-------|--------|-------|-------------|
| 10   | 2        | 2     | 2      | 3     | 1           |

**Breakdown theo assignee:**
- **BE team:** 3 bugs (1 Critical scope, 1 Critical workflow, 1 Medium test data)
- **FE team:** 5 bugs (1 Major feature, 1 Major permission, 1 Medium i18n, 2 Minor)
- **Shared (UI polish):** 2 (1 Minor + 1 Observation)

---

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Section | Status |
|--------|----------|----------|------|--------|--------|-------|---------|--------|
| BUG-CT-BE-001 | Critical | P0 | Data | CT HTPLDN | CT-005 | Soft-delete record vẫn xuất hiện trong list API (vi phạm BR-DATA-01) | **A. BE** | Open |
| BUG-BE-CT-001 | Critical | P0 | Workflow | CT HTPLDN | CT-007..CT-038 | 8 transition endpoints trả 403 Forbidden (block 100% lifecycle) | **A. BE** | Open |
| BUG-CT-FE-003 | Major | P1 | Feature | CT HTPLDN | CT-020..CT-038 | Tab "Đợt báo cáo" placeholder "Story 13.6" — feature chưa build | **B. FE Major** | Open |
| BUG-CT-PERM-001 | Major | P1 | Permission | CT HTPLDN | CT-206 | QTHT có nút "+ Thêm Chương trình" enabled (trái 👁️R spec) | **B. FE Major** | Open |
| BUG-CT-UI-002 | Medium | P2 | UI/UX | CT HTPLDN | CT-006 | Nút upload file hiển thị "单击上传" (tiếng Trung) | **C. FE UI** | Open |
| BUG-TEST-ACCOUNT-001 | Medium | P2 | Test Data | Global | CT-201..204 | 3 account canbo_tw/bn/dp chia sẻ 1 donViId → scope isolation không test được | **D. Test Data** | Open |
| BUG-CT-UI-005 | Minor | P2 | Validation | CT HTPLDN | CT-103 | FE NumberInput accept `-100` visually (không client-side validate) | **C. FE UI** | Open |
| BUG-CT-UI-001 | Minor | P2 | UI/UX | CT HTPLDN | CT-002 | Field "Đơn vị" trong detail hiển thị `-` thay vì tên đơn vị user | **C. FE UI** | Open |
| BUG-CT-UI-006 | Minor | P3 | UI/UX | CT HTPLDN | CT-207 | Menu cho TVV hiển thị disabled thay vì ẩn hoàn toàn | **C. FE UI** | Open |
| OBS-CT-02 | Observation | — | UI | CT HTPLDN | — | Thanh tiến trình detail hiện 6 step (thiếu TAM_DUNG + HUY) | **E. Observation** | Info |

> **Chú thích Severity:**
> - `Critical` — block usage, vi phạm BR, data integrity issue, workflow không chạy được
> - `Major` — feature không dùng được, permission leak, user-facing workflow chặn
> - `Medium` — tính năng phụ lỗi hoặc UX tệ, có workaround
> - `Minor` — cosmetic, không block nghiệp vụ
> - `Observation` — ghi nhận để clarify spec, chưa chắc là bug

---

# SECTION A — BE Critical Bugs (Ưu tiên fix trước)

## BUG-CT-BE-001 — Critical — Soft-delete không filter khỏi list API

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-BE-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data / BR violation |
| **Status** | Open |
| **Module** | Chương trình HTPLDN — API `/chuong-trinh-htpls` |
| **Thành phần** | BE: `ChuongTrinhHtplService.findAll()` + `findOne()` trong module `chuong-trinh-htpl.service.ts` |
| **URL** | `GET /api/v1/chuong-trinh-htpls?page=1&pageSize=100` |
| **Tài khoản** | `canbo_tw` (CB_TW) |
| **TC Reference** | CT-005 |
| **SRS Reference** | BR-DATA-01 (soft delete BR) |
| **Assignee** | **Backend Team** |

### Mô tả

Sau khi DELETE soft-delete 1 CT (trạng thái `is_deleted=true, deletedAt=..., deletedBy=...`), GET list API vẫn trả record đó. List response cũng **không có field `isDeleted`** → FE không thể tự filter.

### Các bước tái hiện

1. Login `canbo_tw` → lấy JWT
2. Tạo 1 CT DU_THAO: `POST /chuong-trinh-htpls` → nhận `id=cac1d071-9602-4c34-a521-1ecfbb8248d3`, `maChuongTrinh=CT-20260420-0006`
3. Xóa CT: `DELETE /chuong-trinh-htpls/{id}` → HTTP 204 (success)
4. GET single: `GET /chuong-trinh-htpls/{id}` → response có `"isDeleted": true, "deletedAt": "2026-04-19T17:35:01.379Z", "deletedBy": "..."` ✅
5. GET list: `GET /chuong-trinh-htpls?page=1&pageSize=100` → record CT-20260420-0006 **vẫn xuất hiện** trong `data[]`, `meta.total=7` ❌
6. Xem UI `/ct-htpldn/danh-sach` → record hiển thị trong bảng với đầy đủ Sửa/Xóa buttons

### Kết quả mong đợi

- BR-DATA-01: Record `is_deleted=true` PHẢI bị filter khỏi list response
- `meta.total` đếm chỉ record active (alive)
- Record chỉ visible khi query explicit `?includeDeleted=true` (nếu BE support)

### Kết quả thực tế

```
GET /api/v1/chuong-trinh-htpls?page=1&pageSize=100
Authorization: Bearer <canbo_tw>

Response:
{
  "success": true,
  "data": [
    { "maChuongTrinh": "CT-20260420-0007", "isDeleted": null, ... },
    { "maChuongTrinh": "CT-20260420-0006", "isDeleted": null, ... },  ← DELETED nhưng vẫn xuất hiện, isDeleted=null
    { "maChuongTrinh": "CT-20260420-0005", "isDeleted": null, ... },
    ...
  ],
  "meta": { "total": 7, "totalPages": 1 }  ← total=7 bao gồm 1 deleted
}
```

GET single cho thấy thật sự là `isDeleted: true`:

```
GET /api/v1/chuong-trinh-htpls/cac1d071-9602-4c34-a521-1ecfbb8248d3
{ "data": { "isDeleted": true, "deletedAt": "2026-04-19T17:35:01.379Z", "deletedBy": "..." } }
```

### Bằng chứng

- Screenshot: [screenshots/list-soft-delete-leaked.png](screenshots/list-soft-delete-leaked.png)
- JSON response: paste inline ở §Kết quả thực tế

### Tác động (Impact)

- **100% user** gặp lỗi này (với bất kỳ CT bị xóa nào)
- **User confusion:** thấy record đã xóa, click vào edit → có thể nhận lỗi BE hoặc update record đã xóa
- **Audit compliance:** vi phạm BR-DATA-01 — soft delete vô nghĩa nếu record vẫn hiển thị
- **Downstream:** các module khác (Báo cáo thống kê FR-11) nếu JOIN với CT_HTPL bảng có thể double-count

### Nguyên nhân nghi ngờ (Root Cause)

BE query `SELECT * FROM CHUONG_TRINH_HTPL WHERE ...` thiếu `AND is_deleted = false` trong `findAll()`. Có thể do:
- Không dùng TypeORM `@SoftDelete` decorator hoặc không enable `where: { isDeleted: false }` ở service layer
- Hoặc dùng raw query/QueryBuilder không include filter

### Gợi ý sửa (Suggested Fix)

Nếu dùng TypeORM, thêm vào entity:
```typescript
@Entity()
export class ChuongTrinhHtpl {
  @DeleteDateColumn()
  deletedAt?: Date;
  // TypeORM auto-filter softDelete records unless withDeleted: true
}
```

Hoặc ở service:
```typescript
findAll(query) {
  return this.repo.find({
    where: { isDeleted: false, ...restFilter },
    ...
  });
}
```

Verify bằng re-run test CT-005 → GET list phải không thấy CT-20260420-0006.

---

## BUG-BE-CT-001 — Critical — 8 transition endpoints trả 403 Forbidden

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-BE-CT-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Workflow / Permission |
| **Status** | Open |
| **Module** | Chương trình HTPLDN — 8 transition endpoints |
| **Thành phần** | BE CASL guard + seed permissions (`permissions.json` hoặc equivalent) |
| **URL** | `POST /api/v1/chuong-trinh-htpls/{id}/{submit,cancel,activate,complete,pause,resume,publish,unpublish}` |
| **Tài khoản** | `canbo_tw`, `canbo_bn`, `canbo_tinh`, `lanhdao_tw` (tất cả return 403) |
| **TC Reference** | CT-007, CT-008, CT-009, CT-010, CT-011, CT-012, CT-013, CT-014, CT-015, CT-016, CT-018, CT-019, CT-020..CT-038 (ảnh hưởng 24 TC) |
| **SRS Reference** | FR-XI-03, FR-XI-04, FR-XI-05, FR-XI-05a, FR-XI-06, FR-XI-07, FR-XI-07a, FR-XI-08, FR-XI-09 |
| **Assignee** | **Backend Team** |

### Mô tả

Tất cả transition endpoints để chuyển state CT đều return 403 với mọi role. Endpoint EXISTS (HATEOAS `_links` trả về), permission `approve_chuong_trinh_htpl` có trong JWT, nhưng BE CASL guard block. Kết quả: không đẩy được CT qua CHO_PHE_DUYET → lifecycle 100% stuck ở DU_THAO.

### Các bước tái hiện

1. Login `canbo_tw` → JWT có permissions `create_chuong_trinh_htpl`, `update_chuong_trinh_htpl`, `delete_chuong_trinh_htpl`, `approve_chuong_trinh_htpl`, `read_chuong_trinh_htpl`
2. Tạo CT DU_THAO OK (status 201)
3. Thử submit: `POST /api/v1/chuong-trinh-htpls/{id}/submit` với body `{"version":1}` → **403 Forbidden** (`ERR-PERM-SYS-00-01`)
4. Thử các endpoint khác: cancel/activate/complete/pause/resume/publish/unpublish — đều 403
5. `/approve` endpoint exists và accept perm (trả 422 khi thiếu `quyetDinh`), nhưng chỉ work khi state=CHO_PHE_DUYET → bị chặn vì không submit được

### Kết quả mong đợi

- `POST /submit` với role `CB_TW` có perm → 200, CT chuyển sang CHO_PHE_DUYET
- `POST /cancel` với creator → 200, CT chuyển HUY
- Workflow lifecycle đầy đủ 8 state reachable

### Kết quả thực tế

| Endpoint | HTTP | Error |
|----------|------|-------|
| `POST /submit` | **403** | `ERR-PERM-SYS-00-01 "Forbidden"` (canbo_tw + lanhdao_tw) |
| `POST /cancel` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /activate` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /complete` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /pause` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /resume` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /publish` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /unpublish` | **403** | `ERR-PERM-SYS-00-01` |
| `POST /approve` | 422 (endpoint OK) | `quyetDinh must be one of PHE_DUYET, TU_CHOI` (state check blocks vì DU_THAO) |

### Tác động

- **24 TC BLOCKED** (Nhóm 3a CT workflow 13 + Nhóm 3b BC workflow 11)
- **Module 100% không dùng được cho business purpose** — chỉ tạo/sửa/xóa draft, không approve/publish
- **Pattern lặp BUG-BE-M8-002** (Đánh giá Hiệu quả FR-08) — cùng root cause: seed perms + CASL mapping không đồng bộ với transition endpoints

### Nguyên nhân nghi ngờ (Root Cause)

BE CASL ability rule cho transition actions yêu cầu perms cụ thể (ví dụ `submit_chuong_trinh_htpl`, `activate_chuong_trinh_htpl`) không có trong seed `permissions.json`. JWT chỉ emit `create/read/update/delete/approve` cho CT_HTPL → guard match fail → 403.

### Gợi ý sửa (Suggested Fix)

Option A (thêm perms vào seed):
```json
// permissions.json — thêm 8 entries cho CT_HTPL
"submit_chuong_trinh_htpl"
"cancel_chuong_trinh_htpl"
"activate_chuong_trinh_htpl"
"complete_chuong_trinh_htpl"
"pause_chuong_trinh_htpl"
"resume_chuong_trinh_htpl"
"publish_chuong_trinh_htpl"
"unpublish_chuong_trinh_htpl"
```

Option B (generic `manage_chuong_trinh_htpl` perm cho creator/approver):
```typescript
// BE CASL rule
can('submit', 'ChuongTrinhHtpl', { createdBy: user.id });
can('cancel', 'ChuongTrinhHtpl', { createdBy: user.id, trangThai: 'DU_THAO' });
can('publish', 'ChuongTrinhHtpl', { trangThai: 'DA_DUYET', roleInUnit: 'CB_NV' });
// v.v.
```

Verify bằng re-run CT-007 (submit) + CT-008 (approve với lanhdao_tw) → CT reach DA_DUYET.

**Estimated fix:** 1-2h (seed perms) hoặc 2-3 ngày (CASL redesign).

---

# SECTION B — FE Major Bugs

## BUG-CT-FE-003 — Major — Tab "Đợt báo cáo" chưa build (placeholder Story 13.6)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-FE-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Feature missing |
| **Status** | Open |
| **Module** | CT HTPLDN detail — tab 3 |
| **Thành phần** | FE: `src/pages/ct-htpldn/detail/tab-dot-bao-cao.tsx` (hoặc tương tự) |
| **URL** | `http://103.172.236.130:3000/ct-htpldn/{uuid}` — click tab "Đợt báo cáo" |
| **Tài khoản** | `canbo_tw` (mọi role) |
| **TC Reference** | CT-020, CT-021, CT-022, CT-023, CT-024, CT-027..CT-038 |
| **SRS Reference** | FR-XI-05a, UC195, UC196, UC169..UC172 |
| **Assignee** | **Frontend Team** |

### Mô tả

Tab "Đợt báo cáo" trong trang detail CT hiển thị placeholder empty state với text **"Tính năng sẽ được triển khai ở Story 13.6"**. Không có bảng đợt BC, không có nút `+ Tạo đợt mới`, không có info-box deadline TT17/2025.

### Các bước tái hiện

1. Login `canbo_tw` → navigate đến `/ct-htpldn/danh-sach`
2. Click "Xem" vào CT bất kỳ → vào detail page `/ct-htpldn/{uuid}`
3. Click tab "Đợt báo cáo" (tab 3)
4. Quan sát: empty state với biểu tượng thùng rác + text placeholder

### Kết quả mong đợi

Per SRS SCR-XI-01 và FR-XI-05a:
- Bảng đợt BC với cột: Mã đợt / Kỳ / Từ-Đến / Trạng thái / Thao tác
- Nút `+ Tạo đợt mới` (enabled khi CT state DANG_THUC_HIEN hoặc HOAN_THANH)
- Info-box deadline TT17/2025 (Sơ bộ 6T: 10/06 ĐP-BN, 20/06 TW; Sơ bộ năm: 10/11, 20/11; Tròn năm: 10/01 năm sau, 20/01 năm sau)
- Highlight đỏ khi `han_nop − today < 7 ngày`

### Kết quả thực tế

```
Tab Đợt báo cáo
[Empty state illustration - thùng rác]
Tính năng sẽ được triển khai ở Story 13.6
```

### Bằng chứng

Screenshot: [screenshots/ct-detail-dot-bc-placeholder.png](screenshots/ct-detail-dot-bc-placeholder.png)

### Tác động

- **100% user** không test được đợt BC lifecycle (SM-DOT-BC 6 state + BAO_CAO_CT_HTPL 4 state)
- **11 TC Nhóm 3b BLOCKED** kể cả khi BE fix BUG-BE-CT-001
- Không thể test TW tổng hợp (CT-038) — feature core của FR-XI

### Gợi ý sửa

Implement Story 13.6: Tab Đợt báo cáo với:
- Table đợt BC (gọi API `/chuong-trinh-htpls/{id}/dot-bao-caos` — endpoint cần BE có sẵn)
- Info-box deadline với logic tính `han_nop − today`
- Nút `+ Tạo đợt mới` với guard theo state CT (enable khi DANG_THUC_HIEN/HOAN_THANH)

**Estimated:** 2-3 ngày FE (+ BE API đợt BC nếu chưa có).

---

## BUG-CT-PERM-001 — Major — QTHT có nút "+ Thêm Chương trình" enabled (trái 👁️R spec)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-PERM-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission / UI |
| **Status** | Open |
| **Module** | CT HTPLDN — list page |
| **Thành phần** | FE: `src/pages/ct-htpldn/list/index.tsx` + CASL ability-rule |
| **URL** | `http://103.172.236.130:3000/ct-htpldn/danh-sach` |
| **Tài khoản** | `qtht_tw` (QTHT cấp TW) |
| **TC Reference** | CT-206 |
| **SRS Reference** | BR-AUTH-01 (QTHT 👁️R — read-only) |
| **Assignee** | **Frontend Team** |

### Mô tả

Role QTHT phải chỉ có quyền 👁️R (Read-only) cho CT HTPLDN per BR-AUTH-01. Nhưng UI vẫn hiển thị nút **"+ Thêm Chương trình"** enabled trên list page. Click vào sẽ navigate đến form tạo (tuy BE có thể reject 403, nhưng UI không nên cho phép access).

### Các bước tái hiện

1. Login `qtht_tw` / `Test@1234` + OTP `666666`
2. Navigate đến menu "Quản lý chương trình hỗ trợ pháp lý doanh nghiệp"
3. Quan sát: list hiển thị 7 rows ✅ (read OK)
4. Per-row: không có nút "Sửa"/"Xóa" ✅ (correct)
5. **Top-right: nút `+ Thêm Chương trình` visible + enabled** ❌
6. Click button → navigate to `/ct-htpldn/tao-moi` → form hiển thị

### Kết quả mong đợi

Per 👁️R spec (QTHT chỉ đọc):
- Nút `+ Thêm Chương trình` **không visible** (hoặc disabled)
- Không có any Create/Edit/Delete button

### Kết quả thực tế

```json
{
  "canRead": true,
  "rowCount": 7,
  "hasAddButton": true,
  "addBtnVisible": [{
    "text": "Thêm Chương trình",
    "disabled": false,
    "visible": true
  }],
  "editBtns": 0,   // ✅ đúng
  "deleteBtns": 0  // ✅ đúng
}
```

### Bằng chứng

Screenshot: [screenshots/ct-206-qtht-list.png](screenshots/ct-206-qtht-list.png) — QTHT list với nút `+ Thêm Chương trình`.

### So sánh (Comparison) — pattern lặp các module khác

| Role | M5 Chi trả | M6 DN | M7 Biểu mẫu | M8.1 Đào tạo | M8.2 Đánh giá | M8.3 TVCS | **M7.15 CT HTPLDN (this)** |
|------|-----------|-------|-------------|--------------|---------------|-----------|----------------------------|
| QTHT `+ Tạo mới` visible | ❌ BUG-PERM-M5-001 | ❌ BUG-PERM-M6-001 | ❌ BUG-PERM-M7-001 | ❌ BUG-PERM-M8.1-001 | ❌ BUG-PERM-M8.2-002 | ❌ BUG-PERM-M8.3-001 | ❌ **BUG-CT-PERM-001** |

**Pattern:** Fix 1 dòng FE `ability-rule` có thể unblock cả 7 module. Đề xuất: review global ability rule cho role QTHT — đảm bảo `cannot('create', <all entities>)` khi role=QTHT.

### Gợi ý sửa

```typescript
// src/utils/auth-rules.ts hoặc tương tự
if (user.vaiTro.includes('QTHT')) {
  // QTHT chỉ đọc mọi entity nghiệp vụ
  cannot('create', ['ChuongTrinhHtpl', 'HoSoChiTra', 'DoanhNghiep', 'KeHoachDanhGia', ...]);
  cannot('update', ['ChuongTrinhHtpl', 'HoSoChiTra', 'DoanhNghiep', 'KeHoachDanhGia', ...]);
  cannot('delete', ['ChuongTrinhHtpl', 'HoSoChiTra', 'DoanhNghiep', 'KeHoachDanhGia', ...]);
}
```

UI:
```tsx
<Button type="primary" hidden={ability.cannot('create', 'ChuongTrinhHtpl')}>
  + Thêm Chương trình
</Button>
```

**Estimated:** 30 phút (áp dụng global cho 7+ module). High ROI fix.

---

# SECTION C — FE UI Bugs (Medium & Minor)

## BUG-CT-UI-002 — Medium — Nút upload file hiển thị tiếng Trung "单击上传"

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-UI-002 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX (i18n) |
| **Module** | CT HTPLDN — form tạo CT |
| **Thành phần** | FE: Antd locale config + `src/pages/ct-htpldn/tao-moi/index.tsx` (Upload component) |
| **URL** | `/ct-htpldn/tao-moi` |
| **TC Reference** | CT-006 |
| **Assignee** | **Frontend Team** |

### Mô tả

Nút upload file đính kèm hiển thị text tiếng Trung **"单击上传"** (tạm dịch: "Click để upload") thay vì tiếng Việt. Có thể do Ant Design default locale Chinese leak khi `ConfigProvider` locale không phủ hết component.

### Các bước tái hiện

1. Login `canbo_tw` → `/ct-htpldn/tao-moi`
2. Scroll xuống field "File đính kèm"
3. Quan sát: nút `⬆ 单击上传`

### Kết quả mong đợi

Nút hiển thị tiếng Việt: `⬆ Tải lên` hoặc `⬆ Chọn file` (phù hợp với toàn app dùng vi_VN)

### Kết quả thực tế

Text button: `单击上传` (Chinese)

### Bằng chứng

Screenshot [screenshots/app-form-full.png](screenshots/app-form-full.png) — vị trí "File đính kèm" phần dưới form.

### Gợi ý sửa

Check `src/main.tsx` hoặc root provider:
```tsx
import viVN from 'antd/locale/vi_VN';
// ...
<ConfigProvider locale={viVN}>
  <App />
</ConfigProvider>
```

Nếu đã có: explicit pass `locale` prop vào `<Upload>` component hoặc custom text:
```tsx
<Upload>
  <Button icon={<UploadOutlined />}>Tải lên</Button>
</Upload>
```

---

## BUG-CT-UI-005 — Minor — FE NumberInput accept ngân sách < 0

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-UI-005 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Validation / UX |
| **Module** | CT HTPLDN — form tạo CT |
| **Thành phần** | FE `<InputNumber>` cho field `nganSach` |
| **URL** | `/ct-htpldn/tao-moi` |
| **TC Reference** | CT-103 |
| **Assignee** | **Frontend Team** |

### Mô tả

Field Ngân sách (VNĐ) là `Antd InputNumber` nhưng không có constraint `min={0}`. User gõ `-100` → input accept, hiển thị `-100` không error. BE block khi submit (`ERR-VAL-SYS-00-01 "nganSach must not be less than 0"`) → end-to-end safe, nhưng UX tệ (user phải submit mới biết sai).

### Các bước tái hiện

1. Login `canbo_tw` → form tạo CT
2. Focus field "Ngân sách (VNĐ)"
3. Gõ `-100`
4. Quan sát: input accept value, không error inline

### Kết quả mong đợi

- Inline error ngay khi input < 0: "Ngân sách phải >= 0"
- Hoặc `InputNumber min={0}` → block keypress âm

### Kết quả thực tế

Input accept `-100`, không error. Submit → BE trả 422.

### Bằng chứng

Screenshot [screenshots/ct-103-budget-input-accepted.png](screenshots/ct-103-budget-input-accepted.png) — form với field Ngân sách hiển thị `-100`.

### Gợi ý sửa

```tsx
<Form.Item name="nganSach" label="Ngân sách (VNĐ)"
  rules={[{ type: 'number', min: 0, message: 'Ngân sách phải >= 0' }]}>
  <InputNumber min={0} style={{ width: '100%' }} />
</Form.Item>
```

---

## BUG-CT-UI-001 — Minor — Field "Đơn vị" trong detail hiển thị `-`

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-UI-001 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Module** | CT HTPLDN — detail page tab Thông tin |
| **TC Reference** | CT-002 (create + view detail) |
| **Assignee** | **Frontend Team** |

### Mô tả

Detail page CT, tab "Thông tin", field đầu tiên "Đơn vị" hiển thị `-` (dash) thay vì tên đơn vị user (ví dụ "Cục Bổ trợ tư pháp — Bộ Tư pháp" cho canbo_tw).

### Các bước tái hiện

1. Login `canbo_tw` → click vào 1 CT bất kỳ → detail page
2. Tab "Thông tin" → field "Đơn vị"
3. Quan sát: giá trị `-`

### Kết quả mong đợi

Hiển thị tên đơn vị user tạo CT. CT record có `donViId` → FE resolve ra tên hiển thị.

### Kết quả thực tế

Hiển thị `-` (placeholder cho value missing).

### Bằng chứng

Screenshot [screenshots/ct-detail-thongtin-render.png](screenshots/ct-detail-thongtin-render.png) — field "Đơn vị: -"

### Gợi ý sửa

- Option A: BE populate `donVi.ten` trong GET detail response (recommended)
- Option B: FE gọi thêm `GET /don-vi/{id}` và resolve

Nếu BE response đã có `donViId` nhưng không có `donVi` object, nên thêm `relations: ['donVi']` vào TypeORM query.

---

## BUG-CT-UI-006 — Minor — Menu cho TVV hiển thị disabled thay vì ẩn

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-CT-UI-006 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | UI/UX |
| **Module** | Sidebar navigation |
| **Thành phần** | FE: `src/components/AppShell/Sidebar.tsx` + `nav-structure.ts` |
| **TC Reference** | CT-207 |
| **Assignee** | **Frontend Team** |

### Mô tả

Role TVV (Tư vấn viên) login → sidebar vẫn hiển thị menu "Quản lý chương trình hỗ trợ pháp lý doanh nghiệp" với style disabled (xám, không click được). Per spec CT-207: "NHT/TVV/CG/DN/GV **không thấy** menu CT HTPLDN (❌)" → nên ẩn hoàn toàn.

### Các bước tái hiện

1. Login `tvv_user` / `Test@1234` + OTP `666666`
2. URL landing `/403` (TVV không có dashboard)
3. Quan sát sidebar: menu "Quản lý chương trình hỗ trợ pháp lý doanh nghiệp" hiển thị (xám)

### Kết quả mong đợi

Menu ẩn hoàn toàn với role TVV/NHT/CG/DN/GV (không có `read_chuong_trinh_htpl` perm)

### Kết quả thực tế

Menu visible với `disabled: true` (grayed out).

### Bằng chứng

Screenshot [screenshots/ct-207-tvv-menu.png](screenshots/ct-207-tvv-menu.png)

### Gợi ý sửa

Trong `nav-structure.ts` hoặc sidebar render logic:
```tsx
{ability.can('read', 'ChuongTrinhHtpl') && (
  <MenuItem key="ct-htpldn" onClick={() => nav('/ct-htpldn/danh-sach')}>
    Quản lý chương trình hỗ trợ pháp lý doanh nghiệp
  </MenuItem>
)}
```

Thay vì:
```tsx
<MenuItem key="ct-htpldn" disabled={!ability.can('read', 'ChuongTrinhHtpl')}>
```

---

# SECTION D — Test Environment / Data Bugs

## BUG-TEST-ACCOUNT-001 — Medium — 3 account canbo_tw/bn/dp share donViId

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TEST-ACCOUNT-001 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Test Data (BE seed) |
| **Status** | Open |
| **Module** | Global — ảnh hưởng test scope isolation mọi module |
| **Thành phần** | BE seed data: `seed/tai-khoans.json` hoặc DB migration |
| **Tài khoản** | `canbo_tw`, `canbo_bn`, `canbo_tinh` |
| **TC Reference** | CT-201, CT-202, CT-203, CT-204 (và các test scope isolation module khác) |
| **SRS Reference** | BR-AUTH-01 (scope theo đơn vị) |
| **Assignee** | **Backend Team / DevOps** |

### Mô tả

Per test-strategy.md §1.2, 3 account nên map:
- `canbo_tw` → Cục BTTP - Bộ Tư pháp (cấp TW)
- `canbo_bn` → Bộ KH&ĐT (cấp BN)
- `canbo_tinh` → Sở TP HN (cấp DP)

Nhưng thực tế `/auth/me` trả:
```
canbo_tw:    donViId: 00000000-0000-4000-8000-000000000001, capDonVi: DP
canbo_bn:    donViId: 00000000-0000-4000-8000-000000000001, capDonVi: DP  ← SAME!
canbo_tinh:  donViId: 00000000-0000-4000-8000-000000000001, capDonVi: DP  ← SAME!
```

→ 3 account chia sẻ 1 donVi → không test scope isolation được.

### Tác động

- CT-201 (CB_TW thấy all, CB_BN/DP scoped) — không test được
- Tương tự mọi module có cross-unit scope (M5 Chi trả, M6 DN, M8.1 Đào tạo, M8.2 Đánh giá)
- Data tạo bởi 3 account đều stamp cùng `donViId` → không reproduce real-world multi-tenant

### Gợi ý sửa

Re-seed account:
```sql
UPDATE tai_khoans SET don_vi_id = '<cuc-bttp-id>'    WHERE username = 'canbo_tw';
UPDATE tai_khoans SET don_vi_id = '<bo-khdt-id>'     WHERE username = 'canbo_bn';
UPDATE tai_khoans SET don_vi_id = '<so-tp-hn-id>'    WHERE username = 'canbo_tinh';
```

Đảm bảo 3 `don_vi_id` thuộc 3 `cap_don_vi` khác nhau (TW/BN/DP).

### Notes thêm

`capDonVi` trên `/auth/me` trả "DP" cho cả 3 account cũng bất thường. Có thể field này ngữ nghĩa khác "capDonVi của donVi" — BE cần làm rõ documentation.

---

# SECTION E — Observations

## OBS-CT-02 — Thanh tiến trình detail 6 step thay vì 8 state SM

**Mô tả:** Detail page tab "Thông tin" hiển thị thanh tiến trình với **6 step**:
`Dự thảo → Chờ PD → Đã duyệt → Công bố → Thực hiện → Hoàn thành`

Thiếu 2 state per SM-KH-CTHTPL 8 state:
- TAM_DUNG (nhánh từ DANG_THUC_HIEN)
- HUY (nhánh từ DU_THAO hoặc CHO_PHE_DUYET)

**Tác động:** User ở CT state TAM_DUNG không thấy mình đang ở đâu trên thanh tiến trình.

**Possible by design:** Antd Steps không hỗ trợ branch visualization tốt → UI có thể chỉ show happy path. Nếu đúng ý đồ thiết kế:
- Accept current design, document spec rõ
- Hoặc thêm badge/icon indicator riêng cho TAM_DUNG/HUY state

**Status:** Observation — cần PM/BA clarify với dev. Không block test.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass) |
| MailHog (fallback) | http://103.172.236.130:8025/ |
| API base | http://103.172.236.130:3000/api/v1/ |
| Frontend | React 19 + Vite 6 + Ant Design + CASL + Zustand |
| Backend | NestJS + PostgreSQL + TypeORM (nghi ngờ) |
| Xác thực | JWT Bearer + OTP email, `refresh_token` httpOnly cookie |
| Auth persist | sessionStorage `auth-store` (Zustand persist) |

### B — Tài khoản sử dụng

| Username | Vai trò | Cấp | Dùng cho bug |
|----------|---------|-----|--------------|
| canbo_tw | CB_TW | TW (theo config), DP (theo /auth/me) | BUG-CT-BE-001, BUG-BE-CT-001, BUG-CT-UI-001/002/005, BUG-TEST-ACCOUNT-001 |
| canbo_bn | CB_BN | BN (theo config), DP (theo /auth/me) | BUG-TEST-ACCOUNT-001 |
| canbo_tinh | CB_DP | DP | BUG-TEST-ACCOUNT-001 |
| qtht_tw | QTHT | TW | BUG-CT-PERM-001 |
| lanhdao_tw | CB_PD | TW | BUG-BE-CT-001 (approve test) |
| tvv_user | TVV | Portal | BUG-CT-UI-006 |

### C — Danh mục ảnh chụp

| File | Dùng cho bug |
|------|--------------|
| [screenshots/app-list-7-rows.png](screenshots/app-list-7-rows.png) | CT-001 evidence |
| [screenshots/app-form-full.png](screenshots/app-form-full.png) | CT-002, BUG-CT-UI-002 |
| [screenshots/ct-101-empty-validation.png](screenshots/ct-101-empty-validation.png) | CT-101 evidence |
| [screenshots/ct-103-budget-input-accepted.png](screenshots/ct-103-budget-input-accepted.png) | BUG-CT-UI-005 |
| [screenshots/ct-022-search-result.png](screenshots/ct-022-search-result.png) | CT-022 evidence |
| [screenshots/ct-206-qtht-list.png](screenshots/ct-206-qtht-list.png) | BUG-CT-PERM-001 |
| [screenshots/ct-207-tvv-menu.png](screenshots/ct-207-tvv-menu.png) | BUG-CT-UI-006 |
| [screenshots/list-soft-delete-leaked.png](screenshots/list-soft-delete-leaked.png) | BUG-CT-BE-001 |
| [screenshots/ct-detail-thongtin-render.png](screenshots/ct-detail-thongtin-render.png) | BUG-CT-UI-001, OBS-CT-02 |
| [screenshots/ct-detail-dot-bc-placeholder.png](screenshots/ct-detail-dot-bc-placeholder.png) | BUG-CT-FE-003 |
| [screenshots/prototype/proto-list.png](screenshots/prototype/proto-list.png) | Prototype reference §4 |
| [screenshots/prototype/proto-form-them-moi.png](screenshots/prototype/proto-form-them-moi.png) | Prototype reference §4 |

---

*Bug report v1.0 | 2026-04-20 | CT HTPLDN Round 2 Lệnh 1+2+3+4 consolidated | 10 findings (2 Critical + 2 Major + 2 Medium + 3 Minor + 1 Observation) | 4 sections theo loại assignee (A/B/C/D/E)*
