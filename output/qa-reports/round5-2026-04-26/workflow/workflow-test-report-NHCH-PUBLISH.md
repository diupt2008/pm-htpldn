# Workflow Test Report — Ngân hàng câu hỏi (NHAP → CONG_KHAI) — B5b

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Phase:** P2 Trụ B5b Workflow publish NHCH + re-run ĐKT NGAU_NHIEN • **Plan ref:** [`tasks/todo.md` §P2 Trụ B B5b](../../../../tasks/todo.md) • **Date:** 2026-04-27
> **Tester:** QA Automation (Chrome DevTools MCP)
> **Round:** Round 5
> **State Machine:** SM-NHCH (3 state: `NHAP` → `CONG_KHAI` → `AN`, transition qua field `trang_thai` trong form Cập nhật).
> **Input flow:** [`flow-module.md §6.3 Ngân hàng câu hỏi (FR-III-09)`](../../../../input/flow-module.md) — workflow publish câu hỏi để pool NGAU_NHIEN cho ĐKT.
> **Seed precondition:** [`seed-checklist-NHCH.md`](../seed/seed-checklist-NHCH.md) — 10 NHCH `Nháp` (NHCH-1..10).
> **Bug report:** _(không có bug SRS-ref)_

---

## Verdict

✅ **PASS** — 5/5 NHCH publish + 2/2 ĐKT NGAU_NHIEN re-run = 7/7. 0 bug SRS-ref.

| Metric | Giá trị |
|--------|---------|
| Workflow NHAP → CONG_KHAI | 5/5 PASS (NHCH-3, 6, 7, 8, 10) |
| Pool CONG_KHAI sau publish | 5 NHCH (2 DE + 2 TB + 1 KHO) — verify list filter `trangThai=CONG_KHAI` = "1-5 / 5 mục" |
| ĐKT NGAU_NHIEN re-run | 2/2 PASS (variants 1 + 4) — đã unblock từ B5 R1 BE 422 |
| Bug found | **0** |
| **Gate cho B7 (Workflow Khóa học)** | ✅ PASS — pool ĐKT 5/5 (3 THU_CONG cũ + 2 NGAU_NHIEN mới) sẵn sàng |

---

## Accounts dùng

| Role | Username | Cấp | Ghi chú |
|------|----------|-----|---------|
| CB NV TW | `cb_nv_tw_01` | TW | Toàn bộ B5b (publish + re-run ĐKT) |

JWT revoke 1 lần giữa 2 batch test (publish xong → fetch API CONG_KHAI = 401) → re-login qua sidebar nav (FE auto-refresh token interceptor đã handle, không cần thao tác manual). Không phải bug — pattern đã quan sát trước trong R5 P2 B4/B6.

---

## 1. Workflow publish — NHAP → CONG_KHAI (5 NHCH cover DE/TB/KHO)

