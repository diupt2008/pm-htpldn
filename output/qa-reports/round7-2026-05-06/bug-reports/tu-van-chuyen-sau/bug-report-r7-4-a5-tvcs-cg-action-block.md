# Bug Report — Tư vấn chuyên sâu (FR-12) R7.4.A5

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation |
| **Ngày** | 2026-05-07 |
| **Loại test** | Workflow (R7.4.A5) |
| **Round** | R8 |
| **Tài liệu tham chiếu** | [`srs-fr-12-tv-chuyen-sau.md`](../../../../../input/srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md) v3.5 + [workflow-test-report-r7-4-a5-tvcs.md](../../workflow/tu-van-chuyen-sau/workflow-test-report-r7-4-a5-tvcs.md) |

---

## Tổng hợp

Phát hiện **2** lỗi BE chặn nhánh CG trong workflow TVCS — đều có SRS reference cụ thể và đều confirmed 2-source (ly_13 + dinh_14).

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 1        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FUNC-TVCS-A5-001 | Critical | P0 | Workflow | TC-A5-B3, TC-A5-B4 | `srs-fr-12-tv-chuyen-sau.md` SM-TVCS line 1465-1471 (`PHAN_CONG → DANG_TU_VAN` actor=CG) + line 938 (`Modal Phân công` xác nhận) | BE `/xac-nhan` reject 403 ERR-AUTH-TVCS-CG-01 cho CG đã được phân công đúng — chặn B3/B4 cascade B6/B7/B8/B9 | Open |
| BUG-FUNC-TVCS-A5-002 | Major | P1 | Workflow | TC-A5-B3 | `srs-fr-12-tv-chuyen-sau.md` UC147 + BR-AUTH-08 + line 533 (filter dropdown CG) | List `GET /noi-dung-tu-van-cs` trả `total=0` cho user role CG dù CG có TVCS được phân công — CG không có inbox "Việc của tôi" | Open |

---

## BUG-FUNC-TVCS-A5-001 — BE `/xac-nhan` 403 ERR-AUTH-TVCS-CG-01 cho CG đã được phân công đúng

### Mô tả

CG (role `CG`) đã được phân công cho TVCS (TVCS.chuyenGiaId = TVV.id của CG đó), gọi POST `/api/v1/noi-dung-tu-van-cs/{id}/xac-nhan` với body hợp lệ → BE trả 403 với code `ERR-AUTH-TVCS-CG-01` "Chỉ chuyên gia được phân công mới thực hiện hành động này". FK linkage `TAI_KHOAN.id ↔ TU_VAN_VIEN.tai_khoan_id ↔ TVCS.chuyen_gia_id` verified intact qua API. Lỗi 2-source: ly_13 (TVV-0001 / TVCS-0004 DN) + dinh_14 (TVV-0002 / TVCS-0006 KDTM) cùng pattern. Vi phạm SRS SM-TVCS line 1465-1471 (transition PHAN_CONG → DANG_TU_VAN actor=CG được phân công) và chặn cascade B3 → B6 → B8/B9.

### Các bước tái hiện

1. Login `cb_nv_tw_01` → vào `/tv-chuyen-sau/danh-sach` → phân công CG cho TVCS-20260507-0004 (DN, chọn "Lý Thị Mười Ba" TVV-0001 — duy nhất khớp filter `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds=DN`). State PHAN_CONG, chuyenGiaId = `df00f7e1-0d24-4ad2-93f4-132db87749fc`.
2. Logout. Login `ly_13` / `Secret@123` + OTP `666666` (TK đã activated qua R7.2.9). Verify GET `/api/v1/auth/me` trả `userId = d99760d8-b38b-401e-a5ac-227664debef4` = `TVV-0001.taiKhoanId`.
3. GET `/api/v1/noi-dung-tu-van-cs/cee63433-785b-411a-991a-780d10cad6fc` → 200, response confirms `chuyenGiaId == df00f7e1-...` (= TVV-0001.id).
4. POST `/api/v1/noi-dung-tu-van-cs/cee63433.../xac-nhan` body `{quyetDinh: "CHAP_NHAN", version: 2}` → **403 ERR-AUTH-TVCS-CG-01**.
5. Re-test với `dinh_14` (TVV-0002 / TVCS-20260507-0006 KDTM): cùng pattern → cùng 403 cùng error code. Linkage verified analogously.
6. Quan sát: CG vẫn có thể PATCH `/{id}` body generic field (vd `{tomTat: "..."}`) → 200. Bug chỉ ở action endpoint `/xac-nhan` — auth check route-level OK nhưng endpoint-level "is-assigned-CG" check sai logic.

