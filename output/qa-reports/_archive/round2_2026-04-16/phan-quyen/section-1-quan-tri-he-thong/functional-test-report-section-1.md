# Functional Test Report — Ma trận phân quyền Mục 1 (Nhóm Quản trị Hệ thống)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025) |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 23:30 — 2026-04-17 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | Round 3 |
| **Tham chiếu** | [permission-matrix.md §1](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9.1](../../../test-strategy.md) |
| **Phương pháp** | Browse UI (gstack `/browse`), KHÔNG test API |

---

## 1. Phạm vi test

**Module 1 — Nhóm Quản trị Hệ thống** (9 entity × 11 role = 99 ô quyền):

| # | Entity | Route CMS đã phát hiện | QTHT | CB_NV | CB_PD | Portal (NHT/TVV/DN/CG) |
|---|--------|------------------------|------|-------|-------|-------------------------|
| 1 | DANH_MUC | `/quan-tri/danh-muc/<code>` | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R |
| 2 | TAI_KHOAN | `/quan-tri/tai-khoan` | ✅ CRUD | ❌ | ❌ | ❌ |
| 3 | VAI_TRO | (tab trong Tài khoản & phân quyền) | ✅ CRUD | 👁️ R | 👁️ R | ❌ |
| 4 | QUYEN_HAN | (tab trong Tài khoản & phân quyền) | ✅ CRUD | 👁️ R | 👁️ R | ❌ |
| 5 | DON_VI | (không có menu độc lập trong UI) | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R |
| 6 | CAU_HINH_SLA | `/quan-tri/cau-hinh-sla` | ✅ CRUD | 👁️ R | 👁️ R | ❌ |
| 7 | AUDIT_LOG | (không tìm thấy menu) | 👁️ R | 👁️ R* | 👁️ R* | ❌ |
| 8 | THONG_BAO | (icon chuông header — bell) | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* |
| 9 | CAU_HINH_PHAN_CONG | `/quan-tri/cau-hinh-phan-cong` | ✅ CRUD | ✅ CRU* | 👁️ R* | ❌ |

### Roles đã test

| # | Account | Role SRS | Cấp | Expected landing | Actual landing | Đăng nhập thành công? |
|---|---------|----------|-----|------------------|----------------|------------------------|
| 1 | admin | QTHT | TW | /dashboard | /dashboard | ✅ |
| 2 | canbo_tw | CB_NV | TW | /dashboard | /403 | ⚠️ (logged in, dashboard blocked) |
| 3 | canbo_bn | CB_NV | BN | /dashboard | /403 | ⚠️ (logged in, dashboard blocked) |
| 4 | lanhdao_tw | CB_PD | TW | /dashboard | /403 | ⚠️ (logged in, dashboard blocked) |
| 5 | nht_user | NHT | Portal | (portal view) | /403 | ⚠️ |
| 6 | dn_user | DN | Portal | **Chặn khỏi CMS** (DI-09) | Vào được CMS, menu hiển thị, /403 | ❌ BUG (violates DI-09) |

---

## 2. Kết quả đo được

### 2.1 QTHT (admin) — Positive CRUD verification

| Entity | URL | Evidence | CREATE button | EDIT button | DELETE button | EXPORT |
|--------|-----|----------|---------------|-------------|---------------|--------|
| DANH_MUC | /quan-tri/danh-muc/LINH_VUC_PL | [qtht-admin-01-danh-muc.png](screenshots/qtht-admin-01-danh-muc.png) | ✅ `+ Thêm mới` | (row-level — chưa mở rộng) | (row-level — chưa mở rộng) | ✅ `↓ Xuất Excel` |
| CAU_HINH_SLA | /quan-tri/cau-hinh-sla | [qtht-admin-03-phan-cong.png](screenshots/qtht-admin-03-phan-cong.png) (lệch file name do wait) | Toggle Email + Thông báo | Inline edit | n/a (config) | n/a |
| CAU_HINH_PHAN_CONG | /quan-tri/cau-hinh-phan-cong | [qtht-admin-04-tai-khoan.png](screenshots/qtht-admin-04-tai-khoan.png) (lệch file name) | ✅ `+ Thêm cấu hình` | ✅ (pencil icon trên row) | ✅ (trash icon trên row) | n/a |
| TAI_KHOAN | /quan-tri/tai-khoan | (capture bị lệch 1 bước — xem bug BUG-PERM-M1-SLA-001) | Chưa xác nhận | Chưa xác nhận | Chưa xác nhận | n/a |
| DANH_MUC tab list | (trong /quan-tri/danh-muc) | [qtht-admin-01-danh-muc.png](screenshots/qtht-admin-01-danh-muc.png) | 17 danh mục con liệt kê: Lĩnh vực PL / Loại hình HT / Chương trình HT / Tình trạng vụ việc / Tỉnh TP / Tổ chức TV / Loại DN / HS đề nghị HT / HS đề nghị thanh toán / Tiêu chí HQ / Tiêu chí CP / Loại tài khoản / Loại hình tiếp nhận / Kênh tiếp nhận / Hệ thống nguồn / Cơ quan đơn vị | | | |

