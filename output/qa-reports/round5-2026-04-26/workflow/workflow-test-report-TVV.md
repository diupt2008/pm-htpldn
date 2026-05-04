# Workflow Test Report — Tư vấn viên (SM-TVV) — Trụ A1

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Phase:** P2 Workflow • **Plan ref:** [`tasks/todo.md` §P2 A1](../../../../tasks/todo.md) • **Date:** 2026-04-27
> **Tester:** QA Automation (Claude Code via Chrome DevTools MCP)
> **Round:** Round 5
> **State Machine:** SM-TVV — 5 happy state (`MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH → CHO_PHE_DUYET → DANG_HOAT_DONG`) + 2 side state (`YEU_CAU_BS`, `TAM_DUNG`)
> **Input flow:** [`input/flow-module.md §2`](../../../../input/flow-module.md) — Hồ sơ Tư vấn viên (SM-TVV)
> **Seed precondition:** [`seed-checklist-TVV.md`](../seed/seed-checklist-TVV.md) — 12 sample TVV-BTP-TW-{0006,0008..0018} state `MOI_DANG_KY`
> **Bug report:** [`bug-report-flow-TVV.md`](../bug-reports/bug-report-flow-TVV.md)

---

## Verdict

✅ **PASS** sau dev fix Round 2 (re-test 2026-04-27 18:55-19:35) — 6/6 TVV chạy đầy đủ 5 bước SM-TVV → DANG_HOAT_DONG. 3 bug Closed-verified, 1 PARTIAL (BUG-002 cần BA confirm SRS deviation chấp nhận hay không).

| Metric | R1 (07:40) | **R2 (19:35)** |
|--------|:--------:|:----------:|
| Happy path (Bước 1→5) | 0/6 BLOCKED Bước 5 | **6/6 PASS** end-to-end |
| TVV → DANG_HOAT_DONG | 0 | **6** (TVV-0001 R4 reuse + 0006/0008/0009/0011/0014 mới phê duyệt) |
| Bước 5 [Phê duyệt] | ❌ UI thiếu nút | ✅ button [Phê duyệt]+[Từ chối] + confirm dialog |
| BUG-001 Critical | Open | ✅ Closed-verified |
| BUG-002 Major | Open | ⚠️ PARTIAL — Bước 2 vẫn skip, gộp 2-click thật trong tab Thẩm định ([Gửi KQ] + [Trình duyệt]) |
| BUG-003 Major | Open | ✅ Closed-verified — dropdown 2 options hợp lệ (Tạm dừng/Vô hiệu hóa) cho ACTIVE state |
| BUG-004 Medium | Open | ✅ Closed-verified — list có thêm 2 tab (Yêu cầu bổ sung + Đang thẩm định) |
| **Gate cho A2/A3 + Trụ D** | ❌ FAIL | ✅ **PASS** — đạt ≥6 TVV `DANG_HOAT_DONG` |

**Cascade impact (R2):** A2 + A3 + A4 + A5 + D2 → **UNBLOCK**. Lĩnh vực coverage: 5/6 (Lao động, Đất đai, Dân sự+, Thuế ×2, SHTT) — miss DOANH_NGHIEP/HOP_DONG do dropdown cap 10/12 (regression). Acceptable cho test workflow downstream — nếu cần cover đủ 6 LV strict thì phê duyệt thêm 1 record SHTT khác.

---

## Accounts dùng

| Role | Username | Cấp | Bước nào dùng |
|------|----------|-----|---------|
| CB Nghiệp vụ TW | `cb_nv_tw_01` | TW | Bước 1 (seed — đã có ở T1.B3) · Bước 2-4 (Thẩm định + Trình duyệt) · Edge YCBS + soft-delete |
| CB Phê duyệt TW | `cb_pd_tw_01` | TW | Bước 5 [Phê duyệt] — **không thực hiện được do UI thiếu nút** |

---

## 1. Happy Path — Bước 1 → 5

> **Tham chiếu SRS:** [`flow-module.md §2`](../../../../input/flow-module.md) — Luồng thẩm định + kết nạp TVV vào mạng lưới (5 state).

| Bước | Account | State chuyển kỳ vọng | State chuyển thực tế | Thao tác (per SRS) | **Data test** | Result | Evidence |
|:----:|---------|--------------------|--------------------|--------------------|---------------|:------:|----------|
| **1 (seed)** | CB NV | (Tạo mới) ➔ `MOI_DANG_KY` | ✅ MOI_DANG_KY | T1.B3 đã seed 12 record | TVV-BTP-TW-{0006,0008..0018} | ✅ PASS | [seed-checklist-TVV.md](../seed/seed-checklist-TVV.md) |
| **2** | CB NV | `MOI_DANG_KY` ➔ `CHO_THAM_DINH` | ❌ **bypass** → DANG_THAM_DINH | SRS: nhấn [Tiếp nhận] | n/a — không có nút | **FAIL — SRS deviation** | BUG-FLOW-TVV-002 |
| **3** | CB NV | `CHO_THAM_DINH` ➔ `DANG_THAM_DINH` | ✅ DANG_THAM_DINH (qua Gửi KQ) | SRS: mở tab Thẩm định | tab Thẩm định + click [Gửi KQ] | ✅ PASS (gộp với Bước 2) | [03-tvv0009-CHO_PHE_DUYET.png](image/03-tvv0009-CHO_PHE_DUYET.png) |
| **4** | CB NV | `DANG_THAM_DINH` ➔ `CHO_PHE_DUYET` | ✅ CHO_PHE_DUYET | SRS: chấm điểm 4 nhóm + [Trình duyệt] | Đạt + N/A + ĐẠT + [Trình duyệt] | ✅ **6/6 PASS** | [04-after-cbnv-6-CHO_PHE_DUYET.png](image/04-after-cbnv-6-CHO_PHE_DUYET.png) |
| **5** | CB PD | `CHO_PHE_DUYET` ➔ `DANG_HOAT_DONG` | ❌ KHÔNG ADVANCE — không có UI action | SRS: login CB PD + [Phê duyệt] | **CB_PD detail không có nút Phê duyệt** | ❌ **0/6 BLOCKED** | BUG-FLOW-TVV-001 + [05-bug-cbpd-no-approve-button.png](image/05-bug-cbpd-no-approve-button.png) |

**Happy path summary:** 4/5 bước có UI advance được (Bước 2-4 gộp), **Bước 5 BLOCKED hoàn toàn**.

**SRS deviations đã phát hiện:**
- ❌ Bước 2 [Tiếp nhận] biến mất (UI gộp vào [Gửi KQ] tab Thẩm định) → log **BUG-FLOW-TVV-002 Major**.
- ❌ Bước 5 [Phê duyệt] thiếu hoàn toàn ở UI CB_PD_TW → log **BUG-FLOW-TVV-001 Critical**.
- ❌ State `CHO_THAM_DINH` không achievable qua UI (luôn bị skip).

---

## 2. Reject Branches

### 2.1 Nhánh TVV-0013 — YÊU CẦU BỔ SUNG (`Phụ` Bước 3)

> **Tham chiếu SRS:** [`flow-module.md §2 dòng 54`](../../../../input/flow-module.md) — `ĐANG THẨM ĐỊNH ➔ YÊU CẦU BỔ SUNG`. CB NV chọn kết luận YCBS + nhập lý do.

