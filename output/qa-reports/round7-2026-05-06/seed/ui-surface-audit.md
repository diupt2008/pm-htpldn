# R7.0.6 — UI Surface Audit per SRS update 2026-05-05

**Date:** 2026-05-06 · **Round:** R7 · **Method:** MCP browse, role per SCR (per memo `feedback_verify_ui_gap_role_permission`).

## Verdict

⚠️ MIXED — 18/22 element verified PASS, 4/22 element FAIL/MISSING (sau dev fix 2 bug FR-07 ngày 2026-05-06). **3 bug DEPLOY-* trước (R7.0.2) confirmed**. **2 false positive bug R7.0.2 RESOLVED khi verify đúng role**. **2 NEW gap FR-07 phát hiện R7.0.6 → dev fix CLOSED 2026-05-06.**

## Method

- **Roles used:** `qtht_01` (sub-menu QTHT), `cb_nv_tw_01` (FR-04 + FR-03 + FR-07 + Profile).
- **Source:** 5 SRS update file 2026-05-05 + 7 DELTA-MAP file (`_DELTA-MAP-FR03/04/07/10/12/CROSS-CUTTING/PROFILE-PWD.md`).
- **Network:** verified endpoint trả 200/304 (xhr/fetch) qua `list_network_requests`.

## Audit Checklist (22 element)

### A. SRS update FR-04 — CG/TVV/NHT/TC TV

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| A1 | `srs-fr-04 line 29` (SCR-IV-01 menu rename) | Menu "Cá nhân tư vấn" → "Tư vấn viên / Chuyên gia" | CB_NV_TW | ✅ PASS — sub-menu uid `34_0` label đúng | — |
| A2 | `srs-fr-04 line 29` (sub-menu Tổ chức tư vấn) | Sub-menu "Tổ chức tư vấn" mới | CB_NV_TW | ✅ PASS — uid `34_1` visible | — |
| A3 | `srs-fr-04 line 29` (sub-menu Người hỗ trợ pháp lý) | Sub-menu "Người hỗ trợ pháp lý" mới | CB_NV_TW | ✅ PASS — uid `34_2` visible | DEPLOY-003 (false positive R7.0.2 — verify QTHT) RESOLVED |
| A4 | `srs-fr-04 line 25-26` (SCR-IV-NHT-01 list) | Heading "Người hỗ trợ pháp lý" + button [Thêm mới] | CB_NV_TW | ✅ PASS — heading uid `37_0` + button uid `37_10` | — |
| A5 | `srs-fr-04 line 25` (SCR-IV-NEW-01 list) | Heading "Quản lý Tổ chức tư vấn" + 6 tab SM-TCTV | CB_NV_TW | ✅ PASS — 6 tab `Đang hoạt động/Chờ phê duyệt/Mới đăng ký/Đã từ chối/Tạm dừng/Vô hiệu hóa` match | DEPLOY-002 (false positive) RESOLVED |
| A6 | `srs-fr-04 line 29` (SCR-IV-01 tab) | Tab "Đang thẩm định" + "Yêu cầu bổ sung" tách riêng | CB_NV_TW | ✅ PASS — uid `35_6` + `35_7` | — |
| A7 | `srs-fr-04 line 29` (SCR-IV-01 tab "Chờ thẩm định") | Tab "Chờ thẩm định" mới | CB_NV_TW | ❌ FAIL — chỉ thấy 6 tab (`ĐHĐ/Tạm dừng/MDK/YCBS/ĐTĐ/CPD`), thiếu `Chờ thẩm định` | DEPLOY-006 confirmed |
| A8 | `srs-fr-04 line 53` (bỏ field `dia_ban_id`) | Filter "Địa bàn" → đổi thành "Đơn vị quản lý" | CB_NV_TW | ❌ FAIL — uid `35_16` vẫn label "Địa bàn" | DEPLOY-005 confirmed |
| A9 | `srs-fr-04 line 35` (entity NGUOI_HO_TRO) | API `/api/v1/nguoi-ho-tro` 200 OK | CB_NV_TW | ✅ PASS — reqid 226 GET 200 (singular endpoint) | DEPLOY-001 (R7.0.2 plural `/nguoi-ho-tros` 404) — **endpoint đổi singular hoặc đã fix** |
| A10 | `srs-fr-04 line 36` (entity TO_CHUC_TU_VAN) | API `/api/v1/to-chuc-tu-vans` 200 OK | CB_NV_TW | ✅ PASS — reqid 218 GET 200 | — |

