# Functional Test Report — Ma trận phân quyền Mục 5 (Nhóm Chi trả Chi phí)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025; OTP bypass `666666`) |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 14:30 — 2026-04-19 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | round2_2026-04-16 |
| **Tham chiếu** | [permission-matrix.md §5](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.6-chi-tra-chi-phi.md](../../../funtion/7.6-chi-tra-chi-phi.md) · [round2 chi-tra](../../chi-tra/) |
| **Phương pháp** | Browse UI (gstack `/browse` Playwright headless 1280×720) — **KHÔNG test API** (theo yêu cầu user) |

---

## 1. Phạm vi test

**Module 5 — Nhóm Chi trả Chi phí** (2 entity × 11 role = **22 ô quyền**):

| # | Entity | Route CMS đã phát hiện | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|---|--------|------------------------|------|-------|-------|----|----|-----|-----|
| 1 | HO_SO_CHI_TRA | `/chi-tra/danh-sach` | 👁️ R | ✅ CRUD* | 📝 RU* | 🔌 C†R* | ❌ | 👁️ R* | ❌ |
| 2 | DANH_GIA_HO_SO_CHI_TRA | (kỳ vọng tab `Đánh giá` trong detail `/chi-tra/{id}`) | 👁️ R | ✅ CRU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

> **⚠️ Limitation:** Detail route `/chi-tra/{uuid}` trả về **404 cho mọi role** → không thể test entity `DANH_GIA_HO_SO_CHI_TRA` qua UI. Xem [BUG-PERM-M5-007](bug-report-section-5.md#bug-perm-m5-007). 11 ô quyền của entity #2 đều **BLOCKED**.

### Roles đã test

| # | Account | Role SRS | Đơn vị | Cấp | Expected landing | Actual landing | Đăng nhập thành công? |
|---|---------|----------|--------|-----|------------------|----------------|------------------------|
| 1 | qtht_tw | QTHT | Cục BTTP | TW | /dashboard | /dashboard | ✅ |
| 2 | canbo_tw | CB_NV | Cục BTTP | TW | /dashboard | /403 (per round-2 known) | ⚠️ logged in, dashboard blocked |
| 3 | canbo_bn | CB_NV | Bộ KH&ĐT | BN | /dashboard | /403 | ⚠️ |
| 4 | canbo_tinh | CB_NV | Sở TP HN | DP | /dashboard | /403 | ⚠️ |
| 5 | lanhdao_tw | CB_PD | Cục BTTP | TW | /dashboard | /403 | ⚠️ |
| 6 | lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | /dashboard | /403 | ⚠️ |
| 7 | lanhdao_dp | CB_PD | Sở TP HN | DP | /dashboard | /403 | ⚠️ |
| 8 | dn_user | DN | — | Portal | Chặn khỏi CMS (DI-09) | /403 (landing) → vẫn vào được /chi-tra/danh-sach khi click menu | ❌ **BLOCKER — xem BUG-PERM-M5-003** |
| 9 | nht_user | NHT | — | Portal | Menu Chi trả ẩn / /403 | /403 (landing) → vẫn vào được /chi-tra/danh-sach khi click menu | ❌ **CRITICAL — xem BUG-PERM-M5-004** |
| 10 | tvv_user | TVV | — | Portal | Read-only list HS được phân công | /403 khi click menu | ❌ **MAJOR — under-permission, xem BUG-PERM-M5-005** |
| 11 | chuyengia_user | CG | — | Portal | Menu ẩn / /403 | /403 ✅ (sidebar vẫn hiển thị menu — minor leak) | ✅ (route blocked) |

---

## 2. Kết quả đo được

### 2.1 QTHT (qtht_tw) — Negative Read-only verification

**Spec matrix §5:** QTHT × HO_SO_CHI_TRA = **👁️ R** (chỉ xem, không sửa/xóa, không workflow action — theo §9.2 ghi chú QTHT Read trên hầu hết entity nghiệp vụ).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Click menu "Quản lý chi trả chi phí" | Navigate `/chi-tra/danh-sach`, list read-only | URL `/chi-tra/danh-sach`, 100 records (`HSCT000001..100`) | ✅ menu + list |
| Button "Tìm kiếm" / "Xóa bộ lọc" | OK (filter) | Có | ✅ |
| Button "Xuất Excel" | (debatable — có thể chấp nhận cho R role) | Có | ✅ chấp nhận |
| Button "Làm mới" | OK | Có | ✅ |
| Button "Cập nhật TT" (Update Status) trên row | KHÔNG | **CÓ** trên các row state `Đã duyệt` | ❌ **FAIL → BUG-PERM-M5-001** |
| Button "Kiểm tra" (Workflow approve/process) trên row | KHÔNG | **CÓ** trên các row state `Chờ tiếp nhận` / `Yêu cầu bổ sung` | ❌ **FAIL → BUG-PERM-M5-001** |
| Button "Tiếp nhận" / "Tạo mới" header | KHÔNG | KHÔNG | ✅ (không có manual create — đúng SRS, HS đến từ DVC qua API) |
| Icon Xóa (trash) | KHÔNG | KHÔNG | ✅ |

**Evidence:**
- [01-qtht_tw-ct-list.png](screenshots/01-qtht_tw-ct-list.png) — list view với "Cập nhật TT" + "Kiểm tra" buttons
- [02-qtht_tw-ct-detail.png](screenshots/02-qtht_tw-ct-detail.png) — detail page = **404 Page Not Found**
- [03-qtht_tw-kiem-tra.png](screenshots/03-qtht_tw-kiem-tra.png) — click "Kiểm tra" → URL `/chi-tra/{uuid}?action=kiem-tra` cũng 404

### 2.2 CB_NV TW (canbo_tw) — Positive CRUD* scope toàn quốc

**Spec matrix §5:** CB_NV_TW × HO_SO_CHI_TRA = ✅ **CRUD\*** (toàn quốc, cấp TW thấy cả TW+BN+ĐP).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/chi-tra/danh-sach` | OK | OK, 100 records | ✅ |
| Buttons header | Tìm kiếm / Xóa lọc / Xuất Excel / Làm mới | Đầy đủ | ✅ |
| Per-row workflow | "Cập nhật TT" + "Kiểm tra" | Đầy đủ | ✅ |
| Scope data | Thấy tất cả TW+BN+ĐP | 100/100 records (tất cả `HSCT0000XX`, DN `zxczc`) | ⚠️ PASS (nhưng không phân biệt được TW/BN/DP do test data đồng nhất — không có data cách BN/DP riêng) |
| Drill detail row | Hiển thị form chi tiết | **404 Page Not Found** | ❌ **BUG-PERM-M5-007** (blocker test downstream) |

**Evidence:** [04-canbo_tw-ct-list.png](screenshots/04-canbo_tw-ct-list.png)

### 2.3 CB_NV BN / DP (canbo_bn, canbo_tinh) — Data isolation FAIL

**Spec matrix §5:** CB_NV_BN/DP × HO_SO_CHI_TRA = ✅ **CRUD\*** scoped đơn vị (BN chỉ thấy data Bộ KH&ĐT; DP chỉ thấy data Sở TP HN).

| Account | Đơn vị SRS | Expected scope | Actual scope | Kết luận |
|---------|------------|----------------|--------------|----------|
| canbo_bn | Bộ KH&ĐT (BN) | Chỉ HS chi trả của Bộ KH&ĐT | **100 records giống canbo_tw (toàn TW)** ❌ | ❌ **FAIL → BUG-PERM-M5-002** |
| canbo_tinh | Sở TP HN (DP) | Chỉ HS chi trả của Sở TP HN | **100 records giống canbo_tw** ❌ | ❌ **FAIL → BUG-PERM-M5-002** |

UI buttons (CRUD action) đều có đúng — chỉ data filter BE bị leak. Pattern giống hệt **BUG-PERM-M4-002** (Vụ việc) và **BUG-PM3-R2-002** (CG/TVV) — root cause chung là BE không enforce `WHERE don_vi_id = current_user.don_vi_id`.

**Evidence:** [05-canbo_bn-ct-list.png](screenshots/05-canbo_bn-ct-list.png) · [06-canbo_tinh-ct-list.png](screenshots/06-canbo_tinh-ct-list.png)

### 2.4 CB_PD TW (lanhdao_tw) — Positive RU* approve view-only

**Spec matrix §5:** CB_PD × HO_SO_CHI_TRA = **📝 RU\*** (read + update/phê duyệt, không create/delete, scoped).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/chi-tra/danh-sach` | OK | OK, 100 records | ✅ |
| Button "Xuất Excel" | (không bắt buộc cho R role) | **KHÔNG** (khác CB_NV) | ✅ — đúng pattern R role không export |
| Button "Tiếp nhận" / Create | KHÔNG | KHÔNG | ✅ |
| Button "Cập nhật TT" + "Kiểm tra" (Update workflow) | CÓ (RU phép update) | CÓ | ✅ |
| Icon Xóa | KHÔNG | KHÔNG | ✅ |
| Scope TW | Thấy tất cả | 100 records — consistent với CB_NV_TW | ✅ |

**Evidence:** [07-lanhdao_tw-ct-list.png](screenshots/07-lanhdao_tw-ct-list.png)

### 2.5 CB_PD BN / DP (lanhdao_bn, lanhdao_dp) — Data isolation FAIL (cùng pattern §2.3)

| Account | Đơn vị SRS | UI buttons | Scope data | Kết luận |
|---------|------------|------------|------------|----------|
| lanhdao_bn | Bộ KH&ĐT (BN) | RU only ✅ | **100 records TW thay vì BN** | ❌ **FAIL → BUG-PERM-M5-002** |
| lanhdao_dp | Sở TP HN (DP) | RU only ✅ | **100 records TW thay vì DP** | ❌ **FAIL → BUG-PERM-M5-002** |

**Evidence:** [08-lanhdao_bn-ct-list.png](screenshots/08-lanhdao_bn-ct-list.png) · [09-lanhdao_dp-ct-list.png](screenshots/09-lanhdao_dp-ct-list.png)

### 2.6 DN (dn_user) — **CRITICAL DATA LEAK + DI-09 violation**

**Spec matrix §5:** DN × HO_SO_CHI_TRA = **🔌 C†R\*** (Create qua API + Read scoped chỉ HS của DN mình).
**Spec §9.1 ghi chú #1 + DI-09:** DN KHÔNG truy cập CMS UI — chỉ qua API inbound từ Cổng PLQG.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Login dn_user → landing | Portal view (không CMS) hoặc /403 | /403 (landing dashboard) | ✅ landing block đúng |
| Sidebar visibility | Menu CMS ẩn hoàn toàn | **Sidebar hiển thị toàn bộ menu CMS** (Hỏi đáp, VV, Chi trả, DN, Đánh giá, Biểu mẫu...) | ❌ **BUG-PERM-M5-006** (UI leak) |
| Click "Quản lý chi trả chi phí" → navigate | Bị chặn ở /403 hoặc redirect Portal | **URL `/chi-tra/danh-sach` mở thành công** ❌ | ❌ **BUG-PERM-M5-003** |
| Data scope sau navigate | (nếu vào được) chỉ thấy HS của DN mình | **100 hồ sơ chi trả của TẤT CẢ DN khác hiển thị đầy đủ** (mã HSCT, tên DN, quy mô, số tiền đề nghị, số tiền duyệt, trạng thái, SLA, ngày cập nhật) | ❌ **BLOCKER — Cross-tenant financial data leak** |
| Buttons exposure | (nếu vào được) read-only | "Tìm kiếm", "Xóa bộ lọc", "Làm mới" — KHÔNG có "Cập nhật TT"/"Kiểm tra"/"Xuất Excel" | ⚠️ partial — read-only chính xác nhưng không nên thấy data này |

**Evidence:**
- [10-dn_user-landing.png](screenshots/10-dn_user-landing.png) — /403 landing nhưng full sidebar
- [11-dn_user-ct-click.png](screenshots/11-dn_user-ct-click.png) — click menu vào /chi-tra
- [12-dn_user-ct-data.png](screenshots/12-dn_user-ct-data.png) — **100 records of other companies financial data exposed**

### 2.7 NHT (nht_user) — Permission denied bypassed

**Spec matrix §5:** NHT × HO_SO_CHI_TRA = **❌** (không có quyền). NHT × DANH_GIA_HO_SO_CHI_TRA = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Login → landing | Portal view | /403 landing | ✅ |
| Sidebar visibility | Menu Chi trả ẩn | **Sidebar hiển thị "Quản lý chi trả chi phí"** | ❌ **BUG-PERM-M5-006** |
| Click menu | Block (/403, no nav) | **URL navigate `/chi-tra/danh-sach` thành công** | ❌ **BUG-PERM-M5-004** |
| Data scope | (vì ❌) không thấy gì | **100 records hiển thị đầy đủ** | ❌ **CRITICAL** |

**Evidence:** [13-nht_user-landing.png](screenshots/13-nht_user-landing.png) · [14-nht_user-ct-click.png](screenshots/14-nht_user-ct-click.png)

### 2.8 TVV (tvv_user) — Under-permission (spec R* but UI blocks)

**Spec matrix §5:** TVV × HO_SO_CHI_TRA = **👁️ R\*** (xem, scoped chỉ HS có TVV liên quan). TVV × DANH_GIA = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Click menu "Quản lý chi trả chi phí" | Vào list scoped (chỉ HS của TVV) | **/403** | ❌ **BUG-PERM-M5-005 (under-permission)** |

> Spec hiển nhiên cho TVV xem được (R*) nhưng UI hard-block toàn module → cần check FE allowlist role hoặc clarify spec.

**Evidence:** [15-tvv_user-ct-click.png](screenshots/15-tvv_user-ct-click.png)

### 2.9 CG (chuyengia_user) — ❌ enforced ✅, sidebar leak

**Spec matrix §5:** CG × cả 2 entity = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Click menu "Quản lý chi trả chi phí" | Block | /403 ✅ | ✅ route blocked đúng |
| Sidebar visibility | Menu ẩn | **Hiển thị "Quản lý chi trả chi phí"** | ⚠️ **BUG-PERM-M5-006** (UI leak nhỏ — route đã block) |

**Evidence:** [16-chuyengia-ct-click.png](screenshots/16-chuyengia-ct-click.png)

---

## 3. Tổng hợp ô quyền (Cell Matrix Status)

### Entity 1 — HO_SO_CHI_TRA (11 ô)

| Role | Spec | Actual | Status | Bug Ref |
|------|------|--------|--------|---------|
| QTHT | 👁️ R | List view + UPDATE buttons (Cập nhật TT + Kiểm tra) | ❌ FAIL | BUG-PERM-M5-001 |
| CB_NV_TW | ✅ CRUD* (TW=all) | 100 records, full action UI | ✅ PASS¹ | — |
| CB_NV_BN | ✅ CRUD* scoped BN | 100 records (no scope filter) | ❌ FAIL | BUG-PERM-M5-002 |
| CB_NV_DP | ✅ CRUD* scoped DP | 100 records (no scope filter) | ❌ FAIL | BUG-PERM-M5-002 |
| CB_PD_TW | 📝 RU* (TW=all) | 100 records, RU buttons (no Create/Delete/Export) | ✅ PASS | — |
| CB_PD_BN | 📝 RU* scoped BN | 100 records (no scope filter) | ❌ FAIL | BUG-PERM-M5-002 |
| CB_PD_DP | 📝 RU* scoped DP | 100 records (no scope filter) | ❌ FAIL | BUG-PERM-M5-002 |
| DN | 🔌 C†R* (API only, scoped own) | UI accessible + 100 cross-DN records exposed | ❌ **BLOCKER** | BUG-PERM-M5-003 |
| NHT | ❌ | Menu visible + can navigate + 100 records | ❌ FAIL | BUG-PERM-M5-004 |
| TVV | 👁️ R* | /403 (under-permission) | ❌ FAIL | BUG-PERM-M5-005 |
| CG | ❌ | /403 ✅ (sidebar UI leak) | ⚠️ PASS w/minor | BUG-PERM-M5-006 |

¹ CB_NV_TW PASS có điều kiện — không phân biệt được scope TW/BN/DP do test data đồng nhất (`zxczc`); nhưng nếu BN/DP đã FAIL scope thì TW hành xử "all" cũng không violation cấu trúc.

### Entity 2 — DANH_GIA_HO_SO_CHI_TRA (11 ô) — **TẤT CẢ BLOCKED**

Detail page `/chi-tra/{uuid}` = 404 cho mọi role → tab "Đánh giá" không truy cập được. 11 ô quyền đánh dấu **BLOCKED** chờ fix BUG-PERM-M5-007.

| Role | Spec | Actual | Status |
|------|------|--------|--------|
| QTHT | 👁️ R | Detail page 404 | 🚫 BLOCKED |
| CB_NV_TW/BN/DP | ✅ CRU* | Detail page 404 | 🚫 BLOCKED (×3) |
| CB_PD_TW/BN/DP | 📝 RU* | Detail page 404 | 🚫 BLOCKED (×3) |
| DN | ❌ | Detail page 404 | 🚫 BLOCKED |
| NHT | ❌ | Detail page 404 | 🚫 BLOCKED |
| TVV | ❌ | Detail page 404 | 🚫 BLOCKED |
| CG | ❌ | Detail page 404 | 🚫 BLOCKED |

---

## 4. Tổng kết test

| Tổng ô | PASS | FAIL | BLOCKED | Pass rate (trên ô đã test) |
|--------|------|------|---------|----------------------------|
| 22 (2 entity × 11 role) | 2 | 9 | 11 | 2/11 = **18%** |

### 4.1 Verdict

**❌ FAIL** — Permission Matrix Section 5 không đạt:
- **2 BLOCKER**: DN cross-tenant financial leak (BUG-PERM-M5-003), Detail route 404 (BUG-PERM-M5-007 — chặn nửa số ô test)
- **3 CRITICAL**: Data isolation BN/DP fail (M5-002 — recurring), NHT bypass (M5-004), QTHT escalation (M5-001)
- **2 MAJOR**: TVV under-permission (M5-005), Sidebar leak (M5-006)
- **11 ô BLOCKED** vì entity DANH_GIA không truy cập được

### 4.2 So sánh với round 2 sections trước

Pattern lặp lại từ Section 3 (CG/TVV) và Section 4 (Vụ việc):
- **Data isolation** BN/DP không filter theo `don_vi_id` — same root cause cho VU_VIEC, HO_SO_CHI_TRA, có thể cũng cho TU_VAN_VIEN. Đề xuất dev rà soát BE middleware row-level security thống nhất.
- **DN tiếp cận CMS** — pattern recurring (BUG-PERM-M4-005 đã bị flag). Section 5 nâng severity lên BLOCKER vì data tài chính có giá trị nhạy cảm cao hơn.
- **Menu sidebar không gating theo role** — visible cho mọi user kể cả khi route block. Đề xuất fix RoleSidebar component.

### 4.3 Health Score (rubric §QA `/qa-only`)

| Category | Findings | Score |
|----------|----------|-------|
| Console (no JS errors trong test) | 0 | 100 |
| Links (route /chi-tra/{uuid} 404) | 1 broken (universal) | 85 |
| Visual | 0 | 100 |
| Functional | 1 critical (M5-001 escalation) | 75 |
| UX | 1 minor (M5-006) | 92 |
| Performance | 0 | 100 |
| Content | 0 | 100 |
| Accessibility | 0 (chưa test) | 100 |
| **Authorization (chính)** | 2 blocker + 3 critical + 2 major (custom weight 30%) | **20** |

**Weighted final: ~50/100** (thấp do trọng số authorization cao).

---

## 5. Khuyến nghị

| # | Khuyến nghị | Priority |
|---|-------------|----------|
| 1 | Fix BUG-PERM-M5-003 (DN cross-tenant financial leak) — gating route + sidebar + BE row filter `where dn_id = current_user.dn_id` | **P0 BLOCKER** |
| 2 | Fix BUG-PERM-M5-007 (detail route 404) — chặn tiếp Section 5 test + chặn DANH_GIA testing | **P0** |
| 3 | Áp dụng fix BUG-PERM-M4-002 cho HO_SO_CHI_TRA (cùng root cause data isolation) | P0 |
| 4 | Fix BUG-PERM-M5-001 — ẩn UPDATE buttons cho QTHT trên list (Cập nhật TT + Kiểm tra) | P1 |
| 5 | Fix BUG-PERM-M5-005 — clarify TVV view scope HS chi trả (currently under-permission) | P1 |
| 6 | Fix BUG-PERM-M5-006 — sidebar component apply role-based visibility (chung cho mọi module) | P1 |
| 7 | Sau khi fix #2 (detail route), retest 11 ô DANH_GIA_HO_SO_CHI_TRA | P0 |

---

> Bug detail xem [bug-report-section-5.md](bug-report-section-5.md) · Cell-level dữ liệu xem [baseline.json](baseline.json)
