# Bug Report — Workflow Vụ việc (R6.4.A3 + R6.4.A1.5)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code via MCP Chrome DevTools) |
| **Ngày** | 2026-05-05 (R12 promote 2 BE bug A1.5) · 2026-05-02 (R7-R9) · 2026-05-01 (R6) |
| **Loại test** | Workflow E2E + CAU_HINH_PHAN_CONG endpoint |
| **Round** | Round 12 (latest) — promote BUG-FUNC-CHPC-001/002 từ OBS-006 |
| **Tài liệu tham chiếu** | [workflow-test-report-VuViec.md](../workflow/workflow-test-report-VuViec.md) · SRS FR-05 SM-VUVIEC §UC59 · SRS §3.4.3.48 CAU_HINH_PHAN_CONG |

---

## Tổng hợp

**2 bug có SRS reference cụ thể** trong session R6.4.A1.5 (CAU_HINH_PHAN_CONG endpoint), promoted từ OBS-FLOW-VUVIEC-006 ngày 2026-05-05.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 1        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FUNC-CHPC-001 | Major | P1 | Negative | R6.4.A1.5 | `§3.4.3.48 row 3 nguoi_xu_ly_id` | BE reject vai trò NHT khi POST `/cau-hinh-phan-congs` (ERR-CH-03) — SRS không quy định role constraint trên FK TAI_KHOAN | Open |
| BUG-FUNC-CHPC-002 | Critical | P0 | Data | R6.4.A1.5 | `§3.4.3.48 row 4 loai_yeu_cau` | BE hardcode `loaiYeuCau=HOI_DAP`, ignore enum `VU_VIEC/TU_VAN_CS/TAT_CA` từ request body | Open |

---

## BUG-FUNC-CHPC-001 — BE reject vai trò NHT khi POST `/cau-hinh-phan-congs` (ERR-CH-03)

### Mô tả

QTHT POST tạo cấu hình phân công với `nguoiXuLyId` là tài khoản vai trò `NHT` (`tvv_tw_01..06`) tại endpoint `/api/v1/cau-hinh-phan-congs` → BE trả `HTTP 400 ERR-CH-03 "Tài khoản '...' không có vai trò xử lý hỏi đáp (chỉ chấp nhận CB nghiệp vụ, TVV hoặc CG)"`. SRS §3.4.3.48 row 3 chỉ quy định `nguoi_xu_ly_id` là FK → TAI_KHOAN(id), KHÔNG ràng buộc role.

### Các bước tái hiện

1. Login `qtht_01 / Secret@123 / OTP 666666`.
2. POST `/api/v1/cau-hinh-phan-congs` với body `{"linhVucId":"<LĐ>","nguoiXuLyId":"<id của tvv_tw_01 vai trò NHT>","loaiYeuCau":"VU_VIEC","uuTien":2,"donViId":"<BTP-TW>"}`.
3. Quan sát: HTTP 400 ERR-CH-03.

### Kết quả mong đợi

- Theo SRS §3.4.3.48 row 3: `nguoi_xu_ly_id identifier Y FK → TAI_KHOAN(id)` — không có constraint role.
- POST với bất kỳ `TAI_KHOAN` valid nào (kể cả NHT) phải HTTP 201.

### Kết quả thực tế

- HTTP 400 ERR-CH-03 — BE filter cứng accepted roles = `[CB_NV_*, TVV, CG]`, loại NHT.
- Mâu thuẫn nội tại: cùng tài khoản NHT này đã được endpoint `goi-y-tvv` cho VU_VIEC accept (verify R8/R9 12/12 PASS).

### Bằng chứng

![BUG-FUNC-CHPC-001 — Dropdown Người xử lý search "Nguyễn Văn Tư Vấn" trống cho 6 TVV TW vai trò NHT](../screenshots/r6-4-a1-5-dropdown-no-tvv-tw.png)

