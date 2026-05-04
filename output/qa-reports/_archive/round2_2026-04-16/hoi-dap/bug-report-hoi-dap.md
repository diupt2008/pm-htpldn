# Bug Report — Module: Quản lý Hỏi đáp Pháp lý

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code — Opus 4.7) |
| **Ngày** | 2026-04-17 |
| **Loại test** | Functional + Authorization + State Machine (API) + UI verify (browse) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy §7.2](../../../test-strategy.md), [permission-matrix](../../../permission-matrix.md), [functional-test-report.md](functional-test-report.md) |

---

## Tổng hợp

Phát hiện **13** lỗi trong quá trình test module Hỏi đáp Pháp lý. 4 lỗi Critical (authorization bypass + data isolation + state machine hỏng) block release. 5 lỗi Major về missing endpoints và broken features. 4 lỗi Medium về response format, missing FR mới, và UI thiếu dropdown chèn mẫu phản hồi.

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 13   | 4        | 5     | 4      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-HD-001 | Critical | P0 | Permission | Hỏi đáp | HD-024 | QTHT có thể tạo Hỏi đáp (thiếu phân quyền backend) | Open |
| BUG-HD-002 | Critical | P0 | Permission | Hỏi đáp | HD-025 | Data isolation hỏng — TW/BN/DP đọc chéo đơn vị (BR-DATA-01/02) | Open |
| BUG-HD-003 | Critical | P0 | Permission | Hỏi đáp | HD-028, HD-029 | Portal roles (NHT/DN/TVV) truy cập CMS Hỏi đáp | Open |
| BUG-HD-004 | Critical | P0 | Workflow | Hỏi đáp | HD-015 | `/cong-khai` trả success nhưng state không chuyển sang CONG_KHAI | Open |
| BUG-HD-005 | Major | P0 | Data | Hỏi đáp | HD-002 | Full-text search ignore keyword params — trả toàn bộ records | Open |
| BUG-HD-006 | Major | P1 | Workflow | Hỏi đáp | HD-012 | Batch approve không ghi APPROVE vào lichSu (audit trail mất) | Open |
| BUG-HD-007 | Major | P1 | Workflow | Hỏi đáp | HD-016, HD-017, HD-018 | Thiếu 3 endpoint state transition (unpublish, close, cancel) | Open |
| BUG-HD-008 | Major | P2 | Happy | Hỏi đáp | HD-020 | Thiếu endpoint Export Excel (BR-DATA-06) | Open |
| BUG-HD-009 | Major | P2 | Data | Hỏi đáp | HD-023 | File upload OK nhưng không attach được vào HD/PhanHoi | Open |
| BUG-HD-010 | Medium | P1 | Data | Hỏi đáp | HD-033 | Mau-phan-hoi LIST trả HTTP 500 Internal Error | Open |
| BUG-HD-011 | Medium | P2 | UI/UX | Hỏi đáp | HD-033 | Response envelope double-wrapped trên mau-phan-hois | Open |
| BUG-HD-012 | Medium | P1 | Happy | Hỏi đáp | HD-031 | Gợi ý CB NV theo lĩnh vực chưa implement (FR-II-NEW-01) | Open |
| BUG-HD-013 | Medium | P1 | UI/UX | Hỏi đáp | HD-033, HD-034-UI | UI thiếu dropdown chèn mẫu phản hồi ở form "Soạn phản hồi" (FR-II-NEW-02) | Open |

> **Type:** `Happy` / `Negative` / `Edge` / `Workflow` / `Permission` / `Data` / `UI/UX` / `Performance`
> **Severity:** `Critical` / `Major` / `Medium` / `Minor` / `Trivial`
> **Priority:** `P0` / `P1` / `P2` / `P3` / `P4`

---

## BUG-HD-001 — [Critical] QTHT có thể tạo Hỏi đáp (thiếu phân quyền backend)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapController.create` + permission guard |
| **URL** | `POST http://103.172.236.130:3000/api/v1/hoi-daps` |
| **Trình duyệt** | curl (API test) |
| **Tài khoản** | qtht_tw / Test@1234 (QTHT TW, Cục BTTP) |
| **TC Reference** | HD-024 |
| **SRS Reference** | permission-matrix.md — QTHT × HOI_DAP = 👁️ R only |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

QTHT chỉ được phép xem (R) entity HOI_DAP theo permission matrix. Tuy nhiên, khi gọi POST `/api/v1/hoi-daps` trực tiếp với token QTHT, API trả HTTP 201 Created và tạo bản ghi HD-20260417-009.

### Các bước tái hiện

1. Đăng nhập với `qtht_tw` / `Test@1234`
2. Gọi API `POST /api/v1/hoi-daps` với body hợp lệ:
   ```json
   {
     "tieuDe": "QA-R2 HD-024 BUG: QTHT can create",
     "noiDung": "This should NOT succeed per permission matrix",
     "linhVucId": "f29f7d36-8779-47e8-9afe-4e9f4d00d3e6",
     "tenNguoiGui": "Q",
     "kenhTiepNhan": "TRUC_TIEP"
   }
   ```
3. Quan sát: API trả HTTP 201, `maHoiDap=HD-20260417-009`, `nguoiTaoId=11111111-0001-4000-8000-000000000001` (qtht_tw user id)

### Kết quả mong đợi

- HTTP 403 Forbidden
- Response body: `{"success":false,"error":{"code":"ERR-AUTH-PERM-...", "message":"Bạn không có quyền tạo Hỏi đáp"}}`

