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
  - [⑬ FR-08 · Đánh giá Hiệu quả (Nhóm VI)](#toc-fr08)
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

**Màn hình (SCR-VIII-01..10) theo SRS FR-10 §3:**
- SCR-VIII-01: **Quản lý Danh mục** (14 tab dọc bên trái)
- SCR-VIII-02: **Quản lý Vai trò**
- SCR-VIII-03: **Quản lý Tài khoản NSD**
- SCR-VIII-04: **Phân quyền Chức năng**
- SCR-VIII-05: **Phân quyền Dữ liệu**
- SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — 4 tab)
- SCR-VIII-07: Đăng nhập (MH-10.8b)
- SCR-VIII-08 / SCR-VIII-08a: Đăng ký TK / QTHT duyệt TK đăng ký
- SCR-VIII-09: Đăng xuất
- SCR-VIII-10: Nhật ký Hệ thống (MH-10.10)

> **Lưu ý DM Cơ quan/Đơn vị (UC103 — tree view phân cấp TW→BN→ĐP) KHÔNG có màn riêng** — là thành phần đặc biệt bên trong tab "Cơ quan ĐV" của SCR-VIII-01 (srs-fr-10 §3 dòng 1237-1244).

**📑 Tabs SCR-VIII-01 Quản lý Danh mục — 14 tab dọc bên trái (theo SRS FR-10 §3 dòng 1221):**

| Tab | Entity filter | Data đặc biệt | Điều kiện hiển thị |
|-----|---------------|---------------|--------------------|
| Lĩnh vực PL | `DANH_MUC WHERE loai='LINH_VUC_PL'` | Tiêu chuẩn ma/ten/mo_ta/thu_tu/trang_thai | Luôn |
| Loại hình HT | `DANH_MUC WHERE loai='LOAI_HINH_HT'` (UC100) | — | Luôn |
| Chương trình HT | `DANH_MUC WHERE loai='CHUONG_TRINH_HT'` | — | Luôn |
| Tình trạng VV | `DANH_MUC WHERE loai='TINH_TRANG_VV'` | — | Luôn |
| **Cơ quan ĐV** | `DON_VI` (tree-view) | **Tree 3 cấp TW→BN→ĐP** + form chi tiết bên phải + nút [+ Thêm đơn vị con] mỗi node (UC103) | Luôn |
| Tổ chức tư vấn | `DANH_MUC WHERE loai='TO_CHUC_TU_VAN'` | NĐ77/2008 | Luôn |
| Loại DN | `DANH_MUC WHERE loai='LOAI_DN'` | SIEU_NHO/NHO/VUA | Luôn |
| Hồ sơ đề nghị HT | `DANH_MUC WHERE loai='HO_SO_DE_NGHI_HT'` (UC106) | Checklist 6 hạng mục cho FR-V.I-06 | Luôn |
| Hồ sơ đề nghị TT | `DANH_MUC WHERE loai='HO_SO_DE_NGHI_TT'` | Checklist cho FR-V.II | Luôn |
| **Tiêu chí ĐG hiệu quả** | `DANH_MUC WHERE loai='TIEU_CHI_DG_HQ'` (UC109) | Cột bổ sung: Trọng số (%), Thang điểm min/max. **Tổng trọng số phải = 100%** (cảnh báo đỏ nếu ≠) | Luôn |
| **Tiêu chí ĐG chi phí** | `DANH_MUC WHERE loai='TIEU_CHI_DG_CP'` (UC110) | Cột bổ sung: Quy mô DN, Mức hỗ trợ (%), Trần HT/năm (VNĐ) | Luôn |
| Loại TK | `DANH_MUC WHERE loai='LOAI_TK'` | — | Luôn |
| Loại hình tiếp nhận | `DANH_MUC WHERE loai='LOAI_HINH_TIEP_NHAN'` | — | Luôn |
| Kênh tiếp nhận | `DANH_MUC WHERE loai='KENH_TIEP_NHAN'` | — | Luôn |

**📑 Tabs SCR-VIII-06 Cấu hình hệ thống — 4 tab:**

| Tab | Entity | Data | Điều kiện hiển thị |
|-----|--------|------|--------------------|
| **Thời hạn xử lý (SLA)** | `CAU_HINH_SLA` | Bảng cấu hình thời hạn xử lý cho 4 loại yêu cầu: **FR-02 Hỏi đáp / FR-05 Vụ việc / FR-06 Chi trả / FR-12 Tư vấn chuyên sâu**. Mỗi loại cấu hình các trường: **Số ngày làm việc để xử lý** (`deadline_ngay_lv`), **Ngưỡng cảnh báo mức 1** (`canh_bao_muc_1`, % so với SLA, vd 70%), **Ngưỡng cảnh báo mức 2** (`canh_bao_muc_2`, vd 90%), **Ngưỡng quá hạn nghiêm trọng** (`qua_han_nghiem_trong`, vd 120%), công tắc bật/tắt gửi thông báo qua **Email** / **In-app** | Luôn |
| **Phân công mặc định** | `CAU_HINH_PHAN_CONG` (FR-II-NEW-01) | Bảng quy tắc gợi ý người xử lý khi có yêu cầu mới (SRS §3.4.3.48). Mỗi quy tắc gồm các trường: **Lĩnh vực PL** (`linh_vuc_id`, chọn từ danh mục Lĩnh vực), **Người xử lý** (`nguoi_xu_ly_id`, 1 tài khoản cụ thể), **Loại yêu cầu áp dụng** (`loai_yeu_cau` — 1 trong 4 giá trị: `HOI_DAP` / `VU_VIEC` / `TU_VAN_CS` / `TAT_CA`, mặc định `TAT_CA`), **Độ ưu tiên** (`uu_tien`, mặc định `1`), **Trạng thái quy tắc** (`trang_thai`: `KICH_HOAT` hoặc `VO_HIEU_HOA`), **Đơn vị** (`don_vi_id`). Khi CB NV phân công cho yêu cầu thuộc **FR-02 Hỏi đáp / FR-05 Vụ việc / FR-12 Tư vấn chuyên sâu**, hệ thống đọc bảng này để gợi ý người xử lý phù hợp theo lĩnh vực + độ ưu tiên | Luôn |
| **Mẫu phản hồi** | `MAU_PHAN_HOI` | Kho mẫu câu trả lời dùng lại (cho module **FR-02 Hỏi đáp**), phân loại theo lĩnh vực pháp luật. Mỗi mẫu gồm: **Tên mẫu** (`ten_mau`), **Lĩnh vực** (`linh_vuc_id`), **Nội dung mẫu** (`noi_dung`, soạn bằng Rich Text editor — có format đậm/nghiêng/bullet), **Trạng thái** (`trang_thai`) | Luôn |
| **Quy trình hỗ trợ** | ⚠️ **Tên entity chưa verify** — srs-fr-10 §3 dòng 1423-1430 mô tả Tab này nhưng KHÔNG định nghĩa entity cụ thể trong §3.4.3 | Bảng CRUD các bước trong quy trình hỗ trợ pháp lý linh hoạt. Mỗi bước gồm: **Thứ tự**, **Tên bước**, **SLA riêng cho bước** (số ngày làm việc), **Quy tắc phân công tự động**. **Lưu ý khi sửa quy trình:** hồ sơ đang xử lý vẫn giữ snapshot quy trình cũ; chỉ hồ sơ tạo mới (sau thời điểm thay đổi) mới áp dụng quy trình mới | Luôn (chỉ QTHT) |

**Xem chi tiết cần dữ liệu từ:** KHÔNG cần module khác (module gốc).

**🖐️ Nhập tay:** ✅ **Có** — Toàn bộ CRUD ở đây do `qtht_01` nhập tay trực tiếp. Không có API inbound. Đây là nơi seed data gốc cho hệ thống.

**CRUD chính (toàn bộ 🖐️ thủ công — không có state machine phức tạp):**

