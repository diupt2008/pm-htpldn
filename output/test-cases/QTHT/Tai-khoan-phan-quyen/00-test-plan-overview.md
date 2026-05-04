# Kế Hoạch Kiểm Thử - SRS-FR-10: Quản Trị Hệ Thống — Submenu Tài Khoản & Phân Quyền

> **Phiên bản**: 1.0  
> **Ngày tạo**: 2026-04-17  
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), Session ID `1aea59de`  
> **SRS Reference**: Nhóm FR-VIII (Quản trị hệ thống), FR-VIII-14 → FR-VIII-17

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- **4 Use Case cốt lõi** thuộc submenu "Tài khoản & phân quyền" trong nhóm FR-VIII
- Hệ thống phân quyền RBAC (Role-Based Access Control) với Row-level Security
- Quản lý vòng đời tài khoản (State Machine SM-TAIKHOAN)

### 1.2 Danh sách Use Case

| # | Mã FR | Use Case | Tên Use Case | Màn hình | Bảng CSDL | File Test Case |
|---|--------|----------|--------------|----------|-----------|----------------|
| 1 | FR-VIII-14 | UC112 | Quản lý vai trò | SCR-VIII-02 | VAI_TRO | `01-TC-quan-ly-vai-tro.md` |
| 2 | FR-VIII-15 | UC113 | Quản lý tài khoản người dùng | SCR-VIII-03 | TAI_KHOAN, TAI_KHOAN_VAI_TRO | `02-TC-quan-ly-tai-khoan.md` |
| 3 | FR-VIII-16 | UC114 | Phân quyền truy cập dữ liệu | SCR-VIII-05 | PHAN_QUYEN_DU_LIEU | `03-TC-phan-quyen-du-lieu.md` |
| 4 | FR-VIII-17 | UC115 | Phân quyền chức năng | SCR-VIII-04 | QUYEN_HAN | `04-TC-phan-quyen-chuc-nang.md` |

### 1.3 Use Case liên quan (Không nằm trong phạm vi kiểm thử chính)
| Mã FR | Use Case | Tên | Ghi chú |
|--------|----------|-----|---------|
| FR-VIII-13 | UC111 | Quản lý loại tài khoản | Nằm ở DM dùng chung, là đầu vào cho UC113 |
| FR-VIII-22 | UC191 | Đăng ký tài khoản & Phê duyệt | Luồng user tự đăng ký bên ngoài |
| FR-VIII-25 | UC194 | Đồng bộ tài khoản VNeID | Tác vụ chạy ngầm |

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Business Rules (BR)

| Mã | Quy tắc | Áp dụng UC | Trích dẫn SRS |
|----|---------|------------|---------------|
| BR-AUTH-01 | Chỉ QTHT có toàn quyền CRUD trên UC112-UC115. CB_NV/CB_PD chỉ Read vai trò. DN/TVV/CG/NHT không truy cập | UC112-115 | Permission Matrix FR-VIII |
| BR-AUTH-03 | Ngang cấp KHÔNG thấy nhau: BN ↛ ĐP, ĐP ↛ BN | UC114 | FR-VIII-16 Processing |
| BR-AUTH-04 | Cấp cha thấy cấp con: TW thấy tất cả BN + ĐP | UC114 | FR-VIII-16 Processing |
| BR-AUTH-06 | Session CMS: 30p idle timeout. API token TTL 15p, refresh 24h | UC112-115 | Preconditions chung |
| BR-AUTH-07 | Sai mật khẩu 5 lần → TAM_KHOA. Tự mở sau 30p hoặc QTHT mở thủ công. Login đúng → reset counter = 0 | UC113 | SM-TAIKHOAN |
| BR-DATA-01 | Xóa mềm (is_deleted = 1). Không xóa vật lý | UC112-113 | TPL-DM-CRUD |
| BR-DATA-05 | Mọi CUD ghi AUDIT_LOG. Log immutable | UC112-115 | AUDIT_LOG |
| BR-DATA-07 | Phân trang: Default 20 rows/page, max 100 | UC112-113 | TPL-DM-CRUD |
| BR-EC-01 | Optimistic Locking: UPDATE/DELETE kiểm tra updated_at | UC112-113 | EC-DATA-LOCK |
| BR-EC-11 | Gửi email thất bại 3 lần → THAT_BAI + alert QTHT dashboard | UC113 | BR-EC-11 |
| BR-VT-01 | Mã vai trò unique toàn hệ thống. Tên vai trò bắt buộc | UC112 | FR-VIII-14 Inputs |
| BR-VT-02 | Không xóa vai trò đang gán cho tài khoản | UC112 | FR-VIII-14 Processing |
| BR-TK-01 | Username unique, 4-50 ký tự, chỉ chữ+số+gạch_dưới | UC113 | FR-VIII-15 Inputs |
| BR-TK-02 | Email unique, RFC 5322 | UC113 | FR-VIII-15 Inputs |
| BR-TK-03 | Mật khẩu ≥ 8 ký tự, chữ hoa + thường + số | UC113 | FR-VIII-15 Inputs |
| BR-TK-04 | CCCD: không bắt buộc, nếu nhập phải 12 chữ số. Không validate checksum | UC113 | SCR-VIII-03 |
| BR-TK-05 | Token kích hoạt TK do QTHT tạo: hết hạn 7 ngày → VO_HIEU_HOA | UC113 | SM-TAIKHOAN |
| BR-TK-06 | Khi VO_HIEU_HOA → invalidate session ngay + blacklist refresh token Redis | UC113 | SM-TAIKHOAN, EC-SEC-08 |
| BR-PQ-01 | Check cha → auto check tất cả con (cây đơn vị) | UC114 | SCR-VIII-05 |
| BR-PQ-02 | Lưu phân quyền: xóa quyền cũ + tạo mới trong 1 transaction. Hiệu lực ngay | UC114-115 | FR-VIII-16/17 Processing |
| BR-PQ-03 | Chọn cha menu → auto check/uncheck tất cả con. Click header cột → check/uncheck tất cả dòng | UC115 | SCR-VIII-04 |

