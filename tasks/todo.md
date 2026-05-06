# TODO — QA HTPLDN Round 7 (apply SRS update 2026-05-05)

**App:** http://103.172.236.130:3000/ · **MailHog:** http://103.172.236.130:8025  
**Plan:** [plan.md](plan.md) v2.6.1 · **Plan trigger:** [plan-r7-trigger.md](plan-r7-trigger.md) · **Spec data:** [seed-fixture.yaml v2.7.1](../input/data/seed-fixture.yaml)  
**R6 frozen ref:** [_archive/round6-frozen-2026-05-06.md](_archive/round6-frozen-2026-05-06.md)  
**Today:** 2026-05-06

**Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream  
**Tag task (kế thừa R6):** 🔄 KEPT · ✏️ MODIFIED · 🆕 NEW · ❌ DROPPED

> **Bối cảnh R7:** Dev đã deploy SRS update 2026-05-05 + partial reset DB (verified 2026-05-06). 8 deploy gap đã log dev (entity NHT/HOC_VIEN 404 + sub-menu UI thiếu + tab Ngày lễ chưa có + filter Địa bàn vẫn còn).

---

## Tổng hợp Round 7

| Phase | Việc | Tổng | 🟢 | 🔵 | ✅ | ⚠️ | 🚫 | ⏳ |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | Pre-test (verify deploy + bug gap) | 5 | 4 | - | 1 | - | - | - |
| 1 | Re-seed Tier 0 (DM/đơn vị/SLA/MPH/ngày lễ) | 5 | 5 | - | - | - | - | - |
| 2 | Re-seed Tier 1 (TC TV/DN/TVV/CG/NHT/PC) | 8 | 6 | - | - | - | 2 | - |
| 3 | Re-seed Tier 2 (VV/HD/TVCS/CTĐT/KH/HV/...) | 13 | 9 | - | - | - | 2 | 2 |
| 4 | Workflow E2E (Trụ A/B/C/D) | 17 | 2 | - | - | - | - | 15 |
| 5 | Verification (KPI/cross-module/SLA/audit) | 5 | 3 | - | - | - | - | 2 |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TV nhanh/CT) | 5 | 1 | - | - | - | - | 4 |
| 7 | Functional 17 module (negative+edge+perm) | 18 | 3 | - | - | - | - | 15 |
| 8 | Cross-cutting + Profile + edge BR | 6 | 6 | - | - | - | - | - |
| Trụ E | Monitor unblock | 4 | 3 | - | - | - | - | 1 |
| **Tổng** | | **86** | **42** | **0** | **1** | **0** | **4** | **39** |

---

## Phase 0 — Pre-test (gate before run)

- ✅ **R7.0.1** Verify deploy + scenario reset DB — DONE 2026-05-06
  - **Kết quả:** MIX partial reset + 10/18 thay đổi deployed. [plan-r7-trigger.md](plan-r7-trigger.md)
- 🟢 **R7.0.2** 🆕 Log 8 bug deploy gap → gửi dev fix song song chạy P1+P2 `[~0% — ready, viết file bug-report-deploy-gap.md]`
- 🟢 **R7.0.3** 🆕 Bump fixture v2.7.0 → v2.7.1 (bỏ `dia_ban_ids` + xoá NHT khỏi `tvv_variants[19-21]`) `[~0% — ready, edit seed-fixture.yaml]`
- 🟢 **R7.0.4** 🔄 Verify users.csv accounts còn login (qtht_01/cb_nv_*/nht_01..03) `[~0% — ready, login từng account]`
- 🟢 **R7.0.5** 🔄 Verify SCR-VIII-02 button [Thêm mới] visible (QTHT seed TK lại nếu mất) `[~0% — ready, kiểm tra qua MCP]`

---

## Phase 1 — Re-seed Tier 0 (qtht_01)

- 🟢 **R7.1.1** 🔄 DM lĩnh vực pháp lý (6 LV) `[~0% — ready, was R6.1.1 ✅]`
- 🟢 **R7.1.2** 🔄 DM loại DN (TNHH/CP/DNTN/HKD) `[~0% — ready, was R6.1.2 ✅]`
- 🟢 **R7.1.3** 🔄 Đơn vị TW + 3 BN + 3 ĐP (AG/BG/BNI) `[~0% — ready, was R6.1.3 ✅]`
- 🟢 **R7.1.4** 🔄 SLA 4 loại (HOI_DAP/VV/HSHT/HSTT, hệ số 2.0) `[~0% — ready, was R6.1.4 ✅]`
- 🟢 **R7.1.5** 🆕 Seed 5 ngày lễ 2026 qua API trực tiếp (FR-VIII-29) `[~0% — ready, UI tab chưa có nên dùng API workaround]`

