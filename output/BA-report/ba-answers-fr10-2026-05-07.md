# Trả lời 11 câu hỏi QA về SRS FR-10 — BA chốt 2026-05-07

| Mục | Giá trị |
|---|---|
| **Người trả lời** | BA |
| **Ngày chốt** | 2026-05-07 |
| **File QA gốc** | `ba-questions-fr10-2026-05-06.md` |
| **Trạng thái** | ✅ **ĐÃ ÁP XONG** vào SRS v3.5 + v4 + CHANGELOG |
| **Files đã sửa** | 4 file SRS (v4 + v3.5 cho srs-fr-10 + srs-fr-02) + CHANGELOG-v3-to-v3.5.md |

---

## A. Tóm tắt chốt — Decision matrix

| Câu | BA chốt | Tóm tắt |
|---|---|---|
| Q1 — Schema NGAY_LE | ☑ Cách 2 (Entity 3.4.3.51) | Mỗi ngày 1 dòng — `ngay` + `nam` + `loai` (NGAY_LE/NGHI_BU/NGHI_KHAC) |
| Q2 — UI tỉnh/thành | ☑ A — Cho QTHT sửa | Thêm UI CRUD Tỉnh/Thành phố (FR-VIII-30 mới + tab 14) |
| Q3 — CHO_PHAN_QUYEN | ☑ A — Bỏ trạng thái | SM 5 → 4 states; bỏ nút "Phân quyền" + SCR-VIII-08a |
| Q4 — AUDIT_LOG limit | ☑ 10.000 dòng | Sửa SCR-VIII-10 (50K) → 10K khớp FR-VIII-28 |
| Q5 — Quá hạn nghiêm trọng | ☑ Giữ `qua_han_he_so 2.0` ở DB, KHÔNG hiển thị UI | Bổ sung field vào FR-VIII-10 Inputs; bỏ cột "QH nghiêm trọng" khỏi SCR Tab 1 |
| Q6 — SM ghi sai FR-VIII-18 | ☑ Sửa thành FR-VIII-15 | 1 dòng SM-TAIKHOAN |
| Q7 — Placeholder FR-VIII-XX | ✓ Đã fix | Không cần sửa |
| Q8 — Đếm trường sai | ☑ "19 DN" → "18 DN" | FR-VIII-22 Acceptance |
| Q9 — FR-VIII-23 thiếu DN | ☑ Thêm DN | Tác nhân: "DN, TVV, CG, NHT" |
| Q10 — SCR-VIII-08a | ☑ Xóa (đồng bộ Q3) | Block stub |
| Q11 — Bỏ cấu hình phân công | ☑ Bỏ + FR-II-06 dùng auto-filter 4 tiêu chí | Bỏ Tab 2 + entity CAU_HINH_PHAN_CONG + FR-II-NEW-01 |

---

## B. Chi tiết từng câu (cho QA tham khảo khi test)

### Q1 — Schema NGAY_LE (Cách 2 — Entity 3.4.3.51)

**Quyết định:** Mỗi ngày lễ 1 dòng. Tết kéo dài 5 ngày = 5 records (cùng `ten_ngay_le="Tết Nguyên đán"`, khác `ngay`).

**Schema chuẩn:**

| Field | Kiểu | Y/N | Ràng buộc |
|---|---|---|---|
| ngay | date | Y | UNIQUE per nam |
| nam | number | Y | CHECK >= 2024; auto-fill = year(ngay) |
| ten_ngay_le | text | Y | Tên dịp (vd "Tết Nguyên đán") |
| loai | text | Y | CHECK IN ('NGAY_LE','NGHI_BU','NGHI_KHAC') |
| ghi_chu | text | N | Ghi chú phụ (vd "Mùng 1") |

**Đã sửa:** FR-VIII-29 Inputs/Processing/Errors/Outputs trong v4 + v3.5/srs-fr-10 line 1399-1438.

---

### Q2 — UI Tỉnh/Thành phố (A — Cho QTHT sửa)

**Quyết định:** Thêm tab thứ 14 "Tỉnh/Thành phố" vào SCR-VIII-01. QTHT có UI CRUD cho 63 tỉnh GSO 01-63 (theo QĐ 124/2004/QĐ-TTg).

**FR mới:** **FR-VIII-30: Quản lý danh mục Tỉnh/Thành phố** (UC mới — phantom FR; CSV không có UC tương ứng)
- 4 trường: ma (UNIQUE GSO), ten, mo_ta, loai_danh_muc='TINH_THANH'
- Áp template TPL-DM-CRUD
- Ràng buộc xóa: kiểm tham chiếu DON_VI.tinh_thanh_id, DOANH_NGHIEP.tinh_thanh_id
- Seed sẵn 63 tỉnh khi deploy DDL

