# Entity Map — HTPLDN Cross-Module Data Dependencies

> **Nguồn:** NotebookLM query 2026-04-22 trên SRS v3 + review `flow-module.md`. **Update 2026-05-05:** thêm 3 entity từ srs-update-2026-5-5/ (NGUOI_HO_TRO + TO_CHUC_TU_VAN + NGAY_LE). Xem [`../srs-update-2026-5-5/_DELTA-MAP-FR04.md`](../srs-update-2026-5-5/_DELTA-MAP-FR04.md), [`_DELTA-MAP-FR07.md`](../srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../srs-update-2026-5-5/_DELTA-MAP-FR10.md).
> **Liên kết:**
> - [`../flow-module.md`](../flow-module.md) — flow tạo data + state machine 14 module + troubleshooting seed
> - [`./seed-fixture.yaml`](./seed-fixture.yaml) — giá trị nhập cụ thể (6 variants/entity theo tier Y)

## Mục đích

Bảng này dùng khi:
- **Trace ngược** (tab trống → cần seed entity nào): tra cột "Đọc tại" để biết tab nào đọc entity nào.
- **Trace xuôi** (tạo entity X → verify tab nào): tra cột "Đọc tại" để biết tất cả nơi hiển thị.
- **Impact analysis** (API entity X lỗi → màn hình nào ảnh hưởng): tra cột "Đọc tại" → tất cả là impacted.

> **Quy ước Tier (cột 3):** Tier = dependency depth (entity nào cần tiền đề từ entity nào). **Tier ↔ BƯỚC workflow trong [`flow-module.md`](../flow-module.md):** Tier 0 ≈ BƯỚC 1 (nền tảng QTHT), Tier 1 ≈ BƯỚC 2 (master), Tier 2 ≈ BƯỚC 3 (giao dịch cốt lõi), Tier 3 ≈ BƯỚC 4 (hậu kỳ), Tier 4 ≈ BƯỚC 5 (đầu ra). Module numbers (M1–M14) khớp flow-module.md sau renumber 2026-04-23.

---

## Bảng Entity Map

