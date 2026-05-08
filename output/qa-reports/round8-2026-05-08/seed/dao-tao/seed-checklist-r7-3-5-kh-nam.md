# Seed Checklist — Kế hoạch đào tạo năm (R7.3.5 — R8 re-run)

**Ngày:** 2026-05-08 18:23–18:42 • **Tài khoản:** `cb_nv_tw_02` + `cb_nv_bn_02` + `cb_nv_dp_02` • **Trạng thái mong đợi:** `Nháp` (NHAP — default per FR-III-14 Processing Bước 3)
**Màn:** SCR-III-00 — Kế hoạch đào tạo năm • **Đường dẫn:** `/dao-tao/ke-hoach/danh-sach`
**Dữ liệu mẫu:** chưa có trong [seed-fixture.yaml](../../../../../input/data/seed-fixture.yaml) — improvise theo SRS Inputs (giá trị seed ghi trong bảng dưới)
**SRS:** [FR-III-14 UC33 — Lập kế hoạch đào tạo năm](../../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-14)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho task downstream sẽ đọc data này. Cover combinatorial = cấp × trạng thái.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.B0 — Workflow KH năm SM-KH-DAO-TAO | `NHAP → CHO_DUYET → DA_DUYET → DA_CONG_KHAI` (FR-III-14 Processing-Gửi phê duyệt Bước 4) | ≥1 KH năm NHAP để gửi phê duyệt mỗi cấp | NHAP | `GET /api/v1/ke-hoach-dao-taos?trangThai=NHAP` → `data.length >= 1` mỗi cấp | ✅ (3/3 NHAP cover TW/BN/DP) |
| R7.3.6 — Form CTĐT dropdown "Kế hoạch năm" | `kế hoạch năm cha phải DA_DUYET hoặc DA_CONG_KHAI (Mô hình A đảo chiều)` (`srs-fr-03-dao-tao.md:98` + `srs-fr-03-dao-tao.md:46`) | ≥1 KH năm DA_DUYET/DA_CONG_KHAI mỗi cấp TW/BN/DP | DA_DUYET hoặc DA_CONG_KHAI | `GET /api/v1/ke-hoach-dao-taos?trangThai=DA_DUYET&pageSize=20` | ☐ (chưa advance state — thuộc R7.4.B0) |

**Acceptance pass khi:**
- ✅ R7.4.B0 sẵn sàng dùng — 3 KH năm NHAP (1 mỗi cấp TW/BN/DP).
- ☐ R7.3.6 BLOCK — cần task R7.4.B0 advance state DA_DUYET trước khi seed CTĐT.

**Quy tắc 2026-05-02 R11:** State `NHAP` ≠ state `DA_DUYET` mà R7.3.6 cần → **R7.3.5 chỉ là seed-create**, advance state thuộc R7.4.B0.

---

## Kết quả: ✅ XONG 3/3 (R8 re-run)

Re-seed 3 record KH năm trạng thái `Nháp` cho 3 cấp Mô hình A (TW/BN/DP) qua UI SCR-III-00 + Modal "Tạo kế hoạch đào tạo". 3/3 POST `/api/v1/ke-hoach-dao-taos` trả 201 Created. Đã DELETE 2 record NHAP cũ (BN-0002, DP-0003) qua API 204 (UI thiếu nút Xoá — bug mới). Record TW-0001 cũ giữ nguyên (state `CHO_DUYET` không xoá được theo SRS BR-FLOW-03).

**Bug:** [bug-report-seed-r7-3-5-kh-nam.md](../../bug-reports/dao-tao/bug-report-seed-r7-3-5-kh-nam.md) — **3 Open** (1 Major BR-AUTH-08 cross-tenant data leak re-confirmed BACKEND + 1 Major UI thiếu nút Xoá + 1 Medium date timezone off-by-one BACKEND).

---

## Bảng dữ liệu seed (R8 round)

