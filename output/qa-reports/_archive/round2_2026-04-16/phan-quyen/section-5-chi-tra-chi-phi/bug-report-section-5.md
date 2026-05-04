# Bug Report — Phân quyền Mục 5 (Nhóm Chi trả Chi phí)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 14:30 — 2026-04-19 |
| **Loại test** | Permission / Authorization (Browse UI only — KHÔNG test API theo yêu cầu user) |
| **Round** | round2_2026-04-16 |
| **Tham chiếu** | [permission-matrix.md §5](../../../permission-matrix.md) · [test-strategy.md §5, §9](../../../test-strategy.md) · [functional-test-report-section-5.md](functional-test-report-section-5.md) · [round2 chi-tra](../../chi-tra/) |

---

## Tổng hợp

Phát hiện **7** bug phân quyền + UI trong phạm vi Module 5 (Chi trả Chi phí). Trong đó **2 Blocker** (DN cross-tenant data leak + detail route 404 khoá DANH_GIA testing), **3 Critical** (data isolation BN/DP, NHT bypass, QTHT escalation), **2 Major** (TVV under-permission, sidebar visibility).

| Tổng | Blocker | Critical | Major | Medium | Minor | Trivial |
|------|---------|----------|-------|--------|-------|---------|
| 7    | 2       | 3        | 2     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Role × Entity | TC Ref | Title | Status |
|--------|----------|----------|------|---------------|--------|-------|--------|
| BUG-PERM-M5-001 | Critical | P0 | Permission | QTHT × HO_SO_CHI_TRA | CT-023, §5 matrix | QTHT có nút "Cập nhật TT" + "Kiểm tra" trên list HS chi trả — vi phạm 👁️ R | Open (mới phát hiện 2026-04-19) |
| BUG-PERM-M5-002 | Critical | P0 | Permission | CB_NV/CB_PD BN+DP × HO_SO_CHI_TRA | DI-02→05 | Data scope BN/ĐP không enforce — 4 role thấy 100 records TW | Open (recurring pattern: BUG-PERM-M4-002 / BUG-PM3-R2-002) |
| BUG-PERM-M5-003 | **Blocker** | P0 | Permission / Data Leak | DN × HO_SO_CHI_TRA | DI-09, CT-027 | DN truy cập `/chi-tra/danh-sach` + xem 100 hồ sơ chi trả tài chính của TẤT CẢ DN khác | Open (mới phát hiện) |
| BUG-PERM-M5-004 | Critical | P0 | Permission | NHT × HO_SO_CHI_TRA | CT-028, §5 matrix | NHT click menu Chi trả → vào `/chi-tra/danh-sach` thấy 100 records (spec ❌) | Open (mới phát hiện) |
| BUG-PERM-M5-005 | Major | P1 | Permission / Spec | TVV × HO_SO_CHI_TRA | §5 matrix | TVV click menu Chi trả → /403 mặc dù spec cho phép 👁️ R* | Open (under-permission, cần check FE allowlist) |
| BUG-PERM-M5-006 | Minor | P2 | UI / Permission | NHT/CG × Sidebar | DI-09 ext | Sidebar hiển thị "Quản lý chi trả chi phí" cho NHT/CG/DN khi spec ❌ | Open (recurring — cùng pattern Section 4) |
| BUG-PERM-M5-007 | **Blocker** | P0 | Routing | All roles × Detail page | — | Route `/chi-tra/{uuid}` trả 404 cho mọi role — chặn việc test 11 ô DANH_GIA_HO_SO_CHI_TRA | Open (mới phát hiện) |

> **Chú thích Severity:** xem [bug-report-template.md](../../../template/bug-report-template.md). Blocker = chặn cả module (cross-tenant data leak hoặc route hoàn toàn không hoạt động).

---

## BUG-PERM-M5-001 — QTHT có nút UPDATE workflow trên list HS chi trả (permission escalation)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission / Authorization |
| **Status** | Open (mới phát hiện 2026-04-19) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | FE: cột `Hành động` của bảng `/chi-tra/danh-sach` không gating theo role; BE: authorization middleware cho PATCH/PUT `/api/v1/ho-so-chi-tras/{id}` (workflow update) |
| **URL** | http://103.172.236.130:3000/chi-tra/danh-sach |
| **Trình duyệt** | Chromium (Playwright headless 1280×720) |
| **Tài khoản** | qtht_tw / Test@1234 (vai trò: Quản trị hệ thống TW — Cục BTTP) |

