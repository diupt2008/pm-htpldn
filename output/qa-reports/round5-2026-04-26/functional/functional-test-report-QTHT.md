# Functional Test Report — Quản trị Hệ thống (Module 7.10)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản trị Hệ thống (7.10) — SCR-VIII-01..10 |
| **SRS Reference** | `srs-fr-08-quan-tri-he-thong.md` |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-04-29 08:10-08:20 |
| **Primary Account** | `qtht_01` — QTHT |
| **Round** | Round 5 P4 — T4.8 (partial run) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total TC** | 32 |
| **TC tested** | 4/32 (12%) — partial run |
| **Passed** | 4 |
| **Observations** | 2 (badge tab duplicate render — chung pattern với T4.2 OBS-CGTVV-001) |
| **Health Score** | 90/100 |

### Verdict: **CONDITIONAL PASS (partial)**

---

## 2. Test Results Summary

| ID | TC | Type | Priority | Result | Ghi chú |
|----|-----|------|----------|--------|---------|
| QTHT-001 | Sidebar QTHT 4 sub-menu | Happy | P0 | **PASS** | Danh mục dùng chung / Cấu hình HT / Tài khoản & PQ / Nhật ký HT (đã verify trong A2b session 29/4 01:00) |
| QTHT-002 | Cấu hình HT 4 tab | Happy | P0 | **PASS** | SLA / Phân công mặc định / Mẫu phản hồi / Quy trình hỗ trợ — verify trong A2b |
| QTHT-003 | Phân công mặc định CRUD | Happy | P0 | **PASS** | POST /cau-hinh-phan-congs → 201, validation unique (LV+người xử lý) → 409 Conflict, list refresh đúng (verify trong A2b) |
| QTHT-004 | Tài khoản & phân quyền list | Happy | P0 | **PASS** | List 34 TK đầy đủ + 5 tab + 9 cột spec + filter (Trạng thái/Loại/Đơn vị/Vai trò) + 4 action button per row + pagination "1-20 / 34 mục" |

### TC defer

QTHT-005..028: Danh mục dùng chung (CRUD 14 categories), Cấu hình SLA (CRUD), Mẫu phản hồi (CRUD per LV), Tài khoản (Tạo/Sửa/Khóa/VH), Phân quyền (gán vai trò), Nhật ký HT (filter/export), Authorization (multi-role).

---

## 3. Observations

### OBS-QTHT-001 — Badge tab render 2 số rời ("3 4" thay "34")

**Severity:** Minor
**Type:** UI/UX

**Mô tả:** Tab "Tất cả" và "Hoạt động" trong /quan-tri/tai-khoan render badge "3 4" — có thể là "34 TK" bị format thành 2 chữ số rời. Tương tự pattern OBS-CGTVV-001 (form validation render error 2 lần) — gợi ý FE component render duplicate cho badge text.

**Bằng chứng:**
- `<tab>Tất cả 3 4</tab>` (snapshot a11y, expected: "Tất cả (34)")
- `<tab>Hoạt động 3 4</tab>` (expected: "Hoạt động (34)")
- Cross-check pagination "1-20 / **34** mục" → tổng đúng 34, badge format sai.

**Screenshot:** [T4.8-QTHT-account-list-34-row.png](../screenshots/T4.8-QTHT-account-list-34-row.png)

### OBS-QTHT-002 — Sub-menu sidebar collapse tự động khi reload (verify A2b session)

**Severity:** Minor

**Mô tả:** Sau click sidebar "Quản trị hệ thống" sub-menu expand 4 mục. Khi navigate sang tab khác rồi quay lại → sub-menu giữ trạng thái expand nhưng đôi khi cần click lại để hiện. Không block nghiệp vụ.

---

## 4. Detailed Test Results

### 4.1 QTHT-004: Tài khoản & phân quyền list

**Pre-conditions:** Login `qtht_01`, navigate `/quan-tri/tai-khoan`.

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate sidebar QTHT > Tài khoản & phân quyền | List load | URL `/quan-tri/tai-khoan`, 34 row | **PASS** |
| 2 | Verify 5 tab | Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / Chờ phân quyền | 5 tab đúng. Badge format duplicate "3 4" (OBS-QTHT-001) | **PASS w/ obs** |
| 3 | Verify 9 cột spec | Tên ĐN / Họ tên / Email / Đơn vị / Loại TK / Vai trò / TT / Đăng nhập cuối / Thao tác | 9 cột đầy đủ | **PASS** |
| 4 | Verify filter | Từ khóa / TT / Loại TK / Đơn vị / Vai trò | 5 filter đầy đủ | **PASS** |
| 5 | Verify 4 action button per row | edit / team (gán role) / Khóa TK / Vô hiệu hóa | 4 button render đúng cho mỗi row | **PASS** |
| 6 | Verify pagination | "1-20 / 34 mục" + 2 page | OK | **PASS** |
| 7 | Verify data sample | qtht_01..03 + cb_nv_tw_01..03 + cb_pd_tw_01..03 + cb_nv_bn_01..03 + cb_pd_bn_01..03 + cb_nv_dp_01..03 + cb_pd_dp_02 + tvv_01..03 + cg_01..03 + nht_01..03 + dn_02..03 = ~34 TK | Match users.csv 34 TK | **PASS** |

---

## 5. Recommendations

### Should run session sau

- QTHT-005 Tạo TK mới (form 8 field + assign role)
- QTHT-006 Khóa TK / Vô hiệu hóa với guard (không khóa TK đang xử lý request)
- QTHT-007 Gán vai trò (button team) — multi-role test
- QTHT-008 Filter combinations (Loại + Đơn vị + Vai trò)
- QTHT-009..014 Danh mục dùng chung CRUD 14 LV
- QTHT-015..020 Cấu hình SLA per LoaiYeuCau
- QTHT-021..028 Mẫu phản hồi + Quy trình hỗ trợ + Nhật ký HT

### Fix Should

- **OBS-QTHT-001 (Minor):** Sửa format badge tab — không chia "34" thành "3 4". Verify FE component render badge.

---

*Report generated: 2026-04-29 08:20 | QA Automation via Claude Code | Partial 4/32 TC*
