# Permission Test Report — [MODULE NAME] (Section [X.Y])

**Ngày:** [YYYY-MM-DD] · **Tester:** [Tên/QA Automation] · **Env:** [URL test]
**Phương pháp:** Browse UI / API / cả hai · **Spec:** [permission-matrix.md §X](../../../permission-matrix.md)

---

## 1. Kết quả tổng quan

> **Mục đích:** 1 glance là biết module này có qua không.

| Tổng role | ✅ PASS | ❌ FAIL | Tỷ lệ PASS | Verdict |
|-----------|---------|---------|------------|---------|
| **[N]** | **[X]** | **[Y]** | **[Z%]** | ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL |

### Bug tóm tắt

| Bug ID | Severity | Title | Role/ô ảnh hưởng |
|--------|----------|-------|-------------------|
| BUG-PERM-M[X.Y]-001 | Critical/Major/Minor | [1 câu mô tả ngắn] | [role × entity] |
| BUG-PERM-M[X.Y]-002 | Critical/Major/Minor | [1 câu mô tả ngắn] | [role × entity] |

→ Chi tiết bug: [bug-report-section-[X.Y].md](bug-report-section-[X.Y].md)

---

## 2. Bảng kết quả chi tiết — [N] role

> **Cách đọc:** Mỗi role login → thao tác test → quan sát kết quả. Đọc từ trái sang phải để biết role kỳ vọng gì và thực tế ra sao.

| # | Account | Role SRS | Expected (matrix §X) | Actual UI/Behavior | Verdict | Evidence |
|---|---------|----------|----------------------|--------------------|---------|----------|
| 1 | qtht_tw | QTHT | [👁️ R / ✅ CRUD / ❌] | [1 dòng mô tả thực tế] | ✅ PASS / ❌ FAIL (bug ID) | [screenshot-link](screenshots/R-01-qtht_tw.png) |
| 2 | canbo_tw | CB_NV_TW | | | | |
| 3 | canbo_bn | CB_NV_BN | | | | |
| 4 | canbo_tinh | CB_NV_DP | | | | |
| 5 | lanhdao_tw | CB_PD_TW | | | | |
| 6 | lanhdao_bn | CB_PD_BN | | | | |
| 7 | lanhdao_dp | CB_PD_DP | | | | |
| 8 | dn_user | DN | | | | |
| 9 | nht_user | NHT | | | | |
| 10 | tvv_user | TVV | | | | |
| 11 | chuyengia_user | CG | | | | |

### Giải thích ký hiệu

- ✅ **PASS** = UI/API match spec (role có quyền đúng spec, hoặc bị chặn đúng khi spec ❌)
- ❌ **FAIL** = UI/API sai spec (role có quyền nhưng không truy cập được, hoặc role không quyền nhưng thấy dữ liệu/nút)
- ⚠️ **PARTIAL** = một phần match, một phần sai (ghi rõ phần nào fail)
- **Expected** icons (matrix): 👁️ R (read-only) · ✅ CRUD* (full CRUD scoped) · 📝 RU* (read+update scoped) · 🔌 C† (API only) · ❌ (không quyền)

---

## 3. Nhóm role theo kết quả

> **Mục đích:** gom role cùng pattern để dev fix batch.

### ✅ PASS ([X] role)
- **[Account]** ([Role]) — [1 dòng lý do PASS]
- **[Account]** ([Role]) — [1 dòng lý do PASS]

### ❌ FAIL — [Mô tả bug pattern 1] ([N] role) → **BUG-PERM-M[X.Y]-00[N]** [Severity]
- **[Account 1]** (Role) — spec [kỳ vọng] nhưng [thực tế]
- **[Account 2]** (Role) — spec [kỳ vọng] nhưng [thực tế]
- ...

### ❌ FAIL — [Mô tả bug pattern 2] ([N] role) → **BUG-PERM-M[X.Y]-00[N]** [Severity]
- **[Account]** (Role) — spec [kỳ vọng] nhưng [thực tế]

---

## 4. Phạm vi test

### Entity đã test
| Entity | # ô đã verify | Ghi chú |
|--------|---------------|---------|
| [ENTITY_1] | [N/11] | [Mô tả ngắn: menu access, CRUD buttons, data scoping] |
| [ENTITY_2] | [N/11] | |

### Entity KHÔNG test được
| Entity | Lý do |
|--------|-------|
| [ENTITY_X] | [Data empty / menu blocked cho role có quyền / không có UI riêng / cần BA confirm...] |

### Hạn chế kết quả
- **Data readiness:** [còn thiếu state nào? bao nhiêu bản ghi?]
- **Role bị block:** [bao nhiêu role không test được quyền thực tế vì menu disabled?]
- **Tỷ lệ ô ma trận verify được:** [X/(N×11) ô = Y%]

---

## 5. Đề xuất fix / next steps

> **Mục đích:** dev biết fix gì trước, QA biết re-test khi nào.

