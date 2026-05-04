# Bug Report — Module Chuyên gia/TVV (§7.4)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog: http://103.172.236.130:8025) |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-04-17 |
| **Loại test** | Functional + Authorization |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy §7.4](../../../test-strategy.md), [functional-test-report-cg-tvv](functional-test-report-cg-tvv.md) |

---

## Tổng hợp

Phát hiện **12** lỗi trong quá trình test module Chuyên gia/TVV (30 TC).

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 12   | 3        | 4     | 3      | 2     | 0       |

> **History** (non-bug — lưu log ngắn): BUG-TVV-004 (search) và BUG-TVV-008 (state endpoints) đã CLOSED false positive sau khi verify UI + deep API probing. Chi tiết xem [round3-reverify.md](round3-reverify.md) và [browse-tool-fix.md](browse-tool-fix.md).

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-TVV-001 | Critical | P0 | Data | TVV | TVV-007 | GET detail TVV luôn trả 500 Internal Server Error | Open |
| BUG-TVV-002 | Critical | P0 | Permission | TVV | TVV-023 | QTHT (admin) tạo mới + công khai TVV được — vi phạm SRS (QTHT chỉ 👁️ R) | Open |
| BUG-TVV-003 | Critical | P0 | Data | TVV | TVV-020/021/022 | DELETE TVV luôn trả 500 — không có guard, không soft-delete | Open |
| BUG-TVV-005 | Major | P0 | Permission | TVV | TVV-029 | DN không đánh giá được TVV qua API — 403 Forbidden (vi phạm SRS) | Open |
| BUG-TVV-006 | Major | P1 | Permission | TVV | TVV-017/026 | NHT không bổ sung được — thiếu `bo-sung_tu_van_vien` perm trong JWT (dù SRS có CRU* HO_SO). Round 3a: đã tạo TVV-BTP-TW-0009 owned by nht_user → vẫn 403. | Open |
| BUG-TVV-007 | Major | P1 | Workflow | TVV | TVV-008 | `/tham-dinh` trả 500 khi TVV ở trạng thái sai — phải 409 state error | Open |
| BUG-TVV-009 | Medium | P1 | Data | TVV | TVV-015 | `soLuongDanhGia` luôn null sau khi tạo đánh giá — không track số lần eval | Open |
| BUG-TVV-010 | Medium | P2 | UI/UX | TVV | TVV-001 | Pagination param `limit`/`size`/`per_page` bị bỏ qua — chỉ `pageSize` hoạt động | Open |
| BUG-TVV-011 | Minor | P2 | Data | TVV | TVV-003 | POST accept `soCccd`/`soDienThoai` nhưng không persist — wrong field name, silent data loss | Open |
| BUG-TVV-012 | Minor | P3 | Data | TVV | TVV-003/014 | POST response bọc lồng `data.success.data` — inconsistent với GET | Open |
| BUG-TVV-013 | Medium | P1 | Data | TVV | — | API thiếu Swagger/docs + param sai bị silent-ignore (không 422) — gây false positive test | Open |
| BUG-TVV-014 | Major | P1 | Permission | TVV | TVV-018/019/020/028 | CB_NV/CB_PD 403 trên `/cap-nhat-trang-thai`; chỉ admin dùng được — vi phạm SRS | Open |
| BUG-TVV-015 | Medium | P1 | Permission | TVV | TVV-017/026/027 | Permission `*_ho_so_tu_van_vien` trong JWT nhưng không có endpoint `/ho-so-tu-van-vien*` | Open |

> **Type:** `Happy` | `Negative` | `Edge` | `Workflow` | `Permission` | `Data` | `UI/UX` | `Performance`
> **Severity:** `Critical` (chặn release) | `Major` (quan trọng có workaround) | `Medium` | `Minor` | `Trivial`
> **Priority:** `P0` (fix ngay) | `P1` (sprint hiện tại) | `P2` (2-3 sprint) | `P3` (khi có thời gian)

---

## BUG-TVV-001 — GET detail TVV luôn trả 500 Internal Server Error

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Chuyên gia/TVV |
| **Thành phần** | Backend — TvvController.findOne / TvvService.findById |
| **URL** | `GET /api/v1/tu-van-viens/{id}` |
| **Tài khoản** | canbo_tw (CB_NV, TW), lanhdao_tw (CB_PD, TW), admin (QTHT) — mọi role |
| **TC Reference** | TVV-007 |
| **SRS Reference** | UC43 "Xem chi tiết TVV" |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Endpoint `GET /api/v1/tu-van-viens/{id}` trả về HTTP 500 Internal Server Error cho **mọi** TVV ID hợp lệ (đã tồn tại) trong hệ thống, kể cả ID lấy trực tiếp từ list API.

### Các bước tái hiện

