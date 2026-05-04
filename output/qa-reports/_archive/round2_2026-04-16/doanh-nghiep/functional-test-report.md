# Functional Test Report — Module: Quản lý Doanh nghiệp

| Field | Value |
|-------|-------|
| **Module** | Quản lý Doanh nghiệp (Module 7.6) |
| **SRS Reference** | srs-fr-07-doanh-nghiep.md — FR-V.III-01, FR-V.III-02, FR-V.III-NEW-01 |
| **UC Coverage** | UC 81, UC 82, UC mới (Import Excel) |
| **Tester** | QA Automation (Claude Code) |
| **Date** | 2026-04-17 |
| **Environment** | http://103.172.236.130:3000/ (Vite Dev Server → API :3001) |
| **OTP Bypass** | http://103.172.236.130:8025 (MailHog) |
| **Test Method** | API-based functional testing |
| **Primary Account** | canbo_tw / Test@1234 (Cán bộ TW, cấp DP) |
| **Round** | Round 2 |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 18 |
| **Passed** | 11 |
| **Failed** | 5 |
| **Blocked** | 0 |
| **Partial** | 2 |
| **Pass Rate** | 61.1% |
| **P0 Pass Rate** | 80% (4/5 P0 passed — DN-007 FAIL) |
| **Bugs Found** | 7 (2 Critical, 2 Major, 1 Medium, 1 Minor, 1 Info) |
| **Health Score** | 50/100 |

### Verdict: **FAIL** — 2 Critical authorization/guard bugs + major data filtering bug must be fixed before release.

---

## 2. Test Results Summary

| TC ID | Test Case | Priority | Type | Result | Bug ID | Nguyên nhân / Ghi chú |
|-------|-----------|----------|------|--------|--------|------------------------|
| DN-001 | Xem danh sách DN → phân trang, lọc | P0 | Happy | **PASS** | — | API `GET /doanh-nghieps` trả về đầy đủ 5/5 items, pageSize=20 đúng BR-DATA-07, columns match SCR-V.III-01 |
| DN-002 | Tìm kiếm DN theo tên, MST, quy mô | P0 | Happy | **PASS** | — | Search by name/MST, filter `quyMo`, combined AND filter đều hoạt động đúng |
| DN-003 | Thêm DN mới → dữ liệu hợp lệ, auto-gen mã | P0 | Happy | **PASS** | — | Tạo DN thành công, mã DN auto-gen đúng format `DN-HGI-0006` |
| DN-004 | Thêm DN → MST trùng → lỗi unique | P0 | Negative | **PASS** | — | Trả lỗi ERR-VAL-VIIIA-81-02 "Mã số thuế đã tồn tại trong hệ thống" đúng SRS |
| DN-005 | Sửa thông tin DN | P0 | Happy | **PASS** | — | PATCH cập nhật thành công các field: tenDoanhNghiep, diaChi, email |
| DN-006 | Xóa DN → soft delete | P1 | Happy | **FAIL** | BUG-DN-002 | **Lý do FAIL:** Delete API trả HTTP 204 và set `isDeleted=true` đúng, NHƯNG query list/search không filter `isDeleted=false` → DN đã xóa vẫn xuất hiện trong danh sách |
| DN-007 | Xóa DN có VV đang xử lý → bị chặn | P0 | Guard | **FAIL** | BUG-DN-006 | **Lý do FAIL:** Đã tạo VV `VV-BTP-TW-20260417-001` (trạng thái `DA_TIEP_NHAN`) liên kết DN-HGI-0006, sau đó DELETE DN vẫn trả HTTP 204 thành công. Guard logic "không xóa DN có VV đang xử lý" (SRS §2 Xóa mềm, bước 1) chưa implement |
| DN-008 | Xem lịch sử hỗ trợ DN | P1 | Happy | **FAIL** | BUG-DN-007 | **Lý do FAIL:** (1) API detail không kèm danh sách VV liên kết; (2) Counter `tongSoVuViec` KHÔNG tăng sau khi tạo VV cho DN (vẫn =0 dù đã có 1 VV DA_TIEP_NHAN). Counter không được cập nhật real-time |
| DN-009 | Phân loại quy mô DN: siêu nhỏ/nhỏ/vừa (NĐ39/2018) | P1 | Validation | **FAIL** | BUG-DN-003 | **Lý do FAIL:** Hệ thống chấp nhận `quyMo=VUA` cho DN có `soLaoDong=5, doanhThu=1 tỷ` (thực tế là Siêu nhỏ) mà không cảnh báo WRN-DN-01. BR-CALC-05 chưa implement |
| DN-010 | Import DN từ Excel → file hợp lệ | P1 | Happy | **FAIL** | BUG-DN-004 | **Lý do FAIL:** Validate trả về validRows OK, nhưng Confirm insert fail 100% với lỗi DB `null value in column loai_dn_id`. Validate không resolve text `loaiDoanhNghiep` → UUID `loaiDnId` |
| DN-011 | Import DN từ Excel → file lỗi format → preview lỗi | P1 | Negative | **PASS** | — | Validate phát hiện đúng: "Tên DN bắt buộc", "MST không hợp lệ", "Địa chỉ bắt buộc" cho rows thiếu dữ liệu |
| DN-012 | Import DN từ Excel → MST trùng → cảnh báo | P2 | Negative | **PASS** | — | Validate phát hiện đúng duplicate MST, trả về `duplicateRows` kèm `existingId` |
| DN-013 | Xuất Excel danh sách DN | P2 | Happy | **PASS** | — | Export trả file Excel 2007+ hợp lệ (7,544 bytes, HTTP 200) |
| DN-014 | QTHT xem DN (R) nhưng KHÔNG tạo/sửa/xóa | P1 | Authorization | **FAIL** | BUG-DN-001 | **Lý do FAIL:** Backend thiếu authorization guard cho role QTHT. QTHT thực hiện được cả POST (tạo), PATCH (sửa), DELETE (xóa) thay vì chỉ GET (đọc). Lỗ hổng phân quyền **Critical** |
| DN-015 | CB_PD xem DN (R*) nhưng KHÔNG tạo/sửa/xóa | P1 | Authorization | **PASS** | — | lanhdao_tw chỉ đọc được, bị chặn Forbidden khi POST/PATCH/DELETE — đúng permission matrix |
| DN-016 | DN tự cập nhật hồ sơ DN qua API (RU*) | P1 | Authorization | **PARTIAL** | BUG-DN-005 | **Lý do PARTIAL:** Phần "chặn list" đúng (Forbidden), nhưng KHÔNG tìm thấy endpoint self-service nào cho DN cập nhật hồ sơ của mình. Các URL thử nghiệm (`/me`, `/profile`, `/ho-so`) đều 403. Tính năng RU* chưa implement |
| DN-017 | DN KHÔNG xóa được DN (chỉ RU*, không D) | P1 | Authorization | **PASS** | — | dn_user bị Forbidden khi gọi DELETE — đúng permission matrix |
| DN-018 | NHT/TVV/CG không thấy menu Doanh nghiệp (❌) | P1 | Authorization | **PASS** | — | Cả 3 role NHT, TVV, CG đều bị Forbidden khi gọi API DN. UI menu visibility cần verify thêm qua browser (API-level OK) |

