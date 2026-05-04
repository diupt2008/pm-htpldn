# Kế Hoạch Kiểm Thử — Quản lý Doanh nghiệp được HTPL (FR-V.III, SCR-V.III-01..03)

> **Phiên bản**: 1.0
> **Ngày tạo**: 2026-04-30
> **Nguồn dữ liệu**: SRS v3.1 ([srs-v3.md](../../../input/srs-v3/srs-v3.md), [srs-fr-07-doanh-nghiep.md](../../../input/srs-v3/srs-fr-07-doanh-nghiep.md)) + NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`)
> **SRS Reference**: Nhóm V.III (FR-V.III-01/02/NEW-01), SCR-V.III-01/02/03, Entity DOANH_NGHIEP + HO_SO_PHAP_LY_DN (Tab #2 — gộp từ MH-12.3, FR-X.1-04)

> **Quy trình:** Theo [scaling-test-strategy.md §4.1 Bước 3](../../scaling-test-strategy.md) — grep BR từ [srs-v3.md Phụ lục B](../../../input/srs-v3/srs-v3.md) + sibling-check ≥2 module + BA sign-off (7 SRS Gap, xem §7) trước khi viết TC detail.
>
> **v1.0:** Test plan này dùng cho **GĐ 3 Functional + Auth + Edge** (sau khi GĐ 1 seed + GĐ 2 workflow đã pass). Happy path đã cover ở GĐ 2 — TC ở đây gồm full coverage CRUD + Search + Import Excel + Tab Hồ sơ PL DN + Tab read-only + Permission matrix.

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- 3 FR (UC81 quản lý DN + UC82 tìm kiếm + UC mới Import Excel) trên 3 màn hình
- Bảng dữ liệu chính: `DOANH_NGHIEP` (entity owned, Tier 1 hub) + `HO_SO_PHAP_LY_DN` (entity Tier 2 trên tab #2)
- Màn hình: SCR-V.III-01 (Danh sách), SCR-V.III-02 (Form 4 tab), SCR-V.III-03 (Wizard import)

### 1.2 Danh sách FR / UC

| # | Mã FR | Use Case | Tên chức năng | Entity | File Test Case |
|---|--------|----------|--------------|--------|----------------|
| 1 | FR-V.III-01 | UC81 | Quản lý DN được HTPL (CRUD + lịch sử + xuất Excel) | DOANH_NGHIEP | `01-TC-quan-ly-dn-CRUD.md` |
| 2 | FR-V.III-02 | UC82 | Tìm kiếm DN (multi-criteria + thời gian hỗ trợ) | DOANH_NGHIEP | `02-TC-tim-kiem-dn.md` |
| 3 | FR-V.III-NEW-01 | (Mới) | Import DN từ Excel (3-step wizard) | DOANH_NGHIEP | `03-TC-import-excel-dn.md` |
| 4 | FR-X.1-04 | UC150 | Tab #2 — Hồ sơ PL Doanh nghiệp (CRUD, gộp từ MH-12.3) | HO_SO_PHAP_LY_DN | `04-TC-tab-ho-so-pl-dn.md` |
| 5 | FR-V.III-01 | UC81 | Tab #3 Lịch sử Hỗ trợ + Tab #4 Hồ sơ Chi trả (read-only) | VU_VIEC, HO_SO_CHI_TRA | `05-TC-tab-lich-su-tab-chi-tra.md` |
| 6 | BR-AUTH-01/08/11 | — | Permission matrix 11 role × FR-07 | DOANH_NGHIEP | `06-TC-permission-matrix.md` |

### 1.3 Tài khoản & role liên quan

| Role | Cấp | Username (users.csv) | Dùng cho TC loại |
|------|-----|-----------------------|-------------------|
| QTHT | — | qtht_01 | Read-only verify (👁️ R toàn hệ thống). `_02` fallback |
| CB_NV_TW | TW | cb_nv_tw_01 | CRUD primary (✅ CRUD* scope TW = toàn quốc). `_02` fallback, `_03` permission test |
| CB_NV_BN | BN | cb_nv_bn_01 (Bộ KH&ĐT) | CRUD scoped BN |
| CB_NV_DP | DP | cb_nv_dp_01 (Sở TP HCM) | CRUD scoped ĐP. `_02` Sở TP HN |
| CB_PD_TW | TW | cb_pd_tw_01 | Read-only verify (👁️ R* scope TW), KHÔNG CRUD |
| CB_PD_BN | BN | cb_pd_bn_01 | Read-only scoped BN |
| CB_PD_DP | DP | cb_pd_dp_01 | Read-only scoped ĐP |
| NHT/TVV/CG/GV | — | nht_01, tvv_01, cg_01, gv_01 | Negative — verify 403 chặn module |
| DN | — | (không có CMS user) | **Out-of-scope CMS** — chỉ qua API Cổng PLQG (BR-AUTH-11), test riêng API smoke. KHÔNG test trên CMS |

> Reference: [input/users.csv](../../../input/users.csv), [input/test-accounts-isolation.csv](../../../input/test-accounts-isolation.csv) (usage guide permission test), [output/permission-matrix.md](../../permission-matrix.md)

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 2.1 Business Rules (BR)

> ⚠️ **Quy định điền bảng:** Cột "Ngoại lệ SRS-quoted" chỉ điền khi SRS có dòng ngoại lệ cụ thể. Để trống nếu BR áp dụng 100%.

| Mã | Quy tắc | Nguồn SRS (line) | Áp dụng module này? | Ngoại lệ SRS-quoted | TC áp dụng |
|----|---------|------------------|---------------------|---------------------|-----------|
| BR-AUTH-01 | Xác thực truy cập | srs-fr-07:82, srs-v3.md:3949 | ✅ Yes | — | Precondition login mọi UC |
| BR-AUTH-08 | Phân quyền theo đơn vị (don_vi_id) | srs-fr-07:159, srs-v3.md:3958 | ✅ Yes | — | TC permission scope, TC list/search filter |
| BR-AUTH-11 | DN không đăng nhập CMS — chỉ qua API Cổng PLQG | NotebookLM cite [10] (srs-v3.md Phụ lục B) | ✅ Yes (đặc biệt) | — | TC permission DN role: marked **Out-of-scope CMS** |
| BR-DATA-01 | Soft delete (is_deleted=1) | srs-fr-07:160 + 638 | ✅ Yes | — | TC DELETE = UPDATE is_deleted, record ẩn list |
| BR-DATA-02 | Multi-tenant scoping (don_vi_id NOT NULL) | srs-fr-07:117 + 644 | ✅ Yes | — | TC scope per role |
| BR-DATA-03 | 7 common fields | srs-fr-07:650 | ✅ Yes | — | Verify schema (smoke) |
| BR-DATA-04 | Auto-gen mã DN format `DN-{TINH}-{SEQ}` | srs-fr-07:90, 170, 656 | ✅ Yes (override Phụ lục B `PREFIX-YYYYMMDD-SEQ`) | "DN-{TINH}-{SEQ}" theo srs-fr-07 (SRS overload) | TC CREATE verify regex `^DN-[A-Z]+-\d+$` |
| BR-DATA-05 | Audit trail (immutable) cho CUD | srs-fr-07:131, 147, 162, 321, 662 | ✅ Yes | — | TC verify AUDIT_LOG INSERT mỗi CUD |
| BR-DATA-06 | Export Excel max 10,000 rows | srs-v3.md:3977 | ✅ Yes (default) | — | TC Export happy + 10k boundary + filter-aware |
| BR-DATA-07 | Pagination default 20, max 100 | srs-fr-07:119, 238, 670 | ✅ Yes | — | TC pagination boundary |
| BR-CALC-05 | Kiểm tra quy mô DNNVV (NĐ39/2018) | srs-fr-07:163, 622, 672 | ✅ Yes (override Phụ lục B FR-V.I-09) | "Trong nhóm V.III, rule này dùng để kiểm tra quy mô DN" (line 674) | TC auto-suggest, TC WRN-DN-01 |
| BR-EC-01 | Optimistic Locking | srs-v3.md:4066 | ✅ Yes | — | TC conflict UPDATE → ERR-SYS-02 |
| BR-EC-13 | Search sanitize max 200 ký tự | srs-v3.md:4078 | ✅ Yes | — | TC search SQL/XSS/long query |

> **Conflict đã ghi nhận:**
> - **BR-CALC-05**: SRS overload mã (Phụ lục B = "Ưu tiên phân công NĐ55 FR-V.I-09" / nhóm V.III = "Kiểm tra quy mô DNNVV NĐ39"). Dùng định nghĩa nhóm V.III cho module này.
> - **BR-DATA-04**: Phụ lục B chuẩn = `PREFIX-YYYYMMDD-SEQ`, nhưng srs-fr-07 quy định riêng `DN-{TINH}-{SEQ}`. Dùng định nghĩa srs-fr-07.

### 2.2 Error Codes

> ⚠️ Message phải quote **nguyên văn** từ SRS. Khi test negative, expected message match exact → KHÔNG được "close enough" accept.

**FR-V.III-01 (UC81 — DOANH_NGHIEP CRUD):**

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity | SRS Line |
|--------|-------------------|----------------------|----------|----------|
| ERR-DN-01 | Tên DN trống | "Tên doanh nghiệp là bắt buộc" | ERROR | srs-fr-07:189 |
| ERR-DN-02 | MST trùng | "Mã số thuế đã tồn tại" | ERROR | srs-fr-07:190 |
| WRN-DN-01 | Quy mô không phù hợp NĐ39 | "Quy mô {X} không khớp với số liệu lao động/doanh thu. Vẫn lưu?" | WARNING | srs-fr-07:191 |
| ERR-DN-03 | Xóa DN có VV đang xử lý | "Không thể xóa DN đang có vụ việc xử lý" | ERROR | srs-fr-07:192 |

**FR-V.III-02 (UC82 — Tìm kiếm):**

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity | SRS Line |
|--------|-------------------|----------------------|----------|----------|
| INF-DN-TK-01 | Không có kết quả | "Không tìm thấy doanh nghiệp phù hợp" | INFO | srs-fr-07:262 |

**FR-V.III-NEW-01 (Import Excel):**

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity | SRS Line |
|--------|-------------------|----------------------|----------|----------|
| ERR-IMP-DN-01 | File không phải .xlsx | "Chỉ chấp nhận file Excel (.xlsx)" | ERROR | srs-fr-07:344 |
| ERR-IMP-DN-02 | File vượt 5MB | "File tối đa 5MB" | ERROR | srs-fr-07:345 |
| ERR-IMP-DN-03 | Thiếu cột bắt buộc | "File thiếu cột: {tên cột}" | ERROR | srs-fr-07:346 |
| ERR-IMP-DN-04 | Dòng lỗi dữ liệu | "Dòng {N}, cột {X}: {lý do}" | ERROR | srs-fr-07:347 |
| INF-IMP-DN-01 | Trùng MST | "Dòng {N}: MST {X} đã tồn tại, bỏ qua" | INFO | srs-fr-07:348 |

**FR-X.1-04 (Tab #2 — HO_SO_PHAP_LY_DN, từ NotebookLM cite [4]):**

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity |
|--------|-------------------|----------------------|----------|
| ERR-HSPL-01 | Tên hồ sơ trống | "Tên hồ sơ pháp lý là bắt buộc" | ERROR |
| ERR-HSPL-02 | DN không tồn tại / đã xóa | "Doanh nghiệp không tồn tại hoặc đã bị xóa" | ERROR |
| ERR-HSPL-03 | File vượt 20MB | "File đính kèm tối đa 20MB" | ERROR |
| ERR-HSPL-04 | File chứa mã độc | "File '{ten_file}' chứa mã độc, không thể tải lên" | ERROR |
| ERR-HSPL-05 | Loại hồ sơ không hợp lệ | "Loại hồ sơ '{loai}' không hợp lệ" | ERROR |
| ERR-HSPL-06 | tu_ngay > den_ngay (search) | "Ngày bắt đầu phải trước ngày kết thúc" | ERROR |
| INF-HSPL-01 | Không có kết quả search | "Không tìm thấy hồ sơ pháp lý phù hợp" | INFO |

> ⚠️ **Lưu ý SRS conflict đã ghi nhận:** `ERR-DN-02` và `ERR-DN-03` đụng độ với module Đăng nhập (FR-VIII, srs-fr-10:931-932) — xem [srs-conflicts-need-ba.md GAP G/H](../../srs-conflicts-need-ba.md). Trong test plan này, dùng nguyên văn message theo srs-fr-07 (context module DN).

### 2.3 Permission Matrix (module-specific)

> Reference đầy đủ: [output/permission-matrix.md](../../permission-matrix.md)

| Entity / Action | QTHT | CB_NV (TW/BN/DP) | CB_PD (TW/BN/DP) | NHT/TVV/CG/GV | DN |
|-----------------|------|------------------|-------------------|---------------|-----|
| **DOANH_NGHIEP** (FR-07) | 👁️ R toàn HT | ✅ CRUD* (scope đơn vị) | 👁️ R* (scope đơn vị) | ❌ | 📝 RU* (API only — BR-AUTH-11) |
| **HO_SO_PHAP_LY_DN** (FR-X.1-04) | (chưa cite) | ✅ CRUD* | ❌ (không có trong actor list) | "Người hỗ trợ" có CRUD | ❌ (không có trong actor list) |

> ⚠️ Quan trọng:
> - **DN role 📝 RU\*** trên DOANH_NGHIEP: theo BR-AUTH-11 — DN KHÔNG đăng nhập CMS, chỉ tương tác qua API chuyên trang Cổng PLQG. Test cases DN role được mark **Out-of-scope CMS** — không test trên `http://103.172.236.130:3000/`.
> - **HO_SO_PHAP_LY_DN actor** khác DOANH_NGHIEP: tab #2 chỉ "Cán bộ Nghiệp vụ (TW/BN/ĐP), Người hỗ trợ" (NotebookLM cite [5]) — KHÔNG có DN, KHÔNG có CB PD. Khi test tab #2 với CB PD → expected `403` hoặc tab disabled.

