# Workflow Test Report — Hỏi đáp pháp lý (SM-HOIDAP) — Nhóm II

> **Phase:** P3 Workflow • **Plan ref:** [`tasks/todo.md` §P3 T3.2](../../../../tasks/todo.md) • **Date:** 2026-04-25
> **Tester:** QA AI via Claude Code + Chrome DevTools MCP
> **Round:** Round 4
> **State Machine:** SM-HOIDAP — 6 happy state (`MỚI → TIẾP NHẬN → ĐANG XỬ LÝ → CHỜ PHÊ DUYỆT → ĐÃ DUYỆT → CÔNG KHAI/HOÀN THÀNH`) + side state (`TỪ CHỐI`, `ĐÃ ĐÁNH GIÁ`)
> **Input flow:** [`input/flow-module.md §6`](../../../../input/flow-module.md) — FLOW TẠO DỮ LIỆU LUỒNG "HỎI ĐÁP PHÁP LÝ" (SM-HOIDAP)
> **Seed precondition:** [`seed-checklist-HOIDAP.md`](../seed/seed-checklist-HOIDAP.md) — 6 sample `HD-20260424-002..007` state `MOI`
> **Bug report:** [`bug-report-flow-hoidap.md`](../bug-reports/bug-report-flow-hoidap.md)

---

## Verdict

❌ **FAIL** — 2/8 nhánh PASS · 6 BLOCKED · 1 Critical bug regression chặn toàn bộ Bước 3-6 + reject branch + auto-state.

| Metric | Giá trị |
|--------|---------|
| Happy path (Bước 1→6) | **2/6 PASS** — Bước 1 (seed có sẵn từ T2.A1) + Bước 2 Tiếp nhận; Bước 3-6 BLOCKED |
| Reject branches | **0/1 PASS** — BLOCKED (không tới được state CHỜ PHÊ DUYỆT) |
| Auto-transition | **0/1 PASS** — BLOCKED (checkbox "Đã trả lời" Bước 4 không reachable) |
| Phân công edge (TVV/NHT/CB NV khác) | **0/1 PASS** — BLOCKED (button [Phân công] missing) |
| Bug found | **1 Critical** (xem [`bug-report-flow-hoidap.md`](../bug-reports/bug-report-flow-hoidap.md)) |
| **Gate cho P4 Functional T4.1** | ☐ PASS / ☑ **FAIL** — workflow gate không đạt, T4.1 phụ thuộc state HOÀN THÀNH cho TC HD→KHOCH auto |

---

## Accounts dùng

| Role | Username | Cấp | Ghi chú |
|------|----------|-----|---------|
| CB Nghiệp vụ TW | `cb_nv_tw_01` | TW | Bước 1 (seed ngày 24/04) + Bước 2 Tiếp nhận HD-002 ngày 25/04 |
| CB Nghiệp vụ BN | `cb_nv_bn_01` (BKH) | BN | Bước 2 Tiếp nhận HD-007 ngày 24/04 (verify cross-account) |
| CB Phê duyệt TW | `cb_pd_tw_01` | TW | **Chưa dùng** — BLOCKED ở Bước 3 |
| TVV | `tvv_01..03` (DP) | DP | **Chưa dùng** — BLOCKED ở Bước 3 |

---

## 1. Happy Path — Bước 1 → 6 (HD-20260424-002 "Hỏi về thời gian nghỉ phép năm")

> **Tham chiếu SRS:** [`flow-module.md §6`](../../../../input/flow-module.md) — luồng 6 state có Auto-transition ở Bước 4 (checkbox "Đã trả lời").