| Thao tác | Actor | Trigger | Màn hình | Dữ liệu nhập | Nguồn dropdown / Filter |
|----------|-------|---------|----------|--------------|-------------------------|
| **🖐️ Tạo Đơn vị** | `qtht_01` | [+ Thêm đơn vị con] trên node tree | **SCR-VIII-01** tab "Cơ quan ĐV" (UC103) | `ma_don_vi`, `ten_don_vi`, `cap ∈ {TW, BN, DP}`, `don_vi_cha_id`, địa chỉ, ĐT, email | `don_vi_cha_id` ← **cây DON_VI hiện có** (tree picker — cấp con phải là cấp cha +1) |
| **🖐️ Tạo Tài khoản** | `qtht_01` | [+ Thêm TK] | **SCR-VIII-03** Quản lý Tài khoản NSD | `username` (unique), `email`, `ho_ten`, `vai_tro_id`, `don_vi_id` | `vai_tro_id` ← `VAI_TRO` (quản lý ở SCR-VIII-02); `don_vi_id` ← **DON_VI filter theo cấp của vai trò** |
| **🖐️ Tạo Vai trò** | `qtht_01` | [+ Thêm vai trò] | **SCR-VIII-02** Quản lý Vai trò | `ten_vai_tro`, `mo_ta`, danh sách quyền hạn | `quyen_ids[]` ← danh sách quyền (set ở SCR-VIII-04) |
| **🖐️ Phân quyền chức năng** | `qtht_01` | Gán quyền | **SCR-VIII-04** Phân quyền Chức năng | Mapping vai_tro × quyen | — |
| **🖐️ Phân quyền dữ liệu** | `qtht_01` | Gán scope | **SCR-VIII-05** Phân quyền Dữ liệu | Scope `{don_vi_id, phạm vi đọc/ghi}` cho mỗi vai trò | `don_vi_id` ← DON_VI |
| **🖐️ Tạo Danh mục** | `qtht_01` | [+ Thêm mới] trên 1 trong 14 tab | SCR-VIII-01 | `loai` auto theo tab đang chọn, `ma`, `ten`, `mo_ta`, `thu_tu`, `trang_thai` | Tab đang chọn quyết định `loai` DM |
| Kích hoạt / Vô hiệu hóa Đơn vị | `qtht_01` | Toggle trạng thái | SCR-VIII-01 tab Cơ quan ĐV | — | Cảnh báo "Thay đổi cấp/đơn vị cha sẽ cập nhật chính sách phân quyền" khi đổi cấp/cha (srs-fr-10 §3 row 20) |
| Vô hiệu hóa Tài khoản | `qtht_01` | Toggle | SCR-VIII-03 | — | Guard: TK không đang phân công VV/Hỏi Đáp |
| **🖐️ Cấu hình SLA** | `qtht_01` | Form | SCR-VIII-06 Tab 1 (SLA) | Thời hạn xử lý (ngày làm việc) cho từng module: **Hỏi đáp** (`deadline_hoi_dap`), **Vụ việc** (`deadline_vu_viec`, mặc định `10`), **Chi trả** (`deadline_chi_tra`), **Hạn bổ sung hồ sơ** (`bo_sung_timeout` — xem BR-EC-16) | Nhập số ngày LV |
| **🖐️ Cấu hình Phân công** | `qtht_01` | [+ Thêm mapping] | SCR-VIII-06 Tab 2 (Phân công mặc định) | **Lĩnh vực PL** (`linh_vuc_id`), **Người xử lý** (`nguoi_xu_ly_id` — 1 tài khoản), **Loại yêu cầu áp dụng** (`loai_yeu_cau` ∈ `HOI_DAP` / `VU_VIEC` / `TU_VAN_CS` / `TAT_CA`), **Độ ưu tiên** (`uu_tien`, mặc định `1`), **Đơn vị** (`don_vi_id`) | Entity `CAU_HINH_PHAN_CONG` (FR-II-NEW-01) — mỗi dòng là 1 quy tắc gợi ý, được dùng làm nguồn dropdown phân công cho **FR-02 Hỏi đáp / FR-05 Vụ việc / FR-12 Tư vấn chuyên sâu** |
| **🖐️ Tạo Mẫu phản hồi** | `qtht_01` | Form | SCR-VIII-06 Tab 3 (Mẫu phản hồi) | **Tên mẫu** (`ten_mau`), **Lĩnh vực** (`linh_vuc_id`), **Nội dung mẫu** (`noi_dung_mau`, Rich text) | `linh_vuc_id` ← danh mục `LINH_VUC_PL` (FR-10) |

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

**Màn hình xem chi tiết:**
- SCR-IV-01: Danh sách TVV/CG/NHT (3 tab phân loại đối tượng)
- SCR-IV-02: Form Thêm/Sửa hồ sơ (5 accordion)
- SCR-IV-03: Chi tiết TVV/CG (5 tab)

**📑 Tabs SCR-IV-01 Danh sách Tư vấn viên — 5 tab filter `trang_thai` (theo srs-fr-04 §3 dòng 821-825 — SCR-IV-01 "Danh sách Tư vấn viên (trang chính)" của FR-IV-01 Quản lý Tư vấn viên):**

| Tab | Entity filter | Ghi chú |
|-----|---------------|---------|
| Đang hoạt động | Danh sách TVV đang hoạt động (`TU_VAN_VIEN WHERE trang_thai='DANG_HOAT_DONG'`) | Tab mặc định được chọn, kèm badge đếm số lượng |
| Tạm dừng | Danh sách TVV bị tạm dừng (`TU_VAN_VIEN WHERE trang_thai='TAM_DUNG'`) | Badge đếm số lượng |
| Mới đăng ký | Danh sách hồ sơ mới hoặc cần bổ sung (`TU_VAN_VIEN WHERE trang_thai IN ('MOI_DANG_KY','YEU_CAU_BO_SUNG')`) | Badge đỏ nếu số lượng >0. NHT / TVV / CG đều lưu chung trong entity `TU_VAN_VIEN` — phân biệt qua attribute role, không có entity riêng |
| Chờ thẩm định | Danh sách hồ sơ đang chờ thẩm định (`TU_VAN_VIEN WHERE trang_thai='DANG_THAM_DINH'`) | CB NV thao tác thẩm định 4 nhóm tiêu chí (Pháp lý / Năng lực / Hiệu quả / Mạng lưới) — gắn với FR-IV-06 Thẩm định hồ sơ TVV (UC44) |
| Chờ phê duyệt | Danh sách hồ sơ đã thẩm định, đang chờ CB PD duyệt (`TU_VAN_VIEN WHERE trang_thai='CHO_PHE_DUYET'`) | CB PD thao tác phê duyệt / từ chối + Batch approve — gắn với FR-IV-07 Phê duyệt hồ sơ TVV (UC45) |

**📑 Accordion SCR-IV-02 Form Thêm/Sửa TVV — 5 accordion (theo srs-fr-04 §3 dòng 862-870):**

| Accordion | Data (field chính) | Điều kiện |
|-----------|---------------------|-----------|
| **1. Thông tin cá nhân** | **Ảnh chân dung** (≤5MB, `.jpg`/`.png`), **Họ tên*** (`ho_ten`, tối đa 200 ký tự — lỗi `ERR-TVV-01`), **Ngày sinh*** (`ngay_sinh`), **Giới tính*** (`gioi_tinh` — `NAM` hoặc `NU`), **CCCD/CMND*** (`cmnd_cccd`, tối đa 12 ký tự, duy nhất — lỗi `ERR-TVV-02`), **Email*** (`email`, đúng chuẩn RFC 5322 — lỗi `ERR-TVV-03`), **Số điện thoại*** (`sdt`, 10-11 số), **Địa chỉ*** (`dia_chi`). (Dấu `*` = bắt buộc) | Luôn |
| **2. Thông tin nghề nghiệp** | **Trình độ*** (`trinh_do` — Cử nhân / Thạc sĩ / Tiến sĩ / Khác), **Chứng chỉ hành nghề** (`chung_chi_hanh_nghe`), **Số thẻ hành nghề** (`so_the_hanh_nghe`), **Kinh nghiệm tư vấn** (`kinh_nghiem_tu_van`, tối đa 5000 ký tự) | Luôn |
| **3. Tổ chức & Mạng lưới** | **Tổ chức chính*** (`to_chuc_chinh`, chọn từ danh mục `TO_CHUC_TU_VAN` — lỗi `ERR-TVV-04`), **Tổ chức đối tác** (`to_chuc_doi_tac[]`, chọn nhiều — lưu bảng N:N qua `TVV_TO_CHUC`), **Lĩnh vực PL phụ trách*** (`linh_vuc_pl`, multi-select, phải chọn ≥1), **Địa bàn hoạt động*** (`dia_ban_hoat_dong`, chọn nhiều tỉnh/TP từ cây `DON_VI`) | Luôn |
| **4. File đính kèm** | **Bằng cấp/Chứng chỉ*** (multi upload, mỗi file ≤10MB, tổng ≤50MB, định dạng PDF — lỗi `ERR-DK-02` / `ERR-DK-03`), **Thẻ hành nghề** (PDF ≤10MB) | Luôn |
| **5. Ghi chú** | Ghi chú tự do, tối đa 5000 ký tự | Luôn |

