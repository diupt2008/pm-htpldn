# BUG REPORT — Module FR-02 Quản lý Hỏi đáp Pháp lý

**Phát hiện trong:** Smoke test E2E happy-path SM-HOIDAP + UI audit + 3 nhánh negative
**Ngày:** 2026-04-29 15:14–15:35
**Tester:** QA Automation (Chrome DevTools MCP — headless, isolated, multi-tab)
**Build:** http://103.172.236.130:3000
**SRS ref:** `input/srs/srs-v3/srs-fr-02-hoi-dap.md`
**Tổng số bug:** 9 (1 Critical / 3 High / 4 Medium / 1 Low)
**Test record E2E:** `HD-20260429-001` (id `b818cc40-a18c-43f3-9593-b72290122501`, lĩnh vực Thuế)

---

## BUG-FR02-002 — Click chèn mẫu phản hồi → trang 404

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical (BLOCKER cho FR-II-NEW-02) |
| **Priority** | P0 — Must fix |
| **Status** | Open |
| **Component** | Frontend — SCR-II-02 form Soạn phản hồi (`/hoi-dap/{id}`) |
| **FR liên quan** | FR-II-NEW-02 (Quản lý mẫu câu hỏi/phản hồi), FR-II-07 (Phản hồi câu hỏi) |
| **SRS Reference** | SCR-II-02 hàng 19 (Dropdown chèn mẫu) |
| **Phát hiện lúc** | 2026-04-29 15:29 |
| **Reproduce rate** | 1/1 (100%) — confirmed một lần, cần dev verify thêm |

### Mô tả

Khi CB NV ở trang chi tiết hỏi đáp (`/hoi-dap/{id}`) trạng thái `DANG_XU_LY`, click combobox "Chọn mẫu phản hồi" → chọn option "Mẫu phản hồi HD - Thuế" (hoặc bất kỳ mẫu nào khác) → trang **redirect 404 "Trang bạn tìm kiếm không tồn tại"** thay vì prefill nội dung mẫu vào textarea phản hồi như SRS đặc tả.

Bug này **chặn hoàn toàn tính năng FR-II-NEW-02** (sử dụng mẫu phản hồi). User phải gõ tay 100% nội dung phản hồi.

### Steps to reproduce

1. Đăng nhập `cb_nv_tw_01` / `Secret@123` / OTP `666666`.
2. Vào sidebar **Quản lý hỏi đáp pháp lý**.
3. Tạo HD mới (Lĩnh vực Thuế, kênh Trực tiếp, người gửi bất kỳ) → click **Tiếp nhận** → click **Phân công** → chọn người xử lý → **Phân công** → trạng thái = `Đang xử lý`.
4. Trên trang chi tiết, scroll xuống section "Soạn phản hồi" (render inline).
5. Click combobox **"Chọn mẫu phản hồi"** ở đầu form.
6. Click chọn option **"Mẫu phản hồi HD - Thuế"** (hoặc bất kỳ mẫu nào).

### Expected

- Combobox đóng lại.
- Nội dung mẫu được prefill tự động vào textarea **"Nội dung phản hồi"**.
- Trang vẫn ở `/hoi-dap/{id}` (không navigate).
- User có thể chỉnh sửa nội dung trước khi gửi.

### Actual

- Trang redirect đến **404 page** với:
  - Image "No Found"
  - StaticText "404"
  - StaticText "Trang bạn tìm kiếm không tồn tại."
  - Button "Về trang chủ"
- URL không thay đổi nhưng main content bị thay thế bằng 404 component.

### Evidence

**Snapshot ngay sau khi click mẫu (page tree):**
```
uid=48_0 image "No Found"
uid=48_1 StaticText "404"
uid=48_2 StaticText "Trang bạn tìm kiếm không tồn tại."
uid=48_3 button "Về trang chủ"
```

**Screenshot:** *(chưa capture — env có session timeout liên tục, dev có thể tự reproduce theo steps trên)*

**Workaround:** Navigate trở lại `/hoi-dap/{id}` → form Soạn phản hồi xuất hiện lại → user gõ tay nội dung phản hồi → vẫn submit được.

**Possible root cause (gợi ý):** Có thể khi chọn template, FE gọi route `/api/v1/mau-phan-hoi/{id}` (hoặc handler resolver) bị missing/sai path → fall back to NotFound component. Cần kiểm tra `MauPhanHoiPicker.onChange()` handler.

### Test data

- Mẫu phản hồi: 6 mẫu sẵn có (theo seed-data-precondition-report.md Item 4):
  - Mẫu phản hồi HD - Đất đai
  - Mẫu phản hồi HD - Sở hữu trí tuệ
  - **Mẫu phản hồi HD - Thuế** (đã reproduce)
  - Mẫu phản hồi HD - Lao động
  - Mẫu phản hồi HD - Hợp đồng/KDTM
  - Mẫu phản hồi HD - Doanh nghiệp

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § SCR-II-02 hàng 19 (Dropdown chèn mẫu) + FR-II-NEW-02 (Quản lý mẫu câu hỏi/phản hồi).

**Trích dẫn SRS (đã verify với NotebookLM + local file):**

> **SCR-II-02 hàng 19 — Dropdown chèn mẫu**
> Loại: `select (searchable)`
> Dữ liệu: "MAU_PHAN_HOI theo `linh_vuc_id` + `don_vi_id` theo đơn vị. **Chọn → prefill `noi_dung_mau` vào editor**"
> Hành vi: `change → prefill`
> Điều kiện hiển thị: khi soạn phản hồi, DANG_XU_LY

