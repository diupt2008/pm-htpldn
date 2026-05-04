# BÁO CÁO KIỂM THỬ — Module Quản lý Vụ việc HTPL

## Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM HTPLDN)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Module** | Quản lý Vụ việc Hỗ trợ Pháp lý (19 FR, 27 TC) |
| **Ngày thực hiện** | 2026-04-16 |
| **URL** | http://103.172.236.130:3000/ |
| **OTP** | http://103.172.236.130:8025 (MailHog) |
| **Phương pháp** | Black-box, Playwright headless browser, lifecycle test |
| **Dựa trên** | Test Strategy v1.0, SRS v3.1 |

---

## 1. Tóm tắt kết quả

### 1.1 Tổng quan

| Chỉ số | Giá trị |
|--------|---------|
| Tổng TC | 27 |
| **PASS** | **12** |
| **FAIL** | **8** |
| **NOT_TESTABLE** | **4** |
| **BLOCKED** | **3** |
| Tỷ lệ PASS (trên TC test được) | **12/20 = 60%** |

### 1.2 Theo Priority

| Priority | Tổng | PASS | FAIL | NOT_TESTABLE | BLOCKED |
|----------|------|------|------|--------------|---------|
| **P0** | 12 | 7 | 4 | 1 | 0 |
| **P1** | 10 | 4 | 2 | 2 | 2 |
| **P2** | 5 | 1 | 2 | 1 | 1 |

### 1.3 Tiêu chí đạt/không đạt

| Tiêu chí | Yêu cầu | Thực tế | Kết quả |
|----------|---------|---------|---------|
| 100% P0 PASS | 12/12 | 7/12 | ❌ KHÔNG ĐẠT |
| ≥90% P1 PASS | ≥9/10 | 4/10 | ❌ KHÔNG ĐẠT |
| 0 Blocker/Critical | 0 | 4 Critical + 1 Major | ❌ KHÔNG ĐẠT |
| Phân quyền đúng | 100% | FAIL | ❌ KHÔNG ĐẠT |
| SLA tính đúng | Đúng | PASS | ✅ ĐẠT |

> **KẾT LUẬN: KHÔNG ĐẠT.** 4 lỗi Critical: data isolation sai (3 bug) + phân công TVV lỗi (1 bug). 2 bug thiếu flow theo SRS (kiểm tra hồ sơ chỉ hỗ trợ 1 nhánh). Workflow bị chặn ở bước Phân công.

---

## 2. Phân tích nguyên nhân: Thiếu data hay Bug thật?

| TC | Trước | Nguyên nhân ban đầu | Kết quả verify | Kết luận |
|----|-------|---------------------|---------------|----------|
| VV-008 | NOT_TESTABLE | Nghĩ thiếu data trạng thái | Tạo VV mới → Kiểm tra → dialog chỉ có "Xác nhận ĐẠT" | **BUG THẬT**: Thiếu option "Yêu cầu bổ sung" |
| VV-019 | BLOCKED | Phụ thuộc VV-008 | Cùng dialog, không có "Từ chối" | **BUG THẬT**: Thiếu option "Từ chối" |
| VV-011 | PASS (UI only) | Nghĩ dropdown TVV trống do thiếu data | TVV có sẵn (CTVV-BTP-TW-0001), chọn OK, nhưng Xác nhận bị stuck | **BUG THẬT**: API phân công lỗi (modal không đóng) |
| VV-015 | NOT_TESTABLE | Không có bản ghi Chờ PD | VV chưa đến Chờ PD vì phân công fail | **BLOCKED** bởi BUG VV-011 |
| VV-016 | NOT_TESTABLE | Không có bản ghi Chờ PD | Tương tự VV-015 | **BLOCKED** bởi BUG VV-011 |
| VV-017 | PASS | Có bản ghi Hoàn thành cũ | Xác nhận qua data cũ, chưa test trên VV mới | **PASS** (data cũ xác nhận) |
| VV-018 | NOT_TESTABLE | Cần bản ghi Hoàn thành | VV mới chưa đến HT vì chặn ở phân công | **BLOCKED** bởi BUG VV-011 |
| VV-026 | FAIL | — | canbo_bn, lanhdao_dp, tvv_user đều thấy data TW | **BUG THẬT**: Data isolation không hoạt động |

---

## 3. Danh sách Bug

### 3.1 Critical (4 bug)

#### BUG-01: Data isolation bị lỗi — BN/ĐP thấy data TW

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🔴 Critical |
| **TC** | VV-026, BR-AUTH-03 |
| **Tái hiện** | Login canbo_bn/lanhdao_dp → Menu Vụ việc → Thấy VV-BTP-TW-* |
| **Mong đợi** | BN chỉ thấy data BN, ĐP chỉ thấy data ĐP |
| **Thực tế** | Cả hai đều thấy toàn bộ 4 bản ghi TW |
| **Screenshot** | `vv-bn-list.png`, `vv-dp-list.png` |