**Mô tả:**
Theo [permission-matrix.md §5](../../../permission-matrix.md), `QTHT × HO_SO_CHI_TRA = 👁️ R` (chỉ xem). Test thực tế thấy QTHT có nút **"Cập nhật TT"** (Update Status — chuyển trạng thái thanh toán) và nút **"Kiểm tra"** (Workflow approve/check) ở cột "Hành động" của list. Cả 2 đều là UPDATE action vi phạm Read-only.

Pattern khớp với BUG-PERM-M4-001 (QTHT có Create/Delete trên VV) — đề xuất unified fix theo role gating component.

**Bước thực hiện:**
1. Đăng nhập `qtht_tw / Test@1234` + OTP `666666`
2. Sidebar → "Quản lý chi trả chi phí" → URL `/chi-tra/danh-sach`
3. Quan sát cột "Hành động" trên các row

**Hành vi mong đợi:**
- QTHT chỉ thấy icon "Xem" (eye), KHÔNG có button workflow.

**Hành vi thực tế:**
- Row state `Đã duyệt` / `Đã thanh toán` → có button **"Cập nhật TT"**
- Row state `Chờ tiếp nhận` / `Yêu cầu bổ sung` → có button **"Kiểm tra"**

**Bằng chứng:**
- [01-qtht_tw-ct-list.png](screenshots/01-qtht_tw-ct-list.png)
- JS dump: `buttons: ["Tìm kiếm","Xóa bộ lọc","Xuất Excel","Làm mới","Cập nhật TT","Kiểm tra"]`

**Đánh giá tác động:**
- QTHT có thể vô tình duyệt / thay đổi trạng thái thanh toán mặc dù không có thẩm quyền nghiệp vụ.
- Vi phạm nguyên tắc separation of duties (admin ≠ approver).

---

## BUG-PERM-M5-002 — Data isolation BN/DP không enforce trên HO_SO_CHI_TRA

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-002 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission / Data Isolation |
| **Status** | Open (recurring pattern — same root cause như BUG-PERM-M4-002 / BUG-PM3-R2-002) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | BE: query layer `HoSoChiTra.findAll()` không apply `WHERE don_vi_id = current_user.don_vi_id` cho role BN/DP |
| **URL** | http://103.172.236.130:3000/chi-tra/danh-sach |
| **Tài khoản affected** | canbo_bn, canbo_tinh, lanhdao_bn, lanhdao_dp |

**Mô tả:**
Theo [permission-matrix.md §9 Quy tắc scoping](../../../permission-matrix.md): BN/DP chỉ được thấy data đơn vị mình. Test 4 account BN/DP đều thấy đúng **100 records** giống canbo_tw (TW scope).

**Bước thực hiện (lặp cho mỗi account):**
1. Đăng nhập role tương ứng + OTP `666666`
2. Sidebar → "Quản lý chi trả chi phí"
3. Quan sát số records cuối table (`1-20 / 100 mục`)

**Hành vi mong đợi:**
- canbo_bn/lanhdao_bn (Bộ KH&ĐT) → chỉ thấy HS có `don_vi_id = Bộ KH&ĐT`
- canbo_tinh/lanhdao_dp (Sở TP HN) → chỉ thấy HS có `don_vi_id = Sở TP HN`

**Hành vi thực tế:**
| Account | Total Records | Match Spec? |
|---------|---------------|-------------|
| canbo_tw | 100 | ✅ (TW = all) |
| canbo_bn | 100 | ❌ (should be subset) |
| canbo_tinh | 100 | ❌ |
| lanhdao_tw | 100 | ✅ (TW = all) |
| lanhdao_bn | 100 | ❌ |
| lanhdao_dp | 100 | ❌ |

**Bằng chứng:**
- [04-canbo_tw-ct-list.png](screenshots/04-canbo_tw-ct-list.png)
- [05-canbo_bn-ct-list.png](screenshots/05-canbo_bn-ct-list.png)
- [06-canbo_tinh-ct-list.png](screenshots/06-canbo_tinh-ct-list.png)
- [07-lanhdao_tw-ct-list.png](screenshots/07-lanhdao_tw-ct-list.png)
- [08-lanhdao_bn-ct-list.png](screenshots/08-lanhdao_bn-ct-list.png)
- [09-lanhdao_dp-ct-list.png](screenshots/09-lanhdao_dp-ct-list.png)

**Đánh giá tác động:**
- BN/DP thấy data tài chính của các đơn vị khác → vi phạm BR-AUTH-08 (phân quyền dữ liệu 3 cấp).
- Nguy cơ bộ ngành can thiệp HS chi trả của bộ ngành khác (vì có cả nút Update workflow).

