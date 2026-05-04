# Test Cases — FR-II-02/05/10 (UC11/14/19): Tìm kiếm Hỏi đáp (SRS-FR-02)

> **SRS Ref**: FR-II-02 (UC11), FR-II-05 (UC14), FR-II-10 (UC19), SCR-II-01  
> **Nguồn**: NotebookLM Session `7176b671`  
> **Ngày tạo**: 2026-04-18  
> **Đặc thù**: 3 UC tìm kiếm gộp vì cùng bộ lọc, chỉ khác phạm vi trạng thái. Full-text search tiếng Việt (BR-DATA-08).

---

## Quy ước

| Ký hiệu | Ý nghĩa |
|----------|---------|
| **TraceID** | Ánh xạ 1-1 chính xác với mã yêu cầu gốc trong SRS. **TUYỆT ĐỐI KHÔNG tự chế mã.** |
| **Happy** | Luồng chính — dữ liệu hợp lệ, quyền đúng |
| **Negative** | Luồng lỗi — dữ liệu sai, thiếu quyền, vi phạm ràng buộc |
| **Edge** | Ranh giới — boundary values, SRS gap, trạng thái đặc biệt |

---

## Phân biệt 3 UC tìm kiếm

| UC | Mã FR | Phạm vi trạng thái (Hard filter) | Output bổ sung |
|----|--------|----------------------------------|----------------|
| UC11 | FR-II-02 | Tất cả trạng thái | — |
| UC14 | FR-II-05 | TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY | nguoi_phan_cong |
| UC19 | FR-II-10 | DA_DUYET, CONG_KHAI, HOAN_THANH | nguoi_duyet, ngay_duyet |

## Bộ lọc chung

| Trường lọc | Kiểu | Ghi chú |
|-----------|------|---------|
| keyword | text | Full-text search (BR-DATA-08, tsvector, unaccent tiếng Việt) |
| linh_vuc_id | dropdown FK | Lĩnh vực PL |
| tu_ngay, den_ngay | date range | Khoảng thời gian |
| trang_thai | dropdown | Trạng thái (chỉ UC11) |
| kenh_tiep_nhan | dropdown | Kênh tiếp nhận |

---

## A. TÌM KIẾM TỔNG HỢP — UC11 (FR-II-02)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TK-001 | FR-II-02 / BR-DATA-08 | Tìm kiếm theo keyword — full-text search | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi có noi_dung chứa "thành lập doanh nghiệp". | keyword: "thanh lap doanh nghiep" (không dấu) | 1. Nhập keyword "thanh lap doanh nghiep" vào thanh tìm kiếm. 2. Click [Tìm kiếm]. | 1. Kết quả trả về các bản ghi chứa "thành lập doanh nghiệp" (full-text, unaccent). 2. BR-DATA-08: tsvector khớp tiếng Việt không dấu. | Happy |
| TC-TK-002 | FR-II-02 | Tìm kiếm kết hợp đa tiêu chí (AND logic) | 1. User CB_NV đã đăng nhập. 2. Tồn tại dữ liệu đa dạng. | keyword: "hợp đồng", linh_vuc_id: [Hợp đồng], trang_thai: "MOI", kenh_tiep_nhan: "DVC" | 1. Nhập keyword "hợp đồng". 2. Chọn Lĩnh vực = Hợp đồng. 3. Chọn Trạng thái = Mới. 4. Chọn Kênh = DVC. 5. Click [Tìm kiếm]. | 1. Chỉ hiển thị bản ghi thỏa MÃN TẤT CẢ các tiêu chí (AND logic). 2. Phân trang kết quả nếu > 20 rows. | Happy |
| TC-TK-003 | FR-II-02 / INF-HD-TK-01 | Tìm kiếm không có kết quả | 1. User CB_NV đã đăng nhập. | keyword: "xyznonexistent12345" | 1. Nhập keyword không khớp bất kỳ bản ghi nào. 2. Click [Tìm kiếm]. | 1. INF-HD-TK-01: "Không tìm thấy hỏi đáp phù hợp". 2. Bảng danh sách trống. | Happy |
| TC-TK-004 | FR-II-02 / ERR-HD-TK-01 | Tìm kiếm — ngày bắt đầu > ngày kết thúc → lỗi | 1. User CB_NV đã đăng nhập. | tu_ngay: "2026-04-20", den_ngay: "2026-04-15" | 1. Chọn tu_ngay = 20/04/2026. 2. Chọn den_ngay = 15/04/2026. 3. Click [Tìm kiếm]. | 1. Lỗi ERR-HD-TK-01: "Ngày bắt đầu phải trước ngày kết thúc". 2. Không thực hiện tìm kiếm. | Negative |
| TC-TK-005 | FR-II-02 / BR-AUTH-08 | 🟡 Tìm kiếm — CB BN chỉ thấy data đơn vị mình dù không nhập bộ lọc | 1. User CB_NV_BN đã đăng nhập. 2. Tồn tại data đa đơn vị. | keyword: "" (trống — lấy tất cả) | 1. Không nhập bất kỳ tiêu chí nào. 2. Click [Tìm kiếm]. | 1. Chỉ trả về bản ghi thuộc đơn vị CB_NV_BN (Row-Level Security — BR-AUTH-08). 2. KHÔNG trả về bản ghi TW, BN khác, ĐP. | Edge |

---