---

## 3. Bug Report

### BUG-DN-001 — [Critical] QTHT có thể tạo/sửa/xóa Doanh nghiệp (thiếu phân quyền backend)

| Field | Detail |
|-------|--------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DN-014 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Role QTHT (Quản trị hệ thống) chỉ được phép xem (Read) entity DOANH_NGHIEP theo permission matrix. Tuy nhiên, khi gọi API trực tiếp, QTHT có thể thực hiện cả CREATE, UPDATE và DELETE trên Doanh nghiệp.

**Steps to Reproduce:**
1. Đăng nhập với tài khoản `qtht_tw` / `Test@1234`
2. Gọi API `POST /api/v1/doanh-nghieps` với body hợp lệ
3. Kết quả: API trả về `success: true`, DN được tạo thành công
4. Gọi API `PATCH /api/v1/doanh-nghieps/{id}` → thành công
5. Gọi API `DELETE /api/v1/doanh-nghieps/{id}` → HTTP 204 (thành công)

**Expected Result:**
API phải trả về HTTP 403 (Forbidden) cho tất cả các thao tác CUD (Create/Update/Delete) từ role QTHT.

**Actual Result:**
Tất cả thao tác CUD đều thành công (HTTP 200/201/204).

**Impact:**
Lỗ hổng phân quyền nghiêm trọng. QTHT có thể thay đổi dữ liệu Doanh nghiệp mà không có quyền.

**Root Cause (Suggested):**
Backend middleware/guard cho endpoint `/doanh-nghieps` không kiểm tra quyền CUD cho role QTHT. Chỉ CB_PD (Lãnh đạo) bị chặn đúng, QTHT thì không.

