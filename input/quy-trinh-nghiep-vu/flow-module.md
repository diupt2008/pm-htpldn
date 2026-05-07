
> **Thứ tự sắp xếp các module dưới đây đã được đồng bộ với [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md`](./quy-trinh-nghiep-vu/02-thu-tu-module.md)** — phân lớp theo nhân quả phụ thuộc dữ liệu (upstream → downstream). Module A phụ thuộc dữ liệu của module B ⇒ test B trước A.
>
> **⚠️ Lưu ý về luồng đồng bộ (từ Cổng PLQG / DVC / API):** Luồng này hiện **CHƯA test được** do chưa có integration/test key với phía Cổng. Để tạo master data phục vụ test, tester phải **thay bước đồng bộ bằng bước nhập thủ công** (CB NV thao tác trực tiếp trên CMS) — đã lồng vào **Bước 1** của mỗi bảng flow bên dưới.
>
> **Nguồn dữ liệu thủ công:** NotebookLM query ngày 2026-04-22 trên SRS v3. Sync thứ tự 2026-04-24 theo nhân quả nhất quán với `02-thu-tu-module.md`.

---

## Mục lục

**[BƯỚC 1 — Dữ liệu nền tảng + Hub Tier](#bước-1--dữ-liệu-nền-tảng--hub-tier)**

**[BƯỚC 2 — Master data](#bước-2--master-data)**
- [§1. Hồ sơ doanh nghiệp (FR-V.III-01)](#1-flow-luồng-hồ-sơ-doanh-nghiệp-fr-viii-01--nhóm-viii)
- [§2. Hồ sơ tư vấn viên (SM-TVV)](#2-flow-luồng-hồ-sơ-tư-vấn-viên-sm-tvv---nhóm-iv)
- [§3. Thư viện biểu mẫu (SM-BIEUMAU)](#3-flow-luồng-thư-viện-biểu-mẫu-sm-bieumau--nhóm-vii)
- [§4. CT HTPLDN — GĐ1 Kế hoạch (SM-CHUONG_TRINH_HTPL)](#4-flow-luồng-chương-trình-htpldn--giai-đoạn-1-kế-hoạch-sm-chuong_trinh_htpl--nhóm-xi)

**[BƯỚC 3 — Giao dịch cốt lõi](#bước-3--giao-dịch-cốt-lõi)**
- [§5. Vụ việc trợ giúp pháp lý (SM-VUVIEC)](#5-flow-tạo-dữ-liệu-luồng-vụ-việc-trợ-giúp-pháp-lý-sm-vuviec)
- [§6. Hỏi đáp pháp lý (SM-HOIDAP)](#6-flow-tạo-dữ-liệu-luồng-hỏi-đáp-pháp-lý-sm-hoidap)
- [§7. Tư vấn chuyên sâu (SM-TVCS)](#7-flow-luồng-tư-vấn-chuyên-sâu-sm-tvcs---nhóm-x1)
- [§8. Khóa đào tạo, tập huấn (SM-KHOAHOC)](#8-flow-luồng-khóa-đào-tạo-tập-huấn-sm-khoahoc---nhóm-iii)

**[BƯỚC 4 — Hậu kỳ & liên kết](#bước-4--hậu-kỳ--liên-kết)**
- [§9. Hợp đồng tư vấn (FR-X.3-01)](#9-flow-luồng-hợp-đồng-tư-vấn-fr-x3-01---nhóm-x3)
- [§10. Chi trả chi phí tư vấn (SM-CHITRA)](#10-flow-luồng-chi-trả-chi-phí-tư-vấn-sm-chitra---nhóm-vii)
- [§11. Đánh giá hiệu quả (SM-DANHGIA)](#11-flow-luồng-đánh-giá-hiệu-quả-sm-danhgia---nhóm-vi)
- [§12. Tư vấn nhanh + Kho Q&A (SM-TVNHANH)](#12-flow-luồng-tư-vấn-nhanh-sm-tvnhanh--kho-qa---nhóm-x2)

**[BƯỚC 5 — Dữ liệu đầu ra & báo cáo](#bước-5--dữ-liệu-đầu-ra--báo-cáo)**
- [§13. CT HTPLDN — GĐ2 Đợt báo cáo (SM-DOT-BC)](#13-flow-luồng-chương-trình-htpldn--giai-đoạn-2-đợt-báo-cáo-sm-dot-bc---nhóm-xi)
- [§14. Báo cáo thống kê (FR-IX-01..23)](#14-flow-luồng-báo-cáo-thống-kê-fr-ix-0123--nhóm-ix)
- [§15. Dashboard (FR-I-01..09)](#15-dashboard-fr-i-0109--nhóm-i)
- [§16. API kết nối (FR-16)](#16-flow-luồng-api-kết-nối-fr-16--nhóm-xii)

**Phụ lục**
- [Phụ lục 1 — Bảng tóm tắt "Thêm mới thủ công" tất cả module](#phụ-lục-bảng-tóm-tắt-thêm-mới-thủ-công-tất-cả-module)
- [Phụ lục 2 — Seed data presets (Happy path E2E)](#phụ-lục-2-seed-data-presets--happy-path-e2e)
- [Phụ lục 3 — Troubleshooting khi seed](#phụ-lục-3-troubleshooting-khi-seed)

---

## [BƯỚC 1 — DỮ LIỆU NỀN TẢNG + HUB TIER]

Trước khi seed data cho bất kỳ module nào, nắm thứ tự tạo data hub entities (upstream → downstream). Module downstream đọc data từ Tier thấp hơn — thiếu upstream thì tab/màn hình downstream rỗng hoặc workflow block.

> **Mapping Tier ↔ BƯỚC (workflow phase):** Tier = dependency depth (entity nào có FK vào entity nào). BƯỚC = thứ tự thực hiện trong luồng test (theo `quy-trinh-tai-khoan-tao-du-lieu.md`). Tier 0 ≈ BƯỚC 1 (nền tảng QTHT), Tier 1 ≈ BƯỚC 2 (master), Tier 2 ≈ BƯỚC 3 (giao dịch cốt lõi), Tier 3 ≈ BƯỚC 4 (hậu kỳ), output ≈ BƯỚC 5.
>
> **M0 QTHT prereq:** File này KHÔNG có flow seed chi tiết cho `DANH_MUC` / `DON_VI` / `TAI_KHOAN` — giả định QTHT đã setup xong khi môi trường test được cung cấp. Giá trị mong đợi: xem `input/data/seed-fixture.yaml > tier_0_prerequisite`. Nếu thiếu, nhờ QTHT seed qua `SCR-VIII-01/02/03/04/13/14`.

| Tier | Entity | Module (§ trong file này) | Vai trò |
| :--- | :--- | :--- | :--- |
| 0 | `DANH_MUC`, `DON_VI`, `TAI_KHOAN` | M0 QTHT (SCR-VIII-xx) | Master data cho phân quyền + dropdown — prereq cho TẤT CẢ module (BƯỚC 1) |
| 1 | `DOANH_NGHIEP` (DN), `TU_VAN_VIEN` (TVV), `BIEU_MAU`, `CT_HTPLDN` (GĐ1 Kế hoạch) | §1, §2, §3, §4 | Master actor + tài liệu nền + khung chỉ đạo — prereq cho §5/§6/§7/§8/§10/§12 (BƯỚC 2) |
| 2 | `VU_VIEC`, `HOI_DAP`, `TV_CHUYEN_SAU_YC`, `KHOA_HOC` | §5, §6, §7, §8 | Transactional hub — BƯỚC 3 giao dịch cốt lõi |
| 3 | `HOP_DONG_TV`, `HO_SO_CHI_TRA`, `KE_HOACH_DANH_GIA`, `KHO_CAU_HOI` (TU_DONG) | §9, §10, §11, §12 | Downstream — BƯỚC 4 hậu kỳ (phụ thuộc Tier 2) |
| 4 | `DOT_BAO_CAO` (GĐ2 CT HTPLDN — chính thức 3.4.3.10a v3.5, SM-DOT-BC 6 states), `BAO_CAO`, Dashboard aggregate, API outbound | §13, §14, §15, §16 | Output — BƯỚC 5 đầu ra (phụ thuộc Tier 1+2+3) |

**Bảng Entity Map chi tiết** (mỗi entity tạo ở SCR nào, đọc ở SCR nào, quan hệ 1:N/N:N): xem file riêng [`input/data/entity-map.md`](./data/entity-map.md).

**Seed data presets** (preset P1/P2/P3/P4 để cover happy path): xem [Phụ lục 2](#phụ-lục-2-seed-data-presets--happy-path-e2e) cuối file này.

> **⚠️ CẬP NHẬT 2026-05-05 — apply 3 SRS update từ srs-update-2026-5-5/:**
> - **Tier 0 thêm entity NGAY_LE** (FR-VIII-29 mới) — QTHT seed danh sách ngày lễ trước khi test SLA (BR-CALC-03 trừ ngày lễ khi tính ngày làm việc). Ảnh hưởng 4 module SLA: VV/Hỏi đáp/TV CS/Chi trả. Seed fixture: xem `seed-fixture.yaml > tier_0_prerequisite > ngay_le_variants`.
> - **Tier 1 thêm 2 entity:** NGUOI_HO_TRO (NHT — xem §2a) + TO_CHUC_TU_VAN (TC TV — xem §2b). NHT/TC TV là master cho phân công VV/Hỏi đáp + dropdown TVV chọn TC chính.
> - **Trigger SM-TAIKHOAN ↔ SM-TVV/SM-NHT:** FR-VIII-26 mới (Quên MK / Kích hoạt TK lần đầu) trigger update đồng thời SM-TVV/SM-NHT khi user bấm link kích hoạt → hai SM cùng chuyển `CHO_KICH_HOAT` → `HOAT_DONG`.
> - **DN: bỏ luồng CB NV tạo, chuyển sang FR-VIII-22 self-reg** — xem §1 đã cập nhật.

---

## [BƯỚC 2 — MASTER DATA]

### 1. FLOW LUỒNG "HỒ SƠ DOANH NGHIỆP" (FR-V.III-01 + FR-VIII-22) — Nhóm V.III + Nhóm VIII

> **⚠️ CẬP NHẬT 2026-05-05 (apply SRS update srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md + srs-fr-10-quan-tri.md):**
> - **BỎ chức năng "Thêm mới DN" trên CMS** — CB NV KHÔNG còn quyền tạo DN qua SCR-V.III-02 (FR-V.III-NEW-01 Import Excel cũng BỎ).
> - **DN tự đăng ký TK-first qua FR-VIII-22** (login page button "Đăng ký dành cho doanh nghiệp" → SCR-VIII-08 form 22 trường).
> - SCR-V.III-02 chỉ còn xem/sửa/xóa (CB NV quyền 📝 RU\*D, không C).
> - Tham chiếu: [`_DELTA-MAP-FR07.md`](../srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../srs-update-2026-5-5/_DELTA-MAP-FR10.md).

Module master data — KHÔNG có state machine cho DN. Tài khoản DN có SM-TAIKHOAN (CHO_KICH_HOAT → HOAT_DONG qua FR-VIII-26).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Self-reg)** | **Doanh nghiệp** chưa có TK | (Tạo mới TAI_KHOAN + DOANH_NGHIEP) ➔ TK ở `CHO_KICH_HOAT` | Mở login page (`/login`), click **[Đăng ký dành cho doanh nghiệp]** → mở SCR-VIII-08 form 22 trường (19 thông tin DN + 3 TK: username/password/đồng ý điều khoản). Nhập đủ thông tin DN (giống Inputs FR-V.III-01) + Tên TK + MK ≥ 8 ký tự. Submit → hệ thống auto-pass (KHÔNG validate với cơ quan ngoài). Tạo TAI_KHOAN role 'DN' ở `CHO_KICH_HOAT` + DOANH_NGHIEP với MST làm khóa định danh. Mail link kích hoạt vĩnh viễn được gửi về email DN khai (qua Mailhog test inbox 103.172.236.130:8025). |
| **2 (Kích hoạt)** | **Doanh nghiệp** | TK `CHO_KICH_HOAT` ➔ `HOAT_DONG` | DN kiểm mail (Mailhog), bấm link kích hoạt → mở form đặt mật khẩu mới (FR-VIII-26). Nhập MK ≥ 8 ký tự + xác nhận → Lưu. Hệ thống verify token (1 lần dùng) + chuyển TK sang `HOAT_DONG`. DN có thể login + dùng đầy đủ chức năng. |
| **3 (CB NV xem/sửa)** | **Cán bộ Nghiệp vụ** (CB NV) | *Không có SM cho DN* | CB NV truy cập `SCR-V.III-01`, xem danh sách DN scope theo BR-AUTH-08. Click DN → SCR-V.III-02 chi tiết. Có thể **Sửa** thông tin DN (📝 RU\*D) + xem lịch sử hỗ trợ + hồ sơ PL DN + hồ sơ chi trả. **KHÔNG có nút [+ Thêm mới] hoặc [Import Excel]**. |
| *(Phụ)* | CB NV | — | Xóa mềm: chỉ cho phép xóa khi DN không còn VV đang xử lý (nếu có → `ERR-DN-03`). |

---

### 2. FLOW LUỒNG "HỒ SƠ TƯ VẤN VIÊN / CHUYÊN GIA" (SM-TVV) - Nhóm IV

> **⚠️ CẬP NHẬT 2026-05-05 (apply SRS update srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md):**
> - **NHT đã TÁCH entity riêng** (NGUOI_HO_TRO, NĐ 55/2019 Đ.7) — xem **§2a flow mới**. Module này chỉ còn TVV/CG cá nhân ngoài (NĐ 77/2008).
> - `loai_tvv` enum giờ chỉ `('TVV','CG')`, BỎ `'NHT'`.
> - Field `dia_ban_ids[]` BỎ — TVV scope toàn quốc theo NĐ 77/2008 Đ.19.
> - SM-TVV thêm state mới `CHO_KICH_HOAT` sau phê duyệt → TVV bấm link mail (FR-VIII-26) → `HOAT_DONG`. **Hệ thống tự cấp TK** ở bước phê duyệt (gọi FR-VIII-15).
> - Thang điểm thẩm định đổi 0-10 → **1-5** DECIMAL(3,1).
> - Bỏ cooldown 6 tháng khi nộp lại sau TU_CHOI.
> - Tham chiếu: [`_DELTA-MAP-FR04.md`](../srs-update-2026-5-5/_DELTA-MAP-FR04.md).

Luồng thẩm định và kết nạp Chuyên gia/Tư vấn viên (TVV/CG) vào mạng lưới. Luồng chuẩn yêu cầu TVV tự đăng ký từ chuyên trang ngoài → **hiện chưa test được do chưa có chuyên trang public**. Tester dùng luồng thủ công ở Bước 1 để tạo hồ sơ thẳng lên `CHỜ THẨM ĐỊNH`.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công — thay cho "TVV tự đăng ký từ chuyên trang")** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `MỚI ĐĂNG KÝ` | CB NV vào danh sách TVV (menu **"Tư vấn viên / Chuyên gia"** — đổi tên 2026-05-05), click **[+ Thêm mới]** → mở form `SCR-IV-02`. Nhập hộ TVV: họ tên, chứng chỉ hành nghề, bằng cấp, đơn vị công tác (`don_vi_id`), upload file đính kèm. **`loai_tvv` chỉ TVV hoặc CG** (KHÔNG còn NHT). Lưu → bản ghi tạo với trạng thái `MOI_DANG_KY`. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `MỚI ĐĂNG KÝ` ➔ `CHỜ THẨM ĐỊNH` | Đăng nhập CMS, mở danh sách, nhấn nút **[Tiếp nhận]** hồ sơ. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `CHỜ THẨM ĐỊNH` ➔ `ĐANG THẨM ĐỊNH` | Mở hồ sơ, chọn tab Thẩm định, bắt đầu tiến hành chấm điểm. |
| *(Phụ)* | CB NV | `ĐANG THẨM ĐỊNH` ➔ `YÊU CẦU BỔ SUNG` | Nếu thiếu giấy tờ, CB NV chọn kết luận Yêu cầu bổ sung và nhập lý do. Hồ sơ trả về cho TVV cập nhật lại. |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG THẨM ĐỊNH` ➔ `CHỜ PHÊ DUYỆT` | CB NV chấm điểm 4 nhóm tiêu chí (Pháp lý, Năng lực, Hiệu quả, Mạng lưới) — **thang 1-5** (đổi từ 0-10). Khi nhóm Pháp lý ĐẠT, chọn kết luận Đạt và nhấn **[Trình duyệt]**. |
| **5** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHỜ PHÊ DUYỆT` ➔ `CHỜ KÍCH HOẠT` | Log out CB NV. **Đăng nhập CB PD**. Mở danh sách chờ duyệt, kiểm tra và nhấn **[Phê duyệt]**. Hệ thống tự động: (a) chuyển TVV `CHO_KICH_HOAT`; (b) tạo TAI_KHOAN role TVV/CG ở `CHO_KICH_HOAT`; (c) gửi mail link kích hoạt vĩnh viễn. |
| **6 (Kích hoạt)** | **TVV/CG** (chủ hồ sơ) | `CHỜ KÍCH HOẠT` ➔ `ĐANG HOẠT ĐỘNG` | TVV bấm link mail (Mailhog) → form đặt mật khẩu lần đầu (FR-VIII-26). Nhập MK + xác nhận → Lưu. TAI_KHOAN + TU_VAN_VIEN đồng thời chuyển `HOAT_DONG`. TVV có thể login + được phân công vụ việc. |

---

### 2a. FLOW LUỒNG "HỒ SƠ NGƯỜI HỖ TRỢ PHÁP LÝ" (SM-NHT) — Nhóm IV `[NEW 2026-05-05]`

Module mới — entity NGUOI_HO_TRO (NĐ 55/2019 Đ.7). NHT là **cán bộ HTPL nội bộ** (Sở TP/Bộ ngành/UBND/tổ chức đại diện DN), KHÔNG phải cá nhân ngoài hành nghề. KHÔNG cần workflow thẩm định 4 tiêu chí như TVV — chỉ cần kích hoạt TK lần đầu.

**4 state SM-NHT:** `CHO_KICH_HOAT` → `HOAT_DONG` → `TAM_DUNG` → `VO_HIEU_HOA` (back-loop được).

Account cần chuẩn bị: `Quản trị HT (qtht_01)` HOẶC `Cán bộ Nghiệp vụ` (cùng đơn vị với NHT muốn tạo).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **QTHT** hoặc **CB NV** | (Tạo mới NHT + TAI_KHOAN) ➔ `CHO_KICH_HOAT` | Truy cập sub-menu **"Người hỗ trợ pháp lý"** (NHT) → click **[+ Thêm mới]** trên `SCR-IV-NHT-02`. Nhập 5 trường bắt buộc: ho_ten, email, username, don_vi_id (CB NV mặc định = đơn vị mình, lock; QTHT chọn tự do), linh_vuc_ids (≥1, FK → DANH_MUC). Lưu → hệ thống **đồng thời tạo TAI_KHOAN role 'NHT'** ở CHO_KICH_HOAT + gửi mail link kích hoạt vĩnh viễn (1 lần dùng). |
| **2 (Kích hoạt)** | **NHT** (chủ hồ sơ) | `CHO_KICH_HOAT` ➔ `HOAT_DONG` | NHT kiểm mail (Mailhog), bấm link → form đặt MK lần đầu (FR-VIII-26). Submit → TAI_KHOAN + NGUOI_HO_TRO đồng thời chuyển `HOAT_DONG`. NHT login được + xuất hiện trong dropdown UC59 modal Phân công NHT (SCR-V.I-03), filter theo linh_vuc_pl khớp + don_vi_id (BR-AUTH-08). |
| *(Phụ)* | CB NV | `HOAT_DONG` ⟷ `TAM_DUNG` | Tạm dừng/kích hoạt lại NHT khi cần (vd nghỉ phép dài). |
| *(Phụ)* | CB NV | `HOAT_DONG/TAM_DUNG` ➔ `VO_HIEU_HOA` | Vô hiệu hóa NHT (vd nghỉ việc). NHT KHÔNG thể login + KHÔNG xuất hiện dropdown phân công. |

---

### 2b. FLOW LUỒNG "TỔ CHỨC TƯ VẤN" (SM-TCTV) — Nhóm IV `[NEW 2026-05-05]`

Module mới — entity TO_CHUC_TU_VAN nâng cấp từ danh mục thành entity riêng (NĐ 77/2008 + NĐ 55/2019 Đ.10). Workflow tương tự SM-TVV nhưng đơn giản hơn (KHÔNG có thẩm định 4 tiêu chí, chỉ phê duyệt công bố theo NĐ 55/2019 Đ.9).

**6 state SM-TCTV:** `MOI_DANG_KY` → `CHO_PHE_DUYET` → `HOAT_DONG` ⟷ `TAM_DUNG` → `VO_HIEU_HOA`. Còn `TU_CHOI` ⟷ `CHO_PHE_DUYET` (loop).

Account cần chuẩn bị: `Cán bộ Nghiệp vụ` + `Cán bộ Phê duyệt` cùng cấp (BR-AUTH-05 — KHÔNG xuyên cấp).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công — tạo TC TV)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `MOI_DANG_KY` | CB NV truy cập sub-menu **"Tổ chức tư vấn"** → click **[+ Thêm mới]** trên `SCR-IV-NEW-02`. Nhập: ten_to_chuc, loai_hinh (CONG_TY_LUAT/VP_LUAT_SU/TT_TVPL/KHAC), nguoi_dai_dien, **so_giay_dkhd + ngay_cap_dkhd** (Giấy ĐKHĐ Sở TP — bắt buộc theo NĐ 77/2008 Đ.13), linh_vuc_ids (≥1), dia_chi. Lưu → bản ghi tạo trạng thái `MOI_DANG_KY`. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `MOI_DANG_KY` ➔ `CHO_PHE_DUYET` | CB NV mở chi tiết TC TV (`SCR-IV-NEW-03`), nhấn nút **[Trình duyệt]**. Hệ thống thông báo CB PD cùng cấp. |
| **3** | **Cán bộ Phê duyệt** (CB PD cùng cấp — BR-AUTH-05) | `CHO_PHE_DUYET` ➔ `HOAT_DONG` | Log out CB NV. **Đăng nhập CB PD**. Mở danh sách chờ duyệt → mở chi tiết TC TV → nhấn **[Phê duyệt]** + nhập **so_quyet_dinh** (bắt buộc, format `QĐ-{số}/QĐ-{đơn_vị}`). Hệ thống set `ngay_cong_nhan = NOW()`. TC TV được phép tham gia phân công VV + công khai lên Cổng PLQG (FR-IV-08). |
| *(Phụ)* | CB PD | `CHO_PHE_DUYET` ➔ `TU_CHOI` | Nếu thiếu/sai → từ chối + nhập lý do ≥10 ký tự. CB NV nhận thông báo, sửa lại + trình lại (TU_CHOI ➔ CHO_PHE_DUYET). |
| *(Phụ)* | CB NV | `HOAT_DONG` ⟷ `TAM_DUNG` | CB NV tạm dừng/kích hoạt lại TC TV khi cần (FR-IV-NEW-02). |
| *(Phụ)* | CB NV | `HOAT_DONG/TAM_DUNG` ➔ `VO_HIEU_HOA` | Vô hiệu hóa TC TV — **GUARD**: KHÔNG có TVV đang liên kết hoạt động (`TVV_TO_CHUC.trang_thai='KICH_HOAT' AND TU_VAN_VIEN.trang_thai='HOAT_DONG'` count = 0). Nếu có → ERR-TT-TC-02. Đã công khai → tự động gỡ Cổng PLQG. |

---

### 3. FLOW LUỒNG "THƯ VIỆN BIỂU MẪU" (SM-BIEUMAU) — Nhóm VII
Module master tài liệu — **KHÔNG có phê duyệt**. CB NV tự upload và tự chịu trách nhiệm khi đẩy lên Cổng PLQG. KHÔNG phải FK required của module khác → có thể seed song song với DN/TVV.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `NHÁP` | Tạo thư mục trên `SCR-VII-02`, sau đó tải file Biểu mẫu/Hợp đồng mẫu (doc/xls) lên hệ thống. Dữ liệu lưu nội bộ. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `NHÁP` ➔ `CÔNG KHAI` | Nhấn chọn biểu mẫu/thư mục và click nút **[Công khai]**. Hệ thống gọi API đẩy file thẳng lên chuyên trang Cổng PLQG cho DN tải về. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `CÔNG KHAI` ➔ `ẨN` | Nếu phát hiện biểu mẫu lỗi thời, nhấn nút **[Ẩn]** (hoặc Hủy công khai) để gỡ biểu mẫu khỏi Cổng. |

---

### 4. FLOW LUỒNG "CHƯƠNG TRÌNH HTPLDN — GIAI ĐOẠN 1: KẾ HOẠCH" (SM-CHUONG_TRINH_HTPL) — Nhóm XI
Module Chương trình HTPLDN có **2 giai đoạn tách biệt về nhân quả**:
- **Giai đoạn 1 (MỤC NÀY, BƯỚC 2):** CB NV tạo + trình + duyệt + công bố + kích hoạt kế hoạch CT. **KHÔNG cần** số liệu VV/Chi trả/Đào tạo. Độc lập với Layer 3+4.
- **Giai đoạn 2 (xem §13 BƯỚC 5):** Đợt Báo cáo cho CT `DANG_THUC_HIEN`. **Cần đủ** số liệu Layer 3+4 trong kỳ.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `DỰ THẢO` | Vào module CT HTPLDN → click **[+ Tạo Kế hoạch]** trên `SCR-XI-01` (Tab Thông tin). Nhập mục tiêu, thời gian, ngân sách, đơn vị chủ trì. Lưu. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `DỰ THẢO` ➔ `CHỜ PHÊ DUYỆT` | Khi kế hoạch đã hoàn chỉnh, nhấn nút **[Trình phê duyệt]**. |
| **3** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | Log out CB NV. **Đăng nhập CB PD**. Mở danh sách chờ duyệt, kiểm tra thông tin và nhấn **[Phê duyệt]**. |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ DUYỆT` ➔ `ĐÃ CÔNG BỐ` | Log out CB PD. **Đăng nhập CB NV**. Nhấn nút **[Công bố]** để đẩy kế hoạch hiển thị lên Cổng Pháp luật Quốc gia qua API. |
| **5** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ CÔNG BỐ` ➔ `ĐANG THỰC HIỆN` | Khi chương trình chính thức bắt đầu, nhấn nút **[Kích hoạt]** (hoặc Bắt đầu thực hiện). Từ lúc này mới có thể tạo đợt báo cáo ở §13 BƯỚC 5. |

---

## [BƯỚC 3 — GIAO DỊCH CỐT LÕI]

### 5. FLOW TẠO DỮ LIỆU LUỒNG "VỤ VIỆC TRỢ GIÚP PHÁP LÝ" (SM-VUVIEC)
Luồng có **12 trạng thái** (SRS v3.5 update 2026-05-06): `MOI_TAO`, `CHO_TIEP_NHAN`, `DA_TIEP_NHAN`, `DANG_KIEM_TRA`, `YEU_CAU_BO_SUNG`, `TU_CHOI`, `DA_PHAN_CONG`, `DANG_XU_LY`, `CHO_PHE_DUYET`, `DA_DUYET`, `HOAN_THANH`, `DA_DANH_GIA`. Luồng đồng bộ DN nộp hồ sơ qua DVC (`MỚI TẠO` → `CHỜ TIẾP NHẬN`) **hiện chưa test được do thiếu integration với DVC**. Tester dùng luồng thủ công ở Bước 1 — CB NV nhập thủ công trên `SCR-V.I-02` → **bypass** 2 state đầu, bản ghi khởi tạo thẳng ở trạng thái `ĐÃ TIẾP NHẬN`.

⚠️ **Update 2026-05-06 (FR-05 v3.5 — cite `srs-update-2026-5-5/srs-fr-05-vu-viec.md`):**
- **SLA mặc định = 15 ngày làm việc** (NĐ 55/2019 Điều 8 Khoản 1 — DNNVV) — đổi từ 10 ngày v3 (Thay đổi 1).
- **Bỏ field `nguoi_ho_tro_id`** khỏi entity VU_VIEC. Thay bằng 3 cột phân công: `loai_doi_tuong_xu_ly` ENUM CA_NHAN/TO_CHUC, `nguoi_xu_ly_id` FK→TAI_KHOAN, `to_chuc_tu_van_id` FK→TO_CHUC_TU_VAN (Thay đổi 8). Khi tạo entry DA_TIEP_NHAN: 3 cột NULL — chỉ set sau Bước 3.
- **Thêm 5 cột công khai** (default `cong_khai=0` khi entry — chỉ set khi CB PD click [Công khai] sau DA_DUYET/HOAN_THANH): `cong_khai`, `anh_dai_dien`, `thoi_gian_dang_tai`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai` (Thay đổi 2 + FR-V.I-NEW-05).
- **2 self-loop SM mới (cờ overlay):** `CONG_KHAI` + `HUY_CONG_KHAI` trên `DA_DUYET` HOẶC `HOAN_THANH` — KHÔNG phải state riêng (xem Bước Phụ 1 dưới).
- **CB PD từ chối phê duyệt → `DANG_XU_LY`** (NHT sửa KQ rồi trình lại) — KHÔNG còn `→ TU_CHOI` đóng VV như v3 (Thay đổi 11).
- **Đánh giá VV (FR-V.I-17 / UC67)**: thang **0-10** (KHÁC thang TVV 1.0-5.0 ở FR-04). CHỈ {CB_NV, DN} được chấm — loại CB_PD theo CSV UC67. UNIQUE(vu_viec_id, loai_nguoi_danh_gia) — mỗi VV tối đa 1 đánh giá CB_NV + 1 đánh giá DN (Thay đổi 12).
- **DN bổ sung HS qua chuyên trang VNeID Tier 2** (FR-V.I-NEW-02) — formal hoá transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` với DN là actor (Thay đổi 4).

Account cần chuẩn bị: `Cán bộ Nghiệp vụ (CB NV)`, `Tư vấn viên (TVV) / Chuyên gia (CG) / Người hỗ trợ (NHT) — cá nhân`, hoặc `Tổ chức tư vấn (TC TV)`, `Cán bộ Phê duyệt (CB PD)`, `Doanh nghiệp (DN — auth Tier 2 VNeID)`.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công — thay cho "DN nộp qua DVC → Chờ tiếp nhận → Tiếp nhận")** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `ĐÃ TIẾP NHẬN` (**bypass** `MỚI TẠO` và `CHỜ TIẾP NHẬN`) | CB NV mở danh sách Vụ việc → click **[+ Thêm mới / Nhập thủ công]** trên `SCR-V.I-02`. Nhập hộ DN: chọn DN liên kết (lookup theo MST — KHÔNG nhập tay 4 field DN info, FR-V.I-04 Thay đổi 16), lĩnh vực pháp lý, nội dung yêu cầu tư vấn, kênh (`TRỰC TIẾP` / `ĐIỆN THOẠI`), upload `file_dinh_kem` (PDF/DOC/DOCX/XLS/XLSX ≤20MB/file). Lưu → bản ghi khởi tạo thẳng ở `DA_TIEP_NHAN` với `cong_khai=0`, 3 cột phân công NULL. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ TIẾP NHẬN` ➔ `ĐANG KIỂM TRA` | Trong chi tiết vụ việc, nhấn nút **[Kiểm tra Hồ sơ]**. Giao diện mở phần checklist 6 hạng mục hồ sơ. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG KIỂM TRA` ➔ `ĐÃ PHÂN CÔNG` | Tích chọn ĐẠT cho các hạng mục. Nhấn **[Hoàn tất Kiểm tra]**. Mở modal phân công (FR-V.I-09) — **2 thẻ**: (a) **Cá nhân** — chọn TAI_KHOAN có vai trò TVV/CG (qua TU_VAN_VIEN.tai_khoan_id) HOẶC NHT (qua NGUOI_HO_TRO.tai_khoan_id), state `HOAT_DONG`, lọc theo `linh_vuc_pl` (KHÔNG dùng "địa bàn" — NĐ 77/2008 Đ.19 TVV scope toàn quốc); (b) **Tổ chức tư vấn** — chọn TO_CHUC_TU_VAN state `HOAT_DONG`, sau đó load danh sách TVV thuộc tổ chức để chọn người cụ thể (constraint TU_VAN_VIEN.to_chuc_chinh_id = to_chuc_tu_van_id — fail → `ERR-PC-06`). Lưu → tạo bản ghi `PHAN_CONG_VU_VIEC` với `trang_thai='CHO_XAC_NHAN'` + cập nhật VU_VIEC: `loai_doi_tuong_xu_ly`, `nguoi_xu_ly_id`, `to_chuc_tu_van_id` (nếu TO_CHUC). |
| **4** | **Cá nhân được phân công** (TVV/CG/NHT — TAI_KHOAN ở `nguoi_xu_ly_id`) | `ĐÃ PHÂN CÔNG` ➔ `ĐANG XỬ LÝ` | Log out CB NV. **Đăng nhập bằng cá nhân được phân công** (TVV/CG cá nhân ngoài hoặc NHT cán bộ HTPL nội bộ; nếu loại=TO_CHUC thì là TVV cụ thể thuộc tổ chức). Mở vụ việc, nhấn nút **[Chấp nhận]** → PHAN_CONG_VU_VIEC.trang_thai='CHAP_NHAN', VU_VIEC sang `DANG_XU_LY`. |
| **5** | **Cá nhân được phân công** | Giữ nguyên `ĐANG XỬ LÝ` | Người xử lý thực hiện công việc, upload văn bản tư vấn và nhập nội dung tại khu vực "Cập nhật Kết quả". |
| **6** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG XỬ LÝ` ➔ `CHỜ PHÊ DUYỆT` | Log out cá nhân được phân công. **Đăng nhập lại CB NV**. Kiểm tra kết quả, nhập kết luận cuối và nhấn **[Trình Phê duyệt]**. Hồ sơ nhảy sang Tab **"Chờ PD"**. |
| **7** | **Cán bộ Phê duyệt** (CB PD cùng cấp — BR-AUTH-05) | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | Log out CB NV. **Đăng nhập bằng Account CB PD** (cùng cấp với CB NV). Mở tab Chờ PD, xem chi tiết và nhấn nút **[Phê duyệt]**. Hồ sơ nhảy sang Tab **"Hoàn thành"**. |
| *(Nhánh 7-từ chối)* | **Cán bộ Phê duyệt** | `CHỜ PHÊ DUYỆT` ➔ `ĐANG XỬ LÝ` (**KHÔNG** `→ TU_CHOI` đóng VV — Thay đổi 11) | Nếu chất lượng KQ chưa đạt → CB PD nhập lý do từ chối ≥10 ký tự (BR-FLOW-04). VV quay về `DANG_XU_LY` để cá nhân được phân công sửa KQ rồi CB NV trình lại. Ghi `LICH_SU_VU_VIEC.hanh_dong='TU_CHOI_DUYET'`. |
| **8** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ DUYỆT` ➔ `HOÀN THÀNH` | **Đăng nhập lại CB NV**. Mở hồ sơ, nhấn **[Cập nhật KQ cuối]** để chính thức đóng hồ sơ. |
| *(Phụ — Đánh giá UC67)* | CB_NV hoặc DN (auth Tier 2 VNeID) — **KHÔNG cho CB_PD** (CSV UC67) | `HOÀN THÀNH` ➔ `ĐÃ ĐÁNH GIÁ` | Trong màn hình chi tiết, mở accordion "Đánh giá", nhập 3 tiêu chí điểm **0-10** (chất lượng / thời gian / thái độ) — `diem_tong` AUTO=AVG. Lưu → tạo bản ghi `DANH_GIA_VU_VIEC` với `loai_nguoi_danh_gia` ∈ {CB_NV, DN}. UNIQUE(vu_viec_id, loai_nguoi_danh_gia) chặn chấm 2 lần cùng loại → ERR-DG-VV-04. |
| *(Phụ 1 — CONG_KHAI cờ overlay, 2 self-loop SM)* | CB PD cùng cấp (BR-AUTH-05) | `ĐÃ DUYỆT` hoặc `HOÀN THÀNH` ↻ self-loop (cờ overlay `cong_khai=0→1` / `1→0`) | CB PD soạn `mo_ta_cong_khai` riêng (≤2000 ký tự — KHÔNG auto-extract từ mo_ta nội bộ), upload `anh_dai_dien` (jpg/png/gif ≤5MB) + chọn `file_dinh_kem_cong_khai` (≤10 file ≤20MB/file) trong số file đã review phù hợp công khai. Nhấn **[Công khai]** → BE gọi API Cổng PLQG (whitelist 9 fields BR-PUBLIC-04 — ẨN tên DN/MST/CCCD/SĐT/email/địa chỉ/mo_ta nội bộ/file nghiệp vụ/noi_dung_tu_van). API OK → set `cong_khai=1` + `thoi_gian_dang_tai=NOW()` (BR-EC-20: KHÔNG set trước khi API OK). Badge xanh "Đã công khai" hiển thị trên SCR-V.I-03 + SCR-V.I-04. Hủy: nhấn **[Hủy công khai]** + nhập `ly_do_huy` ≥20 ký tự → set `cong_khai=0`, clear `thoi_gian_dang_tai=NULL`, gỡ khỏi chuyên trang. Ghi LICH_SU_VU_VIEC `hanh_dong='CONG_KHAI'` / `'HUY_CONG_KHAI'`. |
| *(Phụ 2 — FR-V.I-NEW-02 DN bổ sung HS)* | DN (auth Tier 2 VNeID) | `YÊU CẦU BỔ SUNG` ➔ `ĐANG KIỂM TRA` | DN đăng nhập chuyên trang qua VNeID Tier 2. Mở SCR-V.I-04 "Vụ việc của tôi" → click VV có badge "Cần bổ sung" → form upload `file_bo_sung[]` (PDF/DOC/DOCX/XLS/XLSX/JPG/PNG ≤20MB/file, tổng ≤100MB, max 10 file, quét virus) + `ghi_chu` ≤5000 ký tự. BE check: (1) trạng thái VV=`YEU_CAU_BO_SUNG`, (2) DN là chủ sở hữu VV, (3) chưa quá hạn `(NOW() - ngay_yeu_cau_bo_sung) ≤ cau_hinh_sla.bo_sung_timeout` (BR-EC-16). Lưu → set `trang_thai=DANG_KIEM_TRA`, gửi thông báo CB NV phụ trách, ghi LICH_SU_VU_VIEC `hanh_dong='BO_SUNG_HS', vai_tro='DN'`. 4 mã lỗi: ERR-VV-BS-01..04. |

---

### 6. FLOW TẠO DỮ LIỆU LUỒNG "HỎI ĐÁP PHÁP LÝ" (SM-HOIDAP)
Luồng có 9 trạng thái, tính năng đặc biệt là có sự tự động chuyển trạng thái (Auto-transition). Luồng đồng bộ DN gửi câu hỏi từ chuyên trang Cổng PLQG **hiện chưa test được**. Tester dùng luồng thủ công ở Bước 1 — CB NV nhập hộ câu hỏi trên `SCR-II-01`.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công — thay cho "DN gửi từ Cổng PLQG → Mới")** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `MỚI` | CB NV mở module Hỏi đáp → click **[+ Thêm mới]** trên `SCR-II-01` (form Drawer/Modal). Nhập hộ DN: DN liên kết, lĩnh vực, tiêu đề, nội dung câu hỏi. Lưu → bản ghi tạo với trạng thái `MỚI`, hiển thị ở Tab **"Mới"**. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `MỚI` ➔ `TIẾP NHẬN` | Mở chi tiết hỏi đáp, nhấn nút **[Tiếp nhận]**. Hồ sơ nhảy sang Tab **"Đang xử lý"**. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `TIẾP NHẬN` ➔ `ĐANG XỬ LÝ` | Nhấn nút **[Phân công]** — dropdown 2 entity tách (TVV/CG ở `TU_VAN_VIEN` + NHT ở `NGUOI_HO_TRO` mới theo SRS update 2026-05-05) hoặc CB NV khác. Chọn rồi lưu. |
| **4** | **Người được phân công** (TVV hoặc CB NV) | `ĐANG XỬ LÝ` ➔ `CHỜ PHÊ DUYỆT` | Đăng nhập Account được phân công. Nhập nội dung trả lời vào khung soạn thảo. **QUAN TRỌNG:** Phải tích vào checkbox **"Đã trả lời"** rồi nhấn Lưu. Hệ thống sẽ **TỰ ĐỘNG** chuyển thẳng sang trạng thái `CHỜ PHÊ DUYỆT` (không cần nút Trình duyệt). |
| **5** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | Log out người soạn. **Đăng nhập CB PD**. Vào Tab "Chờ phê duyệt", mở hồ sơ và nhấn nút **[Phê duyệt]**. Hồ sơ nhảy sang Tab **"Đã duyệt"**. |
| **6** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ DUYỆT` ➔ `CÔNG KHAI` / `HOÀN THÀNH` | Đăng nhập lại CB NV. Nhấn nút **[Công khai]** để đẩy câu trả lời lên Cổng PLQG, hoặc nhấn **[Đóng hồ sơ]** để chuyển thành `HOÀN THÀNH` (ẩn vào lịch sử). |

### Lưu ý quan trọng khi test flow rẽ nhánh (Từ chối / Bổ sung):
*   **Khi Cán bộ Phê duyệt chọn [Từ chối]:** Bắt buộc phải nhập Lý do (tối thiểu 10 ký tự). Trạng thái sẽ bị giật ngược lại `ĐANG XỬ LÝ` (đối với Hỏi đáp) hoặc `ĐANG XỬ LÝ` / `ĐANG THẨM ĐỊNH` (đối với Vụ việc, Chi trả) để CB NV sửa lại.
*   **Khi Cán bộ Nghiệp vụ chọn [Yêu cầu bổ sung] (với Vụ việc/Chi trả):** Hồ sơ sẽ trả về cho Doanh nghiệp bổ sung. Lưu ý là chỉ được yêu cầu bổ sung **tối đa 3 lần**, nếu lần thứ 3 vẫn không đạt, hệ thống tự động chuyển thành trạng thái `TỪ CHỐI` (đóng hồ sơ).

---

### 7. FLOW LUỒNG "TƯ VẤN PHÁP LUẬT CHUYÊN SÂU" (SM-TVCS) - Nhóm X.1 `[RENAMED 2026-05-06 v3.5 — Thay đổi 1]`
Luồng tư vấn 1-1 riêng biệt giữa DN và Chuyên gia giỏi. Luồng đồng bộ DN đẩy yêu cầu từ Cổng PLQG qua API Inbound **hiện chưa test được**. Tester dùng luồng thủ công ở Bước 1 — CB NV tự tạo form yêu cầu trên CMS.

**Phân loại BƯỚC 3:** Module phụ thuộc DN (Y) + TVV/CG (Y), optional VV link → giao dịch cốt lõi song song với Vụ việc/Hỏi đáp, KHÔNG phải hậu kỳ.

> **⚠️ CẬP NHẬT 2026-05-06 (apply SRS update srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md v3.5 — 13 thay đổi):**
> - **SM-TVCS giữ 7 state nhưng default đổi sang `TIEP_NHAN`** (Thay đổi 3) — thay 4 state cũ (CHO_XU_LY/DANG_XU_LY/DA_XU_LY/DONG). Enum: `TIEP_NHAN/PHAN_CONG/DANG_TU_VAN/HOAN_THANH/CHO_PHE_DUYET/DA_DUYET/HUY`.
> - **Entity rename:** `NOI_DUNG_TU_VAN_CS` → `TU_VAN_CHUYEN_SAU` (Thay đổi 2). Endpoint API rename `/api/v1/noi-dung-tu-van-cs` → `/api/v1/tu-van-chuyen-sau`.
> - **3 entity owned mới:** `HO_SO_PHAP_LY_DN` (3.4.3.46) / `TU_LIEU_PHAP_LY_VV` (3.4.3.47) / `DANH_GIA_CHAT_LUONG_TV` (3.4.3.48) — Thay đổi 5.
> - **Thêm field `don_vi_id` cơ quan tiếp nhận** (BR-ROUTE-TVCS-01 — Thay đổi 6): DN từ Cổng chọn / mặc định Sở TP tỉnh DN; CB NV nhập tay = đơn vị CB đăng nhập.
> - **5 trường công khai chuyên trang** (Thay đổi 7 + BR-PUBLIC-01/02/03): `cong_khai/anh_dai_dien/thoi_gian_dang_tai/mo_ta_cong_khai/file_dinh_kem_cong_khai` — chỉ enable khi `trang_thai=DA_DUYET`. Thêm Bước 6 mới: CB NV bật Công khai → push API Cổng PLQG.
> - **Bỏ field `hinh_thuc_tv` ở cấp Vụ việc TVCS** (Thay đổi 12) — đã move sang `PHIEN_TU_VAN.hinh_thuc` (Bước 3).
> - **Thêm field `hop_dong_tv_id`** link sang HOP_DONG_TV (Thay đổi 13) — TVCS DA_DUYET có thể link sang HĐ TV nhóm 14.
> - **NHT có 📝 RU* trên HSPL_DN** scoped theo VV được phân công (Thay đổi 10).
> - **BR-AUTH-01 đổi sang 2-tier** (Thay đổi 11): Tier 1 nội bộ + Tier 2 VNeID, **bỏ VNPT eKYC**.
> - Chi tiết delta: [`CHANGELOG-v3-to-v3.5.md §srs-fr-12`](../srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) line 1416-1604. Bảng workflow dưới (Bước 1-5) là **R6 cũ** — KHÔNG refactor lại trong session này, sẽ thêm Bước 6 (Công khai) khi test phase R7 chạm tới (xem [tasks/todo.md R7.4.A5](../../tasks/todo.md)).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công — thay cho "Cổng PLQG đẩy qua API Inbound")** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `TIEP_NHAN` | CB NV mở module Tư vấn pháp luật chuyên sâu → click **[+ Thêm mới]** trên `SCR-X1-02`. Nhập hộ DN: DN liên kết, **Cơ quan tiếp nhận `don_vi_id`** (`[NEW v3.5]` — default = đơn vị CB đăng nhập), chủ đề, nội dung vấn đề, mức độ ưu tiên. Lưu → bản ghi tạo với trạng thái `TIEP_NHAN`. **⚠️ FR-12 v3.5 Thay đổi 12:** field `hinh_thuc_tv` ĐÃ BỎ khỏi `TU_VAN_CHUYEN_SAU` — hình thức tư vấn (Video/Điện thoại/Hồ sơ) quản lý ở cấp `PHIEN_TU_VAN.hinh_thuc` khi CG bắt đầu phiên (Bước 3). |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `TIẾP NHẬN` ➔ `PHÂN CÔNG` | Mở chi tiết yêu cầu, chọn đích danh 1 Chuyên gia (CG) từ danh sách gợi ý và nhấn **[Phân công CG]**. |
| **3** | **Chuyên gia** (CG) | `PHÂN CÔNG` ➔ `ĐANG TƯ VẤN` | Log out CB NV. **Đăng nhập bằng Account Chuyên gia**. Mở yêu cầu, nhấn **[Chấp nhận]** và bắt đầu tư vấn (tạo phiên Video Call/Điện thoại/Hồ sơ). |
| **4** | **Chuyên gia** (CG) | `ĐANG TƯ VẤN` ➔ `HOÀN THÀNH` ➔ `CHỜ PHÊ DUYỆT` | Upload văn bản kết quả tư vấn và tích checkbox "Hoàn thành". Hệ thống **tự động (Auto-transition)** chuyển thẳng sang `CHỜ PHÊ DUYỆT` và báo cho CB PD. |
| **5** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | Log out CG. **Đăng nhập CB PD**. Mở hồ sơ, duyệt nội dung và nhấn **[Phê duyệt]**. Hệ thống tự động gửi kết quả cho Doanh nghiệp. |

