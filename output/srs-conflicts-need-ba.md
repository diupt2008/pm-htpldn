---
title: "10 vấn đề SRS cần BA xác nhận — 6 LỖI + 4 GAP"
source: "Cross-check NotebookLM (gstack-HTPLDN) + SRS local input/srs-v3/"
created: 2026-04-27
scope: "5 vòng deep review file 02-thu-tu-module.md + flow-module.md vs SRS canonical"
---

# 10 vấn đề SRS cần BA xác nhận

> **Phương pháp phát hiện:** Mỗi vấn đề được verify từ 2 nguồn độc lập:
> 1. **NotebookLM `gstack-HTPLDN`** (notebook ID `2160bfb1-2020-4199-90a6-d607b298bb42`) — đại diện toàn bộ tài liệu SRS đã upload
> 2. **SRS local** (`input/srs-v3/`) — grep trực tiếp với line number cụ thể
>
> Cả 2 nguồn đều confirm trước khi báo cáo. Mỗi conflict cite quote nguyên văn + path:line.

## Tổng quan phân loại

| Loại | Số lượng | IDs | Đặc điểm |
| :--- | :---: | :--- | :--- |
| 🔴 **LỖI thật** | 6 | A, B, C, D, E, F | SRS tự xung đột giữa 2 vị trí — cần BA fix SRS |
| 🟡 **GAP design** | 4 | G, H, I, J | SRS không có rule rõ ràng — cần BA bổ sung convention |

---

## 🔴 LỖI A — srs-fr-02 v3.5 sao chép nhầm state `DA_PHAN_CONG` từ template VU_VIEC sang HOI_DAP `[ROOT CAUSE: typo SRS — không phải feature pending]`

**Module:** FR-02 Hỏi đáp Pháp luật (Nhóm II) · Entity: `HOI_DAP`

**Status:** Deep review 2026-05-07 cross-check 5 nguồn → xác định **đây là lỗi typo cherry-pick từ v4, không phải feature design pending**. Master truth ĐÃ CÓ — không cần BA chốt giữ/bỏ, chỉ cần BA fix typo trong file FR-02.

**Cross-check 5 nguồn:**

| Nguồn | DA_PHAN_CONG dùng cho entity nào? | Status |
|---|---|---|
| Master [`srs-v3.md:1367`](../input/srs-update-2026-5-5/srs-v3.md) CHECK constraint | **VU_VIEC** (12 state) | ✅ Canonical — đây là state của VU_VIEC |
| Master [`srs-v3.md:4985-5011`](../input/srs-update-2026-5-5/srs-v3.md) SM-VUVIEC diagram + transition table | **VU_VIEC** transition `DANG_KIEM_TRA → DA_PHAN_CONG → DANG_XU_LY` | ✅ Canonical |
| [`02-thu-tu-module.md:421/426/427`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) bảng SM transition | **VU_VIEC** (FR-V.I-09/10) | ✅ Canonical |
| [`flow-module.md:184`](../input/quy-trinh-nghiep-vu/flow-module.md) SM-VUVIEC 12 state | **VU_VIEC** | ✅ Canonical |
| [`srs-fr-02-hoi-dap.md:1341`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md) CHECK constraint HOI_DAP | **HOI_DAP** = 9 state KHÔNG có DA_PHAN_CONG | ✅ Canonical — đây là truth cho HOI_DAP |
| [`srs-fr-02-hoi-dap.md:1488-1521`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md) SM-HOIDAP diagram + transition | TIEP_NHAN → DANG_XU_LY trực tiếp | ✅ Canonical |
| [`srs-fr-02-hoi-dap.md:317/385/400/404/448/474/498/502/509/511`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md) FR-II-04/05/06 dùng DA_PHAN_CONG | ❌ **Typo — sao chép nhầm template từ FR-V.I-09 VU_VIEC** | 🔴 BA fix |

