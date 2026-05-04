# TODO — SRS Update 2026-05-04 (FR-02 / FR-03 / FR-04)

**Plan:** [plan.md](plan.md) v1.0 · **Ngày:** 2026-05-04 · **Round:** R7 (sau khi R6 đóng)

> File này chỉ cover scope SRS update batch 2026-05-04. R6 active vẫn theo [`tasks/todo.md`](../../todo.md). Khi R6 đóng → mở R7 và bắt đầu thực thi todo này.

**Icon:** ✅ xong · 🟢 sẵn sàng · 🔵 đang làm · 🟣 chờ BA · ⏳ chờ data · ⚠️ partial · 🚫 block

---

## Tổng quan tiến độ

| Layer | Tên | Tổng task | Time est |
|-------|-----|:-:|---|
| L0 | SRS sync + BA confirm | 5 | 1 ngày |
| L1 | Tier 0 DM update | 3 | 1 ngày |
| L2 | Entity actor refactor (TCTV/NHT/TVV) | 8 | 3-4 ngày |
| L3 | Tier 2 transactional + new entities | 6 | 2 ngày |
| L4 | Workflow E2E 5 SM | 6 | 1 tuần |
| L5 | Permission §7 (~60 code) | 6 | 1 tuần |
| L6 | Edge + NFR (parallel L5) | 7 | 3 ngày |
| L7 | Functional negative + UI consistency | 5 | 3 ngày |
| **Tổng** | | **46** | **~5 tuần** |

---

## L0 — SRS Sync + BA confirm

- 🟢 **L0.1** Diff scope 3 file SRS update vs srs-v3 cũ — list chính xác UC/SM/entity/permission delta
  - **Acceptance:** Doc `srs-update-2026-05-04-diff.md` cover 3 file × 4 chiều (FR mới / SM thay đổi / entity mới / permission mới) — đối chiếu Lịch sử thay đổi từng file
  - **Verify:** grep `^### FR-` + `### SM-` + `^## 4. Entity` + `^## 7. Action-level` từng file new vs old
  - **Output:** `output/srs-update-2026-05-04-diff.md`

- 🟢 **L0.2** NotebookLM 2-source verify 5 cite pháp lý sửa
  - **Acceptance:** NotebookLM HTPLDN query xác nhận: NĐ55 Đ.8 K.1 (HD SLA, không phải Đ.9), NĐ55 Đ.10 K.2 (đào tạo PL DNNVV, không phải Đ.6), NĐ55 Đ.9 (mạng lưới TVV), NĐ77/2008 Đ.13 (ĐKHĐ TC TV), NĐ121/2025 Đ.39-40 (phân cấp UBND)
  - **Verify:** grep nguyên văn local + screenshot NotebookLM response
  - **Output:** Section trong `srs-update-2026-05-04-diff.md`

- 🟣 **L0.3** BA confirm 5 giả định (xem plan §9)
  - **Cần có sẵn:** L0.1 ✅ + L0.2 ✅ — diff doc + 2-source verify đã hoàn thành
  - **Acceptance:** BA reply OK/NOK + rationale cho mỗi giả định: (1) NHT migration backward compat, (2) KHDT 3 cấp R6 KHOA_HOC orphan, (3) MAU_PHAN_HOI BN strict scope, (4) TVV thang 1-5 R6 không retest, (5) TVN_BRIDGE enum dev đã thêm
  - **Output:** `tasks/decisions/srs-update-2026-05-04-ba-signoff.md`

- 🟢 **L0.4** Update entity-map.md + permission-matrix.md cho 5 entity mới + ~60 permission §7
  - **Cần có sẵn:** L0.3 ✅ — BA chốt scope migration
  - **Acceptance:** entity-map.md có thêm row TO_CHUC_TU_VAN, NGUOI_HO_TRO, KE_HOACH_DAO_TAO, LICH_HOC, HOC_VIEN — đầy đủ cột "Tạo tại" + "Đọc tại". permission-matrix-by-fr.md có thêm phần FR-III §7 action-level
  - **Verify:** Cross-check link reference trong 2 file vẫn valid
  - **Output:** `input/data/entity-map.md` + `output/permission-matrix-by-fr.md` updated