> **FR-II-NEW-02 — Quản lý mẫu câu hỏi/phản hồi**
> "Khi soạn phản hồi (FR-II-07), CB NV chọn mẫu → **nội dung chèn vào editor**."

**Kết luận:** SRS đặc tả rõ behavior phải là **prefill nội dung mẫu vào editor**, KHÔNG redirect 404. Bug được xác nhận là vi phạm SRS, blocker cho FR-II-NEW-02.

---

## BUG-FR02-009 — Bảng gợi ý phân công không expand đầy đủ 22 mapping

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **Priority** | P1 |
| **Status** | Open |
| **Component** | Frontend + Backend — Modal SCR-II-03 Phân công xử lý (`/hoi-dap/{id}` → modal) |
| **FR liên quan** | FR-II-06 (Phân công xử lý câu hỏi), FR-II-NEW-01 (Cấu hình lĩnh vực ↔ phân công) |
| **SRS Reference** | SCR-II-03 hàng 4 ("Bảng gợi ý phân công: CB/TVV khớp lĩnh vực"), AC FR-II-NEW-01 #3 |
| **Phát hiện lúc** | 2026-04-29 15:28 |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

Theo seed-data-precondition-report.md Item 3, môi trường có **22 mapping CAU_HINH_PHAN_CONG** đã active, gồm 3 tier:
- Tier 1: CB Nghiệp vụ TW (cb_nv_tw_01/02/03) cho 8 lĩnh vực
- Tier 2: TVV/CG đơn vị (Tư vấn viên 01/02/03, Chuyên gia 01/02/03)
- Tier 3: TVV/CG dự phòng

**Lĩnh vực Thuế đặc biệt có 2 mapping:** `cb_nv_tw_01` (Tier 1) và `Tư vấn viên 03 (BNI)` (Tier 2).

Tuy nhiên, khi CB NV TW mở modal Phân công cho HD lĩnh vực Thuế, **bảng gợi ý chỉ hiển thị 1 dòng** = chính `cb_nv_tw_01` đang đăng nhập, KHÔNG hiện `Tư vấn viên 03 (BNI)` Tier 2 dù mapping đã active.

→ Tính năng **gợi ý đa-tier theo cấu hình lĩnh vực ↔ CB không hoạt động đúng**. Bảng chỉ filter theo "CB cùng đơn vị xử lý hỏi đáp" thay vì expand đầy đủ mapping.

### Steps to reproduce

1. Đăng nhập `cb_nv_tw_01` (BTP-TW).
2. Tạo HD lĩnh vực **Thuế** → Tiếp nhận → bấm "Phân công" mở modal SCR-II-03.
3. Quan sát bảng "Gợi ý phân công".

### Expected

Theo SRS hàng 4: bảng phải hiện CB/TVV khớp lĩnh vực, sắp xếp `uu_tien ASC → workload ASC`. Lĩnh vực Thuế có 2 mapping → bảng phải hiện ít nhất 2 row:

| Họ tên | Đơn vị | Workload | Ưu tiên |
|---|---|---|---|
| CB Nghiệp vụ TW 01 | BTP-TW | 1 | 1 |
| Tư vấn viên 03 (BNI) | STP-BNI | (workload TVV-03) | 2 |

### Actual

Bảng chỉ hiện **1 row**:

| Họ tên | Email | Workload | Ưu tiên |
|---|---|---|---|
| CB Nghiệp vụ TW 01 | cb_nv_tw_01@htpldn.test | 1 yêu cầu | 1 |

Snapshot:
```
uid=45_15 StaticText "Gợi ý phân công"
uid=45_17 StaticText "Họ tên" / "Email" / "Workload" / "Ưu tiên"
uid=45_21 radio " "
uid=45_23 StaticText "CB Nghiệp vụ TW 01"
uid=45_24 StaticText "cb_nv_tw_01@htpldn.test"
uid=45_25 StaticText "1"
uid=45_27 StaticText "1"
(không có row thứ 2)
```

### Impact

- Workflow phân công cross-cấp (TW phân công cho TVV/CG đơn vị) **KHÔNG hoạt động qua bảng gợi ý**.
- User phải chuyển sang dropdown "Người xử lý" và search tay → không tận dụng được mapping FR-II-NEW-01.
- **Side effect**: BUG này gián tiếp khiến không thể test ERR-PC-01 (TVV bị Tạm dừng disabled) — vì TVV không hiện trong bảng → không test được hàng disabled.

### Possible root cause

Backend `GET /api/v1/hoi-daps/{id}/goi-y-phan-cong` (hoặc tương đương) có thể đang filter theo `don_vi_id` của HD thay vì truy vấn full mapping `CAU_HINH_PHAN_CONG WHERE linh_vuc_id = X`.

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § SCR-II-03 hàng 4 (Bảng gợi ý phân công) + FR-II-NEW-01 (Cấu hình lĩnh vực ↔ phân công) + AC #3.

**Trích dẫn SRS (đã verify với NotebookLM):**

