# TODO — TC TV — Tổ chức tư vấn

> File module của [`todo.md`](todo.md) master. Tổng **4 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.2.2, R7.2.3, R7.4.A6, R7.7.4.6

---

## Tasks

- ✅ **R7.2.2** 🆕 Seed 6 Tổ chức tư vấn (API — grandfather trước rule UI-only 2026-05-07) <a id="r7-2-2"></a>
  - **Kết quả:** PASS 5/5 valid + 1 BVA-422 đúng kỳ vọng. TC-BTP-TW-0001..0005 MOI_DANG_KY. [seed-checklist-r7-2-2-tc-tv.md](../output/qa-reports/round7-2026-05-06/seed/to-chuc-tu-van/seed-checklist-r7-2-2-tc-tv.md)
  - **Bug:** [bug-report-seed-r7-2-2-tctv-lv-dropdown.md](../output/qa-reports/round7-2026-05-06/bug-reports/to-chuc-tu-van/bug-report-seed-r7-2-2-tctv-lv-dropdown.md) — 1/1 đóng (BUG-TCTV-FE-001 Closed-verified R8 2026-05-07)
  - **Note:** account `cb_nv_tw_02`. UI compliance cover bởi R7.4.A6 workflow walk.

- ✅ **R7.2.3** 🆕 Phê duyệt TC TV → HOAT_DONG (API — grandfather trước rule UI-only 2026-05-07) <a id="r7-2-3"></a>
  - **Kết quả:** PASS 5/5 → HOAT_DONG, soQdCongBo + ngayCongNhan set đầy đủ. [seed-checklist-r7-2-3-phe-duyet-tc-tv.md](../output/qa-reports/round7-2026-05-06/seed/to-chuc-tu-van/seed-checklist-r7-2-3-phe-duyet-tc-tv.md)
  - **Spec:** FR-IV-NEW-04 — `cb_pd_tw_02`. 5 transition còn lại + UI evidence → R7.4.A6.

- 🟢 **R7.4.A6** 🆕 Workflow SM-TCTV 8 transition `[need: cb_nv_tw_02 + cb_pd_tw_02 unlocked]` <a id="r7-4-a6"></a>
  - **Cần:** R7.2.2 ✅ · `cb_nv_tw_02` + `cb_pd_tw_02` unlocked
  - **Spec:** SM-TCTV (srs-fr-04 line 2323) + flow-module §2b (line 136-151).

- 🟢 **R7.7.4.6** 🆕 TC TV functional 10 TC `[need: R7.2.3]` <a id="r7-7-4-6"></a>
  - **Cần:** R7.2.3 ✅ · ≥1 TC TV `HOAT_DONG` (✓5)
  - **Spec:** CRUD + permission + phê duyệt edge case
