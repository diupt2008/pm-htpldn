# Kế Hoạch Kiểm Thử - SRS-FR-10: Quản Trị Hệ Thống — Submenu Danh Mục Dùng Chung

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-04-16  
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), Session ID `a0fdcb5c`  
> **SRS Reference**: Nhóm FR-VIII (Quản trị hệ thống), TPL-DM-CRUD, SCR-VIII-01

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- **14 danh mục dùng chung** thuộc FR-VIII, sử dụng template CRUD chung (TPL-DM-CRUD)
- Bảng dữ liệu chính: `DANH_MUC` (ngoại trừ Cơ quan/Đơn vị sử dụng bảng `DON_VI`)
- Màn hình: **SCR-VIII-01** (Danh sách + Modal CRUD)

### 1.2 Danh sách 14 Danh mục

| # | Mã FR | Use Case | Tên Danh Mục | loai_danh_muc | Bảng | File Test Case |
|---|--------|----------|--------------|---------------|------|----------------|
| 1 | FR-VIII-01 | UC99 | Lĩnh vực pháp lý | LINH_VUC_PL | DANH_MUC | `01-TC-TPL-CRUD-chung.md` |
| 2 | FR-VIII-02 | UC100 | Loại hình hỗ trợ | LOAI_HINH_HO_TRO | DANH_MUC | `01-TC-TPL-CRUD-chung.md` |
| 3 | FR-VIII-03 | UC101 | Chương trình hỗ trợ | CHUONG_TRINH_HT | DANH_MUC | `02-TC-chuong-trinh-ho-tro.md` |
| 4 | FR-VIII-04 | UC102 | Tình trạng vụ việc | TINH_TRANG_VU_VIEC | DANH_MUC | `03-TC-tinh-trang-vu-viec.md` |
| 5 | FR-VIII-05 | UC103 | Cơ quan đơn vị quản lý | — | DON_VI | `04-TC-co-quan-don-vi.md` |
| 6 | FR-VIII-06 | UC104 | Tổ chức tư vấn | TO_CHUC_TU_VAN | DANH_MUC | `05-TC-to-chuc-tu-van.md` |
| 7 | FR-VIII-07 | UC105 | Loại doanh nghiệp | LOAI_DOANH_NGHIEP | DANH_MUC | `06-TC-loai-doanh-nghiep.md` |
| 8 | FR-VIII-08 | UC106 | Hồ sơ đề nghị hỗ trợ | HO_SO_DE_NGHI_HT | DANH_MUC | `07-TC-ho-so-de-nghi-ht.md` |
| 9 | FR-VIII-09 | UC107 | Hồ sơ đề nghị thanh toán | HO_SO_DE_NGHI_TT | DANH_MUC | `07-TC-ho-so-de-nghi-ht.md` |
| 10 | FR-VIII-11 | UC109 | Tiêu chí đánh giá hiệu quả | TIEU_CHI_DG_HIEU_QUA | DANH_MUC | `08-TC-tieu-chi-danh-gia-hieu-qua.md` |
| 11 | FR-VIII-12 | UC110 | Tiêu chí đánh giá hỗ trợ chi phí | TIEU_CHI_DG_CHI_PHI | DANH_MUC | `09-TC-tieu-chi-ho-tro-chi-phi.md` |
| 12 | FR-VIII-13 | UC111 | Loại tài khoản | LOAI_TAI_KHOAN | DANH_MUC | `10-TC-loai-tai-khoan.md` |
| 13 | FR-VIII-18 | UC116 | Loại hình tiếp nhận | LOAI_HINH_TIEP_NHAN | DANH_MUC | `01-TC-TPL-CRUD-chung.md` |
| 14 | FR-VIII-19 | UC117 | Kênh tiếp nhận | KENH_TIEP_NHAN | DANH_MUC | `01-TC-TPL-CRUD-chung.md` |

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Business Rules (BR)
| Mã | Quy tắc | Trích dẫn SRS |
|----|---------|---------------|
| BR-AUTH-01 | User phải đăng nhập thành công | Preconditions TPL-DM-CRUD |
| BR-AUTH-06 | Session CMS: 30p idle timeout. API token: TTL 15p, refresh 24h | Preconditions TPL-DM-CRUD |
| BR-DATA-01 | Mọi xóa là soft delete (is_deleted = 1). Không xóa vật lý | TPL-DM-CRUD Processing Xóa |
| BR-DATA-02 | DANH_MUC dùng chung: don_vi_id = NULL cho DM hệ thống | Entity DANH_MUC |
| BR-DATA-05 | Mọi CUD + phê duyệt + đăng nhập/xuất ghi AUDIT_LOG. Log immutable | AUDIT_LOG |
| BR-DATA-06 | Mọi danh sách có xuất Excel. Max 10,000 rows/file | BR-DATA-06 (srs-v3.md:3977 — áp dụng "Toàn bộ CRUD list", bao gồm SCR-VIII-01. Ngoại lệ SRS chỉ có: "Báo cáo nhóm IX có xuất Word") |
| BR-DATA-07 | Phân trang: Default 20 rows/page, max 100 rows/page | TPL-DM-CRUD Processing Xem |
| BR-EC-01 | Optimistic Locking: UPDATE/DELETE kiểm tra updated_at | EC-DATA-LOCK |

