# TODO — QA PM HTPLDN (Round 5 frozen + Round 6 active)

**Plan:** [plan.md](../plan.md) v2.5 · **Overview:** [system-overview.md](../system-overview.md) · **R5 Permission Plan:** [round5/plan.md](round5/plan.md) · **R6 Post-reset README:** [`output/qa-reports/round6-2026-05-01-postreset/README.md`](../../output/qa-reports/round6-2026-05-01-postreset/README.md)
**Window:** TBD · **Today:** 2026-05-03 (R14 Wave 1 — A5 B2 6/6 LV PASS; D1 PASS; D2 🚫 5 bug FE; D3 ⚠️ partial; R6.3.10 GV PASS 8/8; B3-B11 chờ dev fix FK + button [Hủy yêu cầu]; R6.7.1 PASS 9/12 + 3 PARTIAL; R6.7.2 ⚠️ 5 PASS + 2 BUG perm Critical/Major + 6 defer; R6.7.3 ⚠️ 11/12 PASS + 1 FAIL VV-013d Major TVV bypass; R6.7.4 ✅ 7/8 PASS + 1 PARTIAL DN-007 guard UX gap)

> 🔄 **DEV RESET DB 2026-05-01:** Toàn bộ data R1-R10 (Round 5) mất.
> - **Round 5 (R1-R10):** FROZEN — section "Tiến độ Round 5" + chi tiết task dưới đây giữ nguyên làm reference (lịch sử bug 5 tuần dev iterate, lessons learned). KHÔNG động status pre-reset.
> - **Round 6 (R11+):** ACTIVE — re-seed toàn bộ + test workflow. Theo dõi tiến độ ở section **"Tiến độ Round 6"** ngay dưới. Hướng dẫn 7 phase + account map: [R6 README](../../output/qa-reports/round6-2026-05-01-postreset/README.md). Phase 6+7 thêm 2026-05-02 mapping R5 P3/P4 (workflow đầu ra + functional 17 module).

**Icon trạng thái:** ✅ xong · 🟢 sẵn sàng · 🔵 đang làm · ⏳ chờ data · ⚠️ partial · 🚫 block

**Fixture v2.6.2:** [`input/data/seed-fixture.yaml`](../../input/data/seed-fixture.yaml) — bổ sung `cap_tai_khoan_cg_nht_r5` (9 cặp account-profile CG/NHT) + `dn_variants_dp_extension` (3 DN cấp ĐP-AG/BG/BNI).

---

## Tiến độ Round 6 (ACTIVE — post-reset)

| Phase | Việc | Tổng | ✅ | 🟢 | 🔵 | ⚠️ | 🚫 | ⏳ | Time est |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| 0 | Tiền điều kiện (app + MailHog + QTHT login) | 4 | 4 | - | - | - | - | - | 5' |
| 1 | Tier 0 prerequisite (LV/loại DN/đơn vị/SLA/MPH) | 5 | 4 | - | - | 1 | - | - | ~30' |
| 2 | Tier 1 actor (DN/TVV-CG-NHT/account/CAU_HINH_PC Đợt 1 + R6.2.7-TW backfill) | 10 | 10 | - | - | - | - | - | ~45' |
| 3 | Tier 2 transactional entry state (R6.3.6 moved → P4.B2.5) | 10 | 10 | - | - | - | - | - | ~60' |
| 4 | Workflow E2E (11 trụ + R6.4.A1.5 + R6.4.A1-CG + R6.4.B2.5 moved here) | 14 | 7 | - | - | 3 | 3 | 1 | ~3h |
| 5 | Verification (KPI + cross-module + audit) | 5 | - | - | - | - | - | 5 | ~30' |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TV nhanh/CT HTPLDN GĐ1+GĐ2) | 5 | - | - | - | - | 3 | 2 | ~1 tuần |
| 7 | Functional 17 module (T4.1-T4.17 negative + edge + 40 TC perm) | 17 | 3 | 1 | - | 3 | 7 | 3 | ~1 tuần |
| Trụ E | Monitor unblock (xuyên suốt R6, không gate) | 4 | - | 4 | - | - | - | - | daily |
| **Tổng Round 6** | | **74** | **38** | **5** | **0** | **7** | **13** | **11** | **~2 tuần + 6h** |

**Icon column meaning:** ✅ xong · 🟢 sẵn sàng làm · 🔵 đang làm · ⚠️ partial · 🚫 block · ⏳ chờ upstream

