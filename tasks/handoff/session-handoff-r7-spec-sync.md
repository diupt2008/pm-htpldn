# Session Handoff R7 — Spec Sync 2026-05-06

Detailed spec sync notes cho SRS update 2026-05-05. Chuyển từ `tasks/todo.md` ngày 2026-05-06 theo rule "todo only status update".

---

## Bối cảnh R7

Dev đã deploy SRS update 2026-05-05 + partial reset DB (verified 2026-05-06 qua MCP). Sau audit R7.0.6 ([ui-surface-audit.md](../output/qa-reports/round7-2026-05-06/seed/cross-module/ui-surface-audit.md)):

- 3 sub-menu Mạng lưới TVV (Tư vấn viên / Chuyên gia + Người hỗ trợ pháp lý + Tổ chức tư vấn) ĐÃ DEPLOY đầy đủ (verified với role `cb_nv_tw_01`); 6 tab SM-TCTV match SRS.
- Endpoint NHT `/api/v1/nguoi-ho-tro` (singular) 200 OK — DEPLOY-001 R7.0.2 (plural `/nguoi-ho-tros` 404) có thể đã đổi tên hoặc fix, cần re-verify khi seed.
- Còn block: DEPLOY-003 4 sub-menu Đào tạo mới thiếu (Kế hoạch năm/Lịch học/Đề kiểm tra/Học viên), DEPLOY-004 Ngày lễ sub-menu thiếu, DEPLOY-005 filter Địa bàn TVV vẫn còn.
- R7.0.6 cũng phát hiện 2 gap FR-07 (button [Thêm mới]/[Import Excel]) → dev fix Closed 2026-05-06 ([bug-report-audit-r7-0-6-fr-07-buttons.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-audit-r7-0-6-fr-07-buttons.md)).
- 2 false positive R7.0.2 (sub-menu NHT/TC TV) DROPPED — bài học: verify UI gap dùng đúng role có permission per SCR (memory `feedback_verify_ui_gap_role_permission`).

---

## FR-05 v3.5 — Vụ việc HTPL