### 2.2 Error Codes
| Mã lỗi | Điều kiện | Message | Severity |
|---------|-----------|---------|----------|
| ERR-DM-01 | Mã danh mục trùng | "Mã '{ma}' đã tồn tại trong danh mục {loai}" | ERROR |
| ERR-DM-02 | Tên danh mục trống | "Tên danh mục là bắt buộc" | ERROR |
| ERR-DM-03 | Bản ghi đang được tham chiếu | "Không thể xóa. Danh mục đang được sử dụng bởi {N} bản ghi {entity}" | ERROR |
| ERR-DM-04 | Bản ghi không tồn tại | "Bản ghi không tồn tại hoặc đã bị xóa" | ERROR |
| ERR-DM-05 | Mã vượt quá 20 ký tự | "Mã danh mục tối đa 20 ký tự" | ERROR |
| ERR-AUTH-01 | User không có quyền QTHT | "Bạn không có quyền thực hiện chức năng này" | ERROR |
| ERR-AUTH-02 | Session hết hạn | Redirect về trang đăng nhập | ERROR |
| ERR-SYS-02 | Xung đột optimistic locking | "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" | ERROR |
| ERR-DV-05 | Vòng lặp cây đơn vị (FR-VIII-05) | "Không thể tạo vòng lặp phân cấp" | ERROR |
| WRN-TC-01 | Tổng trọng số ≠ 100% (FR-VIII-11) | "Tổng trọng số hiện tại: {X}%. Cần đảm bảo = 100% trước khi sử dụng" | WARNING |

### 2.3 Permission Matrix
| Entity | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|--------|------|-------|-------|----|-----|-----|----|
| DANH_MUC | **CRUD** | R | R | R | R | R | R |
| DON_VI | **CRUD** | R | R | R | R | R | R |

### 2.4 UI Layout (SCR-VIII-01)
- **Toolbar**: Breadcrumb ("Trang chủ > Quản trị > Danh mục") + nút [+ Thêm mới] + nút [Xuất Excel] (theo BR-DATA-06)
- **Sidebar**: 14 tab dọc bên trái, click → chuyển tab
- **Filter-bar**: Ô tìm kiếm (theo mã hoặc tên)
- **Content**: Bảng danh sách (Mã, Tên, Mô tả, Thứ tự, Trạng thái toggle, Hành động)
- **Modal**: Form CRUD (Mã, Tên, Mô tả, Thứ tự, Trạng thái, nút Hủy/Lưu)

> **Sửa 2026-04-21:** Bản cũ viết "KHÔNG có Import/Export trên UI" — annotation này KHÔNG có trong SRS. BR-DATA-06 ([srs-v3.md:3977](../../../../input/srs-v3/srs-v3.md)) quy định "Mọi danh sách có tính năng xuất Excel... Áp dụng: Toàn bộ CRUD list". Dev confirm 2026-04-21: code có nút [Xuất Excel] đúng spec.
>
> **TODO cần bổ sung:** 5 TC Export cho `01-TC-TPL-CRUD-chung.md` (happy / permission / 10k boundary / filter-aware / security). Bug BUG-DM-001 đã close "Not a bug — SRS interpretation error".

---

## 3. Cấu Trúc File Test Case

```
QTHT_DMDC/
├── 00-test-plan-overview.md          ← File này
├── 01-TC-TPL-CRUD-chung.md           ← Test cases CRUD chung (áp dụng cho tất cả DM)
├── 02-TC-chuong-trinh-ho-tro.md      ← FR-VIII-03: Trường đặc thù
├── 03-TC-tinh-trang-vu-viec.md       ← FR-VIII-04: Trường đặc thù
├── 04-TC-co-quan-don-vi.md           ← FR-VIII-05: Tree View, bảng DON_VI
├── 05-TC-to-chuc-tu-van.md           ← FR-VIII-06: Trường đặc thù
├── 06-TC-loai-doanh-nghiep.md        ← FR-VIII-07: Trường đặc thù
├── 07-TC-ho-so-de-nghi.md            ← FR-VIII-08 + FR-VIII-09: Checklist structured
├── 08-TC-tieu-chi-danh-gia-hieu-qua.md ← FR-VIII-11: Trọng số 100%
├── 09-TC-tieu-chi-ho-tro-chi-phi.md  ← FR-VIII-12: Mức hỗ trợ %
└── 10-TC-loai-tai-khoan.md           ← FR-VIII-13: Tham chiếu TAI_KHOAN
```

---

## 4. Tổng Quan Số Lượng Test Cases

| File | Happy | Negative | Edge | Tổng |
|------|-------|----------|------|------|
| 01 - TPL-CRUD chung | 10 | 12 | 8 | 30 |
| 02 - Chương trình hỗ trợ | 5 | 3 | 4 | 12 |
| 03 - Tình trạng vụ việc | 3 | 1 | 2 | 6 |
| 04 - Cơ quan đơn vị | 5 | 4 | 5 | 14 |
| 05 - Tổ chức tư vấn | 2 | 1 | 1 | 4 |
| 06 - Loại doanh nghiệp | 2 | 1 | 1 | 4 |
| 07 - Hồ sơ đề nghị | 3 | 2 | 2 | 7 |
| 08 - Tiêu chí ĐG hiệu quả | 3 | 2 | 3 | 8 |
| 09 - Tiêu chí hỗ trợ chi phí | 2 | 2 | 2 | 6 |
| 10 - Loại tài khoản | 2 | 2 | 1 | 5 |
| **TỔNG** | **37** | **30** | **29** | **96** |