1. Login bằng canbo_tw → lấy accessToken
2. Gọi `GET /api/v1/tu-van-viens?page=1&pageSize=1` → copy `data[0].id` (vd: `7d396aa8-7a66-4882-b589-7a725decc653`)
3. Gọi `GET /api/v1/tu-van-viens/7d396aa8-7a66-4882-b589-7a725decc653` với cùng token
4. Quan sát: HTTP 500 với `ERR-SYS-00-00-01`

### Kết quả mong đợi

- HTTP 200 + JSON chứa toàn bộ hồ sơ TVV (hồ sơ, lịch sử, điểm đánh giá) theo UC43
- Hoặc HTTP 404 nếu ID không tồn tại

### Kết quả thực tế

```json
{
  "success": false,
  "error": {
    "code": "ERR-SYS-00-00-01",
    "message": "Internal server error",
    "timestamp": "2026-04-17T07:57:20.610Z",
    "requestId": "1812829d-ded1-42e7-b474-9bfdd584abb5"
  }
}
```

HTTP 500 với mọi TVV ID tồn tại. Note: `GET /api/v1/tu-van-viens/00000000-0000-0000-0000-000000000000` (UUID hợp lệ nhưng không tồn tại) lại trả 200 với `data: null` — lỗi hành vi bất đối xứng.

### Bằng chứng

Request/response mẫu:
```
GET /api/v1/tu-van-viens/7d396aa8-7a66-4882-b589-7a725decc653
Authorization: Bearer <canbo_tw>
→ 500 {"code":"ERR-SYS-00-00-01"}

GET /api/v1/tu-van-viens/00000000-0000-0000-0000-000000000000
→ 200 {"success":true,"data":null}
```

### Tác động

- **100% chặn UC43 "Xem chi tiết TVV"** — không xem được hồ sơ, lịch sử, điểm đánh giá.
- **Chặn dependent workflow**: UC44 (thẩm định), UC45 (phê duyệt), UC47 (đánh giá) cần mở chi tiết trước khi thao tác.
- Gần như toàn bộ luồng nghiệp vụ TVV không sử dụng được trên UI (UI gọi GET detail khi mở hồ sơ).

### Nguyên nhân nghi ngờ

1. Query relations (eager-load) bị lỗi trên bảng liên quan (HO_SO_TU_VAN_VIEN, DANH_GIA_TU_VAN_VIEN, LINH_VUC_PL).
2. Hoặc service `findById` throw khi map eager-loaded entities — khả năng cao có TypeORM/Prisma relation config sai.
3. Có thể mapping điểm đánh giá TB (`diemDanhGiaTb`) hoặc điểm với `null` gây crash.

### Gợi ý sửa

1. Check logs backend với `requestId` để xem stack trace.
2. Review `TvvService.findById()` — đặc biệt phần hydrate `linhVucs`, `danhGias`, `hoSo`.
3. Thêm null-safe check, và wrap trong try/catch với error proper (404/500 với detail message).

---

## BUG-TVV-002 — QTHT (admin) tạo/công khai TVV — vi phạm SRS

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-002 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Chuyên gia/TVV |
| **Thành phần** | Backend — TvvController (route guards CASL/PolicyGuard) |
| **URL** | `POST /api/v1/tu-van-viens`, `POST /api/v1/tu-van-viens/{id}/cong-khai` |
| **Tài khoản** | admin (QTHT, TW) — Test@1234 |
| **TC Reference** | TVV-023 |
| **SRS Reference** | [permission-matrix.md](../../../permission-matrix.md) — QTHT có **👁️ R** (chỉ đọc) trên TU_VAN_VIEN |
| **Assignee** | Backend Team |
| **Found by** | QA Automation |

### Mô tả

Tài khoản QTHT (admin) thực thi thành công 2 thao tác ghi mà theo SRS không được phép:
1. **POST /tu-van-viens** (tạo mới) — trả 201 Created + auto-gen mã `TVV-BTP-TW-0008`.
2. **POST /tu-van-viens/{id}/cong-khai** — trả 200 với `laCongKhai: true` được cập nhật.

### Các bước tái hiện

```bash
# Login admin
TOKEN=$(login admin Test@1234)

# Tạo TVV mới (phải bị chặn 403)
curl -X POST ...tu-van-viens \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"hoTen":"Admin Created","gioiTinh":"NAM","ngaySinh":"1985-05-15","cccd":"023184005102",...}'
→ HTTP 201 {"success":true,"data":{"id":"6a37389f-...","maTvv":"TVV-BTP-TW-0008",...}}

# Công khai TVV (phải bị chặn 403)
curl -X POST ...tu-van-viens/818fc074-.../cong-khai \
  -H "Authorization: Bearer $TOKEN" -d '{"version":0}'
→ HTTP 200 {"success":true,"data":{"id":"818fc074-...","laCongKhai":true}}
```

