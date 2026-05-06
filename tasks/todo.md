# TODO — QA HTPLDN Round 7 (apply SRS update 2026-05-05)

**App:** http://103.172.236.130:3000/ · **MailHog:** http://103.172.236.130:8025  
**Plan:** [plan.md](plan.md) v2.6.1 · **Plan trigger:** [plan-r7-trigger.md](plan-r7-trigger.md) · **Spec data:** [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)  
**R6 frozen:** [_archive/round6-frozen-2026-05-06.md](_archive/round6-frozen-2026-05-06.md) (74 task, ref lịch sử)  
**Today:** 2026-05-06

**Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream  
**Tag kế thừa R6:** 🔄 KEPT (spec không đổi, re-seed/re-test) · ✏️ MODIFIED (spec đổi) · 🆕 NEW (feature SRS update)

> **Bối cảnh R7:** Dev đã deploy SRS update 2026-05-05 + partial reset DB (verified 2026-05-06 qua MCP). 8 deploy gap đã log: entity NHT/HOC_VIEN BE 404, sub-menu UI thiếu, tab Ngày lễ chưa có, filter Địa bàn vẫn còn. Chi tiết: [plan-r7-trigger.md §2](plan-r7-trigger.md).

---

## Tổng hợp Round 7

| Phase | Việc | Tổng | 🟢 | 🔵 | ✅ | ⚠️ | 🚫 | ⏳ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | Pre-test (verify deploy + bug gap + fixture) | 5 | 3 | - | 2 | - | - | - |
| 1 | Re-seed Tier 0 (DM/đơn vị/SLA/MPH/ngày lễ) | 5 | 5 | - | - | - | - | - |
| 2 | Re-seed Tier 1 (TC TV/DN/TVV/CG/NHT/account/PC) | 11 | 8 | - | - | - | 1 | 2 |
| 3 | Re-seed Tier 2 (transactional entry state) | 13 | 10 | - | - | - | 2 | 1 |
| 4 | Workflow E2E (Trụ A/B/C/D) | 18 | 2 | - | - | - | - | 16 |
| 5 | Verification (KPI/cross/SLA/audit) | 5 | 3 | - | - | - | - | 2 |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TVN/CT) | 5 | 1 | - | - | - | - | 4 |
| 7 | Functional 17 module + 2 NEW (NHT/TC TV) | 19 | 3 | - | - | - | - | 16 |
| 8 | Cross-cutting + Profile + Permission | 5 | 5 | - | - | - | - | - |
| Trụ E | Monitor unblock | 4 | 3 | - | - | - | - | 1 |
| **Tổng** | | **90** | **43** | **0** | **2** | **0** | **3** | **42** |

> **Lưu ý:** Phase 2 có **1 task ❌ DROPPED** (R7.2.10 6 TK TVV TW — obsoleted by SRS update FR-04 line 590, hệ thống tự cấp TK). KHÔNG count vào tổng 90 active.

---

## Phase 0 — Pre-test (gate before run)

- ✅ **R7.0.1** Verify deploy + scenario reset DB — DONE 2026-05-06
  - **R7:** Scenario MIX — partial reset (DN 30 mới, TVV/CG/KH=0, VV=70) + 10/18 deploy OK + 8 gap. [plan-r7-trigger.md](plan-r7-trigger.md)
- 🟢 **R7.0.2** 🆕 Log 8 bug deploy gap → gửi dev fix song song chạy P1/P2 `[~0% — ready, file output/qa-reports/round7-2026-05-06/bug-report-deploy-gap.md]`
- ✅ **R7.0.3** 🆕 Bump fixture v2.7.0 → v2.7.1 (R7.0.3 done 2026-05-06)
  - **R7:** v2.7.1 header note instruction strip `dia_ban_ids` + `loai_tvv:NHT` khỏi payload khi seed. 24 dòng dia_ban_ids giữ legacy R6 reference. [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)
- 🟢 **R7.0.4** 🔄 Verify users.csv accounts còn login (qtht_01/cb_nv_*/nht_01..03/cg_tw_01..06) `[~0% — ready, login từng account qua MCP]`
  - **R6:** ✅ R6.0.3 PASS — qtht_01/Secret@123/OTP 666666 OK; 34 TK pre-existing
- 🟢 **R7.0.5** 🔄 Verify SCR-VIII-02 button [Thêm mới] visible (QTHT seed TK lại nếu mất) `[~0% — ready, smoke 30s qua MCP]`
  - **R6:** ✅ R6.0.4 — button uid 5_27 visible

