# Edge Case Hunter Review — CG-TVV (FR-IV)

> **Reviewer**: bmad-review-edge-case-hunter (path-tracing mode)
> **Ngày review**: 2026-05-01
> **Source SRS**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Method**: Quét per-file 14 file TC + cross-check với SRS NotebookLM (conversation round 3 — 20 vùng edge case verified). KHÔNG dùng local SRS.
> **Kết quả tóm tắt**: **47 edge TC bổ sung** + **3 SRS conflict mới phát hiện** + **1 file đề xuất tạo mới** (cross-cutting BR-EC).

---

## Cách dùng file này

- Mỗi section `## File XX-...md` liệt kê edge TC bổ sung cho file TC tương ứng. Copy bảng vào cuối file gốc → đặt section tên `## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)`.
- ID nối tiếp ID gốc, không trùng.
- TraceID **đã verify** với NotebookLM (cite [N] trong column).
- Kết quả mong đợi **bám nguyên văn SRS** — chỗ nào SRS không có quote → đánh dấu rõ "SRS Gap" thay vì tự bịa.
- Section cuối cùng `## Cross-cutting / new file recommendations` đề xuất tạo file `15-TC-cross-cutting-BR-EC.md` cho các BR-EC chưa cover trong file gốc nào.

---

## ⚠️ SRS CONFLICTS PHÁT HIỆN (cập nhật vào 00-test-plan-overview §5 SPEC-CLARIFY)

| ID conflict | Mô tả | Nguồn 1 (NLM) | Nguồn 2 (NLM) | Đề xuất |
|-------------|-------|---------------|---------------|---------|
| SPEC-CLARIFY-CG-34 | `diem_danh_gia_tb` CHECK constraint mâu thuẫn | cite [6] ERD: `CHECK (diem_danh_gia_tb BETWEEN 0 AND 5 OR IS NULL)` | cite [10] Outputs: `0-10` | BA confirm scale 0-5 hay 0-10. UC47 BR-DG-01 quote 0-10 → có thể ERD sai. Ảnh hưởng TC-CG-1201/1202 (CROSS-01). |
| SPEC-CLARIFY-CG-35 | CROSS-01 trigger phạm vi mâu thuẫn | cite [16]: "Trigger sau khi **tạo** DANH_GIA_TVV mới" (chỉ INSERT) | cite [6]: "Tính lại AVG khi **INSERT/UPDATE/DELETE** đánh giá" | BA confirm. Đã đặt SPEC-CLARIFY-CG-33 trong file gốc, đây là verify lại với 2 quote nguyên văn. |
| SPEC-CLARIFY-CG-36 | UC44 scoring scale Nhóm 2/3 mâu thuẫn 2 nguồn cùng SRS | cite [11] Inputs: `0-100` | cite [12] UI: `0-10` | BA confirm. Đã có trong SPEC-CLARIFY-CG-07; tracking với 2 quote nguyên văn. |
| SPEC-CLARIFY-CG-37 | Auto-gen `ma_tvv` prefix — SRS quote duy nhất `TVV-{DON_VI_CODE}-{SEQ}` cho TẤT CẢ loại (TVV/CG/NHT) | cite [7], [8], [10]: "TVV-{DON_VI_CODE}-{SEQ}" | (không có nguồn ngược lại) | TC-CG-008/009 đoán có thể prefix CG-/NHT-. SRS xác nhận **chỉ một format `TVV-`** cho cả 3 loại. → Update test expectation (overrides SPEC-CLARIFY-CG-03). |

---

## File 01-TC-FR-IV-01-quan-ly-tvv.md — UC39 CRUD

> Bổ sung **8 edge TC** (TC-CG-031 → TC-CG-038)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-031 | FR-IV-01 / NLM cite [7] / Outputs cite [10] | Tạo TVV — `ma_tvv` PHẢI có format chính xác `TVV-{DON_VI_CODE}-{SEQ}` cho cả 3 loại (TVV/CG/NHT) | CB_NV_TW. DON_VI_CODE="TW01". | Tạo 3 TVV: loai_tvv=TVV/CG/NHT cùng đơn vị TW01 | 1. Tạo lần lượt 3 record. 2. Query DB ma_tvv. | **STATE**: Cả 3 record có `ma_tvv` match regex `^TVV-TW01-\d+$` (NLM cite [7] nguồn "Hệ thống", NLM cite [10] format "TVV-{CODE}-{SEQ}" — KHÔNG có CG-/NHT- prefix). SEQ tăng dần 1,2,3. **UI**: SCR-IV-01 cột Mã TVV hiển thị 3 mã `TVV-TW01-001/002/003` dù loại khác nhau. **PERSIST**: Filter loai=CG → record có ma_tvv prefix vẫn TVV-. | Edge | 🔴 | File gốc TC-CG-008/009 ĐOÁN SAI prefix theo loại. SRS xác nhận chỉ 1 format. |
| TC-CG-032 | FR-IV-01 / BR-EC-01 / NLM cite [5] | UPDATE conflict với updated_at → ERR-SYS-02 nguyên văn | 2 user CB_NV_TW cùng sửa 1 TVV. | — | 1. User A và B mở form sửa cùng TVV (updated_at=T1). 2. User A lưu T2. 3. User B lưu. | **STATE**: User A success. User B BE check fail. **UI**: User B nhận error code "**ERR-SYS-02**" (NLM cite [5] BR-EC-01 nguyên văn: "Tất cả UPDATE/DELETE SHALL kiểm tra updated_at trước khi thực thi. Nếu xung đột → ERR-SYS-02"). Message chuỗi nguyên văn **SRS Gap** — chỉ có code, không có message → nếu app trả message custom → test verify code. **PERSIST**: TVV chỉ reflect change của A. | Edge | 🔴 | TC-CG-021 file gốc dùng message custom; thực tế SRS chỉ define code, không message → cần verify code thay message. |
| TC-CG-033 | FR-IV-01 / NLM cite [6] | UNIQUE cccd có loại trừ `is_deleted=1` không (boundary test) | TVV cũ cccd="111000" đã `is_deleted=1`. | Tạo TVV mới cccd="111000" | 1. Form CREATE. 2. Nhập cccd trùng record xóa mềm. 3. Lưu. | **STATE**: SRS quote cite [6]: "UNIQUE constraint trên cmnd_cccd — xử lý ORA-00001 bằng ERR-TVV-02" — **KHÔNG có WHERE is_deleted=0**. → Mặc định DB-level UNIQUE bao gồm row đã xóa mềm → INSERT FAIL → ERR-TVV-02. **UI**: Toast "Số CMND/CCCD đã tồn tại" (NLM cite [22] file gốc). **PERSIST**: Count không đổi. **Note**: SPEC-CLARIFY-CG-11 reference; SRS quote nguyên văn xác nhận DB UNIQUE không filter is_deleted. | Edge | 🔴 | TC-CG-025 file gốc bỏ ngỏ "phụ thuộc logic"; SRS quote rõ ràng xác nhận BAO GỒM row xóa mềm. |
| TC-CG-034 | FR-IV-01 / NLM cite [8] row 25 | Nút [Sửa] và [Xóa] hiển thị độc lập (Xóa ẩn khi có VV đang xử lý nhưng Sửa vẫn hiện) | CB_NV_TW. TVV "TVV-TW-006" DANG_HOAT_DONG, có 1 VV DANG_XU_LY (NOT VO_HIEU_HOA). | — | 1. SCR-IV-01 row TVV-TW-006. Quan sát icon Hành động. | **STATE**: — **UI**: Nguyên văn cite [8] row 25: "Xem (→ SCR-IV-03), **Sua (→ SCR-IV-02, chi khi NOT VO_HIEU_HOA)**, **Xoa (chi khi khong co VV dang xu ly)**". Icon [Xem] HIỂN THỊ. Icon [Sửa] HIỂN THỊ (vì NOT VO_HIEU_HOA). Icon [Xóa] **ẨN/DISABLE** (vì có VV đang xử lý). **PERSIST**: Cố click [Xóa] qua API direct → ERR-TVV-05. | Edge | 🟡 | File gốc TC-CG-020 chỉ verify [Sửa] ẩn khi VO_HIEU_HOA, chưa verify riêng [Xóa] với VV đang xử lý. |
| TC-CG-035 | FR-IV-01 / NLM cite [7] field 4 | Ngày sinh = TODAY (boundary "≤ ngày hiện tại") | CB_NV_TW. | ngay_sinh=hôm nay (2026-05-01) | 1. Tạo TVV với ngay_sinh=today. 2. Lưu. | **STATE**: INSERT thành công (cite [7] "≤ ngày hiện tại" → today PASS). **UI**: Toast OK. **PERSIST**: Detail hiển thị ngay_sinh=2026-05-01. | Edge | 🟢 | File gốc chưa cover boundary today. |
| TC-CG-036 | FR-IV-01 / NLM cite [9] | Ngày sinh > today (1 ngày sau) | CB_NV_TW. | ngay_sinh=2026-05-02 (today+1) | 1. Tạo TVV. 2. Lưu. | **STATE**: KHÔNG INSERT. **UI**: Inline error theo NLM cite [9] "(<=hom nay)". Message chính xác **SRS Gap** (không có message nguyên văn cho rule ngày sinh > today). **PERSIST**: Count không đổi. | Edge | 🟡 | File gốc chưa cover. |
| TC-CG-037 | FR-IV-01 / NLM cite [7] field 8 | SĐT 9 chữ số (boundary dưới) và 12 chữ số (boundary trên) | CB_NV_TW. | so_dien_thoai = "012345678" (9 ký), "012345678901" (12 ký) | 2 lần test với 2 boundary. | **STATE**: Cả 2 reject (cite [7] "10-11 chữ số"). **UI**: Inline error. Message chính xác **SRS Gap**. **PERSIST**: Count không đổi. | Edge | 🟢 | File gốc TC-CG-007 dùng SĐT 10 ký valid; chưa boundary. |
| TC-CG-038 | FR-IV-01 / NLM cite [9] | Họ tên 200 ký (boundary max) và 201 ký | CB_NV_TW. | ho_ten = "A"×200 (PASS), ho_ten = "A"×201 (FAIL) | 2 test. | **STATE**: 200 ký INSERT OK; 201 ký reject (cite [9] "Max 200 ky, ERR-TVV-01"). **UI**: 201 → ERR-TVV-01 message **SRS Gap nguyên văn cho overflow** (NLM cite [10] chỉ có ERR-TVV-01 = "Họ tên là bắt buộc"). **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-029 paste 250 ký nhưng không test exact boundary 200 vs 201. |

