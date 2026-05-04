# 02 · FR-02 Hỏi đáp, Vướng mắc Pháp lý

> **Tài liệu gốc**: `docs/requirements/fr-02-hoi-dap.md` · **UC range**: UC10-UC19 + 2 mới + 1 cross-cutting SLA.
> **Vai trò**: Quản lý vòng đời câu hỏi pháp lý của DN — tiếp nhận, phân công, phản hồi, phê duyệt, công khai lên Cổng PLQG.

---

## 1. Actors

| Actor | Thao tác chính |
|---|---|
| DN | Gửi câu hỏi qua Cổng PLQG (API inbound) |
| CB NV TW/BN/ĐP | Tiếp nhận · Phân công · Soạn phản hồi · Quản lý mẫu phản hồi |
| CB PD TW/BN/ĐP | Phê duyệt · Công khai · Phê duyệt hàng loạt |
| QTHT | Cấu hình lĩnh vực ↔ CB |
| Hệ thống | Background job SLA 30 phút |

---

## 2. Use-case Map

```mermaid
flowchart LR
    subgraph CREATE["Quản lý & Tìm kiếm"]
        UC10[UC-10 CRUD HD]
        UC11[UC-11 Tìm tổng hợp]
        UC18[UC-18 Xem đã xử lý]
        UC19[UC-19 Tìm đã xử lý]
    end
    subgraph PROCESS["Xử lý"]
        UC12[UC-12 Tiếp nhận]
        UC13[UC-13 QL thời hạn]
        UC14[UC-14 Tìm đã TN]
        UC15[UC-15 Phân công]
        UC16[UC-16 Phản hồi]
    end
    subgraph APPROVE["Phê duyệt & Công khai"]
        UC17[UC-17 Phê duyệt · Công khai · Batch]
    end
    subgraph CONFIG["Cấu hình"]
        UCN1[UC-NEW-01 Map lĩnh vực ↔ CB]
        UCN2[UC-NEW-02 Mẫu phản hồi]
        UCC1[UC-CROSS-01 Job SLA 30 phút]
    end

    CREATE --> PROCESS --> APPROVE
    CONFIG -.-> PROCESS
```

---

## 3. State Machine SM-HOIDAP

```mermaid
stateDiagram-v2
    [*] --> MOI: DN gửi qua Cổng/DVC
    MOI --> TIEP_NHAN: CB NV tiếp nhận<br/>(cùng đơn vị, tính deadline)
    MOI --> HUY: CB NV hủy<br/>(chưa có phản hồi)
    TIEP_NHAN --> DANG_XU_LY: Phân công NHT/TVV
    DANG_XU_LY --> DA_TRA_LOI: CB NV tích "Đã trả lời"
    DA_TRA_LOI --> CHO_PHE_DUYET: Auto transition<br/>BR-FLOW-01
    CHO_PHE_DUYET --> DA_DUYET: CB PD duyệt<br/>(cùng cấp BR-AUTH-05)
    CHO_PHE_DUYET --> DANG_XU_LY: CB PD từ chối<br/>(bắt buộc lý do BR-FLOW-04)
    DA_DUYET --> CONG_KHAI: Công khai Cổng PLQG<br/>(API trực tiếp BR-FLOW-05)
    CONG_KHAI --> DA_DUYET: Hủy công khai<br/>(API gỡ)
    DA_DUYET --> HOAN_THANH: Đóng hồ sơ
    CONG_KHAI --> HOAN_THANH: Đóng hồ sơ
    HOAN_THANH --> [*]
    HUY --> [*]
```

---

## 4. Sequence: DN → PM → Cổng PLQG (vòng đời đầy đủ)

