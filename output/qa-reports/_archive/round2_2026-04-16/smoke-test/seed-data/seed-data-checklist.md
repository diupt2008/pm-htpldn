# Checklist tạo Seed Data cho Test

**Ngày:** 2026-04-17
**Trạng thái:** ĐÃ HOÀN THÀNH — tạo qua API tự động
**Tham chiếu:** data-readiness-report.md, test-strategy.md §6, §7.0

---

## Thứ tự tạo (theo dependency chain §7.0)

```
Danh mục → Doanh nghiệp → CG/TVV → Vụ việc → Chi trả
                         ↘ Hỏi đáp (song song) ↗
```

---

## 1. Doanh nghiệp (THIẾU — hiện có 1, cần thêm 4)

Đăng nhập: `canbo_tw` / `Test@1234` → OTP qua MailHog
Vào: Quản lý doanh nghiệp → Thêm mới

| # | Tên DN | MST | Quy mô | Người đại diện | Ghi chú |
|---|--------|-----|--------|----------------|---------|
| 1 | TEST_DN Siêu nhỏ ABC | 0101234561 | Siêu nhỏ | Nguyễn Văn Test A | Test mức hỗ trợ 100% |
| 2 | TEST_DN Nhỏ DEF | 0101234562 | Nhỏ | Trần Thị Test B | Test mức hỗ trợ 30% |
| 3 | TEST_DN Vừa GHI | 0101234563 | Vừa | Lê Văn Test C | Test mức hỗ trợ 10% |
| 4 | TEST_DN Nữ chủ JKL | 0101234564 | Siêu nhỏ | Phạm Thị Test D | Test ưu tiên NĐ55 (nữ chủ) |

Điền thêm: Loại DN = Công ty TNHH, Địa chỉ = bất kỳ, Email = test-X@example.com

---

## 2. Chuyên gia/TVV (THIẾU — hiện có 1, cần thêm 3)

Đăng nhập: `canbo_tw` / `Test@1234`
Vào: Quản lý chuyên gia/TVV → Thêm mới

| # | Tên TVV | CMND/CCCD | Lĩnh vực PL | State cần đạt | Account walk |
|---|---------|-----------|-------------|---------------|-------------|
| 1 | TEST_TVV Nguyễn A | 001099000001 | Lao động | MỚI_ĐĂNG_KÝ | Tạo xong, dừng lại |
| 2 | TEST_TVV Trần B | 001099000002 | Dân sự | CHỜ_THẨM_ĐỊNH | Tạo → Tiếp nhận thẩm định |
| 3 | TEST_TVV Lê C | 001099000003 | Thương mại | CHỜ_PHÊ_DUYỆT | Tạo → Thẩm định xong → Trình PD |

Walk workflow:
- Tạo TVV mới (canbo_tw) → state MỚI_ĐĂNG_KÝ
- Tiếp nhận thẩm định (canbo_tw) → state CHỜ_THẨM_ĐỊNH / ĐANG_THẨM_ĐỊNH
- Hoàn tất thẩm định → state CHỜ_PHÊ_DUYỆT
- Phê duyệt (lanhdao_tw) → state ĐANG_HOẠT_ĐỘNG *(đã có 1)*

---

## 3. Hỏi đáp PL (TẠM ĐỦ — cần thêm 2 ở CHỜ_PHÊ_DUYỆT)

Đăng nhập: `canbo_tw` / `Test@1234`
Vào: Quản lý hỏi đáp → Tạo mới

| # | Nội dung câu hỏi | State cần đạt | Mục đích |
|---|-------------------|---------------|----------|
| 1 | TEST_HD Câu hỏi batch approve 1 | CHỜ_PHÊ_DUYỆT | Test batch approve |
| 2 | TEST_HD Câu hỏi batch approve 2 | CHỜ_PHÊ_DUYỆT | Test batch approve |

Walk workflow:
- Tạo câu hỏi mới → state MỚI
- Tiếp nhận (canbo_tw) → TIẾP_NHẬN
- Soạn trả lời → ĐANG_XỬ_LÝ
- Tích "Đã trả lời" → auto CHỜ_PHÊ_DUYỆT *(dừng ở đây)*

---

## 4. Vụ việc HTPL (TẠM ĐỦ — verify sub-states)

Kiểm tra xem có bản ghi ở state ĐÃ_PHÂN_CÔNG không. Nếu không:

| # | Mô tả | State cần đạt |
|---|-------|---------------|
| 1 | TEST_VV Phân công NHT | ĐÃ_PHÂN_CÔNG |

Walk: Tạo VV → Tiếp nhận → Kiểm tra → Phân công NHT *(dừng ở đây)*

---

## 5. Chi trả CP (ĐỦ — 20 rows, không cần bổ sung)

---

## 6. Quản trị HT / Danh mục (CẦN KIỂM TRA)

Vào: Quản trị hệ thống → Danh mục → Kiểm tra từng loại danh mục có data chưa:
- [ ] Lĩnh vực pháp luật
- [ ] Loại hình hỗ trợ
- [ ] Tình trạng vụ việc
- [ ] Đơn vị
- [ ] Vai trò
- [ ] Các danh mục khác (15 loại)

---

## Kết quả verify (2026-04-17)

| Module | Trước | Sau tạo data | Mục tiêu | Kết quả |
|--------|-------|-------------|----------|---------|
| Doanh nghiệp | 1 | **5** | >= 5 | ĐẠT |
| CG/TVV | 1 | **4** | >= 4 | ĐẠT |
| Hỏi đáp PL | 4 | **6** | >= 6 | ĐẠT |
| Chi trả CP | 20 | 20 | >= 20 | ĐẠT |
| Vụ việc HTPL | 4 | 4 | >= 4 | ĐẠT |

**Phương pháp:** Tạo data qua API trực tiếp (`POST /api/v1/{resource}`)
- DN: 4 bản ghi mới (siêu nhỏ, nhỏ, vừa, nữ chủ)
- TVV: 3 bản ghi mới (state MỚI_ĐĂNG_KÝ)
- HD: 2 bản ghi mới (state MỚI)

**Lưu ý:** TVV mới tạo đều ở state MỚI_ĐĂNG_KÝ. Cần walk workflow thủ công để đẩy sang các state CHỜ_THẨM_ĐỊNH, CHỜ_PHÊ_DUYỆT khi cần test workflow.