| # | Entity | Tier | Tạo tại (Module/SCR) | Đọc tại (Module/SCR) | Quan hệ |
| :--- | :--- | :---: | :--- | :--- | :--- |
| E01 | `DANH_MUC` | 0 | M0 QTHT / SCR-VIII-01 | TẤT CẢ (dropdown: lĩnh vực, loại DN, ngành nghề, trạng thái VV, nguồn hỏi đáp, …) | — |
| E02 | `DON_VI` | 0 | M0 QTHT / SCR-VIII-13/14 | TẤT CẢ (phân quyền scope TW/BN/ĐP, filter danh sách theo `don_vi_id`) | 1:N cán bộ |
| E03 | `TAI_KHOAN` | 0 | M0 QTHT / SCR-VIII-02/03/04 | TẤT CẢ (author `nguoi_tao_id`, assignee `nguoi_xu_ly_id`, approver `nguoi_duyet_id`) | — |
| E04 | `DOANH_NGHIEP` | 1 | **DN tự đăng ký qua SCR-VIII-08 (FR-VIII-22 self-reg, login page button "Đăng ký dành cho doanh nghiệp")**. ⚠️ Update 2026-05-05: CB NV không còn quyền tạo DN qua SCR-V.III-02 (FR-V.III-NEW-01 Import Excel BỎ — BA chốt). | M3 VV (`SCR-V.I-02`), M4 Hỏi đáp (`SCR-II-01`), M5 TV CS (`SCR-X1-02`), M7 HĐ (`SCR-X3-01`), M8 Chi trả (`SCR-V.II-01`), SCR-V.III-02 tab #2/#3/#4 | 1:N → VV, Chi trả, HĐ, Hỏi đáp |
| E05 | `TU_VAN_VIEN` | 1 | M2 / SCR-IV-02 (chỉ TVV/CG cá nhân ngoài). ⚠️ Update 2026-05-05: NHT đã tách entity riêng → xem **E24 NGUOI_HO_TRO**. `loai_tvv` enum giờ chỉ `('TVV','CG')`, BỎ `'NHT'`. Field `dia_ban_ids[]` đã bỏ — TVV scope toàn quốc theo NĐ 77/2008 Đ.19 (filter dùng `don_vi_id`). | M3 (phân công VV), M4 (phân công Hỏi đáp), M5 (CG TV CS), M7 (Bên B HĐ), SCR-IV-02 tab "Lịch sử hỗ trợ" | 1:N → VV, HĐ |
| E06 | `VU_VIEC` | 2 | M3 / SCR-V.I-02 | M7 HĐ (N:N `vu_viec_ids`), M8 Chi trả (prereq), M9 Đánh giá (mẫu chấm điểm), SCR-V.III-02 tab #3 KPI (`Tổng VV`, `Hoàn thành`), SCR-IV-02 tab LS TVV | 1:N VV bước, N:N với HĐ |
| E07 | `HO_SO_PHAP_LY_DN` | 2 | M5 TV CS / UC150 | SCR-V.III-02 tab #2 "Hồ sơ PL doanh nghiệp" | 1:N per DN (GIAY_PHEP / HOP_DONG / GIAY_CN / QUYET_DINH / KHAC) |
| E08 | `HOP_DONG_TV` | 3 | M7 / SCR-X3-01 | — (không có reader downstream, chỉ xem trong chính module) | N:N với VV qua `vu_viec_ids` |
| E09 | `HO_SO_CHI_TRA` | 3 | M8 / SCR-V.II-01 (BE seed từ DVC — CB NV không tạo) | SCR-V.III-02 tab #4, SCR-V.III-02 tab #3 KPI "Tổng chi phí", M9 Đánh giá (input chấm điểm hiệu quả chi tiêu) | 1:1 per VV |
| E10 | `HOI_DAP` | 2 | M4 / SCR-II-01 | `KHO_CAU_HOI` khi `DA_DUYET` (auto push, `nguon=TU_DONG`) | 1:1 với `KHO_CAU_HOI` entry nếu đã duyệt |
| E11 | `KHO_CAU_HOI` | 3 | M4 auto (`nguon=TU_DONG`) + M10B thủ công (`nguon=THU_CONG`, SCR-X2-01) | M10A TV Nhanh (full-text search), chuyên trang Cổng PLQG (khi `nguon=THU_CONG` + `hieu_luc=1`) | — (Tier 3 vì phụ thuộc HOI_DAP Tier 2) |
| E12 | `DANH_GIA_HQ` | 3 | M9 / SCR-VI-01 | Báo cáo TT17 (output), M11 CT HTPLDN đợt BC (input tổng hợp) | query các VV `HOÀN THÀNH` trong kỳ |
| E13 | `KHOA_HOC` | 2 | M6.1 / SCR-III-01/02 | Tab "Học viên" (M6.1 bước 4), tab "Kết quả" (M6.1 bước 8), M11 CT HTPLDN (đầu vào báo cáo đào tạo) | 1:N học viên, 1:N bài giảng |
| E14 | `TV_NHANH_PHIEN` | 3 | DN từ Cổng PLQG (BLOCKED) | SCR-X2 frontend chat, SCR-IV-02 tab hoạt động CG (khi CG tham gia) | — (Tier 3 theo BƯỚC 4 doc gốc) |
| E15 | `TV_CHUYEN_SAU_YC` | 2 | M5 / SCR-X1-02 | SCR-V.III-02 Tab #2 (nếu tạo Hồ sơ PL từ phiên TVCS), SCR-IV-02 tab phân công CG | 1:1 với output văn bản tư vấn |
| E16 | `CT_HTPLDN_KE_HOACH` | 4 | M11.1 / SCR-XI-01 Tab Thông tin | M11.2 Đợt BC (input) | 1:N đợt báo cáo |
| E17 | `CT_HTPLDN_DOT_BC` | 4 | M11.2 / SCR-XI-01 Tab Đợt BC | Báo cáo TT17 toàn quốc (khi Cục tổng hợp) | query data từ `VU_VIEC`, `HO_SO_CHI_TRA`, `KHOA_HOC` trong kỳ |
| E18 | `BIEU_MAU` | 0 | M14 / SCR-VII-02 | Chuyên trang Cổng PLQG khi `CÔNG KHAI` | — (Phụ trợ, không gắn BƯỚC) |
| E19 | `BAO_CAO` | 4 | M12 / module Báo cáo (FR-IX-01..23, 23 loại BC) | — (metadata only, không có reader downstream) | query read từ HOI_DAP/VU_VIEC/KHOA_HOC/HO_SO_CHI_TRA/DANH_GIA_HQ/CT_HTPLDN |
| E20 | `DASHBOARD_KPI` (virtual) | 4 | M13 — no owned entity, aggregate view | SCR-I-01 Dashboard (FR-I-01..09) | query read từ 7 entity: HOI_DAP, VU_VIEC, KHOA_HOC, TU_VAN_VIEN, KET_QUA_DANH_GIA, KET_QUA_DAO_TAO, HO_SO_CHI_TRA |
| E21 | `CAU_HINH_SLA` | 0 | M0 QTHT / SCR-VIII-06 Tab "SLA" (FR-VIII-10) | M3 VV (tính `deadline` BR-CALC-03), M4 Hỏi đáp (deadline), M5 TV CS (deadline), M8 Chi trả (deadline). 4 row mặc định: VU_VIEC=10, HO_SO_HT=15, HO_SO_TT=10, HOI_DAP=5 ngày LV (FR-VIII-10 Seed Data) | 1:N → tất cả entity transactional có `deadline` |
| E22 | `CAU_HINH_PHAN_CONG` | 0/1 mixed | M0 QTHT / MH-10.7 Tab "Phân công mặc định" (FR-II-NEW-01) — **2 đợt**: Đợt 1 CB-only 6 row (Tier 0); Đợt 2 backfill TVV 6 row đủ 6 LV PL (sau T3.1 SM-TVV PASS + QTHT cấp TK cho TVV) | Modal Phân công Hỏi đáp (SCR-II-03), Phân công VV (FR-V.I-09): bảng gợi ý `nguoi_xu_ly_id` sort `uu_tien ASC → workload ASC` (rỗng nếu chưa map) | UNIQUE(linh_vuc_id + nguoi_xu_ly_id + don_vi_id). 1 cột `nguoi_xu_ly_id` (KHÔNG phải 2 dropdown CB/TVV — verified UI 2026-04-25) |
| E23 | `TIEU_CHI_DANH_GIA` (DM mở rộng) | 0 | M0 QTHT / SCR-VIII-01 mở rộng (FR-VIII-11, `loai_danh_muc='TIEU_CHI_DG_HIEU_QUA'`) — ⚠️ **M2 mâu thuẫn SRS**: FR-VIII-11 + logic-data + plan-review coi là DM (3 nguồn); DDL `srs-fr-08-danh-gia.md §3.4.3 line 1017` tách entity riêng (1 nguồn) — đi theo FR-VIII-11 chờ BA confirm | M9 Đánh giá HQ (input chấm điểm — FR-VI-02/06 reference), Báo cáo TT17 (BR-CALC-04: Σ trọng số = 100%) | 4 tiêu chí seed: TC-PL/TC-NL/TC-HQ/TC-ML |
| E24 | `NGUOI_HO_TRO` (NHT) **`[NEW 2026-05-05 — F-FR04-NEW-02 phương án B+]`** | 1 | M2 / **SCR-IV-NHT-02** (QTHT hoặc CB NV tạo qua FR-IV-NHT-01). Tạo NHT đồng thời tạo TAI_KHOAN gán role `NHT` ở `CHO_KICH_HOAT` → NHT bấm link mail (FR-VIII-26) → `HOAT_DONG`. | M3 VV (phân công NHT — UC59 — modal SCR-V.I-03), M4 Hỏi đáp (phân công NHT/TVV/CB), SCR-IV-NHT-03 hồ sơ NHT | 1:1 với TAI_KHOAN; N:N với DANH_MUC qua junction NGUOI_HO_TRO_LINH_VUC (≥1 lĩnh vực PL chuyên môn) |
| E25 | `TO_CHUC_TU_VAN` (TC TV) **`[NEW 2026-05-05 — CR-02 + GAP-IV-07/09/10]`** | 1 | M2 / **SCR-IV-NEW-02** (CB NV tạo qua FR-IV-NEW-01). Trạng thái mới `MOI_DANG_KY` → CB NV trình duyệt → CB PD công bố vào MLTV (NĐ 55/2019 Đ.9, FR-IV-NEW-04) → `HOAT_DONG`. | TVV chọn TC chính khi đăng ký (`TVV_TO_CHUC.to_chuc_id` FK), Cổng PLQG (khi `cong_khai=1`), SCR-IV-NEW-01 list, SCR-IV-NEW-03 chi tiết | 1:N TVV (qua junction TVV_TO_CHUC); N:N với DANH_MUC qua junction lĩnh vực |
| E26 | `NGAY_LE` **`[NEW 2026-05-05 — GAP-VIII-05]`** | 0 | M0 QTHT / **FR-VIII-29** SCR-VIII-06 hoặc DM con (CRUD QTHT only). Hỗ trợ import Excel danh sách năm. | M3 VV (BR-CALC-03 tính SLA trừ ngày lễ), M4 Hỏi đáp (SLA), M5 TV CS (SLA), M8 Chi trả (SLA), Dashboard FR-01 KPI-04 SLA | 1:N tham chiếu từ mọi entity transactional có `deadline` |

