# TODO — QA PM HTPLDN (Round 5 frozen + Round 6 active + Round 7 pending)

**Plan:** [plan.md](plan.md) v2.5 · **Overview:** [system-overview.md](system-overview.md) · **R5 Permission Plan:** [_archive/round5/plan.md](_archive/round5/plan.md) · **R6 Post-reset README:** [`output/qa-reports/round6-2026-05-01-postreset/README.md`](../output/qa-reports/round6-2026-05-01-postreset/README.md)
**Window:** TBD · **Today:** 2026-05-05 (Strict Pass Review 2026-05-05: 3 task fake-✅ flip ⚠️ — R6.4.A1.5/R6.7.1/R6.7.4 có PARTIAL/DEFER chưa close. Strict status review trước đó: 4 fake-🟢 flip ⏳ + R6.4.B7 ⏳→🚫. R6.6.4 PASS 11/11 transitions 2026-05-05.)

> 🔄 **DEV RESET DB 2026-05-01:** Toàn bộ data R1-R10 (Round 5) mất.
> - **Round 5 (R1-R10):** FROZEN — section "Tiến độ Round 5" + chi tiết task dưới đây giữ nguyên làm reference (lịch sử bug 5 tuần dev iterate, lessons learned). KHÔNG động status pre-reset.
> - **Round 6 (R11+):** ACTIVE — re-seed toàn bộ + test workflow. Theo dõi tiến độ ở section **"Tiến độ Round 6"** ngay dưới. Hướng dẫn 7 phase + account map: [R6 README](../output/qa-reports/round6-2026-05-01-postreset/README.md). Phase 6+7 thêm 2026-05-02 mapping R5 P3/P4 (workflow đầu ra + functional 17 module).

**Icon trạng thái:** ✅ xong (100% scope, không bug) · 🟢 sẵn sàng · 🔵 đang làm · ⏳ chờ data · ⚠️ partial (PARTIAL/DEFER/bug Open) · 🚫 block

**Fixture v2.6.2:** [`input/data/seed-fixture.yaml`](../input/data/seed-fixture.yaml) — bổ sung `cap_tai_khoan_cg_nht_r5` (9 cặp account-profile CG/NHT) + `dn_variants_dp_extension` (3 DN cấp ĐP-AG/BG/BNI).

---

## Tiến độ Round 6 (ACTIVE — post-reset)

| Phase | Việc | Tổng | ✅ | 🟢 | 🔵 | ⚠️ | 🚫 | ⏳ | Time est |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| 0 | Tiền điều kiện (app + MailHog + QTHT login) | 4 | 4 | - | - | - | - | - | 5' |
| 1 | Tier 0 prerequisite (LV/loại DN/đơn vị/SLA/MPH) | 5 | 5 | - | - | - | - | - | ~30' |
| 2 | Tier 1 actor (DN/TVV-CG-NHT/account/CAU_HINH_PC Đợt 1 + R6.2.7-TW backfill) | 10 | 10 | - | - | - | - | - | ~45' |
| 3 | Tier 2 transactional entry state (R6.3.6 moved → P4.B2.5) | 10 | 10 | - | - | - | - | - | ~60' |
| 4 | Workflow E2E (11 trụ + R6.4.A1.5 + R6.4.A1-CG + R6.4.B2.5 moved here) | 14 | 7 | - | - | 3 | 4 | 0 | ~3h |
| 5 | Verification (KPI + cross-module + audit) | 5 | - | 3 | - | - | - | 2 | ~30' |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TV nhanh/CT HTPLDN GĐ1+GĐ2) | 5 | 1 | - | - | 1 | - | 3 | ~1 tuần |
| 7 | Functional 17 module (T4.1-T4.17 negative + edge + 40 TC perm) | 17 | 1 | 1 | - | 7 | 3 | 5 | ~1 tuần |
| Trụ E | Monitor unblock (xuyên suốt R6, không gate) | 4 | 3 | - | - | - | - | 1 | daily |
| **Tổng Round 6** | | **74** | **41** | **4** | **0** | **11** | **7** | **11** | **~2 tuần + 6h** |

**Icon column meaning:** ✅ xong · 🟢 sẵn sàng làm · 🔵 đang làm · ⚠️ partial · 🚫 block · ⏳ chờ upstream

---

## Round 6 — Active task tracker

> Hướng dẫn chi tiết 7 phase + account map: [R6 README](../output/qa-reports/round6-2026-05-01-postreset/README.md). Spec data: [`seed-fixture.yaml v2.6.2`](../input/data/seed-fixture.yaml).

### Phase 0 — Tiền điều kiện

- ✅ **R6.0.1** App + BE up — HTTP 200 verified 2026-05-01 16:00
- ✅ **R6.0.2** MailHog up — HTTP 200 verified 2026-05-01 16:00
- ✅ **R6.0.3** QTHT login OK — `qtht_01/Secret@123/OTP 666666` PASS 2026-05-01 16:05 (dev đã reset password sau R10)
- ✅ **R6.0.4** SCR-VIII-02 button [Thêm mới] visible (uid 5_27), 34 TK pre-existing

### Phase 1 — Tier 0 prerequisite (qtht_01)

- ✅ **R6.1.1** DM LINH_VUC_PL — 6/6 fixture cover (5 pre-existing + seed HOP_DONG) → 13 records. [seed-checklist-QTHT.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-QTHT.md)
- ✅ **R6.1.2** DM LOAI_DN — seed 4 mới TNHH/CP/DNTN/HKD (existing 3 quy mô giữ) → 7 records
- ✅ **R6.1.3** DON_VI — 7 đơn vị pre-existing (TW + 3 BN + AG/BG/BNI). Convention app khác fixture (AG/BG/BNI thay HN/HP/DN) — adapt downstream
- ✅ **R6.1.4** SLA — 4 pre-existing match fixture (HOI_DAP 10d, HO_SO_HT 15d, HO_SO_TT 10d, VU_VIEC 10d, hệ số 2.0)
- ✅ **R6.1.5** MAU_PHAN_HOI — seed 12 mẫu Mô hình B Hybrid 2 tầng qua UI
  - **Kết quả:** PASS 12/12 qua UI (6 TW + 3 BN + 3 DP). Cover 6 LV × 2 mẫu/LV. [seed-checklist-MPH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-MPH.md)
  - **Bug:** [bug-report-seed-qtht.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-qtht.md) — 3/3 đóng (MPH-001 Invalid + MPH-002 Fixed + MPH-003 Fixed verified 6/6 user scope MPH_READ)