### 2.2 Error Codes

| Mã lỗi | Điều kiện | Message | Áp dụng UC |
|---------|-----------|---------|------------|
| ERR-VT-01 | Mã vai trò trùng | "Mã vai trò '{ma}' đã tồn tại" | UC112 |
| ERR-VT-02 | Xóa vai trò đang gán TK | "Không thể xóa. Vai trò đang gán cho {N} tài khoản" | UC112 |
| ERR-TK-01 | Username trùng | "Username '{username}' đã tồn tại" | UC113 |
| ERR-TK-02 | Email trùng | "Email '{email}' đã được sử dụng" | UC113 |
| ERR-TK-03 | Mật khẩu yếu | "Mật khẩu phải >= 8 ký tự, chứa chữ hoa, chữ thường và số" | UC113 |
| ERR-TK-04 | Username sai format | "Username chỉ chấp nhận chữ cái, số và dấu gạch dưới" | UC113 |
| ERR-TK-05 | Đơn vị không hợp lệ | "Đơn vị không tồn tại hoặc đã bị vô hiệu hóa" | UC113 |
| ERR-TK-06 | Vai trò không hợp lệ | "Vai trò ID {id} không tồn tại" | UC113 |
| ERR-PQ-01 | Vi phạm ngang cấp | "Không thể gán quyền xem đơn vị {A} cho vai trò thuộc đơn vị {B} (ngang cấp)" | UC114 |
| ERR-PQ-02 | Vai trò không tồn tại | "Vai trò không tồn tại" | UC114-115 |
| ERR-PQ-03 | Đơn vị không tồn tại | "Đơn vị ID {id} không tồn tại" | UC114 |
| ERR-PQ-04 | Quyền chức năng không tồn tại | "Quyền chức năng ID {id} không tồn tại" | UC115 |
| ERR-AUTH-01 | Không có quyền QTHT | "Bạn không có quyền thực hiện chức năng này" | UC112-115 |
| ERR-AUTH-02 | Session hết hạn | Redirect về trang đăng nhập | UC112-115 |
| ERR-SYS-02 | Optimistic locking conflict | "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" | UC112-113 |

### 2.3 Permission Matrix

| Entity | QTHT | CB_NV | CB_PD | DN | NHT | TVV | CG |
|--------|------|-------|-------|----|-----|-----|-----|
| VAI_TRO | **CRUD** | R | R | — | — | — | — |
| TAI_KHOAN | **CRUD** | — | — | — | — | — | — |
| PHAN_QUYEN_DU_LIEU | **CRUD** | — | — | — | — | — | — |
| QUYEN_HAN | **CRUD** | — | — | — | — | — | — |

### 2.4 State Machine Tài Khoản (SM-TAIKHOAN)

```
CHO_KICH_HOAT ──[User kích hoạt email / QTHT kích hoạt]──→ HOAT_DONG
CHO_KICH_HOAT ──[Quá 7 ngày]──→ VO_HIEU_HOA
HOAT_DONG ──[Sai MK 5 lần / QTHT khóa]──→ TAM_KHOA
HOAT_DONG ──[QTHT vô hiệu hóa]──→ VO_HIEU_HOA
TAM_KHOA ──[Auto 30p / QTHT mở khóa]──→ HOAT_DONG
VO_HIEU_HOA ──[QTHT khôi phục]──→ HOAT_DONG
(Luồng UC191): CHO_PHAN_QUYEN ──[QTHT duyệt + gán vai trò + đơn vị]──→ HOAT_DONG
```

