# Functional Test Report — Ma trận phân quyền Mục 3 (Nhóm Chuyên gia / Tư vấn viên)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ (MailHog OTP: http://103.172.236.130:8025) |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 12:25 — 2026-04-19 |
| **Loại test** | Permission Matrix (Authorization) |
| **Round** | Round 2 (round2_2026-04-16) |
| **Tham chiếu** | [permission-matrix.md §3](../../../permission-matrix.md) · [test-strategy.md §1.2, §5, §9](../../../test-strategy.md) · [funtion/7.4-chuyen-gia-tvv.md](../../../funtion/7.4-chuyen-gia-tvv.md) |
| **Phương pháp** | Browse UI (gstack `/browse`), KHÔNG test API |

---

## 1. Phạm vi test

**Module 3 — Nhóm Chuyên gia / Tư vấn viên** (3 entity × 11 role = 33 ô quyền):

| # | Entity | Route CMS phát hiện | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|---|--------|---------------------|------|-------|-------|----|----|-----|----|
| 1 | TU_VAN_VIEN | `/chuyen-gia-tvv/danh-sach` | 👁️ R | ✅ CRUD* | 📝 RU* | ❌ | ❌ | 👁️ R* | 👁️ R* |
| 2 | HO_SO_TU_VAN_VIEN | `/chuyen-gia-tvv/{id}` (tab "Hồ sơ") | 👁️ R | ✅ CRU* | 👁️ R* | ❌ | ✅ CRU* | 👁️ R* | 👁️ R* |
| 3 | DANH_GIA_TU_VAN_VIEN | `/chuyen-gia-tvv/{id}` (tab "Đánh giá") | 👁️ R | ✅ CRU* | ✅ CRU* | 🔌 C†R* (API) | ❌ | ❌ | ❌ |

### Roles đã test

| # | Account | Role SRS | Đơn vị | Cấp | User hiển thị sau login | Landing URL |
|---|---------|----------|--------|-----|-------------------------|-------------|
| 1 | admin | QTHT | Cục BTTP | TW | "Quản trị hệ thống / QTHT_TW" | /dashboard |
| 2 | canbo_tw | CB_NV_TW | Cục BTTP | TW | "Cán bộ TW / CB_TW" | /403 |
| 3 | canbo_bn | CB_NV_BN | Bộ KH&ĐT | BN | "Cán bộ BN / CB_BN" | /403 |
| 4 | canbo_tinh | CB_NV_DP | Sở TP HN | DP | "Cán bộ Tỉnh / CB_TINH" | /403 |
| 5 | lanhdao_tw | CB_PD_TW | Cục BTTP | TW | "Lãnh đạo TW / LANH_DAO_TW" | /403 |
| 6 | lanhdao_bn | CB_PD_BN | Bộ KH&ĐT | BN | "Lãnh đạo BN / LANH_DAO_BN" | /403 |
| 7 | lanhdao_dp | CB_PD_DP | Sở TP HN | DP | "Lãnh đạo ĐP / LANH_DAO_DP" | /403 |
| 8 | dn_user | DN | — | Portal | "Công ty TNHH Test / DOANH_NGHIEP" | /403 |
| 9 | nht_user | NHT | — | Portal | "Nguyễn Văn NHT / NHT" | /403 |
| 10 | tvv_user | TVV | — | Portal | "Trần Văn TVV / TVV" | /403 |
| 11 | chuyengia_user | CG | — | Portal | "Lê Văn CG / CHUYEN_GIA" | /403 |

---

## 2. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Cells** | 33 (3 entity × 11 role) |
| **Tested** | 11 |
| **Passed** | 6 |
| **Failed** | 5 |
| **Blocked** | 22 |
| **Partial** | 0 |
| **Coverage** | 33% (11/33) |
| **P0 Pass Rate** | 6/11 tested cells P0 |
| **Bugs Found** | 4 (3 Critical, 1 Major) |
| **Health Score** | 40/100 |
| **Start Time** | 11:58 (UTC+7) |
| **End Time** | 12:25 (UTC+7) |
| **Total Duration** | ~27 phút |
| **Browse Status** | OK sau 7 lần crash (mỗi lần cleanup + retry 1 thành công theo Rule 7) |