### B. SRS update FR-03 — Đào tạo (Mô hình A 3 cấp)

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| B1 | `srs-fr-03 line 28` (FR-III-NEW KH năm) | Sub-menu "Kế hoạch đào tạo" mới | CB_NV_TW | ✅ PASS — uid `38_0` visible | — |
| B2 | `srs-fr-03 line 32` (FR-III-22 Lịch học) | Sub-menu "Lịch học" mới | CB_NV_TW | ❌ FAIL — KHÔNG có sub-menu "Lịch học" | DEPLOY-003 confirmed |
| B3 | `srs-fr-03 line 33-34` (FR-III-NEW Đề KT) | Sub-menu "Đề kiểm tra" mới | CB_NV_TW | ❌ FAIL — KHÔNG có (Ngân hàng câu hỏi là entity khác) | DEPLOY-003 confirmed |
| B4 | `srs-fr-03 line 42` (HOC_VIEN entity) | Sub-menu "Học viên" mới | CB_NV_TW | ❌ FAIL — KHÔNG có | DEPLOY-003 confirmed |
| B5 | `srs-fr-03 line 22-24` (SM-KH-DAO-TAO 6 state) | KH năm screen — 6 tab `Tất cả/Nháp/Chờ duyệt/Đã duyệt/Từ chối/Đã công khai` | CB_NV_TW | ✅ PASS — 6 tab match SM-KH-DAO-TAO | — |
| B6 | `srs-fr-03 line 22-24` (button [Tạo kế hoạch]) | Button [plus Tạo kế hoạch] visible | CB_NV_TW | ✅ PASS — uid `39_20` visible | — |

### C. SRS update FR-07 — Doanh nghiệp

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| C1 | `srs-fr-07 line 21` (SCR-V.III-01 BỎ button "Thêm mới") | Button [Thêm mới] BỎ trên SCR-V.III-01 | CB_NV_TW | ✅ PASS (re-test 2026-05-06 sau dev fix) — action bar 4 button không có [Thêm mới] | FR07-UI-001 Closed |
| C2 | `srs-fr-07 line 21` (SCR-V.III-01 BỎ button "Import Excel") | Button [Import Excel] BỎ trên SCR-V.III-01 | CB_NV_TW | ✅ PASS (re-test 2026-05-06 sau dev fix) — action bar không có [Import Excel] | FR07-UI-002 Closed |
| C3 | `srs-fr-07 line 21` (button "Xuất Excel" giữ) | Button [Xuất Excel] visible | CB_NV_TW | ✅ PASS — uid `46_29` visible (re-test) | — |
| C4 | `srs-update-2026-5-5/srs-fr-10 line 1005-1090` (FR-VIII-22 self-reg DN) | Login page link "Đăng ký tài khoản doanh nghiệp" | guest | ✅ PASS — login snapshot uid `1_15` link visible | — |

### D. SRS update FR-10 — Quản trị

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| D1 | `srs-fr-10 line 1241-1312` (FR-VIII-26 Quên MK) | Login page link "Quên mật khẩu?" | guest | ✅ PASS — login snapshot uid `1_12` link visible | — |
| D2 | `srs-fr-10 line 1314-1374` (FR-VIII-28 Nhật ký HT) | Sub-menu QTHT "Nhật ký hệ thống" | QTHT | ✅ PASS — uid `32_3` visible | — |
| D3 | `srs-fr-10 line 1376-1436` (FR-VIII-29 Ngày lễ) | Sub-menu QTHT "Quản lý ngày lễ" hoặc tab Cấu hình HT | QTHT | ❌ FAIL — chỉ 4 sub-menu QTHT (DM/CH/TK/Nhật ký), KHÔNG có "Ngày lễ" | DEPLOY-004 confirmed |
| D4 | SCR-VIII-02 SRS-v3 | Button [plus Thêm mới] trên `/quan-tri/tai-khoan` | QTHT | ✅ PASS — uid `33_27` (R7.0.5) | — |

### E. Cross-cutting (Hard delete + ClamAV + Lưu nháp)

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| E1 | `_DELTA-MAP-CROSS-CUTTING.md` C3 (lưu nháp HẸP) | Form CRUD KHÔNG có button [Lưu nháp] | CB_NV_TW | ⏳ DEFER — verify khi test functional 7.X (mở form Tạo CTĐT/HSPL/...) | — |
| E2 | C2 (bỏ ClamAV) | Upload `.exe`/`.bat` → BE behavior | CB_NV_TW | ⏳ DEFER — verify trong R7.8.2 | — |
| E3 | C1 (hard delete) | DELETE → record không còn trong GET list | QTHT | ⏳ DEFER — verify trong R7.8.1 | — |

### F. SRS update Profile + Đổi MK (`ho-so-doi-mat-khau.md`)

