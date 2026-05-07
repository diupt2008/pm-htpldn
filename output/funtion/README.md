# Test Case Matrix — 16 Module đang hoạt động

> **Nguồn gốc:** Tách từ [test-strategy.md §7](../test-strategy.md#7-test-case-matrix--16-module-đang-hoạt-động)
> Mỗi file dưới đây là một module độc lập chứa đầy đủ bối cảnh, State Machine, Business Rules, Data Readiness và Test Case Matrix.
> **Thứ tự số khớp [../../input/srs-v3/](../../input/srs-v3/)** — `7.N-<module>.md` tương ứng với `srs-fr-N-<module>.md`.

## Danh sách module

| # | Module | File | FR | Tổng TC | P0 | P1 | P2 |
|---|--------|------|----|---------|----|----|-----|
| 7.1 | Dashboard ✏️ v3.5 | [7.1-dashboard.md](7.1-dashboard.md) | 11 | 51 | 22 | 24 | 5 |
| 7.2 | Hỏi đáp Pháp luật ✏️ v3.5 | [7.2-hoi-dap-phap-ly.md](7.2-hoi-dap-phap-ly.md) | 13 | 57 (60 - 3 deprecated) | 27 | 26 | 4 |
| 7.3 | Đào tạo, Tập huấn ✏️ v3.5 | [7.3-dao-tao-tap-huan.md](7.3-dao-tao-tap-huan.md) | 24 | 65 (68 - 3 deprecated Hướng B) | 22 | 37 | 6 |
| 7.4 | Chuyên gia/TVV | [7.4-chuyen-gia-tvv.md](7.4-chuyen-gia-tvv.md) | 13 | 31 | 10 | 17 | 4 |
| 7.5 | Vụ việc HTPL | [7.5-vu-viec-htpl.md](7.5-vu-viec-htpl.md) | 19 | 35 | 14 | 16 | 5 |
| 7.6 | Chi trả Chi phí ✏️ v3.5 | [7.6-chi-tra-chi-phi.md](7.6-chi-tra-chi-phi.md) | 14 | 35 | 15 | 16 | 4 |
| 7.7 | Quản lý Doanh nghiệp | [7.7-quan-ly-doanh-nghiep.md](7.7-quan-ly-doanh-nghiep.md) | 3 | 18 | 4 | 11 | 3 |
| 7.8 | Đánh giá Hiệu quả | [7.8-danh-gia.md](7.8-danh-gia.md) | 9 | 40 | 14 | 22 | 4 |
| 7.9 | Thư viện Biểu mẫu ✏️ v3.5 | [7.9-bieu-mau.md](7.9-bieu-mau.md) | 7 | 47 (3 TC HĐTV moved → 7.14) | 17 | 28 | 2 |
| 7.10 | Quản trị Hệ thống | [7.10-quan-tri-he-thong.md](7.10-quan-tri-he-thong.md) | 25 | 32 | 12 | 17 | 3 |
| 7.11 | Báo cáo Thống kê ✏️ v3.5 | [7.11-bao-cao-thong-ke.md](7.11-bao-cao-thong-ke.md) | 23 | 40 | 12 | 23 | 5 |
| 7.12 | Tư vấn Chuyên sâu | [7.12-tu-van-chuyen-sau.md](7.12-tu-van-chuyen-sau.md) | 7 | 44 | 16 | 25 | 3 |
| 7.13 | Tư vấn Nhanh ✏️ v3.5 | [7.13-tu-van-nhanh.md](7.13-tu-van-nhanh.md) | 6 | 44 | 14 | 28 | 2 |
| 7.14 | Hợp đồng Tư vấn ✏️ v3.5 | [7.14-hop-dong-tv.md](7.14-hop-dong-tv.md) | 2 | 34 | 10 | 22 | 2 |
| 7.15 | Chương trình HTPLDN ✏️ v3.5 | [7.15-chuong-trinh-HTPLDN.md](7.15-chuong-trinh-HTPLDN.md) | 11 | 44 | 15 | 24 | 5 |
| 7.16 | API Kết nối Chia sẻ Dữ liệu | [7.16-API-ket-noi-chia-se.md](7.16-API-ket-noi-chia-se.md) | 18 | 42 | 13 | 24 | 5 |
| | **Tổng** | | **205** | **659** | **237** | **360** | **62** |

## Tham chiếu tới tài liệu chiến lược gốc

- [test-strategy.md](../test-strategy.md) — tài liệu chiến lược đầy đủ
- [§1.2 Tài khoản test](../test-strategy.md#12-tài-khoản-test)
- [§3 Chiến lược kiểm thử](../test-strategy.md#3-chiến-lược-kiểm-thử)
- [§5 Ma trận phân quyền cần test](../test-strategy.md#5-ma-trận-phân-quyền-cần-test)
- [§6 Test theo State Machine](../test-strategy.md#6-test-theo-state-machine)
- [§7.0 Data Readiness (phương pháp chung)](../test-strategy.md#70-data-readiness--phương-pháp-chuẩn-bị-dữ-liệu-test)
- [§9 Môi trường kiểm thử](../test-strategy.md#9-môi-trường-kiểm-thử)
- [§12 Kế hoạch thực hiện](../test-strategy.md#12-kế-hoạch-thực-hiện)
- [permission-matrix.md](../permission-matrix.md) — Tầng 2 phân quyền (~550 TC)

## Phương pháp Data Readiness (§7.0 rút gọn)

Trước khi chạy functional test, dùng §6 State Machine để xác định states cần data:

1. **Xác định state cần:** Mỗi test path cần bản ghi ở state khởi đầu.
2. **Smoke test đếm:** Dùng `/browse` → đếm rows từng tab trạng thái → tab trống = cần tạo data.
3. **Tạo data thiếu:** Walk workflow theo §6 để đẩy bản ghi đến state cần.
4. **Verify:** Đếm lại → mọi state cần có đã có ≥1 bản ghi.

**Dependency chain (thứ tự tạo data bắt buộc):**

```
Danh mục → Doanh nghiệp → CG/TVV (cần DANG_HOAT_DONG) → Vụ việc → Chi trả
                       ↘ Hỏi đáp (song song)           ↗
```

**Dữ liệu phi-workflow (chuẩn bị trước):**

| # | Loại | Mục đích |
|---|------|---------|
| 1 | Tài khoản test (xem §1.2) | Test phân quyền đa vai trò |
| 2 | 3 file Excel import DN | Test DN-010/011/012 (hợp lệ / lỗi format / MST trùng) |
| 3 | File đính kèm (PDF/DOCX) | Test upload HD-023, VV-025 |

## Phân biệt 2 tầng test phân quyền

- **40 TC authorization trong §7 (các file này)** = smoke-level — verify nhanh mỗi role có/không có quyền trên module đó (chạy cùng functional test).
- **~550 TC trong [permission-matrix.md](../permission-matrix.md)** = full coverage — test từng ô Entity × Role (chạy riêng ở Tuần 4, §12.1).
