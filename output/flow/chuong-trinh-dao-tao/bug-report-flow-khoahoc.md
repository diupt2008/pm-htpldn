# Bug Report — Flow SM-KHOAHOC (Sub-menu 1: Chương trình ĐT & Khoá học)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 17:58:00 [2026-04-23] |
| **Loại test** | Functional flow — SM-KHOAHOC end-to-end (10 bước) |
| **Round** | Round 2 — Flow function test (sau Round 1 CREATE BLOCKED) |
| **Tài liệu tham chiếu** | [seed-fixture.yaml §chuong_trinh_dao_tao_variants + §khoa_hoc_variants](../../../input/data/seed-fixture.yaml), [flow-module.md §6 SM-KHOAHOC Sub-menu 1](../../../input/flow-module.md), [srs-fr-03-dao-tao.md §FR-III-01](../../../input/srs-v3/srs-fr-03-dao-tao.md), [functional-test-report-flow-khoahoc.md](functional-test-report-flow-khoahoc.md) |

---

## Tổng hợp

Phát hiện **5** lỗi có SRS/flow-module reference cụ thể trong quá trình chạy flow SM-KHOAHOC (Sub-menu 1) với fixture `khoa_hoc_variants[1]` link CTDT-BTP-TW-2026-0001.

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể (`FR-X`, `BR-X`, `SCR-X row Y`, `flow-module §X Bước N`, `Inputs row N`). Quan sát không map được clause SRS → ghi ở section `## Observations — ngoài SRS`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 5    | 1        | 3     | 1      | 0     | 0       |

### Test result breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Workflow** | State transition CTDT + Khoá học theo flow-module §6 | 10 | 3 | 0 | 1 | 6 | **30%** |
| **Authorization** | Role × action (CB_NV/LANH_DAO/QTHT trên publish) | 1 | 0 | 0 | 0 | 1 | **0%** |
| **Workaround** | Push CTDT-0001 lên DA_DUYET (UI yêu cầu, SRS không) | 1 | 1 | 0 | 0 | 0 | **100%** |
| **Total** | | **12** | **4** | **0** | **1** | **7** | **33%** |

→ **Workflow Pass Rate = 3/10 (30%)** — flow chặn cứng tại Bước 4 do BUG-KHFLOW-002 (BE 502) + BUG-KHFLOW-004 (UI thiếu nút thêm học viên).