## B. TÌM KIẾM ĐÃ TIẾP NHẬN — UC14 (FR-II-05)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TK-006 | FR-II-05 | Tìm kiếm hỏi đáp đã tiếp nhận — hard filter trạng thái | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi ở TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY, DA_DUYET, MOI. | keyword: "" | 1. Mở tab "Đang xử lý" (UC13/UC14). 2. Không nhập tiêu chí. 3. Xem kết quả. | 1. Chỉ hiển thị bản ghi có trang_thai IN (TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY). 2. KHÔNG hiển thị MOI, DA_DUYET, CONG_KHAI, HOAN_THANH. 3. Cột bổ sung: nguoi_phan_cong. | Happy |
| TC-TK-007 | FR-II-05 / INF-HD-TK-02 | Tìm kiếm đã tiếp nhận — không kết quả | 1. User CB_NV_BN mới đăng nhập. 2. Đơn vị BN chưa có bản ghi nào ở trạng thái TIEP_NHAN/DA_PHAN_CONG/DANG_XU_LY. | — | 1. Mở tab "Đang xử lý". | 1. INF-HD-TK-02: "Không tìm thấy hỏi đáp đã tiếp nhận phù hợp". | Negative |
| TC-TK-008 | FR-II-05 / BR-AUTH-08 | 🟡 Tìm kiếm đã tiếp nhận — kết hợp hard filter + Row-Level Security | 1. User CB_NV_DP đã đăng nhập (Sở TP HN). 2. Tồn tại bản ghi DANG_XU_LY từ Sở TP HN và từ Sở TP HCM. | keyword: "hỗ trợ" | 1. Mở tab "Đang xử lý". 2. Nhập keyword "hỗ trợ". | 1. Chỉ trả về bản ghi: trang_thai IN (TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY) AND don_vi_id = Sở TP HN. 2. KHÔNG trả về data Sở TP HCM (ngang cấp KHÔNG thấy nhau). | Edge |

---

## C. TÌM KIẾM ĐÃ XỬ LÝ — UC19 (FR-II-10)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TK-009 | FR-II-10 | Tìm kiếm câu hỏi đã xử lý — hard filter completed | 1. User CB_NV đã đăng nhập. 2. Tồn tại bản ghi ở DA_DUYET, CONG_KHAI, HOAN_THANH. | keyword: "" | 1. Mở tab "Hoàn thành" (UC18/UC19). 2. Không nhập tiêu chí. | 1. Chỉ hiển thị bản ghi có trang_thai IN (DA_DUYET, CONG_KHAI, HOAN_THANH). 2. KHÔNG hiển thị MOI, TIEP_NHAN, DANG_XU_LY, CHO_PHE_DUYET. 3. Cột bổ sung: nguoi_duyet, ngay_duyet. | Happy |
| TC-TK-010 | FR-II-10 / BR-DATA-08 | 🟡 Full-text search trên tập đã xử lý — kiểm tra performance | 1. User CB_NV_TW đã đăng nhập. 2. Tổng số bản ghi đã xử lý > 10.000. | keyword: "thuế thu nhập" | 1. Mở tab "Hoàn thành". 2. Nhập keyword "thuế thu nhập". 3. Đo thời gian phản hồi. | 1. Kết quả trả về chính xác (full-text tsvector, không phải LIKE). 2. Thời gian phản hồi chấp nhận được (BR-DATA-08: optimize cho bảng > 10.000 rows). | Edge |

---

## D. EDGE CASES BỔ SUNG — TÌM KIẾM

> **Nguồn bổ sung**: Edge Case Review `edge-case-review-FR02.md` — NotebookLM Session `d51cd9c3`

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| TC-TK-011 | FR-II-02 / DG-06 | 🟢 Tìm kiếm — kết quả sắp xếp theo Ngày tạo DESC mặc định | 1. User CB_NV đã đăng nhập. 2. Khớp nhiều kết quả. | keyword: "doanh nghiệp" | 1. Nhập keyword. 2. Click [Tìm kiếm]. 3. Kiểm tra thứ tự kết quả. | 1. Kết quả sắp xếp = Ngày tạo DESC (DG-06). 2. Bản ghi mới nhất hiển thị đầu tiên. | Edge |
| TC-TK-012 | FR-II-02 | 🟢 Tìm kiếm chỉ nhập tu_ngay (không nhập den_ngay) → xử lý partial range | 1. User CB_NV đã đăng nhập. | tu_ngay: "2026-01-01", den_ngay: null | 1. Chọn tu_ngay = 01/01/2026. 2. Bỏ trống den_ngay. 3. Click [Tìm kiếm]. | 1. Hệ thống tìm tất cả bản ghi từ 01/01/2026 trở đi (đến hiện tại). 2. HOẶC yêu cầu nhập cả 2 ngày. 3. **SRS Gap (G10)**: Cần xác minh hành vi thực tế. | Edge |

---

<!-- 
TRACEABILITY NOTE:
- UC11 (FR-II-02): Tìm kiếm tổng hợp toàn bộ kho dữ liệu
- UC14 (FR-II-05): Tìm kiếm trong phạm vi đang xử lý — cùng bộ lọc UC11 + AND hard filter
- UC19 (FR-II-10): Tìm kiếm trong phạm vi đã hoàn thành — cùng bộ lọc + AND hard filter
- Tất cả ERR/INF codes lấy nguyên văn từ NotebookLM Session 7176b671
- Section D bổ sung từ Edge Case Review 2026-04-18 (Session d51cd9c3)
-->
