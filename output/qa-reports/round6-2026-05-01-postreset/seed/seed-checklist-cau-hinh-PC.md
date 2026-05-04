# Seed Checklist — Cấu hình Phân công mặc định Đợt 1 (R6.2.9a)

**Ngày:** 2026-05-01 18:35 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `Kích hoạt`
**Màn:** SCR-VIII-03 — Cấu hình hệ thống / tab Phân công mặc định • **Đường dẫn:** `/quan-tri/cau-hinh?tab=phan-cong`
**Dữ liệu mẫu:** [seed-fixture.yaml > cau_hinh_phan_cong_variants.dot_1_cb_only](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-VIII-03 — Cấu hình phân công

---

## Downstream consumer × filter

| Task downstream | Đọc filter | Số record cần | Status |
|-----------------|------------|---------------|:---:|
| R6.4.A4 HD Bước 2 — Auto phân công CB | `linhVuc=X ∧ uuTien=1 ∧ donVi=TW-CUC` cho 6 LV | ≥1 PC/LV × 6 LV | ✅ 6/6 |
| R6.4.A1 TVV (không phụ thuộc PC) | — | — | — |

**Acceptance gate cho A4:** mỗi LV phải có ≥1 PC active để workflow auto-assign khi DN hỏi đáp pháp lý đó.

---

## Kết quả: ✅ PASS 6/6 (2026-05-01 22:00 R6 sau BE recover)

Tất cả 6 row saved sau khi BE recover. Lao động + Thuế + Hợp đồng (saved 18:30 R1), KDTM + Đất đai + HNGĐ (saved 22:00 R2). Tất cả → cb_nv_tw_01 / Ưu tiên 1 / Kích hoạt / Đơn vị TW-Cục Bổ trợ.

**Bug:** không có. BE crash R1 đã self-recover.

---

## Bảng dữ liệu seed

| # | Lĩnh vực | Đơn vị áp dụng | Người xử lý | Ưu tiên | Trạng thái | Có vào kho? |
|---|----------|----------------|-------------|:-------:|------------|:-----------:|
| 1 | Lao động | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ |
| 2 | Thuế | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ |
| 3 | Hợp đồng | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ |
| 4 | Kinh doanh thương mại | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ R2 |
| 5 | Đất đai | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ R2 |
| 6 | Hôn nhân gia đình | Cục Bổ trợ tư pháp - Bộ Tư pháp (TW) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ R2 |

**Tổng:** 6 vào kho / 0 bị chặn. Evidence: [r6-r62.9a-6PC-saved-final.png](../screenshots/r6-r62.9a-6PC-saved-final.png)

---

## Note adapt fixture

Fixture spec gốc dùng `DOANH_NGHIEP` + `SHTT` — đã adapt thay bằng `KINH_DOANH_TM` + `HON_NHAN_GIA_DINH` theo handoff §5 (BUG-FUNC-TVV-002 dropdown LV cap 10/13). Tuy nhiên dropdown trong form PC trả đầy đủ 13 LV (verify 2026-05-01) — có thể dùng `DOANH_NGHIEP`/`SHTT` được nhưng giữ adapt v2.6.3 cho consistency với R6.

---

## Bug observation: BE down giữa session

**Symptom:**
- `POST /api/v1/cau-hinh-phan-congs` → `net::ERR_CONNECTION_REFUSED` (reqid 311+)
- `curl http://103.172.236.130:3000/` → `Connection refused, port 3000`
- 3 row đầu (1-3) save thành công với HTTP 201 (reqid 297, 304, +1)
- Row 4 KDTM modal stuck với data đã fill — submit thất bại do BE down

**Phân loại theo Rule 9:** ENV DOWN — STOP, escalate user/dev team. Không phải workflow bug.

**Time:** BE crash khoảng 18:30 sau khi save 3 row PC (3 POST 201 thành công liên tiếp).

---

## Việc cần làm tiếp (sau BE recover)

1. Refresh page → verify 3 row Lao động/Thuế/Hợp đồng vẫn còn.
2. Tiếp seed 3 row còn lại: KDTM, Đất đai, Hôn nhân gia đình.
3. Verify dropdown "Người xử lý" — trả 15 options (filter theo Loại TK ≠ Doanh nghiệp/QTHT).

---

## Pattern MCP đã verify (form Thêm cấu hình phân công)

Form 4 field bắt buộc:
- Đơn vị áp dụng — combobox `Cục Bổ trợ tư pháp - Bộ Tư pháp (TW)` (chỉ 1 option scope TW khi seed bằng QTHT TW)
- Lĩnh vực — combobox 13 LV full (NO BUG-FUNC-TVV-002 ở dropdown này)
- Người xử lý — combobox 15 options (CB NV/PD + Chuyên gia + TVV — không bao gồm DN/QTHT). Filter theo type text empty → phải clear filter để chọn theo display name
- Ưu tiên — spinbutton, default 1, range valuemin=1 (max=0 wrong nhưng app đặt fallback)

**Tiêu đề tab:** "Cấu hình phân công hỏi đáp" — chỉ scope HOI_DAP. SRS có thể spec PC riêng cho VV/TVCS sub-tab khác. Để verify sau.

---

## Ảnh chụp

(BE crash — chưa kịp screenshot 3 row)

---

*2026-05-01 18:35 — QA chạy bằng Chrome DevTools MCP*
