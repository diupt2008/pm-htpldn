# Delta Map — FR-08 update (Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-08-danh-gia.md` so với `srs-v3/srs-fr-08-danh-gia.md` — apply 8 thay đổi (A=4 + B1=4) + 1 phát hiện ngoài v4 (C.2).
> **Ngày tạo:** 2026-05-06 | **Tác giả:** QA + Claude
> **Source:** CHANGELOG-v3-to-v3.5.md line 880-1006.
> **⚠️ Lưu ý:** Folder `srs-update-2026-5-5/` KHÔNG có file `srs-fr-08-danh-gia.md` riêng — apply trực tiếp vào CHANGELOG (giống FR-11/FR-16). Khi tra cứu line N, dùng `srs-v3.5/srs-fr-08-danh-gia.md` BA build sau khi apply.

---

## 1. Có gì mới / đổi / xoá

### Đổi tên module (CR-10 / A-ITEM-08)

**"Kế hoạch đánh giá" → "Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý"** — đổi 9 vị trí (title file, header nhóm, breadcrumb SCR-VI-01, tiêu đề trang, mục lục, footer file, SM-DANHGIA name).

### FR mới (1 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-VI-10 | Nhận kết quả đánh giá (read-only) | Tác nhân: CB NV thuộc cơ quan **được** đánh giá. Chỉ xem khi đợt = HOAN_THANH. CR-10 + Q-06 + GAP-VI-04 |

### Entity đổi

| Entity | Thay đổi | Note |
|---|---|---|
| `KE_HOACH_DANH_GIA` (rename từ `DOT_DANH_GIA`) | + `co_quan_duoc_danh_gia_id` (1:1, FK DON_VI) + `file_dinh_kem` (file[]) | Q-07 chốt 1 KH = 1 cơ quan. CR-10 + A-ITEM-07 |
| `KET_QUA_DANH_GIA` | Rename ref module | — |
| `BAO_CAO_DANH_GIA` | Rename ref module | — |

### Đổi FK (sửa lỗi nội bộ B1)

