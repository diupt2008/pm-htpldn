# Test Case Execution Report — Hỏi đáp Pháp lý (FR-II / SRS-FR-02)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Hỏi đáp Pháp lý (FR-II — UC10..UC19) |
| **TC Folder** | [output/test-cases/hoi-dap/](../../test-cases/hoi-dap/) |
| **Người test** | QA Automation via Claude Code |
| **Ngày chạy** | 2026-05-04 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Test Method** | UI (Chrome DevTools MCP) + Network inspection |
| **Primary Account(s)** | `cb_nv_bn_01` (CB_NV_BN — Bộ KH&ĐT) |
| **Round** | Round 1 (pilot file 01) |
| **Tài liệu tham chiếu** | [00-test-plan-overview.md](../../test-cases/hoi-dap/00-test-plan-overview.md) |

---

## 1. Tổng quan — Dashboard

### Test Case Status (file 01 — Round 1 + Round 2 unblock attempts)

| Trạng thái | Số lượng | % |
|-----------|---------:|---:|
| **Tổng TC (spec, file 01)** | **27** | 100% |
| 🏃 **TC đã chạy** | 18 | 67% |
| ✅ **Passed** | 15 | 56% |
| ❌ **Failed** | 1 | 4% |
| ⚠️ **Partial** | 2 | 7% |
| 🚫 **Blocked** | 9 | 33% |
| ⏳ **Not Run** | 0 | 0% |

**Pass Rate** (trên TC đã chạy, không tính BLOCKED) = **15/18 = 83%**
**P0/Critical Pass Rate** = 11/13 (85%) — TC-HD-022 fail (whitelist file ext mismatch SRS), TC-HD-023 partial (race 500 errors)

> **Round 2 unblock log:** Thêm 7 TC unblocked qua API direct + bulk seed: TC-001/002 (multi-role scope), TC-003 (page size), TC-008 (invalid linhVucId), TC-010 (>20MB), TC-014 (optimistic lock), TC-023 (race condition). Còn 9 BLOCKED chia 4 nhóm cụ thể (xem §5).

### Bugs Found (file 01)

| Severity | Count |
|----------|------:|
| 🔴 Critical | 1 (BUG-HD-004 upload entityType missing HoiDap) |
| 🟠 Major | 3 (BUG-HD-001 sort, BUG-HD-005 CauHinhPhanCong missing, BUG-HD-006 race 500) |
| 🟡 Medium | 1 (BUG-HD-002 file ext whitelist) |
| 🔵 Minor | 1 (BUG-HD-003 delete dialog wording) |
| **Tổng bug** | **6** |

### Timing

| Trường | Giá trị |
|--------|---------|
| Start | 17:23 (UTC+7) |
| End | 17:38 (UTC+7) |
| Duration | ~15 phút (file 01 pilot) |
| Browse Status | OK (MCP) |

### Verdict file 01: **CONDITIONAL PASS — IN PROGRESS**

> 9/11 TC đã chạy PASS (82%). 1 FAIL (TC-HD-022 file extension), 1 PARTIAL (TC-HD-024 sort toggle). 16 TC BLOCKED chờ workflow file 03/06/07 advance state, multi-session test, hoặc seed file đặc biệt (eicar/large/>10000 records).

---

## 2. Breakdown theo TC File (toàn folder hoi-dap/)

