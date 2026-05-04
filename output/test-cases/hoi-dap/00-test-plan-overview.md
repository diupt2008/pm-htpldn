# Kế Hoạch Kiểm Thử - SRS-FR-02: Quản Lý Hỏi Đáp, Vướng Mắc Pháp Lý

> **Phiên bản**: 2.0 (Edge Case Review)  
> **Ngày tạo**: 2026-04-18  
> **Cập nhật**: 2026-04-18 — Bổ sung 31 TC từ Edge Case Review (Session `d51cd9c3`)  
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), Session IDs `7176b671` + `d51cd9c3`  
> **SRS Reference**: Nhóm FR-II (Hỏi đáp Pháp lý), SCR-II-01/02/03, Entity HOI_DAP / PHAN_HOI / MAU_PHAN_HOI

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Tổng quan phân hệ
Phân hệ Quản lý Hỏi đáp, Vướng mắc Pháp lý tiếp nhận, xử lý, kiểm duyệt và công khai các câu hỏi pháp lý từ DNNVV. Hệ thống kết nối đa kênh (DVC, Cổng PLQG, Hệ thống khác, Trực tiếp), phân công xử lý cho CB NV, kiểm duyệt bởi CB PD cùng cấp trước khi công khai lên Cổng PLQG qua API trực tiếp.

### 1.2 Danh sách 13 Use Cases

| # | Mã FR | Mã UC | Tên chức năng | File Test Case |
|---|--------|-------|---------------|----------------|
| 1 | FR-II-01 | UC10 | Quản lý thông tin hỏi đáp (CRUD) | `01-TC-quan-ly-hoi-dap.md` |
| 2 | FR-II-02 | UC11 | Tìm kiếm hỏi đáp tổng hợp | `02-TC-tim-kiem-tong-hop.md` |
| 3 | FR-II-03 | UC12 | Tiếp nhận xử lý hỏi đáp | `03-TC-tiep-nhan-xu-ly.md` |
| 4 | FR-II-04 | UC13 | Quản lý thông tin tiếp nhận xử lý | `04-TC-quan-ly-tiep-nhan.md` |
| 5 | FR-II-05 | UC14 | Tìm kiếm hỏi đáp đã tiếp nhận | `02-TC-tim-kiem-tong-hop.md` (gộp §B) |
| 6 | FR-II-06 | UC15 | Phân công xử lý câu hỏi | `05-TC-phan-cong-xu-ly.md` |
| 7 | FR-II-07 | UC16 | Phản hồi câu hỏi | `06-TC-phan-hoi-cau-hoi.md` |
| 8 | FR-II-08 | UC17 | Quản lý công khai phản hồi (Phê duyệt + Công khai) | `07-TC-phe-duyet-cong-khai.md` |
| 9 | FR-II-09 | UC18 | Quản lý câu hỏi đã xử lý (Read-only) | `04-TC-quan-ly-tiep-nhan.md` (gộp §B) |
| 10 | FR-II-10 | UC19 | Tìm kiếm câu hỏi đã xử lý | `02-TC-tim-kiem-tong-hop.md` (gộp §C) |
| 11 | FR-II-NEW-01 | — | Cấu hình lĩnh vực ↔ phân công xử lý | Xem `QTHT/Cau-hinh-he-thong/02-TC-phan-cong.md` |
| 12 | FR-II-NEW-02 | — | Quản lý mẫu câu hỏi/phản hồi | Xem `QTHT/Cau-hinh-he-thong/03-TC-mau-phan-hoi.md` |
| 13 | FR-II-CROSS-01 | — | Cấu hình SLA thời gian xử lý hỏi đáp | Xem `QTHT/Cau-hinh-he-thong/01-TC-SLA.md` |

> **Ghi chú**: FR-II-NEW-01, FR-II-NEW-02, FR-II-CROSS-01 đã được kiểm thử trong module Cấu hình hệ thống (QTHT). Test plan này tập trung vào luồng chính **UC10–UC19** (7 file TC).

### 1.3 Màn hình liên quan (SCR)

