# 3.4.2 Ma trận phân quyền CRUD (Permission Matrix)

> **Nguồn:** Trích từ `input/srs-v3/srs-v3.md` mục 3.4.2 (line 1050–1116).
> **Mục đích:** Giữ bản raw tham chiếu để đối chiếu với `output/permission-matrix.md` (v3.1) và `output/ma-tran-nguoi/Ma-tran-Phan-quyen.md` (v2.1).

**Ký hiệu:** C=Create, R=Read (toàn bộ phạm vi), R*=Read scoped (chỉ đơn vị mình), U=Update, D=Delete (soft), —=No access

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HOI_DAP | R | CRU*D | CRU*D | CRU*D | R | R* | R* | C† | — | — | — |
| PHAN_HOI | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | — | — | — | — |
| MAU_PHAN_HOI | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | — | — | — | — |
| CHUONG_TRINH_DAO_TAO | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | R | R | — | — |
| KHOA_HOC | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | R | R | — | — |
| BAI_GIANG | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | R | R | — | — |
| NGAN_HANG_CAU_HOI | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | — | — | — | — |
| DE_KIEM_TRA | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | — | — | — | — |
| KET_QUA_DAO_TAO | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | R* | R* | — | — |
| CHUNG_NHAN | R | CRU* | CRU* | CRU* | R* | R* | R* | R* | R* | — | — |
| GIANG_VIEN | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | — | — | — | — |
| DANG_KY_DAO_TAO | R | RU* | RU* | RU* | RU* | RU* | RU* | C†R* | C†R* | — | — |
| DE_XUAT_DAO_TAO | R | R | R* | R* | R | R* | R* | C†RU* | C†RU* | — | — |
| TU_VAN_VIEN | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | — | — | R* | R* |
| HO_SO_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | R* | R* | R* | — | CRU* | R* | R* |
| DANH_GIA_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | CRU* | CRU* | CRU* | C†R* | — | — | — |
| VU_VIEC | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | R* | RU* | — | — |
| HO_SO_VU_VIEC | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | C†R* | CRU* | — | — |
| KET_QUA_VU_VIEC | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | R* | CRU* | — | — |
| HO_SO_CHI_TRA | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | C†R* | — | R* | — |
| DANH_GIA_HO_SO_CHI_TRA | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | — | — | — | — |
| DOANH_NGHIEP | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | RU* | — | — | — |
| KE_HOACH_DANH_GIA | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | — | — | — | — |
| KET_QUA_DANH_GIA | R | CRU* | CRU* | CRU* | R* | R* | R* | — | — | — | — |
| TIEU_CHI_DANH_GIA | CRUD | R | R | R | R | R | R | — | — | — | — |
| BAO_CAO_DANH_GIA | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | — | — | — | — |
| BIEU_MAU | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | R | R | — | — |
| THU_MUC_BIEU_MAU | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | R | R | — | — |
| DANH_MUC | CRUD | R | R | R | R | R | R | R | R | R | R |
| TAI_KHOAN | CRUD | — | — | — | — | — | — | — | — | — | — |
| VAI_TRO | CRUD | R | R | R | R | R | R | — | — | — | — |
| QUYEN_HAN | CRUD | R | R | R | R | R | R | — | — | — | — |
| DON_VI | CRUD | R | R | R | R | R | R | R | R | R | R |
| CAU_HINH_SLA | CRUD | R | R | R | R | R | R | — | — | — | — |
| BAO_CAO | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | — | — | — | — |
| TU_VAN_CHUYEN_SAU | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | R* | — | R* | CRU* |
| PHIEN_TU_VAN | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | R* | — | R* | RU* |
| LICH_SU_TRAO_DOI_TV | R | CRU* | CRU* | CRU* | R* | R* | R* | C†R* | — | — | CRU* |
| KHO_CAU_HOI | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | R | — | — | — |
| HOP_DONG_TU_VAN | R | CRUD* | CRUD* | CRUD* | R* | R* | R* | — | — | R* | — |
| CHUONG_TRINH_HTPL | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | — | — | — | — |
| KE_HOACH_CT_HTPL | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | — | — | — | — |
| BAO_CAO_CT_HTPL | R | CRU* | CRU* | CRU* | RU* | RU* | RU* | — | — | — | — |
| AUDIT_LOG | R | R* | R* | R* | R* | R* | R* | — | — | — | — |
| THONG_BAO | R | R* | R* | R* | R* | R* | R* | R* | R* | R* | R* |
| CAU_HINH_PHAN_CONG | CRUD | CRU* | CRU* | CRU* | R* | R* | R* | — | — | — | — |

**Quy tắc scoping (R*):**
- **TW (Trung ương):** Nhìn thấy dữ liệu TẤT CẢ đơn vị (toàn quốc)
- **BN (Bộ ngành):** Chỉ nhìn thấy dữ liệu đơn vị BN của mình
- **ĐP (Địa phương):** Chỉ nhìn thấy dữ liệu đơn vị ĐP của mình
- **Ngang cấp KHÔNG thấy nhau** — chính sách phân quyền dữ liệu đảm bảo chỉ thấy dữ liệu đơn vị mình

> † DN không truy cập CMS trực tiếp. Quyền Create/Read của DN thực hiện qua API inbound từ Cổng PLQG (SI-04, Nhóm XII). Permission Matrix ghi nhận quyền LOGIC, không phải quyền CMS UI.

> **Tham chiếu:** PRD Section 4 (Personas), PRD Section 5 (Assumptions A3/A4), FR-VIII-16/17

**Trạng thái:** ✅ CĐT xác nhận (quy tắc phân cấp) | 🟡 Đề xuất (chi tiết CRUD per entity)
