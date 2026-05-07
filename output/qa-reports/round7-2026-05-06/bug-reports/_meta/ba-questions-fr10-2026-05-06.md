# Câu hỏi cần BA chốt — SRS FR-10 v3.5 (Quản trị Hệ thống)

| Mục | Giá trị |
|-----|---------|
| **Người hỏi** | QA Team (huongttt) |
| **Người trả lời** | BA |
| **Ngày gửi** | 2026-05-06 |
| **SRS reference** | [`input/srs-update-2026-5-5/srs-fr-10-quan-tri.md`](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md) (v3.5, 2.285 dòng) |
| **CHANGELOG** | [`CHANGELOG-v3-to-v3.5.md §FR-10 line 1129-1322`](../../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) |
| **Tổng số câu** | 11 (3 hard block + 1 mới phát sinh + 7 doc clarification) |
| **Mức độ ảnh hưởng** | 3 hard block CHẶN test 3 FR mới (FR-VIII-22 self-reg DN, FR-VIII-26 quên MK, FR-VIII-29 ngày lễ); Q11 NEW chặn FR-02/05/12 dropdown gợi ý người xử lý |

> **Bối cảnh:** QA đã deep review SRS FR-10 v3.5 + apply 2 quyết định mới của user (2026-05-06): (1) Ngày lễ gộp tab vào Cấu hình HT, (2) Bỏ hẳn tab "Phân công mặc định" + entity `CAU_HINH_PHAN_CONG`. 2 quyết định này **giải quyết DEPLOY-004** (UI vị trí Ngày lễ) nhưng **KHÔNG giải quyết** 11 câu hỏi dưới đây vì các câu liên quan đến **schema entity / actor scenario / cite-pháp-lý** trong SRS — chỉ BA mới có thẩm quyền chốt.
>
> Mỗi câu có: **Vấn đề** (mô tả mâu thuẫn quote SRS line) + **Tác động test** (FR/TC nào bị block) + **Đề xuất phương án** (A/B để BA tick).

---

## A. 3 câu HARD BLOCK — chặn test (cần ưu tiên trả lời sớm)

---

### Q1 — Schema entity `NGAY_LE` (FR-VIII-29)

**Vấn đề:** SRS định nghĩa schema `NGAY_LE` ở **2 chỗ với 2 schema khác nhau**:

| Nguồn | Schema |
|---|---|
| **FR-VIII-29 Inputs** ([line 1397-1404](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1397)) | `ten_ngay_le` (text), **`ngay_bat_dau`** (date), **`ngay_ket_thuc`** (date, range), `mo_ta` (text), **`lap_lai_hang_nam`** (boolean) — **5 cột** |
| **Entity 3.4.3.51 NGAY_LE** ([line 2059-2072](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L2059)) | `id`, **`ngay`** (single date, UNIQUE per năm), **`nam`** (number, CHECK >= 2024), `ten_ngay_le`, **`loai`** (CHECK IN 'NGAY_LE'/'NGHI_BU'/'NGHI_KHAC'), `ghi_chu` — **6 cột** |

**Use case mâu thuẫn — Tết kéo dài 5 ngày:**
- Theo FR Inputs (range): seed **1 record** `ngay_bat_dau=2026-02-09, ngay_ket_thuc=2026-02-13`
- Theo Entity (single): seed **5 records** (1 record/ngày, mỗi record 1 `ngay` riêng)

**Tác động test:**
- Block FR-VIII-29 CRUD ngày lễ
- Block import Excel template (1 row range vs 5 rows single?)
- Block UI form tab "Ngày lễ" trong Cấu hình HT (form 1 input date range hay 2 input single?)
- R7.1.5 đã PASS seed 15 ngày qua API → DB schema thực tế nhiều khả năng theo entity

**Đề xuất BA chốt 1 phương án:**
- ☐ **(A) Theo Entity 3.4.3.51** — single date + nam + loai + ghi_chu. Sửa FR-VIII-29 Inputs cho khớp. Tết = 5 records.
- ☐ **(B) Theo FR-VIII-29 Inputs** — date range + lap_lai_hang_nam. Sửa entity 3.4.3.51 cho khớp. Tết = 1 record range.
- ☐ **(C) Phương án khác** (BA mô tả): _________________