- ~~**R6.1.6** Seed 12 lý do từ chối/bổ sung~~ — REMOVED 2026-05-01: fixture extension non-SRS, app dùng textarea inline khi từ chối. Đã xóa `danh_muc_ly_do_variants` khỏi seed-fixture.yaml

### Phase 2 — Tier 1 actor

#### 2A — Doanh nghiệp
- ✅ **R6.2.1** DN cấp TW — 50 pre-existing + 12 fixture v2.6.2 (Alpha..Mu, MST checksum-valid)
  - **Kết quả:** PASS 12/12 fixture seed via API. Cross-combo 3/9 → 7/9 (miss NHO/VUA × NONG_LAM). [bug-report-fixture-seed-dn.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md)
  - **Bug:** [bug-report-fixture-seed-dn.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md) — 0/4 đóng (JWT Critical, DM polluted Major, Search Major, API schema Medium)
- ✅ **R6.2.2** DN cấp ĐP — Epsilon/Zeta/Lambda DP-DN + Iota/Kappa DP-HP
  - **Kết quả:** PASS 5/5 ĐP (DP-DN ×3, DP-HP ×2 trong fixture v2.6.2). DN000002 BG pre-existing verified.
- ✅ **R6.2.3** DN extension AG/BG/BNI — seed 3 fixture variants 13/14/15
  - **Kết quả:** PASS 3/3 — DN-AGG-0001 + DN-BGG-0001 + DN-BNH-0001. Variant 14/15 đổi enum `CO_PHAN/TU_NHAN` → `CP/DNTN` khớp DM seed.

#### 2B — TVV/CG/NHT profile
- ✅ **R6.2.4** TVV TW
  - **Kết quả:** PASS 6/6 saved (TW-0001..0006) state MOI_DANG_KY. Advance state là R6.4.A1.
  - **Bug:** [bug-report-seed-tvv.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-tvv.md) — 2/2 đóng (TVV-001/002 CLOSED 2026-05-01 19:20)
- ✅ **R6.2.5** Seed 6 CG TW (TVV-BTP-TW-0007..0014 sau audit R12) `loai_tvv=CG`
  - **Kết quả:** Audit R12 — chỉ 5/6 visible (TVV-0008 missing). Seed bù 2 CG R12 (TVV-0013 LĐ, TVV-0014 Thuế) cover 6/6 LV. UUID: 2ff3bb8d/8454f7db/7727ddd7/45659b43/4caa5898/a0c6199e.
- ✅ **R6.2.6** Seed 3 NHT ĐP — PASS 3/3 ngày 2026-05-01 19:55
  - **Kết quả:** PASS 3/3. NHT-AG `a91f543b` qua cb_nv_dp_01, NHT-BG `6b572b9a` qua _02, NHT-BNI `f0da6c6d` qua _03. State Mới đăng ký. [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)

#### 2C — Account login + FK link (CRITICAL — fix gap A5/A3)
- ✅ **R6.2.7** QTHT tạo 9 account login: 6 `cg_tw_01..06` + 3 `nht_ag_01`/`nht_dn_01`/`nht_hp_01`
  - **Kết quả:** PASS 9/9. Tất cả state "Chờ kích hoạt", cần activate. [seed-checklist-account.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-account.md)