---

## File 02-TC-FR-IV-02-tim-kiem-tvv.md — UC40 Search

> Bổ sung **6 edge TC** (TC-CG-114 → TC-CG-119)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-114 | FR-IV-02 / NLM cite [8] row 12 | Filter dropdown "Trạng thái" — ẩn khi đang ở tab cụ thể (1 trạng thái) | CB_NV_TW. | — | 1. Tab "Đang hoạt động" (1 trạng thái). 2. Quan sát filter Trạng thái. 3. Đổi sang tab "Mới đăng ký" (2 trạng thái MOI_DANG_KY+YEU_CAU_BO_SUNG). | **UI**: Cite [8] row 12 nguyên văn: "Tat ca gia tri SM-TVV. **An neu dang o tab cu the**". Tab "Đang hoạt động"/"Tạm dừng"/"Chờ thẩm định"/"Chờ phê duyệt" (1 trạng thái mỗi tab) → filter Trạng thái **ẨN**. Tab "Mới đăng ký" (2 trạng thái) → filter Trạng thái **HIỂN THỊ** (chỉ giá trị MOI_DANG_KY và YEU_CAU_BO_SUNG để chọn, KHÔNG ẩn vì tab có >1 state). **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-UI-03 chưa verify rule "ẩn nếu đang ở tab cụ thể". |
| TC-CG-115 | FR-IV-02 / NLM cite [8] row 8 | Search keyword với ký tự `%` `_` (SQL LIKE wildcard escape) | CB_NV_TW. | từ_khóa = "100%" và "user_name" | 1. Search 2 keyword. | **STATE**: Backend escape `%` và `_` trước khi build LIKE (cite [8] "LIKE tren ho_ten, ma_tvv, cmnd_cccd"). **UI**: Bảng hiển thị chỉ TVV match literal "100%" (không match toàn bộ records). **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-109/110 cover SQL injection + XSS, chưa cover wildcard escape. |
| TC-CG-116 | FR-IV-02 / BR-EC-13 / NLM cite [5] | Keyword exactly 200 ký (boundary) | CB_NV_TW. | từ_khóa = "A"×200 | 1. Search. | **STATE**: BE accept (cite [5] BR-EC-13 nguyên văn "max 200 ky tu"). **UI**: Hiển thị empty/match results. **PERSIST**: — | Edge | 🟢 | File gốc TC-CG-111 dùng 250 ký; chưa test exact boundary. |
| TC-CG-117 | FR-IV-02 / NLM cite [8] row 13 | Date range invalid: "Ngày từ" > "Ngày đến" | CB_NV_TW. | từ=2026-05-01, đến=2026-04-01 | 1. Filter date range. 2. [Tìm kiếm]. | **STATE**: BE behavior **SRS Gap** (cite [8] không quote validation cho range invalid). Có 2 khả năng: (a) Trả 0 row; (b) Reject với error. **UI**: Tùy app. **PERSIST**: Mark SPEC-CLARIFY-CG-38 cho rule này. | Edge | 🟡 | File gốc chưa cover. |
| TC-CG-118 | FR-IV-02 / BR-DATA-06 / NLM cite [2] | Export Excel với filter hiện tại — verify chỉ export rows match filter | CB_NV_TW. Seed 100 TVV: 50 DANG_HOAT_DONG + 50 TAM_DUNG. | Tab "Tạm dừng" + filter Lĩnh vực=DAN_SU (matches 20 record) | 1. Setup filter. 2. [Xuất Excel]. 3. Mở file. | **STATE**: BE generate file with 20 row (cite [2] BR-DATA-06 nguyên văn: "**File xuất theo bộ lọc hiện tại, không vượt quá 10,000 rows/file**"). **UI**: Toast download. **PERSIST**: File mở → 20 row + header đúng cột; KHÔNG chứa 80 record không match filter. | Edge | 🔴 | File gốc TC-CG-113 verify header cột nhưng chưa verify "filter-aware" của BR-DATA-06. |
| TC-CG-119 | FR-IV-02 / BR-EC-12 / NLM cite [5] | Pagination — page=0, page=-1, page_size=200 (>max 100) | CB_NV_TW. | URL `?page=0`, `?page=-1`, `?page_size=200` | 1. 3 lần API call hoặc URL direct. | **STATE**: BE reject (cite [5] BR-EC-12 nguyên văn: "page_size ∈ [1,100] default 20. page >= 1 default 1. **Ngoài phạm vi → ERR-PARAM-01**"). **UI**: HTTP 400 error code "**ERR-PARAM-01**" (message chính xác **SRS Gap**). **PERSIST**: Default fallback hoặc reject. | Edge | 🟡 | File gốc TC-CG-004 chỉ test default 20/page; chưa test boundary param. |