**Bằng chứng đã có cảnh báo:** [`02-thu-tu-module.md:487`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) ghi rõ:
> "Master SRS §C.1 enum có 9 state nhưng KHÔNG có `DA_PHAN_CONG`; tuy nhiên srs-fr-02 UC15 (FR-II-06) lại set `trang_thai = 'DA_PHAN_CONG'` sau phân công. Đây là conflict trong SRS — cần CĐT thống nhất. **Bảng dưới bám Master (phân công trực tiếp `TIEP_NHAN → DANG_XU_LY`).**"

→ Người viết 02-thu-tu-module.md đã spot từ trước và quyết định bám Master. Đây là **typo cherry-pick**, không phải feature ambiguous.

**Yêu cầu BA (cosmetic — không block test, chỉ cần fix typo SRS):**
- BA xóa DA_PHAN_CONG khỏi 7 vị trí typo trong [`srs-fr-02-hoi-dap.md`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md):
  - Line 317 (FR-II-04 filter): `IN (TIEP_NHAN, DA_PHAN_CONG, DANG_XU_LY)` → `IN (TIEP_NHAN, DANG_XU_LY)`
  - Line 385 (FR-II-04 ERR-TH-03): bỏ `DA_PHAN_CONG`
  - Line 400, 404 (FR-II-05 SCR-II-01 filter): bỏ `DA_PHAN_CONG`
  - Line 448 (FR-II-06 Precondition): `trang_thai IN (TIEP_NHAN, DA_PHAN_CONG)` → `trang_thai = TIEP_NHAN`
  - Line 474, 498, 502, 509, 511 (FR-II-06 Processing/Output/Postcondition/AC): `trạng thái = DA_PHAN_CONG` → `trạng thái = DANG_XU_LY`
- Lý do: Master `srs-v3.md` + entity CHECK constraint trong cùng file FR-02 + SM-HOIDAP diagram đều canonical = HOI_DAP chỉ 9 state, không có DA_PHAN_CONG.

**Impact lên test plan FR-02 v3.5:** ✅ **KHÔNG block** — test plan hiện tại đã giả định bỏ DA_PHAN_CONG (theo Master), khớp với truth. HD-030/049/050 mô tả `TIEP_NHAN → DANG_XU_LY` đúng. SM smoke 9 state đúng. 7 tabs SCR-II-01 ([Đang xử lý] gộp TIEP_NHAN+DANG_XU_LY) đúng theo SRS line 1029. Không cần thay đổi gì.

---

## 🔴 LỖI B — SM-KHOAHOC thiếu transition đến `DA_CONG_KHAI`

**Module:** FR-03 Đào tạo, Tập huấn (Nhóm III) · Entity: `KHOA_HOC`

**Vị trí có state `DA_CONG_KHAI`:**
- [`input/srs-v3/srs-v3.md:1373`](../input/srs-v3/srs-v3.md) — Master §3.4.3.6 DB ENUM:
  > `CHECK IN ('DU_THAO','CHO_DUYET','DA_DUYET','DANG_DIEN_RA','DA_KET_THUC','CHO_DUYET_KQ','DA_CONG_KHAI','HOAN_THANH','HUY')` — 9 state có DA_CONG_KHAI
- `srs-fr-03-dao-tao.md` FR-III-04 PRE-02 ghi yêu cầu "Khóa học đang mở đăng ký — trạng thái `DA_CONG_KHAI`"

**Vị trí KHÔNG có transition đến `DA_CONG_KHAI`:**
- [`input/srs-v3/srs-v3.md:4178-4193`](../input/srs-v3/srs-v3.md) — Phụ lục C.2 transition table: `DA_DUYET → DANG_DIEN_RA` (skip thẳng), **không có transition nào dẫn đến hoặc đi từ DA_CONG_KHAI**
- [`input/srs-v3/srs-v3.md:4163-4176`](../input/srs-v3/srs-v3.md) — Mermaid diagram C.2 cũng skip thẳng `DA_DUYET → DANG_DIEN_RA`

