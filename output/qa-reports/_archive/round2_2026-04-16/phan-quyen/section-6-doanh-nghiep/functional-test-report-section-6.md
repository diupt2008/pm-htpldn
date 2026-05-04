# Functional Test Report — Ma trận phân quyền Mục 6 (Nhóm Doanh nghiệp)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025; OTP bypass `666666`) |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 14:30 — 2026-04-19 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | round2_2026-04-16 |
| **Tham chiếu** | [permission-matrix.md §6](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.7-quan-ly-doanh-nghiep.md](../../../funtion/7.7-quan-ly-doanh-nghiep.md) · [round2/doanh-nghiep/](../../doanh-nghiep/) |
| **Phương pháp** | Browse UI (gstack `/browse` Playwright headless 1280×720) — **KHÔNG test API** (theo yêu cầu user) |

---

## 1. Phạm vi test

**Module 6 — Nhóm Doanh nghiệp** (1 entity × 11 role = **11 ô quyền**):

| # | Entity | Route CMS | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|---|--------|-----------|------|-------|-------|----|----|-----|-----|
| 1 | DOANH_NGHIEP | `/doanh-nghiep/danh-sach` | 👁️ R | ✅ CRUD* | 👁️ R* | 📝 RU* | ❌ | ❌ | ❌ |

**Test data hiện có:** 9 bản ghi, mã `DN-HGI-0001` → `DN-HGI-0009`. **Lưu ý:** Prefix `HGI` theo BR-DN là **mã TỈNH của DN (Hà Giang)** — auto-gen format `DN-{TỈNH}-{SEQ}` — KHÔNG phải đơn vị quản lý. Đơn vị quản lý (`don_vi_quan_ly_id`) là field riêng, **không hiển thị trong list** (table chỉ có cột Mã DN / Tên / MST / Quy mô / Địa chỉ / Số lần HT / Tổng chi phí / Hành động). Detail route `/doanh-nghiep/{uuid}` trả `Không tìm thấy doanh nghiệp` → không verify được `don_vi` thực của từng record.

### Roles đã test

| # | Account | Role SRS | Đơn vị | Cấp | Landing sau OTP | Avatar hiển thị | Đăng nhập thành công? |
|---|---------|----------|--------|-----|-----------------|-----------------|------------------------|
| 1 | qtht_tw | QTHT | Cục BTTP | TW | /dashboard | QT Hệ thống TW / QTHT_TW | ✅ |
| 2 | canbo_tw | CB_NV | Cục BTTP | TW | /403 (known round-2) | Cán bộ TW / CB_TW | ⚠️ login OK, dashboard blocked |
| 3 | canbo_bn | CB_NV | Bộ KH&ĐT | BN | /403 | Cán bộ BN / CB_BN | ⚠️ |
| 4 | canbo_tinh | CB_NV | Sở TP HN | DP | /403 | — | ⚠️ |
| 5 | lanhdao_tw | CB_PD | Cục BTTP | TW | /403 | Lãnh đạo TW / LANH_DAO_TW | ⚠️ |
| 6 | lanhdao_bn | CB_PD | Bộ KH&ĐT | BN | /403 | Lãnh đạo BN / LANH_DAO_BN | ⚠️ |
| 7 | lanhdao_dp | CB_PD | Sở TP HN | DP | /403 | — | ⚠️ |
| 8 | dn_user | DN | Công ty TNHH Test | Portal | /403 | Công ty TNHH Test / DOANH_NGHIEP | ✅ |
| 9 | nht_user | NHT | — | Portal | /403 | Nguyễn Văn NHT / NHT | ✅ |
| 10 | tvv_user | TVV | — | Portal | /403 | Trần Văn TVV / TVV | ✅ |
| 11 | chuyengia_user | CG | — | Portal | /403 | Lê Văn CG / CHUYEN_GIA | ✅ |

---

## 2. Kết quả đo được

### 2.1 QTHT (qtht_tw) — Negative Read-only verification