---

### BUG-DN-002 — [Major] Doanh nghiệp đã xóa mềm vẫn hiển thị trong danh sách

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | DN-006 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Sau khi xóa DN (soft delete, API trả về HTTP 204), bản ghi được đánh dấu `isDeleted: true` và `deletedAt` có giá trị. Tuy nhiên, DN vẫn xuất hiện trong kết quả tìm kiếm và danh sách.

**Steps to Reproduce:**
1. Đăng nhập `canbo_tw` → Tạo DN mới (MST: 8888800001)
2. Gọi `DELETE /api/v1/doanh-nghieps/{id}` → HTTP 204
3. Gọi `GET /api/v1/doanh-nghieps?search=8888800001`
4. Kết quả: DN vẫn xuất hiện với `isDeleted: true`

**Expected Result:**
DN đã xóa mềm KHÔNG được hiển thị trong danh sách / tìm kiếm. API list phải filter `isDeleted = false`.

**Actual Result:**
DN với `isDeleted: true` vẫn trả về trong API list/search.

**Evidence:**
```json
{
  "tenDoanhNghiep": "QA DN Xóa Test",
  "isDeleted": true,
  "deletedAt": "2026-04-16T18:23:57.239Z",
  "deletedBy": "11111111-0001-4000-8000-000000000003"
}
```

**Impact:**
Người dùng vẫn thấy DN đã xóa trong danh sách, gây nhầm lẫn. Vi phạm BR-DATA-01 (Soft delete).

**Root Cause (Suggested):**
Query lấy danh sách DN thiếu điều kiện `WHERE is_deleted = false`.

---

### BUG-DN-003 — [Major] Hệ thống chấp nhận quy mô DN không khớp với số liệu lao động/doanh thu

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | DN-009 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Theo SRS (BR-CALC-05, NĐ39/2018), khi thêm DN mới, hệ thống phải kiểm tra quy mô phù hợp với số lao động và doanh thu. Nếu không khớp, hiển thị cảnh báo (WRN-DN-01). Hiện tại, hệ thống cho phép lưu quy mô VUA cho DN chỉ có 5 lao động mà không có cảnh báo.

**Steps to Reproduce:**
1. Đăng nhập `canbo_tw`
2. Gọi `POST /api/v1/doanh-nghieps` với:
   - `quyMo: "VUA"` (Vừa = tối đa 200 lao động)
   - `soLaoDong: 5` (thực tế là Siêu nhỏ, ≤ 10)
   - `doanhThu: 1000000000` (1 tỷ VND, cũng Siêu nhỏ)
3. Kết quả: API trả về `success: true`, quyMo = "VUA" được lưu

**Expected Result:**
Hệ thống phải trả về cảnh báo: "Quy mô VUA không khớp với số liệu lao động/doanh thu. Vẫn lưu?" (WRN-DN-01) hoặc tự động gợi ý quy mô phù hợp.

**Actual Result:**
Không có cảnh báo. Dữ liệu được lưu nguyên.

**Impact:**
Dữ liệu phân loại quy mô DN không chính xác, ảnh hưởng đến thống kê và báo cáo HTPL.

**SRS Reference:**
- BR-CALC-05: Kiểm tra quy mô DNNVV theo NĐ39/2018/NĐ-CP
- Error E3: WRN-DN-01 — "Quy mô {X} không khớp với số liệu lao động/doanh thu. Vẫn lưu?"

---

### BUG-DN-004 — [Medium] Import DN: Validate thành công nhưng Confirm thất bại (loai_dn_id null)

| Field | Detail |
|-------|--------|
| **Severity** | Medium |
| **Priority** | P1 |
| **TC Reference** | DN-010 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Khi import DN từ Excel, bước Validate (preview) trả về kết quả thành công (validRows > 0). Nhưng khi Confirm (thực hiện import), tất cả dòng đều lỗi với thông báo: `null value in column "loai_dn_id"`.

**Steps to Reproduce:**
1. Gọi `POST /api/v1/doanh-nghieps/import/validate` với rows hợp lệ gồm field `loaiDoanhNghiep: "Doanh nghiệp tư nhân"`
2. API validate trả về `totalRows: 1, validRows: 1, errorRows: 0` → thành công
3. Gọi `POST /api/v1/doanh-nghieps/import/confirm` với validRows từ bước 2
4. API confirm trả về `totalInserted: 0, totalErrors: 1`
5. Error: `null value in column "loai_dn_id" of relation "DOANH_NGHIEP" violates not-null constraint`

