# 04 · FR-04 Quản lý Chuyên gia, Tư vấn viên

> **Tài liệu gốc**: `docs/requirements/fr-04-chuyen-gia-tvv.md` · **UC range**: UC39-UC50 + 1 trigger.
> **Vai trò**: Quản lý toàn bộ mạng lưới nhân sự tư vấn pháp luật (NHT, TVV, Chuyên gia) — đăng ký, thẩm định 4 nhóm tiêu chí, phê duyệt, công khai MLTV, đánh giá, xử lý trạng thái.
> **Nền tảng pháp lý**: NĐ77/2008/NĐ-CP — Quản lý tư vấn pháp luật.

---

## 1. Actors & phạm vi

| Actor | Quyền | Phạm vi |
|---|---|---|
| NHT | Đăng ký tham gia, cập nhật hồ sơ cá nhân | Chỉ hồ sơ của mình |
| TVV / CG | Xem hồ sơ, đánh giá | Chỉ dữ liệu được phân công |
| CB NV TW/BN/ĐP | Quản lý MLTV, thẩm định, công khai | Theo đơn vị |
| CB PD TW/BN/ĐP | Phê duyệt TVV | Cùng cấp (BR-AUTH-05) |
| DN | Đánh giá TVV qua Cổng PLQG | Chỉ TVV đã hỗ trợ mình |
| Hệ thống | Trigger tính điểm đánh giá TB | — |

---

## 2. State Machine SM-TVV

```mermaid
stateDiagram-v2
    [*] --> MOI_DANG_KY: NHT nộp HS (UC-41)
    MOI_DANG_KY --> CHO_THAM_DINH: CB NV tiếp nhận<br/>(đủ giấy tờ)
    CHO_THAM_DINH --> DANG_THAM_DINH: CB NV bắt đầu TĐ
    DANG_THAM_DINH --> YEU_CAU_BO_SUNG: Thiếu thông tin
    YEU_CAU_BO_SUNG --> DANG_THAM_DINH: NHT bổ sung
    DANG_THAM_DINH --> CHO_PHE_DUYET: Thẩm định đạt<br/>4 nhóm ĐẠT
    DANG_THAM_DINH --> TU_CHOI: Pháp lý không đạt
    CHO_PHE_DUYET --> DANG_HOAT_DONG: CB PD duyệt<br/>(cùng cấp)
    CHO_PHE_DUYET --> TU_CHOI: CB PD từ chối<br/>(lý do ≥10 ký tự)
    TU_CHOI --> CHO_THAM_DINH: NHT nộp lại
    DANG_HOAT_DONG --> TAM_DUNG: CB NV tạm dừng
    TAM_DUNG --> DANG_HOAT_DONG: Kích hoạt lại
    DANG_HOAT_DONG --> VO_HIEU_HOA: Vô hiệu hóa<br/>(không có VV/HĐ)
    TAM_DUNG --> VO_HIEU_HOA: Vô hiệu hóa
    VO_HIEU_HOA --> DANG_HOAT_DONG: Khôi phục
    VO_HIEU_HOA --> [*]
```

---

## 3. Thẩm định 4 nhóm tiêu chí (UC-44)

```mermaid
flowchart TB
    S[CB NV bắt đầu TĐ hồ sơ TVV]
    S --> UC[Chuyển DANG_THAM_DINH]
    UC --> G1[Nhóm 1: PHÁP LÝ<br/>Bằng cấp, thẻ hành nghề, tiền án]
    UC --> G2[Nhóm 2: NĂNG LỰC<br/>Kinh nghiệm, lĩnh vực chuyên môn]
    UC --> G3[Nhóm 3: HIỆU QUẢ<br/>Lịch sử hỗ trợ, điểm ĐG TB]
    UC --> G4[Nhóm 4: MẠNG LƯỚI<br/>Tổ chức tư vấn, phạm vi]
    G1 --> D1{Pháp lý ĐẠT?}
    D1 -->|KHÔNG| OUT1[Kết luận KHÔNG ĐẠT<br/>ERR-TD-02]
    D1 -->|CÓ| EV[Chấm 3 nhóm còn lại]
    G2 & G3 & G4 --> EV
    EV --> D2{Kết luận cuối?}
    D2 -->|ĐẠT| TR[Trình CB PD<br/>CHO_PHE_DUYET]
    D2 -->|BỔ SUNG| BS[YEU_CAU_BO_SUNG<br/>Lý do bắt buộc<br/>ERR-TD-03]
    D2 -->|KHÔNG ĐẠT| TC[TU_CHOI]
    OUT1 --> TC
    TR --> PD[CB PD duyệt UC-45]
    BS --> NHT[NHT bổ sung]
    NHT --> UC
```

---

## 4. Sequence: Đăng ký NHT → Hoạt động

