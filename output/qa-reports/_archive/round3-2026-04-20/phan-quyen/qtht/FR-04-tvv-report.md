# Permission Test Report — FR-04 Chuyên gia / Tư vấn viên (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-04](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **12** | **0** | **11** | **1** | **0%** | ❌ **FAIL** |

### Bug tóm tắt

| Bug ID | Severity | Title | Role/ô ảnh hưởng |
|--------|----------|-------|-------------------|
| **BUG-PERM-QTHT-FR04-001** | **Major** | Row action [Xóa] render cho QTHT trên toàn bộ TVV list — vi phạm spec R-only | QTHT × TU_VAN_VIEN (list page, tất cả 5 tab) |
| **BUG-PERM-QTHT-FR04-002** | Medium | Dashboard FR-I-07 count TVV = 0 cho cấp ĐP dù list hiện 29+1 TVV — vi phạm BR-AUTH-08 | QTHT_DP × TU_VAN_VIEN (Dashboard widget) |

→ Chi tiết bug: [bug-report.md](bug-report.md)

---

## 2. Bảng kết quả chi tiết — 12 chức năng × 1 role (qtht_tw_4) + cross-scope verify

> **Spec note:** QTHT có quyền `R` cho mọi function FR-04 (entity `TU_VAN_VIEN` và `VU_VIEC`). Kỳ vọng KHÔNG có button CRUD.

