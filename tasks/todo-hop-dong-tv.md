# TODO — HĐ TV — Hợp đồng tư vấn

> File module của [`todo.md`](todo.md) master. Tổng **3 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.14, R7.7.14, R7.E1

---

## Tasks

- ⏳ **R7.3.14** 🆕 Seed 6 Hợp đồng TV entry DANG_THUC_HIEN cover 6 LV `[need: R7.4.A1, R7.4.A3]` <a id="r7-3-14"></a>
  - **Cần:** R7.4.A1 ⚠️ (TVV active) · R7.4.A3 (≥1 VV `HOAN_THANH`)
  - **Note:** unblock R7.7.14 functional

- ⏳ **R7.7.14** 🔄 HĐ tư vấn (UC163 sub-resource v2.1) `[need: R7.3.14, R7.4.A3]` <a id="r7-7-14"></a>
  - **Cần:** ≥1 HĐ TV `DANG_THUC_HIEN` (✗0) · ≥1 VV `HOAN_THANH` (✗0)

- ✅ **R7.E1** 🔄 HĐ tư vấn (FR-X3-01) — sub-resource VV/TVV <a id="r7-e1"></a>
  - **Kết quả:** PASS 6/6 — 4 FE route + 2 API endpoint trả 404, sidebar không có menu HĐ TV độc lập. Match spec v2.1. [verify-checklist-r7-e1-hdtv-url.md](../output/qa-reports/round7-2026-05-06/seed/hop-dong-tv/verify-checklist-r7-e1-hdtv-url.md)