```mermaid
sequenceDiagram
    actor NHT as NHT
    participant PM as PM HTPLDN
    actor CBNV as CB NV Sở TP
    actor CBPD as CB PD ĐP
    actor DN as Doanh nghiệp
    participant CPLQG as Cổng PLQG

    NHT->>PM: Đăng ký tham gia MLTV (UC-41)<br/>Bằng cấp ≤10MB, CMND/CCCD unique
    PM->>PM: INSERT TU_VAN_VIEN tt=MOI_DANG_KY
    PM->>CBNV: Thông báo
    CBNV->>PM: Tiếp nhận → CHO_THAM_DINH
    CBNV->>PM: Thẩm định 4 nhóm (UC-44)
    alt Pháp lý chưa đạt
        PM-->>CBNV: ERR-TD-02 Không kết luận ĐẠT
    end
    CBNV->>PM: Kết luận ĐẠT → Trình CB PD
    PM->>CBPD: Thông báo CHO_PHE_DUYET
    CBPD->>PM: Duyệt (UC-45)
    PM->>PM: tt=DANG_HOAT_DONG<br/>Lưu ngày công nhận
    PM->>NHT: Thông báo
    CBNV->>PM: Công khai MLTV (UC-46)
    PM->>CPLQG: POST /tvv-public (API trực tiếp)
    alt Cổng lỗi
        PM-->>CBNV: WRN-CK-01 Thử lại
    end

    Note over DN,CPLQG: DN tìm TVV trên Cổng (UC-175/176)
    DN->>CPLQG: Xem TVV
    CPLQG->>PM: GET /tvv (đã lọc CMND/SĐT)
    DN->>CPLQG: Đánh giá TVV (UC-47)<br/>3 tiêu chí 0-10
    CPLQG->>PM: POST /danh-gia-tvv
    PM->>PM: INSERT DANH_GIA_TVV
    Note over PM: Trigger UC-CROSS-01<br/>AVG diem → cập nhật profile TVV
```

---

## 5. Điểm đánh giá TVV (BR-CALC-06)

- 3 tiêu chí mỗi đánh giá: **Chuyên môn · Thái độ · Đúng hạn** (0-10).
- Điểm tổng mỗi đánh giá = `AVG(3 điểm)`.
- Điểm TB TVV = `AVG(diem_tong)` over toàn bộ DANH_GIA_TVV → cập nhật `TU_VAN_VIEN.diem_danh_gia_tb` qua trigger UC-CROSS-01.

---

## 6. Chi tiết hồ sơ TVV (UC-43) — 4 Tab

| Tab | Nội dung |
|---|---|
| **Hồ sơ** | Thông tin cá nhân, CMND/CCCD, tổ chức chính + đối tác, bằng cấp |
| **Năng lực** | Lĩnh vực chuyên môn, kinh nghiệm (TVV_LINH_VUC) |
| **Lịch sử hỗ trợ** | VU_VIEC linked qua PHAN_CONG_VV: tổng, hoàn thành, điểm TB |
| **Đánh giá** | DANH_GIA_TVV: điểm từng tiêu chí + trung bình |

---

## 7. Vô hiệu hóa TVV (UC-50)

```mermaid
flowchart LR
    A[CB NV yêu cầu VHH] --> B{Đang có VV/HĐ?}
    B -->|Có| C[ERR-TT-02<br/>Từ chối]
    B -->|Không| D{Đang công khai?}
    D -->|Có| E[Gỡ Cổng PLQG]
    D -->|Không| F[Bỏ qua gỡ]
    E & F --> G[Cập nhật tt=VO_HIEU_HOA<br/>lý do bắt buộc]
    G --> H[Thông báo NHT]
    H --> I[Audit log]
```

---

## 8. Error codes

| Mã | Mô tả |
|---|---|
| ERR-TVV-02 | CMND/CCCD đã tồn tại |
| ERR-TVV-05 | TVV đang có VV chưa hoàn thành |
| ERR-TD-02 | Không kết luận ĐẠT khi Pháp lý chưa đạt |
| ERR-PD-03 | Lý do từ chối ≥10 ký tự |
| ERR-CK-01 | Chỉ TVV đang hoạt động mới được công khai |

---

## 9. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-05 Vụ việc** | UC-59 Phân công NHT dựa vào danh sách DANG_HOAT_DONG + lĩnh vực + workload. |
| **FR-05 Đánh giá VV** | UC-67 cập nhật điểm VV → Trigger UC-CROSS-01 update TB. |
| **FR-12 TVCS** | Gán Chuyên gia vào phiên tư vấn chuyên sâu. |
| **FR-16** | UC-175/176 Share+Search TVV (ẩn CMND/CCCD/SĐT - BR-SEC-01). |
| **FR-10** | UC-104 Tổ chức tư vấn · UC-99 Lĩnh vực PL. |
