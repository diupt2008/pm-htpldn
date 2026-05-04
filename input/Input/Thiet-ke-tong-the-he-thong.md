# TÀI LIỆU ĐẶC TẢ KIẾN TRÚC TỔNG THỂ HỆ THỐNG


## PHẦN MỀM HỖ TRỢ PHÁP LÝ DOANH NGHIỆP


Thuộc dự án: Cổng Pháp luật Quốc gia


| Thông tin | Chi tiết |
|---|---|
| Mã dự án | CPL-HTPLDN |
| Mã tài liệu | HLD |
| Phiên bản tài liệu | 1.0 |
| Ngày tạo | 25/03/2025 |
| Đơn vị chủ quản | Cục Công nghệ Thông tin - Bộ Tư Pháp |


## BẢNG GHI NHẬN THAY ĐỔI TÀI LIỆU


| Ngày thay đổi | Vị trí thay đổi | Lý do | Phiên bản cũ | Mô tả thay đổi | Phiên bản mới |
|---|---|---|---|---|---|
| 25/03/2025 | - | Tạo mới | - | Tạo mới tài liệu | 1.0 |


## MỤC LỤC

- PHẦN 1 - TỔNG QUAN
- 1. Mục đích
- 2. Phạm vi
- 3. Tài liệu liên quan
- 4. Thuật ngữ và các từ viết tắt
- PHẦN 2 - MÔ HÌNH TỔNG THỂ HỆ THỐNG
- 5. Mô hình tổng thể của hệ thống
- 5.1. Lớp người dùng
- 5.2. Lớp kênh giao tiếp
- 5.3. Lớp ứng dụng
- 5.4. Lớp dữ liệu
- 5.5. Lớp trục tích hợp bên ngoài
- 5.6. Lớp hạ tầng công nghệ thông tin
- 6. Mô hình tổng thể phần mềm
- 6.1. Kiến trúc ứng dụng
- 6.2. Kiến trúc module nghiệp vụ
- 7. Mô hình kiến trúc lưu trữ dữ liệu tổng thể
- 7.1. Giải pháp sao lưu và phục hồi hệ thống
- 7.1.1. Nhu cầu sao lưu dữ liệu
- 7.1.2. Giải pháp về thời gian và phương thức sao lưu
- 7.1.3. Giải pháp sao lưu cơ sở dữ liệu
- 7.1.4. Giải pháp sao lưu ứng dụng
- 7.1.5. Giải pháp lưu trữ các phiên bản sao lưu
- 7.1.6. Giải pháp phục hồi hệ thống
- 7.1.7. Giải pháp phục hồi cơ sở dữ liệu
- 7.1.8. Giải pháp phục hồi ứng dụng
- PHẦN 3 - GIẢI PHÁP TÍCH HỢP
- 8. Giải pháp tích hợp
- 8.1. Tích hợp nội bộ Bộ Tư Pháp
- 8.2. Tích hợp ngoài ngành
- 8.3. Danh sách API tích hợp
- PHẦN 4 - HIỆU NĂNG
- 9. Hiệu năng
- 9.1. Kiến trúc hiệu năng
- 9.2. Cơ sở dữ liệu
- 9.3. Kiểm thử hiệu năng
- PHẦN 5 - THIẾT KẾ MÔ HÌNH VẬT LÝ
- 10. Thiết kế mô hình vật lý
- 10.1. Mô hình triển khai vật lý
- 10.2. Phân vùng mạng
- PHẦN 6 - GIẢI PHÁP BẢO MẬT
- 11. Giải pháp bảo mật
- 11.1. Kiến trúc bảo mật
- 11.2. Phân quyền chức năng
- 11.3. Mã hóa dữ liệu
- 11.4. Quản lý phiên và xác thực API
- 11.5. Rate Limiting API
- PHẦN 7 - GIẢI PHÁP TRIỂN KHAI
- 12. Giải pháp triển khai
- 12.1. Tổng quan giải pháp triển khai
- 12.2. Đề xuất tài nguyên hạ tầng
- 12.3. Dự toán tăng trưởng dữ liệu


---

# PHẦN 1 - TỔNG QUAN


## 1. Mục đích


Tài liệu này cung cấp bức tranh tổng thể về hệ thống Phần mềm Hỗ trợ Pháp lý Doanh nghiệp - một hệ thống phần mềm hoạt động độc lập nằm trong tổng thể dự án Cổng Pháp luật Quốc gia của Bộ Tư Pháp.


Nội dung miêu tả bao gồm:

- Kiến trúc tổng thể hệ thống (mô hình 5 lớp)
- Kiến trúc ứng dụng và module nghiệp vụ
- Kiến trúc dữ liệu và lưu trữ
- Kiến trúc tích hợp với các hệ thống nội bộ và bên ngoài
- Kiến trúc vật lý và mô hình triển khai
- Giải pháp bảo mật và an toàn thông tin
- Đề xuất tài nguyên hạ tầng và kế hoạch tăng trưởng

Tài liệu được sử dụng làm đầu vào cho các giai đoạn thiết kế chi tiết, lập trình, kiểm thử và triển khai hệ thống.


## 2. Phạm vi


Phạm vi tài liệu bao phủ thiết kế hệ thống ở mức cao nhằm xây dựng Phần mềm Hỗ trợ Pháp lý Doanh nghiệp với các đặc điểm:

- Vai trò: Phần mềm hoạt động độc lập nằm trong tổng thể dự án Cổng Pháp luật, đóng vai trò hệ thống quản trị nội dung (CMS) chứa và xử lý toàn bộ nghiệp vụ hỗ trợ pháp lý doanh nghiệp. Phần mềm không có giao diện hiển thị cho người dân trên mạng; thay vào đó quản trị dữ liệu và chia sẻ API cho gói thầu khác hiển thị lên "Chuyên trang hỗ trợ pháp lý doanh nghiệp" trên Cổng PLQG.
- Phạm vi hoạt động: Xử lý nghiệp vụ nội bộ, cung cấp giao diện web cho cán bộ/doanh nghiệp/tư vấn viên, và nhả API chia sẻ dữ liệu cho Cổng Pháp luật Quốc gia
- Đối tượng sử dụng trực tiếp (đăng nhập và thao tác trên phần mềm): Cán bộ nghiệp vụ TW/BN/ĐP, Cán bộ phê duyệt TW/BN/ĐP, Doanh nghiệp, Người hỗ trợ pháp lý (tư vấn viên), Quản trị hệ thống
- Đối tượng tương tác gián tiếp: Người dân, công chúng — xem thông tin qua Chuyên trang trên Cổng PLQG (gói thầu khác)
- Quy mô: 800.000 người dùng tiềm năng (DNNVV + tổ chức TVV), tỷ lệ truy cập 1%, CCU = 500 người dùng đồng thời (theo SRS v1.4)

## 3. Tài liệu liên quan


| STT | Tên tài liệu | Nguồn |
|---|---|---|
| 1 | Thiết kế cơ sở Cổng pháp luật quốc gia - Phụ lục 03 | Cục CNTT - Bộ Tư Pháp |
| 2 | Thiết kế tổng quan Hỗ trợ Pháp lý Doanh nghiệp | Cục CNTT - Bộ Tư Pháp |
| 3 | Danh sách Usecase | Đội dự án |
| 4 | Danh sách Transaction | Đội dự án |
| 5 | Tài liệu đặc tả yêu cầu phần mềm (SRS) | Đội dự án |
| 6 | Nghị quyết 66/NQ-CP về hỗ trợ pháp lý cho doanh nghiệp | Chính phủ |


## 4. Thuật ngữ và các từ viết tắt


| STT | Thuật ngữ / Viết tắt | Mô tả |
|---|---|---|
| 1 | BTP | Bộ Tư Pháp |
| 2 | HTPLDN | Hỗ trợ Pháp lý Doanh nghiệp |
| 3 | PLQG | Pháp luật Quốc gia |
| 4 | CMS | Content Management System - Hệ thống quản trị nội dung |
| 5 | LGSP | Local Government Service Platform - Nền tảng tích hợp chia sẻ dữ liệu cấp Bộ |
| 6 | NDXP | National Data Exchange Platform - Nền tảng tích hợp chia sẻ dữ liệu Quốc gia |
| 7 | VNeID | Vietnam Electronic Identification - Hệ thống định danh và xác thực điện tử |
| 8 | DC | Data Center - Trung tâm dữ liệu |
| 9 | DRC | Disaster Recovery Center - Trung tâm dự phòng thảm họa |
| 10 | TSLCD | Truyền số liệu chuyên dùng |
| 11 | API | Application Programming Interface |
| 12 | RBAC | Role-Based Access Control - Kiểm soát truy cập dựa trên vai trò |
| 13 | VPD | Virtual Private Database - Cơ sở dữ liệu riêng ảo |
| 14 | TDE | Transparent Data Encryption - Mã hóa dữ liệu trong suốt |
| 15 | JWT | JSON Web Token |
| 16 | mTLS | Mutual TLS - Xác thực TLS hai chiều |
| 17 | TVV | Tư vấn viên |
| 18 | DN | Doanh nghiệp |
| 19 | QTHT | Quản trị hệ thống |
| 20 | CB NV | Cán bộ nghiệp vụ |
| 21 | CB PD | Cán bộ phê duyệt |
| 22 | NHT | Người hỗ trợ |



---

# PHẦN 2 - MÔ HÌNH TỔNG THỂ HỆ THỐNG


## 5. Mô hình tổng thể của hệ thống


Mô hình tổng thể của hệ thống Phần mềm Hỗ trợ Pháp lý Doanh nghiệp là mô hình mức cao nhất, thể hiện đầy đủ kiến trúc 5 lớp: Người dùng, Kênh giao tiếp, Ứng dụng (Nghiệp vụ), Dữ liệu, và Hạ tầng CNTT cùng với các hệ thống bên ngoài có tương tác, tích hợp, kết nối và chia sẻ thông tin.


Hệ thống tuân thủ định hướng, chỉ đạo của Nghị quyết 66 về chính sách quản trị, điều hành và an toàn thông tin.


*Hình 1: Mô hình tổng thể hệ thống Phần mềm Hỗ trợ Pháp lý Doanh nghiệp*

![Hình 1: Mô hình tổng thể hệ thống](images/diagram-01-overview.png)


Sơ đồ thể hiện kiến trúc 6 lớp của hệ thống CMS HTPLDN (trái) và kết nối với các hệ thống nội bộ BTP / ngoài ngành thông qua LGSP/NDXP (phải).


*Hình 2: Mô hình kết nối với hệ thống nội bộ và ngoài ngành*

![Hình 2: Mô hình kết nối](images/diagram-02-integration.png)


### 5.1. Lớp người dùng


Hệ thống phục vụ 5 nhóm đối tượng người dùng chính:


| STT | Tên tác nhân | Viết tắt | Mô tả | Phân loại |
|---|---|---|---|---|
| 1 | Quản trị hệ thống | QTHT | Thiết lập, cấu hình, quản lý người dùng, phân quyền kho dữ liệu | Phức tạp |
| 2 | Cán bộ nghiệp vụ TW/BN/ĐP | CB NV | Thực hiện các nghiệp vụ quản lý hỗ trợ pháp lý doanh nghiệp | Phức tạp |
| 3 | Cán bộ phê duyệt TW/BN/ĐP | CB PD | Phê duyệt các yêu cầu liên quan đến hỗ trợ pháp lý doanh nghiệp | Phức tạp |
| 4 | Doanh nghiệp | DN | Khai thác thông tin, đề xuất hỗ trợ pháp lý | Phức tạp |
| 5 | Người hỗ trợ (Tư vấn viên) | NHT | Tư vấn, hỗ trợ pháp lý cho doanh nghiệp | Phức tạp |
| 6 | Cổng Pháp luật Quốc gia | Cổng PLQG | Kết nối tương tác khai thác, đồng bộ dữ liệu | Đơn giản |
| 7 | HT giải quyết TTHC BTP | HT TTHC | Tiếp nhận hồ sơ xử lý TTHC trực tuyến | Đơn giản |
| 8 | Hệ thống khác | HT khác | Cung cấp và tương tác dữ liệu với hệ thống nghiệp vụ | Đơn giản |