| Mã | Tên màn hình | Thành phần UI chính |
|----|-------------|---------------------|
| SCR-II-01 | Danh sách Hỏi đáp | Tabs trạng thái (Tất cả/Mới/Đang xử lý/Chờ duyệt/Đã duyệt/Công khai/Hoàn thành), Toolbar (Thêm mới/Xuất Excel/Làm mới), Bộ lọc đa tiêu chí, Hành động hàng loạt (Xóa/Duyệt/Công khai), Form Thêm/Sửa dạng Drawer/Modal |
| SCR-II-02 | Chi tiết & Soạn Phản hồi | Stepper 6 bước (Mới → Tiếp nhận → Đang xử lý → Chờ duyệt → Đã duyệt → Công khai/Hoàn thành), Accordion (Thông tin câu hỏi / Approval Fields / Timeline / Phản hồi cũ), Rich-text editor, Dropdown chọn mẫu, Checkbox "Đã trả lời", Nút hành động theo trạng thái |
| SCR-II-03 | Phân công xử lý (Modal) | Bảng gợi ý CB/TVV khớp lĩnh vực + workload, Nhãn cảnh báo quá tải, Dropdown chọn người, Textarea ghi chú, Ô chọn thời hạn (default SLA) |

---

## 2. Máy Trạng Thái SM-HOIDAP (9 trạng thái)

```
MOI → TIEP_NHAN → DANG_XU_LY → [DA_TRA_LOI] → CHO_PHE_DUYET → DA_DUYET ↔ CONG_KHAI → HOAN_THANH
 │                                                    ↓                  │
 └→ HUY                                    ← DANG_XU_LY (Từ chối)       └→ HOAN_THANH
```

| Trạng thái | Mã | Luồng chuyển đến | Trigger |
|-----------|-----|-------------------|---------|
| Mới | MOI | TIEP_NHAN, HUY | CB NV nhấn "Tiếp nhận" / "Hủy yêu cầu" |
| Tiếp nhận | TIEP_NHAN | DANG_XU_LY | CB NV phân công người xử lý |
| Đang xử lý | DANG_XU_LY | CHO_PHE_DUYET | CB NV tick "Đã trả lời" + Gửi (BR-FLOW-01 auto-transition) |
| Đã trả lời | DA_TRA_LOI | CHO_PHE_DUYET | Trạng thái trung gian thoáng qua (ẩn trên Stepper) |
| Chờ phê duyệt | CHO_PHE_DUYET | DA_DUYET, DANG_XU_LY | CB PD "Phê duyệt" / "Từ chối" (kèm lý do ≥10 ký tự) |
| Đã duyệt | DA_DUYET | CONG_KHAI, HOAN_THANH | CB NV "Công khai" (API PLQG) / "Đóng hồ sơ" |
| Công khai | CONG_KHAI | DA_DUYET, HOAN_THANH | "Hủy công khai" (API gỡ PLQG) / "Đóng hồ sơ" |
| Hoàn thành | HOAN_THANH | — | Terminal state, bản ghi bị khóa (BR-FLOW-03) |
| Hủy | HUY | — | Terminal state, chỉ từ MOI, yêu cầu confirm + soft delete |

---

## 3. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS

### 3.1 Business Rules (BR)