- 🟢 **L0.5** Update flow-module.md + 02-thu-tu-module.md SM table mới
  - **Cần có sẵn:** L0.3 ✅
  - **Acceptance:** SM-CTDT (mới 7 trạng thái) + SM-KHOAHOC v2 (11 trạng thái) + SM-KH-DAO-TAO (refinement) + SM-TCTV (mới 6 trạng thái) + SM-TVV refactor — đầy đủ bảng transition trong 02-thu-tu-module.md
  - **Output:** `input/quy-trinh-nghiep-vu/flow-module.md` + `02-thu-tu-module.md` updated

---

## L1 — Tier 0 DM update

- ⏳ **L1.1** Seed DM mức độ phức tạp HD + 2-tier SLA (HOI_DAP_THUONG=15, HOI_DAP_PHUC_TAP=30 ngày LV)
  - **Cần có sẵn:** L0.4 ✅ — entity-map ghi nhận DM extension
  - **Acceptance:** ≥1 record `THUONG` + ≥1 record `PHUC_TAP` trong DM mức độ phức tạp; CAU_HINH_SLA có 2 row HOI_DAP × 2 mức (BR-CALC-04 verify)
  - **Verify:** API `GET /api/v1/danh-muc?loai=MUC_DO_PHUC_TAP_HD` → ≥2 record; API `GET /api/v1/cau-hinh-sla?loai=HOI_DAP&muc_do_phuc_tap=*` → 2 row
  - **Output:** `output/qa-reports/round7/seed/seed-checklist-tier0-update.md` section 1

- ⏳ **L1.2** Seed DM `pham_vi_ap_dung` cho MAU_PHAN_HOI (auto-fill, immutable)
  - **Cần có sẵn:** L0.4 ✅
  - **Acceptance:** 3 enum value verified `TW_QUOC_GIA`, `BN_RIENG`, `DP_RIENG` — auto-fill theo `user.don_vi.cap` (không cần seed DM record vì là enum cố định)
  - **Verify:** Form thêm MPH bởi CB NV TW → field `pham_vi_ap_dung` read-only = `TW_QUOC_GIA`. Same với BN → `BN_RIENG`. ĐP → `DP_RIENG`
  - **Output:** seed-checklist-tier0-update.md section 2

- ⏳ **L1.3** Seed DM loại Tổ chức tư vấn (LOAI_TCTV: Văn phòng LS, Trung tâm TVPL, ...)
  - **Cần có sẵn:** L0.4 ✅
  - **Acceptance:** ≥3 loại TCTV theo NĐ77/2008 (Văn phòng LS / Trung tâm TVPL / Khác) cover form thêm SCR-IV-NEW-02 dropdown
  - **Verify:** API `GET /api/v1/danh-muc?loai=LOAI_TCTV` → ≥3 record; UI form Thêm TCTV dropdown render ≥3 option
  - **Output:** seed-checklist-tier0-update.md section 3

---

## L2 — Entity actor refactor

### L2.1 — TCTV (Tổ chức Tư vấn) — module mới

- ⏳ **L2.1a** Seed-create 6 TCTV state `MOI_DANG_KY` cover (loại × cấp): 2 TW × Văn phòng LS, 2 BN × Trung tâm TVPL, 2 ĐP × Văn phòng LS
  - **Cần có sẵn:** L1.3 ✅ — DM LOAI_TCTV ≥3 record
  - **Acceptance:** ≥3 TCTV state `MOI_DANG_KY` per filter (TW/BN/ĐP × loại) — verify per-filter
  - **Verify:** API `GET /api/v1/to-chuc-tu-van?trang_thai=MOI_DANG_KY&don_vi_cap=TW` → ≥1, BN→≥1, ĐP→≥1; UI list SCR-IV-NEW-01 hiển thị tab "Mới đăng ký" ≥6 row
  - **Output:** `output/qa-reports/round7/seed/seed-checklist-tctv.md`

- ⏳ **L2.1b** Advance state TCTV: `MOI_DANG_KY` → `CHO_PHE_DUYET` → `HOAT_DONG` (≥3 record × cấp = 9 active)
  - **Cần có sẵn:** L2.1a ✅ — 6 TCTV `MOI_DANG_KY`
  - **Acceptance:** ≥1 TCTV `HOAT_DONG` per cấp (TW/BN/ĐP) — verify dropdown TVV liên kết TCTV có option
  - **Verify:** API filter `?trang_thai=HOAT_DONG&don_vi_cap=TW/BN/DP` → ≥1 each. UI form TVV → dropdown TC TV liên kết render >0 option
  - **Output:** seed-checklist-tctv.md section "advance-state"

