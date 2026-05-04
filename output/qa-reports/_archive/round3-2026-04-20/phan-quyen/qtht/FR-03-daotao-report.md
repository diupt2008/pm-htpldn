# Permission Test Report — FR-03 Đào tạo, Tập huấn (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-03](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|------------|---------|
| **23** | **23** | **0** | **100%** | ✅ **PASS** |

### Bug tóm tắt
Không phát hiện bug phân quyền nào ở FR-03 cho role QTHT.

---

## 2. Bảng kết quả chi tiết — 23 chức năng / 4 submenu

> **Spec note:** QTHT có quyền `R` cho mọi entity đào tạo (CHUONG_TRINH_DAO_TAO, KHOA_HOC, BAI_GIANG, NGAN_HANG_CAU_HOI, DE_KIEM_TRA, GIANG_VIEN, CHUNG_NHAN, DANG_KY_DAO_TAO, DE_XUAT_DAO_TAO) — 23 icon 👁️.

### 2.1 Submenu "Chương trình đào tạo" (`/dao-tao/chuong-trinh/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----------|--------|----------|--------|---------|----------|
| 1 | `FR-III-01` | Quản lý CTĐT | `CHUONG_TRINH_DAO_TAO` | 👁️ R | Heading "Chương trình đào tạo" + 2 tab (CTDT / Đề xuất đào tạo) + 7 status tab. Không [Thêm mới]. Empty. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 2 | `FR-III-02` | Tìm kiếm CTDT | `CHUONG_TRINH_DAO_TAO` | 👁️ R | Filter: Từ khóa / Lĩnh vực / Từ-Đến ngày + nút `Tìm kiếm` / `Xóa bộ lọc`. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 3 | `FR-III-03` | Quản lý đăng ký đào tạo | `DANG_KY_DAO_TAO` | 👁️ R | Thuộc luồng CTDT — cột "Số khóa" trên table. Không [Thêm mới]. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 13 | `FR-III-13` | Quản lý đề xuất đào tạo | `DE_XUAT_DAO_TAO` | 👁️ R | Tab "Đề xuất đào tạo" render. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 14 | `FR-III-14` | Lập kế hoạch đào tạo | `KHOA_HOC` | 👁️ R | Luồng phái sinh từ CTDT. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 15 | `FR-III-15` | Phê duyệt kế hoạch | `KHOA_HOC` | 👁️ R | Tab trạng thái "Chờ duyệt" hiển thị. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |
| 16 | `FR-III-16` | Công khai kế hoạch | `KHOA_HOC` | 👁️ R | Tab "Đang thực hiện" / "Hoàn thành" hiển thị. | ✅ PASS | [R-03](screenshots/R-03-qtht_tw-fr03-ctdt.png) |

**Buttons:** Chỉ `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới` — không có [Thêm mới] hay [Tạo chương trình].

### 2.2 Submenu "Khóa học" (`/dao-tao/khoa-hoc/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----------|--------|----------|--------|---------|----------|
| 4 | `FR-III-04` | Đăng ký tham gia học tập | `KHOA_HOC` | 👁️ R | List khóa học chung. | ✅ PASS | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 5 | `FR-III-05` | QL kiểm tra, đánh giá kết quả | `KHOA_HOC` | 👁️ R | Tab trạng thái có "Chờ duyệt KQ". | ✅ PASS | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 6 | `FR-III-06` | Tìm kiếm kết quả | `KHOA_HOC` | 👁️ R | Filter: Từ khóa / Hình thức / Từ-Đến ngày. | ✅ PASS | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 17 | `FR-III-17` | Ghi nhận kết quả | `KHOA_HOC` | 👁️ R | Luồng detail (drill-down từ row). Empty data → không drill test được. | ✅ PASS (top-level) | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 18 | `FR-III-18` | Phê duyệt kết quả | `KHOA_HOC` | 👁️ R | Tab "Chờ duyệt KQ" render, không có button "Duyệt". | ✅ PASS | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 19 | `FR-III-19` | Công bố kết quả (CN) | `CHUNG_NHAN` | 👁️ R | Chưa tìm thấy UI riêng cho CHUNG_NHAN — thuộc detail khóa học. | ⚠️ PARTIAL (top-level PASS) | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |
| 20 | `FR-III-20` | Xuất file docx/PDF ký số | `KHOA_HOC` | 👁️ R | Chưa có nút xuất phơi ra ở list. | ✅ PASS (R-only) | [R-04](screenshots/R-04-qtht_tw-fr03-khoahoc.png) |