**Ghi chú:** Pattern lặp lại 3 module liên tiếp (CG/TVV, Vụ việc, Chi trả). Đề xuất root-cause fix tại tầng query base / middleware row-level security thay vì fix riêng từng module.

---

## BUG-PERM-M5-003 — DN truy cập CMS Chi trả + xem hồ sơ tài chính của TẤT CẢ doanh nghiệp khác (Cross-tenant Data Leak)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-003 |
| **Severity** | **Blocker** |
| **Priority** | P0 |
| **Type** | Permission / Cross-tenant Data Leak / Privacy |
| **Status** | Open (mới phát hiện 2026-04-19) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | FE: AuthGuard cho route `/chi-tra/*` không deny role DN; FE: Sidebar component không hide menu Chi trả cho DN; BE: API `GET /api/v1/ho-so-chi-tras` không filter `WHERE dn_id = current_user.dn_id` cho role DN |
| **URL** | http://103.172.236.130:3000/chi-tra/danh-sach |
| **Tài khoản** | dn_user / Test@1234 (vai trò: Doanh nghiệp — Portal user) |

**Mô tả:**
Theo [permission-matrix.md §5](../../../permission-matrix.md): `DN × HO_SO_CHI_TRA = 🔌 C†R*` (Create qua API, Read SCOPED CHỈ HS của DN mình). Theo [test-strategy.md §5.2 DI-09](../../../test-strategy.md): "DN không truy cập CMS UI — bị chặn".

Test thực tế: dn_user truy cập được URL CMS `/chi-tra/danh-sach` và thấy **100 hồ sơ chi trả tài chính của TẤT CẢ doanh nghiệp khác** bao gồm:
- Mã hồ sơ (HSCT000001-100)
- Tên doanh nghiệp
- Quy mô doanh nghiệp
- **Số tiền đề nghị (financial PII)**
- **Số tiền được duyệt (financial PII)**
- Trạng thái chi trả
- SLA + ngày cập nhật

Đây là **cross-tenant financial data leak nghiêm trọng** — vi phạm cả phân quyền matrix lẫn nguyên tắc isolation theo DN.

**Bước thực hiện:**
1. Đăng nhập `dn_user / Test@1234` + OTP `666666`
2. Landing → /403 (kỳ vọng: bị chặn hẳn) — landing OK ✅
3. Sidebar hiển thị "Quản lý chi trả chi phí" (kỳ vọng: ẩn) ❌
4. Click menu → URL navigate `/chi-tra/danh-sach` (kỳ vọng: /403 hoặc redirect Portal) ❌
5. Quan sát table: 100 records hiển thị đầy đủ ❌

**Hành vi mong đợi:**
- Sidebar KHÔNG hiển thị menu Chi trả cho DN.
- Truy cập route `/chi-tra/*` → /403 hoặc redirect về Portal page (DN sử dụng Cổng PLQG, không phải CMS).
- Trong trường hợp xấu nhất nếu vào được, BE phải filter `WHERE dn_id = current_user.dn_id` để DN chỉ thấy HS của mình.

**Hành vi thực tế:**
- URL: `http://103.172.236.130:3000/chi-tra/danh-sach`
- Pagination: `1-20 / 100 mục` (toàn bộ data của các DN khác)
- Buttons available cho DN: `["Tìm kiếm","Xóa bộ lọc","Làm mới"]` — không có write action (đúng), nhưng đã thấy data là vi phạm.

**Bằng chứng:**
- [10-dn_user-landing.png](screenshots/10-dn_user-landing.png) — Landing /403 nhưng full sidebar
- [11-dn_user-ct-click.png](screenshots/11-dn_user-ct-click.png) — Click → vào /chi-tra
- [12-dn_user-ct-data.png](screenshots/12-dn_user-ct-data.png) — **100 records của các DN khác hiển thị toàn bộ thông tin tài chính**

**Đánh giá tác động:**
- **Privacy/GDPR-class violation** — DN A có thể xem chi tiết tài chính của DN B (đối thủ cạnh tranh). 
- Vi phạm DI-09 + BR-AUTH-08 + Luật bảo vệ dữ liệu cá nhân.
- Khả năng leak qua API `GET /api/v1/ho-so-chi-tras` cũng cần verify (out-of-scope test này theo yêu cầu user).