**Expected Result:**
Validate phải resolve `loaiDoanhNghiep` (text) thành `loaiDnId` (UUID FK) trước khi đánh dấu row là valid. Hoặc Confirm phải tự thực hiện mapping.

**Actual Result:**
Validate không resolve text → UUID. Confirm cố gắng insert với `loai_dn_id = null` → lỗi DB constraint.

**Impact:**
Chức năng Import DN hoàn toàn không hoạt động (0% success rate). Đây là tính năng Essential theo SRS.

---

### BUG-DN-005 — [Minor] DN (Doanh nghiệp) không có endpoint tự cập nhật hồ sơ

| Field | Detail |
|-------|--------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | DN-016 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Theo SRS, role DN có quyền RU* (Read, Update bản ghi của mình) trên entity DOANH_NGHIEP. Tuy nhiên, không tìm thấy endpoint self-service nào cho DN cập nhật hồ sơ. Các endpoint thử nghiệm (`/doanh-nghieps/me`, `/doanh-nghieps/profile`, `/doanh-nghieps/ho-so`) đều trả về 403.

**Expected Result:**
DN có thể truy cập và cập nhật hồ sơ DN của mình qua API (endpoint self-service).

**Actual Result:**
Không có endpoint self-service. DN bị Forbidden trên tất cả các endpoint DN.

**Impact:**
Nhẹ vì SRS ghi chú DN là "API only" và tính năng này có thể nằm trong phạm vi phát triển sau.

---

### BUG-DN-006 — [Critical] Cho phép xóa DN có vụ việc đang xử lý (guard logic thiếu)

| Field | Detail |
|-------|--------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | DN-007 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Theo SRS `srs-fr-07-doanh-nghiep.md` §2 (Processing > Xóa mềm), bước 1: "Kiểm tra DN không có vụ việc đang xử lý". Nếu DN có VV đang xử lý → phải trả error `ERR-DN-03` "Không thể xóa DN đang có vụ việc xử lý". Guard logic này chưa implement — DN bị xóa bình thường.

**Steps to Reproduce:**
1. Login `canbo_tw` / `Test@1234`
2. Tạo VV liên kết DN-HGI-0006 qua `POST /api/v1/vu-viecs/manual` (trangThai: `DA_TIEP_NHAN`)
3. `DELETE /api/v1/doanh-nghieps/6efe3b32-556a-40de-a58a-568fbb094e2a`
4. Kết quả: HTTP 204, DN bị xóa mềm thành công

**Expected Result:**
HTTP 4xx + `{"error":{"code":"ERR-DN-03","message":"Không thể xóa DN đang có vụ việc xử lý"}}`

**Actual Result:**
HTTP 204 — DN bị xóa. VV vẫn tồn tại nhưng mất liên kết DN cha.

**Impact:**
- Vi phạm referential integrity: VV "orphan" sau khi DN bị xóa
- Vi phạm SRS requirement + BR-DATA rule
- Mất lịch sử hỗ trợ pháp lý của DN, ảnh hưởng báo cáo thống kê

**Root Cause (Suggested):**
Service `deleteDoanhNghiep` không query `VU_VIEC` trước khi soft delete. Cần thêm check `COUNT(*) FROM VU_VIEC WHERE doanh_nghiep_id = :id AND trangThai NOT IN ('HOAN_THANH','HUY','DONG')` — nếu > 0 thì reject.

---

### BUG-DN-007 — [Major] Counter tongSoVuViec + danh sách VV không cập nhật khi tạo VV mới

| Field | Detail |
|-------|--------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | DN-008 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Description:**
Sau khi tạo VV liên kết DN (POST `/vu-viecs/manual` thành công), entity DOANH_NGHIEP có 2 vấn đề:
1. Counter `tongSoVuViec` vẫn = 0 (không tăng)
2. API detail DN không trả về danh sách VV liên kết (thiếu property `vuViecs`/`lichSuHoTro`)

**Steps to Reproduce:**
1. Login `canbo_tw`
2. POST `/api/v1/vu-viecs/manual` với `doanhNghiepId` = X → tạo VV thành công
3. GET `/api/v1/doanh-nghieps/X` → response có `tongSoVuViec: 0`, không có list VV

**Expected Result:**
- `tongSoVuViec` = số VV có liên kết doanhNghiepId = X
- Response kèm `vuViecs` / `lichSuHoTro` list (hoặc có endpoint con `/doanh-nghieps/{id}/vu-viecs`)

