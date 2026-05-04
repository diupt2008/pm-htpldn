# Seed Checklist — Chương trình đào tạo (B1)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 08:13-09:08 (retry sửa variant [5]+[6]) • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Dự thảo`
**Màn:** SCR-III-01 — Chương trình đào tạo • **Đường dẫn:** `/dao-tao/chuong-trinh/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > chuong_trinh_dao_tao_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-01 UC20 — Quản lý Chương trình đào tạo](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: ✅ XONG 6/6

**Tóm tắt 1 dòng:** Đủ 6 CTĐT `Dự thảo` (4 reuse R4 + 2 NEW R5).

**Chi tiết:**
- ✅ Variant [1..4]: dùng lại 4 CTĐT đã seed Round 4 (CTDT-BTP-TW-2026-0001..0004). Vẫn `Dự thảo`, không cần seed mới.
- ✅ Variant [5] (CTDT-BTP-TW-2026-0005 "Luật thuế DN xuất khẩu"): tạo PASS, lĩnh vực = "Thuế" (sửa đúng ở retry sau khi lần đầu chọn nhầm "Dân sự" do combobox không hỗ trợ search-by-text).
- ✅ Variant [6] (CTDT-BTP-TW-2026-0006 "HĐ thương mại khu vực ĐP-DN"): tạo PASS, lĩnh vực = "Kinh doanh thương mại" (fallback do dropdown thiếu "Hợp đồng"). Trước đó BLOCKED 6 retry vì BE revoke JWT ~50-60s — workaround: dùng phím ↓ + Enter (không dùng take_snapshot giữa các bước) để giảm số MCP call và xong trước khi token hết hạn.

**Bug:** không log bug mới. 2 regression R4 vẫn còn (chưa fix):
- `BUG-CTDT-001-R4` Major — Cột "Lĩnh vực" trên list hiển thị "-" cho cả 6/6 record.
- `BUG-CTDT-002-R4` Medium — Form Tạo CTĐT thiếu field upload file đính kèm.

---

## Bảng dữ liệu seed

| # | Tên chương trình | Lĩnh vực (chọn) | Ngân sách (VNĐ) | Số khóa | Mã/ID | Có vào kho? |
|---|------------------|------------------|------------------|---------|-------|:-----------:|
| 1 | CTĐT 2026 - Pháp luật cho DN nhỏ | Kinh doanh thương mại *(reuse R4, fallback DOANH_NGHIEP)* | 800.000.000 | 6 | `CTDT-BTP-TW-2026-0001` | ✅ |
| 2 | CTĐT 2026 - ATLĐ ngành xây dựng | Lao động *(reuse R4)* | 500.000.000 | 3 | `CTDT-BTP-TW-2026-0002` | ✅ |
| 3 | CTĐT 2026 - SHTT cho startup | Sở hữu trí tuệ *(reuse R4)* | 300.000.000 | 2 | `CTDT-BTP-TW-2026-0003` | ✅ |
| 4 | CTĐT 2025 - Luật đất đai | Đất đai *(reuse R4)* | 400.000.000 | 2 | `CTDT-BTP-TW-2026-0004` | ✅ |
| 5 | CTĐT 2026 - Luật thuế DN xuất khẩu | Thuế *(NEW R5)* | 250.000.000 | 3 | `CTDT-BTP-TW-2026-0005` | ✅ |
| 6 | CTĐT 2026 - HĐ thương mại khu vực ĐP-DN | Kinh doanh thương mại *(NEW R5, fallback HOP_DONG)* | 180.000.000 | 2 | `CTDT-BTP-TW-2026-0006` | ✅ |

**Tổng:** 6 vào kho / 0 bị chặn. Tất cả 6 ở trạng thái `Dự thảo`. List BE response 6/6 mục.

---

## Quan sát ngoài SRS (không log bug)

- **O1 — Dropdown Lĩnh vực thiếu `DOANH_NGHIEP` + `HOP_DONG`** (regression lần thứ 6 cross-round, đã ghi memory `qa_htpldn_baigiang_seed_round4` 5 lần). Dropdown 10 option: Dân sự / Hình sự / Hành chính / Lao động / Đất đai / Hôn nhân gia đình / Kinh doanh thương mại / Khiếu nại tố cáo / Thuế / Sở hữu trí tuệ. Variant [1] đã fallback "Kinh doanh thương mại" R4; variant [6] cần "Hợp đồng" — không có giá trị tương đương. Không log bug do SRS FR-III-01 không liệt kê giá trị dropdown bắt buộc — đây là data-driven (DANH_MUC `LINH_VUC_PL`).
- **O2 — Type-ahead search trong combobox Lĩnh vực không filter** + Enter chọn first option (Dân sự) bất kể text đã gõ. Variant [5] lần đầu gõ "Thuế" + Enter ra "Dân sự" → phải retry vào trang detail dùng phím ↓ × 8 + Enter để chọn đúng "Thuế". Workaround chính thức: dùng phím ↓ + Enter (không gõ text). Không log bug do SRS không spec hành vi type-ahead.
- **O3 — BE revoke JWT aggressive ~50-60 giây** mỗi session bất chấp `exp` claim ≥15 phút (đã ghi memory `qa_htpldn_jwt_revoke_aggressive` ở T1.B4 BIEU_MAU). Mỗi action UI (snapshot/click/type) tốn 5-10s → 1 form submit cần ~7 step → vượt ngưỡng 50s. Variant [6] lần đầu BLOCKED 6 retry; lần sau xong nhờ skip take_snapshot giữa các bước (dùng phím ↓ trực tiếp). Đề nghị dev BE verify session timeout config + cân nhắc bump cho QA env.
- **O4 — Form không có các field `hinh_thuc / thoi_gian_bat_dau / thoi_gian_ket_thuc / doi_tuong`** mà fixture có. Lặp lại obs O3 R4 — SRS FR-III-01 §Inputs CTDT chỉ liệt kê 8 field (không có 4 field này) → form đúng FR-III-01, fixture vượt scope SRS.

---

## Cascade impact

- **B2** (push CTĐT → DA_DUYET) UNBLOCK với 6 CTĐT DU_THAO sẵn sàng (CTDT-0001..0006).
- **B3** (Khóa học gắn CTĐT) chờ B2 PASS như cũ.
- **B7** (Workflow Khóa học đầy đủ) variant [6] CTDT-0006 fallback lĩnh vực "Kinh doanh thương mại" thay HOP_DONG — chấp nhận được vì test isolation không filter theo lĩnh vực chính xác.
- **T4.6** (Functional Khóa học 40 TC) variant [6] CTDT-0006 lĩnh vực fallback có thể ảnh hưởng TC filter-by-LV "Hợp đồng" — verify lại khi T4.6 chạy.

---

## Ảnh chụp

- [List 6/6 record sau retry (cột Lĩnh vực = "-" — BUG-CTDT-001-R4 regression)](../screenshots/ctdt-b1-r5-list-6of6-final.png)
- [List 5/6 (snapshot trước retry)](../screenshots/ctdt-b1-r5-list-5of6.png)

---

*2026-04-27 09:08 — QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01` (retry sửa variant [5]+[6] sau feedback)*
