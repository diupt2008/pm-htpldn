# Bug Report — SRS FR-10 v3.5 Inconsistency (R7)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | SRS doc — không phải app runtime |
| **Người test** | QA Automation (huongttt) |
| **Ngày** | 2026-05-06 |
| **Loại test** | SRS Review (deep review trước khi viết test plan FR-10) |
| **Round** | Round 7 |
| **Tài liệu tham chiếu** | [SRS FR-10 v3.5](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md) · [CHANGELOG v3→v3.5 §FR-10 line 1129-1322](../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) · [Delta map FR-10](../../../../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md) |

---

## Tổng hợp

Phát hiện **11 inconsistency** trong SRS FR-10 v3.5 sau deep review 2.285 dòng. **3 bug Major BLOCK test** 3 FR mới (FR-VIII-22 self-reg DN, FR-VIII-26 quên MK, FR-VIII-29 ngày lễ). **8 bug Minor doc** không block nhưng cần BA chốt để clear ambiguity trước round test sau.

> **Note SRS doc bug:** đây là bug về tài liệu SRS, KHÔNG phải bug app runtime. Bằng chứng là quote SRS line + đối chiếu 2 nguồn mâu thuẫn (không có UI screenshot). Mỗi bug đều có line number cụ thể trong file SRS để BA dễ verify.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 11   | 0        | 3     | 0      | 8     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-SRS-FR10-001 | Major | P0 | Data | FR-VIII-29 | `srs-fr-10-quan-tri.md` line 1397-1404 (FR Inputs) vs line 2059-2072 (Entity 3.4.3.51) | NGAY_LE — entity schema (single date + năm + loại) khác FR Inputs (date range + lap_lai_hang_nam) | Open |
| BUG-SRS-FR10-002 | Major | P0 | Data | FR-VIII-22 | `srs-fr-10-quan-tri.md` line 1032 + 1975 (FK loai='TINH_THANH') vs line 1459 (SCR-VIII-01 13 tab) | TINH_THANH — FK định nghĩa nhưng không có tab CRUD trong SCR-VIII-01 | Open |
| BUG-SRS-FR10-003 | Major | P0 | Workflow | SM-TAIKHOAN | `srs-fr-10-quan-tri.md` line 1061 (FR-VIII-22 bypass) vs line 1285 (FR-VIII-26 "luồng cũ") vs line 2089 (SM diagram) | CHO_PHAN_QUYEN — sau DN bypass, scenario nào còn trigger? Transition #2 + #3 trong bảng SM không có actor xác định | Open |
| BUG-SRS-FR10-004 | Minor | P2 | Data | FR-VIII-28 | `srs-fr-10-quan-tri.md` line 1352 (FR Processing) vs line 1834 (SCR-VIII-10 Quy tắc) | AUDIT_LOG export limit — FR ghi 10.000 dòng, SCR ghi 50.000 dòng | Open |
| BUG-SRS-FR10-005 | Minor | P2 | Data | FR-VIII-10 | `srs-fr-10-quan-tri.md` line 466 (FR Inputs) vs line 1645 (SCR Tab 1 row 10) vs line 2053 (Entity) | CAU_HINH_SLA quá hạn — 3 nguồn 3 giá trị (`qua_han_phan_tram=100` vs `mặc định 200%` vs `qua_han_he_so=2.0`) | Open |
| BUG-SRS-FR10-006 | Minor | P2 | Workflow | SM-TAIKHOAN | `srs-fr-10-quan-tri.md` line 2115 (bảng chuyển trạng thái) | SM dòng `CHO_KICH_HOAT → HOAT_DONG QTHT kích hoạt` cột FR Ref ghi `FR-VIII-18` (= DM Loại hình tiếp nhận, không liên quan TK) | Open |
| BUG-SRS-FR10-007 | Minor | P3 | UI/UX | FR-VIII-22 | `srs-fr-10-quan-tri.md` line 1083 (Postcondition) | Postcondition còn placeholder `FR-VIII-XX` chưa thay (phải là FR-VIII-26) | Open |
| BUG-SRS-FR10-008 | Minor | P3 | UI/UX | FR-VIII-22 | `srs-fr-10-quan-tri.md` line 1086 (Acceptance) vs line 1027-1049 (Inputs) | Acceptance đếm "21 trường nhập (19 DN + 2 password) + 1 cam kết" — Inputs thực có 18 DN + 2 password + 1 cam kết = 21 tổng. Đếm "19 DN" sai | Open |
| BUG-SRS-FR10-009 | Minor | P2 | Permission | FR-VIII-23 | `srs-fr-10-quan-tri.md` line 1106 (Tác nhân) vs line 1128 + 1150 (Step 6 + Acceptance) | FR-VIII-23 Tác nhân ghi "TVV, CG, NHT" nhưng Step 6 + Acceptance cover DN VNeID Tổ chức. Thiếu DN trong list tác nhân | Open |
| BUG-SRS-FR10-010 | Minor | P3 | UI/UX | SCR-VIII-08a | `srs-fr-10-quan-tri.md` line 1061 (FR-VIII-22 bypass) vs line 1776-1791 (SCR-VIII-08a) | SCR-VIII-08a "QTHT phê duyệt TK đăng ký" tồn tại nhưng FR-VIII-22 bypass CHO_PHAN_QUYEN. UI dead code | Open |
| BUG-SRS-FR10-011 | Minor | P3 | Workflow | SM-TAIKHOAN | `srs-fr-10-quan-tri.md` line 2086-2096 (diagram) vs line 2110-2122 (bảng) | SM-TAIKHOAN diagram vẽ 7 transitions, bảng liệt kê 11 transitions. Diagram thiếu 4 transitions (CHO_KICH_HOAT → VO_HIEU_HOA auto, HOAT_DONG → TAM_KHOA QTHT thủ công, TAM_KHOA → HOAT_DONG auto 30 phút, CHO_KICH_HOAT → HOAT_DONG direct) | Open |