**Câu hỏi cho BA:**
- (a) Bổ sung transition `DA_DUYET → DA_CONG_KHAI` (do CB NV kích hoạt công khai) + `DA_CONG_KHAI → DANG_DIEN_RA` vào Phụ lục C.2; HOẶC
- (b) Bỏ state `DA_CONG_KHAI` khỏi DB ENUM §3.4.3.6 + chuyển sang dùng flag boolean `la_cong_khai`?

---

## ✅ LỖI C — SM-DANHGIA 3 phiên bản state name (RESOLVED 2026-05-06 trong FR-08 v3.5)

**Module:** FR-08 Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý (Nhóm VI) · Entity: `KE_HOACH_DANH_GIA`

**Trạng thái:** ✅ **RESOLVED 2026-05-06** trong `srs-update-2026-5-5/srs-fr-08-danh-gia.md` v3.5 (Thay đổi 5, GAP-VI-01).

**Quyết định BA:** Chốt **8 state** lấy từ §5 (Phụ lục C.6 cũ — 7 state) làm source of truth + bổ sung **HUY**: `LAP_KE_HOACH / PHAN_CONG / CHO_DUYET_PC / THUC_HIEN / BAO_CAO / CHO_PHE_DUYET / HOAN_THANH / HUY`. DB enum CHECK = SM state. Default `LAP_KE_HOACH`.

- ❌ Phiên bản 1 cũ (6 state DU_THAO/...) — BỎ.
- ❌ Phiên bản 3 cũ (9 trạng thái UI NHAP/DA_LAP_KH/...) — BỎ.
- ✅ Phiên bản 2 (7 state §C.6) + HUY = canonical.

**Cite:** `srs-update-2026-5-5/srs-fr-08-danh-gia.md` §4 line 1009 (CHECK constraint) + §5 line 1117-1167 (SM-DANHGIA Mermaid + bảng trạng thái + bảng chuyển trạng thái).

---

## 🔴 LỖI D — UC147/148/151 status xung đột (LOẠI BỎ vs ACTIVE)

**Module:** FR-12 Tư vấn Chuyên sâu (Nhóm X.1)

**Vị trí ghi LOẠI BỎ/XÓA:**
- [`input/srs-v3/srs-v3.md:4463`](../input/srs-v3/srs-v3.md) — Phụ lục C.8 SM-TVCS:
  > "**V2.1 (C3-14):** 5 UC LOẠI BỎ (UC147/148/154/155/156) + UC151 đã xóa. SM-TVCS giữ nguyên vì luồng chính không thay đổi."

**Vị trí ghi vẫn ACTIVE:**
- [`input/srs-v3/srs-v3.md:3438-3442`](../input/srs-v3/srs-v3.md) — Section 4.2.12 Ma trận kiểm chứng:
  > "FR-X.1-01 Quản lý nội dung tư vấn với chuyên gia (UC147) ... ⬜"
  > "FR-X.1-02 Tìm kiếm nội dung tư vấn với chuyên gia (UC148) ... ⬜"
  > "FR-X.1-05 Tiếp nhận hồ sơ pháp lý doanh nghiệp (UC151) ... ⬜"
- [`input/srs-v3/srs-fr-12-tv-chuyen-sau.md:39, 40, 43`](../input/srs-v3/srs-fr-12-tv-chuyen-sau.md) — UC Coverage table còn liệt kê đầy đủ
- [`input/srs-v3/srs-fr-12-tv-chuyen-sau.md:80, 211, 536`](../input/srs-v3/srs-fr-12-tv-chuyen-sau.md) — Section detail FR-X.1-01 (UC147), FR-X.1-02 (UC148), FR-X.1-05 (UC151) **vẫn còn đầy đủ Inputs/Outputs/Processing**

**NotebookLM xác nhận:** "MÂU THUẪN NGHIÊM TRỌNG. Phụ lục C ghi xóa/loại bỏ nhưng đặc tả chi tiết và Ma trận kiểm chứng vẫn giữ nguyên như đang hoạt động bình thường."

**Câu hỏi cho BA:**
- (a) Nếu UC147/148/151 thực sự đã loại bỏ → xóa khỏi Section 4.2.12 + xóa section detail trong srs-fr-12; HOẶC
- (b) Nếu vẫn còn → xóa note "LOẠI BỎ" ở Phụ lục C.8