- ✅ **R6.2.8** Activate 9 accounts + verify FK link — PASS 2026-05-01 20:00
  - **Kết quả:** PASS 9/9 active. nht_ag_01 login + role NHT + VV access OK. [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.2.7-TW** QTHT tạo 6 TK TVV TW + link FK
  - **Kết quả:** PASS 6/6 TK `tvv_tw_01..06` (vai trò NHT) + FK link entity TVV-BTP-TW-0001..06. Unblock A3 R8 E2E PASS. [users.csv +6 row](../input/users.csv)

#### 2D — Cấu hình phân công Đợt 1 CB-only (Đợt 2 TVV ở Phase 4 R6.4.A1.5)
- ✅ **R6.2.9a** Đợt 1 — 6 cấu hình PC CB-only (mỗi LV → cb_nv_tw_01)
  - **Kết quả:** PASS 6/6. R1 LĐ/Thuế/HĐ saved, R2 KDTM/ĐĐ/HNGĐ saved sau BE recover. [seed-checklist-cau-hinh-PC.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-cau-hinh-PC.md)

### Phase 3 — Tier 2 transactional entry state (cb_nv_tw_01)

- ✅ **R6.3.1** Seed 6 Hỏi đáp entry `MOI`
  - **Kết quả:** PASS 6/6 `HD-20260501-001..006` cover 6 LV (LĐ/Thuế/HĐ/DN/SHTT/ĐĐ) × 4 kênh (Trực tiếp/DVC/Cổng PLQG/Hệ thống khác). [r6-3-1-hd-6of6-moi.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-1-hd-6of6-moi.png)
- ✅ **R6.3.2** Seed 8 Vụ việc entry `DA_TIEP_NHAN` — PASS via pre-existing 2026-05-01
  - **Kết quả:** PASS pre-existing 100 VV. ≥4 ở "Đã tiếp nhận" page 1 (VV000008/012/016/020). [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.3.3** Seed 6 TVCS entry `TIEP_NHAN`
  - **Kết quả:** PASS 6/6 `TVCS-20260501-0001..0006` cover 6 LV (DN/HĐ/LĐ/Thuế/SHTT/ĐĐ). [r6-3-3-tvcs-6of6-tiep-nhan.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-3-tvcs-6of6-tiep-nhan.png)
- ✅ **R6.3.4** Seed 10 HSPL DN cover 5 loại × 3 state × 5 DN (per-filter)
  - **Kết quả:** PASS 10/10. R12 thêm 4 record `HSPL-20260503-0001..0004`. Per-filter HIEU_LUC=8 + HET_HAN=1 + THU_HOI=1 + KHAC=1 + 5 DN. [DN001](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn001-6-hieu-luc.png) [DN003](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn003-het-han.png) [DN005](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn005-thu-hoi.png) [DN008](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn008-quyet-dinh-hieu-luc.png) [DN010](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn010-khac-hieu-luc.png)
- ✅ **R6.3.5** Seed 6 CTĐT entry `Dự thảo`
  - **Kết quả:** PASS 6/6 `CTDT-BTP-TW-2026-0001..0006` cover 6 LV (DN/LĐ/SHTT/ĐĐ/Thuế/HĐ). [r6-3-5-ctdt-list-6du-thao.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-5-ctdt-list-6du-thao.png)
- ✅ **R6.3.7** Seed 4 thư mục + 7 biểu mẫu entry `Nháp`
  - **Kết quả:** PASS 4 thư mục + 7/7 BM `BM-20260501-001..007` (6 docx + 1 xlsx). File dummy OOXML accept BE. [r6-3-7-bieumau-list-7nhap.png](../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-7-bieumau-list-7nhap.png)
- ✅ **R6.3.8a** Seed 10 NHCH (Ngân hàng câu hỏi) entry `Nháp`
  - **Kết quả:** PASS 10/10. Per-filter ✅ (DE 4, TB 3, KHO 3, TN 6, TL 4). Bổ sung 4 record (idx 6/8/9/10) qua API. [seed-checklist-NHCH.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-NHCH.md)
- ✅ **R6.3.8b** Seed 5 ĐKT (Đề kiểm tra) entry `Nháp`
  - **Kết quả:** PASS 5/5 cover 5 LV (DN/SHTT/LĐ/HĐ/ĐĐ). Toàn bộ THU_CONG. NGAU_NHIEN block do BE filter NHCH `trangThai=CONG_KHAI` — cần R6.4.B5b publish trước. [seed-checklist-DKT.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DKT.md)
- ✅ **R6.3.9** Seed 8 Bài giảng entry `Kích hoạt`
  - **Kết quả:** PASS 8/8 sau dev fix BE 422. 4 Slide + 1 PDF + 3 Video, 4/6 LV (DN/SHTT FE thiếu). [seed-checklist-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-baigiang.md)
  - **Bug:** [bug-report-seed-baigiang.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-baigiang.md) — 1/1 đóng (BUG-FUNC-BAIGIANG-001 CLOSED 2026-05-02 R6)
- ✅ **R6.3.10** Seed 8 Giảng viên entry `Đang hoạt động`
  - **Kết quả:** PASS 8/8 `GV-BTP-TW-0001..0008` cover 6 LV + 6 GV/2 TG. Áp dụng decision §3.4.3.25 (3 enum, default DANG_HOAT_DONG). [seed-checklist-GiangVien.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-GiangVien.md)

### Phase 4 — Workflow E2E (multi-role)

#### 🟦 Trụ A — TVV → PC → VV → HD → TVCS
- ✅ **R6.4.A1** A1 Workflow TVV (12 bước) — cb_nv_tw_01 → cb_pd_tw_01
  - **Kết quả:** PASS 10/10 CMS-scope. B7+B8 (FR-IV-11) ngoài scope — qua Portal chuyên trang. [workflow-test-report-TVV.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVV.md)
- ⚠️ **R6.4.A1.5** Đợt 2 PC TVV backfill — surfaced 2 BE bug `[~95% — 12/12 PC config done, 2 BE bug Open + regression chờ dev fix]`
  - **Kết quả:** Done — 2 BE bug Open vi phạm SRS §3.4.3.48. A3/A4 không cần unblock. Regression chờ dev fix.
  - **Bug:** [bug-report-flow-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-vuviec.md) — 0/2 đóng (BUG-FUNC-CHPC-001 + BUG-FUNC-CHPC-002 Open)
- ✅ **R6.4.A1-CG** Advance state 6 CG (TVV-0009..0014) → DANG_HOAT_DONG
  - **Kết quả:** PASS 6/6 CG (4 + 2 bonus seed LĐ/Thuế). Pool 12/12. Cover 6/6 LV. [workflow-test-report-CG.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CG.md)
- ✅ **R6.4.A3** A3 Workflow Vụ việc
  - **Kết quả:** PASS 12/12 CMS DB (R8 happy 7/12 + R9 reject/edge 5/12). 6/18 out scope CMS. [workflow-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.4.A4** A4 Workflow Hỏi đáp — cb_nv_tw_01 → cb_pd_tw_01
  - **Kết quả:** PASS 11/11 transition R11. ERR-PH-01 + BR-FLOW-01 + BR-FLOW-04 + push Cổng PLQG verified. [workflow-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HoiDap.md)
- ⚠️ **R6.4.A5** A5 Workflow TVCS `[~27% — 3/11 PASS sau R17 fix TVCS-002 + 6 BLOCKED FK + 2 external]`
  - **Kết quả:** R17 lỗi — TVCS-002 button + B10 transition PASS. FK gap còn. [workflow-test-report-TVCS.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVCS.md)
  - **Bug:** [bug-report-flow-tvcs.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-tvcs.md) — 0/2 Open (TVCS-001 + TVCS-002 đều Closed R17).

#### 🟩 Trụ B — Đào tạo
- 🚫 **R6.4.B2** B2 Đẩy CTĐT → `Đã duyệt` `[block: spec contradiction — BE chặn submit CTĐT chưa có KH ↔ SRS line 599 dropdown CTĐT cha của KH chỉ DA_DUYET. Cần BA quyết định relax bên nào]`
  - **Kết quả:** R11 BLOCK 0/2 transition. 6/6 CTĐT stuck DU_THAO. Log BUG-FUNC-CTDT-001 Critical. [workflow-test-report-CTDT.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTDT.md)
  - **Bug:** [bug-report-flow-ctdt.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-ctdt.md) — 0/1 đóng (Critical Open)
- 🚫 **R6.4.B2.5** Seed 8 Khóa học entry `Dự thảo` (was R6.3.6) `[block: cùng deadlock với B2 — UI form Tạo KH dropdown CTĐT cha = 0 options vì 0 CTĐT DA_DUYET. Cần BA confirm spec contradiction]`
  - **Kết quả:** 🚫 block — cascade từ B2 spec contradiction. Verify R12 dropdown empty.
- ✅ **R6.4.B5b** B5b Publish NHCH `Nháp → Công khai`
  - **Kết quả:** PASS 11/11. Per-filter ✅ (DE 4 / TB 3 / KHO 3 / TN1 6 / TL 4). NGAU_NHIEN ĐKT R6.3.8b unblock. [workflow-test-report-NHCH-publish.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-NHCH-publish.md)
- 🚫 **R6.4.B7** B7 Workflow Khóa học (10 bước) `[block: cascade R6.4.B2.5 🚫 — 0 KH state DU_THAO. Chờ BA confirm spec contradiction B2 trước. Dep "≥3 học viên active" ĐÃ BỎ — học viên chỉ cần khi KH DANG_DIEN_RA per SRS line 604]`

#### 🟨 Trụ C — Biểu mẫu
- ✅ **R6.4.C1** C1 Workflow Biểu mẫu `Nháp → Công khai → Ẩn`
  - **Kết quả:** PASS 3/3 transition SM-BIEUMAU. Sample thư mục "Biểu mẫu Doanh nghiệp" cover NHAP→CK→AN→CK re-publish. Sync "Đã đồng bộ" verified. [workflow-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-BieuMau.md)

#### 🟧 Trụ D — Đánh giá HQ (FR-VI) **+ Kho QA standalone (FR-X.2-01)**
> ⚠️ Note 2026-05-05: D2 (Đánh giá HQ) và D3 (Kho QA) là 2 module entity riêng (`DOT_DANH_GIA` vs `KHO_CAU_HOI`), KHÔNG có ràng buộc nhân quả. Để chung vì lịch sử đánh số, không phải dependency.

- ✅ **R6.4.D1** D1 Tạo kỳ Đánh giá HQ entry `Lập kế hoạch`
  - **Kết quả:** PASS 1/1. `DG-20260502-0001` state Lập kế hoạch. Tần suất Sơ bộ 6 tháng × Tổng hợp. Unblock D2. [seed-checklist-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DanhGiaHQ.md)
- 🚫 **R6.4.D2** D2 Workflow Đánh giá HQ (11 bước) `[block: 5 bug FE chặn từ B1 — form Tạo thiếu trường tiêu chí + tab Tiêu chí không có nút thêm + 3 dropdown phân công 404/empty]`
  - **Kết quả:** R14 BLOCKED 1/11 PASS B1. Back-fill tiêu chí FAIL + B2-B11 cascade. Tạo `DG-20260502-0002` test seed. [workflow-test-report-DanhGiaHQ.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-DanhGiaHQ.md)
  - **Bug:** [bug-report-flow-danhgia.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-danhgia.md) — 0/5 đóng (3 Critical + 2 Major)
- ⚠️ **R6.4.D3** D3 Tạo Kho QA — module riêng FR-X.2-01, KHÔNG thuộc Đánh giá HQ `[~50% — UI route Kho QA bị block FE, không seed thêm THU_CONG qua UI; auto-feed TU_DONG BE chưa trigger BR-FLOW-10. Block thật cho UI-only QA]`
  - **Kết quả:** Lỗi R14 re-verify cùng status: THU_CONG 1 record `QA-20260502-0001` (BE OK qua API), TU_DONG total=0, UI route vẫn thiếu submenu. [seed-checklist-KhoQA.md](../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-KhoQA.md)
  - **Bug:** [bug-report-flow-kho-qa.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-kho-qa.md) — 0/1 đóng (BUG-KHOQA-001 Critical P0 UI SCR-X2-01 chưa build)

### Phase 5 — Verification

- ⏳ **R6.5.1** Dashboard KPI counter > 0 cho HD/VV/TVCS/CT `[need: A5 ✅ 11/11 (hiện ⚠️ 3/11 → counter TVCS sẽ lệch). HD ✅ A4 + VV ✅ A3 + CT R6.6.4 ✅ đủ; thiếu TVCS để verify đủ scope 4 module. Hoặc split sub-task HD/VV/CT (🟢) vs TVCS (⏳ chờ A5)]`
- 🟢 **R6.5.2** Cross-module link DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả ≥1 record/tab `[~0% — full ready: DN000001 HSPL ✅ R6.3.4 + KPI từ A3 ✅ + 100 chi trả từ E3 ✅. Test ngay]`
- ⏳ **R6.5.3** SLA cảnh báo banner hiện khi HD/VV quá hạn `[need: ≥1 HD/VV deadline qua 70-90% — reset 2026-05-01 mới 4/10 ngày (40%), chờ thời gian hoặc dev seed lùi ngày]`
- 🟢 **R6.5.4** BC04 export Excel có data `[~0% — full ready: HD CONG_KHAI ✅ A4 + VV HOAN_THANH ✅ A3]`
- 🟢 **R6.5.5** Audit log ≥100 entry `[~0% — full ready: accumulate qua Phase 4 đã đủ — verify counter ngay qua Nhật ký HT page]`

### Phase 6 — Workflow đầu ra hậu kỳ (mapping R5 P3)

> Chạy sau Phase 4 workflow E2E + Trụ E unblock. Cascade-block khi upstream chưa state cuối. Mapping R5 P3.1-P3.4 — xem chi tiết kế hoạch trong [`plan.md` §1.3 P3](plan.md).

- ⚠️ **R6.6.1** Workflow Chi trả (P3.1, 13 bước — [§⑪](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713)) `[~75% — R19 PASS 6/8 transition, 6/7 bug closed, 1 Open scope shift]`
  - **Kết quả:** R19 PASS-WITH-NOTE 6/8 CMS transition sau dev deploy lần 3 (Bước 3-5/8/12 ✅, Bước 9 dở, Bước 10/11 perm scope). [workflow-test-report-ChiTra.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-ChiTra.md)
  - **Bug:** [bug-report-flow-chi-tra.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-chi-tra.md) — 6/7 đóng R19 (CT-001/002/003/004/006/007 Closed); CT-005-BE Open scope shift + 2 OBS mới (R19-A perm cross-DV, R19-B button mis-wire)
- ⏳ **R6.6.2** Workflow TV nhanh nhập tay (P3.2, 5 trạng thái — verify `srs-fr-13-tv-nhanh.md`) `[need: ≥1 KHO_CAU_HOI cho keyword search (per SRS FR-X.2-02 line 179). KHÔNG cần D2. Block thật do D3 ⚠️ UI route Kho QA defer FE → không seed thêm Q&A qua UI]`
  - **Cần có sẵn:** R6.4.D3 ⚠️ (UI route thiếu — không phải D2)
  - **Output dự kiến:** 6 phiên TV nhanh `Kết thúc` + 1 phiên `Hết hạn` auto.
- ⏳ **R6.6.3** Workflow TV nhanh PUBLIC — DN gửi qua Cổng PLQG (1 bước) `[need: R6.E4 ≥1 record source=CONG_PLQG + R6.7.16 API test PASS — external integration, không UI nội bộ]`
  - **Cần có sẵn:** R6.E4 ⏳ monitor + R6.7.16 ⏳
  - **Output dự kiến:** ≥1 phiên TV nhanh PUBLIC từ DN qua Cổng PLQG.
- ✅ **R6.6.4** Workflow CT HTPLDN GĐ1 (P3.3, 11 bước — [§⑤](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L328-L342))
  - **Kết quả:** PASS 11/11 transitions. CT-001 Hoàn thành, CT-002 Dự thảo, CT-003 Đã hủy. [workflow-test-report-CTHTPLDN-GD1.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTHTPLDN-GD1.md)
  - **Output:** unblock R6.6.5 + R6.7.15. 2 obs UI/perm note trong report.
- ⏳ **R6.6.5** Workflow CT HTPLDN GĐ2 Đợt BC (P3.4, 7 bước — [02-thu-tu-module.md §⑭-bis](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L839-L849)) `[need: R6.6.4 ✅ + R6.6.1 ≥6 Chi trả DA_THANH_TOAN (block do 7 BUG R6.6.1) + R6.4.A3 ≥6 VV HOAN_THANH ✅]`
  - **Cần có sẵn:** R6.6.4 ✅ + R6.6.1 ⚠️ ~75% (R19 6/7 closed, 1 HSCT đã DA_THANH_TOAN — cần seed thêm ≥5 nữa cùng cấp DonVi) + R6.4.A3 ✅
  - **Output dự kiến:** Đợt BC tổng hợp ĐP/BN → TW.

### Phase 7 — Functional 17 module (mapping R5 P4)

> Bỏ happy path (đã cover Phase 4 + 6). Test negative + nhánh phụ + edge + 40 TC phân quyền/module. Mapping R5 T4.1-T4.17. Per-module dependency dưới.
> **Notation:** "(N TC scope Phase 7)" = N TC effective trong scope test Phase 7 sau khi loại happy path đã cover Phase 4. Không phải N/Y nghĩa "N done out of Y".

#### Ngày 1
- ⚠️ **R6.7.1** Hỏi đáp (12 TC scope Phase 7) `[~92% — 11/12 PASS, 1 PARTIAL HD-022 chờ dev seed DB lùi ngày]`
  - **Kết quả:** PASS 11/12 + 1 PARTIAL HD-022 chờ dev seed DB lùi ngày. 0 bug. [functional-test-report-HoiDap.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-HoiDap.md)
  - **Bug:** [bug-report-functional-hoidap.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-hoidap.md) — 0/0 (không bug)
- ⚠️ **R6.7.2** CG/TVV (31 TC) `[~16% — 5/31 PASS, 2 BUG perm Critical/Major, 6 chờ cross-module]`
  - **Kết quả:** PASS 5/5 functional + 2 BUG perm Critical/Major + 6 chờ cross-module. [functional-test-report-CGTVV.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-CGTVV.md)
  - **Bug:** [bug-report-functional-cgtvv.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-cgtvv.md) — 0/2 đóng (BUG-CGTVV-001 Critical QTHT bypass; BUG-CGTVV-002 Major CG GET 403)
  - **Pool:** TVV-0014 deleted (probe), TVV-0015 reseed PASS — total 67, DANG_HOAT_DONG 12→11 (≥9 OK)
- ⚠️ **R6.7.3** Vụ việc (12 TC scope Phase 7) `[~92% — 11/12 PASS, 1 FAIL VV-013d Major]`
  - **Kết quả:** PASS 11/12 + 1 FAIL VV-013d (TVV bypass). 2 obs SLA pre-existing. [functional-test-report-VuViec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-VuViec.md)
  - **Bug:** [bug-report-functional-vuviec.md](../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-vuviec.md) — 0/1 đóng (BUG-VV-001 Major TVV bypass module)

#### Ngày 2
- ⚠️ **R6.7.4** Doanh nghiệp (8 TC scope Phase 7) `[~88% — 7/8 PASS, 1 PARTIAL DN-007 UX guard gap không có toast]`
  - **Kết quả:** PASS 7/8 + 1 PARTIAL DN-007 UX guard gap không có toast. 0 bug. [functional-test-report-DoanhNghiep.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-DoanhNghiep.md)
- 🚫 **R6.7.5** TV chuyên sâu (44 TC) `[block: cascade A5 ⚠️ — cần A5 PASS đủ 11 bước; hiện B3-B11 BLOCKED FK]`
  - **Cần có sẵn:** R6.4.A5 ⚠️
- 🚫 **R6.7.6** Khóa học (40 TC) `[block: cascade B7 🚫 + B2 🚫 + B2.5 🚫 spec contradiction; chờ BA quyết]`
  - **Cần có sẵn:** R6.4.B2 🚫 + R6.4.B2.5 🚫 + R6.4.B7 🚫

#### Ngày 3
- ⏳ **R6.7.7** Dashboard (34 TC) `[need: A5 ✅ 11/11 (hiện ⚠️ 3/11 → ~8/34 TC TVCS counter sẽ fail). HD ✅ A4 + VV ✅ A3 + Chi trả 100 record E3 ✅ + CT R6.6.4 ✅ đủ; thiếu TVCS để verify đủ 4 module Dashboard]`
- ✅ **R6.7.8** Quản trị HT (8 TC scope Phase 7)
  - **Kết quả:** PASS 8/8 (QT-010 unique mã + QT-017 14 tab + QT-025/026 audit log + QT-027 SLA + QT-029-032 perm). 0 bug mới. [functional-test-report-QTHT.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-QTHT.md)
- 🚫 **R6.7.9** Đánh giá HQ (40 TC) `[block: cascade R6.4.D2 🚫 — workflow ĐG HQ chặn từ B1 (5 bug FE), không thể test perm/edge cho phần workflow. Negative + permission của riêng tab Lập KH có thể chạy 1 phần khi dev fix tối thiểu BUG-DG-001 (form thiếu tiêu chí)]`
  - **Cần có sẵn:** R6.4.D2 🚫

#### Ngày 4
- ⚠️ **R6.7.10** Biểu mẫu (7 TC scope Phase 7) `[~71% — 5/7 PASS, 1 chờ thư mục rỗng BM-026, 1 obs UI count]`
  - **Kết quả:** PASS 5/7 (BM-013 required + BM-032/034/035/036 perm + BM-039 LV). BM-026 chờ thư mục rỗng. [functional-test-report-BieuMau.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-BieuMau.md)
  - **Bug obs:** BUG-BM-001 Minor — UI cột "Số biểu mẫu" hiển thị 0 sai (BE đúng, FE display bug)
- ⏳ **R6.7.11** TV nhanh (39 TC) `[need: R6.6.2 ≥6 phiên + R6.4.D3 UI route — cùng cascade D3 UI defer FE]`
  - **Cần có:** R6.6.2 ⏳ + R6.4.D3 ⚠️
- 🟢 **R6.7.12** Chi trả (30 TC) `[~0% — 100 record sẵn, 30 TC negative/perm/edge chưa run]`

#### Ngày 5
- ⏳ **R6.7.13** Báo cáo (38 TC) `[need: ≥1 BC/upstream module ready cho 4/4 nguồn (HD/VV/TVCS/CT/Đào tạo). Hiện chỉ HD ✅ + VV ✅ → 4-5/38 BC ready (~12% scope). Thiếu TVCS A5 ⚠️ + CT GĐ2 R6.6.5 ⏳ + Đào tạo B7 🚫]`
- ⚠️ **R6.7.14** HĐ tư vấn (UC163, sub-resource v2.1) `[~55% — Path 1 OK + BE validate đúng + Permission OK; FE bug + thiếu FK link]`
  - **Kết quả:** PASS-WITH-NOTE 5/9. Path 1 OK, ERR-HDTV-03 BE đúng. 4 bug Active. [workflow-test-report-HopDongTuVan.md](../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HopDongTuVan.md)
  - **Bug:** [bug-report-flow-hop-dong.md](../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-hop-dong.md) — 0/4 đóng (3 Major + 1 Medium)
- ⏳ **R6.7.15** CT HTPLDN (42 TC) `[need: R6.6.4 ✅ → unblock 1 phần; R6.6.5 ⏳ vẫn chờ. 3 CT đa state HOAN_THANH/DU_THAO/HUY sẵn để test]`
  - **Cần có:** R6.6.4 ✅ + R6.6.5 ⏳
- ⏳ **R6.7.16** API kết nối (42 TC) `[need: data upstream state cuối từ HD/VV/TVCS/Chi trả/CT HTPLDN/TV nhanh + 8 API inbound mock LGSP/DVC/Cổng PLQG]`
- ⚠️ **R6.7.17** Edge BR-EC-01..23 (4 BR scope Phase 7) `[~17% — 4 PASS (BR-EC-12 + 3 gián tiếp), 19 chờ infra/wait/integration]`
  - **Kết quả:** PASS 4 (BR-EC-12 pagination strict, BR-EC-08/18/19 gián tiếp). 0 bug. [functional-test-report-Edge-BR-EC.md](../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-Edge-BR-EC.md)

### 🟥 Trụ E — Theo dõi unblock (xuyên suốt R6, không gate)

- ✅ **R6.E1** HĐ tư vấn (FR-X3-01) — sub-resource trong VV/TVV detail, không phải module riêng. URL `/hop-dong-tu-van/danh-sach` 404 đúng spec v2.1. Test scope chuyển R6.7.14.
- ✅ **R6.E2** CT HTPLDN GĐ1 (FR-15) — 3 CT data tồn tại sau R6.6.4 PASS 2026-05-05 (CT-001 Hoàn thành, CT-002 Dự thảo, CT-003 Đã hủy). Module data=0 → ≥3.
- ✅ **R6.E3** Chi trả (FR-06) — 100 record HSCT000001..100 sẵn (3 states), verified 2026-05-04. Unblock R6.6.1 + R6.7.12.
- ⏳ **R6.E4** TV nhanh (FR-13.A) `[need: ≥1 phiên TV nhanh tồn tại. Menu render OK 2026-05-04 nhưng data=0. Dep R6.6.2 ⏳ block (D3 UI defer FE) + R6.6.3 ⏳ (Cổng PLQG external)]`

---

## Round 7 — PENDING (apply 3 SRS update từ srs-update-2026-5-5/)

> **Trigger điều kiện:** Round 6 close (74/74 task khớp) + dev đã triển khai 3 SRS update (FR-04 NHT/TVV/TCTV, FR-07 DN self-reg, FR-10 mở rộng).
> **Tham chiếu delta:** [`_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md) · [`_DELTA-MAP-FR07.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md) · [`_DELTA-MAP-FR10.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md)
> **Run order strict:** P0 verify → P1 NGAY_LE → **P2 FR-10 nền tảng (TK + kích hoạt)** → P3 FR-04 + P4 FR-07 → P5 8 module nhóm B → P6 nhóm C/D smoke → P7 tech debt
> **Lý do thứ tự:** FR-VIII-22 (self-reg DN) + FR-VIII-26 (kích hoạt TK lần đầu) là nền tảng cho TVV/NHT/DN. KHÔNG run P3/P4 trước khi P2 PASS.

### R7 Phase 0 — Pre-test verify (gate)

- ✅ **R7.0.0** Verify scenario reset DB + deploy status (DONE 2026-05-06)
  - **Kết quả:** Scenario MIX — partial reset + partial deploy 10/18. [plan-r7-trigger.md](plan-r7-trigger.md)
- ⏳ **R7.0.0.1** Log 8 bug deploy gap (UI sub-menu NHT/TCTV/Đào tạo + tab Ngày lễ + filter Địa bàn + tab Chờ kích hoạt + entity NGUOI_HO_TRO/HOC_VIEN) `[need: gửi dev fix song song chạy P1+P2 — chi tiết plan-r7-trigger.md §5]`
- ⏳ **R7.0.0.2** API direct seed workaround UI gap (NGAY_LE + TC TV qua POST API) `[need: R7.0.0.1 ✅ — bug log xong; QTHT login + Authorization Bearer token]`
- ⏳ **R7.0.1** Verify BE deploy 3 SRS update — endpoint mới FR-VIII-22/26/28/29 + FR-IV-NHT/NEW available `[need: R7.0.0 ✅ + dev confirm version tag SRS update 2026-05-05 đã merge production]`
- ⏳ **R7.0.2** Verify UI render menu mới — "Tư vấn viên / Chuyên gia" + sub-menu NHT + sub-menu Tổ chức tư vấn `[need: R7.0.1 ✅]`
- ⏳ **R7.0.3** Verify users.csv có account `nht_01..03` + `qtht_01` login OK + 1 DN test (chưa active) `[need: R7.0.1 ✅]`
- ⏳ **R7.0.5** Re-evaluate 9 R6 task liên quan SRS update + dev fix — re-test/unblock/obsolete `[need: R7.0.0 ✅ scenario xác định + BE deploy xong; 5 task SRS impact: R6.5.1 (KPI-07 NHT tách → count giảm), R6.5.3 (SLA NGAY_LE), R6.7.2 CG/TVV (31 TC enum loai_tvv đổi), R6.7.4 DN (8 TC flow tạo đổi), R6.4.A1.5 (PC TVV — dropdown đổi); 4 task dev fix kèm: R6.4.B2/B2.5/B7 (SM-CTDT mới giải quyết spec contradiction — UNBLOCK), R6.4.D2 (FR-08 phân công/chấm điểm — dev fix bug), R6.4.D3 (Kho QA — dev fix bug). Output: mark retest-needed-R7 / unblocked-by-SRS / obsoleted-by-SRS]`
- ⏳ **R7.0.6** Verify 3 cross-cutting changes (hard delete + bỏ ClamAV + bỏ lưu nháp) `[need: R7.0.0 ✅; BA confirm scope item 9/10/11 trước test — đặc biệt item 11 lưu nháp hẹp/rộng (xem _DELTA-MAP-CROSS-CUTTING.md); chạy negative TC verify is_deleted=1 → fail (HARD), upload file độc → BE behavior, draft state behavior]`

### R7 Phase 1 — Tier 0 seed (NGAY_LE)

- ⏳ **R7.1.1** Seed 5 ngày lễ 2026 qua FR-VIII-29 (QTHT only) `[need: R7.0.2 ✅ + QTHT login OK; nguồn data seed-fixture.yaml > ngay_le_variants]`

### R7 Phase 2 — FR-10 nền tảng (CRITICAL — gate cho P3/P4)

- ⏳ **R7.2.1** Test FR-VIII-22 self-reg DN — 22 trường happy path + edge (MST trùng, email trùng, MK yếu) `[need: R7.0.2 ✅; trigger BA câu 9 — DN không email vào hệ thống bằng cách nào]`
- ⏳ **R7.2.2** Test FR-VIII-26 quên MK / kích hoạt TK lần đầu — workflow 14 bước (DN/NHT/TVV) `[need: R7.2.1 ✅ — cần TK ở CHO_KICH_HOAT để test kích hoạt]`
- ⏳ **R7.2.3** Test FR-VIII-28 nhật ký hệ thống — filter + xuất Excel max 10k dòng `[need: R7.0.1 ✅]`
- ⏳ **R7.2.4** Test FR-VIII-29 quản lý ngày lễ — CRUD QTHT + import Excel + verify SLA trừ ngày lễ (BR-CALC-03) `[need: R7.1.1 ✅; trigger BA câu 11 — danh sách ngày lễ 2026 chính thức]`

### R7 Phase 3 — FR-04 NHT/TVV/TCTV

- ⏳ **R7.3.1** Test FR-IV-NHT-01 Quản lý NHT — CRUD + workflow kích hoạt SM-NHT 4 state `[need: R7.2.2 ✅ — FR-VIII-26 kích hoạt TK hoạt động]`
- ⏳ **R7.3.2** Test FR-IV-NEW-01 Quản lý TC TV — CRUD entry state MOI_DANG_KY (6 variant) `[need: R7.0.2 ✅; nguồn seed-fixture.yaml > to_chuc_tu_van_variants]`
- ⏳ **R7.3.3** Test FR-IV-NEW-04 Phê duyệt TC TV — workflow CB PD cùng cấp BR-AUTH-05 `[need: R7.3.2 ✅ — TC TV ở CHO_PHE_DUYET]`
- ⏳ **R7.3.4** Test FR-IV-13 Tiếp nhận TVV — 3 transition (MOI_DANG_KY→CHO_THAM_DINH, YEU_CAU_BO_SUNG→DANG_THAM_DINH, TU_CHOI→CHO_THAM_DINH) `[need: R7.0.2 ✅; trigger BA câu 3 — migration record cũ loai_tvv='NHT']`

### R7 Phase 4 — FR-07 DN

- ⏳ **R7.4.1** SCR-V.III-01 — verify BỎ button [Thêm mới] + [Import Excel] `[need: R7.0.2 ✅]`
- ⏳ **R7.4.2** SCR-V.III-02 — verify chỉ xem/sửa/xóa, KHÔNG có chế độ tạo mới `[need: R7.0.2 ✅; trigger BA câu 6 — migration DN cũ tạo bằng CB NV]`

### R7 Phase 5 — 8 module nhóm B DELTA (regression light)

- ⏳ **R7.5.1** FR-05 VV — dropdown phân công NHT mới (UC59 SCR-V.I-03), FK `nguoi_ho_tro_id` đổi target sang NGUOI_HO_TRO `[need: R7.3.1 ✅]`
- ⏳ **R7.5.2** FR-12 TV CS — dropdown CG (loai_tvv enum bỏ NHT), thang điểm 1-5 `[need: R7.0.1 ✅]`
- ⏳ **R7.5.3** FR-14 HĐ TV — enum `loai_tvv` ERD bỏ `'NHT'`, FK tu_van_vien_id `[need: R7.0.1 ✅]`
- ⏳ **R7.5.4** FR-11 Báo cáo — verify BỎ filter `dia_ban_id` (TVV scope toàn quốc) `[need: R7.0.1 ✅]`
- ⏳ **R7.5.5** FR-09 Biểu mẫu — FK `tu_van_vien_id` trong cấu hình mẫu HĐ `[need: R7.0.1 ✅]`
- ⏳ **R7.5.6** FR-02 Hỏi đáp — dropdown phân công NHT/TVV/CB tách 2 entity riêng `[need: R7.3.1 ✅]`
- ⏳ **R7.5.7** FR-03 Đào tạo — NHT là tác nhân phụ (đăng ký KH + đề xuất ĐT) `[need: R7.3.1 ✅]`
- ⏳ **R7.5.8** FR-08 ĐG + FR-06 Chi trả + FR-16 API — verify enum `loai_tvv` ERD `[need: R7.0.1 ✅]`

### R7 Phase 6 — Nhóm C/D smoke

- ⏳ **R7.6.1** FR-01 Dashboard — KPI-07 đếm CG/TVV (verify count GIẢM vì NHT tách entity, KHÔNG còn trong TU_VAN_VIEN) `[need: R7.3.1 ✅]`
- ⏳ **R7.6.2** Smoke 3 module D (FR-13 TV nhanh + FR-15 CT HTPLDN + FR-07 DN nội bộ) — 5 phút verify login + render `[need: R7.0.2 ✅]`

### R7 Phase 7 — Tech debt + cleanup

- ⏳ **R7.7.1** Fix YAML legacy `seed-fixture.yaml` — outdent `cap_tai_khoan_cg_nht_r5` + `cap_tai_khoan_prereq` từ indent 2 → 0 + add CI check pyyaml.safe_load `[need: pre-existing error line 1094, verified 2026-05-05; ưu tiên trước khi auto-seed script]`
- ⏳ **R7.7.2** Hỏi BA confirm 4 open issues trước khi run test (câu 3/6/9/11) — link delta-map ở từng task R7.2-R7.4 `[need: gửi message cho BA, chờ feedback]`

### 🔓 Gate condition: 4 open issues BA cần confirm

- ⏳ **R7.G3** Câu 3 — Migration record cũ `loai_tvv = 'NHT'` trong DB chuyển sang entity NGUOI_HO_TRO ra sao? `[need: BA + dev quyết migration script; trigger ở R7.3.4]`
- ⏳ **R7.G6** Câu 6 — Migration DN cũ tạo bằng CB NV → có cần convert TK-first không? `[need: BA + dev quyết; trigger ở R7.4.2]`
- ⏳ **R7.G9** Câu 9 — DN không email/chưa ĐKKD vào hệ thống bằng cách nào? `[need: BA quyết edge case fallback; trigger ở R7.2.1]`
- ⏳ **R7.G11** Câu 11 — NGAY_LE seed danh sách 2026 — BA cấp file Excel chính thức? `[need: BA cấp file hoặc xác nhận QA seed manually 5 ngày lễ trong fixture]`

---

# 📚 Round 5 — FROZEN reference

> Toàn bộ task list R1-R10 + Postmortem + Module bị block + Bug đã đóng đã được tách sang file riêng (425 dòng) để giữ todo.md gọn cho Round 6 active.
>
> **File R5 frozen:** [`output/qa-reports/round5-2026-04-26/todo-round5-frozen.md`](../output/qa-reports/round5-2026-04-26/todo-round5-frozen.md)
>
> Mở file đó khi cần tham khảo:
> - Lịch sử bug 5 tuần dev iterate (10 bug closed pattern + dev fix sai cách thường gặp).
> - Cách seed Tier 0/1/2 cho 14 entity (đã verify pre-eval).
> - Postmortem 5 gap acceptance (T1.B3 split CG/TVV/NHT, MAU_PHAN_HOI, lý do TC/BS, học viên, ĐG viên).
> - Lessons learned phương án triệt để: seed acceptance theo dropdown filter, không theo count.