**Actual Result:**
- `tongSoVuViec` không được tính/cập nhật
- Không có list VV trong response detail

**Impact:**
- Vi phạm SRS §2 "Xem lịch sử hỗ trợ" bước 1-3
- Tab "Lịch sử Hỗ trợ" trên UI (SCR-V.III-02) không có data để hiển thị
- 3 KPI (Tổng VV / VV hoàn thành / Tổng chi phí) không chính xác

**Root Cause (Suggested):**
- Counter cần trigger cập nhật khi VV được tạo/update/delete. Có thể dùng DB trigger hoặc event-driven update trong service layer.
- API detail cần JOIN `VU_VIEC` hoặc trả về child list.

---

## 4. Detailed Test Results

### 4.1 DN-001: Xem danh sách DN → phân trang, lọc

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /doanh-nghieps?page=1&limit=20 | Trả về danh sách DN, phân trang | Success: 5 items, meta: total=5, pageSize=20, page=1/1 | **PASS** |
| 2 | Kiểm tra default pageSize | pageSize = 20 (BR-DATA-07) | pageSize = 20 | **PASS** |
| 3 | GET ?page=2&limit=2 | Trả về page 2, tối đa 2 items | 0 items (vì total=5, page 2 limit 2 = items 3-4 which = 1 page left) | **PASS** |
| 4 | Kiểm tra columns SRS SCR-V.III-01 | maDoanhNghiep, tenDoanhNghiep, maSoThue, quyMo, diaChi, tongSoVuViec, tongChiPhiHoTro | All present and non-null | **PASS** |
| 5 | Kiểm tra format mã DN | DN-{TINH}-{SEQ} | DN-HGI-0001 ~ DN-HGI-0005 | **PASS** |

**Notes:**
- Mã DN format đúng pattern `DN-{TINH}-{SEQ}`
- Auto-increment sequence (seqId) hoạt động
- Soft-deleted records cũng hiển thị (see BUG-DN-002)

---

### 4.2 DN-002: Tìm kiếm DN theo tên, MST, quy mô

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | search=ABC | Tìm DN có tên chứa "ABC" | 1 result: TEST_DN Siêu nhỏ ABC | **PASS** |
| 2 | search=0101234561 (MST) | Tìm DN theo MST | 1 result: MST match | **PASS** |
| 3 | quyMo=VUA | Lọc theo quy mô Vừa | 1 result: TEST_DN Vừa GHI, QM=VUA | **PASS** |
| 4 | search=Test + quyMo=NHO | Kết hợp AND | 1 result: TEST_DN Nhỏ DEF, QM=NHO | **PASS** |
| 5 | search=NONEXISTENT | Không kết quả | 0 results, response graceful | **PASS** |

**Notes:**
- API hỗ trợ cả `search`, `keyword`, `tuKhoa` params (tất cả hoạt động)
- Tìm kiếm fulltext trên tên DN và MST
- Filter combination (AND logic) hoạt động chính xác

---

### 4.3 DN-003: Thêm DN mới → dữ liệu hợp lệ

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /doanh-nghieps (đủ trường bắt buộc) | Tạo DN mới | Success, ID returned | **PASS** |
| 2 | Kiểm tra auto-gen mã DN | Format DN-{TINH}-{SEQ} | DN-HGI-0006 (auto-increment) | **PASS** |
| 3 | Kiểm tra required fields | tinhThanhId bắt buộc | Validated correctly (ERR khi thiếu) | **PASS** |

**Notes:**
- `tinhThanhId` là required field nhưng SRS không nêu rõ (phát hiện qua testing)
- Auto-gen mã DN hoạt động đúng: DN-HGI-{SEQ} với sequence tự tăng

---

### 4.4 DN-004: Thêm DN → MST trùng → lỗi unique

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /doanh-nghieps với MST đã tồn tại | Báo lỗi "Mã số thuế đã tồn tại" | Error code: ERR-VAL-VIIIA-81-02, Message: "Mã số thuế đã tồn tại trong hệ thống" | **PASS** |

**Notes:**
- Error message tiếng Việt rõ ràng, đúng SRS (ERR-DN-02)
- Unique constraint kiểm tra ở application layer (không chờ DB constraint)

---

### 4.5 DN-005: Sửa thông tin DN

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | PATCH /doanh-nghieps/{id} với tenDoanhNghiep, diaChi, email mới | Cập nhật thành công | Success: all fields updated | **PASS** |
| 2 | Kiểm tra giá trị đã cập nhật | Giá trị mới được phản ánh | tenDoanhNghiep, diaChi, email đều đúng | **PASS** |