### Kết quả thực tế

- HTTP 201 Created
- HD được tạo thành công, lưu trong DB với nguoiTaoId của QTHT

### Bằng chứng

Evidence file: `evidence/hd-024-qtht-create-bug.json`

```json
{
  "success": true,
  "data": {
    "id": "8ea0f52e-58ee-48f3-934c-e5fd5dddd560",
    "nguoiTaoId": "11111111-0001-4000-8000-000000000001",
    "ngayTao": "2026-04-17T08:01:57.831Z",
    "trangThai": "MOI",
    "maHoiDap": "HD-20260417-009",
    "tieuDe": "QA-R2 HD-024 BUG: QTHT can create",
    ...
  }
}
```

### Tác động (Impact)

Vi phạm nguyên tắc **separation of duties** — QTHT là vai trò quản trị hệ thống (user/role/tenant), không được tham gia vào nghiệp vụ pháp lý. Nếu QTHT tạo được hỏi đáp, họ cũng có thể tạo data giả, spam workflow, hoặc manipulate audit trail.

Quy mô: 100% user có role QTHT (3 tài khoản seed: qtht_tw, qtht_bn, qtht_dp) đều có lỗ hổng này. Nghi ngờ cùng bug xảy ra trên các module khác (Vụ việc, Chi trả, TVV) — cần regression test.

### So sánh (Comparison)

| Role | LIST | CREATE | PATCH | DELETE |
|------|------|--------|-------|--------|
| canbo_tw (CB_NV) | ✅ 200 | ✅ 201 | ✅ 200 | — (404 endpoint missing) |
| lanhdao_tw (CB_PD) | ✅ 200 | ❌ 403 ✓ | ❌ 403 (expected) | — |
| **qtht_tw (QTHT)** | ✅ 200 ✓ | **✅ 201 (BUG!)** | — (409 do immutability, không do authz) | — |

### Nguyên nhân nghi ngờ (Root Cause)

Controller `POST /hoi-daps` prób không có `@Permissions('create_hoi_dap')` decorator, hoặc permission `create_hoi_dap` vô tình bao gồm role QTHT. Từ JWT của qtht_tw decode, có thể check permission list.

### Gợi ý sửa (Suggested Fix)

```typescript
// HoiDapController.ts
@Post()
@Permissions('create_hoi_dap')  // Add if missing
async create(...) { ... }

// Permission seed / matrix:
// QTHT role: chỉ gán read_hoi_dap, KHÔNG gán create_hoi_dap
// CB_NV, DN: gán create_hoi_dap
```

Hoặc thêm explicit role deny:

```typescript
@RolesNotAllowed(['QTHT'])
```

---

## BUG-HD-002 — [Critical] Data isolation hỏng — TW/BN/DP đọc chéo đơn vị

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-002 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapRepository.findList` — query thiếu donVi scoping |
| **URL** | `GET /api/v1/hoi-daps` |
| **Tài khoản** | lanhdao_bn, lanhdao_dp, canbo_bn |
| **TC Reference** | HD-025 |
| **SRS Reference** | BR-DATA-01 (row-level security), BR-DATA-02 (TW/BN/DP scoping) |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Theo BR-DATA-02, CB_PD_TW xem toàn bộ HOI_DAP, CB_PD_BN chỉ xem Hỏi đáp thuộc Bộ mình + DP con, CB_PD_DP chỉ xem Hỏi đáp của Sở mình. Thực tế các role BN/DP đều nhìn thấy ALL records cross-donVi.

### Các bước tái hiện

1. Login 3 tài khoản khác đơn vị:
   - `lanhdao_bn` (Bộ KH&ĐT, cấp BN)
   - `lanhdao_dp` (Sở TP Hà Nội, cấp DP)
   - `canbo_bn` (Bộ KH&ĐT, cấp BN)
2. Gọi `GET /api/v1/hoi-daps?pageSize=50` với từng token
3. So sánh `meta.total`
4. Gọi `GET /api/v1/hoi-daps/{id}` với `id = babd1c5c-...` (HD-20260417-002, thuộc donVi Cục BTTP = 0000...0001)

### Kết quả mong đợi

- lanhdao_bn: chỉ thấy items có `donViId = Bộ KH&ĐT` (hoặc DP con của nó)
- lanhdao_dp: chỉ thấy items có `donViId = Sở TP HN`
- GET HD-003 (Cục BTTP) với lanhdao_bn → 403 Forbidden hoặc 404

### Kết quả thực tế

| Role | Total items | GET HD-003 |
|------|-------------|------------|
| lanhdao_bn | 16 | ✅ 200 (full data, donViId=Cục BTTP) |
| lanhdao_dp | 16 | ✅ 200 |
| canbo_bn | 16 | ✅ 200 |

**16 items === tổng toàn hệ thống.** Tất cả các role thấy toàn bộ.

### Bằng chứng

- `evidence/hd-025-lanhdaobn-list.json` — lanhdao_bn thấy 16 items
- `evidence/hd-025-lanhdaodp-list.json` — lanhdao_dp thấy 16 items

Lưu ý: field `donViId` trong response list trả về `null` → cần expose field này để user/QA debug scoping. Chỉ qua endpoint detail mới thấy donViId thật.

### Tác động (Impact)

- Vi phạm compliance: CB địa phương đọc được dữ liệu của địa phương khác và của Bộ khác
- Rủi ro lộ thông tin DN (emailNguoiGui, sdtNguoiGui) cross-province
- Đối với production với nhiều Sở TP, mỗi Sở thấy toàn bộ data cả nước

Quy mô: 100% user role CB_PD_BN/DP, CB_NV_BN/DP đều có thể đọc cross-donVi.

### Nguyên nhân nghi ngờ (Root Cause)

`HoiDapRepository.findList()` thiếu `WHERE don_vi_id ...` hoặc interceptor scoping không áp dụng cho controller này. Cần pattern:

```sql
-- CB_NV_TW/CB_PD_TW: không filter donVi
-- CB_NV_BN/CB_PD_BN:
WHERE don_vi_id = :userDonViId 
   OR don_vi_id IN (SELECT id FROM don_vi WHERE don_vi_cha_id = :userDonViId)