### Kết quả mong đợi

- HTTP 403 Forbidden với cả 2 thao tác
- Chỉ CB_NV/CB_PD (tùy action) mới tạo/công khai được TVV

### Kết quả thực tế

HTTP 201 và HTTP 200 — QTHT tạo và công khai được TVV.

### So sánh theo role

| Role | POST create | /cong-khai | Ghi chú |
|------|-------------|------------|---------|
| CB_NV (canbo_tw) | ✅ 201 OK | ❌ 403 | Hợp lệ (CB_NV có CRUD TVV) |
| CB_PD (lanhdao_tw) | ❌ 403 OK | ❌ 403 | Hợp lệ (RU* only) |
| QTHT (admin) | ✅ 201 **BUG** | ✅ 200 **BUG** | Vi phạm SRS: QTHT chỉ 👁️ R |
| DN (dn_user) | ❌ 403 | — | Hợp lệ |

### Tác động

- **Vi phạm separation-of-duty**: QTHT có thể tự tạo TVV giả và công khai lên portal mạng lưới, ảnh hưởng tính toàn vẹn hệ thống.
- **Mất kiểm soát audit**: TVV được tạo bởi QTHT sẽ ghi `nguoiTaoId = QTHT`, vượt ra ngoài luồng nghiệp vụ CB_NV.
- Rủi ro compliance theo NĐ55/2019 — quy trình công nhận TVV phải qua CB_NV thẩm định + CB_PD phê duyệt.

### Nguyên nhân nghi ngờ

1. Controller `POST /tu-van-viens` và `POST .../cong-khai` thiếu `@Permission('create_tu_van_vien')` guard, hoặc admin role hard-code được gán full permission.
2. Token admin hiển thị `vaiTro: ["CB_TW"]` (khi decode JWT) — có thể admin đang bị map sai thành CB_NV ở TW, không phải QTHT.
3. Hoặc CASL policy cho QTHT hiện đang `can('manage','all')` thay vì chỉ `can('read','TuVanVien')`.

### Gợi ý sửa

1. Review JWT payload của admin — xác nhận `vaiTro` đúng là `QTHT` không.
2. Thêm `@UsePermission('create_tu_van_vien')` cho `POST /tu-van-viens` và `POST .../cong-khai`.
3. Policy file/CASL ability: loại `TuVanVien` khỏi `can('manage')` của QTHT, chỉ `can('read','TuVanVien')`.
4. Viết E2E test: `admin` cố tạo TVV → expect 403.

---

## BUG-TVV-003 — DELETE TVV luôn trả 500 Internal Server Error

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-003 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Chuyên gia/TVV |
| **Thành phần** | Backend — TvvController.remove / TvvService.softDelete |
| **URL** | `DELETE /api/v1/tu-van-viens/{id}` |
| **Tài khoản** | canbo_tw, admin (cả 2 role cùng kết quả 500) |
| **TC Reference** | TVV-020, TVV-021, TVV-022 |
| **SRS Reference** | UC50 "Vô hiệu hóa TVV", BR-GUARD: không xóa TVV đang có vụ việc |
| **Assignee** | Backend Team |

### Mô tả

DELETE TVV endpoint trả về 500 Internal Server Error cho cả TVV ở trạng thái `MOI_DANG_KY` (mới tạo, không có vụ việc) và `DANG_HOAT_DONG` (TVV-BTP-TW-0001 "Congnt"). Endpoint không thực hiện được cả happy path lẫn guard.

### Các bước tái hiện

```bash
# Delete TVV mới tạo (MOI_DANG_KY, không có VV)
curl -X DELETE /api/v1/tu-van-viens/f8b75c1c-c000-42f5-9451-74a83fba7630 \
  -H "Authorization: Bearer $canbo_tw"
→ HTTP 500 ERR-SYS-00-00-01

# Delete TVV đang hoạt động
curl -X DELETE /api/v1/tu-van-viens/818fc074-2d27-4368-976b-d218113669e8 \
  -H "Authorization: Bearer $canbo_tw"
→ HTTP 500
```

### Kết quả mong đợi

- Với TVV-BTP-TW-0001 (DANG_HOAT_DONG, soVuViecDaXuLy=0): HTTP 200 + soft-delete
- Hoặc nếu TVV có vụ việc đang xử lý: HTTP 409 Conflict với message guard "Không thể vô hiệu hóa TVV đang xử lý vụ việc"

### Kết quả thực tế

HTTP 500 với mọi trường hợp. Không có guard, không có soft-delete.

### Tác động

- **Chặn UC50** vô hiệu hóa/xóa TVV.
- Không kiểm tra được guard BR (TVV-021, TVV-022).
- Audit log có thể bị ghi chưa đầy đủ do exception.

