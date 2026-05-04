# Bug Report — Seed Tier 0-1 (P1 Block B — T1.B1 + T1.B2)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA AI (via Claude Code + Chrome DevTools MCP) |
| **Ngày** | 2026-04-24 10:58 – 11:40 |
| **Loại test** | Seed (pure seed mindset — entry state only) |
| **Round** | Round 4 |
| **Phase** | P1 Block B — GĐ 1 Seed Tier 0-1 |
| **Tasks covered** | T1.B1 (QTHT) + T1.B2 (DN 6 variants) + T1.B3 (TVV — **BLOCKED 6/6** bởi BUG-TVV-001-R4). |
| **Tài liệu tham chiếu** | [plan.md §8 v1.4](../../../../tasks/plan.md) • [seed-checklist-QTHT.md](../seed/seed-checklist-QTHT.md) • [seed-checklist-DN.md](../seed/seed-checklist-DN.md) |

---

## Tổng hợp

Phát hiện **1 bug Critical regression** trong Seed Tier 0-1 (T1.B3 TVV): `BUG-TVV-001-R4` — **BLOCKER 100% TVV seed + cascade downstream** (T3.1, T3.3 Bước 3+, T3.4, T4.2, T4.5, P5 cross-module).

> **Rule áp dụng:** Bug chỉ log khi có SRS reference cụ thể (memory `feedback_bug_must_have_srs_ref.md`). Observations không map SRS clause → ghi §Observations cuối file.
>
> **Regression principle:** R1 bug verified still-present trong round mới = log formal Round 4 bug ID mới (`BUG-TVV-001-R4`) để trigger dev re-fix priority. Cross-reference R1 memory để dev thấy pattern persistent.
>
> **Seed phase principle** (template seed-checklist §Nguyên tắc): Bug phát hiện khi seed → thông thường note, log formal ở P4. **Ngoại lệ**: Critical/Blocker regression chặn 100% seed + downstream → log ngay để escalate.

### Severity breakdown (bugs NEW trong P1 Block B Round 4)

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| **1** | **1** | 0 | 0 | 0 | 0 |

### Test result breakdown theo Type

> Phase này KHÔNG chạy functional TC — chỉ verify-count + seed-create. Bảng dưới phản ánh pass-rate seed (count check + record create).

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy (seed create DN)** | 6 DN variants tạo mới (T1.B2) | 6 | 6 | 0 | 0 | 0 | **100%** |
| **Happy (seed create TVV)** | 6 TVV variants tạo mới (T1.B3) | 6 | 0 | 0 | 0 | **6** | **0%** |
| **Count verify (Tier 0)** | DM/DON_VI/TK/SLA/PC/BIEU_MAU min threshold (T1.B1) | 7 | 6 | 1 | 0 | 0 | **85.7%** |
| **Workflow** | Không áp dụng (seed only) | — | — | — | — | — | — |
| **Authorization** | Không áp dụng (seed only) | — | — | — | — | — | — |
| **Edge / Guard** | Không áp dụng (seed only) | — | — | — | — | — | — |
| **Integration** | Không áp dụng (seed only) | — | — | — | — | — | — |
| **Total** | | **19** | **12** | **1** | **0** | **6** | **63.2%** |

→ **Happy-path DN seed = 6/6 = 100%** ✅
→ **Happy-path TVV seed = 0/6 BLOCKED** 🚫 bởi BUG-TVV-001-R4
→ **Count-verify = 6/7 PARTIAL** (PC preset MISS)

---

## Bug Summary Table — 1 new bug

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|-------------------|-------|--------|
| **BUG-TVV-001-R4** | **Critical** | **P0** | Data / Validation | TVV (FR-IV-01) | T1.B3 (TVV1-6 all) | `FR-IV-01 UC39 §Inputs row ngay_sinh` + `FR-IV-01 §Error Handling` (BE reject "ngaySinh must be a valid ISO 8601 date string") + `SCR-IV-02 Form Field "Ngày sinh"` | **[REGRESSION]** FE ProForm DatePicker `ngay_sinh` gửi literal "Invalid Date" khi submit, bất kỳ input method nào. Blocks 100% CREATE TVV → cascade T3.1, T3.3, T3.4, T4.2, T4.5. R1 `BUG-TVV-001` chưa dev fix. | ✅ **Closed-verified** (2026-04-24 retry-3 ~15:06-15:20; 6/6 TVV seeded PASS; POST body ISO 8601 đúng; BE 201 × 6) |