---

## BUG-SRS-FR10-001 — NGAY_LE entity schema khác FR-VIII-29 Inputs

### Mô tả

Entity `3.4.3.51 NGAY_LE` (line 2059-2072) định nghĩa schema dùng **single date** + cột `nam` + `loai` (3 enum). FR-VIII-29 Inputs (line 1397-1404) định nghĩa schema khác — dùng **date range** (`ngay_bat_dau` + `ngay_ket_thuc`) + `lap_lai_hang_nam` boolean. 2 nguồn không trùng cột nào ngoài `ten_ngay_le`. QA không có schema chuẩn để seed test data hoặc viết acceptance.

### Các bước tái hiện

1. Mở [`input/srs-update-2026-5-5/srs-fr-10-quan-tri.md`](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md) line 1397-1404 (FR-VIII-29 Inputs)
2. Đối chiếu line 2059-2072 (Entity 3.4.3.51 NGAY_LE)
3. Quan sát: 2 schema không khớp (5 cột FR vs 6 cột entity, không trùng nhau)

### Kết quả mong đợi

- Entity và FR Inputs phải đồng bộ schema (1 nguồn truth — entity là master per CLAUDE.md convention SRS).
- Test case CRUD ngày lễ chạy được trên 1 schema duy nhất.

### Kết quả thực tế

- 2 nguồn 2 schema khác nhau. Test CRUD sẽ fail ở 1 trong 2 nguồn.
- Use case "ngày Tết kéo dài 5 ngày": entity yêu cầu seed 5 record (1 record/ngày); FR Inputs cho phép seed 1 record (range 5 ngày). Behavior khác hoàn toàn.

### Bằng chứng

**Quote 1 — FR-VIII-29 Inputs** (`srs-fr-10-quan-tri.md` line 1397-1404):

```
| 1 | ten_ngay_le | text | Y |
| 2 | ngay_bat_dau | date | Y |
| 3 | ngay_ket_thuc | date | Y | >= ngay_bat_dau |
| 4 | mo_ta | text | N |
| 5 | lap_lai_hang_nam | boolean | Y |
```

**Quote 2 — Entity 3.4.3.51 NGAY_LE** (`srs-fr-10-quan-tri.md` line 2059-2072):

```
| 1 | id | identifier | Y | PK, SEQ |
| 2 | ngay | date | Y | UNIQUE per nam |
| 3 | nam | number | Y | CHECK >= 2024 |
| 4 | ten_ngay_le | text | Y |
| 5 | loai | text | Y | CHECK IN ('NGAY_LE','NGHI_BU','NGHI_KHAC') |
| 6 | ghi_chu | text | N |
```