### 2.1 Module `Quản lý chuyên gia / tư vấn viên` (`/chuyen-gia-tvv/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----------|--------|----------|--------|---------|----------|
| 1 | `FR-IV-01` | Quản lý TVV (list) | `TU_VAN_VIEN` | 👁️ R | Table 12 cột + 5 tab. **Row action có [Xóa] link** (red color, cursor:pointer, onclick active) | ❌ **FAIL** → BUG-001 | [R-07](screenshots/R-07-qtht_tw-fr04-tvv-xoa-bug.png) |
| 2 | `FR-IV-02` | Tìm kiếm TVV | `TU_VAN_VIEN` | 👁️ R | Filter hoạt động. | ❌ **FAIL** (do list view vẫn render [Xóa]) | [R-08](screenshots/R-08-qtht_tw-fr04-tvv-moidangky.png) |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | `TU_VAN_VIEN` | 👁️ R | Flow đăng ký thuộc role NHT/TVV, QTHT không có button đăng ký. | ❌ **FAIL** (inherited from list) | [R-08](screenshots/R-08-qtht_tw-fr04-tvv-moidangky.png) |
| 4 | `FR-IV-04` | Cập nhật năng lực | `TU_VAN_VIEN` | 👁️ R | Detail tab "Năng lực" render (read-only). | ❌ **FAIL** (list view có [Xóa]) | [R-07](screenshots/R-07-qtht_tw-fr04-tvv-xoa-bug.png) |
| 5 | `FR-IV-05` | Xem chi tiết TVV | `VU_VIEC` | 👁️ R | Detail page 6 tab (Hồ sơ / Thẩm định / Năng lực / Lịch sử / HĐ tư vấn / Đánh giá) — không button write. | ❌ **FAIL** (list row [Xóa]) | [R-09](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | `TU_VAN_VIEN` | 👁️ R | Detail tab "Thẩm định" chỉ render, không có button [Thẩm định]/[Duyệt]. | ❌ **FAIL** (list [Xóa]) | [R-09](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) |
| 7 | `FR-IV-07` | Phê duyệt TVV | `TU_VAN_VIEN` | 👁️ R | Tab "Chờ phê duyệt" render 2 rows — không có button [Phê duyệt]/[Từ chối]. | ❌ **FAIL** (list [Xóa]) | (snapshot tab) |
| 8 | `FR-IV-08` | Công khai mạng lưới | `TU_VAN_VIEN` | 👁️ R | Cột "Công khai" hiển thị ("Chưa công khai"), không có toggle. | ❌ **FAIL** (list [Xóa]) | [R-07](screenshots/R-07-qtht_tw-fr04-tvv-xoa-bug.png) |
| 9 | `FR-IV-09` | Đánh giá TVV | `TU_VAN_VIEN` | 👁️ R | Detail tab "Đánh giá" render. | ❌ **FAIL** (list [Xóa]) | [R-09](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | `VU_VIEC` | 👁️ R | Detail tab "Lịch sử hỗ trợ" render. | ❌ **FAIL** (list [Xóa]) | [R-09](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | `TU_VAN_VIEN` | 👁️ R | Flow NHT, QTHT không có button update. | ⚠️ BLOCKED (role NHT chưa test) | — |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | `TU_VAN_VIEN` | 👁️ R | Detail không có button update status. | ❌ **FAIL** (list [Xóa]) | [R-09](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) |

### 2.2 Đánh giá cụ thể row action — BUG BUG-001

**Evidence DOM inspect (qtht_tw_4):**
```json
{
  "rowCount": 1,  // Tab "Đang hoạt động"
  "lastCellHTML": "<div style=\"display: flex; align-items: center; justify-content: flex-start; gap: 8px;\"><a href=\"/chuyen-gia-tvv/268fa2bc-...\" data-discover=\"true\">Xem</a><a style=\"color: rgb(255, 77, 79);\">Xóa</a></div>",
  "links": [
    {"text": "Smoke V2 TVV", "href": "/chuyen-gia-tvv/268fa2bc-..."},
    {"text": "Xem", "href": "/chuyen-gia-tvv/268fa2bc-..."},
    {"text": "Xóa", "href": null}
  ],
  "actionElements": [
    {"tag": "A", "text": "Xem", "onclick": true, "cursor": "pointer"},
    {"tag": "A", "text": "Xóa", "onclick": true, "cursor": "pointer", "classes": ""}
  ]
}
```

- `<a>Xóa</a>` — color `rgb(255, 77, 79)` (danger red của Antd), không `href` nhưng có `onclick` + `cursor:pointer` → click được, không phải disabled/display-only text.
- Lặp lại **toàn bộ 29+ rows** ở tab "Mới đăng ký" + tab "Chờ phê duyệt" + tab "Đang hoạt động".
- **Không click test** vì có thể thật sự xóa data.

### 2.3 Cross-scope verify (BR-AUTH-08)

| Account | Dashboard FR-I-07 "Chuyên gia/TVV" count | List tab "Đang hoạt động" | List tab "Mới đăng ký" | Bug [Xóa] render? |
|---------|------------------------------------------|---------------------------|-------------------------|-------------------|
| qtht_tw_4 | **1** | 1 row (TVV-BKH-0001) | 29 rows | ✅ Có |
| qtht_bn_4 | **1** | 1 row (same data) | (chưa đếm) | ✅ Có |
| qtht_dp_4 | **0** ❌ | 1 row (same data) | 29 rows | ✅ Có |

**→ Bug BUG-002 xuất hiện ở cột Dashboard:** qtht_dp_4 widget count = 0 nhưng list thực tế có data = 1 (Đang hoạt động) + 29 (Mới đăng ký). Inconsistency giữa Dashboard widget và list page cho cấp ĐP. Vi phạm BR-AUTH-08.

### Kiểm tra các thao tác CRUD

| Thao tác | Scope | Expected | Actual | Verdict |
|----------|-------|----------|--------|---------|
| **[Thêm mới]** | TU_VAN_VIEN list | ❌ KHÔNG (QTHT R-only) | ❌ Không render | ✅ PASS |
| **[Sửa]** trên row | TU_VAN_VIEN list | ❌ KHÔNG (R-only) | ❌ Không render | ✅ PASS |
| **[Xóa]** trên row | TU_VAN_VIEN list | ❌ KHÔNG (R-only) | ✅ **RENDER trên 29+ rows (MỌI TAB)** | ❌ **FAIL — BUG-001** |
| **[Xem]** trên row | TU_VAN_VIEN list | ✅ CÓ (R view detail) | ✅ Link "Xem" render | ✅ PASS |
| **[Phê duyệt]/[Thẩm định]/[Cập nhật trạng thái]** | Detail | ❌ KHÔNG | ❌ Không render ở detail (không inherit bug) | ✅ PASS |

---

## 3. Nhóm role theo kết quả

### ✅ PASS 0 role
- Không role nào PASS do list view có bug [Xóa].

### ❌ FAIL 3 role → **BUG-PERM-QTHT-FR04-001** (Major)
- **qtht_tw_4** (QTHT TW) — list TVV phơi [Xóa] trên mọi row mọi tab.
- **qtht_bn_4** (QTHT BN) — cùng bug.
- **qtht_dp_4** (QTHT ĐP) — cùng bug.

### ❌ FAIL 1 role bổ sung → **BUG-PERM-QTHT-FR04-002** (Medium)
- **qtht_dp_4** (QTHT ĐP) — Dashboard widget FR-I-07 count TVV = 0 (vi phạm BR-AUTH-08 vượt scope), qtht_tw/bn cùng widget = 1.

---

## 4. Phạm vi test

### Entity đã verify
| Entity | Function covered | Ghi chú |
|--------|------------------|---------|
| `TU_VAN_VIEN` | 11/12 FR-IV-01..10, 12 | Có data → verify được row action. |
| `VU_VIEC` | 2/2 (FR-IV-05, 10) | Verify qua detail TVV tab "Lịch sử hỗ trợ". Empty data. |

### Hạn chế
- Không click [Xóa] để verify behavior runtime (sợ xóa thật data).
- Không test permission backend (có chặn API DELETE không): để QA backend round sau.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Fix BUG-001 (Major):**
Dev cần ẩn nút [Xóa] trong `<ActionColumn>` cho role QTHT. Kiểm tra component render row action — thường ở `src/pages/tvv/list/columns.tsx` (hoặc tương đương). Pattern fix:
```tsx
{ability.can('delete', 'TuVanVien') && <a onClick={handleDelete}>Xóa</a>}
```

**Ưu tiên 2 — Fix BUG-002 (Medium):**
Dashboard API endpoint `/api/v1/dashboard/summary` (hoặc tương tự) đang scope-filter theo user đơn vị cho count TVV. QTHT phải bypass filter theo BR-AUTH-08. Verify endpoint có gửi đúng role guard (QTHT = null filter).

**Ưu tiên 3 — Re-test sau fix:**
- [ ] Login 3 role QTHT (TW/BN/DP) → xem list TVV, verify chỉ còn [Xem] (không còn [Xóa]).
- [ ] qtht_dp_4 Dashboard count TVV = 1 (match list page).

**Gap data:**
- Detail page drill-down test sâu hơn: verify các tab Thẩm định / Đánh giá không có button [Thẩm định]/[Phê duyệt]/[Cập nhật trạng thái] cho QTHT.

---

## 6. Quy trình test đã áp dụng

```
Login qtht_tw_4 → click sidebar "Quản lý chuyên gia / tư vấn viên"
→ Tab "Đang hoạt động" (1 row): DOM inspect last cell action
  → Confirm [Xem] + [Xóa] links
→ Tab "Mới đăng ký" (29 rows): verify [Xóa] lặp lại trên mọi row
→ Tab "Chờ thẩm định" (empty)
→ Tab "Chờ phê duyệt" (2 rows): verify [Xóa] vẫn render
→ Click row → TVV detail page: 6 tab, không button write
→ Click tab "Thẩm định" detail: không button [Thẩm định]

Cross-scope:
Logout → Login qtht_bn_4 → Dashboard: TVV=1. List: same data, [Xóa] lặp.
Logout → Login qtht_dp_4 → Dashboard: TVV=0 ❌. List: TVV-BKH-0001 + 29 MDK (same), [Xóa] lặp.
```

---

## 7. Artifacts

| File | Mô tả |
|------|-------|
| [R-07-qtht_tw-fr04-tvv-xoa-bug.png](screenshots/R-07-qtht_tw-fr04-tvv-xoa-bug.png) | Tab "Đang hoạt động" — 1 row có [Xóa] |
| [R-08-qtht_tw-fr04-tvv-moidangky.png](screenshots/R-08-qtht_tw-fr04-tvv-moidangky.png) | Tab "Mới đăng ký" — 29 rows, mỗi row có [Xóa] |
| [R-09-qtht_tw-fr04-tvv-detail.png](screenshots/R-09-qtht_tw-fr04-tvv-detail.png) | Detail page — 6 tab, không có button write |
| [R-20-qtht_bn-dashboard.png](screenshots/R-20-qtht_bn-dashboard.png) | qtht_bn_4 Dashboard — TVV count = 1 |
| [R-21-qtht_bn-tvv-list.png](screenshots/R-21-qtht_bn-tvv-list.png) | qtht_bn_4 TVV list — same data, [Xóa] lặp |
| [R-30-qtht_dp-dashboard.png](screenshots/R-30-qtht_dp-dashboard.png) | qtht_dp_4 Dashboard — TVV count = **0** (bug-002 evidence) |
| [R-31-qtht_dp-tvv-danghoatdong.png](screenshots/R-31-qtht_dp-tvv-danghoatdong.png) | qtht_dp_4 TVV list Đang hoạt động — 1 row, confirm data có thật |
| [R-32-qtht_dp-tvv-moidangky.png](screenshots/R-32-qtht_dp-tvv-moidangky.png) | qtht_dp_4 TVV Mới đăng ký — 29 rows, [Xóa] lặp |

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~12 phút (qtht_tw + qtht_bn + qtht_dp) |
| Số MCP tool call | 30+ |
| Số screenshot | 8 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