---

## BUG-TVV-001-R4 — FE ProForm DatePicker `ngay_sinh` serialize "Invalid Date" → BE reject (REGRESSION)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-TVV-001-R4 |
| **Severity** | **Critical** |
| **Priority** | **P0** (block release — chặn 100% TVV seed + cascade 5 downstream tasks) |
| **Type** | Data / Validation |
| **Status** | **Open** |
| **Round** | Round 4 (regression từ Round 1 — R1 bug chưa fix) |
| **Module** | Quản lý Chuyên gia / Tư vấn viên (FR-IV-01) |
| **Thành phần** | FE submit handler ProForm của form SCR-IV-02 Tư vấn viên (nghi vấn: `String(dayjs)` hoặc `new Date(displayText).toISOString()` trong mapper dayjs → JSON) |
| **URL** | http://103.172.236.130:3000/chuyen-gia-tvv/tao-moi |
| **Trình duyệt** | Chromium (MCP Chrome DevTools) |
| **Tài khoản** | cb_nv_tw_01 (CB_NV TW) |
| **TC Reference** | T1.B3 TVV1-6 (tvv_variants[1..6]) — all BLOCKED cùng root cause |
| **SRS Reference** | `input/srs-v3/srs-fr-04-chuyen-gia-tvv.md §FR-IV-01 UC39 §Inputs row ngay_sinh` (Y, Date) + `§Error Handling` (expect `ERR-TVV-XX` Vietnamese, not English class-validator leak) + `SCR-IV-02 Form Field "Ngày sinh"` (row #3) |
| **Assignee** | FE Team (submit handler) + BE Team (error localization) |
| **Found by** | QA AI + Chrome DevTools MCP (2026-04-24 11:55) |
| **Related** | R1 `BUG-TVV-001` ([memory `qa_htpldn_tvv_cr_round1`](/Users/teamai/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_tvv_cr_round1.md)) — chưa fix 4 ngày sau (R1: 2026-04-23; R4 observed: 2026-04-24) |

### Mô tả

Khi CB NV TW mở form `SCR-IV-02 Thêm mới Tư vấn viên` và nhập ngày sinh hợp lệ (vd `15/03/1985`) rồi nhấn `[Lưu]`, FE ProForm DatePicker **luôn serialize field `ngay_sinh` thành literal string `"Invalid Date"` trong POST body** bất kể input method. BE reject với validation error `"ngaySinh must be a valid ISO 8601 date string"` leak English ra UI toast. 100% CREATE TVV bị chặn.

### Các bước tái hiện

1. Login `cb_nv_tw_01` / `Secret@123` + OTP `666666` → dashboard.
2. Click sidebar `Quản lý chuyên gia / tư vấn viên` → URL `/chuyen-gia-tvv/danh-sach`.
3. Click button `[+ Thêm TVV]` → URL `/chuyen-gia-tvv/tao-moi` form render.
4. Fill form per fixture `tvv_variants[1]`:
   - Họ tên: "Nguyễn Văn Tư Vấn"
   - **Ngày sinh**: type `15/03/1985` + press `Enter` trong input (placeholder "Vui lòng chọn")
   - Giới tính: `Nam`
   - CMND: `001085000001`
   - Email: `nguyen.tuvan.01@test.htpldn.vn`
   - SĐT: `0901000001`
   - Địa chỉ: "Số 25 Trần Duy Hưng, Cầu Giấy, Hà Nội"
   - Trình độ: `Thạc sĩ`
   - Chứng chỉ: `LS-HN-2020-001`
   - Kinh nghiệm: "10 năm hành nghề luật sư..."
   - Tổ chức chính: `Trung tâm trợ giúp pháp lý` (fabricated — DM thiếu "Đoàn Luật sư HN")
   - Lĩnh vực: `Lao động` + `Kinh doanh thương mại`
   - Địa bàn: `Hà Nội`
5. Verify DatePicker input.value = `"15/03/1985"` (display OK).
6. Click `[Lưu]`.
7. Observe: Error toast `"ngaySinh must be a valid ISO 8601 date string"` xuất hiện; form không submit; URL stuck `/chuyen-gia-tvv/tao-moi`.

### Kết quả mong đợi

- FE serialize `ngay_sinh` thành ISO 8601 string (vd `"1985-03-15"` hoặc `"1985-03-15T00:00:00.000Z"`).
- BE POST 201 Created, redirect `/chuyen-gia-tvv/:uuid`, TVV record ở entry state `MOI_DANG_KY`.
- Nếu validation fail → error message Vietnamese per SRS `§Error Handling` (vd `ERR-TVV-DOB-01 "Ngày sinh không hợp lệ"`), không leak English.

### Kết quả thực tế

- FE serialize `ngay_sinh` literal `"Invalid Date"` string.
- BE POST 400 Bad Request.
- UI toast: `"ngaySinh must be a valid ISO 8601 date string"` (English class-validator output leak — cũng vi phạm `§Error Handling` spec).
- Form URL stuck `/chuyen-gia-tvv/tao-moi`.

### Bằng chứng

- Screenshot initial run: [screenshots/bug-tvv-001-r4-regression-invalid-date.png](../screenshots/bug-tvv-001-r4-regression-invalid-date.png)
- Screenshot retry 2026-04-24 14:20: [screenshots/bug-tvv-001-r4-retry-2026-04-24-14-20-invalid-date.png](../screenshots/bug-tvv-001-r4-retry-2026-04-24-14-20-invalid-date.png)
- DOM query evidence (via MCP `evaluate_script`):
  ```json
  {
    "url": "http://103.172.236.130:3000/chuyen-gia-tvv/tao-moi",
    "errors": ["ngaySinh must be a valid ISO 8601 date string"]
  }
  ```
- DatePicker input display value verified OK trước submit:
  ```json
  { "value": "15/03/1985", "placeholder": "Vui lòng chọn" }
  ```

### Retry verification — 2026-04-24 14:18 (C1 user-requested re-check before gate decision)

**Procedure:** Re-login `cb_nv_tw_01` → `/chuyen-gia-tvv/tao-moi` → fill TVV1 fixture identical → click `[Lưu]`.

**Result: NO CHANGE** — bug signature identical. Full network capture reqid=189:

| Field | Value |
|-------|-------|
| Endpoint | POST `/api/v1/tu-van-viens` |
| HTTP status | **422** |
| Request body `ngaySinh` | `"Invalid Date"` (literal string — FE submit handler broken, same as R1) |
| Response error.code | `ERR-VAL-SYS-00-01` |
| Response error.field | `ngaySinh` |
| Response error.message | `"ngaySinh must be a valid ISO 8601 date string"` (English leak — double violation per §Error Handling spec) |
| Response requestId | `5817bfb4-453b-4757-902b-d671e76b1b66` |
| Response timestamp | `2026-04-24T07:20:08.439Z` (server UTC) |

**Full request body captured (reqid=189):**
```json
{
  "hoTen": "Nguyễn Văn Tư Vấn",
  "gioiTinh": "NAM",
  "cccd": "001085000001",
  "email": "nguyen.tuvan.01@test.htpldn.vn",
  "dienThoai": "0901000001",
  "diaChi": "Số 25 Trần Duy Hưng, Cầu Giấy, Hà Nội",
  "trinhDo": "Thạc sĩ",
  "chuyenNganh": "LS-HN-2020-001",
  "kinhNghiem": "10 năm hành nghề luật sư tư vấn HĐ lao động và tranh chấp lao động",
  "toChucChinhId": "79158912-f7fa-424f-b898-37e164db971d",
  "linhVucIds": ["6e673931-a2ca-4615-bafd-60c356d26775","7a826d8e-4bfa-4aa9-9ef7-80b3b52e531b"],
  "diaBanIds": ["012284b8-612d-4e9d-acaa-483154a7b396"],
  "ngaySinh": "Invalid Date",
  "loaiTvv": "TVV"
}
```

→ **BUG-TVV-001-R4 confirmed still-Open — dev chưa merge fix tính đến 14:20 2026-04-24**. Variants 2-6 skip retry (same submit-handler path, same expected signature). Cascade-block registry không thay đổi. Escalate dev FE via PM.

### Retry-2 verification — 2026-04-24 14:43 (after user reports "dev đã fix")

User báo dev đã merge fix → QA chạy re-seed 6 variants. TVV1 fresh attempt (new session cb_nv_tw_01 + type-based DatePicker THEN picker-click DatePicker):

**Partial fix detected (cosmetic-only):**

| Layer | Trước retry-2 | Sau retry-2 | Δ |
|-------|--------------|-------------|---|
| FE form-level error text | Không hiện (POST submit ngay) | `"Ngày sinh không hợp lệ"` (Vietnamese, hiện client-side dưới field) | ✅ Added |
| FE submit handler `ngaySinh` serialization | `"Invalid Date"` literal | **`"Invalid Date"` literal (SAME)** | ❌ KHÔNG fix |
| BE POST response | 422 `ERR-VAL-SYS-00-01` + English leak | **422 `ERR-VAL-SYS-00-01` + English leak (SAME)** | ❌ KHÔNG fix |

**Procedure test:**
1. **Text-typing approach** (original R1/R4 method): type "15/03/1985" + Enter — FE client hiện error `"Ngày sinh không hợp lệ"`, **submit bị blocked client-side** (KHÔNG có POST). Fix cosmetic chặn hitting BE.
2. **Picker-click approach** (workaround): click calendar icon → click "Chọn năm" → click 1985 → click Th 03 → click day 15 → input value committed `"15/03/1985"` → **no client error** → click `[Lưu]` → POST sent.

**reqid=194 POST `/api/v1/tu-van-viens` - picker-click approach result:**

```json
Request body: {
  "hoTen": "Nguyễn Văn Tư Vấn",
  ...,
  "ngaySinh": "Invalid Date",  // ← STILL literal string despite picker-click
  "loaiTvv": "TVV"
}
Response: 422
{
  "success": false,
  "error": {
    "code": "ERR-VAL-SYS-00-01",
    "field": "ngaySinh",
    "message": "ngaySinh must be a valid ISO 8601 date string",
    "requestId": "b361bbc0-df34-41d4-acfa-3e1570a2531c",
    "timestamp": "2026-04-24T07:43:41.538Z"
  }
}
```

Screenshot: [screenshots/bug-tvv-001-r4-retry2-2026-04-24-14-43-partial-fix-only.png](../screenshots/bug-tvv-001-r4-retry2-2026-04-24-14-43-partial-fix-only.png)

### Root-cause update — dev fix KHÔNG hoàn chỉnh

Dev deliver **layer 1 only** (FE cosmetic error text). Layer 2 (submit handler mapper `dayjs → ISO 8601 string`) + Layer 3 (BE error localization) **VẪN CHƯA fix**.

Regardless of input method (type+Enter, type+Tab, picker-click-date-cell), FE `onFinish` callback serializes `ngaySinh` thành literal `"Invalid Date"` trong JSON body. Đây là bug trong code path `values → payload` mapper, chưa phải component input.

**Revised suggested fix (layer 2 — critical):**

```tsx
// src/pages/chuyen-gia-tvv/components/TvvForm.tsx (hoặc tương tự)
const onFinish = async (values) => {
  const payload = {
    ...values,
    // BẮT BUỘC format dayjs object → YYYY-MM-DD string trước khi stringify
    ngaySinh: values.ngaySinh?.isValid?.()
      ? values.ngaySinh.format('YYYY-MM-DD')
      : null,
  };
  // Hoặc dùng ProForm transform ở field level:
  // <ProFormDatePicker transform={(v) => ({ ngaySinh: v?.format('YYYY-MM-DD') })} />
  await api.createTvv(payload);
};
```

**Decision:** Variants 2-6 SKIP retry (same code path). Cascade-block registry unchanged. Escalate dev **urgent** — regression persists across 3 sessions (R1 2026-04-23, R4 initial 12:05, R4 retry-1 14:20, R4 retry-2 14:43).

### Tác động (Impact)

**100% CREATE TVV bị chặn** qua UI. Cascade-block:

| Downstream | Impact |
|------------|--------|
| T3.1 SM-TVV workflow (P3 Tuần 3) | 🚫 Hard block — không record để walk state |
| T3.3 SM-VUVIEC Bước 3 (Phân công NHT/TVV) | 🚫 Block 5/8 bước transition (per R1 memory `qa_htpldn_vuviec_cr_round1` đã ghi nhận "5 BLOCKED thiếu TVV ACTIVE") |
| T3.4 SM-TVCS workflow | 🚫 Block (TVCS link TVV) |
| T4.2 Functional CG/TVV 31 TC | 🚫 Block (chỉ test empty state được, không CRUD/edit/delete) |
| T4.5 Functional TVCS 44 TC | 🚫 Block |
| P5 Cross-module TVV↔VV | 🚫 Block |

**Quy mô ảnh hưởng:** ~5 task major × pass-rate 90% target = risk miss exit criteria G1 (P0 pass 100%). Round 4 không thể complete trừ khi fix trước P3 Week 3 (2026-05-09).

### Nguyên nhân nghi ngờ (Root Cause)

Per R1 memory investigation (5 POST attempts verified):
- React internal state `RefPicker.memoizedProps.value` đã chứa ISO đúng (vd `"2026-04-19T17:00:00.000Z"` từ dayjs object).
- **Submit handler của ProForm convert sai** khi chuẩn bị request body — nghi ngờ 1 trong 2 pattern:
  - `String(dayjs_object)` → `"Invalid Date"` nếu dayjs instance không được format trước.
  - `new Date(display_text).toISOString()` → `"Invalid Date"` khi parse `"15/03/1985"` (format DD/MM/YYYY browser không hiểu, expect MM/DD/YYYY hoặc ISO).

Code path nghi vấn:
- `src/pages/chuyen-gia-tvv/components/TvvForm.tsx` (hoặc tương tự) → `onFinish` callback → body mapper.
- Hoặc ProForm `transform` của DatePicker field thiếu `date.format('YYYY-MM-DD')`.

### Gợi ý sửa (Suggested Fix)

1. **Ngay lập tức:** Audit `onFinish` của ProForm trong `TvvForm.tsx`:
   ```diff
   const onFinish = async (values) => {
   -  const payload = { ...values };
   +  const payload = {
   +    ...values,
   +    ngay_sinh: values.ngay_sinh ? dayjs(values.ngay_sinh).format('YYYY-MM-DD') : null,
   +  };
     await api.createTvv(payload);
   };
   ```
   hoặc dùng ProForm `transform`:
   ```tsx
   <ProFormDatePicker
     name="ngay_sinh"
     label="Ngày sinh"
     rules={[{ required: true }]}
     transform={(value) => ({ ngay_sinh: value ? value.format('YYYY-MM-DD') : null })}
   />
   ```

2. **Regression test bắt buộc toàn bộ DatePicker trong app** (cross-module risk per R1 finding):
   - DN form `ngay_cap_dkkd` (SCR-V.III-02) — hiện không hiện trong form do BUG-DN-005 regression, fix field trước rồi test lại
   - VV form date fields (SCR-V.I-02)
   - HDTV form date (SCR-VIII-HDTV)
   - Khóa học `thoi_gian_bat_dau` / `thoi_gian_ket_thuc` (SCR-III-02)
   - SLA config form dates (SCR-VIII-10)
   - Dashboard filter "Từ ngày / Đến ngày" (SCR-I-01) — submit filter có thể OK (GET query params), khác pattern submit POST
   - Báo cáo filter dates

3. **BE:** localize validation error — return `ERR-TVV-DOB-01 "Ngày sinh không hợp lệ"` thay vì leak `"ngaySinh must be a valid ISO 8601 date string"` (address R1 BUG-TVV-002 cùng lúc).

4. **Test plan sau fix:** QA re-seed 6 TVV + verify cross-module DatePicker list trên.

---

## Regressions — R1 bugs still present (track only, không re-log)

Theo rule **KHÔNG duplicate bug** (bug ID R1 đã tồn tại trong memory + output/data-master reports). Nếu dev fix chưa merge, phase P4 Functional sẽ re-verify formally.

| R1 Bug ID | Severity R1 | Module | Title | Status observed 2026-04-24 | Source memory |
|-----------|-------------|--------|-------|----------------------------|----------------|
| BUG-DN-001 | Critical | DN (FR-V.III-01) | BE tính quy mô NĐ39 sai (100 LĐ + 50 tỷ → NHO thay VUA) | **Không trigger được** trong seed — user force-select "Vừa" persist OK. Chưa test auto-suggest vì BUG-DN-004 blocks path. Defer P4 T4.4 | `qa_htpldn_qldn_fr01_r1` |
| BUG-DN-004 | Major | DN (SCR-V.III-02) | Auto-suggest quy mô không implement FE | **Present** — 6/6 DN seed không thấy auto-suggest khi nhập LĐ+DT. QA phải chọn tay | `qa_htpldn_qldn_fr01_r1` |
| BUG-DN-005 | Medium | DN (SCR-V.III-02) | Form thiếu 3 field: `ngay_cap_dkkd`, `fax`, `file_dinh_kem` | **Present** — form mở từ `[+ Thêm mới]` không có 3 field | `qa_htpldn_qldn_fr01_r1` + `qa_htpldn_qldn_ui_round1` |
| BUG-CHS-PC-* | Critical + Major ×4 | Cấu hình Phân công (FR-II-NEW-01 Tab 2) | Drawer không đóng, uu_tien default=1, form thiếu 3 field, input -5, browser crash | **Present partially** — Tab 2 render chỉ 1 section "Hỏi đáp", KHÔNG thấy section "Vụ việc" (mới observed — xem §Observations obs-003). Preset rỗng (0 record) | `qa_htpldn_chs_phancong_round1` |

**Handling:** 4 regressions này sẽ re-verify formal trong **P4 T4.4 Functional DN + T4.8 Functional QTHT**. Nếu dev fix trước đó → close, nếu không → re-log formal với evidence 2026-04-24.

---

## Observations — ngoài SRS (không log bug)

> Mục đích: Ghi quan sát **không có SRS reference cụ thể** — chưa đủ căn cứ log bug formal. BA cần bổ sung SRS clause trước, sau đó log round sau.

| # | Observation | Chi tiết / Evidence | SRS có nói không? | Đề xuất |
|---|-------------|----------------------|-------------------|---------|
| **obs-001** | DM `linh_vuc_phap_ly` thiếu code `HOP_DONG` | Fixture `tier_0_prerequisite > linh_vuc_phap_ly[2]` expect `{code: "HOP_DONG", name: "Hợp đồng"}`. UI list 12 codes: DAN_SU/HINH_SU/HANH_CHINH/LAO_DONG/DAT_DAI/HON_NHAN_GIA_DINH/KINH_DOANH_TM/KHIEU_NAI_TO_CAO/THUE/SO_HUU_TRI_TUE/DOANH_NGHIEP/DAU_TU — **không có HOP_DONG** | SRS FR-10 Quản lý DM không enumerate required codes cho `LINH_VUC_PL`. Fixture là artifact QA, không ràng buộc SRS | BA confirm: HOP_DONG cần bổ sung vào DM standard không? Nếu có → seed qua QTHT; nếu không → update fixture remove |
| **obs-002** | DM `loai_dn` semantic mismatch: UI stores quy mô (NĐ39) thay vì legal form | UI 5 codes: `DN_SIEU_NHO/DN_NHO_VA_VUA/HO_KINH_DOANH/HOP_TAC_XA/DN_XA_HOI`. Fixture expect `TNHH/CP/DNTN/HKD` (legal form). DN form có 2 field tách biệt: `quy_mo` (enum SIEU_NHO/NHO/VUA) + `loai_doanh_nghiep_id` (FK → DANH_MUC). Hiện DM `loai_dn` lưu quy-mô-like nên conflate 2 khái niệm | SRS FR-V.III-01 Inputs row (Loại DN) nói `FK → DANH_MUC.loai_dn` nhưng **không define enum cụ thể**. Per memory `qa_htpldn_qldn_fr01_r1` đã note tương tự | BA confirm + bổ sung enum vào FR-10 UC105 / FR-V.III-01: Loại DN = legal form (TNHH/CP/DNTN/HKD) vs quy mô = NĐ39 (SIEU_NHO/NHO/VUA). Hiện tại 2 field UI đều có nhưng semantic overlap. Potential merge/refactor DM |
| **obs-003** | Cấu hình Phân công Tab 2 không có section "Vụ việc" | SCR-VIII (Cấu hình Phân công) Tab 2 render duy nhất 1 H4 "Cấu hình phân công hỏi đáp" + 0 record. Plan T1.B1 acceptance yêu cầu preset cho 2 module (HD + VV). Snapshot có `[+ Thêm cấu hình]` nhưng không có section thứ 2 cho VV | SRS FR-II-NEW-01 (Cấu hình Phân công mặc định) — cần check chính xác có clause require 2 module section không. Memory `qa_htpldn_chs_phancong_round1` đã log 4 Major trên tab này nhưng KHÔNG có "VV section missing" trong R1 bug list | BA verify SRS FR-II-NEW-01 text. Nếu spec says "phải có 2 subsection" → log Major bug round sau. Nếu spec implies single config khi assign module type → observation only |
| **obs-004** | Float32 precision loss cho money field ≥ 50 tỷ VNĐ | DN3 Gamma: Tổng vốn input `90_000_000_000` → stored `89999998976` (lệch 1024 VNĐ). DN5 Epsilon: Doanh thu `50_000_000_000` → `49999998976` (lệch 1024 VNĐ); Tổng vốn `60_000_000_000` → `60000002048` (lệch 2048 VNĐ). Display vẫn hiện đúng "50.000.000.000" nhưng backend value lệch | SRS FR-V.III-01 Inputs row "Doanh thu / Tổng vốn" chỉ nói `type=number, ≥ 0` — **không có constraint precision / data type = money/decimal**. Per memory `qa_htpldn_qldn_fr01_r1` đã note tương tự | BA bổ sung constraint: `type=decimal(20,0)` hoặc `bigint` cho cột money; **quan trọng khi test BR-CALC-01/02 Chi trả** (nếu lệch 1024 VNĐ ở tổng vốn → quyết định quy mô NĐ39 có thể sai). |
| **obs-005** | Fixture codes không khớp UI codes (DON_VI + loai_dn) | Fixture `tier_0_prerequisite > don_vi_required` dùng `TW-CUC/BN-BTP/DP-HN/DP-HP/DP-DN`. UI DON_VI actual `BTP-TW` + 18 Bộ với tên đầy đủ + 64 Sở Tư pháp với code `STP-{TINH}`. Tương tự `loai_dn` fixture vs UI (xem obs-002) | Fixture là artifact QA, không phải SRS | Refactor fixture `seed-fixture.yaml > tier_0_prerequisite` cho khớp UI codes trước Round 5 Permission Matrix để giảm mapping overhead |
| **obs-006** | Click [Đăng nhập] đôi khi không fire lần đầu, cần click 2 lần | Observed 2/11 login attempts trong P0 + seed (cb_nv_tw_01 + dn_01). Submit button click 1 lần không trigger form submit; click lần 2 OK. Không block, workaround retry 1× | SRS không có spec về button behavior này | Potentially FE event listener debounce issue hoặc MCP click timing. Track trong P1 smoke nếu pattern repeat — nếu ≥3 lần/session, log bug round sau. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP (bypass) |
| Tool | Chrome DevTools MCP (primary, `mcp__chrome-devtools__*`) |
| MCP Stability | 0 crash qua T1.B1 + T1.B2 (~25 phút) |

### B — Tài khoản sử dụng

| Username | Vai trò | Cấp | Dùng cho task |
|----------|---------|-----|---------------|
| `qtht_01` | QTHT | TW | T1.B1 verify DM/DON_VI/TAI_KHOAN/SLA/PC/BIEU_MAU |
| `cb_nv_tw_01` | CB_NV | TW | T1.B2 seed 6 DN variants |

### C — Data seeded (sample IDs cho downstream)

| Entity | Sample IDs | Count | Next use |
|--------|-----------|-------|----------|
| DOANH_NGHIEP | DN-HNI-0001/0002, DN-HPG-0001/0002, DN-DNG-0001/0002 | **6** | T1.B3 TVV (nếu link DN), T2.A2 VU_VIEC, T2.A4 HSPL, T2.A3 TVCS |
| DANH_MUC `linh_vuc_phap_ly` | 12 codes (DAN_SU..DAU_TU) | 12 | Dropdown FK trong form tạo HD/VV/TVCS/KH |
| DANH_MUC `loai_dn` | 5 codes (DN_SIEU_NHO..DN_XA_HOI) | 5 | Dropdown FK form tạo DN (đã dùng 2) |
| DON_VI | 83 (1 TW + 18 BN + 64 DP) | 83 | Scope lock + FK form tạo VV/TVV/DN |
| TAI_KHOAN | 34 accounts users.csv (qtht/cb_nv/cb_pd/cg/nht/tvv/dn × 3 suffix + admin) | 34 | Login tất cả role test |

### D — Screenshots / evidence

| File | Dùng cho |
|------|----------|
| [screenshots/smoke-cb_nv_tw_01-tv-nhanh-empty.png](../screenshots/smoke-cb_nv_tw_01-tv-nhanh-empty.png) | Smoke T1.A1 evidence (BE-sync 0 record cascade-block) — reused |

*Seed phase typically không chụp screenshot per DN (verify detail có `#DN-HNI-0001` inline URL đã đủ evidence). Nếu cần, có thể chụp sau.*

### E — Cascade-block registry (update — 3 entries now)

| Module BLOCKED | Upstream cause | Reason code | Affected downstream |
|----------------|----------------|-------------|---------------------|
| M6 Chi trả (HO_SO_CHI_TRA) | DVC/LGSP BE-sync empty 0 record | `BLOCKED-UPSTREAM-SYNC-MISSING` | T2.B4, T3.6, T4.12 |
| M12 TV Nhanh (TV_NHANH_PHIEN) | Cổng PLQG BE-sync empty 0 record | `BLOCKED-UPSTREAM-SYNC-MISSING` | T2.B5, T3.7, T4.11 |
| ~~M2 TU_VAN_VIEN~~ | ~~BUG-TVV-001-R4~~ | ~~`BLOCKED-FE-DATEPICKER-BROKEN`~~ | ✅ **UNBLOCKED 2026-04-24 retry-3** — 6/6 TVV seeded PASS. T1.B3 `[x]` done. T3.1/T3.3/T3.4/T4.2/T4.5/P5 unblocked. |

---

*Bug report generated: 2026-04-24 | QA AI via Claude Code + Chrome DevTools MCP | Phase P1 Block B Seed Tier 0-1*
*Append T1.B3 TVV bugs/observations khi hoàn thành task đó.*
*Updated 2026-04-24 14:22 — C1 gate retry verification appended (BUG-TVV-001-R4 still-Open, reqid=189 captured).*
*Updated 2026-04-24 14:45 — Retry-2 after user reports "dev đã fix": PARTIAL FIX detected (layer 1 cosmetic Vietnamese validation added; layer 2 submit-handler mapper + layer 3 BE localization still-Open). reqid=194 POST body still contains literal `"Invalid Date"` despite picker-click approach.*

*Updated 2026-04-24 ~15:20 — **Retry-3 CLOSED-VERIFIED**. BUG-TVV-001-R4 fully resolved by dev: layer 2 submit handler now formats dayjs → `"YYYY-MM-DD"` ISO 8601, layer 3 BE error message localized. Test evidence: 6/6 TVV seeded PASS via MCP, POST body `ngaySinh:"1985-03-15"` (and correct ISO for each variant), BE 201 Created × 6 (reqid=258, 291, 304, 318, 330, 343). Sample IDs captured: `TVV-BTP-TW-0001` (Nguyễn Văn Tư Vấn, id=fd76f004), `TVV-BTP-TW-0002` (Trần Thị, id=63640ce9), `TVV-BTP-TW-0003` (Lê Văn Chuyên Gia, id=09ef865d), `TVV-BTP-TW-0004` (Phạm Thị Đào Tạo, id=5bd3b075), `TVV-BTP-TW-0005` (Hoàng Văn Năm, id=6e9dfdf5), `TVV-BTP-TW-0006` (Vũ Văn Sáu, id=df8f6a64) — all in state `MOI_DANG_KY`. Evidence: [screenshots/tvv-retry3-success-6-list.png](../screenshots/tvv-retry3-success-6-list.png). Downstream T3.1/T3.3/T3.4/T4.2/T4.5/P5 un-blocked. Residual R1 observations (BUG-TVV-003 dia_ban dấu * missing, BUG-TVV-004 upload accept superset, BUG-TVV-006 module name inconsistent + "Loại" field missing) sẽ re-verify formal tại P4 T4.2.*
