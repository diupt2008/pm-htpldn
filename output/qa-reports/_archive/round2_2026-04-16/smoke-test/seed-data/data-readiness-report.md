# Báo cáo Data Readiness — Đếm data & Đối chiếu State Machine

**Ngày:** 2026-04-16
**Tài khoản:** canbo_tw (CB_NV_TW, cấp Trung ương)
**Tham chiếu:** test-strategy.md §6, §7.0

---

## 1. Thu thập: Đếm data từng module

### Hỏi đáp Pháp lý (SM-HOIDAP — 9 trạng thái)

| Tab trên UI | Mapping SM-HOIDAP | Rows hiện có |
|-------------|-------------------|--------------|
| Tất cả | — | 4 |
| Mới | MỚI | có data (trong 4) |
| Đang xử lý | TIẾP_NHẬN + ĐANG_XỬ_LÝ | có data (trong 4) |
| Chờ phê duyệt | CHỜ_PHÊ_DUYỆT | có data (trong 4) |
| Đã duyệt | ĐÃ_DUYỆT | có data (trong 4) |
| Công khai | CÔNG_KHAI | ? |
| Hoàn thành | HOÀN_THÀNH | ? |
| *(không có tab)* | HỦY | không hiện trên UI |
| *(không có tab)* | ĐÃ_TRẢ_LỜI | không hiện trên UI |

**Nhận xét:** Tổng 4 bản ghi. Tabs hiển thị 7 trạng thái. Thiếu tab HỦY và ĐÃ_TRẢ_LỜI (có thể là trạng thái trung gian, không hiện tab riêng).

### Chuyên gia/TVV (SM-TVV — 9 trạng thái)

| Tab trên UI | Mapping SM-TVV | Rows hiện có |
|-------------|----------------|--------------|
| Đang hoạt động | ĐANG_HOẠT_ĐỘNG | 1 (tab mặc định) |
| Tạm dừng | TẠM_DỪNG | ? |
| Mới đăng ký | MỚI_ĐĂNG_KÝ | ? |
| Chờ thẩm định | CHỜ_THẨM_ĐỊNH + ĐANG_THẨM_ĐỊNH | ? |
| Chờ phê duyệt | CHỜ_PHÊ_DUYỆT | ? |
| *(không có tab)* | YÊU_CẦU_BỔ_SUNG | không hiện trên UI |
| *(không có tab)* | VÔ_HIỆU_HÓA | không hiện trên UI |
| *(không có tab)* | TỪ_CHỐI | không hiện trên UI |

**Nhận xét:** Chỉ thấy 1 bản ghi (tab Đang hoạt động). Dữ liệu rất ít.

### Vụ việc HTPL (SM-VUVIEC — 12 trạng thái)

| Tab trên UI | Mapping SM-VUVIEC | Rows hiện có |
|-------------|-------------------|--------------|
| Tất cả | — | 4 |
| Chờ tiếp nhận | CHỜ_TIẾP_NHẬN | có data (trong 4) |
| Đang xử lý | ĐÃ_TIẾP_NHẬN + ĐANG_KIỂM_TRA + ĐÃ_PHÂN_CÔNG + ĐANG_XỬ_LÝ | có data (trong 4) |
| Chờ phê duyệt | CHỜ_PHÊ_DUYỆT | có data (trong 4) |
| Hoàn thành | ĐÃ_DUYỆT + HOÀN_THÀNH + ĐÃ_ĐÁNH_GIÁ | có data (trong 4) |
| Từ chối | TỪ_CHỐI | có data (trong 4) |
| *(không có tab)* | YÊU_CẦU_BỔ_SUNG | không hiện tab riêng |
| *(không có tab)* | MỚI_TẠO | không hiện tab riêng |

**Nhận xét:** 4 bản ghi phân bố trên các tab. UI gom nhiều state vào 1 tab (ví dụ "Đang xử lý" gom 4 state).

### Chi trả Chi phí (SM-CHITRA — 10 trạng thái)

