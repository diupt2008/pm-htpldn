# Bug Report — SM-HOIDAP Flow Test (Hỏi đáp pháp lý, M4)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 16:22::16:30 (UTC+7) [2026-04-23] |
| **Loại test** | Functional — Workflow transition (SM-HOIDAP 6 bước + reject branch) |
| **Round** | Round 1 — Flow SM-HOIDAP |
| **Tài liệu tham chiếu** | [functional-test-report.md](functional-test-report.md), [srs-fr-02-hoi-dap.md §FR-II-06 UC15](../../../input/srs-v3/srs-fr-02-hoi-dap.md), [flow-module.md §4 SM-HOIDAP](../../../input/flow-module.md) |

---

## Tổng hợp

Phát hiện **1 bug Critical** có SRS reference cụ thể trong quá trình test SM-HOIDAP. Bug BLOCK Bước 3 `TIẾP NHẬN → ĐANG XỬ LÝ` và cascade 4 bước tiếp theo (Bước 4, 5, 6 + nhánh Từ chối) — toàn bộ workflow không thể advance.

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể. Quan sát ngoài SRS → ghi ở §Observations. Xem memory `feedback_bug_must_have_srs_ref`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 1        | 0     | 0      | 0     | 0       |

### Test result breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Workflow** | State transition SM-HOIDAP Bước 2→6 + reject | 8 | 2 | 0 | 0 | 6 | **25%** |
| **Total** | | **8** | **2** | **0** | **0** | **6** | **25%** |

→ **Workflow Pass Rate = 2/8 (25%)**. 2 PASS là Bước 2 (Tiếp nhận) trên HD-001 + HD-002. 6 BLOCKED cascade từ Bước 3 blocker.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|-------------------|-------|--------|
| BUG-HDFLOW-001 | Critical | P0 | Workflow | Hỏi đáp | WF-HD-003, WF-HD-007 | `FR-II-06 §Inputs row 1 (nguoi_xu_ly_id required)` + `§Outputs row 4 (goi_y_list)` + `§Acceptance Criteria 2` + `UC15` | Modal Phân công "Gợi ý phân công" rỗng + không có picker manual → nút [Phân công] disabled, không thể advance `TIẾP NHẬN → ĐANG XỬ LÝ` | Open |

---

## BUG-HDFLOW-001 — Modal Phân công không có cách chọn người xử lý — BLOCK Bước 3 SM-HOIDAP

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-HDFLOW-001 |
| **Severity** | Critical |
| **Priority** | P0 |
| **Type** | Workflow |
| **Status** | Open |
| **Module** | Hỏi đáp pháp lý |
| **Thành phần** | `SCR-II-03` Modal "Phân công xử lý" + BE endpoint `GET /api/v1/hoi-daps/{id}/goi-y-phan-cong` |
| **URL** | http://103.172.236.130:3000/hoi-dap/{uuid} (sau click [Phân công]) |
| **Trình duyệt** | Chromium (MCP DevTools, headless=false) |
| **Tài khoản** | `canbo_tw_5` (CB_NV, cấp TW, Cục Bổ trợ tư pháp) |
| **TC Reference** | WF-HD-003 (HD-001, Lao động), WF-HD-007 (HD-002, Thuế) |
| **SRS Reference** | **BẮT BUỘC:** `FR-II-06 §Inputs row 1: nguoi_xu_ly_id (identifier, Y, required)` — không có UI để cung cấp giá trị này. `§Outputs row 4: goi_y_list [{id, ho_ten, linh_vuc, workload}]` — BE trả empty list (2 record test đều 0 gợi ý). `§Acceptance Criteria 2: "Given CB NV xem gợi ý, When chọn 1 TVV → Then phân công thành công"` — không thỏa. `flow-module.md §SM-HOIDAP Bước 3: "chọn Account TVV/NHT hoặc CB NV khác"` — UI không cung cấp cơ chế chọn CB NV khác làm fallback khi TVV rỗng. |
| **Assignee** | Backend Team (seed TVV/eligible-user data) + FE Team (thêm manual picker/search) |
| **Found by** | QA Automation via Claude Code |

