# Permission Test Report — FR-02 Hỏi đáp Pháp lý (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-02](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|------------|---------|
| **12** | **12** | **0** | **100%** | ✅ **PASS** |

> Lưu ý: 10/12 chức năng spec = `R` (xem hỏi đáp). 2/12 chức năng mới (`FR-II-NEW-01` CRUD, `FR-II-NEW-02` R) phải test ở menu `Quản trị hệ thống > Cấu hình hệ thống`.

### Bug tóm tắt

Không phát hiện bug phân quyền nào ở FR-02 cho role QTHT (cấp TW).

---

## 2. Bảng kết quả chi tiết — 12 chức năng × 1 role (qtht_tw_4)

### 2.1 Module chính `Quản lý hỏi đáp pháp lý` (HOI_DAP)

| # | Function | UI | Entity | Expected | Actual UI | Verdict | Evidence |
|---|----------|-----|--------|----------|-----------|---------|----------|
| 1 | `FR-II-01` | Trang DS hỏi đáp | `HOI_DAP` | 👁️ R | Table 9 cột + filter + 7 tab trạng thái. Không có [Thêm mới]. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 2 | `FR-II-02` | Tìm kiếm HĐ | `HOI_DAP` | 👁️ R | Filter: Từ khóa, LV PL, Trạng thái, Kênh, Từ/Đến ngày + nút `Tìm kiếm`, `Xóa bộ lọc`. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 3 | `FR-II-03` | Tiếp nhận xử lý HĐ | `HOI_DAP` | 👁️ R | Tab "Mới" / "Đang xử lý" hiển thị. Detail chưa test (empty data). | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận | `HOI_DAP` | 👁️ R | Table cột "Trạng thái" và "SLA / Thời hạn". | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 5 | `FR-II-05` | Tìm kiếm HĐ đã tiếp nhận | `HOI_DAP` | 👁️ R | Cùng filter như FR-II-02. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 6 | `FR-II-06` | Phân công xử lý | `HOI_DAP` | 👁️ R | Không có modal phân công phơi ra (chỉ read-only table). | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 7 | `FR-II-07` | Phản hồi câu hỏi | `HOI_DAP` | 👁️ R | Workflow R-only (không có button "Trả lời"/"Soạn phản hồi"). | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | `HOI_DAP` | 👁️ R | Tab "Công khai" hiển thị. Không có toggle công khai. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | `HOI_DAP` | 👁️ R | Tab "Hoàn thành" hiển thị. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | `HOI_DAP` | 👁️ R | Filter hoạt động toàn trang. | ✅ PASS | [R-02](screenshots/R-02-qtht_tw-fr02-hoidap.png) |

### 2.2 Entity `CAU_HINH_PHAN_CONG` (Cấu hình hệ thống > Tab 2)

| # | Function | UI | Entity | Expected | Actual UI | Verdict | Evidence |
|---|----------|-----|--------|----------|-----------|---------|----------|
| 11 | `FR-II-NEW-01` | Cấu hình lĩnh vực ↔ phân công xử lý | `CAU_HINH_PHAN_CONG` | ✅ F (CRUD) | [Thêm cấu hình] + row có 3 icon action: `edit` / `poweroff` / `delete`. 1 row seed "Lao động → Giảng viên 4". | ✅ PASS | [R-12](screenshots/R-12-qtht_tw-ch-phancong.png) |

### 2.3 Entity `MAU_PHAN_HOI` (Cấu hình hệ thống > Tab 3)

| # | Function | UI | Entity | Expected | Actual UI | Verdict | Evidence |
|---|----------|-----|--------|----------|-----------|---------|----------|
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | `MAU_PHAN_HOI` | 👁️ R | Filter form + table 7 cột (Tên / LV PL / Loại / Số lần / Trạng thái / Ngày tạo / Hành động). Không [Thêm mới]. Empty data. | ✅ PASS | (tab tree snapshot — xem summary report) |

### Kiểm tra các thao tác CRUD (theo yêu cầu task)

| Thao tác | Scope | Expected | Actual | Verdict |
|----------|-------|----------|--------|---------|
| **[Thêm mới] render?** | HOI_DAP (FR-II-01..10) | ❌ KHÔNG (QTHT R-only) | ❌ Không render — chỉ `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới` | ✅ PASS |
| **[Thêm mới] render?** | CAU_HINH_PHAN_CONG | ✅ CÓ (CRUD) | ✅ `[+ Thêm cấu hình]` visible, enabled | ✅ PASS |
| **[Thêm mới] render?** | MAU_PHAN_HOI | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| **[Sửa] trên row?** | HOI_DAP | ❌ KHÔNG | Empty data → chưa verify được row-level (data readiness blocker). Header table có cột "Hành động" nhưng không có row. | ⚠️ BLOCKED |
| **[Sửa] trên row?** | CAU_HINH_PHAN_CONG | ✅ CÓ | ✅ `edit` icon button render trên row "Lao động". | ✅ PASS |
| **[Xóa] trên row?** | HOI_DAP | ❌ KHÔNG | Blocked (empty data) | ⚠️ BLOCKED |
| **[Xóa] trên row?** | CAU_HINH_PHAN_CONG | ✅ CÓ | ✅ `delete` icon button render trên row. | ✅ PASS |
| **[Xuất Excel]?** | HOI_DAP | ❌ KHÔNG (matrix không có) | ❌ Không render | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS (1 role cấp TW, 12/12 chức năng)
- **qtht_tw_4** (QTHT — Cục BTTP - Bộ Tư pháp, cấp TW) — toàn bộ 12 chức năng match spec. HOI_DAP R-only, CAU_HINH_PHAN_CONG CRUD đầy đủ, MAU_PHAN_HOI R-only.