---

### 8. FLOW LUỒNG "KHÓA ĐÀO TẠO, TẬP HUẤN" (SM-KHOAHOC) - Nhóm III

Module **Đào tạo, Tập huấn (Nhóm III)** theo SRS FR-III gồm **5 màn hình chính** (SCR-III-01..05), chia thành **4 sub-menu** trong tài liệu này. Chỉ Sub-menu 1 có SM-KHOAHOC với workflow phê duyệt + công khai + kết quả đầy đủ; 3 sub-menu còn lại chủ yếu là CRUD.

**Upstream context (theo SRS — KHÔNG nằm trong scope seed §8 này):**
- **FR-III-13 (UC32) — Đề xuất đào tạo** (entity `DE_XUAT_DAO_TAO`): DN/NHT gửi đề xuất từ Cổng PLQG → state `MOI` → CB NV tiếp nhận → `DA_TIEP_NHAN` → `DA_THUC_HIEN`.
- **FR-III-14..16 (UC33-35) — Kế hoạch đào tạo** (entity `KE_HOACH_DAO_TAO`, SM riêng): `NHAP` → `CHO_DUYET` → `DA_DUYET` → `DA_CONG_KHAI` (qua API Cổng PLQG, BR-FLOW-05). Đây là luồng chủ trương/ngân sách cấp trên CTĐT.
- Flow §8 bỏ qua 2 luồng upstream trên (chưa test integration Cổng PLQG), bắt đầu từ CB NV tạo CTĐT thủ công trên CMS.

