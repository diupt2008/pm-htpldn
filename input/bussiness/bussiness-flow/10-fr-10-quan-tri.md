# 10 · FR-10 Quản trị Hệ thống

> **Tài liệu gốc**: `docs/requirements/fr-10-quan-tri.md` · **UC range**: UC99-UC123.
> **Vai trò**: Nền tảng cấu hình — 15 loại danh mục · tài khoản/vai trò/phân quyền (RBAC + RLS) · SLA · SSO VNeID (3 Tier) · AUDIT_LOG.

---

## 1. Actors

| Actor | Quyền |
|---|---|
| QTHT | TOÀN BỘ: CRUD danh mục, TK, vai trò, phân quyền, SLA, VNeID |
| Mọi user | UC-118 Đăng nhập · UC-119 Đăng xuất |
| User chưa có TK | UC-120 Self-register (NHT/TVV/CG) |
| TVV/CG/NHT | UC-121 Đăng nhập VNeID · UC-122 Đăng xuất VNeID |
| Hệ thống (Cron) | UC-123 Đồng bộ TK VNeID |

---

## 2. Nhóm chức năng (25 UC)

```mermaid
flowchart LR
    subgraph DM["Danh mục (UC-99..117)"]
        D1[UC-99 Lĩnh vực PL]
        D2[UC-100 Loại HT]
        D3[UC-101 CT hỗ trợ]
        D4[UC-102 Tình trạng VV]
        D5[UC-103 Đơn vị QL<br/>cây TW→BN/ĐP]
        D6[UC-104 Tổ chức TV]
        D7[UC-105 Loại DN<br/>NĐ39/2018]
        D8[UC-106 HS đề nghị HT]
        D9[UC-107 HS thanh toán]
        D10[UC-109 Tiêu chí ĐG hiệu quả]
        D11[UC-110 Tiêu chí HS chi trả]
        D12[UC-111 Loại TK]
        D13[UC-116 Loại tiếp nhận]
        D14[UC-117 Kênh tiếp nhận]
    end
    subgraph CF["Cấu hình"]
        C1[UC-108 SLA<br/>BR-CALC-03]
    end
    subgraph AUTH["Phân quyền"]
        A1[UC-112 Vai trò]
        A2[UC-113 Tài khoản]
        A3[UC-114 Phân quyền data<br/>RLS]
        A4[UC-115 Phân quyền chức năng<br/>RBAC]
    end
    subgraph LOGIN["Xác thực"]
        L1[UC-118 Login Tier 1<br/>user/pass + TOTP]
        L2[UC-119 Logout]
        L3[UC-120 Self-register]
        L4[UC-121 Login VNeID Tier 3<br/>OIDC]
        L5[UC-122 Logout VNeID]
        L6[UC-123 Đồng bộ VNeID cron]
    end
```

---

## 3. Cây đơn vị phân cấp (UC-103, BR-AUTH-02)

```mermaid
flowchart TB
    TW[TW<br/>Cục BLDS&KT Bộ Tư pháp]
    TW --> BN1[BN<br/>Bộ Công thương]
    TW --> BN2[BN<br/>Bộ Y tế]
    TW --> DP1[ĐP<br/>Sở TP Hà Nội]
    TW --> DP2[ĐP<br/>Sở TP TP.HCM]
    TW --> DPN[... 63 Sở TP]

    classDef tw fill:#d32f2f,color:#fff;
    classDef bn fill:#1976d2,color:#fff;
    classDef dp fill:#388e3c,color:#fff;
    class TW tw;
    class BN1,BN2 bn;
    class DP1,DP2,DPN dp;
```

Ràng buộc (ERR-DV-05): KHÔNG tạo vòng lặp trong cây.

---

## 4. Phân quyền dữ liệu RLS (UC-114)

```mermaid
flowchart LR
    A[QTHT gán quyền data<br/>vai_tro_id × don_vi_id] --> B[Check BR-AUTH-03<br/>ngang cấp KHÔNG thấy nhau]
    A --> C[Check BR-AUTH-04<br/>cấp cha thấy cấp con]
    B --> D{OK?}
    C --> D
    D -->|Có| E[Xóa quyền cũ + Insert mới<br/>1 transaction]
    D -->|Không| F[ERR-PQ-01<br/>vi phạm ngang cấp]
    E --> G[Cache refresh<br/>BR-AUTH-08]
```

---

## 5. State Machine SM-TAIKHOAN

```mermaid
stateDiagram-v2
    [*] --> CHO_KICH_HOAT: QTHT tạo TK<br/>gửi email kích hoạt
    CHO_KICH_HOAT --> HOAT_DONG: User kích hoạt /<br/>QTHT kích hoạt
    CHO_KICH_HOAT --> VO_HIEU_HOA: Auto quá 7 ngày
    HOAT_DONG --> TAM_KHOA: 5 lần sai pass (auto)<br/>BR-AUTH-07
    HOAT_DONG --> TAM_KHOA: QTHT khóa
    TAM_KHOA --> HOAT_DONG: QTHT mở / Auto sau 30ph
    HOAT_DONG --> VO_HIEU_HOA: QTHT vô hiệu hóa
    VO_HIEU_HOA --> HOAT_DONG: QTHT khôi phục
```