---

## Phase 1 — Re-seed Tier 0 (qtht_01)

- 🟢 **R7.1.1** 🔄 DM LINH_VUC_PL (6 LV) `[~0% — ready, re-seed sau reset]`
  - **R6:** ✅ R6.1.1 — 6/6 fixture cover (5 pre-existing + seed HOP_DONG) → 13 records. [seed-checklist-QTHT.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-QTHT.md)
- 🟢 **R7.1.2** 🔄 DM LOAI_DN (TNHH/CP/DNTN/HKD) `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.1.2 — seed 4 mới + 3 quy mô existing → 7 records
- 🟢 **R7.1.3** 🔄 DON_VI 7 đơn vị (TW + 3 BN + AG/BG/BNI) `[~0% — ready, verify còn pre-existing]`
  - **R6:** ✅ R6.1.3 — convention AG/BG/BNI thay HN/HP/DN, adapt downstream
- 🟢 **R7.1.4** 🔄 SLA 4 loại (HOI_DAP 10d, VV 10d, HSHT 15d, HSTT 10d, hệ số 2.0) `[~0% — ready, verify pre-existing]`
  - **R6:** ✅ R6.1.4 — 4 pre-existing match fixture
- 🟢 **R7.1.5** 🆕 Seed 5 ngày lễ 2026 qua API trực tiếp (FR-VIII-29) `[~0% — ready, UI tab chưa có → API workaround; nguồn ngay_le_variants v2.7.1]`

---

## Phase 2 — Re-seed Tier 1 (master actor) — strict thứ tự FK

> **Dependency:** TC TV → TVV/CG (FK to_chuc_chinh_id phải HOAT_DONG); NHT seed → activate; account login → FK link.

- 🟢 **R7.2.1** 🔄 Seed 12 mẫu phản hồi (cover 6 LV × 2 mẫu/LV) `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.1.5 — PASS 12/12 qua UI (6 TW + 3 BN + 3 DP). [seed-checklist-MPH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-MPH.md)
  - **Bug R6:** [bug-report-seed-qtht.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-qtht.md) — 3/3 đóng (MPH-001/002/003)
- 🟢 **R7.2.2** 🆕 Seed 6 Tổ chức tư vấn qua API trực tiếp `[~0% — ready, UI sub-menu chưa có; nguồn to_chuc_tu_van_variants v2.7.1]`
- 🟢 **R7.2.3** 🆕 Phê duyệt TC TV → HOAT_DONG (FR-IV-NEW-04, CB PD cùng cấp) `[~0% — ready, sau R7.2.2 ✅]`
- 🟢 **R7.2.4** ✏️ Seed 15 DN qua FR-VIII-22 self-reg `[~0% — ready, flow đổi từ CB NV sang DN tự đăng ký; verify dev đã re-seed 30 record DN000001..030]`
  - **R6:** ✅ R6.2.1+2.2+2.3 — 50 pre-existing + 12 fixture v2.6.2 + 3 ĐP extension. [bug-report-fixture-seed-dn.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md)
  - **Bug R6:** 0/4 đóng (JWT Critical, DM polluted Major, Search Major, API schema Medium) — verify còn không sau dev deploy
- 🟢 **R7.2.5** ✏️ Seed 6 TVV TW (bỏ dia_ban_ids, MOI_DANG_KY) `[~0% — ready, fixture v2.7.1 bỏ dia_ban_ids; need R7.2.3 ✅ TC TV HOAT_DONG cho FK]`
  - **R6:** ✅ R6.2.4 — PASS 6/6 saved (TW-0001..0006). [bug-report-seed-tvv.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-tvv.md) 2/2 đóng
- 🟢 **R7.2.6** ✏️ Seed 6 CG TW (`loai_tvv=CG`, MOI_DANG_KY) `[~0% — ready, enum bỏ NHT chỉ còn TVV/CG]`
  - **R6:** ✅ R6.2.5 — Audit R12 chỉ 5/6 visible (TVV-0008 missing). Seed bù 2 CG R12 cover 6/6 LV
- 🚫 **R7.2.7** 🆕 Seed 3 NHT qua FR-IV-NHT-01 (entity NGUOI_HO_TRO mới) `[block: dev fix entity 404 /api/v1/nguoi-ho-tros]`
- 🟢 **R7.2.8a** 🔄 QTHT tạo 6 account `cg_tw_01..06` `[~0% — ready, was R6.2.7 phần CG; need R7.2.6 ✅]`
  - **R6:** ✅ R6.2.7 (split phần cg) — PASS 6/6. [seed-checklist-account.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-account.md)