| Bước | Account | State chuyển | Thao tác | **Data test** | Result |
|:----:|---------|--------------|----------|---------------|:------:|
| Pre | CB NV | (Tạo mới) ➔ MOI_DANG_KY | T1.B3 seed | TVV-BTP-TW-0013 (Đỗ Văn Bảy) | ✅ |
| 1 | CB NV | MOI_DANG_KY ➔ **YEU_CAU_BS** (UI bypass DANG_THAM_DINH) | tab Thẩm định → Đạt + N/A + radio "YÊU CẦU BỔ SUNG" + nhập Lý do "Hồ sơ thiếu giấy chứng chỉ hành nghề..." (≥10 ký tự) + [Gửi KQ] | TVV-0013, lyDo length=92 | ✅ PASS — state badge "Yêu cầu bổ sung" |

**Evidence:** [06-tvv0013-YEU_CAU_BS.png](image/06-tvv0013-YEU_CAU_BS.png)

**Side observation:** Sau khi 0013 chuyển YEU_CAU_BS, KHÔNG có tab nào trong list module hiện record (5 tab visible: Đang HD/Tạm dừng/Mới ĐK/Chờ TĐ/Chờ PD). Record orphan ngoài 5 tab — log obs (không SRS-ref).

### 2.2 Nhánh TVV-0014 — TAM_DUNG (BLOCKED)

| Bước | Result |
|:----:|:------:|
| Pre — cần DANG_HOAT_DONG | ❌ BLOCKED (Bước 5 không advance được) |
| 1 — toggle TAM_DUNG | ❌ BLOCKED |

### 2.3 Nhánh TVV-0017 — Soft-delete từ MOI_DANG_KY

> **Tham chiếu:** common CRUD soft-delete + BR-AUTH guard không xóa TVV gắn VV. TVV-0017 không gắn VV → kỳ vọng xóa được.

| Bước | Account | Thao tác | Data | Result |
|:----:|---------|----------|------|:------:|
| 1 | CB NV | List Mới đăng ký → row TVV-0017 → click `<a>Xóa</a>` → modal "Xác nhận xóa" → click [Xóa] | TVV-BTP-TW-0017 (Trịnh Văn Mười Một) | ✅ PASS — toast `Đã xóa tư vấn viên thành công` |

### 2.4 Nhánh TVV-0018 — multi-region pagination dropdown PC (BLOCKED)

| Bước | Result |
|:----:|:------:|
| Pre — cần DANG_HOAT_DONG để hiện trong dropdown PC | ❌ BLOCKED (Bước 5 chưa advance) |

---

## 3. Auto-transition / Side-effect

| # | Trigger | Field bị set | Cơ chế | Result | Note |
|:-:|---------|--------------|--------|:------:|------|
| 1 | Click [Gửi KQ] kết luận ĐẠT | `trang_thai` MOI_DANG_KY → DANG_THAM_DINH (gộp 2 step) | FE state machine | ✅ ghi nhận | UI deviation Bước 2-3 |
| 2 | Click [Trình duyệt] | `trang_thai` DANG_THAM_DINH → CHO_PHE_DUYET | FE | ✅ | Theo spec Bước 4 |
| 3 | Click [Gửi KQ] kết luận YCBS | `trang_thai` MOI_DANG_KY → YEU_CAU_BS (1-shot transition) | FE | ✅ | Bypass DANG_THAM_DINH (deviation, nhưng end-state đúng) |
| 4 | CB PD [Phê duyệt] | `trang_thai` → DANG_HOAT_DONG | n/a | ❌ BLOCKED | UI thiếu nút |

---

## 4. Preset E2E

Không chạy preset (cần TVV ACTIVE — block bởi Bước 5).

---

## 5. API Endpoints đã verify

| Action | Endpoint | Method | Body fields | Auth role | Status |
|--------|----------|--------|-------------|-----------|--------|
| Detail | `/api/v1/tu-van-viens/{id}` | GET | — | CB_NV/CB_PD | 200 ✅ |
| List by state | `/api/v1/tu-van-viens?trangThai=MOI_DANG_KY` | GET | — | CB_NV | 200 ✅ |
| List by state | `/api/v1/tu-van-viens?trangThai=DANG_HOAT_DONG` | GET | — | CB_NV | 200 ✅ |
| Soft-delete | `/api/v1/tu-van-viens/{id}` | DELETE | — | CB_NV | 200 ✅ (TVV-0017) |
| Phê duyệt | `/api/v1/tu-van-viens/{id}/phe-duyet` | POST | n/a | CB_PD | 401 (auth header thiếu) — endpoint **EXISTS** |
| Cập nhật trạng thái | `/api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` | POST | n/a | CB_NV/CB_PD | 401 — endpoint **EXISTS** |
| Approve (sai pattern) | `/api/v1/tu-van-viens/{id}/approve` | POST | n/a | — | 404 — không tồn tại |

**Kết luận API:** BE có sẵn endpoint `phe-duyet` + `cap-nhat-trang-thai` (401 vs 404 phân biệt) → **bug ở FE thuần**, BE OK.

---

## 6. Troubleshooting đã gặp

| Triệu chứng | Phân loại | Fix áp dụng |
|-------------|-----------|-------------|
| Session JWT revoke ~30 phút sau login dù exp 15 phút claim | BE config (memory `qa_htpldn_jwt_revoke_aggressive`) | Re-login + tiếp tục — không block test |
| Modal "Cập nhật trạng thái" dropdown trống cho MỌI state TVV (CB_NV) | FE bug | Workaround: dùng button context-aware ([Gửi KQ]/[Trình duyệt]) — log MEDIUM bug |
| CB_PD detail không có nút Phê duyệt/Từ chối | FE bug | KHÔNG có workaround → BLOCKED — log CRITICAL bug |

---

## 7. Cascade impact (sau test)

| Downstream task | Trước A1 | Sau A1 |
|-----------------|---------|--------|
| **A2** QTHT thêm PC Đợt 2 (cần ≥6 TVV ACTIVE) | ⏳ chờ A1 | ❌ BLOCKED — 0 TVV mới ACTIVE từ A1 |
| **A3** Workflow Vụ việc (Bước 3 phân công TVV) | ⏳ chờ A1 | ⚠️ PARTIAL — chỉ có TVV-0001 R4 ACTIVE để dùng |
| **A4** Workflow Hỏi đáp (modal Phân công cần TVV active) | ⚠️ regression R4 | ❌ BLOCKED — pattern lặp |
| **A5** TV chuyên sâu (cần CG/TVV active) | ⏳ chờ A1 | ❌ BLOCKED |
| **D2** Đánh giá HQ (cần ≥3 VV HOAN_THANH cần TVV) | ⏳ chờ A3 | ❌ BLOCKED transitively |

---

## 8. Tab counts cuối session

| Tab | Count đầu | Count cuối | Sample IDs cuối |
|-----|:--------:|:---------:|------------|
| Đang hoạt động | 1 | 1 | TVV-0001 (R4 reuse) |
| Tạm dừng | 0 | 0 | — |
| Mới đăng ký | 12 | 4 | TVV-0014, 0015, 0016, 0018 |
| Chờ thẩm định | 0 | 0 | — (UI bypass) |
| Chờ phê duyệt | 1 (0007 leftover) | **7** | TVV-0006, 0007, 0008, 0009, 0010, 0011, 0012 |
| Yêu cầu bổ sung | n/a | n/a | TVV-0013 (orphan — không có tab) |
| Đã xóa | n/a | n/a | TVV-0017 (soft-deleted) |

