# B.5 BR-SLA: Quy tắc SLA

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|-----------|---------|------------|
| BR-SLA-01 | **SLA mặc định vụ việc HTPL = 10 ngày làm việc** (NĐ55/2019 Điều 9) | NĐ55 Điều 9 | FR-V.I-01, FR-VIII-10 | Có thể cấu hình khác tại UC108 | Verify seed data |
| BR-SLA-02 | **4 mức cảnh báo:** (1) Bình thường (>50% thời hạn còn lại), (2) Sắp hết hạn (<50% còn lại, vàng), (3) Quá hạn (>100%, đỏ), (4) Quá hạn nghiêm trọng (>2x thời hạn, đen). Mặc định cố định, QTHT cấu hình được qua UC108 | PRD FR-VIII-10, team design, Reference A.4 | FR-VIII-10, FR-II-CROSS-01, FR-V.I-NEW-01 | — | Test 4 mức trên dữ liệu mock |
| BR-SLA-03 | **Thông báo cảnh báo SLA:** Khi chuyển mức cảnh báo, gửi thông báo in-app + email cho CB NV xử lý + CB PD quản lý | FR-VIII-10, NFR-10 | FR-VIII-10 | Chỉ gửi khi BẬT cấu hình gui_email_canh_bao / gui_thong_bao_app | Test notification trigger |
| BR-SLA-04 | **Ngày làm việc:** Thứ 2-6 (trừ ngày lễ quốc gia + ngày nghỉ bù). Danh sách ngày lễ quản lý tại entity NGAY_LE (Section 3.4.4.51), QTHT cập nhật hàng năm theo Quyết định của Thủ tướng. | Team design | FR-VIII-10 | — | Test SLA qua ngày lễ |
| BR-SLA-05 | **Dashboard hiển thị SLA:** Biểu đồ tỷ lệ tuân thủ SLA = COUNT(hoan_thanh_dung_han) / COUNT(hoan_thanh) * 100% | FR-I-08 | FR-I-08 | — | Test dashboard SLA widget |

**Trạng thái:** ✅ CĐT xác nhận (SLA 10 ngày, 4 mức cảnh báo)