---

## BUG-SRS-FR10-002 — TINH_THANH FK định nghĩa nhưng SCR-VIII-01 không có tab CRUD

### Mô tả

FR-VIII-22 Inputs row 5 + Entity DON_VI cột `tinh_thanh_id` (line 1032, 1975) tham chiếu FK → `DANH_MUC(loai='TINH_THANH')` mã GSO 01-63 theo QĐ 124/2004. SCR-VIII-01 row 2 (line 1459) liệt kê 13 tab nhưng **không có tab "Tỉnh/Thành phố"**. QA không biết DM TINH_THANH được seed thế nào (system-only? DDL init?), không có UI để verify 63 tỉnh có sẵn không. DN test đăng ký dropdown "Tỉnh/Thành phố" sẽ rỗng nếu chưa seed.

### Các bước tái hiện

1. Mở SRS line 1032: `tinh_thanh_id | identifier | Y | FK → DANH_MUC (loai='TINH_THANH', mã GSO 01-63)`
2. Mở SRS line 1459 (SCR-VIII-01 sidebar Tab dọc): liệt kê 13 tab — Lĩnh vực PL, Loại hình HT, Chương trình HT, Tình trạng VV, Cơ quan ĐV, Loại DN, Hồ sơ ĐN HT, Hồ sơ ĐN TT, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Loại TK, Loại hình tiếp nhận, Kênh tiếp nhận
3. Quan sát: không có tab "Tỉnh/Thành phố"

### Kết quả mong đợi

- Hoặc thêm tab "Tỉnh/Thành phố" vào SCR-VIII-01 (14 tab tổng).
- Hoặc xác định DM TINH_THANH là system-seeded once (DDL init 63 tỉnh GSO), không CRUD qua UI — ghi rõ trong SRS.

### Kết quả thực tế

- SRS không định nghĩa rõ. QA không biết kế hoạch seed.
- Nếu test FR-VIII-22 trước khi seed → DN không chọn được tỉnh → block đăng ký.

### Bằng chứng

**Quote 1 — DON_VI entity tinh_thanh_id** (line 1975):

```
| tinh_thanh_id | identifier | N | FK → DANH_MUC(id), loai='TINH_THANH' (mã GSO 01-63 theo QĐ 124/2004/QĐ-TTg) | | Tỉnh/TP (nếu ĐP) |
```

**Quote 2 — SCR-VIII-01 sidebar 13 tab** (line 1459):

```
| 2 | sidebar | Tab dọc bên trái (13 tab) | tab | 13 loại danh mục: Lĩnh vực PL, Loại hình HT, Chương trình HT, Tình trạng VV, Cơ quan ĐV, Loại DN, Hồ sơ đề nghị HT, Hồ sơ đề nghị TT, Tiêu chí ĐG hiệu quả, Tiêu chí ĐG chi phí, Loại TK, Loại hình tiếp nhận, Kênh tiếp nhận |
```

---

## BUG-SRS-FR10-003 — CHO_PHAN_QUYEN sau bypass DN — scenario nào còn trigger?

### Mô tả

FR-VIII-22 Step 7 (line 1061) ghi rõ DN tự đăng ký **bypass CHO_PHAN_QUYEN** đi thẳng `CHO_KICH_HOAT → HOAT_DONG`. FR-VIII-26 Step 11 (line 1285) ghi: "Nếu TK đang CHO_KICH_HOAT + chưa có vai trò → chuyển CHO_PHAN_QUYEN (cho luồng self-registration cũ)". SM-TAIKHOAN diagram + bảng (line 2089, 2113-2114) vẫn giữ 2 transitions `CHO_KICH_HOAT → CHO_PHAN_QUYEN` và `CHO_PHAN_QUYEN → HOAT_DONG`. CHANGELOG D.2 Q1 (line 1299) confirm: "CHO_PHAN_QUYEN còn dùng cho ai sau khi DN bypass?" — pending. QA không có actor để trigger 2 transitions này, không có scenario test path #2 và #3 trong SM bảng.

### Các bước tái hiện