### L2.2 — NHT entity migration

- ⏳ **L2.2a** Migration NHT từ `loai_tvv` enum cũ → entity NGUOI_HO_TRO
  - **Cần có sẵn:** L0.3 ✅ giả định 1 BA chốt — backward compat strategy
  - **Acceptance:** Tất cả TK role NHT cũ (R6 seed) có entity NGUOI_HO_TRO 1:1 + audit log migration timestamp. Verify R6 NHT workflow (HD/VV/TVCS phân công cho NHT) KHÔNG break
  - **Verify:** API `GET /api/v1/nguoi-ho-tro?tai_khoan_id=<each NHT R6>` → 1 entity. Regression: re-run R6 VS-NHT (assign HD cho `nht_ag_01`) PASS
  - **Output:** `output/qa-reports/round7/seed/seed-checklist-nht-migration.md` + regression report

- ⏳ **L2.2b** Seed NGUOI_HO_TRO_LINH_VUC (junction NHT × lĩnh vực) cover ≥1 NHT/lĩnh vực × cấp
  - **Cần có sẵn:** L2.2a ✅
  - **Acceptance:** Mỗi NHT có ≥1 lĩnh vực assigned → dropdown phân công VV/HD render NHT theo lĩnh vực
  - **Verify:** API search FR-IV-NHT-02 `?linh_vuc_id=<id>` → ≥1 NHT per cấp. Modal phân công VV chọn lĩnh vực X → dropdown NHT có option
  - **Output:** seed-checklist-nht-migration.md section "linh_vuc"

### L2.3 — TVV refactor

- ⏳ **L2.3a** Verify R6 TVV cũ giữ nguyên (không retest, không migrate thang 0-10 → 1-5)
  - **Cần có sẵn:** L0.3 ✅ giả định 4 BA chốt — TVV cũ không retest
  - **Acceptance:** Liệt kê TVV R6 (12 record) ở state `HOAT_DONG` giữ nguyên, không bị break sau migrate NHT
  - **Verify:** API list TVV R6 → 12 record `HOAT_DONG`, link trong workflow VV/HD/TVCS R6 vẫn valid
  - **Output:** `output/qa-reports/round7/regression/tvv-r6-verify.md`

- ⏳ **L2.3b** Seed TVV mới với thang điểm 1-5 + bỏ địa bàn (NĐ77/2008 Đ.19 toàn quốc) cover ≥3 TVV × (loại CG/TVV × cấp TW/BN/ĐP × LV)
  - **Cần có sẵn:** L2.3a ✅
  - **Acceptance:** TVV mới: thang điểm `1-5`, không có `dia_ban_ids[]`, link `to_chuc_id` đến TCTV `HOAT_DONG` (L2.1b)
  - **Verify:** API filter `?loai_tvv=CG&don_vi_cap=TW` → ≥1; thang điểm range API `?diem_min=1&diem_max=5` không trả 0-10 record
  - **Output:** `seed-checklist-tvv-r7.md`

- ⏳ **L2.3c** Workflow SM-TVV refactor: walk full transition mới (`MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH → CHO_PHE_DUYET → HOAT_DONG`); TU_CHOI → CHO_THAM_DINH (không qua MOI_DANG_KY); TAM_DUNG → VO_HIEU_HOA
  - **Cần có sẵn:** L2.3b ✅ — TVV mới đã seed
  - **Acceptance:** Walk 9 transition theo bảng SM-TVV refactor. Verify state `CHO_THAM_DINH` (mới) hiển thị tab riêng
  - **Verify:** Audit log có entry `prev_state` + `new_state` cho từng transition; UI tab "Chờ thẩm định" render ≥1 record
  - **Output:** `output/qa-reports/round7/workflow/workflow-test-report-tvv-refactor.md`

---

## L3 — Tier 2 transactional + new entities

