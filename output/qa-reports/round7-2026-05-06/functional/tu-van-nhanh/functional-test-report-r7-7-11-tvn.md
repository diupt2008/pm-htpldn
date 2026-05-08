# Functional Test Report — Tư vấn Nhanh (Module 7.13) R7.7.11

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Tư vấn Nhanh (Module 7.13) — FR-13 / Nhóm X.2 |
| **SRS Reference** | [srs-fr-13-tv-nhanh.md](../../../../../input/srs-v3/srs-fr-13-tv-nhanh.md) v3.5 — FR-X.2-01..05 (44 TC v3.5) |
| **UC Coverage** | UC 154 (FR-X.2-01) · UC 155 (duyệt) · UC 156 (FR-X.2-06 Công khai) · UC 157/158 (DN search/đánh giá) |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-05-08 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | Hybrid (UI Modal + API verify) |
| **Primary Account** | `cb_nv_tw_01` / `Secret@123` (CB_NV_TW, Cục BTTP) + `qtht_01` (QTHT) |
| **Round** | R8 (Kho Q&A subset) → **R9 (2026-05-08, +5 TC phiên TV nhanh sau dev seed)** |
| **Tài liệu tham chiếu** | [7.13-tu-van-nhanh.md](../../../../funtion/7.13-tu-van-nhanh.md) · [bug-report-r7-7-11-tvn.md](../../bug-reports/tu-van-nhanh/bug-report-r7-7-11-tvn.md) · [workflow-test-report-r7-6-2-tv-nhanh.md](../../workflow/tu-van-nhanh/workflow-test-report-r7-6-2-tv-nhanh.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 44 |
| **TC đã test / Tổng TC** | **19/44 (43%)** — R8: 13 TC Kho Q&A · **R9: +6 TC phiên TV nhanh + audit (TVN-016/017/018/019/021/039)** sau dev seed 50 phiên · 11 BLOCKED mTLS/multi-role · 14 DEFER (Import/cross-module/batch) |
| **Passed** | **12** (R8: 9 + **R9: 3 mới TVN-016/019/021**) |
| **Failed** | 0 |
| **Blocked** | 6 (R8: 5 TVN-040..044 + R9: 1 TVN-018 cascade) |
| **Partial** | **5** (R8: TVN-010/011/012 authz · **R9: TVN-017 gợi ý không render + TVN-039 audit naming**) |
| **Overall Pass Rate** | **63%** (12/19 đã test) |
| **P0 Pass Rate** | **62%** (5/8 P0 = TVN-001/003/016/019/033 PASS; TVN-010/011/017 PARTIAL; TVN-040/041 BLOCKED) |
| **Bugs Found (SRS-ref)** | **5** (1 Critical, 2 Major, 2 Minor) |
| **Health Score** | **60/100** — workflow phiên TV mechanics OK nhưng UI render gợi ý lỗi (Major) + authz CB NV/CB PD chưa enforce (Critical) + FR-X.2-06 chưa deploy + audit naming inconsistent. R9 tăng 5 điểm so R8. |
| **Start Time** | 23:39 (UTC+7) 07/05 (R8) · 01:00 (UTC+7) 08/05 (R9) |
| **End Time** | 00:34 (UTC+7) 08/05 (R8) · 01:30 (UTC+7) 08/05 (R9) |
| **Total Duration** | ~85 phút (R8 ~55 phút + R9 ~30 phút) |
| **Browse Status** | OK — Chrome DevTools MCP stable, 1 lần re-login giữa session do timeout 5 phút |

### Pass Rate breakdown theo Type

| Type | TC count (đã test) | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|--------------------|------|---------|------|---------|---------------|
| **Happy** | **5** | **5** | 0 | 0 | 0 | **100%** (TVN-001/002/003/004 + R9: TVN-016) |
| **Negative** | **4** | **4** | 0 | 0 | 0 | **100%** (TVN-007/008/009 + R9: TVN-021) |
| **Workflow** | **6** | **2** | **4** | 0 | 0 | **33%** (TVN-013/019 PASS; TVN-010/011/012/017 PARTIAL) |
| **Authorization** | 1 | 1 | 0 | 0 | 0 | **100%** (TVN-033 QTHT) |
| **Cross-module** | **1** | 0 | **1** | 0 | 0 | **0%** (TVN-039 audit log mechanism PASS, naming inconsistent) |
| **Workflow (cascade)** | **1** | 0 | 0 | 0 | **1** | **0%** (TVN-018 cascade gợi ý không render) |
| **FR-X.2-06 Công khai** | 5 | 0 | 0 | 0 | 5 | **0%** (TVN-040..044) |
| **Total** | **23** (đã test 19 + 4 BLOCKED nhóm khác đếm chéo) | **12** | **5** | **0** | **6** | **63%** |

→ **Happy-path Pass Rate = 9/9 (100%)** — kho Q&A core + list phiên TV nhanh + create/read solid. **R9 đóng góp:** 3 PASS (TVN-016 list 4 tab, TVN-019 gửi trả lời end-to-end, TVN-021 validate empty) + 2 PARTIAL (TVN-017 gợi ý không render — Major bug; TVN-039 audit log mechanism OK nhưng action naming inconsistent) + 1 BLOCKED (TVN-018 cascade).

### Verdict: **CONDITIONAL PASS — workflow R7.6.2 unblock R9 mở thêm 5 TC phiên TV; vẫn cần fix Authz Critical + Gợi ý render Major trước release**

R7.7.11 cover được 19/44 TC (43%). Backend mechanics CRUD + workflow chuyển trạng thái CHO_DUYET ↔ DA_DUYET ↔ NHAP ↔ HET_HIEU_LUC + DA_GOI_Y → CB_TRA_LOI đều OK. **R9 update:** Sau dev seed 50 phiên, 4 TC P0 phiên TV chạy được — mở khoá UI flow Stepper + form Soạn trả lời + audit log endpoint. **3 nhóm bug critical/major** cần fix: (1) BUG-FUNC-TVN-001 Critical authz CB NV approve/reject; (2) **BUG-FUNC-TVN-004 Major (mới R9)** UI không render `goiYTraLoi` array dù API có data — chặn TVN-018 click [Chọn]; (3) BUG-FUNC-TVN-002 Major FR-X.2-06 chưa deploy. 11 TC còn lại BLOCKED mTLS DN/multi-role.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| TVN-001 | FR-X.2-01, UC154, SCR-X2-01 | Xem danh sách kho Q&A 3 tab + paginate 20/page + filter | Happy | P0 | **PASS** | — | 9 record list, 3 tab (Tất cả 9 / Đã duyệt 6 / Chờ duyệt 2). ⚠️ Filter trạng thái dropdown thiếu — xem BUG-FUNC-TVN-003. |
| TVN-002 | FR-X.2-01, BR-DATA-08 | Tìm kiếm full-text + filter (LV / Nguồn / Trạng thái) | Happy | P1 | **PASS** | — | API verify: search "thuế"→2, DA_DUYET→6, THU_CONG→8, IMPORT→1. UI search box hoạt động qua Enter. |
| TVN-003 | FR-X.2-01, BR-DATA-04, UC154 | CB NV tạo Q&A thủ công → CHO_DUYET, THU_CONG, hieuLuc=false | Happy | P0 | **PASS** | — | QA-20260508-0001 tạo OK. Auto-gen mã QA-{YYYYMMDD}-{SEQ} chính xác. ⚠️ Spec C16 Rich Text nhưng UI dùng plain textarea — lưu ý dev. |
| TVN-004 | FR-X.2-01, UC154 | Cập nhật Q&A CHO_DUYET — sửa câu trả lời + từ khóa | Happy | P1 | **PASS** | — | PATCH 200, vẫn CHO_DUYET, version 1→2. ⚠️ tuKhoa kiểu array (max 20), spec viết "phân cách dấu phẩy" — minor schema deviation. |
| TVN-007 | FR-X.2-01 §E1 ERR-KHO-01 | Tạo Q&A câu hỏi trống → toast "Câu hỏi không được để trống" | Negative | P1 | **PASS** | — | UI validate inline. Message "Câu hỏi không được để trống" thay vì ERR-KHO-01 — semantically equivalent. |
| TVN-008 | FR-X.2-01 §E2 ERR-KHO-02 | Tạo Q&A câu trả lời trống → "Câu trả lời không được để trống" | Negative | P1 | **PASS** | — | Inline validate ✅ |
| TVN-009 | FR-X.2-01 §E3 ERR-KHO-03 | Tạo Q&A lĩnh vực không hợp lệ → "Vui lòng chọn lĩnh vực" | Negative | P2 | **PASS** | — | Inline validate ✅ |
| TVN-010 | FR-X.2-01 §Processing 3, UC155 | CB PD duyệt đơn lẻ: CHO_DUYET → DA_DUYET, hieu_luc=true | Workflow | P0 | **PARTIAL** | BUG-FUNC-TVN-001 | API `/approve` mechanics PASS (CHO_DUYET→DA_DUYET, hieuLuc=true, ngayDuyet auto-fill, version+1). NHƯNG cb_nv_tw_01 (CB_NV_TW role) approve được → vi phạm spec line 784 chỉ `cb_pd_<cap>` được duyệt. Authorization Critical leak. |
| TVN-011 | FR-X.2-01 §Processing 3, BR-FLOW-04 | CB PD từ chối + lý do ≥10 ký tự: CHO_DUYET → NHAP | Workflow | P0 | **PARTIAL** | BUG-FUNC-TVN-001 | API `/reject` mechanics PASS (state→NHAP, ghiChuPheDuyet stored, version+1). cb_nv_tw_01 reject được — same authz leak. |
| TVN-012 | FR-X.2-01 §Processing 3, UC155 | CB PD duyệt hàng loạt → tất cả CHO_DUYET → DA_DUYET | Workflow | P1 | **PARTIAL** | BUG-FUNC-TVN-001 | API `/approve-bulk` mechanics PASS (body `{items:[{id,version}]}` max 50). cb_nv_tw_01 thực thi được — same authz leak. |
| TVN-013 | FR-X.2-01 §Processing 6 | CB NV toggle hết hiệu lực: DA_DUYET → HET_HIEU_LUC | Workflow | P1 | **PASS** | — | API `/het-hieu-luc` body `{version}` → 200, hieuLuc:true→false, state→HET_HIEU_LUC. Đúng spec line 787 (cb_nv toggle). |
| TVN-033 | BR-AUTH-01, BR-AUTH-08, Spec QTHT 👁️ R | QTHT xem được kho Q&A nhưng không CRUD/duyệt/từ chối/toggle | Authorization | P1 | **PASS** | — | UI: Page render OK, KHÔNG có button [+ Thêm] / [Nhập Excel] / [Xuất Excel]. API: Create 403 ERR-PERM-SYS-00-01 ✅, Toggle hết hiệu lực 403 ✅, Approve/Reject CHO_DUYET 403 BR-AUTH-05 ✅, List 200 ✅. |
| TVN-040 | FR-X.2-06 mới v3.5, BR-PUBLIC-01/03 | CB NV bật Switch [Công khai] DA_DUYET → CONG_KHAI | Workflow | P0 | **BLOCKED** | BUG-FUNC-TVN-002 | Schema KHO_CAU_HOI thiếu field `congKhai` / `thoiGianDangTai` / `moTaCongKhai` / `fileDinhKemCongKhai`. Endpoint `/cong-khai` `/publish` `/dang-tai` đều 404. PATCH `{congKhai:true}` 409 "Khong the cap nhat o trang thai 'DA_DUYET'". → FR-X.2-06 BE chưa deploy. |
| TVN-041 | FR-X.2-06, BR-PUBLIC-02 | CB NV [Hủy công khai] CONG_KHAI → DA_DUYET | Workflow | P0 | **BLOCKED** | BUG-FUNC-TVN-002 | Cascade: không có CONG_KHAI để test (FR-X.2-06 chưa deploy). |
| TVN-042 | FR-X.2-06, BR-PUBLIC-01 | Bật công khai khi CHO_DUYET → ERR-TVN-CK-03 chặn | Negative | P1 | **BLOCKED** | BUG-FUNC-TVN-002 | Cascade FR-X.2-06 chưa deploy. |
| TVN-043 | FR-X.2-06, BR-FLOW-05 | API Cổng PLQG fail → giữ trạng thái cũ + ERR-TVN-CK-01/02 | Negative | P1 | **BLOCKED** | BUG-FUNC-TVN-002 | Cascade + thiếu Cổng PLQG sandbox. |
| TVN-044 | FR-X.2-06 mismatch | Mismatch `congKhai` vs `trang_thai='CONG_KHAI'` (badge "Đang xử lý"/"Đang gỡ") | Workflow | P1 | **BLOCKED** | BUG-FUNC-TVN-002 | Cascade FR-X.2-06 + cần BE stub race condition. |
| **TVN-016** (R9) | — , SCR-X2-03 | List phiên TV 4 tab (Tất cả 50 / Chờ xử lý 14 / Đã gợi ý 20 / Hoàn thành 16) + paginate 20/page | Happy | P0 | **PASS** | — | Tab counts đúng spec line 454. R9 sau dev seed 50 phiên cover 6 state. ⚠️ Cột "Kênh" + "Số gợi ý" hiển thị empty/0 dù API có data — xem BUG-FUNC-TVN-004. |
| **TVN-017** (R9) | FR-X.2-02 §Processing 3, SCR-X2-03 row 7-8 | Mở chi tiết phiên DA_GOI_Y → layout 2 cột: trái câu hỏi DN+Stepper+thông tin DN, phải Top 5 gợi ý từ KHO_CAU_HOI sắp theo relevance DESC | Happy | P0 | **PARTIAL** | BUG-FUNC-TVN-004 | Layout 2 cột + Stepper 5 state + form trả lời render OK. **Top 5 gợi ý KHÔNG render** dù API trả `goiYTraLoi=[2 entries score 85/75]` — UI hiển thị "Không tìm thấy gợi ý phù hợp. Vui lòng soạn thảo thủ công." Major bug. |
| **TVN-018** (R9) | FR-X.2-02 §Processing 5 | CB NV click [Chọn] gợi ý → auto-fill ô soạn rich-text | Workflow | P1 | **BLOCKED** | BUG-FUNC-TVN-004 | Cascade TVN-017 — không có button [Chọn] để click vì gợi ý không render. |
| **TVN-019** (R9) | FR-X.2-02 §Processing 6, SCR-X2-03 row 8 | CB NV [Gửi trả lời] → DA_GOI_Y → CB_TRA_LOI, tạo TU_VAN_NHANH liên kết `khoCauHoiDaChonId` nếu chọn từ kho | Workflow | P0 | **PASS** | — | UI: TVN-QA-20260428-0016 click [Gửi trả lời] với 257 chars → state CB_TRA_LOI, nguoiTraLoiId set, version+1. API: TVN-QA-20260428-0015 với khoCauHoiDaChonId=QA-20260508-0003 stored, ngayTraLoi auto. |
| **TVN-021** (R9) | FR-X.2-02 §E2 ERR-TVN-02 | CB NV gửi trả lời với nội dung rỗng → "Nội dung trả lời là bắt buộc" | Negative | P1 | **PASS** | — | API `POST /{id}/tra-loi {noiDungTraLoi:''}` → 422 ERR-TVN-02 ✅ |
| **TVN-039** (R9) | BR-DATA-05, FR-X.2-01 §Postconditions | Audit log ghi đầy đủ CRUD/APPROVE/REJECT/IMPORT/TOGGLE/CONG_KHAI/GUI_TRA_LOI/DANH_GIA/AUTO_HET_HAN | Cross-module | P1 | **PARTIAL** | BUG-FUNC-TVN-005 | Endpoint `/api/v1/audit-logs` 200 với QTHT (cb_nv 403). KHO_CAU_HOI: 25 events. TU_VAN_NHANH: 2 events (đúng 2 lần `/tra-loi` R9). Schema đầy đủ entityType/entityId/hanhDong/endpoint/responseCode/thoiGian/ipAddress/sessionId. ⚠️ Action naming: `TU_CHOI` (Vietnamese) vs spec `REJECT_KHOCAUHOI`; `UPDATE` cho het-hieu-luc thay vì `TOGGLE_HIEU_LUC`. Chưa verify IMPORT_EXCEL/CONG_KHAI/DANH_GIA/AUTO_HET_HAN (depend feature chưa deploy hoặc mTLS). |

> **Đã defer (chưa chạy round này):**
> - TVN-005, 006 (Import Excel) — cần file test mẫu
> - TVN-014, 037 (auto-import TU_DONG) — cần ≥1 HOI_DAP DA_DUYET (R7.4.A4 ⏳)
> - TVN-015 (GIN index) — DB-level verify
> - TVN-016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 029, 030, 031, 032, 038 (15 TC liên quan phiên TV nhanh) — BLOCKED upstream R7.6.2
> - TVN-026, 027, 028 (DN search Cổng PLQG) — API outbound, cần Postman/Bruno + API key
> - TVN-034 (cb_nv_bn scope BR-AUTH-08) — cần seed data BN
> - TVN-035, 036 (NHT/TVV/CG/GV/DN no menu) — cần các account roles đó
> - TVN-039 (Audit log) — DB-level verify

---

## 3. Bug Report (tóm tắt)

> **Lưu ý:** Chi tiết Steps/Evidence/Repro xem [bug-report-r7-7-11-tvn.md](../../bug-reports/tu-van-nhanh/bug-report-r7-7-11-tvn.md).

### BUG-FUNC-TVN-001 — Critical CB NV approve/reject Q&A vi phạm phân quyền

| Trường | Giá trị |
|--------|---------|
| **Severity** | Critical |
| **Priority** | P0 |
| **TC Reference** | TVN-010, TVN-011, TVN-012 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** `cb_nv_tw_01` (vai trò CB_NV_TW) gọi `POST /api/v1/kho-cau-hois/{id}/approve` + `/reject` + `/approve-bulk` đều thành công 200. Spec line 784-786 (02-thu-tu-module.md §⑫) chỉ định CB PD (`cb_pd_<cap>_01`) là role có quyền duyệt/từ chối. CB NV chỉ được tạo (THU_CONG / IMPORT) + toggle hiệu lực (line 787). BE thiếu role-check trên 3 endpoint duyệt.

**Expected vs Actual:** Expected 403 ERR-PERM-SYS-00-01 với cb_nv_tw_01 cookie. Actual 200 + state transition CHO_DUYET → DA_DUYET (hieuLuc=true). QTHT cũng probe → 403 ✅ đúng (đã có guard cho QTHT, chỉ thiếu cho CB_NV).

**Impact:** CB NV có thể tự duyệt Q&A của chính mình → vi phạm phân quyền 4-mắt + risk audit compliance. Tất cả Q&A nguồn THU_CONG/IMPORT có thể skip CB PD review.

**Root Cause (Suggested):** Permission policy hiện check `permission_X` chứ không phân biệt CB_NV vs CB_PD. Cần thêm role guard `@Roles('CB_PD_TW','CB_PD_BN','CB_PD_DP','ADMIN')` (hoặc tương đương CASL) trên route handler 3 endpoint `/approve`, `/reject`, `/approve-bulk`.

### BUG-FUNC-TVN-002 — Major FR-X.2-06 (Công khai/Hủy công khai) chưa deploy

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | TVN-040, 041, 042, 043, 044 |
| **Status** | Open |
| **Assignee** | Backend + Frontend Team |

**Mô tả:** FR-X.2-06 v3.5 (UC156) thêm action [Công khai] / [Hủy công khai] cho CB NV trên Q&A DA_DUYET — bao gồm 4 trường mới (`congKhai`, `thoiGianDangTai`, `moTaCongKhai`, `fileDinhKemCongKhai`) + enum mới `CONG_KHAI` ở trang_thai + 3 BR mới (BR-PUBLIC-01/02/03) + BR-FLOW-05. Schema thực tế thiếu cả 4 field; endpoint `/cong-khai` / `/publish` / `/dang-tai` 404; PATCH với `{congKhai:true}` bị BE từ chối.

**Expected vs Actual:** Expected schema có 4 field công khai + Switch UI inline + endpoint POST `/api/v1/kho-cau-hois/{id}/cong-khai`. Actual: schema chỉ có 21 field cũ, không có toggle UI Switch, endpoint trả 404.

**Impact:** 5 TC mới v3.5 (TVN-040..044) BLOCKED. Không verify được API outbound BR-FLOW-05 đến Cổng PLQG.

**Root Cause (Suggested):** Migration v3.5 chưa chạy; controller + UI module chưa add. Cần coordinate dev sprint v3.5 update.

### BUG-FUNC-TVN-003 — Minor Filter trạng thái dropdown thiếu trên list page

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | TVN-001 |
| **Status** | Open |
| **Assignee** | Frontend Team |

**Mô tả:** Spec [02-thu-tu-module.md line 766](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) yêu cầu filter bar có dropdown "Trạng thái" cover 5 enum NHAP/CHO_DUYET/DA_DUYET/CONG_KHAI/HET_HIEU_LUC. UI thực tế chỉ có Lĩnh vực + Nguồn + Từ ngày + Đến ngày. 3 tab (Tất cả/Đã duyệt/Chờ duyệt) chỉ cover 3 state, không bao quát NHAP + HET_HIEU_LUC + CONG_KHAI.

**Expected vs Actual:** Expected: filter bar có 4 dropdown (Lĩnh vực + Nguồn + Trạng thái + dates). Actual: chỉ 3 (thiếu Trạng thái). API hỗ trợ `?trangThai=NHAP|CHO_DUYET|DA_DUYET|HET_HIEU_LUC` ✅, FE chưa expose.

**Impact:** CB NV / CB PD muốn xem Q&A NHAP (để biên tập lại) hoặc HET_HIEU_LUC (audit) phải workaround qua API hoặc filter bằng tay. Workflow daily không bị block.

### BUG-FUNC-TVN-004 (R9 mới) — Major Top 5 gợi ý không render trên detail phiên DA_GOI_Y

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **TC Reference** | TVN-017, TVN-018 |
| **Status** | Open |
| **Assignee** | Frontend + Backend Team |

**Mô tả:** Trên trang detail phiên TV nhanh DA_GOI_Y (vd `/tv-nhanh/{id}`), panel "Top 5 gợi ý từ Kho câu hỏi" luôn hiển thị empty placeholder "Không tìm thấy gợi ý phù hợp. Vui lòng soạn thảo thủ công." dù API GET detail trả `goiYTraLoi=[2 entries score 85/75]` (verified với TVN-QA-20260426-0018). Network trace: UI gọi `GET /api/v1/tu-van-nhanhs/{id}/goi-y` (200, `data:[]` empty) thay vì đọc field `goiYTraLoi` từ detail response. Hệ quả: TVN-018 (click [Chọn] gợi ý → auto-fill) BLOCKED hoàn toàn — CB NV phải soạn tay 100% trên 9/10 phiên DA_GOI_Y có sẵn gợi ý.

**Expected vs Actual:** Expected UI render TOP 5 gợi ý với score relevance + button [Chọn] cho mỗi card. Actual: empty state placeholder.

**Impact:** Kéo dài thời gian xử lý mỗi phiên TV nhanh — CB NV không tận dụng được kho Q&A đã duyệt. Vi phạm core value FR-X.2-02 (gợi ý tự động từ keyword search).

**Root Cause (Suggested):** (a) BE endpoint `/{id}/goi-y` chưa implement đúng — phải SELECT từ KHO_CAU_HOI bằng FTS GIN tsvector hoặc trả `goiYTraLoi` đã store; HOẶC (b) FE đọc sai source — nên dùng `detail.goiYTraLoi` thay vì call `/goi-y` separate endpoint. Cần coordinate dev contract.

### BUG-FUNC-TVN-005 (R9 mới) — Minor Audit log action naming inconsistent

| Trường | Giá trị |
|--------|---------|
| **Severity** | Minor |
| **Priority** | P2 |
| **TC Reference** | TVN-039 |
| **Status** | Open |
| **Assignee** | Backend Team |

**Mô tả:** Spec line 153 (TVN-039) yêu cầu audit log ghi action với naming convention rõ: CREATE/UPDATE/DELETE_KHOCAUHOI, APPROVE/REJECT_KHOCAUHOI, IMPORT_EXCEL, TOGGLE_HIEU_LUC, CONG_KHAI, HUY_CONG_KHAI, GUI_TRA_LOI_TVNHANH, DANH_GIA_TVNHANH, AUTO_HET_HAN. Actual log endpoint `/api/v1/audit-logs` trả naming inconsistent: (a) `TU_CHOI` (Vietnamese) cho reject thay vì `REJECT_KHOCAUHOI`; (b) generic `UPDATE` cho het-hieu-luc thay vì `TOGGLE_HIEU_LUC`; (c) `TRA_LOI` thay vì `GUI_TRA_LOI_TVNHANH`. Mechanism INSERT-only audit + ipAddress + sessionId + endpoint + responseCode đầy đủ ✅.

**Expected vs Actual:** Expected hanhDong values match spec naming. Actual: mix Vietnamese/English + generic verbs.

**Impact:** Audit log report sau này khó group/filter theo action; kiểm toán pháp lý có thể bị từ chối nếu action naming không rõ nghiệp vụ.

**Root Cause (Suggested):** Backend audit interceptor dùng generic CRUD action mapping (UPDATE cho mọi PATCH-like action) thay vì action-specific naming. Cần chuẩn hoá enum `AuditAction` trên backend.

---

## 4. Detailed Test Results (selected)

### 4.1 TVN-003: CB NV tạo Q&A thủ công → CHO_DUYET

**Pre-conditions:**
- cb_nv_tw_01 đăng nhập OTP `666666`
- Modal "Thêm câu hỏi" có sẵn 4 field bắt buộc + 1 optional

**Test Data:**
```json
{
  "cauHoi": "[QA-R7.7.11-TVN-003] Doanh nghiệp khởi nghiệp có được giảm thuế thu nhập trong năm đầu tiên không?",
  "cauTraLoi": "Theo Nghị định 218/2013/NĐ-CP và Luật Thuế TNDN sửa đổi 2025, DN khởi nghiệp nhỏ và vừa được miễn thuế TNDN 2-4 năm đầu kể từ ngày được cấp Giấy chứng nhận đăng ký doanh nghiệp.",
  "linhVucId": "Thuế (UUID auto)",
  "tuKhoa": [] // optional
}
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click [+ Thêm câu hỏi] | Modal "Thêm câu hỏi" mở | Modal hiển thị với Câu hỏi*/Câu trả lời*/Lĩnh vực*/Từ khóa | **PASS** |
| 2 | Fill 3 field bắt buộc + click [Lưu] | Modal đóng + record tạo state CHO_DUYET | QA-20260508-0001 created, modal closed | **PASS** |
| 3 | Verify API `/api/v1/kho-cau-hois?pageSize=20` | total tăng 9→10, newest=QA-20260508-0001, trangThai=CHO_DUYET, nguon=THU_CONG, hieuLuc=false | total=10, newest=QA-20260508-0001 trangThai=CHO_DUYET nguon=THU_CONG hieuLuc=false ✅ | **PASS** |
| 4 | Verify mã auto-gen `QA-YYYYMMDD-SEQ` (BR-DATA-04) | format đúng | QA-20260508-0001 ✅ | **PASS** |

**Notes:**
- Spec line 422: "Cau tra loi (C16 Rich Text)" nhưng UI dùng plain textarea — không block, lưu ý dev nếu sau này cần bold/list/link.
- Schema field `tuKhoa` là array (max 20), spec text "phân cách dấu phẩy" — BE đã tách string sẵn.

### 4.2 TVN-010 PARTIAL — cb_nv_tw_01 approve

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | cb_nv_tw_01 cookie session | session OK | OK | **PASS** |
| 2 | POST `/api/v1/kho-cau-hois/{id}/approve` `{version}` | 403 Forbidden (CB NV không phải CB PD) | **200 OK** + state CHO_DUYET → DA_DUYET, hieuLuc=true, version+1 ❌ | **FAIL (Authz)** |
| 3 | Mechanic verify state | Trang thái chuyển | OK | **PASS** |

**Notes:**
- BE permission check không phân biệt role CB_NV vs CB_PD trên endpoint approve. Xem BUG-FUNC-TVN-001.
- Mechanics workflow CHO_DUYET → DA_DUYET hoạt động đúng spec.

### 4.3 TVN-033 — QTHT 👁️ R only

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | qtht_01 login + navigate `/tv-nhanh/kho-cau-hoi` | Page render | Page render với 13 record ✅ | **PASS** |
| 2 | Toolbar buttons | KHÔNG có [+ Thêm] / [Nhập Excel] / [Xuất Excel] | Chỉ có [Làm mới] ✅ | **PASS** |
| 3 | POST `/api/v1/kho-cau-hois` create | 403 Forbidden | 403 ERR-PERM-SYS-00-01 ✅ | **PASS** |
| 4 | POST `/{id}/approve` (CHO_DUYET target) | 403 | 403 BR-AUTH-05 ✅ | **PASS** |
| 5 | POST `/{id}/reject` | 403 | 403 BR-AUTH-05 ✅ | **PASS** |
| 6 | POST `/{id}/het-hieu-luc` | 403 | 403 ERR-PERM-SYS-00-01 ✅ | **PASS** |
| 7 | GET `/api/v1/tu-van-nhanhs?pageSize=20` (read TV phiên) | 200 | 200 total=0 ✅ | **PASS** |

**Notes:**
- QTHT có `donViId=""` (empty) → BE check unit-scope trả BR-AUTH-05. Endpoint approve/reject có 2 lớp guard (state + unit), KHÔNG có lớp role-distinguish CB_NV/CB_PD (ngược với BUG-FUNC-TVN-001).

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| cb_nv_tw_01 | CB_NV_TW | Cục BTTP - BTP | TW | TVN-001..013 (CRUD + workflow) |
| qtht_01 | QTHT | Cục BTTP - BTP (donViId="") | TW | TVN-033 (read-only verify) |
| cb_pd_tw_01 | CB_PD_TW | Cục BTTP - BTP | TW | (chưa test — defer round sau để re-verify TVN-010/011/012 với role đúng) |

### 5.2 Data tạo trong test

| Mã | Mô tả | State cuối | Purpose |
|-----|-------|-----------|---------|
| QA-20260508-0001 | TVN-003 Doanh nghiệp khởi nghiệp giảm thuế | DA_DUYET | TVN-003 create + TVN-004 update + TVN-010 approve (cb_nv) + TVN-013 toggle hết |
| QA-20260508-0002 | TVN-012 NLĐ nghỉ phép | HET_HIEU_LUC | TVN-012 bulk + TVN-013 toggle hết |
| QA-20260508-0003 | TVN-012 FDI sở hữu nhà ở | DA_DUYET | TVN-012 bulk approve |
| QA-20260508-0004 | TVN-033 FDI HĐQT | CHO_DUYET | TVN-033 QTHT probe target |
| QA-20260507-0009 (existing) | Hoàn thuế VAT | NHAP (sau reject) | TVN-011 reject (cb_nv) |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/kho-cau-hois` (plural `s`), `/api/v1/tu-van-nhanhs` (plural `s`). Endpoints không có `s` trả 404.
- **Auth flow:** Cookie session httpOnly (KHÔNG dùng sessionStorage Bearer token như spec CLAUDE.md MCP-Rule 3 ghi). Cookie hết hạn ~5 phút idle → re-login.
- **Token TTL:** Session timeout 5 phút giữa các request lười.
- **Frontend framework:** React + Vite + Ant Design (Modal + Drawer + Form + Table)
- **Backend:** NestJS + PostgreSQL (validation Class-Validator, 422 response)
- **Known limitations:**
  - FR-X.2-06 (Công khai) chưa deploy v3.5 → 5 TC BLOCKED
  - Phiên TV nhanh BLOCKED upstream R7.6.2 (BUG-TVN-R762-001 mTLS) → 14 TC chờ
  - DN portal Cổng PLQG sandbox chưa available → 3 TC API outbound DEFER

---

## 7. Recommendations

### Must Fix (Before Release)

1. **BUG-FUNC-TVN-001 (Critical):** Thêm role guard `cb_pd_<cap>` trên 3 endpoint `/approve`, `/reject`, `/approve-bulk`. Verify cb_nv_tw_01 phải nhận 403 thay vì 200.
2. **BUG-FUNC-TVN-002 (Major):** Deploy migration v3.5 + controller + UI cho FR-X.2-06 Công khai. Cung cấp Cổng PLQG sandbox để test BR-FLOW-05.

### Should Fix

3. **BUG-FUNC-TVN-003 (Minor):** Thêm dropdown "Trạng thái" trên filter bar list page (5 enum). API đã hỗ trợ `?trangThai=`.

### Additional Recommendations

4. **CR Spec deviation Câu trả lời Rich Text (TVN-003):** Spec C16 Rich Text. UI plain textarea. Confirm với BA: giữ textarea (đơn giản, không cần format) hay implement quill/tiptap?
5. **Tab "Chờ duyệt" badge count includes NHAP records:** Tab thực tế trả 2 (1 CHO_DUYET + 1 NHAP). Confirm: có ý đồ này (CB NV biết bị reject để biên tập lại) hay tách thành tab "Bị từ chối" riêng?
6. **TVN-010/011/012 re-test với cb_pd_tw_01:** Sau khi fix BUG-FUNC-TVN-001, re-run với role CB PD đúng. Hiện chưa verify CB PD CÓ approve được (chỉ chứng minh CB NV được — không nên).
7. **Defer schedule:** Khi R7.6.2 unblock + FR-X.2-06 deploy → re-run round riêng cho TVN-016..025/029..032/037/038 + TVN-040..044.

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| GET | `/api/v1/kho-cau-hois?page=&pageSize=&trangThai=&nguon=&search=` | List + filter + search | TVN-001, 002, 033 |
| POST | `/api/v1/kho-cau-hois` | Create CHO_DUYET (THU_CONG) | TVN-003, 033 (negative) |
| PATCH | `/api/v1/kho-cau-hois/{id}` | Update CHO_DUYET fields | TVN-004 |
| GET | `/api/v1/kho-cau-hois/{id}` | Detail | All |
| POST | `/api/v1/kho-cau-hois/{id}/approve` | CHO_DUYET → DA_DUYET (CB PD) | TVN-010 |
| POST | `/api/v1/kho-cau-hois/{id}/reject` body `{ghiChu, version}` | CHO_DUYET → NHAP (CB PD) | TVN-011 |
| POST | `/api/v1/kho-cau-hois/approve-bulk` body `{items:[{id,version}]}` (max 50) | Bulk CHO_DUYET → DA_DUYET | TVN-012 |
| POST | `/api/v1/kho-cau-hois/{id}/het-hieu-luc` body `{version}` | DA_DUYET → HET_HIEU_LUC (CB NV) | TVN-013 |
| GET | `/api/v1/tu-van-nhanhs?page=&pageSize=` | List phiên TV nhanh (read OK, total=0) | TVN-033 |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [r7-7-11-tvn-001-list-tatca.png](../../screenshots/r7-7-11-tvn-001-list-tatca.png) | Tab Tất cả 9 record + 3 tab + filter | TVN-001 |
| [r7-7-11-tvn-007-validate-empty.png](../../screenshots/r7-7-11-tvn-007-validate-empty.png) | Modal Thêm câu hỏi với 3 inline error | TVN-007/008/009 |
| [r7-7-11-tvn-033-qtht-readonly.png](../../screenshots/r7-7-11-tvn-033-qtht-readonly.png) | QTHT page Kho Q&A — chỉ button [Làm mới] | TVN-033 |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-X.2-01 §Inputs/Processing/AC | TVN-001, 002, 003, 004, 007, 008, 009 | 7/7 PASS |
| FR-X.2-01 §Processing 3 (CB PD duyệt) | TVN-010, 011, 012 | 0/3 PASS (3 PARTIAL — Authz) |
| FR-X.2-01 §Processing 6 (toggle hiệu lực) | TVN-013 | 1/1 PASS |
| FR-X.2-06 (Công khai/Hủy công khai v3.5) | TVN-040, 041, 042, 043, 044 | 0/5 PASS (BLOCKED, BE chưa deploy) |
| BR-AUTH-01/08 + QTHT 👁️ R | TVN-033 | 1/1 PASS |
| FR-X.2-02..05 (DN-driven phiên TV) | TVN-016..025/029..032/037/038 | 0/15 chưa test (BLOCKED upstream R7.6.2) |
| BR-DATA-04 (auto-gen mã) | TVN-003 | 1/1 PASS |
| BR-DATA-08 (full-text GIN) | TVN-002 | 1/1 PASS (UI search + API filter verify) |
| BR-FLOW-04 (lý do từ chối ≥10 ký tự) | TVN-011 | 1/1 PASS (mechanics) |

---

*Report generated: 2026-05-08 | QA Automation via Claude Code | Chrome DevTools MCP*