---

## Phase 2 — Re-seed Tier 1 (master actor)

- 🟢 **R7.2.1** 🔄 Seed 12 mẫu phản hồi cover 6 LV `[~0% — ready, was R6.1.5 ✅]`
- 🟢 **R7.2.2** 🆕 Seed 6 Tổ chức tư vấn qua API trực tiếp `[~0% — ready, UI sub-menu chưa có; nguồn to_chuc_tu_van_variants v2.7.1]`
- 🟢 **R7.2.3** 🆕 Phê duyệt TC TV → HOAT_DONG (FR-IV-NEW-04, CB PD cùng cấp) `[~0% — ready, sau R7.2.2]`
- 🟢 **R7.2.4** ✏️ Seed 15 DN qua FR-VIII-22 self-reg `[~0% — ready, was R6.2.1+2.2+2.3 nhưng flow đổi từ CB NV → DN tự đăng ký; verify dev đã re-seed 30 record DN000001..030]`
- 🟢 **R7.2.5** ✏️ Seed 12 TVV/CG (6 TVV + 6 CG, bỏ field dia_ban_ids) `[~0% — ready, was R6.2.4+2.5; nguồn tvv_variants v2.7.1]`
- 🚫 **R7.2.6** 🆕 Seed 3 NHT qua FR-IV-NHT-01 `[block: dev fix entity 404 /api/v1/nguoi-ho-tros]`
- 🚫 **R7.2.7** 🆕 Activate 3 NHT qua FR-VIII-26 (kích hoạt TK lần đầu) `[block: cascade R7.2.6]`
- 🟢 **R7.2.8** 🔄 Cấu hình PC mặc định Đợt 1 — 6 LV → cb_nv_tw_01 `[~0% — ready, was R6.2.9a ✅]`

---

## Phase 3 — Re-seed Tier 2 (transactional)

- 🟢 **R7.3.1** 🔄 Seed 6 Hỏi đáp entry MOI cover 6 LV `[~0% — ready, was R6.3.1 ✅]`
- 🟢 **R7.3.2** 🔄 Seed 8 Vụ việc entry DA_TIEP_NHAN `[~0% — ready, was R6.3.2 ✅; verify 70 VV existing có valid sau deploy]`
- 🟢 **R7.3.3** 🔄 Seed 6 TVCS entry TIEP_NHAN `[~0% — ready, was R6.3.3 ✅; verify endpoint /api/v1/tu-van-chuyen-saus 404 sau dev fix]`
- 🟢 **R7.3.4** 🔄 Seed 10 HSPL DN cover 5 loại × 3 state `[~0% — ready, was R6.3.4 ✅]`
- ⏳ **R7.3.5** 🆕 Seed Kế hoạch ĐT năm (KE_HOACH_DAO_TAO — Mô hình A 3 cấp) `[need: dev confirm endpoint deploy hay UI có sub-menu]`
- ⏳ **R7.3.6** ✏️ Seed 6 CTĐT entry DU_THAO `[need: R7.3.5 ✅; trước thẳng DA_DUYET, giờ qua workflow phê duyệt SM-CTDT mới]`
- 🟢 **R7.3.7** 🔄 Seed 4 thư mục + 7 biểu mẫu entry NHAP `[~0% — ready, was R6.3.7 ✅]`
- 🟢 **R7.3.8** 🔄 Seed 10 NHCH entry NHAP `[~0% — ready, was R6.3.8a ✅]`
- 🟢 **R7.3.9** 🔄 Seed 5 ĐKT entry NHAP `[~0% — ready, was R6.3.8b ✅]`
- 🟢 **R7.3.10** 🔄 Seed 8 bài giảng entry KICH_HOAT `[~0% — ready, was R6.3.9 ✅]`
- 🟢 **R7.3.11** ✏️ Seed 8 giảng viên entry HOAT_DONG `[~0% — ready, was R6.3.10 ✅; FR-III-11 refactor verify]`
- 🚫 **R7.3.12** 🆕 Seed 8 Học viên (HOC_VIEN entity mới) `[block: dev fix entity 404 /api/v1/hoc-viens]`
- 🚫 **R7.3.13** 🆕 Seed Lịch học (LICH_HOC — FR-III-22) `[block: chưa rõ endpoint deploy]`

