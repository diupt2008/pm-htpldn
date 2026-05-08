# Verify Checklist — Chi trả 100 HSCT data còn (R7.E3)

**Ngày:** 2026-05-07 17:35 • **Tài khoản:** `qtht_02` • **Trạng thái mong đợi:** ≥100 record HSCT (HSCT000001..HSCT000100)
**Màn:** SCR-V.II-01 — Hồ sơ Đề nghị Hỗ trợ Chi phí • **Đường dẫn:** `/chi-tra/danh-sach`
**API endpoint:** `GET /api/v1/ho-so-chi-tras?tab=TAT_CA&page=1&pageSize=100`
**Spec ref:** [funtion/7.6-chi-tra-chi-phi.md](../../../funtion/7.6-chi-tra-chi-phi.md) • SRS FR-V.II-01..15
**Trigger:** R7.7.12 Chi trả v3.5 functional 35 TC + R7.7.12.1 smoke regression IMPACT cần ≥100 HSCT seed.

---

## Kết quả: ⚠️ PARTIAL 78/100 (REGRESSION — thiếu 22 record HSCT000079..100)

**78 record HSCT còn** (HSCT000001..HSCT000078 contiguous, không có gap), **thiếu 22 record HSCT000079..HSCT000100** so với expected 100. Range thiếu là tail-end (079→100), không phải gap giữa — gợi ý partial deploy / partial seed / batch hard-delete cuối, không phải mất rời rạc.

**Tác động downstream:**
- ✅ R7.7.12.1 smoke regression IMPACT FR-07/08/11/13 — vẫn chạy được (78 ≥ smoke threshold).
- ⚠️ R7.7.12 Chi trả 35 TC functional — đa số chạy được (cover đủ 11 trạng thái — xem breakdown).
- ⚠️ TC nào cite cụ thể HSCT000079..100 sẽ FAIL — cần đổi mã hoặc re-seed.

---

## Bảng dữ liệu verify

| Metric | Expected | Actual | Match? |
|---|---|---|:-:|
| Total record | 100 (HSCT000001..100) | **78** (HSCT000001..078) | ❌ thiếu 22 |
| Min mã | HSCT000001 | HSCT000001 | ✅ |
| Max mã | HSCT000100 | **HSCT000078** | ❌ |
| Range contiguous | yes (no gap) | yes (001..078 không gap) | ✅ |
| Pagination UI | "1-20 / 100 mục" | "1-20 / **78 mục**" (4 page × 20) | ❌ |

### Breakdown theo trạng thái (78 record)

| Trạng thái | Count | Ghi chú |
|---|:-:|---|
| `CHO_TIEP_NHAN` | 15 | Mới nộp, chờ CB tiếp nhận |
| `DA_THANH_TOAN` | 14 | Hoàn thành flow |
| `CHO_PHE_DUYET` | 9 | Chờ CB PD ký |
| `DANG_KIEM_TRA` | 8 | Đang kiểm tra HS |
| `DANG_THAM_DINH` | 7 | Đang thẩm định nội dung |
| `DA_DUYET` | 7 | Đã duyệt, chờ TT |
| `YEU_CAU_BO_SUNG` | 6 | Trả về DN bổ sung HS |
| `DANG_DANH_GIA` | 4 | Đang đánh giá đợt |
| `TU_CHOI_THANH_TOAN` | 3 | Bị từ chối TT cuối |
| `TU_CHOI` | 3 | Từ chối toàn bộ HS |
| `HUY` | 2 | Bị hủy |

**Cover 11/10 trạng thái SM-CHI-TRA v3.5** — đủ scope test functional 35 TC R7.7.12 nếu TC dùng filter trạng thái thay vì cite mã cụ thể.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP.
**Setup:** Click sidebar uid `4_13` "Quản lý chi trả chi phí" → React Router navigate `/chi-tra/danh-sach` (giữ session).
**Verify UI:** `take_snapshot` đọc 20 row table + pagination text "1-20 / 78 mục" + 4 trang button.
**Verify API:** `evaluate_script` chạy `fetch('/api/v1/ho-so-chi-tras?tab=TAT_CA&page=1&pageSize=100')` — endpoint thực phát hiện qua `list_network_requests` reqid=640.
**Sample verify:** sort theo mã → confirm contiguous 001..078, không gap; min=HSCT000001 ✅, max=HSCT000078 (≠ HSCT000100 expected).
**Pagination cap:** pageSize=200 → 422 (BE limit max 100).

---

## Ảnh chụp

- [r7-e3-chi-tra-78-records.png](r7-e3-chi-tra-78-records.png) — UI list view 20 record đầu + pagination "1-20 / 78 mục" (4 page).

---

## Recommendation

| Option | Hành động | Effort | Khi nào dùng |
|---|---|---|---|
| **A** | Giữ 78 record, run R7.7.12 với scope state-based (không cite mã cụ thể) | 0 phút | Nếu TC R7.7.12 không strict cite HSCT000079+ |
| **B** | Re-seed 22 HSCT (HSCT000079..100) qua self-reg DN flow | ~30 phút (5 DN × 4-5 HSCT mỗi DN qua /api/v1/ho-so-chi-tras POST) | Nếu cần đúng 100 cho parity với baseline |
| **C** | Log bug seed gap + escalate dev re-deploy seed script | 5 phút log | Nếu xác định 22 record bị mất do partial deploy chứ không phải initial seed = 78 |

**Đề xuất:** Option A trước (chạy R7.7.12 + R7.7.12.1 với 78 HSCT đã có), nếu fail TC nào do thiếu state coverage thì mới Option B/C.

---

## Out of scope (không test trong R7.E3)

- HSCT lifecycle workflow (CHO_TIEP_NHAN → DA_THANH_TOAN) — thuộc R7.6.1.
- HSCT permission test theo role — thuộc R7.7.12 / R7.8.5.
- DN bổ sung HS qua VNeID — thuộc R7.7.12.2.

R7.E3 scope = chỉ verify count + range mã HSCT (data readiness check).

---

*2026-05-07 17:35 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
