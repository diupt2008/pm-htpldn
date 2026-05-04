# A.1 Backward Traceability (Requirement → Source)

Ma trận truy vết ngược — từ yêu cầu phần mềm về nguồn gốc (per-FR):

## A.1.1 Nhóm I — Dashboard (9 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-I-01 | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | PRD §4.1 | — | I |
| FR-I-02 | Tổng hợp vụ việc đã tiếp nhận | UC2 | PRD §4.1 | — | I |
| FR-I-03 | Tổng hợp vụ việc đang hỗ trợ | UC3 | PRD §4.1 | — | I |
| FR-I-04 | Tổng hợp vụ việc đã hoàn thành | UC4 | PRD §4.1 | — | I |
| FR-I-05 | Tổng hợp khóa đào tạo đang diễn ra | UC5 | PRD §4.1 | — | I |
| FR-I-06 | Tổng hợp khóa đào tạo đã diễn ra | UC6 | PRD §4.1 | — | I |
| FR-I-07 | Tổng số chuyên gia/TVV | UC7 | PRD §4.1 | — | I |
| FR-I-08 | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | PRD §4.1 | — | I |
| FR-I-09 | Biểu đồ chất lượng đào tạo | UC9 | PRD §4.1 | — | I |

## A.1.2 Nhóm II — Hỏi đáp, Vướng mắc PL (13 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-II-01 | Quản lý thông tin hỏi đáp, vướng mắc PL | UC10 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4); TT 03/2020 | II |
| FR-II-02 | Tìm kiếm hỏi đáp tổng hợp | UC11 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-03 | Tiếp nhận xử lý hỏi đáp | UC12 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-04 | Quản lý thông tin tiếp nhận xử lý | UC13 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-05 | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-06 | Phân công xử lý câu hỏi | UC15 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-07 | Phản hồi câu hỏi | UC16 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-08 | Quản lý công khai phản hồi | UC17 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-09 | Quản lý câu hỏi đã xử lý | UC18 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-10 | Tìm kiếm câu hỏi đã xử lý | UC19 | PRD §4.2 | NĐ 55/2019 (Đ.3, 4) | II |
| FR-II-NEW-01 | Cấu hình lĩnh vực ↔ phân công xử lý | UC mới | PRD §4.2 (inferred) | — | II |
| FR-II-NEW-02 | Quản lý mẫu câu hỏi/phản hồi | UC mới | PRD §4.2 (inferred) | — | II |
| FR-II-CROSS-01 | Cấu hình SLA thời gian xử lý hỏi đáp | Cross-cutting | PRD §4.2 | NĐ 55/2019 (Đ.10) | II |

## A.1.3 Nhóm III — Đào tạo, Tập huấn (22 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-III-01 | Quản lý Chương trình đào tạo | UC20 | PRD §4.3 | NĐ 55/2019 (Đ.6); TT 03/2020 | III |
| FR-III-02 | Tìm kiếm Chương trình đào tạo | UC21 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-03 | Quản lý đăng ký đào tạo | UC22 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-04 | Đăng ký tham gia học tập | UC23 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-05 | Quản lý kiểm tra, đánh giá kết quả | UC24 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-06 | Tìm kiếm kết quả | UC25 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-07 | Quản lý kho tài liệu, bài giảng | UC26 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-08 | Tìm kiếm tài liệu | UC27 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-09 | Quản lý ngân hàng câu hỏi | UC28 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-10 | Tìm kiếm ngân hàng câu hỏi | UC29 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-11 | Quản lý giảng viên, trợ giảng | UC30 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-12 | Tìm kiếm giảng viên | UC31 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-13 | Quản lý đề xuất đào tạo | UC32 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-14 | Lập kế hoạch đào tạo | UC33 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-15 | Phê duyệt kế hoạch | UC34 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-16 | Công khai kế hoạch | UC35 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-17 | Ghi nhận kết quả | UC36 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-18 | Phê duyệt kết quả | UC37 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-19 | Công bố kết quả đào tạo bồi dưỡng | UC38 | PRD §4.3 | NĐ 55/2019 (Đ.6) | III |
| FR-III-NEW-01 | Tạo đề kiểm tra | UC mới | PRD §4.3 (inferred) | — | III |
| FR-III-NEW-02 | Quản lý đề kiểm tra | UC mới | PRD §4.3 (inferred) | — | III |
| FR-III-NEW-03 | Phân phối đề + map bài giảng | UC mới | PRD §4.3 (inferred) | — | III |