**Spec matrix §6:** QTHT × DOANH_NGHIEP = **👁️ R** (chỉ xem, KHÔNG tạo/sửa/xóa — theo §9.2 "QTHT Read trên hầu hết entity nghiệp vụ, cần test admin xem được nhưng KHÔNG sửa/xóa dữ liệu nghiệp vụ").

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Click menu "Quản lý doanh nghiệp được hỗ trợ" | Nav `/doanh-nghiep/danh-sach`, list read-only | URL `/doanh-nghiep/danh-sach`, 9 records (`DN-HGI-0002..0009`) | ✅ menu + list |
| Button "Tìm kiếm" / "Xóa bộ lọc" | OK (filter) | Có | ✅ |
| Button "Xuất Excel" | OK (R-role vẫn export được) | Có | ✅ |
| Button "Làm mới" | OK | Có | ✅ |
| Button **"Thêm mới"** header | KHÔNG (R-role không create) | **CÓ** nút `+ Thêm mới` | ❌ **FAIL → BUG-PERM-M6-001** |
| Icon **Sửa (✏️)** per row | KHÔNG | **CÓ** (cột "Hành động") | ❌ **FAIL → BUG-PERM-M6-001** |
| Icon **Xóa (🗑️)** per row | KHÔNG | **CÓ** (cột "Hành động") | ❌ **FAIL → BUG-PERM-M6-001** |

**Evidence:** [01-qtht_tw-dn-list.png](screenshots/01-qtht_tw-dn-list.png)

Mức độ nghiêm trọng: **Major** — QTHT có thể CUD master data DN → vi phạm BR-AUTH-09 (QTHT Read-only trên entity nghiệp vụ). Pattern trùng với **BUG-PERM-M5-001** (QTHT có nút "Cập nhật TT" + "Kiểm tra" trên Chi trả).

---

### 2.2 CB_NV TW (canbo_tw) — Positive CRUD* scope toàn quốc

