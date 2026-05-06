# Delta Map — FR-09 update (Thư viện Biểu mẫu, Hợp đồng)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-09-bieu-mau.md` so với `srs-v3/srs-fr-09-bieu-mau.md` — apply 6 thay đổi (A=1 + B1=5, gồm 4 cherry-pick v4 + 2 V4-CHƯA-SỬA).
> **Ngày tạo:** 2026-05-06 | **Tác giả:** QA + Claude
> **Source:** CHANGELOG-v3-to-v3.5.md line 1010-1127.
> **⚠️ Lưu ý:** Folder `srs-update-2026-5-5/` KHÔNG có file `srs-fr-09-bieu-mau.md` riêng — apply trực tiếp vào CHANGELOG. Tra cứu line N dùng `srs-v3.5/srs-fr-09-bieu-mau.md` BA build sau khi apply.

---

## 1. Có gì mới / đổi / xoá

### Áp CR-01 cho BIEU_MAU (A-CR-01 + B1)

**Đổi tên + thêm 4 trường công khai chuyên trang:**

| Field | Trước | Sau |
|---|---|---|
| `la_cong_khai` | boolean | **rename → `cong_khai` boolean** [CR-01] |
| `anh_dai_dien` | (chưa có) | **mới — binary** |
| `thoi_gian_dang_tai` | (chưa có) | **mới — datetime, auto-fill khi `cong_khai=1`** |
| `mo_ta_cong_khai` | (chưa có) | **mới — text, soạn riêng cho người ngoài (KHÁC mô tả nội bộ)** |
| `file_dinh_kem_cong_khai` | (chưa có) | **mới — file[]** |

**UI thay đổi:** SCR-VII-02 thêm cột "Đã công khai" + cột "Ảnh đại diện" + Switch "Công khai trên Cổng PLQG" trong form Thêm/Sửa biểu mẫu.

**3 BR mới:**
- `BR-PUBLIC-01` — điều kiện công khai BIEU_MAU bất kỳ.
- `BR-PUBLIC-02` — hủy công khai clear `thoi_gian_dang_tai` + gọi API gỡ Cổng.
- `BR-PUBLIC-03` — auto-fill `thoi_gian_dang_tai` khi bật công khai, không cho sửa tay.

### Đồng bộ enum trạng thái THU_MUC_BIEU_MAU (B1)

| Trước | Sau |
|---|---|
| `CHECK IN ('KICH_HOAT','VO_HIEU_HOA') default 'KICH_HOAT'` | `CHECK IN ('NHAP','CONG_KHAI','AN') default 'NHAP'` |
| `la_cong_khai` | rename `cong_khai` |

v3 mâu thuẫn nội bộ: form FR-VII-01 cho "Nháp/Công khai", hồ sơ thư mục v3 ghi "Kích hoạt/Vô hiệu hoá". v3.5 chốt 1 bộ enum.

### TÁCH `HOP_DONG_TU_VAN` sang `srs-fr-14-hop-dong-tv.md` (B1 — Thay đổi 3)

- §1 Header: bỏ UC163 — `UC 92 – UC 98` (giảm 1 UC). Số FR giảm 1.
- §2 FR-VII-08: bỏ full FR Quản lý HĐ TV (block 70+ dòng v3) → block stub redirect.
- §4 entity HOP_DONG_TU_VAN: bỏ full bảng attributes 12 trường → block stub redirect.
- §1 Lịch sử thay đổi mới (2 entry: 2026-04-03 tạo từ v3 + 2026-05-06 áp v3.5).

### Cleanup HOP_DONG_TU_VAN traces (B1 V4-CHƯA-SỬA — Thay đổi 5)

5 vị trí dọn ngoài note redirect (v4 quên dọn):
- §4 Tổng quan entity: bỏ row `HOP_DONG_TU_VAN owned` + bỏ `TU_VAN_VIEN referenced` (chỉ tồn tại để link HĐ TV).
- §4 ERD: xóa block entity HOP_DONG_TU_VAN (10 dòng) + xóa block TU_VAN_VIEN (4 dòng) + xóa 2 quan hệ.
- §6 BR Tổng quan: bỏ row `BR-DATA-04` (label sai "FR-VII-06 (HĐ TV)").
- §6 BR-DATA-04: xóa toàn bộ section.

### Sửa FR ref BR-FLOW-07 (B1 V4-CHƯA-SỬA — Thay đổi 6)

- v4 line 847 SM-BIEUMAU: transition `NHAP → CONG_KHAI` ref `FR-VII-02` (Tìm kiếm) → SAI. **Sửa: `FR-VII-03`** (Công khai thư mục — UC94).
- v4 line 874 BR-FLOW-07 áp dụng: `FR-VII-02, FR-VII-03` → **chỉ `FR-VII-03`**.

