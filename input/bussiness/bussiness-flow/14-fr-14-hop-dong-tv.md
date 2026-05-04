# 14 · FR-14 Hợp đồng Tư vấn (HĐ TV)

> **Tài liệu gốc**: `docs/requirements/fr-14-hop-dong-tv.md` · **UC range**: UC159, UC159e.
> **Vai trò**: Quản lý hợp đồng tư vấn pháp lý giữa cơ quan QLNN/tổ chức TV và DN — có N:N liên kết Vụ việc, có mốc tiến độ và thanh toán giai đoạn. **Không có vòng đời phê duyệt** (CRUD thuần).

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | CRUD HĐ tư vấn, thêm mốc tiến độ, mốc thanh toán, gán VV |
| CB PD TW/BN/ĐP | Xem & tìm kiếm (không phê duyệt — HĐ không có duyệt) |

---

## 2. Entity chính

```mermaid
erDiagram
    HOP_DONG_TU_VAN ||--o{ MOC_TIEN_DO : "có"
    HOP_DONG_TU_VAN ||--o{ THANH_TOAN_GIAI_DOAN : "có"
    HOP_DONG_TU_VAN }o--o{ VU_VIEC : "liên kết N:N"
    HOP_DONG_TU_VAN }o--|| DON_VI : "thuộc"
    HOP_DONG_TU_VAN }o--|| DOANH_NGHIEP : "bên B (tùy chọn)"
    HOP_DONG_TU_VAN ||--o{ FILE_DINH_KEM : "file HĐ"
```

---

## 3. Luồng nghiệp vụ chính (UC-159)

```mermaid
flowchart TB
    A[CB NV vào Quản lý HĐ TV] --> B{Action}
    B -->|Tạo mới| C1[Input: Tên HĐ, giá trị,<br/>ngày BD/KT, bên A/B]
    C1 --> V1{Validate}
    V1 -->|Tên rỗng| E1[ERR-HDTV-01]
    V1 -->|Ngày BD > KT| E2[ERR-HDTV-02]
    V1 -->|GT ≤ 0| E5[ERR-HDTV-05]
    V1 -->|OK| G1[Sinh mã HDTV-YYYYMMDD-SEQ<br/>BR-DATA-04]
    G1 --> G2[INSERT HOP_DONG_TU_VAN]

    B -->|Thêm mốc TT| C2[Input: số tiền mốc]
    C2 --> V2{Σ mốc ≤ giá trị HĐ?}
    V2 -->|Không| E3[ERR-HDTV-03]
    V2 -->|OK| G3[INSERT THANH_TOAN_GIAI_DOAN]

    B -->|Link VV| C3[Chọn VV]
    C3 --> G4[INSERT M2M link<br/>HD_VV]

    B -->|Xóa HĐ| C4{Có VV link?}
    C4 -->|Có| E4[ERR-HDTV-04]
    C4 -->|Không| G5[Soft-delete<br/>BR-DATA-01]

    G2 & G3 & G4 & G5 --> AU[Audit BR-DATA-05]
```

---

## 4. Ràng buộc tiền tệ (BR-DATA — HĐ)

```mermaid
flowchart LR
    A[Giá trị HĐ<br/>gia_tri_hd > 0] --> B[Tổng mốc thanh toán<br/>Σ TTGD.so_tien]
    B --> C{Σ ≤ gia_tri_hd?}
    C -->|Có| OK[Hợp lệ]
    C -->|Không| FAIL[ERR-HDTV-03<br/>reject]
    A --> D[Mốc tiến độ<br/>MOC_TIEN_DO<br/>Công việc + Deadline]
    D --> E[Trạng thái mốc<br/>CHUA_HOAN_THANH / HOAN_THANH]
```

---

## 5. Sequence: Tạo HĐ + Link VV

```mermaid
sequenceDiagram
    actor CB as CB NV
    participant FE as CMS
    participant API as PM API
    participant DB

    CB->>FE: Nhập HĐ + mốc TT
    FE->>API: POST /hop-dong-tv
    API->>API: Validate: tên, ngày, GT > 0<br/>Σ mốc ≤ GT
    API->>DB: INSERT HOP_DONG_TU_VAN<br/>mã HDTV-YYYYMMDD-SEQ
    API->>DB: INSERT MOC_TIEN_DO, THANH_TOAN_GIAI_DOAN
    API->>DB: INSERT AUDIT_LOG<br/>action=CREATE
    API-->>FE: 201 + mã HĐ
    CB->>FE: Link VV<br/>chọn VV tồn tại
    FE->>API: POST /hop-dong-tv/{id}/vu-viec
    API->>DB: INSERT HD_VV<br/>(hd_id, vv_id)
    API-->>FE: 200 OK
```

---

## 6. Sequence: Tìm kiếm HĐ (UC-159e)

```mermaid
sequenceDiagram
    actor U as CB NV/PD
    participant FE
    participant API
    participant DB

    U->>FE: Nhập từ khóa + filter
    FE->>API: GET /hop-dong-tv/search
    API->>API: Check quyền BR-AUTH-01<br/>Scope đơn vị BR-AUTH-08
    API->>API: Validate tu_ngay ≤ den_ngay<br/>ERR-HDTV-TK-01
    API->>DB: Full-text search tên+mã+bên B<br/>AND filter
    DB-->>API: Rows
    API->>API: Paginate BR-DATA-07
    API-->>FE: Page + total
    alt Không có kết quả
        API-->>FE: INF-HDTV-TK-01
    end
```

---

## 7. Error codes

| Mã | Mô tả |
|---|---|
| ERR-HDTV-01 | Tên HĐ bắt buộc |
| ERR-HDTV-02 | Ngày BD > KT |
| ERR-HDTV-03 | Σ thanh toán > giá trị HĐ |
| ERR-HDTV-04 | Không xóa HĐ có VV liên kết |
| ERR-HDTV-05 | Giá trị HĐ ≤ 0 |
| ERR-HDTV-TK-01 | Ngày BD > KT khi tìm |
| INF-HDTV-TK-01 | Không tìm thấy HĐ |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-05 VV** | N:N — 1 HĐ có nhiều VV, 1 VV có nhiều HĐ. |
| **FR-07 DN** | Bên B (tùy chọn) là DOANH_NGHIEP. |
| **FR-10** | UC-103 ĐƠN VỊ quản lý. |
| **FR-11** | UC-138..142 BC chi phí sử dụng HĐ để gộp tổng. |

---

## 9. Ghi chú

- **KHÔNG có state machine**: HĐ TV chỉ có các status field đơn giản (DANG_THUC_HIEN, HOAN_THANH, THANH_LY), không có flow CHO_PHE_DUYET → DA_DUYET.
- **Không chia sẻ qua Cổng PLQG**: HĐ TV không nằm trong 18 API FR-16 (dữ liệu riêng tư pháp lý).
- **Xóa chặn bởi ràng buộc**: Xóa HĐ không thành công nếu còn VV liên kết (ERR-HDTV-04) — nguyên tắc bảo toàn dữ liệu trace.