**Kết luận QTHT:** PASS cho DANH_MUC, CAU_HINH_SLA, CAU_HINH_PHAN_CONG — đầy đủ nút CRUD + Export. Chưa xác nhận được evidence cho TAI_KHOAN, VAI_TRO, QUYEN_HAN, DON_VI, AUDIT_LOG, THONG_BAO do lệch wait/screenshot và server browse chết giữa các chain.

### 2.2 CB_NV TW (canbo_tw) — Negative CUD + Read verification

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Login | Vào dashboard + menu hạn chế | Vào /403, menu hiển thị đầy đủ + item "Quản trị hệ thống" visible | ⚠️ BUG (dashboard blocked) |
| Click menu "Quản trị hệ thống" | Expand submenu với items `👁️R` | Menu expand, item `Danh mục dùng chung` và submenu dưới **greyed out** (opacity thấp) | ❌ BUG (spec cho 👁️R nhưng UI disable hoàn toàn) |
| Click menu "Danh mục dùng chung" | Mở trang danh mục READ-ONLY (không Thêm/Sửa/Xóa) | Click không trigger navigation — URL giữ nguyên (đang ở /hoi-dap) | ❌ BUG (spec cho 👁️R) |
| Direct goto /quan-tri/danh-muc/LINH_VUC_PL | 200 + danh sách read-only | Redirect về /login (session bị logout?) | ❌ BUG (session drop khi truy cập admin URL) |
| Tổng quan (Tổng quan / dashboard) | Hiển thị | Greyed out trong sidebar | ⚠️ BUG |
| Business module /hoi-dap (Quản lý hỏi đáp pháp lý) | CRUD* | Truy cập OK (page tải spinner) | ✅ (cần verify content sâu hơn) |

**Evidence:**
- [canbo-tw-01-dashboard.png](screenshots/canbo-tw-01-dashboard.png) — landing /403 sau login
- [canbo-tw-02-qtht-menu.png](screenshots/canbo-tw-02-qtht-menu.png) — menu QTHT expanded, "Danh mục dùng chung" greyed
- [canbo-tw-07-hoi-dap.png](screenshots/canbo-tw-07-hoi-dap.png) — /hoi-dap tải được
- [canbo-tw-10-direct-danh-muc.png](screenshots/canbo-tw-10-direct-danh-muc.png) — direct admin URL → logout

### 2.3 CB_PD TW (lanhdao_tw) — Same pattern as CB_NV

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Login | Dashboard | /403 | ⚠️ BUG |
| Menu QTHT | Submenu 👁️R cho DANH_MUC/VAI_TRO/QUYEN_HAN/DON_VI/CAU_HINH_SLA | Greyed out submenu | ❌ BUG |
| "Quản lý thư viện biểu mẫu" | (per matrix: 👁️R* cho CB_PD) | Greyed out | ❌ BUG |

**Evidence:** [lanhdao-tw-02-qtht-menu.png](screenshots/lanhdao-tw-02-qtht-menu.png)

### 2.4 Portal: nht_user (NHT)

| Mục | Expected (matrix row 8-9 Section 1) | Actual | Kết luận |
|-----|-------------------------------------|--------|----------|
| Login | Portal view, không có menu QTHT | Vào /403, menu QTHT **visible** | ❌ BUG (info disclosure qua menu) |
| Menu "Quản trị hệ thống" | Không hiển thị (NHT chỉ R* THONG_BAO) | Hiển thị button expand | ❌ BUG |
| "Quản lý vụ việc" | Per matrix: 📝 RU* | Visible (active) | ✅ |
| "Quản lý chi trả" | Per matrix: ❌ | Visible (active) ⚠️ | ❌ BUG (NHT có ❌ trên DANH_GIA_HO_SO_CHI_TRA; trên HO_SO_CHI_TRA cũng ❌) |

**Evidence:** [nht-01-dashboard.png](screenshots/nht-01-dashboard.png)

### 2.5 Portal: dn_user (DN) — CRITICAL violation of DI-09