> **SCR-II-03 hàng 4 — Bảng gợi ý phân công**
> Loại: `table (compact)`
> Dữ liệu: "**CB/TVV khớp lĩnh vực**: Radio chọn, Họ tên, Đơn vị, Lĩnh vực chuyên môn, Workload hiện tại, Mức ưu tiên (từ `CAU_HINH_PHAN_CONG.uu_tien`).
> **Sắp xếp: `uu_tien` ASC → `workload` ASC**"

> **FR-II-NEW-01 Acceptance Criteria #3**
> "Given CB NV phân công câu hỏi lĩnh vực X **When** gợi ý **Then** ưu tiên CB/TVV đã map"

> **FR-II-NEW-01 Mô tả**
> "Cấu hình mapping giữa lĩnh vực PL và CB/TVV phụ trách. Khi phân công (FR-II-06), hệ thống gợi ý CB/TVV đã map."

**Kết luận:** SRS không giới hạn bảng gợi ý theo `don_vi_id` của HD; phải truy vấn **toàn bộ mapping `CAU_HINH_PHAN_CONG WHERE linh_vuc_id = X`** rồi sắp xếp theo `uu_tien` ASC. Lĩnh vực Thuế có 2 mapping → phải hiện 2 row. Bug được xác nhận.

---

## BUG-FR02-010 — Thiếu nút "Đóng hồ sơ" trên trạng thái DA_DUYET

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **Priority** | P1 |
| **Status** | Open |
| **Component** | Frontend — SCR-II-02 action toolbar |
| **FR liên quan** | FR-II-08 (Quản lý công khai phản hồi) |
| **SRS Reference** | SCR-II-02 hàng 18: "Nút Đóng hồ sơ → C12 → SET HOAN_THANH" — visibility = `khi DA_DUYET/CONG_KHAI` |
| **Phát hiện lúc** | 2026-04-29 15:31 |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

Theo SRS §SCR-II-02 hàng 18, nút **"Đóng hồ sơ"** phải hiển thị khi HD ở trạng thái `DA_DUYET` **hoặc** `CONG_KHAI`. Tuy nhiên, trên record `HD-20260429-001` đã DA_DUYET, action toolbar chỉ hiển thị **1 nút "Công khai lên Cổng PLQG"** — không có "Đóng hồ sơ".

→ Workflow rút gọn (skip CONG_KHAI, đóng trực tiếp DA_DUYET → HOAN_THANH) **không thực hiện được trên UI**. Đặc biệt nghiêm trọng khi API Cổng PLQG fail liên tục (xem BUG-FR02-011) — record vĩnh viễn kẹt ở DA_DUYET không thể đóng.

### Steps to reproduce

1. Đăng nhập `cb_pd_tw_01`.
2. Mở chi tiết HD bất kỳ ở trạng thái **Đã duyệt** (ví dụ `HD-20260429-001`).
3. Quan sát action toolbar phía trên.

### Expected

Action toolbar hiện ít nhất 2 nút:
- **Công khai lên Cổng PLQG** (transition DA_DUYET → CONG_KHAI)
- **Đóng hồ sơ** (transition DA_DUYET → HOAN_THANH, theo SM-HOIDAP)

### Actual

Action toolbar chỉ hiện **1 nút**:
```
uid=54_0 button "Công khai lên Cổng PLQG"
```

### Impact

Kết hợp với BUG-FR02-011 (API Cổng PLQG 502 silent fail), record sẽ vĩnh viễn kẹt ở `DA_DUYET` trên môi trường không có mock Cổng PLQG.

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § SCR-II-02 hàng 18 (Nút "Đóng hồ sơ").

**Trích dẫn SRS (đã verify với NotebookLM):**

> **SCR-II-02 hàng 18 — Nút "Đóng hồ sơ"**
> Loại: `button (secondary)`
> Hành vi: "→ C12 'Đóng hồ sơ? Hồ sơ sẽ không thể chỉnh sửa.' → **SET HOAN_THANH**"
> **Điều kiện hiển thị: khi `DA_DUYET` / `CONG_KHAI`**

**Kết luận:** SRS yêu cầu nút "Đóng hồ sơ" PHẢI hiển thị ở cả 2 trạng thái `DA_DUYET` và `CONG_KHAI`. Trên record `HD-20260429-001` (DA_DUYET), nút bị thiếu → vi phạm SRS. Bug được xác nhận.

---

## BUG-FR02-011 — POST /cong-khai trả 502 nhưng UI không thông báo lỗi

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **Priority** | P1 |
| **Status** | Open |
| **Component** | Frontend (UX) + Backend (502) — SCR-II-02 nút Công khai |
| **FR liên quan** | FR-II-08 (Quản lý công khai), EC-04 (KHÔNG set CONG_KHAI trước khi API thành công) |
| **SRS Reference** | EC-04, ERR-PD-04 ("Lỗi kết nối Cổng PLQG. Vui lòng thử công khai lại") |
| **Phát hiện lúc** | 2026-04-29 15:31 |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

Khi CB PD click **"Công khai lên Cổng PLQG"** → confirm dialog → click "Công khai":
- ✅ **Phía backend**: trả `502 Bad Gateway` (do env không có mock API Cổng PLQG). Trạng thái HD GIỮ `DA_DUYET` — đúng EC-04.
- ❌ **Phía frontend**: KHÔNG hiển thị toast/modal lỗi cho user. Confirm dialog đóng im lặng. User tưởng thành công.

→ User không biết là Công khai đã fail, không biết phải thử lại.

### Steps to reproduce

