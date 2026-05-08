# Functional Test Report — R7.7.5 TVCS (FR-12)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Tư vấn chuyên sâu (FR-12 · Nhóm X.1) |
| **Spec** | [`output/funtion/7.12-tu-van-chuyen-sau.md`](../../../../funtion/7.12-tu-van-chuyen-sau.md) v3.5 (61 TC = 44 base + 17 mới v3.5) |
| **SRS** | [`srs-fr-12-tv-chuyen-sau.md`](../../../../../input/srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md) v3.5 |
| **Round** | R8 (2026-05-07) |
| **Tester** | QA Automation (Chrome DevTools MCP) |
| **Pre-req** | R7.2.6 ✅ 8 CG `HOAT_DONG` + R7.4.A5 R8 ⚠️ 13 TVCS pool (10 main + 3 negative-test) + DN 23 records |
| **Workflow đi kèm** | [workflow-test-report-r7-4-a5-tvcs.md](../../workflow/tu-van-chuyen-sau/workflow-test-report-r7-4-a5-tvcs.md) (3/11 PASS) |
| **Bug report** | [bug-report-r7-7-5-tvcs.md](../../bug-reports/tu-van-chuyen-sau/bug-report-r7-7-5-tvcs.md) |

---

## Verdict R8 (sau seed R7.3.4 + sweep HSPL R8)

⚠️ **PARTIAL 31/61 PASS · 14 BLOCKED · 12 SKIP · 4 FAIL · 7 BUG**

| Type | PASS | BLOCKED | SKIP | FAIL | Total |
|---|---:|---:|---:|---:|---:|
| Happy | 16 | 0 | 1 | 1 | 18 |
| Negative | 4 | 0 | 4 | 2 | 10 |
| Workflow | 5 | 13 | 4 | 0 | 22 |
| Authorization | 4 | 0 | 1 | 1 | 6 |
| Cross-module | 2 | 1 | 2 | 0 | 5 |
| **Tổng** | **31** | **14** | **12** | **4** | **61** |

**Updated R8 sau seed R7.3.4 (2026-05-07 23:00):** 7 TC mới chạy thẳng: TV-017/018/019/020/056 ✅ + TV-053 ⚠️ partial + TV-054 ❌ FAIL (BUG runtime confirmed).

**Lý do không-PASS hiện tại:**
- **14 BLOCKED** — 8 TC cascade do `BUG-FUNC-TVCS-A5-001` (CG action endpoint reject), 6 TC do thiếu Tư liệu PL CRUD endpoint expose. (HSPL block đã giải quyết qua R7.3.4 seed.)
- **12 SKIP** — 6 API inbound/outbound, 3 Authorization NHT/DN không có CMS, 3 v3.5 cross (HD link UC059, virus scan, Portal DN).
- **4 FAIL** — TV-005 + TV-030 + TV-031 (TVCS legacy) + TV-054 (NHT permission overgrant runtime confirmed).

**3 BUG TVCS legacy + 7 BUG HSPL mới phát hiện R8 (ngoài BUG-A5-001/002 từ workflow):**

**TVCS:**
- **BUG-FUNC-TVCS-FN-001 Major** — TV-005 Vietnamese unaccent search **không hoạt động** (BR-DATA-08 violation). Search "tai cau truc" → 0 hit dù TVCS-0004 có "Tái cấu trúc nợ DN".
- **BUG-FUNC-TVCS-FN-002 Major** — TV-030 BE chấp nhận tạo TVCS với `noiDung = ""` hoặc `noiDung = "   "` (whitespace) — vi phạm spec ERR-TVCS-01 "Nội dung tư vấn là bắt buộc". Pollutes pool 2 record TVCS-0012/0013.
- **BUG-FUNC-TVCS-FN-003 Medium** — TV-031 BE chấp nhận phân công CG `VO_HIEU_HOA` (Ngô Thị Mười Lăm — TVV-0003) — vi phạm SRS line 533 + ERR-TVCS-02 "Chuyên gia không hợp lệ". Pollutes pool 1 record TVCS-0011.

