# QA Tracking — PM HTPLDN

> File theo dõi trạng thái test + gửi report cho dev, theo từng round.
> **Cập nhật mỗi lần:** chạy xong 1 module → tick cột "Đã test"; gửi report cho dev → tick cột "Đã gửi dev" + điền ngày + kênh.

**Ngày cập nhật gần nhất:** 2026-04-20 — **Round 3 bắt đầu**. Archive Round 2 vào `_archive/round2_2026-04-16/`, reset §A/§B/§C cho Round 3. §D TC chi tiết giữ nguyên (accumulate qua round). Nhật ký gửi dev + snapshot Round 2 giữ ở cuối file để so sánh regression. **Cập nhật R3.4 (21:40 2026-04-20):** Permission FR-10 QTHT re-verify UI-only — 3 bug FE (1 Critical + 2 Major), coverage 70/99 UI direct + 29 inferred.

> **Về checkbox:** Markdown table không support checkbox clickable như GitHub tasklist.
> → File này dùng `[x]` = đã làm / `[ ]` = chưa làm. Sửa 1 ký tự (thêm/xóa `x`) là xong.
> VSCode có extension "Markdown Checkbox" / "Markdown All in One" cho phép click toggle trong preview.

---

## Quy ước cột

| Cột | Ý nghĩa |
|-----|---------|
| **Module** | Tên module theo test-strategy §1.1 |
| **Đã test** | ✅ xong / 🟡 đang chạy / ❌ chưa chạy |
| **Report path** | Link tới folder report của module trong round hiện tại |
| **# Bug** | Tổng số bug phát hiện (điền khi có report) |
| **Đã gửi dev** | `[x]` đã gửi / `[ ]` chưa gửi — sửa 1 ký tự để tick |
| **Ngày gửi** | YYYY-MM-DD — ngày gửi cho dev |
| **Kênh** | Slack / Email / Linear / Jira — cách gửi |
| **Trạng thái fix** | 🔧 đang fix / ✅ đã fix / 🔁 đang retest / — chưa có |
| **Ghi chú** | Ghi chú thêm (vd: Blocker BUG-OTP đã unblock, đang chờ retest round 3) |

**Trạng thái tổng quan:**
- 🟢 = Đã test + đã gửi dev + dev đã fix
- 🟡 = Đã test + đã gửi dev + chưa fix xong
- 🟠 = Đã test nhưng **chưa gửi dev** (cần gửi gấp)
- 🔴 = Chưa test (cần lên lịch)

---

## Round hiện tại: **Round 3** (deploy 2026-04-20)

### Tổng quan 16 module SRS — trạng thái artifact (Round 3)

> Liệt kê **toàn bộ 16 module SRS** theo thứ tự FR-01 → FR-16. Mọi bảng ở dưới cũng follow thứ tự này.
> - **Spec funtion** = file `output/funtion/7.X-*.md` (test plan chi tiết)
> - **Spec smoke** = file `output/smoke-specs/6.X-*.md` (smoke spec) + `output/smoke/6.X-*.md` (state machine)
> - **Test report Round 3** = `output/qa-reports/round3-2026-04-20/`
> - **Round 2 archived:** `output/qa-reports/_archive/round2_2026-04-16/` — dùng so sánh regression

| # | FR | Module | Spec funtion | Spec smoke | Smoke report | Functional report | Permission report | TC chi tiết | Trạng thái tổng |
|---|----|--------|--------------|------------|--------------|--------------------|-------------------|--------------|------------------|
| 1 | FR-01 | Dashboard | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 2 | FR-02 | Hỏi đáp Pháp luật `[v3.5]` | ✅ | ✅ + SM | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ✅ Đã viết (R2) | 🔴 Chưa chạy Round 3 |
| 3 | FR-03 | Đào tạo, Tập huấn | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 4 | FR-04 | Chuyên gia/TVV | ✅ | ✅ + SM | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | 🟡 Folder rỗng | 🔴 Chưa chạy Round 3 |
| 5 | FR-05 | Vụ việc HTPL | ✅ | ✅ + SM | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 6 | FR-06 | Chi trả Chi phí ✏️ v3.5 | ✅ v3.5 sync 14 FR | ✅ v3.5 11 paths SM-CHITRA | 🔴 chưa chạy | 🔴 chưa chạy (35 TC) | 🔴 chưa chạy (4 entity × 7 role) | ❌ | 🟠 PREP DONE — chờ BA Q1+Q2 + LGSP integration |
| 7 | FR-07 | Quản lý Doanh nghiệp | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 8 | FR-08 | Đánh giá Hiệu quả | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 9 | FR-09 | Biểu mẫu | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 10 | FR-10 | Quản trị Hệ thống | ✅ | ✅ + SM | 🟡 Smoke Tài khoản CONDITIONAL PASS (WARN) [round3/QTHT/](qa-reports/round3-2026-04-20/QTHT/) | 🟡 CONDITIONAL PASS [round3/QTHT/functional-test-report.md](qa-reports/round3-2026-04-20/QTHT/functional-test-report.md) 6 bug (2M+4m) | ⚠️ PASS WITH ISSUES [round3/QTHT/permission/](qa-reports/round3-2026-04-20/QTHT/permission/) 3 bug (1C+2M) | ✅ 4/4 folder (R2) | 🟡 Smoke 4 bug + Functional 22/32 PASS (100% P0), 5 BLOCKED chờ dev seed; Permission ⚠️ 44/99 ô |
| 11 | FR-11 | Báo cáo Thống kê | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 12 | FR-12 | TV Chuyên sâu | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 13 | FR-13 | Tư vấn Nhanh | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 14 | FR-14 | Hợp đồng Tư vấn | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 15 | FR-15 | Chương trình HTPLDN | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |
| 16 | FR-16 | API Kết nối Chia sẻ | ✅ | ✅ | 🔴 chưa chạy | 🔴 chưa chạy | 🔴 chưa chạy | ❌ | 🔴 Chưa chạy Round 3 |

**Chú thích trạng thái tổng:** 🟢 hoàn chỉnh / 🟡 đang chạy hoặc một phần / 🔴 chặn hoặc chưa chạy

---

### A. Functional Test — 16 module (Round 3)