### Verdict: **FAIL**

Phát hiện 3 Critical + 1 Major. Đặc biệt, **BUG-PERM-M3-003 (API 500 khi GET chi tiết TVV)** chặn 22/33 ô ma trận — không thể verify entity `HO_SO_TU_VAN_VIEN` và `DANH_GIA_TU_VAN_VIEN` qua UI. Hai bug phân quyền đã phát hiện ở round 2026-04-18 (BUG-PM3-001, BUG-PM3-002) **tái xuất hiện** trong round này → chưa fix.

---

## 3. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi cell 1 dòng. Chi tiết bug xem [bug-report-section-3.md](bug-report-section-3.md).

### 3.1 Entity `TU_VAN_VIEN` (11/11 tested)

| Cell ID | Role | Account | Expected | Thực tế list page | Thêm TVV | Xuất Excel | Result | Bug ID |
|---------|------|---------|----------|-------------------|----------|------------|--------|--------|
| 3-TVV-01 | QTHT | admin | 👁️ R (chỉ xem, không C/U/D/Export) | Load OK, 1 row DANG_HOAT_DONG | **Có ❌** | **Có ❌** | **FAIL** | BUG-PERM-M3-001 |
| 3-TVV-02 | CB_NV_TW | canbo_tw | ✅ CRUD* (toàn quốc) | Load OK | Có ✅ | Có ✅ | **PASS** | — |
| 3-TVV-03 | CB_NV_BN | canbo_bn | ✅ CRUD* scoped BN | Load OK, **thấy TVV-BTP-TW-0001** (thuộc TW) | Có ✅ | Có ✅ | **FAIL** (scope) | BUG-PERM-M3-002 |
| 3-TVV-04 | CB_NV_DP | canbo_tinh | ✅ CRUD* scoped DP | Load OK, **thấy TVV-BTP-TW-0001** (thuộc TW) | Có ✅ | Có ✅ | **FAIL** (scope) | BUG-PERM-M3-002 |
| 3-TVV-05 | CB_PD_TW | lanhdao_tw | 📝 RU* (chỉ R+U, không C/D) | Load OK | KHÔNG ✅ | KHÔNG ✅ | **PASS** | — |
| 3-TVV-06 | CB_PD_BN | lanhdao_bn | 📝 RU* scoped BN | Load OK, **thấy TVV-BTP-TW-0001** | KHÔNG ✅ | KHÔNG ✅ | **FAIL** (scope) | BUG-PERM-M3-002 |
| 3-TVV-07 | CB_PD_DP | lanhdao_dp | 📝 RU* scoped DP | Load OK, **thấy TVV-BTP-TW-0001** | KHÔNG ✅ | KHÔNG ✅ | **FAIL** (scope) | BUG-PERM-M3-002 |
| 3-TVV-08 | DN | dn_user | ❌ (không CMS) | Menu grayed-out, click → /403 | — | — | **PASS** | — |
| 3-TVV-09 | NHT | nht_user | ❌ trên TU_VAN_VIEN | Menu grayed-out, click → /403 | — | — | **PASS** | — |
| 3-TVV-10 | TVV | tvv_user | 👁️ R* | Load OK | KHÔNG ✅ | KHÔNG ✅ | **PASS** | — |
| 3-TVV-11 | CG | chuyengia_user | 👁️ R* | Load OK | KHÔNG ✅ | KHÔNG ✅ | **PASS** | — |

**Tổng `TU_VAN_VIEN`:** 6 PASS / 5 FAIL (1 button bug + 4 scope bug).

### 3.2 Entity `HO_SO_TU_VAN_VIEN` (0/11 tested — all BLOCKED)