---

## Phase 4 — Workflow E2E (multi-role)

### Trụ A — TVV/CG/VV/HD/TVCS

- ⏳ **R7.4.A1** ✏️ Workflow TVV — SM 9→11 state, thêm CHO_KICH_HOAT `[need: R7.2.5 ✅; was R6.4.A1; nội dung 12→13-14 bước]`
- ⏳ **R7.4.A1.5** ✏️ Đợt 2 PC TVV backfill — dropdown đổi `[need: R7.4.A1 ✅; was R6.4.A1.5 ⚠️ 95% — verify 2 BE bug Open]`
- ⏳ **R7.4.A2** 🆕 Tiếp nhận TVV (FR-IV-13) — 3 transition mới `[need: R7.4.A1 ≥1 TVV MOI_DANG_KY]`
- ⏳ **R7.4.A3** ✏️ Workflow VV — FK `nguoi_ho_tro_id` đổi target `[need: R7.2.7 ✅; was R6.4.A3]`
- ⏳ **R7.4.A4** ✏️ Workflow Hỏi đáp — dropdown phân công NHT/TVV/CB tách `[need: R7.2.7 ✅; was R6.4.A4]`
- ⏳ **R7.4.A5** ✏️ Workflow TVCS 11 bước — dropdown CG enum đổi `[need: R7.2.5 ✅ + R7.3.3 ✅; was R6.4.A5 ⚠️ 27%]`

### Trụ B — Đào tạo

- ⏳ **R7.4.B0** 🆕 Workflow KH năm SM-KH-DAO-TAO refinement `[need: R7.3.5 ✅]`
- ⏳ **R7.4.B1** ✏️ Workflow CTĐT SM-CTDT mới (DU_THAO→CHO_DUYET→DA_DUYET) `[need: R7.3.6 ✅; was R6.4.B2 🚫 — SRS update giải quyết spec contradiction]`
- ⏳ **R7.4.B5b** 🔄 Publish NHCH NHAP→CONG_KHAI `[need: R7.3.8 ✅; was R6.4.B5b ✅]`
- ⏳ **R7.4.B7** ✏️ Workflow KH SM-KHOAHOC 11 state (thêm TU_CHOI + TU_CHOI_KQ) `[need: R7.4.B1 ✅; was R6.4.B7 🚫 UNBLOCKED; 10→12 bước]`
- ⏳ **R7.4.B10** 🆕 FR-III-NEW-01/02/03 Đề kiểm tra workflow `[need: R7.3.9 ✅]`
- ⏳ **R7.4.B11** 🆕 FR-III-21 Phê duyệt khóa học `[need: R7.4.B7 ≥1 KH DA_KET_THUC]`
- ⏳ **R7.4.B12** 🆕 FR-III-22 Quản lý lịch học `[need: R7.3.13 ✅]`

### Trụ C — Biểu mẫu

- 🟢 **R7.4.C1** 🔄 Workflow Biểu mẫu NHAP→CONG_KHAI→AN `[~0% — ready, need R7.3.7 ✅; was R6.4.C1 ✅]`

### Trụ D — Đánh giá HQ + Kho QA

- 🟢 **R7.4.D1** 🔄 Tạo kỳ Đánh giá HQ entry LAP_KE_HOACH `[~0% — ready, was R6.4.D1 ✅]`
- ⏳ **R7.4.D2** ✏️ Workflow Đánh giá HQ 11 bước `[need: R7.4.D1 ✅; was R6.4.D2 🚫 UNBLOCKED — dev item 2 fix bug FR-08]`
- ⏳ **R7.4.D3** ✏️ Tạo Kho QA `[need: dev item 4 fix; was R6.4.D3 ⚠️ 50% — verify UI route SCR-X2-01]`

---

## Phase 5 — Verification