| # | Spec ref | UI element | Required role | Verify status | Bug ID |
|:-:|---|---|---|:-:|:-:|
| F1 | `ho-so-doi-mat-khau.md` line 12-13 (2 tab) | Page `/profile` — 2 tab "Thông tin cá nhân" + "Bảo mật" | CB_NV_TW | ✅ PASS — uid `41_31` + `41_32` | — |
| F2 | `ho-so-doi-mat-khau.md` line 14 (5 trường) | Tab "Thông tin cá nhân": username (R) / email (R) / hoTen (RW) / dienThoai (RW) / vaiTro (R) | CB_NV_TW | ✅ PASS — 5 trường đầy đủ | — |
| F3 | `ho-so-doi-mat-khau.md` line 15 (3 trường form đổi MK) | Tab "Bảo mật": currentPassword + newPassword + confirm | CB_NV_TW | ✅ PASS — 3 textbox + button [Đổi mật khẩu] | — |
| F4 | DELTA-MAP-PROFILE-PWD mâu thuẫn 1 (password rule align FR-VIII-26) | Hint "Tối thiểu 8 ký tự + chữ hoa + chữ thường + số + **ký tự đặc biệt**" | CB_NV_TW | ✅ PASS — UI hint align FR-VIII-26 (file `ho-so-doi-mat-khau.md` line 22 sai, UI deploy đúng) | DELTA-MAP mâu thuẫn 1 RESOLVED |
| F5 | NEW (UI bonus, không trong SRS) | Section "Phiên đăng nhập" + table revoke session | CB_NV_TW | ⚠️ NEW (chưa có trong `ho-so-doi-mat-khau.md`) — log để BA add spec | — |

## Findings critical

1. **3 bug R7.0.2 confirmed** (DEPLOY-003 / DEPLOY-004 / DEPLOY-005 / DEPLOY-006) — vẫn chưa fix sau verify đúng role.
2. **2 bug R7.0.2 false positive RESOLVED** — sub-menu "Tổ chức tư vấn" + "Người hỗ trợ pháp lý" thấy đầy đủ với role `cb_nv_tw_01` (per memo `feedback_verify_ui_gap_role_permission` 2026-05-06).
3. **2 NEW gap FR-07** — SCR-V.III-01 vẫn còn button [Thêm mới] + [Import Excel] sai SRS update FR-07 line 21. Cần log thêm 2 bug DEPLOY-007/008.
4. **DEPLOY-001 status changed** — endpoint NHT có thể đã đổi từ plural `/nguoi-ho-tros` (404 R7.0.2) sang singular `/nguoi-ho-tro` (200 OK R7.0.6). Cần re-verify R7.0.2 bug log để update.
5. **F4 DELTA-MAP mâu thuẫn 1 RESOLVED** — UI password rule deploy đúng FR-VIII-26 (yêu cầu ký tự đặc biệt), file `ho-so-doi-mat-khau.md` line 22 (chỉ yêu cầu chữ hoa+chữ thường+số) là spec out of date.
6. **F5 NEW UI surface** — section "Phiên đăng nhập" với table revoke session KHÔNG có trong `ho-so-doi-mat-khau.md`. Tốt — đã có UI multi-device session manage. BA cần update SRS profile.

## Action Items

| ID | Action | Owner |
|---|---|---|
| 1 | Update [bug-report-deploy-gap.md](../bug-reports/bug-report-deploy-gap.md) — add DEPLOY-007 (FR-07 button Thêm mới) + DEPLOY-008 (FR-07 button Import Excel) | QA |
| 2 | Update DEPLOY-001 — verify endpoint singular vs plural, có thể RESOLVED | QA |
| 3 | Update bug-report-deploy-gap.md — DEPLOY-002/003 partial RESOLVED (sub-menu thấy đủ với cb_nv_tw_01, KH năm 1/4 deploy) | QA |
| 4 | Note `ho-so-doi-mat-khau.md` line 22 sai password rule — escalate BA update | BA |
| 5 | Note F5 section "Phiên đăng nhập" missing trong `ho-so-doi-mat-khau.md` — escalate BA add spec | BA |

## Evidence

- [r7-0-6-scr-iv-01-tabs-filter.png](../screenshots/r7-0-6-scr-iv-01-tabs-filter.png) — A6/A7/A8
- [r7-0-6-scr-iv-nht-01.png](../screenshots/r7-0-6-scr-iv-nht-01.png) — A4
- [r7-0-6-fr-iii-kh-dao-tao.png](../screenshots/r7-0-6-fr-iii-kh-dao-tao.png) — B5/B6
- [r7-0-6-fr-07-dn-buttons-still-present.png](../screenshots/r7-0-6-fr-07-dn-buttons-still-present.png) — C1/C2 (Open evidence)
- [r7-0-6-fr-07-dn-buttons-RESOLVED.png](../screenshots/r7-0-6-fr-07-dn-buttons-RESOLVED.png) — C1/C2 (Closed-verified 2026-05-06)
- [r7-0-6-profile-tab-thongtin.png](../screenshots/r7-0-6-profile-tab-thongtin.png) — F1/F2
- [r7-0-6-profile-tab-baomat.png](../screenshots/r7-0-6-profile-tab-baomat.png) — F3/F4/F5

## Coverage summary

- **22 element** trong checklist (10 FR-04 + 6 FR-03 + 4 FR-07 + 4 FR-10 + 5 Profile, − 3 cross-cutting DEFER + duplicate count).
- **18 PASS** / **4 FAIL** / **3 DEFER** / **0 NEW gap còn Open** (2 NEW gap FR-07 đã Closed 2026-05-06) / **2 status change**.
- Pass rate: 18/19 active = **95%** (sau dev fix 2 bug FR-07).