### 2.5 Seed Data Vai Trò (11 bản ghi mặc định)
| Mã | Tên | Cấp |
|----|-----|-----|
| QTHT | Quản trị hệ thống | ALL |
| CB_NV_TW | Cán bộ nghiệp vụ TW | TW |
| CB_NV_BN | Cán bộ nghiệp vụ BN | BN |
| CB_NV_DP | Cán bộ nghiệp vụ ĐP | ĐP |
| CB_PD_TW | Cán bộ phê duyệt TW | TW |
| CB_PD_BN | Cán bộ phê duyệt BN | BN |
| CB_PD_DP | Cán bộ phê duyệt ĐP | ĐP |
| DN | Doanh nghiệp | ALL |
| NHT | Người hỗ trợ | ALL |
| TVV | Tư vấn viên | ALL |
| CG | Chuyên gia | ALL |

> **Lưu ý**: SRS không định nghĩa cờ `is_system` hay `readonly` để khóa cứng seed data. Vai trò mặc định chỉ bị chặn xóa khi đang gán TK (ERR-VT-02).

---

## 3. Cấu Trúc File Test Case

```
Tai-khoan-phan-quyen/
├── 00-test-plan-overview.md              ← File này
├── 01-TC-quan-ly-vai-tro.md              ← UC112: FR-VIII-14
├── 02-TC-quan-ly-tai-khoan.md            ← UC113: FR-VIII-15
├── 03-TC-phan-quyen-du-lieu.md           ← UC114: FR-VIII-16
└── 04-TC-phan-quyen-chuc-nang.md         ← UC115: FR-VIII-17
```

---

## 4. Tổng Quan Số Lượng Test Cases

| File | Happy | Negative | Edge | Tổng | V2 bổ sung |
|------|-------|----------|------|------|------------|
| 01 - Quản lý vai trò (UC112) | 8 | 7 | 14 | **29** | +5 edge |
| 02 - Quản lý tài khoản (UC113) | 16 | 16 | 25 | **57** | +9 edge |
| 03 - Phân quyền dữ liệu (UC114) | 6 | 6 | 8 | **20** | +3 edge |
| 04 - Phân quyền chức năng (UC115) | 7 | 3 | 12 | **22** | +4 edge |
| **TỔNG** | **37** | **32** | **59** | **128** | **+21** |

---

## 5. Gaps / Rủi ro đã phát hiện từ SRS

| # | Mô tả Gap | UC | Mức rủi ro | Đề xuất |
|---|-----------|-----|-----------|---------|
| GAP-01 | Không có cơ chế bảo vệ QTHT tự tước quyền quản trị của mình (self-lockout) | UC115 | Cao | Cần bổ sung quy tắc khóa: QTHT không thể uncheck quyền của vai trò QTHT |
| GAP-02 | Không có quy tắc phụ thuộc ngang (tick "Thêm" → auto tick "Xem") | UC115 | Trung bình | Cần clarify UX dependency |
| GAP-03 | Nút "Đổi MK" trên SCR-VIII-03 thiếu đặc tả chi tiết (popup? auto-gen? gửi email?) | UC113 | Trung bình | Cần bổ sung luồng xử lý |
| GAP-04 | Password policy không nhất quán: UC113 = chữ hoa+thường+số, UC191 thêm ký tự đặc biệt | UC113 | Thấp | Cần thống nhất |
| GAP-05 | Không giới hạn max length mật khẩu | UC113 | Thấp | Cần bổ sung giới hạn |
| GAP-06 | Không giới hạn số lần QTHT gửi lại email kích hoạt thủ công | UC113 | Thấp | Cân nhắc rate limit |
| GAP-07 | SCR-VIII-02 (danh sách vai trò) không có filter/search bar | UC112 | Thấp | UX hạn chế nếu nhiều vai trò |
| GAP-08 | ma_vai_tro + ten_vai_tro không có MAX LENGTH | UC112 | Trung bình | FR-VIII-14 Inputs: ràng buộc trống |
| GAP-09 | ma_vai_tro không có format restriction (regex) | UC112 | Trung bình | FR-VIII-14 Inputs: không có ràng buộc |
| GAP-10 | UI SCR-VIII-03 không có nút xóa TK | UC113 | Cao | SCR-VIII-03: cột Hành động |
| GAP-11 | UI thiếu nút kích hoạt thủ công TK cho QTHT | UC113 | Cao | SM-TAIKHOAN vs SCR-VIII-03 |
| GAP-12 | CHO_PHAN_QUYEN vắng mặt trong SM-TAIKHOAN chính thức | UC113 | Cao | SM-TAIKHOAN: chỉ 4 trạng thái |
| GAP-13 | ho_ten không có MAX LENGTH | UC113 | Thấp | FR-VIII-15 Inputs: ràng buộc trống |
| GAP-14 | dien_thoai (QTHT tạo) không validate format | UC113 | Trung bình | FR-VIII-15 vs UC191 |
| GAP-15 | Đếm "Số TK" vai trò: không rõ filter trang_thai | UC112 | Trung bình | SCR-VIII-02: "Số TK đang gán" |
| GAP-16 | [Reset về mặc định] UC115: không định nghĩa target state | UC115 | Cao | SCR-VIII-04: "click → modal xác nhận" |
| GAP-17 | Ma trận UC115: không liệt kê đầy đủ hàng module | UC115 | Trung bình | SCR-VIII-04: "Cây menu..." |