### Kết quả mong đợi

- POST `/xac-nhan {quyetDinh: 'CHAP_NHAN', version}` từ CG có `TVV.id == TVCS.chuyenGiaId` → 200, state PHAN_CONG → DANG_TU_VAN, ngày bắt đầu auto-set, ver+1 (SRS SM-TVCS line 1465-1471).
- POST `/xac-nhan {quyetDinh: 'TU_CHOI', lyDo, version}` → 200, state PHAN_CONG → TIEP_NHAN, chuyenGiaId clear (SRS line 537).

### Kết quả thực tế

- Cả 2 quyết định CHAP_NHAN/TU_CHOI đều trả **HTTP 403** với body:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERR-AUTH-TVCS-CG-01",
      "message": "Chi chuyen gia duoc phan cong moi thuc hien hanh dong nay",
      "timestamp": "2026-05-07T14:55:..Z",
      "requestId": "..."
    }
  }
  ```
- Lỗi xảy ra dù `auth/me.userId` khớp `TVV.taiKhoanId` và `TVV.id` khớp `TVCS.chuyenGiaId`. Điều này gợi ý BE auth check ở endpoint `/xac-nhan` đang dùng JOIN sai (vd so sánh trực tiếp `auth.userId == TVCS.chuyenGiaId` thay vì qua TU_VAN_VIEN), hoặc JWT thiếu claim `tuVanVienId`.
- Chặn 5 transition cascade: B3 (CHAP_NHAN), B4 (TU_CHOI), B6 (DANG_TU_VAN → HOAN_THANH), B8 (CHO_PHE_DUYET → DA_DUYET), B9 (CHO_PHE_DUYET → DANG_TU_VAN).

### Bằng chứng

![BUG-FUNC-TVCS-A5-001 — `dinh_14` (CG, KDTM) login thành công, role CG, sidebar render Quản lý tư vấn — confirm role active](image/bug-tvcs-a5-001-cg-dinh-14-page-403.png)

```text
=== Probe verified linkage 2026-05-07 21:55 ===
GET /api/v1/auth/me (ly_13)
  → {userId: d99760d8-b38b-401e-a5ac-227664debef4, hoTen: 'Lý Thị Mười Ba', vaiTro: ['CG'], donViId: 00000000-0000-4000-8000-000000000001, capDonVi: 'TW'}

GET /api/v1/noi-dung-tu-van-cs/cee63433-785b-411a-991a-780d10cad6fc
  → 200 {data: {trangThai: 'PHAN_CONG', chuyenGiaId: 'df00f7e1-0d24-4ad2-93f4-132db87749fc', version: 2}}

Linkage check (client-side):
  TVCS.chuyenGiaId   == 'df00f7e1-0d24-4ad2-93f4-132db87749fc' (TVV-0001.id) ✅
  TVV-0001.taiKhoanId == 'd99760d8-b38b-401e-a5ac-227664debef4' (= ly_13.userId) ✅

POST /api/v1/noi-dung-tu-van-cs/cee63433-785b-411a-991a-780d10cad6fc/xac-nhan
     body {quyetDinh: 'CHAP_NHAN', version: 2}
  → 403 ERR-AUTH-TVCS-CG-01 "Chi chuyen gia duoc phan cong moi thuc hien hanh dong nay"

POST /api/v1/noi-dung-tu-van-cs/cee63433.../xac-nhan
     body {quyetDinh: 'TU_CHOI', lyDo: 'Test reject', version: 2}
  → 403 ERR-AUTH-TVCS-CG-01 (cùng code)

Cross-check dinh_14 / TVCS-20260507-0006 KDTM:
GET detail → chuyenGiaId(5e0377d4) == TVV-0002.id ✅
GET auth/me → userId(4b732377) == TVV-0002.taiKhoanId ✅
POST /xac-nhan {CHAP_NHAN, ver=2} → 403 ERR-AUTH-TVCS-CG-01 (cùng pattern, cùng code)

Sanity check (CG có quyền update generic):
PATCH /api/v1/noi-dung-tu-van-cs/cee63433.../ {tomTat: 'Test update from CG', version: 2}
  → 200 ✅ (CG có permission update_noi_dung_tu_van_cs nên route-level auth OK)
