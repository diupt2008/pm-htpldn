# Permission Test Report — FR-01 Dashboard (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-01](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|------------|---------|
| **9** | **9** | **0** | **100%** | ✅ **PASS** |

### Bug tóm tắt

Không phát hiện bug phân quyền nào ở FR-01 cho role QTHT (cấp TW).

---

## 2. Bảng kết quả chi tiết — 9 chức năng × 1 role (qtht_tw_4)

| # | Function | Widget UI | Entity | Expected (matrix §1 FR-01) | Actual UI | Verdict | Evidence |
|---|----------|-----------|--------|----------------------------|-----------|---------|----------|
| 1 | `FR-I-01` | "Hỏi đáp mới" | `HOI_DAP` | 👁️ R | Widget render `0 hỏi đáp / Chưa có dữ liệu` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 2 | `FR-I-02` | "Vụ việc tiếp nhận" | `VU_VIEC` | 👁️ R | Widget render `0 vụ việc` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 3 | `FR-I-03` | "Vụ việc đang xử lý" | `VU_VIEC` | 👁️ R | Widget render `0 vụ việc` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 4 | `FR-I-04` | "Vụ việc hoàn thành" | `VU_VIEC` | 👁️ R | Widget render `0 vụ việc` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 5 | `FR-I-05` | "Đào tạo đang diễn ra" | `KHOA_HOC` | 👁️ R | Widget render `0 khóa học` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 6 | `FR-I-06` | "Đào tạo hoàn thành" | `KHOA_HOC` | 👁️ R | Widget render `0 khóa học` — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 7 | `FR-I-07` | "Chuyên gia / Tư vấn viên" | `TU_VAN_VIEN` | 👁️ R | Widget render `1 người` (đếm TVV) — no CRUD | ✅ PASS | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 8 | `FR-I-08` | "Biểu đồ Đánh giá hiệu quả hỗ trợ" | `?` | ❓ (entity chưa xác định) | Card render "Chưa có dữ liệu đánh giá trong kỳ" | ✅ PASS (R-only behavior) | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |
| 9 | `FR-I-09` | "Biểu đồ Chất lượng đào tạo" | `?` | ❓ (entity chưa xác định) | Card render "Chưa có dữ liệu đào tạo trong kỳ" | ✅ PASS (R-only behavior) | [R-01](screenshots/R-01-qtht_tw-dashboard.png) |

**Bonus widget (không có trong spec FR-01):**
- "Tỷ lệ hồ sơ bổ sung" = 0% · "Thời gian xử lý trung bình" = 0 ngày → chỉ hiển thị, không thao tác.

### Kiểm tra các thao tác CRUD (theo yêu cầu task)

| Thao tác | Expected | Actual | Verdict |
|----------|----------|--------|---------|
| **[Thêm mới] render?** | ❌ KHÔNG (QTHT chỉ R với dashboard widget) | ❌ Không render | ✅ PASS |
| **[Sửa] trên row?** | ❌ Dashboard không có table/row | ❌ Không có table | ✅ PASS |
| **[Xóa] trên row?** | ❌ Dashboard không có table/row | ❌ Không có table | ✅ PASS |
| **Các button khác trong main?** | Chỉ button refresh được phép | Chỉ có duy nhất `Làm mới` (reload dashboard) | ✅ PASS |

`evaluate_script` confirm:
```
mainButtons: ["Làm mới"]
hasThemMoi: false, hasSua: false, hasXoa: false
```

---

## 3. Nhóm role theo kết quả

### ✅ PASS (1 role cấp TW)
- **qtht_tw_4** (QTHT — Cục BTTP - Bộ Tư pháp, cấp TW) — 9/9 widgets render đúng, không lộ CRUD trên dashboard.

### ❌ FAIL
- Không có.

> **Lưu ý scope:** Theo BR-AUTH-08 QTHT vượt scope (thấy tất cả đơn vị). Round này primary test `qtht_tw_4`. Quick verify `qtht_bn_4` (Bộ KH&ĐT) và `qtht_dp_4` (Sở TP Hà Nội) sẽ bổ sung xuống report tổng — expected cũng same widget set vì dashboard QTHT không có entity scoping (đều `R` toàn hệ).

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # widget đã verify | Ghi chú |
|--------|---------------------|---------|
| `HOI_DAP` | 1/1 (FR-I-01) | Widget đếm số hỏi đáp mới, read-only |
| `VU_VIEC` | 3/3 (FR-I-02..04) | 3 widget đếm theo trạng thái |
| `KHOA_HOC` | 2/2 (FR-I-05..06) | 2 widget đếm khóa đang/hoàn thành |
| `TU_VAN_VIEN` | 1/1 (FR-I-07) | Widget đếm chuyên gia/TVV (hiện = 1) |
| `?` (chart) | 2/2 (FR-I-08..09) | Placeholder "Chưa có dữ liệu" |

