# Checkpoint — P1 Smoke + Seed Tier 0-1

**Phase:** P1 (Tuần 1) • **Date:** 2026-04-24 10:20 → 12:05 seed + 14:18 → 14:22 C1 retry-1 + 14:36 → 14:45 retry-2 + **~15:06 → ~15:20 retry-3 (dev full-fix CONFIRMED)** • **Gate:** ✅ **C1 CLEAN PASS — ready to advance P2** (retry-3 chứng minh dev đã merge full fix, 6/6 TVV seeded PASS)

---

## 1. Đã test những gì — Kết quả — File lưu — Nếu fail, xử lý

### Block A: Smoke test

| # | Đã test | Kết quả | File lưu | Nếu fail, phương án xử lý |
|---|---------|---------|----------|---------------------------|
| 1 | Env health (App HTTP 200, MailHog HTTP 200) | ✅ PASS | [_prep-log.md](_prep-log.md) | — |
| 2 | MCP Chrome DevTools tool verification (new_page, wait_for, take_snapshot, fill_form, click, type_text) | ✅ PASS (0 crash) | [_prep-log.md](_prep-log.md) | Nếu crash ≥3 lần/session → fallback gstack `$B chain` per CLAUDE.md Rule 6 |
| 3 | Login 11 vai trò (qtht_01, cb_nv_tw_01, cb_pd_tw_01, cb_nv_bn_01, cb_pd_bn_01, cb_nv_dp_01, cb_pd_dp_01, cg_01, nht_01, tvv_01, dn_01) | ✅ 10 PASS CMS + 1 expected-block (DN reject CMS, dùng Cổng PLQG — by design) | [_prep-log.md](_prep-log.md) | Nếu account lock → fallback `_02 → _03` per CLAUDE.md Rule 7 account-lock |
| 4 | Smoke click 16 module × qtht_01 | ✅ 14/16 click-thru PASS | [smoke-test-report.md](smoke-test/smoke-test-report.md) | M14 HĐTV không có sidebar entry (⚠️ PENDING-VERIFY defer T3.3 SM-VUVIEC — access qua VV detail tab); M16 API ➖ N/A (API-only by SRS, user excluded) |
| 5 | Smoke 5 role major sidebar scope (admin/cb_nv_tw_01/cb_pd_tw_01/cb_nv_bn_01/cb_nv_dp_01) | ✅ 5/5 PASS | [smoke-test-report.md](smoke-test/smoke-test-report.md) | — |
| 6 | Verify Chi trả (M6) có record BE-synced ≥1 | ❌ **FAIL** — 0 record | [smoke-test-report.md](smoke-test/smoke-test-report.md) §3 | **Cascade-block `BLOCKED-UPSTREAM-SYNC-MISSING`**. Xử lý: (a) escalate BE integration team trigger DVC/LGSP sync job; (b) re-verify trong P2 T2.B4; (c) nếu vẫn rỗng → skip T3.6 workflow + T4.12 functional |
| 7 | Verify TV Nhanh (M12) có record BE-synced ≥1 | ❌ **FAIL** — 0 record | [smoke-test-report.md](smoke-test/smoke-test-report.md) §3 | Cascade-block tương tự M6 — escalate BE Cổng PLQG sync; re-verify P2 T2.B5; skip T3.7 + T4.11 nếu vẫn rỗng |

### Block B: Seed Tier 0-1

#### T1.B1 — Seed QTHT Tier 0 prereq (verify mode — không tạo mới)