## A.1.4 Nhóm IV — Mạng lưới Tư vấn viên (13 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-IV-01 | Quản lý tư vấn viên | UC39 | PRD §4.4 | NĐ 55/2019 (Đ.5); TT 03/2020 | IV |
| FR-IV-02 | Tìm kiếm TVV | UC40 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-03 | Quản lý đăng ký tham gia MLTV | UC41 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-04 | Cập nhật hồ sơ năng lực TVV | UC42 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-05 | Quản lý hồ sơ TVV | UC43 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-06 | Thẩm định hồ sơ TVV | UC44 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-07 | Phê duyệt hồ sơ TVV | UC45 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-08 | Cập nhật danh sách MLTV công khai | UC46 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-09 | Đánh giá TVV | UC47 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-10 | Quản lý lịch sử hỗ trợ TVV | UC48 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-11 | Cập nhật thông tin TVV | UC49 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-12 | Cập nhật trạng thái hoạt động TVV | UC50 | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |
| FR-IV-CROSS-01 | Tiêu chí thẩm định TVV (Danh mục) | Cross-cutting | PRD §4.4 | NĐ 55/2019 (Đ.5) | IV |

## A.1.5 Nhóm V.I — Vụ việc TGPL (19 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-V.I-01 | Quản lý hồ sơ yêu cầu HTPL | UC51 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7); TT 03/2020; Luật TGPL 2017 | V.I |
| FR-V.I-02 | Gửi hồ sơ yêu cầu HTPL | UC52 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-03 | Tiếp nhận hồ sơ qua DVC | UC53 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-04 | Nhập hồ sơ yêu cầu thủ công | UC54 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-05 | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | PRD §4.5.1, CSV v1.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-06 | Kiểm tra hồ sơ yêu cầu | UC56 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-07 | Quản lý hồ sơ vụ việc | UC57 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-08 | Tìm kiếm hồ sơ | UC58 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-09 | Lựa chọn người hỗ trợ | UC59 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-10 | Xác nhận tham gia hỗ trợ | UC60 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-11 | Trình phê duyệt | UC61 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-12 | Thông báo kết quả tiếp nhận | UC62 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-13 | Phê duyệt hồ sơ vụ việc | UC63 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-14 | Doanh nghiệp nhận thông báo | UC64 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-15 | NHT cập nhật kết quả hỗ trợ | UC65 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-16 | CB NV cập nhật kết quả vụ việc | UC66 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-17 | Đánh giá kết quả hỗ trợ vụ việc | UC67 | PRD §4.5.1 | NĐ 55/2019 (Đ.3, 4, 7) | V.I |
| FR-V.I-NEW-01 | Thiết lập quy trình hỗ trợ TVPLDN | UC mới | PRD §4.5.1 (inferred) | NĐ 55/2019 (Đ.7) | V.I |
| FR-V.I-CROSS-01 | Cấu hình SLA vụ việc | Cross-cutting | PRD §4.5.1 | NĐ 55/2019 (Đ.10) | V.I |

## A.1.6 Nhóm V.II — Chi trả Chi phí TV (13 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-V.II-01 | Tiếp nhận hồ sơ từ DVC | UC68 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10); TT 03/2020 (Mẫu 01) | V.II |
| FR-V.II-02 | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-03 | Kiểm tra hồ sơ đề nghị | UC70 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-04 | Thông báo kết quả kiểm tra qua DVC | UC71 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-05 | Đánh giá hồ sơ theo tiêu chí | UC72 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-06 | Quản lý hồ sơ đề nghị thanh toán | UC73 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-07 | Gửi hồ sơ đề nghị thanh toán | UC74 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-08 | Nhận thông báo kết quả thanh toán | UC75 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-09 | Thẩm định hồ sơ đề nghị thanh toán | UC76 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-10 | Thông báo kết quả thẩm định | UC77 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-11 | Trình phê duyệt hồ sơ thanh toán | UC78 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-12 | Phê duyệt hồ sơ thanh toán | UC79 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-13 | Cập nhật kết quả xử lý hồ sơ | UC80 | PRD §4.5.2 | NĐ 55/2019 (Đ.8, 9, 10) | V.II |
| FR-V.II-14 | DN bổ sung hồ sơ chi trả | — `[GAP-V.II-01]` | PRD §4.5.2 | NĐ 55/2019 Điều 9 | V.II |
| FR-V.II-CROSS-01 | Auto từ chối hồ sơ quá hạn bổ sung | — `[GAP-V.II-05]` | PRD §4.5.2 | NĐ 55/2019 Điều 9 | V.II |