### Mô tả

Sau khi CB NV nhấn **[Tiếp nhận]** (Bước 2 PASS), chi tiết hỏi đáp xuất hiện nút **[Phân công]**. Click vào nút mở modal "Phân công xử lý". Modal hiển thị bảng "Gợi ý phân công" với 4 cột (Họ tên, Email, Workload, Ưu tiên) nhưng **không có row nào** — chỉ hiển thị placeholder "Trống". Modal **không có input/search field** để chọn người xử lý manual. Nút **[Phân công]** ở footer bị **disabled**. → Không thể advance state `TIẾP NHẬN → ĐANG XỬ LÝ` → block Bước 3 của SM-HOIDAP.

### Các bước tái hiện

1. Login `canbo_tw_5` / `Test@1234` (OTP bypass `666666`)
2. Sidebar → "Quản lý hỏi đáp pháp lý" → List page render 29 mục
3. Click row `HD-20260423-001` (Lao động, state MỚI) → Detail page `/hoi-dap/a7aa1b1e-1dd0-47d8-80a2-f28cced5bbd7`
4. Click nút **[Tiếp nhận]** → popup "Xác nhận tiếp nhận" → click "Tiếp nhận" → **Bước 2 PASS** (state `TIẾP NHẬN`, nút chính đổi thành **[Phân công]**)
5. Click nút **[Phân công]**
6. **Quan sát:** Modal "Phân công xử lý — #HD-20260423-001" mở, bảng "Gợi ý phân công" hiển thị header 4 cột + placeholder "Trống" (empty state). Không có textbox/combobox để search/select người xử lý. Nút **[Phân công]** ở footer `disabled`.
7. Lặp lại Bước 3-6 với `HD-20260423-002` (Thuế, state MỚI) → **cùng hiện tượng** → confirmed reproducible cross-lĩnh vực.

### Kết quả mong đợi

Theo `FR-II-06 §Processing` + `flow-module.md §SM-HOIDAP Bước 3`:
- **Phải** render danh sách gợi ý TVV/CG theo lĩnh vực (ít nhất TVV active cùng lĩnh vực PL) — hoặc
- Nếu không có gợi ý match, **phải** cung cấp combobox/search manual để chọn:
  - TVV/CG bất kỳ cùng đơn vị
  - Hoặc CB NV khác cùng cấp (per flow-module.md "TVV/NHT **hoặc CB NV khác**")
- Khi chọn 1 người → nút **[Phân công]** enabled → submit → state chuyển `TIẾP NHẬN → ĐANG XỬ LÝ`

### Kết quả thực tế

- Bảng "Gợi ý phân công" rỗng hoàn toàn (`goi-y-phan-cong` BE trả 200 nhưng payload empty)
- Modal không có fallback picker manual
- Nút **[Phân công]** disabled vĩnh viễn
- Flow dừng ở `TIẾP NHẬN`, không cách nào advance

### Bằng chứng

**API response (network tab capture):**
```
GET /api/v1/hoi-daps/a7aa1b1e-1dd0-47d8-80a2-f28cced5bbd7/goi-y-phan-cong → 200
(response body chứa list rỗng hoặc shape bị BE filter toàn bộ ra)
```

**Ảnh chụp:**
- [BUG-step3-phancong-empty-suggestions.png](image/BUG-step3-phancong-empty-suggestions.png) — HD-001 (Lao động)
- [BUG-hd002-phancong-empty-reproduce.png](image/BUG-hd002-phancong-empty-reproduce.png) — HD-002 (Thuế) — reproduce confirm

### Tác động (Impact)

**CRITICAL blocker:**
- **100% module Hỏi đáp không thể vận hành workflow.** CB NV có thể tạo hỏi đáp + tiếp nhận, nhưng **không thể phân công** → không thể soạn trả lời → không thể phê duyệt → không thể công khai lên Cổng PLQG.
- Cascade: Block 4 bước tiếp theo (Bước 3, 4, 5, 6) + nhánh Từ chối (depend on Bước 5) → **6/8 workflow TC bị BLOCKED** (75%).
- Liên đới FR-I-01 (Dashboard KPI "Hỏi đáp mới") — count không giảm vì không record nào thoát state MỚI/TIẾP NHẬN.
- Liên đới FR-IX-01 (BC Hỏi đáp) — báo cáo sẽ sai zero trường "đã xử lý/đã duyệt".
- Liên đới Module X2 Kho Q&A — nguồn `TU_DONG` auto đẩy từ HOIDAP khi state = `DA_DUYET` → Kho Q&A không có bản ghi mới nào từ HOIDAP.

