# Verify Checklist — TV nhanh (FR-13.A) ≥1 phiên tồn tại (R7.E4)

**Ngày:** 2026-05-08 07:42 • **Tài khoản:** `qtht_02` • **Trạng thái mong đợi:** ≥1 phiên TV nhanh tồn tại để unblock R7.6.2 + R7.6.3 + R7.7.11
**Màn:** SCR-X.2-03 — Quản lý Tư vấn Nhanh • **Đường dẫn:** `/tv-nhanh/danh-sach`
**API endpoint:** `GET /api/v1/tu-van-nhanhs?page=1&pageSize=50`
**Spec ref:** [funtion/7.13-tu-van-nhanh.md](../../../funtion/7.13-tu-van-nhanh.md) • [smoke/6.13-smoke-tuvan-nhanh.md](../../../smoke-specs/6.13-smoke-tuvan-nhanh.md) • SRS FR-X.2-01..05 (SM-TVNHANH 6 state)
**Trigger:** R7.6.2 Workflow TV nhanh (5 trạng thái) + R7.6.3 PUBLIC + R7.7.11 functional 44 TC v3.5 đều cần ≥1 phiên cover các state SM-TVNHANH.

---

## Kết quả: ✅ PASS — 50 phiên cover đủ 6 state SM-TVNHANH

50 phiên TV nhanh tồn tại với pattern mã `TVN-QA-YYYYMMDD-NNNN` (BR-DATA-04). Cover **đầy đủ 6/6 state** SM-TVNHANH (MOI/DANG_TIM_KIEM/DA_GOI_Y/CB_TRA_LOI/HOAN_THANH/HET_HAN). Cover **2/2 enum kênh** (TV_NHANH/TV_THU_CONG). Date range 2026-04-10 → 2026-05-06 (cover SLA timing test cho HET_HAN auto 30 ngày). 28/50 phiên có goiYTraLoi populated (≥2 entries/phiên) sẵn sàng test gợi ý. 14/50 phiên có noiDungTraLoi (CB_TRA_LOI 2 + HOAN_THANH 12) sẵn sàng test cập nhật `diem_danh_gia_tb` KHO_CAU_HOI (TVN-038).

---

## Bảng phân bố state — verify cover SM-TVNHANH

| State | Count | % | Sample mã | Sample câu hỏi | Note |
|---|:-:|:-:|---|---|---|
| MOI | 8 | 16% | TVN-QA-20260506-0001 | "Chuyển nhượng cổ phần trong công ty cổ phần thuế ra sao?" | DN vừa gửi câu hỏi — entry state |
| DANG_TIM_KIEM | 6 | 12% | TVN-QA-20260429-0014 | "Mua bán công ty cần giấy tờ gì?" | HT đang FTS keyword (intermediate) |
| DA_GOI_Y | 10 | 20% | TVN-QA-20260426-0019 | "Quy định về xuất hóa đơn điện tử cho khách lẻ?" | TOP gợi ý từ kho — input cho B4 |
| CB_TRA_LOI | 10 | 20% | TVN-QA-20260428-0016 | "Phá sản doanh nghiệp do toà án nào thụ lý?" | CB NV đã soạn trả lời (2 transitions từ R7.6.2 R9 + 8 dev seed) |
| HOAN_THANH | 12 | 24% | TVN-QA-20260417-0035 | "Doanh nghiệp xuất khẩu được hoàn thuế VAT trong bao lâu?" | DN đánh giá xong — terminal happy state |
| HET_HAN | 4 | 8% | TVN-QA-20260410-0047 | "Thành lập chi nhánh tại tỉnh khác cần thủ tục gì?" | Auto cron 30 ngày (BR-FLOW-12) |
| **Total** | **50** | **100%** | — | — | Cover 6/6 state ✅ |

**Pagination UI:** "1-20 / 50 mục" + 3 page buttons (page 1/2/3, page size 20/page) — khớp API `total=50, totalPages=3`.

---

## Bảng phân bố kênh — verify cover enum kenh_tu_van

| Kênh | Count | % | Note |
|---|:-:|:-:|---|
| TV_NHANH | 40 | 80% | Default DN gửi qua chuyên trang Cổng PLQG → keyword search kho |
| TV_THU_CONG | 10 | 20% | DN chọn kênh thủ công → chuyển Nhóm II (FR-X.2-03 §Processing 4) |

Cover 2/2 enum spec FR-X.2-03 line 247.

---

## Date range — verify SLA test ready