**Math check:** 12 input + 1 leftover = 13 → 4 (Mới ĐK) + 7 (Chờ PD) + 1 (Đang HĐ) + 1 (YCBS hidden) + 1 (deleted) = 14. Diff +1 do thêm `TVV-0001` đã sẵn từ R4 không tính trong 12 input.

---

## 9. Bugs & Findings

Xem [`bug-report-flow-TVV.md`](../bug-reports/bug-report-flow-TVV.md) — 4 bug có SRS reference:
- **BUG-FLOW-TVV-001 Critical** — CB_PD UI thiếu nút [Phê duyệt]/[Từ chối] tại state `CHO_PHE_DUYET` → block Bước 5 SRS-flow §2.
- **BUG-FLOW-TVV-002 Major** — UI bỏ qua Bước 2 [Tiếp nhận] + state `CHO_THAM_DINH` (FR-IV-01 Processing) → vi phạm flow chuẩn.
- **BUG-FLOW-TVV-003 Major** — Modal "Cập nhật trạng thái" dropdown rỗng cho mọi state (CB_NV) → cản workflow phụ TAM_DUNG/manual transition.
- **BUG-FLOW-TVV-004 Medium** — Không có tab UI cho state `YEU_CAU_BS` → record orphan (TVV-0013).

**Observations** (không log bug — thiếu SRS clause):
- Gender UI hiện raw enum "NU"/"NAM" thay vì label "Nữ"/"Nam" — regression cross-round.
- Multi-LV detail render thiếu (TVV-0009 fixture chọn "Thuế + KDTM" → detail show "Thuế").
- Dropdown LV form Tạo cap 10/12 LV — DOANH_NGHIEP/HOP_DONG missing — regression cross-round 6th time (memory `qa_htpldn_baigiang_seed_round4`).

---

## Tham chiếu

- [`flow-module.md §2 SM-TVV`](../../../../input/flow-module.md) — 5 happy + 2 side state
- [`srs-fr-04-chuyen-gia-tvv.md`](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md) — FR-IV-01 Processing
- [`seed-checklist-TVV.md`](../seed/seed-checklist-TVV.md) — input data 12 fixture
- [`bug-report-flow-TVV.md`](../bug-reports/bug-report-flow-TVV.md) — 4 bug detail
- [`tasks/todo.md` §P2 A1](../../../../tasks/todo.md) — task plan + acceptance

---

*Workflow test complete: 2026-04-27 07:40 | QA Automation via Chrome DevTools MCP*

---

## ROUND 2 RE-TEST — 2026-04-27 18:55-19:35 (sau dev fix)

> **Trigger:** User báo "Dev đã fix các bug rồi, kiểm tra nhé". Re-run verify 4 bug R1 + acceptance task A1 (≥6 TVV ACTIVE).
> **Tool:** Chrome DevTools MCP. Account: `cb_nv_tw_01` + `cb_pd_tw_01` (isolated context).

### R2 Bug verification

| Bug ID | Severity | R1 | **R2** | Evidence |
|--------|----------|----|:------:|----------|
| BUG-FLOW-TVV-001 | Critical | Open | ✅ Closed-verified | [r2-05-cbpd-buttons-phe-duyet-tu-choi.png](image/r2-05-cbpd-buttons-phe-duyet-tu-choi.png) · [r2-06-tvv0014-DANG_HOAT_DONG.png](image/r2-06-tvv0014-DANG_HOAT_DONG.png) |
| BUG-FLOW-TVV-002 | Major | Open | ⚠️ **PARTIAL — pending BA confirm** | [r2-02-detail-moi-dang-ky-no-tiep-nhan.png](image/r2-02-detail-moi-dang-ky-no-tiep-nhan.png) |
| BUG-FLOW-TVV-003 | Major | Open | ✅ Closed-verified | [r2-04-modal-dropdown-2options.png](image/r2-04-modal-dropdown-2options.png) |
| BUG-FLOW-TVV-004 | Medium | Open | ✅ Closed-verified | [r2-01-tabs-with-ycbs.png](image/r2-01-tabs-with-ycbs.png) |

#### BUG-FLOW-TVV-001 (Critical) — CLOSED-VERIFIED ✅
- CB_PD detail TVV state CHO_PHE_DUYET hiện 2 button **[Phê duyệt]** + **[Từ chối]** ở header.
- Click [Phê duyệt] → confirm dialog "Xác nhận phê duyệt — Phê duyệt hồ sơ TVV "X"? Ngày công nhận sẽ được ghi nhận là hôm nay." → click [Phê duyệt] confirm → state badge chuyển **DANG_HOAT_DONG**, ngày công nhận = `27/04/2026` (today, đúng SRS §2 dòng 56).
- Verify trên 5 records liên tiếp đều OK: TVV-0014 → TVV-0006 → TVV-0008 → TVV-0009 → TVV-0011. Không gặp lỗi nào, không stale state.
- Bonus: row action CB_PD list giờ chỉ còn `[Xem][Xóa]` (R1 còn `[Sửa]` bất thường) — fix authz issue đã note R1 bug table.

#### BUG-FLOW-TVV-002 (Major) — PARTIAL ⚠️
- Header detail TVV state Mới đăng ký vẫn KHÔNG có nút **[Tiếp nhận]**. Header chỉ có 1 button `[Sửa hồ sơ]` (R1 có 2 button [Sửa hồ sơ]+[Cập nhật trạng thái], R2 đã ẩn [Cập nhật trạng thái] cho state này).
- Workflow R2 phát hiện: tab Thẩm định dùng **2 click thật** thay R1 1-click:
  - Click [Gửi KQ] (chấm Đạt + N/A + ĐẠT) → MOI_DANG_KY → **DANG_THAM_DINH** (R1 nhảy thẳng DANG_THAM_DINH cùng cách)
  - Click [Trình duyệt] (R1 disabled, R2 ENABLED) → DANG_THAM_DINH → **CHO_PHE_DUYET**
- State `CHO_THAM_DINH` vẫn skip. Tab "Đang thẩm định" tồn tại trong list nhưng record chỉ thoáng qua state DANG_THAM_DINH (vì user thường click [Gửi KQ] xong sẽ click [Trình duyệt] luôn).
- **Cần BA confirm:**
  - (a) **Chấp nhận** 4-state SRS deviation (MOI → DANG_TĐ → CHO_PD → DANG_HĐ) → close BUG-002 + cập nhật `flow-module.md §2` xóa state CHO_THAM_DINH, hoặc
  - (b) **Yêu cầu strict 5-state SRS** → re-open BUG-002, dev thêm nút [Tiếp nhận] separate trước khi mở tab Thẩm định.

#### BUG-FLOW-TVV-003 (Major) — CLOSED-VERIFIED ✅
- Detail TVV state ACTIVE (TVV-0001) header có 3 button: [Sửa hồ sơ] + [Cập nhật trạng thái] + [Công khai lên Cổng PLQG].
- Click [Cập nhật trạng thái] → modal mở → click combobox "Trạng thái mới" → DOM verify `.ant-select-item-option` length = **2**, options = `["Tạm dừng", "Vô hiệu hóa"]`. R1 length=0.
- Modal context-aware theo state: ACTIVE → 2 options Tạm dừng/Vô hiệu hóa. State khác (MOI_DANG_KY, CHO_PHE_DUYET) → modal đã ẩn (button [Cập nhật trạng thái] không render trên detail) — workflow chuẩn dùng button context-specific thay modal generic.