### 5.2. Lớp kênh giao tiếp


Hệ thống CMS nghiệp vụ HTPLDN được truy cập thông qua trình duyệt web trên giao thức HTTPS. Lớp kênh giao tiếp đảm bảo:

- Hiển thị giao diện người dùng (UI) để thực hiện tương tác nghiệp vụ
- Xử lý các yêu cầu: xem, truy vấn, lấy dữ liệu, thao tác CRUD
- Bảo mật và xác thực: Kiểm soát truy cập, ngăn chặn truy cập trái phép
- Hỗ trợ trình duyệt: Chrome, Edge (phiên bản mới nhất)

### 5.3. Lớp ứng dụng


Lớp ứng dụng bao gồm 16 nhóm chức năng chính (theo Thiết kế tổng quan):


| STT | Nhóm chức năng | Chức năng chính |
|---|---|---|
| 1 | Quản trị hệ thống | Quản lý danh mục; quản lý tài khoản và phân quyền; cấu hình hệ thống; nhật ký truy cập |
| 2 | Dashboard trang chủ quản trị | Thống kê vụ việc, đào tạo, tư vấn viên, chương trình hỗ trợ, tư vấn pháp lý |
| 3 | Quản lý hỏi đáp, vướng mắc pháp lý | Tiếp nhận, tổng hợp, xử lý hỏi đáp; quản lý câu hỏi đã xử lý |
| 4 | Quản lý chương trình đào tạo, tập huấn | Đề xuất, lập kế hoạch, công bố khóa đào tạo; ghi nhận kết quả; cấp chứng chỉ |
| 5 | Quản lý chuyên gia, tư vấn viên pháp lý | Quản lý đăng ký tư vấn viên; tra cứu tư vấn viên cho doanh nghiệp |
| 6 | Quản lý vụ việc trợ giúp pháp lý | Tiếp nhận vụ việc; quản lý hồ sơ yêu cầu; kiểm tra hồ sơ; quản lý hồ sơ vụ việc |
| 7 | Quản lý chi trả chi phí tư vấn pháp luật | Tiếp nhận hồ sơ chi trả; thẩm định; phê duyệt; theo dõi trạng thái |
| 8 | Quản lý doanh nghiệp được hỗ trợ pháp lý | Quản lý hồ sơ doanh nghiệp đủ điều kiện; lịch sử hỗ trợ |
| 9 | Quản lý kiểm tra, đánh giá hiệu quả | Thiết lập tiêu chí; phân công đánh giá; cập nhật kết quả; lập báo cáo |
| 10 | Quản lý thư viện biểu mẫu, hợp đồng | Quản lý thư mục biểu mẫu; quản lý danh sách biểu mẫu |
| 11 | Báo cáo thống kê | Báo cáo nghiệp vụ theo các chỉ tiêu; báo cáo theo biểu mẫu chuẩn |
| 12 | Quản lý tư vấn chuyên sâu với chuyên gia | Quản lý nội dung tư vấn chuyên sâu; lên lịch; đánh giá chất lượng |
| 13 | Quản lý tư vấn nhanh | Kho kiến thức FAQ; tìm kiếm theo từ khóa |
| 14 | Quản lý hợp đồng tư vấn | CRUD hợp đồng tư vấn viên |
| 15 | Quản lý kế hoạch CT HTPLDN | Xây dựng, công bố, theo dõi, báo cáo chương trình hỗ trợ pháp lý |
| 16 | API kết nối - chia sẻ dữ liệu | 18 API outbound chia sẻ đến hệ thống khác (9 cặp chia sẻ + tìm kiếm) |


### 5.4. Lớp dữ liệu


Lớp dữ liệu lưu trữ toàn bộ thông tin nghiệp vụ trên nền tảng Oracle Database 21C:


| STT | Vùng dữ liệu | Mô tả |
|---|---|---|
| 1 | DL Chương trình HTPLDN | Dữ liệu chương trình, kế hoạch hỗ trợ pháp lý doanh nghiệp |
| 2 | DL Đào tạo bồi dưỡng kiến thức | Dữ liệu khóa đào tạo, bài giảng, kết quả đào tạo, chứng chỉ |
| 3 | DL Vụ việc | Dữ liệu hồ sơ yêu cầu hỗ trợ, vụ việc pháp lý, chi trả |
| 4 | DL Mạng lưới TVV | Hồ sơ tư vấn viên, lịch sử tư vấn, năng lực chuyên môn |
| 5 | DL Tư vấn pháp lý | Phiên tư vấn, hỏi đáp, nội dung tư vấn chuyên sâu |
| 6 | DL Kiểm tra, đánh giá hiệu quả | Tiêu chí đánh giá, kết quả đánh giá, báo cáo hiệu quả |
| 7 | DL Báo cáo thống kê | Dữ liệu tổng hợp phục vụ báo cáo |
| 8 | DL Quản trị hệ thống | Tài khoản, phân quyền, cấu hình, nhật ký hoạt động |
| 9 | File Server | Lưu trữ file đính kèm, hồ sơ scan, tài liệu (AES-256 mã hóa) |


### 5.5. Lớp trục tích hợp bên ngoài


Hệ thống tích hợp, chia sẻ thông tin với các hệ thống bên ngoài thông qua Trục chia sẻ dữ liệu LGSP của Bộ Tư Pháp và Nền tảng tích hợp dữ liệu Quốc gia (NDXP):


