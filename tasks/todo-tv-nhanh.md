# TODO — TV nhanh

> File module của [`todo.md`](todo.md) master. Tổng **4 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.6.2, R7.6.3, R7.7.11, R7.E4

---

## Tasks

- ⚠️ **R7.6.2** 🔄 Workflow TV nhanh (5 trạng thái) — sau dev seed 50 phiên `[~80% — 4/5 PASS, B5 PARTIAL]` <a id="r7-6-2"></a>
  - **Kết quả:** ⚠️ PASS 4/5 + 1 PARTIAL B5. R9 unblock dev seed: B1/B2/B3/B4 PASS UI+API, B5 mTLS DN-only (pool 12 HOAN_THANH có sẵn). [workflow-test-report-r7-6-2-tv-nhanh.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-nhanh/workflow-test-report-r7-6-2-tv-nhanh.md)
  - **Bug:** [bug-report-r7-6-2-tvn-create-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-nhanh/bug-report-r7-6-2-tvn-create-block.md) — 0/2 đóng. R9 re-classify: BUG-001 Critical→Major + P0→P1 (workaround dev seed); BUG-002 giữ Major P1 (vẫn chặn TVN-038 verify diem_danh_gia_tb).

- ⏳ **R7.6.3** 🔄 Workflow TV nhanh PUBLIC (DN qua Cổng PLQG) `[need: phiên TVN cong_khai + Cổng PLQG endpoint]` <a id="r7-6-3"></a>
  - **Cần:** ≥1 phiên TVN `cong_khai=1` (✗ chưa verify) · Cổng PLQG endpoint deploy

- ⚠️ **R7.7.11** 🔄 TV nhanh 44 TC v3.5 (R8 Kho Q&A + R9 phiên TV nhanh) `[~63% — 12/19 PASS, 6 BLOCKED + 25 chờ]` <a id="r7-7-11"></a>
  - **Kết quả:** PASS 12/19 (63%) — 12 PASS + 5 PARTIAL + 6 BLOCKED + 25 chờ. R9 +5 TC sau dev seed 50 phiên. [functional-r7-7-11](../output/qa-reports/round7-2026-05-06/functional/tu-van-nhanh/functional-test-report-r7-7-11-tvn.md)
  - **Bug:** [bug-report-r7-7-11-tvn.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-nhanh/bug-report-r7-7-11-tvn.md) — 0/5 đóng (TVN-001 Critical authz · 002 Major FR-X.2-06 · 003 Minor filter · **TVN-004 Major gợi ý không render R9 · TVN-005 Minor audit naming R9**)

- ✅ **R7.E4** 🔄 TV nhanh (FR-13.A) — ≥1 phiên tồn tại <a id="r7-e4"></a>
  - **Kết quả:** PASS 50 phiên cover 6 state SM-TVNHANH + 2 enum kênh (TV_NHANH/TV_THU_CONG). [verify-checklist-r7-e4-tv-nhanh.md](../output/qa-reports/round7-2026-05-06/seed/verify-checklist-r7-e4-tv-nhanh.md)