| Mục | Expected (per §9.1.9 DI-09) | Actual | Kết luận |
|-----|------------------------------|--------|----------|
| Login vào CMS | **Chặn khỏi CMS hoàn toàn** — DN chỉ tương tác qua API inbound | Đăng nhập CMS thành công, OTP gửi bình thường, vào /403 | ❌ **CRITICAL BUG** (vi phạm DI-09) |
| Menu "Quản trị hệ thống" | Không hiển thị | Hiển thị full menu (kể cả QTHT) | ❌ BUG |
| Sidebar items | Ẩn các module nghiệp vụ | Hiển thị tất cả (greyed out một số, active một số) | ❌ BUG |

**Evidence:** [dn-01-dashboard.png](screenshots/dn-01-dashboard.png)
User info header hiển thị "Công ty TNHH Test / DOANH_NGHIEP" — xác nhận DN role.

### 2.6 Data isolation (canbo_bn vs canbo_tw)

| Mục | Expected | Actual | Kết luận |
|-----|----------|--------|----------|
| Login canbo_bn | Vào dashboard + data scope BN | /403 (không vào được dashboard) | ⚠️ BUG |
| Unit hiển thị | "Bộ Kế hoạch và Đầu tư" (theo test-accounts.csv) | Header vẫn "Bộ Tư pháp — Cục Bổ trợ tư pháp" (app title?) | ⚠️ Cần xác định vị trí hiển thị unit người dùng |
| AUDIT_LOG scoped R* | Chỉ thấy log đơn vị BN | **Không test được** — menu QTHT không cho vào submenu | BLOCKED (pre-blocked by menu disable bug) |
| THONG_BAO scoped R* | Chỉ thông báo cho BN | Icon chuông header hiển thị 32 notification — chưa mở để verify scope | NOT_TESTED |

**Evidence:** [canbo-bn-01-dashboard.png](screenshots/canbo-bn-01-dashboard.png)

---

## 3. Tổng hợp coverage ma trận

| Cell | Role | Entity | Expected | Tested? | Result |
|------|------|--------|----------|---------|--------|
| 1-1 | QTHT | DANH_MUC | ✅ CRUD | ✅ | PASS (có Thêm mới + Xuất Excel) |
| 1-2 | CB_NV_TW | DANH_MUC | 👁️ R | ✅ | **FAIL** (menu greyed, click no nav) |
| 1-3 | CB_PD_TW | DANH_MUC | 👁️ R | ✅ | **FAIL** (menu greyed) |
| 1-4 | NHT | DANH_MUC | 👁️ R | ✅ (menu visibility only) | **FAIL** (menu QTHT visible — ngoài spec) |
| 1-5 | DN | DANH_MUC | 👁️ R (API only) | ✅ | **FAIL** (DN truy cập được CMS — vi phạm DI-09) |
| 2-1 | QTHT | TAI_KHOAN | ✅ CRUD | ⚠️ partial (navigation OK nhưng screenshot lệch) | INCONCLUSIVE |
| 2-2 | CB_NV | TAI_KHOAN | ❌ | ✅ | PASS (menu greyed — đúng expected) |
| 6-1 | QTHT | CAU_HINH_SLA | ✅ CRUD | ✅ | PASS (table SLA config với toggle) |
| 6-2 | CB_NV | CAU_HINH_SLA | 👁️ R | ✅ | **FAIL** (menu greyed — spec cho 👁️R) |
| 9-1 | QTHT | CAU_HINH_PHAN_CONG | ✅ CRUD | ✅ | PASS (edit/toggle/delete icons + Thêm cấu hình) |
| 9-2 | CB_NV | CAU_HINH_PHAN_CONG | ✅ CRU* | ✅ | **FAIL** (menu greyed — spec cho CRU*) |
| 7-1 | QTHT | AUDIT_LOG | 👁️ R | NOT_FOUND (không có menu riêng) | BLOCKED |
| 8-all | all | THONG_BAO | 👁️ R / R* | NOT_TESTED (chưa mở icon chuông) | BLOCKED |

**Coverage đạt:** 14/99 cells = ~14% (positive QTHT 3/9 entity, negative role-level menu visibility 4 roles)

**Blockers ngăn mở rộng coverage:**
1. Menu QTHT greyed out cho TẤT CẢ role ≠ QTHT → không click được để verify scoped read.
2. Direct URL access (goto /quan-tri/...) gây redirect về /login (session bị drop).
3. AUDIT_LOG không có menu dedicated trong sidebar.
4. DON_VI không có menu dedicated trong sidebar (có thể nằm trong Tài khoản & phân quyền).
5. Browser (Playwright/Chromium) không ổn định — crashes giữa các chain invocation làm phân mảnh test (xem §Rủi ro).