```json
// Request
POST /api/v1/cau-hinh-phan-congs
{"linhVucId":"...","nguoiXuLyId":"<tvv_tw_01 NHT>","loaiYeuCau":"VU_VIEC","uuTien":2,"donViId":"<BTP-TW>"}

// Response
HTTP 400
{"success":false,"error":{"code":"ERR-CH-03","message":"Tài khoản 'Tư vấn viên TW 01' không có vai trò xử lý hỏi đáp (chỉ chấp nhận CB nghiệp vụ, TVV hoặc CG)"}}
```

---

## BUG-FUNC-CHPC-002 — BE hardcode `loaiYeuCau=HOI_DAP`, ignore enum khác từ request body

### Mô tả

POST `/api/v1/cau-hinh-phan-congs` với `loaiYeuCau` ∈ `{VU_VIEC, TU_VAN_CS, TAT_CA}` → BE silent override response thành `HOI_DAP`. Mọi record lưu DB đều `loai_yeu_cau=HOI_DAP`. SRS §3.4.3.48 row 4 quy định enum 4 giá trị `(HOI_DAP/VU_VIEC/TU_VAN_CS/TAT_CA)`, default `TAT_CA`.

### Các bước tái hiện

1. Login `qtht_01`.
2. POST `/cau-hinh-phan-congs` với `loaiYeuCau=VU_VIEC` (nguoiXuLyId là cg_tw_01 để pass role filter của BUG-001).
3. Đọc response: `data.loaiYeuCau === "HOI_DAP"` — KHÔNG phải VU_VIEC như request.
4. GET `/cau-hinh-phan-congs?loaiYeuCau=VU_VIEC` → trả 0 records.
5. GET `/cau-hinh-phan-congs?pageSize=100` → mọi record có `loaiYeuCau=HOI_DAP`.
6. Lặp với `loaiYeuCau=TAT_CA` → cũng save HOI_DAP. Với `TU_VAN_CS` → reject `ERR-CH-01 "đã tồn tại"` (vì BE coi như duplicate HD record).

### Kết quả mong đợi

- Theo SRS §3.4.3.48 row 4: `loai_yeu_cau text N CHECK IN ('HOI_DAP','VU_VIEC','TU_VAN_CS','TAT_CA') default 'TAT_CA'`.
- POST với `loaiYeuCau=VU_VIEC` → response + DB persist đúng `VU_VIEC`.
- Endpoint phải support đủ 4 enum + default `TAT_CA`.

### Kết quả thực tế

- BE hardcode override `loaiYeuCau=HOI_DAP` cho mọi request, ignore field từ body.
- UI tab "Phân công mặc định" call GET `?loaiYeuCau=HOI_DAP` only → BE chỉ implement HD scope.
- Hệ quả: KHÔNG seed được PC cho VU_VIEC / TU_VAN_CS / TAT_CA → block test phân công đa loại yêu cầu.

### Bằng chứng

![BUG-FUNC-CHPC-002 — Bảng Phân công mặc định chỉ hiện 6 record Đợt 1 CB-only loaiYeuCau=HOI_DAP, không có record loaiYeuCau=VU_VIEC](../screenshots/r6-4-a1-5-pc-table-only-dot1.png)

```json
// Request
POST /api/v1/cau-hinh-phan-congs
{"linhVucId":"bbbbbbbb-...000013","nguoiXuLyId":"<cg_tw_01>","loaiYeuCau":"VU_VIEC","uuTien":1,"donViId":"<BTP-TW>"}

// Response (HTTP 201) — BE silent override
{"success":true,"data":{"id":"7a8a3821-...","loaiYeuCau":"HOI_DAP","linhVuc":{"ten":"Lao động"},"nguoiXuLy":{"hoTen":"Chuyên gia TW 01"}}}
//                                              ^^^^^^^^^^^^^^^^^^^^^^^^ override
```

---

## Observations (chưa map SRS — không log thành bug)

### OBS-FLOW-VUVIEC-001 — [RESOLVED R7] Dropdown "Phân công TVV" trống khi pool chưa "Đang hoạt động"