---

## File 03-TC-FR-IV-03-dang-ky-mang-luoi.md — UC41 NHT

> Bổ sung **4 edge TC** (TC-CG-213 → TC-CG-216)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-213 | FR-IV-03 / BR-EC-04 / NLM cite [5] | NHT đăng ký kèm bằng cấp khi đơn vị đã đạt 100% storage quota | NHT chưa có hồ sơ. Đơn vị NHT đã dùng 10GB/10GB (cite [5] BR-EC-04 default 10GB). | file_bang_cap=cv.pdf (5MB) | 1. Đăng ký, upload. | **STATE**: BE check storage trước upload (cite [5] BR-EC-04 nguyên văn: "Mỗi đơn vị có hạn mức lưu trữ (mặc định 10GB). 90% → cảnh báo. 100% → từ chối **ERR-FILE-01**"). KHÔNG INSERT. **UI**: Error code "ERR-FILE-01" (message chính xác **SRS Gap**). **PERSIST**: NHT đăng ký fail. | Edge | 🟡 | File gốc chưa cover storage quota. Side effect: NHT bị block khi đơn vị full. |
| TC-CG-214 | FR-IV-03 / BR-EC-03 / NLM cite [5] | Upload file nhiễm virus → từ chối ERR-FILE-02 (chính xác mã) | NHT chưa có hồ sơ. | file_bang_cap=eicar_test.pdf | 1. Đăng ký, upload EICAR test pattern. | **STATE**: BE quét antivirus (cite [5] BR-EC-03 nguyên văn: "Tất cả file upload SHALL quét antivirus trước lưu trữ. Nhiễm → từ chối **ERR-FILE-02**"). KHÔNG INSERT. **UI**: Error code **ERR-FILE-02** (KHÔNG phải ERR-DK-02 như file gốc TC-CG-210). Message chính xác **SRS Gap**. **PERSIST**: File không lưu storage. | Edge | 🔴 | File gốc TC-CG-210 dùng mã sai "BR-EC-03" mà không cite ERR-FILE-02 nguyên văn. |
| TC-CG-215 | FR-IV-03 / NLM cite [17] | NHT chưa đăng nhập cố mở form đăng ký | NHT chưa login. | URL direct trang đăng ký | 1. Mở URL không login. | **STATE**: BE/FE precondition fail (cite [17] nguyên văn: "**NHT đã đăng nhập trên chuyên trang**"). **UI**: Redirect login page. **PERSIST**: — | Edge | 🟢 | File gốc chỉ có TC-CG-1006 cho UC49 (NHT cập nhật) chưa login; chưa cover UC41. |
| TC-CG-216 | FR-IV-03 / NLM cite [17] field 11 | Upload file binary[] rỗng (0 bytes) | NHT chưa có hồ sơ. | file_bang_cap=empty.pdf (0 bytes) | 1. Form. 2. Upload file rỗng. | **STATE**: BE behavior **SRS Gap** (cite [17] field 11 chỉ quote "PDF, max 10MB/file" không quote min size). Có thể: (a) reject; (b) accept với 0 bytes. **UI**: Tùy app. **PERSIST**: Mark SPEC-CLARIFY-CG-39 cho min size rule. | Edge | 🟡 | File gốc chỉ test max boundary; chưa test min/zero. |

---

## File 04-TC-FR-IV-04-cap-nhat-nang-luc.md — UC42

> Bổ sung **3 edge TC** (TC-CG-310 → TC-CG-312)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-310 | FR-IV-04 / NLM cite [18] | UC42 KHÔNG có guard chặn khi TVV VO_HIEU_HOA — cập nhật năng lực có pass? | NHT có TVV trạng thái VO_HIEU_HOA. | chuyen_nganh="updated" | 1. NHT vào tab Năng lực. 2. Click [Cập nhật năng lực] (nếu UI cho phép). 3. Lưu. | **STATE**: SRS Gap nguyên văn — cite [18] precondition chỉ quote: "**TVV tồn tại, NHT sở hữu hoặc CB NV có quyền**" (KHÔNG có guard VO_HIEU_HOA). UC50 nói khi VO_HIEU_HOA → auto gỡ Cổng PLQG nhưng KHÔNG cấm cập nhật năng lực. → Nếu app chặn → log bug FE thừa validation; nếu app cho phép → log SPEC-CLARIFY-CG-16 (tracking trong file gốc). **UI**: Tùy app. **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-308 đoán "ẩn/disable" nhưng SRS không có nguyên văn. Đây là verify. |
| TC-CG-311 | FR-IV-04 / NLM cite [18] field 4 | UPDATE linh_vuc_ids xuống empty `[]` (xóa hết lĩnh vực) | NHT có TVV, hiện đang có 2 lĩnh vực. | linh_vuc_ids = [] | 1. Tab Năng lực. 2. [Cập nhật]. 3. Bỏ chọn hết lĩnh vực. 4. Lưu. | **STATE**: SRS Gap (cite [18] field 4 chỉ quote "Cập nhật lĩnh vực PL" — không quote constraint ≥1). Lưu ý cite [7] field 16 cho UC39 nói "FK → DANH_MUC, **≥ 1**" cho create — UC42 update có inherit constraint đó không là Gap. → Mark SPEC-CLARIFY-CG-40. **UI**: Tùy app. **PERSIST**: Nếu allow → TVV không có lĩnh vực, sẽ break filter SCR-IV-01 cột Lĩnh vực. | Edge | 🟡 | File gốc TC-CG-303 chỉ test thêm; chưa test xóa hết. |
| TC-CG-312 | FR-IV-04 / BR-EC-04 / NLM cite [5] | Upload chứng chỉ mới khi đơn vị đã 90% quota → cảnh báo | NHT có TVV. Đơn vị NHT đã dùng 9GB/10GB (90%). | chung_chi_moi=cc.pdf (1.5GB — đủ tăng quá 90%) | 1. Tab Năng lực. 2. Upload PDF. 3. Lưu. | **STATE**: BE upload OK nhưng cảnh báo (cite [5] BR-EC-04 nguyên văn: "**90% → cảnh báo**"). UPDATE thành công. **UI**: Toast warning kèm "Đơn vị đã sử dụng 90% dung lượng lưu trữ" (message chính xác **SRS Gap**). **PERSIST**: File lưu. | Edge | 🟡 | File gốc chưa cover quota threshold. |

---

## File 05-TC-FR-IV-05-xem-chi-tiet-tvv.md — UC43