---

### Q2 — Danh mục `TINH_THANH` có UI CRUD không?

**Vấn đề:**
- FR-VIII-22 Inputs row 5 ([line 1032](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1032)): `tinh_thanh_id` FK → `DANH_MUC(loai='TINH_THANH', mã GSO 01-63 theo QĐ 124/2004/QĐ-TTg)`
- Entity DON_VI ([line 1975](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1975)): cùng FK
- SCR-VIII-01 sidebar ([line 1459](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1459)) liệt kê **13 tab DM** — Lĩnh vực PL / Loại hình HT / Chương trình HT / Tình trạng VV / Cơ quan ĐV / Loại DN / Hồ sơ đề nghị HT / Hồ sơ đề nghị TT / Tiêu chí ĐG hiệu quả / Tiêu chí ĐG chi phí / Loại TK / Loại hình tiếp nhận / Kênh tiếp nhận. **KHÔNG có "Tỉnh/Thành phố"**.

**Tác động test:**
- DN đăng ký FR-VIII-22 cần dropdown 63 tỉnh ở row 5. Nếu DM rỗng → dropdown rỗng → DN không submit được.
- Block toàn bộ Tier 2 self-reg DN (test path FR-VIII-22 happy + boundary).

**Đề xuất BA chốt 1 phương án:**
- ☐ **(A) Thêm tab "Tỉnh/Thành phố"** vào SCR-VIII-01 → 14 tab tổng. QTHT có UI CRUD. Cần SRS bổ sung FR-VIII-XX cho tab này.
- ☐ **(B) DM TINH_THANH system-seeded once** khi deploy DDL (63 tỉnh GSO 01-63). KHÔNG có UI CRUD. Cần SRS ghi rõ ở §4 Entity DON_VI.
- ☐ **(C) Phương án khác** (BA mô tả): _________________

---

### Q3 — Trạng thái `CHO_PHAN_QUYEN` còn dùng cho ai sau khi DN bypass?