| # | Tên bản ghi | Năm | Thời gian (input) | Thời gian (BE lưu) | Ngân sách | Mã | UUID | Tài khoản tạo | Trạng thái | Có vào kho? |
|---|-------------|:---:|-------------------|--------------------|----------:|----|------|---------------|:----------:|:-----------:|
| 1 | KH ĐT năm 2026 - Cấp TW (BTP) - R8 | 2026 | 01/01/2026 → 31/12/2026 | 2025-12-31 → 2026-12-30 ⚠️ | 2.000.000.000 | KH-20260508-0004 | `30f3288e-c832-4224-a74a-2eef432358ab` | `cb_nv_tw_02` (BTP-TW) | Nháp | ✅ |
| 2 | KH ĐT năm 2026 - Cấp BN (BTC) - R8 | 2026 | 01/01/2026 → 31/12/2026 | 2025-12-31 → 2026-12-30 ⚠️ | 1.500.000.000 | KH-20260508-0005 | (xem API) | `cb_nv_bn_02` (BTC) | Nháp | ✅ |
| 3 | KH ĐT năm 2026 - Cấp DP (STP Bắc Giang) - R8 | 2026 | 01/01/2026 → 31/12/2026 | 2025-12-31 → 2026-12-30 ⚠️ | 800.000.000 | KH-20260508-0006 | (xem API) | `cb_nv_dp_02` (STP-BG) | Nháp | ✅ |

**Tổng:** 3 vào kho / 0 bị chặn.

---

## Verify per-cấp coverage (kiểm tra 2026-05-08 18:42)

API `GET /api/v1/ke-hoach-dao-taos?page=1&pageSize=20` trả 4 record:

| Cấp | Đơn vị | `donViId` | Mã | Trạng thái | Round |
|-----|--------|-----------|----|-----------|-------|
| TW | BTP-TW (Cục Bổ trợ tư pháp) | `00000000-0000-4000-8000-000000000001` | KH-20260508-0001 | CHO_DUYET | R7 (giữ nguyên) |
| TW | BTP-TW (Cục Bổ trợ tư pháp) | `00000000-0000-4000-8000-000000000001` | **KH-20260508-0004** | **NHAP** | **R8** ✅ |
| BN | BTC (Bộ Tài chính) | `00000000-0000-4000-8001-000000000002` | **KH-20260508-0005** | **NHAP** | **R8** ✅ |
| DP | STP-BG (Sở Tư pháp Bắc Giang) | `00000000-0000-4000-8002-000000000008` | **KH-20260508-0006** | **NHAP** | **R8** ✅ |

**Coverage NHAP:** 3/3 cấp ✅ — đáp ứng R7.4.B0 dep.

---

## So sánh round (R7 → R8)

| Round | TW | BN | DP | Tổng |
|-------|---|---|---|---|
| R7 (2026-05-08 09:35) | 1 NHAP (advanced → CHO_DUYET tại R7.4.B0) | 1 NHAP | 1 NHAP | 3 NHAP |
| R8 cleanup | TW-0001 giữ CHO_DUYET; BN-0002 + DP-0003 xoá API 204 | — | — | — |
| R8 re-seed | KH-0004 NHAP ✅ | KH-0005 NHAP ✅ | KH-0006 NHAP ✅ | **3 NHAP + 1 CHO_DUYET** |

---

## Ảnh chụp

- [Baseline 3 record cũ + cross-tenant leak (cb_nv_tw_02 thấy BN+DP)](r7-3-5-baseline-tw-list-3-records-leak.png)
- [TW-NEW sau seed KH-0004](r7-3-5-tw-after-seed-0004.png)
- [BN-NEW sau seed KH-0005](r7-3-5-bn-after-seed-0005.png)
- [DP-NEW sau seed KH-0006 (final 4 record)](r7-3-5-dp-final-list-4-records.png)

---

*2026-05-08 18:42 — QA chạy bằng Chrome DevTools MCP (cb_nv_tw_02 → logout → cb_nv_bn_02 → logout → cb_nv_dp_02). DELETE record cũ qua API trực tiếp do UI thiếu nút Xoá.*