> Bổ sung **3 edge TC** (TC-CG-408 → TC-CG-410)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-408 | FR-IV-05 / NLM cite [3] row 5 | Verify nút [Cập nhật trạng thái] HIỂN THỊ cho CB NV với MỌI trạng thái (không chặn theo state) | CB_NV_TW. Test TVV ở 9 trạng thái khác nhau (1 record/state). | — | 1. Lần lượt vào SCR-IV-03 cho 9 TVV. 2. Quan sát nút [Cập nhật trạng thái]. | **STATE**: — **UI**: Cite [3] row 5 "Dieu kien hien thi: **Chi CB NV**" (KHÔNG có điều kiện theo trạng thái). → Nút HIỂN THỊ với CB NV ở MỌI 9 trạng thái: MOI_DANG_KY, CHO_THAM_DINH, DANG_THAM_DINH, YEU_CAU_BO_SUNG, CHO_PHE_DUYET, TU_CHOI, DANG_HOAT_DONG, TAM_DUNG, VO_HIEU_HOA. **PERSIST**: Modal mở luôn nhưng option transition trong modal sẽ hạn chế (chỉ TAM_DUNG/Khôi phục/VO_HIEU_HOA per UC50) → các state khác click [Cập nhật trạng thái] sẽ không có option phù hợp hoặc trigger ERR-TT-01 nếu force. | Edge | 🔴 | File gốc TC-CG-401/402 chỉ verify 2 state. SRS xác nhận nút show với MỌI state cho CB NV — đây là edge potential bug nếu app ẩn nhầm. |
| TC-CG-409 | FR-IV-05 / NLM cite [12] tab-2 | Tab "Thẩm định" — ẨN khi trạng thái KHÔNG IN (DANG_THAM_DINH, CHO_PHE_DUYET) | CB_NV_TW. TVV ở 7 state khác (loại trừ DANG_THAM_DINH+CHO_PHE_DUYET). | — | 1. Lần lượt vào SCR-IV-03 cho 7 TVV state khác. 2. Tab list visible. | **UI**: Cite [12] tab-2 nguyên văn "Chi hien khi TT in {**DANG_THAM_DINH, CHO_PHE_DUYET**}". → Tab "Thẩm định" ẨN cho 7 state: MOI_DANG_KY, CHO_THAM_DINH, YEU_CAU_BO_SUNG, TU_CHOI, DANG_HOAT_DONG, TAM_DUNG, VO_HIEU_HOA. Chỉ HIỂN THỊ cho 2 state DANG_THAM_DINH/CHO_PHE_DUYET. **PERSIST**: — | Edge | 🔴 | File gốc TC-CG-403 chỉ verify MOI_DANG_KY ẩn tab; chưa verify cho 6 state còn lại. |
| TC-CG-410 | FR-IV-05 / NLM cite [3] row 8 | Nút [Công khai] ẩn khi `cong_khai=true` (đã công khai) | CB_NV_TW có quyền công khai. TVV DANG_HOAT_DONG, la_cong_khai=1. | — | 1. SCR-IV-03 cho TVV đã công khai. 2. Quan sát header. | **UI**: Cite [3] row 8 nguyên văn: "Dieu kien hien thi: **Khi DANG_HOAT_DONG AND cong_khai=false**". → Nút [Công khai lên Cổng PLQG] **ẨN** khi cong_khai=true. SRS không quote nút thay thế [Hủy công khai] — **SRS Gap** cho UI hành động unpublish trên SCR-IV-03 single (chỉ batch ở SCR-IV-01 cite [1]). **PERSIST**: Mark SPEC-CLARIFY-CG-41. | Edge | 🟡 | File gốc TC-CG-UI-09 đoán có nút [Hủy công khai] trên SCR-IV-03; SRS không xác nhận. |

---

## File 06-TC-FR-IV-06-tham-dinh-ho-so.md — UC44 Thẩm định

> Bổ sung **5 edge TC** (TC-CG-514 → TC-CG-518)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-514 | FR-IV-06 / BR-EC-15 / NLM cite [5] | YEU_CAU_BO_SUNG lần thứ 4 → auto TU_CHOI | CB_NV_TW. TVV đã trải qua 3 lần YEU_CAU_BO_SUNG → DANG_THAM_DINH. | Lần 4 thẩm định ket_luan=YEU_CAU_BO_SUNG | 1. Tab Thẩm định. 2. ket_luan=YEU_CAU_BO_SUNG lần 4. 3. [Gửi KQ]. | **STATE**: BE check counter (cite [5] BR-EC-15 nguyên văn: "**Tối đa 3 lần bổ sung. Sau lần 3 nếu vẫn không đạt → tự động TU_CHOI**"). UPDATE TU_VAN_VIEN.trang_thai='TU_CHOI' (auto). AUDIT_LOG ghi system action. Notify NHT. **UI**: Toast "Hồ sơ tự động bị từ chối do quá 3 lần yêu cầu bổ sung" (message chính xác **SRS Gap**). **PERSIST**: SCR-IV-01 record xuất hiện trạng thái TU_CHOI, biến mất khỏi tab "Mới đăng ký". | Edge | 🔴 | File gốc CHƯA cover BR-EC-15 (auto-TU_CHOI sau 3 lần). |
| TC-CG-515 | FR-IV-06 / BR-EC-16 / NLM cite [5] | YEU_CAU_BO_SUNG quá N ngày làm việc → auto TU_CHOI + thông báo | CB_NV_TW. TVV YEU_CAU_BO_SUNG quá hạn deadline (cấu hình CAU_HINH_SLA). | — | 1. Background scheduler chạy. 2. Verify TVV sau N ngày. | **STATE**: BE scheduler check (cite [5] BR-EC-16 nguyên văn: "**Nếu trạng thái YEU_CAU_BO_SUNG quá N ngày LV (cấu hình qua CAU_HINH_SLA) → tự động TU_CHOI + thông báo**"). UPDATE trang_thai='TU_CHOI'. **UI**: NHT nhận notification. CB NV nhận notification (SRS Gap nguyên văn message). **PERSIST**: SCR-IV-01 record sang TU_CHOI. | Edge | 🟡 | File gốc CHƯA cover. |
| TC-CG-516 | FR-IV-06 / NLM cite [11] field 1 | Submit thẩm định bỏ trống Nhóm 1 (boolean Y) | CB_NV_TW. TVV DANG_THAM_DINH. | nhom1_ket_qua=null | 1. Tab Thẩm định. 2. Bỏ trống Nhóm 1. 3. [Gửi KQ]. | **STATE**: KHÔNG submit (cite [11] field 1 "boolean | **Y**"). **UI**: Inline error "Nhóm Pháp lý là bắt buộc" (message chính xác **SRS Gap**). **PERSIST**: — | Edge | 🟢 | File gốc chưa cover required validation Nhóm 1. |
| TC-CG-517 | FR-IV-06 / NLM cite [11] field 4 | Bỏ trống Nhóm 4 (boolean Y) | CB_NV_TW. TVV DANG_THAM_DINH. | nhom4_tham_gia=null | 1-3 với Nhóm 4 trống. | **STATE**: KHÔNG submit (cite [11] field 4 "Y"). **UI**: Inline error "Nhóm Mạng lưới là bắt buộc" (**SRS Gap message**). **PERSIST**: — | Edge | 🟢 | File gốc chưa cover. |
| TC-CG-518 | FR-IV-06 / SPEC-CLARIFY-CG-36 | Nhập Nhóm 2 với điểm 50 (valid theo cite [11] 0-100, INVALID theo cite [12] 0-10) | CB_NV_TW. TVV DANG_THAM_DINH. | nhom2_diem=50 | 1. Nhập 50. 2. [Gửi KQ]. | **STATE**: BE behavior **SRS conflict** — Inputs cite [11] = 0-100 → 50 valid; UI cite [12] = 0-10 → 50 invalid. → Test verify thực tế app dùng scale nào → cập nhật SPEC-CLARIFY-CG-07/36. **UI**: Tùy implementation. **PERSIST**: — | Edge | 🔴 | File gốc TC-CG-510 chỉ test 15 (out-of-range cả 2 scale); cần test edge ở giữa 2 scale (50) để phân biệt. |

---

## File 07-TC-FR-IV-07-phe-duyet-tvv.md — UC45 Phê duyệt

