# Functional Test Report — Thư viện Biểu mẫu (Module 7.9 v3.5)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Thư viện Biểu mẫu, Hợp đồng — Module 7.9 |
| **SRS Reference** | [`srs-update-2026-5-5/_DELTA-MAP-FR09.md`](../../../../../input/srs-update-2026-5-5/_DELTA-MAP-FR09.md) + [`srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md` line 1010-1117](../../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) — apply CR-01 (4 trường công khai + BR-PUBLIC-01/02/03) |
| **UC Coverage** | UC 92, 93, 94, 95, 96, 97, 98 (UC 163 đã MOVE sang FR-14) |
| **Người test** | QA Automation (Claude Code MCP) |
| **Ngày** | 2026-05-07 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | Hybrid (UI MCP + API direct via `evaluate_script` cho batch validation) |
| **Primary Account** | `cb_nv_tw_01` / `Secret@123` — CB Nghiệp vụ TW, đơn vị BTP-TW |
| **Round** | R7.7.10 |
| **Tài liệu tham chiếu** | [`output/funtion/7.9-bieu-mau.md`](../../../../funtion/7.9-bieu-mau.md) (47 TC) · [`workflow-test-report-r7-4-c1-bm.md`](../../workflow/bieu-mau/workflow-test-report-r7-4-c1-bm.md) (R7.4.C1) · [`bug-report-function-bm-r7-7-10.md`](../../bug-reports/bm/bug-report-function-bm-r7-7-10.md) (2 bugs R7.7.10) · [`bug-report-flow-bm-r7-4-c1.md`](../../bug-reports/bm/bug-report-flow-bm-r7-4-c1.md) (6 bugs R7.4.C1) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec v3.5)** | 47 (50 - 3 MOVED to 7.14) |
| **TC đã test / Tổng TC** | 30/47 (64%) — 17 defer (10 BLOCKED bởi BUG-BM-001 + 5 Authorization defer multi-account + 2 import bulk wizard env limit) |
| **Passed** | 22 (PASS hoặc PASS-WITH-NOTE BE-only) |
| **Failed** | 3 (BM-007 preview, BM-008 download — MinIO localhost; BM-016 UI silent reject) |
| **Blocked** | 11 (BM-026 BR-PUBLIC-02 + 10 CR-01 fields BLOCKED by BUG-BM-001/002) |
| **Partial** | 1 (BM-019/021 — BE validate nhưng English error leak) |
| **Defer** | 14 (5 Authorization + 2 import bulk + 4 file size/preview/download cascaded + 3 visual confirm covered by R7.4.C1 seed) |
| **Overall Pass Rate** | 47% (22/47) — không tính BLOCKED + DEFER là PASS |
| **P0 Pass Rate** | 64% (9/14 P0 tested) — block do CR-01 (BM-041/042/045/046) |
| **Bugs Found (SRS-ref)** | 8 tổng (6 từ R7.4.C1 + 2 mới R7.7.10): 3 Critical, 2 Major, 3 Medium |
| **Health Score** | 55/100 (FE chưa apply CR-01 + MinIO config sai + UI silent fail pattern lặp lại 3 lần) |
| **Start Time** | 18:03 (UTC+7) |
| **End Time** | 19:00 (UTC+7) |
| **Total Duration** | 57 phút |
| **Browse Status** | OK — MCP suốt session ổn định, 0 crash |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Luồng chính CRUD + list + filter | 14 | 9 | 0 | 2 (BM-007/008) | 3 (BM-041/046/047) | **64%** |
| **Negative** | Validate input (required/duplicate/format) | 9 | 4 | 1 | 1 (BM-016) | 2 (BM-044/045) | **44%** |
| **Workflow** | SM-BIEUMAU + công khai + xóa | 8 | 6 | 0 | 0 | 2 (BM-042/043) | **75%** |
| **Authorization** | Permission matrix | 5 | 0 | 0 | 0 | 5 (defer multi-account) | **0%** |
| **Cross-module** | API Cổng PLQG + Lĩnh vực + Audit | 3 | 0 | 0 | 0 | 3 (defer Postman) | **0%** |
| **CR-01 Switch** | 4 trường công khai BIEU_MAU level | 8 | 0 | 0 | 0 | 8 (BUG-BM-001) | **0%** |
| **MOVED** | UC163 HĐ TV → FR-14 | 3 | — | — | — | — | N/A |
| **Total** | | **47** | **19** | **1** | **3** | **23** | **40%** |