> **Status: RESOLVED 2026-05-02 R7** — Confirmed expected behavior. Sau R6.4.A1 PASS (pool 6 TVV TW DANG_HOAT_DONG), R7 retest dropdown trả 2 record (TVV-BTP-TW-0001 + TW-0006 LV Lao động) → BE filter `trangThai=DANG_HOAT_DONG` đúng SRS UC59 BR-CALC-05. R6 observation = data dependency, không phải code bug.

**R6 hiện tượng cũ:** Modal "Phân công TVV" mở dropdown rỗng dù DB có 9 profile (6 TVV + 2 CG + 1 NHT). API `GET /vu-viecs/{id}/goi-y-tvv?limit=20` trả `data:[]` vì pool toàn `MOI_DANG_KY`.

**R7 verify:** API call sau A1 PASS → `data:[2]`. Behavior correct.

---

### OBS-FLOW-VUVIEC-005 — [PARTIALLY RESOLVED R8 2026-05-02] PHAN_CONG snapshot pattern — fix retroactive cần BE update

> **Update R8 13:08:** Hypothesis CONFIRMED qua test 2 VV. **VV000028 phân công SAU FK link → Bước 4 PASS HTTP 201**. **VV000008 phân công TRƯỚC FK link → Bước 4 vẫn fail ERR-PERM-VI-10-01.** PHAN_CONG record là snapshot at creation, BE không re-evaluate FK runtime. Cho VV mới phân công sau setup R6.2.7-TW: ✅ workflow PASS. Cho VV cũ (VV000008): cần BE fix để re-evaluate FK runtime, hoặc workaround re-phân công (state DA_PHAN_CONG block re-assign HTTP 409).



**Hiện tượng (R8):** Sau R6.2.7-TW PASS (6 TK `tvv_tw_01..06` tạo + activate + role NHT + FK link entity TVV-BTP-TW-0001..06), tvv_tw_01 login OK, access VV000008 OK. POST API `/api/v1/vu-viecs/{id}/nhan-phan-cong` trả `HTTP 403 ERR-PERM-VI-10-01 "Không phải người được phân công"`.

**Diagnostic:**
- VV000008 state `DA_PHAN_CONG`, gán cho TVV-BTP-TW-0001 (entity id `1e7b8dfb-...`) tại R7 lúc 03:43.
- TVV entity TW-0001 → `taiKhoanId = f0d5ad81-...` (tvv_tw_01 account, link tại R8 lúc 05:42, **sau** Bước 3 phân công).
- JWT tvv_tw_01: vai trò NHT, permission có `nhan-phan-cong_vu_viec` ✅
- Detail API `/vu-viecs/{id}` trả `_links: {tiep-nhan: {...}}` thay vì `{nhan-phan-cong: {...}}` mong đợi cho state DA_PHAN_CONG → BE state machine link generator có thể wrong cho NHT actor.

**Hypothesis:** BE check Bước 4 dùng denormalized snapshot `PHAN_CONG.tu_van_vien_user_id` (account ID lưu lúc Bước 3 phân công). Tại R7 03:43 khi tạo PHAN_CONG record, TVV entity TW-0001 chưa có `tai_khoan_id` (FK link sau ở R8 05:42) → snapshot lưu `null` → BE check `JWT.sub == null` → fail.

**Workaround chưa verify:** re-phân công VV000008 sau khi FK link đã có (force fresh PHAN_CONG record).

**Cần BA verify:** SRS spec Bước 4 BE check pattern:
- Có cho phép FK link sau phân công không?
- Hoặc strict: phân công chỉ valid khi TVV đã có tài khoản trước?

**Bằng chứng:**