> Bổ sung **5 edge TC** (TC-CG-612 → TC-CG-616)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-612 | FR-IV-07 / BR-EC-17 / NLM cite [5] | CHO_PHE_DUYET quá N ngày → auto-escalate CB PD cấp trên | CB PD. TVV CHO_PHE_DUYET quá 3 ngày làm việc (cite [5] BR-EC-17 default N=3). | — | 1. Scheduler chạy. 2. Verify notification CB PD cấp trên. | **STATE**: BE scheduler (cite [5] BR-EC-17 nguyên văn: "**Nếu CHO_PHE_DUYET quá N ngày LV (mặc định 3) → auto-escalate CB PD cấp trên + nhắc nhở**"). KHÔNG đổi trạng thái TVV. **UI**: CB PD cấp trên nhận notification + nhắc nhở. CB PD gốc nhận reminder (message chính xác **SRS Gap**). **PERSIST**: AUDIT_LOG ghi system action escalate. | Edge | 🟡 | File gốc CHƯA cover BR-EC-17. |
| TC-CG-613 | FR-IV-07 / BR-EC-19 / NLM cite [5] | Batch approve > 100 records → reject | CB_PD_TW. 101 TVV CHO_PHE_DUYET. | — | 1. Tab "Chờ phê duyệt". 2. Tick 101 record. 3. [Phê duyệt hàng loạt]. | **STATE**: BE check (cite [5] BR-EC-19 nguyên văn: "Batch approve/batch operations: **tối đa 100 bản ghi/request**"). KHÔNG approve. **UI**: Toast/error "Tối đa 100 bản ghi mỗi lần" (message chính xác **SRS Gap**). **PERSIST**: 0 record chuyển trạng thái. | Edge | 🟡 | File gốc TC-CG-610 không quote BR-EC-19 + không test boundary 100 vs 101. |
| TC-CG-614 | FR-IV-07 / NLM cite [13] field 4 | Phê duyệt với so_quyet_dinh trống (optional) | CB_PD_TW. TVV CHO_PHE_DUYET. | so_quyet_dinh=null | 1. Click [Phê duyệt]. 2. Bỏ trống Số QĐ. 3. Confirm. | **STATE**: Phê duyệt thành công (cite [13] field 4 "so_quyet_dinh | text | **N**" optional). UPDATE trang_thai='DANG_HOAT_DONG' nhưng so_quyet_dinh=NULL. **UI**: Toast OK. **PERSIST**: Detail TVV header → "Số QĐ: —". | Edge | 🟢 | File gốc TC-CG-601 dùng so_quyet_dinh="QD-2026-001" nhưng không verify case null. |
| TC-CG-615 | FR-IV-07 / NLM cite [3] row 7 | Modal từ chối — UI phải có textarea ly_do với min 10 ký validation real-time | CB_PD_TW. TVV CHO_PHE_DUYET. | Type 9 ký rồi 10 ký | 1. Click [Từ chối]. 2. Type "Saiquaroi" (9 ký) → quan sát. 3. Type thêm 1 ký → 10 ký. | **STATE**: — **UI**: Cite [3] row 7 nguyên văn: "modal ly do bat buoc **>= 10 ky tu (ERR-PD-03)**". Khi <10 ký → nút [Xác nhận từ chối] disable HOẶC error inline; khi đủ 10 ký → enable. **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-604 chỉ submit 3 ký rồi check error; chưa verify real-time UX. |
| TC-CG-616 | FR-IV-07 / NLM cite [13] / NLM cite [3] row 6 | Phê duyệt → ngay_cong_nhan = NOW() chính xác (verify timestamp) | CB_PD_TW. TVV CHO_PHE_DUYET. | — | 1. Note thời điểm trước approve. 2. [Phê duyệt]. 3. Query DB. | **STATE**: cite [3] row 6 nguyên văn: "**SET DANG_HOAT_DONG, ngay_cong_nhan=NOW()**". Verify ngay_cong_nhan IS NOT NULL và trong khoảng [click_time-1s, click_time+1s]. **UI**: Header SCR-IV-03 hiển thị ngay_cong_nhan đúng dd/mm/yyyy. SCR-IV-01 cột Ngày công nhận update. **PERSIST**: — | Edge | 🟢 | File gốc TC-CG-601 chỉ note "ngay_cong_nhan=NOW()" mà không verify chính xác. |

---

## File 08-TC-FR-IV-08-cong-khai-mang-luoi.md — UC46 Công khai

> Bổ sung **5 edge TC** (TC-CG-712 → TC-CG-716)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-712 | FR-IV-08 / BR-EC-20 / NLM cite [19] | Công khai: KHÔNG set la_cong_khai=true TRƯỚC khi API Cổng PLQG thành công (transactional consistency) | CB_NV_TW có quyền. TVV DANG_HOAT_DONG, la_cong_khai=0. Mock API portal lỗi 500. | — | 1. Click [Công khai]. 2. Mock API lỗi. 3. Verify DB la_cong_khai. | **STATE**: cite [19] nguyên văn: "**KHONG set CONG_KHAI truoc API OK**". → la_cong_khai PHẢI vẫn = 0 sau khi API fail (chưa retry). Tránh inconsistent state DB vs Portal. **UI**: Toast warning WRN-CK-01 (cite file gốc). **PERSIST**: F5 reload → la_cong_khai=0. AUDIT_LOG ghi attempt nhưng không ghi PUBLISH success. | Edge | 🔴 | File gốc TC-CG-708/709 cover retry behavior nhưng KHÔNG verify rule transactional ordering (BR-EC-20 EC-04). |
| TC-CG-713 | FR-IV-08 / BR-EC-19 / NLM cite [5] | Batch công khai > 100 record → reject | CB_NV_TW. 101 TVV DANG_HOAT_DONG la_cong_khai=0. | — | 1. Tab "Đang hoạt động". 2. Tick 101. 3. [Công khai lên Cổng PLQG]. | **STATE**: BE reject (cite [5] BR-EC-19). KHÔNG gọi API per-record. **UI**: Error "Tối đa 100 bản ghi mỗi lần". **PERSIST**: 0 record công khai. | Edge | 🟡 | File gốc TC-CG-703 batch 5 record; chưa boundary 100. |
| TC-CG-714 | FR-IV-08 / NLM cite [19] | Race condition — User A đang đẩy lên Cổng, User B unpublish cùng record | 2 CB_NV_TW có quyền công khai. TVV "TVV-TW-007" DANG_HOAT_DONG, la_cong_khai=0. | — | 1. User A click [Công khai] (request đang processing). 2. Trong khi đó User B (qua API direct) gọi unpublish (la_cong_khai=0 → DELETE portal). 3. Cả 2 hoàn thành. | **STATE**: SRS Gap nguyên văn (cite [19] không quote race protection). Có thể: (a) Last-write-wins; (b) Optimistic lock theo updated_at. → Mark SPEC-CLARIFY-CG-42. **UI**: Tùy. **PERSIST**: Cần verify final state DB đồng bộ với Portal. | Edge | 🟡 | File gốc chưa cover race API outbound. |
| TC-CG-715 | FR-IV-08 / NLM cite [3] row 8 | Cố click [Công khai] cho TVV DANG_HOAT_DONG nhưng la_cong_khai=1 (UI phải ẩn) — verify API direct | CB_NV_TW. TVV DANG_HOAT_DONG, la_cong_khai=1. | API direct POST /api/v1/tu-van-vien/{id}/cong-khai | 1. UI: nút ẩn (verified TC-CG-410). 2. API direct. | **STATE**: BE behavior **SRS Gap** — cite [9] step "Đẩy/gỡ TVV đã duyệt" không quote idempotency. Có thể: (a) idempotent → 200 OK; (b) reject "Đã công khai". **UI**: Tùy. **PERSIST**: Mark SPEC-CLARIFY-CG-43. | Edge | 🟡 | File gốc cover trạng thái không hợp lệ (không DANG_HOAT_DONG); chưa cover idempotency với cùng state. |
| TC-CG-716 | FR-IV-08 / NLM cite [3] row 5 | Vô hiệu hóa TVV đã công khai → auto-gỡ Portal — nếu API portal lỗi thì sao? | CB_NV_TW. TVV DANG_HOAT_DONG, la_cong_khai=1. Mock API portal DELETE lỗi 500. | trang_thai_moi=VO_HIEU_HOA | 1. UC50 vô hiệu hóa. 2. Mock API gỡ portal lỗi. | **STATE**: cite [3] row 5 nguyên văn: "Khi vo hieu hoa → **auto go Cong PLQG**". Nếu API gỡ fail → BE behavior **SRS Gap** (BR-EC-20 EC-04 yêu cầu rollback hoặc compensating call). → 2 khả năng: (a) Rollback toàn bộ UC50 → trạng thái không đổi; (b) Force VO_HIEU_HOA + queue retry gỡ portal. → Mark SPEC-CLARIFY-CG-44. **UI**: Toast warning. **PERSIST**: Verify la_cong_khai và trang_thai consistency. | Edge | 🔴 | File gốc TC-CG-710 happy path; chưa cover failure path. |

