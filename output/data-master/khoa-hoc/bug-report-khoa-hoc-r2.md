# Bug Report — M6.1 Khóa học (Round 2)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 17:43:00 [2026-04-23] |
| **Loại test** | Functional — Seed data M6.1 (CREATE 6 records) — **Regression của Round 1 blocker** |
| **Round** | Round 2 |
| **Tài liệu tham chiếu** | [seed-fixture.yaml §khoa_hoc_variants rows 611-716](../../../input/data/seed-fixture.yaml), [srs-fr-03-dao-tao.md §FR-III-01](../../../input/srs-v3/srs-fr-03-dao-tao.md), [Round 1 report](bug-report-khoa-hoc.md), memory `qa_htpldn_khoahoc_cr_round1` |

---

## Tổng hợp

Phát hiện **0** lỗi có SRS reference cụ thể trong Round 2. **STOP early theo user instruction** — không tạo được record nào: blocker Round 1 (`OBS-KH-001`) **vẫn còn nguyên** — combobox "Chương trình đào tạo" trên form tạo Khóa học chỉ hiển thị CTDT ở state `DA_DUYET`, hiện toàn bộ 9 CTDT (4 fixture M6.1-parent + 5 record QA) đều ở state `DU_THAO`.

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể. UI filter `trangThai=DA_DUYET` không có trong SRS FR-III-01 Inputs Khóa học row 3 (`ctdt_id: FK → CTDT`, không ràng buộc state) → giữ nguyên phân loại Observations như Round 1, không log bug SRS-ref.

**Khác biệt Round 2 vs Round 1:**

| Khía cạnh | Round 1 (2026-04-23 sáng) | Round 2 (2026-04-23 17:43) |
|-----------|----------------------------|------------------------------|
| Số CTDT hiện tại trong hệ thống | 4 (M6.1-parent fixture) | **9** (4 fixture + 5 record QA cũ) |
| CTDT ở state `DA_DUYET` | 0 | **0** (regression — không ai approve được) |
| Dropdown CTDT trong form Khóa học | Rỗng (empty-text "Không có chương trình phù hợp") | Rỗng (y hệt) |
| API `GET /api/v1/chuong-trinh-dao-taos?…&trangThai=DA_DUYET` | `meta.total=0` | `meta.total=0` (reqid=208, 200 OK) |
| Workflow advance khả thi với role hiện tại | Không — CB_NV_TW chỉ có nút `Gửi phê duyệt` (submit → CHO_DUYET), không có `Phê duyệt` (→ DA_DUYET) | Giống Round 1 — xem screenshot `r2-ctdt-detail-stepper-gui-phe-duyet.png` |

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 0    | 0        | 0     | 0      | 0     | 0       |

### Test result breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | CRUD khóa học 6 variant theo fixture | 6 | 0 | 0 | 0 | 6 | **0%** |
| **Total** | | **6** | **0** | **0** | **0** | **6** | **0%** |

→ **Happy-path Pass Rate = 0/6** — 100% BLOCKED bởi cùng workflow dependency `CTDT.trangThai = DA_DUYET` chưa có cách unlock với CB_NV role hiện tại.

---

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|-------------------|-------|--------|
| — | — | — | — | — | — | — | Không log bug SRS-ref — xem `## Observations — ngoài SRS` | — |

---

## Observations — ngoài SRS (không log bug)

> **Mục đích:** Tất cả quan sát block CREATE đã log ở Round 1 `bug-report-khoa-hoc.md §Observations (OBS-KH-001..004)`. Round 2 confirm regression — KHÔNG duplicate các observation đó, chỉ ghi lại **delta** và **bằng chứng mới**.