| STT | Hệ thống | Mô tả |
|---|---|---|
| 1 | HT giải quyết TTHC của BTP | Tích hợp API tiếp nhận hồ sơ, gửi thông báo kết quả xử lý TTHC qua LGSP |
| 2 | Cổng Pháp luật Quốc gia | Chia sẻ dữ liệu nghiệp vụ (tư vấn, hỏi đáp, TVV, đào tạo...) qua 18 APIs |
| 3 | CSDL Quốc gia về VBPL | Tra cứu văn bản pháp luật liên quan qua LGSP |
| 4 | QL Danh mục dùng chung BTP | Đồng bộ danh mục dùng chung qua LGSP |
| 5 | VNeID (qua NDXP) | Định danh và xác thực điện tử (OAuth2/OIDC) |


Các hệ thống nội bộ BTP được tích hợp thông qua trục LGSP. Đối với các hệ thống ngoài ngành, tích hợp thông qua nền tảng NDXP. Chi tiết giải pháp tích hợp được trình bày tại Mục 8 - Giải pháp tích hợp.


### 5.6. Lớp hạ tầng công nghệ thông tin


Hệ thống được triển khai tập trung trên hạ tầng kỹ thuật của Trung tâm dữ liệu Bộ Tư Pháp (DC BTP), bao gồm:


| Thành phần | Mô tả |
|---|---|
| Trung tâm dữ liệu chính (DC) | Lưu trữ, xử lý, quản lý dữ liệu chính |
| Trung tâm dự phòng thảm họa (DRC) | Hạ tầng vật lý dự phòng đảm bảo tính dự phòng |
| Mạng LAN/WAN | Hạ tầng mạng nội bộ các đơn vị |
| Mạng truyền số liệu chuyên dùng (TSLCD) | Mạng chuyên dùng của Chính phủ |
| Hạ tầng Internet | Kết nối Internet phục vụ truy cập |
| Hạ tầng máy chủ | Tài nguyên tính toán cho ứng dụng và dịch vụ |
| Hạ tầng lưu trữ | Hệ thống lưu trữ dữ liệu tập trung |
| Hạ tầng sao lưu | Hệ thống sao lưu và phục hồi dữ liệu |
| Dịch vụ Cloud (IaaS/PaaS) | Tài nguyên đám mây: tính toán, lưu trữ, kết nối, DBMS |


*Hình 3: Mô hình 5 lớp kiến trúc hệ thống*

![Hình 3: Mô hình 5 lớp kiến trúc](images/diagram-03-layers.png)


## 6. Mô hình tổng thể phần mềm


### 6.1. Kiến trúc ứng dụng


Hệ thống được xây dựng trên kiến trúc hướng dịch vụ (SOA) theo mô hình đa lớp Frontend → Backend (APIs) → Logic → Database, với các thành phần công nghệ:


Ghi chú: Nền tảng công nghệ ban đầu (theo mô tả dự án) là PostgreSQL, React/Next, Node.js/Java. Chủ đầu tư đã chỉ định thay đổi CSDL từ PostgreSQL sang Oracle Database 21C (xác nhận trong SRS v1.3).


| Thành phần | Công nghệ | Phiên bản |
|---|---|---|
| Frontend | Next.js + Ant Design + ProComponents | 15 / 5 / 6 |
| Backend | NestJS + Node.js LTS | 10 / LTS |
| Database | Oracle Database (thay thế PostgreSQL theo CĐT) | 21C |
| Cache | Redis | 7.x |
| Message Queue | BullMQ | 5.x |
| Authentication | Session + JWT RS256 + OAuth2/OIDC (VNeID) | - |
| File Storage | Local File Server + AES-256 | - |
| Containerization | Docker Compose | 3.8 |
| API Documentation | Swagger/OpenAPI | 3.0 |


*Hình 4: Kiến trúc ứng dụng và công nghệ*

![Hình 4: Kiến trúc ứng dụng và công nghệ](images/diagram-04-tech.png)


### 6.2. Kiến trúc module nghiệp vụ


Hệ thống được tổ chức theo mô hình 3 polyrepos:


| Repository | Mục đích | Công nghệ |
|---|---|---|
| pm-htpldn-api | Backend API | NestJS 10, Clean Architecture, DDD |
| pm-htpldn-web | Frontend Web | Next.js 15, Feature-Sliced Design |
| pm-htpldn-contracts | Shared Types | TypeScript Interfaces, OpenAPI spec |


Cấu trúc Backend (16 NestJS Modules):


```
src/modules/
├── dashboard/          # Tổng quan thống kê
├── hoi-dap/            # Hỏi đáp pháp lý
├── dao-tao/            # Đào tạo bồi dưỡng
├── tvv/                # Mạng lưới tư vấn viên
├── vu-viec/            # Vụ việc pháp lý
├── chi-tra/            # Chi trả chi phí
├── doanh-nghiep/       # Quản lý doanh nghiệp
├── danh-gia/           # Đánh giá hiệu quả
├── bieu-mau/           # Biểu mẫu, hợp đồng
├── quan-tri/           # Quản trị hệ thống
├── bao-cao/            # Báo cáo thống kê
├── tu-van-chuyen-sau/  # Tư vấn chuyên sâu
├── hop-dong-tu-van/    # Hợp đồng tư vấn
├── ct-htpldn/          # Chương trình HTPLDN
├── api-outbound/       # API chia sẻ ra ngoài
└── shared/             # Module dùng chung
```


Cấu trúc Frontend (13 Feature Modules):


```
src/app/
├── (auth)/             # Đăng nhập
└── (cms)/              # CMS nghiệp vụ
    ├── dashboard/
    ├── hoi-dap/
    ├── dao-tao/
    ├── tvv/
    ├── vu-viec/
    ├── chi-tra/
    ├── doanh-nghiep/
    ├── danh-gia/
    ├── bieu-mau/
    ├── tu-van/
    ├── ct-htpldn/
    ├── bao-cao/
    └── quan-tri/
```