| FR | Module | Đã test | Report path | # Bug | Đã gửi dev | Ngày gửi | Kênh | Trạng thái fix | Ghi chú |
|----|--------|---------|-------------|-------|-----------|----------|------|----------------|---------|
| FR-01 | Dashboard | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-02 | Hỏi đáp Pháp luật `[v3.5]` | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-03 | Đào tạo, Tập huấn | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-04 | Chuyên gia/TVV | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-05 | Vụ việc HTPL | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-06 | Chi trả Chi phí ✏️ v3.5 | 🟠 PREP DONE 2026-05-06 | [funtion/7.6-chi-tra-chi-phi.md](funtion/7.6-chi-tra-chi-phi.md) (35 TC) | 0 (2 BA Q ⏳) | `[ ]` | — | — | — | v3.5 sync 10 file QA done. R7.7.12.1 smoke regression IMPACT chạy được ngay. R7.6.1 + R7.7.12.2/3 conditional LGSP. CT-006 + CT-021 ⏳ chờ BA Q1+Q2. Xem [ba-questions-fr06](qa-reports/round7-2026-05-06/bug-reports/ba-questions-fr06-2026-05-06.md). |
| FR-07 | Quản lý Doanh nghiệp | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-08 | Đánh giá Hiệu quả | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-09 | Biểu mẫu | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-10 | Quản trị Hệ thống | 🟡 CONDITIONAL PASS | [round3-2026-04-20/QTHT/functional-test-report.md](qa-reports/round3-2026-04-20/QTHT/functional-test-report.md) | 6 (2M+4m) + 3 OBS | `[ ]` | — | — | — | 22/32 PASS (100% P0), 1 FAIL (QT-026 audit old/new), 4 PARTIAL (UI), 5 BLOCKED chờ dev seed |
| FR-11 | Báo cáo Thống kê | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-12 | TV Chuyên sâu | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-13 | Tư vấn Nhanh | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-14 | Hợp đồng Tư vấn | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-15 | Chương trình HTPLDN | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-16 | API Kết nối Chia sẻ | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |

### B. Smoke Test — 16 module (Round 3)

| FR | Module | Kết quả | Report path | # Bug | Đã gửi dev | Ngày gửi | Kênh | Trạng thái fix | Ghi chú |
|----|--------|---------|-------------|-------|-----------|----------|------|----------------|---------|
| FR-01 | Dashboard | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-02 | Hỏi đáp Pháp luật `[v3.5]` | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-03 | Đào tạo, Tập huấn | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-04 | Chuyên gia/TVV | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-05 | Vụ việc HTPL | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-06 | Chi trả Chi phí | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-07 | Quản lý Doanh nghiệp | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-08 | Đánh giá Hiệu quả | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-09 | Biểu mẫu | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-10 | Quản trị Hệ thống | 🟡 Tài khoản: CONDITIONAL PASS (WARN) | [round3-2026-04-20/QTHT/smoke-test-report.md](qa-reports/round3-2026-04-20/QTHT/smoke-test-report.md) | 4 (1M+3m) | `[ ]` | — | — | — | Module Tài khoản smoke PASS w/ 4 findings — unlock Lệnh 2 (xem caveat spec enum) |
| FR-11 | Báo cáo Thống kê | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-12 | TV Chuyên sâu | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-13 | Tư vấn Nhanh | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-14 | Hợp đồng Tư vấn | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-15 | Chương trình HTPLDN | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-16 | API Kết nối Chia sẻ | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |

### C. Permission Matrix — 16 module (Round 3)

> Permission test thường làm theo "Section" (1-8 trong file [permission-matrix.md](permission-matrix.md)). Bảng dưới map **1 row = 1 module** để đồng bộ thứ tự với §A/§B. Cột "Section" chỉ rõ report phân quyền này nằm ở Section nào của ma trận.

| FR | Module | Section ma trận | Đã test | Report path | # Bug | Đã gửi dev | Ngày gửi | Kênh | Trạng thái fix | Ghi chú |
|----|--------|-----------------|---------|-------------|-------|-----------|----------|------|----------------|---------|
| FR-01 | Dashboard | — | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | Chưa có entity trong permission-matrix |
| FR-02 | Hỏi đáp Pháp luật `[v3.5]` | Section 2 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-03 | Đào tạo, Tập huấn | Section 8.1 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-04 | Chuyên gia/TVV | Section 3 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-05 | Vụ việc HTPL | Section 4 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-06 | Chi trả Chi phí | Section 5 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-07 | Quản lý Doanh nghiệp | Section 6 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-08 | Đánh giá Hiệu quả | Section 8.2 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-09 | Biểu mẫu | Section 7 (BIEU_MAU) | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-10 | Quản trị Hệ thống | Section 1 | ❌ FAIL (R3.4 UI-only re-verify) | [round3-2026-04-20/QTHT/permission/bug-report-section-10.md](qa-reports/round3-2026-04-20/QTHT/permission/bug-report-section-10.md) · [report](qa-reports/round3-2026-04-20/QTHT/permission/permission-test-report-section-10.md) | 3 (1C + 2M, all FE-only) | `[ ]` | — | — | — | **R3.4 UI-only (2026-04-20):** UI direct 70/99 ô (71%) + 29 inferred. **3 bug FE**: BUG-M10-001 Critical (Portal NHT/TVV/CG /403 sidebar leak 23 items = 18 ô FAIL), BUG-M10-002 Major (6 role BN/DP click Danh mục no navigate = 6 ô FAIL), BUG-M10-003 Major (CB_NV menu Tài khoản visible spec ❌ = 9 ô UX). Test account: 15 main + 6 isolation (DI-04/DI-05 cross-tenant). UI-only coverage giảm so R3.3 hybrid (99/99 incl 80 API) do constraint không test API. BE permission rules KHÔNG verify session này. |
| FR-11 | Báo cáo Thống kê | Section 7 (BAO_CAO) | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-12 | TV Chuyên sâu | Section 8.3 | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | |
| FR-13 | Tư vấn Nhanh | — | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | Chưa có entity trong permission-matrix (cần bổ sung từ SRS §3.4.2) |
| FR-14 | Hợp đồng Tư vấn | — | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | Có entity HOP_DONG_TU_VAN trong §8.3 |
| FR-15 | Chương trình HTPLDN | — | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | Có entity trong permission-matrix §8.4 |
| FR-16 | API Kết nối Chia sẻ | — | 🔴 chưa chạy | — | — | `[ ]` | — | — | — | Chưa có entity trong permission-matrix (cần bổ sung từ SRS §3.4.2) |

