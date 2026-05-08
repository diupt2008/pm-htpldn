# State snapshot — entity state count thực tế trên BE

**Last updated:** 2026-05-08 23:35 (R7.5.5 ✅ Audit log verify — total=1397 entry qua `/api/v1/audit-logs` meta.total, UI 735 mục/7 ngày 01-08/05; trước đó 20:50 (R7.3.10 R8 BG seed — 5 VIDEO → 8 (5 VIDEO + 1 SLIDE + 2 PDF) cover 7 LV; R7.2.7 R8 retry seed +5 NHT qua UI `/nguoi-ho-tro` — pool 4→11, CHO_KICH_HOAT:8 cover BTP-TW + BKH + BTC + STP-BG + STP-BNI, LV DN/Thuế/LĐ/SHTT) · **Account verify:** cb_nv_tw_01/02 + cb_nv_bn_01/02 + cb_nv_dp_02/03 + cb_pd_tw_02 + qtht_02 · **MCP:** chrome-devtools `list_network_requests` + `evaluate_script` + curl

**Audit 2026-05-08:** 6 seed task ✅ (R7.2.4/R7.3.1/R7.3.2/R7.3.7/R7.3.8/R7.4.D1) reviewed — claim historical đúng tại thời điểm done. State drift hiện tại do workflow advance/cleanup downstream → markers downstream đã reflect đúng (R7.4.B5b/R7.4.D2/R7.7.10). KHÔNG flip ✅ → ⚠️ (vi phạm historical truth principle).
**Purpose:** Single source of truth state count → drive `(✓ N)` / `(✗ N)` markers trong [todo.md](todo.md) `[need: ...]` bracket.

## Cách dùng

1. Sau MỌI task ✅/⚠️ thay đổi state entity X → re-run verify query của X (cột "Verify").
2. Update count + state distribution + timestamp.
3. Grep `todo.md` `[need: ... <X> ...]` → đổi marker theo count mới (`(✓ N)` nếu thoả, `(✗ ...)` nếu thiếu).
4. Edit todo.md với marker mới → hook `auto-rescan-todo.py` tự flip ⏳→🟢 nếu dep đủ.
5. Workflow chi tiết trong [CLAUDE.md §State marker workflow](../CLAUDE.md).

---

## Bảng state thực tế (2026-05-07)

| Entity | Endpoint | Total | State distribution | Verify command (MCP/curl) |
|---|---|:-:|---|---|
| Hỏi đáp (HD) | `/api/v1/hoi-daps` | **7** | MOI:2 (HD-003/-007), DA_PHAN_CONG:3 (HD-001/-002/-006), HUY:2 (HD-004/-005) | `curl ".../hoi-daps?page=0&size=20"` |
| Vụ việc (VV) | `/api/v1/vu-viecs` | **5** | DA_TIEP_NHAN:1, DA_PHAN_CONG:3, DANG_KIEM_TRA:1 (re-verify 2026-05-08 18:42 UI MCP) | `curl ".../vu-viecs?page=1&pageSize=100"` |
| TVCS | `/api/v1/noi-dung-tu-van-cs` | **12** | TIEP_NHAN:5, PHAN_CONG:6, HUY:1 | `.../noi-dung-tu-van-cs?size=100` |
| Biểu mẫu (BM record) | `/api/v1/bieu-maus` | **0** | rỗng | `.../bieu-maus?size=100` |
| Thư mục BM | `/api/v1/thu-muc-bieu-maus` | **2** | NHAP:2 (Thuế, HĐ Lao động) | `.../thu-muc-bieu-maus` |
| MPH (Mẫu phản hồi) | `/api/v1/mau-phan-hois` | **3** | KICH_HOAT:3 | `.../mau-phan-hois` |
| TVV (loaiTvv=TVV) | `/api/v1/tu-van-viens?loaiTvv=TVV` | **14** | MOI_DANG_KY:6 (R7.2.5 batch 2 TVV-0017..0022), CHO_PHE_DUYET:1, TU_CHOI:3, HOAT_DONG:1, CHO_KICH_HOAT:2, YEU_CAU_BO_SUNG:1 (re-verify 2026-05-08 UI tab MDK) | `.../tu-van-viens?loaiTvv=TVV&pageSize=100` |
| CG (loaiTvv=CG) | `/api/v1/tu-van-viens?loaiTvv=CG` | **14** | HOAT_DONG:8, MOI_DANG_KY:6 (R7.2.6 batch 2 CG-0023..0028 cover 6 LV DN/TM/LĐ/SHTT/ĐĐ/Thuế, re-verify 2026-05-08 UI tab MDK 12 mục) | `.../tu-van-viens?loaiTvv=CG&size=100` |
| TC TV | `/api/v1/to-chuc-tu-vans` | **5** | HOAT_DONG:5 | `.../to-chuc-tu-vans` |
| DN | `/api/v1/doanh-nghieps` | **23** | (mixed) | `.../doanh-nghieps?size=100` |
| KH năm | `/api/v1/ke-hoach-dao-taos` | **4** | NHAP:3 (KH-0004 TW + KH-0005 BN + KH-0006 DP — R8 2026-05-08), CHO_DUYET:1 (KH-0001 TW — R7) | `.../ke-hoach-dao-taos` |
| CTĐT | `/api/v1/chuong-trinh-dao-taos` | **0** | rỗng (endpoint OK) | `.../chuong-trinh-dao-taos` |
| Khóa học | `/api/v1/khoa-hocs` | **0** | rỗng | `.../khoa-hocs` |
| NHCH | `/api/v1/ngan-hang-cau-hois` | **6** | KICH_HOAT:6 (cover 5 LV: Hành chính/Lao động/Đất đai/SHTT/Thuế · 3 mức độ · 3 loại — R8 2026-05-08 19:35) | `.../ngan-hang-cau-hois` |
| ĐKT | `/api/v1/de-kiem-tras` | **4** | NHAP:4 (cover 4 LV: Hành chính/Lao động/Đất đai/Thuế — sau R7.4.B10 CRUD R8 xóa SHTT). Đất đai version=2 thoiGianLamBai=45 (edited). | `.../de-kiem-tras` |
| HSCT (Chi trả) | `/api/v1/ho-so-chi-tras` | **78** | DANG_THAM_DINH:13, DA_DUYET:8, DA_THANH_TOAN:14, DANG_DANH_GIA:4, CHO_TIEP_NHAN:8, YEU_CAU_BO_SUNG:6, CHO_PHE_DUYET:9, TU_CHOI_THANH_TOAN:3, TU_CHOI:3, DANG_KIEM_TRA:8, HUY:2 | `.../ho-so-chi-tras?size=200` |
| HĐ TV | `/api/v1/hop-dong-tu-vans` | **0** | rỗng | `.../hop-dong-tu-vans` |
| Giảng viên | `/api/v1/giang-viens` | **8** | DANG_HOAT_DONG:8 | `.../giang-viens` |
| Bài giảng | `/api/v1/bai-giangs` | **8** | active (BG không state machine — chỉ có `congKhai` boolean): VIDEO:5 + SLIDE:1 + PDF:2 cover 7 LV (Doanh nghiệp/Dân sự/Hành chính/Lao động/SHTT/Thuế/Đất đai). R8 2026-05-08 20:50. | `.../bai-giangs` |
| NHT | `/api/v1/nguoi-ho-tro` | **11** | CHO_KICH_HOAT:8 (NHT-BTP-TW-0001..0004 + NHT-BKH-0001 + NHT-BTC-0001 + NHT-STP-BG-0001 + NHT-STP-BNI-0001), HOAT_DONG:3 (nht_01/02/03 STP-AG/DN/HP) — re-verify 2026-05-08 R8 retry sau seed +5 NHT qua route `/nguoi-ho-tro` với CB_NV_TW/BN/DP | `.../nguoi-ho-tro?size=100` |
| Kho QA | `/api/v1/kho-cau-hois` | **14** | NHAP:2, CHO_DUYET:1 (QA-0508-0004 Đất đai), DA_DUYET:9 (+QA-0508-0005 **Hành chính** B1 ✅ 2026-05-08), HET_HIEU_LUC:2 | `.../kho-cau-hois?size=100` |
| Phiên TV nhanh | `/api/v1/tu-van-nhanhs` | **50** | MOI:8, DANG_TIM_KIEM:6+, DA_GOI_Y:5+ (sau R7.B2 -1), CB_TRA_LOI:1 (TVN-0019 ✅ R7.B2 T4) | `.../tu-van-nhanhs?size=100` |
| CT HTPLDN | `/api/v1/chuong-trinh-htpls` | **3** | DA_DUYET:1, DU_THAO:1, HUY:1 | `.../chuong-trinh-htpls` |
| Đợt Đánh giá | `/api/v1/ke-hoach-danh-gias` | **≥1** | CHO_DUYET_PC:1 (DG-20260506-0001 sau R7.4.D2 R7) — needs live re-verify | `.../ke-hoach-danh-gias` |
| Audit log (AUDIT_LOG) | `/api/v1/audit-logs` | **1397** | 20 hành động (CREATE/UPDATE/DELETE/LOGIN/LOGOUT/SUBMIT/APPROVE/THAM_DINH/PHE_DUYET/...) · 26 distinct users · 11 vai trò · range 2026-05-06→05-08 active. UI default 7d filter = 735 mục. | `GET .../audit-logs?page=1&pageSize=1` đọc `meta.total` |
| Học viên | (404) | N/A | endpoint chưa deploy | — |
| Lịch học | (404/500) | N/A | endpoint chưa deploy | — |

---

## Filter coverage (cho dep yêu cầu per-LV / per-state)

| Filter group | Coverage | Note |
|---|---|---|
| Kho QA `state=DA_DUYET hieu_luc=1` per LV | **6/7** (DN/SHTT/Đất đai/Lao động/Thuế/**Hành chính** ✅ B1) | Thiếu KDTM (chưa seed bao giờ). Đủ proceed B2 R7.6.2 với 6 LV chính. |
| NHCH `KICH_HOAT` per LV (R7.3.9 dep) | **5/5** (Hành chính + Lao động + Đất đai + SHTT + Thuế) | ✅ R8 2026-05-08 — Lao động ×2, các LV khác ×1. Đủ proceed R7.3.9 seed ĐKT. |
| Kho QA `state=DA_DUYET` count | **9** | Đủ ≥1 cho 6/7 LV |
| TVCS state distribution | 3 state (TIEP_NHAN/PHAN_CONG/HUY) | Đủ ≥10 record cho R7.7.5 functional 44 TC |
| CT HTPLDN state distribution | 3 state (DA_DUYET/DU_THAO/HUY) | Đủ ≥3 cho R7.7.15 functional 42 TC |
| NHT HOAT_DONG count | **3** | Đủ ≥3 cho R7.4.A3 workflow VV. CHO_KICH_HOAT:8 sẵn sàng activate (R7.2.9 mail flow) |
| TC TV HOAT_DONG count | **5** | Đủ ≥1 cho R7.4.A3 workflow VV |

---

## Re-verify checklist sau mỗi task ✅

Task ảnh hưởng entity X → re-run query X → update bảng + downstream marker:

| Task type ✅ | Re-verify entity |
|---|---|
| Seed (R7.2.x / R7.3.x) | Entity vừa seed + entity FK reference |
| Workflow advance (R7.4.x) | Entity vừa advance state + downstream consumer |
| Functional CRUD (R7.7.x) | Entity bị CRUD + audit log |
| Tier 0 DM (R7.1.x) | DM table + entity dùng FK đến DM đó |

Nếu count thay đổi → grep `[need: .*<entity>` trong todo.md → flip marker `(✗ N)` ↔ `(✓ N)`.