## A.1.7 Nhóm V.III — Quản lý DN (3 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-V.III-01 | Quản lý Doanh nghiệp được HTPL | UC81 | PRD §4.5.3 | NĐ 55/2019 (Đ.2) | V.III |
| FR-V.III-02 | Tìm kiếm DN | UC82 | PRD §4.5.3 | NĐ 55/2019 (Đ.2) | V.III |
| FR-V.III-NEW-01 | Import DN từ Excel | UC mới | PRD §4.5.3 (inferred) | — | V.III |

## A.1.8 Nhóm VI — Đánh giá Hiệu quả (9 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-VI-01 | Lập kế hoạch đánh giá | UC83 | PRD §4.6 | NĐ 55/2019 (Đ.11); TT 03/2020 | VI |
| FR-VI-02 | Thiết lập tiêu chí đánh giá | UC84 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-03 | Phân công người đánh giá | UC85 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-04 | Phê duyệt phân công | UC86 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-05 | Chọn vụ việc đánh giá | UC87 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-06 | Thực hiện đánh giá | UC88 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-07 | Lập báo cáo đánh giá | UC89 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-08 | Trình phê duyệt báo cáo | UC90 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |
| FR-VI-09 | Phê duyệt báo cáo đánh giá | UC91 | PRD §4.6 | NĐ 55/2019 (Đ.11) | VI |

## A.1.9 Nhóm VII — Thư viện Biểu mẫu (7 FRs) — HĐ TV tách sang Nhóm X.3

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-VII-01 | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | PRD §4.7 | TT 03/2020 (Phụ lục BM); TT 17/2025 | VII |
| FR-VII-02 | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | PRD §4.7 | TT 03/2020 | VII |
| FR-VII-03 | Công khai thư mục biểu mẫu lên Cổng | UC94 | PRD §4.7 | TT 03/2020 | VII |
| FR-VII-04 | Quản lý biểu mẫu, hợp đồng | UC95 | PRD §4.7 | TT 03/2020 (Phụ lục BM); TT 17/2025 | VII |
| FR-VII-05 | Tìm kiếm biểu mẫu, hợp đồng | UC96 | PRD §4.7 | TT 03/2020 | VII |
| FR-VII-06 | Import biểu mẫu hàng loạt | UC97 | PRD §4.7 | TT 03/2020 | VII |
| FR-VII-07 | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | PRD §4.7 | TT 03/2020; NĐ 47/2020 | VII |
| FR-VII-08 | Quản lý Hợp đồng Tư vấn | UC159 | PRD §4.7 | NĐ 55/2019 (Đ.5, 8) | VII |

## A.1.10 Nhóm VIII — Quản trị Hệ thống (21 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-VIII-01 | Quản lý danh mục lĩnh vực pháp lý | UC99 | PRD §4.8 | NĐ 13/2023 (BVDLCN); NĐ 85/2016 (ATTT) | VIII |
| FR-VIII-02 | Quản lý danh mục loại hình hỗ trợ | UC100 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-03 | Quản lý danh mục chương trình hỗ trợ | UC101 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-04 | Quản lý danh mục tình trạng vụ việc | UC102 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-05 | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-06 | Quản lý danh mục tổ chức tư vấn | UC104 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-07 | Quản lý danh mục loại doanh nghiệp | UC105 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-08 | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-09 | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-10 | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-11 | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-12 | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-13 | Quản lý loại tài khoản | UC111 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-14 | Quản lý vai trò | UC112 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-15 | Quản lý tài khoản người dùng | UC113 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-16 | Phân quyền truy cập dữ liệu | UC114 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-17 | Phân quyền chức năng | UC115 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-18 | Quản lý danh mục loại hình tiếp nhận | UC116 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-19 | Quản lý danh mục kênh tiếp nhận | UC117 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-20 | Quản lý đăng nhập | UC118 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |
| FR-VIII-21 | Quản lý đăng xuất | UC119 | PRD §4.8 | NĐ 13/2023; NĐ 85/2016 | VIII |

