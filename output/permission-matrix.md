# Ma trận phân quyền CRUD — Role × Entity

> **Nguồn:** SRS v3.1 §3.4.2 — Ma trận phân quyền CRUD (Permission Matrix)
> **Ngày trích:** 2026-04-16 | **Refactor:** 2026-04-19 — sắp xếp theo FR-01 → FR-16 | **Refactor 2026-04-21** — xoay 90° thành Role × Entity (view theo từng role) + bổ sung Dashboard (FR-01) cho CB_NV/CB_PD + đổi nhãn KHO_CAU_HOI FR-12 → FR-13 (xác nhận qua NotebookLM SRS §3.2.13)
> **Dùng cho:** [test-strategy.md](test-strategy.md) §5.1
> **Tổng entity SRS §3.4.2:** 46 entity | **Role:** 11

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
| FR-05 | VU_VIEC | 👁️ R |
| FR-05 | HO_SO_VU_VIEC | 👁️ R |
| FR-05 | KET_QUA_VU_VIEC | 👁️ R |
| FR-06 | HO_SO_CHI_TRA | 👁️ R |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 👁️ R |
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
| FR-10 | CAU_HINH_PHAN_CONG | ✅ CRUD |
| FR-11 | BAO_CAO | 👁️ R |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R |
| FR-12 | PHIEN_TU_VAN | 👁️ R |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R |
| FR-13 | KHO_CAU_HOI | 👁️ R |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R |
| FR-15 | CHUONG_TRINH_HTPL | 👁️ R |
| FR-15 | KE_HOACH_CT_HTPL | 👁️ R |
| FR-15 | BAO_CAO_CT_HTPL | 👁️ R |

> QTHT có quyền trên **toàn bộ 46 entity** — Read nghiệp vụ + CRUD các entity hệ thống (TIEU_CHI_DANH_GIA + 7 entity QTHT trừ AUDIT_LOG/THONG_BAO là Read).

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
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-07 | DOANH_NGHIEP | ✅ CRUD* |
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
| FR-10 | CAU_HINH_PHAN_CONG | ✅ CRU* |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> CB_NV_TW **KHÔNG** có quyền trên FR-10 TAI_KHOAN.

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
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-07 | DOANH_NGHIEP | ✅ CRUD* |
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
| FR-10 | CAU_HINH_PHAN_CONG | ✅ CRU* |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> Khác CB_NV_TW: FR-03 DE_XUAT_DAO_TAO = 👁️ R* (scoped) thay vì 👁️ R (all).

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
| FR-05 | VU_VIEC | ✅ CRUD* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRUD* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-06 | HO_SO_CHI_TRA | ✅ CRUD* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | ✅ CRU* |
| FR-07 | DOANH_NGHIEP | ✅ CRUD* |
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
| FR-10 | CAU_HINH_PHAN_CONG | ✅ CRU* |
| FR-11 | BAO_CAO | ✅ CRU* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRUD* |
| FR-12 | PHIEN_TU_VAN | ✅ CRUD* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |
| FR-13 | KHO_CAU_HOI | ✅ CRUD* |
| FR-14 | HOP_DONG_TU_VAN | ✅ CRUD* |
| FR-15 | CHUONG_TRINH_HTPL | ✅ CRUD* |
| FR-15 | KE_HOACH_CT_HTPL | ✅ CRUD* |
| FR-15 | BAO_CAO_CT_HTPL | ✅ CRU* |