---

## Round 6 — Active task tracker

> Hướng dẫn chi tiết 7 phase + account map: [R6 README](../../output/qa-reports/round6-2026-05-01-postreset/README.md). Spec data: [`seed-fixture.yaml v2.6.2`](../../input/data/seed-fixture.yaml).

### Phase 0 — Tiền điều kiện

- ✅ **R6.0.1** App + BE up — HTTP 200 verified 2026-05-01 16:00
- ✅ **R6.0.2** MailHog up — HTTP 200 verified 2026-05-01 16:00
- ✅ **R6.0.3** QTHT login OK — `qtht_01/Secret@123/OTP 666666` PASS 2026-05-01 16:05 (dev đã reset password sau R10)
- ✅ **R6.0.4** SCR-VIII-02 button [Thêm mới] visible (uid 5_27), 34 TK pre-existing

### Phase 1 — Tier 0 prerequisite (qtht_01)

- ✅ **R6.1.1** DM LINH_VUC_PL — 6/6 fixture cover (5 pre-existing + seed HOP_DONG) → 13 records. [seed-checklist-QTHT.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-QTHT.md)
- ✅ **R6.1.2** DM LOAI_DN — seed 4 mới TNHH/CP/DNTN/HKD (existing 3 quy mô giữ) → 7 records
- ✅ **R6.1.3** DON_VI — 7 đơn vị pre-existing (TW + 3 BN + AG/BG/BNI). Convention app khác fixture (AG/BG/BNI thay HN/HP/DN) — adapt downstream
- ✅ **R6.1.4** SLA — 4 pre-existing match fixture (HOI_DAP 10d, HO_SO_HT 15d, HO_SO_TT 10d, VU_VIEC 10d, hệ số 2.0)
- ⚠️ **R6.1.5** MAU_PHAN_HOI `[~0% — UI thiếu nút Thêm mới, log BUG-FUNC-MPH-001 Major, đợi dev fix]` — [bug-report-seed-qtht.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-qtht.md)
- ~~**R6.1.6** Seed 12 lý do từ chối/bổ sung~~ — REMOVED 2026-05-01: fixture extension non-SRS, app dùng textarea inline khi từ chối. Đã xóa `danh_muc_ly_do_variants` khỏi seed-fixture.yaml

### Phase 2 — Tier 1 actor

#### 2A — Doanh nghiệp
- ✅ **R6.2.1** DN cấp TW — 50 pre-existing + 12 fixture v2.6.2 (Alpha..Mu, MST checksum-valid)
  - **Kết quả:** PASS 12/12 fixture seed via API. Cross-combo 3/9 → 7/9 (miss NHO/VUA × NONG_LAM). [bug-report-fixture-seed-dn.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md)
  - **Bug:** [bug-report-fixture-seed-dn.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-fixture-seed-dn.md) — 0/4 đóng (JWT Critical, DM polluted Major, Search Major, API schema Medium)
- ✅ **R6.2.2** DN cấp ĐP — Epsilon/Zeta/Lambda DP-DN + Iota/Kappa DP-HP
  - **Kết quả:** PASS 5/5 ĐP (DP-DN ×3, DP-HP ×2 trong fixture v2.6.2). DN000002 BG pre-existing verified.
- ✅ **R6.2.3** DN extension AG/BG/BNI — seed 3 fixture variants 13/14/15
  - **Kết quả:** PASS 3/3 — DN-AGG-0001 + DN-BGG-0001 + DN-BNH-0001. Variant 14/15 đổi enum `CO_PHAN/TU_NHAN` → `CP/DNTN` khớp DM seed.

#### 2B — TVV/CG/NHT profile
- ✅ **R6.2.4** TVV TW
  - **Kết quả:** PASS 6/6 saved (TW-0001..0006) state MOI_DANG_KY. Advance state là R6.4.A1.
  - **Bug:** [bug-report-seed-tvv.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-tvv.md) — 2/2 đóng (TVV-001/002 CLOSED 2026-05-01 19:20)
- ✅ **R6.2.5** Seed 6 CG TW (TVV-BTP-TW-0007..0014 sau audit R12) `loai_tvv=CG`
  - **Kết quả:** Audit R12 — chỉ 5/6 visible (TVV-0008 missing). Seed bù 2 CG R12 (TVV-0013 LĐ, TVV-0014 Thuế) cover 6/6 LV. UUID: 2ff3bb8d/8454f7db/7727ddd7/45659b43/4caa5898/a0c6199e.
