# TODO — TVCS — Tư vấn chuyên sâu

> File module của [`todo.md`](todo.md) master. Tổng **3 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.3, R7.4.A5, R7.7.5

---

## Tasks

- ✅ **R7.3.3** ✏️ Seed 10 TVCS entry TIEP_NHAN cover 6 LV (endpoint thực `/api/v1/noi-dung-tu-van-cs`) <a id="r7-3-3"></a>
  - **Kết quả:** PASS 10/10 TVCS-20260506-0001..0010. 5/10 fail VIDEO_CALL → retry HO_SO. [seed-checklist-r7-3-3-tvcs.md](../output/qa-reports/round7-2026-05-06/seed/tu-van-chuyen-sau/seed-checklist-r7-3-3-tvcs.md)
  - **Bug:** [bug-report-seed-r7-3-3-tvcs-video-call.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-seed-r7-3-3-tvcs-video-call.md) — 1/1 đóng FE (BUG-TVCS-VIDEO-CALL-001 Closed-verified R8 2026-05-07 — form bỏ field hinhThucTv, FE không gửi orphan)

- ⚠️ **R7.4.A5** ✏️ Workflow TVCS 11 bước (dropdown CG enum đổi) `[~27% — 3/11 PASS, 5 BLOCKED BE 403]` <a id="r7-4-a5"></a>
  - **Kết quả:** ⚠️ 3/11 PASS (B1 re-seed + B2 6/6 LV + B10). 5 BLOCKED do BE bug `/xac-nhan` 403 (2-CG). [workflow-test-report-r7-4-a5-tvcs.md](../output/qa-reports/round7-2026-05-06/workflow/tu-van-chuyen-sau/workflow-test-report-r7-4-a5-tvcs.md)
  - **Bug:** [bug-report-r7-4-a5-tvcs-cg-action-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-r7-4-a5-tvcs-cg-action-block.md) — 0/2 đóng (TVCS-A5-001 Critical + TVCS-A5-002 Major Open). Pool R7.3.3 mất giữa R7→R8 — đã re-seed inline 10 record TVCS-20260507-*.

- ⚠️ **R7.7.5** 🔄 TVCS functional 61 TC v3.5 `[~51% — 31/61 PASS, 14 BLOCKED + 12 SKIP + 4 FAIL]` <a id="r7-7-5"></a>
  - **Kết quả:** ⚠️ 31/61 PASS · 14 BLOCKED · 12 SKIP · 4 FAIL. +7 TC mới (TV-017..020/056 ✅ + TV-053 ⚠️ + TV-054 ❌). [functional-test-report-r7-7-5-tvcs.md](../output/qa-reports/round7-2026-05-06/functional/tu-van-chuyen-sau/functional-test-report-r7-7-5-tvcs.md)
  - **Bug:** [bug-report-r7-7-5-tvcs.md](../output/qa-reports/round7-2026-05-06/bug-reports/tu-van-chuyen-sau/bug-report-r7-7-5-tvcs.md) — 0/10 đóng. 3 TVCS legacy (FN-001/002/003) + 7 HSPL mới (HSPL-001..007 cover NHT permission overgrant runtime DELETE 204, BR-AUTH-10 missing layer, Detail 500, list inconsistent, keyword ignored, unaccent, POST 500 regression).
