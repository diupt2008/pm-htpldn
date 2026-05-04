# D.2 Report Templates (TT17/2025)

## D.2.1 Mapping cột báo cáo 21a → Nguồn dữ liệu PM

| Cột 21a | Tên cột | Entity nguồn | Công thức |
|---------|---------|-------------|-----------|
| -1 | Số TVV kiện toàn | TU_VAN_VIEN | Đếm số TVV có trạng thái = 'HOAT_DONG' thuộc đơn vị báo cáo |
| -2 | Cuộc tập huấn | KHOA_HOC | Đếm số khóa học loại 'TAP_HUAN' trong kỳ báo cáo |
| -3 | Hội nghị đối thoại | KHOA_HOC | Đếm số khóa học loại 'HOI_NGHI' trong kỳ báo cáo |
| -4 | VB TL UBND | VU_VIEC | Đếm số vụ việc loại văn bản 'TRA_LOI_UBND' trong kỳ báo cáo |
| -5 | VB TV mạng lưới | VU_VIEC | Đếm số vụ việc loại văn bản 'TV_MANG_LUOI' trong kỳ báo cáo |
| -6 | HS tiếp nhận | HO_SO_CHI_TRA | Đếm số hồ sơ chi trả không bị từ chối trong kỳ báo cáo |
| -7 | HS giải quyết tổng | HO_SO_CHI_TRA | Đếm số hồ sơ chi trả đã thanh toán trong kỳ báo cáo |
| -8 | DN vừa | HO_SO_CHI_TRA | Đếm số hồ sơ đã thanh toán cho DN quy mô vừa |
| -9 | DN nhỏ | HO_SO_CHI_TRA | Đếm số hồ sơ đã thanh toán cho DN quy mô nhỏ |
| -10 | DN siêu nhỏ | HO_SO_CHI_TRA | Đếm số hồ sơ đã thanh toán cho DN quy mô siêu nhỏ |
| -11 | KP HT TVPL (NSNN) | HO_SO_CHI_TRA | Tổng số tiền thực trả của hồ sơ đã thanh toán |
| -12 | KP chi HĐ khác | — | Nhập thủ công |
| -13 | KP xã hội hóa | — | Nhập thủ công |

## D.2.2 Mapping cột báo cáo 21b → Tổng hợp STP

| Cột 21b | Tên cột | Logic tổng hợp |
|---------|---------|---------------|
| A | STT | Auto-gen |
| B | Sở/ban ngành | Từ danh mục đơn vị |
| -1 → -13 | Tương tự 21a | SUM từ các Sở/ban ngành thuộc tỉnh |
| -14 | Ghi chú | Nhập thủ công |

## D.2.3 Export format

| Format | Thư viện đề xuất | Template |
|--------|-----------------|---------|
| Excel (.xlsx) | Apache POI | Template 21a/21b có sẵn, fill data |
| Word (.docx) | Apache POI (docx4j) | Template 21a/21b có sẵn, fill data |

## D.2.4 Mapping mẫu biểu TT 17/2025/TT-BTP [GAP-IX-03]

| # | Mẫu biểu | Số hiệu | FR tham chiếu | Mô tả |
|---|----------|---------|---------------|-------|
| 1 | Báo cáo sơ bộ 6 tháng CT HTPLDN | Mẫu 21a | FR-IX-01~23 (TPL-REPORT-FULL) | Báo cáo tình hình thực hiện CT HTPL 6 tháng đầu năm |
| 2 | Báo cáo tổng kết năm CT HTPLDN | Mẫu 21b | FR-IX-01~23 (TPL-REPORT-FULL) | Báo cáo tổng kết năm thực hiện CT HTPL |

**Format chung theo TT 17/2025:**
- Khổ giấy: A4 (210 × 297mm)
- Phông chữ: Times New Roman, cỡ 13pt
- Header: Quốc hiệu + Tên cơ quan ban hành
- Footer: Ngày ký + Chức danh người ký + Con dấu (nếu in chính thức)
- Lề: Trên 2cm, Dưới 2cm, Trái 3cm, Phải 2cm

---

> **Ghi chú v2.0:** Section D.3 (API Contracts — 18 outbound APIs, inbound contracts, OAuth/SSO flow) từ SRS v1.8 đã chuyển sang Architecture Design Document.
> Xem `architecture-inputs-from-srs.md` §7 API Design & Contracts.

---


> **Ghi chú v2.0:** Phụ lục E (Tham chiếu Architecture) từ SRS v1.8 đã được xóa hoàn toàn.
> Nội dung đã chuyển sang Architecture Design Document (`architecture.md`).
> Xem `architecture-inputs-from-srs.md` §9 Architecture Decisions Summary, §10 Project Structure.

---


---



---
