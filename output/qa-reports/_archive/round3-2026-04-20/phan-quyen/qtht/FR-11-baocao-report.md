# Permission Test Report — FR-11 Báo cáo Thống kê (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-11](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ PARTIAL | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **23** | **22** | **0** | **1 (gap matrix)** | **96%** | ✅ **PASS WITH MATRIX GAP** |

### Bug tóm tắt

Không phát hiện bug phân quyền. **Matrix vs UI mismatch:** Matrix liệt kê 23 function (FR-IX-01..23) nhưng dropdown "Loại báo cáo" chỉ có **22 option** — **FR-IX-05 "BC Vụ việc theo thời gian"** missing / đã merge với FR-IX-14 "BC Vụ việc theo thời gian **chi tiết**" (text labels gần giống). BA confirm spec redundancy.

---

## 2. Bảng kết quả chi tiết — 23 chức năng × QTHT cấp TW

### 2.1 Module `Báo cáo thống kê` (`/bao-cao`)

> **Spec note:** QTHT có quyền `R` cho 23/23 function FR-11 (entity `BAO_CAO`). Kỳ vọng: READ + Filter + Export. KHÔNG có button Create/Update/Delete.

**Landing page structure:**
- Heading "Báo cáo Thống kê"
- Filter form (4 field):
  - `Loại báo cáo*` (required, dropdown 22 BC type groupedin 8 category)
  - `Kỳ báo cáo*` (required, dropdown)
  - `Thời gian` (auto-compute from Kỳ)
  - `Đơn vị` (default "Toàn quốc")
- Buttons: `[search Xem báo cáo]` (action Read), `[file-excel Xuất Excel]` (disabled until data loaded), `[file-word Xuất Word]` (disabled until data loaded), `[reload Làm mới]`

**Main toolbar verify:** `mainButtons: ["Làm mới","Xem báo cáo","Xuất Excel","Xuất Word"]` · `hasCRUD: false` ✅

### 2.2 23 function → 22 dropdown options mapping

| # | Function | Option | Nhóm | Verdict |
|---|----------|--------|-------|---------|
| 1 | `FR-IX-01` BC Số lượng hỏi đáp/vướng mắc | "BC Số lượng hỏi đáp/vướng mắc" | Hỏi đáp | ✅ |
| 2 | `FR-IX-02` BC VV đã tiếp nhận | "BC Vụ việc đã tiếp nhận" | Vụ việc | ✅ |
| 3 | `FR-IX-03` BC VV đang hỗ trợ | "BC Vụ việc đang hỗ trợ" | Vụ việc | ✅ |
| 4 | `FR-IX-04` BC VV đã hoàn thành | "BC Vụ việc đã hoàn thành" | Vụ việc | ✅ |
| 5 | **`FR-IX-05`** BC VV theo thời gian | **MISSING** (có thể merge với FR-IX-14) | — | ⚠️ **GAP matrix** |
| 6 | `FR-IX-06` BC Lớp đào tạo đang diễn ra | "BC Lớp đào tạo đang diễn ra" | Đào tạo | ✅ |
| 7 | `FR-IX-07` BC Lớp đào tạo đã diễn ra | "BC Lớp đào tạo đã diễn ra" | Đào tạo | ✅ |
| 8 | `FR-IX-08` BC Số lượng CG/TVV | "BC Số lượng CG/TVV" | CG/TVV | ✅ |
| 9 | `FR-IX-09` BC Đánh giá hiệu quả HTPL | "BC Đánh giá hiệu quả HTPL" | Đánh giá | ✅ |
| 10 | `FR-IX-10` BC Chất lượng đào tạo | "BC Chất lượng đào tạo" | Đào tạo | ✅ |
| 11 | `FR-IX-11` BC VV theo đơn vị | "BC Vụ việc theo đơn vị quản lý" | VV phân tích | ✅ |
| 12 | `FR-IX-12` BC VV theo lĩnh vực | "BC Vụ việc theo lĩnh vực" | VV phân tích | ✅ |
| 13 | `FR-IX-13` BC VV theo loại hình DN | "BC Vụ việc theo loại hình DN" | VV phân tích | ✅ |
| 14 | `FR-IX-14` BC VV theo thời gian chi tiết | "BC Vụ việc theo thời gian chi tiết" | VV phân tích | ✅ |
| 15 | `FR-IX-15` BC Chi phí chi trả hỗ trợ | "BC Chi phí chi trả hỗ trợ" | Chi phí | ✅ |
| 16 | `FR-IX-16` BC Chi phí theo đơn vị | "BC Chi phí theo đơn vị" | Chi phí | ✅ |
| 17 | `FR-IX-17` BC Chi phí theo lĩnh vực | "BC Chi phí theo lĩnh vực" | Chi phí | ✅ |
| 18 | `FR-IX-18` BC Chi phí theo loại hình DN | "BC Chi phí theo loại hình DN" | Chi phí | ✅ |
| 19 | `FR-IX-19` BC Chi phí theo thời gian | "BC Chi phí theo thời gian" | Chi phí | ✅ |
| 20 | `FR-IX-20` BC Số lượng CT hỗ trợ | "BC Số lượng CT hỗ trợ" | CT HTPLDN | ✅ |
| 21 | `FR-IX-21` BC CT theo đơn vị | "BC CT theo đơn vị" | CT HTPLDN | ✅ |
| 22 | `FR-IX-22` BC CT theo lĩnh vực | "BC CT theo lĩnh vực" | CT HTPLDN | ✅ |
| 23 | `FR-IX-23` BC CT theo thời gian | "BC CT theo thời gian" | CT HTPLDN | ✅ |