---

### SUB-MENU 1: CHƯƠNG TRÌNH ĐÀO TẠO & KHÓA HỌC (SM-KHOAHOC)

> **⚠️ CẬP NHẬT 2026-05-05 (apply SRS update srs-update-2026-5-5/srs-fr-03-dao-tao.md):**
> - **SM-KHOAHOC 9 → 11 state** — thêm 2 state mới `TU_CHOI` + `TU_CHOI_KQ` (Cách 2 + refinement). Nhánh rẽ "bounce-back" cũ (line 267-274) KHÔNG còn đúng — KHOA_HOC giờ có state `TU_CHOI` riêng (giống SM-TVV).
> - **SM-CTDT mới hoàn toàn** — Entity `CHUONG_TRINH_DAO_TAO` không còn CRUD thường, có quy trình phê duyệt riêng `DU_THAO → CHO_DUYET → DA_DUYET` (giải quyết spec contradiction R6.4.B2/B2.5/B7).
> - **Mô hình A 3 cấp:** `KE_HOACH_DAO_TAO` (kế hoạch năm — entity mới) 1:N `CHUONG_TRINH_DAO_TAO` 1:N `KHOA_HOC`. Workflow seed phải theo thứ tự: KH năm → CTĐT (qua SM-CTDT mới) → KH (qua SM-KHOAHOC 11 state).
> - **Entity HOC_VIEN mới** — 1:1 với TAI_KHOAN qua `tai_khoan_id`. Khi seed học viên, tạo TK đồng thời.
> - **Điểm danh enum 3-value:** `CO_MAT/VANG_PHEP/VANG_KHONG_PHEP` (đổi từ boolean cũ).
> - **FR-III-19 Hướng B:** BỎ cấp chứng nhận PDF, chỉ công bố KQ vào TK học viên + chuyên trang.
> - **5 FR mới:** III-20 (Xuất docx ký số), III-21 (Phê duyệt khóa học), III-22 (Lịch học), III-NEW-01/02/03 (Đề kiểm tra).
> - Chi tiết delta: [`_DELTA-MAP-FR03.md`](../srs-update-2026-5-5/_DELTA-MAP-FR03.md). Bảng workflow dưới (Bước 1-10) là **R6 cũ** — KHÔNG refactor lại trong session này, sẽ update khi test phase R7 chạm tới.