1. Đăng nhập `cb_pd_tw_01`.
2. Mở HD trạng thái `Đã duyệt` (ví dụ `HD-20260429-001`).
3. Click nút **"Công khai lên Cổng PLQG"**.
4. Trong confirm dialog "Công khai lên Cổng PLQG?" → click **Công khai**.

### Expected

- Toast/modal lỗi: **"Lỗi kết nối Cổng PLQG. Vui lòng thử công khai lại"** (đúng theo SRS ERR-PD-04).
- Trạng thái GIỮ `DA_DUYET` (đúng EC-04 — đã PASS phía backend).
- User có thể thử lại.

### Actual

- Confirm dialog đóng im lặng.
- Trạng thái GIỮ `DA_DUYET` (✅ EC-04 backend PASS).
- KHÔNG có toast lỗi.
- KHÔNG có console error visible cho user.

### Evidence

**Network log:**
```
reqid=372 POST /api/v1/hoi-daps/b818cc40-a18c-43f3-9593-b72290122501/cong-khai → 502
   (record: HD-20260429-001 / cb_pd_tw_01 / 2026-04-29 15:31)
```

### Note backend

EC-04 backend đã PASS (KHÔNG set CONG_KHAI trước khi API thành công, giữ DA_DUYET nếu API fail). Bug chỉ nằm ở **frontend UX feedback** + **backend 502 thực tế** (do env thiếu mock API Cổng PLQG). Trên prod nếu Cổng PLQG live, 502 sẽ không xảy ra — nhưng **frontend vẫn cần handle lỗi 5xx gracefully**.

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG (frontend UX)

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § FR-II-08 — Edge Case `EC-04` + Error Handling `ERR-PD-04` + SCR-II-02 hàng 16 (Nút Công khai).

**Trích dẫn SRS (đã verify với NotebookLM):**

> **EC-04 — Công khai: API Cổng PLQG fail nhưng DB đã cập nhật**
> "KHÔNG set `CONG_KHAI` trước khi API thành công. **Giữ `DA_DUYET` nếu API fail**"

> **ERR-PD-04 — API Cổng PLQG lỗi**
> "Lỗi kết nối Cổng PLQG. Vui lòng thử công khai lại" — Severity: ERROR

> **SCR-II-02 hàng 16 — Nút "Công khai"**
> "→ C12 → Gọi API trực tiếp Cổng PLQG. KHÔNG set `CONG_KHAI` trước API OK (EC-04). **API fail → ERR-PD-04**"

**Kết luận:** Backend behavior (giữ DA_DUYET) PASS đúng EC-04. Tuy nhiên SRS yêu cầu khi API fail PHẢI hiển thị `ERR-PD-04` (severity ERROR, message rõ ràng) cho user — frontend hiện tại đóng dialog im lặng → **vi phạm Error Handling spec**. Bug được xác nhận ở phía frontend UX.

---

## BUG-FR02-001 — Cột "SLA / Thời hạn" hiện "—" cho HD trạng thái MOI

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **Priority** | P2 |
| **Status** | Open |
| **Component** | Backend — Logic tính `deadline_sla` khi tạo HD; Frontend — cột hiển thị |
| **FR liên quan** | FR-II-01 (Quản lý thông tin hỏi đáp) — Processing step 9 |
| **SRS Reference** | FR-II-01 step 9: "Tính deadline SLA từ cấu hình SLA (loại = 'HOI_DAP')" — phải tính khi TẠO MỚI |
| **Phát hiện lúc** | 2026-04-29 15:26 |
| **Reproduce rate** | 1/1 (100%) confirmed; thêm 4 records seed cũ trạng thái MOI cũng đều hiện "—" |

### Mô tả

Theo SRS FR-II-01 Processing step 9, hệ thống phải **tính `deadline_sla` ngay khi tạo bản ghi HOI_DAP** (state MOI). Tuy nhiên:
- Khi tạo HD mới, cột "SLA / Thời hạn" trong list view hiển thị **"—"** thay vì giá trị deadline.
- Chỉ sau khi click **Tiếp nhận** (state TIEP_NHAN), cột mới hiện "Còn N ngày LV".

→ Có 2 khả năng:
1. **Backend bug**: deadline_sla không được tính khi tạo MOI, chỉ tính khi Tiếp nhận (vi phạm step 9).
2. **Frontend bug**: deadline đã có nhưng UI ẩn vì không có ngày tiếp nhận.

### Steps to reproduce

1. Đăng nhập `cb_nv_tw_01`.
2. Vào `/hoi-dap` → click **Thêm mới** → fill đủ field bắt buộc (Nội dung, Lĩnh vực Thuế, Kênh Trực tiếp) → **Lưu**.
3. Quan sát record vừa tạo trong list, cột "SLA / Thời hạn".

### Expected

Cột hiện "Còn 12 ngày LV" (hoặc deadline date) — tính từ `ngày_tao + 10 ngày làm việc` theo cấu hình SLA `HOI_DAP` ở Item 2 seed data.

### Actual

| Mã HD | Trạng thái | Cột Thời hạn |
|---|---|---|
| HD-20260429-001 (mới tạo) | Mới | **—** |
| HD-20260424-004 (seed cũ) | Mới | **—** |
| HD-20260424-003 (seed cũ) | Mới | **—** |
| HD-20260424-001 (seed cũ) | Tiếp nhận | Còn 7 ngày LV ✅ |

