# Tổng quan hệ thống PM HTPLDN

> Tài liệu mô tả toàn bộ phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM HTPLDN). Đối tượng đọc: QA mới onboard, PM, BA, dev cần nắm bức tranh tổng thể.
>
> Cần test thực tế đi kèm thứ tự seed data + ràng buộc nhân quả → đọc [plan.md](plan.md).

**Ngày viết:** 2026-04-25 · **Phiên bản:** v1.2 (merge nốt phần unique của `logic-data.md` → archive file gốc)
**Nguồn:** consolidate từ `input/srs-v3/` (17 file SRS) + `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` + `input/flow-module.md` + `logic-data.md` (đã archive 25/04, nội dung consolidate hết vào file này).

---

## Mục lục dòng (line index) — cập nhật khi thêm/xóa section

| Dòng | Mục |
|---|---|
| 54-70 | [§1. PM HTPLDN làm gì?](#1-pm-htpldn-làm-gì) |
| 72-92 | [§2. Ai dùng — 11 vai trò nghiệp vụ × 3 cấp](#2-ai-dùng--11-vai-trò-nghiệp-vụ--3-cấp--1-os-super-user) |
| 94-131 | [§3. 5 LỚP DATA — luồng chảy](#3-5-lớp-data--luồng-chảy-của-hệ-thống) |
| 133-567 | [§4. Bản đồ 16 module SRS (18 đơn vị test)](#4-bản-đồ-16-module-srs-18-đơn-vị-test--50-màn-hình--tab-chi-tiết) |
| 135-158 | — [§4.1 Bảng tổng 16 module / 18 đơn vị test](#41-bảng-tổng--16-module-srs--18-đơn-vị-test) |
| 160-229 | — [§4.2 M1 Quản trị hệ thống (SCR-VIII)](#42-module-1--quản-trị-hệ-thống-10-màn-hình-scr-viii) |
| 231-250 | — [§4.3 M2 Doanh nghiệp (SCR-V.III)](#43-module-2--doanh-nghiệp-3-màn-scr-viii) |
| 252-276 | — [§4.4 M3 Chuyên gia/TVV (SCR-IV)](#44-module-3--chuyên-giatư-vấn-viên-3-màn-scr-iv) |
| 278-300 | — [§4.5 M4 Biểu mẫu (SCR-VII)](#45-module-4--biểu-mẫu-3-màn-scr-vii) |
| 302-310 | — [§4.6 M5 CT HTPLDN GĐ1 (SCR-XI-01 Tab Info)](#46-module-5--ct-htpldn-gđ1-kế-hoạch-scr-xi-01-tab-thông-tin) |
| 312-342 | — [§4.7 M6 Vụ việc (SCR-V.I)](#47-module-6--vụ-việc-3-màn-scr-vi) |
| 344-370 | — [§4.8 M7 Hỏi đáp (SCR-II)](#48-module-7--hỏi-đáp-3-màn-scr-ii) |
| 372-390 | — [§4.9 M8 Tư vấn chuyên sâu (SCR-X1)](#49-module-8--tư-vấn-chuyên-sâu-2-màn-scr-x1) |
| 392-421 | — [§4.10 M9 Đào tạo (SCR-III, 4 sub-menu)](#410-module-9--đào-tạo-5-màn-scr-iii-4-sub-menu) |
| 423-437 | — [§4.11 M10 Hợp đồng tư vấn (SCR-X3-01)](#411-module-10--hợp-đồng-tư-vấn-scr-x3-01) |
| 439-472 | — [§4.12 M11 Chi trả (SCR-V.II)](#412-module-11--chi-trả-2-màn-scr-vii) |
| 474-492 | — [§4.13 M12 Đánh giá HQ (SCR-VI-01)](#413-module-12--đánh-giá-hq-scr-vi-01-consolidated-v21) |
| 494-506 | — [§4.14 M13 TV nhanh Phiên (SCR-X2-03)](#414-module-13--tư-vấn-nhanh-phiên-scr-x2-03) |
| 508-520 | — [§4.15 M14 Kho Q&A (SCR-X2-01)](#415-module-14--kho-qa-scr-x2-01) |
| 522-532 | — [§4.16 M15 CT HTPLDN GĐ2 Đợt BC (SCR-XI-01 Tab 2)](#416-module-15--ct-htpldn-gđ2-đợt-bc-scr-xi-01-tab-2) |
| 534-544 | — [§4.17 M16 Báo cáo 23 loại (SCR-IX-01)](#417-module-16--báo-cáo-23-loại-scr-ix-01) |
| 546-556 | — [§4.18 M17 Dashboard (SCR-I-01)](#418-module-17--dashboard-scr-i-01--9-kpi--2-chart) |
| 558-567 | — [§4.19 M18 API kết nối (FR-16, no UI)](#419-module-18--api-kết-nối-fr-16-không-ui) |
| 569-645 | [§5. ⭐ Bảng nguồn dropdown 30+](#5--bảng-nguồn-dropdown--30-dropdown-chính) |
| 573-586 | — [§5.1 Dropdown danh mục (DM dùng chung)](#51-dropdown-danh-mục-lấy-từ-dm-dùng-chung--qtht-setup-ở-lớp-1) |
| 588-613 | — [§5.2 Dropdown entity nghiệp vụ](#52-dropdown-entity-nghiệp-vụ) |
| 615-625 | — [§5.3 Dropdown auto / system-driven](#53-dropdown-auto--system-driven) |
| 627-645 | — [§5.4 Bảng FR-code prereq](#54-bảng-fr-code-prereq--dùng-khi-viết-test-plan) |
| 647-669 | [§6. Quy ước thuật ngữ](#6-quy-ước-thuật-ngữ--bản-dịch-dễ-hiểu) |
| 671-683 | [§7. ⚠️ 5 mâu thuẫn cần BA xác nhận](#7-⚠️-5-mâu-thuẫn-cần-ba-xác-nhận) |
| 685-713 | [§8. Module nhập tay vs không nhập tay](#8-module-nào-nhập-tay-được-module-nào-không) |
| 715-734 | [§9. Bản đồ tab/màn hình nào cần data nào](#9-bản-đồ-tabmàn-hình-nào-cần-data-nào--tra-nhanh-khi-seed) |
| 736-751 | [§10. Khi gặp tab/màn hình rỗng — phân loại](#10-khi-gặp-tabmàn-hình-rỗng--phân-loại-theo-thứ-tự) |
| 753-766 | [§11. Tham chiếu](#11-tham-chiếu) |
| 768-788 | [§12. Lịch sử thay đổi](#12-lịch-sử-thay-đổi) |

---

## 1. PM HTPLDN làm gì?

Phần mềm CMS giúp Bộ Tư pháp + Sở Tư pháp tỉnh/thành quản lý hoạt động hỗ trợ pháp lý cho Doanh nghiệp Nhỏ và Vừa (DNNVV) theo NĐ55/2019 + TT64/2021 + TT17/2025.

**5 nhóm hoạt động chính DN nhận được hỗ trợ:**
1. Hỏi đáp pháp lý (gửi câu hỏi, cán bộ trả lời)
2. Vụ việc trợ giúp pháp lý (DN gặp vấn đề pháp lý cụ thể, được phân công Tư vấn viên xử lý)
3. Tư vấn chuyên sâu (Chuyên gia tư vấn 1-1)
4. Đào tạo, tập huấn (DN/nhân viên DN tham gia khóa học)
5. Tư vấn nhanh (chatbot Q&A)

**3 nhóm hoạt động phía sau (DN không thấy):**
6. Chi trả chi phí cho TVV/Chuyên gia
7. Đánh giá hiệu quả định kỳ (TT17)
8. Báo cáo + Dashboard cho lãnh đạo

---

## 2. Ai dùng — 11 vai trò nghiệp vụ × 3 cấp (+ 1 OS super-user)

| # | Vai trò | Cấp | Ai trong thực tế | Việc chính |
|---|---|---|---|---|
| 1 | `qtht` | TW | Quản trị hệ thống | Setup tài khoản, danh mục, đơn vị, cấu hình SLA + phân công mặc định |
| 2 | `cb_nv_tw` | TW | Cán bộ nghiệp vụ Trung ương (Bộ Tư pháp) | Tạo vụ việc, hỏi đáp, tư vấn chuyên sâu, đào tạo cấp TW |
| 3 | `cb_nv_bn` | Bộ ngành | Cán bộ nghiệp vụ Bộ ngành (BKH/BTC/BCT) | Như TW nhưng scope Bộ ngành |
| 4 | `cb_nv_dp` | Địa phương | Cán bộ nghiệp vụ Sở Tư pháp tỉnh | Như TW nhưng scope tỉnh |
| 5 | `cb_pd_tw` | TW | Cán bộ phê duyệt TW | Duyệt vụ việc, hỏi đáp, chi trả, khóa học cấp TW |
| 6 | `cb_pd_bn` | Bộ ngành | Cán bộ phê duyệt Bộ ngành | Duyệt scope Bộ ngành |
| 7 | `cb_pd_dp` | Địa phương | Cán bộ phê duyệt Sở Tư pháp | Duyệt scope tỉnh |
| 8 | `cg` | — | Chuyên gia | Nhận yêu cầu tư vấn chuyên sâu từ DN |
| 9 | `tvv` | — | Tư vấn viên | Xử lý vụ việc được CB NV phân công |
| 10 | `nht` | — | Tổ chức/Nhóm hỗ trợ | Đứng tên tổ chức tư vấn (ít dùng trực tiếp) |
| — | `admin` | TW | Super admin (OS, ngoài SRS) | Toàn quyền — KHÔNG phải vai trò nghiệp vụ trong SRS §2.3, chỉ tồn tại trong `users.csv` để vận hành |

**Quan hệ phê duyệt:** CB NV cấp X **chỉ duyệt được bởi** CB PD cùng cấp X (BR-AUTH-05). TW không duyệt cho ĐP, BN không duyệt cho TW.

**Fallback tài khoản test:** mỗi vai trò có 3 tài khoản `_01` (chính) / `_02` (dự phòng) / `_03` (test phân quyền). Nguồn: `input/users.csv`.

---

## 3. 5 LỚP DATA — luồng chảy của hệ thống

Đây là kiến thức nền tảng quan trọng nhất. Hiểu được sơ đồ này thì biết test cái gì trước, cái gì sau.

```
┌────────────────────────────────────────────────────────────────┐
│ LỚP 1 — QUẢN TRỊ NỀN TẢNG (qtht_01 setup)                      │
│   Danh mục dùng chung · Đơn vị 3 cấp · Tài khoản · SLA          │
│   · Phân công mặc định (Đợt 1 CB) · Tiêu chí Đánh giá HQ        │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│ LỚP 2 — DỮ LIỆU GỐC (master data — actor + tài liệu nền)       │
│   Doanh nghiệp · Tư vấn viên/Chuyên gia · Biểu mẫu              │
│   · Chương trình HTPLDN GĐ1 (kế hoạch)                          │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│ LỚP 3 — GIAO DỊCH LÕI (ghi nhận yêu cầu hỗ trợ)                │
│   Vụ việc · Hỏi đáp · Tư vấn chuyên sâu · Đào tạo (4 sub)       │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│ LỚP 4 — HẬU KỲ (sau khi LỚP 3 có state cuối)                   │
│   Hợp đồng tư vấn · Chi trả · Đánh giá HQ · Tư vấn nhanh        │
│   (Phiên + Kho QA)                                              │
└────────────────────────────────┬───────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────┐
│ LỚP 5 — ĐẦU RA (đọc data từ tất cả LỚP trên, không tạo mới)    │
│   CT HTPLDN GĐ2 · Báo cáo 23 loại · Dashboard 9 KPI             │
│   · API kết nối (18 outbound + ~8 inbound)                      │
└────────────────────────────────────────────────────────────────┘
```

**Quy tắc vàng:** Seed hết LỚP N rồi mới test LỚP N+1. Bỏ qua = tab rỗng / workflow block / KPI = 0.

---

## 4. Bản đồ 16 module SRS (18 đơn vị test) + 50+ màn hình + tab chi tiết

> **Lưu ý đếm:** SRS có 16 module FR-01..FR-16. Bảng dưới có 18 dòng vì split test:
> - FR-15 → 2 đơn vị (GĐ1 Kế hoạch + GĐ2 Đợt BC)
> - FR-13 → 2 đơn vị (Phiên TV nhanh + Kho QA)

### 4.1 Bảng tổng — 16 module SRS / 18 đơn vị test

| # | Module | LỚP | Mã FR | Số SCR | Có nhập tay? | Có phê duyệt? |
|---|---|---|---|:---:|:---:|:---:|
| 1 | Quản trị hệ thống | 1 | FR-10 | 10 (SCR-VIII-01..10) | ✅ | ❌ |
| 2 | Doanh nghiệp | 2 | FR-07 | 3 (SCR-V.III-01/02/03) | ✅ | ❌ (CRUD thuần) |
| 3 | Chuyên gia/TVV | 2 | FR-04 | 3 (SCR-IV-01/02/03) | ✅ | ✅ (CB PD duyệt) |
| 4 | Biểu mẫu | 2 | FR-09 | 3 (SCR-VII-01/02/03) | ✅ | ❌ |
| 5 | CT HTPLDN GĐ1 (Kế hoạch) | 2 | FR-15 | 1 (SCR-XI-01 Tab 1) | ✅ | ✅ (CB PD duyệt) |
| 6 | Vụ việc | 3 | FR-05 | 3 (SCR-V.I-01/02/03) | ✅ (bypass 2 state) | ✅ |
| 7 | Hỏi đáp | 3 | FR-02 | 3 (SCR-II-01/02/03) | ✅ | ✅ |
| 8 | Tư vấn chuyên sâu | 3 | FR-12 | 2 (SCR-X1-01/02) | ✅ | ✅ |
| 9 | Đào tạo (4 sub-menu) | 3 | FR-III | 5 (SCR-III-01..05) | ✅ | ✅ (chỉ KH) |
| 10 | Hợp đồng tư vấn | 4 | FR-X3-01 | 1 (SCR-X3-01) | ✅ | ❌ (CRUD) |
| 11 | Chi trả chi phí | 4 | FR-06 | 2 (SCR-V.II-01/02) | ❌ **chặn nhập tay** | ✅ |
| 12 | Đánh giá HQ | 4 | FR-08 | 1 (SCR-VI-01 — 4 tab) | ✅ | ✅ |
| 13 | Tư vấn nhanh — Phiên | 4 | FR-X2-A | 1 (SCR-X2-03) | ❌ **chặn nhập tay** | — |
| 14 | Tư vấn nhanh — Kho QA | 4 | FR-X2-B | 1 (SCR-X2-01) | ✅ | ✅ (nguồn THU_CONG) |
| 15 | CT HTPLDN GĐ2 (Đợt BC) | 5 | FR-15 | 1 (SCR-XI-01 Tab 2) | ✅ | ✅ |
| 16 | Báo cáo 23 loại | 5 | FR-IX-01..23 | 1 (SCR-IX-01) | ✅ (chạy query) | ❌ |
| 17 | Dashboard 9 KPI | 5 | FR-I-01..09 | 1 (SCR-I-01) | — (read-only) | — |
| 18 | API kết nối | 5 | FR-16 | — (không UI) | — | — |

---

### 4.2 Module 1 — Quản trị hệ thống (10 màn hình SCR-VIII)

#### SCR-VIII-01 Quản lý Danh mục — **14 tab danh mục dùng chung**

1. Lĩnh vực Pháp luật
2. Loại hình Hỗ trợ
3. Chương trình Hỗ trợ
4. Tình trạng Vụ việc
5. Cơ quan Đơn vị (tree view 3 cấp TW/BN/ĐP)
6. Tổ chức tư vấn
7. Loại Doanh nghiệp
8. Hồ sơ đề nghị Hỗ trợ
9. Hồ sơ đề nghị Thanh toán
10. Tiêu chí Đánh giá Hiệu quả (có cột trọng số %)
11. Tiêu chí Đánh giá Chi phí (có cột quy mô DN/mức hỗ trợ)
12. Loại Tài khoản
13. Loại hình Tiếp nhận
14. Kênh Tiếp nhận

Mỗi tab CRUD chuẩn: Mã / Tên / Mô tả / Thứ tự / Trạng thái + tìm kiếm + phân trang 20/trang.

#### SCR-VIII-02 Quản lý Vai trò
- List: Mã / Tên / Mô tả / Số TK gán / Số quyền / Trạng thái (toggle) + Sửa/Xóa
- Modal CRUD: Mã / Tên / Mô tả / Trạng thái

#### SCR-VIII-03 Quản lý Tài khoản người dùng
- **Tab lọc 5 trạng thái:** Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / Chờ phân quyền
- Filter: tìm kiếm / vai trò / đơn vị / loại TK / trạng thái
- Cột: Username / Họ tên / Email / Đơn vị / Vai trò (tag) / Trạng thái (badge) / Hành động (Xem/Sửa/Mở khóa/Khóa/Gửi lại email/Đổi MK)
- Form: Username / Email / Họ tên / MK / Vai trò (multi-select) / Đơn vị (tree) / Loại TK / CCCD

#### SCR-VIII-04 Phân quyền Chức năng
- Checkbox matrix: cây menu × cột Xem/Thêm/Sửa/Xóa/Phê duyệt/Xuất + logic cha-con
- Dropdown chọn vai trò + nút [Lưu] / [Reset mặc định]

#### SCR-VIII-05 Phân quyền Dữ liệu
- Tree đơn vị 3 cấp + checkbox multi-select + validate ngang cấp + tag list chọn
- [Lưu] phân quyền theo vai trò

#### SCR-VIII-06 Cấu hình Hệ thống — **4 tab**
- **Tab 1 SLA:** Bảng 4 loại yêu cầu (Hỏi đáp/Vụ việc/Hồ sơ HT/Hồ sơ TT) × thời hạn (ngày) + 4 mức cảnh báo % + toggle Email/TB app
- **Tab 2 Phân công mặc định:** Mapping Lĩnh vực PL → CB/TVV phụ trách + Mức ưu tiên + [Thêm mapping]
- **Tab 3 Mẫu phản hồi:** Mẫu câu hỏi/phản hồi theo lĩnh vực + phạm vi Mô hình B (Tên / Lĩnh vực / Nội dung / Trạng thái / Phạm vi áp dụng / Đơn vị). **Quyền:** QTHT chỉ R; CB_NV CRUD theo cấp (TW_QUOC_GIA/BN_RIENG/DP_RIENG) per srs-v3 §3.4.2 + srs-update-2026-5-4 §FR-II-NEW-02.
- **Tab 4 Quy trình hỗ trợ:** Bảng bước (Thứ tự / Tên / SLA per-step / Phân công auto)

#### SCR-VIII-07 Đăng nhập
- 2 tab: Tài khoản (Username + MK + OTP 6 số) / VNeID (button OIDC redirect — chỉ Tier 3)
- Modal cảnh báo session 30 phút idle

#### SCR-VIII-08 Đăng ký Tài khoản
- Form: Họ tên / Email / SĐT / CCCD / Loại TK (NHT/TVV/CG) / Đơn vị / MK / CAPTCHA
- Tạo TK state `CHO_KICH_HOAT` + email xác nhận 24h

#### SCR-VIII-08a QTHT Phê duyệt TK Đăng ký
- List TK chờ kích hoạt + nút [Duyệt] / [Từ chối] / [Xem chi tiết]
- Modal Duyệt: Gán vai trò + đơn vị → set `HOAT_DONG`
- Modal Từ chối: lý do ≥10 ký tự → set `VO_HIEU_HOA`
- Hành động hàng loạt

#### SCR-VIII-09 Đăng xuất
- Avatar → dropdown → Đăng xuất → Modal xác nhận → hủy JWT
- Auto đăng xuất 25 phút idle (cảnh báo) → 30 phút (force)
- Đăng xuất VNeID: hủy JWT + gọi VNeID OIDC logout

#### SCR-VIII-10 Nhật ký Hệ thống (Audit log)
- Read-only. Filter: từ-đến ngày / Người dùng / Module (12 module) / Loại thao tác (Tạo/Sửa/Xóa/PD/TC/Đăng nhập/Đăng xuất) / Entity
- Cột: Thời gian (sortable) / Người / Đơn vị / Module / Entity / Mã bản ghi / Loại thao tác / Chi tiết JSON diff
- Phân trang 50/trang · retention 5 năm · immutable

---

### 4.3 Module 2 — Doanh nghiệp (3 màn SCR-V.III)

#### SCR-V.III-01 Danh sách DN
- Filter: tìm kiếm tên/MST | Quy mô | Tỉnh thành | Lĩnh vực KD | Khoảng ngày hỗ trợ
- Cột: Mã DN / Tên / MST / Quy mô (badge) / Địa chỉ / Số lần hỗ trợ / Tổng chi phí / Hành động
- Action: Thêm mới + Import Excel

#### SCR-V.III-02 Thêm/Chi tiết DN — **4 tab**
- **Tab 1 Thông tin cơ bản (28 trường):** Mã DN auto / Tên / MST / Giấy CNĐKKD / Ngày cấp / Địa chỉ / Tỉnh / Loại DN / Quy mô / Ngành nghề / Số LĐ / Doanh thu / Tổng vốn / Người đại diện / Email / SĐT / Fax / Phụ nữ làm chủ / Số LĐ nữ / Số LĐ khuyết tật / Lĩnh vực KD / Ghi chú / File đính kèm
- **Tab 2 Hồ sơ pháp lý DN (mới v2.1):** CRUD HSPL (loại GIAY_PHEP/HOP_DONG/GIAY_CN/QUYET_DINH/KHAC) + trạng thái HIEU_LUC/HET_HAN/THU_HOI
- **Tab 3 Lịch sử hỗ trợ:** List VV gắn DN + 3 KPI (Tổng VV / Hoàn thành / Tổng chi phí)
- **Tab 4 Hồ sơ chi trả:** List hồ sơ chi trả liên kết

#### SCR-V.III-03 Import DN từ Excel
- Wizard 3 bước: Upload file → Preview validate → Confirm import
- Có file mẫu tải về

**Đặc trưng:** Quy mô DN auto-suggest theo NĐ39 dựa trên Số LĐ + Doanh thu.

---

### 4.4 Module 3 — Chuyên gia/Tư vấn viên (3 màn SCR-IV)

#### SCR-IV-01 Danh sách TVV
- **5 tab trạng thái:** Đang hoạt động / Tạm dừng / Mới đăng ký / Chờ thẩm định / Chờ phê duyệt
- Filter: từ khóa (tên/mã/CMND) / Lĩnh vực / Địa bàn / Tổ chức / Trạng thái / Khoảng ngày
- Cột: Ảnh / Mã / Họ tên / Loại / Lĩnh vực / Tổ chức / Điểm ĐG / Trạng thái / Ngày công nhận / Hành động
- Action hàng loạt: Công khai lên Cổng PLQG / Hủy công khai

#### SCR-IV-02 Thêm/Sửa TVV — **5 accordion**
1. **Thông tin cá nhân:** Mã / Ảnh / Họ tên / Ngày sinh / Giới tính / CMND-CCCD / Email / SĐT / Địa chỉ
2. **Thông tin nghề nghiệp:** Trình độ / Chứng chỉ / Số thẻ / Kinh nghiệm
3. **Tổ chức & Mạng lưới:** Tổ chức chính / Đối tác / Lĩnh vực PL / Địa bàn hoạt động
4. **File đính kèm:** Bằng cấp / Chứng chỉ / Thẻ hành nghề
5. **Ghi chú** (max 5000 ký tự)

#### SCR-IV-03 Chi tiết TVV — **5 tab**
1. **Hồ sơ:** 5 accordion read-only (clone từ SCR-IV-02)
2. **Thẩm định (MH-04.4):** 4 nhóm tiêu chí (Pháp lý / Năng lực chuyên môn / Hiệu quả & uy tín / Mạng lưới) + Kết luận thẩm định + Nút [Hủy] [Lưu nháp] [Gửi KQ] [Trình duyệt]
3. **Năng lực:** Bằng cấp / Chứng chỉ / Kinh nghiệm + Nút "Cập nhật năng lực" (inline edit)
4. **Lịch sử hỗ trợ:** List VV gắn TVV + thống kê (Tổng / Hoàn thành / Điểm TB)
5. **Đánh giá:** Điểm tổng hợp + 3 progress bar (Chuyên môn / Thái độ / Đúng hạn) + List đánh giá + Form đánh giá mới

**Workflow:** `MOI_DANG_KY` → `CHO_THAM_DINH` → `DANG_THAM_DINH` → `CHO_PHE_DUYET` → `DANG_HOAT_DONG`. TVV/CG/NHT đều lưu chung 1 entity, phân biệt qua field `vai_tro`.

---

### 4.5 Module 4 — Biểu mẫu (3 màn SCR-VII)

#### SCR-VII-01 Quản lý Thư mục Biểu mẫu
- **4 tab phân loại:** Tất cả / Đã công khai / Nháp / Đã ẩn (+ số đếm)
- Filter: tìm kiếm / Lĩnh vực PL / Trạng thái / Khoảng ngày tạo
- Cột: Tên thư mục (icon mở rộng) / Lĩnh vực / Số BM (auto) / Trạng thái / Hành động
- Action hàng loạt: Công khai / Ẩn / Xóa (chỉ khi rỗng)
- Form: Tên (max 500, unique) / Lĩnh vực / Mô tả (max 2000) / Thứ tự (1-20)

#### SCR-VII-02 Quản lý Biểu mẫu
- Filter: tìm kiếm / Lĩnh vực / Loại hình / Thư mục / Định dạng
- Cột: Mã BM auto / Tên / Loại tài liệu (icon) / Thư mục / Kích thước MB / Trạng thái (NHAP/CONG_KHAI/AN) / Sync Cổng / Hành động (Xem/Tải/Sửa/Xóa)
- Form: Thư mục / Tên (max 500) / File (doc/docx/xls/xlsx, max 20MB, quét virus ClamAV)

#### SCR-VII-03 Nhập Biểu mẫu Hàng loạt — Wizard
- **Bước 1:** Chọn thư mục đích / Tải file Excel metadata (max 5MB, có template) / Multi-upload file nội dung (max 50 file, mỗi 20MB)
- **Bước 2:** Bảng kiểm tra (STT / Tên file / Định dạng / Kích thước / Trạng thái Hợp lệ/Lỗi)
- **Thống kê:** "Tổng N file. Hợp lệ X. Lỗi Y"
- Nút xác nhận nhập (chỉ file hợp lệ)

**Workflow:** `NHAP` → `CONG_KHAI` (đẩy lên Cổng PLQG) → `AN`. Không phê duyệt — CB NV tự chịu trách nhiệm.

---

### 4.6 Module 5 — CT HTPLDN GĐ1 Kế hoạch (SCR-XI-01 Tab Thông tin)

Phần Tab 1 trong SCR-XI-01 (xem cả màn ở Module 15).

- **Tab 1 Thông tin chương trình:** Form kế hoạch CT (mục tiêu / thời gian / ngân sách / đơn vị chủ trì) + biểu mẫu đính kèm
- Action bar context-sensitive: [Gửi phê duyệt] / [Phê duyệt] / [Từ chối] / [Công bố] / [Kích hoạt] / [Tạm dừng] / [Tiếp tục] / [Hoàn thành] / [Hủy]
- **Workflow:** `DU_THAO` → `CHO_PHE_DUYET` → `DA_DUYET` → `DA_CONG_BO` → `DANG_THUC_HIEN`. 5 bước qua 2 vai trò CB NV ↔ CB PD.

---

### 4.7 Module 6 — Vụ việc (3 màn SCR-V.I)

#### SCR-V.I-01 Danh sách Vụ việc
- **6 tab trạng thái với số đếm realtime:** Tất cả / Chờ tiếp nhận / Đang xử lý / Chờ PD / Hoàn thành / Từ chối
- Filter: tìm kiếm (mã/tên DN) / Lĩnh vực PL / Trạng thái / Kênh tiếp nhận / Mức SLA / Khoảng ngày
- Cột: Mã VV / Tên DN / Lĩnh vực / Kênh / Trạng thái (badge) / NHT-TVV / Ngày tiếp nhận / Deadline SLA / Cảnh báo SLA (4 mức màu) / Hành động
- Action hàng loạt: Trình PD / Xóa

#### SCR-V.I-02 Thêm/Nhập thủ công VV — **4 accordion**
1. **Thông tin DN:** [Tìm DN] / Tên DN / MST / Địa chỉ / Tỉnh-TP / Loại DN / Quy mô / Ngành nghề / Số LĐ / Doanh thu / Người đại diện / Email-SĐT / Phụ nữ làm chủ
2. **Nội dung yêu cầu:** Tiêu đề / Nội dung (Rich Text) / Lĩnh vực / Loại hình HT / VV vướng mắc / Ghi chú
3. **Tài liệu đính kèm:** Upload file (doc/docx/xls/xlsx/pdf, max 20MB)
4. **Thông tin tiếp nhận:** Kênh tiếp nhận / Ngày / Người tiếp nhận auto / Mã hồ sơ DVC / Hệ thống nguồn

#### SCR-V.I-03 Chi tiết VV (Consolidated v2.1)
- **Stepper 10 bước:** `MOI_TAO` → `CHO_TIEP_NHAN` → `DA_TIEP_NHAN` → `DANG_KIEM_TRA` → `DA_PHAN_CONG` → `DANG_XU_LY` → `CHO_PHE_DUYET` → `DA_DUYET` → `HOAN_THANH` → `DA_DANH_GIA` (TU_CHOI hiển thị nhánh đỏ)
- **8 accordion:**
  1. Thông tin DN (read-only + link sang chi tiết DN)
  2. Nội dung yêu cầu
  3. Tài liệu đính kèm + nút [+ Thêm tài liệu]
  4. Kết quả kiểm tra (Checklist 6 hạng mục + counter "Lần bổ sung N/3")
  5. Phân công NHT-TVV (họ tên / lĩnh vực / địa bàn / ngày phân công / trạng thái xác nhận)
  6. Kết quả hỗ trợ (nội dung / file / kết luận / ngày hoàn thành)
  7. Phê duyệt (thời gian / người duyệt / quyết định / lý do từ chối)
  8. Đánh giá (điểm chất lượng / điểm thời gian / điểm thái độ / điểm tổng / nhận xét)
- **Timeline:** Lịch sử xử lý từ AUDIT_LOG
- **Action context-sensitive:** Tiếp nhận / Kiểm tra / Phân công / Chấp nhận-Từ chối / Cập nhật KQ / Trình PD / Phê duyệt-Từ chối / Cập nhật KQ cuối / Đánh giá / Mở lại

**Hiện tại nhập tay bypass 2 state đầu** (`MOI_TAO` + `CHO_TIEP_NHAN`) — vào thẳng `DA_TIEP_NHAN`. Khi DVC tích hợp xong sẽ test full 9 state.

---

### 4.8 Module 7 — Hỏi đáp (3 màn SCR-II)

#### SCR-II-01 Danh sách Hỏi đáp
- **7 tab trạng thái:** Tất cả / Mới (badge đỏ) / Đang xử lý / Chờ phê duyệt / Đã duyệt / Công khai / Hoàn thành (read-only)
- Filter: tìm kiếm full-text (nội dung/mã/người gửi) / Lĩnh vực PL / Trạng thái / Kênh tiếp nhận / Khoảng ngày
- Action: Thêm mới (Drawer) / Xuất Excel max 10K hàng / Làm mới / Xóa hàng loạt / Phê duyệt hàng loạt / Công khai hàng loạt
- Cột: Mã HD / Nội dung tooltip / Lĩnh vực / Người gửi / Kênh / Trạng thái / Thời hạn (4 mức cảnh báo) / Ngày tạo / Hành động

#### SCR-II-02 Chi tiết & Soạn phản hồi — **8 section**
1. Breadcrumb + Quay lại + Badge trạng thái + SLA badge
2. **Stepper 6 bước:** `MOI` → `TIEP_NHAN` → `DANG_XU_LY` → `CHO_DUYET` → `DA_DUYET` → `CONG_KHAI`/`HOAN_THANH`
3. **Accordion Thông tin câu hỏi (read-only):** Mã / Nội dung / Lĩnh vực / Người gửi / DN / Kênh / Ngày tạo / File
4. **Accordion Approval Fields (read-only):** Ngày-người tiếp nhận / Người phân công / Deadline / Ngày-người duyệt / Ngày-người từ chối + lý do (highlight đỏ)
5. **Action bar:** Tiếp nhận / Phân công / Soạn phản hồi / Hủy / Cập nhật thời hạn / Phê duyệt / Từ chối (modal lý do ≥10 ký tự) / Công khai / Hủy công khai / Đóng
6. **Form soạn phản hồi (state DANG_XU_LY):** Dropdown mẫu (prefill) / Nội dung Rich Text max 5K / Văn bản pháp luật / Gợi ý DN / File / **Checkbox "Đã trả lời" (auto chuyển CHO_DUYET)** / [Lưu nháp] / [Gửi phản hồi]
7. **Accordion Lịch sử xử lý:** Timeline (Thời gian / Người / Hành động / Giá trị cũ→mới)
8. **List phản hồi cũ** (nếu từ chối và soạn lại): Card list, mới nhất trên cùng

#### SCR-II-03 Phân công xử lý (Modal)
- Tóm tắt câu hỏi (Lĩnh vực / Nội dung / Trạng thái / Deadline)
- **Bảng gợi ý phân công:** Radio / Họ tên / Đơn vị / Lĩnh vực chuyên môn / Workload hiện tại / Mức ưu tiên (từ CAU_HINH_PHAN_CONG). Sắp xếp ưu_tien ASC → workload ASC
- Cảnh báo workload (badge đỏ "Quá tải N yêu cầu") — không block
- Dropdown Người xử lý (searchable, FK TAI_KHOAN, phải `HOAT_DONG`)
- Ghi chú / Thời hạn xử lý (override SLA)
- Nút [Hủy] [Phân công]

---

### 4.9 Module 8 — Tư vấn chuyên sâu (2 màn SCR-X1)

#### SCR-X1-01 Danh sách TVCS
- **3 tab:** Chờ xử lý (TIEP_NHAN+PHAN_CONG) / Đang tư vấn (DANG_TU_VAN+HOAN_THANH+CHO_PHE_DUYET) / Hoàn thành (DA_DUYET+HUY)
- Filter: tìm kiếm (nội dung/mã/tên DN) / Dropdown CG / Dropdown DN / Lĩnh vực / Trạng thái 7 giá trị / Khoảng ngày
- Cột: Mã (TVCS-{YYYYMMDD}-SEQ) / Tên DN / Tên CG / Lĩnh vực / Tóm tắt 100 ký / Trạng thái / Ngày tư vấn / Ngày tạo / Hành động (Xem/Sửa/Phân công CG/Hủy)
- Action hàng loạt: Phân công CG

#### SCR-X1-02 Thêm/Chi tiết TVCS
- **Stepper:** `TIEP_NHAN` → `PHAN_CONG` → `DANG_TU_VAN` → `HOAN_THANH` (auto chuyển CHO_PHE_DUYET) → `DA_DUYET` (HUY hiển thị nhánh riêng)
- **5 accordion:**
  1. **Thông tin cơ bản:** Mã auto / DN (dropdown searchable + auto-fill MST/địa chỉ) / CG (dropdown searchable + auto-fill chuyên môn) / Lĩnh vực / Ngày TV / Ghi chú
  2. **Nội dung tư vấn:** Rich Text max 50KB / Tóm tắt max 500 ký
  3. **Tư liệu PL liên kết (UC152):** Bảng tư liệu (Tên / Loại / Trạng thái / Số file / Hành động) + nút [+ Thêm]
  4. **Đánh giá chất lượng (UC153, read-only):** Bảng (Mã / Điểm sao / Nhận xét DN / Ngày) + Tổng hợp (Điểm TB + Số lượng)
  5. **Nhật ký:** Timeline lịch sử CUD + chuyển trạng thái
- **Action context-sensitive:** TIEP_NHAN [Hủy][Lưu][Phân công CG] / PHAN_CONG [Hủy yêu cầu] + (CG: [Chấp nhận][Từ chối]) / DANG_TU_VAN [Hủy][Lưu] / HOAN_THANH [Trình PD] / CHO_PHE_DUYET [Phê duyệt][Từ chối] / DA_DUYET (read-only)

---

### 4.10 Module 9 — Đào tạo (5 màn SCR-III, 4 sub-menu)

#### SCR-III-01 Chương trình Đào tạo (sub-menu 1)
- Danh sách CTĐT expandable rows + Form CRUD + Tab "Đề xuất" + Workflow duyệt-công khai
- Mỗi CTĐT mở rộng để thấy các Khóa học con

#### SCR-III-02 Chi tiết Khóa học (drill-down từ SCR-III-01) — **6 tab**
1. **Thông tin:** Tên / Mô tả / Lịch / Người tạo / Hình thức (TRUC_TUYEN/TRUC_TIEP) / Giảng viên / Địa điểm-Link Zoom
2. **Học viên:** List + trạng thái + kết quả + nút [+ Thêm học viên thủ công]
3. **Lịch học & Điểm danh:** Lịch buổi học + điểm danh thực tế
4. **Kết quả kiểm tra:** Điểm bài KT + xếp loại
5. **Chứng nhận:** List chứng chỉ hoàn thành + nút [Cấp chứng nhận]
6. **Bài giảng đã gắn:** List tài liệu/slide/video sử dụng

**Workflow KH 9 state:** `DU_THAO` → `CHO_DUYET` → `DA_DUYET` → `DA_CONG_KHAI` → `DANG_DIEN_RA` → `DA_KET_THUC` → `CHO_DUYET_KQ` → `HOAN_THANH` (+ HUY).

#### SCR-III-03 Kho Tài liệu/Bài giảng (sub-menu 2)
- Danh sách + Preview panel
- Hỗ trợ 3 loại: Slide PPTX / PDF / Video YouTube
- Switch công khai (toggle)

#### SCR-III-04 Ngân hàng Câu hỏi & Đề Kiểm tra (sub-menu 3) — **2 tab**
1. **Câu hỏi:** CRUD câu hỏi + phân loại theo chủ đề + mức độ (Dễ/Trung bình/Khó) + đáp án đúng
2. **Đề kiểm tra:** CRUD đề + bốc câu hỏi (Ngẫu nhiên / Thủ công) + nút [Phân phối] gán đề vào KH cụ thể

#### SCR-III-05 Giảng viên/Trợ giảng (sub-menu 4) — **2 tab**
1. **Thông tin:** Hồ sơ GV (tên / email / SĐT / chuyên môn / tổ chức)
2. **Lịch sử giảng dạy:** List khóa học đã dạy + ngày + kết quả

---

### 4.11 Module 10 — Hợp đồng tư vấn (SCR-X3-01)

#### Danh sách HĐTV
- Filter: tìm kiếm tên/mã/Bên B + Khoảng ngày
- Cột: Mã HĐ (HDTV-{YYYYMMDD}-SEQ) / Tên / Bên A / Bên B / Giá trị / Thời hạn bắt đầu / Thời hạn kết thúc (đỏ nếu ≤30 ngày) / Số VV liên kết (badge) / Tiến độ TT (progress bar %) / Hành động

#### Form Thêm/Sửa — **5 accordion**
1. **Thông tin chung:** Mã auto / Tên / Bên A auto đơn vị user / Bên B + TVV dropdown / Giá trị / Thời hạn bắt đầu-kết thúc / Nội dung / Ghi chú / File
2. **Vụ việc liên kết:** Bảng VV (Mã / Tên DN / Lĩnh vực / Trạng thái / [Bỏ liên kết]) + nút [+ Liên kết VV] → modal multi-select N:N
3. **Mốc tiến độ:** Inline-edit (Tên mốc / Ngày dự kiến / Ngày thực tế / Trạng thái CHUA_BAT_DAU/DANG_THUC_HIEN/HOAN_THANH) + [+ Thêm mốc]
4. **Thanh toán giai đoạn:** Inline-edit (Giai đoạn / Số tiền / Ngày TT / Trạng thái CHUA_THANH_TOAN/DA_THANH_TOAN). Validate SUM ≤ giá trị HĐ. Progress bar TT
5. **Nhật ký:** Timeline CUD + mốc + thanh toán + liên kết VV
- **Action:** [Hủy] [Lưu] — KHÔNG cần phê duyệt

---

### 4.12 Module 11 — Chi trả (2 màn SCR-V.II)

#### SCR-V.II-01 Danh sách HSCT — **5 tab trạng thái**
1. Tất cả
2. Chờ xử lý (CHO_TIEP_NHAN + DANG_KIEM_TRA + YEU_CAU_BO_SUNG)
3. Đang đánh giá (DANG_DANH_GIA + DANG_THAM_DINH)
4. Chờ PD (CHO_PHE_DUYET)
5. Đã xử lý (DA_DUYET + DA_THANH_TOAN + TU_CHOI + HUY)

- Filter: tìm kiếm tên DN/mã / Trạng thái 10 giá trị / Quy mô DN / Khoảng ngày nộp
- Cột: Mã HS / Tên DN / Quy mô (badge) / Số tiền đề nghị / Số tiền duyệt / Trạng thái / SLA / Ngày nộp / Hành động (theo TT)

🚫 **KHÔNG có nút Thêm mới** — DN nộp Mẫu 01 NĐ55 qua DVC/LGSP. Test negative: verify KHÔNG thấy nút Thêm = PASS.

#### SCR-V.II-02 Chi tiết HSCT (Consolidated v2.1) — **Stepper 6 bước + 8 section**
- **Stepper:** Tiếp nhận → Kiểm tra → Đánh giá → Thẩm định → Phê duyệt → Thanh toán
- **8 section (gộp MH-06.2 → MH-06.6):**
  1. **Thông tin DN (read-only):** Tên / Địa chỉ / MST / CNĐKKD / Ngành nghề / Quy mô (badge — quyết định mức hỗ trợ)
  2. **Thông tin tư vấn (read-only):** Vụ việc / TVV / Tổ chức hành nghề / SĐT / Số ngày HĐ TVPL / Phí TV / Số tiền đề nghị
  3. **Kiểm tra HS (DANG_KIEM_TRA):** Checklist 5 thành phần (Mẫu 01 / CNĐKKD / Tờ khai / HĐ TVPL / Văn bản TVPL) + Radio kết quả (Đạt/YC bổ sung/Không đạt) + Lý do (textarea) + Counter "Lần bổ sung N/3" (auto TU_CHOI khi N=3) + Nút [Xác nhận kiểm tra]
  4. **Đánh giá tiêu chí (DANG_DANH_GIA):** Auto-calc readonly:
     - `muc_ho_tro` = Siêu nhỏ 100% / Nhỏ max 30% / Vừa max 10%
     - `tran_ho_tro_nam` = Siêu nhỏ 3M / Nhỏ 5M / Vừa 10M
     - `da_chi_trong_nam` (auto reset 1/1)
     - **`so_tien_duoc_duyet` = MIN(so_tien_de_nghi, phi_tu_van × muc_ho_tro%, tran_ho_tro_nam − da_chi_trong_nam)**
     + Ghi chú đánh giá + Nút [Xác nhận đánh giá] → DANG_THAM_DINH
  5. **Thẩm định (DANG_THAM_DINH):** Checklist 4 hạng mục (Số liệu khớp Mẫu 01 / Phí hợp lý / Quy mô đúng / Chưa vượt trần năm) + Radio Đạt/Không đạt + Lý do + [Trình phê duyệt] (chỉ khi Đạt) → CHO_DUYET
  6. **Phê duyệt (CHO_PHE_DUYET):** Info card tóm tắt + [Phê duyệt] (CB PD cùng cấp → DA_DUYET) + [Từ chối] (modal lý do ≥10 ký tự → DANG_THAM_DINH)
  7. **Cập nhật thanh toán (DA_DUYET):** so_tien_thuc_tra (validate >0 và ≤duyệt) / ngay_thanh_toan / so_bien_nhan / Ghi chú + [Cập nhật thanh toán] → DA_THANH_TOAN
  8. **Common Approval Fields + Timeline (Accordion):** ngay_tiep_nhan / nguoi_tiep_nhan / thoi_gian_duyet / nguoi_duyet / thoi_gian_tu_choi / lý do từ chối + Timeline AUDIT_LOG + File từ DVC

**Workflow:** `CHO_TIEP_NHAN` → `DANG_KIEM_TRA` → `DANG_DANH_GIA` → `DANG_THAM_DINH` → `CHO_PHE_DUYET` → `DA_DUYET` → `DA_THANH_TOAN`. Có nhánh `YEU_CAU_BO_SUNG` (counter 3 lần auto TU_CHOI) + `HUY` (DN rút).

---

### 4.13 Module 12 — Đánh giá HQ (SCR-VI-01 Consolidated v2.1)

**Phần A — Danh sách đợt đánh giá:**
- Filter: tìm kiếm tên/mã / Tần suất (SO_BO_6_THANG/TRON_NAM) / Đối tượng (VU_VIEC/DAO_TAO/TONG_HOP) / Trạng thái 9 giá trị / Khoảng ngày
- Cột: Mã đợt / Tên / Tần suất / Đối tượng / Kỳ ĐG / Trạng thái / Người tạo / Ngày tạo / Hành động (Xem/Sửa/Xóa — sửa chỉ NHAP/DA_LAP_KH, xóa chỉ NHAP)
- Form tạo đợt: Tên / Mục tiêu (Rich Text) / Tần suất / Từ-Đến ngày / Đối tượng / Ghi chú + [Lưu nháp] [Lưu & Chuyển tiêu chí]

**Phần B — Chi tiết đợt — 4 tab:**

1. **Tiêu chí (gộp MH-08.1a):** Header card đợt + Bảng tiêu chí editable inline (Tên / Mô tả / Trọng số % / Điểm tối đa / Thứ tự drag-drop / Hành động) + **Summary realtime tổng trọng số** (🟢 = 100% / 🔴 ≠ 100%) + Warning banner WRN-TC-01 + [+ Thêm tiêu chí] [Nhập từ DM]
2. **Phân công (gộp MH-08.2 + 08.3):** Bảng phân công editable (Người ĐG / Vai trò DANH_GIA_VIEN/TRUONG_NHOM / Lĩnh vực phụ trách / Ghi chú / Xóa) + [+ Thêm người] + [Trình phê duyệt → CHO_DUYET_PC] + (CB PD: [Phê duyệt PC → DA_DUYET_PC] / [Từ chối PC → DA_LAP_KH])
3. **Thực hiện chấm điểm (gộp MH-08.4 + 08.5):** Multi-select VV `HOAN_THANH` trong kỳ + Bảng chấm điểm inline (mỗi VV × cột tiêu chí + Điểm tổng auto + Nhận xét) + KPI cards (Số VV chấm / Điểm TB / Xếp loại Xuất sắc/Tốt/Đạt/Chưa đạt) + [Lưu kết quả] [Hoàn tất chấm điểm → DA_DANH_GIA]
4. **Báo cáo (gộp MH-08.6 + 08.7):** KPI cards (Tổng VV ĐG / Điểm TB / Tỷ lệ tuân thủ SLA) + Bảng tổng hợp + Biểu đồ Radar + Bar + Nhận xét chung + [Trình duyệt BC → CHO_DUYET_BC] + (CB PD: [Phê duyệt BC → DA_DUYET_BC] / [Từ chối BC → DA_LAP_BC]) + [Xuất XLSX] [Xuất DOCX TT17/2025]

**Workflow 9 state:** `NHAP` → `DA_LAP_KH` → `CHO_DUYET_PC` → `DA_DUYET_PC` → `DANG_DANH_GIA` → `DA_DANH_GIA` → `DA_LAP_BC` → `CHO_DUYET_BC` → `DA_DUYET_BC`.

⚠️ **Double-state:** SM hiển thị `LAP_KE_HOACH` nhưng DB lưu `NHAP` — assert cả 2 khi test.

---

### 4.14 Module 13 — Tư vấn nhanh Phiên (SCR-X2-03)

🚫 **KHÔNG có nút Thêm mới** — DN gõ chat trên Cổng PLQG, hệ thống tự gợi ý từ Kho QA.

- **4 sub-tab trạng thái:** Tất cả / Chờ xử lý / Đã gợi ý / Hoàn thành
- **Layout 2 cột khi trả lời:**
  - Trái: Thông tin DN + câu hỏi
  - Phải: 5 gợi ý top từ Kho QA + Form soạn trả lời (CB NV nhập khi DN không hài lòng)
- **Section đánh giá:** Điểm sao (1-5) + Nhận xét DN + Thống kê

**Workflow:** `MOI` → `DANG_TIM_KIEM` → `DA_GOI_Y` → `CB_TRA_LOI` → `HOAN_THANH` (+ auto `HET_HAN` 30 ngày DN không tương tác).

---

### 4.15 Module 14 — Kho Q&A (SCR-X2-01)

- **3 sub-tab bộ lọc:** Tất cả / Đã duyệt / Chờ duyệt
- Bảng Q&A + nhãn nguồn (TỰ_ĐỘNG / THỦ_CÔNG / IMPORT) + toggle hiệu lực
- Phê duyệt inline/batch
- Modal thêm Q&A: Câu hỏi (textarea) / Câu trả lời (Rich Text) / Lĩnh vực / Từ khóa (tags) + [Gửi duyệt]
- Import Excel hàng loạt

**2 nguồn data:**
- `THU_CONG` — CB NV nhập tay → `CHO_DUYET` → CB PD duyệt → `DA_DUYET` + `hieu_luc=1`
- `TU_DONG` — auto đẩy từ Hỏi đáp `DA_DUYET` → bỏ qua duyệt, gán `DA_DUYET` ngay

---

### 4.16 Module 15 — CT HTPLDN GĐ2 Đợt BC (SCR-XI-01 Tab 2)

Tab 2 trong SCR-XI-01 (cùng màn với Module 5).

- **Bảng đợt báo cáo** + Modal tạo đợt + Drill-down: Lập BC (Mẫu 21a/21b TT17) + Phê duyệt KQ + Gửi TW + Tổng hợp (TW only)
- **Workflow 6 state:** `TAO_DOT` → `DANG_LAP_BC` → `CHO_DUYET_KQ` → `DA_DUYET_KQ` → `DA_GUI_TW` → `DA_TONG_HOP`
- Cấp ĐP/BN gửi lên TW. TW tổng hợp toàn quốc

**Phụ thuộc cứng:** CT GĐ1 phải `DANG_THUC_HIEN` + có số liệu VV/Chi trả/Đào tạo trong kỳ.

---

### 4.17 Module 16 — Báo cáo 23 loại (SCR-IX-01)

- Module Báo cáo 23 loại BC chia 4 nhóm:
  - **Nhóm 1 (FR-IX-01..05):** BC nghiệp vụ (Hỏi đáp / VV tiếp nhận / VV đang xử lý / VV hoàn thành / VV theo thời gian)
  - **Nhóm 2 (FR-IX-06..08):** BC đào tạo + CG/TVV
  - **Nhóm 3 (FR-IX-09..14):** BC ĐG hiệu quả + chất lượng + theo đơn vị/lĩnh vực/loại DN/thời gian
  - **Nhóm 4 (FR-IX-15..23):** BC chi phí + CT hỗ trợ
- 3 state đơn giản: `DANG_TAO` → `HOAN_THANH`/`LOI`
- Form: chọn loại BC → nhập filter (kỳ / đơn vị / lĩnh vực) → [Chạy] → xuất Excel/Word

---

### 4.18 Module 17 — Dashboard (SCR-I-01) — 9 KPI + 2 chart

- **Top:** Breadcrumb + Tiêu đề + [Làm mới] + Filter (Năm / Từ-Đến ngày / Đơn vị) + [Áp dụng] [Xóa bộ lọc]
- **Hàng KPI 1 (4 thẻ):** Hỏi đáp mới / VV tiếp nhận / VV đang xử lý / VV hoàn thành (kèm xu hướng)
- **Hàng KPI 2 (5 thẻ):** ĐT đang diễn ra / ĐT hoàn thành / Tổng CG-TVV + 2 KPI bổ sung (Tỷ lệ HS bổ sung / Thời gian xử lý TB)
- **Biểu đồ:** Đánh giá hiệu quả (bar+line: điểm hài lòng + tỷ lệ tuân thủ SLA %) / Chất lượng ĐT (donut: tỷ lệ đạt CN + điểm TB)
- Auto-refresh 60s (Page Visibility API), drill-down thẻ KPI, responsive

Read-only. Không seed riêng — seed xong các module upstream là Dashboard tự có số.

---

### 4.19 Module 18 — API kết nối (FR-16, không UI)

18 endpoint outbound + 8 endpoint inbound:

- **Outbound (Cổng PLQG/HT TTHC BTP đọc data):** Hỏi đáp / Đào tạo / CG-TVV / Vụ việc / Đánh giá HQ / Biểu mẫu / TVCS / CT HTPLDN / Hồ sơ pháp lý DN — mỗi entity có 2 endpoint (Chia sẻ + Tìm kiếm) = 18 outbound
- **Inbound (DVC/LGSP đẩy data vào):** POST `/vu-viec` / `/chi-tra` / etc — 8 endpoint hiện BLOCKED chờ tích hợp

Test bằng curl/Bruno. Phụ thuộc upstream có data state cuối (`DA_DUYET`/`CONG_KHAI`).

---

## 5. ⭐ Bảng nguồn dropdown — 30+ dropdown chính

Dùng khi seed gặp dropdown rỗng → tra ngay biết phải seed cái gì để dropdown có data.

### 5.1 Dropdown danh mục (lấy từ DM dùng chung — QTHT setup ở LỚP 1)

| Dropdown | Xuất hiện ở module | Nguồn | Filter |
|---|---|---|---|
| Lĩnh vực pháp lý | HD/VV/TVCS/Kho QA/Biểu mẫu | `DANH_MUC` loại `LINH_VUC_PL` | `dang_hoat_dong=1` |
| Loại DN | Form DN | `DANH_MUC` loại `LOAI_DN` | `dang_hoat_dong=1` |
| Tỉnh thành | Form DN | `DANH_MUC` loại `TINH_THANH` | (auto từ BTP DM) |
| Tổ chức TV | Form TVV (NHT) | `DANH_MUC` loại `TO_CHUC_TV` | `dang_hoat_dong=1` |
| Tiêu chí ĐG hiệu quả | Form kỳ Đánh giá HQ | `DANH_MUC` loại `TIEU_CHI_DG` | tổng trọng số = 100% |
| Loại hồ sơ pháp lý DN | Tab HSPL trong DN | enum `loai_ho_so` (5 giá trị: GIAY_PHEP/HOP_DONG/GIAY_CN/QUYET_DINH/KHAC) | — |
| Hình thức HT | Form Vụ việc | `DANH_MUC` loại `HINH_THUC_HT` | — |
| Nguồn yêu cầu (kênh tiếp nhận) | Form VV/HD | enum (TRUC_TIEP/DIEN_THOAI/BUU_CHINH/HE_THONG_KHAC) | — |
| Loại tài khoản | Form đăng ký TK | `DANH_MUC` loại `LOAI_TK` (NHT/TVV/CG) | — |
| Tình trạng VV | Filter list VV | `DANH_MUC` loại `TINH_TRANG_VV` | — |

### 5.2 Dropdown entity nghiệp vụ

| Dropdown | Xuất hiện ở module | Nguồn entity | Filter |
|---|---|---|---|
| **Chọn DN** | HD/VV/TVCS/HĐTV/Chi trả | `DOANH_NGHIEP` | `don_vi_id` khớp scope user |
| **Chọn TVV/CG** (phân công VV) | VV bước Phân công NHT | `TU_VAN_VIEN` | `trang_thai=DANG_HOAT_DONG` AND `vai_tro IN (TVV,CG,NHT)` AND `linh_vuc_pl` khớp |
| **Chọn người xử lý** (phân công HD) | HD Modal Phân công | `TAI_KHOAN` | `trang_thai=HOAT_DONG` (gồm CB NV + TVV active) |
| **Chọn CG** (phân công TVCS) | TVCS Phân công | `TU_VAN_VIEN` | `vai_tro=CG` AND `trang_thai=DANG_HOAT_DONG` |
| **Chọn Vụ việc** (HĐTV liên kết) | HĐTV tab "VV liên kết" | `VU_VIEC` | `trang_thai=HOAN_THANH` |
| **Chọn Vụ việc** (Đánh giá HQ chấm điểm) | ĐG HQ Tab Chấm điểm | `VU_VIEC` | `trang_thai=HOAN_THANH` AND `ngay_hoan_thanh` trong kỳ ĐG |
| **Chọn Đánh giá viên** | ĐG HQ Phân công | `TU_VAN_VIEN` | `trang_thai=DANG_HOAT_DONG` |
| **Chọn CTĐT** | Form tạo Khóa học | `CHUONG_TRINH_DAO_TAO` | `trangThai=DA_DUYET` |
| **Chọn Khóa học** | Form tạo Đề KT (gán đề vào KH) | `KHOA_HOC` | `trang_thai IN (DA_CONG_KHAI, DANG_DIEN_RA)` |
| **Chọn Giảng viên** | Form Khóa học | `GIANG_VIEN` | `trang_thai=DANG_HOAT_DONG` |
| **Chọn Bên B (TVV/Tổ chức)** | Form HĐTV | `TU_VAN_VIEN` | `trang_thai=DANG_HOAT_DONG` |
| **Chọn HĐTV** (optional khi Chi trả) | Chi trả bước thẩm định | `HOP_DONG_TV` | `trang_thai=HIEU_LUC` |
| **Chọn Đơn vị áp dụng** | Form PC mặc định | `DON_VI` | scope user |
| **Chọn CT HTPLDN** | Form Đợt BC GĐ2 | `CT_HTPLDN` | `trang_thai=DANG_THUC_HIEN` |
| **Chọn Mẫu báo cáo** (23 loại) | Module Báo cáo | enum BC_TYPE | — |
| **Chọn Lý do từ chối** | Modal Từ chối (CB PD) | `DANH_MUC` loại `LY_DO_TU_CHOI` | filter theo module (HD/VV/TVCS) |
| **Chọn Lý do bổ sung** | Modal YC bổ sung | `DANH_MUC` loại `LY_DO_BO_SUNG` | filter theo module |
| **Chọn vai trò** (form TK) | SCR-VIII-03 form TK | `VAI_TRO` | `trang_thai=HOAT_DONG` |
| **Chọn đơn vị** (form TK) | SCR-VIII-03 form TK | `DON_VI` (tree 3 cấp) | scope theo cấp user |
| **Chọn Lĩnh vực phụ trách** (PC mặc định) | SCR-VIII-06 Tab 2 | `DANH_MUC` loại `LINH_VUC_PL` | đa lựa chọn |
| **Chọn Mẫu phản hồi** (HD soạn trả lời) | SCR-II-02 form soạn | `MAU_PHAN_HOI` | filter theo lĩnh vực HD |
| **Chọn tư liệu PL liên kết** (TVCS) | SCR-X1-02 Accordion 3 | `TU_LIEU_PHAP_LY_VV` (entity §3.4.2 srs-v3.md:1025 — Tư liệu pháp lý của vụ việc, UC152) | scope đơn vị |

### 5.3 Dropdown auto / system-driven

| Dropdown | Auto từ | Cách verify |
|---|---|---|
| Quy mô DN (Siêu nhỏ/Nhỏ/Vừa) | Tính từ Số LĐ + Doanh thu theo NĐ39 | Nhập 5 LĐ + 2 tỷ → auto = "Siêu nhỏ" |
| Mức hỗ trợ Chi trả (100%/30%/10%) | Quy mô DN (BR-CALC-01) | DN Siêu nhỏ → 100% / Nhỏ → 30% / Vừa → 10% |
| Trần hỗ trợ năm | Quy mô DN | Siêu nhỏ 3M / Nhỏ 5M / Vừa 10M |
| Bên A (Form HĐTV) | Đơn vị của user | Login `cb_nv_tw_01` → Bên A = "Cục BLDS&KT" |
| Đơn vị mapping (Tab QTHT) | Đơn vị của user | Login user thuộc đơn vị X → form auto-fill X |
| Deadline SLA | Cấu hình SLA + ngày tiếp nhận | Tự tính theo cấu hình SCR-VIII-06 Tab 1 |
| Số tiền duyệt Chi trả | MIN(đề nghị, phí×%, trần−đã chi) | Auto-calc theo BR-CALC-01/02 |

### 5.4 Bảng FR-code prereq — dùng khi viết test plan

Mỗi dòng = **1 hành động workflow quan trọng có FR-code**. Dùng để trace ngược về SRS khi viết test plan: action này cần prereq gì + sinh ra data gì cho downstream.

| Chức năng / Màn hình | Data đầu vào bắt buộc (upstream) | Data đầu ra → Downstream tiêu thụ |
|---|---|---|
| **Phân công Hỏi đáp** (FR-II-06) | • `DOANH_NGHIEP` tồn tại<br>• `TU_VAN_VIEN` = `DANG_HOAT_DONG`<br>• `CAU_HINH_PHAN_CONG` đã map lĩnh vực | Sinh `HOI_DAP` = `DA_DUYET` → Kho Q&A Tư vấn Nhanh (FR-X.2) |
| **Phân công Vụ việc** (FR-V.I-09) | • `DOANH_NGHIEP` tồn tại<br>• `TU_VAN_VIEN` = `DANG_HOAT_DONG`<br>• `CAU_HINH_SLA` (LỚP 1) | Sinh `VU_VIEC` = `HOAN_THANH` → Đánh giá (FR-VI) + Chi trả (FR-V.II) |
| **Chi trả Chi phí** (FR-V.II-05 / FR-V.II-12) | • `VU_VIEC` liên kết<br>• `TU_VAN_VIEN` thực hiện tư vấn<br>• `DOANH_NGHIEP` (quy mô → tính % hỗ trợ BR-CALC-01) | Sinh `HO_SO_CHI_TRA` = `DA_THANH_TOAN` → số liệu Kinh phí cho Báo cáo CT HTPLDN (FR-XI) |
| **Chọn Vụ việc Đánh giá** (FR-VI-05) | • `VU_VIEC` = `HOAN_THANH` **trong kỳ ĐG**<br>• `TIEU_CHI_DANH_GIA` (Σ trọng số = 100%) | Sinh `BAO_CAO_DANH_GIA` → Dashboard (FR-I) + Báo cáo (FR-IX) |
| **Lập Báo cáo TT17 / Mẫu 21a-21b** (FR-XI-06) | Toàn bộ data: `VU_VIEC`, `KHOA_HOC`, `HO_SO_CHI_TRA`, `TU_VAN_VIEN` ở trạng thái cuối | Auto-fill cột biểu mẫu 21a/21b; xuất Excel/Word cho TW tổng hợp |
| **Tư vấn Nhanh — Tra cứu** (FR-X.2-02) | `KHO_CAU_HOI` = `DA_DUYET` **và** `hieu_luc = 1` | Sinh `PHIEN_TU_VAN` = `HOAN_THANH` → phục vụ Báo cáo thống kê |
| **Báo cáo thống kê** (FR-IX-01..23) | Bản ghi của **MỌI entity nghiệp vụ** ở trạng thái cuối (`DA_DUYET` / `HOAN_THANH` / `DA_THANH_TOAN`) — theo BR-RPT-01 | Read-only output (không sinh data mới) |

**Cách đọc:**
- **Cột giữa** = prereq bắt buộc. Thiếu 1 item → action fail hoặc màn hình rỗng.
- **Cột phải** = data sinh ra + downstream consumer. Biết để test tiếp module downstream.

---

## 6. Quy ước thuật ngữ — bản dịch dễ hiểu

Khi đọc 3 file gốc gặp các thuật ngữ kỹ thuật, tra bảng dưới:

| Thuật ngữ kỹ thuật | Cách hiểu đơn giản |
|---|---|
| Auto-transition (BR-FLOW-01) | Tự động chuyển trạng thái — không cần click nút Trình duyệt |
| Bounce-back | Quay ngược về trạng thái trước (CB PD từ chối → CB NV làm lại) |
| Guard / Pre-condition | Điều kiện cần thỏa trước khi thao tác (vd: phải đủ trường bắt buộc) |
| Cascade-delete | Xóa kéo theo (xóa cha → xóa con tự động) |
| FK required | Bắt buộc chọn từ dropdown có sẵn, không tự gõ |
| Soft-delete (xóa mềm) | Ẩn khỏi list nhưng còn trong DB, có thể khôi phục |
| Inline validation | Báo lỗi ngay khi nhập, không chờ submit |
| Bypass | Bỏ qua bước đó (vd: nhập tay bỏ qua 2 state đồng bộ DVC) |
| State machine (SM) | Vòng đời của bản ghi: trạng thái nào chuyển sang trạng thái nào |
| LỚP / Tier / BƯỚC | Đều cùng nghĩa, file mới thống nhất dùng "**LỚP**" |
| Upstream / Downstream | Module trước (đầu nguồn) / Module sau (cuối nguồn) — trong sơ đồ data flow |
| Scope | Phạm vi dữ liệu user được phép thấy (vd: CB ĐP chỉ thấy tỉnh mình) |
| Stepper | Thanh hiển thị các bước workflow ngang trên đầu màn hình chi tiết |
| Accordion | Section co/giãn được trong form — click để mở rộng |
| Drill-down | Click để vào sâu hơn (vd: click 1 dòng list → mở chi tiết) |

---

## 7. ⚠️ 5 mâu thuẫn cần BA xác nhận

Khi consolidate 3 file gốc + SRS-v3 phát hiện 5 chỗ thông tin không nhất quán. Test plan tạm áp dụng phương án "an toàn" nhưng cần BA chốt:

| # | Mâu thuẫn | Nguồn xung đột | Phương án QA tạm áp dụng | Cần BA quyết |
|---|---|---|---|---|
| 1 | Phân công Đợt 2 TVV: 1 cột FK hay 2 cột tách CB/TVV? | UI thực tế 25/04 (1 cột) vs SRS bản trước (2 cột) | Theo UI 25/04: 1 cột FK + add row mới với `uu_tien=2` | BA confirm DDL final |
| 2 | SM-HOIDAP enum: master 9 state, FR-II-06 set state `DA_PHAN_CONG` không có trong enum | `02-thu-tu-module §⑦` flag explicit | Test theo enum 9 state, ghi observation | BA clarify FR-II-06 |
| 3 | State VV cuối: chỉ `HOAN_THANH` hay auto chuyển `DA_DANH_GIA` khi trong kỳ ĐG? | `flow-module §5` ghi optional | Assert cả 2 state trong test | BA confirm transition |
| 4 | Khóa học state `DA_CONG_KHAI`: có trong DB ENUM, SRS Phụ lục C.2 bỏ sót transition | `flow-module §8 SUB-MENU 1` flag | Test theo logic UI thực tế (`DA_DUYET → DA_CONG_KHAI` qua nút Công khai) | BA bổ sung Phụ lục C.2 |
| 5 | Đánh giá HQ double-state: SM hiển thị `LAP_KE_HOACH`, DB lưu `NHAP` | `flow-module §11`, `srs-fr-08` | Assert cả 2 — UI = `LAP_KE_HOACH`, query DB = `NHAP` | BA chốt naming convention |

---

## 8. Module nào nhập tay được, module nào không?

### ✅ Có nút Thêm mới — test được ngay

1. Doanh nghiệp (+ Import Excel)
2. Tư vấn viên/CG/NHT
3. Biểu mẫu (upload file)
4. CT HTPLDN GĐ1 Kế hoạch
5. Vụ việc (bypass 2 state đồng bộ DVC)
6. Hỏi đáp
7. Tư vấn chuyên sâu
8. Đào tạo (4 sub-menu)
9. Hợp đồng tư vấn
10. Đánh giá HQ
11. Kho Q&A
12. CT HTPLDN GĐ2 Đợt BC
13. Báo cáo (chạy query)

### 🚫 Không có nút Thêm mới — chờ tích hợp ngoài

| Module | Chặn vì | Workaround test |
|---|---|---|
| Chi trả (SCR-V.II-01) | DN nộp Mẫu 01 NĐ55 qua DVC → LGSP đẩy vào | BE inject record `CHO_TIEP_NHAN` để test workflow phê duyệt; negative test verify KHÔNG có nút Thêm |
| Phiên TV nhanh | DN gõ trên Cổng PLQG | Chờ Cổng PLQG; CB NV chỉ tham gia bước 4 khi DN không hài lòng |
| Điểm đánh giá DN chấm 1-5★ | API inbound từ Cổng | Read-only |
| Dữ liệu VNeID | NDXP ↔ Bộ Công an | Đồng bộ ngầm |
| 8 API inbound (POST /vu-viec, /chi-tra...) | LGSP | Chờ tích hợp |

---

## 9. Bản đồ "tab/màn hình nào cần data nào" — tra nhanh khi seed

Khi mở 1 màn hình mà thấy trống → tra bảng này trước khi log bug.

| Muốn test màn hình / chức năng này | Phải có data này trước | Nếu trống thì… |
|---|---|---|
| **DN detail Tab "Hồ sơ PL"** | Tư vấn chuyên sâu đã tạo HSPL gắn DN | Seed HSPL qua TVCS |
| **DN detail Tab "Lịch sử hỗ trợ"** (3 KPI) | VV `HOAN_THANH` gắn DN | Chạy VV đủ 8 state, không dừng giữa chừng |
| **DN detail Tab "Hồ sơ chi trả"** | Chi trả `DA_THANH_TOAN` | BLOCKED — BE inject hoặc chờ LGSP |
| **TVV detail Tab "Lịch sử hỗ trợ"** | VV gắn TVV | Seed VV gắn TVV này |
| **Dropdown "Chọn TVV"** (phân công VV/HD/Chi trả) | TVV `DANG_HOAT_DONG` | Quay lại duyệt TVV qua workflow |
| **Dropdown "Chọn DN"** (tạo VV/HD/TVCS) | DN đã lưu thành công | Kiểm `don_vi_id` của user khớp DN |
| **Dropdown "Chọn VV"** (tạo HĐTV/Chi trả) | VV `HOAN_THANH` | Chạy bước cuối "Cập nhật KQ" cho VV |
| **Danh sách "Chấm điểm"** (Đánh giá HQ) | ≥1 VV `HOAN_THANH` trong kỳ ĐG | Kiểm `ngay_hoan_thanh` có trong kỳ |
| **Mẫu 21a/21b auto-fill** | VV/Khóa học/Chi trả trong kỳ | Seed đủ LỚP 3+4 trong kỳ BC |
| **Dashboard KPI ≠ 0** | Toàn bộ transactional | Seed qua các module nghiệp vụ |
| **Tư vấn Nhanh trả về gợi ý** | Kho QA `DA_DUYET` + `hieu_luc=1` | Seed Kho QA trước |
| **API outbound `GET /...`** | Upstream state `DA_DUYET` / `CONG_KHAI` | Seed upstream trước khi curl |

---

## 10. Khi gặp tab/màn hình rỗng — phân loại theo thứ tự

Đừng vội log bug. Đi theo 6 bước:

1. **UI có text "Chức năng đang phát triển" không?** → YES = bug Critical (UI chưa build), log ngay.
2. **Đã seed đủ data upstream chưa?** → tra **§9 Bản đồ tab cần data** ở trên. Chưa thì seed xong rồi retest.
3. **Bản ghi mong đợi đã ở state cuối chưa?** (vd: VV phải `HOAN_THANH`, không phải `DA_DUYET`) → chưa thì chạy nốt workflow.
4. **Data có đúng kỳ + đúng đơn vị scope của user không?** → check `ngay_hoan_thanh` trong kỳ, `don_vi_id` của user khớp data.
5. **API trả gì?** mở MCP `list_network_requests`:
   - 200 có data nhưng UI rỗng = FE bug
   - 200 data=[] = BE scope filter sai / chưa có data thật
   - 404 = route chưa build (BE bug)
   - Envelope wrap 2 lần = bug serialize (xem memory `qa_htpldn_api_wrap_bug`)
6. **Vẫn không ra?** → log bug với screenshot + API response + state upstream thực tế.

---

## 11. Tham chiếu

| Cần biết chi tiết hơn về... | Đọc file |
|---|---|
| Click-by-click + selector cho từng workflow | [`input/flow-module.md`](../input/flow-module.md) |
| Bảng transition chi tiết 16 module với cột Trigger/Guard/Action/Notify + dropdown source + filter | [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) |
| Map "tạo data ở màn nào / đọc tại màn nào" cho từng entity | [`input/data/entity-map.md`](../input/data/entity-map.md) |
| Giá trị cụ thể cho seed (MST, tên, ngày, số tiền) | [`input/data/seed-fixture.yaml`](../input/data/seed-fixture.yaml) |
| Tài khoản test + convention | [`input/users.csv`](../input/users.csv) |
| **Kế hoạch test thực thi A-Z** | **[plan.md](plan.md)** |
| Tiến độ Round 4 hiện tại (tasks ✅/⏳/🚫) | [todo.md](todo.md) |
| SRS gốc (BA viết) — 17 file | [`input/srs-v3/`](../input/srs-v3/) |

---

## 12. Lịch sử thay đổi

- **2026-04-25 v1.0** — File khởi tạo, consolidate 3 file gốc.
- **2026-04-25 v1.1** — Bổ sung chi tiết SCR + tab cho 17 module sau khi đọc thêm 14 file SRS-v3:
  - SCR-VIII có 10 màn hình (trước chỉ liệt kê 7)
  - SCR-VIII-01 có 14 tab danh mục (trước chỉ ghi "14 tab" không liệt kê)
  - SCR-VIII-06 có 4 tab (SLA/Phân công/Mẫu phản hồi/Quy trình hỗ trợ). **Note 2026-05-05 R12:** Tab "Mẫu phản hồi" — QTHT chỉ Read; CB_NV CRUD theo Mô hình B Hybrid (`pham_vi_ap_dung` IN TW_QUOC_GIA/BN_RIENG/DP_RIENG) per srs-v3 §3.4.2 + srs-update-2026-5-4 §FR-II-NEW-02.
  - SCR-IV-03 chi tiết TVV có 5 tab (trước chỉ ghi 2)
  - SCR-V.I-03 chi tiết VV có 8 accordion + stepper 10 bước
  - SCR-V.III-02 chi tiết DN có 4 tab + 28 trường ở Tab 1
  - SCR-VI-01 ĐG HQ Consolidated v2.1 có 4 tab chi tiết workflow 9 state
  - SCR-V.II-02 Chi trả có Stepper 6 bước + 8 section + công thức auto-calc
  - SCR-X3-01 HĐTV có 5 accordion với editable-table
  - SCR-X1-02 TVCS có Stepper + 5 accordion
  - SCR-II-02 Hỏi đáp có 8 section
  - SCR-III-02 Khóa học có 6 tab (Thông tin/Học viên/Lịch học/Kiểm tra/Chứng nhận/Bài giảng)
  - **§5 Bảng dropdown 30+ move từ plan §3** sang đây vì là kiến thức tham chiếu hệ thống.
- **2026-04-25 v1.2** — Merge nốt phần unique của `logic-data.md` (file gốc archive sang `tasks/_archive/`):
  - **§5.4 Bảng FR-code prereq** (7 dòng) — trace ngược FR-code → SRS, biết action cần prereq gì + sinh data gì cho downstream.
  - **§9 Bản đồ "tab nào cần data nào"** (12 dòng) — tra nhanh khi mở màn hình thấy trống, biết phải seed gì trước.
  - Renumber §10 (tab rỗng phân loại) + §11 (tham chiếu) + §12 (lịch sử). Bỏ ref `logic-data §1.5/§4/§8` thay bằng tham chiếu nội bộ hoặc UI thực tế.
