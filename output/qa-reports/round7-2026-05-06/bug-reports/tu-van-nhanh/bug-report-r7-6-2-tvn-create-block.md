# Bug Report — Tư vấn Nhanh (FR-13)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM-HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-05-07 (R8 log) · **Cập nhật 2026-05-08 (R9 sau dev seed)** |
| **Loại test** | Workflow |
| **Round** | R8 log → R9 re-test (workflow PASS 4/5 qua dev seed; bug root cause vẫn open) |
| **Tài liệu tham chiếu** | [workflow-test-report-r7-6-2-tv-nhanh.md](../../workflow/tu-van-nhanh/workflow-test-report-r7-6-2-tv-nhanh.md) (round R9) · [srs-fr-13-tv-nhanh.md](../../../../../input/srs-v3/srs-fr-13-tv-nhanh.md) · [02-thu-tu-module.md §⑫ FR-13](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) |

---

## Tổng hợp

Phát hiện **2** lỗi liên quan workflow R7.6.2 (5 trạng thái SM-TVNHANH).

> **Cập nhật R9 2026-05-08:** Dev seed direct DB 50 phiên cover 6 state → workflow R7.6.2 đã PASS 4/5 transition (B1..B4) qua sample seed; B5 vẫn ⚠️ partial (mTLS DN-only). **2 bug dưới vẫn Open** vì root cause chưa fix: CMS UI vẫn không có [+ Tạo phiên], BE `POST /tu-van-nhanhs` vẫn 401 mTLS, BE `POST /{id}/danh-gia` vẫn 401 mTLS. Per spec FR-X.2-03/05 đúng là DN-only qua Cổng PLQG; "bug" nay nên xem là **test infrastructure dependency** — cần Cổng PLQG sandbox + mTLS cert cho QA hoặc CMS proxy endpoint riêng cho test.

> **Rule log bug:** Bug có SRS reference cụ thể (FR-X.2-03 + SCR-X2-03 + SM-TVNHANH transition `[*] → MOI`).

### Severity breakdown

| Round | Tổng | Critical | Major | Medium | Minor | Trivial |
|-------|------|----------|-------|--------|-------|---------|
| R8 (initial log) | 2 | 1 | 1 | 0 | 0 | 0 |
| **R9 (re-classify)** | **2** | **0** | **2** | **0** | **0** | **0** |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-TVN-R762-001 | Critical → **Major (re-classify R9)** | P0 → **P1 (R9)** | Workflow | R7.6.2 B1 | `srs-fr-13 §SM-TVNHANH transition [*]→MOI` + `FR-X.2-03 §Processing` + `SCR-X2-03 row 1-6` | CMS không có đường tạo phiên TV nhanh "nhập tay" — endpoint mTLS-only + UI thiếu button [+ Tạo phiên] | **Open (workaround dev seed R9)** |
| BUG-TVN-R762-002 | Major | P1 | Workflow | R7.6.2 B5 | `srs-fr-13 FR-X.2-05 §Processing` + `SM-TVNHANH transition CB_TRA_LOI→HOAN_THANH` | Endpoint `POST /tu-van-nhanhs/{id}/danh-gia` mTLS-only — CMS không proxy cho CB NV nhập điểm thay DN | **Open (vẫn chặn B5 verify cập nhật `diem_danh_gia_tb`)** |

> **Re-classify R9:** BUG-001 hạ Critical → Major + P0 → P1 sau khi xác nhận: (a) đây là restriction theo spec FR-X.2-03 (DN-only qua Cổng PLQG), KHÔNG phải lỗi implementation; (b) workflow R7.6.2 đã unblock qua dev seed direct DB. BUG-002 giữ Major P1 vì vẫn chặn end-to-end verify TVN-038 (cập nhật `KHO_CAU_HOI.diem_danh_gia_tb` sau DN đánh giá).

---

## BUG-TVN-R762-001 — CMS không có đường tạo phiên TV nhanh "nhập tay"

### Mô tả

CB NV TW (`cb_nv_tw_01`) đăng nhập CMS và mở `/tv-nhanh/danh-sach` (SCR-X2-03 Quản lý Tư vấn Nhanh). Trang chỉ render filter + table empty (R8 — trước seed) hoặc 50 sample (R9 — sau dev seed). **Không có button [+ Tạo phiên]** / [+ Nhập tay] / [+ Thêm câu hỏi DN] / Modal nhập câu hỏi DN. Thử endpoint trực tiếp `POST /api/v1/tu-van-nhanhs` với cookie session → BE trả 401 ERR-AUTH-MTLS-02 "mTLS client certificate fingerprint missing". Route trực tiếp `/tv-nhanh/tao-moi` redirect về `/tv-nhanh/danh-sach`. Hệ quả: task R7.6.2 (Workflow TV nhanh nhập tay 5 trạng thái) ban đầu BLOCKED ở B1 (MOI) → cascade B2/B3/B4/B5.

