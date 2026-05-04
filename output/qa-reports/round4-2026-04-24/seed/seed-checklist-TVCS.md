# Seed Checklist — TV_CHUYEN_SAU Tier 2 (T2.A3)

**Phase:** P2 Block A Ngày 1 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P2 T2.A3 • **Date initial:** 2026-04-24 16:20-16:25 | **Date retry-1:** 2026-04-24 20:25-20:35
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — `[+ Tạo mới]` navigate `/tv-chuyen-sau/tao-moi` SCR-X1-02 form
**Entry state achieved:** `Tiếp nhận` (= TIEP_NHAN) per SRS FR-X.1-01 Happy Path
**Input:** [seed-fixture.yaml > tv_cs_variants[1..6]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: ✅ **PASS 6/6 — `BUG-TVCS-CR-R4` closed-verified**

Dev đã fix FE routing `/tv-chuyen-sau/tao-moi` — route giờ mount CREATE form component thay vì detail view. Network `GET /noi-dung-tu-van-cs/tao-moi` 400 không còn fire. 3 API calls populate dropdown: DN + Lĩnh vực tree + TVV.

**Cascade M5 TV_CHUYEN_SAU UN-BLOCKED** — T3.4 SM-TVCS / T4.5 Functional TVCS 44 TC / T5.1 tc-tvcs-chitiet / P5 TVCS↔VV + TVCS↔CG/TVV đều ready khi đến phase.

### Seed matrix

| # | Mã TVCS | UUID | DN | Lĩnh vực (UI/BE) | Hình thức (UI → BE enum) | Trạng thái | Status |
|---|---------|------|------|------------------|--------------------------|-----------|--------|
| 1 | TVCS-20260424-0001 | `0b1391b1-e363-4c1b-984d-64f60171e07a` | DN-HNI-0001 Alpha | Doanh nghiệp | Trực tuyến → `TRUC_TUYEN` | Tiếp nhận | ✅ PASS |
| 2 | TVCS-20260424-0002 | `fad49a55-33a6-4d1c-ace1-fc4dadedddd0` | DN-HNI-0002 Beta | Kinh doanh thương mại (fallback HOP_DONG) | Trực tuyến → `TRUC_TUYEN` | Tiếp nhận | ✅ PASS |
| 3 | TVCS-20260424-0003 | `071475d9-427a-471b-b9f5-aea0f0c5070e` | DN-HPG-0001 Gamma | Lao động | Hồ sơ → `HO_SO` | Tiếp nhận | ✅ PASS |
| 4 | TVCS-20260424-0004 | `490596a0-0549-4d25-8098-bd8f2c6b8732` | DN-HPG-0002 Delta | Thuế | Trực tiếp → `TRUC_TIEP` (fallback DIEN_THOAI) | Tiếp nhận | ✅ PASS |
| 5 | TVCS-20260424-0005 | `98318245-3d18-460f-9f1a-9691b4178d1f` | DN-DNG-0001 Epsilon | Sở hữu trí tuệ | Hồ sơ → `HO_SO` | Tiếp nhận | ✅ PASS |
| 6 | TVCS-20260424-0006 | `260b51f7-8ba9-4b95-a36d-ad08fb52c15c` | DN-DNG-0002 Zeta | Đất đai | Trực tuyến → `TRUC_TUYEN` | Tiếp nhận | ✅ PASS |

Evidence: [screenshots/tvcs-retry1-pass-6of6-list.png](../screenshots/tvcs-retry1-pass-6of6-list.png) — list 6 records với "1-6 / 6 mục" + [screenshots/tvcs-retry1-form-fixed.png](../screenshots/tvcs-retry1-form-fixed.png) (form sau fix).

---

## Attempt log — Retry-1 (2026-04-24 20:25-20:35)

| # | Thời điểm | Variant | Actions | Kết quả |
|---|-----------|---------|---------|---------|
| 1 | 20:22 | — | Login `cb_nv_tw_01` + OTP 666666 → dashboard KPI persist (HD=7, VV=6) | ✅ |
| 2 | 20:23 | — | Sidebar `Quản lý tư vấn` → `Tư vấn chuyên sâu` → list render, empty | ✅ |
| 3 | 20:23 | — | Click `[+ Tạo mới]` → form CREATE render với 7 field (**no GET 400**) | ✅ Bug closed-verified |
| 4 | 20:25 | V1 | Alpha + Doanh nghiệp + Trực tuyến + nội dung + tóm tắt → Lưu | ✅ TVCS-0001 |
| 5 | 20:27 | V2 | Beta + Kinh doanh TM (HOP_DONG fallback) + Trực tuyến → Lưu | ✅ TVCS-0002 |
| 6 | 20:28 | V3 | Gamma + Lao động + Hồ sơ + nội dung LĐ 200 → Lưu | ✅ TVCS-0003 |
| 7 | 20:30 | V4 | Delta + Thuế + Trực tiếp (DIEN_THOAI fallback) + nội dung + ghi chú → Lưu | ✅ TVCS-0004 |
| 8 | 20:32 | V5 attempt-1 | Epsilon + SHTT + Hồ sơ + content → Lưu | ⚠️ Session refresh 500 → /login redirect (record KHÔNG save) |
| 9 | 20:32 | — | Re-login qua form + OTP 666666 | ✅ Dashboard render |
| 10 | 20:33 | V5 attempt-2 | Re-input Epsilon + SHTT + Hồ sơ + content → Lưu | ✅ TVCS-0005 |
| 11 | 20:35 | V6 | Zeta + Đất đai + Trực tuyến + nội dung + tóm tắt → Lưu | ✅ TVCS-0006 |
| 12 | 20:35 | — | List verify `1-6 / 6 mục` + screenshot evidence | ✅ |

---

## Observations (ngoài SRS — không log bug, tracking thôi)

| # | Observation | Severity-like | SRS reference |
|---|-------------|---------------|---------------|
| O1 | UI dropdown "Hình thức tư vấn" chỉ 3 option: Hồ sơ / Trực tiếp / Trực tuyến → BE lưu `HO_SO` / `TRUC_TIEP` / `TRUC_TUYEN`. **SRS ERD Section 3.4.3.X** định nghĩa enum `hinh_thuc_tv` = `HO_SO/VIDEO_CALL/DIEN_THOAI`. UI dùng label khác + BE enum khác. Semantic mapping ambiguous: `VIDEO_CALL` ≈ `TRUC_TUYEN`? `DIEN_THOAI` ≠ `TRUC_TIEP` (phone ≠ in-person). → Cần BA align vocabulary | Minor (ngữ nghĩa divergence, không chặn seed/workflow) | SRS FR-X.1-01 ERD enum vs UI SCR-X1-02 |
| O2 | Dropdown "Lĩnh vực pháp lý" default chỉ hiển thị 10 option top; "Doanh nghiệp" + "Hợp đồng" enum chỉ xuất hiện khi search. HOP_DONG KHÔNG có trong DM (search "Hợp đồng" empty) → fallback `Kinh doanh thương mại` cho variant 2. Same regression với T2.A1 HOIDAP + T2.A2 VU_VIEC | Minor (obs regression) | DANH_MUC FR-VIII-01 |
| O3 | UI list cột "Ngày bắt đầu" hiển thị `"Invalid Date"` cho TẤT CẢ 6 record (BE trả null, FE không handle) → breaking UX tuy không block CRUD | Minor | SCR-X1-01 column |
| O4 | Form CREATE KHÔNG có field `ngay_tu_van` (fixture spec có). BE auto-set nullable. Nếu spec yêu cầu user-pick → FE missing required field. Nếu không → fixture outdated | Minor (cần BA clarify) | SRS FR-X.1-01 Inputs |
| O5 | `POST /auth/refresh` trả 500 (reqid=263-269) giữa seed session → kick về `/login`. Backend token refresh bug — cần escalate nhưng không block nếu QA re-login nhanh. Không duplicate trong Round 4 T2.A1/T2.A2 session nên có thể là flaky | Major-like (BE stability) | `/api/v1/auth/refresh` |
| O6 | Button `[Quay lại danh sách]` trên detail view không navigate khi click (giống UI bug đã log round trước?) — workaround: click sidebar | Minor | SCR-X1-03 |

---

## BUG-TVCS-CR-R4 — Closed-verified notes

Original (2026-04-24 16:20-16:25):
- FE route `/tv-chuyen-sau/tao-moi` navigate nhưng mount detail component → `GET /api/v1/noi-dung-tu-van-cs/tao-moi` 400 `ERR-VAL-SYS-00-00 "Validation failed (uuid is expected)"` leak raw English ra UI.

After retry-1 (2026-04-24 20:23):
- Click `[+ Tạo mới]` → route `/tv-chuyen-sau/tao-moi` mount CREATE form component đúng.
- Network tab không còn `GET /noi-dung-tu-van-cs/tao-moi` — FE route resolver đã phân biệt segment literal "tao-moi" vs UUID.
- 3 API calls hỗ trợ form: GET DN list, GET DM tree `LINH_VUC_PL`, GET TVV list.
- Error English leak cũng không còn (do bug gốc không fire).

→ **BUG-TVCS-CR-R4 Open → Closed-verified**. Update bug-report-seed-tier2-4.md trạng thái + add retry log.

---

## Cascade impact — UN-BLOCKED (update 2026-04-24 20:35)

| Downstream task | Trạng thái trước | Trạng thái sau retry-1 |
|-----------------|-----------------|------------------------|
| T3.4 SM-TVCS workflow (P3 Tuần 3) | 🚫 BLOCKED | ✅ UN-BLOCKED — 6 records entry Tiếp nhận |
| T4.5 Functional TVCS 44 TC (P4 Ngày 2) | 🚫 BLOCKED | ✅ UN-BLOCKED |
| T5.1 `tc-tvcs-chitiet.md` (P5) | 🚫 BLOCKED | ✅ UN-BLOCKED |
| P5 cross-module TVCS↔VU_VIEC | 🚫 BLOCKED | ✅ UN-BLOCKED |
| P5 cross-module TVCS↔CG/TVV | 🚫 BLOCKED | ✅ UN-BLOCKED |

---

## T2.A3 Gate Decision

**Status:** ✅ **PASS 6/6 — M5 TV_CHUYEN_SAU UN-BLOCKED**

**Todo status:** `[!]` → `[x]` done (flip tại todo.md).

**Next action:** Continue T2.A4 HSPL (vẫn BLOCKED separately theo `BUG-HSPL-TAB-R4`), sau đó T2.A5 M6 Đào tạo.

---

*Seed complete: 2026-04-24 16:20 initial fail | 20:25-20:35 retry-1 PASS 6/6 | QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block A Tier 2*
*BUG-TVCS-CR-R4 closed-verified. New observations O1-O6 tracked (mostly minor, O5 token refresh 500 cần BE attention).*