*Hình 5: Sơ đồ module nghiệp vụ và luồng dữ liệu*

![Hình 5: Sơ đồ module nghiệp vụ](images/diagram-05-modules.png)


## 7. Mô hình kiến trúc lưu trữ dữ liệu tổng thể


Hệ thống sử dụng Oracle Database 21C làm cơ sở dữ liệu chính với các kỹ thuật bảo mật và tối ưu:


| Kỹ thuật | Mô tả |
|---|---|
| Oracle VPD | Virtual Private Database - phân tách dữ liệu đa cấp (TW/BN/ĐP) |
| Oracle TDE | Transparent Data Encryption - mã hóa dữ liệu trong suốt |
| Oracle Text | CONTEXT index - tìm kiếm toàn văn tiếng Việt |
| Partitioning | Phân vùng dữ liệu theo thời gian và đơn vị |
| Connection Pool | oracledb thin mode - quản lý kết nối hiệu quả |


Mô hình tổ chức dữ liệu:


![Mô hình tổ chức dữ liệu](images/diagram-06-data-zones.png)


### 7.1. Giải pháp sao lưu và phục hồi hệ thống


#### 7.1.1. Nhu cầu sao lưu dữ liệu


Để đảm bảo hoạt động ổn định và liên tục, bảo vệ hệ thống khỏi các rủi ro liên quan đến sự cố, phần mềm và các mối đe dọa bảo mật, hệ thống có các yêu cầu sao lưu:

- Sao lưu CSDL: Oracle Database 21C (toàn bộ schema nghiệp vụ)
- Sao lưu ứng dụng: Thư mục mã nguồn Frontend, Backend
- Sao lưu file: File Server (hồ sơ, tài liệu đính kèm)
- Sao lưu cấu hình: Docker Compose, environment variables, cấu hình Redis

#### 7.1.2. Giải pháp về thời gian và phương thức sao lưu


Để đảm bảo không làm ảnh hưởng đến hoạt động nghiệp vụ và đáp ứng RPO ≤ 6 giờ, giải pháp sao lưu dữ liệu được thiết kế như sau:


| Đối tượng | Sao lưu Incremental | Sao lưu Full |
|---|---|---|
| Oracle Database | Mỗi 6 giờ (04 lần/ngày) | Hàng ngày lúc 02:00 |
| File Server | Mỗi 6 giờ (04 lần/ngày) | Hàng ngày lúc 02:00 |
| Ứng dụng | - | Ngày 01 hàng tháng: 19h → 23h |


#### 7.1.3. Giải pháp sao lưu cơ sở dữ liệu


Sử dụng Oracle RMAN (Recovery Manager) để sao lưu và khôi phục cơ sở dữ liệu Oracle Database 21C. Sử dụng Oracle RMAN Agent để lập lịch sao lưu tự động: Full backup hàng ngày lúc 02:00, Incremental backup mỗi 6 giờ.


#### 7.1.4. Giải pháp sao lưu ứng dụng

- Sao lưu toàn bộ ứng dụng 1 lần/tháng (ngày 01 hàng tháng, 19h → 23h)
- Sao lưu Docker images và configurations
- File Server: Sao lưu bằng rsync hoặc công cụ backup tương đương

#### 7.1.5. Giải pháp lưu trữ các phiên bản sao lưu


Các bản dữ liệu sao lưu phải được lưu trữ trên các thiết bị lưu trữ dữ liệu sao lưu theo quy định:

- Đối với sao lưu CSDL: Giữ tối thiểu 2 bản sao lưu Full gần nhất + các bản Incremental tương ứng
- Đối với sao lưu Ứng dụng: Giữ tối thiểu 2 bản sao lưu gần nhất

#### 7.1.6. Giải pháp phục hồi hệ thống


Quy trình phục hồi hệ thống khi xảy ra sự cố được thực hiện theo thứ tự: Phục hồi cơ sở dữ liệu → Phục hồi ứng dụng → Kiểm tra và xác nhận hoạt động bình thường.


#### 7.1.7. Giải pháp phục hồi cơ sở dữ liệu


Phục hồi bản backup Full gần nhất, sau đó phục hồi dữ liệu các bản Incremental lần lượt các ngày kể từ khi backup Full đến thời điểm sự cố để khôi phục dữ liệu.


#### 7.1.8. Giải pháp phục hồi ứng dụng


Sau khi phục hồi cơ sở dữ liệu, phục hồi ứng dụng theo quy trình deploy hệ thống: Deploy lại từ Docker images đã sao lưu, khôi phục cấu hình environment variables, Docker Compose và Redis.



---

# PHẦN 3 - GIẢI PHÁP TÍCH HỢP


## 8. Giải pháp tích hợp


### 8.1. Tích hợp nội bộ Bộ Tư Pháp


Hệ thống tích hợp với các hệ thống nội bộ BTP thông qua Trục chia sẻ dữ liệu LGSP của Bộ Tư Pháp:


| STT | Hệ thống | Phương thức | Mô tả |
|---|---|---|---|
| 1 | HT giải quyết TTHC BTP | REST/JSON qua LGSP | Tiếp nhận hồ sơ, gửi thông báo xử lý TTHC |
| 2 | Cổng Pháp luật Quốc gia | REST APIs (18 endpoints) | Chia sẻ nội dung tư vấn, hỏi đáp, TVV, đào tạo |
| 3 | CSDL Quốc gia về VBPL | REST/JSON qua LGSP | Tra cứu văn bản pháp luật liên quan |
| 4 | QL Danh mục dùng chung BTP | REST/JSON qua LGSP | Đồng bộ danh mục dùng chung |


### 8.2. Tích hợp ngoài ngành