**Cập nhật R9 (2026-05-08):** Dev seed direct DB 50 phiên cover 6 state → workflow B1..B4 PASS qua sample seed (xem [workflow report R9](../../workflow/tu-van-nhanh/workflow-test-report-r7-6-2-tv-nhanh.md)). Tuy nhiên root cause UI/endpoint vẫn chưa fix: (a) trang `/tv-nhanh/danh-sach` vẫn không có button [+ Tạo phiên], (b) `POST /api/v1/tu-van-nhanhs` từ CMS cookie vẫn 401 mTLS. Bug giữ Open dưới dạng "test infrastructure dependency" — cần Cổng PLQG sandbox + mTLS cert hoặc CMS proxy endpoint cho CB NV tạo phiên thay DN trong scenario test/service-desk. Nếu spec FR-X.2-03 không cho phép CB NV tạo phiên (DN-only theo design) → đóng bug + log alternate "QA infra requirement" cho dev seed pipeline.

### Các bước tái hiện

1. Login CMS với `cb_nv_tw_01` / `Secret@123` + OTP `666666` → `/dashboard` ✅
2. Sidebar → "Quản lý tư vấn ▶" → click "Tư vấn nhanh" → URL `/tv-nhanh/danh-sach`
3. Snapshot trang: tìm button có chữ "Tạo" / "Thêm" / "Mới" / "+" trong main area → KHÔNG có
4. Page chỉ có 3 button: `[Tìm kiếm]`, `[Xóa bộ lọc]`, `[Làm mới]`
5. Thử navigate trực tiếp `http://103.172.236.130:3000/tv-nhanh/tao-moi` → app redirect về `/tv-nhanh/danh-sach`
6. Thử endpoint API trực tiếp:
   ```js
   fetch('/api/v1/tu-van-nhanhs', {
     method:'POST', credentials:'include',
     headers:{'Content-Type':'application/json'},
     body: JSON.stringify({cauHoi:'Test manual create', kenh:'TV_NHANH', linhVucId:'bbbbbbbb-0000-4000-8000-000000000013'})
   })
   ```
   → 401 `{"code":"ERR-AUTH-MTLS-02","message":"mTLS client certificate fingerprint missing"}`
7. Verify: `GET /api/v1/tu-van-nhanhs?pageSize=50` → 200 total=0 (DB không có phiên nào)

### Kết quả mong đợi

- Theo SM-TVNHANH (srs-fr-13 line 622-628), state đầu tiên là `MOI` với trigger "DN gửi câu hỏi qua Cổng PLQG" (FR-X.2-03). **Để chạy QA workflow nhập tay**, cần MỘT trong các phương án sau:
  - (a) BE expose CMS-only endpoint cho CB NV tạo phiên thay DN (vd `POST /api/v1/tu-van-nhanhs/cms-create` nhận body `{cauHoi, kenh, linhVucId, doanhNghiepId?}`).
  - (b) UI SCR-X2-03 thêm button [+ Tạo phiên TV nhanh] mở modal nhập câu hỏi DN + chọn kênh + chọn LV → submit tạo session state `MOI`.
  - (c) Cung cấp Cổng PLQG sandbox + mTLS client cert cho QA dùng test inbound.
  - (d) BE seed direct DB ≥1 phiên `MOI` mỗi round QA.
- Sau khi tạo MOI thành công, system tự chuyển `MOI → DANG_TIM_KIEM → DA_GOI_Y` (auto, đúng SRS line 622-624) và trả TOP 5 gợi ý từ KHO_CAU_HOI (DA_DUYET ∧ hieuLuc=true).

### Kết quả thực tế

