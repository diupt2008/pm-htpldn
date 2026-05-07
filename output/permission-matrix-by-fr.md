# Ma trận phân quyền CRUD — FR × Entity × Role

> **Nguồn:** SRS v3.1 §3.4.2 + **SRS update 2026-05-05** (`srs-update-2026-5-5/`)
> **Ngày trích:** 2026-04-16 | **Cập nhật 2026-04-21:** bổ sung Dashboard (FR-01) cho CB_NV/CB_PD + KHO_CAU_HOI chuyển FR-12 → FR-13 | **Cập nhật 2026-05-06:** apply SRS update FR-04 — thêm 3 entity mới (DANH_GIA_SAU_VU_VIEC, NGUOI_HO_TRO, TO_CHUC_TU_VAN) + 7 FR mới (FR-IV-CROSS-01, FR-IV-NEW-01/02/04, FR-IV-NHT-01/02/03) | **Cập nhật 2026-05-06 (FR-05 v3.5):** thêm **2 FR mới** FR-V.I-NEW-02 (DN bổ sung HS) + FR-V.I-NEW-05 (Công khai VV) + **3 entity owned mới** (PHAN_CONG_VU_VIEC, DANH_GIA_VU_VIEC, LICH_SU_VU_VIEC). | **Cập nhật 2026-05-06 (FR-12 v3.5):** rename entity NOI_DUNG_TU_VAN_CS → TU_VAN_CHUYEN_SAU (Thay đổi 2) + đổi tên menu "Tư vấn chuyên sâu" → "Tư vấn pháp luật chuyên sâu" (Thay đổi 1) + thêm **3 entity owned mới** (HO_SO_PHAP_LY_DN 3.4.3.46 / TU_LIEU_PHAP_LY_VV 3.4.3.47 / DANH_GIA_CHAT_LUONG_TV 3.4.3.48 — Thay đổi 5) + 7 state SM-TVCS mới (Thay đổi 3) + 4 BR mới BR-ROUTE-TVCS-01 + BR-PUBLIC-01/02/03 (Thay đổi 6+7) + NHT 📝 RU* trên HSPL_DN (Thay đổi 10).
> **View đối ứng:** [permission-matrix.md](permission-matrix.md) (Role × Entity) | [permission-matrix-by-role.md](permission-matrix-by-role.md) (Role × Function pivot)
> **Tổng entity:** **52 entity** (46 cũ + NGUOI_HO_TRO + TO_CHUC_TU_VAN + NGAY_LE + **PHAN_CONG_VU_VIEC + DANH_GIA_VU_VIEC + LICH_SU_VU_VIEC**) | **Role:** 11
> **Ghi chú:** FR-01 Dashboard là *view* (tổng hợp data từ các entity khác), không phải entity trong §3.4.2 — thêm dòng "Dashboard (Nhóm I — view)" để đối chiếu test quyền truy cập.

