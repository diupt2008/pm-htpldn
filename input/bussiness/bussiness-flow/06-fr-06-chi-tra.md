# 06 · FR-06 Chi trả Chi phí Tư vấn

> **Tài liệu gốc**: `docs/requirements/fr-06-chi-tra.md` · **UC range**: UC68-UC80.
> **Vai trò**: Xử lý hồ sơ đề nghị thanh toán chi phí HTPL — tiếp nhận DVC, tự động tính mức hỗ trợ theo quy mô DN, thẩm định, phê duyệt, thanh toán.
> **Nền tảng pháp lý**: NĐ18/2026 (mức hỗ trợ chi phí) · Mẫu 01 NĐ55/2019.

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| DN | Nộp HS đề nghị thanh toán qua DVC |
| HT TTHC BTP (DVC/LGSP) | Inbound qua JWT + mTLS |
| CB NV TW/BN/ĐP | Kiểm tra, đánh giá, thẩm định, trình duyệt, cập nhật thanh toán |
| CB PD TW/BN/ĐP | Phê duyệt hồ sơ (cùng cấp) |
| TVV | Nhận thông báo KQ phê duyệt & thanh toán |

---

## 2. State Machine SM-CHITRA (10 trạng thái)

```mermaid
stateDiagram-v2
    [*] --> CHO_TIEP_NHAN: DN nộp qua DVC<br/>(Mẫu 01, 18 trường)
    CHO_TIEP_NHAN --> DANG_KIEM_TRA: CB NV tiếp nhận
    CHO_TIEP_NHAN --> HUY: DN rút HS
    DANG_KIEM_TRA --> DANG_DANH_GIA: Checklist ĐẠT
    DANG_KIEM_TRA --> YEU_CAU_BO_SUNG: Thiếu
    DANG_KIEM_TRA --> TU_CHOI: Không đạt
    YEU_CAU_BO_SUNG --> DANG_KIEM_TRA: DN bổ sung<br/>max 3 lần
    YEU_CAU_BO_SUNG --> TU_CHOI: Quá N ngày LV auto
    DANG_DANH_GIA --> DANG_THAM_DINH: CB NV tính mức HT<br/>BR-CALC-01,02
    DANG_THAM_DINH --> CHO_PHE_DUYET: Trình duyệt
    CHO_PHE_DUYET --> DA_DUYET: CB PD duyệt<br/>cùng cấp
    CHO_PHE_DUYET --> DANG_THAM_DINH: CB PD từ chối<br/>có lý do
    DA_DUYET --> DA_THANH_TOAN: Cập nhật thanh toán<br/>ghi số thực trả
    DA_THANH_TOAN --> [*]
    TU_CHOI --> [*]
    HUY --> [*]
```

---

## 3. Luồng nghiệp vụ End-to-End

```mermaid
flowchart TB
    subgraph INBOUND["1. Tiếp nhận DVC (UC-68)"]
        A1[DN nộp HS qua DVC<br/>Mẫu 01 NĐ55 18 trường]
        A2[LGSP forward<br/>JWT + mTLS<br/>BR-AUTH-09]
        A3[Validate 18 trường + MST]
        A4[Auto-tạo DN nếu chưa có]
        A5[Auto-gen CT-YYYYMMDD-SEQ<br/>tt=CHO_TIEP_NHAN<br/>SLA deadline]
    end

    subgraph CHECK["2. Kiểm tra HS (UC-70)"]
        B1[CB NV tiếp nhận → DANG_KIEM_TRA]
        B2[Checklist 18 trường Mẫu 01]
        B3{KQ KT?}
        B4[DANG_DANH_GIA]
        B5[YEU_CAU_BO_SUNG<br/>ghi chú bắt buộc]
        B6[TU_CHOI]
    end

    subgraph CALC["3. Đánh giá + tính tiền (UC-72)"]
        C1[Xác minh quy mô DN<br/>theo Luật DNNVV]
        C2[Tính mức % HT<br/>BR-CALC-01]
        C3[Kiểm tra trần năm<br/>đã chi trong năm]
        C4["Số tiền = MIN(đề_nghị, phí×%, trần−đã_chi)<br/>BR-CALC-02"]
        C5[INSERT DANH_GIA_HO_SO<br/>tt=CHO_THAM_DINH]
    end

    subgraph VERIFY["4. Thẩm định (UC-76)"]
        D1[CB NV xem chứng từ]
        D2{KQ TĐ?}
        D3[DA_THAM_DINH]
        D4[Yêu cầu BS DN/TVV]
        D5[TU_CHOI_THAM_DINH<br/>nhận xét bắt buộc]
    end

    subgraph APPROVE["5. Phê duyệt (UC-78,79)"]
        E1[CB NV trình → CHO_PHE_DUYET]
        E2[CB PD cùng cấp duyệt]
        E3[INSERT PHE_DUYET_CHI_TRA<br/>tt=DA_DUYET]
        E4[TU_CHOI lý do bắt buộc]
    end

    subgraph PAY["6. Thanh toán (UC-80)"]
        F1[CB NV cập nhật số thực trả<br/>≤ số đã duyệt]
        F2[UPDATE so_tien_thuc_tra<br/>ngay_thanh_toan<br/>biên nhận]
        F3[tt=DA_THANH_TOAN]
        F4[Thông báo TVV + DN<br/>+ LGSP UC-71]
    end

    INBOUND --> CHECK
    B3 -->|ĐẠT| B4
    B3 -->|Thiếu| B5
    B3 -->|Không đạt| B6
    B5 -->|DN bổ sung| B2
    B4 --> CALC
    CALC --> VERIFY
    D2 -->|ĐẠT| D3
    D2 -->|Bổ sung| D4
    D2 -->|Không đạt| D5
    D3 --> APPROVE
    E2 -->|Duyệt| E3
    E2 -->|Từ chối| E4
    E4 --> D3
    E3 --> PAY
```