### D. TC chi tiết field-level (Tầng 2) — 16 module

| FR | Module | Đã tạo TC | File TC | Ghi chú |
|----|--------|-----------|---------|---------|
| FR-01 | Dashboard | 🔴 | — | |
| FR-02 | Hỏi đáp Pháp luật `[v3.5]` | ✅ | [test-cases/hoi-dap/](test-cases/hoi-dap/) | 7 file TC (01-07) + `edge-case-review-FR02.md` + `00-test-plan-overview.md` — viết xong 2026-04-18 |
| FR-03 | Đào tạo, Tập huấn | 🔴 | — | |
| FR-04 | Chuyên gia/TVV | 🟡 folder rỗng | [test-cases/CG-TVV/](test-cases/CG-TVV/) | Folder đã tạo nhưng chưa có file TC nào |
| FR-05 | Vụ việc HTPL | 🔴 | — | |
| FR-06 | Chi trả Chi phí | 🔴 | — | |
| FR-07 | Quản lý Doanh nghiệp | 🔴 | — | |
| FR-08 | Đánh giá Hiệu quả | 🔴 | — | |
| FR-09 | Biểu mẫu | 🔴 | — | |
| FR-10 | Quản trị Hệ thống | ✅ | [test-cases/QTHT/](test-cases/QTHT/) | 4/4 folder con: Cấu hình HT (4 file), Danh mục (4 file), Nhật ký HT (1 file), Tài khoản phân quyền (4 file) — mỗi folder có `00-test-plan-overview.md` |
| FR-11 | Báo cáo Thống kê | 🔴 | — | |
| FR-12 | TV Chuyên sâu | 🔴 | — | |
| FR-13 | Tư vấn Nhanh | 🔴 | — | |
| FR-14 | Hợp đồng Tư vấn | 🔴 | — | |
| FR-15 | Chương trình HTPLDN | 🔴 | — | |
| FR-16 | API Kết nối Chia sẻ | 🔴 | — | |

---

## Tổng quan Round 3

| Loại test | Tổng 16 module | Đã test | Đã gửi dev (có bug) | Chưa gửi dev | Chưa test / Blocked |
|-----------|----------------|---------|---------------------|--------------|---------------------|
| Functional | 16 | 0 (FR-10 đang chạy) | 0 | 0 | 16 |
| Smoke | 16 | 0 | 0 | 0 | 16 |
| Permission | 16 | 0 | 0 | 0 | 16 |
| TC chi tiết | 16 | 2 (FR-02, 10 từ R2, không reset) | — | — | 13 |

> **Cần action:**
> - 🟡 **Đang chạy:** Functional FR-10 QTHT (kick-off Round 3)
> - 🔴 **Ưu tiên retest các module Round 2 đã FAIL** (theo thứ tự severity):
>   - **Blocker/Critical BE:** FR-06 (2 Blocker + 3 Critical), FR-08 (3 BE endpoints missing), FR-15 (8 transition 403 + soft-delete leak), FR-11 (API double-wrap)
>   - **Smoke FAIL chặn functional:** FR-09 Biểu mẫu, FR-11 Báo cáo, FR-12 TV Chuyên sâu, FR-13 Tư vấn Nhanh, FR-01 Dashboard
>   - **Pattern recurring:** QTHT write UI trên entity nghiệp vụ (5-6 module), isolation BN/DP leak (4-5 module) — fix 1 batch có thể unblock đa module
> - 📊 **Xem baseline Round 2 ở section "Round cũ — lưu trữ"** để so sánh regression

---

## Nhật ký gửi dev (chronological)

> Mỗi lần gửi report cho dev → ghi 1 dòng vào đây để lưu lịch sử.