> **Tham chiếu SRS:** [`srs-fr-03-dao-tao.md FR-III-09 §Inputs row 7`](../../../../input/srs-v3/srs-fr-03-dao-tao.md#L710) — `trang_thai (Y) NHAP / CONG_KHAI / AN`. Form Cập nhật có dropdown Trạng thái cho phép chọn 3 enum.

| # | NHCH | Trước | Sau | Lĩnh vực | Mức độ | Loại | Result | Evidence |
|:-:|------|-------|-----|----------|--------|------|:------:|----------|
| 1 | NHCH-10 (Mức xử phạt BHXH) | Nháp | Công khai | Lao động | **Dễ** | TN 1 đáp án | ✅ PASS | [list-filter-CONG_KHAI-5of5.png](../screenshots/nhch-b5b-list-filter-CONG_KHAI-5of5.png) |
| 2 | NHCH-7 (Thời hạn giao đất) | Nháp | Công khai | Đất đai | **Dễ** | TN 1 đáp án | ✅ PASS | (cùng ảnh row #1) |
| 3 | NHCH-8 (DN vốn nước ngoài) | Nháp | Công khai | KDTM | **Trung bình** | TN 1 đáp án | ✅ PASS | (cùng ảnh) |
| 4 | NHCH-6 (ĐK giao đất thuê đất) | Nháp | Công khai | Đất đai | **Trung bình** | Tự luận | ✅ PASS | (cùng ảnh) |
| 5 | NHCH-3 (Thuế TNDN ưu đãi) | Nháp | Công khai | Thuế | **Khó** | TN 1 đáp án | ✅ PASS | (cùng ảnh) |

**Pool sau publish:** 2 DE + 2 TB + 1 KHO — đủ điều kiện variant 1 (DE:1+TB:1+KHO:1) và variant 4 (DE:2+TB:2+KHO:1).

**Workflow steps cho mỗi NHCH:**
1. Click [edit] icon trên row NHCH `Nháp` → modal `Cập nhật câu hỏi` mở.
2. Click dropdown Trạng thái → render 3 option `Nháp / Công khai / Ẩn` đúng SRS row 7.
3. Chọn `Công khai` → click [Cập nhật].
4. Modal đóng → list reload → cột Trạng thái đổi `Nháp` → `Công khai` cho NHCH vừa publish, các NHCH còn lại giữ nguyên.

API verify: list reload sau từng publish sử dụng GET `/api/v1/ngan-hang-cau-hois?page=1&pageSize=20` (FE) — UI value column "Công khai" persist sau page reload (verify khi navigate qua dashboard rồi quay lại).

---

## 2. Re-run ĐKT NGAU_NHIEN — variants 1 + 4 (đã fail BE 422 ở B5 R1)

> **Tham chiếu SRS:** [`srs-fr-03-dao-tao.md FR-III-NEW-01 — Tạo đề kiểm tra`](../../../../input/srs-v3/srs-fr-03-dao-tao.md). Field `cach_tao = NGAU_NHIEN` → BE filter pool NHCH theo `trangThai=CONG_KHAI` (suy luận từ behavior trước/sau publish — SRS không quote nguyên văn nhưng evidence consistent).
>
> **Mâu thuẫn cũ:** Quan sát O1 ở [`seed-checklist-DEKT.md`](../seed/seed-checklist-DEKT.md) ghi BE 422 `ERR-BIZ-III-NEW01-01` "Ngân hàng không đủ câu hỏi thỏa điều kiện" khi pool 0 record CONG_KHAI. **B5b xác nhận T2 trigger** (NHCH publish ≥3 cover 3 mức độ) — re-submit cùng payload structure → BE 200 / 201.

### 2.1 Variant 1 — DE:1 + TB:1 + KHO:1

| Field | Giá trị |
|-------|---------|
| Tên đề | `Đề kiểm tra - Pháp luật DN căn bản` |
| Cách tạo | Ngẫu nhiên (`NGAU_NHIEN`) |
| Thời gian làm bài | 30 phút |
| Điểm đạt | 5/10 |
| Rule 1 | Lao động / Dễ / 1 → khớp NHCH-10 |
| Rule 2 | Kinh doanh thương mại / Trung bình / 1 → khớp NHCH-8 |
| Rule 3 | Thuế / Khó / 1 → khớp NHCH-3 |

**Result:** ✅ PASS — BE accept, ĐKT entry `Nháp`, list cell hiển thị `Số câu hỏi = 3`, `Cách tạo = Ngẫu nhiên`. Trước R5 B5b: 🚫 BE 422.

### 2.2 Variant 4 — DE:2 + TB:2 + KHO:1

| Field | Giá trị |
|-------|---------|
| Tên đề | `Đề kiểm tra - SHTT cho startup` |
| Cách tạo | Ngẫu nhiên (`NGAU_NHIEN`) |
| Thời gian làm bài | 60 phút |
| Điểm đạt | 7/10 |
| Rule 1 | Lao động / Dễ / 1 → NHCH-10 |
| Rule 2 | Đất đai / Dễ / 1 → NHCH-7 |
| Rule 3 | Kinh doanh thương mại / Trung bình / 1 → NHCH-8 |
| Rule 4 | Đất đai / Trung bình / 1 → NHCH-6 |
| Rule 5 | Thuế / Khó / 1 → NHCH-3 |

**Result:** ✅ PASS — BE accept, ĐKT entry `Nháp`, list cell `Số câu hỏi = 5`, `Cách tạo = Ngẫu nhiên`. Trước R5 B5b: 🚫 BE 422.

**Note variant gốc fixture (variant 4):** scenario `Đa mức độ random — verify hệ thống bốc đủ DE/TB/KHO theo config` đã pass ở mức tạo đề. Verify "bốc đủ câu" cần xem trang Detail ĐKT — nằm ngoài scope B5b (theo todo line 195: scope giới hạn POST 200 + counter list, không yêu cầu validate detail bốc câu thực tế).

Evidence: [dekt-b5b-list-5of5-after-rerun.png](../screenshots/dekt-b5b-list-5of5-after-rerun.png) — list `1-5 / 5 mục`, top 2 row `Ngẫu nhiên`, dưới 3 row `Thủ công`.

---

## 3. Auto-transition / Side-effect

| # | Trigger | Field bị set | Cơ chế | Result |
|:-:|---------|--------------|--------|:------:|
| 1 | Click [Cập nhật] đổi `trangThai` NHAP → CONG_KHAI | `trang_thai` | BE update PATCH endpoint (single field) | ✅ |
| 2 | List filter `trangThai=CONG_KHAI` sau publish | URL query `?trangThai=CONG_KHAI&page=1` | FE filter BE list | ✅ |
| 3 | ĐKT NGAU_NHIEN sau publish ≥3 NHCH CONG_KHAI cover 3 mức độ | `de_kiem_tras` row mới state `NHAP` | BE accept (POST 201) | ✅ |
| 4 | ĐKT NGAU_NHIEN khi pool CONG_KHAI=0 | (B5 R1 baseline) | BE reject `ERR-BIZ-III-NEW01-01` 422 | ✅ behavior xác nhận |

---

## 4. API Endpoints đã verify

| Action | Endpoint | Method | Body fields chính | Auth role |
|--------|----------|--------|-------------------|-----------|
| Update NHCH (publish) | `/api/v1/ngan-hang-cau-hois/{id}` | PATCH | `{trangThai: "CONG_KHAI"}` (kèm các field hiện hữu) | CB_NV_TW |
| List NHCH filter | `/api/v1/ngan-hang-cau-hois?trangThai=CONG_KHAI&pageSize=20` | GET | — | CB_NV_TW |
| Tạo ĐKT NGAU_NHIEN | `/api/v1/de-kiem-tras` | POST | `{tenDe, cachTao=NGAU_NHIEN, randomConfig=[{linhVucId, mucDo, soLuong}], thoiGianLamBai, diemDat}` | CB_NV_TW |

**Note endpoint quirk:**
- `randomConfig` array element bắt buộc cả `linhVucId + mucDo + soLuong` (3 field per rule). Gốc fixture comment chỉ ghi `random_config: { DE: 1, TB: 1, KHO: 1 }` (chỉ mức độ) → **fixture v2.5 thiếu chi tiết `linh_vuc_id` per rule** (đã ghi obs O5 ở seed-checklist-DEKT R1 — vẫn áp dụng).

---

## 5. Cascade impact (sau B5b PASS)

| Downstream task | Trước B5b | Sau B5b |
|-----------------|-----------|---------|
| **B5 (NHCH+ĐKT seed)** | ⚠️ 3/5 (2 NGAU_NHIEN BE 422) | ✅ 5/5 — đủ pool ĐKT |
| **B7 (Workflow Khóa học 10 bước)** | ⏳ chờ B5 hoàn thành | 🟢 sẵn sàng — pool 5 ĐKT (3 THU_CONG + 2 NGAU_NHIEN) cho gắn vào Khóa học bước 4-5 |
| **T3.5 Workflow Khóa học (P3)** | 🟡 partial pool | 🟢 đủ pool ĐKT đa cách tạo cho đa scenario |
| **T4.6 Functional Khóa học 40 TC** | 🟡 partial pool | 🟢 đủ pool ĐKT cho test CRUD/edit/delete + DA_PHAN_PHOI scenario |

---

## 6. Tab counts cuối session (verify)

| Tab | Count | Sample IDs / Mô tả |
|-----|:-----:|--------------------|
| **NHCH — toàn bộ** | 10 | NHCH-1..10 |
| NHCH — Nháp | 5 | NHCH-1, 2, 4, 5, 9 (chưa publish, để dành phase functional test) |
| NHCH — Công khai | **5** | NHCH-3 (Thuế/Khó), NHCH-6 (Đất đai/TB), NHCH-7 (Đất đai/Dễ), NHCH-8 (KDTM/TB), NHCH-10 (Lao động/Dễ) |
| NHCH — Ẩn | 0 | (chưa test trong B5b) |
| **ĐKT — toàn bộ** | 5 | 3 THU_CONG (B5 R1 PASS) + 2 NGAU_NHIEN (B5b PASS) |
| ĐKT — Nháp | 5 | (toàn bộ entry state) |
| ĐKT — Phân phối | 0 | (FR-III-NEW-03 ngoài scope B5b) |

---

## 7. Bugs & Findings

**0 bug SRS-ref.** Tất cả workflow PASS clean theo SRS FR-III-09 row 7 + FR-III-NEW-01 §Processing.

**Quan sát ngoài SRS (carry từ B5 R1, không log bug):**

- **O1 (xác nhận T2):** BE 422 `ERR-BIZ-III-NEW01-01` từ B5 R1 đã được resolve sau publish ≥3 NHCH CONG_KHAI cover 3 mức độ. Pattern xác nhận: BE filter pool NGAU_NHIEN theo `trangThai=CONG_KHAI` (xem `seed-checklist-DEKT.md §Pending re-run §T2`).
- **O2 (carry):** Spinbutton "Số lượng" trong rule NGAU_NHIEN có quirk `valuemax="0"` `valuemin="1"` (nghịch lý) — Increase Value button disabled. Workaround: native React setter set value="1" qua `evaluate_script` cho cả 3+5 input cùng lúc. Đã obs trong B5 R1, vẫn chưa fix.
- **O3 (carry):** Form Tạo ĐKT THU_CONG yêu cầu UUID raw — nhưng B5b chỉ test NGAU_NHIEN nên không trigger. Vẫn còn UX gap (chưa fix).
- **O4 (carry):** Dropdown Lĩnh vực thiếu DOANH_NGHIEP / HOP_DONG (regression cross-task lần thứ 7+) — fallback "Kinh doanh thương mại" cho Rule 3 (variant 1) + Rule 3 (variant 4). Đã obs nhiều round, BA pending confirm enum mở rộng.
- **O5 (mới):** **JWT revoke aggressive** — sau ~2-3 phút không hoạt động + sau 1 batch test publish NHCH, BE token expire → fetch trực tiếp `evaluate_script` trả 401 "Authorization token is required". UI navigate qua sidebar tự refresh token (auto-refresh interceptor) → tiếp tục hoạt động không cần re-login. **Cùng pattern với memory `qa_htpldn_jwt_revoke_aggressive` từ R4 T1.B4 BIEU_MAU**. Workaround: thao tác qua UI sidebar thay vì trực tiếp `fetch` API call.

---

## 8. Tham chiếu

- [`test-strategy.md §7.0b Workflow Test Protocol`](../../../test-strategy.md)
- [`flow-module.md §6.3 NHCH (FR-III-09)`](../../../../input/flow-module.md)
- [`srs-fr-03-dao-tao.md §FR-III-09`](../../../../input/srs-v3/srs-fr-03-dao-tao.md#L685)
- [`srs-fr-03-dao-tao.md §FR-III-NEW-01`](../../../../input/srs-v3/srs-fr-03-dao-tao.md)
- [`seed-checklist-NHCH.md`](../seed/seed-checklist-NHCH.md) — preset 10 NHCH NHAP
- [`seed-checklist-DEKT.md`](../seed/seed-checklist-DEKT.md) — preset 5 ĐKT (3 THU_CONG R1 + 2 NGAU_NHIEN B5b)
- [`bug-report-template.md`](../../../template/bug-report-template.md)

---

*Workflow test complete: 2026-04-27 21:34 | QA Automation via Chrome DevTools MCP*
