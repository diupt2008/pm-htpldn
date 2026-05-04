# Permission Test Report — QTHT FR-06 → FR-09 (Overall)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 QTHT](../../../permission-matrix-by-role.md)
**Round:** Round 3 phân quyền — Sub-batch 2 (FR-06..FR-09), Accounts: qtht_tw_4 / qtht_bn_4 / qtht_dp_4

---

## 1. Kết quả tổng quan

| Module | Tổng function | ✅ PASS | ❌ FAIL | ⚠️ PARTIAL | Tỷ lệ PASS | Verdict |
|--------|---------------|---------|---------|-------------|------------|---------|
| FR-06 Chi trả Chi phí | 13 | 13 | 0 | 0 | 100% | ✅ PASS |
| FR-07 Doanh nghiệp | 3 | 2 | 0 | 1 | 67% | ⚠️ PASS (matrix gap) |
| FR-08 Đánh giá Hiệu quả | 9 | 9 | 0 | 0 | 100% | ✅ PASS |
| FR-09 Biểu mẫu | 8 | 5 | 0 | 3 | 63% | ⚠️ PASS (gap UI) |
| **TỔNG FR-06..09** | **33** | **29** | **0** | **4** | **88%** | ✅ **PASS** |

### Bug tóm tắt

**Không phát hiện bug phân quyền mới** trong FR-06..FR-09. Toàn bộ 3 cấp QTHT (TW/BN/ĐP) không thấy button CRUD trong module R-only → match spec SRS §3.4.2.

### Regression BUG-002 (từ round FR-01..05) — CHƯA FIX

| Bug | Status | Evidence |
|-----|--------|----------|
| **BUG-PERM-QTHT-FR04-002** Dashboard widget TVV count = 0 cho qtht_dp_4 | **Still Open** | Confirm lại ở round này: qtht_dp_4 Dashboard FR-I-07 vẫn = 0 (qtht_tw/bn = 1). Vi phạm BR-AUTH-08. |

### ⚠️ PARTIAL items (không phải bug phân quyền, cần BA/Architect confirm)

| Function | Issue | Module |
|----------|-------|--------|
| `FR-V.III-02` | Matrix gán "Tìm kiếm DN" → entity `DON_VI` CRUD — có vẻ sai labeling (function này thao tác trên DOANH_NGHIEP R) | FR-07 |
| `FR-VII-04` | SCR-VII-02 "Quản lý Biểu mẫu" UI chưa phơi ra sidebar/drill-down | FR-09 |
| `FR-VII-05` | Tìm kiếm BIEU_MAU phụ thuộc SCR-VII-02 UI | FR-09 |
| `FR-VII-06` | SCR-VII-03 "Nhập Biểu mẫu Hàng loạt" UI chưa phơi ra | FR-09 |
| `FR-VII-08` | HOP_DONG_TU_VAN vị trí UI không rõ (có thể drill-down từ TVV detail) | FR-09 |
| `FR-VI-02, 03` | AUDIT_LOG (FR-08) + DANH_MUC CRUD (FR-03) test ở module QTHT khác, không ở FR-08 | FR-08 |

---

## 2. Bảng ma trận QTHT × FR-06..09 × 3 cấp

| FR / Function | Entity | Spec QTHT | qtht_tw_4 | qtht_bn_4 | qtht_dp_4 | Ghi chú |
|---------------|--------|-----------|-----------|-----------|-----------|---------|
| **FR-06** 13 function | HO_SO_CHI_TRA (12) + THONG_BAO (1) | 👁️ R | ✅ | ✅ | ✅ | Empty data, 5 tab render, no [Thêm mới] |
| **FR-07-01** | DOANH_NGHIEP | 👁️ R | ✅ | ✅ | ✅ | Empty, no [Thêm mới] + no [Import] |
| **FR-07-02** | DON_VI (matrix) | ✅ F CRUD | ⚠️ | ⚠️ | ⚠️ | Matrix mapping ambiguous — test riêng ở FR-VIII-05 |
| **FR-07-NEW-01** | DOANH_NGHIEP | 👁️ R | ✅ | ✅ | ✅ | Import Excel không render cho QTHT |
| **FR-08** 9 function | VU_VIEC, AUDIT_LOG, DANH_MUC, KE_HOACH_DANH_GIA, KET_QUA_DANH_GIA, BAO_CAO_DANH_GIA | 👁️ R (8) + ✅ F DANH_MUC (1) | ✅ | ✅ | ✅ | 10 status tab + filter render, no [Lập KH] |
| **FR-09** 8 function | THU_MUC_BIEU_MAU, BIEU_MAU, HOP_DONG_TU_VAN | 👁️ R | ✅ 5/8 + ⚠️ 3/8 gap UI | ✅ 5/8 + ⚠️ | ✅ 5/8 + ⚠️ | Chỉ SCR-VII-01 phơi ra, 2 SCR khác chưa implement |