| Bước | Account | State chuyển | Thao tác (per SRS) | Data test | API endpoint | Result | Evidence |
|:----:|---------|--------------|--------------------|-----------|--------------|:------:|----------|
| **1 (seed)** | `cb_nv_tw_01` | (Tạo mới) ➔ `MỚI` | `[+ Thêm mới]` SCR-II-01, nhập DN + lĩnh vực + tiêu đề + nội dung | HD-20260424-002 + DN-HNI-0001 + Lao động + "Hỏi về thời gian nghỉ phép năm" | POST `/api/v1/hoi-daps` 201 | ✅ PASS | [seed-checklist-HOIDAP.md](../seed/seed-checklist-HOIDAP.md) (24/04 16:11) |
| **2** | `cb_nv_tw_01` | `MỚI` ➔ `TIẾP NHẬN` | Mở chi tiết HD → click `[Tiếp nhận]` → confirm modal | HD-002 | POST `/hoi-daps/{id}/tiep-nhan` (suy đoán) | ✅ PASS | `image/01-hd002-detail-Moi.png` + `image/02-hd002-after-tiepnhan.png`. Stamp `Người tiếp nhận = CB Nghiệp vụ TW 01`, `Ngày tiếp nhận = 25/04/2026 19:21`, `Thời hạn SLA = 12/05/2026 19:21`, badge state đổi thành `Tiếp nhận`, hiển thị "Còn 12 ngày LV". |
| **3** | `cb_nv_tw_01` | `TIẾP NHẬN` ➔ `ĐANG XỬ LÝ` | Click `[Phân công]` → chọn TVV/NHT hoặc CB NV khác → submit | (skip) | POST `/hoi-daps/{id}/phan-cong` | 🚫 **BLOCKED** | **Button `[Phân công]` không tồn tại trong DOM**. Toàn bộ trang detail (mode `Tiếp nhận`) chỉ render 2 button: `[← Quay lại]` + `[edit Sửa]`. Form `[Sửa]` chỉ có field thông tin câu hỏi gốc, KHÔNG có dropdown người xử lý hoặc field phân công. Verified bằng `evaluate_script` quét toàn DOM — 0 button match `Phân công\|Trả lời\|Xử lý\|Phê duyệt\|Công khai\|Đóng hồ sơ\|Từ chối\|Bổ sung\|Trình duyệt`. ⇒ `BUG-FLOW-HOIDAP-001` Critical. |
| **4** | TVV/CB NV được PC | `ĐANG XỬ LÝ` ➔ `CHỜ PHÊ DUYỆT` | Login user PC → nhập nội dung trả lời → tích checkbox "Đã trả lời" → Lưu → AUTO chuyển state | (skip) | PATCH `/hoi-daps/{id}` + auto-trigger | 🚫 **CASCADE BLOCKED** | Không tới được state ĐANG XỬ LÝ → không có entry point để test auto-transition. |
| **5** | `cb_pd_tw_01` | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | Login CB PD → tab "Chờ phê duyệt" → mở HD → click `[Phê duyệt]` | (skip) | POST `/hoi-daps/{id}/phe-duyet` | 🚫 **CASCADE BLOCKED** | — |
| **6** | `cb_nv_tw_01` | `ĐÃ DUYỆT` ➔ `CÔNG KHAI` / `HOÀN THÀNH` | Login lại CB NV → click `[Công khai]` (push Cổng PLQG) hoặc `[Đóng hồ sơ]` (HOÀN THÀNH ẩn lịch sử) | (skip) | POST `/hoi-daps/{id}/cong-khai` hoặc `/dong-ho-so` | 🚫 **CASCADE BLOCKED** | — |

**Happy path summary:** 2/6 bước PASS (Bước 1 seed + Bước 2 Tiếp nhận). Bước 3-6 cascade BLOCKED bởi `BUG-FLOW-HOIDAP-001`.

**SRS deviations phát hiện:**
- **D-01 — UI thiếu button `[Phân công]` ở state `TIẾP NHẬN`** vi phạm `flow-module.md §6 Bước 3` ("Nhấn nút [Phân công], chọn Account TVV/NHT hoặc CB NV khác để xử lý câu hỏi"). Log `BUG-FLOW-HOIDAP-001` Critical.
- **D-02 — UI thiếu trang/khu vực "Soạn trả lời + checkbox Đã trả lời"** vi phạm `flow-module.md §6 Bước 4` ("Phải tích vào checkbox 'Đã trả lời' rồi nhấn Lưu. Hệ thống sẽ TỰ ĐỘNG chuyển thẳng sang trạng thái CHỜ PHÊ DUYỆT"). Cùng nguyên nhân `BUG-FLOW-HOIDAP-001` (không reachable do thiếu Bước 3).

---

## 2. Reject Branches

### 2.1 Nhánh Bước 5 — CB PD `[Từ chối]` lý do ≥10 ký tự → bounce `ĐANG XỬ LÝ`

