# Delta Map — FR-07 update (Quản lý DN được Hỗ trợ)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` so với `srs-v3/srs-fr-07-doanh-nghiep.md`, list module bị ảnh hưởng + file QA cần update.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude
> **Source:** Lịch sử thay đổi của file mới (BA chốt 2026-05-05).

---

## 1. Có gì mới / đổi / xoá

### FR bị BỎ (1 FR)

| FR-ID | Tên | Lý do bỏ |
|---|---|---|
| ~~FR-V.III-NEW-01~~ | ~~Import DN từ Excel~~ | DN tự đăng ký TK-first qua **FR-VIII-22** (srs-fr-10). CB Nghiệp vụ KHÔNG còn bulk-import DN. |

### SCR thay đổi

| SCR-ID | Trạng thái | Note |
|---|---|---|
| SCR-V.III-01 Danh sách DN | **Đổi** | BỎ nút "Thêm mới" + "Import Excel". Chỉ còn xem/lọc/xuất Excel. |
| SCR-V.III-02 Chi tiết DN | **Đổi** | BỎ chế độ tạo mới. Chỉ xem/sửa/xóa. URL chỉ `/:id` hoặc `/:id/sua`. |
| SCR-V.III-03 Import DN từ Excel | **Inconsistency** | File mới VẪN còn spec màn hình này (line 387-415) nhưng FR đã bỏ. Cần BA confirm xoá hay giữ. |

### Entity / SM / BR

- **KHÔNG có entity mới.**
- **KHÔNG có SM mới** (DOANH_NGHIEP không có lifecycle).
- DOANH_NGHIEP entity gần giữ nguyên — minor field tweaks (counters `tong_so_vu_viec`, `tong_chi_phi_ho_tro`).

### Logic thay đổi

