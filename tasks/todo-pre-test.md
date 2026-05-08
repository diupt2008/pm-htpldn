# TODO — Pre-test (Phase 0)

> File module của [`todo.md`](todo.md) master. Tổng **7 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.0.1, R7.0.2, R7.0.3, R7.0.4, R7.0.5, R7.0.6, R7.0.7

---

## Tasks

- ✅ **R7.0.1** Verify deploy + scenario reset DB <a id="r7-0-1"></a>
  - **Kết quả:** Scenario MIX — partial reset (DN 30 mới, TVV/CG/KH=0, VV=70) + 10/18 deploy OK + 8 gap. [plan-r7-trigger.md](plan-r7-trigger.md)

- ✅ **R7.0.2** 🆕 Log + gửi dev bug deploy gap <a id="r7-0-2"></a>
  - **Kết quả:** Log 6 bug + 2 false-pos drop. Re-test 2026-05-07/08 đóng hết.
  - **Bug:** [bug-report-audit-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-reports/deploy-gap/bug-report-audit-deploy-gap.md) — 6/6 đóng (3M + 2Me + 1Mi Closed-verified)

- ✅ **R7.0.3** 🆕 Bump fixture v2.7.0 → v2.7.1 <a id="r7-0-3"></a>
  - **Kết quả:** v2.7.1 header note strip `dia_ban_ids` + `loai_tvv:NHT` khỏi payload khi seed. [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)

- ✅ **R7.0.4** 🔄 Verify users.csv accounts còn login <a id="r7-0-4"></a>
  - **Kết quả:** PASS 10/10 sample (QTHT/CB_NV_TW/CB_PD_TW/CB_NV_DP/CB_NV_BN/NHT×3/CG/TVV). [seed-checklist-login.md](../output/qa-reports/round7-2026-05-06/seed/qtht-tai-khoan/seed-checklist-login.md)
  - **Note:** cg_tw_01..06 không có trong CSV → sub `cg_01`

- ✅ **R7.0.5** 🔄 Verify SCR-VIII-02 button [Thêm mới] visible <a id="r7-0-5"></a>
  - **Kết quả:** PASS — button uid 33_27 visible, 34 TK list. [seed-checklist-scr-viii-02-button.md](../output/qa-reports/round7-2026-05-06/seed/qtht-vai-tro/seed-checklist-scr-viii-02-button.md)

- ✅ **R7.0.6** 🆕 Pre-test UI surface audit per SRS update <a id="r7-0-6"></a>
  - **Kết quả:** PASS 18 + 2 false-pos drop. [ui-surface-audit.md](../output/qa-reports/round7-2026-05-06/seed/cross-module/ui-surface-audit.md)
  - **Bug:** [bug-report-audit-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/doanh-nghiep/bug-report-audit-r7-0-6-fr-07-buttons.md) — 2/2 đóng (FR07-UI-001/002 Major Closed)

- ✅ **R7.0.7** 🆕 Deep review SRS FR-10 v3.5 + log inconsistency <a id="r7-0-7"></a>
  - **Kết quả:** 11 SRS bug (3 Major BLOCK + 8 Minor doc) + 10 câu BA. Sync 9 file QA spec.
  - **Bug:** [bug-report-srs-fr10-inconsistency.md](../output/BA-report/bug-report-srs-fr10-inconsistency.md) — 0/11 đóng (3 Major: BUG-SRS-FR10-001 NGAY_LE schema / 002 TINH_THANH UI / 003 CHO_PHAN_QUYEN scenario; 8 Minor doc)
  - **Output:** [6.10-sm-taikhoan.md](../output/smoke/6.10-sm-taikhoan.md) · [7.10-quan-tri-he-thong.md](../output/funtion/7.10-quan-tri-he-thong.md) · [6.10-smoke-taikhoan.md](../output/smoke-specs/6.10-smoke-taikhoan.md) · [02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · [test-strategy.md](../output/test-strategy.md) · [permission-matrix-by-fr.md](../output/permission-matrix-by-fr.md) · [permission-matrix-by-role.md](../output/permission-matrix-by-role.md) · [7.7-quan-ly-doanh-nghiep.md](../output/funtion/7.7-quan-ly-doanh-nghiep.md)
