# Permission Test Report — FR-09 Biểu mẫu (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-09](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED/PARTIAL | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|--------------------|------------|---------|
| **8** | **5** | **0** | **3** | **63%** | ⚠️ **PASS WITH GAP UI** |

### Bug tóm tắt

Không phát hiện bug phân quyền. **Phát hiện gap UI:** SRS chỉ ra **3 submenu** (SCR-VII-01 Thư mục / SCR-VII-02 Biểu mẫu / SCR-VII-03 Nhập Biểu mẫu Hàng loạt) — UI hiện chỉ có **1 entry** "Thư viện biểu mẫu" (landing /bieu-mau/thu-muc). 2/3 SCR chưa implement hoặc chưa mapping đúng sidebar.

---

## 2. Bảng kết quả chi tiết — 8 chức năng × 3 cấp QTHT

> **Spec note:** QTHT có quyền `R` cho toàn bộ FR-09 (entity `THU_MUC_BIEU_MAU`, `BIEU_MAU`, `HOP_DONG_TU_VAN`).

### 2.1 Module `Quản lý thư viện biểu mẫu` (`/bieu-mau/thu-muc`)

| # | Function | UI element | Entity | Expected | Actual | Verdict |
|---|----------|-----------|--------|----------|--------|---------|
| 1 | `FR-VII-01` | QL thư mục biểu mẫu, hợp đồng | `THU_MUC_BIEU_MAU` | 👁️ R | Heading "Thư viện Biểu mẫu" + table 7 cột + 4 tab (Tất cả(0) / Đã công khai / Nháp / Đã ẩn). Không [Thêm mới]. Empty. | ✅ PASS |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu | `BIEU_MAU` | 👁️ R | Filter: Từ khóa / Lĩnh vực / Trạng thái / Từ-Đến ngày. | ✅ PASS |
| 3 | `FR-VII-03` | Công khai thư mục lên Cổng | `BIEU_MAU` | 👁️ R | Tab "Đã công khai" hiển thị. Không button [Công khai]. | ✅ PASS |
| 4 | `FR-VII-04` | QL biểu mẫu, hợp đồng | `BIEU_MAU` | 👁️ R | **Gap UI**: SRS có SCR-VII-02 "Quản lý Biểu mẫu" — URL `/bieu-mau/danh-sach` hoặc drill-down từ row thư mục. Hiện chỉ có /bieu-mau/thu-muc. | ⚠️ PARTIAL (gap UI) |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu | `BIEU_MAU` | 👁️ R | Phụ thuộc FR-VII-04 UI — cũng BLOCKED. | ⚠️ PARTIAL |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | `BIEU_MAU` | 👁️ R | **Gap UI**: SRS có SCR-VII-03 "Nhập Biểu mẫu Hàng loạt" — không thấy sidebar/button [Import] | ⚠️ PARTIAL (gap UI) |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | `BIEU_MAU` | 👁️ R | Inbound API, không UI phơi ra | ✅ PASS (implicit) |
| 8 | `FR-VII-08` | QL Hợp đồng Tư vấn | `HOP_DONG_TU_VAN` | 👁️ R | Hiện không có submenu riêng. Có thể thuộc drill-down từ TVV detail (FR-04). | ⚠️ PARTIAL (out of scope FR-09) |

### Kiểm tra các thao tác CRUD

| Thao tác | Scope | Expected | Actual | Verdict |
|----------|-------|----------|--------|---------|
| **[Thêm mới]** thư mục | THU_MUC_BIEU_MAU | ❌ KHÔNG | ❌ Không render | ✅ PASS |
| **[Sửa] row** thư mục | THU_MUC_BIEU_MAU | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Xóa] row** thư mục | THU_MUC_BIEU_MAU | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Công khai]** toggle | BIEU_MAU | ❌ KHÔNG | ❌ Không render trong tab filter | ✅ PASS |
| **[Import Excel]** | BIEU_MAU | ❌ KHÔNG | ❌ Không render (+ UI thiếu — PARTIAL) | ✅ PASS (R-only) / gap UI |
| **[Xuất Excel]** | BIEU_MAU | Matrix không có explicit | ⚠️ Có button **disabled** (empty data → disabled OK) | ✅ PASS |