---

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS / Flow Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|--------------------------|-------|--------|
| BUG-KHFLOW-001 | Major | P1 | Data | Khoá học (FR-III-01) | KHFLOW-001 | `srs-fr-03-dao-tao.md §FR-III-01 Inputs Khoá học row 4 (ngay_bat_dau)` | Ngày bắt đầu Khoá học lưu lệch -1 ngày so với input (timezone) | Open |
| BUG-KHFLOW-002 | **Critical** | **P0** | Workflow | Khoá học | KHFLOW-004A/B/C | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 6 (DA_DUYET → DANG_DIEN_RA)` | API `POST /khoa-hocs/{id}/publish` 502 Bad Gateway cho QTHT_TW (role có permission) | Open |
| BUG-KHFLOW-003 | Major | P1 | Permission | Khoá học | KHFLOW-004A, KHFLOW-004B | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 6` + Action Disclosure principle | Nút [Công khai] hiển thị cho mọi role mà không kiểm tra permission (CB_NV/LANH_DAO_TW thấy nhưng API 403) | Open |
| BUG-KHFLOW-004 | Major | P1 | UI/UX | Khoá học | KHFLOW-005 | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 4` | Tab Học viên thiếu nút "[+ Thêm học viên thủ công]" | Open |
| BUG-KHFLOW-005 | Medium | P2 | UI/UX | Khoá học | KHFLOW-001 | `srs-fr-03-dao-tao.md §FR-III-01 Inputs Khoá học row 3 (ctdt_id)` + SCR display rule | Detail Khoá học hiển thị Chương trình ĐT bằng UUID raw thay vì mã+tên | Open |

---

## BUG-KHFLOW-001 — Major — Ngày bắt đầu Khoá học lưu lệch -1 ngày so với input (timezone bug)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-KHFLOW-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Khoá học (Đào tạo Sub-menu 1) |
| **Thành phần** | Form Tạo khoá học (`/dao-tao/khoa-hoc/tao-moi`), DatePicker `Thời gian diễn ra` |
| **URL** | http://103.172.236.130:3000/dao-tao/khoa-hoc/tao-moi |
| **Trình duyệt** | Chrome DevTools MCP (chromium-mcp) |
| **Tài khoản** | canbo_tw_5 (CB_NV cấp TW) |
| **TC Reference** | KHFLOW-001 |
| **SRS Reference** | `srs-fr-03-dao-tao.md §FR-III-01 Inputs Khoá học row 4 (ngay_bat_dau: date, required)` — SRS không quy định timezone treatment, mặc định dạng date-only `YYYY-MM-DD` không kèm offset. |
| **Assignee** | FE Team (timezone normalize) + BE Team (kiểm tra column type DATE) |
| **Found by** | QA Automation (MCP) |

### Mô tả

Khi tạo Khoá học, người dùng chọn ngày bắt đầu `15/05/2026` từ DatePicker calendar cell. Sau khi save, detail Khoá học hiển thị `Ngày bắt đầu: 14/05/2026` (lệch -1 ngày). Ngày kết thúc `20/05/2026` được lưu đúng `20/05/2026`.

### Các bước tái hiện

1. Login `canbo_tw_5` / `Test@1234`, OTP `666666`.
2. Sidebar → Quản lý đào tạo → Khoá học → click `[+ Thêm mới]`.
3. Fill `Tên khoá học = "Pháp luật doanh nghiệp căn bản"`, chọn CTDT-BTP-TW-2026-0001 (đã DA_DUYET).
4. Click DatePicker `Thời gian diễn ra` → click ngày 15 trong panel calendar tháng May 2026.
5. Click ngày 20 trong cùng panel → date range = `15/05/2026 ~ 20/05/2026`.
6. Fill các field còn lại (Sĩ số 50, Số buổi 5, Đối tượng "Chủ DN, kế toán trưởng DN SME"), click `[Tạo khoá học]`.
7. Quan sát detail KH-20260423-001 mới tạo: field "Ngày bắt đầu" hiển thị **14/05/2026** thay vì 15/05/2026.

### Kết quả mong đợi

- Detail Khoá học hiển thị `Ngày bắt đầu: 15/05/2026` (đúng input) per `srs-fr-03-dao-tao.md §FR-III-01 row 4`.

### Kết quả thực tế

- Detail hiển thị `Ngày bắt đầu: 14/05/2026` (lệch -1 ngày). Ngày kết thúc 20/05/2026 đúng.

### Bằng chứng

- Screenshot: [image/06-form-tao-khoahoc-filled.png](image/06-form-tao-khoahoc-filled.png) (form fill xong, picker hiển thị 15/05 → 20/05)
- Screenshot: [image/07-khoahoc-001-created-bug-date-uuid.png](image/07-khoahoc-001-created-bug-date-uuid.png) (detail sau save: ngày bắt đầu 14/05/2026)

### Root Cause (Suggested)

Timezone bug: FE serialize date dạng UTC midnight (`new Date('2026-05-15').toISOString()` → `2026-05-15T00:00:00.000Z`), BE/DB lưu UTC, nhưng khi hiển thị FE format dùng local timezone UTC+7 → trừ 7h thành `2026-05-14 17:00`. Hoặc ngược lại (FE format theo Asia/Ho_Chi_Minh, BE save UTC raw).

### Đề xuất fix

- FE: Dùng `dayjs(value).format('YYYY-MM-DD')` (date-only, không timezone), gửi BE dạng string không có offset.
- BE: Cột `ngay_bat_dau` dùng type `DATE` (không `TIMESTAMP`/`DATETIME`) → tránh implicit timezone conversion.
- Test cross-timezone: tester ở UTC+0 (London) và UTC-5 (NYC) đều thấy 15/05 nếu input 15/05.

---

## BUG-KHFLOW-002 — **Critical** — API `POST /khoa-hocs/{id}/publish` 502 Bad Gateway cho QTHT_TW (role có permission)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-KHFLOW-002 |
| **Severity** | **Critical** |
| **Priority** | **P0** |
| **Type** | Workflow / BE error |
| **Status** | Open |
| **Module** | Khoá học (Đào tạo Sub-menu 1) — Bước "Công khai" |
| **Thành phần** | Endpoint `POST /api/v1/khoa-hocs/{id}/publish`, BE handler |
| **URL** | http://103.172.236.130:3000/dao-tao/khoa-hoc/{id} |
| **Trình duyệt** | Chrome DevTools MCP |
| **Tài khoản** | qtht_tw_5 (QTHT_TW cấp TW), test cross-role canbo_tw_5 + lanhdao_tw_5 |
| **TC Reference** | KHFLOW-004A, KHFLOW-004B, KHFLOW-004C |
| **SRS Reference** | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 6 (DA_DUYET → DANG_DIEN_RA: hệ thống tự động khi đến ngày bắt đầu, hoặc CB NV nhấn kích hoạt thủ công)` — UI deviation: thêm bước "Đã công khai" giữa ĐÃ DUYỆT và ĐANG DIỄN RA, action `Công khai` qua endpoint `/publish`. |
| **Assignee** | BE Team (debug 502), FE Team (gỡ nút sai role) |
| **Found by** | QA Automation (MCP) |