### So sánh (Comparison) — DN mở từ Cổng PLQG vs CB NV nhập

| Flow | Bước 1 (tạo) | Bước 2 (Tiếp nhận) | **Bước 3 (Phân công)** | Bước 4-6 |
|------|-------------|-------------------|----------------------|---------|
| CB NV nhập thủ công (Round 0 seed + Round 1 flow) | ✅ 6/6 (100%) | ✅ 2/2 tested | ❌ 0/2 BLOCKED | ⏸ BLOCKED cascade |
| DN gửi từ Cổng PLQG → sync | N/A (chưa test được — sync offline) | — | — | — |

### Nguyên nhân nghi ngờ (Root Cause)

**2 khả năng (cần dev xác nhận):**

1. **Data gap — TU_VAN_VIEN table chưa có record ACTIVE** (đã có tín hiệu từ memory `qa_htpldn_tvv_cr_round1`: "0/6 PASS — BE ProForm DatePicker gửi Invalid Date" → TVV CREATE Round 1 fail 100%, nên bảng TU_VAN_VIEN rỗng hoặc chỉ có record INACTIVE).
2. **BE filter sai** — endpoint `/goi-y-phan-cong` chỉ query TU_VAN_VIEN + filter theo `linh_vuc_id` + `trang_thai=ACTIVE`, không fallback sang NGUOI_DUNG có role CB_NV cùng cấp (per flow-module Bước 3 cho phép "CB NV khác").
3. **UI missing manual picker** — dù BE có `/goi-y-phan-cong` empty, FE phải render một search/combobox independent để query `GET /api/v1/nguoi-dung/search?role=CB_NV|TVV&don_vi=...` rồi gửi `nguoi_xu_ly_id` vào body POST `/api/v1/hoi-daps/{id}/phan-cong`.

### Gợi ý sửa (Suggested Fix)

**Short-term (tháo blocker trong sprint hiện tại):**

Option A — **Seed data:**
```
Fix BUG-TVV-CR-001 (ProForm DatePicker) ở module TVV → seed 3-6 TVV ACTIVE với linh_vuc thuộc enum hiện có (Lao động, Thuế, Đất đai, KDTM, SHTT). Verify `GET /goi-y-phan-cong` với HD lĩnh vực tương ứng → trả ít nhất 1 TVV.
```

Option B — **BE fallback:**
```sql
-- Mở rộng /goi-y-phan-cong để fallback về CB_NV cùng cấp nếu TU_VAN_VIEN rỗng
SELECT u.id, u.ho_ten, u.email, COUNT(hd.id) AS workload
FROM nguoi_dung u
LEFT JOIN hoi_dap hd ON hd.nguoi_xu_ly_id = u.id AND hd.trang_thai = 'DANG_XU_LY'
WHERE u.role IN ('TVV', 'CG', 'CB_NV')
  AND u.don_vi_id = :current_don_vi
  AND u.trang_thai = 'ACTIVE'
GROUP BY u.id
ORDER BY workload ASC
LIMIT 20;
```

Option C — **FE manual picker (khuyến nghị, permanent):**

Thêm combobox search ở modal khi `goi_y_list` empty:
```tsx
{goiYList.length === 0 ? (
  <Alert message="Không có gợi ý tự động. Chọn người xử lý thủ công:" type="warning" />
) : null}
<Form.Item name="nguoi_xu_ly_id" label="Người xử lý" required>
  <Select
    showSearch
    placeholder="Tìm theo họ tên hoặc email"
    filterOption={false}
    onSearch={(q) => fetchNguoiDung(q, currentDonVi)}
    options={fetchedUsers}
  />
</Form.Item>
```