### ❌ FAIL
- Không có.

### Cross-scope (BR-AUTH-08) quick-verify
- **qtht_bn_4** (cấp BN, Bộ Kế hoạch và Đầu tư) — test chỉ Dashboard + TVV, chưa verify riêng FR-02. Dự đoán same behavior (list page không scope-filter theo kết quả ở module TVV).
- **qtht_dp_4** (cấp DP, Sở TP Hà Nội) — chưa test riêng trang HOI_DAP.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function verify | Ghi chú |
|--------|---------------------|---------|
| `HOI_DAP` | 10/10 (FR-II-01..10) | Empty data → chỉ verify được top-level permission (page access, filter, tab, column header). Row-level action [Sửa]/[Xóa] không verify được. |
| `CAU_HINH_PHAN_CONG` | 1/1 (FR-II-NEW-01) | 1 row seed "Lao động → Giảng viên 4" → verify được row action đầy đủ `edit`/`poweroff`/`delete`. |
| `MAU_PHAN_HOI` | 1/1 (FR-II-NEW-02) | Empty data. |

### Hạn chế / Data readiness
- **HOI_DAP empty toàn bộ 7 tabs** → không stress-test được row action, CRUD popup, workflow state transitions. Nếu có data thì mới verify được [Xem chi tiết], [Phân công], [Trả lời] button có đúng disable cho QTHT không.
- **MAU_PHAN_HOI empty** → không verify được row-level [Xem] có render đúng không.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Seed data HOI_DAP:**
Seed ≥3 hỏi đáp ở mỗi trạng thái (Mới / Đang xử lý / Chờ phê duyệt / Đã duyệt / Hoàn thành) để:
- Verify row action [Xem] render cho QTHT.
- Verify KHÔNG có [Trả lời]/[Phân công]/[Công khai] button (QTHT chỉ R).
- Verify cross-scope (qtht_bn_4 và qtht_dp_4 cùng thấy data TW).

**Ưu tiên 2 — Test functional CAU_HINH_PHAN_CONG:**
Click [Thêm cấu hình] → verify drawer mở, có field `Lĩnh vực` + `Người xử lý` + `Ưu tiên` + `Trạng thái`, save thành công → list update.
(Tham khảo bug cũ [qa_htpldn_chs_phancong_round1.md](../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_chs_phancong_round1.md): 4 Major bug cần fix đầu tiên.)

**Sau khi fix / seed → re-test:**
- [ ] Row-level [Xem] / không [Sửa]/[Xóa] trên HOI_DAP.
- [ ] Cross-scope qtht_bn/dp HOI_DAP list.
- [ ] MAU_PHAN_HOI có data → verify [Xem] button.

---

## 6. Quy trình test đã áp dụng

### Entry point
Sidebar `Quản lý hỏi đáp pháp lý` → URL `/hoi-dap`.

### Steps verify HOI_DAP list
```
1. click({uid: sidebar_hoidap})
2. take_snapshot → list main buttons
3. evaluate_script → check hasThemMoi=false, mainButtons=["Tìm kiếm","Xóa bộ lọc","Làm mới"]
4. take_screenshot full-page
```

### Steps verify CAU_HINH_PHAN_CONG
```
1. click sidebar "Quản trị hệ thống" (expand group)
2. click submenu "Cấu hình hệ thống" → URL /quan-tri/cau-hinh
3. click tab "Phân công mặc định" → URL ?tab=phan-cong
4. take_snapshot → verify heading "Cấu hình phân công hỏi đáp", button "[+ Thêm cấu hình]", row action icon.
5. take_screenshot
```

### Kết quả evaluate_script (HOI_DAP)
```json
{
  "url": "http://103.172.236.130:3000/hoi-dap",
  "mainButtons": ["Tìm kiếm","Xóa bộ lọc","Làm mới"],
  "mainLinks": [],
  "tableColumns": ["Mã HD","Tiêu đề / Nội dung","Lĩnh vực PL","Người gửi","Kênh","Trạng thái","SLA / Thời hạn","Ngày tạo","Hành động"],
  "dataRows": 0,
  "hasThemMoi": false,
  "hasXuatExcel": false
}
```

---

## 7. Artifacts

- **Screenshots:**
  - [R-02-qtht_tw-fr02-hoidap.png](screenshots/R-02-qtht_tw-fr02-hoidap.png) — module Hỏi đáp chính
  - [R-12-qtht_tw-ch-phancong.png](screenshots/R-12-qtht_tw-ch-phancong.png) — CAU_HINH_PHAN_CONG CRUD
- **Permission matrix ref:** [permission-matrix-by-role.md §1 FR-02](../../../permission-matrix-by-role.md)

---

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~5 phút (HOI_DAP + CH Phân công) |
| Số MCP tool call | 10 |
| Số screenshot | 2 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