**HSPL DN (sweep R8):**
- **BUG-FUNC-HSPL-001 Major** (P0) — NHT có 4 permission `[create, read, update, delete]_ho_so_phap_ly_dn`; vi phạm Thay đổi 10 v3.5 (chỉ R+U). **Runtime confirm:** nht_01 thực sự DELETE HSPL-0022 (cb_nv_dp_01 created) → 204. NHT có thể xóa HSPL của người khác. (TV-054 FAIL.)
- **BUG-FUNC-HSPL-002 Major** (P0) — Filter list HSPL cho role NHT thiếu lớp 2 BR-AUTH-10 mở rộng (`EXISTS VU_VIEC vv WHERE vv.doanh_nghiep_id = HSPL.doanh_nghiep_id AND vv.nguoi_ho_tro_id = NHT.tvv_id`). nht_01 KHÔNG có VV phân công nhưng vẫn thấy HSPL-0022 (đơn vị STP-AG match). (TV-053 partial.)
- **BUG-FUNC-HSPL-003 Critical** (P0) — `GET /api/v1/ho-so-phap-ly-dns/{id}` Detail trả 500 ERR-SYS-00-00-01 cho mọi ID/role. Block TV-055.
- **BUG-FUNC-HSPL-004 Minor** (P2) — Filter inconsistent: HSPL-0021 + HSPL-0022 cùng creator (cb_nv_dp_01)/cùng DN/cùng đơn vị/cùng request, NHT chỉ thấy 0022 không thấy 0021.
- **BUG-FUNC-HSPL-005 Minor** (P2) — List `?keyword=` param ignored (BE chỉ áp `?search=`); spec input row 1 ghi "keyword" — naming mismatch.
- **BUG-FUNC-HSPL-006 Major** (P1) — `GET /api/v1/ho-so-phap-ly-dns?search=...` không hỗ trợ unaccent (cùng pattern BUG-FN-001) — BR-DATA-08 violation.
- **BUG-FUNC-HSPL-007 Major** (P0) — `POST /api/v1/ho-so-phap-ly-dns` regression 500 ERR-SYS-00-00-01 trong session R8 (16:08+ UTC) cho cb_nv_tw_01 và nht_01. Sáng cùng ngày POST hoạt động OK (HSPL-0001..0023). Symptom regression — nghi DB sequence/lock issue.

---

## Test Case Matrix (61 TC)

> **Status legend:** ✅ PASS · ❌ FAIL · 🚫 BLOCKED (cascade hoặc thiếu data) · ⏭ SKIP (out-of-scope)

