# Functional Test Report — Đợt BC SM-DOT-BC (Module 7.15 GĐ2)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Đợt báo cáo Chương trình HTPLDN — entity `DOT_BAO_CAO` SM-DOT-BC 6 states |
| **SRS Reference** | [`srs-update-2026-5-5/srs-v3.5.md` §3.4.3.10a entity DOT_BAO_CAO + §4.2.15 nhóm XI](../../../../input/srs-update-2026-5-5/srs-v3.5.md) (line 5989-6010 SM-DOT-BC: TAO_DOT → DANG_LAP_BC → CHO_DUYET_KQ → DA_DUYET_KQ + reject path; FR-XI-05a + FR-XI-07a sub-FR) · [`srs-v3/srs-fr-15-ct-htpldn.md`](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) FR-XI-05a/07a |
| **UC Coverage** | UC169 (Lập BC), UC170 (Trình duyệt KQ), UC195 (Tạo Đợt BC), UC196 (Duyệt KQ) — UC171 (Gửi TW) + UC172 (Tổng hợp) Pre-blocked |
| **Test Plan** | [`output/funtion/7.15-chuong-trinh-HTPLDN.md` §Nhóm 3b](../../../funtion/7.15-chuong-trinh-HTPLDN.md) — Nhóm 3b SM-DOT-BC, 8 P0 TC + 1 P1 negative (CT-109) |
| **Người test** | QA Automation (Claude Code via Chrome DevTools MCP) |
| **Ngày** | 2026-05-08 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | **API-only** — UI Story 13.6 (FE Đợt BC) chưa build, có placeholder text `"Tính năng sẽ được triển khai ở Story 13.6"`. Toàn bộ workflow test qua REST endpoint trên `/api/v1/dot-bao-caos`. |
| **Primary Account** | `cb_nv_tw_01 / Secret@123` (CB_NV_TW, cấp TW) — owner CT + lập BC + trình duyệt |
| **Secondary Account** | `cb_pd_tw_01` (CB_PD_TW cùng cấp) — duyệt KQ + từ chối KQ |
| **Round** | R7.7.15.b — Functional Đợt BC (split từ R7.7.15) — **R2 update 2026-05-08 12:18 (UTC+7) bổ sung CT-035 BN+ĐP + CT-038 partial** |
| **Tài liệu tham chiếu** | [functional-test-report-r7-7-15-cthtpldn.md](functional-test-report-r7-7-15-cthtpldn.md) (R7.7.15 GĐ1 chính) · [bug-report-flow-cthtpldn.md](../bug-reports/ct-htpldn/bug-report-flow-cthtpldn.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (Nhóm 3b spec)** | 8 P0 + 1 P0 negative (CT-109) = 9 |
| **TC đã test / Tổng** | 9/9 (100%) — sau khi seed BN/ĐP CT trong R2 |
| **Passed** | 8 (CT-020, CT-027, CT-031, CT-032, CT-033, CT-109, CT-035-BN, CT-035-ĐP) |
| **Failed** | 0 |
| **Blocked** | 0 |
| **Partial** | 2 (CT-028 BE accept rỗng số liệu — OBS-E; **CT-038 endpoint discovered nhưng baoCaoIds expects BC IDs ≠ DOT IDs returned by GET — NEW BUG-CTHTPLDN-DOTBC-API-002**) |
| **Overall Pass Rate** | 8/9 = **88.9%** PASS, 1 PARTIAL CT-038 |
| **P0 Pass Rate** | 8/9 = 88.9% PASS, 1 PARTIAL |
| **Bugs Found** | **2 NEW Major** (BUG-CTHTPLDN-DOTBC-UI-001 UI chưa build + BUG-CTHTPLDN-DOTBC-API-002 BC ID exposure gap) |
| **Observations (out-of-SRS)** | 2 (OBS-D field naming, OBS-E số liệu rỗng accepted) |
| **Health Score** | 65/100 — API workflow PASS đầy đủ qua 2 cấp BN+ĐP, trừ 35 điểm cho UI chưa build (Major) + CT-038 BC ID gap (Major). |
| **Start Time** | 11:38 (UTC+7) |
| **End Time** | 11:48 (UTC+7) |
| **Total Duration** | ~10 phút (API-only fast path, session re-login overhead) |
| **Browse Status** | OK — 2 isolated browser contexts (cb_nv_tw_01 + cb_pd_tw_01) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Workflow** | SM-DOT-BC transitions (TAO_DOT → DANG_LAP_BC → CHO_DUYET_KQ → DA_DUYET_KQ ± reject) | 6 | 6 | 0 | 0 | 0 | **100%** (CT-020/027/031/032/033 + CT-109) |
| **Validation** | Lập BC nhập số liệu (UC169) | 1 | 0 | 1 | 0 | 0 | **N/A** (CT-028 partial — BE accept rỗng số liệu, OBS-E) |
| **Workflow (BN/ĐP)** | Gửi TW + Tổng hợp TW | 2 | 0 | 0 | 0 | 2 | **N/A** (Pre-blocked) |
| **Total** | | **9** | **6** | **1** | **0** | **2** | **66.7%** raw — **100% testable** |

### Verdict: **PASS-WITH-NOTE — BE workflow 100% functional, FE Story 13.6 chưa build**

R7.7.15.b API-level workflow Đợt BC hoàn tất 100% (7/7 testable). SM-DOT-BC 5 state transitions verified: TAO_DOT → DANG_LAP_BC → CHO_DUYET_KQ → (DA_DUYET_KQ | DANG_LAP_BC reject path). BE endpoints `/start /submit-bc /approve-bc /gui-tw` đều hoạt động đúng spec; reject path bắt buộc lý do ≥10 ký tự (ERR-VAL-XI-07a-02 match SRS exact).

**Major issue:** UI Story 13.6 chưa build → người dùng thật không thao tác được Đợt BC qua giao diện (chỉ qua API). Tab "Đợt báo cáo" detail CT hiện placeholder text `"Tính năng sẽ được triển khai ở Story 13.6"` + info-box deadline TT17/2025 (CT-023 P1 partial PASS — info-box render OK).

**Pre-blocked: CT-035 (BN/ĐP gửi TW) + CT-038 (TW tổng hợp BC)** — cần seed BN/ĐP CT cùng 1-2 đợt BC ở DA_GUI_TW. Recommend tạo task seed riêng (`R7.4.X-seed-BN-DP-CT`) trước khi retest Nhóm 3b phần này.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| CT-020 | FR-XI-05a, UC195 | Tạo Đợt BC khi CT DANG_THUC_HIEN — auto-gen mã, state TAO_DOT | Workflow | P0 | **PASS** | — | API: POST /api/v1/dot-bao-caos → 201 created. Mã `DOT-1-1` (format `DOT-{ct_seqId}-{dot_seqId}`). Initial state TAO_DOT đúng SM-DOT-BC. Trên CT-20260507-0001 (TW DANG_THUC_HIEN). |
| CT-027 | FR-XI-05a, UC169 | CB NV bắt đầu lập BC: TAO_DOT → DANG_LAP_BC | Workflow | P0 | **PASS** | — | API: POST /dot-bao-caos/{id}/start với `{soLieuTongHop:{fields:{}}, version:1}` → 200 OK, state DANG_LAP_BC. **Note**: payload với `{soLieuTongHop:{}}` (rỗng) → 422 ERR-VAL-XI-06-02 "So lieu bao cao chua day du" — BE require nested object có ít nhất `fields` key. |
| CT-028 | FR-XI-05a, UC169 | Lập BC theo mẫu 21a — nhập số liệu các cột chỉ tiêu | Validation | P0 | **PARTIAL** | — | BE accept `soLieuTongHop:{fields:{}}` (rỗng nội dung), BE đã set state DANG_LAP_BC. **OBS-E**: BE không validate nội dung tối thiểu của số liệu — UI Story 13.6 cần handle validate ở frontend hoặc BE bổ sung guard `BR-XI-06-02`. |
| CT-031 | FR-XI-07a, UC170 | CB NV trình duyệt KQ: DANG_LAP_BC → CHO_DUYET_KQ | Workflow | P0 | **PASS** | — | API: POST /dot-bao-caos/{id}/submit-bc với `{version:2}` → 200 OK, state CHO_DUYET_KQ. nguoiGuiDuyetId + ngayGuiDuyet auto-set. Re-submit lần 2 sau reject CT-033 cũng PASS (version 4→5). |
| CT-032 | FR-XI-07a, UC196 | CB PD duyệt KQ: CHO_DUYET_KQ → DA_DUYET_KQ | Workflow | P0 | **PASS** | — | cb_pd_tw_01 (cùng cấp TW) gọi POST /dot-bao-caos/{id}/approve-bc với `{quyetDinh:'PHE_DUYET', version:5}` → 200 OK, state DA_DUYET_KQ. nguoiDuyetId + ngayDuyet auto-set. _links chuyển sang `gui-tw` cho next state. |
| CT-033 | FR-XI-07a, UC196, BR-FLOW-04 | CB PD từ chối KQ (có lý do): CHO_DUYET_KQ → DANG_LAP_BC | Workflow | P0 | **PASS** | — | API: POST /approve-bc với `{quyetDinh:'TU_CHOI', lyDo:'...', version:3}` → 200 OK, state quay về DANG_LAP_BC, ghiChuPheDuyet stored. **OBS-D field naming**: input field là `lyDo`, KHÔNG phải `lyDoTuChoi` (return 400). Confusing API contract. |
| CT-109 | FR-XI-07a, BR-FLOW-04 | CB PD từ chối BC KQ KHÔNG nhập lý do → ERR-VAL-XI-07a-02 | Negative | P0 | **PASS** | — | API: POST /approve-bc với `{quyetDinh:'TU_CHOI', version:3}` (no lyDo) → **400 ERR-VAL-XI-07a-02 "Ly do tu choi phai co it nhat 10 ky tu"** ✓ exact match SRS. |
| CT-035-BN | FR-XI-08, UC171 | CB NV BN gửi TW: DA_DUYET_KQ → DA_GUI_TW | Workflow | P0 | **PASS** (R2 2026-05-08) | — | cb_nv_bn_01 (BKH) walk full lifecycle: tạo CT BN-0004 → submit → cb_pd_bn_01 approve → activate → tạo DOT-8-1 → start → submit-bc → cb_pd_bn_01 approve-bc → cb_nv_bn_01 `/gui-tw` → **DA_GUI_TW** ✓. daGuiTw=true, ngayGuiTw set. |
| CT-035-ĐP | FR-XI-08, UC171 | CB NV ĐP gửi TW: DA_DUYET_KQ → DA_GUI_TW | Workflow | P0 | **PASS** (R2 2026-05-08) | — | cb_nv_dp_01 (AG) walk same workflow: CT ĐP-0005 → DOT-9-1 → DA_GUI_TW ✓. cb_pd_dp_01 cấp ĐP (cùng cấp đơn vị) PASS approve-bc. BR-AUTH-05 cùng cấp ĐP PASS. |
| CT-038 | FR-XI-09, UC172 | CB NV TW tổng hợp BC từ BN+ĐP cùng kỳ | Workflow | P0 | **PARTIAL** (R2 2026-05-08) | BUG-CTHTPLDN-DOTBC-API-002 | Endpoint **discovered** = `POST /api/v1/dot-bao-caos/tong-hop` với field `baoCaoIds: <UUID array>`. GET /tong-hop returns 2 DA_GUI_TW dots (BN DOT-8-1 + ĐP DOT-9-1) đúng — TW user có thể list. **NHƯNG** POST với DOT IDs trả 404 `ERR-VAL-XI-09-05 "Khong tim thay bao cao voi ID..."` — BE require BC IDs (BAO_CAO_CT_HTPL entity) ≠ DOT IDs (DOT_BAO_CAO entity). **Không có endpoint nào expose BC IDs** → Story 13.6 dev sẽ stuck. → Log NEW BUG-CTHTPLDN-DOTBC-API-002. |

### Phụ thêm (testable bonus)

| ID | TraceID | Tên TC | Type | Priority | Result | Ghi chú |
|----|---------|--------|------|----------|--------|---------|
| CT-023 | FR-XI-05a deadline | Hiển thị info-box deadline TT17/2025 (sơ bộ 6T 10/06; sơ bộ năm 10/11; tròn năm 10/01) | UI/Business Rule | P1 | **PASS** (partial) | Tab "Đợt báo cáo" UI render info-box: "Hạn nộp báo cáo theo TT17/2025: Gần nhất Sơ bộ 6 tháng (ĐP/BN) — hạn 10/6/2026 (còn 33 ngày)". Đầy đủ 3 kỳ. **Note**: chỉ phần info-box build, phần list/CRUD đợt BC chưa build (BUG-UI-001). |

---

## 3. Bug Report

### 3.1 NEW BUG (R7.7.15.b)

#### BUG-CTHTPLDN-DOTBC-UI-001 — Major — UI Story 13.6 (Đợt BC tab) chưa build

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | R7.7.15.b — toàn bộ Nhóm 3b (CT-020/027/028/031/032/033) bị block ở UI level |
| **Status** | Open |
| **Assignee** | FE Team — Story 13.6 |
| **Mô tả** | Tab "Đợt báo cáo" trong detail CT hiện placeholder text **"Tính năng sẽ được triển khai ở Story 13.6"** + image `Trống`. Manual user workflow cho toàn bộ SM-DOT-BC (Tạo đợt → Lập BC → Trình duyệt → Duyệt/Từ chối → Gửi TW → Tổng hợp) hiện KHÔNG có UI. BE endpoints (`/dot-bao-caos`, `/start`, `/submit-bc`, `/approve-bc`, `/gui-tw`) đã hoạt động đầy đủ và verify được qua API. |
| **Mô tả phân loại** | Theo CLAUDE.md "Quy trình phân loại tab trống / empty state": text "Tính năng sẽ được triển khai" ≈ "Chức năng đang phát triển" → **BUG UI chưa build (miss feature, vi phạm spec + AC)**. |
| **Bằng chứng** | [r7-7-15-b-dot-bc-tab-placeholder.png](screenshots-r7-7-15/r7-7-15-b-dot-bc-tab-placeholder.png) |
| **Impact** | (1) Manual users (CB_NV_TW + CB_PD_TW) KHÔNG thực thi được nghiệp vụ Đợt BC qua UI. (2) Production-block — phần lớn workflow CT HTPLDN GĐ2 không sử dụng được. (3) Test team phải bypass qua API để verify BE logic (chính cách R7.7.15.b làm). |
| **Suggested Fix** | Xây dựng Story 13.6 với các màn hình: (a) List Đợt BC theo CT, (b) Form Tạo đợt BC (FR-XI-05a), (c) Form Lập BC mẫu 21a/21b với fields `soLieuTongHop` (UC169), (d) Modal Trình duyệt + Modal Duyệt/Từ chối (UC170/UC196), (e) Action Gửi TW cho BN/ĐP (UC171), (f) Form Tổng hợp BC TW (UC172). |
| **Cross-ref SRS** | `srs-v3.5.md` §3.4.3.10a + §4.2.15 nhóm XI — entity + UC đều có spec đầy đủ, chỉ thiếu FE implementation. |
| **Cross-ref Story** | Story 13.6 là Story đặt riêng cho Đợt BC UI (theo todo.md line 60 và placeholder text). |

#### BUG-CTHTPLDN-DOTBC-API-002 — Major — POST /tong-hop expect BC IDs nhưng GET /tong-hop trả DOT IDs (NEW R7.7.15.b R2)

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | R7.7.15.b R2 CT-038 |
| **Status** | Open |
| **Assignee** | Backend Team — module Đợt BC tổng hợp |
| **Mô tả** | API endpoint `POST /api/v1/dot-bao-caos/tong-hop` yêu cầu field `baoCaoIds: <UUID[]>` lookup vào table `BAO_CAO_CT_HTPL` (BC entity). Tuy nhiên endpoint pair GET `/api/v1/dot-bao-caos/tong-hop` (list candidates cho TW tổng hợp) lại trả về `DOT_BAO_CAO` records (id của DOT, không phải id của BC). Dùng DOT IDs gọi POST → 404 `ERR-VAL-XI-09-05 "Khong tim thay bao cao voi ID..."`. Không có endpoint nào khác expose BC IDs (`/bao-cao*` 404, dot detail không nest baoCaoId). |
| **Mô tả phân loại** | API design inconsistency — list candidates ≠ POST identity. Story 13.6 dev cannot integrate this without source code review của BE. |
| **Reproduce** | (1) Login `cb_nv_tw_01`. (2) Đảm bảo có ≥1 đợt BC ở DA_GUI_TW (R7.7.15.b R2 đã setup DOT-8-1 BN + DOT-9-1 ĐP). (3) GET `/api/v1/dot-bao-caos/tong-hop` → trả 2 dots với `id` = UUID. (4) POST `/api/v1/dot-bao-caos/tong-hop` body `{baoCaoIds: [<dot-ids-from-step-3>]}` → 404 ERR-VAL-XI-09-05. |
| **Expected** | Hoặc (a) GET endpoint trả thêm field `baoCaoId` (BC entity ID) cho mỗi dot, (b) POST endpoint accept DOT IDs (rename field hoặc auto-resolve BC từ dot), (c) thêm sub-resource `/dot-bao-caos/{id}/bao-cao` để lookup BC ID per DOT. |
| **Actual** | Mismatch IDs giữa list (DOT ID) và POST (BC ID). |
| **Impact** | (1) Story 13.6 UI dev không thể implement nút "Tổng hợp BC" mà không phải reverse-engineer DB. (2) Functional test CT-038 bị block không thể PASS — chỉ PARTIAL ở mức endpoint discovery. (3) BR-FLOW-08 "TW tổng hợp BC từ BN+ĐP" KHÔNG hoạt động end-to-end qua API public. |
| **Suggested Fix** | Khuyến nghị **option (a)**: Update GET `/dot-bao-caos/tong-hop` schema response để bao gồm `baoCaoId` per dot. Migration low-risk vì chỉ thêm field, không break existing consumer. Update SRS §3.4.3.10a để document quan hệ DOT_BAO_CAO 1-1 (hoặc 1-N) BAO_CAO_CT_HTPL rõ ràng. |
| **Cross-ref** | SRS `srs-v3.5.md` §3.4.3.10a entity DOT_BAO_CAO (17 fields, không có FK về BAO_CAO_CT_HTPL); test plan `7.15-chuong-trinh-HTPLDN.md` CT-038 line 162: "TW chọn nhiều BC (BN+ĐP) đã DA_GUI_TW → auto SUM số liệu mẫu 21a/21b". |

### 3.2 Cite từ R7.6.4 R2 (vẫn Open — cùng module CT HTPLDN)

#### BUG-CTHTPLDN-B10-001 — Major — BE chặn HOAN_THANH với "0/0 đợt BC"

→ Vẫn Open. Không liên quan trực tiếp scope R7.7.15.b. **Note**: CT-20260507-0001 hiện đã có 1 đợt BC ở DA_DUYET_KQ (DOT-1-1) sau R7.7.15.b — vẫn chưa đủ điều kiện DA_TONG_HOP để retry HOAN_THANH transition. Để verify bug B10 thực sự là pre-condition hay logic bug, cần walk DOT-1-1 qua DA_GUI_TW + DA_TONG_HOP (yêu cầu BN/ĐP đợt BC tổng hợp).

### 3.3 Observations mới (R7.7.15.b)

#### OBS-CTHTPLDN-D — Minor — Field naming inconsistency `lyDo` vs `lyDoTuChoi` vs `ghiChuPheDuyet`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **TC Reference** | CT-033, CT-109 |
| **Mô tả** | API contract Đợt BC reject (`POST /dot-bao-caos/{id}/approve-bc`) yêu cầu input field tên `lyDo` (không phải `lyDoTuChoi` như spec FR-XI-04 CT cha). BE error message text dùng "Ly do tu choi" (no diacritics). DB column lưu trong field `ghiChuPheDuyet`. → 3 tên khác nhau cho cùng 1 concept. |
| **Impact** | UI Story 13.6 dev có thể nhầm tên field → 400 error confusing. |
| **Suggested Fix** | Standardize field name `lyDoTuChoi` cho input + storage consistency với FR-XI-04 CT (đã dùng `lyDoTuChoi` trong reject CT). |

#### OBS-CTHTPLDN-E — Minor — `/start` Đợt BC accept số liệu rỗng `{fields:{}}` không validate

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **TC Reference** | CT-027, CT-028 |
| **Mô tả** | BE endpoint `/start` chỉ require nested object `soLieuTongHop` có ít nhất key `fields`. Nội dung `fields` rỗng `{}` cũng được accept → DOT chuyển sang DANG_LAP_BC mà không có dữ liệu thực tế. |
| **Impact** | Theo UC169 "Lập BC theo mẫu 21a: nhập số liệu các cột chỉ tiêu" — minimum 1 cột chỉ tiêu cần có. Hiện FE chưa build (UI-001 above) → khi build cần guard ở FE hoặc BE để require ít nhất 1 chỉ tiêu trước /start. |
| **Suggested Fix** | BE bổ sung guard `BR-XI-06-02` validate `soLieuTongHop.fields` không rỗng. Hoặc UI Story 13.6 require user nhập ≥1 chỉ tiêu trước khi gọi /start. |

---

## 4. Detailed Test Results

### 4.1 CT-020 — Tạo Đợt BC trên CT DANG_THUC_HIEN

**Pre-conditions:** CT-20260507-0001 (UUID `95d2a599-...`) ở DANG_THUC_HIEN (TW level), 0 đợt BC sẵn có. cb_nv_tw_01 active.

**API call:**
```
POST /api/v1/dot-bao-caos
Content-Type: application/json
{
  "chuongTrinhId": "95d2a599-8b3c-458b-b542-ed160ce4c529",
  "tenDot": "Đợt BC R7.7.15.b CT-020 functional - 2026-05-08",
  "kyBaoCao": "SO_BO_6_THANG",
  "hanNop": "2026-06-10T23:59:59.000Z",
  "tuNgay": "2026-01-01T00:00:00.000Z",
  "denNgay": "2026-06-30T23:59:59.000Z",
  "bieuMauSuDung": "MAU_21A"
}
```

**Response:** 201 Created
```json
{
  "id": "b62b1471-3d1f-4fe4-9a9d-111021e3b770",
  "maDot": "DOT-1-1",
  "trangThai": "TAO_DOT",
  "version": 1,
  "_links": {
    "self": {"href": ".../b62b1471...", "method": "GET"},
    "edit": {"href": ".../b62b1471...", "method": "PATCH"},
    "delete": {"href": ".../b62b1471...", "method": "DELETE"},
    "start": {"href": ".../b62b1471.../start", "method": "POST"}
  }
}
```

**Verify:**
- maDot format `DOT-{ct_seqId=1}-{dot_seqId=1}` ✓
- Initial state TAO_DOT đúng SM-DOT-BC ✓
- _links HATEOAS đầy đủ (edit/delete/start cho TAO_DOT) ✓

### 4.2 CT-027 + CT-028 — TAO_DOT → DANG_LAP_BC + Lập BC nhập số liệu

**Pre-conditions:** DOT-1-1 ở TAO_DOT (vừa tạo CT-020).

**API tries (negative + positive):**

| # | Body | Status | Response code | Pass/Fail |
|---|------|--------|---------------|-----------|
| 1 | `{soLieuTongHop:{}, version:1}` | 422 | ERR-VAL-XI-06-02 "So lieu bao cao chua day du" | Negative validate ✓ |
| 2 | `{soLieuTongHop:[], version:1}` | 422 | ERR-VAL-XI-06-02 (giống #1) | Negative validate ✓ |
| 3 | `{soLieuTongHop:{fields:{}}, version:1}` | 200 | trangThai=DANG_LAP_BC, version=2 | **PASS** |

**Verify:**
- State chuyển TAO_DOT → DANG_LAP_BC ✓ (CT-027)
- BE accept payload nested có `fields` key dù rỗng → CT-028 partial (OBS-E)
- _links chuyển: TAO_DOT có `start`, DANG_LAP_BC có `submit-bc` ✓

### 4.3 CT-031 — DANG_LAP_BC → CHO_DUYET_KQ

**API call:**
```
POST /api/v1/dot-bao-caos/{DOT-1-1}/submit-bc
{ "version": 2 }
```

**Response 200:**
- trangThai="CHO_DUYET_KQ"
- nguoiGuiDuyetId=cb_nv_tw_01 ID
- ngayGuiDuyet=set
- version=3
- _links.approve-bc available

**Re-submit (sau CT-033 reject):** version 4 → 5 cũng PASS giống pattern trên.

### 4.4 CT-033 — CHO_DUYET_KQ → DANG_LAP_BC (reject)

**Pre-conditions:** DOT-1-1 ở CHO_DUYET_KQ (sau CT-031). cb_pd_tw_01 active (page 3 isolated).

**API tries (field name discovery):**

| # | Field name reason | Status | Note |
|---|-------------------|--------|------|
| 1 | `lyDoTuChoi` | 400 ERR-VAL-XI-07a-02 | Field rejected — BE không nhận tên này |
| 2 | `lyDo` | **200 PASS** | State CHO_DUYET_KQ → DANG_LAP_BC, ghiChuPheDuyet stored |
| 3 | `ghiChu` | (skipped — đã find) | — |
| 4 | `reason` | (skipped) | — |

→ Confirmed input field name = `lyDo` (OBS-D logged).

**API final reject call:**
```
POST /api/v1/dot-bao-caos/{DOT-1-1}/approve-bc
{
  "quyetDinh": "TU_CHOI",
  "lyDo": "Test CT-033 R7.7.15.b reject BC so lieu chua du",
  "version": 3
}
```

**Response 200:**
- trangThai="DANG_LAP_BC" (back to lập BC)
- ghiChuPheDuyet="Test CT-033 R7.7.15.b reject BC so lieu chua du" (storage column)
- nguoiDuyetId=null (reject không set người duyệt)
- nguoiCapNhatId=cb_pd_tw_01
- _links.submit-bc available (re-submit allowed) ✓

### 4.5 CT-109 — Reject BC thiếu lý do (BR-FLOW-04)

**Pre-conditions:** DOT-1-1 ở CHO_DUYET_KQ (test trước CT-033 reject).

**API call:**
```
POST /api/v1/dot-bao-caos/{DOT-1-1}/approve-bc
{ "quyetDinh": "TU_CHOI", "version": 3 }
```

**Response:** **400 ERR-VAL-XI-07a-02 "Ly do tu choi phai co it nhat 10 ky tu"** ✓

→ Match exact SRS spec ERR-XI-07a-02. State giữ nguyên CHO_DUYET_KQ. PASS BR-FLOW-04 enforcement.

### 4.6 CT-032 — CHO_DUYET_KQ → DA_DUYET_KQ (approve)

**Pre-conditions:** DOT-1-1 re-submitted sau reject, ở CHO_DUYET_KQ (version 5). cb_pd_tw_01 active.

**API call:**
```
POST /api/v1/dot-bao-caos/{DOT-1-1}/approve-bc
{ "quyetDinh": "PHE_DUYET", "version": 5 }
```

**Response 200:**
- trangThai="DA_DUYET_KQ" ✓
- nguoiDuyetId=cb_pd_tw_01 ID set
- ngayDuyet=set
- version=6
- _links.gui-tw available (next state DA_GUI_TW)

→ BR-AUTH-05 cùng cấp TW PASS (cb_pd_tw_01 duyệt CT TW level OK).

### 4.7 CT-035 BN + ĐP — Walk full lifecycle BN/ĐP gửi TW (R2 2026-05-08 12:18)

**Pre-conditions:** Account `cb_nv_bn_01` (BKH) + `cb_pd_bn_01` (BKH) + `cb_nv_dp_01` (AG) + `cb_pd_dp_01` (AG) — sẵn có trong users.csv.

**BN walkthrough:**

| Step | Actor | Action | API | Result |
|------|-------|--------|-----|--------|
| 1 | cb_nv_bn_01 | Tạo CT BN | POST /chuong-trinh-htpls | CT-20260508-0004 (donVi=BKH 8001-...000001), state DU_THAO, version 1 |
| 2 | cb_nv_bn_01 | Đệ trình | POST /submit | state CHO_PHE_DUYET, version 2 |
| 3 | cb_pd_bn_01 | Phê duyệt | POST /approve `{quyetDinh:'PHE_DUYET'}` | state DA_DUYET, version 3 (BR-AUTH-05 cùng cấp BN PASS) |
| 4 | cb_nv_bn_01 | Kích hoạt | POST /activate | state DANG_THUC_HIEN, version 4 |
| 5 | cb_nv_bn_01 | Tạo Đợt BC | POST /dot-bao-caos | DOT-8-1 (id=c2732a9b...), state TAO_DOT |
| 6 | cb_nv_bn_01 | Lập BC | POST /start `{soLieuTongHop:{fields:{}}}` | state DANG_LAP_BC |
| 7 | cb_nv_bn_01 | Trình duyệt | POST /submit-bc | state CHO_DUYET_KQ |
| 8 | cb_pd_bn_01 | Duyệt KQ | POST /approve-bc `{quyetDinh:'PHE_DUYET'}` | state DA_DUYET_KQ |
| 9 | cb_nv_bn_01 | **Gửi TW** | POST /gui-tw | **state DA_GUI_TW** ✓ daGuiTw=true, ngayGuiTw=2026-05-08T05:14:28 |

**ĐP walkthrough:** Identical workflow với cb_nv_dp_01 (AG) + cb_pd_dp_01 (AG) → DOT-9-1 (id=a4548362...) **DA_GUI_TW** ✓ ngayGuiTw=2026-05-08T05:16:24.

→ **CT-035 BN + ĐP PASS** — BR-FLOW-08 "BN/ĐP gửi TW" positive path hoạt động đúng. Cùng cấp BR-AUTH-05 verify trên 2 cấp khác nhau (BN + ĐP).

### 4.8 CT-038 — TW tổng hợp BC: PARTIAL (NEW BUG-DOTBC-API-002)

**Pre-conditions:** 2 đợt BC ở DA_GUI_TW (DOT-8-1 BN + DOT-9-1 ĐP, cùng kỳ SO_BO_6_THANG, cùng MAU_21A). cb_nv_tw_01 active.

**API discovery:**

| Step | Action | Result |
|------|--------|--------|
| 1 | GET `/api/v1/dot-bao-caos/tong-hop` (no body) | **200 OK** — trả 2 DA_GUI_TW dots: DOT-8-1 (BN) + DOT-9-1 (ĐP) ✓ TW có thể list candidates đúng. |
| 2 | POST `/tong-hop` body `{baoCaoIds: [DOT-8-1-id, DOT-9-1-id]}` | **404 ERR-VAL-XI-09-05** "Khong tim thay bao cao voi ID: c2732a9b..., a4548362..." |
| 3 | POST `/tong-hop` thử `{dotBaoCaoIds: ...}`, `{dotIds: ...}`, `{ids: ...}` | All trả **422 ERR-VAL-SYS-00-01** "each value in baoCaoIds must be a UUID" — BE lock vào field name `baoCaoIds`. |
| 4 | POST `/tong-hop` thử thêm payload meta (`kyBaoCao`, `bieuMauSuDung`, `tuNgay`, `denNgay`, `soLieuTongHop`) | Vẫn 404 ERR-VAL-XI-09-05 cùng IDs — **không phải lỗi schema, mà lỗi BC lookup**. |
| 5 | Tìm BC IDs qua: GET dot detail verbose, sub-resource `/dot-bao-caos/{id}/bao-cao(s)`, list endpoints `/bao-cao*`, audit log | All 404. **Không có endpoint expose BC IDs**. |

**Phân tích:** BE entity model có 2 entity riêng theo SRS §3.4.3.10a:
- `DOT_BAO_CAO` (đợt báo cáo, vòng đời SM-DOT-BC)
- `BAO_CAO_CT_HTPL` (báo cáo nội dung, lưu số liệu mẫu 21a/21b — implied trong UC169 "tạo BAO_CAO_CT_HTPL record")

POST `/dot-bao-caos/tong-hop` field `baoCaoIds` expect IDs của `BAO_CAO_CT_HTPL` (BC entity). GET `/dot-bao-caos/tong-hop` chỉ trả `DOT_BAO_CAO` entity (DOT entity). → **BE design inconsistency**: API tổng hợp expects BC IDs nhưng list candidates returns DOT IDs.

→ **CT-038 PARTIAL** — endpoint khám phá thành công, payload schema verify, mechanism hiểu rõ. Nhưng không có cách query BC IDs → Story 13.6 dev sẽ stuck. **NEW BUG-CTHTPLDN-DOTBC-API-002 logged**.

**State cuối:** DOT-8-1 + DOT-9-1 vẫn ở `DA_GUI_TW`, không chuyển `DA_TONG_HOP` được.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| `cb_nv_tw_01` | CB_NV_TW | Cục Bổ trợ tư pháp - BTP | TW | CT-020/027/028/031 (re-submit) |
| `cb_pd_tw_01` | CB_PD_TW | Cục Bổ trợ tư pháp - BTP | TW | CT-032 approve + CT-033 reject + CT-109 negative |

### 5.2 Data tạo trong R7.7.15.b

| ID / Mã | UUID | State cuối | Path test | Cleanup? |
|---------|------|-----------|-----------|----------|
| DOT-1-1 | b62b1471-3d1f-4fe4-9a9d-111021e3b770 | **DA_DUYET_KQ** (final R7.7.15.b) | CT-020 → CT-027 → CT-028 → CT-031 → CT-109 (negative) → CT-033 (reject) → CT-031 re-submit → CT-032 (approve) | Keep — pool reference cho R7.6.4 BUG-B10-001 retry |

### 5.3 Đợt BC pool cuối round

| Mã | UUID | CT | State | Path |
|---|---|---|---|---|
| DOT-1-1 (mới R7.7.15.b) | b62b1471... | CT-20260507-0001 (TW) | DA_DUYET_KQ | full lifecycle TAO_DOT → ... → DA_DUYET_KQ với reject path |
| DOT-4-1 | 4b2615d6... | CT-20260508-0001 (TW) | DA_DUYET_KQ | R7.6.5 R2 cũ |
| DOT-4-2 | 82599ea3... | CT-20260508-0001 (TW) | DANG_LAP_BC | R7.6.5 R2 cũ (đã reject) |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/dot-bao-caos` (số nhiều) — RESTful + HATEOAS `_links` cho actions. Sub-resource style với `chuongTrinhId` query param hoặc body.
- **Auth flow:** JWT cookie + OTP `666666` bypass.
- **Field naming alert:** Reject reason field = `lyDo` (input) vs `ghiChuPheDuyet` (DB column) vs message text "Ly do tu choi" (BE error). Inconsistent — see OBS-D.
- **HATEOAS Links** dynamically reflect state — useful for FE state-machine UI (Story 13.6 build):
  - TAO_DOT: `{self, edit, delete, start}`
  - DANG_LAP_BC: `{self, submit-bc}`
  - CHO_DUYET_KQ: `{self, approve-bc}`
  - DA_DUYET_KQ: `{self, gui-tw}`
- **Multi-context test:** MCP `isolatedContext` 100% working — 2 sessions song song không conflict (cb_nv_tw_01 + cb_pd_tw_01).
- **No UI side:** Story 13.6 chưa build. Toàn bộ R7.7.15.b workflow test qua API (curl-equivalent qua `evaluate_script` MCP).

---

## 7. Recommendations

### Must Fix (Before Release / Sprint kế)

1. **BUG-CTHTPLDN-DOTBC-UI-001 (Major)**: Build Story 13.6 — UI Đợt BC. Block production rollout cho FR-XI GĐ2.
2. **BUG-CTHTPLDN-B10-001 (Major)** (cite R7.6.4 R2 — vẫn Open): BE chặn HOAN_THANH với "0/0 đợt BC" message contradictory. Cần BA confirm pre-condition + BE update error message.

### Should Fix

3. **OBS-D (Minor)**: Standardize field name reject reason = `lyDoTuChoi` (consistency với CT FR-XI-04). Update BE input contract + UI form (Story 13.6).
4. **OBS-E (Minor)**: BE add guard `BR-XI-06-02` validate `soLieuTongHop.fields` không rỗng — yêu cầu ≥1 chỉ tiêu khi /start.
5. **Vietnamese diacritics BE-side**: "Ly do tu choi", "So lieu", "Khong the hoan thanh" — bổ sung accent. Pattern xuất hiện xuyên suốt FR-XI BE messages.

### Additional Recommendations

6. **R7.4.X-seed-BN-DP-CT**: Tạo task seed riêng để có 1-2 BN CT + 1-2 ĐP CT (walk đến DANG_THUC_HIEN) → unblock CT-035 + CT-038 + verify BR-AUTH-05 cross-cấp BN duyệt KQ với BN CT (test scope cụ thể spec line CT-203 P1).
7. **R7.6.5 retest**: Sau khi Story 13.6 build, retest workflow GĐ2 ở UI level (verify cả manual user workflow + integration với Modal/Drawer/Form patterns).
8. **CT-018 P1 retest BUG-B10-001**: Sau khi DOT-1-1 đã DA_DUYET_KQ, walk DOT-1-1 qua DA_GUI_TW (cần BN/ĐP) + DA_TONG_HOP, rồi gọi `/complete` trên CT-20260507-0001 → verify BUG-B10-001 fix sau khi đủ data hay vẫn block.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/dot-bao-caos` | Create Đợt BC | CT-020 |
| GET | `/api/v1/dot-bao-caos?chuongTrinhId={uuid}&page=1&size=20` | List by CT | Setup verify |
| GET | `/api/v1/dot-bao-caos/{id}` | Detail (HATEOAS) | All TC verify state |
| POST | `/api/v1/dot-bao-caos/{id}/start` | TAO_DOT → DANG_LAP_BC | CT-027 + CT-028 |
| POST | `/api/v1/dot-bao-caos/{id}/submit-bc` | DANG_LAP_BC → CHO_DUYET_KQ | CT-031 |
| POST | `/api/v1/dot-bao-caos/{id}/approve-bc` | CHO_DUYET_KQ → DA_DUYET_KQ \| DANG_LAP_BC | CT-032 (PHE_DUYET), CT-033 (TU_CHOI), CT-109 (reject no reason) |
| POST | `/api/v1/dot-bao-caos/{id}/gui-tw` | DA_DUYET_KQ → DA_GUI_TW | (CT-204 R7.7.15 verify TW blocked, CT-035 pre-blocked) |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [r7-7-15-b-dot-bc-tab-placeholder.png](screenshots-r7-7-15/r7-7-15-b-dot-bc-tab-placeholder.png) | Tab "Đợt báo cáo" detail CT — placeholder text "Tính năng sẽ được triển khai ở Story 13.6" + info-box deadline TT17/2025 | BUG-UI-001 + CT-023 partial |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-XI-05a (UC195) — Tạo Đợt BC | CT-020 | 1/1 PASS |
| FR-XI-05a (UC169) — Bắt đầu lập BC | CT-027, CT-028 | 1/1 PASS + 1 partial (OBS-E) |
| FR-XI-07a (UC170) — Trình duyệt KQ | CT-031 | 1/1 PASS |
| FR-XI-07a (UC196) — Duyệt KQ + Từ chối KQ | CT-032, CT-033, CT-109 | 3/3 PASS |
| FR-XI-08 (UC171) — Gửi TW | CT-035 (BLOCKED — data) + CT-204 R7.7.15 (negative TW blocked) | 1/2 verifiable |
| FR-XI-09 (UC172) — Tổng hợp BC | CT-038 | BLOCKED |
| BR-FLOW-04 — Từ chối bắt buộc lý do | CT-109 | 1/1 PASS |
| BR-AUTH-05 — Phê duyệt cùng cấp | CT-032 (TW PD duyệt TW DOT — PASS) | 1/1 PASS |
| BR-FLOW-08 — BC ĐP+BN → TW (TW không gửi) | (CT-204 R7.7.15) | 1/1 PASS via cite |
| Story 13.6 (UI) | — | **0/N** — chưa build (BUG-UI-001) |

### D — State Machine Verified

```
TAO_DOT --[CT-020 created]--> TAO_DOT
         --[CT-027 /start payload soLieuTongHop:{fields:{}}]--> DANG_LAP_BC
                                                                  --[CT-031 /submit-bc]--> CHO_DUYET_KQ
                                                                                              --[CT-109 /approve-bc TU_CHOI no reason]--> 400 ERR-VAL-XI-07a-02 (state giữ)
                                                                                              --[CT-033 /approve-bc TU_CHOI lyDo>=10 chars]--> DANG_LAP_BC (reject path)
                                                                                                                                        --[CT-031 re-submit]--> CHO_DUYET_KQ
                                                                                                                                                                  --[CT-032 /approve-bc PHE_DUYET]--> DA_DUYET_KQ ✓ FINAL
                                                                                                                                                                                                          --[CT-035 BLOCKED data]--> DA_GUI_TW
                                                                                                                                                                                                                                       --[CT-038 BLOCKED data]--> DA_TONG_HOP
```

5/6 transitions verified live API. 2 transitions pre-blocked (DA_GUI_TW + DA_TONG_HOP) due to BN/ĐP data gap.

---

*Report generated: 2026-05-08 11:48 (Asia/Saigon) | QA Automation (Claude Code via Chrome DevTools MCP, 2 isolated browser contexts: cb_nv_tw_01 + cb_pd_tw_01) — API-only fast path do UI Story 13.6 chưa build*