-- CB_NV_DP/CB_PD_DP:
WHERE don_vi_id = :userDonViId
```

### Gợi ý sửa (Suggested Fix)

```typescript
// HoiDapRepository.ts
async findList(query: ListQueryDto, user: AuthUser) {
  const qb = this.createQueryBuilder('hd');
  
  // Apply donVi scoping
  if (user.capDonVi === 'TW') {
    // no filter
  } else if (user.capDonVi === 'BN') {
    qb.andWhere('(hd.donViId = :uid OR hd.donViId IN (SELECT id FROM don_vi WHERE don_vi_cha_id = :uid))',
      { uid: user.donViId });
  } else {
    qb.andWhere('hd.donViId = :uid', { uid: user.donViId });
  }
  // ... rest
}
```

Tương tự cho `findOne` — 403 nếu record.donViId ngoài scope.

---

## BUG-HD-003 — [Critical] Portal roles (NHT/DN/TVV) truy cập CMS Hỏi đáp

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-003 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapController` — thiếu guard chặn Portal roles |
| **URL** | `GET /api/v1/hoi-daps`, `POST /api/v1/hoi-daps` |
| **Tài khoản** | dn_user, nht_user, tvv_user |
| **TC Reference** | HD-028, HD-029 |
| **SRS Reference** | permission-matrix.md — Portal roles |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Permission matrix cho entity HOI_DAP:
- DN: 🔌 C† (API only qua CONG_PLQG channel, không access CMS list)
- NHT/TVV/CG: ❌ (không quyền nào trên HOI_DAP)

Thực tế:
- `dn_user` list CMS: HTTP 200 (đọc được toàn bộ)
- `nht_user` list CMS: HTTP 200 + CREATE HTTP 201 (tạo được hỏi đáp)
- `tvv_user` list CMS: HTTP 200 (đọc được)
- `chuyengia_user` 403/403 ✓ (duy nhất đúng)

### Các bước tái hiện

```bash
# DN
TOKEN_DN=$(login dn_user)
curl -s "http://103.172.236.130:3000/api/v1/hoi-daps?pageSize=5" -H "Authorization: Bearer $TOKEN_DN" | jq
# → success: true, trả 5 items

# NHT
TOKEN_NHT=$(login nht_user)
curl -X POST "http://103.172.236.130:3000/api/v1/hoi-daps" -H "Authorization: Bearer $TOKEN_NHT" \
  -H "Content-Type: application/json" \
  -d '{"tieuDe":"NHT tạo","noiDung":"...","linhVucId":"...","tenNguoiGui":"NHT","kenhTiepNhan":"CONG_PLQG"}'
# → HTTP 201, maHoiDap=HD-20260417-010

# TVV
TOKEN_TVV=$(login tvv_user)
curl -s "http://103.172.236.130:3000/api/v1/hoi-daps" -H "Authorization: Bearer $TOKEN_TVV"
# → HTTP 200
```

### Kết quả mong đợi

| Role | LIST CMS | CREATE | Notes |
|------|----------|--------|-------|
| DN | 403 | — (chỉ qua portal endpoint) | Theo matrix C† |
| NHT | 403 | 403 | ❌ trên HOI_DAP |
| TVV | 403 | 403 | ❌ |
| CG | 403 | 403 | ❌ |

### Kết quả thực tế

| Role | LIST CMS | CREATE |
|------|----------|--------|
| DN | **✅ 200 (BUG)** | — |
| NHT | **✅ 200 (BUG)** | **✅ 201 (BUG)** |
| TVV | **✅ 200 (BUG)** | ❌ 403 ✓ |
| CG | ❌ 403 ✓ | ❌ 403 ✓ |

### Bằng chứng

- `evidence/hd-028-dn-list.json` — DN thấy 5 items
- `evidence/hd-029-nht-list-bug.json` — NHT thấy 3 items
- `evidence/hd-029-nht-create-bug.json` — NHT POST trả 201 với HD-20260417-010

### Tác động (Impact)

- **DN đọc được dữ liệu của DN khác** qua endpoint CMS (vi phạm BR-DATA isolation + GDPR-equivalent)
- **NHT tự tạo hỏi đáp thay vì DN** — bypass kênh tiếp nhận chính thức
- Portal users get backdoor vào CMS — toàn bộ architecture phân tách Portal/CMS bị phá vỡ

### So sánh

Chỉ `chuyengia_user` đúng 403/403. 3/4 Portal roles đều có lỗ hổng.

### Nguyên nhân nghi ngờ (Root Cause)

Controller `HoiDapController` không có `@Roles()` hoặc `@Permissions()` guard chặn Portal roles. Có thể:
1. Permission `read_hoi_dap` được gán cả cho NHT/TVV/DN trong seed
2. Hoặc guard chỉ check `isAuthenticated`, không check role

