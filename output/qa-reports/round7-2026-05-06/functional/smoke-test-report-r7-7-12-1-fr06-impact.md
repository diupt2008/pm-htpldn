# Smoke Regression IMPACT — R7.7.12.1 (FR-06 Chi trả lan ảnh hưởng)

**Ngày:** 2026-05-07 18:05 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Trigger:** SRS update FR-06 Chi trả v3.5 → cần verify 4 module IMPACT (FR-07/08/11/13) còn render được, không bị break sidemodule.
**Scope:** Smoke 5 phút × 4 module — nav + render + console clean. KHÔNG test functional, KHÔNG seed data.
**Phân loại Rule 4 (CLAUDE user-level):** Nhóm C IMPACT only — sample đại diện, không retest full.

---

## Kết quả: ✅ PASS 4/4

Cả 4 module IMPACT đều render OK, không có console error/warn, sidebar nav hoạt động, không bị regression do FR-06 Chi trả update.

---

## Bảng kết quả

| # | Module | FR | Sidebar uid | URL render | Heading | Console error | Screenshot |
|---|---|:-:|:-:|---|---|:-:|---|
| 1 | Quản lý DN được hỗ trợ | FR-07 | `4_14` | `/doanh-nghiep/danh-sach` | "Quản lý Doanh nghiệp" L4 | ✅ 0 | [fr07-dn-23-records.png](r7-7-12-1-fr07-dn-23-records.png) |
| 2 | Đánh giá hiệu quả HTPL | FR-08 | `4_15` | `/danh-gia/ke-hoach/danh-sach` | "Kế hoạch đánh giá" L4 | ✅ 0 | [fr08-danh-gia-empty.png](r7-7-12-1-fr08-danh-gia-empty.png) |
| 3 | Báo cáo Thống kê | FR-11 | `4_19` | `/bao-cao` | "Báo cáo Thống kê" L3 | ✅ 0 | [fr11-bao-cao.png](r7-7-12-1-fr11-bao-cao.png) |
| 4 | Tư vấn nhanh | FR-13 | `4_17` → `12_2` | `/tv-nhanh/danh-sach` | "Quản lý Tư vấn Nhanh" L4 | ✅ 0 | [fr13-tv-nhanh-empty.png](r7-7-12-1-fr13-tv-nhanh-empty.png) |

---

## Chi tiết từng module

### FR-07 — Quản lý Doanh nghiệp
- URL: `/doanh-nghiep/danh-sach`
- Filter form: Từ khóa / Tỉnh-Thành / Quy mô / Ngành nghề / Lĩnh vực KD / Date range (Từ ngày - Đến ngày).
- Table columns (9): Mã DN / Tên DN / MST / Quy mô / Ngành nghề / Địa chỉ / Số lần HT / Tổng chi phí / Hành động.
- Pagination "1-20 / **23 mục**" (page 1/2).
- ⚠️ **Note discrepancy:** R7.2.4 seed report claim 36 DN, smoke đếm 23 → có thể có hard-delete batch gần đây. Không phải lỗi FR-06, không block smoke.

### FR-08 — Đánh giá hiệu quả HTPL
- URL: `/danh-gia/ke-hoach/danh-sach`
- Filter form: Từ khóa / Tần suất / Đối tượng / Date range.
- 11 status tabs: Tất cả / Lập kế hoạch / Phân công / Chờ duyệt PC / Thực hiện / Đang đánh giá / Đã đánh giá / Lập báo cáo / Chờ phê duyệt / Hoàn thành / Hủy.
- Table columns: Mã kế hoạch / Tên đợt / Tần suất / Đối tượng / Từ ngày / Đến ngày / Số vụ việc / Trạng thái / Ngày tạo.
- Empty state: "Không có kế hoạch đánh giá nào phù hợp." — expected, R7.6.X workflow chưa run.

### FR-11 — Báo cáo Thống kê
- URL: `/bao-cao`
- Form filter: Loại báo cáo `*` / Kỳ báo cáo `*` / Thời gian (—) / Đơn vị (default "Toàn quốc").
- Buttons: Xem báo cáo / Xuất Excel (disabled) / Xuất Word (disabled) — disabled cho đến khi gen báo cáo xong.
- Render OK, không cần data trước khi gen báo cáo.

### FR-13 — Tư vấn nhanh
- URL: `/tv-nhanh/danh-sach`
- Path: Sidebar "Quản lý tư vấn" (uid `4_17`) → submenu expand 3 items: Tư vấn chuyên sâu / Kho câu hỏi / **Tư vấn nhanh** (uid `12_2`).
- Filter form: Từ khóa / Trạng thái / Date range.
- 4 status tabs: Tất cả / Chờ xử lý / Đã gợi ý / Hoàn thành.
- Table columns (8): Mã phiên / Câu hỏi DN / Kênh / Số gợi ý / Trạng thái / Ngày gửi / Ngày cập nhật / Hành động.
- Empty state: "Không có phiên tư vấn nhanh nào." — expected.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP (`mcp__chrome-devtools__*`).
**Setup:** Session login từ trước (qtht_02 / Secret@123 / OTP 666666 bypass).
**Pattern mỗi module:**
1. `click({uid: <sidebar_uid>})` — React Router internal nav (per MCP-Rule 3).
2. `wait_for({text: [<heading keyword>]})` — signal-based timeout 15s.
3. `take_snapshot` — verify URL, heading, filter form, table columns, empty state / pagination.
4. `list_console_messages({types: ["error","warn"]})` — verify 0 noise.
5. `take_screenshot` — evidence.

**KHÔNG test:** functional CRUD, seed data, workflow trạng thái, permission cross-role. Smoke purpose là verify render không break do FR-06 Chi trả update.

---

## Kết luận

✅ **R7.7.12.1 PASS** — FR-06 Chi trả v3.5 update KHÔNG gây regression render ở 4 module IMPACT (FR-07/08/11/13). Sẵn sàng đóng task R7.7.12.1.

**Follow-up khác (không block smoke):**
- ⚠️ Discrepancy DN count 23 vs 36 (R7.2.4) — cần investigate riêng (data hard-delete batch?).
- FR-08/13 empty state expected — sẽ có data khi R7.6.X / R7.7.13 functional run.

---

*2026-05-07 18:05 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
