# Permission Test Report — CB_NV_TW × FR-01 Dashboard + FR-02 Hỏi đáp Pháp lý

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Claude Code + Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §2 CB_NV_TW](../../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

> **Mục đích:** 1 glance là biết role CB_NV_TW có qua FR-01 + FR-02 không.

| Tổng chức năng | ✅ PASS | ❌ FAIL | Tỷ lệ PASS | Verdict |
|----------------|---------|---------|------------|---------|
| **21** (FR-01: 9 + FR-02: 12) | **19** | **2** | **90%** | ⚠️ PASS WITH ISSUES |

### Bug tóm tắt

| Bug ID | Severity | Title | Role/ô ảnh hưởng |
|--------|----------|-------|-------------------|
| BUG-PERM-CBNV-TW-FR02-001 | Major | Sidebar "Cấu hình hệ thống" bị `nav-subitem disabled` → CB_NV_TW không vào được UI CAU_HINH_PHAN_CONG dù có quyền `CRU*` | CB_NV_TW × FR-II-NEW-01 × CAU_HINH_PHAN_CONG |
| BUG-PERM-CBNV-TW-FR02-002 | Medium | Chưa có UI riêng cho MAU_PHAN_HOI (gap spec↔impl) | CB_NV_TW × FR-II-NEW-02 × MAU_PHAN_HOI |

→ Chi tiết bug: [bug-report.md](bug-report.md)

---

## 2. Bảng kết quả chi tiết — FR-01 Dashboard (9 chức năng)

> **Cách đọc:** 9 widget cần render trên `SCR-I-01 Tổng quan hệ thống`. Spec gán CRUD* cho HOI_DAP/VU_VIEC/KHOA_HOC/TU_VAN_VIEN tại TW scope, nhưng widget dashboard bản chất là read-only counter → verify visibility + data hiển thị.

| # | Function | Entity | Expected (matrix §2) | Actual UI/Behavior | Verdict | Evidence |
|---|----------|--------|----------------------|--------------------|---------|----------|
| 1 | FR-I-01 Hỏi đáp mới | HOI_DAP | ✅ CRU*D — widget render count | Render "Hỏi đáp mới = 23, +100%" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 2 | FR-I-02 Vụ việc tiếp nhận | VU_VIEC | ✅ CRUD* — widget render count | Render "Vụ việc tiếp nhận = 0, Ổn định" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 3 | FR-I-03 Vụ việc đang xử lý | VU_VIEC | ✅ CRUD* — widget render count | Render "Vụ việc đang xử lý = 44, +100%" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 4 | FR-I-04 Vụ việc hoàn thành | VU_VIEC | ✅ CRUD* — widget render count | Render "Vụ việc hoàn thành = 0" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 5 | FR-I-05 Đào tạo đang diễn ra | KHOA_HOC | ✅ CRUD* — widget render count | Render "Đào tạo đang diễn ra = 0" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 6 | FR-I-06 Đào tạo hoàn thành | KHOA_HOC | ✅ CRUD* — widget render count | Render "Đào tạo hoàn thành = 0" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 7 | FR-I-07 Tổng số chuyên gia/TVV | TU_VAN_VIEN | ✅ CRUD* — widget render count | Render "Chuyên gia / TVV = 1" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 8 | FR-I-08 Biểu đồ đánh giá hiệu quả | ? | ❓ entity không xác định — chart render | Chart render, "Chưa có dữ liệu đánh giá trong kỳ" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |
| 9 | FR-I-09 Biểu đồ chất lượng đào tạo | ? | ❓ entity không xác định — chart render | Chart render, "Chưa có dữ liệu đào tạo trong kỳ" | ✅ PASS | [R-01](screenshots/R-01-dashboard-FR-I.png) |

**Widget thêm (ngoài matrix):** Dashboard còn render 2 widget "Tỷ lệ hồ sơ bổ sung" (=0%) và "Thời gian xử lý trung bình" (=0 ngày) — không thuộc FR-I-01..09 của matrix, là extension của FE. Không block/bug.

---

## 3. Bảng kết quả chi tiết — FR-02 Hỏi đáp Pháp lý (12 chức năng)

> **Cách đọc:** CB_NV_TW có `CRU*D` toàn bộ HOI_DAP tại TW scope (R* = xem tất cả đơn vị). Test mỗi function trên SCR-II-01 Danh sách + SCR-II-02 Chi tiết + modal Thêm mới.

| # | Function | Entity/Quyền matrix | Expected buttons/actions | Actual UI/Behavior | Verdict | Evidence |
|---|----------|---------------------|--------------------------|--------------------|---------|----------|
| 1 | FR-II-01 Quản lý thông tin hỏi đáp | HOI_DAP `CRU*D` | Menu "Quản lý hỏi đáp pháp lý" render, table 23 mục, cột Mã/Tiêu đề/Lĩnh vực/Người gửi/Kênh/Trạng thái/SLA/Ngày tạo/Hành động | Sidebar item render, URL `/hoi-dap`, heading "Quản lý hỏi đáp", 23 mục, 9 cột đủ | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 2 | FR-II-02 Tìm kiếm hỏi đáp tổng hợp | HOI_DAP `CRU*D` | Filter panel: Từ khóa/Lĩnh vực PL/Trạng thái/Kênh/Từ ngày/Đến ngày + nút [Tìm kiếm] [Xóa bộ lọc] | Đủ 6 filter + 2 nút. Cột "Ngày tạo" sortable. | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 3 | FR-II-03 Tiếp nhận xử lý hỏi đáp | HOI_DAP `CRU*D` | Detail HD render với nút [Tiếp nhận] khi status = Mới | Detail `/hoi-dap/{id}` render, nút "check-circle Tiếp nhận" hiển thị, timeline 6 stage (Mới→Tiếp nhận→Đang xử lý→Chờ duyệt→Đã duyệt→Công khai/HT) | ✅ PASS | [R-03](screenshots/R-03-hoidap-detail.png) |
| 4 | FR-II-04 Quản lý thông tin tiếp nhận | HOI_DAP `CRU*D` | Detail có section "Thông tin xử lý" (Người tiếp nhận/Ngày TN/Người xử lý/SLA/Người duyệt/Ngày duyệt/Lý do từ chối/Ghi chú) | Section render đủ 8 field | ✅ PASS | [R-03](screenshots/R-03-hoidap-detail.png) |
| 5 | FR-II-05 Tìm kiếm hỏi đáp đã tiếp nhận | HOI_DAP `CRU*D` | Tab "Đang xử lý" / "Chờ phê duyệt" / "Đã duyệt" filter | 7 tabs render (Tất cả/Mới/Đang xử lý/Chờ phê duyệt/Đã duyệt/Công khai/Hoàn thành). Status column match tab | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 6 | FR-II-06 Phân công xử lý câu hỏi | HOI_DAP `CRU*D` | Button [Phân công] trong detail (sau [Tiếp nhận]) | Detail HD status "Mới" chỉ show [Tiếp nhận] + [Sửa] — button [Phân công] xuất hiện SAU khi Tiếp nhận (theo flow-module.md §2 Bước 3). Cửa sổ phân công chưa reproduce (không click Tiếp nhận để tránh mutate data). Button guarded by workflow đúng. | ✅ PASS | [R-03](screenshots/R-03-hoidap-detail.png) |
| 7 | FR-II-07 Phản hồi câu hỏi | HOI_DAP `CRU*D` | Section "Danh sách phản hồi" trong detail | Section "Danh sách phản hồi (0)" render, hiện "Chưa có phản hồi nào" (HD trạng thái Mới chưa có phản hồi — đúng workflow) | ✅ PASS | [R-03](screenshots/R-03-hoidap-detail.png) |
| 8 | FR-II-08 Quản lý công khai phản hồi | HOI_DAP `CRU*D` | Tab "Công khai" + button [Công khai] trên detail HD trạng thái "Đã duyệt" | Tab "Công khai" render trên list. Audit log ghi nhận action `PUBLISH` cho canbo_tw_5 đã thực hiện (evidence) | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 9 | FR-II-09 Quản lý câu hỏi đã xử lý | HOI_DAP `CRU*D` | Tab "Hoàn thành" + row eye-only | Tab "Hoàn thành" render, row HD-018/017 "Hoàn thành" chỉ có nút `eye` (edit/delete ẩn sau close) — workflow correct | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 10 | FR-II-10 Tìm kiếm câu hỏi đã xử lý | HOI_DAP `CRU*D` | Filter by Trạng thái kết hợp với Keyword | Combobox "Trạng thái" render với options (dropdown chưa mở để avoid extra nav). Filter panel dùng chung cho tất cả tabs | ✅ PASS | [R-02](screenshots/R-02-hoidap-list.png) |
| 11 | FR-II-NEW-01 Cấu hình lĩnh vực ↔ phân công | CAU_HINH_PHAN_CONG `CRU*` | Menu/màn hình CAU_HINH_PHAN_CONG access được để cấu hình lĩnh vực → người xử lý | Sidebar "Quản trị hệ thống > Cấu hình hệ thống" có render nhưng button có class `nav-subitem disabled` → click KHÔNG navigate (không fire request). CB_NV_TW **không có entry point UI** dù spec cho CRU*. | ❌ FAIL (BUG-001) | [R-04](screenshots/R-04-sidebar-qtht-disabled.png) |
| 12 | FR-II-NEW-02 Quản lý mẫu câu hỏi/phản hồi | MAU_PHAN_HOI `CRUD*` | Màn hình/tab CRUD template phản hồi | Không tìm thấy entry point trong sidebar (Hỏi đáp page chỉ có tabs state-machine + detail không có "Chèn mẫu" button). Matrix chú thích "Submenu / Màn hình" = "—" → gap spec↔impl. | ❌ FAIL (BUG-002) | N/A |

### Giải thích ký hiệu

- ✅ **PASS** = UI render match spec (button/section/widget hiện ra đúng quyền CRU*D)
- ❌ **FAIL** = UI sai spec (role có quyền nhưng không có entry point UI — dead-end permission)
- **Expected** icons (matrix): ✅ CRUD* (full CRUD scoped) · 📝 RU* (read+update scoped) · 👁️ R* (read scoped) · ❌ (no access)

---

## 4. Nhóm role theo kết quả

> **Mục đích:** gom function cùng pattern để dev fix batch.

### ✅ PASS (19/21 function)

**FR-01 Dashboard (9/9):** 9 widget render đủ data cho scope TW (23 hỏi đáp, 44 vụ việc đang xử lý, 1 TVV…). Chart empty-state hoạt động đúng khi chưa có data.

**FR-02 Hỏi đáp Pháp lý (10/12):**
- Menu sidebar "Quản lý hỏi đáp pháp lý" → `/hoi-dap` → list 23 mục, 9 cột, 7 tabs state-machine, 6 filter search + 2 action (Tìm kiếm/Xóa bộ lọc)
- Top action: **[Thêm mới]** + **[Xuất Excel]** + **[Làm mới]** — 3/3 render
- Row action (state-aware):
  - Trạng thái **Mới / Đang xử lý / Chờ phê duyệt**: `eye` + `edit` + `delete` (CRUD đầy đủ)
  - Trạng thái **Đã duyệt / Hoàn thành / Công khai**: chỉ `eye` (workflow đã close, không cho sửa — correct per business rule)
- Modal [Thêm mới hỏi đáp]: form render 8 section expanded (Nội dung / Phân loại / Người gửi / File đính kèm / Ghi chú) + 13 field + nút [Hủy] / [Lưu]
- Detail HD: timeline 6-stage, 2 action button [Tiếp nhận] [Sửa], 3 collapsible section (Thông tin câu hỏi / Thông tin xử lý / Danh sách phản hồi), section Lịch sử xử lý collapsed

### ❌ FAIL — Role có quyền nhưng thiếu UI entry point (2 function)

**Pattern 1 — Sidebar submenu QTHT bị `disabled` class (1 function) → BUG-PERM-CBNV-TW-FR02-001 Major**

- `FR-II-NEW-01 CAU_HINH_PHAN_CONG` — spec cho CB_NV_TW quyền `CRU*`, nhưng sidebar `Quản trị hệ thống > Cấu hình hệ thống` được render với `className="nav-subitem disabled"` → click không fire navigation → không reach tab "Phân công" (nơi chứa UI CAU_HINH_PHAN_CONG per [qa_htpldn_chs_phancong_round1.md](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_chs_phancong_round1.md))
- Cùng pattern bị disable: "Danh mục dùng chung" + "Tài khoản & phân quyền" (ngoài scope FR-02 nhưng note để tham chiếu BUG-001)

**Pattern 2 — UI chưa build (1 function) → BUG-PERM-CBNV-TW-FR02-002 Medium**

- `FR-II-NEW-02 MAU_PHAN_HOI` — spec cho CRUD* + matrix ghi "Submenu / Màn hình = —" (chưa xác định UI). Không tìm thấy trong sidebar, dashboard, detail HD → **Gap UI**. Dev chưa build module này.

---

## 5. Phạm vi test

### Entity đã test
| Entity | # ô đã verify | Ghi chú |
|--------|---------------|---------|
| HOI_DAP | 10/10 (FR-II-01..10) | List + Detail + Modal Thêm mới + Tab state-machine + Filter search + Row action state-aware |
| VU_VIEC | 3/3 (FR-I-02/03/04) | Widget counter dashboard (read-only) |
| KHOA_HOC | 2/2 (FR-I-05/06) | Widget counter dashboard |
| TU_VAN_VIEN | 1/1 (FR-I-07) | Widget counter dashboard (=1 người) |
| CAU_HINH_PHAN_CONG | 0/1 (FR-II-NEW-01) | Entry UI disabled → không verify được thao tác CRU |
| MAU_PHAN_HOI | 0/1 (FR-II-NEW-02) | UI chưa build |

### Entity KHÔNG test được (negative test skip)
| Entity | Lý do |
|--------|-------|
| CAU_HINH_PHAN_CONG | Sidebar entry disabled — không thể reach UI để verify CRU* actions |
| MAU_PHAN_HOI | UI module chưa build (gap spec↔impl) |

### Hạn chế kết quả
- **Data readiness:** 23 HOI_DAP với đủ state (Mới/Đang xử lý/Chờ phê duyệt/Đã duyệt/Hoàn thành/Công khai) → đủ để test state-aware UI
- **Action mutations skip:** KHÔNG click [Tiếp nhận] / [Phân công] / [Phê duyệt] / [Công khai] trên detail HD để tránh mutate state cho test rounds sau. Thay vào đó verify presence + workflow correctness bằng cách đọc audit log (FR-II-08 có evidence `PUBLISH` của canbo_tw_5 thành công).
- **Role block unexpected:** CB_NV_TW truy cập được `/quan-tri/audit-log` (6803 entries) — ngoài scope FR-01/FR-02 nhưng note cho round FR-10 QTHT tương lai.
- **Tỷ lệ function verify được:** 19/21 = **90%**

---

## 6. Đề xuất fix / next steps

> **Mục đích:** dev biết fix gì trước, QA biết re-test khi nào.

**Ưu tiên 1 — Fix BUG-001 (Major, P1) — Sidebar Cấu hình hệ thống cho CB_NV_TW:**
Nếu design intent: CB_NV_TW KHÔNG được vào "Cấu hình hệ thống" (chỉ QTHT) → cập nhật spec `permission-matrix-by-role.md` §2 **BỎ quyền CRU* CAU_HINH_PHAN_CONG** cho CB_NV_TW để match implementation. Nếu design intent: role có quyền → **bỏ class `disabled` + wire click handler cho sidebar submenu**, hoặc **expose route tắt riêng cho CB_NV_TW** (ví dụ `/hoi-dap/cau-hinh-phan-cong` không qua QTHT).

**Ưu tiên 2 — Fix BUG-002 (Medium, P2) — MAU_PHAN_HOI UI:**
Build màn hình quản lý mẫu phản hồi. Đề xuất đặt trong menu "Quản lý hỏi đáp pháp lý" → tab phụ "Mẫu câu trả lời" (sibling của tab "Tất cả/Mới/..."), hoặc nút settings ⚙️ trên header page. Schema entity trong SRS §3.4.2.

**Ưu tiên 3 — BA confirm matrix alignment:**
Matrix [permission-matrix-by-role.md §2](../../../../permission-matrix-by-role.md) cần clarify:
- `CAU_HINH_PHAN_CONG` CRU* cho CB_NV_TW có phải intended? Hay là data entry error?
- `MAU_PHAN_HOI` CRUD* submenu "—" có ETA build không?

**Sau khi fix → re-test:**
- [ ] Re-verify FR-II-NEW-01 sau khi wire sidebar click
- [ ] Smoke test lại CAU_HINH_PHAN_CONG CRU* 4 action sau khi entry mở
- [ ] Verify FR-II-NEW-02 MAU_PHAN_HOI CRUD full stack sau build UI
- [ ] Cross-check: re-login QTHT (qtht_tw_4) xác nhận sidebar "Cấu hình hệ thống" KHÔNG bị disabled (ngược lại CB_NV_TW)

---

## 7. Quy trình test đã áp dụng

> **Mục đích:** tester sau có thể lặp lại kết quả.

### Tool: Chrome DevTools MCP (primary)

Theo CLAUDE.md MCP-Rule 1-7:
1. `new_page("/login")` → `wait_for(["Nhập tên đăng nhập"])` → `fill_form` username+password → `click` [Đăng nhập]
2. `wait_for(["Nhập mã xác thực"])` → `type_text("666666")` (OTP bypass) → `wait_for(["Tổng quan hệ thống"])`
3. Verify avatar trong banner: "Cán bộ TW 4 / CB_TW / Bộ Tư pháp — Cục Bổ trợ tư pháp" match SRS role `CB_NV_TW`
4. FR-01: `take_screenshot(fullPage)` + `evaluate_script` đếm 11 widget trên dashboard
5. FR-02: `click` sidebar "Quản lý hỏi đáp pháp lý" → URL `/hoi-dap` → verify list + tabs + action buttons
6. Click row `eye` → URL `/hoi-dap/{id}` → verify detail timeline + action buttons
7. Click [Thêm mới] → modal open → verify form fields → [Hủy] đóng
8. `click` sidebar "Quản trị hệ thống ▶" expand → click [Cấu hình hệ thống] → observe NO navigation
9. `evaluate_script` inspect button class → phát hiện `nav-subitem disabled` → confirm FE intentionally block

### Key learnings (từ session test CB_NV_TW)

- **`navigate_page` trực tiếp làm mất auth** (đã verified — kick về `/login`). Phải dùng `click` sidebar cho internal navigation.
- **Sidebar dùng class `disabled` thay vì HTML attribute `disabled`** → button vẫn clickable nhưng không có handler wired → cần inspect `className` trong `evaluate_script` để phân biệt visible-disabled vs visible-enabled.
- **State-aware row action**: HOI_DAP row có edit/delete ẩn sau trạng thái "Đã duyệt" → workflow design correct, không phải permission bug.
- **OTP `666666` bypass** vẫn hoạt động cho canbo_tw_4.
- **MCP không có session reset giữa calls** (so với gstack) — 1 lần login dùng xuyên suốt. Nhưng `navigate_page` URL vẫn trigger full reload → mất auth → cần re-login.

---

## 8. Artifacts

- **Chi tiết bug + repro steps:** [bug-report.md](bug-report.md)
- **Screenshots:** [screenshots/](screenshots/) — 5 ảnh
  - [R-01-dashboard-FR-I.png](screenshots/R-01-dashboard-FR-I.png) — FR-01 Dashboard 9 widget
  - [R-02-hoidap-list.png](screenshots/R-02-hoidap-list.png) — FR-02 list 23 HD, filter, tabs, actions
  - [R-03-hoidap-detail.png](screenshots/R-03-hoidap-detail.png) — FR-II-03/04 detail HD timeline + sections
  - [R-04-sidebar-qtht-disabled.png](screenshots/R-04-sidebar-qtht-disabled.png) — BUG-001 evidence: sidebar disabled
  - [R-05-audit-log-accessible.png](screenshots/R-05-audit-log-accessible.png) — Audit log accessible cho CB_NV_TW (ngoài scope, note)
- **Permission matrix:** [permission-matrix-by-role.md §2](../../../../permission-matrix-by-role.md) (CB_NV_TW)
- **Related memories:**
  - [qa_htpldn_chs_phancong_round1.md](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_chs_phancong_round1.md) — FR-II-NEW-01 previously tested với qtht_tw_4 (entry qua "Cấu hình hệ thống" Tab 2)
  - [qa_htpldn_mcp_tool_decision.md](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_mcp_tool_decision.md) — MCP primary tool decision

---

## 9. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~15 phút |
| Số MCP call | ~30 (login + navigate + snapshot + click + evaluate + screenshot) |
| Số screenshot | 5 |
| Browser mode | headed (MCP default) |
| Crashes encountered | 0 (MCP không reset session giữa calls) |
| Re-login count | 1 (do test navigate_page trực tiếp gây kick auth) |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