### Nguyên nhân nghi ngờ

Nghi ngờ cùng nguyên nhân với BUG-TVV-001 — TypeORM relation khi soft-delete (hoặc `remove()`) fail do cascade.

### Gợi ý sửa

1. Check logs với `requestId` để lấy stack trace.
2. Implement guard: nếu có `VU_VIEC.nguoiThucHienId = tvvId AND trangThai IN (DANG_XU_LY,...)` → 409.
3. Dùng soft-delete với `isDeleted/deletedAt`.
4. Thêm E2E test: delete TVV không có VV → 200; delete TVV có VV → 409.

---

## BUG-TVV-005 — DN không đánh giá được TVV qua API

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-005 |
| **Severity** | Major |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Chuyên gia/TVV |
| **URL** | `POST /api/v1/tu-van-viens/{id}/danh-gia` (có thể cần endpoint riêng cho DN) |
| **Tài khoản** | dn_user (DN, Portal) |
| **TC Reference** | TVV-029 |
| **SRS Reference** | Permission matrix: DN có **🔌 C†R*** trên `DANH_GIA_TU_VAN_VIEN` (create qua API token, read own) |

### Mô tả

DN gọi endpoint tạo đánh giá TVV nhận 403 Forbidden. Theo SRS, DN phải có quyền tạo đánh giá TVV qua API (nghiệp vụ: DN đánh giá TVV sau khi hoàn thành vụ việc).

### Các bước tái hiện

```bash
TOKEN=$(login dn_user Test@1234)
curl -X POST /api/v1/tu-van-viens/818fc074-.../danh-gia \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"diemChuyenMon":8,"diemThaiDo":8,"diemThoiGian":8,"nhanXet":"..."}'
→ HTTP 403 ERR-PERM-SYS-00-01 Forbidden
```

### Kết quả mong đợi

- HTTP 201 Created + đánh giá được lưu
- Hoặc có endpoint riêng `/api/v1/dn/tu-van-viens/{id}/danh-gia` (đã thử → 404)

### Kết quả thực tế

403 Forbidden cho DN. Trong khi đó:
- canbo_tw (CB_NV): 201 ✅
- Không có endpoint alternative cho DN

### Tác động

- **UC47 "Đánh giá TVV" từ phía DN** không hoạt động.
- Điểm đánh giá trung bình TVV (BR-CALC-06) bị thiếu input từ DN — méo dữ liệu nghiệp vụ chính.

### Gợi ý sửa

1. Hoặc cho phép DN POST qua endpoint chuẩn với scope guard (DN chỉ đánh giá được TVV đã hoàn thành VV của mình).
2. Hoặc tạo endpoint `/api/v1/portal/danh-gia-tu-van-vien` riêng cho DN (theo SRS NEW, có thể cần API key `apiKey` của DN).
3. Cập nhật permission: DN `can('create','DanhGiaTuVanVien')` with condition `vuViecId ∈ DN.vuViecs && vuViec.trangThai = HOAN_THANH`.

---

## BUG-TVV-006 — NHT không bổ sung được hồ sơ TVV

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-006 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **URL** | `POST /api/v1/tu-van-viens/{id}/bo-sung` |
| **Tài khoản** | nht_user (NHT, Portal) |
| **TC Reference** | TVV-017, TVV-026 |
| **SRS Reference** | Permission matrix: NHT **✅ CRU*** trên `HO_SO_TU_VAN_VIEN` |

### Mô tả

NHT gọi `/bo-sung` trả 403 Forbidden ngay cả khi NHT là chủ (`taiKhoanId`) của TVV. Lý do: permission `bo-sung_tu_van_vien` (endpoint yêu cầu) không được cấp cho role NHT trong JWT, dù SRS nói NHT có CRU* trên HO_SO_TU_VAN_VIEN.

### Các bước tái hiện

```bash
# Step 1: canbo_tw tạo TVV với taiKhoanId = nht_user_id
POST /api/v1/tu-van-viens
Authorization: Bearer <canbo_tw>
Body: {..., "taiKhoanId": "11111111-0001-4000-8000-000000000010"}
→ 201 Created, TVV-BTP-TW-0009

# Step 2: nht_user /bo-sung TVV của chính mình
POST /api/v1/tu-van-viens/cfaf51d1-fff9-44f4-beba-b8990b1fe172/bo-sung
Authorization: Bearer <nht_user>
Body: {"version":1,"noiDungBoSung":"NHT tự bổ sung..."}
→ HTTP 403 "ERR-PERM-SYS-00-01: Forbidden" (generic, không phải owner-check)
```

So sánh: canbo_tw gọi cùng endpoint → error khác `ERR-PERM-IV-BS-02: Chỉ chủ hồ sơ mới được bổ sung` (owner-check fail). NHT error thiếu IV-BS → failed permission-gate TRƯỚC owner-check.