---

## File 09-TC-FR-IV-09-danh-gia-tvv.md — UC47 Đánh giá

> Bổ sung **5 edge TC** (TC-CG-812 → TC-CG-816)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-812 | FR-IV-09 / NLM cite [14] / [15] | DANH_GIA_TU_VAN_VIEN có CỘT điểm thành phần (`diem_phap_ly`, `diem_nang_luc`, `diem_hieu_qua`, `diem_mang_luoi`) — KHÁC với 3 tiêu chí form (Chuyên môn/Thái độ/Đúng hạn) | DN. TVV. | Form đánh giá theo 3 tiêu chí cite [12] | 1. Verify form UI. 2. Verify DB schema cite [14]/[15]. | **STATE**: SRS conflict — cite [12] form UI có 3 star-rating "**Chuyen mon, Thai do, Dung han**"; cite [14]/[15] entity có 4 cột "**diem_phap_ly, diem_nang_luc, diem_hieu_qua, diem_mang_luoi**". → Mismatch field UI vs DB. → Mark SPEC-CLARIFY-CG-45 (BA confirm: schema 4 nhóm thẩm định reused cho đánh giá DN, hay đánh giá DN dùng 3 tiêu chí riêng?). **UI**: Tùy. **PERSIST**: — | Edge | 🔴 | File gốc TC-CG-801 dùng 3 tiêu chí UI, KHÔNG verify mapping DB columns. Đây là SRS conflict NGHIÊM TRỌNG. |
| TC-CG-813 | FR-IV-09 / NLM cite [14] | DN đánh giá nhiều lần cùng (TVV, vu_viec) — SRS không có UNIQUE | DN. TVV. VV-001. Đã có 1 đánh giá. | Submit thêm 1 đánh giá identical | 1. Form. 2. Submit lại. | **STATE**: cite [14]/[15] DANH_GIA_TU_VAN_VIEN chỉ có PK trên `id`, **KHÔNG có UNIQUE (tu_van_vien_id, nguoi_danh_gia_id, vu_viec_id)**. → INSERT thành công với row 2. **UI**: Toast OK. **PERSIST**: Bảng đánh giá tab "Đánh giá" hiển thị 2 record cùng người DG cho cùng VV. CROSS-01 trigger 2 lần. diem_danh_gia_tb tính cả 2. | Edge | 🔴 | File gốc TC-CG-810 đặt SPEC-CLARIFY-CG-08 ngỏ; SRS quote rõ KHÔNG có UNIQUE → app cho phép trùng. Verify behavior. |
| TC-CG-814 | FR-IV-09 / NLM cite [14] field 11 | Đánh giá ngày nhập manual — verify ngày DG = NOW() (auto), không cho user override | DN. TVV. | API direct POST với ngay_danh_gia=2020-01-01 | 1. POST với ngày custom. | **STATE**: BE override (cite [14] field 11 "ngay_danh_gia | datetime | Y | **DEFAULT NOW()**"). Lưu ngay_danh_gia=NOW() bất chấp input. **UI**: — **PERSIST**: Bảng cột "Ngày" hiển thị NOW. | Edge | 🟢 | File gốc chưa cover. |
| TC-CG-815 | FR-IV-09 / NLM cite [14] field 5 / BR-CALC-06 | diem (điểm tổng) — DB CHECK BETWEEN 0 AND 10 (cite [14]) — boundary exact 0.0 và 10.0 và 5.5 | DN. TVV. | 3 lần test với điểm tổng = 0.0, 10.0, 5.5 | 3 INSERT. | **STATE**: Cả 3 INSERT thành công (cite [14] field 5 "CHECK BETWEEN 0 AND 10" inclusive). **UI**: — **PERSIST**: 3 row, diem_danh_gia_tb recalc đúng. | Edge | 🟢 | File gốc TC-CG-808/809 cover 0/0/0 và 10/10/10 (3 component) chưa exact verify constraint diem TỔNG. |
| TC-CG-816 | FR-IV-09 / NLM cite [14] field 4 / SPEC-CLARIFY-CG-27 | DN không có VV với TVV cố submit qua API direct (UI block nhưng API có check?) | DN không có VV với TVV-TW-007. | API direct POST với tvv_id=TVV-TW-007 | 1. API call. | **STATE**: cite [14] field 4 "vu_viec_id | identifier | **N**" optional → backend không enforce relationship. → Có thể: (a) BE check thêm rule "DN có quyền nếu có VV"; (b) BE accept (chỉ FE block). → Mark SPEC-CLARIFY-CG-27 reuse. **UI**: HTTP code tùy. **PERSIST**: Nếu accept → CROSS-01 trigger với đánh giá unauthorized. | Edge | 🟡 | File gốc TC-CG-807 chỉ verify FE block, chưa test API direct. |

---

## File 10-TC-FR-IV-10-xem-lich-su-ho-tro.md — UC48

> Bổ sung **2 edge TC** (TC-CG-908 → TC-CG-909)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-908 | FR-IV-10 / NLM cite [12] tab-4 | Cột "Vai trò" trong bảng lịch sử — verify hiển thị (NHT/TVV) đúng theo loai_tvv của TVV trong VV | CB_NV_TW. TVV-TW-007 có 3 VV: 1 vai trò NHT, 2 vai trò TVV. | — | 1. Tab Lịch sử. 2. Quan sát cột "Vai trò". | **UI**: Cite [12] tab-4 nguyên văn cột bảng: "Ma VV, Ten VV, DN, Linh vuc, **Vai tro (NHT/TVV)**, Ngay phan cong...". → Verify mapping vai_tro = NHT cho row 1, TVV cho row 2-3. → Note: chỉ 2 giá trị (NHT/TVV), KHÔNG có CG (SRS Gap — VV có thể assign CG không?). **PERSIST**: Mark SPEC-CLARIFY-CG-46. | Edge | 🟡 | File gốc TC-CG-901 hiển thị bảng nhưng chưa verify rule cột Vai trò. |
| TC-CG-909 | FR-IV-10 / NLM cite [12] tab-4 | Filter date range invalid (từ > đến) cho lịch sử | CB_NV_TW. TVV-TW-007. | từ=2026-04-01, đến=2026-01-01 | 1. Tab Lịch sử. 2. Filter date inverse. | **STATE**: BE behavior **SRS Gap** (tương tự TC-CG-117 cho UC40). **UI**: Tùy. **PERSIST**: Mark SPEC-CLARIFY-CG-38 reuse. | Edge | 🟢 | File gốc chưa cover. |

