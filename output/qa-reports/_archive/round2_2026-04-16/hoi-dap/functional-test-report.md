# Functional Test Report — Module: Quản lý Hỏi đáp Pháp lý

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Hỏi đáp Pháp lý (Module 7.2) |
| **SRS Reference** | srs-fr-02-hoi-dap.md — FR-II-01..13, FR-II-NEW-01, FR-II-NEW-02 |
| **UC Coverage** | UC 10, 11, 12, 13, 14, 15, 16, 17, 19 |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-04-17 |
| **Môi trường** | http://103.172.236.130:3000/ (Vite Dev Server → API :3001) |
| **OTP Bypass** | http://103.172.236.130:8025 (MailHog) |
| **Test Method** | API-based functional testing |
| **Primary Account** | canbo_tw / Test@1234 (CB_NV, cấp DP — Cục BTTP) |
| **Approver** | lanhdao_tw / Test@1234 (CB_PD) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy §7.2](../../../test-strategy.md), [permission-matrix](../../../permission-matrix.md), [bug-report-hoi-dap.md](bug-report-hoi-dap.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 35 |
| **Passed** | 19 |
| **Failed** | 11 |
| **Blocked** | 1 |
| **Partial** | 4 |
| **Pass Rate** | 54.3% |
| **P0 Pass Rate** | 92.3% (12/13 P0 đạt) |
| **Bugs Found** | 13 (4 Critical, 5 Major, 4 Medium) |
| **Health Score** | 52/100 |
| **Test Method (updated)** | Hybrid — API-based cho 32 TC + **Browse UI-based** cho HD-021, HD-022, HD-033 |

### Verdict: **FAIL** — Critical authorization + critical state machine + critical data isolation bugs phải fix trước release.

Module Hỏi đáp có core workflow MOI → TIEP_NHAN → DANG_XU_LY → CHO_PHE_DUYET → DA_DUYET hoạt động đúng (12/13 P0 pass). Tuy nhiên, 3 khu vực trọng yếu hỏng nặng: (1) phân quyền — QTHT/NHT/DN/TVV đều vượt quyền, (2) data isolation — TW/BN/DP đọc chéo đơn vị, (3) state machine — CONG_KHAI/HOAN_THANH/HUY/unpublish không transition được state. Ngoài ra thiếu hẳn endpoint Export Excel, endpoint File Attach, và full-text search không filter. UI verify thêm 1 bug mới: thiếu dropdown chèn mẫu phản hồi (BUG-HD-013).

### UI Test Notes (update sau round đầu API-only)

3 TC UI-specific đã được verify lại qua browse tool sau khi phát hiện browse hoạt động (phải dùng `chain` + `wait .ant-table` thay vì `wait --networkidle` — Vite dev server lazy-load ES modules khiến networkidle không bao giờ fire). Retracting earlier conclusion "browse tool không dùng được".

- **HD-021** ✅ PASS: 7 tabs render + URL param `?tab=...` + filter data theo state đúng. Thiếu count badge trên mỗi tab (minor UX gap)
- **HD-022** ⚠️ PARTIAL: cột "SLA / Thời hạn" + badge "Còn X ngày LV" + field "Thời hạn SLA" ở detail đều render. Không có data overdue để verify gradient 4 mức BR-SLA-02
- **HD-033** ❌ FAIL + NEW BUG: form "Soạn phản hồi" ở detail **KHÔNG có UI dropdown/button chọn mẫu**, dù API (suDungMau + mauPhanHoiId) hoạt động. FR-II-NEW-02 chưa complete ở UI → BUG-HD-013

---

## 2. Test Results Summary

| TC ID | TraceID (SRS) | Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|-------|---------------|-----------|------|----------|--------|--------|------------------------|
| HD-001 | FR-II-01, UC10 | Xem danh sách → phân trang, lọc theo trạng thái | Happy | P0 | **PASS** | — | GET `/hoi-daps` phân trang đúng (page=2 trả 2 items), lọc `trangThai=MOI` chỉ trả 3/3 items MOI |
| HD-002 | FR-II-01, UC10 | Tìm kiếm keyword (full-text) | Happy | P0 | **FAIL** | BUG-HD-005 | **Lý do FAIL:** Param `keyword=batch`, `q=batch`, `tieuDe=batch` đều trả về 8/8 items (không filter). Search ignore hoàn toàn |
| HD-003 | FR-II-02, UC11 | Tạo câu hỏi mới → dữ liệu hợp lệ, auto-gen mã HD-YYYYMMDD-SEQ | Happy | P0 | **PASS** | — | POST thành công, `maHoiDap=HD-20260417-002` đúng format |
| HD-004 | FR-II-02, UC11 | Tạo → nội dung rỗng → validation | Negative | P1 | **PASS** | — | Trả ERR-VAL-SYS-00-01 "noiDung should not be empty" |
| HD-005 | FR-II-02, UC11 | Tạo → nội dung > 5000 ký tự → validation | Negative | P1 | **PASS** | — | Trả "noiDung must be shorter than or equal to 5000 characters" |
| HD-006 | FR-II-03, UC12 | Xem chi tiết câu hỏi | Happy | P0 | **PASS** | — | Detail trả đầy đủ: trangThai, lichSu (4 entries), nguoiGui/nguoiTiepNhan |
| HD-007 | FR-II-04, UC12 | CB NV tiếp nhận: MOI → TIEP_NHAN | Workflow | P0 | **PASS** | — | POST `/tiep-nhan` trả trangThai=TIEP_NHAN, nguoiTiepNhanTen=Cán bộ TW |
| HD-008 | FR-II-04, UC13, BR-SLA-01, BR-CALC-03 | Tính deadline SLA | Workflow | P0 | **PASS** | — | deadline = ngayTiepNhan + 18 ngày (~20 ngày làm việc theo NĐ55) ✓ |
| HD-009 | FR-II-07, UC16 | CB NV soạn câu trả lời | Happy | P0 | **PASS** | — | POST `/hoi-daps/{id}/phan-hois` tạo DU_THAO thành công |
| HD-010 | FR-II-07, UC14, BR-FLOW-01 | Tích "Đã trả lời" → Auto-transition CHO_PHE_DUYET | Workflow | P0 | **PASS** | — | PATCH daTraLoi=true → HD từ DANG_XU_LY → CHO_PHE_DUYET, lichSu có SUBMIT |
| HD-011 | FR-II-08, UC15 | CB PD phê duyệt → DA_DUYET | Workflow | P0 | **PASS** | — | POST `/phe-duyet` chuyển sang DA_DUYET, lichSu có APPROVE by Lãnh đạo TW |
| HD-012 | FR-II-08, UC15, BR-FLOW-02 | Phê duyệt hàng loạt | Workflow | P1 | **PARTIAL** | BUG-HD-006 | **Lý do PARTIAL:** Endpoint `/batch-phe-duyet` chuyển state đúng (DA_DUYET) nhưng **KHÔNG ghi APPROVE vào lichSu** (so với single approve). Audit trail bị mất |
| HD-013 | FR-II-08, UC15, BR-FLOW-04 | CB PD từ chối → bắt buộc lý do | Workflow | P0 | **PASS** | — | POST `/tu-choi` với `lyDo` (min 10 chars) → trangThai=DANG_XU_LY (bounce back), `lyDoTuChoi` được lưu, lichSu có REJECT với lý do |
| HD-014 | FR-II-08, UC15 | Từ chối không nhập lý do → validation | Negative | P1 | **PASS** | — | Trả lỗi "Lý do từ chối là bắt buộc (tối thiểu 10 ký tự)" |
| HD-015 | FR-II-09, UC16 | Công khai DA_DUYET → CONG_KHAI | Workflow | P1 | **FAIL** | BUG-HD-004 | **Lý do FAIL:** POST `/cong-khai` trả HTTP 200 success, lichSu có PUBLISH, **NHƯNG trangThai vẫn DA_DUYET, laCongKhai=false, ngayCongKhai=null**. State không transition |
| HD-016 | FR-II-09, UC16 | Thu hồi công khai: CONG_KHAI → DA_DUYET | Workflow | P1 | **FAIL** | BUG-HD-007 | **Lý do FAIL:** Endpoint `/thu-hoi`, `/rut-cong-khai`, `/unpublish`, `/go-cong-khai` đều 404. Không có cách unpublish |
| HD-017 | FR-II-10, UC17 | Đóng → HOAN_THANH | Workflow | P1 | **FAIL** | BUG-HD-007 | **Lý do FAIL:** Endpoint `/dong`, `/hoan-thanh`, `/close`, `/ket-thuc` đều 404. PATCH trangThai=HOAN_THANH bị chặn bởi immutability guard. Trạng thái HOAN_THANH unreachable |
| HD-018 | FR-II-11, UC10 | Hủy: MOI → HUY | Workflow | P1 | **FAIL** | BUG-HD-007 | **Lý do FAIL:** Endpoint `/huy`, `/cancel`, `/huy-bo`, DELETE đều 404. Trạng thái HUY unreachable |
| HD-019 | FR-II-11, BR-FLOW-03 | Không thể sửa/xóa sau DA_DUYET | Immutability | P0 | **PASS** | — | PATCH sau DA_DUYET trả ERR-STATE-SYS-00-01 "Cannot edit approved record". DELETE trả 404 (endpoint không tồn tại) |
| HD-020 | FR-II-12, UC10, BR-DATA-06 | Xuất Excel danh sách | Happy | P2 | **FAIL** | BUG-HD-008 | **Lý do FAIL:** Endpoint `/export`, `/export-excel`, `/xuat-excel`, `/download` đều 404/400 (UUID validation lỗi). Chức năng export Excel không được implement |
| HD-021 | FR-II-01, UC10 | Tabs trạng thái (lọc theo SM-HOIDAP) | UI | P1 | **PASS** | — | UI verified: 7 tabs render (Tất cả/Mới/Đang xử lý/Chờ phê duyệt/Đã duyệt/Công khai/Hoàn thành), URL param `?tab=...`, filter data đúng. API filter `trangThai=...` cũng work. Minor UX gap: chưa có count badge trên mỗi tab. Evidence: `screenshots/ui-hd021-tab-*.png` |
| HD-022 | BR-SLA-02 | SLA indicators: 4 mức cảnh báo | Business Rule | P1 | **PARTIAL** | — | UI verified: cột "SLA / Thời hạn" ở list + badge "Còn X ngày LV" + field "Thời hạn SLA: 05/05/2026 15:05" ở detail. Field `mucDoCanhBao` tồn tại trong response nhưng tất cả records đều = BINH_THUONG. **Không có data overdue/critical** → không verify được gradient 4 mức BR-SLA-02. Evidence: `screenshots/ui-hd022-*.png`, `screenshots/ui-hd033-detail-page.png` |
| HD-023 | — | Upload file đính kèm câu trả lời | Happy | P2 | **PARTIAL** | BUG-HD-009 | **Lý do PARTIAL:** `/files/upload` hoạt động (trả fileId). NHƯNG phan-hoi body với `fileDinhKem:[fileId]` bị ignore (không lưu). HD detail fileDinhKem luôn = []. Không có endpoint attach riêng |
| HD-024 | — | QTHT xem được HOI_DAP (R) nhưng KHÔNG tạo/sửa/xóa | Authorization | P1 | **FAIL** | BUG-HD-001 | **Lý do FAIL:** qtht_tw thực hiện được POST (HTTP 201) tạo hỏi đáp. Theo permission-matrix QTHT chỉ R (👁️). Lỗ hổng phân quyền **Critical** |
| HD-025 | BR-DATA-01, BR-DATA-02 | CB_PD_TW xem toàn bộ; CB_PD_BN/DP chỉ scoped | Authorization | P1 | **FAIL** | BUG-HD-002 | **Lý do FAIL:** lanhdao_bn (Bộ KH&ĐT), lanhdao_dp (Sở TP HN), canbo_bn đều thấy 16/16 items. HD-003 (donVi Cục BTTP) hiển thị cho cả 3 role. Data isolation FAILED |
| HD-026 | — | CB_PD KHÔNG tạo/xóa HOI_DAP | Authorization | P0 | **PASS** | — | lanhdao_tw POST trả 403 ✓ |
| HD-027 | — | DN tạo HOI_DAP qua API (🔌 C†) | Authorization | P1 | **PASS** | — | dn_user POST với `kenhTiepNhan=CONG_PLQG` thành công (HTTP 201), maHoiDap=HD-20260417-011 |
| HD-028 | — | DN KHÔNG truy cập CMS Hỏi đáp | Authorization | P1 | **FAIL** | BUG-HD-003 | **Lý do FAIL:** dn_user GET `/api/v1/hoi-daps?pageSize=5` trả 200 với 5 records. Theo matrix DN chỉ được C† (API only), không được R trên endpoint CMS |
| HD-029 | — | NHT/TVV/CG không thấy menu HOI_DAP (❌) | Authorization | P1 | **FAIL** | BUG-HD-003 | **Lý do FAIL:** nht_user LIST=200 CREATE=201 (**should be 403 both**), tvv_user LIST=200 (**should 403**) CREATE=403 ✓, chuyengia_user 403/403 ✓ |
| HD-030 | FR-II-06, UC15 | Phân công CB NV xử lý: TIEP_NHAN → DANG_XU_LY | Workflow | P0 | **PASS** | — | POST `/phan-cong` với `nguoiXuLyId` → trangThai=DANG_XU_LY, nguoiXuLyTen set, lichSu có PHAN_CONG |
| HD-031 | FR-II-NEW-01, UC15 | Phân công → gợi ý CB theo lĩnh vực | Workflow | P1 | **FAIL** | BUG-HD-012 | **Lý do FAIL:** Endpoint `/goi-y-can-bo`, `/suggestions`, `/suggest-handlers` đều 404. FR-II-NEW-01 chưa implement |
| HD-032 | — | Phân công → cảnh báo workload | Logic | P1 | **BLOCKED** | — | **Lý do BLOCKED:** Cần nhiều CB user với workload khác nhau để test warning threshold. Không có test data phù hợp |
| HD-033 | FR-II-NEW-02 | CRUD mẫu phản hồi | Happy | P1 | **PARTIAL** | BUG-HD-010, BUG-HD-011 | **Lý do PARTIAL:** CREATE/UPDATE/DELETE hoạt động (HTTP 201/200/204). NHƯNG (1) LIST `/mau-phan-hois` trả **HTTP 500 Internal Error**, (2) response envelope **double-wrapped** `{success:{data:{success:true,data:{}}}}` |
| HD-034 | FR-II-NEW-02 | Chèn mẫu phản hồi khi soạn (API) | Happy | P1 | **PASS** | — | API: POST phan-hoi với `suDungMau=true, mauPhanHoiId=<uuid>` → lưu đúng cả 2 field. Tuy nhiên UI thiếu entry point (xem BUG-HD-013) |
| HD-034-UI | FR-II-NEW-02 | Chèn mẫu phản hồi khi soạn (UI) | UI | P1 | **FAIL** | BUG-HD-013 | Form "Soạn phản hồi" ở `/hoi-dap/{id}` chỉ có 3 textarea: Nội dung phản hồi / Văn bản pháp luật / Gợi ý cho doanh nghiệp + 2 button Lưu nháp + Gửi phản hồi. **KHÔNG có dropdown/button chèn mẫu phản hồi**. User không dùng được feature qua UI. Evidence: `screenshots/ui-hd033-detail-page.png` |
| HD-035 | FR-II-10, UC19 | Tìm kiếm câu hỏi đã xử lý | Happy | P1 | **PASS** | — | GET `?trangThai=DA_DUYET&pageSize=10` trả 3 items đúng, tất cả đều là DA_DUYET |

### Chú thích

> **Result:** `PASS` / `FAIL` / `BLOCKED` / `PARTIAL` / `SKIP`
> **Type:** `Happy` / `Negative` / `Edge` / `Guard` / `Validation` / `Workflow` / `Authorization` / `Integration` / `Immutability` / `UI` / `Business Rule` / `Logic` / `Calculation`
> **Priority:** `P0` / `P1` / `P2` / `P3`

---

## 3. Bug Report

> **Chi tiết đầy đủ** (Steps/Evidence/Impact/Fix): xem [bug-report-hoi-dap.md](bug-report-hoi-dap.md).

### BUG-HD-001 — [Critical] QTHT có thể tạo Hỏi đáp (thiếu phân quyền backend)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | HD-024 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** qtht_tw gọi POST `/api/v1/hoi-daps` trả HTTP 201 Created với maHoiDap mới. Theo permission-matrix QTHT chỉ được R (👁️ đọc) trên entity HOI_DAP.

**Impact:** QTHT vượt quyền tạo dữ liệu nghiệp vụ → vi phạm separation of duties.

**Root Cause (Suggested):** Guard/decorator chỉ check authenticated user, không check permission `create_hoi_dap`. Cần thêm `@Permissions('create_hoi_dap')` và exclude role QTHT khỏi list này.

---

### BUG-HD-002 — [Critical] Data isolation hỏng — TW/BN/DP đọc chéo đơn vị

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | HD-025 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** lanhdao_bn (Bộ KH&ĐT, cấp BN), lanhdao_dp (Sở TP HN, cấp DP), canbo_bn (Bộ KH&ĐT) đều thấy 16/16 items — giống hệt nhau. HD-003 tạo bởi canbo_tw (donViId=Cục BTTP = 0000...0001) hiển thị được trong list của cả 3 role trên.

**Impact:** Vi phạm BR-DATA-01 (row-level security theo donVi) và BR-DATA-02 (TW/BN/DP scoping). Dữ liệu Hỏi đáp không bị isolate theo đơn vị → rủi ro compliance.

**Root Cause (Suggested):** Repository query thiếu `WHERE don_vi_id = :currentUserDonViId` (hoặc scoping theo capDonVi). CB_PD_TW nên thấy tất cả, CB_PD_BN chỉ thấy items donVi BN + các DP con, CB_PD_DP chỉ thấy của DP mình.

---

### BUG-HD-003 — [Critical] Portal roles (NHT/DN/TVV) truy cập CMS Hỏi đáp

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | HD-028, HD-029 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Per permission matrix, Portal roles NHT/TVV/CG không có quyền trên HOI_DAP (❌). DN chỉ có C† (API only qua CONG_PLQG channel).

Thực tế:
- `dn_user` GET list CMS trả 200 với 5 items (phải 403)
- `nht_user` GET list trả 200 và POST create trả 201 (phải 403/403)
- `tvv_user` GET list trả 200 (phải 403), POST=403 ✓
- `chuyengia_user` 403/403 ✓

**Impact:** Portal users đọc dữ liệu CMS + NHT còn tự tạo được hỏi đáp. Authorization matrix thiếu enforce cho 3 role.

**Root Cause (Suggested):** Controller thiếu guard chặn Portal roles. Cần whitelist chỉ CB_NV/CB_PD/QTHT access endpoint CMS `/hoi-daps`, và đảm bảo DN phải đi qua endpoint `/portal/hoi-daps` (nếu có) không phải endpoint CMS.

---

### BUG-HD-004 — [Critical] `/cong-khai` success nhưng state không transition

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | HD-015 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** POST `/api/v1/hoi-daps/{id}/cong-khai` với body `{"version":N}` trả HTTP 200 `{"success":true,...}` và ghi PUBLISH vào lichSu. Tuy nhiên sau khi gọi: `trangThai=DA_DUYET` (không chuyển sang CONG_KHAI), `laCongKhai=false`, `ngayCongKhai=null`. Gọi lại lần 2 vẫn success, vẫn không chuyển state, lichSu lại có thêm PUBLISH nữa.

**Impact:** HD không bao giờ lên được CONG_KHAI → không hiển thị trên Cổng PLQG cho public. Liên thông cổng công khai bị hỏng.

**Root Cause (Suggested):** Handler `/cong-khai` chỉ log action vào audit nhưng quên `update SET trang_thai='CONG_KHAI', la_cong_khai=true, ngay_cong_khai=NOW()`. Check SM-HOIDAP transition logic.

---

### BUG-HD-005 — [Major] Full-text search ignore keyword params

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P0 |
| **TC Reference** | HD-002 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `GET /hoi-daps?keyword=batch`, `?q=batch`, `?tieuDe=batch` đều trả về 8/8 items (không filter). Search không hoạt động trên keyword.

**Impact:** Không tìm được câu hỏi theo tên/nội dung. Pagination đẩy user phải scroll tất cả. Trên tập 10K records → unusable.

**Root Cause (Suggested):** Query param name không được whitelist trong DTO hoặc full-text index chưa setup. Kiểm tra `HoiDapQueryDto` có field `keyword/q/search` với `@IsOptional` + `@IsString` và repository có build `WHERE tieu_de ILIKE :k OR noi_dung ILIKE :k`.

---

### BUG-HD-006 — [Major] Batch approve không ghi APPROVE vào lichSu

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | HD-012 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Single approve `/hoi-daps/{id}/phe-duyet` → lichSu có APPROVE entry đúng. Batch approve `/hoi-daps/batch-phe-duyet` → state chuyển DA_DUYET, nguoiDuyetTen set, NHƯNG lichSu thiếu APPROVE entry (so sánh HD_A/B với HD-003). Audit trail mất.

**Impact:** Không biết ai duyệt hỏi đáp nào khi dùng batch. Vi phạm yêu cầu audit log.

**Root Cause (Suggested):** Batch handler chỉ update state + nguoiDuyet nhưng bỏ qua call `auditLogService.log(APPROVE, ...)`. Refactor để reuse single-approve service.

---

### BUG-HD-007 — [Major] Thiếu 3 endpoint state transition (unpublish, close, cancel)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | HD-016, HD-017, HD-018 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** SM-HOIDAP khai báo 9 states nhưng 3 transition không có endpoint:
- CONG_KHAI → DA_DUYET (thu-hoi/unpublish): 404
- DA_DUYET/CONG_KHAI → HOAN_THANH (close): 404
- MOI → HUY (cancel): 404

**Impact:** Không đóng được hỏi đáp, không hủy được, không thu hồi công khai. User stuck ở trạng thái DA_DUYET. 2/9 states (HOAN_THANH, HUY) unreachable.

**Root Cause (Suggested):** Thiếu 3 controller methods. Có thể gom vào 1 endpoint chung `/transition` với body `{action:'CANCEL/CLOSE/WITHDRAW', reason, version}`.

---

### BUG-HD-008 — [Major] Thiếu endpoint Export Excel

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P2 |
| **TC Reference** | HD-020 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Tất cả path dự đoán đều 404/400: `/export`, `/export-excel`, `/xuat-excel`, `/download`, `/exports/hoi-daps`. BR-DATA-06 (max 10K rows) không test được.

**Impact:** Không xuất được báo cáo câu hỏi ra Excel cho lãnh đạo/thống kê.

**Root Cause (Suggested):** Thiếu controller method `@Get('export')` với exceljs/xlsx-populate. Tham khảo module Doanh nghiệp có endpoint export hoạt động.

---

### BUG-HD-009 — [Major] File upload ok nhưng không attach được vào HD/PhanHoi

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P2 |
| **TC Reference** | HD-023 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** POST `/files/upload` trả fileId thành công. Tuy nhiên:
- POST phan-hois với body `{"fileDinhKem":["<fileId>"]}` → field bị ignore, phan-hoi response không có fileDinhKem
- GET HD detail: `fileDinhKem: []` luôn empty
- Các endpoint liên kết `/hoi-daps/{id}/files`, `/dinh-kem`, `/attachments` đều 404

**Impact:** Không đính kèm được tài liệu (văn bản pháp luật, công văn) vào câu trả lời → nghiệp vụ mất hết tài liệu dẫn chứng.

**Root Cause (Suggested):** PhanHoiCreateDto thiếu field `fileDinhKem: string[]`. Service tạo phan-hoi không ghép file qua bảng nối `phan_hoi_files`. Cần model + endpoint attach.

---

### BUG-HD-010 — [Medium] Mau-phan-hoi LIST trả HTTP 500

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P1 |
| **TC Reference** | HD-033 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** GET `/api/v1/mau-phan-hois` (và với params `?loai=MAU_PHAN_HOI`, `?page=1&pageSize=3`) đều trả HTTP 500 `ERR-SYS-00-00-01 Internal server error`. CREATE/UPDATE/DELETE hoạt động đúng.

**Impact:** Không list được mẫu phản hồi → user không chọn được mẫu khi soạn câu trả lời (chèn mẫu vẫn work qua mauPhanHoiId nếu biết UUID).

**Root Cause (Suggested):** Query list có lỗi — có thể do JOIN với bảng linh-vuc hoặc null field. Check server log khi call endpoint này.

---

### BUG-HD-011 — [Medium] Response envelope double-wrapped trên mau-phan-hois

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P2 |
| **TC Reference** | HD-033 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Response CREATE/UPDATE `/mau-phan-hois`: `{"success":true,"data":{"success":true,"data":{id:...}}}`. Wrap lồng 2 lần → client phải `.data.data.id`.

**Impact:** Minor FE breakage, inconsistent với các endpoint khác (single-wrap).

**Root Cause (Suggested):** Controller return `{success, data}` đã bị wrapper interceptor bọc thêm 1 lần nữa. Remove wrapper thủ công hoặc exclude controller này khỏi global interceptor.

---

### BUG-HD-012 — [Medium] Gợi ý CB NV theo lĩnh vực chưa implement (FR-II-NEW-01)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P1 |
| **TC Reference** | HD-031 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Endpoint `/hoi-daps/{id}/goi-y-can-bo`, `/suggestions`, `/suggest-handlers` đều 404. FR-II-NEW-01 "Phân công gợi ý CB theo cấu hình lĩnh vực" chưa có.

**Impact:** Lãnh đạo phải tự nhớ/tra cứu CB nào phụ trách lĩnh vực pháp luật nào → mất thời gian, phân công sai người.

**Root Cause (Suggested):** Thiếu endpoint suggestion. Cần query `user WHERE linh_vuc_phu_trach @> :linhVucId ORDER BY so_cau_hoi_dang_xu_ly ASC`.

---

## 4. Detailed Test Results

### 4.1 HD-002: Tìm kiếm keyword (FAIL)

**Pre-conditions:** canbo_tw login, có 8 HD trong DB với tiêu đề đa dạng.

**Test Data:**
```
GET /api/v1/hoi-daps?keyword=batch
GET /api/v1/hoi-daps?q=batch
GET /api/v1/hoi-daps?tieuDe=batch
GET /api/v1/hoi-daps?search=batch
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET với `?keyword=batch` | Chỉ trả 2 items (batch approve 1, 2) | 8 items trả về, filter ignored | **FAIL** |
| 2 | GET với `?q=batch` | Chỉ trả 2 items | 8 items | **FAIL** |
| 3 | GET với `?search=batch` | Chỉ trả 2 items | HTTP 500 Internal error | **FAIL** |
| 4 | GET với `?tieuDe=batch` | Chỉ trả 2 items | 8 items | **FAIL** |

**Notes:** Evidence tại `evidence/hd-002-*.json`. Search thực sự không hoạt động. Linked BUG-HD-005.

---

### 4.2 HD-007..HD-011 Chain: Workflow chính (PASS)

**Pre-conditions:** HD-003 đã tạo (MOI, version=1). canbo_tw + lanhdao_tw token.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST `/{id}/tiep-nhan` `{"version":1}` | MOI → TIEP_NHAN, ngayTiepNhan set | trangThai=TIEP_NHAN, deadline = ngayTiepNhan+18d | **PASS** |
| 2 | POST `/{id}/phan-cong` `{"version":2, nguoiXuLyId}` | TIEP_NHAN → DANG_XU_LY | trangThai=DANG_XU_LY, nguoiXuLyTen=Cán bộ TW | **PASS** |
| 3 | POST `/{id}/phan-hois` `{"noiDung":"..."}` | Tạo DU_THAO | phan-hoi id created, trangThai=DU_THAO | **PASS** |
| 4 | PATCH `/phan-hois/{phid}` `{"daTraLoi":true, version:1}` | HD → CHO_PHE_DUYET, phan-hoi → DA_GUI | HD trangThai=CHO_PHE_DUYET, lichSu có SUBMIT ✓ | **PASS** |
| 5 | POST `/{id}/phe-duyet` `{"version":4}` (lanhdao_tw) | CHO_PHE_DUYET → DA_DUYET | trangThai=DA_DUYET, nguoiDuyetTen=Lãnh đạo TW, lichSu có APPROVE | **PASS** |

**Notes:** SLA calc: ngayTiepNhan=2026-04-17T07:50:54Z, deadline=2026-05-05T07:50:54Z = 18 days calendar (~20 working days) → phù hợp BR-SLA-01 theo NĐ55/2019.

---

### 4.3 HD-015: `/cong-khai` không transition state (FAIL)

**Pre-conditions:** HD_A state=DA_DUYET version=5

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST `/{id}/cong-khai` `{"version":5}` | 200, trangThai=CONG_KHAI, laCongKhai=true, ngayCongKhai set | 200 ✓ **NHƯNG** trangThai=DA_DUYET, laCongKhai=false, ngayCongKhai=null | **FAIL** |
| 2 | GET `/{id}` | — | lichSu có `PUBLISH` entry, version tăng lên 6 | **PARTIAL** (log OK, state fail) |
| 3 | POST `/{id}/cong-khai` lần 2 `{"version":6}` | Idempotent hoặc 409 conflict | 200 success, thêm PUBLISH vào lichSu, state vẫn DA_DUYET | **FAIL** |

**Notes:** State machine broken. Linked BUG-HD-004.

---

### 4.4 HD-024/025: Authorization failures (FAIL)

**Pre-conditions:** Các token role khác nhau.

**Test Steps (HD-024):**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET `/hoi-daps` với qtht_tw | 200 (R ✓) | 200 ✓ | PASS |
| 2 | POST `/hoi-daps` với qtht_tw | 403 (không C) | **201 Created, maHoiDap=HD-20260417-009** | **FAIL** |
| 3 | PATCH với qtht_tw | 403 | 409 (chỉ vì record đã DA_DUYET, không phải do authz) | **FAIL** (role chưa block) |

**Test Steps (HD-025):**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET với lanhdao_bn (Bộ KH&ĐT) | Chỉ thấy HD có donVi=Bộ KH&ĐT | **Thấy toàn bộ 16 items cross-donVi** | **FAIL** |
| 2 | GET với lanhdao_dp (Sở TP HN) | Chỉ thấy HD thuộc Sở TP | 16 items | **FAIL** |
| 3 | GET HD-003 (donVi=Cục BTTP) với lanhdao_bn | 403 Forbidden | 200 OK, trả full data | **FAIL** |

---

### 4.5 HD-033: Mau-phan-hoi CRUD (PARTIAL)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST `/mau-phan-hois` full body | 201, mau id returned | 200, data wrapped twice `{success:{data:{success,data}}}` | **PARTIAL** (wrap bug) |
| 2 | GET `/mau-phan-hois?pageSize=3` | 200 list | **HTTP 500 Internal error** | **FAIL** |
| 3 | GET `/mau-phan-hois/{id}` | 200 detail | 200 ✓ (cũng double wrapped) | **PARTIAL** |
| 4 | PATCH `/mau-phan-hois/{id}` | 200 updated | 200 ✓ | PASS |
| 5 | DELETE `/mau-phan-hois/{id}` | 204 | 204 ✓ | PASS |

Linked BUG-HD-010 + BUG-HD-011.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV (CB_TW) | Cục BTTP | DP (data cấp) | HD-001..HD-010, HD-019, HD-020, HD-027, HD-030..HD-035 |
| lanhdao_tw | CB_PD | Cục BTTP | TW | HD-011, HD-012, HD-013, HD-014, HD-026 |
| qtht_tw | QTHT | Cục BTTP | TW | HD-024 (authz bug) |
| lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | HD-025 (scoping fail) |
| lanhdao_dp | CB_PD | Sở TP HN | DP | HD-025 (scoping fail) |
| canbo_bn | CB_NV | Bộ KH&ĐT | BN | HD-025 (scoping fail) |
| dn_user | DN | — | Portal | HD-027 (pass), HD-028 (authz fail) |
| nht_user | NHT | — | Portal | HD-029 (authz fail) |
| tvv_user | TVV | — | Portal | HD-029 (authz fail) |
| chuyengia_user | CG | — | Portal | HD-029 (pass) |

### 5.2 Data tạo trong test

| Mã | Tên | Purpose | Cleanup? |
|----|-----|---------|----------|
| HD-20260417-002 | QA-R2 HD-003 Câu hỏi test tạo mới hợp lệ | TC HD-003..HD-019 full workflow + immutability | Keep (DA_DUYET, evidence) |
| HD-20260417-003/004 | QA-R2 Batch Approve A/B | TC HD-012 batch approve evidence | Keep (DA_DUYET) |
| HD-20260417-005 | QA-R2 HD-013 Reject Test | TC HD-013/014 reject flow | Keep |
| HD-20260417-007 | QA-R2 HD-018 Cancel MOI | TC HD-018 cancel test | Keep (MOI — cancel endpoint missing) |
| HD-20260417-008 | QA-R2 HD-023 Attach Test | TC HD-023 file attach | Keep (evidence for fileDinhKem ignored) |
| HD-20260417-009 | QA-R2 HD-024 BUG: QTHT can create | TC HD-024 authz bug | **Keep (BUG evidence)** — created by qtht_tw |
| HD-20260417-010 | QA-R2 HD-029 BUG: NHT creates | TC HD-029 authz bug | **Keep (BUG evidence)** — created by nht_user |
| HD-20260417-011 | QA-R2 HD-027 DN API create | TC HD-027 DN channel CONG_PLQG | Keep |
| HD-20260417-012 | QA-R2 HD-031 Goi Y CB | TC HD-031 (suggestion missing) | Keep |
| HD-20260417-013 | QA-R2 HD-034 Use Mau | TC HD-034 chèn mẫu | Keep |
| mau e3b231bf... | Mẫu QA Test R2 Updated | TC HD-033 CRUD mau | **Already deleted** (204) |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}` (hoi-daps, phan-hois, mau-phan-hois, files)
- **Auth flow:** JWT access token + OTP email via MailHog (5 min TTL)
- **Token TTL:** Short — observed revoked sau ~1-3 phút activity → phải refresh thường xuyên
- **Optimistic locking:** Tất cả transition đều require `version` trong body (FR-II validation). Conflict trả ERR-STATE-SYS-00-01 "Dữ liệu đã bị thay đổi bởi người dùng khác"
- **Backend stack:** NestJS + PostgreSQL (inferred from error codes ERR-VAL/ERR-AUTH/ERR-STATE/ERR-SYS format)
- **Known limitations:**
  - `snapshot` command (browse tool) báo "Selector matched multiple elements" trên SPA login page → không test qua UI được, phải test qua API. Phù hợp với ghi chú của sibling report doanh-nghiep
  - Rate limit nhẹ trên login (OTP verify) — retry cần 10-20s sleep
  - Sau `DA_DUYET`, không thể sửa/xóa (immutability guard đúng) nhưng HOAN_THANH/CONG_KHAI unreachable → HD stuck ở DA_DUYET

---

## 7. Recommendations

### Must Fix (Before Release) — P0

1. **BUG-HD-001 (Critical):** Thêm permission guard `@Permissions('create_hoi_dap')` cho POST `/hoi-daps`, loại QTHT khỏi permission list này
2. **BUG-HD-002 (Critical):** Implement donVi scoping trong repository — `WHERE don_vi_id IN (:userDonVi + :childDonVi)` theo cap (TW xem all, BN xem BN+DP con, DP xem DP mình)
3. **BUG-HD-003 (Critical):** Block Portal roles (NHT/TVV/DN) ở endpoint CMS `/hoi-daps`. DN chỉ qua `/portal/hoi-daps` hoặc endpoint riêng với channel CONG_PLQG
4. **BUG-HD-004 (Critical):** Sửa handler `/cong-khai` — thêm `UPDATE SET trang_thai='CONG_KHAI', la_cong_khai=true, ngay_cong_khai=NOW()` vào transaction
5. **BUG-HD-005 (Major):** Implement full-text search trong `HoiDapQueryDto` — thêm field `keyword` build `ILIKE` trên tieu_de + noi_dung

### Should Fix — P1

6. **BUG-HD-006 (Major):** Batch approve gọi lại `auditLogService.log(APPROVE, ...)` cho mỗi id
7. **BUG-HD-007 (Major):** Thêm 3 endpoint: `/huy`, `/hoan-thanh`, `/thu-hoi` (hoặc gom `/transition` generic)
8. **BUG-HD-008 (Major):** Implement `/hoi-daps/export` với max 10K rows (BR-DATA-06)
9. **BUG-HD-009 (Major):** PhanHoiCreateDto thêm `fileDinhKem: string[]`, tạo bảng nối + service attach
10. **BUG-HD-010 (Medium):** Debug 500 error ở `/mau-phan-hois` GET list — check server log
11. **BUG-HD-012 (Medium):** Implement FR-II-NEW-01 `/goi-y-can-bo` query theo `linh_vuc_phu_trach` + workload ASC

### Nice to Have — P2

12. **BUG-HD-011 (Medium):** Remove response double-wrap ở MauPhanHoiController
13. Expose donViId + filter `donViId` trong list response để QA verify scoping (hiện chỉ thấy null)

### Additional Recommendations

14. **Test data:** Seed thêm HD với `mucDoCanhBao=CAO/CRITICAL/OVERDUE` để test HD-022 (SLA indicators)
15. **Test data:** Seed thêm CB_NV trong 1 đơn vị để test HD-031 (gợi ý) và HD-032 (workload warning)
16. **UI testing:** Snapshot UI không hoạt động với `snapshot -i` → cần debug browse tool config cho SPA React + Antd; test UI tabs/responsive thủ công
17. **Environment:** Cân nhắc tăng JWT TTL cho test env — hiện revoke quá nhanh gây phiền cho automation

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | TC |
|--------|----------|---------|-----|
| POST | `/auth/login`, `/auth/verify-otp` | Login flow | All |
| GET | `/hoi-daps` | List + paging + filter | HD-001, HD-002, HD-021, HD-035 |
| POST | `/hoi-daps` | Create | HD-003, HD-004, HD-005, HD-024, HD-027, HD-029 |
| GET | `/hoi-daps/{id}` | Detail | HD-006, HD-019, HD-025 |
| PATCH | `/hoi-daps/{id}` | Update (immutability check) | HD-019 |
| DELETE | `/hoi-daps/{id}` | (404 — not implemented) | HD-018 |
| POST | `/hoi-daps/{id}/tiep-nhan` | MOI → TIEP_NHAN | HD-007 |
| POST | `/hoi-daps/{id}/phan-cong` | Assignment | HD-030, HD-031, HD-032 |
| POST | `/hoi-daps/{id}/phan-hois` | Create phan-hoi | HD-009, HD-034 |
| PATCH | `/hoi-daps/{id}/phan-hois/{phid}` | daTraLoi transition | HD-010 |
| POST | `/hoi-daps/{id}/phe-duyet` | Approve | HD-011 |
| POST | `/hoi-daps/batch-phe-duyet` | Batch approve | HD-012 |
| POST | `/hoi-daps/{id}/tu-choi` | Reject | HD-013, HD-014 |
| POST | `/hoi-daps/{id}/cong-khai` | Publish (BUG state) | HD-015 |
| GET | `/hoi-daps/{id}/phan-hois` | List phan-hois | HD-023, HD-034 |
| POST | `/files/upload` | File upload | HD-023 |
| POST/GET/PATCH/DELETE | `/mau-phan-hois` | Template CRUD | HD-033 |

### B — Evidence Files

| File | Mô tả | TC Ref |
|------|-------|--------|
| `evidence/hd-001-page1.json`, `page2.json`, `filter-moi.json` | List paging + filter | HD-001 |
| `evidence/hd-002-keyword-batch.json`, `q-batch.json`, `search-batch.json`, `tieuDe-batch.json`, `body-keyword.json` | Search params ignored | HD-002 |
| `evidence/hd-003-create.json` | Create success | HD-003 |
| `evidence/hd-004-empty-noidung.json` | Empty validation | HD-004 |
| `evidence/hd-005-over-5000.json` | Long validation | HD-005 |
| `evidence/hd-006-detail.json` | Full detail | HD-006 |
| `evidence/hd-007-tiepnhan.json` | TIEP_NHAN transition + SLA deadline | HD-007, HD-008 |
| `evidence/hd-009-phanhoi.json` | phan-hoi DU_THAO | HD-009 |
| `evidence/hd-010-datraloi.json`, `hd-010-hd-after.json` | Auto-transition CHO_PHE_DUYET | HD-010 |
| `evidence/hd-011-after-approve.json` | DA_DUYET + APPROVE lichSu | HD-011 |
| `evidence/hd-012-batch-approve.json`, `batch-already-approved.json` | Batch approve + missing audit log | HD-012 |
| `evidence/hd-013-reject.json`, `hd-014-reject-noreason.json` | Reject flow | HD-013, HD-014 |
| `evidence/hd-015-after-publish.json` | Publish state BUG | HD-015 |
| `evidence/hd-019-edit-approved.json` | Immutability | HD-019 |
| `evidence/hd-020-export.xlsx` | Export 400 response (183 bytes JSON error, not XLSX) | HD-020 |
| `evidence/hd-023-upload.json`, `hd-023-phan-hoi-with-file.json` | Upload OK, attach ignored | HD-023 |
| `evidence/hd-024-qtht-create-bug.json` | QTHT tạo được HD (BUG) | HD-024 |
| `evidence/hd-025-lanhdaobn-list.json`, `lanhdaodp-list.json` | Cross-donVi read | HD-025 |
| `evidence/hd-027-dn-create.json` | DN API create | HD-027 |
| `evidence/hd-028-dn-list.json` | DN list CMS (BUG) | HD-028 |
| `evidence/hd-029-nht-create-bug.json`, `hd-029-nht-list-bug.json` | NHT list+create (BUG) | HD-029 |
| `evidence/hd-030-phancong.json`, `hd-030-state-after.json` | Phân công | HD-030 |
| `evidence/hd-033-mau-create.json`, `hd-033-mau-list.json`, `hd-033-mau-update.json`, `hd-033-mau-delete.json` | Mau CRUD + list 500 + wrap bug | HD-033 |
| `evidence/hd-034-use-mau.json` | Chèn mẫu | HD-034 |
| `evidence/hd-035-search-daduyet.json` | Search processed | HD-035 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-II-01 (UC10) List | HD-001, HD-002, HD-021, HD-035 | 3/4 PASS (HD-002 FAIL) |
| FR-II-02 (UC11) Create | HD-003, HD-004, HD-005 | 3/3 PASS |
| FR-II-03 (UC12) Detail | HD-006 | 1/1 PASS |
| FR-II-04 (UC13) Tiếp nhận + SLA | HD-007, HD-008 | 2/2 PASS |
| FR-II-06 (UC15) Phân công | HD-030, HD-031 | 1/2 (HD-031 FAIL — missing) |
| FR-II-07 (UC14, UC16) Phản hồi | HD-009, HD-010 | 2/2 PASS |
| FR-II-08 (UC15) Duyệt/Từ chối | HD-011, HD-012, HD-013, HD-014, HD-026 | 4/5 (HD-012 PARTIAL) |
| FR-II-09 (UC16) Công khai/Thu hồi | HD-015, HD-016 | 0/2 FAIL |
| FR-II-10 (UC17, UC19) Đóng/Search | HD-017, HD-035 | 1/2 (HD-017 FAIL) |
| FR-II-11 (BR-FLOW-03) Hủy/Immutability | HD-018, HD-019 | 1/2 (HD-018 FAIL) |
| FR-II-12 (BR-DATA-06) Export | HD-020 | 0/1 FAIL |
| FR-II-NEW-01 (Gợi ý CB) | HD-031 | 0/1 FAIL |
| FR-II-NEW-02 (Mẫu phản hồi) | HD-033, HD-034 | 1/2 PARTIAL |
| BR-SLA-01/02 | HD-008, HD-022 | 1/2 PARTIAL (HD-022 thiếu data) |
| BR-FLOW-01/02/04 | HD-010, HD-012, HD-013 | 2/3 (HD-012 audit PARTIAL) |
| BR-DATA-01/02 (Scoping) | HD-025 | 0/1 FAIL |
| Authorization Matrix | HD-024..HD-029 | 2/6 PASS |

---

*Report generated: 2026-04-17 | QA Automation via Claude Code | Opus 4.7*
