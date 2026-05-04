# 03 · FR-03 Đào tạo, Tập huấn

> **Tài liệu gốc**: `docs/requirements/fr-03-dao-tao.md` · **UC range**: UC20-UC38 + 4 mới.
> **Vai trò**: Quản lý Chương trình đào tạo (CTDT) · Khóa học · Bài giảng · Ngân hàng câu hỏi · Đề kiểm tra · Đăng ký · Kết quả · Chứng nhận điện tử.

---

## 1. Actors

| Actor | Thao tác |
|---|---|
| CB NV TW/BN/ĐP | CRUD CTDT/Khóa/Bài giảng/Đề, lập KH đào tạo, công khai, ghi kết quả, cấp chứng nhận |
| CB PD TW/BN/ĐP | Phê duyệt KH đào tạo (cùng cấp), phê duyệt kết quả đào tạo |
| DN | Đăng ký tham gia, gửi đề xuất đào tạo, tải bài giảng công khai |
| NHT | Đăng ký tham gia, gửi đề xuất |
| Giảng viên / Trợ giảng | Dạy, chấm kết quả (được cấu hình) |

---

## 2. Entity Map

```mermaid
erDiagram
    CHUONG_TRINH_DAO_TAO ||--o{ KHOA_HOC : "chứa"
    KHOA_HOC ||--o{ DANG_KY_DAO_TAO : "có đăng ký"
    DANG_KY_DAO_TAO }o--|| HOC_VIEN : "của"
    KHOA_HOC ||--o{ BAI_GIANG : "sử dụng"
    KHOA_HOC ||--o{ DE_KIEM_TRA : "có đề"
    DE_KIEM_TRA ||--o{ DE_CAU_HOI : "có câu hỏi"
    DE_CAU_HOI }o--|| NGAN_HANG_CAU_HOI : "chọn từ"
    KHOA_HOC ||--o{ KET_QUA_HOC_TAP : "sinh KQ"
    KET_QUA_HOC_TAP }o--|| HOC_VIEN : "của"
    KET_QUA_HOC_TAP ||--o| CHUNG_NHAN : "cấp"
    KHOA_HOC }o--o{ GIANG_VIEN : "phân công"
    DE_XUAT_DAO_TAO ||--|| HOC_VIEN : "từ DN/NHT"
    KE_HOACH_DAO_TAO ||--o{ KHOA_HOC : "gồm"
```

---

## 3. State Machine SM-KHOAHOC / SM-KHDT / SM-DE

```mermaid
stateDiagram-v2
    [*] --> NHAP: Thêm mới CTDT/KH/Đề
    NHAP --> CHO_DUYET: Gửi phê duyệt (AT-01)
    CHO_DUYET --> DA_DUYET: CB PD duyệt<br/>cùng cấp
    CHO_DUYET --> TU_CHOI: CB PD từ chối<br/>nhập lý do
    TU_CHOI --> NHAP: Chỉnh sửa & gửi lại
    DA_DUYET --> DA_CONG_KHAI: Công khai Cổng PLQG
    DA_CONG_KHAI --> DA_DUYET: Hủy công khai
    DA_CONG_KHAI --> DA_KET_THUC: Khi khóa hết hạn
    DA_KET_THUC --> CHO_DUYET_KQ: Trình kết quả (AT-02)
    CHO_DUYET_KQ --> HOAN_THANH: CB PD duyệt KQ
    CHO_DUYET_KQ --> DA_KET_THUC: CB PD từ chối KQ
    NHAP --> DA_PHAN_PHOI: (Đề kiểm tra)<br/>Map vào khóa + bài giảng
    HOAN_THANH --> [*]
```

---

## 4. Luồng nghiệp vụ chính: Tổ chức khóa đào tạo

