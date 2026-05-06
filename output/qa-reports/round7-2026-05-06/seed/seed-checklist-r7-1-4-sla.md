# Seed Checklist — Cấu hình SLA (R7.1.4)

**Ngày:** 2026-05-06 14:13 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-06 — Cấu hình hệ thống (tab "Thời hạn xử lý — SLA") • **Đường dẫn:** `/quan-tri/cau-hinh`
**Dữ liệu mẫu:** [seed-fixture.yaml > cau_hinh_sla_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [BR-CALC-03 + FR-VIII-06 SLA](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.A3 VV/HD/HSHT/HSTT workflow deadline | `cau_hinh_sla[loaiYeuCau].thoiHanNgay × heSo` (BR-CALC-03) | 4 loại | active | `GET /api/v1/cau-hinh/sla` → 4 record | ✅ |
| R7.5.3 SLA banner cảnh báo | `canhBao1=50%, canhBao2=90%` (BR-CALC-03) | 4 loại | active | same | ✅ |
| R7.7.13 BC04 báo cáo SLA | aggregation theo `loaiYeuCau` | 4 loại | active | same | ✅ |

**Acceptance pass:** 4 record (HOI_DAP/VU_VIEC/HO_SO_HT/HO_SO_TT) với hệ số quá hạn = 2.0, cảnh báo 50/90%.

---

## Kết quả: ✅ XONG 4/4

4 SLA pre-existing post-reset, đầy đủ field + hệ số 2.0 + cảnh báo 50/90% + 2 toggle email/app đều bật.

**Bug:** Không có.

---

## Bảng dữ liệu seed

| # | Loại yêu cầu | Tên loại | Thời hạn (ngày) | Cảnh báo 1 | Cảnh báo 2 | Hệ số quá hạn | Email | App | Status |
|---|--------------|----------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | HOI_DAP | Hỏi đáp pháp luật | 10 | 50% | 90% | 2.0 | ✅ | ✅ | ✅ |
| 2 | HO_SO_HT | Hồ sơ hỗ trợ chi phí | 15 | 50% | 90% | 2.0 | ✅ | ✅ | ✅ |
| 3 | HO_SO_TT | Hồ sơ thanh toán chi phí | 10 | 50% | 90% | 2.0 | ✅ | ✅ | ✅ |
| 4 | VU_VIEC | Vụ việc hỗ trợ pháp lý | 10 | 50% | 90% | 2.0 | ✅ | ✅ | ✅ |

**Tổng:** 4 vào kho / 0 bị chặn.

> **Note:** Fixture v2.7.1 ghi HOI_DAP=5d nhưng DB sau reset = 10d (match todo R7.1.4 header `HOI_DAP 10d`). Lệch fixture comment, không phải bug — DB ưu tiên.

---

## Ảnh chụp

- [Cấu hình SLA tab — 4 loại yêu cầu](screenshots/r7-1-4-sla-4-loai-he-so-2.png)

---

*2026-05-06 14:13 — QA chạy bằng Chrome DevTools MCP*