## A.1.11 Nhóm IX — Báo cáo Thống kê (23 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-IX-01 | BC Số lượng hỏi đáp/vướng mắc | UC124 | PRD §4.9 | TT 17/2025 (Mẫu 21a, 21b); NĐ 55/2019 (Đ.12) | IX |
| FR-IX-02 | BC Vụ việc đã tiếp nhận | UC125 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-03 | BC Vụ việc đang hỗ trợ | UC126 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-04 | BC Vụ việc đã hoàn thành | UC127 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-05 | BC Vụ việc theo thời gian | UC128 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-06 | BC Lớp đào tạo đang diễn ra | UC129 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-07 | BC Lớp đào tạo đã diễn ra | UC130 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-08 | BC Số lượng CG/TVV | UC131 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-09 | BC Đánh giá hiệu quả HTPL | UC132 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-10 | BC Chất lượng đào tạo | UC133 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-11 | BC Vụ việc theo đơn vị quản lý | UC134 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-12 | BC Vụ việc theo lĩnh vực | UC135 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-13 | BC Vụ việc theo loại hình DN | UC136 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-14 | BC Vụ việc theo thời gian chi tiết | UC137 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-15 | BC Chi phí chi trả hỗ trợ | UC138 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-16 | BC Chi phí theo đơn vị | UC139 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-17 | BC Chi phí theo lĩnh vực | UC140 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-18 | BC Chi phí theo loại hình DN | UC141 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-19 | BC Chi phí theo thời gian | UC142 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-20 | BC Số lượng CT hỗ trợ | UC143 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-21 | BC CT theo đơn vị | UC144 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-22 | BC CT theo lĩnh vực | UC145 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |
| FR-IX-23 | BC CT theo thời gian | UC146 | PRD §4.9 | TT 17/2025; NĐ 55/2019 (Đ.12) | IX |

## A.1.12 Nhóm X.1 — Quản lý Tư vấn pháp luật chuyên sâu (7 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-X.1-01 | Quản lý nội dung tư vấn với chuyên gia | UC147 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-02 | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-03 | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-04 | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-05 | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-06 | Quản lý tư liệu pháp lý của vụ việc | UC152 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |
| FR-X.1-07 | Tiếp nhận đánh giá chất lượng TV với CG | UC153 | PRD §4.10.1 | NĐ 55/2019 (Đ.4, 5) | X.1 |

## A.1.13 Nhóm X.2 — Tư vấn Nhanh (5 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-X.2-01 | Quản lý kho câu hỏi/tư vấn | UC154 | PRD §4.10.2 | NĐ 55/2019 (Đ.3) | X.2 |
| FR-X.2-02 | Quản lý tư vấn nhanh | UC155 | PRD §4.10.2 | NĐ 55/2019 (Đ.3) | X.2 |
| FR-X.2-03 | DN gửi câu hỏi | UC156 | PRD §4.10.2 | NĐ 55/2019 (Đ.3) | X.2 |
| FR-X.2-04 | DN tìm kiếm phản hồi | UC157 | PRD §4.10.2 | NĐ 55/2019 (Đ.3) | X.2 |
| FR-X.2-05 | DN đánh giá nội dung trả lời | UC158 | PRD §4.10.2 | NĐ 55/2019 (Đ.3) | X.2 |

## A.1.14 Nhóm X.3 — Hợp đồng Tư vấn (1 FR)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-X.3-01 | Quản lý HĐ tư vấn | UC159 | PRD §4.10.3 | NĐ 55/2019 (Đ.5, 8) | X.3 |

## A.1.15 Nhóm XI — Kế hoạch thực hiện CT HTPLDN (9 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-XI-01 | Quản lý chương trình HTPL | UC160 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14); TT 03/2020 | XI |
| FR-XI-02 | Tìm kiếm CT HTPL | UC161 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-03 | Trình phê duyệt CT | UC162 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-04 | Phê duyệt CT | UC163 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-05 | Công bố kế hoạch CT | UC164 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-06 | Lập BC kết quả thực hiện CT | UC166 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-07 | Trình phê duyệt BC | UC167 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-08 | Gửi kết quả lên TW | UC169 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |
| FR-XI-09 | TW tổng hợp BC | UC170 | PRD §4.11 | NĐ 55/2019 (Đ.13, 14) | XI |

