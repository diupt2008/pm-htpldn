# Ma trận phân quyền CRUD — Role × Entity

> **Nguồn:** SRS v3.1 §3.4.2 — Ma trận phân quyền CRUD (Permission Matrix)
> **Ngày trích:** 2026-04-16 | **Refactor:** 2026-04-19 — sắp xếp theo FR-01 → FR-16 | **Refactor 2026-04-21** — xoay 90° thành Role × Entity (view theo từng role) + bổ sung Dashboard (FR-01) cho CB_NV/CB_PD + đổi nhãn KHO_CAU_HOI FR-12 → FR-13 (xác nhận qua NotebookLM SRS §3.2.13) | **Update 2026-05-05** — apply 3 SRS update: thêm 3 entity (NGUOI_HO_TRO + TO_CHUC_TU_VAN + NGAY_LE), bỏ quyền Create của CB NV trên DOANH_NGHIEP (FR-VIII-22 self-reg), thêm quyền Create qua API self-reg cho DN. | **Update 2026-05-06 (FR-05 v3.5)** — apply 14 thay đổi IN: thêm **3 entity owned mới** (PHAN_CONG_VU_VIEC, DANH_GIA_VU_VIEC, LICH_SU_VU_VIEC), thêm **2 SCR DN mới** (SCR-V.I-04 Danh sách VV của tôi + SCR-V.I-05 Thông báo của tôi), VU_VIEC.cong_khai = public read by Guest qua Cổng PLQG (whitelist 9 fields BR-PUBLIC-04), BR-AUTH-08 thêm exception "Cán bộ Trung ương" (V4-CHƯA-SỬA #1). DON_VI 2 tầng (TW cấp 1 — BN/ĐP cấp 2 ngang cấp). | **Update 2026-05-06 (FR-12 v3.5)** — apply 13 thay đổi IN: thêm **3 entity owned mới** (HO_SO_PHAP_LY_DN 3.4.3.46 / TU_LIEU_PHAP_LY_VV 3.4.3.47 / DANH_GIA_CHAT_LUONG_TV 3.4.3.48 — Thay đổi 5); thêm quyền NHT 📝 RU* trên HO_SO_PHAP_LY_DN scoped theo VV được phân công (Thay đổi 10); rename entity NOI_DUNG_TU_VAN_CS → TU_VAN_CHUYEN_SAU (Thay đổi 2 — đã sync trong các bảng); 5 trường công khai chuyên trang trên TVCS + Tư liệu PL VV (BR-PUBLIC-01/02/03 — Thay đổi 7); BR-ROUTE-TVCS-01 routing TVCS theo cơ quan DN chọn (Thay đổi 6). | **Update 2026-05-06 (FR-08 v3.5)** — apply 8 thay đổi IN: rename module + entity (`DOT_DANH_GIA / DANH_GIA_HQ` → `KE_HOACH_DANH_GIA` — Thay đổi 1+6); thêm 2 field `co_quan_duoc_danh_gia_id` 1:1 BẮT BUỘC + `file_dinh_kem` (Thay đổi 2+4); **thêm FR-VI-10 "Nhận kết quả đánh giá"** (Thay đổi 3, GAP-VI-04) — **CB NV thuộc `co_quan_duoc_danh_gia_id` có quyền 👁️ R\* trên KE_HOACH_DANH_GIA + KET_QUA_DANH_GIA + BAO_CAO_DANH_GIA của đợt `HOAN_THANH`** (read-only, scoped theo cơ quan được ĐG, có thể KHÁC `don_vi_id` cơ quan thực hiện ĐG); SM-DANHGIA thống nhất 8 state v3.5 + HUY (Thay đổi 5); BR-NOTIF-01 mở rộng FR-VI-03/04/08/09 (Thay đổi 7). | **Update 2026-05-06 (FR-02 v3.5)** — KHÔNG thêm entity mới; áp 4 thay đổi tác động permission: (1) **MAU_PHAN_HOI áp Mô hình B Hybrid 2 tầng** — scope đổi từ `don_vi_id` sang `pham_vi_ap_dung × cấp user`, ngoại lệ BR-AUTH-08: ĐP đọc cross-don_vi mẫu `TW_QUOC_GIA`, BN không thấy mẫu TW (FR-II-NEW-02 + Thay đổi 13 FR-10); (2) HOI_DAP + PHAN_HOI thêm 5 trường công khai chuẩn CR-01 (`cong_khai`/`anh_dai_dien`/`thoi_gian_dang_tai`/`mo_ta_cong_khai`/`file_dinh_kem_cong_khai`); (3) HOI_DAP thêm `don_vi_id` (CR-06) — DN chọn cơ quan tiếp nhận khi gửi từ Cổng PLQG, default Sở TP tỉnh DN, scope CRUD scoped đổi theo `don_vi_id` bản ghi; (4) HOI_DAP thêm enum kênh `TVN_BRIDGE` + state `HUY` (8→9 state SM-HOIDAP). Action-level 4 mã quyền mới: `MPH_CREATE_TW` (chỉ CB_NV_TW) / `MPH_CREATE_BN` (chỉ CB_NV_BN) / `MPH_CREATE_DP` (chỉ CB_NV_DP) / `MPH_READ` (filter theo phạm vi). BR-FLOW-05 thu hẹp: chỉ CB Phê duyệt cùng cấp được Công khai/Hủy CK (CB NV bị chặn). BR-FLOW-06 mới: Đóng hồ sơ thủ công, KHÔNG auto-close.
> **Dùng cho:** [test-strategy.md](test-strategy.md) §5.1
> **Tổng entity:** **55 entity** (SRS §3.4.2 baseline 46 + 3 entity từ FR-04/07/10 update 2026-05-05 + **3 entity mới từ FR-05 v3.5 update 2026-05-06** + **3 entity mới từ FR-12 v3.5 update 2026-05-06**) | **Role:** 11
> **Tham chiếu update:** [`../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md), [`_DELTA-MAP-FR05.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR05.md), [`_DELTA-MAP-FR07.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md), [`CHANGELOG-v3-to-v3.5.md`](../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) §srs-fr-12-tv-chuyen-sau.md.
>
> **🆕 3 entity owned mới VV — quyền matrix (NEW 2026-05-06, applies all roles):**
> - **PHAN_CONG_VU_VIEC**: CB NV ✅ CRU* scope (tạo PC, sửa khi cần phân công lại); CB PD 👁️ R* (xem); QTHT 👁️ R; cá nhân được phân công 📝 RU* (chấp nhận/từ chối qua trang_thai); DN/khác ❌. Cite: `srs-update-2026-5-5/srs-fr-05-vu-viec.md` §4 PHAN_CONG_VU_VIEC.
> - **DANH_GIA_VU_VIEC**: **CHỈ {CB_NV, DN}** ✅ CRU* (loại CB_PD theo CSV UC67); CB PD/QTHT 👁️ R*; UNIQUE per loại — duplicate → ERR-DG-VV-04. Cite: §4 DANH_GIA_VU_VIEC + FR-V.I-17.
> - **LICH_SU_VU_VIEC**: CB NV/CB PD/QTHT 👁️ R* (audit log read scope đơn vị); cá nhân được phân công 👁️ R* (action của mình); DN 👁️ R* (action của VV mình); KHÔNG ai write trực tiếp (auto ghi từ FR-V.I-01..17 + NEW-02 + NEW-05). Cite: §4 LICH_SU_VU_VIEC.
>
> **🆕 3 entity owned mới TVCS — quyền matrix (NEW 2026-05-06 FR-12 v3.5, applies all roles):**
> - **HO_SO_PHAP_LY_DN** (FR-X.1-04/05, UC150-151): CB NV ✅ CRUD* (CMS qua FR-X.1-04 + nhận từ Cổng PLQG via API qua FR-X.1-05); CB PD 👁️ R* (entity này không có quy trình phê duyệt); QTHT 👁️ R; **NHT 📝 RU* scoped theo VV được phân công cho NHT trong cơ quan của mình** (Thay đổi 10 — chỉ R+U, KHÔNG C/D, ngoài scope → 403); DN 👁️ R* (own DN's HSPL via portal); TVV/CG ❌. Cite: `srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md` §3.4.3.46 + Thay đổi 5+10.
> - **TU_LIEU_PHAP_LY_VV** (FR-X.1-06, UC152): CB NV ✅ CRUD* + công khai trực tiếp (BR-FLOW-07 không cần phê duyệt); CB PD 👁️ R*; QTHT 👁️ R; DN/NHT/TVV/CG ❌ trên CMS — DN xem qua chuyên trang Cổng PLQG khi `cong_khai=1`. Cite: §3.4.3.47 + Thay đổi 5+7+8.
> - **DANH_GIA_CHAT_LUONG_TV** (FR-X.1-07, UC153): CB NV 👁️ R* (entity nhận từ API inbound Cổng PLQG, không tạo CMS); CB PD 👁️ R*; QTHT 👁️ R; **DN 🔌 C†** (gửi điểm + nhận xét qua API Cổng PLQG sau DA_DUYET); TVV/CG/NHT ❌. Cite: §3.4.3.48 + Thay đổi 5.

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

> **Lưu ý:** Mỗi bảng dưới đây chỉ liệt kê entity mà role đó CÓ quyền (≠ ❌). Các entity không xuất hiện = role không có quyền → test truy cập phải bị chặn.

---

## 1. QTHT

| FR | Entity | Quyền |
|----|--------|-------|
| FR-02 | HOI_DAP | 👁️ R |
| FR-02 | PHAN_HOI | 👁️ R |
| FR-02 | MAU_PHAN_HOI | 👁️ R |
| FR-03 | CHUONG_TRINH_DAO_TAO | 👁️ R |
| FR-03 | KHOA_HOC | 👁️ R |
| FR-03 | BAI_GIANG | 👁️ R |
| FR-03 | NGAN_HANG_CAU_HOI | 👁️ R |
| FR-03 | DE_KIEM_TRA | 👁️ R |
| FR-03 | KET_QUA_DAO_TAO | 👁️ R |
| FR-03 | CHUNG_NHAN | 👁️ R |
| FR-03 | GIANG_VIEN | 👁️ R |
| FR-03 | DANG_KY_DAO_TAO | 👁️ R |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R |
| FR-04 | TU_VAN_VIEN | 👁️ R |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R |
| FR-04 | DANH_GIA_TU_VAN_VIEN | 👁️ R |
| FR-04 | NGUOI_HO_TRO `[NEW]` | ✅ CRUD |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 👁️ R |
| FR-05 | VU_VIEC | 👁️ R |
| FR-05 | HO_SO_VU_VIEC | 👁️ R |
| FR-05 | KET_QUA_VU_VIEC | 👁️ R |
| FR-06 | HO_SO_CHI_TRA | 👁️ R |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 👁️ R |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | 👁️ R |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | 👁️ R |
| FR-07 | DOANH_NGHIEP | 👁️ R |
| FR-08 | KE_HOACH_DANH_GIA | 👁️ R |
| FR-08 | KET_QUA_DANH_GIA | 👁️ R |
| FR-08 | TIEU_CHI_DANH_GIA | ✅ CRUD |
| FR-08 | BAO_CAO_DANH_GIA | 👁️ R |
| FR-09 | BIEU_MAU | 👁️ R |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R |
| FR-10 | DANH_MUC | ✅ CRUD |
| FR-10 | TAI_KHOAN | ✅ CRUD |
| FR-10 | VAI_TRO | ✅ CRUD |
| FR-10 | QUYEN_HAN | ✅ CRUD |
| FR-10 | DON_VI | ✅ CRUD |
| FR-10 | CAU_HINH_SLA | ✅ CRUD |
| FR-10 | AUDIT_LOG | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — (user chốt bỏ feature) |
| FR-10 | NGAY_LE `[NEW]` | ✅ CRUD |
| FR-11 | BAO_CAO | 👁️ R |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R |
| FR-12 | PHIEN_TU_VAN | 👁️ R |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | 👁️ R |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R |
| FR-13 | KHO_CAU_HOI | 👁️ R |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R |
| FR-15 | CHUONG_TRINH_HTPL | 👁️ R |
| FR-15 | KE_HOACH_CT_HTPL | 👁️ R |
| FR-15 | BAO_CAO_CT_HTPL | 👁️ R |

> QTHT có quyền trên **49 entity** — Read nghiệp vụ + CRUD các entity hệ thống (TIEU_CHI_DANH_GIA + 8 entity QTHT trừ AUDIT_LOG/THONG_BAO là Read). **Update 2026-05-05:** thêm CRUD trên NGUOI_HO_TRO (FR-IV-NHT-01 actor) + NGAY_LE (FR-VIII-29 QTHT only); Read TO_CHUC_TU_VAN (CB NV CRUD theo FR-IV-NEW-01).

---

## 2. CB_NV_TW

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R |
| FR-02 | HOI_DAP | ✅ CRU\*D |
| FR-02 | PHAN_HOI | ✅ CRU* |
| FR-02 | MAU_PHAN_HOI | ✅ CRUD* |
| FR-03 | CHUONG_TRINH_DAO_TAO | ✅ CRUD* |
| FR-03 | KHOA_HOC | ✅ CRUD* |
| FR-03 | BAI_GIANG | ✅ CRUD* |
| FR-03 | NGAN_HANG_CAU_HOI | ✅ CRUD* |
| FR-03 | DE_KIEM_TRA | ✅ CRUD* |
| FR-03 | KET_QUA_DAO_TAO | ✅ CRU* |
| FR-03 | CHUNG_NHAN | ✅ CRU* |
| FR-03 | GIANG_VIEN | ✅ CRUD* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R |
| FR-04 | TU_VAN_VIEN | ✅ CRUD* |
| FR-04 | HO_SO_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | ✅ CRUD* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | ✅ CRUD* |
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | ✅ CRU* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | 👁️ R |
| FR-07 | DOANH_NGHIEP | 📝 RU\*D `[CHANGED 2026-05-05]` |
| FR-08 | KE_HOACH_DANH_GIA | ✅ CRUD* |
| FR-08 | KET_QUA_DANH_GIA | ✅ CRU* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | ✅ CRU* |
| FR-09 | BIEU_MAU | ✅ CRUD* |
| FR-09 | THU_MUC_BIEU_MAU | ✅ CRUD* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> CB_NV_TW **KHÔNG** có quyền trên FR-10 TAI_KHOAN.
> **Update 2026-05-05:** DOANH_NGHIEP đổi từ ✅ CRUD* → 📝 RU\*D — CB NV bỏ quyền **C**reate (FR-VIII-22 self-reg DN-only). Thêm 2 entity FR-04: NGUOI_HO_TRO (FR-IV-NHT-01) + TO_CHUC_TU_VAN (FR-IV-NEW-01).

---

## 3. CB_NV_BN

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R* |
| FR-02 | HOI_DAP | ✅ CRU\*D |
| FR-02 | PHAN_HOI | ✅ CRU* |
| FR-02 | MAU_PHAN_HOI | ✅ CRUD* |
| FR-03 | CHUONG_TRINH_DAO_TAO | ✅ CRUD* |
| FR-03 | KHOA_HOC | ✅ CRUD* |
| FR-03 | BAI_GIANG | ✅ CRUD* |
| FR-03 | NGAN_HANG_CAU_HOI | ✅ CRUD* |
| FR-03 | DE_KIEM_TRA | ✅ CRUD* |
| FR-03 | KET_QUA_DAO_TAO | ✅ CRU* |
| FR-03 | CHUNG_NHAN | ✅ CRU* |
| FR-03 | GIANG_VIEN | ✅ CRUD* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R* |
| FR-04 | TU_VAN_VIEN | ✅ CRUD* |
| FR-04 | HO_SO_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | ✅ CRUD* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | ✅ CRUD* |
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | ✅ CRU* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | 👁️ R |
| FR-07 | DOANH_NGHIEP | 📝 RU\*D `[CHANGED 2026-05-05]` |
| FR-08 | KE_HOACH_DANH_GIA | ✅ CRUD* |
| FR-08 | KET_QUA_DANH_GIA | ✅ CRU* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | ✅ CRU* |
| FR-09 | BIEU_MAU | ✅ CRUD* |
| FR-09 | THU_MUC_BIEU_MAU | ✅ CRUD* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> Khác CB_NV_TW: FR-03 DE_XUAT_DAO_TAO = 👁️ R* (scoped) thay vì 👁️ R (all).
> **Update 2026-05-05:** giống CB_NV_TW — DOANH_NGHIEP bỏ Create + thêm 2 entity FR-04 mới (NGUOI_HO_TRO + TO_CHUC_TU_VAN).

---

## 4. CB_NV_DP

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R* |
| FR-02 | HOI_DAP | ✅ CRU\*D |
| FR-02 | PHAN_HOI | ✅ CRU* |
| FR-02 | MAU_PHAN_HOI | ✅ CRUD* |
| FR-03 | CHUONG_TRINH_DAO_TAO | ✅ CRUD* |
| FR-03 | KHOA_HOC | ✅ CRUD* |
| FR-03 | BAI_GIANG | ✅ CRUD* |
| FR-03 | NGAN_HANG_CAU_HOI | ✅ CRUD* |
| FR-03 | DE_KIEM_TRA | ✅ CRUD* |
| FR-03 | KET_QUA_DAO_TAO | ✅ CRU* |
| FR-03 | CHUNG_NHAN | ✅ CRU* |
| FR-03 | GIANG_VIEN | ✅ CRUD* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R* |
| FR-04 | TU_VAN_VIEN | ✅ CRUD* |
| FR-04 | HO_SO_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | ✅ CRUD* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | ✅ CRUD* |
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | ✅ CRU* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | 👁️ R |
| FR-07 | DOANH_NGHIEP | 📝 RU\*D `[CHANGED 2026-05-05]` |
| FR-08 | KE_HOACH_DANH_GIA | ✅ CRUD* |
| FR-08 | KET_QUA_DANH_GIA | ✅ CRU* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | ✅ CRU* |
| FR-09 | BIEU_MAU | ✅ CRUD* |
| FR-09 | THU_MUC_BIEU_MAU | ✅ CRUD* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | ✅ CRUD* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> Giống CB_NV_BN, data scope giới hạn đơn vị ĐP của mình.
> **Update 2026-05-05:** giống CB_NV_TW/BN — DOANH_NGHIEP bỏ Create + thêm 2 entity FR-04 mới.

---

## 5. CB_PD_TW

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R |
| FR-02 | HOI_DAP | 👁️ R |
| FR-02 | PHAN_HOI | 📝 RU* |
| FR-02 | MAU_PHAN_HOI | 👁️ R* |
| FR-03 | CHUONG_TRINH_DAO_TAO | 📝 RU* |
| FR-03 | KHOA_HOC | 📝 RU* |
| FR-03 | BAI_GIANG | 👁️ R* |
| FR-03 | NGAN_HANG_CAU_HOI | 👁️ R* |
| FR-03 | DE_KIEM_TRA | 👁️ R* |
| FR-03 | KET_QUA_DAO_TAO | 📝 RU* |
| FR-03 | CHUNG_NHAN | 👁️ R* |
| FR-03 | GIANG_VIEN | 👁️ R* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R |
| FR-04 | TU_VAN_VIEN | 📝 RU* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | 👁️ R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 📝 RU* |
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | 👁️ R* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | ✅ CR* (BR-AUTH-05 cùng cấp) |
| FR-07 | DOANH_NGHIEP | 👁️ R* |
| FR-08 | KE_HOACH_DANH_GIA | 📝 RU* |
| FR-08 | KET_QUA_DANH_GIA | 👁️ R* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | 📝 RU* |
| FR-09 | BIEU_MAU | 👁️ R* |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | 👁️ R* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Quyền Update (📝 RU*) của CB_PD = hành động **phê duyệt/từ chối** trong workflow.
> **Update 2026-05-05:** thêm 2 entity FR-04 — NGUOI_HO_TRO 👁️ R* (CB PD chỉ xem, không có workflow phê duyệt NHT theo SM-NHT đơn giản); TO_CHUC_TU_VAN 📝 RU* (FR-IV-NEW-04 phê duyệt TC TV cùng cấp BR-AUTH-05).

---

## 6. CB_PD_BN

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R* |
| FR-02 | HOI_DAP | 👁️ R* |
| FR-02 | PHAN_HOI | 📝 RU* |
| FR-02 | MAU_PHAN_HOI | 👁️ R* |
| FR-03 | CHUONG_TRINH_DAO_TAO | 📝 RU* |
| FR-03 | KHOA_HOC | 📝 RU* |
| FR-03 | BAI_GIANG | 👁️ R* |
| FR-03 | NGAN_HANG_CAU_HOI | 👁️ R* |
| FR-03 | DE_KIEM_TRA | 👁️ R* |
| FR-03 | KET_QUA_DAO_TAO | 📝 RU* |
| FR-03 | CHUNG_NHAN | 👁️ R* |
| FR-03 | GIANG_VIEN | 👁️ R* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R* |
| FR-04 | TU_VAN_VIEN | 📝 RU* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | 👁️ R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 📝 RU* |
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | 👁️ R* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | ✅ CR* (BR-AUTH-05 cùng cấp) |
| FR-07 | DOANH_NGHIEP | 👁️ R* |
| FR-08 | KE_HOACH_DANH_GIA | 📝 RU* |
| FR-08 | KET_QUA_DANH_GIA | 👁️ R* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | 📝 RU* |
| FR-09 | BIEU_MAU | 👁️ R* |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | 👁️ R* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Khác CB_PD_TW: FR-02 HOI_DAP = 👁️ R* (scoped), FR-03 DE_XUAT_DAO_TAO = 👁️ R* (scoped).
> **Update 2026-05-05:** giống CB_PD_TW — thêm NGUOI_HO_TRO 👁️ R* + TO_CHUC_TU_VAN 📝 RU* (FR-IV-NEW-04 phê duyệt cùng cấp BN).

---

## 7. CB_PD_DP

| FR | Entity | Quyền |
|----|--------|-------|
| FR-01 | Dashboard (Nhóm I — view) | 👁️ R* |
| FR-02 | HOI_DAP | 👁️ R* |
| FR-02 | PHAN_HOI | 📝 RU* |
| FR-02 | MAU_PHAN_HOI | 👁️ R* |
| FR-03 | CHUONG_TRINH_DAO_TAO | 📝 RU* |
| FR-03 | KHOA_HOC | 📝 RU* |
| FR-03 | BAI_GIANG | 👁️ R* |
| FR-03 | NGAN_HANG_CAU_HOI | 👁️ R* |
| FR-03 | DE_KIEM_TRA | 👁️ R* |
| FR-03 | KET_QUA_DAO_TAO | 📝 RU* |
| FR-03 | CHUNG_NHAN | 👁️ R* |
| FR-03 | GIANG_VIEN | 👁️ R* |
| FR-03 | DANG_KY_DAO_TAO | 📝 RU* |
| FR-03 | DE_XUAT_DAO_TAO | 👁️ R* |
| FR-04 | TU_VAN_VIEN | 📝 RU* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | 👁️ R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 📝 RU* |
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | THAM_DINH_HO_SO `[NEW v3.5]` | 👁️ R* |
| FR-06 | PHE_DUYET_CHI_TRA `[NEW v3.5]` | ✅ CR* (BR-AUTH-05 cùng cấp) |
| FR-07 | DOANH_NGHIEP | 👁️ R* |
| FR-08 | KE_HOACH_DANH_GIA | 📝 RU* |
| FR-08 | KET_QUA_DANH_GIA | 👁️ R* |
| FR-08 | TIEU_CHI_DANH_GIA | 👁️ R |
| FR-08 | BAO_CAO_DANH_GIA | 📝 RU* |
| FR-09 | BIEU_MAU | 👁️ R* |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | VAI_TRO | 👁️ R |
| FR-10 | QUYEN_HAN | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | CAU_HINH_SLA | 👁️ R |
| FR-10 | AUDIT_LOG | 👁️ R* |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-10 | ~~CAU_HINH_PHAN_CONG~~ `[DEPRECATED 2026-05-06]` | — |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R* |
| FR-12 | TU_LIEU_PHAP_LY_VV `[NEW v3.5]` | 👁️ R* |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Giống CB_PD_BN, data scope giới hạn đơn vị ĐP của mình.
> **Update 2026-05-05:** giống CB_PD_TW/BN — thêm NGUOI_HO_TRO 👁️ R* + TO_CHUC_TU_VAN 📝 RU* (FR-IV-NEW-04 phê duyệt cùng cấp ĐP).

---

## 8. DN (Doanh nghiệp)

| FR | Entity | Quyền |
|----|--------|-------|
| FR-02 | HOI_DAP | 🔌 C† |
| FR-03 | CHUONG_TRINH_DAO_TAO | 👁️ R |
| FR-03 | KHOA_HOC | 👁️ R |
| FR-03 | BAI_GIANG | 👁️ R |
| FR-03 | KET_QUA_DAO_TAO | 👁️ R* |
| FR-03 | CHUNG_NHAN | 👁️ R* |
| FR-03 | DANG_KY_DAO_TAO | 🔌 C†R* |
| FR-03 | DE_XUAT_DAO_TAO | 🔌 C†RU* |
| FR-04 | DANH_GIA_TU_VAN_VIEN | 🔌 C†R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 👁️ R |
| FR-05 | VU_VIEC | 👁️ R* |
| FR-05 | HO_SO_VU_VIEC | 🔌 C†R* |
| FR-05 | KET_QUA_VU_VIEC | 👁️ R* |
| FR-06 | HO_SO_CHI_TRA | 🔌 C†RU* `[CHANGED v3.5]` (Create qua DVC FR-V.II-01; Update file_bo_sung[] qua FR-V.II-14 khi YEU_CAU_BO_SUNG ≤5 ngày LV; Update rút HS qua FR-V.II-02 [GAP-V.II-03]) |
| FR-07 | DOANH_NGHIEP | 🔌 C†RU* `[CHANGED 2026-05-05]` |
| FR-09 | BIEU_MAU | 👁️ R |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 🔌 C†R* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 👁️ R* (own DN's HSPL via portal) |
| FR-12 | DANH_GIA_CHAT_LUONG_TV `[NEW v3.5]` | 🔌 C† (DN gửi điểm + nhận xét qua API Cổng PLQG sau DA_DUYET — UC153) |
| FR-13 | KHO_CAU_HOI | 👁️ R |

> DN **KHÔNG truy cập CMS trực tiếp** — các quyền 🔌 C† / C†R* / C†RU* thực hiện qua **API inbound** từ Cổng PLQG (SI-04, Nhóm XII). Quyền Read CMS (👁️ R / R*) là các entity DN xem qua portal doanh nghiệp.
> **Update 2026-05-05:** DOANH_NGHIEP đổi từ 📝 RU* → 🔌 C†RU* — thêm Create qua FR-VIII-22 self-reg API (DN tự đăng ký từ login page button). Thêm TO_CHUC_TU_VAN 👁️ R public (TC TV `cong_khai=1` hiển thị trên Cổng PLQG cho DN tra cứu khi chọn TC).

---

## 9. NHT

| FR | Entity | Quyền |
|----|--------|-------|
| FR-03 | CHUONG_TRINH_DAO_TAO | 👁️ R |
| FR-03 | KHOA_HOC | 👁️ R |
| FR-03 | BAI_GIANG | 👁️ R |
| FR-03 | KET_QUA_DAO_TAO | 👁️ R* |
| FR-03 | CHUNG_NHAN | 👁️ R* |
| FR-03 | DANG_KY_DAO_TAO | 🔌 C†R* |
| FR-03 | DE_XUAT_DAO_TAO | 🔌 C†RU* |
| FR-04 | HO_SO_TU_VAN_VIEN | ✅ CRU* |
| FR-04 | NGUOI_HO_TRO `[NEW]` | 📝 RU* (own) |
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRU* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-09 | BIEU_MAU | 👁️ R |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | HO_SO_PHAP_LY_DN `[NEW v3.5]` | 📝 RU* (scoped theo VV được phân công cho NHT trong cơ quan của mình — Thay đổi 10) |

> NHT là role duy nhất (ngoài CB_NV) có quyền 📝 RU* trên VU_VIEC và ✅ CRU* trên HO_SO_VU_VIEC / KET_QUA_VU_VIEC.
> **Update 2026-05-05:** NHT giờ là entity nội bộ riêng (NGUOI_HO_TRO, NĐ 55/2019 Đ.7) — NHT có 📝 RU* trên hồ sơ NHT của chính mình (own scope, FR-IV-NHT-03 xem hồ sơ + cập nhật chứng chỉ HTPL). KHÔNG có quyền CRUD NHT khác — đó là quyền của QTHT/CB_NV.

---

## 10. TVV

| FR | Entity | Quyền |
|----|--------|-------|
| FR-04 | TU_VAN_VIEN | 👁️ R* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 👁️ R |
| FR-06 | HO_SO_CHI_TRA | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |

> ⚠️ TVV **KHÔNG** có quyền trên 3 entity Vụ việc (VU_VIEC / HO_SO_VU_VIEC / KET_QUA_VU_VIEC). Đừng nhầm với NHT.
> **Update 2026-05-05:** thêm TO_CHUC_TU_VAN 👁️ R — TVV xem dropdown TC TV khi chọn `to_chuc_chinh_id` lúc đăng ký + xem TC TV công khai.

---

## 11. CG

| FR | Entity | Quyền |
|----|--------|-------|
| FR-04 | TU_VAN_VIEN | 👁️ R* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-04 | TO_CHUC_TU_VAN `[NEW]` | 👁️ R |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRU* |
| FR-12 | PHIEN_TU_VAN | 📝 RU* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |

> CG tập trung vào FR-12 (Tư vấn Chuyên sâu) với quyền CRU* trên TU_VAN_CHUYEN_SAU và LICH_SU_TRAO_DOI_TV.
> **Update 2026-05-05:** thêm TO_CHUC_TU_VAN 👁️ R (giống TVV).

---

## Ghi chú FR không có entity trong SRS §3.4.2

- **FR-01 — Dashboard** (SRS §3.2.3, Nhóm I): Dashboard là view tổng hợp data từ các entity nghiệp vụ (HOI_DAP, VU_VIEC, KHOA_HOC, TU_VAN_VIEN, KET_QUA_DANH_GIA, KET_QUA_DAO_TAO, CAU_HINH_SLA). Read-only, không có CUD, auto-refresh 60s, click drill-down. **Chỉ CB_NV (TW/BN/ĐP) + CB_PD (TW/BN/ĐP)** có quyền truy cập (đã thêm dòng "Dashboard (Nhóm I — view)" vào bảng 6 role này). **QTHT, DN, TVV, CG, NHT** không được SRS §3.2.3 liệt kê làm tác nhân Dashboard. Scoping: TW thấy toàn quốc (👁️ R), BN/ĐP scoped theo đơn vị (👁️ R*) — tuân BR-AUTH-03, BR-AUTH-04, BR-AUTH-08.
- **FR-13 — Tư vấn Nhanh** (SRS §3.2.13, Nhóm X.2): Entity chính là **KHO_CAU_HOI** (đã được gán lại nhãn FR-13 trong các bảng role — trước đó file placeholder gán nhầm FR-12). Phân quyền xem cột `FR-13 | KHO_CAU_HOI` trong bảng QTHT / CB_NV×3 / CB_PD×3 / DN. TVV, CG, NHT hoàn toàn không có quyền (ký hiệu `—` trong SRS §3.4.2).
- **FR-16 — API Kết nối Chia sẻ Dữ liệu** (SRS §3.2.16, Nhóm XII, UC171-190, 18 FR outbound): **Không có màn hình CMS**, chỉ cung cấp 18 API outbound (9 cặp Chia sẻ + Tìm kiếm) cho Cổng PLQG qua REST JSON trực tiếp + mTLS + JWT RS256. Tác nhân Consumer là **system actor (Cổng PLQG / Hệ thống khác)**, không phải role CMS. QTHT **giám sát** qua Dashboard KPI (FR-01) + AUDIT_LOG (FR-10) + Grafana/Prometheus, không có quyền CRUD API trên CMS. DN / NHT / Người dân gián tiếp qua chuyên trang Cổng PLQG — các quyền 🔌 C† / 🔌 C†R* / 🔌 C†RU* trên entity của module khác (HOI_DAP, HO_SO_VU_VIEC, HO_SO_CHI_TRA, DANH_GIA_TU_VAN_VIEN, LICH_SU_TRAO_DOI_TV, DANG_KY_DAO_TAO, DE_XUAT_DAO_TAO) đã bao gồm quyền API inbound của DN + NHT. Test phân quyền API nên cover **luồng API inbound** chứ không phải entity riêng.

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
