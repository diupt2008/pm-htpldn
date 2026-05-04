# Data Readiness — Module Quản lý Đào tạo, Tập huấn (Round 2)

**Ngày:** 2026-04-19
**Lệnh 2:** ✅ Done — check data readiness
**Lệnh 3:** 🚨 **ABORTED** — 2 app blockers + browse server unstable, KHÔNG tạo được data qua UI. Xem [§Lệnh 3 — Kết quả & Blockers](#lệnh-3--kết-quả--blockers).
**Account dùng:** `canbo_tw` / `Test@1234` (CB_NV cấp TW, Cục BTTP — Bộ Tư pháp)
**Môi trường:** http://103.172.236.130:3000/ — OTP bypass `666666`
**Tham chiếu:** [funtion/7.3-dao-tao-tap-huan.md](../../../funtion/7.3-dao-tao-tap-huan.md) §Data Readiness + §State Machine SM-KHOAHOC
**Schema:** tuân [test-strategy.md §7.0.1](../../../test-strategy.md#701-artifact-spec--data-readiness-reportmd)

---

## Tổng quan phát hiện

| Entity | Entry point sidebar | Rows trước | Verdict |
|--------|---------------------|-----------|---------|
| Chương trình đào tạo (CTDT) | ✅ `Quản lý đào tạo, tập huấn > Chương trình đào tạo` | **1** (state `CHO_DUYET`) | Một phần |
| Khóa học (KHOA_HOC) | ✅ `> Khóa học` — 9 tabs state | **0** tất cả tabs | THIẾU toàn bộ |
| Ngân hàng câu hỏi (NHCH) | ⚠️ Sidebar **disabled** (xám) cho CB_TW → click → `/403` | **BLOCKED** | BLOCKED — escalate |
| Giảng viên (GV) | ✅ `> Giảng viên` | **1** (Nguyễn Thành Công) | ĐỦ |
| Bài giảng (BAI_GIANG) | ❌ Không có entry độc lập — truy cập qua Khóa học detail | Không verify được (0 khóa học) | THIẾU (phụ thuộc KH) |
| Đăng ký đào tạo (DANG_KY_DT) | ❌ Không có entry độc lập — qua Khóa học detail | Không verify được | THIẾU (phụ thuộc KH) |
| Đề xuất đào tạo (DE_XUAT_DT) | ❌ Không thấy entry độc lập trong sidebar CB_TW | Không verify được | UNKNOWN — cần clarify UX/ngoài scope CMS |

---

## Schema 7 cột — per state (theo §7.0.1)

### Entity: KHOA_HOC (SM-KHOAHOC — 9 states)

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| DU_THAO | DT-020 (gửi phê duyệt) | 0 | — | — | canbo_tw (tạo khóa học mới thuộc CTDT hiện có) | **THIẾU** |
| CHO_DUYET | DT-021, DT-022 (duyệt / từ chối) | 0 | — | — | canbo_tw tạo → gửi phê duyệt (AT-01) | **THIẾU** |
| DA_DUYET | DT-023, DT-027, DT-028, DT-029 (diễn ra / công khai / hủy / immutability) | 0 | — | — | canbo_tw gửi + lanhdao_tw duyệt (BR-AUTH-05) | **THIẾU** |
| DA_CONG_KHAI | DT-027 (công khai Cổng PLQG) | 0 | — | — | Sau DA_DUYET + công khai API BR-FLOW-05 | **THIẾU** |
| DANG_DIEN_RA | DT-023 (khởi chạy đến ngày bắt đầu) | 0 | — | — | Hệ thống auto-transition theo ngày | **THIẾU** |
| DA_KET_THUC | DT-024 (trình duyệt KQ) | 0 | — | — | canbo_tw kết thúc lớp hoặc auto theo ngày | **THIẾU** |
| CHO_DUYET_KQ | DT-025, DT-026 (duyệt / từ chối KQ) | 0 | — | — | canbo_tw nhấn "Trình duyệt KQ" (AT-02) | **THIẾU** |
| HOAN_THANH | DT-031 (sinh chứng nhận) | 0 | — | — | lanhdao_tw duyệt KQ + HV đạt | **THIẾU** |
| HUY | DT-028 (hủy khóa học + notify HV) | 0 | — | — | canbo_tw hủy DA_DUYET khi chưa có đăng ký | **THIẾU** |

### Entity: CTDT (workflow 7 states — tabs CMS)

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| DU_THAO | DT-003 (tạo mới), DT-014, DT-015, DT-016 (negative) | 0 | — | — | canbo_tw tạo mới (auto-gen mã) | **THIẾU** |
| CHO_DUYET | DT-001, DT-002 (list + search) | **1** | — | `CTDT-BTP-TW-2026-0001` (tên: `sdsadf`, ngân sách 100.000) | — | **ĐỦ** (≥1) |
| DA_DUYET | DT-029 (immutability sau duyệt), DT-012 (xuất Excel DA_DUYET+) | 0 | — | — | lanhdao_tw duyệt CTDT `CHO_DUYET` hiện có | **THIẾU** |
| DANG_THUC_HIEN | DT-013 (xuất docx/PDF ký số) | 0 | — | — | Auto-transition sau công bố khóa con | **THIẾU** |
| HOAN_THANH | DT-013 | 0 | — | — | Toàn bộ KH con HOAN_THANH | **THIẾU** |
| HUY | DT-016 guard | 0 | — | — | canbo_tw hủy CTDT DU_THAO | **THIẾU** |

### Entity: NHCH — Ngân hàng câu hỏi

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| — (master data, ≥3 câu ≥1/loại TN1, TN-nhiều, Tự luận) | DT-008, DT-009, DT-018, DT-039 | **BLOCKED** | — | — | canbo_tw (nhưng sidebar disabled → click ra /403) | **BLOCKED — finding UI/permission** |

### Entity: GV — Giảng viên

| State | Test path cần | Rows trước | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|-------|---------------|-----------|-------------------|-----------|-------------|----------|
| DANG_PHAN_CONG (đang phân công) | DT-010, DT-039 | **1** | — | `Nguyễn Thành Công` (Chuyên ngành: Đòi ăn, Trình độ: Đại học, Vai trò: Giảng viên) | — | **ĐỦ** (≥1) |

### Entity: BAI_GIANG, DANG_KY_DT, DE_XUAT_DT (phụ thuộc KH)

| Loại | Test path cần | Rows trước | Kết luận |
|------|---------------|-----------|----------|
| Bài giảng (Slide/PDF/Video) | DT-005, DT-006, DT-007, DT-017, DT-038 | Không verify được — cần KH detail | **THIẾU** (phụ thuộc KH đang ở 0) |
| Đăng ký CHO_DUYET | DT-019 (EC-01 vượt sức chứa), DT-030 (duyệt/từ chối ĐK) | Không verify được | **THIẾU** |
| Đề xuất MOI (từ DN/NHT) | DT-040 (tiếp nhận đề xuất → tạo CTDT/KH) | Không verify được — không entry CMS độc lập | **UNKNOWN** — cần confirm UX với dev (có thể chỉ vào qua Khóa học/API DN) |

### Dữ liệu phi-workflow (chuẩn bị thủ công)

| Loại | Mục đích (TC) | Trạng thái | Ghi chú |
|------|---------------|-----------|---------|
| File PPTX/PDF ≤ 20MB | DT-005, DT-017 (upload bài giảng) | **Cần chuẩn bị** | Chuẩn bị trước Lệnh 4: 1 file PPTX hợp lệ ≤20MB + 1 file >20MB (âm tính ERR-BG-01) |
| URL YouTube hợp lệ + sai format | DT-006, DT-017 | **Cần chuẩn bị** | 1 URL YT chuẩn + 1 URL rác (âm tính ERR-BG-03) |
| File Excel kết quả (đúng template + sai format + mã HV lỗi) | DT-011 (import KQ — EC-03 concurrent lock) | **Cần chuẩn bị** | 3 file Excel (ERR-KQ-02, ERR-KQ-03) |
| Template đăng ký Excel | DT-030 flow | **Cần chuẩn bị** | Lấy từ nút "Tải mẫu" trong màn đăng ký nếu có |

---

## Dependency chain đề xuất cho Lệnh 3

```
(đã có) Danh mục lĩnh vực
  └── (đã có 1) CTDT-BTP-TW-2026-0001 @ CHO_DUYET
        ├── (cần) canbo_tw duyệt giùm? → KHÔNG, dùng lanhdao_tw duyệt → DA_DUYET
        └── (cần) Tạo Khóa học con (auto-gen KH-YYYYMMDD-SEQ)
              │── Walk SM-KHOAHOC:
              │    DU_THAO (tạo) → CHO_DUYET (gửi phê duyệt) → DA_DUYET (duyệt)
              │    → DA_CONG_KHAI (công khai) → DANG_DIEN_RA (ngày bắt đầu)
              │    → DA_KET_THUC (kết thúc) → CHO_DUYET_KQ (trình KQ)
              │    → HOAN_THANH (duyệt KQ)
              │    + 1 nhánh HUY (DA_DUYET → HUY khi chưa có đăng ký)
              └── Gắn ≥1 Giảng viên (đã có Nguyễn Thành Công) → OK
(song song) (cần) Tạo ≥3 câu hỏi ngân hàng (3 loại) — nhưng BLOCKED vì sidebar disable
(song song) (cần) Tạo ≥1 bài giảng Slide/PDF + ≥1 Video YouTube
(song song) (cần) Tạo ≥1 đăng ký CHO_DUYET (phụ thuộc có ≥1 KH DA_CONG_KHAI/DANG_DIEN_RA)
```

**Ước lượng khối lượng Lệnh 3:**
- Tối thiểu **8 khóa học** để mỗi state có ≥1 bản ghi (state nhánh HUY riêng, các state chính cần 1 KH walk full path + 1 KH dừng lại ở từng state giữa chừng, hoặc dùng khóa học giả lập ngày để nhảy state).
- Cách tối giản: tạo **3 khóa học**:
  1. KH-A: walk full DU_THAO → HOAN_THANH (đi qua tất cả state chính)
  2. KH-B: dừng ở CHO_DUYET để test DT-022 (từ chối)
  3. KH-C: đến DA_DUYET rồi HUY để test DT-028

---

## Kết luận & Khuyến nghị

### ✅ ĐỦ (có thể chạy ngay)
- Master data GV (Nguyễn Thành Công) → DT-010 tab lịch sử GV, DT-039 warning GV đang phân công — **OK**
- CTDT state `CHO_DUYET` (1 row `CTDT-BTP-TW-2026-0001`) → DT-001 list, DT-002 search — **OK**

### ⚠️ THIẾU (Lệnh 3 phải tạo)
- **Toàn bộ KHOA_HOC (9 states = 0 rows).** Chiếm 26/40 TC của module (DT-003 đến DT-031 trừ vài TC authorization). **Block hầu hết P0 workflow TC.**
- **CTDT các state khác (DU_THAO, DA_DUYET, DANG_THUC_HIEN, HOAN_THANH, HUY).** Block DT-029 immutability.
- **Bài giảng, Đăng ký, Đề xuất.** Block DT-005, DT-006, DT-007, DT-017, DT-019, DT-030, DT-038, DT-040.

### 🚨 BLOCKED (finding cần escalate trước Lệnh 3)
- **NHCH sidebar disabled (xám) cho `canbo_tw`** — click ra `/403 Bạn không có quyền truy cập trang này`. Theo [funtion/7.3 §Permission](../../../funtion/7.3-dao-tao-tap-huan.md) và permission-matrix §8.1, CB_NV cấp TW **phải có** quyền CRUD* trên CAU_HOI / DE_KIEM_TRA. **Đây là khác biệt giữa config hiện tại và SRS v3.1.**
  - **Tác động:** Block DT-008 (P0), DT-009, DT-018, DT-039 → **4 TC không chạy được ở Lệnh 4.**
  - **Options:**
    - (a) Escalate dev/PM: bật permission NHCH cho CB_TW/CB_BN/CB_DP.
    - (b) Test qua tài khoản khác (QTHT? admin?) — nhưng sẽ phá giả định role RBAC (không nên).
    - (c) Pre-block 4 TC, note trong functional report "BLOCKED: NHCH sidebar disabled for CB_NV, pending config fix".
  - **Khuyến nghị:** (a) + (c) kết hợp. Báo user/dev trước Lệnh 3.

### 📋 CHUẨN BỊ THỦ CÔNG TRƯỚC LỆNH 4
- 1× PPTX ≤ 20MB hợp lệ + 1× >20MB (test ERR-BG-01)
- 1× PDF hợp lệ
- URL YouTube chuẩn + URL rác (test ERR-BG-03)
- 3× Excel kết quả (đúng + sai format + mã HV lỗi — ERR-KQ-02, ERR-KQ-03)

### Diễn giải state CTDT
Tabs CTDT list quan sát được ở UI: **Tất cả | Dự thảo | Chờ duyệt | Đã duyệt | Đang thực hiện | Hoàn thành | Hủy** (7 tab — KHÁC SM-KHOAHOC 9 state vì CTDT là wrapper, không có `DA_CONG_KHAI / DANG_DIEN_RA / DA_KET_THUC / CHO_DUYET_KQ`). Cần note vào section §State Machine của funtion/7.3 để tránh nhầm.

---

## TC Pre-blocked matrix (dùng cho Lệnh 4)

| TC ID | Lý do pre-block | Cần Lệnh 3 tạo data? |
|-------|-----------------|----------------------|
| DT-008 | NHCH sidebar disabled cho canbo_tw (BLOCKED finding) | Không — cần escalate permission |
| DT-009 | Phụ thuộc DT-008 (cần câu hỏi) | Không — cần escalate |
| DT-018 | Phụ thuộc NHCH (ERR-NHCH-02 câu TN < 2 LC) | Không — cần escalate |
| DT-039 | Phụ thuộc NHCH (WRN-NHCH-01 xóa câu hỏi đang dùng) | Không — cần escalate |
| DT-004 → DT-007, DT-011, DT-017 → DT-031, DT-038, DT-040 | Thiếu khóa học + bài giảng + đăng ký + đề xuất | **Có** — Lệnh 3 tạo qua walk SM-KHOAHOC |
| DT-012, DT-013 | Thiếu CTDT DA_DUYET (xuất Excel/ký số) | **Có** — duyệt CTDT hiện có |
| DT-032 → DT-036 | Authorization smoke — không phụ thuộc data | Không — chạy song song Lệnh 4 |
| DT-037 | Cross-module CTDT ↔ Danh mục lĩnh vực | Không nếu danh mục đã có | 

---

## Evidence

| # | File | Mô tả |
|---|------|-------|
| 1 | [images/dt-after-login.png](images/dt-after-login.png) | Login canbo_tw → `/403` (CB_TW landing expected) |
| 2 | [images/dt-khoahoc-list.png](images/dt-khoahoc-list.png) | KH list `Tất cả` tab — "Không có khóa học nào phù hợp" |
| 3 | [images/dt-ctdt-list.png](images/dt-ctdt-list.png) | CTDT list — 1 row `CTDT-BTP-TW-2026-0001` |
| 4 | [images/dt-nhch.png](images/dt-nhch.png) | NHCH click → `/403 Bạn không có quyền` — sidebar "Ngân hàng câu hỏi" xám disabled |
| 5 | [images/dt-gv.png](images/dt-gv.png) | GV list — 1 row Nguyễn Thành Công |

## Ghi chú thực thi

- **Method:** `/browse` (Playwright headless) với atomic `$B chain` theo CLAUDE.md Rule 5.
- **Rule 7 crash:** Gặp 2 crash trong session (`Target page, context or browser has been closed` khi mở CTDT detail). Full cleanup + retry 1 lần per crash. Sau đó dừng khai thác CTDT detail để không vượt budget 10 phút của Lệnh 2.
- **Rule 8 session reset:** Đã verify `goto` mất cookie giữa bash invocations — chuyển sang sidebar click trong chain.
- **Test path count reference:** 40 TC total (P0: 14, P1: 24, P2: 2) theo funtion/7.3. Với data hiện tại: 2 TC có thể chạy ngay (DT-001, DT-002); 4 TC pre-blocked bởi NHCH finding; ~30 TC phụ thuộc Lệnh 3 tạo data; 5 TC authorization smoke độc lập.

---

## Lệnh 3 — Kết quả & Blockers

**Trạng thái:** 🚨 **ABORTED** (2026-04-19, time budget ~20 phút)
**Rows mới tạo:** **0** — KHÔNG tạo được bất kỳ Khóa học / CTDT DA_DUYET nào.
**Nguyên nhân:** Chuỗi app blocker + browse server instability (xem chi tiết bên dưới).

### Tóm tắt nỗ lực (theo thứ tự)

| # | Attempt | Account | Kết quả | Phân loại lỗi (Rule 9) |
|---|---------|---------|---------|------------------------|
| 1 | Login `lanhdao_tw` → mở CTDT `CHO_DUYET` detail (click "Xem") → duyệt CTDT (walk CHO_DUYET → DA_DUYET) | lanhdao_tw | ❌ Browse crash liên tục khi mở CTDT detail | REAL CRASH (`Target page, context or browser has been closed`) — retry 1 lần vẫn fail |
| 2 | Login `canbo_tw` → KH list → "Thêm mới" (kỳ vọng mở form tạo khóa học) | canbo_tw | ❌ URL chuyển `/dao-tao/khoa-hoc/tao-moi` → hiển thị **"Không tìm thấy khóa học"** (xem [images/dt3-kh-tao-moi-404.png](images/dt3-kh-tao-moi-404.png)) | **APP/FE BUG** — router treat `tao-moi` như ID khóa học, không có form tạo mới |
| 3 | Retry attempt 1 với wait dài (10s) + chain atomic | canbo_tw | ❌ Browse server "Unable to connect" — server stuck; hard-kill PID `bun run server.ts` (12894, 12926) vẫn không recover | Browse server stuck + app render chậm |

### Blockers phát hiện (cần escalate dev trước khi retry Lệnh 3)

#### 🚨 BUG-DT-01 — "Thêm mới" KH từ list page ra trang 404 (Critical, FE routing)
- **Bước repro:** Login `canbo_tw` → sidebar `Quản lý đào tạo, tập huấn > Khóa học` → click nút **"Thêm mới"** (hoặc nút có `+ Thêm mới`).
- **Expected:** Mở form/modal tạo khóa học mới (auto-gen mã `KH-YYYYMMDD-SEQ` theo BR-DATA-04, yêu cầu chọn CTDT cha).
- **Actual:** URL chuyển `/dao-tao/khoa-hoc/tao-moi`, trang hiển thị dòng đỏ **"Không tìm thấy khóa học"** + link "Quay lại danh sách". Hệ thống có vẻ đang parse `tao-moi` như `:id` route param và query DB, không match → 404 logic.
- **Evidence:** [images/dt3-kh-tao-moi-404.png](images/dt3-kh-tao-moi-404.png)
- **Severity:** **Critical** — **block toàn bộ khả năng tạo khóa học qua UI list page**.
- **Fix gợi ý:** Kiểm tra React Router config — `/dao-tao/khoa-hoc/:id` phải đặt sau `/dao-tao/khoa-hoc/tao-moi` hoặc thêm exact match cho route tạo mới.

#### 🚨 BUG-DT-02 — CTDT detail page crash browse (High, render/perf)
- **Bước repro:** Login `lanhdao_tw` hoặc `canbo_tw` → sidebar `Chương trình đào tạo` → row `CTDT-BTP-TW-2026-0001` → click nút **"Xem"**.
- **Expected:** Mở trang chi tiết CTDT, hiển thị tabs (thông tin chung / khóa học con / lịch sử / đính kèm) + nút `Gửi phê duyệt` / `Duyệt` (tùy role).
- **Actual:** Browse (Playwright) báo `Target page, context or browser has been closed` khoảng 2-4s sau click → URL về `about:blank`. Tái hiện đều mỗi session (≥3 lần). Không thể snapshot/interact.
- **Severity:** **High** — block walk CTDT workflow, block tạo khóa học con (phụ thuộc vào trang detail).
- **Phân loại Rule 9:** Ambiguous giữa REAL CRASH (Playwright target closed) và APP BUG (JS-heavy render crash page context). Có thể user manual test bằng trình duyệt thật để phân biệt.
- **Next step cho dev:** Kiểm tra console / network log thật trên Chrome/Edge khi mở CTDT detail — có thể page throw un-handled exception khiến tab crash.

#### ⚠️ BUG-DT-03 — Menu "Ngân hàng câu hỏi" bị disabled cho CB_NV (đã note ở Lệnh 2)
- Xem [§Kết luận & Khuyến nghị > BLOCKED](#-blocked-finding-cần-escalate-trước-lệnh-3). Block DT-008, DT-009, DT-018, DT-039.

### Schema cập nhật "Rows sau" = 0 cho tất cả state

> Không bản ghi nào được tạo ở Lệnh 3. Cột "Rows sau (Lệnh 3)" và "Sample ID" vẫn `—` cho tất cả state THIẾU, reflecting trạng thái thực tế.

### Impact lên Lệnh 4

| Hạng mục | TC có thể chạy | TC pre-blocked |
|----------|----------------|----------------|
| Happy path CTDT list/search | DT-001, DT-002 | — |
| Happy path GV CRUD | DT-010 | — |
| Authorization smoke | DT-032, DT-033, DT-034, DT-035, DT-036 | — |
| Cross-module CTDT ↔ Danh mục | DT-037 (nếu danh mục có ≥1 lĩnh vực) | — |
| **Tất cả KH workflow + KH state-based TC** | 0 | DT-004, DT-005, DT-006, DT-007, DT-011, DT-014, DT-015, DT-016, DT-017, DT-019, DT-020 → DT-031, DT-038 = **~22 TC** |
| **NHCH TC** | 0 | DT-008, DT-009, DT-018, DT-039 = **4 TC** |
| CTDT workflow (DA_DUYET+) | 0 | DT-012, DT-013, DT-029 = **3 TC** |
| Đề xuất ĐT | 0 | DT-040 = **1 TC** |

**Ước lượng:** ~**30/40 TC pre-blocked** khi chạy Lệnh 4 nếu không resolve BUG-DT-01/02/03.

### Khuyến nghị hành động cho user

1. **Escalate ngay BUG-DT-01 / BUG-DT-02 / BUG-DT-03 tới dev/PM.** 3 bug này block phần lớn TC.
2. **Chờ dev fix BUG-DT-01** (FE routing) → retry Lệnh 3 tạo KH trực tiếp từ list page.
3. **Song song: chờ dev fix BUG-DT-02** (CTDT detail crash) hoặc cung cấp **seed data SQL** để QA có KH ở các state cần (bypass UI creation).
4. **Chờ dev bật permission** Ngân hàng câu hỏi cho CB_NV (BUG-DT-03).
5. Có thể chạy **Lệnh 4 partial**: DT-001, DT-002, DT-010, DT-032-037 (~8 TC) ngay với data hiện có, để report bug BUG-DT-01/02 chính thức trong bug-report-dao-tao.md.

### Evidence mới (Lệnh 3)

| # | File | Mô tả |
|---|------|-------|
| 6 | [images/dt3-kh-tao-moi-404.png](images/dt3-kh-tao-moi-404.png) | BUG-DT-01: click "Thêm mới" → `/dao-tao/khoa-hoc/tao-moi` → "Không tìm thấy khóa học" |