```mermaid
sequenceDiagram
    actor DN as Doanh nghiệp
    participant CPLQG as Cổng PLQG
    participant API as PM API
    participant DB as Database
    actor CBNV as CB NV
    actor CBPD as CB PD

    DN->>CPLQG: Nhập câu hỏi + lĩnh vực
    CPLQG->>API: POST /hoi-dap (API trực tiếp)
    API->>DB: INSERT HOI_DAP<br/>mã HD-YYYYMMDD-SEQ, tt=MOI
    DB-->>API: OK
    API-->>CPLQG: 200 + mã HD
    API->>CBNV: Thông báo in-app/email

    CBNV->>API: Nhấn Tiếp nhận (UC-12)
    API->>DB: UPDATE tt=TIEP_NHAN, tính SLA 10 ngày LV

    CBNV->>API: Phân công NHT/TVV (UC-15)
    API->>DB: UPDATE tt=DA_PHAN_CONG, nguoi_xu_ly_id
    API->>CBNV: Cảnh báo workload (nếu vượt)

    CBNV->>API: Soạn phản hồi (UC-16)<br/>Chọn mẫu phản hồi (UC-NEW-02)
    API->>DB: INSERT PHAN_HOI, tt=DANG_XU_LY
    Note over API: Tích "Đã trả lời" → Auto CHO_PHE_DUYET (BR-FLOW-01)
    API->>CBPD: Thông báo chờ duyệt

    CBPD->>API: Phê duyệt (UC-17)
    API->>DB: UPDATE tt=DA_DUYET

    CBPD->>API: Công khai
    API->>CPLQG: POST /hoi-dap/public (trực tiếp)
    CPLQG-->>API: 200
    API->>DB: UPDATE tt=CONG_KHAI

    Note over DN: DN xem phản hồi trên Cổng PLQG
```

---

## 5. Phân công & Workload (UC-15)

```mermaid
flowchart TB
    A[CB NV chọn Phân công] --> B[Load gợi ý tự động<br/>khớp lĩnh vực từ CAU_HINH_PHAN_CONG]
    B --> C[Check user hoạt động]
    C --> D[Tính workload<br/>COUNT HD đang xử lý]
    D --> E{Vượt ngưỡng?}
    E -->|Có| F[Warning WRN-PC-01<br/>User xác nhận?]
    E -->|Không| G[Cập nhật người xử lý<br/>tt=DA_PHAN_CONG]
    F -->|Xác nhận| G
    F -->|Hủy| H[Chọn người khác]
    G --> I[Gửi thông báo in-app + email]
    I --> J[Audit log]
```

---

## 6. Cross-cutting: Background Job SLA (UC-CROSS-01)

```mermaid
flowchart LR
    A[Cron 30 phút] --> B[Lấy HD trạng thái<br/>TN/PC/DXL]
    B --> C[Tính % thời gian đã dùng<br/>BR-CALC-03]
    C --> D{Mức cảnh báo?}
    D -->|>50%| E1[BINH_THUONG]
    D -->|≤50%| E2[SAP_HET]
    D -->|>100%| E3[QUA_HAN]
    D -->|>2x| E4[QUA_HAN_NGHIEM_TRONG]
    E1 & E2 & E3 & E4 --> F[Update cảnh báo trong DB]
    F --> G{Mức thay đổi?}
    G -->|Có| H[Gửi email + in-app<br/>CB NV + CB PD<br/>BR-SLA-03]
    G -->|Không| I[Skip]
```

---

## 7. Batch phê duyệt (UC-17 alt flow)

- Max 100 bản ghi/request (BR-EC-19 / ERR-PD-05).
- Lỗi từng bản ghi → ghi nhận, tiếp tục; kết quả WRN-PD-01 `{N} duyệt, {M} lỗi`.
- **Từ chối bắt buộc từng bản ghi** (để nhập lý do khác nhau).

---

## 8. Error codes quan trọng

| Mã | Mô tả | UC |
|---|---|---|
| ERR-HD-04 | Không sửa/xóa bản ghi đã duyệt (BR-FLOW-03) | UC-10 |
| ERR-TN-03 | Xung đột: đã được người khác tiếp nhận (EC-01) | UC-12 |
| ERR-PD-01 | Không được duyệt khác cấp (BR-AUTH-05) | UC-17 |
| ERR-PD-04 | Lỗi API Cổng PLQG | UC-17 |
| ERR-PD-05 | Batch > 100 bản ghi | UC-17 |

---

## 9. Tích hợp với phân hệ khác

| Tích hợp | Chi tiết |
|---|---|
| **FR-13 Tư vấn nhanh** | HD `DA_DUYET` auto bổ sung vào kho Q&A TV nhanh (nguồn = TU_DONG, BR-FLOW-10). |
| **FR-16 API outbound** | UC-171 `API Chia sẻ hỏi đáp` · UC-172 `API Tìm kiếm hỏi đáp` đều lọc `DA_DUYET`. |
| **FR-10 SLA config** | UC-108 cấu hình thời hạn xử lý mặc định (10 ngày LV). |
| **FR-10 Danh mục** | UC-99 Lĩnh vực PL · UC-NEW-01 mapping lĩnh vực ↔ CB. |