### Bằng chứng JWT

```
NHT permissions:
- update_ho_so_tu_van_vien  ✓ (per SRS)
- bo-sung_tu_van_vien       ❌ KHÔNG CÓ (endpoint yêu cầu cái này)
- update_tu_van_vien        ❌ KHÔNG CÓ (nên PATCH cũng fail)

canbo_tw permissions:
- bo-sung_tu_van_vien       ✓
- update_tu_van_vien        ✓
```

### Kết quả mong đợi

NHT bổ sung được hồ sơ TVV của chính mình (scope * = own record). Khi truy cập TVV của NHT khác → 403.

### Kết quả thực tế

403 Forbidden với mọi TVV (kể cả TVV mà NHT sở hữu). NHT không có đường nào sửa hồ sơ TVV của mình.

### Tác động

- UC49 "NHT tự cập nhật hồ sơ" không hoạt động.
- Luồng UC44 (thẩm định → yêu cầu bổ sung → NHT bổ sung) bị gãy: NHT không bổ sung được để quay lại DANG_THAM_DINH.

### Gợi ý sửa

1. Cấp permission `bo-sung_tu_van_vien` cho role NHT, HOẶC
2. Đổi endpoint `/bo-sung` guard → check `update_ho_so_tu_van_vien` thay vì `bo-sung_tu_van_vien`, HOẶC
3. Implement endpoint `/ho-so-tu-van-vien/*` riêng dùng permission `*_ho_so_tu_van_vien` (cùng với fix BUG-TVV-015).

---

## BUG-TVV-007 — `/tham-dinh` trả 500 khi TVV ở trạng thái sai

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-007 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Workflow |
| **URL** | `POST /api/v1/tu-van-viens/{id}/tham-dinh` |
| **Tài khoản** | canbo_tw |
| **TC Reference** | TVV-008 |

### Mô tả

Khi TVV đang ở `MOI_DANG_KY` (chưa qua bước gửi thẩm định), gọi `/tham-dinh` với `version` đúng → backend crash 500. Endpoint sibling `/phe-duyet` xử lý đúng case này với 409 ERR-STATE-IV-PD-01.

### Các bước tái hiện

```bash
# TVV ở MOI_DANG_KY, version=2
POST /tu-van-viens/f8b75c1c-.../tham-dinh
Body: {"nhom1KetQua":true,"nhom2Diem":80,"nhom3KetQua":true,"nhom4ThamGia":true,"nhom4KetQua":true,"ketLuan":"...","version":2}
→ HTTP 500 ERR-SYS-00-00-01

# So sánh với /phe-duyet (hành vi chuẩn):
POST /tu-van-viens/f8b75c1c-.../phe-duyet
Body: {"version":2,"ghiChu":"..."}
→ HTTP 409 "ERR-STATE-IV-PD-01: TVV không ở trạng thái CHO_PHE_DUYET" ✅ ĐÚNG
```

### Kết quả mong đợi

- HTTP 409 Conflict với error code `ERR-STATE-IV-TD-01: TVV không ở trạng thái DANG_THAM_DINH` (hoặc tương tự).

### Tác động

- Lỗi 500 không phân biệt được crash thật hay state invalid → khó debug.
- Confused UX: người dùng thấy "Internal Server Error" thay vì message rõ.

### Gợi ý sửa

Áp dụng pattern giống `/phe-duyet` — check state trước, throw `ConflictException` với code/message chuẩn.

---

## BUG-TVV-009 — `soLuongDanhGia` luôn null sau khi tạo đánh giá

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-009 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Data |
| **URL** | `GET /api/v1/tu-van-viens?trangThai=DANG_HOAT_DONG` (response field) |
| **TC Reference** | TVV-015 |

### Mô tả

Sau khi tạo đánh giá mới cho TVV-BTP-TW-0001 (đã có 1 eval = 9.5, thêm 1 eval = 8.7), `diemDanhGiaTb` được cập nhật đúng (9.5 → 9.1), **nhưng** `soLuongDanhGia` vẫn là `null` (không phải 2).

### Các bước tái hiện

```bash
# Trạng thái ban đầu
GET /tu-van-viens?trangThai=DANG_HOAT_DONG
→ { "diemDanhGiaTb":"9.5", "soLuongDanhGia":null }

# Tạo đánh giá mới
POST /tu-van-viens/{id}/danh-gia
Body: {"diemChuyenMon":8,"diemThaiDo":9,"diemThoiGian":9,"nhanXet":"..."}
→ 201 {"id":"df1d...","diem":8.7}

# Kết quả
GET /tu-van-viens?trangThai=DANG_HOAT_DONG
→ { "diemDanhGiaTb":"9.1", "soLuongDanhGia":null }  ← Bug
```

