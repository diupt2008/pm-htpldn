# Seed Checklist — Kế hoạch đào tạo năm (R7.3.5)

**Ngày:** 2026-05-08 09:35–09:50 • **Tài khoản:** `cb_nv_tw_02` + `cb_nv_bn_02` + `cb_nv_dp_02` • **Trạng thái mong đợi:** `Nháp` (NHAP — default per FR-III-14 Processing Bước 3)
**Màn:** SCR-III-00 — Kế hoạch đào tạo năm • **Đường dẫn:** `/dao-tao/ke-hoach/danh-sach`
**Dữ liệu mẫu:** chưa có trong [seed-fixture.yaml](../../../../../input/data/seed-fixture.yaml) — improvise theo SRS Inputs (giá trị seed ghi trong bảng dưới)
**SRS:** [FR-III-14 UC33 — Lập kế hoạch đào tạo năm](../../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-14)

---

## Downstream consumer × filter

> Quote nguyên văn SRS filter cho task downstream sẽ đọc data này.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.3.6 — Form CTĐT dropdown "Kế hoạch năm" | `kế hoạch năm cha phải DA_DUYET hoặc DA_CONG_KHAI (Mô hình A đảo chiều)` (`srs-fr-03-dao-tao.md:98` + `srs-fr-03-dao-tao.md:46`) | ≥1 KH năm DA_DUYET/DA_CONG_KHAI mỗi cấp TW/BN/DP | DA_DUYET hoặc DA_CONG_KHAI | `GET /api/v1/ke-hoach-dao-taos?trangThai=DA_DUYET&pageSize=20` → `data.length >= 1` mỗi cấp | ☐ (chưa advance state) |
| R7.4.B0 — Workflow KH năm SM-KH-DAO-TAO | NHAP → CHO_DUYET → DA_DUYET → DA_CONG_KHAI | ≥1 KH năm NHAP để gửi phê duyệt | NHAP | `GET /api/v1/ke-hoach-dao-taos?trangThai=NHAP` → `data.length >= 1` | ✅ (3/3 NHAP) |

**Acceptance pass khi:**
- ✅ R7.4.B0 sẵn sàng dùng — 3 KH năm NHAP (1 mỗi cấp).
- ☐ R7.3.6 BLOCK — cần task R7.4.B0 advance state DA_DUYET trước khi seed CTĐT.

**Quy tắc 2026-05-02 R11 áp dụng:** State `NHAP` ≠ state `DA_DUYET` mà R7.3.6 cần → **R7.3.5 chỉ là seed-create**, advance state thuộc R7.4.B0 (đã có task riêng theo Phase 4 Trụ B). Đúng phân tách.

---

## Kết quả: ✅ XONG 3/3

Seed 3 record KH năm trạng thái `Nháp` cho 3 cấp Mô hình A (TW/BN/DP) qua UI SCR-III-00 + Modal "Tạo kế hoạch đào tạo". 3/3 POST `/api/v1/ke-hoach-dao-taos` trả 201 Created.

**Bug:** [bug-report-seed-r7-3-5-kh-nam.md](../../bug-reports/dao-tao/bug-report-seed-r7-3-5-kh-nam.md) — 2 Open (1 Major BR-AUTH-08 cross-tenant data leak + 1 Medium date timezone off-by-one).

---

## Bảng dữ liệu seed

| # | Tên bản ghi | Năm | Thời gian | Ngân sách | Mã/ID | Tài khoản tạo | Trạng thái lưu | Có vào kho? |
|---|-------------|:---:|-----------|----------:|-------|---------------|:--------------:|:-----------:|
| 1 | KH ĐT năm 2026 - Cấp TW (BTP) | 2026 | 01/01/2026 → 31/12/2026 (input) / 31/12/2025 → 30/12/2026 (display ⚠️) | 2.000.000.000 | KH-20260508-0001 | `cb_nv_tw_02` (BTP-TW) | Nháp | ✅ |
| 2 | KH ĐT năm 2026 - Cấp BN (BTC) | 2026 | 01/01/2026 → 31/12/2026 (input) / 31/12/2025 → 30/12/2026 (display ⚠️) | 1.500.000.000 | KH-20260508-0002 | `cb_nv_bn_02` (BTC) | Nháp | ✅ |
| 3 | KH ĐT năm 2026 - Cấp DP (STP Bắc Giang) | 2026 | 01/01/2026 → 31/12/2026 (input) / 31/12/2025 → 30/12/2026 (display ⚠️) | 800.000.000 | KH-20260508-0003 | `cb_nv_dp_02` (STP-BG) | Nháp | ✅ |

**Tổng:** 3 vào kho / 0 bị chặn.

---

## Verify per-cấp coverage

| Cấp | Đơn vị | Account | Record seeded | API status |
|-----|--------|---------|---------------|:----------:|
| TW | BTP-TW (Cục Bổ trợ tư pháp) | `cb_nv_tw_02` | KH-20260508-0001 | POST 201 ✅ |
| BN | BTC (Bộ Tài chính) | `cb_nv_bn_02` | KH-20260508-0002 | POST 201 ✅ |
| DP | STP-BG (Sở Tư pháp Bắc Giang) | `cb_nv_dp_02` | KH-20260508-0003 | POST 201 ✅ |

---

## Ảnh chụp

- [Baseline empty](r7-3-5-kh-nam-baseline-empty.png) — list trước seed (cb_nv_tw_02, 0 record)
- [TW form filled](r7-3-5-kh-nam-tw-form-filled.png) — Modal "Tạo kế hoạch đào tạo" trước submit
- [BN list 2/2](r7-3-5-kh-nam-bn-list.png) — DP context list nhưng cũng cover BN sau seed thứ 2
- [DP list 3/3](r7-3-5-kh-nam-dp-list-3-records.png) — 3 record sau seed cuối, ⚠️ DP thấy CẢ 3 cấp (bug BR-AUTH-08)

---

*2026-05-08 09:50 — QA chạy bằng Chrome DevTools MCP (cb_nv_tw_02 default + isolatedContext bn-btc-02 + dp-bg-02 cho switch role không logout)*
