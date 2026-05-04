# Functional Test Report — Ma trận phân quyền Mục 8.1 (Module 7 — Đào tạo, Tập huấn)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Module** | Đào tạo, Tập huấn (Module 7.3 — FR-03) — 22 FR, 10 entity, 11 role |
| **SRS Reference** | [srs-fr-03-dao-tao.md](../../../../input/srs-v3/srs-fr-03-dao-tao.md) §3.4.2 — permission matrix rows CTDT/KH/BG/NHCH/DKT/KQDT/CN/GV/DKDT/DXDT |
| **UC Coverage** | UC20 (CTDT list/create), UC22 (DKDT), UC26 (BG), UC28 (NHCH), UC30 (GV), UC32 (DXDT) — chỉ test authz layer (không test workflow) |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` (bypass tạm cho tất cả account) — fallback MailHog http://103.172.236.130:8025 |
| **Test Method** | UI-based (gstack `/browse` Playwright headless 1280×720) — **KHÔNG test API** (theo yêu cầu user) |
| **Primary Account** | 11 account × role (xem §1.1) — không có primary, test đủ matrix |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 2026-04-19 (tối) |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | round2_2026-04-16 |
| **Tham chiếu** | [permission-matrix.md §8.1](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.3-dao-tao-tap-huan.md](../../../funtion/7.3-dao-tao-tap-huan.md) · [functional-test-report-dao-tao.md](../../dao-tao/functional-test-report-dao-tao.md) · [bug-report-section-8.1-dao-tao.md](bug-report-section-8.1-dao-tao.md) |

---

## 0. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Cells (10 entity × 11 role)** | 110 |
| **Cells Testable via UI** | 44 (4 entity top-level × 11 role) |
| **Cells Blocked (nested)** | 66 (6 entity nested bị chặn bởi BUG-DT-01/-02/-03 chưa fix) |
| **Passed** | 27 / 44 testable (61%) — 27/110 total (24.5%) |
| **Failed** | 16 / 44 testable (36%) |
| **Bugs Found** | 5 (2 Critical, 2 Major, 1 Minor) |
| **Health Score** | 38/100 (2 Critical authz leak + 7 ô role nội bộ mất menu NHCH) |
| **Start Time** | 18:00 (UTC+7) · 2026-04-19 |
| **End Time** | 20:15 (UTC+7) · 2026-04-19 |
| **Total Duration** | ~135 phút (11 role × ~10 phút/role login + traverse 4 submenu + screenshot; 2 lần cleanup browse crash) |
| **Browse Status** | OK (2 session reset giữa các bash invocation được recover bằng atomic chain theo CLAUDE.md Rule 8) |

### Verdict: **FAIL**

FAIL tiêu chí 4 test-strategy §10.1 ("Phân quyền 3 cấp hoạt động đúng — 100% authorization tests pass"). 2 Critical authz bug (data isolation leak BN/DP thấy CTDT TW + TVV đọc được CTDT/KH) + 2 Major (QTHT có write UI + NHCH mất menu cho 7 role nội bộ). 4/5 bug trùng root cause pattern đã gặp ở M3-M7 → xác nhận lỗi hệ thống chung. Fix 2 file BE (row-level scoping + ability guard) + 2 file FE (nav-structure + portal layout) resolve phần lớn.

---

## 1. Phạm vi test

**Module 8.1 — Đào tạo, Tập huấn** (10 entity × 11 role = **110 ô quyền**):

| # | Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|---|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| 1 | CHUONG_TRINH_DAO_TAO | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | 👁️ R | ❌ | ❌ |
| 2 | KHOA_HOC | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | 👁️ R | ❌ | ❌ |
| 3 | BAI_GIANG | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |
| 4 | NGAN_HANG_CAU_HOI | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| 5 | DE_KIEM_TRA | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| 6 | KET_QUA_DAO_TAO | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | 👁️ R* | ❌ | ❌ |
| 7 | CHUNG_NHAN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ |
| 8 | GIANG_VIEN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| 9 | DANG_KY_DAO_TAO | 👁️ R | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 🔌 C†R* | 🔌 C†R* | ❌ | ❌ |
| 10 | DE_XUAT_DAO_TAO | 👁️ R | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R* | 👁️ R* | 🔌 C†RU* | 🔌 C†RU* | ❌ | ❌ |

**Lưu ý phạm vi UI:**

Sidebar "Quản lý đào tạo, tập huấn" có **4 mục submenu** (không đủ 10 entity):
- `Chương trình đào tạo` → route `/dao-tao/chuong-trinh/danh-sach` (entity #1)
- `Khóa học` → route `/dao-tao/khoa-hoc/danh-sach` (entity #2)
- `Ngân hàng câu hỏi` → route `/dao-tao/ngan-hang-cau-hoi/danh-sach` (entity #4)
- `Giảng viên` → route `/dao-tao/giang-vien/danh-sach` (entity #8)

**6 entity còn lại** (BAI_GIANG, DE_KIEM_TRA, KET_QUA_DAO_TAO, CHUNG_NHAN, DANG_KY_DAO_TAO, DE_XUAT_DAO_TAO) không có sidebar riêng — nested trong detail của 4 entity trên (BG trong KH detail, DKT trong NHCH, KQDT/DKDT/CN trong workflow KH, DXDT là tab Prototype nhưng thiếu trong CMS — xem [BUG-DT-06](../../dao-tao/bug-report-dao-tao.md#bug-dt-06-minor--thiếu-tab-đề-xuất-đào-tạo)).

**Do 3 bug active từ round functional Đào tạo chưa fix:**
- **BUG-DT-01 Critical** (KH `/tao-moi` → 404) → chặn mở form tạo KH → không test được Create KH
- **BUG-DT-02 Critical** (CTDT detail crash Chromium tab) → chặn mở CTDT detail → không test được BG/DKDT nested + Update/Delete CTDT
- **BUG-DT-03 Major** (Sidebar NHCH disabled cho CB_NV) → chặn test NHCH + DE_KIEM_TRA

→ **Test ô quyền qua UI chỉ khả thi cho 4 entity top-level (CTDT, KH, NHCH, GV) × 11 role = 44 ô.** 6 entity nested → **BLOCKED do bug Critical/Major nói trên**.

### 1.1 Roles đã test

| # | Account | Role SRS | Đơn vị | Cấp | Landing sau OTP | Avatar hiển thị | Login thành công? |
|---|---------|----------|--------|-----|-----------------|-----------------|------------------|
| 1 | qtht_tw | QTHT | Cục BTTP | TW | /dashboard | QT Hệ thống TW / QTHT_TW | ✅ |
| 2 | canbo_tw | CB_NV_TW | Cục BTTP | TW | /403 (known) | Cán bộ TW / CB_TW | ⚠️ landing /403 |
| 3 | canbo_bn | CB_NV_BN | Bộ KH&ĐT | BN | /403 | Cán bộ BN / CB_BN | ⚠️ |
| 4 | canbo_tinh | CB_NV_DP | Sở TP HN | DP | /403 | Cán bộ Tỉnh / CB_TINH | ⚠️ |
| 5 | lanhdao_tw | CB_PD_TW | Cục BTTP | TW | /403 | Lãnh đạo TW / LANH_DAO_TW | ⚠️ |
| 6 | lanhdao_bn | CB_PD_BN | Bộ KH&ĐT | BN | /403 | Lãnh đạo BN / LANH_DAO_BN | ⚠️ |
| 7 | lanhdao_dp | CB_PD_DP | Sở TP HN | DP | /403 | Lãnh đạo ĐP / LANH_DAO_DP | ⚠️ |
| 8 | dn_user | DN | Công ty TNHH Test | Portal | /403 | Công ty TNHH Test / DOANH_NGHIEP | ✅ |
| 9 | nht_user | NHT | — | Portal | /403 | Nguyễn Văn NHT / NHT | ✅ |
| 10 | tvv_user | TVV | — | Portal | /403 | Trần Văn TVV / TVV | ✅ |
| 11 | chuyengia_user | CG | — | Portal | /403 | Lê Văn CG / CHUYEN_GIA | ✅ |

> Per CLAUDE.md Rule 5, CB_NV_*/CB_PD_*/Portal role landing /403 **không phải auth failure** — role không có dashboard default, sidebar vẫn đầy đủ, click sidebar → vào được các trang module con.

---

## 2. Kết quả đo được — Entity #1 `CHUONG_TRINH_DAO_TAO` (`/dao-tao/chuong-trinh/danh-sach`)

### 2.1 QTHT (qtht_tw) — Expected 👁️ R

Click sidebar "Quản lý đào tạo, tập huấn" → "Chương trình đào tạo" → `/dao-tao/chuong-trinh/danh-sach` PASS.

| Element hiển thị | Có/Không | Kết luận |
|------------------|----------|----------|
| Filter (Từ khóa, Lĩnh vực, Từ/Đến ngày) | ✅ | Read filter |
| Button `Tìm kiếm` / `Xóa bộ lọc` | ✅ | Read action |
| Status tabs (Tất cả, Dự thảo, Chờ duyệt, Đã duyệt, Đang thực hiện, Hoàn thành, Hủy) | ✅ | Read |
| `+ Thêm mới` button (primary) | ❌ **CÓ** | **VI PHẠM 👁️ R — không được có Create** |
| `Xem` link row | ✅ | Read detail |
| 1 row: `CTDT-BTP-TW-2026-0001` (Cục BTTP) | ✅ | Read OK |

**Evidence:** [screenshots/qtht_tw-01-ctdt.png](screenshots/qtht_tw-01-ctdt.png)

**Kết luận 2.1:** ❌ **FAIL** — QTHT có nút `Thêm mới` trên CTDT list, vi phạm 👁️ R (spec cấm Create). Xem [BUG-PERM-M8.1-001](bug-report-section-8.1-dao-tao.md#bug-perm-m81-001).

### 2.2 CB_NV_TW (canbo_tw) — Expected ✅ CRUD* (scope TW = tất cả đơn vị)

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Filter + tabs + search | ✅ | Read |
| `+ Thêm mới` button | ✅ | **Create** allowed per matrix |
| `Xem` link row | ✅ | Read detail (detail crash — BUG-DT-02, không test được Update/Delete) |
| `CTDT-BTP-TW-2026-0001` hiển thị | ✅ | Scope TW: thấy data đơn vị mình (Cục BTTP) |

**Evidence:** [screenshots/recon-ctdt-list.png](screenshots/recon-ctdt-list.png)

**Kết luận 2.2:** ✅ **PASS (list + create visible)** — UI có `Thêm mới` + list có row của Cục BTTP. **Update/Delete không test được** do BUG-DT-02 (CTDT detail crash). Scope TW correct (thấy data TW; TW theo matrix §9 nên thấy cả BN/DP khác nhưng hiện tại hệ thống chỉ có 1 row → không verify được cross-unit visibility).

### 2.3 CB_NV_BN (canbo_bn) — Expected ✅ CRUD* scoped BN (Bộ KH&ĐT)

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` button | ✅ | Create allowed |
| `CTDT-BTP-TW-2026-0001` hiển thị (CTDT thuộc **TW — Cục BTTP**, KHÔNG phải BN) | ❌ **CÓ** | **VI PHẠM scoping** — BN chỉ được thấy data đơn vị mình (Bộ KH&ĐT) |