- ⏳ **L3.1** HD entry với `muc_do_phuc_tap` (THUONG / PHUC_TAP) cover deadline calc 15/30 ngày LV
  - **Cần có sẵn:** L1.1 ✅ — DM mức độ + SLA 2-tier
  - **Acceptance:** ≥3 HD `THUONG` deadline=+15 ngày LV; ≥3 HD `PHUC_TAP` deadline=+30 ngày LV; verify BR-CALC-03 (chỉ ngày làm việc, bỏ T7-CN-lễ)
  - **Verify:** API `?muc_do_phuc_tap=THUONG` deadline = ngay_tiep_nhan + 15 working days. Form HD radio `muc_do_phuc_tap` render
  - **Output:** `output/qa-reports/round7/seed/seed-checklist-hoi-dap-r7.md`

- ⏳ **L3.2** KE_HOACH_DAO_TAO năm entry state `DU_THAO` — ≥3 KHDT × cấp (TW/BN/ĐP)
  - **Cần có sẵn:** L0.4 ✅ — entity-map cập nhật
  - **Acceptance:** ≥1 KHDT `DU_THAO` per cấp; verify form thêm có field `nam` + `tieu_de` + `don_vi_id` auto-fill
  - **Verify:** API `?trang_thai=DU_THAO&don_vi_cap=TW/BN/DP` → ≥1 each
  - **Output:** `output/qa-reports/round7/seed/seed-checklist-khdt-3cap.md` section 1

- ⏳ **L3.3** CTDT entry `DU_THAO` gắn KHDT cha (`DA_DUYET`) — ≥3 CTDT × cấp
  - **Cần có sẵn:** L3.2 ✅ + L4.2 ✅ KHDT tới `DA_DUYET` cho ít nhất 3 record × cấp
  - **Acceptance:** ≥1 CTDT `DU_THAO` per cấp với `ke_hoach_id` trỏ KHDT `DA_DUYET`. Verify guard "KHDT cha chưa duyệt → không tạo CTDT được"
  - **Verify:** API tạo CTDT khi KHDT cha `DU_THAO` → 400 ERR. Khi KHDT `DA_DUYET` → 201
  - **Output:** seed-checklist-khdt-3cap.md section 2

- ⏳ **L3.4** KHOA_HOC entry `DU_THAO` gắn CTDT cha (`DA_DUYET`) — ≥3 KH × cấp
  - **Cần có sẵn:** L3.3 ✅ + L4.3 ✅ CTDT tới `DA_DUYET`
  - **Acceptance:** ≥1 KHOA_HOC `DU_THAO` per cấp với `chuong_trinh_id` trỏ CTDT `DA_DUYET`. Verify guard CTDT cha
  - **Verify:** Form thêm KHOA_HOC dropdown CTDT chỉ list `DA_DUYET`
  - **Output:** seed-checklist-khdt-3cap.md section 3

- ⏳ **L3.5** LICH_HOC seed ≥3 buổi/khóa cho ≥3 KHOA_HOC `DA_DUYET` (verify guard "≥1 LICH_HOC + ≥1 GV trước khi gửi phê duyệt khóa" AT-01)
  - **Cần có sẵn:** L3.4 ✅
  - **Acceptance:** Mỗi KHOA_HOC test có ≥3 LICH_HOC entry; ngày buổi học không trùng + thứ tự thời gian hợp lệ
  - **Verify:** API `GET /api/v1/lich-hoc?khoa_hoc_id=<id>` → ≥3 buổi
  - **Output:** seed-checklist-khdt-3cap.md section 4

- ⏳ **L3.6** HOC_VIEN entity + DANG_KY_DAO_TAO seed ≥3 HV/khóa × ≥3 KHOA_HOC `DA_CONG_KHAI`
  - **Cần có sẵn:** L3.5 ✅ + L4.3 ✅ KHOA_HOC tới `DA_CONG_KHAI`
  - **Acceptance:** Mỗi KHOA_HOC `DA_CONG_KHAI` có ≥3 HOC_VIEN entity với `tai_khoan_id` link TK + ≥3 DANG_KY active
  - **Verify:** API `GET /api/v1/hoc-vien?khoa_hoc_id=<id>` → ≥3; mỗi HV có `tai_khoan_id` ≠ null
  - **Output:** seed-checklist-khdt-3cap.md section 5

---

## L4 — Workflow E2E (5 SM)

