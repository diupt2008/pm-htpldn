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

**0 bug mới** trong session test R6.4.A4 (R11). Workflow E2E PASS 11/11 transition manual. 1 observation về dropdown MPH thiếu data — cause: R6.1.5 chưa re-execute (chuyển vai trò seed sang `cb_nv_tw_01` theo SRS §3.4.2 + FR-II-NEW-02 Mô hình B). KHÔNG log thành bug.

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể + chưa được log ở file khác. Observation #1 dưới đây là gap data (DM rỗng), không phải bug FE — sau khi R6.1.5 re-execute bằng `cb_nv_tw_01` xong sẽ retest. BUG-FUNC-MPH-001 ở bug-report-seed-qtht.md đã Closed/Invalid 2026-05-05 R12 (log sai vai trò QTHT).

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

> **Status (update 2026-05-05 R12):** Root cause là **DM `MAU_PHAN_HOI` rỗng** vì R6.1.5 chưa seed (chuyển vai trò seed sang `cb_nv_tw_01` theo SRS §3.4.2 + FR-II-NEW-02 Mô hình B). KHÔNG còn link tới BUG-FUNC-MPH-001 (đã Closed/Invalid — log sai vai trò QTHT). Sau khi R6.1.5 re-execute xong → retest dropdown.

**Hiện tượng R11 (Workflow A4):** Khi HD ở `DANG_XU_LY`, khối "Soạn phản hồi" hiển thị 3 textarea freeform (Nội dung phản hồi `*` / Văn bản pháp luật / Gợi ý cho doanh nghiệp). KHÔNG có dropdown `Mẫu phản hồi` như SRS line 450 quy định.

**SRS reference:** `02-thu-tu-module.md` line 450 (legacy v3):
> "Khối 'Nội dung phản hồi' (tĩnh, không thuộc accordion) | Cột `noi_dung_phan_hoi` trong `HOI_DAP` | Rich Text editor để soạn phản hồi + dropdown chọn **Mẫu phản hồi** (`MAU_PHAN_HOI`)"

**Updated spec:** [`srs-update-2026-5-4/srs-fr-02-hoi-dap.md` row 19](../../../../input/srs-update-2026-5-4/srs-fr-02-hoi-dap.md) — Mô hình B Hybrid: dropdown filter `linh_vuc_id = câu hỏi` AND `trang_thai = KICH_HOAT` AND scope MPH_READ; nhóm 2 nhóm "Mẫu khung quốc gia (TW)" + "Mẫu của đơn vị bạn".

**Verify lại sau khi R6.1.5 re-execute xong (cb_nv_tw_01 seed ≥6 mẫu TW khung).**

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