**Long-term:** Cấu hình ánh xạ `LINH_VUC_PL → TVV/CG` mặc định (FR-II-NEW-01 Cấu hình phân công) để auto-route ngay khi tạo HD + skip bước phân công thủ công cho các lĩnh vực đã cấu hình.

### Lịch sử

Bug đã được phát hiện ở round UI Hỏi đáp trước (memory `qa_htpldn_hoidap_ui_round1` 2026-04-22: "Modal Phân công thiếu dropdown Người xử lý (blocker)"). **Round 1 flow test hôm nay (2026-04-23) xác nhận bug CHƯA ĐƯỢC FIX.** Tăng severity từ Critical UI gap → Critical workflow blocker do giờ có seed data nhưng workflow vẫn không chạy.

---

## Observations — ngoài SRS (không log bug)

| # | Observation | Chi tiết / Evidence | SRS có nói không? | Đề xuất |
|---|-------------|---------------------|-------------------|---------|
| **1** | Enum leak `TIEP_NHAN` thay vì label "Tiếp nhận" | Modal Phân công trường "Trạng thái: TIEP_NHAN" — render raw enum code, không i18n về label người dùng. HD-001 + HD-002 đều bị. | FR-II-06 §Outputs row `trang_thai` chỉ nói `text` — không có clause "phải i18n label". | FE i18n helper: `translateStatus(TIEP_NHAN) → "Tiếp nhận"`. |
| **2** | SLA re-calculated khi Tiếp nhận | HD-001 SLA từ `24/04/2026 15:48` (khi tạo) → `24/04/2026 16:24` (sau Tiếp nhận, +36 phút = đúng thời điểm click). Tương tự HD-002. | FR-II-03 §Processing Bước 4: "Tính deadline SLA (nếu chưa tính): ngày tiếp nhận + N ngày LV" + BR-CALC-03, BR-SLA-01. **Behavior is COMPLIANT** — SRS cho phép tính lại khi TIẾP NHẬN. Không phải bug. | Note vào báo cáo QA để BA/dev biết SLA có thể shift ±1 ngày tùy thời điểm Tiếp nhận. |
| **3** | Data contamination `Thuế (updated)` leak tiếp tục | Modal Phân công show "Lĩnh vực PL: Thuế (updated)". Đã log ở round DMDC/VUVIEC trước. | Không phải bug HOIDAP module — là data-master. | Không re-log. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` (bypass dev bật) |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design ProComponents |
| Backend | NestJS + PostgreSQL (giả định) |
| Xác thực | JWT HttpOnly cookie + OTP email |
| Tool QA | Chrome DevTools MCP (primary 2026-04-21) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho TC |
|---------------|---------|-----|-------------|
| `canbo_tw_5` | CB_NV (Cán bộ TW) | TW (Cục Bổ trợ tư pháp) | WF-HD-001 → 008 |
| ~~`tvv_user_5`~~ | TVV (Portal) | Portal | **KHÔNG dùng được** — chưa bind vào TU_VAN_VIEN ACTIVE (xem memory `qa_htpldn_tvv_cr_round1`) → cascade BLOCK Bước 3 |
| ~~`lanhdao_tw_5`~~ | CB_PD (Lãnh đạo TW) | TW | Planned cho Bước 5 — BLOCKED không reach được |

### C — Danh mục ảnh chụp

| File | Mô tả | Bug Ref |
|------|-------|---------|
| [step2-hd001-tiepnhan.png](image/step2-hd001-tiepnhan.png) | HD-001 sau Bước 2 thành công — state=Tiếp nhận, SLA re-calc | WF-HD-001 PASS |
| [BUG-step3-phancong-empty-suggestions.png](image/BUG-step3-phancong-empty-suggestions.png) | Modal HD-001 Phân công — Gợi ý empty, nút disabled | BUG-HDFLOW-001 |
| [BUG-hd002-phancong-empty-reproduce.png](image/BUG-hd002-phancong-empty-reproduce.png) | Modal HD-002 Phân công — reproduce blocker cross-lĩnh vực | BUG-HDFLOW-001 |

---

*Bug report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP, Opus 4.7 1M)*
