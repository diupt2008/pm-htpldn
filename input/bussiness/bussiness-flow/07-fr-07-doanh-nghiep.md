# 07 · FR-07 Quản lý Doanh nghiệp được Hỗ trợ

> **Tài liệu gốc**: `docs/requirements/fr-07-doanh-nghiep.md` · **UC range**: UC81-UC82 + 1 mới (Import Excel).
> **Vai trò**: Lưu trữ hồ sơ DNNVV thụ hưởng chính sách — CRUD, import hàng loạt, phân quy mô NĐ39/2018, xem lịch sử hỗ trợ.

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | CRUD, import, xem lịch sử |
| CB PD TW/BN/ĐP | Xem |
| Hệ thống | Auto-tạo DN (qua UC-53, UC-55, UC-68, UC-74, UC-149, UC-151 upsert theo MST) |

---

## 2. Mô hình dữ liệu

```mermaid
erDiagram
    DOANH_NGHIEP ||--o{ VU_VIEC : "phát sinh"
    DOANH_NGHIEP ||--o{ HO_SO_CHI_TRA : "đề nghị"
    DOANH_NGHIEP ||--o{ DANG_KY_DAO_TAO : "đăng ký ĐT"
    DOANH_NGHIEP ||--o{ NOI_DUNG_TU_VAN_CS : "yêu cầu TVCS"
    DOANH_NGHIEP ||--o{ HO_SO_PHAP_LY_DN : "có hồ sơ PL"
    DOANH_NGHIEP {
        string ma_dn PK "DN-TINH-SEQ"
        string mst UK "duy nhất toàn HT"
        string ten_dn
        enum quy_mo "SIEU_NHO | NHO | VUA"
        int so_lao_dong
        decimal doanh_thu_nam
        bool la_phu_nu_lam_chu
        bool la_nhieu_ld_nu
        bool la_khuyet_tat_30pc
        string don_vi_id FK
    }
```

---

## 3. Quy mô DN (BR-CALC-05, NĐ39/2018)

```mermaid
flowchart TB
    A[Input: số LĐ + doanh thu] --> B{Phân loại}
    B -->|LĐ ≤10 & DT ≤3 tỷ| SN[SIEU_NHO<br/>100% HT · Trần 3tr/năm]
    B -->|LĐ ≤100 & DT ≤50 tỷ| N[NHO<br/>30% HT · Trần 5tr/năm]
    B -->|LĐ ≤300 & DT ≤300 tỷ| V[VUA<br/>10% HT · Trần 10tr/năm]
    B -->|Vượt| OFF[Không thuộc DNNVV<br/>Cảnh báo WRN-DN-01]
```

---

## 4. Luồng CRUD (UC-81)

```mermaid
flowchart LR
    subgraph CREATE["Thêm mới"]
        C1[Auto-gen DN-TINH-SEQ<br/>BR-DATA-04]
        C2[Validate tên + MST]
        C3[Check MST unique toàn HT]
        C4[Check quy mô vs LĐ/DT<br/>BR-CALC-05]
        C5[INSERT DOANH_NGHIEP<br/>7 common fields BR-DATA-03]
    end
    subgraph LIST["Xem danh sách"]
        L1[Filter don_vi_id<br/>BR-AUTH-08]
        L2[JOIN VU_VIEC count]
        L3[Phân trang 20]
    end
    subgraph UPDATE["Chỉnh sửa"]
        U1[Validate]
        U2[Update]
        U3[Audit old → new]
    end
    subgraph DELETE["Xóa mềm"]
        D1{Có VV đang XL?}
        D2[ERR-DN-03<br/>Chặn]
        D3[is_deleted=1]
    end
    subgraph HISTORY["Lịch sử HT"]
        H1[List VU_VIEC thuộc DN]
        H2[Tổng VV, chi phí, HT]
        H3[Timeline]
    end
    C1 --> C2 --> C3 --> C4 --> C5
    D1 -->|Có| D2
    D1 -->|Không| D3
```

---

## 5. Import Excel (UC-NEW-01)

```mermaid
sequenceDiagram
    actor CBNV
    participant API
    participant Excel as Excel Parser
    participant DB

    CBNV->>API: Upload file .xlsx ≤5MB, max 1000 dòng
    API->>API: Validate file type/size<br/>ERR-IMP-DN-01/02
    API->>Excel: Parse file
    Excel-->>API: Rows + columns
    API->>API: Check cột bắt buộc<br/>ERR-IMP-DN-03
    
    loop Mỗi dòng
        API->>API: Validate bắt buộc + format MST
        alt Lỗi
            API->>API: Ghi vào báo cáo lỗi<br/>ERR-IMP-DN-04
        else Trùng MST
            API->>API: Skip INF-IMP-DN-01
        else Hợp lệ
            API->>DB: INSERT DOANH_NGHIEP
        end
    end
    
    API-->>CBNV: Review: tổng dòng, OK, lỗi, trùng
    CBNV->>API: Confirm
    API->>DB: Commit
    API->>DB: Audit log (BULK_IMPORT)
    API-->>CBNV: Báo cáo import
```

---

## 6. Tìm kiếm (UC-82)

- Logic **AND** cho các filter: keyword (tên + MST), loại hình, quy mô, đơn vị, khoảng ngày.
- Phân trang 20 (BR-DATA-07) · Full-text search cho tên + MST.

---

## 7. Error codes

| Mã | Mô tả |
|---|---|
| ERR-DN-02 | MST đã tồn tại |
| WRN-DN-01 | Quy mô không khớp LĐ/DT (cảnh báo, không chặn) |
| ERR-DN-03 | Không xóa DN đang có VV xử lý |
| ERR-IMP-DN-02 | File >5MB |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-05 VV** | UC-54 tự động tạo DN nếu MST chưa có khi CB NV nhập thủ công. |
| **FR-06 Chi trả** | UC-72 tra quy mô để áp mức hỗ trợ 100%/30%/10%. |
| **FR-08 Đánh giá** | Lịch sử VV của DN tham gia đợt ĐG. |
| **FR-12 TVCS** | DN upsert theo MST khi inbound TVCS (UC-149). |
| **FR-16** | UC-187/188 Share+Search hồ sơ PL DN (đã ẩn nhạy cảm). |