---

## 6. Sequence: Đăng nhập Tier 1 (UC-118)

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Browser
    participant API as PM API
    participant DB
    participant SMTP

    U->>FE: Nhập user + pass
    FE->>API: POST /login
    API->>DB: SELECT TAI_KHOAN
    alt Không tồn tại / hash sai
        API->>DB: so_lan_sai++
        alt so_lan_sai >= 5
            API->>DB: tt=TAM_KHOA<br/>BR-AUTH-07
        end
        API-->>FE: ERR-DN-01/04
    else Đúng
        API->>DB: Reset so_lan_sai=0
        API->>SMTP: Gửi TOTP 6 số
        API-->>FE: Prompt TOTP
        U->>FE: Nhập TOTP
        FE->>API: POST /login/totp
        alt TOTP sai/expired
            API-->>FE: ERR-DN-08
        else OK
            API->>API: Tạo JWT 15 phút + Refresh 24h<br/>BR-AUTH-06
            API->>DB: Log LOGIN + ngày_ĐN cuối
            API-->>FE: 200 + tokens
            FE->>U: Redirect Dashboard
        end
    end
```

---

## 7. Sequence: Đăng nhập VNeID Tier 3 (UC-121)

```mermaid
sequenceDiagram
    actor U as TVV/CG/NHT
    participant FE
    participant API as PM
    participant VN as VNeID OIDC

    U->>FE: Click "Đăng nhập VNeID"
    FE->>VN: Redirect Authorization Code flow
    U->>VN: Xác thực (CCCD)
    VN->>FE: Callback code
    FE->>API: POST /auth/vneid/callback
    API->>VN: Đổi code → id_token + access_token
    VN-->>API: id_token (CCCD claim)
    API->>API: Decode id_token
    API->>API: Tìm TK theo CCCD
    alt Tồn tại + HOAT_DONG
        API->>API: Tạo JWT PM
        API-->>FE: 200 + token
    else Tồn tại khác trạng thái
        API-->>FE: ERR-VN-02 Từ chối
    else Không tồn tại
        API->>API: Tạo TK CHO_PHAN_QUYEN<br/>báo QTHT
        API-->>FE: Yêu cầu QTHT duyệt
    end
```

---

## 8. Cấu hình SLA (UC-108, BR-SLA-01/02)

```mermaid
flowchart LR
    A[QTHT vào cấu hình SLA] --> B[Input: loai_yeu_cau<br/>thoi_han_ngay > 0<br/>canh_bao_1 < canh_bao_2 < 100]
    B --> C{Validate}
    C -->|Vi phạm| E1[ERR-SLA-01/02/03]
    C -->|OK| D[UPSERT CAU_HINH_SLA]
    D --> E[Audit log]
    E --> F[HS MỚI áp cấu hình mới<br/>HS cũ giữ nguyên]
```

4 mức cảnh báo (BR-SLA-02):
- `> 50%` = BINH_THUONG (Xanh)
- `≤ 50%` = SAP_HET (Vàng)
- `> 100%` = QUA_HAN (Đỏ)
- `> 2x` = QUA_HAN_NGHIEM_TRONG (Đen)

---

## 9. Tổng hợp các Template CRUD (TPL-DM-CRUD)

Tất cả 14 danh mục (UC-99..107, UC-109..111, UC-116, UC-117) tuân theo cùng 1 template:

```mermaid
flowchart TB
    A[Check quyền QTHT] --> B{Action?}
    B -->|Create| C1[Validate mã unique + tên ≠ rỗng<br/>max 20 ký tự]
    B -->|Update| C2[Check bản ghi tồn tại + không xóa<br/>BR-DATA-01]
    B -->|Delete| C3[Check ràng buộc tham chiếu<br/>ERR-DM-03]
    B -->|List/Search| C4[Filter is_deleted=0<br/>Phân trang 20]
    C1 --> D[INSERT]
    C2 --> E[UPDATE]
    C3 --> F[SET is_deleted=1]
    D & E & F & C4 --> G[Audit BR-DATA-05]
```

---

## 10. Error codes quan trọng

| Mã | Mô tả |
|---|---|
| ERR-AUTH-01 | Không có quyền (403) |
| ERR-DM-03 | Đang được tham chiếu, không xóa |
| ERR-DV-05 | Vòng lặp cây đơn vị |
| ERR-DN-04 | TK bị khóa do sai >5 lần |
| ERR-PQ-01 | Vi phạm ngang cấp |
| ERR-VN-02 | CCCD không có TK |

---

## 11. Tích hợp

| Tích hợp | Chi tiết |
|---|---|
| **ALL modules** | Danh mục dùng chung (lĩnh vực, tình trạng, loại...). |
| **FR-05, FR-06, FR-02** | UC-108 cấu hình SLA trung tâm. |
| **FR-16** | JWT issuer `htpldn.moj.gov.vn` tạo ở UC-118/UC-121. |
