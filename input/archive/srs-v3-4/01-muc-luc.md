# Mục lục

- [1. Giới thiệu](#1-giới-thiệu)
- [2. Mô tả tổng quan](#2-mô-tả-tổng-quan)
- [3. Yêu cầu cụ thể](#3-yêu-cầu-cụ-thể)
  - [3.1 Yêu cầu giao diện](#31-yêu-cầu-giao-diện-bên-ngoài)
  - [3.2 Yêu cầu chức năng](#32-yêu-cầu-chức-năng)
  - [3.3 Yêu cầu hiệu năng](#33-yêu-cầu-hiệu-năng)
  - [3.4 Mô hình dữ liệu logic](#34-mô-hình-dữ-liệu-logic)
  - [3.5 Thuộc tính hệ thống](#35-thuộc-tính-hệ-thống)
  - [3.6 Yêu cầu khác](#36-yêu-cầu-khác)
- [4. Kiểm chứng](#4-kiểm-chứng-verification--isoiecieee-291482018)
- [Phụ lục A — Ma trận Truy vết](#phụ-lục-a--ma-trận-truy-vết-traceability-matrix)
- [Phụ lục B — Quy tắc Nghiệp vụ](#phụ-lục-b-danh-mục-quy-tắc-nghiệp-vụ-business-rules-catalog)
- [Phụ lục C — Máy trạng thái](#phụ-lục-c-sơ-đồ-máy-trạng-thái-state-machines)
- [Phụ lục D — Mẫu dữ liệu vào/ra](#phụ-lục-d--mẫu-dữ-liệu-vàora)
- [Chỉ mục](#chỉ-mục-index)

## Danh sách file FR group

| # | File | Nhóm | UC range | Mô tả |
|---|------|------|----------|-------|
| 01 | `srs-fr-01-dashboard.md` | I — Dashboard | UC 1-9 | Tổng quan, KPI, thống kê nhanh |
| 02 | `srs-fr-02-hoi-dap.md` | II — Quản lý hỏi đáp pháp luật | UC 10-19 | Click thẳng. 2 trang + 1 modal. Tabs trạng thái + batch PD | `[CR-04]` |
| 03 | `srs-fr-03-dao-tao.md` | III — Quản lý đào tạo, tập huấn | UC 20-38 | 4 sub-menu: Chương trình ĐT, Khóa học (7 tabs: TT, Lịch học, HV, Điểm danh, KQ KT, Bài giảng, Chứng nhận), Ngân hàng CH, Giảng viên |
| 04 | `srs-fr-04-chuyen-gia-tvv.md` | IV — Quản lý mạng lưới tư vấn viên | UC 39-50 | 2 sub-menu: Cá nhân tư vấn, Tổ chức tư vấn. Quản lý mạng lưới tư vấn viên (cá nhân và tổ chức). CR-CMT-6: Tổ chức tư vấn tách khỏi Danh mục → đối tượng quản lý riêng |
| 05 | `srs-fr-05-vu-viec.md` | V.I — Quản lý vụ việc hỗ trợ pháp lý | UC 51-67 | Click thẳng. Stepper SM-VUVIEC + accordion cards. Chi tiết có tab HĐ TV liên kết |
| 06 | `srs-fr-06-chi-tra.md` | V.II — Quản lý chi trả chi phí | UC 68-80 | Click thẳng. Lập, duyệt, thanh toán chi phí tư vấn (Mẫu 01 NĐ55) |
| 07 | `srs-fr-07-doanh-nghiep.md` | V.III — Quản lý doanh nghiệp được hỗ trợ | UC 81-82 | Click thẳng. Chi tiết có 3 tabs: TT cơ bản, Hồ sơ PL DN, Lịch sử hỗ trợ |
| 08 | `srs-fr-08-danh-gia.md` | VI — Theo dõi đánh giá hiệu quả hỗ trợ pháp lý | UC 83-91 | Click thẳng. Chi tiết có 4 tabs: KH đánh giá, Tiêu chí & Trọng số, Chấm điểm, Báo cáo ĐG | `[CR-10]` |
| 09 | `srs-fr-09-bieu-mau.md` | VII — Quản lý thư viện biểu mẫu | UC 92-98 | 3 sub-menu: Thư viện biểu mẫu, Quản lý biểu mẫu, Nhập hàng loạt. Click thẳng. Tree-view thư mục + biểu mẫu. HĐ TV (UC159) KHÔNG nằm trong menu — accessible từ VV/TVV |
| 10 | `srs-fr-10-quan-tri.md` | VIII — Quản trị hệ thống | UC 99-123 | 4 sub-menu: Danh mục dùng chung (13 loại — Tổ chức tư vấn tách riêng), Cấu hình hệ thống (thời hạn xử lý, phân công mặc định, mẫu phản hồi, quy trình), Tài khoản và phân quyền, Nhật ký hệ thống |
| 11 | `srs-fr-11-bao-cao.md` | IX — Báo cáo thống kê | UC 124-146 | 6 sub-menu: Báo cáo hỏi đáp pháp luật, Báo cáo vụ việc hỗ trợ pháp lý, Báo cáo đào tạo, tập huấn, Báo cáo chuyên gia, tư vấn viên và đánh giá, Báo cáo chi phí hỗ trợ, Báo cáo chương trình hỗ trợ pháp lý doanh nghiệp. Cùng mẫu chung, lọc sẵn theo nhóm | `[CR-09]` |
| 12 | `srs-fr-12-tv-chuyen-sau.md` | X.1 — Quản lý Tư vấn pháp luật chuyên sâu | UC 147-153 | Sub-menu trong "Quản lý tư vấn". Quản lý nội dung tư vấn chuyên sâu | `[CR-05]` |
| 13 | `srs-fr-13-tv-nhanh.md` | X.2 — Tư vấn nhanh | UC 154-158 | Sub-menu trong "Quản lý tư vấn". Tư vấn nhanh online |
| 14 | `srs-fr-14-hop-dong-tv.md` | X.3 — Hợp đồng tư vấn | UC 159-159e | Quản lý HĐ tư vấn — KHÔNG có menu riêng (SRS v2.1). Truy cập qua tab VV/TVV |
| 15 | `srs-fr-15-ct-htpldn.md` | XI — Quản lý kế hoạch thực hiện chương trình hỗ trợ pháp lý doanh nghiệp | UC 160-170 | Click thẳng. Chi tiết CT có 4 tabs: TT chương trình, Đợt báo cáo, File đính kèm, Nhật ký. Quản lý kế hoạch thực hiện CT HTPLDN | `[CR-08]` |
| 16 | `srs-fr-16-api.md` | XII — API chia sẻ dữ liệu | UC 171-188 | API outbound — KHÔNG có menu CMS. Giám sát qua AUDIT_LOG + Dashboard |

---