Apply [`srs-update-2026-5-5/srs-fr-05-vu-viec.md`](../input/srs-update-2026-5-5/srs-fr-05-vu-viec.md) v3.5 (14 thay đổi IN + V4-CHƯA-SỬA #1). Sync 14 file QA qua 6 phase:

- **Phase 0** verify NotebookLM (notebook id `a4ae45bf-cea0-4325-8fee-b1e0be702cf2` Haizz-HTPLDN, query 4 cụm critical: SLA 15 ngày + 5 cột công khai + BR-PUBLIC-04 + 3 entity owned mới + UC67 đánh giá + SCR-V.I-04/05).
- **Phase 1** data layer: [entity-map.md](../input/data/entity-map.md) (+E27/E28/E29 + DON_VI 2 tầng + VU_VIEC refactor) · [seed-fixture.yaml v2.7.2](../input/data/seed-fixture.yaml) (SLA VV 10→15 + 3 variants section mới + YAML structural fix `cap_tai_khoan_cg_nht_r5` promote root) · [flow-module.md §5 SM-VUVIEC](../input/quy-trinh-nghiep-vu/flow-module.md) (2 self-loop CONG_KHAI + Phụ DN bổ sung HS) · [02-thu-tu-module.md §⑥ FR-05](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) (refactor bảng Transition + 2 row CONG_KHAI/HUY_CONG_KHAI).
- **Phase 2** SM + smoke: [6.5-sm-vuviec.md](../output/smoke/6.5-sm-vuviec.md) (9→13 test paths) · [6.5-smoke-vuviec.md](../output/smoke-specs/6.5-smoke-vuviec.md) (3 smoke optional: Công khai + DN bổ sung + filter cong_khai).
- **Phase 3** test plan FULL: [7.5-vu-viec-htpl.md](../output/funtion/7.5-vu-viec-htpl.md) (33→**72 TC**, 9 cluster, P0:44 [2 P0 Critical privacy NĐ 13/2023], P1:27, P2:1; 19→21 FR).
- **Phase 4** cross-FR delta (B): [7.4](../output/funtion/7.4-chuyen-gia-tvv.md) · [7.4a](../output/funtion/7.4a-nguoi-ho-tro.md) · [7.4b](../output/funtion/7.4b-to-chuc-tu-van.md) · [7.7](../output/funtion/7.7-quan-ly-doanh-nghiep.md) · [7.10](../output/funtion/7.10-quan-tri-he-thong.md) (BR-AUTH-08 exception TW + QT-027 SLA VV=15) · [7.8](../output/funtion/7.8-danh-gia.md) (phân biệt 3 entity đánh giá + flag BR-CALC-04 ID conflict).
- **Phase 5** impact sample (C): [7.6](../output/funtion/7.6-chi-tra-chi-phi.md) · [7.11](../output/funtion/7.11-bao-cao-thong-ke.md) · [7.12](../output/funtion/7.12-tu-van-chuyen-sau.md) · [7.13](../output/funtion/7.13-tu-van-nhanh.md) · [7.16](../output/funtion/7.16-API-ket-noi-chia-se.md) (whitelist 9 fields BR-PUBLIC-04 cho VV outbound).
- **Phase 6** report: [permission-matrix.md](../output/permission-matrix.md) + [by-fr.md](../output/permission-matrix-by-fr.md) + [by-role.md](../output/permission-matrix-by-role.md) (3 entity owned mới + 2 SCR DN mới + BR-AUTH-08 exception TW) · [test-strategy.md v3.2](../output/test-strategy.md) (49→52 entity, +2 FR).

**Tester chạy R7.X FR-05 dùng 7.5 v3.0 mới (72 TC). 2 TC P0 Critical privacy:** C1-2 (whitelist API outbound) + C7-2 (SCR-V.I-04 ẩn tên CB) — leak → escalate ngay (NĐ 13/2023).

**Defer:** TP-Optional-2 chờ sandbox VNeID Tier 2; SLA 15 ngày NĐ55 Đ.8 K.1 chưa web-verify (log bug nếu BE deploy 10 ngày).

---

## FR-04 v3.5 — TVV/CG/NHT/TC TV

8 file QA test plan FR-04 đã update theo SRS update 2026-05-05 (TVV/CG/NHT/TC TV). Mới: [7.4-chuyen-gia-tvv.md](../output/funtion/7.4-chuyen-gia-tvv.md) (18 FR, 30 TC, SM 10 state) · [7.4a-nguoi-ho-tro.md](../output/funtion/7.4a-nguoi-ho-tro.md) (NHT 21 TC) · [7.4b-to-chuc-tu-van.md](../output/funtion/7.4b-to-chuc-tu-van.md) (TC TV 25 TC) · [6.4-sm-tvv.md](../output/smoke/6.4-sm-tvv.md) · [6.4a-sm-tctv.md](../output/smoke/6.4a-sm-tctv.md) · [6.4b-sm-nht.md](../output/smoke/6.4b-sm-nht.md). Permission 3-view sync (matrix.md + by-fr.md + by-role.md).

Tester chạy R7.X FR-04 dùng spec mới này.

---

## FR-10 v3.5 — Quản trị hệ thống

Deep review SRS FR-10 v3.5 → log 11 inconsistency (3 Major HARD BLOCK + 8 Minor doc) + 10 câu BA. Sync 9 file QA: [bug-report-srs-fr10-inconsistency.md](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-srs-fr10-inconsistency.md) · [6.10-sm-taikhoan.md](../output/smoke/6.10-sm-taikhoan.md) (4→5 states + 11 transitions) · [7.10-quan-tri-he-thong.md](../output/funtion/7.10-quan-tri-he-thong.md) (25→27 FR, Tier 1/2/3, 31 TC active + 6 parking) · [6.10-smoke-taikhoan.md](../output/smoke-specs/6.10-smoke-taikhoan.md) · [02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) (DON_VI 3 cấp → 2 tầng + FR mới 26/28/29) · [test-strategy.md §7.10](../output/test-strategy.md) · [permission-matrix-by-fr.md §10](../output/permission-matrix-by-fr.md) (+NGAY_LE) · [permission-matrix-by-role.md](../output/permission-matrix-by-role.md) (UC120-123 renumber + 3 FR mới) · [7.7-quan-ly-doanh-nghiep.md](../output/funtion/7.7-quan-ly-doanh-nghiep.md) (bỏ Import Excel + DN tự đăng ký FR-VIII-22).

**Tier 1 stable test ngay (R7.7.8 31 TC). Tier 2 parking chờ BA chốt Q1/Q2/Q3 hard block. TC chi tiết KHÔNG update.**

---

## FR-10 user chốt 2 thay đổi 2026-05-06 lần 2

(1) **Ngày lễ (FR-VIII-29) gộp tab vào SCR-VIII-06 Cấu hình HT** (thay màn riêng/DM con) → giải quyết DEPLOY-004 UI vị trí.
(2) **BỎ HẲN tab "Phân công mặc định" + entity `CAU_HINH_PHAN_CONG` + FR-II-NEW-01 deprecated**. SCR-VIII-06 còn 4 tab: SLA / Mẫu phản hồi / Quy trình / **Ngày lễ**.

**Cross-module impact:** FR-02/05/12 bỏ dropdown gợi ý người xử lý → chờ BA verify cơ chế thay thế (out-of-scope đợt này). **3 hard block Q1/Q2/Q3 VẪN cần hỏi BA** — user chốt UI vị trí, KHÔNG chốt schema NGAY_LE / TINH_THANH UI / CHO_PHAN_QUYEN scenario.

---

## FR-07 v3.5 — Doanh nghiệp

Apply [`srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md`](../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md) v3.5 (10 thay đổi cherry-pick). Sync 5 file QA: [6.7-smoke-doanhnghiep.md](../output/smoke-specs/6.7-smoke-doanhnghiep.md) (bỏ Thêm mới + Import, URL `/doanh-nghiep/danh-sach`, account `cb_nv_tw_01`) · [7.7-quan-ly-doanh-nghiep.md](../output/funtion/7.7-quan-ly-doanh-nghiep.md) (3→2 FR, +DN-021..024 v3.5: `tong_nguon_von` / multi-select Lĩnh vực / `tinh_thanh_id` DANH_MUC / sync 4 cặp tên trường) · [permission-matrix-by-fr.md §7](../output/permission-matrix-by-fr.md) (DOANH_NGHIEP CB NV `CRUD*`→`RUD*`, +DOANH_NGHIEP_LINH_VUC) · [permission-matrix-by-role.md](../output/permission-matrix-by-role.md) (3 role CB_NV đổi quyền, 11 role deprecate FR-V.III-NEW-01) · [test-strategy.md §7.7](../output/test-strategy.md) (3→2 FR, 17 active TC).

---

## FR-07 audit Phase B 2026-05-06

Verify trên app live (cb_nv_tw_01) với 36 DN cover 3 quy mô × 3 ngành. URL `/doanh-nghiep/danh-sach` ✅, toolbar đã bỏ [+ Thêm mới] + [Import Excel] ✅.

**2 gap UI v3.5 còn lại — log bug khi chạy R7.7.4:**
(a) Filter "Lĩnh vực KD" SCR-V.III-01 vẫn `textbox` thay vì `multi-select` (vi phạm v3.5 Thay đổi 9 → bug Major).
(b) Cột "Ngành nghề" thừa trên table SCR-V.III-01 (SRS chỉ quote 9 cột không có Ngành nghề → bug Minor SRS contradiction).

---

## FR-06 v3.5 — Chi trả

13→14 FR (+FR-V.II-14 DN bổ sung qua DVC); SM 10 state + 14 transition; +2 entity (THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA); CB PD "Từ chối" = trả về Đang thẩm định; UI tiếng Việt thuần. PREP DONE 24 file QA. **2 BA Q chờ chốt** ([ba-questions-fr06](../output/qa-reports/round7-2026-05-06/bug-reports/ba-questions-fr06-2026-05-06.md)).

**Run ngay:** R7.7.12.1 + R7.7.12.4. **Block LGSP:** R7.6.1 + R7.7.12.2/3.

---

## FR-09 v3.5 — Biểu mẫu

Apply [`srs-update-2026-5-5/srs-fr-09-bieu-mau.md`](../input/srs-update-2026-5-5/srs-fr-09-bieu-mau.md) v3.5 (6 thay đổi: A=1 + B1=5).

**Tóm tắt:**
1. **CR-01** rename `la_cong_khai`→`cong_khai` cho BIEU_MAU + thêm 4 trường công khai chuyên trang (`anh_dai_dien` / `thoi_gian_dang_tai` / `mo_ta_cong_khai` / `file_dinh_kem_cong_khai`) + Switch "Công khai trên Cổng PLQG" trong form FR-VII-04 + 2 cột mới SCR-VII-02 (Đã công khai badge / Ảnh đại diện thumbnail) + 3 BR-PUBLIC-01/02/03.
2. THU_MUC_BIEU_MAU.trang_thai enum đổi `KICH_HOAT/VO_HIEU_HOA` → `NHAP/CONG_KHAI/AN`.
3. Tách entity HOP_DONG_TU_VAN + FR-VII-08 sang `srs-fr-14-hop-dong-tv.md` (UC range UC92-98, bỏ UC163, Số FR 8→7).
4. BR-AUTH-01 đổi sang Mô hình 2-tier (Tier 1 user/pass+TOTP nội bộ, Tier 2 SSO VNeID Internet) — bỏ VNPT eKYC.
5. Cleanup vết bẩn HOP_DONG_TU_VAN trong §4 Tổng quan + ERD + bỏ BR-DATA-04.
6. Sửa SM-BIEUMAU + BR-FLOW-07 ref `FR-VII-02`(Tìm kiếm)→`FR-VII-03`(Công khai).

**⚠️ Migration scope `la_cong_khai`→`cong_khai`:** affect 4 entity (BIEU_MAU + THU_MUC_BIEU_MAU + HOI_DAP + TU_VAN_VIEN) + HOI_DAP còn rename `ngay_cong_khai`→`thoi_gian_dang_tai`.

**⚠️ v3.5 chỉ có 12/16 file FR slice** — FR-11/14/15/16 đọc từ master [`srs-v3.md`](../input/srs-update-2026-5-5/srs-v3.md) (master line 1853 HOP_DONG_TU_VAN entity = source-of-truth tạm cho FR-14, ghi `Tham chiếu FR: FR-X.3-01`).

**QA file CHƯA sync (cần update khi chạy R7.3.7 / R7.4.C1 / R7.7.10 / R7.7.16):** [7.9-bieu-mau.md](../output/funtion/7.9-bieu-mau.md) (bỏ TC HĐ TV BM-030/037, thêm TC Switch + 4 trường + BR-PUBLIC, rename `la_cong_khai`), [7.16-API-ket-noi-chia-se.md](../output/funtion/7.16-API-ket-noi-chia-se.md) line 52/71/152/166 rename filter, [6.9-smoke-bieumau.md](../output/smoke-specs/6.9-smoke-bieumau.md) update path SRS, [permission-matrix-by-fr.md §9](../output/permission-matrix-by-fr.md) bỏ HOP_DONG_TU_VAN khỏi row FR-09, [02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) line 272-294 rename + 4 trường, [seed-fixture.yaml](../input/data/seed-fixture.yaml) mass replace `la_cong_khai`→`cong_khai`.

**Pending BA:** drift slice [`srs-fr-13-tv-nhanh.md`](../input/srs-update-2026-5-5/srs-fr-13-tv-nhanh.md) line 750 còn `la_cong_khai` HOI_DAP (FR-13 reference; owner FR-02 đã rename đúng — minor drift).

---

## FR-02 v3.5 — Hỏi đáp Pháp luật

Apply [`srs-update-2026-5-5/srs-fr-02-hoi-dap.md`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md) v3.5 (17 thay đổi).

**Tóm tắt:**
- Đổi tên module "Hỏi đáp Pháp lý" → "Hỏi đáp Pháp luật" (Thay đổi 2 FR-11 ITEM-14).
- HOI_DAP+PHAN_HOI thêm 5 trường công khai chuẩn CR-01 (`cong_khai`/`anh_dai_dien`/`thoi_gian_dang_tai`/`mo_ta_cong_khai`/`file_dinh_kem_cong_khai`).
- HOI_DAP thêm `don_vi_id` CR-06 (DN chọn cơ quan tiếp nhận từ Cổng PLQG, default Sở TP tỉnh DN) + enum kênh thêm `TVN_BRIDGE` (auto-fill từ FR-13 ESCALATE) + state `HUY` mới (8→9 state) + field `loai_doi_tuong_xu_ly` (CA_NHAN/TO_CHUC) + `to_chuc_tu_van_id` (validate TVV thuộc TC).
- MAU_PHAN_HOI áp Mô hình B Hybrid 2 tầng (`pham_vi_ap_dung` ∈ TW_QUOC_GIA/BN_RIENG/DP_RIENG, auto-fill theo cấp user, ngoại lệ BR-AUTH-08); 4 mã quyền action-level mới (MPH_CREATE_TW/BN/DP + MPH_READ).
- BR-FLOW-03 mở rộng cấm sửa/xóa cả CONG_KHAI+HOAN_THANH; BR-FLOW-05 thu hẹp chỉ CB PD cùng cấp được Công khai/Hủy CK; BR-FLOW-06 mới Đóng hồ sơ thủ công không auto-close.
- SCR-II-01 gộp 7 tabs (v3 9 tabs); modal Công khai mới với ảnh đại diện 5MB + mô tả 2000 ký tự + file 20MB×10.

**Sync 12 file QA:** [7.2-hoi-dap-phap-ly.md](../output/funtion/7.2-hoi-dap-phap-ly.md) (35→**60 TC** — append 25 TC mới HD-040..064 tag `[v3.5]` + fix 13 UC ref `[fix-v3.5]` + expand 6 TC `[expand-v3.5]` + deprecate 3 TC HD-017/018/033, P0:27 P1:26 P2:4) · [6.2-sm-hoidap.md](../output/smoke/6.2-sm-hoidap.md) (7→11 test paths + BR-FLOW-05/06 + immutability mở rộng) · [6.2-smoke-hoidap.md](../output/smoke-specs/6.2-smoke-hoidap.md) (Bước 2c verify v3.5: dropdown mẫu 2 nhóm + button Đóng HS + cột Cơ quan tiếp nhận + form ẩn TVN_BRIDGE) · 3 [permission-matrix*.md](../output/permission-matrix.md) (header bullet FR-02 v3.5 + section FR-02 v3.5 note + entity row update + đổi term "pháp lý" → "pháp luật" 22 instances) · [funtion/README.md](../output/funtion/README.md) (TC count 36→57 active) · [smoke/README.md](../output/smoke/README.md) (paths 7→11) · [smoke-specs/README.md](../output/smoke-specs/README.md) (menu label) · [test-strategy.md](../output/test-strategy.md) v3.3 (5 SRS update + module name + count) · [qa-tracking.md](../output/qa-tracking.md) (5 instances tên module) · [srs-conflicts-need-ba.md](../output/srs-conflicts-need-ba.md) (LỖI A `DA_PHAN_CONG` v3.5 chưa fix + cite path mới + impact analysis).

**⚠️ BA pending:** state `DA_PHAN_CONG` xuất hiện ở FR-II-04/05/06 (filter cứng + Processing) nhưng KHÔNG có trong CHECK constraint HOI_DAP + SM diagram → log [LỖI A srs-conflicts-need-ba.md](../output/srs-conflicts-need-ba.md). Test plan giả định BA chốt **bỏ**; nếu chốt **giữ** → expand HD-030/049/050 + SM 9→10 state + 2 transition mới.

**DEV pending:** schema migration (7 field HOI_DAP + 5 field PHAN_HOI + bảng MAU_PHAN_HOI cột `pham_vi_ap_dung` + enum kênh `TVN_BRIDGE` + state `HUY` + field `loai_doi_tuong_xu_ly`/`to_chuc_tu_van_id`).

**Tester chạy R7.7.1 + R7.4.A4 dùng spec v3.5 mới (60 TC, 11 paths) sau khi DEV migrate + BA chốt DA_PHAN_CONG.**

---

## FR-08 v3.5 — Đánh giá Hiệu quả HTPL

Apply [`srs-fr-08-danh-gia.md`](../input/srs-update-2026-5-5/srs-fr-08-danh-gia.md) v3.5 (8 thay đổi).

**Tóm tắt:** rename module + entity (`DOT_DANH_GIA / DANH_GIA_HQ` → `KE_HOACH_DANH_GIA`); +2 field (`co_quan_duoc_danh_gia_id` 1:1 + `file_dinh_kem`); +FR-VI-10 read-only cho CB NV `co_quan_duoc_danh_gia_id` khi `HOAN_THANH`; SM 8 state + HUY (bỏ 9 state cũ); BR-NOTIF-01 mở rộng FR-VI-03/04/08/09.

**Sync 14 file QA:** [7.8-danh-gia.md](../output/funtion/7.8-danh-gia.md) (40→46 TC, 10 FR) · [6.8-smoke-danhgia.md](../output/smoke-specs/6.8-smoke-danhgia.md) · [7.16-API-ket-noi-chia-se.md](../output/funtion/7.16-API-ket-noi-chia-se.md) · [7.11-bao-cao-thong-ke.md](../output/funtion/7.11-bao-cao-thong-ke.md) · [permission-matrix.md](../output/permission-matrix.md) + [by-fr.md](../output/permission-matrix-by-fr.md) + [by-role.md](../output/permission-matrix-by-role.md) (FR-VI-10 row mỗi role) · [test-strategy.md](../output/test-strategy.md) · [7.1-dashboard.md](../output/funtion/7.1-dashboard.md) · [entity-map.md](../input/data/entity-map.md) · [seed-fixture.yaml](../input/data/seed-fixture.yaml) · [flow-module.md](../input/quy-trinh-nghiep-vu/flow-module.md) · [02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md).

**Pending T4** (5 trường công khai chuyên trang) chờ BA. **Tester R7.4.D1/D2 + R7.7.9 dùng spec v3.5.**
