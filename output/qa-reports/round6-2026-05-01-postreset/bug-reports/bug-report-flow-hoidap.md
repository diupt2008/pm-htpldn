# Bug Report — Workflow Hỏi đáp (R6.4.A4)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code via MCP Chrome DevTools) |
| **Ngày** | 2026-05-02 |
| **Loại test** | Workflow E2E |
| **Round** | Round 11 |
| **Tài liệu tham chiếu** | [workflow-test-report-HoiDap.md](../workflow/workflow-test-report-HoiDap.md) · SRS FR-02 SM-HOIDAP §⑦ |

---

## Tổng hợp

**0 bug mới** trong session test R6.4.A4 (R11). Workflow E2E PASS 11/11 transition manual. 1 observation chuyển reference đến bug đã log:

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể + chưa được log ở file khác. Observation #1 dưới đã có bug ID đang Open ở bug-report-seed-qtht.md (BUG-FUNC-MPH-001) — KHÔNG log lại trong file này.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 0    | 0        | 0     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| — | — | — | — | — | — | (Không có bug log mới trong R11) | — |

---

## Observations (không log thành bug)

### OBS-FLOW-HOIDAP-001 — Khối "Nội dung phản hồi" thiếu dropdown chọn Mẫu phản hồi

> **Status:** Already tracked as **BUG-FUNC-MPH-001** Major Open ở [bug-report-seed-qtht.md](bug-report-seed-qtht.md). Cause cùng root: tab MPH `/quan-tri/cau-hinh?tab=mau-phan-hoi` toolbar chỉ 4 button (Tìm kiếm/Xóa bộ lọc/Làm mới/clear input), KHÔNG có [Thêm mới] → DM `MAU_PHAN_HOI` rỗng → dropdown UI không có option.

**Hiện tượng R11 (Workflow A4):** Khi HD ở `DANG_XU_LY`, khối "Soạn phản hồi" hiển thị 3 textarea freeform (Nội dung phản hồi `*` / Văn bản pháp luật / Gợi ý cho doanh nghiệp). KHÔNG có dropdown `Mẫu phản hồi` như SRS line 450 quy định.

**SRS reference:** `02-thu-tu-module.md` line 450:
> "Khối 'Nội dung phản hồi' (tĩnh, không thuộc accordion) | Cột `noi_dung_phan_hoi` trong `HOI_DAP` | Rich Text editor để soạn phản hồi + dropdown chọn **Mẫu phản hồi** (`MAU_PHAN_HOI` — do QTHT cấu hình ở FR-10)"

**Verify lại sau khi BUG-FUNC-MPH-001 closed.**

### OBS-FLOW-HOIDAP-002 — Modal "Bạn không phải người được phân công"

**Hiện tượng:** Khi `cb_nv_tw_01` (assigner, không phải `nguoi_xu_ly` đã chỉ định cho `cg_tw_01`) submit phản hồi, system show modal `"Bạn không phải người được phân công. Vẫn muốn phản hồi?"` trước khi proceed.

**SRS reference:** `02-thu-tu-module.md` line 450 condition:
> "Chỉ hiển thị khi HĐ ở `DANG_XU_LY` hoặc `DA_TRA_LOI` **VÀ** user là người được phân công xử lý hoặc là CB NV cùng đơn vị"

**Phân loại:** UX courtesy — KHÔNG phải bug. SRS cho phép cả "người xử lý" và "CB NV cùng đơn vị" submit. Modal này nhắc nhở user chứ không block. Workflow vẫn proceed sau click [Có].

### OBS-FLOW-HOIDAP-003 — Stepper UI có 7 step (vs SRS 9 state)

**Hiện tượng:** UI hiển thị stepper 7 step: Mới → Tiếp nhận → Đang xử lý → Chờ phê duyệt → Đã duyệt → Công khai → Hoàn thành. Bỏ qua state `DA_TRA_LOI` và `HUY` khỏi stepper.

**SRS reference:** SM-HOIDAP có 9 state per srs-v3 §C.1 enum (`MOI`/`TIEP_NHAN`/`DANG_XU_LY`/`DA_TRA_LOI`/`CHO_PHE_DUYET`/`DA_DUYET`/`CONG_KHAI`/`HOAN_THANH`/`HUY`).

**Phân loại:** UX simplification — KHÔNG phải bug. State `DA_TRA_LOI` chỉ tồn tại tạm thời (auto-transition CHO_PHE_DUYET via BR-FLOW-01). State `HUY` là terminal alternative branch. Hiển thị 7 step dễ hiểu hơn cho người dùng.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm — verified) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-02 | QA Automation via Claude Code*