```json
// JWT tvv_tw_01 (decoded)
{"sub":"f0d5ad81-...","vaiTro":["NHT"],"donViId":"BTP-TW","permissions":["nhan-phan-cong_vu_viec","tu-choi-phan-cong_vu_viec",...]}

// API call
POST /api/v1/vu-viecs/e2000000-...-008/nhan-phan-cong
Authorization: Bearer <tvv_tw_01 JWT>
Body: {}
→ HTTP 403
{"success":false,"error":{"code":"ERR-PERM-VI-10-01","message":"Không phải người được phân công","timestamp":"2026-05-02T05:48:21.720Z","requestId":"4f631051-..."}}

// VV detail _links (state DA_PHAN_CONG)
"_links":{"tiep-nhan":{"href":"/api/v1/vu-viecs/.../tiep-nhan","method":"POST"}}
// Expected (per SRS Bước 4): "_links":{"nhan-phan-cong":{...},"tu-choi-phan-cong":{...}}

// FK confirmation (verified post-PATCH)
GET /api/v1/tu-van-viens/1e7b8dfb-... → "taiKhoanId":"f0d5ad81-..."
```

---

### OBS-FLOW-VUVIEC-002 — [PARTIALLY RESOLVED R8] TVV TW pool seed không có tài khoản login → block Bước 4 SM-VUVIEC

> **Update R8 2026-05-02:** Setup gap RESOLVED qua task R6.2.7-TW (tạo 6 TK `tvv_tw_01..06` vai trò NHT + link FK). Tuy nhiên Bước 4 vẫn block do BE issue mới — xem OBS-005.

**Hiện tượng:** Sau Bước 3 PASS (R7 02/05 10:43), VV000008 advance state `DA_PHAN_CONG` với TVV-BTP-TW-0001 (Nguyễn Văn Tư Vấn). SRS Bước 4 (`DA_PHAN_CONG → DANG_XU_LY`) yêu cầu actor `tvv_01 / nht_01` login + click "Xác nhận tham gia". Tuy nhiên TVV-BTP-TW-0001..6 (seed bởi R6.4.A1 vào DB) KHÔNG có tài khoản login tương ứng trong `users.csv`.

**Diagnostic:**
```
Login attempt: tvv_btp_tw_01 / Secret@123
→ POST /api/v1/auth/login
→ HTTP 401 ERR-AUTH-LOGIN-01 "Tên đăng nhập hoặc mật khẩu không đúng."
```

`users.csv` 34 accounts hiện chỉ có:
- `tvv_01` (AG, đơn vị STP-AG, ĐP)
- `tvv_02` (BG, đơn vị STP-BG, ĐP)
- `tvv_03` (BNI, đơn vị STP-BNI, ĐP)

KHÔNG có account TVV cấp TW khớp với 6 TVV-BTP-TW-0001..6 đã active sau A1.

cb_nv_tw_01 JWT permissions không bao gồm `xac-nhan-tham-gia_vu_viec` → cb_nv không có quyền override Bước 4 thay TVV.

**Đây có phải bug không?** **CÒN AMBIGUOUS** — cần BA confirm:
1. **Nếu seed task R6.4.A1 thiếu tạo TK login cho TVV TW** → setup gap (không log bug, chỉ thêm seed task R8). Recommend: tạo `tvv_btp_tw_01..06` + link FK `TU_VAN_VIEN.tai_khoan_id`.
2. **Nếu SRS spec TVV cấp TW không cần login (chỉ TVV ĐP cần login)** → BE bug ở `goi-y-tvv` filter — không nên gợi ý TW TVV cho VV thuộc DN ĐP. Cần verify SRS BR-AUTH-10 strict.
3. **Nếu cb_nv được phép override Bước 4** → thiếu permission `xac-nhan-tham-gia_vu_viec` trong vai trò CB_NV_TW. Cần verify SRS phân quyền.

**Repro steps R7:**
1. Login `cb_nv_tw_01 / Secret@123 / OTP 666666`
2. Navigate `/vu-viec/e2000000-0000-4000-8000-000000000008` (state Đang kiểm tra)
3. Click `[Phân công]` → Modal mở
4. Click dropdown → 2 TVV gợi ý (TW-0001, TW-0006)
5. Chọn `TVV-BTP-TW-0001` → click `[Xác nhận]` → ✅ HTTP 201, state advance `DA_PHAN_CONG`
6. Logout cb_nv → thử login `tvv_btp_tw_01 / Secret@123`
7. **Quan sát:** HTTP 401 ERR-AUTH-LOGIN-01. Account không tồn tại.