- ⏳ **R7.2.8b** 🔄 QTHT tạo 3 account `nht_ag_01/dn_01/hp_01` `[need: R7.2.7 ✅ NHT entity]`
  - **R6:** ✅ R6.2.7 (split phần nht) — PASS 3/3
- ⏳ **R7.2.9** ✏️ Activate 9 accounts qua FR-VIII-26 (kích hoạt TK lần đầu) `[need: R7.2.8a ✅ + R7.2.8b ✅; flow đổi từ activate trực tiếp sang bấm link mail]`
  - **R6:** ✅ R6.2.8 — PASS 9/9 active. nht_ag_01 login + role NHT OK
- ❌ **R7.2.10** ~~6 TK TVV TW~~ — DROPPED 2026-05-06 (obsoleted by SRS update FR-04 line 590: hệ thống tự cấp TK qua FR-VIII-15 trong A1 step 6 phê duyệt) `[was R6.2.7-TW PASS 6/6 — workaround R6 không còn cần thiết]`
- 🟢 **R7.2.11** 🔄 Cấu hình PC mặc định Đợt 1 — 6 LV → cb_nv_tw_01 `[~0% — ready, was R6.2.9a]`
  - **R6:** ✅ R6.2.9a — PASS 6/6. [seed-checklist-cau-hinh-PC.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-cau-hinh-PC.md)

---

## Phase 3 — Re-seed Tier 2 (transactional entry state)

- 🟢 **R7.3.1** 🔄 Seed 6 Hỏi đáp entry MOI cover 6 LV × 4 kênh `[~0% — ready, need R7.2.11 ✅]`
  - **R6:** ✅ R6.3.1 — PASS 6/6 HD-20260501-001..006. [r6-3-1-hd-6of6-moi.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-1-hd-6of6-moi.png)