**Đã sửa:**
- v4 + v3.5/srs-fr-10: §header Số FR 27 → 28; SCR-VIII-01 13 → 14 tab; thêm FR-VIII-30 line 1445; cập nhật mô tả Entity DON_VI.tinh_thanh_id

---

### Q3 — Bỏ CHO_PHAN_QUYEN (A — Xóa khỏi SM)

**Quyết định:** Trạng thái CHO_PHAN_QUYEN không có actor/scenario nào trigger (mọi luồng tạo TK đều gán vai trò sẵn). SM-TAIKHOAN giảm từ 5 → 4 states.

**Đã sửa:**
- Entity TAI_KHOAN trang_thai: CHECK enum 5 → 4 giá trị (`CHO_KICH_HOAT, HOAT_DONG, TAM_KHOA, VO_HIEU_HOA`)
- SM-TAIKHOAN: bỏ 2 transitions, gộp `[*] → CHO_KICH_HOAT → HOAT_DONG`
- SCR-VIII-03: bỏ filter, badge, tab "Chờ phân quyền"
- SCR-VIII-03 cột Hành động: bỏ nút "Phân quyền" (revert fix C.5)
- SCR-VIII-08a: stub (xem Q10)
- FR-VIII-22 Step 7 + FR-VIII-26 Step 11: viết lại không ref CHO_PHAN_QUYEN

---

### Q4 — AUDIT_LOG export 10K

**Quyết định:** Giữ FR-VIII-28 ghi 10.000 dòng. Sửa SCR-VIII-10 cho khớp.

**Đã sửa:** v4 + v3.5/srs-fr-10 line 1842 SCR-VIII-10 Quy tắc tương tác: 50K → 10K.

---

### Q5 — Quá hạn nghiêm trọng (DB giữ, không UI)

**Quyết định:**
- DB: giữ field `qua_han_he_so` (Y, default 2.0) ở Entity CAU_HINH_SLA
- FR-VIII-10 Inputs: bổ sung row 7 `qua_han_he_so` (Y, CHECK > 1, default 2.0) — đồng bộ Y/N với Entity
- SCR-VIII-06 Tab 1: bỏ cột "QH nghiêm trọng (%)" — chỉ giữ tooltip-info giải thích hệ số nội bộ

**Đã sửa:** v4 + v3.5/srs-fr-10 FR-VIII-10 Inputs row 7 + Processing bước 2 + SCR-VIII-06 Tab 1 row 14 (tooltip thay cột) + Entity CAU_HINH_SLA (đồng bộ Y).

> **Note deep review:** Phát hiện inconsistency Y/N giữa FR Inputs (Y) và Entity (N) lúc đầu — đã đồng bộ thành Y cả hai chỗ.

---

### Q6 — SM FR Ref FR-VIII-15 (sửa typo)

**Quyết định:** Đổi `FR-VIII-18` (DM Loại hình tiếp nhận, không liên quan TK) → `FR-VIII-15` (Quản lý TK).

**Đã sửa:** SM-TAIKHOAN bảng chuyển trạng thái — gộp 2 dòng cũ thành 1 sau khi Q3 bỏ CHO_PHAN_QUYEN. Bảng còn 2 dòng đầu:
```
| [*]            | CHO_KICH_HOAT | QTHT tạo TK / User đăng ký     | FR-VIII-15, FR-VIII-22 | — |
| CHO_KICH_HOAT  | HOAT_DONG     | User kích hoạt + đặt MK lần đầu | FR-VIII-15, FR-VIII-22, FR-VIII-26 | — |
```

---

### Q7 — Placeholder FR-VIII-XX (đã fix)

QA team đang xem bản SRS cũ. Bản v3.5 hiện tại đã ghi đúng `FR-VIII-26 Quên mật khẩu / Kích hoạt tài khoản lần đầu` ở FR-VIII-22 Postcondition. **Không cần sửa.** QA cần sync version mới.

---

### Q8 — Acceptance đếm "18 DN"