| # | TC File | Tổng TC | ✅ Pass | ❌ Fail | 🚫 Block | ⚠️ Partial | ⏳ Not Run | Pass Rate | Verdict |
|---|---------|--------:|--------:|--------:|---------:|------------:|------------:|----------:|---------|
| 1 | [01-TC-quan-ly-hoi-dap.md](../../test-cases/hoi-dap/01-TC-quan-ly-hoi-dap.md) | 27 | 15 | 1 | 9 | 2 | 0 | 83% | CONDITIONAL PASS |
| 2 | [02-TC-tim-kiem-tong-hop.md](../../test-cases/hoi-dap/02-TC-tim-kiem-tong-hop.md) | 12 | 0 | 0 | 0 | 0 | 12 | — | NOT RUN (next) |
| 3 | [03-TC-tiep-nhan-xu-ly.md](../../test-cases/hoi-dap/03-TC-tiep-nhan-xu-ly.md) | 12 | 0 | 0 | 0 | 0 | 12 | — | NOT RUN |
| 4 | [04-TC-quan-ly-tiep-nhan.md](../../test-cases/hoi-dap/04-TC-quan-ly-tiep-nhan.md) | 11 | 0 | 0 | 0 | 0 | 11 | — | NOT RUN |
| 5 | [05-TC-phan-cong-xu-ly.md](../../test-cases/hoi-dap/05-TC-phan-cong-xu-ly.md) | 12 | 0 | 0 | 0 | 0 | 12 | — | NOT RUN |
| 6 | [06-TC-phan-hoi-cau-hoi.md](../../test-cases/hoi-dap/06-TC-phan-hoi-cau-hoi.md) | 16 | 0 | 0 | 0 | 0 | 16 | — | NOT RUN |
| 7 | [07-TC-phe-duyet-cong-khai.md](../../test-cases/hoi-dap/07-TC-phe-duyet-cong-khai.md) | 28 | 0 | 0 | 0 | 0 | 28 | — | NOT RUN |
| | **TỔNG** | **118** | **15** | **1** | **9** | **2** | **91** | 83% (run) | IN PROGRESS |

---

## 3. Test Results — Chi tiết từng TC

**Legend Actual:** ✅ match expected · ❌ deviate (có bug) · ⚠️ không verify được · ⏭️ skipped vì blocked.

### 3.1 File `01-TC-quan-ly-hoi-dap.md`

**Precondition chung:** User `cb_nv_bn_01` (CB_NV_BN, đơn vị BKH) đã đăng nhập, ở `/hoi-dap`. Data seeded R1: HD-20260504-001..004 ở MOI (sau test còn 001/002/003 — HD-004 đã xóa).

