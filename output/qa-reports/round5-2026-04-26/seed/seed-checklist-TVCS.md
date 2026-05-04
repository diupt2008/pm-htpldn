# Seed Checklist — Tư vấn chuyên sâu (T1.C3)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 01:02 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `TIẾP NHẬN`
**Màn:** SCR-X1-02 — Tư vấn chuyên sâu • **Đường dẫn:** `/tv-chuyen-sau/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > tv_cs_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-X.1-01 SM-TVCS

---

## Kết quả: ✅ XONG 6/6 entry TIẾP NHẬN (full reuse R4)

Module có sẵn 6 TVCS state `Tiếp nhận` từ R4 (TVCS-20260424-0001..0006) — đạt acceptance ≥6, không seed thêm.

**Bug:** 0 SRS-ref bug mới • 1 obs (regression "Invalid Date" cột Ngày bắt đầu).

---

## Bảng dữ liệu seed (tất cả reuse R4)

| # | Mã TVCS | DN | Lĩnh vực | Tóm tắt | Trạng thái |
|---|---------|-----|----------|---------|------------|
| 1 | TVCS-20260424-0001 | Alpha | Doanh nghiệp | Tư vấn cơ cấu lại nợ + tái cấu trúc tài chính | Tiếp nhận |
| 2 | TVCS-20260424-0002 | Beta | KDTM | Tranh chấp HĐ thương mại quốc tế | Tiếp nhận |
| 3 | TVCS-20260424-0003 | Gamma | Lao động | Nội quy LĐ + thang bảng lương 200 LĐ | Tiếp nhận |
| 4 | TVCS-20260424-0004 | Delta | Thuế | Khiếu nại quyết định xử phạt thuế GTGT | Tiếp nhận |
| 5 | TVCS-20260424-0005 | Epsilon IT | SHTT | Bảo hộ nhãn hiệu quốc tế Madrid | Tiếp nhận |
| 6 | TVCS-20260424-0006 | Zeta Giáo dục | Đất đai | Thuê đất mở cơ sở đào tạo | Tiếp nhận |

**Tổng:** 6/6 vào kho.

---

## Quan sát

- **Obs 1 — regression "Invalid Date":** Cột "Ngày bắt đầu" hiển thị `Invalid Date` cho cả 6 record. Memo R4 ghi nhận `BUG-TVV-001-R4` similar pattern (FE ProForm DatePicker). Cần check còn open hay đã fix khi advance workflow A5.
- **Obs 2 — Chuyên gia trống:** Cột "Chuyên gia" = `-` cho cả 6 — đúng bản chất state `Tiếp nhận` (chưa phân công CG).

---

*2026-04-27 01:02 — QA chạy bằng Chrome DevTools MCP*