**📑 Tabs SCR-IV-03 Chi tiết TVV/CG — 5 tab (theo srs-fr-04 §3 dòng 884 + §3.4.3.28-29):**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Hồ sơ** | Dữ liệu TVV hiện tại: `TU_VAN_VIEN` + `HO_SO_TU_VAN_VIEN` (§3.4.3.28, 1-1) + danh sách tổ chức đối tác `TVV_TO_CHUC` (§3.4.3.4b, N-N) | Hiển thị 5 accordion con ở chế độ chỉ đọc (cùng cấu trúc với form SCR-IV-02): Cá nhân / Nghề nghiệp / Tổ chức & Mạng lưới / File đính kèm / Ghi chú | Luôn |
| **Thẩm định** | Lưu vào `HO_SO_TU_VAN_VIEN.trang_thai_tham_dinh` (`CHUA_THAM_DINH` / `DANG_THAM_DINH` / `DAT` / `KHONG_DAT`) + `HO_SO_TU_VAN_VIEN.ket_qua_tham_dinh` (text). **Lưu ý:** SRS không có entity `THAM_DINH_TVV` riêng — kết quả thẩm định lưu ngay trong `HO_SO_TU_VAN_VIEN` | Form chấm thẩm định theo 4 nhóm tiêu chí: **Pháp lý** (Pass/Fail), **Năng lực**, **Hiệu quả**, **Mạng lưới**. Mỗi tiêu chí lấy từ `TIEU_CHI_DANH_GIA` (§3.4.3.42) với `nhom_tieu_chi='THAM_DINH_TVV'`. Cuối form có trường **Kết luận** | Chỉ hiển thị khi TVV đang ở trạng thái `DANG_THAM_DINH` hoặc `CHO_PHE_DUYET` |
| **Năng lực** | Lưu trong các cột của `HO_SO_TU_VAN_VIEN`: `bang_cap_chi_tiet`, `chung_chi_chi_tiet`, `kinh_nghiem_chi_tiet` (cả 3 đều là JSON array kiểu `text(long)`, §3.4.3.28) + `noi_dung_tom_tat` | Hiển thị chi tiết bằng cấp / chứng chỉ / kinh nghiệm dạng cấu trúc JSON + đoạn tóm tắt năng lực | Luôn |
| **Lịch sử hỗ trợ** | Tổng hợp từ 3 nguồn: **FR-05 Vụ việc** (`VU_VIEC WHERE nguoi_ho_tro_id=<current>`), **FR-12 Tư vấn chuyên sâu** (`NOI_DUNG_TU_VAN_CS WHERE chuyen_gia_id=<current>`, §3.4.3.9), và bảng lịch sử `LICH_SU_HO_TRO_TVV` (§3.4.3.30) | Bảng các vụ việc + nội dung TV chuyên sâu TVV đã tham gia + 3 chỉ số KPI (Tổng VV, Đã hoàn thành, Điểm trung bình) + timeline thời gian | Luôn |
| **Đánh giá** | `DANH_GIA_TU_VAN_VIEN WHERE tu_van_vien_id=<current>` (§3.4.3.29) | **Điểm tổng** (`diem`, thang 0-10) + 4 điểm thành phần: **Điểm Pháp lý** (`diem_phap_ly`), **Điểm Năng lực** (`diem_nang_luc`), **Điểm Hiệu quả** (`diem_hieu_qua`), **Điểm Mạng lưới** (`diem_mang_luoi`) + **Nhận xét** (`nhan_xet`) + **Ngày ĐG** (`ngay_danh_gia`) + form tạo đánh giá mới | Luôn (form ĐG chỉ mở khi user có quyền chấm) |

**Xem chi tiết cần dữ liệu từ:**
- **FR-10 Quản trị** → danh mục Lĩnh vực PL, Tổ chức tư vấn, Học vị, Chức danh
- **FR-10 Quản trị** → cây Đơn vị `DON_VI` (Sở TP quản lý TVV cấp ĐP)
- **FR-05 Vụ việc** → `VU_VIEC` (cho tab Lịch sử hỗ trợ)
- **FR-12 Tư vấn chuyên sâu** → `YEU_CAU_TV_CS` (cho tab Lịch sử của Chuyên gia)

**🖐️ Nhập tay:** ✅ **Có, 2 kênh:**
- **Tự đăng ký (NHT public)** — NHT đăng ký tham gia MLTV qua form public — trạng thái ban đầu `MOI_DANG_KY`
- **CB NV tạo proxy (CSKH)** — `cb_nv_dp_01` tạo hộ tại SCR-IV-02 (Form Thêm/Sửa TVV) → cũng tạo hồ sơ ở `MOI_DANG_KY`