### Hạn chế / Data readiness

- **Dữ liệu trên widget đa số = 0** → chỉ verify được empty state, chưa stress-test với dữ liệu thật (counts lớn, trend arrow khác "Ổn định").
- **2 chart (FR-I-08, FR-I-09) không xác định entity** trong matrix → report verdict dựa trên UI hành vi (read-only) thay vì entity-level check.
- **Không thể verify filter theo chu kỳ** (ngày/tuần/tháng) — dashboard chưa xuất hiện filter control trong snapshot a11y.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Stress test với dữ liệu thật:**
Sau khi seed data (HOI_DAP/VU_VIEC/KHOA_HOC có bản ghi), re-verify:
- Count widgets update đúng con số mới.
- Chart FR-I-08/09 render đúng khi có dữ liệu đánh giá/khóa học.
- Trend arrow (hiện "Ổn định") đổi theo biến động dữ liệu.

**Ưu tiên 2 — Xác định entity cho FR-I-08/FR-I-09:**
BA confirm 2 chart đánh giá hiệu quả / chất lượng đào tạo map sang entity nào (`BAO_CAO_DANH_GIA`? `KET_QUA_DANH_GIA`?) để đóng gap `?` trong ma trận.

**Sau khi fix / seed → re-test:**
- [ ] Re-verify 7 counter widget với data ≠ 0.
- [ ] Verify 2 chart có render đúng dataset.
- [ ] Cross-check cấp BN (qtht_bn_4) + DP (qtht_dp_4) — confirm BR-AUTH-08 (widget count giống nhau vì QTHT vượt scope).

---

## 6. Quy trình test đã áp dụng

### Tool dùng
Chrome DevTools MCP (primary từ 2026-04-21 — xem CLAUDE.md MCP-Rule 1..7).

### Bước test
```
1. new_page(url="http://103.172.236.130:3000/login")
2. wait_for(["Nhập tên đăng nhập"])
3. take_snapshot → lấy uid form
4. fill_form({username: "qtht_tw_4", password: "Test@1234"})
5. click(submit_uid)
6. wait_for(["Nhập mã xác thực"])
7. type_text("666666")   # OTP bypass
8. wait_for(["Tổng quan", "Dashboard", "Quản trị hệ thống"])
   → URL redirect /dashboard, sidebar render
9. evaluate_script → đếm heading + button trong <main>
10. take_screenshot full-page → R-01-qtht_tw-dashboard.png
```

### Kết quả evaluate_script
```json
{
  "dashboardHeadings": ["Tổng quan hệ thống","0","0","0","0","0","0","1","0","0"],
  "mainButtons": ["Làm mới"],
  "hasThemMoi": false, "hasSua": false, "hasXoa": false,
  "user": {"name":"Quản trị hệ thống TW 4", "role":"QTHT_TW"},
  "url": "http://103.172.236.130:3000/dashboard"
}
```

### Avatar/Header verify
- Header breadcrumb: "Trang chủ > Tổng quan"
- Banner đơn vị: "Bộ Tư pháp — Cục Bổ trợ tư pháp"
- User badge: "Q4" · "Quản trị hệ thống TW 4" · "QTHT_TW" → đúng role expected.

---

## 7. Artifacts

- **Screenshot:** [R-01-qtht_tw-dashboard.png](screenshots/R-01-qtht_tw-dashboard.png) (full-page)
- **Permission matrix ref:** [permission-matrix-by-role.md §1 FR-01](../../../permission-matrix-by-role.md)
- **Test account:** `qtht_tw_4 / Test@1234` (xem [test-accounts-isolation.csv](../../../../input/test-accounts-isolation.csv))

---

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~2 phút (login + navigate + snapshot) |
| Số MCP tool call | 8 (navigate + wait + fill + click + type + 2× snapshot + screenshot) |
| Số screenshot | 1 (full-page) |
| Browser mode | Headed (Chrome DevTools MCP default) |
| Crashes | 0 |
| OTP dùng | `666666` (bypass tạm) |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