- ⏳ **L4.1** SM-HOIDAP với SLA 4 mức cảnh báo + escalate Nhóm II (FR-13)
  - **Cần có sẵn:** L3.1 ✅ — HD entry với muc_do_phuc_tap
  - **Acceptance:** Walk full path `MOI → TIEP_NHAN → DANG_XU_LY → DA_TRA_LOI → CHO_PHE_DUYET → DA_DUYET → CONG_KHAI → HOAN_THANH`. Verify cron 30' tự động: 1 HD vượt 50% → SAP_HET_HAN, vượt 100% → QUA_HAN, vượt 200% → QUA_HAN_NGHIEM_TRONG. Email + thông báo trong hệ thống mỗi mức
  - **Verify:** Audit log `WARNING_LEVEL_CHANGED` + MailHog email subject `[Cảnh báo SLA]` + `list_console_messages` không error. Nút "Escalate sang Nhóm II" SCR-X2-03 click → HD chuyển trạng thái escalate
  - **Output:** `output/qa-reports/round7/workflow/workflow-test-report-hoidap-sla.md`

- ⏳ **L4.2** SM-KH-DAO-TAO refinement (TU_CHOI → CHO_DUYET trực tiếp)
  - **Cần có sẵn:** L3.2 ✅
  - **Acceptance:** Walk: KHDT `DU_THAO` → `CHO_DUYET` → CB PD từ chối lý do ≥10 ký → `TU_CHOI` → CB NV sửa → `CHO_DUYET` (KHÔNG qua DU_THAO)
  - **Verify:** Audit log có entry `TU_CHOI → CHO_DUYET` (không phải TU_CHOI → DU_THAO → CHO_DUYET). UI từ TU_CHOI có button "Gửi phê duyệt lại"
  - **Output:** `workflow-test-report-khdt-refinement.md`

- ⏳ **L4.3** SM-CTDT mới (7 trạng thái) + auto-transition DA_DUYET → DANG_THUC_HIEN khi có ≥1 KHOA_HOC con DA_CONG_KHAI/DANG_DIEN_RA
  - **Cần có sẵn:** L3.3 ✅ + L4.2 ✅ — KHDT đã `DA_DUYET`
  - **Acceptance:** Walk full 7 trạng thái CTDT. Sau khi KHOA_HOC con DA_CONG_KHAI → CTDT auto-transition DA_DUYET → DANG_THUC_HIEN. Test refinement TU_CHOI → CHO_DUYET trực tiếp
  - **Verify:** Audit log auto-trigger không có user_id (system); state CTDT cập nhật real-time
  - **Output:** `workflow-test-report-ctdt-new.md`

- ⏳ **L4.4** SM-KHOAHOC v2 (11 trạng thái + TU_CHOI + TU_CHOI_KQ)
  - **Cần có sẵn:** L3.4 ✅ + L3.5 ✅ + L4.3 ✅ — KHOA_HOC + LICH_HOC + CTDT cha DA_DUYET
  - **Acceptance:** Walk full 11 trạng thái: DU_THAO → CHO_DUYET → DA_DUYET → DA_CONG_KHAI → DANG_DIEN_RA → DA_KET_THUC → CHO_DUYET_KQ → HOAN_THANH. Path từ chối: CHO_DUYET → TU_CHOI → CHO_DUYET (refinement). Path từ chối KQ: CHO_DUYET_KQ → TU_CHOI_KQ → CHO_DUYET_KQ. Verify guard AT-01 (≥1 GV + ≥1 LICH_HOC)
  - **Verify:** Test gửi phê duyệt khi 0 GV → toast lỗi guard AT-01. Test FR-III-19 Hướng B công bố KQ vào TK học viên (KHÔNG cấp PDF chứng nhận)
  - **Output:** `workflow-test-report-khoahoc-v2.md`

- ⏳ **L4.5** SM-TCTV mới (6 trạng thái) — full registration to vô hiệu hóa
  - **Cần có sẵn:** L2.1b ✅
  - **Acceptance:** Walk: MOI_DANG_KY → CHO_PHE_DUYET → HOAT_DONG (CB PD công bố `so_quyet_dinh`) → TAM_DUNG → HOAT_DONG → VO_HIEU_HOA (guard: 0 TVV liên kết hoạt động). Test TU_CHOI → CHO_PHE_DUYET refinement
  - **Verify:** Test guard `VO_HIEU_HOA` khi có TVV `HOAT_DONG` link → toast lỗi. Audit `cong_khai → MLTV` ghi `nguoi_duyet` + `so_quyet_dinh`
  - **Output:** `workflow-test-report-tctv-new.md`

