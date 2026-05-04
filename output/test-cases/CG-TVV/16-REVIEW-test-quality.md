# Test Quality Deep Review — CG-TVV (FR-IV)

> **Reviewer**: bmad-testarch-test-review (Master Test Architect mode)
> **Ngày review**: 2026-05-01
> **Source SRS**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095` (round 4 — verify AC, Postconditions, Outputs schema, Permission Matrix nguyên văn, SM-TVV diagram)
> **Scope**: 14 file TC trong [output/test-cases/CG-TVV/](.) (file 00 overview + 13 file UC + file 15 cross-cutting), tổng 217 TC.
> **Method**: Cross-check từng file với SRS NotebookLM nguyên văn — kiểm 5 axis: (1) TraceID accuracy, (2) Expected result fidelity (nguyên văn vs paraphrase), (3) Acceptance Criteria mapping, (4) Permission Matrix accuracy, (5) Coverage gap.

---

## TÓM TẮT EXECUTIVE

| Severity | Count | Mô tả |
|----------|------:|-------|
| 🔴 P0 Critical fix | **5** | Sai dữ liệu nguyên văn / Permission Matrix sai / suy diễn sai source |
| 🟡 P1 Major addition | **18** | Thiếu TC cho Outputs schema, AC mapping, Notification list cụ thể |
| 🟢 P2 Minor enhancement | **12** | Boundary missing, AC chưa map vào TC |
| 🆕 SRS Conflicts (mới phát hiện) | **3** | "3 tab" vs "5 tab" cho FR-IV-01, "4 tab" vs "5 tab" cho FR-IV-05, UC50 notification |
| **TỔNG action items** | **38** | |

**Quality score (0-10)**: **7.2/10** — Coverage tốt, structure chuẩn template, nhưng Permission Matrix overview cần fix 🔴 + 5 TC bịa source cần update.

---

## ⚠️ CRITICAL FIXES (P0 — fix trước khi execute)

### FIX-01 🔴 [00-test-plan-overview.md §2.3] — Permission Matrix SAI 3 entity

**SRS NGUYÊN VĂN (cite [23] — bảng 3.4.2 Permission Matrix CRUD):**

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|-----|-----|-----|-----|
| TU_VAN_VIEN | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | **—** | **—** | **R*** | **R*** |
| HO_SO_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | R* | R* | R* | **—** | **CRU*** | **R*** | **R*** |
| DANH_GIA_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | CRU* | CRU* | CRU* | **C†R*** | **—** | **—** | **—** |

**SAI hiện tại trong overview §2.3:**
- TU_VAN_VIEN: ghi "TVV: R*/U*", "CG: R*/U*", "NHT: R*/U*" → **SAI**. Đúng: TVV=`R*`, CG=`R*`, **NHT=`—`** (no access).
- HO_SO_TU_VAN_VIEN: ghi "TVV: R*/U*", "CG: R*/U*", "NHT: R*/U*" → **SAI**. Đúng: TVV=`R*`, CG=`R*`, NHT=`CRU*`.
- DANH_GIA_TU_VAN_VIEN: ghi "TVV: R, CG: R, NHT: R" → **SAI**. Đúng: TVV=`—`, CG=`—`, NHT=`—` (NO ACCESS), DN=`C†R*`.

**Tác động xuống TC:**
- TC-CG-204 (file 03 NHT đăng ký) — NHT đăng ký = INSERT TU_VAN_VIEN nhưng Permission Matrix nói NHT cho TU_VAN_VIEN=`—`. → SRS conflict thực sự (UC41 nói NHT tạo, Matrix nói no access). Cần thêm SPEC-CLARIFY-CG-54.
- File 04 UC42 — TVV/CG có quyền update HO_SO_TVV không? Per Matrix `R*` = read-only → KHÔNG có quyền update HO_SO. UC42 cite [22] Tác nhân: "NHT (sở hữu hồ sơ) / CB NV" → KHÔNG có TVV/CG. → File 04 phải verify rằng TVV/CG **KHÔNG** được hiển thị nút [Cập nhật năng lực] (per Matrix).
- File 09 UC47 đánh giá — TC-CG-801 nói DN đánh giá OK; nhưng Matrix DN=`C†R*` (Create với điều kiện †). Cần verify điều kiện † là gì.

**Action**: Sửa lại bảng §2.3 trong overview theo NGUYÊN VĂN. Thêm cột chú thích `*=scoped`, `†=conditional`. Bổ sung SPEC-CLARIFY-CG-54.

---

### FIX-02 🔴 [11-TC-FR-IV-11-nht-cap-nhat-ho-so.md TC-CG-1007 + TC-CG-1009] — Suy diễn SAI workflow "chờ duyệt"

**TC hiện tại** (TC-CG-1007 + TC-CG-1009) viết: "NHT cập nhật → 'chờ duyệt' (TVV tự cập nhật thông tin, **chờ duyệt** — cite [19])". Source này lấy từ overview procedure ref `1c462e23` cite [19].

**SRS NGUYÊN VĂN AC FR-IV-11 (cite [11])**:
> "Given NHT thay đổi thông tin When lưu Then **validate + cập nhật thành công, ghi audit log** / Given NHT lưu thành công When hệ thống xử lý xong Then **hiển thị thông tin đã cập nhật ở chế độ readonly để xác nhận**"

**SRS NGUYÊN VĂN Postconditions FR-IV-11 (cite [11])**:
> "Thông tin TVV được cập nhật. Nhật ký thao tác ghi nhận"

**SRS NGUYÊN VĂN Outputs FR-IV-11 (cite [11])**:
> success (boolean), updated_at (datetime, dd/mm/yyyy HH:mm)

**Phân tích**: AC + Postconditions + Outputs đều nói **CẬP NHẬT NGAY**, **không có "chờ duyệt"**. Cite [19] trong overview procedure là tóm tắt, không phải spec — không đủ nguồn để khẳng định workflow chờ duyệt.

**Tác động**: TC-CG-1007 và TC-CG-1009 đang test wrong behavior. Nếu app cập nhật ngay → 2 TC này sẽ FAIL nhầm.

**Action**:
- **Sửa TC-CG-1007** thành: "NHT cập nhật → áp dụng NGAY (không có 'chờ duyệt')". Expected: STATE UPDATE TU_VAN_VIEN ngay, AUDIT_LOG. UI: "Hiển thị thông tin đã cập nhật ở chế độ readonly để xác nhận" (NLM cite [11] AC nguyên văn). PERSIST: SCR-IV-01 reflect ngay.
- **XÓA TC-CG-1009** hoặc rename thành "Verify SRS-overview cite [19] vs FR-IV-11 AC: AC chính thức là cập nhật ngay, NO 'chờ duyệt'. Ghi SPEC-CLARIFY-CG-30 chốt: trust AC FR-IV-11."

---

### FIX-03 🔴 [07-TC-FR-IV-07-phe-duyet-tvv.md TC-CG-603] — THIẾU "CB NV" trong notification TU_CHOI

**TC hiện tại** TC-CG-603: "Notify NHT" cho từ chối.

**SRS NGUYÊN VĂN bảng SM-TVV (cite [20] trans 8)**:
> CHO_PHE_DUYET → TU_CHOI: Action = "**Thông báo CB NV + NHT**"

**Tác động**: TC-CG-603 chỉ verify NHT nhận notification, có thể miss bug nếu CB NV không nhận.

**Action**: Sửa TC-CG-603 expected PERSIST thành: "Notify **CB NV + NHT**" (NLM cite [20] trans 8 nguyên văn).

---

### FIX-04 🔴 [12-TC-FR-IV-12-cap-nhat-trang-thai-tvv.md TC-CG-1101..1105] — UC50 SRS KHÔNG đề cập notification, tránh tự bịa

**TC hiện tại** TC-CG-1101..1105 đều note "AUDIT_LOG hanh_dong='UPDATE_STATUS'" + một số có "Notify NHT".

**SRS NGUYÊN VĂN SM-TVV trans 10-14 (cite [20])**:
- DANG_HOAT_DONG → TAM_DUNG: Action = "**Audit log**" (KHÔNG nói notify)
- TAM_DUNG → DANG_HOAT_DONG: Action = "**Audit log**" (KHÔNG nói notify)
- DANG_HOAT_DONG → VO_HIEU_HOA: Action = "**Gỡ khỏi Cổng, audit**" (KHÔNG nói notify)
- TAM_DUNG → VO_HIEU_HOA: Action = "**Gỡ khỏi Cổng, audit**" (KHÔNG nói notify)
- VO_HIEU_HOA → DANG_HOAT_DONG: Action = "**Audit log**" (KHÔNG nói notify)

**SRS NGUYÊN VĂN Postconditions FR-IV-12 (cite [12])**: "Trạng thái TVV được cập nhật theo SM-TVV. **TVV bị vô hiệu hóa không thể được phân công vụ việc mới**. Tự động gỡ Cổng PLQG nếu vô hiệu hóa" — KHÔNG mention notification.

**Tác động**: TC verify "Notify NHT" cho UC50 sẽ FAIL nếu app không gửi notification (vì SRS KHÔNG yêu cầu).

**Action**:
- Bỏ "Notify NHT" khỏi expected của TC-CG-1101..1105 nếu có.
- Thêm SPEC-CLARIFY-CG-55: "UC50 SRS chỉ ghi audit log + tự gỡ Cổng PLQG; KHÔNG quote notification. BA confirm có cần notify TVV/NHT khi đổi trạng thái không."
- Thêm 1 TC mới riêng: "UC50 verify Postcondition cite [12] nguyên văn: TVV VO_HIEU_HOA không thể được phân công VV mới (verify cross-module với FR Vụ việc)."

---

### FIX-05 🔴 [00-test-plan-overview.md §2.5] — Số transition SM-TVV: 12 vs 14 (đếm thiếu)

**TC overview hiện tại** §2.5: "9 trạng thái + **12 chuyển đổi**".

**SRS NGUYÊN VĂN (cite [20])**: Bảng có **14 transition** (tính cả `[*] → MOI_DANG_KY` initial + 13 transition khác).

**Khác biệt**: Overview gộp `DANG_HOAT_DONG ↔ TAM_DUNG` thành 1 (thực tế 2 transition riêng) và gộp `DANG_HOAT_DONG/TAM_DUNG → VO_HIEU_HOA` thành 1 (thực tế 2). → Đếm 12 thay vì 14.

**Action**: Sửa overview §2.5 thành "9 trạng thái + **14 chuyển đổi**" + cập nhật bảng transition theo NGUYÊN VĂN cite [20] (kèm cột Trigger / Guard / Action / FR Ref / BR Ref).

---

## 🆕 SRS CONFLICTS PHÁT HIỆN MỚI (tracking SPEC-CLARIFY)

### CONFLICT-A: AC FR-IV-01 nói "3 tab" vs SCR-IV-01 cite [8] có "5 tab"

**Cite [1] AC FR-IV-01**: "...danh sách TVV thuộc đơn vị, **3 tab trạng thái**"

**Cite [8] SCR-IV-01 layout**: 5 tab cụ thể (Đang hoạt động, Tạm dừng, Mới đăng ký, Chờ thẩm định, Chờ phê duyệt)

→ **SPEC-CLARIFY-CG-56**: Số tab thực tế là 3 hay 5? AC viết tắt hay SCR là phiên bản mới hơn?

### CONFLICT-B: AC FR-IV-05 nói "4 tab" vs SCR-IV-03 cite [16] có "5 tab"

**Cite [5] AC FR-IV-05**: "Then hiển thị **4 tab** đầy đủ" + Mô tả: "4 tab: Hồ sơ, Năng lực, Lịch sử hỗ trợ, Đánh giá"

**Cite [16] SCR-IV-03 layout**: 5 tab (Hồ sơ, Thẩm định, Năng lực, Lịch sử hỗ trợ, Đánh giá)

→ **SPEC-CLARIFY-CG-57**: Tab "Thẩm định" có thuộc UC43 (xem chi tiết) không? Hay tách riêng cho UC44 với access role khác? AC nói 4 tab, SCR nói 5.

### CONFLICT-C: UC50 notification — AC + SM transitions đều KHÔNG quote notify (FIX-04)

→ **SPEC-CLARIFY-CG-55** (cũng đã list ở FIX-04).

---

## 🟡 MAJOR ADDITIONS (P1 — bổ sung trước khi production)

### ADD-01 [01-TC-FR-IV-01-quan-ly-tvv.md] — Outputs schema FR-IV-01 verify (6 fields cụ thể)

**SRS NGUYÊN VĂN Outputs (cite [14])**: 6 fields
| # | Tên | Kiểu | Điều kiện | Format |
|---|-----|------|-----------|--------|
| 1 | id | identifier | Luôn có | — |
| 2 | ma_tvv | text | Luôn có | TVV-{CODE}-{SEQ} |
| 3 | ho_ten | text | Luôn có | — |
| 4 | linh_vuc | text | Luôn có | Tags |
| 5 | trang_thai | text | Luôn có | SM-TVV |
| 6 | diem_danh_gia_tb | number | Khi có đánh giá | 0-10 |

**TC bổ sung**: TC-CG-039 — Verify API GET `/api/v1/tu-van-vien/{id}` response chứa đúng 6 field cite [14]. Nếu trả thừa/thiếu field → log bug.

### ADD-02 [02-TC-FR-IV-02-tim-kiem-tvv.md] — AC "AND logic" multi-filter coverage

**SRS NGUYÊN VĂN AC (cite [2])**: "Given user lọc theo lĩnh vực + địa bàn When tìm Then kết quả AND" / "Given user lọc theo nhiều điều kiện When tìm kiếm Then áp dụng **AND tất cả**"

**TC hiện tại** TC-CG-105 chỉ test Lĩnh vực multi-select. Chưa cover AND logic giữa Lĩnh vực + Địa bàn + Tổ chức + Trạng thái + Date range.

**TC bổ sung**:
- TC-CG-120 — Multi-filter AND: Lĩnh vực=DAN_SU + Địa bàn=HANOI + Tổ chức=TC-001 → kết quả phải intersect cả 3.
- TC-CG-121 — Multi-filter AND no match: filter combo trả 0 row → INF-TVV-01 + Empty state.

### ADD-03 [03-TC-FR-IV-03-dang-ky-mang-luoi.md] — Outputs FR-IV-03 (4 fields cụ thể, có message NGUYÊN VĂN)

**SRS NGUYÊN VĂN Outputs (cite [3])**: 4 fields
| # | Tên | Format |
|---|-----|--------|
| 1 | ma_tvv | TVV-{CODE}-{SEQ} (auto-gen) |
| 2 | trang_thai | MOI_DANG_KY |
| 3 | ngay_dang_ky | dd/mm/yyyy HH:mm |
| 4 | thong_bao | **"Đăng ký thành công, chờ thẩm định"** |

**Tác động**: TC-CG-201 nói toast "Đăng ký thành công, hồ sơ chờ thẩm định" + mark SPEC-CLARIFY-CG-15 "SRS Gap message" — thực tế **SRS có nguyên văn**: "Đăng ký thành công, chờ thẩm định".

**Action**:
- Sửa TC-CG-201 expected UI thành **NGUYÊN VĂN cite [3]**: "Đăng ký thành công, chờ thẩm định" (KHÔNG có "hồ sơ").
- **Đóng SPEC-CLARIFY-CG-15** (đã có nguyên văn).
- Thêm TC-CG-217 — Verify Output 4 fields đầy đủ trong response API POST.

### ADD-04 [04-TC-FR-IV-04-cap-nhat-nang-luc.md] — AC happy path + chia case NHT vs CB NV

**SRS NGUYÊN VĂN AC (cite [4])**: 3 case rõ ràng:
- "Given NHT xem hồ sơ của mình When nhấn 'Cập nhật năng lực' Then **form inline edit**"
- "Given NHT cập nhật thông tin/chứng chỉ + upload file When lưu Then validate và lưu thành công"
- "Given **CB NV xem chi tiết TVV** When cập nhật năng lực Then validate + lưu"

**TC hiện tại** TC-CG-301 chỉ test NHT case. Chưa có TC cho CB NV update năng lực TVV khác.

**TC bổ sung**:
- TC-CG-313 — CB NV cập nhật năng lực TVV thuộc đơn vị mình (verify cite [4] AC case 3).
- TC-CG-314 — Form inline edit verify (cite [4] AC case 1) — nút [Cập nhật năng lực] click → form xuất hiện inline (không phải modal/navigate route khác).

### ADD-05 [05-TC-FR-IV-05-xem-chi-tiet-tvv.md] — Output schema FR-IV-05 (7 fields) + NHT xem hồ sơ mình

**SRS NGUYÊN VĂN Output FR-IV-05 (cite [15])**: 7 fields
1. ho_ten | 2. ngay_sinh | 3. cmnd_cccd | 4. trinh_do | 5. chung_chi | 6. so_the_hanh_nghe | 7. files

**SRS NGUYÊN VĂN Tác nhân (cite [15])**: "CB NV, CB PD, **NHT (xem hồ sơ của mình)**"

**Tác động**: File 05 chỉ test CB NV/CB_NV_DP. Chưa cover NHT view own profile.

**TC bổ sung**:
- TC-CG-411 — NHT xem chi tiết hồ sơ của mình (cite [15] Tác nhân) → SCR-IV-03 hiển thị 5 tab (hoặc 4 per AC cite [5]).
- TC-CG-412 — Verify Output 7 fields cite [15] Tab Hồ sơ display đầy đủ ho_ten, ngay_sinh, cmnd_cccd, trinh_do, chung_chi, so_the_hanh_nghe, files.

### ADD-06 [06-TC-FR-IV-06-tham-dinh-ho-so.md] — AC "form thẩm định đầy đủ" + Notification specific

**SRS NGUYÊN VĂN AC FR-IV-06 (cite [6])**:
- "Given CB NV chọn TVV chờ thẩm định When đánh giá 4 nhóm Then **form thẩm định đầy đủ**"
- "Given hồ sơ chưa đủ When CB NV gửi yêu cầu bổ sung Then cập nhật trạng thái + **thông báo NHT**"

**SRS Postconditions (cite [6])**: "Kết quả thẩm định được ghi nhận / Trạng thái TVV chuyển theo SM-TVV / **NHT nhận thông báo (nếu cần bổ sung hoặc từ chối)**"

**TC hiện tại** TC-CG-502 (YEU_CAU_BO_SUNG) note "Notify NHT" — đã match cite [6]. OK.

**TC bổ sung**:
- TC-CG-519 — Verify cite [6] AC "form thẩm định đầy đủ": vào tab Thẩm định lần đầu cho TVV mới DANG_THAM_DINH → 4 nhóm scoring sections render đầy đủ với default values.

### ADD-07 [07-TC-FR-IV-07-phe-duyet-tvv.md] — AC happy CB PD xem kết quả thẩm định + Notification fix

**SRS NGUYÊN VĂN AC FR-IV-07 (cite [7])**:
- "Given **CB PD xem hồ sơ chờ duyệt** When xem chi tiết Then **hiển thị kết quả thẩm định 4 nhóm tiêu chí**"
- "Given CB PD phê duyệt When xác nhận Then TVV → DANG_HOAT_DONG, **ghi audit log**, NHT nhận thông báo"
- "Given CB PD từ chối When nhập lý do Then TVV → TU_CHOI, **gửi thông báo NHT**"

**Note SM-TVV cite [20] trans 8**: "Thông báo CB NV + NHT" (cho TU_CHOI) — bổ sung CB NV vào notify (đã ghi FIX-03).

**TC bổ sung**:
- TC-CG-617 — CB PD trước khi quyết định: vào SCR-IV-03 Tab Thẩm định → hiển thị kết quả thẩm định 4 nhóm đã ghi nhận (read-only mode cho CB PD per cite [7] AC). Verify CB PD KHÔNG có nút [Gửi KQ]/[Trình duyệt] (chỉ CB NV).

### ADD-08 [08-TC-FR-IV-08-cong-khai-mang-luoi.md] — AUDIT_LOG hanh_dong PUBLISH/UNPUBLISH verify

**SRS NGUYÊN VĂN AUDIT_LOG schema (cite [17])**: hanh_dong CHECK IN ('CREATE','UPDATE','DELETE','APPROVE','REJECT','LOGIN','LOGOUT','**PUBLISH**','**UNPUBLISH**')

**TC bổ sung**:
- TC-CG-717 — Verify AUDIT_LOG row sau công khai có hanh_dong='PUBLISH' (cite [17] enum). Sau hủy công khai có hanh_dong='UNPUBLISH'.

### ADD-09 [09-TC-FR-IV-09-danh-gia-tvv.md] — DN permission `C†` (conditional Create) verify

**SRS NGUYÊN VĂN Permission cite [23]**: DN cho DANH_GIA_TU_VAN_VIEN = `C†R*` (Create với điều kiện † + Read scoped).

**SRS NGUYÊN VĂN UC47 Tác nhân (cite [9])**: "CB NV, CB PD, DN" — cite [19] overview FR-IV-09: "DN đánh giá TVV **sau hỗ trợ**".

**Phân tích**: † = condition "sau khi VV hoàn thành" — cần verify rule này strict hay không.

**TC bổ sung**:
- TC-CG-817 — DN có VV với TVV nhưng VV trạng thái DANG_XU_LY (chưa HOAN_THANH) → cố submit đánh giá → reject (per condition †).
- TC-CG-818 — DN có VV trạng thái HOAN_THANH với TVV → submit OK (verify condition † = HOAN_THANH).
- TC-CG-819 — Verify DN_other (DN khác đơn vị, không có VV với TVV) → 0 access (Permission `C†R*` scope theo `don_vi_id` per BR-AUTH-08).

### ADD-10 [10-TC-FR-IV-10-xem-lich-su-ho-tro.md] — AC "danh sách + thống kê + timeline" verify đầy đủ

**SRS NGUYÊN VĂN AC FR-IV-10 (cite [10])**:
- "Given user xem chi tiết TVV When chọn tab 'Lịch sử' Then **danh sách VV + thống kê + timeline**"
- "Given CB NV xem chi tiết vụ việc When chọn vụ việc Then hiển thị thông tin + kết quả + đánh giá"
- "Given CB NV tìm kiếm lịch sử When lọc thời gian Then hiển thị kết quả phù hợp"

**TC hiện tại** TC-CG-901 verify bảng lịch sử + thống kê. Chưa verify rõ TIMELINE component.

**TC bổ sung**:
- TC-CG-910 — Verify timeline component render với mốc thời gian từng VV (cite [12] tab-4 "Timeline tổng hợp").
- TC-CG-911 — Click row VV trong bảng → navigate detail VV (cite [10] AC case 2 "chọn vụ việc Then hiển thị thông tin + kết quả + đánh giá").

### ADD-11 [11-TC-FR-IV-11-nht-cap-nhat-ho-so.md] — Outputs FR-IV-11 (success, updated_at) + AC readonly view

**SRS NGUYÊN VĂN Outputs (cite [11])**: 2 fields
- success (boolean)
- updated_at (datetime, dd/mm/yyyy HH:mm)

**SRS NGUYÊN VĂN AC case 3 (cite [11])**: "Given NHT lưu thành công When hệ thống xử lý xong Then **hiển thị thông tin đã cập nhật ở chế độ readonly để xác nhận**"

**TC bổ sung**:
- TC-CG-1011 — Verify response API có `success=true` và `updated_at` format dd/mm/yyyy HH:mm (cite [11] Outputs).
- TC-CG-1012 — Sau lưu thành công → form switch về readonly mode hiển thị giá trị mới (cite [11] AC case 3 NGUYÊN VĂN).

### ADD-12 [12-TC-FR-IV-12-cap-nhat-trang-thai-tvv.md] — AC "badge + timestamp" verify + 14 transitions

**SRS NGUYÊN VĂN AC FR-IV-12 (cite [12])**:
- "Given CB NV cập nhật thành công When hệ thống xử lý xong Then **hiển thị trạng thái mới (badge + timestamp)**"

**SRS NGUYÊN VĂN Postconditions (cite [12])**: "TVV bị vô hiệu hóa **không thể được phân công vụ việc mới**" — cross-module impact với FR Vụ việc.

**TC bổ sung**:
- TC-CG-1119 — Sau UC50 thành công, header SCR-IV-03 hiển thị badge trạng thái mới + timestamp dd/mm/yyyy HH:mm (cite [12] AC nguyên văn).
- TC-CG-1120 — Cross-module: TVV VO_HIEU_HOA → cố phân công VV mới (qua module Vụ việc) → reject (cite [12] Postcondition nguyên văn).
- TC-CG-1121 — Verify SM transition 9 (TU_CHOI → CHO_THAM_DINH) qua UC50 — file gốc TC-CG-609 đặt trong UC45, nhưng SM cite [20] trans 9 ghi `FR Ref: FR-IV-06` không phải FR-IV-12 → SPEC-CLARIFY-CG-58: TU_CHOI → CHO_THAM_DINH thuộc UC44 hay UC50?

### ADD-13 [13-TC-FR-IV-CROSS-01-tong-hop-diem.md] — AC happy mapping

**SRS NGUYÊN VĂN AC CROSS-01 (cite [13])**: "Given đánh giá mới được ghi nhận When xử lý Then điểm TB TVV được cập nhật tự động"

**TC hiện tại** TC-CG-1201/1202 đã cover. **OK.**

### ADD-14 [00-test-plan-overview.md §4 Số lượng] — Tổng cập nhật sau review

Sau bổ sung ~21 TC mới (TC-CG-039, 120-121, 217, 313-314, 411-412, 519, 617, 717, 817-819, 910-911, 1011-1012, 1119-1121) + sau fix 5 TC critical → tổng dự kiến **~238 TC**.

---

## 🟢 MINOR ENHANCEMENTS (P2 — nên có)

| ID | File | Đề xuất |
|----|------|--------|
| ENH-01 | 01 | Verify FR-IV-01 AC "3 tab" vs SCR "5 tab" — thêm TC kiểm tra số tab thực tế khớp AC nào → mark SPEC-CLARIFY-CG-56 |
| ENH-02 | 02 | TC happy đặt search keyword tiếng Việt có dấu (vd "Lê Văn") — verify backend handle Unicode collation |
| ENH-03 | 03 | TC NHT đăng ký với chỉ field bắt buộc (skip optional to_chuc_id, file_the_hanh_nghe) — boundary minimum |
| ENH-04 | 04 | TC NHT cập nhật năng lực với chung_chi_moi=null (optional skip) |
| ENH-05 | 05 | Verify "4 tab" vs "5 tab" SRS conflict — ENH cùng CONFLICT-B |
| ENH-06 | 06 | Form thẩm định: Lưu nháp xong, đăng nhập user khác cùng quyền có thấy nháp không? |
| ENH-07 | 07 | UC45 với so_quyet_dinh = empty string vs null vs có giá trị — boundary 3 case |
| ENH-08 | 08 | UC46 verify thứ tự khi batch: "5 TVV chọn batch công khai" — gọi API per-record tuần tự hay parallel? |
| ENH-09 | 09 | UC47 nhan_xet textarea boundary: 0 ký, 5000 ký, 5001 ký |
| ENH-10 | 10 | UC48 verify "Vai trò" trong table có tab thứ 3 = CG không (per cite [12] tab-4 chỉ liệt kê NHT/TVV) |
| ENH-11 | 11 | UC49 NHT update với multi-field cùng lúc (dia_chi + so_dien_thoai + email) — verify atomic transaction |
| ENH-12 | 12 | UC50 boundary lý do = exactly 10 ký (per cite [3] row 5 "min 10 ký tự") |

---

## 📊 QUALITY METRICS — 5 AXES SCORING

| Axis | Score (0-10) | Comment |
|------|-------------:|---------|
| **1. TraceID Accuracy** | 8.5 | TraceID đúng format `FR-IV-XX / NLM cite [N]`, đa số verify với SRS. -1.5 vì 5 TC critical sai source (FIX-01..05). |
| **2. Expected Result Fidelity** | 7.0 | 3-layer STATE/UI/PERSIST consistent. Nhiều "SRS Gap message" mark OK. -3 vì 5 TC bịa workflow chờ duyệt + notify list không đúng. |
| **3. AC Mapping Coverage** | 6.5 | Mỗi UC có 3 AC (SRS); file gốc test 1-2 AC. Thiếu mapping rõ AC → TC ID (chưa có cột "Cover AC nào"). |
| **4. Permission Matrix Accuracy** | 5.0 | Overview §2.3 sai 3 entity (TU_VAN_VIEN, HO_SO_TVV, DANH_GIA_TVV) cho NHT/TVV/CG. -5 critical. |
| **5. Coverage Depth (Happy/Negative/Edge)** | 8.5 | 217 TC sau merge edge hunter, ratio 22% Happy / 25% Neg / 38% Edge / 6% UI verify. Tốt. -1.5 vì còn 18 P1 addition pending. |
| **TỔNG (weighted avg)** | **7.2** | |

**Compared to baseline** (sibling QTHT/Tai-khoan-phan-quyen): 7.2 < 8.0 (sibling). Gap chính ở Permission Matrix accuracy + AC mapping.

---

## 🔧 ACTION PLAN (priority-ordered)

### Phase 1 — CRITICAL FIXES (8 hours, blocker)

| # | Task | File | Effort |
|---|------|------|--------|
| 1 | Sửa Permission Matrix overview theo NGUYÊN VĂN cite [23] (3 entity × 11 role = 33 cell) | 00-test-plan-overview.md §2.3 | 2h |
| 2 | Sửa SM-TVV diagram overview: 12 → 14 transitions, kèm Trigger/Guard/Action/FR Ref | 00-test-plan-overview.md §2.5 | 2h |
| 3 | Sửa TC-CG-1007 + xóa/rename TC-CG-1009 (workflow "chờ duyệt" sai source) | 11-TC-FR-IV-11 | 1h |
| 4 | Sửa TC-CG-603 PERSIST notify "CB NV + NHT" | 07-TC-FR-IV-07 | 0.5h |
| 5 | Bỏ "Notify NHT" khỏi TC-CG-1101..1105 (UC50) + thêm SPEC-CLARIFY-CG-55 | 12-TC-FR-IV-12 | 1h |
| 6 | Đóng SPEC-CLARIFY-CG-15 (đã có nguyên văn message UC41 toast) | 03-TC + 00-overview | 0.5h |
| 7 | Thêm 5 SPEC-CLARIFY mới: CG-54 (NHT vs Matrix conflict), CG-55, CG-56, CG-57, CG-58 | 00-overview §5 | 1h |

### Phase 2 — MAJOR ADDITIONS (6 hours)

| # | Task | File | Effort |
|---|------|------|--------|
| 8 | Thêm 21 TC mới (TC-CG-039, 120-121, 217, 313-314, 411-412, 519, 617, 717, 817-819, 910-911, 1011-1012, 1119-1121) | 13 file | 5h |
| 9 | Cập nhật §4 overview tổng số TC: 217 → 238 | 00-overview §4 | 0.5h |
| 10 | Verify lại sau merge: count TC mỗi file + total | bash | 0.5h |

### Phase 3 — MINOR ENHANCEMENTS (3 hours)

| # | Task | Effort |
|---|------|--------|
| 11 | Áp dụng 12 ENH (ENH-01..12) | 3h |

**Tổng effort estimate**: ~17 giờ.

---

## 🎯 RECOMMENDATIONS

1. **PRIORITY**: Fix Permission Matrix trước khi execute bất kỳ TC nào — sai matrix = fail nhầm permission test cases hàng loạt.
2. **WORKFLOW**: BA xác nhận 5 SPEC-CLARIFY mới (CG-54..58) trước khi production execute.
3. **PROCESS**: Áp dụng template chuẩn "Cover AC: AC1 / AC2 / AC3" vào mỗi TC để tracking AC mapping rõ hơn.
4. **DEFENSIVE**: Khi SRS có 2 nguồn conflict (vd "3 tab" vs "5 tab") → viết test cho **CẢ 2** scenario, mark SPEC-CLARIFY, KHÔNG suy diễn.
5. **POSITIVE**: Section A. UI FIELD VERIFICATION đầu mỗi file rất tốt — giữ nguyên template này cho các module sau.

---

## SPEC-CLARIFY tickets phát hiện trong review (CG-54 → CG-58)

| ID | Mô tả | Severity |
|----|-------|----------|
| SPEC-CLARIFY-CG-54 | Permission Matrix cite [23]: NHT cho TU_VAN_VIEN = `—` (no access) NHƯNG UC41 cite [3] cho phép NHT INSERT. → Conflict trong SRS. BA confirm NHT có access TU_VAN_VIEN qua UC41 không, hay tạo qua proxy entity (HO_SO_TVV `CRU*`)? | 🔴 |
| SPEC-CLARIFY-CG-55 | UC50 (FR-IV-12): SM cite [20] trans 10-14 + AC cite [12] đều KHÔNG quote notification. BA confirm có notify TVV/NHT khi đổi trạng thái không? | 🔴 |
| SPEC-CLARIFY-CG-56 | AC FR-IV-01 cite [1]: "3 tab trạng thái" vs SCR-IV-01 cite [8]: 5 tab. Số tab thực tế phải là bao nhiêu? | 🟡 |
| SPEC-CLARIFY-CG-57 | AC FR-IV-05 cite [5]: "4 tab" + Mô tả "Hồ sơ, Năng lực, Lịch sử, Đánh giá" vs SCR-IV-03 cite [16]: 5 tab có thêm "Thẩm định". Tab "Thẩm định" thuộc UC43 hay tách riêng UC44 với access role khác? | 🟡 |
| SPEC-CLARIFY-CG-58 | SM cite [20] trans 9 (TU_CHOI → CHO_THAM_DINH) ghi `FR Ref: FR-IV-06` (UC44) — nhưng UI hành động chuyển trạng thái thường thuộc UC50. Owner thực tế là UC44 hay UC50? | 🟢 |

---

*Generated by /bmad-testarch-test-review (Master Test Architect mode), 2026-05-01. NotebookLM round 4 verified. Confirm các fixes trước khi merge.*
