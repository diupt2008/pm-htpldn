# 15 · FR-15 Chương trình HTPLDN

> **Tài liệu gốc**: `docs/requirements/fr-15-ct-htpldn.md` · **UC range**: UC160-UC170.
> **Vai trò**: Quản lý toàn vòng đời CT hỗ trợ pháp lý — kế hoạch → phê duyệt → công bố → thực hiện → báo cáo kết quả theo kỳ → ĐP/BN gửi TW tổng hợp (BR-FLOW-08). Hai state machine: **SM-KH-CTHTPL** (kế hoạch) và **SM-DOT-BC** (đợt báo cáo).

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | Tạo CT, trình duyệt, công bố, lập BC, gửi TW tổng hợp |
| CB PD TW/BN/ĐP | Phê duyệt CT, phê duyệt BC KQ (cùng cấp BR-AUTH-05) |
| CB NV TW | Tổng hợp BC từ BN + ĐP (UC-168) |
| Cổng PLQG | Nhận API `POST /ct-htpl` công bố/hủy (BR-FLOW-05) |

---

## 2. State Machine SM-KH-CTHTPL (Kế hoạch CT)

```mermaid
stateDiagram-v2
    [*] --> DU_THAO: CB NV tạo CT
    DU_THAO --> CHO_PHE_DUYET: CB NV trình
    CHO_PHE_DUYET --> DA_DUYET: CB PD duyệt<br/>(cùng cấp)
    CHO_PHE_DUYET --> DU_THAO: CB PD từ chối<br/>(có lý do BR-FLOW-04)
    DA_DUYET --> DA_CONG_BO: CB NV công bố<br/>(API → Cổng PLQG)
    DA_CONG_BO --> DA_DUYET: CB NV hủy công bố<br/>(gỡ khỏi Cổng)
    DA_DUYET --> DANG_THUC_HIEN: CB NV kích hoạt
    DA_CONG_BO --> DANG_THUC_HIEN: CB NV kích hoạt
    DANG_THUC_HIEN --> HOAN_THANH: CB NV hoàn thành
    DANG_THUC_HIEN --> TAM_DUNG: CB NV tạm dừng<br/>(có lý do)
    TAM_DUNG --> DANG_THUC_HIEN: CB NV tiếp tục
    DU_THAO --> HUY: CB NV hủy
    CHO_PHE_DUYET --> HUY: CB NV rút trình<br/>(người tạo)
    HOAN_THANH --> [*]
    HUY --> [*]
```

---

## 3. State Machine SM-DOT-BC (Đợt báo cáo CT)

```mermaid
stateDiagram-v2
    [*] --> TAO_DOT: CB NV tạo đợt<br/>(CT ở DANG_THUC_HIEN/HOAN_THANH)
    TAO_DOT --> DANG_LAP_BC: CB NV bắt đầu lập
    DANG_LAP_BC --> CHO_DUYET_KQ: CB NV trình KQ<br/>(BC đầy đủ)
    CHO_DUYET_KQ --> DA_DUYET_KQ: CB PD duyệt KQ<br/>(cùng cấp)
    CHO_DUYET_KQ --> DANG_LAP_BC: CB PD từ chối<br/>(BR-FLOW-04)
    DA_DUYET_KQ --> DA_GUI_TW: CB NV BN/ĐP gửi TW<br/>(BR-FLOW-08)
    DA_GUI_TW --> DA_TONG_HOP: CB NV TW tổng hợp
    DA_TONG_HOP --> [*]
```

---

## 4. Luồng chính: CT kế hoạch → công bố

```mermaid
flowchart TB
    A[CB NV tạo CT<br/>tt=DU_THAO] --> B{Đủ info?}
    B -->|Không| E1[ERR-XI-01-01]
    B -->|OK| C[Lưu nháp]
    C --> D[CB NV trình<br/>UC-162]
    D --> E{CT ở DU_THAO?}
    E -->|Không| E3[ERR-XI-03-01]
    E -->|OK| F[tt=CHO_PHE_DUYET<br/>Gửi thông báo CB PD]
    F --> G[CB PD xem<br/>UC-163]
    G --> H{Duyệt?}
    H -->|Duyệt| I[tt=DA_DUYET]
    H -->|Từ chối| J[tt=DU_THAO + lý do<br/>BR-FLOW-04]
    I --> K[CB NV công bố<br/>UC-164]
    K --> L[tt=DA_CONG_BO<br/>POST Cổng PLQG<br/>BR-FLOW-05]
    L --> M{API OK?}
    M -->|Lỗi| E5[ERR-XI-05-02]
    M -->|OK| N[Audit PUBLISH]
    N --> O[Kích hoạt → DANG_THUC_HIEN]
    O --> P[HOAN_THANH]
```

---

## 5. Luồng báo cáo theo kỳ (UC-165..170)