**Entity chính:** `KHOA_HOC` (SRS §3.4.3.6) — **9 state** theo DB ENUM `KHOA_HOC.trang_thai`: `DU_THAO`, `CHO_DUYET`, `DA_DUYET`, `DA_CONG_KHAI`, `DANG_DIEN_RA`, `DA_KET_THUC`, `CHO_DUYET_KQ`, `HOAN_THANH`, `HUY`. **⚠️ R7:** thêm `TU_CHOI` + `TU_CHOI_KQ` = 11 state. Entity cha `CHUONG_TRINH_DAO_TAO` (CTĐT) là CRUD thường (không có workflow phê duyệt trên chính CTĐT — xem FR-III-01 §Processing). **⚠️ R7:** CTĐT có SM-CTDT mới với phê duyệt.

> **⚠️ Lưu ý mâu thuẫn nội bộ SRS:** `DA_CONG_KHAI` có trong DB ENUM (§3.4.3.6) và là guard cho FR-III-04 PRE-02 ("Khóa học đang mở đăng ký — trạng thái DA_CONG_KHAI"), nhưng bảng State Transition Table tại Phụ lục C.2 **bỏ sót** transition dẫn đến state này. Theo logic nghiệp vụ + schema (`la_cong_khai` flag), transition đúng: `DA_DUYET → DA_CONG_KHAI` do CB NV kích hoạt (xem Bước 4 bên dưới). Test plan cần ghi nhận mâu thuẫn này và xác nhận với BA.

