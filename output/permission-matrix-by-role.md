# Ma trận phân quyền — Pivot theo Role × Chức năng (screen-level)

> **Nguồn:**
> - Ma trận CRUD: SRS v3.1 §3.4.2 (line 1050–1116) — 46 entity × 11 role
> - Chức năng + màn hình: SRS v3.1 `srs-fr-01..16` — 198 chức năng + SCR references
> - Mapping function → entity: heuristic parse entity count trong mỗi function block + manual override cho FR-10, FR-11
> - Test accounts: `input/users.csv`

> **Cross-reference:** [permission-matrix.md](permission-matrix.md) (FR-first entity table) | [srs-v3-3.4.2-permission-matrix.md](srs-v3-3.4.2-permission-matrix.md) (raw SRS)
>
> **Update 2026-05-06 (SRS update FR-04):** Thêm 7 FR mới × 11 role cho Nhóm IV: `FR-IV-CROSS-01` (Tổng hợp điểm ĐG), `FR-IV-NEW-01/02/04` (TC TV), `FR-IV-NHT-01/02/03` (NHT). Mỗi role block FR-04 giờ có **19 row** (12 cũ + 7 mới). Cite: `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md`.

> **Update 2026-05-06 (SRS update FR-05 v3.5):** Thêm 2 FR mới × 11 role cho Nhóm V.I: `FR-V.I-NEW-02` (DN bổ sung HS qua VNeID Tier 2 — chỉ DN sở hữu VV có quyền 🔌 C†) + `FR-V.I-NEW-05` (Công khai VV — chỉ CB PD cùng cấp ✅ CRU*, các role khác ❌ nút [Công khai]). Thêm 2 SCR DN mới: SCR-V.I-04 (Danh sách VV của tôi) + SCR-V.I-05 (Thông báo của tôi) — chế độ DN qua chuyên trang Tier 2 VNeID, ẩn tên cá nhân CB theo NĐ 13/2023. FR-V.I-09 refactor: modal 2 thẻ Cá nhân/Tổ chức tư vấn. FR-V.I-17 (UC67 đánh giá): CHỈ {CB_NV, DN} chấm — loại CB_PD per CSV UC67. Mỗi role block FR-05 thêm 2 row (cho 2 FR NEW). Cite: `srs-update-2026-5-5/srs-fr-05-vu-viec.md` Thay đổi 2/4/8/12/19.

> **Update 2026-05-06 (SRS update FR-12 v3.5):** Đổi tên menu "Tư vấn chuyên sâu" → **"Tư vấn pháp luật chuyên sâu"** (Thay đổi 1) — sửa 11 heading FR-12 mỗi role. Rename entity `NOI_DUNG_TU_VAN_CS` → `TU_VAN_CHUYEN_SAU` ở cột Entity các row FR-X.1-01/02 (Thay đổi 2). Update entity ở cột FR-X.1-04 → `HO_SO_PHAP_LY_DN` (định nghĩa mới 3.4.3.46), FR-X.1-06 → `TU_LIEU_PHAP_LY_VV` (3.4.3.47), FR-X.1-07 → `DANH_GIA_CHAT_LUONG_TV` (3.4.3.48) — Thay đổi 5. NHT có 📝 RU* trên `HO_SO_PHAP_LY_DN` scoped theo VV phân công (Thay đổi 10). Cite: `srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md`.

> **Generate:** 2026-04-21 | Roles: 11 | Entities: **55** (46 cũ + 3 FR-04/07/10 update 2026-05-05 + 3 FR-05 update 2026-05-06: PHAN_CONG_VU_VIEC + DANH_GIA_VU_VIEC + LICH_SU_VU_VIEC + 3 FR-12 update 2026-05-06: HO_SO_PHAP_LY_DN + TU_LIEU_PHAP_LY_VV + DANH_GIA_CHAT_LUONG_TV) | Functions: 198+

## Mục đích

File này drill-down xuống **chức năng/màn hình cụ thể** (không chỉ entity), giúp tester mở UI là biết luôn thao tác nào OK/403 cho role đang login.

Ví dụ: `QTHT` login → mở menu `Quản trị hệ thống > Danh mục dùng chung > Lĩnh vực pháp lý` → CRUD OK (quyền trên `DANH_MUC`, FR-10/UC99/SCR-VIII-01).

---

## Ký hiệu & quy tắc

**Permission codes (SRS §3.4.2):** `C`=Create, `R`=Read all, `R*`=Read scoped, `U`=Update, `D`=Delete (soft), `*`=scope filter theo đơn vị, `†`=qua API inbound, `—`=no access.

**Icons:** ✅ F = full CRUD | ✅ = CRUD với scope/Delete | 📝 = RU* phê duyệt | 👁️ = R/R* xem | 🔌 = C† qua API | ❌ = không quyền.

**Scope:** TW=toàn quốc, BN=Bộ ngành mình, ĐP=Sở TP mình. Ngang cấp KHÔNG thấy nhau (BR-AUTH-03). QTHT vượt scope (BR-AUTH-08).

**Double-filter (BR-AUTH-10):** NHT/TVV/CG — lọc đơn vị + lọc vụ việc được phân công.

---

## Mapping SRS role ↔ CSV account