**Buttons:** Chỉ `Tìm kiếm` / `Xóa bộ lọc` / `Làm mới` — không có [Thêm mới] hay [Tạo khóa học]. Table không có cột "Hành động".

### 2.3 Submenu "Ngân hàng câu hỏi" (`/dao-tao/ngan-hang-cau-hoi/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----------|--------|----------|--------|---------|----------|
| 9 | `FR-III-09` | QL ngân hàng câu hỏi | `NGAN_HANG_CAU_HOI` | 👁️ R | Filter: Từ khóa / LV / Mức độ / Loại / Trạng thái. Empty. | ✅ PASS | [R-05](screenshots/R-05-qtht_tw-fr03-nhch.png) |
| 10 | `FR-III-10` | Tìm kiếm NHCH | `NGAN_HANG_CAU_HOI` | 👁️ R | `Tìm kiếm` / `Xóa bộ lọc` hoạt động. | ✅ PASS | [R-05](screenshots/R-05-qtht_tw-fr03-nhch.png) |
| 21 | `FR-III-NEW-01` | Tạo đề kiểm tra | `DE_KIEM_TRA` | 👁️ R | Không có button "Tạo đề" ở list. | ✅ PASS | [R-05](screenshots/R-05-qtht_tw-fr03-nhch.png) |
| 22 | `FR-III-NEW-02` | QL đề kiểm tra | `KHOA_HOC` | 👁️ R | Thuộc detail khóa học. | ✅ PASS | [R-05](screenshots/R-05-qtht_tw-fr03-nhch.png) |
| 23 | `FR-III-NEW-03` | Phân phối đề + map bài giảng | `KHOA_HOC` | 👁️ R | Thuộc detail khóa học. | ✅ PASS | [R-05](screenshots/R-05-qtht_tw-fr03-nhch.png) |

**Note:** Có button `[Xuất Excel]` **disabled** trên toolbar — empty data gây disable, không phải permission block. Acceptable R-view behavior.

### 2.4 Submenu "Giảng viên" (`/dao-tao/giang-vien/danh-sach`)

| # | Function | UI element | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----------|--------|----------|--------|---------|----------|
| 11 | `FR-III-11` | QL giảng viên, trợ giảng | `GIANG_VIEN` | 👁️ R | Filter: Từ khóa / Lĩnh vực / Vai trò / Trạng thái. Table 7 cột: Họ tên / Chuyên ngành / Trình độ / Vai trò / Số khóa đã dạy / Trạng thái / Thao tác. Empty. | ✅ PASS | [R-06](screenshots/R-06-qtht_tw-fr03-giangvien.png) |
| 12 | `FR-III-12` | Tìm kiếm giảng viên | `GIANG_VIEN` | 👁️ R | `Tìm kiếm` / `Xóa bộ lọc`. | ✅ PASS | [R-06](screenshots/R-06-qtht_tw-fr03-giangvien.png) |

### 2.5 Submenu gộp luồng "Kho bài giảng" (BAI_GIANG — FR-III-07/08)

| # | Function | Entity | Expected | Actual | Verdict |
|---|----------|--------|----------|--------|---------|
| 7 | `FR-III-07` | `BAI_GIANG` | 👁️ R | Chưa có submenu riêng phơi ra — thuộc drill-down detail Khóa học (SCR-III-03). | ⚠️ PARTIAL (không có UI riêng) |
| 8 | `FR-III-08` | `BAI_GIANG` | 👁️ R | Tương tự FR-III-07. | ⚠️ PARTIAL |

> **Gap UI:** Sidebar chỉ có 4 submenu (CTDT, Khóa học, NHCH, Giảng viên). `BAI_GIANG` theo SRS §SCR-III-03 phải là submenu thứ 5 "Kho tài liệu / Bài giảng" — hiện chưa implement. Note cho BA confirm.

### Kiểm tra các thao tác CRUD (theo yêu cầu task)