| Mã | Quy tắc | Trích dẫn SRS |
|----|---------|---------------|
| BR-AUTH-01 | Bắt buộc xác thực đăng nhập | Preconditions mọi UC |
| BR-AUTH-05 | Phê duyệt cùng cấp: CB NV cấp nào → CB PD cùng cấp đó duyệt. Không phê duyệt xuyên cấp | BR-AUTH-05 |
| BR-AUTH-08 | Row-Level Security: TW thấy toàn quốc; BN chỉ thấy BN mình; ĐP chỉ thấy ĐP mình; ngang cấp KHÔNG thấy nhau | BR-AUTH-08 |
| BR-DATA-01 | Soft Delete: is_deleted = 1, không xóa vật lý | BR-DATA-01 |
| BR-DATA-04 | Auto-gen mã: HD-YYYYMMDD-SEQ | BR-DATA-04 |
| BR-DATA-05 | Audit Trail: Mọi CUD + thay đổi trạng thái → AUDIT_LOG bất biến | BR-DATA-05 |
| BR-DATA-07 | Pagination: Default 20 rows/page. Options: 10/20/50/100 | BR-DATA-07 |
| BR-DATA-08 | Full-text search tiếng Việt (unaccent, tsvector) trên trường noi_dung khi > 10.000 bản ghi | BR-DATA-08 |
| BR-FLOW-01 | Auto-transition: Tick "Đã trả lời" → tự động chuyển CHO_PHE_DUYET (bỏ qua bước trình thủ công) | BR-FLOW-01 |
| BR-FLOW-03 | Khóa dữ liệu: DA_DUYET, CONG_KHAI, HOAN_THANH → không cho sửa/xóa | BR-FLOW-03 |
| BR-FLOW-04 | Lý do từ chối: Bắt buộc nhập ≥ 10 ký tự | BR-FLOW-04 |
| BR-FLOW-05 | Công khai trực tiếp: REST API lên Cổng PLQG, không qua LGSP | BR-FLOW-05 |
| BR-SLA-01 | Deadline HOI_DAP = Ngày tiếp nhận + 5 ngày làm việc (T2-T6, trừ NGAY_LE) | BR-SLA-01 / BR-CALC-03 |
| BR-SLA-02 | 4 mức cảnh báo: Bình thường (>50%), Sắp hết hạn (<50%, vàng), Quá hạn (>100%, đỏ), QH nghiêm trọng (>200%, đen) | BR-SLA-02 |
| BR-EC-01 | Optimistic Locking: updated_at timestamp. Xung đột → ERR-SYS-02 + hộp thoại tải lại | BR-EC-01 |
| BR-EC-19 | Phê duyệt hàng loạt: Max 100 bản ghi/batch, per-record processing (không all-or-nothing) | BR-EC-19 |

### 3.2 Error Codes tổng hợp

| Mã lỗi | Điều kiện | Message nguyên văn | Severity |
|---------|-----------|-------------------|----------|
| **Quản lý Hỏi đáp (FR-II-01)** | | | |
| ERR-HD-01 | Nội dung câu hỏi trống | "Nội dung câu hỏi là bắt buộc" | ERROR |
| ERR-HD-02 | Nội dung > 5000 ký tự | "Nội dung câu hỏi tối đa 5000 ký tự" | ERROR |
| ERR-HD-03 | Lĩnh vực PL FK không tồn tại | "Lĩnh vực PL không tồn tại" | ERROR |
| ERR-HD-04 | Sửa/xóa bản ghi đã phê duyệt | "Không thể sửa/xóa bản ghi đã phê duyệt" | ERROR |
| WRN-HD-01 | Xuất Excel > 10.000 dòng | "Hệ thống sẽ xuất 10.000 dòng đầu tiên" | WARNING |
| **Tìm kiếm (FR-II-02, FR-II-05)** | | | |
| INF-HD-TK-01 | Không tìm thấy kết quả | "Không tìm thấy hỏi đáp phù hợp" | INFO |
| ERR-HD-TK-01 | Ngày bắt đầu > ngày kết thúc | "Ngày bắt đầu phải trước ngày kết thúc" | ERROR |
| INF-HD-TK-02 | Không tìm thấy hỏi đáp đã tiếp nhận | "Không tìm thấy hỏi đáp đã tiếp nhận phù hợp" | INFO |
| **Tiếp nhận (FR-II-03)** | | | |
| ERR-TN-01 | Hỏi đáp đã được tiếp nhận | "Hỏi đáp đã được tiếp nhận bởi {người khác}" | ERROR |
| ERR-TN-02 | Hỏi đáp không tồn tại / đã bị xóa | "Hỏi đáp không tồn tại hoặc đã bị xóa" | ERROR |
| ERR-TN-03 | Xung đột Optimistic Locking tiếp nhận | "Bản ghi đã được tiếp nhận bởi người khác" | ERROR |
| **Phân công (FR-II-06)** | | | |
| ERR-PC-01 | Người được chọn đã bị vô hiệu hóa | "Người được chọn đã bị vô hiệu hóa" | ERROR |
| ERR-PC-02 | Trạng thái không cho phép phân công | "Hỏi đáp ở trạng thái '{tt}' không thể phân công" | ERROR |
| WRN-PC-01 | Workload quá tải (cảnh báo, không chặn) | "CB {tên} đang xử lý {N} yêu cầu. Xác nhận phân công?" | WARNING |
| **Phản hồi (FR-II-07)** | | | |
| ERR-PH-01 | Nội dung phản hồi trống | "Nội dung phản hồi là bắt buộc" | ERROR |
| ERR-PH-02 | Trạng thái không cho phản hồi | "Hỏi đáp ở trạng thái '{tt}' không thể phản hồi" | ERROR |
| WRN-PH-01 | Người soạn không phải người được phân công | "Bạn không phải người được phân công. Vẫn muốn phản hồi?" | WARNING |
| **Phê duyệt & Công khai (FR-II-08)** | | | |
| ERR-PD-01 | Phê duyệt xuyên cấp | "Bạn không có quyền phê duyệt bản ghi thuộc đơn vị khác cấp" | ERROR |
| ERR-PD-02 | Lý do từ chối trống / < 10 ký tự | "Vui lòng nhập lý do từ chối" | ERROR |
| ERR-PD-03 | Hỏi đáp không ở CHO_PHE_DUYET | "Hỏi đáp không ở trạng thái chờ phê duyệt" | ERROR |
| ERR-PD-04 | Lỗi kết nối API Cổng PLQG | "Lỗi kết nối Cổng PLQG. Vui lòng thử công khai lại" | ERROR |
| ERR-PD-05 | Phê duyệt hàng loạt > 100 bản ghi | (vượt 100 bản ghi/batch) | ERROR |
| WRN-PD-01 | Batch approve kết quả hỗn hợp | "{N} duyệt thành công, {M} lỗi" | WARNING |
| **Hệ thống chung** | | | |
| ERR-SYS-02 | Optimistic Locking conflict | "Bản ghi đã bị thay đổi bởi người khác. Vui lòng tải lại trang" | ERROR |
| ERR-FILE-01 | Dung lượng lưu trữ đầy | "Dung lượng lưu trữ đã đầy, liên hệ quản trị viên" | ERROR |
| ERR-FILE-02 | File chứa mã độc (ClamAV) | "Tệp chứa mã độc, không thể upload" | ERROR |

