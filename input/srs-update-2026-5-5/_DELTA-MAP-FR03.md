# Delta Map — FR-03 update (Quản lý Đào tạo, Tập huấn)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-03-dao-tao.md` (2954 lines) so với `srs-v3/srs-fr-03-dao-tao.md` (1267 lines, Δ +133%) — file thay đổi LỚN NHẤT trong batch 2026-05-05.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude

---

## 1. Có gì mới / đổi / xoá

### Cấu trúc data đổi: Mô hình A 3 cấp

```
KE_HOACH_DAO_TAO (mới — kế hoạch năm)
  └─ 1:N CHUONG_TRINH_DAO_TAO (đã có, refactor)
        └─ 1:N KHOA_HOC (đã có, refactor)
```

### State Machine

| SM | Cũ | Mới | Note |
|---|---|---|---|
| SM-KHOAHOC | 9 trạng thái | **11 trạng thái** | Thêm `TU_CHOI` + `TU_CHOI_KQ` (Cách 2 + refinement) |
| SM-KH-DAO-TAO | (chưa có rõ) | refinement TU_CHOI → CHO_DUYET | Kế hoạch năm |
| **SM-CTDT** | **(chưa có)** | **MỚI HOÀN TOÀN** | CTDT có quy trình phê duyệt riêng — **giải quyết spec contradiction R6.4.B2/B2.5/B7** đang block |

### FR mới (5 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-III-20 | Xuất file docx/PDF ký số cho CTDT | UC mới |
| FR-III-21 | Phê duyệt khóa học | GAP-III-08 F-05 |
| FR-III-22 | Quản lý Lịch học buổi dạy | GAP-III-08 F-07 |
| FR-III-NEW-01 | Tạo đề kiểm tra | UC mới |
| FR-III-NEW-02 | Quản lý đề kiểm tra | F-FR03-15 expand |
| FR-III-NEW-03 | Phân phối đề + map bài giảng | F-FR03-15 expand |

### Entity mới / refactor

| Entity | Trạng thái | Note |
|---|---|---|
| `KE_HOACH_DAO_TAO` | **Mới owned** | GAP-III-03, F-FR03-01 sync master, F-12 Mô hình A |
| `HOC_VIEN` | **Mới owned** | GAP-III-03, 1:1 với TAI_KHOAN qua `tai_khoan_id` |
| `LICH_HOC` | **Mới owned** | GAP-III-08, per-buổi học |
| `GIANG_VIEN` | Refactor | F-FR03-23 |

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| Điểm danh | `boolean` (CO_MAT/VANG) | **enum 3-value** (`CO_MAT/VANG_PHEP/VANG_KHONG_PHEP`) |
| Trích NĐ55/2019 đào tạo PL | Đ.6 (sai) | **Đ.10 K.2** (sửa cite-sai lan rộng) |
| FR-III-19 Công bố KQ | Cấp chứng nhận PDF | **Hướng B — BỎ chứng nhận PDF**, chỉ công bố KQ vào TK học viên + chuyên trang |

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-v3.md` (master) | 80 | **A FULL** | ERD + entity matrix sync HOC_VIEN/KE_HOACH_DAO_TAO mới |
| `srs-fr-11-bao-cao.md` | 19 (KHOA_HOC 15 + HOC_VIEN 4) | **B DELTA** | Báo cáo nhóm III group-by KHOA_HOC + HOC_VIEN — phải verify field map |
| `srs-fr-01-dashboard.md` | 27 (KHOA_HOC 14 + CTDT 3 + HOC_VIEN 3 + KQDT 6) | **C IMPACT** | KPI count + badge state khóa học (SM 11 trạng thái mới) |
| `srs-fr-16-api.md` | 10 (KHOA_HOC) | **B DELTA** | API portal expose KHOA_HOC publishable — update SM 11 state |
| `srs-fr-08-danh-gia.md` | 2 | **C IMPACT** | KHOA_HOC nguồn dữ liệu báo cáo HQ HTPLDN (BC nhóm III) |

**Không impact:** FR-02, FR-04, FR-05, FR-06, FR-07, FR-09, FR-10, FR-13, FR-14, FR-15.

---

## 3. Findings critical

1. **SM-CTDT mới giải quyết spec contradiction R6.4.B2/B2.5/B7** đang block — 3 task R6 unblocked tự động khi dev deploy.
2. **HOC_VIEN entity riêng** với `tai_khoan_id` link TK → khi seed học viên, tạo TK đồng thời (giống pattern NHT/TVV).
3. **Điểm danh enum 3-value** — test case cũ (boolean) INVALID, cần redesign.
4. **FR-III-19 Hướng B** — BỎ cấp chứng nhận PDF → test case "in chứng nhận" cũ INVALID.
5. **Mô hình A 3 cấp** (KH năm → CTDT → KH) — workflow seed phải theo thứ tự: KH năm → CTDT (cần phê duyệt SM-CTDT mới) → KH (SM-KHOAHOC 11 state).

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | Thêm `KE_HOACH_DAO_TAO` + `HOC_VIEN` + `LICH_HOC` entity mới (FR-03) |
| `input/data/entity-map.md` | Thêm 3 entity row mới (E27 KE_HOACH, E28 HOC_VIEN, E29 LICH_HOC) |
| `input/data/seed-fixture.yaml` | Thêm `ke_hoach_dao_tao_variants` + `hoc_vien_variants` + `lich_hoc_variants` |
| `input/quy-trinh-nghiep-vu/flow-module.md` | Update §8 SM-KHOAHOC (9→11 state) + thêm §8a SM-CTDT mới + §8b SM-KH-DAO-TAO refinement |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Update bảng SM transition module ⑧ + thêm 2 SM mới |
| `output/funtion/7.3-*.md` | Refactor scope 22 FR (cũ 19 FR + 3 NEW + III-20/21/22) |
| `tasks/todo.md` R7 | Thêm task R7 cho FR-03 (đào tạo) — phụ thuộc FR-04 (cần TVV `HOAT_DONG` cho giảng viên) |

---

## 5. Quy tắc tra cứu khi test / log bug

- Test/log bug FR-03 (đào tạo) → cite `srs-update-2026-5-5/srs-fr-03-dao-tao.md:line N`.
- Test SM-KHOAHOC → cite SM 11 state mới (KHÔNG cite 9 state cũ).
- Test workflow CTDT → cite SM-CTDT mới (KHÔNG dùng spec cũ R6.4.B2 contradiction).
- Test điểm danh → cite enum 3-value, không dùng boolean cũ.

---

## 6. Open issues — defer kiểm tra khi test

- **FR-III-22 Lịch học buổi dạy** — chưa rõ data structure detail, cần đọc kỹ §FR-III-22 và Section 4 LICH_HOC trước khi viết test plan.
- **FR-III-NEW-01/02/03 Đề kiểm tra** — workflow tạo đề + phân phối + map bài giảng cần verify với dev có UI hay chỉ API.
- **Cross-impact FR-04 GIANG_VIEN refactor** — verify GIANG_VIEN đổi gì so với entity cũ (entity GIANG_VIEN nằm trong FR-03 hay tách FR-04?).
