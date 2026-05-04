# Test Cases — UC48: Xem lịch sử hỗ trợ TVV (FR-IV-10)

> **SRS Ref**: FR-IV-10, SCR-IV-03 (Tab Lịch sử hỗ trợ), Entity LICH_SU_HO_TRO_TVV (+ JOIN VU_VIEC, DOANH_NGHIEP)
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-UI-11 | FR-IV-10 / SCR-IV-03 / UI | Verify Tab Lịch sử hỗ trợ: filter + bảng + thống kê | CB_NV_TW. TVV "TVV-TW-007" có ≥3 VV (mix HOAN_THANH + DANG_XU_LY). | — | 1. SCR-IV-03 cho TVV-TW-007. 2. Click tab "Lịch sử hỗ trợ". | **LAYOUT** (NLM cite [4] tab-4): "Filter thời gian" (date range from/to), "Filter trạng thái" (select). **TABLE 8 cột**: Mã VV (link → detail VV), Tên VV, DN, Lĩnh vực, Vai trò (NHT/TVV), Ngày phân công, Ngày hoàn thành, Kết quả, Đánh giá (sao). **Pagination 20/trang**. **THỐNG KÊ MINI** (3 box trên đầu hoặc inline): Tổng VV, Hoàn thành, Điểm TB. **TIMELINE TỔNG HỢP** (visual timeline). **NEGATIVE — Phần tử KHÔNG có**: KHÔNG có nút sửa/xóa lịch sử (read-only). KHÔNG có nút "Tạo VV mới" (UC khác). | Happy 🔴 |

---

## B. XEM LỊCH SỬ HAPPY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-901 | FR-IV-10 | Xem lịch sử full | CB_NV_TW. TVV-TW-007 có 5 VV (3 HT + 2 đang XL). | — | 1. Tab Lịch sử. | **STATE**: Backend `GET /api/v1/tu-van-vien/{id}/lich-su` join VU_VIEC + DN. **UI**: Bảng hiển thị 5 row. Thống kê: Tổng VV=5, Hoàn thành=3, Điểm TB=avg các đánh giá đã có. Timeline 5 mốc. **PERSIST**: Reload giữ. | Happy |
| TC-CG-902 | FR-IV-10 | Filter theo trạng thái = HOAN_THANH | CB_NV_TW. Như TC-901. | trang_thai=HOAN_THANH | 1. Tab Lịch sử. 2. Filter trạng thái. | **STATE**: WHERE vu_viec.trang_thai='HOAN_THANH'. **UI**: Bảng hiển thị 3 row. Thống kê unchanged (tổng vẫn 5). **PERSIST**: — | Happy |
| TC-CG-903 | FR-IV-10 | Filter date range | CB_NV_TW. Như trên. | từ=2026-01-01, đến=2026-03-31 | 1. Filter date range. | **STATE**: WHERE ngay_phan_cong BETWEEN. **UI**: Hiển thị VV trong khoảng. **PERSIST**: — | Happy |

---

## C. NEGATIVE & PERMISSION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-904 | ERR-LS-01 | TVV ID không tồn tại | CB_NV_TW. | URL: `/chuyen-gia-tvv/INVALID/lich-su` | 1. URL direct. | **STATE**: 404. **UI**: Error "**TVV không tồn tại**" (NLM cite [26] ERR-LS-01). **PERSIST**: — | Negative |
| TC-CG-905 | FR-IV-10 / BR-AUTH-08 | CB_NV_DP cố xem lịch sử TVV ngoài đơn vị | CB_NV_DP. TVV thuộc cấp khác. | — | 1. URL direct. | **STATE**: 403. **UI**: "Bạn không có quyền". **PERSIST**: — | Negative |

---

## D. EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-906 | FR-IV-10 | TVV chưa có VV nào → empty state + thống kê 0 | CB_NV_TW. TVV "TVV-TW-110" mới, chưa có VV. | — | 1. Tab Lịch sử. | **UI**: Bảng empty "Chưa có vụ việc hỗ trợ" (SRS Gap message). Thống kê: Tổng VV=0, Hoàn thành=0, Điểm TB="—". Timeline empty. **PERSIST**: — | Edge |
| TC-CG-907 | FR-IV-10 / BR-DATA-07 | Lịch sử > 20 VV → pagination | CB_NV_TW. TVV "TVV-TW-008" có 25 VV. | — | 1. Tab Lịch sử. 2. Pagination. | **UI**: Trang 1: 20 row. Trang 2: 5 row. Pagination "20/page". **PERSIST**: — | Edge |

---

## E. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-908 | FR-IV-10 / NLM cite [12] tab-4 | Cột "Vai trò" trong bảng lịch sử — verify hiển thị (NHT/TVV) đúng theo loai_tvv của TVV trong VV | CB_NV_TW. TVV-TW-007 có 3 VV: 1 vai trò NHT, 2 vai trò TVV. | — | 1. Tab Lịch sử. 2. Quan sát cột "Vai trò". | **UI**: Cite [12] tab-4 nguyên văn cột bảng: "Ma VV, Ten VV, DN, Linh vuc, **Vai tro (NHT/TVV)**, Ngay phan cong...". → Verify mapping vai_tro = NHT cho row 1, TVV cho row 2-3. → Note: chỉ 2 giá trị (NHT/TVV), KHÔNG có CG (SRS Gap — VV có thể assign CG không?). **PERSIST**: Mark SPEC-CLARIFY-CG-46. | Edge 🟡 |
| TC-CG-909 | FR-IV-10 / NLM cite [12] tab-4 | Filter date range invalid (từ > đến) cho lịch sử | CB_NV_TW. TVV-TW-007. | từ=2026-04-01, đến=2026-01-01 | 1. Tab Lịch sử. 2. Filter date inverse. | **STATE**: BE behavior **SRS Gap** (tương tự TC-CG-117 cho UC40). **UI**: Tùy. **PERSIST**: Mark SPEC-CLARIFY-CG-38 reuse. | Edge 🟢 |
| TC-CG-910 | FR-IV-10 / NLM cite [10] AC case 1 / cite [12] tab-4 | Verify timeline component render đầy đủ với mốc thời gian từng VV | CB_NV_TW. TVV-TW-007 có ≥3 VV (mix HOAN_THANH + DANG_XU_LY) trong 2026. | — | 1. Tab Lịch sử. 2. Quan sát timeline section. | **STATE**: GET API trả timeline data. **UI**: AC NGUYÊN VĂN cite [10] case 1: "...danh sách VV + thống kê + **timeline**". Cite [12] tab-4: "**Timeline tổng hợp**". → Timeline section render với 3 mốc (1 mốc/VV) sắp xếp theo ngay_phan_cong, mỗi mốc có ten_VV + ngay + ket_qua + status icon. **PERSIST**: — | Happy 🟡 |
| TC-CG-911 | FR-IV-10 / NLM cite [10] AC case 2 | Click row VV trong bảng lịch sử → navigate detail VV | CB_NV_TW. TVV-TW-007 có VV-001. | — | 1. Tab Lịch sử. 2. Click cột "Mã VV" (link) row VV-001. | **STATE**: Backend navigate. **UI**: AC NGUYÊN VĂN cite [10] case 2: "Given CB NV xem chi tiết vụ việc When chọn vụ việc Then **hiển thị thông tin + kết quả + đánh giá**". Cross-module navigate sang module Vụ việc → detail VV-001. **PERSIST**: URL state preserved. | Happy 🟡 |