1. Đọc FR-VIII-22 Step 7: DN tự đăng ký → `CHO_KICH_HOAT (gán role DN sẵn)` → bypass CHO_PHAN_QUYEN.
2. Đọc FR-VIII-26 Step 11: guard `vai_tro IS NULL` → CHO_PHAN_QUYEN; `vai_tro != NULL` → HOAT_DONG.
3. Đọc các FR khác (FR-VIII-15 QTHT tạo TK CB nội bộ; FR-IV-07 CB PD duyệt TVV/CG; FR-IV-NHT-01 tạo NHT) — đều gán role TRƯỚC khi tạo TK → vai_tro != NULL → bypass CHO_PHAN_QUYEN.
4. Quan sát: không có actor/workflow nào tạo TK với `vai_tro NULL` → CHO_PHAN_QUYEN dead state.

### Kết quả mong đợi

- BA chốt: hoặc xóa CHO_PHAN_QUYEN khỏi SM (giảm 5→4 states), hoặc chỉ định actor cụ thể trigger (vd: admin migration TK cũ chưa có role).

### Kết quả thực tế

- SM còn 5 states + 11 transitions theo SRS. QA test path #2 (CHO_KICH_HOAT → CHO_PHAN_QUYEN) và #3 (CHO_PHAN_QUYEN → HOAT_DONG) **không có scenario** để chạy.

### Bằng chứng

**Quote 1 — FR-VIII-22 Step 7** (line 1061):

```
| 7 | Tạo bản ghi TAI_KHOAN ở trạng thái CHO_KICH_HOAT, gán vai trò "DN" sẵn (KHÔNG qua trạng thái CHO_PHAN_QUYEN — vì vai trò DN đã rõ, không cần QTHT phân quyền) |
```

**Quote 2 — FR-VIII-26 Step 11** (line 1285):

```
| 11 | Chuyển trạng thái tài khoản theo guard: ... Nếu TK đang CHO_KICH_HOAT + chưa có vai trò → chuyển CHO_PHAN_QUYEN (cho luồng self-registration cũ) ... |
```

**Quote 3 — CHANGELOG Q1 pending** (CHANGELOG line 1299):

```
- Q1: CHO_PHAN_QUYEN còn dùng cho ai sau khi DN bypass (Thay đổi 5)? Đề xuất giữ làm dự phòng admin migration; cần BA xác nhận.
```

---

## BUG-SRS-FR10-004 — AUDIT_LOG export limit 10K (FR) vs 50K (SCR)

### Mô tả

FR-VIII-28 Processing bước 6 (line 1352) ghi limit export Excel **10.000 dòng**. SCR-VIII-10 Quy tắc tương tác (line 1834) ghi **50.000 dòng**. Khi test "export đúng limit" sẽ fail ở 1 trong 2 nguồn (data 11K dòng hoặc 51K dòng). BA cần chốt 1 con số.

### Các bước tái hiện

1. Mở SRS line 1352: "QTHT nhấn 'Xuất Excel': filter → export .xlsx, max 10.000 dòng"
2. Mở SRS line 1834: "Export Excel: max 50.000 dòng (BR-DATA-06)"
3. Quan sát: 2 limit khác nhau

### Kết quả mong đợi

- 1 limit duy nhất ở cả FR và SCR.

### Kết quả thực tế

- 2 nguồn 2 limit. QA không biết test với data nào.

### Bằng chứng

**Quote 1 — FR-VIII-28** (line 1352):

```
| 6 | Nếu QTHT nhấn "Xuất Excel": filter → export .xlsx, max 10.000 dòng | BR-DATA-06 |
```

**Quote 2 — SCR-VIII-10** (line 1834):

```
- Export Excel: max 50.000 dong (BR-DATA-06)
```

---

## BUG-SRS-FR10-005 — CAU_HINH_SLA quá hạn nghiêm trọng — 3 nguồn 3 giá trị

### Mô tả

FR-VIII-10 Inputs row 6 (line 466) field `qua_han_phan_tram` default `100` (% thời hạn). SCR-VIII-06 Tab 1 row 10 (line 1645) field "QH nghiêm trọng (%)" default `200`. Entity 3.4.3.14 CAU_HINH_SLA (line 2053) field `qua_han_he_so` default `2.0`. 3 nguồn 3 field name + 3 giá trị + 2 đơn vị (% vs hệ số).