**Transition hồ sơ TVV/CG (SM-TVV — 9 states theo srs-v3.md §C.3):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `MOI_DANG_KY` | NHT | **NHT đăng ký tham gia MLTV (FR-IV-03)** | `ho_ten`, CCCD, học vị, chứng chỉ hành nghề, lĩnh vực chuyên môn, địa bàn hoạt động, file bằng cấp, `to_chuc_tu_van_id` | `to_chuc_tu_van_id` ← FR-10 DANH_MUC loại TO_CHUC_TU_VAN; `linh_vuc_chuyen_mon[]` ← FR-10 DANH_MUC LINH_VUC_PL | Form public (NHT chưa login CMS) |
| — | `MOI_DANG_KY` | `cb_nv_dp_01` | **🖐️ Thêm proxy (CSKH)** | Cùng trường | Tương tự | SCR-IV-02 Form Thêm/Sửa |
| `MOI_DANG_KY` | `CHO_THAM_DINH` | `cb_nv_dp_01` | [Tiếp nhận] (FR-IV-06) | Guard: hồ sơ đủ giấy tờ | — | SCR-IV-03 action-bar |
| `CHO_THAM_DINH` | `DANG_THAM_DINH` | `cb_nv_dp_01` | [Bắt đầu thẩm định] (FR-IV-06) | Ghi thời điểm bắt đầu | — | SCR-IV-03 Tab "Thẩm định" |
| `DANG_THAM_DINH` | `YEU_CAU_BO_SUNG` | `cb_nv_dp_01` | Hồ sơ chưa đầy đủ (FR-IV-06) | Danh sách thiếu, TB NHT | — | SCR-IV-03 |
| `YEU_CAU_BO_SUNG` | `DANG_THAM_DINH` | NHT | Bổ sung xong (FR-IV-06) | File bổ sung | — | Form public hoặc SCR-IV-02 |
| `DANG_THAM_DINH` | `CHO_PHE_DUYET` | `cb_nv_dp_01` | Thẩm định đạt 4 nhóm tiêu chí (FR-IV-06, BR-LEGAL-04) | Ghi kết quả thẩm định (Pháp lý Pass/Fail, Năng lực, Hiệu quả, Mạng lưới) | — | SCR-IV-03 Tab "Thẩm định" |
| `CHO_PHE_DUYET` | `DANG_HOAT_DONG` | `cb_pd_dp_01` | [Duyệt — công nhận] (FR-IV-07, BR-AUTH-05) | Cùng cấp; audit + `ngay_cong_nhan` | — | SCR-IV-03 action-bar |
| `CHO_PHE_DUYET` | `TU_CHOI` | `cb_pd_dp_01` | [Từ chối] (FR-IV-07) | `ly_do` ≥10 ký tự (BR-FLOW-04) | — | SCR-IV-03 |
| `TU_CHOI` | `CHO_THAM_DINH` | NHT | Nộp lại hồ sơ (FR-IV-06) | NHT cập nhật hồ sơ → reset thẩm định | — | Form public hoặc SCR-IV-02 |
| `DANG_HOAT_DONG` | `TAM_DUNG` | `cb_nv_dp_01` | [Tạm dừng] (FR-IV-12) | Lý do | — | SCR-IV-03 |
| `TAM_DUNG` | `DANG_HOAT_DONG` | `cb_nv_dp_01` | [Kích hoạt lại] (FR-IV-12) | — | — | SCR-IV-03 |
| `DANG_HOAT_DONG` | `VO_HIEU_HOA` | `cb_nv_dp_01` | [Vô hiệu hóa] (FR-IV-12) | Lý do | **Guard: không có VU_VIEC / HOI_DAP đang xử lý** gắn TVV (lookup FR-02/FR-05) | SCR-IV-03 |
| `TAM_DUNG` | `VO_HIEU_HOA` | `cb_nv_dp_01` | [Vô hiệu hóa] (FR-IV-12) | Lý do | **Guard** như trên | SCR-IV-03 |
| `VO_HIEU_HOA` | `DANG_HOAT_DONG` | `cb_nv_dp_01` | [Khôi phục] (FR-IV-12) | Quyết định từng trường hợp | — | SCR-IV-03 |

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
| Công khai | `cb_nv_<cap>_01` | Toggle `la_cong_khai` | SCR-VII-02 | — | Đẩy API Cổng PLQG (FR-16) |
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
| **Phân công NHT/TVV** | `PHAN_CONG WHERE vu_viec_id=<current>` + join sang `TU_VAN_VIEN` | Thông tin TVV được phân công: Tên TVV, lĩnh vực chuyên môn, địa bàn, ngày phân công, **trạng thái xác nhận tham gia** (`CHO_XAC_NHAN` / `DA_XAC_NHAN` / `TU_CHOI`) | Chỉ hiển thị khi VV đã qua `DA_PHAN_CONG` |
| **Kết quả Hỗ trợ** | `KET_QUA_HO_TRO WHERE vu_viec_id=<current>` | **Nội dung kết quả** (TVV cập nhật), **File kết quả**, **Kết luận cuối cùng** (CB NV tổng hợp) | Chỉ hiển thị khi VV đã qua `DANG_XU_LY` |
| **Phê duyệt** | `PHE_DUYET WHERE entity='VU_VIEC' AND entity_id=<current>` | **Quyết định** (Duyệt / Từ chối), **Người phê duyệt** (`nguoi_phe_duyet_id`), **Thời gian**, **Lý do từ chối** (nếu có) | Chỉ hiển thị khi VV đã qua `CHO_PHE_DUYET` |
| **Đánh giá** | `DANH_GIA_VV WHERE vu_viec_id=<current>` | **Điểm đánh giá** (`diem_danh_gia`, thang 0-10) theo 3 tiêu chí: **Chất lượng** / **Thời gian** / **Thái độ** + **Điểm tổng** + **Nhận xét** | Chỉ hiển thị khi VV ở `HOAN_THANH` hoặc `DA_DANH_GIA` |