### BR-AUTH-01 — Mô hình 2-tier (B1 — Thay đổi 4)

| Trước | Sau |
|---|---|
| Tier 1 (MVP) + VNPT eKYC + SSO VNeID | **2-tier: Tier 1 nội bộ qua mạng kín + Tier 2 SSO VNeID OIDC** (NĐ 69/2024). Không có VNPT eKYC. |

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| Rename cờ công khai | `la_cong_khai` | **`cong_khai`** (đồng bộ với BIEU_MAU + THU_MUC + Cổng PLQG outbound API) |
| Owner HOP_DONG_TU_VAN | FR-09 nhóm VII | **FR-14** nhóm X.3 |
| BR-FLOW-07 áp dụng | FR-VII-02 + FR-VII-03 | Chỉ **FR-VII-03** |

### Số FR / UC

- v3: 8 FR, UC 92-98 + UC163 → v3.5: **7 FR**, UC 92-98 (bỏ FR-VII-08 + UC163).

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Phụ thuộc | Nhóm | Test scope |
|---|---|---|---|
| `srs-fr-09-bieu-mau.md` (self) | — | **A FULL** | CR-01 cong_khai 4 trường + 3 BR-PUBLIC + tách HĐ TV + enum THU_MUC + cleanup |
| `srs-fr-14-hop-dong-tv.md` | Nhận entity HOP_DONG_TU_VAN move | **A FULL** | New owner — toàn bộ FR Quản lý HĐ TV chuyển sang đây |
| `srs-v3.md` (master) | ERD + entity matrix | **A FULL** | Sync rename `la_cong_khai → cong_khai` toàn hệ thống + move HOP_DONG_TU_VAN ownership |
| `srs-fr-16-api.md` | API outbound BIEU_MAU + filter `cong_khai=1` | **B DELTA** | Đã apply qua FR-16 changelog Thay đổi 1 (rename + filter) |
| `srs-fr-04-chuyen-gia-tvv.md` | TC TV cong_khai (đồng bộ pattern CR-01) | **C IMPACT** | Verify pattern 4 trường giống nhau |
| `srs-fr-05-vu-viec.md` | VV cong_khai (đồng bộ pattern CR-01) | **C IMPACT** | Verify pattern 4 trường giống nhau |
| `srs-fr-10-quan-tri.md` | BR-AUTH-01 2-tier (source of truth) | **B DELTA** | Đã apply qua FR-10 |
| FR-01/02/03/05/06/07/08/11/12/13/15 | Mức rất nhẹ | **D SKIP** | Smoke 5 phút |

---

## 3. Findings critical (ưu tiên test)