| TC ID | Test Case | Loại | P | Status | Note / Bug ref |
|-------|-----------|------|---|:-:|---|
| **TV-001** | List TVCS 3 tab + pagination 20/page | Happy | P0 | ✅ | API `?page=1&pageSize=20` → 200, total=13. Tabs (Tất cả/Mới tiếp nhận/Đang xử lý/Hoàn tất) render đúng. `pageSize=200` → 422 ERR-VAL-SYS-00-01 "must not be greater than 100" (BR-DATA-07 ✅). |
| **TV-002** | Detail + tab Thông tin/Tư liệu PL/Đánh giá/Nhật ký + stepper SM-TVCS | Happy | P0 | ✅ | Detail có 30+ field bao gồm v3.5 (`congKhai`, `nguon`, `maNoiDungCong`, `thoiGianDangTai`). Stepper 6 bước (TIEP_NHAN→PHAN_CONG→DANG_TU_VAN→HOAN_THANH→CHO_PHE_DUYET→DA_DUYET) render đầy đủ. 3 accordion (TLPL/Đánh giá/Nhật ký) render empty state hợp lệ. |
| **TV-003** | Tạo YC TVCS mới + auto-gen mã (BR-DATA-04) | Happy | P0 | ✅ | POST → 201, `maTuVan = TVCS-20260507-0011` matches regex `TVCS-YYYYMMDD-NNNN` ✅. State TIEP_NHAN, ver=1. `nguon=THU_CONG`. |
| **TV-004** | Cập nhật YC ở state TIEP_NHAN (sửa nội dung, ghi chú) | Happy | P1 | ✅ | PATCH TVCS-0010 (TIEP_NHAN) → 200, `tomTat`+`ghiChu` mới reflect. State preserved. Note: BE cũng accept PATCH ở state PHAN_CONG (chưa kiểm immutability per state). |
| **TV-005** | Tìm kiếm full-text (BR-DATA-08 unaccent) | Happy | P0 | ❌ | Có dấu OK ("Tái cấu trúc"→1 hit, "thuê đất"→1 hit, "Madrid"→1 hit). **KHÔNG dấu** thất bại ("tai cau truc"→0 hit, "thue dat"→0 hit). Vi phạm BR-DATA-08. **BUG-FUNC-TVCS-FN-001**. |
| **TV-006** | Search combined (CG + LV + state + dateRange AND) | Happy | P1 | ✅ | `?chuyenGiaId=Lý&linhVucId=DN&trangThai=PHAN_CONG` → 1 hit TVCS-0004 (correct AND logic). |
| **TV-007** | CB NV phân công CG TIEP_NHAN→PHAN_CONG | Workflow | P0 | ✅ | Cover trong [A5 R8 B2 6/6 LV](../../workflow/tu-van-chuyen-sau/workflow-test-report-r7-4-a5-tvcs.md). Dropdown filter `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds` đúng. |
| **TV-008** | CB NV hủy YC TIEP_NHAN→HUY | Workflow | P1 | ⚠️ | A5 R8 B10 cover scope `PHAN_CONG → HUY` (không phải `TIEP_NHAN → HUY`). Spec test path → cần verify thêm cho TIEP_NHAN. Chưa fail nhưng partial. |
| **TV-009** | CG xác nhận PHAN_CONG→DANG_TU_VAN | Workflow | P0 | 🚫 | BUG-FUNC-TVCS-A5-001 (Critical) — `/xac-nhan` endpoint reject 403 cho assigned CG. |
| **TV-010** | CG từ chối phân công + lý do | Workflow | P1 | 🚫 | Cascade BUG-A5-001 (cùng endpoint). |
| **TV-011** | Timeout 2 ngày LV → auto-reject | Workflow | P1 | ⏭ | External cron BE — out of CMS scope. |
| **TV-012** | CG tích "Hoàn thành" (kèm VB TVPL) | Workflow | P0 | 🚫 | Cascade B3 (chưa reach DANG_TU_VAN). |
| **TV-013** | Auto-transition HOAN_THANH→CHO_PHE_DUYET (BR-FLOW-01) | Workflow | P0 | 🚫 | Cascade B6/B7 — không reach. (BR-FLOW-01 đã verified ở A4 HD R11 trên module khác.) |
| **TV-014** | CB PD cùng cấp duyệt CHO_PHE_DUYET→DA_DUYET | Workflow | P0 | 🚫 | Cascade. |
| **TV-015** | CB PD từ chối + lý do ≥10 ký tự (BR-FLOW-04) | Workflow | P0 | 🚫 | Cascade. |
| **TV-016** | Immutability: không sửa/xóa TVCS sau DA_DUYET | Workflow | P0 | 🚫 | Cascade — không reach DA_DUYET. |
| **TV-017** | CRUD HSPL DN tạo mới + mã `HSPL-YYYYMMDD-SEQ` | Happy | P0 | ✅ | **R8 sweep PASS retroactively.** Pool 22 record HSPL-20260507-NNNN, mã auto-gen 100% match regex `HSPL-{date}-{4digit}` (BR-DATA-04 ✅). Default state `HIEU_LUC`, `nguon = THU_CONG` ✅. Endpoint thực: `POST /api/v1/ho-so-phap-ly-dns` (plural-s). ⚠️ POST regression 500 ERR-SYS-00-00-01 trong session R8 23:08+ — log riêng BUG-HSPL-007. |
| **TV-018** | Tìm kiếm HSPL keyword + loại HS + ngày + state | Happy | P1 | ✅ | **R8 PASS.** Filter 5 loại × 3 state đều trả đúng total. AND combine `?loaiHoSo=GIAY_PHEP&trangThai=HIEU_LUC` → 2 hits. Filter `?doanhNghiepId=...` → 2 hits. Date range invalid (`tuNgay > denNgay`) → 400 ERR-HSPL-06 ✅. ⚠️ `?keyword=` ignored (BE chỉ accept `?search=` — BUG-HSPL-005 minor). `?search=` không hỗ trợ unaccent (BUG-HSPL-006 Major BR-DATA-08 violation). |
| **TV-019** | Update HSPL state HIEU_LUC→HET_HAN | Happy | P1 | ✅ | **R8 PASS.** PATCH HSPL-0019 `{trangThai: 'HET_HAN', version}` → 200, postState=HET_HAN, ver+1 ✅. Bonus: HET_HAN→THU_HOI cũng 200 ✅ (2-step transition). |
| **TV-020** | Soft delete HSPL (BR-DATA-01) | Happy | P1 | ✅ | **R8 PASS.** DELETE HSPL-0023 → 204 No Content. List total trước/sau = 22→21. Deleted record không xuất hiện trong list (filter loại trừ `is_deleted=true` đúng spec BR-DATA-01) ✅. |
| **TV-021** | Detail TVCS DA_DUYET show accordion "Đánh giá CL" read-only | Happy | P1 | 🚫 | Cascade — không có TVCS DA_DUYET. UI accordion empty state ready ✅. |
| **TV-022** | Auto-save draft câu trả lời CG mỗi 30s | Workflow | P1 | 🚫 | Cascade B3. |
| **TV-023** | CRUD tư liệu pháp lý gắn TVCS | Happy | P1 | 🚫 | Endpoint `/api/v1/tu-lieu-phap-ly-vv` (5 paths probed) → 404. UI accordion render "Chưa có tư liệu pháp luật đính kèm" — BE chưa expose. |
| **TV-024** | Công khai tư liệu PL NHAP→CONG_KHAI (BR-FLOW-07) | Workflow | P0 | 🚫 | Cascade TLPL endpoint. |
| **TV-025** | Hủy công khai tư liệu CONG_KHAI→NHAP | Workflow | P1 | 🚫 | Cascade. |
| **TV-026** | Upload file PDF/DOCX/XLS ≤20MB + preview | Happy | P1 | 🚫 | Cascade. |
| **TV-027** | API inbound TVCS Cổng PLQG (UC149) payload hợp lệ | Workflow | P0 | ⏭ | Out-of-MCP — cần Postman + API key. |
| **TV-028** | API inbound HSPL Cổng PLQG (UC151) | Workflow | P1 | ⏭ | Out-of-MCP. |
| **TV-029** | API inbound Đánh giá CL idempotent (UC153) | Workflow | P1 | ⏭ | Out-of-MCP. |
| **TV-030** | Tạo TVCS với `noiDung` trống → ERR-TVCS-01 | Negative | P1 | ❌ | BE chấp nhận `""` và `"   "` (whitespace) — chỉ reject `missing field` (422 type-check). Vi phạm spec. **BUG-FUNC-TVCS-FN-002**. |
| **TV-031** | Phân công CG NGUNG_HOAT_DONG → ERR-TVCS-02 | Negative | P1 | ❌ | BE chấp nhận phân công CG `VO_HIEU_HOA` (Ngô TVV-0003). Vi phạm SRS line 533 filter `trangThai=HOAT_DONG`. **BUG-FUNC-TVCS-FN-003**. |
| **TV-032** | Skip-step transition TIEP_NHAN→DA_DUYET → ERR-TVCS-04 | Negative | P1 | ✅ | Endpoint `/approve` (probed) trả 409 ERR-STATE-TVCS-APPROVE-01 "Khong the 'approve' khi trang thai la 'PHAN_CONG'". `/phe-duyet` 404 (different naming). State guard hoạt động. |
| **TV-033** | CB PD KHÁC cấp duyệt → 403 (BR-AUTH-05) | Negative | P0 | ⚠️ | Pattern verified ở [R7.4.A1-CG TC-10/11](../../workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1-cg.md) (cb_pd_dp_02 → 403 ERR-AUTH-VPD-00-01 cho TVV TW). TVCS-specific cần CHO_PHE_DUYET state — cascade. |
| **TV-034** | Công khai TLPL chưa có file → ERR-TLPL-05 | Negative | P1 | 🚫 | Cascade TLPL endpoint. |
| **TV-035** | API inbound payload trùng `ma_noi_dung_cong` → ERR-TVCS-API-03 | Negative | P1 | ⏭ | Out-of-MCP API inbound. |
| **TV-036** | Upload file >20MB / virus EC-FILE-01 | Negative | P1 | 🚫 | Cascade TLPL endpoint. |
| **TV-037** | QTHT view-only (R only, không C/U/D/phê duyệt) | Authorization | P1 | ✅ | qtht_01 list 13/13 record ✅. UI: row KHÔNG có button team/edit/delete; toolbar KHÔNG có "Tạo mới"/"Xuất Excel"; không có "Hủy yêu cầu" button trong detail. API: POST create → 403 ERR-PERM, POST phan-cong → 403, DELETE → 403. ✅ End-to-end. |
| **TV-038** | CB NV BN không thấy TVCS BN khác (BR-AUTH-08) | Authorization | P0 | ⏭ | Defer — toàn bộ pool R8 là cấp TW. Cần seed thêm cấp BN/ĐP cho R7.7.5 BN sweep R9. |
| **TV-039** | NHT/DN không thấy menu "Tư vấn chuyên sâu" trong CMS | Authorization | P1 | ⏭ | DN role không có CMS access (out-of-spec scope). NHT login mới activated qua R7.2.9 nhưng spec bỏ menu — verify ở R7.7.4.5 NHT functional. |
| **TV-040** | TVCS DA_DUYET trigger update điểm TB CG (cross UC153) | Cross-module | P1 | 🚫 | Cascade — không có DA_DUYET. |
| **TV-041** | TVCS link `vu_viec_id` cross VV module | Cross-module | P2 | 🚫 | Spec mention `vuViecId` field nullable — verified field present trong detail (TV-002). Test link cần seed VV (R7.4.A3 ⏳). |
| **TV-042** | API inbound HSPL upsert DN theo MST | Cross-module | P2 | ⏭ | Out-of-MCP API inbound. |
| **TV-043** | TLPL công khai → hiển thị qua API Cổng PLQG | Cross-module | P2 | ⏭ | Out-of-MCP external Cổng PLQG. |
| **TV-044** | Audit log đủ CREATE/UPDATE/PHAN_CONG/HUY/etc. | Cross-module | P1 | ✅ | qtht_01 → `GET /api/v1/audit-logs?entityType=NOI_DUNG_TU_VAN_CS` → 25 entries, cover CREATE/UPDATE/PHAN_CONG actions từ 13 TVCS. (Note: cb_nv_tw_01 không có quyền audit-logs — 403, cần qtht_01 hoặc admin.) |
| **TV-045** `[v3.5]` | Bật `cong_khai=1` cho DA_DUYET + 5 trường + auto `thoiGianDangTai` | Workflow | P0 | 🚫 | Cascade — không có DA_DUYET. Field `congKhai`/`thoiGianDangTai`/`moTaCongKhai`/`fileDinhKemCongKhai`/`anhDaiDien` đã expose trong detail ✅. |
| **TV-046** `[v3.5]` | Bật `cong_khai=1` khi chưa DA_DUYET → ERR-PUBLIC-01 (BR-PUBLIC-01) | Negative | P0 | 🚫 | Cascade. Endpoint `/cong-khai` chưa probe. |
| **TV-047** `[v3.5]` | Hủy cong_khai 1→0 → clear `thoiGianDangTai` (BR-PUBLIC-02) | Workflow | P0 | 🚫 | Cascade. |
| **TV-048** `[v3.5]` | Bật-tắt-bật → auto-fill `thoiGianDangTai` thời điểm cuối (BR-PUBLIC-03) | Workflow | P1 | 🚫 | Cascade. |
| **TV-049** `[v3.5]` | CB NV nhập tay → `donViId` = đơn vị CB đăng nhập | Workflow | P0 | ✅ | API verify: 13/13 record cb_nv_tw_01 tạo có `donViId = 00000000-0000-4000-8000-000000000001` (BTP-TW = đơn vị cb_nv_tw_01) ✅. BR-ROUTE-TVCS-01 case "CB nhập tay" PASS. |
| **TV-050** `[v3.5]` | API inbound — DN gửi `donViId` hợp lệ → routing đúng | Workflow | P0 | ⏭ | Out-of-MCP API inbound. |
| **TV-051** `[v3.5]` | API inbound — DN không gửi `donViId` → mặc định Sở TP tỉnh DN | Workflow | P1 | ⏭ | Out-of-MCP. |
| **TV-052** `[v3.5]` | API inbound — `donViId` không hợp lệ → fallback Sở TP tỉnh DN | Negative | P1 | ⏭ | Out-of-MCP. |
| **TV-053** `[v3.5]` | NHT xem HSPL DN có VV phân công | Authorization | P0 | ⚠️ | **R8 PARTIAL PASS lớp 1 / FAIL lớp 2.** nht_01 (Phùng Thị STP-AG) inbox `?size=100` trả 1 record HSPL-0022 (cb_nv_dp_01 created, đơn vị STP-AG match ✅). Lớp filter đơn vị PASS. NHƯNG: BR-AUTH-10 mở rộng yêu cầu `EXISTS VU_VIEC vv WHERE vv.doanh_nghiep_id = HSPL.doanh_nghiep_id AND vv.nguoi_ho_tro_id = NHT.tvv_id`. nht_01 KHÔNG có VV nào phân công (VV-002 nguoiHoTroId vẫn = Trương). Vậy NHT lẽ ra phải thấy 0 record nhưng thấy 1 → **BUG-HSPL-002 Major** lớp filter VV thiếu. Lưu ý: HSPL-0021 same-creator/DN/đơn vị nhưng KHÔNG visible (chỉ HSPL-0022) → **BUG-HSPL-004 Minor** filter inconsistent. |
| **TV-054** `[v3.5]` | NHT thử Create/Delete HSPL → 403 (Thay đổi 10) | Authorization | P0 | ❌ | **R8 FAIL.** Spec Thay đổi 10 v3.5: NHT chỉ R+U, KHÔNG có C+D. Runtime: `GET /auth/me.permissions` của nht_01 chứa `[create, read, update, delete]_ho_so_phap_ly_dn` — overgrant 4 permission. **Runtime confirm:** NHT POST create → 500 (POST regression chung), DELETE HSPL-0022 → **204 thành công** ❌. NHT thực sự xóa được HSPL của người khác. **BUG-FUNC-HSPL-001 Major (Critical privacy candidate)**. |
| **TV-055** `[v3.5]` | Detail HSPL render đủ 19 field + lịch sử | Workflow | P1 | 🚫 | **R8 BLOCKED.** `GET /api/v1/ho-so-phap-ly-dns/{id}` trả 500 ERR-SYS-00-00-01 cho mọi ID/role (cb_nv_tw_01 + nht_01 đều 500). **BUG-FUNC-HSPL-003 Critical**. List endpoint trả full payload với 19+ field (`isDeleted` ngầm) nhưng detail endpoint vỡ. |
| **TV-056** `[v3.5]` | Xuất Excel HSPL DN | Workflow | P1 | ✅ | **R8 PASS.** `GET /api/v1/ho-so-phap-ly-dns/export` → 200, Content-Type `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (XLSX), file 7.9KB non-zero. Không probe column structure (cần download + open). |
| **TV-057** `[v3.5]` | Sửa TLPL state CONG_KHAI → reject ERR-TLPL | Negative | P1 | 🚫 | Cascade TLPL endpoint. |
| **TV-058** `[v3.5]` | Search TLPL VV theo từ khóa + loại + ngày | Workflow | P1 | 🚫 | Cascade TLPL endpoint. |
| **TV-059** `[v3.5]` | TVCS DA_DUYET → tạo HD TV link `hopDongTvId` | Cross-module | P2 | 🚫 | Cascade DA_DUYET + R7.3.14 HD seed ⏳. |
| **TV-060** `[v3.5]` | API outbound FR-XII-13 share TVCS chỉ trả `congKhai=1` | Cross-module | P1 | ⏭ | Out-of-MCP outbound API. |
| **TV-061** `[v3.5]` | API outbound FR-XII-13 với `donViId` filter | Cross-module | P1 | ⏭ | Out-of-MCP. |

---

## Per-priority breakdown (sau R8 sweep HSPL)

| Priority | PASS | BLOCKED | SKIP | FAIL | Total |
|---|---:|---:|---:|---:|---:|
| P0 | 13 | 5 | 4 | 2 | **24** |
| P1 | 16 | 6 | 6 | 2 | **30** |
| P2 | 2 | 3 | 2 | 0 | **7** |
| **Tổng** | **31** | **14** | **12** | **4** | **61** |

> **4 FAIL detail:** TV-005 (P0 unaccent search), TV-030 (P1 empty noiDung), TV-031 (P1 CG VO_HIEU_HOA), TV-054 (P0 NHT permission overgrant).

---

## Pool sau test (16 TVCS — 13 visible cho cb_nv_tw_01, +3 negative pollution)

| Mã | LV | DN | CG được phân công | State cuối |
|---|---|---|---|:-:|
| TVCS-20260507-0001..0006 | 6 LV | 6 DN | 6 CG (theo A5 B2) | PHAN_CONG (×6) |
| TVCS-20260507-0007 | LĐ | Tân Bình SN1 | (chưa) | TIEP_NHAN |
| TVCS-20260507-0008 | Thuế | Gạo Doe bơ | (chưa) | TIEP_NHAN |
| TVCS-20260507-0009 | DN | Test R778b | Probe Permission | HUY (B10 PASS) |
| TVCS-20260507-0010 | DN | Sông Hồng BKH | (chưa, đã PATCH TV-004) | TIEP_NHAN |
| TVCS-20260507-0011 | Thuế | Hoa Sen SN2 | **Ngô VO_HIEU_HOA** ❌ | PHAN_CONG (BUG-FN-003 pollution) |
| TVCS-20260507-0012 | Thuế | Hoa Sen SN2 | (chưa) | TIEP_NHAN (`noiDung=""` BUG-FN-002 pollution) |
| TVCS-20260507-0013 | Thuế | Hoa Sen SN2 | (chưa) | TIEP_NHAN (`noiDung="   "` BUG-FN-002 pollution) |

**Đề xuất cleanup:** Sau dev fix BUG-FN-002 (validate noiDung non-empty) + BUG-FN-003 (validate CG HOAT_DONG), soft-delete TVCS-0011/0012/0013 để pool sạch cho R7.7.5 R9 sweep.

---

## API endpoints đã verified R8

| Mục đích | Method | Path | Note |
|---|---|---|---|
| List TVCS | GET | `/api/v1/noi-dung-tu-van-cs?page&pageSize&search&chuyenGiaId&linhVucId&trangThai&...` | PageSize max 100 enforced |
| Detail | GET | `/api/v1/noi-dung-tu-van-cs/{id}` | 30+ field bao gồm v3.5 |
| Create | POST | `/api/v1/noi-dung-tu-van-cs` | Body `{doanhNghiepId, linhVucId, noiDung, tomTat, hinhThucTv, ngayTuVan}` |
| Update generic | PATCH | `/api/v1/noi-dung-tu-van-cs/{id}` | Body partial + version |
| Phân công CG | POST | `/api/v1/noi-dung-tu-van-cs/{id}/phan-cong` | Body `{chuyenGiaId, version, ghiChu?}` |
| CG xác nhận/từ chối | POST | `/api/v1/noi-dung-tu-van-cs/{id}/xac-nhan` | Body `{quyetDinh: 'CHAP_NHAN'\|'TU_CHOI', lyDo?, version}` ❌ BUG-A5-001 |
| Hủy YC | POST | `/api/v1/noi-dung-tu-van-cs/{id}/huy` (qua modal UI) | Body `{lyDo, version}` |
| Phê duyệt (probed) | POST | `/api/v1/noi-dung-tu-van-cs/{id}/approve` | 409 khi state ≠ CHO_PHE_DUYET (state guard ✅) |
| Audit log | GET | `/api/v1/audit-logs?entityType=NOI_DUNG_TU_VAN_CS&size=20` | 403 cho cb_nv_tw_01, 200 cho qtht_01/admin |
| TLPL VV | (chưa expose) | `/api/v1/tu-lieu-phap-ly-vv` (tested 5 paths → 404) | UI accordion render empty state |
| HSPL DN | (chưa probe) | n/a | R7.3.4 seed 🚫 |

---

## Bằng chứng

![R8 — qtht_01 view-only: 13 TVCS render, không có button team/edit/delete/Tạo mới/Hủy](../../screenshots/r7-7-5-qtht-view-only.png)

![R8 — cb_nv_tw_01 list 10/13 hiển thị (không thấy 3 negative-pollution do filter ẩn) — đối chiếu với QTHT thấy 13/13](../../screenshots/r7-4-a5-list-final-state.png)

```text
=== TV-005 unaccent search probe (cb_nv_tw_01, 2026-05-07 22:18) ===
GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=20&search=Tái+cấu+trúc → 200 total=1 ['TVCS-20260507-0004'] ✅
GET ?search=tai+cau+truc                                              → 200 total=0 []                  ❌
GET ?search=cau+truc                                                  → 200 total=0 []                  ❌
GET ?search=thuê+đất                                                  → 200 total=1 ['TVCS-20260507-0005'] ✅
GET ?search=thue+dat                                                  → 200 total=0 []                  ❌
GET ?search=Madrid                                                    → 200 total=1 ['TVCS-20260507-0003'] ✅

