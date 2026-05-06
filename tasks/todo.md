# TODO — QA HTPLDN Round 7 (apply SRS update 2026-05-05)

**App:** http://103.172.236.130:3000/ · **MailHog:** http://103.172.236.130:8025  
**Plan:** [plan.md](plan.md) v2.6.2 · **Plan trigger:** [plan-r7-trigger.md](plan-r7-trigger.md) · **Spec data:** [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)  
**R6 frozen:** [_archive/round6-frozen-2026-05-06.md](_archive/round6-frozen-2026-05-06.md) (74 task, ref lịch sử)  
**Today:** 2026-05-06

> **📌 FR-04 spec sync 2026-05-06** — 8 file QA test plan FR-04 đã update theo SRS update 2026-05-05 (TVV/CG/NHT/TC TV). Mới: [7.4-chuyen-gia-tvv.md](../output/funtion/7.4-chuyen-gia-tvv.md) (18 FR, 30 TC, SM 10 state) · [7.4a-nguoi-ho-tro.md](../output/funtion/7.4a-nguoi-ho-tro.md) (NHT 21 TC) · [7.4b-to-chuc-tu-van.md](../output/funtion/7.4b-to-chuc-tu-van.md) (TC TV 25 TC) · [6.4-sm-tvv.md](../output/smoke/6.4-sm-tvv.md) · [6.4a-sm-tctv.md](../output/smoke/6.4a-sm-tctv.md) · [6.4b-sm-nht.md](../output/smoke/6.4b-sm-nht.md). Permission 3-view sync (matrix.md + by-fr.md + by-role.md). Tester chạy R7.X FR-04 dùng spec mới này.

**Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream  
**Tag kế thừa R6:** 🔄 KEPT (spec không đổi, re-seed/re-test) · ✏️ MODIFIED (spec đổi) · 🆕 NEW (feature SRS update)

> **Bối cảnh R7:** Dev đã deploy SRS update 2026-05-05 + partial reset DB (verified 2026-05-06 qua MCP). Sau audit R7.0.6 (`output/qa-reports/round7-2026-05-06/seed/ui-surface-audit.md`): **3 sub-menu Mạng lưới TVV (Tư vấn viên / Chuyên gia + Người hỗ trợ pháp lý + Tổ chức tư vấn) ĐÃ DEPLOY đầy đủ** (verified với role `cb_nv_tw_01`); 6 tab SM-TCTV match SRS. **Endpoint NHT** `/api/v1/nguoi-ho-tro` (singular) 200 OK — DEPLOY-001 R7.0.2 (plural `/nguoi-ho-tros` 404) có thể đã đổi tên hoặc fix, cần re-verify khi seed. Còn block: **DEPLOY-003 4 sub-menu Đào tạo mới thiếu** (Kế hoạch năm/Lịch học/Đề kiểm tra/Học viên), **DEPLOY-004 Ngày lễ sub-menu thiếu**, **DEPLOY-005 filter Địa bàn TVV vẫn còn**. R7.0.6 cũng phát hiện 2 gap FR-07 (button [Thêm mới]/[Import Excel]) → **dev fix Closed 2026-05-06** ([bug-report-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-r7-0-6-fr-07-buttons.md)). 2 false positive R7.0.2 (sub-menu NHT/TC TV) DROPPED — bài học: verify UI gap dùng đúng role có permission per SCR (memory `feedback_verify_ui_gap_role_permission`).

---

## Tổng hợp Round 7

| Phase | Việc | Tổng | 🟢 | 🔵 | ✅ | ⚠️ | 🚫 | ⏳ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | Pre-test (verify deploy + bug gap + fixture) | 6 | - | - | 4 | 2 | - | - |
| 1 | Re-seed Tier 0 (DM/đơn vị/SLA/MPH/ngày lễ) | 5 | - | - | 4 | 1 | - | - |
| 2 | Re-seed Tier 1 (TC TV/DN/TVV/CG/NHT/account/PC) | 11 | 9 | - | - | - | 0 | 2 |
| 3 | Re-seed Tier 2 (transactional entry state) | 15 | 7 | - | 3 | - | 2 | 3 |
| 4 | Workflow E2E (Trụ A/B/C/D) | 18 | 2 | - | - | - | - | 16 |
| 5 | Verification (KPI/cross/SLA/audit) | 5 | 3 | - | - | - | - | 2 |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TVN/CT) | 5 | 1 | - | - | - | - | 4 |
| 7 | Functional 17 module + 2 NEW (NHT/TC TV) | 19 | 3 | - | - | - | - | 16 |
| 8 | Cross-cutting + Profile + Permission | 5 | 5 | - | - | - | - | - |
| Trụ E | Monitor unblock | 4 | 3 | - | - | - | - | 1 |
| **Tổng** | | **93** | **33** | **0** | **11** | **3** | **2** | **44** |

---

## Mục lục theo Module (click ID để jump)

