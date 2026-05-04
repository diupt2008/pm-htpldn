# SRS Reference — Danh mục dùng chung (14 màn hình)

**Nguồn:** NotebookLM notebook `2160bfb1-2020-4199-90a6-d607b298bb42` — query 2026-04-21.

**Screen Reference:** SCR-VIII-01 (tất cả 14 tab)
**FR Range:** FR-VIII-01 → FR-VIII-19

## Cấu trúc dùng chung (TPL-DM-CRUD) — áp dụng 13/14 danh mục (trừ Cơ quan ĐV)

### Form Create/Edit (Modal — không phải Drawer theo spec)
| Field | Kiểu | Required | Ràng buộc | Default |
|-------|------|----------|-----------|---------|
| Mã | text-input | ✅ | max 20, unique trong loại DM | — |
| Tên | text-input | ✅ | không trống | — |
| Mô tả | textarea | ❌ | — | — |
| Thứ tự | text-input (số) | ❌ | — | 0 |
| Trạng thái | toggle | ✅ | — | Hoạt động (1) |

### Table columns
Mã | Tên hiển thị | Mô tả (truncate) | Thứ tự | Trạng thái (toggle) | Hành động (Sửa/Xóa icon)

### Actions (toolbar)
- `[+ Thêm mới]` — mở Modal
- Ô search (tìm theo Mã hoặc Tên)
- Sửa (mở lại Modal với data cũ)
- Xóa (soft-delete)
- **KHÔNG có xuất/nhập Excel tại toolbar SCR-VIII-01** (theo SRS)

## Chi tiết 14 danh mục

| # | Label UI | Mã loại DM | FR | Form bổ sung (ngoài 5 trường cơ bản) |
|---|----------|-----------|-----|--------------------------------------|
| 1 | Lĩnh vực pháp lý | LINH_VUC_PL | FR-VIII-01 / UC99 | (không) |
| 2 | Loại hình hỗ trợ | LOAI_HINH_HO_TRO | FR-VIII-02 / UC100 | (không) |
| 3 | Chương trình hỗ trợ | CHUONG_TRINH_HT | FR-VIII-03 / UC101 | **Thời gian bắt đầu** (date, ✅), **Thời gian kết thúc** (date, ❌), **Đơn vị chủ trì** (text, ✅) |
| 4 | Tình trạng vụ việc | TINH_TRANG_VU_VIEC | FR-VIII-04 / UC102 | **Màu hiển thị** (text HEX, ❌) |
| 5 | Cơ quan đơn vị | DON_VI (bảng riêng) | FR-VIII-05 / UC103 | **Split-pane Tree + Form detail** (KHÔNG dùng modal). Fields: Mã ĐV, Tên ĐV, Tên viết tắt, Cấp (TW/BN/DP ✅), Đơn vị cha (✅ nếu BN/ĐP), Địa chỉ, ĐT, Email, Tỉnh thành, Thứ tự, Trạng thái |
| 6 | Tổ chức tư vấn | TO_CHUC_TU_VAN | FR-VIII-06 / UC104 | **Địa chỉ** (text, ❌), **Lĩnh vực** (text, ❌) |
| 7 | Loại doanh nghiệp | LOAI_DOANH_NGHIEP | FR-VIII-07 / UC105 | **Tiêu chí doanh thu** (text, ❌), **Tiêu chí lao động** (text, ❌) |
| 8 | Hồ sơ đề nghị hỗ trợ | HO_SO_DE_NGHI_HT | FR-VIII-08 / UC106 | **Thành phần bắt buộc** (list/tag, ❌), **Thành phần tùy chọn** (list/tag, ❌) |
| 9 | Hồ sơ đề nghị thanh toán | HO_SO_DE_NGHI_TT | FR-VIII-09 / UC107 | **Thành phần hồ sơ** (list/tag, ❌) |
| 10 | Tiêu chí đánh giá hiệu quả | TIEU_CHI_DG_HIEU_QUA | FR-VIII-11 / UC109 | **Trọng số** (number 0–100, ✅), **Thang min** (number, ✅), **Thang max** (number > min, ✅). Table có cột Trọng số/min/max + label realtime "Tổng: {X}%" (xanh=100, đỏ≠100). BR-CALC-04: tổng trọng số = 100. |
| 11 | Tiêu chí đánh giá chi phí | TIEU_CHI_DG_CHI_PHI | FR-VIII-12 / UC110 | **Quy mô DN** (dropdown SIEU_NHO/NHO/VUA, ✅), **Mức hỗ trợ %** (number, ✅), **Trần hỗ trợ/năm** (money VNĐ, ✅). Table có cột Quy mô / Mức / Trần. |
| 12 | Loại tài khoản | LOAI_TAI_KHOAN | FR-VIII-13 / UC111 | (không) |
| 13 | Loại hình tiếp nhận | LOAI_HINH_TIEP_NHAN | FR-VIII-18 / UC116 | (không) |
| 14 | Kênh tiếp nhận | KENH_TIEP_NHAN | FR-VIII-19 / UC117 | (không) |

## Business Rules chính
- `ERR-DM-01` — trùng mã trong cùng loại DM
- `ERR-DM-03` — không cho xóa nếu đang được tham chiếu (FK)
- `ERR-DV-02` — Đơn vị cha bắt buộc nếu cấp BN/ĐP
- `ERR-DV-03` — không xóa ĐV có tài khoản liên kết
- `ERR-DV-04` — không xóa ĐV có dữ liệu nghiệp vụ
- `ERR-DV-05` — không tạo vòng lặp tree
- `BR-CALC-04` — tổng trọng số tiêu chí hiệu quả = 100%