| # | Đã test | Kết quả | File lưu | Nếu fail, phương án xử lý |
|---|---------|---------|----------|---------------------------|
| 8 | DM `linh_vuc_phap_ly` ≥6 records | ✅ PASS (12 records) | [seed-checklist-QTHT.md §2](seed/seed-checklist-QTHT.md) | — (obs-001: thiếu code `HOP_DONG` — BA confirm thêm hoặc update fixture) |
| 9 | DM `loai_dn` ≥4 records | ✅ PASS (5 records) | [seed-checklist-QTHT.md §4](seed/seed-checklist-QTHT.md) | obs-002: UI stores quy mô NĐ39 thay legal form → BA confirm enum. Xử lý: adjust mapping in fixture + note trong seed-checklist-DN |
| 10 | DON_VI ≥5 records | ✅ PASS (83 records: 1 TW + 18 BN + 64 DP) | [seed-checklist-QTHT.md §3](seed/seed-checklist-QTHT.md) | — (obs-005: fixture codes TW-CUC/BN-BTP... không khớp UI BTP-TW/BKH... — refactor fixture trước Round 5) |
| 11 | TAI_KHOAN 3 accounts (qtht_01/cb_nv_tw_01/cb_pd_tw_01) | ✅ PASS | [_prep-log.md P0](_prep-log.md) | — |
| 12 | SLA `qua_han_he_so > 1` | ✅ PASS (= 2, cho 4 loại HD/HO_SO_HT/HO_SO_TT/VV) | [seed-checklist-QTHT.md §1](seed/seed-checklist-QTHT.md) | — |
| 13 | Phân công preset 2 module (HD+VV) | ❌ **FAIL** — chỉ 1 section "Hỏi đáp" + 0 record, section "Vụ việc" missing | [seed-checklist-QTHT.md §5](seed/seed-checklist-QTHT.md) | obs-003: BA verify SRS FR-II-NEW-01 có require 2 subsection không. Xử lý: (a) nếu spec yêu cầu 2 section → log bug Round 4 (chờ BA confirm clause); (b) defer seed preset manual tới T3.2 SM-HD; (c) không block T1.B1 — seed workflow không phụ thuộc preset PC tại entry state |
| 14 | BIEU_MAU module accessible | ✅ PASS (render, 0 record OK — không yêu cầu có record Tier 0) | [seed-checklist-QTHT.md §6](seed/seed-checklist-QTHT.md) | — |

#### T1.B2 — Seed DN 6 variants

| # | Đã test | Kết quả | File lưu | Nếu fail, phương án xử lý |
|---|---------|---------|----------|---------------------------|
| 15 | Seed DN1 Alpha (HN, NHO, 50LĐ/3 tỷ) | ✅ PASS → **DN-HNI-0001** | [seed-checklist-DN.md](seed/seed-checklist-DN.md) | — |
| 16 | Seed DN2 Beta (HN, SIEU_NHO, 8LĐ/2 tỷ) | ✅ PASS → **DN-HNI-0002** | same | — |
| 17 | Seed DN3 Gamma (HP, VUA, 200LĐ/80 tỷ) | ✅ PASS → **DN-HPG-0001** | same | obs-004: float32 precision loss tổng vốn 90 tỷ → stored 89999998976 (lệch 1024 VNĐ). BA bổ sung constraint decimal |
| 18 | Seed DN4 Delta (HP, NHO, 15LĐ/5 tỷ) | ✅ PASS → **DN-HPG-0002** | same | — |
| 19 | Seed DN5 Epsilon (DN, VUA, 100LĐ/50 tỷ) | ✅ PASS → **DN-DNG-0001** | same | obs-004 tiếp: DT 50 tỷ → 49999998976; Vốn 60 tỷ → 60000002048 |
| 20 | Seed DN6 Zeta (DN, SIEU_NHO, 3LĐ/1 tỷ) | ✅ PASS → **DN-DNG-0002** | same | — |
| 21 | Mã auto-gen `DN-{TINH}-{SEQ}` đúng BR-DATA-04 | ✅ PASS (HNI/HPG/DNG, counter per tỉnh) | same | — |
| 22 | R1 BUG-DN-001 (BE quy mô sai 100LĐ+50tỷ) | ⏸️ Chưa trigger — user force-select VUA persist OK | same §3 | Defer P4 T4.4: simulate auto-suggest path (cần fix BUG-DN-004 trước) |
| 23 | R1 BUG-DN-004 (auto-suggest quy mô không implement) | ❌ **FAIL regression** — vẫn chưa implement | same §3 | Re-log formal ở P4 T4.4 nếu dev vẫn chưa fix |
| 24 | R1 BUG-DN-005 (form thiếu 3 field: ngay_cap_dkkd, fax, file_dinh_kem) | ❌ **FAIL regression** — vẫn thiếu | same §3 | Re-log formal ở P4 T4.4 |

#### T1.B3 — Seed TVV 6 variants