| SRS Role | Tên đầy đủ | Nhãn CSV | Cấp | Accounts (users.csv) | Đơn vị |
|----------|------------|---------|-----|----------------------|--------|
| `QTHT` | Quản trị hệ thống | QTHT | — (single role) | admin, qtht_01, qtht_02, qtht_03 | (không có) |
| `CB_NV_TW` | Cán bộ Nghiệp vụ Trung ương | CB_NV_TW | TW | cb_nv_tw_01, cb_nv_tw_02, cb_nv_tw_03 | BTP-TW — Cục Bổ trợ tư pháp |
| `CB_NV_BN` | Cán bộ Nghiệp vụ Bộ ngành | CB_NV_BN | BN | cb_nv_bn_01 (BKH), cb_nv_bn_02 (BTC), cb_nv_bn_03 (BCT) | BKH / BTC / BCT (3 bộ) |
| `CB_NV_DP` | Cán bộ Nghiệp vụ Địa phương | CB_NV_DP | DP | cb_nv_dp_01 (AG), cb_nv_dp_02 (BG), cb_nv_dp_03 (BNI) | STP-AG / STP-BG / STP-BNI |
| `CB_PD_TW` | Cán bộ Phê duyệt Trung ương | CB_PD_TW | TW | cb_pd_tw_01, cb_pd_tw_02, cb_pd_tw_03 | BTP-TW — Cục Bổ trợ tư pháp |
| `CB_PD_BN` | Cán bộ Phê duyệt Bộ ngành | CB_PD_BN | BN | cb_pd_bn_01 (BKH), cb_pd_bn_02 (BTC), cb_pd_bn_03 (BCT) | BKH / BTC / BCT (3 bộ) |
| `CB_PD_DP` | Cán bộ Phê duyệt Địa phương | CB_PD_DP | DP | cb_pd_dp_01 (AG), cb_pd_dp_02 (BG), cb_pd_dp_03 (BNI) | STP-AG / STP-BG / STP-BNI |
| `DN` | Doanh nghiệp | DN | Portal | dn_01, dn_02, dn_03 | STP-AG / STP-BG / STP-BNI |
| `NHT` | Người hỗ trợ pháp lý | NHT | Portal | nht_01, nht_02, nht_03 | STP-AG / STP-BG / STP-BNI |
| `TVV` | Tư vấn viên pháp luật | TVV | Portal | tvv_01, tvv_02, tvv_03 | STP-AG / STP-BG / STP-BNI |
| `CG` | Chuyên gia tư vấn | CG | Portal | cg_01, cg_02, cg_03 | STP-AG / STP-BG / STP-BNI |

> **Password convention:** Tất cả tài khoản test dùng `Secret@123`, trừ `admin` dùng `(Secret@123)`. **Usage guide cho test ma trận phân quyền** (convention `_03` dedicated + pair DI-04/DI-05): [input/test-accounts-isolation.csv](../input/test-accounts-isolation.csv).

> **Convention suffix (users.csv có 3 replica mỗi role+cấp):**
> - `_01` → Primary cho Smoke / Functional / Cross-module
> - `_02` → Fallback khi `_01` lock (CLAUDE.md Rule 7)
> - `_03` → Dedicated cho test ma trận phân quyền + isolation DI-04/DI-05

> **Ghi chú:** SRS §3.4.2 định nghĩa `QTHT` là single role (không split TW/BN/ĐP) — users.csv phản ánh đúng (4 TK: admin + qtht_01/02/03, không có đơn vị scope). BN/DP có 3 đơn vị khác nhau (BKH/BTC/BCT và AG/BG/BNI) — hỗ trợ test isolation ngang cấp DI-04/DI-05 sẵn, không cần tạo TK cross-tenant riêng.

---

## Tổng quan Function theo FR

| FR | Module | # Chức năng | Entity chính |
|----|--------|-------------|--------------|
| FR-01 | Dashboard | 9 | `HOI_DAP`, `KHOA_HOC`, `TU_VAN_VIEN`, `VU_VIEC` |
| FR-02 | Hỏi đáp Pháp luật `[v3.5]` | 12 | `HOI_DAP` (+5 trường công khai CR-01 + `don_vi_id` CR-06 + `tu_van_nhanh_goc_id` + `loai_doi_tuong_xu_ly` + `to_chuc_tu_van_id`; enum kênh thêm `TVN_BRIDGE`; SM 9 state thêm `HUY`), `PHAN_HOI` (+5 trường công khai CR-01), `MAU_PHAN_HOI` (Mô hình B Hybrid 2 tầng — `pham_vi_ap_dung` ∈ `TW_QUOC_GIA / BN_RIENG / DP_RIENG`) — FR-II-NEW-01 (Cấu hình phân công) chuyển sang FR-10 MH-10.7 |
| FR-03 | Đào tạo, Tập huấn | 23 | `BAI_GIANG`, `CHUNG_NHAN`, `CHUONG_TRINH_DAO_TAO`, `DANG_KY_DAO_TAO`, `DE_KIEM_TRA`, `DE_XUAT_DAO_TAO`, `GIANG_VIEN`, `KHOA_HOC`, `NGAN_HANG_CAU_HOI` |
| FR-04 | Chuyên gia / Tư vấn viên | 12 | `TU_VAN_VIEN`, `VU_VIEC` |
| FR-05 | Vụ việc HTPL | 18 | `CAU_HINH_SLA`, `KET_QUA_VU_VIEC`, `THONG_BAO`, `TU_VAN_VIEN`, `VU_VIEC` |
| FR-06 | Chi trả Chi phí `[v3.5]` | 14 | `HO_SO_CHI_TRA` (+9 fields lifecycle + UNIQUE `ma_ho_so_dvc`), `DANH_GIA_HO_SO_CHI_TRA`, `THAM_DINH_HO_SO` (1:1 v3.5 mới), `PHE_DUYET_CHI_TRA` (N:1 v3.5 mới), `THONG_BAO` — +FR-V.II-14 DN bổ sung qua DVC/Cổng PLQG |
| FR-07 | Doanh nghiệp | 2 | `DOANH_NGHIEP`, `DOANH_NGHIEP_LINH_VUC` (M-N v3.5) — bỏ `FR-V.III-NEW-01` Import Excel + 1 entity DON_VI ref đổi sang DANH_MUC TINH_THANH |
| FR-08 | Đánh giá Hiệu quả | 9 | `AUDIT_LOG`, `BAO_CAO_DANH_GIA`, `DANH_MUC`, `KET_QUA_DANH_GIA`, `KE_HOACH_DANH_GIA`, `VU_VIEC` |
| FR-09 | Biểu mẫu `[v3.5]` | 7 | `BIEU_MAU` (+4 trường công khai: `cong_khai`/`anh_dai_dien`/`thoi_gian_dang_tai`/`mo_ta_cong_khai`/`file_dinh_kem_cong_khai`), `THU_MUC_BIEU_MAU` (enum `NHAP/CONG_KHAI/AN`) — `HOP_DONG_TU_VAN` đã chuyển sang FR-14 |
| FR-10 | Quản trị Hệ thống | 26 | `CAU_HINH_SLA`, `DANH_MUC`, `DON_VI`, `NGAY_LE` (gộp vào Cấu hình HT 2026-05-06), `TAI_KHOAN`, `TIEU_CHI_DANH_GIA`, `VAI_TRO` |
| FR-11 | Báo cáo Thống kê | 23 | `BAO_CAO` |
| FR-12 | Tư vấn pháp luật chuyên sâu `[RENAMED v3.5]` | 7 | `TU_VAN_CHUYEN_SAU`, `PHIEN_TU_VAN`, `LICH_SU_TRAO_DOI_TV`, `HO_SO_PHAP_LY_DN` `[NEW v3.5]`, `TU_LIEU_PHAP_LY_VV` `[NEW v3.5]`, `DANH_GIA_CHAT_LUONG_TV` `[NEW v3.5]`, `DOANH_NGHIEP`, `TU_VAN_VIEN` (ref) |
| FR-13 | Tư vấn Nhanh | 5 | `DANH_MUC`, `KHO_CAU_HOI` |
| FR-14 | Hợp đồng Tư vấn | 2 | `HOP_DONG_TU_VAN`, `TU_VAN_VIEN` |
| FR-15 | Chương trình HTPLDN | 11 | `BAO_CAO_CT_HTPL`, `CHUONG_TRINH_HTPL` |
| FR-16 | API Kết nối Chia sẻ | 18 | `BIEU_MAU`, `CHUONG_TRINH_HTPL`, `DOANH_NGHIEP`, `HOI_DAP`, `KET_QUA_DANH_GIA`, `KHOA_HOC`, `TU_VAN_VIEN`, `VU_VIEC` |
| **Total** | | **198** | |

