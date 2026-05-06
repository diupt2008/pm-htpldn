# Delta Map — FR-05 update (Quản lý Vụ việc Trợ giúp Pháp lý)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-05-vu-viec.md` (2.364 dòng) so với `srs-v3/srs-fr-05-vu-viec.md` (1.891 dòng, Δ +473 dòng / +25%) — apply 14 thay đổi IN + 1 V4-CHƯA-SỬA, 6 OUT cherry-pick.
> **Ngày tạo:** 2026-05-06 | **Tác giả:** QA + Claude
> **Source:** CHANGELOG-v3-to-v3.5.md line 177-345.

---

## 1. Có gì mới / đổi / xoá

### FR mới (2 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-V.I-NEW-02 | DN bổ sung hồ sơ vụ việc | Formal hoá transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA`. DN auth Tier 2 VNeID, Inputs `file_bo_sung[]` + `ghi_chu`, 8 bước Processing, 4 mã lỗi ERR-VV-BS-01..04 |
| FR-V.I-NEW-05 | Công khai vụ việc lên Cổng PLQG | UC mới — 5 cột thêm vào VU_VIEC, 10 bước Processing (Công khai + Hủy), 9 mã lỗi ERR-CK-VV-01..10, NĐ 13/2023 |

### SCR mới (2 SCR)

| SCR-ID | Tên | Actor |
|---|---|---|
| SCR-V.I-04 | Danh sách VV của tôi (chế độ DN) | DN — 3 tab + 14 thành phần, ẩn tên cá nhân CB theo NĐ 13/2023 |
| SCR-V.I-05 | Thông báo của tôi (chế độ DN) | DN — filter trạng thái đọc + loại + ngày, polling 30s |

### Entity mới / đổi