| Range | Count | Purpose |
|---|:-:|---|
| 2026-04 (cũ) | 35 | Cover phiên >7 ngày để test cảnh báo SLA + 30 ngày HET_HAN cron |
| 2026-05 (gần) | 15 | Phiên active để test workflow B1..B5 |

---

## Cross-link verify — pre-req downstream tasks

| Downstream task | Pre-req | Status | Note |
|---|---|:-:|---|
| **R7.6.2** Workflow TV nhanh 5 trạng thái | ≥1 phiên mỗi state MOI/DA_GOI_Y/CB_TRA_LOI cho B1/B3/B4 | ✅ | 8 MOI + 10 DA_GOI_Y + 10 CB_TRA_LOI |
| **R7.6.3** Workflow TV nhanh PUBLIC | ≥1 phiên DA_GOI_Y có gợi ý | ✅ | 10 DA_GOI_Y, 9/10 có gợi ý populated |
| **R7.7.11** Functional 44 TC | TVN-016 (list) + TVN-017 (detail DA_GOI_Y) + TVN-019 (gửi trả lời) + TVN-029 (đánh giá) + TVN-032 (auto het han) | ✅ | All 6 state coverage |
| **R7.4.D3.AUTO** Auto-feed Kho QA TU_DONG | ≥1 phiên HOAN_THANH với link KHO_CAU_HOI | ✅ | 12 HOAN_THANH, sample khoCauHoiDaChonId=QA-20260508-0003 |

---

## Phương pháp test

**Tool:** Chrome DevTools MCP.
**Setup:** Login `qtht_02` (QTHT có quyền `read_tu_van_nhanh` per BR-AUTH-01) → navigate `/tv-nhanh/danh-sach` (QTHT 👁️ R only — UI ẩn nút CRUD đúng spec TVN-033).
**Verify UI:** `take_snapshot` đọc 20 row đầu trong tab "Tất cả" + pagination "1-20 / 50 mục" + 3 page buttons.
**Verify API:** `evaluate_script` chạy `fetch('/api/v1/tu-van-nhanhs?pageSize=50')` từ session cookie → aggregate `byState + byKenh + ngayGui month range + goiYTraLoi/noiDungTraLoi populated count`.
**Verify schema:** Detail object có 20 field bao gồm `maPhien, doanhNghiepId, cauHoiDn, kenhTuVan, goiYTraLoi, noiDungTraLoi, nguoiTraLoiId, trangThai, ngayGui, khoCauHoiDaChonId, hoiDapId, ngayTraLoi`.

---

## Ảnh chụp

- [r7-e4-tv-nhanh-list-50-records.png](r7-e4-tv-nhanh-list-50-records.png) — UI list view tab "Tất cả" hiển thị 20/50 record với pagination + 3 sub-tab (Chờ xử lý / Đã gợi ý / Hoàn thành).

---

## State changes giữa R7.6.2 R9 → R7.E4 (08/05 07:42)

| State | R7.6.2 R9 | R7.E4 verify | Δ | Lý do |
|---|:-:|:-:|:-:|---|
| MOI | 8 | 8 | 0 | Stable |
| DANG_TIM_KIEM | 6 | 6 | 0 | Stable |
| DA_GOI_Y | 12 | 10 | -2 | 2 phiên transition → CB_TRA_LOI khi test R7.6.2 R9 + R7.7.11 R9 (TVN-QA-20260428-0015 + 0016) |
| CB_TRA_LOI | 8 | 10 | +2 | Cùng nguồn 2 transition trên |
| HOAN_THANH | 12 | 12 | 0 | Stable |
| HET_HAN | 4 | 4 | 0 | Stable |
| **Total** | **50** | **50** | **0** | Pool intact, chỉ state shift hợp lệ |

Không có data loss. Workflow R7.6.2 R9 + R7.7.11 R9 đã consume + transition 2 phiên đúng theo SM-TVNHANH spec.

---

## Out of scope (không test trong R7.E4)

- Workflow walking 5 transitions B1..B5 — thuộc R7.6.2.
- Functional 44 TC TVN-001..044 — thuộc R7.7.11.
- DN gửi câu hỏi qua Cổng PLQG (mTLS) — thuộc R7.6.3 + cần Cổng sandbox.
- Verify FTS GIN tsvector index trên KHO_CAU_HOI — thuộc R7.4.D3.

R7.E4 scope = chỉ verify ≥1 phiên tồn tại + cover 6 state SM-TVNHANH (data readiness check trước khi chạy R7.6.2/R7.6.3/R7.7.11).

---

*2026-05-08 07:42 — QA Automation chạy bằng Chrome DevTools MCP, account qtht_02.*
