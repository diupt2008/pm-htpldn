# Seed Checklist — Chương trình đào tạo (T2.A5a)

**Ngày:** 2026-04-25 21:55-22:01 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `DỰ THẢO`
**Màn:** SCR-III-01 — Chương trình đào tạo • **Đường dẫn:** `/dao-tao/chuong-trinh/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > chuong_trinh_dao_tao_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-01 UC20 — Quản lý Chương trình đào tạo](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: ✅ XONG 4/4

Seed 4 CTĐT trạng thái Dự thảo thành công, phục vụ T2.A5b (Khóa học gắn CTĐT). Phát hiện 1 Major bug list display + 1 Medium gap form thiếu field `file_dinh_kem`.

**Bug:** [`BUG-CTDT-001-R4`](../bug-reports/bug-report-seed-ctdt-t2a5a.md) Major — Cột "Lĩnh vực" trên list hiển thị "-" mặc dù BE trả `tenLinhVuc` đầy đủ • [`BUG-CTDT-002-R4`](../bug-reports/bug-report-seed-ctdt-t2a5a.md) Medium — Form thiếu `file_dinh_kem` (SRS FR-III-01 §Inputs CTDT row 8).

---

## Bảng dữ liệu seed

| # | Tên chương trình | Lĩnh vực (chọn) | Ngân sách (VNĐ) | Số khóa | Mã/ID | Có vào kho? |
|---|------------------|------------------|------------------|---------|-------|:-----------:|
| 1 | CTĐT 2026 - Pháp luật cho DN nhỏ | Kinh doanh thương mại *(fallback DOANH_NGHIEP)* | 800.000.000 | 6 | `CTDT-BTP-TW-2026-0001` | ✅ |
| 2 | CTĐT 2026 - ATLĐ ngành xây dựng | Lao động | 500.000.000 | 3 | `CTDT-BTP-TW-2026-0002` | ✅ |
| 3 | CTĐT 2026 - SHTT cho startup | Sở hữu trí tuệ | 300.000.000 | 2 | `CTDT-BTP-TW-2026-0003` | ✅ |
| 4 | CTĐT 2025 - Luật đất đai | Đất đai | 400.000.000 | 2 | `CTDT-BTP-TW-2026-0004` | ✅ |

**Tổng:** 4 vào kho / 0 bị chặn. Tất cả ở trạng thái **Dự thảo**, BE response `meta.total = 4`.

---

## Quan sát ngoài SRS (không log bug)

- **O1 — Dropdown Lĩnh vực thiếu `DOANH_NGHIEP` + `HOP_DONG`** (regression lần thứ 4 cross-round, trùng obs đã ghi ở T2.A1 / NHCH / BAI_GIANG / KHOA_HOC). Dropdown 10 option: Dân sự / Hình sự / Hành chính / Lao động / Đất đai / Hôn nhân gia đình / Kinh doanh thương mại / Khiếu nại tố cáo / Thuế / Sở hữu trí tuệ. Fixture #1 `linh_vuc_id="DOANH_NGHIEP"` đã fallback sang **Kinh doanh thương mại** (gần nghĩa nhất). Không log bug do SRS FR-III-01 không liệt kê các giá trị dropdown bắt buộc — đây là data-driven (DANH_MUC `LINH_VUC_PL`).
- **O2 — Mã CTĐT format khớp `CTDT-{DON_VI}-{LEVEL}-{YYYY}-{SEQ}`** (SRS FR-III-01 §Inputs CTDT row 1) thay vì `CTDT-YYYYMMDD-SEQ` (SRS Entity 3.4.3.19 row 2). Hai chỗ trong SRS mâu thuẫn nội bộ; FE/BE chọn theo FR row 1 — phù hợp với fixture + R1. Không log bug, escalate BA clarify SRS.
- **O3 — Form không có các field `hinh_thuc / thoi_gian_bat_dau / thoi_gian_ket_thuc / doi_tuong`** mà fixture có. SRS FR-III-01 §Inputs CTDT chỉ liệt kê 8 field (không có 4 field này) → form đúng FR-III-01, fixture đang vượt scope SRS. Không log bug.
- **O4 — Toast "Tạo chương trình đào tạo thành công"** xuất hiện khi tạo #3 nhưng không xuất hiện khi #1/#2/#4 (timing variant). Không log bug do SRS không spec về toast.

---

## Ảnh chụp

- [List rỗng trước seed (init state)](../screenshots/ctdt-t2a5a-list-empty-init.png)
- [List 4/4 record sau seed (cột Lĩnh vực = "-" — bug)](../screenshots/ctdt-t2a5a-pass-4of4-list.png)

---

*2026-04-25 22:01 — QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01`*