### Gợi ý sửa (Suggested Fix)

```typescript
// HoiDapController.ts - cả controller level
@Controller('hoi-daps')
@Roles('CB_NV', 'CB_PD', 'QTHT')  // chỉ roles staff được access
export class HoiDapController { ... }

// Riêng DN channel: tạo endpoint portal
@Controller('portal/hoi-daps')
@Roles('DN')
export class PortalHoiDapController {
  @Post()
  create(...) { /* chỉ cho phép kenhTiepNhan=CONG_PLQG */ }
}
```

Seed data: remove `read_hoi_dap` / `create_hoi_dap` khỏi NHT/TVV/DN roles.

---

## BUG-HD-004 — [Critical] `/cong-khai` success nhưng state không transition

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-004 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Workflow |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapService.congKhai` — thiếu UPDATE statement |
| **URL** | `POST /api/v1/hoi-daps/{id}/cong-khai` |
| **Tài khoản** | canbo_tw hoặc lanhdao_tw |
| **TC Reference** | HD-015, HD-016 |
| **SRS Reference** | FR-II-09, UC16, SM-HOIDAP transition DA_DUYET → CONG_KHAI |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Gọi POST `/hoi-daps/{id}/cong-khai` trên HD trạng thái DA_DUYET trả HTTP 200 success và ghi `PUBLISH` vào lichSu. Tuy nhiên `trangThai` vẫn giữ nguyên `DA_DUYET`, `laCongKhai=false`, `ngayCongKhai=null`. Gọi lại lần 2 vẫn trả success và append thêm PUBLISH vào lichSu mà không có cơ chế idempotent / 409.

### Các bước tái hiện

1. Setup: có 1 HD trạng thái DA_DUYET, version=5 (HD_A từ test đợt này)
2. Gọi:
   ```bash
   curl -X POST "http://103.172.236.130:3000/api/v1/hoi-daps/{id}/cong-khai" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"version":5}'
   ```
3. Response: HTTP 200, success=true
4. Gọi GET detail kiểm tra state
5. Quan sát: `trangThai=DA_DUYET` (không đổi), `laCongKhai=false`, `ngayCongKhai=null`, nhưng `lichSu` có thêm entry `PUBLISH`, `version=6`

### Kết quả mong đợi

```json
{
  "trangThai": "CONG_KHAI",
  "laCongKhai": true,
  "ngayCongKhai": "2026-04-17T07:56:20Z",
  "version": 6,
  "lichSu": [..., {"hanhDong": "PUBLISH", "thoiGian": "..."}]
}
```

### Kết quả thực tế

```json
{
  "trangThai": "DA_DUYET",        ← BUG: không đổi
  "laCongKhai": false,             ← BUG
  "ngayCongKhai": null,            ← BUG
  "version": 6,                    ← chỉ version tăng
  "lichSu": [..., {"hanhDong": "PUBLISH"}]  ← ghi đúng
}
```

### Bằng chứng

- `evidence/hd-015-after-publish.json`:
  ```json
  {
    "data": {
      "trangThai": "DA_DUYET",
      "laCongKhai": false,
      "ngayCongKhai": null,
      "lichSu": [..., {"hanhDong": "PUBLISH"}]
    }
  }
  ```
- Gọi `/cong-khai` lần 2 → vẫn 200, append thêm PUBLISH nữa (2 PUBLISH liên tiếp trong lichSu)

### Tác động (Impact)

- **HD không bao giờ hiển thị trên Cổng PLQG** — public không đọc được câu hỏi+trả lời đã duyệt
- Trạng thái CONG_KHAI unreachable → 1/9 state của SM-HOIDAP dead
- Liên thông Cổng Pháp luật Quốc gia (UC16) hỏng hoàn toàn
- Audit log có 2 PUBLISH trùng mà không phản ánh reality → misleading

Quy mô: 100% HD khi gọi công khai đều gặp bug này.

### Nguyên nhân nghi ngờ (Root Cause)

Handler `/cong-khai` chỉ làm audit log + return response success, nhưng quên UPDATE state. Có thể trong refactor đã tách service ra 2 action nhưng chỉ giữ log.

```typescript
// Suspected current code
async congKhai(id: string, dto: CongKhaiDto, user: AuthUser) {
  const hd = await this.findById(id);
  this.validateVersion(hd, dto.version);
  await this.auditLogService.log('PUBLISH', hd, user);  // ← only this runs
  return this.findById(id);  // ← returns unchanged
}
```

### Gợi ý sửa (Suggested Fix)

```typescript
async congKhai(id: string, dto: CongKhaiDto, user: AuthUser) {
  const hd = await this.findById(id);
  this.validateVersion(hd, dto.version);
  this.validateTransition(hd.trangThai, 'CONG_KHAI');  // only from DA_DUYET
  
  await this.repository.update(id, {
    trangThai: 'CONG_KHAI',
    laCongKhai: true,
    ngayCongKhai: new Date(),
    version: hd.version + 1,
  });
  await this.auditLogService.log('PUBLISH', hd, user);
  return this.findById(id);
}
```

Và thêm transition guard: `validateTransition` reject từ state non-DA_DUYET với 400/409.

---

## BUG-HD-005 — [Major] Full-text search ignore keyword params

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-005 |
| **Severity** | Major |
| **Priority** | P0 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapQueryDto` + repository search logic |
| **URL** | `GET /api/v1/hoi-daps?keyword=...` |
| **Tài khoản** | canbo_tw |
| **TC Reference** | HD-002 |
| **SRS Reference** | FR-II-01 (UC10), yêu cầu full-text search |
| **Assignee** | Backend Team |

