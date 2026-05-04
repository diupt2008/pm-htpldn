# B.2 BR-DATA: Quy tắc Dữ liệu

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|-----------|---------|------------|
| BR-DATA-01 | **Soft delete:** Mọi thao tác xóa đều là soft delete (set `is_deleted = 1`). Không xóa vật lý ngoại trừ purge theo policy retention | PRD FR-II-01, pattern IP-01 | Toàn bộ CRUD | AUDIT_LOG: không xóa | Verify DELETE = UPDATE is_deleted |
| BR-DATA-02 | **Multi-tenant scoping:** Mọi bản ghi nghiệp vụ PHẢI có `don_vi_id` NOT NULL. Query phải filter theo phân quyền dữ liệu theo đơn vị | Architecture AD-07 | Toàn bộ | DANH_MUC dùng chung: `don_vi_id` có thể NULL (danh mục hệ thống) | Verify NOT NULL constraint |
| BR-DATA-03 | **Common fields:** Mọi entity đều có 7 common fields (id, created_at, updated_at, created_by, updated_by, is_deleted, don_vi_id) | Section 3.4.1.1 | Toàn bộ | AUDIT_LOG: chỉ có id, thoi_gian, entity fields | Verify DDL script |
| BR-DATA-04 | **Auto-gen mã:** Các entity nghiệp vụ có mã tự sinh theo format `PREFIX-YYYYMMDD-SEQ` (VD: HD-20260325-001 (Hỏi đáp), HDTV-20260325-001 (Hợp đồng), VV-HCM-20260325-001) | Team design | FR-II-01, FR-V.I-01, FR-V.II-01 | — | Verify uniqueness + format |
| BR-DATA-05 | **Audit trail:** Mọi thao tác CUD + phê duyệt + đăng nhập/xuất đều ghi vào AUDIT_LOG. Log là immutable, không sửa/xóa | NFR-06 | Toàn bộ | — | Verify INSERT-only trên AUDIT_LOG |
| BR-DATA-06 | **Export Excel:** Mọi danh sách có tính năng xuất Excel. File xuất theo bộ lọc hiện tại, không vượt quá 10,000 rows/file | Pattern IP-01 | Toàn bộ CRUD list | Báo cáo nhóm IX có xuất Word | Test export limit |
| BR-DATA-07 | **Pagination:** Mọi danh sách sử dụng phân trang. Default: 20 rows/page, max: 100 rows/page | UX-Spec | Toàn bộ list | Dashboard (nhóm I): không phân trang | Verify API response |
| BR-DATA-08 | **Full-text search:** Hỏi đáp (noi_dung) và Kho câu hỏi (cau_hoi/cau_tra_loi) hỗ trợ tìm kiếm toàn văn | FR-II-02, FR-X.1-02, FR-X.2-04 | FR-II-02, FR-X.1-02, FR-X.2-04 | Các entity khác: search by tìm kiếm theo từ khóa | Verify chỉ mục tìm kiếm toàn văn |

**Trạng thái:** ✅ CĐT xác nhận