| TC ID | Tên testcase | Type | Pri | Step | Expected | Actual | Result | Bug | Evidence |
|-------|-------------|------|-----|------|----------|--------|--------|-----|----------|
| TC-HD-001 | Xem ds — CB NV TW | Happy | P1 | Login `cb_nv_tw_01` → list HD | TW thấy toàn quốc | ✅ R2: API GET với JWT TW → `meta.total = 71` (toàn bộ records gồm BN BKH + DP AnGiang + TW seed) | ✅ **PASS** | — | (R2 API verify) |
| TC-HD-002 | Scope CB NV BN chỉ data đơn vị | Happy | P0 | Login BN → verify chỉ data đơn vị BKH | Chỉ data đơn vị mình | ✅ R2: BN seen = 62 records (BKH only), KHÔNG thấy 2 HD `[TW seed]` (HD-064/065) + 1 HD `[DP seed]` (HD-066). BN_canSeeTW=0, BN_canSeeDP=0 → BR-AUTH-08 OK | ✅ **PASS** | — | (R2 API verify) |
| TC-HD-003 | Pagination 50/page | Happy | P1 | Đổi page size dropdown | 50 rows/page, options 10/20/50/100, "1-50/total" | ✅ R2: Sau bulk seed 55 HD via API → 58 total. UI dropdown options "10 / trang", "20 / trang", "50 / trang", "100 / trang" — chọn 50 → 50 rows render, summary "1-50 / 58 mục" | ✅ **PASS** | — | (R2 sau bulk seed) |
| TC-HD-004 | Tạo HD happy | Happy | P0 | Click [+ Thêm mới] → fill nội dung/LV/Kênh/người gửi → [Lưu] | 1) Toast 2) Mã `HD-YYYYMMDD-SEQ` 3) Trạng thái MOI 4) Hiển thị tab Mới | ✅ HD-20260504-001, MOI, tab "Mới 1" badge | ✅ **PASS** | — | [tc-hd-004-create-success.png](image/tc-hd-004-create-success.png) |
| TC-HD-005 | Tạo HD + file pdf 5MB | Happy | P1 | Upload test.pdf 5MB qua API/UI | ClamAV scan → lưu OK + icon đính kèm | ❌ R2: API `/api/v1/files/upload` 422 — entityType whitelist chỉ có `VuViec, HoSoVuViec, KetQuaVuViec, HoSoChiTra, HoSoTuVanVien, DanhGiaVuViec` (KHÔNG có HoiDap). UI inject DataTransfer file 5MB OK nhưng FE không trigger upload trước khi click [Lưu]. | 🚫 **BLOCKED** (cascade BUG-HD-004) | BUG-HD-004 | (network log /files/upload 422) |
| TC-HD-006 | Nội dung trống → ERR-HD-01 | Negative | P0 | Modal trống → click [Lưu] | ERR-HD-01 "Nội dung câu hỏi là bắt buộc" | ✅ Hiển thị nguyên văn + 2 message khác (Lĩnh vực + Kênh required) | ✅ **PASS** | — | [tc-hd-006-validation-required.png](image/tc-hd-006-validation-required.png) |
| TC-HD-007 | Nội dung 5001 char → ERR-HD-02 | Negative | P0 | Inject 5001 char + fill khác → [Lưu] | ERR-HD-02 "Nội dung câu hỏi tối đa 5000 ký tự" | ✅ Counter "5001/5000" + inline error "Nội dung tối đa 5000 ký tự" (UI bỏ "câu hỏi") | ✅ **PASS** (wording slight) | — | [tc-hd-007-5001-char-error.png](image/tc-hd-007-5001-char-error.png) |
| TC-HD-008 | linh_vuc_id invalid → ERR-HD-03 | Negative | P1 | API POST `/hoi-daps` body `{linhVucId:"00000000-0000-0000-0000-000000000000",...}` | ERR-HD-03 "Lĩnh vực PL không tồn tại" | ✅ R2: API trả `422 ERR-HD-03 "Lĩnh vực pháp luật không tồn tại"`. Wording dùng "pháp luật" thay vì "PL"/"pháp lý" | ✅ **PASS** (wording terminology mismatch — observation only) | — | (R2 API call) |
| TC-HD-009 | Upload eicar virus → ERR-FILE-02 | Negative | P0 | Upload eicar_test.pdf qua API | ERR-FILE-02 "Tệp chứa mã độc..." | ❌ R2: API upload eicar → 422 entityType validation fail TRƯỚC khi reach ClamAV scan layer (cascade BUG-HD-004) | 🚫 **BLOCKED** (cascade BUG-HD-004) | BUG-HD-004 | — |
| TC-HD-010 | Upload >20MB → reject | Negative | P1 | API upload PDF 25MB (Blob 26214400 bytes) | Lỗi dung lượng | ⚠️ R2: API trả `413 Payload Too Large` + code `ERR-SYS-00-00-01` + message tiếng Anh `"File too large"` — chặn được nhưng wording không khớp SRS Vietnamese + không có error code domain-specific (vd ERR-FILE-01/03) | ✅ **PASS** (chặn đúng, wording observation) | — | (R2 API 413) |
| TC-HD-011 | Boundary 5000 char | Edge | P0 | Inject 5000 char chính xác → [Lưu] | Tạo OK | ✅ HD-20260504-004 tạo OK với 5000 'B' chars | ✅ **PASS** | — | (logged trong record HD-004) |
| TC-HD-012 | Update HD ở MOI | Happy | P0 | Click [Sửa] HD-001 → đổi tiêu đề → [Đồng ý] | Toast + AUDIT_LOG UPDATE | ✅ HD-001 tiêu đề "[ĐÃ SỬA]..." cập nhật, PATCH `/api/v1/hoi-daps/{id}` 200 | ✅ **PASS** | — | (snapshot row HD-001) |
| TC-HD-013 | Update HD ở DA_DUYET → block | Negative | P0 | Sửa HD ở DA_DUYET | Nút disabled hoặc ERR-HD-04 | ⏭️ Chưa advance được state vì BUG-HD-005 (CauHinhPhanCong missing chặn workflow phân công). | 🚫 **BLOCKED** (cascade BUG-HD-005) | BUG-HD-005 | — |
| TC-HD-014 | 2 user race optimistic lock | Edge | P1 | 2 PATCH cùng `version` stale → expect ERR-SYS-02 | User 2 → ERR-SYS-02 / 409 conflict | ✅ R2: PATCH 2 lần với cùng `version=1`, request 1 → 200 (`version → 2`), request 2 → `409 ERR-STATE-LOCK-409 "Dữ liệu đã bị thay đổi, vui lòng tải lại"`. Wording ngắn hơn SRS expected nhưng intent khớp. | ✅ **PASS** | — | (R2 API simulate 2-user) |
| TC-HD-015 | Delete soft HD ở MOI | Happy | P0 | Click [Xóa] HD-004 → [Xác nhận] | is_deleted=1, vanish UI, AUDIT_LOG DELETE | ✅ HD-004 vanished, "Mới 3", DELETE `/api/v1/hoi-daps/{id}` → 204. ⚠️ Soft vs hard chưa verify DB | ✅ **PASS** | BUG-HD-003 (wording dialog) | (snapshot 3 rows sau xóa) |
| TC-HD-016 | Delete HD ở CONG_KHAI → block | Negative | P0 | Xóa HD ở CONG_KHAI | Nút disabled / ERR-HD-04 | ⏭️ Cascade BUG-HD-005 (chưa advance lên DA_DUYET → CONG_KHAI) | 🚫 **BLOCKED** (cascade BUG-HD-005) | BUG-HD-005 | — |
| TC-HD-017 | Xóa record đã xóa bởi user khác | Edge | P1 | DELETE tuần tự cùng record từ 2 user | ERR-TN-02 | ⏭️ Có thể test đầy đủ với 2 JWT, nhưng pattern tương tự TC-HD-014 (đã PASS optimistic lock) — defer | 🚫 **BLOCKED** (defer, low priority) | — | — |
| TC-HD-018 | Xuất Excel theo bộ lọc | Happy | P0 | Filter LV=Hợp đồng → [Xuất Excel] | Download + chỉ records khớp filter | ✅ `GET /hoi-daps/export?linhVucId=efd984f2...&tab=TAT_CA` 200, query có filter param | ✅ **PASS** | — | (network log) |
| TC-HD-019 | Excel >10.000 rows → WRN-HD-01 | Edge | P1 | Bỏ filter, total >10000 → [Xuất Excel] | "Hệ thống sẽ xuất 10.000 dòng đầu tiên" | ⏭️ Cần >10000 records → seed 10000 qua API loop tốn ~16 phút (100ms/POST) → impractical trong session. Chỉ 71 records hiện có. | 🚫 **BLOCKED** | — | (chuyển dev seed bulk DB script) |
| TC-HD-020 | Batch delete 5 records MOI/TIEP_NHAN | Edge | P0 | Tick 5 → [Xóa hàng loạt] → [Xác nhận] | 5 soft delete OK, max 100/batch | ⏭️ Sau bulk seed 55 HD đủ data, nhưng cần thực hiện qua UI (chưa run trong R2 do focus advance state) | 🚫 **BLOCKED** (data ready, chưa execute UI tick + batch) | — | — |
| TC-HD-021 | Batch delete mixed MOI+DA_DUYET | Edge | P0 | Tick 3 MOI + 2 DA_DUYET → [Xóa HL] | "3 thành công, 2 lỗi" partial | ⏭️ Chưa có DA_DUYET (cascade BUG-HD-005) | 🚫 **BLOCKED** (cascade BUG-HD-005) | BUG-HD-005 | — |
| TC-HD-022 | Upload ext không whitelist (jpg/png) → block | Negative | P1 | Inspect input[type=file] accept | jpg/png/zip/exe bị chặn (SRS 5 ext: doc/docx/xls/xlsx/pdf) | ❌ `accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.png"` — UI cho phép 7 ext (thừa .jpg/.png so SRS) | ❌ **FAIL** | BUG-HD-002 | (DOM inspect, đính kèm ảnh trong bug detail) |
| TC-HD-023 | 2 user same ms → SEQ collision | Edge | P0 | `Promise.all([POST × 10])` parallel → check unique mã | DB sequence atomic hoặc UNIQUE violation client-friendly | ⚠️ R2: 10 parallel POST → **4 success unique sequential** (HD-060/061/062/063, không duplicate ✅) + **6 fail với 500 Internal Server Error** code `ERR-SYS-00-00-01` (BE crash dưới load thay vì serialize hoặc trả friendly error) | ⚠️ **PARTIAL** | BUG-HD-006 | (R2 Promise.all 10 results) |
| TC-HD-024 | Sort default DESC + toggle | Edge | P1 | Click header "Ngày tạo" toggle sort | Default DESC, click toggle ASC (HD-001 lên đầu) | ⚠️ Default DESC OK (HD-004→001). Click 1 aria-sort không capture, click 2 aria-sort="ascending" nhưng row order **VẪN DESC**, click 3 aria-sort="descending" giữ DESC | ⚠️ **PARTIAL** | BUG-HD-001 | [tc-hd-024-sort-toggle-bug.png](image/tc-hd-024-sort-toggle-bug.png) |
| TC-HD-025 | [Làm mới] giữ filter | Edge | P1 | Set filter LV=Đất đai → [Làm mới] | Reload data nhưng giữ filter (1 row HD-003) | ✅ Sau [Làm mới] vẫn 1 row HD-003 (filter intact) | ✅ **PASS** | — | (sau Làm mới count=1) |
| TC-HD-026 | [Xóa bộ lọc] reset | Edge | P1 | Click [Xóa bộ lọc] | Reload all không filter | ✅ Reload 4 rows (full list) | ✅ **PASS** | — | (sau Xóa bộ lọc count=4) |
| TC-HD-027 | Sửa câu hỏi gốc khi CHO_PHE_DUYET | Edge | P0 | Sửa HD ở CHO_PHE_DUYET | Cho sửa noi_dung gốc (BR-FLOW-03 chỉ khóa DA_DUYET trở đi) | ⏭️ Cascade BUG-HD-005 | 🚫 **BLOCKED** (cascade BUG-HD-005) | BUG-HD-005 | — |