---

## 1. `QTHT` — Quản trị hệ thống

**Mô tả:** Admin toàn hệ thống. CRUD entity quản trị (danh mục/tài khoản/cấu hình), Read toàn bộ entity nghiệp vụ.

**Scope:** BR-AUTH-08 exception: QTHT thấy TẤT CẢ đơn vị. Matrix SRS không split QTHT theo cấp TW/BN/ĐP.

**Coverage chức năng:** 193/198 chức năng có quyền | 0 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `CRUD` | ✅ | ✓C+R+U+D / ✗— |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 6 | ~~`FR-VIII-06`~~ | ⚠️ **CHUYỂN sang FR-04** thành FR-IV-NEW-01 (entity riêng `TO_CHUC_TU_VAN`) — SRS update 2026-05-05 CR-02 | ~~UC104~~ | — | — | — | — | — |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 22 | `FR-VIII-22` | Đăng ký tài khoản DN — Self-registration (chỉ DN, username = MST 10 chữ số, form 21 trường, bypass CHO_PHAN_QUYEN) | UC120 | SCR-VIII-08: Đăng ký TK DN | `TAI_KHOAN` + `DOANH_NGHIEP` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID (chỉ DN/TVV/CG/NHT — BR-AUTH-09 cấm CB nội bộ) | UC121 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC122 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID (chỉ DN/TVV/CG/NHT) | UC123 | — | `TAI_KHOAN` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 26 | `FR-VIII-26` `[NEW v3.5]` | Quên mật khẩu / Kích hoạt TK lần đầu (workflow chung — DN/TVV/CG/NHT/CB; trigger chuyển SM-TVV/SM-NHT từ CHO_KICH_HOAT → HOAT_DONG) | — | SCR-VIII-07 (link "Quên mật khẩu") + form đặt MK | `TAI_KHOAN` | `CRU` | ✅ F | ✓C+R+U / ✗D |
| 27 | `FR-VIII-28` `[NEW v3.5 GAP-VIII-02]` | Nhật ký hệ thống (filter, paginate 50/trang, cap 90 ngày, export Excel) | — | SCR-VIII-10: Nhật ký Hệ thống | `AUDIT_LOG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 28 | `FR-VIII-29` `[NEW v3.5 GAP-VIII-05]` | Quản lý ngày lễ (CRUD + import Excel + calendar view) | — | SCR-VIII-06 hoặc DM con | `NGAY_LE` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `CRUD` | ✅ F | ✓C+R+U+D / ✗— |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

---

## 2. `CB_NV_TW` — Cán bộ Nghiệp vụ Trung ương (Cục BLDS&KT)

**Mô tả:** Xử lý nghiệp vụ cấp TW. CRUD trong phạm vi toàn quốc (R* = tất cả đơn vị).

**Scope:** TW scope = toàn quốc.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* / ✗POST/DELETE→403 |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB NV KHÔNG phê duyệt — quyền CB PD (BR-AUTH-05) |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB NV thủ công thay DN) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL (v3.5: bỏ quyền Create — DN tạo qua FR-VIII-22 self-reg) | UC81 | SCR-V | `DOANH_NGHIEP`, `DOANH_NGHIEP_LINH_VUC` | `RUD*` | 📝 | ✓R*+U+D / ✗POST→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `R*` | 👁️ | ✓R*(khi co_quan_duoc_danh_gia_id=user.don_vi_id AND trang_thai=HOAN_THANH) / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

---

## 3. `CB_NV_BN` — Cán bộ Nghiệp vụ Bộ ngành

**Mô tả:** Xử lý nghiệp vụ cấp BN trong Bộ ngành của mình.

**Scope:** BN scope. BR-AUTH-03 cross-BN = 0 rows.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* / ✗POST/DELETE→403 |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB NV KHÔNG phê duyệt — quyền CB PD (BR-AUTH-05) |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB NV thủ công thay DN) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL (v3.5: bỏ quyền Create — DN tạo qua FR-VIII-22 self-reg) | UC81 | SCR-V | `DOANH_NGHIEP`, `DOANH_NGHIEP_LINH_VUC` | `RUD*` | 📝 | ✓R*+U+D / ✗POST→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `R*` | 👁️ | ✓R*(khi co_quan_duoc_danh_gia_id=user.don_vi_id AND trang_thai=HOAN_THANH) / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

---

## 4. `CB_NV_DP` — Cán bộ Nghiệp vụ Địa phương (Sở TP)

**Mô tả:** Xử lý nghiệp vụ cấp ĐP trong Sở TP của mình.

**Scope:** ĐP scope.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* / ✗POST/DELETE→403 |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB NV KHÔNG phê duyệt — quyền CB PD (BR-AUTH-05) |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB NV thủ công thay DN) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL (v3.5: bỏ quyền Create — DN tạo qua FR-VIII-22 self-reg) | UC81 | SCR-V | `DOANH_NGHIEP`, `DOANH_NGHIEP_LINH_VUC` | `RUD*` | 📝 | ✓R*+U+D / ✗POST→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `R*` | 👁️ | ✓R*(khi co_quan_duoc_danh_gia_id=user.don_vi_id AND trang_thai=HOAN_THANH) / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `CRU*D` | ✅ | ✓C+R*+U+D / ✗— |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `CRUD*` | ✅ | ✓C+R*+U+D / ✗— |

---

## 5. `CB_PD_TW` — Cán bộ Phê duyệt Trung ương

**Mô tả:** Lãnh đạo TW — phê duyệt/từ chối workflow TW. Chủ yếu R/RU*.

**Scope:** TW. BR-AUTH-05 chỉ duyệt cùng cấp.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB PD KHÔNG cập nhật state — quyền CB NV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* (phê duyệt cùng cấp BR-AUTH-05) / ✗POST/DELETE→403 |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* (CB PD chỉ xem NHT, không workflow phê duyệt — SM-NHT đơn giản) / ✗POST/PUT/DELETE→403 |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB PD chỉ xem lịch sử bổ sung) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

---

## 6. `CB_PD_BN` — Cán bộ Phê duyệt Bộ ngành

**Mô tả:** Lãnh đạo BN — phê duyệt BN. BR-AUTH-05.

**Scope:** BN.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB PD KHÔNG cập nhật state — quyền CB NV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* (phê duyệt cùng cấp BR-AUTH-05) / ✗POST/DELETE→403 |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* (CB PD chỉ xem NHT, không workflow phê duyệt — SM-NHT đơn giản) / ✗POST/PUT/DELETE→403 |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB PD chỉ xem lịch sử bổ sung) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

---

## 7. `CB_PD_DP` — Cán bộ Phê duyệt Địa phương

**Mô tả:** Lãnh đạo ĐP — phê duyệt ĐP. BR-AUTH-05.

**Scope:** ĐP.

**Coverage chức năng:** 185/198 chức năng có quyền | 8 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* (computed view) / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | SCR-IV-NEW-01/02/03 | `TO_CHUC_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `—` | ❌ | CB PD KHÔNG cập nhật state — quyền CB NV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | SCR-IV-NEW-03 | `TO_CHUC_TU_VAN` | `U*` | 📝 | ✓U* (phê duyệt cùng cấp BR-AUTH-05) / ✗POST/DELETE→403 |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-01/02 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* (CB PD chỉ xem NHT, không workflow phê duyệt — SM-NHT đơn giản) / ✗POST/PUT/DELETE→403 |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | SCR-IV-NHT-01 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (CB PD chỉ xem lịch sử bổ sung) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