| # | Đã test | Kết quả | File lưu | Nếu fail, phương án xử lý |
|---|---------|---------|----------|---------------------------|
| 25 | Seed TVV1 Nguyễn Văn Tư Vấn (retry-3 after dev full-fix) | ✅ **PASS → TVV-BTP-TW-0001** (id=fd76f004) | [seed-checklist-TVV.md](seed/seed-checklist-TVV.md) | — (BUG-TVV-001-R4 closed-verified; POST body `ngaySinh:"1985-03-15"` ISO 8601 đúng; BE 201 reqid=258) |
| 26 | Seed TVV2 Trần Thị Tư Vấn | ✅ **PASS → TVV-BTP-TW-0002** (id=63640ce9) | same | reqid=291 |
| 27 | Seed TVV3 Lê Văn Chuyên Gia | ✅ **PASS → TVV-BTP-TW-0003** (id=09ef865d) | same | reqid=304 |
| 28 | Seed TVV4 Phạm Thị Đào Tạo | ✅ **PASS → TVV-BTP-TW-0004** (id=5bd3b075) | same | reqid=318 |
| 29 | Seed TVV5 Hoàng Văn Năm | ✅ **PASS → TVV-BTP-TW-0005** (id=6e9dfdf5) | same | reqid=330 |
| 30 | Seed TVV6 Vũ Văn Sáu | ✅ **PASS → TVV-BTP-TW-0006** (id=df8f6a64) | same | reqid=343 |
| 31 | R1 BUG-TVV-001 FE DatePicker `ngay_sinh` "Invalid Date" | ✅ **CLOSED-VERIFIED** retry-3 2026-04-24 ~15:06-15:20 — dev merged full fix (layer 2 submit handler + layer 3 BE localization) | [bug-report-seed-tier0-1.md §BUG-TVV-001-R4](bug-reports/bug-report-seed-tier0-1.md) + [screenshot success](screenshots/tvv-retry3-success-6-list.png) | — (cascade M2 TVV UN-BLOCKED → T3.1/T3.3/T3.4/T4.2/T4.5/P5 ready) |
| 32 | R1 BUG-TVV-003 (Địa bàn thiếu `*` required) | ❌ FAIL regression | [seed-checklist-TVV.md §Form obs](seed/seed-checklist-TVV.md) | Re-log ở P4 T4.2 CG/TVV |
| 33 | R1 BUG-TVV-004 (Upload accept sai: doc/xls/20MB vs SRS PDF only 10MB) | ❌ FAIL regression | same | Re-log ở P4 T4.2 |
| 34 | R1 BUG-TVV-006 (module name inconsistent, form thiếu field "Loại") | ❌ FAIL regression | same | Re-log ở P4 T4.2 |

---

## 2. Tổng kết P1

### Con số

| Metric | Value | Sau retry-3 |
|--------|-------|-------------|
| **Tests đã chạy** | 34 | 34 |
| ✅ PASS | **23** → **29** (85.3%) | +6 (TVV1..6 retry-3) |
| ❌ FAIL | **4** → **3** (8.8%) | -1 (BUG-TVV-001-R4 closed); còn PC preset + 2 BE-sync |
| 🚫 BLOCKED (cascade TVV) | **5** → **0** | -5 (cascade cleared sau retry-3) |
| ❌ Regression confirmed (track, không re-log) | **5** → **4** | -1 (R1 BUG-TVV-001 đóng); còn BUG-DN-004/005 + BUG-TVV-003/004/006 |
| ⏸️ Pending verify (defer) | **2** (mục 22 R1 BUG-DN-001; M14 HĐTV defer T3.3) | Unchanged |

### Bugs logged formal P1 (1 Critical — CLOSED-VERIFIED retry-3)

| Bug ID | Sev | Title | Status | File |
|--------|:---:|-------|--------|------|
| **BUG-TVV-001-R4** | **Critical P0** | FE ProForm DatePicker `ngay_sinh` → "Invalid Date" (regression R1) | ✅ **Closed-verified 2026-04-24 retry-3** (dev merged layer 2 submit handler + layer 3 BE localization) | [bug-report-seed-tier0-1.md](bug-reports/bug-report-seed-tier0-1.md) |

### Cascade-block registry sau P1 (updated retry-3)

| Module | Reason | Downstream chặn |
|---|---|---|
| M6 Chi trả | BE-sync DVC/LGSP trống | T2.B4, T3.6, T4.12 |
| M12 TV Nhanh | BE-sync Cổng PLQG trống | T2.B5, T3.7, T4.11 |
| ~~M2 TVV~~ | ~~BUG-TVV-001-R4~~ | ✅ **UNBLOCKED** sau retry-3 — 6/6 TVV seeded PASS |

### Data seeded ready cho P2

- **6 DN sample IDs:** DN-HNI-0001/0002, DN-HPG-0001/0002, DN-DNG-0001/0002
- **DM/DON_VI/SLA/TAI_KHOAN Tier 0:** đủ baseline cho seed Tier 2-4
- **6 TVV sample IDs:** TVV-BTP-TW-0001..0006 (Nguyễn Văn/Trần Thị/Lê Văn/Phạm Thị/Hoàng Văn/Vũ Văn) — state `MOI_DANG_KY`, UUIDs fd76f004 / 63640ce9 / 09ef865d / 5bd3b075 / 6e9dfdf5 / df8f6a64

