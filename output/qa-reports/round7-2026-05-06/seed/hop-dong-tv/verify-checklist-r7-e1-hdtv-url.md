# Verify Checklist — HĐ TV URL 404 (R7.E1)

**Ngày:** 2026-05-07 17:25 • **Tài khoản:** `qtht_02` • **Trạng thái mong đợi:** `404 Not Found`
**Màn:** N/A (verify URL behavior — không có màn riêng theo spec v2.1)
**SRS:** [FR-X.3-01 UC159 — Quản lý HĐ tư vấn](../../../../input/srs-update-2026-5-5/srs-v3.5.md) §3.4.3.13 + §4.2.14 + M-01 line 660
**Spec ref:** [funtion/7.14-hop-dong-tv.md](../../../funtion/7.14-hop-dong-tv.md) line 23-26 — "HĐ TV không còn là mục menu độc lập, truy cập qua sub-resource VV/TVV"

---

## Mục tiêu verify

Theo SRS v2.1+, HĐ TV (HOP_DONG_TU_VAN) **KHÔNG có menu độc lập** (M-01 line 660). Truy cập qua:
1. Chi tiết Vụ việc (MH-05.3) → tab "HĐ tư vấn liên kết"
2. Chi tiết TVV (MH-04.3) → tab "Lịch sử" → HĐ

Vì vậy các URL **standalone** phải trả 404 (không render list/CRUD độc lập).

---

## Kết quả: ✅ PASS 6/6

Tất cả URL standalone (cả FE route + API endpoint) đã trả 404 đúng spec. Sidebar không có item HĐ TV độc lập.

---

## Bảng verify

| # | URL | Loại | HTTP status | Render thực tế | Match spec? |
|---|---|---|:-:|---|:-:|
| 1 | `/quan-tri/hop-dong-tu-van` | FE route | 200 (SPA shell) → React Router render **404 page** | "404 / Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển. / Đường dẫn: /quan-tri/hop-dong-tu-van / Về trang chủ / Quay lại" | ✅ |
| 2 | `/hop-dong-tu-van` | FE route | 200 (SPA shell) → React Router render **404 page** | "404 / Trang bạn tìm kiếm không tồn tại... / Đường dẫn: /hop-dong-tu-van" | ✅ |
| 3 | `/hop-dong` | FE route | 200 (SPA shell) → React Router render **404 page** | "404 / Trang bạn tìm kiếm không tồn tại... / Đường dẫn: /hop-dong" | ✅ |
| 4 | `/quan-ly/hop-dong-tu-van` | FE route | 200 (SPA shell) → React Router render 404 (chưa screenshot riêng) | (cùng pattern row 1-3) | ✅ |
| 5 | `/api/v1/hop-dong` | API REST | **404** `application/json` | (BE response) | ✅ |
| 6 | `/api/v1/hop-dong-tu-van` | API REST | **404** `application/json` | (BE response) | ✅ |

**Sidebar verify:** 13 nhóm menu cấp 1, KHÔNG có nhóm "Quản lý hợp đồng tư vấn" hoặc "Hợp đồng" độc lập:
1. Tổng quan
2. Quản lý hỏi đáp pháp lý
3. Quản lý đào tạo, tập huấn ▶
4. Mạng lưới Tư vấn viên ▶
5. Quản lý vụ việc hỗ trợ pháp lý
6. Quản lý chi trả chi phí
7. Quản lý doanh nghiệp được hỗ trợ
8. Đánh giá hiệu quả hỗ trợ pháp lý
9. Quản lý thư viện biểu mẫu
10. Quản lý tư vấn ▶
11. Quản lý chương trình hỗ trợ pháp lý doanh nghiệp
12. Báo cáo thống kê
13. Quản trị hệ thống ▶

---

## Phương pháp test

**Tool:** Chrome DevTools MCP (`mcp__chrome-devtools__*`) — theo CLAUDE.md MCP-Rule 1-7.
**Login flow:** MCP-Template (qtht_02 / Secret@123 / OTP 666666) — verified PASS.
**FE route check:** `navigate_page` + `evaluate_script` đọc `document.body.innerText.match(/404[\s\S]{0,200}/)`.
**API check:** `evaluate_script` chạy `fetch('/api/v1/...')` từ session đang login → check `response.status`.

---

## Ảnh chụp

- [r7-e1-quan-tri-hop-dong-tu-van-404.png](r7-e1-quan-tri-hop-dong-tu-van-404.png) — `/quan-tri/hop-dong-tu-van` render trang 404 với "Đường dẫn: /quan-tri/hop-dong-tu-van"

---

## Out of scope (không test trong R7.E1)

- Sub-resource access via VV detail tab "HĐ tư vấn liên kết" — thuộc R7.7.14 functional HĐ TV (cần VV ID).
- Sub-resource API `GET /api/v1/vu-viec/<id>/hop-dong` happy path — thuộc R7.7.16 API test.
- HĐ TV CRUD via sub-resource pattern — thuộc R7.7.14.

R7.E1 scope = chỉ verify standalone URL trả 404 (regression check spec v2.1 đã loại bỏ menu độc lập).

---

*2026-05-07 17:25 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