- ⏳ **R7.5.1** ✏️ Dashboard KPI counter cho HD/VV/TVCS/CT `[need: R7.4.A1/A3/A4/A5 ✅; KPI-07 count đổi sau NHT tách entity]`
- 🟢 **R7.5.2** 🔄 Cross-module DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả `[~0% — ready, was R6.5.2 🟢]`
- ⏳ **R7.5.3** ✏️ SLA cảnh báo — verify trừ ngày lễ (BR-CALC-03) `[need: R7.1.5 ✅ + ≥1 HD/VV deadline >70%; was R6.5.3]`
- 🟢 **R7.5.4** 🔄 BC04 export Excel có data `[~0% — ready, was R6.5.4 🟢]`
- 🟢 **R7.5.5** 🔄 Audit log ≥100 entry `[~0% — ready, was R6.5.5 🟢]`

---

## Phase 6 — Workflow đầu ra hậu kỳ

- ⏳ **R7.6.1** 🔄 Workflow Chi trả 13 bước `[need: data fresh; was R6.6.1 ⚠️ 75% — 6/7 bug closed R19, 1 Open]`
- ⏳ **R7.6.2** 🔄 Workflow TV nhanh nhập tay 5 trạng thái `[need: R7.4.D3 ✅; was R6.6.2 ⏳]`
- ⏳ **R7.6.3** 🔄 Workflow TV nhanh PUBLIC từ Cổng PLQG `[need: R7.E4 + R7.7.16; was R6.6.3 ⏳ external]`
- 🟢 **R7.6.4** 🔄 Workflow CT HTPLDN GĐ1 11 bước `[~0% — ready, was R6.6.4 ✅; verify 3 CT data còn]`
- ⏳ **R7.6.5** 🔄 Workflow CT HTPLDN GĐ2 Đợt BC 7 bước `[need: R7.6.4 ✅ + R7.6.1 ≥6 Chi trả + R7.4.A3 ≥6 VV HOAN_THANH]`

---

## Phase 7 — Functional 17 module (negative + edge + 40 TC perm)

- ⏳ **R7.7.1** 🔄 Hỏi đáp 12 TC `[need: R7.3.1 ✅; was R6.7.1 ⚠️ 92%]`
- ⏳ **R7.7.2** ✏️ CG/TVV 31 TC — enum loai_tvv đổi `[need: R7.2.5 ✅; was R6.7.2 ⚠️ 16%]`
- ⏳ **R7.7.3** 🔄 Vụ việc 12 TC `[need: R7.3.2 ✅; was R6.7.3 ⚠️ 92%]`
- ⏳ **R7.7.4** ✏️ DN 8 TC — flow tạo đổi `[need: R7.2.4 ✅; was R6.7.4 ⚠️ 88%]`
- ⏳ **R7.7.4.5** 🆕 NHT functional 10 TC `[need: R7.2.7 ✅ + R7.4.A2 ✅]`
- ⏳ **R7.7.4.6** 🆕 TC TV functional 10 TC `[need: R7.4.B1 ✅]`
- ⏳ **R7.7.5** ✏️ TVCS 44 TC `[need: R7.4.A5 ✅; was R6.7.5 🚫 UNBLOCKED]`
- ⏳ **R7.7.6** ✏️ Khóa học 40 TC + FR-III mới `[need: R7.4.B7+B10+B11+B12 ✅; was R6.7.6 🚫 UNBLOCKED]`
- ⏳ **R7.7.7** ✏️ Dashboard 34 TC — KPI-07 count đổi `[need: R7.4 trụ A ✅; was R6.7.7 ⏳]`
- 🟢 **R7.7.8** 🔄 QTHT 8 TC `[~0% — ready, was R6.7.8 ✅ — re-test sample sau reset]`
- ⏳ **R7.7.9** ✏️ Đánh giá HQ 40 TC `[need: R7.4.D2 ✅; was R6.7.9 🚫 UNBLOCKED]`
- 🟢 **R7.7.10** 🔄 Biểu mẫu 7 TC `[~0% — ready, was R6.7.10 ⚠️ 71%]`
- ⏳ **R7.7.11** 🔄 TV nhanh 39 TC `[need: R7.6.2 ✅ + R7.4.D3 ✅]`
- 🟢 **R7.7.12** 🔄 Chi trả 30 TC `[~0% — ready, was R6.7.12 🟢]`
- ⏳ **R7.7.13** 🔄 Báo cáo 38 TC `[need: ≥1 BC/upstream HD/VV/TVCS/CT/Đào tạo ready]`
- ⏳ **R7.7.14** 🔄 HĐ tư vấn (UC163 sub-resource) `[need: R7.4.A3 ✅ + R7.4.A1 ✅; was R6.7.14 ⚠️ 55%]`
- ⏳ **R7.7.15** 🔄 CT HTPLDN 42 TC `[need: R7.6.4 ✅; was R6.7.15 ⏳]`
- ⏳ **R7.7.16** 🔄 API 42 TC + 8 API inbound mock `[need: data upstream state cuối; was R6.7.16 ⏳]`