---

## 🔴 LỖI E — Typo: AT-02 cite UC36 với FR-III-05 (sai, đúng là FR-III-17)

**Module:** FR-03 Đào tạo · Auto-transition table

**Vị trí typo:**
- [`input/srs-v3/srs-v3.md:713`](../input/srs-v3/srs-v3.md) — Section 3.2.0.7.1 Auto-transition table:
  > "AT-02 | III. Đào tạo | SM-KHOAHOC | CB NV nhấn 'Trình duyệt KQ' | Lưu kết quả cuối → auto Chờ duyệt KQ + TB CB PD | **FR-III-05 (UC36)**"

**Vị trí ánh xạ ĐÚNG:**
- [`input/srs-v3/srs-v3.md:3278`](../input/srs-v3/srs-v3.md) — Section 4.2.3 Ma trận kiểm chứng:
  > "**FR-III-17** | Ghi nhận kết quả (UC36) | D, T | TP-III-17"
- [`input/srs-v3/srs-fr-03-dao-tao.md:972`](../input/srs-v3/srs-fr-03-dao-tao.md) — Section detail:
  > "### FR-III-17: Ghi nhận kết quả (UC36)"
- Phụ lục A.1.3 Truy vết: UC36 = FR-III-17

**Lưu ý FR-III-05 thực sự = UC24 (Quản lý kiểm tra, đánh giá kết quả) — KHÔNG phải UC36.**

**Câu hỏi cho BA:** Sửa srs-v3.md:713 từ `FR-III-05 (UC36)` thành `FR-III-17 (UC36)`.

---

## 🔴 LỖI F — Entity name `VU_VIEC_DANH_GIA` là alias rác (chưa update sang `KET_QUA_DANH_GIA`)

**Module:** FR-08 Đánh giá Hiệu quả

**Vị trí khai báo entity canonical:**
- [`input/srs-v3/srs-v3.md:2181`](../input/srs-v3/srs-v3.md) — Master §3.4.3.35: **`KET_QUA_DANH_GIA — Kết quả đánh giá`** (entity owned, có schema đầy đủ với FK `ke_hoach_id` + `vu_viec_id`)
- [`input/srs-v3/srs-fr-08-danh-gia.md:847-848`](../input/srs-v3/srs-fr-08-danh-gia.md) — Entity owned table chỉ liệt 2 entity: `KE_HOACH_DANH_GIA` + `KET_QUA_DANH_GIA`. **Không có `VU_VIEC_DANH_GIA`**

**Vị trí dùng tên `VU_VIEC_DANH_GIA` (rác):**
- [`input/srs-v3/srs-fr-08-danh-gia.md:409`](../input/srs-v3/srs-fr-08-danh-gia.md) — FR-VI-05 Output: "Danh sách VV đánh giá ... `VU_VIEC_DANH_GIA records`"
- [`input/srs-v3/srs-fr-08-danh-gia.md:413`](../input/srs-v3/srs-fr-08-danh-gia.md) — FR-VI-05 Postcondition: "`VU_VIEC_DANH_GIA records created`"
- [`input/srs-v3/srs-fr-08-danh-gia.md:453`](../input/srs-v3/srs-fr-08-danh-gia.md) — FR-VI-06 Input field: `vu_viec_danh_gia_id ... FK → VU_VIEC_DANH_GIA`

**NotebookLM xác nhận:** "VU_VIEC_DANH_GIA xuất hiện trong mô tả xử lý nghiệp vụ (FR-VI-05) nhưng KHÔNG tồn tại trong thiết kế ERD, KHÔNG được định nghĩa schema. Đây là một cái tên rác (alias cũ chưa được update đồng bộ), thực thể thực sự là `KET_QUA_DANH_GIA`."

**Câu hỏi cho BA:** Replace toàn bộ `VU_VIEC_DANH_GIA` trong srs-fr-08 (3 chỗ: 409, 413, 453) thành `KET_QUA_DANH_GIA`. Đồng thời rename FK `vu_viec_danh_gia_id` → `ket_qua_danh_gia_id`.

