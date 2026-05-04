# Ma trận phân quyền CRUD — FR × Entity × Role

> **Nguồn:** SRS v3.1 §3.4.2 — Ma trận phân quyền CRUD (Permission Matrix)
> **Ngày trích:** 2026-04-16 | **Cập nhật 2026-04-21:** bổ sung Dashboard (FR-01) cho CB_NV/CB_PD + KHO_CAU_HOI chuyển FR-12 → FR-13 (xác nhận qua NotebookLM SRS §3.2.13)
> **View đối ứng:** [permission-matrix.md](permission-matrix.md) (Role × Entity)
> **Tổng entity SRS §3.4.2:** 46 entity | **Role:** 11
> **Ghi chú:** FR-01 Dashboard là *view* (tổng hợp data từ các entity khác), không phải entity trong §3.4.2 — thêm dòng "Dashboard (Nhóm I — view)" để đối chiếu test quyền truy cập.

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

## 2. FR-02 — Hỏi đáp Pháp lý

> **SRS §3.2.2, Nhóm II** | 3 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HOI_DAP | 👁️ R | ✅ CRU\*D | ✅ CRU\*D | ✅ CRU\*D | 👁️ R | 👁️ R* | 👁️ R* | 🔌 C† | ❌ | ❌ | ❌ |
| PHAN_HOI | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| MAU_PHAN_HOI | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |

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

## 4. FR-04 — Chuyên gia / Tư vấn viên

> **SRS §3.2.4 (Nhóm IV)** | 3 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| TU_VAN_VIEN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | 👁️ R* | 👁️ R* |
| HO_SO_TU_VAN_VIEN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ✅ CRU* | 👁️ R* | 👁️ R* |
| DANH_GIA_TU_VAN_VIEN | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | ✅ CRU* | 🔌 C†R* | ❌ | ❌ | ❌ |

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

> **SRS §3.2.6 (Nhóm VI)** | 2 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| HO_SO_CHI_TRA | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 🔌 C†R* | ❌ | 👁️ R* | ❌ |
| DANH_GIA_HO_SO_CHI_TRA | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

---

## 7. FR-07 — Doanh nghiệp

> **SRS §3.2.7 (Nhóm VII)** | 1 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| DOANH_NGHIEP | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 📝 RU* | ❌ | ❌ | ❌ |

---

## 8. FR-08 — Đánh giá Hiệu quả Hỗ trợ

> **SRS §3.2.8 (Nhóm VIII.2)** | 4 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| KE_HOACH_DANH_GIA | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |
| KET_QUA_DANH_GIA | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| TIEU_CHI_DANH_GIA | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| BAO_CAO_DANH_GIA | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

---

## 9. FR-09 — Biểu mẫu

> **SRS §3.2.9 (Nhóm VII — BIEU_MAU + THU_MUC_BIEU_MAU)** | 2 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| BIEU_MAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |
| THU_MUC_BIEU_MAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R | 👁️ R | ❌ | ❌ |

---

## 10. FR-10 — Quản trị Hệ thống (QTHT)

> **SRS §3.2.10 (Nhóm VIII)** | 9 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| DANH_MUC | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R |
| TAI_KHOAN | ✅ CRUD | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| VAI_TRO | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| QUYEN_HAN | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| DON_VI | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R |
| CAU_HINH_SLA | ✅ CRUD | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | 👁️ R | ❌ | ❌ | ❌ | ❌ |
| AUDIT_LOG | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |
| THONG_BAO | 👁️ R | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* |
| CAU_HINH_PHAN_CONG | ✅ CRUD | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | ❌ | ❌ | ❌ |

---

## 11. FR-11 — Báo cáo Thống kê

> **SRS §3.2.11 (Nhóm VII — BAO_CAO)** | 1 entity

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| BAO_CAO | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 📝 RU* | 📝 RU* | 📝 RU* | ❌ | ❌ | ❌ | ❌ |

---

## 12. FR-12 — Tư vấn Chuyên sâu

> **SRS §3.2.12 (Nhóm X.1)** | 3 entity (KHO_CAU_HOI đã chuyển sang FR-13)

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|------|----------|----------|----------|----------|----------|----------|----|-----|-----|----|
| TU_VAN_CHUYEN_SAU | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 📝 RU* | 📝 RU* | 📝 RU* | 👁️ R* | ❌ | 👁️ R* | ✅ CRU* |
| PHIEN_TU_VAN | 👁️ R | ✅ CRUD* | ✅ CRUD* | ✅ CRUD* | 👁️ R* | 👁️ R* | 👁️ R* | 👁️ R* | ❌ | 👁️ R* | 📝 RU* |
| LICH_SU_TRAO_DOI_TV | 👁️ R | ✅ CRU* | ✅ CRU* | ✅ CRU* | 👁️ R* | 👁️ R* | 👁️ R* | 🔌 C†R* | ❌ | ❌ | ✅ CRU* |

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
