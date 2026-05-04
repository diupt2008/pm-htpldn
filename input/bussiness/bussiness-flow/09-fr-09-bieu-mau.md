# 09 · FR-09 Thư viện Biểu mẫu & Hợp đồng

> **Tài liệu gốc**: `docs/requirements/fr-09-bieu-mau.md` · **UC range**: UC92-UC98.
> **Vai trò**: Kho tài liệu mẫu (thư mục cây) — biểu mẫu TGPL, HĐ tư vấn mẫu. Công khai TRỰC TIẾP lên Cổng PLQG **không cần phê duyệt** (CB NV tự chịu trách nhiệm — BR-FLOW-07).

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | CRUD thư mục/biểu mẫu, import hàng loạt, công khai/ẩn, upload file |
| CB PD TW/BN/ĐP | Xem (không phê duyệt tư liệu) |
| DN / NHT | Xem + tải về qua Cổng |
| Cổng PLQG | Pull 18 API chia sẻ biểu mẫu (UC-181/182) |

---

## 2. State Machine SM-BIEUMAU

```mermaid
stateDiagram-v2
    [*] --> NHAP: CB NV tạo
    NHAP --> CONG_KHAI: CB NV công khai<br/>(không cần duyệt BR-FLOW-07)
    CONG_KHAI --> AN: CB NV ẩn
    AN --> CONG_KHAI: Công khai lại
    NHAP --> XOA: CB NV xóa<br/>(soft-delete, audit)
    AN --> XOA: Soft-delete
    XOA --> [*]
```

---

## 3. Sơ đồ thư mục cây (Hierarchical)

```mermaid
flowchart TB
    ROOT[Thư viện biểu mẫu]
    ROOT --> T1[Thư mục: Biểu mẫu TGPL]
    ROOT --> T2[Thư mục: HĐ tư vấn]
    ROOT --> T3[Thư mục: Văn bản pháp luật]
    T1 --> B1[Mẫu 01 NĐ55<br/>HS YC HTPL.docx]
    T1 --> B2[Mẫu 02 NĐ55<br/>HS thanh toán.docx]
    T2 --> B3[HĐ tư vấn mẫu.docx]
    T3 --> B4[NĐ55_2019.pdf]

    classDef folder fill:#fff3e0,stroke:#e65100;
    classDef file fill:#e8f5e9,stroke:#2e7d32;
    class ROOT,T1,T2,T3 folder;
    class B1,B2,B3,B4 file;
```

---

## 4. Luồng nghiệp vụ chính

```mermaid
flowchart TB
    subgraph TM["Quản lý thư mục (UC-92)"]
        T1[Tạo thư mục<br/>tên unique trong đơn vị]
        T2[Check lĩnh vực PL tồn tại]
        T3[INSERT THU_MUC_BIEU_MAU]
    end

    subgraph BM["Upload biểu mẫu (UC-95)"]
        F1[Chọn thư mục đích]
        F2[Upload file<br/>doc/docx/xls/xlsx<br/>≤20MB]
        F3[Quét virus<br/>ERR-BM-07]
        F4[Lưu storage mã hóa AES-256]
        F5[INSERT BIEU_MAU + FILE_DINH_KEM]
    end

    subgraph CK["Công khai (UC-94)"]
        C1[Kiểm tra thư mục KHÔNG rỗng<br/>≥1 biểu mẫu]
        C2[Cập nhật tt=CONG_KHAI]
        C3[POST Cổng PLQG<br/>API trực tiếp<br/>BR-FLOW-07]
        C4{Cổng OK?}
        C5[Audit PUBLISH]
        C6[ERR-CK-02 Lỗi Cổng]
    end

    subgraph IMP["Import hàng loạt (UC-97)"]
        I1[Max 50 file<br/>Tổng ≤500MB]
        I2[Validate từng file]
        I3[INSERT bản hợp lệ]
        I4[Báo cáo: N OK, M lỗi]
    end

    TM --> BM --> CK
    BM --> IMP
    C4 -->|OK| C5
    C4 -->|Lỗi| C6
```

---

## 5. Preview & Download (UC-95 alt)

```mermaid
flowchart LR
    U[User click biểu mẫu] --> T{Định dạng?}
    T -->|doc/docx| C1[Convert sang PDF<br/>preview read-only]
    T -->|xls/xlsx| C2[Render bảng read-only]
    T -->|Khác| C3[Không preview<br/>chuyển sang tải về]
    C1 & C2 & C3 --> D[Nút Tải về]
    D --> DL[Transfer file gốc<br/>Audit TAI_BIEU_MAU]
```

---

## 6. Sequence: Cổng PLQG pull biểu mẫu (UC-98)

```mermaid
sequenceDiagram
    participant CPLQG as Cổng PLQG
    participant GW as API Gateway
    participant API as PM API
    participant DB

    CPLQG->>GW: GET /api/bieu-mau<br/>JWT + mTLS
    GW->>GW: Verify JWT RS256<br/>Check scope htpldn:bieu-mau:read
    GW->>GW: Rate limit 100/min<br/>BR-INTG-03
    GW->>API: Forward
    API->>DB: SELECT BIEU_MAU WHERE tt=CONG_KHAI AND is_deleted=0
    API->>API: Filter tham số<br/>linh_vuc, tu_ngay, den_ngay
    API->>API: Paginate
    DB-->>API: Rows + metadata
    API-->>GW: JSON (metadata + download URL)
    GW-->>CPLQG: 200
```

---

## 7. Error codes

| Mã | Mô tả |
|---|---|
| ERR-TM-02 | Thư mục chứa N biểu mẫu, không thể xóa |
| ERR-CK-01 | Thư mục rỗng không thể công khai |
| ERR-BM-01 | Chỉ chấp nhận doc/docx/xls/xlsx |
| ERR-BM-07 | Nhiễm virus mã độc |
| ERR-IMP-02 | Tối đa 50 file/lần |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-16** | UC-181/182 API Share+Search biểu mẫu. Chỉ trả về CONG_KHAI. |
| **FR-12 TVCS** | Tư liệu pháp lý VV có cùng pattern: công khai trực tiếp (BR-FLOW-07). |
| **FR-03** | FR-III-20 xuất docx/PDF ký số cho CTDT dùng template từ thư viện. |
| **FR-10** | UC-99 Lĩnh vực PL. |
