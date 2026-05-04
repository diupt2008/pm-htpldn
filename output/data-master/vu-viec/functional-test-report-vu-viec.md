# Functional Test Report — Vụ việc Hỗ trợ Pháp lý (SM-VUVIEC / Module 3)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Vụ việc HTPL (Module 3 — SM-VUVIEC) |
| **SRS Reference** | `input/flow-module.md §3 FLOW SM-VUVIEC`; SCR `SCR-V.I-02`; Dashboard `FR-I-02..04` |
| **UC Coverage** | Bước 1 Thủ công (CB NV nhập hộ DN), Bước 2 Kiểm tra Hồ sơ, Bước 3 Phân công NHT |
| **Người test** | QA Automation via Claude Code (Opus 4.7) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based (Chrome DevTools MCP) |
| **Primary Account** | `canbo_tw_5` / `Test@1234` — CB_NV cấp TW |
| **Round** | Round 1 |
| **Tài liệu tham chiếu** | [bug-report-vu-viec.md](bug-report-vu-viec.md) |
| **Fixture** | [input/data/seed-fixture.yaml](../../../input/data/seed-fixture.yaml) §`vu_viec_variants` (6 records) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 12 (6 CREATE + 6 state-target verify) |
| **TC đã test / Tổng TC** | 12/12 (100%) |
| **Passed** | 6 (CREATE#1..6 thành công, có ID + state khởi tạo) |
| **Failed** | 1 (VV#2 state sai spec — skip ĐANG KIỂM TRA) |
| **Blocked** | 5 (VV#2..#6 không đạt state_target fixture do thiếu TVV ĐANG HOẠT ĐỘNG cấp TW + flow yêu cầu TVV/CB PD switch account) |
| **Partial** | 0 |
| **Overall Pass Rate** | 50% (6/12) |
| **P0 Pass Rate** | 50% (6/12 P0) |
| **Bugs Found (SRS-ref)** | 5 (1 Critical, 2 Major, 1 Medium, 1 Minor) |
| **Observations (out-of-SRS)** | 4 |
| **Health Score** | 62/100 |
| **Start Time** | 13:58 (UTC+7) |
| **End Time** | 14:12 (UTC+7) |
| **Total Duration** | ~14 phút (budget: 45 phút) |
| **Browse Status** | OK (Chrome DevTools MCP, 0 crash, 0 console error) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy (CREATE)** | Tạo mới bản ghi VV thủ công từ SCR-V.I-02 | 6 | 6 | 0 | 0 | 0 | **100%** |
| **Workflow** | State transition theo SM-VUVIEC (bypass → ĐÃ TIẾP NHẬN → ĐANG KIỂM TRA → ĐÃ PHÂN CÔNG → ...) | 6 | 0 | 0 | 1 | 5 | **0%** |
| **Total** | | **12** | **6** | **0** | **1** | **5** | **50%** |

→ **Happy-path (CREATE) Pass Rate = 6/6 — 100%.** 6 bản ghi Vụ việc đã seed thành công cho module downstream (M7 HĐ tư vấn liên kết, M9 Đánh giá HQ).

→ **Workflow Pass Rate = 0/6 — 0%.** UI vi phạm SM-VUVIEC Bước 2 (skip state ĐANG KIỂM TRA), 5/6 fixture state_target không đạt vì seed thiếu TVV ĐANG HOẠT ĐỘNG cấp TW + harness QA chạy single-account không switch role TVV / CB PD.

### Verdict: **CONDITIONAL PASS (CREATE) / FAIL (Workflow)**

CREATE đạt 100%, seed 6 VV thành công với mã VV-BTP-TW-20260423-001..006. Workflow chuyển state phát hiện 1 Critical (SM skip) + blocker hệ thống (thiếu seed TVV + harness single-account). Báo dev ưu tiên fix BUG-VV-001 trước phase tích hợp TVV/Chi trả.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| VV-CR-001 | flow-module §3 Bước 1, SCR-V.I-02 | CREATE VV#1 — DN Alpha, Lao động, Trực tiếp | Happy | P0 | **PASS** | — | Mã `VV-BTP-TW-20260423-001`, state "Đã tiếp nhận", deadline auto +10 ngày LV |
| VV-CR-002 | flow-module §3 Bước 1 | CREATE VV#2 — DN Beta, Thuế, Điện thoại | Happy | P0 | **PASS** | — | Mã `-002`, state "Đã tiếp nhận". Lĩnh vực hiển thị `Thuế (updated)` → BUG-VV-004 |
| VV-CR-003 | flow-module §3 Bước 1 | CREATE VV#3 — DN Gamma, KDTM, Trực tiếp | Happy | P0 | **PASS** | — | Mã `-003`, state "Đã tiếp nhận". Fixture yêu cầu lĩnh vực "Hợp đồng" nhưng dropdown thiếu → map "Kinh doanh thương mại" (BUG-VV-003) |
| VV-CR-004 | flow-module §3 Bước 1 | CREATE VV#4 — DN Delta, HĐ, Điện thoại | Happy | P0 | **PASS** | — | Mã `-004`, state "Đã tiếp nhận". Lĩnh vực fallback "Kinh doanh thương mại" |
| VV-CR-005 | flow-module §3 Bước 1 | CREATE VV#5 — DN Epsilon, Thuế, Trực tiếp | Happy | P0 | **PASS** | — | Mã `-005`, state "Đã tiếp nhận" |
| VV-CR-006 | flow-module §3 Bước 1 | CREATE VV#6 — DN Zeta, Lao động, Trực tiếp | Happy | P0 | **PASS** | — | Mã `-006`, state "Đã tiếp nhận" |
| VV-SM-002 | flow-module §3 Bước 2 | VV#2 → state ĐANG KIỂM TRA (click [Kiểm tra]) | Workflow | P0 | **FAIL** | BUG-VV-001 | UI skip state `ĐANG KIỂM TRA`, jump thẳng `ĐÃ TIẾP NHẬN → ĐÃ PHÂN CÔNG` sau 1 click Xác nhận trong modal "Kiểm tra hồ sơ" |
| VV-SM-003 | flow-module §3 Bước 3 | VV#3 → state ĐÃ PHÂN CÔNG + phân TVV | Workflow | P0 | **BLOCKED** | BUG-VV-002 | State `ĐÃ PHÂN CÔNG` đạt nhưng dropdown "Chọn tư vấn viên" rỗng ("Trống") — không có TVV `ĐANG HOẠT ĐỘNG` cấp TW cho Kinh doanh TM |
| VV-SM-004 | flow-module §3 Bước 4 | VV#4 → state ĐANG XỬ LÝ (TVV [Chấp nhận]) | Workflow | P0 | **BLOCKED** | — | Thuộc Bước 4 cần login account TVV thực. Thiếu seed TVV + chưa có test account cho role TVV với password Test@1234 |
| VV-SM-005 | flow-module §3 Bước 5-6 | VV#5 → state CHỜ PHÊ DUYỆT (TVV upload + CB NV trình PD) | Workflow | P0 | **BLOCKED** | — | Cần full flow TVV → CB NV → BLOCKED tại Bước 4 |
| VV-SM-006 | flow-module §3 Bước 7-8 | VV#6 → state HOÀN THÀNH (CB PD phê duyệt + CB NV cập nhật KQ cuối) | Workflow | P0 | **BLOCKED** | — | Full flow chưa thể chạy; cần `lanhdao_tw_5` + TVV |
| VV-DATA-01 | flow-module §3 Bước 1 verify | Verify 6 VV mới xuất hiện đầu list, tổng count 100→106 | Validation | P1 | **PASS** | — | Pagination `1-20 / 106 mục` sau seed (100 baseline + 6 mới) |

---

## 3. Bug Report (summary — chi tiết xem [bug-report-vu-viec.md](bug-report-vu-viec.md))

### BUG-VV-001 — Critical — UI skip state `ĐANG KIỂM TRA`, vi phạm SM-VUVIEC Bước 2

Click `[Kiểm tra]` mở modal "Kiểm tra hồ sơ" với 6 hạng mục checklist dạng **text-only** (không có checkbox để tick individual hạng mục như flow-module yêu cầu). Click `[Xác nhận]` → state nhảy thẳng `ĐÃ TIẾP NHẬN → ĐÃ PHÂN CÔNG`, hoàn toàn bỏ qua state trung gian `ĐANG KIỂM TRA`.

### BUG-VV-002 — Major — Dropdown `Chọn tư vấn viên` rỗng khi phân công VV Kinh doanh thương mại

Modal `Phân công tư vấn viên` render empty state "Trống" cho cả 3 lĩnh vực đã test (Lao động, Thuế, Kinh doanh TM). Không có TVV nào state `ĐANG HOẠT ĐỘNG` cấp TW. Dashboard báo 2 TVV tổng nhưng không lọt vào danh sách gợi ý. Block full flow SM-VUVIEC từ Bước 3 trở đi.

### BUG-VV-003 — Major — Dropdown `Lĩnh vực pháp luật` thiếu `Hợp đồng` + `Doanh nghiệp`

Fixture tier_0_prerequisite.danh_muc_required.linh_vuc_phap_ly liệt 6 code bắt buộc, nhưng dropdown form CREATE chỉ expose 10 option và **thiếu 2 code tier_0 required**: `HOP_DONG` (Hợp đồng) và `DOANH_NGHIEP` (Doanh nghiệp). QA buộc phải map "Hợp đồng" → "Kinh doanh thương mại" (không đúng nghiệp vụ).

### BUG-VV-004 — Medium — Label `Thuế (updated)` leak từ DM test vào production

Option `Thuế (updated)` hiển thị nguyên văn với suffix `(updated)` trong dropdown `Lĩnh vực pháp luật`, detail view, và cột list. Suffix này là dấu vết test update DM — không phải label nghiệp vụ. Lộ cho end-user DN/CB NV.

### BUG-VV-005 — Minor — Column `Trạng thái` leak raw DB enum `DA_KET_THUC`

Trong list SCR-V.I-02, 20 bản ghi hiện thị enum DB raw `DA_KET_THUC` thay vì label VI "Đã kết thúc". Chỉ xảy ra ở list view — detail view lại hiển thị đúng tiếng Việt. Inconsistent i18n mapping.

---

## 4. Detailed Test Results

### 4.1 VV-CR-001: CREATE VV#1 — DN Alpha, Lao động, Trực tiếp

**Pre-conditions:**
- User `canbo_tw_5` đã đăng nhập, role CB_NV cấp TW
- DN-HNI-0010 "Công ty TNHH Kiểm thử Alpha" (MST 0100100101) đã tồn tại trong hệ thống

**Test Data (fixture `vu_viec_variants[1]`):**
```yaml
dn_link: "dn_variants[1]"        # → DN-HNI-0010 / MST 0100100101
linh_vuc: "Lao động"
noi_dung: "Tư vấn soạn thảo hợp đồng lao động mẫu theo TT10/2020/TT-BLĐTBXH"
nguon: "TRỰC TIẾP"
state_target: "ĐÃ TIẾP NHẬN"
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click menu "Quản lý vụ việc hỗ trợ pháp lý" | Load `/vu-viec/danh-sach`, render table + button `[+ Nhập thủ công]` | URL=`/vu-viec/danh-sach`, title "Quản lý Vụ việc HTPL", button `plus Nhập thủ công` hiện | **PASS** |
| 2 | Click `[Nhập thủ công]` | Navigate `/vu-viec/tao-moi`, render form 4 accordion | Form render đủ: Thông tin DN, Nội dung YC, Tài liệu ĐK, Thông tin Tiếp nhận | **PASS** |
| 3 | Click `[Tìm doanh nghiệp]` → nhập `0100100101` → Tìm | Modal tìm DN trả 1 row DN Alpha | DN-HNI-0010 Alpha hiện 1 row | **PASS** |
| 4 | Click row DN → DN lock vào form | Hiển thị card `Công ty TNHH Kiểm thử Alpha / MST 0100100101 / Mã DN-HNI-0010` + nút `[Bỏ chọn]` | Card render đúng | **PASS** |
| 5 | Fill Tiêu đề + Nội dung | Counter nội dung 64/50000 | Counter chuẩn | **PASS** |
| 6 | Chọn Lĩnh vực = "Lao động" + Loại hình = "Tư vấn pháp luật" + Kênh = "Trực tiếp" (default) | 3 combobox lock giá trị | OK | **PASS** |
| 7 | Click `[Lưu]` | POST `/api/v1/vu-viec/...`, state `DA_TIEP_NHAN`, navigate detail `/vu-viec/{uuid}` | URL=`/vu-viec/0ef39c64-...`, mã `VV-BTP-TW-20260423-001`, title state "Đã tiếp nhận" ✅ | **PASS** |

**Notes:**
- Deadline auto-calc = 10 ngày làm việc kể từ 23/04/2026 → 07/05/2026
- Người tiếp nhận = "Cán bộ TW 5" (disabled, auto-bind từ user đăng nhập) → đúng spec
- Trường `Ưu tiên` default "Trung bình" (không có trong form CREATE — auto-assign)
- 5 tab detail: Thông tin / Hồ sơ / Phân công / HĐ tư vấn liên kết / Lịch sử

---

### 4.2 VV-CR-002..006: CREATE VV#2..#6

Tất cả 5 TC chạy tương tự VV-CR-001, tổng duration mỗi TC ~60-90 giây (bao gồm modal tìm DN + 3 dropdown). Tất cả **PASS** với state `Đã tiếp nhận`.

**Tóm tắt lại bảng mã VV seed:**

| # | Mã VV | UUID (ngắn) | DN | Lĩnh vực | Kênh | State sau CREATE | State target fixture | Match? |
|---|-------|-------------|-----|----------|------|-------------------|------------------------|--------|
| 1 | VV-BTP-TW-20260423-001 | 0ef39c64-... | Alpha (0100100101) | Lao động | Trực tiếp | Đã tiếp nhận | ĐÃ TIẾP NHẬN | ✅ |
| 2 | VV-BTP-TW-20260423-002 | 55a27fed-... | Beta (0100100102) | Thuế (updated) | Điện thoại | Đã phân công (post Kiểm tra) | ĐANG KIỂM TRA | ❌ BUG-VV-001 |
| 3 | VV-BTP-TW-20260423-003 | eeaec798-... | Gamma (0200200203) | Kinh doanh TM | Trực tiếp | Đã phân công (post Kiểm tra) | ĐÃ PHÂN CÔNG | ⚠️ state OK, TVV BLOCKED |
| 4 | VV-BTP-TW-20260423-004 | a2d3e127-... | Delta (0200200204) | Kinh doanh TM | Điện thoại | Đã tiếp nhận | ĐANG XỬ LÝ | ⚠️ BLOCKED (TVV switch) |
| 5 | VV-BTP-TW-20260423-005 | 6f7ffb4e-... | Epsilon (0300300305) | Thuế (updated) | Trực tiếp | Đã tiếp nhận | CHỜ PHÊ DUYỆT | ⚠️ BLOCKED (TVV+CB NV) |
| 6 | VV-BTP-TW-20260423-006 | 4fdca5a6-... | Zeta (0300300306) | Lao động | Trực tiếp | Đã tiếp nhận | HOÀN THÀNH | ⚠️ BLOCKED (full flow 3 role) |

---

### 4.3 VV-SM-002: Workflow VV#2 → ĐANG KIỂM TRA — FAIL

**Pre-conditions:** VV#2 state = `Đã tiếp nhận`, button `[Kiểm tra]` khả dụng

**Test Steps:**

| Step | Action | Expected (theo flow-module §3 Bước 2-3) | Actual | Status |
|------|--------|-------------------------------------------|--------|--------|
| 1 | Click `[Kiểm tra]` (nút `verified Kiểm tra`) | State `ĐÃ TIẾP NHẬN → ĐANG KIỂM TRA`, mở checklist 6 hạng mục có **checkbox tick ĐẠT** từng hạng | Modal "Kiểm tra hồ sơ" mở, hiện 6 hạng mục text-only (KHÔNG có checkbox tick) + 2 nút `[Hủy]` / `[Xác nhận]` | **FAIL** |
| 2 | Mong đợi: Tick n/6 hạng mục → click `[Hoàn tất Kiểm tra]` → state `ĐÃ PHÂN CÔNG` | 2 step tách biệt | UI gộp thành 1 step confirm "Xác nhận hồ sơ đã kiểm tra ĐẠT", click Xác nhận = skip thẳng | **FAIL** |
| 3 | Click `[Xác nhận]` | State về `ĐANG KIỂM TRA` chờ tick (hoặc `ĐÃ PHÂN CÔNG` nếu gộp) | State title "Đã phân công", button next = `[Phân công]` (không có nút `[Phân công NHT]` riêng) | — |

**Impact:** Fixture `vu_viec_variants[2]` với `state_target: "ĐANG KIỂM TRA"` + `checklist_da_tick: 3` **không thể seed** được. Mọi TC regression/workflow test state trung gian `ĐANG KIỂM TRA` đều BLOCKED.

**Notes:**
- Flow-module §3 Bước 2 rõ: "nhấn **[Kiểm tra Hồ sơ]**. Giao diện mở phần checklist 6 hạng mục hồ sơ" → state = `ĐANG KIỂM TRA`
- Flow-module §3 Bước 3 rõ: "Tích chọn ĐẠT cho các hạng mục. Nhấn **[Hoàn tất Kiểm tra]**. Sau đó nhấn **[Phân công NHT]**" → 2 action tách biệt
- UI hiện tại bỏ luôn state `ĐANG KIỂM TRA` khỏi SM → không test được nhánh `Yêu cầu bổ sung` từ state này (nếu có)

---

### 4.4 VV-SM-003: VV#3 Phân công TVV — BLOCKED

**Pre-conditions:** VV#3 state = `Đã phân công` (sau khi click Kiểm tra), button `[Phân công]` khả dụng

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click button `[team Phân công]` | Modal "Phân công tư vấn viên" mở, dropdown "Chọn tư vấn viên" list TVV `ĐANG HOẠT ĐỘNG` cấp TW lọc theo lĩnh vực chuyên môn (KDTM) | Modal mở với combobox required, ghi chú textarea | **PASS (modal)** |
| 2 | Click dropdown "Chọn tư vấn viên" | List ≥1 TVV fit lĩnh vực | Dropdown render `.ant-empty` = "Trống" (0 option) | **FAIL (data)** |
| 3 | Assign TVV → Xác nhận | Update NHT/TVV + state giữ `ĐÃ PHÂN CÔNG` | Không thực hiện được | **BLOCKED** |

**Root cause candidate:** Seed TVV thiếu. Dashboard báo tổng 2 TVV nhưng có thể 2 TVV đó state khác `ĐANG HOẠT ĐỘNG` (vd `TẠM DỪNG`) hoặc scope đơn vị khác. Cần BE confirm.

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| `canbo_tw_5` | CB_NV | Cục BTTP | TW | VV-CR-001 → VV-CR-006, VV-SM-002, VV-SM-003 (đã cover full) |

> **Lưu ý:** Test chỉ dùng 1 account CB NV. Roles TVV / CB PD chưa được switch vào. Các TC SM-004 → SM-006 BLOCKED do giới hạn này.

### 5.2 Data tạo mới trong test (6 bản ghi seed)

| Mã VV | UUID | DN | Lĩnh vực | Kênh | State cuối | Cleanup? |
|-------|------|-----|----------|------|-------------|----------|
| VV-BTP-TW-20260423-001 | 0ef39c64-6a21-458a-b346-3643418b3bd1 | Alpha | Lao động | Trực tiếp | Đã tiếp nhận | Keep (seed) |
| VV-BTP-TW-20260423-002 | 55a27fed-bd7c-46a9-8249-bc001b60dbee | Beta | Thuế (updated) | Điện thoại | Đã phân công | Keep (evidence BUG-VV-001) |
| VV-BTP-TW-20260423-003 | eeaec798-5811-48bd-b92a-43265e8a8e86 | Gamma | Kinh doanh TM | Trực tiếp | Đã phân công | Keep (evidence BUG-VV-002) |
| VV-BTP-TW-20260423-004 | a2d3e127-aa2f-4704-846e-f761bccb6ea4 | Delta | Kinh doanh TM | Điện thoại | Đã tiếp nhận | Keep (seed) |
| VV-BTP-TW-20260423-005 | 6f7ffb4e-fa16-4b18-97fc-0c3d41e49f91 | Epsilon | Thuế (updated) | Trực tiếp | Đã tiếp nhận | Keep (seed) |
| VV-BTP-TW-20260423-006 | 4fdca5a6-ecca-493c-a937-78098c7aaede | Zeta | Lao động | Trực tiếp | Đã tiếp nhận | Keep (seed) |

Mô tả chi tiết: tiêu đề/nội dung/deadline xem section 4.

### 5.3 DN đã link

| Mã DN | MST | Tên | Tỉnh | Dùng cho |
|-------|-----|-----|------|----------|
| DN-HNI-0010 | 0100100101 | Công ty TNHH Kiểm thử Alpha | Hà Nội | VV#1 |
| DN-HNI-0011 | 0100100102 | Công ty Cổ phần Beta | Hà Nội | VV#2 |
| DN-HPG-0002 | 0200200203 | Công ty TNHH Gamma Sản xuất | Hải Phòng | VV#3 |
| DN-HPG-0003 | 0200200204 | Doanh nghiệp Tư nhân Delta | Hải Phòng | VV#4 |
| DN-DNG-0002 | 0300300305 | Công ty Cổ phần Epsilon IT | Đà Nẵng | VV#5 |
| DN-DNG-0003 | 0300300306 | Công ty TNHH Zeta Giáo dục | Đà Nẵng | VV#6 |

Tất cả 6 DN này đã tồn tại trước test round (từ round QLDN FR-V.III-01 Round 1, xem memory `qa_htpldn_qldn_fr01_r1`).

---

## 6. Environment Notes

- **Framework FE:** React + Ant Design + CSS module custom
- **Auth:** JWT + OTP email (bypass `666666` — verify 2026-04-21)
- **Vụ việc module URL pattern:** `/vu-viec/danh-sach`, `/vu-viec/tao-moi`, `/vu-viec/{uuid}`
- **Mã VV format:** `VV-{ĐƠN_VỊ}-{CẤP}-{YYYYMMDD}-{SEQ3}` → `VV-BTP-TW-20260423-001` (BTP = Bộ Tư pháp, TW cấp, seq tự tăng per-day)
- **Tool verify:** Chrome DevTools MCP (primary, không crash suốt session)
- **Known limitations:**
  - Không có TVV seed `ĐANG HOẠT ĐỘNG` cấp TW → BUG-VV-002 block phân công
  - Seed DN tier 1 (6 DN) đầy đủ, seed VV 6 records chỉ đạt được state `Đã tiếp nhận` + `Đã phân công` (state trung gian)

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-VV-001 (Critical):** Khôi phục state `ĐANG KIỂM TRA` theo SM-VUVIEC. Tách modal Kiểm tra thành 2 step: (a) Tick checklist 6 hạng mục → [Lưu nháp] (state = `ĐANG KIỂM TRA`), (b) [Hoàn tất Kiểm tra] → state = `ĐÃ PHÂN CÔNG` sẵn sàng phân TVV. Bổ sung nhánh [Yêu cầu bổ sung] từ state `ĐANG KIỂM TRA` (flow-module §3 Lưu ý quan trọng).
2. **BUG-VV-002 (Major):** Seed tối thiểu 3 TVV `ĐANG HOẠT ĐỘNG` cấp TW cho 3 lĩnh vực test phổ biến (Lao động, Thuế, Kinh doanh TM). Verify bằng cách mở modal `Phân công` của bất kỳ VV nào — dropdown phải hiển thị ít nhất 1 TVV.
3. **BUG-VV-003 (Major):** Đồng bộ DM `linh_vuc_phap_ly` giữa module Danh mục dùng chung (QTHT) với dropdown form CREATE VV. Thêm `HOP_DONG` (Hợp đồng) và `DOANH_NGHIEP` (Doanh nghiệp) vào enum DM hoặc ánh xạ đúng spec SRS.

### Should Fix

4. **BUG-VV-004 (Medium):** Sửa nội dung DM `Thuế (updated)` → `Thuế` trên production. Đây là dấu vết QA test DM update, không được leak vào CSDL production.
5. **BUG-VV-005 (Minor):** Map raw enum `DA_KET_THUC` → "Đã kết thúc" trong cột list `SCR-V.I-02`. Áp dụng i18n function dùng chung với detail view để tránh drift.

### Additional Recommendations

6. **Test data seed:** Script SQL seed 3-5 TVV `ĐANG HOẠT ĐỘNG` cấp TW đa lĩnh vực để unlock VV-SM-003..006.
7. **Harness QA:** Cần 3 account cùng đơn vị (CB NV + TVV + CB PD) với password chuẩn để test full SM-VUVIEC 9 step.
8. **Dashboard scope verify:** Dashboard báo "Vụ việc tiếp nhận: 0" nhưng list có 100+ bản ghi → verify KPI scope filter (có thể count theo kỳ khác).
9. **Chức năng Upload tài liệu đính kèm:** Chưa test (6 VV không upload file) — cần thêm TC upload doc/pdf/xls 20MB để cover FR-V.I-01 §Processing.

---

## 8. Appendix

### A — API Endpoints suy luận (chưa dump network, chỉ suy từ UI behavior)

| Method | Endpoint (suy) | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| GET | `/api/v1/vu-viec?...` | List VV với filter | VV-DATA-01 |
| GET | `/api/v1/doanh-nghiep?keyword=...` | Search DN by MST | VV-CR-001..006 |
| GET | `/api/v1/danh-muc/linh-vuc-phap-ly` | Fetch lĩnh vực options | VV-CR-001..006 |
| GET | `/api/v1/danh-muc/loai-hinh-ho-tro` | Fetch loại hình options | VV-CR-001..006 |
| POST | `/api/v1/vu-viec` | Create new VV | VV-CR-001..006 |
| POST | `/api/v1/vu-viec/{id}/kiem-tra` | Transition state | VV-SM-002 |
| GET | `/api/v1/tu-van-vien?lich-vuc=...&trang-thai=DANG_HOAT_DONG` | Fetch TVV for assignment | VV-SM-003 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [01-list-page.png](image/01-list-page.png) | Trang danh sách VV (trước seed), 100 bản ghi DCHT, phát hiện raw enum DA_KET_THUC | BUG-VV-005 |
| [02-create-form-empty.png](image/02-create-form-empty.png) | Form CREATE empty, 4 accordion | VV-CR-001 |
| [03-vv01-before-save.png](image/03-vv01-before-save.png) | Form VV#1 đã fill, trước click Lưu | VV-CR-001 |
| [04-vv01-created.png](image/04-vv01-created.png) | Detail VV#1 sau CREATE, state "Đã tiếp nhận" | VV-CR-001 |
| [05-vv02-kiem-tra-modal.png](image/05-vv02-kiem-tra-modal.png) | Modal Kiểm tra hồ sơ, 6 hạng mục text-only không có checkbox | BUG-VV-001 |
| [06-vv03-phancong-empty.png](image/06-vv03-phancong-empty.png) | Modal Phân công TVV, dropdown rỗng "Trống" | BUG-VV-002 |
| [07-vv06-created.png](image/07-vv06-created.png) | Detail VV#6 sau CREATE, state "Đã tiếp nhận" | VV-CR-006 |
| [08-final-list-6vv.png](image/08-final-list-6vv.png) | List sau seed, 6 VV-BTP-TW mới ở đầu, tổng `1-20 / 106 mục` | VV-DATA-01 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| flow-module §3 Bước 1 (CREATE thủ công) | VV-CR-001..006 | 6/6 PASS |
| flow-module §3 Bước 2 (Kiểm tra Hồ sơ, state `ĐANG KIỂM TRA`) | VV-SM-002 | 0/1 PASS (BUG-VV-001 skip state) |
| flow-module §3 Bước 3 (Phân công NHT, state `ĐÃ PHÂN CÔNG`) | VV-SM-003 | state OK / assign BLOCKED |
| flow-module §3 Bước 4-8 (TVV chấp nhận → HOÀN THÀNH) | VV-SM-004..006 | BLOCKED (harness + seed TVV) |
| flow-module §3 Lưu ý (Yêu cầu bổ sung / Từ chối) | — | Chưa cover (cần state `ĐANG KIỂM TRA` tồn tại) |
| SCR-V.I-02 (list filter + tabs + actions) | VV-DATA-01, BUG-VV-005 | PARTIAL (list render OK, column enum leak) |
| Dashboard FR-I-02..04 (count KPI Vụ việc) | Observation A (out-of-scope) | Chưa verify sau seed |

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (Opus 4.7)*