| STT | Hệ thống | Phương thức | Mô tả |
|---|---|---|---|
| 1 | VNeID | OAuth2/OIDC qua NDXP | Đăng ký tài khoản, đăng nhập, đăng xuất |
| 2 | Email SMTP | SMTP/TLS | Gửi thông báo, kết quả xử lý cho người dùng |
| 3 | Hệ thống khác | REST/JSON qua NDXP | Chia sẻ dữ liệu thống kê, báo cáo |


### 8.3. Danh sách API tích hợp


API chia sẻ đến hệ thống khác (18 API):


| STT | Tên API | Hướng | Mô tả |
|---|---|---|---|
| 1 | API tiếp nhận hồ sơ qua DVC | Nhận từ HT TTHC | Tiếp nhận hồ sơ yêu cầu hỗ trợ pháp lý qua dịch vụ công |
| 2 | API tiếp nhận hồ sơ đề nghị hỗ trợ chi phí | Nhận từ HT TTHC | Tiếp nhận hồ sơ đề nghị hỗ trợ chi phí tư vấn pháp luật |
| 3 | API gửi thông báo qua HT TTHC | Gửi đến HT TTHC | Gửi thông báo kết quả xử lý qua HT TTHC BTP |
| 4 | API kết nối VNeID | Gửi/Nhận | Đăng ký, đăng nhập, đăng xuất qua VNeID |
| 5 | API tiếp nhận nội dung tư vấn chuyên gia | Nhận từ Cổng PLQG | Tiếp nhận nội dung tư vấn với chuyên gia |
| 6 | API tiếp nhận hồ sơ pháp lý DN | Nhận từ Cổng PLQG | Tiếp nhận hồ sơ pháp lý doanh nghiệp |
| 7 | API tiếp nhận đánh giá tư vấn chuyên gia | Nhận từ Cổng PLQG | Tiếp nhận đánh giá chất lượng tư vấn chuyên gia |
| 8 | API tiếp nhận đánh giá tư vấn nhanh | Nhận từ Cổng PLQG | Tiếp nhận đánh giá chất lượng tư vấn nhanh |
| 9-18 | API chia sẻ dữ liệu nghiệp vụ | Gửi đến Cổng PLQG | Chia sẻ danh sách TVV, vụ việc, chương trình, đào tạo, hỏi đáp, biểu mẫu... |


Chi tiết giao thức tích hợp:


| Kết nối | Giao thức | Xác thực | Phương thức |
|---|---|---|---|
| Frontend ↔ Backend | REST JSON (HTTPS) | Session Cookie (HttpOnly) | HTTP |
| Backend ↔ Oracle DB | oracledb (TCP 1521) | Connection Pool | TCP |
| Backend ↔ Redis | ioredis (TCP 6379) | Password | TCP |
| Backend ↔ LGSP | REST JSON | mTLS + JWT | HTTPS |
| Backend ↔ VNeID | OAuth2/OIDC (via LGSP) | Authorization Code | OAuth2 |
| LGSP → Backend | REST JSON (mTLS) | Client Certificate | HTTPS |
| Backend → Email SMTP | SMTP/TLS | Username/Password | SMTP |


*Hình 6: Sơ đồ tích hợp tổng thể*

![Hình 6: Sơ đồ tích hợp tổng thể](images/diagram-07-integration.png)



---

# PHẦN 4 - HIỆU NĂNG


## 9. Hiệu năng


### 9.1. Kiến trúc hiệu năng


| Giải pháp | Công nghệ | Mô tả |
|---|---|---|
| Caching | Redis 7.x | Giảm tải truy vấn trực tiếp vào CSDL; cache danh mục, session |
| Load Balancing | Nginx / HAProxy | Phân bổ yêu cầu giữa các server Web/App |
| Connection Pooling | oracledb thin mode | Hạn chế tạo kết nối mới liên tục |
| API Optimization | Pagination + Filtering | Phân trang kết quả, lọc dữ liệu phía server |


### 9.2. Cơ sở dữ liệu


| Giải pháp | Mô tả |
|---|---|
| Index Optimization | Sử dụng chỉ mục (Index) cho các trường truy vấn thường xuyên |
| Oracle Text | CONTEXT index cho tìm kiếm toàn văn tiếng Việt (~10K bản ghi/năm) |
| Partitioning | Phân vùng dữ liệu theo thời gian, đơn vị để tăng hiệu suất truy vấn |
| Query Analysis | Sử dụng EXPLAIN PLAN để phân tích và tối ưu truy vấn |


### 9.3. Kiểm thử hiệu năng


| Loại kiểm thử | Mô tả | Công cụ |
|---|---|---|
| Load Testing | Kiểm tra khả năng chịu tải với 500 CCU | JMeter, k6 |
| Stress Testing | Kiểm tra hệ thống khi vượt quá 500 CCU | Gatling |
| Endurance Testing | Kiểm tra hoạt động ổn định trong thời gian dài (72h+) | k6 |
| Scalability Testing | Đánh giá khả năng mở rộng khi tăng tài nguyên | k6 |


Chỉ tiêu hiệu năng yêu cầu:


| Chỉ tiêu | Giá trị mục tiêu |
|---|---|
| Thời gian phản hồi trang CMS (P95) | ≤ 3 giây |
| Thời gian phản hồi API outbound (P95) | ≤ 5 giây |
| Thời gian tải danh sách (≤1.000 bản ghi) | ≤ 2 giây |
| Thời gian tạo báo cáo (≤10.000 bản ghi) | ≤ 30 giây |
| Thời gian upload file (≤10MB) | ≤ 10 giây |
| API throughput | ≥ 100 request/giây (sustained) |
| Người dùng đồng thời (CCU) | 500 (normal), 1.000 (peak) |
| Degradation @1.500 CCU | HTTP 503 cho request mới; cached data cho GET |
| Số giao dịch/ngày | 3.000 |
| Tải đỉnh | ~1 request/giây |
| Băng thông đỉnh | ~10 Mbps |
| Uptime | ≥ 99.5% |
| MTBF | ≥ 720 giờ (30 ngày) |
| MTTR | ≤ 4 giờ cho sự cố nghiêm trọng |
| RTO | ≤ 4 giờ |
| RPO | ≤ 6 giờ |