### Evidence

Sau khi click Tiếp nhận, deadline xuất hiện = `15/05/2026 15:27` (ngày tiếp nhận `29/04/2026 15:27` + 10 ngày LV + cuối tuần = đúng 12 ngày calendar). Logic tính có hoạt động, chỉ thiếu trigger khi tạo MOI.

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § FR-II-01 (Quản lý thông tin hỏi đáp) — Processing — Thêm mới — Bước 9 + BR-CALC-03.

**Trích dẫn SRS (đã verify với NotebookLM):**

> **FR-II-01 — Processing — Thêm mới**
> | Bước | Mô tả xử lý | BR áp dụng |
> | 5 | Đặt trạng thái = `MOI` | SM-HOIDAP |
> | 7 | Tạo bản ghi `HOI_DAP` | BR-DATA-03 |
> | **9** | **Tính `deadline_sla` từ cấu hình SLA (loại = 'HOI_DAP')** | **BR-CALC-03** |
> | 10 | Ghi nhật ký thao tác | BR-DATA-05 |

> **BR-CALC-03 — Deadline ngày làm việc**
> Công thức: `Ngày tạo + N ngày làm việc` (T2–T6, bỏ qua ngày lễ + nghỉ bù).

**Kết luận:** SRS đặc tả rõ Bước 9 thuộc luồng "Thêm mới" — nghĩa là `deadline_sla` PHẢI được tính ngay khi record vừa tạo (state `MOI`), KHÔNG phải đợi tới `TIEP_NHAN`. Bug được xác nhận. (Lưu ý: nếu BE đã tính nhưng FE ẩn vì thiếu `ngay_tiep_nhan` thì là bug FE; root cause cần dev xác nhận.)

---

## BUG-FR02-005 — Field "Nội dung phản hồi" dùng plain textarea thay vì WYSIWYG rich-text editor

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium (feature missing) |
| **Priority** | P2 |
| **Status** | Open — Cần CĐT review xem giữ plain hay implement rich-text |
| **Component** | Frontend — Form Soạn phản hồi inline trên SCR-II-02 |
| **FR liên quan** | FR-II-07 (Phản hồi câu hỏi) |
| **SRS Reference** | SCR-II-02 hàng 20: "Nội dung phản hồi * — `rich-text-editor`. Bắt buộc khi gửi. WYSIWYG, max 5.000 ký tự" |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

Theo SRS, field "Nội dung phản hồi" phải là **rich-text editor WYSIWYG** (cho phép format in đậm, in nghiêng, gạch chân, danh sách, link...). Tuy nhiên app hiện đang dùng **plain `<textarea>` HTML** không có toolbar formatting.

Phản hồi pháp lý cần định dạng (highlight điều khoản, đánh số danh sách, link tới VBPL) → dùng plain text giảm chất lượng output đáng kể.

### Steps to reproduce

1. Đăng nhập `cb_nv_tw_01`.
2. Mở HD trạng thái `Đang xử lý` (HD-20260424-005 hoặc tạo mới + tiếp nhận + phân công).
3. Quan sát section "Soạn phản hồi" inline.

### Expected

Field "Nội dung phản hồi *" là rich-text editor (TinyMCE / CKEditor / Quill / hoặc tương đương) với toolbar:
- Bold / Italic / Underline
- Numbered list / Bullet list
- Link
- Heading
- Counter "0 / 5000"

### Actual

```html
<textarea placeholder="Nhập nội dung phản hồi..." />
```

Plain textarea, không có toolbar. Counter có ("0 / 5000") nhưng nội dung chỉ là plain text.

### Decision needed

Có 2 hướng:
1. **CĐT confirm SRS đúng** → implement rich-text editor (TinyMCE/Quill, ~1-2 tuần dev).
2. **CĐT confirm app hiện đúng** → cập nhật SRS xuống plain textarea, đóng bug.

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG (deviation từ SRS, cần CĐT review)

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § SCR-II-02 hàng 20 (Nội dung phản hồi).

**Trích dẫn SRS (đã verify với NotebookLM):**

> **SCR-II-02 hàng 20 — Nội dung phản hồi `*`**
> Loại: **`rich-text-editor`**
> Dữ liệu / Nội dung: "Bắt buộc khi gửi. **WYSIWYG**, max 5.000 ký tự. ERR-PH-01"
> Điều kiện hiển thị: khi soạn phản hồi

**Kết luận:** SRS đặc tả CHÍNH XÁC component type là `rich-text-editor` (WYSIWYG). App đang dùng plain `<textarea>` HTML → vi phạm spec. Tuy nhiên đây là feature gap có thể accept trade-off, do đó báo Medium + cần CĐT decision (giữ SRS hoặc cập nhật SRS xuống textarea).

---

## BUG-FR02-006 — Thiếu checkbox "Đã trả lời" → BR-FLOW-01 dùng nút "Gửi phản hồi" + confirm dialog

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium (UX deviation, logic tương đương) |
| **Priority** | P2 |
| **Status** | Open — Cần CĐT review |
| **Component** | Frontend — Form Soạn phản hồi |
| **FR liên quan** | FR-II-07, BR-FLOW-01 (Auto-transition Đã trả lời → Chờ PD) |
| **SRS Reference** | SCR-II-02 hàng 24: "Checkbox Đã trả lời — Tick → auto-transition DA_TRA_LOI → CHO_PHE_DUYET" |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