## A.1.16 Nhóm XII — API Kết nối Chia sẻ Dữ liệu (16 FRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| FR-XII-01 | API Chia sẻ hỏi đáp | UC173 | PRD §4.12 | NĐ 47/2020 (CSDLQG); QĐ LGSP BTP | XII |
| FR-XII-02 | API Tìm kiếm hỏi đáp | UC174 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-03 | API Chia sẻ đào tạo | UC175 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-04 | API Tìm kiếm đào tạo | UC176 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-05 | API Chia sẻ CG/TVV | UC177 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-06 | API Tìm kiếm CG/TVV | UC178 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-07 | API Chia sẻ vụ việc | UC179 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-08 | API Tìm kiếm vụ việc | UC180 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-09 | API Chia sẻ đánh giá hiệu quả | UC181 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-10 | API Tìm kiếm đánh giá | UC182 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-11 | API Chia sẻ biểu mẫu | UC183 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-12 | API Tìm kiếm biểu mẫu | UC184 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-13 | API Chia sẻ tư vấn chuyên sâu | UC185 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-14 | API Tìm kiếm tư vấn chuyên sâu | UC186 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-15 | API Chia sẻ CT HTPLDN | UC187 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |
| FR-XII-16 | API Tìm kiếm CT HTPLDN | UC188 | PRD §4.12 | NĐ 47/2020; QĐ LGSP BTP | XII |

## A.1.17 Non-Functional Requirements (34 NFRs)

| Req ID | Tên | UC Ref | PRD Section | Nguồn pháp lý | Nhóm |
|--------|-----|--------|-------------|---------------|------|
| PERF-01 | Thời gian phản hồi trang CMS | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-02 | Thời gian phản hồi API outbound | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-03 | Concurrent users | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-04 | Thời gian tải danh sách | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-05 | Thời gian xuất báo cáo | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-06 | Thời gian upload file | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-07 | Thông lượng API | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| PERF-08 | Dung lượng lưu trữ | — | PRD §5.1 | TCVN ISO 25010:2015 | NFR |
| SEC-01 | Xác thực đa yếu tố | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023; Luật ATTTM 2015 | NFR |
| SEC-02 | Phân quyền RBAC | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023 | NFR |
| SEC-03 | Mã hóa dữ liệu | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023 | NFR |
| SEC-04 | Audit logging | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023 | NFR |
| SEC-05 | Session management | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023 | NFR |
| SEC-06 | Input validation | — | PRD §5.2 | NĐ 85/2016; NĐ 13/2023 | NFR |
| REL-01 | MTBF | — | PRD §5.3 | TCVN ISO 25010:2015 | NFR |
| REL-02 | MTTR | — | PRD §5.3 | TCVN ISO 25010:2015 | NFR |
| REL-03 | Data integrity | — | PRD §5.3 | TCVN ISO 25010:2015 | NFR |
| REL-04 | Error handling | — | PRD §5.3 | TCVN ISO 25010:2015 | NFR |
| REL-05 | Backup & Recovery | — | PRD §5.3 | TCVN ISO 25010:2015 | NFR |
| AVL-01 | Uptime | — | PRD §5.4 | TCVN ISO 25010:2015 | NFR |
| AVL-02 | Planned downtime | — | PRD §5.4 | TCVN ISO 25010:2015 | NFR |
| AVL-03 | Failover | — | PRD §5.4 | TCVN ISO 25010:2015 | NFR |
| AVL-04 | Load balancing | — | PRD §5.4 | TCVN ISO 25010:2015 | NFR |
| AVL-05 | Health monitoring | — | PRD §5.4 | TCVN ISO 25010:2015 | NFR |
| MNT-01 | Modular architecture | — | PRD §5.5 | TCVN ISO 25010:2015 | NFR |
| MNT-02 | Code quality | — | PRD §5.5 | TCVN ISO 25010:2015 | NFR |
| MNT-03 | Configuration externalization | — | PRD §5.5 | TCVN ISO 25010:2015 | NFR |
| MNT-04 | Database migration | — | PRD §5.5 | TCVN ISO 25010:2015 | NFR |
| MNT-05 | API versioning | — | PRD §5.5 | TCVN ISO 25010:2015 | NFR |
| PRT-01 | Browser compatibility | — | PRD §5.6 | TCVN ISO 25010:2015 | NFR |
| PRT-02 | Responsive design | — | PRD §5.6 | TCVN ISO 25010:2015 | NFR |
| PRT-03 | OS independence | — | PRD §5.6 | TCVN ISO 25010:2015 | NFR |
| PRT-04 | Database portability | — | PRD §5.6 | TCVN ISO 25010:2015 | NFR |
| PRT-05 | Container support | — | PRD §5.6 | TCVN ISO 25010:2015 | NFR |

---