> Giống CB_NV_BN, data scope giới hạn đơn vị ĐP của mình.

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
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
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
| FR-10 | CAU_HINH_PHAN_CONG | 👁️ R* |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Quyền Update (📝 RU*) của CB_PD = hành động **phê duyệt/từ chối** trong workflow.

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
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
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
| FR-10 | CAU_HINH_PHAN_CONG | 👁️ R* |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Khác CB_PD_TW: FR-02 HOI_DAP = 👁️ R* (scoped), FR-03 DE_XUAT_DAO_TAO = 👁️ R* (scoped).

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
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | 👁️ R* |
| FR-05 | KET_QUA_VU_VIEC | 📝 RU* |
| FR-06 | HO_SO_CHI_TRA | 📝 RU* |
| FR-06 | DANH_GIA_HO_SO_CHI_TRA | 📝 RU* |
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
| FR-10 | CAU_HINH_PHAN_CONG | 👁️ R* |
| FR-11 | BAO_CAO | 📝 RU* |
| FR-12 | TU_VAN_CHUYEN_SAU | 📝 RU* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 👁️ R* |
| FR-13 | KHO_CAU_HOI | 📝 RU* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |
| FR-15 | CHUONG_TRINH_HTPL | 📝 RU* |
| FR-15 | KE_HOACH_CT_HTPL | 📝 RU* |
| FR-15 | BAO_CAO_CT_HTPL | 📝 RU* |

> Giống CB_PD_BN, data scope giới hạn đơn vị ĐP của mình.

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
| FR-05 | VU_VIEC | 👁️ R* |
| FR-05 | HO_SO_VU_VIEC | 🔌 C†R* |
| FR-05 | KET_QUA_VU_VIEC | 👁️ R* |
| FR-06 | HO_SO_CHI_TRA | 🔌 C†R* |
| FR-07 | DOANH_NGHIEP | 📝 RU* |
| FR-09 | BIEU_MAU | 👁️ R |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-12 | LICH_SU_TRAO_DOI_TV | 🔌 C†R* |
| FR-13 | KHO_CAU_HOI | 👁️ R |

> DN **KHÔNG truy cập CMS trực tiếp** — các quyền 🔌 C† / C†R* / C†RU* thực hiện qua **API inbound** từ Cổng PLQG (SI-04, Nhóm XII). Quyền Read CMS (👁️ R / R*) là các entity DN xem qua portal doanh nghiệp.

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
| FR-05 | VU_VIEC | 📝 RU* |
| FR-05 | HO_SO_VU_VIEC | ✅ CRU* |
| FR-05 | KET_QUA_VU_VIEC | ✅ CRU* |
| FR-09 | BIEU_MAU | 👁️ R |
| FR-09 | THU_MUC_BIEU_MAU | 👁️ R |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |

> NHT là role duy nhất (ngoài CB_NV) có quyền 📝 RU* trên VU_VIEC và ✅ CRU* trên HO_SO_VU_VIEC / KET_QUA_VU_VIEC.

---

## 10. TVV

| FR | Entity | Quyền |
|----|--------|-------|
| FR-04 | TU_VAN_VIEN | 👁️ R* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-06 | HO_SO_CHI_TRA | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | 👁️ R* |
| FR-12 | PHIEN_TU_VAN | 👁️ R* |
| FR-14 | HOP_DONG_TU_VAN | 👁️ R* |

> ⚠️ TVV **KHÔNG** có quyền trên 3 entity Vụ việc (VU_VIEC / HO_SO_VU_VIEC / KET_QUA_VU_VIEC). Đừng nhầm với NHT.

---

## 11. CG

| FR | Entity | Quyền |
|----|--------|-------|
| FR-04 | TU_VAN_VIEN | 👁️ R* |
| FR-04 | HO_SO_TU_VAN_VIEN | 👁️ R* |
| FR-10 | DANH_MUC | 👁️ R |
| FR-10 | DON_VI | 👁️ R |
| FR-10 | THONG_BAO | 👁️ R* |
| FR-12 | TU_VAN_CHUYEN_SAU | ✅ CRU* |
| FR-12 | PHIEN_TU_VAN | 📝 RU* |
| FR-12 | LICH_SU_TRAO_DOI_TV | ✅ CRU* |

> CG tập trung vào FR-12 (Tư vấn Chuyên sâu) với quyền CRU* trên TU_VAN_CHUYEN_SAU và LICH_SU_TRAO_DOI_TV.

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
