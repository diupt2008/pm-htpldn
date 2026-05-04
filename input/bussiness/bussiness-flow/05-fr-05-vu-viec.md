# 05 · FR-05 Quản lý Vụ việc Trợ giúp Pháp lý (VV HTPL)

> **Tài liệu gốc**: `docs/requirements/fr-05-vu-viec.md` · **UC range**: UC51-UC67 + 1 new + 1 cross-cutting.
> **Vai trò**: TRUNG TÂM NGHIỆP VỤ — xử lý vụ việc TGPL từ tiếp nhận đa kênh → phân công → tư vấn → phê duyệt → hoàn thành → đánh giá.
> **Nền tảng pháp lý**: NĐ55/2019 Điều 9 (SLA 10 ngày LV) · Điều 4 (ưu tiên phân công).

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| DN | Gửi HS YC HTPL qua Cổng PLQG / Chuyên trang |
| Hệ thống DVC (LGSP) | Inbound HS qua LGSP |
| Hệ thống khác | Inbound HS qua REST JSON |
| CB NV TW/BN/ĐP | Tiếp nhận · Kiểm tra · Phân công · Trình duyệt · Cập nhật KQ · Đánh giá |
| NHT | Xác nhận tham gia · Cập nhật KQ hỗ trợ |
| CB PD TW/BN/ĐP | Phê duyệt hồ sơ (cùng cấp BR-AUTH-05) |
| QTHT | Cấu hình quy trình, SLA |
| Hệ thống (Cron) | Cập nhật mức cảnh báo SLA 30 phút |

---

## 2. State Machine SM-VUVIEC (12 trạng thái)

```mermaid
stateDiagram-v2
    [*] --> MOI_TAO: DVC/HT khác tạo
    MOI_TAO --> CHO_TIEP_NHAN: Auto / CB NV xử lý
    [*] --> CHO_TIEP_NHAN: DVC/HT/Trực tiếp
    CHO_TIEP_NHAN --> DA_TIEP_NHAN: CB NV tiếp nhận<br/>cùng đơn vị
    DA_TIEP_NHAN --> DANG_KIEM_TRA: CB NV kiểm tra 6 hạng mục Mẫu 01
    DANG_KIEM_TRA --> DA_PHAN_CONG: Đạt + chọn NHT
    DANG_KIEM_TRA --> YEU_CAU_BO_SUNG: Thiếu HS
    DANG_KIEM_TRA --> TU_CHOI: Không đạt
    YEU_CAU_BO_SUNG --> DANG_KIEM_TRA: DN bổ sung<br/>max 3 lần
    YEU_CAU_BO_SUNG --> TU_CHOI: Quá hạn auto-reject
    DA_PHAN_CONG --> DANG_XU_LY: NHT xác nhận
    DA_PHAN_CONG --> DA_TIEP_NHAN: NHT từ chối<br/>(có lý do)
    DA_PHAN_CONG --> DA_TIEP_NHAN: Quá 3 ngày LV<br/>NHT không xác nhận
    DANG_XU_LY --> CHO_PHE_DUYET: CB NV trình<br/>(NHT đã có KQ)
    CHO_PHE_DUYET --> DA_DUYET: CB PD duyệt<br/>cùng cấp
    CHO_PHE_DUYET --> DANG_XU_LY: CB PD từ chối<br/>(có lý do)
    DA_DUYET --> HOAN_THANH: CB NV cập nhật KQ cuối
    HOAN_THANH --> DA_DANH_GIA: CB NV/DN đánh giá<br/>(3 điểm 0-10)
    TU_CHOI --> DA_TIEP_NHAN: QTHT override
    DA_DANH_GIA --> [*]
```

---

## 3. Luồng End-to-End: Từ DN gửi YC → Hoàn thành → Đánh giá