**Bằng chứng:**

![Bước 3 PASS R7 — VV000008 state Đã phân công, accordion Phân công hiện TVV "Nguyễn Văn Tư Vấn"](../screenshots/r7-a3-step3-PASS-VV000008-da-phan-cong.png)

```json
// POST /phan-cong response (reqid=1522)
{
  "success": true,
  "data": {
    "maVuViec": "VV000008",
    "trangThai": "DA_PHAN_CONG",
    "ngayPhanCong": "2026-05-02T03:43:46.999Z",
    "version": 3
  }
}

// Login TVV TW thử nghiệm
POST /api/v1/auth/login {"username":"tvv_btp_tw_01","password":"Secret@123"}
→ HTTP 401 {"success":false,"error":{"code":"ERR-AUTH-LOGIN-01"}}
```

---

### OBS-FLOW-VUVIEC-003 — [NEW R7] Filter địa bàn (BR-AUTH-10) — TW TVV gợi ý cho VV thuộc DN cấp ĐP

**Hiện tượng:** VV000008 (DN "Hộ kinh doanh An Khang 8", `donViId=00000000-0000-4000-8002-000000000008` cấp ĐP — Sở TP). Dropdown `goi-y-tvv` trả 2 TVV cấp TW (TVV-BTP-TW-0001/0006, đơn vị BTP-TW). SRS BR-AUTH-10 spec "Địa bàn phù hợp (cùng Sở TP — lọc kép)" — về lý thuyết phải lọc TVV cùng đơn vị với DN.

**Hypothesis:** BE filter có exception cho cb_nv_tw_01 (role TW có scope toàn quốc) → trả TW TVV thay vì strict cùng Sở TP. Hoặc BR-AUTH-10 chỉ áp dụng cho cb_nv_dp/cb_nv_bn role, không áp dụng cho TW.

**Cần BA verify:** quote nguyên văn SRS FR-V.I-09 §3.4.5.x BR-AUTH-10 — có exception cho TW role không, hay strict cùng đơn vị áp dụng cho mọi role.

**API evidence:**
```json
// goi-y-tvv response trả TW TVV cho VV thuộc DN cấp ĐP
{
  "data": [
    {"maTvv": "TVV-BTP-TW-0001", "loaiTvv": "TVV", ...},  // TW
    {"maTvv": "TVV-BTP-TW-0006", "loaiTvv": "TVV", ...}   // TW
  ],
  "meta": {"total": 2, "linhVucId": "..."}  // không có trường địa bàn lọc
}

// VU_VIEC.donViId from POST /phan-cong response
"donViId": "00000000-0000-4000-8002-000000000008"  // ĐP — Sở TP
```

---

### OBS-FLOW-VUVIEC-004 — [NEW R7] `nguoiHoTroId` null trong response sau POST /phan-cong

**Hiện tượng:** Response POST `/vu-viecs/{id}/phan-cong` trả `nguoiHoTroId: null` dù request body gửi `tvvId` valid và state advance OK (`DA_PHAN_CONG`).

**Hypothesis:** BE lưu phân công ở entity `PHAN_CONG` riêng (theo SRS §3.4.5 accordion `PHAN_CONG`), không denormalize vào `VU_VIEC.nguoi_ho_tro_id` cho đến khi TVV xác nhận tham gia (Bước 4 → DANG_XU_LY). UI top header hiển thị `NHT/TVV phụ trách: —` consistent với hypothesis này. Sau khi TVV xác nhận, BE có thể update `nguoi_ho_tro_id`.

**Không log bug** — chờ verify BR. Cần BA verify reporting/dashboard query có dùng `nguoi_ho_tro_id` riêng không.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass dev) |
| MailHog | http://103.172.236.130:8025/ |
| API base | http://103.172.236.130:3000/api/v1/ |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP (BE revoke ~2 phút thực bất chấp `exp` 15 phút — memory `qa_htpldn_jwt_revoke_aggressive`) |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-02 10:50 R7 | QA Automation via Claude Code*