| Observation | Chi tiết / Evidence mới (Round 2) | SRS có nói không? | Đề xuất |
|-------------|------------------------------------|-------------------|---------|
| **OBS-KH-001-R2 (regression)** — Round 1 blocker vẫn còn: combobox CTDT rỗng do `trangThai=DA_DUYET` filter + toàn bộ 9 CTDT đều ở state `DU_THAO`. Không có account CB_PD trong CSV `input/test-accounts.csv` cho môi trường test hiện tại → QA tự seed đủ fixture là bất khả thi theo workflow thực tế.<br><br>Role `canbo_tw_5` (CB_NV_TW) chỉ có nút **"Gửi phê duyệt"** (DU_THAO → CHO_DUYET) trên CTDT detail, **không có nút "Phê duyệt"** để chuyển CHO_DUYET → DA_DUYET. | **Evidence Round 2:**<br>• Dropdown HTML (evaluate_script): `<div role="listbox" id="ctdtId_list" class="ant-select-item-empty">Không có chương trình phù hợp</div>`<br>• API call UI phát: `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=100&trangThai=DA_DUYET` → 200, `data=[], meta.total=0` (reqid=208)<br>• List CTDT tab "Đã duyệt" tại `/dao-tao/chuong-trinh/danh-sach?tab=DA_DUYET`: "Không có chương trình đào tạo nào phù hợp" (SCR empty-state)<br>• CTDT detail stepper: tô đậm node (1) Dự thảo, 4 node sau (Chờ duyệt / Đã duyệt / Đang thực hiện / Hoàn thành) chưa active<br>• Screenshot: [r2-blocker-ctdt-dropdown-empty.png](image/r2-blocker-ctdt-dropdown-empty.png), [r2-ctdt-list-all-draft.png](image/r2-ctdt-list-all-draft.png), [r2-ctdt-detail-stepper-gui-phe-duyet.png](image/r2-ctdt-detail-stepper-gui-phe-duyet.png) | Giống Round 1 — **SRS không nói**: `srs-fr-03-dao-tao.md §FR-III-01 Inputs Khóa học row 3` chỉ khai báo `ctdt_id: identifier, Y, FK → CTDT` — không có ràng buộc state. | **Escalate BA + PM:** **không thể seed M6.1 Khóa học khi thiếu account CB_PD trong test env**. Cần 1 trong 3 action:<br>(a) **Provision CB_PD account** (vd `canbo_pd_tw_1`) trong `input/test-accounts.csv` → QA login CB_PD approve 4 CTDT fixture → DA_DUYET → seed Khóa học.<br>(b) **Seed trực tiếp DB** 4 CTDT ở `trangThai=DA_DUYET` (dev ops).<br>(c) **SRS clarify + UI relax**: cho CB_NV chọn CTDT mọi state khi tạo Khóa học (KH workflow không phụ thuộc CTDT state) → dev đổi filter FE. |
| **OBS-KH-002..004** (carry-over) | **Không duplicate** — xem Round 1 `bug-report-khoa-hoc.md`:<br>• OBS-KH-002: field "Số buổi học" không có trong SRS<br>• OBS-KH-003: form thiếu field `bai_giang_ids`<br>• OBS-KH-004: spinbutton "Sĩ số tối đa" có `valuemax=0 < valuemin=1` inconsistent | Confirm vẫn đúng ở Round 2 (snapshot form giống hệt Round 1) | Giữ nguyên đề xuất Round 1 — BA/FE chưa action. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP email (cookie HttpOnly, không bypass FE được) |
| Test tool | Chrome DevTools MCP (primary từ 2026-04-21) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho TC |
|---------------|---------|-----|-------------|
| canbo_tw_5 | CB_NV | TW | Toàn bộ 6 TC BLOCKED (không có quyền approve CTDT) |

### C — Danh mục ảnh chụp (Round 2 mới)

| File | Mô tả | Observation |
|------|-------|-------------|
| [r2-blocker-ctdt-dropdown-empty.png](image/r2-blocker-ctdt-dropdown-empty.png) | Form "Tạo khóa học mới" + dropdown "Chương trình đào tạo" expanded rỗng (hint "Chỉ hiển thị các chương trình đã được phê duyệt") | OBS-KH-001-R2 |
| [r2-ctdt-list-all-draft.png](image/r2-ctdt-list-all-draft.png) | List `/dao-tao/chuong-trinh/danh-sach` — 9 CTDT, toàn bộ column `Trạng thái = Dự thảo` | OBS-KH-001-R2 |
| [r2-ctdt-detail-stepper-gui-phe-duyet.png](image/r2-ctdt-detail-stepper-gui-phe-duyet.png) | Detail CTDT-BTP-TW-2026-0001 — stepper 5 node (Dự thảo active), action buttons `Lưu nháp / Gửi phê duyệt / Hủy chương trình` — **không có button "Phê duyệt"** (action dành cho CB_PD) | OBS-KH-001-R2 |

### D — Danh mục ảnh chụp (kế thừa Round 1)

| File | Mô tả | Observation |
|------|-------|-------------|
| [bug-kh-001-ctdt-dropdown-empty.png](image/bug-kh-001-ctdt-dropdown-empty.png) | Form Round 1 (giống hệt R2) | OBS-KH-001 (R1) |
| [blocker-ctdt-list-draft.png](image/blocker-ctdt-list-draft.png) | List CTDT R1 (4 fixture + 5 record QA khác, tất cả "Dự thảo") | OBS-KH-001 (R1) |

---

*Bug report generated: 2026-04-23 17:43 | QA Automation via Claude Code (Chrome DevTools MCP)*