> **Tham chiếu SRS:** [`flow-module.md §6 Lưu ý quan trọng khi test flow rẽ nhánh`](../../../../input/flow-module.md) — "Khi Cán bộ Phê duyệt chọn [Từ chối]: Bắt buộc phải nhập Lý do (tối thiểu 10 ký tự). Trạng thái sẽ bị giật ngược lại `ĐANG XỬ LÝ` (đối với Hỏi đáp)".

| Bước | Account | State chuyển | Thao tác | Data test | API endpoint | Result |
|:----:|---------|--------------|----------|-----------|--------------|:------:|
| Pre | `cb_nv_tw_01` + TVV | `MỚI` ➔ `CHỜ PHÊ DUYỆT` | Advance qua Bước 2-4 happy | HD-20260424-003 (Beta — Thuế) | (chuỗi happy path) | 🚫 **CASCADE BLOCKED** — không advance qua Bước 3 do `BUG-FLOW-HOIDAP-001` |
| 1 | `cb_pd_tw_01` | `CHỜ PHÊ DUYỆT` ➔ `ĐANG XỬ LÝ` | Click `[Từ chối]` + nhập lý do "Câu trả lời chưa đủ căn cứ pháp lý, đề nghị bổ sung" (49 ký tự) | HD-003 | POST `/hoi-daps/{id}/tu-choi` | 🚫 **CASCADE BLOCKED** |

### 2.2 Edge — Lý do <10 ký tự → validation error

| Bước | Account | State chuyển | Thao tác | Data test | API endpoint | Result |
|:----:|---------|--------------|----------|-----------|--------------|:------:|
| 1 | `cb_pd_tw_01` | giữ `CHỜ PHÊ DUYỆT` | Click `[Từ chối]` + nhập lý do "Sai" (3 ký tự) → expect FE validate hiển thị lỗi "Lý do tối thiểu 10 ký tự" | HD-003 | (BE không gọi do FE validate trước) | 🚫 **CASCADE BLOCKED** |

---

## 3. Auto-transition / Side-effect

| # | Trigger | Field bị set | Cơ chế | Data test | Result | Note |
|:-:|---------|--------------|--------|-----------|:------:|------|
| 1 | Bước 2 Tiếp nhận | `nguoi_tiep_nhan_id`, `ngay_tiep_nhan`, `thoi_han_sla` | Backend stamp khi POST tiep-nhan | HD-002: stamp `CB Nghiệp vụ TW 01 / 25/04/2026 19:21 / SLA 12/05/2026 19:21` | ✅ **PASS** | SLA "Còn 12 ngày LV" auto-compute (BR-CALC-03 hoặc tương đương — spec HOI_DAP nói "T+1 LV" nhưng UI thực render T+12 LV; obs ghi nhận để BA confirm). |
| 2 | Bước 4 checkbox "Đã trả lời" tích + Lưu | `trang_thai` auto đổi `ĐANG XỬ LÝ` → `CHỜ PHÊ DUYỆT` (KHÔNG cần nút Trình duyệt) | FE auto trigger PATCH với flag, BE auto-transition | HD-20260424-004 (Gamma) | 🚫 **CASCADE BLOCKED** | Cùng cause `BUG-FLOW-HOIDAP-001` — không vào được trang/khu vực "Soạn trả lời" để tích checkbox. |
| 3 | Mọi action | `version` increment | Optimistic locking +1 mỗi update | HD-002 version trace 1→2 sau Tiếp nhận | ⏸️ **N/A** | Field `version` không hiển thị trong UI; không có endpoint detail JSON exposed cho user role này để verify. Defer functional round T4.1 với network inspection. |

---

## 4. Phân công edge — Bước 3 (TVV / NHT / CB NV khác)

> **Tham chiếu SRS:** [`flow-module.md §6 Bước 3`](../../../../input/flow-module.md) — "chọn Account TVV/NHT hoặc CB NV khác để xử lý câu hỏi".