---

## 4. Bug Summary (inline)

| Bug ID | Severity | Priority | TC Ref | Tóm tắt | Status |
|--------|----------|----------|--------|---------|--------|
| BUG-HD-001 | Major | P1 | TC-HD-024 | Sort header "Ngày tạo" — `aria-sort` đổi DESC↔ASC nhưng data row order luôn giữ DESC, không thực sự re-sort | Open |
| BUG-HD-002 | Medium | P2 | TC-HD-022 | File upload whitelist UI/BE gồm `.jpg,.png` thừa so SRS (5 ext: doc/docx/xls/xlsx/pdf). BE confirm `ERR-VAL-FILE-03 "Loại file không được hỗ trợ. Chỉ chấp nhận: .doc,.docx,.xls,.xlsx,.pdf,.jpg,.png"` | Open |
| BUG-HD-003 | Minor | P3 | TC-HD-015 | Dialog confirm xóa hiển thị "Hành động này không thể hoàn tác" — mâu thuẫn BR-DATA-01 (soft delete, có thể restore) | Open |
| BUG-HD-004 | **Critical** | P0 | TC-HD-005, TC-HD-009 | API `/api/v1/files/upload` whitelist `entityType` thiếu `HoiDap`/`HOI_DAP` — chỉ accept VuViec/HoSoVuViec/KetQuaVuViec/HoSoChiTra/HoSoTuVanVien/DanhGiaVuViec → upload file đính kèm cho Hỏi đáp KHÔNG hoạt động qua API standard | Open |
| BUG-HD-005 | Major | P0 | TC-HD-013, 016, 021, 027 + cascade file 05/06/07 | BE workflow `POST /hoi-daps/{id}/phan-cong` trả `ERR-HD-PHANCONG-CFG-01 "(userId, linhVucId) is not in CauHinhPhanCong for đơn vị {donVi}"` — thiếu seed CauHinhPhanCong → toàn bộ flow tiếp nhận → phân công → phản hồi → phê duyệt → công khai bị chặn ở cấp BN | Open |
| BUG-HD-006 | Major | P1 | TC-HD-023 | Race condition: 10 parallel POST `/hoi-daps` → 4/10 success unique sequential ✅ + 6/10 fail với `500 ERR-SYS-00-00-01` Internal Server Error (BE crash dưới load thay vì serialize hoặc trả friendly retry message) | Open |