---

## File 11-TC-FR-IV-11-nht-cap-nhat-ho-so.md — UC49

> Bổ sung **2 edge TC** (TC-CG-1009 → TC-CG-1010)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-1009 | FR-IV-11 / NLM cite [19] (overview) | NHT cập nhật → "chờ duyệt" — SRS overview FR-IV-11 nguyên văn "TVV tự cập nhật thông tin, **chờ duyệt**" | NHT. TVV DANG_HOAT_DONG. | ho_ten mới | 1. NHT update. 2. CB NV vào SCR-IV-01 trước approve. | **STATE**: cite [19] overview SRS quote: "**TVV tự cập nhật thông tin, chờ duyệt**". → Workflow: NHT submit → tạo pending change record (KHÔNG UPDATE TU_VAN_VIEN ngay). CB NV approve → mới UPDATE thật. → SRS Gap chi tiết workflow (state machine pending). → Mark SPEC-CLARIFY-CG-30 reuse. **UI**: Toast "Đã gửi yêu cầu cập nhật, chờ duyệt" (message **SRS Gap**). **PERSIST**: SCR-IV-01 vẫn ho_ten cũ cho đến khi approve. | Edge | 🔴 | File gốc TC-CG-1007 đặt ngỏ; SRS overview cite [19] xác nhận có workflow chờ duyệt → cần verify. |
| TC-CG-1010 | FR-IV-11 / NLM cite [27] | NHT cập nhật ho_ten với ký tự Unicode đặc biệt (vd: dấu tiếng Việt, emoji) | NHT. | ho_ten = "Lê Văn Cường 🎓" | 1. Form. 2. Lưu. | **STATE**: BE behavior **SRS Gap** (cite [27] không quote charset constraint). Có thể: (a) accept Unicode + emoji; (b) reject emoji; (c) chỉ accept Vietnamese alphabet. **UI**: Tùy. **PERSIST**: Mark SPEC-CLARIFY-CG-47. | Edge | 🟢 | File gốc chưa test charset. |

---

## File 12-TC-FR-IV-12-cap-nhat-trang-thai-tvv.md — UC50 SM

> Bổ sung **4 edge TC** (TC-CG-1115 → TC-CG-1118)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-1115 | FR-IV-12 / BR-EC-08 / NLM cite [5] | Vô hiệu hóa TVV → auto-blacklist refresh token TVV (revoke session) | CB_NV_TW. TVV DANG_HOAT_DONG có tài khoản đăng nhập đang active. Không VV chưa hoàn thành. | trang_thai_moi=VO_HIEU_HOA | 1. CB_NV_TW vô hiệu hóa TVV. 2. TVV cố call API bằng refresh token cũ. | **STATE**: cite [5] BR-EC-08 nguyên văn: "**Logout/Lock/Disable → thêm tất cả refresh token vào blacklist Redis ngay lập tức**". → Backend thêm refresh_token vào blacklist Redis. **UI**: TVV bị logout cưỡng chế. Mọi request tiếp theo → 401. **PERSIST**: Redis blacklist contain token. AUDIT_LOG ghi disable + token revoke. | Edge | 🔴 | File gốc TC-CG-1103 happy path không cover side effect token revoke (BR-EC-08). |
| TC-CG-1116 | FR-IV-12 / NLM cite [4] step 2 | VO_HIEU_HOA: cite [4] processing step 2 = "kiểm tra không có VV đang xử lý" — KHÔNG quote check HOI_DAP | CB_NV_TW. TVV không có VV đang xử lý nhưng có 1 HOI_DAP DANG_XU_LY. | trang_thai_moi=VO_HIEU_HOA | 1. UC50 vô hiệu hóa. | **STATE**: SRS conflict 2 nguồn — cite [4] processing chỉ check VU_VIEC; cite [3] row 5 UI ghi "kiem tra ca VU_VIEC va HOI_DAP". → Mark SPEC-CLARIFY-CG-48. Test verify behavior thực tế. **UI**: Tùy. **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-1108 đoán check cả HOI_DAP per UI spec; processing thì khác. SRS không nhất quán. |
| TC-CG-1117 | FR-IV-12 / NLM cite [3] row 5 | Modal [Cập nhật trạng thái] với TVV trạng thái MOI_DANG_KY (CB NV click được vì nút HIỂN THỊ) | CB_NV_TW. TVV MOI_DANG_KY. | trang_thai_moi=TAM_DUNG | 1. SCR-IV-03. 2. Click [Cập nhật trạng thái] (cite [3] row 5 chỉ điều kiện "Chỉ CB NV" — không chặn theo state). 3. Modal mở. 4. Chọn TAM_DUNG. 5. Lý do. 6. Confirm. | **STATE**: BE check transition (cite [4] step 1 "Kiểm tra transition hợp lệ theo SM-TVV"). MOI_DANG_KY → TAM_DUNG **KHÔNG có trong SM-TVV** → reject. **UI**: HTTP error "**Không thể chuyển từ MOI_DANG_KY sang TAM_DUNG**" (NLM cite ERR-TT-01). Modal không close, error inline. **PERSIST**: TVV vẫn MOI_DANG_KY. | Edge | 🔴 | File gốc TC-CG-1112/1113 cover edge transition nhưng chưa cover MOI_DANG_KY → TAM_DUNG (UC50 invalid path từ initial state). |
| TC-CG-1118 | FR-IV-12 / BR-EC-05 / NLM cite [5] | CB NV đang có 3 phiên hoạt động — phiên thứ 4 đăng nhập → kill phiên cũ nhất (cross-cutting với UC50 không trực tiếp nhưng test khi user đăng nhập từ device khác xử lý concurrent edits) | CB_NV_TW đăng nhập 3 thiết bị (3 phiên). | Phiên 4 đăng nhập | 1. Đăng nhập phiên 4. 2. Verify phiên 1 (cũ nhất). | **STATE**: cite [5] BR-EC-05 nguyên văn: "Tối đa 3 phiên đồng thời/user. **Phiên thứ 4 hủy phiên cũ nhất**. QTHT: 1 phiên". → Phiên 1 bị invalidate. **UI**: Phiên 1 next request → 401, redirect login. **PERSIST**: Redis chỉ giữ 3 phiên gần nhất. | Edge | 🟢 | File gốc chưa cover; thuộc cross-cutting nhưng có liên quan UC50 (CB NV vô hiệu hóa) — verify session limit. |

---

## File 13-TC-FR-IV-CROSS-01-tong-hop-diem.md — CROSS-01

> Bổ sung **3 edge TC** (TC-CG-1207 → TC-CG-1209)