> **📋 FR-05 v3.5 permission delta (NEW 2026-05-06 — cite `srs-update-2026-5-5/srs-fr-05-vu-viec.md`):**
> - **FR-V.I-NEW-02 (DN bổ sung HS):** DN auth Tier 2 VNeID có quyền 🔌 C† trên VU_VIEC (transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` qua SCR-V.I-04). KHÁC: chỉ chính DN sở hữu VV (BR-AUTH-04 + ERR-VV-BS-04 cho DN khác).
> - **FR-V.I-NEW-05 (Công khai VV):** CB PD cùng cấp với CB NV xử lý (BR-AUTH-05) ✅ CRU* trên field `cong_khai` + 4 cột công khai. CB NV/QTHT/khác ❌ nút [Công khai]. Public read qua Cổng PLQG: 9 fields whitelist (BR-PUBLIC-04). Guest 👁️ R public.
> - **FR-V.I-09 refactor:** CB NV ✅ CRU* trên `PHAN_CONG_VU_VIEC` (modal 2 thẻ Cá nhân/Tổ chức); cá nhân được phân công 📝 RU* (xác nhận/từ chối qua `trang_thai`).
> - **FR-V.I-17 (UC67 đánh giá):** CHỈ {CB_NV, DN} ✅ CRU* trên `DANH_GIA_VU_VIEC` (loại CB_PD theo CSV UC67) + UNIQUE per `loai_nguoi_danh_gia`.
> - **BR-AUTH-08 update (V4-CHƯA-SỬA #1):** Cấp **TW thêm exception** xem toàn quốc — không filter `don_vi_id` (giống QTHT).
> - **2 SCR DN mới** dùng để DN tự xem VV của mình (V.I-04) + nhận thông báo (V.I-05) — backend cố định lọc theo DN auth, ẩn tên cá nhân CB (NĐ 13/2023).

---

## Ký hiệu

| Ký hiệu | Nghĩa | Test cần làm |
|----------|-------|--------------|
| ✅ CRUD* | Tạo + Xem + Sửa + Xóa (scoped theo đơn vị) | Test cả 4 thao tác + verify scope |
| ✅ CRU* | Tạo + Xem + Sửa (scoped, không xóa) | Test 3 thao tác + verify không xóa được |
| ✅ CRU\*D | Tạo + Xem + Sửa (scoped) + Xóa | Test 4 thao tác, R/U scoped nhưng D không scoped |
| ✅ CRUD | Tạo + Xem + Sửa + Xóa (toàn hệ thống) | Test 4 thao tác, không giới hạn đơn vị |
| 📝 RU* | Xem + Sửa (scoped) | Test xem/sửa + verify scope + không tạo/xóa được |
| 👁️ R | Xem toàn bộ (all scope) | Test xem được tất cả + không tạo/sửa/xóa được |
| 👁️ R* | Xem (scoped theo đơn vị) | Test xem + verify chỉ thấy data đơn vị mình |
| 🔌 C† | Tạo qua API (không qua CMS UI) | Test API endpoint + verify không truy cập CMS |
| 🔌 C†R* | Tạo qua API + Xem scoped | Test API tạo + CMS/API xem scoped |
| 🔌 C†RU* | Tạo qua API + Xem + Sửa scoped | Test API tạo + xem/sửa scoped |
| ❌ | Không có quyền | Test truy cập → bị chặn (403/ẩn menu) |

---

## 1. FR-01 — Dashboard

> **SRS §3.2.3, Nhóm I** | UC 1–9 | 0 entity §3.4.2 (Dashboard là *view* tổng hợp, Read-only, auto-refresh 60s, click drill-down)
> Entity nguồn: HOI_DAP, VU_VIEC, KHOA_HOC, TU_VAN_VIEN, KET_QUA_DANH_GIA, KET_QUA_DAO_TAO, CAU_HINH_SLA

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| Dashboard (Nhóm I — view) | ❌ | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |

> SRS §3.2.3 chỉ liệt kê tác nhân là **CB_NV (TW/BN/ĐP) + CB_PD (TW/BN/ĐP)**. QTHT, DN, TVV, CG, NHT không có quyền truy cập Dashboard trong SRS. BR áp dụng: BR-AUTH-01, BR-AUTH-03, BR-AUTH-04, BR-AUTH-08.

---

## 2. FR-02 — Hỏi đáp Pháp luật

> **SRS §3.2.2, Nhóm II** | 3 entity | **Update 2026-05-06 (v3.5)** — đổi tên "pháp lý" → "pháp luật" (Thay đổi 2 FR-11 ITEM-14)

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HOI_DAP | 👁️ R | ✅ CRU\*D | ✅ CRU\*D | ✅ CRU\*D | 👁️ R | 👁️ R* | 👁️ R* | 🔌 C† | ❌ | ❌ | ❌ |
| PHAN_HOI | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| MAU_PHAN_HOI `[CHANGED v3.5]` | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |

> **Note v3.5 (FR-02 update 2026-05-06):**
> - **MAU_PHAN_HOI áp Mô hình B Hybrid 2 tầng** (FR-II-NEW-02): scope đổi từ `don_vi_id` sang `pham_vi_ap_dung × cấp user`. CB_NV_TW chỉ tạo được mẫu `TW_QUOC_GIA` (mã quyền `MPH_CREATE_TW`); CB_NV_BN tạo `BN_RIENG` (`MPH_CREATE_BN`); CB_NV_DP tạo `DP_RIENG` (`MPH_CREATE_DP`). **Read** (`MPH_READ`): TW thấy tất cả; BN thấy `TW_QUOC_GIA` + mẫu BN của mình; ĐP thấy `TW_QUOC_GIA` + mẫu ĐP của mình. Ngoại lệ BR-AUTH-08: ĐP đọc cross-don_vi mẫu TW.
> - **HOI_DAP + PHAN_HOI thêm 5 trường công khai chuẩn CR-01:** `cong_khai`/`anh_dai_dien`/`thoi_gian_dang_tai`/`mo_ta_cong_khai`/`file_dinh_kem_cong_khai`. Vai trò Công khai/Hủy CK **chỉ CB Phê duyệt cùng cấp** (BR-FLOW-05 thu hẹp — CB NV bị chặn).
> - **HOI_DAP thêm `don_vi_id` (CR-06):** DN chọn cơ quan tiếp nhận khi gửi từ Cổng PLQG (default Sở TP tỉnh DN). Scope CRUD scoped theo `don_vi_id` bản ghi (không phải `don_vi_id` user).
> - **HOI_DAP enum `kenh_tiep_nhan` thêm `TVN_BRIDGE`** (auto-fill từ FR-13 ESCALATE) + **state HUY mới** (8→9 state SM-HOIDAP).
> - **BR-FLOW-06 mới:** Đóng hồ sơ thủ công, KHÔNG auto-close — CB NV cùng đơn vị HOẶC CB PD cùng cấp click "Đóng hồ sơ" trên SCR-II-02.
> - **BR-FLOW-03 mở rộng:** cấm sửa/xóa cả `DA_DUYET + CONG_KHAI + HOAN_THANH`. Bản ghi đã CONG_KHAI phải Hủy CK trước, vẫn không xóa được.
> - **CAU_HINH_PHAN_CONG entity bỏ khỏi FR-02** — chuyển sang FR-10 MH-10.7 (FR-II-NEW-01 chuyển sang QTHT).

---

## 3. FR-03 — Đào tạo, Tập huấn

> **SRS §3.2.3 (Nhóm III)** | 10 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| CHUONG_TRINH_DAO_TAO | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | 👁️ R | ❌ | ❌ |
| KHOA_HOC | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | 👁️ R | ❌ | ❌ |
| BAI_GIANG | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |
| NGAN_HANG_CAU_HOI | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| DE_KIEM_TRA | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| KET_QUA_DAO_TAO | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | 👁️ R* | ❌ | ❌ |
| CHUNG_NHAN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ |
| GIANG_VIEN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| DANG_KY_DAO_TAO | 👁️ R | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 📝 RU* | 🔌 C†R* | 🔌 C†R* | ❌ | ❌ |
| DE_XUAT_DAO_TAO | 👁️ R | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R* | 👁️ R* | 🔌 C†RU* | 🔌 C†RU* | ❌ | ❌ |

---

## 4. FR-04 — Tư vấn viên / Chuyên gia + Người hỗ trợ + Tổ chức tư vấn

> **SRS §3.2.4 (Nhóm IV) + SRS update 2026-05-05** | **6 entity** (3 cũ + 2 entity mới NGUOI_HO_TRO/TO_CHUC_TU_VAN + 1 entity tách DANH_GIA_SAU_VU_VIEC)
> **Update 2026-05-05:** NHT tách entity riêng `NGUOI_HO_TRO` (NĐ 55/2019 Đ.7) — `loai_tvv` enum chỉ `('TVV','CG')`. TC TV nâng cấp từ DM thành entity `TO_CHUC_TU_VAN`. Đánh giá DN sau VV tách entity `DANH_GIA_SAU_VU_VIEC` (3 tiêu chí 1-5). Cite: `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:1998` + `:2032` + `:2138` + `:2178`.
> **18 FR liên quan:** FR-IV-01..12 + FR-IV-CROSS-01 + **FR-IV-NEW-01/02/04** (TC TV) + **FR-IV-NHT-01/02/03** (NHT).

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| TU_VAN_VIEN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | 👁️ R* | 👁️ R* |
| HO_SO_TU_VAN_VIEN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ✅ CRU* | 👁️ R* | 👁️ R* |
| DANH_GIA_TU_VAN_VIEN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | ❌ | ❌ | ❌ | ❌ |
| **DANH_GIA_SAU_VU_VIEC** `[NEW]` | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 🔌 C†R* | ❌ | ❌ | ❌ |
| **NGUOI_HO_TRO** `[NEW]` | ✅ CRUD | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | 📝 RU* (own) | ❌ | ❌ |
| **TO_CHUC_TU_VAN** `[NEW]` | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | ❌ | 👁️ R | 👁️ R |

> **Ghi chú entity mới:**
> - `DANH_GIA_TU_VAN_VIEN` (entity thẩm định nội bộ FR-IV-06) — 4 nhóm tiêu chí: Nhóm 1+4 boolean, Nhóm 2+3 thang 1-5. CB NV/CB PD chấm. **DN KHÔNG có quyền** (đánh giá DN sau VV nằm ở `DANH_GIA_SAU_VU_VIEC` riêng).
> - `DANH_GIA_SAU_VU_VIEC` `[NEW]` (FR-IV-09 + BR-CALC-06) — DN chấm sau VV qua API (🔌 C†R*) 3 tiêu chí 1-5. Tính TB lưu ở `TU_VAN_VIEN.diem_danh_gia_tb` (DECIMAL 1.0-5.0).
> - `NGUOI_HO_TRO` `[NEW]` (FR-IV-NHT-01) — QTHT/CB NV CRUD; CB PD R-only (KHÔNG có workflow phê duyệt NHT — SM-NHT 4 state đơn giản); NHT 📝 RU* own scope (FR-IV-NHT-03 xem hồ sơ + cập nhật chứng chỉ HTPL).
> - `TO_CHUC_TU_VAN` `[NEW]` (FR-IV-NEW-01/02/04) — CB NV CRUD; CB PD 📝 RU* (FR-IV-NEW-04 phê duyệt cùng cấp BR-AUTH-05); DN/TVV/CG 👁️ R public TC TV `cong_khai=1` qua Cổng PLQG hoặc dropdown `to_chuc_chinh_id`.

---

## 5. FR-05 — Vụ việc HTPL

> **SRS §3.2.5 (Nhóm V)** | 3 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| VU_VIEC | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | 📝 RU* | ❌ | ❌ |
| HO_SO_VU_VIEC | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 🔌 C†R* | ✅ CRU* | ❌ | ❌ |
| KET_QUA_VU_VIEC | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | ✅ CRU* | ❌ | ❌ |

> ⚠️ TVV KHÔNG có quyền trên cả 3 entity Vụ việc. NHT mới là người có quyền RU*/CRU* trên vụ việc được phân công.

---

## 6. FR-06 — Chi trả Chi phí

> **SRS §3.2.6 (Nhóm V.II)** — [`srs-update-2026-5-5/srs-fr-06-chi-tra.md`](../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md) v3.5 | **4 entity** (+THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA mới)
>
> **🔴 SRS v3.5 update 2026-05-06:** +1 FR mới FR-V.II-14 (DN bổ sung HS qua DVC/Cổng PLQG hoặc CB NV thủ công, ≤5 ngày LV, max 3 lần). +2 entity owned (`THAM_DINH_HO_SO` 1:1, `PHE_DUYET_CHI_TRA` N:1 cho phép CB PD trả về nhiều lần). DN có thêm quyền Update HSCT qua FR-V.II-14 + FR-V.II-02 [GAP-V.II-03] (rút HS) — đổi 🔌 C†R* → 🔌 C†RU*. CB PD "Từ chối" = trả về DANG_THAM_DINH (BR-FLOW-04 lý do ≥10 ký tự) — tạo bản ghi PHE_DUYET_CHI_TRA mỗi lần (do đó CR* chứ không update). 2 vấn đề chờ BA confirm — xem [`ba-questions-fr06-2026-05-06.md`](qa-reports/round7-2026-05-06/bug-reports/ba-questions-fr06-2026-05-06.md).

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HO_SO_CHI_TRA | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 🔌 C†RU* `[CHANGED v3.5]` | ❌ | 👁️ R* | ❌ |
| DANH_GIA_HO_SO_CHI_TRA | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| THAM_DINH_HO_SO `[NEW v3.5]` | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| PHE_DUYET_CHI_TRA `[NEW v3.5]` | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ✅ CR* (BR-AUTH-05) | ✅ CR* (BR-AUTH-05) | ✅ CR* (BR-AUTH-05) | ❌ | ❌ | ❌ | ❌ |

**Ghi chú v3.5:**
- DN quyền 🔌 C†RU* trên HO_SO_CHI_TRA: Create qua DVC inbound FR-V.II-01; Update file_bo_sung[] qua FR-V.II-14 (YEU_CAU_BO_SUNG, ≤5 ngày LV); Update rút hồ sơ qua FR-V.II-02 [GAP-V.II-03] (CHO_TIEP_NHAN → HUY).
- THAM_DINH_HO_SO: CB NV tạo + sửa (1:1 với HSCT, ket_qua_tham_dinh DAT/KHONG_DAT/CAN_BO_SUNG). CB PD chỉ R để xem lúc phê duyệt.
- PHE_DUYET_CHI_TRA: N:1 — mỗi quyết định CB PD (DUYET hoặc TU_CHOI=trả về) tạo bản ghi mới. CB PD chỉ Create (không Update — immutable history). CB NV R để xem lịch sử trả về.

---

## 7. FR-07 — Doanh nghiệp

> **SRS §3.2.7 (Nhóm V.III)** — [`srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md`](../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md) v3.5 | **2 entity** (DOANH_NGHIEP + DOANH_NGHIEP_LINH_VUC mới)
>
> **🔴 SRS v3.5 update 2026-05-06 — CB_NV_TW/BN/DP bỏ quyền Create:** DN tạo qua DN tự đăng ký FR-VIII-22 (FR-10). CB NV chỉ còn R/U/D scoped theo BR-AUTH-08. KHÔNG còn Import Excel (FR-V.III-NEW-01 BỎ).

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| DOANH_NGHIEP | 👁️ R | 📝 RUD* | 📝 RUD* | 📝 RUD* | 👁️ R* | 👁️ R* | 👁️ R* | 📝 RU* | ❌ | ❌ | ❌ |
| DOANH_NGHIEP_LINH_VUC `[NEW v3.5]` | 👁️ R | 📝 RUD* | 📝 RUD* | 📝 RUD* | 👁️ R* | 👁️ R* | 👁️ R* | 📝 RU* | ❌ | ❌ | ❌ |

> **Ghi chú v3.5:**
> - DOANH_NGHIEP_LINH_VUC là bảng nối M-N (DN ↔ DANH_MUC loai='LINH_VUC_KINH_DOANH'). Quyền theo DN cha — sửa DN = sửa lĩnh vực liên quan.
> - DN tạo entity mới qua **FR-VIII-22 self-reg** (TK-first registration, username = MST 10 chữ số). Sau kích hoạt qua FR-VIII-26 → DN có quyền RU* trên DOANH_NGHIEP của chính mình.
> - Email: `TAI_KHOAN.email` UNIQUE login (khóa) + `DOANH_NGHIEP.email` không UNIQUE (BR-AUTH-EMAIL-01). DN đổi `DOANH_NGHIEP.email` không cần OTP (BR-AUTH-EMAIL-01).

---

## 8. FR-08 — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

> **SRS §3.2 Nhóm VI** (`srs-update-2026-5-5/srs-fr-08-danh-gia.md` v3.5) | 4 entity owned + FR-VI-01 đến **FR-VI-10**
>
> **⚠️ Update 2026-05-06 (FR-08 v3.5):** Module rename "Kế hoạch đánh giá" → **"Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý"**. Entity rename `DOT_DANH_GIA / DANH_GIA_HQ` → `KE_HOACH_DANH_GIA`. SM-DANHGIA thống nhất 8 state v3.5: `LAP_KE_HOACH/PHAN_CONG/CHO_DUYET_PC/THUC_HIEN/BAO_CAO/CHO_PHE_DUYET/HOAN_THANH/HUY` (state cũ NHAP/DA_LAP_KH/DA_DUYET_PC/DANG_DANH_GIA/DA_DANH_GIA/DA_LAP_BC/CHO_DUYET_BC/DA_DUYET_BC bỏ).
>
> **🆕 FR-VI-10 "Nhận kết quả đánh giá" (mới v3.5, GAP-VI-04):** Read-only cho **CB NV thuộc `co_quan_duoc_danh_gia_id`** (cơ quan được đánh giá, có thể KHÁC `don_vi_id` cơ quan thực hiện ĐG) — chỉ khi đợt ở `HOAN_THANH`. Truy cập SCR-VI-01 Tab Báo cáo. Cấp quyền (column "FR-VI-10 scope"): R\* trên KE_HOACH_DANH_GIA + KET_QUA_DANH_GIA + BAO_CAO_DANH_GIA scoped theo `co_quan_duoc_danh_gia_id = user.don_vi_id` AND `trang_thai = HOAN_THANH`.

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| KE_HOACH_DANH_GIA | 👁️ R | ✅ CRUD* + 👁️ R\*\* | ✅ CRUD* + 👁️ R\*\* | ✅ CRUD* + 👁️ R\*\* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| KET_QUA_DANH_GIA | 👁️ R | ✅ CRU* + 👁️ R\*\* | ✅ CRU* + 👁️ R\*\* | ✅ CRU* + 👁️ R\*\* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| TIEU_CHI_DANH_GIA | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| BAO_CAO_DANH_GIA | 👁️ R | ✅ CRU* + 👁️ R\*\* | ✅ CRU* + 👁️ R\*\* | ✅ CRU* + 👁️ R\*\* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

> **Chú thích scope CB_NV (FR-08 v3.5):**
> - `CRUD*` / `CRU*` — scope theo `don_vi_id` (cơ quan thực hiện ĐG, role mặc định FR-VI-01..09).
> - `👁️ R**` (NEW v3.5) — scope theo `co_quan_duoc_danh_gia_id` (cơ quan được ĐG, FR-VI-10), chỉ trên đợt ở trạng thái `HOAN_THANH`. Read-only — KHÔNG cho update/create/delete.
> - 1 user CB NV có thể có CẢ 2 scope nếu thuộc cơ quan thực hiện ĐG đồng thời được cử vào cơ quan khác — verify isolation.

---

## 9. FR-09 — Biểu mẫu

> **SRS §3.2.9 (Nhóm VII — BIEU_MAU + THU_MUC_BIEU_MAU)** | 2 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| BIEU_MAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |
| THU_MUC_BIEU_MAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |

---

## 10. FR-10 — Quản trị Hệ thống (QTHT)

> **SRS §3.2.10 (Nhóm VIII) v3.5** | **10 entity** (thêm NGAY_LE từ SRS update 2026-05-05 — FR-VIII-29 `[GAP-VIII-05]`)

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| DANH_MUC | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R |
| TAI_KHOAN | ✅ CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| VAI_TRO | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| QUYEN_HAN | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| DON_VI | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R |
| CAU_HINH_SLA | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| **NGAY_LE** `[NEW v3.5]` | ✅ CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AUDIT_LOG | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| THONG_BAO | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* |
| ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — | — | — | — | — | — | — | — | — | — | — |

---

## 11. FR-11 — Báo cáo Thống kê

> **SRS §3.2.11 (Nhóm VII — BAO_CAO)** | 1 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| BAO_CAO | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

---

## 12. FR-12 — Tư vấn pháp luật chuyên sâu `[RENAMED 2026-05-06 v3.5 — Thay đổi 1]`

> **SRS §3.2.15 (Nhóm X.1)** | **6 entity** (3 cũ + 3 mới owned từ FR-12 v3.5: HO_SO_PHAP_LY_DN/TU_LIEU_PHAP_LY_VV/DANH_GIA_CHAT_LUONG_TV — Thay đổi 5)
> **Update 2026-05-06 (FR-12 v3.5):** rename entity `NOI_DUNG_TU_VAN_CS` → `TU_VAN_CHUYEN_SAU` (Thay đổi 2); thêm 3 entity owned 3.4.3.46/47/48 (Thay đổi 5); 5 trường công khai chuyên trang trên TVCS + Tư liệu PL VV (Thay đổi 7 + BR-PUBLIC-01/02/03); BR-ROUTE-TVCS-01 routing TVCS theo cơ quan DN chọn (Thay đổi 6); NHT có 📝 RU* trên HSPL_DN scoped theo VV phân công (Thay đổi 10).

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| TU_VAN_CHUYEN_SAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | ❌ | 👁️ R* | ✅ CRU* |
| PHIEN_TU_VAN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | 👁️ R* | 📝 RU* |
| LICH_SU_TRAO_DOI_TV | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | 🔌 C†R* | ❌ | ❌ | ✅ CRU* |
| HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 📝 RU* | ❌ | ❌ |
| TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 🔌 C† | ❌ | ❌ | ❌ |

> **Ghi chú entity v3.5:**
> - `HO_SO_PHAP_LY_DN` (3.4.3.46, FR-X.1-04 UC150 + FR-X.1-05 UC151): nhận từ Cổng PLQG qua API inbound (BR-NOTIF-01); NHT 📝 RU* scoped theo VV được phân công cho NHT trong cơ quan của mình (Thay đổi 10 — chỉ R+U, KHÔNG C/D, ngoài scope → 403). DN 👁️ R* thấy HSPL của chính DN qua portal.
> - `TU_LIEU_PHAP_LY_VV` (3.4.3.47, FR-X.1-06 UC152): công khai trực tiếp lên Cổng PLQG, KHÔNG cần phê duyệt (BR-FLOW-07). 4 trường công khai bổ sung (đã có sẵn `cong_khai`): `anh_dai_dien`, `thoi_gian_dang_tai`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai`. State: NHAP / CONG_KHAI.
> - `DANH_GIA_CHAT_LUONG_TV` (3.4.3.48, FR-X.1-07 UC153 — API inbound only): DN gửi điểm 1-5 + nhận xét qua API Cổng PLQG sau khi TVCS đạt DA_DUYET. Idempotent với `ma_danh_gia_cong` UNIQUE + `hanh_dong` ENUM (TAO_MOI/CAP_NHAT/GUI_LAI). KHÔNG gộp vào BR-CALC-06 (thang TVV 1-5) theo Thay đổi 14 OUT.

---

## 13. FR-13 — Tư vấn Nhanh

> **SRS §3.2.13 (Nhóm X.2)** | 1 entity (KHO_CAU_HOI — FR-X.2-01 "Quản lý kho câu hỏi/tư vấn", UC158)

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| KHO_CAU_HOI | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R | ❌ | ❌ | ❌ |

> DN tương tác qua **chuyên trang Cổng PLQG** (không login CMS): gửi câu hỏi (FR-X.2-03, UC160), tìm kiếm Q&A đã duyệt (FR-X.2-04, UC161), đánh giá trả lời (FR-X.2-05, UC162). Q&A thủ công/import phải qua phê duyệt CB_PD.

---

## 14. FR-14 — Hợp đồng Tư vấn

> **SRS §3.2.14 (Nhóm X.1 — HOP_DONG_TU_VAN)** | 1 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HOP_DONG_TU_VAN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | 👁️ R* | ❌ |

---

## 15. FR-15 — Chương trình HTPLDN

> **SRS §3.2.15 (Nhóm XI)** | 3 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| CHUONG_TRINH_HTPL | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| KE_HOACH_CT_HTPL | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| BAO_CAO_CT_HTPL | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

---

## 16. FR-16 — API Kết nối Chia sẻ Dữ liệu

> **SRS §3.2.16 (Nhóm XII)** | UC171–190 | 18 FR outbound | 0 entity CMS

*(Không có bảng entity riêng — test theo endpoint API)*

- **Không có màn hình CMS**, chỉ cung cấp **18 API outbound** (9 cặp Chia sẻ + Tìm kiếm) cho Cổng PLQG qua REST JSON trực tiếp + mTLS + JWT RS256 (issuer `htpldn.moj.gov.vn`, scope, exp), rate limit 100 req/min/consumer_id.
- **Consumer** là system actor (Cổng PLQG / Hệ thống khác có client certificate + JWT), **không phải role CMS**.
- **QTHT giám sát** qua: Dashboard KPI API trạng thái (FR-01) + AUDIT_LOG (FR-10) + Grafana/Prometheus. Không có CRUD API qua CMS.
- **DN / NHT / Người dân** gián tiếp qua chuyên trang Cổng PLQG — các quyền 🔌 C† / 🔌 C†R* / 🔌 C†RU* trên entity của module khác (HOI_DAP, HO_SO_VU_VIEC, HO_SO_CHI_TRA, DANH_GIA_TU_VAN_VIEN, LICH_SU_TRAO_DOI_TV, DANG_KY_DAO_TAO, DE_XUAT_DAO_TAO) đã bao gồm quyền API inbound của DN + NHT.
- **State Machine:** Không có SM riêng. 18 API đều read-only outbound, trả data ở trạng thái publishable (đã duyệt/công khai/hoàn thành) theo BR-INTG-07.

**9 cặp API:**

| # | Nội dung | UC Chia sẻ | UC Tìm kiếm | FR-ID Chia sẻ | FR-ID Tìm kiếm |
|---|----------|-----------|-------------|----------------|-----------------|
| 1 | Hỏi đáp/vướng mắc PL | UC171 | UC172 | FR-XII-01 | FR-XII-02 |
| 2 | Đào tạo/bồi dưỡng | UC173 | UC174 | FR-XII-03 | FR-XII-04 |
| 3 | CG/TVV | UC175 | UC176 | FR-XII-05 | FR-XII-06 |
| 4 | Vụ việc TGPL | UC177 | UC178 | FR-XII-07 | FR-XII-08 |
| 5 | Đánh giá hiệu quả | UC179 | UC180 | FR-XII-09 | FR-XII-10 |
| 6 | Thư viện biểu mẫu | UC181 | UC182 | FR-XII-11 | FR-XII-12 |
| 7 | Tư vấn chuyên sâu | UC183 | UC184 | FR-XII-13 | FR-XII-14 |
| 8 | CT HTPLDN | UC185 | UC186 | FR-XII-15 | FR-XII-16 |
| 9 | Hồ sơ pháp lý DN | UC189 | UC190 | FR-XII-17 | FR-XII-18 |

---

## Quy tắc scoping & ghi chú

**Quy tắc scoping (\*):**
- **TW (Trung ương):** Nhìn thấy dữ liệu TẤT CẢ đơn vị (toàn quốc)
- **BN (Bộ ngành):** Chỉ nhìn thấy dữ liệu đơn vị BN của mình
- **ĐP (Địa phương):** Chỉ nhìn thấy dữ liệu đơn vị ĐP của mình
- **Ngang cấp KHÔNG thấy nhau** — chính sách phân quyền dữ liệu đảm bảo chỉ thấy dữ liệu đơn vị mình

**Ghi chú quan trọng cho test:**
1. **🔌 DN qua API:** DN không truy cập CMS trực tiếp. Quyền C†/R† thực hiện qua API inbound từ Cổng PLQG (SI-04, Nhóm XII). Test cần cover cả luồng API.
2. **👁️ QTHT Read:** QTHT có quyền Read trên hầu hết entity nghiệp vụ — cần test admin xem được nhưng KHÔNG sửa/xóa dữ liệu nghiệp vụ.
3. **📝 CB_PD Update = Phê duyệt:** Quyền Update của CB_PD bao gồm hành động phê duyệt/từ chối trong workflow.
4. **⚠️ TVV ≠ NHT trên Vụ việc:** TVV KHÔNG có quyền trên VU_VIEC (❌). TVV chỉ tương tác qua HO_SO_VU_VIEC và KET_QUA_VU_VIEC (nếu có). NHT mới có 📝 RU* trên VU_VIEC.
5. **Test pattern mỗi ô:** Mỗi ô có quyền (≠ ❌) = ít nhất 1 positive test + 1 negative test (role khác thử truy cập).
