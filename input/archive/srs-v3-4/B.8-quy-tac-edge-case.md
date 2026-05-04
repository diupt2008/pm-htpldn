# B.8 Quy tắc Edge Case (EC Rules)

| Mã | Tên | Mô tả | Loại | Nguồn |
|----|-----|-------|------|-------|
| BR-EC-01 | Optimistic Locking | Tất cả UPDATE/DELETE SHALL kiểm tra updated_at trước khi thực thi. Nếu xung đột → ERR-SYS-02 | Ràng buộc | IEEE 830 EC |
| BR-EC-02 | Soft-delete Cascade | Khi soft-delete bản ghi cha, ứng dụng SHALL cascade soft-delete bản ghi con. Khi restore → restore con | Ràng buộc | IEEE 830 EC |
| BR-EC-03 | File Antivirus Scan | Tất cả file upload SHALL quét antivirus trước lưu trữ. Nhiễm → từ chối ERR-FILE-02 | Bảo mật | IEEE 830 EC |
| BR-EC-04 | Storage Quota | Mỗi đơn vị có hạn mức lưu trữ (mặc định 10GB). 90% → cảnh báo. 100% → từ chối ERR-FILE-01 | Ràng buộc | IEEE 830 EC |
| BR-EC-05 | Session Limit | Tối đa 3 phiên đồng thời/user. Phiên thứ 4 hủy phiên cũ nhất. QTHT: 1 phiên | Bảo mật | IEEE 830 EC |
| BR-EC-06 | CSRF Protection | CMS session endpoints dùng double-submit cookie (X-CSRF-Token). SameSite=Strict | Bảo mật | IEEE 830 EC |
| BR-EC-07 | Token Hash | token_reset_mk lưu SHA-256 hash, KHÔNG plaintext | Bảo mật | IEEE 830 EC |
| BR-EC-08 | Refresh Token Revoke | Logout/Lock/Disable → thêm tất cả refresh token vào blacklist Redis ngay lập tức | Bảo mật | IEEE 830 EC |
| BR-EC-09 | VNeID Fallback Limit | Fallback auth local tối đa 72h/đợt. Sau 72h QTHT phải gia hạn. Xác thực lại trong 24h sau khôi phục | Bảo mật | IEEE 830 EC |
| BR-EC-10 | DLQ Processing | Message fail 3 lần → DLQ. Alert QTHT. QTHT có UI retry/discard. Hết hạn 7 ngày | Vận hành | IEEE 830 EC |
| BR-EC-11 | Email Fail Escalation | 3 lần gửi thất bại → đánh dấu THAT_BAI + tạo in-app notification + alert QTHT dashboard | Vận hành | IEEE 830 EC |
| BR-EC-12 | Pagination Guard | page_size ∈ [1,100] default 20. page >= 1 default 1. Ngoài phạm vi → ERR-PARAM-01 | Ràng buộc | IEEE 830 EC |
| BR-EC-13 | Search Sanitize | Keyword: trim, max 200 ký tự, escape ký tự đặc biệt truy vấn. Bảng > 10K → tìm kiếm toàn văn | Bảo mật | IEEE 830 EC |
| BR-EC-14 | Annual Ceiling Reset | da_chi_trong_nam reset về 0 vào ngày 1/1 mỗi năm dương lịch theo NĐ55 | Tính toán | NĐ55/2019 |
| BR-EC-15 | YEU_CAU_BO_SUNG Count Limit | Tối đa 3 lần bổ sung (HO_SO_CHI_TRA.bo_sung_count ≤ 3). Khi `bo_sung_count ≥ 3 AND ket_qua ≠ DAT` → auto TU_CHOI với `ly_do_tu_choi = "Đã bổ sung 3 lần không đạt"`. Áp dụng: FR-V.II-03 (sync, trigger khi kiểm tra). Tương tự pattern cho FR-V.I (vụ việc) | Quy trình | IEEE 830 EC, NĐ55 Điều 9 |
| BR-EC-16 | YEU_CAU_BO_SUNG Deadline | Khi `elapsed(ngay_yeu_cau_bo_sung) > CAU_HINH_SLA[{entity}_BO_SUNG].thoi_han_ngay` → auto TU_CHOI + TB. Hồ sơ chi trả dùng `HO_SO_CHI_TRA_BO_SUNG` (default 5 ngày LV). Áp dụng qua scheduled job: FR-V.II-CROSS-01, FR-V.I-CROSS-01 | Quy trình | IEEE 830 EC, NĐ55 Điều 9 |
| BR-EC-17 | Approval Escalation | Nếu CHO_PHE_DUYET quá N ngày LV (mặc định 3) → auto-escalate CB PD cấp trên + nhắc nhở | Quy trình | IEEE 830 EC |
| BR-EC-18 | Assignment Timeout | NHT/CG không phản hồi phân công trong 3 ngày LV → tự động hoàn về trạng thái trước + alert CB NV | Quy trình | IEEE 830 EC |
| BR-EC-19 | Batch Size Limit | Batch approve/batch operations: tối đa 100 bản ghi/request | Ràng buộc | IEEE 830 EC |
| BR-EC-20 | DB Transaction Consistency | Khi commit local thành công nhưng LGSP API fail → rollback hoặc queue compensating call. KHÔNG set trạng thái mới trước khi API thành công | Tích hợp | IEEE 830 EC |
| BR-EC-21 | LGSP Idempotency | Inbound LGSP: kiểm tra ma_ho_so trùng. Nếu trùng → trả HTTP 409 với mã đã tạo. KHÔNG tạo bản ghi mới | Tích hợp | IEEE 830 EC |
| BR-EC-22 | Payment Zero Guard | phi_tu_van và so_tien_de_nghi PHẢI > 0. so_tien_thuc_tra ≤ so_tien_duyet. Vượt → ERR-CT-KQ-01 | Tính toán | NĐ55/2019 |
| BR-EC-23 | Evaluation Weight Tolerance | Tổng trọng số tiêu chí: cho phép ±0.01% sai số do làm tròn (33.33+33.33+33.34=100.00) | Tính toán | IEEE 830 EC |