---

# PHẦN 5 - THIẾT KẾ MÔ HÌNH VẬT LÝ


## 10. Thiết kế mô hình vật lý


### 10.1. Mô hình triển khai vật lý


Hệ thống được triển khai trên hạ tầng Trung tâm dữ liệu Bộ Tư Pháp với mô hình phân vùng mạng DMZ - Internal:


*Hình 7: Mô hình triển khai vật lý*

![Hình 7: Mô hình triển khai vật lý](images/diagram-08-physical.png)


### 10.2. Phân vùng mạng


Hạ tầng mạng được phân chia thành các VLAN riêng biệt:


| VLAN | Mục đích | Thành phần |
|---|---|---|
| VLAN 10 (DMZ) | Tiếp nhận yêu cầu từ Internet | Load Balancer, Web Server |
| VLAN 20 (Application) | Xử lý logic ứng dụng | API Server, Redis Cache |
| VLAN 30 (Database) | Lưu trữ dữ liệu | Oracle Database, File Server |
| VLAN 40 (Integration) | Tích hợp hệ thống | LGSP Gateway |
| VLAN 100 (Management) | Quản lý hạ tầng | Monitoring, Backup |


Quy tắc truy cập giữa các vùng:


![Quy tắc truy cập giữa các vùng mạng](images/diagram-09-vlan.png)



---

# PHẦN 6 - GIẢI PHÁP BẢO MẬT


## 11. Giải pháp bảo mật


### 11.1. Kiến trúc bảo mật


Giải pháp bảo mật được áp dụng theo chiến lược Defense in Depth (Bảo mật theo chiều sâu), thực thi tại tất cả các lớp:


*Hình 8: Kiến trúc bảo mật nhiều lớp*

![Hình 8: Kiến trúc bảo mật nhiều lớp](images/diagram-10-security.png)


Chi tiết giải pháp bảo mật theo từng lớp:


| Lớp | Giải pháp | Chi tiết |
|---|---|---|
| Hạ tầng | Firewall + SSL/TLS | Phân vùng mạng DMZ/Internal, HTTPS toàn bộ, IDS/IPS |
| Hệ điều hành | OS Hardening | Cập nhật bản vá, antivirus, giám sát log hệ thống |
| Phần mềm nền | Oracle VPD + TDE | Phân tách dữ liệu đa cấp, mã hóa dữ liệu trong suốt |
| Ứng dụng | JWT + Session + RBAC | AES-256 file encryption, bcrypt password, HttpOnly cookies |
| Quy trình | Audit + Workflow | Nhật ký bất biến, quy trình phê duyệt, khóa tài khoản sau 5 lần sai |


### 11.2. Phân quyền chức năng


Hệ thống áp dụng mô hình RBAC 3 cấp (Role-Based Access Control) kết hợp Oracle VPD để phân tách dữ liệu:


| Cấp | Vai trò | Phạm vi dữ liệu |
|---|---|---|
| Trung ương | CB NV TW, CB PD TW | Toàn bộ dữ liệu TW + BN + ĐP |
| Bộ ngành | CB NV BN, CB PD BN | Dữ liệu thuộc Bộ ngành quản lý |
| Địa phương | CB NV ĐP, CB PD ĐP | Dữ liệu thuộc Địa phương quản lý |


### 11.3. Mã hóa dữ liệu


| Vị trí | Phương thức | Thuật toán |
|---|---|---|
| Dữ liệu trên đường truyền | SSL/TLS | TLS 1.2+ |
| Mật khẩu người dùng | Mã hóa một chiều | bcrypt (salt rounds: 12) |
| Dữ liệu nhạy cảm trong DB | Oracle TDE | AES-256 |
| File đính kèm | Mã hóa file | AES-256-GCM |
| JWT Token | Chữ ký số | RS256 (RSA + SHA-256) |
| Kết nối LGSP | Xác thực hai chiều | mTLS (Mutual TLS) |


### 11.4. Quản lý phiên và xác thực API


| Thông số | Giá trị |
|---|---|
| Session timeout (CMS) | 30 phút idle |
| JWT Access Token TTL | 15 phút |
| JWT Refresh Token TTL | 24 giờ |
| Khóa tài khoản | Sau 5 lần đăng nhập sai |
| 2FA/MFA | TOTP bắt buộc cho QTHT, tùy chọn cho người dùng khác |
| OTP | Qua email (không SMS) |


### 11.5. Rate Limiting API


| Loại kết nối | Giới hạn | Mô tả |
|---|---|---|
| API Outbound (PM → Cổng PLQG qua LGSP) | 100 request/phút/consumer | Giới hạn tần suất gọi API chia sẻ dữ liệu |
| API Inbound (HT TTHC, Cổng PLQG → PM) | 200 request/phút/source | Giới hạn tần suất nhận dữ liệu từ hệ thống ngoài |
| Xử lý vượt giới hạn | HTTP 429 Too Many Requests | Trả về thông báo lỗi kèm thời gian chờ (Retry-After header) |



---

# PHẦN 7 - GIẢI PHÁP TRIỂN KHAI


## 12. Giải pháp triển khai


### 12.1. Tổng quan giải pháp triển khai


Hệ thống được triển khai On-premise tại Trung tâm dữ liệu Bộ Tư Pháp sử dụng Docker Compose 3.8 để container hóa toàn bộ ứng dụng:


Docker Compose Services:


| Service | Image | Port | Mô tả |
|---|---|---|---|
| pm-htpldn-web | next.js:15 | 3000 | Frontend application |
| pm-htpldn-api | nestjs:10 | 3001 | Backend API |
| oracle-db | oracle:21c | 1521 | Oracle Database |
| redis | redis:7 | 6379 | Cache & Session Store |


