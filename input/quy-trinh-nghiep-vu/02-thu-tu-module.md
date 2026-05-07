---
title: 16 module FR-01..FR-16 — phụ thuộc dữ liệu + transition chi tiết
source: NotebookLM gstack-HTPLDN
created: 2026-04-24
updated: 2026-04-24
---

# 16 Module PM HTPLDN — Xem chi tiết & Chuyển trạng thái

> Mỗi module mô tả theo 4 khối:
> 1. **Màn hình xem chi tiết (SCR-xx-xx)** — vào đâu để xem/sửa
> 2. **Xem chi tiết cần dữ liệu từ module nào** — FK / master data
> 3. **Nhập tay (thủ công)** — CB NV có tạo trực tiếp trong CMS được không + UC ref
> 4. **Transition A → B** — ai thao tác, nhập gì, lấy data ở màn nào

⚠️ **Quan trọng cho QA:** Đọc kỹ mục "Nhập tay" — 1 module duy nhất (**FR-06 Chi trả**) KHÔNG cho nhập tay. Mọi module khác đều có channel thủ công/import song song với channel API.

Convention tài khoản (`input/users.csv`): `_01` primary, `_02` fallback, `_03` permission test.
Password mặc định: `Secret@123`.

---

## Mục lục

- [LỚP 1 — DỮ LIỆU NỀN](#toc-lop1)
  - [① FR-10 · Quản trị Hệ thống (Nhóm VIII)](#toc-fr10)
- [LỚP 2 — DỮ LIỆU GỐC (MASTER DATA)](#toc-lop2)
  - [② FR-07 · Quản lý Doanh nghiệp (Nhóm V.III)](#toc-fr07)
  - [③ FR-04 · Chuyên gia & Tư vấn viên (Nhóm IV)](#toc-fr04)
  - [④ FR-09 · Thư viện Biểu mẫu (Nhóm VII)](#toc-fr09)
  - [⑤ FR-15 · Chương trình HTPLDN — Giai đoạn 1: Kế hoạch](#toc-fr15-gd1)
- [LỚP 3 — GIAO DỊCH LÕI](#toc-lop3)
  - [⑥ FR-05 · Vụ việc TGPL (Nhóm V.I) ⭐ CORE](#toc-fr05)
  - [⑦ FR-02 · Hỏi đáp Pháp lý (Nhóm II)](#toc-fr02)
  - [⑧ FR-12 · Tư vấn Chuyên sâu (Nhóm X.1)](#toc-fr12)
  - [⑨ FR-03 · Đào tạo & Tập huấn (Nhóm III)](#toc-fr03)
- [LỚP 4 — GIAO DỊCH PHÁI SINH](#toc-lop4)
  - [⑩ FR-14 · Hợp đồng Tư vấn (Nhóm X.3)](#toc-fr14)
  - [⑪ FR-06 · Chi trả Chi phí (Nhóm V.II)](#toc-fr06)
  - [⑫ FR-13 · Tư vấn Nhanh (Nhóm X.2)](#toc-fr13)
  - [⑬ FR-08 · Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý (Nhóm VI)](#toc-fr08)
- [LỚP 5 — TỔNG HỢP & ĐẦU RA](#toc-lop5)
  - [⑭-bis FR-15 · Chương trình HTPLDN — Giai đoạn 2: Đợt Báo cáo](#toc-fr15-gd2)
  - [⑭ FR-11 · Báo cáo Thống kê (Nhóm IX)](#toc-fr11)
  - [⑮ FR-01 · Dashboard (Nhóm I)](#toc-fr01)
  - [⑯ FR-16 · API Kết nối (Nhóm XII)](#toc-fr16)
- [Bảng tóm tắt thứ tự seed / test](#toc-bang-tomtat)
- [Bảng tra nhanh — Khả năng NHẬP TAY / IMPORT theo module](#toc-bang-tranhanh)
  - [Ý nghĩa cho QA seed](#toc-y-nghia)
- [5 Luật suy dẫn cho QA seed](#toc-5-luat)
- [Quy ước đọc bảng transition](#toc-quy-uoc)
  - [Cột "Trigger"](#toc-cot-trigger)
  - [Cột "Dữ liệu nhập"](#toc-cot-dulieu)
  - [Cột "Nguồn dropdown / Filter"](#toc-cot-nguon)
  - [Cột "Màn nguồn"](#toc-cot-mannguon)


---

<a id="toc-lop1"></a>
## LỚP 1 — DỮ LIỆU NỀN (chạy TRƯỚC TIÊN)

<a id="toc-fr10"></a>
### ① FR-10 · Quản trị Hệ thống (Nhóm VIII) 🔑
**Login:** `qtht_01` (QTHT) — duy nhất được CRUD ở đây.

**Màn hình (SCR-VIII-01..10) theo SRS FR-10 v3.5 BA chốt 2026-05-07:**
- SCR-VIII-01: **Quản lý Danh mục** (14 tab dọc bên trái — bỏ Tổ chức TV, **+ Tab Tỉnh/Thành phố Q9**)
- SCR-VIII-02: **Quản lý Vai trò**
- SCR-VIII-03: **Quản lý Tài khoản NSD** (**4 trạng thái** Q3: CHO_KICH_HOAT/HOAT_DONG/KHOA/KHOI_TAO — bỏ CHO_PHAN_QUYEN. Nút "Phân quyền" CHO_PHAN_QUYEN row → DEPRECATED)
- SCR-VIII-04: **Phân quyền Chức năng**
- SCR-VIII-05: **Phân quyền Dữ liệu** (cây 2 tầng)
- SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — **2 tab** Q11: SLA + Mẫu phản hồi. **Bỏ Tab Phân công mặc định + Tab Quy trình hỗ trợ** — Tab Ngày lễ tách MH riêng FR-VIII-29)
- SCR-VIII-07: Đăng nhập (MH-10.8b — Tier 1 nội bộ + Tier 2 SSO VNeID, bỏ VNPT eKYC)
- SCR-VIII-08: Đăng ký TK doanh nghiệp (chỉ DN tự đăng ký, form 21 trường, username = MST)
- ~~SCR-VIII-08a~~: ⚠️ **XÓA Q10** — BA chốt 2026-05-07 xóa hẳn MH này (FR-VIII-22 bypass CHO_PHAN_QUYEN, không còn UC duyệt thủ công)
- SCR-VIII-09: Đăng xuất
- SCR-VIII-10: Nhật ký Hệ thống (MH-10.10 — FR-VIII-28 mới, **export cap 10K Q4**)

**FR mới SRS v3.5 (apply 2026-05-06, BA chốt batch 2026-05-07):**
- **FR-VIII-26**: Quên mật khẩu / Kích hoạt TK lần đầu — workflow chung cho TVV/CG/NHT/DN/CB
- **FR-VIII-28**: Nhật ký Hệ thống `[GAP-VIII-02]` — filter, paginate 50/trang, cap 90 ngày, **export 10K Q4**
- **FR-VIII-29**: Quản lý ngày lễ `[GAP-VIII-05]` — entity NGAY_LE schema chốt Q1 (5 trường: `ngay`/`nam`/`ten_ngay_le`/`loai ∈ {NGAY_LE, NGHI_BU, NGHI_KHAC}`/`ghi_chu`) + import Excel + calendar. **Mỗi ngày 1 dòng** (Tết 7 ngày → 7 dòng). **MH riêng** không gộp SCR-VIII-06
- **FR-VIII-30** `[NEW Q9]`: Quản lý Tỉnh/Thành phố — 63 tỉnh GSO QĐ 124/2004, entity `TINH_THANH` E32, hiển thị Tab 14 SCR-VIII-01
- **FR-VIII-06 (Tổ chức TV)**: chuyển sang FR-04 thành FR-IV-NEW-01
- ~~**FR-II-NEW-01** (Phân công mặc định)~~: **BỎ Q11** — thay bằng auto-filter 4 tiêu chí FR-II-06 Step 5 (lĩnh vực + đơn vị BR-AUTH-08 + workload ASC + ho_ten ASC LIMIT 10)

> **Lưu ý DM Cơ quan/Đơn vị (UC103 — tree view 2 tầng TW→{BN,ĐP} ngang cấp song song theo BR-AUTH-02) KHÔNG có màn riêng** — là thành phần đặc biệt bên trong tab "Cơ quan ĐV" của SCR-VIII-01 (srs-fr-10 v3.5 §3 dòng 1475-1482). **CẢNH BÁO:** đổi từ "3 cấp TW→BN→ĐP" v3 thành "2 tầng TW→{BN, ĐP}" v3.5 — BN không có cấp con, ĐP trỏ trực tiếp lên TW (không qua BN).

**📑 Tabs SCR-VIII-01 Quản lý Danh mục — 14 tab dọc bên trái (theo SRS FR-10 §3 dòng 1221, **+ Tab 14 Tỉnh/Thành phố Q9**):**

| Tab | Entity filter | Data đặc biệt | Điều kiện hiển thị |
|-----|---------------|---------------|--------------------|
| Lĩnh vực PL | `DANH_MUC WHERE loai='LINH_VUC_PL'` | Tiêu chuẩn ma/ten/mo_ta/thu_tu/trang_thai | Luôn |
| Loại hình HT | `DANH_MUC WHERE loai='LOAI_HINH_HT'` (UC100) | — | Luôn |
| Chương trình HT | `DANH_MUC WHERE loai='CHUONG_TRINH_HT'` | — | Luôn |
| Tình trạng VV | `DANH_MUC WHERE loai='TINH_TRANG_VV'` | — | Luôn |
| **Cơ quan ĐV** | `DON_VI` (tree-view) | **Tree 2 tầng TW→{BN,ĐP} ngang cấp song song** (BR-AUTH-02 v3.5) + form chi tiết bên phải + nút [+ Thêm đơn vị con] trên TW (BN không có cấp con). Thêm cột `tinh_thanh_id` FK DM TINH_THANH (mã GSO 01-63 theo QĐ 124/2004) | Luôn |
| ~~Tổ chức tư vấn~~ | ⚠️ **Đã tách entity riêng** `TO_CHUC_TU_VAN` (SRS update 2026-05-05) — xem §FR-04 mục ③. Quản lý ở SCR-IV-NEW-01/02/03 thuộc Nhóm IV, KHÔNG còn ở danh mục `DANH_MUC`. Cite: `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:2178` | NĐ77/2008 + NĐ55/2019 Đ.10 | — |
| Loại DN | `DANH_MUC WHERE loai='LOAI_DN'` | SIEU_NHO/NHO/VUA | Luôn |
| Hồ sơ đề nghị HT | `DANH_MUC WHERE loai='HO_SO_DE_NGHI_HT'` (UC106) | Checklist 6 hạng mục cho FR-V.I-06 | Luôn |
| Hồ sơ đề nghị TT | `DANH_MUC WHERE loai='HO_SO_DE_NGHI_TT'` | Checklist cho FR-V.II | Luôn |
| **Tiêu chí ĐG hiệu quả** | `DANH_MUC WHERE loai='TIEU_CHI_DG_HQ'` (UC109) | Cột bổ sung: Trọng số (%), Thang điểm min/max. **Tổng trọng số phải = 100%** (cảnh báo đỏ nếu ≠) | Luôn |
| **Tiêu chí ĐG chi phí** | `DANH_MUC WHERE loai='TIEU_CHI_DG_CP'` (UC110) | Cột bổ sung: Quy mô DN, Mức hỗ trợ (%), Trần HT/năm (VNĐ) | Luôn |
| Loại TK | `DANH_MUC WHERE loai='LOAI_TK'` | — | Luôn |
| Loại hình tiếp nhận | `DANH_MUC WHERE loai='LOAI_HINH_TIEP_NHAN'` | — | Luôn |
| Kênh tiếp nhận | `DANH_MUC WHERE loai='KENH_TIEP_NHAN'` | — | Luôn |
| **Tỉnh/Thành phố** `[NEW Q9 2026-05-07]` | `TINH_THANH` (entity riêng E32) | 63 tỉnh GSO theo QĐ 124/2004; cột: `ma` (01-63), `ten`, `vung_mien`, `trang_thai`. Read-only seed lúc deploy, QTHT chỉnh `trang_thai` | Luôn (FR-VIII-30) |

**📑 Tabs SCR-VIII-06 Cấu hình hệ thống — 2 tab (BA Q11 chốt 2026-05-07: chỉ giữ SLA + Mẫu phản hồi):**

| Tab | Entity | Data | Điều kiện hiển thị |
|-----|--------|------|--------------------|
| **Thời hạn xử lý (SLA)** | `CAU_HINH_SLA` | Bảng cấu hình thời hạn xử lý cho 4 loại yêu cầu: **FR-02 Hỏi đáp / FR-05 Vụ việc / FR-06 Chi trả / FR-12 Tư vấn chuyên sâu**. Mỗi loại cấu hình các trường: **Số ngày làm việc để xử lý** (`deadline_ngay_lv`), **Ngưỡng cảnh báo mức 1** (`canh_bao_muc_1`, % so với SLA, vd 70%), **Ngưỡng cảnh báo mức 2** (`canh_bao_muc_2`, vd 90%), công tắc bật/tắt gửi thông báo qua **Email** / **In-app**. **BA Q5 BỎ cột "Quá hạn nghiêm trọng"** — chỉ còn 2 ngưỡng cảnh báo | Luôn |
| **Mẫu phản hồi** | `MAU_PHAN_HOI` | Kho mẫu câu trả lời dùng lại (cho module **FR-02 Hỏi đáp**), phân loại theo lĩnh vực pháp luật. Mỗi mẫu gồm: **Tên mẫu** (`ten_mau`), **Lĩnh vực** (`linh_vuc_id`), **Nội dung mẫu** (`noi_dung`, soạn bằng Rich Text editor — có format đậm/nghiêng/bullet), **Trạng thái** (`trang_thai`). Áp Mô hình B Hybrid 2 tầng (CĐT chốt 2026-05-02) | Luôn |
| ~~**Phân công mặc định**~~ | ⚠️ **DEPRECATED Q11 2026-05-07** — Entity `CAU_HINH_PHAN_CONG` + FR-II-NEW-01 BỎ hẳn. Thay bằng auto-filter 4 tiêu chí FR-II-06 Step 5 (lĩnh vực + đơn vị BR-AUTH-08 + workload ASC + ho_ten ASC LIMIT 10). **Cross-module impact:** FR-02 Hỏi đáp / FR-05 Vụ việc / FR-12 TVCS dùng modal SCR-II-03 với bảng gợi ý theo auto-filter | — |
| ~~**Quy trình hỗ trợ**~~ | ⚠️ **DEPRECATED Q11 2026-05-07** — BA chốt SCR-VIII-06 chỉ 2 tab. Tab này không còn trong scope | — |
| ~~**Ngày lễ**~~ | ⚠️ **TÁCH MH RIÊNG** — BA Q1 chốt FR-VIII-29 có MH riêng, KHÔNG gộp SCR-VIII-06. Schema 5 trường (`ngay`/`nam`/`ten_ngay_le`/`loai`/`ghi_chu`), mỗi ngày 1 dòng | — |

**Xem chi tiết cần dữ liệu từ:** KHÔNG cần module khác (module gốc).

**🖐️ Nhập tay:** ✅ **Có** — Toàn bộ CRUD ở đây do `qtht_01` nhập tay trực tiếp. Không có API inbound. Đây là nơi seed data gốc cho hệ thống.

**CRUD chính (toàn bộ 🖐️ thủ công — không có state machine phức tạp):**

| Thao tác | Actor | Trigger | Màn hình | Dữ liệu nhập | Nguồn dropdown / Filter |
|----------|-------|---------|----------|--------------|-------------------------|
| **🖐️ Tạo Đơn vị** | `qtht_01` | [+ Thêm đơn vị con] trên node TW | **SCR-VIII-01** tab "Cơ quan ĐV" (UC103) | `ma_don_vi`, `ten_don_vi`, `cap ∈ {TW, BN, DP}`, `don_vi_cha_id`, `tinh_thanh_id` (mới v3.5), địa chỉ, ĐT, email | `don_vi_cha_id` ← **cây DON_VI 2 tầng**: NULL khi cap=TW; **PHẢI = TW** khi cap=BN hoặc cap=DP (BR-AUTH-02). Tạo ĐP với cha = BN → ERR-DV-02 |
| **🖐️ Tạo Tài khoản** | `qtht_01` | [+ Thêm TK] | **SCR-VIII-03** Quản lý Tài khoản NSD | `username` (theo BR-AUTH-USERNAME-01: DN auto = MST 10 chữ số; CB nội bộ QTHT đặt; TVV/CG auto local-part email; NHT do CB NV nhập), `email` (unique trên TAI_KHOAN.email — BR-AUTH-EMAIL-01), `ho_ten`, mật khẩu (≥8 ký tự + hoa + thường + số + **ký tự đặc biệt** `[GAP-VIII-04]`), `vai_tro_id`, `don_vi_id`. State entry: CHO_KICH_HOAT (gửi mail kích hoạt qua FR-VIII-26) | `vai_tro_id` ← `VAI_TRO` (quản lý ở SCR-VIII-02); `don_vi_id` ← **DON_VI filter theo cấp của vai trò** |
| ~~**🖐️ Phân quyền cho TK CHO_PHAN_QUYEN**~~ | ⚠️ **DEPRECATED Q3 2026-05-07** — BA chốt 4 trạng thái (CHO_KICH_HOAT/HOAT_DONG/KHOA/KHOI_TAO), bỏ CHO_PHAN_QUYEN khỏi SM-TAIKHOAN. FR-VIII-22 bypass thẳng CHO_KICH_HOAT, không còn UC duyệt thủ công | — | — | — |
| **🖐️ Tạo Vai trò** | `qtht_01` | [+ Thêm vai trò] | **SCR-VIII-02** Quản lý Vai trò | `ten_vai_tro`, `mo_ta`, danh sách quyền hạn | `quyen_ids[]` ← danh sách quyền (set ở SCR-VIII-04) |
| **🖐️ Phân quyền chức năng** | `qtht_01` | Gán quyền | **SCR-VIII-04** Phân quyền Chức năng | Mapping vai_tro × quyen | — |
| **🖐️ Phân quyền dữ liệu** | `qtht_01` | Gán scope | **SCR-VIII-05** Phân quyền Dữ liệu | Scope `{don_vi_id, phạm vi đọc/ghi}` cho mỗi vai trò | `don_vi_id` ← DON_VI |
| **🖐️ Tạo Danh mục** | `qtht_01` | [+ Thêm mới] trên 1 trong 14 tab | SCR-VIII-01 | `loai` auto theo tab đang chọn, `ma`, `ten`, `mo_ta`, `thu_tu`, `trang_thai` | Tab đang chọn quyết định `loai` DM |
| Kích hoạt / Vô hiệu hóa Đơn vị | `qtht_01` | Toggle trạng thái | SCR-VIII-01 tab Cơ quan ĐV | — | Cảnh báo "Thay đổi cấp/đơn vị cha sẽ cập nhật chính sách phân quyền" khi đổi cấp/cha (srs-fr-10 §3 row 20) |
| Vô hiệu hóa Tài khoản | `qtht_01` | Toggle | SCR-VIII-03 | — | Guard: TK không đang phân công VV/Hỏi Đáp |
| **🖐️ Cấu hình SLA** | `qtht_01` | Form | SCR-VIII-06 Tab 1 (SLA) | Thời hạn xử lý (ngày làm việc) cho từng module: **Hỏi đáp** (`deadline_hoi_dap`), **Vụ việc** (`deadline_vu_viec`, mặc định `10`), **Chi trả** (`deadline_chi_tra`), **Hạn bổ sung hồ sơ** (`bo_sung_timeout` — xem BR-EC-16). **BA Q5 BỎ ngưỡng "Quá hạn nghiêm trọng"** — chỉ giữ 2 ngưỡng cảnh báo | Nhập số ngày LV |
| ~~**🖐️ Cấu hình Phân công**~~ | ⚠️ **DEPRECATED Q11 2026-05-07** — BA chốt BỎ entity `CAU_HINH_PHAN_CONG` + FR-II-NEW-01. Thay bằng auto-filter 4 tiêu chí FR-II-06 Step 5 | — | — | — | — |
| **🖐️ Cấu hình Ngày lễ** `[NEW Q1 2026-05-07]` | `qtht_01` | [+ Thêm ngày lễ] hoặc Import Excel | **MH riêng FR-VIII-29** (KHÔNG gộp SCR-VIII-06 Q1) | Schema chốt: `ngay` (date Y, UNIQUE per `nam`), `nam` (number Y, ≥2024), `ten_ngay_le` (text Y), `loai ∈ {NGAY_LE, NGHI_BU, NGHI_KHAC}` (text Y), `ghi_chu` (text N). **Mỗi ngày 1 dòng** (Tết 7 ngày → 7 dòng). Hỗ trợ tính SLA trừ ngày lễ theo BR-CALC-03 | — |
| **🖐️ Quản lý Tỉnh/Thành phố** `[NEW Q9 2026-05-07]` | `qtht_01` | Toggle trạng thái (read-only seed) | **SCR-VIII-01 Tab 14 (Tỉnh/TP — FR-VIII-30)** | Entity `TINH_THANH` E32 — 63 tỉnh GSO QĐ 124/2004. Cột: `ma` (01-63), `ten`, `vung_mien`, `trang_thai`. QTHT chỉ chỉnh `trang_thai`, không Add/Delete (read-only seed lúc deploy) | — |
| **🖐️ Tạo Mẫu phản hồi** | `qtht_01` | Form | SCR-VIII-06 Tab 2 (Mẫu phản hồi — đổi từ Tab 3 sau Q11) | **Tên mẫu** (`ten_mau`), **Lĩnh vực** (`linh_vuc_id`), **Nội dung mẫu** (`noi_dung_mau`, Rich text) | `linh_vuc_id` ← danh mục `LINH_VUC_PL` (FR-10) |

---

<a id="toc-lop2"></a>
## LỚP 2 — DỮ LIỆU GỐC (MASTER DATA)

<a id="toc-fr07"></a>
### ② FR-07 · Quản lý Doanh nghiệp (Nhóm V.III)
**Login:** `cb_nv_<cap>_01` tạo; CB NV + CB PD các cấp xem.

**Màn hình xem chi tiết:**
- SCR-V.III-01: Danh sách DN
- SCR-V.III-02: Chi tiết DN (form + 4 tabs)
- SCR-V.III-03: Import Excel (Wizard 3 bước)

**📑 Tabs SCR-V.III-02 Chi tiết DN — 4 tab:**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Thông tin cơ bản** | `DOANH_NGHIEP WHERE id=<current>` | Form thông tin chung của DN — gồm 28 trường: Mã DN, Tên DN, Mã số thuế, Giấy ĐKKD, Ngày cấp, Địa chỉ, Tỉnh/TP, Loại DN, **Quy mô DN** (hệ thống tự gợi ý `SIEU_NHO` / `NHO` / `VUA` khi nhập số lao động + doanh thu), Ngành nghề, Số lao động, Doanh thu, Nguồn vốn, Người đại diện, Email, SĐT, Fax, **DN do nữ làm chủ** (`la_nu_lam_chu`, theo NĐ55 Điều 4), Số LĐ nữ, Số LĐ khuyết tật,... | Luôn |
| **Hồ sơ PL doanh nghiệp** (v2.1 gộp từ MH-12.3, SCR-X1-03 DEPRECATED) | `HO_SO_PHAP_LY_DN WHERE doanh_nghiep_id=<current>` (entity **thuộc FR-12 Tư vấn chuyên sâu (Nhóm X.1)**, hiển thị lồng trong FR-07 Doanh nghiệp) | CRUD hồ sơ pháp lý của DN. Mỗi hồ sơ gồm các trường: **Mã hồ sơ** (`ma_ho_so`, hệ thống tự sinh dạng `HSPL-YYYYMMDD-SEQ`), **Tên hồ sơ** (`ten_ho_so`, tối đa 500 ký tự), **Loại hồ sơ** (`loai_ho_so` — 1 trong 5: `GIAY_PHEP` / `HOP_DONG` / `GIAY_CN` / `QUYET_DINH` / `KHAC`), **Lĩnh vực PL** (`linh_vuc_id`, lấy từ FR-10 Quản trị), **Ngày cấp** (`ngay_cap`), **Ngày hết hạn** (`ngay_het_han`), **Cơ quan cấp** (`co_quan_cap`), **Mô tả** (`mo_ta`), **Trạng thái** (`trang_thai` ∈ `HIEU_LUC` / `HET_HAN` / `THU_HOI`, mặc định `HIEU_LUC`), **File đính kèm** (PDF/image, tối đa 20MB, hệ thống tự quét virus). **Có 2 nguồn tạo hồ sơ:**<br>• 🖐️ **UC150 (FR-X.1-04) — Nhập tay trong CMS** bởi `cb_nv_<cap>_01` hoặc `nht_01` ngay tại tab này<br>• 🌐 **UC151 (FR-X.1-05) — API nhận từ Cổng PLQG** (DN tự submit qua chuyên trang, hệ thống tự upsert DN theo `ma_so_thue`, hồ sơ gắn `nguon=CONG_PLQG` và gửi thông báo cho CB NV phụ trách) | Chỉ hiển thị ở chế độ "Xem chi tiết" DN (không hiện khi đang tạo mới DN) |
| **Lịch sử Hỗ trợ** | `VU_VIEC WHERE doanh_nghiep_id=<current>` | Bảng các vụ việc DN đã tham gia (dữ liệu lấy từ **FR-05 Vụ việc**) + 3 chỉ số KPI: Tổng số VV / Số VV hoàn thành / Tổng chi phí | Chỉ hiển thị ở chế độ "Xem chi tiết" |
| **Hồ sơ Chi trả** | `HO_SO_CHI_TRA WHERE doanh_nghiep_id=<current>` | Danh sách các hồ sơ DN đã đề nghị thanh toán kèm trạng thái từng hồ sơ (dữ liệu lấy từ **FR-06 Chi trả**) | Chỉ hiển thị ở chế độ "Xem chi tiết" |

**Xem chi tiết cần dữ liệu từ:**
- **FR-10 Quản trị** → danh mục Loại DN, Tỉnh/TP, Ngành nghề, Lĩnh vực PL (cho tab Hồ sơ PL)
- **FR-10 Quản trị** → cây Đơn vị `DON_VI` (Sở TP quản lý DN)
- **FR-05 Vụ việc** → `VU_VIEC` (cho tab Lịch sử Hỗ trợ)
- **FR-06 Chi trả** → `HO_SO_CHI_TRA` (cho tab Hồ sơ Chi trả)
- **FR-12 Tư vấn chuyên sâu** → `HO_SO_PHAP_LY_DN` (cho tab Hồ sơ PL — entity này thuộc sở hữu của FR-12 Nhóm X.1, thao tác CRUD qua UC150/UC151)

**🖐️ Nhập tay:** ✅ **Có, 2 kênh manual + 1 auto:**
- **UC81** — Tạo/sửa DN từng bản ghi tại **SCR-V.III-02** (form 28 trường; quy mô `loai_dn` auto-suggest theo `so_lao_dong` + `doanh_thu`)
- **UC mới FR-V.III-NEW-01** — **Import Excel hàng loạt** tại **SCR-V.III-03** (Wizard 3 bước: Upload .xlsx ≤5MB → Validate preview → Xác nhận → Báo cáo kết quả; có file mẫu tải về)
- Auto upsert từ FR-12 API inbound khi Cổng gửi YC TV (match `ma_so_thue`)

**CRUD (DOANH_NGHIEP entity KHÔNG có trường `trang_thai` theo srs-v3 §3.4.3.3 — chỉ có soft delete `is_deleted`):**

| Thao tác | Actor | Trigger | Màn hình | Dữ liệu nhập | Nguồn dropdown / Filter |
|----------|-------|---------|----------|--------------|-------------------------|
| **🖐️ Tạo DN (thủ công UC81)** | `cb_nv_<cap>_01` | [+ Thêm DN] | SCR-V.III-02 | **Mã số thuế** (`ma_so_thue`, duy nhất), **Tên DN** (`ten_dn`), **Giấy chứng nhận ĐKKD** (`giay_cndk`), **Ngày cấp ĐKKD** (`ngay_cap_dkkd`), **Địa chỉ** (`dia_chi`), **Tỉnh/TP** (`tinh_thanh_id`), **Loại DN** (`loai_dn`), **Quy mô DN** (`quy_mo` ∈ `SIEU_NHO` / `NHO` / `VUA` — hệ thống **tự gợi ý** khi CB NV nhập `so_lao_dong` + `doanh_thu`), **Ngành nghề** (`nganh_nghe`), **Người đại diện** (`nguoi_dai_dien`), **Nữ làm chủ DN** (`la_nu_lam_chu`), **Số LĐ nữ** (`so_lao_dong_nu`), **Số LĐ khuyết tật** (`so_lao_dong_khuyet_tat`),... (tổng 28 trường) | `tinh_thanh_id` ← cây Đơn vị cấp tỉnh (FR-10 Quản trị)<br>`loai_dn` ← danh mục `LOAI_DN` (FR-10 Quản trị, UC105)<br>`nganh_nghe` ← enum `NONG_LAM` / `CONG_NGHIEP` / `THUONG_MAI` |
| **🖐️ Import Excel** (FR-V.III-NEW-01) | `cb_nv_<cap>_01` | [Import Excel] | SCR-V.III-03 (Wizard 3 bước) | Upload file `.xlsx` ≤5MB → hệ thống preview dữ liệu → validate → trả báo cáo "Thành công / Trùng MST / Lỗi" | Có file Excel mẫu tải về, cột tương ứng 28 trường của form DN |
| Upsert từ TV chuyên sâu | System | API nhận từ FR-12 Tư vấn chuyên sâu | — | Hệ thống đối chiếu `ma_so_thue`: nếu DN chưa có thì tạo mới với quy mô mặc định, chờ CB NV vào bổ sung | Tự động từ **FR-12 Tư vấn chuyên sâu** |
| Sửa quy mô | `cb_nv_<cap>_01` | Edit | SCR-V.III-02 | **Loại DN** (`loai_dn`), **Quy mô** (`quy_mo`) | Đối chiếu quy định NĐ39/2018 khi thay đổi |
| Xóa (soft delete) | `cb_nv_<cap>_01` | [Xóa] | SCR-V.III-01 | — | **Điều kiện chặn:** DN không còn VV đang xử lý (hệ thống tra cứu sang **FR-05 Vụ việc** để check) |

**Quan trọng:** `loai_dn` ảnh hưởng trực tiếp đến mức chi trả FR-06 (BR-CALC-01 — Siêu nhỏ 100% / Nhỏ 30% / Vừa 10%).

---

<a id="toc-fr04"></a>
### ③ FR-04 · Chuyên gia & Tư vấn viên (Nhóm IV)
**Login:**
- `nht_01` / `tvv_01` / `cg_01` tự đăng ký qua form public
- `cb_nv_dp_01` tạo proxy (CSKH)
- `cb_pd_dp_01` duyệt hồ sơ
- `cb_nv_dp_01` phân công

**Màn hình xem chi tiết** (theo `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:1398-1845`):
- SCR-IV-01: Danh sách Tư vấn viên / Chuyên gia (6 tab filter `trang_thai`)
- SCR-IV-02: Form Thêm/Sửa Tư vấn viên (5 nhóm thu gọn)
- SCR-IV-03: Hồ sơ chi tiết Tư vấn viên (5 tab)
- **SCR-IV-NHT-01/02/03**: Danh sách / Thêm-sửa / Hồ sơ NHT (entity `NGUOI_HO_TRO` riêng — SRS update)
- **SCR-IV-NEW-01/02/03**: Danh sách / Thêm-sửa / Chi tiết Tổ chức tư vấn (entity `TO_CHUC_TU_VAN` riêng — SRS update)

**📑 Tabs SCR-IV-01 Danh sách Tư vấn viên — 6 tab filter `trang_thai` (cite `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:1416-1421`):**

| # | Tab | Entity filter | Ghi chú |
|---|-----|---------------|---------|
| 1 | Đang hoạt động | `TU_VAN_VIEN WHERE trang_thai='HOAT_DONG'` | Tab mặc định, kèm badge đếm |
| 2 | Tạm dừng | `TU_VAN_VIEN WHERE trang_thai='TAM_DUNG'` | Badge đếm |
| 3 | Mới đăng ký / Chờ thẩm định | `TU_VAN_VIEN WHERE trang_thai IN ('MOI_DANG_KY','CHO_THAM_DINH')` | Badge đỏ nếu >0. Cán bộ Nghiệp vụ vào tab này để bắt đầu thẩm định. ⚠️ **NHT đã tách entity riêng** `NGUOI_HO_TRO` (SRS update 2026-05-05) — KHÔNG hiển thị ở tab này. `loai_tvv` enum chỉ `('TVV','CG')`. Cite: `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:1998` |
| 4 | Đang thẩm định | `TU_VAN_VIEN WHERE trang_thai='DANG_THAM_DINH'` | CB NV thẩm định 4 nhóm tiêu chí — gắn FR-IV-06 (UC44) |
| 5 | Yêu cầu bổ sung | `TU_VAN_VIEN WHERE trang_thai='YEU_CAU_BO_SUNG'` | Đã thẩm định một phần, chờ ứng viên bổ sung — CB NV chỉ theo dõi |
| 6 | Chờ phê duyệt | `TU_VAN_VIEN WHERE trang_thai='CHO_PHE_DUYET'` | Hiển thị khi vai trò là CB PD. Phê duyệt / từ chối + Phê duyệt hàng loạt — FR-IV-07 (UC45) |

**📑 Accordion SCR-IV-02 Form Thêm/Sửa TVV — 5 accordion (theo srs-fr-04 §3 dòng 862-870):**

| Accordion | Data (field chính) | Điều kiện |
|-----------|---------------------|-----------|
| **1. Thông tin cá nhân** | **Ảnh chân dung** (≤5MB, `.jpg`/`.png`), **Họ tên*** (`ho_ten`, tối đa 200 ký tự — lỗi `ERR-TVV-01`), **Ngày sinh*** (`ngay_sinh`), **Giới tính*** (`gioi_tinh` — `NAM` hoặc `NU`), **CCCD/CMND*** (`cmnd_cccd`, tối đa 12 ký tự, duy nhất — lỗi `ERR-TVV-02`), **Email*** (`email`, đúng chuẩn RFC 5322 — lỗi `ERR-TVV-03`), **Số điện thoại*** (`sdt`, 10-11 số), **Địa chỉ*** (`dia_chi`). (Dấu `*` = bắt buộc) | Luôn |
| **2. Thông tin nghề nghiệp** | **Trình độ*** (`trinh_do` — Cử nhân / Thạc sĩ / Tiến sĩ / Khác), **Chứng chỉ hành nghề** (`chung_chi_hanh_nghe`), **Số thẻ hành nghề** (`so_the_hanh_nghe`), **Kinh nghiệm tư vấn** (`kinh_nghiem_tu_van`, tối đa 5000 ký tự) | Luôn |
| **3. Tổ chức & Mạng lưới** | **Tổ chức chính*** (`to_chuc_chinh_id`, chọn từ entity `TO_CHUC_TU_VAN` — lỗi `ERR-TVV-04`), **Tổ chức đối tác** (`to_chuc_doi_tac[]`, chọn nhiều — lưu bảng N:N qua `TVV_TO_CHUC`), **Lĩnh vực PL phụ trách*** (`linh_vuc_pl`, multi-select, phải chọn ≥1), **Đơn vị quản lý*** (`don_vi_id`, auto-set theo đơn vị NHT đang đăng nhập — read-only, lock theo BR-AUTH-08). ⚠️ **Đã bỏ field `dia_ban_hoat_dong`** theo NĐ 77/2008 Đ.19 — TVV scope toàn quốc (cite `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:42` + `:2027`) | Luôn |
| **4. File đính kèm** | **Bằng cấp/Chứng chỉ*** (multi upload, mỗi file ≤10MB, tổng ≤50MB, định dạng PDF — lỗi `ERR-DK-02` / `ERR-DK-03`), **Thẻ hành nghề** (PDF ≤10MB) | Luôn |
| **5. Ghi chú** | Ghi chú tự do, tối đa 5000 ký tự | Luôn |

**📑 Tabs SCR-IV-03 Chi tiết TVV/CG — 5 tab (theo srs-fr-04 §3 dòng 884 + §3.4.3.28-29):**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Hồ sơ** | Dữ liệu TVV hiện tại: `TU_VAN_VIEN` + `HO_SO_TU_VAN_VIEN` (§3.4.3.28, 1-1) + danh sách tổ chức đối tác `TVV_TO_CHUC` (§3.4.3.4b, N-N) | Hiển thị 5 accordion con ở chế độ chỉ đọc (cùng cấu trúc với form SCR-IV-02): Cá nhân / Nghề nghiệp / Tổ chức & Mạng lưới / File đính kèm / Ghi chú | Luôn |
| **Thẩm định** | Lưu vào `HO_SO_TU_VAN_VIEN.trang_thai_tham_dinh` (`CHUA_THAM_DINH` / `DANG_THAM_DINH` / `DAT` / `KHONG_DAT`) + `HO_SO_TU_VAN_VIEN.ket_qua_tham_dinh` (text). **Lưu ý:** SRS không có entity `THAM_DINH_TVV` riêng — kết quả thẩm định lưu ngay trong `HO_SO_TU_VAN_VIEN` | Form chấm thẩm định theo 4 nhóm tiêu chí: **Pháp lý** (Pass/Fail), **Năng lực**, **Hiệu quả**, **Mạng lưới**. Mỗi tiêu chí lấy từ `TIEU_CHI_DANH_GIA` (§3.4.3.42) với `nhom_tieu_chi='THAM_DINH_TVV'`. Cuối form có trường **Kết luận** | Chỉ hiển thị khi TVV đang ở trạng thái `DANG_THAM_DINH` hoặc `CHO_PHE_DUYET` |
| **Năng lực** | Lưu trong các cột của `HO_SO_TU_VAN_VIEN`: `bang_cap_chi_tiet`, `chung_chi_chi_tiet`, `kinh_nghiem_chi_tiet` (cả 3 đều là JSON array kiểu `text(long)`, §3.4.3.28) + `noi_dung_tom_tat` | Hiển thị chi tiết bằng cấp / chứng chỉ / kinh nghiệm dạng cấu trúc JSON + đoạn tóm tắt năng lực | Luôn |
| **Lịch sử hỗ trợ** | Tổng hợp từ 3 nguồn: **FR-05 Vụ việc** (`VU_VIEC WHERE nguoi_ho_tro_id=<current>`), **FR-12 Tư vấn pháp luật chuyên sâu** (`TU_VAN_CHUYEN_SAU WHERE chuyen_gia_id=<current>`, §3.4.3.9 — ⚠️ **rename 2026-05-06 FR-12 v3.5 Thay đổi 2** từ `NOI_DUNG_TU_VAN_CS`), và bảng lịch sử `LICH_SU_HO_TRO_TVV` (§3.4.3.30) | Bảng các vụ việc + nội dung TV pháp luật chuyên sâu TVV đã tham gia + 3 chỉ số KPI (Tổng VV, Đã hoàn thành, Điểm trung bình) + timeline thời gian | Luôn |
| **Đánh giá** | 2 nguồn (theo SRS update 2026-05-05): (a) `DANH_GIA_TU_VAN_VIEN` thẩm định nội bộ FR-IV-06 — Nhóm 1 Pháp lý boolean Đạt/Không đạt, Nhóm 2 Năng lực 1-5, Nhóm 3 Hiệu quả 1-5 (nullable), Nhóm 4 Mạng lưới boolean (cite `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:2110-2117`); (b) `DANH_GIA_SAU_VU_VIEC` đánh giá DN sau VV FR-IV-09 — 3 tiêu chí 1-5 (chuyên môn / thái độ / đúng hạn), TB lưu ở `TU_VAN_VIEN.diem_danh_gia_tb` (DECIMAL 1.0-5.0, cite `:2013` + `:2138-2157`) | **Tab hiển thị 2 section:** (1) Kết quả thẩm định nội bộ (4 nhóm tiêu chí); (2) Đánh giá từ DN sau vụ việc (3 tiêu chí 1-5) + Nhận xét + Ngày ĐG. Form tạo ĐG mới chỉ mở khi user có quyền chấm | Luôn |

**Xem chi tiết cần dữ liệu từ:**
- **FR-10 Quản trị** → danh mục Lĩnh vực PL, Tổ chức tư vấn, Học vị, Chức danh
- **FR-10 Quản trị** → cây Đơn vị `DON_VI` (Sở TP quản lý TVV cấp ĐP)
- **FR-05 Vụ việc** → `VU_VIEC` (cho tab Lịch sử hỗ trợ)
- **FR-12 Tư vấn pháp luật chuyên sâu** `[RENAMED v3.5 Thay đổi 1]` → `TU_VAN_CHUYEN_SAU` (rename từ `NOI_DUNG_TU_VAN_CS` / `YEU_CAU_TV_CS` — FR-12 v3.5 Thay đổi 2) cho tab Lịch sử của Chuyên gia

**🖐️ Nhập tay:** ✅ **Có, 2 kênh:**
- **Tự đăng ký (NHT public)** — NHT đăng ký tham gia MLTV qua form public — trạng thái ban đầu `MOI_DANG_KY`
- **CB NV tạo proxy (CSKH)** — `cb_nv_dp_01` tạo hộ tại SCR-IV-02 (Form Thêm/Sửa TVV) → cũng tạo hồ sơ ở `MOI_DANG_KY`

**Transition hồ sơ TVV/CG (SM-TVV — 10 states theo `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:2287-2319`):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `MOI_DANG_KY` | Người hỗ trợ pháp lý | **NHT submit hồ sơ ứng viên TVV/CG (FR-IV-03)** | `ho_ten`, CCCD, học vị, chứng chỉ hành nghề, lĩnh vực chuyên môn, file bằng cấp, `to_chuc_chinh_id`, `don_vi_id` (auto-set) | `to_chuc_chinh_id` ← entity `TO_CHUC_TU_VAN` (state HOAT_DONG); `linh_vuc_pl[]` ← `DANH_MUC LINH_VUC_PL` (FR-10) | SCR-IV-02 Form Thêm/Sửa |
| `MOI_DANG_KY` | `CHO_THAM_DINH` | CB Nghiệp vụ | Vào tab "Mới đăng ký / Chờ thẩm định" bắt đầu chấm (FR-IV-06) | Ngầm chuyển trạng thái + thông báo TVV/CG (chủ hồ sơ) | — | SCR-IV-01 tab 3 |
| `CHO_THAM_DINH` | `DANG_THAM_DINH` | CB Nghiệp vụ | Bắt đầu thẩm định (FR-IV-06) | Ghi thời điểm bắt đầu | — | SCR-IV-03 Tab "Thẩm định" |
| `DANG_THAM_DINH` | `YEU_CAU_BO_SUNG` | CB Nghiệp vụ | Hồ sơ chưa đầy đủ (FR-IV-06) | Có `ly_do`, danh sách thiếu, TB chủ hồ sơ | — | SCR-IV-03 |
| `YEU_CAU_BO_SUNG` | `DANG_THAM_DINH` | TVV/CG (chủ hồ sơ) | Bổ sung xong (FR-IV-04) | Có tài liệu bổ sung | — | SCR-IV-02 |
| `DANG_THAM_DINH` | `CHO_PHE_DUYET` | CB Nghiệp vụ | Thẩm định đạt (FR-IV-06, BR-LEGAL-04) | Guard: `ket_luan='DAT' AND nhom1_phap_ly=true`. Ghi kết quả thẩm định 4 nhóm tiêu chí | — | SCR-IV-03 Tab "Thẩm định" |
| `DANG_THAM_DINH` | `TU_CHOI` | CB Nghiệp vụ | Kết luận KHÔNG ĐẠT (FR-IV-06) | `ket_luan='KHONG_DAT'`, có `ly_do` (BR-FLOW-04) | — | SCR-IV-03 |
| `CHO_PHE_DUYET` | **`CHO_KICH_HOAT`** | CB Phê duyệt | [Phê duyệt] (FR-IV-07, BR-AUTH-05) | Cùng cấp, có `so_quyet_dinh`. Audit, `ngay_cong_nhan`, `thoi_gian_duyet`, `nguoi_duyet`. **Hệ thống tự cấp tài khoản qua FR-VIII-15 + gửi mail kích hoạt** | — | SCR-IV-03 action-bar |
| **`CHO_KICH_HOAT`** | **`HOAT_DONG`** | TVV/CG (chủ hồ sơ) | **Bấm link kích hoạt + đặt mật khẩu lần đầu** (FR-VIII-26) | Token kích hoạt hợp lệ. TAI_KHOAN + TU_VAN_VIEN đồng thời chuyển HOAT_DONG | — | Form đặt MK lần đầu |
| `CHO_PHE_DUYET` | `TU_CHOI` | CB Phê duyệt | [Từ chối] (FR-IV-07) | `ly_do` ≥10 ký tự (BR-FLOW-04) | — | SCR-IV-03 |
| `TU_CHOI` | `CHO_THAM_DINH` | TVV/CG (chủ hồ sơ) | Nộp lại hồ sơ (FR-IV-03) | ⚠️ **KHÔNG có cooldown 6 tháng** (BA chốt 2026-05-03 — bỏ) | — | SCR-IV-02 |
| `HOAT_DONG` | `TAM_DUNG` | CB Nghiệp vụ | [Tạm dừng] (FR-IV-12) | Lý do (MD-TAM-DUNG ≥ 10 ký tự) | — | SCR-IV-03 |
| `TAM_DUNG` | `HOAT_DONG` | CB Nghiệp vụ | [Kích hoạt lại] (FR-IV-12) | — | — | SCR-IV-03 |
| `HOAT_DONG` | `VO_HIEU_HOA` | CB Nghiệp vụ | [Vô hiệu hóa] (FR-IV-12) | Lý do | **Guard: không có VU_VIEC AND HOI_DAP đang xử lý** (lookup FR-02/FR-05) | SCR-IV-03 |
| `TAM_DUNG` | `VO_HIEU_HOA` | CB Nghiệp vụ | [Vô hiệu hóa] (FR-IV-12) | Lý do | **Guard** như trên | SCR-IV-03 |
| `VO_HIEU_HOA` | `HOAT_DONG` | CB Nghiệp vụ | [Khôi phục] (FR-IV-12) | Quyết định từng trường hợp | — | SCR-IV-03 |

> **⚠️ State đổi tên** so với v3 cũ: `DANG_HOAT_DONG` → **`HOAT_DONG`** (đồng bộ enum CHECK constraint SRS line 2011).

**Đầu ra — Nguồn nhân lực cho:** FR-05 Vụ việc · FR-03 Đào tạo (TVV = GV) · FR-14 HĐ · FR-12 TV chuyên sâu.

---

<a id="toc-fr09"></a>
### ④ FR-09 · Thư viện Biểu mẫu (Nhóm VII)
**Login:** `cb_nv_<cap>_01` tạo; DN tải qua Cổng PLQG.

**Màn hình xem chi tiết:**
- SCR-VII-01: Danh sách biểu mẫu
- SCR-VII-02: Chi tiết + Upload phiên bản
- SCR-VII-03: **Nhập Biểu mẫu Hàng loạt** (FR-VII-06, UC97)

**Xem chi tiết cần dữ liệu từ:** `FR-10 → DANH_MUC` Lĩnh vực PL, Loại biểu mẫu.

**🖐️ Nhập tay:** ✅ **Có, 2 kênh manual:**
- CB NV upload đơn lẻ tại SCR-VII-02 (version theo file)
- **Import hàng loạt (UC97) tại SCR-VII-03** — upload nhiều file cùng lúc (max 50 file, mỗi file ≤20MB, tổng ≤500MB); hệ thống tạo bản ghi `BIEU_MAU` + `FILE_DINH_KEM` cho mỗi file hợp lệ; trả báo cáo "N thành công, M lỗi"
- Không có kênh API inbound

**CRUD (chỉ 1 actor, không có phê duyệt):**

| Thao tác | Actor | Trigger | Màn hình | Dữ liệu nhập | Nguồn dropdown / Filter |
|----------|-------|---------|----------|--------------|-------------------------|
| **🖐️ Tạo biểu mẫu** | `cb_nv_<cap>_01` | [+ Thêm biểu mẫu] | SCR-VII-02 | `ten`, `linh_vuc_id` (Y), `loai_bieu_mau_id`, file đính kèm (doc/docx/xls/xlsx/pdf), `mo_ta`, `version` | `linh_vuc_id` ← FR-10 DANH_MUC LINH_VUC_PL<br>`loai_bieu_mau_id` ← FR-10 DANH_MUC loại LOAI_BIEU_MAU |
| **🖐️ Upload version mới** | `cb_nv_<cap>_01` | [+ Version] | SCR-VII-02 | File mới + ghi chú thay đổi | Version cũ auto archive |
| **🖐️ Import hàng loạt** (UC97) | `cb_nv_<cap>_01` | [Nhập hàng loạt] | SCR-VII-03 | `thu_muc_id` + multi-file (max 50 file, ≤20MB/file, tổng ≤500MB). Báo cáo: "N thành công / M lỗi" | `thu_muc_id` ← thư mục BIEU_MAU hiện có |
| Công khai | `cb_nv_<cap>_01` | Switch "Công khai trên Cổng PLQG" → toggle `cong_khai` (v3.5 rename CR-01) | SCR-VII-02 | `anh_dai_dien` (jpg/png/gif ≤5MB), `mo_ta_cong_khai` (text long), `file_dinh_kem_cong_khai` (file[] PDF/DOC/DOCX/XLS/XLSX ≤20MB). Auto-fill `thoi_gian_dang_tai`=NOW() (BR-PUBLIC-03). | Đẩy API Cổng PLQG (FR-16) — filter outbound rename `cong_khai=1` |
| Xóa | `cb_nv_<cap>_01` | [Xóa] | SCR-VII-01 | — | Guard: nếu đang công khai, phải unpublish trước |

**Đầu ra:** Share API FR-XII (FR-16) cho Cổng PLQG.

---

<a id="toc-fr15-gd1"></a>
### ⑤ FR-15 · Chương trình HTPLDN (Nhóm XI) — **Giai đoạn 1: Kế hoạch**

> ⚠️ **FR-15 có 2 giai đoạn tách biệt về nhân quả — đọc cả 2 mục để nắm đủ:**
> - **Giai đoạn 1 (MỤC NÀY, LỚP 2):** SM-CHUONG_TRINH_HTPL — CB NV tạo kế hoạch CT, trình duyệt, công bố, kích hoạt (`DU_THAO → ... → DANG_THUC_HIEN`). **KHÔNG cần upstream** ngoài FR-10. Test ngay ở LỚP 2 sau QTHT.
> - **Giai đoạn 2 (xem LỚP 5 ⑭-bis):** SM-DOT-BC — Đợt báo cáo cho CT `DANG_THUC_HIEN`. **Cần số liệu** VV/Chi trả/Đào tạo trong kỳ ⇒ chỉ test được ở LỚP 5 sau khi LỚP 3+4 có data.

**Login:**
- `cb_nv_<cap>_01` tạo, soạn, trình
- `cb_pd_<cap>_01` duyệt cùng cấp (BR-AUTH-05)

**Màn hình xem chi tiết (SCR-XI-01):**
- Danh sách + Chi tiết CT (2 tab)
- **Progress bar stepper 6 bước hiển thị** (srs-fr-15 §3 dòng 888): `DU_THAO → CHO_PHE_DUYET → DA_DUYET → DA_CONG_BO → DANG_THUC_HIEN → HOAN_THANH` (TAM_DUNG/HUY ẩn khỏi stepper nhưng vẫn tồn tại trong enum 8 state theo srs-v3.md §3.4.3)

**📑 Tabs SCR-XI-01 Chi tiết CT — 2 tab + Drill-down:**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Thông tin** | `CHUONG_TRINH_HTPL WHERE id=<current>` | Form chương trình gồm 8 trường chính: **Mã CT**, **Tên CT**, **Mục tiêu**, **Ngày bắt đầu / kết thúc**, **Ngân sách**, **Đối tượng**, **File đính kèm**, **Đơn vị chủ trì** + **Stepper hiển thị 6 bước workflow** (2 trạng thái `TAM_DUNG` / `HUY` được ẩn khỏi stepper) + các nút hành động thay đổi theo trạng thái | Luôn hiển thị. **Chỉ cho phép sửa khi CT ở trạng thái `DU_THAO`** — các trạng thái khác đều read-only |
| **Đợt báo cáo** | `DOT_BAO_CAO WHERE chuong_trinh_id=<current>` | Banner nhắc deadline TT17/2025 + bảng các đợt báo cáo (cột: Mã / Tên / Kỳ BC / Hạn nộp / Trạng thái). Click vào đợt → drill-down sang form lập báo cáo | Tab luôn hiển thị; **nút [+ Tạo đợt mới]** chỉ bật khi CT ở `DANG_THUC_HIEN` hoặc `HOAN_THANH` |
| **Kết quả** (drill-down từ Đợt BC) | `BAO_CAO_CT_HTPL WHERE dot_bc_id=<current>` | Bảng lưới nhập số liệu theo **Mẫu 21a/21b TT17/2025** — cột: Chỉ tiêu / Số liệu kỳ trước / Số liệu kỳ này / **Gợi ý số tự động** (hệ thống tự tổng hợp từ **FR-02 Hỏi đáp** + **FR-05 Vụ việc** + **FR-08 Đánh giá**) + ô nhận xét/kiến nghị + action phê duyệt / gửi lên TW | Chỉ hiển thị khi drill-down vào 1 đợt cụ thể; form chỉ cho sửa khi đợt ở trạng thái `DANG_LAP_BC` |

**Xem chi tiết cần dữ liệu từ:**
- **FR-10 Quản trị** → cây Đơn vị `DON_VI` (`don_vi_id` tự lấy từ đơn vị của user login)
- **FR-10 Quản trị** → danh sách tài khoản `TAI_KHOAN` (để chọn `nguoi_phe_duyet_id`)
- Số liệu tổng hợp từ **FR-02 Hỏi đáp** / **FR-05 Vụ việc** / **FR-08 Đánh giá** (cho tab Kết quả)

**🖐️ Nhập tay:** ✅ **Có** — **UC164** CRUD CT HTPLDN hoàn toàn do CB NV nhập tay. Không có kênh API inbound. Đây là workflow "trong nhà" của cơ quan quản lý (Cục/Bộ/Sở).

**Trường tạo mới (SCR-XI-01 Tab Thông tin):**

| Trường | Bắt buộc | Nguồn |
|--------|---------|-------|
| `ma_chuong_trinh` | Y (auto CT-YYYYMMDD-SEQ) | System |
| `ten_chuong_trinh` | Y | Nhập tay |
| `muc_tieu` | Y | Nhập tay |
| `thoi_gian_bat_dau` | Y | Date picker |
| `thoi_gian_ket_thuc` | N | Date picker |
| `ngan_sach` | N | Nhập số |
| `doi_tuong` | Y | Nhập tay |
| `don_vi_id` | Y (auto) | Từ user login (FR-10) |

**Transition (SM-CHUONG_TRINH_HTPL):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `DU_THAO` | `cb_nv_<cap>_01` | **🖐️ Tạo CT thủ công (UC164)** | Form tab Thông tin (8 trường, xem bảng trên) | `don_vi_id` auto từ user login | SCR-XI-01 Tab Thông tin |
| `DU_THAO` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Gửi phê duyệt] | Guard: đủ field Y | — | SCR-XI-01 |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Phê duyệt] | Ghi chú | Cùng cấp với CB NV (BR-AUTH-05) | SCR-XI-01 modal xác nhận |
| `CHO_PHE_DUYET` | `DU_THAO` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do` ≥10 ký tự (BR-FLOW-04) | — | SCR-XI-01 modal lý do |
| `DA_DUYET` | `DA_CONG_BO` | `cb_nv_<cap>_01` | [Công bố lên Cổng] | Xác nhận → API push FR-XII-15 | — | SCR-XI-01 |
| `DA_CONG_BO` | `DA_DUYET` | `cb_nv_<cap>_01` | [Hủy công bố] | Gỡ khỏi Cổng | — | SCR-XI-01 |
| `DA_DUYET` / `DA_CONG_BO` | `DANG_THUC_HIEN` | `cb_nv_<cap>_01` | [Bắt đầu thực hiện] | Xác nhận — sau đó có thể tạo đợt BC | — | SCR-XI-01 |
| `DANG_THUC_HIEN` | `TAM_DUNG` | `cb_nv_<cap>_01` | [Tạm dừng] | Lý do | — | SCR-XI-01 |
| `TAM_DUNG` | `DANG_THUC_HIEN` | `cb_nv_<cap>_01` | [Tiếp tục] | — | — | SCR-XI-01 |
| `DANG_THUC_HIEN` | `HOAN_THANH` | `cb_nv_<cap>_01` | [Hoàn thành] | Xác nhận | — | SCR-XI-01 |
| `DU_THAO` | `HUY` | `cb_nv_<cap>_01` | [Hủy CT] | Xác nhận | — | SCR-XI-01 |

**Sub-flow Đợt báo cáo → xem LỚP 5 ⑭-bis (cần upstream LỚP 3+4).**

---

<a id="toc-lop3"></a>
## LỚP 3 — GIAO DỊCH LÕI (cần đủ LỚP 1+2)

<a id="toc-fr05"></a>
### ⑥ FR-05 · Vụ việc TGPL (Nhóm V.I) ⭐ CORE
**Login theo vai trò:**
- Tạo: DN (qua DVC) hoặc `cb_nv_dp_01` nhập tay
- Tiếp nhận / kiểm tra / phân công: `cb_nv_<cap>_01`
- Xác nhận tham gia: `tvv_01` / `nht_01`
- Trình KQ / đóng hồ sơ: `cb_nv_<cap>_01`
- Duyệt: `cb_pd_<cap>_01` (cùng cấp)

**Màn hình xem chi tiết:**
- SCR-V.I-01: Danh sách VV
- SCR-V.I-02: Form Tạo/Tiếp nhận thủ công (UC54)
- SCR-V.I-03: Chi tiết VV (8 accordion theo trạng thái)

**📑 Accordion SCR-V.I-03 Chi tiết VV — 8 accordion theo SM-VUVIEC:**

| Accordion | Entity + Filter | Data | Điều kiện hiển thị |
|-----------|-----------------|------|--------------------|
| **Thông tin DN** | DN đang yêu cầu hỗ trợ: `DOANH_NGHIEP WHERE id=<vu_viec.doanh_nghiep_id>` | Tên DN, MST, địa chỉ, loại DN, quy mô, người đại diện (read-only, click vào tên DN → điều hướng sang SCR-V.III-02 chi tiết DN thuộc **FR-07 Doanh nghiệp**) | Luôn |
| **Nội dung Yêu cầu** | Chính bản ghi VV: `VU_VIEC WHERE id=<current>` | **Tiêu đề** (`tieu_de`), **Mô tả** (`mo_ta`), **Lĩnh vực PL** (`linh_vuc_id`), **Loại hình HT** (`loai_hinh_ht_id`), **Vướng mắc**, **Ghi chú** | Luôn |
| **Tài liệu Đính kèm** | Các file gắn với VV: `FILE_DINH_KEM WHERE entity='VU_VIEC' AND entity_id=<current>` | Danh sách file (tên / loại / kích thước / ngày upload) + nút [Upload thêm] | Luôn |
| **Kết quả Kiểm tra (FR-V.I-06 = UC56)** | `KIEM_TRA_VV WHERE vu_viec_id=<current>` | Checklist 6 hạng mục (Đạt / Không đạt), các hạng mục lấy từ danh mục cấu hình ở **UC106 "DM Hồ sơ đề nghị HT" (FR-10 Quản trị)**: **Mẫu 01 NĐ55**, **Giấy ĐKKD**, **Quy mô DN**, **Hợp đồng TV**, **Văn bản TV đầy đủ**, **Văn bản TV loại BMKD** + ô **Kết luận** + ô **Lý do** + **Đếm số lần yêu cầu bổ sung** (tối đa 3 — quy tắc `BR-EC-15`) | Chỉ hiển thị khi VV đã qua trạng thái `DANG_KIEM_TRA` |
| **Phân công xử lý** | `PHAN_CONG_VU_VIEC WHERE vu_viec_id=<current>` (entity owned mới — SRS update 2026-05-06) + join `TAI_KHOAN` (qua `nguoi_xu_ly_id`) + `TO_CHUC_TU_VAN` (qua `to_chuc_tu_van_id` nếu loại=TO_CHUC) | **2 thẻ phân công** (FR-V.I-09 refactor — Thay đổi 8): (a) `loai_doi_tuong_xu_ly='CA_NHAN'` → hiển thị Tên cá nhân (TVV/CG/NHT), lĩnh vực chuyên môn, **đơn vị quản lý** (Sở TP/Bộ ngành công nhận — KHÔNG dùng "địa bàn" do NĐ 77/2008 Đ.19); (b) `loai_doi_tuong_xu_ly='TO_CHUC'` → hiển thị Tên tổ chức + TVV cụ thể được cử (constraint `to_chuc_chinh_id` match). Cộng thêm: ngày phân công, **`trang_thai`** (`CHO_XAC_NHAN` / `CHAP_NHAN` / `TU_CHOI`), `ly_do_tu_choi` nếu có. | Chỉ hiển thị khi VV đã qua `DA_PHAN_CONG` |
| **Kết quả Hỗ trợ** | `KET_QUA_HO_TRO WHERE vu_viec_id=<current>` | **Nội dung kết quả** (TVV cập nhật), **File kết quả**, **Kết luận cuối cùng** (CB NV tổng hợp) | Chỉ hiển thị khi VV đã qua `DANG_XU_LY` |
| **Phê duyệt** | `PHE_DUYET WHERE entity='VU_VIEC' AND entity_id=<current>` | **Quyết định** (Duyệt / Từ chối), **Người phê duyệt** (`nguoi_phe_duyet_id`), **Thời gian**, **Lý do từ chối** (nếu có) | Chỉ hiển thị khi VV đã qua `CHO_PHE_DUYET` |
| **Đánh giá** | `DANH_GIA_VU_VIEC WHERE vu_viec_id=<current>` (entity owned mới — SRS update 2026-05-06 Thay đổi 12+17) | **Điểm đánh giá** thang **0-10** (KHÁC thang TVV 1.0-5.0 ở FR-04) theo 3 tiêu chí: **Chất lượng** (`diem_chat_luong`) / **Thời gian** (`diem_thoi_gian`) / **Thái độ** (`diem_thai_do`) — `diem_tong` AUTO=AVG(3 điểm). Cộng `nhan_xet` ≤2000 ký tự, `loai_nguoi_danh_gia` ENUM **CHỈ {CB_NV, DN}** (loại CB_PD theo CSV UC67). UNIQUE(`vu_viec_id`, `loai_nguoi_danh_gia`) — chấm 2 lần cùng loại → `ERR-DG-VV-04` | Chỉ hiển thị khi VV ở `HOAN_THANH` hoặc `DA_DANH_GIA` |

> **🆕 Cờ overlay Công khai (FR-V.I-NEW-05 — NEW 2026-05-06, KHÔNG phải accordion riêng):**
> Trên SCR-V.I-03 khi VV ở `DA_DUYET` hoặc `HOAN_THANH` xuất hiện **Badge xanh dương "Đã công khai"** + tooltip "Đã công khai trên Cổng PLQG ngày dd/mm/yyyy" (chỉ hiển thị khi `cong_khai=1`) + 2 nút **[Công khai]** / **[Hủy công khai]** chỉ hiển thị cho **CB PD cùng cấp** (BR-AUTH-05). Click [Công khai] → form soạn `mo_ta_cong_khai` ≤2000 ký tự (CB PD soạn riêng — KHÔNG auto-extract từ mo_ta nội bộ) + upload `anh_dai_dien` (jpg/png/gif ≤5MB) + chọn `file_dinh_kem_cong_khai` (≤10 file ≤20MB/file). BE check BR-PUBLIC-01 + gọi API Cổng PLQG (whitelist 9 fields BR-PUBLIC-04 — ẨN 6 fields nhạy cảm: tên DN/người đại diện, CCCD/MST, mo_ta nội bộ, file_dinh_kem nghiệp vụ, noi_dung_tu_van, SĐT/email/địa chỉ DN — anonymize NQ 03/2017). API OK → set `cong_khai=1` + `thoi_gian_dang_tai=NOW()` (BR-EC-20: KHÔNG set trước API OK). 9 mã lỗi `ERR-CK-VV-01..10`.

**Xem chi tiết cần dữ liệu từ:**
- **FR-07 Doanh nghiệp** → `DOANH_NGHIEP` (lookup theo MST từ session DN auth Tier 2 VNeID — KHÔNG nhập tay 4 field DN info, FR-V.I-04 Thay đổi 16)
- **FR-04 CG/TVV** → 3 entity (SRS update 2026-05-06 v3.5): (a) `TU_VAN_VIEN` cho TVV/CG cá nhân ngoài (`loai_tvv ∈ ('TVV','CG')` — bỏ NHT khỏi enum); (b) `NGUOI_HO_TRO` cho NHT cán bộ HTPL nội bộ (NĐ 55/2019 Đ.7); (c) `TO_CHUC_TU_VAN` cho tổ chức tư vấn (Công ty Luật / VP Luật sư / Trung tâm TVPL). **Modal phân công VV (UC59 / FR-V.I-09)** hiển thị **2 thẻ** (Thay đổi 8): "Cá nhân" (TVV/CG/NHT qua TAI_KHOAN) + "Tổ chức tư vấn" (TO_CHUC_TU_VAN — sau khi chọn TC, load TVV thuộc tổ chức để chọn người cụ thể). Cite: `srs-update-2026-5-5/srs-fr-05-vu-viec.md` FR-V.I-09 + `srs-fr-04-chuyen-gia-tvv.md:1998` + `:2032`
- **FR-10 Quản trị** → danh mục Lĩnh vực (`linh_vuc_id`), Loại hình HT (`loai_hinh_ht_id`)
- **FR-10 Quản trị** → `CAU_HINH_SLA` (thời hạn xử lý **15 ngày làm việc** theo **NĐ55 Điều 8 Khoản 1** — DNNVV; update 2026-05-06 từ 10 ngày v3 — Thay đổi 1)
- **FR-10 Quản trị** → `TAI_KHOAN` (`nguoi_tiep_nhan_id`, `nguoi_phe_duyet_id`, `nguoi_xu_ly_id` qua entity PHAN_CONG_VU_VIEC mới)
- **FR-10 Quản trị** → `TO_CHUC_TU_VAN` (`to_chuc_tu_van_id` cho phân công loại=TO_CHUC)
- **FR-14 Hợp đồng tư vấn** → `HOP_DONG_TU_VAN` (liên kết 2 chiều qua `hop_dong_tv_id`)

**🖐️ Nhập tay:** ✅ **Có — UC54 "Nhập hồ sơ yêu cầu thủ công"** tại **SCR-V.I-02**:
- Dùng cho kênh `TRUC_TIEP` / `BUU_CHINH` / `DIEN_THOAI` (3/5 giá trị enum `kenh_tiep_nhan`)
- **Đặc biệt:** Hồ sơ nhập tay **bỏ qua** `MOI_TAO` + `CHO_TIEP_NHAN`, gán thẳng `DA_TIEP_NHAN` (vì CB NV đã "tiếp nhận offline" rồi)
- Cần quyền "Nhập hồ sơ VV"
- 2 kênh API inbound song song: `DVC` (UC52) + `HE_THONG_KHAC` (UC55 — cần chọn `he_thong_nguon` từ DANH_MUC)

**Transition (SM-VUVIEC — 12 trạng thái):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `MOI_TAO` | System | **DN gửi qua DVC (UC52, API inbound)** | Mẫu 01 NĐ55 (18 trường) | — | API inbound |
| — | `CHO_TIEP_NHAN` | System | **DVC / Hệ thống khác (UC55, API nhận)** | Payload nhận qua trục LGSP, kèm: **Hệ thống nguồn** (`he_thong_nguon`, chọn từ danh mục), **Mã hồ sơ gốc bên hệ thống nguồn** (`ma_ho_so_nguon`) | `he_thong_nguon` ← danh mục `HE_THONG_NGUON` (FR-10 Quản trị) | API nhận từ ngoài |
| — | `DA_TIEP_NHAN` | `cb_nv_<cap>_01` | **🖐️ Thêm thủ công (UC54) — kênh `TRUC_TIEP` / `BUU_CHINH` / `DIEN_THOAI`** | **Tiêu đề** (`tieu_de`), **Mô tả** (`mo_ta`), **DN** (`doanh_nghiep_id`), **Lĩnh vực PL** (`linh_vuc_id`), **Loại hình HT** (`loai_hinh_ht_id`), **Kênh tiếp nhận** (`kenh_tiep_nhan`), **Độ ưu tiên** (`uu_tien`, thang 1-5), **Lý do ưu tiên** (`ly_do_uu_tien`) | `doanh_nghiep_id` ← **FR-07 Doanh nghiệp** (dropdown có search); `linh_vuc_id` + `loai_hinh_ht_id` ← danh mục của **FR-10 Quản trị** | **SCR-V.I-02** Form nhập tay (bỏ qua 2 trạng thái `MOI_TAO` + `CHO_TIEP_NHAN`, vào thẳng `DA_TIEP_NHAN`) |
| `CHO_TIEP_NHAN` | `DA_TIEP_NHAN` | `cb_nv_<cap>_01` | [Tiếp nhận] | Hệ thống tự gán **Người tiếp nhận** (`nguoi_tiep_nhan_id`) + **Ngày tiếp nhận** (`ngay_tiep_nhan`) + **Hạn xử lý** (`deadline` = **15 ngày làm việc** theo **NĐ55 Điều 8 Khoản 1** — DNNVV; update 2026-05-06) | `CAU_HINH_SLA` ← **FR-10 Quản trị** | SCR-V.I-03 |
| `DA_TIEP_NHAN` | `DANG_KIEM_TRA` | `cb_nv_<cap>_01` | [Bắt đầu kiểm tra] (UC56, FR-V.I-06) | Checklist 6 hạng mục lấy từ cấu hình UC106: **Mẫu 01**, **Giấy ĐKKD**, **Quy mô DN**, **HĐ Tư vấn**, **Văn bản TV đầy đủ**, **Văn bản TV loại BMKD** | — | SCR-V.I-03 |
| `DANG_KIEM_TRA` | `DA_PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công xử lý (UC59, FR-V.I-09 — refactor 2026-05-06)** | **3 cột phân công** (Thay đổi 8 — bỏ `nguoi_ho_tro_id`):<br>• `loai_doi_tuong_xu_ly` ENUM `('CA_NHAN','TO_CHUC')` (bắt buộc)<br>• `nguoi_xu_ly_id` FK→TAI_KHOAN (bắt buộc cả 2 loại)<br>• `to_chuc_tu_van_id` FK→TO_CHUC_TU_VAN (REQUIRED khi loại=TO_CHUC) | **Modal 2 thẻ** (FR-V.I-09 Inputs 5 fields):<br>**Thẻ Cá nhân** — TAI_KHOAN có vai trò TVV/CG (qua TU_VAN_VIEN.tai_khoan_id, state HOAT_DONG, đã công khai) HOẶC NHT (qua NGUOI_HO_TRO.tai_khoan_id, state HOAT_DONG)<br>**Thẻ Tổ chức tư vấn** — TO_CHUC_TU_VAN state HOAT_DONG; sau chọn TC → load danh sách TVV thuộc tổ chức để chọn người cụ thể (constraint `TU_VAN_VIEN[nguoi_xu_ly_id].to_chuc_chinh_id = to_chuc_tu_van_id` — fail → ERR-PC-06)<br>**Quy tắc ưu tiên `BR-CALC-04`** (NĐ55 Điều 4): (1) DN do phụ nữ làm chủ +3, (2) DN nhiều LĐ nữ +2, (3) DN ≥30% LĐ khuyết tật +2, (4) FIFO +1<br>**Lọc:** lĩnh vực khớp `linh_vuc_id`; **KHÔNG dùng "địa bàn"** (NĐ 77/2008 Đ.19 — TVV scope toàn quốc)<br>CB NV được override gợi ý<br>**Mã lỗi:** ERR-PC-01..02, ERR-PC-05..07 + WRN-PC-01 | SCR-V.I-03 Modal phân công 2 thẻ |
| `DANG_KIEM_TRA` | `YEU_CAU_BO_SUNG` | `cb_nv_<cap>_01` | Thiếu HS | Danh sách item thiếu + set `ngay_yeu_cau_bo_sung=NOW()` (FR-V.I-NEW-02 + BR-EC-16) | — | SCR-V.I-03 |
| `DANG_KIEM_TRA` | `TU_CHOI` | `cb_nv_<cap>_01` | Không đạt | Lý do từ chối | — | SCR-V.I-03 |
| `YEU_CAU_BO_SUNG` | `DANG_KIEM_TRA` | **DN (auth Tier 2 VNeID)** | **DN bổ sung HS qua chuyên trang (FR-V.I-NEW-02 — formal hoá 2026-05-06 Thay đổi 4)** | `file_bo_sung[]` PDF/DOC/DOCX/XLS/XLSX/JPG/PNG ≤20MB/file, tổng ≤100MB, max 10 file (quét virus); `ghi_chu` ≤5000 ký tự | DN auth qua VNeID Tier 2 trên SCR-V.I-04 → click VV badge "Cần bổ sung" → form upload | SCR-V.I-04 chuyên trang DN |
| `YEU_CAU_BO_SUNG` | `TU_CHOI` | System | **Auto (BR-EC-16)**: quá `bo_sung_timeout` ngày LV (Thay đổi 6 OUT — chỉ có quy tắc UI v3 + BR-EC-15) | — | `CAU_HINH_SLA.bo_sung_timeout` ← FR-10 | Auto |
| `DA_PHAN_CONG` | `DANG_XU_LY` | Cá nhân tại `nguoi_xu_ly_id` (TVV/CG/NHT) | [Chấp nhận] tham gia | PHAN_CONG_VU_VIEC.trang_thai='CHAP_NHAN', `ngay_xac_nhan=NOW()` | — | SCR-V.I-03 |
| `DA_PHAN_CONG` | `DA_TIEP_NHAN` | Cá nhân tại `nguoi_xu_ly_id` | [Từ chối phân công] | Lý do (PHAN_CONG_VU_VIEC.trang_thai='TU_CHOI', `ly_do_tu_choi`). Thay đổi 5 OUT — placeholder, dev implement theo UI v3 | — | SCR-V.I-03 (quay lại chọn người khác) |
| `DANG_XU_LY` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Trình duyệt] | Guard: cá nhân được phân công đã cập nhật KQ | — | SCR-V.I-03 |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] | Cùng cấp (BR-AUTH-05) — chỉ CB PD cùng đơn vị với CB NV trình | — | SCR-V.I-03 |
| `CHO_PHE_DUYET` | `DANG_XU_LY` | `cb_pd_<cap>_01` | **[Từ chối]** (Thay đổi 11 — KHÔNG còn `→ TU_CHOI` đóng VV như v3) | `ly_do` ≥10 ký tự (BR-FLOW-04). Cá nhân được phân công sửa KQ → CB NV trình lại. Ghi LICH_SU_VU_VIEC `hanh_dong='TU_CHOI_DUYET'` | — | SCR-V.I-03 |
| `DA_DUYET` | `HOAN_THANH` | `cb_nv_<cap>_01` | [Đóng hồ sơ] | `ket_qua_tom_tat`, `ngay_hoan_thanh` | — | SCR-V.I-03 |
| `HOAN_THANH` | `DA_DANH_GIA` | CB_NV hoặc DN — **KHÔNG cho CB_PD** (CSV UC67) | UC67 đánh giá VV (FR-V.I-17) | 3 tiêu chí điểm **0-10** (chất lượng / thời gian / thái độ) — `diem_tong` AUTO=AVG. UNIQUE(`vu_viec_id`, `loai_nguoi_danh_gia`) — chấm 2 lần cùng loại → ERR-DG-VV-04 | Tạo bản ghi `DANH_GIA_VU_VIEC` | SCR-V.I-03 accordion #8 |
| `DA_DUYET` ↻ self-loop | `DA_DUYET` (cờ overlay `cong_khai=0→1` / `1→0`) | `cb_pd_<cap>_01` | **[Công khai] / [Hủy công khai]** trên DA_DUYET (FR-V.I-NEW-05) | Công khai: soạn `mo_ta_cong_khai` ≤2000 ký tự + upload `anh_dai_dien` jpg/png/gif ≤5MB + chọn `file_dinh_kem_cong_khai` ≤10 file ≤20MB; BE check BR-PUBLIC-01 + gọi API Cổng PLQG (whitelist 9 fields BR-PUBLIC-04 — ẨN tên DN/MST/CCCD/SĐT/email/địa chỉ/mo_ta nội bộ/file nghiệp vụ/noi_dung_tu_van — anonymize NQ 03/2017). API OK → set `cong_khai=1` + `thoi_gian_dang_tai=NOW()` (BR-EC-20). Hủy: `ly_do_huy` ≥20 ký tự → set `cong_khai=0`, clear `thoi_gian_dang_tai=NULL`, gỡ Cổng PLQG. 9 mã lỗi ERR-CK-VV-01..10 | — | SCR-V.I-03 |
| `HOAN_THANH` ↻ self-loop | `HOAN_THANH` (cờ overlay `cong_khai=0→1` / `1→0`) | `cb_pd_<cap>_01` | **[Công khai] / [Hủy công khai]** trên HOAN_THANH (FR-V.I-NEW-05) | Tương tự self-loop trên DA_DUYET | — | SCR-V.I-03 |
| `TU_CHOI` | `DA_TIEP_NHAN` | `qtht_01` / `cb_nv_<cap>_01` | Admin override / DN khiếu nại (Thay đổi 5 OUT — placeholder FR-V.I-xx, dev implement theo UI v3) | Lý do mở lại | — | SCR-V.I-03 |

**Đầu ra → module sau:** FR-14 HĐ (gắn 1 VV = 1..N HĐ) · FR-06 Chi trả (cần VV `HOAN_THANH`) · FR-08 Đánh giá (chỉ VV `HOAN_THANH`).

---

<a id="toc-fr02"></a>
### ⑦ FR-02 · Hỏi đáp Pháp lý (Nhóm II)
**Login:**
- Tạo: DN (Cổng/DVC) hoặc `cb_nv_<cap>_01`
- Tiếp nhận + phân công: `cb_nv_<cap>_01`
- Xử lý: `tvv_01` / `nht_01` được phân công (hoặc CB NV tự soạn)
- Duyệt: `cb_pd_<cap>_01`

**Màn hình xem chi tiết:**
- SCR-II-01: Danh sách hỏi đáp (tabs filter trạng thái)
- SCR-II-02: Chi tiết (3 accordion) + khối soạn phản hồi động
- SCR-II-03: Modal phân công xử lý (overlay trên SCR-II-02)

**📑 Tabs SCR-II-01 Danh sách — filter theo trạng thái:**

| Tab | Filter | Badge đếm |
|-----|--------|-----------|
| Tất cả | Không filter | Tổng số HĐ |
| Mới | `trang_thai=MOI` | Số mới chưa tiếp nhận |
| Đang xử lý | `trang_thai IN (TIEP_NHAN, DANG_XU_LY, DA_TRA_LOI)` | Số đang xử lý |
| Chờ duyệt | `trang_thai=CHO_PHE_DUYET` | Số chờ duyệt (cho CB PD) |
| Đã duyệt/Công khai | `trang_thai IN (DA_DUYET, CONG_KHAI)` | Số đã duyệt |
| Hoàn thành (v2.1 gộp MH-02.5) | `trang_thai=HOAN_THANH` | Số đã đóng |

**📑 Accordion SCR-II-02 Chi tiết Hỏi đáp — 3 accordion:**

| Accordion | Entity + Filter | Data | Điều kiện hiển thị |
|-----------|-----------------|------|--------------------|
| **Thông tin câu hỏi** (mở sẵn mặc định) | Chính bản ghi Hỏi đáp: `HOI_DAP WHERE id=<current>` | **Mã HĐ**, **Nội dung câu hỏi** (`noi_dung`, tối đa 5000 ký tự), **Lĩnh vực PL** (`linh_vuc_id`), **Thông tin người gửi**: DN liên kết hoặc cặp `ten_nguoi_gui` / `email` / `sdt`, **Kênh tiếp nhận** (`kenh_tiep_nhan`), **Ngày tạo**, **File đính kèm** | Luôn |
| **Thông tin phê duyệt** (mở sẵn mặc định) | Các trường phê duyệt lưu ngay trên `HOI_DAP` (§3.4.3.1) + lịch sử thao tác từ `AUDIT_LOG WHERE entity='HOI_DAP'`. **Lưu ý:** SRS không có entity `PHE_DUYET` riêng cho Hỏi đáp — các trường phê duyệt là cột của `HOI_DAP` | **Người tiếp nhận** (`nguoi_tiep_nhan_id`) + ngày tiếp nhận, **Người xử lý** (`nguoi_xu_ly_id`) + ngày phân công, **Hạn SLA** kèm cảnh báo quá hạn, **Người phê duyệt** (`nguoi_phe_duyet_id`) + ngày phê duyệt, **Lý do từ chối** (`ly_do_tu_choi`, nếu có) | Luôn |
| **Lịch sử xử lý** (thu gọn mặc định) | `AUDIT_LOG WHERE entity='HOI_DAP' AND entity_id=<current>` | Timeline các thao tác trên HĐ: người thực hiện / thời gian / hành động | Luôn |
| Khối "Nội dung phản hồi" (tĩnh, không thuộc accordion) | Cột `noi_dung_phan_hoi` trong `HOI_DAP` | Rich Text editor để soạn phản hồi + dropdown chọn **Mẫu phản hồi** (`MAU_PHAN_HOI` — do QTHT cấu hình ở FR-10) | Chỉ hiển thị khi HĐ ở `DANG_XU_LY` hoặc `DA_TRA_LOI` **VÀ** user là người được phân công xử lý hoặc là CB NV cùng đơn vị |

**Xem chi tiết cần dữ liệu từ:**
- **FR-10 Quản trị** → danh mục Lĩnh vực PL + cấu hình `CAU_HINH_SLA` (hạn xử lý)
- **FR-07 Doanh nghiệp** → `DOANH_NGHIEP` (tùy chọn — DN hỏi không bắt buộc đã đăng ký trong hệ thống)
- **FR-04 CG/TVV** → 2 entity tách (SRS update 2026-05-05): `TU_VAN_VIEN` (TVV/CG) + `NGUOI_HO_TRO` (NHT) — dropdown phân công Hỏi đáp hiển thị 2 nguồn riêng
- **FR-10 Quản trị** → `MAU_PHAN_HOI` (dropdown chọn mẫu phản hồi soạn sẵn)

**🖐️ Nhập tay:** ✅ **Có — UC10** tại **SCR-II-01** (Form thêm mới dạng Drawer/Modal):
- Enum `kenh_tiep_nhan` hỗ trợ 4 giá trị: `DVC` · `CONG_PLQG` (từ ngoài) · **`TRUC_TIEP`** · **`HE_THONG_KHAC`** (2 cái sau dành cho CB NV nhập tay)
- DN có thể không đăng ký — CB NV nhập `ten_nguoi_gui`/`email`/`sdt` thủ công
- Có thể đính kèm file

**Transition (SM-HOIDAP — 9 trạng thái theo srs-v3 §C.1):**

> ⚠️ **TODO (AMBIGUOUS):** Master SRS §C.1 enum có 9 state nhưng KHÔNG có `DA_PHAN_CONG`; tuy nhiên srs-fr-02 UC15 (FR-II-06) lại set `trang_thai = 'DA_PHAN_CONG'` sau phân công. Đây là conflict trong SRS — cần CĐT thống nhất. Bảng dưới bám Master (phân công trực tiếp `TIEP_NHAN → DANG_XU_LY`).


| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `MOI` | DN | **Gửi qua Cổng PLQG / DVC (API inbound)** | `noi_dung`, `linh_vuc_id`, DN (nếu có) | — | API inbound |
| — | `MOI` | `cb_nv_<cap>_01` | **🖐️ Thêm thủ công (UC10)** | **Nội dung câu hỏi** (`noi_dung`, tối đa 5000 ký tự), **Lĩnh vực PL** (`linh_vuc_id`), **Kênh tiếp nhận** (`kenh_tiep_nhan` ∈ `TRUC_TIEP` / `HE_THONG_KHAC`), và (tùy chọn) thông tin **DN / Người gửi / Email / SĐT / File đính kèm** | `linh_vuc_id` ← danh mục `LINH_VUC_PL` (FR-10 Quản trị); `doanh_nghiep_id` ← **FR-07 Doanh nghiệp** (dropdown có search) | SCR-II-01 Form thêm mới (Drawer) |
| `MOI` | `TIEP_NHAN` | `cb_nv_<cap>_01` | [Tiếp nhận] | Hệ thống tự tính **hạn xử lý** theo cấu hình `CAU_HINH_SLA` | `CAU_HINH_SLA` ← **FR-10 Quản trị** | SCR-II-02 |
| `TIEP_NHAN` | `DANG_XU_LY` | `cb_nv_<cap>_01` | **Phân công (UC15)** | **Người xử lý** (`nguoi_xu_ly_id`, bắt buộc), **Ghi chú** (`ghi_chu`, tùy chọn), **Thời hạn** (`thoi_han`, tùy chọn — mặc định lấy theo deadline SLA) | Bảng gợi ý người xử lý theo **auto-filter 4 tiêu chí FR-II-06 Step 5** (BA Q11 chốt 2026-05-07 — BỎ entity `CAU_HINH_PHAN_CONG` + FR-II-NEW-01):<br>• **(1) Lọc lĩnh vực** — TVV/CG match `linh_vuc_chuyen_mon`, NHT match `linh_vuc_ids[]`, CB NV bỏ qua filter<br>• **(2) Lọc đơn vị BR-AUTH-08** cùng cấp mạng lưới (TW/BN/ĐP)<br>• **(3) Sort `workload ASC`** (count HD đang xử lý của TK)<br>• **(4) `ho_ten ASC LIMIT 10`**<br>• Chỉ TK `HOAT_DONG` (TK lock disabled + tooltip — `ERR-PC-01`)<br>• Mỗi dòng hiển thị: Họ tên / Đơn vị / Lĩnh vực chuyên môn / **Workload hiện tại** (KHÔNG còn cột "Mức ưu tiên")<br>• Workload vượt ngưỡng → badge đỏ "Quá tải (N yêu cầu)" — **cảnh báo, KHÔNG chặn** (`WRN-PC-01`) | **SCR-II-03 Modal phân công** (overlay trên SCR-II-02) |
| `DANG_XU_LY` | `DA_TRA_LOI` | `tvv_01` / `nht_01` / `cb_nv_<cap>_01` | Tích "Đã trả lời" | **Nội dung phản hồi** (`noi_dung_phan_hoi`, không được rỗng — lỗi `ERR-PH-01`); user có thể chọn mẫu phản hồi soạn sẵn | Dropdown **Mẫu phản hồi** lấy từ `MAU_PHAN_HOI` (FR-10 Quản trị) | SCR-II-02 |
| `DA_TRA_LOI` | `CHO_PHE_DUYET` | System | **Auto (BR-FLOW-01)** | — | — | Auto |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Phê duyệt] | Cùng cấp với CB NV (BR-AUTH-05) | — | SCR-II-03 |
| `CHO_PHE_DUYET` | `DANG_XU_LY` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do_tu_choi` ≥10 ký tự (BR-FLOW-04) | — | SCR-II-03 |
| `DA_DUYET` | `CONG_KHAI` | `cb_nv_<cap>_01` / `cb_pd_<cap>_01` | [Công khai] | API push Cổng PLQG | — | SCR-II-03 |
| `CONG_KHAI` | `DA_DUYET` | `cb_nv_<cap>_01` | [Hủy công khai] | Gỡ API | — | SCR-II-03 |
| `DA_DUYET` / `CONG_KHAI` | `HOAN_THANH` | `cb_nv_<cap>_01` | [Đóng] | — | — | SCR-II-03 |
| `MOI` | `HUY` | `cb_nv_<cap>_01` | [Hủy yêu cầu] | **Guard: không có phản hồi đang soạn** | — | SCR-II-02 |

**Phụ feedback tự động:** Khi `DA_DUYET` → hệ thống auto tạo bản ghi `KHO_CAU_HOI` trong FR-13 (nguồn `TU_DONG`). Không cần thao tác tay.

---

<a id="toc-fr12"></a>
### ⑧ FR-12 · Tư vấn Chuyên sâu (Nhóm X.1)
**Login:**
- Tạo: DN (API inbound từ Cổng) hoặc `cb_nv_<cap>_01` nhập tay
- Phân công: `cb_nv_<cap>_01`
- Thực hiện: `cg_01`
- Duyệt: `cb_pd_<cap>_01`

**Màn hình xem chi tiết:**
- SCR-X1-01: Danh sách YC TV chuyên sâu
- SCR-X1-02: Chi tiết TVCS (5 accordion — gộp MH-12.4/12.5/12.6/12.7 v2.1)

**📑 Accordion SCR-X1-02 Chi tiết TVCS — 5 accordion:**

| Accordion | Entity + Filter | Data | Điều kiện hiển thị |
|-----------|-----------------|------|--------------------|
| **Thông tin cơ bản** | `TU_VAN_CHUYEN_SAU` (rename từ `NOI_DUNG_TU_VAN_CS` — FR-12 v3.5 Thay đổi 2) + join sang `DOANH_NGHIEP`, `TU_VAN_VIEN`, `DON_VI` (cơ quan tiếp nhận BR-ROUTE-TVCS-01 — FR-12 v3.5 Thay đổi 6), `HOP_DONG_TV` (link nhóm 14 — FR-12 v3.5 Thay đổi 13) | **Mã nội dung** (tự sinh), **Doanh nghiệp** (dropdown có search — khi chọn, hệ thống tự hiện MST / địa chỉ / người đại diện từ **FR-07 Doanh nghiệp**), **Chuyên gia** (dropdown lọc TVV đang `HOAT_DONG` rename từ `DANG_HOAT_DONG` theo FR-04 v3.5 từ **FR-04 CG/TVV** — khi chọn hiện chuyên môn / SĐT / email), **Lĩnh vực PL** (từ danh mục **FR-10 Quản trị**), **Cơ quan tiếp nhận** (`don_vi_id` — DN gửi từ Cổng chọn / mặc định Sở TP tỉnh DN, CB NV nhập tay = đơn vị CB đăng nhập — Thay đổi 6), **Ngày tư vấn**, **Ghi chú** (tối đa 2000 ký tự). ⚠️ **Bỏ field `hinh_thuc_tv` ở cấp Vụ việc** (FR-12 v3.5 Thay đổi 12 — đã move sang `PHIEN_TU_VAN.hinh_thuc`) | Luôn |
| **Nội dung tư vấn** | `TU_VAN_CHUYEN_SAU WHERE id=<current>` | **Nội dung tư vấn chi tiết** (soạn bằng **Rich Text Editor**, tối đa 50KB) + **Tóm tắt** (tối đa 500 ký tự) | Luôn |
| **Tư liệu PL liên kết** (UC152 — Quản lý tư liệu pháp lý của vụ việc, FR-X.1-06) | `TU_LIEU_PHAP_LY_VV WHERE noi_dung_tv_id=<current>` (entity §3.4.2 srs-v3.md:1025 — `Tư liệu pháp lý của vụ việc`) | Bảng tư liệu pháp lý gắn với nội dung TV — cột: **Tên** / **Loại** / **Trạng thái** (`NHAP` / `CONG_KHAI`) / **Số file** / **Hành động** + nút [+ Thêm tư liệu] thao tác inline | Luôn |
| **Đánh giá chất lượng** (UC153 — Tiếp nhận đánh giá chất lượng TV với CG, FR-X.1-07) | `DANH_GIA_CHAT_LUONG_TV WHERE tu_van_cs_id=<current>` (entity §3.4.2 srs-v3.md:1026 — `Đánh giá chất lượng tư vấn với chuyên gia`) | Bảng đánh giá DN — cột: **Mã ĐG** / **Điểm** (thang 1-5 sao) / **Nhận xét DN** / **Ngày đánh giá**. Hiển thị thêm **Điểm trung bình** + **Tổng số lượt đánh giá**. Dữ liệu đến từ **API nhận từ Cổng PLQG** (DN đánh giá ngay trên Cổng) | Chỉ hiển thị ở chế độ "Xem chi tiết" |
| **Nhật ký thao tác** | `AUDIT_LOG WHERE entity='TU_VAN_CHUYEN_SAU' AND entity_id=<current>` (rename entity per FR-12 v3.5 Thay đổi 2) | Timeline các thao tác: `dd/mm/yyyy HH:mm` · Người thực hiện · Hành động (bao gồm cả chuyển trạng thái + thao tác CUD — tạo/sửa/xóa + công khai/hủy công khai per BR-PUBLIC-01/02/03) | Chỉ hiển thị ở chế độ "Xem chi tiết" |

**Action buttons theo trạng thái (action-bar cố định):**
- `TIEP_NHAN`: [Hủy] [Lưu] [Phân công CG →]
- `PHAN_CONG`: [Hủy YC] + (CG được phân công: [Chấp nhận] [Từ chối])
- `DANG_TU_VAN`: [Hủy] [Lưu]
- `HOAN_THANH`: [Trình phê duyệt]
- `CHO_PHE_DUYET`: [Phê duyệt] [Từ chối] (CB PD cùng cấp)
- `DA_DUYET`: Read-only

**Xem chi tiết cần dữ liệu từ:**
- **FR-07 Doanh nghiệp** → `DOANH_NGHIEP` (hệ thống upsert theo `ma_so_thue` khi nhận API)
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (dropdown chọn chuyên gia phân công)
- **FR-10 Quản trị** → danh mục Lĩnh vực PL

**🖐️ Nhập tay:** ✅ **Có — UC147 "Quản lý nội dung tư vấn với chuyên gia"** tại **SCR-X1-01 / SCR-X1-02**:
- CB NV chủ động tạo mới YC TV chuyên sâu (chọn DN, Chuyên gia, Lĩnh vực, nội dung)
- Song song với **UC149** (API inbound từ Cổng PLQG — không có màn hình)
- Lỗi ERR-TVCS-02 nếu chọn Chuyên gia `NGUNG_HOAT_DONG` → cần đảm bảo CG ở state `HOAT_DONG` (FR-04 v3.5 — rename từ `DANG_HOAT_DONG`)

**Transition (SM-TVCS):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `TIEP_NHAN` | DN | **Gửi YC qua Cổng PLQG (UC149, API nhận)** | **Mã số thuế** (`ma_so_thue`), **Nội dung yêu cầu**, **Lĩnh vực PL**, **File đính kèm** (hệ thống tự giải mã + quét virus) | — | API nhận từ ngoài |
| — | `TIEP_NHAN` | `cb_nv_<cap>_01` | **🖐️ Thêm thủ công (UC147)** | **DN** (`doanh_nghiep_id`, bắt buộc), **Chuyên gia** (`chuyen_gia_id`, bắt buộc), **Lĩnh vực PL** (`linh_vuc_id`, bắt buộc), **Nội dung tư vấn** (`noi_dung_tu_van`, Rich Text, tối đa 50KB), **Tóm tắt** (`tom_tat`, tối đa 500 ký tự), **Ngày tư vấn** (`ngay_tu_van`, bắt buộc), **Ghi chú** (`ghi_chu`, tối đa 2000 ký tự) | `doanh_nghiep_id` ← **FR-07 Doanh nghiệp** (dropdown có search — khi chọn hệ thống tự hiện MST / địa chỉ / người đại diện)<br>`chuyen_gia_id` ← **FR-04 CG/TVV**, lọc `trang_thai=HOAT_DONG` (v3.5 rename từ `DANG_HOAT_DONG`; nếu CG đã ngừng → lỗi `ERR-TVCS-02`)<br>`linh_vuc_id` ← danh mục **FR-10 Quản trị** | SCR-X1-02 Accordion "Thông tin cơ bản" |
| `TIEP_NHAN` | `PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công CG (UC147 — action Phân công)** | **Chuyên gia** (`chuyen_gia_id`) + **Ghi chú** + **Thông tin SLA** hiển thị | Dropdown chọn CG từ `TU_VAN_VIEN` với:<br>• Chỉ lấy CG đang `HOAT_DONG` (v3.5 rename từ `DANG_HOAT_DONG`)<br>• Hệ thống **gợi ý Top 5** CG khớp lĩnh vực<br>• Thứ tự sắp xếp: **điểm đánh giá TB giảm dần → workload tăng dần**<br>• Có **thanh search** để tìm thủ công<br>• Hiển thị banner thông báo: SLA 2 ngày làm việc để CG xác nhận tham gia | SCR-X1-02 modal overlay Phân công CG |
| `PHAN_CONG` | `DANG_TU_VAN` | `cg_01` | [Chấp nhận] | — | — | SCR-X1-02 (thanh hành động khi user là CG được phân công) |
| `PHAN_CONG` | `TIEP_NHAN` | `cg_01` | [Từ chối] | Lý do | — | SCR-X1-02 (quay lại chọn CG khác) |
| `PHAN_CONG` | — (banner cảnh báo) | System | **Auto: CG không phản hồi quá 2 ngày LV** | — | — | Banner trên SCR-X1-02 |
| `DANG_TU_VAN` | `HOAN_THANH` | `cg_01` | Tích "Hoàn thành" | Guard: có ≥1 VB TVPL (file) | — | SCR-X1-02 |
| `HOAN_THANH` | `CHO_PHE_DUYET` | System | **Auto (BR-FLOW-01)** | — | — | Auto |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Phê duyệt] | Cùng cấp (BR-AUTH-05) + ghi chú optional | — | SCR-X1-02 modal xác nhận |
| `CHO_PHE_DUYET` | `DANG_TU_VAN` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do` ≥10 ký tự (BR-FLOW-04) | — | SCR-X1-02 modal lý do |
| `PHAN_CONG` | `HUY` | `cb_nv_<cap>_01` | [Hủy yêu cầu] | Guard: CG chưa xác nhận | — | SCR-X1-02 |
| `DANG_TU_VAN` | `HUY` | `cb_nv_<cap>_01` | Hủy | Guard: DN yêu cầu hủy **+ CB PD cùng cấp duyệt** | — | SCR-X1-02 |

**Công khai tư liệu pháp lý đính kèm (BR-FLOW-07):** Tab "Tư liệu PL" trong SCR-X1-02 Accordion. CB NV CRUD tư liệu inline. Khi trạng thái tư liệu `NHAP` + có ≥1 file → nút [Công khai lên Cổng PLQG] available → push API FR-XII — **KHÔNG cần phê duyệt thêm**.

**Công khai tư liệu đính kèm (BR-FLOW-07):** CB NV chủ động chọn "Công khai" trên từng file — KHÔNG cần phê duyệt thêm. Chỉ check: có ≥1 file.

---

<a id="toc-fr03"></a>
### ⑨ FR-03 · Đào tạo & Tập huấn (Nhóm III)
**Login:**
- Tạo CT + Khóa học: `cb_nv_<cap>_01`
- Duyệt: `cb_pd_<cap>_01` (cùng cấp)
- Học viên (TVV/cán bộ DN): đăng ký qua Cổng

**Màn hình xem chi tiết (5 màn hình theo srs-fr-03 §3 dòng 1148-1186, sub-menu 1..4):**
- SCR-III-01: **Chương trình Đào tạo (sub-menu 1)** — danh sách CTĐT expandable rows + Tab "Đề xuất" (gộp MH-03.7) + workflow gửi duyệt/phê duyệt/công khai (gộp MH-03.8). FR sử dụng: FR-III-01 (Quản lý CTĐT, UC20), FR-III-02 (Tìm kiếm CTĐT), FR-III-03 (Quản lý đăng ký, UC22), FR-III-04 (Đăng ký tham gia, UC23), FR-III-13 (Đề xuất đào tạo, UC32), FR-III-14..16 (Lập KH/Phê duyệt/Công khai, UC33-35)
- SCR-III-02: **Chi tiết Khóa học (drill-down từ SCR-III-01)** — 6 tabs: Thông tin / Học viên / Lịch học & Điểm danh / Kết quả kiểm tra / Chứng nhận / Bài giảng đã gắn. FR sử dụng: FR-III-01, FR-III-05 (Quản lý khóa học), FR-III-06 (Tìm kiếm khóa học), FR-III-17 (Ghi nhận kết quả, UC36), FR-III-18 (Phê duyệt kết quả, UC37), FR-III-19 (Công bố kết quả + chứng nhận, UC38)
- SCR-III-03: **Kho Tài liệu / Bài giảng (sub-menu 2)** — danh sách + preview panel, 3 loại (Slide PPTX / PDF / Video YouTube), switch công khai. FR sử dụng: FR-III-07 (Quản lý bài giảng), FR-III-08 (Tìm kiếm bài giảng)
- SCR-III-04: **Ngân hàng Câu hỏi & Đề Kiểm tra (sub-menu 3)** — 2 tabs (Câu hỏi / Đề kiểm tra). FR sử dụng: FR-III-09 (Quản lý ngân hàng câu hỏi), FR-III-10 (Quản lý đề kiểm tra), FR-III-NEW-01..03 (3 FR mới v2.1)
- SCR-III-05: **Giảng viên / Trợ giảng (sub-menu 4)** — danh sách + chi tiết 2 tab (Thông tin / Lịch sử giảng dạy). FR sử dụng: FR-III-11 (Quản lý giảng viên), FR-III-12 (Tìm kiếm giảng viên)

**📑 Tabs SCR-III-01 CTĐT — 2 tab chính:**

| Tab | Entity filter | Data | Điều kiện hiển thị |
|-----|---------------|------|--------------------|
| Danh sách CTĐT | Danh sách chương trình đào tạo (`CHUONG_TRINH_DAO_TAO`) đã lọc theo phạm vi đơn vị (quy tắc `BR-AUTH-08`) | Mỗi dòng CTĐT có thể mở rộng (expandable) để hiện danh sách các Khóa học con bên trong (`KHOA_HOC WHERE ctdt_id=<row.id>`) | Luôn |
| Đề xuất đào tạo (v2.1 gộp MH-03.7, UC32 FR-III-13) | Danh sách đề xuất đang mở: `DE_XUAT_DAO_TAO` (§3.4.3.27) lọc theo `trang_thai IN ('MOI', 'DA_TIEP_NHAN', 'DA_THUC_HIEN')` | Đề xuất đào tạo do DN hoặc NHT gửi lên, gồm các trường: **Lĩnh vực PL** (`linh_vuc_id`), **Nội dung đề xuất** (`noi_dung`), **Thời gian mong muốn** (`thoi_gian_mong_muon`), **Địa điểm mong muốn** (`dia_diem_mong_muon`), **Số lượng học viên dự kiến** (`so_luong_du_kien`) | Hiển thị ở mọi cấp (TW/BN/ĐP) để CB NV các cấp đều tiếp nhận được, không chỉ TW |

**📑 Tabs SCR-III-02 Chi tiết Khóa học — 6 tab:**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Thông tin** | `KHOA_HOC WHERE id=<current>` | **Mã khóa học**, **Tên khóa học**, **CTĐT cha** (dropdown lọc CTĐT đã ở trạng thái `DA_DUYET`), **Hình thức** (`TRUC_TUYEN` / `TRUC_TIEP`), **Ngày bắt đầu / kết thúc**, **Địa điểm** (nếu offline) hoặc **Link Zoom** (nếu online), **Số lượng học viên tối đa**, **Lĩnh vực PL**, **Ngân sách** | Luôn hiển thị. Chỉ cho sửa khi khóa học ở trạng thái `DU_THAO` |
| **Học viên** | `DANG_KY_DAO_TAO WHERE khoa_hoc_id=<current>` | Danh sách học viên — cột: **Họ tên**, **MST DN** (DN cử học viên đi), **Đơn vị**, **Trạng thái phê duyệt** (`CHO_DUYET` / `DA_DUYET` / `TU_CHOI`). Có nút [+ Thêm thủ công] để CB NV thêm HV không qua Cổng | Luôn |
| **Lịch học & Điểm danh** | `KET_QUA_DAO_TAO WHERE khoa_hoc_id=<current>` | Bảng điểm danh từng buổi học (trạng thái **Có mặt** / **Vắng mặt**) + **Tỷ lệ chuyên cần** (% tự tính) | Luôn hiển thị. Chỉ cho sửa khi khóa học đang ở `DANG_DIEN_RA` |
| **KQ kiểm tra** | `KET_QUA_DAO_TAO WHERE khoa_hoc_id=<current>` (§3.4.3.23) + join `DE_KIEM_TRA` (§3.4.3.22, qua khóa `de_kiem_tra_id`) | **Điểm kiểm tra** (`diem_kiem_tra`, thang 0-10), **Xếp loại** (`xep_loai` ∈ `DAT` / `KHONG_DAT` / `GIOI` / `KHA` / `TRUNG_BINH`), **Nhận xét** (`nhan_xet`), **Trạng thái kết quả** (`trang_thai` ∈ `CHUA_NHAP` / `DA_NHAP` / `CHO_DUYET` / `DA_DUYET` / `TU_CHOI`) | Luôn hiển thị. Chỉ cho sửa khi khóa học đã ở `DA_KET_THUC` |
| **Chứng nhận** | `CHUNG_NHAN WHERE khoa_hoc_id=<current> AND xep_loai='DAT'` | Thông tin cấp chứng nhận điện tử (file PDF) cho các học viên đạt kết quả | **Chỉ hiển thị khi khóa học đã ở `HOAN_THANH`** (sau khi duyệt kết quả) |
| **Bài giảng** | `BAI_GIANG WHERE khoa_hoc_id=<current>` (§3.4.3.20, quan hệ 1-N trực tiếp, không có bảng junction) | **Tên bài giảng** (`ten_bai_giang`), **Loại** (`loai` ∈ `SLIDE` / `PDF` / `VIDEO` / `TAI_LIEU_KHAC`), **File đính kèm** (`duong_dan_file`, ≤20MB), **Link video** (`link_video`, YouTube), **Thứ tự** (`thu_tu`), **Công khai** (`cong_khai`), **Lĩnh vực PL áp dụng** (`linh_vuc_ids`, JSON array) | Luôn |

**Xem chi tiết cần dữ liệu từ:**
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (TVV đóng vai trò giảng viên)
- **FR-10 Quản trị** → danh mục Lĩnh vực PL, Hình thức tập huấn
- **FR-10 Quản trị** → `TAI_KHOAN` (chọn `nguoi_phe_duyet_id`)
- **Dữ liệu nội bộ của FR-03**: `CHUONG_TRINH_DAO_TAO` (§3.4.3.19) → `KHOA_HOC` (§3.4.3.6) → `BAI_GIANG` (§3.4.3.20) → `NGAN_HANG_CAU_HOI` (§3.4.3.21) → `DE_KIEM_TRA` (§3.4.3.22) → `KET_QUA_DAO_TAO` (§3.4.3.23) → `CHUNG_NHAN` (§3.4.3.24); đăng ký học viên qua `DANG_KY_DAO_TAO` (§3.4.3.26); giảng viên qua `GIANG_VIEN` (§3.4.3.25)

**🖐️ Nhập tay:** ✅ **Có — toàn bộ CRUD do CB NV nhập tay:**
- CTĐT + đăng ký HV (SCR-III-01 Chương trình Đào tạo), Khóa học + Học viên + KQ + Chứng nhận (SCR-III-02 Chi tiết Khóa học), Bài giảng (SCR-III-03 Kho Tài liệu / Bài giảng), Ngân hàng câu hỏi + Đề kiểm tra (SCR-III-04 Ngân hàng Câu hỏi & Đề KT), Giảng viên (SCR-III-05 Giảng viên / Trợ giảng) — tất cả manual
- Học viên đăng ký: qua Cổng PLQG (DN submit) HOẶC CB NV thêm thủ công từ SCR-III-02 tab "Học viên"
- Không có kênh API inbound

**Transition Khóa học (SM-KHOAHOC — 9 trạng thái):**

> ⚠️ **Lưu ý mâu thuẫn nội bộ SRS (SM-KHOAHOC):** State `DA_CONG_KHAI` có trong DB ENUM (srs-v3.md §3.4.3.6 dòng 1373) và là guard cho FR-III-04 PRE-02 ("Khóa học đang mở đăng ký — trạng thái DA_CONG_KHAI"), nhưng bảng State Transition Table tại Phụ lục C.2 (srs-v3.md dòng 4178-4193) **bỏ sót** transition dẫn đến state này (diagram skip thẳng `DA_DUYET → DANG_DIEN_RA`). Theo logic nghiệp vụ + schema (`la_cong_khai` flag), transition đúng: `DA_DUYET → DA_CONG_KHAI` do CB NV kích hoạt. Test plan cần ghi nhận mâu thuẫn này và xác nhận với BA.

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `DU_THAO` | `cb_nv_<cap>_01` | **🖐️ Tạo KH thủ công** | **Tên khóa học** (`ten_khoa_hoc`, bắt buộc), **CTĐT cha** (`ctdt_id`, bắt buộc), **Hình thức** (`hinh_thuc` ∈ `TRUC_TUYEN` / `TRUC_TIEP`, bắt buộc), **Ngày bắt đầu** (`ngay_bat_dau`, bắt buộc), **Ngày kết thúc** (`ngay_ket_thuc`, phải > ngày bắt đầu), **Số lượng HV tối đa** (`so_luong_toi_da`, ≥1), **Bài giảng** (`bai_giang_ids`, chọn nhiều), **Lĩnh vực PL** (`linh_vuc_id`) | `ctdt_id` ← dữ liệu nội bộ FR-03, dropdown chỉ lấy CTĐT đã `DA_DUYET` (không cho chọn CTĐT đang `DU_THAO`)<br>`bai_giang_ids` ← kho `BAI_GIANG` nội bộ FR-03<br>`linh_vuc_id` ← danh mục **FR-10 Quản trị**<br>**Giảng viên** chọn từ `TU_VAN_VIEN` (**FR-04 CG/TVV**), lọc `trang_thai=HOAT_DONG` (v3.5 rename từ `DANG_HOAT_DONG`) | SCR-III-02 Tab Thông tin |
| `DU_THAO` | `CHO_DUYET` | `cb_nv_<cap>_01` | [Gửi duyệt] | Guard: có ≥1 bài giảng | — | SCR-III-02 |
| `CHO_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] | Cùng cấp (BR-AUTH-05) | — | SCR-III-02 |
| `CHO_DUYET` | `DU_THAO` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do` ≥10 ký tự | — | SCR-III-02 |
| `DA_DUYET` | `DANG_DIEN_RA` | System / `cb_nv_<cap>_01` | **Auto khi đến `ngay_bat_dau`** | Auto | — | Auto |
| — (`DANG_DIEN_RA`) | — (học viên tham gia) | `cb_nv_<cap>_01` | **🖐️ Thêm học viên thủ công** (hoặc DN tự đăng ký qua Cổng) | `ma_so_thue`, `ho_ten_hoc_vien`, email, SĐT | **DN học viên ← FR-07**; có thể thêm tay ngoài list DN | SCR-III-02 Tab "Học viên" |
| `DANG_DIEN_RA` | `DA_KET_THUC` | System / `cb_nv_<cap>_01` | **Auto khi qua `ngay_ket_thuc`** | Auto | — | Auto |
| `DA_KET_THUC` | `CHO_DUYET_KQ` | `cb_nv_<cap>_01` | [Trình KQ] | Điểm danh + điểm bài kiểm tra + chứng nhận | Bài kiểm tra nội bộ FR-03 NGAN_HANG_CAU_HOI | SCR-III-02 tabs 3-5 |
| `CHO_DUYET_KQ` | `DA_CONG_KHAI` | `cb_pd_<cap>_01` | [Duyệt + Công khai] | Toggle `la_cong_khai` | — | SCR-III-02 |
| `DA_CONG_KHAI` | `HOAN_THANH` | `cb_nv_<cap>_01` | Đóng | — | — | SCR-III-02 |
| Any (trừ đã công khai) | `HUY` | `cb_nv_<cap>_01` | Guard: chưa có học viên / chưa diễn ra | Lý do | — | SCR-III-02 |

---

<a id="toc-lop4"></a>
## LỚP 4 — GIAO DỊCH PHÁI SINH (cần dữ liệu LỚP 3)

<a id="toc-fr14"></a>
### ⑩ FR-14 · Hợp đồng Tư vấn (Nhóm X.3)
**Login:** `cb_nv_<cap>_01` tạo + sửa.

**Màn hình xem chi tiết:**
- SCR-X3-01: Danh sách HĐ (thanh lọc UC163e) + Form Thêm/Sửa (5 accordion)
- Truy cập **embedded drawer/modal** từ:
  - Chi tiết VV (SCR-V.I-03) → accordion "HĐ tư vấn liên kết"
  - Chi tiết TVV (SCR-IV-03) → tab "Lịch sử hỗ trợ" → HĐ

**📑 Accordion SCR-X3-01 Form Thêm/Sửa HĐ — 5 accordion:**

| Accordion | Entity + Filter | Data | Điều kiện hiển thị |
|-----------|-----------------|------|--------------------|
| **Thông tin chung** | Chính bản ghi HĐ: `HOP_DONG_TU_VAN` | **Mã HĐ** (tự sinh dạng `HDTV-YYYYMMDD-SEQ`), **Tên HĐ**, **Bên A** (hệ thống tự điền từ `don_vi_id` của user login), **Bên B** (nhập tay + dropdown chọn TVV), **Giá trị HĐ** (kiểu money), **Thời hạn bắt đầu / kết thúc**, **Nội dung**, **Ghi chú**, **File HĐ đính kèm** | Luôn |
| **Vụ việc liên kết** | `VU_VIEC WHERE hop_dong_tv_id=<current>` (quan hệ N-N) | Bảng VV gắn với HĐ — cột: **Mã VV** / **Tên DN** / **Lĩnh vực** / **Trạng thái** + nút [Bỏ liên kết]. Nút [+ Liên kết VV] mở modal **multi-select** chọn VV từ **FR-05 Vụ việc**, có lọc theo quy tắc `BR-AUTH-08` (chỉ hiện VV thuộc đơn vị của user) | Luôn (tại form Thêm/Sửa) |
| **Mốc tiến độ** | Lưu trong cột JSON array `moc_tien_do` trên `HOP_DONG_TU_VAN` | Bảng sửa inline — cột: **Tên mốc** / **Ngày dự kiến** / **Ngày thực tế** / **Trạng thái mốc** (`CHUA_BAT_DAU` / `DANG_THUC_HIEN` / `HOAN_THANH`) + nút [+ Thêm mốc] | Luôn |
| **Thanh toán giai đoạn** | Lưu trong cột JSON array `thanh_toan_giai_doan` trên `HOP_DONG_TU_VAN` | Bảng sửa inline — cột: **Giai đoạn** / **Số tiền** / **Ngày thanh toán** / **Trạng thái** (`CHUA_THANH_TOAN` / `DA_THANH_TOAN`). **Ràng buộc validate:** tổng `so_tien` các giai đoạn phải ≤ `gia_tri` HĐ + thanh progress bar hiển thị % đã thanh toán | Luôn |
| **Nhật ký** | `AUDIT_LOG WHERE entity='HOP_DONG_TU_VAN' AND entity_id=<current>` | Timeline thao tác CUD (tạo/sửa/xóa) + thay đổi mốc tiến độ / thanh toán / liên kết VV | Luôn |

**Xem chi tiết cần dữ liệu từ:**
- **FR-05 Vụ việc** → `VU_VIEC` (gắn qua `vu_viec_ids`, quan hệ N-N — 1 HĐ có thể liên kết nhiều VV)
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (chọn `tvv_id` cho Bên B)
- **FR-10 Quản trị** → cây Đơn vị `DON_VI` (Bên A tự lấy từ đơn vị của user login)

**🖐️ Nhập tay:** ✅ **Có** — CB NV nhập tay toàn bộ HĐ tại SCR-X3-01 hoặc từ embedded drawer trong chi tiết VV/TVV. Không có API inbound. Có thể upload nhiều file đính kèm.

**Transition (đơn giản, không có phê duyệt — 4 state theo srs-v3 §3.4.3.13):**

> ⚠️ **TODO (UNVERIFIED):** SRS không có section SM-HOPDONG trong Phụ lục C — chỉ có enum 4 giá trị `{DANG_THUC_HIEN, HOAN_THANH, HUY, TAM_DUNG}` (default `DANG_THUC_HIEN`). Flow transition chi tiết dưới đây là suy luận từ enum + action bar, cần CĐT clarify.

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `DANG_THUC_HIEN` | `cb_nv_<cap>_01` | **🖐️ Tạo HĐ thủ công (UC163)** — mặc định vào thẳng `DANG_THUC_HIEN` | Nhập 12 trường qua 4 accordion: **Thông tin chung** + **Vụ việc liên kết** + **Mốc tiến độ** + **Thanh toán giai đoạn** | `tvv_id` ← **FR-04 CG/TVV**, lọc `trang_thai=HOAT_DONG` (v3.5 rename từ `DANG_HOAT_DONG`)<br>`vu_viec_ids` ← **FR-05 Vụ việc** qua modal multi-select, lọc theo `BR-AUTH-08` (chỉ VV thuộc đơn vị của user)<br>`ben_a` hệ thống tự điền từ `don_vi_id` của user | SCR-X3-01 Form |
| `DANG_THUC_HIEN` | `TAM_DUNG` | `cb_nv_<cap>_01` | Tạm dừng HĐ | Lý do | — | SCR-X3-01 |
| `TAM_DUNG` | `DANG_THUC_HIEN` | `cb_nv_<cap>_01` | Tiếp tục | — | — | SCR-X3-01 |
| `DANG_THUC_HIEN` | `HOAN_THANH` | `cb_nv_<cap>_01` | Đóng HĐ | Guard: `SUM(thanh_toan_giai_doan.so_tien) ≤ gia_tri` | Inline validation JSON array | SCR-X3-01 Accordion "Thanh toán giai đoạn" |
| `DANG_THUC_HIEN` / `TAM_DUNG` | `HUY` | `cb_nv_<cap>_01` | Hủy HĐ | Lý do | — | SCR-X3-01 |

**Đầu ra:** `hop_dong_tv_id` (+ `so_hop_dong_tvpl` + `ngay_hop_dong`) điền vào hồ sơ Chi trả FR-06.

---

<a id="toc-fr06"></a>
### ⑪ FR-06 · Chi trả Chi phí (Nhóm V.II)
**Login:**
- Tạo: DN nộp Mẫu 01 NĐ55 qua DVC → API inbound auto
- Tiếp nhận / đánh giá mức HT / thẩm định chứng từ: `cb_nv_<cap>_01`
- Duyệt cuối: `cb_pd_<cap>_01`
- Cập nhật thanh toán: `cb_nv_<cap>_01`

**Màn hình xem chi tiết:**
- SCR-V.II-01: Danh sách hồ sơ chi trả
- SCR-V.II-02: Chi tiết hồ sơ (8 section — progressive disclose theo SM-CHITRA)

**📑 Section SCR-V.II-02 Chi tiết Hồ sơ Chi trả — 8 section:** *(Update 2026-05-06 v3.5 — đồng bộ entity tên chuẩn `THAM_DINH_HO_SO` + `PHE_DUYET_CHI_TRA` + 9 fields lifecycle HSCT)*

| Section | Entity + Filter | Data | Điều kiện hiển thị |
|---------|-----------------|------|--------------------|
| **Thông tin DN** (read-only) | DN nộp hồ sơ: `DOANH_NGHIEP WHERE id=<ho_so.doanh_nghiep_id>` | Tên DN, MST, địa chỉ, loại DN, **Quy mô DN** (badge nhãn Việt "Siêu nhỏ"/"Nhỏ"/"Vừa" map từ enum `quy_mo_dn` — quyết định mức hỗ trợ theo `BR-CALC-01`), người đại diện. Dữ liệu tự động lấy từ payload DVC gửi sang | Luôn |
| **Thông tin tư vấn** (read-only) | `VU_VIEC WHERE id=<ho_so.vu_viec_id>` + join `TU_VAN_VIEN` + `HOP_DONG_TU_VAN` | **Vướng mắc** (mô tả VV gốc lấy từ **FR-05 Vụ việc**), **Tên TVV**, **Phí tư vấn** (>0), **Số tiền DN đề nghị chi trả** (`so_tien_de_nghi`>0), **Số HĐ tư vấn** (lấy từ **FR-14 Hợp đồng**) | Luôn |
| **Kiểm tra Hồ sơ** | Field trong `HO_SO_CHI_TRA`: `bo_sung_count`, `ngay_yeu_cau_bo_sung`, `ly_do_tu_choi` | Checklist 18 trường theo Mẫu 01 NĐ55 (mỗi trường tick Đạt / Không đạt), Radio kết quả 3 lựa chọn ("Đạt" / "Yêu cầu bổ sung" / "Không đạt"), ô **Lý do** (bắt buộc khi ≠ "Đạt"), **Đếm lần bổ sung "{n}/3"** (highlight đỏ ≥2 lần) — `bo_sung_count` CHECK 0-3, hành vi lần 4 chờ BA Q1 | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_KIEM_TRA` |
| **Đánh giá Tiêu chí** | `DANH_GIA_HO_SO_CHI_TRA WHERE ho_so_id=<current>` | **Mức hỗ trợ (%)** (`muc_ho_tro_phan_tram` auto-calc) — áp dụng `BR-CALC-01` theo quy mô DN, **Trần hỗ trợ/năm** (`tran_ho_tro_nam`), **Đã chi trong năm** (`da_chi_trong_nam`), **Số tiền được duyệt** (auto-calc theo `BR-CALC-02`: `MIN(so_tien_de_nghi, phi_tu_van × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)`), **Ghi chú đánh giá** | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_DANH_GIA` |
| **Thẩm định** | `THAM_DINH_HO_SO WHERE ho_so_chi_tra_id=<current>` (1:1, **entity owned mới v3.5**) | Checklist 4 mục đối chiếu (số liệu / phí TV / quy mô / trần năm), Radio kết quả ("Đạt" / "Không đạt"), ô **Lý do không đạt** (bắt buộc khi `KHONG_DAT`), **Số tiền đề xuất**, nút [Trình phê duyệt] | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_THAM_DINH` |
| **Phê duyệt** | `PHE_DUYET_CHI_TRA WHERE ho_so_chi_tra_id=<current>` (N:1, **entity owned mới v3.5** — cho phép nhiều bản ghi nếu CB PD trả về nhiều lần) | Tóm tắt số tiền được duyệt + 2 nút action: **[Phê duyệt]** (DUYET → DA_DUYET) / **[Từ chối — trả về thẩm định]** (TU_CHOI → DANG_THAM_DINH, lý do ≥10 ký tự BR-FLOW-04). **CHỈ CB PD cùng cấp** (`user.don_vi_id = hs.don_vi_id`, BR-AUTH-05) mới action được | Chỉ hiển thị khi hồ sơ ở trạng thái `CHO_PHE_DUYET` |
| **Cập nhật Thanh toán** | `HO_SO_CHI_TRA` | **Số tiền thực chi** (`so_tien_thuc_tra` >0 và ≤ `so_tien_duoc_duyet` BR-EC-22), **Ngày thanh toán** (`ngay_thanh_toan`), **Số biên nhận** (`so_bien_nhan`), **Ghi chú thanh toán**. Nếu Kho bạc không chuyển → ghi `ly_do_tu_choi = "THANH_TOAN: " + ly_do` → DA_DUYET → TU_CHOI | Chỉ hiển thị khi hồ sơ ở trạng thái `DA_DUYET` |
| **Lịch sử + Timeline** | `AUDIT_LOG WHERE entity='HO_SO_CHI_TRA' AND entity_id=<current>` + lifecycle fields HSCT | "Ngày tiếp nhận"/"Người tiếp nhận", "Thời gian phê duyệt"/"Người phê duyệt", "Thời gian từ chối"/"Người từ chối", "Lý do từ chối", "Lý do hủy"; danh sách bản ghi `PHE_DUYET_CHI_TRA` (mọi lần CB PD trả về); timeline audit log | Luôn |

**Xem chi tiết cần dữ liệu từ:**
- **FR-05 Vụ việc** → `VU_VIEC` ở trạng thái `HOAN_THANH` (bắt buộc — không có VV hoàn thành thì không tạo được hồ sơ chi trả)
- **FR-07 Doanh nghiệp** → `DOANH_NGHIEP` (để xác định quy mô DN → quyết định mức hỗ trợ theo `BR-CALC-01`)
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (TVV đã xử lý VV gốc)
- **FR-14 Hợp đồng** → `HOP_DONG_TU_VAN` (số HĐ + giá trị tư vấn)
- **FR-10 Quản trị** → `CAU_HINH_SLA` (để lấy `bo_sung_timeout` — hạn bổ sung hồ sơ)

**🖐️ Nhập tay:** ❌ **KHÔNG — Đây là module DUY NHẤT không cho CB NV tạo hồ sơ thủ công.**
- **Nguồn duy nhất: DVC qua LGSP** (UC68 — API inbound).
- Entity `HO_SO_CHI_TRA` **không có** trường `kenh_tiep_nhan` như các module khác (chỉ có `ma_ho_so_dvc` để đối chiếu).
- **Hệ quả QA:** Muốn test FR-06, phải có mock DVC/LGSP gửi request vào — hoặc backend team tạo dữ liệu trực tiếp trong DB. Không có UI để tạo hồ sơ từ đầu.
- CB NV chỉ bắt đầu can thiệp từ trạng thái `CHO_TIEP_NHAN` (đã có sẵn từ DVC) → các bước tiếp nhận/đánh giá/thẩm định/trình duyệt phía sau vẫn thao tác tay bình thường.

**Transition (SM-CHITRA — 14 transition v3.5):** *(Update 2026-05-06 — đồng bộ enum 10 trạng thái + sub-flow [GAP-V.II-01/02/03] + CB PD trả về DANG_THAM_DINH + bỏ row auto-từ-chối Thay đổi 5 OUT)*

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `CHO_TIEP_NHAN` | DN qua DVC | **FR-V.II-01 — Nộp Mẫu 01 NĐ55 qua DVC** — **NGUỒN DUY NHẤT** | Mẫu 01 gồm 18 trường: **Mã hồ sơ DVC** (`ma_ho_so_dvc` UNIQUE — idempotent ERR-CT-02 HTTP 409), **MST** (`ma_so_thue`), **VV gốc** (`vu_viec_id`), **Phí tư vấn** (`phi_tu_van`>0), **Số tiền đề nghị** (`so_tien_de_nghi`>0), chứng từ. JWT + mTLS (BR-AUTH-09). Auto-gen `CT-{YYYYMMDD}-{SEQ}` (BR-DATA-04) | — | API inbound LGSP (❌ **KHÔNG có màn nhập tay trong CMS**) |
| `CHO_TIEP_NHAN` | `DANG_KIEM_TRA` | `cb_nv_<cap>_01` | **FR-V.II-02 [Tiếp nhận] `[GAP-V.II-02]`** | Hệ thống ghi `ngay_tiep_nhan = NOW()`, `nguoi_tiep_nhan_id = current_user.id`. Tự điền `vu_viec_id`/`doanh_nghiep_id`/`tu_van_vien_id` từ Mẫu 01 (FK validate sang FR-05/07/04) | — | SCR-V.II-02 |
| `CHO_TIEP_NHAN` | `HUY` | DN qua DVC / `cb_nv_<cap>_01` hủy hộ | **FR-V.II-02 [Rút hồ sơ] `[GAP-V.II-03]`** — chỉ rút khi chưa qua `DANG_DANH_GIA` | Ghi `ly_do_huy = 'DN_RUT_HO_SO'`, TB CB NV nếu đã gán. ERR-CT-RUT-01 nếu ngoài state cho phép | — | API inbound DVC / SCR-V.II-02 |
| `DANG_KIEM_TRA` | `DANG_DANH_GIA` | `cb_nv_<cap>_01` | **FR-V.II-03** Đạt checklist | Tick checklist 18 trường + Radio "Đạt" | — | SCR-V.II-02 section Kiểm tra |
| `DANG_KIEM_TRA` | `YEU_CAU_BO_SUNG` | `cb_nv_<cap>_01` | **FR-V.II-03** Cần bổ sung | Lý do (bắt buộc, ERR-CT-KT-02) + danh sách thiếu. Ghi `ngay_yeu_cau_bo_sung = NOW()`, `bo_sung_count++` (CHECK 0-3). TB DN qua DVC (FR-V.II-04 outbound) | — | SCR-V.II-02 section Kiểm tra |
| `DANG_KIEM_TRA` | `TU_CHOI` | `cb_nv_<cap>_01` | **FR-V.II-03** Không đạt | Lý do bắt buộc. Ghi `ly_do_tu_choi`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id` | — | SCR-V.II-02 section Kiểm tra |
| `YEU_CAU_BO_SUNG` | `DANG_KIEM_TRA` | DN qua DVC/Cổng PLQG hoặc `cb_nv_<cap>_01` thủ công | **FR-V.II-14 `[GAP-V.II-01]`** Bổ sung HS | `file_bo_sung[]` (PDF/DOC/DOCX/JPG/PNG ≤10MB) + `ghi_chu`. Guard: ≤5 ngày LV kể từ `ngay_yeu_cau_bo_sung` (ERR-CT-BS-03), file hợp lệ (ERR-CT-BS-02), state đúng (ERR-CT-BS-01) | — | API inbound DVC / Cổng PLQG / SCR-V.II-02 |
| ~~`YEU_CAU_BO_SUNG` → `TU_CHOI` auto~~ | — | — | **❌ BỎ trong v3.5** (Thay đổi 5 OUT) — không còn auto-từ-chối quá hạn / lần 4. Hành vi lần 4 chờ BA Q1 | — | — | — |
| `DANG_DANH_GIA` | `DANG_THAM_DINH` | `cb_nv_<cap>_01` | **FR-V.II-05** [Xác nhận đánh giá] | Hệ thống tra `quy_mo_dn` ← **FR-07** → BR-CALC-01 (Siêu nhỏ 100%/3M, Nhỏ 30%/5M, Vừa 10%/10M — NĐ18/2026) → BR-CALC-02 `so_tien_duoc_duyet = MIN(so_tien_de_nghi, phi_tu_van × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)`. Trần reset 1/1 hằng năm | `quy_mo_dn` ← **FR-07** | SCR-V.II-02 section Đánh giá |
| `DANG_THAM_DINH` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | **FR-V.II-09 + FR-V.II-11** [Trình phê duyệt] | Tạo bản ghi `THAM_DINH_HO_SO` 1:1 với `ket_qua_tham_dinh = DAT`, checklist 4 mục JSON (số liệu / phí TV / quy mô / trần năm). TB CB PD cùng cấp (BR-AUTH-05) | — | SCR-V.II-02 section Thẩm định |
| `DANG_THAM_DINH` | `TU_CHOI` | `cb_nv_<cap>_01` | **FR-V.II-09** Thẩm định Không đạt | Nhận xét bắt buộc. Ghi `ly_do_tu_choi = "THAM_DINH: " + nhan_xet`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id` | — | SCR-V.II-02 section Thẩm định |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | **FR-V.II-12** [Phê duyệt] | `so_tien_duyet` bắt buộc (ERR-CT-PD-03), `ghi_chu_duyet` optional. BR-AUTH-05 cùng đơn vị (`user.don_vi_id = hs.don_vi_id`). Ghi `nguoi_phe_duyet_id`, `ngay_phe_duyet`. Tạo `PHE_DUYET_CHI_TRA quyet_dinh=DUYET`. TB CB NV + TVV + DN | — | SCR-V.II-02 section Phê duyệt |
| `CHO_PHE_DUYET` | `DANG_THAM_DINH` | `cb_pd_<cap>_01` | **FR-V.II-12** [Từ chối — trả về thẩm định] (KHÔNG phải Từ chối cuối) | `ly_do_tu_choi` ≥10 ký tự (BR-FLOW-04, ERR-CT-PD-02). Tạo `PHE_DUYET_CHI_TRA quyet_dinh=TU_CHOI` (N:1 cho phép nhiều lần). TB CB NV (KHÔNG TB TVV/DN). KHÔNG ghi `thoi_gian_tu_choi` (vì đây là trả về, không phải Từ chối cuối) | — | SCR-V.II-02 section Phê duyệt |
| `DA_DUYET` | `DA_THANH_TOAN` | `cb_nv_<cap>_01` | **FR-V.II-13** [Cập nhật thanh toán] | `so_tien_thuc_tra` (>0 và ≤ `so_tien_duoc_duyet` BR-EC-22, ERR-CT-TT-02), `ngay_thanh_toan` bắt buộc, `so_bien_nhan` optional. TB TVV + DN | — | SCR-V.II-02 section Thanh toán |
| `DA_DUYET` | `TU_CHOI` | `cb_nv_<cap>_01` | **FR-V.II-13** Từ chối thanh toán | Lý do bắt buộc. Ghi `ly_do_tu_choi = "THANH_TOAN: " + ly_do`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id`. Áp dụng khi Kho bạc không chuyển tiền | — | SCR-V.II-02 section Thanh toán |

---

<a id="toc-fr13"></a>
### ⑫ FR-13 · Tư vấn Nhanh (Nhóm X.2)
**Login:**
- Nguồn `TU_DONG`: System auto (không cần user)
- Nguồn `THU_CONG`: `cb_nv_<cap>_01` nhập + `cb_pd_<cap>_01` duyệt
- Nguồn `IMPORT`: `cb_nv_<cap>_01` upload Excel + `cb_pd_<cap>_01` duyệt
- Dùng: DN tìm kiếm trên Cổng PLQG

**Màn hình xem chi tiết:**
- SCR-X2-01: **Quản lý Kho Câu hỏi** (3 tab filter Tất cả/Đã duyệt/Chờ duyệt) — danh sách + Modal thêm/Import + Phê duyệt inline. FR sử dụng: FR-X.2-01 (Quản lý Kho Câu hỏi). Theo srs-fr-13 §3 dòng 405.
- SCR-X2-03: **Quản lý Tư vấn Nhanh** (4 tab filter Tất cả/Chờ xử lý/Đã gợi ý/Hoàn thành) — danh sách + Layout 2 cột (trả lời) + Đánh giá inline; DN tương tác qua Cổng PLQG, CMS xem + cán bộ trả lời thủ công khi DN không hài lòng gợi ý. FR sử dụng: FR-X.2-02 (Tư vấn nhanh DN-driven), FR-X.2-03 (Trả lời thủ công), FR-X.2-05 (Đánh giá phiên TV nhanh). Theo srs-fr-13 §3 dòng 442.
- ⚠️ **Lưu ý SCR cũ DEPRECATED v2.1 (srs-fr-13):** ~~SCR-X2-02 Phê duyệt Kho Q&A~~ đã gộp thành action button trong SCR-X2-01 tab "Chờ duyệt"; ~~SCR-X2-04 Đánh giá Tư vấn Nhanh~~ đã gộp thành section trong SCR-X2-03.

**📑 Tabs SCR-X2-01 Kho câu hỏi — 3 tab filter trạng thái:**

| Tab | Filter | Badge đếm | Điều kiện hiển thị |
|-----|--------|-----------|--------------------|
| **Tất cả** | Không filter | Tổng `KHO_CAU_HOI` trong phạm vi đơn vị | Luôn |
| **Đã duyệt** | `trang_thai=DA_DUYET AND hieu_luc=1` | Số Q&A đang live trên Cổng | Luôn |
| **Chờ duyệt** | `trang_thai=CHO_DUYET` | Số Q&A chờ CB PD duyệt — hiện nút [Duyệt]/[Duyệt hàng loạt]/[Từ chối] | **Chỉ có ý nghĩa với `cb_pd_<cap>_01`** (CB NV vẫn xem được nhưng không action được) |

**Filter bar (dùng chung cho cả 3 tab):** Search full-text (index GIN trên các trường `cau_hoi + cau_tra_loi + tu_khoa`) · lọc theo **Lĩnh vực PL** · lọc theo **Nguồn** (`TU_DONG` / `THU_CONG` / `IMPORT`) · lọc theo **Trạng thái** (`NHAP` / `CHO_DUYET` / `DA_DUYET` / `HET_HIEU_LUC`)

**Xem chi tiết cần dữ liệu từ:**
- **FR-02 Hỏi đáp** → `HOI_DAP` ở trạng thái `DA_DUYET` (nguồn `TU_DONG` — hệ thống tự feed khi Hỏi đáp được duyệt)
- **FR-10 Quản trị** → danh mục Lĩnh vực PL

**🖐️ Nhập tay:** ✅ **Có, 3 nguồn song song (trường `nguon` enum):**
- **`TU_DONG`** — System auto tạo khi FR-02 Hỏi đáp chuyển `DA_DUYET` (không cần user)
- **`THU_CONG`** — `cb_nv_<cap>_01` nhập từng Q&A tại SCR-X2-01 Modal "Thêm câu hỏi" (Rich text cho câu trả lời) → trạng thái `CHO_DUYET` → `cb_pd_<cap>_01` duyệt
- **`IMPORT`** — Upload file .xlsx tại SCR-X2-01 Modal "Nhập Excel" (preview 10 dòng đầu + báo kết quả "N thành công / M lỗi") → tất cả gán `CHO_DUYET` để duyệt từng bản ghi hoặc duyệt hàng loạt

**Transition (SM-KHOCAUHOI):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| `FR-02 DA_DUYET` | `DA_DUYET` | System | **Tự động feed khi Hỏi đáp (FR-02) chuyển sang `DA_DUYET`** | Hệ thống tự tạo bản ghi với `nguon=TU_DONG` và `hoi_dap_goc_id` liên kết ngược về Hỏi đáp gốc | `hoi_dap_goc_id` ← **FR-02 Hỏi đáp** | Auto (không có UI) |
| — | `CHO_DUYET` | `cb_nv_<cap>_01` | **🖐️ Thêm thủ công (nguồn `THU_CONG`)** | **Câu hỏi** (`cau_hoi`, textarea, bắt buộc), **Câu trả lời** (`cau_tra_loi`, Rich Text theo chuẩn C16, bắt buộc), **Lĩnh vực PL** (`linh_vuc_id`, bắt buộc), **Từ khóa** (`tu_khoa`, tag input — phân cách bằng dấu phẩy). Có nút [Lưu nháp] / [Gửi duyệt] | `linh_vuc_id` ← danh mục của **FR-10 Quản trị** | SCR-X2-01 Modal "Thêm câu hỏi" |
| — | `CHO_DUYET` | `cb_nv_<cap>_01` | **🖐️ Import Excel (nguồn `IMPORT`)** | Upload file `.xlsx` → hệ thống preview 10 dòng đầu → validate → trả báo cáo "N thành công / M lỗi". Tất cả bản ghi hợp lệ sẽ được tạo ở trạng thái `CHO_DUYET` | Có file Excel mẫu để tải về | SCR-X2-01 Modal "Nhập Excel" (C15) |
| `CHO_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] đơn lẻ | `hieu_luc=1` auto, TB CB NV | — | SCR-X2-01 Tab "Chờ duyệt" → button Duyệt |
| `CHO_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | **[Duyệt hàng loạt]** | Chọn ≥1 checkbox → modal xác nhận (không thể "từ chối hàng loạt") | — | SCR-X2-01 Tab "Chờ duyệt" |
| `CHO_DUYET` | `NHAP` | `cb_pd_<cap>_01` | [Từ chối] | Lý do bắt buộc, TB CB NV | — | SCR-X2-01 modal |
| `DA_DUYET` | `HET_HIEU_LUC` | `cb_nv_<cap>_01` | Toggle hiệu lực | `hieu_luc=0` → ẩn khỏi Cổng PLQG (không xóa bản ghi) | — | SCR-X2-01 toggle inline |
| `HET_HIEU_LUC` | `DA_DUYET` | `cb_nv_<cap>_01` | Toggle lại | `hieu_luc=1` → hiện lại | — | SCR-X2-01 |

**Đầu ra:** Full-text search index (GIN tsvector: `cau_hoi + cau_tra_loi + tu_khoa`) → API Cổng PLQG.

---

<a id="toc-fr08"></a>
### ⑬ FR-08 · Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý (Nhóm VI)
**Login:**
- Lập đợt + chọn VV + phân công: `cb_nv_<cap>_01` (mỗi 6 tháng/năm)
- Chấm điểm: `cb_nv_<cap>_01` hoặc `cg_01` được phân công (`Người đánh giá`)
- Duyệt phân công + duyệt BC: `cb_pd_<cap>_01`
- **Nhận kết quả ĐG (FR-VI-10 mới v3.5, read-only):** `cb_nv_<cap>_01` thuộc `co_quan_duoc_danh_gia_id` (CB NV của cơ quan được đánh giá, có thể khác đơn vị CB NV tạo đợt)

**Màn hình xem chi tiết:**
- SCR-VI-01: **Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1)** — 1 màn duy nhất gộp danh sách + chi tiết 4 tab + form chấm điểm (srs-update-2026-5-5/srs-fr-08-danh-gia.md §3 line 781-887 v3.5). SCR-VI-02/03 KHÔNG tồn tại trong SRS.

**📑 Tabs SCR-VI-01 (khi xem chi tiết 1 đợt ĐG) — 4 tab:**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Tiêu chí** | Các tiêu chí của đợt: `TIEU_CHI_DANH_GIA WHERE ke_hoach_danh_gia_id=<current>` + tiêu chí master từ `TIEU_CHI_DANH_GIA` (FR-10 Quản trị, `nhom_tieu_chi='HIEU_QUA_HTPL'`) | Bảng tiêu chí — cột: **Tên** / **Mô tả** / **Điểm tối đa** / **Trọng số** (`trong_so`) / **Thứ tự**. Hiển thị **Tổng trọng số realtime** — cảnh báo đỏ nếu ≠ 100%, **chặn cứng** khi nhấn trình duyệt nếu tổng chưa đủ 100% | Luôn |
| **Phân công** | `PHAN_CONG_DANH_GIA WHERE ke_hoach_danh_gia_id=<current>` | Bảng phân công — cột: **Người ĐG** / **Vai trò** (`TRUONG_NHOM` / `DANH_GIA_VIEN`) / **Lĩnh vực phụ trách** / **Số đợt đã tham gia**. Các điều kiện chặn: **≥1 người** + **≥1 Trưởng nhóm** + không được phân công trùng lặp. Nút [Trình duyệt phân công] / [Duyệt phân công] | Luôn |
| **Thực hiện chấm điểm** | `KET_QUA_DANH_GIA WHERE ke_hoach_id=<current>` (entity §4 line 1021-1044 srs-fr-08 v3.5) | **Chọn VV vào đợt** (`vu_viec_id`, lọc VV đã `HOAN_THANH` trong kỳ + cùng đơn vị); form chấm điểm gồm: **Điểm tổng** (`diem_tong`, thang 0-100), **Chi tiết điểm** (`chi_tiet_diem`, JSON theo từng tiêu chí), **Nhận xét** (`nhan_xet`), **Trạng thái** (`trang_thai` ∈ `CHUA_DANH_GIA` / `DA_DANH_GIA`). Hiển thị **KPI cards**: Tổng VV / Điểm TB / Tỷ lệ đạt SLA | Luôn |
| **Báo cáo** | `BAO_CAO_DANH_GIA WHERE ke_hoach_id=<current>` (1:1 với KE_HOACH_DANH_GIA) | KPI cards + bảng tổng hợp + biểu đồ (Radar / Bar) + các trường: **Nhận xét tổng thể** (`nhan_xet_tong_the`), **Kinh phí hoạt động khác** (`kp_hoat_dong_khac`), **Kinh phí xã hội hóa** (`kp_xa_hoi_hoa`), **Kiến nghị** (`kien_nghi`) + nút [Trình duyệt BC] + [Xuất Word/Excel theo mẫu 21a/21b TT17/2025] | Luôn hiển thị. Chỉ cho sửa khi đợt đã ở trạng thái chấm xong. **FR-VI-10 v3.5:** read-only cho CB NV thuộc `co_quan_duoc_danh_gia_id` khi đợt `HOAN_THANH` |

**Xem chi tiết cần dữ liệu từ:**
- **FR-05 Vụ việc** → `VU_VIEC` ở trạng thái `HOAN_THANH` (chỉ được chọn VV đã hoàn thành vào đợt chấm)
- **FR-10 Quản trị** → danh mục Tiêu chí đánh giá (kèm điểm tối đa + trọng số)
- **FR-10 Quản trị** → `TAI_KHOAN` + **FR-04 CG/TVV** → `TU_VAN_VIEN` (chọn người đánh giá)

**🖐️ Nhập tay:** ✅ **Có — toàn bộ workflow do CB NV nhập tay:**
- Lập kế hoạch đợt (UC83), chọn VV, phân công người chấm, chấm điểm từng tiêu chí (UC85), viết nhận xét tổng, nhập kinh phí hoạt động khác/xã hội hóa, trình BC — **không có kênh API**.
- Điểm tự tính (BR-CALC-04 có trọng số), nhưng người ĐG vẫn nhập thủ công `diem` + `nhan_xet` cho từng VV × từng tiêu chí.

**Transition (SM-DANHGIA — 8 state v3.5 + HUY, đã đồng bộ):**

> ✅ **Resolved 2026-05-06 (FR-08 v3.5 Thay đổi 5, GAP-VI-01):** SRS v3 từng có 3 phiên bản tên state mâu thuẫn (6/7/9 state). v3.5 chốt 1 bộ canonical **8 state** lấy từ §5 làm source of truth + bổ sung HUY. Bỏ toàn bộ tên state cũ `NHAP / DA_LAP_KH / DA_DUYET_PC / DANG_DANH_GIA / DA_DANH_GIA / DA_LAP_BC / CHO_DUYET_BC / DA_DUYET_BC` — KHÔNG còn dùng. DB enum CHECK = SM state = `LAP_KE_HOACH / PHAN_CONG / CHO_DUYET_PC / THUC_HIEN / BAO_CAO / CHO_PHE_DUYET / HOAN_THANH / HUY`. Default `LAP_KE_HOACH`. Cite: `srs-update-2026-5-5/srs-fr-08-danh-gia.md` §4 line 1009 + §5 line 1117-1167.

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `LAP_KE_HOACH` | `cb_nv_<cap>_01` | **🖐️ Tạo đợt ĐG (UC83, FR-VI-01, BR-LEGAL-08)** | **Tên đợt** (`ten_dot`), **Mục tiêu** (`muc_tieu`), **Tần suất** (`tan_suat` ∈ `SO_BO_6_THANG/TRON_NAM`), **Từ ngày** (`tu_ngay`), **Đến ngày** (`den_ngay`), **Đối tượng** (`doi_tuong` ∈ `VU_VIEC/DAO_TAO/TONG_HOP`), **Cơ quan được ĐG** (`co_quan_duoc_danh_gia_id` FK→DON_VI 1:1 BẮT BUỘC v3.5), **File đính kèm** (`file_dinh_kem` PDF/DOC/DOCX/XLS/XLSX ≤20MB optional v3.5) | `don_vi_id` hệ thống tự lấy từ user; `co_quan_duoc_danh_gia_id` dropdown DON_VI (cùng cấp/cấp dưới); dropdown tiêu chí lấy từ `TIEU_CHI_DANH_GIA` (**FR-10 Quản trị**) | SCR-VI-01 (consolidated) |
| `LAP_KE_HOACH` | `PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công người chấm (UC85, FR-VI-03)** | **Người đánh giá** (`nguoi_danh_gia_id`), **Vai trò** (`vai_tro` ∈ `DANH_GIA_VIEN` / `TRUONG_NHOM`), **Lĩnh vực phụ trách** (`linh_vuc_phu_trach[]`, chọn nhiều), **Ghi chú** (`ghi_chu`) | Dropdown chọn tài khoản từ `TAI_KHOAN` (§3.4.3.7) — lọc cùng đơn vị (`BR-AUTH-01`/`BR-AUTH-08`); hệ thống **gợi ý** theo lĩnh vực phụ trách + số đợt đã tham gia. **Điều kiện chặn:** phải có ≥1 `TRUONG_NHOM`, không được phân công trùng lặp | SCR-VI-01 Tab Phân công |
| `PHAN_CONG` | `CHO_DUYET_PC` | `cb_nv_<cap>_01` | [Trình duyệt phân công] (FR-VI-03, BR-AUTH-05, BR-NOTIF-01 mở rộng v3.5) | **Điều kiện chặn:** đã có danh sách phân công + tổng trọng số các tiêu chí = 100%. Gửi TB CB PD. | — | SCR-VI-01 |
| `CHO_DUYET_PC` | `THUC_HIEN` | `cb_pd_<cap>_01` | [Duyệt phân công] (FR-VI-04, BR-NOTIF-01 mở rộng v3.5) | CB PD phải cùng cấp với CB NV trình (`BR-AUTH-05`); hệ thống audit log + cho phép chọn VV. Gửi TB CB NV. | — | SCR-VI-01 |
| `CHO_DUYET_PC` | `PHAN_CONG` | `cb_pd_<cap>_01` | [Từ chối phân công] (FR-VI-04, BR-FLOW-04, BR-NOTIF-01 mở rộng v3.5) | **Lý do từ chối** (`ly_do`, ≥10 ký tự). Gửi TB CB NV. | — | SCR-VI-01 |
| — (đang ở `THUC_HIEN`) | — | `cb_nv_<cap>_01` | **Chọn VV vào đợt (UC87, FR-VI-05)** | **Danh sách VV** (`vu_viec_ids[]`, multi-select) | Dropdown lọc `VU_VIEC` với các điều kiện: `trang_thai=HOAN_THANH` + `ngay_hoan_thanh` nằm trong kỳ đánh giá + thuộc phạm vi đơn vị (`BR-AUTH-08`). Nếu VV đã ở đợt khác, hệ thống **cảnh báo** nhưng vẫn cho phép chọn lại | SCR-VI-01 Tab Thực hiện / modal chọn VV |
| — (đang ở `THUC_HIEN`) | — | Người được phân công | Chấm điểm từng VV theo từng tiêu chí (UC88, FR-VI-06) | **Tiêu chí** (`tieu_chi_id`), **Điểm** (`diem`, 0 ≤ điểm ≤ `diem_toi_da`), **Nhận xét** (`nhan_xet`, ≤1000 ký tự), **Nhận xét tổng thể** (`nhan_xet_tong_the`, ≤2000 ký tự); hỗ trợ **Lưu nháp** (đặt cờ `is_draft=1`) | Tiêu chí ← `TIEU_CHI_DANH_GIA` (**FR-10 Quản trị**); `diem_toi_da` lấy từ chính tiêu chí đó | SCR-VI-01 Tab Thực hiện (form chấm inline) |
| `THUC_HIEN` | `BAO_CAO` | System / `cb_nv_<cap>_01` | **Tự động khi tất cả VV đã chấm xong** (FR-VI-06/07, `BR-CALC-04`) | Hệ thống tự sinh báo cáo theo mẫu TT17 + tính **điểm trung bình có trọng số** | — | Auto |
| `BAO_CAO` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Trình BC] (FR-VI-08, BR-NOTIF-01 mở rộng v3.5) | **Điều kiện chặn:** BC có đủ dữ liệu. Trường bắt buộc: **Kinh phí hoạt động khác** (`kp_hoat_dong_khac`, ≥0), **Kinh phí xã hội hóa** (`kp_xa_hoi_hoa`, ≥0), **Nhận xét tổng thể** (`nhan_xet_tong_the`, Rich text), **Kiến nghị** (`kien_nghi`). Gửi TB CB PD. | — | SCR-VI-01 Tab Báo cáo |
| `CHO_PHE_DUYET` | `HOAN_THANH` | `cb_pd_<cap>_01` | [Duyệt BC] (FR-VI-09, BR-AUTH-05, BR-NOTIF-01) | Cùng cấp. Gửi TB CB NV. | — | SCR-VI-01 |
| `CHO_PHE_DUYET` | `BAO_CAO` | `cb_pd_<cap>_01` | [Từ chối BC] (FR-VI-09, BR-FLOW-04, BR-NOTIF-01) | `ly_do` ≥10 ký tự. Gửi TB CB NV. | — | SCR-VI-01 |
| — (đã ở `HOAN_THANH`) | — | **CB NV thuộc `co_quan_duoc_danh_gia_id`** (FR-VI-10 mới v3.5) | **Nhận kết quả đánh giá (read-only)** | Truy cập SCR-VI-01 Tab Báo cáo. Read-only mọi field. | Lọc KH ở trạng thái `HOAN_THANH` + `co_quan_duoc_danh_gia_id = user.don_vi_id` | SCR-VI-01 |
| `LAP_KE_HOACH` / `PHAN_CONG` / `THUC_HIEN` / `BAO_CAO` | `HUY` | `cb_nv_<cap>_01` hoặc `cb_pd_<cap>_01` | **Hủy đợt (GAP-VI-01)** | **Lý do hủy** (`ly_do_huy` text). Audit log + soft-delete. KHÔNG hủy được khi đã `HOAN_THANH`. | — | SCR-VI-01 |

**Đầu ra:** Báo cáo mẫu TT17/2025/TT-BTP → đẩy vào FR-11 + FR-01.

---

<a id="toc-lop5"></a>
## LỚP 5 — TỔNG HỢP & ĐẦU RA (chạy cuối)

<a id="toc-fr15-gd2"></a>
### ⑭-bis FR-15 · Chương trình HTPLDN (Nhóm XI) — **Giai đoạn 2: Đợt Báo cáo**

> Nối tiếp ⑤ LỚP 2. Chỉ chạy khi CT đã ở `DANG_THUC_HIEN` **và** LỚP 3+4 đã có số liệu VV/Chi trả/Đào tạo trong kỳ.

**Login:** `cb_nv_<cap>_01` lập + trình · `cb_pd_<cap>_01` duyệt · `cb_nv_tw_01` tổng hợp TW.

**Màn hình:** SCR-XI-01 Tab "Đợt báo cáo" (drill từ CT ở ⑤).

**Xem chi tiết cần dữ liệu từ:**
- **FR-15 CT HTPLDN** ở trạng thái `DANG_THUC_HIEN` (nối tiếp từ Giai đoạn 1 — mục ⑤)
- **FR-05 Vụ việc** → `VU_VIEC` trong kỳ báo cáo (LỚP 3)
- **FR-06 Chi trả** → `HO_SO_CHI_TRA` đã `DA_THANH_TOAN` trong kỳ (LỚP 4)
- **FR-03 Đào tạo** → `KHOA_HOC` đã `HOAN_THANH` trong kỳ (LỚP 3)

**Transition (SM-DOT-BC — 6 state theo srs-v3 §C.7a):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter |
|----|-----|-------|---------|--------------|-------------------------|
| — | `TAO_DOT` | `cb_nv_<cap>_01` | **🖐️ Tạo đợt BC (FR-XI-05a)** | `ky_bao_cao`, `chuong_trinh_id` | Guard: CT ở `DANG_THUC_HIEN`/`HOAN_THANH` |
| `TAO_DOT` | `DANG_LAP_BC` | `cb_nv_<cap>_01` | [Bắt đầu lập BC] (FR-XI-06) | Guard: đợt đã hoàn chỉnh thông tin → tạo `BAO_CAO_CT_HTPL` record | — |
| `DANG_LAP_BC` | `CHO_DUYET_KQ` | `cb_nv_<cap>_01` | [Trình duyệt KQ] (FR-XI-07, BR-AUTH-05) | **Điều kiện chặn:** BC đã đầy đủ số liệu (KPI, số DN thụ hưởng,...) | Số liệu tổng hợp từ **FR-05 Vụ việc** / **FR-06 Chi trả** / **FR-03 Đào tạo** trong kỳ báo cáo |
| `CHO_DUYET_KQ` | `DA_DUYET_KQ` | `cb_pd_<cap>_01` | [Duyệt KQ] (FR-XI-07a, BR-AUTH-05) | Cùng cấp | — |
| `CHO_DUYET_KQ` | `DANG_LAP_BC` | `cb_pd_<cap>_01` | [Từ chối KQ] (BR-FLOW-04) | `ly_do` ≥10 ký tự | — |
| `DA_DUYET_KQ` | `DA_GUI_TW` | `cb_nv_bn_01` / `cb_nv_dp_01` | [Gửi lên TW] (FR-XI-08) | Guard: chỉ BN/ĐP gửi | TB CB NV TW |
| `DA_GUI_TW` | `DA_TONG_HOP` | `cb_nv_tw_01` | [Tổng hợp] (FR-XI-09) | CB NV TW xác nhận → tạo BC tổng hợp | — |

---

<a id="toc-fr11"></a>
### ⑭ FR-11 · Báo cáo Thống kê (Nhóm IX)
**Login:** `cb_nv_<cap>_01` tạo; `cb_pd_<cap>_01` duyệt.

**Màn hình xem chi tiết (UNIFIED 1 màn cho cả 23 loại BC theo srs-fr-11 §3 dòng 1025):**
- SCR-IX-01: **Trang Báo cáo Thống kê** (Dashboard / Unified Report Page) — 1 trang duy nhất gồm: dropdown chọn loại BC (23 loại) → bộ lọc kỳ + đơn vị + bộ lọc đặc thù → nút [Xem báo cáo] → vùng kết quả (biểu đồ + bảng) → nút [Xuất Excel] / [Xuất Word→PDF v3.5] theo mẫu TT17/2025 (FR-11 v3.5 Thay đổi 6 — Word→PDF chỉ áp BC nhóm IX, KHÔNG áp FR-15). FR sử dụng: FR-IX-01 đến FR-IX-23 (**UC124-146** — UC renumber +4 từ UC120-142 v3 do FR-VIII-22..25 chiếm UC120-123 — CHANGELOG §srs-fr-11 Thay đổi 1).
- ⚠️ **Lưu ý:** SRS v2.1 KHÔNG có SCR-IX-02 — toàn bộ thao tác xem/lọc/xuất Word/Excel đều thực hiện trong SCR-IX-01 (xem dòng 1046-1047 srs-fr-11 — nút [Xuất Excel] / [Xuất Word] thuộc action-bar của SCR-IX-01).

**Xem chi tiết cần dữ liệu từ — Dữ liệu đã `DA_DUYET` của các module:**
- **FR-02 Hỏi đáp** · **FR-05 Vụ việc** · **FR-06 Chi trả** · **FR-03 Đào tạo** · **FR-04 CG/TVV** · **FR-07 Doanh nghiệp** · **FR-08 Đánh giá** · **FR-12 Tư vấn chuyên sâu** · **FR-15 CT HTPLDN**

**🖐️ Nhập tay:** ✅ **Có** — CB NV chọn mẫu báo cáo, thiết lập kỳ (tháng/quý/năm/đột xuất), chạy aggregation tự động, sau đó có thể **bổ sung nhận xét tay** + điều chỉnh số liệu nếu cần trước khi trình CB PD duyệt.

**Transition:**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `NHAP` | `cb_nv_<cap>_01` | **🖐️ Tạo đợt BC** | **Mẫu báo cáo** (`mau_bao_cao_id`), **Kỳ báo cáo** (`ky_bao_cao` ∈ `THANG` / `QUY` / `NAM` / `DOT_XUAT`), **Từ ngày** (`tu_ngay`), **Đến ngày** (`den_ngay`), **Phạm vi đơn vị** | `mau_bao_cao_id` ← danh mục `MAU_BC` (có 10+ mẫu sẵn: TT17, NĐ55 kinh phí, DN thụ hưởng,...); `tu_ngay`/`den_ngay` dùng date picker; phạm vi đơn vị hệ thống tự lấy theo user | SCR-IX-01 |
| `NHAP` | `NHAP` | `cb_nv_<cap>_01` | Chạy aggregation | Hệ thống tự gom dữ liệu từ 9 module nghiệp vụ theo filter đã chọn | Query realtime từ **FR-02 Hỏi đáp** → **FR-15 CT HTPLDN** | SCR-IX-01 (Trang Báo cáo Thống kê — vùng kết quả biểu đồ + bảng) |
| `NHAP` | `CHO_DUYET` | `cb_nv_<cap>_01` | [Trình duyệt] | CB NV bổ sung tay: **Nhận xét** (`nhan_xet`), **Kiến nghị** (`kien_nghi`) | — | SCR-IX-01 (Trang Báo cáo Thống kê — action-bar) |
| `CHO_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] | Cùng cấp (BR-AUTH-05) | — | SCR-IX-01 (Trang Báo cáo Thống kê — action-bar Phê duyệt) |
| `CHO_DUYET` | `NHAP` | `cb_pd_<cap>_01` | [Từ chối] | Lý do ≥10 ký tự | — | SCR-IX-01 (Trang Báo cáo Thống kê — modal từ chối) |
| `DA_DUYET` | `DA_XUAT` | `cb_nv_<cap>_01` | [Xuất file] | Download Word/Excel theo template TT17/2025 | — | SCR-IX-01 (Trang Báo cáo Thống kê — nút [Xuất Excel] / [Xuất Word]) |

**Đầu ra:** File Word/Excel cho lãnh đạo, UBND — báo cáo 6 tháng / năm / đột xuất.

---

<a id="toc-fr01"></a>
### ⑮ FR-01 · Dashboard (Nhóm I)
**Login:** Mọi role. Data scope lọc theo BR-AUTH-08 (TW all / BN của BN / ĐP của ĐP).

**Màn hình:** SCR-I-01 — biểu đồ + KPI + cảnh báo SLA.

**Xem chi tiết cần dữ liệu từ:** Real-time query toàn bộ module nghiệp vụ.

**Không có transition** — chỉ đọc.

---

<a id="toc-fr16"></a>
### ⑯ FR-16 · API Kết nối (Nhóm XII)
**Consumer:** Cổng PLQG, HT TTHC BTP, HT khác. JWT scope theo endpoint.

**Không có màn hình UI** — chỉ API.

**Xem chi tiết cần dữ liệu từ — 18 API outbound (theo SRS FR-16):**

| Endpoint (GET) | Source module | Scope |
|----------------|---------------|-------|
| `/api/v1/hoi-dap` + `/search` | **FR-02 Hỏi đáp** — chỉ trả về bản ghi đã `CONG_KHAI` | Public |
| `/api/v1/dao-tao` + `/search` | **FR-03 Đào tạo** — chỉ trả về CTĐT / Khóa học đã công khai | Public |
| `/api/v1/tu-van-vien` + `/search` | **FR-04 CG/TVV** — lọc `trang_thai=HOAT_DONG` (v3.5 rename từ `DANG_HOAT_DONG`) **VÀ** `cong_khai=1` (v3.5 rename CR-01) | Public |
| `/api/v1/vu-viec` + `/search` | **FR-05 Vụ việc** — chỉ trả metadata (không trả nội dung chi tiết) | Public |
| `/api/v1/danh-gia` + `/search` | **FR-08 Đánh giá** — chỉ trả báo cáo đánh giá đã duyệt | Public |
| `/api/v1/bieu-mau` + `/search` | **FR-09 Biểu mẫu** — lọc `cong_khai=1` (v3.5 rename CR-01, kèm endpoint download: `/bieu-mau/{id}/download`) | Public |
| `/api/v1/tu-van-chuyen-sau` + `/search` | **FR-12 Tư vấn chuyên sâu** — lọc `trang_thai=HOAN_THANH`, chỉ trả metadata (KHÔNG trả văn bản tư vấn chi tiết) | Public |
| `/api/v1/chuong-trinh-htpl` + `/search` | **FR-15 CT HTPLDN** — lọc `trang_thai=DA_CONG_BO` | Public |
| `/api/v1/ho-so-pl-dn` + `/search` | **FR-12 Tư vấn chuyên sâu** → `HO_SO_PHAP_LY_DN` (hồ sơ pháp lý gắn với DN) | Public |

> ⚠️ **TODO (UNVERIFIED):** FR-13 TV Nhanh KHÔNG có API outbound riêng trong SRS FR-16 (dù Cổng PLQG dùng full-text search). Nếu cần, có thể dùng `/hoi-dap/search` hoặc endpoint nội bộ — cần CĐT clarify.

> ⚠️ **TODO (UNVERIFIED):** API inbound (FR-16 gọi là "~8 API inbound" trong srs-v3.md §1.1) — SRS FR-16 không liệt kê chi tiết endpoint inbound. Cần CĐT cung cấp spec cho `POST vu-viec`, `POST chi-tra`, `POST hoi-dap`, `POST ho-so-pl-dn` (từ DVC/Cổng PLQG).

**Mục tiêu non-functional:** response < 3s, uptime ≥ 99.5% (24/7) — srs-v3.md §1.2.4.

---

<a id="toc-bang-tomtat"></a>
## Bảng tóm tắt thứ tự seed / test

| # | Module | LỚP | Login tạo | Login duyệt | Phụ thuộc |
|---|--------|-----|-----------|-------------|-----------|
| 1 | **FR-10 Quản trị** | 1 | `qtht_01` | — | Không |
| 2 | FR-07 Doanh nghiệp | 2 | `cb_nv_*_01` | — | FR-10 |
| 3 | FR-04 CG/TVV | 2 | `nht_01` đăng ký / `cb_nv_dp_01` | `cb_pd_dp_01` | FR-10 |
| 4 | FR-09 Biểu mẫu | 2 | `cb_nv_*_01` | — | FR-10 |
| 5 | FR-15 CT HTPLDN — **GĐ1 Kế hoạch** | 2 | `cb_nv_*_01` | `cb_pd_*_01` | FR-10 |
| 6 | **FR-05 Vụ việc** | 3 | DN/`cb_nv_*_01` | `cb_pd_*_01` | FR-07 + FR-04 + FR-10 |
| 7 | FR-02 Hỏi đáp | 3 | DN/`cb_nv_*_01` | `cb_pd_*_01` | FR-10 (+FR-07 tùy chọn) |
| 8 | FR-12 TV chuyên sâu | 3 | DN/`cb_nv_*_01` | `cb_pd_*_01` | FR-07 + FR-04 |
| 9 | FR-03 Đào tạo | 3 | `cb_nv_*_01` | `cb_pd_*_01` | FR-04 + FR-10 |
| 10 | FR-14 Hợp đồng | 4 | `cb_nv_*_01` | — | FR-05 + FR-04 |
| 11 | FR-06 Chi trả | 4 | DN/`cb_nv_*_01` | `cb_pd_*_01` | **FR-05 HOAN_THANH** + FR-07 + FR-14 |
| 12 | FR-08 Đánh giá | 4 | `cb_nv_*_01` | `cb_pd_*_01` | **FR-05 HOAN_THANH** |
| 13 | FR-13 TV Nhanh | 4 | Auto/`cb_nv_*_01` | `cb_pd_*_01` | FR-02 DA_DUYET |
| 14 | FR-15 CT HTPLDN — **GĐ2 Đợt BC** | 5 | `cb_nv_*_01` | `cb_pd_*_01` | FR-15 GĐ1 + FR-05 + FR-06 + FR-03 trong kỳ |
| 15 | FR-11 Báo cáo | 5 | `cb_nv_*_01` | `cb_pd_*_01` | Tất cả module nghiệp vụ |
| 16 | FR-01 Dashboard | 5 | Mọi role | — | Tất cả module |
| 17 | FR-16 API | 5 | System | — | Tất cả module |

> **Note về FR-08 vs FR-13 (LỚP 4):** Không có dependency giữa 2 module này — FR-08 cần VV HOAN_THANH (FR-05), FR-13 cần HOI_DAP DA_DUYET (FR-02). Thứ tự test có thể linh hoạt.

<a id="toc-bang-tranhanh"></a>
## Bảng tra nhanh — Khả năng NHẬP TAY / IMPORT theo module

| Module | Nhập tay CMS? | UC | Kênh thủ công | Kênh auto (API inbound / tự động) | Import Excel? |
|--------|:-------------:|-----|---------------|-----------------------------------|:-------------:|
| FR-10 Quản trị | ✅ | — | QTHT CRUD trực tiếp | — | ❌ |
| FR-07 DN | ✅ | UC81 | CB NV nhập form 28 trường | Auto upsert từ FR-12 API | ✅ FR-V.III-NEW-01 (Wizard 3 bước) |
| FR-04 CG/TVV | ✅ | — | Tự đăng ký + CB NV tạo proxy | — | ❌ |
| FR-09 Biểu mẫu | ✅ | UC97 (Import) | CB NV upload file đơn lẻ + **Import hàng loạt (SCR-VII-03)** | — | ✅ Multi-file upload (max 50, ≤500MB) |
| FR-15 CT HTPLDN | ✅ | UC164 | CB NV CRUD | — | ❌ |
| **FR-05 Vụ việc** | ✅ | **UC54** | Kênh `TRUC_TIEP` / `BUU_CHINH` / `DIEN_THOAI` — bỏ qua MOI_TAO, vào thẳng DA_TIEP_NHAN | UC52 (DVC) + UC55 (HT khác) | ❌ |
| FR-02 Hỏi đáp | ✅ | **UC10** | Kênh `TRUC_TIEP` / `HE_THONG_KHAC` | DVC + CONG_PLQG | ❌ |
| FR-12 TV chuyên sâu | ✅ | **UC147** | CB NV chọn DN + CG + nội dung | UC149 (Cổng PLQG API) | ❌ |
| FR-03 Đào tạo | ✅ | UC20 (FR-III-01, quyền UC115) | Toàn bộ CRUD CTĐT + KH + bài giảng | — | ❌ |
| FR-14 HĐ TV | ✅ | — | CB NV CRUD | — | ❌ |
| **FR-06 Chi trả** | ❌ | — | **KHÔNG CÓ KÊNH THỦ CÔNG** | **UC68 (DVC) — NGUỒN DUY NHẤT** | ❌ |
| FR-13 TV Nhanh | ✅ | — | CB NV thêm từng Q&A (`nguon=THU_CONG`) | Auto từ FR-02 DA_DUYET (`nguon=TU_DONG`) | ✅ (`nguon=IMPORT`) |
| FR-08 Đánh giá | ✅ | UC83/85 | Toàn bộ workflow 6 bước thủ công | — | ❌ |
| FR-11 Báo cáo | ✅ | — | CB NV chọn mẫu + chạy aggregation + edit tay | — | ❌ |

<a id="toc-y-nghia"></a>
### Ý nghĩa cho QA seed

1. **FR-06 Chi trả là special case** — không thể test end-to-end thuần UI. Cần:
   - Backend team mock payload DVC/LGSP để inject `CHO_TIEP_NHAN`, hoặc
   - DB insert trực tiếp để có hồ sơ ở trạng thái `CHO_TIEP_NHAN`, rồi từ đó CB NV xử lý UI tiếp
2. **FR-05 / FR-02 / FR-12 có kênh thủ công → QA seed được 100% UI** — không cần mock API inbound.
3. **FR-07 Import Excel** là con đường seed nhanh nhất cho scenario cần nhiều DN — có file mẫu tải về, validation preview.
4. **FR-13 TV Nhanh nguồn IMPORT** thuận tiện khi cần seed nhiều Q&A mà không phải đi vòng qua FR-02 `DA_DUYET`.

<a id="toc-5-luat"></a>
## 5 Luật suy dẫn cho QA seed

1. **Muốn test FR-06 Chi trả?** → Phải có ít nhất 1 VV `HOAN_THANH` (FR-05) + DN có quy mô rõ ràng (FR-07) + HĐ TV (FR-14).
2. **Muốn test FR-08 Đánh giá?** → Phải có tập VV `HOAN_THANH` ≥ 1 (FR-05) + Tiêu chí đánh giá (FR-10 DANH_MUC).
3. **Muốn test FR-13 nguồn TU_DONG?** → Phải push 1 Hỏi đáp (FR-02) qua `DA_DUYET`.
4. **Muốn test FR-05 phân công TVV?** → Phải có TVV `HOAT_DONG` cấp ĐP (FR-04 v3.5 — rename từ `DANG_HOAT_DONG`).
5. **Muốn test bất kỳ module nào?** → Phải có tài khoản role tương ứng (FR-10) và DANH_MUC liên quan.

<a id="toc-quy-uoc"></a>
## Quy ước đọc bảng transition

<a id="toc-cot-trigger"></a>
### Cột "Trigger"
- **🖐️ Thêm thủ công / Tạo thủ công** → CB NV nhập tay trên CMS, không cần kênh ngoài. Đây là trigger chính cho **nguồn manual** mà QA có thể thao tác 100% UI.
- **[Tên nút]** → Nút hành động trong thanh action-bar / modal
- **Auto** → System tự chuyển (BR-FLOW-01 auto-transition, BR-EC-16 quá hạn, time-based)
- **API inbound** → Data đẩy từ ngoài (DVC/LGSP/Cổng PLQG) — không thao tác qua CMS

<a id="toc-cot-dulieu"></a>
### Cột "Dữ liệu nhập"
- `(Y)` = bắt buộc · `(N)` = tùy chọn · `Auto` = hệ thống tự điền
- `Guard: ...` = điều kiện tiên quyết phải thỏa trước khi transition
- `BR-XXX-YY` = reference rule nghiệp vụ trong Phụ lục B SRS

<a id="toc-cot-nguon"></a>
### Cột "Nguồn dropdown / Filter"
- Mô tả dropdown/modal chọn value lấy data từ **entity nào của module nào**, kèm filter `WHERE ...` cụ thể.
- Ví dụ: `← FR-04 filter trang_thai=HOAT_DONG AND cong_khai=1 AND linh_vuc khớp` (v3.5 rename CR-01 + FR-04 SM-TVV state rename `DANG_HOAT_DONG` → `HOAT_DONG`)
- Nếu ghi "—" nghĩa là transition không có dropdown (chỉ confirm hoặc free-form input).

<a id="toc-cot-mannguon"></a>
### Cột "Màn nguồn"
- **SCR-xx-yy** → màn trong CMS
- **API inbound** → endpoint FR-16 nhận từ ngoài
- **Auto** → không có UI
- **Modal/Drawer** → overlay trên màn cha (ghi kèm tên màn cha)