```mermaid
flowchart TB
    subgraph CHANNELS["1. Tiếp nhận đa kênh"]
        C1[DN qua Chuyên trang<br/>UC-52<br/>POST trực tiếp] 
        C2[DVC/LGSP inbound<br/>UC-53<br/>JWT + JSON Mẫu 01]
        C3[HT khác API<br/>UC-55<br/>REST JSON + API key]
        C4[CB NV nhập thủ công<br/>UC-54<br/>Auto-tạo DN nếu chưa có]
    end

    C1 & C2 & C3 & C4 --> AUTO{Auto-gen mã<br/>VV-TINH-YYYYMMDD-SEQ}
    AUTO --> TT[tt=CHO_TIEP_NHAN<br/>Tính SLA 10 ngày LV]

    TT --> TN[UC-12 CB NV tiếp nhận<br/>→ DA_TIEP_NHAN]
    TN --> KT[UC-56 Kiểm tra 6 hạng mục Mẫu 01 NĐ55<br/>→ DANG_KIEM_TRA]
    KT --> KD{Kết quả KT?}
    KD -->|ĐẠT| PC[UC-59 Phân công NHT<br/>→ DA_PHAN_CONG]
    KD -->|Thiếu| YC[YEU_CAU_BO_SUNG<br/>max 3 lần]
    KD -->|Không đạt| TC1[TU_CHOI]
    YC -->|DN bổ sung| KT
    YC -->|Quá hạn| TC1

    PC --> XN[UC-60 NHT xác nhận]
    XN -->|Chấp nhận| XL[DANG_XU_LY]
    XN -->|Từ chối| PC2[Phân công lại]
    XN -->|Quá 3 ngày LV không XN| PC2

    XL --> NHT_KQ[UC-65 NHT cập nhật KQ<br/>KET_QUA_VU_VIEC + file]
    NHT_KQ --> TR[UC-61 CB NV trình<br/>→ CHO_PHE_DUYET]
    TR --> PD[UC-63 CB PD phê duyệt<br/>cùng cấp]
    PD -->|Duyệt| DD[DA_DUYET]
    PD -->|Từ chối| XL
    DD --> HT[UC-66 CB NV cập nhật KQ cuối<br/>→ HOAN_THANH]
    HT --> TB[UC-62 Thông báo DN<br/>in-app + email + LGSP]
    TB --> DG[UC-67 Đánh giá 3 tiêu chí 0-10<br/>Chuyên môn · Thái độ · Đúng hạn<br/>→ DA_DANH_GIA]
    DG --> END([Cập nhật điểm TB TVV<br/>trigger BR-CALC-06])
```

---

## 4. Phân công với điểm ưu tiên (UC-59)

### Công thức điểm ưu tiên DN (BR-CALC-04, NĐ55/2019 Điều 4)

| Tiêu chí | Điểm |
|---|---|
| DN do phụ nữ làm chủ | +3 |
| DN có nhiều LĐ nữ | +2 |
| DN có ≥30% LĐ khuyết tật | +2 |
| FIFO (ngày tiếp nhận sớm hơn) | +1 |

```mermaid
flowchart LR
    A[Mở form phân công] --> B[Lấy TVV DANG_HOAT_DONG + đã công khai]
    B --> C[Filter theo<br/>lĩnh vực VV + địa bàn]
    C --> D[Tính điểm ưu tiên DN<br/>+3/+2/+2/+1]
    D --> E[Tính workload TVV<br/>COUNT VV đang xử lý]
    E --> F[Sort desc theo<br/>điểm DN → workload ASC]
    F --> G[Gợi ý TOP TVV]
    G --> H[CB NV chọn TVV]
    H --> I[INSERT PHAN_CONG_VU_VIEC<br/>UPDATE VV tt=DA_PHAN_CONG<br/>nguoi_ho_tro_id]
    I --> J[Thông báo NHT]
```

---

## 5. Kiểm tra 6 hạng mục Mẫu 01 NĐ55 (UC-56)

```mermaid
flowchart TB
    S[CB NV mở kiểm tra] --> LOAD[Tải checklist<br/>UC-106 danh mục HS đề nghị]
    LOAD --> I1[1. Thông tin DN]
    LOAD --> I2[2. Nội dung yêu cầu]
    LOAD --> I3[3. Lĩnh vực pháp lý]
    LOAD --> I4[4. Tài liệu chứng từ]
    LOAD --> I5[5. Chữ ký người đại diện]
    LOAD --> I6[6. Căn cứ pháp lý DN]
    I1 & I2 & I3 & I4 & I5 & I6 --> EV{Tổng kết luận?}
    EV -->|ĐẠT| OK[Cho phép phân công<br/>DA_PHAN_CONG]
    EV -->|BỔ SUNG| BS[YEU_CAU_BO_SUNG<br/>ERR-KT-02 Lý do]
    EV -->|KHÔNG ĐẠT| TC[TU_CHOI]
    BS --> CNT[counter BS++<br/>Max 3 lần]
    CNT -->|>3| TC
```