---

## 8. `DN` — Doanh nghiệp

**Mô tả:** KHÔNG truy cập CMS. Tất cả qua API inbound (Cổng PLQG, SI-04).

**Scope:** Portal + API endpoint. KHÔNG qua CMS UI.

**Coverage chức năng:** 109/198 chức năng có quyền | 84 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ✅ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `C†RU*` | ✅ | ✓C†API+R*+U / ✗DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | — | `TU_VAN_VIEN` | `—` | ❌ | DN không xem điểm ĐG nội bộ |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | Cổng PLQG (cong_khai=1) | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R public TC TV cong_khai / ✗POST/PUT/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | DN không cập nhật state TC TV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | DN không phê duyệt |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | NHT là cán bộ nội bộ — DN không truy cập |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | DN không tìm kiếm NHT |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | DN không xem NHT |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (DN gửi `file_bo_sung[]` qua DVC, ≤5 ngày LV, max 3 lần) | — | (qua DVC API) | `HO_SO_CHI_TRA` | `C†U*` | 🔌 | ✓C†API upload file+U own + bo_sung_count++ / ✗DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ❌ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `C†` | 🔌 | ✓C†API / ✗GET→403/PUT→403/DELETE→403 |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |

---

## 9. `NHT` — Người hỗ trợ pháp lý

**Mô tả:** ĐP scope + double-filter BR-AUTH-10: chỉ thấy vụ việc được phân công.

**Scope:** NĐ77/2008 — thuộc Tổ chức HT PLDN dưới Sở TP.

**Coverage chức năng:** 73/198 chức năng có quyền | 120 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ❌ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `C†R*` | 🔌 | ✓C†API+R* / ✗PUT→403/DELETE→403 |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `C†RU*` | ✅ | ✓C†API+R*+U / ✗DELETE→403 |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | — | `TU_VAN_VIEN` | `—` | ❌ | NHT không xem điểm ĐG TVV |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | TC TV là quyền CB NV/CB PD |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | — |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | — |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | SCR-IV-NHT-02/03 (own) | `NGUOI_HO_TRO` | `RU*` | 📝 | ✓R*+U own scope (FR-IV-NHT-03 xem hồ sơ + cập nhật chứng chỉ HTPL) / ✗POST/DELETE→403 — KHÔNG CRUD NHT khác |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | NHT không tìm kiếm NHT khác |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | SCR-IV-NHT-03 (own) | `NGUOI_HO_TRO` | `R*` | 👁️ | ✓R* own profile / ✗xem NHT khác = 403 |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `CRU*` | ✅ | ✓C+R*+U / ✗DELETE→403 |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` | — | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `RU*` | 📝 | ✓R*+U / ✗POST→403/DELETE→403 |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

---

## 10. `TVV` — Tư vấn viên pháp luật

**Mô tả:** Portal user. Chủ yếu R* trên các entity TV/vụ việc.

**Scope:** ⚠️ TVV KHÔNG có quyền VU_VIEC/HO_SO_VU_VIEC/KET_QUA_VU_VIEC — NHT mới có.

**Coverage chức năng:** 50/198 chức năng có quyền | 143 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ❌ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá (own) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* own profile / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | Cổng PLQG / dropdown to_chuc_chinh_id | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R public TC TV cong_khai (xem dropdown khi đăng ký) / ✗POST/PUT/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | TVV/CG không cập nhật state TC TV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | — |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | NHT là cán bộ nội bộ — TVV/CG không truy cập |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | — |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | — |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` (TVV xem HSCT liên quan) | — | SCR-V.II-02 | `HO_SO_CHI_TRA` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ❌ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