**Xem chi tiết cần dữ liệu từ:**
- **FR-07 Doanh nghiệp** → `DOANH_NGHIEP` (để chọn `doanh_nghiep_id`)
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (entity duy nhất chứa cả NHT/TVV/CG — phân biệt qua role attribute) để chọn `nguoi_ho_tro_id`
- **FR-10 Quản trị** → danh mục Lĩnh vực (`linh_vuc_id`), Loại hình HT (`loai_hinh_ht_id`)
- **FR-10 Quản trị** → `CAU_HINH_SLA` (thời hạn xử lý 10 ngày làm việc theo NĐ55 Điều 9)
- **FR-10 Quản trị** → `TAI_KHOAN` (`nguoi_tiep_nhan_id`, `nguoi_phe_duyet_id`)
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
| `CHO_TIEP_NHAN` | `DA_TIEP_NHAN` | `cb_nv_<cap>_01` | [Tiếp nhận] | Hệ thống tự gán **Người tiếp nhận** (`nguoi_tiep_nhan_id`) + **Ngày tiếp nhận** (`ngay_tiep_nhan`) + **Hạn xử lý** (`deadline` = 10 ngày làm việc theo NĐ55 Điều 9) | `CAU_HINH_SLA` ← **FR-10 Quản trị** | SCR-V.I-03 |
| `DA_TIEP_NHAN` | `DANG_KIEM_TRA` | `cb_nv_<cap>_01` | [Bắt đầu kiểm tra] (UC56, FR-V.I-06) | Checklist 6 hạng mục lấy từ cấu hình UC106: **Mẫu 01**, **Giấy ĐKKD**, **Quy mô DN**, **HĐ Tư vấn**, **Văn bản TV đầy đủ**, **Văn bản TV loại BMKD** | — | SCR-V.I-03 |
| `DANG_KIEM_TRA` | `DA_PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công TVV/NHT (UC59, FR-V.I-09)** | **Người hỗ trợ** (`nguoi_ho_tro_id`, bắt buộc) | Dropdown chọn TVV từ `TU_VAN_VIEN` — áp dụng quy tắc ưu tiên `BR-CALC-05` (theo NĐ55 Điều 4) với các điều kiện lọc:<br>• TVV đang `DANG_HOAT_DONG` **VÀ** có `la_cong_khai = 1`<br>• **Lĩnh vực chuyên môn** khớp `linh_vuc_id` của VV<br>• **Địa bàn** phù hợp (cùng Sở TP — lọc kép theo `BR-AUTH-10`)<br>• **Ưu tiên theo NĐ55 Điều 4**: (1) DN do phụ nữ làm chủ, (2) DN có nhiều LĐ nữ, (3) DN có ≥30% LĐ khuyết tật, (4) FIFO (DN nộp trước xử lý trước)<br>• CB NV được quyền override nếu muốn chọn TVV khác gợi ý | SCR-V.I-03 Modal phân công NHT/TVV |
| `DANG_KIEM_TRA` | `YEU_CAU_BO_SUNG` | `cb_nv_<cap>_01` | Thiếu HS | Danh sách item thiếu | — | SCR-V.I-03 |
| `DANG_KIEM_TRA` | `TU_CHOI` | `cb_nv_<cap>_01` | Không đạt | Lý do từ chối | — | SCR-V.I-03 |
| `YEU_CAU_BO_SUNG` | `DANG_KIEM_TRA` | DN | Bổ sung HS (qua DVC) | File bổ sung | — | API inbound |
| `YEU_CAU_BO_SUNG` | `TU_CHOI` | System | **Auto (BR-EC-16)**: quá `bo_sung_timeout` ngày LV, hoặc >3 lần bổ sung (BR-EC-15) | — | `CAU_HINH_SLA.bo_sung_timeout` ← FR-10 | Auto |
| `DA_PHAN_CONG` | `DANG_XU_LY` | `tvv_01` / `nht_01` | Xác nhận tham gia | — | — | SCR-V.I-03 |
| `DA_PHAN_CONG` | `DA_TIEP_NHAN` | `tvv_01` / `nht_01` | Từ chối phân công | Lý do | — | SCR-V.I-03 (quay lại chọn TVV khác) |
| `DANG_XU_LY` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Trình duyệt] | Guard: TVV đã cập nhật KQ | — | SCR-V.I-03 |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] | Cùng cấp (BR-AUTH-05) — chỉ CB PD cùng đơn vị với CB NV trình | — | SCR-V.I-03 |
| `CHO_PHE_DUYET` | `DANG_XU_LY` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do` ≥10 ký tự (BR-FLOW-04) | — | SCR-V.I-03 |
| `DA_DUYET` | `HOAN_THANH` | `cb_nv_<cap>_01` | [Đóng hồ sơ] | `ket_qua_tom_tat`, `ngay_hoan_thanh` | — | SCR-V.I-03 |
| `HOAN_THANH` | `DA_DANH_GIA` | `cb_nv_<cap>_01` / người chấm | Thuộc đợt ĐG (UC67) | `diem_danh_gia` (0-10) | Chấm trong đợt FR-08 | SCR-VI-01 Tab Thực hiện chấm điểm |
| `TU_CHOI` | `DA_TIEP_NHAN` | `qtht_01` / `cb_nv_<cap>_01` | Admin override / DN khiếu nại | Lý do mở lại | — | SCR-V.I-03 |

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
- **FR-04 CG/TVV** → `TU_VAN_VIEN` (cho dropdown phân công — NHT/TVV phân biệt qua role attribute)
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
| `TIEP_NHAN` | `DANG_XU_LY` | `cb_nv_<cap>_01` | **Phân công (UC15)** | **Người xử lý** (`nguoi_xu_ly_id`, bắt buộc), **Ghi chú** (`ghi_chu`, tùy chọn), **Thời hạn** (`thoi_han`, tùy chọn — mặc định lấy theo deadline SLA) | Dropdown chọn tài khoản từ `TAI_KHOAN` với các điều kiện:<br>• Chỉ lấy TK đang `HOAT_DONG` (TK bị khóa sẽ disabled kèm tooltip — lỗi `ERR-PC-01`)<br>• Hệ thống tự gợi ý từ bảng `CAU_HINH_PHAN_CONG` (FR-II-NEW-01, do QTHT cấu hình) — khớp `linh_vuc_id` của câu hỏi<br>• Mỗi dòng hiển thị: Họ tên / Đơn vị / Lĩnh vực chuyên môn / **Workload hiện tại** / Mức ưu tiên<br>• Thứ tự sắp xếp: **độ ưu tiên tăng dần → workload tăng dần**<br>• Nếu workload vượt ngưỡng → badge đỏ "Quá tải (N yêu cầu)" — chỉ **cảnh báo, KHÔNG chặn** (`WRN-PC-01`) | **SCR-II-03 Modal phân công** (overlay trên SCR-II-02) |
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
| **Thông tin cơ bản** | `NOI_DUNG_TU_VAN_CS` + join sang `DOANH_NGHIEP`, `TU_VAN_VIEN` | **Mã nội dung** (tự sinh), **Doanh nghiệp** (dropdown có search — khi chọn, hệ thống tự hiện MST / địa chỉ / người đại diện từ **FR-07 Doanh nghiệp**), **Chuyên gia** (dropdown lọc TVV đang `DANG_HOAT_DONG` từ **FR-04 CG/TVV** — khi chọn hiện chuyên môn / SĐT / email), **Lĩnh vực PL** (từ danh mục **FR-10 Quản trị**), **Ngày tư vấn**, **Ghi chú** (tối đa 2000 ký tự) | Luôn |
| **Nội dung tư vấn** | `NOI_DUNG_TU_VAN_CS WHERE id=<current>` | **Nội dung tư vấn chi tiết** (soạn bằng **Rich Text Editor**, tối đa 50KB) + **Tóm tắt** (tối đa 500 ký tự) | Luôn |
| **Tư liệu PL liên kết** (UC152 — Quản lý tư liệu pháp lý của vụ việc, FR-X.1-06) | `TU_LIEU_PHAP_LY_VV WHERE noi_dung_tv_id=<current>` (entity §3.4.2 srs-v3.md:1025 — `Tư liệu pháp lý của vụ việc`) | Bảng tư liệu pháp lý gắn với nội dung TV — cột: **Tên** / **Loại** / **Trạng thái** (`NHAP` / `CONG_KHAI`) / **Số file** / **Hành động** + nút [+ Thêm tư liệu] thao tác inline | Luôn |
| **Đánh giá chất lượng** (UC153 — Tiếp nhận đánh giá chất lượng TV với CG, FR-X.1-07) | `DANH_GIA_CHAT_LUONG_TV WHERE tu_van_cs_id=<current>` (entity §3.4.2 srs-v3.md:1026 — `Đánh giá chất lượng tư vấn với chuyên gia`) | Bảng đánh giá DN — cột: **Mã ĐG** / **Điểm** (thang 1-5 sao) / **Nhận xét DN** / **Ngày đánh giá**. Hiển thị thêm **Điểm trung bình** + **Tổng số lượt đánh giá**. Dữ liệu đến từ **API nhận từ Cổng PLQG** (DN đánh giá ngay trên Cổng) | Chỉ hiển thị ở chế độ "Xem chi tiết" |
| **Nhật ký thao tác** | `AUDIT_LOG WHERE entity='NOI_DUNG_TU_VAN_CS' AND entity_id=<current>` | Timeline các thao tác: `dd/mm/yyyy HH:mm` · Người thực hiện · Hành động (bao gồm cả chuyển trạng thái + thao tác CUD — tạo/sửa/xóa) | Chỉ hiển thị ở chế độ "Xem chi tiết" |

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
- Lỗi ERR-TVCS-02 nếu chọn Chuyên gia `NGUNG_HOAT_DONG` → cần đảm bảo CG ở state `DANG_HOAT_DONG` (FR-04)