- ⏳ **L4.6** SM-TVV refactor (đã làm ở L2.3c — verify cross-reference với SM-TCTV)
  - **Cần có sẵn:** L2.3c ✅ + L4.5 ✅
  - **Acceptance:** TVV link TCTV `HOAT_DONG` → form TVV save OK. TCTV chuyển VO_HIEU_HOA → TVV link cũ vẫn `HOAT_DONG` (không cascade), nhưng dropdown TCTV list không hiện
  - **Verify:** Cross-module: VO_HIEU_HOA TCTV X → form TVV chọn TCTV X không xuất hiện trong dropdown
  - **Output:** Section trong `workflow-test-report-tvv-refactor.md`

---

## L5 — Action-level Permission §7 (~60 code)

> Sample wave first (≥3 ALLOW + ≥3 DENY representative/group), full coverage ở R8.

- ⏳ **L5.1** Permission KE_HOACH_DAO_TAO (10 code §7.1)
  - **Cần có sẵn:** L3.2 ✅ — KHDT entry; L4.2 ✅ — workflow paths
  - **Acceptance:** Verify mỗi code: 1 ALLOW (role có quyền) + 1 DENY (role không có) → 20 TC. Test guard cấp đơn vị (TW/BN/ĐP) cho UPDATE/DELETE/SUBMIT_APPROVE. Test BR-AUTH-05 phê duyệt cùng cấp
  - **Verify:** API probe + UI button visible/disabled. DENY → 403 + toast tiếng Việt
  - **Output:** `output/qa-reports/round7/permission/permission-fr03-7.1-khdt.md`

- ⏳ **L5.2** Permission CHUONG_TRINH_DAO_TAO (10 code §7.2)
  - **Cần có sẵn:** L3.3 ✅ + L4.3 ✅
  - **Acceptance:** 20 TC ALLOW/DENY × 10 code. Test scope `record.trang_thai IN ('DU_THAO','TU_CHOI')` cho UPDATE
  - **Output:** `permission-fr03-7.2-ctdt.md`

- ⏳ **L5.3** Permission KHOA_HOC (16 code §7.3)
  - **Cần có sẵn:** L3.4 ✅ + L4.4 ✅
  - **Acceptance:** 32 TC × 16 code. Đặc biệt verify: SUBMIT_APPROVE guard ≥1 GV + ≥1 LICH_HOC (AT-01); RESULT_SUBMIT guard `record.trang_thai = DA_KET_THUC`; PUBLISH_RESULT (Hướng B công bố TK học viên)
  - **Output:** `permission-fr03-7.3-khoahoc.md`

- ⏳ **L5.4** Permission LICH_HOC + DANG_KY_DAO_TAO (4 + 5 code §7.4-7.5)
  - **Cần có sẵn:** L3.5 ✅ + L3.6 ✅
  - **Acceptance:** 18 TC × 9 code. Verify CANCEL_OWN cho DN/NHT (`record.nguoi_dang_ky_id = user.id`)
  - **Output:** `permission-fr03-7.4-7.5-lichhoc-dangky.md`

- ⏳ **L5.5** Permission GIANG_VIEN/BAI_GIANG/NHCH/DE_KIEM_TRA/DE_XUAT (~15 code §7.6)
  - **Cần có sẵn:** L4.4 ✅
  - **Acceptance:** 30 TC × 15 code. Verify GV DELETE chỉ khi không dạy khóa hoạt động; DE_KIEM_TRA UPDATE/DELETE chỉ khi NHAP; DISTRIBUTE chỉ khi NHAP + khóa hợp lệ
  - **Output:** `permission-fr03-7.6-other.md`

- ⏳ **L5.6** Permission FR-02 MAU_PHAN_HOI 3-cấp + FR-04 TCTV/NHT
  - **Cần có sẵn:** L1.2 ✅ + L4.5 ✅ + L2.2b ✅
  - **Acceptance:** MPH: TW tạo TW_QUOC_GIA → 63 ĐP đọc OK; BN tạo BN_RIENG → only chính BN đọc; ĐP cố tạo TW_QUOC_GIA qua API → 403 ERR-MPH-04. TCTV: chỉ CB PD cùng cấp duyệt được. NHT: chỉ CB NV cùng cấp CRUD
  - **Verify:** API probe payload override `pham_vi_ap_dung` → 403 ERR-MPH-04
  - **Output:** `permission-fr02-mph + fr04-tctv-nht.md`

