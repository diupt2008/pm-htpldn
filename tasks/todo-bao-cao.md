# TODO — Báo cáo

> File module của [`todo.md`](todo.md) master. Tổng **2 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream

> **Task IDs:** R7.5.4, R7.7.13

---

## Tasks

- ❌ **R7.5.4** 🔄 BC04 export Excel có data <a id="r7-5-4"></a>
  - **Cần:** BC HD ✅ data có; BC04 VV BLOCKED chờ R7.4.A3 🟢 seed VV HOAN_THANH
  - **Kết quả:** ❌ FAIL — header xlsx mime đã fix, body vẫn JSON wrap StreamableFile (1910 bytes xlsx kẹt trong JSON). [verification-test-report-r7-5-4-bc-export.md](../output/qa-reports/round7-2026-05-06/workflow/bao-cao/verification-test-report-r7-5-4-bc-export.md)
  - **Bug:** [bug-report-r7-5-4-bc-export.md](../output/qa-reports/round7-2026-05-06/bug-reports/bao-cao/bug-report-r7-5-4-bc-export.md) — 0/2 đóng (BUG-BC-EXPORT-001 Critical + BUG-BC-LEGEND-001 Minor still Open từ R6)

- 🟢 **R7.7.13** 🔄 Báo cáo 38 TC `[~80% — defer BC ĐT do thiếu seed]` <a id="r7-7-13"></a>
  - **Cần:** ≥1 TVCS (✓12) · ≥1 CT (✓3) · ≥1 HD (✓7) · BC04/05/HD ready · ĐT (✗0) defer
