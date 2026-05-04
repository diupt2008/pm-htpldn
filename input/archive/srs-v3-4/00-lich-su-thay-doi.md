# Lịch sử thay đổi

| Phiên bản | Ngày | Tác giả | Mô tả thay đổi |
|-----------|------|---------|-----------------|
| 1.0–2.1 | 2026-03-25 → 2026-04-02 | SRS Agent | Xem SRS-claude-v2.md cho lịch sử chi tiết v1.0–v2.1 |
| 3.0 | 2026-04-03 | SRS Agent (Claude) | **Tái cấu trúc theo SRS Template v3.0:** (1) Section 3.2 FR chi tiết tách thành 16 file riêng per nhóm UC. (2) Kiểu dữ liệu LOGIC xuyên suốt — loại bỏ mọi physical DB types (BIGINT, VARCHAR, JSONB → identifier, text, structured). (3) Section 3.2.0.2 viết lại thành "Quy ước kiểu dữ liệu logic". (4) Section 3.2.0.4 viết lại — chỉ giữ quy tắc nghiệp vụ, loại bỏ thuật ngữ kỹ thuật (RLS, NestJS guard, JWT, pg_terminate_backend). (5) ERD chuyển sang logical types. (6) Edge cases viết lại bằng ngôn ngữ nghiệp vụ. |
| 3.2 | 2026-04-16 | BA | CR từ đối tác (10 CR + 9 comments + 20 TC): TO_CHUC_TU_VAN entity mới, 5 Common Public Fields cho 12 entities, 5 BR mới, 1 SM mới, KE_HOACH_DAO_TAO fix mismatch, 4 module rename, DN chọn cơ quan, FR-IV-NEW-01, FR-VI-10 |

---