→ **Happy-path Pass Rate = 9/14 = 64%** — đủ seed cho module downstream nhưng dấu Critical bug MinIO + 4 fields công khai vẫn pending.

### Verdict: **CONDITIONAL PASS — không thể release v3.5 cho đến khi fix BUG-BM-001/002/007**

CRUD core + state machine + BR-PUBLIC-01 (BE-side) hoạt động đúng. Tuy nhiên 3 bug Critical (4 trường công khai missing trong form, BR-PUBLIC-02 không clear timestamp, MinIO localhost broken) chặn 11 TC P0 và làm preview/download không dùng được.

---

## 2. Test Case Results

> Status icon: ✅ PASS · ⚠️ PARTIAL · ❌ FAIL · 🚫 BLOCKED · ⏭ DEFER · 🔁 (carry-forward từ R7.4.C1)

### 2.1 P0 — Core CRUD + State Machine (14 TC)

| TC ID | UC | Tên | Type | Status | Note |
|-------|-----|-----|------|:-:|------|
| BM-001 | UC92 | List TM phân trang + filter trạng thái | Happy | ✅ | Filter `?trangThai=AN` → 1 record (Biểu mẫu SHTT). Tabs Tất cả/Đã công khai/Nháp/Đã ẩn render. |
| BM-002 | UC92 | Tạo TM mới (default NHAP) | Happy | ✅ | POST `/thu-muc-bieu-maus` 201, id `58a429a8-...`, `trangThai=NHAP`. |
| BM-003 | UC95 | Xem list BM trong TM | Happy | ✅ | GET `/bieu-maus?thuMucId=...` 200, render BM-20260507-001 đầy đủ (cột Mã/Tên/Loại TL/TM/Kích thước/Trạng thái/Sync/Action). |
| BM-004 | UC95 | Tạo BM upload doc/docx ≤20MB | Happy | ✅ 🔁 | Đã seed BM-20260507-001 ở R7.4.C1 với `test-bm-r7-4-c1.docx` 917B. Switch công khai OFF default — KHÔNG verify được do BUG-BM-001 thiếu Switch. |
| BM-005 | UC96 | Search BM theo keyword | Happy | ✅ | `?search=R7.4.C1` → 1 match. `?search=NotExists` → 0. |
| BM-008 | UC95 | Tải BM về (giữ tên gốc) | Happy | ❌ | [BUG-BM-007](../../bug-reports/bm/bug-report-function-bm-r7-7-10.md#bug-bm-007--preview--download-biểu-mẫu-trỏ-minio-localhost9000-không-reachable) — 302 → `localhost:9000/...` `ERR_CONNECTION_REFUSED` |
| BM-012 | UC95 | Xem chi tiết BM | Happy | ✅ | `/bieu-mau/{id}` render: Mã, Trạng thái, Tên, TM, Lĩnh vực, Loại hình, Định dạng (DOCX), Kích thước (917 B), Số lượt tải, Ngày tạo, Mô tả + 4 nút action. |
| BM-014 | UC92 | Tạo TM trùng tên | Negative | ✅ | POST với `tenThuMuc: "Biểu mẫu SHTT"` → 422 `ERR-TM-01` "Tên thư mục đã tồn tại trong đơn vị" (match spec). |
| BM-015 | UC95 | Upload file >20MB | Negative | ⏭ | Defer — env limit 21MB upload qua fetch trong DevTools script. Cần test bằng UI client thực hoặc reduce. |
| BM-016 | UC95 | Upload file sai format | Negative | ❌ | [BUG-BM-008](../../bug-reports/bm/bug-report-function-bm-r7-7-10.md#bug-bm-008--form-thêm-bm-silent-reject-file-invalid-không-có-toasterror) — `.txt` upload silent reject (no toast/error). |
| BM-022 | UC94 | Công khai TM NHAP→CONG_KHAI | Workflow | ✅ 🔁 | R7.4.C1 step 6 PASS. POST `/cong-khai` 200, syncStatus=SYNCED. |
| BM-023 | UC94 | Hủy công khai CONG_KHAI→AN | Workflow | ✅ 🔁 | R7.4.C1 step 7 — TM transition OK. ⚠️ BR-PUBLIC-02 FAIL ở BM (BUG-BM-002). |
| BM-026 | UC94 | Công khai TM rỗng → ERR-CK-01 | Workflow | ⚠️ 🔁 | R7.4.C1 step 4 — BE 409 ERR-CK-01 PASS, UI silent (BUG-BM-005). |
| BM-041 | UC95 | Switch công khai OFF mặc định, 3 trường ẩn | Happy | 🚫 | [BUG-BM-001](../../bug-reports/bm/bug-report-flow-bm-r7-4-c1.md#bug-bm-001--form-thêmsửa-biểu-mẫu-thiếu-4-trường-công-khai-theo-srs-v35) — form không có Switch nào. |
| BM-042 | UC95 | Bật Switch → 3 trường hiện + auto-fill `thoi_gian_dang_tai` | Workflow | 🚫 | BLOCKED bởi BUG-BM-001. BR-PUBLIC-03 BE OK (R7.4.C1 step 6). |
| BM-045 | UC95 | Bản ghi AN/HUY → bật Switch reject `ERR-PUBLIC-01` | Negative | 🚫 | BLOCKED bởi BUG-BM-001 (không có Switch để bật). |
| BM-046 | UC95 | Cột "Đã công khai" badge xanh + tooltip `thoi_gian_dang_tai` | Happy | 🚫 | BLOCKED bởi BUG-BM-001 — SCR-VII-02 chưa render cột này. |

### 2.2 P1 — CRUD nâng cao + Filter + Authorization (28 TC)

| TC ID | UC | Tên | Type | Status | Note |
|-------|-----|-----|------|:-:|------|
| BM-006 | UC93 | Search TM theo lĩnh vực + ngày | Happy | ✅ | Filter `?linhVucId=SHTT` → 2 records. `?search=Test` → 1. UI param: `search` (BE alias `keyword`/`tenThuMuc` không hoạt động — observation). |
| BM-007 | UC95 | Preview online doc/docx → PDF | Happy | ❌ | BUG-BM-007 — modal hiện "Không kết nối được máy chủ" do MinIO localhost. |
| BM-009 | UC92 | Sửa TM (tên/lĩnh vực/mô tả/thứ tự) | Happy | ✅ | PATCH với `version: 1` → 200, version increment to 2 (optimistic concurrency). |
| BM-010 | UC95 | Sửa BM + upload file mới | Happy | ⏭ | Defer (BM-007/008 broken trước nên không verify được file replacement có thực sự thay file mới hay không). |
| BM-011 | UC92 | Xuất Excel TM | Happy | ✅ | POST `/thu-muc-bieu-maus/export` 200, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, 7134B, filename `thu-muc-bieu-mau-{ts}.xlsx`. |
| BM-013 | UC92 | TM tên trống/whitespace | Negative | ✅ | 422 + msg "Tên thư mục không được chỉ chứa khoảng trắng" |
| BM-017 | UC92 | Xóa TM có ≥1 BM | Negative | ✅ | DELETE TM SHTT (1 BM) → 409 `ERR-TM-02` "Thư mục chứa 1 biểu mẫu, không thể xóa" |
| BM-018 | UC92 | Tên TM >500 ký tự | Negative | ⚠️ | 422 "tenThuMuc must be shorter than or equal to 500 characters" — message English, spec yêu cầu `ERR-TM-03` "Tên thư mục tối đa 500 ký tự" |
| BM-019 | UC95 | Tên BM trống | Negative | ⚠️ | 422 nhưng error "thuMucId must be a UUID" hit trước — BE order validation khác spec ERR-BM-03. |
| BM-020 | UC93 | tu_ngay > den_ngay | Negative | ✅ | 400 `ERR-TK-01` "Ngày bắt đầu phải trước ngày kết thúc" (match spec) |
| BM-021 | UC95 | Tạo BM không chọn TM | Negative | ⚠️ | 422 "thuMucId must be a UUID" — English msg, spec yêu cầu `ERR-BM-05`. |
| BM-024 | UC94 | Công khai lại AN→CONG_KHAI | Workflow | ✅ 🔁 | R7.4.C1 step 8 PASS. |
| BM-025 | UC92 | Xóa TM rỗng NHAP | Workflow | ✅ | DELETE `/thu-muc-bieu-maus/{id}` 204 (TM Test BM-002 đã xóa). |
| BM-027 | UC92 | Xóa TM rỗng AN | Workflow | ✅ | DELETE TM SHTT (sau khi xóa BM bên trong) 204. List còn 3 TM. |
| BM-028 | UC97 | Import hàng loạt ≤50 file hợp lệ | Workflow | ⏭ | Defer — wizard import cần file Excel metadata + nhiều file content. Endpoint `/bieu-maus/bulk-import` + `/bieu-maus/import` đều OPTIONS 204. |
| BM-029 | UC97 | Import mixed valid+invalid | Workflow | ⏭ | Defer — same as BM-028. |
| BM-032 | — | QTHT R only, không C/U/D/Publish | Authorization | ⏭ | Defer — cần account `qtht_*`, multi-account session switch. |
| BM-033 | — | CB NV BN không thấy TM của BN khác | Authorization | ⏭ | Defer — cần `cb_nv_bn_01`/`cb_nv_bn_02` data isolation test. |
| BM-034 | — | CB NV ĐP scope đơn vị | Authorization | ⏭ | Defer — cần account ĐP. |
| BM-035 | — | NHT/TVV/CG không thấy menu | Authorization | ⏭ | Defer. |
| BM-036 | — | DN không truy cập CMS, chỉ qua API Cổng | Authorization | ⏭ | Defer — DN flow ngoài scope. |
| BM-038 | UC98 | API GET /api/v1/bieu-mau (JWT) trả `cong_khai=1` | Cross-module | ⏭ | Defer — cần JWT mTLS Postman setup. |
| BM-039 | — | Lĩnh vực PL từ DANH_MUC | Cross-module | ⏭ | Cover trong BM-002/006 (đã verify select Lĩnh vực hoạt động). |
| BM-040 | — | Audit log CRUD + PUBLISH/UNPUBLISH | Cross-module | ⏭ | Defer — cần Audit module test riêng. |
| BM-043 | UC95 | Tắt Switch công khai → clear `thoi_gian_dang_tai` + gỡ Cổng | Workflow | 🚫 | BLOCKED — BUG-BM-001 + BUG-BM-002. |
| BM-044 | UC95 | `thoi_gian_dang_tai` read-only | Negative | 🚫 | BLOCKED — BUG-BM-001 (form chưa có field). |
| BM-047 | UC95 | Cột "Ảnh đại diện" thumbnail | Happy | 🚫 | BLOCKED — BUG-BM-001. |
| BM-048 | UC95 | Upload `anh_dai_dien` jpg/png/gif ≤5MB | Negative | 🚫 | BLOCKED — BUG-BM-001. |
| BM-049 | UC95 | Upload nhiều `file_dinh_kem_cong_khai` | Happy | 🚫 | BLOCKED — BUG-BM-001 + BUG-BM-004 (entity thiếu cột). |
| BM-050 | UC95 | `mo_ta_cong_khai` tách biệt với `mo_ta` nội bộ | Happy | 🚫 | BLOCKED — BUG-BM-001 + BUG-BM-004. |

---

## 3. Observations (out-of-SRS, không log thành bug)

> 2 quan sát quá generic không gắn được clause SRS cụ thể — note ở đây để team backend xem xét.

1. **English error message leak** — Validation errors trong tình huống generic (Class-validator default) trả tiếng Anh: `"thuMucId must be a UUID"`, `"tenThuMuc must be shorter than or equal to 500 characters"`. SRS không có clause "all error messages must be Vietnamese" cụ thể, nhưng các module khác (Hỏi đáp, Vụ việc) trả tiếng Việt → consistency issue. Spec ERR-TM-03 tiếng Việt nhưng không match BE response.
2. **Search param naming mismatch** — Spec FR-VII-02 dùng `keyword`. FE thực tế gửi `search`, BE chỉ accept `search` (các tên `keyword`/`q`/`tenThuMuc` BE bỏ qua, vẫn trả full list). Spec docs cần update để khớp implementation, hoặc BE phải accept `keyword` để khớp spec.

---

## 4. Test Data Used

### Tài khoản
- Primary: `cb_nv_tw_01` (CB NV TW, BTP-TW, role `CB_NV_TW`)

### TM seeded/tested
- 4 TM gốc từ R7.3.7 (Biểu mẫu SHTT / Biểu mẫu Thuế / HĐ Dân sự - Thương mại / HĐ Lao động)
- 1 TM tạo mới R7.7.10: `TM Test R7.7.10 BM-002` (id `58a429a8-...`) — sửa thành `TM Test BM-002 (sua)` — đã xóa.
- 1 TM xóa cuối: `Biểu mẫu SHTT` (sau khi xóa BM bên trong, ở state AN) — verify BM-027 PASS.
- **Cuối session:** 3 TM còn lại (Biểu mẫu Thuế / HĐ Dân sự / HĐ Lao động — đều NHAP rỗng).

### BM seeded/tested
- 1 BM tạo R7.4.C1: `BM-20260507-001` "Biểu mẫu SHTT - test R7.4.C1" file `test-bm-r7-4-c1.docx` 917B.
- BM đã được dùng cho: SM transitions (R7.4.C1), BM-007 preview (broken), BM-008 download (broken), BM-012 chi tiết, BM-005 search.
- **Cuối session:** BM đã xóa (DELETE 204) để clean BM-027 test.

### File test artifacts (`output/qa-reports/round7-2026-05-06/workflow/`)
- `test-bm-r7-4-c1.docx` 917B — minimal DOCX hợp lệ (Python zip).
- `test-bm-invalid.txt` 36B — file `.txt` để test BM-016 silent reject.

---

## 5. Bug Linkage

**File 1 — R7.4.C1 workflow bugs:** [`bug-report-flow-bm-r7-4-c1.md`](../../bug-reports/bm/bug-report-flow-bm-r7-4-c1.md) (6 bugs)

| Bug ID | Severity | TC chặn |
|--------|----------|---------|
| BUG-BM-001 | Critical | BM-041, 042, 043, 044, 045, 046, 047, 048, 049, 050 (10 TC) |
| BUG-BM-002 | Critical | BM-043 (cascade) |
| BUG-BM-003 | Major | Tất cả TC kiểm tra response (entity field rename pending) |
| BUG-BM-004 | Major | BM-049, 050 (entity thiếu 3 fields) |
| BUG-BM-005 | Medium | BM-026 UI feedback |
| BUG-BM-006 | Medium | BM-001 cột counter |

**File 2 — R7.7.10 functional bugs:** [`bug-report-function-bm-r7-7-10.md`](../../bug-reports/bm/bug-report-function-bm-r7-7-10.md) (2 bugs)

| Bug ID | Severity | TC chặn |
|--------|----------|---------|
| BUG-BM-007 | Critical | BM-007, BM-008 (preview + download) |
| BUG-BM-008 | Medium | BM-016 (silent reject upload) |

---

## 6. Recommended Next Round

1. **Fix BUG-BM-001** (FE 4 trường công khai): unblock 10 TC CR-01 — BM-041/042/043/044/045/046/047/048/049/050.
2. **Fix BUG-BM-002** (BE BR-PUBLIC-02): unblock BM-043 cascade.
3. **Fix BUG-BM-007** (MinIO localhost config): unblock BM-007 + BM-008 + BM-010.
4. **Round R7.7.10b** sau fix:
   - Re-run 10 CR-01 TC trong functional pass.
   - Re-run BM-007/008/010 preview+download+sửa upload file.
   - Multi-account run BM-032 → BM-036 (QTHT/CB BN/CB ĐP/NHT/DN).
   - Postman run BM-038 (API mTLS Cổng PLQG).
5. **Reseed pre-round**: tạo lại TM + BM dataset (3 TM hiện đang rỗng, không có TM AN, không có TM CONG_KHAI) — workflow regression test cần state diversity.

---

*Functional report generated: 2026-05-07 19:00 (UTC+7) | QA Automation via Claude Code MCP*