### 2.4 UI Layout (SCR-V.III-01/02/03)

> ⚠️ **CẢNH BÁO:** Components dưới trích từ SRS SCR-V.III-01/02/03 (UX-Spec MH-07.1/07.2/07.3). KHÔNG dùng absence để khẳng định "module KHÔNG có X". Mọi feature không có trên UI phải đối chiếu §2.1 BR table + Phụ lục B.

**SCR-V.III-01 — Danh sách (24 components, srs-fr-07:362-395):**
- **Toolbar**: Breadcrumb "Trang chủ > Doanh nghiệp > Danh sách" + [+ Thêm mới] + [Import Excel] + [Xuất Excel] + [Làm mới]
- **Filter-bar**: Từ khóa (tên/MST), Quy mô (SIEU_NHO/NHO/VUA), Tỉnh thành, Lĩnh vực KD, Từ ngày, Đến ngày, [Tìm kiếm], [Xóa bộ lọc]
- **Table**: Checkbox, Mã DN, Tên DN, MST, Quy mô badge, Địa chỉ (cắt 30 ký tự), Số lần hỗ trợ, Tổng chi phí (VND), Hành động (Xem/Sửa/Xóa)
- **Pagination**: 20 mục/trang default

**SCR-V.III-02 — Thêm/Chi tiết DN (4 tab + 30 components, srs-fr-07:412-444):**
- **Tab #1 Thông tin cơ bản**: Mã DN (readonly auto), Tên DN, MST (unique), Giấy CNĐKKD, Ngày cấp ĐKKD, Địa chỉ, Tỉnh thành, Loại DN, Quy mô (auto-suggest), Ngành nghề, Số LĐ (auto-calc quy mô), Doanh thu năm (auto-calc), Tổng nguồn vốn, Người đại diện, Chức vụ ĐD, Email, SĐT, Fax, Phụ nữ làm chủ (checkbox NĐ55 Đ4), Số LĐ nữ, Số LĐ khuyết tật, Lĩnh vực KD, Ghi chú, File đính kèm (multi)
- **Tab #2 Hồ sơ PL doanh nghiệp** (MỚI v2.1, gộp MH-12.3): CRUD HSPL với 11 field (xem `04-TC-tab-ho-so-pl-dn.md`)
- **Tab #3 Lịch sử Hỗ trợ**: 3 KPI (Tổng VV, VV hoàn thành, Tổng chi phí) + danh sách VU_VIEC liên kết — read-only
- **Tab #4 Hồ sơ Chi trả**: Danh sách HO_SO_CHI_TRA liên kết — read-only (NotebookLM cite [7]: "Nguồn duy nhất DVC qua LGSP — CB NV KHÔNG nhập tay")
- **Action-bar**: [Hủy], [Lưu]