#### Happy path: Khóa học từ tạo mới → cấp chứng nhận

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình | SRS ref |
| :--- | :--- | :--- | :--- | :--- |
| **1 (Thủ công — thay "DN gửi đề xuất từ Cổng PLQG")** | **Cán bộ Nghiệp vụ** (CB NV) | `(Tạo mới)` ➔ `DU_THAO` | Vào menu Đào tạo → sub-menu "Chương trình đào tạo" → click **[+ Thêm mới CTĐT]** trên `SCR-III-01` → nhập tên CTĐT cha, mục tiêu, lĩnh vực. Lưu. Sau đó mở chi tiết CTĐT → click **[+ Thêm khóa học]** (drill-down `SCR-III-02`) → nhập thời gian, hình thức (TRUC_TUYEN/TRUC_TIEP), giảng viên, địa điểm/link Zoom. Lưu → khóa học ở `DU_THAO`. | FR-III-01 (UC20) |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `DU_THAO` ➔ `CHO_DUYET` | CB NV nhấn **[Gửi phê duyệt]**. Guard: đủ thông tin bắt buộc. Action: TB CB PD. Áp dụng **Auto-transition AT-01** (hoàn thành nhập liệu → auto Chờ duyệt). | FR-III-01, AT-01, BR-AUTH-05 |
| **3** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHO_DUYET` ➔ `DA_DUYET` | Log out CB NV. **Đăng nhập CB PD**. Mở danh sách chờ duyệt → kiểm tra → nhấn **[Phê duyệt]**. Guard: cùng cấp. | FR-III-01 (workflow), BR-AUTH-05 |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | `DA_DUYET` ➔ `DA_CONG_KHAI` | **Đăng nhập lại CB NV**. Mở chi tiết khóa học → nhấn **[Công khai]**. Khóa học mở cho DN/NHT đăng ký (theo DB ENUM §3.4.3.6 + FR-III-04 PRE-02 — xem lưu ý mâu thuẫn SRS ở trên). | DB §3.4.3.6, FR-III-04 PRE-02 |
| **5 (Thủ công — thay "DN/NHT đăng ký từ Cổng PLQG")** | **Cán bộ Nghiệp vụ** (CB NV) | `(Tạo mới)` bản ghi `DANG_KY_DAO_TAO` ở `CHO_DUYET` (xem bảng SM-DANG-KY bên dưới) | Vào tab "Học viên" của khóa học (đang ở `DA_CONG_KHAI`) → click **[+ Thêm học viên thủ công]**. Nhập hộ DN/NHT: tên, đơn vị công tác, email, SĐT. | FR-III-03 (UC22), FR-III-04 (UC23) |
| **6** | **Hệ thống** hoặc **CB NV** | `DA_CONG_KHAI` ➔ `DANG_DIEN_RA` | Khi `ngay_bat_dau <= NOW()` (hệ thống tự chuyển), hoặc CB NV kích hoạt thủ công. | FR-III-01, Phụ lục C.2 |
| **7** | **Hệ thống** hoặc **CB NV** | `DANG_DIEN_RA` ➔ `DA_KET_THUC` | Auto khi hết thời gian, hoặc CB NV nhấn **[Kết thúc]** để đóng điểm danh. **Guard bổ sung:** tất cả học viên đã ghi nhận điểm danh HOẶC CB NV override thủ công với lý do. | FR-III-17 (UC36), Phụ lục C.2 |
| **8** | **Cán bộ Nghiệp vụ** (CB NV) | `DA_KET_THUC` ➔ `CHO_DUYET_KQ` | Vào tab "Kết quả": nhập điểm danh + điểm kiểm tra (thủ công hoặc Import Excel) → nhấn **[Trình duyệt KQ]**. Áp dụng **Auto-transition AT-02** (lưu kết quả cuối → auto Chờ duyệt KQ + TB CB PD). | FR-III-17, AT-02, BR-AUTH-05 |
| **9** | **Cán bộ Phê duyệt** (CB PD) | `CHO_DUYET_KQ` ➔ `HOAN_THANH` | Log out CB NV. **Đăng nhập CB PD**. Nhấn **[Phê duyệt]** kết quả khóa học. Guard: cùng cấp. | FR-III-18 (UC37), BR-AUTH-05 |
| **10 (Action — không phải state mới)** | **Cán bộ Nghiệp vụ** (CB NV) | Giữ `HOAN_THANH` (KHOA_HOC); sinh bản ghi mới entity `CHUNG_NHAN` | **Đăng nhập lại CB NV**. Vào tab "Chứng nhận", chọn các học viên có kết quả ĐẠT → nhấn **[Công bố / Cấp chứng nhận]** → hệ thống sinh số CN (`CN-{YYYY}-{SEQ}`), tạo bản ghi `CHUNG_NHAN` + sinh file PDF. | FR-III-19 (UC38) |

#### Nhánh rẽ: Từ chối (bounce-back — KHOA_HOC không có state `TU_CHOI` riêng)

| Từ state | Đến state | Trigger | Guard | Action | SRS ref |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `CHO_DUYET` | `DU_THAO` | CB PD từ chối phê duyệt khóa học | Có lý do | TB CB NV sửa và trình lại | Phụ lục C.2, BR-FLOW-04 |
| `CHO_DUYET_KQ` | `DA_KET_THUC` | CB PD từ chối kết quả | Có lý do | TB CB NV sửa lại | FR-III-17, Phụ lục C.2, BR-FLOW-04 |

> Phụ lục C.2 xác nhận KHOA_HOC **không có state `TU_CHOI` lưu DB** — từ chối = bounce-back về state trước đó (khác SM-TVV có state `TU_CHOI` riêng).

#### Nhánh rẽ: Hủy (HUY)

| Từ state | Đến state | Trigger | Guard | Action | SRS ref |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `DU_THAO` | `HUY` | CB NV hủy | Không có đăng ký | Soft delete | FR-III-01, BR-DATA-01 |
| `CHO_DUYET` | `HUY` | CB NV rút trình | CB NV là người tạo ban đầu | Ghi audit | Phụ lục C.2 |
| `DA_DUYET` | `HUY` | CB PD hủy | Chưa có đăng ký | Ghi audit | Phụ lục C.2 |

**Cascade khi chuyển `HUY`** (Phụ lục C.2 — "Lưu ý DA_HUY"): TB tất cả học viên `DA_DUYET` qua email + in-app; cập nhật `DANG_KY_DAO_TAO.trang_thai = 'DA_HUY'`; giải phóng tài nguyên.

#### State Machine entity con `DANG_KY_DAO_TAO` (SM độc lập, lồng cha-con vào SM-KHOAHOC)

Entity `DANG_KY_DAO_TAO` (SRS §3.4.3.26) có vòng đời **độc lập** với **4 state**: `CHO_DUYET`, `DA_DUYET`, `TU_CHOI`, `DA_HUY`.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác | SRS ref |
| :--- | :--- | :--- | :--- | :--- |
| **A1 (Thủ công — thay "DN/NHT đăng ký qua Cổng")** | **Cán bộ Nghiệp vụ** (CB NV) | `(Tạo mới)` ➔ `CHO_DUYET` | Vào tab "Học viên" của khóa học đang ở `DA_CONG_KHAI` → **[+ Thêm học viên]** → nhập tên, đơn vị, email, SĐT. | FR-III-03, FR-III-04 PRE-02 |
| **A2** | **Cán bộ Nghiệp vụ** (CB NV) | `CHO_DUYET` ➔ `DA_DUYET` | Tab "Học viên" → tích các đăng ký hợp lệ → nhấn **[Duyệt]**. Action: cập nhật trạng thái, ghi nhật ký, TB người đăng ký. | FR-III-03 (Processing B4) |
| **A3 (rẽ nhánh)** | **Cán bộ Nghiệp vụ** (CB NV) | `CHO_DUYET` ➔ `TU_CHOI` | Tích đăng ký không hợp lệ → nhấn **[Từ chối]** + nhập lý do. Guard: lý do bắt buộc (ERR-DKDT-02). | FR-III-03 (Processing B5), BR-FLOW-04 |
| **A4 (cascade từ SM-KHOAHOC)** | **Hệ thống** | `CHO_DUYET` / `DA_DUYET` ➔ `DA_HUY` | Tự động khi `KHOA_HOC` chuyển `HUY`. | Phụ lục C.2 (Lưu ý DA_HUY) |

> **Dependency Parent-Child:** trạng thái `KHOA_HOC` điều khiển luồng đăng ký — KH phải ở `DA_CONG_KHAI` mới cho phép tạo đăng ký mới (FR-III-04 PRE-02); KH `HUY` → đăng ký con tự `DA_HUY` (Phụ lục C.2).

---

### SUB-MENU 2: KHO TÀI LIỆU / BÀI GIẢNG
Luồng đơn giản — **không yêu cầu phê duyệt**. CB NV tự upload và tự chịu trách nhiệm khi quyết định công khai.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `KÍCH HOẠT` | Vào thêm mới Bài giảng. Nhập tên, mô tả. Tải lên file (Slide/PDF max 20MB) hoặc dán link Youtube (Video). |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `KÍCH HOẠT` (cờ Công khai = 0 ➔ 1) | Gạt toggle/nút **[Công khai]**. Bài giảng lập tức hiển thị trên chuyên trang đào tạo của Cổng PLQG để người dùng tra cứu. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `KÍCH HOẠT` ➔ `VÔ HIỆU HÓA` | Nếu bài giảng bị lỗi thời, CB NV nhấn vô hiệu hóa (hoặc xóa mềm) để ẩn hoàn toàn khỏi hệ thống. |

---

### SUB-MENU 3: NGÂN HÀNG CÂU HỎI & ĐỀ KIỂM TRA
Gồm 2 luồng nối tiếp: Tạo câu hỏi vào kho chung ➔ Bốc câu hỏi ra để tạo Đề kiểm tra. **Không có phê duyệt.**

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `KÍCH HOẠT` (Câu hỏi) | Tại tab Ngân hàng câu hỏi: Nhập lẻ từng câu hoặc Import hàng loạt câu trắc nghiệm/tự luận, gán mức độ (Dễ/Trung bình/Khó) và đáp án đúng. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `DỰ THẢO` (Đề kiểm tra) | Chuyển sang tab Đề kiểm tra, tạo Đề mới. Chọn bốc câu hỏi "Ngẫu nhiên" (nhập số lượng để hệ thống tự trộn) hoặc chọn "Thủ công" từng câu từ ngân hàng. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `DỰ THẢO` ➔ `ĐÃ PHÂN PHỐI` | Chọn một Đề kiểm tra hoàn chỉnh, nhấn **[Phân phối]** và chọn gán Đề này vào một Khóa học cụ thể (từ Sub-menu 1). |
| **4** | **Học viên / Hệ thống**| `ĐÃ PHÂN PHỐI` ➔ `HOÀN THÀNH` | Học viên làm bài, hoặc CB NV tự kết thúc đề thi. |

---

### SUB-MENU 4: GIẢNG VIÊN / TRỢ GIẢNG
Quản lý hồ sơ giảng viên đứng lớp. Luồng CRUD (Thêm/Sửa/Xóa) trực tiếp, **không có phê duyệt**.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `ĐANG HOẠT ĐỘNG` | Nhấn [+ Thêm mới]. Nhập tên giảng viên/trợ giảng, chuyên ngành, tổ chức công tác. Mặc định trạng thái là Đang hoạt động. |
| **2** | **Hệ thống** (Tự động)| Giữ nguyên | Khi CB NV tạo Khóa học ở Sub-menu 1 và map Giảng viên này vào, hệ thống tự động ghi nhận vào tab "Lịch sử giảng dạy" của Giảng viên đó. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG HOẠT ĐỘNG` ➔ `TẠM DỪNG` | Nếu giảng viên nghỉ phép/tạm ngưng cộng tác, CB NV chỉnh sửa trạng thái thành Tạm dừng để không hiện lên trong danh sách gợi ý phân công khóa học mới. |

---

## [BƯỚC 4 — HẬU KỲ & LIÊN KẾT]