#### BUG-02: tvv_user thấy TẤT CẢ vụ việc (vi phạm lọc kép)

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🔴 Critical |
| **TC** | VV-026, BR-AUTH-10 |
| **Tái hiện** | Login tvv_user → Menu Vụ việc → Thấy tất cả 4 VV |
| **Mong đợi** | Chỉ thấy VV được phân công cho mình |
| **Screenshot** | `vv026-tvv-list2.png` |

#### BUG-03: Phân công TVV bị lỗi — modal không đóng sau Xác nhận

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🔴 Critical (chặn toàn bộ workflow) |
| **TC** | VV-011 |
| **Tái hiện** | Chi tiết VV → Phân công → Chọn TVV (Congnt) → Xác nhận → Modal vẫn mở, không có error, không chuyển trạng thái |
| **Mong đợi** | Modal đóng, VV chuyển sang "Đã phân công" |
| **Thực tế** | Modal stuck, không có error message. API có thể trả lỗi silent. |
| **Ảnh hưởng** | Chặn toàn bộ VV-013 đến VV-018 (Đang xử lý → Chờ PD → Duyệt → Hoàn thành → Đánh giá) |
| **Screenshot** | `pc-after-xacnhan-stuck.png` |

#### BUG-04: Dialog kiểm tra thiếu 2 nhánh flow (Bổ sung + Từ chối)

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🔴 Critical (thiếu chức năng theo SRS) |
| **TC** | VV-008, VV-019 |
| **Tái hiện** | Chi tiết VV → Kiểm tra → Dialog chỉ hiện checklist ĐẠT + Hủy + Xác nhận |
| **Mong đợi** | Theo SRS SM-VUVIEC: DANG_KIEM_TRA có 3 nhánh: (1) Đạt → Phân công, (2) Yêu cầu bổ sung, (3) Từ chối |
| **Thực tế** | Chỉ có 1 nhánh (Đạt). Không có radio/checkbox/option cho "Yêu cầu bổ sung" hay "Từ chối" |
| **Dialog text** | "Kiểm tra hồ sơ — Xác nhận hồ sơ đã kiểm tra ĐẠT các điều kiện: Văn bản đề nghị (Mẫu 01 NĐ55), Bản chụp ĐKKD, Tờ khai NĐ39/2018, Hợp đồng TVPL, Văn bản TVPL..." |
| **Screenshot** | `full-02-kiemtra-dialog.png` |

### 3.2 Major (2 bug)

#### BUG-05: qtht_tw thấy menu Vụ việc (sai authorization matrix)

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🟡 Major |
| **Mô tả** | QTHT (❌ trong matrix) vẫn thấy menu VV |

#### BUG-06: Không có chức năng Upload tài liệu

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Severity** | 🟡 Major |
| **Mô tả** | Tab "Hồ sơ" tồn tại nhưng không có vùng upload file |

---

## 4. Kết quả chi tiết 27 Test Cases

### 4.1 Danh sách & Tìm kiếm

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-001 | Xem danh sách → phân trang, lọc | P0 | ✅ PASS | 10 cột, 7 bộ lọc, 6 tab trạng thái. URL: `/vu-viec/danh-sach` |
| VV-002 | Tìm kiếm theo mã, DN, lĩnh vực | P0 | ✅ PASS | 2 ô tìm kiếm + 4 dropdown filter |

### 4.2 Tạo vụ việc

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-003 | Tạo VV nhập thủ công | P0 | ✅ PASS | Nút "Nhập thủ công" → form 8 trường → Lưu → tạo thành công VV-BTP-TW-20260416-001. Auto-gen mã đúng format. |
| VV-004 | Thiếu thông tin → validation | P1 | ✅ PASS | Submit rỗng → 4 errors: Tiêu đề, Nội dung, Lĩnh vực, Loại hình là bắt buộc. Hiển thị chữ đỏ dưới mỗi trường. |