**Transition (SM-TVCS):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `TIEP_NHAN` | DN | **Gửi YC qua Cổng PLQG (UC149, API nhận)** | **Mã số thuế** (`ma_so_thue`), **Nội dung yêu cầu**, **Lĩnh vực PL**, **File đính kèm** (hệ thống tự giải mã + quét virus) | — | API nhận từ ngoài |
| — | `TIEP_NHAN` | `cb_nv_<cap>_01` | **🖐️ Thêm thủ công (UC147)** | **DN** (`doanh_nghiep_id`, bắt buộc), **Chuyên gia** (`chuyen_gia_id`, bắt buộc), **Lĩnh vực PL** (`linh_vuc_id`, bắt buộc), **Nội dung tư vấn** (`noi_dung_tu_van`, Rich Text, tối đa 50KB), **Tóm tắt** (`tom_tat`, tối đa 500 ký tự), **Ngày tư vấn** (`ngay_tu_van`, bắt buộc), **Ghi chú** (`ghi_chu`, tối đa 2000 ký tự) | `doanh_nghiep_id` ← **FR-07 Doanh nghiệp** (dropdown có search — khi chọn hệ thống tự hiện MST / địa chỉ / người đại diện)<br>`chuyen_gia_id` ← **FR-04 CG/TVV**, lọc `trang_thai=DANG_HOAT_DONG` (nếu CG đã ngừng → lỗi `ERR-TVCS-02`)<br>`linh_vuc_id` ← danh mục **FR-10 Quản trị** | SCR-X1-02 Accordion "Thông tin cơ bản" |
| `TIEP_NHAN` | `PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công CG (UC147 — action Phân công)** | **Chuyên gia** (`chuyen_gia_id`) + **Ghi chú** + **Thông tin SLA** hiển thị | Dropdown chọn CG từ `TU_VAN_VIEN` với:<br>• Chỉ lấy CG đang `DANG_HOAT_DONG`<br>• Hệ thống **gợi ý Top 5** CG khớp lĩnh vực<br>• Thứ tự sắp xếp: **điểm đánh giá TB giảm dần → workload tăng dần**<br>• Có **thanh search** để tìm thủ công<br>• Hiển thị banner thông báo: SLA 2 ngày làm việc để CG xác nhận tham gia | SCR-X1-02 modal overlay Phân công CG |
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
| — | `DU_THAO` | `cb_nv_<cap>_01` | **🖐️ Tạo KH thủ công** | **Tên khóa học** (`ten_khoa_hoc`, bắt buộc), **CTĐT cha** (`ctdt_id`, bắt buộc), **Hình thức** (`hinh_thuc` ∈ `TRUC_TUYEN` / `TRUC_TIEP`, bắt buộc), **Ngày bắt đầu** (`ngay_bat_dau`, bắt buộc), **Ngày kết thúc** (`ngay_ket_thuc`, phải > ngày bắt đầu), **Số lượng HV tối đa** (`so_luong_toi_da`, ≥1), **Bài giảng** (`bai_giang_ids`, chọn nhiều), **Lĩnh vực PL** (`linh_vuc_id`) | `ctdt_id` ← dữ liệu nội bộ FR-03, dropdown chỉ lấy CTĐT đã `DA_DUYET` (không cho chọn CTĐT đang `DU_THAO`)<br>`bai_giang_ids` ← kho `BAI_GIANG` nội bộ FR-03<br>`linh_vuc_id` ← danh mục **FR-10 Quản trị**<br>**Giảng viên** chọn từ `TU_VAN_VIEN` (**FR-04 CG/TVV**), lọc `trang_thai=DANG_HOAT_DONG` | SCR-III-02 Tab Thông tin |
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
| — | `DANG_THUC_HIEN` | `cb_nv_<cap>_01` | **🖐️ Tạo HĐ thủ công (UC163)** — mặc định vào thẳng `DANG_THUC_HIEN` | Nhập 12 trường qua 4 accordion: **Thông tin chung** + **Vụ việc liên kết** + **Mốc tiến độ** + **Thanh toán giai đoạn** | `tvv_id` ← **FR-04 CG/TVV**, lọc `trang_thai=DANG_HOAT_DONG`<br>`vu_viec_ids` ← **FR-05 Vụ việc** qua modal multi-select, lọc theo `BR-AUTH-08` (chỉ VV thuộc đơn vị của user)<br>`ben_a` hệ thống tự điền từ `don_vi_id` của user | SCR-X3-01 Form |
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

**📑 Section SCR-V.II-02 Chi tiết Hồ sơ Chi trả — 8 section:**

| Section | Entity + Filter | Data | Điều kiện hiển thị |
|---------|-----------------|------|--------------------|
| **Thông tin DN** (read-only) | DN nộp hồ sơ: `DOANH_NGHIEP WHERE id=<ho_so.doanh_nghiep_id>` | Tên DN, MST, địa chỉ, loại DN, **Quy mô DN** (trường quan trọng — quyết định mức hỗ trợ theo `BR-CALC-01`), người đại diện. Dữ liệu tự động lấy từ payload DVC gửi sang | Luôn |
| **Thông tin tư vấn** (read-only) | `VU_VIEC WHERE id=<ho_so.vu_viec_id>` + join `TU_VAN_VIEN` + `HOP_DONG_TU_VAN` | **Vướng mắc** (mô tả VV gốc lấy từ **FR-05 Vụ việc**), **Tên TVV**, **Phí tư vấn**, **Số tiền DN đề nghị chi trả** (`so_tien_de_nghi`), **Số HĐ tư vấn** (lấy từ **FR-14 Hợp đồng**) | Luôn |
| **Kiểm tra Hồ sơ** | `KIEM_TRA_HS_CHI_TRA WHERE ho_so_id=<current>` | Checklist 18 trường theo Mẫu 01 NĐ55 (mỗi trường tick Đạt / Không đạt), ô **Kết quả kiểm tra**, ô **Lý do** (nếu không đạt), **Đếm số lần yêu cầu bổ sung** (tối đa 3 lần) | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_KIEM_TRA` |
| **Đánh giá Tiêu chí** | `DANH_GIA_HO_SO WHERE ho_so_id=<current>` | **Mức hỗ trợ (%)** (`muc_ho_tro_phan_tram`) — áp dụng quy tắc `BR-CALC-01` theo quy mô DN, **Trần hỗ trợ/năm** (`tran_ho_tro_nam`), **Đã chi trong năm** (`da_chi_trong_nam`), **Số tiền được duyệt** (`so_tien_duoc_duyet` — hệ thống **tự tính theo công thức `BR-CALC-02`**: `MIN(so_tien_de_nghi, phi_tu_van × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)`), **Ghi chú** | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_DANH_GIA` |
| **Thẩm định** | `THAM_DINH_HS WHERE ho_so_id=<current>` | Checklist đối chiếu (khớp số liệu, quy mô DN), ô **Kết quả thẩm định**, ô **Lý do**, nút [Trình phê duyệt] | Chỉ hiển thị khi hồ sơ ở trạng thái `DANG_THAM_DINH` |
| **Phê duyệt** | `PHE_DUYET WHERE entity='HO_SO_CHI_TRA' AND entity_id=<current>` | Hiển thị tóm tắt số tiền được duyệt + nút [Duyệt] / [Từ chối] (chỉ CB PD cùng cấp với CB NV trình mới action được) | Chỉ hiển thị khi hồ sơ ở trạng thái `CHO_PHE_DUYET` |
| **Cập nhật Thanh toán** | `HO_SO_CHI_TRA` | **Số tiền thực chi** (`so_tien_thuc_tra`, phải ≤ `so_tien_duoc_duyet`), **Ngày thanh toán** (`ngay_thanh_toan`), **Số biên nhận** (`so_bien_nhan`), **Ghi chú** | Chỉ hiển thị khi hồ sơ ở trạng thái `DA_DUYET` |
| **Timeline audit log** | `AUDIT_LOG WHERE entity='HO_SO_CHI_TRA' AND entity_id=<current>` | Lịch sử chuyển trạng thái + thao tác CUD + phê duyệt theo timeline thời gian | Luôn |

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

**Transition (SM-CHITRA):**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `CHO_TIEP_NHAN` | DN | **Nộp Mẫu 01 NĐ55 qua DVC (UC68, API nhận)** — **NGUỒN DUY NHẤT** | Mẫu 01 gồm 18 trường: **Mã hồ sơ DVC** (`ma_ho_so_dvc`), **MST** (`ma_so_thue`), **VV gốc** (`vu_viec_id`), **Phí tư vấn** (`phi_tu_van`), **Số tiền đề nghị** (`so_tien_de_nghi`), chứng từ,... | — | API nhận từ ngoài (❌ **KHÔNG có màn nhập tay trong CMS**) |
| — | `CHO_TIEP_NHAN` | DN | **Nhập trực tiếp (chuyên trang Cổng PLQG — không phải CMS)** | DN login vào chuyên trang, submit Mẫu 01 qua API (tuân theo `BR-AUTH-11`) | — | Chuyên trang DN trên Cổng PLQG (không phải CMS) |
| `CHO_TIEP_NHAN` | `DANG_KIEM_TRA` | `cb_nv_<cap>_01` | [Tiếp nhận] | — | Hệ thống tự điền `vu_viec_id`, `doanh_nghiep_id`, `tu_van_vien_id` từ Mẫu 01 — các trường này đều là FK trỏ sang **FR-05 Vụ việc** / **FR-07 Doanh nghiệp** / **FR-04 CG/TVV** (hệ thống validate các FK này có tồn tại) | SCR-V.II-02 |
| `DANG_KIEM_TRA` | `DANG_DANH_GIA` | `cb_nv_<cap>_01` | Đạt checklist | Tick checklist (giống cấu trúc UC106 của FR-05) | — | SCR-V.II-02 |
| `DANG_KIEM_TRA` | `YEU_CAU_BO_SUNG` | `cb_nv_<cap>_01` | Thiếu hồ sơ | Liệt kê danh sách thiếu + hệ thống gửi thông báo về DVC | — | SCR-V.II-02 |
| `YEU_CAU_BO_SUNG` | `DANG_KIEM_TRA` | DN | Bổ sung qua DVC | DN upload file bổ sung qua DVC | — | API nhận từ ngoài |
| `YEU_CAU_BO_SUNG` | `TU_CHOI` | System | **Tự động (BR-EC-16)** — khi quá hạn `bo_sung_timeout` hoặc DN đã bổ sung >3 lần (`BR-EC-15`) | — | `CAU_HINH_SLA` ← **FR-10 Quản trị** | Auto |
| `DANG_DANH_GIA` | `DANG_THAM_DINH` | `cb_nv_<cap>_01` | Đánh giá mức hỗ trợ | Hệ thống tra cứu **Quy mô DN** (`quy_mo_dn`) từ **FR-07 Doanh nghiệp** → áp dụng `BR-CALC-01` (tỷ lệ mức hỗ trợ theo quy mô: **DN siêu nhỏ**: 100% chi phí, trần 3 triệu/năm · **DN nhỏ**: tối đa 30%, trần 5 triệu/năm · **DN vừa**: tối đa 10%, trần 10 triệu/năm — theo NĐ18/2026) → áp dụng công thức `BR-CALC-02`: `so_tien_duoc_duyet = MIN(so_tien_de_nghi, phi_tu_van × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)`. **Lưu ý:** trần hỗ trợ reset về 0 vào ngày 1/1 hằng năm | `quy_mo_dn` ← **FR-07 Doanh nghiệp** | SCR-V.II-02 Section Đánh giá |
| `DANG_THAM_DINH` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Trình duyệt] | Guard: KQ thẩm định đạt | — | SCR-V.II-02 Section Thẩm định |
| `CHO_PHE_DUYET` | `DA_DUYET` | `cb_pd_<cap>_01` | [Duyệt] | `so_tien_duyet`, ghi chú (cùng cấp BR-AUTH-05) | — | SCR-V.II-02 |
| `CHO_PHE_DUYET` | `DANG_THAM_DINH` | `cb_pd_<cap>_01` | [Từ chối] | `ly_do_tu_choi` ≥10 ký tự (BR-FLOW-04) | — | SCR-V.II-02 |
| `DA_DUYET` | `DA_THANH_TOAN` | `cb_nv_<cap>_01` | Cập nhật thanh toán | **Số tiền thực chi** (`so_tien_thuc_tra`, phải ≤ `so_tien_duyet`), **Ngày thanh toán** (`ngay_thanh_toan`), **Số biên nhận** (`so_bien_nhan`) | — | SCR-V.II-02 Section Thanh toán |
| `CHO_TIEP_NHAN` | `HUY` | DN | Rút hồ sơ (điều kiện: hồ sơ chưa chuyển qua `DANG_DANH_GIA`) | — | — | API nhận từ ngoài |

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
### ⑬ FR-08 · Đánh giá Hiệu quả (Nhóm VI)
**Login:**
- Lập đợt + chọn VV + phân công: `cb_nv_<cap>_01` (mỗi 6 tháng/năm)
- Chấm điểm: `cb_nv_<cap>_01` hoặc `cg_01` được phân công (`Người đánh giá`)
- Duyệt phân công + duyệt BC: `cb_pd_<cap>_01`

**Màn hình xem chi tiết:**
- SCR-VI-01: **Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1)** — 1 màn duy nhất gộp danh sách + chi tiết 4 tab + form chấm điểm (srs-fr-08 §3 dòng 735). SCR-VI-02/03 KHÔNG tồn tại trong SRS v2.1.

**📑 Tabs SCR-VI-01 (khi xem chi tiết 1 đợt ĐG) — 4 tab:**

| Tab | Entity + Filter | Data | Điều kiện hiển thị |
|-----|-----------------|------|--------------------|
| **Tiêu chí** | Các tiêu chí của đợt: `TIEU_CHI_DOT_DG WHERE dot_dg_id=<current>` + tiêu chí master từ `TIEU_CHI_DANH_GIA` (FR-10 Quản trị) | Bảng tiêu chí — cột: **Tên** / **Mô tả** / **Điểm tối đa** / **Trọng số** (`trong_so`) / **Thứ tự**. Hiển thị **Tổng trọng số realtime** — cảnh báo đỏ nếu ≠ 100%, **chặn cứng** khi nhấn trình duyệt nếu tổng chưa đủ 100% | Luôn |
| **Phân công** | `PHAN_CONG_DANH_GIA WHERE dot_dg_id=<current>` | Bảng phân công — cột: **Người ĐG** / **Vai trò** (`TRUONG_NHOM` / `DANH_GIA_VIEN`) / **Lĩnh vực phụ trách** / **Số đợt đã tham gia**. Các điều kiện chặn: **≥1 người** + **≥1 Trưởng nhóm** + không được phân công trùng lặp. Nút [Trình duyệt phân công] / [Duyệt phân công] | Luôn |
| **Thực hiện chấm điểm** | `KET_QUA_DANH_GIA WHERE ke_hoach_id=<current>` (§3.4.3.35 — đây là tên chính thống trong Master SRS; srs-fr-08 detail dùng tên khác là `VU_VIEC_DANH_GIA` — xem ⚠️ flag AMBIGUOUS ở đầu phần FR-08) | **Chọn VV vào đợt** (`vu_viec_id`, lọc VV đã `HOAN_THANH` trong kỳ + cùng đơn vị); form chấm điểm gồm: **Điểm tổng** (`diem_tong`, thang 0-100), **Chi tiết điểm** (`chi_tiet_diem`, JSON theo từng tiêu chí), **Nhận xét** (`nhan_xet`), **Trạng thái** (`trang_thai` ∈ `CHUA_DANH_GIA` / `DA_DANH_GIA`). Hiển thị **KPI cards**: Tổng VV / Điểm TB / Tỷ lệ đạt SLA | Luôn |
| **Báo cáo** | `BAO_CAO_DANH_GIA WHERE dot_dg_id=<current>` | KPI cards + bảng tổng hợp + biểu đồ (Radar / Bar) + các trường: **Nhận xét tổng thể** (`nhan_xet_tong_the`), **Kinh phí hoạt động khác** (`kp_hoat_dong_khac`), **Kinh phí xã hội hóa** (`kp_xa_hoi_hoa`), **Kiến nghị** (`kien_nghi`) + nút [Trình duyệt BC] + [Xuất Word/Excel theo mẫu 21a/21b TT17/2025] | Luôn hiển thị. Chỉ cho sửa khi đợt đã ở trạng thái chấm xong |

**Xem chi tiết cần dữ liệu từ:**
- **FR-05 Vụ việc** → `VU_VIEC` ở trạng thái `HOAN_THANH` (chỉ được chọn VV đã hoàn thành vào đợt chấm)
- **FR-10 Quản trị** → danh mục Tiêu chí đánh giá (kèm điểm tối đa + trọng số)
- **FR-10 Quản trị** → `TAI_KHOAN` + **FR-04 CG/TVV** → `TU_VAN_VIEN` (chọn người đánh giá)

**🖐️ Nhập tay:** ✅ **Có — toàn bộ workflow do CB NV nhập tay:**
- Lập kế hoạch đợt (UC83), chọn VV, phân công người chấm, chấm điểm từng tiêu chí (UC85), viết nhận xét tổng, nhập kinh phí hoạt động khác/xã hội hóa, trình BC — **không có kênh API**.
- Điểm tự tính (BR-CALC-04 có trọng số), nhưng người ĐG vẫn nhập thủ công `diem` + `nhan_xet` cho từng VV × từng tiêu chí.

**Transition (SM-DANHGIA — 7 state theo SRS Master §C.6):**

> ⚠️ **TODO (AMBIGUOUS — SRS tự mâu thuẫn 3 phiên bản):**
> - **Phiên bản 1 (DB ENUM):** 6 state — `DU_THAO / CHO_DUYET_PHAN_CONG / DA_DUYET_PHAN_CONG / DANG_THUC_HIEN / HOAN_THANH / HUY` (default `DU_THAO`). Nguồn: srs-v3.md §3.4.3.34 dòng 2169 + srs-fr-08-danh-gia.md dòng 957.
> - **Phiên bản 2 (Workflow Master Phụ lục C.6):** 7 state — `LAP_KE_HOACH / PHAN_CONG / CHO_DUYET_PC / THUC_HIEN / BAO_CAO / CHO_PHE_DUYET / HOAN_THANH`. Nguồn: srs-v3.md §C.6 dòng 4343-4372.
> - **Phiên bản 3 (UI filter dropdown):** 9 trạng thái — `NHAP / DA_LAP_KH / CHO_DUYET_PC / DA_DUYET_PC / DANG_DANH_GIA / DA_DANH_GIA / DA_LAP_BC / CHO_DUYET_BC / DA_DUYET_BC`. Nguồn: srs-fr-08-danh-gia.md dòng 751.
>
> **3 phiên bản tên state khác hoàn toàn nhau** (không phải subset/superset). **Dùng Master C.6 (7 state) làm gốc cho test transition; cần CĐT chốt 1 phiên bản canonical trước khi implement DB + UI.**

| Từ | Đến | Actor | Trigger | Dữ liệu nhập | Nguồn dropdown / Filter | Màn nguồn |
|----|-----|-------|---------|--------------|-------------------------|-----------|
| — | `LAP_KE_HOACH` | `cb_nv_<cap>_01` | **🖐️ Tạo đợt ĐG (UC83, FR-VI-01, BR-LEGAL-08)** | **Kỳ đánh giá** (`ky_danh_gia` — 6 tháng hoặc năm), **Tần suất** (`tan_suat`), **Đối tượng đánh giá** (`doi_tuong`), **Phạm vi đơn vị** + thêm các tiêu chí đợt (tổng trọng số phải = 100%) | `don_vi_id` hệ thống tự lấy từ user; dropdown tiêu chí lấy từ `TIEU_CHI_DANH_GIA` (**FR-10 Quản trị**) | SCR-VI-01 (consolidated) |
| `LAP_KE_HOACH` | `PHAN_CONG` | `cb_nv_<cap>_01` | **Phân công người chấm (UC85, FR-VI-03)** | **Người đánh giá** (`nguoi_danh_gia_id`), **Vai trò** (`vai_tro` ∈ `DANH_GIA_VIEN` / `TRUONG_NHOM`), **Lĩnh vực phụ trách** (`linh_vuc_phu_trach[]`, chọn nhiều), **Ghi chú** (`ghi_chu`) | Dropdown chọn tài khoản từ `TAI_KHOAN` (§3.4.3.7) — lọc cùng đơn vị (`BR-AUTH-01`/`BR-AUTH-08`); hệ thống **gợi ý** theo lĩnh vực phụ trách + số đợt đã tham gia. **Điều kiện chặn:** phải có ≥1 `TRUONG_NHOM`, không được phân công trùng lặp | SCR-VI-01 Tab Phân công |
| `PHAN_CONG` | `CHO_DUYET_PC` | `cb_nv_<cap>_01` | [Trình duyệt phân công] (FR-VI-03, BR-AUTH-05) | **Điều kiện chặn:** đã có danh sách phân công + tổng trọng số các tiêu chí = 100% | — | SCR-VI-01 |
| `CHO_DUYET_PC` | `THUC_HIEN` | `cb_pd_<cap>_01` | [Duyệt phân công] (FR-VI-04/05) | CB PD phải cùng cấp với CB NV trình (`BR-AUTH-05`); hệ thống audit log + cho phép chọn VV | — | SCR-VI-01 |
| `CHO_DUYET_PC` | `PHAN_CONG` | `cb_pd_<cap>_01` | [Từ chối phân công] (BR-FLOW-04) | **Lý do từ chối** (`ly_do`, ≥10 ký tự) | — | SCR-VI-01 |
| — (đang ở `THUC_HIEN`) | — | `cb_nv_<cap>_01` | **Chọn VV vào đợt (UC87)** | **Danh sách VV** (`vu_viec_ids[]`, multi-select) | Dropdown lọc `VU_VIEC` với các điều kiện: `trang_thai=HOAN_THANH` + `ngay_hoan_thanh` nằm trong kỳ đánh giá + thuộc phạm vi đơn vị (`BR-AUTH-08`). Nếu VV đã ở đợt khác, hệ thống **cảnh báo** nhưng vẫn cho phép chọn lại | SCR-VI-01 Tab Thực hiện / modal chọn VV |
| — (đang ở `THUC_HIEN`) | — | Người được phân công | Chấm điểm từng VV theo từng tiêu chí | **Tiêu chí** (`tieu_chi_id`), **Điểm** (`diem`, 0 ≤ điểm ≤ `diem_toi_da`), **Nhận xét** (`nhan_xet`, ≤1000 ký tự), **Nhận xét tổng thể** (`nhan_xet_tong_the`, ≤2000 ký tự); hỗ trợ **Lưu nháp** (đặt cờ `is_draft=1`) | Tiêu chí ← `TIEU_CHI_DANH_GIA` (**FR-10 Quản trị**); `diem_toi_da` lấy từ chính tiêu chí đó | SCR-VI-01 Tab Thực hiện (form chấm inline) |
| `THUC_HIEN` | `BAO_CAO` | System / `cb_nv_<cap>_01` | **Tự động khi tất cả VV đã chấm xong** (FR-VI-06/07, `BR-CALC-04`) | Hệ thống tự sinh báo cáo theo mẫu TT17 + tính **điểm trung bình có trọng số** | — | Auto |
| `BAO_CAO` | `CHO_PHE_DUYET` | `cb_nv_<cap>_01` | [Trình BC] (FR-VI-08) | **Điều kiện chặn:** BC có đủ dữ liệu. Trường bắt buộc: **Kinh phí hoạt động khác** (`kp_hoat_dong_khac`, ≥0), **Kinh phí xã hội hóa** (`kp_xa_hoi_hoa`, ≥0), **Nhận xét tổng thể** (`nhan_xet_tong_the`, Rich text), **Kiến nghị** (`kien_nghi`) | — | SCR-VI-01 Tab Báo cáo |
| `CHO_PHE_DUYET` | `HOAN_THANH` | `cb_pd_<cap>_01` | [Duyệt BC] (FR-VI-09, BR-AUTH-05) | Cùng cấp | — | SCR-VI-01 |
| `CHO_PHE_DUYET` | `BAO_CAO` | `cb_pd_<cap>_01` | [Từ chối BC] (FR-VI-09, BR-FLOW-04) | `ly_do` ≥10 ký tự | — | SCR-VI-01 |

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
- SCR-IX-01: **Trang Báo cáo Thống kê** (Dashboard / Unified Report Page) — 1 trang duy nhất gồm: dropdown chọn loại BC (23 loại) → bộ lọc kỳ + đơn vị + bộ lọc đặc thù → nút [Xem báo cáo] → vùng kết quả (biểu đồ + bảng) → nút [Xuất Excel] / [Xuất Word] theo mẫu TT17/2025. FR sử dụng: FR-IX-01 đến FR-IX-23 (UC120-142 — toàn bộ 23 loại BC dùng chung 1 SCR).
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
| `/api/v1/tu-van-vien` + `/search` | **FR-04 CG/TVV** — lọc `trang_thai=DANG_HOAT_DONG` **VÀ** `la_cong_khai=1` | Public |
| `/api/v1/vu-viec` + `/search` | **FR-05 Vụ việc** — chỉ trả metadata (không trả nội dung chi tiết) | Public |
| `/api/v1/danh-gia` + `/search` | **FR-08 Đánh giá** — chỉ trả báo cáo đánh giá đã duyệt | Public |
| `/api/v1/bieu-mau` + `/search` | **FR-09 Biểu mẫu** — lọc `la_cong_khai=1` (kèm endpoint download: `/bieu-mau/{id}/download`) | Public |
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
4. **Muốn test FR-05 phân công TVV?** → Phải có TVV `DANG_HOAT_DONG` cấp ĐP (FR-04).
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
- Ví dụ: `← FR-04 filter trang_thai=DANG_HOAT_DONG AND la_cong_khai=1 AND linh_vuc khớp`
- Nếu ghi "—" nghĩa là transition không có dropdown (chỉ confirm hoặc free-form input).

<a id="toc-cot-mannguon"></a>
### Cột "Màn nguồn"
- **SCR-xx-yy** → màn trong CMS
- **API inbound** → endpoint FR-16 nhận từ ngoài
- **Auto** → không có UI
- **Modal/Drawer** → overlay trên màn cha (ghi kèm tên màn cha)
