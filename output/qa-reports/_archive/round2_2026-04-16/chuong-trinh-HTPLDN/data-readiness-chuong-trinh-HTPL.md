# Data Readiness — Module Chương trình HTPLDN (Round 2)

**Ngày:** 2026-04-20 (Lệnh 2) · 2026-04-20 (Lệnh 3 — seed partial)
**Lệnh 2:** ✅ Done — check data readiness
**Lệnh 3:** 🟡 **Partial (1/14 state seeded)** — 7 CT DU_THAO (6 alive + 1 soft-deleted) seeded OK; 7 state CT + 6 state đợt BC + 4 state BC **BLOCKED** bởi BE `/submit` + `/cancel` + `/activate` + 5 transition endpoints khác trả 403 với mọi role test (xem [§Blocker B6](#b6-be-transition-endpoints-all-return-403--blocker-lệnh-3)).
**Account dùng:** `canbo_tw` / `canbo_bn` / `canbo_tinh` / `lanhdao_tw` — cùng `Test@1234` (OTP bypass `666666`)
**Môi trường:** http://103.172.236.130:3000/
**Tham chiếu:** [funtion/7.15-chuong-trinh-HTPLDN.md §Data Readiness + §State Machine](../../../funtion/7.15-chuong-trinh-HTPLDN.md)
**Schema:** tuân [test-strategy.md §7.0.1](../../../test-strategy.md#701-artifact-spec--data-readiness-reportmd) (schema 7 cột)
**Smoke gate:** [smoke-test/chuong-trinh-HTPLDN/smoke-test-report.md](../smoke-test/chuong-trinh-HTPLDN/smoke-test-report.md) — CONDITIONAL PASS (infrastructure healthy)

---

## Tổng quan phát hiện

| Entity | Entry point | Rows trước | Rows sau (Lệnh 3) | Verdict |
|--------|-------------|-----------|-------------------|---------|
| Chương trình HTPLDN (`CHUONG_TRINH_HTPL`) | ✅ Sidebar `Quản lý chương trình hỗ trợ pháp lý doanh nghiệp` → `/ct-htpldn/danh-sach` | **0** trên cả 3 scope (TW/BN/DP) | **7 DU_THAO** (6 alive + 1 soft-deleted) | **Partial** — 1/8 state populated, 7/8 BLOCKED (B6) |
| Đợt báo cáo (`DOT_BAO_CAO`) | ❌ Không có entry sidebar độc lập — chỉ qua tab `Đợt báo cáo` của 1 CT chi tiết | **Không verify được**; API `/dot-bao-caos` 403 | **0** (không có CT ≥ DANG_THUC_HIEN để tạo đợt) | **THIẾU toàn bộ** (phụ thuộc B6 fix trước) |
| Báo cáo CT HTPL (`BAO_CAO_CT_HTPL`) | ❌ Không có entry sidebar — phụ thuộc đợt BC | **0** | **0** | **THIẾU toàn bộ** (phụ thuộc đợt BC) |

### Bằng chứng API (Lệnh 2)

```
GET /api/v1/chuong-trinh-htpls?page=1&pageSize=100
  Authorization: Bearer <JWT canbo_tw>
→ {"success":true,"data":[],"meta":{"page":1,"pageSize":100,"total":0,"totalPages":0}}

  Authorization: Bearer <JWT canbo_bn>
→ {"success":true,"data":[],"meta":{"total":0,...}}

  Authorization: Bearer <JWT canbo_tinh>
→ {"success":true,"data":[],"meta":{"total":0,...}}
```

**Per-state filter verify** (key `trangThai` accepted, returns 0 trên mọi state):
```
trangThai=DU_THAO          → total=0
trangThai=CHO_PHE_DUYET    → total=0
trangThai=DA_DUYET         → total=0
trangThai=DA_CONG_BO       → total=0
trangThai=DANG_THUC_HIEN   → total=0
```
(Đã test 5 state chính — vì tổng 0 ở filter cao nhất `DU_THAO`, các state sau đó chắc chắn 0).

### UI verify (smoke — 2026-04-19)

- `/ct-htpldn/danh-sach` hiển thị empty state `"Không có dữ liệu"` với 0 row, khớp API `meta.total=0`.

---

## Schema 7 cột — per state (theo §7.0.1)

### Entity: CHUONG_TRINH_HTPL (SM-KH-CTHTPL — 8 states)

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| DU_THAO | CT-001/002/003 (CRUD), CT-007 (trình PD), CT-019 (hủy CT) | 0 | **6 alive + 1 soft-deleted** | `CT-20260420-0001` id=`3ca7f258-90a2-4b00-9bb4-f0f74e43d43d` (TW1, nhãn "Hỗ trợ pháp lý DN xuất khẩu"); `CT-20260420-0002` id=`e110448b-1070-46ad-a217-3cfd4ac16092` (BN1); `CT-20260420-0003` id=`b0cc2c1e-2db2-4a34-8700-e2d99964cf00` (DP1); `CT-20260420-0004` id=`51415d23-270f-4104-a6be-a0083812febc` (TW-tamdung); `CT-20260420-0005` id=`0c1cc80c-1586-446e-b17f-83f5d81d027e` (TW-hoanthanh); `CT-20260420-0007` id=`b6aeda41-ebc6-4f6d-93ec-43d6e98f1b75` (TW-congbo); `CT-20260420-0006` id=`cac1d071-9602-4c34-a521-1ecfbb8248d3` **is_deleted=true** (TW-huy, dùng để test BR-DATA-01 soft delete — KHÔNG phải state HUY) | `canbo_tw` (5 CTs) + `canbo_bn` (1 CT) + `canbo_tinh` (1 CT). **Caveat:** Cả 3 account có chung `donViId=00000000-0000-4000-8000-000000000001` trong DB seed → scope testing không phân biệt được qua 3 account này (xem §Blocker B2). | **ĐỦ** (≥1) + baseline test soft-delete |
| CHO_PHE_DUYET | CT-008 (duyệt), CT-009 (từ chối), CT-010 (rút trình) | 0 | **0** | — | `canbo_tw` submit DU_THAO → BE `/submit` trả **403 Forbidden** (B6) | **BLOCKED — B6** |
| DA_DUYET | CT-011 (công bố), CT-013 (kích hoạt), CT-026 (immutability) | 0 | **0** | — | Verify `/approve` endpoint tồn tại (422 khi body thiếu `quyetDinh`) nhưng chỉ accept CHO_PHE_DUYET → không reach được | **BLOCKED — B6** |
| DA_CONG_BO | CT-012 (hủy công bố), CT-014 (kích hoạt từ DA_CONG_BO) | 0 | **0** | — | Chuỗi lifecycle bị chặn từ CHO_PHE_DUYET; ngoài ra BR-FLOW-05 cần API Cổng PLQG (B1) | **BLOCKED — B6 + B1** |
| DANG_THUC_HIEN | CT-015 (tạm dừng), CT-018 (hoàn thành), CT-020 (tạo đợt BC) | 0 | **0** | — | `/activate` endpoint 403 (cùng pattern B6); đồng thời phụ thuộc CT đạt DA_DUYET | **BLOCKED — B6** |
| TAM_DUNG | CT-016 (tiếp tục) | 0 | **0** | — | `/pause` endpoint 403 (B6) | **BLOCKED — B6** |
| HOAN_THANH | CT-021 (tạo đợt BC từ HOAN_THANH) | 0 | **0** | — | `/complete` endpoint 403 (B6) | **BLOCKED — B6** |
| HUY | Negative CT-019 (hủy CT), CT-010 (rút trình) | 0 | **0** (state HUY); **1** soft-deleted như baseline | — | `/cancel` endpoint 403 (B6). DELETE method work (CT6 soft-deleted OK) nhưng khác HUY state | **BLOCKED — B6** (state HUY); **ĐỦ** (BR-DATA-01 soft-delete) |

### Entity: DOT_BAO_CAO (SM-DOT-BC — 6 states)

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| TAO_DOT | CT-020/022 (CRUD đợt), CT-024 (xóa đợt) | 0 | **0** | — | Phụ thuộc CT ở DANG_THUC_HIEN (blocked bởi B6) | **BLOCKED — B6** |
| DANG_LAP_BC | CT-027 (lập BC), CT-029 (gợi ý số liệu), CT-031 (trình duyệt KQ) | 0 | **0** | — | Phụ thuộc đợt BC TAO_DOT (chained blocker) | **BLOCKED — B6** |
| CHO_DUYET_KQ | CT-032 (duyệt KQ), CT-033 (từ chối KQ), CT-034 (validate cùng cấp) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |
| DA_DUYET_KQ | CT-035 (BN/ĐP gửi TW), CT-036 (TW không gửi được) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |
| DA_GUI_TW | CT-037 (TW thấy DS), CT-038 (TW tổng hợp), CT-040 (xuất file) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |
| DA_TONG_HOP | CT-038 (TW tổng hợp), CT-040/041 (xuất file) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |

### Entity: BAO_CAO_CT_HTPL (phụ thuộc đợt BC)

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| CHO_PHE_DUYET | CT-031 auto-transition kép | 0 | **0** | — | Chained blocker (cần đợt BC DANG_LAP_BC) | **BLOCKED — B6** |
| DA_DUYET | CT-032 auto-transition kép | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |
| TU_CHOI | CT-033 (từ chối KQ + lý do) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |
| TONG_HOP_TW | CT-038 (loại BC tổng hợp) | 0 | **0** | — | Chained blocker | **BLOCKED — B6** |

### Dữ liệu phi-workflow (chuẩn bị thủ công)

| Loại | Mục đích (TC) | Trạng thái | Ghi chú |
|------|---------------|-----------|---------|
| File đính kèm PDF/DOCX (≤ 20MB) | CT-006 (upload file đính kèm CT khi DU_THAO) | **Cần chuẩn bị** | 1 file PDF hợp lệ + 1 file >20MB (âm tính) + 1 file sai format (.exe) |
| File Excel import/nhập liệu mẫu | CT-028/030 (nhập BC mẫu 21a/21b), CT-040/041 (xuất Excel/Word) | **Cần chuẩn bị** | Template mẫu 21a, 21b từ TT17/2025 để đối chiếu khi xuất |
| Endpoint Cổng PLQG sandbox/mock | CT-011 (công bố DA_DUYET → DA_CONG_BO), CT-025 (rollback khi API fail), CT-302 (verify CT xuất hiện qua API) | **Blocker — hỏi dev** | BR-FLOW-05: công bố push qua API trực tiếp Cổng PLQG. Môi trường test hiện có mock/sandbox chưa? Nếu chưa → CT-011/025/302 phải skip hoặc test contract-level (verify payload format) |

---

## State dependency chain — thứ tự tạo data

```
Bước 1: Seed CTs ở DU_THAO (3 cái: TW, BN, DP)
          ↓ canbo_tw / canbo_bn / canbo_tinh tạo
Bước 2: Trình PD → CHO_PHE_DUYET (1 cái, giữ 2 cái DU_THAO làm baseline)
          ↓ canbo_tw (BR-AUTH-05 cùng cấp)
Bước 3: lanhdao_tw duyệt → DA_DUYET (1 cái)
          ↓
Bước 4: canbo_tw công bố → DA_CONG_BO (1 cái, cần mock API Cổng PLQG)
          ↓ (hoặc skip step này, dùng lại DA_DUYET cho step 5)
Bước 5: canbo_tw kích hoạt → DANG_THUC_HIEN (1 cái)
          ↓
Bước 6: Tạo đợt BC → TAO_DOT (1 đợt/cấp → cần 3 đợt: TW/BN/DP) + hoàn thành lifecycle BC
          ↓ lập BC → trình duyệt → duyệt (cùng cấp) → gửi TW (BN+ĐP) → TW tổng hợp
Bước 7: Branch TAM_DUNG + HOAN_THANH + HUY (mỗi branch 1 CT)
```

**Tổng số bản ghi tối thiểu cần seed:**
- `CHUONG_TRINH_HTPL`: 8 bản ghi (1 mỗi state × 8 state, có thể gộp DA_CONG_BO = DA_DUYET + công bố = 1 record đi qua 2 state)
- `DOT_BAO_CAO`: 6 bản ghi (1 mỗi state × 6 state) — ít nhất cần 2 đợt BN + 2 đợt ĐP DA_GUI_TW để test CT-037/038 TW tổng hợp
- `BAO_CAO_CT_HTPL`: 4 bản ghi (CHO_PHE_DUYET, DA_DUYET, TU_CHOI, TONG_HOP_TW)

**Cross-unit data (CT-201, CT-202, CT-203, CT-204):**
- Ít nhất 1 CT ở scope TW + 1 ở BN + 1 ở ĐP → test isolation `canbo_bn` không thấy CT TW.
- Ít nhất 1 đợt BC ở BN + 1 ở ĐP → test `lanhdao_tw` không duyệt được KQ do `canbo_bn` trình.

---

## Blockers & rủi ro cho Lệnh 3

### B1. API Cổng PLQG cho CT-011 / CT-025 / CT-302

**Mức độ:** Blocker cho TC CT-011, CT-025, CT-302; ảnh hưởng dọc lifecycle đến DA_CONG_BO.

**Câu hỏi cần dev:** Môi trường `http://103.172.236.130:3000/` đã có mock/sandbox cho endpoint API Cổng PLQG (FR-XII-15) chưa? Nếu chưa:
- Workaround A: skip DA_CONG_BO, dùng DA_DUYET → DANG_THUC_HIEN (bỏ qua CT-011/012/014/025)
- Workaround B: test contract-level — intercept outbound request, verify payload đúng format TT17/2025, nhưng không verify rollback thực
- Workaround C: dev seed 1 CT ở `trangThai = DA_CONG_BO` trực tiếp DB (bypass API call)

### B2. Guard `capDonVi` mismatch trong `/auth/me` (khả năng data seeding bug)

**Quan sát Lệnh 2:** `GET /api/v1/auth/me` với JWT `canbo_tw` trả:
```json
{"userId": "...", "vaiTro": ["CB_TW"], "donViId": "00000000-0000-4000-8000-000000000001", "capDonVi": "DP"}
```

`capDonVi: "DP"` KHÔNG KHỚP với role `CB_TW` (theo [§1.2](../../../test-strategy.md#12-tài-khoản-test) → `canbo_tw` cấp TW, Cục BTTP). Có thể là:
(a) DB seed sai — `canbo_tw` user bị map sai đơn vị cấp DP
(b) Ngữ nghĩa `capDonVi` trên `/auth/me` khác với `capDonVi` của `DON_VI` (return về level của user chứ không phải unit)
(c) Bug BE `/auth/me` shape

**Impact:** Nếu (a) → mọi test scope (CT-201/202/204 etc.) sẽ cho kết quả sai vì CB_TW không thực sự ở TW. Cần verify qua UI topbar (smoke đã thấy hiển thị "Cán bộ TW — Cục BTTP — Bộ Tư pháp" → có vẻ (b) hoặc (c), không phải (a) nghiêm trọng).

**Action trước Lệnh 3:** Hỏi BE làm rõ ngữ nghĩa field `capDonVi` trong response `/auth/me`. Không block Lệnh 3 (smoke hiển thị role đúng) nhưng cần làm rõ để tránh nhầm khi debug CT-201/204.

**Verified 2026-04-20 trong Lệnh 3:** `canbo_tw` + `canbo_bn` + `canbo_tinh` đều trả `donViId = "00000000-0000-4000-8000-000000000001"` qua `/auth/me`. CT tạo bởi 3 account đều stamp cùng `donViId` này → KHÔNG phân biệt scope được bằng 3 account hiện có. **Test CT-201 (scope isolation) cần dùng account thực sự khác donVi** (ví dụ `qtht_bn` tại Bộ KH&ĐT + `qtht_dp` tại Sở TP HN theo §1.2) — nhưng các account đó có role QTHT không tạo CT được. **Cần dev seed thêm account CB_NV tại donVi BN + DP thật sự khác TW.**

### B3. Deadline TT17/2025 cho info-box CT-023

**Quan sát:** Info-box deadline hiển thị theo khoảng `han_nop − today`. Muốn test cả 2 path (đỏ khi < 7 ngày, xanh khi ≥ 7 ngày) cần seed đợt BC với `han_nop` tính toán được:
- Sơ bộ 6T: 10/06 (ĐP-BN) / 20/06 (TW)
- Sơ bộ năm: 10/11 / 20/11
- Tròn năm: 10/01 năm sau / 20/01 năm sau

**Ngày hiện tại:** 2026-04-20. Deadline gần nhất: `2026-06-10` (ĐP-BN sơ bộ 6T) = còn **51 ngày** → mặc định sẽ xanh. Để test highlight đỏ (< 7 ngày):
- Dùng FE devtools `Date.now` mock, hoặc
- Seed đợt BC với `han_nop = 2026-04-25` (5 ngày) — cần BE support custom `han_nop` override, hoặc
- Chạy lại test vào ngày 2026-06-03 → 2026-06-09 → deadline 6T tự nhiên < 7 ngày

### B4. Smoke CONDITIONAL PASS — detail page chưa verify

Smoke ngày 2026-04-19 không verify được detail page (+ Thêm CT, tab `Đợt báo cáo`, thanh tiến trình SM 8 state, info-box TT17/2025) do chain browse timeout >60s với Vite dev heavy load. Lệnh 3 đầu tiên phải **re-verify detail page render** — nếu detail crash → mọi TC Lệnh 4 đều FAIL/BLOCKED.

### B6. BE transition endpoints all return 403 — **BLOCKER Lệnh 3**

**Mức độ:** **CRITICAL BLOCKER** — chặn 13/14 state (7/8 state CT + 6/6 state DOT_BAO_CAO + 4/4 state BAO_CAO) của module.

**Triệu chứng (verified 2026-04-20):**

```
POST /api/v1/chuong-trinh-htpls/{id}/submit      → 403 Forbidden (canbo_tw|bn|dp + lanhdao_tw)
POST /api/v1/chuong-trinh-htpls/{id}/cancel      → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/activate    → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/complete    → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/pause       → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/resume      → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/publish     → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/unpublish   → 403 Forbidden
POST /api/v1/chuong-trinh-htpls/{id}/approve     → 422 "quyetDinh must be PHE_DUYET|TU_CHOI"  ← endpoint tồn tại và accept perm
```

**Context:**
- Response GET `/chuong-trinh-htpls/{id}` trả HATEOAS `_links.submit` + `_links.huy` (cancel) → BE biết endpoint có sẵn nhưng guard (CASL ability) chặn.
- JWT canbo_tw có permissions: `create_chuong_trinh_htpl`, `update_chuong_trinh_htpl`, `delete_chuong_trinh_htpl`, `approve_chuong_trinh_htpl`, `read_chuong_trinh_htpl`, **KHÔNG có** `submit_chuong_trinh_htpl` / `cancel_chuong_trinh_htpl` / `activate_chuong_trinh_htpl` / ...
- Endpoint `/approve` work (accept permission) nhưng state guard chặn vì CT đang DU_THAO (state machine enforce CHO_PHE_DUYET mới approve được).
- DELETE `/chuong-trinh-htpls/{id}` (soft delete BR-DATA-01) work OK → canbo_tw có quyền thật, không phải auth bug chung.

**Phân loại:**
- Pattern lặp BUG-BE-M8-002 (FR-08 Đánh giá): 4 transition endpoints missing/403.
- Đây là **BUG-BE-CT-001 Critical P0** (đề xuất).

**Root cause nghi ngờ:** BE CASL guards (trong `@CheckAbility` decorator) yêu cầu perm `submit_chuong_trinh_htpl` + `activate_...` + v.v., nhưng seed `permissions.json` chỉ có `create/update/delete/approve/read`. Thiếu ánh xạ transition-to-permission.

**Workaround cho Lệnh 3:**
- ❌ Không có workaround thuần client-side (không bypass được BE guard).
- Lệnh 4 TC CT-007/008/011/013/015/018/019/021 + mọi CT-020→CT-038 **skip** đến khi BE fix.
- Dev seed DB trực tiếp (dùng SQL `UPDATE CHUONG_TRINH_HTPL SET trangThai=...` + sequence các state) → không thực hiện qua API test, cần escalate.

**Estimated fix:** 30 phút-2h (thêm perms vào seed) HOẶC 2-3 ngày nếu phải redesign guard mapping.

**Ảnh hưởng test:** ~95% TC Nhóm 3a (13 TC) + 100% Nhóm 3b (11 TC) + 100% Nhóm 5 cross-module → **~24/42 TC BLOCKED** khi BE chưa fix.

---

### B5. OBS-CT-01 từ smoke — filter `Công bố` thay `Trạng thái`

List page có filter label `"Công bố"` thay vì `"Trạng thái"` (spec kỳ vọng). Có 2 khả năng:
(a) Filter `Công bố` chỉ filter boolean `da_cong_bo` (yes/no) → thiếu filter theo full 8 state → bug UI Minor
(b) Filter `Công bố` label là alias cho `trangThai` (semantic nói trạng thái công bố = 1 ý nghĩa trong SM) → OK

Lệnh 3/4 cần mở filter để verify options. Nếu (a) → log bug Minor, không block Lệnh 3.

---

## Kết luận Lệnh 2 + Lệnh 3

| Yếu tố | Trạng thái |
|--------|-----------|
| API `/chuong-trinh-htpls` reachable | ✅ 200 từ cả 3 scope |
| POST tạo CT DU_THAO | ✅ Work (canbo_tw/bn/dp đều tạo được) |
| PATCH update CT (optimistic lock `version`) | ✅ Work |
| DELETE soft delete (BR-DATA-01) | ✅ Work (CT6 is_deleted=true, verified) |
| Transition endpoints (`/submit` + 7 khác) | ❌ **403 Forbidden mọi role** — B6 BLOCKER |
| `/approve` endpoint | ✅ Tồn tại, accept perm, nhưng state guard enforce CHO_PHE_DUYET → không reach được do B6 |
| UI list render đúng cấu trúc | ✅ (smoke PASS) |
| UI detail page render đúng | ⚠️ Vẫn chưa verify (deferred) |
| Cổng PLQG API mock sẵn sàng | ❓ Chưa biết — B1 hỏi dev |

**Verdict Lệnh 2+3:** Infrastructure OK, CRUD basic work. **B6 chặn 100% lifecycle workflow** — tạo được DU_THAO, không đẩy lên state kế tiếp được. Data readiness đạt **1/14 state** = ~7% coverage. Cần BE fix B6 (BUG-BE-CT-001) trước khi Lệnh 4 functional có thể chạy workflow TC.

**Ước lượng effort Lệnh 3:** **cao (~2-3h)** — cần:
- 3 account CB NV (TW/BN/DP) × 1 chain lifecycle mỗi account
- 3 account CB PD (TW/BN/DP) để approve từng cấp (BR-AUTH-05)
- Re-login mỗi chuyển account (sessionStorage-based auth không bridge qua bash)
- Handle 2 auto-transition kép (CT-031 + CT-032)
- Test + Thêm CT form render first (block B4) → nếu fail, escalate

**Ngưỡng Lệnh 3 tối thiểu (MVP data):** 3 CT DU_THAO (1/cấp) + 1 CT DANG_THUC_HIEN + 1 đợt BC TAO_DOT + 1 BC CHO_PHE_DUYET = **đủ cho ~60% test case P0** (CT-001/002/003/007/015/018/020/027/031). Các TC còn lại (lifecycle sâu + tổng hợp TW + xuất file) cần seed thêm sau.

### Thực thi Lệnh 3 (2026-04-20) — chỉ đạt 7% coverage

**Đã hoàn thành (~5 phút):**
- ✅ POST tạo 7 CT DU_THAO (3 scope labels + 4 branch label); 6 alive + 1 soft-deleted
- ✅ Verified API contract: required fields `tenChuongTrinh`, `mucTieu`, `doiTuong`, `thoiGianBatDau`; optional `thoiGianKetThuc`, `nganSach`, `ghiChu`
- ✅ Verified PATCH + DELETE work
- ✅ Mapped 8 transition endpoints (5 return 403 guarded, 1 returns 422 schema, 2 return 404 NOT exist — `reject`, `go-cong-bo`)

**Đã chặn (~10 phút probe):**
- ❌ Lifecycle workflow (CHO_PHE_DUYET → DA_DUYET → DA_CONG_BO → ... → HUY) — **B6 block 7/8 state CT**
- ❌ Đợt BC + Báo cáo CT (6+4 state) — chained blocker từ CT không reach được DANG_THUC_HIEN

**Không verify được:**
- Scope isolation (canbo_tw/bn/dp chung donVi → test không discriminate — B2 escalate)
- Cổng PLQG mock — B1 vẫn pending
- UI detail page render — B4 vẫn pending
- Deadline TT17/2025 info-box — B3 vẫn pending (ngày hiện tại 2026-04-20 còn 51 ngày đến deadline gần nhất)

---

## Recommendations cho Lệnh 3

### Priority order (nếu thời gian giới hạn)

**Batch 1 (MVP, 30 phút):**
1. `canbo_tw` tạo 3 CT DU_THAO + re-verify detail page render (block B4)
2. 1 CT → trình PD → CHO_PHE_DUYET
3. `lanhdao_tw` → duyệt → DA_DUYET
4. `canbo_tw` kích hoạt → DANG_THUC_HIEN
5. `canbo_tw` tạo 1 đợt BC → TAO_DOT

**Batch 2 (lifecycle đợt BC, 30 phút):**
6. `canbo_tw` lập BC + trình duyệt KQ → CHO_DUYET_KQ + BC CHO_PHE_DUYET
7. `lanhdao_tw` duyệt KQ → DA_DUYET_KQ + BC DA_DUYET
8. Test CT-204 (`canbo_tw` gửi TW → expect reject ERR-XI-08-02)

**Batch 3 (cross-unit BN + ĐP, 60 phút):**
9. `canbo_bn` → walk full lifecycle CT + BC đến DA_GUI_TW
10. `canbo_tinh` → walk full lifecycle CT + BC đến DA_GUI_TW
11. `canbo_tw` → tổng hợp (CT-038) → DA_TONG_HOP + BAO_CAO_CT_HTPL TONG_HOP_TW

**Batch 4 (branch states, 20 phút):**
12. Thêm CT → tạm dừng (TAM_DUNG) + hoàn thành (HOAN_THANH) + hủy (HUY)
13. Thêm đợt BC → từ chối KQ (TU_CHOI path) + DA_TONG_HOP

### Technique đề xuất

- **Follow `history.pushState + popstate` pattern** từ FR-08 Đánh giá (đã verified preserve auth state khi navigate) — tránh `$B goto` làm mất sessionStorage auth.
- **Chia nhỏ chain:** mỗi chain ≤8 step để tránh timeout >60s. Cookie bridging không work (sessionStorage). Inject `auth-store` vào sessionStorage ở đầu mỗi chain:
  ```json
  ["goto","http://103.172.236.130:3000/"],
  ["js","sessionStorage.setItem('auth-store', '<DUMP_FROM_PREV_CHAIN>')"],
  ["goto","http://103.172.236.130:3000/ct-htpldn/danh-sach"]
  ```
  Đọc `auth-store` raw qua `$B js "sessionStorage.getItem('auth-store')"` ở cuối chain 1 (phải làm ngay trước khi bash kết thúc).
- **Hoặc đơn giản hơn:** dùng API direct với JWT (đã lấy được qua curl ở Lệnh 2) → `POST /api/v1/chuong-trinh-htpls` tạo CT + `POST /api/v1/chuong-trinh-htpls/:id/transitions/:action` để đẩy state. Nhanh hơn UI walk, nhưng cần verify BE endpoints có sẵn (xem [srs-fr-15-ct-htpldn.md](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) §API).

---

## Phụ lục — JWT token mẫu (Lệnh 2, 2026-04-20)

```
# canbo_tw (5188B JWT, role CB_TW)
POST /api/v1/auth/login  { username: canbo_tw, password: Test@1234 } → otpToken
POST /api/v1/auth/verify-otp  { otpToken, otpCode: "666666" } → accessToken (Bearer)

# /auth/me trả:
{ userId: "11111111-0001-4000-8000-000000000003", vaiTro: ["CB_TW"],
  donViId: "00000000-0000-4000-8000-000000000001", capDonVi: "DP" }
  ^-- capDonVi=DP không khớp role CB_TW: xem §Blockers B2
```

---

*Report v1.1 | 2026-04-20 | Data Readiness CT HTPLDN — Lệnh 3 partial: 1/14 state (DU_THAO) populated với 7 CT; 13/14 state BLOCKED by BUG-BE-CT-001 (transition endpoints 403). Chờ BE fix trước khi Lệnh 4.*
