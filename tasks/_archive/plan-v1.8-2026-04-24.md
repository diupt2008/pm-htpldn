# QA Execution Plan — Round 4 PM HTPLDN (v1.3)

**Ngày lập:** 2026-04-24 (v1.3 restructure pure phase GĐ 0→1→2→3→chi tiết per user review)
**Based on:** [output/test-strategy.md](../output/test-strategy.md) v3.0 §3.2 + §8.3 + §8.4 + [CLAUDE.md](../CLAUDE.md) + [input/flow-module.md](../input/flow-module.md) + [input/users.csv](../input/users.csv)
**Scope:** 16/16 module full — Smoke → Seed → Workflow → Functional → Chi tiết + UI + Regression. Full permission matrix tách **[Round 5 riêng](round5/plan.md)**.
**M8 Chi trả + M10A TV Nhanh:** data BE-synced từ DVC/LGSP/Cổng PLQG — test flow xử lý downstream.
**Timeline:** 5 tuần (2026-04-24 → 2026-05-29). Mỗi tuần = 1 giai đoạn pure, gate giữa phase.
**Executor:** 1 QA AI agent (MCP Chrome DevTools primary, gstack `$B` fallback)
**Output root:** `output/qa-reports/round4-2026-04-24/`
**Account convention:** per `input/users.csv` — `qtht_01..03`, `cb_nv_{tw,bn,dp}_01..03`, `cb_pd_{tw,bn,dp}_01..03`, `cg/dn/nht/tvv_01..03`, `admin`. Fallback chain `_01 → _02 → _03` per CLAUDE.md Rule 7.

---

## 1. Mục tiêu & Exit criteria

| # | Tiêu chí | Ngưỡng | Nguồn |
|---|---------|--------|-------|
| G1 | P0 pass rate | 100% | §10.1 |
| G2 | P1 pass rate | ≥ 90% | §10.1 |
| G3 | Blocker/Critical open | 0 | §10.1 |
| G4 | Authorization smoke-level | 40 TC/module `funtion/7.X §Authorization` PASS 100% (Round 4). Full matrix ~1.000 TC → Round 5. | §5, §7.17 |
| G5 | State machine happy path | 100% (10 SM: TVV, HOIDAP, VUVIEC, TVCS, KHOAHOC, CHITRA, TVNHANH, CT_HTPLDN, DANHGIA, **BIEUMAU**) — DANHGIA bổ sung v1.7 (gap so với strategy §6, có flow `flow-module §11`); BIEUMAU bổ sung v1.8 (tách actor CB NV ra T3.10, flow `flow-module §3` SM-BIEUMAU NHÁP↔CÔNG KHAI↔ẨN) | §10.1 |
| G6 | Data isolation smoke-level | DI-01..DI-09 sample ≥1 module/scenario PASS. Deep test → Round 5. | §5.2 |
| G7 | Audit log CUD | Full trace | §10.1 |
| G8 | UI deviation vs Prototype | Chỉ Minor/Trivial open | §8.3 Lệnh 5 |
| G9 | TC chi tiết field-level | Module P0 (6 module: HD/CG-TVV/VV/DN/TVCS/KHOAHOC) có TC chi tiết BVA/EP/XSS sinh từ `/bmad-testarch-test-design` | §8.4 |

Không đạt G1/G3/G5 → **FAIL**, redelivery. G2/G4/G6/G7/G8/G9 partial → **PASS with caveats**.

---

## 2. Dependency Graph (Tier 0 → 4)

```
Tier 0 — QTHT prereq (BƯỚC 1 flow-module)
  DANH_MUC + DON_VI + TAI_KHOAN + CAU_HINH_SLA + CAU_HINH_PHAN_CONG
                              │
                              ▼
Tier 1 — Master (actor + tài liệu nền)
  M1 DOANH_NGHIEP + M2 TU_VAN_VIEN + M14 BIEU_MAU (CB NV, BƯỚC 2 ③ logic-data.md)
                              │
                              ▼
Tier 2 — Transactional hub
  M6.1 CHUONG_TRINH_DT → KHOA_HOC
  M4 HOI_DAP
  M3 VU_VIEC + M5 TV_CHUYEN_SAU_YC + HO_SO_PHAP_LY_DN
                              │
                              ▼
Tier 3 — Downstream
  M7 HOP_DONG_TV + M9 DANH_GIA_HQ + M10B KHO_CAU_HOI (thủ công)
  M8 HO_SO_CHI_TRA (BE auto-seed DVC/LGSP)
  M10A TV_NHANH_PHIEN (BE auto-seed Cổng PLQG)
                              │
                              ▼
Tier 4 — Output
  M11.1 CT_HTPLDN_KE_HOACH → M11.2 CT_HTPLDN_DOT_BC
  M12 BAO_CAO + M13 DASHBOARD
```

> **⚠️ Lưu ý Tier classification M11 (sync 2026-04-24 v1.6):** `flow-module.md` đã tách FR-15 CT HTPLDN thành 2 giai đoạn (§4 GĐ1 Kế hoạch ở BƯỚC 2 vs §13 GĐ2 Đợt BC ở BƯỚC 5). **M11.1 Kế hoạch thực ra thuộc Tier 1** (chỉ cần FR-10, không cần upstream transaction). Plan vẫn giữ gộp M11 ở Tier 4 để module adjacent, nhưng tester cần biết: GĐ1 Kế hoạch có thể seed + workflow độc lập sớm sau Tier 0 nếu muốn rebase; GĐ2 Đợt BC **mới thực sự là Tier 4** (cần VV/Chi trả/Đào tạo trong kỳ).

**Pure-seed mindset:** Tier 2-4 CHỈ cần Tier 0-1 + entity tham chiếu tồn tại (bất kỳ state). Seed HĐ tại Tier 3 CHƯA cần VV HOAN_THANH — chỉ cần VV tồn tại (entry state DA_TIEP_NHAN OK). Workflow (GĐ 2) sẽ push entity lên state đích sau.

**Cascade-block rule:** Module M[i] BLOCKED do upstream → mark `BLOCKED-CASCADE + reason code`, chuyển module kế cùng tier, **không dừng round**. Liệt kê riêng trong `test-summary-round4.md` để tracking redelivery. Loại khỏi phân số pass-rate.

---

## 3. Phase & Checkpoint Map — Pure phase (v1.3)