---

## 🟡 GAP G — `ERR-DN-02` dùng cho 2 case khác nhau (DN module vs Đăng nhập)

**Module 1 (Doanh nghiệp):**
- [`input/srs-v3/srs-fr-07-doanh-nghiep.md:190`](../input/srs-v3/srs-fr-07-doanh-nghiep.md) — FR-V.III-01 (UC81):
  > "E2 | MST trùng | **ERR-DN-02** | 'Mã số thuế đã tồn tại' | ERROR"

**Module 2 (Đăng nhập):**
- [`input/srs-v3/srs-fr-10-quan-tri.md:931`](../input/srs-v3/srs-fr-10-quan-tri.md) — FR-VIII Đăng nhập:
  > "E2 | TK bị tạm khóa | **ERR-DN-02** | 'Tài khoản đã bị tạm khóa. Vui lòng liên hệ QTHT' | ERROR"

**NotebookLM xác nhận:** "Trùng tiền tố DN: Doanh nghiệp vs Đăng nhập. **SRS KHÔNG CÓ QUY ƯỚC UNIQUE** — Section 3.2.0 và Master-IDs-Dictionary chỉ yêu cầu naming convention thống nhất cho FR/BR/SM, không có rule nào bắt buộc mã lỗi UNIQUE toàn hệ thống."

**Tại sao là GAP, không phải LỖI:** Cite trong file tổng hợp đều đúng context module — không gây sai chức năng. Vấn đề chỉ ở chỗ SRS thiếu rule rõ ràng về scope mã lỗi.

**Câu hỏi cho BA:**
- (a) Chốt rule mã lỗi UNIQUE toàn hệ thống → rename 1 trong 2 (vd `ERR-LOGIN-02` cho TK tạm khóa); HOẶC
- (b) Giữ nguyên + thêm rule "mã lỗi scope theo module, prefix là alias module" vào Section 3.2.0 Quy ước chung

---

## 🟡 GAP H — `ERR-DN-03` dùng cho 2 case khác nhau

**Module 1 (Doanh nghiệp):**
- [`input/srs-v3/srs-fr-07-doanh-nghiep.md:192`](../input/srs-v3/srs-fr-07-doanh-nghiep.md) — FR-V.III-01:
  > "E4 | Xóa DN có VV đang xử lý | **ERR-DN-03** | 'Không thể xóa DN đang có vụ việc xử lý' | ERROR"

**Module 2 (Đăng nhập):**
- [`input/srs-v3/srs-fr-10-quan-tri.md:932`](../input/srs-v3/srs-fr-10-quan-tri.md) — FR-VIII Đăng nhập:
  > "E3 | TK bị vô hiệu hóa | **ERR-DN-03** | 'Tài khoản đã bị vô hiệu hóa' | ERROR"

**Cùng lý do với GAP G.** Câu hỏi cho BA: cùng lựa chọn (a)/(b) như GAP G, áp dụng đồng nhất.

---

## 🟡 GAP I — `ERR-PC-01` dùng cho 2 case khác nhau (Phân công câu hỏi vs Phân công vụ việc)

**Module 1 (Hỏi đáp):**
- [`input/srs-v3/srs-fr-02-hoi-dap.md:431`](../input/srs-v3/srs-fr-02-hoi-dap.md) — FR-II-06 (UC15) Phân công xử lý câu hỏi:
  > "E1 | NHT/TVV không còn hoạt động | **ERR-PC-01** | 'Người được chọn đã bị vô hiệu hóa' | ERROR"

**Module 2 (Vụ việc):**
- [`input/srs-v3/srs-fr-05-vu-viec.md:732`](../input/srs-v3/srs-fr-05-vu-viec.md) — FR-V.I-09 (UC59) Lựa chọn người hỗ trợ:
  > "E1 | VV không ở trạng thái hợp lệ | **ERR-PC-01** | 'Vụ việc không ở trạng thái cho phép phân công' | ERROR"