---

## BR-PUBLIC-01: Điều kiện công khai `[CR-01]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-PUBLIC-01 | Entity có quy trình (SM): chỉ bản ghi ở trạng thái cuối (Hoàn thành/Đã duyệt/Đã phản hồi/Đang hoạt động) mới được set cong_khai = 1. Entity không có quy trình: công khai bất kỳ lúc nào. Bản ghi bị Từ chối/Hủy: KHÔNG được công khai | CR-01, INS-15 | 12 FR files (BIEU_MAU, CHUONG_TRINH_DAO_TAO, TU_LIEU_PHAP_LY_VV, TU_VAN_VIEN, TO_CHUC_TU_VAN, VU_VIEC, HOI_DAP, BAI_GIANG, KHO_CAU_HOI, NOI_DUNG_TU_VAN_CS, KHOA_HOC, KE_HOACH_DAO_TAO) | — | Test công khai bản ghi chưa hoàn thành = error |

## BR-PUBLIC-02: Hủy công khai `[CR-01]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-PUBLIC-02 | Set cong_khai = 0. Clear thoi_gian_dang_tai = NULL. Gỡ khỏi chuyên trang API | CR-01 | Tương tự BR-PUBLIC-01 | — | Test hủy CK → thoi_gian_dang_tai = NULL |

## BR-PUBLIC-03: Thời gian đăng tải `[CR-01]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-PUBLIC-03 | Auto fill = thời điểm cuối cùng set cong_khai = 1. Không cho phép sửa tay | CR-01 | Tương tự BR-PUBLIC-01 | — | Test sửa tay thoi_gian_dang_tai = error |