### 3.3 Permission Matrix

| Entity | QTHT | CB_NV_TW | CB_NV_BN/ĐP | CB_PD_TW | CB_PD_BN/ĐP | DN | NHT/TVV/CG |
|--------|------|----------|-------------|----------|-------------|-----|-----------|
| HOI_DAP | 👁️ R | ✅ CRU*D | ✅ CRU*D (scoped) | 👁️ R | 👁️ R* (scoped) | 🔌 C† (API) | ❌ |
| PHAN_HOI | 👁️ R | ✅ CRU* | ✅ CRU* (scoped) | 📝 RU* | 📝 RU* (scoped) | ❌ | ❌ |
| MAU_PHAN_HOI | 👁️ R | ✅ CRUD | ✅ CRUD (scoped) | 👁️ R* | 👁️ R* (scoped) | ❌ | ❌ |

> **Ký hiệu**: R=Read, C=Create, U=Update, D=Delete (soft), *=scoped theo đơn vị, †=API only (không CMS)

### 3.4 Ràng buộc dữ liệu HOI_DAP

| Trường | Bắt buộc | Kiểu | Ràng buộc |
|--------|----------|------|-----------|
| ma_hoi_dap | Có (Auto) | text | UNIQUE, format HD-YYYYMMDD-SEQ |
| noi_dung | Có | rich text | Max 5000 ký tự, ERR-HD-01 nếu trống, ERR-HD-02 nếu vượt |
| linh_vuc_id | Có | FK | Phải tồn tại trong DANH_MUC (UC99), ERR-HD-03 nếu không |
| kenh_tiep_nhan | Có | enum | DVC / CONG_PLQG / TRUC_TIEP / HE_THONG_KHAC |
| ten_nguoi_gui | Không | text | — |
| email_nguoi_gui | Không | text | — |
| sdt_nguoi_gui | Không | text | — |
| doanh_nghiep_id | Không | FK | DN liên kết |
| file_dinh_kem | Không | binary[] | doc/docx/xls/xlsx/pdf. Max 20MB/file. Quét ClamAV khi upload. API: max 10 files/request |

---

