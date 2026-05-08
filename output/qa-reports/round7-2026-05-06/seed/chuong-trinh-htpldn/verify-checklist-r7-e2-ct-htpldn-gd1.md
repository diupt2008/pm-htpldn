# Verify Checklist — CT HTPLDN GĐ1 data còn (R7.E2)

**Ngày:** 2026-05-07 17:30 • **Tài khoản:** `qtht_02` • **Trạng thái mong đợi:** ≥3 record CT GĐ1 tồn tại
**Màn:** SCR-X.5-01 — Quản lý Chương trình HTPLDN • **Đường dẫn:** `/ct-htpldn/danh-sach`
**API endpoint:** `GET /api/v1/chuong-trinh-htpls?page=1&pageSize=20`
**Spec ref:** [funtion/7.15-chuong-trinh-htpldn.md](../../../funtion/7.15-chuong-trinh-htpldn.md) • SRS FR-X.5-01..15
**Trigger:** R7.6.4 Workflow CT HTPLDN GĐ1 11 bước cần ≥3 CT seed cover 3 path (main / reject / cancel).

---

## Kết quả: ✅ PASS 3/3

3 CT GĐ1 còn tồn tại đầy đủ, cover 3 path R7.6.4 theo trạng thái: DA_DUYET / DU_THAO / HUY. UI pagination khớp API total = 3. Sẵn sàng chạy R7.6.4 workflow.

---

## Bảng dữ liệu verify

| # | Mã CT | Tên chương trình | Trạng thái UI | Trạng thái API | Đơn vị | Match? |
|---|---|---|---|---|---|:-:|
| 1 | CT-20260507-0001 | CT R7.6.4 main flow - HTPLDN 2026 | Đã duyệt | `DA_DUYET` | Cục Bổ trợ tư pháp - Bộ Tư pháp | ✅ |
| 2 | CT-20260507-0002 | CT R7.6.4 reject path | Dự thảo | `DU_THAO` | Cục Bổ trợ tư pháp - Bộ Tư pháp | ✅ |
| 3 | CT-20260507-0003 | CT R7.6.4 cancel path | Đã hủy | `HUY` | Cục Bổ trợ tư pháp - Bộ Tư pháp | ✅ |

**Pagination UI:** "1-3 / 3 mục" (`disabled prev/next`, page 1/1).
**API total:** `total=3, count=3`.
**Path cover R7.6.4:** Main flow (DA_DUYET) + Reject path (DU_THAO chờ phê duyệt) + Cancel path (HUY).

> **Note naming:** todo.md ghi "verify CT-001/002/003" là viết tắt. Mã thực tế dùng convention auto-gen `CT-YYYYMMDD-NNNN` (BR-DATA-04 auto-gen by date). 3 CT này tạo ngày 2026-05-07 nên prefix `20260507`.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP.
**Setup:** Click sidebar uid `4_18` "Quản lý chương trình hỗ trợ pháp lý doanh nghiệp" → React Router navigate `/ct-htpldn/danh-sach` (giữ session, KHÔNG dùng `navigate_page` per MCP-Rule 3).
**Verify UI:** `take_snapshot` đọc 3 row table với link mã CT + cột trạng thái + pagination text.
**Verify API:** `evaluate_script` chạy `fetch('/api/v1/chuong-trinh-htpls?page=1&pageSize=20')` từ session login → parse `total + items[*].maChuongTrinh + trangThai`.

---

## Ảnh chụp

- [r7-e2-ct-htpldn-list-3-records.png](r7-e2-ct-htpldn-list-3-records.png) — UI list view 3 records với mã + trạng thái + pagination "1-3 / 3 mục".

---

## Out of scope (không test trong R7.E2)

- Workflow phê duyệt CT (DU_THAO → CHO_DUYET → DA_DUYET) — thuộc R7.6.4.
- CT GĐ2 Đợt báo cáo 7 bước — thuộc R7.6.5.
- Functional test CT 42 TC — thuộc R7.7.15.

R7.E2 scope = chỉ verify 3 CT data còn (data readiness check trước khi chạy R7.6.4).

---

*2026-05-07 17:30 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
