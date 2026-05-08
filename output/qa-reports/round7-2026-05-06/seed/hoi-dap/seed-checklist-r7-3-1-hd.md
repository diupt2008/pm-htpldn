# Seed Checklist — Hỏi đáp pháp lý (R7.3.1)

> ⚠️ **Method gap (note 2026-05-08):** Task chạy qua API thuần `POST /api/v1/cau-hois` — vi phạm rule UI-only ban hành 2026-05-07. Cần re-test UI MCP R8. Xem [`tasks/lessons-learned.md` 2026-05-08](../../../../../tasks/lessons-learned.md).

**Ngày:** 2026-05-06 14:47 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `MỚI` (entry)
**Màn:** SCR-II-01 — Quản lý hỏi đáp • **Đường dẫn:** `/hoi-dap`
**Dữ liệu mẫu:** [seed-fixture.yaml v2.7.1 > hoi_dap_variants[1..6]](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-II-01 — Hỏi đáp pháp lý](../../../../input/srs-update-2026-5-5/srs-fr-ii-hoi-dap.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.A4 Workflow Hỏi đáp 11 transition | `trang_thai=MOI` (FR-II-01) | ≥6 / 6 LV × 4 kênh | `MOI` | `GET /api/v1/hoi-daps?trangThai=MOI` → 6 ≥ 6 | ✅ |
| R7.7.1 Functional 12 TC | `trang_thai=MOI ∧ linh_vuc khớp 6 LV` | ≥1/LV | `MOI` | per-LV count ≥1 | ✅ |
| R7.5.1 Dashboard KPI Hỏi đáp mới | tab counter `MOI` | total = 6 | `MOI` | dashboard `Hỏi đáp mới: 6` | ✅ |

**Acceptance pass:** mọi row Status ✅ qua API verify.

---

## Kết quả: ✅ XONG 6/6

Seed 6 HD entry MOI qua `POST /api/v1/hoi-daps` cover 6 LV (LAO_DONG/THUE/KINH_DOANH_TM/DOANH_NGHIEP/SHTT/DAT_DAI) × 4 kênh (TRUC_TIEP/DVC/CONG_PLQG/HE_THONG_KHAC). Verify per-filter PASS.

**Bug:** Không.

---

## Bảng dữ liệu seed

| # | Mã HD | Lĩnh vực | Kênh | DN gắn | Tiêu đề | Có vào kho? |
|---|-------|----------|------|--------|---------|:-----------:|
| 1 | HD-20260506-001 | Lao động | Trực tiếp | DN000001 | Hỏi về thời gian nghỉ phép năm | ✅ |
| 2 | HD-20260506-002 | Thuế | Dịch vụ công | DN000002 | Hoàn thuế GTGT đầu vào hàng nhập khẩu | ✅ |
| 3 | HD-20260506-003 | Kinh doanh thương mại | Cổng PLQG | DN000003 | Thời hạn HĐ lao động xác định thời hạn | ✅ |
| 4 | HD-20260506-004 | Doanh nghiệp | Dịch vụ công | DN000004 | Thủ tục tăng vốn điều lệ TNHH 2TV | ✅ |
| 5 | HD-20260506-005 | Sở hữu trí tuệ | Cổng PLQG | DN000005 | Đăng ký bảo hộ nhãn hiệu sản phẩm mới | ✅ |
| 6 | HD-20260506-006 | Đất đai | Hệ thống khác | DN000006 | Thế chấp đất KCN trả tiền hàng năm | ✅ |

**Tổng:** 6 vào kho / 0 chặn

### Per-filter verify

| Filter | Total | OK |
|--------|------:|:--:|
| Total state MOI | 6 | ✅ |
| LV LAO_DONG | 1 | ✅ |
| LV THUE | 1 | ✅ |
| LV KINH_DOANH_TM | 1 | ✅ |
| LV DOANH_NGHIEP | 1 | ✅ |
| LV SO_HUU_TRI_TUE | 1 | ✅ |
| LV DAT_DAI | 1 | ✅ |
| Kênh TRUC_TIEP | 1 | ✅ |
| Kênh DVC | 2 | ✅ |
| Kênh CONG_PLQG | 2 | ✅ |
| Kênh HE_THONG_KHAC | 1 | ✅ |

---

## Ảnh chụp

- [Danh sách 6 HD MOI sau seed](../screenshots/r7-3-1-hd-6of6-moi.png)

---

*2026-05-06 14:47 — QA chạy bằng Chrome DevTools MCP via API POST /api/v1/hoi-daps*