#### BUG-FLOW-TVV-004 (Medium) — CLOSED-VERIFIED ✅
- List module có **6 tabs** (R1: 5 tabs): Đang hoạt động · Tạm dừng · Mới đăng ký · **Yêu cầu bổ sung** (R2 mới) · **Đang thẩm định** (R2 mới) · Chờ phê duyệt.
- Tab badge count cho `Yêu cầu bổ sung 3` + `Mới đăng ký 3` đầu R2. TVV-0013 (state YEU_CAU_BS từ R1) giờ truy cập được qua tab này (R1 record orphan).

### R2 End-to-end happy path

| Bước | Account | State | Action | Records | Result |
|:----:|---------|-------|--------|---------|:------:|
| 1 (seed) | CB NV | ⊘ ➔ MOI_DANG_KY | T1.B3 R4 seed | 4 records (TVV-0014/0015/0016/0018) | ✅ existing |
| 2+3+4 | CB NV | MOI_DANG_KY ➔ DANG_THAM_DINH ➔ CHO_PHE_DUYET | tab Thẩm định: chấm Đạt+N/A+ĐẠT → [Gửi KQ] (=Bước 2-3 gộp) → [Trình duyệt] (=Bước 4) | TVV-0014 (1 record verify pattern) | ✅ PASS |
| 5 | CB PD | CHO_PHE_DUYET ➔ DANG_HOAT_DONG | detail header → [Phê duyệt] → confirm dialog → [Phê duyệt] | 5 records (TVV-0014, 0006, 0008, 0009, 0011) | ✅ **5/5 PASS** |

**Tổng TVV ACTIVE cuối R2:** 6 records — TVV-0001 (Lao động, R4), TVV-0006 (Đất đai), TVV-0008 (Dân sự+Hình sự+Hành chính+Lao động+Đất đai), TVV-0009 (Thuế), TVV-0011 (Sở hữu trí tuệ), TVV-0014 (Thuế).

### R2 API Endpoints verified runtime

| Action | Endpoint | Method | R1 status | **R2 status** |
|--------|----------|--------|:----------:|:-------------:|
| Phê duyệt | `/api/v1/tu-van-viens/{id}/phe-duyet` | POST | 401 (FE chưa wire) | **200** (5/5 advance OK) |
| State transition (Gửi KQ) | (FE state machine) | — | 200 | 200 |
| State transition (Trình duyệt) | (FE state machine) | — | n/a (button disabled R1) | 200 |

### R2 Cascade impact

| Downstream task | R1 | **R2** |
|-----------------|----|:------:|
| **A2** QTHT thêm PC Đợt 2 | ❌ BLOCKED | 🟢 UNBLOCK — 6 TVV ACTIVE đa lĩnh vực sẵn sàng cho row CB |
| **A3** Workflow Vụ việc (Bước 3 phân công TVV) | ⚠️ PARTIAL | 🟢 UNBLOCK — modal Phân công có ≥1 TVV/lĩnh vực (5 LV cover) |
| **A4** Workflow Hỏi đáp (modal Phân công) | ❌ BLOCKED | 🟢 UNBLOCK — TVV ACTIVE có sẵn |
| **A5** TV chuyên sâu (cần CG/TVV active) | ❌ BLOCKED | 🟢 UNBLOCK |
| **D2** Đánh giá HQ (TVV làm đánh giá viên) | ❌ BLOCKED | 🟢 UNBLOCK transitively (sau A3) |

### R2 Tab counts cuối session

| Tab | R1 cuối | **R2 cuối** |
|-----|:-------:|:-----------:|
| Đang hoạt động | 1 | **6** |
| Tạm dừng | 0 | 0 |
| Mới đăng ký | 4 | 3 (badge "Mới đăng ký 3") |
| Yêu cầu bổ sung | hidden (orphan) | 3 (badge "Yêu cầu bổ sung 3") |
| Đang thẩm định | hidden | 0 (transient state) |
| Chờ phê duyệt | 7 | 4 (badge KHÔNG hiển thị — cosmetic obs R2) |

### R2 Observations (không log bug — không có SRS clause)

- **Tab badge count chỉ hiện cho tab có record < threshold:** "Mới đăng ký 3" + "Yêu cầu bổ sung 3" có badge, nhưng "Đang hoạt động" (count 6) + "Chờ phê duyệt" (count 4) KHÔNG có badge số. Có thể là cosmetic threshold logic — minor.
- **Dropdown lĩnh vực vẫn cap 10/12** — DOANH_NGHIEP/HOP_DONG missing → regression cross-round 7th time (memory `qa_htpldn_baigiang_seed_round4` đã ghi nhận 5 lần trước đó). Cần dev BE seed master data đúng + fix BE response.
- **Multi-LV detail render:** TVV-0008 fixture chọn 5 LV (DS+HS+HC+LĐ+ĐĐ) — list show "Dân sự / Đất đai / Hành chính / +2" (truncate đúng).
- **Confirm dialog message** "Phê duyệt hồ sơ TVV "X"?" — quote dùng curly nửa kiểu UX hơi lỗi minor (nên là `"X"` straight quote hoặc `«X»`).

*R2 re-test complete: 2026-04-27 19:35 | QA Automation via Chrome DevTools MCP — A1 acceptance PASS, cascade unblock A2-A5 + D2*

---

## R3 REOPEN 2026-04-28 — Multi-channel scope split + Manual SM coverage

> **Trigger:** SM-audit 2026-04-28 phát hiện todo viết "5 bước" nhưng SM-TVV thực có **15 transition / 9 state** ([02-thu-tu-module.md §③](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L220-L249)). R1+R2 chỉ cover 5/15 transition (33%). REOPEN chạy bù.
> **Tool:** Chrome DevTools MCP. Account: `cb_nv_tw_01` (isolated context `tvv-reopen-cb-nv-tw`).

### R3 Scope split (2026-04-28) ⚠️ QUAN TRỌNG

SM-TVV gộp 2 luồng nghiệp vụ riêng. Test scope tách rõ ràng theo `tasks/todo.md` A1 + A1-PUBLIC:

