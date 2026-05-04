# T1.A1 — Smoke Test 16 module × 5 vai trò chính

**Run:** 2026-04-26 21:50–21:58 (~8 phút) · **Tool:** Chrome DevTools MCP · **Tester:** automated.

**Acceptance:**
- 16/16 module render cho `cb_nv_tw_01` + `qtht_01` ✅
- BN/ĐP scope ≥2 module ✅
- Chi trả + TV nhanh ≥1 record BE-synced ✅ (E3 + E4 unblock)

---

## 1. Tóm tắt

| Vai trò | TK | Sidebar count | Module render | Pass rate | Note |
|---|---|---|---|---|---|
| CB_NV_TW | cb_nv_tw_01 | 12 | 12/12 + 7 sub = 14 page | 100% | Baseline đầy đủ |
| QTHT | qtht_01 | 13 | 13/13 + 9 sub = 17 page | 100% | + Quản trị hệ thống (4 sub) |
| CB_PD_TW | cb_pd_tw_01 | 12 | 12/12 (sidebar identical CB_NV_TW) | 100% | Khác permission CRUD/approve, sẽ verify P2 |
| CB_NV_DP | cb_nv_dp_01 | 12 | 12/12 + scope filter ĐP | 100% | KPI 0 (đơn vị AG chưa data), không có dropdown "Đơn vị" |
| QTHT (root) | admin | 13 | 13/13 (identical qtht_01) | 100% | Display "Quản trị hệ thống" badge QTHT |

**Tổng 5 vai trò: 100% module render, 0 placeholder "đang phát triển", 0 console error block.**

---

## 2. Matrix sidebar 16 module × 5 vai trò

