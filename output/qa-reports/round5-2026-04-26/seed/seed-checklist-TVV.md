# Seed Checklist — Tư vấn viên (T1.B3 — full pool 12)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-26 23:13–23:25 (chính [1..6]) + 2026-04-27 00:30–01:00 (bổ sung [7..12]) • **Tài khoản:** `cb_nv_tw_01`
**Trạng thái mong đợi:** `Mới đăng ký`
**Màn:** SCR-IV-01/02 • **Đường dẫn:** `/chuyen-gia-tvv/danh-sach` + `/chuyen-gia-tvv/tao-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > tvv_variants 12 record](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-IV-01](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md)

---

## Kết quả: ✅ XONG 12/12 (10 NEW Round 5 + 2 reuse Round 4)

Tab "Mới đăng ký" hiện 12 record TVV-BTP-TW-{0006/0008..0018}. 2 reuse R4 (TVV-0006 Vũ Văn Sáu + TVV-0008 Hương). 10 NEW R5: 4 record [1..6] (TVV-0009..0012) + 6 record [7..12] (TVV-0013..0018).

**Bug:** 0 bug Major mới. 3 observation (gender enum raw, multi-LV detail render thiếu, dropdown LV cap 10).

---

## Bảng dữ liệu seed — đầy đủ 12 variant

### Pool [1..6] — happy path (6 lĩnh vực PL chính)

| # | Mã TVV | Họ tên | Ngày sinh | LV chọn (form) | Tổ chức | Trạng thái | Có vào kho? |
|---|--------|--------|:--:|---|---|:--:|:---:|
| 1 | TVV-BTP-TW-0009 | Trần Thị Tư Vấn | 15/03/1985 | Thuế + KDTM | Trung tâm | Mới đăng ký | ✅ NEW |
| 2 | TVV-BTP-TW-0010 | Lê Cao Gia | 20/07/1980 | SHTT + KDTM | Trung tâm | Mới đăng ký | ✅ NEW |
| 3 | TVV-BTP-TW-0011 | Phạm Đại Tài | 12/11/1978 | SHTT + Đất đai | Trung tâm | Mới đăng ký | ✅ NEW |
| 4 | TVV-BTP-TW-0012 | Hoàng Thị Năm | 08/04/1990 | SHTT | Chi nhánh | Mới đăng ký | ✅ NEW |
| 5 | TVV-BTP-TW-0008 | Hương | (R4) | Dân sự + Đất đai + Hành chính + 2 | Chi nhánh | Mới đăng ký | ✅ reuse R4 |
| 6 | TVV-BTP-TW-0006 | Vũ Văn Sáu | (R4) | Đất đai | Trung tâm | Mới đăng ký | ✅ reuse R4 |

### Pool [7..12] — edge case (reject/TAM_DUNG/3 cấp/CG/soft-delete/multi-region)

| # | Mã TVV | Họ tên | Ngày sinh | LV (form) | Trình độ | Scenario | Có vào kho? |
|---|--------|--------|:--:|---|:--:|---|:---:|
| 7 | TVV-BTP-TW-0013 | Đỗ Văn Bảy | 08/04/1995 | Lao động | Cử nhân | Reject path — hồ sơ thiếu chứng chỉ → test YEU_CAU_BS / TU_CHOI ở A1 | ✅ NEW |
| 8 | TVV-BTP-TW-0014 | Bùi Thị Tám | 25/12/1982 | Thuế (chỉ 1) | Tiến sĩ | TAM_DUNG path — sau advance DANG_HOAT_DONG sẽ toggle TAM_DUNG | ✅ NEW |
| 9 | TVV-BTP-TW-0015 | Phan Văn Chín | 14/08/1985 | KDTM (chỉ 1) | Thạc sĩ | Scope ĐP-HP — test data isolation cấp ĐP | ✅ NEW |
| 10 | TVV-BTP-TW-0016 | Hà Thị Mười | 20/03/1980 | Đất đai | Tiến sĩ | CG-only — test phân biệt vai_tro CG vs TVV (UI form không có toggle CG/TVV → BE default TVV) | ✅ NEW |
| 11 | TVV-BTP-TW-0017 | Trịnh Văn Mười Một | 30/06/1992 | Thuế | Cử nhân | Soft-delete OK — TVV không gắn VV để test xóa thành công | ✅ NEW |
| 12 | TVV-BTP-TW-0018 | Cao Thị Mười Hai | 11/11/1976 | SHTT + KDTM | Tiến sĩ | Multi-region — test pagination dropdown gợi ý đa lĩnh vực (UI chỉ chọn được 2/3 LV fixture do dropdown cap 10) | ✅ NEW |

**Tổng:** 12/12 vào kho · 0 chặn · 100% pool fixture v2.5

**Note tab "Đang hoạt động":** 1 record TVV-BTP-TW-0001 (Nguyễn Văn Tư Vấn) — ready cho A1 workflow chuyển state.

---

## Observations (không log bug — không có SRS clause cứng)

1. **Gender hiển thị raw enum trên detail view:** "NU" / "NAM" thay vì label "Nữ" / "Nam" (consistent regression Round 4 minor).
2. **Detail view "Lĩnh vực" chỉ render 1 LV của multi-select:** TVV[1] Trần TV chọn Thuế+KDTM → detail show "Thuế". TVV[2] Lê Cao Gia chọn SHTT+KDTM → detail show "Sở hữu trí tuệ". → BE có thể lưu đủ multi-LV (verify được trên list page TVV-0008 show 5 LV) nhưng FE detail render lỗi.
3. **Dropdown LV trong form Tạo TVV cap 10/12:** TVV[10] Hà Thị Mười fixture cần "DAT_DAI + DOANH_NGHIEP" — chỉ chọn được Đất đai (DOANH_NGHIEP missing trong dropdown). TVV[12] Cao Thị Mười Hai fixture cần "SHTT + HOP_DONG + DOANH_NGHIEP" — chỉ chọn được SHTT + KDTM. → Cùng pattern BUG-QTHT-003 (regression cross-round 6th time).
4. **Form không có toggle "vai_tro CG vs TVV":** TVV[10] fixture đề xuất `vai_tro_dac_biet=CG` nhưng UI chỉ tạo TVV (default). Cần BA confirm: có support tạo CG trực tiếp ở form này không hay phải qua màn riêng?

---

## Sample IDs cho downstream

**Pool [1..6]** dùng cho A1 SM-TVV happy path (advance qua DANG_HOAT_DONG).
**Pool [7..12]** dùng cho edge case test ở A1 + P4:
- TVV-0013 (Đỗ Văn Bảy) → A1 reject path test
- TVV-0014 (Bùi Thị Tám) → A1 advance + manual TAM_DUNG toggle
- TVV-0015 (Phan Văn Chín, ĐP-HP) → P5 cross-module DI permission ĐP scope
- TVV-0016 (Hà Thị Mười, ĐP-DN) → cùng — note vai_tro CG ngoài SRS
- TVV-0017 (Trịnh Văn 11) → soft-delete cascade-check
- TVV-0018 (Cao Thị 12, multi-region) → pagination dropdown phân công đa lĩnh vực

---

## Ảnh chụp

- [Tab Mới đăng ký 6 record (T1.B3 chính)](../screenshots/seed-tvv/tvv-moi-dang-ky-6-record.png)
- [Tab Mới đăng ký 12 record (sau seed [7..12])](../screenshots/seed-tvv/tvv-moi-dang-ky-12-record.png)

---

## §B3b — T1.B3b Seed 6 CG cover 6 lĩnh vực — 2026-04-29 00:18

**Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Mới đăng ký` • **Loại:** `CG` (Chuyên gia)
**Màn:** SCR-IV-02 form Tạo TVV • **Đường dẫn:** `/chuyen-gia-tvv/tao-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > tvv_variants index 13-18](../../../../input/data/seed-fixture.yaml#L732-L864)
**SRS:** [FR-IV-01 + §3.4.3.4 line 1272 enum `loai_tvv IN (TVV,CG,NHT)`](../../../../input/srs-v3/srs-fr-04-chuyen-gia-tvv.md)

### Kết quả: ✅ XONG 6/6

Seed 6 CG cover đủ 6 lĩnh vực fixture (DOANH_NGHIEP / HOP_DONG / LAO_DONG / THUE / SHTT / DAT_DAI). Form Tạo TVV có toggle "Loại" 3 enum (TVV/CG/NHT) match SRS — fix gap R5 Obs#4 cũ (form chỉ default TVV).

**Bug:** 0.

### Bảng dữ liệu seed

| # | Mã TVV | Họ tên | Loại | Lĩnh vực (UI) | Tổ chức | Địa bàn | Trạng thái |
|---|--------|--------|:--:|---|---|:--:|:--:|
| 1 | TVV-BTP-TW-0021 | Lý Thị Mười Ba | CG | Doanh nghiệp | Trung tâm trợ giúp pháp lý | Hà Nội | Mới đăng ký |
| 2 | TVV-BTP-TW-0022 | Đinh Văn Mười Bốn | CG | Kinh doanh thương mại (≈HOP_DONG) | Trung tâm | Hà Nội | Mới đăng ký |
| 3 | TVV-BTP-TW-0023 | Ngô Thị Mười Lăm | CG | Lao động | Trung tâm | Hà Nội | Mới đăng ký |
| 4 | TVV-BTP-TW-0024 | Trương Văn Mười Sáu | CG | Thuế | Trung tâm | Hà Nội | Mới đăng ký |
| 5 | TVV-BTP-TW-0025 | Mai Thị Mười Bảy | CG | Sở hữu trí tuệ | Trung tâm | Hà Nội | Mới đăng ký |
| 6 | TVV-BTP-TW-0026 | Hồ Văn Mười Tám | CG | Đất đai | Trung tâm | Hà Nội | Mới đăng ký |

**Note LV `HOP_DONG`:** DB không có code này (verified seed-checklist-QTHT.md §a) → fallback "Kinh doanh thương mại" (KINH_DOANH_TM) là LV gần nhất, accept theo R5 lesson.

**Workflow advance** (ngoài scope T1.B3b): Pool 6 CG hiện tại là `Mới đăng ký`. Cần A1 advance (CB NV thẩm định → trình duyệt → CB PD phê duyệt) → DANG_HOAT_DONG + la_cong_khai=true để A5 modal Phân công TVCS dùng được.

### Ảnh chụp

- [Tab Mới đăng ký 6 CG mới + 2 TVV cũ](../screenshots/seed-tvv/T1B3b-6-CG-moi-dang-ky.png)

---

## §B3c — T1.B3c Seed 3 NHT cấp ĐP — 2026-04-29 00:32

**Tài khoản:** `cb_nv_tw_02` (fallback theo Rule 7 — primary `cb_nv_tw_01` JWT revoke aggressive sau ~12 phút seed liên tục, OTP rate-limit 400 sau retry)
**Trạng thái mong đợi:** `Mới đăng ký` • **Loại:** `NHT` (Người hỗ trợ pháp lý)
**Màn:** SCR-IV-02 form Tạo TVV • **Đường dẫn:** `/chuyen-gia-tvv/tao-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > tvv_variants index 19-21](../../../../input/data/seed-fixture.yaml#L869-L935)
**SRS:** [srs-v3.md line 201 + 441 NHT NĐ77/2008 + line 458 BR-AUTH-10](../../../../input/srs-v3/srs-v3.md)

### Kết quả: ✅ XONG 3/3

Seed 3 NHT cấp ĐP (AG/DN/HP), mỗi NHT cover 2 lĩnh vực để A3 dropdown VV phân công NHT có gợi ý đa LV.

**Bug:** 0.

### Bảng dữ liệu seed

| # | Mã TVV | Họ tên | Loại | Lĩnh vực (UI) | Tổ chức | Địa bàn | Trạng thái |
|---|--------|--------|:--:|---|---|:--:|:--:|
| 1 | TVV-BTP-TW-0027 | Phùng Thị NHT An Giang | NHT | Doanh nghiệp + Lao động | Tổ chức tham gia trợ giúp pháp lý | An Giang | Mới đăng ký |
| 2 | TVV-BTP-TW-0028 | Lương Văn NHT Đà Nẵng | NHT | Kinh doanh thương mại + Thuế | Tổ chức tham gia | Đà Nẵng | Mới đăng ký |
| 3 | TVV-BTP-TW-0029 | Đào Thị NHT Hải Phòng | NHT | Sở hữu trí tuệ + Đất đai | Tổ chức tham gia | Hải Phòng | Mới đăng ký |

**Note Tổ chức hành nghề:** Dropdown chỉ có 3 option (Trung tâm / Chi nhánh / Tổ chức tham gia trợ giúp pháp lý) — không có "Sở Tư pháp X" như fixture spec. Chọn "Tổ chức tham gia" cho NHT vì NHT thuộc Tổ chức HT PLDN dưới Sở TP NĐ77/2008 — gần nghĩa nhất. Cần BA confirm cấu trúc Tổ chức cho NHT có cần thêm option "Sở Tư pháp" không.

### Observation (không log bug — fixture mismatch UI)

- **Fixture line 878 ghi `to_chuc_chinh_id: "Sở Tư pháp An Giang"`** — UI dropdown hiện 3 option phân loại theo Luật TGPL (không phải tên tổ chức). Theo memory `feedback_fixture_mismatch_not_bug`: KHÔNG log bug. Workaround: chọn "Tổ chức tham gia" + ghi nhận Tổ chức cụ thể qua field "Địa chỉ" (đã ghi đầy đủ "Sở Tư pháp An Giang/Đà Nẵng/Hải Phòng" trong địa chỉ).

### Ảnh chụp

- [Tab Mới đăng ký 11 record: 6 CG + 3 NHT + 2 TVV cũ](../screenshots/seed-tvv/T1B3b-T1B3c-9-record-moi-dang-ky-6CG-3NHT-2TVV-cu.png)

---

*2026-04-26 23:25 + 2026-04-27 01:00 + 2026-04-29 00:18 (B3b) + 2026-04-29 00:32 (B3c) — QA chạy bằng Chrome DevTools MCP*
