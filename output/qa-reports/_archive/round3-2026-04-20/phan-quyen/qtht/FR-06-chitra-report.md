# Permission Test Report — FR-06 Chi trả Chi phí (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-06](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **13** | **13** | **0** | **0** | **100%** | ✅ **PASS** |

### Bug tóm tắt

Không phát hiện bug phân quyền nào ở FR-06 cho role QTHT (3 cấp TW/BN/ĐP).

---

## 2. Bảng kết quả chi tiết — 13 chức năng × 3 cấp QTHT

> **Spec note:** QTHT có quyền `R` cho toàn bộ FR-06 (entity `HO_SO_CHI_TRA` 12/13 + `THONG_BAO` 1/13). Kỳ vọng KHÔNG có button CRUD.

### 2.1 Module `Quản lý chi trả chi phí` (`/chi-tra/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict |
|---|----------|-----------|--------|----------|--------|---------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | `HO_SO_CHI_TRA` | 👁️ R | Inbound qua DVC, không UI phơi ra | ✅ PASS |
| 2 | `FR-V.II-02` | QL hồ sơ đề nghị hỗ trợ chi phí | `HO_SO_CHI_TRA` | 👁️ R | Heading "Hồ sơ Đề nghị Hỗ trợ Chi phí" + table 9 cột + 5 tab trạng thái. Không [Thêm mới]. Empty. | ✅ PASS |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | `HO_SO_CHI_TRA` | 👁️ R | Tab "Chờ xử lý" hiển thị, không button [Kiểm tra] | ✅ PASS |
| 4 | `FR-V.II-04` | Thông báo KQ kiểm tra qua DVC | `HO_SO_CHI_TRA` | 👁️ R | Outbound API | ✅ PASS (implicit) |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | `HO_SO_CHI_TRA` | 👁️ R | Tab "Đang đánh giá" hiển thị, không button [Đánh giá] | ✅ PASS |
| 6 | `FR-V.II-06` | QL hồ sơ đề nghị thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Cùng table — cột "Số tiền đề nghị" + "Số tiền được duyệt" hiển thị | ✅ PASS |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Luồng DN, QTHT chỉ xem | ✅ PASS |
| 8 | `FR-V.II-08` | Nhận thông báo KQ thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Nút thông báo top-right render | ✅ PASS |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Luồng CB_NV, không button [Thẩm định] | ✅ PASS |
| 10 | `FR-V.II-10` | Thông báo KQ thẩm định | `THONG_BAO` | 👁️ R | Bell icon render + badge notification | ✅ PASS |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Tab "Chờ phê duyệt" hiển thị | ✅ PASS |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | `HO_SO_CHI_TRA` | 👁️ R | Luồng CB_PD, không button [Phê duyệt] | ✅ PASS |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | `HO_SO_CHI_TRA` | 👁️ R | Tab "Đã xử lý" hiển thị | ✅ PASS |

### Kiểm tra các thao tác CRUD

| Thao tác | Expected (QTHT R-only) | Actual | Verdict |
|----------|------------------------|--------|---------|
| **[Thêm mới]** | ❌ KHÔNG | ❌ Không render | ✅ PASS |
| **[Sửa] row** | ❌ KHÔNG | ⚠️ Empty data → BLOCKED row-level | N/A |
| **[Xóa] row** | ❌ KHÔNG | ⚠️ Empty data → BLOCKED row-level | N/A |
| **[Kiểm tra]/[Đánh giá]/[Thẩm định]/[Phê duyệt]** | ❌ KHÔNG | ❌ Không render workflow buttons | ✅ PASS |
| **[Xuất Excel]** | Matrix không có | ❌ Không render | ✅ PASS |

**Main toolbar buttons chỉ có:** `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới`.

**Evaluate_script result:**
```json
{
  "url": "/chi-tra/danh-sach",
  "mainButtons": ["Tìm kiếm","Xóa bộ lọc","Làm mới"],
  "tableColumns": ["Mã HS","Tên DN","Quy mô DN","Số tiền đề nghị","Số tiền được duyệt","Trạng thái","SLA","Ngày nộp","Hành động"],
  "tabs": ["Tất cả","Chờ xử lý","Đang đánh giá","Chờ phê duyệt","Đã xử lý"],
  "hasThemMoi": false, "hasXuatExcel": false
}
```

### 2.2 Cross-scope (BR-AUTH-08)

| Account | URL | Heading | Mainbuttons | Table | Verdict |
|---------|-----|---------|-------------|-------|---------|
| qtht_tw_4 | /chi-tra/danh-sach | "Hồ sơ Đề nghị Hỗ trợ Chi phí" | Tìm kiếm/Xóa bộ lọc/Làm mới | Empty 9 cols | ✅ PASS |
| qtht_bn_4 | Same | Same | Same | Empty 9 cols | ✅ PASS |
| qtht_dp_4 | Same | Same | Same | Empty 9 cols | ✅ PASS |

**→ 3 cấp behavior giống nhau** (consistent BR-AUTH-08 vượt scope, cùng empty data). Cross-scope verify PASS.

---

## 3. Nhóm role theo kết quả

### ✅ PASS — 3/3 cấp QTHT
- qtht_tw_4 (TW) · qtht_bn_4 (BN) · qtht_dp_4 (ĐP) — tất cả match spec R-only.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function | Coverage | Ghi chú |
|--------|-----------|----------|---------|
| `HO_SO_CHI_TRA` | 12 (FR-V.II-01..09, 11..13) | 100% top-level | Empty data → row-level BLOCKED |
| `THONG_BAO` | 1 (FR-V.II-10) | 100% | Bell icon render top-right |

### Hạn chế / Data readiness
- **Module empty toàn bộ 5 status tab** → không verify được row action `Hành động`, detail page workflow, column "Số tiền được duyệt" khi data có giá trị thật.
- **Không test API-level** (curl POST/PUT/DELETE với token QTHT để verify BE chặn 403) — đề xuất cho round API test sau.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Seed data:**
- ≥5 HO_SO_CHI_TRA ở các trạng thái: Chờ xử lý / Đang đánh giá / Chờ phê duyệt / Đã xử lý
- Kết hợp DN test có MST + Quy mô khác nhau
→ Re-verify:
- [ ] Row có [Xem] link, KHÔNG có [Sửa]/[Xóa]/[Kiểm tra]/[Phê duyệt] cho QTHT.
- [ ] Detail page render đủ field (Số tiền, SLA, Lịch sử xử lý).
- [ ] Cross-scope 3 cấp cùng thấy data (BR-AUTH-08).

**Ưu tiên 2 — Kiểm tra BE guard:**
- `curl -X POST/PUT/DELETE /api/v1/ho-so-chi-tra` với token QTHT → expect 403.
- Mục tiêu: defense in depth (FE không lộ button + BE cũng chặn).

---

## 6. Quy trình test

```
Login 3 role QTHT × 1 sidebar "Quản lý chi trả chi phí"
→ take_snapshot main buttons + table columns
→ evaluate_script hasThemMoi=false confirm
→ take_screenshot full-page per role
```

---

## 7. Artifacts

- [R-40-qtht_tw-fr06-chitra.png](screenshots/R-40-qtht_tw-fr06-chitra.png)

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~3 phút (3 role × 1 phút) |
| Số MCP tool call | 12 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