**Ưu tiên 1 — [Bug Critical gì? Unblock bao nhiêu ô?]:**
[1-2 dòng mô tả fix. Ước lượng effort.]

**Ưu tiên 2 — [Seed data / config gì?]:**
[1-2 dòng mô tả.]

**Ưu tiên 3 — [BA/PM confirm gì?]:**
[1-2 dòng mô tả.]

**Sau khi fix → re-test:**
- [ ] [Role/entity nào cần verify lại?]
- [ ] [Cross-module impact nào cần check?]

---

## 6. Quy trình test đã áp dụng

> **Mục đích:** tester sau có thể lặp lại kết quả.

### Quy trình chuẩn per role

```bash
# Cho mỗi role:
1. Cleanup browse:
   $B stop; pkill -9 -f "browse-server|playwright|chrome-headless-shell"
   rm -rf ~/.gstack/chromium-profile   # CRITICAL — tránh session carry giữa role

2. Atomic chain ($B chain):
   - goto /login
   - fill username + password
   - click submit
   - sleep 4.5s
   - type "666666"   # OTP bypass
   - sleep 10s
   - click "[Menu cha]"   # sidebar, KHÔNG dùng goto direct URL (mất auth cookie)
   - click "[Menu con]"
   - sleep 6s
   - screenshot + JS capture { avatar, buttons[], hasCreate, tableRows }

3. Verify: avatar regex match role expected
4. Observe: buttons visible vs spec, data scope (nếu có data), redirect behavior
```

### Key learnings (từ session test)

- **`goto /[route]` trực tiếp sau login làm mất auth cookie** → redirect /login. Phải click sidebar.
- **Không xóa `~/.gstack/chromium-profile`** → session carry giữa role → avatar role cũ.
- **Chain >15 step dễ timeout** → chia nhỏ theo role, 1 chain/role.
- **OTP `666666` bypass** hoạt động cho mọi account (env config tạm thời).
- **`/403` sau login là expected** cho role CB_* (theo CLAUDE.md Rule 5) — không nhầm thành auth failure.

---

## 7. Artifacts

- **Chi tiết bug + repro steps:** [bug-report-section-[X.Y].md](bug-report-section-[X.Y].md)
- **Screenshots:** [screenshots/](screenshots/) — [N] ảnh (R-01..R-NN per role + baseline intermediate)
- **Seed checklist (GĐ 1):** [seed-checklist-[module].md](../../[module]/seed-checklist-[module].md)
- **Workflow test report (GĐ 2):** [workflow-test-report-[module].md](../../[module]/workflow-test-report-[module].md)
- **Test strategy ref:** [test-strategy.md §5 Ma trận phân quyền](../../../test-strategy.md)
- **Permission matrix:** [permission-matrix.md §X](../../../permission-matrix.md)

---

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | [phút] |
| Số chain call | [N] (thành công: X, timeout: Y) |
| Số screenshot | [N] |
| Browser mode | headless / headed |
| Crashes encountered | [N] (đã cleanup + retry theo Rule 6/7) |

---

<!-- ========================================================== -->
<!-- HƯỚNG DẪN DÙNG TEMPLATE                                    -->
<!-- ========================================================== -->

<!--
### Checklist điền template

1. Thay toàn bộ `[...]` placeholder
2. Section 1 (Tổng quan): phải điền TRƯỚC — đây là phần user đọc đầu tiên
3. Section 2 (Bảng chi tiết): 1 row/role, 1 dòng Actual mô tả đủ ý (không quá 15 từ)
4. Section 3 (Nhóm kết quả): gom role theo bug pattern để dev thấy batch fix
5. Screenshots: đặt tên `R-NN-{account}.png` để match với cột Evidence
6. Verdict rubric:
   - ✅ PASS = actual = expected
   - ❌ FAIL = actual ≠ expected (ghi bug ID)
   - ⚠️ PARTIAL = một phần match (ghi rõ)
7. Bug ID format: `BUG-PERM-M{X.Y}-{NNN}` (X.Y = section matrix, NNN = số tăng dần)

### Nguyên tắc viết

- **Ngắn:** 1 dòng Actual không quá 15 từ. Chi tiết đẩy xuống bug report.
- **Có bằng chứng:** mọi verdict phải link screenshot/log.
- **Không lặp:** nếu 3 role cùng bug → gom vào 1 nhóm ở Section 3, không viết lại 3 lần ở Section 2.
- **Định lượng:** luôn có số (N/11 role, X/44 ô, Y% pass).
- **User đọc 30 giây hiểu:** Section 1 đủ để quyết định PASS/FAIL module. Section 2-3 để deep dive.

### Khi nào KHÔNG dùng template này

- Test chỉ 1 role đơn lẻ → dùng [functional-test-report-template.md](functional-test-report-template.md)
- Test functional (workflow/CRUD) không liên quan phân quyền → dùng functional template
- Smoke test → dùng [smoke-test-report-template.md](smoke-test-report-template.md)
-->
