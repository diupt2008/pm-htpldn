# Seed Checklist — Thư mục + Biểu mẫu (T1.B4)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-26 23:18–23:22 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Nháp` (NHAP)
**Màn:** SCR-XII-01 (Thư viện) + SCR-XII-02 (BM list/form) • **Đường dẫn:** `/bieu-mau/thu-muc` + `/bieu-mau/danh-sach` + `/bieu-mau/them-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > thu_muc_bieu_mau_variants + bieu_mau_variants](../../../../input/data/seed-fixture.yaml) (5 thư mục + 11 BM pool)
**SRS:** [FR-IX-01](../../../../input/srs-v3/srs-fr-09-bieu-mau.md)

---

## Kết quả: ✅ XONG 4 thư mục + 7 BM (4 reuse + 1 NEW + 6 reuse BM)

Acceptance ≥4 thư mục + ≥6 BM đạt. 4 thư mục có sẵn từ R4 (Thuế / DN / HĐ Dân sự-TM / HĐ Lao động). 1 BM seed mới R5 (BM-20260426-001 Mẫu Thuyết minh thuế TNDN) + 6 BM reuse R4 (BM-20260425-001..006).

**Bug:** Không có bug Major mới. 1 observation: column "Số biểu mẫu" trên list thư mục show 0 cho cả 4 thư mục dù có 7 BM thực tế (cache stale hoặc count query lỗi).

---

## Bảng dữ liệu seed

### a) Thư mục — `/bieu-mau/thu-muc` (4/4 reuse R4)

| # | Tên thư mục | Lĩnh vực | Trạng thái | Số BM (UI) | Có vào kho? |
|---|-------------|----------|:--:|:--:|:---:|
| 1 | Biểu mẫu Thuế | Thuế | Nháp | 0 (UI) — thực 2 | ✅ reuse |
| 2 | Biểu mẫu Doanh nghiệp | Doanh nghiệp | Nháp | 0 (UI) — thực 1 | ✅ reuse |
| 3 | HĐ Dân sự - Thương mại | Kinh doanh thương mại | Nháp | 0 (UI) — thực 3 | ✅ reuse |
| 4 | HĐ Lao động | Lao động | Nháp | 0 (UI) — thực 1 | ✅ reuse |

### b) Biểu mẫu — `/bieu-mau/danh-sach` (1 NEW + 6 reuse = 7 total)

| # | Mã BM | Tên biểu mẫu | Thư mục | Định dạng | Kích thước | Trạng thái | Có vào kho? |
|---|-------|--------------|---------|:--:|:--:|:--:|:---:|
| 1 | BM-20260426-001 | Mẫu Thuyết minh thuế TNDN | Biểu mẫu Thuế | docx | 10 B | Nháp | ✅ NEW |
| 2 | BM-20260425-006 | Mẫu Hợp đồng NDA chuẩn | HĐ Dân sự - TM | docx | 954 B | Nháp | ✅ reuse |
| 3 | BM-20260425-005 | Mẫu Tờ khai thuế GTGT | Biểu mẫu Thuế | xlsx | 1.5 KB | Nháp | ✅ reuse |
| 4 | BM-20260425-004 | Mẫu HĐ thuê đất Khu CN | HĐ Dân sự - TM | docx | 954 B | Nháp | ✅ reuse |
| 5 | BM-20260425-003 | Mẫu Biên bản họp HĐTV | Biểu mẫu Doanh nghiệp | docx | 954 B | Nháp | ✅ reuse |
| 6 | BM-20260425-002 | Mẫu Hợp đồng dịch vụ | HĐ Dân sự - TM | docx | 954 B | Nháp | ✅ reuse |
| 7 | BM-20260425-001 | Mẫu Hợp đồng lao động chuẩn | HĐ Lao động | docx | 954 B | Nháp | ✅ reuse |

**Tổng:** 4 thư mục + 7 BM vào kho · 0 chặn · file doc/docx ≤ 20MB OK

---

## Observation (không log bug)

1. **Column "Số biểu mẫu" trên list thư mục show 0 cho cả 4 thư mục** dù 4 thư mục thực tế chứa 7 BM. UI count cache stale hoặc query lọc trạng thái khác (chỉ count `CONG_KHAI`?). Không có SRS clause cụ thể về count rule → ghi obs để BA xác nhận.
2. **File seed mới (BM-20260426-001) chỉ 10 byte** (dummy header docx) — đủ pass validation BE accept .docx ≤20MB. Workflow C1 `NHAP` → `CONG_KHAI` test với file thực sẽ verify lại.
3. **Thiếu thư mục thứ 5 (rỗng test xóa)** theo fixture — không seed thêm vì acceptance ≥4 đã đạt và file post-fixture v2.5 [5] thư mục rỗng dùng cho test xóa, không phải workflow. Có thể seed sau khi test C1.

---

## Ảnh chụp

- [List 7 BM tổng (no filter)](../screenshots/seed-bieumau/bm-list-7-record.png)

---

*2026-04-26 23:22 — QA chạy bằng Chrome DevTools MCP*