**Vấn đề:**
- FR-VIII-22 Step 7 ([line 1061](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1061)): DN tự đăng ký **bypass** CHO_PHAN_QUYEN, đi thẳng `CHO_KICH_HOAT → HOAT_DONG`.
- FR-VIII-26 Step 11 ([line 1285](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1285)): "Nếu TK đang CHO_KICH_HOAT + chưa có vai trò → chuyển CHO_PHAN_QUYEN (**cho luồng self-registration cũ**)".
- SM-TAIKHOAN ([line 2113-2114](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L2113)) vẫn giữ 2 transitions: `CHO_KICH_HOAT → CHO_PHAN_QUYEN` + `CHO_PHAN_QUYEN → HOAT_DONG`.
- CHANGELOG D.2 Q1 ([line 1299](../../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md#L1299)) confirm: "CHO_PHAN_QUYEN còn dùng cho ai sau khi DN bypass? Đề xuất giữ làm dự phòng admin migration; cần BA xác nhận."

**Phân tích các luồng tạo TK hiện có:**

| Luồng tạo TK | Có gán role trước? | Trigger CHO_PHAN_QUYEN? |
|---|:-:|:-:|
| DN tự đăng ký (FR-VIII-22) | ✅ role DN gán sẵn | ❌ bypass |
| QTHT tạo CB nội bộ (FR-VIII-15) | ✅ role gán trước | ❌ bypass |
| FR-IV-07 trigger TVV/CG (sau CB PD duyệt) | ✅ role gán | ❌ bypass |
| FR-IV-NHT-01 trigger NHT | ✅ role gán | ❌ bypass |

→ **Không có actor/workflow nào tạo TK với `vai_tro NULL`** → CHO_PHAN_QUYEN dead state.

**Tác động test:**
- 2 transitions trong SM-TAIKHOAN không có scenario test (#2: CHO_KICH_HOAT → CHO_PHAN_QUYEN, #3: CHO_PHAN_QUYEN → HOAT_DONG).
- Nút "Phân quyền" trong SCR-VIII-03 row 16 (fix C.5 SRS v3.5) — không có data trigger.
- SCR-VIII-08a "QTHT phê duyệt TK đăng ký" — dead UI.

**Đề xuất BA chốt 1 phương án:**
- ☐ **(A) Xóa CHO_PHAN_QUYEN khỏi SM** — giảm SM-TAIKHOAN từ 5 → 4 states. Bỏ 2 transitions. Bỏ nút "Phân quyền" (SCR-VIII-03 row 16). Bỏ SCR-VIII-08a. Đơn giản hóa toàn bộ.
- ☐ **(B) Giữ CHO_PHAN_QUYEN làm dự phòng** + chỉ định actor cụ thể trigger (vd: admin migration TK cũ thiếu role, hoặc CB NV tạo TK manual không gán role ngay). Cần SRS bổ sung scenario rõ ràng.
- ☐ **(C) Phương án khác** (BA mô tả): _________________

---

## B. 1 câu MỚI PHÁT SINH từ user chốt 2026-05-06

---

### Q11 — Cơ chế gợi ý "Người xử lý" sau khi bỏ `CAU_HINH_PHAN_CONG`?

**Bối cảnh:** User chốt 2026-05-06 **bỏ hẳn tab "Phân công mặc định"** + entity `CAU_HINH_PHAN_CONG` + FR-II-NEW-01 deprecated.

**Cross-module impact:** 3 module đang dùng `CAU_HINH_PHAN_CONG` để gợi ý "Người xử lý":

| Module | UC | Field |
|---|---|---|
| **FR-02 Hỏi đáp** | UC15 Phân công | Modal "Người xử lý" → đọc CAU_HINH_PHAN_CONG khớp `linh_vuc_id` |
| **FR-05 Vụ việc** | UC59 Phân công NHT/TVV | Dropdown gợi ý theo lĩnh vực |
| **FR-12 TVCS** | UC147 Phân công CG | Modal gợi ý Top 5 CG |

**Tác động test:**
- Block test workflow phân công ở FR-02/05/12 nếu không có cơ chế gợi ý thay thế.
- Có thể chỉ ảnh hưởng UX (gợi ý) chứ không block functional core (CB NV vẫn chọn manual được).

**Đề xuất BA chốt 1 phương án:**
- ☐ **(A) CB NV chọn manual** — bỏ luôn cơ chế gợi ý, dropdown hiển thị toàn bộ TK đủ điều kiện theo lĩnh vực (TVV/CG/NHT/CB cùng đơn vị, state HOAT_DONG). UX: list dài hơn, không sort theo workload.
- ☐ **(B) Gợi ý theo workload** — system tính `COUNT(record đang xử lý)` per TK, sort tăng dần khi hiển thị dropdown. KHÔNG cần entity riêng. UX: list ngắn hơn, ưu tiên TK ít việc.
- ☐ **(C) Gợi ý theo `linh_vuc_chuyen_mon` của TK** — TVV có field `linh_vuc_pl[]` filter trực tiếp. Cũ nhưng đơn giản.
- ☐ **(D) Phương án khác** (BA mô tả): _________________

---

## C. 7 câu DOC CLARIFICATION — không block test, BA chốt khi rảnh

---

### Q4 — `AUDIT_LOG` export Excel limit

**Vấn đề:** 2 nguồn 2 limit khác nhau:
- FR-VIII-28 Processing bước 6 ([line 1352](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1352)): "max **10.000 dòng**"
- SCR-VIII-10 Quy tắc ([line 1834](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1834)): "max **50.000 dòng** (BR-DATA-06)"

**BA chốt:** ☐ 10K · ☐ 50K · ☐ Khác: _____

---

### Q5 — `CAU_HINH_SLA` "quá hạn nghiêm trọng" — 3 nguồn 3 giá trị + 2 đơn vị

| Nguồn | Field | Giá trị mặc định |
|---|---|---|
| FR-VIII-10 Inputs row 6 ([line 466](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L466)) | `qua_han_phan_tram` | 100 (% thời hạn) |
| SCR-VIII-06 Tab 1 row 10 ([line 1645](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1645)) | "QH nghiêm trọng (%)" | 200 |
| Entity 3.4.3.14 CAU_HINH_SLA ([line 2053](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L2053)) | `qua_han_he_so` | 2.0 (hệ số) |

**BA chốt field name + đơn vị + default:** ☐ `qua_han_he_so 2.0` · ☐ `qua_han_phan_tram 100` · ☐ `qua_han_phan_tram 200` · ☐ Khác: _____

---

### Q6 — SM-TAIKHOAN dòng `CHO_KICH_HOAT → HOAT_DONG QTHT kích hoạt`: FR Ref sai

**Quote SRS line 2115:**
```
| CHO_KICH_HOAT | HOAT_DONG | QTHT kích hoạt (đã gán quyền trực tiếp) | Token hợp lệ | Cho phép đăng nhập | FR-VIII-18 | — |
```

`FR-VIII-18` là "Quản lý DM loại hình tiếp nhận" — không liên quan TK.

**BA chốt:** ☐ Sửa thành `FR-VIII-15` · ☐ Sửa thành `FR-VIII-26` · ☐ Khác: _____

---

### Q7 — FR-VIII-22 Postcondition còn placeholder `FR-VIII-XX`

**Quote SRS line 1083:**
> "DN bấm link kích hoạt + đặt mật khẩu lần đầu (qua **FR-VIII-XX** Quên mật khẩu / Kích hoạt) → TAI_KHOAN chuyển HOAT_DONG"

**BA chốt:** ☐ Sửa thành `FR-VIII-26` · ☐ Khác: _____

---

### Q8 — FR-VIII-22 Acceptance đếm số trường sai

**Quote SRS line 1086:**
> "form đăng ký mở với **21 trường nhập (19 trường thông tin DN + 2 trường mật khẩu) + 1 ô cam kết**"

**Inputs thực tế** ([line 1027-1049](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1027)): 18 DN (#1-18) + 2 password (#19-20) + 1 cam kết (#21) = **21 tổng**.

**BA chốt:** ☐ Sửa Acceptance "19 DN" → "18 DN" · ☐ Khác: _____

---

### Q9 — FR-VIII-23 Tác nhân thiếu DN

**Quote SRS line 1106:**
> "**Tác nhân:** TVV, CG, NHT"

**Mâu thuẫn:** Step 6 ([line 1128](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1128)) + Acceptance ([line 1150](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1150)) đều cover DN VNeID Tổ chức. FR-VIII-25 Tác nhân ([line 1204](../../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md#L1204)) bao gồm DN.

**BA chốt:** ☐ Bổ sung DN: "DN, TVV, CG, NHT" · ☐ Giữ nguyên (DN không được login VNeID Tổ chức — sửa Step 6 + Acceptance) · ☐ Khác: _____

---

### Q10 — SCR-VIII-08a "QTHT phê duyệt TK đăng ký" có còn dùng?

**Vấn đề:** SCR-VIII-08a tồn tại ở SRS line 1776-1791 nhưng FR-VIII-22 bypass CHO_PHAN_QUYEN → không có TK ở state này → SCR-VIII-08a dead UI.

> ⚠️ **Phụ thuộc Q3** — nếu BA chọn (A) xóa CHO_PHAN_QUYEN ở Q3 → SCR-VIII-08a tự động xóa. Nếu (B) giữ → SCR-VIII-08a giữ.

**BA chốt:** ☐ Xóa khỏi SRS (đồng bộ Q3-A) · ☐ Giữ + chỉ định scenario (đồng bộ Q3-B) · ☐ Khác: _____

---

## D. Tóm tắt — Decision matrix BA

| Câu | Loại | Block FR | Phương án mặc định (nếu BA không chốt) |
|---|---|---|---|
| **Q1** | Hard block | FR-VIII-29 | (A) Theo entity 3.4.3.51 (DB đã PASS R7.1.5 với schema này) |
| **Q2** | Hard block | FR-VIII-22 | (B) System seed 63 tỉnh GSO khi deploy |
| **Q3** | Hard block | SM-TAIKHOAN | (A) Xóa CHO_PHAN_QUYEN — đơn giản hóa |
| **Q11** | NEW (cross-module) | FR-02/05/12 | (A) CB NV chọn manual (bỏ gợi ý) |
| Q4-Q10 | Doc clarification | — | Sửa SRS doc cho khớp logic, không impact test |

---

## E. Reference — file QA đã update theo SRS v3.5

QA Team đã sync 11 file QA artifact với SRS FR-10 v3.5 + 2 user-changes 2026-05-06:

1. [bug-report-r7-srs-fr10-inconsistency.md](bug-report-r7-srs-fr10-inconsistency.md) (file gốc 11 SRS bug)
2. [output/smoke/6.10-sm-taikhoan.md](../../../../smoke/6.10-sm-taikhoan.md) (SM 5 states + 11 transitions)
3. [output/funtion/7.10-quan-tri-he-thong.md](../../../../funtion/7.10-quan-tri-he-thong.md) (26 FR + Tier 1/2/3 + 4 tab Cấu hình HT mới)
4. [output/smoke-specs/6.10-smoke-taikhoan.md](../../../../smoke-specs/6.10-smoke-taikhoan.md)
5. [input/quy-trinh-nghiep-vu/02-thu-tu-module.md](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md)
6. [output/test-strategy.md §7.10](../../../../test-strategy.md)
7. [output/permission-matrix.md](../../../../permission-matrix.md) (CAU_HINH_PHAN_CONG deprecated 7 row)
8. [output/permission-matrix-by-fr.md §10](../../../../permission-matrix-by-fr.md) (+NGAY_LE)
9. [output/permission-matrix-by-role.md](../../../../permission-matrix-by-role.md) (FR-II-NEW-01 deprecated 11 row + FR-10 26 FR + UC120-123 renumber)
10. [output/funtion/7.7-quan-ly-doanh-nghiep.md](../../../../funtion/7.7-quan-ly-doanh-nghiep.md) (DN tạo qua FR-VIII-22 self-reg, bỏ Import Excel)
11. [tasks/plan.md v2.6.4](../../../../../tasks/plan.md) + [tasks/todo.md](../../../../../tasks/todo.md)

**Tier 1 stable (FR-VIII-01-21 + FR-VIII-28 read + BR-SLA-02 + DON_VI 2 tầng + password rule)** sẵn sàng test ngay với 31 TC active. **Tier 2 ambiguous (FR-VIII-22 + VIII-26 + VIII-29)** parking chờ BA chốt 3 hard block + Q11.

---

## F. Cách trả lời

Mỗi câu BA chỉ cần:
1. ☑ Tick phương án A/B/C/D
2. (Nếu chọn "Khác") mô tả ngắn 1-2 dòng
3. (Optional) note thêm rationale

**Reply format gợi ý** (copy block dưới + fill):

```
Q1 NGAY_LE schema: ☑ A / ☐ B / ☐ Khác (...)
Q2 TINH_THANH UI: ☐ A / ☑ B / ☐ Khác (...)
Q3 CHO_PHAN_QUYEN: ☑ A / ☐ B / ☐ Khác (...)
Q11 Người xử lý: ☑ A / ☐ B / ☐ C / ☐ D (...)
Q4 AUDIT_LOG: ☐ 10K / ☑ 50K / ☐ Khác (...)
Q5 SLA quá hạn: ☑ qua_han_he_so 2.0 / ☐ qua_han_phan_tram 100 / ☐ 200 / ☐ Khác (...)
Q6 SM line 2115 FR Ref: ☑ FR-VIII-15 / ☐ FR-VIII-26 / ☐ Khác (...)
Q7 Postcondition placeholder: ☑ FR-VIII-26 / ☐ Khác (...)
Q8 Acceptance đếm: ☑ Sửa "19 DN" → "18 DN" / ☐ Khác (...)
Q9 FR-VIII-23 Tác nhân: ☑ Bổ sung DN / ☐ Giữ / ☐ Khác (...)
Q10 SCR-VIII-08a: ☑ Xóa (sync Q3-A) / ☐ Giữ / ☐ Khác (...)
```

---

*Tổng hợp: QA Team 2026-05-06. File self-contained — BA không cần mở file khác để trả lời.*