- Trang `/tv-nhanh/danh-sach` không có UI tạo phiên (cả button toolbar lẫn route `/tv-nhanh/tao-moi`).
- BE từ chối CMS cookie session với 401 ERR-AUTH-MTLS-02:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERR-AUTH-MTLS-02",
      "message": "mTLS client certificate fingerprint missing",
      "timestamp": "2026-05-07T16:42:49.129Z",
      "requestId": "416f4dc9-aefe-446b-8fe7-f3924f6f09a1"
    }
  }
  ```
- Hệ quả: task R7.6.2 BLOCKED 0/5 transition; downstream R7.7.11 (functional 39 TC TV nhanh) + R7.E4 (monitor TV nhanh) cũng đứng chờ.

### Bằng chứng

![BUG-TVN-R762-001 R8 — Trang `/tv-nhanh/danh-sach` cb_nv_tw_01: filter + 4 tab + table empty "Không có phiên tư vấn nhanh nào.", chỉ có 3 button [Tìm kiếm]/[Xóa bộ lọc]/[Làm mới]](image/bug-tvn-r762-001-list-empty.png)

![BUG-TVN-R762-001 R8 — Full page screenshot xác nhận KHÔNG có button [+ Tạo phiên] / [+ Nhập tay] / Modal nhập](image/bug-tvn-r762-001-no-create-button.png)

![BUG-TVN-R762-001 R9 — Trang `/tv-nhanh/danh-sach` sau dev seed: 50 phiên cover 6 state, vẫn KHÔNG có button [+ Tạo phiên]/[+Nhập tay] trên toolbar](../../screenshots/r7-6-2-r9-tvn-list-50sessions.png)

```text
=== R8 trace (cb_nv_tw_01, 2026-05-07 23:42) — initial BLOCK ===
POST /api/v1/tu-van-nhanhs
     {cauHoi:"Test manual create", kenh:"TV_NHANH", linhVucId:"bbbbbbbb-0000-4000-8000-000000000013"}
  → 401 ERR-AUTH-MTLS-02 "mTLS client certificate fingerprint missing"

GET  /api/v1/tu-van-nhanhs?pageSize=50 → 200 total=0
navigate /tv-nhanh/tao-moi → 302 redirect /tv-nhanh/danh-sach (no manual create route)
UI buttons main area: ["Tìm kiếm","Xóa bộ lọc","Làm mới"] — KHÔNG có [+ Tạo phiên]

=== R9 trace (cb_nv_tw_01, 2026-05-08 00:44) — sau dev seed ===
GET  /api/v1/tu-van-nhanhs?pageSize=50 → 200 total=50
  byState: {MOI:8, DANG_TIM_KIEM:6, DA_GOI_Y:12, CB_TRA_LOI:8, HOAN_THANH:12, HET_HAN:4}
  → Pool đầy đủ 6 state, workflow R7.6.2 unblock qua sample sẵn

POST /api/v1/tu-van-nhanhs (re-test cùng body) → 401 ERR-AUTH-MTLS-02 (giữ nguyên — root cause chưa fix)
UI toolbar: vẫn không có [+ Tạo phiên] (chỉ [Làm mới])
navigate /tv-nhanh/tao-moi → 302 redirect (no route)

→ Workflow OK qua dev-seeded sample. Bug giữ Open vì:
  (1) CMS QA dependency vào dev seed (không tự reproduce được)
  (2) Nếu cần test thêm phiên sau seed expire, chặn lại
  (3) Production ops scenario "CB NV tạo phiên thay DN" (service desk) chưa có path
```

---

## BUG-TVN-R762-002 — Endpoint `POST /tu-van-nhanhs/{id}/danh-gia` chỉ chấp nhận mTLS, CMS không proxy

### Mô tả

Theo SM-TVNHANH transition `CB_TRA_LOI → HOAN_THANH` (srs-fr-13 line 627) + `DA_GOI_Y → HOAN_THANH` (line 626), trigger là DN đánh giá điểm 1-5 + nhận xét. Endpoint backend `POST /api/v1/tu-van-nhanhs/{id}/danh-gia` được expose nhưng yêu cầu mTLS client cert (Cổng PLQG inbound) → CMS cookie session bị từ chối với 401 ERR-AUTH-MTLS-02. CMS không có UI cho CB NV nhập điểm thay DN, cũng không có endpoint proxy `/cms/danh-gia`. Hệ quả: workflow B5 R7.6.2 không verify được end-to-end từ CMS.

**Cập nhật R9 (2026-05-08):** Pool 12 phiên HOAN_THANH có sẵn từ dev seed direct DB → chứng minh transition CB_TRA_LOI → HOAN_THANH đạt được trong production-like environment. Tuy nhiên:
- Sample HOAN_THANH có schema field `danhGiaTv` (sub-resource) hiện **null** trong dev seed → DN đánh giá chưa được seed.
- BR cập nhật `KHO_CAU_HOI.diem_danh_gia_tb` (TVN-038 cross-link FR-X.2-05 §Processing 3) **chưa verify được**.
- Endpoint `/danh-gia` từ CMS cookie vẫn 401 mTLS (re-test R9 confirmed).

→ Bug giữ Open. Cần MỘT trong các giải pháp: (a) Cổng PLQG sandbox + mTLS cert cho QA; (b) BE expose CMS proxy endpoint cho CB NV nhập điểm test; (c) dev seed thêm `danh_gia_tv` records với điểm + nhận xét cho ≥3 phiên HOAN_THANH → verify TVN-038.

### Các bước tái hiện

1. Login CMS với `cb_nv_tw_01` / `Secret@123` + OTP `666666`.
2. Giả định có session ở state CB_TRA_LOI (id placeholder `00000000-0000-4000-8000-000000000001`).
3. Thử endpoint:
   ```js
   fetch('/api/v1/tu-van-nhanhs/00000000-0000-4000-8000-000000000001/danh-gia', {
     method:'POST', credentials:'include',
     headers:{'Content-Type':'application/json'},
     body: JSON.stringify({diem:5, nhanXet:'Test'})
   })
   ```
4. Quan sát response.

### Kết quả mong đợi

- Theo FR-X.2-05 + SM-TVNHANH `CB_TRA_LOI → HOAN_THANH`, BE hoặc:
  - (a) Tạo CMS proxy endpoint `POST /api/v1/tu-van-nhanhs/{id}/danh-gia/cms-proxy` cho CB NV nhập điểm thay DN trong scenario nhập tay (QA hoặc service desk).
  - (b) Cung cấp Cổng PLQG sandbox cho QA gọi inbound mTLS thật.
  - (c) BE seed direct phiên ở state HOAN_THANH cho QA verify cột "Điểm TB" KHO_CAU_HOI.

### Kết quả thực tế

- Endpoint trả 401 với cookie session:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERR-AUTH-MTLS-02",
      "message": "mTLS client certificate fingerprint missing",
      "timestamp": "2026-05-07T16:42:19.101Z",
      "requestId": "..."
    }
  }
  ```