---

## 11. `CG` — Chuyên gia tư vấn

**Mô tả:** CRUD* trên TV Chuyên sâu + phiên tư vấn (FR-12). Double-filter BR-AUTH-10.

**Scope:** Tập trung FR-12 TV Chuyên sâu.

**Coverage chức năng:** 36/198 chức năng có quyền | 157 không quyền (negative test) | 5 không xác định entity

### ✅ FR-01 — Dashboard

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-I-01` | Hiển thị tổng hợp hỏi đáp, vướng mắc | UC1 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-I-02` | Tổng hợp vụ việc đã tiếp nhận | UC2 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-I-03` | Tổng hợp vụ việc đang hỗ trợ | UC3 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-I-04` | Tổng hợp vụ việc đã hoàn thành | UC4 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-I-05` | Tổng hợp khóa đào tạo đang diễn ra | UC5 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-I-06` | Tổng hợp khóa đào tạo đã diễn ra | UC6 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-I-07` | Tổng số chuyên gia/TVV | UC7 | SCR-I-01: Tổng quan hệ thống (Dashboard) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-I-08` | Biểu đồ đánh giá hiệu quả hỗ trợ | UC8 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 9 | `FR-I-09` | Biểu đồ chất lượng đào tạo | UC9 | SCR-I-01: Tổng quan hệ thống (Dashboard) | — | `?` | ❓ | ✓(entity không xác định) / ✗— |

### ❌ FR-02 — Hỏi đáp Pháp luật

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-II-01` | Quản lý thông tin hỏi đáp, vướng mắc pháp luật | UC10 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-II-02` | Tìm kiếm hỏi đáp tổng hợp | UC11 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-II-03` | Tiếp nhận xử lý hỏi đáp | UC12 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-II-04` | Quản lý thông tin tiếp nhận xử lý | UC13 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-II-05` | Tìm kiếm hỏi đáp đã tiếp nhận | UC14 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-II-06` | Phân công xử lý câu hỏi | UC15 | SCR-II-03: Phan cong xu ly (Modal) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-II-07` | Phản hồi câu hỏi | UC16 | SCR-II-02: Chi tiet & Soan Phan hoi (toan bo workflow) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-II-08` | Quản lý công khai phản hồi | UC17 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-II-09` | Quản lý câu hỏi đã xử lý | UC18 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-II-10` | Tìm kiếm câu hỏi đã xử lý | UC19 | SCR-II-01: Danh sach Hoi dap (trang chinh) | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | ~~`FR-II-NEW-01`~~ `[DEPRECATED 2026-05-06]` | ⚠️ User chốt bỏ feature — entity CAU_HINH_PHAN_CONG không còn dùng | ~~UCmới~~ | — | ~~`CAU_HINH_PHAN_CONG`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-II-NEW-02` | Quản lý mẫu câu hỏi/phản hồi | UCmới | — | `MAU_PHAN_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-03 — Đào tạo, Tập huấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-III-01` | Quản lý Chương trình đào tạo | UC20 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-III-02` | Tìm kiếm CTDT | UC21 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `CHUONG_TRINH_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | UC22 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DANG_KY_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-III-04` | Đăng ký tham gia học tập | UC23 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-III-05` | Quản lý kiểm tra, đánh giá kết quả | UC24 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-III-06` | Tìm kiếm kết quả | UC25 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-III-07` | Quản lý kho tài liệu, bài giảng | UC26 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-III-08` | Tìm kiếm tài liệu | UC27 | SCR-III-03: Kho Tai lieu / Bai giang (sub-menu 2) | `BAI_GIANG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-III-09` | Quản lý ngân hàng câu hỏi | UC28 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-III-10` | Tìm kiếm ngân hàng câu hỏi | UC29 | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `NGAN_HANG_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-III-11` | Quản lý giảng viên, trợ giảng | UC30 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | UC31 | SCR-III-05: Giang vien / Tro giang (sub-menu 4) | `GIANG_VIEN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | UC32 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `DE_XUAT_DAO_TAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | UC33 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | UC34 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-III-16` | Công khai kế hoạch | UC35 | SCR-III-01: Chuong trinh Dao tao (trang chinh sub-menu 1) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-III-17` | Ghi nhận kết quả | UC36 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-III-18` | Phê duyệt kết quả | UC37 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-III-19` | Công bố kết quả đào tạo bồi dưỡng | UC38 | SCR-III-02: Chi tiet Khoa hoc (drill-down tu SCR-III-01) | `CHUNG_NHAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số cho CTDT | UCmới | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `DE_KIEM_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-III-NEW-02` | Quản lý đề kiểm tra | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | UCmới | SCR-III-04: Ngan hang Cau hoi & De Kiem tra (sub-menu 3) | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-04 — Chuyên gia / Tư vấn viên

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IV-01` | Quản lý TVV | UC39 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-IV-02` | Tìm kiếm TVV | UC40 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-IV-03` | Đăng ký tham gia mạng lưới | UC41 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-IV-04` | Cập nhật năng lực | UC42 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-IV-05` | Xem chi tiết TVV | UC43 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IV-06` | Thẩm định hồ sơ TVV | UC44 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-IV-07` | Phê duyệt TVV | UC45 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-IV-08` | Công khai mạng lưới TVV | UC46 | SCR-IV-01: Danh sach Tu van vien (trang chinh) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-IV-09` | Đánh giá TVV | UC47 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-IV-10` | Xem lịch sử hỗ trợ | UC48 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IV-11` | NHT cập nhật hồ sơ | UC49 | SCR-IV-02: Them moi / Chinh sua TVV | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 12 | `FR-IV-12` | Cập nhật trạng thái TVV | UC50 | SCR-IV-03: Ho so Chi tiet TVV (toan bo workflow) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-IV-CROSS-01` | Tổng hợp điểm ĐG TVV `[NEW 05-05]` | — | SCR-IV-03 tab Đánh giá (own) | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* own profile / ✗POST/PUT/DELETE→403 |
| 14 | `FR-IV-NEW-01` | Quản lý TC TV `[NEW 05-05]` | — | Cổng PLQG / dropdown to_chuc_chinh_id | `TO_CHUC_TU_VAN` | `R` | 👁️ | ✓R public TC TV cong_khai (xem dropdown khi đăng ký) / ✗POST/PUT/DELETE→403 |
| 15 | `FR-IV-NEW-02` | Cập nhật TT TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | TVV/CG không cập nhật state TC TV |
| 16 | `FR-IV-NEW-04` | Phê duyệt TC TV `[NEW 05-05]` | — | — | `TO_CHUC_TU_VAN` | `—` | ❌ | — |
| 17 | `FR-IV-NHT-01` | Quản lý NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | NHT là cán bộ nội bộ — TVV/CG không truy cập |
| 18 | `FR-IV-NHT-02` | Tìm kiếm NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | — |
| 19 | `FR-IV-NHT-03` | Xem hồ sơ NHT `[NEW 05-05]` | — | — | `NGUOI_HO_TRO` | `—` | ❌ | — |

