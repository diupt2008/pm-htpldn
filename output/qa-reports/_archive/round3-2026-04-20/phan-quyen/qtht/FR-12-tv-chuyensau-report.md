# Permission Test Report — FR-12 Tư vấn Chuyên sâu (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-12](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Verdict |
|---------------|---------|---------|-------------|---------|
| **7** | **6** | **0** | **1** (FR-X.1-06 DANH_MUC CRUD — test ở FR-10) | ✅ **PASS** |

Không phát hiện bug mới.

---

## 2. Bảng kết quả chi tiết — 7 chức năng

### 2.1 Module `Tư vấn chuyên sâu` (`/tv-chuyen-sau/danh-sach`)

> **Spec:** QTHT có quyền `R` cho 6/7 function (entity TU_VAN_VIEN, DOANH_NGHIEP). 1 function CRUD entity DANH_MUC (tư liệu pháp lý của vụ việc) test ở FR-10 DMDC.

| # | Function | Entity | Expected | Actual | Verdict |
|---|----------|--------|----------|--------|---------|
| 1 | `FR-X.1-01` QL nội dung tư vấn chuyên gia | `TU_VAN_VIEN` | 👁️ R | Heading "Tư vấn chuyên sâu" + filter 8 field + 4 status tab + table 9 col. Không [Thêm mới]. Empty. | ✅ PASS |
| 2 | `FR-X.1-02` Tìm kiếm nội dung tư vấn chuyên gia | `TU_VAN_VIEN` | 👁️ R | Filter: Từ khóa / Chuyên gia / DN / Lĩnh vực / Trạng thái / Từ-Đến ngày | ✅ PASS |
| 3 | `FR-X.1-03` Tiếp nhận nội dung tư vấn với chuyên gia | `DOANH_NGHIEP` | 👁️ R | Workflow DN submit, QTHT chỉ xem | ✅ PASS (no button tạo) |
| 4 | `FR-X.1-04` QL hồ sơ pháp lý DN | `DOANH_NGHIEP` | 👁️ R | Thuộc drill-down TV chuyên sâu detail. Empty data → chỉ top-level. | ✅ PASS (top-level) |
| 5 | `FR-X.1-05` Tiếp nhận hồ sơ pháp lý DN | `DOANH_NGHIEP` | 👁️ R | Workflow DN submit | ✅ PASS |
| 6 | `FR-X.1-06` QL tư liệu pháp lý của VV | `DANH_MUC` | ✅ F CRUD | **Test riêng ở FR-10 DMDC** — không phơi ra trong TV chuyên sâu module | ⚠️ BLOCKED (test ở FR-10) |
| 7 | `FR-X.1-07` Tiếp nhận đánh giá chất lượng TV chuyên gia | `TU_VAN_VIEN` | 👁️ R | Flow DN đánh giá sau TV. Empty data. | ✅ PASS |

### Kiểm tra các thao tác

| Thao tác | Expected | Actual | Verdict |
|----------|----------|--------|---------|
| [Thêm mới] | ❌ KHÔNG (QTHT R) | ❌ Không render | ✅ PASS |
| [Sửa] row | ❌ KHÔNG | ⚠️ Empty BLOCKED | N/A |
| [Xóa] row | ❌ KHÔNG | ⚠️ Empty BLOCKED | N/A |
| [Xuất Excel] | - | ❌ Không render | ✅ PASS |

**Main buttons:** `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới`.

### 2.2 Cross-scope
Chưa verify 3 cấp QTHT do data empty toàn bộ → no scope filter behavior detectable.

---

## 3. Hạn chế

- **Data empty** → chưa drill-down detail TV chuyên sâu → chưa verify FR-X.1-04/05 (Hồ sơ pháp lý DN).
- **FR-X.1-06 DANH_MUC CRUD** không phơi ra trong module — phải test ở FR-10 DMDC tab DM.

---

## 4. Artifacts

- [R-71-qtht_tw-fr12-tvchuyensau.png](screenshots/R-71-qtht_tw-fr12-tvchuyensau.png)

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