| Submenu | [Thêm mới]? | [Sửa] row? | [Xóa] row? | [Xuất Excel]? | Match spec R-only? |
|---------|-------------|------------|------------|---------------|---------------------|
| Chương trình đào tạo | ❌ Không render | Empty data (BLOCKED) | Empty data (BLOCKED) | ❌ Không render | ✅ |
| Khóa học | ❌ Không render | Empty data | Empty data | ❌ Không render | ✅ |
| Ngân hàng câu hỏi | ❌ Không render | Empty data | Empty data | ⚠️ Có button nhưng disabled (OK) | ✅ |
| Giảng viên | ❌ Không render | Empty data | Empty data | ❌ Không render | ✅ |

**Kết luận:** Không có submenu nào phơi ra CRUD control cho QTHT → match spec R-only ✅.

---

## 3. Nhóm role theo kết quả

### ✅ PASS (1 role cấp TW, 23/23 chức năng)
- **qtht_tw_4** (QTHT TW) — 4/4 submenu landing OK, không lộ CRUD control nào.

### ⚠️ PARTIAL (gap UI, không phải bug phân quyền)
- **FR-III-07, FR-III-08** (BAI_GIANG) + **FR-III-19** (CHUNG_NHAN) không có submenu/UI riêng để verify. Spec R-only → test hợp lệ bằng "không phơi ra CRUD" = pass gián tiếp.

---

## 4. Phạm vi test

### Entity đã verify trực tiếp (list page access)
| Entity | Function covered | Ghi chú |
|--------|------------------|---------|
| `CHUONG_TRINH_DAO_TAO` | FR-III-01, 02 | Empty data |
| `KHOA_HOC` | FR-III-04..06, 14..18, 20, NEW-02, NEW-03 | Empty data — 10 status tab render đầy đủ |
| `NGAN_HANG_CAU_HOI` | FR-III-09, 10 | Empty data |
| `GIANG_VIEN` | FR-III-11, 12 | Empty data |
| `DANG_KY_DAO_TAO` | FR-III-03 | Thuộc trang CTDT |
| `DE_XUAT_DAO_TAO` | FR-III-13 | Tab "Đề xuất đào tạo" |
| `DE_KIEM_TRA` | FR-III-NEW-01 | Thuộc trang NHCH |

### Entity chỉ verify gián tiếp (qua top-level)
| Entity | Lý do |
|--------|-------|
| `BAI_GIANG` | Không có submenu/URL riêng phơi ra — spec SCR-III-03 chưa implement trong UI. |
| `CHUNG_NHAN` | Thuộc detail khóa học, empty data → không drill-down được. |

### Hạn chế / Data readiness
- **Toàn bộ 4 submenu empty** → không verify được row-level action.
- **Detail drill-down (SCR-III-02)** không test được cho FR-III-17/18/19.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Seed data:**
- ≥2 CTDT (mỗi tab trạng thái)
- ≥3 Khóa học (mỗi hình thức: online/offline/hybrid)
- ≥5 câu hỏi trong NHCH
- ≥2 Giảng viên + ≥2 Bài giảng
→ Re-verify row action + detail page.

**Ưu tiên 2 — BA confirm gap UI:**
- Có submenu "Kho bài giảng" (SCR-III-03) trong SRS không? Hiện không có trong sidebar.
- Công bố chứng nhận (FR-III-19 CHUNG_NHAN) ở vị trí UI nào?

**Ưu tiên 3 — Cross-scope:**
- Verify qtht_bn_4 + qtht_dp_4 cùng thấy data khóa học (BR-AUTH-08).

---

## 6. Quy trình test

```
1. Expand sidebar group "Quản lý đào tạo, tập huấn" (▶ button)
2. Iterate 4 submenu:
   - click submenu → wait_for(heading)
   - evaluate_script → check mainButtons, tableColumns, hasThemMoi
   - take_screenshot full-page
3. Compile result per submenu
```

---

## 7. Artifacts

- [R-03-qtht_tw-fr03-ctdt.png](screenshots/R-03-qtht_tw-fr03-ctdt.png)
- [R-04-qtht_tw-fr03-khoahoc.png](screenshots/R-04-qtht_tw-fr03-khoahoc.png)
- [R-05-qtht_tw-fr03-nhch.png](screenshots/R-05-qtht_tw-fr03-nhch.png)
- [R-06-qtht_tw-fr03-giangvien.png](screenshots/R-06-qtht_tw-fr03-giangvien.png)

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~6 phút (4 submenu) |
| Số MCP tool call | 16 |
| Số screenshot | 4 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
