# Test Case Candidates — Module Quản trị Hệ thống (QTHT)

**Mục đích:** Xác định những chức năng đã **PASS** functional test (Tier 1) để viết test case chi tiết (Tier 2 — field-level). Tránh viết TC cho chức năng đang FAIL/BLOCKED (sẽ viết sau khi dev fix).

**Nguồn:** Tổng hợp từ [functional-test-report-qtht.md](functional-test-report-qtht.md) (API) + [functional-test-report-qtht-ui.md](functional-test-report-qtht-ui.md) (UI). Chỉ liệt kê **PASS** hoặc **PARTIAL** (phần passed được).

**Ngày:** 2026-04-17 | **Round:** 2

---

## Tổng hợp

| Nhóm chức năng | Đáng viết TC? | Số TC gốc PASS | Ưu tiên Tier-2 |
|-----------------|---------------|----------------|-----------------|
| 1. Authentication (login, logout) | ✅ YES | 4/8 | **P0** |
| 2. Session management | ⚠️ Partial | 2/3 | P1 |
| 3. CRUD Danh mục | ✅ YES | 6/9 | **P0** |
| 4. Pagination / Search / Filter | ✅ YES | 3/3 | P1 |
| 5. Quản lý Tài khoản (create, list) | ⚠️ Partial | 2/7 | P1 (chờ fix trước khi update/lock) |
| 6. Forgot password (active user) | ✅ YES | 1/1 | P2 |
| 7. Cấu hình SLA | ✅ YES (UI) | 1/1 (UI revert) | P1 |
| 8. Authorization (QTHT + CB_NV) | ✅ YES (một phần) | 2/4 | P1 |
| 9. UI Dashboard, sidebar menu | ✅ YES | 3 | P2 |
| 10. UI Form validation (empty submit) | ✅ YES | 1 | P1 |

**Tổng: ~25 test case gốc PASS → khoảng 60-80 Tier-2 TC có thể viết.**

Các TC FAIL/BLOCKED (không viết Tier-2 ngay): QT-006, 008, 013, 016-sort, 020, 021, 023, 025, 026, 028, 031, 032, QT-003-UI. Đợi dev fix xong, QA verify lại PASS rồi mới viết Tier-2.

---

## Nhóm 1. Authentication — **P0**

### TC gốc đã PASS

| ID gốc | Tên TC | Nguồn | Layer 1 status |
|--------|--------|-------|----------------|
| QT-001 | Đăng nhập thành công (admin/Secret@123) | API + UI | PASS |
| QT-002 | OTP qua email + auto-submit trên 6 digit | API + UI | PASS |
| QT-003 | Khoá tài khoản sau 5 lần sai | API | PASS |
| QT-004 | Hiển thị thông báo "tài khoản tạm khoá" | API | PASS |
| QT-005 | Logout → token revoked | API + UI | PASS |

### Tier-2 TC suggested

**QT-001 — Login happy → 6-8 TC:**
- Input boundary: username 4-50 ký tự, có dấu gạch dưới
- Trim whitespace: "` admin `" → server có xử lý trim không
- Case sensitivity: `ADMIN` vs `admin` — khớp hay không
- Remember me checkbox — kiểm tra có nhớ token/cookie qua refresh không
- Response time < 2s (performance)
- otpToken TTL đúng 300s (BR-AUTH-05)
- Response structure: `{otpToken, otpExpiresIn, maskedEmail, message}` đủ field
- Log audit: event LOGIN_INITIATED có ghi không (BUG-010 fix trước)

**QT-002 — OTP verify → 5-7 TC:**
- OTP 6 chữ số chính xác → 200
- OTP sai 1 lần → error specific (không generic)
- OTP đúng nhưng expired (> 300s) → error "OTP hết hạn"
- OTP cùng giá trị dùng 2 lần → reject lần 2
- OTP với otpToken không valid → reject
- Auto-submit UX: ký tự 7 không được nhận
- "Gửi lại OTP" — verify new OTP khác cũ, TTL reset

