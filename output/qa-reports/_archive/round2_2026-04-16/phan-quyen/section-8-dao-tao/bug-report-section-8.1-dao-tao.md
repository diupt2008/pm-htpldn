# Bug Report — Ma trận phân quyền Mục 8.1 (Module Đào tạo, Tập huấn)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 2026-04-19 |
| **Loại test** | Permission Matrix (Authorization) — Module Đào tạo (FR-03) |
| **Round** | round2_2026-04-16 |
| **Test report gốc** | [functional-test-report-section-8.1-dao-tao.md](functional-test-report-section-8.1-dao-tao.md) |
| **Tài liệu tham chiếu** | [permission-matrix.md §8.1](../../../permission-matrix.md#81-module-7--đào-tạo-tập-huấn-in-scope) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [bug-report-dao-tao.md](../../dao-tao/bug-report-dao-tao.md) (round functional liên quan) |

---

## Tổng hợp

Phát hiện **5** lỗi trong quá trình test permission matrix §8.1 Đào tạo, Tập huấn.

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 5    | 2        | 2     | 0      | 1     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| [BUG-PERM-M8.1-001](#bug-perm-m81-001--major--qtht-có-thêm-mớisửaxóa-trên-ctdtkhgv-spec-👁️-r) | Major | P1 | Permission | Đào tạo | §8.1 QTHT × CTDT/KH/GV | QTHT có Thêm mới/Sửa/Xóa trên CTDT/KH/GV (spec 👁️ R) | Open |
| [BUG-PERM-M8.1-002](#bug-perm-m81-002--critical--data-isolation-fail-cb_nv_bndp--cb_pd_bndp-thấy-ctdt-của-tw) | **Critical** | P0 | Permission | Đào tạo | §8.1 CB_NV/CB_PD BN+DP × CTDT | Data isolation fail — BN/DP thấy CTDT của TW | Open |
| [BUG-PERM-M8.1-003](#bug-perm-m81-003--critical--tvv-đọc-được-ctdt--kh-list-spec-) | **Critical** | P0 | Permission | Đào tạo | §8.1 TVV × CTDT + KH | TVV đọc được CTDT + KH list (spec ❌) | Open |
| [BUG-PERM-M8.1-004](#bug-perm-m81-004--major--sidebar-nhch-disabled-cho-toàn-bộ-role-nội-bộ-dup-bug-dt-03-scope-mở-rộng) | Major | P0 | Permission | Đào tạo | §8.1 QTHT + CB_NV_* + CB_PD_* × NHCH | Sidebar NHCH disabled cho 7 role nội bộ (dup BUG-DT-03 mở rộng) | Open |
| [BUG-PERM-M8.1-005](#bug-perm-m81-005--minor--portal-sidebar-hiển-thị-full-cms-menu-grayed) | Minor | P2 | UI/UX | Đào tạo | §8.1 DN/NHT/TVV/CG sidebar | Portal sidebar hiển thị full CMS menu grayed | Open |

> **Chú thích Type:**
> - `Permission` — phân quyền (role × action × data scope)
> - `UI/UX` — giao diện, hiển thị, tương tác

> **Chú thích Severity:**
> - `Critical` — lộ dữ liệu, sai nghiệp vụ nghiêm trọng
> - `Major` — tính năng quan trọng lỗi nhưng có workaround
> - `Minor` — lỗi nhỏ, không ảnh hưởng nghiệp vụ

> **Chú thích Priority:**
> - `P0` — phải fix ngay (block release)
> - `P1` — fix trong sprint hiện tại
> - `P2` — fix trong 2-3 sprint tới

---

## BUG-PERM-M8.1-001 — Major · QTHT có Thêm mới/Sửa/Xóa trên CTDT/KH/GV (spec 👁️ R)

| Trường | Giá trị |
|--------|---------|
| **Bug ID** | BUG-PERM-M8.1-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Đào tạo, Tập huấn (FR-03) |
| **Thành phần** | FE ability rules (CASL) / nav-structure + BE endpoint permission check |
| **URL** | `/dao-tao/chuong-trinh/danh-sach`, `/dao-tao/khoa-hoc/danh-sach`, `/dao-tao/giang-vien/danh-sach` |
| **Trình duyệt** | Chromium 146 (headless, Playwright, 1280×720) |
| **Tài khoản** | `qtht_tw / Test@1234` (QTHT, TW — Cục BTTP) |
| **Role** | QTHT |
| **Entity ảnh hưởng** | CHUONG_TRINH_DAO_TAO, KHOA_HOC, GIANG_VIEN |
| **Matrix spec** | 👁️ R (chỉ xem) |
| **Actual** | Có nút `+ Thêm mới` + icon Sửa/Xóa row |
| **TC Reference** | §8.1 QTHT × CTDT (§2.1), × KH (§3.1), × GV (§5) trong functional report |
| **SRS Reference** | permission-matrix §8.1 row CHUONG_TRINH_DAO_TAO / KHOA_HOC / GIANG_VIEN — cột QTHT |
| **Assignee** | FE (ability rules), BE (endpoint permission check) |
| **Found by** | QA Automation via Claude Code (Opus 4.7) |

### Mô tả
Role QTHT (quản trị hệ thống, `qtht_tw`) login vào CMS, vào các trang:
- `/dao-tao/chuong-trinh/danh-sach` → nút "+ Thêm mới" hiển thị
- `/dao-tao/khoa-hoc/danh-sach` → nút "+ Thêm mới" hiển thị
- `/dao-tao/giang-vien/danh-sach` → nút "+ Thêm mới" + icon pencil (Sửa) + trash (Xóa) cho mỗi GV row

Theo permission-matrix §8.1, QTHT = 👁️ R trên tất cả 10 entity của module Đào tạo → chỉ được xem, không được tạo/sửa/xóa.

### Steps to reproduce
1. Login `qtht_tw / Test@1234` + OTP `666666`.
2. Sidebar → Quản lý đào tạo, tập huấn → Chương trình đào tạo.
3. Observe: Nút `+ Thêm mới` hiển thị ở header table (màu xanh primary).
4. Back → "Khóa học" → observe: Nút `+ Thêm mới` hiển thị.
5. Back → "Giảng viên" → observe: Nút `+ Thêm mới` + cột "Thao tác" có icon pencil + trash cho row "Nguyễn Thành Công".

### Expected
Không có nút Tạo/Sửa/Xóa nào → QTHT chỉ thấy filter + list + `Xem` link row.

### Actual
3 entity đều có write UI (Create; GV có cả Update/Delete).

### Evidence
- [screenshots/qtht_tw-01-ctdt.png](screenshots/qtht_tw-01-ctdt.png)
- [screenshots/qtht_tw-02-kh.png](screenshots/qtht_tw-02-kh.png)
- [screenshots/qtht_tw-03-gv.png](screenshots/qtht_tw-03-gv.png)

### Root cause (suggested)
FE ability rules (CASL/permissions config) whitelist QTHT có `create`/`update`/`delete` trên các resource `CTDT`, `KH`, `GV`. Cần restrict QTHT chỉ có `read` trên entity nghiệp vụ (business entity), giữ CRUD chỉ trên entity quản trị (TAI_KHOAN, VAI_TRO, DANH_MUC, DON_VI, CAU_HINH_*).

### Recurring pattern
Đây là lần thứ **4** bug cùng pattern:
- BUG-PERM-M5-001 (Major) — QTHT có Thêm/Sửa/Xóa trên HO_SO_CHI_TRA
- BUG-PERM-M6-001 (Major) — QTHT có Thêm mới/Sửa/Xóa trên DOANH_NGHIEP
- BUG-PERM-M7-001 (Major) — QTHT có Thêm thư mục/Công khai/Sửa/Xóa trên BIEU_MAU

→ **Root cause chung 1 file FE (ability-rule/permission-policy).** Fix 1 nơi = resolve cả 4 module. Khuyến nghị FE team review toàn bộ CASL rules cho QTHT role.

---

## BUG-PERM-M8.1-002 — Critical · Data isolation fail: CB_NV_BN/DP + CB_PD_BN/DP thấy CTDT của TW

| Trường | Giá trị |
|--------|---------|
| **Bug ID** | BUG-PERM-M8.1-002 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Đào tạo, Tập huấn (FR-03) |
| **Thành phần** | BE endpoint `GET /api/v1/dao-tao/chuong-trinh-dao-tao` (thiếu row-level security filter theo `don_vi_id`) |
| **URL** | `/dao-tao/chuong-trinh/danh-sach` |
| **Trình duyệt** | Chromium 146 (headless, Playwright, 1280×720) |
| **Tài khoản** | `canbo_bn` (CB_NV_BN, Bộ KH&ĐT), `canbo_tinh` (CB_NV_DP, Sở TP HN), `lanhdao_bn` (CB_PD_BN), `lanhdao_dp` (CB_PD_DP) |
| **Role** | CB_NV_BN, CB_NV_DP, CB_PD_BN, CB_PD_DP (4 role) |
| **Entity ảnh hưởng** | CHUONG_TRINH_DAO_TAO |
| **Matrix spec** | scoped theo đơn vị (BN chỉ thấy data BN, DP chỉ thấy data DP) |
| **Actual** | 4 role ngoài TW đều thấy `CTDT-BTP-TW-2026-0001` (thuộc Cục BTTP = TW) |
| **TC Reference** | §8.1 §2.3 CB_NV_BN × CTDT, §2.4 CB_NV_DP × CTDT, §2.6 CB_PD_BN × CTDT, §2.7 CB_PD_DP × CTDT |
| **SRS Reference** | permission-matrix §8.1 row CHUONG_TRINH_DAO_TAO — cột CB_NV_BN/DP + CB_PD_BN/DP (tất cả có `*` scoping) · test-strategy §5.2 DI-02/DI-03/DI-04/DI-05 |
| **Assignee** | BE (row-level security filter) |
| **Found by** | QA Automation via Claude Code (Opus 4.7) |

### Mô tả
CTDT `CTDT-BTP-TW-2026-0001` thuộc đơn vị "Cục Bổ trợ tư pháp - Bộ Tư pháp" (cấp TW). Theo permission-matrix §9 (Quy tắc scoping `*`):
- BN: chỉ thấy dữ liệu Bộ/Ngành mình (Bộ KH&ĐT cho canbo_bn/lanhdao_bn)
- DP: chỉ thấy dữ liệu Sở/Tỉnh mình (Sở TP Hà Nội cho canbo_tinh/lanhdao_dp)

Actual: cả 4 role (BN+DP × CB_NV+CB_PD) login rồi vào `/dao-tao/chuong-trinh/danh-sach` → đều thấy row CTDT của TW. Cross-unit data leak.

### Steps to reproduce (lặp cho 4 account)
1. Login `canbo_bn / Test@1234` + OTP 666666.
2. Sidebar → Quản lý đào tạo, tập huấn → Chương trình đào tạo.
3. Observe: Row `CTDT-BTP-TW-2026-0001` hiển thị (dù account này thuộc Bộ KH&ĐT).
4. Lặp với `canbo_tinh`, `lanhdao_bn`, `lanhdao_dp` → same result.

### Expected
- canbo_bn/lanhdao_bn: Empty state "Không có chương trình nào phù hợp" (vì Bộ KH&ĐT chưa có CTDT nào).
- canbo_tinh/lanhdao_dp: Empty state (vì Sở TP HN chưa có CTDT nào).

### Actual
Cả 4 role đều thấy 1 row CTDT của Cục BTTP.

### Evidence
- [screenshots/canbo_bn-01-ctdt.png](screenshots/canbo_bn-01-ctdt.png) — account CB_BN thấy CTDT-BTP-TW
- [screenshots/canbo_tinh-01-ctdt.png](screenshots/canbo_tinh-01-ctdt.png) — account CB_TINH thấy CTDT-BTP-TW
- [screenshots/lanhdao_bn-01-ctdt.png](screenshots/lanhdao_bn-01-ctdt.png)
- [screenshots/lanhdao_dp-01-ctdt.png](screenshots/lanhdao_dp-01-ctdt.png)

### Root cause (suggested)
BE endpoint `GET /api/v1/dao-tao/chuong-trinh-dao-tao` **thiếu WHERE clause** filter theo `current_user.don_vi_id`. Hiện tại trả về toàn bộ CTDT bất kể đơn vị của caller. Fix: thêm middleware row-level security trên endpoint này (và tất cả endpoint entity scoped theo `*`).

### Recurring pattern
Đây là lần thứ **5** bug cùng pattern:
- BUG-PERM-M3-002 (Section 3 Chuyên gia/TVV) — data isolation BN/DP fail trên TU_VAN_VIEN
- BUG-PERM-M4-002 (Section 4 Vụ việc) — data isolation BN/DP fail trên VU_VIEC
- BUG-PERM-M5-002 (Section 5 Chi trả) — data isolation BN/DP fail trên HO_SO_CHI_TRA
- BUG-PERM-M6-002 (Section 6 Doanh nghiệp) — data isolation BN/DP fail trên DOANH_NGHIEP

→ **Root cause chung:** BE chưa apply row-level scoping filter cross module. Khuyến nghị BE team audit toàn bộ endpoint `GET /api/v1/{entity}/*` → đảm bảo filter `don_vi_id IN (self_unit, child_units_if_TW)` cho mọi entity có scope `*`.

### Impact nếu deploy
- Toàn bộ CB cấp Bộ/Ngành + Sở/Tỉnh có thể đọc chương trình đào tạo của TW → **vi phạm BR-AUTH scoping** + có thể vi phạm chính sách bảo mật dữ liệu nội bộ (một số CTDT có thể chứa ngân sách dự kiến, danh sách giảng viên, kế hoạch không chia sẻ liên ngành).

---

## BUG-PERM-M8.1-003 — Critical · TVV đọc được CTDT + KH list (spec ❌)

| Trường | Giá trị |
|--------|---------|
| **Bug ID** | BUG-PERM-M8.1-003 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open |
| **Module** | Đào tạo, Tập huấn (FR-03) |
| **Thành phần** | FE `nav-structure.ts` (subitem CTDT/KH không whitelist đúng TVV=❌) + BE endpoint CTDT/KH (thiếu guard role) |
| **URL** | `/dao-tao/chuong-trinh/danh-sach`, `/dao-tao/khoa-hoc/danh-sach` |
| **Trình duyệt** | Chromium 146 (headless, Playwright, 1280×720) |
| **Tài khoản** | `tvv_user / Test@1234` (TVV, Portal) |
| **Role** | TVV |
| **Entity ảnh hưởng** | CHUONG_TRINH_DAO_TAO, KHOA_HOC (2 ô FAIL Critical) |
| **Matrix spec** | ❌ (không có quyền trên toàn bộ 10 entity) |
| **Actual** | Sidebar "Đào tạo" enabled, CTDT + KH submenu enabled, click truy cập được list, đọc được data |
| **TC Reference** | §8.1 §2.10 TVV × CTDT, §3.10 TVV × KH |
| **SRS Reference** | permission-matrix §8.1 row CHUONG_TRINH_DAO_TAO + KHOA_HOC — cột TVV (= ❌) · BR-AUTH "TVV chỉ tương tác với TU_VAN_VIEN registration + phiên tư vấn của riêng mình" |
| **Assignee** | FE (nav-structure + ability rules) + BE (endpoint access check) |
| **Found by** | QA Automation via Claude Code (Opus 4.7) |

### Mô tả
Role TVV (tư vấn viên, `tvv_user`) theo matrix = ❌ trên **toàn bộ 10 entity** module Đào tạo. Sidebar "Quản lý đào tạo, tập huấn" phải disabled (giống CG) hoặc không hiện.

Actual: TVV login → sidebar "Đào tạo" **enabled**, click expand → 4 submenu trong đó:
- Chương trình đào tạo: **enabled** (should be disabled)
- Khóa học: **enabled** (should be disabled)
- Ngân hàng câu hỏi: disabled ✓
- Giảng viên: disabled ✓

Click CTDT → navigate `/dao-tao/chuong-trinh/danh-sach` → **trang CTDT hiển thị** với row `CTDT-BTP-TW-2026-0001`. TVV đọc được dữ liệu chương trình đào tạo nội bộ. Tương tự cho KH (list page loads, empty state).

### Steps to reproduce
1. Login `tvv_user / Test@1234` + OTP 666666.
2. Sidebar → "Quản lý đào tạo, tập huấn" (enabled, click được).
3. Click "Chương trình đào tạo" → URL change `/dao-tao/chuong-trinh/danh-sach`.
4. Observe: Danh sách CTDT hiển thị với row `CTDT-BTP-TW-2026-0001` (sdsadf, 100.000 budget).
5. Click "Khóa học" → URL `/dao-tao/khoa-hoc/danh-sach` → trang KH hiển thị (empty state).

### Expected
Click "Đào tạo" sidebar → không expand hoặc navigate /403. Hoặc sidebar "Đào tạo" phải disabled/ẩn cho TVV.

### Actual
TVV có quyền Read trên CTDT + KH.

### Evidence
- [screenshots/tvv_user-00-landing.png](screenshots/tvv_user-00-landing.png) — sidebar state TVV
- [screenshots/tvv_user-11-ctdt.png](screenshots/tvv_user-11-ctdt.png) — **TVV đọc được CTDT list**
- [screenshots/tvv_user-12-kh.png](screenshots/tvv_user-12-kh.png) — TVV vào được KH list

### Root cause (suggested)
FE `nav-structure.ts` / CASL ability rules không loại TVV khỏi whitelist của `CTDT.read` + `KH.read`. Có thể đang whitelist "tất cả role Portal" nhưng matrix quy định DN+NHT được R, TVV+CG phải ❌.

BE endpoint cũng không block TVV: `GET /api/v1/dao-tao/chuong-trinh-dao-tao` trả data cho TVV token.

Fix:
- FE: chỉnh `nav-structure.ts` → disable CTDT + KH subitem cho TVV (giống cách đã làm cho NHCH + GV).
- BE: middleware check role trên endpoint Đào tạo → deny TVV + CG.

### Impact nếu deploy
TVV (người ngoài organization) đọc được:
- Danh sách CTDT của Cục BTTP, BN, ĐP.
- (Sau khi có data KH) Danh sách khóa học, ngân sách, giảng viên, tài liệu nội bộ.

Vi phạm BR-AUTH "TVV chỉ tương tác với TU_VAN_VIEN registration + phiên tư vấn của riêng mình, không được đọc data module khác".

---

## BUG-PERM-M8.1-004 — Major · Sidebar NHCH disabled cho toàn bộ role nội bộ (dup BUG-DT-03 scope mở rộng)

| Trường | Giá trị |
|--------|---------|
| **Bug ID** | BUG-PERM-M8.1-004 |
| **Severity** | Major |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open — mở rộng scope của BUG-DT-03 (hiện chỉ track CB_NV) |
| **Module** | Đào tạo, Tập huấn (FR-03) |
| **Thành phần** | FE `nav-structure.ts` (subitem NHCH whitelist thiếu 7 role nội bộ) |
| **URL** | Sidebar "Quản lý đào tạo, tập huấn" → "Ngân hàng câu hỏi" subitem (`/dao-tao/ngan-hang-cau-hoi/danh-sach`) |
| **Trình duyệt** | Chromium 146 (headless, Playwright, 1280×720) |
| **Tài khoản** | `qtht_tw`, `canbo_tw`, `canbo_bn`, `canbo_tinh`, `lanhdao_tw`, `lanhdao_bn`, `lanhdao_dp` (7 role) |
| **Role** | QTHT, CB_NV_TW/BN/DP, CB_PD_TW/BN/DP (7 role) |
| **Entity ảnh hưởng** | NGAN_HANG_CAU_HOI, DE_KIEM_TRA (nested) — 7 role × 2 entity = **14 ô BLOCKED** |
| **Matrix spec** | QTHT 👁️ R · CB_NV_* ✅ CRUD* · CB_PD_* 👁️ R* |
| **Actual** | Sidebar "Ngân hàng câu hỏi" disabled (grayed) cho tất cả 7 role |
| **TC Reference** | §8.1 §4 NHCH × QTHT/CB_NV_TW/BN/DP/CB_PD_TW/BN/DP (7 dòng FAIL trong bảng tổng hợp) |
| **SRS Reference** | permission-matrix §8.1 row NGAN_HANG_CAU_HOI + DE_KIEM_TRA · srs-fr-03-dao-tao UC28 (CRUD NHCH) |
| **Assignee** | FE (nav-structure) + BE (CASL rules) |
| **Found by** | QA Automation via Claude Code (Opus 4.7) — scope mở rộng từ BUG-DT-03 round functional |

### Mô tả
BUG-DT-03 hiện tại (từ round functional Đào tạo) chỉ track: sidebar NHCH disabled cho CB_NV → /403 khi goto direct, block 4 TC NHCH.

Round phân quyền này xác nhận bug **mở rộng**: NHCH sidebar **disabled cho cả QTHT, CB_PD_* nữa**. Nghĩa là không role nội bộ nào access được NHCH qua UI → toàn bộ test case NHCH + DE_KIEM_TRA bị chặn.

Theo matrix §8.1:
- QTHT = 👁️ R trên NHCH + DKT → phải xem được
- CB_NV_* = ✅ CRUD* trên NHCH + DKT → phải tạo/sửa/xóa được
- CB_PD_* = 👁️ R* trên NHCH + DKT → phải xem được

Tổng = **7 role × 2 entity = 14 ô BLOCKED bởi 1 UI bug duy nhất.**

### Steps to reproduce (lặp cho 7 account)
1. Login theo account: `qtht_tw`, `canbo_tw/bn/tinh`, `lanhdao_tw/bn/dp`.
2. Click sidebar "Quản lý đào tạo, tập huấn" → expand submenu.
3. Observe: Subitem "Ngân hàng câu hỏi" có class `disabled` (grayed), không click được.

### Expected
Subitem "Ngân hàng câu hỏi" enabled cho tất cả 7 role nội bộ (QTHT + CB_NV_* + CB_PD_*) theo spec matrix §8.1. Chỉ disabled cho 4 role Portal (DN/NHT/TVV/CG).

### Actual
Disabled cho **tất cả 11 role** (kể cả role cần quyền).

### Evidence
- HTML dump trong recon sidebar (canbo_tw): `<button class="nav-subitem disabled" title="Ngân hàng câu hỏi">`
- [screenshots/qtht_tw-00-sidebar.png](screenshots/qtht_tw-00-sidebar.png) — QTHT sidebar có NHCH grayed
- [screenshots/canbo_bn-00-sidebar.png](screenshots/canbo_bn-00-sidebar.png) — CB_NV_BN NHCH grayed
- Observed in lanhdao_tw sidebar test: NHCH grayed giống canbo_tw

### Root cause (suggested)
FE `nav-structure.ts` config item NHCH thiếu whitelist cho `QTHT`, `CB_NV_*`, `CB_PD_*`. Hiện tại rule có thể set thành "disabled for all" (placeholder) hoặc config sai tên role.

Fix: FE whitelist NHCH cho 7 role nội bộ → subitem enabled → click navigate route + BE trả data scoped.

### Recurring pattern
Cùng root cause với bug "sidebar BIEU_MAU disabled" (BUG-PERM-M7-002/003/004/005). Fix 1 FE file unblock nhiều entity. Khuyến nghị FE team audit toàn bộ `nav-structure.ts` để đảm bảo whitelist đủ role theo matrix.

### Impact nếu deploy
- Nghiệp vụ chính của CB_NV module Đào tạo (tạo ngân hàng câu hỏi + đề kiểm tra) **không thực hiện được qua CMS UI**. Toàn bộ workflow KH DA_KET_THUC → CHO_DUYET_KQ (cần nhập đề + KQ) bị stuck.
- CB_PD không review được ngân hàng câu hỏi để approve.

---

## BUG-PERM-M8.1-005 — Minor · Portal sidebar hiển thị full CMS menu grayed

| Trường | Giá trị |
|--------|---------|
| **Bug ID** | BUG-PERM-M8.1-005 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open — duplicate recurring M6-003 / M7-006 |
| **Module** | Đào tạo, Tập huấn (FR-03) — nhưng scope toàn app (không riêng Đào tạo) |
| **Thành phần** | FE Portal layout component (sidebar config cho role Portal) |
| **URL** | Mọi page (sidebar luôn hiện) — quan sát rõ nhất khi landing `/403` |
| **Trình duyệt** | Chromium 146 (headless, Playwright, 1280×720) |
| **Tài khoản** | `dn_user`, `nht_user`, `tvv_user`, `chuyengia_user` (4 role Portal) |
| **Role** | DN, NHT, TVV, CG |
| **Entity ảnh hưởng** | Toàn bộ sidebar nav (không riêng entity) |
| **Matrix spec** | Portal roles chỉ có quyền trên 1 số entity, không nên thấy menu các module không có quyền |
| **Actual** | 4 role Portal đều thấy full CMS menu grayed (Chi trả, Doanh nghiệp, Đánh giá, Báo cáo, Quản trị HT...) |
| **TC Reference** | §8.1 §2.8-2.11 (quan sát sidebar screenshots) |
| **SRS Reference** | permission-matrix §8.1 (tất cả cột role Portal) · UX guideline (không hiển thị menu không có quyền) |
| **Assignee** | FE |
| **Found by** | QA Automation via Claude Code (Opus 4.7) — recurring với M6-003/M7-006 |

### Mô tả
Sidebar portal roles hiển thị toàn bộ CMS nav items (Chi trả, Doanh nghiệp, Đánh giá, Báo cáo, Quản trị HT, v.v.) dưới dạng grayed/disabled. Users không click được nhưng hiển thị label dẫn tới UX kém (nhìn như full CMS app, không phải Portal).

### Expected
Portal roles chỉ hiện sidebar nav items họ có quyền access. Hide hoàn toàn mục disabled thay vì gray.

### Actual
Full CMS menu grayed cho DN/NHT/TVV/CG.

### Evidence
- [screenshots/dn_user-00-landing.png](screenshots/dn_user-00-landing.png)
- [screenshots/nht_user-00-landing.png](screenshots/nht_user-00-landing.png)
- [screenshots/tvv_user-00-landing.png](screenshots/tvv_user-00-landing.png)
- [screenshots/chuyengia_user-10-sidebar.png](screenshots/chuyengia_user-10-sidebar.png)

### Recurring pattern
- BUG-PERM-M6-003 Minor (Doanh nghiệp Section 6)
- BUG-PERM-M7-006 Minor (Báo cáo & Biểu mẫu Section 7)

Fix 1 FE Portal layout component → remove grayed items hoặc hide theo role.

---

## Tổng kết

| # | Bug ID | Severity | Ô ảnh hưởng | Recurring root cause |
|---|--------|----------|-------------|-----------------------|
| 1 | BUG-PERM-M8.1-001 | Major | 3 (QTHT × CTDT/KH/GV) | Dup M5-001/M6-001/M7-001 (QTHT có write UI trên entity nghiệp vụ) |
| 2 | BUG-PERM-M8.1-002 | **Critical** | 4+ (BN/DP × CB_NV+CB_PD × CTDT; nghi ngờ KH/GV) | Dup M3-002/M4-002/M5-002/M6-002 (BE thiếu row-level scoping) |
| 3 | BUG-PERM-M8.1-003 | **Critical** | 2 (TVV × CTDT/KH) | Mới — TVV leak truy cập CMS Đào tạo |
| 4 | BUG-PERM-M8.1-004 | Major | 7+ (7 role × NHCH) | Dup BUG-DT-03 scope mở rộng; cùng pattern M7-002/003/004/005 (sidebar disable wrong role) |
| 5 | BUG-PERM-M8.1-005 | Minor | UX all portal roles | Dup M6-003/M7-006 |

**Fix 2 root cause BE (scoping + ability) + 2 FE file (nav-structure + portal layout) sẽ resolve phần lớn bug phân quyền của module Đào tạo và có tác dụng lan sang các module khác.**

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm cho mọi tài khoản) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 (fallback khi bypass tắt) |
| API base | `/api/v1` (proxy qua FE) |
| Frontend | React + Vite + Ant Design + CASL (inferred) |
| Xác thực | JWT + OTP email (bypass 666666 cho dev) |
| Trình duyệt test | Chromium 146 (headless, Playwright 1280×720) via gstack `/browse` |
| Landing sau login | QTHT → /dashboard · CB_NV/CB_PD/Portal → /403 (known, không phải auth failure) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Đơn vị | Cấp | Dùng cho bug nào |
|---------------|---------|--------|-----|-------------------|
| qtht_tw | QTHT | Cục BTTP | TW | BUG-PERM-M8.1-001, -004 |
| canbo_tw | CB_NV_TW | Cục BTTP | TW | BUG-PERM-M8.1-004 |
| canbo_bn | CB_NV_BN | Bộ KH&ĐT | BN | BUG-PERM-M8.1-002, -004 |
| canbo_tinh | CB_NV_DP | Sở TP HN | DP | BUG-PERM-M8.1-002, -004 |
| lanhdao_tw | CB_PD_TW | Cục BTTP | TW | BUG-PERM-M8.1-004 (evidence PASS cho RU* trên CTDT/KH/GV) |
| lanhdao_bn | CB_PD_BN | Bộ KH&ĐT | BN | BUG-PERM-M8.1-002, -004 |
| lanhdao_dp | CB_PD_DP | Sở TP HN | DP | BUG-PERM-M8.1-002, -004 |
| dn_user | DN | Công ty TNHH Test | Portal | BUG-PERM-M8.1-005 (evidence PASS cho gating submenu) |
| nht_user | NHT | — | Portal | BUG-PERM-M8.1-005 |
| tvv_user | TVV | — | Portal | **BUG-PERM-M8.1-003** (main evidence), -005 |
| chuyengia_user | CG | — | Portal | BUG-PERM-M8.1-005 (evidence PASS cho full deny) |

Tất cả account dùng password `Test@1234` + OTP bypass `666666`.

### C — Danh mục ảnh chụp

Screenshots nằm tại: [screenshots/](screenshots/) (42 ảnh, 1280×720 PNG).

**Liên quan BUG-PERM-M8.1-001 (QTHT có write UI):**
- [qtht_tw-01-ctdt.png](screenshots/qtht_tw-01-ctdt.png) — nút `+ Thêm mới` hiển thị trên CTDT list
- [qtht_tw-02-kh.png](screenshots/qtht_tw-02-kh.png) — nút `+ Thêm mới` hiển thị trên KH list
- [qtht_tw-03-gv.png](screenshots/qtht_tw-03-gv.png) — `+ Thêm mới` + pencil (Sửa) + trash (Xóa) trên GV row

**Liên quan BUG-PERM-M8.1-002 (Data isolation leak):**
- [canbo_bn-01-ctdt.png](screenshots/canbo_bn-01-ctdt.png) — BN thấy `CTDT-BTP-TW-2026-0001`
- [canbo_tinh-01-ctdt.png](screenshots/canbo_tinh-01-ctdt.png) — DP thấy `CTDT-BTP-TW-2026-0001`
- [lanhdao_bn-01-ctdt.png](screenshots/lanhdao_bn-01-ctdt.png) — CB_PD_BN thấy CTDT TW
- [lanhdao_dp-01-ctdt.png](screenshots/lanhdao_dp-01-ctdt.png) — CB_PD_DP thấy CTDT TW

**Liên quan BUG-PERM-M8.1-003 (TVV leak):**
- [tvv_user-00-landing.png](screenshots/tvv_user-00-landing.png) — TVV sidebar "Đào tạo" enabled
- [tvv_user-11-ctdt.png](screenshots/tvv_user-11-ctdt.png) — **TVV đọc được CTDT list với row nội bộ**
- [tvv_user-12-kh.png](screenshots/tvv_user-12-kh.png) — TVV vào được KH list

**Liên quan BUG-PERM-M8.1-004 (NHCH disabled):**
- [qtht_tw-00-sidebar.png](screenshots/qtht_tw-00-sidebar.png) — QTHT sidebar: NHCH grayed
- [canbo_bn-00-sidebar.png](screenshots/canbo_bn-00-sidebar.png) — CB_NV_BN sidebar: NHCH grayed
- [lanhdao_tw-00-sidebar.png](screenshots/lanhdao_tw-00-sidebar.png) — CB_PD_TW sidebar: NHCH grayed
- HTML dump recon canbo_tw: class `nav-subitem disabled` cho NHCH item (xem log chain recon)

**Liên quan BUG-PERM-M8.1-005 (Portal sidebar full menu):**
- [dn_user-00-landing.png](screenshots/dn_user-00-landing.png) — DN sidebar full menu grayed
- [nht_user-00-landing.png](screenshots/nht_user-00-landing.png) — NHT sidebar tương tự
- [tvv_user-00-landing.png](screenshots/tvv_user-00-landing.png) — TVV sidebar tương tự
- [chuyengia_user-10-sidebar.png](screenshots/chuyengia_user-10-sidebar.png) — CG sidebar tương tự

**Evidence PASS (không link bug nhưng giữ làm baseline):**
- [recon-ctdt-list.png](screenshots/recon-ctdt-list.png), [recon-kh-list.png](screenshots/recon-kh-list.png), [recon-gv-list.png](screenshots/recon-gv-list.png) — canbo_tw CRUD* baseline
- [lanhdao_tw-01-ctdt.png](screenshots/lanhdao_tw-01-ctdt.png), [lanhdao_tw-02-kh.png](screenshots/lanhdao_tw-02-kh.png), [lanhdao_tw-03-gv.png](screenshots/lanhdao_tw-03-gv.png) — CB_PD_TW PASS RU* (no Thêm mới)
- [dn_user-10-sidebar-expanded.png](screenshots/dn_user-10-sidebar-expanded.png), [dn_user-11-ctdt.png](screenshots/dn_user-11-ctdt.png), [dn_user-12-kh.png](screenshots/dn_user-12-kh.png) — DN PASS (CTDT/KH enabled, NHCH/GV disabled match ❌)
- [nht_user-10-sidebar.png](screenshots/nht_user-10-sidebar.png), [nht_user-11-ctdt.png](screenshots/nht_user-11-ctdt.png), [nht_user-12-kh.png](screenshots/nht_user-12-kh.png) — NHT PASS tương tự DN
- [chuyengia_user-10-sidebar.png](screenshots/chuyengia_user-10-sidebar.png), [chuyengia_user-11-ctdt.png](screenshots/chuyengia_user-11-ctdt.png) — CG PASS (Đào tạo disabled = match ❌)

**Tổng:** 42 ảnh.

---

*Bug report generated: 2026-04-19 | QA Automation via Claude Code (Opus 4.7)*