1. **Rename `la_cong_khai` → `cong_khai`** — schema migration. Mass impact: BIEU_MAU + THU_MUC_BIEU_MAU + API outbound (FR-16). Test verify field tên đúng + DB column rename.
2. **4 trường công khai mới** — UI test Switch + form input + auto-fill `thoi_gian_dang_tai`. Edge: bật công khai khi thiếu `mo_ta_cong_khai` → BR-PUBLIC-01 reject.
3. **HOP_DONG_TU_VAN tách sang FR-14** — đường link cũ `/bieu-mau/hop-dong-tu-van` redirect sang `/hop-dong-tv`? Test 404 / redirect. Permission scope chuyển sang FR-14.
4. **Enum THU_MUC_BIEU_MAU đổi** — toàn bộ test case verify `KICH_HOAT/VO_HIEU_HOA` → INVALID. Migrate sang `NHAP/CONG_KHAI/AN`.
5. **BR-FLOW-07 fix FR ref** — verify nút "Công khai thư mục" KHÔNG ở FR-VII-02 (Tìm kiếm) mà ở FR-VII-03.
6. **3 BR-PUBLIC mới** — test workflow công khai: bật → auto fill timestamp; tắt → clear timestamp + gọi API gỡ Cổng PLQG.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/funtion/7.9-bieu-mau.md` | Refactor scope — đổi field `la_cong_khai` → `cong_khai`; thêm test 4 trường mới + Switch UI; bỏ test FR-VII-08 (HĐ TV); thêm test BR-PUBLIC-01/02/03; verify enum THU_MUC mới |
| `output/funtion/7.14-hop-dong-tv.md` | **Refactor lớn** — nhận FR Quản lý HĐ TV move từ FR-09 (toàn bộ entity HOP_DONG_TU_VAN + 12 fields + workflow + UI) |
| `output/smoke-specs/6.9-smoke-bieumau.md` | Thêm smoke công khai BM (Switch + auto-fill) |
| `output/smoke-specs/6.14-smoke-hop-dong-tv.md` | Add smoke cover entity HĐ TV mới owned |
| `input/data/entity-map.md` | Mass replace `la_cong_khai` → `cong_khai` cho BIEU_MAU + THU_MUC_BIEU_MAU; thêm 4 fields công khai cho BIEU_MAU; **move HOP_DONG_TU_VAN ownership từ FR-09 sang FR-14** (cẩn thận grep cột "Tạo tại / Đọc tại"); update enum THU_MUC |
| `input/data/seed-fixture.yaml` | Rename `la_cong_khai` → `cong_khai`; thêm 4 fields cho `bieu_mau_variants`; verify `hop_dong_tu_van_variants` (nếu có) move sang FR-14 reference |
| `input/quy-trinh-nghiep-vu/flow-module.md` | SM-BIEUMAU transition `NHAP → CONG_KHAI` ref FR-VII-03 (sửa từ FR-VII-02); update enum THU_MUC nếu có |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Bảng thứ tự module Biểu mẫu — verify field cong_khai + 4 fields mới |
| `output/permission-matrix-by-fr.md` + `by-role.md` | Move HOP_DONG_TU_VAN entity row khỏi FR-09 sang FR-14 (cẩn thận); thêm 4 fields cong_khai cho BIEU_MAU public read |
| `output/permission-matrix.md` | Verify đồng bộ |
| `tasks/todo.md` R7 | Thêm task R7.X: workflow công khai BM với 4 trường mới + verify rename `la_cong_khai → cong_khai`; verify HĐ TV move ownership |
| `output/test-strategy.md` | Note: SRS update FR-09 — 6 changes IN, scope giảm 1 FR (HĐ TV move) + thêm 4 trường công khai + 3 BR-PUBLIC |

**KHÔNG động:**
- `srs-v3/srs-fr-09-bieu-mau.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md` — file source.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-09 (BIEU_MAU + THU_MUC)** → cite `srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md:line 1010-1117`.
- **Test/log bug HOP_DONG_TU_VAN** → cite **FR-14** (đã move). KHÔNG cite FR-09 nữa.
- **Test rename `la_cong_khai`** → cite Thay đổi 1 (1.1-1.12) + Thay đổi 2 (THU_MUC).
- **Test BR-PUBLIC-01/02/03** → cite Thay đổi 1 phần D.2 (line 263-282 của báo cáo phân tích CR).
- **Mâu thuẫn `la_cong_khai` cũ** trong DB schema sau migrate: log thành **bug data migration**.
- **Mâu thuẫn URL `/bieu-mau/hop-dong-tu-van`** (cũ) → log nếu BE còn endpoint cũ.

---

## 6. Open issues — defer kiểm tra khi test

- **T7 — UC97 "Công khai biểu mẫu cá nhân"** (OUT, BA chốt 2026-05-06): CSV §VII.2 dòng 828-834 yêu cầu thao tác cho TỪNG BM cá nhân. v3.5 KHÔNG thêm FR-VII-NEW-01. Hệ quả: field `cong_khai` chỉ set qua form FR-VII-04 hoặc cascade khi thư mục công khai (FR-VII-03). Defer phiên bản sau.
- **T8 — Field `thu_tu_hien_thi`** (OUT, BA chốt): xuất hiện ở Inputs/form nhưng KHÔNG persist (không có entity column). Input không lưu được. Defer.
- **D.1 — CR-VII-01/02/03** (giữ y v4): không tồn tại trong CR analysis — chỉ cite **CR-01**.
- **D.2 — THU_MUC_BIEU_MAU 4 CPF**: KHÔNG thêm 4 fields công khai cho thư mục (chỉ rename `la_cong_khai → cong_khai`). Hệ quả: thư mục không có ảnh đại diện/mô tả công khai riêng.
- **D.3 — Mô hình B Hybrid** (giữ y v4): KHÔNG áp cho BIEU_MAU. Memory `project_mau_phan_hoi_mo_hinh_b` chỉ chốt cho MAU_PHAN_HOI (FR-02). BIEU_MAU giữ phân quyền theo `don_vi_id` + BR-AUTH-08.
- **D.4 — UC ref FR-VII-06/07** (lệch CSV): giữ y SRS hiện tại — BA chấp nhận tạm.
- **D.5 — SM-BIEUMAU header** (giữ y v4): vẫn ghi "Entity: BIEU_MAU"; THU_MUC_BIEU_MAU dùng cùng enum NHAP/CONG_KHAI/AN — quan hệ ngầm, đủ rõ.