| ID | TraceID | Tên TC | Pre-conditions | Test Data | Bước | Kết quả mong đợi | Type | 🔴/🟡/🟢 | Lý do gap |
|----|---------|--------|----------------|-----------|------|------------------|------|---------|-----------|
| TC-CG-1207 | FR-IV-CROSS-01 / SPEC-CLARIFY-CG-35 / NLM cite [16] vs cite [6] | Verify trigger CHẠY khi DELETE/UPDATE DANH_GIA_TVV (theo cite [6]) hoặc CHỈ INSERT (theo cite [16]) | DN. TVV với 2 đánh giá. diem_danh_gia_tb=8.5. | DELETE 1 record DANH_GIA_TVV | 1. Admin xóa 1 record (qua API hoặc DB direct). 2. Verify diem_danh_gia_tb. | **STATE**: SRS conflict — cite [16] processing chỉ "Trigger sau khi tạo"; cite [6] DB note "INSERT/UPDATE/DELETE". → Test thực tế xác định behavior. Nếu trigger DELETE → AVG recalc; nếu không → stale. **UI**: SCR-IV-01 cột Điểm DG có thể stale. **PERSIST**: SPEC-CLARIFY-CG-35 verify lại. | Edge | 🔴 | File gốc TC-CG-1203/1206 đặt ngỏ; SRS conflict 2 nguồn được trích nguyên văn → cần BA confirm. |
| TC-CG-1208 | FR-IV-CROSS-01 / NLM cite [6] | diem_danh_gia_tb sau CROSS-01 = NULL khi xóa hết đánh giá (boundary 0 record) | DN. TVV-TW-200 có 1 đánh giá duy nhất. | DELETE record duy nhất | 1. Xóa đánh giá. 2. Verify TU_VAN_VIEN.diem_danh_gia_tb. | **STATE**: Nếu trigger DELETE chạy (per cite [6]) → AVG of empty = NULL hoặc 0. SRS Gap nguyên văn. → Mark SPEC-CLARIFY-CG-49. **UI**: SCR-IV-01 cột Điểm DG: "—" (cite [8] row 22 "Nếu chưa đánh giá → '—'"). **PERSIST**: — | Edge | 🟡 | File gốc TC-CG-1204 cover never-evaluated; chưa cover post-delete-all. |
| TC-CG-1209 | FR-IV-CROSS-01 / SPEC-CLARIFY-CG-34 / NLM cite [6] | CHECK constraint `diem_danh_gia_tb BETWEEN 0 AND 5` (cite [6] ERD) — verify boundary | DN. TVV. | Submit đánh giá điểm tổng=10 (out of [0,5] per ERD constraint) | 1. INSERT đánh giá điểm 10. 2. CROSS-01 trigger UPDATE diem_danh_gia_tb. | **STATE**: SRS conflict — cite [6] ERD: "CHECK (diem_danh_gia_tb BETWEEN **0 AND 5** OR IS NULL)" vs cite [10] Outputs FR-IV-01: "0-10". → Nếu DB constraint enforce 0-5 → UPDATE FAIL → trigger throw error → CROSS-01 fail → đánh giá vẫn được lưu nhưng diem_danh_gia_tb không update. **UI**: Tùy. **PERSIST**: SPEC-CLARIFY-CG-34 verify. | Edge | 🔴 | File gốc HOÀN TOÀN chưa biết về DB CHECK 0-5; chỉ dùng 0-10 từ Outputs. SRS conflict NGHIÊM TRỌNG. |

---

## Cross-cutting / new file recommendations

### Đề xuất tạo mới: `15-TC-cross-cutting-BR-EC.md`

Các Business Rule cross-cutting (BR-EC-XX) có ảnh hưởng nhiều UC nhưng chưa thuộc file nào:

| ID đề xuất | TraceID | Lý do tạo file riêng |
|-----------|---------|---------------------|
| TC-CG-CC-01 | BR-EC-15 / NLM cite [5] | YEU_CAU_BO_SUNG max 3 lần auto-TU_CHOI (overlap UC44+UC45) |
| TC-CG-CC-02 | BR-EC-16 / NLM cite [5] | YEU_CAU_BO_SUNG quá deadline auto-TU_CHOI (overlap UC44+UC45) |
| TC-CG-CC-03 | BR-EC-17 / NLM cite [5] | CHO_PHE_DUYET escalate (overlap UC45) |
| TC-CG-CC-04 | BR-EC-18 / NLM cite [5] | NHT/CG không phản hồi phân công 3 ngày → auto hoàn (cross UC ngoài FR-IV) |
| TC-CG-CC-05 | BR-EC-04 / NLM cite [5] | Storage quota 10GB/đơn vị (overlap UC39+UC41+UC42 file upload) |
| TC-CG-CC-06 | BR-EC-19 / NLM cite [5] | Batch limit 100 record (overlap UC45 batch approve + UC46 batch công khai) |
| TC-CG-CC-07 | BR-EC-20 / NLM cite [5] / NLM cite [19] | Transactional consistency: KHÔNG set trạng thái mới trước khi LGSP/Portal API OK (UC46) |
| TC-CG-CC-08 | BR-EC-08 / NLM cite [5] | Refresh token revoke khi UC50 disable |
| TC-CG-CC-09 | BR-EC-05 / NLM cite [5] | Session limit 3/user (cross-cutting) |
| TC-CG-CC-10 | BR-EC-23 / NLM cite [5] | Evaluation weight tolerance ±0.01% (CROSS-01 + UC47) |

> **Đề xuất action**: Tạo file `15-TC-cross-cutting-BR-EC.md` với 10 TC trên + section UI verification chéo (verify nút batch ở SCR-IV-01 enforce limit 100, verify upload UI cảnh báo 90% quota, ...).

### Đề xuất cập nhật `00-test-plan-overview.md`

- §2.1 BR table: bổ sung BR-EC-04, BR-EC-05, BR-EC-08, BR-EC-15, BR-EC-16, BR-EC-17, BR-EC-18, BR-EC-19, BR-EC-20, BR-EC-23 (đã quote nguyên văn cite [5]).
- §5 SPEC-CLARIFY: thêm CG-34 → CG-49 (16 ticket mới).
- §4 Tổng quan số lượng: cập nhật từ 152 → ~199 TC (165 + 47 edge bổ sung) sau khi merge review.

---

## Tóm tắt

| Section | Edge TC bổ sung | Critical 🔴 | High 🟡 | Medium 🟢 |
|---------|----------------:|------------:|--------:|----------:|
| 01 — Quản lý TVV | 8 | 3 | 3 | 2 |
| 02 — Tìm kiếm | 6 | 1 | 3 | 2 |
| 03 — Đăng ký NHT | 4 | 1 | 2 | 1 |
| 04 — Cập nhật năng lực | 3 | 0 | 3 | 0 |
| 05 — Xem chi tiết | 3 | 2 | 1 | 0 |
| 06 — Thẩm định | 5 | 2 | 1 | 2 |
| 07 — Phê duyệt | 5 | 0 | 2 | 3 |
| 08 — Công khai | 5 | 2 | 3 | 0 |
| 09 — Đánh giá | 5 | 2 | 1 | 2 |
| 10 — Lịch sử | 2 | 0 | 1 | 1 |
| 11 — NHT cập nhật | 2 | 1 | 0 | 1 |
| 12 — Cập nhật trạng thái | 4 | 2 | 1 | 1 |
| 13 — CROSS-01 | 3 | 2 | 1 | 0 |
| Cross-cutting (đề xuất file mới) | 10 | — | — | — |
| **TỔNG** | **57** | **18** | **22** | **15** |

**Conflicts mới phát hiện:** 4 SPEC-CLARIFY tickets (CG-34 → CG-37, gồm conflict scoring scale + CHECK constraint điểm DG + CROSS trigger range + ma_tvv prefix).

**Confirms quan trọng:**
- ✅ `ma_tvv` format `TVV-{DON_VI_CODE}-{SEQ}` áp dụng cho cả 3 loại (TVV/CG/NHT) — KHÔNG có prefix khác.
- ✅ Nút [Cập nhật trạng thái] hiển thị với MỌI trạng thái cho CB NV (BE check transition trong modal).
- ✅ DANH_GIA_TVV không có UNIQUE constraint → 1 DN được đánh giá nhiều lần cùng VV.
- ✅ UC42 (Cập nhật năng lực) — SRS không guard khi TVV VO_HIEU_HOA.
- ✅ BR-DATA-06: Export Excel filter-aware (chỉ export rows match filter), max 10k rows.

> User confirm hoặc chỉnh sửa các edge TC trên trước khi merge vào file gốc tương ứng.
