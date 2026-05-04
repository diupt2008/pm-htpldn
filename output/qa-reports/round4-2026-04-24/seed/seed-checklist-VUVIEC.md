# Seed Checklist — VU_VIEC Tier 2 (T2.A2)

**Phase:** P2 Block A Ngày 1 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P2 T2.A2 • **Date:** 2026-04-24 15:44-16:04 (resume 15:57-16:04)
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — `[+ Nhập thủ công]` SCR-V.I-02
**Entry state:** `DA_TIEP_NHAN` / hiển thị "Đã tiếp nhận"
**Input:** [seed-fixture.yaml > vu_viec_variants[1..6]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: ✅ **PASS 6/6 seeded** (2 session: 3/6 @ 15:44-15:50, 3/6 resume @ 15:57-16:04)

6/6 VV seeded PASS. VV CREATE endpoint `/api/v1/vu-viecs` healthy across both sessions. Cascade M3 VU_VIEC UN-DEFERRED — downstream T3.3 SM-VUVIEC + T4.3 Functional VV + P5 cross-module DN↔VV/TVV↔VV/VV↔CHITRA đủ sample ID đầy đủ 6 variants.

### Seed matrix

| # | Variant | DN link | Lĩnh vực (input → UI stored) | Loại hình | Kênh | Status | Mã VV / UUID | Deadline |
|---|---------|---------|------------------------------|-----------|------|--------|--------------|----------|
| 1 | Tư vấn soạn thảo HĐ lao động mẫu | DN-HNI-0001 Alpha | LAO_DONG → Lao động | Tư vấn pháp luật | Trực tiếp | ✅ PASS | **VV-BTP-TW-20260424-001** / 3eac5c09-2b7f-407c-b0f3-40fa385b16ce | 08/05/2026 |
| 2 | Tư vấn hoàn thuế GTGT quý IV/2025 | DN-HNI-0002 Beta | THUE → Thuế | Tư vấn pháp luật | Điện thoại | ✅ PASS | **VV-BTP-TW-20260424-002** / a0b988e7-352c-4189-89ee-7ab1f2ab7d55 | 08/05/2026 |
| 3 | Review và sửa đổi HĐ hợp tác chiến lược | DN-HPG-0001 Gamma | HOP_DONG → **fallback Kinh doanh thương mại** (DM không có HOP_DONG) | Tư vấn pháp luật | Trực tiếp | ✅ PASS | **VV-BTP-TW-20260424-003** / 9554b8a6-48e0-4dea-b480-90b16257e269 | 08/05/2026 |
| 4 | Tư vấn đăng ký NH quốc tế Madrid | DN-HPG-0002 Delta | SHTT → Sở hữu trí tuệ | Tư vấn pháp luật | Điện thoại | ✅ PASS | **VV-BTP-TW-20260424-004** / f106270e-92e6-4426-9e6d-a9e24d8712be | 08/05/2026 |
| 5 | Tư vấn thuê đất KCN 2000m2 | DN-DNG-0001 Epsilon | DAT_DAI → Đất đai | Tư vấn pháp luật | Trực tiếp | ✅ PASS | **VV-BTP-TW-20260424-005** / 001bf602-3f74-4fdb-803c-ef4f5860f53a | 08/05/2026 |
| 6 | Tư vấn bổ sung ngành dạy học trực tuyến | DN-DNG-0002 Zeta | DOANH_NGHIEP → **fallback Kinh doanh thương mại** (DM không có DOANH_NGHIEP) | Tư vấn pháp luật | Trực tiếp | ✅ PASS | **VV-BTP-TW-20260424-006** / 99b06ceb-1aca-4209-805e-0c34ea79c1ba | 08/05/2026 |

Evidence: [screenshots/vv-seed-complete-6-of-6.png](../screenshots/vv-seed-complete-6-of-6.png) — list view "1-6 / 6 mục" đầy đủ 6 record, trạng thái "Đã tiếp nhận", deadline T+10 ngày LV đồng nhất 08/05/2026. Partial intermediate: [screenshots/vv-seed-partial-3-of-6.png](../screenshots/vv-seed-partial-3-of-6.png).

---

## Form quan sát (out-of-SRS — track, không log)

| # | Observation | Chi tiết |
|---|-------------|----------|
| obs-vv-001 | Form yêu cầu field "Tiêu đề vụ việc" (required) — SRS FR-V.I-01 không enumerate field này | Fixture không có `tieu_de`, QA fabricate từ rút gọn `noi_dung_yeu_cau`. Tương tự pattern HOI_DAP obs trong memory `qa_htpldn_hoidap_cr_round1`. BA cần confirm |
| obs-vv-002 | Form yêu cầu "Loại hình hỗ trợ" (required) với 6 enum: Tư vấn pháp luật / Tham gia tố tụng / Đại diện ngoài tố tụng / Hòa giải / Đào tạo/bồi dưỡng / Trợ giúp khác — SRS FR-V.I-01 Inputs không có | Fixture không có `loai_hinh`, QA mặc định chọn "Tư vấn pháp luật" cho cả 6 variants. BA confirm enum + mapping |
| obs-vv-003 | Kênh tiếp nhận VV chỉ 3 enum: Trực tiếp / Điện thoại / Bưu chính — khác HOI_DAP (DVC/CONG_PLQG/TRUC_TIEP/HE_THONG_KHAC) | Per SRS FR-V.I-01 Inputs row `kenh_tiep_nhan` có thể enum riêng. Confirm BA nếu fixture enum value chuẩn hoá theo HOI_DAP vs VV |
| obs-vv-004 | DM `LINH_VUC_PL` thiếu code `HOP_DONG` + `DOANH_NGHIEP` → VV3 + VV6 phải fallback "Kinh doanh thương mại" | Same obs-001 T1.B1 memory. BA confirm bổ sung DM hoặc update fixture |
| obs-vv-005 | Deadline auto-tính đúng +10 ngày LV (24/04 → 08/05) + priority default "Trung bình" + "Ưu tiên" không có trong form input (auto default) | Positive — verify BR-CALC-04 SLA VV mặc định 10 ngày LV |

---

## Resume log (session 2 @ 2026-04-24 15:57-16:04)

1. ✅ Login `cb_nv_tw_01` / `Secret@123` + OTP `666666` → dashboard KPI "Vụ việc tiếp nhận: 3" xác nhận seed session 1 persist.
2. ✅ Navigate Quản lý vụ việc → list 3/3 mục hiện đủ → `[+ Nhập thủ công]` × 3.
3. ✅ VV4 DN-HPG-0002 Delta / Sở hữu trí tuệ / Điện thoại → VV-BTP-TW-20260424-004.
4. ✅ VV5 DN-DNG-0001 Epsilon / Đất đai / Trực tiếp → VV-BTP-TW-20260424-005.
5. ✅ VV6 DN-DNG-0002 Zeta / Kinh doanh thương mại (fallback) / Trực tiếp → VV-BTP-TW-20260424-006.
6. ✅ Verify list "1-6 / 6 mục" → screenshot evidence lưu `screenshots/vv-seed-complete-6-of-6.png`.

Deadline cả 3 VV mới = 08/05/2026 → BR-CALC-04 T+10 LV nhất quán với session 1.

---

## T2.A2 Gate Decision

**Status:** ✅ **PASS 6/6 — complete**

**Todo status:** `[x]` done clean.

**Cascade impact unblocked:**
- T3.3 SM-VUVIEC workflow walkthrough — đủ 6 sample cho happy + YEU_CAU_BS x3 → TU_CHOI + immutability branches.
- P4 T4.3 Functional VUVIEC 35 TC — đủ variants cho negative/alternative/edge (6 lĩnh vực × 3 kênh coverage).
- P5 cross-module: DN↔VV, TVV↔VV, VV↔CHITRA → đủ sample cho cross-reference assertion.

---

*Seed attempt 1: 2026-04-24 15:44-15:50 (3/6 PASS, 3/6 defer context budget) | Seed attempt 2 resume: 15:57-16:04 (3/6 PASS, 6/6 complete)*
*QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block A Tier 2*
*Next: T2.A3 TV_CHUYEN_SAU theo plan §P2 Block A Ngày 1-3.*
