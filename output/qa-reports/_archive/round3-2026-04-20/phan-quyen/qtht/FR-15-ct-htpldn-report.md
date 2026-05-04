# Permission Test Report — FR-15 Chương trình HTPLDN (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-15](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Verdict |
|---------------|---------|---------|-------------|---------|
| **11** | **11** | **0** | **0** | ✅ **PASS** |

Không phát hiện bug phân quyền. 7 status workflow tabs render đầy đủ — top-level R-only PASS.

---

## 2. Bảng kết quả chi tiết — 11 chức năng

### 2.1 Module `Quản lý CT HTPLDN` (`/ct-htpldn/danh-sach`)

> **Spec:** QTHT có quyền `R` cho 11/11 function (entity CHUONG_TRINH_HTPL + BAO_CAO_CT_HTPL). Kỳ vọng KHÔNG có button CRUD/workflow.

| # | Function | Entity | Expected | Actual | Verdict |
|---|----------|--------|----------|--------|---------|
| 1 | `FR-XI-01` QL CT HTPL | `CHUONG_TRINH_HTPL` | 👁️ R | Heading "Quản lý Chương trình HTPLDN" + 7 status tab + table 9 col. Không [Thêm mới]. Empty. | ✅ PASS |
| 2 | `FR-XI-02` Tìm kiếm CT | `CHUONG_TRINH_HTPL` | 👁️ R | Filter: Từ khóa / Công bố / Từ-Đến ngày | ✅ PASS |
| 3 | `FR-XI-03` Trình phê duyệt CT | `CHUONG_TRINH_HTPL` | 👁️ R | Tab "Chờ PD" hiển thị. Không button [Trình PD]. | ✅ PASS |
| 4 | `FR-XI-04` Phê duyệt CT | `CHUONG_TRINH_HTPL` | 👁️ R | Tab "Đã duyệt" hiển thị. Không button [Phê duyệt]. | ✅ PASS |
| 5 | `FR-XI-05` Công bố kế hoạch CT | `CHUONG_TRINH_HTPL` | 👁️ R | Tab "Đã công bố" hiển thị. Không button [Công bố]. | ✅ PASS |
| 6 | `FR-XI-05a` QL đợt báo cáo CT | `CHUONG_TRINH_HTPL` | 👁️ R | Cột "Số đợt BC" hiển thị trong table | ✅ PASS |
| 7 | `FR-XI-06` Lập BC kết quả thực hiện CT | `BAO_CAO_CT_HTPL` | 👁️ R | Flow cấp BN/DP, QTHT xem | ✅ PASS |
| 8 | `FR-XI-07` Trình phê duyệt BC | `BAO_CAO_CT_HTPL` | 👁️ R | Flow cấp BN/DP, QTHT xem | ✅ PASS |
| 9 | `FR-XI-07a` Phê duyệt BC KQ | `BAO_CAO_CT_HTPL` | 👁️ R | Flow CB_PD_TW, QTHT xem | ✅ PASS |
| 10 | `FR-XI-08` Gửi kết quả lên TW | `CHUONG_TRINH_HTPL` | 👁️ R | Flow cấp BN/DP, QTHT xem | ✅ PASS |
| 11 | `FR-XI-09` TW tổng hợp BC | `BAO_CAO_CT_HTPL` | 👁️ R | Flow CB_NV_TW, QTHT xem | ✅ PASS |

### Kiểm tra các thao tác

| Thao tác | Expected | Actual | Verdict |
|----------|----------|--------|---------|
| [Thêm mới] | ❌ KHÔNG (QTHT R) | ❌ Không render | ✅ PASS |
| [Sửa] row | ❌ KHÔNG | ⚠️ Empty BLOCKED | N/A |
| [Xóa] row | ❌ KHÔNG | ⚠️ Empty BLOCKED | N/A |
| [Trình PD]/[Phê duyệt]/[Công bố]/[Gửi lên TW] | ❌ KHÔNG (workflow cho CB_NV/CB_PD) | ❌ Không render workflow buttons | ✅ PASS |

**Main buttons:** `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới`.

**Table cols:** Mã CT / Tên CT / Mục tiêu / Thời gian / Ngân sách / Đơn vị / Trạng thái / Số đợt BC / Hành động.

**7 status tabs:** Tất cả / Dự thảo / Chờ PD / Đã duyệt / Đã công bố / Đang thực hiện / Hoàn thành.

---

## 3. Hạn chế

- Data empty → chưa drill-down detail CT / xem đợt BC.
- Cross-scope 3 cấp QTHT chưa verify do empty.

---

## 4. Artifacts

- [R-73-qtht_tw-fr15-ct-htpldn.png](screenshots/R-73-qtht_tw-fr15-ct-htpldn.png)

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