| Tab trên UI | Mapping SM-CHITRA | Rows hiện có |
|-------------|-------------------|--------------|
| Tất cả | — | 20 |
| Chờ xử lý | CHỜ_TIẾP_NHẬN + ĐANG_KIỂM_TRA | ? |
| Đang đánh giá | ĐANG_ĐÁNH_GIÁ + ĐANG_THẨM_ĐỊNH | ? |
| Chờ phê duyệt | CHỜ_PHÊ_DUYỆT | ? |
| Đã xử lý | ĐÃ_DUYỆT + ĐÃ_THANH_TOÁN | ? |
| *(không có tab)* | YÊU_CẦU_BỔ_SUNG | không hiện tab riêng |
| *(không có tab)* | TỪ_CHỐI | không hiện tab riêng |
| *(không có tab)* | HỦY | không hiện tab riêng |

**Nhận xét:** Module có nhiều data nhất (20 rows). Dữ liệu khá phong phú cho test.

### Doanh nghiệp (Không có State Machine)

| Tab trên UI | Rows hiện có |
|-------------|--------------|
| Danh sách (không có tabs) | 1 |

**Nhận xét:** Chỉ 1 doanh nghiệp. Thiếu data nghiêm trọng cho test import, search, phân loại quy mô.

### Quản trị Hệ thống

| Tab trên UI | Rows hiện có |
|-------------|--------------|
| Danh mục (không có table) | 0 |

**Nhận xét:** Trang quản trị hiển thị menu danh mục, không phải table trực tiếp. Cần vào từng danh mục con để đếm.

---

## 2. Phân tích: Đối chiếu với §6 (State Machine)

### SM-HOIDAP — Cần data ở state nào?

| Test Path | State khởi đầu cần | Có data? | Kết luận |
|-----------|---------------------|----------|----------|
| TP-HD-01: Happy Path | MỚI | Có (tab Mới) | ĐỦ |
| TP-HD-02: Reject & Return | CHỜ_PHÊ_DUYỆT | Có (tab Chờ PD) | ĐỦ |
| TP-HD-03: Cancel | MỚI | Có | ĐỦ |
| TP-HD-04: Auto-transition | ĐANG_XỬ_LÝ (đã trả lời) | Có (tab Đang xử lý) | ĐỦ |
| TP-HD-05: Batch Approve | CHỜ_PHÊ_DUYỆT (nhiều bản ghi) | Cần >=2 bản ghi | **THIẾU** — cần thêm |
| TP-HD-06: Immutability | ĐÃ_DUYỆT | Có (tab Đã duyệt) | ĐỦ |
| TP-HD-07: Unpublish | CÔNG_KHAI | Chưa rõ | **CẦN KIỂM TRA** |

### SM-TVV — Cần data ở state nào?

| Test Path | State khởi đầu cần | Có data? | Kết luận |
|-----------|---------------------|----------|----------|
| TP-TVV-01: Happy Path | MỚI_ĐĂNG_KÝ | Chưa rõ (tab Mới ĐK) | **CẦN KIỂM TRA** |
| TP-TVV-02: Yêu cầu bổ sung | ĐANG_THẨM_ĐỊNH | Chưa rõ (tab Chờ TĐ) | **CẦN KIỂM TRA** |
| TP-TVV-03: Từ chối | CHỜ_PHÊ_DUYỆT | Chưa rõ | **CẦN KIỂM TRA** |
| TP-TVV-04: Tạm dừng/Kích hoạt | ĐANG_HOẠT_ĐỘNG | Có (1 bản ghi) | ĐỦ |
| TP-TVV-05: Vô hiệu hóa | ĐANG_HOẠT_ĐỘNG | Có (1 bản ghi) | ĐỦ |
| TP-TVV-06: Guard xóa TVV | ĐANG_HOẠT_ĐỘNG + có VV | Cần TVV có VV | **THIẾU** — cần link VV |

### SM-VUVIEC — Cần data ở state nào?

| Test Path | State khởi đầu cần | Có data? | Kết luận |
|-----------|---------------------|----------|----------|
| TP-VV-01: Happy Path | MỚI_TẠO / CHỜ_TIẾP_NHẬN | Có (tab Chờ TN) | ĐỦ |
| TP-VV-02: Yêu cầu bổ sung 3 lần | ĐANG_KIỂM_TRA | Có (tab Đang XL) | ĐỦ |
| TP-VV-03: Từ chối | ĐANG_KIỂM_TRA | Có | ĐỦ |
| TP-VV-04: Phân công lại | ĐÃ_PHÂN_CÔNG | Chưa rõ (gom trong Đang XL) | **CẦN KIỂM TRA** |
| TP-VV-05: SLA Tracking | VV mới tiếp nhận | Có | ĐỦ |
| TP-VV-06: Auto-transition trình PD | ĐANG_XỬ_LÝ | Có | ĐỦ |
| TP-VV-09: Immutability | ĐÃ_DUYỆT | Có (tab Hoàn thành) | ĐỦ |