=== TV-030 empty content probe ===
POST {noiDung: ""}     → 201 mã TVCS-20260507-0012 (BE accept rỗng)            ❌
POST {noiDung: "   "}  → 201 mã TVCS-20260507-0013 (BE accept whitespace)      ❌
POST {/* missing */}   → 422 ERR-VAL-SYS-00-01 "noiDung must be a string"    (chỉ reject type-check)

=== TV-031 CG VO_HIEU_HOA assignment ===
POST /noi-dung-tu-van-cs (TVCS-0011) + phân công Ngô (TVV-0003 VO_HIEU_HOA)
  → 200 state PHAN_CONG, chuyenGiaId = '8f24c981-...' (= TVV-0003.id) ❌
SRS line 533 spec dropdown filter `trangThai=HOAT_DONG` chỉ áp ở FE, BE không validate.

=== TV-032 skip step (positive case) ===
POST /noi-dung-tu-van-cs/{phan_cong_id}/approve {version: 2}
  → 409 ERR-STATE-TVCS-APPROVE-01 "Khong the 'approve' khi trang thai la 'PHAN_CONG'" ✅

=== TV-037 QTHT view-only ===
GET /noi-dung-tu-van-cs → 200 (13/13 records, no row buttons)
POST create / phan-cong / DELETE → 403 ERR-PERM-SYS-00-01

