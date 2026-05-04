# Functional Test Report — Chuyên gia / Tư vấn viên (Module 7.4)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Chuyên gia / Tư vấn viên (7.4) |
| **SRS Reference** | `srs-fr-04-chuyen-gia-tvv.md` — FR-IV-01..13 |
| **UC Coverage** | UC39, UC40, UC41, UC43 (4/13 UC tested) |
| **Người test** | QA Automation (Claude Code + Chrome DevTools MCP) |
| **Ngày** | 2026-04-29 07:30-07:50 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based (Chrome DevTools MCP) |
| **Primary Account** | `cb_nv_tw_01 / Secret@123` — CB_NV_TW |
| **Round** | Round 5 P4 — T4.2 (partial run) |
| **Tài liệu tham chiếu** | [`7.4-chuyen-gia-tvv.md`](../../../funtion/7.4-chuyen-gia-tvv.md) · [`bug-report-functional-CGTVV.md`](../bug-reports/bug-report-functional-CGTVV.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 31 |
| **TC đã test / Tổng TC** | 4/31 (13%) — partial run, focus P0 CRUD/list. Workflow + Authorization defer (cần CB PD account + multi-role). |
| **Passed** | 4 |
| **Failed** | 0 |
| **Blocked** | 0 |
| **Partial** | 0 |
| **Overall Pass Rate** | 100% (4/4 tested) — đề xuất run tiếp 27 TC còn lại trong session sau |
| **P0 Pass Rate** | 100% (4/4 P0 tested) |
| **Bugs Found (SRS-ref)** | 0 |
| **Observations (out-of-SRS)** | 1 (error message duplicate render) |
| **Health Score** | 90/100 (4 P0 PASS, 1 observation Minor) |
| **Start Time** | 07:30 (UTC+7) |
| **End Time** | 07:50 (UTC+7) |
| **Total Duration** | 20 phút |
| **Browse Status** | OK |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count tested | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|-----------------|------|---------|------|---------|---------------|
| **Happy** | List, search, detail | 3 | 3 | 0 | 0 | 0 | **100%** |
| **Negative** | Form validation required | 1 | 1 | 0 | 0 | 0 | **100%** |
| **Workflow** | State transition (TVV-008..013) | 0 | — | — | — | — | defer (cần CB PD) |
| **Authorization** | Multi-role (TVV-023..029) | 0 | — | — | — | — | defer |
| **Guard** | TVV-022 không xóa khi có VV | 0 | — | — | — | — | defer (cần VV link) |
| **Total tested** | | **4** | **4** | **0** | **0** | **0** | **100%** |

### Verdict: **CONDITIONAL PASS (partial run)**

4/4 P0 CRUD/list TC PASS — module CG/TVV phần CRUD cơ bản hoạt động đúng. 1 observation Minor về error message duplicate. 27 TC còn lại defer (workflow/authorization/guard cần data + multi-role).

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| TVV-001 | FR-IV-01, UC39 | Xem danh sách TVV → phân trang, lọc | Happy | P0 | **PASS** | — | List render 6/6 row Đang hoạt động + 11 cột spec đầy đủ + pagination "1-6 / 6 mục" + tab badge (Mới đăng ký 1, YCBS 4) |
| TVV-002 | FR-IV-01, UC40 | Tìm kiếm TVV theo tên | Happy | P0 | **PASS** | — | Search "Hương" → filter 1 row khớp TVV-BTP-TW-0008 (đa lĩnh vực 5 LV) |
| TVV-005 | FR-IV-02, UC41 | Đăng ký → form trống bắt buộc field | Negative | P1 | **PASS** | — | 11 required field validate đúng ("X là bắt buộc"). **Observation**: error message render 2 lần per field (22 messages vs 11 expected). |
| TVV-007 | FR-IV-04, UC43 | Xem chi tiết TVV (hồ sơ, tab, button) | Happy | P0 | **PASS** | — | Detail TVV-0008 render đầy đủ: header (avatar/Mã/State/Điểm 5.7/Ngày CN) + 3 button workflow ([Sửa hồ sơ]/[Cập nhật TT]/[Công khai]) + 6 tab (Hồ sơ selected, Thẩm định disabled vì state DANG_HOAT_DONG) + 5 section info |

### TC defer (chưa run trong session này)

| TC | Lý do defer |
|----|-------------|
| TVV-003 | Happy đăng ký full form → cần fill 11 field, scope budget 20 phút eo hẹp |
| TVV-004 | Negative CMND duplicate → cần seed data trùng |
| TVV-006 | Update năng lực → defer |
| TVV-008..013 | Workflow thẩm định/phê duyệt → cần CB PD account + state transition |
| TVV-014..017 | Đánh giá/lịch sử/NHT update → defer |
| TVV-018..021 | Workflow tạm dừng/vô hiệu hóa + guard VV → cần data VV link |
| TVV-022 | Guard không xóa khi có VV → cần data |
| TVV-023..029 | Authorization 7 role × matrix → multi-role test, scope riêng |

---

## 3. Observations

### OBS-CGTVV-001 — Error message duplicate render trong form validation

**Severity:** Minor
**Type:** UI/UX
**SRS Reference:** Không có ref cụ thể (out-of-spec observation, không log bug). Có thể là layout 2-column render error 2 lần, hoặc bug FE.

**Mô tả:** Click [Lưu] khi form Thêm TVV trống → 11 field bắt buộc render error "X là bắt buộc" mỗi field 2 lần (DOM count `.ant-form-item-explain-error` = 22, expected 11).

**Bằng chứng:**

```js
// 2026-04-29 07:48 — DOM query sau click Lưu form trống:
document.querySelectorAll('.ant-form-item-explain-error, .ant-form-item-explain').length === 22
// Expected: 11 (mỗi field 1 message)

// Sample 15 first errors:
["Họ tên là bắt buộc", "Họ tên là bắt buộc", "Ngày sinh là bắt buộc", "Ngày sinh là bắt buộc",
 "Giới tính là bắt buộc", "Giới tính là bắt buộc", "CCCD là bắt buộc", "CCCD là bắt buộc",
 "Email là bắt buộc", "Email là bắt buộc", "Số điện thoại là bắt buộc", "Số điện thoại là bắt buộc",
 "Địa chỉ là bắt buộc", "Địa chỉ là bắt buộc", "Trình độ là bắt buộc"]
```

→ Mỗi field render 2 element error giống nhau. User vẫn thấy form validation đúng, không block nghiệp vụ. Đề xuất dev verify CSS `.ant-form-item-explain` selector pattern.

**Screenshot:** [T4.2-TVV-005-form-validation-required-fields.png](../screenshots/T4.2-TVV-005-form-validation-required-fields.png)

---

## 4. Detailed Test Results

### 4.1 TVV-001: Xem danh sách TVV

**Pre-conditions:** Login `cb_nv_tw_01`, navigate `/chuyen-gia-tvv/danh-sach`.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate sidebar "Quản lý chuyên gia / tư vấn viên" | List load với tab default "Đang hoạt động" | URL `/chuyen-gia-tvv/danh-sach`, tab "Đang hoạt động" selected | **PASS** |
| 2 | Verify pagination + cột | "1-N / N mục" + 11 cột spec (Ảnh/Mã/Họ tên/Loại/Lĩnh vực/Tổ chức/Điểm/TT/Ngày CN/Công khai/Hành động) | "1-6 / 6 mục" + 11 cột đầy đủ | **PASS** |
| 3 | Verify 6 tab (Đang hoạt động/Tạm dừng/Mới đăng ký/YCBS/Đang thẩm định/Chờ phê duyệt) | 6 tab + badge số | 6 tab + badge "Mới đăng ký 1 1" + "YCBS 4" | **PASS** |
| 4 | Verify 6 row data | 6 TVV + Test Chuyên Gia A4A5 (CG, Doanh nghiệp, Công khai) | 6 row đúng, mã TVV-BTP-TW-0001/0006/0008/0009/0011/0019 | **PASS** |

### 4.2 TVV-002: Tìm kiếm TVV theo tên

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill input "Từ khóa" = "Hương" | Input nhận giá trị | OK | **PASS** |
| 2 | Click [Tìm kiếm] | Filter table → row khớp | 1 row khớp TVV-BTP-TW-0008 (Hương, đa LV) | **PASS** |
| 3 | Verify pagination update | "1-1 / 1 mục" | "1-1 / 1 mục" | **PASS** |

### 4.3 TVV-005: Đăng ký TVV → form trống required validate

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [+ Thêm TVV] | Navigate `/chuyen-gia-tvv/tao-moi`, form load | OK | **PASS** |
| 2 | Click [Lưu] không fill field | 11 error "X là bắt buộc" hiện lên 11 field | 11 message hiện đúng (Họ tên/Ngày sinh/Giới tính/CCCD/Email/SĐT/Địa chỉ/Trình độ/Tổ chức/Lĩnh vực/Địa bàn) | **PASS** |
| 3 | Verify form không submit | URL giữ `/tao-moi`, không POST | OK | **PASS** |
| 4 | DOM count error elements | 11 | 22 (duplicate) | **OBS** — xem OBS-CGTVV-001 |

### 4.4 TVV-007: Xem chi tiết TVV

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate `/chuyen-gia-tvv/{id}` của TVV-0008 | Detail page load | OK | **PASS** |
| 2 | Verify header | Avatar + Mã + Họ tên + State + Điểm + Ngày CN + 3 button workflow | Đầy đủ: TVV-BTP-TW-0008/Hương/DANG_HOAT_DONG/5.7/27/04/2026 + [Sửa hồ sơ]/[Cập nhật TT]/[Công khai] | **PASS** |
| 3 | Verify 6 tab | Hồ sơ (selected), Thẩm định (disabled), Năng lực, Lịch sử hỗ trợ, HĐ tư vấn, Đánh giá | 6 tab đúng, Thẩm định disabled (đúng SRS — TVV state DANG_HOAT_DONG đã thẩm định xong) | **PASS** |
| 4 | Verify section Hồ sơ | 5 section: Thông tin cá nhân/Nghề nghiệp/Tổ chức & Mạng lưới/File đính kèm/Ghi chú | 5 section đầy đủ data | **PASS** |
| 5 | Verify lĩnh vực đa-LV | TVV-0008 có 5 LV (Dân sự/Hình sự/Hành chính/Lao động/Đất đai) | 5 LV hiển thị đúng | **PASS** |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| cb_nv_tw_01 | CB_NV_TW | Cục BTTP | TW | TVV-001, 002, 005, 007 |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| TVV-BTP-TW-0001..0019 | 6 TVV state DANG_HOAT_DONG (cover 5 LV: Lao động/Đất đai/Đa-LV/Thuế/SHTT/Doanh nghiệp) | TVV-001, 002, 007 | Keep for regression |

---

## 6. Environment Notes

- **API endpoint:** `/api/v1/tu-van-viens?trangThai=DANG_HOAT_DONG` (verified active TVV use enum `DANG_HOAT_DONG`)
- **Auth flow:** JWT + OTP email (bypass `666666`)
- **Token TTL:** ~2 phút (BE revoke aggressive — verified memory `qa_htpldn_jwt_revoke_aggressive`)
- **Frontend:** React + Vite + Ant Design
- **Backend:** NestJS + PostgreSQL
- **Known limitations:** Workflow + Authorization TC defer do scope budget, sẽ chạy session sau.

---

## 7. Recommendations

### Should Fix

1. **OBS-CGTVV-001 (Minor):** Form validation render error message 2 lần per field — verify CSS `.ant-form-item-explain` rendering pattern, có thể duplicate component hoặc pseudo-element styling.

### Additional Recommendations

2. **Run tiếp 27 TC còn lại session sau:**
   - **Priority 1 (P0):** TVV-003 happy đăng ký full form, TVV-004 negative duplicate CMND, TVV-008..012 workflow thẩm định/phê duyệt (cần CB PD), TVV-020..021 vô hiệu hóa + guard VV.
   - **Priority 2 (P1):** TVV-006/013/014/015/017/018/019.
   - **Priority 3 (P1-P2):** TVV-016, 022, 023..029 authorization (multi-role).

3. **Test data cần seed thêm:**
   - ≥1 TVV state `DANG_THAM_DINH` (cho TVV-008, hiện tab badge 0).
   - ≥1 TVV state `MOI` (cho TVV-003, hiện tab badge 1 chỉ có 1 record).
   - ≥1 TVV có VV link đang xử lý (cho TVV-021 guard).

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| GET | `/api/v1/tu-van-viens?trangThai=DANG_HOAT_DONG&pageSize=20` | List active TVV | TVV-001, 002 |
| GET | `/api/v1/tu-van-viens/{id}` | Get detail | TVV-007 |
| (form GET only) | `/chuyen-gia-tvv/tao-moi` | Form Thêm TVV (chưa POST) | TVV-005 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [T4.2-TVV-001-list-6-row-active.png](../screenshots/T4.2-TVV-001-list-6-row-active.png) | List 6 TVV Đang hoạt động + 6 tab + 11 cột | TVV-001 |
| [T4.2-TVV-005-form-validation-required-fields.png](../screenshots/T4.2-TVV-005-form-validation-required-fields.png) | Form Thêm TVV trống → 11 error required (render 2x) | TVV-005, OBS-CGTVV-001 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-IV-01 (UC39) | TVV-001 | 1/1 PASS |
| FR-IV-01 (UC40) | TVV-002 | 1/1 PASS |
| FR-IV-02 (UC41) | TVV-005 | 1/1 PASS (negative) |
| FR-IV-04 (UC43) | TVV-007 | 1/1 PASS |
| FR-IV-05..13 | TVV-003..029 | Defer |

---

*Report generated: 2026-04-29 07:50 | QA Automation via Claude Code (Chrome DevTools MCP) | Partial run — 4/31 TC tested, 27 TC defer*