**SCR-V.III-03 — Wizard Import Excel (3 bước, srs-fr-07:464-477):**
- **Stepper**: Upload → Kiểm tra → Kết quả
- **Bước 1**: Vùng kéo thả file (.xlsx, max 5MB) + [Tải mẫu Excel] (download template)
- **Bước 2**: Thống kê tóm tắt (Tổng/Hợp lệ/Lỗi/Trùng MST) + bảng preview + tab filter (Tất cả/Hợp lệ/Lỗi/Trùng)
- **Bước 3**: Báo cáo import (Tổng/Thành công/Trùng/Lỗi) + chi tiết lỗi (Dòng/Cột/Lý do) + [Tải báo cáo]
- **Action-bar**: [Hủy/Quay lại] + [Upload/Xác nhận Import/Về danh sách]

**Cross-cutting features MẶC ĐỊNH có (theo BR global):**
- ☑ [Xuất Excel] toolbar (BR-DATA-06) — **có** (SRS line 376)
- ☑ Pagination 20/page default (BR-DATA-07)
- ☑ Search sanitize max 200 chars (BR-EC-13)
- ☑ URL sync filter (suy ra từ BR-UX-01 nếu áp dụng)
- ☑ Audit log mọi CUD (BR-DATA-05)
- ☑ Optimistic lock mọi UPDATE/DELETE (BR-EC-01)

