# Delta Map — FR-04 update (Quản lý CG/TVV)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md` so với `srs-v3/srs-fr-04-chuyen-gia-tvv.md`, list module bị ảnh hưởng + file QA cần update.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude
> **Source:** Lịch sử thay đổi của file mới (block 5 lần BA + Claude apply review từ 2026-04-03 đến 2026-05-03).

---

## 1. Có gì mới / đổi / xoá

### FR mới (7 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-IV-13 | Tiếp nhận & chuyển trạng thái tiền thẩm định | Cover gap F-32/F-33/F-34 SM-TVV |
| FR-IV-NEW-01 | Quản lý Tổ chức tư vấn | Tách submodule riêng |
| FR-IV-NEW-02 | Cập nhật trạng thái Tổ chức tư vấn | SM-TCTV |
| FR-IV-NEW-04 | Phê duyệt Tổ chức tư vấn | NĐ 55/2019 Đ.9 — BA chốt phương án A |
| FR-IV-NHT-01 | Quản lý Người hỗ trợ pháp lý | Entity NHT mới — phương án B+ |
| FR-IV-NHT-02 | Tìm kiếm NHT | Cho UC59 phân công vụ việc |
| FR-IV-NHT-03 | Xem hồ sơ NHT | — |

### SCR mới (6 SCR + 2 bảng tham chiếu)

- `SCR-IV-NEW-01/02/03` — Tổ chức tư vấn (list / form / detail).
- `SCR-IV-NHT-01/02/03` — Người hỗ trợ pháp lý (list / form / detail).
- `§ 3.0` — Bảng ánh xạ enum DB → label tiếng Việt cho SM-TVV/SM-TCTV/SM-NHT/loai_tvv/loai_hinh.
- `§ 3.0b` — 11 mẫu hộp thoại xác nhận MD-*.
- `SCR-IV-01` — Tách 2 tab "Đang thẩm định" + "Yêu cầu bổ sung"; menu đổi tên "Cá nhân tư vấn" → "Tư vấn viên / Chuyên gia"; thêm sub-menu NHT.

### Entity mới / đổi

| Entity | Loại | Note |
|---|---|---|
| `NGUOI_HO_TRO` | **Mới owned** | 1:1 với TAI_KHOAN, NĐ 55/2019 Đ.7 — cán bộ HTPL nội bộ |
| `NGUOI_HO_TRO_LINH_VUC` | **Mới junction** | N:N NHT ↔ DANH_MUC (lĩnh vực) |
| `TO_CHUC_TU_VAN` | Nâng cấp | Từ danh mục → entity riêng, SM 6 state |
| `DANH_GIA_SAU_VU_VIEC` | Tách riêng | Từ DANH_GIA_TU_VAN_VIEN, thang 1-5 |
| `TVV_DIA_BAN` | **XOÁ** | TVV scope toàn quốc theo NĐ 77/2008 Đ.19 |
| `TU_VAN_VIEN` | Đổi field | Bỏ `dia_ban_ids[]`; enum `loai_tvv` BỎ `'NHT'` (chỉ còn `'TVV','CG'`) |

### State Machine

