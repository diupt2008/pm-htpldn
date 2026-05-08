# Seed Checklist — Tư vấn chuyên sâu (R7.3.3)

**Ngày:** 2026-05-06 14:53 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `TIEP_NHAN` (entry)
**Màn:** SCR-X1-02 — Tư vấn chuyên sâu • **Đường dẫn:** `/tv-chuyen-sau/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml v2.7.1 > tv_cs_variants[1..10]](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-X.1-01 — Tư vấn chuyên sâu (NoiDungTuVanCs)](../../../../input/srs-update-2026-5-5/srs-fr-x1-tu-van.md)

---

## Endpoint discovery (corrected R7)

| Fixture giả định | Endpoint thực BE deploy | Status |
|------------------|-------------------------|:------:|
| `/api/v1/tu-van-chuyen-saus` (R6 fixture) | `/api/v1/noi-dung-tu-van-cs` | ✅ Re-mapped |

> Endpoint `tu-van-chuyen-saus` chỉ tồn tại nhánh `/api/v1/public/tu-van-chuyen-saus/*` (public Cổng PLQG). Internal CMS dùng `/api/v1/noi-dung-tu-van-cs` (verified qua `/api/docs-json` + POST 201). Bug deploy R6.4.A5 cũ về 404 endpoint TVCS giải đáp xong — Bug TVCS-001/002 R6 đã Closed R17.

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.A5 Workflow TVCS 11 bước | `trang_thai_xu_ly=CHO_XU_LY ∨ trang_thai=TIEP_NHAN` | ≥6 | `TIEP_NHAN` | total ≥6 | ✅ |
| R7.7.5 Functional 44 TC | `trang_thai=TIEP_NHAN ∧ 6 LV cover` | ≥1/LV | `TIEP_NHAN` | per-LV ≥1 | ✅ |

**Acceptance pass:** mọi row Status ✅ qua API verify per-filter.

---

## Kết quả: ✅ XONG 10/10 TIEP_NHAN

Seed 10 TVCS qua `POST /api/v1/noi-dung-tu-van-cs` cover 6 LV (LAO_DONG/THUE/KDTM/DN/SHTT/DAT_DAI) × 2 hình thức (HO_SO 8/10 + DIEN_THOAI 2/10). State entry TIEP_NHAN. Trong 10 lần POST đầu, 5 record `hinhThucTv=VIDEO_CALL` BE trả 500 → bug log riêng + retry với `HO_SO` để đủ 10/10.

**Bug:** [`BUG-TVCS-VIDEO-CALL-001`](../../bug-reports/tu-van-chuyen-sau/bug-report-seed-r7-3-3-tvcs-video-call.md) — 0/1 đóng (Major BE 500 khi `hinhThucTv=VIDEO_CALL`).

---

## Bảng dữ liệu seed

| # | Mã TVCS | LV | Hình thức TV | DN | State | Có vào kho? |
|---|---------|----|-----|-----|-------|:----:|
| 1 | TVCS-20260506-0001 | Lao động | HO_SO | DN000003 (Đại Việt #3) | TIEP_NHAN | ✅ |
| 2 | TVCS-20260506-0002 | Thuế | DIEN_THOAI | DN000004 (Phương Đông #4) | TIEP_NHAN | ✅ |
| 3 | TVCS-20260506-0003 | SHTT | HO_SO | DN000005 (HTX Thành Đạt #5) | TIEP_NHAN | ✅ |
| 4 | TVCS-20260506-0004 | DN | HO_SO | DN000007 (Minh Khôi #7) | TIEP_NHAN | ✅ |
| 5 | TVCS-20260506-0005 | Đất đai | DIEN_THOAI | DN000011 (Trường Thịnh #11) | TIEP_NHAN | ✅ |
| 6 | TVCS-20260506-0006 | DN | HO_SO (retry) | DN000001 (Phúc An #1) | TIEP_NHAN | ✅ |
| 7 | TVCS-20260506-0007 | KDTM | HO_SO (retry) | DN000002 (Hoàng Gia #2) | TIEP_NHAN | ✅ |
| 8 | TVCS-20260506-0008 | Đất đai | HO_SO (retry) | DN000006 (Tân Phú #6) | TIEP_NHAN | ✅ |
| 9 | TVCS-20260506-0009 | DN | HO_SO (retry) | DN000009 (Phát Đạt #9) | TIEP_NHAN | ✅ |
| 10 | TVCS-20260506-0010 | Thuế | HO_SO (retry) | DN000012 (Đông Dương #12) | TIEP_NHAN | ✅ |

**Tổng:** 10 vào kho / 0 chặn (5 pass đầu + 5 retry sau bug VIDEO_CALL)

### Per-filter verify (state TIEP_NHAN)

| Filter | Total | OK |
|--------|------:|:--:|
| Total | 10 | ✅ |
| LV LAO_DONG | 1 | ✅ |
| LV THUE | 2 | ✅ |
| LV KINH_DOANH_TM | 1 | ✅ |
| LV DOANH_NGHIEP | 3 | ✅ |
| LV SO_HUU_TRI_TUE | 1 | ✅ |
| LV DAT_DAI | 2 | ✅ |
| Hình thức HO_SO | 8 | ✅ |
| Hình thức DIEN_THOAI | 2 | ✅ |
| Hình thức VIDEO_CALL | 0 | 🚫 (BE 500 — bug) |

> **Scope coverage:** Tất cả 10 record là cấp TW (`cb_nv_tw_01` tạo). Scope ĐP cần seed thêm bằng `cb_nv_dp_01` (defer R7.7.5 functional khi cần).

---

## Ảnh chụp

- [Danh sách 10 TVCS TIEP_NHAN sau seed](../screenshots/r7-3-3-tvcs-10of10-tiep-nhan.png)

---

*2026-05-06 14:53 — QA chạy bằng Chrome DevTools MCP via API POST /api/v1/noi-dung-tu-van-cs*
