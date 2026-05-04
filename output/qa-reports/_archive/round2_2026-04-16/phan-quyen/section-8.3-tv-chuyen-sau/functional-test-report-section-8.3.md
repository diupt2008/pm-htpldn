# Permission Test Report — FR-12 Tư vấn Chuyên sâu (Section 8.3)

**Ngày:** 2026-04-19 · **Tester:** QA Automation (Claude Code Opus 4.7) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI, không test API · **Spec:** [permission-matrix.md §12](../../../permission-matrix.md)

---

## 1. Kết quả tổng quan

| Tổng role | PASS | FAIL | Tỷ lệ PASS |
|-----------|------|------|------------|
| **11** | **2** | **9** | **18%** |

**Verdict: ❌ FAIL** — 2 bug chặn module.

| Bug | Severity | Impact |
|-----|----------|--------|
| **BUG-PERM-M8.3-002** | **Critical** | Menu "Tư vấn chuyên sâu" bị disable UI cho **8 role** (CB_NV×3, CB_PD×3, TVV, **CG primary user**) → module effectively không dùng được. |
| **BUG-PERM-M8.3-001** | Major | QTHT thấy nút `+ Tạo mới` trên list → vi phạm 👁️ R spec (pattern lặp M5/M6/M7/M8.1-001). |

→ Chi tiết 2 bug: xem [bug-report-section-8.3.md](bug-report-section-8.3.md)

---

## 2. Bảng kết quả chi tiết 11 role

> **Cách đọc:** Mỗi role login → click "Quản lý tư vấn" → click "Tư vấn chuyên sâu" → quan sát kết quả.

| # | Account | Role SRS | Expected quyền (matrix §12) | Actual UI observed | Verdict | Screenshot |
|---|---------|----------|------------------------------|---------------------|---------|-----------|
| 1 | qtht_tw | QTHT | 👁️ R (read-only) | ✅ Vào được list. ❌ Nhưng có nút `+ Tạo mới` (sai R-only) | ❌ **FAIL** | [R-01](screenshots/R-01-qtht_tw.png) |
| 2 | canbo_tw | CB_NV_TW | ✅ CRUD* toàn quốc | Sub-menu "Tư vấn chuyên sâu" **GRAYED OUT**, không click được → /403 | ❌ **FAIL** | [R-02](screenshots/R-02-canbo_tw.png) |
| 3 | canbo_bn | CB_NV_BN | ✅ CRUD* scope BN | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-03](screenshots/R-03-canbo_bn.png) |
| 4 | canbo_tinh | CB_NV_DP | ✅ CRUD* scope DP | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-04](screenshots/R-04-canbo_tinh.png) |
| 5 | lanhdao_tw | CB_PD_TW | 📝 RU* | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-05](screenshots/R-05-lanhdao_tw.png) |
| 6 | lanhdao_bn | CB_PD_BN | 📝 RU* scope BN | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-06](screenshots/R-06-lanhdao_bn.png) |
| 7 | lanhdao_dp | CB_PD_DP | 📝 RU* scope DP | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-07](screenshots/R-07-lanhdao_dp.png) |
| 8 | dn_user | DN | 👁️ R* (per §9.1 qua API only) | Parent menu "Quản lý tư vấn ▶" disabled → /403 (CMS blocked đúng DI-09) | ✅ **PASS** | [R-08](screenshots/R-08-dn_user.png) |
| 9 | nht_user | NHT | ❌ (không quyền) | Parent menu disabled → /403 | ✅ **PASS** | [R-09](screenshots/R-09-nht_user.png) |
| 10 | tvv_user | TVV | 👁️ R* | Sub-menu **GRAYED OUT** → /403 | ❌ **FAIL** | [R-10](screenshots/R-10-tvv_user.png) |
| 11 | chuyengia_user | **CG (primary user)** | ✅ CRU* | Parent menu **GRAYED OUT** → /403 | ❌ **FAIL Critical** | [R-11](screenshots/R-11-chuyengia_user.png) |

### Giải thích ký hiệu

- ✅ **PASS** = UI match spec (role có quyền đúng spec, hoặc bị chặn đúng khi spec ❌)
- ❌ **FAIL** = UI sai spec (role có quyền nhưng không truy cập được, hoặc role không quyền nhưng thấy nút)
- **GRAYED OUT** = Menu CSS disabled, cursor not-allowed, không click được

---

## 3. Nhóm role theo kết quả

