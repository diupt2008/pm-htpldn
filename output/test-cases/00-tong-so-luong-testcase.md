# Tổng số lượng Test Case theo Chức năng

> **Ngày tổng hợp**: 2026-04-27
> **Phương pháp đếm**: Đếm số dòng dữ liệu trong bảng test case của từng file `*-TC-*.md` (pattern `^| TC-`).
> **Loại trừ**: file `00-test-plan-overview.md`, `*REVIEW*`, `edge-case-review-*` (không phải test case thực thi).

## Tổng hợp theo Module

| # | Module | Số file TC | Tổng TC |
|---|--------|-----------:|--------:|
| 1 | QTHT — Cấu hình hệ thống (`QTHT/Cau-hinh-he-thong`) | 4 | **79** |
| 2 | QTHT — Danh mục dùng chung (`QTHT/DM_dung-chung`) | 10 | **122** |
| 3 | QTHT — Nhật ký hệ thống (`QTHT/Nhat-ky-he-thong`) | 1 | **46** |
| 4 | QTHT — Tài khoản & Phân quyền (`QTHT/Tai-khoan-phan-quyen`) | 4 | **128** |
| 5 | Hỏi đáp (`hoi-dap`) | 7 | **118** |
| 6 | CG-TVV (`CG-TVV`) | 0 | 0 |
| 7 | Doanh nghiệp (`doanh-nghiep`) | 0 | 0 |
| | **TỔNG CỘNG** | **26** | **493** |

---

## Chi tiết theo từng chức năng

### 1. QTHT — Cấu hình hệ thống (SCR-VIII-06) — **79 TC**

| File | Chức năng (SRS Ref) | Số TC |
|------|---------------------|------:|
| [01-TC-SLA.md](QTHT/Cau-hinh-he-thong/01-TC-SLA.md) | FR-VIII-10 — Cấu hình Thời hạn xử lý / SLA (UC108) | 23 |
| [02-TC-phan-cong.md](QTHT/Cau-hinh-he-thong/02-TC-phan-cong.md) | FR-II-NEW-01 — Cấu hình Phân công mặc định | 18 |
| [03-TC-mau-phan-hoi.md](QTHT/Cau-hinh-he-thong/03-TC-mau-phan-hoi.md) | FR-II-NEW-02 — Cấu hình Mẫu phản hồi | 19 |
| [04-TC-quy-trinh.md](QTHT/Cau-hinh-he-thong/04-TC-quy-trinh.md) | FR-V.I-NEW-01 — Cấu hình Quy trình hỗ trợ | 19 |

### 2. QTHT — Danh mục dùng chung (SCR-VIII-01) — **122 TC**

| File | Chức năng (SRS Ref) | Số TC |
|------|---------------------|------:|
| [01-TC-TPL-CRUD-chung.md](QTHT/DM_dung-chung/01-TC-TPL-CRUD-chung.md) | TPL-DM-CRUD Chung (áp dụng 14 danh mục) | 47 |
| [02-TC-chuong-trinh-ho-tro.md](QTHT/DM_dung-chung/02-TC-chuong-trinh-ho-tro.md) | FR-VIII-03 — Chương trình hỗ trợ (UC101) | 12 |
| [03-TC-tinh-trang-vu-viec.md](QTHT/DM_dung-chung/03-TC-tinh-trang-vu-viec.md) | FR-VIII-04 — Tình trạng vụ việc (UC102) | 7 |
| [04-TC-co-quan-don-vi.md](QTHT/DM_dung-chung/04-TC-co-quan-don-vi.md) | FR-VIII-05 — Cơ quan đơn vị quản lý (UC103) | 17 |
| [05-TC-to-chuc-tu-van.md](QTHT/DM_dung-chung/05-TC-to-chuc-tu-van.md) | FR-VIII-06 — Tổ chức tư vấn (UC104) | 4 |
| [06-TC-loai-doanh-nghiep.md](QTHT/DM_dung-chung/06-TC-loai-doanh-nghiep.md) | FR-VIII-07 — Loại doanh nghiệp (UC105) | 4 |
| [07-TC-ho-so-de-nghi.md](QTHT/DM_dung-chung/07-TC-ho-so-de-nghi.md) | FR-VIII-08 & FR-VIII-09 — Hồ sơ đề nghị (UC106, UC107) | 8 |
| [08-TC-tieu-chi-danh-gia-hieu-qua.md](QTHT/DM_dung-chung/08-TC-tieu-chi-danh-gia-hieu-qua.md) | FR-VIII-11 — Tiêu chí đánh giá hiệu quả (UC109) | 11 |
| [09-TC-tieu-chi-ho-tro-chi-phi.md](QTHT/DM_dung-chung/09-TC-tieu-chi-ho-tro-chi-phi.md) | FR-VIII-12 — Tiêu chí đánh giá hỗ trợ chi phí (UC110) | 7 |
| [10-TC-loai-tai-khoan.md](QTHT/DM_dung-chung/10-TC-loai-tai-khoan.md) | FR-VIII-13 — Loại tài khoản (UC111) | 5 |