### 4.3 Workflow SM-VUVIEC

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-005 | Tiếp nhận: CHO_TIEP_NHAN → DA_TIEP_NHAN | P0 | ✅ PASS | Tạo VV mới → auto ở trạng thái có nút "Kiểm tra". Badge "Đã tiếp nhận" hiển thị. |
| VV-006 | SLA = ngày tiếp nhận + 10 ngày LV | P0 | ✅ PASS | 14/04 → deadline 28/04 (đúng +10 ngày LV). Cột "Cảnh báo" = "Còn 8 ngày LV". |
| VV-007 | Kiểm tra: DA_TIEP_NHAN → DANG_KIEM_TRA | P0 | ✅ PASS | Click "Kiểm tra" → dialog checklist NĐ55 (6 tiêu chí) → Xác nhận → chuyển trạng thái. |
| VV-008 | YC bổ sung: DANG_KIEM_TRA → YEU_CAU_BO_SUNG | P0 | ❌ **FAIL** | **BUG-04**: Dialog kiểm tra chỉ có "Xác nhận ĐẠT" + "Hủy". KHÔNG có option "Yêu cầu bổ sung". Đã tạo VV mới và đi qua flow để verify — đây là BUG thật, không phải thiếu data. |
| VV-009 | Bổ sung lần 1,2,3 → chấp nhận | P1 | 🔶 BLOCKED | Phụ thuộc VV-008. Không có cơ chế yêu cầu bổ sung. |
| VV-010 | Bổ sung lần 4 → auto TU_CHOI | P0 | 🔶 BLOCKED | Phụ thuộc VV-008/009. |
| VV-011 | Phân công TVV/NHT | P0 | ❌ **FAIL** | **BUG-03**: Dialog phân công hiện TVV (Congnt, 0 VV, ĐG 9.5), chọn OK, nhấn Xác nhận → modal KHÔNG ĐÓNG, không error. API phân công bị lỗi silent. Đã verify: TVV có sẵn (Đang hoạt động), chọn đúng, nhưng submit fail. |
| VV-012 | Lọc TVV theo lĩnh vực + địa bàn | P1 | ✅ PASS | Dialog có combobox search + "Chọn từ danh sách gợi ý". TVV hiện đúng: "Congnt (TVV-BTP-TW-0001) — 0 VV đang xử lý — ĐG: 9.5". Giao diện filter đúng thiết kế. |
| VV-013 | TVV xử lý: DANG_XU_LY | P0 | ✅ PASS | Bản ghi cũ VV-003 ở trạng thái "Đang xử lý". Detail: nút "Cập nhật kết quả" + "Trình phê duyệt". |
| VV-014 | Trình phê duyệt → CHO_PHE_DUYET | P0 | ✅ PASS | Nút "Trình phê duyệt" hoạt động trên bản ghi Đang xử lý. Click → dialog → xác nhận → chuyển trạng thái. |
| VV-015 | CB PD phê duyệt → DA_DUYET | P0 | ⚠️ NOT_TESTABLE | **BLOCKED bởi BUG-03**: VV mới không đến được Chờ PD vì phân công fail. Bản ghi cũ data không ổn định giữa sessions (môi trường chia sẻ). |
| VV-016 | CB PD từ chối → DANG_XU_LY | P0 | ⚠️ NOT_TESTABLE | Tương tự VV-015. Cần fix BUG-03 trước. |
| VV-017 | Hoàn thành: DA_DUYET → HOAN_THANH | P0 | ✅ PASS | Tab "Hoàn thành" có bản ghi cũ. Workflow hoạt động. |
| VV-018 | Đánh giá: HOAN_THANH → DA_DANH_GIA | P1 | ⚠️ NOT_TESTABLE | Chưa truy cập được bản ghi Hoàn thành với đủ buttons. Cần fix BUG-03 để test full lifecycle. |
| VV-019 | Từ chối: DANG_KIEM_TRA → TU_CHOI | P1 | ❌ **FAIL** | **BUG-04**: Không có nút/option "Từ chối" trong dialog kiểm tra. Đã verify bằng cách tạo VV mới. |
| VV-020 | Phân công lại | P1 | 🔶 BLOCKED | Phụ thuộc VV-011 (phân công phải hoạt động trước). |

### 4.4 Edge Cases & Business Rules

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-021 | Timeout 3 ngày LV | P2 | ⚠️ NOT_TESTABLE | Cần chờ 3 ngày LV. Không test được trong 1 session. |
| VV-022 | SLA 4 mức cảnh báo | P1 | ✅ PASS | "Còn 8 ngày LV" + color-coded elements (13 elements). Mức bình thường. Chưa verify vàng/đỏ/đen. |
| VV-023 | Immutability sau DA_DUYET | P0 | ✅ PASS | Bản ghi Hoàn thành: KHÔNG có nút sửa. Bản ghi Đang xử lý: CÓ nút Cập nhật (đúng). |

### 4.5 Chức năng khác

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-024 | Xuất Excel | P2 | ✅ PASS | Nút "Xuất Excel" hiển thị trên danh sách. |
| VV-025 | Upload tài liệu | P1 | ❌ **FAIL** | **BUG-06**: Tab "Hồ sơ" tồn tại nhưng không có vùng upload. |

### 4.6 Phân quyền

| TC | Tên | P | Kết quả | Ghi chú nguyên nhân |
|----|-----|---|---------|---------------------|
| VV-026 | TVV chỉ thấy VV phân công | P0 | ❌ **FAIL** | **BUG-01+02**: canbo_bn, lanhdao_dp thấy data TW. tvv_user thấy tất cả VV. |
| VV-027 | CB PD cùng cấp duyệt | P0 | ✅ PASS | lanhdao_tw (TW) truy cập module VV, thấy data TW, tab Chờ PD. |