## 4. Cấu Trúc File Test Case

```
hoi-dap/
├── 00-test-plan-overview.md                ← File này
├── 01-TC-quan-ly-hoi-dap.md               ← UC10: CRUD Hỏi đáp (FR-II-01)
├── 02-TC-tim-kiem-tong-hop.md              ← UC11/14/19: Tìm kiếm (FR-II-02/05/10)
├── 03-TC-tiep-nhan-xu-ly.md               ← UC12: Tiếp nhận (FR-II-03)
├── 04-TC-quan-ly-tiep-nhan.md             ← UC13/18: QL tiếp nhận + QL đã xử lý (FR-II-04/09)
├── 05-TC-phan-cong-xu-ly.md               ← UC15: Phân công (FR-II-06)
├── 06-TC-phan-hoi-cau-hoi.md              ← UC16: Phản hồi (FR-II-07)
├── 07-TC-phe-duyet-cong-khai.md           ← UC17: Phê duyệt + Công khai (FR-II-08)
└── edge-case-review-FR02.md               ← Edge Case Hunter Review Report
```

---

## 5. Tổng Quan Số Lượng Test Cases

| File | Happy | Negative | Edge | Bổ sung (ECR) | Tổng |
|------|-------|----------|------|---------------|------|
| 01 - Quản lý hỏi đáp (CRUD) | 5 | 5 | 3 | +7 Edge, +1 Neg | **27** |
| 02 - Tìm kiếm tổng hợp (3 UC gộp) | 4 | 2 | 4 | +2 Edge | **12** |
| 03 - Tiếp nhận xử lý | 3 | 4 | 3 | +2 Edge | **12** |
| 04 - QL tiếp nhận + QL đã xử lý | 3 | 2 | 3 | +3 Edge | **11** |
| 05 - Phân công xử lý | 3 | 3 | 4 | +2 Edge | **12** |
| 06 - Phản hồi câu hỏi | 4 | 3 | 4 | +5 Edge | **16** |
| 07 - Phê duyệt + Công khai + Hủy | 5 | 5 | 9 | +9 Edge | **28** |
| **TỔNG** | **27** | **25** | **61** | **+31** | **118** |

> **ECR** = Edge Case Review (`edge-case-review-FR02.md`, 2026-04-18).  
> Cột "Bổ sung" hiển thị số TC mới từ review, đã được append vào từng file TC tương ứng.

---

## 6. SRS Gaps Đã Xác Nhận Từ NotebookLM

### 6.1 Gaps gốc (v1.0 — Session `7176b671`)

| # | Gap | Chi tiết | Rủi ro |
|---|-----|---------|--------|
| G1 | Self-approve restriction | SRS KHÔNG có rule `nguoi_duyet_id != nguoi_tao_id`. Nếu 1 user có cả CB_NV + CB_PD → có thể tự duyệt | 🔴 Security |
| G2 | Giới hạn số file đính kèm form CMS | SRS không ghi rõ max số file (chỉ 20MB/file). API riêng: max 10 files/request | 🟡 Boundary |
| G3 | Cột xuất Excel HOI_DAP | SRS không định nghĩa cứng danh sách cột xuất (thường ánh xạ cột đang hiển thị) | 🟢 Minor |
| G4 | Nội dung mẫu thông báo | SRS chỉ định nghĩa entity THONG_BAO (tieu_de, noi_dung) nhưng không có template text | 🟢 Minor |
| G5 | Max length lý do từ chối | SRS quy định min 10 ký tự nhưng KHÔNG có max length | 🟢 Minor |

### 6.2 Gaps bổ sung (v2.0 — Edge Case Review Session `d51cd9c3`)