| Logic | Cũ | Mới |
|---|---|---|
| Cách DN vào hệ thống | CB Nghiệp vụ tạo qua SCR-V.III-02 hoặc bulk-import qua SCR-V.III-03 | **DN tự đăng ký** qua FR-VIII-22 (TK-first registration ở srs-fr-10) |
| Tác nhân tạo DN | CB NV (TW/BN/ĐP) | DN chưa có TK |
| Trạng thái DN sau tạo | Active luôn | TK ở `CHO_KICH_HOAT` → DN bấm link mail → `HOAT_DONG` (qua FR-VIII-26) |
| Liên kết TK ↔ DN | Manual sau khi tạo DN | Auto qua mã số thuế (MST = khóa định danh) |

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-v3.md` (master) | 9 ref FR-V.III-NEW-01 | **A FULL** | Master file — bỏ UC83 + FR-V.III-NEW-01 khỏi 4 bảng (P-07 Bulk Operations, ETL, Volume, Coverage matrix, UC summary) |
| `srs-fr-12-tv-chuyen-sau.md` | 4 ref DN FK | **B DELTA** | Dropdown DN ở TVCS — verify chỉ thấy DN `HOAT_DONG` (sau kích hoạt TK), không thấy DN `CHO_KICH_HOAT` |
| `srs-fr-05-vu-viec.md` | DN FK | **B DELTA** | Dropdown DN ở VV — verify filter state |
| `srs-fr-06-chi-tra.md` | DN FK | **B DELTA** | Dropdown DN ở chi trả — verify filter state |
| `srs-fr-08-danh-gia.md` | DN FK | **B DELTA** | Đánh giá DN — verify dropdown |
| `srs-fr-14-hop-dong-tv.md` | DN FK | **B DELTA** | HĐ với DN — verify dropdown |
| `srs-fr-16-api.md` | DN FK | **B DELTA** | API outbound DN — verify endpoint không gọi import |
| `srs-fr-01-dashboard.md` | DN count | **C IMPACT** | KPI đếm DN — verify count thay đổi (DN giờ ít hơn vì không còn bulk-import) |
| `srs-fr-02-hoi-dap.md`, `srs-fr-03-dao-tao.md`, `srs-fr-04-chuyen-gia-tvv.md`, `srs-fr-09-bieu-mau.md`, `srs-fr-11-bao-cao.md`, `srs-fr-13-tv-nhanh.md`, `srs-fr-15-ct-htpldn.md` | 0-1 ref nhẹ | **D SKIP** | Smoke 5 phút |

**Lưu ý:** FR-13 line 85/423 "import Excel Q&A" KHÁC import DN — KHÔNG bị bỏ. FR-03 line 337-493 "import Excel kết quả đào tạo / học viên" KHÁC import DN — KHÔNG bị bỏ.

---

## 3. Findings critical

1. **SCR-V.III-03 Import DN còn trong file mới (line 387-415) nhưng FR đã bỏ** — cần BA confirm xoá hay giữ làm reference.
2. **DN giờ tạo qua TK-first** — workflow test phải đi qua FR-VIII-22 trước (đăng ký) → FR-VIII-26 (kích hoạt) → mới có DN trong hệ thống.
3. **Migration data cũ**: DN nào tạo bằng CB Nghiệp vụ trước khi update có TK liên kết hay không? Có cần migration script không?
4. **Permission matrix**: CB Nghiệp vụ giờ KHÔNG có quyền tạo DN — chỉ xem/sửa/xóa. Cần update permission matrix.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | DOANH_NGHIEP entity — CB NV bỏ quyền **C** (Create), giữ **R/U/D**. Verify DN chỉ tạo qua DN role self-reg |
| `output/funtion/7.7-*.md` (DN module) | BỎ test case Import Excel + Thêm mới DN (CB NV). Thêm reference đến FR-VIII-22 cho luồng tạo DN |
| `output/smoke-specs/6.7-smoke-*.md` | Bỏ smoke test Import + Thêm mới CB NV. Thêm smoke test self-reg (giao thoa với module srs-fr-10) |
| `tasks/todo.md` | Xoá task seed DN qua bulk-import. Thêm task seed DN qua self-reg API |
| `input/data/seed-fixture.yaml` | Đổi method seed DN: từ direct SQL/CB NV form → qua FR-VIII-22 self-reg API |
| `input/users.csv` | Verify DN role có sẵn TK đã `HOAT_DONG` để test luồng |

**KHÔNG động:**
- `srs-v3/srs-fr-07-doanh-nghiep.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` — file delta source.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-07 (DN module CMS — xem/sửa/xóa DN)** → cite `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:line N`.
- **Test/log bug luồng tạo DN (self-reg)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1005-1090` (FR-VIII-22).
- **Test/log bug luồng kích hoạt TK DN** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1241-1312` (FR-VIII-26).
- **Mâu thuẫn:** SCR-V.III-03 còn trong file mới nhưng FR-V.III-NEW-01 bị bỏ — log thành **bug SRS contradiction**, hỏi BA.

---

## 6. Đáp án từ deep review SRS (2026-05-05)

| # | Câu hỏi | Đáp án | Bằng chứng |
|---|---|---|---|
| 5 | SCR-V.III-03 Import DN xoá hay giữ? | **XOÁ — BA chốt 2026-05-05.** SCR-V.III-03 (line 387-415) là dead spec. QA tester **KHÔNG test SCR này**. Dev không build. BA tự xoá file SRS khi rảnh — QA không sửa file SRS gốc. Coi như đã bỏ. | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:283` (FR đã ghi BỎ) — xác nhận user 2026-05-05 |
| 7 | CB NV bỏ hoàn toàn quyền tạo DN? | **CÓ — bỏ HOÀN TOÀN.** SRS xác nhận 3 chỗ ("KHÔNG có chức năng/nút Thêm mới"). DN chỉ tạo qua self-reg FR-VIII-22. Không có fallback CB NV. | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:83`, `:295`, `:338` |

## 7. Open issues — defer kiểm tra khi test

- **Migration DN cũ tạo bằng CB NV** (câu 6): SRS không cover. Khi gặp DN cũ chưa có TK liên kết → log + hỏi BA/dev khi test.
- **DN không email/chưa ĐKKD** (câu 9): SRS bắt buộc email. Khi gặp edge case real → log + hỏi BA.
- **SCR-V.III-03 dead spec inconsistency:** ≥4 chỗ trong SRS vẫn ref `FR-V.III-NEW-01` (line 66/387/481/561). Note để BA biết khi xoá file. QA bỏ qua.