### Các bước tái hiện

1. Mở line 466: `qua_han_phan_tram | number | Y | = 100% | 100 | system`
2. Mở line 1645: `Cot QH nghiem trong (%) | text-input (inline) | Mac dinh: 200`
3. Mở line 2053: `qua_han_he_so | number | N | CHECK > 1 | 2.0`

### Kết quả mong đợi

- Đồng bộ field name + đơn vị + default ở 3 nguồn.

### Kết quả thực tế

- Test cấu hình SLA không biết verify field nào, default nào.

### Bằng chứng

3 quote ở 3 line đã liệt kê trong "Các bước tái hiện".

---

## BUG-SRS-FR10-006 — SM-TAIKHOAN bảng dòng `CHO_KICH_HOAT → HOAT_DONG` ref FR-VIII-18 (sai)

### Mô tả

CHANGELOG fix C.4 nói đã sửa "SM bảng chuyển trạng thái dòng [*] → CHO_KICH_HOAT đổi FR Ref FR-VIII-18 → FR-VIII-15". Fix áp dụng đúng cho dòng `[*] → CHO_KICH_HOAT` (line 2112 ghi `FR-VIII-15, FR-VIII-22` ✅). NHƯNG dòng kế tiếp `CHO_KICH_HOAT → HOAT_DONG (QTHT kích hoạt đã gán quyền trực tiếp)` line 2115 vẫn ghi `FR-VIII-18`. FR-VIII-18 là "Quản lý DM loại hình tiếp nhận" — không liên quan TK.

### Các bước tái hiện

1. Mở SRS line 2115
2. Cột "FR Ref" ghi `FR-VIII-18` cho dòng `CHO_KICH_HOAT → HOAT_DONG`

### Kết quả mong đợi

- FR Ref đúng: `FR-VIII-15` (Quản lý tài khoản người dùng) hoặc `FR-VIII-26` (Kích hoạt TK lần đầu).

### Kết quả thực tế

- Ref `FR-VIII-18` sai logic, làm test trace bị nhầm.

### Bằng chứng

**Quote — SRS line 2115:**

```
| CHO_KICH_HOAT | HOAT_DONG | QTHT kích hoạt (đã gán quyền trực tiếp) | Token hợp lệ | Cho phép đăng nhập | FR-VIII-18 | — |
```

---

## BUG-SRS-FR10-007 — FR-VIII-22 Postcondition còn placeholder `FR-VIII-XX`

### Mô tả

Postcondition (line 1083) ghi: "DN bấm link kích hoạt + đặt mật khẩu lần đầu (qua **FR-VIII-XX** Quên mật khẩu / Kích hoạt) → TAI_KHOAN chuyển HOAT_DONG". Placeholder `FR-VIII-XX` chưa thay (phải là `FR-VIII-26`).

### Các bước tái hiện

1. Mở SRS line 1083

### Kết quả mong đợi

- Thay `FR-VIII-XX` thành `FR-VIII-26`.

### Kết quả thực tế

- Còn placeholder, gây nhầm lẫn cho người đọc.

### Bằng chứng

**Quote — line 1083:**

```
DN bấm link kích hoạt + đặt mật khẩu lần đầu (qua FR-VIII-XX Quên mật khẩu / Kích hoạt) → TAI_KHOAN chuyển HOAT_DONG
```

---

## BUG-SRS-FR10-008 — FR-VIII-22 Acceptance đếm số trường sai

### Mô tả