| Ngày | Module/Section | Người gửi | Kênh | Link ticket/thread | Ghi chú |
|------|---------------|-----------|------|--------------------|---------|
| **— Round 3 (2026-04-20) —** | | | | | **(entry mới điền phía trên Round 2)** |
| 2026-04-20 | Permission Matrix — QTHT (FR-10) — R3.4 UI-only re-verify | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 6 (R3.4 Lệnh riêng UI-only) — **❌ FAIL, 3 bug FE (1 Critical + 2 Major), 70/99 UI direct coverage**. Constraint user: Browse UI only, không test API. BUG-PERM-M10-001 **Critical P0** (Portal NHT/TVV/CG login → /403 nhưng sidebar render đủ 23 items gồm QTHT + 4 submenu → info disclosure 18 ô FAIL). BUG-PERM-M10-002 **Major P1** (6 role BN/DP click "Danh mục dùng chung" → URL giữ /dashboard, không navigate vào page read-only dù spec 👁️R → 6 ô FAIL). BUG-PERM-M10-003 **Major P1** (CB_NV × 3 sidebar render menu "Tài khoản & phân quyền" dù spec ❌ → 9 ô UX leak). **Evidence:** 16 UIR-* screenshots mới session này + 49 R-* kế thừa R3.0-R3.2 = 65 ảnh tổng. **Coverage trade-off:** 70/99 UI direct (71%) < R3.3 hybrid 99/99 vì không có API sweep verify BE. **BE permission rules KHÔNG verify session này** (out of scope UI-only). 3 bug đều FE layer — 1 FE commit fix ability-rule sidebar có thể unblock BUG-001 + 003 (18 + 9 = 27 ô), 1 FE commit route guard fix BUG-002 (6 ô). **Crash residual ~20-40%** per role do Rule 10 4th-click + OTP /dashboard memory heavy. Dùng `$B connect` headed mode + sleep 5s sau OTP + 3 click cap/chain. Report: [round3-2026-04-20/QTHT/permission/permission-test-report-section-10.md](qa-reports/round3-2026-04-20/QTHT/permission/permission-test-report-section-10.md) + [bug-report-section-10.md](qa-reports/round3-2026-04-20/QTHT/permission/bug-report-section-10.md). |
| 2026-04-20 | Smoke test — QTHT / Module Tài khoản (FR-10) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 5 (Round 3 kick-off) — **CONDITIONAL PASS (WARN), 4 bug (1 Major + 3 Minor) + 1 Observation**. Login qtht_tw + nav /quan-tri/tai-khoan PASS, table render 15 user thực. BUG-SMOKE-TK-001 Major P1: FE gửi `trangThai=CHO_PHAN_QUYEN` → BE 422 Validation failed, lặp 2x/lần page load (FE/BE enum mismatch — SRS chưa rõ state `VO_HIEU_HOA` vs `CHO_PHAN_QUYEN`). BUG-SMOKE-TK-002/003/004 Minor: thiếu tab `Vô hiệu hóa`, thiếu cột `Ngày tạo`/`Ngày kích hoạt`, thiếu filter `Cấp` + button `Xuất Excel`/`Làm mới` vs spec 6.10. OBS-TK-001 label `+ Thêm mới` thay `+ Tạo tài khoản`. **Unlock Lệnh 2: ✅ YES w/ caveat** — làm rõ với PM state enum chuẩn trước khi Lệnh 4 viết TC permission/workflow. Retry log: 1 SELECTOR OUTDATED (Rule 4 `.nav-item` fix) + 1 HARNESS session reset (Rule 8 atomic chain fix) — KHÔNG real crash. Report: [round3-2026-04-20/QTHT/smoke-test-report.md](qa-reports/round3-2026-04-20/QTHT/smoke-test-report.md) + [bug-report-smoke-test.md](qa-reports/round3-2026-04-20/QTHT/bug-report-smoke-test.md). |
| 2026-04-20 | Functional Test — QTHT (FR-10) — Lệnh 4 | `[ ]` chờ gửi | _(điền)_ | _(điền)_ | Đợt 5 — **🟡 CONDITIONAL PASS, 6 bug (2 Major + 4 Minor) + 3 OBS**. 22/32 PASS (100% P0 Pass), 1 FAIL (QT-026 audit log thiếu oldValue/newValue — BR-DATA-05), 4 PARTIAL (QT-012 soft delete not queryable, QT-021/022 phân quyền cần UI, QT-003 w/ OBS auto-lock), 5 BLOCKED (QT-006/007/008/013/024 chờ dev seed). **Bug chính:** BUG-QT-001 Major (lock msg "Vui lòng thử lại sau 0 phút" — value=0 không đúng), BUG-QT-002 Major (audit log thiếu oldValue/newValue vi phạm BR-DATA-05 compliance), BUG-QT-003/004 Minor (API contract: PATCH data=null, search/sortOrder param naming, PATCH vs PUT update endpoint), BUG-QT-005 Minor (SLA canhBao2=90% vs spec 80%), BUG-QT-006 Minor (audit entityType=UNKNOWN cho sub-resource PATCH). OBS-QT-001/002/003 đã được ghi nhận trước (auto-lock counter, enum CHO_PHAN_QUYEN vs VO_HIEU_HOA, đơn vị flat list). Report: [round3-2026-04-20/QTHT/functional-test-report.md](qa-reports/round3-2026-04-20/QTHT/functional-test-report.md) + [bug-report-functional.md](qa-reports/round3-2026-04-20/QTHT/bug-report-functional.md). Verdict: sau fix 2 Major + unlock 5 TC (dev seed) = PASS. |
| 2026-04-20 | Dev Seed Request — QTHT 5 TC blocked | `[ ]` chờ gửi | _(điền)_ | _(điền)_ | Đợt 5 — Yêu cầu BE/DevOps unlock 5 TC blocked không seed được qua API: QT-006 (env `SESSION_IDLE_TIMEOUT_SECONDS=60`), QT-024 (env `RESET_TOKEN_LIFETIME_SECONDS=60`), QT-013 (SQL seed 4 record cross-module VV/HD/KH/DN tham chiếu danh mục), QT-007/008 (confirm BR-AUTH-07 ngưỡng 3/1 đã implement → QA tự test Postman). Effort ước dev: ~2.5h. Kèm 3 observation bổ sung: OBS-QT-001 (auto-lock counter cross-creation), OBS-QT-002 (enum CHO_PHAN_QUYEN vs VO_HIEU_HOA — cần PM quyết), OBS-QT-003 (đơn vị flat list capDonVi=null, không phải tree 3 cấp). Report: [round3-2026-04-20/QTHT/dev-seed-request.md](qa-reports/round3-2026-04-20/QTHT/dev-seed-request.md). |
| 2026-04-20 | Data Readiness — QTHT (FR-10) — Lệnh 3 seed DONE | _(không cần gửi, chỉ report nội bộ)_ | — | — | Đợt 5 — **🟢 SEED HOÀN TẤT (6 ĐỦ / 0 THIẾU / 3 BLOCKED)** — Unlock 27/32 TC Lệnh 4. Seed xong 4 item: `qa_chokichhoat_01/02/03` (CHO_KICH_HOAT), `qa_tamkhoa_01/02/03` (TAM_KHOA manual), `qa_autolock_01` (TAM_KHOA auto-lock), 5 `TC-HQ-01..05` (TIEU_CHI_DG_HIEU_QUA SUM trọngSo 100%), 3 `TC-CP-SN/NH/VU` (TIEU_CHI_DG_CHI_PHI NĐ18). TK total 85→92, audit 118→167. **Observation OBS-QT-001 (Minor):** `qa_autolock_01` trả "tạm khóa do sai quá nhiều" ngay lần 1 — có thể counter share cross-creation theo IP hoặc BR-AUTH-07 ngưỡng <5; cần verify BE. Kết quả cuối trangThai=TAM_KHOA vẫn đúng. **5 TC pre-blocked Lệnh 4:** QT-006/024 (TIME_TRAVEL), QT-007/008 (EXTERNAL_API — cần Postman/k6), QT-013 (WORKFLOW_STUCK — chờ FR-02/03/05). Report: [round3-2026-04-20/QTHT/data-readiness-report.md](qa-reports/round3-2026-04-20/QTHT/data-readiness-report.md). |
| 2026-04-20 | Data Readiness — QTHT (FR-10) — Lệnh 2 count + gap | _(không cần gửi, chỉ report nội bộ)_ | — | — | Đợt 5 — **🟡 PARTIAL (3 ĐỦ / 3 THIẾU / 3 BLOCKED)**. API-driven count qua `qtht_tw` JWT. **ĐỦ:** #1 HOAT_DONG 85 TK cover 14 role (QTHT/CB/LD × TW/BN/DP + TVV/CG/NHT/DN/GV), phân bố 49 TW + 18 BN + 18 DP; #7 vai trò có 11-228 quyền mỗi role; #9 audit log 118 entries. **THIẾU:** #2 CHO_KICH_HOAT = 0 (cần seed 3 TK), #3 TAM_KHOA = 0 (cần seed 3 TK, phương án B login 5 sai pass auto-lock gộp #3+#4), #5 danh mục `TIEU_CHI_DG_HIEU_QUA`=0 + `TIEU_CHI_DG_CHI_PHI`=0 (12/14 loại đủ). **🔒 BLOCKED §7.0.3:** #6 DM tham chiếu (`WORKFLOW_STUCK` — cross-module entities VV/HD/KH/DN=0), #8 session ≥3 phiên (`EXTERNAL_API` — harness 1 context), +pre-block Lệnh 4 QT-006/024 (`TIME_TRAVEL`). **Observation:** 84 đơn vị `capDonVi=null` + `donViId=null` (flat list, KHÔNG phải tree 3 cấp như SM-QT-12 spec) — cần verify PM. **Unlock Lệnh 4:** 15/32 TC chạy ngay; +13 TC sau seed ~15 phút; 5 TC pre-blocked (QT-006/007/008/013/024). Report: [round3-2026-04-20/QTHT/data-readiness-report.md](qa-reports/round3-2026-04-20/QTHT/data-readiness-report.md). |
| **— Round 2 (2026-04-16 → 2026-04-20) —** | | | | | |
| 2026-04-18 | Smoke test | _(điền)_ | _(điền)_ | _(điền)_ | |
| 2026-04-18 | Quản trị Hệ thống (QTHT) | _(điền)_ | _(điền)_ | _(điền)_ | Lần 1: gửi `bug-report-qtht-final.md` |
| 2026-04-18 | Hỏi đáp Pháp luật `[v3.5]` | _(điền)_ | _(điền)_ | _(điền)_ | |
| 2026-04-18 | Chuyên gia/TVV | _(điền)_ | _(điền)_ | _(điền)_ | |
| 2026-04-18 | Doanh nghiệp | _(điền)_ | _(điền)_ | _(điền)_ | |
| 2026-04-18 | Chi trả Chi phí | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 2 |
| 2026-04-18 | Vụ việc HTPL | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 2 |
| 2026-04-18 | Phân quyền Section 1 — QTHT | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 2 |
| 2026-04-18 | Phân quyền Section 2 — Hỏi đáp | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 2 |
| 2026-04-18 | QTHT (resend) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 2 — gửi lại file mới nhất |
| 2026-04-19 | Phân quyền Section 3 — Chuyên gia/TVV | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 |
| 2026-04-19 | Phân quyền Section 4 — Vụ việc HTPL | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 |
| 2026-04-19 | Smoke test — Biểu mẫu (FR-09) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **Verdict FAIL, 2 Blocker** (menu disabled + stuck spinner cho `CB_NV_*`). QTHT_TW PASS → backend healthy, bug FE role gating. |
| 2026-04-19 | Phân quyền Section 5 — Chi trả Chi phí | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 7 bug (2 Blocker + 3 Critical + 2 Major)**. BUG-PERM-M5-003 Blocker (DN cross-tenant financial leak), BUG-PERM-M5-007 Blocker (route `/chi-tra/{uuid}` 404), BUG-PERM-M5-002 Critical (isolation BN/DP lặp M3/M4). |
| 2026-04-19 | Phân quyền Section 6 — Doanh nghiệp | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 3 bug (1 Critical + 1 Major + 1 Minor)**. 6/11 ô PASS. BUG-PERM-M6-002 Critical (isolation BN/DP lặp M3/4/5), BUG-PERM-M6-001 Major (QTHT write UI lặp M5), BUG-PERM-M6-003 Minor (Portal sidebar leak). |
| 2026-04-19 | Phân quyền Section 7 — Báo cáo & Biểu mẫu | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 6 bug**. BAO_CAO 10/11 PASS (scoping OK). BIEU_MAU/THU_MUC 9/11 FAIL. BUG-PERM-M7-002 Blocker dup, M7-003/004/005 Critical (menu disabled 8 role × 2 entity), M7-001 Major (QTHT write UI). Fix 1 FE ability-rule unblock 16/18 ô. |
| 2026-04-19 | Phân quyền Section 8.1 — Đào tạo, Tập huấn (FR-03) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 5 bug (2 Critical + 2 Major + 1 Minor)**. 27/44 PASS (61%), 66/110 BLOCKED do 3 bug Critical functional Đào tạo chưa fix. BUG-PERM-M8.1-003 Critical MỚI (TVV đọc CTDT/KH trái spec), -002 Critical (isolation BN/DP), -001 Major (QTHT write UI). |
| 2026-04-19 | Functional Đào tạo, Tập huấn (FR-03) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 7 bug (2 Critical + 1 Major + 1 Medium + 3 Minor)**. Pass rate 5% (2/40 TC). BUG-DT-01 KH `/tao-moi` 404 (block 22 TC), BUG-DT-02 CTDT detail crash Chromium (block 10+ TC), BUG-DT-03 NHCH sidebar disabled cho CB_NV. 32/40 TC BLOCKED. Chờ FE fix + seed data KH. |
| 2026-04-19 | Phân quyền Section 8.3 — Tư vấn Chuyên sâu (FR-12) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL (retry full 11 role), 2 bug (1 Critical + 1 Major)**. 2/11 ô PASS (QTHT list access ngoại trừ Tạo mới button + NHT correctly blocked). BUG-PERM-M8.3-002 **Critical** menu "Tư vấn chuyên sâu" disabled UI cho 8 role (CB_NV×3, CB_PD×3, TVV, **CG primary user**) → module Tư vấn Chuyên sâu effectively không vận hành được (CG không tạo trả lời, CB_NV không tiếp nhận, CB_PD không duyệt). BUG-PERM-M8.3-001 Major QTHT thấy `+ Tạo mới` trên TVCS list (pattern lặp M5/6/7/8.1-001 — 1 dòng FE ability-rule fix cả 5 module). **Quy trình retry key learning:** full cleanup process + xóa `~/.gstack/chromium-profile` trước mỗi role + dùng click sidebar nav (không dùng goto direct vì làm mất auth cookie). |
| 2026-04-19 | Smoke test — Tư vấn Chuyên sâu (FR-12) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL Bước 2b, 2 bug**. (1) Duplicate BUG-PERM-M8.3-002 Critical confirm UI side: `canbo_tw` (CB_TW) click submenu → URL giữ `/403`, submenu xám disabled — screenshot chứng minh. (2) **MỚI** Major: khi session QTHT (test trước đó), route `/tv-chuyen-sau` load đủ (API `noi-dung-tu-van-cs` 200, 83B) rồi **auto-redirect** về `/danh-gia/ke-hoach/danh-sach` sau ~1s. Report: [round2/smoke-test/tv-chuyen-sau/smoke-test-report.md](qa-reports/round2_2026-04-16/smoke-test/tv-chuyen-sau/smoke-test-report.md). Unlock Lệnh 2: ❌ NO. |
| 2026-04-19 | Smoke test — Tư vấn Nhanh (FR-13) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL B2a+B2b, 2 bug Critical P0**. (1) BUG-SMOKE-TVN-001 Critical: submenu `Tư vấn nhanh` DISABLED (grayed out) cho CB_NV_TW dù JWT emit đủ 14 permissions TVNHANH (read/create/update/delete/approve × kho_cau_hoi + phien_tu_van + khoa_hoc) — pattern lặp hoàn toàn với BUG-PERM-M8.3-002. Crosscheck cùng menu cha: `Hợp đồng tư vấn` enabled → bug ở ability-rule cho TVNHANH+TVCS, không phải menu cha. (2) BUG-SMOKE-TVN-002 Critical: BE 3 route chính `/api/v1/kho-cau-hoi`, `/api/v1/tu-van-nhanh`, `/api/v1/phien-tu-van-nhanh` đều trả HTTP 404 `Cannot GET ...` (route chưa scaffold), crosscheck `/api/v1/auth/me` 200 → auth pipeline healthy. Module chưa deploy end-to-end. Report: [round2/smoke-test/tv-nhanh/smoke-test-report.md](qa-reports/round2_2026-04-16/smoke-test/tv-nhanh/smoke-test-report.md) + [bug-report-smoke-test.md](qa-reports/round2_2026-04-16/smoke-test/tv-nhanh/bug-report-smoke-test.md). Unlock Lệnh 2: ❌ NO. Đề xuất: fix BUG-SMOKE-TVN-001 cùng đợt với M8.3-002 (1 ability-rule share), deploy BE cùng đợt TVCS (cả 2 cùng 404). |
| 2026-04-19 | Phân quyền Section 8.2 — Đánh giá Hiệu quả (FR-08) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **FAIL, 3 bug permission**. L1 Menu PASS 11/11. L3 KE_HOACH 2/7 PASS (canbo_tw, lanhdao_tw). **BUG-PERM-M8.2-003 Critical P0** (4 role BN/DP thấy data TW = scope isolation leak, dup M5-002/M6-002/M8.1-002), **BUG-PERM-M8.2-002 Major P1** (QTHT thấy `+ Tạo kế hoạch` trái 👁️R, dup M5-001/M6-001/M8.1-001/M8.3-001), **BUG-PERM-M8.2-001 Minor P2** (Portal sidebar leak cross-module, dup M5-003/M6-003/M7-006). Technique breakthrough: `history.pushState + popstate` preserve auth state (bypass browse goto cookie loss). Pass rate permission 66%. |
| 2026-04-19 | BE endpoints FR-08 Đánh giá Hiệu quả (gộp vào permission report) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 3 — **3 bug BE gộp vào bug report permission M8.2**. **BUG-BE-M8-001 Critical P0** (`/api/v1/tieu-chi-danh-gias` 404 — entity chưa scaffold, block 7 ô + workflow NHAP→DA_LAP_KH), **BUG-BE-M8-002 Critical P0** (4 transition endpoints missing, 100% đợt stuck NHAP, block 14 ô), **BUG-BE-M8-003 Minor P2** (PATCH silently drops `trangThai`). Estimated fix: 1-2d + 2-3d + 30min. Report gộp: [round2/phan-quyen/section-8.2-danh-gia/bug-report-section-8.2-danh-gia.md](qa-reports/round2_2026-04-16/phan-quyen/section-8.2-danh-gia/bug-report-section-8.2-danh-gia.md). |
| 2026-04-19 | Smoke test — Chương trình HTPLDN (FR-15) | _(không cần gửi)_ | — | — | Đợt 3 — **CONDITIONAL PASS (WARN), 0 bug app-level**. 4/4 bước chính PASS: Login URL `/403` (CB_TW expected), menu visible, click navigate → `/ct-htpldn/danh-sach`, DOM verified 9 cột (`Mã CT`/`Tên chương trình`/`Mục tiêu`/`Thời gian`/`Ngân sách`/`Đơn vị`/`Trạng thái`/`Số đợt BC`/`Hành động`), buttons `Thêm Chương trình`+`Xuất Excel`+`Làm mới`, filters `Từ khóa`+`Công bố`+`Từ ngày`+`Đến ngày`, API `/chuong-trinh-htpls` 200 (83B empty), console sạch, 0 4xx/5xx. Deep smoke detail page (+ Thêm CT) **NOT VERIFIED** do chain browse timeout >60s với Vite dev heavy load (bundle 3.6MB+2.6MB+1.7MB). Cookie bridging fail vì auth ở sessionStorage. Observation OBS-CT-01: filter `Công bố` thay `Trạng thái` (minor, verify ở functional). Report: [round2/smoke-test/chuong-trinh-HTPLDN/smoke-test-report.md](qa-reports/round2_2026-04-16/smoke-test/chuong-trinh-HTPLDN/smoke-test-report.md). Unlock Lệnh 2: ✅ YES (cần seed 3-5 CT ở các state trước functional). Không gửi dev vì 0 bug. |
| 2026-04-20 | Data Readiness — Chương trình HTPLDN (FR-15) | _(gộp vào bug-report FR-15)_ | — | — | Đợt 4 — **Lệnh 2+3 partial (1/14 state seeded)**. 7 CT DU_THAO seeded (3 scope TW/BN/DP + 4 branch label), 1 soft-deleted (CT-0006 baseline). 13/14 state CT + 6 state đợt BC + 4 state BC **BLOCKED bởi BUG-BE-CT-001** (8 transition endpoints `/submit /cancel /activate /complete /pause /resume /publish /unpublish` đều 403 Forbidden với mọi role canbo_tw/bn/dp/lanhdao_tw). Phát hiện thêm: **BUG-TEST-ACCOUNT-001 Medium** (3 account `canbo_tw/bn/dp` chia sẻ `donViId 00000000-0000-4000-8000-000000000001` → scope isolation không test được). Report: [data-readiness-chuong-trinh-HTPL.md](qa-reports/round2_2026-04-16/chuong-trinh-HTPLDN/data-readiness-chuong-trinh-HTPL.md). |
| 2026-04-20 | Smoke test — Dashboard (FR-01) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 4 — **FAIL Bước 2b, 1 bug Critical P0**. Pre-check HTTP 200 + account chưa khóa PASS. Bước 1 login + landing `/403` + sidebar 12 menu PASS (CB_TW landing `/403` OK per CLAUDE.md Rule 5). Bước 2a sidebar có menu `Tổng quan` PASS. Bước 2b click `Tổng quan` → URL giữ `/403`, canvasCount=0, body không render Dashboard (vẫn 403 page), 0 network call tới `/api/v1/dashboard/*` → FAIL. Bước 3 console sạch + 0 4xx/5xx PASS. BUG-SMOKE-DASH-001 Critical P0: CB_NV_TW (canbo_tw — actor chính per SRS FR-I) không truy cập được Dashboard; 2 hypothesis song song (H1 FE PermissionRoute check sai ability key, H2 BE permission seed thiếu `dashboard:read` cho role CB_NV). Pattern lặp BUG-PERM-M8.3-002 (TVCS CB_NV menu no-op) + BUG-SMOKE-TVN-001 (TVNhanh submenu disabled CB_NV) → đề xuất dev fix 1 batch. 2 REAL CRASH browse mid-chain (Rule 7 STOP lần 2) — không ảnh hưởng evidence vì chain atomic trước crash đã capture đủ URL + JS assert. Report: [round2/smoke-test/dashboard/smoke-test-report.md](qa-reports/round2_2026-04-16/smoke-test/dashboard/smoke-test-report.md) + [bug-report-smoke-test.md](qa-reports/round2_2026-04-16/smoke-test/dashboard/bug-report-smoke-test.md). Unlock Lệnh 2: ❌ NO. Đề xuất Round 3: retest với qtht_tw/lanhdao_tw để confirm scope bug (chỉ CB_NV hay all role). |
| 2026-04-20 | Smoke test — Hợp đồng Tư vấn (FR-14) | _(không cần gửi, 0 bug)_ | — | — | Đợt 4 — **✅ PASS 4/4 BAGM**. Menu path confirmed: `Quản lý tư vấn` (parent) > `Hợp đồng tư vấn` (submenu ENABLED cho canbo_tw). URLs: `/hop-dong-tv/danh-sach` (list) / `/hop-dong-tv/{uuid}` (detail full-page) / `/hop-dong-tv/tao-moi` (modal create). List 10 cột khớp spec + 5 state tab + 3 button + 3 filter + 1 row `HDTV-20260414-0001`. Detail 3 section (Thông tin/Mốc TĐ/Thanh toán) + Chỉnh sửa/Xóa. Create modal 5 required + Hủy/Tạo mới. Console sạch, 0 4xx/5xx. **3 OBS non-blocker:** OBS-HDTV-01 sidebar custom DOM (spec `.ant-menu-*` outdated, update `.nav-item/.nav-subitem`), OBS-HDTV-02 Bên A/B là text input thuần (vi phạm HDTV-003 auto-fill Bên A + HDTV-029 dropdown TVV DANG_HOAT_DONG), OBS-HDTV-03 detail thiếu `Nhật ký` section (liên quan HDTV-020/BR-DATA-05 audit log). Pattern confirm (không phải bug mới): TVCS + Tư vấn nhanh submenu disabled cho canbo_tw → tái khẳng định BUG-SMOKE-TVCS-001 + BUG-SMOKE-TVN-001. **Bài học retry:** 2 crash ban đầu mix REAL CRASH + SELECTOR OUTDATED → fix selector TRƯỚC khi đếm crash #2 theo Rule 9 (sẽ update vào Rule 7 recommendation). Report: [smoke-test-report.md](qa-reports/round2_2026-04-16/smoke-test/HD-tv/smoke-test-report.md). Unlock Lệnh 2: ✅ YES. Sample ID `HDTV-20260414-0001` reuse. |
| 2026-04-20 | Functional — Chương trình HTPLDN (FR-15) | _(điền)_ | _(điền)_ | _(điền)_ | Đợt 4 — **CONDITIONAL FAIL, 10 findings (2 Critical + 2 Major + 2 Medium + 3 Minor + 1 Obs)** + prototype comparison. Scope 14 TC, runnable 12 (CT-104/105 BLOCKED do cần non-DU_THAO state — B6), 7 PASS + 2 FAIL + 3 PARTIAL. **Critical BE:** BUG-CT-BE-001 (soft-delete leak — deleted CT vẫn xuất hiện list, vi phạm BR-DATA-01) + BUG-BE-CT-001 (8 transition endpoints 403, block 24 TC workflow). **Major:** BUG-CT-FE-003 (Tab Đợt BC placeholder "Story 13.6" chưa build) + BUG-CT-PERM-001 (QTHT thấy `+ Thêm Chương trình` enabled — pattern lặp M5/M6/M7/M8.1/M8.2/M8.3). Medium: BUG-CT-UI-002 (nút upload tiếng Trung `单击上传`) + BUG-TEST-ACCOUNT-001. Minor: BUG-CT-UI-005 (FE accept -100 ngân sách), BUG-CT-UI-001 (Đơn vị = `-`), BUG-CT-UI-006 (TVV menu disabled thay vì hidden). OBS-CT-02 (progress 6 steps thay 8 SM). Prototype diffs: app có tabs by state + more fields (11 vs 3) theo SRS. Reports: [functional-test-report-chuong-trinh-HTPLDN.md](qa-reports/round2_2026-04-16/chuong-trinh-HTPLDN/functional-test-report-chuong-trinh-HTPLDN.md) + [bug-report consolidated](qa-reports/round2_2026-04-16/chuong-trinh-HTPLDN/bug-report-chuong-trinh-HTPLDN.md) (5 sections theo loại BE/FE/UI/Test Data/Obs). Estimated fix BE 30ph+1-2h = unblock 24+ TC cho Round 3. |

