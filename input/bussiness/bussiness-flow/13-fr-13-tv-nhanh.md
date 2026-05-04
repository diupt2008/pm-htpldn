# 13 · FR-13 Tư vấn Nhanh

> **Tài liệu gốc**: `docs/requirements/fr-13-tv-nhanh.md` · **UC range**: UC154-UC158.
> **Vai trò**: Tra cứu nhanh pháp luật — kho câu hỏi-đáp (Q&A) + Full-text search (top-5 câu trả lời) + đánh giá chất lượng từ DN.

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | CRUD kho Q&A, soạn trả lời |
| CB PD TW/BN/ĐP | Phê duyệt Q&A nguồn thủ công/import |
| DN | Gửi câu hỏi, tìm kiếm, đánh giá qua Cổng PLQG |
| Hệ thống | Bổ sung kho Q&A tự động từ FR-02 (hỏi đáp đã duyệt) |

---

## 2. Kho Q&A — 3 nguồn bổ sung (BR-FLOW-10)

```mermaid
flowchart LR
    subgraph SRC["3 nguồn bổ sung"]
        S1[TU_DONG<br/>Từ HĐ FR-02 DA_DUYET<br/>→ auto tt=DA_DUYET]
        S2[THU_CONG<br/>CB NV nhập<br/>→ tt=CHO_DUYET → CB PD duyệt]
        S3[IMPORT<br/>Upload Excel<br/>→ tt=CHO_DUYET → CB PD duyệt]
    end
    SRC --> KQA[Kho Câu hỏi<br/>KHO_CAU_HOI]
    KQA --> FTS[Full-text index<br/>BR-DATA-08]
    FTS --> COPQG[Cổng PLQG search]
    FTS --> CMS[CMS search/gợi ý]
```

---

## 3. State Machine SM-TVNHANH (phiên tư vấn)

```mermaid
stateDiagram-v2
    [*] --> MOI: DN gửi câu hỏi qua Cổng
    MOI --> DANG_TIM_KIEM: HT nhận
    DANG_TIM_KIEM --> DA_GOI_Y: Có kết quả trong kho
    DA_GOI_Y --> HOAN_THANH: DN hài lòng + đánh giá<br/>1-5
    DA_GOI_Y --> CB_TRA_LOI: DN không hài lòng<br/>CB NV soạn trả lời
    CB_TRA_LOI --> HOAN_THANH: DN đánh giá
    MOI --> HET_HAN: Auto quá 30 ngày
    HOAN_THANH --> [*]
    HET_HAN --> [*]
```

---

## 4. Luồng chính: DN tìm/hỏi (UC-155, UC-156)

```mermaid
flowchart TB
    A[DN nhập câu hỏi trên Cổng] --> B{Chọn kênh}
    B -->|TV nhanh| C[Full-text search<br/>kho Q&A]
    B -->|TV thủ công| D[Chuyển FR-02<br/>UC-12 Tiếp nhận]
    C --> E[Sort theo relevance desc]
    E --> F[Trả TOP 5]
    F --> G{DN hài lòng?}
    G -->|Có| H[UC-158 Đánh giá 1-5<br/>→ HOAN_THANH]
    G -->|Không| I[CB NV xem câu hỏi + gợi ý<br/>UC-155]
    I --> J[CB NV chọn gợi ý / soạn mới]
    J --> K[Gửi trả lời]
    K --> L[tt=CB_TRA_LOI]
    L --> M[DN đánh giá → HOAN_THANH]

    subgraph SWITCH["Chuyển kênh"]
        S1[DN chuyển TV thủ công<br/>giữ lịch sử]
    end
    G -.->|Chuyển sang TV thủ công| SWITCH
    SWITCH --> D
```

---

## 5. Sequence: DN tìm kiếm (UC-157)

```mermaid
sequenceDiagram
    actor DN
    participant CPLQG as Cổng PLQG
    participant API as PM API
    participant DB

    DN->>CPLQG: Nhập từ khóa
    CPLQG->>API: GET /tv-nhanh/search?kw=...
    API->>API: Check keyword ≥2 ký tự<br/>ERR-TVN-TK-01
    API->>DB: Full-text search<br/>WHERE tt=DA_DUYET AND hieu_luc=true<br/>BR-DATA-08
    DB-->>API: Kết quả + relevance_score
    API->>API: Sort DESC<br/>Phân trang
    API-->>CPLQG: Top results
    CPLQG-->>DN: Hiển thị
```

---

## 6. Bổ sung kho TỰ ĐỘNG từ FR-02

```mermaid
sequenceDiagram
    participant HoiDap as FR-02
    participant KQA as FR-13 Kho Q&A
    participant DB

    HoiDap->>HoiDap: Phản hồi → CHO_PHE_DUYET
    HoiDap->>HoiDap: CB PD duyệt → DA_DUYET
    HoiDap->>KQA: Trigger: push Q&A
    KQA->>DB: INSERT KHO_CAU_HOI<br/>nguồn=TU_DONG<br/>tt=DA_DUYET (bypass duyệt)
    KQA->>DB: Lập chỉ mục full-text
```

---

## 7. Error codes

| Mã | Mô tả |
|---|---|
| ERR-KHO-01 | Câu hỏi bắt buộc |
| ERR-TVN-01 | Kho Q&A rỗng |
| ERR-TVN-TK-01 | Từ khóa < 2 ký tự |
| ERR-DG-TVN-01 | Điểm ngoài 1-5 |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-02** | HĐ DA_DUYET → auto bổ sung Q&A (BR-FLOW-10). |
| **FR-16** | Có thể expose search qua API trực tiếp cho consumer khác. |
| **FR-10** | UC-99 lĩnh vực PL để tag câu hỏi. |