- **SM-TCTV mới** — 6 state: MOI_DANG_KY → CHO_PHE_DUYET → HOAT_DONG → TAM_DUNG → VO_HIEU_HOA + TU_CHOI.
- **SM-NHT mới** — 4 state: CHO_KICH_HOAT → HOAT_DONG → TAM_DUNG → VO_HIEU_HOA (KHÔNG cần workflow thẩm định 4 tiêu chí như TVV).
- **SM-TVV** — vẫn 10 state, thêm CHO_KICH_HOAT sau phê duyệt.

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| Thang điểm thẩm định | 0-10 | **1-5** DECIMAL(3,1) |
| Field địa bàn TVV | `dia_ban_id[]` | **`don_vi_id`** (đơn vị công nhận) |
| Cooldown nộp lại sau TU_CHOI | 6 tháng | **Bỏ** (NĐ không quy định) |
| Trích pháp lý phê duyệt TC TV | NĐ 121/2025 Đ.24 | **NĐ 121/2025 Đ.39-40** + NĐ 55/2019 Đ.9 |
| ESCALATE phê duyệt TVV xuyên cấp | Bắt buộc | **Bỏ** — mỗi cấp tự công bố |
| NHT là loại TVV | `loai_tvv = 'NHT'` | **Tách entity riêng** NGUOI_HO_TRO |

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4 (CLAUDE.md global)

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-v3.md` (master) | 134 | **A FULL** | ERD master + glossary + SM toàn hệ thống |
| `srs-fr-05-vu-viec.md` | 66 | **A FULL** | Phân công NHT/TVV (SCR-V.I-03), SM-VUVIEC, FK `nguoi_ho_tro_id` |
| `srs-fr-12-tv-chuyen-sau.md` | 41 | **A FULL** | FK `chuyen_gia_id` → TU_VAN_VIEN, dropdown CG, đánh giá 1-5 |
| `srs-fr-14-hop-dong-tv.md` | 13 | **B DELTA** | Enum `loai_tvv` bỏ `'NHT'`, FK `tu_van_vien_id` |
| `srs-fr-11-bao-cao.md` | 17 | **B DELTA** | FR-XI-04 — bỏ filter `dia_ban_id`, filter `loai_tvv` chỉ TVV/CG |
| `srs-fr-09-bieu-mau.md` | 11 | **B DELTA** | Mẫu HĐ tư vấn — FK `tu_van_vien_id` |
| `srs-fr-02-hoi-dap.md` | 10 | **B DELTA** | FR-II-06 Phân công NHT/TVV — dropdown 2 entity riêng |
| `srs-fr-03-dao-tao.md` | 13 | **B DELTA** | NHT tác nhân phụ (đăng ký KH, đề xuất ĐT) |
| `srs-fr-08-danh-gia.md` | 6 | **B DELTA** | Enum `loai_tvv` ERD reference |
| `srs-fr-06-chi-tra.md` | 11 | **B DELTA** | Enum `loai_tvv` ERD reference |
| `srs-fr-10-quan-tri.md` | 18 | **B DELTA** | DM `TO_CHUC_TU_VAN` — đã thành submodule riêng, cần align |
| `srs-fr-16-api.md` | 19 | **B DELTA** | API entity TU_VAN_VIEN — bỏ `'NHT'` khỏi enum check |
| `srs-fr-01-dashboard.md` | 10 | **C IMPACT** | KPI-07 đếm CG/TVV (sau khi NHT tách → count thay đổi) |
| `srs-fr-07-doanh-nghiep.md` | 0 | **D SKIP** | Smoke 5 phút |
| `srs-fr-13-tv-nhanh.md` | 0 | **D SKIP** | Smoke 5 phút |
| `srs-fr-15-ct-htpldn.md` | 0 | **D SKIP** | Smoke 5 phút |

---

## 3. Findings critical (ưu tiên test)

1. **FK `nguoi_ho_tro_id` → TU_VAN_VIEN** ở FR-05 line 119/578/646 — cần đổi target sang entity NHT mới. Schema migration risk cao.
2. **`loai_tvv CHECK IN ('TVV','CG','NHT')`** xuất hiện ở 5 file (FR-05, FR-06, FR-08, FR-14, FR-16) — cần BỎ `'NHT'` khỏi enum.
3. **Filter `dia_ban_id`** ở FR-11 line 448 — cần BỎ.
4. **KPI-07 dashboard** — count thay đổi sau khi NHT tách entity. Cần BA confirm trước khi viết test plan FR-01.
5. **FR-12 đánh giá 1-5** — đã align FR-04 mới (verify only, không đổi).

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | Thêm 2 entity: `NGUOI_HO_TRO` + `TO_CHUC_TU_VAN`. 49 entity → 51 entity × 11 role |
| `input/data/entity-map.md` | Thêm 2 entity vào ma trận "Tạo tại / Đọc tại" |
| `input/data/seed-fixture.yaml` | Thêm fixture cho NHT (≥6 variant theo lĩnh vực) + TC TV (≥6 variant theo loại hình) |
| `input/flow-module.md` | Thêm SM-TCTV (6 state) + SM-NHT (4 state) vào §02-thu-tu-module + Phụ lục 2 Seed Presets |
| `output/funtion/7.4-*.md` | Tách thành 3 file: `7.4-CG-TVV.md` (giữ), `7.4a-NHT.md` (mới), `7.4b-TCTV.md` (mới) |
| `output/smoke-specs/6.4-smoke-*.md` | Tách 3 smoke spec tương ứng |
| `output/smoke/6.4-sm-*.md` | Tách 3 SM spec: SM-TVV (giữ), SM-NHT (mới), SM-TCTV (mới) |
| `tasks/todo.md` | Thêm Round 7 (hoặc round mới) — list task seed + workflow + functional + permission cho 3 entity |
| `output/test-strategy.md` | Note SRS update reference, scope mở rộng 49 → 51 entity |
| `input/users.csv` | Cân nhắc thêm role NHT thực tế (nếu chưa có) — hỏi BA |

**KHÔNG động:**
- `srs-v3/srs-fr-04-chuyen-gia-tvv.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md` — file delta source, giữ nguyên.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug liên quan FR-04 (CG/TVV/NHT/TC TV)** → cite `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:line N`.
- **Test/log bug module khác (FR-05/FR-12/...) đọc data CG/TVV** → cite `srs-v3/srs-fr-XX.md:line N` (mô tả màn hình) **+** `srs-update-2026-5-5/srs-fr-04-...md:line N` (cho data structure).
- **Mâu thuẫn giữa 2 file** (vd `srs-v3/srs-fr-05.md` ghi `loai_tvv = 'NHT'` còn FR-04 mới đã bỏ) → tin **file mới (update)**, log thành **bug SRS contradiction** trước, hỏi BA, không tự suy luận.
- **NotebookLM HTPLDN query** → cần re-index thêm 3 file `srs-update-2026-5-5/*.md` (1 lần). Trước khi re-index, mọi query NotebookLM trả kết quả từ file cũ — phải cross-check thủ công với folder mới.

---

## 6. Đáp án từ deep review SRS (2026-05-05)

| # | Câu hỏi | Đáp án | Bằng chứng |
|---|---|---|---|
| 1 | KPI-07 có gồm NHT? | **KHÔNG.** Sau khi NHT tách entity, KPI-07 query trên `TU_VAN_VIEN` mà `loai_tvv` giờ chỉ `('TVV','CG')`. NHT không còn record trong TU_VAN_VIEN. **Verify count thay đổi (giảm)** khi test FR-01. | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:132` (`CHECK IN ('TVV','CG')`) + `srs-v3/srs-fr-01-dashboard.md:611` (`COUNT(*) WHERE trang_thai='DANG_HOAT_DONG'`) |
| 2 | Role NHT trong users.csv? | **ĐÃ CÓ.** `nht_01/02/03` với `vai_tro=NHT`, `loai_tai_khoan=NHT`. Convention `nht_<số>` (không có cấp đơn vị). Khi seed thêm → giữ pattern. | `input/users.csv:26-28` |
| 4 | Permission tab SCR-IV-01? | **GIỮ NGUYÊN** permission tab TVV/CG. Đổi menu là UI label. Chỉ THÊM permission cho 3 SCR mới: SCR-IV-NHT-01/02/03 (actor: QTHT + CB NV theo FR-IV-NHT-01). | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:1267` (FR-IV-NHT-01 actor) |

## 7. Open issues — defer kiểm tra khi test

- **Migration data cũ** (`loai_tvv = 'NHT'`): SRS không cover migration. Khi gặp record cũ trong DB → log + hỏi BA/dev. Test edge case lúc chạy workflow.