---

## Hướng dẫn sử dụng

### Scenario 1 — Trace ngược: "Tab `SCR-V.III-02` Lịch sử hỗ trợ đang rỗng"

1. Tra `VU_VIEC` (E06) → cột "Đọc tại" → thấy `SCR-V.III-02 tab #3 KPI` → cần seed VV có `doanh_nghiep_id` khớp với DN đang xem.
2. Tra `HO_SO_CHI_TRA` (E09) → `SCR-V.III-02 tab #3 KPI "Tổng chi phí"` → cần seed Chi trả cùng `doanh_nghiep_id`.
3. Tra `HO_SO_PHAP_LY_DN` (E07) → `SCR-V.III-02 tab #2` → cần seed Hồ sơ PL cùng `doanh_nghiep_id`.
4. → Dùng preset **P1** trong [`flow-module.md` §Phụ lục 2](./flow-module.md#phụ-lục-2-seed-data-presets--happy-path-e2e).

### Scenario 2 — Trace xuôi: "Vừa tạo 1 VV `HOÀN THÀNH`, phải verify tab nào?"

Tra `VU_VIEC` (E06) → cột "Đọc tại" → 5 location cần verify:
1. **M3 SCR-V.I-02** list VV (chính màn hình) — filter Tab "Hoàn thành"
2. **SCR-V.III-02 tab #3** (DN liên kết) — KPI "Tổng VV" +1, "Hoàn thành" +1
3. **SCR-IV-02 tab LS** của TVV được gán — hiện VV trong danh sách
4. **M7 SCR-X3-01 "Liên kết VV"** dropdown — giờ VV này khả dụng để add vào HĐ
5. **M9 SCR-VI-01 "Chấm điểm"** khi tạo đợt đánh giá trong kỳ — VV xuất hiện làm mẫu

### Scenario 3 — Impact analysis: "API `/doanh-nghiep/{id}` trả 500"

Tra `DOANH_NGHIEP` (E04) → cột "Đọc tại" → 6 module + 3 tab chi tiết ảnh hưởng:
- M3 list/detail VV (dropdown chọn DN khi tạo VV fail)
- M4 list/detail Hỏi đáp (dropdown DN fail)
- M5 TV CS (không tạo được yêu cầu tư vấn)
- M7 HĐ (có thể không affected vì Bên B là TVV, không phải DN)
- M8 Chi trả (không load được thông tin quy mô DN → validate mức hỗ trợ fail)
- SCR-V.III-02 toàn bộ tab #1/#2/#3/#4 của DN chi tiết
→ **Severity: Critical** — block nhiều downstream workflow.

---

## Bảo trì bảng

**Cập nhật khi:**
1. Thêm module mới vào flow-module.md → add entity mới nếu có.
2. Dev thêm cross-link mới giữa module (ví dụ module mới đọc data từ `VU_VIEC`) → update cột "Đọc tại" của entity tương ứng.
3. SRS bổ sung tab detail hiển thị data entity khác → update cột "Đọc tại".
4. Module downstream thay đổi state machine → check lại state đích trong preset tương ứng ở `flow-module.md`.

**Audit định kỳ:** sau mỗi vòng QA round (ví dụ sau mỗi release), grep `SCR-V.III-02 tab` ở các SRS file để xem có tab nào mới xuất hiện mà chưa được map ở đây không.