- 🟢 **R7.3.2** 🔄 Seed 8 Vụ việc entry DA_TIEP_NHAN `[~0% — ready, verify 70 VV existing dashboard có valid không]`
  - **R6:** ✅ R6.3.2 — PASS pre-existing 100 VV. ≥4 ở "Đã tiếp nhận". [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- 🟢 **R7.3.3** 🔄 Seed 6 TVCS entry TIEP_NHAN cover 6 LV `[~0% — ready, need R7.2.5/6 ✅; verify endpoint /tu-van-chuyen-saus 404 sau dev fix]`
  - **R6:** ✅ R6.3.3 — PASS 6/6 TVCS-20260501-0001..0006. [r6-3-3-tvcs-6of6-tiep-nhan.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-3-tvcs-6of6-tiep-nhan.png)
- 🟢 **R7.3.4** 🔄 Seed 10 HSPL DN cover 5 loại × 3 state × 5 DN `[~0% — ready, need R7.2.4 ✅]`
  - **R6:** ✅ R6.3.4 — PASS 10/10 HSPL-20260503-0001..0004. Per-filter HIEU_LUC=8/HET_HAN=1/THU_HOI=1/KHAC=1
- ⏳ **R7.3.5** 🆕 Seed Kế hoạch ĐT năm (KE_HOACH_DAO_TAO — Mô hình A 3 cấp) `[need: dev confirm endpoint deploy]`
- 🟢 **R7.3.6** ✏️ Seed 6 CTĐT entry DU_THAO `[~0% — ready, was R6.3.5; need R7.3.5 ✅; entry DU_THAO theo SM-CTDT mới]`
  - **R6:** ✅ R6.3.5 — PASS 6/6 CTDT-BTP-TW-2026-0001..0006. [r6-3-5-ctdt-list-6du-thao.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-5-ctdt-list-6du-thao.png)
- 🟢 **R7.3.7** 🔄 Seed 4 thư mục + 7 biểu mẫu entry NHAP `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.7 — PASS 4 thư mục + 7/7 BM-20260501-001..007 (6 docx + 1 xlsx). [r6-3-7-bieumau-list-7nhap.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-7-bieumau-list-7nhap.png)
- 🟢 **R7.3.8** 🔄 Seed 10 NHCH entry NHAP `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.8a — PASS 10/10 per-filter. [seed-checklist-NHCH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-NHCH.md)
- 🟢 **R7.3.9** 🔄 Seed 5 ĐKT entry NHAP cover 5 LV `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.8b — PASS 5/5 cover 5 LV. THU_CONG only. NGAU_NHIEN block do BE filter NHCH `trangThai=CONG_KHAI`. [seed-checklist-DKT.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DKT.md)
- 🟢 **R7.3.10** 🔄 Seed 8 bài giảng entry KICH_HOAT `[~0% — ready, re-seed]`
  - **R6:** ✅ R6.3.9 — PASS 8/8 (4 Slide + 1 PDF + 3 Video). [seed-checklist-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-baigiang.md)
  - **Bug R6:** [bug-report-seed-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-baigiang.md) — 1/1 đóng (BUG-FUNC-BAIGIANG-001 CLOSED)
- 🟢 **R7.3.11** ✏️ Seed 8 giảng viên entry HOAT_DONG (verify FR-III-11 refactor) `[~0% — ready]`
  - **R6:** ✅ R6.3.10 — PASS 8/8 GV-BTP-TW-0001..0008 cover 6 LV + 6 GV/2 TG. [seed-checklist-GiangVien.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-GiangVien.md)
- 🚫 **R7.3.12** 🆕 Seed 8 Học viên (HOC_VIEN entity mới — Mô hình A) `[block: dev fix entity 404 /api/v1/hoc-viens]`
- 🚫 **R7.3.13** 🆕 Seed Lịch học (LICH_HOC — FR-III-22) `[block: chưa rõ endpoint deploy]`

---

## Phase 4 — Workflow E2E (multi-role)

### 🟦 Trụ A — TVV → PC → CG → VV → HD → TVCS

- ⏳ **R7.4.A1** ✏️ Workflow TVV (SM 9→11 state, thêm CHO_KICH_HOAT, hệ thống tự cấp TK qua FR-VIII-15 step 6) `[need: R7.2.5 ✅ + R7.2.6 ✅]`
  - **R6:** ✅ R6.4.A1 — PASS 10/10 CMS-scope (12 bước). B7+B8 (FR-IV-11) ngoài scope qua Portal. [workflow-test-report-TVV.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVV.md)
- ⏳ **R7.4.A1-CG** ✏️ Advance state 6 CG → DANG_HOAT_DONG (loai_tvv enum đổi) `[need: R7.2.6 ✅]`
  - **R6:** ✅ R6.4.A1-CG — PASS 6/6 CG (4 + 2 bonus seed LĐ/Thuế). Pool 12/12. [workflow-test-report-CG.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CG.md)
- ⏳ **R7.4.A1.5** ✏️ Đợt 2 PC TVV backfill — verify dropdown "Người xử lý" có TAI_KHOAN role NHT mới sau khi NHT tách entity `[need: R7.4.A1 ✅ + R7.4.A1-CG ✅; verify 2 BE bug Open R6 (CHPC-001/002) còn không sau dev deploy]`
  - **R6:** ⚠️ R6.4.A1.5 ~95% — 12/12 PC config done, 2 BE bug Open
  - **Bug R6:** [bug-report-flow-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-vuviec.md) — 0/2 đóng (BUG-FUNC-CHPC-001/002)
- ⏳ **R7.4.A2** 🆕 Tiếp nhận TVV (FR-IV-13) — 3 transition mới (MOI_DANG_KY→CHO_THAM_DINH, YEU_CAU_BO_SUNG→DANG_THAM_DINH, TU_CHOI→CHO_THAM_DINH) `[need: R7.4.A1 ≥1 TVV MOI_DANG_KY]`
- ⏳ **R7.4.A3** ✏️ Workflow VV (FK `nguoi_ho_tro_id` đổi target sang NGUOI_HO_TRO) `[need: R7.2.9 ✅ NHT active; block khi NHT entity chưa deploy]`
  - **R6:** ✅ R6.4.A3 — PASS 12/12 CMS DB (R8 happy 7/12 + R9 reject/edge 5/12). [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ⏳ **R7.4.A4** ✏️ Workflow Hỏi đáp (dropdown phân công NHT/TVV/CB tách 2 entity) `[need: R7.2.9 ✅]`
  - **R6:** ✅ R6.4.A4 — PASS 11/11 transition. ERR-PH-01 + BR-FLOW-01/04 + push Cổng PLQG verified. [workflow-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HoiDap.md)
- ⏳ **R7.4.A5** ✏️ Workflow TVCS 11 bước (dropdown CG enum đổi) `[need: R7.2.6 ✅ + R7.3.3 ✅]`
  - **R6:** ⚠️ R6.4.A5 ~27% — 3/11 PASS (R17 fix TVCS-002), 6 BLOCKED FK + 2 external. [workflow-test-report-TVCS.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVCS.md)
  - **Bug R6:** [bug-report-flow-tvcs.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-tvcs.md) — 0/2 Open (TVCS-001/002 Closed R17)

### 🟩 Trụ B — Đào tạo

- ⏳ **R7.4.B0** 🆕 Workflow KH năm (SM-KH-DAO-TAO refinement TU_CHOI→CHO_DUYET) `[need: R7.3.5 ✅]`
- ⏳ **R7.4.B1** ✏️ Workflow CTĐT SM-CTDT mới (DU_THAO→CHO_DUYET→DA_DUYET) `[need: R7.3.6 ✅; UNBLOCKED — SRS update giải quyết spec contradiction R6.4.B2]`
  - **R6:** 🚫 R6.4.B2 + B2.5 — block spec contradiction. R11 BLOCK 0/2 transition, 6/6 CTĐT stuck DU_THAO. [workflow-test-report-CTDT.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTDT.md)
  - **Bug R6:** [bug-report-flow-ctdt.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-ctdt.md) — 0/1 đóng — verify dev fix kèm SRS update có đóng không
- ⏳ **R7.4.B5b** 🔄 Publish NHCH NHAP→CONG_KHAI `[need: R7.3.8 ✅]`
  - **R6:** ✅ R6.4.B5b — PASS 11/11 per-filter. NGAU_NHIEN ĐKT R6.3.8b unblock. [workflow-test-report-NHCH-publish.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-NHCH-publish.md)
- ⏳ **R7.4.B7** ✏️ Workflow KH SM-KHOAHOC 11 state (thêm TU_CHOI + TU_CHOI_KQ) — 12 bước `[need: R7.4.B1 ✅ DA_DUYET; UNBLOCKED]`
  - **R6:** 🚫 R6.4.B7 — cascade B2.5 block. 0 KH state DU_THAO
- ⏳ **R7.4.B10** 🆕 Workflow Đề kiểm tra (FR-III-NEW-01/02/03) — tạo + phân phối + map bài giảng `[need: R7.3.9 ✅ + R7.4.B5b ✅]`
- ⏳ **R7.4.B11** 🆕 Phê duyệt khóa học (FR-III-21) `[need: R7.4.B7 ≥1 KH DA_KET_THUC]`
- ⏳ **R7.4.B12** 🆕 Quản lý lịch học (FR-III-22) `[need: R7.3.13 ✅]`

### 🟨 Trụ C — Biểu mẫu

- 🟢 **R7.4.C1** 🔄 Workflow Biểu mẫu NHAP→CONG_KHAI→AN `[~0% — ready, need R7.3.7 ✅]`
  - **R6:** ✅ R6.4.C1 — PASS 3/3 transition SM-BIEUMAU. Sync "Đã đồng bộ" verified. [workflow-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-BieuMau.md)

### 🟧 Trụ D — Đánh giá HQ + Kho QA

- 🟢 **R7.4.D1** 🔄 Tạo kỳ Đánh giá HQ entry LAP_KE_HOACH `[~0% — ready]`
  - **R6:** ✅ R6.4.D1 — PASS 1/1 DG-20260502-0001. [seed-checklist-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DanhGiaHQ.md)
- ⏳ **R7.4.D2** ✏️ Workflow Đánh giá HQ 11 bước `[need: R7.4.D1 ✅; UNBLOCKED — dev item 2 fix bug FR-08 5 bug FE]`
  - **R6:** 🚫 R6.4.D2 — R14 BLOCKED 1/11 PASS B1 do 5 bug FE. [workflow-test-report-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-DanhGiaHQ.md)
  - **Bug R6:** [bug-report-flow-danhgia.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-danhgia.md) — 0/5 đóng — verify dev item 2 fix kèm có đóng không
- ⏳ **R7.4.D3** ✏️ Tạo Kho QA `[need: dev item 4 fix bug R6.4.D3]`
  - **R6:** ⚠️ R6.4.D3 ~50% — UI route block FE. THU_CONG 1 record qua API, TU_DONG=0. [seed-checklist-KhoQA.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-KhoQA.md)
  - **Bug R6:** [bug-report-flow-kho-qa.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-kho-qa.md) — 0/1 đóng (BUG-KHOQA-001 Critical)

---

## Phase 5 — Verification

- ⏳ **R7.5.1** ✏️ Dashboard KPI counter HD/VV/TVCS/CT (KPI-07 count đổi do NHT tách entity) `[need: R7.4.A1/A3/A4/A5 ✅]`
  - **R6:** ⏳ R6.5.1 — chờ A5 ✅. HD ✅ + VV ✅ + CT ✅ đủ; thiếu TVCS
- 🟢 **R7.5.2** 🔄 Cross-module DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả ≥1 record/tab `[~0% — ready, need R7.3.4 ✅ + R7.4.A3 ✅ + R7.6.1 ✅]`
  - **R6:** 🟢 R6.5.2 — full ready: DN001 HSPL ✅ + KPI A3 ✅ + 100 chi trả E3 ✅
- ⏳ **R7.5.3** ✏️ SLA cảnh báo banner — verify trừ ngày lễ (BR-CALC-03) `[need: R7.1.5 ✅ + ≥1 HD/VV deadline >70%]`
  - **R6:** ⏳ R6.5.3 — chờ thời gian hoặc dev seed lùi ngày
- 🟢 **R7.5.4** 🔄 BC04 export Excel có data `[~0% — ready, need R7.4.A3 + R7.4.A4 ✅]`
  - **R6:** 🟢 R6.5.4 — full ready: HD CONG_KHAI + VV HOAN_THANH
- 🟢 **R7.5.5** 🔄 Audit log ≥100 entry qua Nhật ký HT (FR-VIII-28) `[~0% — ready, accumulate qua Phase 4]`
  - **R6:** 🟢 R6.5.5 — full ready

---

## Phase 6 — Workflow đầu ra hậu kỳ (mapping R5 P3)

- ⏳ **R7.6.1** 🔄 Workflow Chi trả 13 bước `[need: data fresh sau reset; verify 100 record HSCT còn không]`
  - **R6:** ⚠️ R6.6.1 ~75% — R19 PASS 6/8 transition, 6/7 bug closed, 1 Open scope shift. [workflow-test-report-ChiTra.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-ChiTra.md)
  - **Bug R6:** [bug-report-flow-chi-tra.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-chi-tra.md) — 6/7 đóng R19 (1 Open scope shift CT-005-BE)
- ⏳ **R7.6.2** 🔄 Workflow TV nhanh nhập tay (5 trạng thái) `[need: R7.4.D3 ✅ Kho QA UI]`
  - **R6:** ⏳ R6.6.2 — block do D3 UI defer FE
- ⏳ **R7.6.3** 🔄 Workflow TV nhanh PUBLIC (DN qua Cổng PLQG) `[need: R7.E4 ✅ + R7.7.16 API ✅]`
  - **R6:** ⏳ R6.6.3 — external integration
- 🟢 **R7.6.4** 🔄 Workflow CT HTPLDN GĐ1 11 bước `[~0% — ready, verify 3 CT data (CT-001/002/003) còn không]`
  - **R6:** ✅ R6.6.4 — PASS 11/11 transitions. CT-001 Hoàn thành / CT-002 Dự thảo / CT-003 Đã hủy. [workflow-test-report-CTHTPLDN-GD1.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTHTPLDN-GD1.md)
- ⏳ **R7.6.5** 🔄 Workflow CT HTPLDN GĐ2 Đợt BC 7 bước `[need: R7.6.4 ✅ + R7.6.1 ≥6 Chi trả + R7.4.A3 ≥6 VV HOAN_THANH]`
  - **R6:** ⏳ R6.6.5 — chờ R6.6.1 + R6.4.A3

---

## Phase 7 — Functional 17 module + 2 NEW (negative + edge + 40 TC perm)

- ⏳ **R7.7.1** 🔄 Hỏi đáp 12 TC `[need: R7.3.1 ✅]`
  - **R6:** ⚠️ R6.7.1 ~92% — 11/12 PASS, 1 PARTIAL HD-022 chờ dev seed lùi ngày. 0 bug. [functional-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-HoiDap.md)
- ⏳ **R7.7.2** ✏️ CG/TVV 31 TC (enum loai_tvv đổi) `[need: R7.2.5/6 ✅]`
  - **R6:** ⚠️ R6.7.2 ~16% — 5/31 PASS, 2 BUG perm Critical/Major. [functional-test-report-CGTVV.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-CGTVV.md)
  - **Bug R6:** [bug-report-functional-cgtvv.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-cgtvv.md) — 0/2 đóng (CGTVV-001 QTHT bypass + CGTVV-002 CG GET 403)
- ⏳ **R7.7.3** 🔄 Vụ việc 12 TC `[need: R7.3.2 ✅]`
  - **R6:** ⚠️ R6.7.3 ~92% — 11/12 PASS, 1 FAIL VV-013d. [functional-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-VuViec.md)
  - **Bug R6:** [bug-report-functional-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-vuviec.md) — 0/1 đóng (VV-001 TVV bypass)
- ⏳ **R7.7.4** ✏️ DN 8 TC (flow tạo đổi sang FR-VIII-22 self-reg) `[need: R7.2.4 ✅]`
  - **R6:** ⚠️ R6.7.4 ~88% — 7/8 PASS, 1 PARTIAL DN-007 UX guard. 0 bug. [functional-test-report-DoanhNghiep.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-DoanhNghiep.md)
- ⏳ **R7.7.4.5** 🆕 NHT functional 10 TC (CRUD + permission + workflow kích hoạt) `[need: R7.2.9 ✅ + R7.4.A2 ✅]`
- ⏳ **R7.7.4.6** 🆕 TC TV functional 10 TC (CRUD + permission + phê duyệt edge) `[need: R7.4.B1 ✅ — wait actually R7.2.3 ✅]`
- ⏳ **R7.7.5** 🔄 TVCS 44 TC `[need: R7.4.A5 ✅; UNBLOCKED]`
  - **R6:** 🚫 R6.7.5 — cascade A5 block (B3-B11 FK)
- ⏳ **R7.7.6** ✏️ Khóa học 40 TC + FR-III mới (B10/B11/B12 + Đề KT + Lịch học) `[need: R7.4.B7+B10+B11+B12 ✅]`
  - **R6:** 🚫 R6.7.6 — cascade B7/B2/B2.5 block spec contradiction
- ⏳ **R7.7.7** ✏️ Dashboard 34 TC (KPI-07 count đổi) `[need: R7.4 trụ A ✅]`
  - **R6:** ⏳ R6.7.7 — chờ A5
- 🟢 **R7.7.8** 🔄 QTHT 8 TC `[~0% — ready, re-test sample sau reset]`
  - **R6:** ✅ R6.7.8 — PASS 8/8 (QT-010/017/025-027/029-032). 0 bug. [functional-test-report-QTHT.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-QTHT.md)
- ⏳ **R7.7.9** ✏️ Đánh giá HQ 40 TC `[need: R7.4.D2 ✅; UNBLOCKED]`
  - **R6:** 🚫 R6.7.9 — cascade D2 block (5 bug FE)
- 🟢 **R7.7.10** 🔄 Biểu mẫu 7 TC `[~0% — ready, was R6.7.10 ⚠️ 71%]`
  - **R6:** ⚠️ R6.7.10 ~71% — 5/7 PASS (BM-013/032/034-036/039). BM-026 chờ thư mục rỗng. BUG-BM-001 Minor. [functional-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-BieuMau.md)
- ⏳ **R7.7.11** 🔄 TV nhanh 39 TC `[need: R7.6.2 ✅ + R7.4.D3 ✅]`
  - **R6:** ⏳ R6.7.11 — cascade D3 UI defer
- 🟢 **R7.7.12** 🔄 Chi trả 30 TC `[~0% — ready, was R6.7.12 🟢]`
  - **R6:** 🟢 R6.7.12 — 100 record sẵn, chưa run
- ⏳ **R7.7.13** 🔄 Báo cáo 38 TC `[need: ≥1 BC từ HD/VV/TVCS/CT/Đào tạo ready]`
  - **R6:** ⏳ R6.7.13 — chỉ HD ✅ + VV ✅ → 4-5/38 BC ready (12% scope)
- ⏳ **R7.7.14** 🔄 HĐ tư vấn (UC163 sub-resource v2.1) `[need: R7.4.A3 + R7.4.A1 ✅]`
  - **R6:** ⚠️ R6.7.14 ~55% — 5/9 PASS-WITH-NOTE. 4 bug Active. [workflow-test-report-HopDongTuVan.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HopDongTuVan.md)
  - **Bug R6:** [bug-report-flow-hop-dong.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-hop-dong.md) — 0/4 đóng (3 Major + 1 Medium)
- ⏳ **R7.7.15** 🔄 CT HTPLDN 42 TC `[need: R7.6.4 ✅]`
  - **R6:** ⏳ R6.7.15 — R6.6.4 unblock 1 phần, R6.6.5 vẫn chờ
- ⏳ **R7.7.16** 🔄 API 42 TC + 8 API inbound mock `[need: data upstream state cuối từ HD/VV/TVCS/Chi trả/CT/TVN]`
  - **R6:** ⏳ R6.7.16
- ⏳ **R7.7.17** 🔄 Edge BR-EC-01..23 (4 BR scope) `[need: infra/wait/integration cho 19 BR còn lại]`
  - **R6:** ⚠️ R6.7.17 ~17% — 4 PASS (BR-EC-12 + 3 gián tiếp), 19 chờ. 0 bug. [functional-test-report-Edge-BR-EC.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-Edge-BR-EC.md)

---

## Phase 8 — Cross-cutting + Profile + Permission

- 🟢 **R7.8.1** 🆕 Verify hard delete (DELETE → record không còn trong GET list) `[~0% — ready, item 9 dev list; mâu thuẫn SRS modal MD-XOA vẫn ghi xóa mềm]`
- 🟢 **R7.8.2** 🆕 Verify bỏ ClamAV (upload `.exe` → BE behavior, security regression risk) `[~0% — ready, item 10 dev list]`
- 🟢 **R7.8.3** 🆕 Verify bỏ lưu nháp scope hẹp (button [Lưu nháp] bỏ, state DU_THAO/NHAP/MOI_DANG_KY giữ) `[~0% — ready, scope HẸP verified từ SRS]`
- 🟢 **R7.8.4** 🆕 Profile + đổi MK self-service (ho-so-doi-mat-khau.md) `[~0% — ready, verify 3 mâu thuẫn FR-VIII-26]`
- 🟢 **R7.8.5** 🆕 Permission 49 entity × 11 role sample 40 TC/module `[~0% — ready, was R5 scope]`

---

## 🟥 Trụ E — Theo dõi unblock (xuyên suốt R7, không gate)

- 🟢 **R7.E1** 🔄 HĐ tư vấn (FR-X3-01) — sub-resource VV/TVV `[~0% — ready, verify URL 404 đúng spec v2.1]`
  - **R6:** ✅ R6.E1 — sub-resource trong VV/TVV detail. URL 404 đúng spec
- 🟢 **R7.E2** 🔄 CT HTPLDN GĐ1 (FR-15) — verify 3 CT data còn `[~0% — ready, verify CT-001/002/003 còn]`
  - **R6:** ✅ R6.E2 — 3 CT tồn tại sau R6.6.4 PASS 2026-05-05
- 🟢 **R7.E3** 🔄 Chi trả (FR-06) — verify 100 record HSCT còn `[~0% — ready, verify HSCT000001..100 còn]`
  - **R6:** ✅ R6.E3 — 100 record HSCT000001..100 sẵn (3 states), verified 2026-05-04
- ⏳ **R7.E4** 🔄 TV nhanh (FR-13.A) — ≥1 phiên tồn tại `[need: R7.6.2 + R7.6.3]`
  - **R6:** ⏳ R6.E4 — Menu render OK 2026-05-04 nhưng data=0

---

## 🔓 Open issues — defer log bug khi gặp behavior thực tế

- **Item 3 BA câu:** Migration record cũ `loai_tvv = 'NHT'` chuyển sang NGUOI_HO_TRO ra sao? `[trigger ở R7.4.A2 / R7.7.2]`
- **Item 6 BA câu:** Migration DN cũ tạo bằng CB NV → có cần convert TK-first không? `[trigger ở R7.7.4]`
- **Item 9 BA câu:** DN không email/chưa ĐKKD vào hệ thống bằng cách nào? `[trigger ở R7.2.4]`
- **Item 11 BA câu:** NGAY_LE seed danh sách 2026 — BA cấp file Excel chính thức? `[trigger ở R7.1.5]`

---

## Bug deploy gap (gửi dev — log riêng)

[bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-report-deploy-gap.md) — 8 bug Major/Medium chờ dev fix:

1. Entity NGUOI_HO_TRO BE 404 — block R7.2.7
2. Entity HOC_VIEN BE 404 — block R7.3.12
3. Sub-menu UI "Người hỗ trợ pháp lý" chưa thêm
4. Sub-menu UI "Tổ chức tư vấn" chưa thêm (BE có endpoint)
5. 4 sub-menu Đào tạo mới chưa thêm (Kế hoạch năm/Lịch học/Đề kiểm tra/Học viên)
6. Tab "Quản lý ngày lễ" trong Cấu hình HT chưa thêm
7. Filter "Địa bàn" TVV vẫn còn (SRS đã bỏ)
8. Tab SM-TVV "Chờ kích hoạt" chưa thêm