**`dot_danh_gia_id` → `ke_hoach_danh_gia_id`** ở 9 vị trí (FR-VI-02..09 Inputs row #1 + FR-VI-01 Outputs + FR-VI-01 Postcondition).

### State Machine — SM-DANHGIA chuẩn hoá

**8 trạng thái cuối cùng** (gộp 3 phiên bản v3 không khớp nhau):
`LAP_KE_HOACH` / `PHAN_CONG` / `CHO_DUYET_PHAN_CONG` / `THUC_HIEN` / `BAO_CAO` / `CHO_PHE_DUYET` / `HOAN_THANH` / **`HUY`** (mới)

**v3 tự mâu thuẫn nội bộ:**
- §1 dùng 9 states cũ ("Bản nháp / Đã lập kế hoạch / ...")
- §4 dùng 6 states ("Dự thảo / Chờ duyệt phân công / ...")
- §5 dùng 7 states (không có "Hủy")

**v3.5 chốt:** 8 states lấy từ §5 + thêm `HUY` (đường thoát khi đợt sự cố). Đổi `NHAP` → `LAP_KE_HOACH`, `DA_LAP_KH` → `PHAN_CONG`, `DA_DUYET_PC` → `THUC_HIEN`, `DANG_DANH_GIA` → `THUC_HIEN`, `DA_DANH_GIA` → `BAO_CAO`, `DA_LAP_BC` → `BAO_CAO`, `CHO_DUYET_BC` → `CHO_PHE_DUYET`, `DA_DUYET_BC` → `HOAN_THANH`.

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| BR-NOTIF-01 áp dụng | Chỉ FR-VI-09 | **FR-VI-03/04/08/09** (mở rộng phạm vi vì 4 FR đều có gửi thông báo) |
| Cơ quan tham gia 1 đợt | 1 ô (chung) | **2 vai trò tách:** cơ quan thực hiện đánh giá + cơ quan được đánh giá |
| Kết quả cho cơ quan được đánh giá | Không xem được | **FR-VI-10** read-only khi HOAN_THANH |
| File đính kèm KH đánh giá | Không có | `file_dinh_kem` file[] (CR-07) |

### Số FR

- v3: 9 FR → v3.5: **10 FR** (thêm FR-VI-10).

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Phụ thuộc | Nhóm | Test scope |
|---|---|---|---|
| `srs-fr-08-danh-gia.md` (self) | — | **A FULL** | Đổi tên module + FR-VI-10 mới + 8 trạng thái + entity rename |
| `srs-v3.md` (master) | ERD master + entity matrix | **A FULL** | Sync rename `DOT_DANH_GIA → KE_HOACH_DANH_GIA` toàn hệ thống |
| `srs-fr-11-bao-cao.md` | FR-IX-09 ref `dot_danh_gia_id` cũ | **B DELTA** | Đã apply qua FR-11 changelog Thay đổi 5 — verify đồng bộ |
| `srs-fr-04-chuyen-gia-tvv.md` | DANH_GIA_SAU_VU_VIEC ref FR-04 | **C IMPACT** | Thang điểm đồng bộ (TVV 1-5 vs VV 0-10) |
| `srs-fr-05-vu-viec.md` | DANH_GIA_VU_VIEC tách entity ở FR-05 | **C IMPACT** | Verify cross-ref entity name |
| `srs-fr-15-ct-htpldn.md` | CHUONG_TRINH_HTPL ref BC | **C IMPACT** | Đã apply qua FR-11 |
| FR-01/02/06/07/09/10/12/13/14/16 | Mức rất nhẹ | **D SKIP** | Smoke 5 phút |

---

## 3. Findings critical (ưu tiên test)

1. **Đổi tên module + entity** — toàn bộ test case cũ tham chiếu "Kế hoạch đánh giá" / `DOT_DANH_GIA` → cần migrate tên mới. Risk: tester nhầm 2 module khác nhau.
2. **8 trạng thái SM-DANHGIA** — v3 tự mâu thuẫn, dropdown UI lệch badge. Test full transition sequence để verify migration đúng.
3. **`HUY` mới** — luồng test mới: tạo đợt → HUY (mid-life) → verify không cho restore.
4. **FR-VI-10 read-only** — test access control: CB NV thuộc cơ quan được đánh giá thấy được; CB NV cơ quan khác → 403.
5. **`co_quan_duoc_danh_gia_id` 1:1** — schema migration. Test edge case: KH cũ không có cột này → backfill thế nào? Defer hỏi BA.
6. **BR-NOTIF-01 mở rộng FR-VI-03/04/08** — verify thông báo gửi đủ 4 FR (trước chỉ FR-VI-09).

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/funtion/7.8-danh-gia.md` | Refactor scope — đổi tên test "Kế hoạch đánh giá" → "Theo dõi Đánh giá Hiệu quả HTPL"; thêm test FR-VI-10 (read-only); thêm test 2 vai trò cơ quan; thêm test luồng HUY; verify thông báo BR-NOTIF-01 ở 4 FR |
| `output/smoke-specs/6.8-smoke-danhgia.md` | Thêm smoke FR-VI-10 + verify HUY |
| `output/smoke/` (chưa có 6.8-sm) | Tạo mới `6.8-sm-danhgia.md` với SM-DANHGIA 8 trạng thái + transition HUY (4 nhánh từ LAP_KE_HOACH/PHAN_CONG/THUC_HIEN/BAO_CAO → HUY) |
| `input/data/entity-map.md` | Rename `DOT_DANH_GIA` → `KE_HOACH_DANH_GIA` (mass replace cẩn thận); thêm field `co_quan_duoc_danh_gia_id` + `file_dinh_kem`; cập nhật cột "Tạo tại / Đọc tại" cho FR-VI-10 |
| `input/data/seed-fixture.yaml` | Rename block `dot_danh_gia_variants` → `ke_hoach_danh_gia_variants`; thêm field `co_quan_duoc_danh_gia_id` + 8 trạng thái + `file_dinh_kem` |
| `input/quy-trinh-nghiep-vu/flow-module.md` | §6 hoặc §X SM-DANHGIA: 8 trạng thái + thêm HUY (4 transition) + đổi tên SM |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Bảng SM transition module Đánh giá: refresh đồng bộ 8 trạng thái |
| `output/permission-matrix-by-fr.md` + `by-role.md` | Thêm FR-VI-10; rename entity `DOT_DANH_GIA` → `KE_HOACH_DANH_GIA`; verify scope CB NV cơ quan được đánh giá có Read |
| `output/permission-matrix.md` | Rename entity (cẩn thận grep + sed) |
| `tasks/todo.md` R7 | Thêm task R7.X: workflow đánh giá 8 trạng thái + FR-VI-10 read-only + verify HUY |
| `output/test-strategy.md` | Note: SRS update FR-08 — 8 changes IN, đổi tên module + FR-VI-10 mới + entity rename |

**KHÔNG động:**
- `srs-v3/srs-fr-08-danh-gia.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md` — file source.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-08** → cite `srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md:line 880-1006` (vì không có file SRS riêng).
- **Test FR-VI-10** → cite Thay đổi 3 + Q-06 (chỉ xem) + GAP-VI-04.
- **Test 8 trạng thái** → cite Thay đổi 6 (6.1-6.27) + GAP-VI-01. Bỏ ref tên trạng thái cũ.
- **Test rename entity** → cite Thay đổi 7 (7.1-7.9). Mâu thuẫn nội bộ "Đợt đánh giá" / "Kế hoạch đánh giá" v3 — chốt 1 tên duy nhất.
- **Mâu thuẫn `DOT_DANH_GIA` cũ trong DB** (record/migration): log thành **bug data migration**, hỏi BA/dev.

---

## 6. Open issues — defer kiểm tra khi test

- **T4 — 5 trường công khai chuyên trang** (PENDING D.1): KH đánh giá có thuộc 12 DS công khai theo CR-01 không? Chưa rõ — defer.
- **T9 — CB PD vào tác nhân FR-VI-02/06** (OUT): v4 ghi "theo CSV UC 84/88" nhưng CSV chỉ "CB NV TW/BN/ĐP" → giữ v3 (chỉ CB NV).
- **C.3 — Mẫu 21a/21b TT17/2025** (OUT, BA chốt giữ nguyên): mâu thuẫn nội bộ "Mẫu 21a/21b thuộc nhóm XI" + entity `BAO_CAO_DANH_GIA.mau_bao_cao` enum `('MAU_21A','MAU_21B')` — chấp nhận để theo dõi.
- **C.1 — Vết NHAP/DA_LAP_KH ở SCR-VI-01 Mô tả + URL pattern** (BA chốt IN nhưng KHÔNG APPLICABLE cho v3.5): block "Mô tả + URL pattern + Quyền truy cập" của v4 KHÔNG có trong v3.5 baseline → 2 vị trí cần sửa của C.1 không tồn tại trong v3.5. Áp dụng khi v3.5+ refactor SCR-VI-01.
- **D.3 — NĐ 55/2019 Điều 11** (FR-VI-10): chưa web-verify — defer.
- **D.4 — Cờ "CR-VI-01"** trong v4 không tồn tại trong CR analysis — dùng "CR-10 (ITEM-08)" trong CHANGELOG.