**Evidence:** [screenshots/canbo_bn-01-ctdt.png](screenshots/canbo_bn-01-ctdt.png)

**Kết luận 2.3:** ❌ **FAIL** — canbo_bn (Bộ KH&ĐT) thấy CTDT của Cục BTTP (TW). Data isolation leak. Xem [BUG-PERM-M8.1-002](bug-report-section-8.1-dao-tao.md#bug-perm-m81-002).

### 2.4 CB_NV_DP (canbo_tinh) — Expected ✅ CRUD* scoped DP (Sở TP HN)

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` | ✅ | OK |
| `CTDT-BTP-TW-2026-0001` hiển thị | ❌ **CÓ** | **VI PHẠM scoping** — DP thấy CTDT của TW |

**Evidence:** [screenshots/canbo_tinh-01-ctdt.png](screenshots/canbo_tinh-01-ctdt.png)

**Kết luận 2.4:** ❌ **FAIL** — Cùng pattern với canbo_bn. [BUG-PERM-M8.1-002](bug-report-section-8.1-dao-tao.md#bug-perm-m81-002).

### 2.5 CB_PD_TW (lanhdao_tw) — Expected 📝 RU* (Read + Update, NO Create/Delete)

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Filter + tabs + search | ✅ | Read |
| `+ Thêm mới` button | ✅ **KHÔNG CÓ** | **PASS** — Create bị cấm đúng spec |
| `Xem` link row | ✅ | Read detail (Update để phê duyệt — không verify được vì detail crash BUG-DT-02) |
| `CTDT-BTP-TW-2026-0001` hiển thị | ✅ | Scope TW correct |

**Evidence:** [screenshots/lanhdao_tw-01-ctdt.png](screenshots/lanhdao_tw-01-ctdt.png)

**Kết luận 2.5:** ✅ **PASS (no Create + can Read)** — RU* enforced đúng spec. Update (approve/reject) không verify được do BUG-DT-02.

### 2.6 CB_PD_BN (lanhdao_bn) — Expected 📝 RU* scoped BN

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` button | ✅ KHÔNG CÓ | OK (no Create) |
| `CTDT-BTP-TW-2026-0001` hiển thị | ❌ **CÓ** | **VI PHẠM scoping** |

**Evidence:** [screenshots/lanhdao_bn-01-ctdt.png](screenshots/lanhdao_bn-01-ctdt.png)

**Kết luận 2.6:** ❌ **FAIL** — BN thấy CTDT TW. [BUG-PERM-M8.1-002](bug-report-section-8.1-dao-tao.md#bug-perm-m81-002).

### 2.7 CB_PD_DP (lanhdao_dp) — Expected 📝 RU* scoped DP

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` button | KHÔNG CÓ | OK |
| `CTDT-BTP-TW-2026-0001` hiển thị | ❌ **CÓ** | **VI PHẠM scoping** |

**Evidence:** [screenshots/lanhdao_dp-01-ctdt.png](screenshots/lanhdao_dp-01-ctdt.png)

**Kết luận 2.7:** ❌ **FAIL** — Cùng pattern. [BUG-PERM-M8.1-002](bug-report-section-8.1-dao-tao.md#bug-perm-m81-002).

### 2.8 DN (dn_user) — Expected 👁️ R

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "Đào tạo" enabled + "CTDT" subitem enabled | ✅ | Match R |
| `+ Thêm mới` button | KHÔNG CÓ | OK (Read only) |
| CTDT row visible | ✅ | Read OK (DN không bị scope theo đơn vị theo matrix §9) |

**Evidence:** [screenshots/dn_user-11-ctdt.png](screenshots/dn_user-11-ctdt.png)

**Kết luận 2.8:** ✅ **PASS** — Read-only đúng spec.

### 2.9 NHT (nht_user) — Expected 👁️ R

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "Đào tạo" + "CTDT" enabled | ✅ | Match R |
| `+ Thêm mới` button | KHÔNG CÓ | OK |
| CTDT row visible | ✅ | Read OK |

**Evidence:** [screenshots/nht_user-11-ctdt.png](screenshots/nht_user-11-ctdt.png)

**Kết luận 2.9:** ✅ **PASS** — Read-only đúng spec.

### 2.10 TVV (tvv_user) — Expected ❌

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "Đào tạo" enabled | ❌ **CÓ** | **VI PHẠM ❌** — TVV không được có menu Đào tạo |
| Sidebar "CTDT" subitem enabled | ❌ **CÓ** | **VI PHẠM ❌** |
| Click "CTDT" → `/dao-tao/chuong-trinh/danh-sach` navigate OK | ❌ **CÓ** | **VI PHẠM ❌** — không được truy cập |
| Danh sách CTDT hiển thị `CTDT-BTP-TW-2026-0001` | ❌ **CÓ** | **VI PHẠM ❌** — TVV đọc được data CTDT nội bộ |

**Evidence:** [screenshots/tvv_user-11-ctdt.png](screenshots/tvv_user-11-ctdt.png)

**Kết luận 2.10:** ❌ **FAIL Critical** — TVV có quyền Read CTDT trong khi matrix quy định ❌ (cấm truy cập). Xem [BUG-PERM-M8.1-003](bug-report-section-8.1-dao-tao.md#bug-perm-m81-003).

### 2.11 CG (chuyengia_user) — Expected ❌

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "Đào tạo" disabled (grayed) | ✅ | Match ❌ |
| Click "Đào tạo" (disabled) → không expand, không navigate | ✅ | Match ❌ |
| Không vào được CTDT list qua UI | ✅ | Match ❌ |

**Evidence:** [screenshots/chuyengia_user-10-sidebar.png](screenshots/chuyengia_user-10-sidebar.png)

**Kết luận 2.11:** ✅ **PASS** — Sidebar disabled đúng spec.

---

## 3. Kết quả đo được — Entity #2 `KHOA_HOC` (`/dao-tao/khoa-hoc/danh-sach`)

> **Dữ liệu:** 0 rows KH trên tất cả 9 trạng thái SM-KHOAHOC (xem [data-readiness-dao-tao.md](../../dao-tao/data-readiness-dao-tao.md)) → KHÔNG verify được data scoping. Chỉ verify được **Create UI permission** (Thêm mới visible hay không).

### 3.1 QTHT (qtht_tw) — Expected 👁️ R

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` button | ❌ **CÓ** | **VI PHẠM 👁️ R** |
| Tabs trạng thái (10 tabs) | ✅ | Read |
| Empty state "Không có khóa học nào phù hợp" | ✅ | Read (0 rows) |

**Evidence:** [screenshots/qtht_tw-02-kh.png](screenshots/qtht_tw-02-kh.png)

**Kết luận 3.1:** ❌ **FAIL** — QTHT có Thêm mới. [BUG-PERM-M8.1-001](bug-report-section-8.1-dao-tao.md#bug-perm-m81-001).

### 3.2 CB_NV_TW (canbo_tw) — Expected ✅ CRUD*

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` button | ✅ | OK (Create allowed per matrix) |
| Empty state | ✅ | 0 rows |

**Evidence:** [screenshots/recon-kh-list.png](screenshots/recon-kh-list.png)

**Kết luận 3.2:** ✅ **PASS (Create UI OK)** — **CAVEAT:** Click `Thêm mới` → navigate `/tao-moi` → **BUG-DT-01 Critical** (404 "Không tìm thấy khóa học"). Nghĩa là UI có quyền nhưng FE router bug chặn Create → Update/Delete không test được vì 0 KH.

### 3.3 CB_NV_BN (canbo_bn) — Expected ✅ CRUD* scoped BN

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| `+ Thêm mới` | ✅ | OK |
| Empty state (0 rows) | ✅ | Không verify được scoping |

**Evidence:** [screenshots/canbo_bn-02-kh.png](screenshots/canbo_bn-02-kh.png)

**Kết luận 3.3:** ✅ **PASS (UI)** — Không verify được data scoping vì 0 KH.

### 3.4-3.7 CB_NV_DP + CB_PD_TW/BN/DP — Giống pattern 2.x

Do data KH = 0 và BUG-DT-01 chặn tạo KH → chỉ verify được **Create button visibility**:
- canbo_tinh: Thêm mới ✅ → **PASS UI**
- lanhdao_tw: Thêm mới **KHÔNG CÓ** → **PASS** (RU* correct)
- lanhdao_bn/dp: Thêm mới **KHÔNG CÓ** → **PASS** (RU* correct)

**Evidence:** [screenshots/canbo_tinh-02-kh.png](screenshots/canbo_tinh-02-kh.png) · [screenshots/lanhdao_tw-02-kh.png](screenshots/lanhdao_tw-02-kh.png)

### 3.8 DN (dn_user) — Expected 👁️ R

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "KH" subitem enabled | ✅ | Match R |
| `+ Thêm mới` | KHÔNG CÓ | OK |
| Empty (0 rows) | ✅ | — |

**Evidence:** [screenshots/dn_user-12-kh.png](screenshots/dn_user-12-kh.png)

**Kết luận 3.8:** ✅ **PASS**.

### 3.9 NHT (nht_user) — Expected 👁️ R

Giống DN → **PASS**. [screenshots/nht_user-12-kh.png](screenshots/nht_user-12-kh.png)

### 3.10 TVV (tvv_user) — Expected ❌

| Element | Có/Không | Kết luận |
|---------|----------|----------|
| Sidebar "KH" subitem enabled | ❌ **CÓ** | **VI PHẠM ❌** |
| Click → `/dao-tao/khoa-hoc/danh-sach` navigate OK | ❌ **CÓ** | **VI PHẠM ❌** |
| Trang KH hiển thị (empty state) | ❌ **CÓ** | **VI PHẠM ❌** |

**Evidence:** [screenshots/tvv_user-12-kh.png](screenshots/tvv_user-12-kh.png)

**Kết luận 3.10:** ❌ **FAIL Critical** — TVV truy cập được trang KH. [BUG-PERM-M8.1-003](bug-report-section-8.1-dao-tao.md#bug-perm-m81-003).

### 3.11 CG (chuyengia_user) — Expected ❌

Sidebar "Đào tạo" disabled → không expand subitem → **PASS** (match ❌).

---

## 4. Kết quả đo được — Entity #4 `NGAN_HANG_CAU_HOI` (`/dao-tao/ngan-hang-cau-hoi/danh-sach`)

### Bảng tổng hợp 11 role

| Role | Expected | Sidebar "NHCH" state | Click result | Verdict |
|------|----------|---------------------|--------------|---------|
| QTHT | 👁️ R | **disabled** | không click được | ❌ **FAIL** — mất quyền R |
| CB_NV_TW | ✅ CRUD* | **disabled** | không click được → **BUG-DT-03** → /403 khi goto direct | ❌ **FAIL** — mất quyền CRUD |
| CB_NV_BN | ✅ CRUD* | **disabled** | — | ❌ **FAIL** |
| CB_NV_DP | ✅ CRUD* | **disabled** | — | ❌ **FAIL** |
| CB_PD_TW | 👁️ R* | **disabled** | — | ❌ **FAIL** — mất quyền R |
| CB_PD_BN | 👁️ R* | **disabled** | — | ❌ **FAIL** |
| CB_PD_DP | 👁️ R* | **disabled** | — | ❌ **FAIL** |
| DN | ❌ | **disabled** | — | ✅ **PASS** — match ❌ |
| NHT | ❌ | **disabled** | — | ✅ **PASS** |
| TVV | ❌ | **disabled** | — | ✅ **PASS** |
| CG | ❌ | **disabled** | — | ✅ **PASS** |

**Verdict NHCH:** 7/11 FAIL (tất cả role nội bộ mất quyền), 4/11 PASS (tất cả role portal đúng ❌). Xem [BUG-PERM-M8.1-004](bug-report-section-8.1-dao-tao.md#bug-perm-m81-004) (dup BUG-DT-03 scope mở rộng sang QTHT + CB_PD).

**Evidence sidebar disabled:** [screenshots/qtht_tw-00-sidebar.png](screenshots/qtht_tw-00-sidebar.png), [screenshots/canbo_bn-00-sidebar.png](screenshots/canbo_bn-00-sidebar.png), HTML dump trong test recon.

---

## 5. Kết quả đo được — Entity #8 `GIANG_VIEN` (`/dao-tao/giang-vien/danh-sach`)

Dữ liệu hiện có: 1 GV `Nguyễn Thành Công` (không rõ đơn vị — không verify được scoping qua list).

### Bảng tổng hợp 11 role

| Role | Expected | Thêm mới | Edit/Delete row | Data visible | Verdict |
|------|----------|----------|-----------------|--------------|---------|
| QTHT | 👁️ R | ❌ **CÓ** | ❌ **CÓ icon pencil + trash** | 1 GV | ❌ **FAIL** — violates 👁️ R, có Create+Update+Delete UI |
| CB_NV_TW | ✅ CRUD* | ✅ CÓ | ✅ CÓ | 1 GV | ✅ **PASS** (CRUD UI match) |
| CB_NV_BN | ✅ CRUD* scoped BN | ✅ CÓ | ✅ CÓ | 1 GV (có thể leak TW) | ⚠️ **UI PASS, scoping UNVERIFIED** |
| CB_NV_DP | ✅ CRUD* scoped DP | ✅ CÓ | ✅ CÓ | 1 GV | ⚠️ **UI PASS, scoping UNVERIFIED** |
| CB_PD_TW | 👁️ R* | KHÔNG CÓ | (icon chưa thấy — action column hidden?) | 1 GV | ✅ **PASS (R*)** |
| CB_PD_BN | 👁️ R* | KHÔNG CÓ | — | 1 GV | ✅ **PASS** |
| CB_PD_DP | 👁️ R* | KHÔNG CÓ | — | 1 GV | ✅ **PASS** |
| DN | ❌ | sidebar subitem disabled | — | — | ✅ **PASS** (match ❌) |
| NHT | ❌ | sidebar disabled | — | — | ✅ **PASS** |
| TVV | ❌ | sidebar disabled | — | — | ✅ **PASS** |
| CG | ❌ | sidebar "Đào tạo" disabled | — | — | ✅ **PASS** |

**Verdict GV:** 1/11 FAIL (QTHT có write UI), 4/11 UNVERIFIED (scoping BN/DP/TW inconclusive do chỉ có 1 GV), 6/11 PASS.

**Evidence:** [screenshots/qtht_tw-03-gv.png](screenshots/qtht_tw-03-gv.png) (QTHT có icon sửa/xóa), [screenshots/lanhdao_tw-03-gv.png](screenshots/lanhdao_tw-03-gv.png) (lanhdao_tw không có Thêm mới + không icon write).

---

## 6. Tổng hợp ma trận — 44 ô testable (4 entity × 11 role)

### 6.1 Matrix kết quả (O = PASS, X = FAIL, − = BLOCKED)

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|:----:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--:|:---:|:---:|:--:|
| CTDT | **X** | O | **X** | **X** | O | **X** | **X** | O | O | **X** | O |
| KH | **X** | O¹ | O² | O² | O | O | O | O | O | **X** | O |
| NHCH | **X** | **X** | **X** | **X** | **X** | **X** | **X** | O | O | O | O |
| GV | **X** | O | O³ | O³ | O | O | O | O | O | O | O |

- **¹** Create UI OK nhưng BUG-DT-01 chặn form tạo (FE router bug — functional issue, không phải authz).
- **²** Scoping không verify được vì 0 KH. Dựa trên pattern CTDT (sees TW), nghi ngờ leak tương tự.
- **³** Scoping chưa verify được (chỉ 1 GV hiện có).

### 6.2 Thống kê

| Nhóm | PASS | FAIL | BLOCKED | Total |
|------|:----:|:----:|:-------:|:-----:|
| **4 entity top-level (testable)** | 27 | 16 | 0 | **44** |
| **6 entity nested (BLOCKED bởi BUG-DT-01/-02/-03)** | — | — | 66 | **66** |
| **Tổng 10 entity × 11 role** | 27 | 16 | 66 | **110** |
| Pass rate (testable only) | **61%** | 36% | — | — |
| Pass rate (total 110) | **24.5%** | 14.5% | 60% | — |

### 6.3 Phân tích theo role

| Role | Expected behavior | Kết quả observable | PASS | FAIL |
|------|-------------------|---------------------|:----:|:----:|
| QTHT | Read-only trên tất cả | Có write UI trên 3/4 entity + mất quyền Read NHCH | 0 | 4/4 |
| CB_NV_TW | CRUD scope TW | CTDT+KH+GV OK nhưng mất NHCH | 3 | 1 |
| CB_NV_BN | CRUD scope BN | CTDT leak TW; KH+GV UI OK; NHCH mất | 1-2 | 2-3 |
| CB_NV_DP | CRUD scope DP | Cùng pattern BN | 1-2 | 2-3 |
| CB_PD_TW | RU scope TW | CTDT+KH+GV OK; NHCH mất | 3 | 1 |
| CB_PD_BN | RU scope BN | CTDT leak TW; NHCH mất | 2 | 2 |
| CB_PD_DP | RU scope DP | Cùng pattern BN | 2 | 2 |
| DN | R on public, ❌ NHCH/GV | All match | 4 | 0 |
| NHT | R on public, ❌ NHCH/GV | All match | 4 | 0 |
| TVV | ❌ tất cả | Đọc được CTDT + KH | 2 | 2 |
| CG | ❌ tất cả | Match (sidebar disabled) | 4 | 0 |

---

## 7. Bug phát hiện — tóm tắt

> **Chi tiết đầy đủ:** [bug-report-section-8.1-dao-tao.md](bug-report-section-8.1-dao-tao.md)

| ID | Severity | Title | Impact |
|----|----------|-------|--------|
| **BUG-PERM-M8.1-001** | **Major** | QTHT có Thêm mới/Sửa/Xóa trên CTDT/KH/GV (👁️ R spec) | 3 ô FAIL + vi phạm nguyên tắc QTHT không sửa entity nghiệp vụ (recurring M5-001/M6-001/M7-001) |
| **BUG-PERM-M8.1-002** | **Critical** | Data isolation fail: CB_NV_BN/DP + CB_PD_BN/DP thấy CTDT của TW | 4 ô FAIL, cross-unit data leak (recurring M3-002/M4-002/M5-002/M6-002) |
| **BUG-PERM-M8.1-003** | **Critical** | TVV có sidebar Đào tạo enabled, đọc được CTDT + KH list (❌ spec) | 2 ô FAIL Critical — TVV leak data đào tạo nội bộ |
| **BUG-PERM-M8.1-004** | **Major** | Sidebar NHCH disabled cho toàn bộ role nội bộ (QTHT + CB_NV_* + CB_PD_*) — dup BUG-DT-03 mở rộng | 7 ô FAIL — toàn bộ nghiệp vụ NHCH+DKT bị chặn access qua UI |
| **BUG-PERM-M8.1-005** | Minor | Portal sidebar (DN/NHT/TVV/CG) hiển thị full CMS menu grayed | UX inconsistency (recurring M6-003/M7-006) |

**Tổng bug:** 5 (1 Major + 2 Critical + 1 Major + 1 Minor). Trong đó **4 bug root-cause trùng pattern** đã gặp ở M3/M4/M5/M6/M7 → xác nhận lỗi hệ thống chung, không riêng module Đào tạo.

---

## 8. Caveat & Pending

### 8.1 Ô không verify được qua UI (BLOCKED)

6 entity nested × 11 role = **66 ô BLOCKED** do:
- **BAI_GIANG** — nested trong KH detail; 0 KH + BUG-DT-01 chặn tạo KH
- **DE_KIEM_TRA** — nested trong NHCH; toàn bộ role nội bộ mất menu NHCH (BUG-DT-03)
- **KET_QUA_DAO_TAO** — nested trong workflow KH DA_KET_THUC; 0 KH state đó
- **CHUNG_NHAN** — nested trong KQDT; phụ thuộc trên
- **DANG_KY_DAO_TAO** — flow DN/NHT đăng ký qua API (🔌 C†) — không test qua UI
- **DE_XUAT_DAO_TAO** — thiếu tab trong CMS (BUG-DT-06) → không có UI để test

### 8.2 Ô verify một phần (UNVERIFIED scoping)

- **KH** cho 6 role (CB_NV_BN/DP + CB_PD_BN/DP): UI có nút đúng, nhưng vì **0 KH** trong DB nên không check được data scope leak.
- **GV** cho 2 role (CB_NV_BN/DP): chỉ 1 GV "Nguyễn Thành Công" — không biết thuộc đơn vị nào → không verify GV scoping.

**Khuyến nghị:** Sau khi fix BUG-DT-01/-02/-03 + seed 3 CTDT (1 TW + 1 BN + 1 DP) + 3 KH per CTDT + 3 GV per đơn vị → re-run section này để verify scoping chính xác.

### 8.3 Lý do không test API (theo yêu cầu user)

- Các ô 🔌 C† / 🔌 C†R* / 🔌 C†RU* (DANG_KY_DAO_TAO + DE_XUAT_DAO_TAO cho DN + NHT): theo matrix phải test qua API endpoint (DN đăng ký đào tạo, NHT đăng ký, BE pipeline). **Out-of-scope request.** → skip, mark BLOCKED.

---

## 9. Verdict

**FAIL** — 16/44 ô observable FAIL (36%), trong đó có **2 bug Critical**:

1. **BUG-PERM-M8.1-002 Critical:** Data isolation leak (4 role BN/DP thấy CTDT của TW) — vi phạm BR-AUTH scoping.
2. **BUG-PERM-M8.1-003 Critical:** TVV đọc được CTDT + KH (spec ❌) — leak data đào tạo nội bộ cho role không có quyền.

Fix 2 root cause chung → unblock:
- **Fix BE row-level security filter** (filter WHERE don_vi_id = current_user.don_vi_id) → unblock BUG-PERM-M8.1-002 cho 4 role.
- **Fix FE/BE ability rule cho TVV** (CTDT/KH access) → unblock BUG-PERM-M8.1-003.
- **Fix FE ability rule cho QTHT** (remove write UI từ CTDT/KH/GV list) → unblock BUG-PERM-M8.1-001.
- **Fix BE/FE ability rule cho NHCH** (whitelist QTHT + CB_NV_* + CB_PD_*) → unblock BUG-PERM-M8.1-004 + BUG-DT-03.

**Pass criteria test-strategy §10.1:**
- Tiêu chí 4: "Phân quyền 3 cấp hoạt động đúng — 100% authorization tests pass" → **FAIL** (24.5% pass rate toàn bộ, 61% pass rate testable only).

**Khuyến nghị round sau:**
1. Fix 2 bug Critical + 3 bug Major trên.
2. Fix BUG-DT-01/-02/-03 (từ round functional Đào tạo).
3. Seed data đầy đủ 3 đơn vị + 3 KH per state.
4. Re-run toàn bộ 110 ô phân quyền §8.1.

---

## 10. Phụ lục — Danh mục ảnh chụp

| File | Mô tả | Dùng cho ô quyền |
|------|-------|-------------------|
| [recon-ctdt-list.png](screenshots/recon-ctdt-list.png) | canbo_tw CTDT list (recon) | §2.2 CB_NV_TW × CTDT |
| [recon-kh-list.png](screenshots/recon-kh-list.png) | canbo_tw KH list (recon) | §3.2 CB_NV_TW × KH |
| [recon-gv-list.png](screenshots/recon-gv-list.png) | canbo_tw GV list (recon) | §5 CB_NV_TW × GV |
| [qtht_tw-00-sidebar.png](screenshots/qtht_tw-00-sidebar.png) | QTHT sidebar Đào tạo (NHCH disabled) | §4 NHCH × QTHT |
| [qtht_tw-01-ctdt.png](screenshots/qtht_tw-01-ctdt.png) | QTHT có Thêm mới trên CTDT | §2.1 BUG-PERM-M8.1-001 |
| [qtht_tw-02-kh.png](screenshots/qtht_tw-02-kh.png) | QTHT có Thêm mới trên KH | §3.1 BUG-PERM-M8.1-001 |
| [qtht_tw-03-gv.png](screenshots/qtht_tw-03-gv.png) | QTHT có Thêm mới + pencil + trash trên GV | §5 BUG-PERM-M8.1-001 |
| [canbo_bn-00-sidebar.png](screenshots/canbo_bn-00-sidebar.png) | canbo_bn sidebar (NHCH disabled) | §4 NHCH × CB_NV_BN |
| [canbo_bn-01-ctdt.png](screenshots/canbo_bn-01-ctdt.png) | **BN thấy CTDT TW** | §2.3 BUG-PERM-M8.1-002 |
| [canbo_bn-02-kh.png](screenshots/canbo_bn-02-kh.png) | canbo_bn KH empty | §3.3 |
| [canbo_bn-03-gv.png](screenshots/canbo_bn-03-gv.png) | canbo_bn GV list | §5 |
| [canbo_tinh-00-sidebar.png](screenshots/canbo_tinh-00-sidebar.png) | canbo_tinh sidebar | §4 |
| [canbo_tinh-01-ctdt.png](screenshots/canbo_tinh-01-ctdt.png) | **DP thấy CTDT TW** | §2.4 BUG-PERM-M8.1-002 |
| [canbo_tinh-02-kh.png](screenshots/canbo_tinh-02-kh.png) | canbo_tinh KH empty | §3.x |
| [canbo_tinh-03-gv.png](screenshots/canbo_tinh-03-gv.png) | canbo_tinh GV | §5 |
| [lanhdao_tw-00-sidebar.png](screenshots/lanhdao_tw-00-sidebar.png) | CB_PD_TW sidebar | §4 |
| [lanhdao_tw-01-ctdt.png](screenshots/lanhdao_tw-01-ctdt.png) | **CB_PD_TW PASS** — không có Thêm mới | §2.5 |
| [lanhdao_tw-02-kh.png](screenshots/lanhdao_tw-02-kh.png) | CB_PD_TW KH (no Thêm mới) | §3.x |
| [lanhdao_tw-03-gv.png](screenshots/lanhdao_tw-03-gv.png) | CB_PD_TW GV (R* — no write UI) | §5 |
| [lanhdao_bn-01-ctdt.png](screenshots/lanhdao_bn-01-ctdt.png) | **CB_PD_BN thấy CTDT TW** | §2.6 BUG-PERM-M8.1-002 |
| [lanhdao_bn-03-gv.png](screenshots/lanhdao_bn-03-gv.png) | CB_PD_BN GV | §5 |
| [lanhdao_dp-01-ctdt.png](screenshots/lanhdao_dp-01-ctdt.png) | **CB_PD_DP thấy CTDT TW** | §2.7 BUG-PERM-M8.1-002 |
| [lanhdao_dp-03-gv.png](screenshots/lanhdao_dp-03-gv.png) | CB_PD_DP GV | §5 |
| [dn_user-00-landing.png](screenshots/dn_user-00-landing.png) | DN landing /403 | §2.8 pre-test |
| [dn_user-10-sidebar-expanded.png](screenshots/dn_user-10-sidebar-expanded.png) | **DN sidebar PASS** — CTDT/KH enabled, NHCH/GV disabled (match ❌) | §2.8 §3.8 |
| [dn_user-11-ctdt.png](screenshots/dn_user-11-ctdt.png) | DN đọc CTDT (R) | §2.8 |
| [dn_user-12-kh.png](screenshots/dn_user-12-kh.png) | DN đọc KH (R) | §3.8 |
| [nht_user-00-landing.png](screenshots/nht_user-00-landing.png) | NHT landing | §2.9 pre-test |
| [nht_user-10-sidebar.png](screenshots/nht_user-10-sidebar.png) | NHT sidebar PASS (giống DN) | §2.9 |
| [nht_user-11-ctdt.png](screenshots/nht_user-11-ctdt.png) | NHT đọc CTDT (R) | §2.9 |
| [nht_user-12-kh.png](screenshots/nht_user-12-kh.png) | NHT đọc KH (R) | §3.9 |
| [tvv_user-00-landing.png](screenshots/tvv_user-00-landing.png) | **TVV sidebar có CTDT/KH enabled (spec ❌)** | §2.10 BUG-PERM-M8.1-003 |
| [tvv_user-11-ctdt.png](screenshots/tvv_user-11-ctdt.png) | **TVV đọc được CTDT list** | §2.10 BUG-PERM-M8.1-003 |
| [tvv_user-12-kh.png](screenshots/tvv_user-12-kh.png) | **TVV vào được KH list** | §3.10 BUG-PERM-M8.1-003 |
| [chuyengia_user-10-sidebar.png](screenshots/chuyengia_user-10-sidebar.png) | **CG sidebar PASS** — Đào tạo disabled (match ❌) | §2.11 §3.11 |
| [chuyengia_user-11-ctdt.png](screenshots/chuyengia_user-11-ctdt.png) | CG /403 khi navigate (subitem disabled click timeout) | §2.11 |
| [00-canbo_tw-landing.png](screenshots/00-canbo_tw-landing.png) | canbo_tw landing /403 (recon) | pre-test |
| [01-canbo_tw-sidebar-expanded.png](screenshots/01-canbo_tw-sidebar-expanded.png) | canbo_tw sidebar expanded (recon — HTML dump) | §1 sidebar map |

**Tổng:** 42 ảnh chụp, organized theo role.

---

*Report generated: 2026-04-19 | QA Automation via Claude Code (Opus 4.7)*