| Cell ID | Role | Expected | Result | Lý do BLOCKED |
|---------|------|----------|--------|---------------|
| 3-HSTV-01 | QTHT | 👁️ R | **BLOCKED** | BUG-PERM-M3-003 (500 error trên detail page) |
| 3-HSTV-02 | CB_NV_TW | ✅ CRU* | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-03 | CB_NV_BN | ✅ CRU* scoped BN | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-04 | CB_NV_DP | ✅ CRU* scoped DP | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-05 | CB_PD_TW | 👁️ R* | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-06 | CB_PD_BN | 👁️ R* scoped BN | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-07 | CB_PD_DP | 👁️ R* scoped DP | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-08 | DN | ❌ | **INFERRED PASS** | DN bị 403 trên list page → không thể drill detail |
| 3-HSTV-09 | NHT | ✅ CRU* | **BLOCKED** | Menu TVV grayed-out cho NHT (đúng spec TU_VAN_VIEN=❌) **nhưng NHT cần entry point riêng cho HO_SO — chưa xác định route** + BUG-PERM-M3-003 chặn verify |
| 3-HSTV-10 | TVV | 👁️ R* | **BLOCKED** | BUG-PERM-M3-003 |
| 3-HSTV-11 | CG | 👁️ R* | **BLOCKED** | BUG-PERM-M3-003 |

### 3.3 Entity `DANH_GIA_TU_VAN_VIEN` (0/11 tested — all BLOCKED)

| Cell ID | Role | Expected | Result | Lý do BLOCKED |
|---------|------|----------|--------|---------------|
| 3-DGTV-01 | QTHT | 👁️ R | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-02 | CB_NV_TW | ✅ CRU* | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-03 | CB_NV_BN | ✅ CRU* scoped BN | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-04 | CB_NV_DP | ✅ CRU* scoped DP | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-05 | CB_PD_TW | ✅ CRU* | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-06 | CB_PD_BN | ✅ CRU* scoped BN | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-07 | CB_PD_DP | ✅ CRU* scoped DP | **BLOCKED** | BUG-PERM-M3-003 |
| 3-DGTV-08 | DN | 🔌 C†R* | **SKIP** | API-only, ngoài scope UI test theo user request |
| 3-DGTV-09 | NHT | ❌ | **INFERRED PASS** | Menu TVV grayed-out |
| 3-DGTV-10 | TVV | ❌ | **INFERRED PASS** | Không drill được detail (BUG-PERM-M3-003) — nhưng tab không hiển thị = không thấy entity |
| 3-DGTV-11 | CG | ❌ | **INFERRED PASS** | Tương tự TVV |

### Chú thích