---

### 4.6 DN-006: Xóa DN → soft delete — **FAIL**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | DELETE /doanh-nghieps/{id} | HTTP 204, soft delete | HTTP 204, isDeleted=true, deletedAt set | **PASS** |
| 2 | Search deleted DN | Không xuất hiện trong list | DN vẫn xuất hiện (isDeleted=true visible) | **FAIL** |
| 3 | Direct access deleted DN | Trả về lỗi hoặc mark deleted | "Doanh nghiệp không tồn tại" (GET by ID blocked) | **PASS** |

**Bug:** BUG-DN-002 — List API không filter `isDeleted = false`

---

### 4.7 DN-007: Xóa DN có VV đang xử lý → bị chặn — **FAIL**

**Pre-conditions:**
- User canbo_tw đã login
- DN `DN-HGI-0006` (id: `6efe3b32-556a-40de-a58a-568fbb094e2a`) đang tồn tại, chưa bị xóa

**Test Data — VV tạo mới cho test:**
```json
{
  "doanhNghiepId": "6efe3b32-556a-40de-a58a-568fbb094e2a",
  "tieuDe": "QA Test VV cho DN-007 - Vụ việc test xóa DN",
  "moTa": "Vụ việc tạo tự động bởi QA để test guard logic DN-007",
  "linhVucId": "3b3e0735-a79b-4914-b05e-c94cd4fb484e",
  "loaiHinhHtId": "6331c54d-b4f2-4aca-9294-bee0c789810e",
  "kenhTiepNhan": "TRUC_TIEP"
}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST `/api/v1/vu-viecs/manual` tạo VV liên kết DN | VV tạo thành công, trạng thái initial | ✅ VV ID=`b48b4f22-...`, maVV=`VV-BTP-TW-20260417-001`, trangThai=`DA_TIEP_NHAN` | **PASS** |
| 2 | GET `/api/v1/doanh-nghieps/{id}` verify counter | `tongSoVuViec` tăng lên 1 | ❌ `tongSoVuViec` = 0 (counter không cập nhật) | **FAIL** |
| 3 | DELETE `/api/v1/doanh-nghieps/{id}` | HTTP 4xx + error "Không thể xóa DN đang có vụ việc xử lý" (ERR-DN-03) | ❌ HTTP 204 — DN bị xóa thành công | **FAIL** |
| 4 | Search DN sau delete | DN đã bị xóa | `isDeleted=true, deletedAt` có giá trị | PASS |

**Notes:**
- Đã tạo VV ở trạng thái `DA_TIEP_NHAN` (đã tiếp nhận, đang xử lý) — đây là state active theo SM-VUVIEC
- Guard logic SRS §2 (Xóa mềm) bước 1 "Kiểm tra DN không có vụ việc đang xử lý" → **chưa implement** ở backend
- Dẫn đến 2 bug: **BUG-DN-006** (guard thiếu) + **BUG-DN-007** (counter không sync)

---

### 4.8 DN-008: Xem lịch sử hỗ trợ DN — **FAIL**

**Pre-conditions:**
- User canbo_tw đã login
- DN có ít nhất 1 VV liên kết (đã tạo ở DN-007: VV-BTP-TW-20260417-001)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET `/api/v1/doanh-nghieps/{id}` | Response có `tongSoVuViec > 0`, `tongChiPhiHoTro` chính xác | `tongSoVuViec=0, tongChiPhiHoTro=0` (dù VV đã tồn tại) | **FAIL** |
| 2 | Kiểm tra danh sách VV liên kết trong response | Có property `vuViecs` / `danhSachVuViec` / `lichSuHoTro` | Không có property nào chứa list VV | **FAIL** |

**Notes:**
- Sau khi tạo VV liên kết DN qua POST `/vu-viecs/manual`, counter `tongSoVuViec` trên entity DOANH_NGHIEP **không được cập nhật** (vẫn = 0)
- API detail DN không trả về danh sách VV liên kết — có thể nằm ở endpoint riêng (chưa discover được)
- Vi phạm SRS §2 Processing "Xem lịch sử hỗ trợ" bước 1-3 (lấy VU_VIEC + tính tổng + hiển thị)
- Bug: **BUG-DN-007** — counter counter + missing VV list in detail

---

### 4.9 DN-009: Phân loại quy mô DN — **FAIL**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Check valid quyMo values | SIEU_NHO, NHO, VUA | All 3 values present in data | **PASS** |
| 2 | Create DN: quyMo=VUA, soLaoDong=5, doanhThu=1 tỷ | Cảnh báo WRN-DN-01 | Lưu thành công, không cảnh báo | **FAIL** |

**Bug:** BUG-DN-003 — BR-CALC-05 chưa được implement

---

### 4.10 DN-010: Import DN từ Excel → file hợp lệ — **FAIL**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /import/validate với rows hợp lệ | validRows > 0 | totalRows=2, validRows=2 | **PASS** |
| 2 | POST /import/confirm với validRows | totalInserted > 0 | totalInserted=0, totalErrors=2 | **FAIL** |
| 3 | Error message | — | "null value in column loai_dn_id" | **FAIL** |

**Bug:** BUG-DN-004 — loaiDoanhNghiep text → loaiDnId UUID mapping missing

---

### 4.11 DN-011: Import DN → file lỗi format

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Validate với rows thiếu required fields | Detect errors | errorRows=2, messages: "Tên DN bắt buộc", "MST không hợp lệ", "Địa chỉ bắt buộc" | **PASS** |

---

### 4.12 DN-012: Import DN → MST trùng trong file

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Validate với MST đã tồn tại (0101234561) | Detect duplicate | duplicateRows=1, existingId returned | **PASS** |

---

### 4.13 DN-013: Xuất Excel danh sách DN

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /doanh-nghieps/export | File Excel valid | HTTP 200, file 7,544 bytes, format "Microsoft Excel 2007+" | **PASS** |

---

### 4.14 DN-014: QTHT xem DN nhưng KHÔNG tạo/sửa/xóa — **FAIL**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | QTHT GET list | Có quyền Read | Success: 8 items | **PASS** |
| 2 | QTHT POST create | Forbidden | Success: DN created! | **FAIL** |
| 3 | QTHT PATCH update | Forbidden | Success: DN updated! | **FAIL** |
| 4 | QTHT DELETE | Forbidden | HTTP 204 (deleted!) | **FAIL** |

**Bug:** BUG-DN-001 (Critical) — QTHT có full CRUD thay vì chỉ Read

---

### 4.15 DN-015: CB_PD xem DN nhưng KHÔNG tạo/sửa/xóa

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | CB_PD (lanhdao_tw) GET list | Có quyền Read | Success: 9 items | **PASS** |
| 2 | CB_PD POST create | Forbidden | Forbidden | **PASS** |

**Notes:** CB_PD authorization hoạt động đúng.

---

### 4.16 DN-016: DN tự cập nhật hồ sơ qua API — **PARTIAL**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | DN GET /doanh-nghieps list | Forbidden (chỉ RU* trên bản ghi của mình) | Forbidden | **PASS** |
| 2 | DN GET /doanh-nghieps/me | Xem hồ sơ của mình | 403 Forbidden | **PARTIAL** |
| 3 | DN GET /doanh-nghieps/profile | Xem hồ sơ của mình | 403 Forbidden | **PARTIAL** |

**Bug:** BUG-DN-005 — Chưa có endpoint self-service cho DN

---

### 4.17 DN-017: DN KHÔNG xóa được DN

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | DN DELETE /doanh-nghieps/{id} | Forbidden | Forbidden | **PASS** |

---

### 4.18 DN-018: NHT/TVV/CG không thấy menu Doanh nghiệp

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | NHT GET /doanh-nghieps | Forbidden | Forbidden | **PASS** |
| 2 | TVV GET /doanh-nghieps | Forbidden | Forbidden | **PASS** |
| 3 | CG GET /doanh-nghieps | Forbidden | Forbidden | **PASS** |

**Notes:** UI menu visibility cần test riêng qua browser. API-level authorization đúng.

---

## 5. Test Data Used

| Account | Role | Purpose |
|---------|------|---------|
| canbo_tw | CB_TW (Cán bộ TW) | Primary CRUD testing |
| qtht_tw | QTHT_TW | Authorization: read-only test |
| lanhdao_tw | LANH_DAO_TW (CB_PD) | Authorization: read-only test |
| dn_user | DOANH_NGHIEP | Authorization: self-service test |
| nht_user | NHT | Authorization: no-access test |
| tvv_user | TVV | Authorization: no-access test |
| chuyengia_user | CG | Authorization: no-access test |

### Test DN Created During Testing

| Mã DN | Tên | MST | Purpose | Cleanup? |
|-------|-----|-----|---------|----------|
| DN-HGI-0006 | QA Test DN Mới 001 - Updated | 9999900001 | DN-003/005/007 test | Soft-deleted after DN-007 (BUG-DN-006 evidence) |
| DN-HGI-0007 | QA Test QuyMo Mismatch | 9999900099 | DN-009 bug evidence | Soft-deleted |
| DN-HGI-0008 | QA DN Xóa Test | 8888800001 | DN-006 test | Soft-deleted (visible in list!) |
| DN-HGI-0009 | QTHT Should Not Create | 6666600001 | DN-014 bug evidence | Should not exist |

### Test VV Created During Testing

| Mã VV | Trạng thái | DN link | Purpose | Cleanup? |
|-------|-----------|---------|---------|----------|
| VV-BTP-TW-20260417-001 | DA_TIEP_NHAN | DN-HGI-0006 | DN-007 guard logic test | Orphan sau khi DN-HGI-0006 bị xóa |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/doanh-nghieps` (plural, with 's')
- **Token TTL:** Rất ngắn (~60-90 giây). Token bị revoke giữa chừng test nhiều lần, phải re-auth liên tục.
- **Auth flow:** 2-factor (password + OTP email via MailHog)
- **Browse tool:** Không hoạt động (exit code 137 — SIGKILL). Tất cả tests thực hiện qua API.
- **Frontend framework:** React + Vite + Ant Design + @casl/ability (RBAC client-side)
- **Backend:** NestJS (dựa trên error response format)
- **Vite proxy:** `/api` → `http://localhost:3001`
- **CASL Authorization:** Client-side guards hoạt động (DoanhNghiepGuard component), nhưng backend API guards thiếu cho role QTHT

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-DN-001 (Critical):** Thêm backend authorization guard cho role QTHT trên endpoint `/doanh-nghieps`. QTHT chỉ được phép GET (Read).