---

## Round cũ — lưu trữ

### Tổng hợp per round (để so sánh regression)

| Round | Thời gian | Vị trí | Functional pass rate | Permission pass rate | Tổng bug | Critical+ | Ghi chú |
|-------|-----------|--------|---------------------|---------------------|----------|-----------|---------|
| Round 1 | 2026-04-15 → 2026-04-16 | [_archive/round1_2026-04-16/](qa-reports/_archive/round1_2026-04-16/) | — | — | — | — | Đợt đầu — deploy 04-15 |
| Round 1b | 2026-04-16 | [round1/](qa-reports/round1/) | — | — | — | — | Chỉ có permission-matrix-module2 |
| **Round 2** | 2026-04-16 → 2026-04-20 | [_archive/round2_2026-04-16/](qa-reports/_archive/round2_2026-04-16/) | **~33%** (86/261 TC, 8 module) | **~29%** (96/326 ô, 11 module) | **~91 bug** (functional) + **~48 bug** (permission) = **~139 bug** | **~30 Critical+ Blocker** | Deploy 04-16. Xem snapshot chi tiết dưới ↓ |

### Round 2 — Snapshot chi tiết (2026-04-16 → 2026-04-20)

**Functional test (8/16 module có kết quả):**

| FR | Module | Verdict | Bug | P/F/B |
|----|--------|---------|-----|-------|
| FR-02 | Hỏi đáp | FAIL | 13 (4C + 5M + 4Med) | 19P + 15F + 1B = 35 |
| FR-03 | Đào tạo | FAIL | 7 (2C + 1M + 1Med + 3Min) | 2P + 6F + 32B = 40 (pass 5%) |
| FR-04 | CG/TVV | FAIL | 12 (3C + 4M + 3Med + 2Min) | 14P + 9F + 7B = 30 |
| FR-05 | Vụ việc | FAIL | 16 (6C + 5M + 3Med + 2Min) | 10P + 10F + 15B = 35 |
| FR-06 | Chi trả | FAIL | 6 (2Blocker + 2M + 1Med + 1Min) | 3P + 6F + 22B = 31 |
| FR-07 | DN | FAIL | 7 (2C + 2M + 1Med + 1Min + 1Info) | 11P + 7F + 0B = 18 |
| FR-08 | Đánh giá | Partial (data FAIL) | 5 (3C + 1M + 1Med) | 10P + 5F + 25B = 40 (pass 25%) |
| FR-10 | QTHT | FAIL | 11 (1C + 6M + 3Med + 1Min) | 17P + 9F + 6B = 32 |
| FR-15 | CT HTPLDN | Conditional FAIL | 10 (2C + 2M + 2Med + 3Min + 1Obs) | 7P + 2F + 3Part + 2B = 14 |

