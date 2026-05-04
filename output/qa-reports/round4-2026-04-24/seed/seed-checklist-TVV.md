# Seed Checklist — TU_VAN_VIEN Tier 1 (T1.B3)

**Phase:** P1 Block B Ngày 5 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P1 T1.B3 • **Date:** 2026-04-24
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — SCR-IV-02 `[+ Thêm TVV]`
**Entry state:** `MOI_DANG_KY` (per SM-TVV Bước 1)
**Input:** [seed-fixture.yaml > tvv_variants[0..5]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: ✅ **PASS 6/6** — `BUG-TVV-001-R4` **RESOLVED** sau dev fix (retry-3)

**Timeline regression → resolution:**

| Attempt | Time | Result | Evidence |
|---------|------|--------|----------|
| Initial T1.B3 | 2026-04-24 ~12:00 | 🚫 BLOCKED 6/6 | POST body `ngaySinh:"Invalid Date"` → BE 422 |
| Retry-1 | 14:20 | 🚫 Same bug, reqid=189 | No dev fix merged |
| Retry-2 | 14:43 | 🚫 Partial fix (cosmetic only), reqid=194 | Client-side Vietnamese message added nhưng submit handler chưa fix |
| **Retry-3** | **~15:06-15:20** | ✅ **FULL FIX CONFIRMED — POST 201 × 6** | POST body `ngaySinh:"1985-03-15"` ISO 8601 đúng; BE 201 Created; 6 TVV entry state `MOI_DANG_KY` |

**Root cause resolution:** Dev đã merge layer 2 fix (submit handler ProForm mapper dayjs → ISO 8601 string) + layer 3 BE localization không còn leak English. POST body field `ngaySinh` giờ là ISO date format `"YYYY-MM-DD"` thay vì literal string `"Invalid Date"`.

---

## Seed matrix — 6/6 PASS

| # | Variant | Ngày sinh (input DD/MM/YYYY) | ISO 8601 gửi BE | Giới tính | Trình độ | Lĩnh vực | Trạng thái | Sample ID | maTvv |
|---|---------|------------------------------|-----------------|-----------|----------|----------|------------|-----------|-------|
| 1 | Nguyễn Văn Tư Vấn | 15/03/1985 | `1985-03-15` | NAM | Thạc sĩ | Lao động | MỚI ĐĂNG KÝ | `fd76f004-46f0-4067-8ad5-d3bcb19f3344` | **TVV-BTP-TW-0001** |
| 2 | Trần Thị Tư Vấn | 22/07/1980 | `1980-07-22` | NU | Tiến sĩ | Thuế | MỚI ĐĂNG KÝ | `63640ce9-1985-41f7-b2bd-5e8e91100080` | **TVV-BTP-TW-0002** |
| 3 | Lê Văn Chuyên Gia | 05/11/1978 | `1978-11-05` | NAM | Thạc sĩ | Sở hữu trí tuệ | MỚI ĐĂNG KÝ | `09ef865d-3729-4989-8369-03f052b2010f` | **TVV-BTP-TW-0003** |
| 4 | Phạm Thị Đào Tạo | 18/02/1975 | `1975-02-18` | NU | Tiến sĩ | Đất đai | MỚI ĐĂNG KÝ | `5bd3b075-c63e-481f-a3d9-3c180dae474d` | **TVV-BTP-TW-0004** |
| 5 | Hoàng Văn Năm | 30/06/1990 | `1990-06-30` | NAM | Cử nhân | Sở hữu trí tuệ | MỚI ĐĂNG KÝ | `6e9dfdf5-7d84-4667-bf25-c2b617626feb` | **TVV-BTP-TW-0005** |
| 6 | Vũ Văn Sáu | 12/09/1988 | `1988-09-12` | NAM | Thạc sĩ | Đất đai | MỚI ĐĂNG KÝ | `df8f6a64-c574-49bf-96ef-8c5a1ce48290` | **TVV-BTP-TW-0006** |

**Total:** 6 seeded / 0 BLOCKED.

**UI verify:** Tab badge `Mới đăng ký 6` + list render 6 rows đầy đủ cột (Mã TVV / Họ tên / Loại / Lĩnh vực / Tổ chức / Trạng thái). Evidence: [screenshots/tvv-retry3-success-6-list.png](../screenshots/tvv-retry3-success-6-list.png).

**BE verify (reqid POST body + response):**
- TVV1 reqid=258 → POST `ngaySinh:"1985-03-15"` → 201 + BE store `1985-03-15` + auto-gen `maTvv=TVV-BTP-TW-0001`
- TVV2 reqid=291, TVV3 reqid=304, TVV4 reqid=318, TVV5 reqid=330, TVV6 reqid=343 — cùng pattern ISO 8601 + 201 Created + auto-gen sequential maTvv.

---

## Cascade-block UN-BLOCK (populate registry)

Khi T1.B3 PASS, các downstream trước bị cascade-block giờ **UNBLOCKED**:

| Downstream task | Trước (khi T1.B3 BLOCKED) | Giờ (T1.B3 PASS) |
|-----------------|---------------------------|-------------------|
| T3.1 SM-TVV workflow | 🚫 HARD BLOCKED | ✅ **UNBLOCKED** — 6 TVV entry state sẵn sàng walk MOI_DANG_KY → DANG_HOAT_DONG |
| T3.3 SM-VUVIEC Bước 3 (Phân công NHT/TVV) | 🚫 BLOCKED 5/8 bước | ✅ **UNBLOCKED** — có TVV để phân công (sau T3.1 advance 1-2 TVV lên `DANG_HOAT_DONG`) |
| T3.4 SM-TVCS workflow | 🚫 BLOCKED | ✅ **UNBLOCKED** |
| T4.2 Functional CG/TVV 31 TC | 🚫 BLOCKED (chỉ test empty state) | ✅ **UNBLOCKED** — có 6 record để test negative/edit/delete |
| T4.5 Functional TVCS 44 TC | 🚫 BLOCKED | ✅ **UNBLOCKED** |
| P5 Cross-module TVV↔VV | 🚫 BLOCKED | ✅ **UNBLOCKED** |

→ **Impact:** P2 seed có thể bắt đầu ngay. P3 workflow T3.1 là candidate đầu tiên vì 6 TVV đã có entry state.

---

## Form observations (R1 regressions — residual, chưa log)

| Observation | R1 Bug ID | Status 2026-04-24 retry-3 |
|-------------|-----------|---------------------------|
| Upload "Ảnh chân dung" accept jpg/png/5MB (đúng spec) | — | ✅ Spec-compliant |
| Upload "File bằng cấp / Chứng chỉ" accept doc/docx/xls/xlsx/pdf/jpg/png/20MB (SRS FR-IV-01: PDF only, 10MB/file, tổng 50MB) | BUG-TVV-004 | **Still present** — residual FE config chưa sửa |
| "Địa bàn hoạt động" thiếu dấu `*` required (SRS FR-IV-01 #17 Y) | BUG-TVV-003 | **Still present** (vẫn submit được khi không chọn — tested 6/6 đều để trống) |
| DM `TO_CHUC_TU_VAN` chỉ 3 entry generic, fixture org name ("Đoàn Luật sư HN"...) không có | Observation | **Still present** — QA phải fallback `Trung tâm trợ giúp pháp lý` |
| DM `LINH_VUC_PL` thiếu code `HOP_DONG` | obs-001 T1.B1 | **Still present** |
| Module name inconsistent: sidebar "Quản lý chuyên gia / tư vấn viên" vs heading "Quản lý Tư vấn viên" | BUG-TVV-006 | **Still present** |
| Form thiếu field "Loại" (CG/TVV/NHT) — BE auto-default `loaiTvv:"TVV"` | BUG-TVV-006 | **Still present** — không cho user chọn CG/NHT |

Các R1 observations này **không chặn T1.B3 pure seed** nên không re-log formal ở round này. Khi P4 T4.2 Functional CG/TVV chạy sẽ verify + log nếu vẫn residual.

---

## T1.B3 Gate Decision

**Status:** ✅ **PASS 6/6** — `BUG-TVV-001-R4` RESOLVED (dev fix full merged)

**Todo status:** `[x]` done clean (per legend plan §3 v1.4)

**BUG-TVV-001-R4 status:** **Verified-fixed** → close-on-verify trong [bug-report-seed-tier0-1.md](../bug-reports/bug-report-seed-tier0-1.md).

**Cascade-block M2 TVV registry:** UN-BLOCKED → remove entry khỏi registry trong [todo.md §Cascade-block registry](../../../../tasks/todo.md).

---

*Session complete: 2026-04-24 12:00 | QA AI via Claude Code + Chrome DevTools MCP*
*Retry verify (a-option per user): 2026-04-24 14:20 — bug confirmed still-present, NO fix merged. reqid=189 evidence.*
*Retry-2 after user reports "dev đã fix": 2026-04-24 14:43 — PARTIAL FIX only (cosmetic layer). reqid=194 POST body vẫn `"Invalid Date"`.*
*Retry-3: 2026-04-24 ~15:06-15:20 — **FULL FIX CONFIRMED**. 6/6 TVV seeded PASS. Mã TVV-BTP-TW-0001..0006, UUIDs captured above. POST body ISO 8601 đúng, BE 201 × 6. Bug closed-on-verify.*