### Mô tả

Khoá học `KH-20260423-001` ở state `ĐÃ DUYỆT`, click `[Công khai]` → API `POST /api/v1/khoa-hocs/6a2c2881-6387-4afa-ac48-1c5b39a50467/publish` trả status code khác nhau theo role:

| Role login | username | HTTP status | Console error |
|-----------|----------|-------------|----------------|
| CB_NV | `canbo_tw_5` | **403 Forbidden** | `Failed to load resource: 403 (Forbidden)` |
| LANH_DAO_TW | `lanhdao_tw_5` | **403 Forbidden** | `Failed to load resource: 403 (Forbidden)` |
| QTHT_TW | `qtht_tw_5` | **502 Bad Gateway** | `Failed to load resource: 502 (Bad Gateway)` |

QTHT_TW là role duy nhất KHÔNG bị 403 → suy luận role này có permission. Tuy nhiên BE crash 502 → flow Công khai không thực hiện được với BẤT KỲ role nào.

### Các bước tái hiện

1. (Workaround) Login `canbo_tw_5`, push CTDT-0001 → CHO_DUYET. Login `lanhdao_tw_5`, phê duyệt CTDT-0001 → DA_DUYET.
2. Login `canbo_tw_5`, tạo Khoá học `KH-20260423-001` link CTDT-0001 (state DỰ THẢO), click `[Trình phê duyệt]` → CHỜ DUYỆT.
3. Login `lanhdao_tw_5`, click `[Phê duyệt]` → ĐÃ DUYỆT.
4. Trên detail KH ở state ĐÃ DUYỆT (vẫn login lanhdao_tw_5), click `[Công khai]` → confirm modal → click `[Công khai]` → toast lỗi "Không thể công khai. Vui lòng thử lại."
5. Network: `POST /api/v1/khoa-hocs/{id}/publish` → **403 Forbidden**.
6. Logout, login `canbo_tw_5`, lặp bước 4 → cùng kết quả 403.
7. Logout, login `qtht_tw_5`, lặp bước 4 → toast cùng error message, network → **502 Bad Gateway**.

### Kết quả mong đợi

- Một role được chỉ định (suy luận: QTHT_TW hoặc CB_NV — flow-module Bước 6 nói CB NV nhấn kích hoạt) trả 200 OK + KH chuyển sang `ĐÃ CÔNG KHAI` → tiếp tục Bước 4-10 flow.
- Roles khác trả 403 với toast rõ ràng "Bạn không có quyền công khai khoá học, liên hệ {role}".

