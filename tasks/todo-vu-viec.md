# TODO — Vụ việc

> File module của [`todo.md`](todo.md) master. Tổng **6 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.2, R7.4.A3, R7.4.A3-PUBLIC, R7.4.A3-DN-BS, R7.7.3, R7.7.3-PRIVACY

---

## Tasks

- ✅ **R7.3.2** 🔄 Seed 6 VV entry DA_TIEP_NHAN cover 6 LV <a id="r7-3-2"></a>
  - **Kết quả:** PASS 16/16 (10 cũ + 6 mới VV-BTP-TW-20260506-001..006). [seed-checklist-r7-3-2-vv.md](../output/qa-reports/round7-2026-05-06/seed/vu-viec/seed-checklist-r7-3-2-vv.md)

- 🟢 **R7.4.A3** ✏️ Workflow VV — refactor v3.5 `[need: full 100%]` <a id="r7-4-a3"></a>
  - **Cần:** ≥3 NHT `HOAT_DONG` (✓3) · ≥1 TC TV `HOAT_DONG` (✓5)
  - **Spec:** FR-05 v3.5 — `7.5-vu-viec-htpl.md` v3.0 (bỏ `nguoi_ho_tro_id`, thay 3 cột phân công + SLA 15 ngày, CB PD từ chối → DANG_XU_LY)

- ⏳ **R7.4.A3-PUBLIC** 🆕 Workflow Công khai VV lên Cổng PLQG `[need: R7.4.A3]` <a id="r7-4-a3-public"></a>
  - **Cần:** R7.4.A3 🟢 (cần xong) · ≥1 VV `DA_DUYET` hoặc `HOAN_THANH` (✗0) · account `cb_pd_<cap>_02` cùng cấp CB NV xử lý VV
  - **Spec:** FR-V.I-NEW-05 — 2 self-loop SM trên DA_DUYET + HOAN_THANH (BR-AUTH-05)

- ⏳ **R7.4.A3-DN-BS** 🆕 Workflow DN bổ sung HS qua chuyên trang VNeID `[need: R7.4.A3]` <a id="r7-4-a3-dn-bs"></a>
  - **Cần:** R7.4.A3 🟢 (cần xong) · ≥1 VV `YEU_CAU_BO_SUNG` (✗0) · DN VNeID Tier 2 sandbox · account `dn_<X>_02` đã VNeID T2
  - **Spec:** FR-V.I-NEW-02 — formal hoá `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (form embedded VNeID)

- ⏳ **R7.7.3** ✏️ Vụ việc 72 TC v3.5 (33 base + 42 mới Cluster 1-8) `[need: R7.4.A3, R7.4.A3-PUBLIC, R7.4.A3-DN-BS]` <a id="r7-7-3"></a>
  - **Cần:** R7.3.2 ✅ · R7.4.A3 🟢 · R7.4.A3-PUBLIC ⏳ · R7.4.A3-DN-BS ⏳ · ≥1 VV mỗi state lifecycle (✗ thiếu PHAN_HOI/HOAN_THANH/HUY — mới có DA_TIEP_NHAN:3 + DA_PHAN_CONG:2) · DN VNeID Tier 2 · CB PD cùng cấp
  - **Spec:** `7.5-vu-viec-htpl.md` v3.0 (sync 2026-05-06)

- ⏳ **R7.7.3-PRIVACY** 🆕 2 TC P0 Critical privacy NĐ 13/2023 `[need: R7.4.A3-PUBLIC, R7.2.4, R7.4.A3]` <a id="r7-7-3-privacy"></a>
  - **Cần:** R7.4.A3-PUBLIC ⏳ ≥1 VV `cong_khai=1` · R7.2.4 ≥1 DN test với VV · R7.4.A3 ≥1 VV scope đa DN
  - **Note:** verify riêng đầu tiên, escalate ngay nếu FAIL
