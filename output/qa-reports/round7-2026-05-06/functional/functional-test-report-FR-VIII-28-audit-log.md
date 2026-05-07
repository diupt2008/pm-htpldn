# Functional Test Report — R7.7.8d FR-VIII-28 Nhật ký hệ thống

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/quan-tri/audit-log |
| **Người test** | QA Automation via Claude Code (qtht_02) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional |
| **Round** | Round 7 — Task R7.7.8d |
| **Tool** | Chrome DevTools MCP |
| **Account** | qtht_02 |
| **SRS** | FR-VIII-28 line 1318-1376 + SCR-VIII-10 line 1807-1837 |
| **2-source verify** | NotebookLM + grep SRS local — match 100% |

---

## Tổng hợp

**Verdict:** ⚠️ **PASS 5/7 TC (71%) + 6 bug findings (2 Major + 2 Medium + 2 Minor)**

### Test result breakdown

| TC | Type | Verdict |
|---|---|---|
| TC01 READ list 43 record + cột | Happy | ✅ PASS |
| TC02 Filter Module=HOI_DAP | Happy | ✅ PASS |
| TC03 Filter Hành động=CREATE | Happy | ✅ PASS |
| TC07 Xem chi tiết (modal JSON old→new) | Happy | ✅ PASS |
| TC11 Empty state | Happy | ✅ PASS |
| **TC04 ERR-LOG-02 khoảng > 90 ngày** | Negative | 🚫 **FAIL** — BE 200 thay vì 400 ERR-LOG-02 |
| **TC05 Export Excel** | Happy | 🚫 **FAIL** — endpoint 400 "uuid expected" |

---

## Bug findings

### BUG-LOG-001 (Major) — BE thiếu validate khoảng > 90 ngày

**SRS ref:** FR-VIII-28 §Processing bước 2 (line 1348): *"Validate khoảng thời gian: thoi_gian_den - thoi_gian_tu <= 90 ngày"* + Error Handling E2 ERR-LOG-02.

**Repro:**
```
GET /api/v1/audit-logs?tuNgay=2026-02-04&denNgay=2026-05-06&page=1&pageSize=50
→ 200 OK (kỳ vọng 400 + errCode ERR-LOG-02)
```

**Expected:** BE trả 400 `{error: {code: "ERR-LOG-02", message: "Khoảng thời gian tối đa là 90 ngày"}}`.

**Actual:** BE 200 OK — không validate range. Frontend cũng không có client-side validation (date picker accept range bất kỳ).

**Severity:** Major — vi phạm SRS Processing rule, tạo lỗ hổng performance (query AUDIT_LOG > 90 ngày có thể nặng).

### BUG-LOG-002 (Major) — Endpoint Export Excel sai design (400 "uuid expected")

**SRS ref:** FR-VIII-28 §Processing bước 6 (line 1352): *"Nếu QTHT nhấn 'Xuất Excel': filter → export .xlsx, max 10.000 dòng"*.

**Repro:**
```
GET /api/v1/audit-logs/export?tuNgay=2026-04-01&denNgay=2026-05-06
→ 400 errCode: "ERR-VAL-SYS-00-00", message: "Validation failed (uuid is expected)"
```

**Expected:** BE trả Excel file (.xlsx) với audit log filtered.

**Actual:** Path `/audit-logs/export` matched route `/audit-logs/:id` → BE expect UUID. Endpoint design conflict.

**Severity:** Major — Acceptance Criteria #2 SRS line 1375 fail: *"Given QTHT nhấn Xuất Excel When có dữ liệu Then tải file .xlsx (max 10.000 dòng)"*.

**UI:** Button [Xuất Excel] trên SCR-VIII-10 click không gọi API (network log không có request export khi click). Confirm endpoint không deploy đúng.

### BUG-LOG-003 (Medium) — UI page size mặc định 20/trang vs SRS 50/trang

**SRS ref:** FR-VIII-28 §Processing bước 5 (line 1351): *"Phân trang (mặc định 50 dòng/trang)"* + SCR-VIII-10 line 1828: *"50 muc/trang"*.

**Repro:**
- Open `/quan-tri/audit-log` → footer hiển thị "20 / trang" + pagination "1-20 / 43 mục".
- Network: `GET /api/v1/audit-logs?page=1&pageSize=50` (BE đúng pageSize=50, FE render 20).

**Expected:** UI default 50/trang theo SRS.

**Actual:** UI 20/trang (FE config sai default page size). BE response đúng 50.

### BUG-LOG-004 (Medium) — Filter "Người dùng" thiếu

**SRS ref:** FR-VIII-28 §Inputs row 3 (line 1339): *"nguoi_dung | text | N | Searchable dropdown → TAI_KHOAN"* + SCR-VIII-10 line 1822.