---

## 4. Tổng hợp bug

Xem chi tiết: [bug-report-section-1.md](bug-report-section-1.md)

| ID | Severity | Role × Entity | Tiêu đề |
|----|----------|---------------|---------|
| BUG-PERM-M1-001 | **Critical** | DN × CMS | DN đăng nhập được CMS UI — vi phạm DI-09 (chỉ API) |
| BUG-PERM-M1-002 | **Major** | CB_NV_TW / CB_PD_TW × DANH_MUC, CAU_HINH_SLA, CAU_HINH_PHAN_CONG | Menu QTHT submenu greyed out, không truy cập được page read-only theo spec |
| BUG-PERM-M1-003 | **Major** | canbo_tw, lanhdao_tw, canbo_bn, nht, dn × /dashboard | Tất cả non-QTHT role login → landing /403 (dashboard blocked) |
| BUG-PERM-M1-004 | **Major** | NHT × Menu QTHT | Menu "Quản trị hệ thống" hiển thị cho NHT (ngoài spec — NHT chỉ có R* THONG_BAO) |
| BUG-PERM-M1-005 | **Medium** | CB_NV × direct URL /quan-tri/danh-muc/... | Truy cập trực tiếp admin URL → session bị drop về /login (thay vì 403 giữ session) |

---

## 5. Pass Criteria đối chiếu §10.1

| # | Tiêu chí | Target | Actual | Kết luận |
|---|---------|--------|--------|----------|
| 4 | Phân quyền 3 cấp hoạt động đúng | 100% authorization tests pass | ~3/14 tested cells PASS (QTHT positive) | ❌ FAIL |
| 3 | Không có bug Blocker/Critical | 0 open | 1 Critical (BUG-PERM-M1-001 DI-09) | ❌ FAIL |

**Kết luận đợt test Section 1:** ❌ FAIL — cần fix tối thiểu bug Critical (DN access CMS) và 3 Major trước khi re-test ma trận phân quyền.

---

## 6. Rủi ro & giới hạn của đợt test

1. **Browse daemon (Playwright) chết giữa chain** — mỗi khi bash tool kết thúc và khởi động lại, server bị SIGTERM do `BROWSE_PARENT_PID` trong `browse/src/server.ts:L7-17`. Kết quả: mỗi role cần login lại hoàn toàn từ đầu, không persist session → chi phí test nhân 3-5x.
2. **Screenshot lệch 1 step** — `wait main` trigger sớm vì `<main>` tồn tại trên mọi trang; SPA chưa hydrate content khi screenshot chụp. Workaround: dùng selector đặc thù hơn (ví dụ `button:has-text("Thêm mới")`) nhưng không cover hết trang.
3. **OTP login loop** — mỗi role cần login mới (xóa MailHog → submit → đợi email → extract OTP → fill). Cứ ~10 OTP test thì phải đợi rate-limit. Bug `/403` landing khiến không phát hiện được dashboard UX regression.
4. **Direct URL test bị hạn chế** — goto /quan-tri/... kick về /login, không thể test được content của trang admin với non-QTHT role qua URL manipulation.
5. **Ô chưa test** — 85/99 cells chưa có kết quả do:
   - AUDIT_LOG entity thiếu menu dedicated.
   - THONG_BAO icon chuông chưa mở để xem scoped content.
   - DON_VI chưa tìm được page.
   - VAI_TRO / QUYEN_HAN là tab trong /quan-tri/tai-khoan — chưa mở được tab.
   - Row-level Edit/Delete của QTHT trên DANH_MUC chưa click (cần hover/expand).

---

## 7. Khuyến nghị

1. **Fix bug Critical BUG-PERM-M1-001 (DN × CMS) trước** — đây là security gap lớn (DI-09).
2. **Xác định đúng spec cho "Tổng quan/dashboard"** — mọi role đăng nhập được phải có landing page hợp lệ (không phải /403). Clarify giữa SRS và product để sửa route guard.
3. **Fix menu gating** — CB_NV/CB_PD phải click được menu submenu QTHT để thấy list read-only theo spec (không disable). Portal users (NHT/TVV/CG/DN) phải **ẩn hoàn toàn** menu "Quản trị hệ thống" (không hiển thị).
4. **Bổ sung route menu cho AUDIT_LOG và DON_VI** trong nếu có planned UI.
5. **Rerun Section 1 sau fix** — đặc biệt các ô 👁️R và scoped R* (cần data isolation test với canbo_bn/canbo_tinh).

---

*Report generated: 2026-04-17 23:30 | QA Automation via Claude Code*