- Cùng pattern với `POST /api/v1/tu-van-nhanhs` (B1 create) — BE rate-limit toàn bộ DN-driven step bằng mTLS, không expose CMS path.

### Bằng chứng

```text
=== R8 trace (cb_nv_tw_01, 2026-05-07 23:42) ===
POST /api/v1/tu-van-nhanhs/00000000-0000-4000-8000-000000000001/danh-gia
     {diem:5, nhanXet:'t'}
  → 401 ERR-AUTH-MTLS-02 "mTLS client certificate fingerprint missing"

# CMS-accessible endpoints comparison:
POST /api/v1/tu-van-nhanhs/{id}/tra-loi   {} → 422 ERR-TVN-02 noiDungTraLoi (CMS auth OK)
POST /api/v1/tu-van-nhanhs/{id}/chuyen-kenh {} → 404 ERR-TVN-01 (no session, CMS auth OK)
GET  /api/v1/tu-van-nhanhs/{id}/goi-y → 404 ERR-TVN-01 (no session, CMS auth OK)
POST /api/v1/tu-van-nhanhs            {body} → 401 ERR-AUTH-MTLS-02 ❌ (DN-only)
POST /api/v1/tu-van-nhanhs/{id}/danh-gia {body} → 401 ERR-AUTH-MTLS-02 ❌ (DN-only)

=== R9 re-test (cb_nv_tw_01, 2026-05-08 00:46) ===
GET  /api/v1/tu-van-nhanhs?trangThai=HOAN_THANH&pageSize=5 → 200 total=12 (pool có sẵn)

GET  /api/v1/tu-van-nhanhs/{id-HOAN_THANH-sample}?expand=danhGiaTv,...
  → 200 {trangThai:'HOAN_THANH', noiDungTraLoi:'...', danhGiaTv:null,
         nguoiTraLoi:{hoTen:'CB Nghiệp vụ TW 02'}, khoCauHoiDaChon:{ma:'QA-20260508-0003'}}
  → Schema field `danhGiaTv` exists nhưng null cho sample dev seed
  → TVN-038 cập nhật `diem_danh_gia_tb` chưa verify được

POST /api/v1/tu-van-nhanhs/3ee455dc-a443-44af-9a41-500cd4125e29/danh-gia
     {diem:5, nhanXet:'Trả lời rõ ràng, chính xác, đầy đủ.', version:3}
  → 401 ERR-AUTH-MTLS-02 (giữ nguyên — endpoint vẫn DN-only)
  → Phiên TVN-QA-20260428-0015 stuck ở CB_TRA_LOI sau B4 PASS — không reach HOAN_THANH từ CMS
```

![BUG-TVN-R762-002 R9 — Detail TVN-QA-20260428-0016 sau B4 PASS state CB_TRA_LOI: Stepper 4/5 ✓, button [Gửi trả lời] disabled, KHÔNG có form đánh giá DN trong CMS](image/r7-7-11-tvn-001-list-tatca.png)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm thời) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | `/api/v1` |
| Frontend | React + Vite + Ant Design (cookie session, httpOnly) |
| Xác thực | Username/password + OTP 6-digit (BR-AUTH-01 Tier 1) |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-07 (R8) | Updated: 2026-05-08 (R9 re-test sau dev seed) | QA Automation via Claude Code*
