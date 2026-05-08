# TODO — TVV + Chuyên gia (CG)

> File module của [`todo.md`](todo.md) master. Tổng **6 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.2.5, R7.2.6, R7.4.A1, R7.4.A1-CG, R7.4.A2, R7.7.2

---

## Tasks

- ✅ **R7.2.5** ✏️ Seed 6 TVV TW (bỏ dia_ban_ids, MOI_DANG_KY) <a id="r7-2-5"></a>
  - **Kết quả:** PASS 6/6 TVV-BTP-TW-0009..0014 MOI_DANG_KY. Per-LV cover 5/5 (LD/Thuế/KDTM/SHTT/ĐĐ); DN/TM N/A do BUG-DM-LVPL-001. [seed-checklist-r7-2-5-tvv-tw.md](../output/qa-reports/round7-2026-05-06/seed/tu-van-vien-cg/seed-checklist-r7-2-5-tvv-tw.md)

- ✅ **R7.2.6** ✏️ Seed 6 CG TW (`loai_tvv=CG`, MOI_DANG_KY) <a id="r7-2-6"></a>
  - **Kết quả:** PASS 6/6 TVV-BTP-TW-0001..0006 cover 6 LV (DN/TM/LĐ/Thuế/SHTT/ĐĐ). [seed-checklist-r7-2-6-cg-tw.md](../output/qa-reports/round7-2026-05-06/seed/tu-van-vien-cg/seed-checklist-r7-2-6-cg-tw.md)
  - **Bug:** [bug-report-seed-r7-2-6-tvv-tochuc.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-seed-r7-2-6-tvv-tochuc.md) — 1/1 đóng (BUG-TVV-FE-002 Closed-verified R8 2026-05-07 — combobox query đúng entity TO_CHUC_TU_VAN, render 5 TC TV thật)

- ⚠️ **R7.4.A1** ✏️ Workflow TVV (SM 9→**10 state**, thêm CHO_KICH_HOAT, hệ thống tự cấp TK qua FR-VIII-15 step 6) `[~93% — 13/14 PASS, BUG-002 Open Major mail format]` <a id="r7-4-a1"></a>
  - **Cần:** R7.2.5 ✅ · R7.2.6 ✅
  - **Spec:** 7.4-chuyen-gia-tvv.md + 6.4-sm-tvv.md (sync 2026-05-06)
  - **Kết quả:** ⚠️ 13/14 PASS sau R8b — BUG-001/003/004 closed verify. BUG-002 mail format Open. [workflow-test-report-r7-4-a1.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1.md)
  - **Bug:** [bug-report-flow-r7-4-a1-tvv.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-vien-cg/bug-report-flow-r7-4-a1-tvv.md) — 3/4 đóng (1 Major Open: BUG-002 mail format)

- ⚠️ **R7.4.A1-CG** ✏️ Advance 8 CG → DANG_HOAT_DONG + 14 TC (BR-AUTH-05/08 + LEGAL-04 + opt-lock) `[~93% — 13/14 PASS, 1 DEVIATION state name]` <a id="r7-4-a1-cg"></a>
  - **Kết quả:** 13/14 PASS (TC-07+14 unblock 7/5 qua R7.7.8a+d), 1 ⚠️ DEVIATION state name spec v3.5. [workflow-test-report-r7-4-a1-cg.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1-cg.md)
  - **Bug:** [bug-report-flow-r7-4-a1-cg-state.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-flow-r7-4-a1-cg-state.md) — 0/1 đóng (BUG-CG-A1-001 Major Open: state DANG_HOAT_DONG vs CHO_KICH_HOAT spec). **Re-test R8 2026-05-07: VẪN OPEN** (lần 2 verify, BE chưa rename + chưa chèn CHO_KICH_HOAT).

- ⚠️ **R7.4.A2** 🆕 Tiếp nhận TVV — 3 transition (MOI_DANG_KY→CHO_THAM_DINH, YEU_CAU_BO_SUNG→DANG_THAM_DINH, TU_CHOI→CHO_THAM_DINH) `[~33% — 1/3 PASS, 2 chờ portal ứng viên]` <a id="r7-4-a2"></a>
  - **Kết quả:** 1/3 ✅ + 2/3 🚫 — A2.1 đúng spec, A2.2+A2.3 chờ portal ứng viên (BUG-CG-A1-003). [workflow-test-report-r7-4-a2.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-vien-cg/workflow-test-report-r7-4-a2.md)

- ❌ **R7.7.2** ✏️ CG/TVV 31 TC (enum loai_tvv đổi) <a id="r7-7-2"></a>
  - **Kết quả:** 19✅ · 7❌ · 1⚠️ · 6🚫 · 0⏰ — pass 3+4 retry, 022 ❌ cả 2 nhánh (BE 500 sai contract). [functional-test-report-r7-7-2-tvv-cg.md](../output/qa-reports/round7-2026-05-06/functional/tu-van-vien-cg/functional-test-report-r7-7-2-tvv-cg.md)
  - **Bug:** [bug-report-functional-r7-7-2-tvv.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-functional-r7-7-2-tvv.md) + [bug-report-functional-r7-7-2-tvv-retry.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-vien-cg/bug-report-functional-r7-7-2-tvv-retry.md) — 0/6 đóng (5 Major + 1 Minor Open).