### Kết quả mong đợi

- `diemDanhGiaTb`: 9.1 ✅
- `soLuongDanhGia`: **2** (đếm đúng số đánh giá)

### Tác động

- FE không hiển thị được số lần đánh giá → UX thiếu thông tin.
- Nếu logic khác phụ thuộc vào field này → tính sai.

### Gợi ý sửa

Trong trigger/service tính `diemDanhGiaTb`, đồng thời cập nhật `soLuongDanhGia = COUNT(*)`.

---

## BUG-TVV-010 — Pagination param `limit` bị bỏ qua

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-010 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **URL** | `GET /api/v1/tu-van-viens?limit=10` |
| **TC Reference** | TVV-001 |

### Mô tả

Client gửi `?limit=10`, `?size=10`, `?per_page=10` → tất cả bị bỏ qua. Chỉ `pageSize=10` hoạt động. REST convention phổ biến dùng `limit`.

### Các bước tái hiện

```bash
GET /tu-van-viens?limit=2      → 8 items (pageSize=20, ignore limit)
GET /tu-van-viens?size=2       → 8 items
GET /tu-van-viens?per_page=2   → 8 items
GET /tu-van-viens?pageSize=2   → 2 items + totalPages=4 ✅
```

### Tác động

- Client dev nhầm convention → nhận response không như expect.
- Performance: nếu frontend gửi `limit=10` và backend trả 20 items, waste bandwidth.

### Gợi ý sửa

1. Hoặc alias `limit → pageSize` trong DTO.
2. Hoặc return 422 nếu param tên sai (strict mode).
3. Document chính thức Swagger param name.

---

## BUG-TVV-011 — POST TVV silently drop `soCccd`/`soDienThoai`

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-011 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | Data |
| **URL** | `POST /api/v1/tu-van-viens` |
| **TC Reference** | TVV-003 (phát hiện phụ) |

### Mô tả

Payload tạo TVV chấp nhận nhưng không persist nếu field name sai (vd `soCccd` thay vì `cccd`, `soDienThoai` thay vì `dienThoai`). Không có validation reject → lỗi silent.

### Các bước tái hiện

```bash
POST /tu-van-viens
Body: {..."soCccd":"023184001351","soDienThoai":"0912345678",...}
→ 201 Created
Response: { "cccd": null, "dienThoai": null, ... }  ← data lost!
```

### Kết quả mong đợi

- HTTP 422 "unknown field" với `forbidNonWhitelisted: true` trong NestJS `ValidationPipe`.
- Hoặc map `soCccd → cccd` cho backward compat.

### Tác động

- Người integrate API có thể tạo TVV không có CCCD mà không biết.
- Tăng rủi ro data integrity.

### Gợi ý sửa

Bật `whitelist: true, forbidNonWhitelisted: true` trong `ValidationPipe`.

---

## BUG-TVV-012 — Response POST bọc lồng `data.success.data`

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-012 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | Data |
| **URL** | `POST /api/v1/tu-van-viens/{id}/cong-khai`, `POST .../danh-gia` |
| **TC Reference** | TVV-013, TVV-014 |

### Mô tả

Một số endpoint POST trả response bọc 2 lớp `success/data` — inconsistent với GET và các POST khác.

### Các bước tái hiện

```bash
POST /tu-van-viens/{id}/cong-khai → {"success":true,"data":{"success":true,"data":{...}},"meta":null}
POST /tu-van-viens/{id}/danh-gia  → {"success":true,"data":{"success":true,"data":{...}},"meta":null}

POST /tu-van-viens (tạo mới)      → {"success":true,"data":{...},"meta":null}  ✅ đúng pattern
```

### Tác động

- FE phải xử lý 2 patterns khác nhau → dễ bug.
- API documentation (Swagger) không reflect được.

### Gợi ý sửa

Review `ResponseInterceptor` — có thể service trả sẵn wrapper `{success,data}` rồi interceptor wrap thêm 1 lớp nữa. Pick 1 layer duy nhất.

---

## BUG-TVV-013 — API thiếu Swagger + param sai bị silent-ignore

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-013 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Data |
| **URL** | `GET /api-docs`, `/api/docs`, `/api-json`, `/swagger` — đều 404 |
| **TC Reference** | — (dev-experience / QA-process) |

### Mô tả

1. Không có Swagger UI / OpenAPI docs exposed ở bất kỳ endpoint nào (`/api-docs`, `/api/docs`, `/api-json`, `/swagger` đều 404).
2. Server **silently ignore** các query param không khai báo trong DTO. Không trả 422 "unknown field" → client nhầm tưởng param đã được dùng.