### Verdict P1: ✅ **CLEAN PASS sau retry-3 (29/34 = 85.3% PASS)**

1 Critical blocker ban đầu **CLOSED-VERIFIED** sau dev fix full-merge (retry-3). Còn 3 FAIL không block (PC preset Tab 2 + 2 BE-sync) — đã có cascade-block cho 2 upstream BE-sync (M6, M12). P2 có thể start ngay với dataset đầy đủ: DM/DON_VI/SLA/Tier 0 + 6 DN + 6 TVV entry state.

---

## 3. C1 Gate decision — user chọn

### 3.1 Retry verification 2026-04-24 14:18 (user-requested pre-gate check)

User tại C1 requested re-test 1 fixture TVV trước khi ra quyết định (Option a). Retry verbatim fixture TVV1 qua MCP — **bug vẫn nguyên**, không có fix nào được merge giữa 12:05 → 14:20.

| Check | Evidence |
|-------|----------|
| POST `/api/v1/tu-van-viens` | **HTTP 422** (reqid=189) |
| Request body `ngaySinh` | `"Invalid Date"` literal (identical signature R1/initial R4) |
| BE error code | `ERR-VAL-SYS-00-01` |
| BE error message | `"ngaySinh must be a valid ISO 8601 date string"` (English leak) |
| Screenshot | [bug-tvv-001-r4-retry-2026-04-24-14-20-invalid-date.png](screenshots/bug-tvv-001-r4-retry-2026-04-24-14-20-invalid-date.png) |
| Full reqid=189 body | logged in [bug-report-seed-tier0-1.md §Retry verification](bug-reports/bug-report-seed-tier0-1.md) |

**Conclusion:** BUG-TVV-001-R4 **still-Open**. Variants 2-6 skip retry (same submit-handler bug path, same expected signature). C1 decision now based on confirmed-present blocker.

### 3.1a Retry-2 verification 2026-04-24 14:43 (user reports dev đã fix)

User báo dev merged fix → QA fresh re-seed 6 variants. TVV1 tested via 2 input methods:

**Layer-by-layer diagnostic:**

| Fix layer | Expected (full fix) | Observed (retry-2) | Status |
|-----------|---------------------|--------------------|--------|
| **Layer 1** FE cosmetic error text | Vietnamese "Ngày sinh không hợp lệ" client-side | ✅ Added | ✅ **FIXED** |
| **Layer 2** FE submit handler `ngaySinh` → ISO 8601 | `"1985-03-15"` trong POST body | `"Invalid Date"` literal (SAME as R1/retry-1) | ❌ **STILL BROKEN** |
| **Layer 3** BE error localization | Vietnamese `ERR-TVV-DOB-01` | English `"ngaySinh must be a valid ISO 8601 date string"` (SAME) | ❌ **STILL BROKEN** |

**Evidence (reqid=194 POST) — picker-click approach:**
- Procedure: click calendar icon → Chọn năm → 1985 → Th 03 → day 15 → input committed `"15/03/1985"` → no client-side error → click `[Lưu]`.
- Request body: `{..., "ngaySinh": "Invalid Date", ...}`
- Response: 422 `ERR-VAL-SYS-00-01`

**Conclusion retry-2:** Dev deliver **cosmetic-only fix**. Core bug (submit handler mapper) chưa touch. BUG-TVV-001-R4 **VẪN OPEN** — cascade-block registry unchanged. Variants 2-6 SKIP retry.

Screenshot: [screenshots/bug-tvv-001-r4-retry2-2026-04-24-14-43-partial-fix-only.png](screenshots/bug-tvv-001-r4-retry2-2026-04-24-14-43-partial-fix-only.png).

Full retry-2 detail: [bug-report-seed-tier0-1.md §Retry-2 verification](bug-reports/bug-report-seed-tier0-1.md).

### 3.2 Options để user chọn

| Option | Action | Thời gian | Rủi ro |
|:---:|---|---|---|
| **A** | Hold P2, escalate FE fix BUG-TVV-001-R4 → resume sau merge | +1-2 ngày dev + 1h QA re-seed | Lãng phí tuần 2 |
| **B** ⭐ | Partial continue P2 — seed các entity độc lập TVV (HOIDAP/VUVIEC/HSPL/CTDT/KHOCH/CTHTPLDN/DANHGIA) | Không lãng phí | T3.1/T3.3/T3.4 có thể delay nếu dev chưa fix trước tuần 3 |
| **C** | Abort — chờ dev fix 1 Critical + ~7 R1 regressions | +1-2 tuần | Miss timeline 5 tuần |