### Kết quả thực tế

- 3/3 role thử đều fail. QTHT_TW có quyền nhưng BE 502 → blocker chính của flow.

### Bằng chứng

- Screenshot QTHT 502: [image/11-qtht-cong-khai-be-502.png](image/11-qtht-cong-khai-be-502.png)
- Screenshot CB_NV 403: [image/09-cbnv-cong-khai-fail.png](image/09-cbnv-cong-khai-fail.png)
- Network log QTHT (xem MCP `list_network_requests` output trong section §4 functional report): `POST /api/v1/khoa-hocs/6a2c2881-6387-4afa-ac48-1c5b39a50467/publish [502]`
- Network log CB_NV: `POST /api/v1/khoa-hocs/6a2c2881-6387-4afa-ac48-1c5b39a50467/publish [403]`

### Impact

- **Block toàn bộ Bước 4-10** flow SM-KHOAHOC (thêm học viên / duyệt đăng ký / kích hoạt / kết thúc / nhập điểm / cấp chứng nhận).
- **Cascade impact** sang module downstream: Đánh giá hiệu quả (cần KH `HOÀN THÀNH`), CT HTPLDN báo cáo (preset M6.1 cần KH `HOÀN THÀNH`), Báo cáo thống kê 23 loại (đào tạo).
- **Spec gap:** flow-module §6 không nói role nào "Công khai" (vì không có bước này) → BA + dev cần thống nhất role responsibility trước khi fix.

### Root Cause (Suggested)

- BE handler crash 502 trong action publish: thường do (a) thiếu validation precondition (vd: phải gán ≥1 bài giảng/giảng viên trước khi publish), (b) NullPointerException trên field optional, hoặc (c) downstream service (notification gửi DN qua Cổng PLQG) timeout.
- Cần xem BE log `/var/log/nestjs/error.log` (hoặc tương đương) tại timestamp `2026-04-23 17:57:55+07` reqid 989.

### Đề xuất fix

1. Dev BE check log 502 tại endpoint `/publish`. Nếu là precondition bug → trả 400 với message rõ ("Khoá học chưa gán bài giảng" / "Chưa gán giảng viên") thay vì 502.
2. Update permission matrix + flow-module §6 để rõ role nào được Công khai (CB_NV theo flow gốc Bước 6 "Hệ thống hoặc CB NV"; nếu QTHT thì cần BA confirm).
3. UI gỡ nút `[Công khai]` cho role không có permission (BUG-KHFLOW-003).

---

