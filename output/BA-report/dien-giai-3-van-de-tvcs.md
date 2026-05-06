# Diễn giải 3 vấn đề trong observations-flow-tvcs.md

> **Ngày:** 2026-05-05 | **Nguồn:** observations-flow-tvcs.md (R6.4.A5) + SRS update FR-04/FR-10/FR-12 cùng ngày.

---

## Tổng hợp

| # | Vấn đề | Loại | Trạng thái | Việc cần làm |
|---|--------|------|-----------|--------------|
| 1 | Chuyên gia đăng nhập không thấy việc | Lỗi quy trình seed test data | ✅ Không phải lỗi SRS | QA re-seed theo flow FR-04 hoặc script DB tạm |
| 2 | Đếm sai số chuyên gia (TVV-0008) | Lỗi báo cáo kiểm thử | ✅ Không phải lỗi SRS | QA sửa nhật ký R6.2.5 |
| 3 | Trường "Hình thức" thừa trên UI | SRS định nghĩa trùng giữa 2 bảng | ✅ Đã sửa SRS (2026-05-05) | Dev migrate DB + FE remove render |

---

## Vấn đề 1 — Chuyên gia đăng nhập không thấy việc (OBS-FLOW-TVCS-003)

### Hiện tượng
6 tài khoản chuyên gia trung ương `cg_tw_01..06` đăng nhập, mở mục "Tư vấn chuyên sâu" → màn hình "Không có nội dung tư vấn nào", dù cán bộ nghiệp vụ đã giao việc.

### Nguyên nhân
Đội QA seed test data **qua đường tắt QTHT** (modal "Thêm tài khoản" → vai trò "Chuyên gia tư vấn") thay vì đi qua quy trình chính thống FR-04. Đường tắt tạo ra tài khoản không gắn với hồ sơ TVV nào → đăng nhập không lọc được việc.

Trong quy trình chính thống FR-04 (Ứng viên gửi hồ sơ → CB NV thẩm định → CB PD duyệt), khi CB PD bấm "Phê duyệt", hệ thống **tự động** tạo tài khoản + gắn vào hồ sơ + gửi mail kích hoạt — tất cả trong cùng 1 thao tác. Không có "bước link riêng" vì việc tạo TK đã bao gồm cả việc gắn vào hồ sơ.

### Kết luận
SRS đúng. Production không bị lỗi này. Chỉ là lỗi cách seed test data.

### Việc cần làm (cho QA)
- **Lựa chọn A — Đúng spec:** Re-seed theo flow FR-04 (tạo hồ sơ TVV → thẩm định → duyệt → hệ thống auto cấp TK).
- **Lựa chọn B — Tắt cho gấp:** Dev viết script DB gắn FK `tai_khoan_id` cho 6 TK đã có với 6 hồ sơ TVV-0009..0014, ghi rõ "data legacy".

### Optional (nice-to-have)
Bổ sung ràng buộc ở FR-10 modal QTHT tạo TK: chặn vai trò TVV/CG, ép đi qua FR-04. Không bắt buộc.

---

## Vấn đề 2 — Đếm sai số chuyên gia (OBS-FLOW-TVCS-001)

### Hiện tượng
Báo cáo R6.2.5 ghi "PASS 6/6 chuyên gia (TVV-0007..0012)". Đếm thực tế trên UI chỉ thấy 5 (thiếu TVV-0008).

### Nguyên nhân
Lỗi seed dữ liệu hoặc đếm nhanh — không phải lỗi SRS, không phải lỗi phần mềm.

### Việc cần làm (cho QA)
Sửa nhật ký R6.2.5 từ ✅ "PASS 6/6" → ⚠️ "5/6 thấy trên UI + 2 bonus seed (TVV-0013/0014). Đủ phủ 6 lĩnh vực."

---

## Vấn đề 3 — Trường "Hình thức" thừa trên UI (OBS-FLOW-TVCS-002)

### Hiện tượng
Trang chi tiết TVCS hiển thị dòng "Hình thức: HO_SO" trong phần "Thông tin cơ bản". SRS spec accordion "Thông tin cơ bản" chỉ liệt kê 6 trường (Mã / DN / CG / Lĩnh vực / Ngày tư vấn / Ghi chú) — không có "Hình thức".

### Nguyên nhân
Trường tên gần giống xuất hiện ở 2 bảng với enum chênh nhau:

| Bảng | Trường | Bắt buộc | Enum | Mức dùng nghiệp vụ |
|------|--------|----------|------|---------------------|
| TU_VAN_CHUYEN_SAU (cấp vụ) | `hinh_thuc_tv` | N | HO_SO / VIDEO_CALL / DIEN_THOAI | **Không có FR nào dùng** (orphan) |
| PHIEN_TU_VAN (cấp phiên) | `hinh_thuc` | Y | HO_SO / VIDEO_CALL / DIEN_THOAI / **TRUC_TIEP** | Bắt buộc nhập, dùng thực tế |

Bằng chứng `hinh_thuc_tv` là field orphan: grep toàn FR-12 không có Inputs/Processing/Outputs/AC/Accordion nào dùng. DB tự sinh 'HO_SO' theo default → UI render ra như rác metadata.

### ✅ Đã sửa (2026-05-05)

Bỏ field `hinh_thuc_tv` khỏi entity TU_VAN_CHUYEN_SAU. Hình thức tư vấn quản lý duy nhất ở cấp PHIEN_TU_VAN. Phù hợp với:
- Mô tả entity PHIEN_TU_VAN: "Phiên tư vấn 1-1 (video call/điện thoại/hồ sơ)" — hình thức là thuộc tính bản chất của phiên.
- Pattern 1 vụ có nhiều phiên với hình thức khác nhau (volume ratio 1:2).

**File đã cập nhật:**

| File | Vị trí | Thay đổi |
|------|--------|----------|
| `srs-v3.md` (master) | §3.4.3.9 bảng thuộc tính TU_VAN_CHUYEN_SAU | Bỏ row `hinh_thuc_tv` |
| `srs-v3.md` | Lịch sử thay đổi | Thêm phiên bản 3.2.1 |
| `srs-fr-12-tv-chuyen-sau.md` (bản trích) | §3.4.3.9 + ERD Section 4 | Bỏ row `hinh_thuc_tv` |
| `srs-fr-12-tv-chuyen-sau.md` | Lịch sử thay đổi | Thêm dòng 2026-05-05 |

### Việc còn lại (cho dev)
- Migrate DB: `ALTER TABLE TU_VAN_CHUYEN_SAU DROP COLUMN hinh_thuc_tv`.
- FE: bỏ render dòng "Hình thức" trên trang chi tiết TVCS (accordion "Thông tin cơ bản" chỉ còn 6 trường theo spec).
