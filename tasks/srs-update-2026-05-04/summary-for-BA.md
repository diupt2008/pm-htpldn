# Tóm tắt thay đổi SRS 2026-05-04 — Gửi BA xác nhận

**Ngày:** 2026-05-04 · **Người gửi:** QA team · **Người nhận:** BA
**Mục đích:** Xác nhận lại scope 3 file SRS cập nhật trước khi QA lên kế hoạch test.

---

## Tổng quan tỷ lệ thay đổi

| Module | File | Số dòng cũ | Số dòng mới | Δ tăng | Mức độ thay đổi |
|--------|------|:---:|:---:|:---:|:---:|
| Hỏi đáp pháp luật | FR-02 | 1.420 | 1.745 | **+23%** | Vừa |
| Đào tạo, tập huấn | FR-03 | 1.267 | 2.954 | **+133%** | **Rất lớn** |
| Tư vấn viên / Mạng lưới | FR-04 | 1.303 | 2.528 | **+94%** | Lớn |
| **Tổng** | | **3.990** | **7.227** | **+81%** | |

---

## 📩 FR-02 Hỏi đáp pháp luật — thay đổi vừa (+23%)

**Thêm 3 chức năng mới:**
1. **Cấu hình "lĩnh vực → cán bộ phụ trách"** (QTHT cài, hệ thống tự gợi ý khi phân công)
2. **Mẫu phản hồi 3 cấp** (TW soạn dùng chung 63 tỉnh / Bộ ngành riêng / Tỉnh riêng)
3. **Tự động cảnh báo trễ hẹn** (cron 30 phút, gửi email + thông báo)

**Sửa thời hạn xử lý:**
- Câu hỏi **thường:** 15 ngày làm việc
- Câu hỏi **phức tạp:** 30 ngày làm việc
- Cán bộ có nút "Đổi mức độ phức tạp" để gia hạn

**4 mức cảnh báo SLA mới** (thay 3 mức cũ): bình thường (xanh) / sắp hết hạn (vàng) / quá hạn (đỏ) / quá hạn nghiêm trọng (đen → escalate)

**Đính chính căn cứ pháp lý:** NĐ55/2019 Đ.9 (sai) → **Đ.8 Khoản 1** (đúng)

**Nâng cấp UI/bảo mật:**
- Phiên hết hạn → bài đang soạn không bị mất (lưu trình duyệt mã hóa AES-256)
- 2 cán bộ sửa cùng 1 phản hồi → người sau bị báo "có người vừa sửa", không ghi đè
- Lọc XSS chống chèn mã độc trong nội dung mẫu

---

## 🎓 FR-03 Đào tạo, tập huấn — thay đổi RẤT LỚN (+133%)

### Cấu trúc mới: 3 cấp lồng nhau (Mô hình A)

```
Kế hoạch đào tạo NĂM           ← duyệt riêng cấp 1
   └── Chương trình đào tạo    ← duyệt riêng cấp 2
          └── Khóa học cụ thể  ← duyệt riêng cấp 3
                 ├── Lịch học từng buổi
                 └── Học viên đăng ký
```
**Mỗi cấp đều phải duyệt độc lập** trước khi tạo cấp dưới.

### Thêm 6 chức năng mới
1. Xuất chương trình đào tạo ra **Word/PDF có ký số**
2. **Tạo đề kiểm tra** (từ ngân hàng câu hỏi)
3. **Quản lý đề kiểm tra**
4. **Phát đề + gắn đề với bài giảng**
5. **Phê duyệt khóa học** (trước chỉ duyệt chương trình)
6. **Quản lý lịch học từng buổi** + điểm danh **3 mức** (có mặt / vắng có phép / vắng không phép) — thay vì chỉ "có/không" như cũ

### State machine khóa học mở rộng
- Cũ: 9 trạng thái
- Mới: **11 trạng thái** — thêm "Từ chối" + "Từ chối kết quả"
- Khi bị từ chối, cán bộ sửa rồi gửi lại → **không cần về nháp**, đi thẳng "Chờ duyệt" (rút gọn quy trình)

### Đổi cách công bố kết quả (Hướng B)
- Cũ: cấp chứng chỉ PDF ký số
- Mới: **đẩy kết quả vào tài khoản học viên + chuyên trang công khai** (đơn giản hơn, không cần ký văn bản)

### Phân quyền chi tiết hơn
- Cũ: nói chung "cán bộ có quyền quản lý đào tạo"
- Mới: **~60 mã quyền cụ thể** (xem khóa, tạo, sửa, xóa, gửi duyệt, duyệt, từ chối, công khai, hủy, kích hoạt, kết thúc, trình duyệt KQ, duyệt KQ, công bố KQ...)

### Đính chính căn cứ pháp lý
NĐ55/2019 Đ.6 (sai — Đ.6 nói về CSDL vụ việc) → **Đ.10 Khoản 2** (đúng — đào tạo PL DNNVV)

---

## 👨‍⚖️ FR-04 Tư vấn viên / Mạng lưới — thay đổi LỚN (+94%)

### 1. Thêm module hoàn toàn mới: Tổ chức Tư vấn (TCTV)

