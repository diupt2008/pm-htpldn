# TODO — QA HTPLDN Round 7 (apply SRS update 2026-05-05)

**App:** http://103.172.236.130:3000/ · **MailHog:** http://103.172.236.130:8025  
**Plan:** [plan.md](plan.md) v2.6.5 · **Plan trigger:** [plan-r7-trigger.md](plan-r7-trigger.md) · **Spec data:** [seed-fixture.yaml v2.7.2](../input/data/seed-fixture.yaml)  
**R6 frozen:** [_archive/round6-frozen-2026-05-06.md](_archive/round6-frozen-2026-05-06.md) (74 task, ref lịch sử)  
**Spec sync chi tiết R7:** [session-handoff-r7-spec-sync.md](session-handoff-r7-spec-sync.md)  
**Today:** 2026-05-06

**Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream  
**Tag kế thừa R6:** 🔄 KEPT (spec không đổi, re-seed/re-test) · ✏️ MODIFIED (spec đổi) · 🆕 NEW (feature SRS update)

---

## Tổng hợp Round 7

| Phase | Việc | Tổng | 🟢 | 🔵 | ✅ | ⚠️ | 🚫 | ⏳ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | Pre-test (verify deploy + bug gap + fixture + spec review) | 7 | - | - | 5 | 2 | - | - |
| 1 | Re-seed Tier 0 (DM/đơn vị/SLA/MPH/ngày lễ) | 6 | - | - | 5 | 1 | - | - |
| 2 | Re-seed Tier 1 (TC TV/DN/TVV/CG/NHT/account) | 8 | - | - | 7 | - | 1 | - |
| 3 | Re-seed Tier 2 (transactional entry state) +**3 sub-task FR-02/X.2 v3.5** (R7.3.1.MoB + R7.3.1.TVN + R7.3.16 Kho QA) | 18 | 2 | - | 7 | 1 | 5 | 3 |
| 4 | Workflow E2E (Trụ A/B/C/D) +**3 task v3.5** (R7.4.A3-PUBLIC + R7.4.A3-DN-BS + R7.4.D3.AUTO) | 23 | 3 | - | 1 | 2 | - | 17 |
| 5 | Verification (KPI/cross/SLA/audit) | 5 | 3 | - | - | - | - | 2 |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TVN/CT) | 5 | 1 | - | - | - | 1 | 3 |
| 7 | Functional 17 module + 2 NEW + **4 sub-task FR-06 v3.5** | 29 | 5 | - | 4 | 4 | 2 | 14 |
| 8 | Cross-cutting + Profile + Permission +**R7.8.6 UC renumber FR-11 v3.5** | 6 | 2 | - | 1 | 3 | - | - |
| Trụ E | Monitor unblock | 4 | - | - | 2 | 1 | - | 1 |
| **Tổng** | | **111** | **16** | **0** | **32** | **14** | **9** | **40** |

---

## Mục lục theo Module (click ID để jump)