2. **BUG-DN-006 (Critical):** Implement guard logic khi xóa DN — query `VU_VIEC` và reject nếu có VV với `trangThai NOT IN ('HOAN_THANH','HUY','DONG')`. Trả về `ERR-DN-03` theo SRS.

3. **BUG-DN-002 (Major):** Thêm filter `WHERE is_deleted = false` (hoặc tương đương ORM) vào query lấy danh sách DN. Kiểm tra tương tự cho tất cả các module khác.

4. **BUG-DN-003 (Major):** Implement BR-CALC-05 — validate quyMo vs soLaoDong/doanhThu khi tạo/sửa DN. Trả về warning nếu không khớp.

5. **BUG-DN-007 (Major):** Fix counter `tongSoVuViec` + thêm list VV vào detail API DN. Có thể dùng DB trigger hoặc event-driven update.

### Should Fix

6. **BUG-DN-004 (Medium):** Fix import flow — Validate phải resolve `loaiDoanhNghiep` text → `loaiDnId` UUID trước khi pass cho Confirm.

7. **BUG-DN-005 (Minor):** Implement self-service endpoint cho role DN (ví dụ: `/api/v1/doanh-nghieps/me`) để DN có thể xem/cập nhật hồ sơ của mình.

### Additional Recommendations

8. **Token TTL:** Tăng TTL của access token (hiện tại quá ngắn, gây UX kém cho người dùng thực tế).

9. **Referential integrity:** VV-BTP-TW-20260417-001 hiện đã thành "orphan" (DN cha bị xóa). Cần review data migration strategy cho existing orphan records.

10. **UI testing:** Cần verify tabs (Lịch sử Hỗ trợ, Hồ sơ Chi trả) qua browser testing khi browse tool hoạt động trở lại.

---

## 8. Appendix — API Endpoints Tested

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/doanh-nghieps` | List/Search DN |
| GET | `/api/v1/doanh-nghieps/{id}` | DN detail |
| POST | `/api/v1/doanh-nghieps` | Create DN |
| PATCH | `/api/v1/doanh-nghieps/{id}` | Update DN |
| DELETE | `/api/v1/doanh-nghieps/{id}` | Soft delete DN |
| POST | `/api/v1/doanh-nghieps/export` | Export Excel |
| POST | `/api/v1/doanh-nghieps/import/validate` | Import validate |
| POST | `/api/v1/doanh-nghieps/import/confirm` | Import confirm |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/verify-otp` | OTP verify |
| GET | `/api/v1/auth/me` | Current user info |

---

*Report generated: 2026-04-17 | QA Automation via Claude Code*