| Test | Mục tiêu | Data test cần | Result |
|------|----------|---------------|:------:|
| PC-01 | Modal Phân công render gợi ý TVV active đồng cấp | HD-20260424-005 + ≥1 TVV state ACTIVE | 🚫 **CASCADE BLOCKED** — không mở được modal |
| PC-02 | Phân công CB NV TW khác (`cb_nv_tw_02`) — verify nội bộ team | HD-005 + `cb_nv_tw_02` | 🚫 BLOCKED |
| PC-03 | Phân công NHT (Người hỗ trợ) `nht_01` — verify cross-role | HD-005 + `nht_01` | 🚫 BLOCKED |
| PC-04 | Manual picker khi gợi ý empty (R3 regression check) | HD-005 | 🚫 BLOCKED — chưa kiểm tra được sự tồn tại của picker |

**Liên hệ R1:** Round 1 (2026-04-23, memory `qa_htpldn_hoidap_flow_round1`) ghi nhận `BUG-HDFLOW-001` Critical — modal Phân công gợi ý empty + thiếu picker manual. **R4 worse**: button `[Phân công]` đã biến mất hoàn toàn khỏi UI (regression cấp cao hơn — R1 button có nhưng modal lỗi, R4 button missing). Có thể dev xoá button trong khi sửa modal mà chưa hoàn tất.

---

## 5. API Endpoints đã verify

| Action | Endpoint | Method | Body fields chính | Auth role | Status |
|--------|----------|--------|-------------------|-----------|--------|
| Get list | `/api/v1/hoi-daps` (suy đoán theo plural pattern T2.A1) | GET | filter trangThai/donViMa | CB_NV_TW | ✅ render 7 mục |
| Get detail | `/api/v1/hoi-daps/{id}` | GET | — | CB_NV_TW | ✅ render đủ field |
| Tiếp nhận | `POST /api/v1/hoi-daps/{id}/tiep-nhan` (suy đoán) | POST | — | CB_NV_TW | ✅ stamp đầy đủ (Bước 2) |
| Phân công | `POST /api/v1/hoi-daps/{id}/phan-cong` | POST | `nguoi_xu_ly_id` | CB_NV_TW | 🚫 KHÔNG VERIFY ĐƯỢC — UI không expose button |
| PATCH với "đã trả lời" | `PATCH /api/v1/hoi-daps/{id}` | PATCH | `noi_dung_tra_loi`, `da_tra_loi=true`, `version` | TVV/NHT/CB NV được PC | 🚫 KHÔNG VERIFY ĐƯỢC |
| Phê duyệt | `POST /api/v1/hoi-daps/{id}/phe-duyet` | POST | — | CB_PD_TW | 🚫 KHÔNG VERIFY ĐƯỢC |
| Từ chối | `POST /api/v1/hoi-daps/{id}/tu-choi` | POST | `ly_do` (≥10 ký tự) | CB_PD_TW | 🚫 KHÔNG VERIFY ĐƯỢC |
| Công khai | `POST /api/v1/hoi-daps/{id}/cong-khai` | POST | — | CB_NV_TW | 🚫 KHÔNG VERIFY ĐƯỢC |
| Đóng hồ sơ | `POST /api/v1/hoi-daps/{id}/dong-ho-so` | POST | — | CB_NV_TW | 🚫 KHÔNG VERIFY ĐƯỢC |

**Note:** Không capture network log do app re-direct về `/login` ngay sau Bước 2 (JWT revoke aggressive — memory `qa_htpldn_jwt_revoke_aggressive`). Test workflow phải re-login giữa Bước 2-3 → khi quay lại detail thì không thấy button [Phân công] dù đã có session mới.

---

## 6. Troubleshooting đã gặp

| Triệu chứng | Tra Phụ lục 3? | Fix áp dụng | Escalate? |
|-------------|:--------------:|-------------|:---------:|
| Sau ~1-2 phút session, click element trên list bị kick về `/login` | N/A (bug env) | Re-login (memory `qa_htpldn_jwt_revoke_aggressive`) | ✅ BE escalate session timeout config |
| Sau Bước 2 Tiếp nhận, không có button kế tiếp | ☐ Không match | Quét DOM toàn cục bằng evaluate_script — 0 button match action keywords | ✅ Dev FE escalate (BUG-FLOW-HOIDAP-001) |

---

## 7. Cascade impact (sau test FAIL)

