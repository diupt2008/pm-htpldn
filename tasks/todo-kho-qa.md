# TODO — Kho QA

> File module của [`todo.md`](todo.md) master. Tổng **3 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.16, R7.4.D3, R7.4.D3.AUTO

---

## Tasks

- ✅ **R7.3.16** 🆕 Seed Kho QA entry CHO_DUYET cover 5 LV × 2 nguồn (THU_CONG + IMPORT) qua UI Modal SCR-X2-01 <a id="r7-3-16"></a>
  - **Kết quả:** PASS 9/9 record CHO_DUYET. THU_CONG 8/8 (6 LV), IMPORT 1 (Hành chính). cb_nv_tw_02. [r7-3-16-cho-duyet-9.png](../output/qa-reports/round7-2026-05-06/seed/kho-qa/r7-3-16-cho-duyet-9.png)
  - **Bug:** [bug-report-flow-kho-qa.md](../output/qa-reports/round7-2026-05-06/bug-reports/kho-qa/bug-report-flow-kho-qa.md) — 1/1 đóng (BUG-KHOQA-001 UI Critical Closed-verified R7 2026-05-07)

- ⚠️ **R7.4.D3** ✏️ Workflow Kho QA SM-KHOCAUHOI 8 transitions (duyệt đơn lẻ + bulk + từ chối + toggle hiệu lực) `[~88% — 7/8 transition, T8 FE bug]` <a id="r7-4-d3"></a>
  - **Cần:** R7.3.16 ✅ · ≥3 Kho QA `CHO_DUYET` (✓9) · account `cb_pd_tw_02` cùng cấp
  - **Spec:** SM-KHOCAUHOI — `02-thu-tu-module.md` line 777-789
  - **Kết quả:** PARTIAL 7/8 transition. T1/T2/T4/T5/T6/T7 PASS. T8 🚫 FE bug. [workflow-test-report-flow-kho-qa.md](../output/qa-reports/round7-2026-05-06/workflow/kho-qa/workflow-test-report-flow-kho-qa.md)
  - **Bug:** [bug-report-flow-kho-qa.md](../output/qa-reports/round7-2026-05-06/bug-reports/kho-qa/bug-report-flow-kho-qa.md) — 1 Open BUG-KHOQA-002 Major (FE thiếu button Kích hoạt)

- ⏳ **R7.4.D3.AUTO** 🆕 Verify auto-feed Kho QA nguồn TU_DONG (BR-FLOW-10) — HD DA_DUYET → tạo record Kho QA TU_DONG `[need: ≥1 HD DA_DUYET]` <a id="r7-4-d3-auto"></a>
  - **Cần:** ≥1 HD `DA_DUYET` (✗ 0/7 — distribution chỉ MOI/DA_PHAN_CONG/HUY)
  - **Spec:** FR-X.2-01 step 2 — BR-FLOW-10