### SM-CHITRA — Cần data ở state nào?

| Test Path | State khởi đầu cần | Có data? | Kết luận |
|-----------|---------------------|----------|----------|
| TP-CT-01: Happy Path | CHỜ_TIẾP_NHẬN | Có (20 rows, tab Chờ XL) | ĐỦ |
| TP-CT-02: Yêu cầu bổ sung 3 lần | ĐANG_KIỂM_TRA | Có | ĐỦ |
| TP-CT-03: Từ chối | ĐANG_KIỂM_TRA | Có | ĐỦ |
| TP-CT-04: Tính mức hỗ trợ | ĐANG_ĐÁNH_GIÁ | Có (tab Đang ĐG) | ĐỦ |
| TP-CT-05: CB PD từ chối | CHỜ_PHÊ_DUYỆT | Có (tab Chờ PD) | ĐỦ |
| TP-CT-06: Payment Zero Guard | ĐANG_ĐÁNH_GIÁ | Có | ĐỦ |
| TP-CT-09: Hủy hồ sơ | CHỜ_TIẾP_NHẬN | Có | ĐỦ |

### Doanh nghiệp — Cần data gì?

| Test cần | Có data? | Kết luận |
|----------|----------|----------|
| CRUD Doanh nghiệp (DN-003~005) | 1 bản ghi | **THIẾU** — cần thêm |
| Import Excel (DN-010~012) | Cần file Excel mẫu | **THIẾU** — cần tạo |
| Xóa DN có VV (DN-007) | Cần DN link VV | **THIẾU** — cần link |
| Phân loại quy mô (DN-009) | Cần DN đa quy mô | **THIẾU** — cần >=3 DN |

---

## 3. Tổng hợp: Trạng thái Data Readiness

| Module | Tổng rows | Đánh giá | Cần bổ sung |
|--------|-----------|----------|-------------|
| Hỏi đáp PL | 4 | Tạm đủ | Thêm bản ghi CHỜ_PHÊ_DUYỆT để test batch approve |
| Chuyên gia/TVV | 1 | **Thiếu nghiêm trọng** | Cần tạo TVV ở các state: Mới ĐK, Chờ TĐ, Chờ PD |
| Vụ việc HTPL | 4 | Tạm đủ | Cần verify data ở sub-state ĐÃ_PHÂN_CÔNG |
| Chi trả CP | 20 | **Đủ** | Dữ liệu phong phú nhất |
| Doanh nghiệp | 1 | **Thiếu nghiêm trọng** | Cần tạo >=5 DN đa quy mô + file Excel import |
| Quản trị HT | N/A | Cần kiểm tra riêng | Vào từng danh mục con để đếm |

### Dependency chain (thứ tự tạo data bắt buộc — từ §7.0):

```
Danh mục (Quản trị HT) → Doanh nghiệp → CG/TVV (cần ĐANG_HOẠT_ĐỘNG)  → Vụ việc → Chi trả
                                        ↘ Hỏi đáp (song song)           ↗
```

### Việc cần làm ngay:

1. **Doanh nghiệp:** Tạo thêm >=4 DN (siêu nhỏ, nhỏ, vừa, khác) + chuẩn bị 3 file Excel import
2. **Chuyên gia/TVV:** Tạo >=3 TVV mới, walk workflow qua các state: MỚI_ĐĂNG_KÝ → CHỜ_THẨM_ĐỊNH → CHỜ_PHÊ_DUYỆT → ĐANG_HOẠT_ĐỘNG
3. **Hỏi đáp:** Tạo thêm >=2 bản ghi ở CHỜ_PHÊ_DUYỆT cho test batch approve
4. **Vụ việc:** Verify sub-state, tạo thêm nếu thiếu
5. **Chi trả:** Đủ data, không cần bổ sung