### 2.5 State Machine

**Module DN KHÔNG có state machine** (SRS line 602: "Entity DOANH_NGHIEP không có vòng đời trạng thái"). Bản ghi DN được tạo/sửa/xóa mềm trực tiếp.

Tab #2 HO_SO_PHAP_LY_DN có 3 trạng thái nhưng KHÔNG có transition workflow (chỉ là enum tag): `HIEU_LUC` / `HET_HAN` / `THU_HOI` (default = `HIEU_LUC`).

### 2.6 Data dependencies & Seed input

| Phase | Input file | Section dùng |
|-------|-----------|--------------|
| **GĐ 1 Seed (pure entry state)** | [`input/data/seed-fixture.yaml`](../../../input/data/seed-fixture.yaml) | `doanh_nghiep_variants[1..12]` (lines 224-477) — 12 DN cover quy mô SIEU_NHO/NHO/VUA × 3 tỉnh × edge cases (la_nu_lam_chu, LĐ khuyết tật, vượt NĐ39) |
| **GĐ 1 click flow** | [`input/flow-module.md`](../../../input/flow-module.md) | §M1 Quản lý DN |
| **Cross-module map** | [`input/data/entity-map.md`](../../../input/data/entity-map.md) | E04 DOANH_NGHIEP (Tier 1) — Đọc tại 6 module + 3 tab; E07 HO_SO_PHAP_LY_DN (Tier 2) |

