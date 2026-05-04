# Bug Report — Hỏi đáp pháp lý (M4 SM-HOIDAP, CREATE Round 1)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 15:46::15:55 (UTC+7) [2026-04-23] |
| **Loại test** | Functional — Seed CREATE 6 fixture |
| **Round** | Round 1 |
| **Tài liệu tham chiếu** | [functional-test-report.md](functional-test-report.md), [srs-fr-02-hoi-dap.md](../../../input/srs-v3/srs-fr-02-hoi-dap.md), [seed-fixture.yaml §M4](../../../input/data/seed-fixture.yaml) |

---

## Tổng hợp

**Phát hiện 0 (không) bug có SRS reference cụ thể trong scope CREATE M4 Round 1.**

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể. 4 quan sát phát hiện trong round này không map được clause SRS → ghi ở section `## Observations — ngoài SRS (không log bug)` cuối file, không tính vào severity count. Xem memory `feedback_bug_must_have_srs_ref`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 0    | 0        | 0     | 0      | 0     | 0       |

### Test result breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | CREATE SCR-II-01 → state MỚI | 6 | 6 | 0 | 0 | 0 | **100%** |
| **Total** | | **6** | **6** | **0** | **0** | **0** | **100%** |

→ **Happy-path Pass Rate = 6/6 (100%)**.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|-------------------|-------|--------|
| — | — | — | — | — | — | — | _Không có bug SRS-ref trong round này_ | — |

---

## Observations — ngoài SRS (không log bug) <a id="observations"></a>

> **Mục đích:** Ghi lại các quan sát trong quá trình test nhưng **không có SRS reference cụ thể** — không đủ căn cứ log thành bug formal. Nếu quan sát quan trọng, BA cần bổ sung SRS clause trước, rồi log bug round sau.