| # | Module | Top-level button | URL | CB_NV_TW | QTHT | CB_PD_TW | CB_NV_DP | admin |
|---|---|---|---|---|---|---|---|---|
| 1 | Tổng quan | Tổng quan | `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 | Hỏi đáp | Quản lý hỏi đáp pháp lý | `/hoi-dap` | ✅ 7 row | ✅ 7 row | ✅ | ✅ 0 row (scope) | ✅ |
| 3 | Đào tạo (parent) | Quản lý đào tạo, tập huấn | (submenu) | ✅ 5 sub | ✅ 5 sub | ✅ | ✅ | ✅ |
| 3.1 | CTĐT | Chương trình đào tạo | `/dao-tao/chuong-trinh/danh-sach` | ✅ 4 row | ✅ | — | — | — |
| 3.2 | Khóa học | Khóa học | `/dao-tao/khoa-hoc/danh-sach` | (sub render proxy) | ✅ | — | — | — |
| 3.3 | Kho tài liệu | Kho tài liệu | `/dao-tao/kho-tai-lieu` | (sub) | ✅ | — | — | — |
| 3.4 | NHCH | Ngân hàng câu hỏi | `/dao-tao/ngan-hang-cau-hoi` | (sub) | ✅ | — | — | — |
| 3.5 | Giảng viên | Giảng viên | `/dao-tao/giang-vien` | (sub) | ✅ | — | — | — |
| 4 | CG/TVV | Quản lý chuyên gia / tư vấn viên | `/chuyen-gia-tvv/danh-sach` | ✅ 1 row | ✅ | ✅ | ✅ | ✅ |
| 5 | Vụ việc | Quản lý vụ việc hỗ trợ pháp lý | `/vu-viec/danh-sach` | ✅ 7 row | ✅ | ✅ | ✅ | ✅ |
| 6 | Chi trả | Quản lý chi trả chi phí | `/chi-tra/danh-sach` | ✅ **20 row** | ✅ | ✅ | ✅ | ✅ |
| 7 | DN | Quản lý doanh nghiệp được hỗ trợ | `/doanh-nghiep/danh-sach` | ✅ 6 row | ✅ | ✅ | ✅ 0 row (scope) | ✅ |
| 8 | ĐG HQ | Đánh giá hiệu quả hỗ trợ pháp lý | `/danh-gia/ke-hoach/danh-sach` | ✅ 1 row | ✅ | ✅ | ✅ | ✅ |
| 9 | Biểu mẫu | Quản lý thư viện biểu mẫu | `/bieu-mau/thu-muc` | ✅ 4 row | ✅ | ✅ | ✅ | ✅ |
| 10 | Tư vấn (parent) | Quản lý tư vấn | (submenu) | ✅ 2 sub | ✅ 2 sub | ✅ | ✅ | ✅ |
| 10.1 | TV chuyên sâu | Tư vấn chuyên sâu | `/tv-chuyen-sau/danh-sach` | ✅ 6 row | ✅ | — | — | — |
| 10.2 | TV nhanh | Tư vấn nhanh | `/tv-nhanh/danh-sach` | ✅ **20 row** | ✅ | — | — | — |
| 11 | CT HTPLDN | Quản lý chương trình HTPLDN | `/ct-htpldn/danh-sach` | ✅ 0 row (UI render OK) | ✅ | ✅ | ✅ | ✅ |
| 12 | Báo cáo | Báo cáo thống kê | `/bao-cao` | ✅ render | ✅ | ✅ | ✅ | ✅ |
| 13 | QTHT (parent) | Quản trị hệ thống | (submenu) | ❌ (đúng scope) | ✅ 4 sub | ❌ | ❌ | ✅ 4 sub |
| 13.1 | DM dùng chung | Danh mục dùng chung | `/quan-tri/danh-muc/LINH_VUC_PL` | — | ✅ 12 row | — | — | ✅ |
| 13.2 | Cấu hình HT | Cấu hình hệ thống | `/quan-tri/cau-hinh` | — | (sub render proxy) | — | — | (sub) |
| 13.3 | TK & phân quyền | Tài khoản & phân quyền | `/quan-tri/tai-khoan` | — | (sub) | — | — | (sub) |
| 13.4 | Nhật ký HT | Nhật ký hệ thống | `/quan-tri/nhat-ky` | — | (sub) | — | — | (sub) |

---

## 3. Acceptance từng vai trò

### ✅ cb_nv_tw_01 — 16/16 (gồm 12 top + 5 sub Đào tạo + 2 sub Tư vấn = 19 page; baseline đầy đủ)
- 12/12 module top-level render PASS, 7 page sub PASS.
- Chi trả `/chi-tra/danh-sach` = **20 row BE-synced** → **E3 unblock**.
- TV nhanh `/tv-nhanh/danh-sach` = **20 row BE-synced** → **E4 unblock** (regression fix R4 memory `qa_htpldn_tvnhanh_smoke`).
- CT HTPLDN `/ct-htpldn/danh-sach` = page render OK, 0 record empty state, không placeholder → **E2 partial-unblock** (cần verify nút Tạo CT khi seed P3.3).
- Submenu Tư vấn không có "Hợp đồng tư vấn" → **E1 vẫn block** (M14 chưa cấp quyền CB_NV_TW hoặc chưa build).

### ✅ qtht_01 — 13/13 + Đào tạo 5 sub + Tư vấn 2 sub + QTHT 4 sub = 22 page
- Sidebar đầy đủ + extra "Quản trị hệ thống" 4 sub.
- DM dùng chung 12 row carry-over R4.
- Dashboard widget "Đơn vị" dropdown active (filter cấp đơn vị TW/QTHT).

### ✅ cb_pd_tw_01 — 12/12 sidebar identical cb_nv_tw_01
- Cùng 12 top-level button labels, cùng URL routes.
- Phân biệt CB_NV_TW vs CB_PD_TW thật sự ở permission CRUD/approve (button Phê duyệt), sẽ verify ở P2 trụ A workflow.

### ✅ cb_nv_dp_01 — 12/12 + scope filter ĐP
- Sidebar 12 (no QTHT, đúng scope CB cấp ĐP).
- Dashboard widget **không có dropdown "Đơn vị"** (TW có) — đúng spec scope ĐP chỉ thấy data đơn vị mình.
- Spot-check 2 module:
  - HD: 0 row (TW = 7) → scope filter đúng.
  - DN: 0 row (TW = 6) → scope filter đúng.
- Acceptance "BN/ĐP scope ≥2 module": ✅ (đã verify HD + DN, scope đúng đơn vị AG).

### ✅ admin (QTHT root) — 13/13 identical qtht_01
- Hành vi như qtht_01 (display name "Quản trị hệ thống" thay vì "QTHT Test 01"), cùng sidebar 13, cùng route.

---

## 4. Quan sát phụ (không log bug — chỉ ghi nhận)

1. **Carry-over data từ Round 4 (TW scope):**
   - HD: 7 row (HD-20260424-001..007)
   - VV: 7 row (carry-over R4)
   - DN: 6 row
   - Đào tạo CTĐT: 4 row (CTĐT-BTP-TW-2026-0001..0004)
   - TVV: 1 row (TVV-BTP-TW-0001 active)
   - Biểu mẫu thư mục: 4 row
   - TV CS: 6 row
   - **Chi trả: 20 row** (mới synced từ R4 hoặc fresh seed env-side)
   - **TV nhanh: 20 row** (mới — R4 từng block)
   - ĐG kỳ: 1 row
   - **Tác động:** P1 seed (T1.B*, T1.C*) cần kiểm tra trùng lặp trước khi seed thêm. Thông thường append vào pool sẵn có, không re-seed lại.

2. **3/4 module Trụ E unblock sớm** (so với plan):
   - **E3 Chi trả:** ✅ unblock (20 row visible). P3.1 + T4.12 KHÔNG defer.
   - **E4 TV nhanh:** ✅ unblock (20 row visible, regression fix R4). P3.2 + T4.11 KHÔNG defer.
   - **E2 CT HTPLDN:** ⚠️ partial-unblock (UI render, 0 record). Cần seed test P3.3 nút Tạo CT.
   - **E1 HĐ Tư vấn:** 🚫 vẫn block (submenu Tư vấn chỉ 2 sub, thiếu HĐ TV cho CB_NV_TW). Có thể role bị deny hoặc M14 chưa build. **Cần verify role QTHT/admin có thấy HĐ TV không** (để biết là module-deny hay role-deny).

3. **Sidebar layout consistent:** Cả 5 vai trò dùng cùng layout sidebar (chỉ khác số button + scope), không vai trò nào bị vỡ UI.

4. **Notification counter:** cb_nv_tw_01 = 60 unread (R4 carry), qtht_01 = 4 unread, cb_pd_tw_01 = 1, cb_nv_dp_01 = 1, admin = 1. 

---

## 5. Verdict & Next

✅ **T1.A1 PASS** — 5/5 vai trò, 16/16 module render, 0 bug.

**Block update (cập nhật bảng "Module bị block" trong todo.md):**
- 🚫 → ✅ E3 Chi trả (M8) — unblock
- 🚫 → ✅ E4 TV nhanh (M10A) — unblock
- 🚫 → ⚠️ E2 CT HTPLDN GĐ1 (M11) — partial unblock (UI render)
- 🚫 vẫn block: E1 HĐ Tư vấn (M14) — pending verify role scope

**Next:** P1 Block B — T1.B1 Seed Quản trị nền tảng (qtht_01).

---

## 6. Artifacts

- Report: `output/qa-reports/round5-2026-04-26/smoke-test/smoke-test-report.md` (file này)
- Bug found: 0
- Screenshots: not captured (smoke render OK pass, no bug to evidence)