**Đếm thực tế:**
- 18 trường thông tin DN (#1-18: ten_doanh_nghiep, ma_so_thue, giay_cndk, dia_chi, tinh_thanh_id, loai_doanh_nghiep_id, quy_mo, nganh_nghe, so_lao_dong, doanh_thu_nam, tong_nguon_von, nguoi_dai_dien, chuc_vu_dd, email, so_dien_thoai, linh_vuc_kinh_doanh, ghi_chu, file_dinh_kem)
- 2 trường mật khẩu (#19-20)
- 1 ô cam kết (#21)
- **Tổng: 21**

**Đã sửa:** FR-VIII-22 Acceptance dòng 1 line 1089: "19 trường thông tin DN" → "18 trường thông tin DN".

---

### Q9 — FR-VIII-23 Tác nhân thêm DN

**Quyết định:** Tác nhân = "DN, TVV, CG, NHT" (DN dùng VNeID Tổ chức, TVV/CG/NHT dùng VNeID Cá nhân).

**Đã sửa:** v4 + v3.5/srs-fr-10 FR-VIII-23 Mô tả + Tác nhân.

---

### Q10 — SCR-VIII-08a xóa (đồng bộ Q3)

**Quyết định:** Sau khi Q3 bỏ CHO_PHAN_QUYEN, không có TK ở state này → SCR-VIII-08a không có data → xóa.

**Đã sửa:** SCR-VIII-08a → block stub `[ĐÃ BỎ — BA chốt 2026-05-07 Q3+Q10]`.

---

### Q11 — Bỏ Cấu hình phân công + FR-II-06 dùng auto-filter

**Quyết định:**
1. Bỏ Tab 2 SCR-VIII-06 (3 → 2 tab)
2. Bỏ entity CAU_HINH_PHAN_CONG (cả srs-fr-10 + srs-fr-02)
3. Bỏ FR-II-NEW-01 (Cấu hình lĩnh vực ↔ phân công)
4. Sửa FR-II-06 (Phân công Hỏi đáp) Step 5 dùng **auto-filter 4 tiêu chí**

**Cơ chế auto-filter mới (FR-II-06 Step 5):**

```
Bước 1 — Lấy nguồn ứng viên (theo tab Cá nhân/Tổ chức):
  - Cá nhân: TAI_KHOAN của CB NV / TVV / CG / NHT, trạng thái HOAT_DONG
  - Tổ chức: TO_CHUC_TU_VAN trạng thái HOAT_DONG → load TVV thuộc TC

Bước 2 — Lọc cứng theo lĩnh vực:
  - TVV/CG: TU_VAN_VIEN.linh_vuc_chuyen_mon ⊇ HOI_DAP.linh_vuc_id
  - NHT: NGUOI_HO_TRO.linh_vuc_ids[] ⊇ HOI_DAP.linh_vuc_id
  - Tổ chức TV: TO_CHUC_TU_VAN.linh_vuc[] ⊇ HOI_DAP.linh_vuc_id
  - CB Nghiệp vụ: BỎ QUA filter (xử lý mọi lĩnh vực trong đơn vị)

Bước 3 — Lọc cứng theo đơn vị (BR-AUTH-08):
  - CB NV: TAI_KHOAN.don_vi_id = HOI_DAP.don_vi_id
  - TVV/NHT/CG/TC TV: cùng cấp trong mạng lưới (TW/BN/ĐP)

Bước 4 — Sort:
  ORDER BY workload ASC, ho_ten ASC LIMIT 10
  workload = COUNT(HOI_DAP đang xử lý của TK,
                   trang_thai IN ('TIEP_NHAN','DANG_XU_LY','CHO_PHE_DUYET'))
```

**Khác biệt với FR-V.I-09 (Vụ việc):**
- ❌ KHÔNG áp "Ưu tiên DN nữ + LĐ nữ + LĐ khuyết tật" (NĐ 55/2019 Đ.4 chỉ cho VV TVPLDN, không cho hỏi đáp)
- ❌ KHÔNG áp "Điểm đánh giá TVV" (hỏi đáp đơn giản, không xếp hạng)

**Đã sửa srs-fr-10 (8 vị trí):**
1. SCR-VIII-06 header: "Tab Page (3 tabs)" → "Tab Page (2 tabs)"
2. v2.1 note: bỏ "MH-02.6 (Phân công mặc định)" + thêm cite Q11
3. tab gating: bỏ "Tab 2 (Phân công)"
4. Tab navigation: chỉ còn Tab 1 SLA + Tab 2 Mẫu phản hồi
5. Bỏ toàn bộ Tab 2 content (3 rows)
6. Quy tắc tương tác: bỏ ref Tab 2 + thêm dòng "auto-filter 4 tiêu chí"
7. §4 Tổng quan entity row 10: strikethrough CAU_HINH_PHAN_CONG
8. FR-VIII-01 Mô tả + Error Handling: bỏ ref CAU_HINH_PHAN_CONG.linh_vuc_id

**Đã sửa srs-fr-02 (10 vị trí):**
1. §header Số FR: 13 → 12
2. §1 Entity chính: bỏ CAU_HINH_PHAN_CONG
3. FR-II-06 Mô tả: viết lại "auto-filter 4 tiêu chí"
4. FR-II-06 Preconditions: bỏ "Cấu hình lĩnh vực ↔ CB đã thiết lập"
5. FR-II-06 Processing Step 5: viết lại đầy đủ 4 tiêu chí auto-filter
6. FR-II-NEW-01 (~62 dòng): → block stub `[ĐÃ BỎ]`
7. FR-II-NEW-04 (SCR phân công): bỏ ref FR-II-NEW-01 + CAU_HINH_PHAN_CONG, thêm cite auto-filter
8. §4 Tổng quan entity row 4: strikethrough CAU_HINH_PHAN_CONG
9. §4 ERD: xóa block CAU_HINH_PHAN_CONG entity + 2 quan hệ
10. §4 CAU_HINH_PHAN_CONG section (full attribute table): → block stub
11. §6 BR Tổng quan: bỏ ref FR-II-NEW-01 ở BR-AUTH-01, BR-DATA-03, BR-DATA-05

---

## C. Files đã sửa (để QA verify)

| File | LOC trước | LOC sau | Thay đổi chính |
|---|---|---|---|
| `srs-v4/srs-fr-10-quan-tri.md` | 2284 | 2285 | Q1-Q11 áp đầy đủ |
| `srs-v3.5/srs-fr-10-quan-tri.md` | 2285 | 2288 | Đồng bộ v4 + Lịch sử thay đổi 2026-05-07 |
| `srs-v4/srs-fr-02-hoi-dap.md` | 1757 | 1679 | Q11 áp (-78 dòng do bỏ FR-II-NEW-01 + entity) |
| `srs-v3.5/srs-fr-02-hoi-dap.md` | 1640 | 1680 | Đồng bộ v4 + Lịch sử thay đổi |
| `srs-v3.5/CHANGELOG-v3-to-v3.5.md` | 2817 | ~2920 | Section "2026-05-07" mới |

## D. Phát hiện thêm trong deep review (đã fix)

**🔧 Q5 inconsistency Y/N:** Lúc đầu áp `Y` ở FR-VIII-10 Inputs nhưng Entity CAU_HINH_SLA giữ `N` (cũ). Sau deep review đã đồng bộ thành `Y` ở cả 2 chỗ.

## E. Note defer cho lượt review FR-05 sau

FR-V.I-09 (Vụ việc) line 74-79 v4 + v3.5 có ghi "Tiêu chí phân công NHT/TVV (BR-CALC-04 — NĐ 55/2019 Đ.4)" rồi liệt kê các điểm ưu tiên DN — đây là **lẫn lộn** giữa "ưu tiên VV" (gắn vào VV) và "tiêu chí chọn TVV trong dropdown phân công". Cần tách 2 phần ở lượt review FR-05 sau:

- **Phần A — Tiêu chí chọn TVV:** Lọc lĩnh vực + Lọc đơn vị + Sort workload ASC (giống FR-II-06 mới)
- **Phần B — Tiêu chí ưu tiên VV:** DN nữ +3, LĐ nữ +2, LĐ khuyết tật +2, FIFO +1 → gắn vào VV tại FR-V.I-03 (UC53)

→ Ghi note ở CHANGELOG để lượt review FR-05 sau xử lý. **Không sửa trong batch này** để tránh scope creep.

## F. Trạng thái cuối

✅ **Áp xong 11/11 câu QA chốt 2026-05-07** + 1 fix bonus deep review (Q5 Y/N).
✅ **SRS v3.5 sẵn sàng cho QA test** Tier 2:
- FR-VIII-22 (Self-reg DN) — schema NGAY_LE rõ + DM tỉnh thành + bỏ CHO_PHAN_QUYEN
- FR-VIII-26 (Quên MK / Kích hoạt) — đơn giản hóa guard
- FR-VIII-29 (Quản lý ngày lễ) — schema 5 trường mới
- FR-VIII-30 (Quản lý Tỉnh/TP) — FR mới hoàn toàn
- FR-II-06 (Phân công Hỏi đáp) — cơ chế auto-filter 4 tiêu chí mới

QA có thể bắt đầu test ngay.