Hệ quả: QA test search với param `search`, `hoTen`, `q` đều nhận full list → kết luận "search không hoạt động" (BUG-TVV-004, sau đóng false positive). Param đúng là `tuKhoa` — chỉ phát hiện ra qua capture network UI.

### Các bước tái hiện

```bash
# Test các tên param không khai báo
GET /tu-van-viens?search=Congnt → 200 full list (8 items), silent ignore
GET /tu-van-viens?hoTen=Congnt   → 200 full list
GET /tu-van-viens?q=Congnt       → 200 full list

# Param đúng
GET /tu-van-viens?tuKhoa=Congnt  → 200, 1 item (đúng)

# Swagger docs
GET /api-docs    → 404
GET /api-json    → 404
GET /swagger     → 404
```

### Kết quả mong đợi

1. Swagger UI accessible (hoặc README liệt kê endpoints + param).
2. `ValidationPipe` với `whitelist: true, forbidNonWhitelisted: true` → trả 422 "Unknown field X" khi client gửi param không khai báo.

### Tác động

- Khó tích hợp: team FE / integrator không biết contract.
- Gây false positive bug: QA test "search không hoạt động" nhầm vì param bị server nuốt.

### Gợi ý sửa

1. Expose Swagger ở `/api-docs` (NestJS `SwaggerModule.setup`).
2. Bật `forbidNonWhitelisted: true` trong global `ValidationPipe`.

---

## BUG-TVV-014 — CB_NV/CB_PD 403 trên `/cap-nhat-trang-thai`

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-014 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **URL** | `POST /api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` |
| **Tài khoản** | canbo_tw (403), lanhdao_tw (403), admin (422 = có access) |
| **TC Reference** | TVV-018, TVV-019, TVV-020, TVV-028 |
| **SRS Reference** | UC50 "Tạm dừng / Vô hiệu hóa TVV" — CB role thao tác state |

### Mô tả

Endpoint `/cap-nhat-trang-thai` (dùng enum `trangThaiMoi`) là endpoint duy nhất để chuyển trạng thái TVV (TAM_DUNG, VO_HIEU_HOA, DANG_HOAT_DONG, v.v.). Hiện tại **chỉ admin (QTHT) gọi được** — canbo_tw và lanhdao_tw đều 403 Forbidden.

Cùng pattern với BUG-TVV-002: QTHT bị trao quá nhiều quyền, business roles thiếu quyền cần thiết cho nghiệp vụ.

### Các bước tái hiện

```bash
# canbo_tw TAM_DUNG TVV
POST /tu-van-viens/{id}/cap-nhat-trang-thai
Authorization: Bearer <canbo_tw>
Body: {"trangThaiMoi":"TAM_DUNG","version":1,"lyDo":"QA test"}
→ 403 Forbidden ❌

# lanhdao_tw (CB_PD) same
→ 403 Forbidden ❌

# admin (QTHT)
→ 422 validation hoặc 409 version (endpoint accessible) ✓
```

### Kết quả mong đợi

CB_NV (hoặc CB_PD, tùy nghiệp vụ) gọi được `/cap-nhat-trang-thai` → thực hiện UC50 tạm dừng/vô hiệu. QTHT chỉ đọc (👁️ R per SRS) → 403.

### Tác động

- **Chặn UC50** (tạm dừng, kích hoạt lại, vô hiệu hóa TVV) cho role nghiệp vụ.
- Vi phạm separation-of-duty (giống BUG-TVV-002).

### Gợi ý sửa

1. Cấp permission `update_trang_thai_tu_van_vien` (hoặc tương tự) cho CB_NV / CB_PD.
2. Gỡ permission state-change khỏi QTHT ability.
3. Thêm E2E test: admin POST `/cap-nhat-trang-thai` → expect 403; canbo_tw → expect 200 (với guard state machine).

---

## BUG-TVV-015 — Permission ↔ endpoint gap: `ho-so-tu-van-vien`

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-015 |
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | Permission |
| **TC Reference** | TVV-017, TVV-026, TVV-027 |

### Mô tả

Nhiều role có permissions `create_ho_so_tu_van_vien`, `update_ho_so_tu_van_vien`, `read_ho_so_tu_van_vien` trong JWT nhưng **không có endpoint nào phục vụ resource `ho-so-tu-van-vien` riêng**. Các permissions đó chết không ánh xạ gì.

Ví dụ: NHT có đầy đủ 3 perm CRU* trên HO_SO_TU_VAN_VIEN, nhưng mọi endpoint liên quan đều 404:
- `GET /api/v1/ho-so-tu-van-vien(s)` → 404
- `POST /api/v1/ho-so-tu-van-vien(s)` → 404
- `GET /api/v1/tu-van-viens/{id}/ho-so` → 404

### Kết quả mong đợi