**Cùng lý do với GAP G/H.**

---

## 🟡 GAP J — `WRN-PC-01` dùng cho 2 case khác nhau

**Module 1 (Hỏi đáp):**
- [`input/srs-v3/srs-fr-02-hoi-dap.md:432`](../input/srs-v3/srs-fr-02-hoi-dap.md) — FR-II-06:
  > "E2 | Workload vượt ngưỡng | **WRN-PC-01** | 'CB {tên} đang xử lý {N} yêu cầu. Xác nhận phân công?' | WARNING"

**Module 2 (Vụ việc):**
- [`input/srs-v3/srs-fr-05-vu-viec.md:734`](../input/srs-v3/srs-fr-05-vu-viec.md) — FR-V.I-09:
  > "E3 | Không có TVV phù hợp | **WRN-PC-01** | 'Không tìm thấy TVV phù hợp lĩnh vực + địa bàn' | WARNING"

**Cùng lý do với GAP G/H/I.**

---

## Bảng tổng hợp đề xuất hành động cho BA

| ID | Loại | Module | Đề xuất hành động | Mức độ ưu tiên |
| :--- | :---: | :--- | :--- | :---: |
| A | 🔴 LỖI `[ROOT CAUSE: typo SRS]` | FR-02 Hỏi đáp | **BA xóa DA_PHAN_CONG khỏi 7 vị trí typo** trong srs-fr-02-hoi-dap.md (line 317/385/400/404/448/474/498/502/509/511) — sao chép nhầm template từ FR-V.I-09 VU_VIEC. Truth canonical: HOI_DAP 9 state KHÔNG có DA_PHAN_CONG (Master + CHECK + SM trong cùng file FR-02 đều thống nhất). | **Thấp — cosmetic, KHÔNG block test plan FR-02** (test plan hiện tại đã đúng theo truth) |
| B | 🔴 LỖI | FR-03 Đào tạo | Bổ sung transition `DA_DUYET → DA_CONG_KHAI` vào C.2 | Cao |
| C | 🔴 LỖI | FR-08 Đánh giá | Chốt 1 phiên bản canonical state name (3 phiên bản hiện có) | Cao |
| D | 🔴 LỖI | FR-12 TVCS | Quyết định UC147/148/151 còn hay loại bỏ; xóa note conflict | Cao |
| E | 🔴 LỖI | FR-03 Đào tạo | Sửa typo srs-v3.md:713 `FR-III-05` → `FR-III-17` | Thấp (1 dòng) |
| F | 🔴 LỖI | FR-08 Đánh giá | Replace `VU_VIEC_DANH_GIA` (3 chỗ) → `KET_QUA_DANH_GIA` | Trung |
| G | 🟡 GAP | FR-07 + FR-10 | Bổ sung rule scope mã lỗi vào Section 3.2.0 | Thấp |
| H | 🟡 GAP | FR-07 + FR-10 | Cùng GAP G | Thấp |
| I | 🟡 GAP | FR-02 + FR-05 | Cùng GAP G | Thấp |
| J | 🟡 GAP | FR-02 + FR-05 | Cùng GAP G | Thấp |

---

## Phương pháp verify (audit trail)

Mỗi conflict đã được verify từ 2 nguồn độc lập:

1. **NotebookLM `gstack-HTPLDN`** (notebook ID `2160bfb1-2020-4199-90a6-d607b298bb42`):
   - Vòng 1 (2026-04-27): query state machines → confirm A, B, C
   - Query 1 (2026-04-27): query UC147/148/151 + UC36 + VU_VIEC_DANH_GIA → confirm D, E, F
   - Query 2 (2026-04-27): query 4 ERR/WRN dual + rule scope → confirm G, H, I, J + xác nhận SRS không có rule UNIQUE mã lỗi

2. **SRS local** (`input/srs-v3/`): grep trực tiếp với line number cụ thể (đã cite trong từng conflict ở trên).

**Cả 2 nguồn đều confirm trước khi đưa vào báo cáo này. Mỗi cite đều có path:line cụ thể để BA verify lại.**