**Repro:** Filter bar SCR-VIII-10 có Endpoint/IP + Module + Entity type + Hành động + Từ ngày + Đến ngày. **Thiếu** filter "Người dùng" (searchable dropdown TAI_KHOAN).

**Expected:** Filter "Người dùng" với searchable dropdown TAI_KHOAN.

**Actual:** UI thay bằng "Endpoint / IP" (text) + "Entity type" (text) — không có trong SRS Inputs.

**Severity:** Medium — không lọc được audit log theo user cụ thể. Workaround: filter Entity ID.

### BUG-LOG-005 (Minor) — Cột "Đơn vị" thiếu trên table

**SRS ref:** SCR-VIII-10 line 1827 quote cột: *"Thoi gian / Nguoi dung (ho_ten) / **Don vi** / Module / Entity / Ma ban ghi / Loai thao tac / Chi tiet thay doi"*.

**Repro:** Table render 10 cột: Thời gian / Module / Entity type / Entity ID / Hành động / Người thực hiện / IP / Endpoint / Code / Thao tác. **Thiếu** cột "Đơn vị" (Don_Vi của người thực hiện).

**Expected:** Cột Đơn vị resolve `nguoi_thuc_hien.don_vi.ten`.

### BUG-LOG-006 (Minor) — Module/Hành động dropdown dùng enum DB thay vì Tiếng Việt SRS

**SRS ref:** FR-VIII-28 §Inputs row 4-5 (line 1340-1341): *"Module: Hỏi đáp / Đào tạo / CG-TVV / Vụ việc / Chi trả / DN / Đánh giá / Biểu mẫu / Quản trị / Báo cáo / Tư vấn / CT HTPLDN"* + *"Hành động: Tạo / Sửa / Xóa / Phê duyệt / Từ chối / Đăng nhập / Đăng xuất"*.

**Repro:**
- Module dropdown: AUTH / TAI_KHOAN / VAI_TRO / DAO_TAO / VU_VIEC / CHI_TRA / DANH_GIA / DOANH_NGHIEP / HOI_DAP / TU_VAN (10 options enum).
- Hành động dropdown: CREATE / READ / UPDATE / DELETE / SUBMIT / APPROVE / REJECT / PUBLISH / UNPUBLISH / EXPORT (10 options enum).

**Expected:** Dropdown text Tiếng Việt thân thiện ("Hỏi đáp" thay "HOI_DAP", "Tạo" thay "CREATE").

**Actual:** UI dùng enum DB raw — UX kém cho QTHT non-tech.

---

## Spec inconsistency note (đã log từ R7.0.7)

**BUG-SRS-FR10-004** (SRS doc) — Excel limit conflict:
- FR-VIII-28 line 1352: "max **10.000 dòng**"
- SCR-VIII-10 line 1834: "max **50.000 dong**"
- **NotebookLM verify:** 10.000 đúng theo BR-DATA-06; 50.000 là typo SCR-VIII-10.
- **Implication R7.7.8d:** Vì BUG-LOG-002 endpoint export không work, không thể test actual limit — defer chờ dev fix endpoint.

---

## Bug Summary Table

| Bug ID | Severity | SRS Ref | Title | Status |
|---|---|---|---|---|
| BUG-LOG-001 | Major | FR-VIII-28 §Processing bước 2 line 1348 | BE thiếu validate khoảng > 90 ngày | Open |
| BUG-LOG-002 | Major | FR-VIII-28 §Processing bước 6 line 1352 | Endpoint Export sai design (400 uuid expected) | Open |
| BUG-LOG-003 | Medium | FR-VIII-28 §Processing bước 5 line 1351 | UI page size 20/trang vs SRS 50/trang | Open |
| BUG-LOG-004 | Medium | FR-VIII-28 §Inputs row 3 line 1339 | Filter "Người dùng" thiếu | Open |
| BUG-LOG-005 | Minor | SCR-VIII-10 line 1827 | Cột "Đơn vị" thiếu trên table | Open |
| BUG-LOG-006 | Minor | FR-VIII-28 §Inputs row 4-5 line 1340-1341 | Dropdown Module/Hành động dùng enum DB thay Tiếng Việt | Open |

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/quan-tri/audit-log |
| API endpoint | `/api/v1/audit-logs` (GET list) · `/api/v1/audit-logs/export` (Export — broken) |
| Account | qtht_02 (vai trò QTHT, cấp TW) |
| Tool | Chrome DevTools MCP |
| NotebookLM | https://notebooklm.google.com/notebook/a4ae45bf-cea0-4325-8fee-b1e0be702cf2 |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