### ✅ PASS (2 role)
- **DN** (`dn_user`) — CMS blocked đúng theo DI-09 (DN chỉ truy cập qua API).
- **NHT** (`nht_user`) — Menu disabled đúng spec ❌ (NHT không có quyền trên bất kỳ entity TVCS nào).

### ❌ FAIL — Menu disabled sai spec (8 role) → **BUG-M8.3-002 Critical**
- **CB_NV × 3 cấp** (canbo_tw, canbo_bn, canbo_tinh) — spec ✅ CRUD* nhưng không vào được
- **CB_PD × 3 cấp** (lanhdao_tw, lanhdao_bn, lanhdao_dp) — spec 📝 RU* nhưng không vào được
- **TVV** (tvv_user) — spec 👁️ R* nhưng không vào được
- **CG** (chuyengia_user) — spec ✅ CRU* **primary user của module** nhưng không vào được → **module không vận hành**

### ❌ FAIL — QTHT có nút sai (1 role) → **BUG-M8.3-001 Major**
- **QTHT** (qtht_tw) — spec 👁️ R (read-only) nhưng có nút `+ Tạo mới` trên toolbar → QTHT có thể tạo TVCS (admin leak)

---

## 4. Phạm vi test

### Entity đã test
- ✅ **TU_VAN_CHUYEN_SAU** (entity chính) — test menu access + toolbar button cho 11 role.

### Entity KHÔNG test được
| Entity | Lý do |
|--------|-------|
| PHIEN_TU_VAN | Cần vào detail TVCS mới có, 0 bản ghi data → không vào được detail |
| LICH_SU_TRAO_DOI_TV | Là tab trong detail PHIEN → blocked cùng |
| KHO_CAU_HOI | Không có UI riêng trong module Tư vấn chuyên sâu. Matrix §12 list nhưng SRS §7.13 thuộc Tư vấn Nhanh. **Cần BA confirm.** |

### Hạn chế kết quả
- **Data empty** — QTHT vào được list nhưng 0 bản ghi → không kiểm được icon Sửa/Xóa per row
- **8/11 role menu disabled** → không kiểm được CRUD/scope thực tế
- **32/44 ô ma trận** (73%) không verify được do UI gating

---

## 5. Đề xuất

**Ưu tiên 1 — Fix BUG-M8.3-002 (Critical):**
FE mở ability-rule menu "Tư vấn chuyên sâu" cho các role có quyền theo matrix §12. BE verify permission check `/tv-chuyen-sau/*`. Ước lượng: 1-2 giờ dev. Sau fix → 32 ô ma trận mới test được.

**Ưu tiên 2 — Seed data:**
Dev seed ≥2 TVCS/state (7 state × 2 = 14 bản ghi) để test PHIEN_TU_VAN + LICH_SU_TRAO_DOI_TV qua detail view.

**Ưu tiên 3 — BA confirm:**
Entity `KHO_CAU_HOI` thuộc FR-12 hay FR-13 — cập nhật permission-matrix.md cho phù hợp.

**Ưu tiên 4 — Fix BUG-M8.3-001 (Major):**
Fix chung với batch QTHT write UI 5 module (M5/6/7/8.1/8.3). 1 dòng ability-rule.

---

## 6. Quy trình test (tham khảo)

Quy trình đã áp dụng (sau 2 vòng retry để tìm pattern stable):

```bash
# Cho mỗi role:
1. browse stop + kill playwright/chromium/browse-server
2. rm -rf ~/.gstack/chromium-profile   # CRITICAL — tránh session carry giữa role
3. Atomic chain $B chain:
   - goto /login
   - fill username + password
   - click submit
   - sleep 4.5s
   - type "666666"   # OTP bypass
   - sleep 10s
   - click "Quản lý tư vấn"   # sidebar, KHÔNG dùng goto direct URL
   - sleep 2s
   - click "Tư vấn chuyên sâu"
   - sleep 6s
   - screenshot + JS capture avatar + buttons + hasCreate
4. Verify avatar regex match với role expected
```

**Key learning:**
- `goto /tv-chuyen-sau/danh-sach` **trực tiếp** sau login **làm mất auth cookie** → redirect /login. **Phải click sidebar.**
- Không xóa `chromium-profile` → session carry giữa role → avatar sai.
- Chain >15 step dễ timeout → chia nhỏ theo role.

---

**Artifacts:**
- [bug-report-section-8.3.md](bug-report-section-8.3.md) — chi tiết 2 bug + steps to reproduce
- [screenshots/](screenshots/) — 18 screenshots (11 primary R-01..R-11 + 7 intermediate)
