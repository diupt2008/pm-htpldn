# TODO — Chi trả

> File module của [`todo.md`](todo.md) master. Tổng **7 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.6.1, R7.7.12, R7.7.12.1, R7.7.12.2, R7.7.12.3, R7.7.12.4, R7.E3

---

## Tasks

- 🚫 **R7.6.1** ✏️ Workflow Chi trả v3.5 — 12 bước, SM 10 state `[block: thiếu LGSP integration]` <a id="r7-6-1"></a>
  - **Cần:** BE inject API hoặc seed CHO_TIEP_NHAN · ≥1 VV `HOAN_THANH` (R7.4.A3 🟢) · DN 3 quy mô (R7.2.4 ✅)
  - **Output:** workflow-test-report-ChiTra-v3.5.md

- 🟢 **R7.7.12** ✏️ Chi trả v3.5 — 35 TC (30 base + 5 mới) `[~80% — 28 TC ready, CT-006/021 chờ BA Q1+Q2]` <a id="r7-7-12"></a>
  - **Cần:** R7.7.12.1 ✅ · R7.E3 ⚠️ · R7.6.1 🚫 cho TC workflow
  - **Output:** functional-test-report-ChiTra-v3.5.md

- ✅ **R7.7.12.1** 🆕 Smoke regression IMPACT — FR-07/08/11/13 × 5 phút <a id="r7-7-12-1"></a>
  - **Kết quả:** PASS 4/4 module render OK, 0 console error, ⚠️ DN count 23 vs 36 (R7.2.4) cần investigate. [smoke-test-report-r7-7-12-1-fr06-impact.md](../output/qa-reports/round7-2026-05-06/functional/chi-tra/smoke-test-report-r7-7-12-1-fr06-impact.md)

- 🚫 **R7.7.12.2** 🆕 FR-V.II-14 DN bổ sung HS `[block: thiếu HSCT YEU_CAU_BO_SUNG — chờ R7.6.1]` <a id="r7-7-12-2"></a>
  - **Cần:** R7.6.1 🚫 tới state YEU_CAU_BO_SUNG · file mock 5 định dạng
  - **Output:** functional-test-report-fr-v.ii-14-2026-05-06.md

- 🚫 **R7.7.12.3** 🆕 CB PD trả về DANG_THAM_DINH + PHE_DUYET_CHI_TRA N:1 `[block: thiếu HSCT CHO_PHE_DUYET — chờ R7.6.1]` <a id="r7-7-12-3"></a>
  - **Cần:** R7.6.1 🚫 tới state CHO_PHE_DUYET · 2 CB PD cùng cấp
  - **Output:** functional-test-report-fr-v.ii-12-cbpd-tra-ve-2026-05-06.md

- ✅ **R7.7.12.4** 🆕 UI tiếng Việt thuần SCR-V.II-01/02 <a id="r7-7-12-4"></a>
  - **Kết quả:** PASS 2/2 — 0 enum code, 0 English leak, 0 null/undefined, 7 status badge dịch tiếng Việt. [functional-test-report-r7-7-12-4-ui-vn-thuan.md](../output/qa-reports/round7-2026-05-06/functional/chi-tra/functional-test-report-r7-7-12-4-ui-vn-thuan.md)

- ⚠️ **R7.E3** 🔄 Chi trả (FR-06) — verify 100 record HSCT còn `[~78% — 78/100, REGRESSION thiếu 22 HSCT]` <a id="r7-e3"></a>
  - **Kết quả:** ⚠️ PARTIAL 78/100 — REGRESSION thiếu 22 HSCT (079..100). 78 còn cover 11 trạng thái SM-CHI-TRA. [verify-checklist-r7-e3-chi-tra-100-hsct.md](../output/qa-reports/round7-2026-05-06/seed/chi-tra/verify-checklist-r7-e3-chi-tra-100-hsct.md)