- ✅ **R6.2.6** Seed 3 NHT ĐP — PASS 3/3 ngày 2026-05-01 19:55
  - **Kết quả:** PASS 3/3. NHT-AG `a91f543b` qua cb_nv_dp_01, NHT-BG `6b572b9a` qua _02, NHT-BNI `f0da6c6d` qua _03. State Mới đăng ký. [workflow-test-report-VuViec.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)

#### 2C — Account login + FK link (CRITICAL — fix gap A5/A3)
- ✅ **R6.2.7** QTHT tạo 9 account login: 6 `cg_tw_01..06` + 3 `nht_ag_01`/`nht_dn_01`/`nht_hp_01`
  - **Kết quả:** PASS 9/9. Tất cả state "Chờ kích hoạt", cần activate. [seed-checklist-account.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-account.md)
- ✅ **R6.2.8** Activate 9 accounts + verify FK link — PASS 2026-05-01 20:00
  - **Kết quả:** PASS 9/9 active. nht_ag_01 login + role NHT + VV access OK. [workflow-test-report-VuViec.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.2.7-TW** QTHT tạo 6 TK TVV TW + link FK
  - **Kết quả:** PASS 6/6 TK `tvv_tw_01..06` (vai trò NHT) + FK link entity TVV-BTP-TW-0001..06. Unblock A3 R8 E2E PASS. [users.csv +6 row](../../input/users.csv)

#### 2D — Cấu hình phân công Đợt 1 CB-only (Đợt 2 TVV ở Phase 4 R6.4.A1.5)
- ✅ **R6.2.9a** Đợt 1 — 6 cấu hình PC CB-only (mỗi LV → cb_nv_tw_01)
  - **Kết quả:** PASS 6/6. R1 LĐ/Thuế/HĐ saved, R2 KDTM/ĐĐ/HNGĐ saved sau BE recover. [seed-checklist-cau-hinh-PC.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-cau-hinh-PC.md)

### Phase 3 — Tier 2 transactional entry state (cb_nv_tw_01)

- ✅ **R6.3.1** Seed 6 Hỏi đáp entry `MOI`
  - **Kết quả:** PASS 6/6 `HD-20260501-001..006` cover 6 LV (LĐ/Thuế/HĐ/DN/SHTT/ĐĐ) × 4 kênh (Trực tiếp/DVC/Cổng PLQG/Hệ thống khác). [r6-3-1-hd-6of6-moi.png](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-1-hd-6of6-moi.png)
- ✅ **R6.3.2** Seed 8 Vụ việc entry `DA_TIEP_NHAN` — PASS via pre-existing 2026-05-01
  - **Kết quả:** PASS pre-existing 100 VV. ≥4 ở "Đã tiếp nhận" page 1 (VV000008/012/016/020). [workflow-test-report-VuViec.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.3.3** Seed 6 TVCS entry `TIEP_NHAN`
  - **Kết quả:** PASS 6/6 `TVCS-20260501-0001..0006` cover 6 LV (DN/HĐ/LĐ/Thuế/SHTT/ĐĐ). [r6-3-3-tvcs-6of6-tiep-nhan.png](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-3-tvcs-6of6-tiep-nhan.png)
- ✅ **R6.3.4** Seed 10 HSPL DN cover 5 loại × 3 state × 5 DN (per-filter)
  - **Kết quả:** PASS 10/10. R12 thêm 4 record `HSPL-20260503-0001..0004`. Per-filter HIEU_LUC=8 + HET_HAN=1 + THU_HOI=1 + KHAC=1 + 5 DN. [DN001](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn001-6-hieu-luc.png) [DN003](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn003-het-han.png) [DN005](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn005-thu-hoi.png) [DN008](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn008-quyet-dinh-hieu-luc.png) [DN010](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-4-hspl-dn010-khac-hieu-luc.png)
- ✅ **R6.3.5** Seed 6 CTĐT entry `Dự thảo`
  - **Kết quả:** PASS 6/6 `CTDT-BTP-TW-2026-0001..0006` cover 6 LV (DN/LĐ/SHTT/ĐĐ/Thuế/HĐ). [r6-3-5-ctdt-list-6du-thao.png](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-5-ctdt-list-6du-thao.png)
- ✅ **R6.3.7** Seed 4 thư mục + 7 biểu mẫu entry `Nháp`
  - **Kết quả:** PASS 4 thư mục + 7/7 BM `BM-20260501-001..007` (6 docx + 1 xlsx). File dummy OOXML accept BE. [r6-3-7-bieumau-list-7nhap.png](../../output/qa-reports/round6-2026-05-01-postreset/screenshots/r6-3-7-bieumau-list-7nhap.png)
- ✅ **R6.3.8a** Seed 10 NHCH (Ngân hàng câu hỏi) entry `Nháp`
  - **Kết quả:** PASS 10/10. Per-filter ✅ (DE 4, TB 3, KHO 3, TN 6, TL 4). Bổ sung 4 record (idx 6/8/9/10) qua API. [seed-checklist-NHCH.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-NHCH.md)
- ✅ **R6.3.8b** Seed 5 ĐKT (Đề kiểm tra) entry `Nháp`
  - **Kết quả:** PASS 5/5 cover 5 LV (DN/SHTT/LĐ/HĐ/ĐĐ). Toàn bộ THU_CONG. NGAU_NHIEN block do BE filter NHCH `trangThai=CONG_KHAI` — cần R6.4.B5b publish trước. [seed-checklist-DKT.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DKT.md)
- ✅ **R6.3.9** Seed 8 Bài giảng entry `Kích hoạt`
  - **Kết quả:** PASS 8/8 sau dev fix BE 422. 4 Slide + 1 PDF + 3 Video, 4/6 LV (DN/SHTT FE thiếu). [seed-checklist-baigiang.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-baigiang.md)
  - **Bug:** [bug-report-seed-baigiang.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-seed-baigiang.md) — 1/1 đóng (BUG-FUNC-BAIGIANG-001 CLOSED 2026-05-02 R6)
- ✅ **R6.3.10** Seed 8 Giảng viên entry `Đang hoạt động`
  - **Kết quả:** PASS 8/8 `GV-BTP-TW-0001..0008` cover 6 LV + 6 GV/2 TG. Áp dụng decision §3.4.3.25 (3 enum, default DANG_HOAT_DONG). [seed-checklist-GiangVien.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-GiangVien.md)

### Phase 4 — Workflow E2E (multi-role)

#### 🟦 Trụ A — TVV → PC → VV → HD → TVCS
- ✅ **R6.4.A1** A1 Workflow TVV (12 bước) — cb_nv_tw_01 → cb_pd_tw_01
  - **Kết quả:** PASS 10/10 CMS-scope. B7+B8 (FR-IV-11) ngoài scope — qua Portal chuyên trang. [workflow-test-report-TVV.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVV.md)
- ⚠️ **R6.4.A1.5** Đợt 2 PC TVV backfill `[~50% — 6 cg_tw mapping POST OK, BE limit save HD]`
  - **Kết quả:** PARTIAL. BE reject NHT (ERR-CH-03) + hardcode loaiYeuCau=HOI_DAP. Pivot 6 cg_tw_xx mapping → saved như HD config. 2 BE bug escalate. [bug-report-flow-vuviec.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-vuviec.md)
- ✅ **R6.4.A1-CG** Advance state 6 CG (TVV-0009..0014) → DANG_HOAT_DONG
  - **Kết quả:** PASS 6/6 CG (4 + 2 bonus seed LĐ/Thuế). Pool 12/12. Cover 6/6 LV. [workflow-test-report-CG.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CG.md)
- ✅ **R6.4.A3** A3 Workflow Vụ việc
  - **Kết quả:** PASS 12/12 CMS DB (R8 happy 7/12 + R9 reject/edge 5/12). 6/18 out scope CMS. [workflow-test-report-VuViec.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md)
- ✅ **R6.4.A4** A4 Workflow Hỏi đáp — cb_nv_tw_01 → cb_pd_tw_01
  - **Kết quả:** PASS 11/11 transition R11. ERR-PH-01 + BR-FLOW-01 + BR-FLOW-04 + push Cổng PLQG verified. [workflow-test-report-HoiDap.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-HoiDap.md)
- ⚠️ **R6.4.A5** A5 Workflow TVCS `[~18% — 2/11 PASS (B2 cover 6/6 LV) + 1 FAIL UI + 6 BLOCKED data setup gap + 2 external; chờ dev script FK + fix TVCS-002]`
  - **Kết quả:** R14 PARTIAL — B1+B2 PASS 6/6 LV (R14 thêm HĐ/SHTT/ĐĐ), B10 FAIL UI giữ, B3/B4/B6/B11 BLOCKED FK. [workflow-test-report-TVCS.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-TVCS.md)
  - **Bug:** [bug-report-flow-tvcs.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-tvcs.md) — 1 Open (TVCS-002 Major), 1 Closed (TVCS-001). Obs: [observations-flow-tvcs.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/observations-flow-tvcs.md).

#### 🟩 Trụ B — Đào tạo
- 🚫 **R6.4.B2** B2 Đẩy CTĐT → `Đã duyệt` `[block: spec contradiction — BE chặn submit CTĐT chưa có KH ↔ SRS line 599 dropdown CTĐT cha của KH chỉ DA_DUYET. Cần BA quyết định relax bên nào]`
  - **Kết quả:** R11 BLOCK 0/2 transition. 6/6 CTĐT stuck DU_THAO. Log BUG-FUNC-CTDT-001 Critical. [workflow-test-report-CTDT.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-CTDT.md)
  - **Bug:** [bug-report-flow-ctdt.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-ctdt.md) — 0/1 đóng (Critical Open)
- 🚫 **R6.4.B2.5** Seed 8 Khóa học entry `Dự thảo` (was R6.3.6) `[block: cùng deadlock với B2 — UI form Tạo KH dropdown CTĐT cha = 0 options vì 0 CTĐT DA_DUYET. Cần BA confirm spec contradiction]`
  - **Kết quả:** 🚫 block — cascade từ B2 spec contradiction. Verify R12 dropdown empty.
- ✅ **R6.4.B5b** B5b Publish NHCH `Nháp → Công khai`
  - **Kết quả:** PASS 11/11. Per-filter ✅ (DE 4 / TB 3 / KHO 3 / TN1 6 / TL 4). NGAU_NHIEN ĐKT R6.3.8b unblock. [workflow-test-report-NHCH-publish.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-NHCH-publish.md)
- ⏳ **R6.4.B7** B7 Workflow Khóa học (10 bước) `[need: ≥1 KH state DU_THAO sau R6.4.B2.5 🚫 cascade + BA confirm vai trò "học viên". Dep "≥3 học viên active" ĐÃ BỎ — học viên chỉ cần khi KH DANG_DIEN_RA per SRS line 604]`

#### 🟨 Trụ C — Biểu mẫu
- ✅ **R6.4.C1** C1 Workflow Biểu mẫu `Nháp → Công khai → Ẩn`
  - **Kết quả:** PASS 3/3 transition SM-BIEUMAU. Sample thư mục "Biểu mẫu Doanh nghiệp" cover NHAP→CK→AN→CK re-publish. Sync "Đã đồng bộ" verified. [workflow-test-report-BieuMau.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-BieuMau.md)

#### 🟧 Trụ D — Đánh giá HQ
- ✅ **R6.4.D1** D1 Tạo kỳ Đánh giá HQ entry `Lập kế hoạch`
  - **Kết quả:** PASS 1/1. `DG-20260502-0001` state Lập kế hoạch. Tần suất Sơ bộ 6 tháng × Tổng hợp. Unblock D2. [seed-checklist-DanhGiaHQ.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-DanhGiaHQ.md)
- 🚫 **R6.4.D2** D2 Workflow Đánh giá HQ (11 bước) `[block: 5 bug FE chặn từ B1 — form Tạo thiếu trường tiêu chí + tab Tiêu chí không có nút thêm + 3 dropdown phân công 404/empty]`
  - **Kết quả:** R14 BLOCKED 1/11 PASS B1. Back-fill tiêu chí FAIL + B2-B11 cascade. Tạo `DG-20260502-0002` test seed. [workflow-test-report-DanhGiaHQ.md](../../output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-DanhGiaHQ.md)
  - **Bug:** [bug-report-flow-danhgia.md](../../output/qa-reports/round6-2026-05-01-postreset/bug-reports/bug-report-flow-danhgia.md) — 0/5 đóng (3 Critical + 2 Major)
- ⚠️ **R6.4.D3** D3 Tạo Kho QA + verify auto-feed `Tự động` `[~50% — re-verify R14 không đổi: THU_CONG OK, auto-feed TU_DONG=0, UI route thiếu]`
  - **Kết quả:** PARTIAL R14 re-verify cùng status: THU_CONG `QA-20260502-0001` còn, TU_DONG total=0, UI route vẫn thiếu submenu. [seed-checklist-KhoQA.md](../../output/qa-reports/round6-2026-05-01-postreset/seed/seed-checklist-KhoQA.md)

### Phase 5 — Verification

- ⏳ **R6.5.1** Dashboard KPI counter > 0 cho HD/VV/TVCS/CT `[need: ≥1 record state cuối mỗi module — HD ✅ A4, VV ⏳ A3, TVCS ⏳ A5, CT ⏳ B2]`
- ⏳ **R6.5.2** Cross-module link DN: Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả ≥1 record/tab `[need: DN000001 ≥1 HSPL ✅ R6.3.4 + ≥1 KPI từ A3 + ≥1 Chi trả từ E3]`
- ⏳ **R6.5.3** SLA cảnh báo banner hiện khi HD/VV quá hạn `[need: ≥1 HD/VV deadline qua 70-90% — phải tạo record với ngày tạo cũ]`
- ⏳ **R6.5.4** BC04 export Excel có data `[need: ≥1 HD CONG_KHAI ✅ A4 + ≥1 VV HOAN_THANH ⏳ A3]`
- ⏳ **R6.5.5** Audit log ≥100 entry `[need: ≥100 entry trong AUDIT_LOG — accumulate qua Phase 4]`

### Phase 6 — Workflow đầu ra hậu kỳ (mapping R5 P3)

> Chạy sau Phase 4 workflow E2E + Trụ E unblock. Cascade-block khi upstream chưa state cuối. Mapping R5 P3.1-P3.4 — xem chi tiết kế hoạch trong [`plan.md` §1.3 P3](../plan.md).

- 🚫 **R6.6.1** Workflow Chi trả (P3.1, 13 bước — [02-thu-tu-module.md §⑪](../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713)) `[block: cần ≥6 VV HOAN_THANH ✅ A3 + R6.E3 ≥1 record CHI_TRA source=LGSP — hiện E3 monitor 0 record]`
  - **Cần có sẵn:** R6.4.A3 ✅ (12 VV CMS, có HOAN_THANH) + R6.E3 🟢 ❌ (chờ LGSP)
  - **Output dự kiến:** 6 Chi trả `Đã thanh toán` cấp cho R6.6.5 + R6.7.12.
- ⏳ **R6.6.2** Workflow TV nhanh nhập tay (P3.2, 5 trạng thái — verify `srs-fr-13-tv-nhanh.md`) `[need: R6.4.D3 auto-feed TU_DONG ≥3 QA (hiện ⚠️ partial total=0) + R6.E4 record từ Cổng PLQG hoặc QA THU_CONG ≥3]`
  - **Cần có sẵn:** R6.4.D3 ⚠️ partial + R6.E4 🟢 monitor
  - **Output dự kiến:** 6 phiên TV nhanh `Kết thúc` + 1 phiên `Hết hạn` auto.
- 🚫 **R6.6.3** Workflow TV nhanh PUBLIC — DN gửi qua Cổng PLQG (1 bước) `[defer: T4.16 test API — phụ thuộc R6.7.16 + R6.E4 unblock]`
  - **Cần có sẵn:** R6.E4 🟢 monitor + R6.7.16 ⏳
- ⏳ **R6.6.4** Workflow CT HTPLDN GĐ1 nhập tay (P3.3, 11 bước — [02-thu-tu-module.md §⑤](../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L328-L342)) `[need: R6.E2 unblock — sidebar hiện submenu + GET /chuong-trinh-htpldns ≥1]`
  - **Cần có sẵn:** R6.E2 🟢 monitor (BE chưa seed module)
  - **Output dự kiến:** ≥1 CT HTPLDN GĐ1 state DANG_THUC_HIEN.
- 🚫 **R6.6.5** Workflow CT HTPLDN GĐ2 Đợt BC (P3.4, 7 bước — [02-thu-tu-module.md §⑭-bis](../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L839-L849)) `[block: cascade R6.6.4 ⏳ + R6.6.1 🚫 — cần CT GĐ1 DANG_THUC_HIEN + ≥6 Chi trả Đã thanh toán + ≥6 VV HOAN_THANH ✅ A3]`
  - **Cần có sẵn:** R6.6.4 ⏳ + R6.6.1 🚫 + R6.4.A3 ✅
  - **Output dự kiến:** Đợt BC tổng hợp ĐP/BN → TW.

### Phase 7 — Functional 17 module (mapping R5 P4)

> Bỏ happy path (đã cover Phase 4 + 6). Test negative + nhánh phụ + edge + 40 TC phân quyền/module. Mapping R5 T4.1-T4.17. Per-module dependency dưới.

#### Ngày 1
- ✅ **R6.7.1** Hỏi đáp (12/36 TC effective Phase 7)
  - **Kết quả:** PASS 11/12 + PARTIAL 1 (HD-022 chờ dev seed DB lùi ngày tiếp nhận cho SAP_HET/QUA_HAN). 0 bug. [functional-test-report-HoiDap.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-HoiDap.md)
  - **Bug:** [bug-report-functional-hoidap.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-hoidap.md) — 0/0 (không bug)
- ⚠️ **R6.7.2** CG/TVV (31 TC) `[~16% — 5/31 PASS, 2 BUG perm Critical/Major, 6 defer cross-module]`
  - **Kết quả:** PASS 5/5 functional + 2 BUG perm Critical/Major + 6 defer cross-module. [functional-test-report-CGTVV.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-CGTVV.md)
  - **Bug:** [bug-report-functional-cgtvv.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-cgtvv.md) — 0/2 đóng (BUG-CGTVV-001 Critical QTHT bypass; BUG-CGTVV-002 Major CG GET 403)
  - **Pool:** TVV-0014 deleted (probe), TVV-0015 reseed PASS — total 67, DANG_HOAT_DONG 12→11 (≥9 OK)
- ⚠️ **R6.7.3** Vụ việc (12/35 TC effective Phase 7) `[~92% — 11/12 PASS, 1 FAIL VV-013d Major]`
  - **Kết quả:** PASS 11/12 + 1 FAIL VV-013d (TVV bypass). 2 obs SLA pre-existing. [functional-test-report-VuViec.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-VuViec.md)
  - **Bug:** [bug-report-functional-vuviec.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/bug-report-functional-vuviec.md) — 0/1 đóng (BUG-VV-001 Major TVV bypass module)

#### Ngày 2
- ✅ **R6.7.4** Doanh nghiệp (8/18 TC effective Phase 7)
  - **Kết quả:** PASS 7/8 + 1 PARTIAL (DN-007 guard UX gap, không có toast). 0 bug. [functional-test-report-DoanhNghiep.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-DoanhNghiep.md)
- 🚫 **R6.7.5** TV chuyên sâu (44 TC) `[block: cascade A5 ⚠️ partial — cần A5 PASS đủ 11 bước; hiện B3-B11 BLOCKED FK]`
  - **Cần có sẵn:** R6.4.A5 ⚠️
- 🚫 **R6.7.6** Khóa học (40 TC) `[block: cascade B7 ⏳ + B2 🚫 + B2.5 🚫 spec contradiction; chờ BA quyết]`
  - **Cần có sẵn:** R6.4.B2 🚫 + R6.4.B2.5 🚫 + R6.4.B7 ⏳

#### Ngày 3
- ⏳ **R6.7.7** Dashboard (34 TC) `[need: ≥3 record state cuối/module VV/TVCS/HD/Chi trả/TV nhanh — accumulate Phase 4-6]`
- ✅ **R6.7.8** Quản trị HT (8/32 TC effective Phase 7)
  - **Kết quả:** PASS 8/8 (QT-010 unique mã + QT-017 14 tab + QT-025/026 audit log + QT-027 SLA + QT-029-032 perm). 0 bug mới. [functional-test-report-QTHT.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-QTHT.md)
- 🚫 **R6.7.9** Đánh giá HQ (40 TC) `[block: cascade R6.4.D2 🚫 — workflow ĐG HQ chặn từ B1 (5 bug FE), không thể test perm/edge cho phần workflow. Negative + permission của riêng tab Lập KH có thể chạy partial khi dev fix tối thiểu BUG-DG-001 (form thiếu tiêu chí)]`
  - **Cần có sẵn:** R6.4.D2 🚫

#### Ngày 4
- ⚠️ **R6.7.10** Biểu mẫu (7/40 TC effective Phase 7) `[~71% — 5/7 PASS, 1 DEFER (BM-026 cần thư mục rỗng), 1 obs UI count]`
  - **Kết quả:** PASS 5/7 (BM-013 required + BM-032/034/035/036 perm + BM-039 LV). DEFER 1 (BM-026). [functional-test-report-BieuMau.md](../../output/qa-reports/round6-2026-05-01-postreset/functional/functional-test-report-BieuMau.md)
  - **Bug obs:** BUG-BM-001 Minor — UI cột "Số biểu mẫu" hiển thị 0 sai (BE đúng, FE display bug)
- 🚫 **R6.7.11** TV nhanh (39 TC) `[block: cascade R6.6.2 ⏳ + R6.4.D3 ⚠️ partial]`
  - **Cần có sẵn:** R6.6.2 ⏳ + R6.4.D3 ⚠️
- 🚫 **R6.7.12** Chi trả (30 TC) `[block: cascade R6.6.1 🚫 — chờ E3 LGSP đẩy record]`
  - **Cần có sẵn:** R6.6.1 🚫

#### Ngày 5
- ⏳ **R6.7.13** Báo cáo (38 TC) `[need: data state cuối từ HD/VV/TVCS/Chi trả/CT HTPLDN — accumulate Phase 4-6]`
- 🚫 **R6.7.14** HĐ tư vấn (29 TC) `[block: cascade R6.E1 — BE chưa seed module HĐTV; submenu/list rỗng]`
  - **Cần có sẵn:** R6.E1 🟢 monitor
- 🚫 **R6.7.15** CT HTPLDN (42 TC) `[block: cascade R6.6.4 ⏳ + R6.6.5 🚫]`
  - **Cần có sẵn:** R6.6.4 ⏳ + R6.6.5 🚫
- ⏳ **R6.7.16** API kết nối (42 TC) `[need: data upstream state cuối từ HD/VV/TVCS/Chi trả/CT HTPLDN/TV nhanh + 8 API inbound mock LGSP/DVC/Cổng PLQG]`
- 🟢 **R6.7.17** Edge BR-EC-01..23 `[full 100% — env + sample data ≥1 entity/module ✅ Phase 3, sẵn sàng làm, không phụ thuộc workflow upstream]`

### 🟥 Trụ E — Theo dõi unblock (xuyên suốt R6, không gate)

- 🟢 **R6.E1** Hợp đồng tư vấn (FR-X3-01) `[need: BE seed module HĐTV → GET /hop-dong-tu-vans ≥1]` — daily curl. **Khi unblock:** seed acceptance phải cover 4 state NHAP/HIEU_LUC/HET_HAN/HUY (fixture 10 variant) — KHÔNG chỉ pick 6 NHAP entry như pattern R6.3.4.
- 🟢 **R6.E2** CT HTPLDN GĐ1 (FR-15) `[need: BE seed module CT HTPLDN GĐ1 → sidebar hiện submenu + GET /chuong-trinh-htpldns ≥1]` — daily MCP click
- 🟢 **R6.E3** Chi trả (FR-06) `[need: LGSP đẩy record → GET /chi-tras ≥1 source=LGSP]` — daily curl
- 🟢 **R6.E4** Phiên TV nhanh (FR-13.A) `[need: Cổng PLQG đẩy record → GET /phien-tu-van-nhanhs ≥1 source=CONG_PLQG]` — daily curl

---

# 📚 Round 5 — FROZEN reference

> Toàn bộ task list R1-R10 + Postmortem + Module bị block + Bug đã đóng đã được tách sang file riêng (425 dòng) để giữ todo.md gọn cho Round 6 active.
>
> **File R5 frozen:** [`output/qa-reports/round5-2026-04-26/todo-round5-frozen.md`](../../output/qa-reports/round5-2026-04-26/todo-round5-frozen.md)
>
> Mở file đó khi cần tham khảo:
> - Lịch sử bug 5 tuần dev iterate (10 bug closed pattern + dev fix sai cách thường gặp).
> - Cách seed Tier 0/1/2 cho 14 entity (đã verify pre-eval).
> - Postmortem 5 gap acceptance (T1.B3 split CG/TVV/NHT, MAU_PHAN_HOI, lý do TC/BS, học viên, ĐG viên).
> - Lessons learned phương án triệt để: seed acceptance theo dropdown filter, không theo count.