## BR-ROUTE-HD-01: Routing hỏi đáp theo cơ quan DN chọn `[CR-06]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-ROUTE-HD-01 | DN gửi từ Cổng: don_vi_id = cơ quan DN chọn (mặc định Sở TP tỉnh DN). CB nhập tay: don_vi_id = đơn vị CB đang đăng nhập (không đổi). HT khác gửi qua API: don_vi_id = đơn vị nguồn (auto). CB NV chỉ thấy HOI_DAP thuộc đơn vị mình (multi-tenant, BR-DATA-02) | CR-06, Q-04, Q-05 | FR-II-01, FR-XII | — | Test DN chọn cơ quan khác → routing đúng |

## BR-ROUTE-TVCS-01: Routing TV chuyên sâu theo cơ quan DN chọn `[CR-06]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-ROUTE-TVCS-01 | Tương tự BR-ROUTE-HD-01, áp dụng cho NOI_DUNG_TU_VAN_CS. DN chọn cơ quan tiếp nhận khi gửi từ Cổng | CR-06, Q-04 | FR-X.1-01, FR-X.1-03, FR-XII | — | Test routing TV CS |

## BR-PUBLIC-04: Công khai VU_VIEC — quy tắc hiển thị `[CR-01][Q-NEW-02]`

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|------------|---------|------------|
| BR-PUBLIC-04 | Khi VU_VIEC được công khai (cong_khai=1), áp dụng quy tắc hiển thị theo bảng chi tiết bên dưới. Cơ chế chính: CB NV soạn `mo_ta_cong_khai` riêng (không auto-extract từ `mo_ta` nội bộ) — đây là firewall đảm bảo chỉ nội dung đã review mới lên chuyên trang. Pattern tham chiếu: NQ 03/2017/NQ-HĐTP (mã hóa danh tính, giữ nội dung vụ án) + NĐ 55/2019 Điều 4 (DN được truy cập CSDL vụ việc HTPL) | CR-01, Q-NEW-02, NĐ 55/2019 Đ.4, NQ 03/2017 | FR-V (VU_VIEC), FR-XII (API công khai) | — | Test API công khai VV: verify whitelist fields only |

**Fields HIỂN THỊ trên chuyên trang (whitelist):**

| # | Field | Nguồn | Mục đích |
|---|-------|-------|----------|
| 1 | linh_vuc_phap_luat | VU_VIEC | DN tìm case tương tự theo lĩnh vực |
| 2 | loai_hinh_ho_tro | VU_VIEC | Tư vấn / Đại diện / Hòa giải |
| 3 | mo_ta_cong_khai | CPF — CB NV soạn riêng | Tóm tắt vụ việc + kết quả, đã anonymize |
| 4 | thoi_gian_xu_ly | Tính: ngay_hoan_thanh − ngay_tiep_nhan | DN đánh giá hiệu quả xử lý |
| 5 | don_vi (tên Sở TP) | DON_VI.ten_don_vi | Cơ quan xử lý |
| 6 | ket_qua | VU_VIEC | Thành công / Không thành công |
| 7 | thoi_gian_dang_tai | CPF — auto | Ngày đăng lên chuyên trang |
| 8 | anh_dai_dien | CPF | Ảnh minh họa (không phải ảnh DN) |
| 9 | file_dinh_kem_cong_khai | CPF — CB NV chọn | File đã review, phù hợp công khai |

**Fields KHÔNG hiển thị (blacklist):**

| # | Field | Lý do |
|---|-------|-------|
| 1 | Tên DN / người đại diện | Mã hóa danh tính (NQ 03/2017 pattern) |
| 2 | CCCD / MST | Dữ liệu định danh |
| 3 | mo_ta (nội bộ) | Chứa chi tiết nhạy cảm chưa review |
| 4 | file_dinh_kem (nghiệp vụ) | Hồ sơ gốc — chưa review cho công khai |
| 5 | noi_dung_tu_van | Nội dung tư vấn cụ thể cho DN |
| 6 | SĐT / email / địa chỉ DN | Thông tin liên hệ cá nhân/DN |

---