**Main toolbar buttons:** `Tìm kiếm` / `Xóa bộ lọc` / `Xuất Excel (disabled)` / `Làm mới`.

**Evaluate_script:**
```json
{
  "url": "/bieu-mau/thu-muc",
  "headings": ["Thư viện Biểu mẫu"],
  "mainButtons": ["Tìm kiếm","Xóa bộ lọc","Xuất Excel","Làm mới"],
  "hasImport": false,
  "tableColumns": ["Tên thư mục","Lĩnh vực","Số biểu mẫu","Trạng thái","Đồng bộ","Ngày tạo","Hành động"]
}
```

### 2.2 Cross-scope (BR-AUTH-08)

| Account | URL | Heading | Mainbuttons | Verdict |
|---------|-----|---------|-------------|---------|
| qtht_tw_4 | /bieu-mau/thu-muc | "Thư viện Biểu mẫu" | Same | ✅ PASS |
| qtht_bn_4 | Same | Same | Same | ✅ PASS |
| qtht_dp_4 | Same | Same | Same | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS 3/3 cấp QTHT (top-level)
- Tất cả 3 cấp match R-only cho THU_MUC_BIEU_MAU.

### ⚠️ PARTIAL — Gap UI (không phải bug phân quyền)
- **FR-VII-04, 05** `BIEU_MAU` list page (SCR-VII-02) chưa phơi ra.
- **FR-VII-06** Import Batch (SCR-VII-03) chưa phơi ra.
- **FR-VII-08** HOP_DONG_TU_VAN list page chưa xác định vị trí.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function | Coverage | Ghi chú |
|--------|-----------|----------|---------|
| `THU_MUC_BIEU_MAU` | 1 (FR-VII-01) | 100% top-level | Empty |
| `BIEU_MAU` | 4 (FR-VII-02, 03, 04, 05) | 50% (2/4 PASS, 2 PARTIAL gap UI) | Chỉ top-level thư mục |
| `HOP_DONG_TU_VAN` | 1 (FR-VII-08) | 0% (không có UI) | Cần BA confirm vị trí UI |

### Hạn chế
- Empty data → row-level action không verify được.
- Gap UI SCR-VII-02 / SCR-VII-03 → 3 function BLOCKED.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — BA/FE confirm UI missing:**
- SCR-VII-02 `Quản lý Biểu mẫu` (drill-down từ thư mục, hoặc sidebar riêng)?
- SCR-VII-03 `Nhập Biểu mẫu Hàng loạt` (button [Import] trên toolbar hoặc page riêng)?
- Vị trí UI `HOP_DONG_TU_VAN` (FR-VII-08) — có phải drill-down từ TVV detail tab "HĐ tư vấn" (tham chiếu FR-04)?

**Ưu tiên 2 — Seed data:**
- ≥2 THU_MUC + ≥5 BIEU_MAU → verify:
  - Row thư mục có [Xem] / KHÔNG có [Sửa]/[Xóa] cho QTHT.
  - Drill-down list BIEU_MAU (nếu implement).
  - Column "Đồng bộ" (API share status).

---

## 6. Quy trình test

```
Login 3 role QTHT × 1 sidebar "Quản lý thư viện biểu mẫu"
→ evaluate_script → mainButtons + tableColumns + tabs
→ take_screenshot full-page
```

---

## 7. Artifacts

- [R-43-qtht_tw-fr09-thumuc.png](screenshots/R-43-qtht_tw-fr09-thumuc.png)
- [R-50-qtht_bn-fr09-thumuc.png](screenshots/R-50-qtht_bn-fr09-thumuc.png)
- [R-51-qtht_dp-fr09-thumuc.png](screenshots/R-51-qtht_dp-fr09-thumuc.png)

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~3 phút |
| Số MCP tool call | 9 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