| Module | Tasks |
|---|---|
| **Pre-test** | ✅ [R7.0.1](#r7-0-1) deploy · ⚠️ [R7.0.2](#r7-0-2) bug-deploy · ✅ [R7.0.3](#r7-0-3) fixture · ✅ [R7.0.4](#r7-0-4) login · ⚠️ [R7.0.6](#r7-0-6) UI-audit |
| **TVV** | 🟢 [R7.2.5](#r7-2-5) seed · ⏳ [R7.4.A1](#r7-4-a1) workflow · ⏳ [R7.4.A1.5](#r7-4-a1-5) PC · ⏳ [R7.4.A2](#r7-4-a2) tiếp-nhận · ⏳ [R7.7.2](#r7-7-2) functional |
| **CG** | 🟢 [R7.2.6](#r7-2-6) seed · ⏳ [R7.4.A1-CG](#r7-4-a1-cg) advance · ⏳ [R7.7.2](#r7-7-2) functional (chung TVV) |
| **NHT** 🆕 | 🟢 [R7.2.7](#r7-2-7) seed · ⏳ [R7.2.8b](#r7-2-8b) account · ⏳ [R7.7.4.5](#r7-7-4-5) functional |
| **TC TV** 🆕 | 🟢 [R7.2.2](#r7-2-2) seed · 🟢 [R7.2.3](#r7-2-3) phê-duyệt · ⏳ [R7.7.4.6](#r7-7-4-6) functional |
| **DN** | 🟢 [R7.2.4](#r7-2-4) seed · 🟢 [R7.3.4](#r7-3-4) HSPL · 🟢 [R7.5.2](#r7-5-2) cross-module · ⏳ [R7.7.4](#r7-7-4) functional |
| **Hỏi đáp** | ✅ [R7.3.1](#r7-3-1) seed · ⏳ [R7.4.A4](#r7-4-a4) workflow · ⏳ [R7.7.1](#r7-7-1) functional |
| **Vụ việc** | ✅ [R7.3.2](#r7-3-2) seed · ⏳ [R7.4.A3](#r7-4-a3) workflow · ⏳ [R7.7.3](#r7-7-3) functional |
| **TVCS** | ✅ [R7.3.3](#r7-3-3) seed · ⏳ [R7.4.A5](#r7-4-a5) workflow · ⏳ [R7.7.5](#r7-7-5) functional |
| **HĐ TV** | ⏳ [R7.3.14](#r7-3-14) seed · ⏳ [R7.7.14](#r7-7-14) functional · 🟢 [R7.E1](#r7-e1) monitor |
| **KH năm** 🆕 | ⏳ [R7.3.5](#r7-3-5) seed · ⏳ [R7.4.B0](#r7-4-b0) workflow |
| **CTĐT** | 🟢 [R7.3.6](#r7-3-6) seed · ⏳ [R7.4.B1](#r7-4-b1) workflow |
| **Khóa học** | 🟢 [R7.3.15](#r7-3-15) seed · ⏳ [R7.4.B7](#r7-4-b7) workflow · ⏳ [R7.4.B11](#r7-4-b11) phê-duyệt · ⏳ [R7.7.6](#r7-7-6) functional |
| **NHCH** | 🟢 [R7.3.8](#r7-3-8) seed · ⏳ [R7.4.B5b](#r7-4-b5b) publish |
| **ĐKT** 🆕 | 🟢 [R7.3.9](#r7-3-9) seed · ⏳ [R7.4.B10](#r7-4-b10) workflow |
| **Bài giảng** | 🟢 [R7.3.10](#r7-3-10) seed |
| **Giảng viên** | 🟢 [R7.3.11](#r7-3-11) seed |
| **Học viên** 🆕 | 🚫 [R7.3.12](#r7-3-12) seed |
| **Lịch học** 🆕 | 🚫 [R7.3.13](#r7-3-13) seed · ⏳ [R7.4.B12](#r7-4-b12) workflow |
| **Biểu mẫu** | 🟢 [R7.3.7](#r7-3-7) seed · 🟢 [R7.4.C1](#r7-4-c1) workflow · 🟢 [R7.7.10](#r7-7-10) functional |
| **Đánh giá HQ** | 🟢 [R7.4.D1](#r7-4-d1) tạo · ⏳ [R7.4.D2](#r7-4-d2) workflow · ⏳ [R7.7.9](#r7-7-9) functional |
| **Kho QA** | ⏳ [R7.4.D3](#r7-4-d3) tạo |
| **Chi trả** | ⏳ [R7.6.1](#r7-6-1) workflow · 🟢 [R7.7.12](#r7-7-12) functional · 🟢 [R7.E3](#r7-e3) monitor |
| **TV nhanh** | ⏳ [R7.6.2](#r7-6-2) tay · ⏳ [R7.6.3](#r7-6-3) PUBLIC · ⏳ [R7.7.11](#r7-7-11) functional · ⏳ [R7.E4](#r7-e4) monitor |
| **CT HTPLDN** | 🟢 [R7.6.4](#r7-6-4) GĐ1 · ⏳ [R7.6.5](#r7-6-5) GĐ2 · ⏳ [R7.7.15](#r7-7-15) functional · 🟢 [R7.E2](#r7-e2) monitor |
| **QTHT — DM/SLA/Đơn vị** | ✅ [R7.0.5](#r7-0-5) button · ✅ [R7.1.1](#r7-1-1) LV · ⚠️ [R7.1.2](#r7-1-2) Loại-DN · ✅ [R7.1.3](#r7-1-3) Đơn-vị · ✅ [R7.1.4](#r7-1-4) SLA · ✅ [R7.1.5](#r7-1-5) Ngày-lễ · 🟢 [R7.7.8](#r7-7-8) functional |
| **QTHT — MPH/Account/PC** | 🟢 [R7.2.1](#r7-2-1) MPH · 🟢 [R7.2.8a](#r7-2-8a) acc-CG · ⏳ [R7.2.8b](#r7-2-8b) acc-NHT · ⏳ [R7.2.9](#r7-2-9) activate · 🟢 [R7.2.10](#r7-2-10) PC |
| **Dashboard** | ⏳ [R7.5.1](#r7-5-1) KPI · ⏳ [R7.7.7](#r7-7-7) functional |
| **Báo cáo** | 🟢 [R7.5.4](#r7-5-4) BC04 · ⏳ [R7.7.13](#r7-7-13) functional |
| **SLA cảnh báo** | ⏳ [R7.5.3](#r7-5-3) banner |
| **Audit log** | 🟢 [R7.5.5](#r7-5-5) ≥100 entry |
| **API** | ⏳ [R7.7.16](#r7-7-16) 42 TC + 8 mock |
| **Edge BR** | ⏳ [R7.7.17](#r7-7-17) BR-EC-01..23 |
| **Cross-cutting** | 🟢 [R7.8.1](#r7-8-1) hard-del · 🟢 [R7.8.2](#r7-8-2) ClamAV · 🟢 [R7.8.3](#r7-8-3) lưu-nháp · 🟢 [R7.8.4](#r7-8-4) profile · 🟢 [R7.8.5](#r7-8-5) permission |

> **Status icon ref:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream · 🆕 module mới R7

---

## Phase 0 — Pre-test (gate before run)

- ✅ <a id="r7-0-1"></a>**R7.0.1** Verify deploy + scenario reset DB — DONE 2026-05-06
  - **R7:** Scenario MIX — partial reset (DN 30 mới, TVV/CG/KH=0, VV=70) + 10/18 deploy OK + 8 gap. [plan-r7-trigger.md](plan-r7-trigger.md)
- ⚠️ <a id="r7-0-2"></a>**R7.0.2** 🆕 Log + gửi dev bug deploy gap `[~70% — log 6/8 verified done, gửi dev chưa]`
  - **Kết quả:** Log 6/8 bug (3M+2Me+1Mi), 2 false positive drop. Gửi dev chưa làm.
  - **Bug:** [bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-deploy-gap.md) — 0/6 đóng (3 Major + 2 Medium + 1 Minor)
- ✅ <a id="r7-0-3"></a>**R7.0.3** 🆕 Bump fixture v2.7.0 → v2.7.1 (R7.0.3 done 2026-05-06)
  - **R7:** v2.7.1 header note instruction strip `dia_ban_ids` + `loai_tvv:NHT` khỏi payload khi seed. 24 dòng dia_ban_ids giữ legacy R6 reference. [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)
- ✅ <a id="r7-0-4"></a>**R7.0.4** 🔄 Verify users.csv accounts còn login
  - **Kết quả:** PASS 10/10 sample (QTHT/CB_NV_TW/CB_PD_TW/CB_NV_DP/CB_NV_BN/NHT×3/CG/TVV). cg_tw_01..06 không có CSV — sub cg_01. [seed-checklist-login.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-login.md)
- ✅ <a id="r7-0-5"></a>**R7.0.5** 🔄 Verify SCR-VIII-02 button [Thêm mới] visible
  - **Kết quả:** PASS — button uid 33_27 visible, 34 TK list. [seed-checklist-scr-viii-02-button.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-scr-viii-02-button.md)
- ⚠️ <a id="r7-0-6"></a>**R7.0.6** 🆕 Pre-test UI surface audit per SRS update `[~95% — 18 PASS / 4 FAIL / 3 DEFER sau dev fix 2 bug FR-07]`
  - **Kết quả:** 4 DEPLOY confirmed + 2 false pos RESOLVED + 2 NEW gap FR-07 → dev fix Closed 2026-05-06. [ui-surface-audit.md](../output/qa-reports/round7-2026-05-06/seed/ui-surface-audit.md)
  - **Bug:** [bug-report-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-r7-0-6-fr-07-buttons.md) — 2/2 đóng (FR07-UI-001/002 Major Closed)

---

## Phase 1 — Re-seed Tier 0 (qtht_01)

- ✅ <a id="r7-1-1"></a>**R7.1.1** 🔄 DM LINH_VUC_PL (6 LV)
  - **Kết quả:** PASS 12/6+ pre-existing cover 6 LV fixture. [seed-checklist-r7-1-1-linh-vuc-pl.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-1-linh-vuc-pl.md)
- ⚠️ <a id="r7-1-2"></a>**R7.1.2** 🔄 DM LOAI_DN (TNHH/CP/DNTN/HKD) `[~43% — 3/7, retest FAIL: 422→500 + spec contradiction]`
  - **Kết quả:** ⚠️ 3/7 — retest 16:14 FAIL: dev bỏ enum-guard nhưng BE 500 mọi POST. [seed-checklist-r7-1-2-loai-dn.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-2-loai-dn.md)
  - **Bug:** [bug-report-r7-1-2-loai-dn-be-enum-guard.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-r7-1-2-loai-dn-be-enum-guard.md) — 0/1 đóng (BUG-LOAI-DN-002 Major Open re-test FAIL)
- ✅ <a id="r7-1-3"></a>**R7.1.3** 🔄 DON_VI 7 đơn vị (TW + 3 BN + AG/BG/BNI)
  - **Kết quả:** PASS 7/7 pre-existing (BTP-TW + BKH/BTC/BCT + STP-AG/BG/BNI). [seed-checklist-r7-1-3-don-vi.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-3-don-vi.md)
- ✅ <a id="r7-1-4"></a>**R7.1.4** 🔄 SLA 4 loại (HOI_DAP 10d, VV 10d, HSHT 15d, HSTT 10d, hệ số 2.0)
  - **Kết quả:** PASS 4/4 pre-existing match spec, hệ số 2.0, cảnh báo 50/90%. [seed-checklist-r7-1-4-sla.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-4-sla.md)
- ✅ <a id="r7-1-5"></a>**R7.1.5** 🆕 Seed 5 ngày lễ 2026 qua API trực tiếp (FR-VIII-29)
  - **Kết quả:** PASS 15/5 khoảng (4 pre-existing + 11 seed mới qua POST `/api/v1/ngay-le`). [seed-checklist-r7-1-5-ngay-le.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-5-ngay-le.md)

---

## Phase 2 — Re-seed Tier 1 (master actor) — strict thứ tự FK

> **Dependency:** TC TV → TVV/CG (FK to_chuc_chinh_id phải HOAT_DONG); NHT seed → activate; account login → FK link.

- 🟢 <a id="r7-2-1"></a>**R7.2.1** 🔄 Seed 12 mẫu phản hồi (cover 6 LV × 2 mẫu/LV) `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.1.5 — PASS 12/12 qua UI (6 TW + 3 BN + 3 DP). [seed-checklist-MPH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-MPH.md)
  - **Bug R6:** [bug-report-seed-qtht.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-qtht.md) — 3/3 đóng (MPH-001/002/003)
- 🟢 <a id="r7-2-2"></a>**R7.2.2** 🆕 Seed 6 Tổ chức tư vấn qua UI hoặc API `[~0% — ready, **UI sub-menu "Tổ chức tư vấn" đã deploy** (R7.0.6 audit verified với cb_nv_tw_01, uid 34_1); nguồn to_chuc_tu_van_variants v2.7.1]`
- 🟢 <a id="r7-2-3"></a>**R7.2.3** 🆕 Phê duyệt TC TV → HOAT_DONG (FR-IV-NEW-04, CB PD cùng cấp) `[~0% — ready, sau R7.2.2 ✅]`
- 🟢 <a id="r7-2-4"></a>**R7.2.4** ✏️ Seed 15 DN qua FR-VIII-22 self-reg `[~0% — ready, flow đổi từ CB NV sang DN tự đăng ký; verify dev đã re-seed 30 record DN000001..030]`
  - **R6:** ✅ R6.2.1+2.2+2.3 — 50 pre-existing + 12 fixture v2.6.2 + 3 ĐP extension. [bug-report-fixture-seed-dn.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md)
  - **Bug R6:** 0/4 đóng (JWT Critical, DM polluted Major, Search Major, API schema Medium) — verify còn không sau dev deploy
- 🟢 <a id="r7-2-5"></a>**R7.2.5** ✏️ Seed 6 TVV TW (bỏ dia_ban_ids, MOI_DANG_KY) `[~0% — ready, fixture v2.7.1 bỏ dia_ban_ids; need R7.2.3 ✅ TC TV HOAT_DONG cho FK]`
  - **R6:** ✅ R6.2.4 — PASS 6/6 saved (TW-0001..0006). [bug-report-seed-tvv.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-tvv.md) 2/2 đóng
- 🟢 <a id="r7-2-6"></a>**R7.2.6** ✏️ Seed 6 CG TW (`loai_tvv=CG`, MOI_DANG_KY) `[~0% — ready, enum bỏ NHT chỉ còn TVV/CG]`
  - **R6:** ✅ R6.2.5 — Audit R12 chỉ 5/6 visible (TVV-0008 missing). Seed bù 2 CG R12 cover 6/6 LV
- 🟢 <a id="r7-2-7"></a>**R7.2.7** 🆕 Seed 3 NHT qua FR-IV-NHT-01 (entity NGUOI_HO_TRO mới) `[~0% — ready, **UI sub-menu "Người hỗ trợ pháp lý" đã deploy** (R7.0.6 uid 34_2). Endpoint singular /api/v1/nguoi-ho-tro 200 OK (R7.0.6) — DEPLOY-001 status changed; verify lại endpoint dùng tên gì khi seed]`
- 🟢 <a id="r7-2-8a"></a>**R7.2.8a** 🔄 QTHT tạo 6 account `cg_tw_01..06` `[~0% — ready, was R6.2.7 phần CG; need R7.2.6 ✅]`
  - **R6:** ✅ R6.2.7 (split phần cg) — PASS 6/6. [seed-checklist-account.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-account.md)
- ⏳ <a id="r7-2-8b"></a>**R7.2.8b** 🔄 QTHT tạo 3 account `nht_ag_01/dn_01/hp_01` `[need: R7.2.7 ✅ NHT entity]`
  - **R6:** ✅ R6.2.7 (split phần nht) — PASS 3/3
- ⏳ <a id="r7-2-9"></a>**R7.2.9** ✏️ Activate 9 accounts qua FR-VIII-26 (kích hoạt TK lần đầu) `[need: R7.2.8a ✅ + R7.2.8b ✅; flow đổi từ activate trực tiếp sang bấm link mail]`
  - **R6:** ✅ R6.2.8 — PASS 9/9 active. nht_ag_01 login + role NHT OK
- 🟢 <a id="r7-2-10"></a>**R7.2.10** 🔄 Cấu hình PC mặc định Đợt 1 — 6 LV → cb_nv_tw_01 `[~0% — ready, was R6.2.9a]`
  - **R6:** ✅ R6.2.9a — PASS 6/6. [seed-checklist-cau-hinh-PC.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-cau-hinh-PC.md)

---

## Phase 3 — Re-seed Tier 2 (transactional entry state)

- ✅ <a id="r7-3-1"></a>**R7.3.1** 🔄 Seed 6 Hỏi đáp entry MOI cover 6 LV × 4 kênh
  - **Kết quả:** PASS 6/6 HD-20260506-001..006 cover 6 LV × 4 kênh. [seed-checklist-r7-3-1-hd.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-1-hd.md)
- ✅ <a id="r7-3-2"></a>**R7.3.2** 🔄 Seed 6 VV entry DA_TIEP_NHAN cover 6 LV (top up pre-existing 10)
  - **Kết quả:** PASS 16/16 (10 cũ + 6 mới VV-BTP-TW-20260506-001..006). Pre-existing chỉ 2 LV → seed thêm 4 LV. [seed-checklist-r7-3-2-vv.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-2-vv.md)
- ✅ <a id="r7-3-3"></a>**R7.3.3** ✏️ Seed 10 TVCS entry TIEP_NHAN cover 6 LV (endpoint thực `/api/v1/noi-dung-tu-van-cs`)
  - **Kết quả:** PASS 10/10 TVCS-20260506-0001..0010. 5/10 fail VIDEO_CALL → retry HO_SO. [seed-checklist-r7-3-3-tvcs.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-3-tvcs.md)
  - **Bug:** [bug-report-r7-3-3-tvcs-video-call-500.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-r7-3-3-tvcs-video-call-500.md) — 0/1 đóng (Major BE 500 hinhThucTv=VIDEO_CALL)
- 🟢 <a id="r7-3-4"></a>**R7.3.4** 🔄 Seed 10 HSPL DN cover 5 loại × 3 state × 5 DN `[~0% — ready, need R7.2.4 ✅]`
  - **R6:** ✅ R6.3.4 — PASS 10/10 HSPL-20260503-0001..0004. Per-filter HIEU_LUC=8/HET_HAN=1/THU_HOI=1/KHAC=1
- ⏳ <a id="r7-3-5"></a>**R7.3.5** 🆕 Seed Kế hoạch ĐT năm (KE_HOACH_DAO_TAO — Mô hình A 3 cấp) `[need: dev confirm endpoint deploy]`
- 🟢 <a id="r7-3-6"></a>**R7.3.6** ✏️ Seed 6 CTĐT entry DU_THAO `[~0% — ready, was R6.3.5; need R7.3.5 ✅; entry DU_THAO theo SM-CTDT mới]`
  - **R6:** ✅ R6.3.5 — PASS 6/6 CTDT-BTP-TW-2026-0001..0006. [r6-3-5-ctdt-list-6du-thao.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-5-ctdt-list-6du-thao.png)
- 🟢 <a id="r7-3-7"></a>**R7.3.7** 🔄 Seed 4 thư mục + 7 biểu mẫu entry NHAP `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.7 — PASS 4 thư mục + 7/7 BM-20260501-001..007 (6 docx + 1 xlsx). [r6-3-7-bieumau-list-7nhap.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-7-bieumau-list-7nhap.png)
- 🟢 <a id="r7-3-8"></a>**R7.3.8** 🔄 Seed 10 NHCH entry NHAP `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.8a — PASS 10/10 per-filter. [seed-checklist-NHCH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-NHCH.md)
- 🟢 <a id="r7-3-9"></a>**R7.3.9** 🔄 Seed 5 ĐKT entry NHAP cover 5 LV `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.8b — PASS 5/5 cover 5 LV. THU_CONG only. NGAU_NHIEN block do BE filter NHCH `trangThai=CONG_KHAI`. [seed-checklist-DKT.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DKT.md)
- 🟢 <a id="r7-3-10"></a>**R7.3.10** 🔄 Seed 8 bài giảng entry KICH_HOAT `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.9 — PASS 8/8 (4 Slide + 1 PDF + 3 Video). [seed-checklist-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-baigiang.md)
  - **Bug R6:** [bug-report-seed-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-baigiang.md) — 1/1 đóng (BUG-FUNC-BAIGIANG-001 CLOSED)
- 🟢 <a id="r7-3-11"></a>**R7.3.11** ✏️ Seed 8 giảng viên entry HOAT_DONG (verify FR-III-11 refactor) `[~0% — ready]`
  - **R6:** ✅ R6.3.10 — PASS 8/8 GV-BTP-TW-0001..0008 cover 6 LV + 6 GV/2 TG. [seed-checklist-GiangVien.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-GiangVien.md)
- 🚫 <a id="r7-3-12"></a>**R7.3.12** 🆕 Seed 8 Học viên (HOC_VIEN entity mới — Mô hình A) `[block: dev fix entity 404 /api/v1/hoc-viens]`
- 🚫 <a id="r7-3-13"></a>**R7.3.13** 🆕 Seed Lịch học (LICH_HOC — FR-III-22) `[block: chưa rõ endpoint deploy]`
- ⏳ <a id="r7-3-14"></a>**R7.3.14** 🆕 Seed 6 Hợp đồng TV entry DANG_THUC_HIEN cover 6 LV `[need: R7.4.A1 ✅ TVV active + R7.4.A3 ≥1 VV HOAN_THANH; unblock R7.7.14 functional]`
- ⏳ <a id="r7-3-15"></a>**R7.3.15** 🆕 Seed 8 Khóa học entry DU_THAO direct (bypass workflow B7 nếu block) cover 6 LV + 2 hình thức `[need: R7.3.6 ✅ CTĐT DU_THAO; unblock R7.7.6 functional 40 TC khi B7 block dev]`

---

## Phase 4 — Workflow E2E (multi-role)

### 🟦 Trụ A — TVV → PC → CG → VV → HD → TVCS

- ⏳ <a id="r7-4-a1"></a>**R7.4.A1** ✏️ Workflow TVV (SM 9→**10 state**, thêm CHO_KICH_HOAT, hệ thống tự cấp TK qua FR-VIII-15 step 6) `[need: R7.2.5 ✅ + R7.2.6 ✅; spec: 7.4-chuyen-gia-tvv.md + 6.4-sm-tvv.md (sync 2026-05-06)]`
  - **R6:** ✅ R6.4.A1 — PASS 10/10 CMS-scope (12 bước). B7+B8 (FR-IV-11) ngoài scope qua Portal. [workflow-test-report-TVV.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVV.md)
- ⏳ <a id="r7-4-a1-cg"></a>**R7.4.A1-CG** ✏️ Advance state 6 CG → DANG_HOAT_DONG (loai_tvv enum đổi) `[need: R7.2.6 ✅]`
  - **R6:** ✅ R6.4.A1-CG — PASS 6/6 CG (4 + 2 bonus seed LĐ/Thuế). Pool 12/12. [workflow-test-report-CG.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CG.md)
- ⏳ <a id="r7-4-a1-5"></a>**R7.4.A1.5** ✏️ Đợt 2 PC TVV backfill — verify dropdown "Người xử lý" có TAI_KHOAN role NHT mới sau khi NHT tách entity `[need: R7.4.A1 ✅ + R7.4.A1-CG ✅; verify 2 BE bug Open R6 (CHPC-001/002) còn không sau dev deploy]`
  - **R6:** ⚠️ R6.4.A1.5 ~95% — 12/12 PC config done, 2 BE bug Open
  - **Bug R6:** [bug-report-flow-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-vuviec.md) — 0/2 đóng (BUG-FUNC-CHPC-001/002)
- ⏳ <a id="r7-4-a2"></a>**R7.4.A2** 🆕 Tiếp nhận TVV (FR-IV-13) — 3 transition mới (MOI_DANG_KY→CHO_THAM_DINH, YEU_CAU_BO_SUNG→DANG_THAM_DINH, TU_CHOI→CHO_THAM_DINH) `[need: R7.4.A1 ≥1 TVV MOI_DANG_KY]`
- ⏳ <a id="r7-4-a3"></a>**R7.4.A3** ✏️ Workflow VV (FK `nguoi_ho_tro_id` đổi target sang NGUOI_HO_TRO) `[need: R7.2.9 ✅ NHT active; block khi NHT entity chưa deploy]`
  - **R6:** ✅ R6.4.A3 — PASS 12/12 CMS DB (R8 happy 7/12 + R9 reject/edge 5/12). [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ⏳ <a id="r7-4-a4"></a>**R7.4.A4** ✏️ Workflow Hỏi đáp (dropdown phân công NHT/TVV/CB tách 2 entity) `[need: R7.2.9 ✅]`
  - **R6:** ✅ R6.4.A4 — PASS 11/11 transition. ERR-PH-01 + BR-FLOW-01/04 + push Cổng PLQG verified. [workflow-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HoiDap.md)
- ⏳ <a id="r7-4-a5"></a>**R7.4.A5** ✏️ Workflow TVCS 11 bước (dropdown CG enum đổi) `[need: R7.2.6 ✅ + R7.3.3 ✅]`
  - **R6:** ⚠️ R6.4.A5 ~27% — 3/11 PASS (R17 fix TVCS-002), 6 BLOCKED FK + 2 external. [workflow-test-report-TVCS.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVCS.md)
  - **Bug R6:** [bug-report-flow-tvcs.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-tvcs.md) — 0/2 Open (TVCS-001/002 Closed R17)

### 🟩 Trụ B — Đào tạo

- ⏳ <a id="r7-4-b0"></a>**R7.4.B0** 🆕 Workflow KH năm (SM-KH-DAO-TAO refinement TU_CHOI→CHO_DUYET) `[need: R7.3.5 ✅]`
- ⏳ <a id="r7-4-b1"></a>**R7.4.B1** ✏️ Workflow CTĐT SM-CTDT mới (DU_THAO→CHO_DUYET→DA_DUYET) `[need: R7.3.6 ✅; UNBLOCKED — SRS update giải quyết spec contradiction R6.4.B2]`
  - **R6:** 🚫 R6.4.B2 + B2.5 — block spec contradiction. R11 BLOCK 0/2 transition, 6/6 CTĐT stuck DU_THAO. [workflow-test-report-CTDT.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTDT.md)
  - **Bug R6:** [bug-report-flow-ctdt.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-ctdt.md) — 0/1 đóng — verify dev fix kèm SRS update có đóng không
- ⏳ <a id="r7-4-b5b"></a>**R7.4.B5b** 🔄 Publish NHCH NHAP→CONG_KHAI `[need: R7.3.8 ✅]`
  - **R6:** ✅ R6.4.B5b — PASS 11/11 per-filter. NGAU_NHIEN ĐKT R6.3.8b unblock. [workflow-test-report-NHCH-publish.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-NHCH-publish.md)
- ⏳ <a id="r7-4-b7"></a>**R7.4.B7** ✏️ Workflow KH SM-KHOAHOC 11 state (thêm TU_CHOI + TU_CHOI_KQ) — 12 bước `[need: R7.4.B1 ✅ DA_DUYET; UNBLOCKED]`
  - **R6:** 🚫 R6.4.B7 — cascade B2.5 block. 0 KH state DU_THAO
- ⏳ <a id="r7-4-b10"></a>**R7.4.B10** 🆕 Workflow Đề kiểm tra (FR-III-NEW-01/02/03) — tạo + phân phối + map bài giảng `[need: R7.3.9 ✅ + R7.4.B5b ✅]`
- ⏳ <a id="r7-4-b11"></a>**R7.4.B11** 🆕 Phê duyệt khóa học (FR-III-21) `[need: R7.4.B7 ≥1 KH DA_KET_THUC]`
- ⏳ <a id="r7-4-b12"></a>**R7.4.B12** 🆕 Quản lý lịch học (FR-III-22) `[need: R7.3.13 ✅]`

### 🟨 Trụ C — Biểu mẫu

- 🟢 <a id="r7-4-c1"></a>**R7.4.C1** 🔄 Workflow Biểu mẫu NHAP→CONG_KHAI→AN `[~0% — ready, need R7.3.7 ✅]`
  - **R6:** ✅ R6.4.C1 — PASS 3/3 transition SM-BIEUMAU. Sync "Đã đồng bộ" verified. [workflow-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-BieuMau.md)

### 🟧 Trụ D — Đánh giá HQ + Kho QA

- 🟢 <a id="r7-4-d1"></a>**R7.4.D1** 🔄 Tạo kỳ Đánh giá HQ entry LAP_KE_HOACH `[~0% — ready]`
  - **R6:** ✅ R6.4.D1 — PASS 1/1 DG-20260502-0001. [seed-checklist-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DanhGiaHQ.md)
- ⏳ <a id="r7-4-d2"></a>**R7.4.D2** ✏️ Workflow Đánh giá HQ 11 bước `[need: R7.4.D1 ✅; UNBLOCKED — dev item 2 fix bug FR-08 5 bug FE]`
  - **R6:** 🚫 R6.4.D2 — R14 BLOCKED 1/11 PASS B1 do 5 bug FE. [workflow-test-report-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-DanhGiaHQ.md)
  - **Bug R6:** [bug-report-flow-danhgia.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-danhgia.md) — 0/5 đóng — verify dev item 2 fix kèm có đóng không
- ⏳ <a id="r7-4-d3"></a>**R7.4.D3** ✏️ Tạo Kho QA `[need: dev item 4 fix bug R6.4.D3]`
  - **R6:** ⚠️ R6.4.D3 ~50% — UI route block FE. THU_CONG 1 record qua API, TU_DONG=0. [seed-checklist-KhoQA.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-KhoQA.md)
  - **Bug R6:** [bug-report-flow-kho-qa.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-kho-qa.md) — 0/1 đóng (BUG-KHOQA-001 Critical)

---

## Phase 5 — Verification

- ⏳ <a id="r7-5-1"></a>**R7.5.1** ✏️ Dashboard KPI counter HD/VV/TVCS/CT (KPI-07 count đổi do NHT tách entity) `[need: R7.4.A1/A3/A4/A5 ✅]`
  - **R6:** ✅ R6.5.1 PASS 5/5 (HD 64, VV 100/65/1). Obs Major count mismatch 65 vs 14. [report](../output/qa-reports/round6-2026-05-01-postreset/workflow/verification-test-report-DashboardKPI.md)
- 🟢 <a id="r7-5-2"></a>**R7.5.2** 🔄 Cross-module DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả ≥1 record/tab `[~0% — ready, need R7.3.4 ✅ + R7.4.A3 ✅ + R7.6.1 ✅]`
  - **R6:** ✅ R6.5.2 PASS 3/3 tab DN000001 (HSPL 6, VV 2, HSCT 2). 5 obs UI polish. [report](../output/qa-reports/round6-2026-05-01-postreset/workflow/verification-test-report-CrossModule-DN.md)
- ⏳ <a id="r7-5-3"></a>**R7.5.3** ✏️ SLA cảnh báo banner — verify trừ ngày lễ (BR-CALC-03) `[need: R7.1.5 ✅ + ≥1 HD/VV deadline >70%]`
  - **R6:** ⏳ R6.5.3 — chờ thời gian hoặc dev seed lùi ngày
- 🟢 <a id="r7-5-4"></a>**R7.5.4** 🔄 BC04 export Excel có data `[~0% — ready, need R7.4.A3 + R7.4.A4 ✅]`
  - **R6:** ⚠️ R6.5.4 FAIL 2/6 — BC HD + BC04 VV load OK, export Excel trả JSON wrap. [report](../output/qa-reports/round6-2026-05-01-postreset/workflow/verification-test-report-BaoCao-Export.md) · [bug](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-bao-cao.md) 0/2 đóng
- 🟢 <a id="r7-5-5"></a>**R7.5.5** 🔄 Audit log ≥100 entry qua Nhật ký HT (FR-VIII-28) `[~0% — ready, accumulate qua Phase 4]`
  - **R6:** ✅ R6.5.5 PASS 5/5 — 1270 entries (12.7× acceptance), filter CREATE → 333. [report](../output/qa-reports/round6-2026-05-01-postreset/workflow/verification-test-report-AuditLog.md)

---

## Phase 6 — Workflow đầu ra hậu kỳ (mapping R5 P3)

- ⏳ <a id="r7-6-1"></a>**R7.6.1** 🔄 Workflow Chi trả 13 bước `[need: data fresh sau reset; verify 100 record HSCT còn không]`
  - **R6:** ⚠️ R6.6.1 ~75% — R19 PASS 6/8 transition, 6/7 bug closed, 1 Open scope shift. [workflow-test-report-ChiTra.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-ChiTra.md)
  - **Bug R6:** [bug-report-flow-chi-tra.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-chi-tra.md) — 6/7 đóng R19 (1 Open scope shift CT-005-BE)
- ⏳ <a id="r7-6-2"></a>**R7.6.2** 🔄 Workflow TV nhanh nhập tay (5 trạng thái) `[need: R7.4.D3 ✅ Kho QA UI]`
  - **R6:** ⏳ R6.6.2 — block do D3 UI defer FE
- ⏳ <a id="r7-6-3"></a>**R7.6.3** 🔄 Workflow TV nhanh PUBLIC (DN qua Cổng PLQG) `[need: R7.E4 ✅ + R7.7.16 API ✅]`
  - **R6:** ⏳ R6.6.3 — external integration
- 🟢 <a id="r7-6-4"></a>**R7.6.4** 🔄 Workflow CT HTPLDN GĐ1 11 bước `[~0% — ready, verify 3 CT data (CT-001/002/003) còn không]`
  - **R6:** ✅ R6.6.4 — PASS 11/11 transitions. CT-001 Hoàn thành / CT-002 Dự thảo / CT-003 Đã hủy. [workflow-test-report-CTHTPLDN-GD1.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTHTPLDN-GD1.md)
- ⏳ <a id="r7-6-5"></a>**R7.6.5** 🔄 Workflow CT HTPLDN GĐ2 Đợt BC 7 bước `[need: R7.6.4 ✅ + R7.6.1 ≥6 Chi trả + R7.4.A3 ≥6 VV HOAN_THANH]`
  - **R6:** ⏳ R6.6.5 — chờ R6.6.1 + R6.4.A3

---

## Phase 7 — Functional 17 module + 2 NEW (negative + edge + 40 TC perm)

- ⏳ <a id="r7-7-1"></a>**R7.7.1** 🔄 Hỏi đáp 12 TC `[need: R7.3.1 ✅]`
  - **R6:** ⚠️ R6.7.1 ~92% — 11/12 PASS, 1 PARTIAL HD-022 chờ dev seed lùi ngày. 0 bug. [functional-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-HoiDap.md)
- ⏳ <a id="r7-7-2"></a>**R7.7.2** ✏️ CG/TVV 31 TC (enum loai_tvv đổi) `[need: R7.2.5/6 ✅]`
  - **R6:** ⚠️ R6.7.2 ~16% — 5/31 PASS, 2 BUG perm Critical/Major. [functional-test-report-CGTVV.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-CGTVV.md)
  - **Bug R6:** [bug-report-functional-cgtvv.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-cgtvv.md) — 0/2 đóng (CGTVV-001 QTHT bypass + CGTVV-002 CG GET 403)
- ⏳ <a id="r7-7-3"></a>**R7.7.3** 🔄 Vụ việc 12 TC `[need: R7.3.2 ✅]`
  - **R6:** ⚠️ R6.7.3 ~92% — 11/12 PASS, 1 FAIL VV-013d. [functional-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-VuViec.md)
  - **Bug R6:** [bug-report-functional-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-vuviec.md) — 0/1 đóng (VV-001 TVV bypass)
- ⏳ <a id="r7-7-4"></a>**R7.7.4** ✏️ DN 8 TC (flow tạo đổi sang FR-VIII-22 self-reg) `[need: R7.2.4 ✅]`
  - **R6:** ⚠️ R6.7.4 ~88% — 7/8 PASS, 1 PARTIAL DN-007 UX guard. 0 bug. [functional-test-report-DoanhNghiep.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-DoanhNghiep.md)
- ⏳ <a id="r7-7-4-5"></a>**R7.7.4.5** 🆕 NHT functional 10 TC (CRUD + permission + workflow kích hoạt) `[need: R7.2.9 ✅ + R7.4.A2 ✅]`
- ⏳ <a id="r7-7-4-6"></a>**R7.7.4.6** 🆕 TC TV functional 10 TC (CRUD + permission + phê duyệt edge) `[need: R7.4.B1 ✅ — wait actually R7.2.3 ✅]`
- ⏳ <a id="r7-7-5"></a>**R7.7.5** 🔄 TVCS 44 TC `[need: R7.4.A5 ✅; UNBLOCKED]`
  - **R6:** 🚫 R6.7.5 — cascade A5 block (B3-B11 FK)
- ⏳ <a id="r7-7-6"></a>**R7.7.6** ✏️ Khóa học 40 TC + FR-III mới (B10/B11/B12 + Đề KT + Lịch học) `[need: R7.4.B7+B10+B11+B12 ✅]`
  - **R6:** 🚫 R6.7.6 — cascade B7/B2/B2.5 block spec contradiction
- ⏳ <a id="r7-7-7"></a>**R7.7.7** ✏️ Dashboard 34 TC (KPI-07 count đổi) `[need: R7.4 trụ A ✅]`
  - **R6:** ⚠️ R6.7.7 PASS 19/34 + FAIL 3 + PARTIAL 5 + DEFER 7 (Pass 55.9%, Health 62/100). [report](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-Dashboard.md) · [bug](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-functional-dashboard.md) 0/5 đóng
- 🟢 <a id="r7-7-8"></a>**R7.7.8** 🔄 QTHT 8 TC `[~0% — ready, re-test sample sau reset]`
  - **R6:** ✅ R6.7.8 — PASS 8/8 (QT-010/017/025-027/029-032). 0 bug. [functional-test-report-QTHT.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-QTHT.md)
- ⏳ <a id="r7-7-9"></a>**R7.7.9** ✏️ Đánh giá HQ 40 TC `[need: R7.4.D2 ✅; UNBLOCKED]`
  - **R6:** 🚫 R6.7.9 — cascade D2 block (5 bug FE)
- 🟢 <a id="r7-7-10"></a>**R7.7.10** 🔄 Biểu mẫu 7 TC `[~0% — ready, was R6.7.10 ⚠️ 71%]`
  - **R6:** ⚠️ R6.7.10 ~71% — 5/7 PASS (BM-013/032/034-036/039). BM-026 chờ thư mục rỗng. BUG-BM-001 Minor. [functional-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-BieuMau.md)
- ⏳ <a id="r7-7-11"></a>**R7.7.11** 🔄 TV nhanh 39 TC `[need: R7.6.2 ✅ + R7.4.D3 ✅]`
  - **R6:** ⏳ R6.7.11 — cascade D3 UI defer
- 🟢 <a id="r7-7-12"></a>**R7.7.12** 🔄 Chi trả 30 TC `[~0% — ready, was R6.7.12 🟢]`
  - **R6:** ⚠️ R6.7.12 PASS-WITH-NOTE 16/30 + FAIL 1 + DEFER 13. Perm 7/7 PASS, UI negative 5/5. [report](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-ChiTra.md) · [bug](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-functional-chi-tra.md) 0/1 đóng
- ⏳ <a id="r7-7-13"></a>**R7.7.13** 🔄 Báo cáo 38 TC `[need: ≥1 BC từ HD/VV/TVCS/CT/Đào tạo ready]`
  - **R6:** ⏳ R6.7.13 — chỉ HD ✅ + VV ✅ → 4-5/38 BC ready (12% scope)
- ⏳ <a id="r7-7-14"></a>**R7.7.14** 🔄 HĐ tư vấn (UC163 sub-resource v2.1) `[need: R7.4.A3 + R7.4.A1 ✅]`
  - **R6:** ⚠️ R6.7.14 ~55% — 5/9 PASS-WITH-NOTE. 4 bug Active. [workflow-test-report-HopDongTuVan.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HopDongTuVan.md)
  - **Bug R6:** [bug-report-flow-hop-dong.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-hop-dong.md) — 0/4 đóng (3 Major + 1 Medium)
- ⏳ <a id="r7-7-15"></a>**R7.7.15** 🔄 CT HTPLDN 42 TC `[need: R7.6.4 ✅]`
  - **R6:** ⏳ R6.7.15 — R6.6.4 unblock 1 phần, R6.6.5 vẫn chờ
- ⏳ <a id="r7-7-16"></a>**R7.7.16** 🔄 API 42 TC + 8 API inbound mock `[need: data upstream state cuối từ HD/VV/TVCS/Chi trả/CT/TVN]`
  - **R6:** ⏳ R6.7.16
- ⏳ <a id="r7-7-17"></a>**R7.7.17** 🔄 Edge BR-EC-01..23 (4 BR scope) `[need: infra/wait/integration cho 19 BR còn lại]`
  - **R6:** ⚠️ R6.7.17 ~17% — 4 PASS (BR-EC-12 + 3 gián tiếp), 19 chờ. 0 bug. [functional-test-report-Edge-BR-EC.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-Edge-BR-EC.md)

---

## Phase 8 — Cross-cutting + Profile + Permission

- 🟢 <a id="r7-8-1"></a>**R7.8.1** 🆕 Verify hard delete (DELETE → record không còn trong GET list) `[~0% — ready, item 9 dev list; mâu thuẫn SRS modal MD-XOA vẫn ghi xóa mềm]`
- 🟢 <a id="r7-8-2"></a>**R7.8.2** 🆕 Verify bỏ ClamAV (upload `.exe` → BE behavior, security regression risk) `[~0% — ready, item 10 dev list]`
- 🟢 <a id="r7-8-3"></a>**R7.8.3** 🆕 Verify bỏ lưu nháp scope hẹp (button [Lưu nháp] bỏ, state DU_THAO/NHAP/MOI_DANG_KY giữ) `[~0% — ready, scope HẸP verified từ SRS]`
- 🟢 <a id="r7-8-4"></a>**R7.8.4** 🆕 Profile + đổi MK self-service (ho-so-doi-mat-khau.md) `[~0% — ready, verify 3 mâu thuẫn FR-VIII-26]`
- 🟢 <a id="r7-8-5"></a>**R7.8.5** 🆕 Permission 49 entity × 11 role sample 40 TC/module `[~0% — ready, was R5 scope]`

---

## 🟥 Trụ E — Theo dõi unblock (xuyên suốt R7, không gate)

- 🟢 <a id="r7-e1"></a>**R7.E1** 🔄 HĐ tư vấn (FR-X3-01) — sub-resource VV/TVV `[~0% — ready, verify URL 404 đúng spec v2.1]`
  - **R6:** ✅ R6.E1 — sub-resource trong VV/TVV detail. URL 404 đúng spec
- 🟢 <a id="r7-e2"></a>**R7.E2** 🔄 CT HTPLDN GĐ1 (FR-15) — verify 3 CT data còn `[~0% — ready, verify CT-001/002/003 còn]`
  - **R6:** ✅ R6.E2 — 3 CT tồn tại sau R6.6.4 PASS 2026-05-05
- 🟢 <a id="r7-e3"></a>**R7.E3** 🔄 Chi trả (FR-06) — verify 100 record HSCT còn `[~0% — ready, verify HSCT000001..100 còn]`
  - **R6:** ✅ R6.E3 — 100 record HSCT000001..100 sẵn (3 states), verified 2026-05-04
- ⏳ <a id="r7-e4"></a>**R7.E4** 🔄 TV nhanh (FR-13.A) — ≥1 phiên tồn tại `[need: R7.6.2 + R7.6.3]`
  - **R6:** ⚠️ R6.E4 PARTIAL 4/5 — menu/UI/GET 200 OK, seed BLOCKED by-design (POST 401, FR-13 mTLS Cổng PLQG). [report](../output/qa-reports/round6-2026-05-01-postreset/workflow/verification-test-report-TVNhanh-Monitor.md)

---

## 🔓 Open issues — defer log bug khi gặp behavior thực tế

- **Item 3 BA câu:** Migration record cũ `loai_tvv = 'NHT'` chuyển sang NGUOI_HO_TRO ra sao? `[trigger ở R7.4.A2 / R7.7.2]`
- **Item 6 BA câu:** Migration DN cũ tạo bằng CB NV → có cần convert TK-first không? `[trigger ở R7.7.4]`
- **Item 9 BA câu:** DN không email/chưa ĐKKD vào hệ thống bằng cách nào? `[trigger ở R7.2.4]`
- **Item 11 BA câu:** NGAY_LE seed danh sách 2026 — BA cấp file Excel chính thức? `[trigger ở R7.1.5]`

---

## Bug deploy gap (gửi dev — log riêng)

[bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-deploy-gap.md) — **6 bug** verified MCP với role đúng (3 Major + 2 Medium + 1 Minor):

1. **DEPLOY-001 Major** — Entity NGUOI_HO_TRO endpoint plural `/nguoi-ho-tros` 404 (R7.0.2). **Status changed:** R7.0.6 audit verify endpoint singular `/nguoi-ho-tro` 200 OK → có thể đã đổi tên hoặc fix song song. **Không còn block R7.2.7** — verify lại endpoint actual khi seed.
2. **DEPLOY-002 Major** — Entity HOC_VIEN BE 404 — block R7.3.12
3. **DEPLOY-003 Major** — 4 sub-menu Đào tạo mới chưa thêm (KH năm/Lịch học/Đề KT/Học viên)
4. **DEPLOY-004 Medium** — UI Quản lý ngày lễ chưa có (cả 2 option SRS — Cấu hình HT 4 tab + Danh mục dùng chung 14 mục)
5. **DEPLOY-005 Minor** — Filter TVV label "Địa bàn" sai spec "Đơn vị quản lý" (data source đúng)
6. **DEPLOY-006 Medium** — Tab "Chờ thẩm định" thiếu trên SCR-IV-01 (web 6 tab, SRS quy định 7 tab)

> **R7.0.6 audit thêm 2 bug FR-07 — log file riêng:** [bug-report-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-r7-0-6-fr-07-buttons.md) (FR07-UI-001 Major button [Thêm mới] + FR07-UI-002 Major button [Import Excel]).

> **2 bug dropped (false positive 2026-05-06):** Sub-menu "Tổ chức tư vấn" + "Người hỗ trợ pháp lý" — verify đầu dùng QTHT (không có quyền per SCR-IV-01 line 1474-1477) nên không thấy. Retest với `cb_nv_tw_01` → 2 sub-menu hiện đầy đủ. Bài học: [`tasks/lessons-learned.md` 2026-05-06](lessons-learned.md).