---

## L6 — Edge + NFR (parallel L5)

- ⏳ **L6.1** Optimistic locking PHAN_HOI auto-save 60s (F-21)
  - **Cần có sẵn:** L4.1 ✅
  - **Acceptance:** 2 CB NV sửa cùng PHAN_HOI cùng lúc (2 MCP isolatedContext) → 1 thắng + 1 thấy ERR-CONFLICT + auto-save draft localStorage không mất nội dung
  - **Verify:** Race timeline screenshot + API response ERR-CONFLICT 409 + localStorage có draft entry
  - **Output:** `output/qa-reports/round7/nfr/nfr-locking-phanhoi.md`

- ⏳ **L6.2** Batch optimistic locking + báo cáo per-record (F-22)
  - **Cần có sẵn:** L4.1 ✅
  - **Acceptance:** Batch phê duyệt 10 PHAN_HOI cùng lúc với 1 record bị sửa giữa chừng → BE trả per-record report (9 PASS, 1 CONFLICT)
  - **Verify:** API response `[{id: ..., status: 'OK' | 'CONFLICT', message: ...}]` × 10 entries
  - **Output:** `nfr-batch-locking.md`

- ⏳ **L6.3** Auto-save draft localStorage AES-256-GCM (F-19 + G-DR-04 SEC-07)
  - **Cần có sẵn:** L4.1 ✅
  - **Acceptance:** Form HD/PHAN_HOI dài 5 phút → auto-save 60s; verify localStorage value là ciphertext (không plaintext); verify auto-clear khi logout HOẶC sau 24h
  - **Verify:** `evaluate_script(() => localStorage.getItem('draft-...'))` → base64 ciphertext (không decode được plain). Logout → localStorage empty
  - **Output:** `nfr-autosave-aes.md`

- ⏳ **L6.4** XSS sanitize MAU_PHAN_HOI nội_dung (FR-II-NEW-02 step 4 F-38)
  - **Cần có sẵn:** L1.2 ✅
  - **Acceptance:** Test 7 payload OWASP XSS vector (script tag, img onerror, svg onload, javascript:, data:, eventhandler, srcdoc) → sanitized 7/7. Verify cả storage XSS (DB) + reflected (URL param)
  - **Verify:** API response noi_dung KHÔNG chứa `<script>`, `onerror=`, `javascript:`. Render UI không trigger alert
  - **Output:** `nfr-xss-mau-phanhoi.md`

- ⏳ **L6.5** F-19 Session expired modal + F-20 user mất quyền giữa chừng
  - **Cần có sẵn:** L4.1 ✅
  - **Acceptance:** F-19: BE invalidate JWT giữa chừng → modal "Phiên hết hạn" + nút "Đăng nhập lại" + auto-save draft KHÔNG mất. F-20: QTHT thu quyền user đang mở form → toast "Bạn vừa mất quyền X" + giữ data + nút "Sao chép nội dung"
  - **Verify:** Memory `qa_htpldn_jwt_revoke_aggressive` ~2 phút trigger; localStorage draft preserved
  - **Output:** `nfr-session-permission-mid-flow.md`

- ⏳ **L6.6** F-23 aria-label icon-only buttons WCAG 4.1.2
  - **Cần có sẵn:** L4 ✅ — UI rendered đầy đủ
  - **Acceptance:** Sample 5 màn hình (SCR-II-01/02/03 + SCR-IV-NEW-01 + SCR-III-01) → mọi icon-only button có `aria-label` non-empty
  - **Verify:** `evaluate_script(() => Array.from(document.querySelectorAll('button:not(:has(*[contains text]))')).filter(b => !b.getAttribute('aria-label')))` → length = 0
  - **Output:** `nfr-aria-wcag.md`