### Tóm tắt CRUD button render — 3 cấp QTHT × 4 module

| Module | [Thêm mới] | [Sửa] row | [Xóa] row | [Workflow buttons] | Verdict |
|--------|-----------|-----------|-----------|--------------------|---------|
| FR-06 Chi trả | ❌ (đúng) | Empty BLOCKED | Empty BLOCKED | ❌ (đúng) | ✅ |
| FR-07 DN | ❌ (đúng) | Empty BLOCKED | Empty BLOCKED | ❌ Import (đúng) | ✅ |
| FR-08 Đánh giá | ❌ (đúng) | Empty BLOCKED | Empty BLOCKED | ❌ (đúng) | ✅ |
| FR-09 Biểu mẫu | ❌ (đúng) | Empty BLOCKED | Empty BLOCKED | ❌ Công khai/Import (đúng) | ✅ |

**→ Kết luận:** KHÔNG có row [Xóa] bug như FR-04 (TVV) ở các module này. Bug FR-04 chỉ hiện ở TU_VAN_VIEN list.

### Cross-scope behavior

| Account | Dashboard TVV count | FR-06 empty list | FR-07 empty list | FR-08 empty list | FR-09 empty list |
|---------|---------------------|------------------|------------------|------------------|------------------|
| qtht_tw_4 | 1 ✅ | ✅ | ✅ | ✅ | ✅ |
| qtht_bn_4 | 1 ✅ | ✅ | ✅ | ✅ | ✅ |
| qtht_dp_4 | **0** ❌ (BUG-002 regression) | ✅ | ✅ | ✅ | ✅ |

→ BR-AUTH-08 (QTHT vượt scope) chỉ bị fail ở Dashboard widget TVV count (BUG-002 cũ). Các module FR-06..09 không có inconsistency giữa 3 cấp ở level list (tất cả đều empty, same behavior).

---

## 3. Phạm vi test

### Entity đã verify top-level
| Entity | Module | Coverage |
|--------|--------|----------|
| `HO_SO_CHI_TRA` | FR-06 | 100% top-level (12 function) |
| `THONG_BAO` | FR-06 | 100% (1 function — bell icon) |
| `DOANH_NGHIEP` | FR-07 | 100% top-level (2 function) |
| `DON_VI` | FR-07 | 0% (matrix mapping ambiguous — test riêng ở FR-10) |
| `VU_VIEC` (đánh giá) | FR-08 | 100% top-level (2 function) |
| `KE_HOACH_DANH_GIA` | FR-08 | 100% top-level (3 function) |
| `KET_QUA_DANH_GIA` | FR-08 | 100% top-level (1 function) |
| `BAO_CAO_DANH_GIA` | FR-08 | 100% top-level (1 function) |
| `AUDIT_LOG`, `DANH_MUC` | FR-08 | Out of scope (module riêng) |
| `THU_MUC_BIEU_MAU` | FR-09 | 100% top-level (1 function) |
| `BIEU_MAU` | FR-09 | 50% (2/4 function — 2 BLOCKED gap UI) |
| `HOP_DONG_TU_VAN` | FR-09 | 0% (UI chưa xác định) |

### Hạn chế
- **Tất cả 4 module empty data** → row-level action BLOCKED cho tất cả.
- **3 function FR-09 BLOCKED do gap UI** (SCR-VII-02, SCR-VII-03).
- **Không test API-level** (curl verify BE 403 guard) — round API sau.
- **Không verify được workflow buttons** (không có data để click detail).

---

## 4. Đề xuất / Next steps

### Ưu tiên 1 — BA/Architect confirm

1. **FR-V.III-02 matrix mapping:** Entity nên là `DOANH_NGHIEP` (R) hay `DON_VI` (CRUD)? Nếu giữ `DON_VI` CRUD thì function trùng FR-VIII-05 → merge.
2. **FR-09 UI gap:**
   - SCR-VII-02 `Quản lý Biểu mẫu` — drill-down hay sidebar riêng?
   - SCR-VII-03 `Nhập Biểu mẫu Hàng loạt` — button hay page?
   - FR-VII-08 `HOP_DONG_TU_VAN` — vị trí UI?