Acceptance row 1 (line 1086) ghi: "form đăng ký mở với **21 trường nhập (19 trường thông tin DN + 2 trường mật khẩu) + 1 ô cam kết**". Inputs table thực tế có **18 trường DN** (#1-18) + 2 password (#19-20) + 1 cam kết checkbox (#21) = **21 tổng**. Đếm "19 DN" sai 1 đơn vị.

### Các bước tái hiện

1. Mở SRS line 1027-1049 (Inputs) — đếm: row 1 ten_doanh_nghiep → row 18 file_dinh_kem = 18 DN; row 19-20 password; row 21 cam_ket = 21 tổng
2. Mở SRS line 1086 (Acceptance) ghi "19 DN + 2 password + 1 cam kết = 22"

### Kết quả mong đợi

- Acceptance đếm đúng: "21 trường gồm 18 DN + 2 password + 1 cam kết".

### Kết quả thực tế

- Lệch 1 đơn vị giữa Inputs (21) và Acceptance text (22).

### Bằng chứng

**Quote 1 — Acceptance line 1086:**

```
form đăng ký mở với 21 trường nhập (19 trường thông tin DN + 2 trường mật khẩu) + 1 ô cam kết
```

**Quote 2 — Inputs line 1027 + 1049 (đầu + cuối):**

```
Line 1027: | 1 | ten_doanh_nghiep | text | Y | ...
Line 1049: | 21 | cam_ket_thong_tin_dung_su_that | boolean | Y | ...
```

---

## BUG-SRS-FR10-009 — FR-VIII-23 Tác nhân thiếu DN

### Mô tả

FR-VIII-23 Tác nhân (line 1106) ghi: "TVV, CG, NHT". NHƯNG Mô tả + Step 6 + Acceptance (line 1104, 1128, 1150) đều cover DN VNeID Tổ chức. FR-VIII-25 Tác nhân (line 1204) bao gồm DN đầy đủ. → FR-VIII-23 thiếu DN trong list tác nhân.

### Các bước tái hiện

1. Mở SRS line 1106 (Tác nhân FR-VIII-23): "TVV, CG, NHT"
2. Mở line 1128 (Step 6): "DN: mã số thuế + người đại diện; Cá nhân: CCCD..."
3. Mở line 1150 (Acceptance): "Given DN đã đồng bộ VNeID Tổ chức..."

### Kết quả mong đợi

- Tác nhân FR-VIII-23 = "DN, TVV, CG, NHT" (giống FR-VIII-25).

### Kết quả thực tế

- Thiếu DN. Test case sẽ confused: DN có được test FR-VIII-23 không?

### Bằng chứng

3 quote ở 3 line đã liệt kê.

---

## BUG-SRS-FR10-010 — SCR-VIII-08a tồn tại nhưng FR-VIII-22 đã bypass

### Mô tả

FR-VIII-22 Step 7 (line 1061) ghi DN bypass CHO_PHAN_QUYEN. SCR-VIII-08a "QTHT phê duyệt TK đăng ký" (line 1776-1791) là UI để QTHT duyệt TK ở CHO_PHAN_QUYEN — nay không còn DN ở state này. UI dead code. CHANGELOG Q2 (line 1300) nhận biết: "SCR-VIII-08a còn dùng được?" — pending BA chốt.

### Các bước tái hiện

1. Đọc FR-VIII-22 Step 7: DN bypass CHO_PHAN_QUYEN
2. Đọc SCR-VIII-08a (line 1776-1791): UI duyệt TK ở CHO_PHAN_QUYEN
3. Quan sát: không có actor nào dẫn TK vào CHO_PHAN_QUYEN (xem BUG-SRS-FR10-003) → SCR-VIII-08a không có data

### Kết quả mong đợi

- BA chốt: xóa SCR-VIII-08a khỏi SRS (nếu CHO_PHAN_QUYEN không còn dùng) HOẶC giữ + chỉ định actor migrate TK.

### Kết quả thực tế

- SRS giữ SCR-VIII-08a nhưng không có scenario test.

### Bằng chứng

**Quote — SCR-VIII-08a header line 1776-1781:**

```
### SCR-VIII-08a: QTHT Phe duyet TK Dang ky
**Loai man hinh:** Danh sach + Modal phe duyet
**FR su dung:** FR-VIII-22
```

---

## BUG-SRS-FR10-011 — SM-TAIKHOAN diagram (7 transitions) vs bảng (11 transitions)

### Mô tả

Mermaid diagram (line 2086-2096) vẽ 7 mũi tên transitions. Bảng chuyển trạng thái (line 2110-2122) liệt kê **11 dòng** transitions. 4 transitions có trong bảng nhưng KHÔNG có trong diagram: (1) `CHO_KICH_HOAT → VO_HIEU_HOA auto 7 ngày`; (2) `HOAT_DONG → TAM_KHOA QTHT khóa thủ công`; (3) `TAM_KHOA → HOAT_DONG auto 30 phút`; (4) `CHO_KICH_HOAT → HOAT_DONG direct (DN bypass)`. Test theo bảng (per memory rule `feedback_test_plan_check_sm_table`) — diagram chỉ là minh họa.

### Các bước tái hiện

1. Mở SRS line 2086-2096 (mermaid diagram): đếm 7 `-->`
2. Mở line 2110-2122 (bảng): đếm 11 dòng transition

### Kết quả mong đợi

- Diagram đầy đủ 11 transitions matching bảng.

### Kết quả thực tế

- Diagram thiếu 4 transitions. Người đọc chỉ nhìn diagram sẽ miss test path.

### Bằng chứng

**Quote 1 — Diagram line 2086-2096:** 7 mũi tên (count visible).

**Quote 2 — Bảng line 2110-2122:** 11 dòng (count visible).

---

## Phụ lục A — 10 câu hỏi BA cần chốt

> **Mục đích:** clear ambiguity + unblock 3 FR mới (Tier 2 trong test plan FR-10). 3 câu HARD BLOCK + 7 câu doc clarification.

### Hard block (chặn test 3 FR mới)

| # | Bug ref | Câu hỏi |
|---|---|---|
| Q1 | BUG-SRS-FR10-001 | NGAY_LE — single date + năm + loại HAY date range + lap_lai_hang_nam? Use case "Tết 5 ngày" seed 1 record range hay 5 record single? |
| Q2 | BUG-SRS-FR10-002 | DM TINH_THANH — system seed once (DDL init 63 tỉnh GSO) HAY thêm tab CRUD vào SCR-VIII-01 (14 tab tổng)? |
| Q3 | BUG-SRS-FR10-003 | Sau DN bypass CHO_PHAN_QUYEN, scenario nào còn trigger transition #2 (CHO_KICH_HOAT → CHO_PHAN_QUYEN) và #3 (CHO_PHAN_QUYEN → HOAT_DONG)? Hoặc giữ làm dead state cho admin migration? |

### Doc clarification (không block, log để BA chốt khi rảnh)

| # | Bug ref | Câu hỏi |
|---|---|---|
| Q4 | BUG-SRS-FR10-004 | AUDIT_LOG export limit — 10K (FR-VIII-28) hay 50K (SCR-VIII-10)? |
| Q5 | BUG-SRS-FR10-005 | CAU_HINH_SLA quá hạn nghiêm trọng — `qua_han_he_so 2.0` hay `qua_han_phan_tram 100/200`? Đồng bộ field name + đơn vị 3 nguồn. |
| Q6 | BUG-SRS-FR10-006 | SM bảng dòng `CHO_KICH_HOAT → HOAT_DONG QTHT kích hoạt` — sửa FR Ref `FR-VIII-18` thành `FR-VIII-15` hay `FR-VIII-26`? |
| Q7 | BUG-SRS-FR10-007 | FR-VIII-22 Postcondition placeholder `FR-VIII-XX` thay thành `FR-VIII-26`? |
| Q8 | BUG-SRS-FR10-008 | FR-VIII-22 Acceptance đếm "19 DN" sửa thành "18 DN"? |
| Q9 | BUG-SRS-FR10-009 | FR-VIII-23 Tác nhân — bổ sung DN vào list "TVV, CG, NHT, **DN**"? |
| Q10 | BUG-SRS-FR10-010 | SCR-VIII-08a — xóa hay giữ? (phụ thuộc Q3 — nếu CHO_PHAN_QUYEN không còn dùng thì xóa) |

---

## Phụ lục B — Môi trường

| Thành phần | Giá trị |
|------------|---------|
| File SRS chính | [`input/srs-update-2026-5-5/srs-fr-10-quan-tri.md`](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md) (2.285 dòng) |
| CHANGELOG | [`input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md`](../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) §FR-10 line 1129-1322 |
| Delta map | [`input/srs-update-2026-5-5/_DELTA-MAP-FR10.md`](../../../../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md) |
| 2-source verify | NotebookLM HTPLDN id `e3a2681b-fdd6-4a24-917c-9ed636e8a110` (chưa query — local SRS đủ làm chuẩn cho 11 bug này) |
| Tool review | Claude Code SRS deep review (manual cross-reference) |

---

*Bug report generated: 2026-05-06 | QA Automation via Claude Code | Round 7*