- ⏳ **L6.7** BR-INTG-05 retry policy 3 lần backoff push API Cổng PLQG (FR-III-16, FR-III-19, FR-III-01 hủy)
  - **Cần có sẵn:** L4.4 ✅
  - **Acceptance:** Mock API Cổng PLQG fail 3 lần → BE retry 3 lần với backoff (1s, 2s, 4s). Sau 3 fail → mark `cong_khai_failed=true` + alert QTHT
  - **Verify:** `list_network_requests` thấy 3 attempt; audit log có entry retry timestamp
  - **Output:** `nfr-retry-cong-plqg.md`

---

## L7 — Functional negative + UI consistency

- ⏳ **L7.1** Negative case 15 UC mới (3 + 6 + 6) — invalid input + state mismatch + concurrent
  - **Cần có sẵn:** L4 ✅ — workflow đã PASS happy path
  - **Acceptance:** Mỗi UC mới ≥3 negative TC: (a) invalid input (boundary), (b) state mismatch (gọi action sai state), (c) concurrent (race ≥2 user). Tổng ≥45 TC
  - **Verify:** UI error message khớp ERR code SRS quote nguyên văn; verify state KHÔNG đổi sau lỗi
  - **Output:** `output/qa-reports/round7/functional/functional-negative-15uc.md`

- ⏳ **L7.2** UI strings tiếng Việt thuần (BA review v3) — sample 5 màn hình
  - **Cần có sẵn:** L4 ✅
  - **Acceptance:** SCR-II-01/02/03 + SCR-IV-NEW-01/02 + SCR-III-01/02 → bỏ jargon "SLA / deadline / dropdown / in-app / TVV / TC / NHT" trong text user-facing. Toast/empty state/tooltip 100% tiếng Việt thuần
  - **Verify:** Grep DOM text content: regex `\b(SLA|deadline|dropdown|in-app|TC TV|NHT)\b` trong button/tooltip/toast → 0 match
  - **Output:** `output/qa-reports/round7/ui/ui-consistency-tiengviet-thuan.md`

- ⏳ **L7.3** Cross-module integration: HD escalate sang Nhóm II + KHDT-CTDT-KHOA_HOC chain
  - **Cần có sẵn:** L4.1 ✅ + L4.4 ✅
  - **Acceptance:** HD CONG_KHAI → click "Escalate sang Nhóm II" → tạo entry KHO_CAU_HOI nguồn THU_CONG. CTDT DA_DUYET → tạo KHOA_HOC con → CTDT auto DANG_THUC_HIEN
  - **Verify:** Cross-module audit + entity-map "Đọc tại" verify dropdown render đúng
  - **Output:** `cross-module-srs-update.md`

- ⏳ **L7.4** Regression R6 không break sau migrate NHT + TVV refactor
  - **Cần có sẵn:** L2.2a ✅ + L2.3a ✅
  - **Acceptance:** Re-run sample 5 R6 workflow critical: HD assign NHT, VV phân công NHT, TVCS workflow CG, Đào tạo R6 (KHOA_HOC orphan giữ nguyên), Đánh giá HQ
  - **Verify:** 5/5 PASS, audit log không có ERR. Bug R6 closed vẫn closed (không reopen)
  - **Output:** `output/qa-reports/round7/regression/r6-regression-after-migrate.md`

- ⏳ **L7.5** Tổng kết R7 + bug retest + handoff
  - **Cần có sẵn:** L4 ✅ + L5 ✅ + L6 ✅ + L7.1-7.4 ✅
  - **Acceptance:** Final summary table: 46 task × status; bug status (open/closed/deferred); coverage % theo plan §1.1 mục tiêu; handoff doc cho stakeholder
  - **Output:** `output/qa-reports/round7/R7-final-summary.md`

---

## Tham chiếu

- [v1 plan](plan.md) v1.0 — Chiến lược chi tiết
- [tasks/plan.md](../../plan.md) v2.5.1 — R6 active (KHÔNG ghi đè)
- [tasks/todo.md](../../todo.md) — R6 active task tracker
- [tasks/lessons-learned.md](../../lessons-learned.md) — A5 pattern + LGSP + UI auto-chain

---

> **⚠️ Trước khi flip task ⏳ → 🟢:** chạy verify query thật, copy kết quả vào dòng kết quả. Trust state, not task icon. (Memory `feedback_dependency_chain_state_explicit`)
>
> **⚠️ Bug log:** strict 6 sections theo `bug-report-template.md`. Hook `check-bug-template-sections.py` enforce. (Memory `feedback_bug_report_template_strict`)