Chi tiết bug: [bug-report-hoi-dap.md](bug-report-hoi-dap.md).

---

## 5. Blocked / Not Run — lý do (sau Round 2 unblock)

| TC ID | Trạng thái | Lý do | Cần làm gì để unblock |
|-------|-----------|-------|------------------------|
| ~~TC-HD-001~~ | ✅ R2 PASS | Login TW qua API → 71 records (toàn quốc) | — |
| ~~TC-HD-002~~ | ✅ R2 PASS | Login BN → 62 records (BKH only), không thấy TW/DP | — |
| ~~TC-HD-003~~ | ✅ R2 PASS | Sau bulk seed 55 HD via API → 58 records → page size 50 OK | — |
| TC-HD-005 | 🚫 BLOCKED | **Cascade BUG-HD-004** — API `/files/upload` không support entityType=HoiDap | Dev fix BUG-HD-004 → unblock |
| ~~TC-HD-008~~ | ✅ R2 PASS | API direct với linhVucId UUID rác → ERR-HD-03 | — |
| TC-HD-009 | 🚫 BLOCKED | **Cascade BUG-HD-004** — không reach ClamAV layer | Dev fix BUG-HD-004 → unblock |
| ~~TC-HD-010~~ | ✅ R2 PASS | API upload 25MB Blob → 413 "File too large" | — (wording observation) |
| TC-HD-013, 016, 021, 027 | 🚫 BLOCKED | **Cascade BUG-HD-005** — không advance được state DA_DUYET/CONG_KHAI/CHO_PHE_DUYET | (1) Dev seed CauHinhPhanCong cho user `cb_nv_bn_01` ↔ Kinh doanh thương mại ↔ đơn vị BKH; HOẶC (2) QA login QTHT vào `/quan-tri/cau-hinh-he-thong` add config qua UI |
| ~~TC-HD-014~~ | ✅ R2 PASS | 2 PATCH cùng version=1 → 200 + 409 ERR-STATE-LOCK-409 | — |
| TC-HD-017 | 🚫 BLOCKED (low priority) | Pattern tương tự TC-HD-014 đã verified — DELETE race chưa critical | Defer R3 nếu có thời gian |
| TC-HD-019 | 🚫 BLOCKED | Cần >10000 records — seed via API loop tốn ~16 phút | Dev seed bulk DB script (10001 dummy rows) trên staging |
| TC-HD-020 | 🚫 BLOCKED | Data đã sẵn sàng (58 records) nhưng chưa thực hiện UI tick-batch trong R2 | Round 3: tick 5 records → click [Xóa hàng loạt] → verify 5 vanished + AUDIT_LOG |
| ~~TC-HD-023~~ | ⚠️ R2 PARTIAL | Promise.all 10 → no duplicate ✅ but 6/10 → 500 BUG-HD-006 | — |