| # | Observation | Chi tiết / Evidence | SRS có nói không? | Đề xuất |
|---|-------------|---------------------|-------------------|---------|
| **1** | Lĩnh vực hiển thị `Thuế (updated)` — data contamination leak | Dropdown "Lĩnh vực pháp lý" trong form Thêm mới + cột "Lĩnh vực PL" trong list đều show `Thuế (updated)` (test suffix "(updated)" leak). Đã tạo record HD-20260423-002 với lĩnh vực này và persist đúng như database. | FR-II-01 §Outputs row 4 `ten_linh_vuc: text` — KHÔNG có clause nào yêu cầu "không chứa debug suffix". Đây là data-master issue (UC99 `LINH_VUC_PL` bị sửa test name), không phải HOIDAP bug. | **Không log lại** — đã log ở memory `qa_htpldn_vuviec_cr_round1`. BA/Admin đơn vị sửa tên lĩnh vực về `Thuế` ở trang Quản trị danh mục dùng chung. |
| **2** | Enum `LINH_VUC_PL` thiếu 2 giá trị fixture | Fixture M4[3]=`Hợp đồng`, M4[4]=`Doanh nghiệp` không tồn tại trong dropdown lĩnh vực. Dropdown hiện có: `Dân sự / Hình sự / Hành chính / Lao động / Đất đai / Hôn nhân gia đình / Kinh doanh thương mại / Khiếu nại tố cáo / Thuế (updated) / Sở hữu trí tuệ`. QA fallback: CR-003 → Lao động (vì HĐLĐ thuộc Luật Lao động), CR-004 → Kinh doanh thương mại (vì thủ tục vốn điều lệ thuộc luật DN/kinh doanh). | FR-II-01 §Inputs row 3 nói `linh_vuc_id` "từ UC99" — UC99 chính là DANH_MUC. SRS không liệt enum cụ thể. | BA/PO thống nhất danh sách `LINH_VUC_PL` theo business. Nếu cần giữ "Hợp đồng"/"Doanh nghiệp" thì bổ sung vào UC99. Nếu không, cập nhật seed-fixture.yaml để map sang giá trị có sẵn. |
| **3** | Form thêm field `Tiêu đề*` (required) KHÔNG có trong SRS FR-II-01 §Inputs | Drawer "Thêm mới hỏi đáp" có field `Tiêu đề*` (required) — counter và render UI hoàn chỉnh, lưu DB và hiển thị cột "Tiêu đề / Nội dung" ở list + detail. | FR-II-01 §Inputs chỉ liệt 9 field (noi_dung, linh_vuc_id, ten_nguoi_gui, email, sdt, doanh_nghiep_id, kenh_tiep_nhan, file). Không có `tieu_de`. flow-module.md §SM-HOIDAP Bước 1 CÓ nhắc "tiêu đề" nhưng SRS Inputs table không liệt. | BA bổ sung row `tieu_de: text, required/optional, max N chars` vào FR-II-01 §Inputs để đồng bộ với UI đã triển khai. Đồng thời bổ sung row vào §Outputs nếu cần expose. |
| **4** | Form thêm field `Ghi chú` (tối đa 2000 chars) KHÔNG có trong SRS FR-II-01 §Inputs | Drawer có group "Ghi chú" với textarea `Ghi chú` counter `0 / 2000`. | FR-II-01 §Inputs không có `ghi_chu`. | BA bổ sung row `ghi_chu: text, optional, max 2000` vào FR-II-01 §Inputs. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` (bypass dev bật) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 (fallback khi bypass tắt) |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design ProComponents (ProForm drawer) |
| Backend | NestJS + PostgreSQL (giả định) |
| Xác thực | JWT HttpOnly cookie + OTP email |
| Tool QA | Chrome DevTools MCP (primary, từ 2026-04-21) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho TC |
|---------------|---------|-----|-------------|
| `canbo_tw_5` | CB_NV | TW (Cục Bổ trợ tư pháp) | HOIDAP-CR-001 → 006 |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho TC |
|------|-------|-------------|
| [list-after-seed-6.png](image/list-after-seed-6.png) | Tab "Tất cả" sau seed 6 record — pagination `1-20 / 29 mục` | CR-001 → 006 overall |
| [tab-moi-6-records.png](image/tab-moi-6-records.png) | Tab "Mới" 14 mục (bao gồm 6 mới state `MỚI`) | Verify state routing |
| [detail-HD-001-state-moi.png](image/detail-HD-001-state-moi.png) | Detail `HD-20260423-001` — SM-HOIDAP step `1. Mới`, full field, SLA `24/04/2026` | CR-001 detail verify |

### D — Danh sách 6 data đã tạo (cho downstream test)

| # | Mã HD | UUID | Tiêu đề | Lĩnh vực | Kênh | Trạng thái |
|---|-------|------|---------|----------|------|-----------|
| 1 | HD-20260423-001 | `a7aa1b1e-1dd0-47d8-80a2-f28cced5bbd7` | Hỏi về thời gian nghỉ phép năm | Lao động | Trực tiếp | MỚI |
| 2 | HD-20260423-002 | `0672616d-e03d-449c-b49d-b009ad8846ad` | Hoàn thuế GTGT đầu vào hàng nhập khẩu | Thuế (updated) | Dịch vụ công | MỚI |
| 3 | HD-20260423-003 | `8a177c84-5223-43bb-8482-f3036e3b4548` | Thời hạn HĐ lao động xác định thời hạn | Lao động | Cổng PLQG | MỚI |
| 4 | HD-20260423-004 | `a78bb5bd-06d4-44f5-ad7c-85531eb76a90` | Thủ tục tăng vốn điều lệ công ty TNHH 2 thành viên | Kinh doanh thương mại | Hệ thống khác | MỚI |
| 5 | HD-20260423-005 | `f8818f86-66ce-48ec-91c3-fab65c234a0f` | Thủ tục đăng ký bảo hộ nhãn hiệu cho sản phẩm mới | Sở hữu trí tuệ | Trực tiếp | MỚI |
| 6 | HD-20260423-006 | `038af556-9941-4295-9b6e-74539c1b3001` | Quyền thế chấp khi thuê đất KCN trả tiền hàng năm | Đất đai | Cổng PLQG | MỚI |

### E — Console warnings (Ant Design library deprecation — ngoài scope bug)

3 deprecation warnings xuất hiện trên Detail page:
1. `Warning: [rc-collapse] children will be removed in next major version. Please use items instead.`
2. `Warning: [antd: Descriptions] contentStyle is deprecated. Please use styles.content instead.`
3. `Warning: [antd: Descriptions] Sum of column span in a line not match column of Descriptions.`

→ Library-level deprecation, không ảnh hưởng chức năng. Dev nên migrate API trong sprint bảo trì FE. Không phải SRS bug.

---

*Bug report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP, Opus 4.7 1M)*