| Downstream task | Trước | Sau |
|-----------------|-------|-----|
| T4.1 Functional Hỏi đáp (36 TC) | ⏳ pending | 🚫 **PARTIAL BLOCK** — TC happy path + reject branch + auto-state cần state ≥ `ĐANG XỬ LÝ` đều block; chỉ chạy được TC list/search/filter/seed-CRUD |
| T2.A5d ĐKT (đề kiểm tra Đào tạo) | ⚠️ partial | 🚫 không liên quan trực tiếp — giữ nguyên |
| T5.4 Cross-module HD↔Phê duyệt | ⏳ pending | 🚫 BLOCKED |
| T5.4 Cross-module HD→KHOCH auto (Q&A push từ HOÀN THÀNH) | ⏳ pending | 🚫 BLOCKED — yêu cầu state HOÀN THÀNH/CÔNG KHAI |

---

## 8. Tab counts cuối session (verify list /hoi-dap)

| Tab | Count | Sample IDs |
|-----|:-----:|------------|
| Tất cả | 7 | HD-001..007 |
| Mới | 4 | HD-003, HD-004, HD-005, HD-006 |
| Đang xử lý (= TIẾP NHẬN logic-wise theo step 3) | 0 | — |
| Tiếp nhận (label trong list) | 3 | HD-001 (Congnt 24/04 15:51), HD-002 (cb_nv_tw_01 25/04 19:21), HD-007 (cb_nv_bn_01 24/04 20:33) |
| Chờ phê duyệt | 0 | — |
| Đã duyệt | 0 | — |
| Công khai | 0 | — |
| Hoàn thành | 0 | — |

> **Note label inconsistency:** UI list dùng label `Tiếp nhận` cho state sau Bước 2; tab UI có cả `Mới` + `Đang xử lý` + `Chờ phê duyệt` + `Đã duyệt` + `Công khai` + `Hoàn thành` — không có tab `Tiếp nhận` riêng. State `TIẾP NHẬN` được nhóm vào tab `Đang xử lý` hay tab nào? Hiện không record nào ở `Đang xử lý` mặc dù 3 record đang ở `Tiếp nhận`. Có thể tab `Đang xử lý` chỉ chứa state `ĐANG XỬ LÝ` chính xác (Bước 3+). Quan sát ngoài SRS — log obs.

---

## 9. Bugs & Findings

Xem [`bug-report-flow-hoidap.md`](../bug-reports/bug-report-flow-hoidap.md) — 1 bug có SRS reference:

- **BUG-FLOW-HOIDAP-001** Critical — UI thiếu button `[Phân công]` ở state `TIẾP NHẬN` → block toàn bộ Bước 3-6 + reject + auto-state branch (regression worse than R1 BUG-HDFLOW-001).

Observation ngoài SRS (không log bug):

- **OBS-01** SLA stamp Bước 2 hiển thị "Còn 12 ngày LV" + thời hạn `12/05/2026 19:21` (tính từ 25/04). SRS HOI_DAP nguyên gốc có spec `T+1 ngày LV` ở R1 memory; UI thực render T+12 LV. Cần BA confirm BR-CALC chính thức cho HOI_DAP (T+1 vs T+10 vs T+12).
- **OBS-02** Tab `Đang xử lý` empty mặc dù 3 record state `Tiếp nhận`. Tab UI không có entry riêng cho state `TIẾP NHẬN`. Có thể FE filter mapping sai; cần BA confirm tab labeling intent.
- **OBS-03** JWT revoke aggressive: sau ~1-2 phút session, click element bất kỳ → kick `/login` (regression cross-module memory `qa_htpldn_jwt_revoke_aggressive`). Không phải bug Hỏi đáp riêng — gặp lại lần thứ 2 trong R4.

---

## Tham chiếu

- [`test-strategy.md §7.0b Workflow Test Protocol`](../../../test-strategy.md)
- [`flow-module.md §6 SM-HOIDAP`](../../../../input/flow-module.md)
- [`seed-checklist-HOIDAP.md`](../seed/seed-checklist-HOIDAP.md)
- [`bug-report-template.md`](../../../template/bug-report-template.md)
- Memory `qa_htpldn_hoidap_flow_round1` — R1 BUG-HDFLOW-001 (modal empty), R4 này regression worse (button missing)

---

*Workflow test complete: 2026-04-25 19:23 | QA AI via Claude Code + Chrome DevTools MCP*
