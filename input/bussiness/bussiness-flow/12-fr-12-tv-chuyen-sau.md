# 12 · FR-12 Tư vấn Chuyên sâu (TVCS)

> **Tài liệu gốc**: `docs/requirements/fr-12-tv-chuyen-sau.md` · **UC range**: UC147-UC153.
> **Vai trò**: Quản lý phiên tư vấn chuyên sâu 1-1 với chuyên gia, tiếp nhận inbound từ Cổng PLQG, lưu trữ hồ sơ pháp lý DN + kho tư liệu pháp lý vụ việc, nhận đánh giá chất lượng.

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | CRUD nội dung TVCS, gán chuyên gia, công khai tư liệu |
| CB PD TW/BN/ĐP | Phê duyệt (khi cần) |
| NHT | Xem + cập nhật tư liệu pháp lý |
| CG (Chuyên gia) | Xác nhận phân công, tư vấn, upload VB tư vấn |
| DN | Xem qua Cổng (không đăng nhập CMS) |
| Cổng PLQG (inbound) | 3 API inbound: yêu cầu TVCS, hồ sơ PL DN, đánh giá chất lượng |

---

## 2. Use-case Map

```mermaid
flowchart LR
    subgraph CMS["CMS thao tác"]
        U147[UC-147 CRUD nội dung TVCS]
        U148[UC-148 Tìm TVCS]
        U150[UC-150 CRUD HSPL DN]
        U152[UC-152 Tư liệu pháp lý VV<br/>có thể công khai]
    end
    subgraph API_IN["API inbound từ Cổng PLQG"]
        U149[UC-149 YC TVCS]
        U151[UC-151 Hồ sơ PL DN]
        U153[UC-153 Đánh giá chất lượng<br/>TAO_MOI/CAP_NHAT/GUI_LAI]
    end
    API_IN -.-> CMS
```

---

## 3. State Machine SM-TVCS

```mermaid
stateDiagram-v2
    [*] --> TIEP_NHAN: CB NV tạo YC<br/>Cổng PLQG inbound
    TIEP_NHAN --> PHAN_CONG: CB NV phân công CG
    PHAN_CONG --> DANG_TU_VAN: CG xác nhận
    PHAN_CONG --> TIEP_NHAN: CG từ chối<br/>có lý do
    PHAN_CONG --> HUY: CB NV hủy<br/>CG chưa xác nhận
    DANG_TU_VAN --> HOAN_THANH: CG tích Hoàn thành<br/>có VB TVPL
    DANG_TU_VAN --> HUY: CB NV hủy + CB PD duyệt
    HOAN_THANH --> CHO_PHE_DUYET: Auto
    CHO_PHE_DUYET --> DA_DUYET: CB PD duyệt<br/>cùng cấp
    CHO_PHE_DUYET --> DANG_TU_VAN: CB PD từ chối<br/>có lý do
    DA_DUYET --> [*]
```

---

## 4. Sequence: Inbound YC TVCS (UC-149)

```mermaid
sequenceDiagram
    actor DN
    participant CPLQG as Cổng PLQG
    participant API as PM API
    participant DB
    actor CBNV as CB NV
    actor CG as Chuyên gia

    DN->>CPLQG: Điền YC TVCS
    CPLQG->>API: POST /tvcs/inbound<br/>API key + HTTPS TLS
    API->>API: Verify API key<br/>Rate limit BR-INTG-03
    API->>API: Validate payload + DN
    alt Trùng mã Cổng
        API-->>CPLQG: ERR-TVCS-API-03
    else Hợp lệ
        API->>DB: Upsert DN theo MST<br/>Link CG nếu có
        API->>DB: Auto-gen TVCS-YYYYMMDD-SEQ<br/>INSERT NOI_DUNG_TU_VAN_CS<br/>tt=CHO_XU_LY, nguồn=CONG_PLQG
        API->>DB: Quét virus file + lưu
        API->>CBNV: Thông báo in-app + email
        API-->>CPLQG: 200 + mã TVCS
    end
    CBNV->>API: Phân công CG (tt=PHAN_CONG)
    API->>CG: Thông báo
    CG->>API: Xác nhận → DANG_TU_VAN
    CG->>API: Upload VB tư vấn + Hoàn thành
    API->>DB: tt=HOAN_THANH → auto CHO_PHE_DUYET
    Note over API: CB PD duyệt → DA_DUYET (sharing Cổng UC-183/184)
```

---

## 5. Quản lý tư liệu pháp lý VV (UC-152)

```mermaid
flowchart LR
    A[CB NV tạo tư liệu<br/>link vụ việc] --> B[Upload file ≤20MB<br/>Quét virus]
    B --> C{Công khai?}
    C -->|Có| D[Check có ≥1 file]
    D --> E[tt=CONG_KHAI]
    E --> F[POST Cổng PLQG trực tiếp<br/>BR-FLOW-07 không cần duyệt]
    F --> G{OK?}
    G -->|Có| H[Audit PUBLISH]
    G -->|Lỗi| I[ERR-TLPL-06]
    C -->|Không| J[Giữ NHAP]
    E -.->|Hủy công khai| K[tt=NHAP<br/>Gỡ khỏi Cổng]
```

---

## 6. Idempotency đánh giá (UC-153)

```mermaid
flowchart TB
    A[Cổng PLQG POST đánh giá] --> B{Loại?}
    B -->|TAO_MOI| T1[Check chưa có ĐG]
    T1 -->|Chưa| T2[INSERT DANH_GIA_CHAT_LUONG_TV]
    T1 -->|Có rồi| E1[ERR-DG-API-05]
    B -->|CAP_NHAT| U1[Check ĐG tồn tại<br/>+ tt cho phép update]
    U1 -->|OK| U2[UPDATE điểm]
    U1 -->|Không| E2[ERR-DG-API-06]
    B -->|GUI_LAI| R1{Đã có?}
    R1 -->|Có| R2[Không ghi đè<br/>Trả 200 success]
    R1 -->|Không| R3[INSERT]
    T2 & U2 & R3 --> FIN[Cập nhật điểm TB chuyên gia]
```

---

## 7. Entity chính

```mermaid
erDiagram
    NOI_DUNG_TU_VAN_CS ||--o{ FILE_DINH_KEM : "có"
    NOI_DUNG_TU_VAN_CS }o--|| DOANH_NGHIEP : "của"
    NOI_DUNG_TU_VAN_CS }o--|| TU_VAN_VIEN : "gán CG"
    NOI_DUNG_TU_VAN_CS ||--o{ TU_LIEU_PHAP_LY : "tư liệu"
    NOI_DUNG_TU_VAN_CS ||--o{ DANH_GIA_CHAT_LUONG_TV : "đánh giá"
    HO_SO_PHAP_LY_DN }o--|| DOANH_NGHIEP : "của"
```

---

## 8. Error codes

| Mã | Mô tả |
|---|---|
| ERR-TVCS-API-03 | Mã Cổng trùng |
| ERR-TVCS-04 | Chuyển trạng thái không hợp lệ |
| ERR-DG-API-03 | Điểm ngoài 1-5 |
| ERR-TLPL-05 | Công khai tư liệu thiếu file |

---

## 9. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-04 CG** | Gán chuyên gia. Cập nhật điểm TB CG sau ĐG. |
| **FR-07 DN** | Upsert DN theo MST khi inbound. |
| **FR-09** | Cùng pattern công khai trực tiếp BR-FLOW-07. |
| **FR-16** | UC-183/184 Share+Search TVCS (chỉ metadata, không VB tư vấn chi tiết). |