### Mô tả

SRS FR-II-01 yêu cầu tìm kiếm hỏi đáp theo keyword (full-text trên tiêu đề + nội dung). Gọi với `?keyword=batch`, `?q=batch`, `?search=batch`, `?tieuDe=batch` đều không filter (trả đủ 8/8 records). `?search=batch` đặc biệt trả HTTP 500.

### Các bước tái hiện

```bash
# Có 2 HD chứa "batch" trong tiêu đề (HD-20260416-003, HD-20260416-002)
curl -s "http://103.172.236.130:3000/api/v1/hoi-daps?keyword=batch" -H "Authorization: Bearer $T" \
  | jq '.meta.total, [.data[].tieuDe]'
# Expected: 2, ["TEST_HD Câu hỏi batch approve 2","TEST_HD Câu hỏi batch approve 1"]
# Actual: 8, [all titles including non-batch ones]
```

### Kết quả thực tế

| Param | Total | Filter? |
|-------|-------|---------|
| `keyword=batch` | 8 | Không |
| `q=batch` | 8 | Không |
| `tieuDe=batch` | 8 | Không |
| `search=batch` | — | **HTTP 500** |

### Bằng chứng

`evidence/hd-002-keyword-batch.json`, `hd-002-q-batch.json`, `hd-002-tieuDe-batch.json`, `hd-002-search-batch.json`, `hd-002-body-keyword.json`.

### Tác động (Impact)

- User không tìm được câu hỏi theo nội dung → phải scroll qua pagination toàn bộ
- Ở tập 10K records (BR-DATA-06 limit), unusable
- QA phải manually filter → giảm productivity

### Nguyên nhân nghi ngờ (Root Cause)

`HoiDapQueryDto` không có field `keyword`, hoặc repository không build `WHERE` cho nó. Param được parse nhưng ignore (whitelist strip). Tên param đúng chưa rõ — SRS không spec cụ thể.

### Gợi ý sửa (Suggested Fix)

```typescript
// HoiDapQueryDto.ts
@IsOptional()
@IsString()
keyword?: string;

// Repository:
if (query.keyword) {
  qb.andWhere('(hd.tieu_de ILIKE :kw OR hd.noi_dung ILIKE :kw)',
    { kw: `%${query.keyword}%` });
}

// For PostgreSQL full-text, prefer tsvector index:
// qb.andWhere(`to_tsvector('simple', hd.tieu_de || ' ' || hd.noi_dung) @@ plainto_tsquery('simple', :kw)`, ...)
```

---

## BUG-HD-006 — [Major] Batch approve không ghi APPROVE vào lichSu

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-006 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapService.batchPheDuyet` thiếu audit log |
| **URL** | `POST /api/v1/hoi-daps/batch-phe-duyet` |
| **Tài khoản** | lanhdao_tw |
| **TC Reference** | HD-012 |
| **SRS Reference** | BR-FLOW-02 (batch approve) + audit log requirement |
| **Assignee** | Backend Team |

### Mô tả

Single approve (`POST /hoi-daps/{id}/phe-duyet`) tạo entry `APPROVE` trong `lichSu`. Batch approve (`POST /hoi-daps/batch-phe-duyet`) cập nhật state đúng (trangThai=DA_DUYET) và nguoiDuyetTen đúng, nhưng KHÔNG tạo `APPROVE` entry trong lichSu.

### Các bước tái hiện

1. Tạo HD_A và HD_B, đưa về CHO_PHE_DUYET
2. Gọi batch approve:
   ```bash
   curl -X POST "http://103.172.236.130:3000/api/v1/hoi-daps/batch-phe-duyet" \
     -H "Authorization: Bearer $TOKEN_LD" \
     -H "Content-Type: application/json" \
     -d "{\"ids\":[\"$HD_A\",\"$HD_B\"]}"
   ```
3. Gọi GET detail cả HD_A và HD_B
4. Quan sát lichSu

### Kết quả thực tế

**HD_A** (batch approved): `trangThai=DA_DUYET`, `nguoiDuyetTen="Lãnh đạo TW"` ✓, nhưng `lichSu`:
```
CREATE, TIEP_NHAN, PHAN_CONG, SUBMIT
(KHÔNG có APPROVE entry)
```

**HD-003** (single approved) so sánh: lichSu có `CREATE, TIEP_NHAN, PHAN_CONG, SUBMIT, APPROVE` ✓

### Bằng chứng

`evidence/hd-012-batch-approve.json`, `hd-012-batch-already-approved.json`.

### Tác động (Impact)

Audit trail mất — không biết ai đã duyệt HD_A và HD_B (chỉ biết qua field `nguoiDuyetTen`). Không xem được thời gian duyệt. Nếu batch gồm 50 HD, tất cả đều mất log.

### Gợi ý sửa (Suggested Fix)

```typescript
async batchPheDuyet(ids: string[], user: AuthUser) {
  const results = { approved: 0, failed: [] };
  for (const id of ids) {
    try {
      await this.pheDuyet(id, user);  // reuse single flow (which logs)
      results.approved++;
    } catch (e) {
      results.failed.push({ id, reason: e.message });
    }
  }
  return results;
}
```

---

## BUG-HD-007 — [Major] Thiếu 3 endpoint state transition

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `HoiDapController` thiếu 3 methods |
| **URL** | `POST /hoi-daps/{id}/huy`, `/hoan-thanh`, `/thu-hoi` |
| **TC Reference** | HD-016, HD-017, HD-018 |
| **SRS Reference** | SM-HOIDAP (9 states), FR-II-09, FR-II-10, FR-II-11 |
| **Assignee** | Backend Team |

### Mô tả

SM-HOIDAP khai báo 9 states với transitions. 3 transitions không có endpoint tương ứng:
- `CONG_KHAI → DA_DUYET` (thu hồi công khai): `/thu-hoi`, `/rut-cong-khai`, `/unpublish` đều 404
- `DA_DUYET/CONG_KHAI → HOAN_THANH` (đóng): `/hoan-thanh`, `/dong`, `/close`, `/ket-thuc` đều 404
- `MOI → HUY` (hủy): `/huy`, `/cancel`, `/huy-bo`, `DELETE` đều 404

### Các bước tái hiện

```bash
HD_D=$(create new HD)  # trạng thái MOI
for ep in huy cancel huy-bo dong hoan-thanh close; do
  curl -X POST ".../hoi-daps/$HD_D/$ep" ... -d '{"version":1}'