SRS đặc tả workflow:
- User nhập nội dung phản hồi.
- Tick **checkbox "Đã trả lời"** → trigger BR-FLOW-01 → auto chuyển CHO_PHE_DUYET.
- Có thêm nút **"Lưu nháp"** giữ DANG_XU_LY (không tick checkbox).

App thực tế:
- Không có checkbox "Đã trả lời".
- Có 2 nút: **"Lưu nháp"** + **"Gửi phản hồi"**.
- Click "Gửi phản hồi" → confirm dialog "Sau khi gửi, hồ sơ sẽ chuyển sang trạng thái Chờ phê duyệt. Bạn có chắc?" → CHO_PHE_DUYET.

→ Logic kết quả tương đương (đều chuyển CHO_PHE_DUYET) nhưng UX khác hẳn SRS.

### Steps to reproduce

1. Đăng nhập `cb_nv_tw_01`.
2. Mở HD `DANG_XU_LY` → form Soạn phản hồi inline.
3. Quan sát các control phía dưới content.

### Expected (theo SRS)

```
[textarea Nội dung phản hồi *]
[textarea Văn bản pháp luật]
[textarea Gợi ý cho doanh nghiệp]
[file upload File đính kèm]
[ ] Đã trả lời                         ← checkbox
[Lưu nháp] [Gửi phản hồi]
```

### Actual

```
[textarea Nội dung phản hồi *]
[textarea Văn bản pháp luật]
[textarea Gợi ý cho doanh nghiệp]
(KHÔNG có file upload — xem BUG-FR02-EXTRA01)
(KHÔNG có checkbox "Đã trả lời")
[Lưu nháp] [Gửi phản hồi]
```

### Decision needed

CĐT chọn 1 trong 2:
1. **Giữ app hiện tại** → cập nhật SRS, đóng bug. (App approach gọn hơn.)
2. **Giữ SRS** → thêm checkbox "Đã trả lời", "Gửi phản hồi" chỉ submit khi tick.

### 📚 Tham chiếu SRS — Verdict: ⚠️ DEVIATION từ SRS, logic tương đương — Cần CĐT decide

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § SCR-II-02 hàng 24, 25, 26 + BR-FLOW-01 + FR-II-07.

**Trích dẫn SRS (đã verify với NotebookLM):**

> **SCR-II-02 hàng 24 — Checkbox "Đã trả lời"**
> Loại: `checkbox`
> Hành vi: "Tick → **auto-transition `DA_TRA_LOI` → `CHO_PHE_DUYET`** (BR-FLOW-01). Cảnh báo trước khi tick"

> **SCR-II-02 hàng 25 — Nút "Lưu nháp"** — "Lưu/cập nhật phản hồi, giữ trạng thái `DANG_XU_LY`. KHÔNG trigger auto-transition"

> **SCR-II-02 hàng 26 — Nút "Gửi phản hồi"** — "Validate `noi_dung` not blank → `INSERT PHAN_HOI`. **Nếu 'Đã trả lời' = true: AUTO SET `CHO_PHE_DUYET`** + gửi TB CB PD"

> **BR-FLOW-01 — Auto-transition Đã trả lời → Chờ PD**
> "Khi CB NV tích 'Đã trả lời' trên hỏi đáp, hệ thống TỰ ĐỘNG chuyển trạng thái sang 'Chờ phê duyệt' (KHÔNG cần bước 'Trình')"

**Kết luận:** SRS quy định model 3 control: `[Checkbox Đã trả lời]` + `[Lưu nháp]` + `[Gửi phản hồi]`, trong đó auto-transition trigger qua **checkbox**. App hiện gộp logic vào `[Gửi phản hồi]` + confirm dialog → **logic kết quả tương đương** (đều tạo `PHAN_HOI` + chuyển `CHO_PHE_DUYET`) nhưng **UX deviation**. Đây là deviation hợp lệ về implementation, cần CĐT review (recommend giữ app hiện tại + cập nhật SRS, vì app approach đơn giản hơn cho user).

---

## BUG-FR02-008 — Backend trả 403 cross-cấp, frontend không hiển thị thông báo

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium (UX) |
| **Priority** | P2 |
| **Status** | Open |
| **Component** | Frontend — Error handler cho API 403 |
| **FR liên quan** | BR-AUTH-05 (Phê duyệt cùng cấp), BR-AUTH-08 (phạm vi đơn vị) |
| **SRS Reference** | ERR-PD-01 ("Bạn không có quyền phê duyệt bản ghi thuộc đơn vị khác cấp") |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

Khi user khác cấp đơn vị (vd `cb_pd_dp_01` Sở TP An Giang) navigate trực tiếp đến URL chi tiết HD cấp TW (`/hoi-daps/{id-tw-record}`):
- ✅ **Backend đúng**: GET `/api/v1/hoi-daps/{id}` trả `403 Forbidden`.
- ❌ **Frontend sai**: Main panel rỗng, KHÔNG hiển thị thông báo lỗi nào (không toast, không banner, không redirect).

→ User thấy trang trắng, bối rối không biết tại sao.

### Steps to reproduce

1. Đăng nhập `cb_pd_dp_01` / `Secret@123`.
2. Trên thanh address bar, paste URL HD cấp TW: `http://103.172.236.130:3000/hoi-dap/3581e70c-1cd8-4a5c-9ef7-fcba33277334` (HD-20260428-001 cấp TW).
3. Quan sát main panel.

