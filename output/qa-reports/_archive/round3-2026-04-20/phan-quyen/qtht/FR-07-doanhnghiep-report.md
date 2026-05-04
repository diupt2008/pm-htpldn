# Permission Test Report — FR-07 Doanh nghiệp (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-07](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **3** | **2** | **0** | **1** | **67%** | ⚠️ **PASS WITH GAP** |

### Bug tóm tắt

Không phát hiện bug phân quyền. **Phát hiện gap UI:** FR-V.III-02 "Tìm kiếm DN" trong matrix gán entity `DON_VI` với quyền `CRUD` (✅ F) — nhưng UI module FR-07 chỉ quản lý `DOANH_NGHIEP`, không có UI CRUD `DON_VI` ở module này. `DON_VI` management nằm ở module khác (QTHT > DM dùng chung) → có thể là matrix error hoặc mapping ambiguous.

---

## 2. Bảng kết quả chi tiết — 3 chức năng × 3 cấp QTHT

### 2.1 Module `Quản lý doanh nghiệp được hỗ trợ` (`/doanh-nghiep/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict |
|---|----------|-----------|--------|----------|--------|---------|
| 1 | `FR-V.III-01` | QL Doanh nghiệp được HTPL | `DOANH_NGHIEP` | 👁️ R | Heading "Quản lý Doanh nghiệp" + table 8 cột + filter 4 field. Không [Thêm mới]. Empty. | ✅ PASS |
| 2 | `FR-V.III-02` | Tìm kiếm DN | `DON_VI` | ✅ F (CRUD) | **Gap matrix vs UI**: Trang FR-07 quản lý DOANH_NGHIEP, không có UI CRUD DON_VI ở đây. DON_VI CRUD test ở QTHT > DM dùng chung (FR-VIII-05). | ⚠️ PARTIAL (matrix mapping ambiguous) |
| 3 | `FR-V.III-NEW-01` | Import DN từ Excel | `DOANH_NGHIEP` | 👁️ R | Không có button [Import DN từ Excel] phơi ra — match spec R-only (không cho QTHT tự import) | ✅ PASS |

### Giải thích "⚠️ PARTIAL" cho FR-V.III-02

**Matrix `permission-matrix-by-role.md` line 211** gán:
```
| 2 | FR-V.III-02 | Tìm kiếm DN | UC82 | SCR-V | DON_VI | CRUD | ✅ F |
```

Nhưng:
- **Tên function** = "Tìm kiếm DN" → scope thao tác là tìm kiếm DOANH_NGHIEP (khớp FR-V.III-01).
- **Entity mapped** = `DON_VI` CRUD — không khớp với thao tác "tìm kiếm DN".
- **UI module FR-07** chỉ hiển thị `DOANH_NGHIEP`, không có bảng `DON_VI` để CRUD.

→ **Khả năng cao là matrix labeling error** (FR-V.III-02 entity đúng ra phải là `DOANH_NGHIEP` R, không phải `DON_VI` CRUD). CRUD `DON_VI` đúng nghĩa nằm ở FR-VIII-05 (QTHT > Danh mục dùng chung > Đơn vị) — cùng entity, cùng quyền, hợp lý.

**Action:** QA flag lên BA/Architect để confirm matrix entry FR-V.III-02. Trong round hiện tại, verify theo UI-first → UI match spec DOANH_NGHIEP R-only → PASS.

### Kiểm tra các thao tác CRUD

| Thao tác | Scope UI | Expected | Actual | Verdict |
|----------|----------|----------|--------|---------|
| **[Thêm mới]** | DOANH_NGHIEP | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| **[Import DN từ Excel]** | DOANH_NGHIEP | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| **[Sửa] row** | DOANH_NGHIEP | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Xóa] row** | DOANH_NGHIEP | ❌ KHÔNG | ⚠️ Empty → BLOCKED | N/A |
| **[Xuất Excel]** | DOANH_NGHIEP | Matrix không có | ❌ Không render | ✅ PASS |

**Main toolbar buttons chỉ có:** `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới`.

**Evaluate_script:**
```json
{
  "url": "/doanh-nghiep/danh-sach",
  "mainButtons": ["Tìm kiếm","Xóa bộ lọc","Làm mới"],
  "tableColumns": ["Mã DN","Tên DN","MST","Quy mô","Địa chỉ","Số lần HT","Tổng chi phí","Hành động"],
  "hasThemMoi": false, "hasImport": false
}
```

### 2.2 Cross-scope (BR-AUTH-08)

| Account | URL | Heading | Main buttons | Verdict |
|---------|-----|---------|--------------|---------|
| qtht_tw_4 | /doanh-nghiep/danh-sach | "Quản lý Doanh nghiệp" | Tìm kiếm/Xóa bộ lọc/Làm mới | ✅ PASS |
| qtht_bn_4 | Same | Same | Same | ✅ PASS |
| qtht_dp_4 | Same | Same | Same | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS 3/3 cấp QTHT
- qtht_tw_4 · qtht_bn_4 · qtht_dp_4 — đồng nhất, UI match spec R-only cho DOANH_NGHIEP.

### ⚠️ PARTIAL
- FR-V.III-02 — matrix mapping entity có thể sai (DON_VI CRUD ở function "Tìm kiếm DN"). Flag cho BA confirm.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function | Coverage | Ghi chú |
|--------|-----------|----------|---------|
| `DOANH_NGHIEP` | 2 (FR-V.III-01, NEW-01) | 100% top-level | Empty data → row-level BLOCKED |
| `DON_VI` | 1 (FR-V.III-02) | 0% (không có UI ở module FR-07) | Test ở FR-VIII-05 (QTHT > DMDC > Đơn vị) |

### Hạn chế
- Empty data → detail DN + Import modal chưa test.
- Matrix mapping FR-V.III-02 cần BA confirm trước khi kết luận bug/not bug.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — BA confirm FR-V.III-02:**
Xác nhận entity của "Tìm kiếm DN" trong matrix:
- (a) Đúng là `DOANH_NGHIEP` R (typo trong matrix — sửa) → function redundant với FR-V.III-01.
- (b) Đúng là `DON_VI` CRUD nhưng mapping sang UI khác (QTHT > DMDC > Đơn vị = FR-VIII-05) → hợp nhất 2 function.
- (c) Giữ như hiện tại — tester không verify được ở module FR-07.

**Ưu tiên 2 — Seed DN test:**
≥5 DN với Quy mô khác nhau (Siêu nhỏ / Nhỏ / Vừa) → verify:
- Row có [Xem] link, KHÔNG có CRUD.
- Column "Số lần HT" + "Tổng chi phí" hiển thị đúng tính toán.
- Cross-scope 3 cấp thấy cùng data.

---

## 6. Quy trình test

```
Login 3 role QTHT × 1 sidebar "Quản lý doanh nghiệp được hỗ trợ"
→ evaluate_script → mainButtons + hasThemMoi + hasImport
→ take_screenshot full-page
```

---

## 7. Artifacts

- [R-41-qtht_tw-fr07-doanhnghiep.png](screenshots/R-41-qtht_tw-fr07-doanhnghiep.png)

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~2 phút |
| Số MCP tool call | 9 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