*Hình 9: Sơ đồ triển khai Docker Compose*

![Hình 9: Sơ đồ triển khai Docker Compose](images/diagram-11-docker.png)


### 12.2. Đề xuất tài nguyên hạ tầng


#### 12.2.1. Thông tin yêu cầu đầu vào


| Thông số | Giá trị |
|---|---|
| Tổng số người dùng tiềm năng | 816.000 |
| Doanh nghiệp nhỏ và vừa (~1 triệu DN) | 800.000 |
| Tổ chức tư vấn, tư vấn viên pháp lý (~20.000) | 16.000 |
| Tỷ lệ truy cập hệ thống | 1% |
| Số người dùng đồng thời (CCU) | 500 |
| Overhead CSDL (index, log, b-tree) | 50% |
| Số giao dịch/ngày (yêu cầu qua hệ thống + APIs) | 3.000 |
| Số giây làm việc/ngày | 28.800 |
| Hệ số giờ cao điểm | 1 |
| Thời gian xử lý trung bình 1 yêu cầu | 2 giây |
| Tải đỉnh | ~1 request/giây |
| Số ngày làm việc/năm | 288 |


#### 12.2.2. Bảng đề xuất tài nguyên hạ tầng


| Thành phần phần mềm | Số lượng Server | CPU Cores/Server | RAM (GB)/Server | Storage/Server |
|---|---|---|---|---|
| Web/App | 3 | 10 | 32 | Local: 500 GB |
| Database | 2 | 16 | 64 | Local: 500 GB; Shared: 2.000 GB |


Nguồn: Thiết kế cơ sở Cổng pháp luật quốc gia — Mục 2.5.2


### 12.3. Dự toán tăng trưởng dữ liệu


Dự kiến tăng trưởng dữ liệu giai đoạn 2026 - 2030:


| Loại dữ liệu | Tốc độ tăng trưởng/năm | 2026 | 2027 | 2028 | 2029 | 2030 |
|---|---|---|---|---|---|---|
| Hồ sơ vụ việc pháp lý | 100% | 33,75 GB | 67,50 GB | 135,00 GB | 270,00 GB | 540,00 GB |
| Tài liệu tư vấn pháp lý | 100% | 33,75 GB | 67,50 GB | 135,00 GB | 270,00 GB | 540,00 GB |
| Hồ sơ tư vấn viên | 100% | 7,81 GB | 15,63 GB | 31,25 GB | 62,50 GB | 125,00 GB |
| Chương trình HTPLDN | 100% | 0,48 GB | 0,96 GB | 1,91 GB | 3,83 GB | 7,66 GB |
| Dữ liệu đào tạo | 100% | 3,91 GB | 7,81 GB | 15,63 GB | 31,25 GB | 62,50 GB |
| Tổng DL nghiệp vụ | - | 79,70 GB | 159,39 GB | 318,79 GB | 637,58 GB | 1.275,16 GB |
| Overhead CSDL (50%) | - | 39,85 GB | 79,70 GB | 159,39 GB | 318,79 GB | 637,58 GB |
| TỔNG CỘNG | - | 119,55 GB | 239,09 GB | 478,18 GB | 956,37 GB | 1.912,73 GB |


*Hình 10: Biểu đồ dự báo tăng trưởng dữ liệu*

![Hình 10: Biểu đồ dự báo tăng trưởng dữ liệu](images/diagram-12-growth.png)


## PHỤ LỤC


### Phụ lục A: Bảng tổng hợp yêu cầu phi chức năng


| Danh mục | Số lượng NFR | Giải pháp đáp ứng |
|---|---|---|
| Hiệu năng (PERF) | 8 | Redis caching + Oracle indexes + Connection pooling + Pagination |
| Bảo mật (SEC) | 7 | Oracle VPD + JWT + bcrypt + AES-256 + mTLS + HttpOnly cookies |
| Tin cậy (REL) | 7 | Optimistic locking + Soft delete + Oracle views + Error handling |
| Khả dụng (AVL) | 5 | Docker containers + Health checks + RMAN backup |
| Bảo trì (MNT) | 6 | Winston logging + NestJS modular + ConfigModule + BullMQ |
| Khả chuyển (PRT) | 5 | Docker deployment + OpenAPI 3.0 + Chrome/Edge support |


### Phụ lục B: Quy ước đặt tên


| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Database Table/Column | UPPER_SNAKE_CASE | VU_VIEC, HOI_DAP, MA_TVV |
| API Endpoint | kebab-case | /api/v1/vu-viec, /api/v1/tu-van-vien |
| Code Function | camelCase | getVuViec(), createTuVanVien() |
| Code Class | PascalCase | VuViecService, TuVanVienController |
| File Name | kebab-case | vu-viec.service.ts, tu-van-vien.dto.ts |


### Phụ lục C: Các quyết định kiến trúc chính


| Quyết định | Lựa chọn | Lý do |
|---|---|---|
| Multi-tenancy | RBAC + Oracle VPD (3 cấp: TW/BN/ĐP) | Phân tách dữ liệu theo đơn vị tổ chức |
| Authentication | Session + JWT RS256 + OAuth2/OIDC | Hỗ trợ đa kênh (CMS, APIs, VNeID) |
| Caching | Redis 7.x | Session storage, cache danh mục, BullMQ |
| Search | Oracle Text (CONTEXT index) | Built-in, đủ đáp ứng ~10K bản ghi/năm |
| API Versioning | URL path prefix /api/v1/ | Chuẩn RESTful |
| Error Handling | Standardized JSON response | Mã lỗi và thông báo nhất quán |
| Audit Logging | Bảng AUDIT_LOG bất biến | Ghi nhật ký mọi thao tác CREATE/UPDATE/DELETE |
| File Upload | Max 20MB, Multer validation | Bảo mật lưu trữ tài liệu |
