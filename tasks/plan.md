# Kế hoạch kiểm thử PM HTPLDN — A→Z

> Tài liệu này là **file duy nhất QA dùng để chạy test**. Bao gồm thứ tự seed data, ràng buộc nhân quả, quy trình 6 phase, hiện trạng + Round 5 phân quyền cuối.
>
> Cần hiểu hệ thống tổng quan trước → đọc [system-overview.md](system-overview.md). Bảng nguồn dropdown 30+ ở `system-overview §5`.

**Ngày viết:** 2026-04-25 · **Phiên bản:** v2.6.2 (2026-05-06 — sync 8 file QA test plan FR-04 theo SRS update 2026-05-05 + 5 delta map mới/expand. **Mới (4 file):** [`output/funtion/7.4a-nguoi-ho-tro.md`](../output/funtion/7.4a-nguoi-ho-tro.md) (NHT 21 TC) + [`7.4b-to-chuc-tu-van.md`](../output/funtion/7.4b-to-chuc-tu-van.md) (TC TV 25 TC) + [`output/smoke/6.4a-sm-tctv.md`](../output/smoke/6.4a-sm-tctv.md) (SM-TCTV 6 state) + [`6.4b-sm-nht.md`](../output/smoke/6.4b-sm-nht.md) (SM-NHT 4 state). **Rewrite (4 file):** [`7.4-chuyen-gia-tvv.md`](../output/funtion/7.4-chuyen-gia-tvv.md) (18 FR, 30 TC, +CHO_KICH_HOAT, +cong_khai 5 trường, thang 1-5) + [`6.4-sm-tvv.md`](../output/smoke/6.4-sm-tvv.md) (9→**10 state**) + [`output/smoke-specs/6.4-smoke-tvv.md`](../output/smoke-specs/6.4-smoke-tvv.md) (menu "Tư vấn viên / Chuyên gia", URL `/chuyen-gia-tvv/danh-sach`, 6 tab, account `qtht_01`) + [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) (fix 6 vị trí sai SRS: TC TV entity riêng, NHT tách entity, SM 10 state, bỏ dia_ban, thang 1-5, dropdown 2 entity). **Permission 3-view sync FR-04:** [`permission-matrix-by-fr.md`](../output/permission-matrix-by-fr.md) (FR-04 mở rộng 3→6 entity row, 49 entity total) + [`permission-matrix-by-role.md`](../output/permission-matrix-by-role.md) (11 role × thêm 7 FR mới = 77 row, mỗi FR-04 block 12→19 row). **5 delta map mới/expand:** `_DELTA-MAP-FR05/06/08/09.md` (mới — cover 14+9+8+6 thay đổi) + `_DELTA-MAP-FR10.md` (expand 3 FR mới → 19 thay đổi đầy đủ). **Defer:** seed-fixture.yaml chưa có 5 trường cong_khai trong tvv_variants/to_chuc_tu_van_variants — bổ sung khi tester chạy R7.2.5/2.6 seed thật. **Fix sai todo R7.4.A1:** "SM 9→11" → "SM 9→**10 state**" (enum SRS line 2011 = 10 values). Tham chiếu: [`_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md) §4 File QA cần update.) · v2.6.1 (2026-05-05 — bổ sung R7.0.0 verify scenario reset DB + R7.0.5 re-evaluate 5 R6 task liên quan SRS update. Workflow 3 bước trigger Round 7: (1) hỏi dev scenario A/B/C trước deploy; (2) sau deploy QA chạy 3 curl verify schema + entity NGUOI_HO_TRO + count DN cũ; (3) phân loại scenario thực tế → adjust scope. Scenario A=no reset (resume R6 song song R7), B=reset DB (frozen R6 + gộp R7), C=partial (STOP escalate dev). 5 R6 task có liên quan: R6.5.1 KPI-07, R6.5.3 SLA, R6.7.2 CG/TVV 31 TC enum, R6.7.4 DN 8 TC flow, R6.4.A1.5 PC TVV dropdown — KHÔNG đơn giản gộp vào R7, phải re-evaluate per scenario.) · v2.6.0 (2026-05-05 — apply 3 SRS update từ `input/srs-update-2026-5-5/` (FR-04 NHT/TVV/TCTV + FR-07 DN self-reg + FR-10 mở rộng). Mở thêm **Round 7 PENDING** sau Round 6 close — 30 task chia 8 phase. Scope mở rộng 46→49 entity (thêm NGUOI_HO_TRO + TO_CHUC_TU_VAN + NGAY_LE) + 9 FR mới (3 FR-10: VIII-26/28/29 + 6 FR-04: IV-13/NHT-01/02/03 + IV-NEW-01/02/04) - 1 FR bỏ (FR-V.III-NEW-01 Import DN). Fixture bump v2.6.2 → v2.7.0 thêm 3 block (ngay_le_variants + to_chuc_tu_van_variants + nht_variants). 5 file QA artifact đã sync delta (entity-map + permission-matrix + flow-module + seed-fixture + test-strategy). 3 file `_DELTA-MAP-*.md` chứa impact analysis 16 module + đáp án 6/11 câu BA + 4 open issue defer khi test. Tham chiếu: [`_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md), [`_DELTA-MAP-FR07.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md). Round 7 task list: [`todo.md` §Round 7](todo.md#round-7--pending-apply-3-srs-update-từ-srs-update-2026-5-5).) · v2.5.1 (2026-05-02 — bump scope Round 6 từ 5 phase → 7 phase: thêm Phase 6 Workflow đầu ra hậu kỳ (mapping R5 P3 — Chi trả/TV nhanh/CT HTPLDN GĐ1+GĐ2) + Phase 7 Functional 17 module (mapping R5 T4.1-T4.17). Lý do: R6 ban đầu cắt scope so với R5; user yêu cầu update để phản ánh đúng work còn lại. Tổng task R6 từ 52 → 74. Chi tiết [`output/qa-reports/round6-2026-05-01-postreset/README.md`](../output/qa-reports/round6-2026-05-01-postreset/README.md) Phase 6+7.) · v2.5 (2026-05-01 — bump sau dev reset DB 1/5: scope 6 phase + 16 module GIỮ NGUYÊN, mở thêm **Round 6** cho post-reset re-seed. Round 5 frozen làm reference lịch sử bug 5 tuần. Fixture bump v2.6.2 thêm `cap_tai_khoan_cg_nht_r5` + `dn_variants_dp_extension`.) · v2.4 (sync count refs với fixture v2.5 — pool 12 DN/12 TVV/15 VV/11 HD/10 TVCS/11 BM)
**App URL:** http://103.172.236.130:3000/ · **MailHog:** http://103.172.236.130:8025
**Tài khoản test:** [`input/users.csv`](../input/users.csv) — fallback `_01 → _02 → _03`

---

## 1. Mục tiêu + Scope

### 1.1 Mục tiêu

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| G1 | Test case ưu tiên cao (P0) | PASS 100% |
| G2 | Test case ưu tiên trung (P1) | PASS ≥ 90% |
| G3 | Bug Blocker/Critical còn mở | 0 |
| G4 | Phân quyền smoke (40 TC/module) | PASS 100% |
| G5 | Workflow happy path | 100% (10 luồng: TVV/HD/VV/TVCS/Khóa học/Chi trả/TVNhanh/CT HTPLDN/Đánh giá HQ/Biểu mẫu) |
| G6 | Phân tách dữ liệu (data isolation) | Sample ≥1 module/kịch bản PASS |
| G7 | Audit log mọi thao tác Tạo/Sửa/Xóa | Đầy đủ |
| G8 | UI khớp Prototype | Chỉ Minor/Trivial còn mở |
| G9 | TC chi tiết field-level (BVA/EP/XSS) cho 6 module ưu tiên | Có file + chạy + log bug |

**Không đạt G1/G3/G5 → FAIL**, redelivery. G2/G4/G6/G7/G8/G9 partial → **PASS có ghi chú**.

### 1.2 Scope

- **In scope:** 16 module nghiệp vụ + 1 module Quản trị nền tảng + 18 API outbound + 8 API inbound (mock).
- **Out of scope Round 4:** Phân quyền đầy đủ ~1000 TC (11 vai trò × 16 module × CRUD) — chuyển Round 5 cuối, sau khi 5 phase đầu PASS.
- **Module BLOCKED đến hết Round 4:** Chi trả + Phiên TV nhanh + 8 API inbound — chờ tích hợp DVC/LGSP/Cổng PLQG. Test bằng workaround (BE inject hoặc negative test).
- **Round 7 scope (PENDING — apply 3 SRS update 2026-05-05):** mở rộng 46→**49 entity** (thêm NGUOI_HO_TRO + TO_CHUC_TU_VAN + NGAY_LE), thêm **9 FR mới** (FR-VIII-26/28/29 + FR-IV-13/NHT-01/02/03 + FR-IV-NEW-01/02/04), bỏ **1 FR** (FR-V.III-NEW-01 Import DN — DN tự đăng ký TK-first qua FR-VIII-22). DN/TVV/NHT đổi luồng tạo: tự đăng ký + kích hoạt TK lần đầu (FR-VIII-22 + FR-VIII-26). Thang điểm thẩm định TVV đổi 0-10 → 1-5. Bỏ entity TVV_DIA_BAN (TVV scope toàn quốc theo NĐ 77/2008 Đ.19). Tham chiếu: [`_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md), [`_DELTA-MAP-FR07.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md).

### 1.3 Timeline + thứ tự thực thi

5 tuần (2026-04-24 → 2026-05-29) chia 6 phase:

| Phase | Tuần | Trọng tâm | Đầu ra |
|---|---|---|---|
| **P0** Chuẩn bị | T0 (0.5 ngày) | Verify env + tài khoản + tool | `_prep-log.md` |
| **P1** Smoke + LỚP 1-2 nền tảng | T1 (1 tuần) | Smoke 16 module + seed Quản trị + DN + TVV + Biểu mẫu | `smoke-test-report.md` + 4 seed-checklist |
| **P2** 5 trụ song song (LỚP 2 còn lại + LỚP 3) | T2 (1 tuần) | Trụ A (TVV→VV→HD→TVCS) + Trụ B (Đào tạo) + Trụ C (Biểu mẫu workflow) | 5 file `_pillar-{A..E}-result.md` |
| **P3** LỚP 4-5 hậu kỳ + đầu ra | T3 (1 tuần) | Đánh giá HQ + Kho QA + Chi trả/TVNhanh/CT HTPLDN GĐ2 + theo dõi unblock | Workflow report 4 module hậu kỳ + 3 module đầu ra |
| **P4** Functional 16 module | T4 (1 tuần) | Negative + alternative + edge + 40 TC phân quyền/module | 16 functional report + edge report |
| **P5** TC chi tiết + UI + Regression + Tổng kết | T5 (1 tuần) | BVA/EP/XSS cho 6 module ưu tiên + design review + retest bug R3 | TC chi tiết + 16 design review + summary |
| **R5** Phân quyền đầy đủ (sau P5 PASS) | +1.5 tuần | 11 vai trò × 16 module × CRUD ~1000 TC + DI-01..09 deep | `_archive/round5/plan.md` |
| **R7** Apply 3 SRS update 2026-05-05 (PENDING) | TBD — sau R6 close | 30 task / 8 phase: P0 verify → P1 NGAY_LE → **P2 FR-10 nền tảng** → P3 FR-04 + P4 FR-07 → P5 8 module B → P6 C/D smoke → P7 tech debt + 4 gate BA confirm | [`todo.md` §Round 7](todo.md#round-7--pending-apply-3-srs-update-từ-srs-update-2026-5-5) + 3 `_DELTA-MAP-*.md` |

---

## 2. ⭐ Bảng ràng buộc dữ liệu A→B→C — phải đọc trước khi seed

Đây là **trái tim của test plan**. Vi phạm thứ tự = block hoặc test fail mặc dù code đúng.

### 2.1 Ràng buộc cứng (KHÔNG thể bypass — ai cũng phải tuân thủ)

| Trước (A) | Sau đó mới làm được (B) | Lý do (C) |
|---|---|---|
| QTHT seed Tài khoản + Đơn vị + Danh mục | Mọi module khác | Không có TK = không login. Không có DM = dropdown rỗng |
| QTHT cấu hình SLA | Phân công Vụ việc | Tính deadline xử lý (BR-CALC-04) |
| QTHT cấu hình Phân công mặc định Đợt 1 (CB) | Phân công Hỏi đáp/Vụ việc tự gợi ý | Modal phân công lấy mapping từ CAU_HINH_PHAN_CONG |
| Tạo TVV | TVV qua workflow active (`DANG_HOAT_DONG`) | TVV mới `MOI_DANG_KY` không xuất hiện trong dropdown |
| TVV `DANG_HOAT_DONG` | QTHT thêm Phân công Đợt 2 (TVV phụ trách) | Dropdown "Người xử lý" lọc `trang_thai=HOAT_DONG` |
| TVV `DANG_HOAT_DONG` + Đợt 2 | Phân công Hỏi đáp/VV ưu tiên TVV theo lĩnh vực | Modal hiện ≥2 gợi ý/lĩnh vực |
| Tạo DN | Tạo VV/HD/TVCS gắn DN | Dropdown "Chọn DN" lọc theo `don_vi_id` user |
| CTĐT đẩy lên `DA_DUYET` | Tạo Khóa học gắn CTĐT | Combobox CTĐT trong form tạo Khóa học chỉ lọc `trangThai=DA_DUYET` |
| Khóa học `DA_CONG_KHAI` | Đăng ký học viên | Guard FR-III-04 PRE-02: KH phải mở đăng ký |
| Khóa học có ≥1 học viên | Bắt đầu khóa (`DANG_DIEN_RA`) | Logic nghiệp vụ |
| Vụ việc `HOAN_THANH` trong kỳ | Đánh giá HQ chấm điểm | Auto-filter VV trong kỳ vào danh sách chấm |
| Vụ việc `HOAN_THANH` | Hợp đồng TV liên kết VV | Dropdown chỉ list VV `HOAN_THANH` |
| Hỏi đáp `DA_DUYET` | Auto đẩy vào Kho QA nguồn `TU_DONG` | Trigger BR-FLOW-XX |
| BE inject record Chi trả `CHO_TIEP_NHAN` | Workflow phê duyệt Chi trả | Module chặn nhập tay; chỉ test phần phê duyệt khi có record |
| CT HTPLDN GĐ1 `DANG_THUC_HIEN` + có VV/Chi trả/Đào tạo trong kỳ | Tạo Đợt báo cáo GĐ2 | Guard nghiệp vụ |
| Cổng PLQG đẩy phiên qua API | Test Phiên TV nhanh | Module chặn nhập tay; chỉ chờ tích hợp |

### 2.2 Ràng buộc mềm (có thể bypass nhưng nên tuân thủ)

| Trước | Sau | Vì sao nên |
|---|---|---|
| DM "Tiêu chí ĐG hiệu quả" tổng trọng số = 100% | Tạo kỳ Đánh giá HQ | Không = 100% sẽ chặn cứng (BR-CALC-04) |
| DM "Lĩnh vực PL" có đủ 6 lĩnh vực (Lao động/Thuế/Hợp đồng/DN/SHTT/Đất đai) | Phân công Đợt 2 cho 6 lĩnh vực | Thiếu = không seed đủ 6 row PC |
| Có ≥3 VV `HOAN_THANH` | Test Đánh giá HQ ý nghĩa | <3 = không đủ mẫu chấm điểm |
| Có ≥3 Hỏi đáp `DA_DUYET` | Verify Kho QA nguồn `TU_DONG` | Không thấy được auto-feed |
| ≥4 thư mục Biểu mẫu + ≥1 BM `CONG_KHAI` | Test API outbound `/api/v1/bieu-mau?la_cong_khai=1` | Trả rỗng nếu không có |

### 2.3 Module độc lập — chạy được ngay (không phụ thuộc module nghiệp vụ khác)

Chỉ cần LỚP 1 (QTHT) đã setup là chạy được:

| Module | Tại sao độc lập |
|---|---|
| Doanh nghiệp (CRUD) | Master, không phụ thuộc TVV/VV |
| Tư vấn viên (workflow active) | Master actor, độc lập với DN |
| Biểu mẫu (workflow `NHAP→CONG_KHAI→AN`) | Master tài liệu, không liên kết entity nghiệp vụ |
| CT HTPLDN GĐ1 Kế hoạch | Khung chỉ đạo, không cần số liệu trong kỳ |
| Đào tạo — Bài giảng (CRUD) | Tài liệu rời, không phụ thuộc CTĐT |
| Đào tạo — Giảng viên (CRUD) | Hồ sơ rời |
| Đào tạo — Ngân hàng câu hỏi | Pool câu hỏi rời |

→ **4 module này** + 3 sub-menu Đào tạo có thể chạy **song song** với mọi luồng khác.

> **Bảng nguồn dropdown 30+** (dropdown nào lấy data từ đâu, filter gì) đã move sang [system-overview.md §5](system-overview.md#5--bảng-nguồn-dropdown--30-dropdown-chính). Khi seed gặp dropdown rỗng → tra section đó.

---

## 3. Quy trình test 6 phase chi tiết

### 3.1 P0 — Chuẩn bị (T0, 0.5 ngày)

| Task | Acceptance | Output |
|---|---|---|
| T0.1 Verify env + 11 vai trò login | 10/11 PASS (DN role API-only) | `_prep-log.md` |
| T0.2 Tạo skeleton folder Round 4 | 11 subfolder created | — |

**C0 gate:** auto-pass → P1.

---

### 3.2 P1 — Smoke + LỚP 1-2 nền tảng (T1, 1 tuần)

#### Block A — Smoke 16 module (Ngày 1-2)

| Task | Tài khoản | Acceptance |
|---|---|---|
| T1.A1 Smoke 16 module × 5 vai trò chính | admin / qtht_01 / cb_nv_tw_01 / cb_pd_tw_01 / cb_nv_dp_01 | 16/16 module render cho cb_nv_tw_01 + qtht_01; role BN/ĐP scope ≥2 module |

#### Block B — Seed LỚP 1 + LỚP 2 nền tảng (Ngày 3-5)

| Task | Tài khoản | Acceptance | Có thể song song? |
|---|---|---|:---:|
| T1.B1 Seed Quản trị nền tảng | qtht_01 | DM ≥ fixture min · SLA 4 row · PC Đợt 1 6 row CB cho 6 lĩnh vực · Tiêu chí ĐG 4 row Σ=100% | — (làm trước) |
| T1.B2 Seed DN | cb_nv_tw_01 | ≥6 record `DN-{TINH}-{SEQ}`, auto-suggest NĐ39 OK. Fixture v2.5: 12 variant (6 chính `[1..6]` + 6 edge `[7..12]` boundary NĐ39 / scope ĐP / phụ nữ làm chủ) | ✅ song song B3, B4 |
| T1.B3 Seed TVV (state `MOI_DANG_KY`) | cb_nv_tw_01 | ≥6 TVV + upload chứng chỉ OK. Fixture v2.5: 12 variant (6 chính + 6 edge: reject path / TAM_DUNG / 3 cấp scope / CG-only) | ✅ song song B2, B4 |
| T1.B4 Seed Thư mục + Biểu mẫu (state `NHAP`) | cb_nv_tw_01 | ≥4 thư mục + ≥6 BM, FK `thu_muc_id` đúng. Fixture v2.5: 5 thư mục (thêm rỗng test xóa) + 11 BM (boundary 19MB / state AN / format .doc) | ✅ song song B2, B3 |

#### Block C — Pre-seed Tier 2 entry state (input cho Trụ A, Ngày 4-5)

> Tách riêng khỏi Block B để Trụ A P2 chỉ chạy workflow, không trộn seed + flow. 4 task này tạo data ở state khởi đầu (HD `MOI` / VV `DA_TIEP_NHAN` / TVCS `TIEP_NHAN` / HSPL `HIEU_LUC`) làm input cho A3/A4/A5.

| Task | Tài khoản | Acceptance | Có thể song song? |
|---|---|---|:---:|
| T1.C1 Seed Hỏi đáp entry `MOI` | cb_nv_tw_01 (SCR-II-01) | ≥6 record `HD-{YYYYMMDD}-SEQ` entry `MOI`. Fixture v2.5: 11 variant (6 chính + 5 edge bounce-back / CONG_KHAI / 4 kênh / pagination) | ✅ song song C2, C3, C4 |
| T1.C2 Seed Vụ việc entry `DA_TIEP_NHAN` | cb_nv_tw_01 (SCR-V.I-02) | ≥6 record VV bypass 2 state đầu, vào thẳng `DA_TIEP_NHAN` + #7 reserve Admin reopen. Fixture v2.5: 15 variant (6 chính + 9 edge YEU_CAU_BS x3 / TU_CHOI / DA_DANH_GIA / 3 cấp scope / file 10MB) | ✅ song song C1, C3, C4 |
| T1.C3 Seed TV chuyên sâu entry `TIEP_NHAN` | cb_nv_tw_01 (SCR-X1-02) | ≥6 record `TVCS-{YYYYMMDD}-SEQ`. Fixture v2.5: 10 variant (6 chính + 4 edge HUY / 3 hình thức HỒ_SƠ-VIDEO-SĐT / DN ngoài SME) | ✅ song song C1, C2, C4 |
| T1.C4 Seed HSPL entry `HIEU_LUC` | cb_nv_tw_01 (Tab HSPL trong SCR-V.III-02) | ≥6 record `HSPL-{YYYYMMDD}-SEQ` entry `HIEU_LUC` + 5 enum loại HS đầy đủ. Fixture v2.5: 10 variant (6 chính + 4 edge HET_HAN / THU_HOI / KHAC enum) | ✅ song song C1, C2, C3 |

**Soft gate tách 2 mức (R5 update 2026-04-27):**

- **C1a gate (cuối Ngày 5):** 4 seed-checklist Block B (QTHT/DN/TVV/Biểu mẫu) PASS + B1 partial accept → unblock chạy ngay **A1 (Workflow TVV)** + **Trụ B (Đào tạo)** + **Trụ C (Biểu mẫu workflow)** + **Trụ E (theo dõi)** song song với Block C đang chạy.
- **C1b gate (cuối T1):** 4 seed-checklist Block C (HD/VV/TVCS/HSPL) PASS → unblock **A3/A4/A5** + chuẩn bị **Trụ D**.
- **C1 final (cuối T1):** 8 seed-checklist + smoke report → user duyệt go P2 đầy đủ.

**Lý do tách:** A1+Trụ B+Trụ C+E không phụ thuộc Block C (xem [todo.md](todo.md) cột "Cần có sẵn"). Gate cứng 8/8 sẽ delay 4 trụ ~2-3 ngày vô ích.

---

### 3.3 P2 — 5 trụ song song (T2, 1 tuần) ⭐ TRỌNG TÂM

> **Mindset trụ:** mỗi trụ = "tạo data + chạy flow ngay + verify state cuối" cho 1 nhóm. Trụ độc lập → song song được.

#### 🟦 Trụ A — TVV → Phân công → VV → HD → TVCS (~5 ngày)

**Vì sao A đầu tiên:** TVV `DANG_HOAT_DONG` là phụ thuộc đắt nhất. 4 luồng LỚP 3 + Phân công Đợt 2 + 8 TC functional T4 đều cần.

| # | Task | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **A1** | Workflow TVV (5 bước) | `cb_nv_tw_01` → `cb_pd_tw_01` | ≥6 TVV state `MOI_DANG_KY` (T1.B3, fixture 12 variant) | ≥6 TVV `DANG_HOAT_DONG` + 6 TK TVV cấp. Pool 12 dùng cho test reject (TVV[7]) + TAM_DUNG (TVV[8]) + xóa mềm (TVV[11]) |
| **A2** | QTHT thêm PC Đợt 2 (≥6 row TVV × 6 lĩnh vực `uu_tien=2`) | `qtht_01` | A1 PASS | Modal PC HD/VV ≥2 gợi ý/lĩnh vực |
| **A3** | Workflow Vụ việc (8 bước) | CB NV → TVV → CB NV → CB PD | ≥6 VV state `DA_TIEP_NHAN` (T1.C2, fixture 15 variant) + TVV active từ A1 | ≥3 VV `HOAN_THANH` (cần cho Trụ D). Pool 15 dùng cho YEU_CAU_BS x3 (VV[11]) + TU_CHOI (VV[12]) + DA_DANH_GIA (VV[13]) + pagination |
| **A4** | Workflow Hỏi đáp (6 bước) | CB NV → CB/TVV → CB PD | ≥6 HD state `MOI` (T1.C1, fixture 11 variant) + PC từ A2 | ≥6 HD `DA_DUYET`/`CONG_KHAI`. Pool 11 dùng cho bounce-back (HD[7]) + 4 kênh đầy đủ |
| **A5** | Workflow TV chuyên sâu (5 bước) | CB NV → CG → CB PD | ≥6 TVCS state `TIEP_NHAN` (T1.C3, fixture 10 variant) + CG/TVV active từ A1 | ≥6 TVCS `DA_DUYET`. Pool 10 dùng cho HUY (TVCS[7]) + 3 hình thức |

**Nếu A1 fail:** gọi dev fix ngay (không retry quá 1 lần). Trong lúc chờ → switch sang Trụ B+C song song. A2-A5 + Trụ D đành block.

**Output:** `_pillar-A-result.md` (gộp 5 workflow report).

---

#### 🟩 Trụ B — Đào tạo (song song A, ~3 ngày)

| # | Task | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **B1** | Tạo 4 CTĐT | `cb_nv_tw_01` | LỚP 1 ✅ | 4 CTĐT `DU_THAO` |
| **B2** | Đẩy CTĐT → `DA_DUYET` | CB NV → CB PD | B1 | ≥1 CTĐT `DA_DUYET` |
| **B3** | Tạo 6 Khóa học gắn CTĐT | `cb_nv_tw_01` | B2 | 6 KH `DU_THAO` |
| **B4** | Tạo 6 Bài giảng (song song B1-B3) | `cb_nv_tw_01` | LỚP 1 ✅ | 6 BG `KICH_HOAT` |
| **B5** | Tạo Đề kiểm tra | `cb_nv_tw_01` | NHCH ≥7 ✅ (fixture 10 variant) + KH ≥1 từ B3 | ≥3 ĐKT `DU_THAO`. Fixture: 5 ĐKT (NGAU_NHIEN config DE/TB/KHO + DA_PHAN_PHOI scenario) |
| **B5b** | Workflow NHCH publish `NHAP` → `CONG_KHAI` + re-run ĐKT NGAU_NHIEN | `cb_nv_tw_01` | B5 NHCH ≥10 `NHAP` | ≥3 NHCH `CONG_KHAI` cover 3 mức độ DE/TB/KHO + 2 ĐKT NGAU_NHIEN PASS (B5 ⚠️ → ✅) |
| **B6** | Tạo 6 Giảng viên (song song B1-B5) | `cb_nv_tw_01` | LỚP 1 ✅ | 6 GV `DANG_HOAT_DONG` |
| **B7** | Workflow Khóa học đầy đủ (10 bước) | CB NV → CB PD → học viên | B3+B4+B5(sau B5b)+B6 | KH `HOAN_THANH` + chứng nhận |

**Nếu B2 fail (CTĐT không duyệt được — vấn đề Round 2):** xin dev mở endpoint duyệt nhanh hoặc SQL update. Không được thì B3+B5+B7 block; B4+B6 vẫn chạy độc lập.

**Output:** `_pillar-B-result.md`.

---

#### 🟨 Trụ C — Biểu mẫu (song song A+B, ~30 phút — nhanh nhất)

| # | Task | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **C1** | Workflow Biểu mẫu `NHAP → CONG_KHAI → AN` | `cb_nv_tw_01` | T1.B4 ✅ | ≥1 BM `CONG_KHAI` |

**Verify:** `GET /api/v1/bieu-mau?la_cong_khai=1` chỉ trả BM `CONG_KHAI`.

**Output:** `_pillar-C-result.md`.

---

#### 🟧 Trụ D — Hậu kỳ phụ thuộc Trụ A (sau A xong, ~3 ngày)

| # | Task | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **D1** | Tạo 1 kỳ Đánh giá HQ + tiêu chí | `cb_nv_tw_01` | LỚP 1 + ≥3 VV `HOAN_THANH` từ A3 + 1 TVV làm đánh giá viên | 1 kỳ ĐG + tiêu chí Σ=100% |
| **D2** | Workflow Đánh giá HQ (7 bước) | CB NV → CB PD → TVV → CB NV → CB PD | D1 | Kỳ ĐG `HOAN_THANH` + báo cáo TT17 auto |
| **D3** | Tạo 6 câu hỏi Kho QA (song song D1-D2) | CB NV → CB PD | LỚP 1 + HD `DA_DUYET` từ A4 (verify auto-feed nguồn `TU_DONG`) | 6 QA `DA_DUYET` + verify auto-feed |

**Lưu ý double-state Đánh giá HQ:** UI hiện `LAP_KE_HOACH`, DB lưu `NHAP` — assert cả 2.

**Output:** `_pillar-D-result.md`.

---

#### 🟥 Trụ E — Theo dõi unblock (xuyên suốt round, không gate)

| # | Module | Trạng thái 25/04 | Cách theo dõi |
|---|---|---|---|
| **E1** | Hợp đồng tư vấn (FR-X3-01) | 🚫 SCR-X3-01 chưa build (BUG-HDTV-001-R4) | Daily curl `GET /api/v1/hop-dong-tu-vans` + verify sidebar |
| **E2** | CT HTPLDN GĐ1 (FR-15) | 🚫 nút Tạo CT lỗi RangeError (BUG-CTHTPLDN-001-R4) | Daily MCP click thử nút Tạo CT |
| **E3** | Chi trả (FR-06) | 🚫 chờ LGSP đồng bộ | Daily verify SCR-V.II-01 list count |
| **E4** | Phiên TV nhanh (FR-13.A) | 🚫 chờ Cổng PLQG | Daily verify SCR-X2 list |

**Quy tắc:** mỗi sáng curl + MCP smoke → ghi 1 dòng vào `_pillar-E-status.md`. Hết tuần T3 chưa unblock → cascade-block toàn bộ downstream, dời Round 5. Trụ A+B+C+D vẫn pass thì G1/G2/G3 vẫn đạt.

---

**C2 gate (cuối T2):** 4 file `_pillar-{A,B,C,D}-result.md` + `_pillar-E-status.md` → user duyệt go P3.

---

### 3.4 P3 — LỚP 4-5 hậu kỳ + đầu ra (T3, 1 tuần)

> Phụ thuộc: Trụ E unblock. Nếu chưa unblock → cascade-block các task tương ứng.

| # | Task | Phụ thuộc | Acceptance |
|---|---|---|---|
| **P3.1** | Workflow Chi trả (7 state) | E3 unblock + A3 ≥1 VV `HOAN_THANH` + A1 TVV active | Happy path + BR-CALC-01/02 + over-cap + annual reset + immutability |
| **P3.2** | Workflow TV nhanh Phiên (5 state) | E4 unblock + D3 Kho QA `DA_DUYET` | Happy + auto `HET_HAN` 30 ngày + full-text BR-DATA-08 |
| **P3.3** | Workflow CT HTPLDN GĐ1 (5 state) | E2 unblock + LỚP 1 | Happy 5 bước CB NV ↔ CB PD |
| **P3.4** | Workflow CT HTPLDN GĐ2 Đợt BC (6 state) | P3.3 PASS + A3 (VV) + B7 (Đào tạo HOAN_THANH) + P3.1 (Chi trả) | Happy 6 bước cấp ĐP/BN → TW + auto-transition kép + BR-FLOW-08 |

**Output P3:** 4 workflow-test-report (CHITRA, TVNHANH, CTHTPLDN GĐ1, CTHTPLDN GĐ2).

**C3 gate:** 4 workflow report → user duyệt go P4.

---

### 3.5 P4 — Functional 16 module (T4, 1 tuần)

Bỏ happy path (đã cover P2-P3). Test case lỗi + nhánh phụ + edge + 40 TC phân quyền/module.

#### Daily schedule

| Ngày | Module | TC | Phụ thuộc |
|---|---|---|---|
| **1** | Hỏi đáp (36 TC) | DN + PC TH A; skip TC "ưu tiên TVV" nếu A2 miss |
| **1** | CG/TVV (31 TC) | TVV + 1 TVV active từ A1 |
| **1** | Vụ việc (35 TC) | DN + TVV active + SLA + DM "Loại HT" + "Lĩnh vực" |
| **2** | Doanh nghiệp (18 TC) | DM "Loại DN" + "Tỉnh thành" + công thức NĐ39 |
| **2** | TV chuyên sâu (44 TC) | DN + CG active sau A1 |
| **2** | Khóa học (40 TC) | CTĐT từ B1 + GV từ B6 + NHCH từ B5 |
| **3** | Dashboard (34 TC) | Tất cả entity LỚP 2-4 đã có ≥1 record state cuối |
| **3** | Quản trị HT (32 TC) | LỚP 1 ✅ |
| **3** | Đánh giá HQ (40 TC) | D2 PASS |
| **4** | Biểu mẫu (38 TC) | T1.B4 + T3.10 ≥1 BM `CONG_KHAI` |
| **4** | TV nhanh (39 TC) | D3 + P3.2 unblock |
| **4** | Chi trả (30 TC) | P3.1 unblock |
| **5** | Báo cáo (38 TC) | Tất cả LỚP 2-4 có data |
| **5** | HĐ tư vấn (29 TC) | E1 unblock |
| **5** | CT HTPLDN (42 TC) | E2 unblock + P3.3+P3.4 |
| **5** | API kết nối (42 TC) | Upstream data state cuối |

**T4.17 Edge** — Optimistic lock, concurrent edit, CSRF basic, session limit, pagination guard, BR-EC-01..23 → `edge-report.md`.

**Acceptance/module:** P0 100% + P1 ≥90% + 0 Blocker. Smoke phân quyền 40 TC lồng (positive + negative + URL direct).

**C4 gate:** 16 functional report + edge report → user duyệt go P5.

---

### 3.6 P5 — TC chi tiết + UI + Regression + Tổng kết (T5, 1 tuần)

| Task | Nội dung | Output |
|---|---|---|
| **T5.1** TC chi tiết field-level | 6 module ưu tiên (HD/CGTVV/VV/DN/TVCS/Khóa học) — sinh BVA/EP/XSS qua `/bmad-testarch-test-design`, ≥30 TC/module | `tc-{module}-chitiet.md` |
| **T5.2** Review UI 16 module | Compare với Prototype `https://prototype-dusky-alpha.vercel.app/dashboard.html` | 16× `design-review-report-{module}.md` |
| **T5.3** Regression bug Round 3 | Retest tất cả Major/Critical từ R3, kỳ vọng ≥80% closed | `regression-round4-report.md` |
| **T5.4** 6 luồng chéo module | DN↔VV / TVV↔VV / HD↔Phê duyệt / HD→KhoQA auto / DN↔VV↔HSPL / VV↔Chi trả | `cross-module-report.md` |
| **T5.5** Phi chức năng | Page load <3s/module · auto-refresh dashboard 60s · XSS basic · CSRF · session timeout | `nonfunc-report.md` |
| **T5.6** Tổng kết Round 4 | Pass rate P0/P1/P2 + bug by severity + G1-G9 + cascade-block registry + release recommendation | `test-summary-round4.md` |

**C5 gate:** user duyệt → kết thúc Round 4 → kick off Round 5.

---

### 3.7 R5 — Phân quyền đầy đủ (sau R4 PASS, +1.5 tuần)

11 vai trò × 16 module × CRUD ~1000 TC + DI-01..09 deep test data isolation. Plan riêng: [`_archive/round5/plan.md`](_archive/round5/plan.md).

**Vì sao tách Round 5:**
- Round 4 đã có 40 TC smoke phân quyền/module (G4) → đủ verify happy path.
- Round 5 deep test mọi tổ hợp → tốn time + ít rủi ro hơn nên tách sau.

---

## 4. Hiện trạng 2026-04-25

### 4.1 Đã hoàn thành ✅

| Phase | Việc | Output |
|---|---|---|
| P0 | T0.1 Env + 10/11 TK login + T0.2 skeleton | `_prep-log.md` |
| P1 | T1.A1 Smoke 14/16 PASS · T1.B1-B4 Seed QTHT (partial) + DN + TVV + Biểu mẫu | `smoke-test-report.md` + 4 seed-checklist |
| P2 (LỚP 2 còn lại đã seed) | T2.A1-A4 Seed Hỏi đáp + Vụ việc + TVCS + HSPL | 4 seed-checklist |
| P2 (Đào tạo partial) | T2.A5d Ngân hàng câu hỏi 7/7 ✅ | `seed-checklist-NHCH.md` |

### 4.2 Đang chờ chạy ⏳

| Trụ | Task | Block bởi |
|---|---|---|
| Trụ A | A1-A5 (TVV→PC→VV→HD→TVCS) | Sẵn sàng chạy ngay |
| Trụ B | B1, B2, B3, B4, B5 (ĐKT), B6, B7 | Sẵn sàng (B4+B6 song song) |
| Trụ C | C1 (Biểu mẫu workflow) | Sẵn sàng — nhanh nhất |
| Trụ D | D1, D2, D3 | Chờ A1 + A3 + A4 |
| P3 đầu ra | P3.1, P3.2, P3.3, P3.4 | Chờ Trụ E unblock |

### 4.3 Đang BLOCKED 🚫

| Module | Bug | Tác động |
|---|---|---|
| Hợp đồng tư vấn (M14) | BUG-HDTV-001-R4 Critical Open — SCR-X3-01 chưa build | T2.B1 + workflow + T4.14 (29 TC) |
| CT HTPLDN GĐ1 (M11) | BUG-CTHTPLDN-001-R4 Critical Open — FE submit RangeError | T2.C1 + P3.3 + P3.4 + T4.15 (42 TC) |
| Chi trả (M8) | Chờ LGSP/DVC | T2.B4 + P3.1 + T4.12 (30 TC) |
| Phiên TV nhanh (M10A) | Chờ Cổng PLQG | T2.B5 + P3.2 + T4.11 (39 TC) |

### 4.4 Đã đóng (closed-verified)

| Bug | Module | Đóng ngày |
|---|---|---|
| BUG-TVV-001-R4 | TVV DatePicker | 24/04 retry-3 |
| BUG-HDCR-500-R4 | Hỏi đáp BE 500 | 24/04 retry-1 |
| BUG-TVCS-CR-R4 | TVCS routing | 24/04 retry-1 |
| BUG-HSPL-TAB-R4 | HSPL UI tab + BE endpoint | 25/04 |
| BUG-BIEUMAU-001-R4 | JWT revoke | 25/04 workaround curl |

---

## 5. Tài khoản test + quy ước fallback

| Vai trò | _01 chính | _02 fallback | _03 phân quyền test |
|---|---|---|---|
| QTHT | qtht_01 | qtht_02 | qtht_03 |
| CB NV TW | cb_nv_tw_01 | cb_nv_tw_02 | cb_nv_tw_03 |
| CB NV BN | cb_nv_bn_01 (BKH) | cb_nv_bn_02 (BTC) | cb_nv_bn_03 (BCT) |
| CB NV ĐP | cb_nv_dp_01 (AG) | cb_nv_dp_02 (BG) | cb_nv_dp_03 (BNI) |
| CB PD TW/BN/ĐP | cb_pd_*_01 | cb_pd_*_02 | cb_pd_*_03 |
| CG/DN/NHT/TVV | cg_01 / dn_01 / nht_01 / tvv_01 | _02 | _03 |
| Admin | admin | — | — |

**Mật khẩu chung:** `Secret@123` · **OTP bypass:** `666666`.

**Quy tắc fallback** (per CLAUDE.md Rule 7): account lock → thử `_02` cùng `vai_tro` + `don_vi`. Hết → STOP báo user. CB NV BN/ĐP fallback giữ cùng đơn vị (BKH/BTC/BCT khác cấp = không tương đương).

---

## 6. Công cụ test

**Primary:** Chrome DevTools MCP (CLAUDE.md 2026-04-21).
**Fallback:** gstack `$B chain` (atomic chain, Rule 5-11).
**Cả 2 fail:** mark BLOCKED, escalate user.

**Verification per task:**

| Loại task | Cách verify |
|---|---|
| Smoke | `take_snapshot` + 1 screenshot/role |
| Seed | count rows + capture Sample ID |
| Workflow | screenshot state từng bước + `list_network_requests` 200 |
| Functional | screenshot happy + negative toast + DOM error |
| Phân quyền smoke | `evaluate_script` check button visibility |
| TC chi tiết | output từ `/bmad-testarch-test-design` + chạy thật |
| UI audit | screenshot side-by-side với Prototype |

---

## 7. Quy trình log bug

Mỗi bug **bắt buộc** SRS reference (memory `feedback_bug_must_have_srs_ref.md`):
- FR-xx / BR-yy / SCR-zz row / Error code cụ thể.
- Không có ref → ghi "Observations" section, không log bug.

**Severity:** Blocker / Critical / Major / Minor / Trivial.
**Template:** [`output/template/bug-report-template.md`](../output/template/bug-report-template.md).

**File organization:**
- P1-P2 Seed: `bug-report-seed-tier{N}.md` (typically 0 bug mới — chủ yếu track regression + observation).
- P3 Workflow: `bug-report-workflow-{module}.md` hoặc roll-up.
- P4 Functional: `bug-report-{module}.md` per module.
- P5: consolidate vào `test-summary-round4.md`.

**Bug Open/Active phải embed screenshot inline base64** (memory `feedback_bug_report_embed_screenshot.md`), không chỉ link relative — vì user gửi 1 file `.md` cho dev, link relative bị broken.

---

## 8. Risk register

| # | Rủi ro | Khả năng | Tác động | Cách xử |
|---|---|---|---|---|
| R1 | Env down 1-2 ngày | TB | Cao | Escalate dev, log `env-down-YYYY-MM-DD.md`, resume |
| R2 | Account lock toàn bộ vai trò | Thấp | Cao | Rule 7 fallback `_01→_02→_03`. CB NV BN/ĐP có 3 đơn vị khác, fallback sang đơn vị khác |
| R3 | Trụ A1 SM-TVV fail | TB | Cao | Switch ngay sang Trụ B+C song song. Cascade A2-A5 + Trụ D log explicit. KHÔNG retry quá 1 lần |
| R4 | Trụ B2 (CTĐT duyệt) fail (lặp R2 cũ) | Cao | TB | Xin dev endpoint hoặc SQL. Không được → B3+B5+B7 block, B4+B6 vẫn chạy độc lập |
| R5 | Trụ E (HDTV/CTHTPL/Chi trả/TVNhanh) không unblock đến hết T3 | Cao | Cao | Daily ping. Quá ngày 7 → cascade-block, dời R5. Trụ A+B+C+D vẫn pass thì G1/G2/G3 vẫn đạt |
| R6 | Permission Round 5 dev fix auth trong gap → stale | TB | Thấp | Re-snapshot button visibility đầu mỗi batch |
| R7 | Regression bug R3 dev chưa fix | Cao | TB | T5.3 log still-open; không block pass-criteria trừ Blocker/Critical |
| R8 | MCP crash ≥3 lần/session | Thấp | TB | Fallback gstack `$B`; cả 2 fail → escalate |
| R9 | Cascade-block domino | TB | TB | Log riêng cascade-block registry. Exit criteria tính trên module không bị block |
| R10 | TC chi tiết `/bmad-testarch-test-design` chạy lâu | TB | Thấp | Giới hạn 6 module ưu tiên. Overrun → cắt 3 module (VV/HD/CHITRA) |

---

## 9. Cấu trúc output

```
output/qa-reports/round4-2026-04-24/
├── _prep-log.md                          (P0 ✅)
├── _checkpoint-P1.md                     (P1 ✅)
├── _pillar-A-result.md                   (P2 Trụ A: TVV+PC+VV+HD+TVCS)
├── _pillar-B-result.md                   (P2 Trụ B: Đào tạo)
├── _pillar-C-result.md                   (P2 Trụ C: Biểu mẫu)
├── _pillar-D-result.md                   (P2 Trụ D: Đánh giá HQ + Kho QA)
├── _pillar-E-status.md                   (P2 Trụ E: theo dõi unblock)
├── _checkpoint-P2.md                     (cuối P2 — gộp 5 trụ)
├── _checkpoint-P3.md                     (cuối P3)
├── _checkpoint-P4.md                     (cuối P4)
├── _checkpoint-P5.md                     (cuối P5 — final before summary)
├── smoke-test/
│   └── smoke-test-report.md
├── seed/
│   ├── seed-checklist-QTHT.md
│   ├── seed-checklist-DN.md
│   ├── seed-checklist-TVV.md
│   ├── seed-checklist-BIEUMAU.md
│   ├── seed-checklist-HOIDAP.md
│   ├── seed-checklist-VUVIEC.md
│   ├── seed-checklist-TVCS.md
│   ├── seed-checklist-HSPL.md
│   ├── seed-checklist-CTDT.md
│   ├── seed-checklist-KHOAHOC.md
│   ├── seed-checklist-BAIGIANG.md
│   ├── seed-checklist-NHCH.md
│   ├── seed-checklist-DEKT.md
│   ├── seed-checklist-GIANGVIEN.md
│   ├── seed-checklist-HDTV.md
│   ├── seed-checklist-DANHGIA.md
│   ├── seed-checklist-KHOCH.md
│   ├── seed-checklist-CHITRA.md
│   ├── seed-checklist-TVNHANH.md
│   └── seed-checklist-CTHTPLDN.md
├── workflow/
│   ├── workflow-test-report-TVV.md
│   ├── workflow-test-report-HOIDAP.md
│   ├── workflow-test-report-VUVIEC.md
│   ├── workflow-test-report-TVCS.md
│   ├── workflow-test-report-KHOAHOC.md
│   ├── workflow-test-report-BIEUMAU.md
│   ├── workflow-test-report-CHITRA.md
│   ├── workflow-test-report-TVNHANH.md
│   ├── workflow-test-report-CTHTPLDN.md
│   └── workflow-test-report-DANHGIA.md
├── bug-reports/                          (consolidated per phase)
│   ├── bug-report-seed-tier{N}.md
│   ├── bug-report-workflow-{module}.md
│   └── bug-report-{module}.md (functional)
├── functional/{16-module}/
│   ├── functional-test-report.md
│   ├── bug-report.md
│   └── screenshots/
├── chi-tiet/
│   └── tc-{P0-module}-chitiet.md         (6 module ưu tiên)
├── design-review/{16-module}/
│   ├── design-review-report.md
│   └── screenshots/design-diff/
├── regression/
│   ├── regression-round4-report.md
│   └── cross-module-report.md
├── edge-report.md
├── nonfunc-report.md
└── test-summary-round4.md
```

---

## 10. Quy ước viết report

- **Ngôn ngữ:** tiếng Việt đơn giản, câu ngắn. Tránh jargon dev (đã liệt kê 8 thuật ngữ trong [system-overview.md §5](system-overview.md#5-quy-ước-thuật-ngữ--bản-dịch-dễ-hiểu)).
- **Mỗi report có:** mục tiêu / phương pháp / TC chạy / kết quả / bug log / screenshots / next step.
- **Bug embed inline screenshot base64** cho bug Open. Bug Closed-verified có thể link relative archive.
- **Mỗi phase done → tạo `_checkpoint-P{N}.md`** với 4 cột: Test gì / Kết quả / File lưu / Nếu fail xử thế nào.

---

## 11. Tham chiếu

| Cần biết về... | Đọc file |
|---|---|
| **Tổng quan hệ thống + 16 module + 50 màn hình** | [system-overview.md](system-overview.md) |
| Click-by-click + selector từng workflow | [`input/flow-module.md`](../input/flow-module.md) |
| Bảng transition chi tiết với cột Trigger/Guard/Action | [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) |
| Map entity tạo ở màn nào / đọc tại màn nào | [`input/data/entity-map.md`](../input/data/entity-map.md) |
| Giá trị seed cụ thể (MST, tên, ngày, số tiền) | [`input/data/seed-fixture.yaml`](../input/data/seed-fixture.yaml) |
| Tài khoản test | [`input/users.csv`](../input/users.csv) |
| Plan Round 5 phân quyền | [_archive/round5/plan.md](_archive/round5/plan.md) |
| Tiến độ R4 hiện tại (✅/⏳/🚫) | [todo.md](todo.md) |

---

## 12. Lịch sử thay đổi

- **2026-04-25 v2.0** — Consolidate `plan.md` v1.8 + `plan-v1.9-pillar.md` thành 1 file đầy đủ A-Z. Bổ sung **§2 Bảng ràng buộc dữ liệu A→B→C** + **§3 Bảng nguồn dropdown 30+**. Giữ nguyên scope 16/16 module + 5 tuần + G1-G9 mục tiêu. Restructure P2 thành 5 trụ song song (A=TVV+VV+HD+TVCS / B=Đào tạo / C=Biểu mẫu / D=Hậu kỳ / E=theo dõi unblock). Bỏ 1 gate hold-for-review (5→4). Round 5 Permission tách cuối. Ngôn ngữ đơn giản hóa, dùng "LỚP" thống nhất, dịch 8 thuật ngữ kỹ thuật.
- **2026-04-25 v2.1** — Move §3 Bảng nguồn dropdown 30+ sang `system-overview.md §5` (kiến thức tham chiếu hệ thống, không phải hành động test). Renumber các section sau §3: §4 Hiện trạng → §3.x P0..P5+R5 + §4 Hiện trạng + §5 TK + §6 Tool + §7 Bug + §8 Risk + §9 Output + §10 Quy ước + §11 Tham chiếu + §12 Lịch sử.
- **2026-04-25 v2.2** — Bỏ ref `logic-data.md` ở §11 Tham chiếu. File này archive sang `tasks/_archive/` vì 100% nội dung đã consolidate vào `system-overview.md` (5 LỚP, FR-code prereq §5.4, Bản đồ tab cần data §9).
- **2026-04-25 v2.3** — Rename `test-plan.md` → `plan.md` để khớp convention `/agent-skills:plan` skill (skill auto-save plan vào `tasks/plan.md` + todo vào `tasks/todo.md`). Backup `todo.md` cũ (v1) → `tasks/_archive/todo-v1-2026-04-25.md`. Tạo `todo.md` mới khớp ID test-plan v2.2 (5 trụ A-E + P3.1-P3.4 + T4.1-T4.17 + T5.1-T5.6).
- **2026-04-25 v2.4** — Sync count refs với `seed-fixture.yaml` v2.5 (~70 variant edge case bổ sung):
  - §3.2 P1 Block B (T1.B2/B3/B4): đổi count cố định "6 DN / 6 TVV / 4 thư mục + 6 BM" → "≥6 ... fixture v2.5: 12/12/5/11 variant".
  - §3.3 Trụ A (A1/A3/A4/A5): note pool fixture available + scenario coverage cho mỗi pillar (vd "Pool 15 VV cho YEU_CAU_BS x3 + TU_CHOI + DA_DANH_GIA").
  - §3.3 Trụ B (B5): ĐKT count "3" → "≥3 (fixture 5)".
  - §2.2 Ràng buộc mềm: "4 thư mục" → "≥4 thư mục".
  - Mục đích: tester biết fixture có pool, không bị ép cứng "= 6"; pool edge dùng cho P4 functional + R5 permission scope test + pagination ≥21.
- **2026-04-27 v2.5** — Sync §3.2 P1 với `tasks/todo.md`: thêm **Block C — Pre-seed Tier 2 entry state** (T1.C1 HD `MOI` / T1.C2 VV `DA_TIEP_NHAN` / T1.C3 TVCS `TIEP_NHAN` / T1.C4 HSPL `HIEU_LUC`) làm input cho Trụ A P2. C1 gate update từ 4 → 8 seed-checklist. Lý do: §3.3 Trụ A đã reference `T1.C1/C2/C3` nhưng plan trước đó không định nghĩa Block C → tách pre-seed entry-state khỏi seed master Block B để Trụ A P2 chỉ tập trung chạy workflow.
- **2026-04-27 v2.6** — Tách C1 gate cứng → **soft gate 2 mức C1a/C1b** + thêm icon `🟢 sẵn sàng chạy` vào header todo. (1) C1a (Block B PASS) → unblock A1+Trụ B+Trụ C+E ngay, song song Block C. (2) C1b (Block C PASS) → unblock A3/A4/A5+Trụ D. Lý do: Block B 3/4 PASS + B1 partial đã đủ dependency cho A1/B/C/E (xem cột "Cần có sẵn") — gate cứng 8/8 delay 4 trụ ~2-3 ngày vô ích. Icon mới phân biệt task đã ready (dep PASS) với task còn chờ dep cụ thể.