```mermaid
flowchart TB
    subgraph DOT["Tạo đợt BC (UC-169)"]
        D1[CB NV tạo đợt<br/>CT ở DANG_THUC_HIEN/HOAN_THANH]
        D2[tt=TAO_DOT]
        D3{Trùng kỳ?}
        D1 --> D3
        D3 -->|Có| E1[ERR-XI-05a-02]
        D3 -->|Không| D2
    end

    subgraph LAP["Lập BC (UC-165)"]
        L1[Form TT17/2025<br/>21a/21b]
        L2[Auto-fill số liệu HT]
        L3[CB NV điền + lưu]
        L1 --> L2 --> L3
    end

    subgraph TRINH["Trình KQ (UC-166)"]
        T1[tt BC=CHO_PHE_DUYET<br/>tt Đợt=CHO_DUYET_KQ]
    end

    subgraph PD["Duyệt KQ (UC-170)"]
        P1{CB PD duyệt?}
        P2[tt Đợt=DA_DUYET_KQ<br/>BC=DA_DUYET]
        P3[tt Đợt=DANG_LAP_BC<br/>BC=TU_CHOI + lý do]
        P1 -->|Duyệt cùng cấp| P2
        P1 -->|Từ chối| P3
    end

    subgraph GUI["ĐP/BN → TW (UC-167)"]
        G1{Là BN/ĐP?}
        G2[tt Đợt=DA_GUI_TW<br/>BR-FLOW-08]
        G3[ERR-XI-08-02<br/>TW không gửi]
        G1 -->|Có| G2
        G1 -->|Không| G3
    end

    subgraph TH["TW tổng hợp (UC-168)"]
        H1[CB NV TW chọn ≥1 BC]
        H2[HT gợi ý số liệu = Σ]
        H3[CB NV TW chỉnh + lưu<br/>loai=TONG_HOP_TW]
        H4[tt Đợt=DA_TONG_HOP]
        H5[Export TT17 Excel/Word]
        H1 --> H2 --> H3 --> H4 --> H5
    end

    DOT --> LAP --> TRINH --> PD
    PD --> GUI
    GUI --> TH
```

---

## 6. Sequence: ĐP gửi BC lên TW tổng hợp (BR-FLOW-08)

```mermaid
sequenceDiagram
    actor DP as CB NV ĐP/BN
    actor TW as CB NV TW
    participant API
    participant DB

    Note over DP: Đợt BC ở DA_DUYET_KQ
    DP->>API: POST /dot-bc/{id}/gui-tw
    API->>API: Check user thuộc BN/ĐP<br/>ERR-XI-08-02
    API->>DB: UPDATE tt=DA_GUI_TW
    API->>TW: Thông báo "Có BC cần tổng hợp"
    Note over TW: Nhiều ĐP gửi

    TW->>API: GET /bao-cao-ct?loai=KET_QUA&tt=DA_GUI_TW
    API-->>TW: List BC từ BN + ĐP
    TW->>API: POST /bao-cao-ct/tong-hop<br/>{bc_ids: [...]}
    API->>DB: Tính tổng số liệu tất cả cột<br/>BR-CALC (sum)
    API-->>TW: Form gợi ý số liệu
    TW->>API: PUT với nội dung đã chỉnh
    API->>DB: INSERT BAO_CAO_CT<br/>loai=TONG_HOP_TW
    API->>DB: UPDATE các đợt chọn → DA_TONG_HOP
    API->>API: Generate Excel/Word TT17
    API-->>TW: File download URL
```

---

## 7. BR-FLOW-08 — Phân cấp BC

```mermaid
flowchart TB
    DP1[ĐP 1<br/>Sở TP tỉnh A] --> TW
    DP2[ĐP 2<br/>Sở TP tỉnh B] --> TW
    DPN[... 63 ĐP] --> TW
    BN1[BN 1<br/>Bộ CT] --> TW
    BN2[... BN khác] --> TW
    TW[TW Tổng hợp<br/>BAO_CAO_CT loai=TONG_HOP_TW]
    TW --> O[Export Excel/Word TT17<br/>Gửi cấp trên/đăng Cổng]

    classDef dp fill:#388e3c,color:#fff;
    classDef bn fill:#1976d2,color:#fff;
    classDef tw fill:#d32f2f,color:#fff;
    class DP1,DP2,DPN dp;
    class BN1,BN2 bn;
    class TW tw;
```

---

## 8. Error codes

| Mã | Mô tả |
|---|---|
| ERR-XI-01-01 | Thiếu trường bắt buộc |
| ERR-XI-01-02 | Sửa CT không ở DU_THAO |
| ERR-XI-04-03 | CB PD khác cấp |
| ERR-XI-05-02 | Lỗi API Cổng PLQG |
| ERR-XI-05a-02 | Đợt BC trùng kỳ |
| ERR-XI-07a-03 | CB PD khác cấp (BC) |
| ERR-XI-08-02 | Chỉ BN/ĐP gửi TW |
| ERR-XI-09-02 | Chỉ TW tổng hợp |
| WRN-XI-09-01 | BC schema cũ cần convert |

---

## 9. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-16** | UC-185/186 Share+Search CT chỉ trả CT ở `DA_CONG_BO`. |
| **FR-11** | UC-143..146 báo cáo theo CT/đơn vị/lĩnh vực dùng chung data CHUONG_TRINH_HTPL. |
| **FR-10** | UC-101 danh mục loại CT hỗ trợ · UC-103 cây đơn vị cho BR-FLOW-08. |
| **FR-01** | Dashboard theo dõi CT đang thực hiện. |
