# Decision — Đồng bộ thứ tự module test (2026-04-24)

Đồng bộ thứ tự module giữa 2 file nguồn:
- `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` (LỚP 1-5, ①-⑯ + ⑭-bis)
- `input/flow-module.md` (BƯỚC 1-5, §1-§16)

## Quyết định chốt

1. **FR-15 CT HTPLDN tách 2 giai đoạn:**
   - GĐ1 Kế hoạch: LỚP 2/BƯỚC 2 (chỉ phụ thuộc FR-10)
   - GĐ2 Đợt BC: LỚP 5/BƯỚC 5 (cần số liệu VV/Chi trả/Đào tạo trong kỳ)
2. **FR-09 Biểu mẫu** xếp LỚP 2/BƯỚC 2 (master tài liệu độc lập, không phải "phụ trợ")
3. **FR-03 Đào tạo** giữ LỚP 3/BƯỚC 3 (cùng nhóm core transaction với FR-05/FR-02/FR-12)
4. **FR-08 ĐG HQ vs FR-13 TV Nhanh** (LỚP 4): không có dependency, thứ tự linh hoạt
5. **FR-16 API** bổ sung vào F2 BƯỚC 5

## Lý do

Trước sync, 2 file lệch 3 chỗ (FR-15 master vs đầu ra / FR-09 master vs phụ trợ / F2 thiếu FR-16) gây confuse thứ tự seed + test. Tách FR-15 2 giai đoạn vì GĐ1 và GĐ2 có dependency profile khác nhau.

## Cách dùng

- Test plan mới: tra `02-thu-tu-module.md` để xác định LỚP và phụ thuộc upstream.
- Seed E2E: dùng `flow-module.md` Phụ lục 2 preset P1-P4.
- Test FR-15: GĐ1 sớm sau QTHT (P3.3 todo R5), GĐ2 sau Layer 3+4 có data (P3.4).