### 3. QTHT — Nhật ký hệ thống — **46 TC**

| File | Chức năng (SRS Ref) | Số TC |
|------|---------------------|------:|
| [01-TC-nhat-ky-he-thong.md](QTHT/Nhat-ky-he-thong/01-TC-nhat-ky-he-thong.md) | FR-VIII-28 — Nhật ký hệ thống (System Log) | 46 |

### 4. QTHT — Tài khoản & Phân quyền (SCR-VIII-02..05) — **128 TC**

| File | Chức năng (SRS Ref) | Số TC |
|------|---------------------|------:|
| [01-TC-quan-ly-vai-tro.md](QTHT/Tai-khoan-phan-quyen/01-TC-quan-ly-vai-tro.md) | UC112 — Quản lý Vai trò (FR-VIII-14) | 29 |
| [02-TC-quan-ly-tai-khoan.md](QTHT/Tai-khoan-phan-quyen/02-TC-quan-ly-tai-khoan.md) | UC113 — Quản lý Tài khoản người dùng (FR-VIII-15) | 57 |
| [03-TC-phan-quyen-du-lieu.md](QTHT/Tai-khoan-phan-quyen/03-TC-phan-quyen-du-lieu.md) | UC114 — Phân quyền truy cập dữ liệu (FR-VIII-16) | 20 |
| [04-TC-phan-quyen-chuc-nang.md](QTHT/Tai-khoan-phan-quyen/04-TC-phan-quyen-chuc-nang.md) | UC115 — Phân quyền chức năng (FR-VIII-17) | 22 |

### 5. Hỏi đáp (SRS-FR-02) — **118 TC**

| File | Chức năng (SRS Ref) | Số TC |
|------|---------------------|------:|
| [01-TC-quan-ly-hoi-dap.md](hoi-dap/01-TC-quan-ly-hoi-dap.md) | FR-II-01 (UC10) — Quản lý thông tin Hỏi đáp | 27 |
| [02-TC-tim-kiem-tong-hop.md](hoi-dap/02-TC-tim-kiem-tong-hop.md) | FR-II-02/05/10 (UC11/14/19) — Tìm kiếm Hỏi đáp | 12 |
| [03-TC-tiep-nhan-xu-ly.md](hoi-dap/03-TC-tiep-nhan-xu-ly.md) | FR-II-03 (UC12) — Tiếp nhận xử lý Hỏi đáp | 12 |
| [04-TC-quan-ly-tiep-nhan.md](hoi-dap/04-TC-quan-ly-tiep-nhan.md) | FR-II-04/09 (UC13/UC18) — Quản lý tiếp nhận & đã xử lý | 11 |
| [05-TC-phan-cong-xu-ly.md](hoi-dap/05-TC-phan-cong-xu-ly.md) | FR-II-06 (UC15) — Phân công xử lý câu hỏi | 12 |
| [06-TC-phan-hoi-cau-hoi.md](hoi-dap/06-TC-phan-hoi-cau-hoi.md) | FR-II-07 (UC16) — Phản hồi câu hỏi | 16 |
| [07-TC-phe-duyet-cong-khai.md](hoi-dap/07-TC-phe-duyet-cong-khai.md) | FR-II-08 (UC17) — Phê duyệt & Công khai phản hồi | 28 |

### 6. CG-TVV — **0 TC** (thư mục rỗng, chưa viết test case)

### 7. Doanh nghiệp — **0 TC** (thư mục rỗng, chưa viết test case)

---

## Ghi chú

- **TPL-DM-CRUD Chung (47 TC)** là test case template áp dụng cho cả 14 danh mục dùng chung — KHÔNG nhân chéo với 9 file DM còn lại (chúng chỉ thêm TC đặc thù riêng cho từng danh mục).
- File `00-test-plan-overview.md`, `*REVIEW*-edge-case-hunter*.md`, `edge-case-review-*.md` không tính vào tổng (là tài liệu plan/review, không phải test case thực thi).
- 2 thư mục `CG-TVV/` và `doanh-nghiep/` hiện rỗng — module chưa có test case viết.