**QT-003 — Account lockout → 4-5 TC:**
- Lần 1-4 sai → error "Invalid credentials", không lock
- Lần 5 sai → lock với message "Tài khoản tạm khoá do đăng nhập sai quá nhiều lần"
- Lock duration: exactly 30 phút? (test với time mock)
- Lần thử thứ 6 khi đã lock: error "Vui lòng thử lại sau 30 phút"
- Lock có reset khi login đúng trong 30 phút sau (ví dụ bằng admin unlock)?
- Audit log có ghi event ACCOUNT_LOCKED (pending BUG-010)

**QT-005 — Logout → 3-4 TC:**
- POST /auth/logout với token valid → 200 + revoked
- POST /auth/logout với token đã revoke → idempotent hay error?
- Sau logout, GET /auth/me → 401 "Token has been revoked"
- UI: logout từ user menu → redirect /login + clear local state

---

## Nhóm 2. Session management — **P1** (partial)

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-007 | Session limit 3 cho CB_NV, 4th kill oldest | PASS |
| QT-005 | Logout revoke (đã liệt kê ở Nhóm 1) | PASS |

> ⚠️ QT-006 (TTL 15 vs 30 min) và QT-008 (QTHT multi-session) đang FAIL — **không viết Tier-2**.

### Tier-2 TC

**QT-007 — CB_NV 3 session rule → 4-5 TC:**
- Login 1 device → 1 session active
- Login 2 device cùng user → 2 sessions, cả 2 valid
- Login 3 device → 3 sessions
- Login 4 device → 4th active, 1st REVOKED (kill oldest — verify bằng `GET /auth/sessions`)
- Session list response: có `session_id, ip_address, user_agent, created_at, last_active, is_current`
- Logout 1 session → chỉ kill session đó, 2 session khác vẫn active
- 3 session parallel gọi API → tất cả work đồng thời

---

## Nhóm 3. CRUD Danh mục — **P0**

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-009 | Create danh mục với data hợp lệ | PASS |
| QT-009-form (UI) | Form tạo mở ra | PASS |
| QT-009-val (UI) | Empty form submit → validation errors | PASS |
| QT-010 | Duplicate `ma` → lỗi unique | PASS |
| QT-011 | Update với optimistic lock version | PASS |
| QT-012 | Soft delete — 204, list không hiện, GET 404 | PASS |
| QT-014 | Pagination default 20/page | PASS (API + UI) |
| QT-015 | Search by name (`?search=...`) | PASS (API + UI) |
| QT-016-UI | Cột có sortable | PASS (UI) |
| QT-017-panels | 15+ loại danh mục panels trong UI | PASS (UI) |

> ⚠️ QT-013 (delete in-use không chặn) FAIL, QT-016-sort (DESC ignored) FAIL → không viết Tier-2.

### Tier-2 TC — PRIORITY HIGH

**QT-009 — Create danh mục → 8-10 TC:**
- Field `ma`: pattern, min/max length, ký tự đặc biệt, underscore, uppercase vs lowercase
- Field `ten`: min 1 / max 255 ký tự, Unicode (tiếng Việt có dấu)
- Field `moTa`: optional, max 500 ký tự
- Field `thuTu`: integer positive, trùng với DM khác cùng loại được không?
- Field `trangThai`: enum `KICH_HOAT` / `KHONG_KICH_HOAT` / ...
- Field `danhMucChaId`: optional UUID, must reference existing
- Field `duLieuMoRong`: JSON object free-form
- Response echo field `id`, `version=1`, `ngayTao`, `ngayCapNhat`
- Audit log có ghi event CREATE (pending BUG-010)
- Created by: `nguoiTaoId` = current user

**QT-011 — Update → 6-8 TC:**
- PATCH hợp lệ với version match → version tăng, ngayCapNhat đổi, field dirty updated
- PATCH với version mismatch → 409 optimistic lock error
- PATCH field `ma` (immutable?) — test có cho phép đổi ma không
- PATCH rỗng body (chỉ version) → no-op hay reject?
- PATCH trangThai = KICH_HOAT ↔ KHONG_KICH_HOAT
- PATCH giữa 2 update concurrent → verify optimistic lock exclusion

**QT-012 — Soft delete → 5-6 TC:**
- DELETE danh mục bình thường → 204, list không hiện
- GET danh mục đã xoá → 404 "Không tìm thấy"
- GET với `?includeDeleted=true` (nếu có support) → hiện lại
- DELETE lần 2 cùng id → 404 (idempotent)
- Danh mục `isSystem=true` → block delete (khi implement)
- Audit log ghi DELETE event với actor

