# Bug Report — Seed QTHT Tier 0 (Phase 1 R6)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-05-01 |
| **Loại test** | Seed |
| **Round** | Round 6 (post-reset DB 2026-05-01) |
| **Tài liệu tham chiếu** | [seed-fixture.yaml v2.6.2 §mau_phan_hoi_variants](../../../../input/data/seed-fixture.yaml) · [R6 README](../README.md) · [todo.md R6.1.5](../../../../tasks/todo.md) |

---

## Tổng hợp

Phát hiện **1** lỗi UI khi seed Phase 1 Tier 0 prerequisite.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 0        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FUNC-MPH-001 | Major | P1 | UI/UX | R6.1.5 | `SCR-VIII-06 Tab "Mẫu phản hồi"` (FR-VIII-12) + suy ra từ `FR-II-08 §Inputs row "Mẫu phản hồi"` (HD response chọn template) | Tab "Mẫu phản hồi" thiếu nút [Thêm mới] → không CRUD được mẫu | Open |

---

## BUG-FUNC-MPH-001 — Tab "Mẫu phản hồi" trong Cấu hình HT thiếu nút [Thêm mới]

> **Meta:** Severity, Priority, Type, Status, TC Ref, SRS Reference đã có ở Bug Summary Table trên.

### Mô tả

QTHT mở tab "Mẫu phản hồi" trong Cấu hình hệ thống (`/quan-tri/cau-hinh?tab=mau-phan-hoi`) — chỉ thấy 3 nút (Tìm kiếm / Xóa lọc / Làm mới), **không có nút [Thêm mới]**. Bảng dữ liệu trống "Không có dữ liệu". Hệ quả: QTHT không thể tạo mẫu phản hồi qua UI → cán bộ nghiệp vụ Hỏi đáp không có template để chọn ở Bước 5 (Soạn phản hồi).

### Các bước tái hiện

1. Login `qtht_01 / Secret@123 / OTP 666666`
2. Sidebar → Quản trị hệ thống → Cấu hình hệ thống
3. Click tab "Mẫu phản hồi"
4. Quan sát: bảng trống, chỉ có nút Tìm kiếm/Xóa lọc/Làm mới — **không có nút [Thêm mới]**

### Kết quả mong đợi

- Tab "Mẫu phản hồi" phải có nút [Thêm mới] (giống tab DM dùng chung khác như Lĩnh vực pháp lý, Loại doanh nghiệp).
- QTHT click [Thêm mới] → mở modal nhập tên mẫu, lĩnh vực PL, nội dung mẫu → Đồng ý → record được tạo trạng thái KICH_HOAT.
- Reference: SCR-VIII-06 §Mẫu phản hồi (FR-VIII-12 — DM mở rộng), R5 T1.B1c đã PASS 6/6 với UI có nút [Thêm mới] ngày 2026-04-29.

### Kết quả thực tế

- Tab Mẫu phản hồi UI build dở: chỉ có search filter + table empty.
- DOM verify (`evaluate_script`): button list `["Tìm kiếm","Xóa bộ lọc","Làm mới"]` — không có "Thêm mới".
- Console không lỗi, network không có request CRUD MPH.
- Regression so với R5 T1.B1c (2026-04-29 đã PASS 6/6 mẫu) → có thể dev quên port UI sau reset DB hoặc deploy thiếu file.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FUNC-MPH-001 — Tab Mẫu phản hồi thiếu nút [Thêm mới]](../screenshots/r6-phase1-mau-phan-hoi-missing-add-button.png)

**2. DOM verify (evaluate_script):**

```json
{
  "buttons_in_tab": ["Tìm kiếm", "Xóa bộ lọc", "Làm mới"],
  "tabPanel_state": "empty table + 3 search filters, NO [Thêm mới] button",
  "URL": "/quan-tri/cau-hinh?tab=mau-phan-hoi"
}
```

So sánh với tab DM dùng chung (verified cùng session 2026-05-01 15:35):

```
DM Lĩnh vực pháp lý + DM Loại doanh nghiệp + DM Lý do từ chối:
  ✅ Có button [plus Thêm mới] visible (uid `*_55`/`*_26`/`*_59`)

Cấu hình HT § Mẫu phản hồi:
  ❌ Không có button [Thêm mới] — chỉ Tìm kiếm/Xóa lọc/Làm mới
```

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass dev) |
| MailHog (OTP inbox) | http://103.172.236.130:8025/ |
| API base | http://103.172.236.130:3000/api/v1/ |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-01 16:15 | QA Automation via Claude Code*
