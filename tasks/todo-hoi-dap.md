# TODO — Hỏi đáp

> File module của [`todo.md`](todo.md) master. Tổng **5 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.1, R7.3.1.MoB, R7.3.1.TVN, R7.4.A4, R7.7.1

---

## Tasks

- ✅ **R7.3.1** 🔄 Seed 6 Hỏi đáp entry MOI cover 6 LV × 4 kênh <a id="r7-3-1"></a>
  - **Kết quả:** PASS 6/6 cover 6 LV × 4 kênh. [seed-checklist-r7-3-1-hd.md](../output/qa-reports/round7-2026-05-06/seed/hoi-dap/seed-checklist-r7-3-1-hd.md)

- ✅ **R7.3.1.MoB** 🆕 Seed Mẫu Mô hình B qua UI Tab Mẫu phản hồi 3 cấp (FR-II-NEW-02) <a id="r7-3-1-mob"></a>
  - **Kết quả:** PASS 3/3 — TW (Lao động) + BN-BTC (Thuế) + DP-BG (SHTT) auto cấp đúng. [r7-3-1-mob-dp-list.png](../output/qa-reports/round7-2026-05-06/seed/hoi-dap/r7-3-1-mob-dp-list.png)
  - **Bug:** [bug-report-seed-r7-3-1-mob-mph.md](../output/qa-reports/round7-2026-05-06/bug-reports/hoi-dap/bug-report-seed-r7-3-1-mob-mph.md) — 1/1 đóng (BUG-MPH-DISP-01 Closed-verified R8 2026-05-07 — list MPH có cột Phạm vi+Tác giả đúng SRS)

- 🟢 **R7.3.1.TVN** 🆕 Seed phiên TV nhanh ESCALATE → HD `kenh=TVN_BRIDGE` qua UI FR-13 `[need: R7.6.2]` <a id="r7-3-1-tvn"></a>
  - **Cần:** R7.6.2 ⚠️ (walk UI FR-13 ESCALATE, không POST API)

- 🚫 **R7.4.A4** ✏️ Workflow Hỏi đáp 11 paths v3.5 `[block: BUG-HD-A4-001/002/003 chưa đóng]` <a id="r7-4-a4"></a>
  - **Cần:** BUG-HD-A4-001/002/003 đóng · ≥1 TC TV `HOAT_DONG` (✓5) · ≥3 HD `MOI` (✓2) hoặc `DA_PHAN_CONG` (✓3)
  - **Spec:** srs-fr-02-hoi-dap.md v3.5 FR-II-04/05/06
  - **Kết quả:** 🚫 2/11 PASS (TP-HD-03 + TP-HD-08 PARTIAL). 8 BLOCKED do BUG-HD-A4-001 state DA_PHAN_CONG missing transition + 1 SKIP TP-HD-09. [workflow-test-report-r7-4-a4-hoi-dap.md](../output/qa-reports/round7-2026-05-06/workflow/hoi-dap/workflow-test-report-r7-4-a4-hoi-dap.md)
  - **Bug:** [bug-report-r7-4-a4-hd-workflow-block.md](../output/qa-reports/round7-2026-05-06/bug-reports/hoi-dap/bug-report-r7-4-a4-hd-workflow-block.md) — 0/3 đóng (HD-A4-001 Critical state DA_PHAN_CONG transition · 002 Major CauHinhPhanCong DEPRECATED · 003 Major TC TV không persist)

- 🚫 **R7.7.1** ✏️ Hỏi đáp 60 TC v3.5 (35 base updated + 25 mới HD-040..064) `[block: BUG-HD-001/002/A4-001 + thiếu test files]` <a id="r7-7-1"></a>
  - **Cần:** Fix BUG-HD-001 (FR-II-04) · Fix BUG-HD-002 (Tab Đang xử lý filter) · BUG-HD-A4-001 đóng · ≥3 HD `DANG_XU_LY` (✗0) · test files 5MB ảnh + 19/21MB PDF
  - **Kết quả:** BLOCK do BUG-HD-001 (Critical workflow) chặn state DANG_XU_LY+ → ~30+ TC unreachable. Test files (5MB ảnh + 19/21MB PDF) chưa có.