**Upstream dependencies (Tier check):**

| Entity | Tier | Phụ thuộc upstream | Seed trước tại |
|--------|:----:|---------------------|----------------|
| DOANH_NGHIEP | 1 | DON_VI (tỉnh thành), DANH_MUC (loại DN, ngành nghề) | M0 QTHT |
| HO_SO_PHAP_LY_DN | 2 | DOANH_NGHIEP, DANH_MUC (lĩnh vực) | M1 (DN seed xong) |

**Downstream consumer × filter (entity-map.md cite):**

| Downstream | Filter dùng | Test verify |
|------------|-------------|-------------|
| M3 VU_VIEC (`SCR-V.I-02`) dropdown DN | `DOANH_NGHIEP.is_deleted=0 AND don_vi_id ∈ scope` | Sau xóa mềm DN → DN biến mất khỏi dropdown |
| M4 Hỏi đáp dropdown DN | Same as above | TC cross-module |
| M5 TVCS (SCR-X1-02) | `doanh_nghiep_id` link | Tab #2 HSPL pre-existed |
| M7 Hợp đồng (SCR-X3-01) | `doanh_nghiep_id` link | — |
| M8 Chi trả (SCR-V.II-01) | `doanh_nghiep_id` link, hiển thị quy mô để validate mức HT | Tab #4 đọc HO_SO_CHI_TRA này |