Hoặc:
- Implement các endpoint CRUD cho `ho-so-tu-van-vien` ánh xạ với permission đã có, HOẶC
- Cập nhật SRS / permission matrix: bỏ `HO_SO_TU_VAN_VIEN` làm entity riêng nếu thực tế được embed vào `TU_VAN_VIEN`.

### Tác động

- Test authorization matrix (TVV-027 TVV/CG xem HO_SO) không verify được.
- BUG-TVV-006 (NHT bổ sung) cũng bị chặn một phần do gap này.

### Gợi ý sửa

1. Implement `/api/v1/ho-so-tu-van-viens` CRUD đầy đủ ánh xạ với các permission đã có.
2. Hoặc gom fields HO_SO vào TU_VAN_VIEN entity + gỡ permission `*_ho_so_tu_van_vien` khỏi hệ thống.

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| MailHog (OTP) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Auth | JWT + OTP qua email (OTP TTL 5 phút, access token 900s) |
| Test method | API via curl; UI thử nhưng browse server crash khi submit OTP → chỉ screenshot login page |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| admin | QTHT | TW | BUG-TVV-002 (create/cong-khai), BUG-TVV-003 |
| canbo_tw | CB_NV | TW | BUG-TVV-001, 003, 004, 007, 009, 010, 011, 012 |
| lanhdao_tw | CB_PD | TW | BUG-TVV-002 (so sánh), BUG-TVV-007 |
| nht_user | NHT | Portal | BUG-TVV-006 |
| tvv_user | TVV | Portal | BUG-TVV-006 (so sánh) |
| chuyengia_user | CG | Portal | TVV-025 (compare) |
| dn_user | DN | Portal | BUG-TVV-005 |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [01-landing-loaded.png](screenshots/01-landing-loaded.png) | Login page — xác nhận app load | N/A (env) |
| [03-after-submit.png](screenshots/03-after-submit.png) | OTP prompt sau khi submit login | N/A (env) |
| [15-tvv-page-attempt.png](screenshots/15-tvv-page-attempt.png) | UI redirect về /login khi vào /tu-van-vien (token injection không work) | Limitation note |

### D — Ghi chú về UI testing (UPDATED 2026-04-17)

**Browse tool đã fix và hoạt động cho UI testing.** Root cause của "crash" ban đầu: không phải Chromium crash, mà là các vấn đề phối hợp:

1. **OTP pairing mismatch** — khi QA chạy API login song song với UI login, MailHog có nhiều OTP cho cùng user nhưng mỗi OTP gắn với 1 session (otpToken) khác nhau. Fetch "latest OTP" có thể lấy OTP của session sai.
   - **Fix**: Clear MailHog (`DELETE /api/v1/messages`) trước mỗi UI login.

2. **Browse CLI EPIPE bug** — CLI crash khi stdout bị pipe qua `tail`/`head`/`grep` (Bun v1.3.12 runtime bug).
   - **Fix**: Write output sang file tạm rồi đọc (`$B cmd > /tmp/file.txt; cat /tmp/file.txt`).

3. **Chromium headless bị khởi động lại giữa các `$B` call** — state file `.gstack/browse.json` bị rewrite hoặc server idle-exit, CLI auto-spawn server mới → mất context (cookies, localStorage, sessionStorage). App sessionStorage-based auth → logout.
   - **Fix**: Dùng `chain` command với JSON stdin để chạy nhiều lệnh trong **MỘT** session. Ví dụ:
     ```bash
     cat <<EOF | $B chain > /tmp/out.txt 2>&1
     [["goto","..."],["fill","..."],["js","..."]]
     EOF
     ```

4. **`/403` không phải crash — là route guard** — canbo_tw login xong app redirect tới dashboard nhưng user không có permission → hiển thị trang 403. QA ban đầu nhầm là browser crash vì URL showed "/403". Thực ra là app behavior đúng expected.

**UI verification đã thực hiện:**
- ✅ Login via UI (screenshot [22-otp-set-via-js.png](screenshots/22-otp-set-via-js.png), [33-after-otp-final.png](screenshots/33-after-otp-final.png))
- ✅ Dashboard route guard `/403` cho canbo_tw — expected (screenshot [33](screenshots/33-after-otp-final.png))
- ✅ Navigate tới TVV list qua sidebar (screenshot [34-tvv-page.png](screenshots/34-tvv-page.png))
- ✅ Search `tuKhoa=Congnt` → 1 result (screenshot [46-search-congnt.png](screenshots/46-search-congnt.png))
- ✅ Search `tuKhoa=XYZ` → 0 results (screenshot [47-search-xyz.png](screenshots/47-search-xyz.png))

**Chi tiết root cause + fix guide:** [browse-tool-fix.md](browse-tool-fix.md)

---

*Bug report generated: 2026-04-17 | QA Automation via Claude Code*