**Permission test (11/16 module có kết quả):** FR-02 (5 bug), FR-03 (5 bug, 27P+16F+66B=109), FR-04 (4 bug), FR-05 (5 bug), FR-06 (7 bug, 2 Blocker), FR-07 (3 bug), FR-08 (6 bug incl 3 BE Critical), FR-09 (5 bug), FR-10 (5 bug), FR-11 (1 bug, PASS), FR-12 (2 bug).

**Smoke test (13/16 module chạy):** PASS — FR-02/04/05/06/07/08/10/14/15. FAIL — FR-01 (Dashboard menu no-op CB_NV), FR-09 (Biểu mẫu menu disabled), FR-11 (API double-wrap), FR-12 (TVCS menu disabled), FR-13 (TVNhanh submenu disabled + BE 3 route 404).

**Pattern bug recurring qua nhiều module (đề xuất fix 1 batch):**
1. **QTHT write UI trên entity nghiệp vụ** (vi phạm 👁️R) — FR-05, 06, 07, 08, 09, 12, 15 (≥7 module)
2. **Isolation BN/DP leak** — FR-03, 04, 05, 06, 07, 08 (≥6 module)
3. **CB_NV/CB_PD menu disabled sai spec** — FR-01 Dashboard, FR-09 Biểu mẫu, FR-12 TVCS, FR-13 TVNhanh (4 module) — khả năng 1 FE ability-rule share
4. **Portal sidebar leak full CMS menu** — FR-06, 07, 08, 09 (4 module)
5. **Detail route 404 hoặc BE endpoints missing** — FR-06 (chi-tra/{uuid}), FR-08 (tieu-chi + 4 transition), FR-11 (UC124), FR-13 (3 route TVNhanh), FR-15 (8 transition CT)

---

## Hướng dẫn cập nhật file này

1. **Sau khi chạy xong 1 module:** cập nhật cột "Đã test" = ✅ + điền cột "# Bug"
2. **Khi gửi report cho dev:** cập nhật "Đã gửi dev" = ✅, điền "Ngày gửi" + "Kênh" + ghi 1 dòng vào **Nhật ký gửi dev**
3. **Khi dev báo đã fix:** cập nhật "Trạng thái fix" = 🔧/✅/🔁
4. **Khi bắt đầu round mới:**
   - Archive round cũ: `mv output/qa-reports/round2_2026-04-16/ output/qa-reports/_archive/`
   - Copy file này thành section "Round 3" bên trên, giữ section cũ vào "Round cũ — lưu trữ"
   - Reset tất cả ô về 🔴