| Tuần | Phase | Giai đoạn strategy | Mục tiêu | Output chính | Checkpoint |
|------|-------|---------------------|---------|--------------|------------|
| **T0** (0.5 ngày) | P0 Prep | — | Verify env, tool, login 11 role, archive round 3 | `_prep-log.md` | **C0** auto-gate |
| **T1** | P1 Smoke + Seed Tier 0-1 | GĐ 0 + GĐ 1 (partial) | Ngày 1-2: Smoke 16 module. Ngày 3-5: Seed QTHT + DN + TVV | `smoke-test-report.md` + 4 seed-checklist | **C1** hold-for-review |
| **T2** | P2 Seed Tier 2-4 (xong hẳn GĐ 1) | GĐ 1 (complete) | Seed 11 entity entry state: HD, VV, TVCS, HSPL, CTDT, KHOAHOC, HDTV, DANHGIA, KHOCH, CT_HTPLDN + verify BE-synced Chi trả/TV Nhanh | 11 seed-checklist | **C2** hold-for-review |
| **T3** | P3 Workflow (GĐ 2 xong hẳn) | GĐ 2 | 10 SM walk full lifecycle (happy + reject + auto-transition + guard) — +DANHGIA v1.7, +BIEUMAU v1.8 | 10 workflow-test-report | **C3** hold-for-review |
| **T4** | P4 Functional (GĐ 3 xong hẳn) | GĐ 3 | 16 module functional (negative + alternative + edge) + smoke-auth 40 TC/module + BR-EC-01..23 | 16 functional-test-report + edge-report | **C4** hold-for-review |
| **T5** | P5 Chi tiết + UI + Regression + Summary | §8.4 + Lệnh 5 | TC chi tiết field-level (BVA/EP/XSS) cho 6 module P0 + /design-review 16 module + regression round 3 + cross-module + non-func + summary | tc-chitiet/* + 16 design-review + regression + summary | **C5** human sign-off → chuyển Round 5 |

**Checkpoint protocol:** Hold-for-review bắt buộc cho C1, C2, C3, C4, C5. Auto-continue chỉ C0 prep. QA KHÔNG tự tiến vào phase kế khi chưa có user "go". Sau C5 PASS → close Round 4 → kick off [Round 5 Permission Matrix](round5/plan.md).

**5 điểm dễ sai khi test workflow (v1.7 — lấy từ `logic-data.md §8`):** mỗi báo cáo workflow phải kiểm tra rõ 5 điểm dưới, không bỏ qua:

- **T3.3 Vụ việc:** Hiện tại nhập tay nên bỏ qua 2 state đầu (`MỚI TẠO` + `CHỜ TIẾP NHẬN`), vào thẳng `DA_TIEP_NHAN`. Khi nào DVC kết nối xong → test lại đủ 9 state (làm sau Round 4).
- **T3.5 Khóa học:** State `DA_CONG_KHAI` có trong DB ENUM nhưng SRS Phụ lục C.2 quên ghi transition tới — hỏi BA xác nhận. Tạm test theo UI thực tế.
- **T3.6 Chi trả:** Phải kiểm tra SCR-V.II-01 **không có nút `[+ Thêm mới]`**. Nếu có = BUG (đây là module duy nhất bị chặn nhập tay theo spec).
- **T3.7 Tư vấn Nhanh / Kho Q&A:** Test cả 2 nguồn riêng — (a) Nhập tay (`nguon=THU_CONG`) phải qua CB PD duyệt, (b) Tự động (`nguon=TU_DONG`) đẩy từ Hỏi đáp `DA_DUYET` không cần duyệt lại.
- **T3.9 Đánh giá HQ:** Module này có 2 tên state cùng lúc — màn hình hiện `LAP_KE_HOACH` nhưng DB lưu `NHAP`. Phải check cả 2.

**Checkpoint file protocol (v1.5 — 2026-04-24):** Sau khi complete mọi tasks trong 1 phase (P0/P1/P2/P3/P4/P5), QA **bắt buộc tạo file `_checkpoint-P{N}.md`** trong `output/qa-reports/round4-2026-04-24/` với format **4-cột focus** cho mọi test trong phase:

### Section 1 — Table chính: `# | Đã test gì | Kết quả | File lưu | Nếu fail, phương án xử lý`

Liệt kê từng test discrete đã chạy (không phải task level chung chung). Kết quả dùng ký hiệu:
- ✅ PASS
- ❌ FAIL (regression / new bug / missing feature)
- 🚫 BLOCKED (cascade từ fail khác — link tới mục root)
- ⏸️ PENDING-VERIFY (defer — ghi rõ defer đi đâu)

Cột "Nếu fail, phương án xử lý" bắt buộc cho mọi ❌ / 🚫 — ghi cụ thể: log bug / re-test sau dev fix / cascade-block / defer module / user decide A/B/C. Không để trống.

### Section 2 — Tổng kết

- Con số: Tests chạy / PASS / FAIL / BLOCKED / Regression / Pending
- Bugs logged formal phase này (bảng bug-id + severity + link)
- Cascade-block registry state (3 cột: module / reason / downstream)
- Data seeded ready cho phase kế
- Verdict: clean PASS / PARTIAL / FAIL

### Section 3 — C-gate decision

Nếu C-gate là hold-for-review: list 2-3 option A/B/C cho user quyết định, kèm time impact + rủi ro + QA recommend.

File là input chính cho user tại C-gate. Format reference: [_checkpoint-P1.md](../output/qa-reports/round4-2026-04-24/_checkpoint-P1.md).

---

## 4. Tasks chi tiết per phase

### P0 — Prep (0.5 ngày, 2026-04-24)

**T0.1 Env + Tool verification**
- Acceptance: 11 vai trò login OK (fallback `_01 → _02 → _03`), MCP `new_page` + `wait_for` + `take_snapshot` hoạt động, templates ≥10 file trong `output/template/`.
- Verify: `curl -sSf http://103.172.236.130:3000/`, MCP smoke, `ls output/template/ | wc -l` → ≥10.
- Output: `_prep-log.md`.

**T0.2 Archive round 3 + create round 4 skeleton**
- Acceptance: round 3 archived; `round4-2026-04-24/{smoke-test,seed,workflow,functional,chi-tiet,design-review,regression,evidence,screenshots}/` created.

---

### P1 — Smoke + Seed Tier 0-1 (Tuần 1, 2026-04-25 → 05-01)

#### Block A: GĐ 0 Smoke (Ngày 1-2)

**T1.A1 Smoke 16 module (Lệnh 1)**
- Input: `@test-strategy.md §1.1 + §A + §9`, 11 vai trò từ `users.csv`.
- Flow: MCP login → `take_snapshot` sidebar → click 16 sidebar items → verify landing per role major (admin, cb_nv_tw_01, cb_pd_tw_01, cb_nv_bn_01, cb_nv_dp_01).
- Acceptance: **16/16 module render** cho cb_nv_tw_01 + qtht_01; role BN/ĐP scope ≥2 module. Chi trả + TV Nhanh: ≥1 record BE-synced.
- Verify: `smoke-test-report.md` bảng 16×5 role checkpoint.
- Gate fail → **abort round**, escalate dev.

#### Block B: GĐ 1 Seed Tier 0-1 (Ngày 3-5)

**T1.B1 Seed Tier 0 — QTHT prereq**
- Input: `@seed-fixture.yaml > tier_0_prerequisite` (v2.4.0 thêm 3 entity), `@flow-module.md §BƯỚC 1`, `qtht_01`.
- Flow: verify/seed DANH_MUC (gồm Lĩnh vực PL + Loại DN + **Tiêu chí ĐG hiệu quả** FR-VIII-11) + DON_VI + TAI_KHOAN (SCR-VIII-01/02/03/04/13/14) + **CAU_HINH_SLA** Tab "SLA" (FR-VIII-10) + **CAU_HINH_PHAN_CONG** Tab "Phân công mặc định" Đợt 1 CB-only (FR-II-NEW-01).
- ⚠️ **Sync v1.8 (2026-04-25):** BIEU_MAU **KHÔNG seed ở T1.B1** — actor đúng theo `logic-data.md` BƯỚC 2 ③ + `flow-module.md` §3 SM-BIEUMAU = CB NV (không phải QTHT). Tách sang **T1.B4** dưới đây.
- Acceptance: 3 master data đếm được ≥ fixture min; SLA 4 row với `qua_han_he_so > 1` (DDL 3.4.3.14, không phải `qua_han_phan_tram` của FR-VIII-10 Inputs — M1 đang chờ BA confirm); PC Đợt 1 có 6 row CB cho 6 lĩnh vực; Tiêu chí ĐG 4 row Σ trọng số = 100% (BR-CALC-04).
- Verify: `seed-checklist-QTHT.md`.
- ⚠️ **Đợt 2 backfill PC (TVV phụ trách)** dời sang **T2.0.5** (sau T3.1 SM-TVV PASS) — xem mục mới P2 Block A.

**T1.B2 Seed Tier 1 — DOANH_NGHIEP (M1)**
- Input: `@seed-fixture.yaml > dn_variants[0..5]`, `cb_nv_tw_01`.
- Flow: SCR-V.III-02 → `[+ Thêm mới]` 6 variant.
- Acceptance: 6 record `DN-{TINH}-{SEQ}` ở entry state, auto-suggest NĐ39 OK.
- Verify: `seed-checklist-DN.md`.

**T1.B3 Seed Tier 1 — TU_VAN_VIEN (M2)**
- Input: `@seed-fixture.yaml > tvv_variants[0..5]`, `cb_nv_tw_01`.
- Flow: SCR-IV-02 → `[+ Thêm mới]` 6 variant → entry `MOI_DANG_KY`.
- Acceptance: 6 TVV entry state + upload chứng chỉ OK.
- Verify: `seed-checklist-TVV.md`.
- Known regression: `qa_htpldn_tvv_cr_round1` Critical DatePicker — check dev fix.

**T1.B4 Seed Tier 1 — BIEU_MAU (M14) — bổ sung v1.8 (2026-04-25)**
- Input: `@seed-fixture.yaml > thu_muc_bieu_mau_variants[1..4] + bieu_mau_variants[1..6]` (line 1500-1620, "Tier 1 master tài liệu — BƯỚC 2"), `cb_nv_tw_01`.
- Flow: SCR-VII-02 → tạo 4 thư mục (HĐ Lao động / HĐ Dân sự-Thương mại / Biểu mẫu DN / Biểu mẫu Thuế) → upload 6 biểu mẫu (FK `thu_muc_id` đúng + file doc/docx ≤20MB) → entry state `NHÁP`.
- Acceptance: 4/4 thư mục + 6/6 biểu mẫu PASS state NHÁP. FR-VII-04 Y fields đầy đủ (`thu_muc_id`, `ten_bieu_mau`, `file`, `file_dinh_dang`, `file_kich_thuoc`).
- Verify: `seed-checklist-BIEUMAU.md`.
- **Tách từ T1.B1** lý do: actor đúng = CB NV (không phải QTHT), khớp `logic-data.md` BƯỚC 2 ③ + `flow-module.md` §3 SM-BIEUMAU + entity-map E18 (phụ trợ, không gắn BƯỚC).
- **Cascade UNBLOCK:** T3.10 workflow SM-BIEUMAU + T4.10 Functional Biểu mẫu (38 TC) + T4.16 API outbound `GET /api/v1/bieu-mau?la_cong_khai=1` (FR-09).
- **Có thể chạy song song T1.B2/T1.B3** (entity độc lập, không phụ thuộc DN/TVV).

**C1 Gate (end T1):**
- Evidence: smoke-report + 4 seed-checklist (QTHT, DN, TVV, BIEUMAU).
- Summary: 16 module render + Tier 0-1 đủ data.
- **Human review** → go T2 / hold / abort.

---

### P2 — Seed Tier 2-4 xong hẳn GĐ 1 (Tuần 2, 05-02 → 05-08)

> **Pure seed mindset:** CHỈ tạo entry state. KHÔNG advance workflow. KHÔNG switch account. Bug phát hiện khi seed → note, không log (log ở T4 Functional).

#### Block A: Seed Tier 2 (Ngày 1-3)

**T2.0.5 Backfill CAU_HINH_PHAN_CONG Đợt 2 — TVV phụ trách (defer-task, kích hoạt sau T3.1)**
- Input: `@seed-fixture.yaml v2.4.0 > tier_0_prerequisite.cau_hinh_phan_cong_variants.dot_2_tvv_backfill` (**6 row, đủ 6 lĩnh vực PL**), `qtht_01`. Sample IDs (verified memory `qa_htpldn_tvv_seed_round4_retry3`): TVV-BTP-TW-0001..0006.
- Prereq cứng: (1) T3.1 SM-TVV happy path PASS → 6 TVV state `ĐANG HOẠT ĐỘNG`. (2) Mỗi TVV có `tai_khoan_id != null` — QTHT cấp TK qua SCR-VIII-02 sau khi duyệt (FK nullable theo SRS srs-fr-04 line 1057).
- Flow: vào MH-10.7 Tab "Phân công mặc định" → `[+ Thêm mapping]` 6 row mới (KHÔNG update row Đợt 1) — LAO_DONG→TVV[1], THUE→TVV[2], HOP_DONG→TVV[3], DOANH_NGHIEP→TVV[4], SHTT→TVV[5], DAT_DAI→TVV[6], all uu_tien=2.
- Acceptance: 6 row mới state `KICH_HOAT`; modal Phân công Hỏi đáp/VV ở **cả 6 lĩnh vực** hiện ≥2 gợi ý (CB ưu_tien=1 + TVV uu_tien=2).
- Verify: append vào `seed-checklist-QTHT.md` mục "Đợt 2 PC backfill".
- Cascade-skip if: T3.1 SM-TVV BLOCKED → T4.1 HOI_DAP TC P1 "ưu tiên gợi ý TVV theo lĩnh vực" cũng skip (defer Round 5).

**T2.A1 Seed HOI_DAP (M4)** — `cb_nv_tw_01` SCR-II-01 → 6 variant entry `MOI` → `seed-checklist-HOIDAP.md`
**T2.A2 Seed VU_VIEC (M3)** — SCR-V.I-02 → 6 variant entry `DA_TIEP_NHAN` → `seed-checklist-VUVIEC.md`
  - Note v1.6: fixture `vu_viec_variants` có 7 records; variant #7 là `scenario_reserve` cho T3.3 SM-VUVIEC test Admin reopen (`DA_TIEP_NHAN → kiểm tra fail → TU_CHOI → Admin reopen → DA_TIEP_NHAN`). T2.A2 chỉ seed [1..6], #7 để T3.3.
**T2.A3 Seed TV_CHUYEN_SAU (M5)** — SCR-X1-02 → 6 variant entry `TIEP_NHAN` → `seed-checklist-TVCS.md`
**T2.A4 Seed HO_SO_PHAP_LY_DN (SRS FR-X.1-04 UC150)** — 6 variant từ `seed-fixture.yaml > ho_so_phap_ly_dn_variants[1..6]` (add v2.3, rewrite v2.3.1 theo SRS). Screen: tab "Hồ sơ pháp lý DN" trong **MH-07.2 chi tiết DN** (SCR-X1-03 đã deprecated v2.1). Entry state `HIEU_LUC` (SRS Inputs #10, default). Enum `loai_ho_so`: GIAY_PHEP / HOP_DONG / GIAY_CN / QUYET_DINH / KHAC. Actor: CB NV (TW/BN/ĐP) hoặc NHT. → `seed-checklist-HSPL.md`
**T2.A5 Seed M6 Đào tạo — 4 sub-menu (sync fixture v2.3 2026-04-24)** — gộp seed toàn module Đào tạo trong 1 task để align với `flow-module §8` 4 sub-menu + `seed-fixture §Tier 2 Đào tạo`:
  - **T2.A5a** CHUONG_TRINH_DT (M6.1-parent) — 4 CTDT entry `DU_THAO` — `seed-fixture > chuong_trinh_dao_tao_variants[1..4]` → `seed-checklist-CTDT.md`
  - **T2.A5b** KHOA_HOC (M6.1) — 6 KH entry `DU_THAO` mapped CTDT — `seed-fixture > khoa_hoc_variants[1..6]` → `seed-checklist-KHOAHOC.md`
  - **T2.A5c** BAI_GIANG (M6.2) — 6 bài giảng entry `KÍCH HOẠT` — `seed-fixture > bai_giang_variants[1..6]` → `seed-checklist-BAIGIANG.md`
    - ⚠️ **Observation — verify UI khi seed:** SRS FR-III-08/09 Inputs (line 573-582) KHÔNG có field `trang_thai` — chỉ có `cong_khai` boolean. Fixture + flow-module dùng state "KÍCH HOẠT → VÔ HIỆU HÓA". Khả năng dev UI extended SRS hoặc fixture bịa. Tester chụp screenshot form + ghi lại control nào (dropdown trạng thái / toggle cong_khai) → nếu UI không có state "KÍCH HOẠT" → log bug fixture/flow deviate SRS.
  - **T2.A5d** NGAN_HANG_CH + DE_KIEM_TRA (M6.3) — **7 câu hỏi** + 3 đề KT entry `KÍCH HOẠT` / `DỰ THẢO` — `seed-fixture > ngan_hang_ch_variants[1..7]` + `de_kiem_tra_variants[1..3]` → `seed-checklist-NHCH.md` + `seed-checklist-DEKT.md`
    - Fix count 2026-04-24 sync v1.6: fixture line 948 comment `7 records: #6+#7 cùng DAT_DAI để cung cấp đủ câu cho de_kiem_tra[3] Luật đất đai 2024`. Seed thiếu #7 → de_kiem_tra[3] fail downstream.
  - **T2.A5e** GIANG_VIEN (M6.4) — **6 giảng viên** entry `ĐANG HOẠT ĐỘNG` — `seed-fixture > giang_vien_variants[1..6]` → `seed-checklist-GIANGVIEN.md`
    - Fix count 2026-04-24 sync v1.6: fixture line 1038 comment `6 records at DEFAULT state`.
    - ⚠️ **Observation — verify UI khi seed:** SRS FR-III-11 line 827 ghi enum `DANG_GIANG_DAY / TAM_DUNG`. Fixture/plan/flow dùng label `ĐANG HOẠT ĐỘNG` — có thể dev UI deviate SRS, cần verify label thực tế form. Nếu khác → log bug deviate.
  - Known blocker R2: CTDT approval chặn KH (qa_htpldn_khoahoc_cr_round2) → workaround dev endpoint/SQL hoặc cascade-block T2.A5b, T2.A5c-e có thể seed độc lập.
  - **Acceptance:** ≥1 record / sub-entity (nếu cascade-block CTDT thì T2.A5b chỉ đánh BLOCKED, các sub còn lại vẫn phải PASS).

#### Block B: Seed Tier 3 + verify BE-synced (Ngày 4-5)

**T2.B1 Seed HOP_DONG_TV (M7)** — 6 variant mã `HDTV-YYYYMMDD-SEQ`, N:N VV (bất kỳ state) → `seed-checklist-HDTV.md`
**T2.B2 Seed DANH_GIA_HQ (M9)** — 1 kỳ + tiêu chí SUM=100% → `seed-checklist-DANHGIA.md`
**T2.B3 Seed KHO_CAU_HOI (M10B thủ công)** — 6 câu hỏi `nguon=THU_CONG` entry `CHO_DUYET` → `seed-checklist-KHOCH.md`
**T2.B4 Verify BE-synced HO_SO_CHI_TRA (M8)** — list SCR-V.II-01 ≥3 record entry (MOI_NOP/CHO_TIEP_NHAN) → `seed-checklist-CHITRA.md`
  - Cascade-block nếu 0 record: `BLOCKED-UPSTREAM-SYNC-MISSING`, escalate integration.
**T2.B5 Verify BE-synced TV_NHANH_PHIEN (M10A)** — list SCR-X2 ≥3 record entry → `seed-checklist-TVNHANH.md`

#### Block C: Seed Tier 4 (Ngày 5)

**T2.C1 Seed CT_HTPLDN (M11)** — 1 KH entry `DU_THAO` (GĐ1 Kế hoạch, flow-module §4 BƯỚC 2) → `seed-checklist-CTHTPLDN.md`
  - ⚠️ **Sync 2026-04-24 v1.6:** DOT_BC (GĐ2, flow-module §13 BƯỚC 5) entry `TAO_DOT` có guard "CT phải `DANG_THUC_HIEN`" → **pure-seed KHÔNG làm được**, phải đi qua SM-KH-CTHTPL workflow (push CT: DU_THAO → DA_CONG_BO → DANG_THUC_HIEN). Seed DOT_BC dời sang **T3.8 workflow phase** chứ không làm ở T2.C1.

**C2 Gate (end T2):**
- Evidence: 11 seed-checklist Tier 2-4.
- Summary: tất cả entity Tier 2-4 có ≥1 Sample ID entry state; cascade-block liệt rõ.
- **Human review** → go T3 / hold.

---

### P3 — Workflow xong hẳn GĐ 2 (Tuần 3, 05-09 → 05-15)

> 10 SM × ~1 ngày/SM. Mỗi SM: happy + reject + auto-transition + guard. Account switch bắt buộc theo `flow-module.md` cột "Account thao tác".

**T3.1 Workflow SM-TVV** — happy (MOI_DANG_KY → DANG_HOAT_DONG 5 bước) + YEU_CAU_BS + reject + guard xóa. Account: `cb_nv_tw_01` → `cb_pd_tw_01`. → `workflow-test-report-TVV.md`

**T3.2 Workflow SM-HOIDAP** — happy 6 bước + auto-transition (checkbox "Đã trả lời" → CHO_PD) + reject + cascade phân công. → `workflow-test-report-HOIDAP.md`. Known: `qa_htpldn_hoidap_flow_round1` BUG-HDFLOW-001 — verify dev fix.

**T3.3 Workflow SM-VUVIEC** — happy 8 bước + YEU_CAU_BS x3 → auto `TU_CHOI` lần 4 + immutability sau DA_DUYET. Account: CB NV → TVV → CB NV → CB PD. → `workflow-test-report-VUVIEC.md`

**T3.4 Workflow SM-TVCS** — happy (TIEP_NHAN → DA_DUYET 5 bước) + auto-transition HOAN_THANH→CHO_PD + auto-save draft 30s + reject. Account: CB NV → CG → CB PD. → `workflow-test-report-TVCS.md`

**T3.5 Workflow SM-KHOAHOC (+SM-DKDT)** — happy 10 bước (DU_THAO → HOAN_THANH + chứng nhận) + reject CHO_DUYET→DU_THAO + HUY cascade DANG_KY + SM-DKDT independent. → `workflow-test-report-KHOAHOC.md`. Known: `qa_htpldn_khoahoc_flow_round2` BE 502 publish + timezone -1.

**T3.6 Workflow SM-CHITRA** — happy với data BE-synced: CB NV tiếp nhận → thẩm định → CB PD duyệt → chi trả → HOAN_THANH. BR-CALC-01/02 quy mô DN + over-cap + annual reset + immutability. → `workflow-test-report-CHITRA.md`. Cascade-block nếu T2.B4 `BLOCKED`.

**T3.7 Workflow SM-TVNHANH** — happy (MOI → DANG_TIM_KIEM → DA_GOI_Y → CB_TRA_LOI → HOAN_THANH) + auto HET_HAN 30 ngày + full-text search BR-DATA-08. → `workflow-test-report-TVNHANH.md`. Cascade-block nếu T2.B5 `BLOCKED`.

**T3.8 Workflow SM-CT_HTPLDN (KH + DOT_BC)** — happy SM-KH-CTHTPL 8 state (DU_THAO → DA_CONG_BO → DANG_THUC_HIEN → HOAN_THANH) + SM-DOT-BC 6 state (TAO_DOT → DA_TONG_HOP) + auto-transition kép + BC ĐP+BN → TW (BR-FLOW-08). → `workflow-test-report-CTHTPLDN.md`
  - ⚠️ **Sync 2026-04-24 v1.6 — test theo thứ tự 2 phase:** Phase A (SM-KH-CTHTPL GĐ1 Kế hoạch, flow-module §4) test SỚM trong T3.8 vì chỉ cần Tier 0-1. Phase B (SM-DOT-BC GĐ2 Đợt BC, flow-module §13) test SAU khi phase A push CT → `DANG_THUC_HIEN` **và** Tier 3 (VV/Chi trả/Đào tạo) đã có ≥1 record trong kỳ (cần T3.3 VV + T3.5 KHOAHOC đã hoàn thành happy path). Nếu T3.6 CHITRA cascade-block thì DOT_BC vẫn test được chỉ số VV/Đào tạo.

**T3.9 Workflow SM-DANHGIA (v1.7 — bổ sung mới)** — chạy đủ 7 bước theo `flow-module.md §11`: `LAP_KE_HOACH` → `PHAN_CONG` → `CHO_DUYET_PC` → `THUC_HIEN` → `BAO_CAO` → `CHO_PHE_DUYET` → `HOAN_THANH`. Đổi account: `cb_nv_tw_01` (CB NV lập KH) → `cb_pd_tw_01` (CB PD duyệt phân công) → 1 TVV ACTIVE (đánh giá viên chấm điểm) → `cb_nv_tw_01` (trình báo cáo) → `cb_pd_tw_01` (duyệt cuối). Test thêm nhánh từ chối: CB PD từ chối phân công → quay về `LAP_KE_HOACH`; từ chối báo cáo → quay về `BAO_CAO`. **Phải check 5 điểm §3 mục T3.9:** màn hình hiện `LAP_KE_HOACH` nhưng DB lưu `NHAP` → check cả 2. → `workflow-test-report-DANHGIA.md`
  - **Cần có sẵn trước:** T2.B2 đã seed 1 kỳ đánh giá + tiêu chí (tổng trọng số = 100%) + ≥3 Vụ việc `HOÀN THÀNH` trong kỳ (cần T3.3 đã chạy xong happy path với ≥3 record — dùng preset P4 trong `flow-module.md` Phụ lục 2).
  - **Quy tắc cần kiểm tra:** BR-CALC-04 tổng trọng số = 100% (check ở bước 1 lập KH); báo cáo TT17 tự sinh sau khi chấm xong bước 5; sau khi vào `DANG_DANH_GIA` thì không sửa được nữa (test ở functional 7.8).
  - **Bị block khi nào:** Nếu T3.3 chưa đủ 3 VV `HOÀN THÀNH` → đánh dấu chờ T3.3 chạy xong rồi quay lại test, không dừng cả round.

**T3.10 Workflow SM-BIEUMAU (v1.8 — bổ sung mới)** — happy `flow-module.md §3`: NHÁP → CÔNG KHAI → ẨN. Account: `cb_nv_tw_01` (toàn bộ luồng — không có phê duyệt cấp 2). Flow: chọn biểu mẫu NHÁP → click `[Công khai]` → API đẩy file lên Cổng PLQG → state CÔNG KHAI → click `[Ẩn]` → state ẨN. → `workflow-test-report-BIEUMAU.md`
  - **Cần có sẵn trước:** T1.B4 PASS ≥4 biểu mẫu state NHÁP.
  - **Quy tắc cần kiểm tra:** chỉ biểu mẫu CÔNG KHAI mới xuất hiện ở `GET /api/v1/bieu-mau?la_cong_khai=1` (FR-09 outbound, public — verify bằng curl sau khi advance state); BR-FLOW-07 không cần phê duyệt cấp 2 (CB NV tự bật/tắt).
  - **Cascade UNBLOCK:** T4.10 Functional Biểu mẫu (TC liên quan state advance) + T4.16 Functional API outbound BIEU_MAU.

**C3 Gate (end T3):**
- Evidence: 10 workflow-test-report (TVV, HOIDAP, VUVIEC, TVCS, KHOAHOC, CHITRA, TVNHANH, CTHTPLDN, DANHGIA, BIEUMAU).
- Summary: 10 SM happy 100% + reject/auto/guard verified + 5 gotcha asserted + regressions status.
- **Human review** → go T4 / hold.

---

### P4 — Functional xong hẳn GĐ 3 (Tuần 4, 05-16 → 05-22)

> 16 module × negative + alternative + edge + smoke-auth 40 TC/module. Skip happy (đã cover T3 workflow). Reference `functional-test-report-{module}.md`.

**Daily schedule (~3-4 module/ngày):**

**Ngày 1:**
- **T4.1 Functional Hỏi đáp** 36 TC (P0 11+P1 21+P2 4) → `functional-test-report-HOIDAP.md`
  - *Cần seed trước:* DN (T1.B2) + Cấu hình phân công Case A (CB phụ trách — đã có ở T1.B1). Case B (TVV phụ trách) chỉ cần khi test TC "ưu tiên gợi ý TVV theo lĩnh vực" — phải đợi T3.1 chạy xong (TVV ACTIVE) rồi seed sau.
  - *Nếu thiếu thì skip:* T2.A1 hiện ✅ đã unblock. Nếu Case B chưa seed → skip TC liên quan ưu tiên TVV, dời sang Round 5.
- **T4.2 Functional CG/TVV** 31 TC (P0 10+P1 17+P2 4) → `functional-test-report-CGTVV.md`
  - *Cần seed trước:* TVV entry MOI_DANG_KY (T1.B3 ✅) + 1 TVV ACTIVE (sau T3.1) cho TC test dropdown phân công.
  - *Nếu thiếu thì skip:* T1.B3 hiện ✅ đã unblock.
- **T4.3 Functional Vụ việc** 35 TC (P0 14+P1 16+P2 5) → `functional-test-report-VUVIEC.md`
  - *Cần seed trước:* DN (T1.B2) + TVV ACTIVE (sau T3.1) + Cấu hình SLA (T1.B1) + DM "Loại hình HT" + "Lĩnh vực PL". TC liên kết HSPL phải chờ T2.A4 unblock.
  - *Nếu thiếu thì skip:* TVV chưa ACTIVE → bỏ TC phân công NHT, các TC khác chạy bình thường. T2.A4 còn block → bỏ TC tab HSPL liên kết, TC khác vẫn test được.

**Ngày 2:**
- **T4.4 Functional DN** 18 TC → `functional-test-report-DN.md`
  - *Cần seed trước:* DM "Loại DN" + "Tỉnh thành" (Tier 0) + công thức tự gợi ý quy mô NĐ39/2018 từ Số LĐ + Doanh thu (BR-CALC).
  - *Nếu thiếu thì skip:* không có ràng buộc đặc biệt (DN là master CRUD độc lập). Tab #2 Hồ sơ PL phải chờ T2.A4 unblock; Tab #3 Lịch sử + Tab #4 Chi trả test ở P5 cross-module nếu prereq chưa đủ.
- **T4.5 Functional TV Chuyên sâu** 44 TC → `functional-test-report-TVCS.md`
  - *Cần seed trước:* DN (T1.B2) + 1 CG/TVV ACTIVE sau T3.1. 3 UC API inbound UC149/UC151/UC153 ở Round 4 chỉ test negative (do chưa có LGSP).
  - *Nếu thiếu thì skip:* T2.A3 hiện ✅ đã unblock. Nếu CG chưa ACTIVE → bỏ TC phân công CG, dời lại.
- **T4.6 Functional Đào tạo** 40 TC → `functional-test-report-KHOAHOC.md`
  - *Cần seed trước:* CTDT entry DU_THAO (T2.A5a) + Giảng viên ACTIVE (T2.A5e) + Ngân hàng câu hỏi (T2.A5d) cho TC tạo đề KT. Happy path khóa học đã chạy ở T3.5.
  - *Nếu thiếu thì skip:* Nếu T2.A5b Khóa học bị block (CTDT chưa duyệt — rủi ro R6) → bỏ TC workflow khóa học, vẫn test riêng được Bài giảng/NHCH/Giảng viên.

**Ngày 3:**
- **T4.7 Functional Dashboard** 34 TC → `functional-test-report-DASHBOARD.md`
- **T4.8 Functional Quản trị HT** 32 TC → `functional-test-report-QTHT.md`
- **T4.9 Functional Đánh giá HQ** 40 TC → `functional-test-report-DANHGIA.md` *(SM happy đã cover T3.9 v1.7. Gotcha double-state SM=`LAP_KE_HOACH`/DB=`NHAP` đã verify ở T3.9 — functional T4.9 chỉ test negative + alternative + edge.)*

**Ngày 4:**
- **T4.10 Functional Biểu mẫu** 38 TC → `functional-test-report-BIEUMAU.md`
  - *Cần seed trước:* T1.B4 (4 thư mục + 6 biểu mẫu state NHÁP) + T3.10 (≥1 biểu mẫu state CÔNG KHAI để test API outbound).
  - *Nếu thiếu thì skip:* TC liên quan API public — nếu T3.10 chưa chạy thì bỏ, dời sang sau khi advance state.
- **T4.11 Functional TV Nhanh** 39 TC → `functional-test-report-TVNHANH.md`
- **T4.12 Functional Chi trả** 30 TC → `functional-test-report-CHITRA.md`

**Ngày 5:**
- **T4.13 Functional Báo cáo** 38 TC → `functional-test-report-BAOCAO.md`
- **T4.14 Functional Hợp đồng TV** 29 TC → `functional-test-report-HDTV.md`
- **T4.15 Functional CT HTPLDN** 42 TC → `functional-test-report-CTHTPLDN.md`
- **T4.16 Functional API chia sẻ** 42 TC (Bruno/curl/k6/mTLS) → `functional-test-report-API.md`

**T4.17 Edge + BR-EC-01..23** — Optimistic lock, concurrent edit, CSRF basic, session limit, pagination guard → `edge-report.md`

Mỗi task acceptance: P0 100% + P1 ≥90% + 0 Blocker per module. Smoke-auth 40 TC lồng trong mỗi module (positive + negative + URL direct).

**C4 Gate (end T4):**
- Evidence: 16 functional-test-report + edge-report + 16 bug-report.
- Summary: G1+G2+G3+G4+G5+G7 status; bug by severity.
- **Human review** → go T5 / hold redelivery module fail.

---

### P5 — TC chi tiết + UI + Regression + Summary (Tuần 5, 05-23 → 05-29)

**T5.1 TC chi tiết field-level (§8.4 `/bmad-testarch-test-design`)**
- Input: SRS + Prototype + `funtion/7.X-{module}.md` cho 6 module P0: HOI_DAP, CG/TVV, VUVIEC, DN, TVCS, KHOAHOC.
- Flow: Mỗi module sinh TC chi tiết BVA (Boundary Value Analysis), EP (Equivalence Partitioning), XSS injection.
- Acceptance: 6 file `output/test-cases/tc-{module}-chitiet.md` + chạy TC sinh ra, log bug nếu có.
- Verify: mỗi file có ≥30 TC chi tiết field-level.

**T5.2 UI/UX audit 16 module (Lệnh 5 /design-review)**
- Input: Prototype `https://prototype-dusky-alpha.vercel.app/dashboard.html` + SCR-* trong `funtion/7.X`.
- Acceptance: 16 report Minor/Trivial only (Critical UI đã log T4).
- Output: 16× `design-review-report-{module}.md` + `screenshots/design-diff/*.png`.

**T5.3 Regression — re-test round-3 bugs**
- Input: round 3 memory (qldn_ui, qtht_fr01..16, dm_dungchung, cauhinh_ui, tkpq_ui, hoidap_flow, khoahoc_flow, tvv_cr, vuviec_cr, ...).
- Acceptance: ≥80% Major/Critical closed hoặc downgraded.
- Output: `regression-round4-report.md`.

**T5.4 Cross-module integration 6 flow**
- DN↔VV, TVV↔VV, HD↔Phê duyệt, VV↔Chi trả (synced data), HD auto→KHO_CAU_HOI, DN/VV/HSPL.
- Acceptance: 6/6 flow PASS cross-reference count (cascade-block loại khỏi).
- Output: `cross-module-report.md`.

**T5.5 Non-functional basic**
- Perf: page load < 3s per module; auto-refresh dashboard 60s.
- Security: XSS basic, CSRF header, session timeout.
- Output: `nonfunc-report.md`.

**T5.6 Test Summary Report Round 4**
- Consolidation: pass rate P0/P1/P2, bug by severity, exit criteria G1-G9, cascade-block registry, release recommendation.
- Output: `test-summary-round4.md`.

**C5 Gate (end T5 = Round 4 complete):**
- **Human sign-off** → accept Round 4 → kick off [Round 5 Permission Matrix](round5/plan.md) / redelivery / defer release.

---

## 5. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | Env 103.172.236.130 down 1-2 ngày | Medium | High | Escalate dev, log `env-down-YYYY-MM-DD.md`, resume where left off |
| R2 | Account lock → fallback chain hết | Low | High | Rule 7 auto-fallback `_01 → _02 → _03`. CB NV BN/DP có 3 đơn vị khác nhau (BKH/BTC/BCT, AG/BG/BNI) — fallback sang đơn vị khác nếu cần |
| R3 | Workflow SM fail chặn Functional phase | Medium | High | C3 hold-for-review, báo dev fix; nếu 1 SM fail → cascade-block module đó ở T4, không dừng T4 |
| R4 | Permission matrix tách Round 5 — dev fix auth trong gap có thể làm stale | Medium | Low | Round 5 re-snapshot button visibility đầu mỗi batch; ghi rõ ngày test |
| R5 | Regression round-3 bugs dev chưa fix | High | Medium | T5.3 log still-open; không block pass-criteria trừ Blocker/Critical |
| R6 | CTDT→KH blocker R2 (qa_htpldn_khoahoc_cr_round2) | High | Medium | Nhờ dev endpoint approve trực tiếp, hoặc cascade-block M6.1 KH + skip sang module kế |
| R7 | MCP crash ≥3 lần/session | Low | Medium | Fallback gstack `$B` per CLAUDE.md Rule 6/7; cả 2 fail → escalate |
| R8 | Data đồng bộ DVC/LGSP/Cổng PLQG trống hoặc format lỗi | Medium | High | T2.B4/B5 verify ≥3 record; rỗng → `BLOCKED-UPSTREAM-SYNC-MISSING`, cascade-block T3.6/T3.7 |
| R9 | Cascade-block domino (1 block → nhiều downstream block) | Medium | Medium | Log riêng cascade-block registry trong summary; exit criteria tính trên module không bị block |
| R10 | T5 TC chi tiết `/bmad-testarch-test-design` chạy lâu hoặc output rộng | Medium | Low | Giới hạn 6 module P0 thay vì 16; nếu overrun → cắt xuống 3 module quan trọng nhất (VV/HD/CHITRA) |
| R11 | HSPL bị block kéo dài (BUG-HSPL-TAB-R4 phát hiện 2026-04-24, lặp lại BUG-QLDN-UI-001 từ 2026-04-22 chưa fix) — block phần Preset P1 Tab #2 (cross-module DN/VV/HSPL) ở P5 T5.4 | Medium | High | (a) Báo dev BE+FE owner cụ thể, hàng ngày hỏi status từ 2026-04-25; (b) Đếm ngày trong bảng cascade-block (todo.md); (c) Nếu đến ngày 7 (~2026-05-01) vẫn chưa fix → đánh dấu phần HSPL = bị block hết Round 4, dời sang Round 5 test sau khi dev fix; (d) Các tab khác trong DN detail (Tab #1/#3/#4) không liên quan HSPL vẫn test bình thường |

---

## 6. Session & Time Budget

**Per task budget:**
- Smoke 16 module: 1-2 ngày
- Seed entity: 20-30 phút/entity × 11 entity = 4-6 giờ/ngày × 5 ngày (T2)
- Workflow SM: 30 phút default / 60 phút SM phức tạp × 10 SM = 1 SM/ngày (T3) — DANHGIA T3.9 ~30 phút (CRUD + 7 bước, không lồng đa role phức tạp); BIEUMAU T3.10 ~20 phút (3 state, không phê duyệt cấp 2 — nhanh nhất trong 10 SM)
- Functional module: 45 phút × 3-4 module/ngày (T4)
- TC chi tiết: 60-90 phút/module × 6 module = 1-2 ngày
- UI audit: 30 phút/module × 16 module = 1 ngày
- Regression + cross + nonfunc + summary: 2 ngày (T5)

**Session split:**
- T1 Block A+B cùng session OK.
- T2 mỗi block có thể split session để tránh context bloat.
- T3 mỗi SM = session mới (workflow account switch nhiều).
- T4 mỗi module = session mới.
- T5 mỗi task = session mới.

**Daily cap:** 6-8 giờ active, 2 giờ report/triage.

---

## 7. Tool Strategy

**Primary:** Chrome DevTools MCP (CLAUDE.md 2026-04-21).
**Fallback:** gstack `$B chain` atomic (Rule 5-11 archived).
**Cả 2 fail:** BLOCKED, escalate user.

**Verification per task:**
- Smoke: `take_snapshot` + 1 screenshot
- Seed: count rows + Sample ID capture
- Workflow: screenshot state từng bước + `list_network_requests` 200
- Functional: screenshot happy + negative toast + DOM error
- Smoke-auth: `evaluate_script` check button visibility
- TC chi tiết: `/bmad-testarch-test-design` output file + test run evidence
- UI: screenshot vs Prototype side-by-side

---

## 8. Bug logging policy

Mỗi bug **bắt buộc** SRS reference (memory `feedback_bug_must_have_srs_ref.md`):
- FR-xx / BR-yy / SCR-zz row / Error code cụ thể.
- Không ref → ghi "Observations" section, không log bug.

Severity: §10.2 (Blocker / Critical / Major / Minor / Trivial).
Template: `output/template/bug-report-template.md`.

**File organization (v1.4 — 2026-04-24):**
- Mỗi phase tạo **1 bug-report consolidated** trong `bug-reports/` folder để dễ tổng hợp.
- **P1-P2 Seed phase**: typically 0 new bugs (pure seed mindset per template §Nguyên tắc) — chủ yếu track R1 regressions + observations. File naming: `bug-report-seed-tier{N}.md`.
- **P3 Workflow phase**: log workflow/transition bugs per SM. File naming: `bug-report-workflow-{SM}.md` (hoặc roll-up phase-level).
- **P4 Functional phase** (primary bug logging): mỗi module 1 file `bug-report-{module}.md` như trước.
- **P5** consolidate vào `test-summary-round4.md` Section "Bug roll-up by severity + phase".
- Trong checklist/report per task, khi gặp observation/regression → reference bug-report consolidated + chỉ ghi tóm tắt 1 dòng trong checklist, không duplicate chi tiết.

---

## 9. Output structure

```
output/qa-reports/round4-2026-04-24/
├── _prep-log.md                        (P0)
├── _checkpoint-P1.md                   (v1.5 — phase rollup P1)
├── _checkpoint-P2.md                   (phase rollup P2)
├── _checkpoint-P3.md                   (phase rollup P3)
├── _checkpoint-P4.md                   (phase rollup P4)
├── _checkpoint-P5.md                   (phase rollup P5 = final before summary)
├── smoke-test/
│   └── smoke-test-report.md
├── seed/
│   ├── seed-checklist-QTHT.md
│   ├── seed-checklist-DN.md
│   ├── seed-checklist-TVV.md
│   ├── seed-checklist-HOIDAP.md
│   ├── seed-checklist-VUVIEC.md
│   ├── seed-checklist-TVCS.md
│   ├── seed-checklist-HSPL.md
│   ├── seed-checklist-CTDT.md
│   ├── seed-checklist-KHOAHOC.md
│   ├── seed-checklist-BAIGIANG.md     (v1.6 add — M6.2)
│   ├── seed-checklist-NHCH.md         (v1.6 add — M6.3 ngân hàng câu hỏi)
│   ├── seed-checklist-DEKT.md         (v1.6 add — M6.3 đề kiểm tra)
│   ├── seed-checklist-GIANGVIEN.md    (v1.6 add — M6.4)
│   ├── seed-checklist-HDTV.md
│   ├── seed-checklist-DANHGIA.md
│   ├── seed-checklist-KHOCH.md
│   ├── seed-checklist-CHITRA.md     (BE-synced verify)
│   ├── seed-checklist-TVNHANH.md    (BE-synced verify)
│   ├── seed-checklist-CTHTPLDN.md
│   └── seed-checklist-BIEUMAU.md     (v1.8 add — T1.B4 tách CB NV ra khỏi T1.B1 QTHT)
├── workflow/
│   ├── workflow-test-report-TVV.md
│   ├── workflow-test-report-HOIDAP.md
│   ├── workflow-test-report-VUVIEC.md
│   ├── workflow-test-report-TVCS.md
│   ├── workflow-test-report-KHOAHOC.md
│   ├── workflow-test-report-CHITRA.md
│   ├── workflow-test-report-TVNHANH.md
│   ├── workflow-test-report-CTHTPLDN.md
│   ├── workflow-test-report-DANHGIA.md   (v1.7 add — gap fill SM-DANHGIA per flow-module §11)
│   └── workflow-test-report-BIEUMAU.md   (v1.8 add — gap fill SM-BIEUMAU per flow-module §3)
├── bug-reports/                        (v1.4 — consolidated per phase)
│   ├── bug-report-seed-tier0-1.md     (P1 Block B — T1.B1 + T1.B2 + T1.B3 + T1.B4)
│   ├── bug-report-seed-tier2-4.md     (P2 — T2.A* + T2.B* + T2.C*)
│   ├── bug-report-workflow-phase.md   (P3 — 10 SM roll-up)
│   └── (functional module bug-reports below)
├── functional/
│   └── {16-module}/functional-test-report.md + bug-report-{module}.md + screenshots/
├── chi-tiet/
│   └── tc-{P0-module}-chitiet.md    (6 module: HD/CGTVV/VV/DN/TVCS/KHOAHOC)
├── design-review/
│   └── {16-module}/design-review-report.md + screenshots/design-diff/
├── regression/
│   ├── regression-round4-report.md
│   └── cross-module-report.md
├── edge-report.md
├── nonfunc-report.md
└── test-summary-round4.md
```

---

## 10. Change log

- **2026-04-24 v1.0** — Plan initial, test-strategy v3.0 + round 3 learnings.
- **2026-04-24 v1.1** — User Q1-Q4: scope 16/16, Chi trả+TV Nhanh BE-synced, permission full, hold-for-review, cascade-block rule, account `users.csv` v2.
- **2026-04-24 v1.2** — Tách permission matrix ra [Round 5 riêng](round5/plan.md); Round 4 rút 5→4 tuần; gộp P4+P5 v1.1 thành P4.
- **2026-04-24 v1.3** — **Restructure pure phase GĐ 0→1→2→3→chi tiết** theo đúng test-strategy §3.2 + §8.3 + §8.4. Sửa lỗi trộn phase v1.1/v1.2. Timeline 5 tuần: T1 Smoke+Seed0-1 / T2 Seed2-4 / T3 Workflow / T4 Functional / T5 Chi tiết+UI+Regression+Summary. Thêm G9 TC chi tiết field-level. R10 risk mới.
- **2026-04-24 v1.4** — Add **bug-reports/ consolidated per phase** (§8 + §9). P1-P2 seed tạo `bug-report-seed-tier{N}.md` roll-up (typically 0 new bugs + regression tracking + observations); P3 workflow roll-up; P4 functional giữ per-module. Rule: mỗi task checklist chỉ tóm tắt 1 dòng, detail vào bug-report consolidated.
- **2026-04-24 v1.5** — Add **`_checkpoint-P{N}.md` file mandatory per phase** (§3 Checkpoint file protocol + §9). Tổng hợp 12 section (tasks rollup, acceptance vs actual, gate decision matrix, bugs, regressions, observations, cascade-block, data seeded, metrics, risks, next readiness, sign-off). File là input chính cho C-gate user decision.
- **2026-04-24 v1.6** — **Sync với `flow-module.md` refactor (tách FR-15 CT HTPLDN 2 giai đoạn, dời FR-09 Biểu mẫu lên BƯỚC 2, bổ sung §16 FR-16 API) + sync `seed-fixture.yaml` v2.3.** Không dời task — giữ C1 đã sign-off nguyên trạng. 5 note patches:
  - §2 Dependency Graph: note M11.1 Kế hoạch thực ra là Tier 1 (plan giữ Tier 4 cho module adjacency).
  - §4 T2.A4: reference `seed-fixture > ho_so_phap_ly_dn_variants[1..6]` mới thêm v2.3 (trước đây thiếu source fixture).
  - §4 T2.A5: mở rộng scope từ `CTDT + KHOAHOC` → 4 sub-entity M6 (CTDT, KHOAHOC, BAIGIANG, NGAN_HANG_CH+DEKT, GIANGVIEN), gộp trong 1 task với 5 sub-task T2.A5a..e. +4 seed-checklist files.
  - §4 T2.C1: giới hạn scope seed CT_HTPLDN ở GĐ1 Kế hoạch (entry `DU_THAO`); DOT_BC GĐ2 dời sang T3.8 workflow phase vì pure-seed impossible với guard `DANG_THUC_HIEN`.
  - §4 T3.8: tách thứ tự test SM-KH-CTHTPL (phase A, sớm) vs SM-DOT-BC (phase B, sau khi phase A + Tier 3 ready).
  - Cross-ref files: [input/flow-module.md](../input/flow-module.md) §4 + §13, [input/quy-trinh-nghiep-vu/02-thu-tu-module.md](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) ⑤ + ⑭-bis, [input/data/seed-fixture.yaml](../input/data/seed-fixture.yaml) v2.3. Rationale: xem memory `qa_htpldn_flow_order_sync`.
- **2026-04-25 v1.7** — Đối chiếu lại plan với 3 file gốc (`input/flow-module.md` + `input/quy-trinh-nghiep-vu/logic-data.md` + `output/test-strategy.md`) → tìm thấy 5 chỗ cần bổ sung. Sửa như sau:
  - **§1 G5:** Đổi "8 SM" → "9 SM" — bổ sung thêm SM-DANHGIA (trước đây bị bỏ sót cả strategy §6 + plan v1.6, mặc dù đã có flow đầy đủ trong `flow-module.md §11` 7 bước với 2 tên state `LAP_KE_HOACH/NHAP`).
  - **§3 Phase Map T3:** "8 SM" → "9 SM"; thêm **5 điểm dễ sai khi test workflow** (VV bỏ qua 2 state / KHOAHOC SRS thiếu transition / CHITRA phải check không có nút Thêm mới / TVNHANH có 2 nguồn THU_CONG vs TU_DONG / DANHGIA có 2 tên state cùng lúc) — lấy từ `logic-data.md §8` để không bị bỏ qua khi test.
  - **§4 P3 T3.9:** Thêm task workflow SM-DANHGIA (happy 7 bước + nhánh từ chối + check 2 tên state + chờ T3.3 nếu chưa đủ ≥3 VV HOÀN THÀNH).
  - **§4 P4 T4.1-T4.6:** Ghi rõ điều kiện "Cần seed trước" + "Nếu thiếu thì skip" cho 6 module P0 (HD/CGTVV/VV/DN/TVCS/KHOAHOC) theo `logic-data.md §3`.
  - **§5 R11:** Thêm rủi ro HSPL bị block kéo dài + chính sách đếm ngày, hết hạn ngày 7 báo dev (BUG-HSPL-TAB-R4 từ 2026-04-24, lặp lại BUG-QLDN-UI-001 từ 2026-04-22).
  - **§6 + §9:** Cập nhật số SM 8 → 9, output thêm `workflow-test-report-DANHGIA.md`.
  - Sửa todo.md tương ứng: T1.B1 tách Case A/B, thêm task T3.9, bảng cascade-block thêm cột đếm ngày.
  - **Considered + SKIPPED tại v1.7 (giữ ghi nhớ để Round sau không re-propose):**
    - *Patch 6 — T5.7 Smoke replay 16 module × 2 role cuối Round 4:* SKIP. Lý do: trùng nhẹ với T5.3 regression Round 3 + T5.6 summary đã có replay implicit. Defer Round 5 nếu cần.
    - *Patch 7 — Tách T3.1.5 task seed CAU_HINH_PHAN_CONG Case B sớm trong P3:* SKIP. Lý do: T2.0.5 (sau T3.1) đã handle, không cần task riêng. Patch 1 (Case A/B sub-bullet trong T1.B1) đã đủ surface.
- **2026-04-25 v1.8** — **Tách BIEU_MAU ra T1.B4 + T3.10 — sửa actor mismatch + tier mismatch.** Trước đây gộp BIEU_MAU vào T1.B1 (`qtht_01` seed) là sai theo 3 nguồn authoritative: `logic-data.md` BƯỚC 2 ③ (actor = CB NV, màn `SCR-VII-02`) + `flow-module.md` §3 SM-BIEUMAU (CB NV, state NHÁP↔CÔNG KHAI↔ẨN) + `seed-fixture.yaml` line 1500-1620 ("Tier 1 master tài liệu — BƯỚC 2"). Patch:
  - **§1 G5:** "9 SM" → "10 SM" thêm BIEUMAU.
  - **§2 Dependency Graph:** bỏ `BIEU_MAU` khỏi Tier 0 QTHT prereq; đưa lên Tier 1 cùng DN/TVV (M14 BIEU_MAU, CB NV).
  - **§3 Phase Map T1+T3:** T1 evidence từ "3 seed-checklist" → "4 seed-checklist" (thêm BIEUMAU); T3 từ "9 SM" → "10 SM".
  - **§4 P1 T1.B1:** bỏ `+ BIEU_MAU` khỏi flow line, thêm note dẫn sang T1.B4. Add **T1.B4** sau T1.B3 (CB NV seed 4 thư mục + 6 biểu mẫu state NHÁP, song song T1.B2/T1.B3).
  - **§4 P3 T3.10:** thêm task workflow SM-BIEUMAU (3 state, không phê duyệt cấp 2, verify API outbound `GET /api/v1/bieu-mau?la_cong_khai=1`).
  - **§4 P4 T4.10:** thêm prereq T1.B4 + T3.10, bỏ TC API public nếu T3.10 chưa chạy.
  - **§6 effort:** "9 SM" → "10 SM"; BIEUMAU ~20 phút (nhanh nhất).
  - **§9 output tree:** thêm `seed-checklist-BIEUMAU.md` + `workflow-test-report-BIEUMAU.md`; bug-report-workflow-phase "8 SM" → "10 SM".
  - **`tasks/todo.md`:** sync tương ứng — T1.B1 bỏ Biểu mẫu khỏi list ("6 nhóm" giữ nguyên), thêm T1.B4 + T3.10, bảng tiến độ P1 4→5 task + P3 10→11 task, C3 "9 workflow" → "10 workflow".
  - **Cleanup v1.8:** merge `plan-review-2026-04-25.md` (321 dòng review snapshot) vào v1.7+v1.8 changelog ở plan.md → xóa file gốc. Lý do: ~85% nội dung đã absorb vào plan.md sau v1.7, giữ file dead-weight + tạo dependency vòng tròn (plan.md cite plan-review để justify giữ plan-review). Rationale 7 patches gốc: 5 đã apply ở v1.7, 2 SKIP đã ghi note ở v1.7 entry trên.