```mermaid
flowchart TB
    S[CB NV tạo CTDT] --> K[Tạo Khóa học<br/>thuộc CTDT]
    K --> BG[Upload bài giảng<br/>Slide ≤20MB/PDF/URL YouTube]
    BG --> NH[Quản lý ngân hàng câu hỏi<br/>TN hoặc tự luận]
    NH --> DE[Tạo đề kiểm tra<br/>Random hoặc thủ công]
    DE --> MAP[Map đề ↔ khóa ↔ bài giảng<br/>UC-NEW-03]
    MAP --> KH[Lập KH đào tạo<br/>UC-33]
    KH --> T1[Trình phê duyệt KH]
    T1 --> D1{CB PD?}
    D1 -->|Duyệt| CK[Công khai lên Cổng PLQG<br/>UC-35]
    D1 -->|Từ chối| KH
    CK --> DK[DN/NHT đăng ký<br/>UC-23 hoặc Import Excel]
    DK --> D2{CB NV?}
    D2 -->|Duyệt đăng ký| HV[Học viên chính thức]
    D2 -->|Từ chối| END1[Thông báo DN]
    HV --> DH[Diễn ra khóa học]
    DH --> KT[Ghi kết quả kiểm tra<br/>UC-24/UC-36<br/>Điểm 0-10, import Excel]
    KT --> T2[Trình KQ]
    T2 --> D3{CB PD?}
    D3 -->|Duyệt KQ| CN[Cấp chứng nhận điện tử<br/>UC-38<br/>Mã CN-YYYY-SEQ, PDF]
    D3 -->|Từ chối| KT
    CN --> END2([Xuất file .docx/PDF ký số<br/>FR-III-20])
```

---

## 5. Đăng ký khóa học (UC-23)

```mermaid
sequenceDiagram
    actor DN as DN/NHT
    participant CPLQG as Cổng PLQG
    participant API as PM API
    participant CBNV as CB NV

    DN->>CPLQG: Xem khóa học đang mở
    CPLQG->>API: GET /khoa-hoc (UC-173)
    API-->>CPLQG: Danh sách khóa công khai

    DN->>CPLQG: Đăng ký khóa X
    CPLQG->>API: POST /dang-ky-dao-tao
    API->>API: Check SM-KHOAHOC = DA_CONG_KHAI<br/>Check chưa đăng ký trùng<br/>Check chỗ còn
    API->>API: INSERT DANG_KY_DAO_TAO<br/>tt=CHO_DUYET
    API->>CBNV: Thông báo

    alt Duyệt
        CBNV->>API: Duyệt (UC-22)
        API->>DN: Thông báo được duyệt
    else Từ chối
        CBNV->>API: Từ chối + lý do (BR-FLOW-04)
        API->>DN: Thông báo + lý do
    end

    alt Import Excel
        CBNV->>API: Upload file DN Đăng ký
        API->>API: Validate template → import từng dòng
        API-->>CBNV: Báo cáo: N thành công, M lỗi
    end
```

---

## 6. Cấp chứng nhận (UC-38)

```mermaid
flowchart LR
    A[Khóa học HOAN_THANH] --> B[Lọc học viên có KQ=ĐẠT]
    B --> C[Sinh số Chứng nhận<br/>CN-YYYY-SEQ]
    C --> D[INSERT CHUNG_NHAN]
    D --> E[Sinh PDF từ template]
    E --> F{Cấp hàng loạt?}
    F -->|Có| G[Batch cho toàn bộ HV đạt]
    F -->|Không| H[Cấp từng HV]
    G & H --> I[Audit log]
```

---

## 7. Error codes quan trọng

| Mã | Mô tả | UC |
|---|---|---|
| ERR-CTDT-03 | Không xóa CTDT đã có khóa | UC-20 |
| ERR-DK-DT-03 | Lớp đủ số lượng | UC-23 |
| ERR-KQ-01 | Điểm phải 0-10 | UC-24 |
| ERR-BG-01 | File >20MB | UC-26 |
| WRN-NHCH-01 | Câu hỏi đang dùng trong {N} đề | UC-28 |

---

## 8. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **FR-09** | CTDT có thể xuất file docx/PDF ký số từ thư viện biểu mẫu (FR-III-20). |
| **FR-16** | UC-173 API Chia sẻ đào tạo · UC-174 API Tìm kiếm. Chỉ share khóa ở DA_CONG_KHAI (BR-INTG-07). |
| **FR-10** | Danh mục loại hình đào tạo · UC-108 SLA đào tạo. |
