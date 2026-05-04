# Test Cases — FR-V.III-NEW-01: Import DN từ Excel

> **SRS Ref**: FR-V.III-NEW-01, SCR-V.III-03 (Wizard 3 bước), Entity DOANH_NGHIEP
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`)
> **Ngày tạo**: 2026-04-30
> **Đặc thù**: Wizard 3 bước (Upload → Kiểm tra → Kết quả). MERGE bỏ qua trùng MST. Max 1.000 dòng/file. Validate format MST 10/13 số riêng cho import (khác CRUD).

---

## Quy ước

(Cùng quy ước file 01)

---

## Cột Excel chuẩn (srs-fr-07:296-308)

| Cột | Map field | Bắt buộc | Validate |
|-----|-----------|----------|----------|
| Tên DN | ten_doanh_nghiep | Y | Không rỗng |
| Mã số thuế | ma_so_thue | Y | Format 10/13 số, unique |
| Địa chỉ | dia_chi | Y | Không rỗng |
| Loại DN | loai_doanh_nghiep | Y | Mapping UC105 |
| Quy mô | quy_mo | Y | SIEU_NHO / NHO / VUA |
| Người đại diện | nguoi_dai_dien | N | — |
| SĐT | so_dien_thoai | N | Format số |
| Email | email | N | Format email |

---

## A. UI FIELD VERIFICATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-IMP-UI-01 | FR-V.III-NEW-01 / SCR-V.III-03 / UI | Verify trường thông tin SCR-V.III-03 (Wizard Import): 11 components — stepper, upload zone, buttons per step | 1. cb_nv_tw_01 login. 2. Click [Import Excel] từ SCR-V.III-01. | — | 1. Quan sát Bước 1: stepper, vùng kéo thả, nút [Tải mẫu]. 2. Upload file hợp lệ → chuyển Bước 2: thống kê, bảng preview, tab filter. 3. Confirm → Bước 3: báo cáo, chi tiết lỗi, nút [Tải báo cáo]. 4. Kiểm tra action bar từng bước. | (3) **Bước 1**: Stepper "Upload → Kiểm tra → Kết quả" (row#1), Vùng kéo thả file ".xlsx, tối đa 5MB" (row#2), [Tải mẫu Excel] button (row#3), [Upload] button (row#11), [Hủy] button (row#10). **Bước 2**: Thống kê "Tổng dòng / Hợp lệ / Lỗi / Trùng MST" label (row#4), Bảng preview table (row#5), Tab filter "Tất cả / Hợp lệ / Lỗi / Trùng" (row#6), [Xác nhận Import] button (row#11), [Quay lại] button (row#10). **Bước 3**: Báo cáo "Tổng / Thành công / Trùng / Lỗi" label (row#7), Chi tiết lỗi table (row#8, nếu có), [Tải báo cáo] button (row#9), [Về danh sách] button (row#11). **Phần tử KHÔNG có**: không có nút [Xóa file đã upload] ở Bước 2 (chỉ [Quay lại]). | Happy 🔴 |

---

## B. WIZARD HAPPY PATH

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-IMP-001 | FR-V.III-NEW-01 / SCR-V.III-03 row#3 | Bước 1 — Tải mẫu Excel | 1. cb_nv_tw_01 login. 2. Mở SCR-V.III-03 (click [Import Excel] từ danh sách). | — | 1. Tại bước 1, click [Tải mẫu Excel]. | (3) Download file mẫu `.xlsx` mở được; chứa header 8 cột (Tên DN/MST/Địa chỉ/Loại DN/Quy mô/Người ĐD/SĐT/Email) + 1 dòng ví dụ (srs-fr-07:480). | Happy 🟡 |
| TC-IMP-002 | FR-V.III-NEW-01 / Processing 1-7 | Upload file 5 DN hợp lệ → import 5 thành công | 1. Login. 2. File `dn_5rows_valid.xlsx` (5 DN unique MST 10 số, đủ field bắt buộc). | file size <100KB | 1. Click vùng kéo thả, upload `dn_5rows_valid.xlsx`. 2. Bước 2: review 5 hợp lệ. 3. Click [Xác nhận Import]. 4. Bước 3: xem báo cáo. | (1) DB: 5 record DOANH_NGHIEP mới với don_vi_id=cb_nv_tw_01 đơn vị, mã auto-gen. AUDIT_LOG: 5 entry CREATE (BR-DATA-05). (2) Bước 2 thống kê "Tổng 5 / Hợp lệ 5 / Lỗi 0 / Trùng 0"; bước 3 báo cáo "Tổng 5 / Thành công 5 / Trùng (bỏ qua) 0 / Lỗi 0". (3) Click [Về danh sách] → 5 DN mới hiện đầu list. | Happy 🔴 |
| TC-IMP-003 | FR-V.III-NEW-01 / row#9 | Bước 3 — Tải báo cáo Excel kết quả | 1. Tiếp TC-IMP-002. | — | 1. Tại bước 3, click [Tải báo cáo]. | (3) Download file `import-report.xlsx` mở được; chứa cột Dòng / MST / Trạng thái (Thành công/Trùng/Lỗi) / Lý do (nếu lỗi). 5 dòng "Thành công". | Happy 🟢 |
| TC-IMP-004 | FR-V.III-NEW-01 / Processing 7 (MERGE) | File có 3 hợp lệ + 2 trùng MST → import 3, bỏ qua 2 | 1. Login. 2. Seed DN-X MST="0100100101" tồn tại. 3. File 5 dòng: 3 MST mới + 2 dòng MST trùng (1 trùng "0100100101", 1 trùng nhau trong file). | — | 1. Upload. 2. Bước 2 review. 3. Confirm. | (1) DB: thêm 3 DN mới (3 dòng MST mới). 2 dòng trùng MST KHÔNG được tạo, KHÔNG update DN cũ (MERGE = INSERT-only, srs-fr-07:481). AUDIT_LOG: 3 CREATE entry. (2) Bước 2: "Tổng 5 / Hợp lệ 3 / Trùng 2"; bước 3 báo cáo có info INF-IMP-DN-01: **"Dòng {N}: MST {X} đã tồn tại, bỏ qua"** (srs-fr-07:348). (3) List có 3 DN mới + DN-X cũ giữ nguyên. | Happy 🔴 |
| TC-IMP-005 | FR-V.III-NEW-01 / SCR-V.III-03 row#6 | Tab filter Bước 2 — Tất cả/Hợp lệ/Lỗi/Trùng | 1. File 10 dòng: 6 hợp lệ + 2 lỗi + 2 trùng. | — | 1. Upload. 2. Bước 2: click tab "Hợp lệ". 3. Click tab "Lỗi". 4. Click tab "Trùng". | (3) Tab "Tất cả" 10 dòng; tab "Hợp lệ" 6; tab "Lỗi" 2 (highlight đỏ); tab "Trùng" 2 (highlight cam). Stats summary cập nhật theo tab active. | Happy 🟡 |

---

## B. NEGATIVE — VALIDATION FILE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-IMP-010 | FR-V.III-NEW-01 / E1 ERR-IMP-DN-01 | Upload file `.csv` → reject | 1. Login. 2. File `dn.csv`. | — | 1. Drop file .csv. | (1) DB không thay đổi. (2) Error: **"Chỉ chấp nhận file Excel (.xlsx)"** (ERR-IMP-DN-01, srs-fr-07:344). (3) Wizard giữ ở Bước 1, không pass Bước 2. | Negative 🔴 |
| TC-IMP-011 | FR-V.III-NEW-01 / E1 ERR-IMP-DN-01 | Upload file `.xls` (cũ) → reject | Login. File legacy `.xls`. | — | 1. Drop. | (2) Error ERR-IMP-DN-01 (chỉ accept `.xlsx`). | Negative 🟡 |
| TC-IMP-012 | FR-V.III-NEW-01 / E2 ERR-IMP-DN-02 | Upload file > 5MB → reject | Login. File `.xlsx` size 5.5MB. | — | 1. Drop. | (1) DB không thay đổi. (2) Error: **"File tối đa 5MB"** (ERR-IMP-DN-02, srs-fr-07:345). (3) Wizard giữ Bước 1. | Negative 🔴 |
| TC-IMP-013 | FR-V.III-NEW-01 / E2 boundary 5MB | Upload file = 5.0MB exact → accept | Login. File `.xlsx` exactly 5,242,880 bytes. | — | 1. Drop. | (3) Pass Bước 1. ⚠️ **SRS không quote inclusive/exclusive — TC default ≤5MB inclusive (5MB OK, 5.001MB reject)**. Verify thực tế. | Edge 🟡 |
| TC-IMP-014 | FR-V.III-NEW-01 / E3 ERR-IMP-DN-03 | File thiếu cột "Mã số thuế" → reject | Login. File `.xlsx` chỉ có 7 cột (thiếu MST). | — | 1. Drop. | (2) Error: **"File thiếu cột: Mã số thuế"** (ERR-IMP-DN-03, srs-fr-07:346). | Negative 🔴 |
| TC-IMP-015 | FR-V.III-NEW-01 / E4 ERR-IMP-DN-04 | Dòng có MST format sai (8 số) → lỗi dòng | Login. File 5 dòng, dòng 3 MST="12345678" (8 số, không phải 10/13). | — | 1. Upload. 2. Bước 2 review. | (2) Bước 2: dòng 3 highlight lỗi. Bước 3 chi tiết: **"Dòng 3, cột Mã số thuế: format không hợp lệ (10/13 số)"** (ERR-IMP-DN-04 pattern srs-fr-07:347). (1) DB chỉ thêm 4 dòng hợp lệ (file partial-success — KHÔNG reject toàn file). | Negative 🔴 |
| TC-IMP-016 | FR-V.III-NEW-01 / E4 boundary | MST 13 số (boundary upper) → accept | Login. File 1 dòng MST="0123456789012" (13 số). | — | 1. Upload. 2. Confirm. | (1) DB lưu thành công. (3) MST 13 số hợp lệ (Excel column rule "10/13 số" srs-fr-07:301). | Edge 🟡 |
| TC-IMP-017 | FR-V.III-NEW-01 / E4 boundary | MST 11 số (giữa 10-13) → reject | Login. File 1 dòng MST="01234567890" (11 số). | — | 1. Upload. | (2) ERR-IMP-DN-04: format không hợp lệ. ⚠️ Lưu ý: SRS quote "10/13 số" — chỉ chấp nhận đúng 10 hoặc 13, không chấp nhận 11/12. Flag verify. | Edge 🟡 |
| TC-IMP-018 | FR-V.III-NEW-01 / E4 | Dòng có Quy mô không hợp lệ ("LON") → lỗi dòng | Login. File 5 dòng, dòng 2 Quy mô="LON". | — | 1. Upload. | (2) Dòng 2 lỗi: "Dòng 2, cột Quy mô: giá trị 'LON' không hợp lệ (chỉ chấp nhận SIEU_NHO/NHO/VUA)". (1) 4 dòng còn lại import OK. | Negative 🟡 |
| TC-IMP-019 | FR-V.III-NEW-01 / Inputs#1 boundary 1000 dòng | File đúng 1.000 dòng → import OK | Login. File 1000 dòng valid. | — | 1. Upload. 2. Confirm. | (1) DB: 1000 record. (3) Bước 3 báo cáo "Tổng 1000". ⚠️ **SRS quote "max 1.000 dòng" — boundary 1000 inclusive accept**. | Edge 🟢 |
| TC-IMP-020 | FR-V.III-NEW-01 / E2 boundary 1001 | File 1.001 dòng → reject | Login. File 1001 dòng. | — | 1. Upload. | (2) Error reject **"File vượt quá 1.000 dòng"** (**SRS Gap: chưa có mã lỗi cụ thể cho overflow rows — verify**). (1) DB không thay đổi. | Negative 🟡 |

---

## C. EDGE & SECURITY

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-IMP-030 | FR-V.III-NEW-01 / SCR-V.III-03 row#10 | Click [Hủy/Quay lại] giữa Bước 2 | 1. Đã upload file pass Bước 1. 2. Đang ở Bước 2 review. | — | 1. Click [Hủy/Quay lại]. | (1) DB không thay đổi (chưa confirm). (3) Wizard quay về Bước 1, file đã upload bị clear. | Edge 🟡 |
| TC-IMP-031 | FR-V.III-NEW-01 / Processing | File rỗng (header only) → reject | Login. File `.xlsx` chỉ có header, 0 data row. | — | 1. Upload. | (2) Error: **"File không có dữ liệu"** (**SRS Gap: chưa quote message — verify**). | Edge 🟢 |
| TC-IMP-032 | FR-V.III-NEW-01 / E4 | Dòng có ký tự Unicode + emoji trong tên DN | Login. File 1 dòng ten="Công ty 🇻🇳 Á Đông". | — | 1. Upload + confirm. | (1) DB lưu UTF-8 đúng. (3) List render đúng emoji. | Edge 🟢 |
| TC-IMP-033 | FR-V.III-NEW-01 / BR-AUTH-08 | Import — DN mới gán don_vi_id của user import | 1. cb_nv_dp_01 (Sở TP HCM) login. 2. File 3 DN không có cột tỉnh thành. | — | 1. Upload + confirm. | (1) DB: 3 DN mới, `don_vi_id` = đơn vị Sở TP HCM (theo user import — BR-AUTH-08 multi-tenant). KHÔNG để null. | Edge 🔴 |
| TC-IMP-034 | FR-V.III-NEW-01 / BR-EC-13 | File chứa cell formula injection (`=cmd|`...) | Login. File có cell `=cmd|'/c calc'!A1`. | — | 1. Upload + import. | (1) DB lưu literal text. (3) Khi user xuất Excel sau, cell phải được escape (prefix `'` hoặc disable formula). KHÔNG execute formula trên client mở Excel. ⚠️ Verify backend sanitize. | Edge 🔴 |
| TC-IMP-040 | FR-V.III-NEW-01 / E1 ERR-IMP-DN-01 | File `.xlsm` (Excel macro) | Login. File Excel có macro. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS quote "file Excel (.xlsx)" (srs-fr-07:344) — `.xlsm` extension khác. Default expected reject với ERR-IMP-DN-01. Flag verify (vì security: macro có thể nguy hiểm). | Negative 🔴 |
| TC-IMP-041 | FR-V.III-NEW-01 / E1 + security | Bypass extension: rename `.exe` → `.xlsx` | Login. File `.exe` đổi tên thành `.xlsx`. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: chỉ check extension hay magic bytes? Default expected: backend detect mismatch → ERR-IMP-DN-01 hoặc generic error. Flag security verify. | Negative 🔴 |
| TC-IMP-042 | FR-V.III-NEW-01 / E1 | File `.xlsx` corrupted (binary garbage) | Login. File `.xlsx` đã bị corrupt. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS không quote message cho corrupted file. Default expected error generic "File không đọc được" hoặc reject với ERR-IMP-DN-01. Flag BA. | Negative 🟡 |
| TC-IMP-043 | FR-V.III-NEW-01 / E1 | File `.xlsx` password-protected | Login. File `.xlsx` có password. | — | 1. Drop. | (2) ⚠️ **SRS Gap**: SRS không quote. Default expected error "File được bảo vệ" hoặc reject. Flag BA. | Negative 🟡 |
| TC-IMP-044 | FR-V.III-NEW-01 / E4 + security | Cell có formula injection | Login. File với cell tên DN = `=cmd|'/c calc'!A1` | — | 1. Upload + import. | (1) DB lưu literal text (Excel formula chỉ eval trong Excel viewer, server đọc ô raw). (3) Khi user xuất Excel sau import, cell phải prefix `'` để escape (CSV/XLSX injection prevention). ⚠️ **SRS Gap G17: SRS không quote — verify backend escape.** | Edge 🔴 |
| TC-IMP-045 | FR-V.III-NEW-01 / E4 | MST cell format auto Excel: leading zero "0123456789" → "123456789" | Login. File MST cell format=Number. | MST="0123456789" entered as number → Excel save thành 123456789 | 1. Save file. 2. Upload. | (2) ERR-IMP-DN-04: "Dòng N, cột Mã số thuế: format không hợp lệ (10/13 số)" (srs-fr-07:347). ⚠️ Workaround: user phải format MST cell thành Text. SRS không quote hướng dẫn → flag UX gap. | Edge 🟡 |
| TC-IMP-046 | FR-V.III-NEW-01 / Cột bắt buộc | Header row chữ hoa/thường khác | Login. File header "TÊN DN" / "tên dn" / "tên DN" thay vì "Tên DN". | — | 1. Upload. | (3) ⚠️ **SRS Gap G16**: SRS không quote case-sensitivity header. Default expected: insensitive → accept. Flag BA. | Edge 🟢 |
| TC-IMP-047 | FR-V.III-NEW-01 / Cột bắt buộc | Header row có space leading/trailing | Login. File header " Tên DN " (sau copy-paste). | — | 1. Upload. | (3) Backend trim → accept. ⚠️ **SRS Gap G16: không quote — verify**. | Edge 🟢 |
| TC-IMP-048 | FR-V.III-NEW-01 / Cột bắt buộc | Header row sai thứ tự | Login. File cột thứ tự: MST, Tên DN, Địa chỉ, ... (đảo Tên DN ↔ MST). | — | 1. Upload. | (3) ⚠️ **SRS Gap G16**: SRS quote bắt buộc cột (srs-fr-07:296-308) nhưng không quote thứ tự. Default expected: match theo tên header → accept. Flag BA. | Edge 🟢 |
| TC-IMP-049 | FR-V.III-NEW-01 / Inputs#1 | File có nhiều sheet — backend đọc sheet nào? | Login. File 3 sheet: "DN" (data), "Hướng dẫn", "Mẫu". | — | 1. Upload. | (3) ⚠️ **SRS Gap G16**: không quote multi-sheet behavior. Default expected: đọc sheet đầu tiên ("DN") hoặc sheet tên cụ thể. Flag BA. | Edge 🟡 |
| TC-IMP-050 | FR-V.III-NEW-01 / Inputs#1 | File có hidden rows | Login. File có 3 hidden rows giữa data. | — | 1. Upload. | (3) ⚠️ **SRS Gap G16**: hidden rows count vào "1.000 dòng" hay không? Verify. | Edge 🟢 |
| TC-IMP-051 | FR-V.III-NEW-01 / Processing | Concurrent import — 2 user upload cùng file | 2 session: cb_nv_tw_01 + cb_nv_tw_02 cùng file 5 dòng MST mới. | — | 1. Cả 2 cùng click [Xác nhận Import]. | (1) DB UNIQUE MST chặn duplicate — 5 dòng tạo bởi user thắng race. User thua nhận INF-IMP-DN-01 cho 5 dòng "Trùng MST đã tồn tại, bỏ qua" (srs-fr-07:348). ⚠️ Verify backend xử lý concurrent. | Edge 🔴 |
| TC-IMP-052 | FR-V.III-NEW-01 / Processing | Double-click [Xác nhận Import] (idempotent check) | 1. Đang ở Bước 2 đã review. | — | 1. Click [Xác nhận Import] 2 lần liên tiếp nhanh. | (1) DB chỉ 1 batch import, không duplicate. (3) Backend idempotent (verify). ⚠️ **SRS không quote — verify**. | Edge 🟡 |
| TC-IMP-053 | FR-V.III-NEW-01 / Bước 2-3 | Hard reload F5 giữa Bước 2 (chưa confirm) | Đang ở Bước 2 review. | — | 1. F5 reload. | (1) DB không thay đổi (chưa confirm). (3) Wizard quay về Bước 1, file upload bị clear. ⚠️ Verify session state. | Edge 🟢 |
| TC-IMP-054 | FR-V.III-NEW-01 / E4 | MST có space giữa: "01 0010 0101" | Login. File MST cell="01 0010 0101". | — | 1. Upload. | (2) ⚠️ **SRS Gap**: trim space giữa hay reject? Default expected: trim → "0100100101" → accept (10 số). Flag BA. | Edge 🟢 |
| TC-IMP-055 | FR-V.III-NEW-01 / E4 | MST có alphabet: "0100100ABC" | Login. File MST cell="0100100ABC". | — | 1. Upload. | (2) ERR-IMP-DN-04: "Dòng N, cột Mã số thuế: format không hợp lệ (chỉ chấp nhận số)" (srs-fr-07:347 + cột rule line 301 "Format 10/13 số"). | Negative 🟢 |
| TC-IMP-056 | FR-V.III-NEW-01 / Inputs#1 boundary | File `.xlsx` 0 bytes (empty file) → reject | 1. cb_nv_tw_01 login. 2. Tạo file `.xlsx` rỗng 0 bytes. | file size = 0 bytes | 1. Drop file 0 bytes vào vùng kéo thả. | (1) DB không thay đổi. (2) Error: **"File không có dữ liệu"** hoặc **"Chỉ chấp nhận file Excel (.xlsx)"** (ERR-IMP-DN-01) — vì 0 bytes không phải valid xlsx. (3) Wizard giữ Bước 1. ⚠️ **SRS không quote behavior cho 0-byte file** — verify backend detect empty vs corrupt. | Edge 🟢 |

---

## Tổng kết file 03-TC

- **39 TC** (verified bằng grep): 6 Happy + 12 Negative + 21 Edge (gồm 16 TC từ Edge Case Hunter + 2 TC từ Deep Review)
- **TC bổ sung từ Deep Review**: TC-IMP-UI-01 (UI Field Verification SCR-V.III-03 bắt buộc theo KI), TC-IMP-056 (0-byte empty file)
- **Critical TC** (🔴): UI-01, 002, 004, 010, 012, 014, 015, 033, 034, 040, 041, 044, 051 — phải pass 100%
- **SRS Gap**: TC-IMP-013, 020, 031 (cũ) + G16 (multi-sheet/hidden/case/order), G17 (formula injection)