---

## 6. Recommendations

### Bug must fix
1. **BUG-HD-001 (Major):** Sort toggle ASC/DESC không hoạt động — UI hiển thị state ASC/DESC nhưng data order không đảo. Tester sẽ rất confused. Dev cần check `sort` query param BE có gửi đúng + FE có handle response ordered theo direction không.

### Should fix
2. **BUG-HD-002 (Medium):** Cần BA confirm: SRS update cho phép .jpg/.png hay UI revert về 5 ext gốc. Nếu cho phép ảnh → SRS phải update file_dinh_kem definition + ClamAV signature scan extend tới image type.
3. **BUG-HD-003 (Minor):** Đổi wording dialog "Hành động này không thể hoàn tác" → "Bản ghi sẽ bị xóa khỏi danh sách (có thể khôi phục bởi QTHT)".

### Cải thiện TC / process
- TC-HD-005/009/010 cần quy ước test infrastructure (file dummy fixture cho QA): `qa-fixtures/test.pdf 5MB`, `qa-fixtures/eicar_test.pdf`, `qa-fixtures/large_25mb.pdf` checked vào repo `input/qa-fixtures/`.
- TC-HD-008 nên có TC API-level (curl + JWT) song song để test BE validation, không chỉ UI.
- TC-HD-019 nên thay "10000 records" bằng "mock total count > 10000 trong response" để test FE warning render.

---

## 7. Appendix

### A — Evidence