Trước đây chỉ quản lý **tư vấn viên cá nhân**. Giờ thêm quản lý cả **tổ chức** (văn phòng luật sư, trung tâm tư vấn pháp lý):
- Cán bộ tạo TCTV (đính kèm Giấy ĐKHĐ Sở Tư pháp)
- Trình lãnh đạo phê duyệt
- Lãnh đạo công bố vào mạng lưới (theo NĐ55/2019 **Điều 9**)
- TCTV có thể tạm dừng / vô hiệu hóa / kích hoạt lại
- Tư vấn viên cá nhân được link vào TCTV

State machine TCTV mới: **6 trạng thái** (Mới đăng ký → Chờ phê duyệt → Hoạt động → Tạm dừng → Vô hiệu hóa, có nhánh Từ chối)

### 2. Tách "Người hỗ trợ pháp lý" (NHT) ra bảng riêng

- **Cũ:** NHT chung 1 bảng với tư vấn viên, phân biệt bằng cờ `loại = NHT/TVV/CG`
- **Mới:** NHT có **bảng riêng**, 1 NHT = 1 tài khoản đăng nhập (1:1)
- **Lý do:** NHT là **cán bộ HTPL** (NĐ55/2019 Đ.7), khác bản chất với TVV (cá nhân hành nghề ngoài). Tách bảng cho minh bạch.
- Thêm 3 chức năng: quản lý NHT / tìm kiếm NHT (phục vụ phân công vụ việc) / xem hồ sơ NHT

### 3. Refactor tư vấn viên cá nhân

| Mục | Cũ | Mới |
|-----|----|-----|
| Phạm vi hoạt động | Khai địa bàn cụ thể | **Toàn quốc** (theo NĐ77/2008 Đ.19) — bỏ trường địa bàn |
| Thang điểm đánh giá | 0-10 | **1-5** (đơn giản hơn) |
| Thời gian chờ sau từ chối | 6 tháng | **Bỏ** (đăng ký lại được ngay) |
| Số trạng thái quy trình đăng ký | 7 | **9** (thêm "Chờ thẩm định") |
| Bước tiền thẩm định | Không có | **Thêm FR-IV-13** — tiếp nhận hồ sơ trước thẩm định chuyên môn |

### 4. Đính chính căn cứ pháp lý
NĐ121/2025 Đ.24 (sai) → **Đ.39-40** (đúng — phân cấp UBND tỉnh công bố mạng lưới)

---

## Bảng câu hỏi cần BA xác nhận trước khi QA bắt đầu

| # | Câu hỏi | Lý do cần xác nhận | Đề xuất QA |
|---|---------|--------------------|------------|
| 1 | Sau khi tách NHT ra bảng riêng, **dữ liệu NHT cũ** (R6 đã seed) có được migrate tự động sang bảng mới không? Có làm hỏng các vụ việc/hỏi đáp đang phân công cho NHT cũ không? | Sợ break luồng đang chạy | Migrate in-place + giữ tương thích 1 round |
| 2 | Khóa học cũ (R6) chưa có "Chương trình đào tạo cha" — có cần backfill không, hay giữ orphan? | Khóa học cũ tạo trực tiếp, chưa theo Mô hình A | Giữ R6 orphan, R7 mới bắt buộc có cha |
| 3 | Cán bộ Bộ ngành có được **đọc mẫu phản hồi của TW** không, hay chỉ thấy mẫu Bộ mình? | SRS hiện ghi "TW dùng chung 63 tỉnh, KHÔNG cho Bộ ngành" — có vẻ ngược logic | Theo SRS strict: Bộ chỉ đọc Bộ_RIENG |
| 4 | TVV cũ (đang đánh giá thang 0-10) có cần migrate sang thang 1-5 không, hay giữ song song? | Sợ phá điểm đánh giá lịch sử | R6 giữ thang 0-10, R7 dùng 1-5 |
| 5 | Kênh nguồn câu hỏi mới **TVN_BRIDGE** (cầu nối từ Tư vấn nhanh) — dev đã thêm enum + badge UI chưa? | Cần biết để test | Hỏi dev confirm sẵn sàng |

---

## Đã verify

QA đã đối chiếu **20/21 claim** với SRS cũ + SRS mới. **20 đúng, 1 sai nhỏ** (3 entity Kế hoạch đào tạo / Lịch học / Học viên không phải mới hoàn toàn — đã có ở SRS cũ, SRS mới chỉ định nghĩa lại rõ hơn).

→ Mọi điểm trong tóm tắt này đều đã có bằng chứng dòng cụ thể trong file SRS, BA cần xem chi tiết em gửi ngay.

---

## Đề xuất bước tiếp theo

1. **BA review** tóm tắt này + reply 5 câu hỏi ở bảng trên
2. QA tạm hoàn thành **R6 đang chạy** (theo plan v2.5.1)
3. Mở **R7** để test đợt SRS update này — kế hoạch chi tiết em đã viết sẵn ở [`plan.md`](plan.md) + [`todo.md`](todo.md)
4. Ước tính: **5 tuần** test cho 3 module update này (sau khi R6 đóng + dev sẵn sàng)