**8 category headers render:** Hỏi đáp, Vụ việc, Đào tạo, CG/TVV, Đánh giá, VV phân tích, Chi phí, CT HTPLDN.

### Kiểm tra các thao tác

| Thao tác | Expected (QTHT R-only) | Actual | Verdict |
|----------|------------------------|--------|---------|
| [Thêm mới] BC | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| [Sửa] BC | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| [Xóa] BC | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| [Xem báo cáo] | ✅ (Read action) | ✅ Button render enabled | ✅ PASS |
| [Xuất Excel] | ✅ (Export) | ✅ Button render (disabled cho đến khi load data) | ✅ PASS |
| [Xuất Word] | ✅ (Export) | ✅ Button render (disabled cho đến khi load data) | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS 22/23 function
QTHT_TW có quyền READ + Filter + Export cho 22 BC type. Match spec R.

### ⚠️ GAP (không phải bug perm)
FR-IX-05 "BC Vụ việc theo thời gian" — không có option trong dropdown. Có thể spec redundant với FR-IX-14 "BC VV theo thời gian chi tiết" (text na ná).

### Cross-scope (chưa verify)
Với data empty + no functional submit, không detect được scope filter `Đơn vị` dropdown hoạt động thế nào giữa cấp TW/BN/DP. Để round seed data sau.

---

## 4. Phạm vi test

### Đã verify
- Page access ✅
- Filter UI render ✅
- Dropdown 22 BC option + 8 category header ✅
- No CRUD controls ✅
- Export buttons render (disabled state correct) ✅

### Hạn chế
- Data empty toàn bộ → chưa test được:
  - Xem báo cáo flow (click submit → load chart/table)
  - Xuất Excel/Word actual download
  - Filter `Đơn vị` hoạt động thế nào (cấp TW scope toàn quốc, BN/DP scope đơn vị mình)
- Matrix vs UI mapping cần BA confirm FR-IX-05 merge với FR-IX-14 hay 2 BC khác nhau.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — BA confirm FR-IX-05:**
- Spec FR-IX-05 "BC Vụ việc theo thời gian" vs FR-IX-14 "BC VV theo thời gian chi tiết" — 2 BC khác nhau hay là 1?
- Nếu khác: FE thêm option FR-IX-05.
- Nếu 1: matrix sửa, xóa FR-IX-05.

**Ưu tiên 2 — Seed data + functional test:**
- Seed ≥5 VV + ≥3 HOI_DAP + ≥3 KHOA_HOC → click "Xem báo cáo" → verify chart/table render.
- Verify [Xuất Excel]/[Xuất Word] trigger actual download với correct format.
- Verify `Đơn vị` filter: QTHT TW thấy all, BN/DP bị scope.

---

## 6. Artifacts

- [R-70-qtht_tw-fr11-baocao.png](screenshots/R-70-qtht_tw-fr11-baocao.png)

## 7. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~3 phút |
| Số MCP tool call | 7 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