**QT-014 — Pagination → 5-6 TC:**
- Default page=1, pageSize=20
- `?page=2&pageSize=50` → response đúng `meta.page=2, pageSize=50`
- `?page=0` → error hay default về 1?
- `?pageSize=0` hoặc > 100 → cap về max?
- Page cuối: total=25, pageSize=20 → page 2 có 5 items
- Meta response đầy đủ `{page, pageSize, total, totalPages}`

**QT-015 — Search → 6-8 TC:**
- `?search=Tư vấn` → full-text/contains match
- `?search=TU+VAN` (không dấu, uppercase) → accent-insensitive? case-insensitive?
- `?search=<empty>` → trả all?
- `?search=` với ký tự SQL injection `' OR 1=1--` → không lộ dữ liệu
- Search với `?search=...&pageSize=10` → combine OK
- Search trả count đúng trong meta.total

**QT-017 UI panel — 5-6 TC:**
- Click mỗi panel → URL đổi `/quan-tri/danh-muc/<loai_code>`
- Panel active highlight đúng
- Data table refresh sau click panel
- Panel scrollable nếu > 15 loại
- Search box reset khi đổi panel
- Pagination reset về page 1 khi đổi panel

---

## Nhóm 4. Pagination / Search / Filter UI — **P1**

(Đã gộp chung với Nhóm 3 ở trên, section CRUD Danh mục. Các logic này re-use cho Tài khoản, Vai trò, Đơn vị.)

---

## Nhóm 5. Quản lý Tài khoản — **P1 partial**

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-018 | Create user với data hợp lệ | PASS |
| QT-018-list (UI) | User list load | PASS |
| QT-019 | Duplicate email/username → error unique | PASS |

> ⚠️ QT-020 (assign role), QT-023 (lock/unlock) FAIL — **không viết Tier-2 cho update flows** cho đến khi BUG-005 fix.

### Tier-2 TC

**QT-018 — Create user → 8-10 TC:**
- `username` pattern + min/max length
- `email` format validation (RFC 5322)
- `hoTen` Unicode Vietnamese
- `dienThoai` optional, format VN phone
- `loaiTaiKhoanId` must be valid UUID + exist
- `donViId` must be valid UUID + exist + thuộc cap đúng role
- `vaiTroIds[]` min 1, each is UUID + exist
- `matKhau` — **chờ BUG-006 fix**; khi fix xong: test rules policy
- Trạng thái mặc định `CHO_KICH_HOAT`
- Email activation gửi tới địa chỉ tạo
- Audit log có ghi CREATE USER

**QT-019 — Duplicate blocking → 4-5 TC:**
- Username trùng (exact match) → 409
- Username trùng case khác (Admin vs admin) — blocked hay không?
- Email trùng exact → 409
- Email trùng case khác (Admin@Test.vn vs admin@test.vn) → normalize?
- Trường hợp user đã soft-delete: tạo username trùng → cho phép hay không?

---

## Nhóm 6. Forgot password — **P2**

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-024 (API) | Forgot password cho user HOAT_DONG → email gửi với TTL 30 phút | PASS |
| QT-024-UI | Link "Quên mật khẩu?" mở trang forgot-password | PASS |

> ⚠️ BUG-QTHT-011 (forgot-password silent cho CHO_KICH_HOAT user) — behavior mơ hồ. Viết TC theo behavior hiện tại, note "cần spec clarify".

### Tier-2 TC

**QT-024 — Forgot password flow → 6-8 TC:**
- Email valid của user HOAT_DONG → email reset gửi với link có token
- Email không tồn tại → vẫn trả success message (security: không lộ user existence)
- Email CHO_KICH_HOAT → behavior? (pending spec — BUG-011)
- Email BI_KHOA → có gửi reset không?
- Click link trong email → mở trang đặt lại password
- Link hết hạn sau 30 phút → error "Link đã hết hạn"
- Link dùng 2 lần → lần 2 reject
- Password mới phải khác password cũ? (tuỳ spec)
- Password mới phải pass policy (chờ BUG-006 fix)