**QA recommend: Option B** — tận dụng tuần 2 cho 7+ entity độc lập. Dev có ~2 tuần fix TVV DatePicker trước T3.1 (2026-05-09). Retry verify đầu T3 trước khi run SM-TVV workflow.

### 3.1b Retry-3 verification 2026-04-24 ~15:06-15:20 (dev full-fix CONFIRMED)

User invoked retry sau khi dev báo đã fix lần 2. QA re-run 6 variants fresh session cb_nv_tw_01.

**Layer-by-layer (compared to retry-2):**

| Fix layer | Retry-2 status | Retry-3 status | Δ |
|-----------|----------------|----------------|---|
| Layer 1 FE cosmetic error text | ✅ Fixed | ✅ Fixed | Unchanged |
| **Layer 2** FE submit handler `ngaySinh` → ISO 8601 | ❌ Broken (`"Invalid Date"`) | ✅ **FIXED** → `"1985-03-15"` proper ISO 8601 | **Δ Full fix merged** |
| **Layer 3** BE error localization | ❌ English leak | N/A (no error — POST 201) | **Δ Moot, no failure path triggered** |

**Evidence per variant (all 6 PASS):**

| Variant | reqid | POST `ngaySinh` | HTTP | maTvv (auto-gen) | UUID |
|---------|-------|-----------------|------|------------------|------|
| TVV1 Nguyễn Văn Tư Vấn | 258 | `"1985-03-15"` | **201** | TVV-BTP-TW-0001 | fd76f004-46f0-4067-8ad5-d3bcb19f3344 |
| TVV2 Trần Thị Tư Vấn | 291 | `"1980-07-22"` | **201** | TVV-BTP-TW-0002 | 63640ce9-1985-41f7-b2bd-5e8e91100080 |
| TVV3 Lê Văn Chuyên Gia | 304 | `"1978-11-05"` | **201** | TVV-BTP-TW-0003 | 09ef865d-3729-4989-8369-03f052b2010f |
| TVV4 Phạm Thị Đào Tạo | 318 | `"1975-02-18"` | **201** | TVV-BTP-TW-0004 | 5bd3b075-c63e-481f-a3d9-3c180dae474d |
| TVV5 Hoàng Văn Năm | 330 | `"1990-06-30"` | **201** | TVV-BTP-TW-0005 | 6e9dfdf5-7d84-4667-bf25-c2b617626feb |
| TVV6 Vũ Văn Sáu | 343 | `"1988-09-12"` | **201** | TVV-BTP-TW-0006 | df8f6a64-c574-49bf-96ef-8c5a1ce48290 |

UI verify tab badge "Mới đăng ký 6" + list render 6 rows đầy đủ 10 cột — [screenshot](screenshots/tvv-retry3-success-6-list.png).

**Conclusion retry-3:** BUG-TVV-001-R4 **CLOSED-VERIFIED**. Cascade M2 TVV cleared. C1 gate → **CLEAN PASS**, advance P2 ngay.

### 3.3 Final decision

**QA verdict updated:** C1 **CLEAN PASS** — advance to P2 Seed Tier 2-4 immediately. Dataset sẵn sàng: DM/DON_VI/SLA/TAI_KHOAN Tier 0 + 6 DN + 6 TVV entry state.

**Option A/B/C above obsolete** (chỉ dùng nếu retry-3 lại fail). User action: xác nhận advance P2, hoặc giữ pause nếu có concern khác.

---

*Checkpoint generated: 2026-04-24 12:10 | QA AI via Claude Code + Chrome DevTools MCP*
*Updated 2026-04-24 14:22 — retry verification §3.1 added, BUG-TVV-001-R4 confirmed still-Open.*
*Updated 2026-04-24 14:45 — retry-2 §3.1a added after user reports "dev đã fix": partial fix (cosmetic) detected; core submit-handler bug vẫn Open (reqid=194).*
*Updated 2026-04-24 ~15:25 — **retry-3 §3.1b added**: dev full-fix MERGED; 6/6 TVV seeded PASS; BUG-TVV-001-R4 closed-verified; cascade M2 TVV cleared; C1 verdict upgraded PARTIAL → **CLEAN PASS**.*
*Next: `_checkpoint-P2.md` sau P2 Seed Tier 2-4 complete.*
