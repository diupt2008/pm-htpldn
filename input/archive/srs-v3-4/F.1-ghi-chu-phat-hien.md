# Ghi chú phát hiện trong quá trình soạn SRS

| # | Phát hiện | Mức độ | Xử lý |
|---|----------|--------|-------|
| 1 | UC mới không có trong PRD gốc được bổ sung (7 UCs) dựa trên phân tích gap | Thông tin | Đã đánh dấu "UC mới" trong tên FR |
| 2 | Nhóm X.1 (Quản lý Tư vấn pháp luật chuyên sâu) có nhiều assumption do thiếu chi tiết trong PRD | Cảnh báo | Đã đánh dấu toàn bộ nhóm X.1 bằng flag "Giả định" |
| 3 | API inbound từ DVC/Cổng PLQG/VNeID cần tài liệu kỹ thuật từ CĐT (chưa có) | Cảnh báo | Đã ghi nhận tại §3.1.2 (INT-01..07). Chi tiết API contracts → Architecture Design |
| 4 | SM-HD và SM-HOIDAP, SM-VUVIEC và SM-VV là alias — đã normalize toàn bộ sang SM-HOIDAP và SM-VUVIEC | Thông tin | Fixed in v1.8 |
| 5 | **v1.6:** UC55 thay đổi hoàn toàn từ "email" → "HT khác" (CSV v1.1) | Quan trọng | Đã viết lại FR-V.I-05, sửa enum, SM, BR |
| 6 | **v1.6:** C-08 sai — kiến trúc hybrid 3 kênh (LGSP/NDXP/Trực tiếp), không phải tất cả qua LGSP | Quan trọng | Đã sửa C-08, A-02, SI-01, SI-04, Context Diagram, BR-INTG-01 |
| 7 | **v1.6:** 20 UC có transaction cập nhật trong CSV v1.1, 8 FR thiếu processing steps | Cảnh báo | Đã bổ sung transaction cho UC33,44,47,49,50,91,94,97 |
| 5 | Mẫu biểu mẫu TT17/2025/TT-BTP cần cập nhật nếu Thông tư sửa đổi | Rủi ro | Thiết kế template engine linh hoạt (FR-VII) |
