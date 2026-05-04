# Seed Checklist — Tier 0 prerequisite QTHT (R6.1.1 → R6.1.6 + Phase 0)

**Ngày:** 2026-05-01 15:30 → 16:10 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-01 Danh mục dùng chung + SCR-VIII-06 Cấu hình hệ thống • **Đường dẫn:** `/quan-tri/danh-muc/{loai}` + `/quan-tri/cau-hinh`
**Dữ liệu mẫu:** [seed-fixture.yaml > tier_0_prerequisite + mau_phan_hoi_variants + danh_muc_ly_do_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-VIII-01 Quản lý DM dùng chung + FR-VIII-10 SLA + FR-VIII-11 Tiêu chí ĐG](../../../../input/srs-v3/srs-fr-10-quan-tri.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho mọi task downstream sẽ đọc data này.

| Task downstream | Đọc filter (quote SRS) | Số record cần | Status |
|-----------------|------------------------|---------------|:---:|
| Phase 2A (DN seed): `dn_variants[].loai_doanh_nghiep_id` | FK → DM `LOAI_DN` (TNHH/CP/DNTN/HKD) | 4 LV/loại DN | ☐ → ✅ |
| Phase 2A (DN seed): `dn_variants[].linh_vuc_id` | FK → DM `LINH_VUC_PL` (6 LV: LAO_DONG/THUE/HOP_DONG/DOANH_NGHIEP/SHTT/DAT_DAI) | 6 LV | ☐ → ⚠️ (5/6 match, SHTT vs SO_HUU_TRI_TUE) |
| Phase 2A (DN seed): `dn_variants[].tinh_thanh_id`/`don_vi_quan_ly` | FK → DON_VI (TW + 4 ĐP) | 5 đơn vị | ☐ → ✅ (7 pre-existing) |
| Phase 2C (account login): cần đơn vị ĐP để map `cb_nv_dp_*` | FK DON_VI cấp ĐP | ≥3 ĐP | ☐ → ✅ (AG/BG/BNI) |
| Phase 4 (workflow SLA banner): SCR-VIII-06 §SLA | `loai_yeu_cau IN (HOI_DAP, VU_VIEC, HO_SO_HT, HO_SO_TT)` | 4 loại | ☐ → ✅ |
| Phase 4 (HD response): chọn Mẫu phản hồi cover 6 LV | `mau_phan_hoi.linh_vuc_id ∈ 6 LV` | ≥1 mẫu/LV = 6 | ☐ → ⚠️ (UI thiếu CRUD) |
| Phase 4 (HD/VV/TVCS reject + supplement): chọn DM Lý do | `loai_danh_muc IN (LY_DO_TU_CHOI, LY_DO_BO_SUNG)` | ≥2/module × 3 module = 12 | ☐ → ⚠️ (DM type không expose UI) |

**Acceptance pass khi:** mọi row Status = ✅ qua verify query thực tế.

---

## Kết quả: ⚠️ MỘT PHẦN 5/6 + 1 ⚠️

5 task ✅ (LINH_VUC_PL, LOAI_DN, DON_VI, SLA — pre-existing/seeded; LY_DO skip do non-SRS extension), 1 ⚠️ MAU_PHAN_HOI (UI thiếu nút [Thêm mới] tab Cấu hình HT). Phase 0 verify (app+MailHog+QTHT login+SCR-VIII-02) PASS 4/4. Dev đã reset password QTHT (R10 cũ block 401, giờ login OK).

**Bug (nếu có):** [`BUG-UI-MAU-PHAN-HOI-001`](../bug-reports/bug-report-seed-qtht.md) — Tab "Mẫu phản hồi" tại `/quan-tri/cau-hinh?tab=mau-phan-hoi` chỉ có 3 nút (Tìm kiếm/Xóa lọc/Làm mới), thiếu nút [Thêm mới] để CRUD MPH; SRS UC56-65 chưa spec entity riêng → đợi BA confirm trước log Critical.

---

## Bảng dữ liệu seed

| # | Task | Loại | Action | Số record | Có vào kho? |
|---|------|------|--------|-----------|:-----------:|
| R6.0.1 | Verify app HTTP 200 | Phase 0 | curl | 1 check | ✅ |
| R6.0.2 | Verify MailHog HTTP 200 | Phase 0 | curl | 1 check | ✅ |
| R6.0.3 | Login `qtht_01/Secret@123/OTP 666666` | Phase 0 | MCP UI | dashboard "Tổng quan hệ thống" render | ✅ |
| R6.0.4 | Verify SCR-VIII-02 button [Thêm mới] | Phase 0 | MCP UI | uid 5_27 visible, 34 TK list | ✅ |
| R6.1.1 | DM LINH_VUC_PL (6 fixture LV) | Tier 0 | 5 pre-existing (LAO_DONG/THUE/DOANH_NGHIEP/SO_HUU_TRI_TUE/DAT_DAI) + seed HOP_DONG | 13 total | ✅ |
| R6.1.2 | DM LOAI_DN (TNHH/CP/DNTN/HKD) | Tier 0 | seed 4 mới (existing 3 quy_mo `DN_SIEU_NHO/NHO/VUA` giữ nguyên) | 7 total | ✅ |
| R6.1.3 | DON_VI (5 fixture spec) | Tier 0 | 7 pre-existing (Cục BTP TW + Bộ KH-ĐT/TC/CT + ST AG/BG/BNI) — convention app khác fixture (AG/BG/BNI thay HN/HP/DN) | 7 | ✅ |
| R6.1.4 | SLA (4 loai_yeu_cau) | Tier 0 | 4 pre-existing match fixture (HOI_DAP 10d, HO_SO_HT 15d, HO_SO_TT 10d, VU_VIEC 10d, hệ số 2.0, cảnh báo 50/90%) | 4 | ✅ |
| R6.1.5 | MAU_PHAN_HOI (6 LV) | Tier 0 | UI tab "Mẫu phản hồi" thiếu nút [Thêm mới] — KHÔNG seed được qua UI | 0 | ⚠️ |
| ~~R6.1.6~~ | ~~LY_DO_TU_CHOI/BO_SUNG~~ | REMOVED 2026-05-01 | Fixture extension non-SRS đã xóa khỏi seed-fixture.yaml + todo.md. App dùng textarea inline khi từ chối, không cần master DM | 0 | ❌ removed |

**Tổng:** 4 Phase-0 PASS + 4 Phase-1 PASS (5 record seeded mới + 18 pre-existing verified) + 2 Phase-1 ⚠️ (UI gap MPH, fixture extension non-SRS LY_DO).

---

## Ảnh chụp

- [Phase 0 — DM LINH_VUC_PL initial state 12 records (pre-seed HOP_DONG)](../screenshots/r6-phase1-linh-vuc-pl-existing-12-records.png)
- [Phase 1 final — DM LINH_VUC_PL 13 records (HOP_DONG seeded)](../screenshots/r6-phase1-linh-vuc-pl-13-records-final.png)
- [Phase 1 — DM LY_DO 404 (loaiDanhMuc không hợp lệ)](../screenshots/r6-phase1-final-state.png)

---

## Observation quan trọng cho Phase tiếp theo

1. **DB không hoàn toàn empty sau "dev reset 2026-05-01":** 34 TK + 100 VV + 12 LINH_VUC + 7 DON_VI + 4 SLA + 3 quy_mo DN đã pre-existing. Phase 2-3 cần kiểm tra duplicate trước seed.
2. **Convention app khác fixture v2.6.2 ở 2 điểm:**
   - LV code: `SO_HUU_TRI_TUE` (app) vs `SHTT` (fixture). Downstream `dn_variants[].linh_vuc_id` phải dùng `SO_HUU_TRI_TUE`.
   - ĐP: `AG/BG/BNI` (app) vs `HN/HP/DN` (fixture). Phase 2A.2/2A.3 phải adapt.
3. **MAU_PHAN_HOI UI gap:** Cần escalate dev thêm CRUD button vào tab "Cấu hình hệ thống § Mẫu phản hồi" HOẶC chuyển vào DM dùng chung. Chặn Phase 4 HD response test (B5 chọn template).
4. **LY_DO_TU_CHOI/BO_SUNG:** Fixture extension không khớp DM type app → Phase 4 reject/supplement có thể dùng inline textarea thay master DM.

---

*2026-05-01 16:10 — QA chạy bằng Chrome DevTools MCP*