### ✅ FR-05 — Vụ việc HTPL

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.I-01` | Quản lý hồ sơ yêu cầu HTPL | UC51 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu HTPL | UC52 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | UC53 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | UC54 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | UC55 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | UC56 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-V.I-07` | Quản lý hồ sơ vụ việc | UC57 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | UC58 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | UC59 | SCR-V | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | UC60 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-V.I-11` | Trình phê duyệt | UC61 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | UC62 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | UC63 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-V.I-14` | DN nhận thông báo | UC64 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả hỗ trợ | UC65 | SCR-V | `KET_QUA_VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-V.I-16` | CB NV cập nhật kết quả VV | UC66 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ vụ việc | UC67 | SCR-V | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | UCmới | — | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-06 — Chi trả Chi phí

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.II-01` | Tiếp nhận hồ sơ từ DVC | UC68 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.II-02` | Quản lý hồ sơ đề nghị hỗ trợ chi phí | UC69 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-V.II-03` | Kiểm tra hồ sơ đề nghị | UC70 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-V.II-04` | Thông báo kết quả kiểm tra qua DVC | UC71 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-V.II-05` | Đánh giá hồ sơ theo tiêu chí | UC72 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-V.II-06` | Quản lý hồ sơ đề nghị thanh toán | UC73 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-V.II-07` | Gửi hồ sơ đề nghị thanh toán | UC74 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-V.II-08` | Nhận thông báo kết quả thanh toán | UC75 | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-V.II-09` | Thẩm định hồ sơ đề nghị thanh toán | UC76 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-V.II-10` | Thông báo kết quả thẩm định | UC77 | — | `THONG_BAO` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 11 | `FR-V.II-11` | Trình phê duyệt hồ sơ thanh toán | UC78 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-V.II-12` | Phê duyệt hồ sơ thanh toán | UC79 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-V.II-13` | Cập nhật kết quả xử lý hồ sơ | UC80 | SCR-V | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-V.II-14` `[NEW v3.5]` | DN bổ sung hồ sơ chi trả qua DVC/Cổng PLQG `[GAP-V.II-01]` | — | — | `HO_SO_CHI_TRA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-07 — Doanh nghiệp

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-V.III-01` | Quản lý Doanh nghiệp được HTPL | UC81 | SCR-V | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-V.III-02` | Tìm kiếm DN | UC82 | SCR-V | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | ~~`FR-V.III-NEW-01`~~ | ~~Import DN từ Excel~~ **DEPRECATED v3.5 (BA chốt 2026-05-05 — BỎ Import Excel CMS)** | — | — | ~~`DOANH_NGHIEP`~~ | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VI-01` | Lập kế hoạch đánh giá | UC83 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-VI-02` | Thiết lập tiêu chí đánh giá | UC84 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `AUDIT_LOG` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VI-03` | Phân công người đánh giá | UC85 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VI-04` | Phê duyệt phân công | UC86 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VI-05` | Chọn vụ việc đánh giá | UC87 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-VI-06` | Thực hiện đánh giá | UC88 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VI-07` | Lập báo cáo đánh giá | UC89 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VI-08` | Trình phê duyệt báo cáo | UC90 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-VI-09` | Phê duyệt báo cáo đánh giá | UC91 | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (CONSOLIDATED v2.1) | `KE_HOACH_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-VI-10` | Nhận kết quả đánh giá `[NEW v3.5]` | (chưa có UC, GAP-VI-04) | SCR-VI-01: Theo dõi Đánh giá Hiệu quả HTPL (Tab Báo cáo, read-only) | `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA` + `BAO_CAO_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-09 — Biểu mẫu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VII-01` | Quản lý thư mục biểu mẫu, hợp đồng | UC92 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `THU_MUC_BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-VII-02` | Tìm kiếm thư mục biểu mẫu, hợp đồng | UC93 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-VII-03` | Công khai thư mục biểu mẫu lên Cổng | UC94 | SCR-VII-01: Quản lý Thư mục Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-VII-04` | Quản lý biểu mẫu, hợp đồng | UC95 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-VII-05` | Tìm kiếm biểu mẫu, hợp đồng | UC96 | SCR-VII-02: Quản lý Biểu mẫu | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-VII-06` | Import biểu mẫu hàng loạt | UC97 | SCR-VII-03: Nhập Biểu mẫu Hàng loạt | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-VII-07` | Chia sẻ biểu mẫu qua API trực tiếp | UC98 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-VII-08` | Quản lý Hợp đồng Tư vấn | UC163 | — | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-10 — Quản trị Hệ thống

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-VIII-01` | Quản lý danh mục lĩnh vực pháp lý | UC99 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-VIII-02` | Quản lý danh mục loại hình hỗ trợ | UC100 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-VIII-03` | Quản lý danh mục chương trình hỗ trợ | UC101 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 4 | `FR-VIII-04` | Quản lý danh mục tình trạng vụ việc | UC102 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 5 | `FR-VIII-05` | Quản lý danh mục cơ quan đơn vị quản lý | UC103 | SCR-VIII-01: Quản lý Danh mục | `DON_VI` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-VIII-06` | Quản lý danh mục tổ chức tư vấn | UC104 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-VIII-07` | Quản lý danh mục loại doanh nghiệp | UC105 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 8 | `FR-VIII-08` | Quản lý danh mục hồ sơ đề nghị hỗ trợ | UC106 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 9 | `FR-VIII-09` | Quản lý danh mục hồ sơ đề nghị thanh toán | UC107 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 10 | `FR-VIII-10` | Quản lý cấu hình thời hạn xử lý hồ sơ — SLA | UC108 | SCR-VIII-06: Cấu hình Hệ thống (MH-10.7 — MAN HINH MOI v2.1) | `CAU_HINH_SLA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-VIII-11` | Quản lý danh mục tiêu chí đánh giá hiệu quả | UC109 | SCR-VIII-01: Quản lý Danh mục | `TIEU_CHI_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-VIII-12` | Quản lý danh mục tiêu chí đánh giá hỗ trợ chi phí | UC110 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 13 | `FR-VIII-13` | Quản lý loại tài khoản | UC111 | SCR-VIII-01: Quản lý Danh mục | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-VIII-14` | Quản lý vai trò | UC112 | SCR-VIII-02: Quản lý Vai trò | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-VIII-15` | Quản lý tài khoản người dùng | UC113 | SCR-VIII-03: Quản lý Tài khoản NSD | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-VIII-16` | Phân quyền truy cập dữ liệu | UC114 | SCR-VIII-05: Phân quyền Dữ liệu | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-VIII-17` | Phân quyền chức năng | UC115 | SCR-VIII-04: Phân quyền Chức năng | `VAI_TRO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-VIII-18` | Quản lý danh mục loại hình tiếp nhận | UC116 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 19 | `FR-VIII-19` | Quản lý danh mục kênh tiếp nhận | UC117 | SCR-VIII-01: Quản lý Danh mục | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 20 | `FR-VIII-20` | Quản lý đăng nhập | UC118 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-VIII-21` | Quản lý đăng xuất | UC119 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-VIII-22` | Đăng ký tài khoản — Self-registration | UC191 | SCR-VIII-08: Dang ky Tai khoan | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-VIII-23` | Đăng nhập bằng VNeID | UC192 | SCR-VIII-07: Dang nhap | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 24 | `FR-VIII-24` | Đăng xuất VNeID | UC193 | SCR-VIII-09: Dang xuat | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 25 | `FR-VIII-25` | Đồng bộ tài khoản VNeID | UC194 | — | `TAI_KHOAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ❌ FR-11 — Báo cáo Thống kê

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-IX-01` | BC Số lượng hỏi đáp/vướng mắc | UC120 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-IX-02` | BC Vụ việc đã tiếp nhận | UC121 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-IX-03` | BC Vụ việc đang hỗ trợ | UC122 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-IX-04` | BC Vụ việc đã hoàn thành | UC123 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-IX-05` | BC Vụ việc theo thời gian | UC124 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-IX-06` | BC Lớp đào tạo đang diễn ra | UC125 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-IX-07` | BC Lớp đào tạo đã diễn ra | UC126 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-IX-08` | BC Số lượng CG/TVV | UC127 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-IX-09` | BC Đánh giá hiệu quả HTPL | UC128 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-IX-10` | BC Chất lượng đào tạo | UC129 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-IX-11` | BC Vụ việc theo đơn vị quản lý | UC130 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-IX-12` | BC Vụ việc theo lĩnh vực | UC131 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-IX-13` | BC Vụ việc theo loại hình DN | UC132 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 14 | `FR-IX-14` | BC Vụ việc theo thời gian chi tiết | UC133 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 15 | `FR-IX-15` | BC Chi phí chi trả hỗ trợ | UC134 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-IX-16` | BC Chi phí theo đơn vị | UC135 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-IX-17` | BC Chi phí theo lĩnh vực | UC136 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-IX-18` | BC Chi phí theo loại hình DN | UC137 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 19 | `FR-IX-19` | BC Chi phí theo thời gian | UC138 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 20 | `FR-IX-20` | BC Số lượng CT hỗ trợ | UC139 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 21 | `FR-IX-21` | BC CT theo đơn vị | UC140 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 22 | `FR-IX-22` | BC CT theo lĩnh vực | UC141 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 23 | `FR-IX-23` | BC CT theo thời gian | UC142 | SCR-IX-01: Trang Báo cáo Thống kê | `BAO_CAO` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-12 — Tư vấn pháp luật chuyên sâu

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.1-01` | Quản lý nội dung tư vấn với chuyên gia | UC147 | SCR-X1-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.1-02` | Tìm kiếm nội dung tư vấn với chuyên gia | UC148 | SCR-X1-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 3 | `FR-X.1-03` | Tiếp nhận nội dung tư vấn với chuyên gia | UC149 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.1-04` | Quản lý hồ sơ pháp lý doanh nghiệp | UC150 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.1-05` | Tiếp nhận hồ sơ pháp lý doanh nghiệp | UC151 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-X.1-06` | Quản lý tư liệu pháp lý của vụ việc | UC152 | — | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-X.1-07` | Tiếp nhận đánh giá chất lượng tư vấn với chuyên gia | UC153 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ✅ FR-13 — Tư vấn Nhanh

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.2-01` | Quản lý kho câu hỏi/tư vấn | UC158 | SCR-X2-01 | `DANH_MUC` | `R` | 👁️ | ✓R / ✗POST→403/PUT→403/DELETE→403 |
| 2 | `FR-X.2-02` | Quản lý tư vấn nhanh | UC159 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-X.2-03` | DN gửi câu hỏi | UC160 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-X.2-04` | DN tìm kiếm phản hồi | UC161 | — | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-X.2-05` | DN đánh giá nội dung trả lời | UC162 | SCR-X2-03 | `KHO_CAU_HOI` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-14 — Hợp đồng Tư vấn

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-X.3-01` | Quản lý HĐ tư vấn | UC163 | SCR-X3-01 | `HOP_DONG_TU_VAN` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-X.3-02` | Tìm kiếm hợp đồng tư vấn | UC163e | SCR-X3-01 | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |

### ❌ FR-15 — Chương trình HTPLDN

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XI-01` | Quản lý chương trình HTPL | UC164 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XI-02` | Tìm kiếm CT HTPL | UC165 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XI-03` | Trình phê duyệt CT | UC166 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XI-04` | Phê duyệt CT | UC167 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XI-05` | Công bố kế hoạch CT | UC168 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 6 | `FR-XI-05a` | Quản lý đợt báo cáo CT HTPLDN | UC195 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 7 | `FR-XI-06` | Lập BC kết quả thực hiện CT | UC169 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XI-07` | Trình phê duyệt BC | UC170 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XI-07a` | Phê duyệt BC kết quả thực hiện CT | UC196 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XI-08` | Gửi kết quả lên TW | UC171 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 11 | `FR-XI-09` | TW tổng hợp BC | UC172 | SCR-XI-01: Quan ly CT HTPLDN (tong hop) | `BAO_CAO_CT_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

### ✅ FR-16 — API Kết nối Chia sẻ

| # | Function code | Chức năng | UC | Submenu / Màn hình | Entity | Quyền | Icon | Positive / Negative |
|---|---------------|-----------|-----|-------|--------|-------|------|---------------------|
| 1 | `FR-XII-01` | API Chia sẻ hỏi đáp | UC171 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 2 | `FR-XII-02` | API Tìm kiếm hỏi đáp | UC172 | — | `HOI_DAP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 3 | `FR-XII-03` | API Chia sẻ đào tạo | UC173 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 4 | `FR-XII-04` | API Tìm kiếm đào tạo | UC174 | — | `KHOA_HOC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 5 | `FR-XII-05` | API Chia sẻ CG/TVV | UC175 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 6 | `FR-XII-06` | API Tìm kiếm CG/TVV | UC176 | — | `TU_VAN_VIEN` | `R*` | 👁️ | ✓R* / ✗POST→403/PUT→403/DELETE→403 |
| 7 | `FR-XII-07` | API Chia sẻ vụ việc | UC177 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 8 | `FR-XII-08` | API Tìm kiếm vụ việc | UC178 | — | `VU_VIEC` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 9 | `FR-XII-09` | API Chia sẻ đánh giá hiệu quả | UC179 | — | `KET_QUA_DANH_GIA` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 10 | `FR-XII-10` | API Tìm kiếm đánh giá | UC180 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 11 | `FR-XII-11` | API Chia sẻ biểu mẫu | UC181 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 12 | `FR-XII-12` | API Tìm kiếm biểu mẫu | UC182 | — | `BIEU_MAU` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 13 | `FR-XII-13` | API Chia sẻ tư vấn chuyên sâu | UC183 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 14 | `FR-XII-14` | API Tìm kiếm tư vấn chuyên sâu | UC184 | — | — | `?` | ❓ | ✓(entity không xác định) / ✗— |
| 15 | `FR-XII-15` | API Chia sẻ CT HTPLDN | UC185 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 16 | `FR-XII-16` | API Tìm kiếm CT HTPLDN | UC186 | — | `CHUONG_TRINH_HTPL` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 17 | `FR-XII-17` | API Chia sẻ hồ sơ pháp lý DN | UC189 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |
| 18 | `FR-XII-18` | API Tìm kiếm hồ sơ pháp lý DN | UC190 | — | `DOANH_NGHIEP` | `—` | ❌ | ✓Không quyền / ✗Truy cập = 403 / UI ẩn |

---

## Gợi ý test theo role

### Thứ tự recommend:
1. **QTHT** — highest coverage, CRUD 8 entity quản trị + R 38 entity nghiệp vụ.
2. **CB_NV_TW/BN/DP** — core workflow CRUD per cấp. Test BR-AUTH-03 cross-cấp.
3. **CB_PD_TW/BN/DP** — phê duyệt workflow. Test BR-AUTH-05.
4. **NHT** — double-filter BR-AUTH-10.
5. **DN** — API inbound only, không CMS UI.
6. **TVV, CG** — portal roles, coverage thấp.

### BR liên quan:
- `BR-AUTH-03` — ngang cấp KHÔNG thấy nhau
- `BR-AUTH-05` — phê duyệt cùng cấp
- `BR-AUTH-08` — scope theo `don_vi_id`, QTHT exception
- `BR-AUTH-10` — double-filter NHT/TVV/CG
- `BR-FLOW-03` — không sửa/xóa sau phê duyệt

### Caveats
- ⚠️ **Function → entity mapping là heuristic**: dùng entity count trong function block + manual override cho FR-10/FR-11. Nếu test fail bất ngờ, verify entity mapping trong file gốc `srs-fr-XX.md`.
- ⚠️ **FR-01 (Dashboard) + FR-16 (API):** Dashboard reads data từ nhiều entity — không có primary. API layer không map 1-1 với entity. Quyền thực tế phải test theo từng chức năng cụ thể.
- ⚠️ **TVV ≠ NHT trên Vụ việc:** TVV không có quyền VU_VIEC/HO_SO_VU_VIEC/KET_QUA_VU_VIEC (xem section TVV).
- ⚠️ **DN qua API:** Mọi action DN phải test qua API endpoint, KHÔNG qua CMS UI.

---

## Changelog
- **2026-04-21** — Rewrite v2: drill-down xuống function/screen level (198 function × 11 role). Parse từ SRS v3.1 §3.4.2 + FR-01..16 files.
- **2026-04-21 (v1)** — Initial entity-level pivot, superseded.