## BUG-KHFLOW-003 — Major — Nút [Công khai] hiển thị cho mọi role mà không kiểm tra permission (vi phạm Action Disclosure)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-KHFLOW-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission / UI |
| **Status** | Open |
| **Module** | Khoá học (Đào tạo Sub-menu 1) |
| **Thành phần** | Detail Khoá học (`/dao-tao/khoa-hoc/{id}`), action button block |
| **URL** | http://103.172.236.130:3000/dao-tao/khoa-hoc/{id} |
| **Trình duyệt** | Chrome DevTools MCP |
| **Tài khoản** | canbo_tw_5, lanhdao_tw_5 (cả 2 đều thấy nút nhưng API trả 403) |
| **TC Reference** | KHFLOW-004A, KHFLOW-004B |
| **SRS Reference** | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 6` (chỉ định role thực hiện) + nguyên tắc Action Disclosure (UI chỉ hiển thị action mà role thật sự thực hiện được, tránh fail-after-click). Tham chiếu cùng quy chuẩn: `output/permission-matrix.md` (49 entity × 11 role). |
| **Assignee** | FE Team |
| **Found by** | QA Automation (MCP) |

### Mô tả

Nút `[Công khai]` (cùng `[Phê duyệt]`/`[Từ chối]`) hiển thị nhất quán trên detail Khoá học (state `ĐÃ DUYỆT`) cho mọi role login (CB_NV, LANH_DAO_TW, QTHT_TW). Khi CB_NV hoặc LANH_DAO_TW click → API trả 403 + toast generic "Không thể công khai. Vui lòng thử lại." (không nói rõ thiếu permission).

### Các bước tái hiện

1. Login `canbo_tw_5`, vào detail Khoá học ở state ĐÃ DUYỆT.
2. Quan sát nút `[Công khai]` hiển thị → click → confirm modal → click `[Công khai]` → fail toast generic, API 403.
3. Logout, login `lanhdao_tw_5`, lặp → cùng symptom.

### Kết quả mong đợi

- FE check `/auth/me` permission → **ẩn** nút `[Công khai]` cho role không có permission, hoặc disable + tooltip "Bạn không có quyền công khai khoá học, liên hệ {role có permission}".
- Cùng nguyên tắc: ẩn `[Phê duyệt]/[Từ chối]` cho cùng người vừa submit (separation of duty — CB NV không được duyệt cái chính mình submit).

### Kết quả thực tế

- Mọi role thấy nút → fail-after-click → UX kém + lộ thông tin nội bộ (action tồn tại) cho role không liên quan.

### Bằng chứng

- Screenshot: [image/09-cbnv-cong-khai-fail.png](image/09-cbnv-cong-khai-fail.png)
- Screenshot: [image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png](image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png) (cùng pattern: CB NV thấy nút Phê duyệt/Từ chối CTDT mình vừa submit)

### Impact

- UX nhầm lẫn cho user 2 role (canbo_tw_5, lanhdao_tw_5) — không hiểu tại sao fail.
- Lộ thông tin: lộ rằng action `Công khai` tồn tại + role nào có thể thực hiện (do toast khác nhau khi 403 vs 502).

### Root Cause (Suggested)

FE chỉ render action button dựa trên `khoa_hoc.trang_thai === 'DA_DUYET'` mà không check permission user. Cần wrap button trong `<Can I="publish" a="khoa-hoc">` (CASL pattern) hoặc gọi `/auth/me/permissions` trước render.

### Đề xuất fix

1. FE: Implement permission-aware action buttons:
   ```tsx
   {canPublish && <Button onClick={handlePublish}>Công khai</Button>}
   ```
2. Toast lỗi 403 cụ thể: "Bạn không có quyền công khai khoá học. Liên hệ Quản trị hệ thống."
3. Apply cùng pattern cho `[Phê duyệt]/[Từ chối]` (ẩn cho người vừa submit).

---

## BUG-KHFLOW-004 — Major — Tab "Học viên" thiếu nút "[+ Thêm học viên thủ công]"

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-KHFLOW-004 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI / Missing feature |
| **Status** | Open |
| **Module** | Khoá học — tab Học viên |
| **Thành phần** | `/dao-tao/khoa-hoc/{id}?tab=hoc-vien` |
| **URL** | http://103.172.236.130:3000/dao-tao/khoa-hoc/6a2c2881-6387-4afa-ac48-1c5b39a50467?tab=hoc-vien |
| **Trình duyệt** | Chrome DevTools MCP |
| **Tài khoản** | canbo_tw_5 |
| **TC Reference** | KHFLOW-005 |
| **SRS Reference** | `flow-module.md §6 SM-KHOAHOC Sub-menu 1 Bước 4`: *"Đăng nhập CB NV. Vào tab "Học viên" của khóa học → click [+ Thêm học viên thủ công]. Nhập hộ DN/NHT: tên, MST DN, email, SĐT. Lưu → bản ghi đăng ký tạo thẳng ở CHỜ DUYỆT."* |
| **Assignee** | FE Team |
| **Found by** | QA Automation (MCP) |

### Mô tả

Tab "Học viên" trong detail Khoá học (state ĐÃ DUYỆT trở lên) chỉ có nút `[Import Excel]` và combobox filter trạng thái. **Không có nút `[+ Thêm học viên]` / `[+ Thêm thủ công]`** mà flow-module §6 Bước 4 yêu cầu.

### Các bước tái hiện

1. Login `canbo_tw_5`, mở Khoá học `KH-20260423-001` (state ĐÃ DUYỆT).
2. Click tab "Học viên".
3. Quan sát tab content chỉ có:
   - Combobox filter "Tất cả trạng thái"
   - Nút `[Import Excel]`
   - Bảng STT/Họ tên/Email/SĐT/Đơn vị/Nguồn/Ngày đăng ký/Trạng thái/Thao tác (empty state "Chưa có đăng ký nào")

### Kết quả mong đợi

Nút `[+ Thêm học viên thủ công]` hiển thị trong tab Học viên. Click → mở modal/drawer nhập 4 field theo flow:
- Tên (required)
- MST DN (required)
- Email (required)
- SĐT (required)

Save → tạo bản ghi `DANG_KY_DAO_TAO` với `nguon = NHAP_TAY`, `trang_thai = CHO_DUYET` (per fixture `dang_ky_dao_tao_variants`).

### Kết quả thực tế

- Không có entry điểm cho CB NV thêm thủ công. CB NV chỉ có thể Import Excel hoặc chờ DN tự đăng ký từ Cổng PLQG (chưa có integration).

### Bằng chứng

- Screenshot: [image/10-tab-hocvien-no-add-button.png](image/10-tab-hocvien-no-add-button.png)

### Impact

- Block Bước 4 flow → không có học viên trong KH → block Bước 5 (duyệt đăng ký) → block toàn bộ downstream.
- Chỉ có Import Excel nghĩa là tester phải tạo file Excel manually mỗi lần test → không phù hợp cho QA seed nhanh 6 fixture.

### Root Cause (Suggested)

FE thiếu component `[+ Thêm học viên]` button + modal nhập (tương tự pattern `[+ Thêm mới]` ở các module khác).

### Đề xuất fix

Bổ sung nút `[+ Thêm học viên]` bên cạnh `[Import Excel]`. Modal có 4 field bắt buộc + nút Submit. POST `/api/v1/dang-ky-dao-taos` với payload `{khoa_hoc_id, ho_ten, ma_so_thue_dn, email, so_dien_thoai, nguon: 'NHAP_TAY'}`.

---

## BUG-KHFLOW-005 — Medium — Detail Khoá học hiển thị Chương trình ĐT bằng UUID raw

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-KHFLOW-005 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Khoá học — tab Thông tin |
| **Thành phần** | Detail Khoá học (`/dao-tao/khoa-hoc/{id}`) |
| **URL** | http://103.172.236.130:3000/dao-tao/khoa-hoc/6a2c2881-6387-4afa-ac48-1c5b39a50467 |
| **Trình duyệt** | Chrome DevTools MCP |
| **Tài khoản** | canbo_tw_5 |
| **TC Reference** | KHFLOW-001 |
| **SRS Reference** | `srs-fr-03-dao-tao.md §FR-III-01 Inputs Khoá học row 3 (ctdt_id: identifier, FK → CHUONG_TRINH_DAO_TAO)` + SCR-III-02 display rule (FK reference field cần render mã+tên thay UUID). |
| **Assignee** | FE Team |
| **Found by** | QA Automation (MCP) |

### Mô tả

Field "Chương trình ĐT" trong tab "Thông tin" của detail Khoá học hiển thị UUID raw `e52de325-9814-4d20-8583-312da20141be` thay vì mã + tên CTDT (`CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ`).

### Các bước tái hiện

1. Tạo Khoá học link CTDT-BTP-TW-2026-0001 (KHFLOW-001).
2. Mở detail Khoá học vừa tạo → tab Thông tin.
3. Quan sát field "Chương trình ĐT" → giá trị `e52de325-9814-4d20-8583-312da20141be`.

### Kết quả mong đợi

Field "Chương trình ĐT" hiển thị `CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ` (link clickable mở detail CTDT).

### Kết quả thực tế

- UUID raw, không user-friendly, không nhận diện được CTDT cha.

### Bằng chứng

- Screenshot: [image/07-khoahoc-001-created-bug-date-uuid.png](image/07-khoahoc-001-created-bug-date-uuid.png)

### Impact

- UX kém: user cần copy UUID rồi search bên CTDT list để biết CTDT nào.
- Vi phạm pattern các module khác (CTDT/Đơn vị/...) đều hiển thị mã+tên cho FK.

### Root Cause (Suggested)

FE không join CTDT info khi render detail KH — payload BE chỉ trả `ctdt_id` UUID. Cần BE include `ctdt: { ma, ten }` trong response, hoặc FE gọi thêm `/chuong-trinh-dao-taos/{id}` để lấy mã+tên.

### Đề xuất fix

- BE: include `ctdt_info: { ma_chuong_trinh, ten_chuong_trinh }` trong response GET `/khoa-hocs/{id}`.
- FE: render `{ctdt_info.ma_chuong_trinh} — {ctdt_info.ten_chuong_trinh}` (link `<Link to="/dao-tao/chuong-trinh/{ctdt_id}">`).

---

## Observations — ngoài SRS (không log bug)

> **Mục đích:** Ghi lại quan sát quan trọng nhưng không có SRS reference cụ thể (deviation flow-module hoặc UI quirk) — BA cần confirm trước khi dev fix.

| Observation | Chi tiết / Evidence | SRS / Flow có nói không? | Đề xuất |
|-------------|---------------------|--------------------------|---------|
| **OBS-KHFLOW-001** — Sau khi CB NV hoặc CB PD submit/duyệt, các nút `[Phê duyệt]/[Từ chối]` (CTDT, Khoá học) vẫn hiển thị cho **chính người đó** trên cùng record. | CTDT-0001 sau khi `canbo_tw_5` click `[Gửi phê duyệt]` → state CHO_DUYET, nút `[Phê duyệt]/[Từ chối]` xuất hiện → canbo_tw_5 vẫn nhìn thấy (xem [image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png](image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png)). Cùng pattern ở Khoá học. | flow-module nói rõ Bước 3 "Log out CB NV. Đăng nhập CB PD" → ngụ ý separation of duty, nhưng không có rule explicit "FE phải ẩn nút approve cho người submit". | BA confirm rule explicit + add SRS line "FE phải hide [Phê duyệt]/[Từ chối] cho user_id == created_by của record để giữ separation of duty". |
| **OBS-KHFLOW-002** — Detail CTDT KHÔNG có nút `[+ Thêm khoá học]` để vào tab/section thêm Khoá học con như flow-module §6 Bước 1 mô tả. | Detail CTDT chỉ có form edit + 3 button `[Lưu nháp]/[Gửi phê duyệt]/[Hủy chương trình]`. KHÔNG có tab "Khoá học" hoặc nút thêm KH con. Khoá học phải tạo từ menu top-level "Khoá học" → form chọn CTDT từ dropdown. | flow-module §6 Bước 1 nói rõ: *"vào chi tiết CTDT → click [+ Thêm khoá học] trên SCR-III-02"*. UI hiện tại deviation. | BA quyết định: (a) bổ sung tab "Khoá học" trong detail CTDT với nút [+ Thêm khoá học] (theo flow), hoặc (b) cập nhật flow-module để khớp UI hiện tại (tạo từ menu top-level). |
| **OBS-KHFLOW-003** — State machine UI có thêm `Đã công khai` giữa `Đã duyệt` và `Đang diễn ra` (8 state thay 7). | Stepper UI: `Dự thảo / Chờ duyệt / Đã duyệt / Đã công khai / Đang diễn ra / Đã kết thúc / Chờ duyệt KQ / Hoàn thành`. flow-module §6 chỉ có 7 state (không có "Đã công khai"), Bước 6 nói `ĐÃ DUYỆT → ĐANG DIỄN RA`. | flow-module §6 không có bước "Công khai". | BA thống nhất: (a) update flow-module thêm bước Công khai, hoặc (b) FE/BE bỏ state Công khai (cho ĐÃ DUYỆT → ĐANG DIỄN RA trực tiếp). |
| **OBS-KHFLOW-004** — Lịch sử phê duyệt CTDT chỉ hiển thị 1 entry `GUI_DUYET` sau khi đã `PHE_DUYET`. | Sau khi lanhdao_tw_5 phê duyệt CTDT-0001 → state DA_DUYET, "Lịch sử phê duyệt" chỉ thấy entry `GUI_DUYET (CB TW 5 - 23/04/2026 17:42)`, không có entry `PHE_DUYET (lanhdao_tw_5 - 17:43)`. | SRS không quy định format audit log trong UI. | FE reload lịch sử sau action approve, hoặc BE flush log trước khi trả response detail. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design + ProForm |
| Backend (suy luận) | NestJS + PostgreSQL |
| Xác thực | JWT + OTP email |
| Test tool | Chrome DevTools MCP (primary từ 2026-04-21, single browser session, 0 crash) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho TC | Status |
|---------------|---------|-----|-------------|--------|
| canbo_tw_5 | CB_NV | TW | KHFLOW-000A, 001, 002, 005 (BLOCKED), 4A | OK |
| lanhdao_tw_5 | LANH_DAO_TW | TW | KHFLOW-000B, 003, 004B | OK |
| qtht_tw_5 | QTHT_TW | TW | KHFLOW-004C (verify role công khai) | OK |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug/observation |
|------|-------|--------------------------|
| [01-ctdt-list-9-records.png](image/01-ctdt-list-9-records.png) | List 9 CTDT đều DU_THAO trước workaround | Hiện trạng |
| [02-ctdt-detail-no-add-khoahoc.png](image/02-ctdt-detail-no-add-khoahoc.png) | Detail CTDT thiếu nút [+ Thêm khoá học] | OBS-KHFLOW-002 |
| [03-form-tao-khoa-hoc-ctdt-empty.png](image/03-form-tao-khoa-hoc-ctdt-empty.png) | Form Tạo Khoá học combobox CTDT rỗng (regression OBS-KH-001 R1) | KHFLOW-001 prereq |
| [04-ctdt-0001-cb-nv-thay-nut-pheduyet.png](image/04-ctdt-0001-cb-nv-thay-nut-pheduyet.png) | CB NV vẫn thấy nút [Phê duyệt]/[Từ chối] sau khi submit | OBS-KHFLOW-001 |
| [05-ctdt-0001-da-duyet-by-lanhdao.png](image/05-ctdt-0001-da-duyet-by-lanhdao.png) | CTDT-0001 → DA_DUYET sau khi lanhdao_tw_5 phê duyệt | KHFLOW-000B |
| [06-form-tao-khoahoc-filled.png](image/06-form-tao-khoahoc-filled.png) | Form Tạo Khoá học fill xong fixture[1], picker hiện 15/05 - 20/05 | KHFLOW-001 |
| [07-khoahoc-001-created-bug-date-uuid.png](image/07-khoahoc-001-created-bug-date-uuid.png) | Detail KH-001 lưu lệch ngày 14/05 + CTDT UUID raw | BUG-KHFLOW-001, BUG-KHFLOW-005 |
| [08-khoahoc-001-da-duyet-by-lanhdao.png](image/08-khoahoc-001-da-duyet-by-lanhdao.png) | KH-001 → DA_DUYET, có nút Công khai | KHFLOW-003 |
| [09-cbnv-cong-khai-fail.png](image/09-cbnv-cong-khai-fail.png) | CB NV click Công khai → toast "Không thể công khai" | KHFLOW-004A, BUG-KHFLOW-003 |
| [10-tab-hocvien-no-add-button.png](image/10-tab-hocvien-no-add-button.png) | Tab Học viên chỉ có Import Excel, thiếu [+ Thêm thủ công] | KHFLOW-005, BUG-KHFLOW-004 |
| [11-qtht-cong-khai-be-502.png](image/11-qtht-cong-khai-be-502.png) | QTHT click Công khai → 502 BE | KHFLOW-004C, BUG-KHFLOW-002 |

---

*Bug report generated: 2026-04-23 17:58 (UTC+7) | QA Automation via Claude Code (Chrome DevTools MCP)*