---

## Nhóm 7. Cấu hình SLA — **P1** (UI reversal)

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-027 (UI) | Trang Cấu hình SLA load với 4 loại (HOI_DAP/HO_SO_HT/HO_SO_TT/VU_VIEC) | PASS |

### Tier-2 TC — NEW (chưa có ở Tier 1)

**Cần tìm tên endpoint thật trước khi viết chi tiết. Xem Network tab khi click menu Cấu hình SLA → note API URL.**

Khi có endpoint, viết:

**SLA Config CRUD → 6-8 TC:**
- GET list SLA config → 4+ entries
- PATCH thời hạn: `HOI_DAP.thoiHanNgayLV` từ 10 → 7 ngày (BR-SLA-01)
- Vùng cảnh báo: thay đổi threshold 50/90/100%
- Hệ số quá hạn: integer > 0
- Toggle Email / Thông báo app
- Validate: thoiHan > 0, threshold [0, 100]
- Audit log khi thay đổi (pending BUG-010)
- UI: sau khi save → reload bảng, giá trị cập nhật

---

## Nhóm 8. Authorization — **P1** (một phần)

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-029 | QTHT có CRUD trên DANH_MUC, TAI_KHOAN, VAI_TRO, DON_VI | PASS |
| QT-030 | CB_NV chỉ được xem DM/VT/DV, không tạo/sửa/xoá | PASS |

> ⚠️ QT-031 (CB_PD thấy TAI_KHOAN), QT-032 (DN/NHT thấy VAI_TRO) FAIL — **không viết Tier-2** cho đến khi BUG-007, BUG-008 fix.

### Tier-2 TC

**QT-029 — QTHT full access → 5-7 TC:**
- QTHT_TW vs QTHT_BN vs QTHT_DP: ai thấy ai?
  - QTHT_TW: thấy toàn bộ đơn vị
  - QTHT_BN: scoped trong Bộ/ngành
  - QTHT_DP: scoped trong Tỉnh/TP
- Data isolation cross-unit: QTHT_BN không thấy user của Bộ khác
- QTHT CRUD danh mục: tạo/sửa/xoá thành công
- QTHT CRUD user: tạo/sửa/xoá thành công (chờ BUG-005 fix update flow)
- QTHT CRUD vai trò: tạo/sửa/xoá — spec có không?
- QTHT soft-delete vs hard-delete

**QT-030 — CB_NV read-only → 4-5 TC:**
- GET /danh-muc → 200
- GET /vai-tro → 200
- GET /don-vi → 200
- GET /tai-khoan → 403
- POST /danh-muc → 403
- POST /tai-khoan → 403
- PUT /danh-muc/{id} → 403
- DELETE /danh-muc/{id} → 403
- CB_NV_TW vs CB_NV_BN vs CB_NV_TINH: all 3 cấp behavior giống nhau?

---

## Nhóm 9. UI Dashboard + Sidebar — **P2**

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-001b (UI) | Header hiển thị role QTHT_TW đúng | PASS |
| DASH-widgets | Dashboard 15 số liệu metrics render | PASS |
| Sidebar-menu | Sidebar hiển thị đủ menu cho admin | PASS |

### Tier-2 TC

**Dashboard widgets → 4-5 TC:**
- Mỗi widget hiển thị số đúng từ API (so với `COUNT(*)` thực tế)
- Widget "Vụ việc đang xử lý" = count vụ việc ở state DANG_XU_LY + TIEP_NHAN + ...
- Widget "Chuyên gia / Tư vấn viên" = count CG + TVV DANG_HOAT_DONG
- Xu hướng +N% so với kỳ trước: verify logic tính
- Empty state: "Chưa có dữ liệu" khi count=0 (thấy trong screenshot)
- "Ổn định" badge logic (trạng thái)
- Performance: dashboard load time < 3s

**Sidebar menu → 6-8 TC:**
- Menu QTHT có 8 sub-items (Danh mục, SLA, Phân công, Ngày lễ, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Tài khoản, API Consumer)
- Expand/collapse: click parent → toggle submenu
- Active state: sub-item active có highlight
- Role-based visibility: CB_NV không thấy menu QTHT (cần log out admin, login CB_NV verify)
- Breadcrumb cập nhật đúng mỗi page
- Mobile responsive — hamburger icon (viewport < 768px)
- Keyboard navigation: Tab đi qua items
- Accessibility: aria-label, aria-expanded