**Khuyến nghị fix urgent:**
1. **FE**: AuthGuard `/chi-tra/*` deny role `DN`/`NHT`/`TVV`/`CG` → redirect /403.
2. **FE**: Sidebar component filter menu items theo role allowlist (xem chung BUG-PERM-M5-006).
3. **BE**: API endpoint `GET /api/v1/ho-so-chi-tras` apply `WHERE dn_id = current_user.dn_id` cho role DN.

---

## BUG-PERM-M5-004 — NHT click menu Chi trả vào được list 100 records (spec ❌)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-004 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Permission |
| **Status** | Open (mới phát hiện) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | FE: AuthGuard `/chi-tra/*` cho role NHT; FE: Sidebar gating |
| **URL** | http://103.172.236.130:3000/chi-tra/danh-sach |
| **Tài khoản** | nht_user / Test@1234 |

**Mô tả:**
Spec `NHT × HO_SO_CHI_TRA = ❌` (không quyền). Test: nht_user click menu sidebar "Quản lý chi trả chi phí" → URL `/chi-tra/danh-sach` mở thành công + thấy 100 records.

**Bước thực hiện:**
1. Login `nht_user / Test@1234` + OTP `666666`
2. Landing /403 ✅ (đúng — NHT không có dashboard default)
3. Sidebar có "Quản lý chi trả chi phí" ❌ (spec ẩn)
4. Click → `/chi-tra/danh-sach` mở + 100 records ❌

**Bằng chứng:**
- [13-nht_user-landing.png](screenshots/13-nht_user-landing.png)
- [14-nht_user-ct-click.png](screenshots/14-nht_user-ct-click.png)

**Đánh giá tác động:**
- NHT thấy data tài chính của tất cả DN — không phù hợp vai trò "người hỗ trợ" (NHT chỉ liên quan VU_VIEC).
- Khả năng cross-link với BUG-PERM-M5-003 (cùng tầng FE allowlist thiếu role).

---

## BUG-PERM-M5-005 — TVV bị chặn /403 mặc dù spec cho phép Read scoped (👁️ R*)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-005 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission (under-permission) |
| **Status** | Open (mới phát hiện) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | FE: route guard `/chi-tra/*` có thể blacklist TVV nhầm; HOẶC SRS spec cần clarify |
| **URL** | http://103.172.236.130:3000/chi-tra/danh-sach (block /403) |
| **Tài khoản** | tvv_user / Test@1234 |

**Mô tả:**
Spec `TVV × HO_SO_CHI_TRA = 👁️ R*` (xem scoped — TVV thấy HS chi trả mà mình là người tư vấn). Test: TVV click menu → /403.

Đây là under-permission — phần mềm chặn quyền đáng có.

**Bước thực hiện:**
1. Login `tvv_user / Test@1234` + OTP `666666`
2. Sidebar → "Quản lý chi trả chi phí" → /403

**Bằng chứng:**
- [15-tvv_user-ct-click.png](screenshots/15-tvv_user-ct-click.png) — page /403

**Cần clarify:**
- Spec matrix nói TVV được xem (R*) HS chi trả. Nếu UI chặn là sai → fix FE allowlist.
- Nếu thực tế nghiệp vụ TVV không cần xem HS chi trả → cập nhật matrix.

---

## BUG-PERM-M5-006 — Sidebar hiển thị menu "Quản lý chi trả chi phí" cho NHT/CG/DN không có quyền

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-006 |
| **Severity** | Minor |
| **Priority** | P2 |
| **Type** | UI / Permission |
| **Status** | Open (recurring — cùng pattern Section 4) |
| **Module** | Layout / Sidebar component |
| **Thành phần** | FE: `Sidebar.tsx` không filter menu items theo role allowlist |
| **URL** | toàn bộ trang sau login (sidebar global) |
| **Tài khoản affected** | dn_user, nht_user, chuyengia_user (CG) — và có thể nhiều role khác |

**Mô tả:**
Sidebar hiển thị **toàn bộ menu CMS** (15+ items) cho tất cả role kể cả Portal user. Một số role click vào sẽ vào được (BUG-PERM-M5-003, M5-004), một số bị chặn /403 nhưng vẫn thấy menu (CG).

**Pattern recurring:** Cùng vấn đề từ section 4 (sidebar không gating). Fix toàn cục thay vì fix riêng menu chi trả.

**Bước thực hiện:**
1. Login bất kỳ role Portal (dn_user / nht_user / chuyengia_user / tvv_user)
2. Quan sát sidebar trái

**Bằng chứng:**
- [10-dn_user-landing.png](screenshots/10-dn_user-landing.png) — DN sidebar full menu
- [13-nht_user-landing.png](screenshots/13-nht_user-landing.png) — NHT sidebar full menu
- [16-chuyengia-ct-click.png](screenshots/16-chuyengia-ct-click.png) — CG sidebar full menu