> **Result:** `PASS` (đạt 100% expected) / `FAIL` (có bug) / `BLOCKED` (không chạy được do dependency) / `INFERRED PASS` (không test trực tiếp nhưng suy ra được từ upstream block) / `SKIP` (ngoài scope)
>
> **Priority:** tất cả cell là P0 vì thuộc ma trận phân quyền bắt buộc pass 100% (test-strategy §10.1 #4).

---

## 4. Kết quả đo được — chi tiết

### 4.1 QTHT (admin) — Positive Read verification

| Entity | URL | Screenshot | CREATE | EDIT | DELETE | EXPORT | Kết luận |
|--------|-----|------------|--------|------|--------|--------|----------|
| TU_VAN_VIEN list | /chuyen-gia-tvv/danh-sach | [01-admin-qtht-tvv-list.png](screenshots/01-admin-qtht-tvv-list.png) | **✅ Có "+ Thêm TVV" ❌** (spec R only) | (chưa drill detail) | (chưa drill detail) | **✅ Có "Xuất Excel" ❌** | **FAIL** — vi phạm QTHT=👁️R |
| HO_SO_TU_VAN_VIEN | /chuyen-gia-tvv/{id} | Detail page 500 error — xem [02b-canbo_tw-tvv-detail-500error.png](screenshots/02b-canbo_tw-tvv-detail-500error.png) | — | — | — | — | **BLOCKED** (BUG-003) |
| DANH_GIA_TU_VAN_VIEN | (tab trong detail) | Không render | — | — | — | — | **BLOCKED** |

**Kết luận QTHT:** FAIL cho TU_VAN_VIEN (button leak), BLOCKED cho 2 entity còn lại.

### 4.2 CB_NV 3 cấp (canbo_tw / canbo_bn / canbo_tinh) — CRUD* + scope

| Hành động | Expected | canbo_tw (TW) | canbo_bn (BN) | canbo_tinh (DP) | Kết luận |
|-----------|----------|---------------|----------------|------------------|----------|
| List page load | 200 OK | ✅ | ✅ | ✅ | PASS |
| Hiển thị "+ Thêm TVV" | Có (CRUD*) | ✅ Có | ✅ Có | ✅ Có | PASS (button) |
| Hiển thị "Xuất Excel" | Có | ✅ Có | ✅ Có | ✅ Có | PASS |
| Chỉ thấy data đơn vị mình | TW: all / BN: chỉ BN / DP: chỉ DP | ✅ TW thấy tất cả | ❌ **thấy TVV-BTP-TW-0001** | ❌ **thấy TVV-BTP-TW-0001** | **FAIL scope** BN/DP |
| Số rows trong tab "Đang hoạt động" | TW: 1 / BN: 0 / DP: 0 | 1 | **1 (sai — phải 0)** | **1 (sai — phải 0)** | FAIL |
| Tab "Mới đăng ký (8)" | TW: 8 / BN: số của BN / DP: số của DP | 8 | 8 | 8 | **FAIL** (scope không filter trên tab badge) |

**Evidence:**
- canbo_tw: [02-canbo_tw-tvv-list.png](screenshots/02-canbo_tw-tvv-list.png), [02c-canbo_tw-moi-dang-ky.png](screenshots/02c-canbo_tw-moi-dang-ky.png)
- canbo_bn: [03-canbo_bn-tvv-list.png](screenshots/03-canbo_bn-tvv-list.png)
- canbo_tinh: [04-canbo_tinh-tvv-list.png](screenshots/04-canbo_tinh-tvv-list.png)

**Kết luận CB_NV:** CRUD* buttons PASS cho cả 3 cấp, nhưng scope filter FAIL cho BN và DP (BUG-PERM-M3-002).

### 4.3 CB_PD 3 cấp (lanhdao_tw / lanhdao_bn / lanhdao_dp) — RU* + scope

| Hành động | Expected | lanhdao_tw | lanhdao_bn | lanhdao_dp | Kết luận |
|-----------|----------|------------|------------|------------|----------|
| List page load | 200 OK | ✅ | ✅ | ✅ | PASS |
| Hiển thị "+ Thêm TVV" | **KHÔNG** (RU* = no Create) | ✅ KHÔNG | ✅ KHÔNG | ✅ KHÔNG | PASS |
| Hiển thị "Xuất Excel" | KHÔNG | ✅ KHÔNG | ✅ KHÔNG | ✅ KHÔNG | PASS |
| Data scope | TW: all / BN: chỉ BN / DP: chỉ DP | ✅ | ❌ **thấy TVV TW** | ❌ **thấy TVV TW** | FAIL scope BN/DP |

**Evidence:**
- lanhdao_tw: [05-lanhdao_tw-tvv-list.png](screenshots/05-lanhdao_tw-tvv-list.png) — header **không có** buttons ✅
- lanhdao_bn: [06-lanhdao_bn-tvv-list.png](screenshots/06-lanhdao_bn-tvv-list.png) — không buttons ✅ nhưng scope sai ❌
- lanhdao_dp: [07-lanhdao_dp-tvv-list.png](screenshots/07-lanhdao_dp-tvv-list.png) — không buttons ✅ nhưng scope sai ❌

**Kết luận CB_PD:** RU* button PASS cho cả 3 cấp, scope FAIL cho BN và DP (cùng BUG-PERM-M3-002).

### 4.4 Portal DN (dn_user) — Expected ❌ PASS

| Mục | Expected | Actual | Kết luận |
|-----|----------|--------|----------|
| Menu sidebar "Quản lý chuyên gia / tư vấn viên" | Grayed out / hidden | **Grayed out** | ✅ PASS |
| Click menu | Không điều hướng / redirect | Redirect `/chuyen-gia-tvv` → `/403` | ✅ PASS |
| Landing page 403 | "Bạn không có quyền truy cập trang này" | ✅ Đúng | ✅ PASS |

**Evidence:** [08-dn_user-landing.png](screenshots/08-dn_user-landing.png), [08-dn_user-403.png](screenshots/08-dn_user-403.png)

**Kết luận DN:** PASS — menu chặn đúng ở TU_VAN_VIEN. Lưu ý: DN vẫn vào được CMS (vi phạm DI-09 đã phát hiện ở Section 1 — BUG-PERM-M1-001 — không repeat ở đây).

### 4.5 Portal NHT (nht_user) — Expected ❌ on TU_VAN_VIEN

| Mục | Expected | Actual | Kết luận |
|-----|----------|--------|----------|
| Menu "Quản lý chuyên gia / tư vấn viên" | Grayed out | **Grayed out** | ✅ PASS |
| Click menu → /chuyen-gia-tvv | 403 | ✅ /403 | ✅ PASS |
| Entry point tới `HO_SO_TU_VAN_VIEN` của mình | Phải có route riêng (NHT có ✅ CRU* trên HO_SO) | **Chưa phát hiện** trong sidebar — cần làm rõ UC49 | ⚠️ OPEN QUESTION |

**Evidence:** [09-nht_user-landing.png](screenshots/09-nht_user-landing.png), [09-nht_user-403.png](screenshots/09-nht_user-403.png)

**Kết luận NHT:** PASS (menu chặn đúng trên TU_VAN_VIEN). **Cảnh báo:** funtion/7.4 TVV-017 yêu cầu "NHT tự cập nhật hồ sơ" — cần SRS/PM xác nhận route/UC tương ứng, vì menu TVV không mở → NHT truy cập hồ sơ qua /profile hay /ca-nhan nào?

### 4.6 Portal TVV (tvv_user) — Expected 👁️R*

| Mục | Expected | Actual | Kết luận |
|-----|----------|--------|----------|
| Menu "Quản lý chuyên gia / tư vấn viên" | Enabled (R*) | ✅ Enabled | PASS |
| List page load | OK, Read-only | ✅ Load OK | PASS |
| "+ Thêm TVV" | KHÔNG | ✅ KHÔNG | PASS |
| "Xuất Excel" | KHÔNG | ✅ KHÔNG | PASS |

**Evidence:** [10-tvv_user-tvv-list.png](screenshots/10-tvv_user-tvv-list.png)

### 4.7 Portal CG (chuyengia_user) — Expected 👁️R*

| Mục | Expected | Actual | Kết luận |
|-----|----------|--------|----------|
| Menu "Quản lý chuyên gia / tư vấn viên" | Enabled | ✅ Enabled | PASS |
| List page load | OK, Read-only | ✅ Load OK | PASS |
| "+ Thêm TVV" / "Xuất Excel" | KHÔNG / KHÔNG | ✅ KHÔNG / KHÔNG | PASS |

**Evidence:** [11-chuyengia_user-tvv-list.png](screenshots/11-chuyengia_user-tvv-list.png)

**Ghi chú:** TVV/CG là portal user không gắn đơn vị → ký hiệu `*` (scoped) trong ma trận chưa rõ nghĩa. Ứng dụng cho TVV/CG thấy toàn bộ mạng lưới TVV (giống TW) — hợp lý cho use case "tra cứu mạng lưới" nhưng cần SRS làm rõ.

### 4.8 Drill detail page — APP/BE BUG phát hiện (canbo_tw, mọi TVV)

| Hành động | Expected | Actual | Kết luận |
|-----------|----------|--------|----------|
| Click row `Congnt` ở list page | FE điều hướng tới /chuyen-gia-tvv/{uuid}, render trang chi tiết với tabs (Hồ sơ, Lịch sử, Đánh giá) | FE điều hướng **OK** URL đúng, **nhưng** BE trả 500 cho `GET /api/v1/tu-van-viens/{uuid}` → page hiển thị "Không thể tải hồ sơ" + toast "Internal server error" | **FAIL — BUG-PERM-M3-003** |
| Retry count | 1 lần | FE retry 3 lần rồi đầu hàng | FAIL |

**Evidence:**
- [02b-canbo_tw-tvv-detail-500error.png](screenshots/02b-canbo_tw-tvv-detail-500error.png) — UI lỗi
- [evidence/detail-page-500-error.txt](evidence/detail-page-500-error.txt) — network/console log

**Network log** (từ `$B network` sau khi click):
```
GET /api/v1/tu-van-viens/818fc074-2d27-4368-976b-d218113669e8 → 500 (27ms, 177B)
GET /api/v1/tu-van-viens/818fc074-2d27-4368-976b-d218113669e8 → 500 (65ms, 177B)
GET /api/v1/tu-van-viens/818fc074-2d27-4368-976b-d218113669e8 → 500 (35ms, 177B)
```

---

## 5. Tổng hợp coverage ma trận

| Cell | Role | Entity | Expected | Tested? | Result |
|------|------|--------|----------|---------|--------|
| 3-1-QTHT | QTHT | TU_VAN_VIEN | 👁️ R | ✅ | **FAIL** (BUG-001 — có Thêm/Xuất) |
| 3-1-CB_NV_TW | CB_NV_TW | TU_VAN_VIEN | ✅ CRUD* | ✅ | PASS |
| 3-1-CB_NV_BN | CB_NV_BN | TU_VAN_VIEN | ✅ CRUD* scoped BN | ✅ | **FAIL** scope (BUG-002) |
| 3-1-CB_NV_DP | CB_NV_DP | TU_VAN_VIEN | ✅ CRUD* scoped DP | ✅ | **FAIL** scope (BUG-002) |
| 3-1-CB_PD_TW | CB_PD_TW | TU_VAN_VIEN | 📝 RU* | ✅ | PASS |
| 3-1-CB_PD_BN | CB_PD_BN | TU_VAN_VIEN | 📝 RU* scoped BN | ✅ | **FAIL** scope (BUG-002) |
| 3-1-CB_PD_DP | CB_PD_DP | TU_VAN_VIEN | 📝 RU* scoped DP | ✅ | **FAIL** scope (BUG-002) |
| 3-1-DN | DN | TU_VAN_VIEN | ❌ | ✅ | PASS |
| 3-1-NHT | NHT | TU_VAN_VIEN | ❌ | ✅ | PASS |
| 3-1-TVV | TVV | TU_VAN_VIEN | 👁️ R* | ✅ | PASS |
| 3-1-CG | CG | TU_VAN_VIEN | 👁️ R* | ✅ | PASS |
| 3-2-(all) | (all 11) | HO_SO_TU_VAN_VIEN | (various) | ❌ BLOCKED | BLOCKED — BUG-003 chặn detail |
| 3-3-(all) | (all 11) | DANH_GIA_TU_VAN_VIEN | (various) | ❌ BLOCKED | BLOCKED — BUG-003 chặn detail |

**Coverage đạt:** 11/33 cells = **33%**

**Blockers ngăn mở rộng coverage:**
1. BUG-PERM-M3-003 (500 error trên GET TVV detail) chặn hoàn toàn 22 ô của 2 entity còn lại.
2. Data thiếu: DB chỉ có 1 TVV `DANG_HOAT_DONG` thuộc TW, 8 TVV `MOI_DANG_KY` cũng TW → không đủ để verify scope multi-level (cần ≥1 BN + ≥1 DP).
3. Entry point `HO_SO_TU_VAN_VIEN` cho NHT (expected CRU*) chưa xác định UI route.

---

## 6. Tổng hợp bug

Xem chi tiết: [bug-report-section-3.md](bug-report-section-3.md)

| ID | Severity | Role × Entity | Tiêu đề |
|----|----------|---------------|---------|
| BUG-PERM-M3-001 | **Critical** | QTHT × TU_VAN_VIEN | QTHT thấy nút "+ Thêm TVV" và "Xuất Excel" — vi phạm QTHT=👁️R (tái xuất hiện từ round 2026-04-18) |
| BUG-PERM-M3-002 | **Critical** | CB_NV_BN/DP, CB_PD_BN/DP × TU_VAN_VIEN | Scope TW/BN/ĐP không enforce — BN/DP roles đều thấy TVV-BTP-TW-0001 (bản ghi TW) (tái xuất hiện từ round 2026-04-18) |
| BUG-PERM-M3-003 | **Critical** | All × HO_SO_TU_VAN_VIEN, DANH_GIA_TU_VAN_VIEN | `GET /api/v1/tu-van-viens/{id}` trả 500 → detail page không load → chặn 22/33 ô ma trận (MỚI) |
| BUG-PERM-M3-004 | Major | All × login flow | Form login persist session cookie — user mới đăng nhập thấy UI của user cũ nếu không clear cookies (MỚI) |

---

## 7. Pass Criteria đối chiếu §10.1

| # | Tiêu chí | Target | Actual | Kết luận |
|---|---------|--------|--------|----------|
| 4 | Phân quyền 3 cấp hoạt động đúng | 100% authorization tests pass | 6/11 tested cells PASS (54%); 22/33 BLOCKED | ❌ FAIL |
| 3 | Không có bug Blocker/Critical | 0 open | 3 Critical (BUG-001, BUG-002 tái xuất hiện; BUG-003 mới) | ❌ FAIL |

**Kết luận đợt test Section 3:** ❌ **FAIL** — cần fix 3 Critical trước khi re-test, đặc biệt BUG-003 phải fix trước vì chặn 67% ma trận.

---

## 8. Rủi ro & giới hạn của đợt test

1. **Browse daemon (Playwright) crash giữa chain** — gặp 7 lần trong 27 phút test. Mỗi lần `$B stop` + `pkill` + retry 1 lần thành công. Không gây mất dữ liệu test nhưng mất ~5 phút tổng cho recovery.
2. **Session cookie persistence** (BUG-PERM-M3-004) — ban đầu gây screenshot sai (canbo_bn hiển thị "Cán bộ TW"). Đã thêm step `js document.cookie.split(';').forEach(...)` + `localStorage.clear()` + `sessionStorage.clear()` trong chain đầu mỗi role → fix được.
3. **Data readiness thiếu** — 22 ô HO_SO/DANH_GIA BLOCKED không chỉ do BUG-003 mà còn vì chưa có TVV multi-cấp để verify scope. Round sau cần seed ≥1 TVV BN + ≥1 TVV DP.
4. **NHT entry point chưa xác định** — HO_SO_TU_VAN_VIEN expected CRU* cho NHT nhưng menu "Quản lý CG/TVV" bị grayed-out cho NHT. Cần SRS + prototype làm rõ route profile NHT.
5. **`*` cho portal role (TVV/CG)** — permission-matrix.md §3 ghi `👁️ R*` (scoped) nhưng portal không gắn đơn vị. Ứng dụng hiển thị toàn bộ → cần spec rõ hành vi mong đợi.

---

## 9. Khuyến nghị

1. **BE team fix BUG-PERM-M3-003 TRƯỚC** — vì không unblock được sẽ không verify được 22/33 ô còn lại và toàn bộ workflow SM-TVV + TC TVV-006/007/008/009/010/011/012/014/015/017/018/019/020 của funtion/7.4.
2. **BE team fix BUG-PERM-M3-002** — thêm row-level filter theo `don_vi_id` + `cap` trong `TuVanVienService.findAll()`. Cùng lúc, **seed data đa cấp** (1 TVV/cấp BN, 1 TVV/cấp DP) để re-test có đủ evidence.
3. **FE team fix BUG-PERM-M3-001 và BUG-PERM-M3-004 song song** — độc lập với BE. BUG-001 chỉ cần thêm CASL guard `{can('create','TuVanVien') && ...}`. BUG-004 cần clear `queryClient + abilityContext + localStorage` trong `onLoginSuccess`.
4. **SRS team làm rõ:** (a) Route profile NHT cho HO_SO_TU_VAN_VIEN; (b) Nghĩa của `*` với portal role TVV/CG.
5. **Re-test Section 3 round 3** sau khi fix 4 bug + seed data → target coverage 100% (33/33 cells).

---

## 10. Appendix

### A — Screenshots

| File | Mô tả | Cell / Bug |
|------|-------|------------|
| [01-admin-qtht-dashboard.png](screenshots/01-admin-qtht-dashboard.png) | admin landing /dashboard sau OTP | — |
| [01-admin-qtht-tvv-list.png](screenshots/01-admin-qtht-tvv-list.png) | admin TVV list — có "Thêm TVV" + "Xuất Excel" | 3-1-QTHT / BUG-001 |
| [02-canbo_tw-tvv-list.png](screenshots/02-canbo_tw-tvv-list.png) | canbo_tw TVV list — CRUD* đầy đủ | 3-1-CB_NV_TW |
| [02b-canbo_tw-tvv-detail.png](screenshots/02b-canbo_tw-tvv-detail.png) | Detail page "Không thể tải hồ sơ" (click Congnt) | BUG-003 |
| [02b-canbo_tw-tvv-detail-500error.png](screenshots/02b-canbo_tw-tvv-detail-500error.png) | Detail page + toast "Internal server error" | BUG-003 |
| [02c-canbo_tw-moi-dang-ky.png](screenshots/02c-canbo_tw-moi-dang-ky.png) | Tab "Mới đăng ký" 8 TVV | context |
| [03-canbo_bn-tvv-list.png](screenshots/03-canbo_bn-tvv-list.png) | canbo_bn thấy TVV-BTP-TW-0001 (TW record) | 3-1-CB_NV_BN / BUG-002 |
| [04-canbo_tinh-tvv-list.png](screenshots/04-canbo_tinh-tvv-list.png) | canbo_tinh thấy TVV-BTP-TW-0001 | 3-1-CB_NV_DP / BUG-002 |
| [05-lanhdao_tw-tvv-list.png](screenshots/05-lanhdao_tw-tvv-list.png) | lanhdao_tw KHÔNG có "Thêm TVV"/"Xuất Excel" — PASS | 3-1-CB_PD_TW |
| [06-lanhdao_bn-tvv-list.png](screenshots/06-lanhdao_bn-tvv-list.png) | lanhdao_bn thấy TVV-BTP-TW-0001 | 3-1-CB_PD_BN / BUG-002 |
| [07-lanhdao_dp-tvv-list.png](screenshots/07-lanhdao_dp-tvv-list.png) | lanhdao_dp thấy TVV-BTP-TW-0001 | 3-1-CB_PD_DP / BUG-002 |
| [08-dn_user-landing.png](screenshots/08-dn_user-landing.png) | DN landing /403 sau OTP | 3-1-DN |
| [08-dn_user-403.png](screenshots/08-dn_user-403.png) | DN click menu → /403 (403 page) | 3-1-DN |
| [09-nht_user-landing.png](screenshots/09-nht_user-landing.png) | NHT landing /403 | 3-1-NHT |
| [09-nht_user-403.png](screenshots/09-nht_user-403.png) | NHT click menu → /403 | 3-1-NHT |
| [10-tvv_user-tvv-list.png](screenshots/10-tvv_user-tvv-list.png) | TVV portal list Read-only — PASS | 3-1-TVV |
| [11-chuyengia_user-tvv-list.png](screenshots/11-chuyengia_user-tvv-list.png) | CG portal list Read-only — PASS | 3-1-CG |

### B — SRS Traceability

| SRS Reference | Cells Covered | Status |
|---------------|---------------|--------|
| permission-matrix §3 row TU_VAN_VIEN | 11 cells | 6 PASS / 5 FAIL |
| permission-matrix §3 row HO_SO_TU_VAN_VIEN | 11 cells | 0 tested (11 BLOCKED) |
| permission-matrix §3 row DANH_GIA_TU_VAN_VIEN | 11 cells | 0 tested (11 BLOCKED) |
| §9 "Ngang cấp KHÔNG thấy nhau" | 4 BN/DP cells | 4/4 FAIL (BUG-002) |
| §2 BR-AUTH-02 "QTHT Read-only on business entity" | QTHT × TU_VAN_VIEN | FAIL (BUG-001) |

### C — Environment Notes

- **API endpoint pattern:** `/api/v1/tu-van-viens` (list) + `/api/v1/tu-van-viens/{id}` (detail)
- **Auth flow:** JWT + OTP bypass `666666`
- **Frontend:** React 19 + Vite + Ant Design + CASL + React Query
- **Backend:** NestJS + PostgreSQL (suy đoán từ stack)
- **Known limitations:** Browse crash (Rule 7 retry), session persistence (Rule 6 clear cookies)

---

*Report generated: 2026-04-19 12:25 | QA Automation via Claude Code*