| Module | Tasks |
|---|---|
| **Pre-test** | ✅ [R7.0.1](#r7-0-1) deploy · ⚠️ [R7.0.2](#r7-0-2) bug-deploy · ✅ [R7.0.3](#r7-0-3) fixture · ✅ [R7.0.4](#r7-0-4) login · ⚠️ [R7.0.6](#r7-0-6) UI-audit · ✅ [R7.0.7](#r7-0-7) SRS-FR10-review |
| **TVV** | ✅ [R7.2.5](#r7-2-5) seed · 🟢 [R7.4.A1](#r7-4-a1) workflow · ⏳ [R7.4.A1.5](#r7-4-a1-5) PC · 🟢 [R7.4.A2](#r7-4-a2) tiếp-nhận · 🟢 [R7.7.2](#r7-7-2) functional |
| **CG** | ✅ [R7.2.6](#r7-2-6) seed · ⚠️ [R7.4.A1-CG](#r7-4-a1-cg) advance · 🟢 [R7.7.2](#r7-7-2) functional (chung TVV) |
| **NHT** 🆕 | ✅ [R7.2.7](#r7-2-7) seed (auto-tạo TK qua FR-VIII-15) · 🟢 [R7.7.4.5](#r7-7-4-5) functional |
| **TC TV** 🆕 | ✅ [R7.2.2](#r7-2-2) seed · ✅ [R7.2.3](#r7-2-3) phê-duyệt · 🟢 [R7.7.4.6](#r7-7-4-6) functional |
| **DN** | ✅ [R7.2.4](#r7-2-4) seed · 🚫 [R7.3.4](#r7-3-4) HSPL · 🟢 [R7.5.2](#r7-5-2) cross-module · 🟢 [R7.7.4](#r7-7-4) functional v3.5 |
| **Hỏi đáp** ✏️ v3.5 | ✅ [R7.3.1](#r7-3-1) seed · 🚫 [R7.4.A4](#r7-4-a4) workflow 2/11 (DA_PHAN_CONG transition missing) · ⏳ [R7.7.1](#r7-7-1) functional 60 TC v3.5 · ✅ [R7.3.1.MoB](#r7-3-1-mob) seed Mẫu Mô hình B (UI Tab Mẫu phản hồi) 🆕 · 🟢 [R7.3.1.TVN](#r7-3-1-tvn) seed TVN ESCALATE (UI FR-13) 🆕 |
| **Vụ việc** ✏️ | ✅ [R7.3.2](#r7-3-2) seed · ⏳ [R7.4.A3](#r7-4-a3) workflow base · ⏳ [R7.4.A3-PUBLIC](#r7-4-a3-public) công khai 🆕 · ⏳ [R7.4.A3-DN-BS](#r7-4-a3-dn-bs) DN bổ sung HS 🆕 · ⏳ [R7.7.3](#r7-7-3) functional 72 TC · ⏳ [R7.7.3-PRIVACY](#r7-7-3-privacy) 2 TC P0 Critical 🆕 |
| **TVCS** | ✅ [R7.3.3](#r7-3-3) seed · ⚠️ [R7.4.A5](#r7-4-a5) workflow 3/11 · ⚠️ [R7.7.5](#r7-7-5) functional 31/61 |
| **HĐ TV** ✏️ | ⏳ [R7.3.14](#r7-3-14) seed · ⏳ [R7.7.14](#r7-7-14) functional · ✅ [R7.E1](#r7-e1) monitor |
| **KH năm** 🆕 | ⏳ [R7.3.5](#r7-3-5) seed · ⏳ [R7.4.B0](#r7-4-b0) workflow |
| **CTĐT** | 🚫 [R7.3.6](#r7-3-6) seed · ⏳ [R7.4.B1](#r7-4-b1) workflow |
| **Khóa học** | ⏳ [R7.3.15](#r7-3-15) seed · ⏳ [R7.4.B7](#r7-4-b7) workflow · ⏳ [R7.4.B11](#r7-4-b11) phê-duyệt · ⏳ [R7.7.6](#r7-7-6) functional |
| **NHCH** | ✅ [R7.3.8](#r7-3-8) seed · ⏳ [R7.4.B5b](#r7-4-b5b) publish |
| **ĐKT** 🆕 | 🚫 [R7.3.9](#r7-3-9) seed · ⏳ [R7.4.B10](#r7-4-b10) workflow |
| **Bài giảng** | ⚠️ [R7.3.10](#r7-3-10) seed |
| **Giảng viên** | ✅ [R7.3.11](#r7-3-11) seed |
| **Học viên** 🆕 | 🚫 [R7.3.12](#r7-3-12) seed |
| **Lịch học** 🆕 | 🚫 [R7.3.13](#r7-3-13) seed · ⏳ [R7.4.B12](#r7-4-b12) workflow |
| **Biểu mẫu** ✏️ | ✅ [R7.3.7](#r7-3-7) seed · ⚠️ [R7.4.C1](#r7-4-c1) workflow 5/8 · ⚠️ [R7.7.10](#r7-7-10) functional 22/47 + 8 bug |
| **Đánh giá Hiệu quả HTPL** ✏️ | ✅ [R7.4.D1](#r7-4-d1) tạo · ⚠️ [R7.4.D2](#r7-4-d2) workflow · ⏳ [R7.4.D2a](#r7-4-d2a) HUY 🆕 · ⏳ [R7.4.D2b](#r7-4-d2b) FR-VI-10 🆕 · ⏳ [R7.7.9](#r7-7-9) functional 46 TC |
| **Kho QA** | 🟢 [R7.3.16](#r7-3-16) seed · ⏳ [R7.4.D3](#r7-4-d3) workflow · ⏳ [R7.4.D3.AUTO](#r7-4-d3-auto) auto-feed |
| **Chi trả** ✏️ v3.5 | 🚫 [R7.6.1](#r7-6-1) workflow · 🟢 [R7.7.12](#r7-7-12) functional 35 TC · ✅ [R7.7.12.1](#r7-7-12-1) smoke IMPACT 🆕 · 🚫 [R7.7.12.2](#r7-7-12-2) FR-V.II-14 🆕 · 🚫 [R7.7.12.3](#r7-7-12-3) CB PD trả về 🆕 · ✅ [R7.7.12.4](#r7-7-12-4) UI Việt 🆕 · ⚠️ [R7.E3](#r7-e3) monitor
| **TV nhanh** | ⚠️ [R7.6.2](#r7-6-2) 4/5+B5 mTLS · ⏳ [R7.6.3](#r7-6-3) PUBLIC · ⚠️ [R7.7.11](#r7-7-11) 12/19 R8+R9 · ✅ [R7.E4](#r7-e4) 50 phiên cover 6 state |
| **CT HTPLDN** | 🟢 [R7.6.4](#r7-6-4) GĐ1 · ⏳ [R7.6.5](#r7-6-5) GĐ2 · ⏳ [R7.7.15](#r7-7-15) functional · ✅ [R7.E2](#r7-e2) monitor |
| **QTHT — Tier 0 seed** | ✅ [R7.0.5](#r7-0-5) button · ✅ [R7.1.1](#r7-1-1) LV partial-fix · ✅ [R7.1.2](#r7-1-2) Loại-DN · ✅ [R7.1.3](#r7-1-3) Đơn-vị · ✅ [R7.1.4](#r7-1-4) SLA · ⚠️ [R7.1.5](#r7-1-5) Ngày-lễ FE-silent · ✅ [R7.1.6](#r7-1-6) 9-DM 9/9 |
| **QTHT — Tier 1 + Functional** | 🚫 [R7.2.1](#r7-2-1) MPH · ✅ [R7.2.9](#r7-2-9) mail-kích-hoạt · ⚠️ [R7.7.8](#r7-7-8) DM-CRUD 24/25 (1 BLOCK NGAY-LE) · ✅ [R7.7.8a](#r7-7-8a) TK-SM 5+1/6 · ⚠️ [R7.7.8b](#r7-7-8b) Self-reg-DN 7/8 · ⚠️ [R7.7.8c](#r7-7-8c) reset-MK 6/7 (FR26-001 Open) · ✅ [R7.7.8d](#r7-7-8d) Audit-log 7/7 · ⚠️ [R7.7.8e](#r7-7-8e) Vai-trò 11/11 (VT-008 Open) |
| **Dashboard** | ⏳ [R7.5.1](#r7-5-1) KPI · ⏳ [R7.7.7](#r7-7-7) functional |
| **Báo cáo** | ❌ [R7.5.4](#r7-5-4) BC04 export FAIL · ⏳ [R7.7.13](#r7-7-13) functional |
| **SLA cảnh báo** | ⏳ [R7.5.3](#r7-5-3) banner |
| **Audit log** | 🟢 [R7.5.5](#r7-5-5) ≥100 entry |
| **API** ✏️ | ⏳ [R7.7.16](#r7-7-16) 42 TC + 8 mock |
| **Edge BR** | ⏳ [R7.7.17](#r7-7-17) BR-EC-01..23 |
| **Cross-cutting** | ✅ [R7.8.1](#r7-8-1) hard-del · ⚠️ [R7.8.2](#r7-8-2) ClamAV · ⚠️ [R7.8.3](#r7-8-3) lưu-nháp · ⚠️ [R7.8.4](#r7-8-4) profile · 🟢 [R7.8.5](#r7-8-5) permission |

> **Status icon ref:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream · 🆕 module mới R7

---

## Phase 0 — Pre-test (gate before run)

- ✅ <a id="r7-0-1"></a>**R7.0.1** Verify deploy + scenario reset DB — DONE 2026-05-06
  - **Kết quả:** Scenario MIX — partial reset (DN 30 mới, TVV/CG/KH=0, VV=70) + 10/18 deploy OK + 8 gap. [plan-r7-trigger.md](plan-r7-trigger.md)
- ⚠️ <a id="r7-0-2"></a>**R7.0.2** 🆕 Log + gửi dev bug deploy gap `[~70% — log 6/8 verified done, gửi dev chưa]`
  - **Kết quả:** Log 6/8 bug (3M+2Me+1Mi), 2 false positive drop. Gửi dev chưa làm.
  - **Bug:** [bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-reports/_meta/bug-report-deploy-gap.md) — 0/6 đóng (3 Major + 2 Medium + 1 Minor)
- ✅ <a id="r7-0-3"></a>**R7.0.3** 🆕 Bump fixture v2.7.0 → v2.7.1 (R7.0.3 done 2026-05-06)
  - **Kết quả:** v2.7.1 header note instruction strip `dia_ban_ids` + `loai_tvv:NHT` khỏi payload khi seed. 24 dòng dia_ban_ids giữ legacy R6 reference. [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)
- ✅ <a id="r7-0-4"></a>**R7.0.4** 🔄 Verify users.csv accounts còn login
  - **Kết quả:** PASS 10/10 sample (QTHT/CB_NV_TW/CB_PD_TW/CB_NV_DP/CB_NV_BN/NHT×3/CG/TVV). cg_tw_01..06 không có CSV — sub cg_01. [seed-checklist-login.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-login.md)
- ✅ <a id="r7-0-5"></a>**R7.0.5** 🔄 Verify SCR-VIII-02 button [Thêm mới] visible
  - **Kết quả:** PASS — button uid 33_27 visible, 34 TK list. [seed-checklist-scr-viii-02-button.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-scr-viii-02-button.md)
- ⚠️ <a id="r7-0-6"></a>**R7.0.6** 🆕 Pre-test UI surface audit per SRS update `[~95% — 18 PASS / 4 FAIL / 3 DEFER sau dev fix 2 bug FR-07]`
  - **Kết quả:** 4 DEPLOY confirmed + 2 false pos RESOLVED + 2 NEW gap FR-07 → dev fix Closed 2026-05-06. [ui-surface-audit.md](../output/qa-reports/round7-2026-05-06/seed/ui-surface-audit.md)
  - **Bug:** [bug-report-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/doanh-nghiep/bug-report-r7-0-6-fr-07-buttons.md) — 2/2 đóng (FR07-UI-001/002 Major Closed)
- ✅ <a id="r7-0-7"></a>**R7.0.7** 🆕 Deep review SRS FR-10 v3.5 + log inconsistency (2026-05-06)
  - **Kết quả:** 11 SRS bug (3 Major BLOCK + 8 Minor doc) + 10 câu BA. Sync 9 file QA spec.
  - **Bug:** [bug-report-r7-srs-fr10-inconsistency.md](../output/qa-reports/round7-2026-05-06/bug-reports/_meta/bug-report-r7-srs-fr10-inconsistency.md) — 0/11 đóng (3 Major: BUG-SRS-FR10-001 NGAY_LE schema / 002 TINH_THANH UI / 003 CHO_PHAN_QUYEN scenario; 8 Minor doc)
  - **Output:** [6.10-sm-taikhoan.md](../output/smoke/6.10-sm-taikhoan.md) (4→5 states) · [7.10-quan-tri-he-thong.md](../output/funtion/7.10-quan-tri-he-thong.md) (Tier 1/2/3) · [6.10-smoke-taikhoan.md](../output/smoke-specs/6.10-smoke-taikhoan.md) · [02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · [test-strategy.md](../output/test-strategy.md) · [permission-matrix-by-fr.md](../output/permission-matrix-by-fr.md) · [permission-matrix-by-role.md](../output/permission-matrix-by-role.md) · [7.7-quan-ly-doanh-nghiep.md](../output/funtion/7.7-quan-ly-doanh-nghiep.md)

---

## Phase 1 — Re-seed Tier 0 (qtht_01)

- ✅ <a id="r7-1-1"></a>**R7.1.1** 🔄 DM LINH_VUC_PL (6 LV)
  - **Kết quả:** PASS 12/6+ pre-existing cover 6 LV fixture. [seed-checklist-r7-1-1-linh-vuc-pl.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-1-linh-vuc-pl.md)
- ✅ <a id="r7-1-2"></a>**R7.1.2** 🔄 DM LOAI_DN (TNHH/CP/DNTN/HKD)
  - **Kết quả:** PASS 4/4 fixture record + POST CTHD_TEST → 201 (re-test 2026-05-07 sau dev fix). [seed-checklist-r7-1-2-loai-dn.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-2-loai-dn.md)
  - **Bug:** [bug-report-r7-1-2-loai-dn-be-enum-guard.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-r7-1-2-loai-dn-be-enum-guard.md) — 1/1 đóng (BUG-LOAI-DN-002 Closed-verified)
- ✅ <a id="r7-1-3"></a>**R7.1.3** 🔄 DON_VI 7 đơn vị (TW + 3 BN + AG/BG/BNI)
  - **Kết quả:** PASS 7/7 pre-existing (BTP-TW + BKH/BTC/BCT + STP-AG/BG/BNI). [seed-checklist-r7-1-3-don-vi.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-3-don-vi.md)
- ✅ <a id="r7-1-4"></a>**R7.1.4** 🔄 SLA 4 loại (HOI_DAP 10d, VV 10d, HSHT 15d, HSTT 10d, hệ số 2.0)
  - **Kết quả:** PASS 4/4 pre-existing match spec, hệ số 2.0, cảnh báo 50/90%. [seed-checklist-r7-1-4-sla.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-4-sla.md)
- ⚠️ <a id="r7-1-5"></a>**R7.1.5** 🆕 Seed 5 ngày lễ 2026 qua UI Tab Ngày lễ SCR-VIII-06 (FR-VIII-29) `[5/5 data, FE submit silent block UI; account qtht_02]`
  - **Kết quả:** 5/5 (4 pre-existing + Tết NĐ qua API workaround do FE submit silent). [r7-1-5-tab-ngay-le-5-record-final.png](../output/qa-reports/round7-2026-05-06/seed/r7-1-5-tab-ngay-le-5-record-final.png)
  - **Bug:** [bug-report-r7-1-5-fe-submit-silent.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-cau-hinh-ht/bug-report-r7-1-5-fe-submit-silent.md) — 0/1 đóng (BUG-NGAY-LE-001 Major FE submit silent — R8 verify 2026-05-07 16:42 vẫn open sau dev claim fix lần 3; BUG-NGAY-LE-002 dropped)
- ✅ <a id="r7-1-6"></a>**R7.1.6** 🆕 Seed 9 DM còn lại qua UI SCR-VIII-01 (account qtht_02)
  - **Kết quả:** PASS 9/9 — DM2 CHUONG_TRINH_HT unblocked sau dev fix routing + form 3 trường (re-test 2026-05-07). [seed-checklist-r7-1-6-9-dm-con-lai.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-1-6-9-dm-con-lai.md)
  - **Bug:** [bug-report-r7-1-6-dm-cthttp.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-r7-1-6-dm-cthttp.md) — 2/2 đóng (BUG-DM-CTHT-001 + 002 Closed-verified)

---

## Phase 2 — Re-seed Tier 1 (master actor) — strict thứ tự FK

> **Dependency:** TC TV → TVV/CG (FK to_chuc_chinh_id phải HOAT_DONG); NHT seed → activate; account login → FK link.

- 🚫 **R7.2.1** 🔄 Seed 12 mẫu phản hồi (cover 6 LV × 2 mẫu/LV) `[block: R7.1.1 DM LV mismatch SRS — BUG-DM-LVPL-001]`
  - **Kết quả:** 🚫 BLOCK 0/12 — modal MPH dropdown LV thiếu DOANH_NGHIEP/THUONG_MAI → 3 variants không seed được. Fixture đã v2.7.2.
  - **Bug:** [bug-report-r7-1-1-dm-linh-vuc-pl-mismatch.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-r7-1-1-dm-linh-vuc-pl-mismatch.md) — 0/1 đóng (cùng bug R7.1.1 — R8 partial fix: thêm DOANH_NGHIEP+DAU_TU, vẫn thiếu THUONG_MAI)
  - **Cần có sẵn:** R7.1.1 ✅ (DM LV đủ 10 SRS)
- ✅ <a id="r7-2-2"></a>**R7.2.2** 🆕 Seed 6 Tổ chức tư vấn qua API (cb_nv_tw_02)
  - **Kết quả:** PASS 5/5 OK + 1 BVA-422 đúng kỳ vọng. TC-BTP-TW-0001..0005 MOI_DANG_KY. [seed-checklist-r7-2-2-tc-tv.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-2-tc-tv.md)
  - **Bug:** [bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md](../output/qa-reports/round7-2026-05-06/bug-reports/to-chuc-tu-van/bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md) — 1/1 đóng (BUG-TCTV-FE-001 Closed-verified R8 2026-05-07 — dropdown LV render đủ 10 LV)
- ✅ <a id="r7-2-3"></a>**R7.2.3** 🆕 Phê duyệt TC TV → HOAT_DONG (FR-IV-NEW-04, cb_pd_tw_02)
  - **Kết quả:** PASS 5/5 → HOAT_DONG, soQdCongBo + ngayCongNhan set đầy đủ. [seed-checklist-r7-2-3-phe-duyet-tc-tv.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-3-phe-duyet-tc-tv.md)
- ✅ **R7.2.4** ✏️ Seed DN — acceptance filter-based v3.5
  - **Kết quả:** PASS 36 DN cover 3 quy mô × 3 ngành (verified MCP). [seed-checklist-r7-2-4-dn.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-4-dn.md)
  - **Bug:** [bug-report-r7-2-4-throttle-self-reg.md](../output/qa-reports/round7-2026-05-06/bug-reports/doanh-nghiep/bug-report-r7-2-4-throttle-self-reg.md) — 2/2 đóng (THROTTLE-001 + LOAI-DN-002 Closed-verified R8 2026-05-07)
- ✅ <a id="r7-2-5"></a>**R7.2.5** ✏️ Seed 6 TVV TW (bỏ dia_ban_ids, MOI_DANG_KY)
  - **Kết quả:** PASS 6/6 TVV-BTP-TW-0009..0014 MOI_DANG_KY. Per-LV cover 5/5 (LD/Thuế/KDTM/SHTT/ĐĐ); DN/TM N/A do BUG-DM-LVPL-001. [seed-checklist-r7-2-5-tvv-tw.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-5-tvv-tw.md)
- ✅ <a id="r7-2-6"></a>**R7.2.6** ✏️ Seed 6 CG TW (`loai_tvv=CG`, MOI_DANG_KY)
  - **Kết quả:** PASS 6/6 TVV-BTP-TW-0001..0006 cover 6 LV (DN/TM/LĐ/Thuế/SHTT/ĐĐ). [seed-checklist-r7-2-6-cg-tw.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-6-cg-tw.md)
  - **Bug:** [bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md) — 1/1 đóng (BUG-TVV-FE-002 Closed-verified R8 2026-05-07 — combobox query đúng entity TO_CHUC_TU_VAN, render 5 TC TV thật)
- ✅ <a id="r7-2-7"></a>**R7.2.7** 🆕 Seed 3 NHT qua FR-IV-NHT-01 (qtht_02 — CB_NV_TW không có quyền)
  - **Kết quả:** PASS 3/3 NHT-STP-AG/DN/HP-0001 CHO_KICH_HOAT + auto-tạo TK. [seed-checklist-r7-2-7-nht.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-2-7-nht.md)
- ✅ <a id="r7-2-9"></a>**R7.2.9** ✏️ Verify 9 TK CG/NHT click mail kích hoạt → đặt MK → HOAT_DONG (FR-VIII-26) — happy path
  - **Kết quả:** PASS 9/9 đặt MK Secret@123 + TK HOAT_DONG. [workflow-test-report-r7-2-9-mail-kich-hoat.md](../output/qa-reports/round7-2026-05-06/workflow/qtht-tai-khoan/workflow-test-report-r7-2-9-mail-kich-hoat.md)
  - **Scope:** ⚠️ HAPPY PATH — chưa cover link expired / token reuse / validation MK. Full FR-VIII-26 ở R7.7.8c.
---

## Phase 3 — Re-seed Tier 2 (transactional entry state)

- ✅ <a id="r7-3-1"></a>**R7.3.1** 🔄 Seed 6 Hỏi đáp entry MOI cover 6 LV × 4 kênh
  - **Kết quả:** PASS 6/6 cover 6 LV × 4 kênh. [seed-checklist-r7-3-1-hd.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-1-hd.md)
- ✅ <a id="r7-3-1-mob"></a>**R7.3.1.MoB** 🆕 Seed Mẫu Mô hình B qua UI Tab Mẫu phản hồi 3 cấp (FR-II-NEW-02)
  - **Kết quả:** PASS 3/3 — TW (Lao động) + BN-BTC (Thuế) + DP-BG (SHTT) auto cấp đúng. [r7-3-1-mob-dp-list.png](../output/qa-reports/round7-2026-05-06/seed/r7-3-1-mob-dp-list.png)
  - **Bug:** [bug-report-r7-3-1-mob-mph-display.md](../output/qa-reports/round7-2026-05-06/bug-reports/hoi-dap/bug-report-r7-3-1-mob-mph-display.md) — 1/1 đóng (BUG-MPH-DISP-01 Closed-verified R8 2026-05-07 — list MPH có cột Phạm vi+Tác giả đúng SRS)
- 🟢 <a id="r7-3-1-tvn"></a>**R7.3.1.TVN** 🆕 Seed phiên TV nhanh ESCALATE → HD `kenh=TVN_BRIDGE` qua UI FR-13
  - **Cần có sẵn:** R7.6.2 ⏳ (walk UI FR-13 ESCALATE, không POST API)
- ✅ <a id="r7-3-2"></a>**R7.3.2** 🔄 Seed 6 VV entry DA_TIEP_NHAN cover 6 LV (top up pre-existing 10)
  - **Kết quả:** PASS 16/16 (10 cũ + 6 mới VV-BTP-TW-20260506-001..006). Pre-existing chỉ 2 LV → seed thêm 4 LV. [seed-checklist-r7-3-2-vv.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-2-vv.md)
- ✅ <a id="r7-3-3"></a>**R7.3.3** ✏️ Seed 10 TVCS entry TIEP_NHAN cover 6 LV (endpoint thực `/api/v1/noi-dung-tu-van-cs`)
  - **Kết quả:** PASS 10/10 TVCS-20260506-0001..0010. 5/10 fail VIDEO_CALL → retry HO_SO. [seed-checklist-r7-3-3-tvcs.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-3-tvcs.md)
  - **Bug:** [bug-report-r7-3-3-tvcs-video-call-500.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-r7-3-3-tvcs-video-call-500.md) — 1/1 đóng FE (BUG-TVCS-VIDEO-CALL-001 Closed-verified R8 2026-05-07 — form bỏ field hinhThucTv, FE không gửi orphan)
- ✅ <a id="r7-3-4"></a>**R7.3.4** 🔄 Seed HSPL DN cover 5 loại × 3 state × multi-DN + STP-AG scope
  - **Kết quả:** PASS 23 record (20 TW + 2 STP-AG seed R8 + 1 NHT-self-create). 5/5 loại + 3/3 state + 11 DN cover. Endpoint thực `/api/v1/ho-so-phap-ly-dns` (plural-s). [seed-checklist-r7-3-4-hspl.md](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-3-4-hspl.md)
  - **Bug:** 6 bug đề xuất log (HSPL-001 NHT permission overgrant Major, HSPL-002 BR-AUTH-10 missing VV layer Major, HSPL-003 GET detail 500 Critical, HSPL-004 list filter inconsistent Minor, HSPL-005 keyword param ignored Minor, HSPL-006 unaccent Major).
  - **Downstream unblock:** TV-017/018/019/020/056 ✅ ready · TV-053 ⚠️ partial (cần R7.4.A3 VV linkage) · TV-054 ⚠️ ready (verify negative bug) · TV-055 🚫 (BUG-HSPL-003 Critical).
- ⏳ <a id="r7-3-5"></a>**R7.3.5** 🆕 Seed Kế hoạch ĐT năm (KE_HOACH_DAO_TAO — Mô hình A 3 cấp) `[need: dev confirm endpoint deploy]`
- 🚫 <a id="r7-3-6"></a>**R7.3.6** ✏️ Seed 6 CTĐT entry DU_THAO
  - **Kết quả:** 🚫 BLOCK — verify 2026-05-07 FE form đã có field "Kế hoạch năm"; còn block do dropdown KH năm rỗng (R7.3.5 ⏳ chưa seed).
  - **Bug:** [bug-report-r7-3-6-ctdt-form.md](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-r7-3-6-ctdt-form.md) — 1/1 đóng (BUG-CTDT-FE-01 Closed-verified 2026-05-07 — form has keHoachId field)
- ✅ <a id="r7-3-7"></a>**R7.3.7** ✏️ Seed 4 TM (v3.5 enum `NHAP/CONG_KHAI/AN`) + 7 BM entry NHAP
  - **Kết quả:** TM 4/4 PASS — filter LV cover 4/4 (Lao động/KDTM/Thuế/SHTT). BM 0/7 defer (env limit thiếu file .docx). [r7-3-7-tm-list.png](../output/qa-reports/round7-2026-05-06/seed/r7-3-7-tm-list.png)
- ✅ <a id="r7-3-8"></a>**R7.3.8** 🔄 Seed 10 NHCH entry NHAP
  - **Kết quả:** 7/7 cover full filter — 5 LV + 3 mức độ + 3 loại (TN-1/TN-nhiều/Tự luận). [r7-3-8-nhch-list-7-final.png](../output/qa-reports/round7-2026-05-06/seed/r7-3-8-nhch-list-7-final.png)
- 🚫 <a id="r7-3-9"></a>**R7.3.9** 🔄 Seed 5 ĐKT entry NHAP cover 5 LV
  - **Kết quả:** 🚫 BLOCK — NHCH state NHAP, BE filter KICH_HOAT; chưa re-seed sau fix FE 2026-05-07.
  - **Bug:** [bug-report-r7-3-9-dkt-nhch.md](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-r7-3-9-dkt-nhch.md) — 2/2 đóng FE (DKT-FE-01 Closed max=10; NHCH-STATE-01 Closed FE R8 2026-05-07 default Kích hoạt — SRS doc-side cần BA sync FR-III-09)
- ⚠️ <a id="r7-3-10"></a>**R7.3.10** 🔄 Seed 8 bài giảng entry KICH_HOAT
  - **Kết quả:** ⚠️ 5/8 PASS — Video type cover 5 LV (Lao động/Thuế/KDTM/SHTT/Đất đai). Slide/PDF skip do file upload. [r7-3-10-bai-giang-list.png](../output/qa-reports/round7-2026-05-06/seed/r7-3-10-bai-giang-list.png)
- ✅ <a id="r7-3-11"></a>**R7.3.11** ✏️ Seed 8 giảng viên entry HOAT_DONG (verify FR-III-11 refactor)
  - **Kết quả:** PASS 8/8 cover 6 LV (Dân sự/Lao động/Thuế/SHTT/KDTM/Đất đai/Hành chính/KDQT). [r7-3-11-giang-vien-list.png](../output/qa-reports/round7-2026-05-06/seed/r7-3-11-giang-vien-list.png)
- 🚫 <a id="r7-3-12"></a>**R7.3.12** 🆕 Seed 8 Học viên (HOC_VIEN entity mới — Mô hình A) `[block: dev fix entity 404 /api/v1/hoc-viens]`
- 🚫 <a id="r7-3-13"></a>**R7.3.13** 🆕 Seed Lịch học (LICH_HOC — FR-III-22) `[block: chưa rõ endpoint deploy]`
- ⏳ <a id="r7-3-14"></a>**R7.3.14** 🆕 Seed 6 Hợp đồng TV entry DANG_THUC_HIEN cover 6 LV `[need: R7.4.A1 🟢 TVV active + R7.4.A3 ≥1 VV HOAN_THANH; unblock R7.7.14 functional]`
- ⏳ <a id="r7-3-15"></a>**R7.3.15** 🆕 Seed 8 Khóa học entry DU_THAO direct (bypass workflow B7 nếu block) cover 6 LV + 2 hình thức `[need: R7.3.6 🚫 CTĐT DU_THAO; unblock R7.7.6 functional 40 TC khi B7 block dev]`
- 🟢 <a id="r7-3-16"></a>**R7.3.16** 🆕 Seed Kho QA entry CHO_DUYET cover 5 LV × 2 nguồn (THU_CONG + IMPORT) qua UI Modal SCR-X2-01 `[~0% — ready, BUG-KHOQA-001 UI Closed; fixture kho_qa_variants 9 records]`
  - **Cần có sẵn:** UI SCR-X2-01 ✅ (BUG-KHOQA-001 Closed) + cb_nv_tw_02 + fixture `kho_qa_variants[1..9]`. Acceptance: ?trangThai=CHO_DUYET → ≥9; ?nguon=THU_CONG → ≥8 per ≥5 LV; ?nguon=IMPORT → ≥1.
  - **Bug:** [bug-report-flow-kho-qa.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-kho-qa.md) — 1/1 đóng (BUG-KHOQA-001 UI Critical Closed-verified R7 2026-05-07)

---

## Phase 4 — Workflow E2E (multi-role)

### 🟦 Trụ A — TVV → PC → CG → VV → HD → TVCS

- 🟢 <a id="r7-4-a1"></a>**R7.4.A1** ✏️ Workflow TVV (SM 9→**10 state**, thêm CHO_KICH_HOAT, hệ thống tự cấp TK qua FR-VIII-15 step 6) `[need: R7.2.5 ✅ + R7.2.6 ✅; spec: 7.4-chuyen-gia-tvv.md + 6.4-sm-tvv.md (sync 2026-05-06)]`
- ⚠️ <a id="r7-4-a1-cg"></a>**R7.4.A1-CG** ✏️ Advance 8 CG → DANG_HOAT_DONG + 14 TC (BR-AUTH-05/08 + LEGAL-04 + opt-lock)
  - **Kết quả:** 13/14 PASS (TC-07+14 unblock 7/5 qua R7.7.8a+d), 1 ⚠️ DEVIATION state name spec v3.5. [workflow-test-report-r7-4-a1-cg.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1-cg.md)
  - **Bug:** [bug-report-r7-4-a1-cg-state-deviation.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-r7-4-a1-cg-state-deviation.md) — 0/1 đóng (BUG-CG-A1-001 Major Open: state DANG_HOAT_DONG vs CHO_KICH_HOAT spec). **Re-test R8 2026-05-07: VẪN OPEN** (lần 2 verify, BE chưa rename + chưa chèn CHO_KICH_HOAT).
- ⏳ <a id="r7-4-a1-5"></a>**R7.4.A1.5** ✏️ Đợt 2 PC TVV backfill — verify dropdown "Người xử lý" có TAI_KHOAN role NHT mới sau khi NHT tách entity `[need: R7.4.A1 🟢 + R7.4.A1-CG ⚠️; verify 2 BE bug Open R6 (CHPC-001/002) còn không sau dev deploy]`
- 🟢 <a id="r7-4-a2"></a>**R7.4.A2** 🆕 Tiếp nhận TVV (FR-IV-13) — 3 transition mới (MOI_DANG_KY→CHO_THAM_DINH, YEU_CAU_BO_SUNG→DANG_THAM_DINH, TU_CHOI→CHO_THAM_DINH) `[need: ≥1 TVV MOI_DANG_KY (R7.2.5 ✅)]`
- ⏳ <a id="r7-4-a3"></a>**R7.4.A3** ✏️ Workflow VV (FR-05 v3.5 refactor — bỏ `nguoi_ho_tro_id`, thay 3 cột phân công + 2 thẻ Cá nhân/Tổ chức + SLA 15 ngày + CB PD từ chối → DANG_XU_LY) `[need: R7.2.9 ✅ NHT active + R7.2.3 ✅ TC TV HOAT_DONG; spec mới: 7.5-vu-viec-htpl.md v3.0 + 6.5-sm-vuviec.md (sync 2026-05-06)]`
- ⏳ <a id="r7-4-a3-public"></a>**R7.4.A3-PUBLIC** 🆕 Workflow Công khai VV lên Cổng PLQG (FR-V.I-NEW-05 — 2 self-loop SM trên DA_DUYET + HOAN_THANH) `[need: R7.4.A3 ≥1 VV DA_DUYET hoặc HOAN_THANH; account: cb_pd_<cap>_01 cùng cấp với CB NV xử lý VV (BR-AUTH-05)]`
- ⏳ <a id="r7-4-a3-dn-bs"></a>**R7.4.A3-DN-BS** 🆕 Workflow DN bổ sung HS qua chuyên trang VNeID (FR-V.I-NEW-02 — formal hoá YEU_CAU_BO_SUNG → DANG_KIEM_TRA) `[need: R7.4.A3 ≥1 VV YEU_CAU_BO_SUNG + DN VNeID Tier 2 sandbox; account: dn_<X>_01 với VNeID]`
- 🚫 <a id="r7-4-a4"></a>**R7.4.A4** ✏️ Workflow Hỏi đáp 11 paths v3.5
  - **Kết quả:** 🚫 2/11 PASS (TP-HD-03 + TP-HD-08 PARTIAL). 8 BLOCKED do BUG-HD-A4-001 state DA_PHAN_CONG missing transition + 1 SKIP TP-HD-09. [workflow-test-report-r7-4-a4-hoi-dap.md](../output/qa-reports/round7-2026-05-06/workflow/hoi-dap/workflow-test-report-r7-4-a4-hoi-dap.md)
  - **Bug:** [bug-report-r7-4-a4-hd-workflow-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/hoi-dap/bug-report-r7-4-a4-hd-workflow-block.md) — 0/3 đóng (HD-A4-001 Critical state DA_PHAN_CONG transition · 002 Major CauHinhPhanCong DEPRECATED · 003 Major TC TV không persist)
- ⚠️ <a id="r7-4-a5"></a>**R7.4.A5** ✏️ Workflow TVCS 11 bước (dropdown CG enum đổi)
  - **Kết quả:** ⚠️ 3/11 PASS (B1 re-seed + B2 6/6 LV + B10). 5 BLOCKED do BE bug `/xac-nhan` 403 (2-CG). [workflow-test-report-r7-4-a5-tvcs.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-chuyen-sau/workflow-test-report-r7-4-a5-tvcs.md)
  - **Bug:** [bug-report-r7-4-a5-tvcs-cg-action-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-r7-4-a5-tvcs-cg-action-block.md) — 0/2 đóng (TVCS-A5-001 Critical + TVCS-A5-002 Major Open). Pool R7.3.3 mất giữa R7→R8 — đã re-seed inline 10 record TVCS-20260507-*.

### 🟩 Trụ B — Đào tạo

- ⏳ <a id="r7-4-b0"></a>**R7.4.B0** 🆕 Workflow KH năm (SM-KH-DAO-TAO refinement TU_CHOI→CHO_DUYET) `[need: R7.3.5 ⏳]`
- ⏳ <a id="r7-4-b1"></a>**R7.4.B1** ✏️ Workflow CTĐT SM-CTDT mới (DU_THAO→CHO_DUYET→DA_DUYET) `[need: R7.3.6 🚫; UNBLOCKED — SRS update giải quyết spec contradiction R6.4.B2]`
- ⏳ <a id="r7-4-b5b"></a>**R7.4.B5b** 🔄 Publish NHCH NHAP→CONG_KHAI `[need: R7.3.8 ✅]`
- ⏳ <a id="r7-4-b7"></a>**R7.4.B7** ✏️ Workflow KH SM-KHOAHOC 11 state (thêm TU_CHOI + TU_CHOI_KQ) — 12 bước `[need: R7.4.B1 ⏳ DA_DUYET; UNBLOCKED]`
- ⏳ <a id="r7-4-b10"></a>**R7.4.B10** 🆕 Workflow Đề kiểm tra (FR-III-NEW-01/02/03) — tạo + phân phối + map bài giảng `[need: R7.3.9 🚫 + R7.4.B5b ⏳]`
- ⏳ <a id="r7-4-b11"></a>**R7.4.B11** 🆕 Phê duyệt khóa học (FR-III-21) `[need: R7.4.B7 ≥1 KH DA_KET_THUC]`
- ⏳ <a id="r7-4-b12"></a>**R7.4.B12** 🆕 Quản lý lịch học (FR-III-22) `[need: R7.3.13 🚫]`

### 🟨 Trụ C — Biểu mẫu

- ⚠️ <a id="r7-4-c1"></a>**R7.4.C1** ✏️ Workflow BM v3.5 — SM-BIEUMAU 3 transition + Switch công khai 4 trường + BR-PUBLIC-01/02/03
  - **Kết quả:** ⚠️ 5/8 PASS — SM 3/3 transition + BR-PUBLIC-01 BE + BR-PUBLIC-03 BE PASS. BR-PUBLIC-02 FAIL. [workflow-r7-4-c1](../output/qa-reports/round7-2026-05-06/workflow/workflow-test-report-r7-4-c1-bm.md)
  - **Bug:** [bug-report-flow-bm-r7-4-c1.md](../output/qa-reports/round7-2026-05-06/bug-reports/bm/bug-report-flow-bm-r7-4-c1.md) — 0/6 đóng (2 Critical + 2 Major + 2 Medium)

### 🟧 Trụ D — Theo dõi Đánh giá Hiệu quả HTPL + Kho QA

- ✅ <a id="r7-4-d1"></a>**R7.4.D1** ✏️ Tạo kỳ Đánh giá Hiệu quả HTPL `LAP_KE_HOACH` (v3.5: +2 field)
  - **Kết quả:** PASS 1/1 — DG-20260506-0001 LAP_KE_HOACH. R6 DG-001/002 ✅ FIXED. [seed-checklist](../output/qa-reports/round7-2026-05-06/seed/seed-checklist-r7-4-d1-danhgiahq.md)
- ⚠️ <a id="r7-4-d2"></a>**R7.4.D2** ✏️ Workflow 9 bước v3.5 (8 state + HUY)
  - **Kết quả:** ⚠️ 5/11 R7. B6 FAIL cascade B7-B10. 2 bug mới (DG-006 Major + DG-007 Medium). [report](../output/qa-reports/round7-2026-05-06/workflow/danh-gia/workflow-test-report-DanhGiaHQ.md)
  - **Bug:** [bug-report-flow-danhgia.md](../output/qa-reports/round7-2026-05-06/bug-reports/danh-gia/bug-report-flow-danhgia.md) — 5/7 đóng (5 R6 closed; DG-006 + DG-007 R8 2026-05-07 ⚠️ INCONCLUSIVE — pool VV reset 0 HOAN_THANH, không thể verify mismatch)
  - **Cần có sẵn:** seed lại ≥3 VV HOAN_THANH match đợt scope để retest DG-006/007
- ⏳ <a id="r7-4-d2a"></a>**R7.4.D2a** 🆕 State HUY transition (4 state → HUY + guard HOAN_THANH)
  - **Cần có sẵn:** R7.4.D2 ⚠️ workflow forward
- ⏳ <a id="r7-4-d2b"></a>**R7.4.D2b** 🆕 FR-VI-10 read-only cross-co-quan (CB NV `co_quan_duoc_danh_gia_id` xem KQ HOAN_THANH)
  - **Cần có sẵn:** R7.4.D2 ⚠️ ≥1 đợt HOAN_THANH + variant cross-co-quan + 2 CB NV BN khác đơn vị
- ⏳ <a id="r7-4-d3"></a>**R7.4.D3** ✏️ Workflow Kho QA SM-KHOCAUHOI 8 transitions (duyệt đơn lẻ + bulk + từ chối + toggle hiệu lực) `[need: R7.3.16 🟢 ≥3 record CHO_DUYET + cb_pd_tw_02; spec: 02-thu-tu-module.md line 777-789]`
  - **Cần có sẵn:** R7.3.16 🟢 ≥3 record CHO_DUYET + cb_pd_tw_02 cùng cấp.
- ⏳ <a id="r7-4-d3-auto"></a>**R7.4.D3.AUTO** 🆕 Verify auto-feed Kho QA nguồn TU_DONG (BR-FLOW-10) — HD DA_DUYET → tạo record Kho QA TU_DONG `[need: R7.4.A4 ⏳ ≥1 HD DA_DUYET; spec: FR-X.2-01 step 2]`

---

## Phase 5 — Verification

- ⏳ <a id="r7-5-1"></a>**R7.5.1** ✏️ Dashboard KPI counter HD/VV/TVCS/CT (KPI-07 count đổi do NHT tách entity) `[need: R7.4.A1/A3/A4/A5 ✅]`
- 🟢 <a id="r7-5-2"></a>**R7.5.2** 🔄 Cross-module DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả ≥1 record/tab `[~0% — ready, need R7.3.4 🚫 + R7.4.A3 ⏳ + R7.6.1 🚫]`
- ⏳ <a id="r7-5-3"></a>**R7.5.3** ✏️ SLA cảnh báo banner — verify trừ ngày lễ (BR-CALC-03) `[need: R7.1.5 ⚠️ + ≥1 HD/VV deadline >70%]`
- ❌ <a id="r7-5-4"></a>**R7.5.4** 🔄 BC04 export Excel có data
  - **Kết quả:** ❌ FAIL — header xlsx mime đã fix, body vẫn JSON wrap StreamableFile (1910 bytes xlsx kẹt trong JSON). [verification-test-report-r7-5-4-bc-export.md](../output/qa-reports/round7-2026-05-06/workflow/bao-cao/verification-test-report-r7-5-4-bc-export.md)
  - **Bug:** [bug-report-r7-5-4-bc-export.md](../output/qa-reports/round7-2026-05-06/bug-reports/bao-cao/bug-report-r7-5-4-bc-export.md) — 0/2 đóng (BUG-BC-EXPORT-001 Critical + BUG-BC-LEGEND-001 Minor still Open từ R6)
  - **Cần có sẵn:** BC HD ✅ data có; BC04 VV BLOCKED chờ R7.4.A3 ⏳ seed VV HOAN_THANH
- 🟢 <a id="r7-5-5"></a>**R7.5.5** 🔄 Audit log ≥100 entry qua Nhật ký HT (FR-VIII-28) `[~0% — ready, accumulate qua Phase 4]`

---

## Phase 6 — Workflow đầu ra hậu kỳ (mapping R5 P3)

- 🚫 <a id="r7-6-1"></a>**R7.6.1** ✏️ Workflow Chi trả v3.5 — 12 bước, SM 10 state `[block: thiếu LGSP integration — cần BE inject API hoặc seed CHO_TIEP_NHAN]`
  - **Cần có sẵn:** BE inject API + ≥1 VV HOAN_THANH (R7.4.A3 ⏳) + DN 3 quy mô (R7.2.4 ✅).
  - **Output:** workflow-test-report-ChiTra-v3.5.md
- ⚠️ <a id="r7-6-2"></a>**R7.6.2** 🔄 Workflow TV nhanh (5 trạng thái) — sau dev seed 50 phiên
  - **Kết quả:** ⚠️ PASS 4/5 + 1 PARTIAL B5. R9 unblock dev seed: B1/B2/B3/B4 PASS UI+API, B5 mTLS DN-only (pool 12 HOAN_THANH có sẵn). [workflow-test-report-r7-6-2-tv-nhanh.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-nhanh/workflow-test-report-r7-6-2-tv-nhanh.md)
  - **Bug:** [bug-report-r7-6-2-tvn-create-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-nhanh/bug-report-r7-6-2-tvn-create-block.md) — 0/2 đóng. R9 re-classify: BUG-001 Critical→Major + P0→P1 (workaround dev seed); BUG-002 giữ Major P1 (vẫn chặn TVN-038 verify diem_danh_gia_tb).
- ⏳ <a id="r7-6-3"></a>**R7.6.3** 🔄 Workflow TV nhanh PUBLIC (DN qua Cổng PLQG) `[need: R7.E4 ⏳ + R7.7.16 API ✅]`
- 🟢 <a id="r7-6-4"></a>**R7.6.4** 🔄 Workflow CT HTPLDN GĐ1 11 bước `[~0% — ready, verify 3 CT data (CT-001/002/003) còn không]`
- ⏳ <a id="r7-6-5"></a>**R7.6.5** 🔄 Workflow CT HTPLDN GĐ2 Đợt BC 7 bước `[need: R7.6.4 🟢 + R7.6.1 ≥6 Chi trả + R7.4.A3 ≥6 VV HOAN_THANH]`

---

## Phase 7 — Functional 17 module + 2 NEW (negative + edge + 40 TC perm)

- ⏳ <a id="r7-7-1"></a>**R7.7.1** ✏️ Hỏi đáp 60 TC v3.5 (35 base updated + 25 mới HD-040..064) `[need: R7.3.1 ✅ + R7.3.1.MoB + R7.3.1.TVN + R7.4.A4; spec: 7.2-hoi-dap-phap-ly.md v3.5]`
  - **Cần có sẵn:** DEV schema v3.5 ❌ + R7.3.1/MoB/TVN re-seed ❌ + file test (ảnh 5MB, PDF 19/21MB)
- 🟢 <a id="r7-7-2"></a>**R7.7.2** ✏️ CG/TVV 31 TC (enum loai_tvv đổi) `[need: R7.2.5/6 ✅]`
- ⏳ <a id="r7-7-3"></a>**R7.7.3** ✏️ Vụ việc 72 TC v3.5 (33 base + 42 mới Cluster 1-8) `[need: R7.3.2 ✅ + R7.4.A3 ≥1 VV mỗi state; spec mới: 7.5-vu-viec-htpl.md v3.0 (sync 2026-05-06)]`
  - **Cần có sẵn:** R7.3.2 ✅ + R7.4.A3 ⏳ + R7.4.A3-PUBLIC ⏳ + R7.4.A3-DN-BS ⏳ + DN VNeID Tier 2 + CB PD cùng cấp
- ⏳ <a id="r7-7-3-privacy"></a>**R7.7.3-PRIVACY** 🆕 **2 TC P0 Critical privacy NĐ 13/2023** (verify riêng đầu tiên, escalate ngay nếu FAIL) `[need: R7.4.A3-PUBLIC ≥1 VV cong_khai=1 + R7.2.4 ≥1 DN test với VV + R7.4.A3 ≥1 VV scope đa DN]`
- 🟢 <a id="r7-7-4"></a>**R7.7.4** ✏️ DN 17 TC v3.5 (4 TC mới DN-021..024)
  - **Kết quả:** 🟢 ready, 15/17 test ngay; 2 defer (DN-004 Tier 2 + DN-020 Tier 3). [7.7-quan-ly-doanh-nghiep.md](../output/funtion/7.7-quan-ly-doanh-nghiep.md)
  - **Cần có sẵn:** R7.2.4 ✅ (36 DN cover 3 quy mô × 3 ngành) + DM TINH_THANH 63 tỉnh + DM LINH_VUC_KINH_DOANH
- 🟢 <a id="r7-7-4-5"></a>**R7.7.4.5** 🆕 NHT functional 10 TC (CRUD + permission + workflow kích hoạt) `[need: ≥1 NHT HOAT_DONG (R7.2.7 ✅ + R7.2.9 ✅)]`
- 🟢 <a id="r7-7-4-6"></a>**R7.7.4.6** 🆕 TC TV functional 10 TC (CRUD + permission + phê duyệt edge) `[need: R7.2.3 ✅]`
- ⚠️ <a id="r7-7-5"></a>**R7.7.5** 🔄 TVCS functional 61 TC v3.5
  - **Kết quả:** ⚠️ 31/61 PASS · 14 BLOCKED · 12 SKIP · 4 FAIL (sau seed R7.3.4 + sweep HSPL R8). +7 TC mới: TV-017/018/019/020/056 ✅ + TV-053 ⚠️ partial + TV-054 ❌ FAIL. [functional-test-report-r7-7-5-tvcs.md](../output/qa-reports/round7-2026-05-06/functional/tu-van-chuyen-sau/functional-test-report-r7-7-5-tvcs.md)
  - **Bug:** [bug-report-r7-7-5-tvcs.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-r7-7-5-tvcs.md) — 0/10 đóng. 3 TVCS legacy (FN-001/002/003) + 7 HSPL mới (HSPL-001..007 cover NHT permission overgrant runtime DELETE 204, BR-AUTH-10 missing layer, Detail 500, list inconsistent, keyword ignored, unaccent, POST 500 regression).
- ⏳ <a id="r7-7-6"></a>**R7.7.6** ✏️ Khóa học 40 TC + FR-III mới (B10/B11/B12 + Đề KT + Lịch học) `[need: R7.4.B7+B10+B11+B12 ✅]`
- ⏳ <a id="r7-7-7"></a>**R7.7.7** ✏️ Dashboard 34 TC (KPI-07 count đổi) `[need: R7.4 trụ A ✅]`
- ⚠️ <a id="r7-7-8"></a>**R7.7.8** ✏️ QTHT 14 DM CRUD functional (DM-only scope; FR-VIII-01..09/11/12/13/18/19/29)
  - **Kết quả:** ⚠️ 24/25 TC PASS + 1 BLOCK CREATE NGAY_LE (BUG-NGAY-LE-001 Major Open). [functional-test-report-QTHT-14DM.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-QTHT-14DM.md)
  - **Bug:** Không có bug mới R7.7.8. 1 bug đã log từ trước (BUG-NGAY-LE-001 Major) Open chờ dev fix; 3 bug khác (CTHT-001/002, LOAI-DN-002) đã Closed-verified 2026-05-07.
- ✅ <a id="r7-7-8a"></a>**R7.7.8a** 🆕 TAI_KHOAN SM 5 states (TP-TK-01..11)
  - **Kết quả:** PASS 6/6 — TK-SM-003 tab Vô hiệu hóa fix (re-test 2026-05-07). [functional-test-report-FR-VIII-15-tk-sm.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-FR-VIII-15-tk-sm.md)
  - **Bug:** [bug-report-r7-7-8a-tk-sm.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-r7-7-8a-tk-sm.md) — 2/2 đóng (TK-SM-002 + 003 Closed-verified 2026-05-07).
  - **Cần có sẵn:** TP-04 ⏳ R7.7.8b/R7.2.6 ✅; TP-02/03 cần legacy seed; TP-08/11 P2 SQL backdate.
- ⚠️ <a id="r7-7-8b"></a>**R7.7.8b** 🆕 FR-VIII-22 Self-reg DN E2E
  - **Kết quả:** ⚠️ 7/8 PASS + 1 defer (re-test 2026-05-07 FR22-002 + 001a Closed). [functional-test-report-FR-VIII-22-self-reg-dn.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-FR-VIII-22-self-reg-dn.md)
  - **Bug:** [bug-report-r7-7-8b-self-reg-dn.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-r7-7-8b-self-reg-dn.md) — 2/5 đóng (FR22-002 + 001a Closed; FR22-004 đợi BA; 003/005 defer Minor)
- ⚠️ <a id="r7-7-8c"></a>**R7.7.8c** 🆕 FR-VIII-26 reset MK + kích hoạt lần đầu
  - **Kết quả:** ⚠️ 6/7 PASS + 1 defer — 2 Critical FE Closed; FR26-001 Minor errCode mismatch Open. [functional-test-report-FR-VIII-26-reset-mk.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-FR-VIII-26-reset-mk.md)
  - **Bug:** [bug-report-r7-7-8c-reset-mk.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-r7-7-8c-reset-mk.md) — 2/3 đóng (FR26-FE-01 + FE-02 Closed; FR26-001 Minor defer Open)
- ✅ <a id="r7-7-8d"></a>**R7.7.8d** 🆕 FR-VIII-28 Audit log functional
  - **Kết quả:** PASS 7/7 sau dev fix (90-day + Export + page 50 + filter Người dùng + cột Đơn vị + dropdown Tiếng Việt). [functional-test-report-FR-VIII-28-audit-log.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-FR-VIII-28-audit-log.md)
  - **Bug:** [bug-report-r7-7-8d-audit-log.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-nhat-ky/bug-report-r7-7-8d-audit-log.md) — 6/6 đóng (re-test 2026-05-07 ALL Closed-verified)
- ⚠️ <a id="r7-7-8e"></a>**R7.7.8e** 🆕 FR-VIII-14 Vai trò CRUD (VAI_TRO entity, SCR-VIII-02)
  - **Kết quả:** ⚠️ 11/11 PASS — 6 bug Closed (re-test 2026-05-07); VT-008 Minor errCode mismatch Open. [functional-test-report-FR-VIII-14-vai-tro.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-FR-VIII-14-vai-tro.md)
  - **Bug:** [bug-report-r7-7-8e-vai-tro.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-vai-tro/bug-report-r7-7-8e-vai-tro.md) — 6/7 đóng (VT-001/003/004/005/006/009 Closed; VT-008 Minor defer Open)
- ⏳ <a id="r7-7-9"></a>**R7.7.9** ✏️ Đánh giá Hiệu quả HTPL functional 46 TC v3.5 (10 FR)
  - **Cần có sẵn:** R7.4.D2 ⚠️ + R7.4.D2a/D2b ✅
- ⚠️ <a id="r7-7-10"></a>**R7.7.10** ✏️ Biểu mẫu v3.5 — 47 TC (7 cũ + 10 CR-01 + 30 CRUD/workflow)
  - **Kết quả:** PASS 22/47 (47%) — 19 PASS + 1 PARTIAL + 3 FAIL + 11 BLOCKED + 14 DEFER. P0 9/14. [functional-r7-7-10](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-7-10-bm.md)
  - **Bug:** [bug-report-functional-bm-r7-7-10.md](../output/qa-reports/round7-2026-05-06/bug-reports/bm/bug-report-functional-bm-r7-7-10.md) — 0/2 đóng (BUG-BM-007 Critical MinIO localhost broken preview+download · BUG-BM-008 Medium silent reject upload). Workflow bugs riêng tại [bug-report-flow-bm-r7-4-c1.md](../output/qa-reports/round7-2026-05-06/bug-reports/bm/bug-report-flow-bm-r7-4-c1.md) (6 bugs R7.4.C1).
- ⚠️ <a id="r7-7-11"></a>**R7.7.11** 🔄 TV nhanh 44 TC v3.5 (R8 Kho Q&A + R9 phiên TV nhanh)
  - **Kết quả:** PASS 12/19 đã test (63%) — 12 PASS + 5 PARTIAL + 6 BLOCKED + 25 chờ mTLS/multi-role/feature. R9 +5 TC (TVN-016/017/018/019/021/039) sau dev seed 50 phiên. [functional-r7-7-11](../output/qa-reports/round7-2026-05-06/functional/tu-van-nhanh/functional-test-report-r7-7-11-tvn.md)
  - **Bug:** [bug-report-r7-7-11-tvn.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-nhanh/bug-report-r7-7-11-tvn.md) — 0/5 đóng (TVN-001 Critical authz · 002 Major FR-X.2-06 · 003 Minor filter · **TVN-004 Major gợi ý không render R9 · TVN-005 Minor audit naming R9**)
- 🟢 <a id="r7-7-12"></a>**R7.7.12** ✏️ Chi trả v3.5 — 35 TC (30 base + 5 mới) `[~80% — 28 TC ready; CT-006 + CT-021 chờ BA Q1+Q2]`
  - **Cần có sẵn:** R7.7.12.1 ✅ + R7.E3 ⚠️ + R7.6.1 cho TC workflow.
  - **Output:** functional-test-report-ChiTra-v3.5.md

- ✅ <a id="r7-7-12-1"></a>**R7.7.12.1** 🆕 Smoke regression IMPACT — FR-07/08/11/13 × 5 phút
  - **Kết quả:** PASS 4/4 module render OK, 0 console error, ⚠️ DN count 23 vs 36 (R7.2.4) cần investigate. [smoke-test-report-r7-7-12-1-fr06-impact.md](../output/qa-reports/round7-2026-05-06/functional/smoke-test-report-r7-7-12-1-fr06-impact.md)

- 🚫 <a id="r7-7-12-2"></a>**R7.7.12.2** 🆕 FR-V.II-14 DN bổ sung HS `[block: thiếu HSCT YEU_CAU_BO_SUNG — chờ R7.6.1]`
  - **Cần có sẵn:** R7.6.1 🚫 tới state YEU_CAU_BO_SUNG + file mock 5 định dạng.
  - **Output:** functional-test-report-fr-v.ii-14-2026-05-06.md

- 🚫 <a id="r7-7-12-3"></a>**R7.7.12.3** 🆕 CB PD trả về DANG_THAM_DINH + PHE_DUYET_CHI_TRA N:1 `[block: thiếu HSCT CHO_PHE_DUYET — chờ R7.6.1]`
  - **Cần có sẵn:** R7.6.1 🚫 tới state CHO_PHE_DUYET + 2 CB PD cùng cấp.
  - **Output:** functional-test-report-fr-v.ii-12-cbpd-tra-ve-2026-05-06.md

- ✅ <a id="r7-7-12-4"></a>**R7.7.12.4** 🆕 UI tiếng Việt thuần SCR-V.II-01/02
  - **Kết quả:** PASS 2/2 — 0 enum code, 0 English leak, 0 null/undefined, 7 status badge dịch tiếng Việt. [functional-test-report-r7-7-12-4-ui-vn-thuan.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-7-12-4-ui-vn-thuan.md)
- ⏳ <a id="r7-7-13"></a>**R7.7.13** 🔄 Báo cáo 38 TC `[need: ≥1 BC từ HD/VV/TVCS/CT/Đào tạo ready]`
- ⏳ <a id="r7-7-14"></a>**R7.7.14** 🔄 HĐ tư vấn (UC163 sub-resource v2.1) `[need: R7.4.A3 + R7.4.A1 🟢]`
- ⏳ <a id="r7-7-15"></a>**R7.7.15** 🔄 CT HTPLDN 42 TC `[need: R7.6.4 🟢]`
- ⏳ <a id="r7-7-16"></a>**R7.7.16** ✏️ API 42 TC + 8 API inbound mock (v3.5 rename filter `cong_khai=1`) `[need: data upstream state cuối từ HD/VV/TVCS/Chi trả/CT/TVN]`
- ⏳ <a id="r7-7-17"></a>**R7.7.17** 🔄 Edge BR-EC-01..23 (4 BR scope) `[need: infra/wait/integration cho 19 BR còn lại]`

---

## Phase 8 — Cross-cutting + Profile + Permission

- ✅ <a id="r7-8-1"></a>**R7.8.1** 🆕 Verify hard delete (DELETE → record không còn trong GET list)
  - **Kết quả:** PASS — DELETE 204 → GET list count -1 + GET by ID 404. Confirm BE hard-delete; SRS modal MD-XOA "xóa mềm" obsolete. [functional-test-report-r7-8-1-hard-delete.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-8-1-hard-delete.md)
- ⚠️ <a id="r7-8-2"></a>**R7.8.2** 🆕 Verify bỏ ClamAV (upload `.exe` → BE behavior, security regression risk)
  - **Kết quả:** PASS extension whitelist (.exe/.bat/.docm/.zip reject) + 🚨 SECURITY GAP magic-byte (mime spoof .pdf chứa PE bytes lọt). [functional-test-report-r7-8-2-clamav-removal.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-8-2-clamav-removal.md)
- ⚠️ <a id="r7-8-3"></a>**R7.8.3** 🆕 Verify bỏ lưu nháp scope hẹp (button [Lưu nháp] bỏ, state DU_THAO/NHAP/MOI_DANG_KY giữ)
  - **Kết quả:** PARTIAL — entry state DRAFT ✅ giữ, button [Lưu nháp] ❌ CHƯA bỏ trên form CT HTPLDN. SRS item 11 chưa implement FE. [functional-test-report-r7-8-3-luu-nhap-scope-hep.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-8-3-luu-nhap-scope-hep.md)
- ⚠️ <a id="r7-8-4"></a>**R7.8.4** 🆕 Profile + đổi MK self-service (ho-so-doi-mat-khau.md)
  - **Kết quả:** PASS 5/5 + 3/3 trường + 3 mâu thuẫn detected (MK strength rule diff, errCode mismatch BUG-FR26-001, "Phiên đăng nhập" extra). [functional-test-report-r7-8-4-profile-doi-mk.md](../output/qa-reports/round7-2026-05-06/functional/functional-test-report-r7-8-4-profile-doi-mk.md)
- 🟢 <a id="r7-8-5"></a>**R7.8.5** 🆕 Permission 55+ entity × 11 role sample 40 TC/module `[~0% — ready, was R5 scope; entity count update v3.5]`
- 🟢 <a id="r7-8-6"></a>**R7.8.6** 🆕 Verify UC renumber +4 offset FR-11 (UC120-142 → UC124-146 do FR-VIII-22..25 chiếm UC120-123) `[~0% — ready, scope: 23 UC × 11 role × 1 BC mỗi loại = 253 entries cần verify trong [permission-matrix-by-role.md](../output/permission-matrix-by-role.md) FR-IX block + 7.11-bao-cao-thong-ke.md UC ref khớp v3.5; CHANGELOG §srs-fr-11 Thay đổi 1]`

---

## 🟥 Trụ E — Theo dõi unblock (xuyên suốt R7, không gate)

- ✅ <a id="r7-e1"></a>**R7.E1** 🔄 HĐ tư vấn (FR-X3-01) — sub-resource VV/TVV
  - **Kết quả:** PASS 6/6 — 4 FE route + 2 API endpoint trả 404, sidebar không có menu HĐ TV độc lập. Match spec v2.1. [verify-checklist-r7-e1-hdtv-url.md](../output/qa-reports/round7-2026-05-06/seed/verify-checklist-r7-e1-hdtv-url.md)
- ✅ <a id="r7-e2"></a>**R7.E2** 🔄 CT HTPLDN GĐ1 (FR-15) — verify 3 CT data còn
  - **Kết quả:** PASS 3/3 — CT-20260507-0001/0002/0003 cover 3 path R7.6.4 (DA_DUYET/DU_THAO/HUY). API total=3. [verify-checklist-r7-e2-ct-htpldn-gd1.md](../output/qa-reports/round7-2026-05-06/seed/verify-checklist-r7-e2-ct-htpldn-gd1.md)
- ⚠️ <a id="r7-e3"></a>**R7.E3** 🔄 Chi trả (FR-06) — verify 100 record HSCT còn
  - **Kết quả:** ⚠️ PARTIAL 78/100 — REGRESSION thiếu 22 HSCT (079..100). 78 còn cover 11 trạng thái SM-CHI-TRA. [verify-checklist-r7-e3-chi-tra-100-hsct.md](../output/qa-reports/round7-2026-05-06/seed/verify-checklist-r7-e3-chi-tra-100-hsct.md)
- ✅ <a id="r7-e4"></a>**R7.E4** 🔄 TV nhanh (FR-13.A) — ≥1 phiên tồn tại
  - **Kết quả:** PASS 50 phiên cover 6 state SM-TVNHANH (MOI 8 / DANG_TIM_KIEM 6 / DA_GOI_Y 10 / CB_TRA_LOI 10 / HOAN_THANH 12 / HET_HAN 4) + 2 enum kênh (TV_NHANH 40 / TV_THU_CONG 10). [verify-checklist-r7-e4-tv-nhanh.md](../output/qa-reports/round7-2026-05-06/seed/verify-checklist-r7-e4-tv-nhanh.md)

---

## 🔓 Open issues — defer log bug khi gặp behavior thực tế

- **Item 3** — Migration `loai_tvv='NHT'` cũ sang NGUOI_HO_TRO. [trigger R7.4.A2/R7.7.2]
- **Item 6** — Migration DN cũ tạo bằng CB NV → có cần convert TK-first? [trigger R7.7.4]
- **Item 9** — DN không email/chưa ĐKKD vào hệ thống cách nào? [trigger R7.2.4]
- **Item 11** — NGAY_LE seed danh sách 2026 — BA cấp file Excel? [trigger R7.1.5]
- **SRS FR-10 v3.5** — 11 inconsistency + 10 câu BA. 3 hard block (Q1/Q2/Q3) block Tier 2 R7.7.8. [bug-report](../output/qa-reports/round7-2026-05-06/bug-reports/_meta/bug-report-r7-srs-fr10-inconsistency.md)
- **SRS FR-07 v3.5** — 2 gap UI khi chạy R7.7.4 (filter Lĩnh vực textbox + cột Ngành nghề thừa).
- **SRS FR-06 v3.5** — 2 BA Q + LGSP integration thiếu. [ba-questions-fr06](../output/qa-reports/round7-2026-05-06/bug-reports/_meta/ba-questions-fr06-2026-05-06.md)
- **SRS FR-05 v3.5** — 7 defer items (SLA NĐ55 / migration `nguoi_ho_tro_id` / sandbox VNeID Tier 2 / BR-CALC-04 ID conflict 7.5 vs 7.8 / 3 transition không FR formal / 2 P0 privacy / BR-AUTH-08 exception TW). Chi tiết [session-handoff-r7-spec-sync.md](session-handoff-r7-spec-sync.md).
- **SRS FR-02 v3.5** — DA_PHAN_CONG (LỖI A) là typo SRS sao chép nhầm template từ FR-V.I-09 VU_VIEC, **KHÔNG block test** (Master truth = HOI_DAP 9 state, test plan đã đúng); FR-II-NEW-02 đã CĐT chốt 2026-05-02. R7.3.1.MoB seed qua UI Tab Mẫu phản hồi (deploy ✅ verified bug R7.1.1) — auto `pham_vi_ap_dung` theo cấp user. R7.3.1.TVN walk UI FR-13 ESCALATE (R7.6.2 ⏳). Chi tiết [session-handoff-r7-spec-sync.md](session-handoff-r7-spec-sync.md).

---

## Bug deploy gap

[bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-reports/_meta/bug-report-deploy-gap.md) — 6 bug verified MCP (3 Major DEPLOY-001/002/003 + 2 Medium DEPLOY-004/006 + 1 Minor DEPLOY-005). + 2 bug FR-07 đã Closed: [bug-report-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/doanh-nghiep/bug-report-r7-0-6-fr-07-buttons.md). + 2 false positive (sub-menu NHT/TC TV) DROPPED — bài học `feedback_verify_ui_gap_role_permission`.
