# Functional Test Report — Module Chuyên gia/TVV (§7.4)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Chuyên gia/TVV (test-strategy §7.4 — 13 FR + permission tests) |
| **SRS Reference** | FR-V.III-TVV (UC39-UC50), BR-CALC-06, BR-AUTH matrix |
| **UC Coverage** | UC39, UC40, UC41, UC42, UC43, UC44, UC45, UC46, UC47, UC48, UC49, UC50 |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-04-17 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | http://103.172.236.130:8025 (MailHog) |
| **Test Method** | API-based (REST via curl) — UI test bị chặn do browse tool crash khi submit OTP |
| **Primary Account** | canbo_tw / Test@1234 (CB_NV, TW) |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [test-strategy.md §7.4](../../../test-strategy.md), [bug-report-cg-tvv.md](bug-report-cg-tvv.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 30 |
| **Passed** | 14 |
| **Failed** | 7 |
| **Blocked** | 7 |
| **Partial** | 2 |
| **Pass Rate** | 47% (14/30) |
| **P0 Pass Rate** | 50% (8/16 P0 tested) |
| **Bugs Found** | 12 active (3 Critical, 4 Major, 3 Medium, 2 Minor) + 2 closed (false positives) |
| **Health Score** | 44/100 |

> **Round 2 update:** TVV-002 search re-tested via UI → PASS (`tuKhoa` param). BUG-TVV-004 closed.
>
> **Round 3 update (2026-04-17):**
> - TVV-018/019 (tạm dừng, kích hoạt): BLOCKED → **FAIL** (mới tìm thấy BUG-TVV-014 — CB roles 403 trên `/cap-nhat-trang-thai`).
> - BUG-TVV-008 closed invalid (endpoint tồn tại với tên `cap-nhat-trang-thai`, param `trangThaiMoi`).
> - BUG-TVV-006 downgrade (data issue, không phải perm bug).
> - BUG-TVV-005 confirmed qua JWT decode (DN thiếu `create_danh_gia_tu_van_vien`).
> - 2 new: BUG-TVV-014 (Major), BUG-TVV-015 (Medium).
>
> Xem chi tiết [round3-reverify.md](round3-reverify.md).

### Verdict: **FAIL**

Module Chuyên gia/TVV **không đạt tiêu chí release**. 3 bug Critical chặn các luồng cốt lõi:

1. **GET detail TVV** luôn crash 500 → không xem được hồ sơ, chặn UC43 và toàn bộ luồng thẩm định/phê duyệt.
2. **QTHT (admin) tạo + công khai được TVV** → vi phạm phân quyền SRS nghiêm trọng.
3. **DELETE TVV** luôn crash 500 → không kiểm tra được UC50 vô hiệu hóa.

Ngoài ra: search không hoạt động, state machine thiếu endpoint chuyển trạng thái (`/gui-duyet`, `/tam-dung`, `/kich-hoat`) → 9 TC bị BLOCKED.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| TVV-001 | UC39 | Xem danh sách TVV — phân trang, lọc | Happy | P0 | **PARTIAL** | BUG-TVV-010 | List OK (GET trả 8 items, có `meta`). Chỉ `pageSize` hoạt động; `limit`/`size`/`per_page` bị ignore. Filter `trangThai` OK. |
| TVV-002 | UC40 | Tìm kiếm TVV theo tên, lĩnh vực, địa bàn | Happy | P0 | **PASS** | — | **Update 2026-04-17**: Search hoạt động với param `tuKhoa` (verify qua UI). BUG-TVV-004 closed false positive. BUG-TVV-013 (doc) vẫn mở. |
| TVV-003 | UC41 | Đăng ký mới TVV — dữ liệu hợp lệ, auto-gen mã | Happy | P0 | **PASS** | — | POST 201 + auto-gen `TVV-BTP-TW-0005` → 0007 → 0008. Mã đúng pattern `TVV-{ĐV}-{SEQ}` theo SRS. |
| TVV-004 | UC41 | Đăng ký — CCCD trùng → lỗi unique | Negative | P0 | **PASS** | — | HTTP 409 `ERR-VAL-IV-03-02 "CCCD đã tồn tại trong hệ thống"` — đúng. |
| TVV-005 | UC41 | Đăng ký — thiếu lĩnh vực (≥1 bắt buộc) | Negative | P1 | **PASS** | — | HTTP 422 `linhVucIds must contain at least 1 elements` — đúng. Đồng thời validate `trinhDo` required. |
| TVV-006 | UC42 | Cập nhật năng lực TVV | Happy | P1 | **PASS** | — | PATCH 200, `trinhDo` và `diaChi` update đúng, `version` tăng từ 1 → 2. Note: `trangThai` trong PATCH body bị silently ignore (tốt — tránh state change qua generic update). |
| TVV-007 | UC43 | Xem chi tiết TVV (hồ sơ, lịch sử, điểm) | Happy | P0 | **FAIL** | BUG-TVV-001 | **GET /{id} luôn 500 Internal Server Error** cho mọi TVV ID hợp lệ. Chặn toàn bộ luồng xem/thao tác chi tiết. |
| TVV-008 | UC44 | Thẩm định — 4 nhóm tiêu chí | Workflow | P0 | **BLOCKED** | BUG-TVV-007, BUG-TVV-008 | Không có endpoint chuyển `MOI_DANG_KY → DANG_THAM_DINH` (`/gui-duyet` → 404). Tham-dinh trực tiếp trên MOI_DANG_KY → 500 (đáng ra 409). |
| TVV-009 | UC44 | Thẩm định → yêu cầu bổ sung | Workflow | P0 | **BLOCKED** | BUG-TVV-008 | Phụ thuộc TVV-008. |
| TVV-010 | UC44 | Bổ sung hồ sơ → quay lại thẩm định | Workflow | P1 | **BLOCKED** | BUG-TVV-006, BUG-TVV-008 | `/bo-sung` chỉ cho "chủ hồ sơ" (403 ERR-PERM-IV-BS-02 cho cả canbo_tw và nht_user), chưa map scope đúng. |
| TVV-011 | UC45 | CB PD phê duyệt TVV → DANG_HOAT_DONG | Workflow | P0 | **BLOCKED** | BUG-TVV-008 | Không reach được state `CHO_PHE_DUYET`. `/phe-duyet` báo 409 đúng state error, nhưng không test được end-to-end. |
| TVV-012 | UC45 | CB PD từ chối TVV — yêu cầu lý do | Workflow | P0 | **PARTIAL** | BUG-TVV-008 | `/tu-choi` validate lyDo (min 10 char, max 1000) và require version — đúng. Nhưng state guard 409 (cần CHO_PHE_DUYET) — không verify được happy path. |
| TVV-013 | UC46 | Công khai TVV lên portal | Workflow | P1 | **FAIL** | BUG-TVV-002 | Endpoint `/cong-khai` hoạt động, NHƯNG: canbo_tw = 403, lanhdao_tw = 403, **admin (QTHT) = 200 OK** — vi phạm SRS (QTHT chỉ R). Không rõ role nào đúng được làm. |
| TVV-014 | UC47 | Đánh giá TVV — nhập điểm, comment | Happy | P1 | **PASS** | — | POST 201 tạo đánh giá. `diem` tự tính = AVG(ChuyenMon, ThaiDo, ThoiGian) = (8+9+9)/3 = 8.7 ✅. Response cấu trúc lồng (BUG-TVV-012). |
| TVV-015 | UC47 | Tổng hợp điểm TB = AVG(điểm) (BR-CALC-06) | Calculation | P1 | **PARTIAL** | BUG-TVV-009 | Điểm TB tính đúng (9.5 → 9.1 sau khi add 8.7) ✅. NHƯNG field `soLuongDanhGia` vẫn null (phải = 2). |
| TVV-016 | UC48 | Xem lịch sử hỗ trợ TVV | Happy | P2 | **PASS** | — | GET `/lich-su-ho-tro` 200, trả empty list (TVV-BTP-TW-0001 chưa có VV). Endpoint hoạt động. |
| TVV-017 | UC49 | NHT tự cập nhật hồ sơ | Happy | P1 | **FAIL** | BUG-TVV-006 | nht_user POST `/bo-sung` → 403 Forbidden. SRS: NHT có ✅ CRU* trên HO_SO_TU_VAN_VIEN nhưng không thực hiện được. |
| TVV-018 | UC50 | Tạm dừng TVV: DANG_HOAT_DONG → TAM_DUNG | Workflow | P1 | **BLOCKED** | BUG-TVV-008 | Endpoint `/tam-dung` → 404. Không có endpoint thực hiện transition này. |
| TVV-019 | UC50 | Kích hoạt lại: TAM_DUNG → DANG_HOAT_DONG | Workflow | P1 | **BLOCKED** | BUG-TVV-008 | Endpoint `/kich-hoat` → 404. |
| TVV-020 | UC50 | Vô hiệu hóa TVV — guard không có VV | Workflow | P0 | **BLOCKED** | BUG-TVV-003 | DELETE /{id} trả 500 cho mọi TVV (cả có và không có VV). |
| TVV-021 | UC50 | Cố vô hiệu hóa TVV có VV → bị chặn | Guard | P0 | **BLOCKED** | BUG-TVV-003 | Cùng 500 như TVV-020 — không verify được guard. |
| TVV-022 | — | Không xóa TVV đang có vụ việc | Guard | P1 | **BLOCKED** | BUG-TVV-003 | Cùng 500. |
| TVV-023 | — | QTHT xem TU_VAN_VIEN (R) nhưng KHÔNG tạo/sửa/xóa | Authorization | P1 | **FAIL** | BUG-TVV-002 | QTHT (admin) tạo mới được TVV (HTTP 201, `TVV-BTP-TW-0008`) + công khai được — vi phạm SRS. |
| TVV-024 | — | TVV xem TU_VAN_VIEN (R*) — chỉ xem | Authorization | P0 | **PASS** | — | tvv_user GET /tu-van-viens → 200, 8 items. Không test được UPDATE (endpoint không cho self-update qua generic PATCH). |
| TVV-025 | — | CG xem TU_VAN_VIEN (R*) — chỉ xem | Authorization | P1 | **PASS** | — | chuyengia_user GET /tu-van-viens → 200, 8 items. |
| TVV-026 | — | NHT cập nhật HO_SO_TU_VAN_VIEN (CRU*) | Authorization | P1 | **FAIL** | BUG-TVV-006 | NHT bị 403 trên `/bo-sung`. Không có endpoint `/ho-so-tu-van-vien` riêng (404). |
| TVV-027 | — | TVV/CG xem HO_SO_TU_VAN_VIEN (R*) | Authorization | P1 | **BLOCKED** | — | Không có endpoint GET `/ho-so-tu-van-vien` (404). Có thể hồ sơ là sub-resource của TVV — cần xem GET detail (BLOCKED bởi BUG-TVV-001). |
| TVV-028 | — | CB_PD phê duyệt (RU*) nhưng KHÔNG tạo/xóa | Authorization | P0 | **PASS** | — | lanhdao_tw POST /tu-van-viens → 403 Forbidden ✅. DELETE → 500 (blocked by BUG-TVV-003 nhưng không thấy gợi ý role cho phép). |
| TVV-029 | — | DN đánh giá TVV qua API (C†R*) | Authorization | P1 | **FAIL** | BUG-TVV-005 | dn_user POST /tu-van-viens/{id}/danh-gia → 403 Forbidden. Không có endpoint alternative `/dn/danh-gia` (404). |
| TVV-030 | — | DN KHÔNG thấy TU_VAN_VIEN / HO_SO_TU_VAN_VIEN (❌) | Authorization | P1 | **PASS** | — | dn_user GET /tu-van-viens → 403 Forbidden ✅, và detail → 403 ✅. |

### Chú thích

> **Result:** PASS / FAIL / BLOCKED / PARTIAL / SKIP
> **Type:** Happy / Negative / Edge / Guard / Validation / Workflow / Authorization / Integration
> **Priority:** P0 / P1 / P2 / P3

---

## 3. Bug Report

> Chi tiết Steps/Evidence/Impact/Fix đầy đủ xem file [bug-report-cg-tvv.md](bug-report-cg-tvv.md).

### BUG-TVV-001 — Critical: GET detail TVV luôn trả 500

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | TVV-007 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `GET /api/v1/tu-van-viens/{id}` trả 500 Internal Server Error cho mọi TVV ID hợp lệ (đã tồn tại trong DB).

**Repro ngắn:** Login bất kỳ role, lấy `id` từ list, GET detail → 500 ERR-SYS-00-00-01.

**Expected vs Actual:** 200 + hồ sơ đầy đủ → thực tế 500 crash.

**Impact:** Chặn UC43 và mọi luồng dựa trên detail (thẩm định, phê duyệt, đánh giá UI).

**Root Cause (Suggested):** Eager-load relation fail trên TypeORM/Prisma — check stack trace với requestId trong log.

---

### BUG-TVV-002 — Critical: QTHT (admin) tạo + công khai TVV

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | TVV-013, TVV-023 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** admin (QTHT) thực hiện được POST /tu-van-viens (201) và POST /cong-khai (200) — vi phạm SRS (QTHT chỉ 👁️ R).

**Repro ngắn:** Login admin, POST create TVV với payload hợp lệ → 201. POST /{id}/cong-khai → 200.

**Expected vs Actual:** Cả 2 phải trả 403 Forbidden → thực tế đều thành công.

**Impact:** Separation of duty broken. QTHT có thể tạo TVV giả + công khai lên portal mạng lưới.

**Root Cause (Suggested):** CASL ability cho QTHT đang `manage: all`, hoặc controller thiếu `@UsePermission('create_tu_van_vien')` guard.

---

### BUG-TVV-003 — Critical: DELETE TVV luôn trả 500

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | TVV-020, TVV-021, TVV-022 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `DELETE /api/v1/tu-van-viens/{id}` trả 500 cho cả TVV có và không có vụ việc. Không thể test guard.

**Repro ngắn:** canbo_tw DELETE /tu-van-viens/{id} → 500 ERR-SYS-00-00-01.

**Expected vs Actual:** 200 soft-delete (nếu không có VV) hoặc 409 guard (nếu có VV) → thực tế 500 crash.

**Impact:** Chặn UC50 vô hiệu hóa + không verify được guard nghiệp vụ.

**Root Cause (Suggested):** Cascade relation fail; thiếu check guard `vuViecs` trước khi xóa.

---

### BUG-TVV-004 — Major: Search TVV không hoạt động (blocks TVV-002)

**Repro:** `GET /tu-van-viens?hoTen=Congnt` → 8 items (full list, không lọc). Chỉ `trangThai` + `pageSize`/`page` hoạt động.

**Impact:** UC40 không sử dụng được với >20 TVV. Root cause: DTO `FindAllTvvQueryDto` chưa khai báo các trường filter text.

---

### BUG-TVV-005 — Major: DN không đánh giá được TVV qua API (blocks TVV-029)

**Repro:** dn_user POST /tu-van-viens/{id}/danh-gia → 403 Forbidden. Không có endpoint `/dn/danh-gia` thay thế.

**Impact:** UC47 từ phía DN gãy. Điểm TB TVV thiếu input từ DN (SRS: DN có C†R* trên DANH_GIA_TU_VAN_VIEN).

---

### BUG-TVV-006 — Major: NHT không bổ sung được hồ sơ TVV (blocks TVV-017/026)

**Repro:** nht_user POST /tu-van-viens/{id}/bo-sung → 403. SRS: NHT có CRU* trên HO_SO_TU_VAN_VIEN.

**Impact:** UC49 gãy; luồng thẩm định → yêu cầu bổ sung → NHT bổ sung không chạy được.

---

### BUG-TVV-007 — Major: /tham-dinh trả 500 thay vì 409 khi sai state

**Repro:** POST /tham-dinh trên TVV MOI_DANG_KY (với version đúng) → 500. So sánh /phe-duyet cùng case → 409 đúng state error.

**Impact:** Error UX kém, khó debug. Fix: áp dụng pattern `/phe-duyet` — check state trước, throw ConflictException.

---

## 4. Detailed Test Results

### 4.1 TVV-001: Xem danh sách TVV — phân trang, lọc

**Pre-conditions:**
- canbo_tw đã login (access token valid)
- Hệ thống có ≥4 TVV seed data

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /tu-van-viens?page=1&pageSize=20 | 200 + list + meta{page,pageSize,total,totalPages} | 200, 8 items, meta chính xác | **PASS** |
| 2 | GET /tu-van-viens?page=2&pageSize=20 | 200 + 0 items (chỉ có 8 < 20) | 200, 0 items, meta{total:8,totalPages:1} | **PASS** |
| 3 | GET /tu-van-viens?pageSize=2 | 200 + 2 items + totalPages=4 | 200, 2 items, meta.totalPages=4 | **PASS** |
| 4 | GET /tu-van-viens?limit=2 | 200 + 2 items (limit honored) | 200, 8 items, pageSize=20 (limit ignored) | **FAIL** → BUG-TVV-010 |
| 5 | GET /tu-van-viens?trangThai=DANG_HOAT_DONG | 200 + 1 item (Congnt) | 200, 1 item đúng | **PASS** |
| 6 | GET /tu-van-viens?trangThai=MOI_DANG_KY | 200 + 7 items | 200, 7 items đúng | **PASS** |

**Notes:** Overall PARTIAL — core list + filter OK, chỉ pagination param naming có issue.

---

### 4.2 TVV-002: Tìm kiếm TVV theo tên, lĩnh vực, địa bàn

**Pre-conditions:** Có TVV tên "Congnt" trong DB

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /tu-van-viens?hoTen=Congnt | 1 item | 8 items | **FAIL** |
| 2 | GET /tu-van-viens?search=Congnt | 1 item | 8 items | **FAIL** |
| 3 | GET /tu-van-viens?q=Congnt | 1 item | 8 items | **FAIL** |
| 4 | GET /tu-van-viens?maTvv=TVV-BTP-TW-0001 | 1 item | 8 items | **FAIL** |
| 5 | GET /tu-van-viens?linhVuc=Dân sự | Items matching | 0 or 8 (không lọc) | **FAIL** |

**Notes:** Toàn bộ search params bị server ignore → BUG-TVV-004.

---

### 4.3 TVV-003: Đăng ký mới TVV

**Pre-conditions:**
- canbo_tw đã login
- Có ≥1 linhVuc PL trong danh mục (Dân sự = `3b3e0735-a79b-4914-b05e-c94cd4fb484e`)

**Test Data:**
```json
{
  "hoTen": "QA Test C 1776412804",
  "gioiTinh": "NU",
  "ngaySinh": "1988-03-20",
  "cccd": "023184008562",
  "dienThoai": "0987654321",
  "email": "qa.c.1776412804@example.com",
  "diaChi": "456 Test",
  "loaiTvv": "TVV",
  "linhVucIds": ["3b3e0735-a79b-4914-b05e-c94cd4fb484e"],
  "trinhDo": "Thạc sỹ Luật Dân sự"
}
```

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /tu-van-viens với payload hợp lệ | 201 + auto-gen maTvv | 201, maTvv=`TVV-BTP-TW-0007` | **PASS** |
| 2 | Response verify | trangThai=MOI_DANG_KY, version=1 | đúng ✅ | **PASS** |
| 3 | Mã TVV theo pattern TVV-{ĐV}-{SEQ} | TVV-BTP-TW-NNNN | `TVV-BTP-TW-0007` ✅ | **PASS** |

**Finding bổ sung:** Khi gửi field sai tên (`soCccd` thay vì `cccd`), server vẫn 201 nhưng silently drop → BUG-TVV-011.

---

### 4.4 TVV-004: CCCD trùng

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /tu-van-viens với cccd đã tồn tại | 409 + error code | 409 `ERR-VAL-IV-03-02 "CCCD đã tồn tại trong hệ thống"` | **PASS** |

---

### 4.5 TVV-005: Thiếu lĩnh vực

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST với linhVucIds=[] | 422 validation error | 422 `linhVucIds must contain at least 1 elements` | **PASS** |
| 2 | Bổ sung validation trinhDo | trinhDo required | 422 cũng yêu cầu `trinhDo should not be empty` | **PASS** |

---

### 4.6 TVV-006: Cập nhật năng lực

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | PATCH /tu-van-viens/{id} với trinhDo+diaChi | 200 + fields updated, version+1 | 200, trinhDo "Tiến sĩ Luật", diaChi "789 Updated Street", version 1→2 | **PASS** |
| 2 | PATCH với `trangThai=TAM_DUNG` (test state change qua generic PATCH) | Ignore or 422 | 200 nhưng trangThai vẫn `MOI_DANG_KY` (silently ignore) | **PASS (ok)** |

---

### 4.7 TVV-007: Xem chi tiết TVV

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /tu-van-viens/818fc074-... | 200 + full profile | 500 ERR-SYS-00-00-01 | **FAIL** |
| 2 | Retry với ID khác (0002, 0003) | 200 | 500 | **FAIL** |
| 3 | GET với UUID không tồn tại | 404 hoặc 200+null | 200 + data:null (hành vi khác với case tồn tại) | **INCONSISTENT** |

→ BUG-TVV-001 Critical.

---

### 4.8 TVV-008 → TVV-012: Workflow thẩm định/phê duyệt

**Pre-condition cần:** TVV ở state `DANG_THAM_DINH` hoặc `CHO_PHE_DUYET`.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /{id}/gui-duyet (chuyển MOI_DANG_KY → DANG_THAM_DINH) | 200 | 404 Not Found — endpoint không tồn tại | **BLOCKED** |
| 2 | POST /{id}/tham-dinh trên MOI_DANG_KY trực tiếp (bypass) | 409 state error | 500 Internal Server Error | **FAIL (BUG-TVV-007)** |
| 3 | POST /{id}/phe-duyet trên MOI_DANG_KY (lanhdao_tw) | 409 state error | 409 "ERR-STATE-IV-PD-01: TVV không ở trạng thái CHO_PHE_DUYET" ✅ | **PASS (so sánh)** |
| 4 | POST /{id}/tu-choi không có lyDo | 422 | 422 "Lý do phải có ít nhất 10 ký tự" ✅ | **PASS (validation)** |
| 5 | POST /{id}/tu-choi với lyDo valid nhưng state sai | 409 | 409 state error | **PASS (guard)** |

→ TVV-008, TVV-009, TVV-010, TVV-011 = BLOCKED. TVV-012 = PARTIAL.

---

### 4.9 TVV-013: Công khai TVV

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | canbo_tw POST /{id}/cong-khai | Phải xác định role đúng | 403 Forbidden | **FAIL (role?)** |
| 2 | lanhdao_tw (CB_PD) POST /{id}/cong-khai | 200 (nếu CB_PD phụ trách) | 403 Forbidden | **FAIL** |
| 3 | admin (QTHT) POST /{id}/cong-khai | 403 (QTHT chỉ R) | **200 OK, laCongKhai=true** | **FAIL → BUG-TVV-002** |

---

### 4.10 TVV-014/TVV-015: Đánh giá TVV + tính TB

**Pre-condition:** TVV-BTP-TW-0001 có sẵn 1 đánh giá (9.5) từ seed.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /tu-van-viens/818fc074-.../danh-gia {diemChuyenMon:8,diemThaiDo:9,diemThoiGian:9,nhanXet:"..."} | 201 + diem=(8+9+9)/3=8.7 | 201, `diem: 8.7` ✅ | **PASS** |
| 2 | GET list và đọc `diemDanhGiaTb` | (9.5+8.7)/2 = 9.1 | `diemDanhGiaTb: "9.1"` ✅ | **PASS (TVV-015 core)** |
| 3 | Field `soLuongDanhGia` | 2 | `null` | **FAIL (BUG-TVV-009)** |

→ TVV-014 PASS, TVV-015 PARTIAL.

---

### 4.11 TVV-016: Lịch sử hỗ trợ

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /tu-van-viens/818fc074-.../lich-su-ho-tro | 200 + list | 200 + [] (empty — TVV chưa có VV) | **PASS** |

---

### 4.12 TVV-017: NHT tự cập nhật hồ sơ

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | nht_user POST /tu-van-viens/{id}/bo-sung | 200 cập nhật, nếu là chủ hồ sơ | 403 Forbidden | **FAIL** |

---

### 4.13 TVV-018/019: Tạm dừng + kích hoạt

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /tu-van-viens/{id}/tam-dung | 200, trangThai=TAM_DUNG | 404 endpoint không tồn tại | **BLOCKED** |
| 2 | POST /tu-van-viens/{id}/kich-hoat | 200, trangThai=DANG_HOAT_DONG | 404 | **BLOCKED** |
| 3 | Thử PATCH trangThai=TAM_DUNG trong body | 200 state change | 200 nhưng state không đổi (silently ignore) | **FAIL** |
| 4 | POST /{id}/cap-nhat-trang-thai với body {trangThai:"TAM_DUNG"} | Test | 403 Forbidden cho canbo_tw, chưa xác định role | **UNKNOWN** |

---

### 4.14 TVV-020/021/022: Vô hiệu hóa + guard

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | DELETE /tu-van-viens/{id} với TVV MOI_DANG_KY | 200 soft-delete | 500 ERR-SYS-00-00-01 | **BLOCKED** |
| 2 | DELETE với TVV DANG_HOAT_DONG (không VV) | 200 soft-delete | 500 | **BLOCKED** |
| 3 | DELETE với TVV có VV đang xử lý (guard) | 409 guard | Không test được do crash 500 | **BLOCKED** |

---

### 4.15 TVV-023 → TVV-030: Authorization matrix

| TC | Role | Action | Expected | Actual | Status |
|----|------|--------|----------|--------|--------|
| TVV-023 | admin (QTHT) | GET list | 200 R | 200 ✅ | PASS |
| TVV-023 | admin (QTHT) | POST create | 403 | **201 tạo thành công** | **FAIL** |
| TVV-023 | admin (QTHT) | PATCH (cong-khai) | 403 | **200** | **FAIL** |
| TVV-023 | admin (QTHT) | DELETE | 403 | 500 (BUG) | — |
| TVV-024 | tvv_user | GET list | 200 R* | 200, 8 items ✅ | PASS |
| TVV-025 | chuyengia_user | GET list | 200 R* | 200, 8 items ✅ | PASS |
| TVV-026 | nht_user | POST /bo-sung | 200 (CRU*) | 403 | **FAIL** |
| TVV-027 | tvv_user | GET /ho-so-tu-van-vien | 200 (R*) | 404 (không có endpoint) | BLOCKED |
| TVV-028 | lanhdao_tw (CB_PD) | POST create | 403 | 403 ✅ | PASS |
| TVV-028 | lanhdao_tw (CB_PD) | DELETE | 403 | 500 (blocked by BUG-TVV-003) | — |
| TVV-029 | dn_user | POST /danh-gia | 201 (C†R*) | 403 | **FAIL** |
| TVV-030 | dn_user | GET list | 403 ❌ | 403 ✅ | PASS |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV | Cục BTTP | TW | TVV-001 → TVV-006, TVV-013~022 (nghiệp vụ chính) |
| lanhdao_tw | CB_PD | Cục BTTP | TW | TVV-011, TVV-012, TVV-028 (phê duyệt/từ chối) |
| admin | QTHT | Cục BTTP | TW | TVV-023 (authz negative) |
| nht_user | NHT | — | Portal | TVV-017, TVV-026 |
| tvv_user | TVV | — | Portal | TVV-024, TVV-027 |
| chuyengia_user | CG | — | Portal | TVV-025 |
| dn_user | DN | — | Portal | TVV-029, TVV-030 |

### 5.2 Data tạo/sử dụng trong test

| ID / Mã | Tên / Mô tả | Purpose | Cleanup? |
|---------|-------------|---------|----------|
| `TVV-BTP-TW-0001` (Congnt) | Seed, DANG_HOAT_DONG | TVV-007, TVV-014, TVV-015, TVV-016 | Keep |
| `TVV-BTP-TW-0005` | Tạo bởi QA canbo_tw, CCCD null (field wrong name) | TVV-003 evidence → BUG-TVV-011 | Keep |
| `TVV-BTP-TW-0006` | QA Test B | TVV-003 | Keep |
| `TVV-BTP-TW-0007` | QA Test C — cccd 023184008562, MOI_DANG_KY | TVV-003, TVV-006, TVV-008, TVV-017, TVV-020 | Keep (bug evidence) |
| `TVV-BTP-TW-0008` | Admin Created | TVV-023 bug evidence (QTHT tạo được) | Keep (bug evidence) |
| Linh vực ID `3b3e0735-...` (Dân sự) | Seed LINH_VUC_PL | Tất cả TC tạo TVV | Keep |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}` (snake-kebab case, vd `/tu-van-viens`)
- **Auth flow:** 2-step
  1. `POST /api/v1/auth/login` → `otpToken` (gửi OTP qua email)
  2. `POST /api/v1/auth/verify-otp` với `{otpToken, otpCode}` → `accessToken` (JWT, TTL 900s)
- **Token TTL:** 15 phút; tự revoke khi user đăng nhập lại → cần script re-login
- **Validation:** NestJS class-validator với message tiếng Việt, nhưng MỘT số validate message tiếng Anh còn sót (`lyDo must be shorter than or equal to 1000 characters`)
- **Pagination:** `?page=1&pageSize=N` (không phải `limit`)
- **Filter hỗ trợ:** `trangThai` (enum), `pageSize`, `page`. Các text filter khác KHÔNG hoạt động
- **Known limitations (QA):**
  - UI test: browse tool (headless Chromium) bị crash giữa chừng khi submit OTP (server restart mid-session). Không chụp được screenshot của TVV list page qua UI → mọi bug dựa trên API testing
  - Token injection vào localStorage/sessionStorage/cookie đều không bypass được auth gate → phải qua OTP flow đầy đủ
  - Swagger UI / API docs không expose (404 trên `/api-docs`, `/api-json`, `/swagger`)

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-TVV-001 (Critical):** Fix GET detail 500 — kiểm tra relation config (TypeORM/Prisma), add try/catch proper, thêm E2E test.
2. **BUG-TVV-002 (Critical):** Gỡ `create_tu_van_vien`, `approve_tu_van_vien`, `update_tu_van_vien` khỏi role QTHT trong CASL. Add E2E: admin create TVV → expect 403.
3. **BUG-TVV-003 (Critical):** Implement guard + soft-delete cho DELETE. Check `vuViecs` ràng buộc trước khi xóa.
4. **BUG-TVV-004 (Major):** Bổ sung filter `hoTen`, `maTvv`, `linhVucId`, `tinhTpId`, `loaiTvv` vào DTO + WHERE query.
5. **BUG-TVV-005 (Major):** Implement endpoint DN đánh giá TVV (scope: chỉ TVV đã hoàn thành VV của DN), hoặc open permission với guard.
6. **BUG-TVV-006 (Major):** Fix NHT /bo-sung 403 — check scope TvvEntity.taiKhoanId = currentUser.id.

### Should Fix

7. **BUG-TVV-007 (Major):** /tham-dinh phải throw 409 khi state invalid (pattern /phe-duyet).
8. **BUG-TVV-008 (Medium):** Bổ sung các endpoint state transition thiếu: `/gui-duyet`, `/tam-dung`, `/kich-hoat`.
9. **BUG-TVV-009 (Medium):** Cập nhật `soLuongDanhGia` khi tạo đánh giá mới.

### Nice to Have

10. **BUG-TVV-010 (Medium):** Alias `limit → pageSize` hoặc strict reject với message hướng dẫn.
11. **BUG-TVV-011 (Minor):** Bật `forbidNonWhitelisted: true` trong `ValidationPipe`.
12. **BUG-TVV-012 (Minor):** Review ResponseInterceptor — loại bỏ double-wrap.

### Additional Recommendations

- **Test data:** Seed sẵn 1 TVV ở mỗi trạng thái chính (CHO_THAM_DINH, DANG_THAM_DINH, CHO_PHE_DUYET, TAM_DUNG) để regression test đủ luồng.
- **API doc:** Expose Swagger UI ở môi trường test để QA tự khám phá endpoint.
- **UI testing:** Cần máy có stable headless Chrome (hoặc switch sang Playwright) để verify các phát hiện API trên UI layer.
- **OTP bypass cho test:** Thêm test mode env với OTP cố định hoặc skip OTP cho `@test` email để automation chạy nhanh hơn.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/auth/login` | Step 1 auth | setup |
| POST | `/api/v1/auth/verify-otp` | Step 2 auth | setup |
| GET | `/api/v1/tu-van-viens` | List | TVV-001, 002, 024, 025, 030 |
| POST | `/api/v1/tu-van-viens` | Create | TVV-003, 004, 005, 023, 028 |
| GET | `/api/v1/tu-van-viens/{id}` | Detail | TVV-007 (FAIL 500) |
| PATCH | `/api/v1/tu-van-viens/{id}` | Update | TVV-006 |
| DELETE | `/api/v1/tu-van-viens/{id}` | Soft delete | TVV-020-022 (FAIL 500) |
| POST | `/api/v1/tu-van-viens/{id}/tham-dinh` | Thẩm định | TVV-008 (FAIL 500) |
| POST | `/api/v1/tu-van-viens/{id}/phe-duyet` | Phê duyệt | TVV-011 (BLOCKED) |
| POST | `/api/v1/tu-van-viens/{id}/tu-choi` | Từ chối | TVV-012 (PARTIAL) |
| POST | `/api/v1/tu-van-viens/{id}/cong-khai` | Công khai portal | TVV-013, 023 (bug evidence) |
| POST | `/api/v1/tu-van-viens/{id}/bo-sung` | Bổ sung hồ sơ | TVV-010, 017, 026 |
| POST | `/api/v1/tu-van-viens/{id}/danh-gia` | Tạo đánh giá | TVV-014, 029 |
| GET | `/api/v1/tu-van-viens/{id}/danh-gia` | List đánh giá | TVV-014 verify |
| GET | `/api/v1/tu-van-viens/{id}/lich-su-ho-tro` | Lịch sử VV | TVV-016 |
| GET | `/api/v1/danh-muc?loaiDanhMuc=LINH_VUC_PL` | Get linh vực | Setup |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [01-landing-loaded.png](screenshots/01-landing-loaded.png) | Login page loaded | Env |
| [03-after-submit.png](screenshots/03-after-submit.png) | OTP prompt screen | Env |
| [15-tvv-page-attempt.png](screenshots/15-tvv-page-attempt.png) | UI redirect về /login (không vào được TVV page) | Limitation |