> **Lưu ý:** KHÔNG hardcode `N records, states X/Y` — fixture chốt 12 variants. Workflow là lifecycle entity Tier 2 (HSPL), không phải DOANH_NGHIEP.

---

## 3. Cấu Trúc File Test Case

```
doanh-nghiep/
├── 00-test-plan-overview.md                ← File này
├── 01-TC-quan-ly-dn-CRUD.md                ← FR-V.III-01 UC81 (READ + CREATE + UPDATE + DELETE + EXPORT)
├── 02-TC-tim-kiem-dn.md                    ← FR-V.III-02 UC82 (search/filter multi-criteria)
├── 03-TC-import-excel-dn.md                ← FR-V.III-NEW-01 (3-step wizard)
├── 04-TC-tab-ho-so-pl-dn.md                ← FR-X.1-04 UC150 (Tab #2 HO_SO_PHAP_LY_DN CRUD)
├── 05-TC-tab-lich-su-tab-chi-tra.md        ← Tab #3 + Tab #4 (read-only verify, KPI, link cross-module)
└── 06-TC-permission-matrix.md              ← 11 role × FR-07 boundary (auth/scope/403)
```

---

## 4. Tổng Quan Số Lượng Test Cases

> **Cập nhật 2026-04-30 (verified bằng grep `^\| TC-`):** Sau Edge Case Hunter review (file `99-REVIEW-edge-case-hunter.md`), tổng **207 TC** (đếm theo TC ID unique trong cột đầu).

| File | Happy | Negative | Edge | Tổng |
|------|------:|---------:|-----:|-----:|
| 01 - CRUD DN | 15 | 19 | 28 | **62** |
| 02 - Tìm kiếm | 11 | 2 | 15 | **28** |
| 03 - Import Excel | 5 | 12 | 20 | **37** |
| 04 - Tab Hồ sơ PL | 11 | 8 | 12 | **31** |
| 05 - Tab Lịch sử + Chi trả | 10 | 0 | 11 | **21** |
| 06 - Permission matrix | 10 | 8 | 10 | **28** |
| **TỔNG** | **62** | **49** | **96** | **207** |

> **Lưu ý:** Số đếm trên là verified bằng script `grep -oE "^\| TC-[A-Z]+-[0-9]{3}" *.md \| sort -u \| wc -l` chạy trên 6 file. Nếu user merge thêm/bỏ TC sau review, tự re-count.

**Phân bổ priority (sau merge):**

| Priority | Số TC ước tính | % |
|----------|---------------:|--:|
| P0 (bắt buộc — happy path + auth + critical 🔴) | ~70 | ~34% |
| P1 (quan trọng — negative + high 🟡) | ~85 | ~41% |
| P2 (nên có — edge boundary + medium 🟢) | ~52 | ~25% |

---

## 5. Tiêu Chí Đạt / Không Đạt

> Reference: [output/test-strategy.md §10](../../test-strategy.md)

- ✅ **PASS:** 100% P0 + 90% P1 pass
- ❌ **FAIL:** bất kỳ P0 nào FAIL, hoặc P1 pass rate < 90%

---

## 6. Tham Chiếu