```

---

## BUG-FUNC-TVCS-A5-002 — List endpoint trả `total=0` cho role CG dù có TVCS được phân công

### Mô tả

CG (role `CG`) gọi GET `/api/v1/noi-dung-tu-van-cs?page=1&pageSize=50` → BE trả `{success: true, data: [], meta: {total: 0}}` mặc dù trong DB có TVCS với `chuyen_gia_id` trỏ tới TVV của CG đó. Hệ quả: UI `/tv-chuyen-sau/danh-sach` của CG render "Không có nội dung tư vấn chuyên sâu nào" → CG không có cách nào xem inbox "Việc của tôi" qua UI để chấp nhận/từ chối phân công. Vi phạm SRS UC147 + BR-AUTH-08 (data-scope theo role).

### Các bước tái hiện

1. Setup: TVCS-20260507-0004 đã PHAN_CONG cho TVV-0001 (Lý), TVCS-20260507-0006 PHAN_CONG cho TVV-0002 (Đinh) (verified bằng cb_nv_tw_01 list 6 PHAN_CONG).
2. Logout cb_nv_tw_01. Login `ly_13` / `Secret@123` + OTP `666666`.
3. Click sidebar "Quản lý tư vấn" → "Tư vấn chuyên sâu" → URL `/tv-chuyen-sau/danh-sach`.
4. Quan sát: bảng danh sách hiển thị "Không có nội dung tư vấn chuyên sâu nào" + checkbox "Select all" disabled. Network request: `GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=20` → 200 `{data: [], meta: {total: 0}}`.
5. Re-verify với `dinh_14`: cùng pattern, list rỗng dù TVCS-0006 KDTM phân công cho TVV-0002.
6. Compare CB NV: cb_nv_tw_01 cùng URL `/api/v1/noi-dung-tu-van-cs?page=1&pageSize=50` → 200 trả 10 record (state PHAN_CONG=6, TIEP_NHAN=3, HUY=1) → list endpoint hoạt động đúng cho role CB NV, sai chỉ ở scope CG.

### Kết quả mong đợi

- `GET /api/v1/noi-dung-tu-van-cs?...` từ user role CG cần JOIN TU_VAN_VIEN ON `TAI_KHOAN.id = TU_VAN_VIEN.tai_khoan_id`, lọc TVCS WHERE `chuyen_gia_id = TVV.id` và `trang_thai != HUY` (để CG thấy việc của mình).
- ly_13: trả ≥1 record (TVCS-20260507-0004 DN, state PHAN_CONG).
- dinh_14: trả ≥1 record (TVCS-20260507-0006 KDTM, state PHAN_CONG).

### Kết quả thực tế

- Cả 2 CG nhận `total: 0`, `data: []`.
- UI render empty state "Không có nội dung tư vấn chuyên sâu nào".
- CG không có lối tắt UI để mở detail TVCS được phân công (không có bookmark, không có notification jump-to). Workaround: CB NV phải gửi link trực tiếp `/{id}` cho CG.

### Bằng chứng

![BUG-FUNC-TVCS-A5-002 — `ly_13` mở /tv-chuyen-sau/danh-sach: bảng "Không có nội dung tư vấn chuyên sâu nào" mặc dù TVCS-0004 đã phân công đúng cho TVV-0001](image/bug-tvcs-a5-002-cg-inbox-empty.png)

```text
=== List vs detail mismatch (ly_13, 2026-05-07 21:54) ===
GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=50
  → 200 {success: true, data: [], meta: {page: 1, pageSize: 50, total: 0, totalPages: 0}}  ❌

GET /api/v1/noi-dung-tu-van-cs/cee63433-785b-411a-991a-780d10cad6fc (TVCS-0004 detail by id)
  → 200 {data: {chuyenGiaId: df00f7e1-..., trangThai: PHAN_CONG, version: 2}}  ✅
  → CG có thể access detail-by-id, chỉ list filter sai

Compare cb_nv_tw_01 same endpoint:
GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=50
  → 200 {data: [10 records], meta: {total: 10}}  ✅
```

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT (httpOnly cookie) + OTP email TOTP (BR-AUTH-01 Tier 1) |
| Tool test | Chrome DevTools MCP |

Account dùng test:
- `cb_nv_tw_01` / `Secret@123` (CB_NV_TW, BTP-TW) — phân công + hủy
- `ly_13` / `Secret@123` (CG, TVV-BTP-TW-0001 LV Doanh nghiệp)
- `dinh_14` / `Secret@123` (CG, TVV-BTP-TW-0002 LV Kinh doanh thương mại)

---

*Bug report generated: 2026-05-07 | QA Automation via Claude Code*