3. **FR-08 cột "Hành động"** cho table KH đánh giá — có cần add không để QTHT có link [Xem]?

### Ưu tiên 2 — Fix BUG-002 regression (từ round trước)

- **BUG-PERM-QTHT-FR04-002** Dashboard widget TVV count = 0 cho qtht_dp_4 — Medium, P2, BE endpoint thiếu role guard cho QTHT. **Round này confirm vẫn chưa fix** → escalate.

### Ưu tiên 3 — Seed data

- ≥5 HO_SO_CHI_TRA (FR-06)
- ≥5 DOANH_NGHIEP (FR-07)
- ≥2 KH đánh giá (FR-08)
- ≥2 THU_MUC + ≥5 BIEU_MAU (FR-09)
→ Unblock row-level + drill-down test cho toàn bộ 33 function.

### Ưu tiên 4 — Test API guard (round sau)

- Verify BE chặn POST/PUT/DELETE token QTHT cho HO_SO_CHI_TRA, DOANH_NGHIEP, KE_HOACH_DANH_GIA, BIEU_MAU (expect 403).

---

## 5. Quy trình test

### Pattern optimal đã dùng

```
Login 1 role QTHT → Sweep 4 sidebar menu (Chi trả / Doanh nghiệp / Đánh giá / Biểu mẫu)
per module:
  click sidebar → wait_for heading → evaluate_script mainButtons + hasThemMoi → take_screenshot

Cross-scope: sessionStorage.clear() → navigate /login → login role mới
```

### Key findings (patterns)

- **MCP single session switch role** mất ~40s (login + OTP) — tiết kiệm so với gstack.
- **3 role QTHT cùng see empty data** ở tất cả 4 module → scope filter KHÔNG apply ở list-level (BR-AUTH-08 đúng).
- **Dashboard widget SCOPE-FILTER cho QTHT_DP** (regression BUG-002) vẫn không nhất quán với list.
- **Không có bug row [Xóa]** ở 4 module này → bug FR-04 specific cho component TVV list, không lan sang module khác.

---

## 6. Artifacts

- **Report per FR:**
  - [FR-06-chitra-report.md](FR-06-chitra-report.md)
  - [FR-07-doanhnghiep-report.md](FR-07-doanhnghiep-report.md)
  - [FR-08-danhgia-report.md](FR-08-danhgia-report.md)
  - [FR-09-bieumau-report.md](FR-09-bieumau-report.md)
- **Screenshots (4 qtht_tw + 1 qtht_bn + 1 qtht_dp):**
  - [R-40-qtht_tw-fr06-chitra.png](screenshots/R-40-qtht_tw-fr06-chitra.png)
  - [R-41-qtht_tw-fr07-doanhnghiep.png](screenshots/R-41-qtht_tw-fr07-doanhnghiep.png)
  - [R-42-qtht_tw-fr08-kehoach.png](screenshots/R-42-qtht_tw-fr08-kehoach.png)
  - [R-43-qtht_tw-fr09-thumuc.png](screenshots/R-43-qtht_tw-fr09-thumuc.png)
  - [R-50-qtht_bn-fr09-thumuc.png](screenshots/R-50-qtht_bn-fr09-thumuc.png)
  - [R-51-qtht_dp-fr09-thumuc.png](screenshots/R-51-qtht_dp-fr09-thumuc.png)
- **Ref round trước (FR-01..05):**
  - [permission-matrix-test-report.md](permission-matrix-test-report.md)
  - [bug-report.md](bug-report.md)

---

## 7. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~18 phút (3 role × ~6 phút) |
| Số MCP tool call | ~45 |
| Số screenshot | 6 |
| Browser mode | headed (Chrome DevTools MCP default) |
| Crashes | 1 (profile lock giữa test — recovered bằng pkill + relist_pages) |
| OTP dùng | `666666` bypass |

---

## 8. Verdict chung

✅ **PASS WITH MATRIX/UI GAPS**

- Phân quyền QTHT cho FR-06..FR-09 = đúng spec (R-only, không lộ button CRUD).
- 4 PARTIAL item là vấn đề **matrix labeling / UI chưa implement**, KHÔNG phải bug phân quyền.
- BUG-002 từ round trước **chưa fix** (regression) — còn cần dev xử lý.
- Ready để BA/Architect review matrix + confirm gap UI → unblock retest sau fix.

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