---

## 4. Công thức tính (BR-CALC-01, BR-CALC-02)

### BR-CALC-01: Mức hỗ trợ theo quy mô DN (NĐ18/2026)

| Quy mô DN (NĐ39/2018) | Mức hỗ trợ | Trần chi phí/năm |
|---|---|---|
| **Siêu nhỏ** | 100% | 3.000.000 VNĐ |
| **Nhỏ** | 30% (tối đa) | 5.000.000 VNĐ |
| **Vừa** | 10% (tối đa) | 10.000.000 VNĐ |

> **Lưu ý**: Địa phương có thể quyết định trần riêng (cấu hình ở UC-10_).

### BR-CALC-02: Công thức tiền được duyệt

```
so_tien_duoc_duyet = MIN(
    so_tien_de_nghi,
    phi_tu_van × muc_ho_tro_%,
    tran_ho_tro_nam − da_chi_trong_nam
)
```

**Edge cases**:
- `phi_tu_van = 0` → `so_tien_duoc_ho_tro = 0` (vẫn cho duyệt).
- Hết trần năm → cảnh báo + cho xử lý tiếp (duyệt = phần còn lại).

---

## 5. Sequence: DVC inbound → thanh toán

```mermaid
sequenceDiagram
    actor DN as Doanh nghiệp
    participant DVC as DVC BTP
    participant LGSP as LGSP
    participant API as PM API
    participant DB as Database
    actor CBNV as CB NV
    actor CBPD as CB PD
    actor TVV as TVV

    DN->>DVC: Nộp HS thanh toán<br/>Mẫu 01
    DVC->>LGSP: POST JWT+mTLS
    LGSP->>API: Forward
    API->>API: Verify JWT (BR-AUTH-09)
    API->>API: Validate 18 trường + MST
    API->>DB: INSERT HO_SO_CHI_TRA<br/>mã CT-YYYYMMDD-SEQ<br/>tt=CHO_TIEP_NHAN<br/>SLA deadline
    API->>CBNV: Thông báo
    API-->>DVC: 200 + mã HS

    CBNV->>API: Tiếp nhận + kiểm tra (UC-70)
    alt ĐẠT
        CBNV->>API: Đánh giá (UC-72)
        API->>DB: Tính tiền BR-CALC-01,02<br/>INSERT DANH_GIA_HO_SO<br/>tt=CHO_THAM_DINH
        CBNV->>API: Thẩm định (UC-76)
        API->>DB: INSERT THAM_DINH_HO_SO<br/>tt=DA_THAM_DINH
        CBNV->>API: Trình duyệt (UC-78)
        API->>CBPD: Thông báo
        CBPD->>API: Duyệt (UC-79)<br/>cùng cấp BR-AUTH-05
        API->>DB: tt=DA_DUYET
        CBNV->>API: Cập nhật thanh toán (UC-80)
        API->>DB: so_tien_thuc_tra ≤ so_tien_duoc_duyet<br/>tt=DA_THANH_TOAN
        API->>TVV: Thông báo
        API->>DN: Thông báo (UC-71)<br/>LGSP + email
    else Không đạt / bổ sung
        API->>DVC: Thông báo KQ<br/>retry 3×30s BR-RETRY-01
    end
```

---

## 6. Notify DN qua LGSP (UC-71)

```mermaid
flowchart LR
    A[Sau UC-70] --> B[Build payload<br/>mã HS DVC + kết quả + ghi chú]
    B --> C[POST LGSP<br/>→ HT TTHC BTP]
    C --> D{Success?}
    D -->|OK| E[Mark "Đã thông báo"]
    D -->|Timeout| F[Retry 3 lần × 30s<br/>BR-RETRY-01]
    F --> G{Vẫn fail?}
    G -->|Có| H[Log + cảnh báo CB NV<br/>ERR-CT-LGSP-01]
    G -->|OK| E
```

---

## 7. Edge cases & Auto-reject (BR-EC-16)

- **Quá hạn bổ sung**: Cron job — `elapsed > cau_hinh_sla.bo_sung_timeout` → tt=TU_CHOI.
- **Max 3 lần bổ sung**: Đếm `counter_yeu_cau_bs`, ≥3 → TU_CHOI auto.
- **Số thực trả > duyệt**: ERR-CT-TT-02 (chặn validator).

---

## 8. Error codes

| Mã | Mô tả |
|---|---|
| ERR-CT-AUTH-01 | JWT không hợp lệ (401) |
| ERR-CT-02 | Trùng mã HS DVC (409) |
| ERR-CT-DG-02 | Quy mô DN không hợp lệ |
| ERR-CT-PD-03 | Số tiền duyệt bắt buộc |
| ERR-CT-TT-02 | Số tiền thực trả > duyệt |

---

## 9. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-07 DN** | Tra quy mô DN (siêu nhỏ/nhỏ/vừa) để áp mức % và trần năm. |
| **FR-05 VV** | HS Chi trả liên kết `vu_viec_id` (VV phải HOAN_THANH mới thanh toán). |
| **FR-14 HĐ TV** | Số thực trả cập nhật tiến độ thanh toán của HĐ tư vấn. |
| **FR-10** | UC-107 danh mục HS đề nghị thanh toán. |
| **FR-11** | UC-138/139/140/141/142 báo cáo chi phí theo chiều. |