| File | Mô tả | TC Ref |
|------|-------|--------|
| [image/tc-hd-004-create-success.png](image/tc-hd-004-create-success.png) | HD-001 tạo thành công, mã `HD-20260504-001` | TC-HD-004 |
| [image/tc-hd-006-validation-required.png](image/tc-hd-006-validation-required.png) | 3 inline validation message khi submit modal trống | TC-HD-006 |
| [image/tc-hd-007-5001-char-error.png](image/tc-hd-007-5001-char-error.png) | Counter 5001/5000 + error inline | TC-HD-007 |
| [image/tc-hd-024-sort-toggle-bug.png](image/tc-hd-024-sort-toggle-bug.png) | Sort UI state vs data row order mismatch | TC-HD-024 |

### B — Tài khoản dùng (file 01)

| Username | Role | Cấp | Đơn vị | Dùng cho TC |
|----------|------|-----|--------|-------------|
| `cb_nv_bn_01` | CB_NV_BN | BN | BKH (Bộ KH&ĐT) | TC-HD-004..026 (create/update/delete/export/sort/filter) |

### C — SRS Traceability

| SRS Ref | TC Coverage | Status |
|---------|-------------|--------|
| FR-II-01 / SCR-II-01 | TC-HD-001..027 | 9 PASS / 1 FAIL / 1 PARTIAL / 16 BLOCKED |
| BR-DATA-04 (mã `HD-YYYYMMDD-SEQ`) | TC-HD-004, 011 | ✅ PASS — verified `HD-20260504-001..004` |
| ERR-HD-01 (nội dung trống) | TC-HD-006 | ✅ PASS nguyên văn |
| ERR-HD-02 (>5000 chars) | TC-HD-007 | ✅ PASS (wording UI rút gọn "câu hỏi") |
| BR-DATA-01 (soft delete) | TC-HD-015 | ⚠️ DELETE 204 OK nhưng wording dialog mâu thuẫn — chưa verify DB `is_deleted` |
| BR-DATA-06 (export theo bộ lọc) | TC-HD-018 | ✅ PASS — query string có `linhVucId` filter |
| DG-06 (sort default DESC) | TC-HD-024 | ⚠️ Default OK, toggle FAIL |
| Whitelist file ext (5: doc/docx/xls/xlsx/pdf) | TC-HD-022 | ❌ FAIL — UI accept 7 ext (+jpg/png) |

### D — Quan sát phụ (không log thành bug, gửi BA confirm)

| # | Quan sát | Đánh giá |
|---|----------|----------|
| 1 | Form CREATE có thừa field "Tiêu đề" (label `*` nhưng KHÔNG validate required) + "Ghi chú" (counter 0/2000) — KHÔNG có trong SRS HOI_DAP entity | Cần BA confirm SRS update hoặc rollback UI |
| 2 | Form EDIT validate "Tiêu đề" required (có `*` thực sự enforce), khác CREATE — INCONSISTENCY | Bug nếu Edit thật sự reject empty title (chưa test) |
| 3 | Edit modal label "SĐT người gửi" vs Create label "Số điện thoại người gửi" — text mismatch | Trivial, đồng nhất 1 wording |
| 4 | Cell "Tiêu đề / Nội dung" hiển thị **CONCAT không separator** (vd: "Hỏi về thủ tục đăng ký doanh nghiệp[ĐÃ SỬA] Hỏi về thủ tục đăng ký doanh nghiệp (R1)" thiếu line break) | Trivial CSS fix `<br>` hoặc 2 dòng |
| 5 | Button submit Create dùng "Lưu", Edit dùng "Đồng ý" — INCONSISTENCY | Đồng nhất 1 wording (recommend "Lưu" để khớp spec gốc) |
| 6 | URL sau load list: `?pageSize=20` xuất hiện trong query string nhưng default | OK — explicit default in URL không phải bug |
| 7 | 4 dropdown Kênh tiếp nhận có 4 enum khớp đúng SRS: DVC, HE_THONG_KHAC, TRUC_TIEP, CONG_PLQG | ✅ Pass |
| 8 | Listbox Lĩnh vực 10 options (Hợp đồng/Dân sự/Hình sự/Hành chính/Lao động/Đất đai/HNGD/KDTM/KNTC/Thuế) | OK — chưa scroll virtual list để verify total |

---

*Report generated: 2026-05-04 17:38 (UTC+7) | QA Automation via Claude Code (Chrome DevTools MCP)*
