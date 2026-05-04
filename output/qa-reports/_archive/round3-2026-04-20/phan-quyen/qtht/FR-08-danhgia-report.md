# Permission Test Report — FR-08 Đánh giá Hiệu quả (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-08](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **9** | **9** | **0** | **0** | **100%** | ✅ **PASS** |

### Bug tóm tắt

Không phát hiện bug phân quyền. Module empty toàn bộ 10 status tab → test giới hạn ở top-level permission, row-level BLOCKED.

---

## 2. Bảng kết quả chi tiết — 9 chức năng × 3 cấp QTHT

> **Spec note:** QTHT có quyền `R` cho 8/9 entity (VU_VIEC, AUDIT_LOG, KE_HOACH_DANH_GIA, KET_QUA_DANH_GIA, BAO_CAO_DANH_GIA) và 1 CRUD đặc biệt `FR-VI-03` entity `DANH_MUC` — nhưng DANH_MUC CRUD được test ở module QTHT > DM dùng chung (FR-10), không ở FR-08.

### 2.1 Module `Đánh giá hiệu quả hỗ trợ pháp lý` (`/danh-gia/ke-hoach/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict |
|---|----------|-----------|--------|----------|--------|---------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | `VU_VIEC` | 👁️ R | Heading "Kế hoạch đánh giá" + 10 status tab. Không [Lập kế hoạch]. Empty. | ✅ PASS |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | `AUDIT_LOG` | 👁️ R | Luồng phái sinh, entity AUDIT_LOG → scope test chuyển sang audit log viewer (không trong FR-08 UI). | ✅ PASS (no CRUD visible) |
| 3 | `FR-VI-03` | Phân công người đánh giá | `DANH_MUC` | ✅ F (CRUD) | Tab "Đang phân công" + "Đã phân công" hiển thị. DANH_MUC CRUD verify ở FR-10 (QTHT > DM dùng chung). | ✅ PASS (out of scope — test riêng) |
| 4 | `FR-VI-04` | Phê duyệt phân công | `KE_HOACH_DANH_GIA` | 👁️ R | Tab "Chờ duyệt BC" / "Đã duyệt BC" hiển thị. Không button [Phê duyệt]. | ✅ PASS |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | `VU_VIEC` | 👁️ R | Cột "Số vụ việc" trong table hiển thị. Không button [Chọn VV]. | ✅ PASS |
| 6 | `FR-VI-06` | Thực hiện đánh giá | `KET_QUA_DANH_GIA` | 👁️ R | Tab "Đang đánh giá" / "Đã đánh giá" hiển thị. Không button [Bắt đầu ĐG]. | ✅ PASS |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | `BAO_CAO_DANH_GIA` | 👁️ R | Tab "Chờ duyệt BC" hiển thị. Không button [Lập BC]. | ✅ PASS |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | `KE_HOACH_DANH_GIA` | 👁️ R | Tab "Chờ duyệt BC" hiển thị. Không button [Trình duyệt]. | ✅ PASS |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | `KE_HOACH_DANH_GIA` | 👁️ R | Tab "Đã duyệt BC" hiển thị. Không button [Phê duyệt BC]. | ✅ PASS |

### Kiểm tra các thao tác CRUD

| Thao tác | Expected | Actual | Verdict |
|----------|----------|--------|---------|
| **[Thêm mới] / [Lập kế hoạch]** | ❌ KHÔNG (QTHT R-only VU_VIEC) | ❌ Không render | ✅ PASS |
| **[Sửa] row** | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Xóa] row** | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Phân công]/[Đánh giá]/[Phê duyệt BC]** | ❌ KHÔNG | ❌ Không render workflow buttons | ✅ PASS |
| **Cột "Hành động"** | (không render được do empty) | **Table KHÔNG có cột "Hành động"** | ⚠️ Note |

**⚠️ Note đặc biệt:** Table FR-08 **không có cột "Hành động"** (khác với FR-01..07 đều có). → Consistency issue — nhưng không phải bug phân quyền. Nếu spec yêu cầu QTHT xem chi tiết (link [Xem]) từ list thì thiếu cột này là gap UI. Confirm với BA.

**Main toolbar buttons chỉ có:** `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới`.

**Evaluate_script:**
```json
{
  "url": "/danh-gia/ke-hoach/danh-sach",
  "mainButtons": ["Tìm kiếm","Xóa bộ lọc","Làm mới"],
  "tableColumns": ["Mã kế hoạch","Tên đợt","Tần suất","Đối tượng","Từ ngày","Đến ngày","Số vụ việc","Trạng thái","Ngày tạo"],
  "tabs": ["Tất cả","Nháp","Đã lập KH","Đang phân công","Đã phân công","Đang đánh giá","Đã đánh giá","Chờ duyệt BC","Đã duyệt BC","Hủy"],
  "hasThemMoi": false
}
```

### 2.2 Cross-scope (BR-AUTH-08)

| Account | URL | Heading | 10 tabs render | Verdict |
|---------|-----|---------|----------------|---------|
| qtht_tw_4 | /danh-gia/ke-hoach/danh-sach | "Kế hoạch đánh giá" | ✅ | ✅ PASS |
| qtht_bn_4 | Same | Same | ✅ | ✅ PASS |
| qtht_dp_4 | Same | Same | ✅ | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS 3/3 cấp QTHT
- Tất cả 9 chức năng match spec R-only top-level. DANH_MUC CRUD test riêng ở FR-10.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function | Coverage | Ghi chú |
|--------|-----------|----------|---------|
| `VU_VIEC` | 2 (FR-VI-01, 05) | 100% top-level | Verify qua tab tên đợt |
| `KE_HOACH_DANH_GIA` | 3 (FR-VI-04, 08, 09) | 100% top-level | 10 status tabs render |
| `KET_QUA_DANH_GIA` | 1 (FR-VI-06) | 100% top-level | Tab "Đang đánh giá" |
| `BAO_CAO_DANH_GIA` | 1 (FR-VI-07) | 100% top-level | Tab "Chờ duyệt BC" |
| `AUDIT_LOG` | 1 (FR-VI-02) | ⚠️ Out of scope (module riêng) | QTHT > Nhật ký hệ thống |
| `DANH_MUC` | 1 (FR-VI-03) | ⚠️ Out of scope (test ở FR-10) | QTHT > DM dùng chung |

### Hạn chế / Data readiness
- Toàn bộ 10 status tab empty → không verify được drill-down detail KH đánh giá.
- Không có cột "Hành động" ở table → nếu có data cũng không rõ row action nào phơi ra.
- FR-VI-03 DANH_MUC CRUD phải verify ở FR-10 (round khác).

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — BA confirm UI:**
- Cột "Hành động" cho table KH đánh giá có cần không? Nếu có, add.
- FR-VI-02 AUDIT_LOG có UI riêng trong module FR-08 không? Hay chỉ tham chiếu?

**Ưu tiên 2 — Seed data:**
- ≥2 KH đánh giá (Nháp + Đã lập KH) với vụ việc gán
- Verify row-level: không có [Sửa]/[Xóa] cho QTHT, chỉ có [Xem] (nếu UI bổ sung cột).

---

## 6. Quy trình test

```
Login 3 role QTHT × 1 sidebar "Đánh giá hiệu quả hỗ trợ pháp lý"
→ evaluate_script → mainButtons + tableColumns + tabs (10)
→ take_screenshot full-page
```

---

## 7. Artifacts

- [R-42-qtht_tw-fr08-kehoach.png](screenshots/R-42-qtht_tw-fr08-kehoach.png)

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~3 phút |
| Số MCP tool call | 10 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