**Khuyến nghị fix:**
- Component `<Sidebar>` đọc `currentUser.permissions` → filter menu items theo `allowedRoles`.
- Apply cho mọi module một lần (chung pattern fix với section 4).

---

## BUG-PERM-M5-007 — Detail route `/chi-tra/{uuid}` trả 404 cho mọi role (chặn test entity DANH_GIA_HO_SO_CHI_TRA)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-PERM-M5-007 |
| **Severity** | **Blocker** (cho test) |
| **Priority** | P0 |
| **Type** | Routing / Missing Page |
| **Status** | Open (mới phát hiện) |
| **Module** | Quản lý Chi trả Chi phí |
| **Thành phần** | FE: chưa có route handler cho `/chi-tra/[id]/page.tsx`; OR route file thiếu |
| **URL ví dụ** | http://103.172.236.130:3000/chi-tra/f0000000-0000-4000-8000-000000000100 |
| **Tài khoản** | qtht_tw (verified), kỳ vọng giống cho mọi role có quyền vào list |

**Mô tả:**
Click link "HSCT000XXX" hoặc click "Kiểm tra" button trên list → URL navigate `/chi-tra/{uuid}` hoặc `/chi-tra/{uuid}?action=kiem-tra` → trả về **trang 404 "Trang bạn tìm kiếm không tồn tại"**.

→ Không truy cập được detail page → **không thể test entity `DANH_GIA_HO_SO_CHI_TRA`** (entity #2 trong matrix §5) cho **bất kỳ role nào**. **11 ô quyền của DANH_GIA_HO_SO_CHI_TRA bị BLOCKED** trong test này.

**Bước thực hiện:**
1. Login bất kỳ role có quyền (qtht_tw verified)
2. Vào `/chi-tra/danh-sach`
3. Click link "HSCT000100" hoặc click button "Kiểm tra" trên row state `Chờ tiếp nhận`

**Hành vi mong đợi:**
- Detail page hiển thị đầy đủ thông tin HS + tabs ("Thông tin", "Đánh giá mức hỗ trợ", "Lịch sử", ...).

**Hành vi thực tế:**
- 404 page với illustration + text "Trang bạn tìm kiếm không tồn tại" + button "Về trang chủ".

**Bằng chứng:**
- [02-qtht_tw-ct-detail.png](screenshots/02-qtht_tw-ct-detail.png) — 404 từ click HSCT000100
- [03-qtht_tw-kiem-tra.png](screenshots/03-qtht_tw-kiem-tra.png) — 404 từ click "Kiểm tra"

**Đánh giá tác động:**
- Toàn bộ workflow Chi trả chi phí (kiểm tra → đánh giá mức hỗ trợ → trình PD → phê duyệt → thanh toán) không truy cập được qua UI → blocker cho cả Functional test (round 2 đã ghi nhận?) lẫn Permission test.
- Sau khi fix, cần retest 11 ô DANH_GIA_HO_SO_CHI_TRA.

---

## Tổng hợp đề xuất fix theo nhóm root cause

| Nhóm fix | Bugs | Đề xuất |
|----------|------|---------|
| **A. FE Sidebar role gating** (chung mọi module) | M5-006, partial M5-003, M5-004 | Component `Sidebar` đọc `currentUser.permissions.allowedMenus` để filter visible items |
| **B. FE Route AuthGuard** (chung mọi route) | M5-003, M5-004, M5-005 | HOC `withAuthGuard(allowedRoles)` apply trên page-level. Define matrix gating từ permission-matrix.md |
| **C. BE Row-level Security** | M5-002, M5-003 (data scope) | Middleware Sequelize/TypeORM thêm `WHERE don_vi_id = X` (cho BN/DP) hoặc `WHERE dn_id = Y` (cho DN) tự động theo role current_user. Apply chung mọi entity scoped |
| **D. FE Per-row action gating** | M5-001 | Cột "Hành động" của list table render conditionally theo role: ẩn workflow buttons cho QTHT/Read role |
| **E. FE Detail page implementation** | M5-007 | Implement `/chi-tra/[id]/page.tsx` (Next.js dynamic route) với tabs đầy đủ. Đây là blocker cho cả module nghiệp vụ + permission test |

Sau khi fix nhóm A+B+C → ~5/7 bugs đóng. Sau D → 6/7. Sau E → unblock 11 ô BLOCKED → có thể test full Section 5.
