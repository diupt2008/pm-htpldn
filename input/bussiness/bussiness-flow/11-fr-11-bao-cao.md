# 11 · FR-11 Báo cáo Thống kê

> **Tài liệu gốc**: `docs/requirements/fr-11-bao-cao.md` · **UC range**: UC124-UC146.
> **Vai trò**: 23 báo cáo điều hành theo TT17/2025 — theo thời gian/lĩnh vực/đơn vị/loại DN. Tất cả kế thừa template **TPL-REPORT-FULL**.

---

## 1. Ma trận 23 báo cáo

| # | UC | Tên báo cáo | Entity | Định dạng biểu đồ |
|---|---|---|---|---|
| 1 | UC-124 | Số lượng hỏi đáp/vướng mắc | HOI_DAP | Donut + Trend |
| 2 | UC-125 | VV đã tiếp nhận | VU_VIEC | Bar + Trend |
| 3 | UC-126 | VV đang hỗ trợ (snapshot) | VU_VIEC | Bar snapshot |
| 4 | UC-127 | VV hoàn thành | VU_VIEC | Bar + Donut |
| 5 | UC-128 | VV theo thời gian | VU_VIEC | Line chart |
| 6 | UC-129 | Lớp đào tạo đang diễn ra | KHOA_HOC | Snapshot |
| 7 | UC-130 | Lớp ĐT đã diễn ra | KHOA_HOC | Bar |
| 8 | UC-131 | Số lượng CG/TVV | TU_VAN_VIEN | Snapshot |
| 9 | UC-132 | Đánh giá hiệu quả HTPL | DOT_DANH_GIA | Weighted |
| 10 | UC-133 | Chất lượng đào tạo | KET_QUA_HOC_TAP | Tỷ lệ + TB |
| 11 | UC-134 | VV theo đơn vị | VV × DV | Stacked bar |
| 12 | UC-135 | VV theo lĩnh vực | VV × Lĩnh vực | Cross-tab |
| 13 | UC-136 | VV theo loại DN | VV × DN.quy_mo | Cross-tab |
| 14 | UC-137 | VV theo thời gian chi tiết | VV × Kỳ × Trạng thái | Stacked bar trend |
| 15 | UC-138 | Chi phí chi trả | HO_SO_CHI_TRA | Tổng tiền |
| 16 | UC-139 | Chi phí theo đơn vị | CP × DV | Cross-tab |
| 17 | UC-140 | Chi phí theo lĩnh vực | CP × Lĩnh vực | Bar |
| 18 | UC-141 | Chi phí theo loại DN | CP × Quy mô | Compare trần NĐ55 |
| 19 | UC-142 | Chi phí theo thời gian | CP × Kỳ | Line chart |
| 20 | UC-143 | Số lượng CT hỗ trợ | CHUONG_TRINH_HTPL | Bar |
| 21 | UC-144 | CT theo đơn vị | CT × DV | Cross-tab + Ngân sách |
| 22 | UC-145 | CT theo lĩnh vực | CT × Lĩnh vực + DN | Bar |
| 23 | UC-146 | CT theo thời gian | CT × Kỳ | Line chart |

---

## 2. Template luồng chung TPL-REPORT-FULL

```mermaid
flowchart TB
    S1[User chọn báo cáo + filter] --> S2[Check quyền BR-AUTH-01]
    S2 --> S3[Check: tu_ngay ≤ den_ngay<br/>Khoảng ≤ 366 ngày<br/>trừ kỳ NĂM]
    S3 --> S4{Phân quyền đơn vị?}
    S4 -->|TW| P1[Toàn quốc]
    S4 -->|BN| P2[Lọc BN + ĐP trực thuộc]
    S4 -->|ĐP| P3[Chỉ ĐP]
    P1 & P2 & P3 --> S5[Query: CHỈ bản ghi DA_DUYET/HOAN_THANH/DA_THANH_TOAN<br/>BR-INTG-07]
    S5 --> S6[Logic nghiệp vụ riêng từng UC]
    S6 --> S7[Format: bảng + biểu đồ]
    S7 --> S8{Export?}
    S8 -->|Excel| X1[.xlsx TT17/2025<br/>max 50K dòng<br/>BR-DATA-06]
    S8 -->|Word| X2[.docx TT17/2025]
    S8 -->|Không| S9[Hiển thị]
    X1 & X2 --> S9
    S9 --> S10[Audit BR-DATA-05]
```

---

## 3. Quy tắc dữ liệu

- **Chỉ đếm bản ghi đã duyệt** — trạng thái cuối cùng (DA_DUYET / HOAN_THANH / DA_THANH_TOAN / DA_CONG_KHAI).
- **Phân quyền đơn vị**: TW thấy toàn quốc · BN thấy BN + ĐP trực thuộc · ĐP chỉ thấy ĐP.
- **Giới hạn khoảng thời gian**: ≤ 366 ngày (trừ kỳ NĂM).
- **Export tối đa**: 50.000 dòng. Vượt → cắt + WRN-RPT-01.

---

## 4. Error codes chung

| Mã | Mô tả |
|---|---|
| ERR-RPT-01 | Ngày bắt đầu > ngày kết thúc |
| ERR-RPT-02 | Khoảng > 1 năm (trừ kỳ NĂM) |
| ERR-RPT-03 | Query timeout |
| ERR-RPT-05 | Không có quyền xem BC |
| WRN-RPT-01 | Vượt 50K dòng, cắt |
| INF-RPT-01 | Không có dữ liệu kỳ |

---

## 5. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **ALL modules nghiệp vụ** | Nguồn dữ liệu từ 15+ entity chính. |
| **FR-01 Dashboard** | Drill-down từ KPI (9 thẻ + 2 biểu đồ) dẫn tới BC chi tiết tương ứng. |
| **FR-08 Đánh giá** | UC-132 dùng kết quả đợt đánh giá. |
| **FR-15 CT HTPLDN** | UC-143..146 dùng BC CT. |

---

## 6. Sơ đồ drill-down từ Dashboard

```mermaid
flowchart LR
    D[Dashboard FR-01]
    D -->|UC-1| R1[UC-124 BC hỏi đáp]
    D -->|UC-2| R2[UC-125 BC VV tiếp nhận]
    D -->|UC-3| R3[UC-126 BC VV đang hỗ trợ]
    D -->|UC-4| R4[UC-127 BC VV hoàn thành]
    D -->|UC-5| R5[UC-129 BC khóa diễn ra]
    D -->|UC-6| R6[UC-130 BC khóa đã diễn ra]
    D -->|UC-7| R7[UC-131 BC CG/TVV]
    D -->|UC-8| R8[UC-132 BC đánh giá]
    D -->|UC-9| R9[UC-133 BC chất lượng ĐT]
```