**Spec matrix §6:** CB_NV_TW × DOANH_NGHIEP = ✅ **CRUD\*** (toàn quốc, TW thấy cả TW+BN+ĐP).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/doanh-nghiep/danh-sach` | OK | OK, 9 records | ✅ |
| Buttons header | Tìm kiếm / Xóa lọc / Thêm mới / Xuất Excel / Làm mới | Đầy đủ | ✅ |
| Per-row action | Xem + Sửa + Xóa icons | Đầy đủ | ✅ |
| Scope data | Thấy tất cả TW+BN+ĐP | 9/9 records (prefix `DN-HGI`) | ⚠️ PASS (baseline count, không phân biệt được TW/BN/DP do test data đồng nhất 1 đơn vị HGI) |

**Evidence:** [02-canbo_tw-dn-list.png](screenshots/02-canbo_tw-dn-list.png)

**Kết luận 2.2:** ✅ PASS (with caveat — test data đồng nhất không verify được scope TW, chỉ verify được UI CRUD có sẵn).

---

### 2.3 CB_NV BN / DP (canbo_bn, canbo_tinh) — Data isolation FAIL

**Spec matrix §6:** CB_NV_BN/DP × DOANH_NGHIEP = ✅ **CRUD\*** scoped đơn vị (BN chỉ thấy Bộ KH&ĐT; DP chỉ thấy Sở TP HN).

| Account | Đơn vị SRS | Expected scope | Actual scope | Kết luận |
|---------|------------|----------------|--------------|----------|
| canbo_bn | Bộ KH&ĐT (BN) | Chỉ DN thuộc Bộ KH&ĐT (0 records vì test data là HGI) | **9 records giống canbo_tw** ❌ | ❌ **FAIL → BUG-PERM-M6-002** |
| canbo_tinh | Sở TP HN (DP) | Chỉ DN thuộc Sở TP HN (0 records vì test data là HGI) | **9 records giống canbo_tw** ❌ | ❌ **FAIL → BUG-PERM-M6-002** |

UI buttons đầy đủ (Thêm mới, Xuất Excel, Làm mới, Sửa/Xóa per row) — chỉ data filter BE bị leak.

**Pattern lặp lại** với:
- BUG-PERM-M5-002 (Chi trả — Section 5)
- BUG-PERM-M4-002 (Vụ việc — Section 4)
- BUG-PM3-R2-002 (CG/TVV — Section 3)

→ Root cause chung: BE không enforce `WHERE don_vi_id = current_user.don_vi_id` khi query danh sách DN.

**Evidence:**
- [03-canbo_bn-dn-list.png](screenshots/03-canbo_bn-dn-list.png) — canbo_bn thấy `DN-HGI-0002..0009` (không phải data Bộ KH&ĐT)
- [04-canbo_tinh-dn-list.png](screenshots/04-canbo_tinh-dn-list.png) — canbo_tinh thấy data giống hệt

---

### 2.4 CB_PD TW (lanhdao_tw) — Positive R* view-only

**Spec matrix §6:** CB_PD × DOANH_NGHIEP = **👁️ R\*** (read-only, không CUD, scoped đơn vị).

| Hành động | Expected (matrix) | Actual | Kết luận |
|-----------|-------------------|--------|----------|
| Nav `/doanh-nghiep/danh-sach` | OK | OK, 9 records | ✅ |
| Buttons header | Tìm kiếm / Xóa lọc / Xuất Excel / Làm mới (KHÔNG có Thêm mới) | Tìm kiếm / Xóa lọc / Xuất Excel / Làm mới ✅ | ✅ **correctly hide Create** |
| Per-row action | Chỉ icon Xem (👁️) | **Chỉ Xem** (không Sửa/Xóa) | ✅ |

**Evidence:** [05-lanhdao_tw-dn-list.png](screenshots/05-lanhdao_tw-dn-list.png)

**Kết luận 2.4:** ✅ PASS — UI gating CB_PD đúng spec (không hiển thị Create/Edit/Delete).

---

### 2.5 CB_PD BN / DP (lanhdao_bn, lanhdao_dp) — Data isolation FAIL

**Spec matrix §6:** CB_PD_BN/DP × DOANH_NGHIEP = **👁️ R\*** scoped đơn vị.

| Account | Đơn vị SRS | Expected scope | Actual scope | Kết luận |
|---------|------------|----------------|--------------|----------|
| lanhdao_bn | Bộ KH&ĐT (BN) | Chỉ DN thuộc Bộ KH&ĐT | **9 records giống lanhdao_tw** ❌ | ❌ **FAIL → BUG-PERM-M6-002** (same root cause) |
| lanhdao_dp | Sở TP HN (DP) | Chỉ DN thuộc Sở TP HN | **9 records** ❌ | ❌ **FAIL → BUG-PERM-M6-002** |

UI vẫn chỉ có icon Xem per row (PASS cho UI gating) — nhưng data scope sai.

**Evidence:** [06-lanhdao_bn-dn-list.png](screenshots/06-lanhdao_bn-dn-list.png) · [07-lanhdao_dp-dn-list.png](screenshots/07-lanhdao_dp-dn-list.png)

---

### 2.6 DN (dn_user) — CMS blocking verification (DI-09)

**Spec matrix §6:** DN × DOANH_NGHIEP = **📝 RU\*** trên OWN record — theo ghi chú §9.1 **qua API only, không truy cập CMS UI**. DI-09: "DN truy cập CMS URL → bị chặn".

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Login qua `/login` với dn_user/Test@1234 + OTP 666666 | Success, landing /403 | ✅ login OK, avatar "Công ty TNHH Test / DOANH_NGHIEP", landing `/403` | ✅ |
| Sidebar hiển thị menu CMS? | KHÔNG (hoặc tất cả disabled) | **Hiển thị ĐẦY ĐỦ sidebar** (Hỏi đáp, Đào tạo, Chuyên gia, Vụ việc, Chi trả, **Doanh nghiệp**, Đánh giá, Biểu mẫu, Tư vấn, CT HTPLDN, Báo cáo, Quản trị HT) | ⚠️ **UI leak (minor) → BUG-PERM-M6-003** |
| Click menu "Quản lý doanh nghiệp được hỗ trợ" | Block hoặc /403 | `/doanh-nghiep` → redirect `/403` ✅ | ✅ |

**Evidence:**
- [08a-dn_user-landing.png](screenshots/08a-dn_user-landing.png) — landing /403, sidebar đầy đủ menu
- [08e-dn-final-landing.png](screenshots/08e-dn-final-landing.png) — fresh session verify
- [08f-dn-final-menu.png](screenshots/08f-dn-final-menu.png) — click menu → /403

**Kết luận 2.6:** ✅ **PASS** route-level (DN bị chặn CMS đúng DI-09). ⚠️ Có **UI leak minor** — sidebar hiển thị tất cả menu CMS cho DN user (không chặn việc DN biết có những module gì trong hệ thống). Khác với Section 5 — ở Section 5 DN thấy được **data** chi trả (cross-tenant leak), ở Section 6 DN chỉ bị chặn ở mức route `/403`, không leak data.

**Lưu ý quan trọng:** Quyền RU* trên OWN DN record được expected thực thi qua **API inbound từ Cổng PLQG** (🔌 prefix gợi ý trong §9.1 "DN qua API"), không test qua CMS UI trong đợt này.

---

### 2.7 NHT (nht_user) — ❌ expected no access

**Spec matrix §6:** NHT × DOANH_NGHIEP = **❌** (không quyền).

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Landing sau OTP | /403 hoặc portal | `/403`, avatar "Nguyễn Văn NHT / NHT" | ✅ |
| Sidebar menu | Ẩn hoặc disabled | Hiển thị sidebar full (tương tự DN) | ⚠️ UI leak (same pattern) |
| Click menu "Quản lý doanh nghiệp" | /403 | `/doanh-nghiep` → redirect `/403` | ✅ |

**Evidence:** [09a-nht_user-landing.png](screenshots/09a-nht_user-landing.png) · [09b-nht_user-dn-attempt.png](screenshots/09b-nht_user-dn-attempt.png)

**Kết luận 2.7:** ✅ PASS — route-level blocking đúng.

---

### 2.8 TVV (tvv_user) — ❌ expected no access

**Spec matrix §6:** TVV × DOANH_NGHIEP = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Landing | /403 | `/403`, avatar "Trần Văn TVV / TVV" | ✅ |
| Click menu "Quản lý doanh nghiệp" | /403 | `/403` | ✅ |

**Evidence:** [10-tvv_user-dn-attempt.png](screenshots/10-tvv_user-dn-attempt.png)

**Kết luận 2.8:** ✅ PASS.

---

### 2.9 CG (chuyengia_user) — ❌ expected no access

**Spec matrix §6:** CG × DOANH_NGHIEP = **❌**.

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Landing | /403 | `/403`, avatar "Lê Văn CG / CHUYEN_GIA" | ✅ |
| Click menu "Quản lý doanh nghiệp" | /403 | `/doanh-nghiep` → redirect `/403` | ✅ |

**Evidence:** [11a-cg-landing.png](screenshots/11a-cg-landing.png) · [11b-cg-dn-menu.png](screenshots/11b-cg-dn-menu.png)

**Kết luận 2.9:** ✅ PASS.

---

## 3. Tổng kết ma trận

### 3.1 Bảng đối chiếu Expected vs Actual

| # | Role | Expected (matrix §6) | Actual UI CMS | Data scope | Verdict |
|---|------|----------------------|----------------|-----------|---------|
| 1 | QTHT | 👁️ R | List OK, **có Thêm mới + Sửa + Xóa** | ok (TW=all) | ❌ **FAIL** — UI gating sai (BUG-M6-001) |
| 2 | CB_NV_TW | ✅ CRUD* | Full CRUD OK | 9/9 (TW=all) | ✅ PASS |
| 3 | CB_NV_BN | ✅ CRUD* scope BN | Full CRUD OK | **9/9 (scope leak)** | ❌ **FAIL** data isolation (BUG-M6-002) |
| 4 | CB_NV_DP | ✅ CRUD* scope DP | Full CRUD OK | **9/9 (scope leak)** | ❌ **FAIL** data isolation (BUG-M6-002) |
| 5 | CB_PD_TW | 👁️ R* | View-only (đúng) | 9/9 (TW=all) | ✅ PASS |
| 6 | CB_PD_BN | 👁️ R* scope BN | View-only (đúng) | **9/9 (scope leak)** | ❌ **FAIL** data isolation (BUG-M6-002) |
| 7 | CB_PD_DP | 👁️ R* scope DP | View-only (đúng) | **9/9 (scope leak)** | ❌ **FAIL** data isolation (BUG-M6-002) |
| 8 | DN | 📝 RU* OWN (via API) | Landing /403 + menu /403 | n/a (CMS blocked) | ✅ PASS route | ⚠️ UI sidebar leak (BUG-M6-003) |
| 9 | NHT | ❌ | /403 | n/a | ✅ PASS |
| 10 | TVV | ❌ | /403 | n/a | ✅ PASS |
| 11 | CG | ❌ | /403 | n/a | ✅ PASS |

**Tỷ lệ PASS:** 6/11 = **54.5%** (5 ô FAIL do BUG-M6-001 + BUG-M6-002).

### 3.2 Bug tổng hợp

| Bug ID | Severity | Title | Cells affected |
|--------|----------|-------|----------------|
| **BUG-PERM-M6-001** | Major | QTHT có nút Thêm mới + Sửa + Xóa trên DOANH_NGHIEP (vi phạm 👁️ R read-only) | 1 (QTHT) |
| **BUG-PERM-M6-002** | Critical | Data isolation fail — CB_NV_BN/DP + CB_PD_BN/DP thấy data ngoài đơn vị mình | 4 (CB_NV_BN, CB_NV_DP, CB_PD_BN, CB_PD_DP) |
| **BUG-PERM-M6-003** | Minor | UI sidebar hiển thị đầy đủ menu CMS cho role Portal (DN, NHT) không có quyền | 2 (DN, NHT) — cosmetic |

Chi tiết: [bug-report-section-6.md](bug-report-section-6.md)

### 3.3 So sánh với các Section khác (root cause recurrence)

| Root cause | Section bị dính |
|------------|-----------------|
| **Data isolation BN/DP fail** | Section 3 (CG/TVV), Section 4 (Vụ việc), Section 5 (Chi trả), **Section 6 (DN)** |
| **QTHT có write UI trên entity nghiệp vụ** | Section 5 (Chi trả — "Cập nhật TT", "Kiểm tra"), **Section 6 (DN — Thêm mới, Sửa, Xóa)** |
| **Sidebar UI leak cho Portal roles** | Section 5 (DN, NHT), **Section 6 (DN, NHT)** |

→ Dev cần fix 1 lần ở BE layer (middleware scoping + role-based UI gating) có thể resolve đồng loạt nhiều Section.

---

## 4. Limitations & Caveats

1. **Không verify được `don_vi_quan_ly` của 9 records qua UI:** (a) list không có cột "Đơn vị quản lý", (b) detail `/doanh-nghiep/{uuid}` trả 404 "Không tìm thấy doanh nghiệp" (cùng pattern BUG-PERM-M5-007), (c) form Thêm mới không mở được trong session này (browse crash). **Prefix `HGI` trong mã DN là mã tỉnh của DN (Hà Giang), KHÔNG phải đơn vị quản lý**. Tuy nhiên, verdict data isolation FAIL vẫn đúng ở **mọi kịch bản seed** (xem Bảng phân tích trong bug-report):<br>- A: 9 DN thuộc TW → BN/DP expected 0, actual 9 = bug<br>- B: 9 DN chia 3 cấp (3/3/3) → BN/DP expected 3/3, actual 9/9 = bug<br>- C: 9 DN ở Bộ KH&ĐT → canbo_tinh expected 0, actual 9 = bug<br>→ Khuyến nghị dev: (1) thêm cột "Đơn vị quản lý" vào list UI, (2) fix detail route 404, (3) QA seed thêm data phân bố 3 đơn vị rõ ràng (Cục BTTP/TW, Bộ KH&ĐT/BN, Sở TP HN/DP) để retest verify chính xác từng scope.
2. **📝 RU* của DN không test qua CMS:** Matrix chỉ định DN có RU* OWN record, nhưng ghi chú §9.1 chỉ rõ "DN qua API only". Test API không trong scope đợt này (theo yêu cầu user chỉ Browse UI).
3. **Browse tool crashes intermittent** với Portal roles (dn_user, chuyengia_user) — dùng kỹ thuật cleanup theo Rule 6 + atomic chain (Rule 5) để recover. Không ảnh hưởng kết quả cuối cùng.
4. **Guard xóa (DN có VV liên kết):** Không test trong đợt permission matrix — nằm trong functional test (DN-007) đã test ở round2/doanh-nghiep/.

---

## 5. Verdict

❌ **FAIL** — Module 6 permission matrix không PASS.

- **5/11 ô FAIL** (45%), 2 Major+Critical bugs.
- **BUG-PERM-M6-002 Critical** — data isolation BN/DP fail lặp pattern recurring 4 Section → cần fix BE scoping layer tổng thể.
- **BUG-PERM-M6-001 Major** — QTHT có write UI, vi phạm BR-AUTH-09, pattern trùng Section 5.
- **BUG-PERM-M6-003 Minor** — UI sidebar leak cho Portal roles.

**Khuyến nghị:** Dev fix BUG-M6-002 + BUG-M6-001 **trước** khi retest Section 6, 5, 4, 3 (cùng root cause). BUG-M6-003 có thể fix sau (UX issue, không ảnh hưởng security).

---

## Checksum evidence

- Total screenshots: 17 (01 → 11b)
- Screenshot folder: [screenshots/](screenshots/)
- Baseline JSON: [baseline.json](baseline.json)
- Bug report: [bug-report-section-6.md](bug-report-section-6.md)