| Entity | Trạng thái | Note |
|---|---|---|
| `VU_VIEC` | Refactor lớn | +5 cột công khai (`cong_khai`, `anh_dai_dien`, `thoi_gian_dang_tai`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai`); +`file_dinh_kem` formal; +`ngay_yeu_cau_bo_sung`; **bỏ `nguoi_ho_tro_id`**; +3 cột phân công (`loai_doi_tuong_xu_ly`, `nguoi_xu_ly_id` FK→TAI_KHOAN, `to_chuc_tu_van_id` FK→TO_CHUC_TU_VAN) |
| `PHAN_CONG_VU_VIEC` | **Spec đầy đủ mới** | 12 cột: `loai_doi_tuong_xu_ly`, `nguoi_xu_ly_id`, `to_chuc_tu_van_id`, `trang_thai` 3 ENUM, `ngay_xac_nhan`... |
| `DANH_GIA_VU_VIEC` | **Spec đầy đủ mới + Tách entity** | 11 cột — `loai_nguoi_danh_gia` ENUM (CB_NV, DN), UNIQUE(vu_viec_id, loai_nguoi_danh_gia), thang 0-10 |
| `LICH_SU_VU_VIEC` | **Spec đầy đủ mới** | 11 cột — CHECK ENUM 18 hành động neutral cover TVV/CG/NHT, `vai_tro` 5 ENUM, +`CONG_KHAI`, `HUY_CONG_KHAI` actions |
| `TU_VAN_VIEN` (referenced) | Đổi field | Bỏ `dia_ban_hoat_dong` (NĐ 77/2008 Đ.19), enum `loai_tvv` → `('TVV','CG')`, `diem_danh_gia_tb` → DECIMAL(3,1) 1.0-5.0 |
| `DON_VI` (referenced) | Đổi cấu trúc | "Cây 3 tầng" → "2 tầng: TW cấp 1; BN/ĐP cấp 2 ngang cấp"; `don_vi_cha_id` constraint NULL khi TW, = TW khi BN/ĐP |

### State Machine — SM-VUVIEC

- **2 self-loop mới** trên `DA_DUYET` + `HOAN_THANH`: `CONG_KHAI` + `HUY_CONG_KHAI` (cờ overlay, không phải state riêng).
- **Transition formal hoá:** `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (FR-V.I-NEW-02).
- **CB PD từ chối:** `CHO_PHE_DUYET → DANG_XU_LY` (KHÔNG phải `→ TU_CHOI` đóng VV — sửa lỗi nghiệp vụ Thay đổi 11).

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| SLA VV mặc định | 10 ngày LV (NĐ 55 Đ.9) | **15 ngày LV** (NĐ 55 Đ.8 K.1) — ⚠️ cite chưa web-verify |
| Phân công VV | Field duy nhất `nguoi_ho_tro_id` | **3 cột:** `loai_doi_tuong_xu_ly` (CA_NHAN/TO_CHUC), `nguoi_xu_ly_id` FK TAI_KHOAN, `to_chuc_tu_van_id` FK TO_CHUC_TU_VAN. FR-V.I-09 thành 2 thẻ Cá nhân/Tổ chức |
| CB PD từ chối phê duyệt | `CHO_PHE_DUYET → TU_CHOI` (đóng VV) | **`CHO_PHE_DUYET → DANG_XU_LY`** (NHT sửa KQ) |
| Đánh giá vụ việc | Chung mọi role | **CHỈ {CB_NV, DN}** (loại CB_PD theo CSV UC67); duplicate guard per loại |
| Thang điểm đánh giá | Lẫn 0-10/1-5 | **Tách:** thang VV = 0-10, thang TVV = 1-5 (đồng bộ FR-04) |
| Auth DN ở FR-V.I-02/04/14 | DN nhập tay | **Tier 2 VNeID** + lookup DN từ session/MST + check BR-CALC-04 trước khi tạo VV |
| BR-AUTH-01 | Tier 1 + VNPT eKYC + VNeID | **2-tier:** Tier 1 nội bộ + Tier 2 SSO VNeID Internet (bỏ VNPT eKYC) |

### Số entity / BR

- §4 entity: 9 → **17 entity** (3 owned mới spec + 5 referenced mới + 3 cấu hình)
- §6 BR: 14 → **21 BR** (thêm BR-AUTH-03/04, BR-CALC-03, BR-CALC-06, BR-EC-15, BR-EC-16, BR-NOTIF-01, BR-SLA-03; +BR-PUBLIC-01/04 cho công khai; BR-EC-20 không set CONG_KHAI trước API OK)
- BR-AUTH-08 fix V4-CHƯA-SỬA #1: thêm exception "ngoại trừ QTHT và Cán bộ Trung ương"

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref / Phụ thuộc | Nhóm | Test scope |
|---|---|---|---|
| `srs-fr-05-vu-viec.md` (self) | — | **A FULL** | Toàn bộ workflow VV + công khai + đánh giá + bổ sung HS |
| `srs-v3.md` (master) | BR catalog + ERD master | **A FULL** | Sync 11 BR mới + entity 3 spec mới + DON_VI 2 tầng |
| `srs-fr-04-chuyen-gia-tvv.md` | Phụ thuộc — entity NGUOI_HO_TRO + TO_CHUC_TU_VAN | **B DELTA** | Đã apply qua FR-04 delta. Verify đồng bộ |
| `srs-fr-07-doanh-nghiep.md` | Phụ thuộc — DN auth Tier 2 + BR-CALC-04 | **B DELTA** | Phương án TK-first FR-VIII-22 |
| `srs-fr-10-quan-tri.md` | Phụ thuộc — BR-AUTH-01 + DON_VI 2 tầng + BR-AUTH-08 | **A FULL** (xem _DELTA-MAP-FR10) | Sync source of truth |
| `srs-fr-11-bao-cao.md` | Cong_khai filter + 2 tầng phân quyền | **B DELTA** | Đã apply qua FR-11 changelog |
| `srs-fr-16-api.md` | Cong_khai filter + whitelist BR-PUBLIC-04 | **B DELTA** | Đã apply qua FR-16 changelog |
| `srs-fr-08-danh-gia.md` | DANH_GIA tách entity | **C IMPACT** | Verify cross-ref entity name |
| `srs-fr-12-tv-chuyen-sau.md` | DN auth + DON_VI 2 tầng | **C IMPACT** | Verify dropdown DN |
| `srs-fr-06-chi-tra.md` | DN auth + DON_VI | **C IMPACT** | Verify TVV ref đồng bộ FR-04 |
| FR-02/09/13/14/15 | Mức nhẹ — DON_VI 2 tầng + BR-AUTH | **C/D** | Smoke 5 phút |

---

## 3. Findings critical (ưu tiên test)

1. **Bỏ `nguoi_ho_tro_id`** + thêm 3 cột phân công — schema migration risk cao. Test edge case: VV cũ có `nguoi_ho_tro_id` migrate sang `nguoi_xu_ly_id` đúng không.
2. **5 cột công khai mới + 2 self-loop SM** — luồng test mới: Công khai → verify Cổng PLQG có data + Badge "Đã công khai" hiển thị + LICH_SU ghi `CONG_KHAI`.
3. **CB PD từ chối → DANG_XU_LY** (không TU_CHOI) — test case cũ verify `trang_thai = TU_CHOI` sau từ chối → INVALID. Cần redesign.
4. **BR-PUBLIC-04 whitelist 9 fields** + blacklist (MST, địa chỉ, **tên DN**) — test API outbound chỉ trả 9 fields whitelist + KHÔNG trả tên DN.
5. **SLA 15 ngày** thay 10 ngày — test deadline + cảnh báo SLA đổi.
6. **DN auth Tier 2 VNeID** ở FR-V.I-02/04/14 — test DN không VNeID → ERR-VN-02 (chặn).
7. **3 transition SM-VUVIEC không có FR formal** (do Thay đổi 5/6/7 OUT): TU_CHOI → DA_TIEP_NHAN, auto 3 lần YCBS, auto-return — dev implement theo quy tắc UI v3 + BR-EC-15/16. Defer khi gặp behavior thực tế.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/funtion/7.5-vu-viec-htpl.md` | Refactor scope: thêm test FR-V.I-NEW-02 (DN bổ sung HS) + FR-V.I-NEW-05 (công khai VV). Đổi test case CB PD từ chối → DANG_XU_LY. Thêm test SCR-V.I-04 + SCR-V.I-05 chế độ DN. Bỏ test field `nguoi_ho_tro_id`, thêm 3 cột phân công mới. |
| `output/smoke-specs/6.5-smoke-vuviec.md` | Thêm smoke test luồng công khai VV + DN bổ sung HS |
| `output/smoke/6.5-sm-vuviec.md` | SM-VUVIEC: thêm 2 self-loop CONG_KHAI/HUY_CONG_KHAI; thêm transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (FR-V.I-NEW-02); sửa `CHO_PHE_DUYET → DANG_XU_LY` (không TU_CHOI) |
| `input/data/entity-map.md` | Update VU_VIEC entity (5 cột công khai + 3 cột phân công + bỏ `nguoi_ho_tro_id`); thêm 3 entity owned spec mới (PHAN_CONG_VU_VIEC, DANH_GIA_VU_VIEC, LICH_SU_VU_VIEC); update DON_VI 2 tầng |
| `input/data/seed-fixture.yaml` | Update `vu_viec_variants` (5 cột công khai + 3 cột phân công). Thêm `phan_cong_vu_viec_variants` + `danh_gia_vu_viec_variants` |
| `input/quy-trinh-nghiep-vu/flow-module.md` | §3 SM-VUVIEC: thêm 2 self-loop + transition NEW-02; bỏ `nguoi_ho_tro_id` |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Bảng phân công VV — bỏ row `nguoi_ho_tro_id`, thêm 3 row 3 cột mới + 2 thẻ Cá nhân/Tổ chức |
| `output/permission-matrix-by-fr.md` + `by-role.md` | Thêm 2 SCR DN mới (SCR-V.I-04 + V.I-05); update VU_VIEC entity scope (cong_khai = public read) |
| `tasks/todo.md` R7 | Thêm task R7.5.X: workflow công khai VV + DN bổ sung HS + đánh giá thang 0-10 |
| `output/test-strategy.md` | Note: SRS update FR-05 — 14 changes IN, scope mở rộng 2 FR mới + 2 SCR DN mới |

**KHÔNG động:**
- `srs-v3/srs-fr-05-vu-viec.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-05-vu-viec.md` — file delta source.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-05 (VV)** → cite `srs-update-2026-5-5/srs-fr-05-vu-viec.md:line N`.
- **Test công khai VV** → cite FR-V.I-NEW-05 + BR-PUBLIC-01/04 + NĐ 13/2023.
- **Test DN bổ sung HS** → cite FR-V.I-NEW-02 + BR-EC-16.
- **Test phân công VV** → cite refactor 3 cột + FR-V.I-09 (2 thẻ Cá nhân/Tổ chức).
- **Mâu thuẫn `nguoi_ho_tro_id` cũ trong DB** (record cũ): log thành **bug data migration**, hỏi BA/dev — KHÔNG tự suy luận.
- **NotebookLM HTPLDN query** → cần re-index thêm `srs-update-2026-5-5/srs-fr-05-vu-viec.md`. Trước khi re-index, query NotebookLM trả kết quả từ file cũ → cross-check thủ công.

---

## 6. Open issues — defer kiểm tra khi test

- **Cite NĐ 55 Đ.8 K.1** (SLA 15 ngày) — chưa web-verify. Defer khi test, log bug nếu BE deploy với SLA cũ.
- **Cite NĐ 69/2024** (SSO VNeID — BR-AUTH-01) — chưa verify, IN theo v4.
- **Cite NĐ 55 Đ.7 + Đ.10** (NHT + TC TV) — đã verify ❌ WRONG ở `legal-citations-verification.md` lượt 6 → KHÔNG cite.
- **Migration data cũ:** record VV có `nguoi_ho_tro_id` → migrate sang `nguoi_xu_ly_id` đúng không? SRS không cover. Test edge case khi gặp.
- **Mở lại HS sau Thay đổi 8 IN, Thay đổi 5 OUT:** entity model đổi 3 cột phân công nhưng SM action mơ hồ — không nói rõ có clear 3 cột này khi `TU_CHOI → DA_TIEP_NHAN`. Defer Pha 3 spec rõ.
- **3 transition không có FR formal** (5/6/7 OUT): chỉ có quy tắc UI + BR-EC-15/16 — dev implement theo v3 hành vi.