done
# All return 404
```

### Kết quả mong đợi

3 endpoint hoạt động theo SM, hỗ trợ transition MOI→HUY, DA_DUYET→HOAN_THANH, CONG_KHAI→DA_DUYET.

### Kết quả thực tế

- `/huy`, `/cancel`, `/huy-bo`: HTTP 404 `ERR-SYS-00-04-01 Cannot POST`
- `/dong`, `/hoan-thanh`, `/close`, `/ket-thuc`: HTTP 404
- `/thu-hoi`, `/rut-cong-khai`, `/unpublish`, `/go-cong-khai`: HTTP 404
- `DELETE /hoi-daps/{id}`: HTTP 404 (endpoint không tồn tại)
- PATCH với `trangThai` trực tiếp trên MOI: `Validation failed` (DTO không cho phép), trên DA_DUYET: `ERR-STATE-SYS-00-01 Cannot edit approved record`

### Tác động (Impact)

- Không đóng hỏi đáp → user stuck ở DA_DUYET, không có close flow
- Không hủy câu hỏi lỗi ở MOI → rác data trong DB, không cleanup được
- Không thu hồi công khai → vượt tầm kiểm soát (nếu BUG-HD-004 fix, và có items CONG_KHAI, không đưa về DA_DUYET được)

2/9 states (HOAN_THANH, HUY) hoàn toàn unreachable qua API.

### Nguyên nhân nghi ngờ (Root Cause)

Developer chỉ implement happy path (create → approve → publish) và bỏ qua negative paths. Hoặc feature in progress chưa merge.

### Gợi ý sửa (Suggested Fix)

Thêm 3 endpoint hoặc gom thành 1 generic:

```typescript
@Post(':id/transition')
async transition(
  @Param('id') id: string,
  @Body() dto: TransitionDto,  // { action: 'CANCEL' | 'CLOSE' | 'WITHDRAW_PUBLIC', reason?, version }
  @CurrentUser() user: AuthUser,
) {
  switch (dto.action) {
    case 'CANCEL': return this.service.huy(id, dto, user);       // MOI → HUY
    case 'CLOSE': return this.service.hoanThanh(id, dto, user);  // DA_DUYET/CONG_KHAI → HOAN_THANH
    case 'WITHDRAW_PUBLIC': return this.service.thuHoi(id, dto, user);  // CONG_KHAI → DA_DUYET
  }
}
```

---

## BUG-HD-008 — [Major] Thiếu endpoint Export Excel

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-008 |
| **Severity** | Major |
| **Priority** | P2 |
| **Type** | Happy |
| **TC Reference** | HD-020 |
| **SRS Reference** | FR-II-12, BR-DATA-06 (max 10K rows) |

### Mô tả

Tất cả path dự đoán đều 404/400: `/export`, `/export-excel`, `/xuat-excel`, `/download`, `/exports/hoi-daps`, `/hoi-daps-export`. Path `/hoi-daps/export` trả 400 "Validation failed (uuid is expected)" vì router parse `export` là `{id}` param. Export Excel endpoint không được implement.

### Tác động

Không có báo cáo Excel cho cán bộ quản lý/thống kê → phải query DB thủ công.

### Gợi ý sửa

Tham khảo module Doanh nghiệp (có endpoint export hoạt động):

```typescript
@Get('export')
async exportExcel(@Query() query: ExportQueryDto, @Res() res) {
  const rows = await this.service.exportData(query, { maxRows: 10000 });
  const buffer = await this.excelService.generate(rows, 'hoi-dap-template');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="hoi-dap-' + Date.now() + '.xlsx"');
  res.send(buffer);
}
```

---

## BUG-HD-009 — [Major] File upload OK nhưng không attach được vào HD/PhanHoi

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-009 |
| **Severity** | Major |
| **Priority** | P2 |
| **Type** | Data |
| **TC Reference** | HD-023 |

### Mô tả

1. `POST /files/upload` với multipart file → trả fileId thành công
2. Tạo phan-hoi với `{"fileDinhKem":["<fileId>"]}` → phan-hoi tạo thành công nhưng response không có field `fileDinhKem`, field bị ignore
3. GET HD detail `fileDinhKem` luôn là `[]`
4. Endpoint attach riêng `/hoi-daps/{id}/files`, `/dinh-kem`, `/attachments` đều 404

### Bằng chứng

- `evidence/hd-023-upload.json`: `{"data":{"id":"4cf24f99-...","tenFile":"test.pdf","dungLuong":45,"loaiFile":"application/pdf","trangThaiQuet":"SACH"}}`
- `evidence/hd-023-phanhoi-file.json`: phan-hoi tạo OK, response KHÔNG có `fileDinhKem`

### Gợi ý sửa

- PhanHoiCreateDto thêm `fileDinhKem: string[]`
- Service `createPhanHoi` khi có fileDinhKem → insert vào bảng nối `phan_hoi_files (phan_hoi_id, file_id)`
- Response phan-hoi query join thêm files để trả fileDinhKem

---

## BUG-HD-010 — [Medium] Mau-phan-hoi LIST trả HTTP 500

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-010 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Data |
| **TC Reference** | HD-033 |
| **SRS Reference** | FR-II-NEW-02 |

### Mô tả

`GET /api/v1/mau-phan-hois` với các variant `?loai=MAU_PHAN_HOI`, `?page=1&pageSize=3` đều trả HTTP 500 `ERR-SYS-00-00-01 Internal server error`. CREATE/GET by id/PATCH/DELETE đều hoạt động.

### Tác động

User không liệt kê được mẫu phản hồi để chọn → dropdown chèn mẫu không có data → không dùng được feature chèn mẫu qua UI.

### Gợi ý sửa

Check server log khi call `GET /mau-phan-hois` — có thể do null field trong JOIN (có field `linhVucTen` bị null khi linhVucId không join được), hoặc query build sai.

---

## BUG-HD-011 — [Medium] Response envelope double-wrapped trên mau-phan-hois

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-011 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **TC Reference** | HD-033 |

### Mô tả

POST/GET-by-id/PATCH `/mau-phan-hois` trả response:
```json
{
  "success": true,
  "data": {
    "success": true,
    "data": {
      "id": "...",
      "tenMau": "..."
    }
  }
}
```

Envelope lồng 2 lần → FE phải access `.data.data.id`. Inconsistent với các endpoint khác (single wrap).

### Bằng chứng

```bash
curl -X POST .../mau-phan-hois ... 
# → {"success":true,"data":{"success":true,"data":{"id":"f5169955-..."}}}
```

### Gợi ý sửa

Remove controller thủ công return `{success, data}`, để global `ResponseInterceptor` handle envelope. Hoặc exclude controller này khỏi interceptor.

---

## BUG-HD-012 — [Medium] Gợi ý CB NV theo lĩnh vực chưa implement (FR-II-NEW-01)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-012 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Happy |
| **TC Reference** | HD-031 |
| **SRS Reference** | FR-II-NEW-01 |

### Mô tả

FR-II-NEW-01 yêu cầu "Phân công → gợi ý CB theo cấu hình lĩnh vực". Các endpoint `/hoi-daps/{id}/goi-y-can-bo`, `/suggestions`, `/suggest-handlers` đều 404. Chức năng chưa implement.

### Tác động

Lãnh đạo phải tự nhớ CB nào phụ trách lĩnh vực pháp luật nào → phân công sai, chậm, không tối ưu workload.

### Gợi ý sửa

```typescript
@Get(':id/goi-y-can-bo')
async suggestHandlers(@Param('id') id: string) {
  const hd = await this.findById(id);
  return this.userService.findByLinhVuc(hd.linhVucId, {
    role: 'CB_NV',
    donViId: hd.donViId,
    orderBy: 'so_cau_hoi_dang_xu_ly ASC',
    limit: 10,
  });
}
```

---

## BUG-HD-013 — [Medium] UI thiếu dropdown chèn mẫu phản hồi (FR-II-NEW-02 implement dở)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HD-013 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản lý Hỏi đáp Pháp lý |
| **Thành phần** | `/src/pages/hoi-dap/detail/*` — form "Soạn phản hồi" |
| **URL** | `http://103.172.236.130:3000/hoi-dap/{id}` (detail page, HD ở trạng thái DANG_XU_LY) |
| **Trình duyệt** | Chromium headless (via gstack browse) |
| **Tài khoản** | canbo_tw / Test@1234 (CB_NV TW) |
| **TC Reference** | HD-033, HD-034-UI |
| **SRS Reference** | FR-II-NEW-02 "Chèn mẫu phản hồi khi soạn câu trả lời" |
| **Assignee** | Frontend Team |
| **Found by** | QA Automation (browse UI) |

### Mô tả

Theo SRS FR-II-NEW-02, khi CB NV soạn câu trả lời phải có khả năng **chèn mẫu phản hồi** (chọn từ dropdown các template đã được QTHT/CB PD tạo sẵn). Backend API đã hỗ trợ (POST phan-hoi với `suDungMau=true, mauPhanHoiId=<uuid>` save đúng — xem HD-034). Tuy nhiên UI của form "Soạn phản hồi" **KHÔNG có dropdown hoặc button** để chọn mẫu → user không dùng được feature qua UI.

### Các bước tái hiện

1. Đăng nhập với `canbo_tw` / `Test@1234` qua UI, verify OTP
2. Vào menu "Quản lý hỏi đáp pháp lý"
3. Click tab "Đang xử lý"
4. Click vào 1 HD có trạng thái DANG_XU_LY (vd: HD-20260417-014)
5. Kéo xuống section "Soạn phản hồi"
6. Quan sát: chỉ có 3 textarea (Nội dung phản hồi, Văn bản pháp luật, Gợi ý cho doanh nghiệp) và 2 button (Lưu nháp, Gửi phản hồi)

### Kết quả mong đợi

Form "Soạn phản hồi" có:
- Dropdown/combobox "Chọn mẫu phản hồi" hoặc button "Chèn mẫu" → click mở popup list mẫu từ `GET /api/v1/mau-phan-hois?loai=MAU_PHAN_HOI&linhVucId=<current>`
- User chọn 1 mẫu → nội dung mẫu auto-điền vào field "Nội dung phản hồi"
- Khi submit, `suDungMau=true` và `mauPhanHoiId=<chosen>` được gửi lên backend

### Kết quả thực tế

Form chỉ có 3 ô textarea trống, không có UI để chọn mẫu. User phải tự gõ toàn bộ nội dung.

### Bằng chứng

- Snapshot form: `@e129..@e137` only include heading + 3 textboxes + 2 buttons, no combobox/dropdown for mẫu
- Screenshot: `screenshots/ui-hd033-detail-page.png`

### Tác động (Impact)

- User không dùng được feature "chèn mẫu" (FR-II-NEW-02) → tự gõ lại mỗi câu trả lời → mất thời gian, inconsistent
- Mẫu phản hồi được tạo (qua QTHT/CB_PD) nhưng không có entry point để dùng → dead feature từ góc độ user
- Quy mô: 100% CB NV không dùng được UI này

### Nguyên nhân nghi ngờ (Root Cause)

Frontend chưa implement component dropdown chọn mẫu trong form soạn phản hồi. Backend đã có endpoint `GET /mau-phan-hois` (tuy vẫn bị BUG-HD-010 500 error) và phan-hoi DTO đã có field `suDungMau` + `mauPhanHoiId`.

### Gợi ý sửa (Suggested Fix)

1. Sửa BUG-HD-010 trước (GET /mau-phan-hois 500) để có data cho dropdown
2. Thêm component `<Select>` hoặc `<AutoComplete>` vào form "Soạn phản hồi":
   ```tsx
   <Form.Item label="Chọn mẫu phản hồi">
     <Select
       options={mauPhanHoiOptions}  // fetch từ /api/v1/mau-phan-hois
       onChange={(mauId) => {
         setNoiDung(mau.noiDung);  // auto-fill textarea
         setSuDungMau(true);
         setMauPhanHoiId(mauId);
       }}
       placeholder="Chọn mẫu câu trả lời..."
       allowClear
     />
   </Form.Item>
   ```
3. Submit body include `suDungMau` + `mauPhanHoiId` khi user chọn mẫu

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| MailHog (OTP) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design (via sibling reports) |
| Backend | NestJS + PostgreSQL (inferred từ ERR-* codes) |
| Xác thực | JWT access token + OTP email (5 min TTL) |
| Test Tool | curl + python3 + bash helper scripts |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| canbo_tw | CB_NV | TW(Cục BTTP) | BUG-HD-005, 006 (setup), 009, 010 |
| lanhdao_tw | CB_PD | TW | BUG-HD-004, 006 |
| qtht_tw | QTHT | TW | **BUG-HD-001** |
| lanhdao_bn | CB_PD | BN (Bộ KH&ĐT) | **BUG-HD-002** |
| lanhdao_dp | CB_PD | DP (Sở TP HN) | **BUG-HD-002** |
| canbo_bn | CB_NV | BN | BUG-HD-002 |
| dn_user | DN | Portal | **BUG-HD-003** |
| nht_user | NHT | Portal | **BUG-HD-003** |
| tvv_user | TVV | Portal | BUG-HD-003 |
| chuyengia_user | CG | Portal | (control — đúng 403) |

### C — Danh mục evidence

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| `evidence/hd-002-*.json` | Search không filter | BUG-HD-005 |
| `evidence/hd-012-batch-approve.json` | Batch approve + missing lichSu | BUG-HD-006 |
| `evidence/hd-015-after-publish.json` | Publish không transition | **BUG-HD-004** |
| `evidence/hd-020-export.xlsx` | Export 404 (response là JSON error, không phải XLSX) | BUG-HD-008 |
| `evidence/hd-023-upload.json`, `hd-023-phanhoi-file.json` | Upload OK, attach ignored | BUG-HD-009 |
| `evidence/hd-024-qtht-create-bug.json` | QTHT tạo được HD | **BUG-HD-001** |
| `evidence/hd-025-lanhdaobn-list.json`, `hd-025-lanhdaodp-list.json` | Cross-donVi read | **BUG-HD-002** |
| `evidence/hd-028-dn-list.json`, `hd-029-nht-list-bug.json`, `hd-029-nht-create-bug.json` | Portal roles vượt quyền | **BUG-HD-003** |
| `evidence/hd-033-mau-*.json` | Mau CRUD + list 500 + double wrap | BUG-HD-010, 011 |

### D — Test data tạo trong session

Xem [functional-test-report.md §5.2](functional-test-report.md#52-data-tạo-trong-test).

**Chú ý cho dev:** Các HD `HD-20260417-009` (QTHT tạo) và `HD-20260417-010` (NHT tạo) là evidence cho BUG-HD-001 và BUG-HD-003. **Không xóa** khi debug — giữ để regression verify sau fix.

---

*Bug report generated: 2026-04-17 | QA Automation via Claude Code (Opus 4.7 — 1M context)*