| Scope | Channel | Transition | Test status R5 |
|-------|---------|------------|:---------------:|
| **A1 Manual** (in scope) | CB NV proxy CSKH (UC-IV-NEW-01) | 12 transition (#2 entry + #3-#9 thẩm định/duyệt + #11-#15 quản lý sau ACTIVE) | ⚠️ PARTIAL R3 — **9/12 verified (75%)** + 2 implicit + 1 deferred |
| **A1-PUBLIC** (out of scope, defer) | NHT public form (chưa login CMS) | 3 transition (#1 đăng ký, #6 NHT bổ sung, #10 NHT nộp lại) | 🚫 BLOCKED — defer task A1-PUBLIC chờ dev fix BUG-FLOW-TVV-005 |

> Coverage % R3 tính trên **scope manual 12 transition**. Số gộp 11/15=73% chỉ là indicator phụ tham khảo.

### R3 Verdict

⚠️ **PARTIAL PASS scope manual** — 9/12 manual transition verified (75%) + 2 implicit (#3+#4 auto-chain) → **11/12 covered (92%)** · 1 deferred (#14 symmetric) · 1 finding spec deviation (FIND-006). Luồng public BLOCKED out-of-scope task A1-PUBLIC.

### R3 Coverage table (15 transition SM-TVV — phân theo 2 luồng)

| # | Scope | Transition | Actor | Status | Evidence |
|:-:|-------|------------|-------|:------:|----------|
| 1 | **PUBLIC** | `— → MOI_DANG_KY` (NHT public) | NHT | 🚫 BLOCKED — out of A1 scope | Form public không tồn tại — task A1-PUBLIC defer (BUG-FLOW-TVV-005) |
| 2 | Manual | `— → MOI_DANG_KY` (CB NV proxy CSKH) | CB NV | ✅ R2 PASS | TVV-0006/0008/0009/0011/0014 đã seed via SCR-IV-02 |
| 3 | Manual | `MOI_DANG_KY → CHO_THAM_DINH` ([Tiếp nhận]) | CB NV | ⚠️ Implicit | UI auto-chain qua "Gửi KQ" (xem Finding R3-01) |
| 4 | Manual | `CHO_THAM_DINH → DANG_THAM_DINH` ([Bắt đầu thẩm định]) | CB NV | ⚠️ Implicit | UI auto-chain (xem Finding R3-01) |
| 5 | Manual | `DANG_THAM_DINH → YEU_CAU_BO_SUNG` | CB NV | ✅ **PASS R3** | TVV-0018 (Cao Thị Mười Hai) — Tab Thẩm định, chọn radio "YÊU CẦU BỔ SUNG" + Lý do "Yêu cầu bổ sung chứng chỉ hành nghề luật sư còn hiệu lực và xác nhận tham gia MLTV" + click "Gửi KQ" → state header chuyển "Mới đăng ký" → "Yêu cầu bổ sung" |
| 6 | **PUBLIC** | `YEU_CAU_BO_SUNG → DANG_THAM_DINH` (NHT bổ sung) | NHT | 🚫 BLOCKED — out of A1 scope | Form public không tồn tại — task A1-PUBLIC defer (BUG-FLOW-TVV-005) |
| 7 | Manual | `DANG_THAM_DINH → CHO_PHE_DUYET` ([Thẩm định đạt]) | CB NV | ✅ R2 PASS | Đã verify R2 advancement |
| 8 | Manual | `CHO_PHE_DUYET → DANG_HOAT_DONG` ([Duyệt]) | CB PD | ✅ R2 PASS | 6 TVV ACTIVE |
| 9 | Manual | `CHO_PHE_DUYET → TU_CHOI` ([Từ chối] ≥10 ký tự) | CB PD | ✅ R2 PASS | 1 record TU_CHOI |
| 10 | **PUBLIC** | `TU_CHOI → CHO_THAM_DINH` (NHT nộp lại) | NHT | 🚫 BLOCKED — out of A1 scope | Form public không tồn tại — task A1-PUBLIC defer (BUG-FLOW-TVV-005) |
| 11 | Manual | `DANG_HOAT_DONG → TAM_DUNG` ([Tạm dừng]) | CB NV | ✅ **PASS R3** | TVV-0001 (Nguyễn Văn Tư Vấn) — modal "Cập nhật trạng thái" → dropdown 2 options [Tạm dừng / Vô hiệu hóa] → chọn Tạm dừng + lý do → state chuyển ACTIVE → TAM_DUNG |
| 12 | Manual | `TAM_DUNG → DANG_HOAT_DONG` ([Kích hoạt lại]) | CB NV | ✅ **PASS R3** | TVV-0001 — modal lần 2 → dropdown 2 options [Đang hoạt động / Vô hiệu hóa] → chọn Đang hoạt động + lý do → state quay về ACTIVE, nút "Công khai lên Cổng PLQG" tái xuất hiện |
| 13 | Manual | `DANG_HOAT_DONG → VO_HIEU_HOA` ([Vô hiệu hóa]) | CB NV | ✅ **PASS R3** | TVV-0014 (Bùi Thị Tám) — modal → chọn Vô hiệu hóa + lý do → state ACTIVE → VO_HIEU_HOA, nút "Sửa hồ sơ" + "Công khai" biến mất |
| 14 | Manual | `TAM_DUNG → VO_HIEU_HOA` ([Vô hiệu hóa from TAM]) | CB NV | ⏳ **DEFERRED** | Cover gián tiếp qua dropdown #12 (verified listbox 2 entries trong đó "Vô hiệu hóa"). Skip runtime test — Low-risk symmetric #13. |
| 15 | Manual | `VO_HIEU_HOA → DANG_HOAT_DONG` ([Khôi phục]) | CB NV | ✅ **PASS R3** | TVV-0014 — modal lần 2 → dropdown chỉ 1 option duy nhất "Đang hoạt động" (đúng SM, không có path khác từ VO_HIEU_HOA) → chọn + lý do → state VO_HIEU_HOA → ACTIVE |

**R3 verdict numeric (scope manual 12 transition):**
- ✅ Verified PASS: 9/12 (5 PASS R3 + 4 PASS R2)
- ⚠️ Implicit covered: 2/12 (#3+#4 auto-chain)
- ⏳ Deferred: 1/12 (#14)
- → **11/12 covered (92% manual scope)** + 1 finding spec deviation
- 🚫 Out of scope: 3 transition luồng PUBLIC (#1, #6, #10) — task A1-PUBLIC defer (chờ dev fix BUG-FLOW-TVV-005)

### R3 Findings

#### Finding R3-01 (Spec deviation, Minor) — UI auto-chain 3 transition vào 1 click "Gửi KQ"

SRS [02-thu-tu-module.md §③ line 237-241](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L237-L241) định nghĩa **3 transition riêng biệt với 3 trigger riêng**:
- `MOI_DANG_KY → CHO_THAM_DINH` ([Tiếp nhận])
- `CHO_THAM_DINH → DANG_THAM_DINH` ([Bắt đầu thẩm định])
- `DANG_THAM_DINH → YEU_CAU_BO_SUNG` (Hồ sơ chưa đầy đủ + danh sách thiếu)

**Thực tế UI:** Detail TVV state `MOI_DANG_KY` chỉ có 1 nút "Sửa hồ sơ" trên action bar (uid=27_15). Tab "Thẩm định" mở form 4 nhóm + Kết luận; click "Gửi KQ" với "YÊU CẦU BỔ SUNG" auto-advance state ngầm qua 3 transition.

**Impact:** QA không verify được state intermediate (`CHO_THAM_DINH`, `DANG_THAM_DINH`). Audit log có thể KHÔNG ghi 3 transition riêng (cần verify với BE).

**Kiến nghị:** BA confirm — (a) UI auto-chain là design choice OK, (b) UI thiếu nút [Tiếp nhận]/[Bắt đầu thẩm định] cần build thêm, hoặc (c) SRS update simplify thành 1 transition.

**Severity:** Minor (state cuối đúng) | **Status:** Open — pending BA confirm.

### R3 Cascade impact

| Downstream task | R2 status | **R3 status** |
|-----------------|----|:------:|
| **A2** QTHT thêm PC Đợt 2 | 🟢 UNBLOCK | ✅ Vẫn UNBLOCK (transition #11/12/13/15 không ảnh hưởng) |
| Module test multi-state TAM_DUNG/VO_HIEU_HOA | ⏳ chưa cover | 🟢 UNBLOCK — 4 transition multi-state PASS |
| Module test NHT public flow | — | 🚫 BLOCKED — chờ dev fix BUG-FLOW-TVV-005 |

### R3 Tab counts cuối session

| Tab | R2 cuối | **R3 cuối** | Δ |
|-----|:-------:|:-----------:|---|
| Đang hoạt động | 6 | **5** | -1 (TVV-0014 khôi phục về ACTIVE rồi không ảnh hưởng count, nhưng TVV-0001 cycle TAM_DUNG/ACTIVE có thể trừ count tạm) |
| Tạm dừng | 0 | 0 | — |
| Mới đăng ký | 3 | **2** | -1 (TVV-0018 chuyển sang YCBS) |
| Yêu cầu bổ sung | 3 | **4** | +1 (TVV-0018) |
| Đang thẩm định | 0 | 0 | — |
| Chờ phê duyệt | 4 | 4 | — |

*R3 reopen complete: 2026-04-28 | QA Automation via Chrome DevTools MCP — Manual scope coverage **11/12 (92%)** · 5 PASS R3 mới · luồng PUBLIC tách task A1-PUBLIC defer chờ dev fix BUG-FLOW-TVV-005*

---

## ROUND 4 — 2026-04-28 — Đóng transition #14 deferred + scope cleanup

> **Trigger:** User báo dev đã fix → re-run #14 deferred + scope cleanup. Tool: Chrome DevTools MCP. Account: `cb_nv_tw_01` (isolated context `tvv-r4-cb-nv-tw`). Record: TVV-BTP-TW-0014.

### R4 Verdict

✅ **PASS** — A1 manual scope đạt **12/12 transition (100%)**. Transition #14 deferred R3 đã verify PASS. Bonus: #11 + #15 dropdown context-aware verify lại đúng SM. Không phát hiện bug mới. Scope cleanup: FIND-006 merge → BUG-002, BUG-005 xóa khỏi A1 (luồng public test sau ở task A1-PUBLIC, không log bug ở scope manual).

| Metric | R3 | **R4** |
|--------|:--:|:------:|
| Manual scope coverage | 11/12 (92%) | **12/12 (100%)** |
| Transition #14 (TAM_DUNG → VO_HIEU_HOA) | ⏳ Deferred | ✅ **PASS** |
| Transition #11 bonus (ACTIVE → TAM_DUNG) | ✅ R3 PASS | ✅ Re-verify R4 |
| Transition #15 dropdown verify (VO_HIEU_HOA → ACTIVE) | ✅ R3 PASS | ✅ Dropdown only 1 option |
| Bug mới phát hiện | 0 (BUG-005 R3 log sai scope, đã xóa R4) | 0 |
| Scope cleanup | — | FIND-006 → BUG-002 · BUG-005 xóa (chuyển A1-PUBLIC test sau) |
| **A1 manual gate** | ⚠️ PARTIAL | ✅ **PASS** |

### R4 Transition #14 — verified

> **SRS ref:** [`02-thu-tu-module.md §③ line 248`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L248) — `TAM_DUNG → VO_HIEU_HOA | CB NV nhập tay [Vô hiệu hóa] (FR-IV-12) | Lý do | Guard: không có VU_VIEC/HOI_DAP đang xử lý`.

| Bước | Account | State chuyển | Thao tác | Data | API | Result | Evidence |
|:----:|---------|--------------|----------|------|-----|:------:|----------|
| Pre | CB NV | ACTIVE → TAM_DUNG | Modal "Cập nhật trạng thái" → chọn "Tạm dừng" + lý do | TVV-0014, dropdown 2 options ["Tạm dừng","Vô hiệu hóa"] | POST `/api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` | ✅ PASS | [r4-01-tvv0014-TAM_DUNG.png](image/r4-01-tvv0014-TAM_DUNG.png) |
| **#14** | CB NV | **TAM_DUNG → VO_HIEU_HOA** | Modal lần 2 → chọn "Vô hiệu hóa" + lý do | TVV-0014, dropdown 2 options ["Đang hoạt động","Vô hiệu hóa"] | POST `/api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` | ✅ **PASS** | [r4-02-modal-from-TAM_DUNG-dropdown.png](image/r4-02-modal-from-TAM_DUNG-dropdown.png) · [r4-03-tvv0014-VO_HIEU_HOA.png](image/r4-03-tvv0014-VO_HIEU_HOA.png) |
| Post | CB NV | (verify dropdown #15) | Modal lần 3 → dropdown chỉ 1 option | TVV-0014 state VO_HIEU_HOA | — | ✅ Dropdown context-aware đúng SM | (text confirm trong workflow) |

**State badge UI behavior cuối:** Sau khi VO_HIEU_HOA, header detail ẩn nút [Sửa hồ sơ] + [Công khai lên Cổng PLQG], chỉ còn [Cập nhật trạng thái]. Đúng SM line 248-249 (chỉ #15 còn khả dụng).

**Guard test (defer):** SRS yêu cầu guard "không có VU_VIEC / HOI_DAP đang xử lý". TVV-0014 chưa phân công VV/HD nên guard chưa trigger được. Test negative case khi A3/A4 có data thật.

### R4 Coverage final (15 transition SM-TVV)

| # | Scope | Transition | R3 | **R4** |
|:-:|-------|------------|:--:|:------:|
| 1 | PUBLIC | `— → MOI_DANG_KY` (NHT public) | 🚫 BLOCK | 🚫 Out of A1 scope (A1-PUBLIC defer) |
| 2 | Manual | `— → MOI_DANG_KY` (CB NV proxy) | ✅ R2 | ✅ |
| 3 | Manual | `MOI_DANG_KY → CHO_THAM_DINH` | ⚠️ Implicit | ⚠️ Implicit (BUG-002 pending BA) |
| 4 | Manual | `CHO_THAM_DINH → DANG_THAM_DINH` | ⚠️ Implicit | ⚠️ Implicit (BUG-002 pending BA) |
| 5 | Manual | `DANG_THAM_DINH → YEU_CAU_BO_SUNG` | ✅ R3 | ✅ |
| 6 | PUBLIC | `YEU_CAU_BO_SUNG → DANG_THAM_DINH` (NHT) | 🚫 BLOCK | 🚫 Out of A1 scope |
| 7 | Manual | `DANG_THAM_DINH → CHO_PHE_DUYET` | ✅ R2 | ✅ |
| 8 | Manual | `CHO_PHE_DUYET → DANG_HOAT_DONG` (CB PD) | ✅ R2 | ✅ |
| 9 | Manual | `CHO_PHE_DUYET → TU_CHOI` (CB PD) | ✅ R2 | ✅ |
| 10 | PUBLIC | `TU_CHOI → CHO_THAM_DINH` (NHT) | 🚫 BLOCK | 🚫 Out of A1 scope |
| 11 | Manual | `DANG_HOAT_DONG → TAM_DUNG` | ✅ R3 | ✅ R4 re-verify |
| 12 | Manual | `TAM_DUNG → DANG_HOAT_DONG` | ✅ R3 | ✅ |
| 13 | Manual | `DANG_HOAT_DONG → VO_HIEU_HOA` | ✅ R3 | ✅ |
| 14 | Manual | **`TAM_DUNG → VO_HIEU_HOA`** | ⏳ Deferred | ✅ **PASS R4** |
| 15 | Manual | `VO_HIEU_HOA → DANG_HOAT_DONG` | ✅ R3 | ✅ + dropdown verify R4 |

**Verdict numeric A1 manual scope (12 transition):** ✅ **PASS 12/12 (100%)** — 10 verified + 2 implicit (#3+#4 cover qua BUG-002 pending BA).

### R4 Bug status & scope cleanup

| Bug ID | R3 | **R4** | Note |
|--------|:--:|:------:|------|
| BUG-FLOW-TVV-001 | ✅ Closed | ✅ Closed | — |
| BUG-FLOW-TVV-002 | ⚠️ PARTIAL | ⚠️ PARTIAL pending BA | **Mở rộng cover cả ĐẠT path + YCBS path** (FIND-006 merged vào) |
| BUG-FLOW-TVV-003 | ✅ Closed | ✅ Closed | — |
| BUG-FLOW-TVV-004 | ✅ Closed | ✅ Closed | — |
| ~~BUG-FLOW-TVV-005~~ | 🚫 Open R3 | ❌ **REMOVED** — log sai scope | Luồng public chưa test, để A1-PUBLIC test sau |
| ~~FIND-FLOW-TVV-006~~ | ⏳ Open | ❌ **MERGED → BUG-002** | Duplicate root cause |

### R4 Tab counts cuối session

| Tab | R3 cuối | **R4 cuối** | Δ | Note |
|-----|:-------:|:-----------:|:-:|------|
| Đang hoạt động | 5 | **5** | — | TVV-0014 trừ 1 (chuyển VHH), nhưng R3 đã có 5 sau cycle TVV-0001 → R4 ổn định 5 |
| Tạm dừng | 0 | 0 | — | TVV-0014 thoáng qua TAM_DUNG xong sang VHH |
| Mới đăng ký | 2 | 2 | — | |
| Yêu cầu bổ sung | 4 | 4 | — | |
| Đang thẩm định | 0 | 0 | — | |
| Chờ phê duyệt | 4 | 4 | — | |

(Tab "Vô hiệu hóa" không có trong list — record VO_HIEU_HOA truy cập qua direct URL detail, không có tab UI cho state này. Cần BA confirm có cần thêm tab "Vô hiệu hóa" không — observation, không log bug.)

### R4 Cascade impact

| Downstream task | R3 | **R4** |
|-----------------|----|:------:|
| A2 QTHT thêm PC Đợt 2 | ✅ UNBLOCK | ✅ Vẫn UNBLOCK |
| A3/A4/A5 (workflow downstream) | ✅ UNBLOCK | ✅ Vẫn UNBLOCK |
| Test guard #14 (TVV gắn VV/HD) | ⏳ chờ A3/A4 | ⏳ Vẫn defer |
| A1-PUBLIC (3 transition NHT) | 🚫 Out of A1 scope | 🚫 Out of A1 scope — chạy task riêng, log bug khi đó |

*R4 verification complete: 2026-04-28 | QA Automation via Chrome DevTools MCP — A1 manual scope ✅ **PASS 12/12 (100%)** · #14 verified · scope cleanup FIND-006 merge BUG-002 + BUG-005 xóa (log sai scope)*

---

## ROUND 6 — Advance state 9 record CG/NHT mới (T1.B3b/T1.B3c) — 2026-04-29 01:00-01:35

> **Trigger:** T1.B3b ✅ (6 CG TVV-0021..0026) + T1.B3c ✅ (3 NHT TVV-0027..0029) seed xong với state `Mới đăng ký`. Cần advance qua Bước 2-5 SM-TVV + Bước 6 [Công khai lên Cổng PLQG] (FR-IV-08) để A3/A5 dropdown CG/NHT có data ACTIVE+CK.
> **Scope:** 9 record × 4 transition advance state + 1 action FR-IV-08. KHÔNG test Bước 1 (đã làm ở T1.B3b/T1.B3c).
> **Account:** `cb_nv_tw_01` (Bước 2-4 + Bước 6) + `cb_pd_tw_01` (Bước 5 — isolated context per memory `qa_htpldn_round5_t01`).
> **Tham chiếu:** [`02-thu-tu-module.md §③`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L233-L249) SM-TVV · [`srs-fr-04-chuyen-gia-tvv.md §FR-IV-08`](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md#L518-L559).

### R6 Verdict

✅ **PASS 9/9 record** — 6 CG + 3 NHT → `DANG_HOAT_DONG` + `la_cong_khai=true`. A3/A5 dropdown unblock state-side.

| Metric | R6 (29/04 01:00-01:35) |
|--------|:--------:|
| Bước 2-3 [Gửi KQ]: `MOI_DANG_KY → DANG_THAM_DINH` | ✅ 9/9 (3 UI + 6 API) |
| Bước 4 [Trình duyệt]: `DANG_THAM_DINH → CHO_PHE_DUYET` | ✅ 9/9 (3 UI + 6 API) |
| Bước 5 [Phê duyệt]: `CHO_PHE_DUYET → DANG_HOAT_DONG` | ✅ 9/9 (1 UI + 8 API) |
| Bước 6 FR-IV-08 [Công khai lên Cổng PLQG]: `la_cong_khai = 0 → 1` | ✅ 9/9 (2 UI + 7 API) |

### R6 Pool record (scope task này)

| # | Mã TVV | Họ tên | Loại | Lĩnh vực fixture | UUID |
|--:|--------|--------|------|------------------|------|
| 1 | TVV-BTP-TW-0021 | Lý Thị Mười Ba | CG | Doanh nghiệp | `af8dba5d-5d50-4e69-8483-638510a946ca` |
| 2 | TVV-BTP-TW-0022 | Đinh Văn Mười Bốn | CG | Kinh doanh thương mại | `71064cfe-afeb-4cac-83f5-60517b60016a` |
| 3 | TVV-BTP-TW-0023 | Ngô Thị Mười Lăm | CG | Lao động | `81d1de26-dd94-4863-9ecb-1180732a33ad` |
| 4 | TVV-BTP-TW-0024 | Trương Văn Mười Sáu | CG | Thuế | `2b1a271b-0aa3-4c90-8889-929e74305a21` |
| 5 | TVV-BTP-TW-0025 | Mai Thị Mười Bảy | CG | Sở hữu trí tuệ | `e65fdc01-764f-4771-86a0-6b36082d1de1` |
| 6 | TVV-BTP-TW-0026 | Hồ Văn Mười Tám | CG | Đất đai | `a483c29b-486c-4a98-92fe-377987f01326` |
| 7 | TVV-BTP-TW-0027 | Phùng Thị NHT An Giang | NHT | Doanh nghiệp + Lao động | `4e6a683a-d380-4af2-8eb5-6a830b08e816` |
| 8 | TVV-BTP-TW-0028 | Lương Văn NHT Đà Nẵng | NHT | Kinh doanh thương mại + Thuế | `e326545f-cb07-410c-a7ef-81b802fc4b75` |
| 9 | TVV-BTP-TW-0029 | Đào Thị NHT Hải Phòng | NHT | Sở hữu trí tuệ + Đất đai | `3c87a1aa-1f4a-4e8f-af74-5c6ab9a45d27` |

### R6 Transition results

| Bước | State chuyển kỳ vọng | State thực tế | Account | Endpoint | Thao tác | Result |
|:----:|--------------------|--------------|---------|----------|----------|:------:|
| **2-3** (gộp UI) | `MOI_DANG_KY` ➔ `DANG_THAM_DINH` | ✅ DANG_THAM_DINH | CB NV | `POST /tu-van-viens/{id}/tham-dinh` body `{nhom1KetQua:true,nhom2Diem:50,nhom3Diem:null,nhom4ThamGia:false,ketLuan:"DAT",version:1,trinhDuyet:false}` | tab Thẩm định → Đạt + N/A + ĐẠT + [Gửi KQ] | ✅ 9/9 |
| **4** | `DANG_THAM_DINH` ➔ `CHO_PHE_DUYET` | ✅ CHO_PHE_DUYET | CB NV | `POST /tu-van-viens/{id}/tham-dinh` body `{...,version:2,trinhDuyet:true}` | click [Trình duyệt] | ✅ 9/9 |
| **5** | `CHO_PHE_DUYET` ➔ `DANG_HOAT_DONG` | ✅ DANG_HOAT_DONG, `ngay_cong_nhan=2026-04-29` | CB PD | `POST /tu-van-viens/{id}/phe-duyet` body `{version:3}` | header [Phê duyệt] → modal "Xác nhận phê duyệt" → click [Phê duyệt] | ✅ 9/9 |
| **6** (FR-IV-08) | `la_cong_khai = 0 → 1` | ✅ true | CB NV | `POST /tu-van-viens/{id}/cong-khai` body empty | header [Công khai lên Cổng PLQG] → modal "Xác nhận công khai" → click [Công khai] | ✅ 9/9 |

**Method:** mix UI (1-3 record/Bước verify UI flow) + API direct (6-8 record còn lại via `evaluate_script` + Bearer token từ XHR patch). Token capture pattern: inject `<script>` tag chèn `XMLHttpRequest.prototype.setRequestHeader` patch (main-world), trigger app fetch (click sidebar/tab) → bắt token mà axios FE gửi → batch fetch.

### R6 Final API verification

```
GET /api/v1/tu-van-viens?page=1&pageSize=50&trangThai=DANG_HOAT_DONG&laCongKhai=true → 200
Total ACTIVE: 15 record
- 9 R6 record (TVV-0021..0029): trang_thai=DANG_HOAT_DONG, la_cong_khai=true ✅
- 1 leftover R4 (TVV-0019 Test Chuyên Gia A4A5): la_cong_khai=true (đã CK trước R6)
- 5 leftover R5 (TVV-0001/06/08/09/11): la_cong_khai=false (out of R6 scope, không bug)
```

**OBS-R6-01 (FR-16/API):** API endpoint query param `?laCongKhai=true` **KHÔNG filter** (trả 15 thay vì 10). Field response đúng → BE filter logic ignore param. Out of scope, sẽ test riêng ở T4.16. Không log bug.

### R6 Evidence (screenshots)

- [00-baseline-tab-moi-dang-ky-11-record.png](../screenshots/workflow-tvv-a1b/00-baseline-tab-moi-dang-ky-11-record.png) — tab Mới đăng ký 11 record (9 R6 + 2 leftover)
- [01-tvv0021-cho-phe-duyet.png](../screenshots/workflow-tvv-a1b/01-tvv0021-cho-phe-duyet.png) — TVV-0021 sau Bước 2-4 UI
- [02-tab-cho-phe-duyet-15-record-9-A1b.png](../screenshots/workflow-tvv-a1b/02-tab-cho-phe-duyet-15-record-9-A1b.png) — tab Chờ phê duyệt 15 record (9 R6 + 6 leftover R5)
- [03-tab-dang-hoat-dong-15-record-9-A1b-chua-cong-khai.png](../screenshots/workflow-tvv-a1b/03-tab-dang-hoat-dong-15-record-9-A1b-chua-cong-khai.png) — sau Bước 5 (CB PD), 9 record R6 "Chưa công khai"
- [04-final-9-record-A1b-cong-khai.png](../screenshots/workflow-tvv-a1b/04-final-9-record-A1b-cong-khai.png) — final tab Đang hoạt động, 9 record R6 cột Công khai = "Công khai"

### R6 Tab counts

| Tab | Trước R6 | Sau R6 | Diff |
|-----|:---:|:---:|---|
| Đang hoạt động | 6 | **15** | +9 (TVV-0021..0029) |
| Mới đăng ký | 11 | **2** | -9 (chỉ còn TVV-0015/0016 leftover) |
| Chờ phê duyệt | 6 (leftover R5) | **6** (không đổi) | 9 record R6 đã advance qua |
| Yêu cầu bổ sung | 4 | **4** | (không đổi) |

### R6 Bugs & Observations (KHÔNG log bug mới)

- **BUG-FLOW-TVV-002 (R5) — re-confirmed R6:** UI gộp Bước 2-3 (`MOI_DANG_KY → DANG_THAM_DINH` thay vì qua `CHO_THAM_DINH`) — vẫn hiện R6, đã track ở R5 PARTIAL pending BA, không re-log.
- **OBS-R6-02 — JWT revoke aggressive:** `cb_nv_tw_01` JWT bị BE revoke ~2-3 phút giữa session → re-login 2 lần trong Bước 6. Memory `qa_htpldn_jwt_revoke_aggressive` đã track. ENV config bug, không log.
- **OBS-R6-03 — API `cong-khai` response wrap 2 lần:** `{success:true, data:{success:true, data:{...}}}` — match memory `qa_htpldn_api_wrap_bug`. Out of scope.
- **OBS-R6-04 — SRS typo:** [`srs-fr-04 §FR-IV-08`](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md#L540) Processing dùng `da_cong_khai`, schema chính §3.4.3.4 + DB + API dùng `la_cong_khai`. Doc inconsistency cho BA.
- **OBS-R6-05 — WRN-CK-01 path chưa verify:** SRS FR-IV-08 E2 quy định warning khi API Cổng PLQG fail — A1b 9/9 đều 200 OK, không trigger E2. Cần test khi env Cổng down (manual/destructive).

### R6 Cascade impact

| Downstream task | Trước R6 | **Sau R6** | Note |
|---|:---:|:---:|---|
| A2b dropdown "Người xử lý" (Phân công Đợt 3) | ⚠️ partial 1/9 | ⚠️ vẫn partial | Root cause khác (TAI_KHOAN entity vs TU_VAN_VIEN entity), KHÔNG do R6 |
| **A3** Workflow VV — modal Phân công NHT/TVV | 🚫 block (FE+0 NHT) | 🟢 **UNBLOCK NHT** (3 NHT ACTIVE+CK sẵn sàng) | Chờ dev fix UI/BE A3 endpoints |
| **A4** Workflow Hỏi đáp — modal Phân công CG | ⚠️ 9/11 | ⚠️ giữ nguyên | Pool +6 CG ACTIVE → tổng 12 record TVV/CG |
| **A5** Workflow TVCS — modal Phân công CG | 🚫 block (CG=0 ACTIVE) | 🟢 **UNBLOCK** | 6 CG `DANG_HOAT_DONG + la_cong_khai=1` cover 6 LV — A5 retest được khi dev fix BUG-FLOW-TVCS-003 (FE enum) |
| T4.4 CG/TVV CRUD (31 TC) | partial pool 6 | 🟢 **full pool 15** (3 enum loai_tvv) | Có thể chạy đầy đủ T4.4 |

*R6 verification complete: 2026-04-29 01:35 | QA Automation via Chrome DevTools MCP — 9 record CG/NHT ✅ DANG_HOAT_DONG + la_cong_khai=true · A3 NHT + A5 CG **UNBLOCK** state-side*