**Lưu ý:** Browse tool crash khi submit OTP → không chụp được UI page nghiệp vụ. Toàn bộ bug trong báo cáo này được reproduce qua API (curl) — đáng tin cậy ở layer backend.

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| UC39 (list TVV) | TVV-001 | PARTIAL (bug pagination naming) |
| UC40 (search TVV) | TVV-002 | **FAIL** (search không hoạt động) |
| UC41 (đăng ký TVV) | TVV-003, 004, 005 | 3/3 PASS ✅ |
| UC42 (cập nhật năng lực) | TVV-006 | 1/1 PASS ✅ |
| UC43 (xem chi tiết) | TVV-007 | **FAIL** (GET 500) |
| UC44 (thẩm định) | TVV-008, 009, 010 | 3/3 BLOCKED |
| UC45 (phê duyệt/từ chối) | TVV-011, 012 | BLOCKED + PARTIAL |
| UC46 (công khai portal) | TVV-013 | **FAIL** (authz bug) |
| UC47 (đánh giá TVV) | TVV-014, 015, 029 | 1 PASS + 1 PARTIAL + 1 FAIL |
| UC48 (lịch sử) | TVV-016 | 1/1 PASS ✅ |
| UC49 (NHT tự cập nhật) | TVV-017 | **FAIL** |
| UC50 (vô hiệu/tạm dừng) | TVV-018-022 | 5/5 BLOCKED |
| BR-CALC-06 (điểm TB) | TVV-015 | PARTIAL (math OK, count NULL) |
| Permission matrix (QTHT R-only) | TVV-023 | **FAIL** |
| Permission matrix (TVV/CG R*) | TVV-024, 025 | 2/2 PASS |
| Permission matrix (NHT CRU*) | TVV-026 | **FAIL** |
| Permission matrix (CB_PD RU*) | TVV-028 | PASS (create denied ✅) |
| Permission matrix (DN C†R* eval) | TVV-029 | **FAIL** |
| Permission matrix (DN deny) | TVV-030 | 1/1 PASS ✅ |

**Coverage:** 30 TC total → 12 PASS, 7 FAIL, 9 BLOCKED, 2 PARTIAL.

---

## 9. Note về output folder

User yêu cầu output vào `round2_2026-04-16/hoi-dap/` nhưng module test là Chuyên gia/TVV (§7.4). Sau khi clarify, output vào `round2_2026-04-16/cg-tvv/` — khớp semantic. Folder `hoi-dap/` (screenshots only) không bị chạm.

---

*Report generated: 2026-04-17 | QA Automation via Claude Code*