---

## 6. Sequence: Tiếp nhận DVC (UC-53)

```mermaid
sequenceDiagram
    participant DVC as HT TTHC BTP
    participant LGSP as Trục LGSP
    participant API as PM API
    participant DB as Database
    actor CBNV as CB NV Sở TP

    DVC->>LGSP: POST HS YC HTPL + JWT
    LGSP->>API: Forward (trục nội bộ)
    API->>API: Validate JSON schema Mẫu 01
    API->>API: Check mã HS DVC unique (idempotent)
    alt Trùng
        API-->>LGSP: ERR-DVC-02 409
    else Hợp lệ
        API->>API: Mapping linh_vuc → DANH_MUC<br/>Auto-gen VV-TINH-YYYYMMDD-SEQ
        API->>DB: INSERT VU_VIEC<br/>tt=CHO_TIEP_NHAN, kenh=DVC
        API->>DB: Lưu file đính kèm
        API->>CBNV: Thông báo
        API-->>LGSP: 200 + mã VV
    end
```

---

## 7. SLA & Background Job (UC-CROSS-01)

- Default SLA: **10 ngày làm việc** (BR-SLA-01, NĐ55/2019 Điều 9).
- Job chạy mỗi 30 phút: tính % thời gian đã dùng → cập nhật cảnh báo 4 mức:

| Mức | Ngưỡng | Thông báo |
|---|---|---|
| BINH_THUONG | >50% còn lại | — |
| SAP_HET | ≤50% | Vàng + email CB NV |
| QUA_HAN | >100% | Đỏ + email CB NV + CB PD |
| QUA_HAN_NGHIEM_TRONG | >2x deadline | Đen + escalate |

---

## 8. Đánh giá VV (UC-67) → cập nhật TVV

```mermaid
flowchart LR
    A[VV ở HOAN_THANH] --> B[DN hoặc CB NV đánh giá<br/>3 tiêu chí 0-10]
    B --> C[INSERT DANH_GIA_VV<br/>diem_tong = AVG 3]
    C --> D[UPDATE VV tt=DA_DANH_GIA]
    D --> E[Trigger FR-IV-CROSS-01<br/>UPDATE TVV.diem_danh_gia_tb]
    E --> F[Audit log]
```

---

## 9. Quy trình cấu hình (UC-NEW-01)

QTHT định nghĩa quy trình:
- Bước (tên, thứ tự, SLA, điều kiện chuyển bước).
- **Versioning**: VV mới áp QT mới; VV đang chạy giữ QT cũ (không break hồ sơ đang chạy).

---

## 10. Error codes

| Mã | Mô tả |
|---|---|
| ERR-DVC-02 | HS đã tiếp nhận (409 idempotent) |
| ERR-INTG-02 | HS tồn tại (HT khác) |
| ERR-KT-02 | Lý do bổ sung bắt buộc |
| ERR-PC-02 | TVV đã vô hiệu hóa |
| ERR-XN-01 | NHT không được phân công |
| ERR-PD-03 | Lý do từ chối bắt buộc |

---

## 11. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-04 TVV** | UC-59 lấy danh sách TVV để phân công + update điểm đánh giá. |
| **FR-06 Chi trả** | Sau HOAN_THANH, DN có thể nộp HS thanh toán (DVC → FR-06). |
| **FR-07 DN** | UC-54 auto tạo DN nếu MST chưa có; UC-53/55 upsert DN. |
| **FR-08 Đánh giá** | VV HOAN_THANH → eligible cho đợt đánh giá 6 tháng/năm. |
| **FR-14 HĐ TV** | VV liên kết N:N với HĐ tư vấn (UC-159). |
| **FR-16** | UC-177/178 Share+Search VV (ẩn MST, địa chỉ chi tiết). |
| **FR-10 SLA** | UC-108 config SLA theo loại yêu cầu. |