**Header user menu → 3-4 TC:**
- Avatar click mở dropdown: Hồ sơ, Đổi mật khẩu, Đăng xuất
- Click Hồ sơ cá nhân → mở modal/page profile
- Click Đổi mật khẩu → flow đổi password (cần spec)
- Notification badge 99+ → click mở list thông báo

---

## Nhóm 10. UI Form validation (positive) — **P1**

### TC gốc PASS

| ID gốc | Tên TC | Status |
|--------|--------|--------|
| QT-009-val (UI) | Submit empty form → nhiều validation errors inline | PASS |

### Tier-2 TC

**Form validation UX pattern → 5-7 TC (áp chung cho mọi form):**
- Required field validation → `<Form.Item>` hiện `.ant-form-item-explain-error`
- Visual: asterisk (*) đỏ cho required field
- Error text màu đỏ (#ff4d4f — antd default)
- Real-time validation on blur (không cần submit mới báo)
- Submit button: disabled khi có error, enabled khi pass
- Trim whitespace: `"  admin  "` → send `"admin"`
- Paste data có control character (newline, tab) → clean
- Input max length: browser ngắt ở ký tự thứ maxlength

---

## Gợi ý thứ tự viết Tier-2

**Sprint 1 (Priority P0):**
1. Nhóm 1 Authentication (4 TC gốc × 4-8 TC mỗi = ~20 TC) — foundation
2. Nhóm 3 CRUD Danh mục (10 TC gốc × 5-8 = ~40 TC) — master data
3. Nhóm 8 Authorization QTHT + CB_NV (~12 TC) — security baseline

**Sprint 2 (P1):**
4. Nhóm 2 Session management (~5 TC)
5. Nhóm 5 Create user + duplicate (~12 TC) — chờ BUG-005 fix cho update flow
6. Nhóm 7 Cấu hình SLA (~8 TC) — tìm endpoint trước
7. Nhóm 10 UI form validation (~7 TC, shared pattern)

**Sprint 3 (P2):**
8. Nhóm 6 Forgot password (~7 TC)
9. Nhóm 9 Dashboard + sidebar (~12 TC)

**Tổng: ~120 Tier-2 test case** cho module QTHT dựa trên Tier-1 PASS.

---

## Các TC bị hoãn (chờ dev fix bug)

| TC gốc | Bug chặn | Khi nào viết Tier-2 |
|--------|----------|----------------------|
| QT-006 | BUG-QTHT-001 (JWT TTL) | Sau khi backend chỉnh về 30 phút + implement refresh-token |
| QT-008 | BUG-QTHT-002 (QTHT multi-session) | Sau khi backend thêm rule role-based limit |
| QT-013 | BUG-QTHT-003 (delete in-use) | Sau khi backend thêm reference check |
| QT-016-sort | BUG-QTHT-004 (sortOrder) | Sau khi backend sửa query builder |
| QT-020 | BUG-QTHT-005 (PUT no-op vaiTroIds) | Sau khi BE tách endpoint hoặc mở DTO |
| QT-023 | BUG-QTHT-005 (PUT no-op trangThai) | Cùng QT-020 |
| QT-021 | No endpoint discovered | Sau khi spec clarify cơ chế phân quyền chức năng |
| QT-025 | BUG-QTHT-010 (audit log missing) | Sau khi BE thêm endpoint /nhat-ky-he-thong |
| QT-026 | BUG-QTHT-010 (chiTiet rỗng) | Cùng QT-025 |
| QT-028 | BUG-QTHT-006 + UI-001 (password validation) | Sau khi FE + BE thêm validator |
| QT-031 | BUG-QTHT-007 (CB_PD authz leak) | Sau khi BE fix guard |
| QT-032 | BUG-QTHT-008 (DN/NHT authz leak) | Cùng QT-031 |
| QT-003-UI | BUG-QTHT-UI-002 (no error display) | Sau khi FE thêm onError handler |

---

*Generated: 2026-04-17 | QA Automation via Claude Code*