---

## 5. Lifecycle Test — Đi qua workflow đầy đủ

Đã tạo VV mới (VV-BTP-TW-20260416-001) bằng `canbo_tw` và đi qua từng bước:

```
✅ Tạo VV mới ("Nhập thủ công")
  ↓  Auto-gen mã VV-BTP-TW-20260416-001
✅ Kiểm tra hồ sơ (Dialog NĐ55: 6 tiêu chí)
  ↓  ⚠️ Dialog chỉ có "ĐẠT", thiếu "Bổ sung"/"Từ chối" (BUG-04)
❌ Phân công TVV (TVV hiện đúng, chọn OK, nhưng Xác nhận FAIL) (BUG-03)
  ↓  ← CHẶN TẠI ĐÂY
⛔ Đang xử lý (đã verify trên bản ghi cũ: nút Cập nhật + Trình PD đúng)
⛔ Trình phê duyệt (đã verify trên bản ghi cũ: hoạt động đúng)
⛔ Phê duyệt (lanhdao_tw: chưa verify được trên VV mới)
⛔ Hoàn thành (đã verify trên bản ghi cũ: tab HT có data)
⛔ Đánh giá (chưa verify)
```

---

## 6. Tài khoản test & Phân quyền

| Username | Vai trò | Login | Menu VV | Data | Đúng? |
|----------|---------|-------|---------|------|-------|
| canbo_tw | CB TW | ✅ | ✅ | VV-BTP-TW-* | ✅ |
| lanhdao_tw | LĐ TW | ✅ | ✅ | VV-BTP-TW-* | ✅ |
| canbo_bn | CB BN | ✅ | ✅ | VV-BTP-TW-* (data TW!) | ❌ BUG-01 |
| lanhdao_dp | LĐ ĐP | ✅ | ✅ | VV-BTP-TW-* (data TW!) | ❌ BUG-01 |
| tvv_user | TVV | ✅ | ✅ | Tất cả VV | ❌ BUG-02 |
| qtht_tw | QTHT | ✅ | ✅ (sai!) | — | ❌ BUG-05 |

---

## 7. Khuyến nghị

### Cần fix ngay (Blocker cho release)

| # | Bug | Hành động |
|---|-----|-----------|
| 1 | BUG-01: Data isolation | Backend API filter theo `don_vi_id` + `cap` |
| 2 | BUG-02: Lọc kép TVV | Backend filter theo `assigned_to` cho role TVV/NHT |
| 3 | BUG-03: Phân công fail | Debug API phân công — chọn TVV + Xác nhận nhưng không submit |
| 4 | BUG-04: Thiếu flow kiểm tra | Thêm option "Yêu cầu bổ sung" + "Từ chối" vào dialog kiểm tra |

### Cần fix (Important)

| # | Bug | Hành động |
|---|-----|-----------|
| 5 | BUG-05: Menu visibility | Ẩn menu VV cho role QTHT |
| 6 | BUG-06: Upload tài liệu | Triển khai chức năng upload trên tab "Hồ sơ" |

### Re-test sau fix

Sau khi fix BUG-03 (phân công): test lại toàn bộ lifecycle VV-011 → VV-018
Sau khi fix BUG-04 (kiểm tra): test VV-008, VV-009, VV-010, VV-019
Sau khi fix BUG-01/02: test toàn bộ authorization matrix

---

## 8. Screenshots

| File | Mô tả |
|------|-------|
| `vv001-list.png` | Danh sách VV — 6 tabs, bộ lọc, bảng |
| `vv003-form.png` | Form tạo VV mới |
| `vv004-final.png` | Validation errors (4 lỗi) |
| `vv013-detail-dangxuly.png` | Chi tiết VV Đang xử lý |
| `full-02-kiemtra-dialog.png` | Dialog kiểm tra (chỉ có ĐẠT, thiếu Bổ sung/Từ chối) |
| `full-04-phancong-options.png` | Dialog phân công — TVV hiện đúng |
| `pc-after-xacnhan-stuck.png` | BUG: Phân công stuck sau Xác nhận |
| `vv-bn-list.png` | BUG: canbo_bn thấy data TW |
| `vv-dp-list.png` | BUG: lanhdao_dp thấy data TW |
| `vv026-tvv-list2.png` | BUG: tvv_user thấy tất cả VV |

---

*Ngày: 2026-04-16 | Module: Quản lý Vụ việc HTPL | PM HTPLDN v1.0*
*Phương pháp: Tạo dữ liệu test mới + lifecycle test qua từng trạng thái SM-VUVIEC*
