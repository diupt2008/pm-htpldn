# 08 · FR-08 Đánh giá Hiệu quả Hỗ trợ

> **Tài liệu gốc**: `docs/requirements/fr-08-danh-gia.md` · **UC range**: UC83-UC91.
> **Vai trò**: Đánh giá tổng thể hiệu quả HTPLDN định kỳ (6 tháng/năm), chấm điểm vụ việc theo bộ tiêu chí trọng số 100%, sinh báo cáo TT17/2025 (mẫu 21a/21b).
> **Nền tảng**: TT17/2025 · BR-LEGAL-08 (Sơ bộ 6 tháng + tròn năm, không đột xuất).

---

## 1. Actors

| Actor | Vai trò |
|---|---|
| CB NV TW/BN/ĐP | Lập KH, tiêu chí, chọn VV, phân công ĐG, nhập điểm, lập BC, trình |
| CB PD TW/BN/ĐP | Duyệt phân công, duyệt BC cuối (cùng cấp) |
| Người được phân công (CB NV/CG) | Nhập điểm từng VV, vai trò TRUONG_NHOM hoặc DANH_GIA_VIEN |

---

## 2. State Machine SM-DANHGIA

```mermaid
stateDiagram-v2
    [*] --> LAP_KE_HOACH: CB NV tạo đợt<br/>(6 tháng/năm BR-LEGAL-08)
    LAP_KE_HOACH --> PHAN_CONG: Đã có tiêu chí<br/>tổng TS = 100%
    PHAN_CONG --> CHO_DUYET_PC: CB NV trình
    CHO_DUYET_PC --> THUC_HIEN: CB PD duyệt<br/>(cùng cấp)
    CHO_DUYET_PC --> PHAN_CONG: CB PD từ chối<br/>lý do ≥10 ký tự
    THUC_HIEN --> DANG_DANH_GIA: Chọn VV + bắt đầu chấm
    DANG_DANH_GIA --> DA_DANH_GIA: Tất cả VV chấm xong
    DA_DANH_GIA --> BAO_CAO: CB NV lập BC<br/>mẫu TT17/2025 21a/21b
    BAO_CAO --> CHO_PHE_DUYET: CB NV trình
    CHO_PHE_DUYET --> HOAN_THANH: CB PD duyệt BC<br/>cùng cấp
    CHO_PHE_DUYET --> BAO_CAO: CB PD từ chối<br/>lý do ≥10 ký tự
    HOAN_THANH --> [*]
```

---

## 3. Luồng 9 bước end-to-end

```mermaid
flowchart TB
    S1[UC-83<br/>Lập KH đợt ĐG<br/>DG-YYYYMMDD-SEQ<br/>trạng thái NHAP]
    S2[UC-84<br/>Thiết lập tiêu chí<br/>Tổng TS = 100%<br/>BR-CALC-04]
    S3[UC-85<br/>Phân công ĐG viên<br/>≥1 TRUONG_NHOM<br/>Không trùng]
    S4[UC-86<br/>CB PD duyệt PC<br/>CHO_DUYET_PC → THUC_HIEN]
    S5[UC-87<br/>Chọn VV đã HOAN_THANH<br/>trong kỳ<br/>→ DANG_DANH_GIA]
    S6[UC-88<br/>Nhập điểm theo tiêu chí<br/>0 ≤ điểm ≤ max<br/>Điểm tổng = Σ điểm×TS/100]
    S7[UC-89<br/>Lập BC theo TT17/2025<br/>Mẫu 21a/21b<br/>CB NV edit nhận xét/kiến nghị]
    S8[UC-90<br/>Trình duyệt BC<br/>→ CHO_DUYET_BC]
    S9[UC-91<br/>CB PD duyệt BC cuối<br/>→ DA_DUYET_BC = HOAN_THANH]

    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9
```

---

## 4. Công thức điểm (BR-CALC-04)

```
điểm_tổng_VV = Σ (điểm_tiêu_chí_i × trọng_số_i / 100)
```

Ràng buộc:
- `0 ≤ điểm_i ≤ thang_diem_max` của tiêu chí
- Tổng trọng số ALL tiêu chí = 100% (cảnh báo nếu khác; cho phép lưu nháp)

---

## 5. Sequence đầy đủ

```mermaid
sequenceDiagram
    actor CBNV as CB NV
    participant API
    participant DB
    actor CBPD as CB PD
    actor DGV as ĐG viên

    CBNV->>API: Tạo đợt (UC-83)
    API->>DB: INSERT DOT_DANH_GIA<br/>tt=LAP_KE_HOACH
    CBNV->>API: Thiết lập tiêu chí (UC-84)
    API->>API: Check Σ TS = 100%<br/>BR-CALC-04
    CBNV->>API: Phân công (UC-85)
    API->>DB: INSERT PHAN_CONG_DANH_GIA<br/>tt=CHO_DUYET_PC
    API->>CBPD: Thông báo
    CBPD->>API: Duyệt PC (UC-86)<br/>cùng cấp
    API->>DB: tt=THUC_HIEN
    CBNV->>API: Chọn VV (UC-87)<br/>HOAN_THANH trong kỳ
    API->>DB: INSERT VU_VIEC_DANH_GIA<br/>tt=DANG_DANH_GIA
    API->>DGV: Thông báo chấm
    loop Mỗi ĐG viên
        DGV->>API: Nhập điểm (UC-88)
        API->>API: Tính điểm tổng<br/>lưu nháp
    end
    Note over API: Khi tất cả VV đã chấm → DA_DANH_GIA
    CBNV->>API: Lập BC (UC-89)<br/>Mẫu 21a/21b TT17/2025
    API->>DB: INSERT BAO_CAO_DANH_GIA<br/>tt=DA_LAP_BC
    CBNV->>API: Trình BC (UC-90)
    API->>CBPD: Thông báo
    CBPD->>API: Duyệt BC (UC-91)
    API->>DB: tt=HOAN_THANH
```

---

## 6. Quy tắc quan trọng

- **Không có đánh giá đột xuất** — BR-LEGAL-08, chỉ 6 tháng + năm.
- **Cùng cấp duyệt** — UC-86, UC-91 (BR-AUTH-05).
- **Tổng trọng số 100%** — cảnh báo WRN-DG-TC-01 nếu khác; hard-block khi chấm điểm ERR-DG-TC-01.
- **VV thuộc đợt khác** — cảnh báo WRN-DG-VV-01 nhưng vẫn cho chọn.

---

## 7. Error codes

| Mã | Mô tả |
|---|---|
| ERR-DG-TC-01 | Tổng trọng số != 100% (UC-84, UC-88) |
| ERR-DG-PC-02 | Cần ≥1 TRUONG_NHOM |
| ERR-DG-PD-02 | Lý do từ chối ≥10 ký tự |
| WRN-DG-VV-01 | Không có VV HOAN_THANH trong kỳ |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-05 VV** | VV HOAN_THANH trong kỳ → eligible cho đợt ĐG. |
| **FR-10** | UC-109 danh mục tiêu chí đánh giá (trọng số). |
| **FR-11** | UC-132 Báo cáo đánh giá hiệu quả HTPL (dùng lại đợt ĐG). |
| **FR-16** | UC-179/180 Share+Search DOT_DANH_GIA (chỉ DA_DUYET_BC). |
| **Dashboard FR-01** | UC-8 biểu đồ kết hợp cột + đường hiệu quả HTPL. |