---

## Phase 8 — Cross-cutting + Profile + Edge

- 🟢 **R7.8.1** 🆕 Verify hard delete (DELETE → record không còn trong GET list) `[~0% — ready, item 9 dev list; mâu thuẫn SRS modal MD-XOA]`
- 🟢 **R7.8.2** 🆕 Verify bỏ ClamAV (upload `.exe` → BE behavior, security regression) `[~0% — ready, item 10 dev list]`
- 🟢 **R7.8.3** 🆕 Verify bỏ lưu nháp scope hẹp (button bỏ, state DRAFT giữ) `[~0% — ready, item 11 dev list — verified scope HẸP từ SRS]`
- 🟢 **R7.8.4** 🆕 Profile + đổi MK self-service (ho-so-doi-mat-khau.md) `[~0% — ready, verify 3 mâu thuẫn FR-VIII-26]`
- 🟢 **R7.8.5** 🔄 Edge BR-EC-01..23 (4 BR scope) `[~0% — ready, was R6.7.17 ⚠️ 17% — 4 PASS pre-existing]`
- 🟢 **R7.8.6** 🆕 Permission 49 entity × 11 role sample 40 TC/module `[~0% — ready, was R5 scope]`

---

## 🟥 Trụ E — Theo dõi unblock (xuyên suốt R7, không gate)

- 🟢 **R7.E1** 🔄 HĐ tư vấn (FR-X3-01) — sub-resource VV/TVV `[~0% — ready, was R6.E1 ✅]`
- 🟢 **R7.E2** 🔄 CT HTPLDN GĐ1 (FR-15) — verify 3 CT data còn `[~0% — ready, was R6.E2 ✅]`
- 🟢 **R7.E3** 🔄 Chi trả (FR-06) — verify 100 record HSCT còn `[~0% — ready, was R6.E3 ✅]`
- ⏳ **R7.E4** 🔄 TV nhanh (FR-13.A) — ≥1 phiên tồn tại `[need: R7.6.2/R7.6.3; was R6.E4 ⏳]`

---

## 🔓 Open issues — defer log bug khi gặp behavior thực tế

- **Item 3 BA câu:** Migration record cũ `loai_tvv = 'NHT'` chuyển sang NGUOI_HO_TRO ra sao? `[trigger ở R7.4.A2 / R7.7.2]`
- **Item 6 BA câu:** Migration DN cũ tạo bằng CB NV → có cần convert TK-first không? `[trigger ở R7.7.4]`
- **Item 9 BA câu:** DN không email/chưa ĐKKD vào hệ thống bằng cách nào? `[trigger ở R7.2.4]`
- **Item 11 BA câu:** NGAY_LE seed danh sách 2026 — BA cấp file Excel chính thức? `[trigger ở R7.1.5]`

---

## Bug deploy gap (gửi dev — log riêng)

[bug-report-deploy-gap.md](../output/qa-reports/round7-2026-05-06/bug-report-deploy-gap.md) — 8 bug Major/Medium chờ dev fix:

1. Entity NGUOI_HO_TRO BE 404 — block R7.2.6
2. Entity HOC_VIEN BE 404 — block R7.3.12
3. Sub-menu UI "Người hỗ trợ pháp lý" chưa thêm
4. Sub-menu UI "Tổ chức tư vấn" chưa thêm (BE có endpoint)
5. 4 sub-menu Đào tạo mới chưa thêm (Kế hoạch năm/Lịch học/Đề kiểm tra/Học viên)
6. Tab "Quản lý ngày lễ" trong Cấu hình HT chưa thêm
7. Filter "Địa bàn" TVV vẫn còn (SRS đã bỏ)
8. Tab SM-TVV "Chờ kích hoạt" chưa thêm