- [output/test-strategy.md](../../test-strategy.md) — chiến lược tổng thể
- [output/scaling-test-strategy.md](../../scaling-test-strategy.md) — quy trình 7 bước onboard
- [input/srs-v3/srs-v3.md Phụ lục B](../../../input/srs-v3/srs-v3.md) — BR cross-cutting (line 3939-4088)
- [input/srs-v3/srs-fr-07-doanh-nghiep.md](../../../input/srs-v3/srs-fr-07-doanh-nghiep.md) — SRS module (680 lines)
- [output/permission-matrix.md](../../permission-matrix.md) — ma trận phân quyền
- [output/srs-conflicts-need-ba.md](../../srs-conflicts-need-ba.md) — GAP G/H (ERR-DN-02/03 conflict)
- [input/data/entity-map.md](../../../input/data/entity-map.md) — E04 DOANH_NGHIEP, E07 HO_SO_PHAP_LY_DN
- [input/data/seed-fixture.yaml](../../../input/data/seed-fixture.yaml) — 12 variants DN
- [output/template/test-case-template.md](../../template/test-case-template.md) — TC template
- NotebookLM conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095` — clarify Q1-Q10 (verified 2026-04-30)

---

## 7. SRS Gap pending BA sign-off

> **Cập nhật 2026-04-30:** Sau Edge Case Hunter review, bổ sung **18 gap mới (G8-G25)** ngoài 7 gap cũ. Tổng cộng **25 gap** + **8 SRS Internal Conflicts** cần BA xử lý.

### 7.1 Gap cũ (G1-G7)

| # | Gap | Vị trí | Đề xuất |
|---|-----|--------|---------|
| G1 | Mã DN auto-gen `DN-{TINH}-{SEQ}` — SEQ reset (toàn HT/tỉnh/ngày) + padding leading zero | srs-fr-07:90 | Test verify regex `^DN-[A-Z]+-\d+$` (loose). Flag: BA confirm scope của SEQ |
| G2 | "Lấy mức cao hơn" khi 2 tiêu chí khác (auto-suggest quy mô) | srs-fr-07:449 | Default assume VUA > NHO > SIEU_NHO. Flag: BA confirm thứ tự enum |
| G3 | Click "Vẫn lưu" trong WRN-DN-01 → lưu quy mô user nhập hay auto-tính | srs-fr-07:191 | Test verify chỉ DN lưu thành công, KHÔNG assert `quy_mo` cụ thể. Flag: BA |
| G4 | Click "Hủy" trong WRN-DN-01 → focus field nào | (không có) | Test chỉ verify dialog đóng, KHÔNG assert focus field |
| G5 | Filter "Thời gian hỗ trợ từ/đến" — trường nào của VU_VIEC + inclusive/exclusive boundary | srs-fr-07:228-229 | Default assume `vu_viec.ngay_tiep_nhan` + `BETWEEN tu_ngay AND den_ngay` (inclusive 2 đầu). Flag: BA |
| G6 | "VV đang xử lý" (block xóa DN) — enum state cụ thể | srs-fr-07:145, 192 | Default assume block khi VU_VIEC.trang_thai ∈ (DA_TIEP_NHAN, DANG_KIEM_TRA, DA_PHAN_CONG, DANG_XU_LY, CHO_PHE_DUYET, DA_DUYET); allow khi (HOAN_THANH, TU_CHOI, HUY). Flag: BA |
| G7 | DN role 📝 RU* — field nào readonly cho DN | (BR-AUTH-11) | TC marked **Out-of-scope CMS** — DN không đăng nhập CMS, chỉ qua API. Test API riêng |

### 7.2 Gap mới từ Edge Case Hunter review (G8-G25)

| # | Gap | TC affected |
|---|-----|-------------|
| G8 | Cascade behavior khi xóa DN có HSPL/HSCT (chỉ check VV theo SRS) | TC-DN-070, 071, TC-HSPL-050 |
| G9 | Max length của ten_doanh_nghiep | TC-DN-085 |
| G10 | file_dinh_kem ở DN — max count, max size, format whitelist, virus scan | TC-DN-045, 046, 047 |
| G11 | Validation `ngay_cap_dkkd` — accept future date không | TC-DN-039 |
| G12 | AUDIT_LOG schema fields cụ thể (action/entity/ip/old/new) | TC-DN-082, 083 |
| G13 | Search engine (full-text vs LIKE) + multi-keyword logic | TC-TKDN-022, 028, 029 |
| G14 | Filter URL deep-link sync params | TC-TKDN-025 |
| G15 | Source dropdown "Lĩnh vực KD" — DANH_MUC nào | TC-TKDN-026 |
| G16 | Excel multi-sheet, hidden rows, header case-sensitivity, header order | TC-IMP-046, 047, 048, 049, 050 |
| G17 | Excel cell formula injection prevention | TC-IMP-044 |
| G18 | Auto-transition trang_thai HSPL HIEU_LUC→HET_HAN khi quá ngày | TC-HSPL-042 |
| G19 | HSPL multi-file đính kèm (SRS quote singular) | TC-HSPL-048 |
| G20 | SVG XSS sanitize cho HSPL file image | TC-HSPL-045 |
| G21 | KPI Tab #3 — null handling, scope toàn list vs trang | TC-LSHT-010, 012 |
| G22 | Tab switch khi form chưa lưu — confirm dialog | TC-TAB-020 |
| G23 | Permission Tab #2 cho CB_PD và "Người hỗ trợ" mapping role | TC-PERM-045, 046 |
| G24 | 403 vs 404 cho cross-org access (security enumeration prevention) | TC-PERM-044 |
| G25 | Account locking mid-session — JWT revoke timing | TC-PERM-050 |

### 7.3 SRS Internal Conflicts (C1-C8) phát hiện trong review

| # | Conflict | Vị trí 1 | Vị trí 2 | Đề xuất |
|---|----------|----------|----------|---------|
| C1 | `tinh_thanh_id` FK target | srs-fr-07:95 — "FK → DON_VI" | srs-fr-07:559 ERD — "FK → DANH_MUC(id)" | BA chốt: tỉnh là DON_VI hay DANH_MUC entry? |
| C2 | `nganh_nghe` bắt buộc | srs-fr-07:98 Inputs — "Y" | srs-fr-07:563 Entity — "N" | BA chốt Y/N |
| C3 | `nguoi_dai_dien` bắt buộc | srs-fr-07:102 Inputs — "Y" | srs-fr-07:564 Entity — "N" | BA chốt Y/N |
| C4 | Tên field `doanh_thu` vs `doanh_thu_nam` | srs-fr-07:100 — `doanh_thu_nam` | srs-fr-07:566 Entity — `doanh_thu` | BA chốt 1 tên |
| C5 | `tong_nguon_von` thiếu ở Entity | srs-fr-07:101 Inputs có | srs-fr-07:550-573 Entity KHÔNG có | BA bổ sung Entity hoặc xóa Input field |
| C6 | `ten_viet_tat` thiếu ở Inputs/UI | srs-fr-07:553 Entity có | srs-fr-07:88-108 Inputs KHÔNG có | BA bổ sung field hoặc xóa Entity attribute |
| C7 | `ngay_cap_dkkd` Inputs vs UI | srs-fr-07 Inputs KHÔNG có (chỉ giay_cndk) | srs-fr-07:423 SCR row#9 + Entity row 556 có | BA bổ sung Inputs hoặc xóa SCR row |
| C8 | Enum cho `quy_mo`/`nganh_nghe` không có ở Entity | srs-fr-07:97-98 enum cụ thể | srs-fr-07 Entity không quote enum | BA xác nhận enum chính thức |

> Mọi TC liên quan các gap/conflict này có cột `Type` là **Edge** + cite ID + flag "SRS Gap/Conflict pending BA: G{N}/C{N}" ở cột "Kết quả mong đợi".
> Reference đầy đủ: [99-REVIEW-edge-case-hunter.md](99-REVIEW-edge-case-hunter.md).

---

*Generated 2026-04-30 — based on SRS v3.1 + NotebookLM verification (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`)*