### 9. FLOW LUỒNG "HỢP ĐỒNG TƯ VẤN" (FR-X.3-01) - Nhóm X.3
Module CRUD thuần — KHÔNG có state machine, KHÔNG có phê duyệt. Trạng thái enum 4 giá trị `DANG_THUC_HIEN / HOAN_THANH / HUY / TAM_DUNG` (mặc định `DANG_THUC_HIEN`, theo SRS §3.4.3.13 + srs-fr-14 Mục 5) chỉ là status field để lọc. 1 HĐ có thể liên kết nhiều Vụ việc (N:N). **Phụ thuộc:** TVV (§2 BƯỚC 2) đã `ĐANG HOẠT ĐỘNG` và Vụ việc (§5 BƯỚC 3) đã hoàn thành. **Seed preset:** P2 (TVV) + P1 bước 4 (VV `HOÀN THÀNH`) — xem [Phụ lục 2](#phụ-lục-2-seed-data-presets--happy-path-e2e).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) — cấp TW/BN/ĐP | (Tạo mới) → `DANG_THUC_HIEN` (default theo §3.4.3.13) | Truy cập Quản lý HĐ Tư vấn (`SCR-X3-01`), click nút **[+ Thêm hợp đồng]**. Hệ thống auto-gen Mã HĐ (`HDTV-{YYYYMMDD}-{SEQ}`) và mở form Accordion. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | Đang ở `DANG_THUC_HIEN` | Mở Accordion *Thông tin chung*: Nhập Tên HĐ (bắt buộc), Chọn Bên B (Dropdown TVV/Tổ chức), Nhập Giá trị HĐ, Thời hạn bắt đầu / kết thúc (bắt buộc, end ≥ start). Bên A auto theo đơn vị user. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | Đang ở `DANG_THUC_HIEN` | Mở Accordion *Vụ việc liên kết*: Click **[+ Liên kết VV]** → modal multi-select các Vụ việc đã hoàn thành. Mỗi VV có thể bỏ liên kết. |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | Đang ở `DANG_THUC_HIEN` | Mở Accordion *Mốc tiến độ* + *Thanh toán giai đoạn*: Inline-edit nhập các giai đoạn TT. Hệ thống validate Tổng số tiền giai đoạn `<=` Giá trị HĐ (nếu vượt → `ERR-HDTV-03`). |
| **5** | **Cán bộ Nghiệp vụ** (CB NV) | Giữ `DANG_THUC_HIEN` | Nhấn nút **[Lưu]**. Hệ thống lưu HĐ + mốc tiến độ + mapping N:N với Vụ việc + Audit Log. |
| *(Phụ)* | CB NV | `DANG_THUC_HIEN` → `TAM_DUNG` / `HOAN_THANH` / `HUY` | CB NV manual toggle hoặc edit field `trang_thai` qua nút [Tạm dừng] / [Đóng HĐ] / [Hủy HĐ]. Lưu ý: không có nút [Kích hoạt] / [Công bố] như các module có SM. |

---

### 10. FLOW LUỒNG "CHI TRẢ CHI PHÍ TƯ VẤN" (SM-CHITRA) - Nhóm V.II
Luồng thanh toán tiền cho TVV và DN sau khi hoàn thành Vụ việc. **Update 2026-05-06 (FR-06 v3.5):** 10 trạng thái + 14 transition + 14 FR (thêm FR-V.II-14 DN bổ sung qua DVC). Cite: [`srs-update-2026-5-5/srs-fr-06-chi-tra.md`](../srs-update-2026-5-5/srs-fr-06-chi-tra.md).

> **🚫 KHÔNG CÓ LUỒNG THỦ CÔNG — Module DUY NHẤT chặn CB NV nhập tay**
> - Hồ sơ chi trả **BẮT BUỘC** phải đổ về từ Cổng DVC qua trục LGSP. CB NV không có nút [+ Thêm mới] trên SCR chi trả.
> - **Hệ quả test:** Module này **chưa test được End-to-End** cho đến khi có integration DVC/LGSP. Tester chỉ có thể test các bước tiếp theo (kiểm tra / thẩm định / phê duyệt) NẾU backend có seed data hoặc test API inject hồ sơ ở trạng thái `CHỜ TIẾP NHẬN`.
> - **Negative test bắt buộc:** verify CB NV **KHÔNG thấy** nút "Thêm mới" trên `SCR-V.II-01`. Nếu thấy = BUG (vi phạm spec).
> - **Seed preset:** P3 (Chi trả E2E) — **đang BLOCKED** do chưa có integration LGSP/DVC. Khi BE có test API inject hoặc seed bản ghi ở `CHỜ TIẾP NHẬN`, preset P3 trong [Phụ lục 2](#phụ-lục-2-seed-data-presets--happy-path-e2e) cover bước 2 trở đi.

> **🆕 v3.5 changes:** **CB PD "Từ chối" = trả về `Đang thẩm định`** (KHÔNG phải Từ chối cuối, lý do ≥10 ký tự, BR-FLOW-04). **+1 FR mới FR-V.II-14**: DN bổ sung HS qua DVC/Cổng PLQG hoặc CB NV thủ công. **+2 entity owned mới** (`THAM_DINH_HO_SO` 1:1 + `PHE_DUYET_CHI_TRA` N:1, lưu nhiều lần CB PD trả về). **+ sub-flow DN rút hồ sơ** (`Chờ tiếp nhận` → `Hủy`, `[GAP-V.II-03]`). **BA OUT:** auto-từ-chối quá hạn / lần 4 bổ sung (Thay đổi 5) + SLA dynamic (Thay đổi 8 — giữ V3 "4 mức cảnh báo C07"). 2 vấn đề chờ BA confirm — xem [`ba-questions-fr06-2026-05-06.md`](../../output/qa-reports/round7-2026-05-06/bug-reports/ba-questions-fr06-2026-05-06.md).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1** | **Doanh nghiệp** / **Hệ thống DVC** | Không có ➔ `CHỜ TIẾP NHẬN` | DN nộp Mẫu 01 NĐ55 kèm chứng từ hóa đơn qua Cổng Dịch vụ công (DVC). FR-V.II-01 inbound qua LGSP với JWT + mTLS (BR-AUTH-09). Auto-gen mã `CT-{YYYYMMDD}-{SEQ}` (BR-DATA-04). **UNIQUE `ma_ho_so_dvc`** (idempotent — ERR-CT-02 HTTP 409 nếu trùng). *(Hiện chặn test do chưa có integration DVC)* |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `CHỜ TIẾP NHẬN` ➔ `ĐANG KIỂM TRA` | FR-V.II-02 sub-flow Tiếp nhận `[GAP-V.II-02]`. Đăng nhập CB NV, mở hồ sơ và nhấn **[Tiếp nhận]**. Hệ thống ghi `ngay_tiep_nhan = NOW()`, `nguoi_tiep_nhan_id = current_user.id`. |
| **2-rút** *(phụ)* | **Doanh nghiệp** (qua DVC) hoặc **CB NV hủy hộ** | `CHỜ TIẾP NHẬN` ➔ `HỦY` | FR-V.II-02 sub-flow DN rút `[GAP-V.II-03]`. Chỉ rút được khi chưa qua `Đang đánh giá`. Hệ thống ghi `ly_do_huy = 'DN_RUT_HO_SO'`, gửi TB CB NV nếu đã gán. ERR-CT-RUT-01 nếu cố rút sau khi đã chuyển `Đang kiểm tra`. |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG KIỂM TRA` ➔ `ĐANG ĐÁNH GIÁ` | FR-V.II-03. Kiểm tra checklist 18 trường trên Mẫu 01 hợp lệ. Nhấn Xác nhận kết quả "Đạt". |
| **3-bổ-sung** *(phụ)* | CB NV → DN | `ĐANG KIỂM TRA` ➔ `YÊU CẦU BỔ SUNG` ⇄ `ĐANG KIỂM TRA` | FR-V.II-03 (CB NV bấm "Yêu cầu bổ sung", `bo_sung_count++`, `ngay_yeu_cau_bo_sung = NOW()`). FR-V.II-14 (DN bổ sung qua DVC/Cổng PLQG hoặc CB NV thủ công, ≤5 ngày LV; file PDF/DOC/DOCX/JPG/PNG ≤10MB; ERR-CT-BS-01/02/03). Tối đa 3 lần (`bo_sung_count` CHECK 0-3). **Hành vi lần 4 chờ BA confirm Q1** (auto-từ-chối đã bị OUT — Thay đổi 5). |
| **3-từ-chối** *(phụ)* | CB NV | `ĐANG KIỂM TRA` ➔ `TỪ CHỐI` | FR-V.II-03. Kiểm tra "Không đạt" → ghi `ly_do_tu_choi`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id`. |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG ĐÁNH GIÁ` ➔ `ĐANG THẨM ĐỊNH` | FR-V.II-05. Hệ thống tự động tính mức hỗ trợ (100% / 30% / 10%) và trần năm theo quy mô DN (BR-CALC-01/02). CB NV xem và nhấn **[Xác nhận đánh giá]**. |
| **5** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐANG THẨM ĐỊNH` ➔ `CHỜ PHÊ DUYỆT` | FR-V.II-09 + FR-V.II-11. Đối chiếu 4 mục checklist (số liệu / phí TV / quy mô / trần năm), chốt KQ thẩm định "Đạt" → tạo `THAM_DINH_HO_SO` (1:1 với HSCT). Nhấn **[Trình phê duyệt]** — TB CB PD cùng cấp (BR-AUTH-05). |
| **5-từ-chối** *(phụ)* | CB NV | `ĐANG THẨM ĐỊNH` ➔ `TỪ CHỐI` | FR-V.II-09. Thẩm định "Không đạt" + nhận xét → ghi `ly_do_tu_choi = "THAM_DINH: " + nhan_xet`. |
| **6** | **Cán bộ Phê duyệt** (CB PD cùng cấp) | `CHỜ PHÊ DUYỆT` ➔ `ĐÃ DUYỆT` | FR-V.II-12. Log out CB NV. **Đăng nhập CB PD**. Xem xét hồ sơ và nhấn **[Phê duyệt]**, chốt số tiền được duyệt thực chi. Tạo bản ghi `PHE_DUYET_CHI_TRA quyet_dinh=DUYET`. TB CB NV + TVV + DN. |
| **6-trả-về** *(phụ)* | CB PD | `CHỜ PHÊ DUYỆT` ➔ `ĐANG THẨM ĐỊNH` | **CB PD "Từ chối" = trả về CB NV điều chỉnh (KHÔNG phải Từ chối cuối)**. Modal nhập lý do ≥10 ký tự (BR-FLOW-04). Tạo bản ghi `PHE_DUYET_CHI_TRA quyet_dinh=TU_CHOI`. TB CB NV (KHÔNG TB TVV/DN). CB NV điều chỉnh xong có thể Trình PD lại — N:1 cho phép nhiều bản ghi lịch sử. |
| **7** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ DUYỆT` ➔ `ĐÃ THANH TOÁN` | FR-V.II-13. Log out CB PD. **Đăng nhập lại CB NV**. Khi Kho bạc chuyển tiền xong, nhập Số tiền thực trả (≤ `so_tien_duoc_duyet`) + Ngày thanh toán + Mã biên nhận rồi nhấn **[Cập nhật thanh toán]**. |
| **7-từ-chối** *(phụ)* | CB NV | `ĐÃ DUYỆT` ➔ `TỪ CHỐI` | FR-V.II-13. Nếu Kho bạc không chuyển → ghi `ly_do_tu_choi = "THANH_TOAN: " + ly_do`. |

---

### 11. FLOW LUỒNG "THEO DÕI ĐÁNH GIÁ HIỆU QUẢ HỖ TRỢ PHÁP LÝ" (SM-DANHGIA) - Nhóm VI
Luồng lập báo cáo 21a/21b theo TT17 định kỳ 6 tháng / 1 năm. **Phụ thuộc:** Vụ việc (§5 BƯỚC 3) đã hoàn thành trong kỳ. **Seed preset:** P4 (Đánh giá HQ đủ mẫu — chạy P2 ×3 để có ≥3 VV `HOAN_THANH`) — xem [Phụ lục 2](#phụ-lục-2-seed-data-presets--happy-path-e2e).

> **⚠️ Update 2026-05-06 (FR-08 v3.5):** Module rename "Kế hoạch đánh giá" → "Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý". Entity rename `DOT_DANH_GIA / DANH_GIA_HQ` → `KE_HOACH_DANH_GIA`. SM thống nhất 8 state v3.5 (Thay đổi 5, GAP-VI-01) — bỏ double-state `NHAP/LAP_KE_HOACH` cũ, **DB enum = SM state = `LAP_KE_HOACH`**. Bổ sung `co_quan_duoc_danh_gia_id` 1:1 (Thay đổi 2) + `file_dinh_kem` (Thay đổi 4) + FR-VI-10 read-only cho CB NV cơ quan được ĐG (Thay đổi 3) + state `HUY` (transition `LAP_KE_HOACH/PHAN_CONG/THUC_HIEN/BAO_CAO → HUY`). Cite: `srs-update-2026-5-5/srs-fr-08-danh-gia.md` §5 line 1117-1167.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) ➔ `LAP_KE_HOACH` | Vào module **Theo dõi Đánh giá Hiệu quả HTPL** → click **[+ Tạo đợt đánh giá]** trên `SCR-VI-01`. Nhập tên đợt, mục tiêu, tần suất (SO_BO_6_THANG/TRON_NAM), từ ngày/đến ngày, đối tượng (VU_VIEC/DAO_TAO/TONG_HOP), **chọn `co_quan_duoc_danh_gia_id`** (DON_VI 1:1, BẮT BUỘC, có thể khác đơn vị CB NV), upload `file_dinh_kem` (PDF/DOC/DOCX/XLS/XLSX ≤20MB, optional). Lưu nháp ➔ DB `LAP_KE_HOACH`. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | `LAP_KE_HOACH` ➔ `PHAN_CONG` | Vào Tab 1 Tiêu chí — thêm tiêu chí, set trọng số (SUM = 100% BR-CALC-04). Sang Tab 2 Phân công, chọn cán bộ/chuyên gia làm Đánh giá viên (≥1 TRUONG_NHOM, ≥1 DANH_GIA_VIEN). |
| **3** | **Cán bộ Nghiệp vụ** (CB NV) | `PHAN_CONG` ➔ `CHO_DUYET_PC` | Nhấn **[Trình phê duyệt]** để gửi danh sách phân công. **BR-NOTIF-01** gửi TB CB PD (mở rộng FR-VI-03 v3.5). |
| **4** | **Cán bộ Phê duyệt** (CB PD) | `CHO_DUYET_PC` ➔ `THUC_HIEN` | **Đăng nhập CB PD** cùng cấp (BR-AUTH-05) → **[Phê duyệt PC]**. Hệ thống auto-fill người duyệt, thời gian. **BR-NOTIF-01** gửi TB CB NV trình (mở rộng FR-VI-04 v3.5). Hoặc **[Từ chối PC]** + lý do ≥10 ký tự (BR-FLOW-04) → quay `PHAN_CONG`. |
| **5** | **CB NV / Đánh giá viên** | `THUC_HIEN` ➔ `BAO_CAO` | Sang Tab 3 Thực hiện chấm điểm — chọn VV HOAN_THANH trong kỳ (multi-select), chấm điểm 0-`diem_toi_da` cho từng tiêu chí. Khi tất cả VV đã chấm xong, hệ thống auto SET `BAO_CAO`. |
| **6 (Phụ)** | **Cán bộ Nghiệp vụ** (CB NV) | Giữ `BAO_CAO` (lập BC) | Sang Tab 4 Báo cáo — xem auto-fill 13 cột số liệu (số TVV, khóa tập huấn, hội nghị, VV, hồ sơ chi trả, KP). Bổ sung nhận xét chung, kiến nghị, KP hoạt động khác / xã hội hóa. Lưu BC. |
| **7** | **Cán bộ Nghiệp vụ** (CB NV) | `BAO_CAO` ➔ `CHO_PHE_DUYET` | Nhấn **[Trình duyệt BC]**. **BR-NOTIF-01** gửi TB CB PD (mở rộng FR-VI-08 v3.5). |
| **8** | **Cán bộ Phê duyệt** (CB PD) | `CHO_PHE_DUYET` ➔ `HOAN_THANH` | **Đăng nhập CB PD**. Nhấn **[Phê duyệt BC]** để chốt báo cáo cuối cùng. **BR-NOTIF-01** gửi TB CB NV trình (FR-VI-09 v3 + v3.5). Hoặc **[Từ chối BC]** + lý do ≥10 ký tự → quay `BAO_CAO`. |
| **9 (Read-only)** | **CB NV thuộc `co_quan_duoc_danh_gia_id`** (FR-VI-10 mới) | Giữ `HOAN_THANH` | Sau khi đợt `HOAN_THANH`, CB NV thuộc cơ quan được ĐG mở SCR-VI-01 Tab Báo cáo (chế độ read-only) để xem KQ. CB NV cơ quan KHÁC bị 403 (`ERR-DG-10`). KH chưa `HOAN_THANH` → ERR-DG-11. |
| *(Phụ — HUY)* | **CB NV / CB PD** | `LAP_KE_HOACH/PHAN_CONG/THUC_HIEN/BAO_CAO` ➔ `HUY` | Khi đợt phát sinh sự cố không thể tiếp tục — nhập lý do hủy, soft-delete. Audit log ghi nhận. KHÔNG hủy được khi đã `HOAN_THANH`. |

---

### 12. FLOW LUỒNG "TƯ VẤN NHANH" (SM-TVNHANH) + KHO Q&A - Nhóm X.2
Module có 2 phần: (A) **Phiên tư vấn** — DN-driven realtime (không thêm tay được), và (B) **Kho câu hỏi** — CB NV nhập thủ công Q&A, có phê duyệt.

#### 12.A — Phiên tư vấn (SM-TVNHANH)

> **🚫 KHÔNG CÓ LUỒNG THỦ CÔNG** — Phiên tư vấn do DN chủ động khởi tạo từ khung chat trên Cổng PLQG, CB NV chỉ tham gia ở Bước 4 khi DN không hài lòng với gợi ý. Luồng đồng bộ DN ↔ Cổng **chưa test được do chưa có integration với chuyên trang DN**.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1** | **Doanh nghiệp / Cổng** | Không có ➔ `MỚI` | Doanh nghiệp nhập câu hỏi trên khung chat Tư vấn nhanh của chuyên trang Cổng PLQG. *(Chặn test do chưa có integration chuyên trang)* |
| **2** | **Hệ thống** (Tự động) | `MỚI` ➔ `ĐANG TÌM KIẾM` | Hệ thống tự động chạy full-text search (tìm kiếm toàn văn) các từ khóa trong Kho câu hỏi. |
| **3** | **Hệ thống** (Tự động) | `ĐANG TÌM KIẾM` ➔ `ĐÃ GỢI Ý` | Hệ thống lọc ra TOP 5 câu trả lời phù hợp nhất và hiển thị lên màn hình cho Doanh nghiệp xem. |
| **4** | **Cán bộ Nghiệp vụ** (CB NV) | `ĐÃ GỢI Ý` ➔ `CB TRẢ LỜI` | Nếu DN xem gợi ý mà không hài lòng, CB NV sẽ nhận được thông báo. **Đăng nhập CB NV**, mở khung chat, chọn 1 gợi ý để chỉnh sửa hoặc tự soạn câu trả lời mới và nhấn Gửi. |
| **5** | **Doanh nghiệp** | `CB TRẢ LỜI` ➔ `HOÀN THÀNH` | Doanh nghiệp xem câu trả lời của CB NV, thực hiện đánh giá sao (1-5 điểm) và kết thúc phiên. *(Lưu ý: Nếu quá 30 ngày DN không tương tác, hệ thống tự chuyển sang trạng thái `HẾT HẠN`)*. |

#### 12.B — Kho câu hỏi (SCR-X2-01)
CB NV nhập thủ công Q&A vào kho dùng chung. Khác với nguồn `TU_DONG` đẩy từ Hỏi đáp (§6 BƯỚC 3) — TU_DONG bỏ qua bước chờ duyệt, auto gán `DA_DUYET`. Không có trạng thái `CONG_KHAI` — việc hiển thị lên Cổng PLQG dùng field `hieu_luc = 1`.

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **Cán bộ Nghiệp vụ** (CB NV) | (Tạo mới) → `CHO_DUYET`, nguồn=`THU_CONG` | Truy cập Kho câu hỏi (`SCR-X2-01`), click nút **[+ Thêm câu hỏi]** để mở Modal lớn. |
| **2** | **Cán bộ Nghiệp vụ** (CB NV) | Đang ở `CHO_DUYET` | Nhập field bắt buộc: *Câu hỏi* (textarea), *Câu trả lời* (Rich Text Editor), chọn *Lĩnh vực* (dropdown), nhập *Từ khóa* (tags). Nhấn **[Gửi duyệt]**. Hệ thống gán `nguon = THU_CONG`, `trang_thai = CHO_DUYET`. |
| **3** | **Cán bộ Phê duyệt** (CB PD) | `CHO_DUYET` → `DA_DUYET` | CB PD mở Tab "Chờ duyệt" trên `SCR-X2-01`. Nhấn **[Duyệt]** (duyệt đơn lẻ inline) hoặc **[Duyệt hàng loạt]** nếu chọn nhiều checkbox. |
| **4** | **Hệ thống** | (Cập nhật lúc duyệt) | Trạng thái → `DA_DUYET` + auto bật toggle `hieu_luc = 1` (hiện lên Cổng PLQG) + cập nhật chỉ mục Full-text Search (tsvector). Gửi TB cho CB NV đã nhập. |
| *(Phụ)* | CB NV | — | Toggle `hieu_luc = 0` để ẩn khỏi Cổng (không xóa bản ghi). |

---

## [BƯỚC 5 — DỮ LIỆU ĐẦU RA & BÁO CÁO]

Gộp: CT HTPLDN (tổng hợp data cấp hành chính) + Báo cáo thống kê 23 loại (FR-IX) + Dashboard (FR-I). Toàn bộ **read-only aggregate** từ upstream — chạy được khi các module BƯỚC 2/3/4 đã có data trong kỳ.

### 13. FLOW LUỒNG "CHƯƠNG TRÌNH HTPLDN — GIAI ĐOẠN 2: ĐỢT BÁO CÁO" (SM-DOT-BC) - Nhóm XI
Nối tiếp §4 BƯỚC 2 (Giai đoạn 1: Kế hoạch). **Phụ thuộc:** CT đã ở `ĐANG THỰC HIỆN` **và** có số liệu Vụ việc/Chi trả/Đào tạo trong kỳ. **Seed preset:** P1 (có Chi trả `DA_THANH_TOAN`) + P3 (thêm Chi trả) + §8 (khoá học `HOÀN THÀNH`) — xem [Phụ lục 2](#phụ-lục-2-seed-data-presets--happy-path-e2e).
| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1 (Thủ công)** | **CB NV (Cấp BN / ĐP)** | (Tạo mới) ➔ `TẠO ĐỢT` | Mở tab Đợt báo cáo trong chi tiết Chương trình, nhấn **[Tạo đợt mới]** (Sơ bộ 6 tháng / Sơ bộ năm / Tròn năm). |
| **2** | **CB NV (Cấp BN / ĐP)** | `TẠO ĐỢT` ➔ `ĐANG LẬP BC` | Nhấn vào đợt vừa tạo, điền số liệu vào form Mẫu 21a/21b theo TT17/2025. |
| **3** | **CB NV (Cấp BN / ĐP)** | `ĐANG LẬP BC` ➔ `CHỜ DUYỆT KQ` | Nhấn nút **[Trình duyệt KQ]** để gửi số liệu lên lãnh đạo đơn vị mình. |
| **4** | **CB PD (Cấp BN / ĐP)** | `CHỜ DUYỆT KQ` ➔ `ĐÃ DUYỆT KQ` | Log out CB NV. **Đăng nhập CB PD**. Nhấn **[Phê duyệt]** để chốt số liệu báo cáo của đơn vị. |
| **5** | **CB NV (Cấp BN / ĐP)** | `ĐÃ DUYỆT KQ` ➔ `ĐÃ GỬI TW` | Log out CB PD. **Đăng nhập lại CB NV**. Nhấn nút **[Gửi lên TW]** để đẩy báo cáo lên Cục BLDS&KT tổng hợp. |
| **6** | **CB NV (Cấp Trung ương)** | `ĐÃ GỬI TW` ➔ `ĐÃ TỔNG HỢP` | Log out CB ĐP/BN. **Đăng nhập Account CB NV Trung ương**. Mở màn hình tổng hợp, tick chọn các báo cáo do địa phương gửi lên và nhấn **[Tổng hợp]** để ra báo cáo toàn quốc. |

---

### 14. FLOW LUỒNG "BÁO CÁO THỐNG KÊ" (FR-IX-01..23) — Nhóm IX
Module có **23 loại BC** đọc dữ liệu từ các module khác, entity owned `BAO_CAO` chỉ lưu metadata (ai chạy, kỳ nào, kết quả). State machine đơn giản 3 state, **không có phê duyệt**. Phụ thuộc: data của module upstream đã seed (VV, Hỏi đáp, Khóa học, Chi trả, CT HTPLDN).

| Bước | Account thao tác | Trạng thái chuyển | Thao tác thực hiện trên màn hình |
| :--- | :--- | :--- | :--- |
| **1** | **Cán bộ Nghiệp vụ** (CB NV) — cấp TW/BN/ĐP | (Tạo mới) ➔ `DANG_TAO` | Vào menu Báo cáo → chọn 1 trong 23 loại BC → mở form filter (kỳ, đơn vị, lĩnh vực, ...) → nhập params → nhấn **[Chạy báo cáo]**. |
| **2** | **Hệ thống** (Tự động) | `DANG_TAO` ➔ `HOAN_THANH` hoặc `LOI` | Hệ thống query data upstream theo công thức FR + dimensions. Success → `HOAN_THANH` hiển thị bảng + biểu đồ. Fail (timeout, lỗi query) → `LOI`. |
| **3** | **CB NV** (tùy chọn) | Giữ `HOAN_THANH` | Xuất Excel / Word bản báo cáo. Bản ghi `BAO_CAO` lưu metadata để re-download sau. |

**3 loại BC đại diện seed (xem `seed-fixture.yaml > bao_cao_variants`):**
- FR-IX-01 BC Hỏi đáp (đọc `HOI_DAP`)
- FR-IX-04 BC Vụ việc hoàn thành (đọc `VU_VIEC` state `HOAN_THANH`)
- FR-IX-15 BC Chi phí chi trả (đọc `HO_SO_CHI_TRA` — **sẽ rỗng do §10 BLOCKED**, test empty edge case)

---

### 15. DASHBOARD (FR-I-01..09) — Nhóm I
**Display only.** Không có entity owned, không CRUD, không cần seed. Dashboard chỉ **aggregate đọc** từ 7 entity: `HOI_DAP`, `VU_VIEC`, `KHOA_HOC`, `TU_VAN_VIEN`, `KET_QUA_DANH_GIA`, `KET_QUA_DAO_TAO`, `HO_SO_CHI_TRA`.

**Test approach:** Sau khi seed xong các module upstream → mở Dashboard → verify 9 KPI hiện đúng con số theo công thức FR. Xem [`seed-fixture.yaml > dashboard_expected_kpi`](./data/seed-fixture.yaml) để biết **giá trị KPI mong đợi** với fixture hiện tại.

**9 KPI:**
| KPI | FR | Công thức | Nguồn entity |
| :--- | :--- | :--- | :--- |
| KPI-01 | FR-I-01 | Count HOI_DAP (trong kỳ, scope đơn vị) | HOI_DAP |
| KPI-02 | FR-I-02 | Count VU_VIEC đã tiếp nhận | VU_VIEC |
| KPI-03 | FR-I-03 | Count VU_VIEC state ∈ {ĐÃ TIẾP NHẬN, ĐANG XỬ LÝ, ĐÃ PHÂN CÔNG} | VU_VIEC |
| KPI-04 | FR-I-04 | Count VU_VIEC state = `HOAN_THANH` (ngày HT trong kỳ) | VU_VIEC |
| KPI-05 | FR-I-05 | Count KHOA_HOC state = `DANG_DIEN_RA` | KHOA_HOC |
| KPI-06 | FR-I-06 | Count KHOA_HOC state = `KET_THUC` | KHOA_HOC |
| KPI-07 | FR-I-07 | Count TU_VAN_VIEN state = `HOAT_DONG` (rename v3.5 FR-04 từ `DANG_HOAT_DONG`) | TU_VAN_VIEN |
| KPI-08 | FR-I-08 | Chart cột (điểm hài lòng TB) + đường (SLA %) | KET_QUA_DANH_GIA |
| KPI-09 | FR-I-09 | Chart tròn (tỷ lệ đạt + điểm TB) | KET_QUA_DAO_TAO |

---

### 16. FLOW LUỒNG "API KẾT NỐI" (FR-16) — Nhóm XII
Không có màn hình UI — chỉ gồm 18 endpoint outbound (cho Cổng PLQG / HT TTHC BTP / HT khác tra cứu) + 8 endpoint inbound (nhận data từ DVC/LGSP). Phụ thuộc: data `DA_DUYET` / `CONG_KHAI` của các module nghiệp vụ upstream.

| Endpoint | Source module | State phụ thuộc | Scope |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/hoi-dap` | FR-02 Hỏi đáp | `CONG_KHAI` | Public |
| `GET /api/v1/kho-cau-hoi` (full-text) | FR-13 TV Nhanh | `DA_DUYET` + `hieu_luc=1` | Public |
| `GET /api/v1/tu-van-chuyen-sau` | FR-12 TV CS | `HOAN_THANH` (metadata-only) | Public |
| `GET /api/v1/bieu-mau` | FR-09 Biểu mẫu | `cong_khai=1` (v3.5 rename CR-01) | Public |
| `GET /api/v1/chuong-trinh-htpldn` | FR-15 CT HTPLDN | `DA_CONG_BO` (GĐ1) | Public |
| `GET /api/v1/dao-tao` | FR-03 Đào tạo | `DA_CONG_KHAI` | Public |
| `POST /api/v1/vu-viec` (inbound) | FR-05 từ DVC | — | JWT LGSP |
| `POST /api/v1/chi-tra` (inbound) | FR-06 từ DVC | — | JWT LGSP |

**Test approach:** Sau khi upstream module có data ở state tương ứng → curl endpoint (hoặc dùng Postman) → verify payload + response < 3s. Inbound endpoint hiện BLOCKED chung với FR-05 UC52/UC55 + FR-06 UC68 (chờ integration LGSP).

**Phụ thuộc test:** Seed đủ upstream trước khi test API outbound. Thứ tự: hoàn tất §5-§15 (BƯỚC 3-5) → chạy §16.

---

## PHỤ LỤC: BẢNG TÓM TẮT "THÊM MỚI THỦ CÔNG" TẤT CẢ MODULE

Bảng dưới tóm tắt Bước 1 thủ công (thay cho bước đồng bộ) của mỗi module. Tester dùng để tra cứu nhanh trước khi chạy test.

| # | Module | BƯỚC | Thủ công? | Bước 1 thủ công — state khởi tạo | Thay cho luồng đồng bộ nào? | Màn hình |
|---|--------|:---:|:---:|---|---|---|
| 1 | Hồ sơ Doanh nghiệp | 2 | ✅ | *Không có SM* (CRUD) | — (đã thuần thủ công) | `SCR-V.III-02` |
| 2 | Hồ sơ TVV (SM-TVV) | 2 | ✅ | `MOI_DANG_KY` | TVV tự đăng ký từ chuyên trang ngoài | `SCR-IV-02` |
| 3 | Thư viện Biểu mẫu (SM-BIEUMAU) | 2 | ✅ | `NHAP` | — (thuần thủ công) | `SCR-VII-02` |
| 4 | CT HTPLDN — GĐ1 Kế hoạch | 2 | ✅ | `DU_THAO` | — (thuần thủ công) | `SCR-XI-01` (Tab Thông tin) |
| 5 | Vụ việc HTPL (SM-VUVIEC) | 3 | ✅ | `DA_TIEP_NHAN` (bypass 2 state) | DN nộp qua DVC → CHỜ TIẾP NHẬN | `SCR-V.I-02` |
| 6 | Hỏi đáp (SM-HOIDAP) | 3 | ✅ | `MOI` | DN gửi từ Cổng PLQG | `SCR-II-01` |
| 7 | TV chuyên sâu (SM-TVCS) | 3 | ✅ | `TIEP_NHAN` | Cổng PLQG đẩy qua API Inbound | `SCR-X1-02` |
| 8.1 | Khóa ĐT (SM-KHOAHOC) | 3 | ✅ | `DU_THAO` (Khóa học) + `CHỜ DUYỆT` (Đăng ký) | DN/NHT đăng ký từ Cổng PLQG | `SCR-III-01/02` |
| 8.2 | Bài giảng | 3 | ✅ | `KICH_HOAT` | — (thuần thủ công) | Tab Bài giảng |
| 8.3 | Ngân hàng câu hỏi/Đề KT | 3 | ✅ | `KICH_HOAT` / `DU_THAO` | — (thuần thủ công) | Tab NH câu hỏi |
| 8.4 | Giảng viên | 3 | ✅ | `DANG_HOAT_DONG` | — (thuần thủ công) | Tab Giảng viên |
| 9 | Hợp đồng tư vấn | 4 | ✅ | `DANG_THUC_HIEN` (enum default §3.4.3.13) | — (thuần thủ công) | `SCR-X3-01` |
| 10 | **Chi trả (SM-CHITRA)** | 4 | ❌ | — **(không cho phép thủ công)** | DN nộp Mẫu 01 qua DVC/LGSP | — |
| 11 | Theo dõi Đánh giá Hiệu quả HTPL (SM-DANHGIA, FR-08 v3.5) | 4 | ✅ | `LAP_KE_HOACH` (8 state + HUY) | — (thuần thủ công) | `SCR-VI-01` |
| 12A | Phiên TV nhanh (SM-TVNHANH) | 4 | ❌ | — **(không cho phép thủ công)** | DN gửi từ khung chat Cổng PLQG | — |
| 12B | Kho Q&A | 4 | ✅ | `CHO_DUYET`, nguồn=`THU_CONG` | Auto đẩy từ Hỏi đáp (nguồn=TU_DONG) | `SCR-X2-01` |
| 13 | CT HTPLDN — GĐ2 Đợt BC | 5 | ✅ | `TAO_DOT` | — (thuần thủ công) | `SCR-XI-01` (Tab Đợt báo cáo) |
| 14 | Báo cáo Thống kê (FR-IX) | 5 | ✅ | `DANG_TAO` | — (thuần thủ công) | Module Báo cáo (23 loại) |
| 15 | Dashboard (FR-I) | 5 | — | Aggregate read-only (không seed) | — | `SCR-I-01` |
| 16 | API Kết nối (FR-16) | 5 | — | Không có UI — test endpoint | 8 API inbound BLOCKED (chờ LGSP) | — |

**Kết luận quan trọng cho QA:**
- **14 / 16 mục** có thể test được ngay bằng luồng thủ công. Chỉ duy nhất **Chi trả (§10)** và **Phiên TV nhanh (§12A)** bị BLOCK đến khi có integration Cổng PLQG/DVC/LGSP. §16 API phụ thuộc upstream có state target → chỉ test được khi upstream đã seed đủ.
- Khi test negative cho Chi trả: verify **KHÔNG có nút [+ Thêm mới]** trên SCR chi trả. Nếu có = BUG.
- Module `Theo dõi Đánh giá Hiệu quả HTPL` (FR-08 v3.5) — đã thống nhất 8 state SM = DB enum (`LAP_KE_HOACH/PHAN_CONG/CHO_DUYET_PC/THUC_HIEN/BAO_CAO/CHO_PHE_DUYET/HOAN_THANH/HUY`). Bỏ double-state cũ `NHAP/LAP_KE_HOACH` — assert 1 lần với enum DB v3.5.
- Module `Vụ việc HTPL` luồng thủ công **bypass 2 state** (`MỚI TẠO` và `CHỜ TIẾP NHẬN`), khởi tạo thẳng ở `DA_TIEP_NHAN`. Khi integration DVC xong, cần test lại full 9 step.
- Module `Kho Q&A`: nguồn `TU_DONG` (auto từ Hỏi đáp) bỏ qua phê duyệt; nguồn `THU_CONG` (CB NV nhập tay) bắt buộc CB PD duyệt. Test phải tách rõ 2 path.
- Module `CT HTPLDN` **tách 2 giai đoạn** (§4 ở BƯỚC 2 vs §13 ở BƯỚC 5). GĐ1 test độc lập ngay sau QTHT; GĐ2 chỉ chạy khi CT đã `DANG_THUC_HIEN` **và** LỚP 3+4 đã có số liệu trong kỳ.

---

## PHỤ LỤC 2: SEED DATA PRESETS — HAPPY PATH E2E

4 preset để cover test scenario xuyên module. Tester dùng khi tab/màn hình của module downstream rỗng (sau khi phân loại không phải bug dev — xem CLAUDE.md §Quy trình phân loại tab trống).

**Giá trị nhập cụ thể cho từng preset** (MST, tên, số tiền, state_target): xem [`input/data/seed-fixture.yaml`](./data/seed-fixture.yaml). **Account + thao tác** dùng luôn các bảng flow của từng module ở trên file này. **Troubleshooting** ở [Phụ lục 3](#phụ-lục-3-troubleshooting-khi-seed) cuối file.

### Preset P1 — "DN detail đầy đủ 3 tab"
**Mục tiêu:** Tab #2 (Hồ sơ PL) + Tab #3 (Lịch sử hỗ trợ + 3 KPI) + Tab #4 (Hồ sơ Chi trả) của `SCR-V.III-02` có data thực.

| Bước | Module | Entity tạo | State đích | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| 1 | §1 DN | `DOANH_NGHIEP` | (CRUD, không SM) | Gốc — master |
| 2 | §7 TV CS | `HO_SO_PHAP_LY_DN` | `HIEU_LUC` | Gắn `doanh_nghiep_id` của DN bước 1 → phủ Tab #2 |
| 3 | §2 TVV | `TU_VAN_VIEN` | `ĐANG HOẠT ĐỘNG` | Resource gán VV / Chi trả |
| 4 | §5 VV | `VU_VIEC` | `HOÀN THÀNH` (full 7 state) | Gắn DN + TVV → phủ Tab #3 KPI "1 VV / 1 hoàn thành" |
| 5 | §10 Chi trả | `HO_SO_CHI_TRA` | `DA_THANH_TOAN` (`so_tien_thuc_tra > 0`) | Gắn VV + DN → phủ Tab #3 KPI "Tổng chi phí" + Tab #4 |

**Account cần:** `cb_nv_tw_01` (CB NV) + `cb_pd_tw_01` (CB PD) + TVV-test (vừa tạo bước 3).
**Kỳ vọng verify cuối:** Mở DN detail → Tab #2 hiện 1 hồ sơ PL, Tab #3 hiện `{Tổng VV: 1, Hoàn thành: 1, Tổng chi phí: X VND}`, Tab #4 hiện 1 hồ sơ chi trả.

---

### Preset P2 — "TVV detail đầy đủ tab Lịch sử hỗ trợ"
**Mục tiêu:** Tab "Lịch sử hỗ trợ" của `SCR-IV-02` có ≥2 VV với state khác nhau để verify filter/counter.

| Bước | Module | Entity tạo | State đích | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| 1 | §2 TVV | `TU_VAN_VIEN` | `ĐANG HOẠT ĐỘNG` | Chủ thể test |
| 2 | §1 DN | `DOANH_NGHIEP` × 2 | (CRUD) | 2 DN khác nhau để VV không bị trùng |
| 3 | §5 VV | `VU_VIEC` #A | `HOÀN THÀNH` | Gán TVV + DN #1 |
| 4 | §5 VV | `VU_VIEC` #B | `ĐANG XỬ LÝ` | Gán TVV + DN #2 (dừng ở bước 5, không trình duyệt) |

**Account cần:** `cb_nv_tw_01` + `cb_pd_tw_01` + TVV-test.
**Kỳ vọng verify:** TVV detail → Tab LS hiện 2 VV (state `HOÀN THÀNH` + `ĐANG XỬ LÝ`).

---

### Preset P3 — "Chi trả E2E" (BLOCKED — chờ integration LGSP/DVC)
**Mục tiêu:** 1 hồ sơ Chi trả đi `CHỜ TIẾP NHẬN` → `ĐÃ THANH TOÁN` để test workflow phê duyệt.
**🚫 Prereq blocker:** CB NV không có nút [+ Thêm mới] trên `SCR-V.II-01` (spec). Cần backend inject bản ghi `CHO_TIEP_NHAN` qua test API hoặc seed DB trực tiếp.

| Bước | Module | Account | Action | State chuyển |
| :--- | :--- | :--- | :--- | :--- |
| 0 (BE seed) | — | BE/DBA | Inject 1 record `HO_SO_CHI_TRA` gắn VV từ P1 | `CHỜ TIẾP NHẬN` |
| 1 | §10 bước 2 | `cb_nv_tw_01` (CB NV) | Tiếp nhận → kiểm tra checklist 18 trường → đánh giá mức 100%/30%/10% → trình duyệt | `CHỜ PHÊ DUYỆT` |
| 2 | §10 bước 6 | `cb_pd_tw_01` (CB PD) | Phê duyệt | `ĐÃ DUYỆT` |
| 3 | §10 bước 7 | `cb_nv_tw_01` (CB NV) | Nhập `so_tien_thuc_tra` + `ngay_thanh_toan` + `ma_bien_nhan` | `ĐÃ THANH TOÁN` |

**Kỳ vọng verify:** Hiện trên DN detail Tab #4, counter "Tổng chi phí" tăng.

---

### Preset P4 — "Đánh giá HQ đủ mẫu"
**Mục tiêu:** Đợt đánh giá 6 tháng/năm có ≥3 VV `HOÀN THÀNH` trong kỳ để chấm điểm.

| Bước | Module | Thao tác | Ghi chú |
| :--- | :--- | :--- | :--- |
| 1 | — | Chạy P2 × 3 | Tạo 3 TVV + 6 DN + 3 VV `HOÀN THÀNH` trong kỳ đánh giá |
| 2 | §11 ĐG HQ | Chạy §11 bước 1→7 (Lập KH → Phân công → CB PD duyệt PC → Đánh giá viên chấm → Trình duyệt → CB PD duyệt cuối) | Kỳ vọng tự động filter 3 VV `HOÀN THÀNH` vào danh sách chấm điểm |

**Account cần:** `cb_nv_tw_01` + `cb_pd_tw_01` + 1 đánh giá viên được phân công.
**Kỳ vọng verify:** Tab "Chấm điểm" hiện 3 VV sẵn sàng, báo cáo TT17 tự sinh sau khi chấm xong.

---

**Khi nào dùng preset nào:**

| Bạn đang test… | Preset cần chạy trước |
| :--- | :--- |
| §1 Hồ sơ DN (tab detail) | P1 |
| §2 TVV (tab Lịch sử) | P2 |
| §3 Biểu mẫu | Không cần preset — tự đủ |
| §4 CT HTPLDN GĐ1 Kế hoạch | Không cần preset — tự đủ |
| §9 HĐ Tư vấn (dropdown liên kết VV) | P1 bước 4 (chỉ cần VV `HOÀN THÀNH`) |
| §10 Chi trả (workflow phê duyệt) | P3 (BLOCKED) |
| §11 Đánh giá HQ | P4 |
| §13 CT HTPLDN GĐ2 Đợt BC | §4 GĐ1 đã `ĐANG THỰC HIỆN` + P1 + P3 + §8.1 khoá học `HOÀN THÀNH` |
| §14 Báo cáo Thống kê | Tất cả upstream (§5-§13) |
| §16 API outbound | Upstream có state `DA_DUYET` / `CONG_KHAI` tương ứng endpoint |
| §5 Vụ việc (standalone CRUD) | Không cần preset — tự đủ |
| §6 Hỏi đáp (standalone) | Không cần preset — tự đủ |
| §7 TV chuyên sâu (standalone) | Không cần preset — chỉ cần DN + TVV |

---

## PHỤ LỤC 3: TROUBLESHOOTING KHI SEED

Lỗi hay gặp khi seed data. Tra trước khi escalate / log bug.

| Triệu chứng | Nguyên nhân | Fix |
| :--- | :--- | :--- |
| Dropdown "Chọn TVV" ở §5 VV bước phân công rỗng | TVV chưa đạt `ĐANG HOẠT ĐỘNG` (dừng giữa chừng) | Quay lại §2 TVV phê duyệt cho xong |
| Login TVV fail sau khi được phê duyệt | Flow "cấp mật khẩu TVV" chưa implement | Reset MK qua QTHT SCR-VIII-02, log BUG parallel |
| Tab #3 DN detail KPI vẫn = 0 sau khi tạo VV | VV chưa `HOÀN THÀNH` — mới ở `ĐÃ DUYỆT` | Chạy bước 8 (Cập nhật KQ cuối) — xem §5 VV flow |
| Tab #4 DN detail rỗng dù có Chi trả | Chi trả chưa `ĐÃ THANH TOÁN` — mới ở `ĐÃ DUYỆT` | Chạy bước cuối §10 Chi trả (nhập `so_tien_thuc_tra > 0`) |
| Không tạo được VV vì dropdown DN rỗng | DN chưa lưu thành công, hoặc scope filter `don_vi_id` khác | Check DN có hiện trong list SCR-V.III-01; check `don_vi_id` của user trùng với DN |
| Đánh giá HQ không hiện VV nào để chấm | VV không nằm trong kỳ đánh giá | Check `ngay_hoan_thanh` của VV có trong `kỳ_bat_dau`–`kỳ_ket_thuc` của đợt |
| BE trả 404 khi load danh sách Chi trả / TV Nhanh | Route chưa build (module BLOCKED) | Xem `blocked_reason` trong `seed-fixture.yaml`; log BUG nếu là route khác |
| Tab detail rỗng + text "Chức năng đang phát triển" | UI chưa build (không phải data gap) | Log BUG Critical theo CLAUDE.md §Quy trình phân loại tab trống. **Không** phí thời gian seed. |