### Expected

- Backend trả 403 (hiện tại đã đúng).
- Frontend hiển thị banner lỗi: **"Bạn không có quyền truy cập hỏi đáp này. Vui lòng liên hệ quản trị nếu cần hỗ trợ."** (theo style ERR-PD-01).
- Hoặc redirect về danh sách + toast lỗi.

### Actual

```
uid=31_27 main
  (rỗng — không có content)
```

Header banner vẫn hiện, sidebar vẫn hiện, nhưng toàn bộ main content rỗng.

### Evidence

**Network log:**
```
reqid=343 GET /api/v1/hoi-daps/{id}/phan-hois → 200
reqid=344 GET /api/v1/hoi-daps/{id}          → 403
reqid=345 GET /api/v1/hoi-daps/{id}          → 403
```

⚠ **Note**: `phan-hois` endpoint trả 200 trong khi parent `hoi-daps/{id}` trả 403. Cần xác minh response body của `phan-hois` có rỗng không (xem mục Follow-up dưới).

### 📚 Tham chiếu SRS — Verdict: ✅ ĐÚNG LÀ BUG (frontend UX)

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` § BR-AUTH-08 (Phân quyền dữ liệu theo đơn vị) + ERR-AUTH-01 (lỗi 403 chung CMS) + ERR-TN-02 (record không tồn tại / out-of-scope).

**Trích dẫn SRS (đã verify với NotebookLM):**

> **BR-AUTH-08 — Phân quyền dữ liệu theo đơn vị**
> Backend tự động ép `WHERE don_vi_id IN (scope của user)` vào mọi query. User out-of-scope sẽ không thấy record.

> **ERR-AUTH-01 — User không có quyền (lỗi 403 chung CMS)**
> Phản hồi hệ thống: "Bạn không có quyền thực hiện chức năng này" — Severity: ERROR

> **ERR-TN-02 — Bản ghi không tồn tại**
> Phản hồi hệ thống: "Hỏi đáp không tồn tại hoặc đã bị xóa" — Severity: ERROR

> **ERR-PD-01 — CB PD khác cấp** (CHỈ áp dụng cho action Phê duyệt)
> "Bạn không có quyền phê duyệt bản ghi thuộc đơn vị khác cấp"

**Kết luận:** SRS KHÔNG có ERR code riêng cho VIEW cross-cấp (ERR-PD-01 chỉ dùng cho action phê duyệt). Khi BE trả 403 cho GET detail, FE phải hiển thị **`ERR-AUTH-01` "Bạn không có quyền thực hiện chức năng này"** (lỗi 403 chung); hoặc theo BR-AUTH-08 (data scoping) thì đáng lẽ BE phải trả 404 → FE hiển thị **`ERR-TN-02` "Hỏi đáp không tồn tại hoặc đã bị xóa"**. Hiện FE để main panel rỗng → vi phạm UX spec, bug được xác nhận.

> ⚠ **Đề xuất cập nhật bug**: Sửa `SRS Reference` từ `ERR-PD-01` → `ERR-AUTH-01` (hoặc `ERR-TN-02`) cho chính xác. ERR-PD-01 chỉ áp dụng cho thao tác Phê duyệt cross-cấp.

---

## BUG-FR02-007 — Banner header sai đơn vị cho user cấp ĐP

| Field | Value |
|-------|-------|
| **Severity** | 🟢 Low (cosmetic) |
| **Priority** | P3 |
| **Status** | Open |
| **Component** | Frontend — Header banner component |
| **FR liên quan** | FR-VIII (Quản trị hệ thống) — hiển thị đơn vị user |
| **Reproduce rate** | 1/1 (100%) |

### Mô tả

User `cb_pd_dp_01` thuộc đơn vị **Sở Tư pháp An Giang** (STP-AG, cấp ĐP), nhưng banner header hiển thị **"Bộ Tư pháp — Cục Bổ trợ tư pháp"** (đơn vị cấp TW). Tên user phía phải đúng ("CB PD DP 01 (AG)"), chỉ banner sai.

### Steps to reproduce

1. Đăng nhập `cb_pd_dp_01` / `Secret@123` (Sở Tư pháp An Giang).
2. Vào dashboard hoặc bất kỳ trang nào.
3. Quan sát banner header phía trên.

### Expected

Banner hiện: **"Sở Tư pháp An Giang"** (hoặc tên đầy đủ đơn vị user theo `donVi`).

### Actual

Banner luôn hiện **"Bộ Tư pháp — Cục Bổ trợ tư pháp"** (cấp TW) bất kể đơn vị thực của user.

### Evidence

```
uid=31_22 StaticText "Bộ Tư pháp — Cục Bổ trợ tư pháp"   ← banner sai
...
uid=31_25 StaticText "CB PD DP 01 (AG)"                    ← user đúng
uid=31_26 StaticText "CB_PD_DP"
```

User profile từ sessionStorage `auth-store.userInfo` có:
```json
{
  "donViId": "...",
  "capDonVi": "DP",  // ← phải dùng để render banner
  "vaiTro": ["CB_PD_DP"]
}
```

Backend trả đủ `capDonVi`, frontend chưa map qua banner.

### 📚 Tham chiếu SRS — Verdict: ⚠️ BUG UX hợp lý nhưng KHÔNG có spec rõ ràng trong SRS

**Mục SRS liên quan:** `srs-fr-02-hoi-dap.md` không có spec; SRS gốc § 3.1.1 UI-02 (Layout tổng thể) + UI-03 (Navigation) — chi tiết giao cho `ux-spec.md` Section 3.1.

**Trích dẫn SRS (đã verify với NotebookLM):**

> **UI-02 — Layout tổng thể**
> "Thanh trên 56px + Thanh bên 260px (thu gọn 64px) + Vùng nội dung cuộn được. Lưới 12 cột co giãn"
> Tham chiếu UX-Spec Section 3.1 (chi tiết Header)

> **SCR-VIII-07 — Đăng nhập**
> Hiển thị "Logo chính phủ + 'Phần mềm Hỗ trợ Pháp lý Doanh nghiệp'" — KHÔNG đặc tả dynamic theo đơn vị user.

**Kết luận:** SRS **KHÔNG có quy định rõ** banner header phải dynamic theo `donVi/capDonVi` của user, cũng KHÔNG có quy định fix cứng "Bộ Tư pháp - Cục Bổ trợ tư pháp". Detail layout giao cho `ux-spec.md` (out-of-scope SRS).

→ Đây là **bug UX hợp lý từ góc độ thiết kế đa cấp** (TW/BN/ĐP) nhưng **chưa có hard requirement** trong SRS. Cần đối chiếu `ux-spec.md` Section 3.1 để xác nhận spec; nếu UX-Spec cũng không có thì cần CĐT raise requirement mới. Severity Low (cosmetic) là phù hợp.

---

## Tham chiếu

- Smoke report đầy đủ: [SMOKE-REPORT.md](../../smoke-fr02/smoke-report.md)
- UI button matrix: [ui-button-matrix.md](../../smoke-fr02/ui-button-matrix.md)
- SRS gốc: [srs-fr-02-hoi-dap.md](../../../input/srs/srs-v3/srs-fr-02-hoi-dap.md)
- Seed data precondition: [seed-data-precondition-report.md](../../../seed-data-precondition-report.md)
- Test accounts dùng:
  - `cb_nv_tw_01` (CB_NV_TW, BTP-TW) — happy path creator
  - `cb_pd_tw_01` (CB_PD_TW, BTP-TW) — phê duyệt cùng cấp
  - `cb_pd_dp_01` (CB_PD_DP, STP-AG) — test cross-cấp
  - `dn_01` (DN, STP-AG) — KHÔNG đăng nhập CMS được (toast: "Tài khoản DN tương tác qua API chuyên trang")
- Test data tạo trong smoke (chưa cleanup):
  - HOI_DAP `b818cc40-a18c-43f3-9593-b72290122501` / mã `HD-20260429-001` (kẹt ở DA_DUYET vì BUG-FR02-010 + BUG-FR02-011)
  - PHAN_HOI #1 đã gửi: nội dung 361 ký tự về thủ tục hoàn thuế GTGT

## Evidence

| File | Mô tả |
|------|-------|
| [01-scr-ii-01-tab-tat-ca.png](01-scr-ii-01-tab-tat-ca.png) | Tab "Tất cả" SCR-II-01 với cb_nv_tw_01 — verify 9 tab + filter-bar 7 control + bảng 9 cột + 10 records (chứng minh BUG-FR02-001: cột SLA hiện "—" cho HD-20260424-003/004 trạng thái Mới) |

*(Các bug còn lại có evidence là network logs + page snapshots đã ghi inline trong từng entry. Dev có thể tự reproduce theo "Steps to reproduce".)*

## Follow-up cần xác minh (potential security)

| ID | Mô tả | Action |
|---|---|---|
| FU-FR02-01 | Endpoint `GET /hoi-daps/{id}/phan-hois` trả 200 trong khi `GET /hoi-daps/{id}` trả 403 cho `cb_pd_dp_01` xem record cấp TW | Dev kiểm tra response body của `phan-hois`: nếu rỗng `[]` → OK; nếu trả full data → **Security Issue (Information Disclosure)** — cần fix backend để check quyền parent record trước |

---

## Limitations (không test được do môi trường)

| ID | Mô tả | Lý do |
|---|---|---|
| L1 | Không verify được transition `DA_DUYET → CONG_KHAI → HOAN_THANH` | Env không có mock API Cổng PLQG (502 fail) |
| L2 | Tab "Công khai" trống — không test được "Hủy công khai hàng loạt" | Hệ quả của L1 |
| L3 | Không test được DN portal create question | DN tài khoản tương tác qua API external, không đăng nhập CMS được |
| L4 | Không verify được ERR-PC-01 (TVV bị Tạm dừng disabled trong modal phân công) | Bảng gợi ý không expand đầy đủ mapping (BUG-FR02-009) → TVV không hiện trong bảng → không test được hàng disabled |
| L5 | Session timeout liên tục (~30-60s idle) gây re-login nhiều lần khi automation | Có thể là issue của env hoặc cookie httpOnly + isolatedContext của Chrome DevTools MCP. Cần verify session config phía backend (Redis TTL, JWT expire). |

---

## Lịch sử cập nhật

| Ngày | Tác giả | Thay đổi |
|------|---------|----------|
| 2026-04-29 | QA Automation | Tạo report sau smoke FR-02 (E2E + UI audit + 3 nhánh negative) |