| # | Gap | Chi tiết | Rủi ro | TC liên quan |
|---|-----|---------|--------|--------------|
| G6 | SEQ Collision Mechanism | SRS quy định ma_hoi_dap UNIQUE + HD-YYYYMMDD-SEQ nhưng không mô tả Atomic Counter (DB Sequence vs App-level). Cần SA/Dev xác nhận | 🔴 Data Integrity | TC-HD-023 |
| G7 | DA_PHAN_CONG xung đột SM | FR-II-06 ghi trạng thái DA_PHAN_CONG nhưng SM-HOIDAP KHÔNG chứa trạng thái này. Phân công → chuyển thẳng TIEP_NHAN → DANG_XU_LY | 🟡 State Machine | TC-QL-011 |
| G8 | Permission vs UI inconsistency (CB_PD) | Permission Matrix cấp U (Update) trên PHAN_HOI cho CB_PD, nhưng UI SCR-II-02 KHÔNG cung cấp form sửa. CB PD phải [Từ chối] để trả lại | 🟡 Security/UX | TC-PD-022 |
| G9 | Reject loop vô hạn | SRS không giới hạn số lần từ chối-soạn lại. Tiềm ẩn infinite loop CB_PD ↔ CB_NV | 🟢 Business Logic | TC-PH-013 |
| G10 | Partial date range filter | SRS không mô tả hành vi khi chỉ nhập tu_ngay mà không nhập den_ngay (hoặc ngược lại) | 🟢 UX | TC-TK-012 |

---

## 7. Đặc Điểm Cần Lưu Ý Khi Kiểm Thử

1. **Optimistic Locking** sử dụng `updated_at` timestamp: Khi 2 CB cùng tiếp nhận → ERR-TN-01/ERR-TN-03.
2. **Auto-transition (BR-FLOW-01)**: Tick "Đã trả lời" → bỏ qua trạng thái DA_TRA_LOI → thẳng CHO_PHE_DUYET.
3. **Phê duyệt cùng cấp (BR-AUTH-05)**: CB NV cấp BN tạo → chỉ CB PD cấp BN duyệt. CB_PD_TW xem toàn bộ nhưng KHÔNG duyệt xuyên cấp.
4. **Row-Level Security (BR-AUTH-08)**: CB BN KHÔNG thấy data của BN khác; CB ĐP KHÔNG thấy data ĐP khác.
5. **Khóa dữ liệu (BR-FLOW-03)**: DA_DUYET/CONG_KHAI/HOAN_THANH → ERR-HD-04 khi sửa/xóa. Lưu ý: CHO_PHE_DUYET khóa PHAN_HOI nhưng KHÔNG khóa câu hỏi gốc (HOI_DAP).
6. **SLA Deadline**: Chỉ đếm ngày làm việc (T2-T6), trừ NGAY_LE. Background job quét mỗi 30 phút. Chú ý chuỗi nghỉ lễ liên tiếp (30/04+01/05).
7. **Hủy yêu cầu**: Chỉ từ MOI, khi KHÔNG có PHAN_HOI con. CB NV thực hiện, yêu cầu confirm.
8. **Stepper UI**: 6 bước hiển thị (ẩn DA_TRA_LOI và DA_PHAN_CONG).
9. **File upload**: Quét ClamAV ngay khi upload, trước khi lưu. ERR-FILE-02 nếu virus. Chỉ chấp nhận 5 extension: doc/docx/xls/xlsx/pdf.
10. **Batch operations**: Xóa/Duyệt/Công khai hàng loạt max 100/batch, per-record. KHÔNG có Từ chối hàng loạt (BR-FLOW-04 yêu cầu lý do riêng).
11. **Nút [Làm mới]**: Chỉ AJAX reload, GIỮ NGUYÊN bộ lọc + scroll. Dùng [Xóa bộ lọc] để reset.
12. **Confirm dialogs bắt buộc**: Xóa HL, Duyệt HL, CK HL, Duyệt đơn, CK đơn, Hủy CK, Đóng HS, Hủy yêu cầu.
13. **PHAN_HOI 1:N**: Một HOI_DAP có nhiều PHAN_HOI con (lịch sử từ chối-soạn lại). Card-list "Phản hồi cũ" hiển thị tất cả, mới nhất trên cùng. Không giới hạn số lần.
14. **API Rollback (BR-EC-20)**: Công khai/Hủy CK → nếu API Cổng PLQG fail → KHÔNG set trạng thái mới, giữ nguyên trạng thái cũ.
15. **Sort mặc định**: Ngày tạo DESC. Chỉ cột "Ngày tạo" là sortable.

---

*Kế hoạch kiểm thử tạo bởi QA Automation | NotebookLM Sessions `7176b671` + `d51cd9c3` | 2026-04-18*