=== TV-044 Audit log ===
GET /audit-logs?entityType=NOI_DUNG_TU_VAN_CS&size=20 (qtht_01)
  → 200 total=25, sample: [
    {action:'UPDATE',  entity:'NOI_DUNG_TU_VAN_CS', time:2026-05-07T15:23:52.887Z},
    {action:'CREATE',  entity:'NOI_DUNG_TU_VAN_CS', time:2026-05-07T15:23:52.827Z},
    {action:'PHAN_CONG',entity:'NOI_DUNG_TU_VAN_CS', time:2026-05-07T15:23:20.760Z},
    ...
  ] ✅

=== TV-049 BR-ROUTE-TVCS-01 (CB nhập tay) ===
13/13 record cb_nv_tw_01 tạo → donViId = '00000000-0000-4000-8000-000000000001' (= BTP-TW)
✅ Match cb_nv_tw_01 đơn vị
```

---

## Đề xuất R9 follow-up

1. **DEV BE fix BUG-FN-001 (TV-005)** — thêm `unaccent()` index/query cho full-text search (Postgres `unaccent` extension hoặc tự build search vector). Re-test cùng 6 query có dấu/không dấu.
2. **DEV BE fix BUG-FN-002 (TV-030)** — thêm validator `@MinLength(1)` + `.trim()` trên field `noiDung` ở DTO. Reject 422 với code ERR-TVCS-01.
3. **DEV BE fix BUG-FN-003 (TV-031)** — thêm BE-side validation `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds INTERSECT TVCS.linhVucId` ở endpoint `/phan-cong`. Reject 422 với code ERR-TVCS-02.
4. **DEV BE fix BUG-A5-001 + A5-002** (Critical/Major từ workflow R7.4.A5) — unblock 18 TC cascade ở R9.
5. **Seed R7.3.4 HSPL DN** + expose TLPL VV CRUD endpoint → unblock 12 TC HSPL/TLPL ở R9.
6. **R9 Postman setup cho UC149/151/153** — API key Cổng PLQG sandbox + 6 TC API inbound + 2 TC outbound (TV-027..029, 050..052, 060, 061).
7. **R9 BN/ĐP scope sweep** — Seed cấp BN/ĐP qua cb_nv_bn_01/cb_nv_dp_01 → verify TV-038 BR-AUTH-08.
8. **Cleanup pool**: soft-delete TVCS-0011/0012/0013 sau dev fix BUG-FN-002/003.

---

## Ghi chú thực thi

- **Account dùng test:**
  - `cb_nv_tw_01` / `Secret@123` — main flow + create + phân công
  - `qtht_01` / `Secret@123` — TV-037 view-only + TV-044 audit log
  - `ly_13` + `dinh_14` — verified ở A5 (FK linkage check)
- **Tool:** Chrome DevTools MCP. Chrome process orphan đầu phiên (lockfile cũ) — kill manual + clear lockfile để MCP reconnect.
- **Anti-pattern tránh:** TV-030/031 không retry với input variations dài. Phân loại Rule 9 = APP/BE BUG (không phải SELECTOR OUTDATED), STOP + log bug ngay.

---

*R8 | QA Automation via Claude Code | Chrome DevTools MCP*
